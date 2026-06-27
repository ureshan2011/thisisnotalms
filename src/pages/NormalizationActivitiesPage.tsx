import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';

// ─── SQL Normalisation — Activities & Answers (Not a LMS) ────────────────────
// A practice lesson with seven small tables. For each one the student decides
// what normal form it is in and normalises it. The activities are mixed (not
// grouped by form) and give no hints, so the student has to read the data and
// work it out. The answer is hidden behind a password so it can be used in
// class. Same design as the Normalisation Explorer lesson. Everything runs in
// the browser; nothing is stored.

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

// The single password that unlocks every answer on this page.
const ANSWER_PASSWORD = 'MBi802NF';

// The same instruction for every activity — it never says which form the table
// is in, so it gives nothing away.
const TASK = 'Work out the highest normal form this table is in right now — then normalise it.';

// ─── Scroll-reveal wrapper ──────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  y = 48,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// ─── Section head ───────────────────────────────────────────────────────────
function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      {eyebrow && <p className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]">{eyebrow}</p>}
      <h2 className="text-[32px] font-semibold leading-[1.08] tracking-tight text-[#1d1d1f] sm:text-[44px]">
        {title}
      </h2>
      {sub && <p className="mx-auto mt-4 max-w-2xl text-[19px] leading-relaxed text-[#6e6e73]">{sub}</p>}
    </div>
  );
}

// ─── Apple-styled data table ────────────────────────────────────────────────
type CellKind = 'pk' | 'fk' | 'ok' | 'bad' | 'mut';
interface TCell {
  v: React.ReactNode;
  k?: CellKind;
}
function cellCls(k?: CellKind) {
  switch (k) {
    case 'pk':
      return 'bg-[#0071e3]/[0.08] text-[#0071e3] font-semibold';
    case 'fk':
      return 'bg-[#5e5ce6]/[0.08] text-[#5e5ce6] font-medium';
    case 'ok':
      return 'bg-[#30d158]/[0.12] text-[#248a3d] font-medium';
    case 'bad':
      return 'bg-[#ff375f]/[0.10] text-[#d70015] font-medium';
    case 'mut':
      return 'bg-[#ffd60a]/[0.18] text-[#9a6a00] font-semibold';
    default:
      return 'text-[#1d1d1f]';
  }
}

