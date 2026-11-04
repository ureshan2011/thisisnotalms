// ─── The beginner path: zero to basic SQL in eight levels ─────────────────
// Each level is a handful of tiny steps. One idea per step, one or two lines
// of text, then the student does something. The database each level starts
// from is built fresh, so a student can jump back in anywhere.
//
// Text conventions: `code` renders as code; a line starting "- " is a list item.

import type { Cell, ResultSet, RunOutput, SqlEngine, StmtResult } from './engine';
import { cats, fullTableSql, money, sqlStr, type Theme } from './themes';

export interface CheckCtx {
  engine: SqlEngine;
  theme: Theme;
  /** Every statement run during this step, oldest first. */
  history: StmtResult[];
  /** Every statement run during this level. */
  levelHistory: StmtResult[];
  last: RunOutput | null;
  /** Rows of each table in the current database when the step began. */
  start: Record<string, Record<string, Cell>[]>;
}

/** true = done. A string = a gentle nudge. false = not yet, say nothing. */
export type CheckResult = true | false | string;

interface Base {
  id: string;
  /** One or two short lines. */
  say?: string;
}

export interface SqlStep extends Base {
  kind: 'sql';
  task: string;
  starter?: string;
  hint?: string;
  solution?: string;
  /** Shown on success. */
  after?: string;
  check: (c: CheckCtx) => CheckResult;
}

export interface ChooseStep extends Base {
  kind: 'choose' | 'predict';
  question: string;
  /** Shown as code under the question. */
  code?: string;
  options: string[];
  answer: number;
  /** Why each option is right or wrong. Index matches options. */
  why: string[];
  /** predict only: run this once the student has answered, so they see the truth. */
  run?: string;
}

export interface OrderStep extends Base {
  kind: 'order';
  task: string;
  /** In the correct order. Shown shuffled. */
  pieces: string[];
  after?: string;
}

export interface BossItem {
  label: string;
  check: (c: CheckCtx) => boolean;
}

export interface BossStep extends Base {
  kind: 'boss';
  task: string;
  items: BossItem[];
  hint?: string;
  solution?: string;
  after?: string;
}

export type Step = SqlStep | ChooseStep | OrderStep | BossStep;

export interface Level {
  id: string;
  n: number;
  title: string;
  tagline: string;
  /** What the student will be able to do afterwards. Used on the map and in the notes. */
  learn: string[];
  start: (t: Theme) => string;
  steps: (t: Theme) => Step[];
}

// ── Check helpers ───────────────────────────────────────────────────────────

const ok = (c: CheckCtx, kind: string) => c.history.some(r => r.ok && r.kind === kind);
const lastSelect = (c: CheckCtx): ResultSet | null => {
  const r = [...c.history].reverse().find(x => x.ok && x.kind === 'SELECT');
  return r?.result ?? null;
};
const asObjects = (r: ResultSet) => r.rows.map(row => Object.fromEntries(r.columns.map((col, i) => [col.toLowerCase(), row[i]])));
const near = (a: Cell, b: number) => typeof a === 'number' && Math.abs(a - b) < 0.006;
const same = (a: Cell, b: string) => typeof a === 'string' && a.trim().toLowerCase() === b.toLowerCase();
const rowsOf = (c: CheckCtx, table: string, db?: string) => c.engine.rows(table, db);
const hasTable = (c: CheckCtx, table: string, db?: string) => c.engine.tables(db).some(t => t.toLowerCase() === table.toLowerCase());
const col = (row: Record<string, Cell>, name: string) => {
  const k = Object.keys(row).find(x => x.toLowerCase() === name);
  return k ? row[k] : undefined;
};

/** Only the listed row ids changed compared to the start of the step. */
function onlyChanged(c: CheckCtx, table: string, ids: number[]) {
  const before = c.start[table] ?? [];
  const now = rowsOf(c, table);
  const b = new Map(before.map(r => [col(r, 'id'), JSON.stringify(r)]));
  for (const r of now) {
    const id = col(r, 'id') as number;
    if (ids.includes(id)) continue;
    if (b.get(id) !== JSON.stringify(r)) return false;
  }
  return now.length === before.length;
}

const options = (n: number) => {
  const set = new Set([n, Math.max(0, n - 1), n + 1, n + 2]);
  if (n >= 2) set.add(n - 2);
  return [...set].sort((a, b) => a - b).slice(0, 4);
};

