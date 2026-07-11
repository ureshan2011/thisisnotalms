// DatabaseConceptsLesson.tsx
// MBI802 · Database Management Systems
// "Let's make sense of Advanced Database Concepts" — beginner friendly
//
// A public, self-contained lesson. One running example — a `bookshop`
// database with a `books` table — carries the whole thing: build it up
// column by column, back it up and restore it, sort it, count it, then
// take a plain-English, hands-on look at SQL injection.
//
// House style matches the other public lessons (WebArchitectureLesson,
// SystemsSecurityLesson): white canvas, soft cards, reveal-on-scroll,
// Apple-like type.

import { useState, useEffect, useRef } from 'react';
import type { ReactNode, CSSProperties } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────

const ACCENT  = '#2563eb'; // blue   — table design
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
  cursor: 'pointer', font: 'inherit', fontSize: 12, fontWeight: 600, padding: '6px 10px',
  borderRadius: 999, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#444',
};

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
          Try it yourself
        </div>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#333' }}>{activityTask}</p>
        <button onClick={() => setOpen(v => !v)} style={{ ...navBtn(open, color), fontSize: 13, marginTop: 12 }}>
          {open ? 'Hide the answer query' : 'Reveal the answer query'}
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
        Activity {n}
      </div>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#333' }}>{task}</p>
      <button onClick={() => setOpen(v => !v)} style={{ ...navBtn(open, color), fontSize: 13, marginTop: 12 }}>
        {open ? 'Hide the answer query' : 'Reveal the answer query'}
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
      "Before you can make any tables, you need somewhere to put them. CREATE DATABASE just tells MySQL: \"start a new, empty folder called this.\" Run this in MySQL Workbench, then click the refresh icon on the Schemas panel to see it appear.",
    code: 'CREATE DATABASE bookshop;',
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
    activityTask: 'Add a new column called stock_count (INT) to the books table.',
    activityAnswer: 'ALTER TABLE books ADD COLUMN stock_count INT;',
    color: ACCENT,
  },
  {
    title: '4 · Change a column\'s data type',
    explain:
      'Remember price was created as INT (whole numbers only) — but books cost $19.99, not $19. MODIFY COLUMN lets you redefine an existing column\'s type in place. DECIMAL(6,2) means "up to 6 digits total, 2 of them after the decimal point."',
    code: 'ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);',
    activityTask: 'Change the price column from INT to DECIMAL(6,2) so it can store cents.',
    activityAnswer: 'ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);',
    color: ACCENT,
  },
  {
    title: '5 · Make a column the primary key',
    explain:
      "A primary key is the column that uniquely identifies each row — no two rows may ever share the same value, and it can't be left empty. id is the natural choice: every book gets its own id, and nothing else in the table has to be unique.",
    code: 'ALTER TABLE books ADD PRIMARY KEY (id);',
    activityTask: 'Make id the primary key of the books table.',
    activityAnswer: 'ALTER TABLE books ADD PRIMARY KEY (id);',
    color: ACCENT,
  },
  {
    title: '6 · Make a column auto-increment',
    explain:
      "Typing an id number by hand for every new book is tedious and error-prone. AUTO_INCREMENT tells MySQL: \"count it up for me\" — insert a row without an id, and MySQL fills in the next free number automatically (1, 2, 3…). In MySQL, a column must already be a key — like our new primary key — before it can be set to AUTO_INCREMENT, which is why this comes after step 5.",
    code: 'ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;',
    activityTask:
      'Make id AUTO_INCREMENT, then insert a new book without specifying an id — leave it out of the column list entirely and watch MySQL assign one automatically.',
    activityAnswer:
`ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;

INSERT INTO books (title, author, price, stock_count)
VALUES ('Atomic Habits', 'James Clear', 24.99, 12);`,
    color: ACCENT,
  },
];

const SAMPLE_DATA_SQL =
`INSERT INTO books (title, author, price, stock_count) VALUES
('Atomic Habits',        'James Clear',      24.99, 12),
('Sapiens',               'Yuval N. Harari',  29.50,  7),
('The Pragmatic Programmer', 'David Thomas', 42.00,  3),
('Educated',              'Tara Westover',    18.75, 20),
('Deep Work',             'Cal Newport',      22.00,  9);`;

