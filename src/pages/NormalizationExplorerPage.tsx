import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';

// ─── SQL Normalisation lesson (Not a LMS) ───────────────────────────────────
// A single, self-contained page that walks through database normalisation —
// the anomalies that motivate it, functional dependencies, 1NF → 2NF → 3NF →
// BCNF, and decomposition. Built in the same Apple-styled design language as
// the XR Explorer lesson, with several interactive simulations so the ideas
// can be *played with* rather than just read. Nothing is collected or stored —
// every simulation runs entirely in the browser.

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

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
  dark = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]">{eyebrow}</p>
      )}
      <h2
        className={`text-[32px] font-semibold leading-[1.08] tracking-tight sm:text-[44px] ${
          dark ? 'text-white' : 'text-[#1d1d1f]'
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mx-auto mt-4 max-w-2xl text-[19px] leading-relaxed ${dark ? 'text-white/70' : 'text-[#6e6e73]'}`}>
          {sub}
        </p>
      )}
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
  mono = true,
  className = '',
}: {
  headers: React.ReactNode[];
  rows: TCell[][];
  headColor?: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto overflow-y-hidden rounded-2xl border border-black/[0.08] bg-white ${className}`}>
      <table className={`w-full text-[14px] ${mono ? 'tabular-nums' : ''}`}>
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
    <span className={`inline-block rounded-lg px-3 py-1.5 font-mono text-[14px] font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 1 — The Anomaly Playground
// An un-normalised table the learner can poke at to *trigger* each of the three
// anomalies and watch what breaks.
// ════════════════════════════════════════════════════════════════════════════
type AnomalyMode = 'idle' | 'update' | 'insert' | 'delete';

function AnomalyPlayground() {
  const [mode, setMode] = useState<AnomalyMode>('idle');

  const baseRows: TCell[][] = [
    [{ v: 'S1', k: 'pk' }, { v: 'Alice' }, { v: 'CS' }, { v: 'Dr. Smith' }, { v: 'Databases' }, { v: 'Prof. Lee' }],
    [{ v: 'S2', k: 'pk' }, { v: 'Bob' }, { v: 'CS' }, { v: 'Dr. Smith' }, { v: 'Databases' }, { v: 'Prof. Lee' }],
    [{ v: 'S3', k: 'pk' }, { v: 'Carol' }, { v: 'Math' }, { v: 'Dr. Jones' }, { v: 'Statistics' }, { v: 'Prof. Hill' }],
  ];

  const headers = ['StudentID', 'Name', 'Dept', 'DeptHead', 'Course', 'Instructor'];

  // Build the rows for the current mode
  let rows = baseRows;
  if (mode === 'update') {
    // Update anomaly: change DeptHead for CS — one row missed → inconsistency
    rows = [
      [{ v: 'S1', k: 'pk' }, { v: 'Alice' }, { v: 'CS' }, { v: 'Dr. Brown', k: 'mut' }, { v: 'Databases' }, { v: 'Prof. Lee' }],
      [{ v: 'S2', k: 'pk' }, { v: 'Bob' }, { v: 'CS' }, { v: 'Dr. Smith', k: 'bad' }, { v: 'Databases' }, { v: 'Prof. Lee' }],
      [{ v: 'S3', k: 'pk' }, { v: 'Carol' }, { v: 'Math' }, { v: 'Dr. Jones' }, { v: 'Statistics' }, { v: 'Prof. Hill' }],
    ];
  } else if (mode === 'insert') {
    rows = [
      ...baseRows,
      [
        { v: '?', k: 'bad' },
        { v: '— no student —', k: 'bad' },
        { v: 'Physics' },
        { v: 'Dr. Gupta' },
        { v: 'NULL', k: 'bad' },
        { v: 'NULL', k: 'bad' },
      ],
    ];
  } else if (mode === 'delete') {
    rows = baseRows.slice(0, 2); // Carol's row gone
  }

  const messages: Record<AnomalyMode, { title: string; color: string; body: React.ReactNode } | null> = {
    idle: null,
    update: {
      title: 'Update anomaly',
      color: '#d70015',
      body: (
        <>
          “Dr. Smith” appears in <strong>two</strong> CS rows. We renamed the head to{' '}
          <strong>Dr. Brown</strong> in Alice’s row but forgot Bob’s. The database now disagrees with
          itself about who runs CS. Update <em>every</em> copy or risk inconsistency.
        </>
      ),
    },
    insert: {
      title: 'Insertion anomaly',
      color: '#9a6a00',
      body: (
        <>
          We want to record a new <strong>Physics</strong> department headed by Dr. Gupta — but no student
          has enrolled yet. Because student + course are part of the key, we’re forced to invent fake
          NULL data just to store a department.
        </>
      ),
    },
    delete: {
      title: 'Deletion anomaly',
      color: '#0071e3',
      body: (
        <>
          Carol was the only person taking <strong>Statistics</strong>. Deleting her row didn’t just remove
          an enrolment — it erased the fact that <strong>Prof. Hill teaches Statistics</strong> and that the{' '}
          <strong>Math</strong> department exists at all.
        </>
      ),
    },
  };

  const msg = messages[mode];

  const Btn = ({ m, label }: { m: AnomalyMode; label: string }) => (
    <button
      onClick={() => setMode((cur) => (cur === m ? 'idle' : m))}
      className={`rounded-full px-5 py-2.5 text-[15px] font-medium transition ${
        mode === m
          ? 'bg-[#1d1d1f] text-white'
          : 'bg-white text-[#1d1d1f] ring-1 ring-black/[0.12] hover:bg-[#f5f5f7]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
        <Btn m="update" label="✏️ Dr. Smith retires" />
        <Btn m="insert" label="➕ Open Physics dept" />
        <Btn m="delete" label="🗑️ Carol leaves" />
        {mode !== 'idle' && (
          <button
            onClick={() => setMode('idle')}
            className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#0071e3] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <motion.div layout transition={{ duration: 0.4, ease: EASE }}>
        <DataTable headers={headers} rows={rows} headColor="#86868b" />
      </motion.div>

      <div className="mt-4 min-h-[96px]">
        <AnimatePresence mode="wait">
          {msg ? (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="rounded-2xl border p-5 text-left"
              style={{ background: msg.color + '0d', borderColor: msg.color + '33' }}
            >
              <p className="text-[17px] font-semibold" style={{ color: msg.color }}>
                {msg.title}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[#424245]">{msg.body}</p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 text-center text-[15px] leading-relaxed text-[#86868b]"
            >
              This one table stores students, departments <em>and</em> courses all at once. Tap a button to
              see how that bites back.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 2 — Functional Dependency Explorer
// Toggle candidate dependencies on/off and learn which actually hold.
// ════════════════════════════════════════════════════════════════════════════
const FD_ITEMS = [
  {
    fd: 'StudentID → StudentName',
    valid: true,
    why: 'One student ID maps to exactly one name. Knowing the ID always tells you the name.',
  },
  {
    fd: 'StudentName → StudentID',
    valid: false,
    why: 'Two different students can share the name “Alex”. A name does not pin down a single ID.',
  },
  {
    fd: 'Dept → DeptHead',
    valid: true,
    why: 'Each department has exactly one head, so the department determines the head.',
  },
  {
    fd: 'CourseID → Grade',
    valid: false,
    why: 'A course has many grades — one per student. You need the student too: {StudentID, CourseID} → Grade.',
  },
  {
    fd: '{StudentID, CourseID} → Grade',
    valid: true,
    why: 'A specific student in a specific course earns exactly one grade. The composite key determines it.',
  },
  {
    fd: 'DeptHead → Dept',
    valid: true,
    why: 'In this school each lecturer heads only one department, so the head identifies the department.',
  },
];

function FDExplorer() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-5 text-center text-[15px] text-[#86868b]">
        Does the left side really <em>determine</em> the right side? Make your guess, then tap to check.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FD_ITEMS.map((it, i) => {
          const open = revealed[i];
          return (
            <button
              key={i}
              onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}
              className="rounded-2xl border border-black/[0.08] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-22px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[15px] font-medium text-[#1d1d1f]">{it.fd}</span>
                {open ? (
                  it.valid ? (
                    <Pill color="#30d158">Holds ✓</Pill>
                  ) : (
                    <Pill color="#ff375f">Doesn’t hold ✕</Pill>
                  )
                ) : (
                  <span className="text-[13px] font-medium text-[#0071e3]">Check ›</span>
                )}
              </div>
              <AnimatePresence>
                {open && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="mt-3 overflow-hidden text-[14px] leading-relaxed text-[#6e6e73]"
                  >
                    {it.why}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 3 — The Normalisation Studio
// The centerpiece: step a single running example from un-normalised up to BCNF,
// watching tables split, redundancy fall and anomalies disappear.
// ════════════════════════════════════════════════════════════════════════════
interface NormTable {
  name: string;
  pk: string;
  color: string;
  headers: string[];
  rows: TCell[][];
}
interface Stage {
  nf: string;
  title: string;
  blurb: string;
  redundancy: number; // 0–100
  anomalies: boolean;
  tables: NormTable[];
}

const STAGES: Stage[] = [
  {
    nf: '0NF',
    title: 'Un-normalised',
    blurb:
      'Everything lives in one table, and a single cell can hold a list of courses. Impossible to query cleanly and riddled with repetition.',
    redundancy: 95,
    anomalies: true,
    tables: [
      {
        name: 'StudentCourses',
        pk: 'StudentID',
        color: '#ff375f',
        headers: ['StudentID', 'Name', 'Dept', 'DeptHead', 'Courses (id : grade)'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'Alice' }, { v: 'CS' }, { v: 'Dr. Smith' }, { v: 'C1:A, C2:B', k: 'bad' }],
          [{ v: 'S2', k: 'pk' }, { v: 'Bob' }, { v: 'CS' }, { v: 'Dr. Smith' }, { v: 'C1:A', k: 'bad' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Carol' }, { v: 'Math' }, { v: 'Dr. Jones' }, { v: 'C3:A, C4:C', k: 'bad' }],
        ],
      },
    ],
  },
  {
    nf: '1NF',
    title: 'Atomic values',
    blurb:
      'Lists are broken apart so every cell holds one value, with a composite key {StudentID, CourseID}. Still one big table — student and department facts repeat on every row.',
    redundancy: 80,
    anomalies: true,
    tables: [
      {
        name: 'StudentCourses',
        pk: '{StudentID, CourseID}',
        color: '#ff9f0a',
        headers: ['StudentID', 'CourseID', 'Name', 'Dept', 'DeptHead', 'CourseName', 'Grade'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'C1', k: 'pk' }, { v: 'Alice' }, { v: 'CS' }, { v: 'Dr. Smith' }, { v: 'Databases' }, { v: 'A' }],
          [{ v: 'S1', k: 'pk' }, { v: 'C2', k: 'pk' }, { v: 'Alice' }, { v: 'CS' }, { v: 'Dr. Smith' }, { v: 'Op. Systems' }, { v: 'B' }],
          [{ v: 'S2', k: 'pk' }, { v: 'C1', k: 'pk' }, { v: 'Bob' }, { v: 'CS' }, { v: 'Dr. Smith' }, { v: 'Databases' }, { v: 'A' }],
          [{ v: 'S3', k: 'pk' }, { v: 'C3', k: 'pk' }, { v: 'Carol' }, { v: 'Math' }, { v: 'Dr. Jones' }, { v: 'Calculus' }, { v: 'A' }],
          [{ v: 'S3', k: 'pk' }, { v: 'C4', k: 'pk' }, { v: 'Carol' }, { v: 'Math' }, { v: 'Dr. Jones' }, { v: 'Statistics' }, { v: 'C' }],
        ],
      },
    ],
  },
  {
    nf: '2NF',
    title: 'No partial dependencies',
    blurb:
      'CourseName depends only on CourseID; the student facts depend only on StudentID. Each is split into its own table, leaving a clean join table for grades.',
    redundancy: 40,
    anomalies: true,
    tables: [
      {
        name: 'Students',
        pk: 'StudentID',
        color: '#0071e3',
        headers: ['StudentID', 'Name', 'Dept', 'DeptHead'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'Alice' }, { v: 'CS' }, { v: 'Dr. Smith', k: 'bad' }],
          [{ v: 'S2', k: 'pk' }, { v: 'Bob' }, { v: 'CS' }, { v: 'Dr. Smith', k: 'bad' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Carol' }, { v: 'Math' }, { v: 'Dr. Jones' }],
        ],
      },
      {
        name: 'Courses',
        pk: 'CourseID',
        color: '#30d158',
        headers: ['CourseID', 'CourseName'],
        rows: [
          [{ v: 'C1', k: 'pk' }, { v: 'Databases', k: 'ok' }],
          [{ v: 'C2', k: 'pk' }, { v: 'Op. Systems', k: 'ok' }],
          [{ v: 'C3', k: 'pk' }, { v: 'Calculus', k: 'ok' }],
          [{ v: 'C4', k: 'pk' }, { v: 'Statistics', k: 'ok' }],
        ],
      },
      {
        name: 'Enrolment',
        pk: '{StudentID, CourseID}',
        color: '#5e5ce6',
        headers: ['StudentID', 'CourseID', 'Grade'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'C1', k: 'pk' }, { v: 'A', k: 'ok' }],
          [{ v: 'S1', k: 'pk' }, { v: 'C2', k: 'pk' }, { v: 'B', k: 'ok' }],
          [{ v: 'S2', k: 'pk' }, { v: 'C1', k: 'pk' }, { v: 'A', k: 'ok' }],
          [{ v: 'S3', k: 'pk' }, { v: 'C3', k: 'pk' }, { v: 'A', k: 'ok' }],
          [{ v: 'S3', k: 'pk' }, { v: 'C4', k: 'pk' }, { v: 'C', k: 'ok' }],
        ],
      },
    ],
  },
  {
    nf: '3NF',
    title: 'No transitive dependencies',
    blurb:
      'DeptHead depended on the student only through Dept — a transitive chain. Pull departments into their own table and the head is stored exactly once.',
    redundancy: 12,
    anomalies: false,
    tables: [
      {
        name: 'Students',
        pk: 'StudentID',
        color: '#0071e3',
        headers: ['StudentID', 'Name', 'Dept (FK)'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'Alice' }, { v: 'CS', k: 'fk' }],
          [{ v: 'S2', k: 'pk' }, { v: 'Bob' }, { v: 'CS', k: 'fk' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Carol' }, { v: 'Math', k: 'fk' }],
        ],
      },
      {
        name: 'Departments',
        pk: 'Dept',
        color: '#bf5af2',
        headers: ['Dept', 'DeptHead'],
        rows: [
          [{ v: 'CS', k: 'pk' }, { v: 'Dr. Smith', k: 'ok' }],
          [{ v: 'Math', k: 'pk' }, { v: 'Dr. Jones', k: 'ok' }],
        ],
      },
      {
        name: 'Courses',
        pk: 'CourseID',
        color: '#30d158',
        headers: ['CourseID', 'CourseName'],
        rows: [
          [{ v: 'C1', k: 'pk' }, { v: 'Databases' }],
          [{ v: 'C3', k: 'pk' }, { v: 'Calculus' }],
          [{ v: '…', k: 'pk' }, { v: '…' }],
        ],
      },
      {
        name: 'Enrolment',
        pk: '{StudentID, CourseID}',
        color: '#5e5ce6',
        headers: ['StudentID', 'CourseID', 'Grade'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'C1', k: 'pk' }, { v: 'A' }],
          [{ v: 'S3', k: 'pk' }, { v: 'C4', k: 'pk' }, { v: 'C' }],
          [{ v: '…', k: 'pk' }, { v: '…', k: 'pk' }, { v: '…' }],
        ],
      },
    ],
  },
  {
    nf: 'BCNF',
    title: 'Every determinant is a key',
    blurb:
      'In this schema every functional dependency already has a superkey on its left — so the 3NF design is also in BCNF. No further splitting needed. Redundancy is essentially gone.',
    redundancy: 6,
    anomalies: false,
    tables: [
      {
        name: 'Students',
        pk: 'StudentID',
        color: '#0071e3',
        headers: ['StudentID', 'Name', 'Dept (FK)'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'Alice' }, { v: 'CS', k: 'fk' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Carol' }, { v: 'Math', k: 'fk' }],
        ],
      },
      {
        name: 'Departments',
        pk: 'Dept',
        color: '#bf5af2',
        headers: ['Dept', 'DeptHead'],
        rows: [
          [{ v: 'CS', k: 'pk' }, { v: 'Dr. Smith', k: 'ok' }],
          [{ v: 'Math', k: 'pk' }, { v: 'Dr. Jones', k: 'ok' }],
        ],
      },
      {
        name: 'Courses',
        pk: 'CourseID',
        color: '#30d158',
        headers: ['CourseID', 'CourseName'],
        rows: [
          [{ v: 'C1', k: 'pk' }, { v: 'Databases' }],
          [{ v: '…', k: 'pk' }, { v: '…' }],
        ],
      },
      {
        name: 'Enrolment',
        pk: '{StudentID, CourseID}',
        color: '#5e5ce6',
        headers: ['StudentID', 'CourseID', 'Grade'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'C1', k: 'pk' }, { v: 'A' }],
          [{ v: '…', k: 'pk' }, { v: '…', k: 'pk' }, { v: '…' }],
        ],
      },
    ],
  },
];

function NormalizationStudio() {
  const [stage, setStage] = useState(0);
  const s = STAGES[stage];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Step control */}
      <div className="mb-6 flex overflow-hidden rounded-2xl border border-black/[0.08]">
        {STAGES.map((st, i) => {
          const active = i === stage;
          const done = i < stage;
          return (
            <button
              key={st.nf}
              onClick={() => setStage(i)}
              className={`flex-1 px-2 py-3 text-[14px] font-semibold transition ${
                active
                  ? 'bg-[#0071e3] text-white'
                  : done
                  ? 'bg-[#0071e3]/[0.08] text-[#0071e3] hover:bg-[#0071e3]/[0.14]'
                  : 'bg-white text-[#86868b] hover:bg-[#f5f5f7]'
              } ${i > 0 ? 'border-l border-black/[0.08]' : ''}`}
            >
              {st.nf}
              {done && ' ✓'}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.15fr_0.85fr]">
        {/* Tables */}
        <div>
          <div className="mb-3 flex items-baseline gap-3">
            <h3 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">{s.title}</h3>
            <span className="text-[14px] font-medium text-[#86868b]">{s.tables.length} table{s.tables.length > 1 ? 's' : ''}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.nf}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col gap-4"
            >
              {s.tables.map((t) => (
                <div key={t.name}>
                  <div className="mb-1.5 flex items-center gap-2.5">
                    <Pill color={t.color}>{t.name}</Pill>
                    <span className="font-mono text-[12.5px] text-[#86868b]">PK: {t.pk}</span>
                  </div>
                  <DataTable headers={t.headers} rows={t.rows} headColor={t.color} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-black/[0.08] bg-[#fafafa] p-6">
            <p className="text-[15px] leading-relaxed text-[#424245]">{s.blurb}</p>
          </div>

          {/* Redundancy meter */}
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
            <div className="mb-2 flex items-center justify-between text-[14px] font-medium">
              <span className="text-[#6e6e73]">Data redundancy</span>
              <span style={{ color: s.redundancy > 60 ? '#d70015' : s.redundancy > 25 ? '#9a6a00' : '#248a3d' }}>
                {s.redundancy > 60 ? 'High' : s.redundancy > 25 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
              <motion.div
                className="h-full rounded-full"
                animate={{
                  width: `${s.redundancy}%`,
                  backgroundColor: s.redundancy > 60 ? '#ff375f' : s.redundancy > 25 ? '#ff9f0a' : '#30d158',
                }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
          </div>

          {/* Anomaly status */}
          <div
            className="flex items-center gap-3 rounded-2xl border p-5"
            style={{
              background: (s.anomalies ? '#ff375f' : '#30d158') + '0d',
              borderColor: (s.anomalies ? '#ff375f' : '#30d158') + '33',
            }}
          >
            <span className="text-2xl">{s.anomalies ? '⚠️' : '✅'}</span>
            <span className="text-[15px] font-medium" style={{ color: s.anomalies ? '#d70015' : '#248a3d' }}>
              {s.anomalies
                ? 'Update, insert & delete anomalies still possible'
                : 'Anomalies eliminated for this schema'}
            </span>
          </div>

          {/* Nav */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <button
              onClick={() => setStage((i) => Math.max(0, i - 1))}
              disabled={stage === 0}
              className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#0071e3] transition hover:underline disabled:opacity-30 disabled:no-underline"
            >
              ‹ Back
            </button>
            <button
              onClick={() => setStage((i) => Math.min(STAGES.length - 1, i + 1))}
              disabled={stage === STAGES.length - 1}
              className="rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed] disabled:opacity-30"
            >
              {stage === STAGES.length - 1 ? 'Fully normalised' : `Normalise to ${STAGES[stage + 1].nf} ›`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 4 — 1NF Atomic Splitter
// A focused before/after toggle that animates a multi-valued cell into rows.
// ════════════════════════════════════════════════════════════════════════════
function AtomicSplitter() {
  const [atomic, setAtomic] = useState(false);

  const multiRows: TCell[][] = [
    [{ v: '101', k: 'pk' }, { v: 'Laptop, Mouse, Keyboard', k: 'bad' }],
    [{ v: '102', k: 'pk' }, { v: 'Monitor, HDMI Cable', k: 'bad' }],
  ];
  const atomicRows: TCell[][] = [
    [{ v: '101', k: 'pk' }, { v: 'Laptop', k: 'ok' }],
    [{ v: '101', k: 'pk' }, { v: 'Mouse', k: 'ok' }],
    [{ v: '101', k: 'pk' }, { v: 'Keyboard', k: 'ok' }],
    [{ v: '102', k: 'pk' }, { v: 'Monitor', k: 'ok' }],
    [{ v: '102', k: 'pk' }, { v: 'HDMI Cable', k: 'ok' }],
  ];

  return (
    <div className="mx-auto max-w-xl">
      <motion.div layout transition={{ duration: 0.45, ease: EASE }}>
        <DataTable
          headers={['OrderID', atomic ? 'Product' : 'Products']}
          rows={atomic ? atomicRows : multiRows}
          headColor={atomic ? '#30d158' : '#ff375f'}
        />
      </motion.div>
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          onClick={() => setAtomic((a) => !a)}
          className="rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
        >
          {atomic ? '↩︎ Show the bad version' : 'Make every cell atomic ›'}
        </button>
      </div>
      <p className="mt-4 text-center text-[14px] leading-relaxed text-[#86868b]">
        {atomic
          ? 'One product per row. Now you can ask “who ordered a Mouse?” with a simple WHERE clause.'
          : 'Three products crammed into one cell. Counting, filtering or joining on a single product is painful.'}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 5 — Normal Form Detective
// Read a table + its dependencies, decide the highest normal form it satisfies.
// ════════════════════════════════════════════════════════════════════════════
interface Case {
  table: string;
  pk: string;
  fds: string[];
  options: string[];
  answer: string;
  why: string;
}
const CASES: Case[] = [
  {
    table: 'Enrolment(StudentID, CourseID, StudentName, CourseName, Grade)',
    pk: '{StudentID, CourseID}',
    fds: ['StudentID → StudentName', 'CourseID → CourseName', '{StudentID, CourseID} → Grade'],
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: '1NF',
    why: 'StudentName and CourseName each depend on only part of the composite key — partial dependencies. That violates 2NF, so the highest it reaches is 1NF.',
  },
  {
    table: 'Employee(EmpID, EmpName, DeptID, DeptName)',
    pk: 'EmpID',
    fds: ['EmpID → EmpName, DeptID', 'DeptID → DeptName'],
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: '2NF',
    why: 'The key is a single column, so there are no partial dependencies (2NF holds). But EmpID → DeptID → DeptName is transitive, which breaks 3NF.',
  },
  {
    table: 'Advising(Student, Advisor, Department)',
    pk: '{Student, Department}',
    fds: ['{Student, Department} → Advisor', 'Advisor → Department'],
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: '3NF',
    why: 'Department is a prime attribute, so Advisor → Department does not break 3NF. But Advisor is not a superkey, so the table is in 3NF yet not BCNF.',
  },
  {
    table: 'Departments(DeptID, DeptName, DeptHead)',
    pk: 'DeptID',
    fds: ['DeptID → DeptName, DeptHead'],
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: 'BCNF',
    why: 'Single-column key, no partial or transitive dependencies, and the only determinant (DeptID) is a superkey. It satisfies every normal form up to BCNF.',
  },
];

function NFDetective() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const c = CASES[idx];

  const choose = (opt: string) => {
    if (picked !== null) return;
    setPicked(opt);
    if (opt === c.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (idx + 1 >= CASES.length) return setDone(true);
    setIdx((i) => i + 1);
    setPicked(null);
  };
  const reset = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.08] bg-white p-10 text-center shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)]">
        <div className="text-6xl">{score === CASES.length ? '🕵️' : score >= 2 ? '🎯' : '📚'}</div>
        <p className="mt-4 text-[44px] font-semibold tracking-tight text-[#1d1d1f]">
          {score} / {CASES.length}
        </p>
        <p className="mx-auto mt-2 max-w-md text-[17px] text-[#6e6e73]">
          {score === CASES.length
            ? 'Flawless detective work — you can read a schema and call its normal form on sight.'
            : 'Good progress. Revisit the studio above, then try the cases again.'}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.08] bg-white p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)] sm:p-10">
      <div className="mb-2 flex justify-between text-[14px] font-medium text-[#86868b]">
        <span>
          Case {idx + 1} of {CASES.length}
        </span>
        <span>Score {score}</span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
        <motion.div
          className="h-full rounded-full bg-[#0071e3]"
          animate={{ width: `${(idx / CASES.length) * 100}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>

      <p className="mb-1 text-[13px] font-semibold uppercase tracking-wide text-[#0071e3]">The schema</p>
      <p className="font-mono text-[15px] leading-relaxed text-[#1d1d1f]">{c.table}</p>
      <p className="mt-1 font-mono text-[13px] text-[#86868b]">PK = {c.pk}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {c.fds.map((f) => (
          <Dep key={f}>{f}</Dep>
        ))}
      </div>

      <p className="mb-3 mt-7 text-[18px] font-semibold tracking-tight text-[#1d1d1f]">
        What is the <em>highest</em> normal form this table satisfies?
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {c.options.map((opt) => {
          const answered = picked !== null;
          const correct = opt === c.answer;
          const chosen = opt === picked;
          let cls = 'rounded-2xl py-3 text-[16px] font-semibold transition ';
          if (!answered) cls += 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececee]';
          else if (correct) cls += 'bg-[#30d158]/15 text-[#248a3d] ring-1 ring-[#30d158]/40';
          else if (chosen) cls += 'bg-[#ff375f]/12 text-[#d70015] ring-1 ring-[#ff375f]/40';
          else cls += 'bg-[#f5f5f7] text-[#aeaeb2]';
          return (
            <button key={opt} onClick={() => choose(opt)} className={cls}>
              {opt}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {picked !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl bg-[#f5f5f7] p-5"
          >
            <p className={`font-semibold ${picked === c.answer ? 'text-[#248a3d]' : 'text-[#d70015]'}`}>
              {picked === c.answer ? 'Correct' : `Not quite — it’s ${c.answer}`}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[#424245]">{c.why}</p>
            <button
              onClick={next}
              className="mt-4 rounded-full bg-[#0071e3] px-5 py-2 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
            >
              {idx + 1 < CASES.length ? 'Next case' : 'See results'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 6 — Closing true/false quiz
// ════════════════════════════════════════════════════════════════════════════
const QUIZ = [
  { q: 'A table in 1NF can still have plenty of redundant data.', a: true, e: '1NF only requires atomic cells — repetition of student or department facts can remain.' },
  { q: '2NF is only a concern when the primary key is composite.', a: true, e: 'Partial dependencies need part of a key to depend on. With a single-column key there is no “part”, so 2NF is automatic.' },
  { q: 'A transitive dependency is what 3NF removes.', a: true, e: '3NF eliminates non-prime attributes that depend on the key only through another non-prime attribute.' },
  { q: 'Every table in BCNF is automatically also in 3NF.', a: true, e: 'BCNF is strictly stronger — satisfying it guarantees 3NF, but not the other way round.' },
  { q: 'BCNF decomposition always preserves all functional dependencies.', a: false, e: 'BCNF guarantees a lossless join but can lose dependency preservation — a real trade-off against 3NF.' },
];

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (opt: boolean) => {
    if (answer !== null) return;
    setAnswer(opt);
    if (opt === QUIZ[idx].a) setScore((s) => s + 1);
  };
  const next = () => {
    if (idx + 1 >= QUIZ.length) return setDone(true);
    setIdx((i) => i + 1);
    setAnswer(null);
  };
  const reset = () => {
    setIdx(0);
    setAnswer(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.08] bg-white p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)] sm:p-10">
      {!done ? (
        <>
          <div className="mb-2 flex justify-between text-[14px] font-medium text-[#86868b]">
            <span>
              Question {idx + 1} of {QUIZ.length}
            </span>
            <span>Score {score}</span>
          </div>
          <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[#0071e3]"
              animate={{ width: `${(idx / QUIZ.length) * 100}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
          <p className="mb-8 text-[24px] font-semibold leading-snug tracking-tight text-[#1d1d1f]">{QUIZ[idx].q}</p>
          <div className="flex gap-4">
            {[true, false].map((opt) => {
              const answered = answer !== null;
              const correct = opt === QUIZ[idx].a;
              const chosen = opt === answer;
              let cls = 'flex-1 rounded-2xl py-4 text-[17px] font-medium transition ';
              if (!answered) cls += 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececee]';
              else if (correct) cls += 'bg-[#30d158]/15 text-[#248a3d] ring-1 ring-[#30d158]/40';
              else if (chosen) cls += 'bg-[#ff375f]/12 text-[#d70015] ring-1 ring-[#ff375f]/40';
              else cls += 'bg-[#f5f5f7] text-[#aeaeb2]';
              return (
                <button key={String(opt)} onClick={() => choose(opt)} className={cls}>
                  {opt ? 'True' : 'False'}
                </button>
              );
            })}
          </div>
          {answer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl bg-[#f5f5f7] p-5"
            >
              <p className={`font-semibold ${answer === QUIZ[idx].a ? 'text-[#248a3d]' : 'text-[#d70015]'}`}>
                {answer === QUIZ[idx].a ? 'Correct' : 'Not quite'}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[#424245]">{QUIZ[idx].e}</p>
              <button
                onClick={next}
                className="mt-4 rounded-full bg-[#0071e3] px-5 py-2 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
              >
                {idx + 1 < QUIZ.length ? 'Next question' : 'See results'}
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <div className="py-6 text-center">
          <div className="text-6xl">{score >= 4 ? '🏆' : score >= 3 ? '🎯' : '📚'}</div>
          <p className="mt-4 text-[44px] font-semibold tracking-tight text-[#1d1d1f]">
            {score} / {QUIZ.length}
          </p>
          <p className="mx-auto mt-2 max-w-md text-[17px] text-[#6e6e73]">
            {score === QUIZ.length
              ? 'Perfect — the normal forms and their trade-offs have clearly clicked.'
              : score >= 3
              ? 'Nice work. Scroll back to the studio to firm up the last details.'
              : 'Good start. Replay the simulations above, then come back for another go.'}
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Concept cards data ─────────────────────────────────────────────────────
const NF_SUMMARY = [
  { nf: '1NF', color: '#ff375f', rule: 'Every cell is atomic, no repeating groups, a primary key exists.', fix: 'One value per cell; give multiple values their own rows.' },
  { nf: '2NF', color: '#ff9f0a', rule: 'In 1NF and no non-key attribute depends on only part of a composite key.', fix: 'Split partial dependencies into their own table.' },
  { nf: '3NF', color: '#0071e3', rule: 'In 2NF and no non-key attribute depends on the key through another non-key attribute.', fix: 'Extract the transitive chain (A → B → C) into a new table.' },
  { nf: 'BCNF', color: '#30d158', rule: 'For every dependency X → Y, X is a superkey. Stricter than 3NF.', fix: 'Decompose so every determinant is a key — may cost dependency preservation.' },
];

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 7 — 1NF Real-World: Music Streaming Playlists
// A Spotify-style table where one cell holds multiple track IDs.
// Students watch each multi-value cell "explode" into individual atomic rows.
// ════════════════════════════════════════════════════════════════════════════
const PLAYLIST_BEFORE = [
  { id: 'PL01', name: 'Morning Vibes', tracks: ['T01 · Blinding Lights', 'T02 · Levitating', 'T03 · Stay'] },
  { id: 'PL02', name: 'Workout Mix', tracks: ['T04 · POWER', 'T05 · Lose Yourself'] },
  { id: 'PL03', name: 'Study Mode', tracks: ['T06 · Lo-fi Beat #1', 'T07 · Rain Sounds', 'T08 · Focus Flow'] },
];

function OneNFSimulator() {
  const [step, setStep] = useState(0);

  const afterRows = PLAYLIST_BEFORE.flatMap((p) =>
    p.tracks.map((t) => {
      const sep = t.indexOf(' · ');
      return { pid: p.id, name: p.name, tid: t.slice(0, sep), tname: t.slice(sep + 3) };
    })
  );

  const steps = ['Messy table', 'Spot the problem', 'Apply 1NF'];
  const colors = ['#ff375f', '#ff9f0a', '#30d158'];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex overflow-hidden rounded-2xl border border-black/[0.08]">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className={`flex-1 px-3 py-3 text-[14px] font-semibold transition ${i > 0 ? 'border-l border-black/[0.08]' : ''}`}
            style={
              step === i
                ? { background: colors[i], color: '#fff' }
                : step > i
                ? { background: colors[i] + '1a', color: colors[i] }
                : { background: '#fff', color: '#86868b' }
            }
          >
            {i + 1}. {s}
            {step > i ? ' ✓' : ''}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
            <DataTable
              headers={['playlist_id', 'playlist_name', 'tracks']}
              rows={PLAYLIST_BEFORE.map((p) => [
                { v: p.id, k: 'pk' as const },
                { v: p.name },
                { v: p.tracks.join(', '), k: 'bad' as const },
              ])}
              headColor="#ff375f"
            />
            <p className="mt-4 text-center text-[14px] text-[#86868b]">
              A music-streaming playlist table. The <em>tracks</em> column hides a comma-separated list — already violating 1NF.
            </p>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }} className="space-y-3">
            {PLAYLIST_BEFORE.map((p) => (
              <div key={p.id} className="rounded-2xl border border-[#ff375f]/30 bg-[#ff375f]/[0.04] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[13px] font-semibold text-[#0071e3]">{p.id}</span>
                  <span className="text-[14px] font-medium text-[#1d1d1f]">{p.name}</span>
                  <span className="ml-auto rounded-full bg-[#ff375f]/10 px-2 py-0.5 text-[12px] font-semibold text-[#d70015]">
                    {p.tracks.length} values in 1 cell!
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.tracks.map((t, ti) => (
                    <motion.span
                      key={t}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: ti * 0.08, duration: 0.3, ease: EASE }}
                      className="rounded-lg bg-[#ff375f]/[0.12] px-3 py-1 font-mono text-[13px] text-[#d70015]"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-center text-[14px] text-[#86868b]">
              You can't query "which playlists contain T02?" with a simple WHERE clause — you'd need a LIKE '%T02%' hack.
            </p>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
            <DataTable
              headers={['playlist_id', 'playlist_name', 'track_id', 'track_name']}
              rows={afterRows.map((r) => [
                { v: r.pid, k: 'pk' as const },
                { v: r.name },
                { v: r.tid, k: 'pk' as const },
                { v: r.tname, k: 'ok' as const },
              ])}
              headColor="#30d158"
            />
            <p className="mt-4 text-center text-[14px] text-[#86868b]">
              3 rows became {afterRows.length}. Every cell is atomic.{' '}
              <code className="rounded bg-[#f5f5f7] px-1.5 py-0.5 text-[12px]">WHERE track_id = 'T02'</code> now works perfectly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex justify-center gap-3">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#0071e3] hover:underline">
            ‹ Back
          </button>
        )}
        {step < 2 && (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="rounded-full px-6 py-2.5 text-[15px] font-medium text-white transition hover:opacity-90"
            style={{ background: colors[step + 1] }}
          >
            {step === 0 ? 'Spot the problem ›' : 'Apply 1NF ›'}
          </button>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 8 — 2NF Real-World: E-commerce order_items table
// Composite PK {order_id, product_id}. Partial dependencies highlighted,
// then decomposed into orders + products + order_items.
// ════════════════════════════════════════════════════════════════════════════
const ORDER_ITEMS_BASE: TCell[][] = [
  [{ v: 'ORD-1', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 3 }, { v: 'Alice' }, { v: 'Wireless Mouse' }, { v: '$29.99' }],
  [{ v: 'ORD-1', k: 'pk' }, { v: 'P-102', k: 'pk' }, { v: 1 }, { v: 'Alice' }, { v: 'USB Hub' }, { v: '$19.99' }],
  [{ v: 'ORD-2', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 2 }, { v: 'Bob' }, { v: 'Wireless Mouse' }, { v: '$29.99' }],
  [{ v: 'ORD-3', k: 'pk' }, { v: 'P-103', k: 'pk' }, { v: 1 }, { v: 'Carol' }, { v: 'Laptop Stand' }, { v: '$49.99' }],
];
const ORDER_ITEMS_HIGHLIGHT: TCell[][] = [
  [{ v: 'ORD-1', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 3 }, { v: 'Alice', k: 'bad' }, { v: 'Wireless Mouse', k: 'bad' }, { v: '$29.99', k: 'bad' }],
  [{ v: 'ORD-1', k: 'pk' }, { v: 'P-102', k: 'pk' }, { v: 1 }, { v: 'Alice', k: 'bad' }, { v: 'USB Hub', k: 'bad' }, { v: '$19.99', k: 'bad' }],
  [{ v: 'ORD-2', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 2 }, { v: 'Bob', k: 'bad' }, { v: 'Wireless Mouse', k: 'bad' }, { v: '$29.99', k: 'bad' }],
  [{ v: 'ORD-3', k: 'pk' }, { v: 'P-103', k: 'pk' }, { v: 1 }, { v: 'Carol', k: 'bad' }, { v: 'Laptop Stand', k: 'bad' }, { v: '$49.99', k: 'bad' }],
];

function TwoNFSimulator() {
  const [phase, setPhase] = useState(0);
  const phases = ['See the table', 'Find partial deps', 'Apply 2NF'];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex overflow-hidden rounded-2xl border border-black/[0.08]">
        {phases.map((s, i) => (
          <button
            key={s}
            onClick={() => setPhase(i)}
            className={`flex-1 px-3 py-3 text-[14px] font-semibold transition ${i > 0 ? 'border-l border-black/[0.08]' : ''}`}
            style={
              phase === i
                ? { background: i < 2 ? '#ff9f0a' : '#30d158', color: '#fff' }
                : phase > i
                ? { background: (i < 2 ? '#ff9f0a' : '#30d158') + '1a', color: i < 2 ? '#ff9f0a' : '#30d158' }
                : { background: '#fff', color: '#86868b' }
            }
          >
            {i + 1}. {s}
            {phase > i ? ' ✓' : ''}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key={`ph${phase}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
            <DataTable
              headers={['order_id', 'product_id', 'qty', 'customer_name', 'product_name', 'unit_price']}
              rows={phase === 1 ? ORDER_ITEMS_HIGHLIGHT : ORDER_ITEMS_BASE}
              headColor={phase === 0 ? '#86868b' : '#ff9f0a'}
            />
            {phase === 1 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4, ease: EASE }} className="mt-4 space-y-2">
                <div className="rounded-xl border border-[#ff9f0a]/40 bg-[#ff9f0a]/[0.06] p-4">
                  <p className="font-mono text-[14px] text-[#9a6a00]">order_id → customer_name</p>
                  <p className="mt-1 text-[13px] text-[#6e6e73]">
                    customer_name depends on only <strong>order_id</strong>, not the full composite key — partial dependency. Alice appears twice because she placed two line items.
                  </p>
                </div>
                <div className="rounded-xl border border-[#ff9f0a]/40 bg-[#ff9f0a]/[0.06] p-4">
                  <p className="font-mono text-[14px] text-[#9a6a00]">product_id → product_name, unit_price</p>
                  <p className="mt-1 text-[13px] text-[#6e6e73]">
                    product_name and unit_price depend on only <strong>product_id</strong> — another partial dependency. "Wireless Mouse" at $29.99 is stored in two separate rows.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="split" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }} className="space-y-5">
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill color="#0071e3">orders</Pill>
                <span className="font-mono text-[12.5px] text-[#86868b]">PK: order_id</span>
              </div>
              <DataTable
                headers={['order_id', 'customer_name']}
                rows={[
                  [{ v: 'ORD-1', k: 'pk' }, { v: 'Alice', k: 'ok' }],
                  [{ v: 'ORD-2', k: 'pk' }, { v: 'Bob', k: 'ok' }],
                  [{ v: 'ORD-3', k: 'pk' }, { v: 'Carol', k: 'ok' }],
                ]}
                headColor="#0071e3"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill color="#30d158">products</Pill>
                <span className="font-mono text-[12.5px] text-[#86868b]">PK: product_id</span>
              </div>
              <DataTable
                headers={['product_id', 'product_name', 'unit_price']}
                rows={[
                  [{ v: 'P-101', k: 'pk' }, { v: 'Wireless Mouse', k: 'ok' }, { v: '$29.99', k: 'ok' }],
                  [{ v: 'P-102', k: 'pk' }, { v: 'USB Hub', k: 'ok' }, { v: '$19.99', k: 'ok' }],
                  [{ v: 'P-103', k: 'pk' }, { v: 'Laptop Stand', k: 'ok' }, { v: '$49.99', k: 'ok' }],
                ]}
                headColor="#30d158"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill color="#5e5ce6">order_items</Pill>
                <span className="font-mono text-[12.5px] text-[#86868b]">PK: {'{order_id, product_id}'}</span>
              </div>
              <DataTable
                headers={['order_id', 'product_id', 'qty']}
                rows={[
                  [{ v: 'ORD-1', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 3, k: 'ok' }],
                  [{ v: 'ORD-1', k: 'pk' }, { v: 'P-102', k: 'pk' }, { v: 1, k: 'ok' }],
                  [{ v: 'ORD-2', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 2, k: 'ok' }],
                  [{ v: 'ORD-3', k: 'pk' }, { v: 'P-103', k: 'pk' }, { v: 1, k: 'ok' }],
                ]}
                headColor="#5e5ce6"
              />
            </div>
            <p className="text-center text-[14px] text-[#86868b]">
              No redundancy. "Wireless Mouse" is stored once — changing its price means updating{' '}
              <strong>one row</strong> in{' '}
              <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">products</code>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex justify-center gap-3">
        {phase > 0 && (
          <button onClick={() => setPhase((p) => p - 1)} className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#0071e3] hover:underline">
            ‹ Back
          </button>
        )}
        {phase < 2 && (
          <button
            onClick={() => setPhase((p) => p + 1)}
            className="rounded-full px-6 py-2.5 text-[15px] font-medium text-white transition hover:opacity-90"
            style={{ background: '#ff9f0a' }}
          >
            {phase === 0 ? 'Find partial deps ›' : 'Apply 2NF ›'}
          </button>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 9 — 3NF Real-World: HR employee records
// Transitive chain emp_id → dept_id → dept_name, dept_city animated,
// then decomposed into employees + departments tables.
// ════════════════════════════════════════════════════════════════════════════
const CHAIN_NODES = [
  { label: 'emp_id', sub: '(PK)', color: '#0071e3', hasArrow: false },
  { label: 'dept_id', sub: '(non-key)', color: '#ff9f0a', hasArrow: true },
  { label: 'dept_name\ndept_city', sub: '(non-key)', color: '#ff375f', hasArrow: true },
];

function ThreeNFSimulator() {
  const [phase, setPhase] = useState(0);
  const phases = ['The table', 'Trace the chain', 'Apply 3NF'];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex overflow-hidden rounded-2xl border border-black/[0.08]">
        {phases.map((s, i) => (
          <button
            key={s}
            onClick={() => setPhase(i)}
            className={`flex-1 px-3 py-3 text-[14px] font-semibold transition ${i > 0 ? 'border-l border-black/[0.08]' : ''}`}
            style={
              phase === i
                ? { background: i < 2 ? '#0071e3' : '#30d158', color: '#fff' }
                : phase > i
                ? { background: (i < 2 ? '#0071e3' : '#30d158') + '1a', color: i < 2 ? '#0071e3' : '#30d158' }
                : { background: '#fff', color: '#86868b' }
            }
          >
            {i + 1}. {s}
            {phase > i ? ' ✓' : ''}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div key="p0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
            <DataTable
              headers={['emp_id', 'emp_name', 'dept_id', 'dept_name', 'dept_city']}
              rows={[
                [{ v: 'E-01', k: 'pk' }, { v: 'Alice' }, { v: 'D-10' }, { v: 'Engineering' }, { v: 'Auckland' }],
                [{ v: 'E-02', k: 'pk' }, { v: 'Bob' }, { v: 'D-10' }, { v: 'Engineering' }, { v: 'Auckland' }],
                [{ v: 'E-03', k: 'pk' }, { v: 'Carol' }, { v: 'D-20' }, { v: 'Marketing' }, { v: 'Wellington' }],
                [{ v: 'E-04', k: 'pk' }, { v: 'Dave' }, { v: 'D-10' }, { v: 'Engineering' }, { v: 'Auckland' }],
              ]}
              headColor="#86868b"
            />
            <p className="mt-4 text-center text-[14px] text-[#86868b]">
              HR table for a NZ company. The Engineering team in Auckland appears three times — why is that a problem?
            </p>
          </motion.div>
        )}
        {phase === 1 && (
          <motion.div key="p1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className="mb-6 flex items-center justify-center overflow-x-auto py-4">
              {CHAIN_NODES.map((node, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.18, duration: 0.4, ease: EASE }}
                  className="flex items-center"
                >
                  {node.hasArrow && (
                    <span className="mx-3 text-2xl font-light text-[#aeaeb2]">→</span>
                  )}
                  <div
                    className="rounded-2xl border p-4 text-center"
                    style={{ borderColor: node.color + '40', background: node.color + '0d' }}
                  >
                    <p className="whitespace-pre-line font-mono text-[14px] font-semibold" style={{ color: node.color }}>
                      {node.label}
                    </p>
                    <p className="mt-0.5 text-[11px]" style={{ color: node.color + 'aa' }}>
                      {node.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <DataTable
              headers={['emp_id', 'emp_name', 'dept_id', 'dept_name', 'dept_city']}
              rows={[
                [{ v: 'E-01', k: 'pk' }, { v: 'Alice' }, { v: 'D-10', k: 'fk' }, { v: 'Engineering', k: 'bad' }, { v: 'Auckland', k: 'bad' }],
                [{ v: 'E-02', k: 'pk' }, { v: 'Bob' }, { v: 'D-10', k: 'fk' }, { v: 'Engineering', k: 'bad' }, { v: 'Auckland', k: 'bad' }],
                [{ v: 'E-03', k: 'pk' }, { v: 'Carol' }, { v: 'D-20', k: 'fk' }, { v: 'Marketing', k: 'bad' }, { v: 'Wellington', k: 'bad' }],
                [{ v: 'E-04', k: 'pk' }, { v: 'Dave' }, { v: 'D-10', k: 'fk' }, { v: 'Engineering', k: 'bad' }, { v: 'Auckland', k: 'bad' }],
              ]}
              headColor="#ff375f"
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
              className="mt-4 rounded-2xl border border-[#0071e3]/25 bg-[#0071e3]/[0.05] p-4"
            >
              <p className="text-[14px] leading-relaxed text-[#424245]">
                <strong className="text-[#1d1d1f]">The transitive chain:</strong> emp_id → dept_id → dept_name, dept_city. The highlighted columns only reach emp_id <em>through</em> the non-key dept_id — a transitive dependency violating 3NF.
              </p>
            </motion.div>
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div key="p2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }} className="space-y-5">
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill color="#0071e3">employees</Pill>
                <span className="font-mono text-[12.5px] text-[#86868b]">PK: emp_id</span>
              </div>
              <DataTable
                headers={['emp_id', 'emp_name', 'dept_id']}
                rows={[
                  [{ v: 'E-01', k: 'pk' }, { v: 'Alice' }, { v: 'D-10', k: 'fk' }],
                  [{ v: 'E-02', k: 'pk' }, { v: 'Bob' }, { v: 'D-10', k: 'fk' }],
                  [{ v: 'E-03', k: 'pk' }, { v: 'Carol' }, { v: 'D-20', k: 'fk' }],
                  [{ v: 'E-04', k: 'pk' }, { v: 'Dave' }, { v: 'D-10', k: 'fk' }],
                ]}
                headColor="#0071e3"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill color="#30d158">departments</Pill>
                <span className="font-mono text-[12.5px] text-[#86868b]">PK: dept_id</span>
              </div>
              <DataTable
                headers={['dept_id', 'dept_name', 'dept_city']}
                rows={[
                  [{ v: 'D-10', k: 'pk' }, { v: 'Engineering', k: 'ok' }, { v: 'Auckland', k: 'ok' }],
                  [{ v: 'D-20', k: 'pk' }, { v: 'Marketing', k: 'ok' }, { v: 'Wellington', k: 'ok' }],
                ]}
                headColor="#30d158"
              />
            </div>
            <p className="text-center text-[14px] text-[#86868b]">
              dept_name and dept_city now live in{' '}
              <code className="rounded bg-[#f5f5f7] px-1 text-[12px]">departments</code> exactly once. Moving the Auckland office to Hamilton? Update <strong>one row</strong>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex justify-center gap-3">
        {phase > 0 && (
          <button onClick={() => setPhase((p) => p - 1)} className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#0071e3] hover:underline">
            ‹ Back
          </button>
        )}
        {phase < 2 && (
          <button
            onClick={() => setPhase((p) => p + 1)}
            className="rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
          >
            {phase === 0 ? 'Trace the chain ›' : 'Apply 3NF ›'}
          </button>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// INTERACTIVE — The "is my table in this form?" checklist
// A friendly tabbed checklist so students can self-check the characteristics of
// 1NF, 2NF and 3NF. Tap a tab, read the boxes, tick them off in your head.
// ════════════════════════════════════════════════════════════════════════════
const CHECKLISTS = [
  {
    nf: '1NF',
    color: '#5e5ce6',
    tagline: 'Tidy up the cells',
    plain: 'One value per cell. Nothing crammed together.',
    items: [
      'Every cell holds a single value — no lists like “Maths, Science” stuffed into one box.',
      'No repeating columns like Phone1, Phone2, Phone3 to hold “more of the same thing”.',
      'Each row can be told apart from the rest (there is a key).',
    ],
    example: 'Split a cell that says “Maths, Science” into two separate rows — one per subject.',
  },
  {
    nf: '2NF',
    color: '#ff9f0a',
    tagline: 'Use the whole key',
    plain: 'Every column should need the full key — not just half of it.',
    items: [
      'It is already in 1NF.',
      'Every non-key column depends on the whole key, not just part of it.',
      'Heads-up: if your key is a single column, you get 2NF for free — there is no “part” of the key to worry about.',
    ],
    example: 'In a table keyed by {OrderID, ProductID}, move ProductName into its own Products table — it only needs ProductID.',
  },
  {
    nf: '3NF',
    color: '#0071e3',
    tagline: 'No middlemen',
    plain: 'Every column should point straight at the key — no hopping through another column.',
    items: [
      'It is already in 2NF.',
      'No ordinary (non-key) column depends on another ordinary column.',
      'In other words: nothing sneaks to the key through a “middleman” column.',
    ],
    example: 'If DeptName rides along on DeptID, pull departments out into their own table and keep only DeptID here.',
  },
];

function NFChecklist() {
  const [active, setActive] = useState(0);
  const c = CHECKLISTS[active];
  return (
    <div className="mx-auto max-w-3xl">
      {/* Tabs */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {CHECKLISTS.map((cl, i) => (
          <button
            key={cl.nf}
            onClick={() => setActive(i)}
            className="rounded-full px-5 py-2.5 font-mono text-[15px] font-semibold transition sm:px-7"
            style={
              active === i
                ? { background: cl.color, color: '#fff' }
                : { background: cl.color + '14', color: cl.color }
            }
          >
            {cl.nf}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={c.nf}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-8 rounded-[28px] border bg-white p-8 sm:p-10"
          style={{ borderColor: c.color + '33' }}
        >
          <p className="text-[14px] font-semibold uppercase tracking-wide" style={{ color: c.color }}>
            {c.tagline}
          </p>
          <p className="mt-1 text-[20px] font-semibold leading-snug text-[#1d1d1f] sm:text-[22px]">
            {c.plain}
          </p>

          <ul className="mt-6 space-y-3">
            {c.items.map((it, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: EASE }}
                className="flex items-start gap-3"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
                  style={{ background: c.color }}
                >
                  ✓
                </span>
                <span className="text-[16px] leading-relaxed text-[#424245]">{it}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-7 rounded-2xl p-5" style={{ background: c.color + '0d' }}>
            <p className="text-[14px] font-semibold" style={{ color: c.color }}>
              Quick example
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[#6e6e73]">{c.example}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-6 text-center text-[14px] text-[#86868b]">
        Tick all the boxes on a tab? Your table is in that form. Each form builds on the one before it.
      </p>
    </div>
  );
}

// Smooth-scroll without touching the URL hash (the app runs under HashRouter).
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function NormalizationExplorerPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div className="bg-white text-[#1d1d1f]" style={{ fontFamily: APPLE_FONT }}>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute left-6 top-6 z-20 sm:left-10 sm:top-8">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={28} variant="on-light" />
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#0071e3]/[0.07] blur-3xl" />
          <div className="absolute bottom-[-10%] right-[12%] h-[420px] w-[420px] rounded-full bg-[#5e5ce6]/[0.06] blur-3xl" />
        </div>

        <motion.div style={{ scale: heroScale, opacity: heroOpacity, y: heroY }} className="relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[17px] font-medium text-[#6e6e73]"
          >
            An interactive lesson · Dr. Yasas Sri Wickramasinghe
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="text-[44px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[72px] lg:text-[88px]"
          >
            Let’s make sense of
            <br />
            <span className="bg-gradient-to-r from-[#0071e3] via-[#5e5ce6] to-[#bf5af2] bg-clip-text text-transparent">
              Database Normalisation.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-[19px] leading-relaxed text-[#6e6e73] sm:text-[22px]"
          >
            We’ll start with the messes that bad table design creates, then climb the ladder — 1NF, 2NF, 3NF and
            BCNF — one rung at a time. Along the way you can play with live simulations: trigger the anomalies,
            split tables apart, and test yourself. No headset, no sign-in, nothing collected.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
          >
            <button
              onClick={() => scrollToSection('studio')}
              className="rounded-full bg-[#0071e3] px-7 py-3 text-[17px] font-medium text-white transition hover:bg-[#0077ed]"
            >
              Open the Normalisation Studio
            </button>
            <button
              onClick={() => scrollToSection('anomalies')}
              className="text-[17px] font-medium text-[#0071e3] hover:underline"
            >
              Start with the problem ›
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 text-[13px] font-medium text-[#aeaeb2]"
        >
          Scroll to explore
        </motion.div>
      </section>

      {/* ── WHY / ANOMALIES ───────────────────────────────────────────────── */}
      <section id="anomalies" className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Start here"
            title="What goes wrong without normalisation?"
            sub="When one table tries to store everything at once, the same fact gets written in many places. That redundancy quietly breeds three classic anomalies. Poke the table below to feel each one."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <AnomalyPlayground />
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
        >
          {[
            { e: '✏️', t: 'Update anomaly', c: '#ff375f', d: 'A repeated fact is changed in some rows but not others, so the database ends up contradicting itself.' },
            { e: '➕', t: 'Insertion anomaly', c: '#ff9f0a', d: 'You can’t record one fact without inventing another — a department needs a student before it can exist.' },
            { e: '🗑️', t: 'Deletion anomaly', c: '#0071e3', d: 'Removing one row quietly destroys unrelated information that happened to live in the same place.' },
          ].map((p) => (
            <motion.div
              key={p.t}
              variants={item}
              className="rounded-[28px] border border-black/[0.07] bg-[#fafafa] p-8 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.18)]"
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

      {/* ── FUNCTIONAL DEPENDENCIES ───────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="The core idea"
            title="Functional dependencies"
            sub="Normalisation is really about one question: which columns determine which? We write X → Y to mean “if you know X, you know exactly one Y.” Getting these right is the whole game."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="inline-block rounded-2xl bg-white px-8 py-5 font-mono text-[28px] font-semibold text-[#0071e3] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] sm:text-[36px]">
              X → Y
            </span>
            <p className="mt-4 text-[15px] text-[#86868b]">
              X is the <strong className="text-[#1d1d1f]">determinant</strong> · Y is the{' '}
              <strong className="text-[#1d1d1f]">dependent</strong>
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <FDExplorer />
        </Reveal>
      </section>

      {/* ── THE STUDIO ─────────────────────────────────────────────────────── */}
      <section id="studio" className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Interactive · the main event"
            title="The Normalisation Studio"
            sub="Here is one messy table. Step it up the ladder and watch tables split apart, redundancy drain away and the anomalies disappear — the whole journey from un-normalised to BCNF in one place."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <NormalizationStudio />
        </Reveal>
      </section>

      {/* ── 1NF DEEP DIVE ──────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="First Normal Form · 1NF"
            title="Break apart the lists"
            sub="1NF asks for one thing: every cell holds a single, atomic value — no comma-separated lists, no repeating groups. Flip the table below and watch a multi-valued column become tidy rows."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <AtomicSplitter />
        </Reveal>
      </section>

      {/* ── 1NF REAL-WORLD SIMULATOR ─────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="1NF · Real-world walkthrough"
            title="Fixing a music streaming playlist table"
            sub="This is the kind of table a junior dev might design for a Spotify-style app. Walk through three steps to see exactly what 1NF demands — and what gets unlocked when every cell is atomic."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <OneNFSimulator />
        </Reveal>
      </section>

      {/* ── 2NF & 3NF in plain words ────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Climbing higher"
            title="2NF and 3NF, in really plain words"
            sub="1NF was about tidying up the cells. 2NF and 3NF are about one thing only: making sure each column is sitting in the right table. Let’s take them one at a time — slowly."
          />
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-6">
          {/* 2NF */}
          <Reveal delay={0.05}>
            <div className="rounded-[28px] border border-[#ff9f0a]/30 bg-[#fffaf2] p-8 sm:p-10">
              <Pill color="#ff9f0a">2NF · use the whole key</Pill>
              <p className="mt-5 text-[18px] font-semibold leading-snug text-[#1d1d1f] sm:text-[20px]">
                Does each column need the <em>whole</em> key, or just half of it?
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#424245]">
                2NF only matters when your table’s key is made of two columns stuck together (a
                “composite” key). Picture an order table where the key is{' '}
                <span className="font-mono text-[#9a6a00]">{'{OrderID, ProductID}'}</span>. Now look at{' '}
                <strong>ProductName</strong>. Does it care which order it was on? Nope — it only depends on{' '}
                <strong>ProductID</strong>. So you’d be repeating “iPhone 15” on every single order that
                includes it.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#424245]">
                The fix: move ProductName into its own little Products table, where ProductID alone is the key.
              </p>
              <p className="mt-5 rounded-2xl bg-[#ff9f0a]/[0.1] px-5 py-4 text-[15px] font-medium leading-relaxed text-[#9a6a00]">
                In one line: if a column only needs <em>part</em> of the key, it’s sitting in the wrong table.
              </p>
            </div>
          </Reveal>

          {/* 3NF */}
          <Reveal delay={0.1}>
            <div className="rounded-[28px] border border-[#0071e3]/25 bg-[#f4f9ff] p-8 sm:p-10">
              <Pill color="#0071e3">3NF · no middlemen</Pill>
              <p className="mt-5 text-[18px] font-semibold leading-snug text-[#1d1d1f] sm:text-[20px]">
                Does each column point straight at the key — or sneak in through another column?
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#424245]">
                Once 2NF is sorted, 3NF asks the next question. Take an employee table. Each{' '}
                <strong>Employee</strong> has a <strong>DeptID</strong>, and that DeptID tells you the{' '}
                <strong>DeptName</strong> and <strong>DeptPhone</strong>. So DeptName doesn’t really depend on
                the employee — it depends on the <em>department</em>, which depends on the employee. That extra
                hop is a “middleman”:
              </p>
              <p className="mt-4 text-center">
                <span className="inline-block rounded-lg bg-[#0071e3]/[0.08] px-3 py-1.5 font-mono text-[14px] font-medium text-[#0071e3]">
                  Employee → DeptID → DeptName
                </span>
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#424245]">
                The fix: give departments their own table, and let the employee row just keep the DeptID.
              </p>
              <p className="mt-5 rounded-2xl bg-[#0071e3]/[0.08] px-5 py-4 text-[15px] font-medium leading-relaxed text-[#0066cc]">
                In one line: every column should point straight at the key — no hopping through another column.
              </p>
            </div>
          </Reveal>

          {/* BCNF — optional */}
          <Reveal delay={0.15}>
            <div className="rounded-[28px] border border-black/[0.08] bg-[#fafafa] p-8 sm:p-10">
              <Pill color="#30d158">BCNF · optional extra</Pill>
              <p className="mt-5 text-[18px] font-semibold leading-snug text-[#1d1d1f] sm:text-[20px]">
                Nice to have — but you usually don’t need it.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#424245]">
                Here’s the honest truth: most real databases stop at 3NF and are completely fine. BCNF is just a
                stricter, extra-tidy version of 3NF that handles a few rare edge cases. Think of it as a polish,
                not a box you <em>have</em> to tick. If your table is solidly in 3NF, you’re already in great
                shape — so feel free to treat this one as bonus reading.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE CHECKLIST ──────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Self-check"
            title="Is my table in this form?"
            sub="A quick checklist for the three forms that matter. Tap a tab and run down the boxes — if they all hold true, your table has reached that form."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <NFChecklist />
        </Reveal>
      </section>

      {/* ── 2NF REAL-WORLD SIMULATOR ─────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="2NF · Real-world walkthrough"
            title="Fixing an e-commerce order table"
            sub="This is the table a new developer builds on day one. It looks sensible — until you trace the partial dependencies and see the update anomalies hiding inside."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <TwoNFSimulator />
        </Reveal>
      </section>

      {/* ── 3NF REAL-WORLD SIMULATOR ─────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="3NF · Real-world walkthrough"
            title="Fixing an HR employee records table"
            sub="Employee info that carries along department details creates transitive chains. Watch the chain animate, then see exactly which table gets extracted and why."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <ThreeNFSimulator />
        </Reveal>
      </section>

      {/* ── DECOMPOSITION ──────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="The fine print"
            title="A good split keeps two promises"
            sub="Splitting a table isn’t free — a careless decomposition can invent fake rows or lose rules you cared about. Two properties tell you whether a split is safe."
          />
        </Reveal>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal delay={0.05}>
            <div className="h-full rounded-[28px] border border-black/[0.07] bg-white p-8">
              <Pill color="#0071e3">Lossless join</Pill>
              <p className="mt-4 text-[16px] leading-relaxed text-[#424245]">
                Joining the pieces back together must reproduce the <em>exact</em> original table — no spurious,
                invented rows and nothing lost.
              </p>
              <p className="mt-4 font-mono text-[14px] text-[#0071e3]">R = R₁ ⋈ R₂</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-[28px] border border-black/[0.07] bg-white p-8">
              <Pill color="#5e5ce6">Dependency preserving</Pill>
              <p className="mt-4 text-[16px] leading-relaxed text-[#424245]">
                Every functional dependency from the original can still be checked on the new tables, without
                re-joining them first.
              </p>
              <p className="mt-4 font-mono text-[14px] text-[#5e5ce6]">F ≡ F₁ ∪ F₂</p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-6 max-w-4xl rounded-[28px] border border-[#ff9f0a]/30 bg-[#ff9f0a]/[0.06] p-7 text-center">
            <p className="text-[16px] leading-relaxed text-[#424245]">
              <strong className="text-[#9a6a00]">The trade-off:</strong> BCNF always gives you a lossless join but
              may sacrifice dependency preservation. 3NF guarantees <em>both</em> — which is why it’s often the
              practical target in real systems.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── PRACTICE: DETECTIVE ────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Interactive · put it together"
            title="Normal Form Detective"
            sub="Read each schema and its dependencies, then call the highest normal form it satisfies. This is exactly the reasoning you’ll use on real designs."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <NFDetective />
        </Reveal>
      </section>

      {/* ── QUICK REFERENCE ────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="At a glance" title="The normal forms, side by side" sub="One card per rung of the ladder — the rule it enforces and how you fix a violation." />
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {NF_SUMMARY.map((n) => (
            <motion.div
              key={n.nf}
              variants={item}
              className="rounded-[28px] border bg-white p-8"
              style={{ borderColor: n.color + '40' }}
            >
              <span className="font-mono text-[28px] font-bold" style={{ color: n.color }}>
                {n.nf}
              </span>
              <p className="mt-3 text-[16px] font-semibold leading-snug text-[#1d1d1f]">{n.rule}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">
                <span className="font-medium text-[#1d1d1f]">Fix:</span> {n.fix}
              </p>
            </motion.div>
          ))}
        </motion.div>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-4xl text-center">
            <span className="inline-block rounded-full bg-white px-6 py-3 font-mono text-[15px] font-medium text-[#1d1d1f] shadow-[0_8px_30px_-14px_rgba(0,0,0,0.2)]">
              Unnormalised → 1NF → 2NF → 3NF → BCNF
            </span>
          </div>
        </Reveal>
      </section>

      {/* ── CLOSING QUIZ ───────────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="Check yourself" title="Five quick questions" sub="See how much of the lesson stuck." />
        </Reveal>
        <Reveal delay={0.1}>
          <Quiz />
        </Reveal>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-4 flex items-center justify-center">
          <BrandLogo iconSize={28} variant="on-light" />
        </div>
        <p className="text-[14px] text-[#6e6e73]">
          A Database Normalisation lesson, put together by{' '}
          <span className="font-medium text-[#1d1d1f]">Dr. Yasas Sri Wickramasinghe</span>.
        </p>
        <p className="mt-2 text-[12px] text-[#aeaeb2]">
          Everything here runs in your own browser. No personal data is collected or stored.
        </p>
      </footer>
    </div>
  );
}
