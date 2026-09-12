import { ExternalLink } from 'lucide-react';
import { LessonHeader, Quiz, Recap, Reveal, SaveAsPdf, SectionHead, type QuizQuestion } from '../blend';
import ConstraintTriangle from './project/ConstraintTriangle';
import SlipSim from './project/SlipSim';
import MethodChoice from './project/MethodChoice';
import RiskMatrix from './project/RiskMatrix';
import PostMortemBuilder from './project/PostMortemBuilder';
import { PM_NOTES } from '../../content/notes/mbi804ProjectManagement';

// ─── MBI804 · Lesson 1: What a project is, and what decides how to run it ──
// A public, ungated page in Blended Teaching Content's course-page design
// system, Blend (src/components/blend/README.md), running on MBI804's plum
// through the `project` accent set by the shell.
//
// This is the course's actual first lesson rather than a prospectus. It runs
// in the order the descriptor's content list does — principles and practices
// first, then initiation and planning, then methodology, then risk — and
// everything after the knowledge check is labelled as what comes next.
//
// The learning outcomes, indicative content and assessment weightings are
// verbatim from the MBI804 course descriptor. The schedule and cost material
// follows the PMI cost-management lecture on /cost-management and its running
// SecurePay NZ scenario; the Scrum summary follows the Agile Scrum deck; the
// conflict modes are the Thomas-Kilmann set used in the Conflict Swap
// classroom activity.

const BASE = import.meta.env.BASE_URL;

const OBJECTIVES = [
  'Say what makes something a project rather than the work an organisation already does',
  'Name which of scope, time and cost is actually free to move on a given project',
  'Explain why two tasks can slip by the same amount and only one of them costs the launch',
  'Match a project’s attributes to Agile, Waterfall or PRINCE2, and defend the match',
  'Turn a risk into an exposure figure, and choose a response that costs less than it removes',
];

const LESSON_META: [string, string][] = [
  ['Reading', '30 minutes'],
  ['Assumes', 'MBI800 and MBI801'],
  ['Bring', 'a project you watched go wrong'],
];

const PROJECT_TESTS = [
  {
    title: 'Temporary',
    body: 'It has a definite start and a definite end. Not short — temporary. A five-year infrastructure programme is a project; running the service it delivers is not.',
  },
  {
    title: 'Unique',
    body: 'It produces a result that did not exist before. The hundredth store fit-out is still a project, because this store, this site and this landlord have never been done.',
  },
  {
    title: 'Progressively elaborated',
    body: 'You know least on the first day and are expected to commit anyway. Detail arrives as the work does, which is why an estimate has a maturity and a plan has versions.',
  },
];

const SUCCESS_LEVELS = [
  {
    title: 'Delivered',
    body: 'On time, inside budget, matching the agreed scope. This is what gets reported, and it is the only one of the three most projects measure.',
  },
  {
    title: 'Adopted',
    body: 'The people it was built for actually use it. A system delivered perfectly and used by nobody has consumed the whole budget and returned nothing.',
  },
  {
    title: 'Worth it',
    body: 'The benefit the business case promised turned up. This is measured months after the project closes, usually by somebody else, and it is the only level that pays for the other two.',
  },
];

const METHOD_ROWS: [string, string, string, string][] = [
  ['Delivery', 'Incremental, every sprint', 'One delivery at the end', 'Staged, board-approved'],
  ['Requirements', 'Evolving, change welcomed', 'Fixed up front, change is costly', 'Fixed per stage, re-justified between'],
  ['Customer', 'Continuous involvement', 'Start and end only', 'Represented on the project board'],
  ['Testing', 'Continuous, every sprint', 'A phase after development', 'Per stage, with stage assurance'],
  ['Risk', 'Surfaced early and often', 'Discovered late, expensively', 'Reviewed at every boundary'],
  ['Best suited to', 'Complex, evolving software', 'Fixed scope, stable requirements', 'Governance-heavy, publicly funded work'],
];

