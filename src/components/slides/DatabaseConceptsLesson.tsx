// DatabaseConceptsLesson.tsx
// MBI802 · Database Management Systems
// "Let's make sense of Advanced Database Concepts" — beginner friendly
//
// A public, self-contained lesson. One running example, a `bookshop`
// database with a `books` table, carries the whole thing: we build it up
// column by column, back it up and restore it, sort it, count it, then
// take a plain-English, hands-on look at SQL injection.
//
// House style matches the other public lessons (WebArchitectureLesson,
// SystemsSecurityLesson): white canvas, soft cards, reveal-on-scroll,
// Apple-like type.

import { useState, useEffect, useRef, Fragment } from 'react';
import type { ReactNode, CSSProperties } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────

const ACCENT  = '#2563eb'; // blue   — table design
const LINK    = '#0891b2'; // cyan   — linking tables / foreign keys
const BACKUP  = '#b45309'; // amber  — backup & restore
const SORT    = '#0d9488'; // teal   — ORDER BY
const COUNT   = '#7c3aed'; // purple — COUNT()
const DANGER  = '#e5484d'; // red    — SQL injection
const SAFE    = '#30a46c'; // green  — safe / protected

// ── Reveal-on-scroll ──────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '', style = {} }: {
  children: ReactNode; delay?: number; className?: string; style?: CSSProperties;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Shared layout primitives ──────────────────────────────────────────────────

function SectionHeader({ kicker, title, blurb, color = ACCENT }: {
  kicker: string; title: string; blurb?: string; color?: string;
}) {
  return (
    <Reveal>
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
          {kicker}
        </p>
        <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.08, color: '#1d1d1f' }}>
          {title}
        </h2>
        {blurb && (
          <p style={{ margin: '14px 0 0', fontSize: 17, lineHeight: 1.6, color: '#6e6e73', maxWidth: 680 }}>
            {blurb}
          </p>
        )}
      </div>
    </Reveal>
  );
}

function Card({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: '#fafafa',
      border: '1px solid rgba(0,0,0,0.07)',
      borderRadius: 24,
      padding: 28,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Section({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ marginBottom: 96, ...style }}>{children}</section>;
}

function navBtn(primary: boolean, color = ACCENT): CSSProperties {
  return {
    cursor: 'pointer', font: 'inherit', fontSize: 14, fontWeight: 600,
    padding: '9px 18px', borderRadius: 999,
    border: primary ? 'none' : '1px solid rgba(0,0,0,0.12)',
    background: primary ? color : '#fff',
    color: primary ? '#fff' : '#1d1d1f',
    transition: 'all 0.2s ease',
  };
}

const presetBtn: CSSProperties = {
  cursor: 'pointer', font: 'inherit', fontSize: 12.5, fontWeight: 600, padding: '7px 12px',
  borderRadius: 999, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#444',
};

// A friendly "Note:" strip we reuse to set up each part.
function NoteStrip({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      background: color + '0e', border: `1px solid ${color}30`, borderRadius: 16,
      padding: '14px 18px', marginBottom: 22,
    }}>
      <span style={{ fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>📌</span>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#333' }}>
        <b style={{ color }}>Note.</b> {children}
      </p>
    </div>
  );
}

// ── SQL syntax highlighting for code blocks ────────────────────────────────────

const SQL_KEYWORDS = [
  'CREATE', 'DATABASE', 'SCHEMA', 'TABLE', 'ALTER', 'ADD', 'COLUMN', 'MODIFY', 'CHANGE',
  'PRIMARY', 'KEY', 'AUTO_INCREMENT', 'INSERT', 'INTO', 'VALUES', 'SELECT', 'FROM', 'WHERE',
  'ORDER', 'BY', 'GROUP', 'COUNT', 'ASC', 'DESC', 'USE', 'AND', 'OR', 'DROP', 'AS', 'INT',
  'VARCHAR', 'DECIMAL',
];

function highlightSql(code: string): ReactNode[] {
  const pattern = new RegExp(`('[^']*')|(--[^\n]*)|(#[^\n]*)|\\b(${SQL_KEYWORDS.join('|')})\\b`, 'g');
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = pattern.exec(code))) {
    if (m.index > last) parts.push(code.slice(last, m.index));
    const text = m[0];
    if (m[1]) parts.push(<span key={key++} style={{ color: '#86efac' }}>{text}</span>);
    else if (m[2] || m[3]) parts.push(<span key={key++} style={{ color: '#64748b' }}>{text}</span>);
    else parts.push(<span key={key++} style={{ color: '#7dd3fc' }}>{text}</span>);
    last = pattern.lastIndex;
  }
  if (last < code.length) parts.push(code.slice(last));
  return parts;
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div>
      {label && (
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 8 }}>
          {label}
        </div>
      )}
      <pre style={{
        margin: 0, padding: '14px 16px', borderRadius: 12, background: '#0f172a', color: '#e2e8f0',
        fontSize: 13.5, lineHeight: 1.65, overflowX: 'auto',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', whiteSpace: 'pre',
      }}>
        <code>{highlightSql(code)}</code>
      </pre>
    </div>
  );
}

// ── The books data, and a friendly rendered table ─────────────────────────────

interface Book { id: number; title: string; author: string; price: number; stock: number; }

const BOOKS: Book[] = [
  { id: 1, title: 'Atomic Habits',            author: 'James Clear',     price: 24.99, stock: 12 },
  { id: 2, title: 'Sapiens',                  author: 'Yuval N. Harari', price: 29.50, stock: 7  },
  { id: 3, title: 'The Pragmatic Programmer', author: 'David Thomas',    price: 42.00, stock: 3  },
  { id: 4, title: 'Educated',                 author: 'Tara Westover',   price: 18.75, stock: 20 },
  { id: 5, title: 'Deep Work',                author: 'Cal Newport',     price: 22.00, stock: 9  },
];

