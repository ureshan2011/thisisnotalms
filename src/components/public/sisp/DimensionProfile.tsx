import { useState } from 'react';

// ─── The six process dimensions, as a profile ─────────────────────────────
// Segars, Grover and Teng describe a planning process along six dimensions.
// The finding students most often miss is that the best process is not the
// one scoring highest on every dimension — it is a specific balanced shape,
// Rational Adaptation, and the two halves of that shape do different jobs.
//
// So this is drawn as a profile rather than six independent switches: each
// dimension is a two-ended scale, and the ring on one end marks where
// Rational Adaptation sits. A process that is off reads as "the rings are
// all over on the other side", which is the diagnosis, without anybody
// having to hold six values in their head at once.
//
// Index 0 of every pole pair is that dimension's Rational Adaptation
// setting, which is what lets the diagnosis below be "which ones are not at
// index 0" rather than a table of special cases.

export type DimKey = 'comp' | 'form' | 'focus' | 'flow' | 'part' | 'cons';
type Half = 'Rational' | 'Adaptive';

export const DIMENSIONS: {
  key: DimKey;
  name: string;
  ask: string;
  half: Half;
  poles: [string, string];
  notes: [string, string];
}[] = [
  {
    key: 'comp',
    name: 'Comprehensiveness',
    ask: 'How wide a range of alternatives does the process canvass?',
    half: 'Rational',
    poles: ['Thorough', 'Partial'],
    notes: [
      'Alternatives canvassed widely, evaluation data sought out, risks weighed, contingencies set in advance.',
      'One or two obvious options, little evaluation data, risk handled if and when it arrives.',
    ],
  },
  {
    key: 'form',
    name: 'Formalization',
    ask: 'Written procedure, or whoever happens to be in the room?',
    half: 'Rational',
    poles: ['Written', 'Ad hoc'],
    notes: [
      'Explicit policies and recognised pathways for collecting information. A process that survives a change of staff.',
      'Conversation and precedent. Fast, and unrepeatable.',
    ],
  },
  {
    key: 'focus',
    name: 'Focus',
    ask: 'Protecting assets, or nurturing new ideas?',
    half: 'Rational',
    poles: ['Integrative', 'Innovative'],
    notes: [
      'Budgetary control, cost performance and asset protection lead. Discipline over novelty.',
      'Novel and creative solutions lead. Neither end is wrong — they pull in opposite directions.',
    ],
  },
  {
    key: 'flow',
    name: 'Flow',
    ask: 'Where does planning authority sit?',
    half: 'Rational',
    poles: ['Top-down', 'Bottom-up'],
    notes: [
      'Centralised, initiated by upper management, able to commit organisation-wide resources.',
      'Functional managers initiate plans, which are aggregated upward.',
    ],
  },
  {
    key: 'part',
    name: 'Participation',
    ask: 'Who co-designs the plan, rather than being told about it?',
    half: 'Adaptive',
    poles: ['Broad', 'Narrow'],
    notes: [
      'A diverse set of functional areas is in the room while the decisions are still open.',
      'An isolated planning team decides and everyone else is informed. Surveying staff afterwards does not count.',
    ],
  },
  {
    key: 'cons',
    name: 'Consistency',
    ask: 'How often does the planning cycle come round?',
    half: 'Adaptive',
    poles: ['Continuous', 'Once a year'],
    notes: [
      'Embedded in operations, with constant communication and iterative evaluation.',
      'Sporadic and largely ad hoc, often a single annual event.',
    ],
  },
];

// The course's worked example: a mid-sized firm running an annual, top-down
// IT plan, comprehensive and formally documented, with business units
// informed of the priorities rather than consulted while they are set.
const DEFAULT_PICKS: Record<DimKey, 0 | 1> = { comp: 0, form: 0, focus: 0, flow: 0, part: 1, cons: 1 };

