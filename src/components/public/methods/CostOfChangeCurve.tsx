import { useState } from 'react';

// ─── What the same change costs, phase by phase (MBI804 · Lesson 2.2) ─────
// Waterfall's defining property is not that it is sequential. It is that a
// phase is signed off before the next one starts, which turns "we got that
// wrong" into a contract event rather than a task.
//
// One change — a second approver on payments — is dragged along the
// sequence, and the widget prices it at each phase. The multipliers follow
// Boehm's cost-of-change curve, the finding the whole Agile argument is
// built on: the later a defect or a changed requirement is found, the more
// of the work already built on top of it has to be unpicked.
//
// The figures are a teaching illustration on one scenario, not a
// measurement of anybody's project.

const PHASES: {
  key: string;
  label: string;
  mult: number;
  hours: string;
  what: string;
  why: string;
}[] = [
  {
    key: 'req',
    label: 'Requirements',
    mult: 1,
    hours: '4 hours',
    what: 'An analyst adds a line to the specification and re-runs the sign-off.',
    why: 'Nothing has been built on top of the assumption yet, so the only cost is the conversation and the paperwork. This is the cheapest hour any project will ever spend.',
  },
  {
    key: 'design',
    label: 'Design',
    mult: 3,
    hours: '12 hours',
    what: 'The approval flow, the data model and two screens are redrawn.',
    why: 'Still paper, but there is now paper that agrees with other paper. Every artefact that referenced the old flow has to be found and corrected, and the design sign-off has to be re-taken.',
  },
  {
    key: 'build',
    label: 'Build',
    mult: 8,
    hours: '32 hours',
    what: 'Working code is unpicked: a table gains a column, the service gains a state, three screens change.',
    why: 'Now the assumption is load-bearing. Other code was written against it, and the rework is not the feature — it is the feature plus everything that leaned on the version you are removing.',
  },
  {
    key: 'test',
    label: 'Test',
    mult: 20,
    hours: '80 hours',
    what: 'Code changes, plus a full regression pass, plus re-writing the test cases and the traceability matrix.',
    why: 'The expensive part is no longer writing the change. It is proving that nothing else broke, on a system where every prior test result has just been invalidated.',
  },
  {
    key: 'live',
    label: 'In production',
    mult: 60,
    hours: '240 hours',
    what: 'A patch, a data migration for payments already approved under the old rule, a release window and a support plan.',
    why: 'Real data now exists in the shape of the mistake. The migration, the rollback plan and the out-of-hours release are usually larger than the change itself, and none of it was in anybody’s estimate.',
  },
];

const W = 560;
const H = 196;
const PAD = { t: 22, r: 18, b: 42, l: 46 };
const MAXM = 60;

export default function CostOfChangeCurve() {
  const [i, setI] = useState(0);
  const p = PHASES[i];

  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;
  const bw = pw / PHASES.length;
  // A log scale, because a linear one flattens the first four bars into the
  // axis and the whole point is that the early phases are nearly free.
  const barH = (m: number) => (Math.log(m) / Math.log(MAXM)) * ph;

  return (
    <div className="bt-sim">
      <div className="bt-sim__grid">
        <div>
          <p className="bt-sim__label">When the change arrives</p>
          <ul className="bt-sim__choices">
            {PHASES.map((x, idx) => (
              <li key={x.key}>
                <button type="button" className="bt-sim__choice" aria-pressed={i === idx} onClick={() => setI(idx)}>
                  <b>{x.label}</b>
                  <span>{x.what}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="bt-counter" style={{ marginTop: 22 }} aria-live="polite">
            <b className="bt-tnum">{p.mult}×</b>
            <span>What the same change costs here — about {p.hours} of work, against four hours at the start.</span>
          </div>
        </div>

        <div className="bt-sim__stage">
          <svg viewBox={`0 0 ${W} ${H}`} role="img"
            aria-label={`Cost of the same change by phase, on a logarithmic scale: requirements one times, design three times, build eight times, test twenty times, in production sixty times. Currently showing ${p.label} at ${p.mult} times.`}>
            <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + ph} y2={PAD.t + ph} stroke="var(--ink-300)" strokeWidth="1" />
            <text x={PAD.l - 10} y={PAD.t + 6} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-400)">60×</text>
            <text x={PAD.l - 10} y={PAD.t + ph} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-400)">1×</text>

            {PHASES.map((x, idx) => {
              const bx = PAD.l + idx * bw + bw * 0.18;
              const bwid = bw * 0.64;
              const h = Math.max(barH(x.mult), 3);
              const on = idx === i;
              return (
                <g key={x.key}>
                  <rect
                    x={bx} y={PAD.t + ph - h} width={bwid} height={h} rx="6"
                    fill={on ? 'var(--accent-500)' : 'var(--accent-100)'}
                    style={{ transition: 'fill 200ms' }}
                  >
                    <title>{`${x.label}: ${x.mult}× (${x.hours})`}</title>
                  </rect>
                  <text x={bx + bwid / 2} y={PAD.t + ph - h - 7} textAnchor="middle" fontSize="10.5" fontWeight="800"
                    fontFamily="var(--font-display)" fill={on ? 'var(--accent-600)' : 'var(--ink-300)'}>{x.mult}×</text>
                  <text x={bx + bwid / 2} y={PAD.t + ph + 15} textAnchor="middle" fontSize="9.5"
                    fontFamily="var(--font-body)" fill={on ? 'var(--ink-900)' : 'var(--ink-400)'}>{x.label}</text>
                </g>
              );
            })}
            <text x={PAD.l} y={H - 10} fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-400)">logarithmic scale — a linear one hides the first four bars entirely</text>
          </svg>

          <p className="bt-sim__caption">One change: payments over $10,000 need a second approver</p>
        </div>
      </div>

      <div className={`bt-verdict${i >= 3 ? ' bt-verdict--bad' : i === 0 ? ' bt-verdict--good' : ''}`} style={{ marginTop: 20 }} aria-live="polite">
        <strong>{p.label} · {p.mult}× · {p.hours}</strong>
        {p.why}
      </div>

      <p className="cc__tally">
        This curve is the entire argument between the methodologies. Waterfall answers it by trying to be right the
        first time; Spiral answers it by attacking the riskiest unknown first; Agile answers it by never letting a
        decision get more than a fortnight old.
      </p>
    </div>
  );
}
