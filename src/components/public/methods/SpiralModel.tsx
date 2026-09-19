import { useState } from 'react';

// ─── Boehm's spiral, one quadrant at a time (MBI804 · Lesson 2.3) ─────────
// The spiral is the model students most often describe as "Waterfall but
// round", so this walks it as what it actually is: the same four activities
// repeated, with each loop spending real money to remove the largest risk
// still standing before anything is committed to.
//
// Twelve steps — three cycles of four quadrants — on SecurePay NZ's move to
// real-time payments, the scenario the cost-management lecture already uses.
// Two readouts move as you go: how much of the risk has been bought down,
// and how much has been spent buying it. The second is the criticism of the
// model, and it is shown rather than argued.

interface Step {
  quadrant: 0 | 1 | 2 | 3;
  cycle: 1 | 2 | 3;
  title: string;
  body: string;
  /** Share of the project's original risk still unresolved, after this step. */
  risk: number;
  /** Cumulative spend, in thousands of dollars. */
  spend: number;
}

const QUADRANTS = [
  'Determine objectives',
  'Identify and resolve risks',
  'Develop and verify',
  'Plan the next cycle',
];

/** The same four, broken where the label should wrap in the drawing. */
const QUADRANT_LINES: [string, string][] = [
  ['Determine', 'objectives'],
  ['Identify and', 'resolve risks'],
  ['Develop', 'and verify'],
  ['Plan the', 'next cycle'],
];

const STEPS: Step[] = [
  {
    quadrant: 0, cycle: 1,
    title: 'What the first loop is for',
    body: 'Objectives: prove a payment can clear in under five seconds without breaking settlement. Constraints: the bank’s certification window opens twice a year, and the existing ledger is batch-only. Alternatives: extend the ledger, buy a rails provider, or build alongside and cut over. Nothing is committed yet — this quadrant produces a question, not a plan.',
    risk: 100, spend: 15,
  },
  {
    quadrant: 1, cycle: 1,
    title: 'The scariest unknown, prototyped first',
    body: 'The biggest risk is not the user interface. It is whether settlement reconciles when payments arrive continuously instead of in a nightly batch. Two weeks of throwaway code against a copy of last month’s ledger answers it. This is the move that makes the spiral the spiral: the risk analysis chooses what gets built next.',
    risk: 72, spend: 55,
  },
  {
    quadrant: 2, cycle: 1,
    title: 'Build only what the risk needed',
    body: 'A prototype reconciles a day of real volume, and finds that 0.4% of payments arrive out of order. Verified against the operations team’s own reconciliation, not against the developers’ expectations. The prototype is not the product, and nobody pretends it is — its job was to make the unknown measurable.',
    risk: 58, spend: 90,
  },
  {
    quadrant: 3, cycle: 1,
    title: 'Fund the next loop, or stop',
    body: 'Review with the sponsor: $90,000 spent, the settlement risk halved, and an out-of-order problem nobody had listed. A stop here would have cost $90,000 and saved several million. That is the option Waterfall does not offer at month three, and it is the reason the spiral exists.',
    risk: 58, spend: 90,
  },
  {
    quadrant: 0, cycle: 2,
    title: 'Objectives, revised by what loop one found',
    body: 'The goal changes: clear in five seconds and reconcile out-of-order arrivals within the same business day. The constraint list gains an ordering guarantee the team did not know they needed. Notice that the objectives moved — in a signed specification this would have been a variation, and here it is the expected output of a cycle.',
    risk: 58, spend: 110,
  },
  {
    quadrant: 1, cycle: 2,
    title: 'The next largest risk',
    body: 'With settlement understood, the biggest remaining unknown is fraud: a real-time rail removes the overnight window in which the current rules run. A shadow model is run against six months of historical payments — no customer sees it, and it costs a fraction of building the real thing wrong.',
    risk: 34, spend: 175,
  },
  {
    quadrant: 2, cycle: 2,
    title: 'Build the slice that proves it',
    body: 'A working real-time path for one payment type, with the fraud model scoring in line and an operations dashboard behind it. Verified by running it in parallel with the batch system for a fortnight and comparing every decision. Still not shipped to customers — verification here means evidence, not a launch.',
    risk: 26, spend: 240,
  },
  {
    quadrant: 3, cycle: 2,
    title: 'The second funding decision',
    body: 'A quarter of a million spent and roughly three quarters of the original risk gone. The board now has something Waterfall would not hand them until testing: a defensible estimate for the rest of the work, built from two cycles of measured evidence rather than from optimism.',
    risk: 26, spend: 240,
  },
  {
    quadrant: 0, cycle: 3,
    title: 'Objectives for the loop that ships',
    body: 'All payment types, the bank’s certification, and a cutover plan that can be reversed. The remaining unknowns are now mostly scheduling and integration, which is exactly the point at which a spiral stops being worth its overhead.',
    risk: 26, spend: 265,
  },
  {
    quadrant: 1, cycle: 3,
    title: 'What is left to be afraid of',
    body: 'Certification is a date risk rather than a technical one: miss the window and the project waits six months. The response is not a prototype but a transfer — a contractual commitment from the rails provider, with the penalty sized against the delay.',
    risk: 14, spend: 300,
  },
  {
    quadrant: 2, cycle: 3,
    title: 'Build the release',
    body: 'The full system, tested and certified, with the batch path kept warm for rollback. By this loop the work looks like an ordinary delivery phase — because the uncertainty that made the earlier loops necessary has already been spent down.',
    risk: 6, spend: 520,
  },
  {
    quadrant: 3, cycle: 3,
    title: 'And the bill for all of it',
    body: 'Three cycles, $520,000, and a system whose risks were retired in the order of how much they could hurt. The criticism is on the same screen: the overhead of a full risk analysis every loop is real, and on a project whose unknowns are small it buys almost nothing. Spiral earns its cost where being wrong is expensive — payments, aerospace, medical devices — and wastes it everywhere else.',
    risk: 6, spend: 520,
  },
];

