// ─── CREATE TABLE, MySQL in, SQLite out ───────────────────────────────────
// Parses a MySQL CREATE TABLE and writes a SQLite STRICT table that refuses
// the same rows MySQL 8 (strict mode) would refuse: text that is too long,
// numbers out of range, invalid dates, values not in an ENUM, a bad foreign
// key. Each of those rules is a named CHECK, so the error mapper can turn
// SQLite's "CHECK constraint failed: sb|len|name|30" back into MySQL's
// "Data too long for column 'name' at row 1".
//
// Text columns use COLLATE NOCASE, because MySQL's default collation is
// case-insensitive: WHERE name = 'flat white' finds 'Flat White' in MySQL,
// and it has to here too.

import { kw, nameOf, solid, type Token } from './sqlText';

/** Re-emit solid tokens with spaces between them, so words don't run together. */
const emit = (t: Token[]) => t.map(x => x.out).join(' ');

export type BaseType =
  | 'int' | 'decimal' | 'float' | 'char' | 'text' | 'date' | 'datetime' | 'time' | 'year' | 'enum' | 'blob';

export interface ColMeta {
  name: string;
  /** How DESCRIBE shows it, e.g. varchar(30), decimal(6,2), int. */
  type: string;
  base: BaseType;
  len?: number;
  precision?: number;
  scale?: number;
  unsigned?: boolean;
  notNull: boolean;
  autoInc: boolean;
  default?: string | null;
  enumValues?: string[];
}

export interface FkMeta {
  cols: string[];
  refTable: string;
  refCols: string[];
  onDelete: string;
  onUpdate: string;
}

export interface TableMeta {
  name: string;
  columns: ColMeta[];
  pk: string[];
  uniques: string[][];
  fks: FkMeta[];
  userChecks: string[];
}

export class DdlError extends Error {
  constructor(public code: number, message: string, public plain: string) {
    super(message);
  }
}

const INT_RANGE: Record<string, [number, number, number]> = {
  // signed lo, signed hi, unsigned hi
  tinyint: [-128, 127, 255],
  smallint: [-32768, 32767, 65535],
  mediumint: [-8388608, 8388607, 16777215],
  int: [-2147483648, 2147483647, 4294967295],
  integer: [-2147483648, 2147483647, 4294967295],
  bigint: [-9223372036854775808, 9223372036854775807, 18446744073709551615],
};

const q = (s: string) => `"${s.replace(/"/g, '""')}"`;

/** Split tokens on top-level commas. */
function splitTop(tokens: Token[]): Token[][] {
  const parts: Token[][] = [];
  let cur: Token[] = [];
  let depth = 0;
  for (const t of tokens) {
    if (t.value === '(' && t.type === 'punct') depth++;
    if (t.value === ')' && t.type === 'punct') depth--;
    if (depth === 0 && t.type === 'punct' && t.value === ',') {
      parts.push(cur);
      cur = [];
    } else cur.push(t);
  }
  if (cur.length) parts.push(cur);
  return parts;
}

/** Given tokens starting at '(', return [inside tokens, index after ')']. */
function paren(t: Token[], i: number): [Token[], number] {
  if (t[i]?.value !== '(') throw syntax(t[i]);
  let depth = 0;
  for (let j = i; j < t.length; j++) {
    if (t[j].type === 'punct' && t[j].value === '(') depth++;
    if (t[j].type === 'punct' && t[j].value === ')') {
      depth--;
      if (depth === 0) return [t.slice(i + 1, j), j + 1];
    }
  }
  throw new DdlError(1064, "You have an error in your SQL syntax; a bracket is never closed", 'A bracket ( is opened but never closed.');
}

function syntax(t: Token | undefined) {
  const near = t ? t.value : 'the end';
  return new DdlError(
    1064,
    `You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '${near}'`,
    `SQL got confused near "${near}". Look for a missing comma, bracket or a typo just before it.`,
  );
}

function nameList(tokens: Token[]): string[] {
  return splitTop(tokens).map(p => {
    const s = solid(p);
    const n = nameOf(s[0]);
    if (!n) throw syntax(s[0]);
    return n;
  });
}

export interface ParsedCreate {
  meta: TableMeta;
  ifNotExists: boolean;
  /** SQLite statements to run, in order: the table, then any triggers. */
  sqlite: string[];
}

