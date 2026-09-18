import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';

// ─── One click, all the way down and back ─────────────────────────────────
// Type a name, press Search, and watch the whole trip: browser to server,
// server to database, and back again. Eight steps, and at every one of them
// you can see the actual thing that is moving — the request, the SQL, the
// rows, the JSON — rather than a dot sliding along a road.
//
// It replaces two earlier pieces that overlapped: a journey animation that
// only mentioned SQL in its caption, and a separate database panel that
// explained the same round trip again in words. One thing now does both,
// and the student can run it with their own search term.
//
// The server panel is the point of the whole component. It shows real code,
// with the line that is running lit up, so "the backend executes SQL" stops
// being a sentence and becomes something you watched happen. The query uses
// a ? placeholder rather than gluing the name into the string, because the
// SQL injection section further down this page is about exactly that, and it
// would be strange to teach the unsafe version here first.
//
// The packet's path is measured from the three panels rather than written in
// percentages, so the same code animates a row on a laptop and a column on a
// phone with nothing switched on or off.

const CLIENT = '#0071e3';
const SERVER = '#7c3aed';
const DB = '#0d9488';
const INK = '#1d1d1f';
const MUTED = '#6e6e73';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Machine = 'client' | 'server' | 'db';

interface Person {
  id: number;
  first: string;
  last: string;
  city: string;
}

const USERS: Person[] = [
  { id: 1, first: 'Ava', last: 'Perera', city: 'Auckland' },
  { id: 2, first: 'Ben', last: 'Silva', city: 'Wellington' },
  { id: 3, first: 'Chloe', last: 'Fonseka', city: 'Christchurch' },
  { id: 4, first: 'Ava', last: 'Jayasuriya', city: 'Hamilton' },
  { id: 5, first: 'Dilan', last: 'Mendis', city: 'Dunedin' },
];

interface Step {
  /** Where the packet starts and ends. Omitted when nothing is moving. */
  from?: Machine;
  to?: Machine;
  /** The machine doing the work when nothing is in flight. */
  at: Machine;
  /** What is written on the packet. */
  label?: (term: string, rows: number) => string;
  colour: string;
  title: string;
  text: (term: string, rows: number) => string;
  /** Which lines of the server code are running. */
  lines?: number[];
}

const STEPS: Step[] = [
  {
    at: 'client',
    colour: CLIENT,
    title: 'You press Search',
    text: () => 'Nothing has left your laptop yet. The browser just has a name typed into a box.',
  },
  {
    from: 'client',
    to: 'server',
    at: 'server',
    colour: CLIENT,
    label: term => `GET /staff?name=${term || '…'}`,
    title: 'The browser sends a note',
    text: () =>
      'It writes a short message saying what it wants and sends it off. That message is called an HTTP request. It is just text.',
  },
  {
    at: 'server',
    colour: SERVER,
    lines: [0, 1],
    title: 'The server picks it up',
    text: term => `The server runs its code. First job: pull the name out of the request. It now has "${term}".`,
  },
  {
    from: 'server',
    to: 'db',
    at: 'db',
    colour: DB,
    lines: [3, 4, 5, 6],
    label: () => 'SELECT … WHERE first_name = ?',
    title: 'The server asks the database',
    text: () =>
      'The server does not hold the data itself. It sends a question in SQL — the language databases speak. Notice the ? instead of the name: the value is handed over separately, which is what stops the attack later on this page.',
  },
  {
    at: 'db',
    colour: DB,
    title: 'The database looks',
    text: (term, rows) =>
      rows > 0
        ? `It goes down the users table and keeps the rows where the first name is "${term}". ${rows} of them match.`
        : `It goes down the users table looking for "${term}". Nothing matches — which is a perfectly good answer, not an error.`,
  },
  {
    from: 'db',
    to: 'server',
    at: 'server',
    colour: DB,
    label: (_t, rows) => `${rows} row${rows === 1 ? '' : 's'}`,
    title: 'The rows come back',
    text: (_term, rows) =>
      rows > 0
        ? 'The matching rows travel back to the server. The browser never spoke to the database — the server sat in the middle the whole time.'
        : 'Nothing comes back but an empty answer. The server still has to do something sensible with that.',
  },
  {
    from: 'server',
    to: 'client',
    at: 'client',
    colour: SERVER,
    lines: [8],
    label: () => '200 OK · JSON',
    title: 'The server replies',
    text: () =>
      'It packs the rows into JSON — plain text a browser knows how to read — and sends it back down the same wire.',
  },
  {
    at: 'client',
    colour: CLIENT,
    title: 'The page updates',
    text: (_term, rows) =>
      rows > 0
        ? 'Your browser reads the JSON and draws the list. Start to finish, the whole trip usually takes a fraction of a second.'
        : 'Your browser reads the empty list and says so. That round trip still happened in full.',
  },
];

