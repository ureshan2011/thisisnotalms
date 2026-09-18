// WebArchitectureLesson.tsx
// MBI802 · Database & Web Systems
// "Client, Server & Databases — how a website actually works" — beginner friendly
//
// A public, self-contained, highly interactive lesson. It teaches absolute
// beginners what runs on YOUR computer vs. the company's computer, how a website
// talks to a database, and why validating data is the single most important
// security habit a developer can build. A sorting game, one animated round trip
// that carries a real search all the way to the database and back, and a
// safe-by-design "attack lab" that shows exactly why input validation matters.
//
// Part 2 used to be two things: a journey animation that only mentioned SQL in
// its caption, and a separate panel re-explaining the same round trip in words.
// RoundTrip (../webarch/RoundTrip.tsx) now does both, with the server's code on
// screen and the line running the query lit up as it runs.
//
// House style matches SystemsSecurityLesson: white canvas, soft cards,
// reveal-on-scroll, Apple-like type.

import { useState, useEffect, useRef } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import RoundTrip from '../webarch/RoundTrip';

// ── Design tokens ─────────────────────────────────────────────────────────────

const CLIENT = '#0071e3'; // blue   — the browser / your device
const SERVER = '#7c3aed'; // purple — the web server
const DB     = '#0d9488'; // teal   — the database
const DANGER = '#e5484d'; // red    — attacks / invalid data
const SAFE   = '#30a46c'; // green  — validated / safe
const WARN   = '#f59e0b'; // amber  — caution
const ACCENT = '#2563eb'; // primary

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

// ════════════════════════════════════════════════════════════════════════════
//  1 · CLIENT vs SERVER — the two computers
// ════════════════════════════════════════════════════════════════════════════

function ClientServerScene() {
  const [side, setSide] = useState<'client' | 'server'>('client');
  const isClient = side === 'client';
  const info = isClient
    ? {
        color: CLIENT, icon: '💻', title: 'The CLIENT — your device',
        sub: 'The browser on your phone or laptop',
        does: [
          'Shows the page (HTML, colours, layout)',
          'Reacts instantly to clicks & typing',
          'Plays animations and validates the form for a friendly feel',
          'Sends requests to the server when it needs real data',
        ],
        cant: 'It can NOT be trusted with secrets. Anyone can open it and change what it does.',
      }
    : {
        color: SERVER, icon: '🖥️', title: 'The SERVER — the company\'s computer',
        sub: 'A computer running somewhere in a data centre, 24/7',
        does: [
          'Runs the real business logic (prices, permissions, payments)',
          'Talks to the database to read & save data',
          'Checks that every request is allowed and valid',
          'Sends back a response (a page, or data as JSON)',
        ],
        cant: 'This is the source of truth. It must re-check everything the client tells it.',
      };

  return (
    <div>
      {/* the two boxes connected by a wire */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <button onClick={() => setSide('client')} style={machineBox(isClient, CLIENT)}>
          <div style={{ fontSize: 44 }}>💻</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 6 }}>Client</div>
          <div style={{ fontSize: 12.5, color: '#6e6e73', marginTop: 2 }}>your browser</div>
        </button>

        <div style={{ textAlign: 'center', color: '#aeaeb2', minWidth: 96 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: isClient ? CLIENT : SERVER }}>
            {isClient ? 'request ›' : '‹ response'}
          </div>
          <div style={{ height: 2, background: 'linear-gradient(90deg,#0071e3,#7c3aed)', borderRadius: 2, margin: '8px 0' }} />
          <div style={{ fontSize: 11, fontWeight: 600 }}>the internet</div>
        </div>

        <button onClick={() => setSide('server')} style={machineBox(!isClient, SERVER)}>
          <div style={{ fontSize: 44 }}>🖥️</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 6 }}>Server</div>
          <div style={{ fontSize: 12.5, color: '#6e6e73', marginTop: 2 }}>+ database</div>
        </button>
      </div>

      <Card key={side} style={{ animation: 'waFade 0.35s ease', borderColor: info.color + '33', background: info.color + '08' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32 }}>{info.icon}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1d1d1f' }}>{info.title}</h3>
            <div style={{ fontSize: 13.5, color: '#6e6e73' }}>{info.sub}</div>
          </div>
        </div>
        <ul style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {info.does.map((d, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.5, color: '#333' }}>
              <span style={{ color: info.color, fontWeight: 800 }}>•</span>{d}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 14, padding: '11px 14px', borderRadius: 12, background: '#fff', border: `1px solid ${info.color}22`, fontSize: 13.5, lineHeight: 1.5, color: '#444' }}>
          <b style={{ color: info.color }}>Key idea — </b>{info.cant}
        </div>
      </Card>
    </div>
  );
}