const BOOK_COLS: { key: keyof Book; label: string; align?: 'right' }[] = [
  { key: 'id',     label: 'id' },
  { key: 'title',  label: 'title' },
  { key: 'author', label: 'author' },
  { key: 'price',  label: 'price',       align: 'right' },
  { key: 'stock',  label: 'stock_count', align: 'right' },
];

function cellValue(b: Book, key: keyof Book): string {
  if (key === 'price') return `$${b.price.toFixed(2)}`;
  return String(b[key]);
}

// A styled result table. Optionally highlight a sorted column, or dim rows that
// do not match a filter (matchIds). fadeKey re-triggers a soft fade on change.
function BooksTable({ rows, sortKey, matchIds, fadeKey }: {
  rows: Book[]; sortKey?: keyof Book; matchIds?: Set<number>; fadeKey?: string | number;
}) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, minWidth: 460, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
        <thead>
          <tr>
            {BOOK_COLS.map((c) => (
              <th key={c.key} style={{
                textAlign: c.align === 'right' ? 'right' : 'left', padding: '11px 16px',
                background: sortKey === c.key ? ACCENT : '#1e293b', color: '#fff', fontWeight: 700,
                fontSize: 12.5, letterSpacing: '0.03em', whiteSpace: 'nowrap',
                transition: 'background 0.3s ease',
              }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody key={fadeKey} style={{ animation: fadeKey !== undefined ? 'dbcFade 0.4s ease' : undefined }}>
          {rows.map((b, i) => {
            const matched = !matchIds || matchIds.has(b.id);
            return (
              <tr key={b.id} style={{ background: i % 2 ? '#f6f8ff' : '#fff', opacity: matched ? 1 : 0.32, transition: 'opacity 0.3s ease' }}>
                {BOOK_COLS.map((c) => (
                  <td key={c.key} style={{
                    textAlign: c.align === 'right' ? 'right' : 'left', padding: '10px 16px',
                    borderTop: '1px solid rgba(0,0,0,0.06)', color: '#1d1d1f', whiteSpace: 'nowrap',
                    fontWeight: sortKey === c.key ? 700 : 400,
                    background: matched && sortKey === c.key ? ACCENT + '0d' : undefined,
                  }}>
                    {cellValue(b, c.key)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── A single "Explain → Try it" teaching step ─────────────────────────────────

function StepCard({ num, color, title, explain, code, activityTask, activityAnswer }: {
  num: number; color: string; title: string; explain: string; code: string;
  activityTask: string; activityAnswer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14,
        }}>
          {num}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1d1d1f' }}>{title}</h3>
          <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.6, color: '#444' }}>{explain}</p>
          <div style={{ marginTop: 14 }}><CodeBlock code={code} /></div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 14, background: color + '0c', border: `1px solid ${color}30` }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color, marginBottom: 6 }}>
          ✏️ Your turn
        </div>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#333' }}>{activityTask}</p>
        <button onClick={() => setOpen(v => !v)} style={{ ...navBtn(open, color), fontSize: 13, marginTop: 12 }}>
          {open ? 'Hide the answer' : 'Show the answer'}
        </button>
        {open && <div style={{ marginTop: 12, animation: 'dbcFade 0.3s ease' }}><CodeBlock code={activityAnswer} /></div>}
      </div>
    </Card>
  );
}

// A smaller activity-only card, used for ORDER BY / COUNT practice.
function ActivityCard({ n, color, task, answer }: { n: number; color: string; task: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card style={{ background: color + '08', borderColor: color + '26' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color, marginBottom: 8 }}>
        ✏️ Activity {n}
      </div>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#333' }}>{task}</p>
      <button onClick={() => setOpen(v => !v)} style={{ ...navBtn(open, color), fontSize: 13, marginTop: 12 }}>
        {open ? 'Hide the answer' : 'Show the answer'}
      </button>
      {open && <div style={{ marginTop: 12, animation: 'dbcFade 0.3s ease' }}><CodeBlock code={answer} /></div>}
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  1 · SHAPING A TABLE — bookshop / books, built one command at a time
// ════════════════════════════════════════════════════════════════════════════

const TABLE_STEPS = [
  {
    title: '1 · Create the database',
    explain:
      'Before we can make any tables, we need somewhere to keep them. CREATE DATABASE tells MySQL to start a fresh, empty space with the name we give it. We run this in MySQL Workbench, then click the refresh icon on the Schemas panel to see our new bookshop appear.',
    code: 'CREATE DATABASE bookshop;',
    activityTask:
      'Create a database called bookshop in MySQL Workbench. Then double-click it in the Schemas panel so it becomes your active database (its name turns bold).',
    activityAnswer: 'CREATE DATABASE bookshop;',
    color: ACCENT,
  },
  {
    title: '2 · Create a table',
    explain:
      'A table is just a grid of rows and columns, a bit like a spreadsheet with rules. Every column needs a name and a data type. We use INT for whole numbers, VARCHAR(100) for short text (100 is the longest it can hold), and DECIMAL for money. For now we make price an INT on purpose, and we fix that in step 4.',
    code:
`USE bookshop;

CREATE TABLE books (
  id     INT,
  title  VARCHAR(100),
  author VARCHAR(100),
  price  INT
);`,
    activityTask:
      'Inside bookshop, create a table called books with four columns: id (INT), title (VARCHAR 100), author (VARCHAR 100) and price (INT).',
    activityAnswer:
`USE bookshop;

CREATE TABLE books (
  id     INT,
  title  VARCHAR(100),
  author VARCHAR(100),
  price  INT
);`,
    color: ACCENT,
  },
  {
    title: '3 · Add a new column',
    explain:
      'Tables are not set in stone. With ALTER TABLE ADD COLUMN we can add a new field at any time, and none of the data we already have is lost. Let us say the shop now wants to keep track of how many copies of each book are in stock.',
    code: 'ALTER TABLE books ADD COLUMN stock_count INT;',
    activityTask: 'Add a new column called stock_count (INT) to the books table.',
    activityAnswer: 'ALTER TABLE books ADD COLUMN stock_count INT;',
    color: ACCENT,
  },
  {
    title: '4 · Change a column\'s data type',
    explain:
      'Right now price is an INT, so it can only hold whole numbers. But a book costs $19.99, not $19. MODIFY COLUMN lets us change the type of a column we already have. DECIMAL(6,2) means up to 6 digits in total, with 2 of them after the decimal point, which is perfect for prices.',
    code: 'ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);',
    activityTask: 'Change the price column from INT to DECIMAL(6,2) so it can hold cents.',
    activityAnswer: 'ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);',
    color: ACCENT,
  },
  {
    title: '5 · Make a column the primary key',
    explain:
      'A primary key is the column that gives every row its own identity. No two rows can share the same value, and it can never be left blank. id is the obvious choice here, because every book gets its own number and nothing else has to be unique.',
    code: 'ALTER TABLE books ADD PRIMARY KEY (id);',
    activityTask: 'Make id the primary key of the books table.',
    activityAnswer: 'ALTER TABLE books ADD PRIMARY KEY (id);',
    color: ACCENT,
  },
  {
    title: '6 · Make a column auto-increment',
    explain:
      'Typing an id by hand for every new book is slow and easy to get wrong. AUTO_INCREMENT asks MySQL to do the counting for us. When we add a book without giving an id, MySQL fills in the next free number by itself (1, 2, 3 and so on). In MySQL a column has to be a key before it can auto-increment, which is why we did step 5 first.',
    code: 'ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;',
    activityTask:
      'Make id AUTO_INCREMENT, then add a new book without giving it an id. Leave id out of the column list and watch MySQL fill in the number for you.',
    activityAnswer:
`ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;

INSERT INTO books (title, author, price, stock_count)
VALUES ('Atomic Habits', 'James Clear', 24.99, 12);`,
    color: ACCENT,
  },
];

const SAMPLE_DATA_SQL =
`INSERT INTO books (title, author, price, stock_count) VALUES
('Atomic Habits',            'James Clear',     24.99, 12),
('Sapiens',                  'Yuval N. Harari', 29.50,  7),
('The Pragmatic Programmer', 'David Thomas',    42.00,  3),
('Educated',                 'Tara Westover',   18.75, 20),
('Deep Work',                'Cal Newport',     22.00,  9);`;

// ── "What happens to the data when we change a type?" ──────────────────────────

const WARN = '#d97706';

interface Flow { b: string; a: string; lost: boolean; }

const TYPE_SCENARIOS: { from: string; to: string; flows: Flow[]; note: string }[] = [
  {
    from: 'DECIMAL(6,2)', to: 'INT',
    flows: [
      { b: '24.99', a: '25', lost: true },
      { b: '18.75', a: '19', lost: true },
      { b: '42.00', a: '42', lost: false },
    ],
    note: 'Decimals are rounded to the nearest whole number, so the cents are lost for good. Values that were already whole survive unchanged.',
  },
  {
    from: 'INT', to: 'VARCHAR(20)',
    flows: [
      { b: '25', a: "'25'", lost: false },
      { b: '100', a: "'100'", lost: false },
    ],
    note: 'The value is kept, but it is now text. Sorting changes too, so "100" can come before "20".',
  },
  {
    from: 'VARCHAR(20)', to: 'INT',
    flows: [
      { b: "'25'", a: '25', lost: false },
      { b: "'sale'", a: '0', lost: true },
    ],
    note: 'Clean number text converts back fine. Anything that is not a number turns into 0.',
  },
];

function Pill({ text, color }: { text: string; color?: string }) {
  return (
    <span style={{
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12.5, fontWeight: 600,
      padding: '3px 9px', borderRadius: 8, whiteSpace: 'nowrap',
      background: color ? color + '18' : '#eef1f6',
      color: color || '#334155',
      border: `1px solid ${color ? color + '44' : 'rgba(0,0,0,0.08)'}`,
    }}>
      {text}
    </span>
  );
}

function TypeChangeCard() {
  return (
    <Card style={{ background: WARN + '09', borderColor: WARN + '2c' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: WARN, marginBottom: 6 }}>
        ⚠️ Watch out: changing a type can change the data
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.55, color: '#444' }}>
        Changing a column type is not always free. Sometimes the values inside change too. Here is what happens in
        three common cases. Green means the value is kept, red means it changes.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
        {TYPE_SCENARIOS.map((s) => (
          <div key={s.from + s.to} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <Pill text={s.from} />
              <span style={{ color: ACCENT, fontWeight: 800 }}>→</span>
              <Pill text={s.to} color={ACCENT} />
            </div>
            <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
              {s.flows.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Pill text={f.b} />
                  <span style={{ color: '#94a3b8' }}>→</span>
                  <Pill text={f.a} color={f.lost ? DANGER : SAFE} />
                </div>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: '#6e6e73' }}>{s.note}</p>
          </div>
        ))}
      </div>

      <p style={{ margin: '14px 0 0', fontSize: 13, lineHeight: 1.55, color: '#6e6e73' }}>
        The lesson: <b style={{ color: '#444' }}>always back up before a big type change</b>, so we can restore if a
        value is lost. That is exactly what the backup section is for.
      </p>
    </Card>
  );
}

// ── "Where does the new column go?" (AFTER / FIRST) ───────────────────────────

const COL_POSITIONS = [
  {
    code: 'ALTER TABLE books ADD COLUMN stock_count INT;',
    cols: ['id', 'title', 'author', 'price', 'stock_count'], hi: 'stock_count',
    note: 'With no position given, the new column goes to the very end. This is the default.',
  },
  {
    code: 'ALTER TABLE books ADD COLUMN pages INT AFTER title;',
    cols: ['id', 'title', 'pages', 'author', 'price'], hi: 'pages',
    note: 'AFTER title drops the new column in right after the title column.',
  },
  {
    code: 'ALTER TABLE books ADD COLUMN sku INT FIRST;',
    cols: ['sku', 'id', 'title', 'author', 'price'], hi: 'sku',
    note: 'FIRST moves the new column to the very front of the table.',
  },
];

function ColumnStrip({ cols, hi }: { cols: string[]; hi: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      {cols.map((c, i) => (
        <Fragment key={c}>
          {i > 0 && <span style={{ color: '#cbd5e1', fontSize: 12 }}>·</span>}
          <span style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, fontWeight: 600,
            padding: '3px 9px', borderRadius: 7, whiteSpace: 'nowrap',
            background: c === hi ? ACCENT : '#eef1f6', color: c === hi ? '#fff' : '#475569',
          }}>
            {c}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

function ColumnPositionCard() {
  return (
    <Card style={{ background: ACCENT + '06', borderColor: ACCENT + '22' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT, marginBottom: 6 }}>
        📍 Where does the new column go?
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.55, color: '#444' }}>
        By default a new column lands at the very end of the table. If we want it somewhere else, we add <code>AFTER</code>{' '}
        a column name, or <code>FIRST</code> to put it at the front.
      </p>
      <div style={{ display: 'grid', gap: 16 }}>
        {COL_POSITIONS.map((p) => (
          <div key={p.code}>
            <CodeBlock code={p.code} />
            <div style={{ marginTop: 10 }}><ColumnStrip cols={p.cols} hi={p.hi} /></div>
            <p style={{ margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.5, color: '#6e6e73' }}>{p.note}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '14px 0 0', fontSize: 12.5, lineHeight: 1.5, color: '#6e6e73' }}>
        Position is just about the order the columns are listed in. It does not change any of the data inside them.
      </p>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  LINKING TABLES — foreign keys & cascade (a tiny reviews table)
// ════════════════════════════════════════════════════════════════════════════

const REVIEWS_SQL =
`CREATE TABLE reviews (
  id      INT PRIMARY KEY,
  book_id INT,
  comment VARCHAR(200),
  FOREIGN KEY (book_id) REFERENCES books(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);`;

const CASCADE_BOOKS = [
  { id: 1, title: 'Atomic Habits' },
  { id: 2, title: 'Sapiens' },
];
const CASCADE_REVIEWS = [
  { id: 101, book_id: 1, comment: 'Loved it' },
  { id: 102, book_id: 2, comment: 'Great read' },
  { id: 103, book_id: 2, comment: 'Life changing' },
];

function MiniTable({ head, rows, dimIds, idKey }: {
  head: string[]; rows: Record<string, string | number>[]; dimIds: Set<number>; idKey: string;
}) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '9px 12px', background: '#1e293b', color: '#fff', fontWeight: 700, fontSize: 11.5, whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const dim = dimIds.has(Number(r[idKey]));
            return (
              <tr key={i} style={{ background: i % 2 ? '#f6f8ff' : '#fff', opacity: dim ? 0.32 : 1, transition: 'opacity 0.3s ease' }}>
                {head.map((h) => (
                  <td key={h} style={{ padding: '8px 12px', borderTop: '1px solid rgba(0,0,0,0.06)', color: '#1d1d1f', whiteSpace: 'nowrap' }}>{r[h]}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CascadeDemo() {
  const [cascade, setCascade] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const cascadedAway = deleted && cascade;
  const books = cascadedAway ? CASCADE_BOOKS.filter((b) => b.id !== 2) : CASCADE_BOOKS;
  const reviews = cascadedAway ? CASCADE_REVIEWS.filter((r) => r.book_id !== 2) : CASCADE_REVIEWS;

  // Rows that reference book #2 are highlighted (dimmed here means "about to be affected").
  const bookDim = new Set<number>();
  const reviewDim = new Set<number>();

  let banner: { ok: boolean; text: string } | null = null;
  if (deleted) {
    banner = cascade
      ? { ok: true, text: 'Book #2 is deleted, and its two reviews were removed automatically. The delete cascaded from the book down to its reviews.' }
      : { ok: false, text: 'MySQL blocks this. Two reviews still point to book #2, so with no cascade rule it refuses to delete the book and leave those reviews pointing at nothing.' };
  }

  const setRule = (v: boolean) => { setCascade(v); setDeleted(false); };

  return (
    <Card>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1d1d1f' }}>🔗 See CASCADE in action</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setRule(true)} style={{ ...navBtn(cascade, LINK), fontSize: 13 }}>ON DELETE CASCADE</button>
          <button onClick={() => setRule(false)} style={{ ...navBtn(!cascade, DANGER), fontSize: 13 }}>No cascade rule</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 6 }}>books</div>
          <MiniTable head={['id', 'title']} rows={books} dimIds={bookDim} idKey="id" />
        </div>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 6 }}>reviews (book_id points to books.id)</div>
          <MiniTable head={['id', 'book_id', 'comment']} rows={reviews} dimIds={reviewDim} idKey="id" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: banner ? 16 : 0 }}>
        <button onClick={() => setDeleted(true)} disabled={deleted} style={{ ...navBtn(true, DANGER), fontSize: 13, opacity: deleted ? 0.5 : 1, cursor: deleted ? 'default' : 'pointer' }}>
          🗑️ DELETE FROM books WHERE id = 2;
        </button>
        <button onClick={() => setDeleted(false)} style={{ ...navBtn(false), fontSize: 13 }}>↻ Reset</button>
      </div>

      {banner && (
        <div style={{
          padding: '14px 16px', borderRadius: 14, animation: 'dbcFade 0.3s ease',
          display: 'flex', gap: 12, alignItems: 'flex-start',
          background: (banner.ok ? SAFE : DANGER) + '0e', border: `1.5px solid ${(banner.ok ? SAFE : DANGER)}33`,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.2 }}>{banner.ok ? '✅' : '🚫'}</span>
          <div style={{ fontSize: 14, lineHeight: 1.55, color: '#444' }}>{banner.text}</div>
        </div>
      )}
    </Card>
  );
}

const CASCADE_RULES = [
  { icon: '🗑️', color: DANGER, t: 'ON DELETE CASCADE', d: 'Delete a book, and all of its reviews are deleted with it, automatically. The delete cascades down to the linked rows.' },
  { icon: '✏️', color: BACKUP, t: 'ON UPDATE CASCADE', d: 'Change a book\'s id, and every review that points to it updates to match, so no review is left pointing at the wrong book.' },
  { icon: '🛑', color: '#64748b', t: 'With no rule', d: 'MySQL refuses to delete or renumber a book while reviews still point to it, to avoid leaving reviews pointing at nothing.' },
];

// ════════════════════════════════════════════════════════════════════════════
//  2 · BACKUP & RESTORE
// ════════════════════════════════════════════════════════════════════════════

function BackupRestoreSection() {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <Card>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#444' }}>
          A backup is just a saved copy of our whole database. Every table and every row is written out into a single
          file of plain SQL commands, such as CREATE TABLE and INSERT INTO. If our database is ever deleted or damaged,
          or we make a change we cannot undo, we open that file and <b>restore</b> everything exactly as it was.
        </p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <Card style={{ background: BACKUP + '08', borderColor: BACKUP + '26' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: BACKUP, marginBottom: 10 }}>
            💾 Backing up in MySQL Workbench
          </div>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8, fontSize: 14.5, lineHeight: 1.5, color: '#333' }}>
            <li>Open the Server menu → <b>Data Export</b></li>
            <li>Tick the <code>bookshop</code> schema</li>
            <li>Choose <b>Export to Self-Contained File</b> and pick where to save it</li>
            <li>Click <b>Start Export</b></li>
          </ol>
          <p style={{ margin: '14px 0 0', fontSize: 13, color: '#92400e' }}>
            This gives us one <code>.sql</code> file, a complete snapshot of the database that we can keep safe.
          </p>
        </Card>

        <Card style={{ background: SAFE + '08', borderColor: SAFE + '26' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: SAFE, marginBottom: 10 }}>
            ♻️ Restoring in MySQL Workbench
          </div>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8, fontSize: 14.5, lineHeight: 1.5, color: '#333' }}>
            <li>Open the Server menu → <b>Data Import</b></li>
            <li>Choose <b>Import from Self-Contained File</b> and select the <code>.sql</code> file we saved</li>
            <li>Under Default Target Schema, choose or create <code>bookshop</code></li>
            <li>Click <b>Start Import</b></li>
          </ol>
          <p style={{ margin: '14px 0 0', fontSize: 13, color: '#065f46' }}>
            MySQL runs every command in the file again and rebuilds the database from scratch.
          </p>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 10 }}>
          The same thing on the command line
        </div>
        <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.55, color: '#6e6e73' }}>
          Those buttons in Workbench are really running these two commands for us. It is handy to recognise them if you
          ever see them written down.
        </p>
        <div style={{ display: 'grid', gap: 12 }}>
          <CodeBlock label="Back up" code="mysqldump -u root -p bookshop > bookshop_backup.sql" />
          <CodeBlock label="Restore" code="mysql -u root -p bookshop < bookshop_backup.sql" />
        </div>
      </Card>

      <Card style={{ background: BACKUP + '0c', borderColor: BACKUP + '30' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: BACKUP, marginBottom: 8 }}>
          ✏️ Your turn: lose it, then bring it back
        </div>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, fontSize: 14.5, lineHeight: 1.55, color: '#333' }}>
          <li>Export bookshop to a self-contained file.</li>
          <li>Right-click the bookshop schema and choose Drop Schema to delete it. This is safe, because we have a backup.</li>
          <li>Use Data Import to bring it back from the file we saved.</li>
          <li>Run <code>SELECT * FROM books;</code> to check that all of our books returned.</li>
        </ol>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  3 · ORDER BY — live sorting explorer
