import { useState } from 'react';

// ─── Where the database actually sits ─────────────────────────────────────
// Beginners picture a database as a thing a website "has", and cannot say
// where the SQL runs or who is allowed to send it. This walks one round
// trip — a student clicking their grades — and shows what the data looks
// like at each hop, including the SQL, so Lesson 2 has somewhere to land.
//
// The point the diagram makes on its own: there is no arrow from the
// browser to the database. Every query goes through the server, and that
// is the whole of database security in one picture.

type Leg = 'browser' | 'request' | 'server' | 'query' | 'database' | 'response';

interface Step {
  leg: Leg;
  where: string;
  title: string;
  /** Monospace payload — what is on the wire or in the engine at this moment. */
  code?: string;
  /** A result set, when the payload is rows rather than text. */
  rows?: { paper: string; grade: string; credits: string }[];
  note: string;
}

const STEPS: Step[] = [
  {
    leg: 'browser',
    where: 'Your laptop',
    title: 'You click “My grades”',
    code: 'https://campus.example.ac.nz/grades',
    note: 'A link on a page. Nothing has left your laptop yet, and no database has been touched.',
  },
  {
    leg: 'request',
    where: 'The public internet',
    title: 'The browser sends a request',
    code: 'GET /grades HTTP/1.1\nHost: campus.example.ac.nz\nCookie: session=8f3ad9c1…',
    note: 'Plain text over the network. Notice what is not in it: no SQL, no table names, no database password. The browser does not know any of those exist.',
  },
  {
    leg: 'server',
    where: 'The application server',
    title: 'The server works out who you are',
    code: 'session 8f3ad9c1…  →  student_id = 1001',
    note: 'The step that keeps everything safe. The server decides which rows you are allowed to see. You never get to say “student_id = 1002” and be believed.',
  },
  {
    leg: 'query',
    where: 'A private connection',
    title: 'The server queries the database',
    code: 'SELECT paper, grade, credits\nFROM   enrolments\nWHERE  student_id = 1001;',
    note: 'This is the SQL you start writing in Lesson 2. It travels on a connection inside the organisation that the public internet cannot reach at all.',
  },
  {
    leg: 'database',
    where: 'The database server',
    title: 'The database returns rows',
    rows: [
      { paper: 'MBI801', grade: 'A-', credits: '15' },
      { paper: 'MBI802', grade: 'A', credits: '15' },
      { paper: 'MBI805B', grade: 'B+', credits: '15' },
    ],
    note: 'Just rows. The database has no idea a website asked — it would answer a desktop app, a report or a phone the same way. That is why one database can serve all of them.',
  },
  {
    leg: 'response',
    where: 'Back to your laptop',
    title: 'Rows become a page',
    code: '<table>\n  <tr><td>MBI801</td><td>A-</td></tr>\n  <tr><td>MBI802</td><td>A</td></tr>\n  …',
    note: 'The server dresses the same rows as HTML and sends them back. Your grades appear. The database was involved for a few milliseconds in the middle.',
  },
];

const ACTIVE_BOX: Record<Leg, 'browser' | 'server' | 'db' | null> = {
  browser: 'browser',
  request: null,
  server: 'server',
  query: null,
  database: 'db',
  response: 'server',
};

const ACTIVE_ARROW: Record<Leg, 'req' | 'query' | 'back' | null> = {
  browser: null,
  request: 'req',
  server: null,
  query: 'query',
  database: null,
  response: 'back',
};

