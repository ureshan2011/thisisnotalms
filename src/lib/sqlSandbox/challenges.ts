// ─── "Think you know SQL?" — the challenge track ──────────────────────────
// Built only from the basic commands, but each one hides a trap that catches
// SQL that is "roughly right":
//   - statement order (a raise applied twice)
//   - NULL never equals anything, not even "not Auckland"
//   - UNIQUE checked row by row
//   - a WHERE whose column the SET just changed
//   - foreign keys that cascade, set NULL, or refuse
//
// Two things make a pasted chatbot answer unreliable:
//   1. Every student's data comes from their own ID, so no two students
//      share an answer, and the numbers in a generic answer won't fit.
//   2. Most challenges are marked on hidden data as well as the visible
//      data. SQL that only fits the rows on screen (WHERE id IN (2, 7))
//      fails the hidden tests.

import type { SqlJsStatic } from 'sql.js';
import { SqlEngine, type Cell, type Kind, type ResultSet } from './engine';
import { rng, sqlStr } from './themes';

export interface Brief {
  story: string;
  rules: string[];
  ask: string;
  /** Code to show under the brief, e.g. what the intern ran. */
  code?: { label: string; sql: string };
}

export interface Panel {
  title: string;
  note?: string;
  table: ResultSet;
  /** Cells to highlight: "row:col" (0-based). */
  marks?: string[];
}

export interface PredictSpec {
  fields: { key: string; label: string }[];
  /** The statement whose effect is being predicted. */
  action: (seed: string, variant: number) => string;
  /** Statement kinds allowed in the workspace before the prediction is in. */
  lookOnly: Kind[];
}

export interface UndoSpec {
  reversible: (seed: string) => boolean;
  reasons: string[];
  correct: number;
}

export interface Challenge {
  id: string;
  n: number;
  title: string;
  skill: string;
  stars: 1 | 2 | 3;
  mode: 'script' | 'predict' | 'undo';
  brief: (seed: string, variant: number) => Brief;
  setup: (seed: string, variant: number) => string;
  /** How many hidden datasets the answer is also marked on. */
  hidden: number;
  /** Data-changing statement kinds a submission may use. */
  allow?: Kind[];
  ban?: Kind[];
  maxChanges?: number;
  starter?: (seed: string) => string;
  check?: (e: SqlEngine, seed: string, variant: number) => true | string;
  panels?: (seed: string) => Panel[];
  predict?: PredictSpec;
  undo?: UndoSpec;
}

const PEOPLE = [
  'Aroha', 'Ben', 'Chloe', 'Dev', 'Ella', 'Finn', 'Grace', 'Hemi', 'Isla', 'Jack', 'Kiri', 'Liam', 'Mia', 'Noah',
  'Olivia', 'Priya', 'Quinn', 'Ruby', 'Sam', 'Tama', 'Uma', 'Vik', 'Wiremu', 'Xin', 'Yusuf', 'Zoe',
];
const CITIES = ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Dunedin', 'Tauranga', 'Napier'];

const r2 = (n: number) => Math.round(n * 100) / 100;
const fmt = (n: number) => n.toFixed(2);
const near = (a: Cell, b: number) => typeof a === 'number' && Math.abs(a - b) < 0.011;
const insert = (table: string, cols: string[], rows: (string | number | null)[][]) =>
  `INSERT INTO ${table} (${cols.join(', ')}) VALUES\n` +
  rows.map(r => '  (' + r.map(v => (v === null ? 'NULL' : typeof v === 'number' ? String(v) : sqlStr(v))).join(', ') + ')').join(',\n') + ';';
const rs = (columns: string[], rows: Cell[][]): ResultSet => ({ columns, rows });
const get = (row: Record<string, Cell>, k: string) => row[Object.keys(row).find(x => x.toLowerCase() === k) ?? k];

// ── 1. Pay rise ────────────────────────────────────────────────────────────

function payData(seed: string, v: number) {
  const T = rng(`${seed}|pay`).pick([45000, 48000, 50000, 52000, 55000]);
  const r = rng(`${seed}|pay|${v}`);
  const names = r.shuffle(PEOPLE).slice(0, 10);
  const lo = Math.ceil(T / 1.1 / 100) + 1;
  const hi = Math.floor(T / 100) - 1;
  const sal: number[] = [];
  for (let i = 0; i < 3; i++) sal.push(r.int(lo, hi) * 100); // cross the line after +10%
  sal.push(T);
  for (let i = 0; i < 6; i++) sal.push(r.next() < 0.5 ? r.int(300, lo - 2) * 100 : r.int(hi + 2, 950) * 100);
  const order = r.shuffle(sal);
  return { T, rows: names.map((name, i) => ({ id: i + 1, name, salary: order[i] })) };
}

