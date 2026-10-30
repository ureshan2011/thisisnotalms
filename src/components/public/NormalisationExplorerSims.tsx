import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Pencil,
  PlusCircle,
  RotateCcw,
  Search,
  Target,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';

// ─── The Normalisation Explorer's interactive pieces ──────────────────────
// Every simulation from the original /normalisation page, rebuilt on Blend
// (src/components/blend/README.md) with the same content and the same
// behaviour. Colours are the Blend tokens; tables, pills and tabs take a
// colour through the `--c` custom property (src/styles/normalisation-explorer.css).
// Nothing is collected or stored: every widget keeps local state only.

export const EASE = [0.16, 1, 0.3, 1] as const;

/** The page's table and pill colours, mapped onto Blend's palette. */
export const C = {
  ink: '#1a1615',
  grey: '#6b615d',
  blue: '#1d4ed8',
  teal: '#0e7c70',
  violet: '#6d4bd8',
  magenta: '#a21caf',
  red: '#d93a2b',
  amber: '#b45309',
  green: '#1f8a57',
} as const;

const cvar = (c: string) => ({ '--c': c }) as CSSProperties;

// ── Shared parts ─────────────────────────────────────────────────────────
type CellKind = 'pk' | 'fk' | 'ok' | 'bad' | 'mut';
export interface TCell {
  v: ReactNode;
  k?: CellKind;
}