function machineBox(active: boolean, color: string): CSSProperties {
  return {
    cursor: 'pointer', font: 'inherit', textAlign: 'center',
    border: `2px solid ${active ? color : 'rgba(0,0,0,0.1)'}`,
    background: active ? color + '0e' : '#fff',
    borderRadius: 20, padding: '18px 10px', transition: 'all 0.25s ease',
  };
}

// ── Sorting game: who does this job? ──────────────────────────────────────────

const JOBS = [
  { t: 'Animate a button when you hover it', a: 'client' },
  { t: 'Check your password is correct', a: 'server' },
  { t: 'Store your order forever', a: 'server' },
  { t: 'Show a red outline on an empty box', a: 'client' },
  { t: 'Decide if you are allowed to see admin pages', a: 'server' },
  { t: 'Scroll the page smoothly', a: 'client' },
  { t: 'Charge your credit card', a: 'server' },
  { t: 'Hide a menu until you tap it', a: 'client' },
] as const;

function SortingGame() {
  const [picks, setPicks] = useState<Record<number, 'client' | 'server'>>({});
  const [checked, setChecked] = useState(false);
  const score = JOBS.reduce((acc, j, i) => acc + (picks[i] === j.a ? 1 : 0), 0);
  const allDone = Object.keys(picks).length === JOBS.length;

  return (
    <Card>
      <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.6, color: '#6e6e73' }}>
        Tap <b style={{ color: CLIENT }}>Client</b> or <b style={{ color: SERVER }}>Server</b> for each job — then check your answers.
        A handy rule: <i>anything to do with looks &amp; feel is the client; anything to do with truth, money or storage is the server.</i>
      </p>
      <div style={{ display: 'grid', gap: 8 }}>
        {JOBS.map((j, i) => {
          const pick = picks[i];
          const right = checked && pick === j.a;
          const wrong = checked && pick && pick !== j.a;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
              padding: '10px 14px', borderRadius: 14, background: '#fff',
              border: `1.5px solid ${right ? SAFE : wrong ? DANGER : 'rgba(0,0,0,0.08)'}`,
              transition: 'border-color 0.2s ease',
            }}>
              <span style={{ flex: 1, minWidth: 180, fontSize: 14.5, color: '#333' }}>{j.t}</span>
              {(['client', 'server'] as const).map(s => {
                const on = pick === s;
                const c = s === 'client' ? CLIENT : SERVER;
                return (
                  <button key={s} onClick={() => !checked && setPicks(p => ({ ...p, [i]: s }))}
                    style={{
                      cursor: checked ? 'default' : 'pointer', font: 'inherit', fontSize: 12.5, fontWeight: 700,
                      textTransform: 'capitalize', padding: '6px 14px', borderRadius: 999,
                      border: `1.5px solid ${on ? c : 'rgba(0,0,0,0.12)'}`,
                      background: on ? c : '#fff', color: on ? '#fff' : '#6e6e73',
                      transition: 'all 0.15s ease',
                    }}>
                    {s}
                  </button>
                );
              })}
              {checked && (
                <span style={{ fontSize: 16, color: right ? SAFE : DANGER }}>{right ? '✓' : '✗'}</span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, flexWrap: 'wrap' }}>
        {!checked ? (
          <button onClick={() => setChecked(true)} disabled={!allDone}
            style={{ ...navBtn(true), opacity: allDone ? 1 : 0.4, cursor: allDone ? 'pointer' : 'not-allowed' }}>
            {allDone ? 'Check answers' : 'Answer all to check'}
          </button>
        ) : (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, color: score >= 7 ? SAFE : score >= 5 ? WARN : DANGER }}>
              {score} / {JOBS.length} {score === JOBS.length ? '🏆' : score >= 5 ? '👍' : '📚'}
            </div>
            <button onClick={() => { setChecked(false); setPicks({}); }} style={navBtn(false)}>↻ Try again</button>
          </>
        )}
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  4 · WHY DATA VALIDATION MATTERS  (the safe-by-design attack lab)
// ════════════════════════════════════════════════════════════════════════════