/**
 * Parse `CREATE TABLE ...` (already split into tokens). `tableExists` lets the
 * parser check foreign-key targets the way MySQL does at creation time.
 */
export function parseCreateTable(
  all: Token[],
  lookup: (name: string) => TableMeta | null,
): ParsedCreate {
  const t = solid(all);
  let i = 2; // CREATE TABLE
  if (kw(t[0]) === 'CREATE' && kw(t[1]) === 'TEMPORARY') i = 3;
  let ifNotExists = false;
  if (kw(t[i]) === 'IF' && kw(t[i + 1]) === 'NOT' && kw(t[i + 2]) === 'EXISTS') {
    ifNotExists = true;
    i += 3;
  }
  let name = nameOf(t[i]);
  if (!name) throw syntax(t[i]);
  i++;
  // db.table
  if (t[i]?.value === '.' ) {
    name = nameOf(t[i + 1]);
    if (!name) throw syntax(t[i + 1]);
    i += 2;
  }
  if (kw(t[i]) === 'AS' || kw(t[i]) === 'SELECT' || kw(t[i]) === 'LIKE') {
    throw new DdlError(0, 'Not supported in this sandbox', 'This sandbox only builds tables from a column list: CREATE TABLE name ( ... ).');
  }
  if (t[i]?.value !== '(') throw syntax(t[i]);
  const [body] = paren(t, i);
  // Anything after the closing bracket is table options (ENGINE=InnoDB …): ignored.

  const meta: TableMeta = { name, columns: [], pk: [], uniques: [], fks: [], userChecks: [] };
  const colSql: { col: string; sqliteType: string; extra: string[]; checks: string[] }[] = [];
  const tableSql: string[] = [];
  const triggers: string[] = [];
  let checkNo = 0;
  const colPkFlags: string[] = [];

  const parts = splitTop(body).map(solid).filter(p => p.length);
  if (parts.length === 0) {
    throw new DdlError(4028, 'A table must have at least 1 column', 'A table needs at least one column inside the brackets.');
  }

  for (const p of parts) {
    let j = 0;
    let cname: string | null = null;
    if (kw(p[0]) === 'CONSTRAINT') {
      cname = nameOf(p[1]);
      j = cname && !['PRIMARY', 'UNIQUE', 'FOREIGN', 'CHECK'].includes(kw(p[1])) ? 2 : 1;
      if (j === 1) cname = null;
    }
    const head = kw(p[j]);

    if (head === 'PRIMARY' && kw(p[j + 1]) === 'KEY') {
      const [cols] = paren(p, j + 2);
      if (meta.pk.length) throw new DdlError(1068, 'Multiple primary key defined', 'A table can only have one PRIMARY KEY.');
      meta.pk = nameList(cols);
      continue;
    }
    if (head === 'UNIQUE') {
      let k = j + 1;
      if (kw(p[k]) === 'KEY' || kw(p[k]) === 'INDEX') k++;
      if (p[k]?.value !== '(') k++; // index name
      const [cols] = paren(p, k);
      meta.uniques.push(nameList(cols));
      continue;
    }
    if (head === 'KEY' || head === 'INDEX') continue; // plain indexes change nothing we can see
    if (head === 'FOREIGN' && kw(p[j + 1]) === 'KEY') {
      let k = j + 2;
      if (p[k]?.value !== '(') k++;
      const [cols, after] = paren(p, k);
      meta.fks.push(parseReferences(p, after, nameList(cols), lookup, name));
      continue;
    }
    if (head === 'CHECK') {
      const [expr] = paren(p, j + 1);
      checkNo++;
      const cn = cname ?? `${name}_chk_${checkNo}`;
      meta.userChecks.push(cn);
      tableSql.push(`CONSTRAINT ${q(`sb|user|${cn}`)} CHECK (${emit(expr)})`);
      continue;
    }

    // ── A column ──
    const col = nameOf(p[0]);
    if (!col) throw syntax(p[0]);
    if (meta.columns.some(c => c.name.toLowerCase() === col.toLowerCase())) {
      throw new DdlError(1060, `Duplicate column name '${col}'`, `There are two columns called ${col}. Each column needs its own name.`);
    }
    const typeWord = kw(p[1]).toLowerCase();
    if (!typeWord) throw syntax(p[1]);
    let k = 2;
    let args: string[] = [];
    let argTokens: Token[] = [];
    if (p[k]?.value === '(') {
      const [inner, after] = paren(p, k);
      argTokens = inner;
      args = splitTop(inner).map(a => solid(a).map(x => x.value).join(''));
      k = after;
    }
    // DOUBLE PRECISION, CHARACTER VARYING
    if (typeWord === 'double' && kw(p[k]) === 'PRECISION') k++;

    const c: ColMeta = { name: col, type: typeWord, base: 'text', notNull: false, autoInc: false };
    let sqliteType = 'TEXT';
    const checks: string[] = [];
    const cq = q(col);

    if (kw(p[k]) === 'UNSIGNED') {
      c.unsigned = true;
      k++;
    }
    if (kw(p[k]) === 'ZEROFILL') k++;
    if (kw(p[k]) === 'SIGNED') k++;

    switch (typeWord) {
      case 'tinyint': case 'smallint': case 'mediumint': case 'int': case 'integer': case 'bigint': {
        c.base = 'int';
        const tn = typeWord === 'integer' ? 'int' : typeWord;
        c.type = tn + (c.unsigned ? ' unsigned' : '');
        if (tn === 'tinyint' && args[0] === '1') c.type = 'tinyint(1)';
        sqliteType = 'INT';
        const [lo, hi, uhi] = INT_RANGE[typeWord];
        if (typeWord !== 'bigint') {
          checks.push(`CONSTRAINT ${q(`sb|range|${col}`)} CHECK (${cq} BETWEEN ${c.unsigned ? 0 : lo} AND ${c.unsigned ? uhi : hi})`);
        } else if (c.unsigned) {
          checks.push(`CONSTRAINT ${q(`sb|range|${col}`)} CHECK (${cq} >= 0)`);
        }
        break;
      }
      case 'bool': case 'boolean':
        c.base = 'int';
        c.type = 'tinyint(1)';
        sqliteType = 'INT';
        checks.push(`CONSTRAINT ${q(`sb|range|${col}`)} CHECK (${cq} BETWEEN -128 AND 127)`);
        break;
      case 'decimal': case 'numeric': case 'dec': case 'fixed': {
        c.base = 'decimal';
        const prec = args[0] ? parseInt(args[0], 10) : 10;
        const scale = args[1] ? parseInt(args[1], 10) : 0;
        if (scale > prec) {
          throw new DdlError(1427, `For float(M,D), double(M,D) or decimal(M,D), M must be >= D (column '${col}').`, `In DECIMAL(${prec},${scale}) the first number must be the bigger one: total digits, then digits after the point.`);
        }
        c.precision = prec;
        c.scale = scale;
        c.type = `decimal(${prec},${scale})` + (c.unsigned ? ' unsigned' : '');
        sqliteType = 'REAL';
        const max = Math.pow(10, prec - scale);
        checks.push(
          `CONSTRAINT ${q(`sb|range|${col}`)} CHECK (abs(round(${cq}, ${scale})) < ${max}${c.unsigned ? ` AND ${cq} >= 0` : ''})`,
        );
        triggers.push(
          `CREATE TRIGGER ${q(`sb_round_${name}_${col}_i`)} AFTER INSERT ON ${q(name)} WHEN NEW.${cq} IS NOT NULL BEGIN UPDATE ${q(name)} SET ${cq} = round(NEW.${cq} + (CASE WHEN NEW.${cq} < 0 THEN -1e-9 ELSE 1e-9 END), ${scale}) WHERE rowid = NEW.rowid; END`,
          `CREATE TRIGGER ${q(`sb_round_${name}_${col}_u`)} AFTER UPDATE OF ${cq} ON ${q(name)} WHEN NEW.${cq} IS NOT NULL BEGIN UPDATE ${q(name)} SET ${cq} = round(NEW.${cq} + (CASE WHEN NEW.${cq} < 0 THEN -1e-9 ELSE 1e-9 END), ${scale}) WHERE rowid = NEW.rowid; END`,
        );
        break;
      }
      case 'float': case 'double': case 'real':
        c.base = 'float';
        c.type = typeWord + (args.length ? `(${args.join(',')})` : '');
        sqliteType = 'REAL';
        if (c.unsigned) checks.push(`CONSTRAINT ${q(`sb|range|${col}`)} CHECK (${cq} >= 0)`);
        break;
      case 'char': case 'varchar': case 'nchar': case 'nvarchar': {
        c.base = 'char';
        if (typeWord.endsWith('varchar') && !args[0]) {
          throw new DdlError(
            1064,
            `You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '${p[k]?.value ?? ''}'`,
            `VARCHAR needs a maximum length, like VARCHAR(30).`,
          );
        }
        const len = args[0] ? parseInt(args[0], 10) : 1;
        c.len = len;
        c.type = `${typeWord.endsWith('varchar') ? 'varchar' : 'char'}(${len})`;
        sqliteType = 'TEXT';
        checks.push(`CONSTRAINT ${q(`sb|len|${col}|${len}`)} CHECK (length(${cq}) <= ${len})`);
        break;
      }
      case 'text': case 'tinytext': case 'mediumtext': case 'longtext':
        c.base = 'text';
        c.type = typeWord;
        if (typeWord === 'tinytext') checks.push(`CONSTRAINT ${q(`sb|len|${col}|255`)} CHECK (length(${cq}) <= 255)`);
        if (typeWord === 'text') checks.push(`CONSTRAINT ${q(`sb|len|${col}|65535`)} CHECK (length(${cq}) <= 65535)`);
        break;
      case 'date':
        c.base = 'date';
        c.type = 'date';
        checks.push(`CONSTRAINT ${q(`sb|date|${col}`)} CHECK (date(${cq}) = ${cq})`);
        break;
      case 'datetime': case 'timestamp':
        c.base = 'datetime';
        c.type = typeWord;
        checks.push(`CONSTRAINT ${q(`sb|date|${col}`)} CHECK (datetime(${cq}) IS NOT NULL)`);
        break;
      case 'time':
        c.base = 'time';
        c.type = 'time';
        checks.push(`CONSTRAINT ${q(`sb|date|${col}`)} CHECK (time(${cq}) IS NOT NULL)`);
        break;
      case 'year':
        c.base = 'year';
        c.type = 'year';
        sqliteType = 'INT';
        checks.push(`CONSTRAINT ${q(`sb|range|${col}`)} CHECK (${cq} BETWEEN 1901 AND 2155)`);
        break;
      case 'enum': case 'set': {
        c.base = 'enum';
        const values = argTokens.filter(x => x.type === 'string').map(x => x.value);
        c.enumValues = values;
        c.type = `${typeWord}(${values.map(v => `'${v}'`).join(',')})`;
        if (typeWord === 'enum') {
          checks.push(`CONSTRAINT ${q(`sb|enum|${col}`)} CHECK (${cq} IN (${values.map(v => `'${v.replace(/'/g, "''")}'`).join(', ')}))`);
        }
        break;
      }
      case 'blob': case 'tinyblob': case 'mediumblob': case 'longblob': case 'binary': case 'varbinary':
        c.base = 'blob';
        c.type = typeWord;
        sqliteType = 'BLOB';
        break;
      case 'json':
        c.base = 'text';
        c.type = 'json';
        break;
      default:
        throw syntax(p[1]);
    }

    const extra: string[] = [];
    // Column modifiers, in any order.
    while (k < p.length) {
      const w = kw(p[k]);
      if (w === 'NOT' && kw(p[k + 1]) === 'NULL') {
        c.notNull = true;
        k += 2;
      } else if (w === 'NULL') {
        k++;
      } else if (w === 'AUTO_INCREMENT' || w === 'AUTOINCREMENT') {
        c.autoInc = true;
        k++;
      } else if (w === 'PRIMARY' && kw(p[k + 1]) === 'KEY') {
        colPkFlags.push(col);
        k += 2;
      } else if (w === 'KEY') {
        colPkFlags.push(col);
        k++;
      } else if (w === 'UNIQUE') {
        meta.uniques.push([col]);
        k++;
        if (kw(p[k]) === 'KEY') k++;
      } else if (w === 'DEFAULT') {
        k++;
        const d = p[k];
        if (!d) throw syntax(d);
        if (d.value === '(') {
          const [inner, after] = paren(p, k);
          extra.push(`DEFAULT (${emit(inner)})`);
          c.default = emit(inner);
          k = after;
        } else if (d.value === '-' || d.value === '+') {
          const num = p[k + 1];
          extra.push(`DEFAULT ${d.value}${num?.out ?? ''}`);
          c.default = `${d.value}${num?.value ?? ''}`;
          k += 2;
        } else if (kw(d) === 'CURRENT_TIMESTAMP' || kw(d) === 'NOW' || kw(d) === 'LOCALTIMESTAMP') {
          extra.push(`DEFAULT CURRENT_TIMESTAMP`);
          c.default = 'CURRENT_TIMESTAMP';
          k++;
          if (p[k]?.value === '(') k = paren(p, k)[1];
        } else if (kw(d) === 'TRUE' || kw(d) === 'FALSE') {
          extra.push(`DEFAULT ${kw(d) === 'TRUE' ? 1 : 0}`);
          c.default = kw(d) === 'TRUE' ? '1' : '0';
          k++;
        } else if (kw(d) === 'NULL') {
          c.default = null;
          k++;
        } else if (d.type === 'string' || d.type === 'number') {
          extra.push(`DEFAULT ${d.out}`);
          c.default = d.value;
          k++;
        } else {
          throw syntax(d);
        }
      } else if (w === 'CHECK') {
        const [expr, after] = paren(p, k + 1);
        checkNo++;
        const cn = `${name}_chk_${checkNo}`;
        meta.userChecks.push(cn);
        checks.push(`CONSTRAINT ${q(`sb|user|${cn}`)} CHECK (${emit(expr)})`);
        k = after;
      } else if (w === 'REFERENCES') {
        const fk = parseReferences(p, k, [col], lookup, name);
        meta.fks.push(fk);
        k = p.length;
      } else if (w === 'COMMENT') {
        k += 2;
      } else if (w === 'CHARACTER' && kw(p[k + 1]) === 'SET') {
        k += 3;
      } else if (w === 'CHARSET' || w === 'COLLATE') {
        k += 2;
      } else if (w === 'ON' && kw(p[k + 1]) === 'UPDATE') {
        k += 3;
        if (p[k]?.value === '(') k = paren(p, k)[1];
      } else if (w === 'SIGNED' || w === 'UNSIGNED') {
        if (w === 'UNSIGNED') c.unsigned = true;
        k++;
      } else {
        throw syntax(p[k]);
      }
    }

    meta.columns.push(c);
    colSql.push({ col, sqliteType, extra, checks });
  }

  // Primary key: column-level or table-level, never both.
  if (colPkFlags.length > 1 || (colPkFlags.length && meta.pk.length)) {
    throw new DdlError(1068, 'Multiple primary key defined', 'A table can only have one PRIMARY KEY. To use two columns together, write PRIMARY KEY (a, b) once at the end.');
  }
  if (colPkFlags.length) meta.pk = [colPkFlags[0]];

  for (const k of [...meta.pk, ...meta.uniques.flat(), ...meta.fks.flatMap(f => f.cols)]) {
    if (!meta.columns.some(c => c.name.toLowerCase() === k.toLowerCase())) {
      throw new DdlError(1072, `Key column '${k}' doesn't exist in table`, `The key mentions ${k}, but there is no column with that name.`);
    }
  }
  const pkLower = meta.pk.map(s => s.toLowerCase());
  meta.columns.forEach(c => {
    if (pkLower.includes(c.name.toLowerCase())) c.notNull = true;
  });

  const autos = meta.columns.filter(c => c.autoInc);
  if (autos.length > 1 || (autos.length === 1 && !(meta.pk.length === 1 && pkLower[0] === autos[0].name.toLowerCase()) && !meta.uniques.some(u => u.length === 1 && u[0].toLowerCase() === autos[0].name.toLowerCase()))) {
    throw new DdlError(
      1075,
      'Incorrect table definition; there can be only one auto column and it must be defined as a key',
      'AUTO_INCREMENT only works on the PRIMARY KEY column, and only one column can have it.',
    );
  }
  if (autos.length === 1 && autos[0].base !== 'int') {
    throw new DdlError(1063, `Incorrect column specifier for column '${autos[0].name}'`, 'AUTO_INCREMENT only works on a whole-number column like INT.');
  }

  // Build SQLite DDL. An AUTO_INCREMENT primary key becomes SQLite's
  // INTEGER PRIMARY KEY AUTOINCREMENT; every other INT stays INT so it is
  // not silently turned into a rowid that fills itself in.
  const lines: string[] = [];
  const autoPk = autos.length === 1 && meta.pk.length === 1 && pkLower[0] === autos[0].name.toLowerCase();
  for (const { col, sqliteType, extra, checks } of colSql) {
    const c = meta.columns.find(x => x.name === col)!;
    const isAutoPk = autoPk && c.autoInc;
    let line = `${q(col)} ${isAutoPk ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : sqliteType}`;
    if (sqliteType === 'TEXT') line += ' COLLATE NOCASE';
    if (c.notNull && !isAutoPk) line += ' NOT NULL';
    if (extra.length) line += ' ' + extra.join(' ');
    // Range/length checks are skipped for the auto key: SQLite fills it.
    const useChecks = isAutoPk ? [] : checks;
    if (useChecks.length) line += ' ' + useChecks.join(' ');
    lines.push(line);
  }
  if (meta.pk.length && !autoPk) lines.push(`PRIMARY KEY (${meta.pk.map(q).join(', ')})`);
  for (const u of meta.uniques) lines.push(`UNIQUE (${u.map(q).join(', ')})`);
  for (const f of meta.fks) {
    lines.push(
      `FOREIGN KEY (${f.cols.map(q).join(', ')}) REFERENCES ${q(f.refTable)} (${f.refCols.map(q).join(', ')}) ON DELETE ${f.onDelete} ON UPDATE ${f.onUpdate}`,
    );
  }
  lines.push(...tableSql);

  const sql = `CREATE TABLE ${ifNotExists ? 'IF NOT EXISTS ' : ''}${q(name)} (\n  ${lines.join(',\n  ')}\n) STRICT`;
  return { meta, ifNotExists, sqlite: [sql, ...triggers] };
}

