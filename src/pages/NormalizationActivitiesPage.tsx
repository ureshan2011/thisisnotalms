import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';

// ─── SQL Normalisation — Activities & Answers (Not a LMS) ────────────────────
// A focused practice lesson: four small, easy-to-read tables. For each one the
// student decides which normal form it is currently in and normalises it. The
// worked answer — with the table broken apart and every functional dependency
// marked — stays hidden behind a password so it can be used in class. Built in
// the same Apple-styled design language as the Normalisation Explorer lesson.
// Nothing is collected or stored — everything runs in the browser.

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

// The single password that unlocks every answer on this page.
const ANSWER_PASSWORD = 'MBi802NF';

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
// Four small tables. Each is deliberately simple — just enough rows to make the
// repetition (and the fix) obvious. The answer shows the broken-apart tables and
// every functional dependency, marked good / partial / transitive.
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
  eyebrow: string;
  title: string;
  scenario: string;
  tableName: string;
  pk: string;
  headers: string[];
  rows: TCell[][];
  // The functional dependencies students are told to assume.
  givenFds: string[];
  task: string;
  // Answer ──────────────
  verdict: string; // e.g. "Currently in 1NF — violates 2NF"
  verdictColor: string;
  why: React.ReactNode;
  markedFds: MarkedFd[];
  answerTables: AnswerTable[];
  closing: React.ReactNode;
}