const payrise: Challenge = {
  id: 'c1', n: 1, title: 'Pay rise', skill: 'UPDATE order', stars: 1, mode: 'script', hidden: 3,
  allow: ['UPDATE'],
  brief: seed => {
    const { T } = payData(seed, 0);
    return {
      story: 'Payday. The boss promised everyone a raise, and left you to do it.',
      rules: [`Earning under $${T.toLocaleString()}: +10%`, `Earning $${T.toLocaleString()} or more: +5%`, 'Everyone gets exactly one raise'],
      ask: 'Write the UPDATE statement(s) for the staff table.',
    };
  },
  setup: (seed, v) => {
    const { rows } = payData(seed, v);
    return `CREATE DATABASE payroll;\nUSE payroll;\nCREATE TABLE staff (\n  id INT PRIMARY KEY,\n  name VARCHAR(30) NOT NULL,\n  salary DECIMAL(10,2) NOT NULL\n);\n${insert('staff', ['id', 'name', 'salary'], rows.map(x => [x.id, x.name, x.salary]))}`;
  },
  starter: () => '-- Your UPDATE statement(s) here\n',
  check: (e, seed, v) => {
    const { T, rows } = payData(seed, v);
    const now = e.rows('staff', 'payroll');
    if (now.length !== rows.length) return 'Someone is missing from the staff table.';
    for (const x of rows) {
      const want = r2(x.salary < T ? x.salary * 1.1 : x.salary * 1.05);
      const got = get(now.find(n => get(n, 'id') === x.id) ?? {}, 'salary');
      if (!near(got ?? null, want)) {
        if (near(got ?? null, r2(x.salary * 1.1 * 1.05))) return `${x.name} got two raises.`;
        return `${x.name} should end on ${fmt(want)}, not ${typeof got === 'number' ? fmt(got) : got}.`;
      }
    }
    return true;
  },
};

// ── 2. Outside the city ───────────────────────────────────────────────────

function cityData(seed: string, v: number) {
  const C = rng(`${seed}|city`).pick(CITIES.slice(0, 5));
  const r = rng(`${seed}|city|${v}`);
  const others = CITIES.filter(c => c !== C);
  const names = r.shuffle(PEOPLE).slice(0, 12);
  const cities: (string | null)[] = [C, C, C, C, ...Array.from({ length: 5 }, () => r.pick(others)), null, null, null];
  const order = r.shuffle(cities);
  return { C, rows: names.map((holder, i) => ({ id: 100 + i * 7, holder, city: order[i] })) };
}

const outside: Challenge = {
  id: 'c2', n: 2, title: 'Outside the city', skill: 'DELETE and NULL', stars: 1, mode: 'script', hidden: 3,
  allow: ['DELETE'],
  brief: seed => {
    const { C } = cityData(seed, 0);
    return {
      story: `The bank is closing every branch except ${C}.`,
      rules: [`Delete every account that is not in ${C}`, 'Accounts with no city on file go too'],
      ask: 'Write the DELETE statement(s) for the accounts table.',
    };
  },
  setup: (seed, v) => {
    const { rows } = cityData(seed, v);
    return `CREATE DATABASE bank;\nUSE bank;\nCREATE TABLE accounts (\n  id INT PRIMARY KEY,\n  holder VARCHAR(30) NOT NULL,\n  city VARCHAR(30)\n);\n${insert('accounts', ['id', 'holder', 'city'], rows.map(x => [x.id, x.holder, x.city]))}`;
  },
  starter: () => '-- Your DELETE statement(s) here\n',
  check: (e, seed, v) => {
    const { C, rows } = cityData(seed, v);
    const left = new Set(e.rows('accounts', 'bank').map(r => get(r, 'id')));
    const keep = rows.filter(r => r.city === C);
    if (keep.some(r => !left.has(r.id))) return `Some ${C} accounts were deleted too.`;
    const extra = rows.filter(r => r.city !== C && left.has(r.id));
    if (extra.some(r => r.city === null)) return 'The accounts with no city are still there.';
    if (extra.length) return `Some accounts outside ${C} are still there.`;
    return true;
  },
};

