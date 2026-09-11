import { useState } from 'react';

// ─── Where the database actually sits ─────────────────────────────────────
// Beginners picture a database as a thing a website "has", and can't say
// where it lives or who's allowed to ask it questions. This walks one round
// trip — tapping "My grades" — in plain language, with a restaurant running
// alongside it, because everyone already understands a restaurant.
//
// The SQL stays. It's the subject of the course, and Lesson 2 needs
// somewhere to land. Everything else that would normally be shown as raw
// protocol is written out as the message it actually is.
//
// The point the diagram makes on its own: there's no line from the browser
// to the database. Every question goes through the server.

type Leg = 'browser' | 'request' | 'server' | 'query' | 'database' | 'response';

interface Step {
  leg: Leg;
  where: string;
  title: string;
  /** The same step, told as the restaurant. */
  like: string;
  /** A short message written out in words rather than raw protocol. */
  card?: { label: string; lines: [string, string][] };
  /** Real SQL — kept, because it's the thing the course is about. */
  code?: string;
  rows?: { paper: string; grade: string; credits: string }[];
  note: string;
}

const STEPS: Step[] = [
  {
    leg: 'browser',
    where: 'You',
    title: 'You tap “My grades”',
    like: 'You sit down and pick something off the menu.',
    card: { label: 'On screen', lines: [['A link', 'My grades']] },
    note: 'Nothing has left your phone yet, and no database anywhere has been bothered.',
  },
  {
    leg: 'request',
    where: 'Over the internet',
    title: 'Your browser sends a message',
    like: 'You tell the waiter what you want, and show the ticket with your table number on it.',
    card: {
      label: 'The message, in plain words',
      lines: [
        ['To', 'the campus website'],
        ['Asking for', 'my grades page'],
        ['Signed', 'whoever is holding pass 8f3ad9c1'],
      ],
    },
    note: 'That’s really all a web request is — a short note asking for a page. Notice there’s no mention of a database in it. Your browser doesn’t even know one exists.',
  },
  {
    leg: 'server',
    where: 'The server',
    title: 'The server works out who you are',
    like: 'The waiter checks which table the order came from. You don’t get to say “I’m table four” and be believed.',
    card: {
      label: 'What the server figures out',
      lines: [
        ['Pass 8f3ad9c1', 'belongs to Sam'],
        ['Sam', 'is student 1001'],
      ],
    },
    note: 'This is the bit that keeps everyone’s grades private. The server decides which rows you’re allowed to see. You don’t.',
  },
  {
    leg: 'query',
    where: 'Asking the database',
    title: 'The server writes a question',
    like: 'The order slip goes through to the kitchen.',
    code: 'SELECT paper, grade, credits\nFROM   enrolments\nWHERE  student_id = 1001;',
    note: 'This is SQL, and you start writing it in Lesson 2. Read it out loud and it nearly makes sense already: get the paper, grade and credits, from the enrolments table, where the student is 1001.',
  },
  {
    leg: 'database',
    where: 'The database answers',
    title: 'Three rows come back',
    like: 'The kitchen hands the food over. It never walks out to your table itself.',
    rows: [
      { paper: 'MBI801', grade: 'A-', credits: '15' },
      { paper: 'MBI802', grade: 'A', credits: '15' },
      { paper: 'MBI805B', grade: 'B+', credits: '15' },
    ],
    note: 'Just rows. The database has no idea a website asked. Ask it from a phone app or a spreadsheet and it answers exactly the same way, which is why one database can feed all of them at once.',
  },
  {
    leg: 'response',
    where: 'Back to you',
    title: 'Your grades appear',
    like: 'Plated up and carried out to you.',
    card: {
      label: 'What lands back on your screen',
      lines: [
        ['MBI801', 'A-'],
        ['MBI802', 'A'],
        ['MBI805B', 'B+'],
      ],
    },
    note: 'The server wraps those same three rows in a little code that tells your browser how to draw a table, and sends it back. The whole trip takes about as long as a blink.',
  },
];

const ACTIVE_BOX: Record<Leg, 'browser' | 'server' | 'db' | null> = {
  browser: 'browser', request: null, server: 'server', query: null, database: 'db', response: 'server',
};
const ACTIVE_ARROW: Record<Leg, 'req' | 'query' | 'back' | null> = {
  browser: null, request: 'req', server: null, query: 'query', database: null, response: 'back',
};