// 3a · Client-only validation can be bypassed
function BypassDemo() {
  const [age, setAge] = useState('15');
  const [tampered, setTampered] = useState(false);
  const n = parseInt(age || '0', 10);
  const clientPass = tampered || n >= 18;       // a tamperer can force the client to "pass"
  const serverPass = n >= 18;                    // the server re-checks the real value

  return (
    <Card>
      <p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.6, color: '#444' }}>
        This form is "18 or older only". The <b style={{ color: CLIENT }}>client</b> checks your age for a nice experience —
        but a determined user can open the browser tools and <b>switch that check off</b>. Watch what happens when only the client validates.
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#6e6e73' }}>Your age:</label>
        <input value={age} onChange={e => setAge(e.target.value.replace(/\D/g, ''))} inputMode="numeric"
          style={{ width: 80, font: 'inherit', fontSize: 15, padding: '8px 12px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.15)' }} />
        <button onClick={() => setTampered(t => !t)}
          style={{ ...navBtn(tampered, DANGER), fontSize: 13 }}>
          {tampered ? '🐱‍💻 Tampering ON' : '🛠️ Tamper with the page'}
        </button>
      </div>
      <p style={{ margin: '0 0 18px', fontSize: 12.5, color: '#aeaeb2', fontStyle: 'italic' }}>
        ("Tamper" simulates a user editing your client-side code in the browser — something you can never stop them doing.)
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <ValBox
          title="Client-only validation"
          color={DANGER}
          pass={clientPass}
          good={false}
          line={clientPass ? '✅ Form submitted — "you\'re 18+"' : '🚫 Blocked on your screen'}
          note={tampered ? 'The user switched the check off. A 15-year-old just got through — because the client can\'t be trusted.' : 'Looks fine… until someone tampers with it.'}
        />
        <ValBox
          title="Server also validates"
          color={SAFE}
          pass={serverPass}
          good
          line={serverPass ? '✅ Accepted — server confirmed 18+' : '🚫 Rejected by the server'}
          note={serverPass ? 'The real age was 18+, so the server agrees.' : 'Even with the client tampered, the server re-checked the real value and refused. Safe.'}
        />
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: ACCENT + '0c', border: `1px solid ${ACCENT}33`, fontSize: 14, lineHeight: 1.55, color: '#333' }}>
        <b style={{ color: ACCENT }}>The golden rule — </b>validate on the client for a <i>friendly</i> experience, but <b>always validate again on the server for safety</b>. Never trust data coming from the browser.
      </div>
    </Card>
  );
}

function ValBox({ title, color, pass, good, line, note }: { title: string; color: string; pass: boolean; good: boolean; line: string; note: string }) {
  const dangerous = !good && pass; // got through when it shouldn't be trusted
  return (
    <div style={{ borderRadius: 16, padding: 18, background: '#fff', border: `1.5px solid ${dangerous ? DANGER : color}33` }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: dangerous ? DANGER : color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
      <div style={{ margin: '12px 0', fontSize: 16, fontWeight: 700, color: dangerous ? DANGER : pass ? SAFE : '#6e6e73' }}>{line}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: '#6e6e73' }}>{note}</div>
    </div>
  );
}

// 3b · SQL Injection — string-built query vs parameterised
type LoginMode = 'naive' | 'safe';

