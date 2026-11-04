// ─── The sandbox engine: MySQL on the outside, SQLite on the inside ───────
// Runs entirely in the browser. Each MySQL "database" is its own SQLite
// database, so CREATE DATABASE / USE / SHOW TABLES behave the way students
// will later see them behave in MySQL Workbench. Messages are worded like
// Workbench's Action Output ("1 row(s) affected"), and every error carries a
// plain-English line underneath.
//
// Things deliberately matched to MySQL 8 (strict mode):
//   - text length, number range, date and ENUM rules (see createTable.ts)
//   - case-insensitive text comparison
//   - foreign keys switched on, and checked when the table is created
//   - UPDATE reports rows *changed*, not rows matched ("Rows matched: 3
//     Changed: 2"), which is what a predict-the-count exercise needs
//   - "double quoted" text is a string, and backslash escapes work
//
// Not covered, on purpose: ALTER TABLE, transactions, users, views. The
// sandbox teaches the basics; anything else gets a friendly "not here".

import type { Database, SqlJsStatic } from 'sql.js';
import { parseCreateTable, DdlError, type TableMeta } from './createTable';
import { translate, sqlError, type SqlError } from './errors';
import { emit, kw, nameOf, solid, splitStatements, UnclosedQuote, type Token } from './sqlText';

export type Cell = string | number | null | Uint8Array;

export type Kind =
  | 'CREATE_DATABASE' | 'DROP_DATABASE' | 'USE' | 'SHOW_DATABASES' | 'SHOW_TABLES' | 'DESCRIBE'
  | 'CREATE_TABLE' | 'DROP_TABLE' | 'TRUNCATE' | 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT' | 'OTHER';

export interface ResultSet {
  columns: string[];
  rows: Cell[][];
  /** Decimal places to show per column, when the column is a DECIMAL. */
  scales?: (number | null)[];
}

export interface StmtResult {
  raw: string;
  kind: Kind;
  ok: boolean;
  /** Workbench-style message, e.g. "1 row(s) affected". */
  message: string;
  /** A short plain-English line about what just happened. */
  note?: string;
  affected?: number;
  matched?: number;
  result?: ResultSet;
  error?: SqlError;
  table?: string | null;
}

export interface TableDiff {
  db: string;
  table: string;
  added: Set<number>;
  changed: Map<number, Set<string>>;
  removed: { rowid: number; row: Record<string, Cell> }[];
  created: boolean;
  dropped: boolean;
}

export interface RunOutput {
  results: StmtResult[];
  ok: boolean;
  diffs: TableDiff[];
}

export interface Snapshot {
  current: string | null;
  dbs: { name: string; bytes: Uint8Array }[];
}

export interface TableView {
  name: string;
  meta: TableMeta | null;
  columns: string[];
  rows: { rowid: number; cells: Cell[] }[];
}

const META = '__sb_meta';
const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
const NAME_RE = /^[A-Za-z_][A-Za-z0-9_$]{0,63}$/;

const pad = (n: number) => String(n).padStart(2, '0');
function localNow() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function datePart(v: unknown, i: number): number | null {
  if (typeof v !== 'string') return null;
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? parseInt(m[i], 10) : null;
}

function prepare(db: Database) {
  db.run('PRAGMA foreign_keys = ON');
  db.run(`CREATE TABLE IF NOT EXISTS ${META} (name TEXT PRIMARY KEY COLLATE NOCASE, json TEXT NOT NULL)`);
  db.create_function('NOW', () => localNow());
  db.create_function('CURDATE', () => localNow().slice(0, 10));
  db.create_function('CURTIME', () => localNow().slice(11));
  db.create_function('YEAR', (v: unknown) => datePart(v, 1));
  db.create_function('MONTH', (v: unknown) => datePart(v, 2));
  db.create_function('DAY', (v: unknown) => datePart(v, 3));
  db.create_function('CHAR_LENGTH', (v: unknown) => (v == null ? null : String(v).length));
  db.create_function('UCASE', (v: unknown) => (v == null ? null : String(v).toUpperCase()));
  db.create_function('LCASE', (v: unknown) => (v == null ? null : String(v).toLowerCase()));
  db.create_function('RAND', () => Math.random());
  db.create_function('IF', (c: unknown, a: unknown, b: unknown) => (c && c !== '0' ? a : b) as never);
}

