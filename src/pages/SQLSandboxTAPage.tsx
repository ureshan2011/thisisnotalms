import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, Clock, EyeOff, Hand, RefreshCw, Search, XCircle } from 'lucide-react';
import { CourseBrand } from '../components/blend';
import { CHALLENGES } from '../lib/sqlSandbox/challenges';
import { fetchLive, sheetEnabled, type LiveFlag, type LiveRow } from '../lib/sqlSandbox/progress';
import '../styles/blend.css';
import '../styles/sql-sandbox.css';

// ─── /sql-sandbox/ta — the TA's live screen ───────────────────────────────
// Built for a phone in one hand while walking the room. The top of the page
// answers one question: who needs me right now? Everyone else sits below.
//
// A student NEEDS HELP when they are still here and any of these is true:
//   - on the same step for the chosen time (default 5 minutes)
//   - 3 or more failed tries on the current step
//   - on the map, challenge list or playground for 10 minutes, not starting
//   - WENT QUIET: on a step, then nothing for 4 to 20 minutes after being stuck
// "Helped" snoozes a student until they move to a new step (or 10 minutes).
// The snooze lives on this device only; nothing is written back to the sheet.

const FAILS_STUCK = 3;
const LOST_SECS = 10 * 60;
const IDLE_SECS = 4 * 60;
const GONE_SECS = 20 * 60;
const SNOOZE_MS = 10 * 60 * 1000;
const POLL_MS = 15_000;
const PIN_KEY = 'sqlsb:ta-pin';
const THR_KEY = 'sqlsb:ta-mins';
const SNOOZE_KEY = 'sqlsb:ta-snooze';

type Status = 'help' | 'quiet' | 'working' | 'idle' | 'offline';

const STATUS_LABEL: Record<Status, string> = {
  help: 'Needs help',
  quiet: 'Went quiet',
  working: 'Working',
  idle: 'Idle',
  offline: 'Left',
};

interface Row extends LiveRow {
  status: Status;
  reasons: string[];
  urgency: number;
  snoozed: boolean;
}

const onTask = (r: LiveRow) => /^(Level|Challenge) \d/.test(r.doing) && r.step !== 'Solved';