function parseReferences(
  p: Token[],
  k: number,
  cols: string[],
  lookup: (name: string) => TableMeta | null,
  self: string,
): FkMeta {
  if (kw(p[k]) !== 'REFERENCES') throw syntax(p[k]);
  const ref = nameOf(p[k + 1]);
  if (!ref) throw syntax(p[k + 1]);
  let j = k + 2;
  let refCols: string[] = [];
  if (p[j]?.value === '(') {
    const [inner, after] = paren(p, j);
    refCols = nameList(inner);
    j = after;
  }
  let onDelete = 'NO ACTION';
  let onUpdate = 'NO ACTION';
  while (kw(p[j]) === 'ON') {
    const which = kw(p[j + 1]);
    let action = kw(p[j + 2]);
    let step = 3;
    if (action === 'SET') {
      action = `SET ${kw(p[j + 3])}`;
      step = 4;
    } else if (action === 'NO') {
      action = 'NO ACTION';
      step = 4;
    }
    if (!['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION', 'SET DEFAULT'].includes(action)) throw syntax(p[j + 2]);
    if (which === 'DELETE') onDelete = action;
    else if (which === 'UPDATE') onUpdate = action;
    else throw syntax(p[j + 1]);
    j += step;
  }

  const target = ref.toLowerCase() === self.toLowerCase() ? null : lookup(ref);
  if (ref.toLowerCase() !== self.toLowerCase() && !target) {
    throw new DdlError(
      1824,
      `Failed to open the referenced table '${ref}'`,
      `The foreign key points at a table called ${ref}, but it doesn't exist yet. Create ${ref} first.`,
    );
  }
  if (target) {
    if (!refCols.length) refCols = target.pk;
    const lower = refCols.map(s => s.toLowerCase());
    const keyed =
      (target.pk.length === lower.length && target.pk.every((c, i) => c.toLowerCase() === lower[i])) ||
      target.uniques.some(u => u.length === lower.length && u.every((c, i) => c.toLowerCase() === lower[i]));
    if (!keyed) {
      throw new DdlError(
        1822,
        `Failed to add the foreign key constraint. Missing index for constraint in the referenced table '${ref}'`,
        `A foreign key has to point at the PRIMARY KEY (or a UNIQUE column) of ${ref}.`,
      );
    }
  }
  return { cols, refTable: ref, refCols, onDelete, onUpdate };
}