// ── 3. Swap ────────────────────────────────────────────────────────────────

const HANDLES = ['sunny_k', 'duckfan', 'night_owl', 'pixelpete', 'kiwi_kid', 'blue_moon', 'taco_tim', 'zen_zoe', 'rocket99', 'mapleleaf', 'quiet_q', 'lucky_lu'];

function swapData(seed: string) {
  const r = rng(`${seed}|swap`);
  const names = r.shuffle(HANDLES).slice(0, 8);
  const ids = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
  return { a: ids[0], b: ids[1], rows: names.map((username, i) => ({ id: i + 1, username })) };
}

const swap: Challenge = {
  id: 'c3', n: 3, title: 'Swap', skill: 'UPDATE and UNIQUE', stars: 2, mode: 'script', hidden: 0,
  allow: ['UPDATE'],
  brief: seed => {
    const { a, b, rows } = swapData(seed);
    return {
      story: `User ${a} (${rows[a - 1].username}) and user ${b} (${rows[b - 1].username}) want to swap usernames.`,
      rules: ['username is UNIQUE, and stays that way', 'Nobody gets deleted or re-added', "Don't change the table itself"],
      ask: 'Swap them.',
    };
  },
  setup: seed => {
    const { rows } = swapData(seed);
    return `CREATE DATABASE forum;\nUSE forum;\nCREATE TABLE users (\n  id INT PRIMARY KEY,\n  username VARCHAR(20) NOT NULL UNIQUE\n);\n${insert('users', ['id', 'username'], rows.map(x => [x.id, x.username]))}`;
  },
  starter: () => '-- Your statement(s) here\n',
  check: (e, seed) => {
    const { a, b, rows } = swapData(seed);
    const now = e.rows('users', 'forum');
    const nameOf = (id: number) => get(now.find(r => get(r, 'id') === id) ?? {}, 'username');
    if (nameOf(a) !== rows[b - 1].username || nameOf(b) !== rows[a - 1].username) return `User ${a} should now be ${rows[b - 1].username}, and user ${b} should be ${rows[a - 1].username}.`;
    if (rows.some(r => r.id !== a && r.id !== b && nameOf(r.id) !== r.username)) return 'Someone else\'s username changed too.';
    return true;
  },
};

// ── 4. Money doesn't vanish ──────────────────────────────────────────────────

function fundData(seed: string) {
  const r = rng(`${seed}|fund`);
  const L = r.pick([1000, 1500, 2000, 2500]);
  const names = r.shuffle(PEOPLE).slice(0, 9);
  const bal = [
    L - r.int(10, 60) * 10, L - r.int(5, 40) * 10, L - r.int(1, 20) * 10, L,
    ...Array.from({ length: 5 }, () => L + r.int(5, 300) * 10),
  ];
  const order = r.shuffle(bal);
  const rows = names.map((owner, i) => ({ id: i + 1, owner, balance: order[i] }));
  rows.push({ id: 100, owner: 'Community Fund', balance: L + r.int(20, 150) * 10 });
  return { L, rows };
}

const fund: Challenge = {
  id: 'c4', n: 4, title: "Money doesn't vanish", skill: 'UPDATE with maths', stars: 2, mode: 'script', hidden: 0,
  allow: ['UPDATE'],
  brief: seed => {
    const { L } = fundData(seed);
    return {
      story: 'The co-op runs a Community Fund (account 100). Members with plenty chip in.',
      rules: [
        `Every account with more than $${L.toLocaleString()} gives 10% of the part above $${L.toLocaleString()}`,
        'All of it goes to the Community Fund',
        'The fund itself does not give anything',
        'The total amount of money stays exactly the same',
      ],
      ask: 'Make it happen. A SELECT to work things out first is allowed.',
    };
  },
  setup: seed => {
    const { rows } = fundData(seed);
    return `CREATE DATABASE coop;\nUSE coop;\nCREATE TABLE accounts (\n  id INT PRIMARY KEY,\n  owner VARCHAR(30) NOT NULL,\n  balance DECIMAL(10,2) NOT NULL\n);\n${insert('accounts', ['id', 'owner', 'balance'], rows.map(x => [x.id, x.owner, x.balance]))}`;
  },
  starter: () => '-- Your statement(s) here\n',
  check: (e, seed) => fundCheck(e, seed),
};