// ════════════════════════════════════════════════════════════════════════════

const SORT_CHOICES: { key: keyof Book; label: string }[] = [
  { key: 'price', label: 'price' },
  { key: 'title', label: 'title' },
  { key: 'stock', label: 'stock_count' },
];

function OrderByExplorer() {
  const [col, setCol] = useState<keyof Book>('price');
  const [dir, setDir] = useState<'ASC' | 'DESC'>('ASC');

  const sorted = [...BOOKS].sort((a, b) => {
    let cmp: number;
    if (col === 'title' || col === 'author') cmp = String(a[col]).localeCompare(String(b[col]));
    else cmp = Number(a[col]) - Number(b[col]);
    return dir === 'ASC' ? cmp : -cmp;
  });

  const colLabel = SORT_CHOICES.find(c => c.key === col)!.label;

  return (
    <Card>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: SORT, marginBottom: 12 }}>
        🔀 Sort it live
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6e6e73', marginBottom: 6 }}>Order by</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SORT_CHOICES.map((c) => (
              <button key={c.key} onClick={() => setCol(c.key)} style={navBtn(col === c.key, SORT)}>{c.label}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6e6e73', marginBottom: 6 }}>Direction</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setDir('ASC')} style={navBtn(dir === 'ASC', SORT)}>ASC ↑ low to high</button>
            <button onClick={() => setDir('DESC')} style={navBtn(dir === 'DESC', SORT)}>DESC ↓ high to low</button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <CodeBlock label="The query we are running" code={`SELECT * FROM books ORDER BY ${colLabel} ${dir};`} />
      </div>

      <BooksTable rows={sorted} sortKey={col} fadeKey={`${col}-${dir}`} />
      <p style={{ margin: '12px 0 0', fontSize: 13, color: '#6e6e73' }}>
        Notice that only the order of the rows changes. The books themselves stay exactly the same.
      </p>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  4 · COUNT — live counting explorer