function SqlInjectionDemo() {
  const [user, setUser] = useState("admin' --");
  const [mode, setMode] = useState<LoginMode>('naive');

  // The "real" account in our pretend database.
  const REAL = { user: 'admin', pass: 'hunter2' };
  const looksLikeInjection = /('|--|\bOR\b|=)/i.test(user);

  // Build what the database actually receives, then decide the outcome.
  let query: ReactNode;
  let outcome: { ok: boolean; head: string; body: string };

  if (mode === 'naive') {
    // The app glues your text straight into the SQL string — dangerous.
    query = (
      <>
        <span style={{ color: '#7dd3fc' }}>SELECT</span> * <span style={{ color: '#7dd3fc' }}>FROM</span> users{'\n'}
        <span style={{ color: '#7dd3fc' }}>WHERE</span> user = <span style={{ color: looksLikeInjection ? '#fca5a5' : '#86efac' }}>'{user}'</span> <span style={{ color: '#7dd3fc' }}>AND</span> pass = <span style={{ color: '#86efac' }}>'•••••'</span>;
      </>
    );
    if (user.includes('--') || /'\s*OR\s*'?1'?\s*=\s*'?1/i.test(user) || user.includes("' OR '")) {
      outcome = { ok: true, head: '🔓 Logged in as admin — with NO password!', body: 'Your text closed the quote and commented out the password check (-- ). The database obeyed it as a command. This is SQL injection, the #1 web vulnerability for years.' };
    } else if (user === REAL.user) {
      outcome = { ok: false, head: '🔒 Password required', body: 'A normal username — the password check still applies. (Now try the injection preset to see the danger.)' };
    } else {
      outcome = { ok: false, head: '🚫 No such user', body: 'No matching row.' };
    }
  } else {
    // Parameterised query: your text is sent as DATA, never as code.
    query = (
      <>
        <span style={{ color: '#7dd3fc' }}>SELECT</span> * <span style={{ color: '#7dd3fc' }}>FROM</span> users{'\n'}
        <span style={{ color: '#7dd3fc' }}>WHERE</span> user = <span style={{ color: '#fcd34d' }}>?</span> <span style={{ color: '#7dd3fc' }}>AND</span> pass = <span style={{ color: '#fcd34d' }}>?</span>;{'\n'}
        <span style={{ color: '#64748b' }}>-- ? is filled with your text as plain DATA</span>
      </>
    );
    outcome = looksLikeInjection
      ? { ok: false, head: '🚫 Access denied', body: `The database searched for a user literally named "${user}" — quotes, dashes and all — and found nobody. The attack became harmless text.` }
      : user === REAL.user
        ? { ok: false, head: '🔒 Password required', body: 'Valid username, but the password still has to match. Safe and correct.' }
        : { ok: false, head: '🚫 No such user', body: 'No matching row.' };
  }

  return (
    <Card>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {(['naive', 'safe'] as const).map(m => {
          const on = mode === m;
          const c = m === 'naive' ? DANGER : SAFE;
          return (
            <button key={m} onClick={() => setMode(m)}
              style={{ ...navBtn(on, c), fontSize: 13.5 }}>
              {m === 'naive' ? '⚠️ Naive code (glues text into SQL)' : '🛡️ Safe code (parameterised)'}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 8 }}>The login form</div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#6e6e73' }}>Username</label>
          <input value={user} onChange={e => setUser(e.target.value)}
            style={{ width: '100%', font: 'inherit', fontSize: 15, padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.15)', margin: '4px 0 10px', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setUser("admin' --")} style={presetBtn}>😈 Try the attack: admin' --</button>
            <button onClick={() => setUser("' OR '1'='1")} style={presetBtn}>😈 ' OR '1'='1</button>
            <button onClick={() => setUser('admin')} style={presetBtn}>😇 normal: admin</button>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 8 }}>What the database receives</div>
          <pre style={{ margin: 0, padding: '14px 16px', borderRadius: 12, background: '#0f172a', color: '#e2e8f0', fontSize: 13, lineHeight: 1.6, overflowX: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
            {query}
          </pre>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 14, background: outcome.ok ? DANGER + '0e' : SAFE + '0c', border: `1.5px solid ${outcome.ok ? DANGER : SAFE}33` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: outcome.ok ? DANGER : SAFE }}>{outcome.head}</div>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: '#444', marginTop: 6 }}>{outcome.body}</div>
      </div>
    </Card>
  );
}

