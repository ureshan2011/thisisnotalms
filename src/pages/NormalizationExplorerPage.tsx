import { Fragment } from 'react';
import { CoursePage } from '../components/blend';
import '../styles/normalisation-explorer.css';

// ─── /normalisation — Database normalisation, MBI802 ──────────────────────
// A short, static page: the rule for each normal form, then one running
// example (students, courses, departments) taken from a messy sheet to 3NF.
// 2NF and 3NF are shown as dependency diagrams: columns in a row, arrows
// underneath from what you need to know to what it tells you.
//   green  = depends on the whole key (fine)
//   red    = partial dependency (breaks 2NF)
//   purple = transitive dependency (breaks 3NF)
// No animation, nothing collected or stored.

const NAV = [
  { id: 'rules', label: 'The rules' },
  { id: 'unf', label: 'Start' },
  { id: 'first', label: '1NF' },
  { id: 'second', label: '2NF' },
  { id: 'third', label: '3NF' },
  { id: 'result', label: 'Result' },
];

const GREEN = '#1f8a57';
const RED = '#d93a2b';
const PURPLE = '#6d4bd8';

type Kind = 'full' | 'partial' | 'trans';
const KIND_COLOUR: Record<Kind, string> = { full: GREEN, partial: RED, trans: PURPLE };

// ─── Small table ──────────────────────────────────────────────────────────

type Mark = 'bad' | 'list';

