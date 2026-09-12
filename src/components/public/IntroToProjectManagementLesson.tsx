import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Reveal, SaveAsPdf, SectionHead } from '../blend';
import MethodChoice from './project/MethodChoice';
import { PM_NOTES } from '../../content/notes/mbi804ProjectManagement';

// ─── MBI804: IT Project Management ────────────────────────────────────────
// A public, ungated course intro page in Blended Teaching Content's
// course-page design system, Blend (src/components/blend/README.md), running
// on MBI804's plum through the `project` accent set by the shell.
//
// Everything here comes from the course's own material: the learning
// outcomes, indicative content and assessment weightings are verbatim from
// the MBI804 course descriptor; the estimating and reserve material follows
// the PMI cost-management lecture on /cost-management, including its running
// SecurePay NZ scenario; the Scrum summary follows the Agile Scrum deck; and
// the conflict modes are the Thomas-Kilmann set used in the Conflict Swap
// activity.
//
// Nothing here is pinned to a session number or a calendar day: when somebody
// reads this page has nothing to do with when a class runs.

const BASE = import.meta.env.BASE_URL;

// Verbatim from the MBI804 course descriptor.
const LEARNING_OUTCOMES = [
  {
    n: 'LO1',
    short: 'Choose the method',
    body: 'Critically analyse the attributes of an IT project to recommend the most suitable project management methodologies in an organisation.',
  },
  {
    n: 'LO2',
    short: 'Name the risks',
    body: 'Assess potential risks associated with IT projects to propose mitigation strategies for an organisation.',
  },
  {
    n: 'LO3',
    short: 'Run it in your field',
    body: 'Apply IT project management approaches and practices within specialised domains in a professional context.',
  },
];

const COURSE_PATH = [
  { code: 'MBI800', label: 'Prerequisite' },
  { code: 'MBI801', label: 'Prerequisite' },
  { code: 'MBI804', label: 'You are here' },
  { code: 'Strand', label: 'Business Analytics or Healthcare Informatics' },
];

const ASSESSMENTS: [string, string, string][] = [
  ['60%', 'Project methodology selection: case study', 'Individual · assesses LO1 and LO3'],
  ['40%', 'Risk management plan: report', 'Individual · assesses LO2 and LO3'],
];

// The indicative content from the descriptor, deduplicated and in order.
const COURSE_CONTENT = [
  'Overview of project management principles and practices',
  'Project initiation and planning',
  'Scope management in IT projects',
  'Risk management in IT projects',
  'Quality management in informatics projects',
  'Project monitoring, control and closure',
  'Agile, Waterfall and PRINCE2 project management',
  'Case studies and best practices in IT project management',
  'Ethical and legal considerations in IT project management',
];

// Pick the two constraints that are genuinely fixed, and the third has to
// move. Every pairing below is a real position a sponsor takes.
type Corner = 'scope' | 'time' | 'cost';

const CORNERS: { key: Corner; label: string; blurb: string }[] = [
  { key: 'scope', label: 'Scope', blurb: 'Everything in the specification ships.' },
  { key: 'time', label: 'Time', blurb: 'The date is announced and cannot move.' },
  { key: 'cost', label: 'Cost', blurb: 'The budget is signed and will not grow.' },
];

const GIVES: Record<Corner, { title: string; body: string }> = {
  scope: {
    title: 'Scope is what moves',
    body: 'A fixed date and a fixed budget mean the feature list is the variable, whether anybody says so or not. Handled openly this is exactly how an Agile backlog works: the sponsor gets the most valuable slice by the date. Handled quietly, it becomes features silently dropped in the last fortnight, which is the same outcome with the trust removed.',
  },
  time: {
    title: 'Time is what moves',
    body: 'Fixing scope and budget means the date is the release valve. This is defensible on a regulated or safety-critical build where an incomplete system is worse than a late one. It is indefensible when the date was promised to a customer and nobody has told them yet.',
  },
  cost: {
    title: 'Cost is what moves',
    body: 'Fixing scope and date leaves money as the only lever: more people, overtime, contractors. Beware the assumption underneath it, that effort converts cleanly into speed. Adding people to a late project has a ramp-up cost and a communication cost, and past a point it makes the project later.',
  },
};

const QUALITY_NOTE =
  'Nothing here lets you fix all three. When a sponsor insists on all three, quality becomes the undeclared variable — testing gets compressed, review gets skipped, and the cost arrives later as defects. Naming which corner moves is most of what a project manager does on day one.';