function DataTable({
  headers,
  rows,
  headColor = '#1d1d1f',
  className = '',
}: {
  headers: React.ReactNode[];
  rows: TCell[][];
  headColor?: string;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto overflow-y-hidden rounded-2xl border border-black/[0.08] bg-white ${className}`}>
      <table className="w-full text-[14px] tabular-nums">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-4 py-3 text-left text-[12.5px] font-semibold tracking-wide text-white"
                style={{ background: headColor }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-black/[0.05]">
              {r.map((c, ci) => (
                <td key={ci} className={`whitespace-nowrap px-4 py-2.5 ${cellCls(c.k)}`}>
                  {c.v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Small pill / badge
function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold"
      style={{ background: color + '1a', color }}
    >
      {children}
    </span>
  );
}

// Monospace dependency chip
function Dep({ tone = 'blue', children }: { tone?: 'blue' | 'good' | 'bad'; children: React.ReactNode }) {
  const map = {
    blue: 'bg-[#0071e3]/[0.08] text-[#0071e3]',
    good: 'bg-[#30d158]/[0.14] text-[#248a3d]',
    bad: 'bg-[#ff375f]/[0.10] text-[#d70015]',
  } as const;
  return (
    <span className={`inline-block rounded-lg px-3 py-1.5 font-mono text-[13.5px] font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ACTIVITY DATA
// Seven small tables, mixed up so they are not grouped by normal form. The
// question gives no dependencies and no hints — the student reads the data,
// spots the repeated values, and decides what to do. The answer shows the
// dependencies and the broken-apart tables.
// ════════════════════════════════════════════════════════════════════════════
interface AnswerTable {
  name: string;
  pk: string;
  color: string;
  headers: string[];
  rows: TCell[][];
}
interface MarkedFd {
  fd: string;
  tone: 'good' | 'bad';
  note: string;
}
interface Activity {
  id: number;
  accent: string;
  eyebrow: string; // a plain context label — never says the normal form
  title: string;
  scenario: string;
  tableName: string;
  pk: string;
  headers: string[];
  rows: TCell[][];
  // Answer ──────────────
  verdict: string; // e.g. "In 1NF — not in 2NF"
  verdictColor: string;
  why: React.ReactNode;
  markedFds: MarkedFd[];
  answerTables: AnswerTable[];
  alreadyOk?: boolean; // true when the table is already normalised
  closing: React.ReactNode;
}

const ACTIVITIES: Activity[] = [
  // ── 1 · Online shop — partial dependency (1NF, not 2NF) ───────────────────
  {
    id: 1,
    accent: '#ff375f',
    eyebrow: 'Online shop',
    title: 'The order lines table',
    scenario:
      'An online shop keeps its order lines in one table. The key is made of two columns, {OrderID, ProductID}. Look at what each column depends on.',
    tableName: 'Order_Items',
    pk: '{OrderID, ProductID}',
    headers: ['OrderID', 'ProductID', 'ProductName', 'Quantity'],
    rows: [
      [{ v: 'O1', k: 'pk' }, { v: 'P1', k: 'pk' }, { v: 'Keyboard', k: 'bad' }, { v: 2 }],
      [{ v: 'O1', k: 'pk' }, { v: 'P2', k: 'pk' }, { v: 'Mouse', k: 'bad' }, { v: 1 }],
      [{ v: 'O2', k: 'pk' }, { v: 'P1', k: 'pk' }, { v: 'Keyboard', k: 'bad' }, { v: 3 }],
    ],
    verdict: 'In 1NF — not in 2NF',
    verdictColor: '#9a6a00',
    why: (
      <>
        The key is <span className="font-mono">{'{OrderID, ProductID}'}</span>, but{' '}
        <strong>ProductName</strong> depends only on <strong>ProductID</strong> — just part of the key. This is a{' '}
        <strong>partial dependency</strong>, which is not allowed in 2NF. You can see “Keyboard” repeats every time
        P1 is ordered. Move ProductName into its own table.
      </>
    ),
    markedFds: [
      { fd: 'ProductID → ProductName', tone: 'bad', note: 'Depends on only part of the key. This breaks 2NF.' },
      { fd: '{OrderID, ProductID} → Quantity', tone: 'good', note: 'You need both columns to know the quantity. This is fine.' },
    ],
    answerTables: [
      {
        name: 'Products',
        pk: 'ProductID',
        color: '#30d158',
        headers: ['ProductID', 'ProductName'],
        rows: [
          [{ v: 'P1', k: 'pk' }, { v: 'Keyboard', k: 'ok' }],
          [{ v: 'P2', k: 'pk' }, { v: 'Mouse', k: 'ok' }],
        ],
      },
      {
        name: 'Order_Items',
        pk: '{OrderID, ProductID}',
        color: '#5e5ce6',
        headers: ['OrderID', 'ProductID', 'Quantity'],
        rows: [
          [{ v: 'O1', k: 'pk' }, { v: 'P1', k: 'pk' }, { v: 2, k: 'ok' }],
          [{ v: 'O1', k: 'pk' }, { v: 'P2', k: 'pk' }, { v: 1, k: 'ok' }],
          [{ v: 'O2', k: 'pk' }, { v: 'P1', k: 'pk' }, { v: 3, k: 'ok' }],
        ],
      },
    ],
    closing: (
      <>
        “Keyboard” is now stored <strong>once</strong> in{' '}
        <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">Products</code>. If you rename it, you change one row.{' '}
        <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">ProductID</code> stays in{' '}
        <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">Order_Items</code> as a foreign key to join the two tables.
      </>
    ),
  },

  // ── 2 · Streaming service — multi-valued cell (not 1NF) ───────────────────
  {
    id: 2,
    accent: '#0071e3',
    eyebrow: 'Streaming service',
    title: 'The movies table',
    scenario:
      'A streaming app stores each movie with its cast in one column, separated by commas. Look at the table and decide what to do.',
    tableName: 'Movies',
    pk: 'MovieID',
    headers: ['MovieID', 'Title', 'Actors'],
    rows: [
      [{ v: 'M1', k: 'pk' }, { v: 'Inception' }, { v: 'DiCaprio, Hardy', k: 'bad' }],
      [{ v: 'M2', k: 'pk' }, { v: 'Titanic' }, { v: 'DiCaprio, Winslet', k: 'bad' }],
      [{ v: 'M3', k: 'pk' }, { v: 'Joker' }, { v: 'Phoenix', k: 'bad' }],
    ],
    verdict: 'Not in 1NF',
    verdictColor: '#d70015',
    why: (
      <>
        The <strong>Actors</strong> cell holds more than one value — “DiCaprio, Hardy” is two actors in one cell.
        1NF says every cell must hold a single value, so this table breaks the first rule. Put each actor on its own
        row.
      </>
    ),
    markedFds: [
      { fd: 'MovieID → Title', tone: 'good', note: 'One movie ID gives one title. This is fine.' },
    ],
    answerTables: [
      {
        name: 'Movie_Cast (1NF)',
        pk: '{MovieID, Actor}',
        color: '#30d158',
        headers: ['MovieID', 'Title', 'Actor'],
        rows: [
          [{ v: 'M1', k: 'pk' }, { v: 'Inception' }, { v: 'DiCaprio', k: 'ok' }],
          [{ v: 'M1', k: 'pk' }, { v: 'Inception' }, { v: 'Hardy', k: 'ok' }],
          [{ v: 'M2', k: 'pk' }, { v: 'Titanic' }, { v: 'DiCaprio', k: 'ok' }],
          [{ v: 'M2', k: 'pk' }, { v: 'Titanic' }, { v: 'Winslet', k: 'ok' }],
          [{ v: 'M3', k: 'pk' }, { v: 'Joker' }, { v: 'Phoenix', k: 'ok' }],
        ],
      },
    ],
    closing: (
      <>
        Every cell now holds one value, and the key is the pair{' '}
        <span className="font-mono text-[#0071e3]">{'{MovieID, Actor}'}</span>. Now you can find every movie
        DiCaprio is in with <code className="rounded bg-[#f5f5f7] px-1.5 py-0.5 text-[12px]">WHERE Actor = 'DiCaprio'</code>.
      </>
    ),
  },

  // ── 3 · Library — transitive dependency (2NF, not 3NF) ────────────────────
  {
    id: 3,
    accent: '#30d158',
    eyebrow: 'Library',
    title: 'The books table',
    scenario:
      'A library lists its books in one table. The key is a single column, BookID. Look at how the city is linked to the book.',
    tableName: 'Books',
    pk: 'BookID',
    headers: ['BookID', 'Title', 'PublisherID', 'PublisherCity'],
    rows: [
      [{ v: 'B1', k: 'pk' }, { v: 'SQL Basics' }, { v: 'PUB1' }, { v: 'London', k: 'bad' }],
      [{ v: 'B2', k: 'pk' }, { v: 'Data 101' }, { v: 'PUB1' }, { v: 'London', k: 'bad' }],
      [{ v: 'B3', k: 'pk' }, { v: 'Web Dev' }, { v: 'PUB2' }, { v: 'Paris', k: 'bad' }],
    ],
    verdict: 'In 2NF — not in 3NF',
    verdictColor: '#0066cc',
    why: (
      <>
        <strong>PublisherCity</strong> does not depend on the book directly. It depends on{' '}
        <strong>PublisherID</strong>, and PublisherID depends on BookID. So we have a chain:{' '}
        <span className="font-mono text-[13px]">BookID → PublisherID → PublisherCity</span>. This is a{' '}
        <strong>transitive dependency</strong>, which 3NF does not allow. “London” repeats for every book from PUB1.
        Move publishers into their own table.
      </>
    ),
    markedFds: [
      { fd: 'PublisherID → PublisherCity', tone: 'bad', note: 'PublisherID is not a key, so the city reaches BookID through it. This breaks 3NF.' },
      { fd: 'BookID → Title, PublisherID', tone: 'good', note: 'Depends straight on the key. This stays in the Books table.' },
    ],
    answerTables: [
      {
        name: 'Books',
        pk: 'BookID',
        color: '#0071e3',
        headers: ['BookID', 'Title', 'PublisherID (FK)'],
        rows: [
          [{ v: 'B1', k: 'pk' }, { v: 'SQL Basics' }, { v: 'PUB1', k: 'fk' }],
          [{ v: 'B2', k: 'pk' }, { v: 'Data 101' }, { v: 'PUB1', k: 'fk' }],
          [{ v: 'B3', k: 'pk' }, { v: 'Web Dev' }, { v: 'PUB2', k: 'fk' }],
        ],
      },
      {
        name: 'Publishers',
        pk: 'PublisherID',
        color: '#30d158',
        headers: ['PublisherID', 'PublisherCity'],
        rows: [
          [{ v: 'PUB1', k: 'pk' }, { v: 'London', k: 'ok' }],
          [{ v: 'PUB2', k: 'pk' }, { v: 'Paris', k: 'ok' }],
        ],
      },
    ],
    closing: (
      <>
        Each publisher’s city is now in <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">Publishers</code>{' '}
        once. If PUB1 moves city, you change <strong>one row</strong> instead of every book.
      </>
    ),
  },

  // ── 4 · Customer records — already normalised (in 3NF) ────────────────────
  {
    id: 4,
    accent: '#5e5ce6',
    eyebrow: 'Customer records',
    title: 'The customers table',
    scenario:
      'A shop keeps its customers in this table. The key is a single column, CustomerID. Read it carefully — not every table needs changing.',
    tableName: 'Customers',
    pk: 'CustomerID',
    headers: ['CustomerID', 'CustomerName', 'Email'],
    rows: [
      [{ v: 'C1', k: 'pk' }, { v: 'Ravi' }, { v: 'ravi@mail.com' }],
      [{ v: 'C2', k: 'pk' }, { v: 'Mary' }, { v: 'mary@mail.com' }],
      [{ v: 'C3', k: 'pk' }, { v: 'Sara' }, { v: 'sara@mail.com' }],
    ],
    verdict: 'Already in 3NF',
    verdictColor: '#248a3d',
    why: (
      <>
        Every cell holds one value, so it is in 1NF. The key is a single column, so there are no partial
        dependencies — that gives 2NF for free. And both <strong>CustomerName</strong> and <strong>Email</strong>{' '}
        depend straight on CustomerID, with no chain in between, so it is in 3NF too. There is nothing to fix.
      </>
    ),
    markedFds: [
      { fd: 'CustomerID → CustomerName', tone: 'good', note: 'Depends straight on the key.' },
      { fd: 'CustomerID → Email', tone: 'good', note: 'Also depends straight on the key. No chain, no repeat.' },
    ],
    answerTables: [
      {
        name: 'Customers',
        pk: 'CustomerID',
        color: '#30d158',
        headers: ['CustomerID', 'CustomerName', 'Email'],
        rows: [
          [{ v: 'C1', k: 'pk' }, { v: 'Ravi', k: 'ok' }, { v: 'ravi@mail.com', k: 'ok' }],
          [{ v: 'C2', k: 'pk' }, { v: 'Mary', k: 'ok' }, { v: 'mary@mail.com', k: 'ok' }],
          [{ v: 'C3', k: 'pk' }, { v: 'Sara', k: 'ok' }, { v: 'sara@mail.com', k: 'ok' }],
        ],
      },
    ],
    alreadyOk: true,
    closing: (
      <>
        Watch out for tables like this — it is already in 3NF, so splitting it would only make things worse. Part of
        normalising is knowing when to stop.
      </>
    ),
  },

  // ── 5 · Student clubs — multi-valued cell (not 1NF) ───────────────────────
  {
    id: 5,
    accent: '#ff9f0a',
    eyebrow: 'Student clubs',
    title: 'The student clubs table',
    scenario:
      'A coordinator keeps each student’s clubs in one column, separated by commas. Look at the table and decide what to do.',
    tableName: 'Student_Clubs',
    pk: 'StudentID',
    headers: ['StudentID', 'StudentName', 'Clubs'],
    rows: [
      [{ v: 'S1', k: 'pk' }, { v: 'Amal' }, { v: 'Chess, Drama', k: 'bad' }],
      [{ v: 'S2', k: 'pk' }, { v: 'Nimal' }, { v: 'Cricket', k: 'bad' }],
      [{ v: 'S3', k: 'pk' }, { v: 'Kamala' }, { v: 'Art, Music, Dance', k: 'bad' }],
    ],
    verdict: 'Not in 1NF',
    verdictColor: '#d70015',
    why: (
      <>
        The <strong>Clubs</strong> cell holds more than one value — “Chess, Drama” is two clubs in one cell. 1NF says
        every cell must hold a single value, so this table breaks the first rule. Put each club on its own row.
      </>
    ),
    markedFds: [
      { fd: 'StudentID → StudentName', tone: 'good', note: 'One student ID gives one name. This is fine.' },
    ],
    answerTables: [
      {
        name: 'Student_Clubs (1NF)',
        pk: '{StudentID, Club}',
        color: '#30d158',
        headers: ['StudentID', 'StudentName', 'Club'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'Amal' }, { v: 'Chess', k: 'ok' }],
          [{ v: 'S1', k: 'pk' }, { v: 'Amal' }, { v: 'Drama', k: 'ok' }],
          [{ v: 'S2', k: 'pk' }, { v: 'Nimal' }, { v: 'Cricket', k: 'ok' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Kamala' }, { v: 'Art', k: 'ok' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Kamala' }, { v: 'Music', k: 'ok' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Kamala' }, { v: 'Dance', k: 'ok' }],
        ],
      },
    ],
    closing: (
      <>
        Every cell now holds one value, and the key is the pair{' '}
        <span className="font-mono text-[#0071e3]">{'{StudentID, Club}'}</span>. Now you can find who is in the Chess
        club with <code className="rounded bg-[#f5f5f7] px-1.5 py-0.5 text-[12px]">WHERE Club = 'Chess'</code>.
      </>
    ),
  },

  // ── 6 · Health clinic — two partial dependencies (1NF, not 2NF) ───────────
  {
    id: 6,
    accent: '#bf5af2',
    eyebrow: 'Health clinic',
    title: 'The appointments table',
    scenario:
      'A small clinic books appointments in one table. The key is the pair {PatientID, DoctorID}. This one has two repeated facts — find them both.',
    tableName: 'Appointments',
    pk: '{PatientID, DoctorID}',
    headers: ['PatientID', 'PatientName', 'DoctorID', 'DoctorName', 'Fee'],
    rows: [
      [{ v: 'PT1', k: 'pk' }, { v: 'Ravi', k: 'bad' }, { v: 'DR1', k: 'pk' }, { v: 'Dr. Perera', k: 'bad' }, { v: '$40' }],
      [{ v: 'PT1', k: 'pk' }, { v: 'Ravi', k: 'bad' }, { v: 'DR2', k: 'pk' }, { v: 'Dr. Silva', k: 'bad' }, { v: '$55' }],
      [{ v: 'PT2', k: 'pk' }, { v: 'Mary', k: 'bad' }, { v: 'DR1', k: 'pk' }, { v: 'Dr. Perera', k: 'bad' }, { v: '$40' }],
    ],
    verdict: 'In 1NF — not in 2NF',
    verdictColor: '#a855f7',
    why: (
      <>
        Every cell holds one value, so it is in 1NF. But the key is{' '}
        <span className="font-mono">{'{PatientID, DoctorID}'}</span> and two columns depend on only part of it:{' '}
        <strong>PatientName</strong> needs only PatientID, and <strong>DoctorName</strong> needs only DoctorID. These
        are two <strong>partial dependencies</strong>, so it is not in 2NF. Split each one into its own table. After
        that the result is also in 3NF, because there are no more chains to fix.
      </>
    ),
    markedFds: [
      { fd: 'PatientID → PatientName', tone: 'bad', note: 'Needs only part of the key. Breaks 2NF.' },
      { fd: 'DoctorID → DoctorName', tone: 'bad', note: 'Needs only the other part of the key. Also breaks 2NF.' },
      { fd: '{PatientID, DoctorID} → Fee', tone: 'good', note: 'The fee depends on the patient and doctor together. This stays.' },
    ],
    answerTables: [
      {
        name: 'Patients',
        pk: 'PatientID',
        color: '#0071e3',
        headers: ['PatientID', 'PatientName'],
        rows: [
          [{ v: 'PT1', k: 'pk' }, { v: 'Ravi', k: 'ok' }],
          [{ v: 'PT2', k: 'pk' }, { v: 'Mary', k: 'ok' }],
        ],
      },
      {
        name: 'Doctors',
        pk: 'DoctorID',
        color: '#30d158',
        headers: ['DoctorID', 'DoctorName'],
        rows: [
          [{ v: 'DR1', k: 'pk' }, { v: 'Dr. Perera', k: 'ok' }],
          [{ v: 'DR2', k: 'pk' }, { v: 'Dr. Silva', k: 'ok' }],
        ],
      },
      {
        name: 'Appointments',
        pk: '{PatientID, DoctorID}',
        color: '#5e5ce6',
        headers: ['PatientID', 'DoctorID', 'Fee'],
        rows: [
          [{ v: 'PT1', k: 'pk' }, { v: 'DR1', k: 'pk' }, { v: '$40', k: 'ok' }],
          [{ v: 'PT1', k: 'pk' }, { v: 'DR2', k: 'pk' }, { v: '$55', k: 'ok' }],
          [{ v: 'PT2', k: 'pk' }, { v: 'DR1', k: 'pk' }, { v: '$40', k: 'ok' }],
        ],
      },
    ],
    closing: (
      <>
        Three clean tables. Each patient and doctor name is stored once, and{' '}
        <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">Appointments</code> keeps only the two keys and the
        fee. No non-key column depends on another non-key column, so this is also in <strong>3NF</strong>. Nothing
        more to split.
      </>
    ),
  },

  // ── 7 · HR system — transitive dependency (2NF, not 3NF) ──────────────────
  {
    id: 7,
    accent: '#0d9488',
    eyebrow: 'HR system',
    title: 'The employees table',
    scenario:
      'This HR table lists employees and the department each one works in. The key is a single column, EmpID. Look at how DeptName is linked to the key.',
    tableName: 'Employees',
    pk: 'EmpID',
    headers: ['EmpID', 'EmpName', 'DeptID', 'DeptName'],
    rows: [
      [{ v: 'E1', k: 'pk' }, { v: 'Sara' }, { v: 'D1' }, { v: 'Sales', k: 'bad' }],
      [{ v: 'E2', k: 'pk' }, { v: 'John' }, { v: 'D1' }, { v: 'Sales', k: 'bad' }],
      [{ v: 'E3', k: 'pk' }, { v: 'Lisa' }, { v: 'D2' }, { v: 'IT', k: 'bad' }],
    ],
    verdict: 'In 2NF — not in 3NF',
    verdictColor: '#0066cc',
    why: (
      <>
        <strong>DeptName</strong> does not depend on the employee directly. It depends on{' '}
        <strong>DeptID</strong>, and DeptID depends on EmpID. So we have a chain:{' '}
        <span className="font-mono text-[13px]">EmpID → DeptID → DeptName</span>. This is a{' '}
        <strong>transitive dependency</strong>, which 3NF does not allow. “Sales” repeats for every employee in D1.
        Move departments into their own table.
      </>
    ),
    markedFds: [
      { fd: 'DeptID → DeptName', tone: 'bad', note: 'DeptID is not a key, so DeptName reaches EmpID through it. This breaks 3NF.' },
      { fd: 'EmpID → EmpName, DeptID', tone: 'good', note: 'Depends straight on the key. This stays in the Employees table.' },
    ],
    answerTables: [
      {
        name: 'Employees',
        pk: 'EmpID',
        color: '#0071e3',
        headers: ['EmpID', 'EmpName', 'DeptID (FK)'],
        rows: [
          [{ v: 'E1', k: 'pk' }, { v: 'Sara' }, { v: 'D1', k: 'fk' }],
          [{ v: 'E2', k: 'pk' }, { v: 'John' }, { v: 'D1', k: 'fk' }],
          [{ v: 'E3', k: 'pk' }, { v: 'Lisa' }, { v: 'D2', k: 'fk' }],
        ],
      },
      {
        name: 'Departments',
        pk: 'DeptID',
        color: '#30d158',
        headers: ['DeptID', 'DeptName'],
        rows: [
          [{ v: 'D1', k: 'pk' }, { v: 'Sales', k: 'ok' }],
          [{ v: 'D2', k: 'pk' }, { v: 'IT', k: 'ok' }],
        ],
      },
    ],
    closing: (
      <>
        Each department name is now in <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">Departments</code>{' '}
        once. To rename “Sales” to “Revenue”, you change <strong>one row</strong> instead of every employee.
      </>
    ),
  },
];

// ════════════════════════════════════════════════════════════════════════════
// PASSWORD GATE — wraps each answer. Every gate shares one unlock state, so
// entering the password once reveals all answers for the rest of the session.
// ════════════════════════════════════════════════════════════════════════════
function AnswerGate({
  accent,
  unlocked,
  onUnlock,
  children,
}: {
  accent: string;
  unlocked: boolean;
  onUnlock: () => void;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === ANSWER_PASSWORD) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  };

  if (unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className="flex flex-col items-center rounded-[24px] border border-dashed bg-[#fafafa] px-6 py-12 text-center"
      style={{ borderColor: accent + '55' }}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
        style={{ background: accent + '14' }}
      >
        🔒
      </div>
      <p className="text-[18px] font-semibold text-[#1d1d1f]">The answer is locked</p>
      <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-[#6e6e73]">
        Try the table on your own first. Your lecturer will give you the password to see the full answer.
      </p>
      <form onSubmit={submit} className="mt-6 flex w-full max-w-sm flex-col items-center gap-3 sm:flex-row">
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          placeholder="Enter password"
          aria-label="Answer password"
          className="w-full flex-1 rounded-full border border-black/[0.12] bg-white px-5 py-2.5 text-center text-[15px] outline-none transition focus:border-black/[0.3] sm:text-left"
        />
        <button
          type="submit"
          className="w-full rounded-full px-6 py-2.5 text-[15px] font-medium text-white transition hover:opacity-90 sm:w-auto"
          style={{ background: accent }}
        >
          Unlock
        </button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-[14px] font-medium text-[#d70015]"
          >
            Wrong password. Try again.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ANSWER BODY — the verdict, the dependencies and the decomposed tables.
// ════════════════════════════════════════════════════════════════════════════
function AnswerBody({ a }: { a: Activity }) {
  return (
    <div className="rounded-[24px] border border-[#30d158]/30 bg-[#f6fdf8] p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-[#248a3d]">Answer</span>
        <span
          className="rounded-full px-3.5 py-1 text-[14px] font-semibold text-white"
          style={{ background: a.verdictColor }}
        >
          {a.verdict}
        </span>
      </div>

      <p className="text-[16px] leading-relaxed text-[#424245]">{a.why}</p>

      {/* The dependencies */}
      <p className="mb-3 mt-7 text-[13px] font-semibold uppercase tracking-wide text-[#86868b]">
        The dependencies
      </p>
      <div className="space-y-2.5">
        {a.markedFds.map((m) => (
          <div
            key={m.fd}
            className="flex flex-col gap-1.5 rounded-2xl border p-4 sm:flex-row sm:items-center sm:gap-4"
            style={{
              borderColor: (m.tone === 'bad' ? '#ff375f' : '#30d158') + '33',
              background: (m.tone === 'bad' ? '#ff375f' : '#30d158') + '0a',
            }}
          >
            <div className="shrink-0">
              <Dep tone={m.tone}>
                {m.fd} {m.tone === 'bad' ? '✗' : '✓'}
              </Dep>
            </div>
            <p className="text-[14px] leading-relaxed text-[#6e6e73]">{m.note}</p>
          </div>
        ))}
      </div>

      {/* The tables */}
      <p className="mb-3 mt-7 text-[13px] font-semibold uppercase tracking-wide text-[#86868b]">
        {a.alreadyOk ? 'The table (no change needed)' : 'The normalised tables'}
      </p>
      <div className="flex flex-col gap-5">
        {a.answerTables.map((t) => (
          <div key={t.name}>
            <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
              <Pill color={t.color}>{t.name}</Pill>
              <span className="font-mono text-[12.5px] text-[#86868b]">PK: {t.pk}</span>
            </div>
            <DataTable headers={t.headers} rows={t.rows} headColor={t.color} />
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-2xl bg-white/70 px-5 py-4 text-[15px] leading-relaxed text-[#424245]">
        {a.closing}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ACTIVITY CARD — scenario + table + question on top, gated answer below.
// No dependencies and no hints are shown — the student reads the data.
// ════════════════════════════════════════════════════════════════════════════
function ActivityCard({
  a,
  unlocked,
  onUnlock,
}: {
  a: Activity;
  unlocked: boolean;
  onUnlock: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[20px] font-bold text-white"
          style={{ background: a.accent }}
        >
          {a.id}
        </div>
        <div>
          <p className="text-[14px] font-semibold tracking-tight" style={{ color: a.accent }}>
            Activity {a.id} · {a.eyebrow}
          </p>
          <h3 className="mt-0.5 text-[24px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[28px]">
            {a.title}
          </h3>
        </div>
      </div>

      <p className="mb-5 text-[16px] leading-relaxed text-[#424245]">{a.scenario}</p>

      {/* The table */}
      <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
        <Pill color="#86868b">{a.tableName}</Pill>
        <span className="font-mono text-[12.5px] text-[#86868b]">PK: {a.pk}</span>
      </div>
      <DataTable headers={a.headers} rows={a.rows} headColor="#86868b" />

      {/* The question */}
      <div
        className="mt-5 rounded-2xl border p-5"
        style={{ borderColor: a.accent + '40', background: a.accent + '0a' }}
      >
        <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-wide" style={{ color: a.accent }}>
          Your task
        </p>
        <p className="text-[16px] font-medium leading-relaxed text-[#1d1d1f]">{TASK}</p>
      </div>

      {/* Gated answer */}
      <div className="mt-6">
        <AnswerGate accent={a.accent} unlocked={unlocked} onUnlock={onUnlock}>
          <AnswerBody a={a} />
        </AnswerGate>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function NormalizationActivitiesPage() {
  const [unlocked, setUnlocked] = useState(false);
  const unlock = () => setUnlocked(true);

  return (
    <div className="bg-white text-[#1d1d1f]" style={{ fontFamily: APPLE_FONT }}>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6">
        <div className="absolute left-6 top-6 z-20 sm:left-10 sm:top-8">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={28} variant="on-light" />
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#ff9f0a]/[0.07] blur-3xl" />
          <div className="absolute bottom-[-10%] right-[12%] h-[420px] w-[420px] rounded-full bg-[#5e5ce6]/[0.06] blur-3xl" />
        </div>

        <div className="relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[17px] font-medium text-[#6e6e73]"
          >
            Practice activities · Dr. Yasas Sri Wickramasinghe
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[64px] lg:text-[76px]"
          >
            Normalise it yourself.
            <br />
            <span className="bg-gradient-to-r from-[#ff375f] via-[#ff9f0a] to-[#0071e3] bg-clip-text text-transparent">
              1NF · 2NF · 3NF
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-[19px] leading-relaxed text-[#6e6e73] sm:text-[21px]"
          >
            Seven short tables, mixed up — they are not in order, and we don’t tell you which form each one is in. For
            each table, work out the highest normal form it is in, then normalise it. Try it yourself first. The
            answer is hidden behind a password until your lecturer shares it.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
          >
            <button
              onClick={() => document.getElementById('activity-1')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="rounded-full bg-[#1d1d1f] px-7 py-3 text-[17px] font-medium text-white transition hover:bg-black"
            >
              Start Activity 1
            </button>
            <Link to="/normalisation" className="text-[17px] font-medium text-[#0071e3] no-underline hover:underline">
              Need a refresher? ›
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="border-y border-black/[0.06] bg-[#f5f5f7] px-6 py-20">
        <Reveal>
          <SectionHead
            eyebrow="How to use this"
            title="Read, decide, normalise, check"
            sub="Each activity works the same way. Do your own answer first, then unlock the one here to check it."
          />
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
        >
          {[
            { e: '🔍', t: 'Find the problem', c: '#ff375f', d: 'Read the table. Where is the same value repeated, or where is a cell holding a list?' },
            { e: '🏷️', t: 'Name the form', c: '#ff9f0a', d: 'Decide the highest normal form it is in now — 1NF, 2NF or 3NF. Some are already fine.' },
            { e: '✂️', t: 'Split and check', c: '#0071e3', d: 'Break it into clean tables, then unlock the answer to check your work.' },
          ].map((p) => (
            <motion.div
              key={p.t}
              variants={item}
              className="rounded-[28px] border border-black/[0.07] bg-white p-8"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ background: p.c + '14' }}>
                {p.e}
              </div>
              <h3 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">{p.t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#6e6e73]">{p.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── ACTIVITIES ─────────────────────────────────────────────────────── */}
      {ACTIVITIES.map((a, i) => (
        <section
          key={a.id}
          id={`activity-${a.id}`}
          className={`px-6 py-24 sm:py-28 ${i % 2 === 1 ? 'bg-[#f5f5f7]' : ''}`}
        >
          <Reveal>
            <ActivityCard a={a} unlocked={unlocked} onUnlock={unlock} />
          </Reveal>
        </section>
      ))}

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-4 flex items-center justify-center">
          <BrandLogo iconSize={28} variant="on-light" />
        </div>
        <p className="text-[14px] text-[#6e6e73]">
          Database Normalisation practice activities, made by{' '}
          <span className="font-medium text-[#1d1d1f]">Dr. Yasas Sri Wickramasinghe</span>.
        </p>
        <p className="mt-2 text-[12px] text-[#aeaeb2]">
          Everything runs in your browser. No data is stored.
        </p>
      </footer>
    </div>
  );
}