// From the PMI cost-management lecture: estimate types by project maturity.
const ESTIMATE_TYPES: [string, string][] = [
  ['Rough order of magnitude', 'Very early, before requirements settle. Typically −25% to +75%. Useful to decide whether to look further, not to sign anything.'],
  ['Budgetary', 'Once scope is roughly known, for allocating money into a budget. Typically −10% to +25%.'],
  ['Definitive', 'Late, from a decomposed work breakdown structure. Typically −5% to +10%, and the only one worth committing to a contract.'],
];

// The Thomas-Kilmann modes, as used in the Conflict Swap classroom activity.
const CONFLICT_MODES: [string, string][] = [
  ['Competing', 'Assertive, uncooperative. Right when a decision is urgent and unpopular, or safety is at stake.'],
  ['Collaborating', 'Assertive and cooperative. The mode everybody names first, and the most expensive: it needs time and trust both sides have to spend.'],
  ['Compromising', 'Moderate on both. Fast and fair-looking, and it can leave both sides equally unhappy with a solution neither believes in.'],
  ['Avoiding', 'Unassertive, uncooperative. Occasionally correct — when the issue is trivial, or tempers need to cool — and corrosive as a habit.'],
  ['Accommodating', 'Unassertive, cooperative. Right when you are wrong, or when the relationship matters more than this particular point.'],
];

const CHECK: QuizQuestion[] = [
  {
    q: 'A client fixes the launch date, signs off a budget that will not grow, and insists every feature in the specification ships. What actually becomes the variable?',
    answer: 2,
    options: [
      { text: 'Time, because the date always slips in the end', why: 'Often what happens, and it is not what the client has agreed to. The question is what gives while everyone is still insisting nothing will.' },
      { text: 'Cost, because contractors get added when it gets tight', why: 'A common response and not a free one: ramp-up time and communication overhead mean added people do not convert cleanly into speed. And the budget here is signed.' },
      { text: 'Quality, because it is the only thing nobody named', why: 'Yes. Pin all three corners and the pressure goes somewhere undeclared: testing compressed, review skipped, refactoring deferred. The bill arrives later as defects, by which point it is no longer visibly the same decision.' },
      { text: 'Nothing — a well-run project can hold all three', why: 'This is the belief the triangle exists to dislodge. Two can be held. The third is absorbing every surprise the project meets, and if you have not named it, it is quality.' },
    ],
  },
  {
    q: 'Gateway integration sits on the critical path and loses three weeks. In the same fortnight, onboarding documentation — which has four weeks of float — also loses three weeks. What happens to the launch date?',
    answer: 0,
    options: [
      { text: 'It moves three weeks', why: 'Right. The integration slip goes straight through to the launch because nothing in that chain has slack. The documentation slip is absorbed entirely by its float and costs the project nothing at all.' },
      { text: 'It moves six weeks', why: 'Slips do not add up like that. They only combine when both tasks are on the critical path, and the documentation is not — it has four weeks of slack precisely so that a three-week problem stays a task problem.' },
      { text: 'It does not move', why: 'The documentation slip is free, but the integration slip is not. That chain has no slack, so every week lost there is a week the launch loses.' },
      { text: 'It moves three weeks only if the same people work on both', why: 'Resource contention is a real and separate problem. The three weeks here come from the network of dependencies, and would arrive even with two completely separate teams.' },
    ],
  },
  {
    q: 'A hospital records migration is under external audit. Every requirement is fixed in a signed specification and each one has to be traceable to the test that proves it. Which methodology fits best?',
    answer: 1,
    options: [
      { text: 'Scrum', why: 'An emerging scope is the one thing this project must not have. A backlog that is reprioritised every fortnight fights the traceability the auditor needs — though the engineering practices, like automated regression tests, are still worth taking.' },
      { text: 'Waterfall', why: 'Yes. Fixed scope, a signed specification and an auditor wanting each requirement traced to its evidence. Sequential phases with formal sign-off produce exactly that record, and there is nothing to gain from re-deciding scope every two weeks.' },
      { text: 'Kanban and nothing else', why: 'Kanban manages flow through a process. It says nothing about requirement traceability or phase sign-off, which is the entire constraint on this project.' },
      { text: 'Any of them — methodology is a team preference', why: 'This is the answer LO1 exists to rule out. The methodology follows from the project’s attributes, and the 60% case study is marked on whether you can show that reasoning.' },
    ],
  },
  {
    q: 'What does PRINCE2 not tell you?',
    answer: 2,
    options: [
      { text: 'Who sits on the project board', why: 'It does. Defined roles are one of its central features, including who represents the business, the user and the supplier.' },
      { text: 'When the business case is re-justified', why: 'It does. Continued business justification is an explicit principle, checked at every stage boundary.' },
      { text: 'How the build itself is sequenced', why: 'Correct. PRINCE2 is a management method, not a delivery method. Choose it and you still have to choose Waterfall or Agile underneath it — which is why the two are so often used together rather than as alternatives.' },
      { text: 'What happens when tolerances are breached', why: 'It does. Management by exception is the mechanism: the board is only pulled in once agreed tolerances are actually exceeded.' },
    ],
  },
  {
    q: 'A risk has a 50% chance of costing $40,000. A proposed mitigation costs $30,000 and removes it entirely. What does the exposure figure tell you?',
    answer: 1,
    options: [
      { text: 'Mitigate — removing a risk outright is always worth it', why: 'This is how projects spend their contingency on the risks that worry people most rather than the ones that cost most. Removal is not free, and its price has to be compared with something.' },
      { text: 'The mitigation costs more than the exposure it removes, so it needs a justification other than the number', why: 'Yes. Exposure is $20,000 and the fix is $30,000. That can still be the right call — a reputational or safety consequence the money does not capture — but now it has to be argued rather than assumed.' },
      { text: 'Accept it, because $20,000 is below any reporting threshold', why: 'Thresholds are set per project, not universally, and acceptance is a deliberate decision with a reserve behind it — not a default for anything that looks small.' },
      { text: 'Transfer it to the vendor', why: 'Transfer moves the consequence to somebody better placed to carry it, at the price of a premium. It might be right here, but nothing in the numbers given points to it over the alternatives.' },
    ],
  },
];

