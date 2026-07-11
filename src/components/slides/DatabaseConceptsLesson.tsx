// DatabaseConceptsLesson.tsx
// MBI802 · Database Management Systems
// "Advanced Database Concepts" — beginner friendly, public lesson.
//
// One running example (a `bookshop` database with a `books` table) carries
// the whole lesson: create it, shape it, sort it, count it, back it up and
// restore it — then a plain-English tour of SQL injection with a safe,
// simulated login form so non-technical students can *see* the danger
// without touching a real database.
//
// House style matches the other public lessons: soft cards, a running
// "Explain → Try it" rhythm, MySQL syntax (MySQL Workbench, as used in class).

import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Table2,
  PlusSquare,
  Wand2,
  KeyRound,
  Hash,
  Save,
  RotateCcw,
  ArrowDownWideNarrow,
  Sigma,
  ShieldAlert,
  ChevronDown,
  Lightbulb,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────────────────

const ACCENT = '#2563eb';
const TEAL = '#0d9488';
const DANGER = '#dc2626';
const SAFE = '#059669';
const AMBER = '#b45309';

// ── Small shared building blocks ──────────────────────────────────────────────

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="mt-2">
      {label && (
        <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6b7280' }}>
          {label}
        </p>
      )}
      <pre
        style={{
          background: '#1e1b4b',
          color: '#c7d2fe',
          borderRadius: 10,
          padding: '14px 16px',
          fontSize: 13,
          lineHeight: 1.65,
          overflowX: 'auto',
          margin: 0,
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          whiteSpace: 'pre',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  blurb,
  color,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  blurb: string;
  color: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className="inline-flex items-center justify-center rounded-xl"
          style={{ width: 34, height: 34, background: color + '16', color }}
        >
          {icon}
        </span>
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>
          {eyebrow}
        </p>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#1e1b4b' }}>
        {title}
      </h2>
      <p className="text-sm mt-1.5 leading-6" style={{ color: '#4b5563' }}>
        {blurb}
      </p>
    </div>
  );
}

// A single "Explain → Try it" teaching step.
function Step({
  num,
  color,
  title,
  explain,
  code,
  activityTitle,
  activityTask,
  activityAnswer,
}: {
  num: number;
  color: string;
  title: string;
  explain: string;
  code: string;
  activityTitle: string;
  activityTask: string;
  activityAnswer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border p-4 sm:p-5"
      style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 inline-flex items-center justify-center rounded-full text-xs font-extrabold"
          style={{ width: 26, height: 26, background: color, color: '#fff' }}
        >
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold" style={{ color: '#1e1b4b' }}>{title}</p>
          <p className="text-sm mt-1 leading-6" style={{ color: '#374151' }}>{explain}</p>
          <CodeBlock code={code} />
        </div>
      </div>

      {/* Activity */}
      <div
        className="mt-4 rounded-xl p-3.5"
        style={{ background: color + '0c', border: `1px solid ${color}26` }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color }}>
          <Lightbulb size={13} /> Try it yourself — {activityTitle}
        </p>
        <p className="text-sm leading-6" style={{ color: '#374151' }}>{activityTask}</p>

        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors"
          style={{ background: open ? color : '#fff', color: open ? '#fff' : color, border: `1px solid ${color}55` }}
        >
          {open ? <CheckCircle2 size={14} /> : <ChevronDown size={14} />}
          {open ? 'Hide the answer query' : 'Reveal the answer query'}
        </button>

        {open && <CodeBlock code={activityAnswer} />}
      </div>
    </div>
  );
}

// ── Scenario used throughout the lesson ───────────────────────────────────────
// A `bookshop` database with a `books` table — built up one command at a time.