// The server's code, as spans so the SQL can be coloured like SQL.
type Tone = 'plain' | 'key' | 'str' | 'dim';
const CODE: { text: string; tone: Tone }[][] = [
  [{ text: 'app.', tone: 'plain' }, { text: 'get', tone: 'key' }, { text: '(', tone: 'plain' }, { text: '"/staff"', tone: 'str' }, { text: ', (req, res) => {', tone: 'plain' }],
  [{ text: '  const', tone: 'key' }, { text: ' name = req.query.name', tone: 'plain' }],
  [{ text: '', tone: 'plain' }],
  [{ text: '  const', tone: 'key' }, { text: ' rows = ', tone: 'plain' }, { text: 'db.query', tone: 'key' }, { text: '(', tone: 'plain' }],
  [{ text: '    "SELECT * FROM users', tone: 'str' }],
  [{ text: '     WHERE first_name = ?"', tone: 'str' }, { text: ',', tone: 'plain' }],
  [{ text: '    [name]', tone: 'plain' }, { text: '  ', tone: 'plain' }, { text: '// filled in safely', tone: 'dim' }],
  [{ text: '  )', tone: 'plain' }],
  [{ text: '  res.', tone: 'plain' }, { text: 'json', tone: 'key' }, { text: '(rows)', tone: 'plain' }],
  [{ text: '})', tone: 'plain' }],
];

const TONE: Record<Tone, string> = {
  plain: '#e2e8f0',
  key: '#7dd3fc',
  str: '#86efac',
  dim: '#64748b',
};

const panel = (active: boolean, colour: string): CSSProperties => ({
  position: 'relative',
  zIndex: 1,
  background: '#fff',
  border: `1.5px solid ${active ? colour : 'rgba(0,0,0,0.09)'}`,
  borderRadius: 18,
  boxShadow: active ? `0 18px 40px -18px ${colour}88` : '0 8px 22px -16px rgba(0,0,0,0.35)',
  transform: active ? 'translateY(-3px)' : 'none',
  transition: 'border-color .3s ease, box-shadow .3s ease, transform .3s ease',
  overflow: 'hidden',
});

const tag = (colour: string): CSSProperties => ({
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: colour,
});

const btn = (primary: boolean, colour = CLIENT): CSSProperties => ({
  font: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  padding: '9px 18px',
  borderRadius: 999,
  cursor: 'pointer',
  border: primary ? 'none' : '1.5px solid rgba(0,0,0,0.14)',
  background: primary ? colour : '#fff',
  color: primary ? '#fff' : INK,
});