function noDb(): SqlError {
  return sqlError(1046, 'No database selected', 'Pick a database first. Type USE and its name, like: USE shop;');
}

function notHere(what: string): SqlError {
  return sqlError(
    0,
    `${what} is not available in this sandbox`,
    'This sandbox sticks to the basics: CREATE, INSERT, SELECT, UPDATE, DELETE and DROP. You will meet the rest in MySQL Workbench.',
  );
}

export class SqlEngine {
  private dbs = new Map<string, { name: string; db: Database }>();
  private scratch: Database;
  current: string | null = null;

  constructor(private SQL: SqlJsStatic) {
    this.scratch = new SQL.Database();
    prepare(this.scratch);
  }

  // ── State ───────────────────────────────────────────────────────────────

  databases(): string[] {
    return [...this.dbs.values()].map(d => d.name).sort((a, b) => a.localeCompare(b));
  }

  hasDatabase(name: string) {
    return this.dbs.has(name.toLowerCase());
  }

  private dbFor(name?: string | null): Database | null {
    const n = name ?? this.current;
    if (!n) return null;
    return this.dbs.get(n.toLowerCase())?.db ?? null;
  }

  /** User tables in a database, in creation order. */
  tables(dbName?: string | null): string[] {
    const db = this.dbFor(dbName);
    if (!db) return [];
    const r = db.exec(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name <> '${META}' ORDER BY rowid`,
    );
    return r.length ? r[0].values.map(v => String(v[0])) : [];
  }

  meta(table: string, dbName?: string | null): TableMeta | null {
    const db = this.dbFor(dbName);
    if (!db) return null;
    const st = db.prepare(`SELECT json FROM ${META} WHERE name = ?`);
    st.bind([table]);
    const out = st.step() ? (JSON.parse(String(st.get()[0])) as TableMeta) : null;
    st.free();
    return out;
  }

  /** Rows of a table as objects, in insertion order. For checkers. */
  rows(table: string, dbName?: string | null): Record<string, Cell>[] {
    const v = this.view(table, dbName);
    if (!v) return [];
    return v.rows.map(r => Object.fromEntries(v.columns.map((c, i) => [c, r.cells[i]])));
  }

  view(table: string, dbName?: string | null): TableView | null {
    const db = this.dbFor(dbName);
    if (!db) return null;
    const real = this.tables(dbName).find(t => t.toLowerCase() === table.toLowerCase());
    if (!real) return null;
    const st = db.prepare(`SELECT rowid AS __rid, * FROM ${q(real)} ORDER BY rowid`);
    const columns = st.getColumnNames().slice(1);
    const rows: TableView['rows'] = [];
    while (st.step()) {
      const r = st.get() as Cell[];
      rows.push({ rowid: Number(r[0]), cells: r.slice(1) });
    }
    st.free();
    return { name: real, meta: this.meta(real, dbName), columns, rows };
  }

  /** Raw query for checkers. Runs against the given or current database. */
  query(sql: string, dbName?: string | null): ResultSet {
    const db = this.dbFor(dbName) ?? this.scratch;
    const st = db.prepare(sql);
    const columns = st.getColumnNames();
    const rows: Cell[][] = [];
    while (st.step()) rows.push(st.get() as Cell[]);
    st.free();
    return { columns, rows };
  }

  /** One number from a checker query, e.g. SELECT COUNT(*) ... */
  scalar(sql: string, dbName?: string | null): Cell {
    const r = this.query(sql, dbName);
    return r.rows[0]?.[0] ?? null;
  }

  snapshot(): Snapshot {
    const dbs = [...this.dbs.values()].map(({ name, db }) => {
      const bytes = db.export();
      prepare(db); // export() reopens the file and drops pragmas and functions
      return { name, bytes };
    });
    return { current: this.current, dbs };
  }

  restore(s: Snapshot) {
    this.closeAll();
    for (const { name, bytes } of s.dbs) {
      const db = new this.SQL.Database(bytes);
      prepare(db);
      this.dbs.set(name.toLowerCase(), { name, db });
    }
    this.current = s.current && this.dbs.has(s.current.toLowerCase()) ? this.dbs.get(s.current.toLowerCase())!.name : null;
  }

  reset() {
    this.closeAll();
    this.current = null;
  }

  private closeAll() {
    for (const { db } of this.dbs.values()) db.close();
    this.dbs.clear();
  }

  // ── Running SQL ─────────────────────────────────────────────────────────

  /** Run a script. Stops at the first error, the way Workbench does by default. */
  run(text: string): RunOutput {
    let stmts;
    try {
      stmts = splitStatements(text);
    } catch (e) {
      if (e instanceof UnclosedQuote) {
        const err = sqlError(
          1064,
          'You have an error in your SQL syntax; a quoted string is never closed',
          `A ${e.quote === '`' ? 'backtick `' : `quote ${e.quote}`} is opened but never closed. Every quote needs a partner.`,
        );
        return { ok: false, diffs: [], results: [{ raw: text.trim(), kind: 'OTHER', ok: false, message: err.mysql, error: err }] };
      }
      throw e;
    }
    const before = this.capture();
    const results: StmtResult[] = [];
    for (const s of stmts) {
      const r = this.exec(s.raw, s.tokens);
      results.push(r);
      if (!r.ok) break;
    }
    const after = this.capture();
    return { results, ok: results.every(r => r.ok), diffs: diff(before, after) };
  }

  private exec(raw: string, tokens: Token[]): StmtResult {
    const t = solid(tokens);
    const w0 = kw(t[0]);
    const w1 = kw(t[1]);
    const fail = (kind: Kind, error: SqlError, table: string | null = null): StmtResult => ({
      raw, kind, ok: false, message: `Error Code: ${error.code || '—'}. ${error.mysql}`, error, table,
    });

    if (raw.includes('___')) {
      return fail('OTHER', sqlError(0, 'Blank left in the statement', 'Replace every ___ with your own value first.'));
    }

    // ── Databases ──
    if (w0 === 'CREATE' && (w1 === 'DATABASE' || w1 === 'SCHEMA')) {
      let i = 2;
      let ifNot = false;
      if (kw(t[2]) === 'IF' && kw(t[3]) === 'NOT' && kw(t[4]) === 'EXISTS') {
        ifNot = true;
        i = 5;
      }
      const name = nameOf(t[i]);
      if (!name || t.length > i + 1 && !['DEFAULT', 'CHARACTER', 'CHARSET', 'COLLATE'].includes(kw(t[i + 1]))) {
        return fail('CREATE_DATABASE', translate(`near "${t[i + 1]?.value ?? t[i]?.value ?? ''}": syntax error`, this.ctx('CREATE_DATABASE', null, null)));
      }
      if (!NAME_RE.test(name)) {
        return fail('CREATE_DATABASE', sqlError(1102, `Incorrect database name '${name}'`, 'Database names use letters, numbers and _ only, and start with a letter. No spaces.'));
      }
      if (this.hasDatabase(name)) {
        if (ifNot) {
          return { raw, kind: 'CREATE_DATABASE', ok: true, message: `1 row(s) affected, 1 warning(s): 1007 Can't create database '${name}'; database exists`, note: `${name} was already there, so nothing changed.` };
        }
        return fail('CREATE_DATABASE', sqlError(1007, `Can't create database '${name}'; database exists`, `You already have a database called ${name}. To use it, run USE ${name};`));
      }
      const db = new this.SQL.Database();
      prepare(db);
      this.dbs.set(name.toLowerCase(), { name, db });
      return { raw, kind: 'CREATE_DATABASE', ok: true, message: '1 row(s) affected', note: `Database ${name} created. Next: USE ${name};`, affected: 1 };
    }

    if (w0 === 'DROP' && (w1 === 'DATABASE' || w1 === 'SCHEMA')) {
      let i = 2;
      let ifExists = false;
      if (kw(t[2]) === 'IF' && kw(t[3]) === 'EXISTS') {
        ifExists = true;
        i = 4;
      }
      const name = nameOf(t[i]);
      if (!name) return fail('DROP_DATABASE', translate(`near "${t[i]?.value ?? ''}": syntax error`, this.ctx('DROP_DATABASE', null, null)));
      const entry = this.dbs.get(name.toLowerCase());
      if (!entry) {
        if (ifExists) return { raw, kind: 'DROP_DATABASE', ok: true, message: `0 row(s) affected, 1 warning(s): 1008 Can't drop database '${name}'; database doesn't exist` };
        return fail('DROP_DATABASE', sqlError(1008, `Can't drop database '${name}'; database doesn't exist`, `There's no database called ${name}. SHOW DATABASES; lists the ones you have.`));
      }
      const n = this.tables(entry.name).length;
      entry.db.close();
      this.dbs.delete(name.toLowerCase());
      if (this.current?.toLowerCase() === name.toLowerCase()) this.current = null;
      return { raw, kind: 'DROP_DATABASE', ok: true, message: `${n} row(s) affected`, note: `Database ${entry.name} and everything in it is gone.`, affected: n };
    }

    if (w0 === 'USE') {
      const name = nameOf(t[1]);
      if (!name || t.length > 2) return fail('USE', translate(`near "${t[2]?.value ?? t[1]?.value ?? 'USE'}": syntax error`, this.ctx('USE', null, null)));
      const entry = this.dbs.get(name.toLowerCase());
      if (!entry) {
        return fail('USE', sqlError(1049, `Unknown database '${name}'`, `There's no database called ${name}. Create it first with CREATE DATABASE ${name};`));
      }
      this.current = entry.name;
      return { raw, kind: 'USE', ok: true, message: '0 row(s) affected', note: `Now using ${entry.name}.` };
    }

    if (w0 === 'SHOW' && (w1 === 'DATABASES' || w1 === 'SCHEMAS')) {
      const rows = this.databases().map(d => [d]);
      return { raw, kind: 'SHOW_DATABASES', ok: true, message: `${rows.length} row(s) returned`, result: { columns: ['Database'], rows } };
    }

    if (w0 === 'SHOW' && (w1 === 'TABLES' || (w1 === 'FULL' && kw(t[2]) === 'TABLES'))) {
      if (!this.current) return fail('SHOW_TABLES', noDb());
      const rows = this.tables().map(x => [x]);
      return { raw, kind: 'SHOW_TABLES', ok: true, message: `${rows.length} row(s) returned`, result: { columns: [`Tables_in_${this.current}`], rows } };
    }

    if (w0 === 'DESCRIBE' || w0 === 'DESC' || w0 === 'EXPLAIN' || (w0 === 'SHOW' && (w1 === 'COLUMNS' || w1 === 'FIELDS'))) {
      const nameTok = w0 === 'SHOW' ? t[3] : t[1];
      const table = nameOf(nameTok);
      if (!table) return fail('DESCRIBE', translate(`near "${nameTok?.value ?? ''}": syntax error`, this.ctx('DESCRIBE', null, null)));
      if (!this.current) return fail('DESCRIBE', noDb());
      const meta = this.meta(table);
      if (!meta) return fail('DESCRIBE', translate(`no such table: ${table}`, this.ctx('DESCRIBE', table, null)), table);
      return { raw, kind: 'DESCRIBE', ok: true, message: `${meta.columns.length} row(s) returned`, result: describe(meta), table: meta.name };
    }

    if (w0 === 'SHOW') return fail('OTHER', notHere(`SHOW ${w1}`));

    // Everything below works inside the current database.
    const kind: Kind =
      w0 === 'CREATE' && (w1 === 'TABLE' || (w1 === 'TEMPORARY' && kw(t[2]) === 'TABLE')) ? 'CREATE_TABLE'
      : w0 === 'DROP' && w1 === 'TABLE' ? 'DROP_TABLE'
      : w0 === 'TRUNCATE' ? 'TRUNCATE'
      : w0 === 'INSERT' || w0 === 'REPLACE' ? 'INSERT'
      : w0 === 'UPDATE' ? 'UPDATE'
      : w0 === 'DELETE' ? 'DELETE'
      : w0 === 'SELECT' || w0 === 'WITH' || (w0 === '' && t[0]?.value === '(') ? 'SELECT'
      : 'OTHER';

    if (kind === 'OTHER') {
      if (w0 === 'ALTER') return fail('OTHER', notHere('ALTER TABLE'));
      if (['BEGIN', 'START', 'COMMIT', 'ROLLBACK', 'SAVEPOINT'].includes(w0)) return fail('OTHER', notHere('Transactions'));
      if (w0 === 'CREATE' || w0 === 'DROP') return fail('OTHER', notHere(`${w0} ${w1}`));
      return fail('OTHER', translate(`near "${t[0]?.value ?? ''}": syntax error`, this.ctx('OTHER', null, null)));
    }

    // db.table → table, when db is the one in use.
    let toks = tokens;
    const known = new Set([...this.dbs.keys()]);
    if (t.some((x, i) => (x.type === 'word' || x.type === 'ident') && known.has(x.value.toLowerCase()) && t[i + 1]?.value === '.')) {
      const out: Token[] = [];
      for (let i = 0; i < tokens.length; i++) {
        const x = tokens[i];
        if ((x.type === 'word' || x.type === 'ident') && known.has(x.value.toLowerCase()) && tokens[i + 1]?.value === '.') {
          if (!this.current || x.value.toLowerCase() !== this.current.toLowerCase()) {
            return fail(kind, sqlError(0, `Cross-database statements are not available in this sandbox`, `This sandbox works in one database at a time. Run USE ${x.value}; first, then leave out the "${x.value}." part.`));
          }
          i++; // skip the dot too
          continue;
        }
        out.push(x);
      }
      toks = out;
    }
    const ts = solid(toks);

    const db = this.dbFor();
    if (kind === 'SELECT' && !db) {
      // SELECT 'hello'; works with no database, like in MySQL.
      try {
        const res = runSelect(this.scratch, emit(toks));
        return { raw, kind, ok: true, message: `${res.rows.length} row(s) returned`, result: res };
      } catch (e) {
        const msg = (e as Error).message;
        if (/no such table/.test(msg)) return fail(kind, noDb());
        return fail(kind, translate(msg, this.ctx(kind, null, null)));
      }
    }
    if (!db) return fail(kind, noDb());

    const target = targetTable(kind, ts);
    const insertCols = kind === 'INSERT' ? insertColumns(ts) : null;
    const ctx = this.ctx(kind, target, insertCols);

    try {
      switch (kind) {
        case 'CREATE_TABLE': {
          const parsed = parseCreateTable(toks, n => this.meta(n));
          const exists = this.tables().some(x => x.toLowerCase() === parsed.meta.name.toLowerCase());
          if (exists) {
            if (parsed.ifNotExists) {
              return { raw, kind, ok: true, message: `0 row(s) affected, 1 warning(s): 1050 Table '${parsed.meta.name}' already exists`, table: parsed.meta.name };
            }
            return fail(kind, translate(`table ${parsed.meta.name} already exists`, ctx), parsed.meta.name);
          }
          for (const s of parsed.sqlite) db.run(s);
          db.run(`INSERT INTO ${META} (name, json) VALUES (?, ?)`, [parsed.meta.name, JSON.stringify(parsed.meta)]);
          return { raw, kind, ok: true, message: '0 row(s) affected', note: `Table ${parsed.meta.name} created. It's empty for now.`, table: parsed.meta.name };
        }

        case 'DROP_TABLE': {
          let i = 2;
          let ifExists = false;
          if (kw(ts[2]) === 'IF' && kw(ts[3]) === 'EXISTS') {
            ifExists = true;
            i = 4;
          }
          const names = ts.slice(i).filter(x => x.type === 'word' || x.type === 'ident').map(x => x.value)
            .filter(n => !['CASCADE', 'RESTRICT'].includes(n.toUpperCase()));
          const all = this.tables();
          const missing = names.filter(n => !all.some(x => x.toLowerCase() === n.toLowerCase()));
          if (missing.length && !ifExists) {
            return fail(kind, sqlError(1051, `Unknown table '${this.current}.${missing[0]}'`, `There's no table called ${missing[0]}. SHOW TABLES; lists what you have.`), missing[0]);
          }
          const dropping = names.filter(n => !missing.includes(n)).map(n => n.toLowerCase());
          for (const n of dropping) {
            for (const other of all) {
              if (dropping.includes(other.toLowerCase())) continue;
              const m = this.meta(other);
              const fk = m?.fks.find(f => f.refTable.toLowerCase() === n);
              if (fk) {
                return fail(kind, sqlError(3730, `Cannot drop table '${n}' referenced by a foreign key constraint on table '${other}'.`, `${other} has a foreign key pointing at ${n}. Drop ${other} first.`), n);
              }
            }
          }
          db.run('PRAGMA foreign_keys = OFF');
          for (const n of dropping) {
            db.run(`DROP TABLE ${q(n)}`);
            db.run(`DELETE FROM ${META} WHERE name = ?`, [n]);
          }
          db.run('PRAGMA foreign_keys = ON');
          return {
            raw, kind, ok: true,
            message: `0 row(s) affected${missing.length ? `, ${missing.length} warning(s): 1051 Unknown table '${this.current}.${missing[0]}'` : ''}`,
            note: dropping.length ? `Table ${names.filter(n => !missing.includes(n)).join(', ')} is gone, structure and all.` : undefined,
            table: names[0] ?? null,
          };
        }

        case 'TRUNCATE': {
          if (!target) return fail(kind, translate(`near "${ts[1]?.value ?? ''}": syntax error`, ctx));
          if (!this.meta(target)) return fail(kind, translate(`no such table: ${target}`, ctx), target);
          db.run(`DELETE FROM ${q(target)}`);
          try {
            db.run(`DELETE FROM sqlite_sequence WHERE name = ?`, [target]);
          } catch {
            /* no AUTO_INCREMENT tables yet */
          }
          return { raw, kind, ok: true, message: '0 row(s) affected', note: `Every row in ${target} is gone. The table is still there, and numbering starts again at 1.`, table: target };
        }

        case 'INSERT': {
          let sql = emit(toks);
          if (kw(ts[1]) === 'IGNORE') sql = sql.replace(/^\s*INSERT\s+IGNORE/i, 'INSERT OR IGNORE');
          if (kw(ts[0]) === 'INSERT' && kw(ts[1]) !== 'INTO' && kw(ts[1]) !== 'IGNORE') sql = sql.replace(/^\s*INSERT/i, 'INSERT INTO');
          if (!target || !this.meta(target)) {
            if (target) return fail(kind, translate(`no such table: ${target}`, ctx), target);
          }
          db.run(sql);
          const n = db.getRowsModified();
          return {
            raw, kind, ok: true,
            message: n > 1 ? `${n} row(s) affected Records: ${n}  Duplicates: 0  Warnings: 0` : `${n} row(s) affected`,
            note: n === 1 ? `1 new row in ${target}.` : `${n} new rows in ${target}.`,
            affected: n, table: target,
          };
        }

        case 'UPDATE': {
          if (target && !this.meta(target)) return fail(kind, translate(`no such table: ${target}`, ctx), target);
          const before = target ? this.view(target) : null;
          db.run(emit(toks));
          const matched = db.getRowsModified();
          const after = target ? this.view(target) : null;
          let changed = matched;
          if (before && after) {
            const old = new Map(before.rows.map(r => [r.rowid, JSON.stringify(r.cells)]));
            changed = after.rows.filter(r => old.has(r.rowid) && old.get(r.rowid) !== JSON.stringify(r.cells)).length;
          }
          return {
            raw, kind, ok: true,
            message: `${changed} row(s) affected Rows matched: ${matched}  Changed: ${changed}  Warnings: 0`,
            note:
              matched === 0 ? 'No rows matched your WHERE, so nothing changed.'
              : changed === 0 ? `${matched === 1 ? 'The row' : `All ${matched} rows`} already had that value, so nothing changed.`
              : changed < matched ? `${matched} rows matched, but only ${changed} changed. The others already had that value.`
              : `${changed} row${changed === 1 ? '' : 's'} changed.`,
            affected: changed, matched, table: target,
          };
        }

        case 'DELETE': {
          if (target && !this.meta(target)) return fail(kind, translate(`no such table: ${target}`, ctx), target);
          db.run(emit(toks));
          const n = db.getRowsModified();
          return {
            raw, kind, ok: true, message: `${n} row(s) affected`,
            note: n === 0 ? 'No rows matched, so nothing was deleted.' : `${n} row${n === 1 ? '' : 's'} deleted.`,
            affected: n, table: target,
          };
        }

        case 'SELECT': {
          const res = runSelect(db, emit(toks));
          res.scales = this.scalesFor(res.columns, ts);
          return { raw, kind, ok: true, message: `${res.rows.length} row(s) returned`, result: res, table: target };
        }
      }
    } catch (e) {
      if (e instanceof DdlError) return fail(kind, sqlError(e.code, e.message, e.plain), target);
      return fail(kind, translate((e as Error).message, ctx), target);
    }
    return fail(kind, notHere(w0));
  }

  private ctx(kind: string, table: string | null, insertCols: string[] | null) {
    return { kind, db: this.current, table, insertCols, meta: (n: string) => this.meta(n) };
  }

  /** DECIMAL columns keep their decimal places on screen (4.5 shows as 4.50). */
  private scalesFor(columns: string[], ts: Token[]): (number | null)[] {
    const mentioned = new Set(ts.filter(x => x.type === 'word' || x.type === 'ident').map(x => x.value.toLowerCase()));
    const metas = this.tables().filter(x => mentioned.has(x.toLowerCase())).map(x => this.meta(x)).filter(Boolean) as TableMeta[];
    return columns.map(c => {
      for (const m of metas) {
        const col = m.columns.find(x => x.name.toLowerCase() === c.toLowerCase());
        if (col?.base === 'decimal') return col.scale ?? 0;
      }
      return null;
    });
  }

  /** Every row of every table, keyed by db.table, for working out what a run changed. */
  private capture() {
    const out = new Map<string, { db: string; table: string; columns: string[]; rows: Map<number, Cell[]> }>();
    for (const { name } of this.dbs.values()) {
      for (const t of this.tables(name)) {
        const v = this.view(t, name)!;
        out.set(`${name.toLowerCase()}.${t.toLowerCase()}`, {
          db: name, table: t, columns: v.columns, rows: new Map(v.rows.map(r => [r.rowid, r.cells])),
        });
      }
    }
    return out;
  }
}