// From the PMI cost-management lecture: estimate types by project maturity.
const ESTIMATE_TYPES: [string, string][] = [
  ['Rough order of magnitude', 'Very early, before requirements settle. Typically −25% to +75%. Useful to decide whether to look further, not to sign anything.'],
  ['Budgetary', 'Once scope is roughly known, for allocating money into a budget. Typically −10% to +25%.'],
  ['Definitive', 'Late, from a decomposed work breakdown structure. Typically −5% to +10%, and the only one worth committing to a contract.'],
];

const ESTIMATE_PITFALLS: [string, string][] = [
  ['Estimates made under time pressure', 'The estimate is the first deliverable of the project and is routinely given the least time of anything in it.'],
  ['Estimating work you have never done', 'Unfamiliar work is systematically underestimated, and the person who knows least is often the one asked.'],
  ['Optimism bias', 'People estimate the version of the task where nothing goes wrong, then are surprised each time something does.'],
  ['Accuracy demanded too early', 'A definitive number asked for at rough-order-of-magnitude maturity is not more accurate. It is the same guess with the uncertainty hidden.'],
];

// The Thomas-Kilmann modes, as used in the Conflict Swap classroom activity.
const CONFLICT_MODES: [string, string][] = [
  ['Competing', 'Assertive, uncooperative. Right when a decision is urgent and unpopular, or safety is at stake.'],
  ['Collaborating', 'Assertive and cooperative. The mode everybody names first, and the most expensive: it needs time and trust both sides have to spend.'],
  ['Compromising', 'Moderate on both. Fast and fair-looking, and it can leave both sides equally unhappy with a solution neither believes in.'],
  ['Avoiding', 'Unassertive, uncooperative. Occasionally correct — when the issue is trivial, or tempers need to cool — and corrosive as a habit.'],
  ['Accommodating', 'Unassertive, cooperative. Right when you are wrong, or when the relationship matters more than this particular point.'],
];

// Qualitative risk analysis: probability × impact, the way the course teaches
// it before any quantitative technique arrives.
const LIKELIHOODS: [string, number][] = [
  ['Rare · 10%', 0.1],
  ['Unlikely · 25%', 0.25],
  ['Possible · 50%', 0.5],
  ['Likely · 70%', 0.7],
  ['Almost certain · 90%', 0.9],
];

const IMPACTS: [string, number][] = [
  ['Minor · $5k', 5_000],
  ['Moderate · $40k', 40_000],
  ['Major · $150k', 150_000],
  ['Severe · $400k', 400_000],
];