export default function RoundTrip() {
  const [term, setTerm] = useState('Ava');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const boxes = {
    client: useRef<HTMLDivElement>(null),
    server: useRef<HTMLDivElement>(null),
    db: useRef<HTMLDivElement>(null),
  };
  const [at, setAt] = useState<Record<Machine, { x: number; y: number }>>({
    client: { x: 0, y: 0 },
    server: { x: 0, y: 0 },
    db: { x: 0, y: 0 },
  });

  // Measure where the three panels actually are, so the packet and the wires
  // follow them into whatever layout the screen width produces.
  useLayoutEffect(() => {
    function measure() {
      const base = stage.current?.getBoundingClientRect();
      if (!base) return;
      const next = {} as Record<Machine, { x: number; y: number }>;
      (Object.keys(boxes) as Machine[]).forEach(key => {
        const el = boxes[key].current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        next[key] = { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
      });
      setAt(prev => ({ ...prev, ...next }));
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
    // Panels never change identity, so measuring once and on resize is enough.
  }, []);

  const matches = USERS.filter(u => u.first.toLowerCase() === term.trim().toLowerCase());
  const rows = matches.length;
  const now = STEPS[step];
  const travelling = now.from !== undefined && now.to !== undefined;

  useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStep(v => v + 1), travelling ? 1500 : 2100);
    return () => window.clearTimeout(t);
  }, [playing, step, travelling]);

  function play() {
    setStep(step >= STEPS.length - 1 ? 0 : step);
    setPlaying(true);
  }

  const done = step >= STEPS.length - 1;
  const lit = (i: number) => now.lines?.includes(i) ?? false;

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 50px -30px rgba(0,0,0,0.4)' }}>
      {/* ── The three machines ─────────────────────────────────────────── */}
      <div
        ref={stage}
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg,#f7f9ff,#eef1fb)',
          padding: 22,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(258px, 1fr))',
          gap: 22,
          alignItems: 'stretch',
        }}
      >
        {/* Wires, drawn between the measured centres so they survive a
            re-flow from three columns to one. */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} aria-hidden="true">
          {([['client', 'server'], ['server', 'db']] as [Machine, Machine][]).map(([a, b]) => {
            const live = travelling && ((now.from === a && now.to === b) || (now.from === b && now.to === a));
            return (
              <line
                key={`${a}-${b}`}
                x1={at[a].x}
                y1={at[a].y}
                x2={at[b].x}
                y2={at[b].y}
                stroke={live ? now.colour : 'rgba(0,0,0,0.13)'}
                strokeWidth={live ? 3 : 2}
                strokeDasharray={live ? '7 7' : undefined}
                strokeLinecap="round"
                style={{ transition: 'stroke .3s ease' }}
              >
                {live && <animate attributeName="stroke-dashoffset" from="28" to="0" dur="0.7s" repeatCount="indefinite" />}
              </line>
            );
          })}
        </svg>

        {/* 1 · The browser */}
        <div ref={boxes.client} style={panel(now.at === 'client', CLIENT)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 14px', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fbfbfd' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <span key={c} style={{ width: 9, height: 9, borderRadius: 999, background: c }} />
            ))}
            <span style={{ marginLeft: 6, fontSize: 11, color: MUTED, fontFamily: 'ui-monospace, Menlo, monospace' }}>staff.example.com</span>
          </div>
          <div style={{ padding: 16 }}>
            <div style={tag(CLIENT)}>1 · Your browser</div>
            <p style={{ margin: '8px 0 12px', fontSize: 13, lineHeight: 1.5, color: MUTED }}>Runs on your laptop. Holds no data of its own.</p>
            <div style={{ display: 'flex', gap: 7 }}>
              <input
                value={term}
                aria-label="First name to search for"
                onChange={e => {
                  setTerm(e.target.value);
                  setStep(0);
                  setPlaying(false);
                }}
                onKeyDown={e => e.key === 'Enter' && play()}
                placeholder="e.g. Ava"
                style={{ flex: 1, minWidth: 0, font: 'inherit', fontSize: 14, padding: '9px 13px', borderRadius: 999, border: '1.5px solid rgba(0,0,0,0.15)', outline: 'none' }}
              />
              <button type="button" onClick={play} style={btn(true, CLIENT)}>Search</button>
            </div>

            <div style={{ marginTop: 14, minHeight: 92 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#aeaeb2', marginBottom: 7 }}>What you see on the page</div>
              {!done ? (
                <div style={{ fontSize: 13, color: '#aeaeb2' }}>{step === 0 ? 'Nothing yet.' : 'Waiting for the server…'}</div>
              ) : rows ? (
                matches.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.09 }}
                    style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 12px', background: '#fbfbfd', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 10, marginBottom: 6, fontSize: 13.5 }}
                  >
                    <b style={{ color: INK }}>{r.first} {r.last}</b>
                    <span style={{ color: MUTED }}>{r.city}</span>
                  </motion.div>
                ))
              ) : (
                <div style={{ fontSize: 13.5, color: MUTED }}>No one found.</div>
              )}
            </div>
          </div>
        </div>

        {/* 2 · The server */}
        <div ref={boxes.server} style={panel(now.at === 'server', SERVER)}>
          <div style={{ padding: '14px 16px 10px' }}>
            <div style={tag(SERVER)}>2 · The server</div>
            <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.5, color: MUTED }}>Someone else&rsquo;s computer, running the app&rsquo;s code.</p>
          </div>
          <pre
            style={{
              margin: 0,
              padding: '12px 0',
              background: '#0f172a',
              fontSize: 11.5,
              lineHeight: 1.75,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              overflowX: 'auto',
            }}
          >
            {CODE.map((line, i) => (
              <div
                key={i}
                style={{
                  padding: '0 14px',
                  background: lit(i) ? 'rgba(124,58,237,0.28)' : 'transparent',
                  boxShadow: lit(i) ? `inset 3px 0 0 ${SERVER}` : 'none',
                  transition: 'background .3s ease',
                  whiteSpace: 'pre',
                }}
              >
                {line.map((sp, j) => (
                  <span key={j} style={{ color: TONE[sp.tone] }}>{sp.text}</span>
                ))}
                {line.length === 1 && line[0].text === '' ? ' ' : ''}
              </div>
            ))}
          </pre>
        </div>

        {/* 3 · The database */}
        <div ref={boxes.db} style={panel(now.at === 'db', DB)}>
          <div style={{ padding: '14px 16px 10px' }}>
            <div style={tag(DB)}>3 · The database</div>
            <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.5, color: MUTED }}>
              One table, called <b style={{ color: INK }}>users</b>. It only answers the server.
            </p>
          </div>
          <div style={{ padding: '0 12px 16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, fontFamily: 'ui-monospace, Menlo, monospace' }}>
              <thead>
                <tr>
                  {['id', 'first_name', 'last_name', 'city'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 7px', color: MUTED, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {USERS.map(u => {
                  const hit = step >= 4 && matches.some(m => m.id === u.id);
                  const missed = step >= 4 && !hit;
                  return (
                    <tr
                      key={u.id}
                      style={{
                        background: hit ? `${DB}1f` : 'transparent',
                        opacity: missed ? 0.34 : 1,
                        transition: 'background .35s ease, opacity .35s ease',
                      }}
                    >
                      <td style={{ padding: '6px 7px', color: MUTED }}>{u.id}</td>
                      <td style={{ padding: '6px 7px', color: hit ? DB : INK, fontWeight: hit ? 700 : 400 }}>{u.first}</td>
                      <td style={{ padding: '6px 7px', color: INK }}>{u.last}</td>
                      <td style={{ padding: '6px 7px', color: MUTED }}>{u.city}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* The thing that is actually moving. Keyed by step so each leg
            starts from its own origin rather than easing out of the last, and
            it stops short of the target rather than landing on top of it —
            a pill parked over the database table hides the rows the next step
            is about to highlight. */}
        {travelling && (
          <motion.div
            key={step}
            initial={{ x: lerp(at[now.from!].x, at[now.to!].x, 0.12), y: lerp(at[now.from!].y, at[now.to!].y, 0.12), opacity: 0, scale: 0.85 }}
            animate={{ x: lerp(at[now.from!].x, at[now.to!].x, 0.74), y: lerp(at[now.from!].y, at[now.to!].y, 0.74), opacity: 1, scale: 1 }}
            transition={{ duration: 1.05, ease: [0.45, 0, 0.2, 1], opacity: { duration: 0.22 }, scale: { duration: 0.22 } }}
            style={{ position: 'absolute', left: 0, top: 0, zIndex: 3, pointerEvents: 'none' }}
          >
            <div
              style={{
                transform: 'translate(-50%, -50%)',
                background: now.colour,
                color: '#fff',
                borderRadius: 999,
                padding: '7px 15px',
                fontSize: 11.5,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                fontFamily: 'ui-monospace, Menlo, monospace',
                boxShadow: `0 0 0 6px ${now.colour}22, 0 10px 24px -8px ${now.colour}cc`,
              }}
            >
              {now.label?.(term.trim(), rows)}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── What just happened ─────────────────────────────────────────── */}
      <div style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: now.colour, padding: '3px 11px', borderRadius: 999 }}>
            Step {step + 1} of {STEPS.length}
          </span>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: INK }}>{now.title}</h3>
        </div>
        <p key={step} style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.6, color: '#444', minHeight: 76, maxWidth: '68ch' }}>
          {now.text(term.trim() || '…', rows)}
        </p>

        <div style={{ display: 'flex', gap: 5, margin: '16px 0' }}>
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to step ${i + 1}`}
              onClick={() => {
                setPlaying(false);
                setStep(i);
              }}
              style={{ flex: 1, height: 5, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, background: i <= step ? now.colour : 'rgba(0,0,0,0.1)', transition: 'background .3s ease' }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <button type="button" onClick={play} style={btn(true)}>
            {playing ? 'Playing…' : done ? 'Run it again' : 'Play the whole trip'}
          </button>
          <button type="button" onClick={() => { setPlaying(false); setStep(Math.max(0, step - 1)); }} style={btn(false)}>Back</button>
          <button type="button" onClick={() => { setPlaying(false); setStep(Math.min(STEPS.length - 1, step + 1)); }} style={btn(false)}>Next step</button>
        </div>

        <p style={{ margin: '16px 0 0', fontSize: 13, lineHeight: 1.55, color: MUTED, maxWidth: '68ch' }}>
          Try a name that is not in the table — Zoe, say. The trip happens exactly the same way and comes back empty.
          That is worth seeing once: an empty result is an answer, not a failure.
        </p>
      </div>
    </div>
  );
}