function runSelect(db: Database, sql: string): ResultSet {
  const st = db.prepare(sql);
  try {
    const columns = st.getColumnNames();
    const rows: Cell[][] = [];
    while (st.step()) rows.push(st.get() as Cell[]);
    return { columns, rows };
  } finally {
    st.free();
  }
}

function targetTable(kind: Kind, t: Token[]): string | null {
  switch (kind) {
    case 'INSERT': {
      let i = 1;
      if (['IGNORE', 'INTO'].includes(kw(t[i]))) i++;
      if (kw(t[i]) === 'INTO') i++;
      return nameOf(t[i]);
    }
    case 'UPDATE': {
      let i = 1;
      if (kw(t[i]) === 'IGNORE' || kw(t[i]) === 'LOW_PRIORITY') i++;
      return nameOf(t[i]);
    }
    case 'DELETE': {
      const i = t.findIndex(x => kw(x) === 'FROM');
      return i >= 0 ? nameOf(t[i + 1]) : null;
    }
    case 'TRUNCATE':
      return nameOf(kw(t[1]) === 'TABLE' ? t[2] : t[1]);
    case 'SELECT': {
      const i = t.findIndex(x => kw(x) === 'FROM');
      return i >= 0 ? nameOf(t[i + 1]) : null;
    }
    default:
      return null;
  }
}