function fundCheck(e: SqlEngine, seed: string): true | string {
  const { L, rows } = fundData(seed);
  const now = e.rows('accounts', 'coop');
  const bal = (id: number) => get(now.find(r => get(r, 'id') === id) ?? {}, 'balance') as number;
  const total0 = rows.reduce((s, r) => s + r.balance, 0);
  const total1 = now.reduce((s, r) => s + (get(r, 'balance') as number), 0);
  if (Math.abs(total0 - total1) > 0.011) return `Money ${total1 > total0 ? 'appeared' : 'vanished'}: the total was ${fmt(total0)}, now it is ${fmt(total1)}.`;
  let pot = 0;
  for (const r of rows) {
    if (r.id === 100) continue;
    const give = r.balance > L ? r2((r.balance - L) * 0.1) : 0;
    pot += give;
    if (!near(bal(r.id), r.balance - give)) return `${r.owner} should end on ${fmt(r.balance - give)}.`;
  }
  const f = rows.find(r => r.id === 100)!;
  if (!near(bal(100), f.balance + pot)) return `The Community Fund should end on ${fmt(f.balance + pot)}.`;
  return true;
}

// ── 5. Mystery update ───────────────────────────────────────────────────────

const PCATS = ['Snacks', 'Drinks', 'Bakery', 'Dairy'] as const;
const PNAMES: Record<string, string[]> = {
  Snacks: ['Chips', 'Pretzels', 'Nuts', 'Popcorn', 'Crackers'],
  Drinks: ['Cola', 'Juice', 'Water', 'Iced tea', 'Lemonade'],
  Bakery: ['Bagel', 'Muffin', 'Scone', 'Croissant', 'Bun'],
  Dairy: ['Milk', 'Yoghurt', 'Cheese', 'Butter', 'Cream'],
};
interface Prod { id: number; name: string; category: string; price: number; stock: number }

type Rule = { kind: 'catStock' | 'halfZero' | 'stockPrice' | 'orTrap'; X: string; Y: string; P: number };

export function mysteryRule(seed: string): Rule {
  const r = rng(`${seed}|mystery`);
  const [X, Y] = r.shuffle(PCATS);
  return { kind: r.pick(['catStock', 'halfZero', 'stockPrice', 'orTrap'] as const), X, Y, P: r.int(8, 16) };
}

function applyRule(rule: Rule, p: Prod): Prod {
  switch (rule.kind) {
    case 'catStock':
      return p.category === rule.X && p.stock < 10 ? { ...p, price: r2(p.price * 1.2) } : p;
    case 'halfZero':
      return p.stock === 0 ? { ...p, price: r2(p.price * 0.5) } : p;
    case 'stockPrice':
      return p.price > rule.P && p.category !== rule.X ? { ...p, stock: p.stock + 5 } : p;
    case 'orTrap':
      return (p.category === rule.X || p.category === rule.Y) && p.price < rule.P ? { ...p, price: r2(p.price + 2) } : p;
  }
}

function products(seed: string, v: number, tag: string, boundary: (r: ReturnType<typeof rng>) => Omit<Prod, 'id' | 'name'>[]): Prod[] {
  const r = rng(`${seed}|${tag}|${v}`);
  const base: Omit<Prod, 'id' | 'name'>[] = Array.from({ length: 8 }, () => ({
    category: r.pick(PCATS), price: r.int(3, 50) / 2, stock: r.int(0, 20),
  }));
  const all = r.shuffle([...base, ...boundary(r)]);
  return all.map((p, i) => ({ id: i + 1, name: r.pick(PNAMES[p.category]), ...p }));
}

function mysteryData(seed: string, v: number) {
  const rule = mysteryRule(seed);
  const rows = products(seed, v, 'mystery', r => {
    const other = PCATS.find(c => c !== rule.X && c !== rule.Y)!;
    switch (rule.kind) {
      case 'catStock':
        return [
          { category: rule.X, price: r.int(4, 30) / 2, stock: 9 },
          { category: rule.X, price: r.int(4, 30) / 2, stock: 10 },
          { category: rule.X, price: r.int(4, 30) / 2, stock: 0 },
          { category: rule.Y, price: r.int(4, 30) / 2, stock: 3 },
        ];
      case 'halfZero':
        return [
          { category: rule.X, price: r.int(4, 30) / 2, stock: 0 },
          { category: rule.Y, price: r.int(4, 30) / 2, stock: 0 },
          { category: other, price: r.int(4, 30) / 2, stock: 1 },
        ];
      case 'stockPrice':
        return [
          { category: rule.Y, price: rule.P, stock: r.int(0, 20) },
          { category: rule.Y, price: rule.P + 0.5, stock: r.int(0, 20) },
          { category: rule.X, price: rule.P + 5, stock: r.int(0, 20) },
          { category: other, price: rule.P + 3, stock: r.int(0, 20) },
        ];
      case 'orTrap':
        return [
          { category: rule.X, price: rule.P, stock: r.int(0, 20) },
          { category: rule.X, price: rule.P + 4, stock: r.int(0, 20) },
          { category: rule.Y, price: rule.P - 0.5, stock: r.int(0, 20) },
          { category: rule.X, price: rule.P - 3, stock: r.int(0, 20) },
          { category: other, price: rule.P - 5, stock: r.int(0, 20) },
        ];
    }
  });
  return { rule, rows, after: rows.map(p => applyRule(rule, p)) };
}

