import { useState, type ReactNode } from 'react';
import { highlight } from '../ml/pyHighlight';

// ─── Small teaching pieces every lab uses ─────────────────────────────────
//   Task      — the "Do this now" box that ends most steps.
//   Answer    — a hidden answer, so a student tries first and checks after.
//   Jump      — an in-page link that works under the HashRouter.
//   c         — a bit of code inside a sentence.
//   WhyBlock  — the task, why we do it, and why this column, said before any
//               code appears. Every step that asks a beginner to do
//               something unfamiliar opens with one.
//   ReadAloud — a line of code taken apart into its words, each with a
//               plain meaning.

export function Task({ title, time, children, foot }: { title: string; time?: string; children: ReactNode; foot?: ReactNode }) {
  return (
    <div className="lr-task">
      <div className="lr-task__head">
        <span className="lr-task__tag">Do this now</span>
        {time && <span className="lr-task__time">{time}</span>}
      </div>
      <h4>{title}</h4>
      {children}
      {foot && <div className="lr-task__foot">{foot}</div>}
    </div>
  );
}

export function Answer({ label = 'Show the answer', children }: { label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 12 }}>
      <button type="button" className="lr-navbtn" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {open ? 'Hide the answer' : label}
      </button>
      {open && <div className="lr-q__ans" style={{ marginLeft: 0 }}>{children}</div>}
    </div>
  );
}

export const c = (s: string) => <code className="lr-inline">{s}</code>;

/** An in-page link. A plain hash link would be read by the HashRouter as a
 *  route and navigate away, so this scrolls instead. */
export function Jump({ to, children }: { to: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className="lr-jump"
      onClick={() => document.getElementById(to)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
    >
      {children}
    </button>
  );
}

export function WhyBlock({ task, why, which, whichLabel = 'Why this column?' }: {
  task: ReactNode;
  why: ReactNode;
  which?: ReactNode;
  whichLabel?: string;
}) {
  return (
    <div className="lr-why">
      <div className="lr-why__row">
        <span className="lr-why__lbl">The task</span>
        <div>{task}</div>
      </div>
      <div className="lr-why__row">
        <span className="lr-why__lbl">Why we do it</span>
        <div>{why}</div>
      </div>
      {which && (
        <div className="lr-why__row">
          <span className="lr-why__lbl">{whichLabel}</span>
          <div>{which}</div>
        </div>
      )}
    </div>
  );
}

export function ReadAloud({ lines }: { lines: [string, ReactNode][] }) {
  return (
    <dl className="lr-aloud">
      {lines.map(([code, meaning]) => (
        <div key={code}>
          <dt><code>{highlight(code)}</code></dt>
          <dd>{meaning}</dd>
        </div>
      ))}
    </dl>
  );
}