// ── The levels ──────────────────────────────────────────────────────────────

export const LEVELS: Level[] = [
  {
    id: 'L1', n: 1, title: 'Say hello', tagline: 'Talk to a database for the first time.',
    learn: ['Run a SQL statement', 'CREATE DATABASE', 'USE', 'SHOW TABLES'],
    start: () => '',
    steps: t => [
      {
        id: 's1', kind: 'sql',
        say: 'This box runs SQL, the language databases understand.',
        task: 'Press Run.',
        starter: "SELECT 'Hello';",
        check: c => ok(c, 'SELECT'),
        after: 'That was your first query. The database answered you.',
      },
      {
        id: 's2', kind: 'sql',
        say: "Text goes inside 'single quotes'.",
        task: 'Make it say your name instead of Hello.',
        starter: "SELECT 'Hello';",
        hint: 'Swap the word Hello for your name. Keep the quotes around it.',
        solution: "SELECT 'Sam';",
        check: c => {
          const r = lastSelect(c);
          if (!r) return false;
          const v = r.rows[0]?.[0];
          if (typeof v === 'string' && v.trim() && v.trim().toLowerCase() !== 'hello') return true;
          return 'It still says Hello. Change the word between the quotes.';
        },
        after: 'Every statement ends with a semicolon ; like a full stop.',
      },
      {
        id: 's3', kind: 'sql',
        say: `A database is a box that holds tables. You run ${t.business}. Let's make its box.`,
        task: `Replace ___ with ${t.db}, then run it.`,
        starter: 'CREATE DATABASE ___;',
        solution: `CREATE DATABASE ${t.db};`,
        check: c => c.engine.hasDatabase(t.db) || (c.engine.databases().length ? `Close. The name should be exactly ${t.db}.` : false),
        after: 'Your database exists. It is empty for now.',
      },
      {
        id: 's4', kind: 'predict',
        question: 'What happens if you run the same line again?',
        code: `CREATE DATABASE ${t.db};`,
        options: [`You get a second ${t.db}`, 'An error: it already exists', 'Nothing happens'],
        answer: 1,
        why: [
          'Two databases with the same name would be confusing, so it is not allowed.',
          'Right. Names must be unique.',
          'Something does happen: the database says no.',
        ],
        run: `CREATE DATABASE ${t.db};`,
      },
      {
        id: 's5', kind: 'sql',
        say: 'Errors are normal. Read them, they tell you what went wrong. Now, to work inside a database you pick it with USE.',
        task: `Pick ${t.db}.`,
        hint: 'Type USE, a space, the name, and a semicolon.',
        solution: `USE ${t.db};`,
        check: c => c.engine.current?.toLowerCase() === t.db,
        after: 'See the label above the editor? It shows the database you are in.',
      },
      {
        id: 's6', kind: 'sql',
        say: 'SHOW TABLES lists the tables inside.',
        task: 'Run it.',
        starter: 'SHOW TABLES;',
        check: c => ok(c, 'SHOW_TABLES') || (c.history.some(r => r.kind === 'SHOW_TABLES' && r.error?.code === 1046) ? 'Pick the database first: USE ' + t.db + ';' : false),
        after: 'Nothing yet. Next level, you make your first table.',
      },
    ],
  },

  {
    id: 'L2', n: 2, title: 'Make a table', tagline: 'Columns, types, and your first CREATE TABLE.',
    learn: ['Pick a data type', 'CREATE TABLE', 'DESCRIBE'],
    start: t => `CREATE DATABASE ${t.db};\nUSE ${t.db};`,
    steps: t => [
      {
        id: 's1', kind: 'choose',
        say: 'A table is a grid. Each column has a name and a type. The type decides what is allowed in it.',
        question: 'Which type fits a price like 4.50?',
        options: ['INT (whole numbers)', 'DECIMAL(6,2) (numbers with 2 decimals)', 'VARCHAR(30) (text, up to 30 characters)'],
        answer: 1,
        why: [
          'INT only holds whole numbers, so 4.50 would not fit.',
          'Right. 6 digits in total, 2 of them after the point.',
          'Text would store it, but then you could not do maths with it.',
        ],
      },
      {
        id: 's2', kind: 'choose',
        question: 'And a phone number like 021 555 019?',
        options: ['INT', 'VARCHAR(15)'],
        answer: 1,
        why: [
          'INT would drop the leading 0 and can not hold spaces.',
          'Right. A phone number is text that happens to contain digits. You never add two phone numbers together.',
        ],
      },
      {
        id: 's3', kind: 'order',
        say: 'Build the table by putting the pieces in order. Columns go id, then name, then price.',
        task: 'Tap the pieces in order.',
        pieces: [`CREATE TABLE ${t.table} (`, 'id INT,', 'name VARCHAR(30),', 'price DECIMAL(6,2)', ');'],
        after: 'Commas go between columns, but not after the last one.',
      },
      {
        id: 's4', kind: 'sql',
        task: 'Here it is. Run it.',
        starter: `CREATE TABLE ${t.table} (\n  id INT,\n  name VARCHAR(30),\n  price DECIMAL(6,2)\n);`,
        check: c => hasTable(c, t.table),
        after: 'Your table is in the panel. Empty, but ready.',
      },
      {
        id: 's5', kind: 'sql',
        say: 'DESCRIBE shows the columns of a table and their types.',
        task: 'Run it.',
        starter: `DESCRIBE ${t.table};`,
        check: c => ok(c, 'DESCRIBE'),
      },
      {
        id: 's6', kind: 'sql',
        task: 'Your turn. Make a table called staff with a name (text, up to 40 characters) and an age (whole number).',
        starter: 'CREATE TABLE staff (\n  \n);',
        hint: 'Two columns: name VARCHAR(40), age INT. Comma between them.',
        solution: 'CREATE TABLE staff (\n  name VARCHAR(40),\n  age INT\n);',
        check: c => {
          const m = c.engine.meta('staff');
          if (!m) return false;
          const name = m.columns.find(x => x.name.toLowerCase() === 'name');
          const age = m.columns.find(x => x.name.toLowerCase() === 'age');
          if (!name || !age) return 'The table needs a column called name and one called age. DROP TABLE staff; and try again.';
          if (name.base !== 'char' && name.base !== 'text') return 'name should hold text: VARCHAR(40). DROP TABLE staff; and try again.';
          if (age.base !== 'int') return 'age should be a whole number: INT. DROP TABLE staff; and try again.';
          return true;
        },
        after: 'You designed a table on your own.',
      },
    ],
  },

  {
    id: 'L3', n: 3, title: 'Add rows', tagline: 'INSERT INTO: putting data in.',
    learn: ['INSERT one row', 'INSERT several rows', 'Quotes for text, none for numbers'],
    start: t => `CREATE DATABASE ${t.db};\nUSE ${t.db};\nCREATE TABLE ${t.table} (\n  id INT,\n  name VARCHAR(30),\n  price DECIMAL(6,2)\n);`,
    steps: t => {
      const r = t.rows;
      const has = (c: CheckCtx, id: number, name?: string, price?: number) =>
        rowsOf(c, t.table).some(x => col(x, 'id') === id && (!name || same(col(x, 'name')!, name)) && (price === undefined || near(col(x, 'price')!, price)));
      return [
        {
          id: 's1', kind: 'sql',
          say: "INSERT INTO adds a row. Text goes in 'quotes'. Numbers don't.",
          task: 'Run it, then watch the table.',
          starter: `INSERT INTO ${t.table} (id, name, price)\nVALUES (1, ${sqlStr(r[0].name)}, ${money(r[0].price)});`,
          check: c => has(c, 1),
          after: 'Green means new.',
        },
        {
          id: 's2', kind: 'sql',
          task: `Add ${r[1].name} with id 2 and price ${money(r[1].price)}.`,
          starter: `INSERT INTO ${t.table} (id, name, price)\nVALUES (2, ___, ___);`,
          hint: `The name is text, so it needs quotes: ${sqlStr(r[1].name)}. The price is a number: no quotes.`,
          solution: `INSERT INTO ${t.table} (id, name, price)\nVALUES (2, ${sqlStr(r[1].name)}, ${money(r[1].price)});`,
          check: c => has(c, 2, r[1].name, r[1].price) || (has(c, 2) ? `Row 2 is there, but check the name and price. Undo and try again.` : false),
        },
        {
          id: 's3', kind: 'sql',
          say: 'You can add several rows at once. Put a comma between them.',
          task: 'Run it.',
          starter: `INSERT INTO ${t.table} (id, name, price) VALUES\n  (3, ${sqlStr(r[2].name)}, ${money(r[2].price)}),\n  (4, ${sqlStr(r[3].name)}, ${money(r[3].price)}),\n  (5, ${sqlStr(r[4].name)}, ${money(r[4].price)});`,
          check: c => has(c, 3) && has(c, 4) && has(c, 5),
          after: 'Three rows, one statement.',
        },
        {
          id: 's4', kind: 'predict',
          question: 'This one has no quotes around the name. What happens?',
          code: `INSERT INTO ${t.table} (id, name, price)\nVALUES (6, ${t.oneWord.name}, ${money(t.oneWord.price)});`,
          options: ['It works', 'An error'],
          answer: 1,
          why: [
            `Without quotes, SQL reads ${t.oneWord.name} as the name of a column, not as text.`,
            `Right. Without quotes, SQL thinks ${t.oneWord.name} is a column name. The error says exactly that.`,
          ],
          run: `INSERT INTO ${t.table} (id, name, price) VALUES (6, ${t.oneWord.name}, ${money(t.oneWord.price)});`,
        },
        {
          id: 's5', kind: 'sql',
          task: `Fix it: add ${t.oneWord.name}, id 6, price ${money(t.oneWord.price)}.`,
          starter: `INSERT INTO ${t.table} (id, name, price)\nVALUES (6, ${t.oneWord.name}, ${money(t.oneWord.price)});`,
          hint: 'Put single quotes around the name.',
          solution: `INSERT INTO ${t.table} (id, name, price)\nVALUES (6, ${sqlStr(t.oneWord.name)}, ${money(t.oneWord.price)});`,
          check: c => has(c, 6, t.oneWord.name),
        },
        {
          id: 's6', kind: 'predict',
          question: "price is DECIMAL(6,2). What if you try to store the word 'cheap' in it?",
          code: `INSERT INTO ${t.table} (id, name, price)\nVALUES (7, 'Mystery', 'cheap');`,
          options: ['It stores the word', 'It stores 0', 'An error'],
          answer: 2,
          why: [
            'The column type is a rule. Text is not allowed in a number column.',
            'Some very old setups did that quietly. MySQL 8 refuses instead, which is safer.',
            'Right. The type is a rule, and the database refuses anything that breaks it.',
          ],
          run: `INSERT INTO ${t.table} (id, name, price) VALUES (7, 'Mystery', 'cheap');`,
        },
      ];
    },
  },

  {
    id: 'L4', n: 4, title: 'Ask questions', tagline: 'SELECT: getting data back out.',
    learn: ['SELECT * and named columns', 'WHERE with = < >', 'AND'],
    start: t => fullTableSql(t),
    steps: t => {
      const [c0, c1] = cats(t);
      const prices = t.rows.map(r => r.price).sort((a, b) => a - b);
      const under = Math.ceil(prices[3] + 0.01);
      const inC1 = t.rows.filter(r => r.cat === c1).map(r => r.price).sort((a, b) => a - b);
      const over = Math.floor(inC1[Math.floor(inC1.length / 2)]);
      const zeros = t.rows.filter(r => r.stock === 0).length;
      const selectRows = (c: CheckCtx) => {
        const r = lastSelect(c);
        return r ? asObjects(r) : null;
      };
      return [
        {
          id: 's1', kind: 'sql',
          say: `Your ${t.table} table filled up overnight. * means every column.`,
          task: 'Run it to see everything.',
          starter: `SELECT * FROM ${t.table};`,
          check: c => ok(c, 'SELECT'),
          after: `${t.rows.length} rows. Each one is a ${t.thing}.`,
        },
        {
          id: 's2', kind: 'sql',
          task: 'Show only the name and price columns.',
          starter: `SELECT ___ FROM ${t.table};`,
          hint: 'Swap ___ for the column names, with a comma between them.',
          solution: `SELECT name, price FROM ${t.table};`,
          check: c => {
            const r = lastSelect(c);
            if (!r) return false;
            const cols = r.columns.map(x => x.toLowerCase());
            if (cols.length === 2 && cols.includes('name') && cols.includes('price')) return true;
            return 'Close. List just name and price, with a comma between them.';
          },
        },
        {
          id: 's3', kind: 'sql',
          say: 'WHERE filters. Only rows that match come back.',
          task: `Show only the ${c0} ${t.things}.`,
          starter: `SELECT * FROM ${t.table}\nWHERE category = ___;`,
          hint: `${c0} is text, so it needs quotes: '${c0}'.`,
          solution: `SELECT * FROM ${t.table}\nWHERE category = '${c0}';`,
          check: c => {
            const rows = selectRows(c);
            if (!rows) return false;
            const want = t.rows.filter(r => r.cat === c0).length;
            if (rows.length === want && rows.every(r => same(r.category, c0))) return true;
            return `You should get ${want} rows, all ${c0}.`;
          },
        },
        {
          id: 's4', kind: 'sql',
          task: `Show the ${t.things} that cost less than ${under}.`,
          starter: `SELECT * FROM ${t.table}\nWHERE ___;`,
          hint: `Less than is < . So: price < ${under}`,
          solution: `SELECT * FROM ${t.table}\nWHERE price < ${under};`,
          check: c => {
            const rows = selectRows(c);
            if (!rows) return false;
            const want = t.rows.filter(r => r.price < under).length;
            if (rows.length === want && rows.every(r => typeof r.price === 'number' && r.price < under)) return true;
            return `You should get ${want} rows, every price under ${under}.`;
          },
        },
        {
          id: 's5', kind: 'predict',
          question: 'How many rows will this return?',
          code: `SELECT * FROM ${t.table}\nWHERE stock = 0;`,
          options: options(zeros).map(String),
          answer: options(zeros).indexOf(zeros),
          why: options(zeros).map(n =>
            n === zeros ? `Right. ${zeros} ${t.things} are out of stock.` : 'Look at the stock column in the table and count the zeros.',
          ),
          run: `SELECT * FROM ${t.table} WHERE stock = 0;`,
        },
        {
          id: 's6', kind: 'sql',
          say: 'Two conditions? Join them with AND. Both must be true.',
          task: `Find the ${c1} ${t.things} that cost more than ${over}.`,
          hint: `WHERE category = '${c1}' AND price > ${over}`,
          solution: `SELECT * FROM ${t.table}\nWHERE category = '${c1}' AND price > ${over};`,
          check: c => {
            const rows = selectRows(c);
            if (!rows) return false;
            const want = t.rows.filter(r => r.cat === c1 && r.price > over).length;
            if (rows.length === want && rows.every(r => same(r.category, c1) && (r.price as number) > over)) return true;
            return `You should get ${want} rows: ${c1}, and each over ${over}.`;
          },
          after: 'You can now ask a table almost any simple question.',
        },
      ];
    },
  },

  {
    id: 'L5', n: 5, title: 'Change things', tagline: 'UPDATE: fixing data that is already there.',
    learn: ['UPDATE ... SET ... WHERE', 'Predict how many rows change', 'Why WHERE matters'],
    start: t => fullTableSql(t),
    steps: t => {
      const [c0, c1] = cats(t);
      const r = t.rows;
      const np = money(Math.round(r[2].price * 1.2 * 2) / 2);
      const nC0 = r.filter(x => x.cat === c0).length;
      const price = (c: CheckCtx, id: number) => col(rowsOf(c, t.table).find(x => col(x, 'id') === id) ?? {}, 'price');
      return [
        {
          id: 's1', kind: 'sql',
          say: 'UPDATE changes rows. SET says what changes. WHERE says which rows.',
          task: 'Run it and watch row 3.',
          starter: `UPDATE ${t.table}\nSET price = ${np}\nWHERE id = 3;`,
          check: c => near(price(c, 3) ?? null, Number(np)),
          after: 'Yellow means changed.',
        },
        {
          id: 's2', kind: 'sql',
          task: `${r[4].name} just sold out. Set its stock to 0.`,
          starter: `UPDATE ${t.table}\nSET ___\nWHERE ___;`,
          hint: `It is row 5. SET stock = 0 WHERE id = 5`,
          solution: `UPDATE ${t.table}\nSET stock = 0\nWHERE id = 5;`,
          check: c => {
            const row = rowsOf(c, t.table).find(x => col(x, 'id') === 5);
            if (!row || col(row, 'stock') !== 0) return false;
            return onlyChanged(c, t.table, [5]) || 'Other rows changed too. Press Undo, and make the WHERE pick only that one row.';
          },
        },
        {
          id: 's3', kind: 'predict',
          question: 'How many rows will this change?',
          code: `UPDATE ${t.table}\nSET price = price + 1\nWHERE category = '${c0}';`,
          options: options(nC0).map(String),
          answer: options(nC0).indexOf(nC0),
          why: options(nC0).map(n => (n === nC0 ? `Right. Every ${c0} row matches, and each gets a dollar more.` : `Count the ${c0} rows in the table.`)),
          run: `UPDATE ${t.table} SET price = price + 1 WHERE category = '${c0}';`,
        },
        {
          id: 's4', kind: 'sql',
          say: 'Now break something. On purpose.',
          task: 'This UPDATE has no WHERE. Run it.',
          starter: `UPDATE ${t.table}\nSET price = 0;`,
          check: c => rowsOf(c, t.table).every(x => col(x, 'price') === 0),
          after: 'Every price is now 0. No WHERE means every row. Real databases have no undo button.',
        },
        {
          id: 's5', kind: 'sql',
          say: 'This one does.',
          task: 'Press Undo to bring the prices back.',
          check: c => rowsOf(c, t.table).every(x => col(x, 'price') !== 0) || false,
          after: 'Phew. In real life, always write the WHERE first.',
        },
        {
          id: 's6', kind: 'sql',
          task: `Give every ${c1} ${t.thing} a 10% price rise.`,
          starter: `UPDATE ${t.table}\nSET price = ___\nWHERE ___;`,
          hint: `10% more is price * 1.1. Only for category '${c1}'.`,
          solution: `UPDATE ${t.table}\nSET price = price * 1.1\nWHERE category = '${c1}';`,
          check: c => {
            const before = c.start[t.table] ?? [];
            const now = rowsOf(c, t.table);
            if (now.length !== before.length) return false;
            let hit = 0;
            for (const b of before) {
              const n = now.find(x => col(x, 'id') === col(b, 'id'));
              if (!n) return false;
              const p0 = col(b, 'price') as number;
              const p1 = col(n, 'price') as number;
              if (same(col(b, 'category')!, c1)) {
                if (!near(p1, Math.round(p0 * 1.1 * 100) / 100)) return p1 === p0 ? false : `Check the ${c1} prices: each should be 10% higher than it was.`;
                hit++;
              } else if (p1 !== p0) return `Only ${c1} prices should change. Undo and check the WHERE.`;
            }
            return hit > 0;
          },
          after: 'That is the everyday UPDATE: a calculation, and a WHERE.',
        },
      ];
    },
  },

  {
    id: 'L6', n: 6, title: 'Remove things', tagline: 'DELETE: taking rows out, carefully.',
    learn: ['DELETE FROM ... WHERE', 'DELETE without WHERE', 'DELETE vs DROP TABLE'],
    start: t => `${fullTableSql(t)}\nCREATE TABLE old_prices (id INT, price DECIMAL(6,2));\nINSERT INTO old_prices VALUES (1, 3.00), (2, 4.00);`,
    steps: t => {
      return [
        {
          id: 's1', kind: 'sql',
          say: 'DELETE FROM removes rows. Always with a WHERE.',
          task: 'Run it and watch row 8.',
          starter: `DELETE FROM ${t.table}\nWHERE id = 8;`,
          check: c => !rowsOf(c, t.table).some(x => col(x, 'id') === 8),
          after: 'Red means gone.',
        },
        {
          id: 's2', kind: 'sql',
          task: `Delete every ${t.thing} that has no stock left.`,
          hint: 'No stock left means stock = 0.',
          solution: `DELETE FROM ${t.table}\nWHERE stock = 0;`,
          check: c => {
            const before = c.start[t.table] ?? [];
            const now = rowsOf(c, t.table);
            const zeros = before.filter(r => col(r, 'stock') === 0).length;
            if (now.some(r => col(r, 'stock') === 0)) return false;
            if (now.length === before.length - zeros) return true;
            return now.length < before.length - zeros ? 'Too many rows went. Press Undo and check your WHERE.' : false;
          },
        },
        {
          id: 's3', kind: 'predict',
          question: 'And this one, with no WHERE?',
          code: `DELETE FROM ${t.table};`,
          options: ['Deletes the whole table', 'Deletes every row, keeps the table', 'Error: WHERE is required'],
          answer: 1,
          why: [
            'Close, but the table itself stays. Only the rows go.',
            'Right. An empty table is left behind.',
            'MySQL does not require a WHERE. That is exactly why this is dangerous.',
          ],
          run: `DELETE FROM ${t.table};`,
        },
        {
          id: 's4', kind: 'sql',
          task: 'Press Undo to get the rows back.',
          check: c => rowsOf(c, t.table).length > 0 || false,
        },
        {
          id: 's5', kind: 'choose',
          question: 'You want the old_prices table gone completely, structure and all. Which one?',
          options: ['DELETE FROM old_prices;', 'DROP TABLE old_prices;'],
          answer: 1,
          why: ['That empties it, but the table stays.', 'Right. DROP removes the table itself.'],
        },
        {
          id: 's6', kind: 'sql',
          task: 'Do it: remove the old_prices table.',
          solution: 'DROP TABLE old_prices;',
          check: c => {
            if (!hasTable(c, t.table)) return `Oops, that was ${t.table}. Press Undo.`;
            return !hasTable(c, 'old_prices');
          },
          after: `old_prices is gone, and ${t.table} is untouched.`,
        },
      ];
    },
  },

  {
    id: 'L7', n: 7, title: 'House rules', tagline: 'Keys and rules that keep bad data out.',
    learn: ['PRIMARY KEY and AUTO_INCREMENT', 'NOT NULL and UNIQUE', 'DEFAULT'],
    start: t => `CREATE DATABASE ${t.db};\nUSE ${t.db};`,
    steps: () => {
      const custs = (c: CheckCtx) => rowsOf(c, 'customers');
      return [
        {
          id: 's1', kind: 'sql',
          say:
            'Rules make the database say no to bad data:\n' +
            '- `PRIMARY KEY` every row gets its own id\n' +
            '- `AUTO_INCREMENT` the database counts the ids for you\n' +
            '- `NOT NULL` can not be left empty\n' +
            '- `UNIQUE` no repeats\n' +
            '- `DEFAULT` used when you leave it out',
          task: 'Run it.',
          starter:
            'CREATE TABLE customers (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  email VARCHAR(50) NOT NULL UNIQUE,\n  name VARCHAR(40) NOT NULL,\n  city VARCHAR(30) DEFAULT \'Auckland\'\n);',
          check: c => hasTable(c, 'customers'),
        },
        {
          id: 's2', kind: 'sql',
          say: 'There is no id and no city in this INSERT.',
          task: 'Run it and look at the new row.',
          starter: "INSERT INTO customers (email, name)\nVALUES ('mia@mail.com', 'Mia');",
          check: c => custs(c).some(r => same(col(r, 'email')!, 'mia@mail.com') && col(r, 'id') !== null && same(col(r, 'city')!, 'Auckland')),
          after: 'The database gave Mia id 1, and Auckland as her city.',
        },
        {
          id: 's3', kind: 'predict',
          question: 'Same email again?',
          code: "INSERT INTO customers (email, name)\nVALUES ('mia@mail.com', 'Mia Two');",
          options: ['Adds a second row', 'An error'],
          answer: 1,
          why: ['email is UNIQUE, so a repeat is refused.', 'Right. email is UNIQUE. No repeats allowed.'],
          run: "INSERT INTO customers (email, name) VALUES ('mia@mail.com', 'Mia Two');",
        },
        {
          id: 's4', kind: 'predict',
          question: 'No name this time?',
          code: "INSERT INTO customers (email)\nVALUES ('leo@mail.com');",
          options: ['Adds Leo with an empty name', 'An error'],
          answer: 1,
          why: ['name is NOT NULL and has no DEFAULT, so it must be given.', 'Right. name is NOT NULL, and there is no default to fall back on.'],
          run: "INSERT INTO customers (email) VALUES ('leo@mail.com');",
        },
        {
          id: 's5', kind: 'sql',
          task: 'Add two more customers. One of them lives in Wellington.',
          hint: "Give the Wellington one a city: INSERT INTO customers (email, name, city) VALUES (...)",
          solution:
            "INSERT INTO customers (email, name) VALUES ('ana@mail.com', 'Ana');\nINSERT INTO customers (email, name, city) VALUES ('raj@mail.com', 'Raj', 'Wellington');",
          check: c => {
            const now = custs(c);
            const added = now.length - (c.start.customers?.length ?? 0);
            if (added >= 2 && now.some(r => same(col(r, 'city')!, 'Wellington'))) return true;
            if (added >= 2) return 'Two added. Now make sure one of them has Wellington as the city.';
            return false;
          },
        },
        {
          id: 's6', kind: 'sql',
          say: 'Your turn to be the troublemaker.',
          task: 'Write an INSERT that the rules refuse. Any rule will do.',
          hint: 'Try a repeat email, or leave out the name.',
          solution: "INSERT INTO customers (email, name) VALUES ('mia@mail.com', 'Copycat');",
          check: c => c.history.some(r => r.kind === 'INSERT' && !r.ok && [1062, 1048, 1364, 1406].includes(r.error?.code ?? 0)),
          after: 'The rules held. That is their whole job.',
        },
      ];
    },
  },

  {
    id: 'L8', n: 8, title: 'Boss level', tagline: 'Build a small database from nothing, on your own.',
    learn: ['Everything so far, with no help'],
    start: () => '',
    steps: t => {
      const club = t.club;
      const m = (c: CheckCtx) => c.engine.meta('members', club);
      const col_ = (c: CheckCtx, n: string) => m(c)?.columns.find(x => x.name.toLowerCase() === n);
      const did = (c: CheckCtx, kind: string) =>
        c.levelHistory.some(r => r.ok && r.kind === kind && (r.affected ?? 0) > 0 && r.table?.toLowerCase() === 'members');
      return [
        {
          id: 'boss', kind: 'boss',
          say: `Your ${t.business.replace(/^an? /, '')} wants a loyalty club. Build it from nothing. The list ticks itself off as you go.`,
          task: 'Tick everything off.',
          hint: 'Go in order: database, USE, table, rows, then UPDATE and DELETE.',
          solution:
            `CREATE DATABASE ${club};\nUSE ${club};\nCREATE TABLE members (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(40) NOT NULL,\n  email VARCHAR(50) UNIQUE,\n  points INT DEFAULT 0\n);\n` +
            "INSERT INTO members (name, email) VALUES\n  ('Ana', 'ana@mail.com'),\n  ('Ben', 'ben@mail.com'),\n  ('Cai', 'cai@mail.com'),\n  ('Dee', 'dee@mail.com');\n" +
            "UPDATE members SET points = 50 WHERE id = 1;\nDELETE FROM members WHERE id = 4;",
          items: [
            { label: `A database called ${club}`, check: c => c.engine.hasDatabase(club) },
            { label: 'A members table inside it', check: c => !!m(c) },
            { label: 'id numbers itself (AUTO_INCREMENT PRIMARY KEY)', check: c => !!col_(c, 'id')?.autoInc && m(c)!.pk.map(x => x.toLowerCase()).join() === 'id' },
            { label: 'name can not be left empty', check: c => !!col_(c, 'name')?.notNull },
            { label: 'email can not repeat', check: c => !!m(c)?.uniques.some(u => u.length === 1 && u[0].toLowerCase() === 'email') || (m(c)?.pk.length === 1 && m(c)?.pk[0].toLowerCase() === 'email') },
            { label: 'points is a whole number that starts at 0', check: c => col_(c, 'points')?.base === 'int' && String(col_(c, 'points')?.default) === '0' },
            { label: 'At least 4 members added', check: c => !!m(c) && c.levelHistory.some(r => r.ok && r.kind === 'INSERT' && r.table?.toLowerCase() === 'members') && rowsOf(c, 'members', club).length + countDeleted(c) >= 4 },
            { label: 'One member has 50 points (use UPDATE)', check: c => did(c, 'UPDATE') && rowsOf(c, 'members', club).some(r => col(r, 'points') === 50) },
            { label: 'One member removed (use DELETE)', check: c => did(c, 'DELETE') },
          ],
          after: 'You built a database from scratch. That is basic SQL, done.',
        },
      ];
    },
  },
];

function countDeleted(c: CheckCtx) {
  return c.levelHistory.filter(r => r.ok && r.kind === 'DELETE' && r.table?.toLowerCase() === 'members').reduce((s, r) => s + (r.affected ?? 0), 0);
}

export const LEVEL_IDS = LEVELS.map(l => l.id);
export const LEVEL_TITLES = Object.fromEntries(LEVELS.map(l => [l.id, `${l.n}. ${l.title}`]));

export const STEP_XP = 10;
export const LEVEL_BONUS = 25;

export function starsFor(shown: number) {
  return shown === 0 ? 3 : shown <= 2 ? 2 : 1;
}