export function DataTable({ headers, rows, color = C.ink }: { headers: ReactNode[]; rows: TCell[][]; color?: string }) {
  return (
    <div className="nx-table" style={cvar(color)}>
      <div className="bt-scroll">
        <table>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((r, ri) => (
                <motion.tr
                  key={ri}
                  layout="position"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.45, ease: EASE, delay: ri * 0.04 }}
                >
                  {r.map((c, ci) => (
                    <td key={ci} className={c.k ? `nx-k-${c.k}` : undefined}>
                      <motion.span
                        key={String(c.v)}
                        initial={{ opacity: 0.2, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        {c.v}
                      </motion.span>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Pill({ color, solid, children }: { color: string; solid?: boolean; children: ReactNode }) {
  return (
    <span className={`nx-pill${solid ? ' nx-pill--solid' : ''}`} style={cvar(color)}>
      {children}
    </span>
  );
}

function Dep({ children }: { children: ReactNode }) {
  return <span className="nx-dep">{children}</span>;
}

/** A named table: its pill, its key, and the table itself. */
function Named({ name, pk, color, children }: { name: string; pk: string; color: string; children: ReactNode }) {
  return (
    <div>
      <div className="nx-tablehead">
        <Pill color={color} solid>{name}</Pill>
        <span className="nx-pk">PK: {pk}</span>
      </div>
      {children}
    </div>
  );
}

/** Segmented stepper with a sliding indicator. */
export function Steps({ id, labels, at, onPick }: { id: string; labels: string[]; at: number; onPick: (i: number) => void }) {
  const bar = useRef<HTMLDivElement>(null);
  // On a phone the bar scrolls sideways: keep the current step in view.
  useEffect(() => {
    const el = bar.current;
    const btn = el?.children[at] as HTMLElement | undefined;
    if (!el || !btn || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: btn.offsetLeft - (el.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' });
  }, [at]);
  return (
    <div className="nx-seg" role="tablist" ref={bar}>
      {labels.map((l, i) => (
        <button
          key={l}
          type="button"
          role="tab"
          aria-selected={i === at}
          className={i === at ? 'on' : i < at ? 'done' : undefined}
          onClick={() => onPick(i)}
        >
          {i === at && (
            <motion.span layoutId={`seg-${id}`} className="nx-seg__ind" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />
          )}
          <span className="nx-seg__txt">
            {l}
            {i < at && <Check size={14} strokeWidth={3} />}
          </span>
        </button>
      ))}
    </div>
  );
}

const Fade = ({ k, children, className }: { k: string; children: ReactNode; className?: string }) => (
  <motion.div
    key={k}
    className={className}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: EASE }}
  >
    {children}
  </motion.div>
);

function Next({ onClick, children, disabled }: { onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button type="button" className="bt-btn bt-btn--md" onClick={onClick} disabled={disabled}>
      {children}
      <span className="bt-btn__badge" aria-hidden="true"><ArrowRight size={14} /></span>
    </button>
  );
}

function Back({ onClick, disabled, children = 'Back' }: { onClick: () => void; disabled?: boolean; children?: ReactNode }) {
  return (
    <button type="button" className="bt-btn bt-btn--md bt-btn--tertiary" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIMULATION 1 — The Anomaly Playground
// ════════════════════════════════════════════════════════════════════════
type AnomalyMode = 'idle' | 'update' | 'insert' | 'delete';

export function AnomalyPlayground() {
  const [mode, setMode] = useState<AnomalyMode>('idle');

  const baseRows: TCell[][] = [
    [{ v: 'S1', k: 'pk' }, { v: 'Alice' }, { v: 'CS' }, { v: 'Dr. Smith' }, { v: 'Databases' }, { v: 'Prof. Lee' }],
    [{ v: 'S2', k: 'pk' }, { v: 'Bob' }, { v: 'CS' }, { v: 'Dr. Smith' }, { v: 'Databases' }, { v: 'Prof. Lee' }],
    [{ v: 'S3', k: 'pk' }, { v: 'Carol' }, { v: 'Math' }, { v: 'Dr. Jones' }, { v: 'Statistics' }, { v: 'Prof. Hill' }],
  ];
  const headers = ['StudentID', 'Name', 'Dept', 'DeptHead', 'Course', 'Instructor'];

  let rows = baseRows;
  if (mode === 'update') {
    rows = [
      [{ v: 'S1', k: 'pk' }, { v: 'Alice' }, { v: 'CS' }, { v: 'Dr. Brown', k: 'mut' }, { v: 'Databases' }, { v: 'Prof. Lee' }],
      [{ v: 'S2', k: 'pk' }, { v: 'Bob' }, { v: 'CS' }, { v: 'Dr. Smith', k: 'bad' }, { v: 'Databases' }, { v: 'Prof. Lee' }],
      [{ v: 'S3', k: 'pk' }, { v: 'Carol' }, { v: 'Math' }, { v: 'Dr. Jones' }, { v: 'Statistics' }, { v: 'Prof. Hill' }],
    ];
  } else if (mode === 'insert') {
    rows = [
      ...baseRows,
      [{ v: '?', k: 'bad' }, { v: '— no student —', k: 'bad' }, { v: 'Physics' }, { v: 'Dr. Gupta' }, { v: 'NULL', k: 'bad' }, { v: 'NULL', k: 'bad' }],
    ];
  } else if (mode === 'delete') {
    rows = baseRows.slice(0, 2);
  }

  const messages: Record<AnomalyMode, { title: string; color: string; body: ReactNode } | null> = {
    idle: null,
    update: {
      title: 'Update anomaly',
      color: C.red,
      body: (
        <>
          “Dr. Smith” appears in <strong>two</strong> CS rows. We renamed the head to <strong>Dr. Brown</strong> in
          Alice’s row but forgot Bob’s. The database now disagrees with itself about who runs CS. Update <em>every</em>{' '}
          copy or risk inconsistency.
        </>
      ),
    },
    insert: {
      title: 'Insertion anomaly',
      color: C.amber,
      body: (
        <>
          We want to record a new <strong>Physics</strong> department headed by Dr. Gupta — but no student has enrolled
          yet. Because student + course are part of the key, we’re forced to invent fake NULL data just to store a
          department.
        </>
      ),
    },
    delete: {
      title: 'Deletion anomaly',
      color: C.blue,
      body: (
        <>
          Carol was the only person taking <strong>Statistics</strong>. Deleting her row didn’t just remove an
          enrolment — it erased the fact that <strong>Prof. Hill teaches Statistics</strong> and that the{' '}
          <strong>Math</strong> department exists at all.
        </>
      ),
    },
  };
  const msg = messages[mode];

  const BUTTONS: [AnomalyMode, string, typeof Pencil][] = [
    ['update', 'Dr. Smith retires', Pencil],
    ['insert', 'Open Physics dept', PlusCircle],
    ['delete', 'Carol leaves', Trash2],
  ];

  return (
    <div className="nx-panel nx-mid">
      <div className="nx-center" style={{ marginTop: 0, marginBottom: 18 }}>
        {BUTTONS.map(([m, label, Icon]) => (
          <button
            key={m}
            type="button"
            className="bt-tab"
            style={{ fontSize: 14.5, padding: '10px 18px' }}
            aria-pressed={mode === m}
            onClick={() => setMode(cur => (cur === m ? 'idle' : m))}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
        {mode !== 'idle' && (
          <button type="button" className="bt-btn bt-btn--sm bt-btn--tertiary" onClick={() => setMode('idle')}>
            Reset
            <span className="bt-btn__badge" aria-hidden="true"><RotateCcw size={11} /></span>
          </button>
        )}
      </div>

      <motion.div layout transition={{ duration: 0.4, ease: EASE }}>
        <DataTable headers={headers} rows={rows} color={C.grey} />
      </motion.div>

      <div style={{ marginTop: 16, minHeight: 96 }}>
        <AnimatePresence mode="wait">
          {msg ? (
            <motion.div
              key={mode}
              className="nx-msg"
              style={cvar(msg.color)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="nx-msg__title">{msg.title}</p>
              <p className="nx-msg__body">{msg.body}</p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              className="nx-hint"
              style={{ marginTop: 6 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              This one table stores students, departments <em>and</em> courses all at once. Tap a button to see how that
              bites back.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIMULATION 2 — Functional Dependency Explorer
// ════════════════════════════════════════════════════════════════════════
const FD_ITEMS = [
  { fd: 'StudentID → StudentName', valid: true, why: 'One student ID maps to exactly one name. Knowing the ID always tells you the name.' },
  { fd: 'StudentName → StudentID', valid: false, why: 'Two different students can share the name “Alex”. A name does not pin down a single ID.' },
  { fd: 'Dept → DeptHead', valid: true, why: 'Each department has exactly one head, so the department determines the head.' },
  { fd: 'CourseID → Grade', valid: false, why: 'A course has many grades — one per student. You need the student too: {StudentID, CourseID} → Grade.' },
  { fd: '{StudentID, CourseID} → Grade', valid: true, why: 'A specific student in a specific course earns exactly one grade. The composite key determines it.' },
  { fd: 'DeptHead → Dept', valid: true, why: 'In this school each lecturer heads only one department, so the head identifies the department.' },
];

export function FDExplorer() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div className="nx-mid">
      <p className="nx-hint" style={{ marginTop: 0, marginBottom: 18 }}>
        Does the left side really <em>determine</em> the right side? Make your guess, then tap to check.
      </p>
      <div className="nx-grid2">
        {FD_ITEMS.map((it, i) => {
          const open = revealed[i];
          return (
            <motion.button
              key={it.fd}
              type="button"
              className={`nx-fdcard${open ? (it.valid ? ' nx-fdcard--good' : ' nx-fdcard--bad') : ''}`}
              onClick={() => setRevealed(r => ({ ...r, [i]: !r[i] }))}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
            >
              <div className="nx-fdcard__top">
                <span className="nx-fdcard__fd">{it.fd}</span>
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.span key="r" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.25 }}>
                      {it.valid ? (
                        <Pill color={C.green}><Check size={13} strokeWidth={3} /> Holds</Pill>
                      ) : (
                        <Pill color={C.red}><X size={13} strokeWidth={3} /> Doesn’t hold</Pill>
                      )}
                    </motion.span>
                  ) : (
                    <motion.span key="c" className="nx-fdcard__check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Check <ChevronRight size={14} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.32, ease: EASE }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="nx-fdcard__why">{it.why}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIMULATION 3 — The Normalisation Studio
// ════════════════════════════════════════════════════════════════════════
interface NormTable { name: string; pk: string; color: string; headers: string[]; rows: TCell[][] }
interface Stage { nf: string; title: string; blurb: string; redundancy: number; anomalies: boolean; tables: NormTable[] }

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
        color: C.red,
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
        color: C.amber,
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
        color: C.blue,
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
        color: C.teal,
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
        color: C.violet,
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
        color: C.blue,
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
        color: C.magenta,
        headers: ['Dept', 'DeptHead'],
        rows: [
          [{ v: 'CS', k: 'pk' }, { v: 'Dr. Smith', k: 'ok' }],
          [{ v: 'Math', k: 'pk' }, { v: 'Dr. Jones', k: 'ok' }],
        ],
      },
      {
        name: 'Courses',
        pk: 'CourseID',
        color: C.teal,
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
        color: C.violet,
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
        color: C.blue,
        headers: ['StudentID', 'Name', 'Dept (FK)'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'Alice' }, { v: 'CS', k: 'fk' }],
          [{ v: 'S3', k: 'pk' }, { v: 'Carol' }, { v: 'Math', k: 'fk' }],
        ],
      },
      {
        name: 'Departments',
        pk: 'Dept',
        color: C.magenta,
        headers: ['Dept', 'DeptHead'],
        rows: [
          [{ v: 'CS', k: 'pk' }, { v: 'Dr. Smith', k: 'ok' }],
          [{ v: 'Math', k: 'pk' }, { v: 'Dr. Jones', k: 'ok' }],
        ],
      },
      {
        name: 'Courses',
        pk: 'CourseID',
        color: C.teal,
        headers: ['CourseID', 'CourseName'],
        rows: [
          [{ v: 'C1', k: 'pk' }, { v: 'Databases' }],
          [{ v: '…', k: 'pk' }, { v: '…' }],
        ],
      },
      {
        name: 'Enrolment',
        pk: '{StudentID, CourseID}',
        color: C.violet,
        headers: ['StudentID', 'CourseID', 'Grade'],
        rows: [
          [{ v: 'S1', k: 'pk' }, { v: 'C1', k: 'pk' }, { v: 'A' }],
          [{ v: '…', k: 'pk' }, { v: '…', k: 'pk' }, { v: '…' }],
        ],
      },
    ],
  },
];

const level = (r: number) => (r > 60 ? 'High' : r > 25 ? 'Medium' : 'Low');
const levelColor = (r: number) => (r > 60 ? C.red : r > 25 ? C.amber : C.green);

/** `below` renders under the studio for a given stage: the page uses it to
 *  add the three-table walkthrough under 1NF. */
export function NormalizationStudio({ below }: { below?: (nf: string) => ReactNode }) {
  const [stage, setStage] = useState(0);
  const s = STAGES[stage];

  return (
    <div className="nx-panel">
      <Steps id="studio" labels={STAGES.map(st => st.nf)} at={stage} onPick={setStage} />

      <div className="nx-studio">
        <div>
          <div className="nx-studio__title">
            <h3>{s.title}</h3>
            <span>
              {s.tables.length} table{s.tables.length > 1 ? 's' : ''}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={s.nf} className="nx-stack" initial="hide" animate="show" exit="out">
              {s.tables.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={{
                    hide: { opacity: 0, y: 18, scale: 0.98 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE, delay: i * 0.09 } },
                    out: { opacity: 0, y: -10, transition: { duration: 0.2 } },
                  }}
                >
                  <Named name={t.name} pk={t.pk} color={t.color}>
                    <DataTable headers={t.headers} rows={t.rows} color={t.color} />
                  </Named>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="nx-side">
          <div className="nx-card">
            <AnimatePresence mode="wait">
              <motion.p
                key={s.nf}
                className="nx-blurb"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {s.blurb}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="nx-card">
            <div className="nx-meter__top">
              <span>Data redundancy</span>
              <motion.span animate={{ color: levelColor(s.redundancy) }}>{level(s.redundancy)}</motion.span>
            </div>
            <div className="nx-meter__track">
              <motion.div
                className="nx-meter__fill"
                initial={false}
                animate={{ width: `${s.redundancy}%`, backgroundColor: levelColor(s.redundancy) }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            </div>
          </div>

          <div className={`nx-status ${s.anomalies ? 'nx-status--bad' : 'nx-status--good'}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={String(s.anomalies)}
                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ display: 'inline-flex' }}
              >
                {s.anomalies ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
              </motion.span>
            </AnimatePresence>
            <span>
              {s.anomalies ? 'Update, insert & delete anomalies still possible' : 'Anomalies eliminated for this schema'}
            </span>
          </div>

          <div className="nx-nav">
            <Back onClick={() => setStage(i => Math.max(0, i - 1))} disabled={stage === 0} />
            <Next onClick={() => setStage(i => Math.min(STAGES.length - 1, i + 1))} disabled={stage === STAGES.length - 1}>
              {stage === STAGES.length - 1 ? 'Fully normalised' : `Normalise to ${STAGES[stage + 1].nf}`}
            </Next>
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">{below && <motion.div key={s.nf}>{below(s.nf)}</motion.div>}</AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIMULATION 4 — 1NF Atomic Splitter
// ════════════════════════════════════════════════════════════════════════
export function AtomicSplitter() {
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
    <div className="nx-panel nx-narrow">
      <motion.div layout transition={{ duration: 0.45, ease: EASE }}>
        <DataTable
          headers={['OrderID', atomic ? 'Product' : 'Products']}
          rows={atomic ? atomicRows : multiRows}
          color={atomic ? C.green : C.red}
        />
      </motion.div>
      <div className="nx-center">
        {atomic ? (
          <button type="button" className="bt-btn bt-btn--md bt-btn--tertiary" onClick={() => setAtomic(false)}>
            Show the bad version
            <span className="bt-btn__badge" aria-hidden="true"><RotateCcw size={12} /></span>
          </button>
        ) : (
          <Next onClick={() => setAtomic(true)}>Make every cell atomic</Next>
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={String(atomic)}
          className="nx-hint"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {atomic
            ? 'One product per row. Now you can ask “who ordered a Mouse?” with a simple WHERE clause.'
            : 'Three products crammed into one cell. Counting, filtering or joining on a single product is painful.'}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIMULATION 5 — Normal Form Detective
// ════════════════════════════════════════════════════════════════════════
interface Case { table: string; pk: string; fds: string[]; options: string[]; answer: string; why: string }
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

function optClass(answered: boolean, correct: boolean, chosen: boolean) {
  if (!answered) return 'nx-opt';
  if (correct) return 'nx-opt nx-opt--right';
  if (chosen) return 'nx-opt nx-opt--wrong';
  return 'nx-opt nx-opt--mute';
}

function Progress({ at, of }: { at: number; of: number }) {
  return (
    <div className="nx-quiz__bar">
      <motion.i animate={{ width: `${(at / of) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
    </div>
  );
}

function Done({ icon, score, of, msg, onReset }: { icon: ReactNode; score: number; of: number; msg: string; onReset: () => void }) {
  return (
    <motion.div className="nx-done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }}>
      <motion.div className="nx-done__icon" initial={{ rotate: -14, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
        {icon}
      </motion.div>
      <p className="nx-done__score">
        {score} / {of}
      </p>
      <p className="nx-done__msg">{msg}</p>
      <div className="nx-center">
        <button type="button" className="bt-btn bt-btn--md" onClick={onReset}>
          Try again
          <span className="bt-btn__badge" aria-hidden="true"><RotateCcw size={12} /></span>
        </button>
      </div>
    </motion.div>
  );
}

export function NFDetective() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const c = CASES[idx];

  const choose = (opt: string) => {
    if (picked !== null) return;
    setPicked(opt);
    if (opt === c.answer) setScore(s => s + 1);
  };
  const next = () => {
    if (idx + 1 >= CASES.length) return setDone(true);
    setIdx(i => i + 1);
    setPicked(null);
  };
  const reset = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="nx-quiz nx-mid">
      {done ? (
        <Done
          icon={score === CASES.length ? <Search size={34} /> : score >= 2 ? <Target size={34} /> : <BookOpen size={34} />}
          score={score}
          of={CASES.length}
          msg={
            score === CASES.length
              ? 'Flawless detective work — you can read a schema and call its normal form on sight.'
              : 'Good progress. Revisit the studio above, then try the cases again.'
          }
          onReset={reset}
        />
      ) : (
        <>
          <div className="nx-quiz__meta">
            <span>
              Case {idx + 1} of {CASES.length}
            </span>
            <span>Score {score}</span>
          </div>
          <Progress at={idx} of={CASES.length} />
          <AnimatePresence mode="wait">
            <Fade k={`case${idx}`}>
              <p className="nx-quiz__label">The schema</p>
              <p className="nx-quiz__schema">{c.table}</p>
              <p className="nx-pk" style={{ marginTop: 4 }}>PK = {c.pk}</p>
              <div className="nx-center" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
                {c.fds.map(f => (
                  <Dep key={f}>{f}</Dep>
                ))}
              </div>
              <p className="nx-quiz__q" style={{ marginTop: 26, marginBottom: 14 }}>
                What is the <em>highest</em> normal form this table satisfies?
              </p>
              <div className="nx-opts nx-opts--4">
                {c.options.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={optClass(picked !== null, opt === c.answer, opt === picked)}
                    disabled={picked !== null}
                    onClick={() => choose(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {picked !== null && (
                  <motion.div className="nx-why" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <p className={`nx-why__stamp ${picked === c.answer ? 'nx-why__stamp--good' : 'nx-why__stamp--bad'}`}>
                      {picked === c.answer ? 'Correct' : `Not quite — it’s ${c.answer}`}
                    </p>
                    <p>{c.why}</p>
                    <div style={{ marginTop: 14 }}>
                      <Next onClick={next}>{idx + 1 < CASES.length ? 'Next case' : 'See results'}</Next>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Fade>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIMULATION 6 — Closing true/false quiz
// ════════════════════════════════════════════════════════════════════════
const QUIZ = [
  { q: 'A table in 1NF can still have plenty of redundant data.', a: true, e: '1NF only requires atomic cells — repetition of student or department facts can remain.' },
  { q: '2NF is only a concern when the primary key is composite.', a: true, e: 'Partial dependencies need part of a key to depend on. With a single-column key there is no “part”, so 2NF is automatic.' },
  { q: 'A transitive dependency is what 3NF removes.', a: true, e: '3NF eliminates non-prime attributes that depend on the key only through another non-prime attribute.' },
  { q: 'Every table in BCNF is automatically also in 3NF.', a: true, e: 'BCNF is strictly stronger — satisfying it guarantees 3NF, but not the other way round.' },
  { q: 'BCNF decomposition always preserves all functional dependencies.', a: false, e: 'BCNF guarantees a lossless join but can lose dependency preservation — a real trade-off against 3NF.' },
];

export function TrueFalseQuiz() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (opt: boolean) => {
    if (answer !== null) return;
    setAnswer(opt);
    if (opt === QUIZ[idx].a) setScore(s => s + 1);
  };
  const next = () => {
    if (idx + 1 >= QUIZ.length) return setDone(true);
    setIdx(i => i + 1);
    setAnswer(null);
  };
  const reset = () => {
    setIdx(0);
    setAnswer(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="nx-quiz nx-narrow">
      {done ? (
        <Done
          icon={score >= 4 ? <Trophy size={34} /> : score >= 3 ? <Target size={34} /> : <BookOpen size={34} />}
          score={score}
          of={QUIZ.length}
          msg={
            score === QUIZ.length
              ? 'Perfect — the normal forms and their trade-offs have clearly clicked.'
              : score >= 3
              ? 'Nice work. Scroll back to the studio to firm up the last details.'
              : 'Good start. Replay the simulations above, then come back for another go.'
          }
          onReset={reset}
        />
      ) : (
        <>
          <div className="nx-quiz__meta">
            <span>
              Question {idx + 1} of {QUIZ.length}
            </span>
            <span>Score {score}</span>
          </div>
          <Progress at={idx} of={QUIZ.length} />
          <AnimatePresence mode="wait">
            <Fade k={`q${idx}`}>
              <p className="nx-quiz__q" style={{ marginBottom: 22 }}>{QUIZ[idx].q}</p>
              <div className="nx-opts nx-opts--2">
                {[true, false].map(opt => (
                  <button
                    key={String(opt)}
                    type="button"
                    className={optClass(answer !== null, opt === QUIZ[idx].a, opt === answer)}
                    disabled={answer !== null}
                    onClick={() => choose(opt)}
                  >
                    {opt ? 'True' : 'False'}
                  </button>
                ))}
              </div>
              {answer !== null && (
                <motion.div className="nx-why" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <p className={`nx-why__stamp ${answer === QUIZ[idx].a ? 'nx-why__stamp--good' : 'nx-why__stamp--bad'}`}>
                    {answer === QUIZ[idx].a ? 'Correct' : 'Not quite'}
                  </p>
                  <p>{QUIZ[idx].e}</p>
                  <div style={{ marginTop: 14 }}>
                    <Next onClick={next}>{idx + 1 < QUIZ.length ? 'Next question' : 'See results'}</Next>
                  </div>
                </motion.div>
              )}
            </Fade>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

// ─── Concept cards data ──────────────────────────────────────────────────
export const NF_SUMMARY = [
  { nf: '1NF', color: C.red, rule: 'Every cell is atomic, no repeating groups, a primary key exists.', fix: 'One value per cell; give multiple values their own rows.' },
  { nf: '2NF', color: C.amber, rule: 'In 1NF and no non-key attribute depends on only part of a composite key.', fix: 'Split partial dependencies into their own table.' },
  { nf: '3NF', color: C.blue, rule: 'In 2NF and no non-key attribute depends on the key through another non-key attribute.', fix: 'Extract the transitive chain (A → B → C) into a new table.' },
  { nf: 'BCNF', color: C.green, rule: 'For every dependency X → Y, X is a superkey. Stricter than 3NF.', fix: 'Decompose so every determinant is a key — may cost dependency preservation.' },
];

// ════════════════════════════════════════════════════════════════════════
// SIMULATION 7 — 1NF Real-World: Music Streaming Playlists
// ════════════════════════════════════════════════════════════════════════
const PLAYLIST_BEFORE = [
  { id: 'PL01', name: 'Morning Vibes', tracks: ['T01 · Blinding Lights', 'T02 · Levitating', 'T03 · Stay'] },
  { id: 'PL02', name: 'Workout Mix', tracks: ['T04 · POWER', 'T05 · Lose Yourself'] },
  { id: 'PL03', name: 'Study Mode', tracks: ['T06 · Lo-fi Beat #1', 'T07 · Rain Sounds', 'T08 · Focus Flow'] },
];

export function OneNFSimulator() {
  const [step, setStep] = useState(0);
  const afterRows = PLAYLIST_BEFORE.flatMap(p =>
    p.tracks.map(t => {
      const sep = t.indexOf(' · ');
      return { pid: p.id, name: p.name, tid: t.slice(0, sep), tname: t.slice(sep + 3) };
    }),
  );
  const steps = ['1. Messy table', '2. Spot the problem', '3. Apply 1NF'];

  return (
    <div className="nx-panel nx-mid">
      <Steps id="onenf" labels={steps} at={step} onPick={setStep} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <Fade k="s0">
            <DataTable
              headers={['playlist_id', 'playlist_name', 'tracks']}
              rows={PLAYLIST_BEFORE.map(p => [{ v: p.id, k: 'pk' as const }, { v: p.name }, { v: p.tracks.join(', '), k: 'bad' as const }])}
              color={C.red}
            />
            <p className="nx-hint">
              A music-streaming playlist table. The <em>tracks</em> column hides a comma-separated list — already
              violating 1NF.
            </p>
          </Fade>
        )}
        {step === 1 && (
          <Fade k="s1" className="nx-stack">
            {PLAYLIST_BEFORE.map((p, pi) => (
              <motion.div
                key={p.id}
                className="nx-plist"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: pi * 0.1 }}
              >
                <div className="nx-plist__top">
                  <span className="nx-plist__id">{p.id}</span>
                  <span className="nx-plist__name">{p.name}</span>
                  <span className="nx-plist__warn">{p.tracks.length} values in 1 cell!</span>
                </div>
                <div className="nx-plist__chips">
                  {p.tracks.map((t, ti) => (
                    <motion.span
                      key={t}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + pi * 0.1 + ti * 0.08, duration: 0.3, ease: EASE }}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
            <p className="nx-hint" style={{ marginTop: 0 }}>
              You can't query "which playlists contain T02?" with a simple WHERE clause — you'd need a LIKE '%T02%' hack.
            </p>
          </Fade>
        )}
        {step === 2 && (
          <Fade k="s2">
            <DataTable
              headers={['playlist_id', 'playlist_name', 'track_id', 'track_name']}
              rows={afterRows.map(r => [{ v: r.pid, k: 'pk' as const }, { v: r.name }, { v: r.tid, k: 'pk' as const }, { v: r.tname, k: 'ok' as const }])}
              color={C.green}
            />
            <p className="nx-hint">
              3 rows became {afterRows.length}. Every cell is atomic. <code>WHERE track_id = 'T02'</code> now works perfectly.
            </p>
          </Fade>
        )}
      </AnimatePresence>

      <div className="nx-center">
        {step > 0 && <Back onClick={() => setStep(s => s - 1)} />}
        {step < 2 && <Next onClick={() => setStep(s => s + 1)}>{step === 0 ? 'Spot the problem' : 'Apply 1NF'}</Next>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIMULATION 8 — 2NF Real-World: E-commerce order_items table
// ════════════════════════════════════════════════════════════════════════
const ORDER_ITEMS_BASE: TCell[][] = [
  [{ v: 'ORD-1', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 3 }, { v: 'Alice' }, { v: 'Wireless Mouse' }, { v: '$29.99' }],
  [{ v: 'ORD-1', k: 'pk' }, { v: 'P-102', k: 'pk' }, { v: 1 }, { v: 'Alice' }, { v: 'USB Hub' }, { v: '$19.99' }],
  [{ v: 'ORD-2', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 2 }, { v: 'Bob' }, { v: 'Wireless Mouse' }, { v: '$29.99' }],
  [{ v: 'ORD-3', k: 'pk' }, { v: 'P-103', k: 'pk' }, { v: 1 }, { v: 'Carol' }, { v: 'Laptop Stand' }, { v: '$49.99' }],
];
const ORDER_ITEMS_HIGHLIGHT: TCell[][] = ORDER_ITEMS_BASE.map(r => r.map((c, i) => (i >= 3 ? { ...c, k: 'bad' as const } : c)));

export function TwoNFSimulator() {
  const [phase, setPhase] = useState(0);
  const phases = ['1. See the table', '2. Find partial deps', '3. Apply 2NF'];

  return (
    <div className="nx-panel">
      <Steps id="twonf" labels={phases} at={phase} onPick={setPhase} />

      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <Fade k={`ph${phase}`}>
            <DataTable
              headers={['order_id', 'product_id', 'qty', 'customer_name', 'product_name', 'unit_price']}
              rows={phase === 1 ? ORDER_ITEMS_HIGHLIGHT : ORDER_ITEMS_BASE}
              color={phase === 0 ? C.grey : C.amber}
            />
            {phase === 1 && (
              <motion.div
                className="nx-grid2"
                style={{ marginTop: 14 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
              >
                <div className="nx-depnote">
                  <p className="nx-depnote__fd">order_id → customer_name</p>
                  <p>
                    customer_name depends on only <strong>order_id</strong>, not the full composite key — partial dependency.
                    Alice appears twice because she placed two line items.
                  </p>
                </div>
                <div className="nx-depnote">
                  <p className="nx-depnote__fd">product_id → product_name, unit_price</p>
                  <p>
                    product_name and unit_price depend on only <strong>product_id</strong> — another partial dependency.
                    "Wireless Mouse" at $29.99 is stored in two separate rows.
                  </p>
                </div>
              </motion.div>
            )}
          </Fade>
        ) : (
          <Fade k="split">
            <div className="nx-grid2" style={{ alignItems: 'start' }}>
              {[
                <Named key="o" name="orders" pk="order_id" color={C.blue}>
                  <DataTable
                    headers={['order_id', 'customer_name']}
                    rows={[
                      [{ v: 'ORD-1', k: 'pk' }, { v: 'Alice', k: 'ok' }],
                      [{ v: 'ORD-2', k: 'pk' }, { v: 'Bob', k: 'ok' }],
                      [{ v: 'ORD-3', k: 'pk' }, { v: 'Carol', k: 'ok' }],
                    ]}
                    color={C.blue}
                  />
                </Named>,
                <Named key="p" name="products" pk="product_id" color={C.teal}>
                  <DataTable
                    headers={['product_id', 'product_name', 'unit_price']}
                    rows={[
                      [{ v: 'P-101', k: 'pk' }, { v: 'Wireless Mouse', k: 'ok' }, { v: '$29.99', k: 'ok' }],
                      [{ v: 'P-102', k: 'pk' }, { v: 'USB Hub', k: 'ok' }, { v: '$19.99', k: 'ok' }],
                      [{ v: 'P-103', k: 'pk' }, { v: 'Laptop Stand', k: 'ok' }, { v: '$49.99', k: 'ok' }],
                    ]}
                    color={C.teal}
                  />
                </Named>,
              ].map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: -20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.55, ease: EASE, delay: i * 0.12 }}>
                  {t}
                </motion.div>
              ))}
            </div>
            <motion.div style={{ marginTop: 16 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.26 }}>
              <Named name="order_items" pk="{order_id, product_id}" color={C.violet}>
                <DataTable
                  headers={['order_id', 'product_id', 'qty']}
                  rows={[
                    [{ v: 'ORD-1', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 3, k: 'ok' }],
                    [{ v: 'ORD-1', k: 'pk' }, { v: 'P-102', k: 'pk' }, { v: 1, k: 'ok' }],
                    [{ v: 'ORD-2', k: 'pk' }, { v: 'P-101', k: 'pk' }, { v: 2, k: 'ok' }],
                    [{ v: 'ORD-3', k: 'pk' }, { v: 'P-103', k: 'pk' }, { v: 1, k: 'ok' }],
                  ]}
                  color={C.violet}
                />
              </Named>
            </motion.div>
            <p className="nx-hint">
              No redundancy. "Wireless Mouse" is stored once — changing its price means updating <strong>one row</strong> in{' '}
              <code>products</code>.
            </p>
          </Fade>
        )}
      </AnimatePresence>

      <div className="nx-center">
        {phase > 0 && <Back onClick={() => setPhase(p => p - 1)} />}
        {phase < 2 && <Next onClick={() => setPhase(p => p + 1)}>{phase === 0 ? 'Find partial deps' : 'Apply 2NF'}</Next>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIMULATION 9 — 3NF Real-World: HR employee records
// ════════════════════════════════════════════════════════════════════════
const CHAIN_NODES = [
  { label: 'emp_id', sub: '(PK)', color: C.blue },
  { label: 'dept_id', sub: '(non-key)', color: C.amber },
  { label: 'dept_name\ndept_city', sub: '(non-key)', color: C.red },
];

const HR_ROWS = [
  ['E-01', 'Alice', 'D-10', 'Engineering', 'Auckland'],
  ['E-02', 'Bob', 'D-10', 'Engineering', 'Auckland'],
  ['E-03', 'Carol', 'D-20', 'Marketing', 'Wellington'],
  ['E-04', 'Dave', 'D-10', 'Engineering', 'Auckland'],
];

export function ThreeNFSimulator() {
  const [phase, setPhase] = useState(0);
  const phases = ['1. The table', '2. Trace the chain', '3. Apply 3NF'];
  const headers = ['emp_id', 'emp_name', 'dept_id', 'dept_name', 'dept_city'];

  return (
    <div className="nx-panel">
      <Steps id="threenf" labels={phases} at={phase} onPick={setPhase} />

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <Fade k="p0">
            <DataTable headers={headers} rows={HR_ROWS.map(r => [{ v: r[0], k: 'pk' as const }, ...r.slice(1).map(v => ({ v }))])} color={C.grey} />
            <p className="nx-hint">
              HR table for a NZ company. The Engineering team in Auckland appears three times — why is that a problem?
            </p>
          </Fade>
        )}
        {phase === 1 && (
          <Fade k="p1">
            <div className="nx-chain">
              {CHAIN_NODES.map((node, i) => (
                <motion.div
                  key={node.label}
                  style={{ display: 'flex', alignItems: 'center' }}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.22, duration: 0.45, ease: EASE }}
                >
                  {i > 0 && (
                    <motion.span className="nx-chain__arrow" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.22 + 0.1, duration: 0.3 }}>
                      <ArrowRight size={22} />
                    </motion.span>
                  )}
                  <div className="nx-chain__node" style={cvar(node.color)}>
                    <p>{node.label}</p>
                    <p>{node.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <DataTable
              headers={headers}
              rows={HR_ROWS.map(r => [
                { v: r[0], k: 'pk' as const },
                { v: r[1] },
                { v: r[2], k: 'fk' as const },
                { v: r[3], k: 'bad' as const },
                { v: r[4], k: 'bad' as const },
              ])}
              color={C.red}
            />
            <motion.div
              className="nx-msg"
              style={{ ...cvar(C.blue), marginTop: 14 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
            >
              <p className="nx-msg__body" style={{ marginTop: 0 }}>
                <strong>The transitive chain:</strong> emp_id → dept_id → dept_name, dept_city. The highlighted columns only
                reach emp_id <em>through</em> the non-key dept_id — a transitive dependency violating 3NF.
              </p>
            </motion.div>
          </Fade>
        )}
        {phase === 2 && (
          <Fade k="p2">
            <div className="nx-grid2" style={{ alignItems: 'start' }}>
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: EASE }}>
                <Named name="employees" pk="emp_id" color={C.blue}>
                  <DataTable
                    headers={['emp_id', 'emp_name', 'dept_id']}
                    rows={HR_ROWS.map(r => [{ v: r[0], k: 'pk' as const }, { v: r[1] }, { v: r[2], k: 'fk' as const }])}
                    color={C.blue}
                  />
                </Named>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.14 }}>
                <Named name="departments" pk="dept_id" color={C.teal}>
                  <DataTable
                    headers={['dept_id', 'dept_name', 'dept_city']}
                    rows={[
                      [{ v: 'D-10', k: 'pk' }, { v: 'Engineering', k: 'ok' }, { v: 'Auckland', k: 'ok' }],
                      [{ v: 'D-20', k: 'pk' }, { v: 'Marketing', k: 'ok' }, { v: 'Wellington', k: 'ok' }],
                    ]}
                    color={C.teal}
                  />
                </Named>
              </motion.div>
            </div>
            <p className="nx-hint">
              dept_name and dept_city now live in <code>departments</code> exactly once. Moving the Auckland office to
              Hamilton? Update <strong>one row</strong>.
            </p>
          </Fade>
        )}
      </AnimatePresence>

      <div className="nx-center">
        {phase > 0 && <Back onClick={() => setPhase(p => p - 1)} />}
        {phase < 2 && <Next onClick={() => setPhase(p => p + 1)}>{phase === 0 ? 'Trace the chain' : 'Apply 3NF'}</Next>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// INTERACTIVE — The "is my table in this form?" checklist
// ════════════════════════════════════════════════════════════════════════
const CHECKLISTS = [
  {
    nf: '1NF',
    color: C.violet,
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
    color: C.amber,
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
    color: C.blue,
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

export function NFChecklist() {
  const [active, setActive] = useState(0);
  const c = CHECKLISTS[active];
  return (
    <div className="nx-narrow">
      <div className="nx-tabs" role="tablist">
        {CHECKLISTS.map((cl, i) => (
          <button
            key={cl.nf}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={active === i ? 'on' : undefined}
            style={cvar(cl.color)}
            onClick={() => setActive(i)}
          >
            {active === i && (
              <motion.span layoutId="nx-checktab" className="nx-tabs__ind" style={{ background: cl.color }} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
            )}
            <span className="nx-tabs__txt">{cl.nf}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={c.nf}
          className="nx-check"
          style={cvar(c.color)}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <p className="nx-check__tag">{c.tagline}</p>
          <p className="nx-check__plain">{c.plain}</p>
          <ul>
            {c.items.map((it, i) => (
              <motion.li key={it} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.09, duration: 0.4, ease: EASE }}>
                <motion.span
                  className="nx-check__tick"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.09, type: 'spring', stiffness: 400, damping: 18 }}
                >
                  <Check size={15} strokeWidth={3} />
                </motion.span>
                <span>{it}</span>
              </motion.li>
            ))}
          </ul>
          <div className="nx-check__ex">
            <p>Quick example</p>
            <p>{c.example}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="nx-hint" style={{ marginTop: 20 }}>
        Tick all the boxes on a tab? Your table is in that form. Each form builds on the one before it.
      </p>
    </div>
  );
}