const CX = 150;
const CY = 158;

// The spiral starts pointing left from the centre and turns clockwise, so
// a quarter turn lands in each quadrant in Boehm's own order: objectives,
// risks, develop, plan. `GROWTH` is set so twelve quarter-turns finish just
// inside the drawing rather than off the edge of it.
const GROWTH = 6.3;
const START = Math.PI;

function point(t: number): [number, number] {
  const r = 10 + t * GROWTH;
  return [CX + r * Math.cos(START + t), CY + r * Math.sin(START + t)];
}

/** The spiral path, drawn up to `tEnd` radians from the centre. */
function spiralPath(tEnd: number): string {
  const pts: string[] = [];
  for (let t = 0; t <= tEnd; t += 0.05) {
    const [x, y] = point(t);
    pts.push(`${pts.length === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export default function SpiralModel() {
  const [i, setI] = useState(0);
  const s = STEPS[i];

  // Each step is a quarter turn, so the drawing and the stepper stay locked.
  const tEnd = (i + 1) * (Math.PI / 2);
  const [hx, hy] = point(tEnd);

  return (
    <div className="bt-walk bt-walk--wide">
      <div>
        <svg viewBox="0 0 300 320" width="100%" style={{ display: 'block' }}
          role="img"
          aria-label={`Spiral model, step ${i + 1} of 12. Cycle ${s.cycle}, quadrant ${s.quadrant + 1}: ${QUADRANTS[s.quadrant]}. The spiral has been drawn ${((i + 1) / 4).toFixed(2)} turns out from the centre.`}>
          {/* The four quadrants, as fields rather than boxes. The active one
              is filled, so where you are on the loop is readable before any
              of the labels are. */}
          {[0, 1, 2, 3].map(q => {
            const on = q === s.quadrant;
            const x = q === 1 || q === 2 ? CX : 6;
            const y = q === 2 || q === 3 ? CY : 16;
            return (
              <rect key={q} x={x} y={y} width={144} height={142}
                fill={on ? 'var(--accent-50)' : 'transparent'} stroke="var(--border-subtle)" strokeWidth="1" />
            );
          })}

          {QUADRANT_LINES.map((lines, idx) => {
            const on = idx === s.quadrant;
            // Each label sits in its quadrant's outer corner, away from the
            // centre: by the twelfth step the coil fills most of the frame,
            // and a label hung off the centre divider ends up written across
            // the outermost loop.
            const anchors: [number, number, 'start' | 'end'][] = [
              [10, 32, 'start'],
              [290, 32, 'end'],
              [290, 276, 'end'],
              [10, 276, 'start'],
            ];
            const [x, y, anchor] = anchors[idx];
            return (
              <g key={QUADRANTS[idx]}>
                {lines.map((line, li) => (
                  <text key={line} x={x} y={y + li * 13} textAnchor={anchor}
                    fontSize="10.5" fontWeight={on ? 700 : 500}
                    fontFamily={on ? 'var(--font-display)' : 'var(--font-body)'}
                    fill={on ? 'var(--accent-700)' : 'var(--ink-400)'}>
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          <path d={spiralPath(tEnd)} fill="none" stroke="var(--accent-500)" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx={CX} cy={CY} r="3.4" fill="var(--ink-900)" />
          <circle cx={hx} cy={hy} r="6" fill="var(--accent-500)" stroke="var(--paper-0)" strokeWidth="2" />

          <text x={CX} y="312" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--ink-400)">
            cycle {s.cycle} · radius is cumulative spend
          </text>
        </svg>
        <p className="bt-sim__caption">
          The radius is money already spent. Every loop is wider than the one before, which is why the decision to
          fund another one sits at the end of each.
        </p>
      </div>

      <div className="bt-walk__panel">
        <p className="bt-eyebrow">Cycle {s.cycle} · {QUADRANTS[s.quadrant]}</p>
        <h3>{s.title}</h3>
        <p className="bt-walk__body">{s.body}</p>

        <div className="bt-meters" style={{ marginTop: 22 }}>
          <div className="bt-meter">
            <div className="bt-meter__head">
              <span className="bt-meter__name">Risk still unresolved</span>
              <span className="bt-meter__val bt-tnum">{s.risk}%</span>
            </div>
            <span className="bt-bar" aria-hidden="true"><i style={{ width: `${s.risk}%` }} /></span>
            <p className="bt-meter__note">Share of what nobody could answer on day one.</p>
          </div>
          <div className="bt-meter">
            <div className="bt-meter__head">
              <span className="bt-meter__name">Spent to get here</span>
              <span className="bt-meter__val bt-tnum">${s.spend}k</span>
            </div>
            <span className="bt-bar" aria-hidden="true"><i style={{ width: `${(s.spend / 520) * 100}%` }} /></span>
            <p className="bt-meter__note">Risk analysis is not free. This is the model’s standing criticism.</p>
          </div>
        </div>

        <div className="bt-walk__nav">
          <button type="button" className="bt-btn bt-btn--tertiary bt-btn--sm" disabled={i === 0} onClick={() => setI(n => Math.max(0, n - 1))}>
            Back
          </button>
          <button type="button" className="bt-btn bt-btn--sm" disabled={i === STEPS.length - 1} onClick={() => setI(n => Math.min(STEPS.length - 1, n + 1))}>
            {i === STEPS.length - 1 ? 'End of the third cycle' : `Next · ${QUADRANTS[STEPS[i + 1].quadrant]}`}
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