const presetBtn: CSSProperties = {
  cursor: 'pointer', font: 'inherit', fontSize: 12, fontWeight: 600, padding: '6px 10px',
  borderRadius: 999, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#444',
};

// 3c · XSS — escaping user content (simulated safely, nothing really runs)
function XssDemo() {
  const [comment, setComment] = useState('<img src=x onerror="stealCookies()">');
  const [mode, setMode] = useState<'naive' | 'safe'>('naive');
  const hasTag = /<[^>]+>/.test(comment);
  const hasScript = /<\s*(script|img|svg|on\w+=)/i.test(comment);

  return (
    <Card>
      <p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.6, color: '#444' }}>
        A comment box on a website. If the server stores your text and the page later prints it <i>as HTML</i>, an attacker can
        sneak in code that runs in <b>other people's</b> browsers — stealing their session. That's <b>Cross-Site Scripting (XSS)</b>.
        The fix is to <b>escape</b> the text so it's shown as plain characters.
      </p>

      <input value={comment} onChange={e => setComment(e.target.value)}
        style={{ width: '100%', font: 'inherit', fontSize: 15, padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.15)', margin: '0 0 12px', boxSizing: 'border-box' }} />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {(['naive', 'safe'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ ...navBtn(mode === m, m === 'naive' ? DANGER : SAFE), fontSize: 13.5 }}>
            {m === 'naive' ? '⚠️ Printed as HTML' : '🛡️ Escaped as text'}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: '#aeaeb2', marginBottom: 8 }}>How the comment appears on the page:</div>
      {mode === 'naive' ? (
        <div style={{ padding: 16, borderRadius: 12, border: `1.5px solid ${DANGER}44`, background: DANGER + '08' }}>
          {hasScript ? (
            <div style={{ fontSize: 14, lineHeight: 1.55, color: DANGER, fontWeight: 600 }}>
              💥 The browser would try to RUN this as code. In a real naive site, "stealCookies()" could now run in every visitor's browser and hijack their account.
            </div>
          ) : hasTag ? (
            <div style={{ fontSize: 14, color: WARN }}>⚠️ The browser treats your &lt;tags&gt; as real HTML — already a foothold for an attacker.</div>
          ) : (
            <div style={{ fontSize: 14, color: '#444' }}>{comment || <span style={{ color: '#aeaeb2' }}>(empty)</span>}</div>
          )}
          <div style={{ fontSize: 12, color: '#aeaeb2', marginTop: 8, fontStyle: 'italic' }}>(We're describing what would happen — nothing is actually executed here.)</div>
        </div>
      ) : (
        <div style={{ padding: 16, borderRadius: 12, border: `1.5px solid ${SAFE}44`, background: SAFE + '08' }}>
          <div style={{ fontSize: 14, lineHeight: 1.55, color: '#1d1d1f', fontFamily: 'ui-monospace, monospace' }}>
            {comment || <span style={{ color: '#aeaeb2' }}>(empty)</span>}
          </div>
          <div style={{ fontSize: 13, color: SAFE, marginTop: 10, fontWeight: 600 }}>
            ✅ Shown exactly as typed — the &lt; and &gt; are escaped into harmless characters, so nothing runs. Just a weird-looking comment.
          </div>
        </div>
      )}
    </Card>
  );
}

// 3d · validation checklist
const VALIDATION_RULES = [
  { icon: '✅', t: 'Validate on the server', d: 'The browser can be edited by anyone. The server is the only place a check truly counts.' },
  { icon: '🎯', t: 'Allow-list, don\'t deny-list', d: 'Say exactly what good looks like ("digits only, 1–3 of them"), instead of trying to ban every bad thing.' },
  { icon: '🧱', t: 'Use parameterised queries', d: 'Never glue user text into SQL. Use placeholders (?) so input is always data, never commands.' },
  { icon: '🧼', t: 'Escape output', d: 'When showing user text on a page, escape it so < > & become harmless characters.' },
  { icon: '📏', t: 'Check type, length & range', d: 'An age is a number 0–120; an email has a shape; a name has a sensible length. Reject the rest.' },
  { icon: '🔒', t: 'Fail safely', d: 'When in doubt, reject. A blocked honest user is annoying; an allowed attacker is a breach.' },
];