const productsDdl = (db: string) =>
  `CREATE DATABASE ${db};\nUSE ${db};\nCREATE TABLE products (\n  id INT PRIMARY KEY,\n  name VARCHAR(30) NOT NULL,\n  category VARCHAR(20) NOT NULL,\n  price DECIMAL(6,2) NOT NULL,\n  stock INT NOT NULL\n);\n`;
const productsInsert = (rows: Prod[]) => insert('products', ['id', 'name', 'category', 'price', 'stock'], rows.map(p => [p.id, p.name, p.category, p.price, p.stock]));

function compareProducts(e: SqlEngine, db: string, want: Prod[]): true | string {
  const now = e.rows('products', db);
  if (now.length !== want.length) return 'Rows were added or removed. Only values should change.';
  for (const w of want) {
    const n = now.find(r => get(r, 'id') === w.id);
    if (!n) return `Row ${w.id} is missing.`;
    if (!near(get(n, 'price'), w.price)) return `Row ${w.id} (${w.name}): price should be ${fmt(w.price)}.`;
    if (get(n, 'stock') !== w.stock) return `Row ${w.id} (${w.name}): stock should be ${w.stock}.`;
    if (String(get(n, 'category')) !== w.category) return `Row ${w.id} (${w.name}): category should be ${w.category}.`;
  }
  return true;
}


const mystery: Challenge = {
  id: 'c5', n: 5, title: 'Mystery update', skill: 'Work out the rule', stars: 2, mode: 'script', hidden: 3,
  allow: ['UPDATE'], maxChanges: 1,
  brief: seed => {
    const { rows, after } = mysteryData(seed, 0);
    const changed = rows.filter((r, i) => JSON.stringify(r) !== JSON.stringify(after[i])).length;
    return {
      story: `Someone ran one UPDATE on products last night. It changed ${changed} rows. Nobody saved the statement.`,
      rules: ['Work out the rule from the table below', 'One UPDATE statement', "It will also be tested on other nights' data, so it must be the real rule, not a list of ids"],
      ask: 'Write that UPDATE.',
    };
  },
  setup: (seed, v) => productsDdl('shop') + productsInsert(mysteryData(seed, v).rows),
  starter: () => 'UPDATE products\nSET \nWHERE ;',
  panels: seed => {
    const { rows, after } = mysteryData(seed, 0);
    const marks: string[] = [];
    const cells = rows.map((r, i) => {
      const a = after[i];
      const price = a.price !== r.price ? `${fmt(r.price)} → ${fmt(a.price)}` : fmt(r.price);
      const stock = a.stock !== r.stock ? `${r.stock} → ${a.stock}` : r.stock;
      if (a.price !== r.price) marks.push(`${i}:3`);
      if (a.stock !== r.stock) marks.push(`${i}:4`);
      return [r.id, r.name, r.category, price, stock] as Cell[];
    });
    return [{ title: 'Last night', note: 'changed cells show before → after', table: rs(['id', 'name', 'category', 'price', 'stock'], cells), marks }];
  },
  check: (e, seed, v) => compareProducts(e, 'shop', mysteryData(seed, v).after),
};

// ── 6. Undo the intern ──────────────────────────────────────────────────────

type InternKind = 'U1' | 'U2' | 'U3' | 'U4';

