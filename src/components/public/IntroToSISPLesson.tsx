import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Reveal, SaveAsPdf, SectionHead } from '../blend';
import { SISP_NOTES } from '../../content/notes/mbi800Sisp';

// ─── MBI800: Strategic Information Systems Planning ───────────────────────
// A public, ungated course intro page in Blended Teaching Content's
// course-page design system, Blend (src/components/blend/README.md), running
// on MBI800's indigo through the `planning` accent set by the shell.
//
// The material is the course's own: the Iceberg Model and the collections /
// systems distinction from the systems-thinking chapter, the Segars, Grover
// and Teng definition and the six process dimensions from the SISP
// foundations chapter, and the learning outcomes, content list and
// assessment weightings verbatim from the MBI800 course descriptor.
//
// Like the other course intros, nothing here is pinned to a session number
// or a calendar day. It is written to be read before the first class, by
// somebody who may not have enrolled yet.

const BASE = import.meta.env.BASE_URL;

// Verbatim from the MBI800 course descriptor.
const LEARNING_OUTCOMES = [
  {
    n: 'LO1',
    short: 'Read the system you have',
    body: 'Assess current information systems to identify strategic opportunities and associated risks for improvement in a business context.',
  },
  {
    n: 'LO2',
    short: 'Weigh culture and privacy',
    body: 'Evaluate the impact of cultural protocols and data privacy on the successful implementation of information systems in diverse cultural settings.',
  },
  {
    n: 'LO3',
    short: 'Write the plan',
    body: 'Develop strategic plans to align information systems with organisational goals in a business context.',
  },
];

const COURSE_PATH = [
  { code: 'MBI800', label: 'You are here' },
  { code: 'MBI801', label: 'Systems analysis and design' },
  { code: 'MBI802', label: 'Database management systems' },
  { code: 'MBI803', label: 'Research methods' },
  { code: 'MBI804', label: 'Needs MBI800 underneath it' },
];

const ASSESSMENTS: [string, string, string][] = [
  ['60%', 'Strategic Information Systems Planning report', 'Individual · assesses LO1 and LO3'],
  ['40%', 'Case study analysis: cultural and ethical analysis in information systems implementation', 'Individual · assesses LO2'],
];

// The indicative content from the descriptor, in teaching order.
const COURSE_CONTENT = [
  'Understanding information systems and their role in organisations',
  'Critical understanding of how information systems shape and influence organisational strategy',
  'Strategic Information Systems Planning (SISP)',
  'Methods and tools for conducting SISP',
  'Challenges and risks in SISP',
  'Risk management strategies in IS planning: technological failure, data breaches, resource constraints',
  'Case studies of successful SISP implementations',
  'Case studies of implementations respecting cultural protocols and data privacy',
  'Designing culturally appropriate information services',
  'IT trends and emerging technologies',
  'Future trends in SISP and its impact on business analytics and healthcare informatics',
];

// The four Iceberg layers, worked through one documented incident. The
// CrowdStrike content update of 19 July 2024 is the case the course uses,
// because the event layer was reported everywhere and the three layers
// underneath it were reported almost nowhere.
const ICEBERG = [
  {
    title: 'Event',
    kicker: 'What happened',
    body: 'On 19 July 2024 a faulty content update from a security vendor crashed Windows machines worldwide. Flights were grounded, hospital systems went dark, payment terminals stopped. This is the layer that gets reported, and the only one visible without going looking for the rest.',
    ask: 'React to it, and you restore service. Nothing else changes.',
  },
  {
    title: 'Patterns of behaviour',
    kicker: 'What has been happening',
    body: 'Now ask what keeps happening, rather than what happened once. Outages of this class cluster around urgent updates pushed outside the normal review window, in every vendor, for years. Seen as a pattern, the single event stops looking like bad luck and starts looking like a schedule.',
    ask: 'Patterns are where a one-off becomes a trend you can plan against.',
  },
  {
    title: 'Structures',
    kicker: 'What makes the pattern possible',
    body: 'The policies, architecture, workflows and resource allocations underneath: kernel-level deployment with no staged rollout, no canary ring, and a channel classified as content rather than as code so it skipped the review that code gets.',
    ask: 'Change a structure and you change every future event it produces.',
  },
  {
    title: 'Mental models',
    kicker: 'What holds the structures in place',
    body: 'The belief that made those structures reasonable to the people who built them: that a vendor security update is low-risk enough not to need staged deployment. Nobody wrote that down. Everybody acted on it.',
    ask: 'The deepest layer, the least visible, and the one with the most leverage.',
  },
];

