import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { LessonHeader, Quiz, Recap, Reveal, SaveAsPdf, SectionHead, type QuizQuestion } from '../blend';
import IcebergModel, { type IcebergLayer } from './sisp/IcebergModel';
import FeedbackLoopSim from './sisp/FeedbackLoopSim';
import DimensionProfile from './sisp/DimensionProfile';
import { SISP_NOTES } from '../../content/notes/mbi800Sisp';

// ─── MBI800 · Lesson 1: Introduction and Systems Thinking ─────────────────
// A public, ungated page in Blended Teaching Content's course-page design
// system, Blend (src/components/blend/README.md), running on MBI800's indigo
// through the `planning` accent set by the shell.
//
// This is the course's first lesson, not a prospectus with a lesson bolted
// on. It follows the study pack's own order — what SISP is, why it is hard,
// systems before frameworks, then the Iceberg Model — and everything after
// the knowledge check is explicitly labelled as what comes next rather than
// as part of this hour.
//
// The learning outcomes, indicative content and assessment weightings are
// verbatim from the MBI800 course descriptor. The teaching content follows
// study-pack/content/mbi800/lessons chapters 1 to 3.
//
// Nothing here is pinned to a calendar date. It is Lesson 1 of the course,
// which is a position in a sequence, not a day in a term.

const BASE = import.meta.env.BASE_URL;

const OBJECTIVES = [
  'Say what Strategic Information Systems Planning is, and what problem it solves',
  'Explain how SISP differs from planning a single IT project',
  'Tell a system from a collection, and say why that distinction decides how you plan',
  'Use the Iceberg Model to get from an observed failure down to the belief that produced it',
  'Name the layer an improvement is operating at, and predict whether it will hold',
];

const LESSON_META: [string, string][] = [
  ['Reading', '25 minutes'],
  ['Assumes', 'nothing'],
  ['Bring', 'one system that annoys you'],
];

const THREE_FORCES = [
  {
    title: 'Systems shape strategy as much as strategy shapes systems',
    body: 'A retailer that adopts real-time inventory data does not merely automate an existing process. It opens strategic options — dynamic pricing, drop-shipping, personalised marketing — that did not exist before the system did. Plan in one direction only and you keep building systems that support last year’s strategy.',
  },
  {
    title: 'Planning happens under uncertainty and constraint',
    body: 'Technology moves faster than most planning cycles, budgets are finite, and the people who understand the business rarely share a time horizon with the people who understand the technology. A good process reconciles that without freezing the organisation in permanent analysis.',
  },
  {
    title: 'It is a human process before it is a technical one',
    body: 'The frameworks in this course exist because organisations are made of people with competing incentives, incomplete information and legitimate disagreement about priorities. A plan that ignores this does not survive contact with the organisation it was written for.',
  },
];