function dur(secs: number) {
  if (secs < 60) return `${secs} s`;
  const m = Math.floor(secs / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

function ago(secs: number) {
  if (secs < 60) return 'just now';
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago`;
}

function classify(r: LiveRow, mins: number): Pick<Row, 'status' | 'reasons' | 'urgency'> {
  const reasons: string[] = [];
  const task = onTask(r);
  if (task && r.stepSecs >= mins * 60) reasons.push(`${dur(r.stepSecs)} on the same step`);
  if (task && r.fails >= FAILS_STUCK) reasons.push(`${r.fails} failed tries`);
  if (!task && r.doing && r.doing !== 'Notes' && r.stepSecs >= LOST_SECS && r.idleSecs <= IDLE_SECS) {
    reasons.push(`${dur(r.stepSecs)} on "${r.doing}" without starting`);
  }
  const urgency = r.fails * 120 + r.stepSecs;
  if (r.idleSecs > GONE_SECS) return { status: 'offline', reasons: [], urgency: 0 };
  if (r.idleSecs > IDLE_SECS) {
    if (task && reasons.length) return { status: 'quiet', reasons: [...reasons, `silent for ${dur(r.idleSecs)}`], urgency: urgency / 2 };
    return { status: 'idle', reasons: [], urgency: 0 };
  }
  if (reasons.length) return { status: 'help', reasons, urgency };
  return { status: 'working', reasons: [], urgency: 0 };
}

const challengeName = (id: string) => {
  const c = CHALLENGES.find(x => x.id === id);
  return c ? `Challenge ${c.n} · ${c.title}` : id;
};

function readLS(key: string, fallback = '') {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(key);
    else localStorage.setItem(key, v);
  } catch {
    /* fine */
  }
}

function readSnooze(): Record<string, number> {
  try {
    return JSON.parse(readLS(SNOOZE_KEY, '{}')) as Record<string, number>;
  } catch {
    return {};
  }
}

export default function SQLSandboxTAPage() {
  const [pin, setPin] = useState(() => readLS(PIN_KEY));
  const [draft, setDraft] = useState('');
  const [rows, setRows] = useState<LiveRow[] | null>(null);
  const [flags, setFlags] = useState<LiveFlag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | Status | 'helped'>('all');
  const [query, setQuery] = useState('');
  const [mins, setMins] = useState(() => parseInt(readLS(THR_KEY, '5'), 10) || 5);
  const [snooze, setSnooze] = useState<Record<string, number>>(readSnooze);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    if (!pin || !sheetEnabled()) return;
    setLoading(true);
    try {
      const res = await fetchLive(pin);
      if (!res.ok) {
        setError(res.error ?? 'The sheet said no.');
        if (res.error === 'Wrong PIN.') {
          setPin('');
          writeLS(PIN_KEY, null);
        }
      } else {
        setRows(res.rows);
        setFlags(res.flags);
        setError(null);
        setUpdated(Date.now());
      }
    } catch {
      setError('Could not reach the class sheet. Retrying.');
    } finally {
      setLoading(false);
    }
  }, [pin]);

  useEffect(() => {
    void load();
    const t = window.setInterval(() => document.visibilityState === 'visible' && void load(), POLL_MS);
    const back = () => document.visibilityState === 'visible' && void load();
    document.addEventListener('visibilitychange', back);
    const clock = window.setInterval(() => setNow(Date.now()), 5000);
    return () => {
      window.clearInterval(t);
      window.clearInterval(clock);
      document.removeEventListener('visibilitychange', back);
    };
  }, [load]);

  const snoozeKey = (r: LiveRow) => `${r.id}|${r.doing}|${r.step}`;

  const all: Row[] = useMemo(
    () =>
      (rows ?? []).map(r => {
        const c = classify(r, mins);
        const until = snooze[snoozeKey(r)] ?? 0;
        return { ...r, ...c, snoozed: until > now && (c.status === 'help' || c.status === 'quiet') };
      }),
    [rows, mins, snooze, now],
  );

  const urgent = useMemo(
    () => all.filter(r => (r.status === 'help' || r.status === 'quiet') && !r.snoozed).sort((a, b) => b.urgency - a.urgency),
    [all],
  );
  const helped = useMemo(() => all.filter(r => r.snoozed), [all]);
  const counts = useMemo(() => {
    const c = { working: 0, idle: 0, offline: 0 };
    all.forEach(r => {
      if (r.status === 'working') c.working++;
      if (r.status === 'idle') c.idle++;
      if (r.status === 'offline') c.offline++;
    });
    return c;
  }, [all]);

  // The tab says how many need help, so a TA who has the page behind another one still sees it.
  useEffect(() => {
    const before = document.title;
    document.title = urgent.length ? `(${urgent.length}) need help · SQL Sandbox TA` : 'SQL Sandbox · TA view';
    return () => {
      document.title = before;
    };
  }, [urgent.length]);

  const rest = useMemo(() => {
    const q = query.trim().toLowerCase();
    const order: Status[] = ['help', 'quiet', 'working', 'idle', 'offline'];
    return all
      .filter(r => {
        if (filter === 'helped') return r.snoozed;
        if (filter === 'all') return !urgent.includes(r) || !!q;
        if (filter === 'help' || filter === 'quiet') return false;
        return r.status === filter && !r.snoozed;
      })
      .filter(r => !q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
      .sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || a.idleSecs - b.idleSecs || a.name.localeCompare(b.name));
  }, [all, filter, query, urgent]);

  const helpedIt = (r: Row) => {
    const next = { ...snooze, [snoozeKey(r)]: Date.now() + SNOOZE_MS };
    // Forget old snoozes so the list never grows.
    for (const k of Object.keys(next)) if (next[k] < Date.now()) delete next[k];
    setSnooze(next);
    writeLS(SNOOZE_KEY, JSON.stringify(next));
  };
  const unsnooze = (r: Row) => {
    const next = { ...snooze };
    delete next[snoozeKey(r)];
    setSnooze(next);
    writeLS(SNOOZE_KEY, JSON.stringify(next));
  };

  const submitPin = (e: FormEvent) => {
    e.preventDefault();
    const p = draft.trim();
    if (!p) return;
    writeLS(PIN_KEY, p);
    setError(null);
    setPin(p);
  };

  const header = (
    <header className="sb-header">
      <div className="sb-header__row">
        <Link to="/sql-sandbox" className="sb-brand" aria-label="Back to the SQL Sandbox">
          <CourseBrand size={26} />
          <span className="sb-brand__tag">SQL Sandbox · TA</span>
        </Link>
        {pin && sheetEnabled() && (
          <div className="ta-sync">
            <span className="sb-muted">{updated ? `Updated ${ago(Math.round((now - updated) / 1000))}` : 'Loading…'}</span>
            <button type="button" className="sb-tool" onClick={() => void load()} disabled={loading} aria-label="Refresh now">
              <RefreshCw size={15} className={loading ? 'ta-spin' : ''} />
            </button>
          </div>
        )}
      </div>
    </header>
  );

  if (!sheetEnabled()) {
    return (
      <div className="bt sb">
        {header}
        <main className="sb-main">
          <div className="sb-card ta-note">
            <p className="sb-step__task">The class sheet isn&apos;t connected yet.</p>
            <p>The live screen reads from the Google Sheet. Set it up with scripts/sql-sandbox-sheet/README.md, then come back.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!pin) {
    return (
      <div className="bt sb">
        {header}
        <div className="sb-gate">
          <form className="sb-gate__card" onSubmit={submitPin}>
            <p className="bt-eyebrow">TA view</p>
            <h1>
              Who needs a hand<span className="bt-stop">?</span>
            </h1>
            <p className="sb-gate__lede">Type the TA PIN. This device remembers it.</p>
            <input
              className="sb-gate__input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              type="password"
              autoComplete="off"
              aria-label="TA PIN"
              autoFocus
            />
            <button type="submit" className="bt-btn" disabled={!draft.trim()}>
              Open
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
            {error && <p className="sb-gate__msg">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  const card = (r: Row, big = false) => (
    <article key={`${r.id}|${r.snoozed}`} className={`ta-card is-${r.snoozed ? 'helped' : r.status} ${big ? 'is-big' : ''}`}>
      <div className="ta-card__head">
        <span className={`ta-pill ta-pill--${r.snoozed ? 'helped' : r.status}`}>{r.snoozed ? 'Helped' : STATUS_LABEL[r.status]}</span>
        <span className="sb-muted">{ago(r.idleSecs)}</span>
      </div>
      <h2 className="ta-name">
        {r.name || 'No name yet'} <span>{r.id}</span>
      </h2>
      <p className="ta-doing">{r.doing || '—'}</p>
      {r.step && <p className="ta-step">{r.step}</p>}
      {r.reasons.length > 0 && !r.snoozed && (
        <ul className="ta-reasons">
          {r.reasons.map(x => (
            <li key={x}>
              {x.includes('failed') ? <XCircle size={14} /> : x.includes('silent') ? <EyeOff size={14} /> : <Clock size={14} />} {x}
            </li>
          ))}
        </ul>
      )}
      {!big && r.reasons.length === 0 && onTask(r) && (
        <p className="ta-meta">
          <span>
            <Clock size={13} /> {dur(r.stepSecs)} on this
          </span>
          <span>
            <XCircle size={13} /> {r.fails} failed {r.fails === 1 ? 'try' : 'tries'}
          </span>
        </p>
      )}
      <p className="ta-foot">
        {r.xp} XP · {r.levelsDone}/8 levels · {r.challengesSolved} challenge{r.challengesSolved === 1 ? '' : 's'}
        {r.device ? ` · ${r.device}` : ''}
      </p>
      {(r.status === 'help' || r.status === 'quiet') && (
        <div className="ta-card__act">
          {r.snoozed ? (
            <button type="button" className="sb-tool" onClick={() => unsnooze(r)}>
              Show again
            </button>
          ) : (
            <button type="button" className="sb-tool ta-helped" onClick={() => helpedIt(r)}>
              <Check size={15} /> I helped
            </button>
          )}
        </div>
      )}
    </article>
  );

  return (
    <div className="bt sb">
      {header}
      <main className="sb-main ta">
        <section className={`ta-hero ${urgent.length ? 'is-alert' : 'is-calm'}`} aria-live="polite">
          <div className="ta-hero__num">{urgent.length}</div>
          <div className="ta-hero__txt">
            <p className="ta-hero__big">
              {urgent.length === 0 ? 'Nobody needs help right now' : urgent.length === 1 ? 'student needs you' : 'students need you'}
            </p>
            <p className="sb-muted">
              {all.length} signed in · {counts.working} working · {counts.idle} idle · {counts.offline} left
              {helped.length ? ` · ${helped.length} helped` : ''}
            </p>
          </div>
          <label className="ta-thr">
            <span>Stuck after</span>
            <select
              value={mins}
              onChange={e => {
                const v = parseInt(e.target.value, 10);
                setMins(v);
                writeLS(THR_KEY, String(v));
              }}
            >
              {[2, 3, 5, 8, 12].map(m => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ))}
            </select>
          </label>
        </section>

        {error && <p className="sb-nudge">{error}</p>}

        {urgent.length > 0 && (
          <section aria-label="Students who need help">
            <h2 className="ta-h">
              <Hand size={18} /> Needs you now
            </h2>
            <div className="ta-grid ta-grid--urgent">{urgent.map(r => card(r, true))}</div>
          </section>
        )}

        {flags.length > 0 && !query && (
          <section className="sb-card ta-flags" aria-label="Quick solves after pasting">
            <p className="sb-step__task">
              <AlertTriangle size={16} /> Worth a two-minute chat
            </p>
            <p className="sb-muted">Challenges solved in under 4 minutes by someone who pasted into the editor. Ask them to explain it.</p>
            <ul>
              {flags.map((f, i) => (
                <li key={`${f.id}-${f.challenge}-${i}`}>
                  <strong>{f.name || f.id}</strong> <span className="sb-muted">{f.id}</span>
                  <span>
                    {challengeName(f.challenge)} in {dur(f.secs)}, {f.pastes} paste{f.pastes === 1 ? '' : 's'} · {ago(f.agoSecs)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="ta-top">
          <div className="ta-filters" role="tablist" aria-label="Show">
            <button type="button" className={`ta-filter ${filter === 'all' ? 'is-on' : ''}`} onClick={() => setFilter('all')}>
              Everyone else
            </button>
            <button type="button" className={`ta-filter ${filter === 'working' ? 'is-on' : ''}`} onClick={() => setFilter('working')}>
              Working <b>{counts.working}</b>
            </button>
            <button type="button" className={`ta-filter ${filter === 'idle' ? 'is-on' : ''}`} onClick={() => setFilter('idle')}>
              Idle <b>{counts.idle}</b>
            </button>
            <button type="button" className={`ta-filter ${filter === 'offline' ? 'is-on' : ''}`} onClick={() => setFilter('offline')}>
              Left <b>{counts.offline}</b>
            </button>
            {helped.length > 0 && (
              <button type="button" className={`ta-filter ${filter === 'helped' ? 'is-on' : ''}`} onClick={() => setFilter('helped')}>
                Helped <b>{helped.length}</b>
              </button>
            )}
          </div>
          <label className="ta-search">
            <Search size={15} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a name or ID" aria-label="Find a student" />
          </label>
        </div>

        {rows && rows.length === 0 && <p className="sb-muted">Nobody has opened the sandbox yet.</p>}
        <div className="ta-grid">{rest.map(r => card(r))}</div>

        <p className="ta-legend sb-muted">
          Needs help: here in the last 4 minutes and {mins}+ minutes on the same step, or {FAILS_STUCK}+ failed tries, or 10+ minutes on the
          map without starting. Went quiet: was stuck, then nothing for 4 to 20 minutes. Idle: nothing for 4 minutes. Left: nothing for 20.
          &quot;I helped&quot; hides a student for 10 minutes, or until they move to a new step. Refreshes every 15 seconds.
        </p>
      </main>
    </div>
  );
}