export function internSpec(seed: string) {
  const r = rng(`${seed}|intern`);
  const kind = r.pick(['U1', 'U2', 'U3', 'U4'] as const) as InternKind;
  const X = r.pick(PCATS);
  const P = r.int(8, 14);
  const sql =
    kind === 'U1' ? `UPDATE products SET price = price * 2 + 1 WHERE category = '${X}';`
    : kind === 'U2' ? `UPDATE products SET price = price + 2 WHERE price > ${P};`
    : kind === 'U3' ? 'UPDATE products SET stock = 0 WHERE stock < 5;'
    : `UPDATE products SET price = price + 0.5 WHERE price < ${P};`;
  return { kind, X, P, sql, reversible: kind === 'U1' || kind === 'U2' };
}

function internData(seed: string, v: number) {
  const s = internSpec(seed);
  return products(seed, v, 'intern', r => [
    { category: s.X, price: r.int(4, 30) / 2, stock: r.int(1, 4) },
    { category: s.X, price: s.P, stock: 0 },
    { category: r.pick(PCATS), price: s.P + 0.5, stock: r.int(6, 20) },
  ]);
}

const intern: Challenge = {
  id: 'c6', n: 6, title: 'Undo the intern', skill: 'Can it be undone?', stars: 3, mode: 'undo', hidden: 3,
  allow: ['UPDATE'],
  brief: seed => ({
    story: 'The intern ran one statement on products, then went to lunch. The table you see is after it ran.',
    rules: ['Decide first: can it be undone at all?', 'If it can: write the statement(s) that put every row back exactly', 'If it can not: say why'],
    ask: 'Your call.',
    code: { label: 'What the intern ran', sql: internSpec(seed).sql },
  }),
  setup: (seed, v) => productsDdl('shop') + productsInsert(internData(seed, v)) + '\n' + internSpec(seed).sql,
  starter: () => '-- Your fix here\n',
  check: (e, seed, v) => compareProducts(e, 'shop', internData(seed, v)),
  undo: {
    reversible: seed => internSpec(seed).reversible,
    reasons: [
      'Different starting tables could end up looking exactly like this one, so there is no way to know which it was',
      'An UPDATE can never be undone, whatever it did',
      'Only the person who ran it can undo it',
      'You would need to know the PRIMARY KEY first',
    ],
    correct: 0,
  },
};

// ── 7. Cascade ──────────────────────────────────────────────────────────────

function cascadeData(seed: string, v: number) {
  const r = rng(`${seed}|cascade|${v}`);
  const names = r.shuffle(PEOPLE).slice(0, 6);
  const customers = names.map((name, i) => ({ id: i + 1, name }));
  const orders: { id: number; customer_id: number }[] = [];
  const items: { id: number; order_id: number; product: string }[] = [];
  const reviews: { id: number; customer_id: number; stars: number }[] = [];
  const cards: { id: number; customer_id: number }[] = [];
  const products = ['Lamp', 'Mug', 'Rug', 'Clock', 'Vase', 'Chair', 'Desk', 'Shelf'];
  for (const c of customers) {
    const no = r.int(0, 3);
    for (let k = 0; k < no; k++) {
      const oid = 100 + orders.length + 1;
      orders.push({ id: oid, customer_id: c.id });
      const ni = r.int(1, 3);
      for (let j = 0; j < ni; j++) items.push({ id: 1000 + items.length + 1, order_id: oid, product: r.pick(products) });
    }
    const nr = r.int(0, 2);
    for (let k = 0; k < nr; k++) reviews.push({ id: 500 + reviews.length + 1, customer_id: c.id, stars: r.int(1, 5) });
  }
  const carded = r.shuffle(customers).slice(0, 2).map(c => c.id);
  carded.forEach((cid, i) => cards.push({ id: 900 + i + 1, customer_id: cid }));
  const withOrders = customers.filter(c => orders.some(o => o.customer_id === c.id) && !carded.includes(c.id));
  const trap = r.next() < 0.3 || withOrders.length === 0;
  const target = trap ? r.pick(carded) : r.pick(withOrders).id;
  return { customers, orders, items, reviews, cards, target };
}

const CASCADE_DDL = `CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT,
  product VARCHAR(30),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
CREATE TABLE reviews (
  id INT PRIMARY KEY,
  customer_id INT,
  stars INT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);
CREATE TABLE loyalty_cards (
  id INT PRIMARY KEY,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);`;

