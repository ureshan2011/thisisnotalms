import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, KeyRound, RotateCcw } from 'lucide-react';
import { C, EASE, Pill, Steps } from './NormalisationExplorerSims';

// ─── 1NF, the better approach: three tables ───────────────────────────────
// Shown in the Normalisation Studio under the 1NF stage. The one-table 1NF
// above it is correct, but it jumps straight to a two-column key. This walks
// the lecturer's sketch example (students and the courses they take, no
// departments, no grades) to 1NF the way the sketch does it: take the
// students out (key StudentID), take the courses out
// and give each an ID (key CourseID), then record who takes what in an
// Enrolment table whose key is the two IDs together, with arrows showing
// where each one comes from. It ends with the ER view: Student N–enrols–M
// Course.

const cvar = (c: string) => ({ '--c': c }) as CSSProperties;

const SID = C.red; // StudentID: the sketch circles it in red
const CID = C.green; // CourseID: the sketch circles it in green

interface Col {
  label: string;
  /** Marks a key column and colours it. */
  key?: 'sid' | 'cid';
  /** Lets an arrow find this header cell. */
  anchor?: string;
  bad?: boolean;
}

/** A small table whose key headers can be ringed and pointed at. */
function KTable({
  name,
  color,
  cols,
  rows,
  ring,
  badCells,
  delay = 0,
}: {
  name: string;
  color: string;
  cols: Col[];
  rows: ReactNode[][];
  ring?: boolean;
  badCells?: (r: number, c: number) => boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className="tf-table"
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      <div className="nx-table" style={cvar(color)}>
        <div className="bt-scroll">
          <table>
            <thead>
              <tr>
                {cols.map(c => (
                  <th key={c.label} data-anchor={c.anchor}>
                    <span className={c.key && ring ? `tf-key tf-key--${c.key}` : undefined}>
                      {c.key && <KeyRound size={12} strokeWidth={2.6} />} {c.label}
                      {c.key && ring && (
                        <motion.i
                          className="tf-ring"
                          initial={{ scale: 1.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, ease: EASE, delay: delay + 0.35 }}
                        />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <motion.tr
                  key={ri}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: delay + 0.15 + ri * 0.06 }}
                >
                  {r.map((v, ci) => {
                    const k = cols[ci].key;
                    const cls = badCells?.(ri, ci) ? 'nx-k-bad' : k === 'sid' ? 'tf-k-sid' : k === 'cid' ? 'tf-k-cid' : undefined;
                    return (
                      <td key={ci} className={cls}>
                        {v}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* The name sits under the table, as in the course sketch, so arrows into the header stay clear. */}
      <p className="tf-cap">
        <Pill color={color} solid>{name}</Pill>
      </p>
    </motion.div>
  );
}

/** Curved arrows between header cells, measured from the page so they follow any layout. */
function Arrows({ links, deps }: { links: { from: string; to: string; color: string }[]; deps: unknown }) {
  const box = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<{ d: string; color: string }[]>([]);

  useLayoutEffect(() => {
    const el = box.current?.parentElement;
    if (!el) return;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const out: typeof paths = [];
      for (const l of links) {
        const a = el.querySelector(`[data-anchor="${l.from}"]`)?.getBoundingClientRect();
        const b = el.querySelector(`[data-anchor="${l.to}"]`)?.getBoundingClientRect();
        if (!a || !b) continue;
        const sx = a.left + a.width / 2 - base.left;
        const sy = a.top - base.top;
        const tx = b.left + b.width / 2 - base.left;
        const ty = b.top - base.top;
        if (Math.abs(sy - ty) < 60) {
          // Same row: arc over the top, like the sketch.
          const lift = 46 + Math.min(40, Math.abs(tx - sx) * 0.06);
          const top = Math.min(sy, ty) - lift;
          out.push({ d: `M ${sx} ${sy - 2} C ${sx} ${top}, ${tx} ${top}, ${tx} ${ty - 4}`, color: l.color });
        }
        // Stacked (phones): no arrows; the red and green keys carry the link.
      }
      setPaths(out);
    };
    // Measure after the tables have dropped into place.
    const t = setTimeout(measure, 650);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  return (
    <div ref={box} className="tf-arrows" aria-hidden="true">
      <svg>
        <defs>
          {paths.map((p, i) => (
            <marker key={i} id={`tf-head-${i}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={p.color} />
            </marker>
          ))}
        </defs>
        {paths.map((p, i) => (
          <motion.path
            key={`${i}-${p.d}`}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth="2.4"
            strokeLinecap="round"
            markerEnd={`url(#tf-head-${i})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.25 }}
          />
        ))}
      </svg>
    </div>
  );
}

// ── The example: the lecturer's sketch ───────────────────────────────────
// Students and the courses they take, with a list in the Course cell. Course
// IDs follow the sketch (C1 Maths, C2 Science, C3 English, C5 Commerce, C6
// Arts); Database and Music, which the sketch leaves out, fill C4 and C7.
const STUDENTS = [
  ['100', 'Nimal'],
  ['101', 'Kasun'],
  ['102', 'Peter'],
  ['103', 'Shilpa'],
  ['104', 'Bob'],
];
const ZERO = [
  ['100', 'Nimal', 'Maths, Science'],
  ['101', 'Kasun', 'English'],
  ['102', 'Peter', 'Database'],
  ['103', 'Shilpa', 'Commerce, Arts'],
  ['104', 'Bob', 'Music'],
];
const COURSES = [
  ['C1', 'Maths'],
  ['C2', 'Science'],
  ['C3', 'English'],
  ['C4', 'Database'],
  ['C5', 'Commerce'],
  ['C6', 'Arts'],
  ['C7', 'Music'],
];
const ENROL = [
  ['100', 'C1'],
  ['100', 'C2'],
  ['101', 'C3'],
  ['102', 'C4'],
  ['103', 'C5'],
  ['103', 'C6'],
  ['104', 'C7'],
];

const STUDENT_COLS: Col[] = [{ label: 'StudentID', key: 'sid', anchor: 's-sid' }, { label: 'Name' }];
const COURSE_COLS: Col[] = [{ label: 'CourseID', key: 'cid', anchor: 'c-cid' }, { label: 'Course' }];
const ENROL_COLS: Col[] = [
  { label: 'StudentID', key: 'sid', anchor: 'e-sid' },
  { label: 'CourseID', key: 'cid', anchor: 'e-cid' },
];

const LINKS = [
  { from: 's-sid', to: 'e-sid', color: SID },
  { from: 'c-cid', to: 'e-cid', color: CID },
];

const STEP_LABELS = ['1. Spot the list', '2. Student table', '3. Course table', '4. Enrolment table', '5. Check it'];

const STEP_TEXT: { title: string; body: ReactNode }[] = [
  {
    title: 'The Course cell holds a list',
    body: (
      <>
        Nimal’s cell says <b>Maths, Science</b> and Shilpa’s says <b>Commerce, Arts</b>: two courses in one cell. That
        breaks 1NF. The table is also mixing two different things: facts about <b>students</b> and facts about{' '}
        <b>courses</b>. So instead of copying Nimal onto a second row, give each thing its own table.
      </>
    ),
  },
  {
    title: 'Take the students out',
    body: (
      <>
        Each student goes into a <b>Student</b> table, one row per student: StudentID and Name. StudentID picks out
        exactly one student, so it is the key of this table.
      </>
    ),
  },
  {
    title: 'Take the courses out, and give each an ID',
    body: (
      <>
        Each course gets its own row in a <b>Course</b> table, with a CourseID: C1 Maths, C2 Science and so on.
        CourseID is the key. Every course name is now written once.
      </>
    ),
  },
  {
    title: 'Record who takes what in an Enrolment table',
    body: (
      <>
        One row for each student in each course. Bring in the key from each table: <b>StudentID</b> from Student and{' '}
        <b>CourseID</b> from Course. Nimal takes two courses, so 100 appears twice; a course can have many students, so a
        CourseID can appear many times too. Neither ID on its own picks out a row. Together they do, so the key of
        Enrolment is <b>{'{StudentID, CourseID}'}</b>.
      </>
    ),
  },
  {
    title: 'Check: every cell holds one value',
    body: (
      <>
        No lists, and no student or course name written twice. The three tables are in 1NF, and they link back together
        through StudentID and CourseID: Nimal (100) takes C1 and C2, which are Maths and Science.
      </>
    ),
  },
];

function ErView() {
  return (
    <motion.div className="tf-er" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}>
      <p className="tf-er__label">The same design as an ER diagram</p>
      <svg viewBox="0 0 620 120" role="img" aria-label="ER diagram: Student, N, enrols, M, Course">
        <rect x="10" y="32" width="170" height="56" rx="10" fill={C.ink} />
        <text x="95" y="66" textAnchor="middle" className="tf-er__t" fill="#fff">Student</text>
        <motion.line x1="180" y1="60" x2="240" y2="60" stroke={C.ink} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.4 }} />
        <text x="198" y="50" className="tf-er__n">N</text>
        <polygon points="310,18 380,60 310,102 240,60" fill={C.amber} />
        <text x="310" y="66" textAnchor="middle" className="tf-er__t" fill="#fff">enrols</text>
        <motion.line x1="380" y1="60" x2="440" y2="60" stroke={C.ink} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.4 }} />
        <text x="418" y="50" className="tf-er__n">M</text>
        <rect x="440" y="32" width="170" height="56" rx="10" fill={C.ink} />
        <text x="525" y="66" textAnchor="middle" className="tf-er__t" fill="#fff">Course</text>
      </svg>
      <p className="tf-er__note">
        Many students enrol in many courses. The Enrolment table is that “enrols” relationship turned into a table.
      </p>
    </motion.div>
  );
}

export default function ThreeTableFix() {
  const [step, setStep] = useState(0);
  const showStudents = step >= 1;
  const showCourses = step >= 2;
  const showEnrol = step >= 3;

  return (
    <motion.div
      className="tf"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <p className="bt-eyebrow">A better approach</p>
      <h3 className="tf-title">
        Fix the list with three tables, step by step<span className="bt-stop">.</span>
      </h3>
      <p className="tf-lead">
        The table above is in 1NF, but it had to jump straight to a two-column key, and it still repeats the same
        details on every row. Here is the idea step by step on a smaller example, students and the courses they take:
        give students, courses and enrolments a table each.
      </p>

      <Steps id="threetable" labels={STEP_LABELS} at={step} onPick={setStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="tf-say"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <span className="tf-say__n">{step + 1}</span>
          <div>
            <p className="tf-say__title">{STEP_TEXT[step].title}</p>
            <p className="tf-say__body">{STEP_TEXT[step].body}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {step === 0 ? (
        <div className="tf-board tf-board--one">
          <KTable
            name="Student courses (not in 1NF)"
            color={C.red}
            cols={[{ label: 'StudentID' }, { label: 'Name' }, { label: 'Course' }]}
            rows={ZERO}
            badCells={(r, c) => c === 2 && (r === 0 || r === 3)}
          />
          <div className="tf-split">
            <span className="tf-split__chip" style={cvar(SID)}>StudentID, Name → about the student</span>
            <span className="tf-split__chip" style={cvar(CID)}>Maths, Science, English… → courses</span>
          </div>
        </div>
      ) : (
        <div className={`tf-board${showEnrol ? ' tf-board--arrows' : ''}`}>
          <div className="tf-grid">
            {showStudents && (
              <KTable key="s" name="Student" color={C.blue} cols={STUDENT_COLS} rows={STUDENTS} ring />
            )}
            {showCourses && (
              <KTable key="c" name="Course" color={C.teal} cols={COURSE_COLS} rows={COURSES} ring delay={step === 2 ? 0 : 0.05} />
            )}
            {showEnrol && (
              <KTable key="e" name="Enrolment" color={C.violet} cols={ENROL_COLS} rows={ENROL} ring delay={step === 3 ? 0.15 : 0.1} />
            )}
          </div>
          {showEnrol && <Arrows links={LINKS} deps={step} />}
        </div>
      )}

      {showEnrol && (
        <motion.p className="tf-assume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Assumption based on general knowledge: a particular course may have many enrolments from many students.
        </motion.p>
      )}

      {step === 4 && <ErView />}

      <div className="nx-center">
        {step > 0 && (
          <button type="button" className="bt-btn bt-btn--md bt-btn--tertiary" onClick={() => setStep(s => s - 1)}>
            Back
          </button>
        )}
        {step < STEP_LABELS.length - 1 ? (
          <button type="button" className="bt-btn bt-btn--md" onClick={() => setStep(s => s + 1)}>
            {STEP_LABELS[step + 1].replace(/^\d+\.\s*/, 'Next: ')}
            <span className="bt-btn__badge" aria-hidden="true"><ArrowRight size={14} /></span>
          </button>
        ) : (
          <button type="button" className="bt-btn bt-btn--md bt-btn--tertiary" onClick={() => setStep(0)}>
            Start again
            <span className="bt-btn__badge" aria-hidden="true"><RotateCcw size={12} /></span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