function Diagram({ leg }: { leg: Leg }) {
  const box = ACTIVE_BOX[leg];
  const arrow = ACTIVE_ARROW[leg];
  const on = (k: string) => (box === k ? 'var(--accent-500)' : 'var(--ink-200)');
  const fill = (k: string) => (box === k ? 'var(--accent-50)' : 'var(--paper-0)');
  const ink = (k: string) => (box === k ? 'var(--accent-700)' : 'var(--ink-900)');

  return (
    <svg viewBox="0 0 620 168" width="100%" role="img"
      aria-label="A browser talks to an application server, and only the application server talks to the database. There is no direct arrow from the browser to the database.">
      {/* Browser */}
      <rect x="8" y="42" width="150" height="76" rx="12" fill={fill('browser')} stroke={on('browser')} strokeWidth="2" />
      <rect x="24" y="56" width="118" height="12" rx="3" fill={box === 'browser' ? 'var(--accent-200)' : 'var(--paper-200)'} />
      <text x="83" y="92" textAnchor="middle" fontSize="13" fontWeight="800" fill={ink('browser')} fontFamily="var(--font-display)">Browser</text>
      <text x="83" y="108" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">your laptop</text>

      {/* Application server */}
      <rect x="235" y="42" width="150" height="76" rx="12" fill={fill('server')} stroke={on('server')} strokeWidth="2" />
      <text x="310" y="80" textAnchor="middle" fontSize="13" fontWeight="800" fill={ink('server')} fontFamily="var(--font-display)">App server</text>
      <text x="310" y="96" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">the code, and the</text>
      <text x="310" y="108" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">only thing holding SQL</text>

      {/* Database, drawn as the cylinder everyone recognises */}
      <g>
        <path d="M462 60 v48 a46 13 0 0 0 92 0 v-48 Z" fill={fill('db')} stroke={on('db')} strokeWidth="2" />
        <ellipse cx="508" cy="60" rx="46" ry="13" fill={fill('db')} stroke={on('db')} strokeWidth="2" />
        <ellipse cx="508" cy="76" rx="46" ry="13" fill="none" stroke={on('db')} strokeWidth="1" opacity=".55" />
        <text x="508" y="100" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={ink('db')} fontFamily="var(--font-display)">Database</text>
      </g>
      <text x="508" y="136" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">tables, rows, keys</text>

      <defs>
        <marker id="wa-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0.8 L7 4 L0 7.2 z" fill="currentColor" />
        </marker>
      </defs>

      {/* Browser ↔ server */}
      <g color={arrow === 'req' ? 'var(--accent-500)' : 'var(--ink-300)'}>
        <path d="M162 68 h64" stroke="currentColor" strokeWidth={arrow === 'req' ? 2.4 : 1.4} fill="none" markerEnd="url(#wa-head)" />
      </g>
      <g color={arrow === 'back' ? 'var(--accent-500)' : 'var(--ink-300)'}>
        <path d="M231 96 h-64" stroke="currentColor" strokeWidth={arrow === 'back' ? 2.4 : 1.4} fill="none" markerEnd="url(#wa-head)" />
      </g>
      <text x="196" y="26" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-mono)">HTTP</text>

      {/* Server ↔ database */}
      <g color={arrow === 'query' ? 'var(--accent-500)' : 'var(--ink-300)'}>
        <path d="M389 68 h64" stroke="currentColor" strokeWidth={arrow === 'query' ? 2.4 : 1.4} fill="none" markerEnd="url(#wa-head)" />
      </g>
      <g color={leg === 'database' ? 'var(--accent-500)' : 'var(--ink-300)'}>
        <path d="M458 96 h-64" stroke="currentColor" strokeWidth={leg === 'database' ? 2.4 : 1.4} fill="none" markerEnd="url(#wa-head)" />
      </g>
      <text x="423" y="26" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-mono)">SQL</text>

      {/* The arrow that does not exist */}
      <path d="M83 142 H508" stroke="var(--red-500)" strokeWidth="1.4" strokeDasharray="5 5" fill="none" opacity=".5" />
      <rect x="214" y="150" width="192" height="16" rx="8" fill="var(--paper-0)" />
      <text x="310" y="162" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--red-500)" fontFamily="var(--font-body)">no such connection</text>
    </svg>
  );
}

export default function WebAppStack() {
  const [i, setI] = useState(0);
  const step = STEPS[i];

  return (
    <div className="wa">
      <div className="wa__diagram"><Diagram leg={step.leg} /></div>

      <ol className="wa__rail">
        {STEPS.map((s, k) => (
          <li key={s.title}>
            <button
              type="button"
              className={`wa__node${k === i ? ' wa__node--on' : ''}${k < i ? ' wa__node--done' : ''}`}
              aria-current={k === i}
              onClick={() => setI(k)}
            >
              <span className="wa__num bt-tnum">{k + 1}</span>
              <span className="wa__where">{s.where}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="wa__panel">
        <p className="bt-eyebrow">Step {i + 1} of {STEPS.length} · {step.where}</p>
        <h3>{step.title}</h3>

        {step.code && <pre className="wa__code">{step.code}</pre>}

        {step.rows && (
          <div className="bt-scroll">
            <table className="wa__rows">
              <thead><tr><th>paper</th><th>grade</th><th>credits</th></tr></thead>
              <tbody>
                {step.rows.map(r => (
                  <tr key={r.paper}><td>{r.paper}</td><td>{r.grade}</td><td className="bt-tnum">{r.credits}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="wa__note">{step.note}</p>

        <div className="wa__nav">
          <button type="button" className="bt-btn bt-btn--tertiary bt-btn--sm" disabled={i === 0} onClick={() => setI(k => Math.max(0, k - 1))}>
            Back
          </button>
          <button type="button" className="bt-btn bt-btn--sm" disabled={i === STEPS.length - 1} onClick={() => setI(k => Math.min(STEPS.length - 1, k + 1))}>
            Next
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="wa__why">
        <p className="bt-eyebrow">Why not let the browser talk to the database directly?</p>
        <p>
          Because anything your browser holds, you can read — and so can anyone using your laptop. The database
          username and password would be sitting in the page source, and whoever found them could run any query
          they liked against every student’s record, not just yours. Putting a server in the middle means the
          only SQL the database ever sees is SQL your organisation wrote.
        </p>
      </div>
    </div>
  );
}