const cascade: Challenge = {
  id: 'c7', n: 7, title: 'Cascade', skill: 'Foreign keys', stars: 3, mode: 'predict', hidden: 0,
  brief: (seed, v) => {
    const d = cascadeData(seed, v);
    return {
      story: `Five linked tables. Customer ${d.target} is about to be deleted.`,
      rules: ['Read how the tables are linked (below)', 'You may look around with SELECT first', 'Then predict. Your first answer is the one that counts'],
      ask: 'What happens when this runs?',
      code: { label: 'How the tables are linked', sql: CASCADE_DDL },
    };
  },
  setup: (seed, v) => {
    const d = cascadeData(seed, v);
    return [
      'CREATE DATABASE store;',
      'USE store;',
      CASCADE_DDL,
      insert('customers', ['id', 'name'], d.customers.map(c => [c.id, c.name])),
      d.orders.length ? insert('orders', ['id', 'customer_id'], d.orders.map(o => [o.id, o.customer_id])) : '',
      d.items.length ? insert('order_items', ['id', 'order_id', 'product'], d.items.map(i => [i.id, i.order_id, i.product])) : '',
      d.reviews.length ? insert('reviews', ['id', 'customer_id', 'stars'], d.reviews.map(x => [x.id, x.customer_id, x.stars])) : '',
      insert('loyalty_cards', ['id', 'customer_id'], d.cards.map(x => [x.id, x.customer_id])),
    ].filter(Boolean).join('\n');
  },
  predict: {
    fields: [
      { key: 'customers', label: 'Rows removed from customers' },
      { key: 'orders', label: 'Rows removed from orders' },
      { key: 'order_items', label: 'Rows removed from order_items' },
      { key: 'reviews', label: 'Reviews left with no customer (NULL)' },
    ],
    action: (seed, v) => `DELETE FROM customers WHERE id = ${cascadeData(seed, v).target};`,
    lookOnly: ['SELECT', 'SHOW_TABLES', 'SHOW_DATABASES', 'DESCRIBE', 'USE'],
  },
};

/** The true effect of the cascade delete, worked out by running it on a copy. */
export function cascadeAnswer(SQL: SqlJsStatic, seed: string, v: number): Record<string, number> {
  const e = new SqlEngine(SQL);
  e.run(cascade.setup(seed, v));
  const count = (t: string) => e.rows(t, 'store').length;
  const nulls = () => e.rows('reviews', 'store').filter(r => get(r, 'customer_id') === null).length;
  const before = { customers: count('customers'), orders: count('orders'), order_items: count('order_items'), reviews: nulls() };
  e.run(cascade.predict!.action(seed, v));
  return {
    customers: before.customers - count('customers'),
    orders: before.orders - count('orders'),
    order_items: before.order_items - count('order_items'),
    reviews: nulls() - before.reviews,
  };
}

// ── 8. Make these fail ──────────────────────────────────────────────────────

export const GAUNTLET = [
  "INSERT INTO bookings (code, guest, nights, email) VALUES ('B01', 'Ana', 2, 'ana@mail.com');",
  "INSERT INTO bookings (code, guest, nights, email) VALUES ('B02', 'Ben', 0, 'ben@mail.com');",
  "INSERT INTO bookings (code, guest, nights, email) VALUES ('B01', 'Cai', 1, 'cai@mail.com');",
  "INSERT INTO bookings (code, guest, nights, email) VALUES ('B03', NULL, 1, 'dev@mail.com');",
  "INSERT INTO bookings (code, guest, nights, email) VALUES ('B04', 'Eli', 3, 'ana@mail.com');",
  "INSERT INTO bookings (code, guest, nights, email) VALUES ('B05', 'Florence-Margaret Smythe', 2, 'flo@mail.com');",
  "INSERT INTO bookings (code, guest, email) VALUES ('B06', 'Gus', 'gus@mail.com');",
  "INSERT INTO bookings (code, guest, nights, email) VALUES ('B07', 'Hana', 45, 'hana@mail.com');",
  "INSERT INTO bookings (code, guest, nights, email) VALUES ('B08', 'Ivan', 2, NULL);",
  "INSERT INTO bookings (code, guest, nights, email) VALUES ('B009', 'Jade', 1, 'jade@mail.com');",
];

export function gauntletFails(seed: string): number[] {
  const r = rng(`${seed}|gauntlet`);
  return r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((a, b) => a - b);
}

