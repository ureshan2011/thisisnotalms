import { useState } from 'react';

// ─── Probability × impact, and then what you do about it ──────────────────
// The register grid every risk workshop draws on a whiteboard, made
// clickable: pick a cell, read the exposure, then choose one of the four
// responses and find out what that choice actually commits the project to.
//
// A note on the colour. The usual version of this grid is a green-amber-red
// heat map, which this design system does not permit — semantic colour here
// is a dot or a thin badge, never twenty large fills. So the grid is shaded
// along the page's own accent ramp instead. It reads better as data anyway:
// exposure is one quantity increasing in one direction, which is what a
// single-hue sequential scale is for, and the whole grid counts as this
// region's one accent object.

const LIKELIHOODS: [string, number][] = [
  ['Rare', 0.1],
  ['Unlikely', 0.25],
  ['Possible', 0.5],
  ['Likely', 0.7],
  ['Almost certain', 0.9],
];

// Listed high to low so the grid is drawn the way it is always drawn, with
// the worst consequence along the top.
const IMPACTS: [string, number][] = [
  ['Severe', 400_000],
  ['Major', 150_000],
  ['Moderate', 40_000],
  ['Minor', 5_000],
];

const RESPONSES = {
  avoid: {
    title: 'Avoid',
    body: 'Change the plan so the risk cannot occur: drop the feature, pick the integration you already know, extend the schedule so the dependency leaves the critical path. The only response that takes the exposure to zero, and the only one that costs you scope.',
  },
  transfer: {
    title: 'Transfer',
    body: 'Move the consequence to somebody equipped to carry it — insurance, a fixed-price contract, a managed service with the obligation written into it. The risk still happens. Somebody else pays for it, and you pay a premium for that.',
  },
  mitigate: {
    title: 'Mitigate',
    body: 'Reduce probability, impact, or both: a spike to de-risk the unknown integration, a staged rollout, an earlier load test. The most common response, and the one that needs a number attached — spending $60k to reduce a $20k exposure is a decision, usually the wrong one.',
  },
  accept: {
    title: 'Accept',
    body: 'Decide, deliberately and in writing, to carry it. Active acceptance sets aside a contingency reserve for exactly this. Passive acceptance does nothing and hopes. Both are called acceptance; only one of them is a plan.',
  },
} as const;

type ResponseKey = keyof typeof RESPONSES;

// Grid frame.
const CELL_W = 92;
const CELL_H = 46;
const PAD = { t: 26, l: 96 };
const W = PAD.l + CELL_W * LIKELIHOODS.length + 10;
const H = PAD.t + CELL_H * IMPACTS.length + 34;

const money = (n: number) => `$${n.toLocaleString('en-NZ')}`;
const short = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);