export default function DimensionProfile() {
  const [picks, setPicks] = useState<Record<DimKey, 0 | 1>>(DEFAULT_PICKS);

  const missing = DIMENSIONS.filter(d => picks[d.key] === 1);
  const missingRational = missing.filter(d => d.half === 'Rational');
  const missingAdaptive = missing.filter(d => d.half === 'Adaptive');
  const rational = 4 - missingRational.length;
  const adaptive = 2 - missingAdaptive.length;
  const names = (list: typeof DIMENSIONS) => list.map(d => d.name.toLowerCase()).join(', ');

  let tone = '';
  let label = '';
  let why = '';

  if (missing.length === 0) {
    tone = ' bt-verdict--good';
    label = 'Rational Adaptation';
    why =
      'Comprehensiveness, formalization, an integrative focus and top-down flow give the process discipline and accountability. Broad participation and a continuous cycle stop that discipline calcifying into something the organisation no longer recognises. This balanced profile, not a maximum on every dimension, is what the research associates with the strongest planning performance.';
  } else if (missingRational.length === 0) {
    label = 'Rational, but not adaptive';
    why = `Every Rational Tendency is in place and ${missingAdaptive.length === 1 ? 'one Adaptive Tendency is' : 'both Adaptive Tendencies are'} missing — ${names(missingAdaptive)}. This produces a thorough, well-documented plan that is out of date within a year, because nothing in the process notices the organisation changing. The prescription is not to abandon the discipline: it is to widen participation earlier in the cycle and shorten the interval between reviews.`;
  } else if (missingAdaptive.length === 0) {
    label = 'Adaptive, but not rational';
    why = `Participation and cycle frequency are right, but ${names(missingRational)} ${missingRational.length === 1 ? 'is' : 'are'} missing. Continuous, broadly consulted activity with no discipline behind it is motion without a plan — plenty of meetings, and no traceable line from any one decision to a strategic goal.`;
  } else if (missing.length >= 4) {
    tone = ' bt-verdict--bad';
    label = 'Neither half is in place';
    why = `Short on both sides: ${names(missing)}. What is left is a sequence of individual IT purchases. There is no planning process here to evaluate, which is the most common finding when an organisation is asked to show its IS strategy.`;
  } else {
    label = 'Short on both sides';
    why = `${names(missing)} ${missing.length === 1 ? 'is' : 'are'} at the weaker pole, across both halves of the profile. Fix the Rational side first: discipline without breadth still produces a plan, while breadth without discipline produces none.`;
  }

  return (
    <div>
      <div className="bt-scale">
        {DIMENSIONS.map(d => (
          <div className="bt-scale__row" key={d.key}>
            <span className="bt-scale__name">
              {d.name}
              <span className="bt-scale__ask">{d.ask}</span>
            </span>
            <div className="bt-scale__track">
              {d.poles.map((pole, i) => (
                <button
                  key={pole}
                  type="button"
                  className={`bt-scale__end${i === 0 ? ' bt-scale__ref' : ''}`}
                  aria-pressed={picks[d.key] === i}
                  aria-label={`${d.name}: ${pole}${i === 0 ? ', the Rational Adaptation setting' : ''}`}
                  onClick={() => setPicks(p => ({ ...p, [d.key]: i as 0 | 1 }))}
                >
                  {pole}
                </button>
              ))}
            </div>
            <p className="bt-scale__note">{d.notes[picks[d.key]]}</p>
          </div>
        ))}
      </div>

      <p className="bt-note" style={{ marginTop: 16 }}>
        The small ring marks where Rational Adaptation sits on each scale.
      </p>

      <div className="bt-meters">
        <div className="bt-meter">
          <div className="bt-meter__head">
            <span className="bt-meter__name">Rational Tendencies</span>
            <span className="bt-meter__val bt-tnum">{rational} / 4</span>
          </div>
          <span className="bt-bar" aria-hidden="true"><i style={{ width: `${(rational / 4) * 100}%` }} /></span>
          <p className="bt-meter__note">Comprehensiveness, formalization, integrative focus, top-down flow. This half supplies discipline and accountability.</p>
        </div>
        <div className="bt-meter">
          <div className="bt-meter__head">
            <span className="bt-meter__name">Adaptive Tendencies</span>
            <span className="bt-meter__val bt-tnum">{adaptive} / 2</span>
          </div>
          <span className="bt-bar" aria-hidden="true"><i style={{ width: `${(adaptive / 2) * 100}%` }} /></span>
          <p className="bt-meter__note">Broad participation, continuous cycle. This half stops the discipline hardening into a plan nobody updates.</p>
        </div>
      </div>

      <div className={`bt-verdict${tone}`} style={{ marginTop: 20 }} aria-live="polite">
        <strong>{label}</strong>
        {why}
      </div>
    </div>
  );
}