// The swap test: change one part and see whether the rest cares.
const SORT_ITEMS = [
  {
    thing: 'A bowl of fruit',
    verdict: 'Collection',
    why: 'Take the apple out and the pears carry on being pears. The items co-exist without interacting, so nothing about the whole depends on any one of them.',
  },
  {
    thing: 'A football team',
    verdict: 'System',
    why: 'Remove one player mid-match and every other player’s role shifts. The behaviour — holding a shape, winning, losing — belongs to the whole, not to any player in it.',
  },
  {
    thing: 'A toolbox',
    verdict: 'Collection',
    why: 'A hammer does not change what the screwdriver does. Useful together, but they do not interact, so the box produces no behaviour of its own.',
  },
  {
    thing: 'A kitchen',
    verdict: 'System',
    why: 'Oven, fridge, bench and the person moving between them interact to produce a meal. Take the fridge out and the whole way the room is used changes.',
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

// Worked through the CrowdStrike content update of 19 July 2024, because the
// event layer was reported everywhere and the three below it almost nowhere.
const ICEBERG_LAYERS: IcebergLayer[] = [
  {
    title: 'Events',
    kicker: 'what happened',
    question: 'What is happening?',
    body: 'On 19 July 2024 a faulty content update from a security vendor crashed Windows machines worldwide. Flights were grounded, hospital systems went dark, payment terminals stopped. This is the layer that gets reported, and the only one visible without going looking for the rest.',
    ask: 'React here and you restore service. Nothing about the next one has changed.',
  },
  {
    title: 'Patterns of behaviour',
    kicker: 'what keeps happening',
    question: 'What has been happening, over and over?',
    body: 'Ask what recurs rather than what occurred. Outages of this class cluster around urgent updates pushed outside the normal review window — in every vendor, for years. Seen as a pattern, one event stops looking like bad luck and starts looking like a schedule.',
    ask: 'Patterns turn a one-off into something you can plan against.',
  },
  {
    title: 'Structures',
    kicker: 'what makes it possible',
    question: 'What arrangement produces that pattern?',
    body: 'The policies, architecture, workflows and resource allocations underneath it: kernel-level deployment with no staged rollout, no canary ring, and a channel classified as content rather than as code, so it skipped the review that code gets.',
    ask: 'Change a structure and you change every future event it would have produced.',
  },
  {
    title: 'Mental models',
    kicker: 'what holds it in place',
    question: 'What belief made that arrangement seem reasonable?',
    body: 'That a vendor security update is low-risk enough not to need staged deployment. Nobody wrote it down. Everybody acted on it, and every structure above was built to match.',
    ask: 'The least visible layer, and the one with the most leverage of all.',
  },
];

const CHECK: QuizQuestion[] = [
  {
    q: 'A company’s IT plan is thorough, formally documented, and signed off by the executive. It covers only the finance department’s systems. Which test in the SISP definition does it fail?',
    answer: 1,
    options: [
      { text: 'Long-range time frame', why: 'Nothing in the description says the horizon is short. A departmental plan can easily run five years and still not be SISP.' },
      { text: 'Broad scope', why: 'That is the one. Scope asks how much of the organisation the plan reaches, and a plan confined to one department cannot coordinate investment across the others or stop them duplicating it.' },
      { text: 'Conceptual level of abstraction', why: 'Nothing says this plan jumped to technical specification. It may be pitched at exactly the right altitude — for one department.' },
      { text: 'Upper-management perspective', why: 'Tempting, because the failure feels organisational. But the executive signed it, so that test passes. It is the reach of the plan, not the seniority of its approver, that fails here.' },
    ],
  },
  {
    q: 'Which of these is a collection rather than a system?',
    answer: 2,
    options: [
      { text: 'A football team', why: 'A system. Remove one player mid-match and every other player’s role changes, which is exactly what a collection does not do.' },
      { text: 'A kitchen', why: 'A system. The appliances and the person working between them interact to produce something none of them produces alone.' },
      { text: 'A toolbox', why: 'That is the one. Take the hammer out and the screwdriver behaves exactly as before. The tools co-exist without interacting, so the box has no behaviour of its own.' },
      { text: 'A toaster', why: 'A small system. Heating element, timer and lever interact, and removing any one of them stops the other two producing toast.' },
    ],
  },
  {
    q: 'After a data breach, an organisation resets every password and adds a banner reminding staff not to click unfamiliar links. Which layer is that fix operating at?',
    answer: 0,
    options: [
      { text: 'Events', why: 'Yes. It addresses this breach and restores service, and it changes nothing about how the next one gets in. The banner is the clearest tell: it asks people to compensate for an arrangement rather than changing the arrangement.' },
      { text: 'Patterns of behaviour', why: 'A pattern-layer response would start by asking how often this class of breach has happened and what it clusters around. Nothing here looks past the single incident.' },
      { text: 'Structures', why: 'A structural fix would change how access is granted, how mail is filtered, or how credentials are issued — the arrangement that produced the opening, rather than the symptom it produced.' },
      { text: 'Mental models', why: 'That layer is the belief underneath, such as "our staff are careful enough that filtering is optional". Reminding people to be careful actually reinforces that belief rather than examining it.' },
    ],
  },
  {
    q: 'A planning process is comprehensive, formally documented, cost-controlled and initiated by senior management. It runs once a year, and business units are told the priorities rather than consulted while they are set. What is the diagnosis?',
    answer: 1,
    options: [
      { text: 'Rational Adaptation', why: 'Half of it. All four Rational Tendencies are present, and both Adaptive Tendencies — broad participation and a continuous cycle — are missing, so the balanced profile is not there.' },
      { text: 'Rational, but not adaptive', why: 'Exactly. Thorough, formal, controlled and top-down, with nothing in the process that notices the organisation changing. The plan is out of date within a year, and the fix is to widen participation and shorten the interval, not to loosen the discipline.' },
      { text: 'Adaptive, but not rational', why: 'The other way round. This process has all the discipline and none of the responsiveness — adaptive without rational would be continuous, broadly consulted activity with no traceable line from a decision to a goal.' },
      { text: 'Neither half is in place', why: 'Four of the six dimensions are at the right pole. This is a real planning process with a specific, fixable weakness, not an absence of one.' },
    ],
  },
  {
    q: 'Why does this course insist that systems reshape strategy, and not only the other way round?',
    answer: 1,
    options: [
      { text: 'Because IT departments usually control more budget than strategy teams', why: 'They usually do not, and the claim is not about budget. It is about what becomes possible once a capability exists.' },
      { text: 'Because a new system opens options the organisation did not previously have', why: 'That is it. Real-time inventory data does not just speed up stock counts; it makes dynamic pricing and drop-shipping thinkable at all. A plan that only runs from strategy down to systems never notices those options.' },
      { text: 'Because technology changes faster than planning cycles', why: 'True, and it is one of the three forces that make planning hard — but it is a point about uncertainty, not about influence running in both directions.' },
      { text: 'Because senior managers rarely understand technology', why: 'Sometimes true and beside the point. The claim holds even where senior management understands the technology perfectly well.' },
    ],
  },
];

const RECAP: [string, string][] = [
  ['SISP asks whether a system should exist at all.', 'A project plan answers how to build it on time and on budget. Answer the prior question badly and flawless delivery still fails.'],
  ['Four tests, and all four have to pass.', 'Broad scope, an upper-management perspective, a long-range horizon, and a conceptual level of abstraction. Fail one and it is not SISP, however much analysis went in.'],
  ['A system is not a list.', 'Change one part and see whether the rest cares. Organisations are systems, which is why a fix applied to one visible part so often rebounds.'],
  ['Events are the cheap layer.', 'Patterns, structures and mental models carry the leverage, and none of them appear without somebody deliberately going to look for them.'],
  ['Balance beats maximum.', 'Rational Adaptation is a shape, not a score. Discipline without breadth goes stale; breadth without discipline is motion without a plan.'],
];

const COURSE_PATH = [
  { code: 'MBI800', label: 'You are here' },
  { code: 'MBI801', label: 'Systems analysis and design' },
  { code: 'MBI802', label: 'Database management systems' },
  { code: 'MBI803', label: 'Research methods' },
  { code: 'MBI804', label: 'Needs MBI800 underneath it' },
];

// Verbatim from the MBI800 course descriptor.
const LEARNING_OUTCOMES = [
  { n: 'LO1', short: 'Read the system you have', body: 'Assess current information systems to identify strategic opportunities and associated risks for improvement in a business context.' },
  { n: 'LO2', short: 'Weigh culture and privacy', body: 'Evaluate the impact of cultural protocols and data privacy on the successful implementation of information systems in diverse cultural settings.' },
  { n: 'LO3', short: 'Write the plan', body: 'Develop strategic plans to align information systems with organisational goals in a business context.' },
];

const ASSESSMENTS: [string, string, string][] = [
  ['60%', 'Strategic Information Systems Planning report', 'Individual · assesses LO1 and LO3'],
  ['40%', 'Case study analysis: cultural and ethical analysis in information systems implementation', 'Individual · assesses LO2'],
];

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

/** Tap to apply the swap test and find out whether the thing is a system. */
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

export default function IntroToSISPLesson() {
  const [sorted, setSorted] = useState(0);

  return (
    <div>
      <Reveal>
        <LessonHeader
          lesson={1}
          of={11}
          title="Introduction and systems thinking"
          lead="Before any planning framework arrives, two things have to be in place: a clear idea of what Strategic Information Systems Planning is for, and the habit of looking at an organisation as a system rather than a list of separate problems. This lesson builds both, and ends with the model the rest of the course leans on."
          meta={LESSON_META}
          objectives={OBJECTIVES}
        />
      </Reveal>

      {/* ══ 1.1 What SISP is ═════════════════════════════════════════════ */}
      <section id="what" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.1 · The question this course answers"
            title="Deciding what to build"
            aside="Which systems should we build, buy or retire, and in what order? Answering it badly is the most expensive thing an organisation does quietly."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Every organisation eventually faces the same question, and most answer it by accident. The results are
              familiar: systems that duplicate capability the business already owns, systems nobody asked for, and
              technology spending that drifts a little further from what the organisation needs every year.
            </p>
            <p>
              Strategic Information Systems Planning is the discipline that answers it deliberately.
            </p>
          </div>

          <div className="bt-caution">
            <p className="bt-eyebrow">Definition</p>
            <p>
              <b>Strategic Information Systems Planning</b> is the process of identifying and prioritising information
              systems investments so that they support an organisation’s business strategy, rather than being pursued
              independently of it.
            </p>
          </div>

          <div className="bt-prose" style={{ marginTop: 26 }}>
            <p>
              It is not the same activity as running an IT project. A project plan answers <i>how do we build this on
              time and on budget?</i> SISP answers the question before it: <i>should this system exist at all, and
              why, before any budget is committed?</i> Get that wrong and the best-executed project in the world
              still fails, because it solves a problem the organisation did not have.
            </p>
          </div>

          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th /><th>Project planning</th><th>SISP</th></tr>
              </thead>
              <tbody>
                <tr><td>Asks</td><td>How do we deliver this?</td><td>Should this exist, and before what else?</td></tr>
                <tr><td>Owned by</td><td>A project manager</td><td>Upper management, across the organisation</td></tr>
                <tr><td>Horizon</td><td>The length of the project</td><td>Long range, past any one delivery</td></tr>
                <tr><td>Detail</td><td>Specification, schedule, budget</td><td>Conceptual: capability, sequence, priority</td></tr>
                <tr><td>Fails when</td><td>Delivery slips</td><td>Everything is delivered and none of it was needed</td></tr>
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Three forces that make it hard</p>
            <div className="bt-rows">
              {THREE_FORCES.map(f => (
                <div key={f.title}>
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ 1.2 System or collection ═════════════════════════════════════ */}
      <section id="systems" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.2 · Before any framework"
            title="A system, or just a pile"
            aside="A system is a set of interacting parts producing behaviour no part produces alone. The test is cheap: change one part and see whether the rest cares."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              This distinction looks like a warm-up exercise and is not. Everything later in this course — process
              dimensions, risk registers, feasibility studies — assumes you can look at an organisation and see
              interacting parts rather than a list of separate problems. Without that habit, planning collapses into
              fixing one visible symptom at a time, and the same problem returns in a different shape a year later.
            </p>
          </div>

          <p className="bt-eyebrow bt-eyebrow--quiet" style={{ marginTop: 28 }}>Activity · sort these six</p>
          <div className="bt-flipgrid" style={{ marginTop: 14 }} onClick={() => setSorted(s => Math.min(SORT_ITEMS.length, s + 1))}>
            {SORT_ITEMS.map(item => (
              <SortCard key={item.thing} thing={item.thing} verdict={item.verdict} why={item.why} />
            ))}
          </div>
          <p className="bt-note">
            {sorted >= SORT_ITEMS.length
              ? 'Three systems, two collections, and one that changes category the moment something else depends on it. Organisations sit in that last group far more often than anybody plans for.'
              : 'Decide for each one before you turn it over. Remove a part: if nothing else changes, it was a collection.'}
          </p>
        </Reveal>
      </section>

      {/* ══ 1.3 The loop ═════════════════════════════════════════════════ */}
      <section id="loop" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.3 · Why a sensible fix rebounds"
            title="Run the loop for a year"
            stop="."
            aside="A company reports poor sales. The obvious response is to tell the sales team to work harder. Pick an intervention and watch twelve months of it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Systems thinking replaces two habits of ordinary problem-solving. It looks for interrelationships
              between parts rather than a single linear cause, and it looks at change over time rather than a
              snapshot. Both show up in the same example, and neither is persuasive as a sentence.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <FeedbackLoopSim />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-note" style={{ marginTop: 20 }}>
            Nobody in this loop is behaving unreasonably. Management acts on the information it is given, and that
            information is produced by the very performance it is meant to explain. That is what a feedback loop is,
            and it is why the intervention point matters more than the effort spent.
          </p>
        </Reveal>
      </section>

      {/* ══ 1.4 The Iceberg Model ════════════════════════════════════════ */}
      <section id="iceberg" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.4 · The Iceberg Model"
            title="Take one outage apart"
            aside="Senge's four layers, from what happened down to the belief that made it likely. Learning runs downward, and so does leverage."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              The Iceberg Model is systems thinking’s most practical export: a way of asking why a single observed
              event is happening by moving down through progressively less visible layers. Click your way down
              through a documented one.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <IcebergModel layers={ICEBERG_LAYERS} />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-caution" style={{ marginTop: 26 }}>
            <p className="bt-eyebrow">Activity · bring your own</p>
            <p>
              Pick an incident you have actually watched happen — an outage, a breach, a system nobody adopted — and
              work down all four layers on paper before the first class. State the event in one sentence, then the
              pattern, then the structure, then the belief. The last one is the hard one, and it is the one we
              discuss.
            </p>
          </div>
          <p className="bt-note" style={{ marginTop: 18 }}>
            Most organisations spend nearly all their improvement effort on the Events layer, because it is the only
            layer visible without deliberate investigation. That is exactly why the same problem returns in a new
            shape a year later.
          </p>
        </Reveal>
      </section>

      {/* ══ Knowledge check ══════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="End of the lesson"
            title="Check yourself"
            aside="Five questions on what this lesson claimed. Nothing is stored and nothing is reported — this is for you, now, while there is still time to reread."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz
            questions={CHECK}
            closing="Any you got wrong point at a specific section above. Worth going back before the next lesson."
          />
        </Reveal>
      </section>

      <Reveal>
        <Recap
          title="Five things to carry forward"
          points={RECAP}
          footnote="Everything below this line is what the course does next, and the practical detail on how it runs. The lesson itself ends here."
        />
      </Reveal>

      {/* ══ What's next ══════════════════════════════════════════════════ */}
      <section id="ahead" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Lessons 2 onward"
            title="Where this goes next"
            aside="A short look at the frameworks the rest of the course builds on top of what you just did, with one of them ready to try."
          />
        </Reveal>

        <div className="bt-preview">
          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">02</span>
              <div>
                <h3>A definition you can test something against</h3>
                <p className="bt-prose">
                  Segars, Grover and Teng give SISP a testable shape: a formal process, conducted at a broad scope,
                  from an upper-management perspective, over a long-range time frame, at a conceptual rather than
                  operational level of abstraction. Four properties, each ruling something out.
                </p>
                <ol className="bt-flow bt-flow--tight">
                  <li><span className="bt-flow__n bt-tnum">1</span><div><h4>Broad scope</h4><p>Rules out a planning exercise confined to one department’s systems.</p></div></li>
                  <li><span className="bt-flow__n bt-tnum">2</span><div><h4>Upper-management perspective</h4><p>Rules out planning that never leaves the IT department. SISP has to be owned where organisation-wide resources can be committed.</p></div></li>
                  <li><span className="bt-flow__n bt-tnum">3</span><div><h4>Long-range time frame</h4><p>Rules out a horizon measured in one project’s duration.</p></div></li>
                  <li><span className="bt-flow__n bt-tnum">4</span><div><h4>Conceptual abstraction</h4><p>Rules out jumping to technical specification before the business question is settled.</p></div></li>
                </ol>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">03</span>
              <div>
                <h3>The six process dimensions, and the shape that works</h3>
                <p className="bt-prose">
                  Any planning process can be described along six dimensions, and — this is the part people get
                  wrong — the best one is not the process scoring highest on all six. It is a specific balanced
                  profile called Rational Adaptation. You can try it now: this is Lesson 3’s framework, set to the
                  worked example the course opens that lesson with.
                </p>
                <div style={{ marginTop: 24 }}>
                  <DimensionProfile />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">06</span>
              <div>
                <h3>Risk, as part of the plan</h3>
                <p className="bt-prose">
                  The descriptor names three risks explicitly — technological failure, data breaches and misalignment
                  with organisational objectives — and the course treats them as planning inputs rather than a
                  compliance exercise run after the decision. A risk found during planning is a decision. The same
                  risk found during implementation is an incident. The only difference is when somebody looked.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">07</span>
              <div>
                <h3>Culturally responsive planning, assessed on its own</h3>
                <p className="bt-prose">
                  LO2 carries 40% of this course, which tells you how seriously it is meant. Systems handling
                  personal or culturally sensitive data — health records above all — carry obligations beyond cost
                  and schedule. The course works through the design of information services for Māori and Pasifika
                  health providers as a case: data sovereignty, cultural protocols and community consent, not just
                  technical privacy controls.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">08</span>
              <div>
                <h3>Real implementations, named</h3>
                <p className="bt-prose">
                  Frameworks are easier to apply once you have watched them succeed and fail in organisations you can
                  name, under constraints somebody actually had. The course uses documented case studies from
                  telecommunications, government and several national contexts, plus five founding stories of
                  companies whose information-systems choices created an advantage competitors could not copy.
                </p>
                <a className="bt-btn bt-btn--sm" href={`${BASE}#/five-stories`} style={{ marginTop: 18, textDecoration: 'none' }}>
                  Read the five stories
                  <span className="bt-btn__badge" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 44 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">The full topic list, from the descriptor</p>
            <ol className="bt-topics" style={{ marginTop: 16 }}>
              {COURSE_CONTENT.map((item, i) => (
                <li key={item}>
                  <span className="bt-topics__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      {/* ══ The course ═══════════════════════════════════════════════════ */}
      <section id="course" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="The practical detail"
            title="How this course runs"
            aside="15 credits at Level 8, no prerequisites. The first course of the programme, and the one MBI804 later builds on."
          />
        </Reveal>
        <Reveal delay={0.05}>
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

          <div className="bt-outcomes" style={{ marginTop: 40 }}>
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
          <p className="bt-note" style={{ marginTop: 16 }}>
            Word for word from the course descriptor. Everything you are assessed on maps back to one of these three.
          </p>

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

      {/* ══ Come prepared ════════════════════════════════════════════════ */}
      <section id="prepared" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before the first class"
            title="What to bring"
            aside="Nothing here needs buying, and no prior IT background is assumed. Mainly: bring one example of your own."
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
