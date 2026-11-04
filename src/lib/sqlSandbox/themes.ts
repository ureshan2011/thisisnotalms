// ─── Every student runs a different business ──────────────────────────────
// The student ID picks one of eight small shops. Lessons are the same for
// everyone; the database name, table name and rows are not, so two people
// sitting side by side can't just copy each other's screen.

export interface Item {
  name: string;
  cat: string;
  price: number;
  stock: number;
}

export interface Theme {
  key: string;
  /** "a café" */
  business: string;
  db: string;
  table: string;
  thing: string;
  things: string;
  /** Exactly 8 rows. Categories: three of the first, three of the second, two of the third. */
  rows: Item[];
  /** A one-word item that is not in rows, for the "forgot the quotes" moment. */
  oneWord: { name: string; price: number };
  /** Name of the loyalty-club database in the boss level. */
  club: string;
}

const T = (name: string, cat: string, price: number, stock: number): Item => ({ name, cat, price, stock });

export const THEMES: Theme[] = [
  {
    key: 'cafe', business: 'a café', db: 'cafe', table: 'menu', thing: 'menu item', things: 'menu items',
    rows: [
      T('Flat white', 'Drinks', 4.5, 20), T('Long black', 'Drinks', 4.0, 15), T('Chai latte', 'Drinks', 5.2, 0),
      T('Bagel', 'Food', 7.5, 8), T('Toastie', 'Food', 9.0, 12), T('Avocado toast', 'Food', 14.5, 4),
      T('Muffin', 'Cakes', 3.8, 0), T('Carrot cake', 'Cakes', 5.5, 3),
    ],
    oneWord: { name: 'Croissant', price: 4.9 }, club: 'cafe_club',
  },
  {
    key: 'books', business: 'a bookshop', db: 'bookshop', table: 'books', thing: 'book', things: 'books',
    rows: [
      T('The Long Road', 'Fiction', 24.99, 5), T('Night Train', 'Fiction', 19.5, 0), T('Blue Harbour', 'Fiction', 22.0, 7),
      T('Tiny Tiger', 'Kids', 12.99, 14), T('Space Pups', 'Kids', 9.99, 0), T('Dino Days', 'Kids', 11.5, 3),
      T('Easy Curries', 'Cooking', 34.0, 4), T('Bread Basics', 'Cooking', 29.5, 9),
    ],
    oneWord: { name: 'Atlas', price: 45.0 }, club: 'book_club',
  },
  {
    key: 'bakery', business: 'a bakery', db: 'bakery', table: 'products', thing: 'product', things: 'products',
    rows: [
      T('Sourdough', 'Bread', 8.5, 10), T('Rye loaf', 'Bread', 7.8, 0), T('Bagel pack', 'Bread', 6.0, 18),
      T('Mince pie', 'Pies', 6.5, 12), T('Steak pie', 'Pies', 7.2, 4), T('Apple pie', 'Pies', 5.9, 0),
      T('Donut', 'Sweets', 3.0, 20), T('Eclair', 'Sweets', 4.5, 6),
    ],
    oneWord: { name: 'Pretzel', price: 3.8 }, club: 'bakery_club',
  },
  {
    key: 'pets', business: 'a pet shop', db: 'petshop', table: 'products', thing: 'product', things: 'products',
    rows: [
      T('Dog bed', 'Dogs', 59.0, 3), T('Chew toy', 'Dogs', 12.5, 0), T('Dog lead', 'Dogs', 18.0, 9),
      T('Cat tree', 'Cats', 89.0, 2), T('Scratch pad', 'Cats', 15.0, 11), T('Cat treats', 'Cats', 6.5, 0),
      T('Fish tank', 'Fish', 120.0, 1), T('Fish food', 'Fish', 7.9, 25),
    ],
    oneWord: { name: 'Collar', price: 22.0 }, club: 'pet_club',
  },
  {
    key: 'cinema', business: 'a cinema', db: 'cinema', table: 'snacks', thing: 'snack', things: 'snacks',
    rows: [
      T('Small popcorn', 'Popcorn', 6.0, 40), T('Large popcorn', 'Popcorn', 9.5, 25), T('Caramel corn', 'Popcorn', 10.5, 0),
      T('Cola', 'Drinks', 4.5, 30), T('Iced tea', 'Drinks', 4.8, 12), T('Bottled water', 'Drinks', 3.0, 0),
      T('Choc bar', 'Sweets', 3.5, 18), T('Gummy bears', 'Sweets', 4.0, 7),
    ],
    oneWord: { name: 'Nachos', price: 8.0 }, club: 'movie_club',
  },
  {
    key: 'florist', business: 'a florist', db: 'florist', table: 'flowers', thing: 'flower', things: 'flowers',
    rows: [
      T('Red roses', 'Roses', 45.0, 6), T('White roses', 'Roses', 42.0, 0), T('Pink roses', 'Roses', 40.0, 9),
      T('Lily bunch', 'Lilies', 35.0, 4), T('Tiger lily', 'Lilies', 38.0, 0), T('Calla lily', 'Lilies', 32.0, 5),
      T('Fern', 'Plants', 19.5, 12), T('Monstera', 'Plants', 49.0, 2),
    ],
    oneWord: { name: 'Orchid', price: 55.0 }, club: 'flower_club',
  },
  {
    key: 'phones', business: 'a phone shop', db: 'phoneshop', table: 'gadgets', thing: 'gadget', things: 'gadgets',
    rows: [
      T('Basic phone', 'Phones', 199.0, 4), T('Camera phone', 'Phones', 899.0, 0), T('Big screen phone', 'Phones', 1099.0, 2),
      T('Clear case', 'Cases', 19.0, 30), T('Leather case', 'Cases', 49.0, 0), T('Flip case', 'Cases', 29.0, 8),
      T('Fast charger', 'Chargers', 35.0, 12), T('Car charger', 'Chargers', 25.0, 8),
    ],
    oneWord: { name: 'Earbuds', price: 79.0 }, club: 'tech_club',
  },
  {
    key: 'sport', business: 'a sports shop', db: 'sportshop', table: 'gear', thing: 'item', things: 'items',
    rows: [
      T('Football', 'Football', 29.0, 12), T('Shin pads', 'Football', 18.0, 0), T('Boots', 'Football', 89.0, 5),
      T('Racket', 'Tennis', 120.0, 3), T('Tennis balls', 'Tennis', 12.0, 40), T('Grip tape', 'Tennis', 8.5, 0),
      T('Running cap', 'Running', 22.0, 9), T('Water bottle', 'Running', 15.0, 14),
    ],
    oneWord: { name: 'Whistle', price: 6.0 }, club: 'sport_club',
  },
];