function Diagram({ leg }: { leg: Leg }) {
  const box = ACTIVE_BOX[leg];
  const arrow = ACTIVE_ARROW[leg];
  const on = (k: string) => (box === k ? 'var(--accent-500)' : 'var(--ink-200)');
  const fill = (k: string) => (box === k ? 'var(--accent-50)' : 'var(--paper-0)');
  const ink = (k: string) => (box === k ? 'var(--accent-700)' : 'var(--ink-900)');

  return (
    <svg viewBox="0 0 620 172" width="100%" role="img"
      aria-label="Your browser talks to the website's server, and only the server talks to the database. There is no direct line from the browser to the database.">
      <rect x="8" y="44" width="152" height="78" rx="12" fill={fill('browser')} stroke={on('browser')} strokeWidth="2" />
      <rect x="24" y="58" width="120" height="12" rx="3" fill={box === 'browser' ? 'var(--accent-200)' : 'var(--paper-200)'} />
      <text x="84" y="94" textAnchor="middle" fontSize="13" fontWeight="800" fill={ink('browser')} fontFamily="var(--font-display)">Your browser</text>
      <text x="84" y="110" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">phone or laptop</text>

      <rect x="236" y="44" width="152" height="78" rx="12" fill={fill('server')} stroke={on('server')} strokeWidth="2" />
      <text x="312" y="82" textAnchor="middle" fontSize="13" fontWeight="800" fill={ink('server')} fontFamily="var(--font-display)">The server</text>
      <text x="312" y="98" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">the website’s own computer</text>
      <text x="312" y="110" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">and the only part that knows SQL</text>

      <g>
        <path d="M464 62 v48 a46 13 0 0 0 92 0 v-48 Z" fill={fill('db')} stroke={on('db')} strokeWidth="2" />
        <ellipse cx="510" cy="62" rx="46" ry="13" fill={fill('db')} stroke={on('db')} strokeWidth="2" />
        <ellipse cx="510" cy="78" rx="46" ry="13" fill="none" stroke={on('db')} strokeWidth="1" opacity=".55" />
        <text x="510" y="102" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={ink('db')} fontFamily="var(--font-display)">Database</text>
      </g>
      <text x="510" y="138" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">where the rows live</text>

      <defs>
        <marker id="wa-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0.8 L7 4 L0 7.2 z" fill="currentColor" />
        </marker>
      </defs>

      <g color={arrow === 'req' ? 'var(--accent-500)' : 'var(--ink-300)'}>
        <path d="M164 70 h64" stroke="currentColor" strokeWidth={arrow === 'req' ? 2.4 : 1.4} fill="none" markerEnd="url(#wa-head)" />
      </g>
      <g color={arrow === 'back' ? 'var(--accent-500)' : 'var(--ink-300)'}>
        <path d="M232 98 h-64" stroke="currentColor" strokeWidth={arrow === 'back' ? 2.4 : 1.4} fill="none" markerEnd="url(#wa-head)" />
      </g>
      <text x="198" y="28" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-body)">a message</text>

      <g color={arrow === 'query' ? 'var(--accent-500)' : 'var(--ink-300)'}>
        <path d="M392 70 h64" stroke="currentColor" strokeWidth={arrow === 'query' ? 2.4 : 1.4} fill="none" markerEnd="url(#wa-head)" />
      </g>
      <g color={leg === 'database' ? 'var(--accent-500)' : 'var(--ink-300)'}>
        <path d="M460 98 h-64" stroke="currentColor" strokeWidth={leg === 'database' ? 2.4 : 1.4} fill="none" markerEnd="url(#wa-head)" />
      </g>
      <text x="426" y="28" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-mono)">SQL</text>

      <path d="M84 146 H510" stroke="var(--red-500)" strokeWidth="1.4" strokeDasharray="5 5" fill="none" opacity=".5" />
      <rect x="228" y="154" width="164" height="16" rx="8" fill="var(--paper-0)" />
      <text x="310" y="166" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--red-500)" fontFamily="var(--font-body)">no direct line</text>
    </svg>
  );
}

export default function WebAppStack() {
  const [i, setI] = useState(0);
  const step = STEPS[i];

  return (
    <div className="wa">
      <p className="wa__framing">
        Think of it as a restaurant. You’re at the table, the kitchen is out the back, and a waiter goes
        between the two. You never walk into the kitchen yourself — and that turns out to be the whole point.
      </p>

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
        <p className="bt-eyebrow">Step {i + 1} of {STEPS.length}</p>
        <h3>{step.title}</h3>

        <p className="wa__like"><span>In the restaurant</span>{step.like}</p>

        {step.card && (
          <div className="wa__slip">
            <p className="wa__slip__label">{step.card.label}</p>
            <dl>
              {step.card.lines.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        )}

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
        <p className="bt-eyebrow">So why can’t your browser just ask the database itself?</p>
        <p>
          Because anything your browser knows, you can go and look at. Right-click, view source, and there it
          is. If the database password were in there, anyone could find it and then help themselves to
          everybody’s grades, not only their own. Keeping the server in the middle means the only questions the
          database ever hears are ones the university wrote itself.
        </p>
      </div>
    </div>
  );
}