const gauntlet: Challenge = {
  id: 'c8', n: 8, title: 'Make these fail', skill: 'Table rules', stars: 3, mode: 'script', hidden: 0,
  allow: ['CREATE_TABLE'], maxChanges: 1,
  brief: seed => {
    const fails = gauntletFails(seed).map(i => `#${i + 1}`);
    return {
      story: 'Ten bookings are about to be inserted into a hotel table that does not exist yet. You design it.',
      rules: [
        'One CREATE TABLE bookings, with columns code, guest, nights and email',
        `Exactly these inserts must be refused: ${fails.join(', ')}`,
        'Every other insert must work',
        'The inserts run in order, #1 first',
      ],
      ask: 'Write the CREATE TABLE. Test it here as often as you like (DROP TABLE bookings; to start over).',
      code: { label: 'The ten inserts', sql: GAUNTLET.map((s, i) => `-- #${i + 1}\n${s}`).join('\n') },
    };
  },
  setup: () => 'CREATE DATABASE hotel;\nUSE hotel;',
  starter: () => 'CREATE TABLE bookings (\n  code ,\n  guest ,\n  nights ,\n  email \n);',
  check: (e, seed) => {
    if (!e.meta('bookings', 'hotel')) return 'There is no bookings table.';
    const must = new Set(gauntletFails(seed));
    const wrong: string[] = [];
    GAUNTLET.forEach((sql, i) => {
      const out = e.run(sql);
      const failed = !out.ok;
      if (failed && !must.has(i)) wrong.push(`#${i + 1} should work, but was refused (${out.results[0]?.error?.mysql ?? 'error'})`);
      if (!failed && must.has(i)) wrong.push(`#${i + 1} should be refused, but it went in`);
    });
    return wrong.length ? wrong.slice(0, 3).join('. ') + '.' : true;
  },
};

export const CHALLENGES: Challenge[] = [payrise, outside, swap, fund, mystery, intern, cascade, gauntlet];

export const challengeXp = (c: Challenge) => c.stars * 40;

// ── Marking ────────────────────────────────────────────────────────────────

export interface TestResult {
  label: string;
  ok: boolean;
  msg?: string;
}

const READ_KINDS: Kind[] = ['SELECT', 'SHOW_TABLES', 'SHOW_DATABASES', 'DESCRIBE', 'USE'];

/**
 * Run a submission on a fresh copy of the visible data, then on each hidden
 * dataset. Hidden results never reveal the hidden data itself.
 */
export function grade(SQL: SqlJsStatic, ch: Challenge, seed: string, script: string): { tests: TestResult[]; solved: boolean } {
  const tests: TestResult[] = [];
  for (let v = 0; v <= ch.hidden; v++) {
    const label = v === 0 ? 'Your data' : `Hidden test ${v}`;
    const e = new SqlEngine(SQL);
    e.run(ch.setup(seed, v));
    const out = e.run(script);
    if (v > 0 && !tests[0].ok) {
      tests.push({ label, ok: false, msg: 'Runs once your own data passes.' });
      continue;
    }
    if (!out.ok) {
      const err = out.results.find(r => !r.ok)?.error;
      tests.push({ label, ok: false, msg: v === 0 ? `Your SQL stopped with an error: ${err?.plain ?? err?.mysql}` : `Your SQL hit an error on this data: ${err?.mysql}` });
      continue;
    }
    if (v === 0) {
      const changes = out.results.filter(r => !READ_KINDS.includes(r.kind));
      const banned = changes.find(r => (ch.allow && !ch.allow.includes(r.kind)) || ch.ban?.includes(r.kind));
      if (!changes.length) {
        tests.push({ label, ok: false, msg: 'Nothing changed yet. Your submission needs statements that change the data.' });
        break;
      }
      if (banned) {
        tests.push({ label, ok: false, msg: `This one is done with ${ch.allow?.join(' / ').replace('_', ' ')} only. "${banned.raw.split('\n')[0]}" is not allowed here.` });
        break;
      }
      if (ch.maxChanges && changes.length > ch.maxChanges) {
        tests.push({ label, ok: false, msg: `Use at most ${ch.maxChanges} statement${ch.maxChanges === 1 ? '' : 's'} that change data. You used ${changes.length}.` });
        break;
      }
    }
    const res = ch.check!(e, seed, v);
    tests.push(
      res === true
        ? { label, ok: true }
        : { label, ok: false, msg: v === 0 ? res : 'Works on your data, but not on this data. Is it the general rule, or does it only fit the rows you can see?' },
    );
  }
  for (let v = tests.length; v <= ch.hidden; v++) tests.push({ label: `Hidden test ${v}`, ok: false, msg: 'Runs once your own data passes.' });
  return { tests, solved: tests.every(t => t.ok) };
}
