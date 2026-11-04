// ─── Turning SQLite's complaints into MySQL's, plus plain English ─────────
// Students see two lines for every error: the message MySQL itself would
// print (so it looks familiar later in Workbench), and one plain sentence
// saying what to do about it.

import type { TableMeta } from './createTable';

export interface SqlError {
  code: number;
  /** What MySQL would print. */
  mysql: string;
  /** What it means, in plain words. */
  plain: string;
}

export interface ErrorContext {
  kind: string;
  db: string | null;
  /** The table the statement targets, if known. */
  table: string | null;
  meta: (name: string) => TableMeta | null;
  /** INSERT column list, when the student gave one. */
  insertCols: string[] | null;
}

export function sqlError(code: number, mysql: string, plain: string): SqlError {
  return { code, mysql, plain };
}

export function translate(message: string, ctx: ErrorContext): SqlError {
  const m = message.replace(/^Error:\s*/, '');
  let r: RegExpMatchArray | null;

  if ((r = m.match(/no such table: (?:\w+\.)?(.+)$/))) {
    const t = r[1];
    return sqlError(
      1146,
      `Table '${ctx.db ?? ''}.${t}' doesn't exist`,
      `There's no table called ${t} in ${ctx.db ?? 'this database'}. Check the spelling, or run SHOW TABLES; to see what's there.`,
    );
  }
  if ((r = m.match(/no such column: (.+)$/))) {
    const c = r[1].replace(/^.*\./, '');
    const where = ctx.kind === 'SELECT' ? 'field list' : ctx.kind === 'INSERT' ? 'field list' : 'where clause';
    return sqlError(
      1054,
      `Unknown column '${c}' in '${where}'`,
      `There's no column called ${c}. If you meant the text ${c}, put it in quotes: '${c}'.`,
    );
  }
  if ((r = m.match(/near "(.+?)": syntax error/))) {
    const near = r[1];
    return sqlError(
      1064,
      `You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '${near}'`,
      `SQL got confused near "${near}". Look for a missing comma, bracket or quote, or a misspelt word, just before it.`,
    );
  }
  if (/incomplete input/.test(m)) {
    return sqlError(
      1064,
      `You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ''`,
      `The statement stops too early. Is a bracket ) or a value missing at the end?`,
    );
  }
  if ((r = m.match(/table "?(.+?)"? already exists/))) {
    return sqlError(1050, `Table '${r[1]}' already exists`, `You already have a table called ${r[1]}. Pick another name, or DROP TABLE ${r[1]}; first.`);
  }
  if ((r = m.match(/UNIQUE constraint failed: (.+)$/))) {
    const cols = r[1].split(',').map(s => s.trim().replace(/^.*\./, ''));
    const table = r[1].split('.')[0].trim();
    const meta = ctx.meta(table);
    const isPk = meta && meta.pk.length === cols.length && meta.pk.every((c, i) => c.toLowerCase() === cols[i].toLowerCase());
    const key = isPk ? 'PRIMARY' : cols.join('_');
    return sqlError(
      1062,
      `Duplicate entry for key '${table}.${key}'`,
      isPk
        ? `Another row already has this ${cols.join(' + ')}. The primary key must be different for every row.`
        : `Another row already has this ${cols.join(' + ')}. That column is UNIQUE, so no repeats.`,
    );
  }
  if ((r = m.match(/NOT NULL constraint failed: (.+)$/))) {
    const col = r[1].replace(/^.*\./, '');
    if (ctx.kind === 'INSERT' && ctx.insertCols && !ctx.insertCols.some(c => c.toLowerCase() === col.toLowerCase())) {
      return sqlError(1364, `Field '${col}' doesn't have a default value`, `${col} can't be empty, and you didn't give it a value. Add ${col} to your column list.`);
    }
    return sqlError(1048, `Column '${col}' cannot be null`, `${col} can't be empty (NOT NULL). Give it a real value.`);
  }
  if ((r = m.match(/CHECK constraint failed: (.+)$/))) {
    const parts = r[1].split('|');
    if (parts[0] === 'sb') {
      const [, kind, col, arg] = parts;
      const meta = ctx.table ? ctx.meta(ctx.table) : null;
      const cm = meta?.columns.find(c => c.name.toLowerCase() === col.toLowerCase());
      switch (kind) {
        case 'len':
          return sqlError(1406, `Data too long for column '${col}' at row 1`, `Too long. ${col} holds at most ${arg} characters.`);
        case 'range':
          return sqlError(
            1264,
            `Out of range value for column '${col}' at row 1`,
            cm?.base === 'decimal'
              ? `That number doesn't fit ${col}, which is ${cm.type.toUpperCase()}: at most ${cm.precision! - cm.scale!} digits before the point${cm.unsigned ? ', and no negatives' : ''}.`
              : `That number is too big or too small for ${col}${cm ? ` (${cm.type.toUpperCase()})` : ''}.`,
          );
        case 'enum':
          return sqlError(
            1265,
            `Data truncated for column '${col}' at row 1`,
            `${col} only accepts ${cm?.enumValues?.map(v => `'${v}'`).join(', ') ?? 'the values it was given'}.`,
          );
        case 'date':
          return sqlError(
            1292,
            `Incorrect ${cm?.base === 'time' ? 'time' : cm?.base === 'datetime' ? 'datetime' : 'date'} value for column '${col}' at row 1`,
            cm?.base === 'time'
              ? `Times look like '14:30:00'.`
              : `Dates look like '2025-03-14' (year-month-day), in quotes, and must be real dates.`,
          );
        case 'user':
          return sqlError(3819, `Check constraint '${col}' is violated.`, `This row breaks a CHECK rule on the table.`);
      }
    }
    return sqlError(3819, `Check constraint '${r[1]}' is violated.`, `This row breaks a CHECK rule on the table.`);
  }
  if ((r = m.match(/cannot store (\w+) value in (\w+) column (.+)$/))) {
    const [, have, want, full] = r;
    const col = full.replace(/^.*\./, '');
    if (want === 'INT' || want === 'INTEGER') {
      if (have === 'REAL') {
        return sqlError(
          1366,
          `Incorrect integer value for column '${col}' at row 1`,
          `${col} only holds whole numbers, and this has decimals. (Real MySQL would quietly round it. Use ROUND() to say what you mean.)`,
        );
      }
      return sqlError(1366, `Incorrect integer value for column '${col}' at row 1`, `${col} only holds whole numbers, and this isn't one.`);
    }
    if (want === 'REAL') {
      return sqlError(1366, `Incorrect decimal value for column '${col}' at row 1`, `${col} only holds numbers, and this isn't one.`);
    }
    return sqlError(1366, `Incorrect value for column '${col}' at row 1`, `That value doesn't fit ${col}.`);
  }
  if (/FOREIGN KEY constraint failed/.test(m)) {
    if (ctx.kind === 'DELETE' || ctx.kind === 'DROP_TABLE') {
      return sqlError(
        1451,
        'Cannot delete or update a parent row: a foreign key constraint fails',
        'Rows in another table still point at this one. Change or delete those first.',
      );
    }
    return sqlError(
      1452,
      'Cannot add or update a child row: a foreign key constraint fails',
      'This value points at a row that does not exist in the other table.',
    );
  }
  if ((r = m.match(/table (.+?) has (\d+) columns but (\d+) values were supplied/)) || (r = m.match(/(\d+) values for (\d+) columns/))) {
    return sqlError(
      1136,
      "Column count doesn't match value count at row 1",
      "The number of values doesn't match the number of columns. List the columns you're filling, then give one value for each.",
    );
  }
  if ((r = m.match(/no such function: (.+)$/))) {
    return sqlError(1305, `FUNCTION ${ctx.db ?? ''}.${r[1]} does not exist`, `There's no function called ${r[1]} here. Check the spelling.`);
  }
  if ((r = m.match(/duplicate column name: (.+)$/))) {
    return sqlError(1060, `Duplicate column name '${r[1]}'`, `Two columns are called ${r[1]}. Each needs its own name.`);
  }
  if ((r = m.match(/ambiguous column name: (.+)$/))) {
    return sqlError(1052, `Column '${r[1]}' in field list is ambiguous`, `Two tables have a column called ${r[1]}. Write table.${r[1]} to say which.`);
  }
  if (/unrecognized token/.test(m)) {
    return sqlError(1064, `You have an error in your SQL syntax`, `There's a character SQL doesn't understand. Check your quotes.`);
  }
  if (/misuse of aggregate/.test(m)) {
    return sqlError(1111, 'Invalid use of group function', 'COUNT, SUM and friends can\'t be used there.');
  }
  return sqlError(0, m, 'Something went wrong with that statement.');
}