// ════════════════════════════════════════════════════════════════════════════
//  2 · BACKUP & RESTORE
// ════════════════════════════════════════════════════════════════════════════

function BackupRestoreSection() {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <Card>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#444' }}>
          A backup is simply a saved copy of your entire database — every table, every row, written out as a single
          file of plain SQL commands (CREATE TABLE, INSERT INTO…). If your database is ever deleted, corrupted, or you
          make a mistake you can't undo, you <b>restore</b> from that file and get everything back exactly as it was.
        </p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <Card style={{ background: BACKUP + '08', borderColor: BACKUP + '26' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: BACKUP, marginBottom: 10 }}>
            Backing up — in MySQL Workbench
          </div>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8, fontSize: 14.5, lineHeight: 1.5, color: '#333' }}>
            <li>Server menu → <b>Data Export</b></li>
            <li>Tick the <code>bookshop</code> schema</li>
            <li>Choose <b>"Export to Self-Contained File"</b> and pick a save location</li>
            <li>Click <b>Start Export</b></li>
          </ol>
          <p style={{ margin: '14px 0 0', fontSize: 13, color: '#92400e' }}>
            That creates one <code>.sql</code> file — a complete, readable snapshot of your database.
          </p>
        </Card>

        <Card style={{ background: SAFE + '08', borderColor: SAFE + '26' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: SAFE, marginBottom: 10 }}>
            Restoring — in MySQL Workbench
          </div>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8, fontSize: 14.5, lineHeight: 1.5, color: '#333' }}>
            <li>Server menu → <b>Data Import</b></li>
            <li>Choose <b>"Import from Self-Contained File"</b> and select your <code>.sql</code> file</li>
            <li>Under "Default Target Schema," pick or create <code>bookshop</code></li>
            <li>Click <b>Start Import</b></li>
          </ol>
          <p style={{ margin: '14px 0 0', fontSize: 13, color: '#065f46' }}>
            MySQL simply re-runs every command in the file — rebuilding the database from scratch.
          </p>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 10 }}>
          The same thing, as SQL / command line
        </div>
        <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.55, color: '#6e6e73' }}>
          Workbench's buttons are running these commands for you behind the scenes — worth recognising if you ever see them:
        </p>
        <div style={{ display: 'grid', gap: 12 }}>
          <CodeBlock label="Back up (terminal)" code="mysqldump -u root -p bookshop > bookshop_backup.sql" />
          <CodeBlock label="Restore (terminal)" code="mysql -u root -p bookshop < bookshop_backup.sql" />
        </div>
      </Card>

      <Card style={{ background: BACKUP + '0c', borderColor: BACKUP + '30' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: BACKUP, marginBottom: 6 }}>
          Try it yourself
        </div>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: '#333' }}>
          1) Export bookshop to a self-contained file. 2) Right-click the bookshop schema → Drop Schema (delete it —
          this is safe, you have a backup). 3) Use Data Import to restore it from the file you saved.
          4) Run <code>SELECT * FROM books;</code> to prove all your books came back.
        </p>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  5 · SQL INJECTION SIMULATION
// ════════════════════════════════════════════════════════════════════════════

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
    <Card>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1d1d1f' }}>Simulated login form</div>
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
            style={{ width: '100%', font: 'inherit', fontSize: 15, padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.15)', margin: '4px 0 0', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#6e6e73' }}>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', font: 'inherit', fontSize: 15, padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.15)', margin: '4px 0 0', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        <button onClick={() => { setUsername('sarah'); setPassword('correcthorse'); }} style={presetBtn}>😇 Try a normal login</button>
        <button onClick={() => { setUsername("' OR '1'='1"); setPassword('anything'); }} style={presetBtn}>😈 Try the injection trick</button>
        <button onClick={() => { setUsername(''); setPassword(''); }} style={presetBtn}>↻ Clear</button>
      </div>

      <CodeBlock label="What the database receives" code={safe ? safeQuery : naiveQuery} />

      {outcome && (
        <div style={{
          marginTop: 16, padding: '14px 16px', borderRadius: 14, animation: 'dbcFade 0.3s ease',
          background: (outcome.ok ? DANGER : SAFE) + '0e', border: `1.5px solid ${(outcome.ok ? DANGER : SAFE)}33`,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: outcome.ok ? DANGER : SAFE }}>{outcome.head}</div>
          <div style={{ fontSize: 14, lineHeight: 1.55, color: '#444', marginTop: 6 }}>{outcome.body}</div>
        </div>
      )}

      <p style={{ margin: '14px 0 0', fontSize: 12, color: '#aeaeb2', fontStyle: 'italic' }}>
        Everything here runs only in your browser — no real database, no real login, nothing is sent anywhere.
      </p>
    </Card>
  );
}

