import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, RefreshCw, Search, XCircle } from 'lucide-react';
import { CourseBrand } from '../components/blend';
import { CHALLENGES } from '../lib/sqlSandbox/challenges';
import { fetchLive, sheetEnabled, type LiveFlag, type LiveRow } from '../lib/sqlSandbox/progress';
import '../styles/blend.css';
import '../styles/sql-sandbox.css';

// ─── /sql-sandbox/ta — the TA's live screen ───────────────────────────────
// Who is stuck, and on what. Reads the class Google Sheet every 15 seconds
// while the page is open. Made for a phone in one hand while walking the
// room: stuck students first, names big, the step they're on in full.
//
// "Stuck" means: still here (checked in within 4 minutes) and either on the
// same step for 6 minutes or more, or 3 or more failed tries on it.

const STUCK_SECS = 6 * 60;
const STUCK_FAILS = 3;
const IDLE_SECS = 4 * 60;
const GONE_SECS = 20 * 60;
const POLL_MS = 15_000;
const PIN_KEY = 'sqlsb:ta-pin';

type Status = 'stuck' | 'working' | 'idle' | 'offline';

const STATUS_LABEL: Record<Status, string> = { stuck: 'Stuck', working: 'Working', idle: 'Idle', offline: 'Left' };
const ORDER: Status[] = ['stuck', 'working', 'idle', 'offline'];

function statusOf(r: LiveRow): Status {
  if (r.idleSecs > GONE_SECS) return 'offline';
  if (r.idleSecs > IDLE_SECS) return 'idle';
  const onTask = /^(Level|Challenge) \d/.test(r.doing) && r.step !== 'Solved';
  if (onTask && (r.stepSecs >= STUCK_SECS || r.fails >= STUCK_FAILS)) return 'stuck';
  return 'working';
}

function ago(secs: number) {
  if (secs < 60) return 'just now';
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago`;
}

function dur(secs: number) {
  if (secs < 60) return `${secs} s`;
  const m = Math.floor(secs / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

const challengeName = (id: string) => {
  const c = CHALLENGES.find(x => x.id === id);
  return c ? `Challenge ${c.n} · ${c.title}` : id;
};

function readPin() {
  try {
    return localStorage.getItem(PIN_KEY) ?? '';
  } catch {
    return '';
  }
}

export default function SQLSandboxTAPage() {
  const [pin, setPin] = useState(readPin);
  const [draft, setDraft] = useState('');
  const [rows, setRows] = useState<LiveRow[] | null>(null);
  const [flags, setFlags] = useState<LiveFlag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState<number | null>(null);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [query, setQuery] = useState('');
  const [, tick] = useState(0);

  const load = useCallback(async () => {
    if (!pin || !sheetEnabled()) return;
    setLoading(true);
    try {
      const res = await fetchLive(pin);
      if (!res.ok) {
        setError(res.error ?? 'The sheet said no.');
        if (res.error === 'Wrong PIN.') {
          setPin('');
          try {
            localStorage.removeItem(PIN_KEY);
          } catch {
            /* fine */
          }
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
    const t = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load();
    }, POLL_MS);
    const back = () => document.visibilityState === 'visible' && void load();
    document.addEventListener('visibilitychange', back);
    const clock = window.setInterval(() => tick(n => n + 1), 5000);
    return () => {
      window.clearInterval(t);
      window.clearInterval(clock);
      document.removeEventListener('visibilitychange', back);
    };
  }, [load]);

  const enriched = useMemo(() => (rows ?? []).map(r => ({ ...r, status: statusOf(r) })), [rows]);
  const counts = useMemo(() => {
    const c: Record<Status, number> = { stuck: 0, working: 0, idle: 0, offline: 0 };
    enriched.forEach(r => c[r.status]++);
    return c;
  }, [enriched]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched
      .filter(r => filter === 'all' || r.status === filter)
      .filter(r => !q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
      .sort((a, b) => {
        const s = ORDER.indexOf(a.status) - ORDER.indexOf(b.status);
        if (s) return s;
        if (a.status === 'stuck') return b.stepSecs - a.stepSecs;
        if (a.status === 'offline' || a.status === 'idle') return a.idleSecs - b.idleSecs;
        return a.name.localeCompare(b.name);
      });
  }, [enriched, filter, query]);

  const submitPin = (e: FormEvent) => {
    e.preventDefault();
    const p = draft.trim();
    if (!p) return;
    try {
      localStorage.setItem(PIN_KEY, p);
    } catch {
      /* fine */
    }
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
            <span className="sb-muted">{updated ? `Updated ${ago(Math.round((Date.now() - updated) / 1000))}` : 'Loading…'}</span>
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

  return (
    <div className="bt sb">
      {header}
      <main className="sb-main ta">
        <div className="ta-top">
          <div className="ta-filters" role="tablist" aria-label="Filter students">
            <button type="button" className={`ta-filter ${filter === 'all' ? 'is-on' : ''}`} onClick={() => setFilter('all')}>
              All <b>{enriched.length}</b>
            </button>
            {ORDER.map(s => (
              <button key={s} type="button" className={`ta-filter ta-filter--${s} ${filter === s ? 'is-on' : ''}`} onClick={() => setFilter(s)}>
                {STATUS_LABEL[s]} <b>{counts[s]}</b>
              </button>
            ))}
          </div>
          <label className="ta-search">
            <Search size={15} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a name or ID" aria-label="Find a student" />
          </label>
        </div>

        {error && <p className="sb-nudge">{error}</p>}
        {rows && rows.length === 0 && <p className="sb-muted">Nobody has opened the sandbox yet.</p>}

        {flags.length > 0 && (filter === 'all' || filter === 'working') && !query && (
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

        <div className="ta-grid">
          {shown.map(r => (
            <article key={r.id} className={`ta-card is-${r.status}`}>
              <div className="ta-card__head">
                <span className={`ta-pill ta-pill--${r.status}`}>{STATUS_LABEL[r.status]}</span>
                <span className="sb-muted">{ago(r.idleSecs)}</span>
              </div>
              <h2 className="ta-name">
                {r.name || 'No name yet'} <span>{r.id}</span>
              </h2>
              <p className="ta-doing">{r.doing || '—'}</p>
              {r.step && <p className="ta-step">{r.step}</p>}
              {/^(Level|Challenge) \d/.test(r.doing) && r.step !== 'Solved' && (
                <p className="ta-meta">
                  <span className={r.stepSecs >= STUCK_SECS ? 'is-hot' : ''}>
                    <Clock size={13} /> {dur(r.stepSecs)} on this
                  </span>
                  <span className={r.fails >= STUCK_FAILS ? 'is-hot' : ''}>
                    <XCircle size={13} /> {r.fails} failed {r.fails === 1 ? 'try' : 'tries'}
                  </span>
                </p>
              )}
              <p className="ta-foot">
                {r.xp} XP · {r.levelsDone}/8 levels · {r.challengesSolved} challenge{r.challengesSolved === 1 ? '' : 's'}
                {r.device ? ` · ${r.device}` : ''}
              </p>
            </article>
          ))}
        </div>

        <p className="ta-legend sb-muted">
          Stuck: here in the last 4 minutes, and 6+ minutes or 3+ failed tries on the same step. Idle: nothing for 4 minutes. Left: nothing for
          20 minutes. Refreshes every 15 seconds.
        </p>
      </main>
    </div>
  );
}