// ════════════════════════════════════════════════════════════════════════════
//  5 · FINAL CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

const QUIZ = [
  {
    q: 'A smooth hover animation on a button — where does it run?',
    options: ['On the server', 'On the client (browser)', 'In the database', 'On the internet cable'],
    answer: 1,
    why: 'Look & feel lives on the client. Animations run in the visitor\'s browser, with no server needed.',
  },
  {
    q: 'Your website needs to show a list of users. Who actually fetches them from storage?',
    options: ['The browser reads the database directly', 'The server queries the database, then replies to the browser', 'The internet stores the users', 'The user types them in each time'],
    answer: 1,
    why: 'The browser never touches the database. The server is the gatekeeper that runs the query and returns the result.',
  },
  {
    q: 'You added an "age must be 18+" check in the browser only. Is that safe?',
    options: ['Yes, the browser can\'t be changed', 'No — a user can bypass client checks, so the server must re-validate', 'Only on phones', 'Yes, if you use a strong password'],
    answer: 1,
    why: 'Client checks are for friendliness and can always be bypassed. Real safety requires the server to validate again.',
  },
  {
    q: "Typing  admin' --  into a login box logs you in with no password. What flaw is this?",
    options: ['Cross-site scripting', 'A weak password', 'SQL injection (text glued into the query)', 'A slow internet connection'],
    answer: 2,
    why: 'The input was concatenated into the SQL string, so it ran as a command. Parameterised queries prevent this.',
  },
  {
    q: 'A comment box lets people post <script> tags that then run for other visitors. The fix is to…',
    options: ['Make the page load faster', 'Escape the output so tags show as plain text', 'Use a bigger database', 'Hide the comment box on mobile'],
    answer: 1,
    why: 'Escaping output turns < and > into harmless characters, so user text is displayed, never executed. That stops XSS.',
  },
];

function FinalQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const score = answers.reduce((acc: number, a, i) => acc + (a === QUIZ[i].answer ? 1 : 0), 0);

  return (
    <Card style={{ background: '#fff' }}>
      {QUIZ.map((item, qi) => (
        <div key={qi} style={{ marginBottom: 26, paddingBottom: qi < QUIZ.length - 1 ? 26 : 0, borderBottom: qi < QUIZ.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f', lineHeight: 1.5 }}>
            <span style={{ color: ACCENT, fontWeight: 700 }}>{qi + 1}. </span>{item.q}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginTop: 12 }}>
            {item.options.map((opt, oi) => {
              const picked = answers[qi] === oi;
              let bg = '#fff', bd = 'rgba(0,0,0,0.12)', col = '#1d1d1f';
              if (submitted) {
                if (oi === item.answer) { bg = `${SAFE}12`; bd = SAFE; col = SAFE; }
                else if (picked) { bg = `${DANGER}12`; bd = DANGER; col = DANGER; }
              } else if (picked) { bg = `${ACCENT}10`; bd = ACCENT; col = ACCENT; }
              return (
                <button key={oi} onClick={() => !submitted && setAnswers(prev => prev.map((v, i) => (i === qi ? oi : v)))} disabled={submitted}
                  style={{ cursor: submitted ? 'default' : 'pointer', font: 'inherit', fontSize: 14, fontWeight: 600, textAlign: 'left', border: `1.5px solid ${bd}`, background: bg, color: col, borderRadius: 12, padding: '11px 14px', transition: 'all 0.2s ease' }}>
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.55, color: '#6e6e73' }}>
              <b style={{ color: answers[qi] === item.answer ? SAFE : DANGER }}>{answers[qi] === item.answer ? '✓ Correct. ' : '✗ '}</b>{item.why}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={answers.some(a => a === null)}
          style={{ ...navBtn(true), opacity: answers.some(a => a === null) ? 0.4 : 1, cursor: answers.some(a => a === null) ? 'not-allowed' : 'pointer' }}>
          {answers.some(a => a === null) ? 'Answer all five to submit' : 'Submit answers'}
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: score >= 4 ? SAFE : score >= 3 ? WARN : DANGER }}>
            {score} / {QUIZ.length} {score === QUIZ.length ? '🏆' : score >= 3 ? '👍' : '📚'}
          </div>
          <button onClick={() => { setSubmitted(false); setAnswers(Array(QUIZ.length).fill(null)); }} style={navBtn(false)}>↻ Retake</button>
        </div>
      )}
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  6 · RESOURCES & SIMULATIONS
// ════════════════════════════════════════════════════════════════════════════

const RESOURCES = [
  { tag: 'Watch', color: CLIENT, title: 'How the Internet Works in 5 min', who: 'Aaron Titus · YouTube', href: 'https://www.youtube.com/watch?v=7_LPdttKXPc', body: 'A friendly animated overview of clients, servers and requests.' },
  { tag: 'Read', color: SERVER, title: 'How the Web works', who: 'MDN Web Docs', href: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works', body: 'The classic beginner explainer of client, server, DNS and HTTP.' },
  { tag: 'Read', color: DB, title: 'Client-Server model, explained simply', who: 'freeCodeCamp', href: 'https://www.freecodecamp.org/news/client-server-architecture/', body: 'Clear words and diagrams for the two-computer model.' },
  { tag: 'Play', color: SAFE, title: 'SQL Murder Mystery', who: 'Knight Lab', href: 'https://mystery.knightlab.com/', body: 'Learn to write real database queries by solving a crime. Genuinely fun.' },
  { tag: 'Play', color: WARN, title: 'SQLBolt — interactive SQL', who: 'sqlbolt.com', href: 'https://sqlbolt.com/', body: 'Write queries in your browser, lesson by lesson. No setup.' },
  { tag: 'Hack (legally)', color: DANGER, title: 'Web Security Academy', who: 'PortSwigger', href: 'https://portswigger.net/web-security', body: 'Free, world-class labs on SQL injection, XSS & more — in a safe sandbox.' },
  { tag: 'Reference', color: ACCENT, title: 'Input Validation Cheat Sheet', who: 'OWASP', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html', body: 'The professional checklist for validating data the right way.' },
  { tag: 'Reference', color: '#64748b', title: 'OWASP Top 10', who: 'owasp.org', href: 'https://owasp.org/www-project-top-ten/', body: 'The ten most critical web security risks — injection and validation lead the list.' },
];

function Resources() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
      {RESOURCES.map(r => (
        <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', textDecoration: 'none', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 18, padding: 20, transition: 'all 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = r.color + '66'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'none'; }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff', background: r.color, padding: '3px 10px', borderRadius: 999 }}>{r.tag}</span>
          <div style={{ fontSize: 16.5, fontWeight: 700, color: '#1d1d1f', margin: '12px 0 4px' }}>{r.title}</div>
          <div style={{ fontSize: 12.5, color: r.color, fontWeight: 600, marginBottom: 8 }}>{r.who}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: '#6e6e73' }}>{r.body}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: r.color, marginTop: 10 }}>Open ↗</div>
        </a>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════════════════

export default function WebArchitectureLesson() {
  return (
    <div>
      <style>{`@keyframes waFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

      {/* intro */}
      <Section style={{ marginBottom: 72 }}>
        <Reveal>
          <p style={{ fontSize: 19, lineHeight: 1.7, color: '#1d1d1f', maxWidth: 720, fontWeight: 450 }}>
            Every website you've ever used is really <b>two computers having a conversation</b>: the one in your hand
            (the <b style={{ color: CLIENT }}>client</b>) and one in a data centre far away (the <b style={{ color: SERVER }}>server</b>),
            with a <b style={{ color: DB }}>database</b> behind it remembering everything.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#6e6e73', maxWidth: 720, marginTop: 16 }}>
            This lesson is built to be <i>played with</i>. You'll sort jobs between the two computers, follow one
            search all the way to the database and back, then step into a safe "attack lab" where you break a careless
            app with your own hands and find out why <b>checking what people type</b> matters so much. No setup, no
            logins. Start anywhere.
          </p>
        </Reveal>
      </Section>

      {/* 1 — client vs server */}
      <Section>
        <SectionHeader kicker="Part 1 · The two computers" color={CLIENT}
          title="Client and server — who does what?"
          blurb="Two computers, and each has its own job. Tap each one to see what it does, then try sorting a few jobs between them." />
        <ClientServerScene />
        <Reveal style={{ marginTop: 18 }}>
          <SortingGame />
        </Reveal>
      </Section>

      {/* 2 — the round trip, database and all */}
      <Section>
        <SectionHeader kicker="Part 2 · The round trip" color={SERVER}
          title="What happens when you press Search"
          blurb="Type a name, press play, and follow it the whole way — out of your browser, into the server, down to the database and back. Keep an eye on the server's code: the line that runs the SQL lights up as it runs." />
        <RoundTrip />
      </Section>

      {/* 4 — validation lab */}
      <Section>
        <SectionHeader kicker="Part 3 · The security lab" color={DANGER}
          title="Why data validation matters — try to break it"
          blurb="Most web hacks start with something a person typed into a box. In these three demos you break a careless app yourself, then watch the same attack bounce off one that checks what it is given." />

        <Reveal>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: '#1d1d1f', margin: '8px 0 4px' }}>3a · Client checks can be bypassed</h3>
          <p style={{ fontSize: 14.5, color: '#6e6e73', lineHeight: 1.6, margin: '0 0 14px', maxWidth: 700 }}>
            Why a check in the browser is never enough on its own.
          </p>
        </Reveal>
        <BypassDemo />

        <Reveal style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: '#1d1d1f', margin: '8px 0 4px' }}>3b · SQL injection</h3>
          <p style={{ fontSize: 14.5, color: '#6e6e73', lineHeight: 1.6, margin: '0 0 14px', maxWidth: 700 }}>
            What happens when user text is glued straight into a database query — and the one-line fix that stops it cold.
          </p>
        </Reveal>
        <SqlInjectionDemo />

        <Reveal style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: '#1d1d1f', margin: '8px 0 4px' }}>3c · Cross-site scripting (XSS)</h3>
          <p style={{ fontSize: 14.5, color: '#6e6e73', lineHeight: 1.6, margin: '0 0 14px', maxWidth: 700 }}>
            When a page prints user input as HTML instead of text, attackers can run code in other people's browsers.
          </p>
        </Reveal>
        <XssDemo />

        <Reveal style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: '#1d1d1f', margin: '8px 0 10px' }}>3d · The validation checklist</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
            {VALIDATION_RULES.map(r => (
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

      {/* 5 — quiz */}
      <Section>
        <SectionHeader kicker="Final challenge" color={ACCENT}
          title="Prove it. Five quick questions."
          blurb="Five questions covering the whole lesson. Answer them all, then submit and see how you went." />
        <FinalQuiz />
      </Section>

      {/* 6 — resources */}
      <Section style={{ marginBottom: 40 }}>
        <SectionHeader kicker="Keep going" color={SAFE}
          title="Where to go next"
          blurb="Things to watch, read and play with if you want to keep going. All free, and all written for beginners." />
        <Resources />
      </Section>

      {/* close */}
      <Reveal>
        <div style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 30 }}>🌐</div>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#1d1d1f', maxWidth: 620, margin: '14px auto 0', fontWeight: 500 }}>
            A website is a conversation between a client and a server, with a database remembering it all. The client
            makes it friendly — but the server makes it <i>true and safe</i>. Validate everything, trust nothing from the
            browser, and you've already avoided most of the web's worst bugs.
          </p>
          <p style={{ fontSize: 13, color: '#aeaeb2', marginTop: 20 }}>
            MBI802 · Database &amp; Web Systems · Master of Business Informatics
          </p>
        </div>
      </Reveal>
    </div>
  );
}