// The swap test: remove or change one part and see whether the rest cares.
const SORT_ITEMS = [
  {
    thing: 'A bowl of fruit',
    verdict: 'Collection',
    why: 'Take the apple out and the pears carry on being pears. The items co-exist without interacting, so nothing about the whole depends on any one of them.',
  },
  {
    thing: 'A football team',
    verdict: 'System',
    why: 'Remove one player mid-match and every other player’s role shifts. The behaviour — winning, losing, holding a shape — belongs to the whole, not to any player in it.',
  },
  {
    thing: 'A toolbox',
    verdict: 'Collection',
    why: 'A hammer does not change what the screwdriver does. Useful together, but they do not interact, so the box produces no behaviour of its own.',
  },
  {
    thing: 'A kitchen',
    verdict: 'System',
    why: 'Oven, fridge, bench and the person working across them interact to produce a meal. Take the fridge out and the whole way the room is used changes.',
  },
  {
    thing: 'A toaster',
    verdict: 'System',
    why: 'A small one. Heating element, timer and lever interact to produce toast — an outcome none of the three parts produces alone.',
  },
  {
    thing: 'A database of customer names',
    verdict: 'It depends',
    why: 'A static list with no relationships defined is close to a collection. The moment other processes query it and depend on its answers, it is a system, and changing it changes their behaviour.',
  },
];

// Six process dimensions (Segars, Grover & Teng). Index 0 of each pole pair
// is that dimension's Rational Adaptation setting, so the diagnosis below is
// just "which ones are not at index 0".
type DimKey = 'comp' | 'form' | 'focus' | 'flow' | 'part' | 'cons';
type Half = 'Rational' | 'Adaptive';

const DIMENSIONS: {
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
    ask: 'How wide a range of alternatives does the process actually canvass?',
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
      'Explicit policies, recognised pathways for collecting information, a process that survives a change of staff.',
      'Conversation and precedent. Fast, and unrepeatable.',
    ],
  },
  {
    key: 'focus',
    name: 'Focus',
    ask: 'Is the process protecting assets, or nurturing new ideas?',
    half: 'Rational',
    poles: ['Integrative', 'Innovative'],
    notes: [
      'Budgetary control, cost performance and asset protection lead. Discipline over novelty.',
      'Novel and creative solutions lead. Invention over control. Neither end is wrong — they pull in opposite directions.',
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
    ask: 'Who co-designs the plan, as opposed to being told about it?',
    half: 'Adaptive',
    poles: ['Broad', 'Narrow'],
    notes: [
      'A diverse set of functional areas is in the room while decisions are still open.',
      'An isolated planning team decides; everyone else is informed. Surveying staff afterwards does not count.',
    ],
  },
  {
    key: 'cons',
    name: 'Consistency',
    ask: 'How often does the cycle come round?',
    half: 'Adaptive',
    poles: ['Continuous', 'Once a year'],
    notes: [
      'Embedded in operations, with constant communication and iterative evaluation.',
      'Sporadic and largely ad hoc, often a single annual event.',
    ],
  },
];