/** A stable 32-bit hash of a string. */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A small seeded random generator (mulberry32). Same seed, same numbers. */
export function rng(seed: string) {
  let a = hash(seed);
  const next = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: <X,>(xs: readonly X[]): X => xs[Math.floor(next() * xs.length)],
    shuffle: <X,>(xs: readonly X[]): X[] => {
      const out = [...xs];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
}

export function themeFor(id: string): Theme {
  return THEMES[hash(`theme|${id.toUpperCase()}`) % THEMES.length];
}

export const cats = (t: Theme) => [...new Set(t.rows.map(r => r.cat))];

export const sqlStr = (s: string) => `'${s.replace(/'/g, "''")}'`;
export const money = (n: number) => n.toFixed(2);

/** The full shop table that levels 4 to 6 start from. */
export function fullTableSql(t: Theme) {
  return [
    `CREATE DATABASE ${t.db};`,
    `USE ${t.db};`,
    `CREATE TABLE ${t.table} (`,
    `  id INT AUTO_INCREMENT PRIMARY KEY,`,
    `  name VARCHAR(30) NOT NULL,`,
    `  category VARCHAR(20),`,
    `  price DECIMAL(6,2),`,
    `  stock INT DEFAULT 0`,
    `);`,
    `INSERT INTO ${t.table} (name, category, price, stock) VALUES`,
    t.rows.map(r => `  (${sqlStr(r.name)}, ${sqlStr(r.cat)}, ${money(r.price)}, ${r.stock})`).join(',\n') + ';',
  ].join('\n');
}