function insertColumns(t: Token[]): string[] | null {
  let i = 1;
  while (['IGNORE', 'INTO'].includes(kw(t[i]))) i++;
  i++; // table name
  if (t[i]?.value !== '(') return null;
  const cols: string[] = [];
  for (let j = i + 1; j < t.length && t[j].value !== ')'; j++) {
    const n = nameOf(t[j]);
    if (n) cols.push(n);
  }
  return cols;
}

function describe(m: TableMeta): ResultSet {
  const pk = m.pk.map(s => s.toLowerCase());
  const uni = m.uniques.filter(u => u.length === 1).map(u => u[0].toLowerCase());
  const mul = m.fks.flatMap(f => f.cols).map(s => s.toLowerCase());
  return {
    columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
    rows: m.columns.map(c => {
      const l = c.name.toLowerCase();
      return [
        c.name,
        c.type,
        c.notNull ? 'NO' : 'YES',
        pk.includes(l) ? 'PRI' : uni.includes(l) ? 'UNI' : mul.includes(l) ? 'MUL' : '',
        c.default === undefined ? null : c.default,
        c.autoInc ? 'auto_increment' : c.default === 'CURRENT_TIMESTAMP' ? 'DEFAULT_GENERATED' : '',
      ];
    }),
  };
}