const ACTIVITIES: Activity[] = [
  // ── Activity 1 — 1NF ──────────────────────────────────────────────────────
  {
    id: 1,
    accent: '#ff375f',
    eyebrow: 'Activity 1 · First Normal Form',
    title: 'The student hobbies list',
    scenario:
      'A club coordinator keeps every student’s hobbies in one column, separated by commas. Read the table, decide which normal form it is in, and fix it.',
    tableName: 'Student_Hobbies',
    pk: 'StudentID',
    headers: ['StudentID', 'StudentName', 'Hobbies'],
    rows: [
      [{ v: 'S1', k: 'pk' }, { v: 'Amal' }, { v: 'Cricket, Music', k: 'bad' }],
      [{ v: 'S2', k: 'pk' }, { v: 'Nimal' }, { v: 'Reading', k: 'bad' }],
      [{ v: 'S3', k: 'pk' }, { v: 'Kamala' }, { v: 'Dancing, Art, Chess', k: 'bad' }],
    ],
    givenFds: ['StudentID → StudentName'],
    task: 'Which normal form is this table in right now? Normalise it so it satisfies 1NF.',
    verdict: 'Not even in 1NF',
    verdictColor: '#d70015',
    why: (
      <>
        The <strong>Hobbies</strong> cell holds a <em>list</em> of values — “Cricket, Music” is two facts crammed
        into one box. 1NF demands that every cell hold a single, atomic value, so this table fails the very first
        rule. Give each hobby its own row.
      </>
    ),
    markedFds: [
      { fd: 'StudentID → StudentName', tone: 'good', note: 'One student ID always maps to one name — a clean dependency.' },
    ],
    answerTables: [
      {
        name: 'Student_Hobbies (1NF)',
        pk: '{StudentID, Hobby}',
        color: '#30d158',
        headers: ['StudentID', 'StudentName', 'Hobby'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'Amal' }, { v: 'Cricket', k: 'ok' }],
          [{ v: 'S1', k: 'pk' }, { v: 'Amal' }, { v: 'Music', k: 'ok' }],
          [{ v: 'S2', k: 'pk' }, { v: 'Nimal' }, { v: 'Reading', k: 'ok' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Kamala' }, { v: 'Dancing', k: 'ok' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Kamala' }, { v: 'Art', k: 'ok' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Kamala' }, { v: 'Chess', k: 'ok' }],
        ],
      },
    ],
    closing: (
      <>
        Every cell is now atomic, and the primary key becomes the pair{' '}
        <span className="font-mono text-[#0071e3]">{'{StudentID, Hobby}'}</span>. You can now ask “who plays Chess?”
        with a simple <code className="rounded bg-[#f5f5f7] px-1.5 py-0.5 text-[12px]">WHERE Hobby = 'Chess'</code>.
      </>
    ),
  },

  // ── Activity 2 — 2NF ──────────────────────────────────────────────────────
  {
    id: 2,
    accent: '#ff9f0a',
    eyebrow: 'Activity 2 · Second Normal Form',
    title: 'The order line table',
    scenario:
      'An online shop stores its order lines in one table with a two-part key {OrderID, ProductID}. Look closely at what each column really depends on.',
    tableName: 'Order_Items',
    pk: '{OrderID, ProductID}',
    headers: ['OrderID', 'ProductID', 'ProductName', 'Quantity'],
    rows: [
      [{ v: 'O1', k: 'pk' }, { v: 'P1', k: 'pk' }, { v: 'Keyboard', k: 'bad' }, { v: 2 }],
      [{ v: 'O1', k: 'pk' }, { v: 'P2', k: 'pk' }, { v: 'Mouse', k: 'bad' }, { v: 1 }],
      [{ v: 'O2', k: 'pk' }, { v: 'P1', k: 'pk' }, { v: 'Keyboard', k: 'bad' }, { v: 3 }],
    ],
    givenFds: ['{OrderID, ProductID} → Quantity', 'ProductID → ProductName'],
    task: 'This table is already in 1NF. What is its highest normal form, and how do you bring it to 2NF?',
    verdict: 'In 1NF — violates 2NF',
    verdictColor: '#9a6a00',
    why: (
      <>
        The key is the pair <span className="font-mono">{'{OrderID, ProductID}'}</span>, but{' '}
        <strong>ProductName</strong> depends on <strong>ProductID</strong> alone — only <em>part</em> of the key.
        That is a <strong>partial dependency</strong>, which 2NF forbids. Notice “Keyboard” is repeated every time
        product P1 is ordered. Split ProductName into its own table.
      </>
    ),
    markedFds: [
      {
        fd: 'ProductID → ProductName',
        tone: 'bad',
        note: 'Partial dependency — depends on only half of the composite key. This is the 2NF violation.',
      },
      {
        fd: '{OrderID, ProductID} → Quantity',
        tone: 'good',
        note: 'Full dependency — you need the whole key to know the quantity. This one is fine.',
      },
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
        “Keyboard” is now stored <strong>once</strong> in <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">Products</code>.
        Rename it and every order updates automatically. <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">ProductID</code>{' '}
        stays in <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">Order_Items</code> as a foreign key linking the two.
      </>
    ),
  },

  // ── Activity 3 — 3NF ──────────────────────────────────────────────────────
  {
    id: 3,
    accent: '#0071e3',
    eyebrow: 'Activity 3 · Third Normal Form',
    title: 'The employee department table',
    scenario:
      'An HR table lists employees and the department each one works in. Its key is a single column, EmpID. Trace how DeptName reaches the key.',
    tableName: 'Employees',
    pk: 'EmpID',
    headers: ['EmpID', 'EmpName', 'DeptID', 'DeptName'],
    rows: [
      [{ v: 'E1', k: 'pk' }, { v: 'Sara' }, { v: 'D1' }, { v: 'Sales', k: 'bad' }],
      [{ v: 'E2', k: 'pk' }, { v: 'John' }, { v: 'D1' }, { v: 'Sales', k: 'bad' }],
      [{ v: 'E3', k: 'pk' }, { v: 'Lisa' }, { v: 'D2' }, { v: 'IT', k: 'bad' }],
    ],
    givenFds: ['EmpID → EmpName, DeptID', 'DeptID → DeptName'],
    task: 'The key is a single column, so this is already in 2NF. What is its highest normal form, and how do you bring it to 3NF?',
    verdict: 'In 2NF — violates 3NF',
    verdictColor: '#0066cc',
    why: (
      <>
        <strong>DeptName</strong> does not depend on the employee directly — it depends on{' '}
        <strong>DeptID</strong>, which in turn depends on EmpID. That chain{' '}
        <span className="font-mono text-[13px]">EmpID → DeptID → DeptName</span> is a{' '}
        <strong>transitive dependency</strong>, which 3NF removes. “Sales” is repeated for every employee in D1.
        Pull departments into their own table.
      </>
    ),
    markedFds: [
      {
        fd: 'DeptID → DeptName',
        tone: 'bad',
        note: 'DeptID is a non-key column, so EmpID → DeptID → DeptName is transitive. This breaks 3NF.',
      },
      {
        fd: 'EmpID → EmpName, DeptID',
        tone: 'good',
        note: 'Direct dependency on the key — exactly what we want to keep in the Employees table.',
      },
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
        Each department name now lives in <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">Departments</code>{' '}
        exactly once. Renaming “Sales” to “Revenue” is a <strong>one-row</strong> change instead of hunting down
        every employee.
      </>
    ),
  },

  // ── Activity 4 — capstone (1NF → 3NF) ─────────────────────────────────────
  {
    id: 4,
    accent: '#bf5af2',
    eyebrow: 'Activity 4 · Putting it all together',
    title: 'The clinic appointment table',
    scenario:
      'A small clinic books appointments in one table. The key is the pair {PatientID, DoctorID}. This one hides two problems — find them both.',
    tableName: 'Appointments',
    pk: '{PatientID, DoctorID}',
    headers: ['PatientID', 'PatientName', 'DoctorID', 'DoctorName', 'Fee'],
    rows: [
      [{ v: 'PT1', k: 'pk' }, { v: 'Ravi', k: 'bad' }, { v: 'DR1', k: 'pk' }, { v: 'Dr. Perera', k: 'bad' }, { v: '$40' }],
      [{ v: 'PT1', k: 'pk' }, { v: 'Ravi', k: 'bad' }, { v: 'DR2', k: 'pk' }, { v: 'Dr. Silva', k: 'bad' }, { v: '$55' }],
      [{ v: 'PT2', k: 'pk' }, { v: 'Mary', k: 'bad' }, { v: 'DR1', k: 'pk' }, { v: 'Dr. Perera', k: 'bad' }, { v: '$40' }],
    ],
    givenFds: ['PatientID → PatientName', 'DoctorID → DoctorName', '{PatientID, DoctorID} → Fee'],
    task: 'What is the highest normal form this table is in right now? Normalise it all the way to 3NF.',
    verdict: 'In 1NF — violates 2NF',
    verdictColor: '#a855f7',
    why: (
      <>
        Every cell is atomic, so it clears 1NF. But the key is{' '}
        <span className="font-mono">{'{PatientID, DoctorID}'}</span> and two columns depend on only part of it:{' '}
        <strong>PatientName</strong> needs only PatientID and <strong>DoctorName</strong> needs only DoctorID. Two{' '}
        <strong>partial dependencies</strong> — so it fails 2NF. Split each side into its own table and the result is
        already in 3NF (there are no transitive chains left).
      </>
    ),
    markedFds: [
      {
        fd: 'PatientID → PatientName',
        tone: 'bad',
        note: 'Partial dependency — only needs half of the key. Violates 2NF.',
      },
      {
        fd: 'DoctorID → DoctorName',
        tone: 'bad',
        note: 'Partial dependency — only needs the other half of the key. Also violates 2NF.',
      },
      {
        fd: '{PatientID, DoctorID} → Fee',
        tone: 'good',
        note: 'Full dependency — the fee depends on the specific patient-and-doctor pairing. This stays.',
      },
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
        Three clean tables. Patient and doctor names are each stored once, and{' '}
        <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">Appointments</code> keeps only the two keys plus the
        fee. Because no non-key column depends on another non-key column, this design is already in{' '}
        <strong>3NF</strong> — no further splitting needed.
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
      <p className="text-[18px] font-semibold text-[#1d1d1f]">The worked answer is locked</p>
      <p className="mt-1.5 max-w-md text-[15px] leading-relaxed text-[#6e6e73]">
        Try the table yourself first. Your lecturer will share the password to reveal the full breakdown with every
        dependency marked.
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
            That password is not right — try again.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ANSWER BODY — the verdict, the marked dependencies and the decomposed tables.
// ════════════════════════════════════════════════════════════════════════════
function AnswerBody({ a }: { a: Activity }) {
  return (
    <div className="rounded-[24px] border border-[#30d158]/30 bg-[#f6fdf8] p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-[#248a3d]">Worked answer</span>
        <span
          className="rounded-full px-3.5 py-1 text-[14px] font-semibold text-white"
          style={{ background: a.verdictColor }}
        >
          {a.verdict}
        </span>
      </div>

      <p className="text-[16px] leading-relaxed text-[#424245]">{a.why}</p>

      {/* Marked functional dependencies */}
      <p className="mb-3 mt-7 text-[13px] font-semibold uppercase tracking-wide text-[#86868b]">
        The dependencies, marked
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

      {/* Decomposed tables */}
      <p className="mb-3 mt-7 text-[13px] font-semibold uppercase tracking-wide text-[#86868b]">
        The normalised tables
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
// ACTIVITY CARD — scenario + question on top, gated answer below.
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
            {a.eyebrow}
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

      {/* Given FDs + the question */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-black/[0.08] bg-[#fafafa] p-5">
          <p className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-[#86868b]">
            Assume these dependencies
          </p>
          <div className="flex flex-wrap gap-2">
            {a.givenFds.map((f) => (
              <Dep key={f}>{f}</Dep>
            ))}
          </div>
        </div>
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: a.accent + '40', background: a.accent + '0a' }}
        >
          <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-wide" style={{ color: a.accent }}>
            Your task
          </p>
          <p className="text-[16px] font-medium leading-relaxed text-[#1d1d1f]">{a.task}</p>
        </div>
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
            Four short tables, each with a hidden flaw. For every one, decide which normal form it is currently in,
            then normalise it. Work it out on paper first — the full answer, with every table broken apart and every
            dependency marked, stays locked until your lecturer shares the password.
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
            title="Read · decide · normalise · check"
            sub="Each activity follows the same rhythm. The answer only helps once you have committed to your own."
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
            { e: '🔍', t: 'Spot the flaw', c: '#ff375f', d: 'Read the small table and its dependencies. Where is the same fact being repeated?' },
            { e: '🏷️', t: 'Name the form', c: '#ff9f0a', d: 'Decide the highest normal form it currently satisfies — 1NF, 2NF or 3NF.' },
            { e: '✂️', t: 'Split & verify', c: '#0071e3', d: 'Break it into clean tables, then unlock the answer to check every dependency.' },
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
          Database Normalisation practice activities, put together by{' '}
          <span className="font-medium text-[#1d1d1f]">Dr. Yasas Sri Wickramasinghe</span>.
        </p>
        <p className="mt-2 text-[12px] text-[#aeaeb2]">
          Everything here runs in your own browser. No personal data is collected or stored.
        </p>
      </footer>
    </div>
  );
}
