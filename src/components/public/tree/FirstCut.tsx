import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BEST_SEPARATION, BILL_MIN, BY_BILL, BY_CONTRACT, BY_FIBER, BY_TENURE, TRAIN, separation, sum,
} from './treeData';

// ─── Make the first cut yourself ──────────────────────────────────────────
// A decision tree's whole job is choosing questions. This widget hands that
// job to the student: pick a question, see the 5,634 training customers fall
// into a "yes" pile and a "no" pile, and see how cleanly the leavers ended up
// on one side. For the two number questions, the student also picks the
// cut-off with a slider, which is exactly what the tree tries for every
// column.
//
// The score is the tree's own yardstick (Gini impurity, see treeData),
// rescaled so the best first question in this data scores 100. Students
// who hunt for a better tenure cut-off top out at 64, which is the point:
// the contract question really is the best place to start.

type Q = 'contract' | 'fibre' | 'tenure' | 'bill';

const fmt = (n: number) => n.toLocaleString('en-NZ');
const pct = ([s, l]: [number, number]) => (s + l === 0 ? 0 : l / (s + l));

function Pile({ label, counts }: { label: string; counts: [number, number] }) {
  const reduce = useReducedMotion();
  const share = pct(counts);
  const n = counts[0] + counts[1];
  return (
    <div className="dt-pile">
      <p className="dt-pile__label">{label}</p>
      <p className="dt-pile__n bt-tnum">{fmt(n)} <span>customers</span></p>
      <div className="dt-stack" aria-hidden="true">
        <motion.i className="dt-stack__leave" animate={{ width: `${share * 100}%` }} transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />
      </div>
      <p className="dt-pile__share">
        <span><b className="bt-tnum">{Math.round(share * 100)}%</b> left</span>
        <span className="bt-tnum">{fmt(counts[1])} of {fmt(n)}</span>
      </p>
    </div>
  );
}

export default function FirstCut() {
  const [q, setQ] = useState<Q | null>(null);
  const [months, setMonths] = useState(6);
  const [bill, setBill] = useState(60);
  const [revealed, setRevealed] = useState(false);

  let yes: [number, number] = [0, 0];
  let yesLabel = '';
  let noLabel = '';
  if (q === 'contract') {
    yes = BY_CONTRACT.monthToMonth;
    yesLabel = 'Yes: month-to-month';
    noLabel = 'No: one- or two-year contract';
  } else if (q === 'fibre') {
    yes = BY_FIBER.fibre;
    yesLabel = 'Yes: fibre internet';
    noLabel = 'No: DSL or no internet';
  } else if (q === 'tenure') {
    yes = sum(BY_TENURE.slice(0, months + 1));
    yesLabel = `Yes: ${months} month${months === 1 ? '' : 's'} or less`;
    noLabel = `No: more than ${months} month${months === 1 ? '' : 's'}`;
  } else if (q === 'bill') {
    yes = sum(BY_BILL.slice(bill - BILL_MIN));
    yesLabel = `Yes: $${bill} a month or more`;
    noLabel = `No: under $${bill} a month`;
  }
  const no: [number, number] = [TRAIN.stay - yes[0], TRAIN.leave - yes[1]];
  const score = q ? Math.round((100 * separation(yes, no)) / BEST_SEPARATION) : 0;

  const verdict =
    score >= 95 ? 'As clean as a first question gets in this data.'
    : score >= 60 ? 'A good question. Leavers pile up on one side. Can you find a better one?'
    : score >= 30 ? 'It helps a little. Both piles are still quite mixed.'
    : 'Barely helps. Both piles look a lot like the whole crowd.';

  const options: { id: Q; label: string }[] = [
    { id: 'contract', label: 'Month-to-month contract?' },
    { id: 'fibre', label: 'Fibre internet?' },
    { id: 'tenure', label: 'A customer for N months or less?' },
    { id: 'bill', label: 'Monthly bill of $X or more?' },
  ];

  return (
    <div className="dt-cut">
      <div className="dt-cut__crowd">
        <p className="bt-sim__label">Before any question</p>
        <p><b className="bt-tnum">5,634</b> customers to learn from. <b className="bt-tnum">{Math.round(pct([TRAIN.stay, TRAIN.leave]) * 100)}%</b> of them left.</p>
      </div>

      <p className="bt-sim__label" style={{ marginTop: 18 }}>Pick a first question</p>
      <div className="lr-pills" role="group" aria-label="Pick a first question">
        {options.map(o => (
          <button key={o.id} type="button" aria-pressed={q === o.id} onClick={() => setQ(o.id)}>{o.label}</button>
        ))}
      </div>

      {q === 'tenure' && (
        <div className="lr-field">
          <div className="lr-field__head"><label htmlFor="cut-months">N, the cut-off in months</label><span className="lr-field__val">{months}</span></div>
          <input id="cut-months" type="range" min={0} max={71} value={months} onChange={e => setMonths(Number(e.target.value))} />
        </div>
      )}
      {q === 'bill' && (
        <div className="lr-field">
          <div className="lr-field__head"><label htmlFor="cut-bill">X, the cut-off in dollars</label><span className="lr-field__val">${bill}</span></div>
          <input id="cut-bill" type="range" min={19} max={118} value={bill} onChange={e => setBill(Number(e.target.value))} />
        </div>
      )}

      {q ? (
        <>
          <div className="dt-piles">
            <Pile label={yesLabel} counts={yes} />
            <Pile label={noLabel} counts={no} />
          </div>
          <div className="dt-score" aria-live="polite">
            <div>
              <p className="bt-sim__label">How cleanly it separates leavers</p>
              <div className="dt-score__bar" aria-hidden="true"><i style={{ width: `${score}%` }} /></div>
            </div>
            <b className="bt-tnum">{score}<span>/100</span></b>
            <p>{verdict}</p>
          </div>
        </>
      ) : (
        <p className="bt-note">Pick one of the four questions above to split the crowd into two piles.</p>
      )}

      <ul className="lr-legend" aria-hidden="true" style={{ marginTop: 14 }}>
        <li><i style={{ background: 'var(--cat-2)' }} /> left</li>
        <li><i style={{ background: 'var(--paper-300)' }} /> stayed</li>
      </ul>

      <div style={{ marginTop: 16 }}>
        <button type="button" className="lr-navbtn" aria-expanded={revealed} onClick={() => setRevealed(r => !r)}>
          {revealed ? 'Hide the tree’s pick' : 'Which question did the tree pick?'}
        </button>
        {revealed && (
          <div className="lr-q__ans" style={{ marginLeft: 0 }}>
            <b>Month-to-month contract.</b> It scores 100: no other single question in this data puts the leavers
            on one side as cleanly. The best months cut-off you can find (16 or less) scores 64, fibre scores 57, and
            the best bill cut-off scores 27. The tree tried every one of these, and every cut-off, and kept the best.
            That is all "training a tree" means.
          </div>
        )}
      </div>
    </div>
  );
}