const TABLE_STEPS = [
  {
    title: '1 · Create the database',
    explain:
      "Before you can make any tables, you need somewhere to put them. CREATE DATABASE just tells MySQL: \"start a new, empty folder called this.\" Run this in MySQL Workbench, then click the refresh icon on the Schemas panel to see it appear.",
    code: 'CREATE DATABASE bookshop;',
    activityTitle: 'create your own database',
    activityTask:
      'Open MySQL Workbench and create a new database called bookshop. Then double-click it in the Schemas panel to make it your active (bold) database.',
    activityAnswer: 'CREATE DATABASE bookshop;',
    color: ACCENT,
  },
  {
    title: '2 · Create a table',
    explain:
      "A table is a grid — rows and columns — like a spreadsheet with rules. Each column gets a name and a data type: INT for whole numbers, VARCHAR(n) for short text (n = max characters), DECIMAL(a,b) for money. Here we're deliberately using INT for price — we'll fix that in step 4.",
    code:
`USE bookshop;

CREATE TABLE books (
  id     INT,
  title  VARCHAR(100),
  author VARCHAR(100),
  price  INT
);`,
    activityTitle: 'build the books table',
    activityTask:
      'Inside bookshop, create a table called books with four columns: id (INT), title (VARCHAR 100), author (VARCHAR 100), and price (INT).',
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
      "Tables aren't fixed forever — ALTER TABLE ... ADD COLUMN lets you bolt on a new field any time, without losing the data you already have. Let's say the shop now wants to track how many copies of each book are in stock.",
    code: 'ALTER TABLE books ADD COLUMN stock_count INT;',
    activityTitle: 'add a stock_count column',
    activityTask: 'Add a new column called stock_count (INT) to the books table.',
    activityAnswer: 'ALTER TABLE books ADD COLUMN stock_count INT;',
    color: TEAL,
  },
  {
    title: '4 · Change a column’s data type',
    explain:
      'Remember price was created as INT (whole numbers only) — but books cost $19.99, not $19. MODIFY COLUMN lets you redefine an existing column’s type in place. DECIMAL(6,2) means "up to 6 digits total, 2 of them after the decimal point."',
    code: 'ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);',
    activityTitle: 'fix the price column',
    activityTask: 'Change the price column from INT to DECIMAL(6,2) so it can store cents.',
    activityAnswer: 'ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);',
    color: TEAL,
  },
  {
    title: '5 · Make a column the primary key',
    explain:
      "A primary key is the column that uniquely identifies each row — no two rows may ever share the same value, and it can’t be left empty. id is the natural choice: every book gets its own id, and nothing else in the table has to be unique.",
    code: 'ALTER TABLE books ADD PRIMARY KEY (id);',
    activityTitle: 'set id as the primary key',
    activityTask: 'Make id the primary key of the books table.',
    activityAnswer: 'ALTER TABLE books ADD PRIMARY KEY (id);',
    color: '#7c3aed',
  },
  {
    title: '6 · Make a column auto-increment',
    explain:
      "Typing an id number by hand for every new book is tedious and error-prone. AUTO_INCREMENT tells MySQL: \"count it up for me\" — insert a row without an id, and MySQL fills in the next free number automatically (1, 2, 3…). In MySQL, a column must already be a key — like our new primary key — before it can be set to AUTO_INCREMENT, which is why this comes after step 5.",
    code: 'ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;',
    activityTitle: 'let MySQL number the books for you',
    activityTask:
      'Make id AUTO_INCREMENT, then insert a new book without specifying an id — leave it out of the column list entirely and watch MySQL assign one automatically.',
    activityAnswer:
`ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;

INSERT INTO books (title, author, price, stock_count)
VALUES ('Atomic Habits', 'James Clear', 24.99, 12);`,
    color: '#7c3aed',
  },
];

const SAMPLE_DATA_SQL =
`INSERT INTO books (title, author, price, stock_count) VALUES
('Atomic Habits',        'James Clear',      24.99, 12),
('Sapiens',               'Yuval N. Harari',  29.50,  7),
('The Pragmatic Programmer', 'David Thomas', 42.00,  3),
('Educated',              'Tara Westover',    18.75, 20),
('Deep Work',             'Cal Newport',      22.00,  9);`;

// ── Backup & restore ───────────────────────────────────────────────────────────