// ════════════════════════════════════════════════════════════════════════════

const COUNT_FILTERS: { label: string; query: string; test: (b: Book) => boolean }[] = [
  { label: 'All books',        query: 'SELECT COUNT(*) FROM books;',                        test: () => true },
  { label: 'Priced over $20',  query: 'SELECT COUNT(*) FROM books WHERE price > 20;',        test: (b) => b.price > 20 },
  { label: 'Low stock (< 10)', query: 'SELECT COUNT(*) FROM books WHERE stock_count < 10;',  test: (b) => b.stock < 10 },
];

function CountExplorer() {
  const [idx, setIdx] = useState(0);
  const f = COUNT_FILTERS[idx];
  const matches = BOOKS.filter(f.test);
  const matchIds = new Set(matches.map((b) => b.id));

  return (
    <Card>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: COUNT, marginBottom: 12 }}>
        🔢 Count it live
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {COUNT_FILTERS.map((cf, i) => (
          <button key={cf.label} onClick={() => setIdx(i)} style={navBtn(idx === i, COUNT)}>{cf.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <div key={idx} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minWidth: 96, padding: '14px 20px', borderRadius: 18, background: COUNT + '12',
          border: `1.5px solid ${COUNT}33`, animation: 'dbcPop 0.35s ease',
        }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: COUNT, lineHeight: 1 }}>{matches.length}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: COUNT, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>rows</div>
        </div>
        <div style={{ minWidth: 0 }}>
          <CodeBlock label="The query we are running" code={f.query} />
        </div>
      </div>

      <BooksTable rows={BOOKS} matchIds={matchIds} fadeKey={idx} />
      <p style={{ margin: '12px 0 0', fontSize: 13, color: '#6e6e73' }}>
        The rows that match stay bright, and COUNT simply adds them up. Faded rows are left out of the total.
      </p>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  5 · SQL INJECTION SIMULATION
// ════════════════════════════════════════════════════════════════════════════

function InjectionQuery({ safe, username, password, trick }: {
  safe: boolean; username: string; password: string; trick: boolean;
}) {
  const kw = { color: '#7dd3fc' };
  const dots = password ? '•'.repeat(Math.min(password.length, 8)) : '…';
  return (
    <pre style={{
      margin: 0, padding: '16px 18px', borderRadius: 12, background: '#0f172a', color: '#e2e8f0',
      fontSize: 13.5, lineHeight: 1.7, overflowX: 'auto',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', whiteSpace: 'pre',
    }}>
      {safe ? (
        <code>
          <span style={kw}>SELECT</span> * <span style={kw}>FROM</span> users{'\n'}
          <span style={kw}>WHERE</span> username = <span style={{ color: '#fca5a5' }}>?</span>{'\n'}
          {'  '}<span style={kw}>AND</span> password = <span style={{ color: '#fca5a5' }}>?</span>;{'\n'}
          <span style={{ color: '#64748b' }}>{'-- our text is sent separately, as data, never as command'}</span>
        </code>
      ) : (
        <code>
          <span style={kw}>SELECT</span> * <span style={kw}>FROM</span> users{'\n'}
          <span style={kw}>WHERE</span> username = '
          <span style={{
            color: trick ? '#fca5a5' : '#86efac',
            background: trick ? 'rgba(248,113,113,0.18)' : undefined,
            borderRadius: 3, padding: trick ? '1px 3px' : undefined, fontWeight: trick ? 700 : 400,
          }}>{username || '…'}</span>'{'\n'}
          {'  '}<span style={kw}>AND</span> password = '<span style={{ color: '#86efac' }}>{dots}</span>';
        </code>
      )}
    </pre>
  );
}

function SqlInjectionSim() {
  const [safe, setSafe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const looksLikeTrick = /('|--|\bOR\b)/i.test(username) || /('|--|\bOR\b)/i.test(password);

  let outcome: { ok: boolean; head: string; body: string } | null = null;
  if (username || password) {
    if (!safe && looksLikeTrick) {
      outcome = {
        ok: true,
        head: 'Logged in, with no real password check',
        body: "We closed the quote early and added OR '1'='1', which is always true. The naive query treated our text as part of the command, so it let us in without a real password. That is SQL injection in action.",
      };
    } else if (safe && looksLikeTrick) {
      outcome = {
        ok: false,
        head: 'Login rejected',
        body: 'The safe version never pastes our text into the command. It sends it separately as a plain value, so MySQL just looks for a user with that very strange name, finds nobody, and the trick does nothing.',
      };
    } else {
      outcome = {
        ok: false,
        head: 'A normal login attempt',
        body: 'This is an ordinary username and password. Both versions handle it the same way. Try the trick button to see where they differ.',
      };
    }
  }

  return (
    <Card>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1d1d1f' }}>🔐 A pretend login form</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setSafe(false)} style={{ ...navBtn(!safe, DANGER), fontSize: 13.5 }}>⚠️ Naive version</button>
          <button onClick={() => setSafe(true)} style={{ ...navBtn(safe, SAFE), fontSize: 13.5 }}>🛡️ Safe version</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#6e6e73' }}>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="type a name…"
            style={{ width: '100%', font: 'inherit', fontSize: 15, padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.15)', margin: '4px 0 0', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#6e6e73' }}>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="type a password…"
            style={{ width: '100%', font: 'inherit', fontSize: 15, padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.15)', margin: '4px 0 0', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        <button onClick={() => { setUsername('sarah'); setPassword('correcthorse'); }} style={presetBtn}>😇 Try a normal login</button>
        <button onClick={() => { setUsername("' OR '1'='1"); setPassword('anything'); }} style={presetBtn}>😈 Try the injection trick</button>
        <button onClick={() => { setUsername(''); setPassword(''); }} style={presetBtn}>↻ Clear</button>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 8 }}>
        What the database actually receives
      </div>
      <InjectionQuery safe={safe} username={username} password={password} trick={looksLikeTrick} />

      {outcome && (
        <div style={{
          marginTop: 16, padding: '14px 16px', borderRadius: 14, animation: 'dbcFade 0.3s ease',
          display: 'flex', gap: 12, alignItems: 'flex-start',
          background: (outcome.ok ? DANGER : SAFE) + '0e', border: `1.5px solid ${(outcome.ok ? DANGER : SAFE)}33`,
        }}>
          <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2 }}>{outcome.ok ? '🔓' : '🔒'}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: outcome.ok ? DANGER : SAFE }}>{outcome.head}</div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: '#444', marginTop: 4 }}>{outcome.body}</div>
          </div>
        </div>
      )}

      <p style={{ margin: '14px 0 0', fontSize: 12, color: '#aeaeb2', fontStyle: 'italic' }}>
        Everything here runs in your browser only. There is no real database and no real login, and nothing is sent anywhere.
      </p>
    </Card>
  );
}