// The worked example from the course: comprehensive, formal, controlled and
// top-down, but business units are informed rather than consulted and the
// cycle runs once a year. Rational, not adaptive.
const DEFAULT_PICKS: Record<DimKey, 0 | 1> = { comp: 0, form: 0, focus: 0, flow: 0, part: 1, cons: 1 };

/** Walk the Iceberg Model down through one documented incident. */
function IcebergWalk() {
  const [active, setActive] = useState(0);
  const layer = ICEBERG[active];

  return (
    <div className="bt-walk">
      <ol className="bt-walk__rail">
        {ICEBERG.map((l, i) => (
          <li key={l.title}>
            <button
              type="button"
              className={`bt-walk__node${i === active ? ' bt-walk__node--on' : ''}${i < active ? ' bt-walk__node--done' : ''}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
            >
              <span className="bt-walk__num bt-tnum">{i + 1}</span>
              <span className="bt-walk__label">{l.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="bt-walk__panel">
        <p className="bt-eyebrow">Layer {active + 1} of {ICEBERG.length} · {layer.kicker}</p>
        <h3>{layer.title}</h3>
        <p className="bt-walk__body">{layer.body}</p>
        <p className="bt-note" style={{ marginTop: 14 }}>{layer.ask}</p>
        <div className="bt-walk__nav">
          <button
            type="button"
            className="bt-btn bt-btn--tertiary bt-btn--sm"
            disabled={active === 0}
            onClick={() => setActive(a => Math.max(0, a - 1))}
          >
            Back up
          </button>
          <button
            type="button"
            className="bt-btn bt-btn--sm"
            disabled={active === ICEBERG.length - 1}
            onClick={() => setActive(a => Math.min(ICEBERG.length - 1, a + 1))}
          >
            Go deeper
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Tap to apply the swap test and see whether the thing is a system. */
function SortCard({ thing, verdict, why }: { thing: string; verdict: string; why: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className={`bt-flip${flipped ? ' bt-flip--on' : ''}`}
      aria-pressed={flipped}
      onClick={() => setFlipped(f => !f)}
    >
      <span className="bt-flip__kicker">{flipped ? verdict : 'Tap to apply the test'}</span>
      <span className="bt-flip__body">{flipped ? why : thing}</span>
    </button>
  );
}

/** Set a planning process against the six dimensions and read the diagnosis. */
function DimensionDial() {
  const [picks, setPicks] = useState<Record<DimKey, 0 | 1>>(DEFAULT_PICKS);

  const missing = DIMENSIONS.filter(d => picks[d.key] === 1);
  const missingRational = missing.filter(d => d.half === 'Rational');
  const missingAdaptive = missing.filter(d => d.half === 'Adaptive');
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
    why = `Participation and cycle frequency are right, but ${names(missingRational)} ${missingRational.length === 1 ? 'is' : 'are'} missing. Continuous, broadly consulted activity with no discipline behind it is motion without a plan — plenty of meetings, no traceable line from any one decision to a strategic goal.`;
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
      {/* Six dimensions want a 3 × 2 block, not the 4 + 2 that the grid's
          own auto-fit lands on at this column width. */}
      <div className="bt-pairgrid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {DIMENSIONS.map(d => (
          <div key={d.key} className="bt-card">
            <h4>{d.name}</h4>
            <p>{d.ask}</p>
            <div className="bt-chiprow">
              {d.poles.map((pole, i) => (
                <button
                  key={pole}
                  type="button"
                  className="bt-ctxchip"
                  aria-pressed={picks[d.key] === i}
                  onClick={() => setPicks(p => ({ ...p, [d.key]: i as 0 | 1 }))}
                >
                  {pole}
                </button>
              ))}
            </div>
            <p className="bt-chipnote">{d.notes[picks[d.key]]}</p>
          </div>
        ))}
      </div>

      <div className={`bt-verdict${tone}`} style={{ marginTop: 20 }} aria-live="polite">
        <strong>{label}</strong>
        {why}
      </div>
    </div>
  );
}

export default function IntroToSISPLesson() {
  const [sorted, setSorted] = useState(0);

  return (
    <div>
      {/* ══ The Iceberg Model ════════════════════════════════════════════ */}
      <section id="iceberg" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Systems thinking · the Iceberg Model"
            title="Take one outage apart"
            aside="Four layers, from what happened down to the belief that made it likely. Learning runs downward, and so does leverage."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <IcebergWalk />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-note" style={{ marginTop: 20 }}>
            Most organisations spend nearly all their improvement effort on the Events layer, because it is the only
            layer visible without deliberate investigation. That is exactly why the same problem returns in a new
            shape a year later.
          </p>
        </Reveal>
      </section>

      {/* ══ System or collection ═════════════════════════════════════════ */}
      <section id="systems" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before any framework"
            title="System, or just a pile"
            aside="A system is a set of interacting parts producing behaviour no part produces alone. The test: change one part and see whether the rest cares."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-flipgrid" onClick={() => setSorted(s => Math.min(SORT_ITEMS.length, s + 1))}>
            {SORT_ITEMS.map(item => (
              <SortCard key={item.thing} thing={item.thing} verdict={item.verdict} why={item.why} />
            ))}
          </div>
          <p className="bt-note">
            {sorted >= SORT_ITEMS.length
              ? 'Three systems, two collections, and one that changes category the moment something depends on it. Organisations are in the last group far more often than anybody plans for.'
              : 'Not everything that looks like a group of things is a system. Remove a part: if nothing else changes, it was a collection.'}
          </p>
        </Reveal>
      </section>

      {/* ══ What this course is ══════════════════════════════════════════ */}
      <section id="course" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="What this course is"
            title="Deciding what to build"
            aside="15 credits at Level 8, no prerequisites. The first course of the programme, and the one MBI804 later builds on."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Every organisation eventually faces the same question: which information systems should we build, buy or
              retire, and in what order? Answering it badly is expensive — systems that duplicate capability the
              business already has, systems nobody asked for, and technology spending that quietly drifts away from
              what the organisation actually needs.
            </p>
            <p>
              Strategic Information Systems Planning is the discipline that answers it well. A project plan asks how to
              build a system on time and on budget. SISP asks the prior question: should this system exist at all, and
              why, before a budget is committed? Get that wrong and the best-executed project in the world still fails,
              because it solves a problem the organisation did not have.
            </p>
          </div>

          <div className="bt-path">
            {COURSE_PATH.map(step => {
              const here = step.code === 'MBI800';
              return (
                <div key={step.code} className={`bt-path__step${here ? ' bt-path__step--here' : ''}`}>
                  <span className="bt-path__code">{step.code}</span>
                  <span className="bt-path__label">{step.label}</span>
                </div>
              );
            })}
          </div>

          <div className="bt-stats">
            <div><b className="bt-tnum">15</b><span>Credits, Level 8</span></div>
            <div><b className="bt-tnum">150</b><span>Learning hours: 36 in class, 114 yours</span></div>
            <div><b className="bt-tnum">11</b><span>Topics across the whole course</span></div>
            <div><b className="bt-tnum">3</b><span>Learning outcomes you are assessed against</span></div>
          </div>

          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th>Weighting</th><th>Assessment</th><th>Detail</th></tr>
              </thead>
              <tbody>
                {ASSESSMENTS.map(([weight, name, detail]) => (
                  <tr key={name}>
                    <td className="bt-tnum">{weight}</td>
                    <td>{name}</td>
                    <td>{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bt-note">
            Two pieces of work, both individual. Neither is a memory test: the report asks you to plan for a real
            organisation, and the case study asks you to judge an implementation you did not run.
          </p>
        </Reveal>
      </section>

      {/* ══ Learning outcomes ════════════════════════════════════════════ */}
      <section id="outcomes" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="By the end of the course"
            title="Learning outcomes"
            aside="Word for word from the course descriptor. Everything you are assessed on maps back to one of these three."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-outcomes">
            {LEARNING_OUTCOMES.map(lo => (
              <div key={lo.n} className="bt-outcome">
                <div className="bt-outcome__head">
                  <span className="bt-outcome__n">{lo.n}</span>
                  <h3>{lo.short}</h3>
                </div>
                <p>{lo.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ Preview ══════════════════════════════════════════════════════ */}
      <section id="preview" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="A small preview"
            title="Some of what this covers"
            aside="From the course material, in roughly the order it is taught. More than fits on one page."
          />
        </Reveal>

        <div className="bt-preview">
          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">01</span>
              <div>
                <h3>A definition you can test something against</h3>
                <p className="bt-prose">
                  Segars, Grover and Teng give SISP a testable shape: a formal process, conducted at a broad scope,
                  from an upper-management perspective, over a long-range time frame, at a conceptual rather than
                  operational level of abstraction. Four properties, and each one rules something out.
                </p>
                <ol className="bt-flow bt-flow--tight">
                  <li>
                    <span className="bt-flow__n bt-tnum">1</span>
                    <div><h4>Broad scope</h4><p>Rules out a planning exercise confined to one department’s systems.</p></div>
                  </li>
                  <li>
                    <span className="bt-flow__n bt-tnum">2</span>
                    <div><h4>Upper-management perspective</h4><p>Rules out planning that never leaves the IT department. SISP has to be owned where organisation-wide resources can be committed.</p></div>
                  </li>
                  <li>
                    <span className="bt-flow__n bt-tnum">3</span>
                    <div><h4>Long-range time frame</h4><p>Rules out a horizon measured in one project’s duration.</p></div>
                  </li>
                  <li>
                    <span className="bt-flow__n bt-tnum">4</span>
                    <div><h4>Conceptual abstraction</h4><p>Rules out jumping to technical specification before the business question is settled.</p></div>
                  </li>
                </ol>
                <p className="bt-note" style={{ marginTop: 16 }}>
                  Fail any one of the four and it is not SISP, however much analysis went into it.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">02</span>
              <div>
                <h3>The three jobs SISP does</h3>
                <p className="bt-prose">
                  Confusing these is a common source of planning failure, because each one is judged against a
                  different standard.
                </p>
                <div className="bt-rows">
                  <div>
                    <h4>Support and influence</h4>
                    <p>Identify which systems would genuinely add value, rather than simply automating a process the organisation already runs.</p>
                  </div>
                  <div>
                    <h4>Technological integration</h4>
                    <p>Coordinate otherwise disparate technologies into one information architecture, so systems built independently do not duplicate data or block future integration.</p>
                  </div>
                  <div>
                    <h4>Implementation strategy</h4>
                    <p>Produce macro-level blueprints detailed enough to sequence and prioritise investment, without descending into project-level specification.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">03</span>
              <div>
                <h3>Planning runs in both directions</h3>
                <p className="bt-prose">
                  Information systems shape strategy as much as strategy shapes information systems. A retailer that
                  adopts real-time inventory data does not merely automate an existing process — it opens options
                  (dynamic pricing, drop-shipping, personalised marketing) that did not exist before the system did.
                  Plan in only one direction and you will keep building systems that support last year’s strategy.
                </p>
                <figure className="bt-figure">
                  <div className="bt-figure__frame">
                    <svg viewBox="0 0 520 168" width="100%" style={{ maxWidth: 540, display: 'block', margin: '0 auto' }} role="img" aria-label="Inadequate selling effort feeds out-of-date procedures, producing poor sales performance; incorrect information flows back to poor sales management, which drives the effort again.">
                      <defs>
                        <marker id="sisp-arrow" markerWidth="8" markerHeight="8" refX="6.4" refY="3" orient="auto">
                          <path d="M0 0 L7 3 L0 6 z" fill="var(--ink-300)" />
                        </marker>
                      </defs>
                      {[
                        { x: 8, label: 'Input', sub: 'Inadequate selling effort' },
                        { x: 182, label: 'Processing', sub: 'Out-of-date procedures' },
                        { x: 356, label: 'Output', sub: 'Poor sales performance' },
                      ].map(box => (
                        <g key={box.label}>
                          <rect x={box.x} y="16" width="156" height="54" rx="12" fill="var(--paper-0)" stroke="var(--border-subtle)" />
                          <text x={box.x + 78} y="38" textAnchor="middle" fontSize="10" letterSpacing="1.4" fontWeight="700" fill="var(--accent-600)" fontFamily="var(--font-body)">{box.label.toUpperCase()}</text>
                          <text x={box.x + 78} y="56" textAnchor="middle" fontSize="11.5" fill="var(--ink-600)" fontFamily="var(--font-body)">{box.sub}</text>
                        </g>
                      ))}
                      <line x1="166" y1="43" x2="180" y2="43" stroke="var(--ink-300)" strokeWidth="1.4" markerEnd="url(#sisp-arrow)" />
                      <line x1="340" y1="43" x2="354" y2="43" stroke="var(--ink-300)" strokeWidth="1.4" markerEnd="url(#sisp-arrow)" />
                      <rect x="182" y="106" width="156" height="46" rx="12" fill="var(--accent-50)" stroke="var(--accent-200)" />
                      <text x="260" y="134" textAnchor="middle" fontSize="11.5" fill="var(--accent-700)" fontFamily="var(--font-body)">Poor sales management</text>
                      <path d="M434 72 L434 129 L340 129" fill="none" stroke="var(--ink-300)" strokeWidth="1.4" markerEnd="url(#sisp-arrow)" />
                      <path d="M182 129 L86 129 L86 74" fill="none" stroke="var(--ink-300)" strokeWidth="1.4" markerEnd="url(#sisp-arrow)" />
                      <text x="434" y="96" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">incorrect</text>
                      <text x="434" y="108" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">information</text>
                    </svg>
                  </div>
                  <figcaption>
                    Telling the sales team to try harder addresses none of this loop. Management, acting on bad
                    information, reinforces the conditions that produced the bad information.
                  </figcaption>
                </figure>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">04</span>
              <div>
                <h3>Risk is part of the plan, not a bolt-on</h3>
                <p className="bt-prose">
                  The descriptor names three risks explicitly — technological failure, data breaches and misalignment
                  with organisational objectives — and the course treats them as planning inputs rather than a
                  compliance exercise run after the decision. Resource constraints, security vulnerabilities and
                  integration challenges all get identified while there is still a choice to make about them.
                </p>
                <div className="bt-caution">
                  <p className="bt-eyebrow">Why this sits here and not at the end</p>
                  <p>
                    A risk found during planning is a decision. The same risk found during implementation is an
                    incident. The only difference is when somebody looked.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">05</span>
              <div>
                <h3>Culturally responsive planning, assessed on its own</h3>
                <p className="bt-prose">
                  LO2 carries 40% of the course, which tells you how seriously it is meant. Systems handling personal
                  or culturally sensitive data — health records above all — carry obligations beyond cost and
                  schedule. The course works through the design of information services for Māori and Pasifika health
                  providers as a case: data sovereignty, cultural protocols and community consent, not just technical
                  privacy controls.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">06</span>
              <div>
                <h3>Real implementations, named</h3>
                <p className="bt-prose">
                  Frameworks are easier to apply once you have watched them succeed and fail in organisations you can
                  name, under constraints somebody actually had. The course uses documented case studies from
                  telecommunications, government and several national contexts, plus five founding stories of
                  companies whose information-systems choices created an advantage their competitors could not copy.
                </p>
                <a className="bt-btn bt-btn--sm" href={`${BASE}#/five-stories`} style={{ marginTop: 18, textDecoration: 'none' }}>
                  Read the five stories
                  <span className="bt-btn__badge" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ The six process dimensions ═══════════════════════════════════ */}
      <section id="dimensions" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="LO1 · Assessing a process"
            title="Diagnose a planning process"
            stop="."
            aside="Six dimensions describe any planning process. Set them to match one you have seen, and read what the configuration predicts."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <DimensionDial />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-note" style={{ marginTop: 20 }}>
            It starts on a real profile: a mid-sized firm running an annual, top-down IT plan, comprehensive and
            formally documented, with business units informed of the priorities rather than consulted while they are
            set. Maximum on every dimension is not the goal — the balance is.
          </p>
        </Reveal>
      </section>

      {/* ══ Full topic list ══════════════════════════════════════════════ */}
      <section id="outline" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Across the whole course"
            title="The full topic list"
            aside="The indicative content from the descriptor. Eleven topics, each one leaning on the ones before it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-topics">
            {COURSE_CONTENT.map((item, i) => (
              <li key={item}>
                <span className="bt-topics__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ══ Come prepared ════════════════════════════════════════════════ */}
      <section id="prepared" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before class"
            title="Why bother, and what to bring"
            aside="Nothing here needs buying, and no prior IT background is assumed. Mainly: bring one example."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-twocol">
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">What the course actually builds</p>
              <ol className="bt-track bt-track--compact">
                <li className="bt-trackrow bt-trackrow--plain">
                  <div className="bt-trackrow__body">
                    <h3>Translating a business goal into a requirement</h3>
                    <p>Stated precisely enough that success or failure can be judged against it later.</p>
                  </div>
                </li>
                <li className="bt-trackrow bt-trackrow--plain">
                  <div className="bt-trackrow__body">
                    <h3>Telling a capability gap from a technology gap</h3>
                    <p>Some gaps close with process change, some with better use of a system already paid for, and only some need something new.</p>
                  </div>
                </li>
                <li className="bt-trackrow bt-trackrow--plain">
                  <div className="bt-trackrow__body">
                    <h3>Naming risk while there are still options</h3>
                    <p>Technological, operational, financial and reputational, weighed as part of the plan.</p>
                  </div>
                </li>
                <li className="bt-trackrow bt-trackrow--plain">
                  <div className="bt-trackrow__body">
                    <h3>Planning that respects the people in the data</h3>
                    <p>Cultural protocols, data sovereignty and consent, examined as design constraints rather than paperwork.</p>
                  </div>
                </li>
                <li className="bt-trackrow bt-trackrow--plain">
                  <div className="bt-trackrow__body">
                    <h3>Reading a real implementation</h3>
                    <p>Judging what an organisation did, from documented evidence, rather than from a hypothetical.</p>
                  </div>
                </li>
              </ol>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">Come prepared</p>
              <ul className="bt-bring">
                <li>
                  <h4>Bring one system that annoys you</h4>
                  <p>From work, from study, from a government website. We take it down through the four Iceberg layers together, and it works better when the example is yours.</p>
                </li>
                <li>
                  <h4>No prior IT background assumed</h4>
                  <p>There are no prerequisites on this course by design. If you have never written a line of code, you are at the expected starting point.</p>
                </li>
                <li>
                  <h4>A laptop helps, and is not essential</h4>
                  <p>Most of the first class is discussion and diagramming. Paper is genuinely fine.</p>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <SaveAsPdf doc={SISP_NOTES} />

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>See you in class<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              None of the above needed a technical background, and neither does the course. Come with one system you
              think is badly planned and an argument for why. That is the whole of the first class, and most of the
              first assessment.
            </p>
            <p className="bt-signoff__name">
              Yasas Sri Wickramasinghe
              <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer">
                MBI800 lecturer <ExternalLink size={12} aria-hidden="true" />
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