const PROTECTION_RULES = [
  { icon: '🧱', t: 'Never glue text together', d: 'Send what the user typed as a separate value, never as part of the command itself — that\'s what the "safe version" above does.' },
  { icon: '🎯', t: 'Check the input', d: 'A username field shouldn\'t accept quote marks or the word "OR" in the first place.' },
  { icon: '🔒', t: 'Give accounts the least access they need', d: 'A login page shouldn\'t be able to delete tables, even if something did slip through.' },
];

// ── Quick reference cheat sheet ──────────────────────────────────────────────

const CHEAT_SHEET = [
  { label: 'Create a database', sql: 'CREATE DATABASE bookshop;' },
  { label: 'Create a table', sql: 'CREATE TABLE books (id INT, title VARCHAR(100), author VARCHAR(100), price INT);' },
  { label: 'Add a column', sql: 'ALTER TABLE books ADD COLUMN stock_count INT;' },
  { label: 'Change a column\'s type', sql: 'ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);' },
  { label: 'Add a primary key', sql: 'ALTER TABLE books ADD PRIMARY KEY (id);' },
  { label: 'Make a column auto-increment', sql: 'ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;' },
  { label: 'Sort results', sql: 'SELECT * FROM books ORDER BY price ASC;' },
  { label: 'Count rows', sql: 'SELECT COUNT(*) FROM books;' },
  { label: 'Back up (terminal)', sql: 'mysqldump -u root -p bookshop > bookshop_backup.sql' },
  { label: 'Restore (terminal)', sql: 'mysql -u root -p bookshop < bookshop_backup.sql' },
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
      <style>{`@keyframes dbcFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

      {/* intro */}
      <Section style={{ marginBottom: 72 }}>
        <Reveal>
          <p style={{ fontSize: 19, lineHeight: 1.7, color: '#1d1d1f', maxWidth: 720, fontWeight: 450 }}>
            Everything below runs in <b>MySQL Workbench</b>, and it all uses <b style={{ color: ACCENT }}>one</b> database
            (<code>bookshop</code>) and <b style={{ color: ACCENT }}>one</b> table (<code>books</code>) — built up step
            by step, so you're always working with something you recognise.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#6e6e73', maxWidth: 720, marginTop: 16 }}>
            Each idea gets a short, plain-English explanation, its SQL command, and one small activity to try yourself
            before you move on. No setup, no logins — just MySQL Workbench and the same table, all the way through.
          </p>
        </Reveal>
      </Section>

      {/* 1 — shaping a table */}
      <Section>
        <SectionHeader
          kicker="Part 1 · Shaping a table" color={ACCENT}
          title="From an empty database to a real table"
          blurb="Six small steps, each one building on the last — the same table follows you through the rest of this lesson."
        />
        <div style={{ display: 'grid', gap: 16 }}>
          {TABLE_STEPS.map((s) => (
            <Reveal key={s.title}>
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
          ))}
        </div>

        <Reveal style={{ marginTop: 16 }}>
          <Card>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 10 }}>
              One more thing before we sort and count
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.55, color: '#444' }}>
              You'll need a few rows of actual data in <code>books</code> for the next two sections to make sense.
              Run this once — it's the INSERT you already know from earlier lessons:
            </p>
            <CodeBlock code={SAMPLE_DATA_SQL} />
          </Card>
        </Reveal>
      </Section>

      {/* 2 — backup & restore */}
      <Section>
        <SectionHeader
          kicker="Part 2 · Backup & restore" color={BACKUP}
          title="Never lose a database again"
          blurb="A backup is a safety net. Learn to make one — and prove it works by restoring from it."
        />
        <BackupRestoreSection />
      </Section>

      {/* 3 — ORDER BY */}
      <Section>
        <SectionHeader
          kicker="Part 3 · Sorting results" color={SORT}
          title="ORDER BY — putting rows in an order that makes sense"
          blurb="Same books table, same data — ORDER BY just changes what order the results come back in. Add ASC (default, low → high / A → Z) or DESC (high → low / Z → A) after the column name."
        />
        <div style={{ display: 'grid', gap: 16 }}>
          <Reveal>
            <Card>
              <div style={{ display: 'grid', gap: 12 }}>
                <CodeBlock label="Cheapest book first" code="SELECT * FROM books ORDER BY price ASC;" />
                <CodeBlock label="Most expensive book first" code="SELECT * FROM books ORDER BY price DESC;" />
              </div>
            </Card>
          </Reveal>
          <Reveal>
            <ActivityCard n={1} color={SORT} task="Write a query that lists every book from cheapest to most expensive." answer="SELECT * FROM books ORDER BY price ASC;" />
          </Reveal>
          <Reveal>
            <ActivityCard n={2} color={SORT} task="Write a query that lists every book title alphabetically, Z to A." answer="SELECT * FROM books ORDER BY title DESC;" />
          </Reveal>
        </div>
      </Section>

      {/* 4 — COUNT */}
      <Section>
        <SectionHeader
          kicker="Part 4 · Counting rows" color={COUNT}
          title="COUNT() — answering “how many?”"
          blurb="COUNT(*) counts how many rows match your query — nothing more. Combine it with WHERE to count only the rows you care about."
        />
        <div style={{ display: 'grid', gap: 16 }}>
          <Reveal>
            <Card>
              <CodeBlock label="How many books are in the shop, total?" code="SELECT COUNT(*) FROM books;" />
            </Card>
          </Reveal>
          <Reveal>
            <ActivityCard n={1} color={COUNT} task="Write a query that counts how many books cost more than $20." answer="SELECT COUNT(*) FROM books WHERE price > 20;" />
          </Reveal>
          <Reveal>
            <ActivityCard
              n={2} color={COUNT}
              task="Stretch goal: count how many books there are per author. (Hint: GROUP BY groups matching rows together before COUNT runs on each group.)"
              answer={`SELECT author, COUNT(*) AS how_many\nFROM books\nGROUP BY author;`}
            />
          </Reveal>
        </div>
      </Section>

      {/* 5 — SQL injection */}
      <Section>
        <SectionHeader
          kicker="Part 5 · A safety topic" color={DANGER}
          title="SQL injection — in plain English"
          blurb="You don't need to write code to understand this — you just need to see it happen once."
        />

        <Reveal>
          <Card style={{ background: DANGER + '08', borderColor: DANGER + '28', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#444' }}>
              Lots of websites build a database command by simply gluing your typed text into a sentence — for example,
              a login form might build: <i>"find the user named [whatever you typed]."</i> Normally that's harmless.
              But if a website never checks <i>what</i> you typed, you could type something that isn't a name at
              all — it's a piece of database command. The database can't tell the difference, so it just... runs it.
              That's <b>SQL injection</b>: sneaking a command into a box that was only supposed to hold a word.
            </p>
          </Card>
        </Reveal>

        <Reveal><SqlInjectionSim /></Reveal>

        <Reveal style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: '#1d1d1f', margin: '8px 0 10px' }}>How real systems protect against it</h3>
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
          blurb="Bookmark this — you'll want it again during the practical lab."
        />
        <Reveal><CheatSheet /></Reveal>
      </Section>

      {/* close */}
      <Reveal>
        <div style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 30 }}>🗄️</div>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#1d1d1f', maxWidth: 620, margin: '14px auto 0', fontWeight: 500 }}>
            One database, one table, six small commands — and you can now shape it, protect it, sort it and count it.
            The last step is the most important habit of all: never trust text typed into a box, and never glue it
            straight into a command.
          </p>
          <p style={{ fontSize: 13, color: '#aeaeb2', marginTop: 20 }}>
            MBI802 · Database Management Systems · Master of Business Informatics
          </p>
        </div>
      </Reveal>
    </div>
  );
}