const PROTECTION_RULES = [
  { icon: '🧱', t: 'Never paste text into a command', d: 'We send whatever the user typed as a separate value, never as part of the command itself. That is exactly what the safe version above does.' },
  { icon: '🎯', t: 'Check the input first', d: 'A username box has no reason to accept quote marks or the word OR, so we can reject them before they cause trouble.' },
  { icon: '🔒', t: 'Give each account the least it needs', d: 'A login page never needs to delete tables, so we do not give it that power, even if something slips through.' },
];

// ── Quick reference cheat sheet ──────────────────────────────────────────────

const CHEAT_SHEET = [
  { label: 'Create a database', sql: 'CREATE DATABASE bookshop;' },
  { label: 'Create a table', sql: 'CREATE TABLE books (id INT, title VARCHAR(100), author VARCHAR(100), price INT);' },
  { label: 'Add a column', sql: 'ALTER TABLE books ADD COLUMN stock_count INT;' },
  { label: 'Add a column in a position', sql: 'ALTER TABLE books ADD COLUMN pages INT AFTER title;' },
  { label: 'Change a column type', sql: 'ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);' },
  { label: 'Link tables, cascade on delete', sql: 'FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE' },
  { label: 'Add a primary key', sql: 'ALTER TABLE books ADD PRIMARY KEY (id);' },
  { label: 'Make a column auto-increment', sql: 'ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;' },
  { label: 'Sort results', sql: 'SELECT * FROM books ORDER BY price ASC;' },
  { label: 'Count rows', sql: 'SELECT COUNT(*) FROM books;' },
  { label: 'Back up', sql: 'mysqldump -u root -p bookshop > bookshop_backup.sql' },
  { label: 'Restore', sql: 'mysql -u root -p bookshop < bookshop_backup.sql' },
];