function BackupRestoreSection() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-4 sm:p-5" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.07)' }}>
        <p className="text-[15px] font-bold flex items-center gap-1.5" style={{ color: '#1e1b4b' }}>
          <Save size={16} style={{ color: AMBER }} /> What a backup actually is
        </p>
        <p className="text-sm mt-1.5 leading-6" style={{ color: '#374151' }}>
          A backup is simply a saved copy of your entire database — every table, every row, written out as a single
          file of plain SQL commands (CREATE TABLE, INSERT INTO…). If your database is ever deleted, corrupted, or you
          make a mistake you can't undo, you <em>restore</em> from that file and get everything back exactly as it was.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border p-4 sm:p-5" style={{ background: '#fffbeb', borderColor: 'rgba(180,83,9,0.22)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: AMBER }}>Backing up — in MySQL Workbench</p>
          <ol className="text-sm leading-7 list-decimal pl-5" style={{ color: '#374151' }}>
            <li>Server menu → <strong>Data Export</strong></li>
            <li>Tick the <code>bookshop</code> schema</li>
            <li>Choose <strong>"Export to Self-Contained File"</strong> and pick a save location</li>
            <li>Click <strong>Start Export</strong></li>
          </ol>
          <p className="text-xs mt-3" style={{ color: '#92400e' }}>
            That creates one <code>.sql</code> file — a complete, readable snapshot of your database.
          </p>
        </div>
        <div className="rounded-2xl border p-4 sm:p-5" style={{ background: '#ecfdf5', borderColor: 'rgba(5,150,105,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: SAFE }}>Restoring — in MySQL Workbench</p>
          <ol className="text-sm leading-7 list-decimal pl-5" style={{ color: '#374151' }}>
            <li>Server menu → <strong>Data Import</strong></li>
            <li>Choose <strong>"Import from Self-Contained File"</strong> and select your <code>.sql</code> file</li>
            <li>Under "Default Target Schema," pick or create <code>bookshop</code></li>
            <li>Click <strong>Start Import</strong></li>
          </ol>
          <p className="text-xs mt-3" style={{ color: '#065f46' }}>
            MySQL simply re-runs every command in the file — rebuilding the database from scratch.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border p-4 sm:p-5" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.07)' }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>
          The same thing, as SQL / command line
        </p>
        <p className="text-sm leading-6 mb-1" style={{ color: '#374151' }}>
          Workbench's buttons are running these commands for you behind the scenes — worth recognising if you ever see them:
        </p>
        <CodeBlock
          label="Back up (terminal)"
          code="mysqldump -u root -p bookshop > bookshop_backup.sql"
        />
        <CodeBlock
          label="Restore (terminal)"
          code="mysql -u root -p bookshop < bookshop_backup.sql"
        />
      </div>

      <div
        className="rounded-xl p-3.5"
        style={{ background: AMBER + '0c', border: `1px solid ${AMBER}26` }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: AMBER }}>
          <Lightbulb size={13} /> Try it yourself — back up, "lose" it, then restore
        </p>
        <p className="text-sm leading-6" style={{ color: '#374151' }}>
          1) Export bookshop to a self-contained file. 2) Right-click the bookshop schema → Drop Schema (delete it — this
          is safe, you have a backup). 3) Use Data Import to restore it from the file you saved. 4) Run
          <code className="mx-1 px-1 py-0.5 rounded" style={{ background: '#fff' }}>SELECT * FROM books;</code>
          to prove all your books came back.
        </p>
      </div>
    </div>
  );
}

// ── ORDER BY ───────────────────────────────────────────────────────────────────

function OrderByActivity({ n, color, task, answer }: { n: number; color: string; task: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl p-3.5" style={{ background: color + '0c', border: `1px solid ${color}26` }}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color }}>Activity {n}</p>
      <p className="text-sm leading-6" style={{ color: '#374151' }}>{task}</p>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5"
        style={{ background: open ? color : '#fff', color: open ? '#fff' : color, border: `1px solid ${color}55` }}
      >
        {open ? <CheckCircle2 size={14} /> : <ChevronDown size={14} />}
        {open ? 'Hide the answer query' : 'Reveal the answer query'}
      </button>
      {open && <CodeBlock code={answer} />}
    </div>
  );
}

// ── SQL Injection simulation ────────────────────────────────────────────────────