const RECAP: [string, string][] = [
  ['A project is temporary and produces something unique.', 'That is what separates it from the operations it will eventually hand over to, and it is why you commit on the day you know least.'],
  ['Two corners, never three.', 'Pin scope, time and cost all at once and quality becomes the variable nobody declared. Naming which corner moves is most of the first week.'],
  ['Not every slip costs the same.', 'Float is a task’s budget for going wrong. A slip on the critical path has no budget, so it spends the launch date instead.'],
  ['Methodology is a judgement about the project, not a preference.', 'Moving requirements want Agile. Signed and audited ones want Waterfall. Public money and stage funding want PRINCE2, with one of the other two underneath it.'],
  ['A risk is not named until it has a number, an owner and a date.', 'Everything before that is a worry, and worries do not get compared, funded or reviewed.'],
];

const COURSE_PATH = [
  { code: 'MBI800', label: 'Prerequisite' },
  { code: 'MBI801', label: 'Prerequisite' },
  { code: 'MBI804', label: 'You are here' },
  { code: 'Strand', label: 'Business Analytics or Healthcare Informatics' },
];

// Verbatim from the MBI804 course descriptor.
const LEARNING_OUTCOMES = [
  { n: 'LO1', short: 'Choose the method', body: 'Critically analyse the attributes of an IT project to recommend the most suitable project management methodologies in an organisation.' },
  { n: 'LO2', short: 'Name the risks', body: 'Assess potential risks associated with IT projects to propose mitigation strategies for an organisation.' },
  { n: 'LO3', short: 'Run it in your field', body: 'Apply IT project management approaches and practices within specialised domains in a professional context.' },
];

const ASSESSMENTS: [string, string, string][] = [
  ['60%', 'Project methodology selection: case study', 'Individual · assesses LO1 and LO3'],
  ['40%', 'Risk management plan: report', 'Individual · assesses LO2 and LO3'],
];

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