export default function RiskMatrix() {
  const [col, setCol] = useState(2);
  const [row, setRow] = useState(1);
  const [response, setResponse] = useState<ResponseKey>('mitigate');

  const probability = LIKELIHOODS[col][1];
  const impact = IMPACTS[row][1];
  const exposure = Math.round(probability * impact);
  const chosen = RESPONSES[response];

  // Shade by exposure against the worst cell on the grid, on a compressed
  // scale so the low end stays distinguishable rather than all reading white.
  const worst = LIKELIHOODS[LIKELIHOODS.length - 1][1] * IMPACTS[0][1];
  const shade = (p: number, i: number) => {
    const t = Math.pow((p * i) / worst, 0.45);
    if (t < 0.25) return 'var(--accent-50)';
    if (t < 0.45) return 'var(--accent-100)';
    if (t < 0.65) return 'var(--accent-200)';
    return 'var(--accent-300)';
  };

  const band =
    exposure >= 100_000
      ? 'Escalate it. An exposure this size belongs in the sponsor’s reporting, not only in the register.'
      : exposure >= 25_000
        ? 'Owner, response and review date in the register, checked every reporting cycle.'
        : 'Register it and review it. Not every risk earns a mitigation budget.';

  return (
    <div className="bt-sim">
      <div className="bt-sim__grid">
        <div>
          <p className="bt-sim__label">The register row</p>
          <p className="bt-note" style={{ marginTop: 10 }}>
            <b style={{ color: 'var(--ink-900)' }}>R-04 · The payment vendor’s sandbox does not match production.</b><br />
            Found in week two of the SecurePay NZ integration. Click the grid to place it.
          </p>

          <div className="bt-counter" style={{ marginTop: 22 }} aria-live="polite">
            <b className="bt-tnum">{money(exposure)}</b>
            <span>
              Expected monetary value: {Math.round(probability * 100)}% × {money(impact)}. {band}
            </span>
          </div>

          <p className="bt-note" style={{ marginTop: 16 }}>
            The number is not a prediction. It is what lets two risks be compared, and what makes a mitigation
            costing more than the exposure visible as the bad trade it is.
          </p>
        </div>

        <div className="bt-sim__stage">
          <svg viewBox={`0 0 ${W} ${H}`} aria-label={`Risk grid, likelihood across and impact down. Selected: ${LIKELIHOODS[col][0]} likelihood, ${IMPACTS[row][0]} impact, exposure ${money(exposure)}.`}>
            <text x="4" y="14" fontSize="9" letterSpacing="1.3" fontWeight="700" fontFamily="var(--font-body)" fill="var(--ink-400)">IMPACT</text>

            {IMPACTS.map(([iName, iValue], r) =>
              LIKELIHOODS.map(([lName, lValue], c) => {
                const on = r === row && c === col;
                const x = PAD.l + c * CELL_W;
                const y = PAD.t + r * CELL_H;
                return (
                  <g
                    key={`${r}-${c}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={on}
                    aria-label={`${lName} likelihood, ${iName} impact, exposure ${money(Math.round(lValue * iValue))}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setRow(r); setCol(c); }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRow(r); setCol(c); }
                    }}
                  >
                    <rect
                      x={x + 1.5} y={y + 1.5} width={CELL_W - 3} height={CELL_H - 3} rx="7"
                      fill={on ? 'var(--accent-500)' : shade(lValue, iValue)}
                      stroke={on ? 'var(--accent-600)' : 'var(--paper-50)'}
                      strokeWidth={on ? 2 : 1.5}
                    />
                    <text
                      x={x + CELL_W / 2} y={y + CELL_H / 2 + 4} textAnchor="middle"
                      fontSize="11" fontFamily="var(--font-mono)"
                      fill={on ? '#fff' : 'var(--accent-700)'}
                      style={{ pointerEvents: 'none' }}
                    >
                      {short(Math.round(lValue * iValue))}
                    </text>
                  </g>
                );
              }),
            )}

            {IMPACTS.map(([iName, iValue], r) => (
              <text key={iName} x={PAD.l - 10} y={PAD.t + r * CELL_H + CELL_H / 2 + 4} textAnchor="end" fontSize="10.5" fontFamily="var(--font-body)" fill={r === row ? 'var(--ink-900)' : 'var(--ink-400)'} fontWeight={r === row ? 700 : 400}>
                {iName} · {short(iValue)}
              </text>
            ))}
            {LIKELIHOODS.map(([lName, lValue], c) => (
              <g key={lName}>
                <text x={PAD.l + c * CELL_W + CELL_W / 2} y={H - 18} textAnchor="middle" fontSize="10.5" fontFamily="var(--font-body)" fill={c === col ? 'var(--ink-900)' : 'var(--ink-400)'} fontWeight={c === col ? 700 : 400}>
                  {lName}
                </text>
                <text x={PAD.l + c * CELL_W + CELL_W / 2} y={H - 6} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--ink-300)">
                  {Math.round(lValue * 100)}%
                </text>
              </g>
            ))}
          </svg>
          <p className="bt-sim__caption">Each cell is likelihood × impact · click to place the risk</p>
        </div>
      </div>

      <p className="bt-sim__label" style={{ marginTop: 24 }}>Now choose a response</p>
      <div className="bt-chiprow">
        {(Object.keys(RESPONSES) as ResponseKey[]).map(key => (
          <button key={key} type="button" className="bt-ctxchip" aria-pressed={response === key} onClick={() => setResponse(key)}>
            {RESPONSES[key].title}
          </button>
        ))}
      </div>

      <div className="bt-verdict" style={{ marginTop: 16 }} aria-live="polite">
        <strong>{chosen.title}</strong>
        {chosen.body}
      </div>

      <p className="bt-note" style={{ marginTop: 16 }}>
        A register row is not finished until it has an owner, a response, a trigger to watch for and a review date.
        The 40% assessment on this course is a risk management plan, and that is what it is marked against.
      </p>
    </div>
  );
}