function diff(
  before: Map<string, { db: string; table: string; columns: string[]; rows: Map<number, Cell[]> }>,
  after: Map<string, { db: string; table: string; columns: string[]; rows: Map<number, Cell[]> }>,
): TableDiff[] {
  const out: TableDiff[] = [];
  for (const [key, a] of after) {
    const b = before.get(key);
    const d: TableDiff = { db: a.db, table: a.table, added: new Set(), changed: new Map(), removed: [], created: !b, dropped: false };
    for (const [rid, cells] of a.rows) {
      const old = b?.rows.get(rid);
      if (!old) {
        d.added.add(rid);
        continue;
      }
      const cols = new Set<string>();
      cells.forEach((v, i) => {
        if (v !== old[i]) cols.add(a.columns[i]);
      });
      if (cols.size) d.changed.set(rid, cols);
    }
    if (b) {
      for (const [rid, cells] of b.rows) {
        if (!a.rows.has(rid)) d.removed.push({ rowid: rid, row: Object.fromEntries(b.columns.map((c, i) => [c, cells[i]])) });
      }
    }
    if (d.created || d.added.size || d.changed.size || d.removed.length) out.push(d);
  }
  for (const [key, b] of before) {
    if (!after.has(key)) out.push({ db: b.db, table: b.table, added: new Set(), changed: new Map(), removed: [], created: false, dropped: true });
  }
  return out;
}