/** How much of what you did not know is settled, month by month. */
function UnknownsFigure() {
  const W = 520;
  const H = 190;
  const PAD = { t: 18, r: 74, b: 30, l: 40 };
  const PW = W - PAD.l - PAD.r;
  const PH = H - PAD.t - PAD.b;
  const agile = [0, 34, 55, 70, 80, 87, 92, 96, 100];
  const water = [0, 6, 11, 15, 19, 24, 33, 68, 100];
  const px = (i: number) => PAD.l + (i / 8) * PW;
  const py = (v: number) => PAD.t + PH - (v / 100) * PH;
  const line = (vals: number[]) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i)} ${py(v)}`).join(' ');

  return (
    <figure className="bt-figure">
      <div className="bt-figure__frame">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Share of a project's unknowns resolved over its life. Under Agile the curve climbs steeply from the first sprint and is above eighty per cent by the halfway point. Under Waterfall it stays nearly flat until testing, then rises almost vertically at the end.">
          {[0, 50, 100].map(v => (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={py(v)} y2={py(v)} stroke="var(--border-subtle)" strokeWidth={v === 0 ? 1 : 0.6} />
              <text x={PAD.l - 8} y={py(v) + 3.5} textAnchor="end" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--ink-400)">{v}%</text>
            </g>
          ))}
          <text x={PAD.l} y={H - 10} fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">kick-off</text>
          <text x={W - PAD.r} y={H - 10} textAnchor="end" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">go live</text>

          <path d={line(water)} fill="none" stroke="var(--ink-300)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={line(agile)} fill="none" stroke="var(--accent-500)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

          <text x={px(8) + 8} y={py(100) + 4} fontSize="11" fontWeight="700" fontFamily="var(--font-display)" fill="var(--accent-600)">Agile</text>
          <text x={px(8) + 8} y={py(100) + 20} fontSize="11" fontWeight="700" fontFamily="var(--font-display)" fill="var(--ink-400)">Waterfall</text>
        </svg>
      </div>
      <figcaption>
        Both curves end at the same place. The difference is when you find out — and a surprise discovered during
        testing costs several times what the same surprise costs in week three.
      </figcaption>
    </figure>
  );
}

export default function IntroToProjectManagementLesson() {
  return (
    <div>
      <Reveal>
        <LessonHeader
          lesson={1}
          of={9}
          title="What a project is, and what decides how to run it"
          lead="MBI800 asked whether a system should exist. This course starts once that is settled and something has to be delivered. The first lesson covers the three things a project manager decides before any work begins: what is actually fixed, what a delay really costs, and which methodology the project's own attributes call for."
          meta={LESSON_META}
          objectives={OBJECTIVES}
        />
      </Reveal>

      {/* ══ 1.1 What a project is ════════════════════════════════════════ */}
      <section id="project" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.1 · Principles and practices"
            title="What makes it a project"
            aside="Three tests, and then the harder question underneath them: what it would mean for this one to have succeeded."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Most of what an organisation does is not a project. Serving customers, closing the month, keeping the
              network up — that is operations: ongoing, repetitive, and judged on consistency. A project is the other
              thing, and it is judged on entirely different terms.
            </p>
          </div>

          <div className="bt-pairgrid bt-pairgrid--three">
            {PROJECT_TESTS.map(t => (
              <div key={t.title} className="bt-card">
                <h4>{t.title}</h4>
                <p>{t.body}</p>
              </div>
            ))}
          </div>

          <div className="bt-prose" style={{ marginTop: 32 }}>
            <p>
              That last property is the awkward one. A project commits to a date and a budget on the day it
              understands least about the work, and everything this course teaches is a way of making that commitment
              honestly rather than optimistically.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Three levels of success, and only one gets reported</p>
            <div className="bt-rows">
              {SUCCESS_LEVELS.map(s => (
                <div key={s.title}>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
            <div className="bt-caution">
              <p className="bt-eyebrow">Where this course sits</p>
              <p>
                A project can pass the first level and fail the other two. That is the headline at the top of this
                page, and it is why MBI800 is a prerequisite: choosing the right project is a planning problem, and
                running it well is this one.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ 1.2 The triple constraint ════════════════════════════════════ */}
      <section id="constraints" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.2 · Initiation"
            title="Something has to give"
            aside="Scope, time and cost, with quality in the middle. Pin two and the third is absorbing every surprise the project meets."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ConstraintTriangle />
        </Reveal>
      </section>

      {/* ══ 1.3 Critical path and float ══════════════════════════════════ */}
      <section id="slip" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.3 · Planning"
            title="Not every delay costs the same"
            stop="."
            aside="Two tasks lose the same three weeks. One moves the launch date and one costs nothing at all. Knowing which is which is where a schedule earns its keep."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              A schedule is not a list of dates. It is a network of dependencies, and somewhere in that network runs
              the longest chain with no slack in it — the <b>critical path</b>. Tasks on it have nothing to give.
              Tasks off it have <b>float</b>: time they can lose before anything downstream notices.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <SlipSim />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-note" style={{ marginTop: 20 }}>
            This is why a project manager who treats every delay as equally urgent spends their attention in the
            wrong place, and why the first question about any slipped task is not how late it is, but what is waiting
            on it.
          </p>
        </Reveal>
      </section>

      {/* ══ 1.4 Methodology (LO1) ════════════════════════════════════════ */}
      <section id="methods" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.4 · LO1 · Methodology selection"
            title="Three ways to shape the work"
            aside="Agile, Waterfall and PRINCE2 are not competing answers to one question. They answer different questions, and the project decides which question is being asked."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th /><th>Agile (Scrum)</th><th>Waterfall</th><th>PRINCE2</th></tr>
              </thead>
              <tbody>
                {METHOD_ROWS.map(([label, a, w, p]) => (
                  <tr key={label}><td>{label}</td><td>{a}</td><td>{w}</td><td>{p}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bt-prose" style={{ marginTop: 30 }}>
            <p>
              The row that decides most arguments is <b>risk</b>. Every project starts with a pile of things nobody
              knows yet, and a methodology is largely a choice about when you find them out.
            </p>
          </div>
          <UnknownsFigure />
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Activity · pick a method for each project</p>
            <div style={{ marginTop: 16 }}>
              <MethodChoice />
            </div>
            <p className="bt-note" style={{ marginTop: 20 }}>
              No methodology is good or bad on its own, only fit or unfit for a project’s attributes. That sentence
              is the whole of LO1, and the 60% case study is marked on the argument rather than on the choice.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 1.5 Risk (LO2) ═══════════════════════════════════════════════ */}
      <section id="risk" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.5 · LO2 · Risk and mitigation"
            title="Put a number on a risk"
            aside="A risk you cannot compare to another risk cannot be prioritised, funded or argued about. Probability times impact is what makes it comparable."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Risk arrives in Lesson 1 rather than Lesson 4 for the same reason the methodology does: both decisions
              are made at the point where they are cheapest, and both are routinely left until they are not. Place
              one real risk on the grid, then choose what to do about it.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <RiskMatrix />
          </div>
        </Reveal>
      </section>

      {/* ══ 1.6 Build your own ═══════════════════════════════════════════ */}
      <section id="yours" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1.6 · Your turn"
            title="Write up one of your own"
            stop="."
            aside="Six questions on a project you watched, in the order this lesson covered them. The page builds as you answer, and you take it away at the end."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              This is deliberately a small version of the 60% case study: a project’s attributes, the methodology
              those attributes called for, and an argument about the gap between that and what actually happened.
              Finish it now, on a project you already know, and the assessment stops being a research exercise four
              months from now.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <PostMortemBuilder />
          </div>
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
            aside="Scope, money, the framework you are most likely to meet in industry, and the part of the job that is people rather than plans."
          />
        </Reveal>

        <div className="bt-preview">
          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">03</span>
              <div>
                <h3>Scope, and the sentence that costs the most money</h3>
                <p className="bt-prose">
                  The work breakdown structure decomposes the deliverable until every piece is small enough to
                  estimate and assign. The scope baseline records what is in — which is also the only way to
                  recognise scope creep when it arrives, one reasonable request at a time.
                </p>
                <div className="bt-caution">
                  <p className="bt-eyebrow">The sentence</p>
                  <p>
                    “While you’re in there, could you also…”. Every one of these is individually reasonable and free
                    to ask for. Without a baseline to compare against, nobody can say what they have collectively
                    cost.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">04</span>
              <div>
                <h3>Estimating, and the honesty of a range</h3>
                <p className="bt-prose">
                  An estimate has a maturity. Asking for a definitive number before the scope exists does not make it
                  accurate — it hides the uncertainty that is still there.
                </p>
                <div className="bt-rows">
                  {ESTIMATE_TYPES.map(([title, body]) => (
                    <div key={title}>
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
                <figure className="bt-figure">
                  <div className="bt-figure__frame">
                    <svg viewBox="0 0 520 170" width="100%" role="img" aria-label="A three-point estimate: optimistic four weeks, most likely six, pessimistic fourteen. The weighted expected value falls at seven weeks, to the right of the most likely figure.">
                      {/* The long tail is the whole point: the pessimistic
                          case sits much further from the mode than the
                          optimistic one, which drags the estimate right. */}
                      <path
                        d="M46 128 C 120 128, 150 36, 196 36 C 250 36, 300 92, 380 114 C 430 128, 460 128, 486 128"
                        fill="var(--accent-50)" stroke="var(--accent-300)" strokeWidth="1.6"
                      />
                      <line x1="34" y1="128" x2="498" y2="128" stroke="var(--ink-300)" strokeWidth="1" />

                      {([
                        { x: 46, label: 'O', weeks: '4 wks', sub: 'optimistic' },
                        { x: 196, label: 'M', weeks: '6 wks', sub: 'most likely' },
                        { x: 486, label: 'P', weeks: '14 wks', sub: 'pessimistic' },
                      ] as const).map(m => (
                        <g key={m.label}>
                          <line x1={m.x} y1="128" x2={m.x} y2="136" stroke="var(--ink-300)" strokeWidth="1" />
                          <text x={m.x} y="150" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="var(--font-display)" fill="var(--ink-900)">{m.label} · {m.weeks}</text>
                          <text x={m.x} y="163" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">{m.sub}</text>
                        </g>
                      ))}

                      <line x1="252" y1="26" x2="252" y2="128" stroke="var(--accent-500)" strokeWidth="2" />
                      <circle cx="252" cy="26" r="4" fill="var(--accent-500)" />
                      <text x="262" y="24" fontSize="12" fontWeight="800" fontFamily="var(--font-display)" fill="var(--accent-600)">E = 7 weeks</text>
                      <text x="262" y="39" fontSize="10" fontFamily="var(--font-body)" fill="var(--ink-400)">(4 + 4×6 + 14) ÷ 6</text>
                    </svg>
                  </div>
                  <figcaption>
                    PERT weights the most likely case four to one and still lets the tails count. The pessimistic tail
                    alone moved this estimate a week to the right of the number the team would have said out loud.
                  </figcaption>
                </figure>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">05</span>
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
              <span className="bt-step__n">07</span>
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
                    <p>Product Backlog, committed to a Product Goal. Sprint Backlog, committed to a Sprint Goal and owned by the developers. Increment, held to the Definition of Done.</p>
                  </div>
                  <div className="bt-card">
                    <h4>Five events</h4>
                    <p>The Sprint, 1–4 weeks, containing the rest. Sprint Planning, up to 8 hours. Daily Scrum, 15 minutes. Sprint Review, up to 4 hours. Retrospective, up to 3 hours. Timeboxes shown for a four-week sprint; scale down proportionally.</p>
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
              <span className="bt-step__n">08</span>
              <div>
                <h3>The part of the job that is people</h3>
                <p className="bt-prose">
                  Communication, stakeholder management and conflict are named on the descriptor as key aspects of
                  project success, and they are where most delivery problems actually begin. The five Thomas-Kilmann
                  modes describe how people handle a disagreement. There is no best one — only a best one for this
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
            aside="15 credits at Level 8, in trimester two. MBI800 and MBI801 are prerequisites, and the course assumes both."
          />
        </Reveal>
        <Reveal delay={0.05}>
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
            Both assessments are individual, and neither is a memory test. One asks you to recommend a methodology
            and defend it against a real case; the other asks you to write a risk management plan somebody could
            actually run.
          </p>
        </Reveal>
      </section>

      {/* ══ Come prepared ════════════════════════════════════════════════ */}
      <section id="prepared" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before the first class"
            title="What to bring"
            aside="Nothing here needs buying. Mainly: a project you watched go wrong, and a laptop."
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
                    <p>Every sector runs projects. The methodology vocabulary travels between industries in a way a specific technology stack does not.</p>
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
