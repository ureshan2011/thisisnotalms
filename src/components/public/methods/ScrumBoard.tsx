import { useState } from 'react';

// ─── A Sprint board you can actually move (MBI804 · Lesson 2.6) ───────────
// A screenshot of a Jira board teaches nothing, because the thing worth
// understanding is what happens to the numbers when work moves — and what
// happens when it does not.
//
// Eight real stories from this platform's own attendance product, four
// columns, and a burndown that redraws as cards move. Two lessons are built
// in rather than asserted: a work-in-progress limit, which the board
// complains about when it is broken, and the difference between the ideal
// line and where the team actually is on a given day.
//
// Points are the team's own relative sizing. They are not hours, and the
// widget never converts them into hours.

interface Card {
  id: string;
  title: string;
  who: string;
  pts: number;
  col: number;
}

const COLUMNS = ['To do', 'In progress', 'In review', 'Done'];
const WIP_LIMIT = 3;
const SPRINT_DAYS = 10;

const INITIAL: Card[] = [
  { id: 'a', title: 'Student can see attendance % per paper', who: 'Sarah', pts: 5, col: 3 },
  { id: 'b', title: 'Warning banner below 80% attendance', who: 'James', pts: 3, col: 3 },
  { id: 'c', title: 'Lecturer exports a session to CSV', who: 'Priya', pts: 5, col: 2 },
  { id: 'd', title: 'QR code expires after ten minutes', who: 'Mark', pts: 3, col: 2 },
  { id: 'e', title: 'Absence dates listed in order', who: 'Sarah', pts: 2, col: 1 },
  { id: 'f', title: 'Attendance page works on a phone', who: 'James', pts: 5, col: 1 },
  { id: 'g', title: 'Email a weekly summary to tutors', who: '—', pts: 8, col: 0 },
  { id: 'h', title: 'Bulk-correct a mis-scanned session', who: '—', pts: 5, col: 0 },
];