function CheatSheet() {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {CHEAT_SHEET.map((row, i) => (
        <div
          key={row.label}
          style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 16px',
            padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1d1d1f', width: 220, flexShrink: 0 }}>{row.label}</div>
          <code style={{ fontSize: 13, color: ACCENT, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{row.sql}</code>
        </div>
      ))}
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════════════════

export default function DatabaseConceptsLesson() {
  return (
    <div>
      <style>{`
        @keyframes dbcFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes dbcPop  { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* intro */}
      <Section style={{ marginBottom: 72 }}>
        <Reveal>
          <p style={{ fontSize: 19, lineHeight: 1.7, color: '#1d1d1f', maxWidth: 720, fontWeight: 450 }}>
            In this lesson we look at what we can do with a database once it exists. We shape a table, keep it safe with
            backups, and ask it questions by sorting and counting. We finish with one important safety idea called SQL injection.
          </p>
          <NoteStrip color={ACCENT}>
            For the activities below, we use one database called <code>bookshop</code> and one main table called{' '}
            <code>books</code>. We build it up together, one step at a time, so we are always working with something familiar.
            Later we add one small partner table so we can see how two tables link. Everything runs in <b>MySQL Workbench</b>.
          </NoteStrip>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#6e6e73', maxWidth: 720 }}>
            Each idea comes with a short explanation, the SQL we run, and a small activity to try before moving on. Take
            your time, and feel free to run every example yourself.
          </p>
        </Reveal>
      </Section>

      {/* 1 — shaping a table */}
      <Section>
        <SectionHeader
          kicker="Part 1 · Shaping a table" color={ACCENT}
          title="From an empty database to a real table"
          blurb="Six small steps, each one building on the last. The same table follows us through the rest of the lesson."
        />
        <div style={{ display: 'grid', gap: 16 }}>
          {TABLE_STEPS.map((s) => (
            <Fragment key={s.title}>
              <Reveal>
                <StepCard
                  num={Number(s.title[0])}
                  color={s.color}
                  title={s.title}
                  explain={s.explain}
                  code={s.code}
                  activityTask={s.activityTask}
                  activityAnswer={s.activityAnswer}
                />
              </Reveal>
              {s.title.startsWith('3') && <Reveal><ColumnPositionCard /></Reveal>}
              {s.title.startsWith('4') && <Reveal><TypeChangeCard /></Reveal>}
            </Fragment>
          ))}
        </div>

        <Reveal style={{ marginTop: 16 }}>
          <Card style={{ background: ACCENT + '06', borderColor: ACCENT + '22' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: ACCENT, marginBottom: 10 }}>
              ➕ Let us add some books
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.55, color: '#444' }}>
              Before we sort and count, our table needs a few real rows to work with. We run this INSERT once, and then we
              have five books to play with for the rest of the lesson.
            </p>
            <div style={{ marginBottom: 16 }}><CodeBlock code={SAMPLE_DATA_SQL} /></div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 8 }}>
              This is what books now holds
            </div>
            <BooksTable rows={BOOKS} />
          </Card>
        </Reveal>
      </Section>

      {/* 2 — linking tables (foreign keys & cascade) */}
      <Section>
        <SectionHeader
          kicker="Part 2 · Linking tables" color={LINK}
          title="Foreign keys, and what CASCADE does"
          blurb="Real databases have many tables, and they point at each other. A foreign key is how one table points to a row in another. CASCADE decides what happens to those links when a row is deleted or changed."
        />
        <NoteStrip color={LINK}>
          Here we add one small partner table called <code>reviews</code>, where each review points to a book. This is the
          only place in the lesson we use a second table.
        </NoteStrip>

        <div style={{ display: 'grid', gap: 16 }}>
          <Reveal>
            <Card>
              <p style={{ margin: '0 0 14px', fontSize: 15, lineHeight: 1.6, color: '#444' }}>
                A <b>foreign key</b> is a column that points to a row in another table. Here each review has a{' '}
                <code>book_id</code> that points to a book in <code>books</code>. That link is what lets the database keep
                the two tables in step. We set the CASCADE rules when we create the table.
              </p>
              <CodeBlock code={REVIEWS_SQL} />
            </Card>
          </Reveal>

          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 10 }}>
              {CASCADE_RULES.map((r) => (
                <div key={r.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fafafa', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '14px 16px' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: r.color, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{r.t}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.5, color: '#6e6e73', marginTop: 3 }}>{r.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal><CascadeDemo /></Reveal>
        </div>
      </Section>

      {/* 3 — backup & restore */}
      <Section>
        <SectionHeader
          kicker="Part 3 · Backup & restore" color={BACKUP}
          title="Never lose a database again"
          blurb="A backup is a safety net. We learn to make one, and prove it works by restoring from it."
        />
        <BackupRestoreSection />
      </Section>

      {/* 3 — ORDER BY */}
      <Section>
        <SectionHeader
          kicker="Part 4 · Sorting results" color={SORT}
          title="ORDER BY: putting rows in the order we want"
          blurb="We keep the same books table and the same data. ORDER BY only changes the order the rows come back in. We add ASC to go low to high, or DESC to go high to low, after the column name."
        />
        <NoteStrip color={SORT}>
          We keep using the same <code>books</code> table we created and filled earlier. Nothing new to set up.
        </NoteStrip>
        <div style={{ display: 'grid', gap: 16 }}>
          <Reveal><OrderByExplorer /></Reveal>
          <Reveal>
            <ActivityCard n={1} color={SORT} task="Write a query that lists every book from cheapest to most expensive." answer="SELECT * FROM books ORDER BY price ASC;" />
          </Reveal>
          <Reveal>
            <ActivityCard n={2} color={SORT} task="Write a query that lists every book title in reverse alphabetical order, from Z to A." answer="SELECT * FROM books ORDER BY title DESC;" />
          </Reveal>
        </div>
      </Section>

      {/* 4 — COUNT */}
      <Section>
        <SectionHeader
          kicker="Part 5 · Counting rows" color={COUNT}
          title="COUNT: answering how many"
          blurb="COUNT tells us how many rows match, and nothing more. On its own, COUNT(*) counts every row. Add a WHERE and it counts only the rows we care about."
        />
        <NoteStrip color={COUNT}>
          Same <code>books</code> table again. Pick a filter below and watch the total change.
        </NoteStrip>
        <div style={{ display: 'grid', gap: 16 }}>
          <Reveal><CountExplorer /></Reveal>
          <Reveal>
            <ActivityCard n={1} color={COUNT} task="Write a query that counts how many books cost more than $20." answer="SELECT COUNT(*) FROM books WHERE price > 20;" />
          </Reveal>
          <Reveal>
            <ActivityCard
              n={2} color={COUNT}
              task="Stretch goal: count how many books we have for each author. (Hint: GROUP BY gathers matching rows together first, and then COUNT runs on each group.)"
              answer={`SELECT author, COUNT(*) AS how_many\nFROM books\nGROUP BY author;`}
            />
          </Reveal>
        </div>
      </Section>

      {/* 5 — SQL injection */}
      <Section>
        <SectionHeader
          kicker="Part 6 · A safety topic" color={DANGER}
          title="SQL injection, in plain English"
          blurb="We do not need to write any code to understand this. We just need to see it happen once."
        />

        <Reveal>
          <Card style={{ background: DANGER + '08', borderColor: DANGER + '28', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: '#444' }}>
              Many websites build a database command by pasting whatever we type straight into a sentence. A login form
              might build something like <i>find the user named (whatever was typed)</i>. Most of the time that is fine.
              But if the site never checks what we typed, we could type something that is not a name at all. It could be a
              piece of a database command, and the database cannot tell the difference, so it simply runs it. That is
              <b> SQL injection</b>: slipping a command into a box that was only meant to hold a word.
            </p>
          </Card>
        </Reveal>

        <Reveal><SqlInjectionSim /></Reveal>

        <Reveal style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: '#1d1d1f', margin: '8px 0 10px' }}>How real systems stay safe</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
            {PROTECTION_RULES.map((r) => (
              <div key={r.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fafafa', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '14px 16px' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: '#1d1d1f' }}>{r.t}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: '#6e6e73', marginTop: 2 }}>{r.d}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* quick reference */}
      <Section>
        <SectionHeader
          kicker="Quick reference" color="#1d1d1f"
          title="Every query from this lesson, in one place"
          blurb="Bookmark this. We will want it again during the practical lab."
        />
        <Reveal><CheatSheet /></Reveal>
      </Section>

      {/* close */}
      <Reveal>
        <div style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 30 }}>🗄️</div>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#1d1d1f', maxWidth: 620, margin: '14px auto 0', fontWeight: 500 }}>
            One database, one table, and a handful of small commands. We can now shape it, protect it, sort it and count it.
            The habit that matters most is the last one: we never trust text typed into a box, and we never paste it straight
            into a command.
          </p>
          <p style={{ fontSize: 13, color: '#aeaeb2', marginTop: 20 }}>
            MBI802 · Database Management Systems · Master of Business Informatics
          </p>
        </div>
      </Reveal>
    </div>
  );
}