const RESPONSES: Record<string, { title: string; body: string }> = {
  avoid: {
    title: 'Avoid',
    body: 'Change the plan so the risk cannot occur: drop the feature, pick the integration you already know, extend the schedule so the dependency is no longer on the critical path. The only response that takes the exposure to zero, and the only one that costs you scope.',
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
};

/** Pick the two corners that are fixed; the third is what has to give. */
function TripleConstraint() {
  const [fixed, setFixed] = useState<Corner[]>(['time', 'cost']);

  // Exactly two corners are held at any moment, so every click is a swap:
  // fixing the free corner releases the older of the two, and releasing a
  // fixed corner hands its place to whichever corner was moving.
  function toggle(key: Corner) {
    setFixed(prev => {
      if (!prev.includes(key)) return [prev[1], key];
      const kept = prev.find(k => k !== key)!;
      const wasMoving = CORNERS.find(c => !prev.includes(c.key))!.key;
      return [kept, wasMoving];
    });
  }

  const moving = CORNERS.find(c => !fixed.includes(c.key))!;
  const gives = GIVES[moving.key];

  return (
    <div>
      <div className="bt-pairgrid bt-pairgrid--three">
        {CORNERS.map(c => {
          const isFixed = fixed.includes(c.key);
          return (
            <div key={c.key} className="bt-card">
              <h4>{c.label}</h4>
              <p>{c.blurb}</p>
              <div className="bt-chiprow">
                <button
                  type="button"
                  className="bt-ctxchip"
                  aria-pressed={isFixed}
                  onClick={() => toggle(c.key)}
                >
                  {isFixed ? 'Fixed' : 'Free to move'}
                </button>
              </div>
              <p className="bt-chipnote">
                {isFixed
                  ? 'Held. Only two of the three can be held at once, so releasing this one fixes the corner that is currently moving.'
                  : 'This is the corner absorbing the pressure. Fix it and one of the other two is released.'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bt-verdict" style={{ marginTop: 20 }} aria-live="polite">
        <strong>{gives.title}</strong>
        {gives.body}
      </div>

      <p className="bt-note" style={{ marginTop: 16 }}>{QUALITY_NOTE}</p>
    </div>
  );
}

/** Probability × impact, then choose a response and read what it commits to. */
function RiskDesk() {
  const [li, setLi] = useState(2);
  const [ii, setIi] = useState(2);
  const [response, setResponse] = useState<keyof typeof RESPONSES>('mitigate');

  const probability = LIKELIHOODS[li][1];
  const impact = IMPACTS[ii][1];
  const exposure = Math.round(probability * impact);
  const money = (n: number) => `$${n.toLocaleString('en-NZ')}`;
  const chosen = RESPONSES[response];

  // The band the course uses to decide how much attention a risk earns.
  const band =
    exposure >= 100_000 ? 'Escalate it. This belongs in the sponsor’s reporting, not only the register.'
    : exposure >= 25_000 ? 'Owner, response and review date in the register, checked every reporting cycle.'
    : 'Register it and review it. Not every risk deserves a mitigation budget.';

  return (
    <div>
      <div className="bt-pairgrid">
        <div className="bt-card">
          <h4>How likely is it?</h4>
          <p>Qualitative bands first. A probability you can defend beats a decimal you invented.</p>
          <div className="bt-chiprow">
            {LIKELIHOODS.map(([label], i) => (
              <button key={label} type="button" className="bt-ctxchip" aria-pressed={li === i} onClick={() => setLi(i)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="bt-card">
          <h4>What would it cost?</h4>
          <p>Rework, delay, penalty, lost revenue. One figure, stated in money so it can be compared.</p>
          <div className="bt-chiprow">
            {IMPACTS.map(([label], i) => (
              <button key={label} type="button" className="bt-ctxchip" aria-pressed={ii === i} onClick={() => setIi(i)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bt-counter" style={{ marginTop: 26 }} aria-live="polite">
        <b className="bt-tnum">{money(exposure)}</b>
        <span>
          Expected monetary value: {Math.round(probability * 100)}% × {money(impact)}. {band}
        </span>
      </div>

      <div className="bt-chiprow" style={{ marginTop: 24 }}>
        {(Object.keys(RESPONSES) as (keyof typeof RESPONSES)[]).map(key => (
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

export default function IntroToProjectManagementLesson() {
  return (
    <div>
      {/* ══ The triple constraint ════════════════════════════════════════ */}
      <section id="constraints" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Where every project starts"
            title="Something has to give"
            aside="Scope, time and cost. Hold any two and the third moves. Try to hold all three and quality becomes the variable nobody declared."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <TripleConstraint />
        </Reveal>
      </section>

      {/* ══ Choosing a methodology (LO1) ═════════════════════════════════ */}
      <section id="choose" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="LO1 · Methodology selection"
            title="Pick a method for the project"
            aside="Four real project shapes, three methodologies. Pick a pairing and see whether it fits, works at a cost, or sets the project up to fail."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <MethodChoice />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-note" style={{ marginTop: 20 }}>
            No methodology is good or bad on its own, only fit or unfit for a project’s attributes. That is the whole
            of LO1, and the 60% case study is marked on the argument, not on the choice.
          </p>
        </Reveal>
      </section>

      {/* ══ What this course is ══════════════════════════════════════════ */}
      <section id="course" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="What this course is"
            title="Running the project, not just planning it"
            aside="15 credits at Level 8, in trimester two. MBI800 and MBI801 are prerequisites, and the course assumes both."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              MBI800 asked whether a system should exist. MBI804 starts once that has been answered and something has
              to be delivered: planning, scheduling, budgeting and risk management, in sectors where technology and
              data carry the strategy.
            </p>
            <p>
              The course is deliberately practical. You will work with Agile, Waterfall and PRINCE2 and learn to
              choose between them from a project’s attributes rather than from preference. You will assess risks and
              propose mitigations that cost something specific. And you will build realistic budgets, monitor
              expenditure against them, and apply cost control when the two diverge — because they will.
            </p>
          </div>

          <div className="bt-path">
            {COURSE_PATH.map(step => {
              const here = step.code === 'MBI804';
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
            <div><b className="bt-tnum">9</b><span>Topics across the whole course</span></div>
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
            Both assessments are individual, and neither is a memory test. One asks you to recommend a methodology and
            defend it against a real case; the other asks you to write a risk management plan somebody could actually
            run.
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
                <h3>Scope, before anything else</h3>
                <p className="bt-prose">
                  A project fails at scope more often than at execution. The work breakdown structure decomposes the
                  deliverable until every piece is small enough to estimate and assign, and the scope baseline records
                  what is in — which is also the only way to recognise scope creep when it arrives, one reasonable
                  request at a time.
                </p>
                <div className="bt-caution">
                  <p className="bt-eyebrow">The sentence that costs the most money</p>
                  <p>
                    “While you’re in there, could you also…”. Every one of these is individually reasonable and free
                    to ask for. Without a baseline to compare against, nobody can say what they have collectively cost.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">02</span>
              <div>
                <h3>Estimating, and the honesty of a range</h3>
                <p className="bt-prose">
                  An estimate has a maturity. Asking for a definitive number before the scope exists does not make it
                  accurate; it hides the uncertainty that is still there.
                </p>
                <div className="bt-rows">
                  {ESTIMATE_TYPES.map(([title, body]) => (
                    <div key={title}>
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
                <div className="bt-pairgrid">
                  {ESTIMATE_PITFALLS.map(([title, body]) => (
                    <div key={title} className="bt-card">
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">03</span>
              <div>
                <h3>Three points, one number</h3>
                <p className="bt-prose">
                  PERT turns an optimistic, a most-likely and a pessimistic estimate into a single weighted figure,
                  which is a more honest answer than the confident guess it replaces. Weighted four to one because the
                  most likely case is where the work usually lands, and the tails still have to count for something.
                </p>
                <figure className="bt-figure">
                  <div className="bt-figure__frame">
                    <p className="bt-prose" style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                      E = (O + 4M + P) ÷ 6
                    </p>
                    <p className="bt-prose" style={{ marginTop: 12 }}>
                      A payment-gateway integration estimated at 4 weeks if the vendor’s sandbox behaves, 6 weeks
                      most likely, 14 weeks if their documentation is as wrong as it was last time:
                      (4 + 24 + 14) ÷ 6 = <b>7 weeks</b>. Not 6. The pessimistic tail alone moved the plan by a week,
                      which is exactly the point.
                    </p>
                  </div>
                  <figcaption>
                    The same arithmetic, applied across a work breakdown structure, is what produces a budget somebody
                    can defend in a steering meeting.
                  </figcaption>
                </figure>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">04</span>
              <div>
                <h3>Two reserves, two different owners</h3>
                <p className="bt-prose">
                  Contingency reserve covers the risks you identified and wrote down — the known unknowns — and the
                  project manager spends it. Management reserve covers what nobody saw coming, sits outside the cost
                  baseline, and needs the sponsor’s approval to touch. Collapsing the two into one pot is how a
                  project quietly spends its safety margin before the risks it was set aside for have happened.
                </p>
                <a className="bt-btn bt-btn--sm" href={`${BASE}#/cost-management`} style={{ marginTop: 18, textDecoration: 'none' }}>
                  Work through the full cost lesson
                  <span className="bt-btn__badge" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">05</span>
              <div>
                <h3>Scrum, in one page</h3>
                <p className="bt-prose">
                  The Agile framework you are most likely to meet in industry, and the one with the most confidently
                  misremembered rules. Three roles, three artifacts, five events, each with a timebox that is part of
                  the definition rather than a suggestion.
                </p>
                <div className="bt-pairgrid bt-pairgrid--three">
                  <div className="bt-card">
                    <h4>Three roles</h4>
                    <p>Product Owner, one person, maximises product value and owns the backlog. Scrum Master, a servant-leader who removes impediments. Developers, 3–9 cross-functional people who own the increment.</p>
                  </div>
                  <div className="bt-card">
                    <h4>Three artifacts</h4>
                    <p>Product Backlog, committed to a Product Goal. Sprint Backlog, committed to a Sprint Goal and owned by the developers. Increment, committed to the Definition of Done.</p>
                  </div>
                  <div className="bt-card">
                    <h4>Five events</h4>
                    <p>The Sprint, 1–4 weeks, containing the rest. Sprint Planning, up to 8 hours. Daily Scrum, 15 minutes. Sprint Review, up to 4 hours. Retrospective, up to 3 hours. Timeboxes shown for a four-week sprint; scale them down proportionally.</p>
                  </div>
                </div>
                <p className="bt-note" style={{ marginTop: 18 }}>
                  Agile is not the absence of a plan. It is a plan re-made every fortnight against what the last
                  fortnight actually taught you.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">06</span>
              <div>
                <h3>The part of the job that is people</h3>
                <p className="bt-prose">
                  Communication, stakeholder management and conflict are on the descriptor as key aspects of project
                  success, and they are where most delivery problems actually start. The five Thomas-Kilmann modes
                  describe how people handle a disagreement. There is no best one — only a best one for this
                  situation, and a strong bias in most teams toward naming the second.
                </p>
                <div className="bt-rows">
                  {CONFLICT_MODES.map(([title, body]) => (
                    <div key={title}>
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
                <a className="bt-btn bt-btn--sm" href={`${BASE}collaboration-reflex-lecture.html`} style={{ marginTop: 18, textDecoration: 'none' }}>
                  The lecture built from 45 real conflicts
                  <span className="bt-btn__badge" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Risk (LO2) ═══════════════════════════════════════════════════ */}
      <section id="risk" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="LO2 · Risk and mitigation"
            title="Put a number on a risk"
            stop="."
            aside="Probability times impact gives you something comparable. The response you choose then has to cost less than the exposure it removes."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <RiskDesk />
        </Reveal>
      </section>

      {/* ══ Full topic list ══════════════════════════════════════════════ */}
      <section id="outline" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Across the whole course"
            title="The full topic list"
            aside="The indicative content from the descriptor. Nine topics, from initiation through to closure and the ethics around both."
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
            aside="Nothing here needs buying. Mainly: bring a project you watched go wrong, and a laptop."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-twocol">
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">Why it is worth learning</p>
              <ol className="bt-track bt-track--compact">
                <li className="bt-trackrow bt-trackrow--plain">
                  <div className="bt-trackrow__body">
                    <h3>It is the most portable skill on the programme</h3>
                    <p>Every sector runs projects. The methodology vocabulary travels between industries in a way that a specific technology stack does not.</p>
                  </div>
                </li>
                <li className="bt-trackrow bt-trackrow--plain">
                  <div className="bt-trackrow__body">
                    <h3>It is how technical people become senior</h3>
                    <p>The step from doing the work to being accountable for it is mostly scope, estimates, risk and communication.</p>
                  </div>
                </li>
                <li className="bt-trackrow bt-trackrow--plain">
                  <div className="bt-trackrow__body">
                    <h3>The certifications are recognised</h3>
                    <p>Scrum and Jira credentials are asked for by name in job listings, and several useful ones are free. There is a page on this site listing them.</p>
                  </div>
                </li>
                <li className="bt-trackrow bt-trackrow--plain">
                  <div className="bt-trackrow__body">
                    <h3>It makes you harder to mislead</h3>
                    <p>Once you can read a budget baseline and a risk register, an optimistic status report stops being persuasive.</p>
                  </div>
                </li>
              </ol>
              <a className="bt-btn bt-btn--sm" href={`${BASE}#/jira-certifications`} style={{ marginTop: 20, textDecoration: 'none' }}>
                See the free certifications
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </a>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">Come prepared</p>
              <ul className="bt-bring">
                <li>
                  <h4>Bring a project that went wrong</h4>
                  <p>Work, university, a group assignment, a house renovation. We diagnose it against the constraint triangle in the first class, and it works better when the example is yours.</p>
                </li>
                <li>
                  <h4>Bring a laptop</h4>
                  <p>A free Jira or Trello account is useful from early on. If you cannot install anything, the browser version does everything this course needs.</p>
                </li>
                <li>
                  <h4>No management experience assumed</h4>
                  <p>Never run a project? That is the expected starting point. What the course does assume is MBI800 and MBI801, which you will already have.</p>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <SaveAsPdf doc={PM_NOTES} />

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>See you in class<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              Most of this course is judgement rather than technique, and judgement is built from examples. Bring one
              project you watched go badly and an argument about why. That conversation is the first class, and most
              of the first assessment.
            </p>
            <p className="bt-signoff__name">
              Yasas Sri Wickramasinghe
              <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer">
                MBI804 lecturer <ExternalLink size={12} aria-hidden="true" />
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