function Table({
  name,
  cols,
  keyCols = [],
  rows,
  marks = {},
}: {
  name?: string;
  cols: string[];
  keyCols?: number[];
  rows: string[][];
  /** "r,c" → how to shade that cell */
  marks?: Record<string, Mark>;
}) {
  return (
    <div className="nf-tablebox">
      {name && <p className="nf-tablename">{name}</p>}
      <div className="nf-scroll">
        <table className="nf-table">
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th key={c} className={keyCols.includes(i) ? 'nf-key' : undefined}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((v, ci) => {
                  const m = marks[`${ri},${ci}`];
                  return (
                    <td key={ci} className={m ? `nf-cell--${m}` : undefined}>
                      {v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Dependency diagram ───────────────────────────────────────────────────
// Column boxes in a row. Each arrow drops from its source column(s) to its
// own level underneath, runs across, and rises into its target column(s).

type Dep = { from: number[]; to: number[]; kind: Kind; label: string };

const BW = 118; // box width
const BH = 42; // box height
const TOP = 8;
const GAP = 40; // space between levels

function DepDiagram({ cols, keyCols, deps, shade = {} }: { cols: string[]; keyCols: number[]; deps: Dep[]; shade?: Record<number, Kind> }) {
  const W = cols.length * BW + 2;
  const base = TOP + BH;
  const H = base + 30 + deps.length * GAP;
  const cx = (i: number) => 1 + i * BW + BW / 2;
  return (
    <div className="nf-scroll">
      <svg
        className="nf-diagram"
        viewBox={`0 0 ${W} ${H}`}
        width={W + 20}
        style={{ minWidth: Math.min(W + 20, 640) }}
        role="img"
        aria-label={deps.map(d => `${d.from.map(f => cols[f]).join(' + ')} → ${d.to.map(t => cols[t]).join(', ')}: ${d.label}`).join('. ')}
      >
        <defs>
          {(Object.keys(KIND_COLOUR) as Kind[]).map(k => (
            <marker key={k} id={`nf-head-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill={KIND_COLOUR[k]} />
            </marker>
          ))}
        </defs>

        {cols.map((c, i) => {
          const k = shade[i];
          return (
            <g key={c}>
              <rect
                x={1 + i * BW}
                y={TOP}
                width={BW}
                height={BH}
                fill={k ? `${KIND_COLOUR[k]}14` : '#fff'}
                stroke="#cdb8aa"
              />
              <text
                x={cx(i)}
                y={TOP + BH / 2 + 5}
                textAnchor="middle"
                className={keyCols.includes(i) ? 'nf-svg-key' : 'nf-svg-col'}
              >
                {c}
              </text>
              {keyCols.includes(i) && (
                <line x1={cx(i) - c.length * 4} x2={cx(i) + c.length * 4} y1={TOP + BH / 2 + 9} y2={TOP + BH / 2 + 9} stroke="#0e0c0b" strokeWidth={1.4} />
              )}
            </g>
          );
        })}

        {deps.map((d, n) => {
          const col = KIND_COLOUR[d.kind];
          const y = base + 26 + n * GAP;
          const dx = (n - (deps.length - 1) / 2) * 8;
          const xs = [...d.from, ...d.to].map(i => cx(i) + dx);
          const x1 = Math.min(...xs);
          const x2 = Math.max(...xs);
          const mid = (x1 + x2) / 2;
          return (
            <g key={n} stroke={col} strokeWidth={2.2} fill="none">
              {d.from.map(f => (
                <Fragment key={`f${f}`}>
                  <line x1={cx(f) + dx} y1={base} x2={cx(f) + dx} y2={y} />
                  <circle cx={cx(f) + dx} cy={base + 3} r={3} fill={col} />
                </Fragment>
              ))}
              <line x1={x1} y1={y} x2={x2} y2={y} />
              {d.to.map(t => (
                <line key={`t${t}`} x1={cx(t) + dx} y1={y} x2={cx(t) + dx} y2={base + 2} markerEnd={`url(#nf-head-${d.kind})`} />
              ))}
              <text x={mid} y={y + 15} textAnchor="middle" className="nf-svg-label" fill={col}>
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Legend() {
  return (
    <div className="nf-legend">
      <span>
        <i style={{ background: GREEN }} /> needs the whole key — fine
      </span>
      <span>
        <i style={{ background: RED }} /> partial dependency — breaks 2NF
      </span>
      <span>
        <i style={{ background: PURPLE }} /> transitive dependency — breaks 3NF
      </span>
      <span>
        <u>Underlined</u> = key
      </span>
    </div>
  );
}

function Rule({ nf, children }: { nf: string; children: React.ReactNode }) {
  return (
    <div className="nf-rule">
      <span className="nf-rule__nf">{nf}</span>
      <p>{children}</p>
    </div>
  );
}

function Down({ children }: { children: React.ReactNode }) {
  return (
    <div className="nf-down">
      <span aria-hidden="true">↓</span> {children}
    </div>
  );
}

function Head({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="nf-head">
      <p className="bt-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────

const ONE_NF_COLS = ['StudentID', 'CourseID', 'Grade', 'StudentName', 'DeptID', 'DeptName', 'CourseTitle'];
const ONE_NF_ROWS = [
  ['S1', 'C1', 'A', 'Amaya', 'D1', 'Computing', 'Databases'],
  ['S1', 'C2', 'B', 'Amaya', 'D1', 'Computing', 'Networks'],
  ['S2', 'C1', 'A', 'Ben', 'D2', 'Business', 'Databases'],
];

const STUDENT_COLS = ['StudentID', 'StudentName', 'DeptID', 'DeptName'];

export default function NormalizationExplorerPage() {
  return (
    <CoursePage
      courseCode="MBI802"
      courseName="Database Management Systems"
      nav={NAV}
      footerNote="Everything here runs in your own browser. No personal data is collected or stored."
      hero={
        <div className="nf-hero">
          <span className="bt-flag">
            <span className="bt-dot" style={{ background: 'var(--accent-500)' }} />
            Dr. Yasas Sri Wickramasinghe
          </span>
          <h1>Database normalisation</h1>
          <p className="bt-hero__lede">One table, three steps: 1NF → 2NF → 3NF.</p>
        </div>
      }
    >
      {/* ── THE RULES ──────────────────────────────────────────────────── */}
      <section id="rules" className="bt-sec">
        <Head eyebrow="What each form needs" title="The rules" />
        <div className="nf-scroll">
          <table className="nf-rules">
            <thead>
              <tr>
                <th>Form</th>
                <th>Requirement</th>
                <th>Not allowed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>1NF</b>
                </td>
                <td>One value per cell. Every row has a key.</td>
                <td>Lists in a cell, repeating groups</td>
              </tr>
              <tr>
                <td>
                  <b>2NF</b>
                </td>
                <td>1NF + every non-key column needs the <b>whole</b> key.</td>
                <td style={{ color: RED }}>Partial dependency</td>
              </tr>
              <tr>
                <td>
                  <b>3NF</b>
                </td>
                <td>2NF + non-key columns depend <b>only on the key</b>.</td>
                <td style={{ color: PURPLE }}>Transitive dependency</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="nf-motto">“The key, the whole key, and nothing but the key.”</p>
        <p className="nf-note">
          <b>A → B</b> means: if you know A, you know B.
        </p>
      </section>

      {/* ── UNF ────────────────────────────────────────────────────────── */}
      <section id="unf" className="bt-sec">
        <Head eyebrow="Start" title="The messy table" />
        <Table
          name="StudentCourses"
          cols={['StudentID', 'StudentName', 'DeptID', 'DeptName', 'CourseID', 'CourseTitle', 'Grade']}
          rows={[
            ['S1', 'Amaya', 'D1', 'Computing', 'C1, C2', 'Databases, Networks', 'A, B'],
            ['S2', 'Ben', 'D2', 'Business', 'C1', 'Databases', 'A'],
          ]}
          marks={{ '0,4': 'list', '0,5': 'list', '0,6': 'list' }}
        />
        <p className="nf-note">Lists inside cells → not even 1NF.</p>
      </section>

      {/* ── 1NF ────────────────────────────────────────────────────────── */}
      <section id="first" className="bt-sec">
        <Head eyebrow="First normal form" title="1NF" />
        <Rule nf="1NF">One value per cell.</Rule>
        <Down>Give each course its own row. Key = StudentID + CourseID.</Down>
        <Table
          name="Enrolment"
          cols={ONE_NF_COLS}
          keyCols={[0, 1]}
          rows={ONE_NF_ROWS}
          marks={{ '0,3': 'bad', '0,4': 'bad', '0,5': 'bad', '1,3': 'bad', '1,4': 'bad', '1,5': 'bad', '0,6': 'bad', '2,6': 'bad' }}
        />
        <p className="nf-note">
          ✓ In 1NF. But shaded values repeat — Amaya, Computing, Databases are stored more than once.
        </p>
      </section>

      {/* ── 2NF ────────────────────────────────────────────────────────── */}
      <section id="second" className="bt-sec">
        <Head eyebrow="Second normal form" title="2NF — no partial dependencies" />
        <Rule nf="2NF">Every non-key column must need the WHOLE key (StudentID + CourseID), not just one part.</Rule>
        <Legend />
        <DepDiagram
          cols={ONE_NF_COLS}
          keyCols={[0, 1]}
          shade={{ 2: 'full', 3: 'partial', 4: 'partial', 5: 'partial', 6: 'partial' }}
          deps={[
            { from: [0, 1], to: [2], kind: 'full', label: 'needs both ✓' },
            { from: [0], to: [3, 4, 5], kind: 'partial', label: 'needs only StudentID ✗' },
            { from: [1], to: [6], kind: 'partial', label: 'needs only CourseID ✗' },
          ]}
        />
        <div className="nf-deps">
          <code className="nf-dep nf-dep--full">StudentID + CourseID → Grade</code>
          <code className="nf-dep nf-dep--partial">StudentID → StudentName, DeptID, DeptName</code>
          <code className="nf-dep nf-dep--partial">CourseID → CourseTitle</code>
        </div>
        <Down>Move each partial dependency into its own table.</Down>
        <div className="nf-grid">
          <Table
            name="Student"
            cols={STUDENT_COLS}
            keyCols={[0]}
            rows={[
              ['S1', 'Amaya', 'D1', 'Computing'],
              ['S2', 'Ben', 'D2', 'Business'],
            ]}
          />
          <Table
            name="Course"
            cols={['CourseID', 'CourseTitle']}
            keyCols={[0]}
            rows={[
              ['C1', 'Databases'],
              ['C2', 'Networks'],
            ]}
          />
          <Table
            name="Enrolment"
            cols={['StudentID', 'CourseID', 'Grade']}
            keyCols={[0, 1]}
            rows={[
              ['S1', 'C1', 'A'],
              ['S1', 'C2', 'B'],
              ['S2', 'C1', 'A'],
            ]}
          />
        </div>
        <p className="nf-note">✓ In 2NF. Check the Student table next…</p>
      </section>

      {/* ── 3NF ────────────────────────────────────────────────────────── */}
      <section id="third" className="bt-sec">
        <Head eyebrow="Third normal form" title="3NF — no transitive dependencies" />
        <Rule nf="3NF">Non-key columns depend only on the key — not on another non-key column.</Rule>
        <Legend />
        <DepDiagram
          cols={STUDENT_COLS}
          keyCols={[0]}
          shade={{ 1: 'full', 2: 'full', 3: 'trans' }}
          deps={[
            { from: [0], to: [1, 2], kind: 'full', label: 'depends on the key ✓' },
            { from: [2], to: [3], kind: 'trans', label: 'depends on DeptID ✗' },
          ]}
        />
        <div className="nf-chain">
          <span>StudentID</span>
          <b>→</b>
          <span>DeptID</span>
          <b style={{ color: PURPLE }}>→</b>
          <span style={{ borderColor: PURPLE, color: PURPLE }}>DeptName</span>
        </div>
        <p className="nf-note">DeptName reaches the key only through DeptID (a non-key column). That is a transitive dependency.</p>
        <Down>Move DeptID → DeptName into its own table.</Down>
        <div className="nf-grid">
          <Table
            name="Student"
            cols={['StudentID', 'StudentName', 'DeptID']}
            keyCols={[0]}
            rows={[
              ['S1', 'Amaya', 'D1'],
              ['S2', 'Ben', 'D2'],
            ]}
          />
          <Table
            name="Department"
            cols={['DeptID', 'DeptName']}
            keyCols={[0]}
            rows={[
              ['D1', 'Computing'],
              ['D2', 'Business'],
            ]}
          />
        </div>
        <p className="nf-note">✓ In 3NF.</p>
      </section>

      {/* ── RESULT ─────────────────────────────────────────────────────── */}
      <section id="result" className="bt-sec">
        <Head eyebrow="Final design" title="Four tables, each fact stored once" />
        <div className="nf-final">
          <p>
            Student(<u>StudentID</u>, StudentName, DeptID)
          </p>
          <p>
            Department(<u>DeptID</u>, DeptName)
          </p>
          <p>
            Course(<u>CourseID</u>, CourseTitle)
          </p>
          <p>
            Enrolment(<u>StudentID</u>, <u>CourseID</u>, Grade)
          </p>
        </div>
        <div className="nf-steps">
          <div>
            <b>1NF</b> split lists into rows
          </div>
          <div>
            <b>2NF</b> remove <span style={{ color: RED }}>partial</span> dependencies
          </div>
          <div>
            <b>3NF</b> remove <span style={{ color: PURPLE }}>transitive</span> dependencies
          </div>
        </div>
      </section>

      <div style={{ height: 80 }} />
    </CoursePage>
  );
}
