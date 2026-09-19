import { useState } from 'react';

// ─── Timeboxes are proportional, not fixed (MBI804 · Lesson 2.6) ──────────
// The five events are usually memorised as "8 hours, 15 minutes, 4 hours, 3
// hours" — which are the maxima for a one-month Sprint only. Set the Sprint
// length and every one of them moves.
//
// The arithmetic underneath has a result worth teaching, and it is not the
// one most people expect: because the three scaling events scale with the
// Sprint and the Daily Scrum is per-day, the share of a Sprint spent in its
// own events comes out the same at every Sprint length — about a sixth. So
// the cost of short Sprints is not meeting time, and the readout that does
// move is the one that actually decides Sprint length: how often anybody
// outside the team sees something working, and how long a wrong direction
// can run before they do.

const DAY_HOURS = 6;

export default function SprintTimeline() {
  const [weeks, setWeeks] = useState(2);

  const days = weeks * 5;
  const f = weeks / 4;

  const planning = 8 * f;
  const review = 4 * f;
  const retro = 3 * f;
  // The Daily Scrum is the one that does not scale: 15 minutes, every day,
  // however long the Sprint is.
  const daily = (days * 15) / 60;
  const ceremony = planning + review + retro + daily;
  const capacity = days * DAY_HOURS;
  // Constant by construction at about 16.7%, which is the point being made.
  const share = (ceremony / capacity) * 100;
  // Roughly 46 working weeks in a year once leave and shutdown are out.
  const reviewsPerYear = Math.round(46 / weeks);

  const fmt = (h: number) => (h >= 1 ? `${Number(h.toFixed(1))} hr${h === 1 ? '' : 's'}` : `${Math.round(h * 60)} min`);

  // The timeline. One column per working day, with the events pinned to the
  // days they actually happen on.
  const W = 560;
  const H = 156;
  const PAD = { l: 14, r: 14, t: 44, b: 46 };
  const trackW = W - PAD.l - PAD.r;
  const colW = trackW / days;

  return (
    <div className="bt-sim">
      <div className="bt-sim__grid">
        <div>
          <div className="bt-sim__range">
            <label htmlFor="sprint-weeks" className="bt-sim__label">
              Sprint length · <span className="bt-tnum">{weeks}</span> week{weeks === 1 ? '' : 's'}
            </label>
            <input
              id="sprint-weeks"
              type="range"
              min={1}
              max={4}
              step={1}
              value={weeks}
              onChange={e => setWeeks(Number(e.target.value))}
            />
          </div>

          <ul className="bt-sim__legend" style={{ borderTop: 'none', paddingTop: 4, flexDirection: 'column', gap: 9 }}>
            <li><span className="bt-sim__swatch" style={{ background: 'var(--accent-500)' }} aria-hidden="true" />Sprint Planning · max {fmt(planning)}</li>
            <li><span className="bt-sim__swatch" style={{ background: 'var(--accent-300)' }} aria-hidden="true" />Daily Scrum · 15 min × {days} days = {fmt(daily)}</li>
            <li><span className="bt-sim__swatch" style={{ background: 'var(--ink-700)' }} aria-hidden="true" />Sprint Review · max {fmt(review)}</li>
            <li><span className="bt-sim__swatch" style={{ background: 'var(--ink-700)' }} aria-hidden="true" />Retrospective · max {fmt(retro)}</li>
          </ul>

          <div className="bt-counter" style={{ marginTop: 20 }} aria-live="polite">
            <b className="bt-tnum">{reviewsPerYear}×</b>
            <span>
              a year that stakeholders see something working, at {weeks} week{weeks === 1 ? '' : 's'} a Sprint across
              about 46 working weeks.
            </span>
          </div>

          <p className="bt-chipnote">
            Total event time is {fmt(ceremony)} across {days} working days of about {DAY_HOURS} usable hours —{' '}
            <b style={{ color: 'var(--ink-900)' }}>{share.toFixed(1)}% of capacity, at every Sprint length</b>. The
            scaling events scale and the Daily Scrum is per day, so the proportion never moves.
          </p>
        </div>

        <div className="bt-sim__stage">
          <svg viewBox={`0 0 ${W} ${H}`} role="img"
            aria-label={`A ${weeks}-week Sprint of ${days} working days. Sprint Planning on day one for up to ${fmt(planning)}, a fifteen-minute Daily Scrum every day, and on the last day a Sprint Review of up to ${fmt(review)} followed by a Retrospective of up to ${fmt(retro)}.`}>

            <text x={PAD.l} y="20" fontSize="10" letterSpacing="1.1" fontFamily="var(--font-body)" fill="var(--ink-400)">
              {`SPRINT · ${weeks} WEEK${weeks === 1 ? '' : 'S'} · ${days} WORKING DAYS`}
            </text>

            {/* The Sprint itself, as one unbroken bar. */}
            <rect x={PAD.l} y={PAD.t} width={trackW} height="40" rx="10" fill="var(--paper-200)" stroke="var(--border-subtle)" />

            {/* One daily scrum mark per day. */}
            {Array.from({ length: days }, (_, d) => (
              <rect key={d} x={PAD.l + d * colW + colW * 0.35} y={PAD.t + 8} width={Math.max(colW * 0.3, 2)} height="24" rx="2" fill="var(--accent-300)">
                <title>{`Day ${d + 1}: Daily Scrum, 15 minutes`}</title>
              </rect>
            ))}

            {/* Planning takes the first day; the Review and the
                Retrospective share the last. Drawn as one block each: two
                half-width rounded rects at the end read as a blob rather
                than as two events, and the legend already splits them. */}
            <rect x={PAD.l} y={PAD.t} width={Math.max(colW, 10)} height="40" rx="10" fill="var(--accent-500)">
              <title>{`Sprint Planning, max ${fmt(planning)}`}</title>
            </rect>
            <rect x={PAD.l + trackW - Math.max(colW, 10)} y={PAD.t} width={Math.max(colW, 10)} height="40" rx="10" fill="var(--ink-700)">
              <title>{`Sprint Review, max ${fmt(review)}, then the Retrospective, max ${fmt(retro)}`}</title>
            </rect>

            <text x={PAD.l + 2} y={PAD.t - 8} fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-600)">Planning</text>
            <text x={PAD.l + trackW} y={PAD.t - 8} textAnchor="end" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-600)">Review + Retro</text>

            {/* Day scale. */}
            {Array.from({ length: days }, (_, d) => d).filter(d => days <= 10 || d % 2 === 0).map(d => (
              <text key={d} x={PAD.l + d * colW + colW / 2} y={PAD.t + 56} textAnchor="middle" fontSize="8.5" fontFamily="var(--font-mono)" fill="var(--ink-400)">
                {d + 1}
              </text>
            ))}

            {/* The thing that actually moves with Sprint length: how long a
                wrong direction can run before anybody outside the team sees
                it. Drawn against the framework's own four-week maximum. */}
            <text x={PAD.l} y={PAD.t + 78} fontSize="9.5" letterSpacing="1" fontFamily="var(--font-body)" fill="var(--ink-400)">HOW LONG A WRONG TURN CAN RUN UNSEEN</text>
            <rect x={PAD.l} y={PAD.t + 84} width={trackW} height="10" rx="5" fill="var(--paper-300)" />
            <rect x={PAD.l} y={PAD.t + 84} width={Math.max((weeks / 4) * trackW, 3)} height="10" rx="5" fill="var(--accent-500)" />
            <text x={PAD.l + Math.max((weeks / 4) * trackW, 3) - 8} y={PAD.t + 93} textAnchor="end" fontSize="9.5" fontFamily="var(--font-mono)" fill="#fff">
              {weeks} wk
            </text>
          </svg>
          <p className="bt-sim__caption">Timeboxes are maxima, not targets — a Sprint Review that takes ninety minutes has not broken anything</p>
        </div>
      </div>

      {/* Only two weeks is tinted, and only because it is the common
          landing point. None of the four is a wrong answer, so none of them
          gets a red box. */}
      <div className={`bt-verdict${weeks === 2 ? ' bt-verdict--good' : ''}`} style={{ marginTop: 20 }} aria-live="polite">
        <strong>
          {weeks === 1 && 'One week · the fastest feedback the framework offers'}
          {weeks === 2 && 'Two weeks · the length most teams settle on'}
          {weeks === 3 && 'Three weeks · an uncommon middle'}
          {weeks === 4 && 'Four weeks · the maximum the framework allows'}
        </strong>
        {weeks === 1 && `Feedback every five days, and ${reviewsPerYear} Sprint Reviews a year — nothing can go wrong for long. The cost is not meeting time, which stays at about a sixth of capacity whatever you choose. It is that every story has to be small enough to finish inside a week, a single sick day is 20% of the Sprint, and Planning and Review carry a real setting-up cost that does not halve when the Sprint does.`}
        {weeks === 2 && `Ten working days and about ${reviewsPerYear} Reviews a year: long enough to finish a real piece of work, short enough that a wrong turn is caught inside a fortnight. This is where most teams land, and it is why "two weeks" is the answer people assume the framework specifies. It does not — the Guide says one month or less.`}
        {weeks === 3 && `About ${reviewsPerYear} Reviews a year, and a Sprint that fits awkwardly into a calendar month — Planning and Review drift around the month instead of landing on the same days. Most teams who try it move to two or four.`}
        {weeks === 4 && `A month is the framework's limit, and it buys the fewest interruptions: ${reviewsPerYear} Reviews a year. It also means a wrong direction can run for four weeks before anybody outside the team sees it, and four weeks of work is a lot to have built on an assumption nobody checked. That is the actual trade — feedback frequency, not overhead.`}
      </div>
    </div>
  );
}
