import { useEffect, useState } from 'react';
import '../../../styles/lab.css';

// ─── The hand-in countdown ────────────────────────────────────────────────
// Each lab passes its own deadline, used by the hero strip and by the
// hand-in step.
//
// A deadline is written as an exact moment with its New Zealand offset, for
// example "2026-10-09T23:59:00+13:00" (NZ is on daylight time, UTC+13, from
// late September). That means every student counts down to the same instant
// whatever their laptop's clock is set to. For anyone whose own clock is
// somewhere else, the page also says what that moment is on their clock, so
// nobody works out the conversion alone.
//
// The seconds tick once a second. Nothing here is announced to a screen
// reader every second (role="timer" is silent by default); the container's
// label carries the whole sentence for anyone who goes looking.

export interface Deadline {
  /** The exact moment, with its New Zealand offset. */
  at: Date;
  /** "Friday 9 October 2026, 11:59 pm" */
  label: string;
  /** "Fri 9 Oct, 11:59 pm" */
  short: string;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type Mood = 'open' | 'soon' | 'last' | 'closed';

function split(ms: number) {
  const left = Math.max(0, ms);
  return {
    days: Math.floor(left / DAY),
    hours: Math.floor((left % DAY) / HOUR),
    minutes: Math.floor((left % HOUR) / MINUTE),
    seconds: Math.floor((left % MINUTE) / SECOND),
  };
}

function moodFor(ms: number): Mood {
  if (ms <= 0) return 'closed';
  if (ms <= 3 * HOUR) return 'last';
  if (ms <= 2 * DAY) return 'soon';
  return 'open';
}

const MOOD_TEXT: Record<Mood, string> = {
  open: 'Time left',
  soon: 'Due soon',
  last: 'Final hours',
  closed: 'Deadline passed',
};

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), SECOND);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/** What the deadline reads on this device's own clock, or null if that is
 *  the same wall-clock time as in New Zealand (so there is nothing to add). */
function localNote(deadline: Deadline): string | null {
  try {
    const fmt = (tz?: string) =>
      new Intl.DateTimeFormat('en-NZ', {
        weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: tz,
      }).format(deadline.at);
    const here = fmt();
    if (here === fmt('Pacific/Auckland')) return null;
    const zone = new Intl.DateTimeFormat('en-NZ', { timeZoneName: 'short' })
      .formatToParts(deadline.at)
      .find(p => p.type === 'timeZoneName')?.value;
    return `On your device's clock that's ${here}${zone ? ` (${zone})` : ''}.`;
  } catch {
    return null;
  }
}

function sentence(ms: number, deadline: Deadline) {
  if (ms <= 0) return `The deadline, ${deadline.label} New Zealand time, has passed.`;
  const t = split(ms);
  return `${t.days} days, ${t.hours} hours, ${t.minutes} minutes and ${t.seconds} seconds left until ${deadline.label} New Zealand time.`;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** One line, for the top of the page. */
export function CountdownStrip({ deadline }: { deadline: Deadline }) {
  const ms = deadline.at.getTime() - useNow();
  const mood = moodFor(ms);
  const t = split(ms);
  return (
    <div className={`lr-cdstrip lr-cd--${mood}`} role="timer" aria-label={sentence(ms, deadline)}>
      <span className="lr-cd__dot" aria-hidden="true" />
      <span className="lr-cdstrip__due">Due {deadline.short}</span>
      <span className="lr-cdstrip__left bt-tnum" aria-hidden="true">
        {mood === 'closed'
          ? 'Deadline passed'
          : `${t.days}d ${pad(t.hours)}h ${pad(t.minutes)}m ${pad(t.seconds)}s left`}
      </span>
    </div>
  );
}

/** The big one, for the hand-in step. */
export default function Countdown({ deadline }: { deadline: Deadline }) {
  const ms = deadline.at.getTime() - useNow();
  const mood = moodFor(ms);
  const t = split(ms);
  const note = localNote(deadline);

  const cells: [string, number][] = [
    ['Days', t.days],
    ['Hours', t.hours],
    ['Minutes', t.minutes],
    ['Seconds', t.seconds],
  ];

  return (
    <div className={`lr-cd lr-cd--${mood}`}>
      <div className="lr-cd__head">
        <span className="lr-cd__dot" aria-hidden="true" />
        <p className="lr-cd__mood">{MOOD_TEXT[mood]}</p>
      </div>
      <div className="lr-cd__row">
        <div className="lr-cd__cells" role="timer" aria-label={sentence(ms, deadline)}>
          {cells.map(([label, n]) => (
            <div key={label} className="lr-cd__cell" aria-hidden="true">
              <b className="bt-tnum">{label === 'Days' ? n : pad(n)}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="lr-cd__when">
          <p className="lr-cd__date">{deadline.label}</p>
          <p className="lr-cd__tz">New Zealand time. Clocks are on daylight saving by then.</p>
          {note && <p className="lr-cd__tz">{note}</p>}
        </div>
      </div>
      <p className="lr-cd__hint">
        {mood === 'closed'
          ? 'The deadline has passed.'
          : 'Reply under the announcement post in Teams before this hits zero. Don’t leave it to the last ten minutes: uploads fail at the worst moment.'}
      </p>
    </div>
  );
}