function SqlInjectionSim() {
  const [safe, setSafe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const looksLikeTrick = /('|--|\bOR\b)/i.test(username) || /('|--|\bOR\b)/i.test(password);

  const naiveQuery =
    `SELECT * FROM users WHERE username = '${username || '…'}' AND password = '${password ? '•'.repeat(password.length) : '…'}';`;
  const safeQuery =
    `SELECT * FROM users WHERE username = ? AND password = ?;\n-- values sent separately: [${username ? `"${username}"` : '…'}, "••••"]`;

  let outcome: { ok: boolean; head: string; body: string } | null = null;
  if (username || password) {
    if (!safe && looksLikeTrick) {
      outcome = {
        ok: true,
        head: '🔓 Logged in — with no real password check!',
        body: "Your text closed the quote early and added OR '1'='1', which is always true. The naive query obeyed it as a command instead of treating it as plain text. That's SQL injection.",
      };
    } else if (safe && looksLikeTrick) {
      outcome = {
        ok: false,
        head: '🔒 Login rejected',
        body: "The safe version never glues your text into the command. It's sent separately as a plain value, so MySQL just searches for a (very strange) username that doesn't exist — the trick does nothing.",
      };
    } else {
      outcome = {
        ok: false,
        head: '🔒 Normal login attempt',
        body: 'An ordinary username and password — checked normally either way. Try the trick preset below to see the difference.',
      };
    }
  }

  return (
    <div className="rounded-2xl border p-4 sm:p-5" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.07)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>Simulated login form</p>
        <div className="inline-flex rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
          <button
            onClick={() => setSafe(false)}
            className="text-xs font-semibold px-3 py-1.5"
            style={{ background: !safe ? DANGER : '#fff', color: !safe ? '#fff' : '#6b7280' }}
          >
            Naive version
          </button>
          <button
            onClick={() => setSafe(true)}
            className="text-xs font-semibold px-3 py-1.5"
            style={{ background: safe ? SAFE : '#fff', color: safe ? '#fff' : '#6b7280' }}
          >
            Safe version
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="text-sm rounded-lg px-3 py-2 border outline-none"
          style={{ borderColor: 'rgba(0,0,0,0.15)' }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="text"
          className="text-sm rounded-lg px-3 py-2 border outline-none"
          style={{ borderColor: 'rgba(0,0,0,0.15)' }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => { setUsername('sarah'); setPassword('correcthorse'); }}
          className="text-xs font-semibold rounded-lg px-3 py-1.5 border"
          style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#374151' }}
        >
          Try a normal login
        </button>
        <button
          onClick={() => { setUsername("' OR '1'='1"); setPassword("anything"); }}
          className="text-xs font-semibold rounded-lg px-3 py-1.5 border"
          style={{ borderColor: DANGER + '55', color: DANGER }}
        >
          Try the injection trick
        </button>
        <button
          onClick={() => { setUsername(''); setPassword(''); }}
          className="text-xs font-semibold rounded-lg px-3 py-1.5 border"
          style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#6b7280' }}
        >
          Clear
        </button>
      </div>

      <CodeBlock label="What the database receives" code={safe ? safeQuery : naiveQuery} />

      {outcome && (
        <div
          className="mt-3 rounded-xl p-3.5"
          style={{ background: (outcome.ok ? DANGER : SAFE) + '10', border: `1px solid ${(outcome.ok ? DANGER : SAFE)}33` }}
        >
          <p className="text-sm font-bold" style={{ color: outcome.ok ? DANGER : SAFE }}>{outcome.head}</p>
          <p className="text-xs mt-1 leading-5" style={{ color: '#374151' }}>{outcome.body}</p>
        </div>
      )}

      <p className="text-[11px] mt-3" style={{ color: '#9ca3af' }}>
        Everything here runs only in your browser — no real database, no real login, nothing is sent anywhere.
      </p>
    </div>
  );
}

// ── Cheat sheet ──────────────────────────────────────────────────────────────

const CHEAT_SHEET = [
  { label: 'Create a database', sql: 'CREATE DATABASE bookshop;' },
  { label: 'Create a table', sql: 'CREATE TABLE books (id INT, title VARCHAR(100), author VARCHAR(100), price INT);' },
  { label: 'Add a column', sql: 'ALTER TABLE books ADD COLUMN stock_count INT;' },
  { label: "Change a column's type", sql: 'ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);' },
  { label: 'Add a primary key', sql: 'ALTER TABLE books ADD PRIMARY KEY (id);' },
  { label: 'Make a column auto-increment', sql: 'ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;' },
  { label: 'Sort results', sql: 'SELECT * FROM books ORDER BY price ASC;' },
  { label: 'Count rows', sql: 'SELECT COUNT(*) FROM books;' },
  { label: 'Back up (terminal)', sql: 'mysqldump -u root -p bookshop > bookshop_backup.sql' },
  { label: 'Restore (terminal)', sql: 'mysql -u root -p bookshop < bookshop_backup.sql' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DatabaseConceptsLesson() {
  return (
    <div className="space-y-10">
      {/* Intro */}
      <div>
        <p
          className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4"
          style={{ color: '#1e3a8a', background: 'rgba(219,234,254,0.6)' }}
        >
          <Sparkles size={12} /> MBI802 · Database Management Systems
        </p>
        <p className="text-sm leading-6" style={{ color: '#374151' }}>
          Everything below runs in <strong>MySQL Workbench</strong>, and it all uses <strong>one</strong> database
          (<code>bookshop</code>) and <strong>one</strong> table (<code>books</code>) — built up step by step so you're
          always working with something you recognise. Each idea gets a short, plain-English explanation, its SQL
          command, and one small activity to try yourself before you move on.
        </p>
      </div>

      {/* ── 1. Building the table ── */}
      <div>
        <SectionHeader
          icon={<Table2 size={17} />}
          eyebrow="Part 1 · Shaping a table"
          title="From an empty database to a real table"
          blurb="Six small steps, each one building on the last — the same table follows you through the rest of this lesson."
          color={ACCENT}
        />
        <div className="space-y-4">
          {TABLE_STEPS.map((s) => (
            <Step
              key={s.title}
              num={Number(s.title[0])}
              color={s.color}
              title={s.title}
              explain={s.explain}
              code={s.code}
              activityTitle={s.activityTitle}
              activityTask={s.activityTask}
              activityAnswer={s.activityAnswer}
            />
          ))}
        </div>

        <div className="mt-4 rounded-2xl border p-4 sm:p-5" style={{ background: '#f9fafb', borderColor: 'rgba(0,0,0,0.07)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#374151' }}>
            <PlusSquare size={13} /> One more thing before we sort and count
          </p>
          <p className="text-sm leading-6 mb-1" style={{ color: '#374151' }}>
            You'll need a few rows of actual data in <code>books</code> for the next two sections to make sense.
            Run this once — it's the INSERT you already know from earlier lessons:
          </p>
          <CodeBlock code={SAMPLE_DATA_SQL} />
        </div>
      </div>

      {/* ── 2. Backup & restore ── */}
      <div>
        <SectionHeader
          icon={<Save size={17} />}
          eyebrow="Part 2 · Backup & restore"
          title="Never lose a database again"
          blurb="A backup is a safety net. Learn to make one — and prove it works by restoring from it."
          color={AMBER}
        />
        <BackupRestoreSection />
      </div>

      {/* ── 3. ORDER BY ── */}
      <div>
        <SectionHeader
          icon={<ArrowDownWideNarrow size={17} />}
          eyebrow="Part 3 · Sorting results"
          title="ORDER BY — putting rows in an order that makes sense"
          blurb="Same books table, same data — ORDER BY just changes what order the results come back in. Add ASC (default, low → high / A → Z) or DESC (high → low / Z → A) after the column name."
          color={TEAL}
        />
        <div className="space-y-3">
          <div className="rounded-2xl border p-4 sm:p-5" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.07)' }}>
            <CodeBlock label="Cheapest book first" code="SELECT * FROM books ORDER BY price ASC;" />
            <CodeBlock label="Most expensive book first" code="SELECT * FROM books ORDER BY price DESC;" />
          </div>
          <OrderByActivity
            n={1}
            color={TEAL}
            task="Write a query that lists every book from cheapest to most expensive."
            answer="SELECT * FROM books ORDER BY price ASC;"
          />
          <OrderByActivity
            n={2}
            color={TEAL}
            task="Write a query that lists every book title alphabetically, Z to A."
            answer="SELECT * FROM books ORDER BY title DESC;"
          />
        </div>
      </div>

      {/* ── 4. COUNT ── */}
      <div>
        <SectionHeader
          icon={<Sigma size={17} />}
          eyebrow="Part 4 · Counting rows"
          title="COUNT() — answering “how many?”"
          blurb="COUNT(*) counts how many rows match your query — nothing more. Combine it with WHERE to count only the rows you care about."
          color="#7c3aed"
        />
        <div className="space-y-3">
          <div className="rounded-2xl border p-4 sm:p-5" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.07)' }}>
            <CodeBlock label="How many books are in the shop, total?" code="SELECT COUNT(*) FROM books;" />
          </div>
          <OrderByActivity
            n={1}
            color="#7c3aed"
            task="Write a query that counts how many books cost more than $20."
            answer="SELECT COUNT(*) FROM books WHERE price > 20;"
          />
          <OrderByActivity
            n={2}
            color="#7c3aed"
            task="Stretch goal: count how many books there are per author. (Hint: GROUP BY groups matching rows together before COUNT runs on each group.)"
            answer={`SELECT author, COUNT(*) AS how_many\nFROM books\nGROUP BY author;`}
          />
        </div>
      </div>

      {/* ── 5. SQL injection ── */}
      <div>
        <SectionHeader
          icon={<ShieldAlert size={17} />}
          eyebrow="Part 5 · A safety topic"
          title="SQL injection — in plain English"
          blurb="You don't need to write code to understand this — you just need to see it happen once."
          color={DANGER}
        />

        <div className="rounded-2xl border p-4 sm:p-5 mb-4" style={{ background: DANGER + '08', borderColor: DANGER + '28' }}>
          <p className="text-sm leading-6" style={{ color: '#374151' }}>
            Lots of websites build a database command by simply gluing your typed text into a sentence — for example,
            a login form might build: <em>"find the user named [whatever you typed]."</em> Normally that's harmless.
            But if a website never checks <em>what</em> you typed, you could type something that isn't a name at
            all — it's a piece of database command. The database can't tell the difference, so it just... runs it.
            That's <strong>SQL injection</strong>: sneaking a command into a box that was only supposed to hold a
            word.
          </p>
        </div>

        <SqlInjectionSim />

        <div className="mt-4 rounded-2xl border p-4 sm:p-5" style={{ background: '#ecfdf5', borderColor: 'rgba(5,150,105,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: SAFE }}>How real systems protect against it</p>
          <ul className="text-sm leading-7 list-disc pl-5" style={{ color: '#374151' }}>
            <li><strong>Never glue text together.</strong> Send what the user typed as a separate value, never as part of the command itself (this is what the "safe version" above does).</li>
            <li><strong>Check the input.</strong> A username field shouldn't accept quote marks or the word "OR" in the first place.</li>
            <li><strong>Give accounts the least access they need.</strong> A login page shouldn't be able to delete tables, even if something did slip through.</li>
          </ul>
        </div>
      </div>

      {/* ── Cheat sheet ── */}
      <div>
        <SectionHeader
          icon={<Wand2 size={17} />}
          eyebrow="Quick reference"
          title="Every query from this lesson, in one place"
          blurb="Bookmark this — you'll want it again during the practical lab."
          color="#1e1b4b"
        />
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
          {CHEAT_SHEET.map((row, i) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 px-4 py-3"
              style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}
            >
              <p className="text-xs font-semibold w-full sm:w-56 shrink-0" style={{ color: '#374151' }}>{row.label}</p>
              <code className="text-xs" style={{ color: '#4338ca', fontFamily: "'Fira Code', 'Cascadia Code', monospace" }}>
                {row.sql}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recap ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(13,148,136,0.06))', border: '1px solid rgba(37,99,235,0.14)' }}
      >
        <p className="text-sm font-bold flex items-center gap-2 mb-2" style={{ color: '#1e1b4b' }}>
          <KeyRound size={16} style={{ color: ACCENT }} /> What you can now do
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm" style={{ color: '#374151' }}>
          <p className="flex items-center gap-1.5"><Database size={13} style={{ color: ACCENT }} /> Create a database and a table</p>
          <p className="flex items-center gap-1.5"><PlusSquare size={13} style={{ color: TEAL }} /> Add and retype columns</p>
          <p className="flex items-center gap-1.5"><KeyRound size={13} style={{ color: '#7c3aed' }} /> Set a primary key</p>
          <p className="flex items-center gap-1.5"><Hash size={13} style={{ color: '#7c3aed' }} /> Auto-number rows</p>
          <p className="flex items-center gap-1.5"><Save size={13} style={{ color: AMBER }} /> Back up a database</p>
          <p className="flex items-center gap-1.5"><RotateCcw size={13} style={{ color: AMBER }} /> Restore from a backup</p>
          <p className="flex items-center gap-1.5"><ArrowDownWideNarrow size={13} style={{ color: TEAL }} /> Sort results with ORDER BY</p>
          <p className="flex items-center gap-1.5"><Sigma size={13} style={{ color: '#7c3aed' }} /> Count rows with COUNT()</p>
          <p className="flex items-center gap-1.5 sm:col-span-2"><ShieldAlert size={13} style={{ color: DANGER }} /> Explain what SQL injection is and why untrusted input is dangerous</p>
        </div>
      </motion.div>
    </div>
  );
}