export default function ScrumBoard() {
  const [cards, setCards] = useState<Card[]>(INITIAL);
  const [day, setDay] = useState(6);

  const total = INITIAL.reduce((s, c) => s + c.pts, 0);
  const doneP = cards.filter(c => c.col === 3).reduce((s, c) => s + c.pts, 0);
  const remaining = total - doneP;
  const wip = cards.filter(c => c.col === 1).length;

  // The ideal line: total burnt evenly across the Sprint. Real burndowns are
  // never straight, which is the point of drawing both.
  const ideal = total * (1 - day / SPRINT_DAYS);
  const gap = remaining - ideal;

  function move(id: string) {
    setCards(prev => prev.map(c => (c.id === id ? { ...c, col: c.col === 3 ? 0 : c.col + 1 } : c)));
  }

  const W = 520;
  const H = 172;
  const PAD = { l: 34, r: 16, t: 14, b: 30 };
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;
  const dx = (d: number) => PAD.l + (d / SPRINT_DAYS) * pw;
  const py = (p: number) => PAD.t + ph - (p / total) * ph;

  return (
    <div className="bt-sim">
      <p className="bt-sim__label">Tap a card to move it one column right · from Done it returns to To do</p>

      <div
        style={{
          marginTop: 14,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 10,
          alignItems: 'start',
        }}
      >
        {COLUMNS.map((name, ci) => {
          const inCol = cards.filter(c => c.col === ci);
          const over = ci === 1 && inCol.length > WIP_LIMIT;
          return (
            <div
              key={name}
              style={{
                background: 'var(--paper-50)',
                border: `1px solid ${over ? 'rgba(217, 58, 43, 0.35)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: 12,
                minHeight: 150,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12.5, fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>
                  {name}
                </span>
                <span className="bt-tnum" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: over ? 'var(--red-500)' : 'var(--ink-400)' }}>
                  {ci === 1 ? `${inCol.length}/${WIP_LIMIT}` : inCol.length}
                </span>
              </div>

              <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
                {inCol.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => move(c.id)}
                    style={{
                      textAlign: 'left',
                      border: '1px solid var(--border-subtle)',
                      background: ci === 3 ? 'var(--accent-50)' : 'var(--paper-0)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 11px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    aria-label={`${c.title}, ${c.pts} points, ${c.who === '—' ? 'unassigned' : c.who}. In ${name}. Move to ${COLUMNS[c.col === 3 ? 0 : c.col + 1]}.`}
                  >
                    <span style={{ display: 'block', fontSize: 12.5, lineHeight: 1.4, color: 'var(--ink-900)' }}>{c.title}</span>
                    <span style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontSize: 11, color: 'var(--ink-400)' }}>
                      <span>{c.who}</span>
                      <span className="bt-tnum" style={{ fontFamily: 'var(--font-mono)' }}>{c.pts} pt</span>
                    </span>
                  </button>
                ))}
                {inCol.length === 0 && (
                  <span style={{ fontSize: 11.5, color: 'var(--ink-300)' }}>empty</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {wip > WIP_LIMIT && (
        <div className="bt-verdict bt-verdict--bad" style={{ marginTop: 14 }} aria-live="polite">
          <strong>{wip} items in progress, against a limit of {WIP_LIMIT}</strong>
          Starting is not finishing. Work sitting half-done is money spent with nothing to show for it, and every extra
          item in progress lengthens how long each one takes. The limit is not a rule from the Scrum Guide — it is
          borrowed from Kanban, and most Scrum teams that are honest about flow end up adopting one.
        </div>
      )}

      <div className="bt-sim__grid" style={{ marginTop: 22 }}>
        <div>
          <div className="bt-sim__range">
            <label htmlFor="burn-day" className="bt-sim__label">
              Day of the Sprint · <span className="bt-tnum">{day}</span> of {SPRINT_DAYS}
            </label>
            <input id="burn-day" type="range" min={0} max={SPRINT_DAYS} step={1} value={day} onChange={e => setDay(Number(e.target.value))} />
          </div>

          <div className="bt-counter" style={{ marginTop: 20 }} aria-live="polite">
            <b className="bt-tnum">{remaining}</b>
            <span>
              points still to burn, of {total} committed. The ideal line sits at {ideal.toFixed(1)} on day {day}.
            </span>
          </div>
        </div>

        <div className="bt-sim__stage">
          <svg viewBox={`0 0 ${W} ${H}`} role="img"
            aria-label={`Sprint burndown. The ideal line falls from ${total} points on day zero to zero on day ten. On day ${day} the team has ${remaining} points remaining, against an ideal of ${ideal.toFixed(1)}.`}>
            <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + ph} y2={PAD.t + ph} stroke="var(--ink-300)" strokeWidth="1" />
            <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={PAD.t + ph} stroke="var(--ink-300)" strokeWidth="1" />
            <text x={PAD.l - 8} y={PAD.t + 4} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-400)">{total}</text>
            <text x={PAD.l - 8} y={PAD.t + ph} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-400)">0</text>
            <text x={PAD.l} y={H - 10} fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-400)">day 0</text>
            <text x={W - PAD.r} y={H - 10} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-400)">day {SPRINT_DAYS}</text>

            <line x1={dx(0)} y1={py(total)} x2={dx(SPRINT_DAYS)} y2={py(0)} stroke="var(--ink-300)" strokeWidth="1.6" strokeDasharray="5 5" />
            <text x={dx(6) + 6} y={py(total * 0.4) - 6} fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">ideal</text>

            {/* Where the team actually is: a line from the start to today. */}
            <line x1={dx(0)} y1={py(total)} x2={dx(day)} y2={py(remaining)} stroke="var(--accent-500)" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx={dx(day)} cy={py(remaining)} r="5.5" fill="var(--accent-500)" stroke="var(--paper-50)" strokeWidth="2" />
            <text x={dx(day)} y={py(remaining) - 12} textAnchor="middle" fontSize="10" fontWeight="800" fontFamily="var(--font-display)" fill="var(--accent-600)">
              {remaining}
            </text>
          </svg>
          <p className="bt-sim__caption">Burndown · committed points remaining, against an even burn</p>
        </div>
      </div>

      <div className={`bt-verdict${gap > 6 ? ' bt-verdict--bad' : gap < -3 ? ' bt-verdict--good' : ''}`} style={{ marginTop: 18 }} aria-live="polite">
        <strong>
          {remaining === 0
            ? 'Everything committed is Done'
            : gap > 6
              ? `About ${Math.round(gap)} points behind the line`
              : gap < -3
                ? `About ${Math.round(-gap)} points ahead of the line`
                : 'Roughly on the line'}
        </strong>
        {remaining === 0
          ? 'Which means the Sprint Goal is met and there is capacity to pull the next item from the Product Backlog — a conversation with the Product Owner, not a unilateral decision by the Developers.'
          : gap > 6
            ? 'Being behind is information, not a verdict. The response is to look at why — usually work sitting in review, or items that were larger than they were sized — and to talk to the Product Owner about the Sprint Goal while there is still time to change something. Working later is the one response that fixes nothing.'
            : gap < -3
              ? 'Ahead of the line usually means the items were sized generously rather than that the team is fast. Worth a sentence in the Retrospective: consistently finishing early makes the forecast less useful, not more impressive.'
              : 'Close to the line is what a healthy Sprint looks like, and the line itself is a guide rather than a target. Real burndowns are stepped, because work completes in whole items rather than continuously.'}
      </div>
    </div>
  );
}