/** Show a cell the way MySQL would print it. */
export function formatCell(v: Cell, scale?: number | null): string {
  if (v === null) return 'NULL';
  if (v instanceof Uint8Array) return `BLOB ${v.length}B`;
  if (typeof v === 'number') {
    if (scale != null) return v.toFixed(scale);
    if (!Number.isInteger(v)) return String(Math.round(v * 1e10) / 1e10);
  }
  return String(v);
}

// ── Saving a workspace in localStorage ──────────────────────────────────────

function toB64(bytes: Uint8Array) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
function fromB64(s: string) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function encodeSnapshot(s: Snapshot): string {
  return JSON.stringify({ c: s.current, d: s.dbs.map(x => [x.name, toB64(x.bytes)]) });
}

export function decodeSnapshot(text: string): Snapshot | null {
  try {
    const o = JSON.parse(text) as { c: string | null; d: [string, string][] };
    return { current: o.c, dbs: o.d.map(([name, b]) => ({ name, bytes: fromB64(b) })) };
  } catch {
    return null;
  }
}

/** What kind of statements a script holds, without running it. */
export function statementKinds(text: string): Kind[] {
  let stmts;
  try {
    stmts = splitStatements(text);
  } catch {
    return ['OTHER'];
  }
  return stmts.map(s => {
    const t = solid(s.tokens);
    const a = kw(t[0]);
    const b = kw(t[1]);
    if (a === 'SELECT' || a === 'WITH') return 'SELECT';
    if (a === 'SHOW' && (b === 'TABLES' || b === 'FULL')) return 'SHOW_TABLES';
    if (a === 'SHOW' && (b === 'DATABASES' || b === 'SCHEMAS')) return 'SHOW_DATABASES';
    if (a === 'SHOW' && (b === 'COLUMNS' || b === 'FIELDS')) return 'DESCRIBE';
    if (a === 'DESCRIBE' || a === 'DESC' || a === 'EXPLAIN') return 'DESCRIBE';
    if (a === 'USE') return 'USE';
    if (a === 'INSERT' || a === 'REPLACE') return 'INSERT';
    if (a === 'UPDATE') return 'UPDATE';
    if (a === 'DELETE') return 'DELETE';
    if (a === 'TRUNCATE') return 'TRUNCATE';
    if (a === 'CREATE' && (b === 'DATABASE' || b === 'SCHEMA')) return 'CREATE_DATABASE';
    if (a === 'CREATE') return 'CREATE_TABLE';
    if (a === 'DROP' && (b === 'DATABASE' || b === 'SCHEMA')) return 'DROP_DATABASE';
    if (a === 'DROP') return 'DROP_TABLE';
    return 'OTHER';
  });
}
