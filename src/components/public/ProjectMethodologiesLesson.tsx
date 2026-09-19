import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { LessonHeader, Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import LifecycleGallery from './methods/LifecycleGallery';
import CostOfChangeCurve from './methods/CostOfChangeCurve';
import SpiralModel from './methods/SpiralModel';
import Prince2Explorer from './methods/Prince2Explorer';
import ManifestoValues from './methods/ManifestoValues';
import AgileFamily from './methods/AgileFamily';
import ScrumCycle from './methods/ScrumCycle';
import ScrumRoleSort from './methods/ScrumRoleSort';
import SprintTimeline from './methods/SprintTimeline';
import ScrumBoard from './methods/ScrumBoard';

// ─── MBI804 · Lesson 2: the methodologies, and Scrum up close ─────────────
// A public, ungated page in Blend (src/components/blend/README.md), on
// MBI804's plum through the `project` accent set by the shell.
//
// Lesson 1 ended by asking which methodology a project's attributes call
// for, and answered it with a three-way chooser. This lesson is what sits
// behind that answer: what each method actually is, drawn rather than
// described, and then Scrum at the depth somebody will be asked about in an
// interview.
//
// Deliberately more picture than paragraph. Ten interactive widgets carry
// the teaching and the prose between them is doing joins, not lecturing —
// the descriptor lists "Agile, Waterfall and PRINCE2 project management" as
// one content line, and this is the lesson that covers it.
//
// Scrum content follows the Scrum Guide 2020 and matches the gated Agile
// Scrum deck (src/components/slides/AgileScrumDeck.tsx) so a student meets
// the same definitions in both places. PRINCE2 follows the 2009/2017
// editions, with the PRINCE2 7 renaming noted rather than substituted.

const BASE = import.meta.env.BASE_URL;

const OBJECTIVES = [
  'Draw the shape of Waterfall, Spiral, PRINCE2 and Agile, and say what each one optimises for',
  'Explain why the cost of a change rises with the phase it arrives in, and what each method does about it',
  'Place Scrum, XP, Kanban, Crystal, Lean, FDD and DSDM inside the Agile family without conflating them',
  'Name Scrum’s three accountabilities, three artefacts and five events, with the right timebox on each',
  'Say who owns each Scrum decision, and recognise the common ways teams get that wrong',
];

const LESSON_META: [string, string][] = [
  ['Reading', '45 minutes'],
  ['Follows', 'Lesson 1'],
  ['Bring', 'nothing — everything runs here'],
];

const COMPARE: [string, string, string, string, string][] = [
  ['Shape of the work', 'One pass, five phases', 'Widening loops', 'Authorised stages', 'Repeating short iterations'],
  ['What drives the plan', 'The specification', 'The largest remaining risk', 'The business case', 'The ordered backlog'],
  ['Requirements', 'Fixed and signed up front', 'Re-set each loop', 'Baselined per stage', 'Expected to move'],
  ['Customer sees it', 'At the end', 'Each prototype', 'At each stage boundary', 'Every iteration'],
  ['Risk surfaces', 'Late, in testing', 'First, by design', 'At every boundary', 'Early and continuously'],
  ['Stopping the project', 'Awkward and late', 'A normal option each loop', 'A normal option each stage', 'A normal option each iteration'],
  ['Costs most when', 'The scope was never stable', 'The unknowns were small', 'The project was small', 'Nobody turns up to the review'],
];

const ROLE_CARDS: [string, string, string][] = [
  [
    'Product Owner',
    'One person, never a committee',
    'Accountable for maximising the value of the product. Owns and orders the Product Backlog, develops and communicates the Product Goal, makes backlog items clear, and decides what is released. Their decisions are visible in the order of the list, and the organisation has to respect them for the role to mean anything.',
  ],
  [
    'Scrum Master',
    'A servant-leader, not a manager',
    'Accountable for the team’s effectiveness and for Scrum being understood and enacted. Serves the Developers by coaching self-management and removing impediments, the Product Owner by helping with backlog techniques and stakeholders, and the organisation by leading its adoption of Scrum.',
  ],
  [
    'Developers',
    'Typically three to nine, cross-functional',
    'Accountable for creating a usable Increment every Sprint. They hold all the skills needed between them, plan the Sprint Backlog, adapt it daily toward the Sprint Goal, and own the Definition of Done. No sub-teams and no internal hierarchy — anyone doing the work is a Developer, whatever their job title says. The 2017 Guide set the range at three to nine; the 2020 Guide frames it as a whole Scrum Team of ten or fewer.',
  ],
];

const ARTEFACTS: [string, string, string][] = [
  ['Product Backlog', 'Product Goal', 'The single ordered list of everything that might be needed. Owned by the Product Owner, refined continuously, never complete.'],
  ['Sprint Backlog', 'Sprint Goal', 'The Sprint Goal, the items selected for the Sprint, and the plan for delivering them. Owned by the Developers and updated daily.'],
  ['Increment', 'Definition of Done', 'A usable stepping stone toward the Product Goal. Several may exist in one Sprint, and it counts only once it meets the Definition of Done.'],
];

const DOD: string[] = [
  'Code peer-reviewed and merged',
  'Unit tests written and passing',
  'Tested in a staging environment',
  'Accessibility checked to WCAG 2.1 AA',
  'API docs and README updated',
  'Accepted by the Product Owner',
];

const INVEST: [string, string][] = [
  ['Independent', 'It can be built without waiting on another story, so the order can change.'],
  ['Negotiable', 'It is a placeholder for a conversation, not a contract clause.'],
  ['Valuable', 'Somebody outside the team would notice it arriving.'],
  ['Estimable', 'The team can size it. If they cannot, they do not understand it yet.'],
  ['Small', 'It fits comfortably inside one Sprint. Thirteen points usually means split it.'],
  ['Testable', 'There is an observable way to tell whether it is done.'],
];

const CHECK: QuizQuestion[] = [
  {
    q: 'A requirement changes while the system is already in production. Under a Waterfall lifecycle, why is that change so much more expensive than the same change during requirements?',
    answer: 2,
    options: [
      { text: 'Because developers charge more for urgent work', why: 'Rates rarely change. The cost is in the volume of work, not the price of an hour.' },
      { text: 'Because the team has forgotten how the system works', why: 'Familiarity is a real factor and a minor one. Something much larger is driving the multiplier.' },
      { text: 'Because everything built on top of the original assumption has to be unpicked, re-tested and migrated', why: 'Yes. By production the assumption is load-bearing: code, tests, documentation and live data are all shaped around it. The change itself is small; the rework, the regression pass and the data migration are not.' },
      { text: 'Because the specification has to be re-signed', why: 'Re-signing is paperwork, and it happens at the design phase too — where the same change costs a fraction as much. Paperwork is not what makes the curve steep.' },
    ],
  },
  {
    q: 'What makes the Spiral model different from simply running Waterfall four times?',
    answer: 1,
    options: [
      { text: 'Each loop delivers a shippable release to customers', why: 'That is Agile. A spiral loop typically produces a prototype and an answer to a risk question, not something customers receive.' },
      { text: 'A risk analysis at the start of each loop decides what gets built in that loop', why: 'Correct. Risk drives the plan rather than sitting beside it: the biggest remaining unknown is what the next loop is spent on, and the loop ends with a decision about whether to fund another.' },
      { text: 'It has no documentation requirements', why: 'Spiral is a heavyweight model with substantial documentation and analysis. Its overhead is its main criticism.' },
      { text: 'The customer sets the priorities each loop', why: 'The risk analysis sets the priorities. Customer priority is the Agile answer to the same question.' },
    ],
  },
  {
    q: 'A team says: “We use PRINCE2, so we do not need to decide between Waterfall and Agile.” What is wrong with that?',
    answer: 0,
    options: [
      { text: 'PRINCE2 governs the project but never says how the work is built, so a delivery method is still needed', why: 'Right. PRINCE2 is a management method. Managing Product Delivery is precisely the seam where Scrum, a build phase or a subcontractor sits — and leaving it undecided is the commonest way the framework is misused.' },
      { text: 'Nothing — PRINCE2 replaces both', why: 'This is the misconception the question is about. PRINCE2 covers direction, stages, tolerances and governance, and is explicitly silent on how a product is constructed.' },
      { text: 'PRINCE2 only works with Waterfall', why: 'PRINCE2 and Agile are combined routinely, and there is an official variant for it. The framework does not require a sequential build.' },
      { text: 'PRINCE2 is only for government projects', why: 'It began in UK government and is used well beyond it. Its fit is about governance weight, not sector.' },
    ],
  },
  {
    q: 'During Sprint Planning, a manager tells the team that fourteen items must go into the Sprint. What has been broken?',
    answer: 3,
    options: [
      { text: 'Nothing — the manager is accountable for delivery', why: 'No Scrum accountability gives anybody outside the team the right to set the amount of work. There is no “manager” role in Scrum at all.' },
      { text: 'The Product Owner should have set the number instead', why: 'The Product Owner proposes the value and orders the backlog. The amount taken on is not theirs either.' },
      { text: 'The Scrum Master should have set the number instead', why: 'The Scrum Master facilitates and coaches. Setting the number would be the same mistake with a different person making it.' },
      { text: 'Only the Developers may decide how much work is taken into a Sprint', why: 'Yes. It is the Developers’ forecast, which is what makes it worth anything. Imposed from outside it becomes a target, and a target that was never a forecast tells you nothing when it is missed.' },
    ],
  },
  {
    q: 'A team moves from four-week Sprints to one-week Sprints and keeps all five events at the Scrum Guide’s maxima. What happens to the share of the team’s capacity spent in those events — and what is the real cost of the change?',
    answer: 0,
    options: [
      { text: 'The share barely moves; what changes is that a wrong direction can now run for one week instead of four', why: 'Correct, and it surprises most people. Planning, Review and Retrospective all scale with the Sprint, and the Daily Scrum is per day — so the proportion stays at roughly a sixth of capacity at any Sprint length. Sprint length is a decision about feedback frequency, not about meeting overhead.' },
      { text: 'The share roughly quadruples, because the same five events now happen four times as often', why: 'They happen four times as often into four times as many Sprints, over the same number of working days, and each one is a quarter of the length. Run the arithmetic on the widget above — the proportion is unchanged.' },
      { text: 'The share falls, because short Sprints need less planning', why: 'Less planning per Sprint, and four times as many Sprints. It comes out in the same place.' },
      { text: 'The share is unknowable, because timeboxes are maxima that teams rarely use in full', why: 'Whatever fraction of each box a team actually uses, the fraction applies at every Sprint length, so the ratio is unchanged. The maxima being maxima does not make the comparison impossible.' },
    ],
  },
  {
    q: 'At the end of a Sprint a story is fully built and demonstrable, but its automated tests were never written — and the Definition of Done requires them. The Product Owner is happy to accept it. What is the correct position?',
    answer: 2,
    options: [
      { text: 'Accept it — the Product Owner accepts work, so their decision settles it', why: 'The Product Owner accepts value. The Definition of Done is a quality standard the Developers own, and it is not the Product Owner’s to waive.' },
      { text: 'Accept it and write the tests in the next Sprint as a follow-up story', why: 'This is how technical debt becomes invisible: the increment counts as delivered, the follow-up competes with new features, and the standard quietly drops for everyone.' },
      { text: 'It is not Done, it does not count toward the Sprint, and it returns to the Product Backlog', why: 'Yes. An Increment that does not meet the Definition of Done is not released and is not counted. Carrying it back is not a punishment — it keeps the one number the team reports honest.' },
      { text: 'Change the Definition of Done so the story qualifies', why: 'The Definition of Done can be changed — in the Retrospective, deliberately, for future work. Changing it to absorb a story that has already missed it is not a standard at all.' },
    ],
  },
];

const RECAP: [string, string][] = [
  ['A methodology is a bet about when you find things out.', 'Waterfall bets you can be right first time. Spiral buys the answer to the worst unknown first. Agile refuses to let any decision get more than a fortnight old.'],
  ['The cost-of-change curve is the argument underneath all of it.', 'The same change is roughly sixty times dearer in production than in requirements. Every framework on this page is a different response to that one fact.'],
  ['PRINCE2 governs; it does not build.', 'Seven principles, seven themes, seven processes — and a Managing Product Delivery seam where Waterfall or Scrum still has to go.'],
  ['Agile is a family, not a framework.', 'Scrum, XP, Kanban, Crystal, Lean, FDD and DSDM all sit under the Manifesto, and the Manifesto values the right-hand items too — just less.'],
  ['Scrum is three accountabilities, three artefacts and five events, and the ownership is the hard part.', 'Only the Developers decide how much. Only the Product Owner orders the backlog and cancels a Sprint. Only a Done Increment counts.'],
];

/** The three clauses of a user story, with what each one is for. */
function StoryAnatomy() {
  const [which, setWhich] = useState(0);
  const stories: { who: string; what: string; why: string; verdict: string; tone: 'good' | 'bad' }[] = [
    {
      who: 'a student',
      what: 'see my attendance percentage for each paper',
      why: 'I know whether I am at risk of failing on attendance',
      verdict: 'A person, an action and a reason. The reason is what lets a developer suggest a cheaper way to get the same outcome, and it is the clause most often missing.',
      tone: 'good',
    },
    {
      who: 'a lecturer',
      what: 'export one session’s attendance to CSV',
      why: 'I can hand it to administration without retyping it',
      verdict: 'Small, independent and testable. Notice it says nothing about which button, which column order or which library — those are the Developers’ to decide.',
      tone: 'good',
    },
    {
      who: 'the system',
      what: 'have a normalised attendance table with indexes',
      why: 'queries are faster',
      verdict: 'Not a user story. “The system” is not a user, and nobody outside the team would notice it arriving. It is a task inside a story, and written this way it competes for priority against work that has actual value.',
      tone: 'bad',
    },
  ];
  const s = stories[which];
  return (
    <div className="cc">
      <div className="cc__bar">
        <div className="cc__group">
          <span className="cc__label">Three examples</span>
          <div className="cc__pills">
            {['Student story', 'Lecturer story', 'Not a story'].map((label, i) => (
              <button key={label} type="button" className="cc__pill" aria-pressed={which === i} onClick={() => setWhich(i)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="cc__stage" style={{ marginTop: 16 }}>
        <div className="cc__plot">
          <div className="cc__diagram">
            <svg viewBox="0 0 560 168" width="100%" role="img"
              aria-label={`User story template. As a ${s.who}, I want to ${s.what}, so that ${s.why}.`}>
              {([
                ['As a', s.who, 18, 'who is asking'],
                ['I want to', s.what, 66, 'what they want to do'],
                ['So that', s.why, 114, 'why it is worth anything'],
              ] as const).map(([lead, body, y, note]) => (
                <g key={lead}>
                  <rect x="12" y={y} width="72" height="34" rx="9" fill="var(--ink-900)" />
                  <text x="48" y={y + 22} textAnchor="middle" fontSize="11" fontWeight="800" fontFamily="var(--font-display)" fill="#fff">{lead}</text>
                  <rect x="90" y={y} width="330" height="34" rx="9" fill="var(--accent-50)" stroke="var(--accent-200)" />
                  <text x="104" y={y + 22} fontSize="11.5" fontFamily="var(--font-body)" fill="var(--accent-700)">{body}</text>
                  <text x="432" y={y + 22} fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">{note}</text>
                </g>
              ))}
              <text x="12" y="162" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--ink-400)">a placeholder for a conversation — not a specification</text>
            </svg>
          </div>
          <p className="cc__caption">The standard template, filled from the attendance product this site runs on</p>
        </div>
      </div>

      <div className={`cc__verdict cc__verdict--${s.tone}`} style={{ marginTop: 14 }} aria-live="polite">
        <p className="cc__stamp">{s.tone === 'good' ? 'A usable story' : 'Not a user story'}</p>
        <p>{s.verdict}</p>
      </div>
    </div>
  );
}

export default function ProjectMethodologiesLesson() {
  return (
    <div>
      <Reveal>
        <LessonHeader
          lesson={2}
          of={9}
          title="Waterfall, Spiral, PRINCE2 and Agile — and Scrum up close"
          lead="Lesson 1 finished on a question: which methodology do this project's attributes call for? This lesson is what sits behind the answer. Four ways of shaping the work, drawn rather than described, and then the one you are most likely to walk into — Scrum — at the depth an interview will ask about."
          meta={LESSON_META}
          objectives={OBJECTIVES}
        />
      </Reveal>

      {/* ══ 2.1 Four shapes ══════════════════════════════════════════════ */}
      <section id="shapes" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2.1 · The four shapes"
            title="Start with the picture"
            aside="Before any of the vocabulary: what each method looks like when you draw it, and the four trades every one of them is making."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              A methodology is not a rulebook a team obeys. It is a shape imposed on the work — where the decisions
              sit, how often the outside world gets to look, and what happens when somebody changes their mind. Four
              shapes, one drawing each. The meters underneath are the same four every time, so switching between them
              is a comparison rather than four unrelated pictures.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <LifecycleGallery />
          </div>
        </Reveal>
      </section>

      {/* ══ 2.2 Waterfall ════════════════════════════════════════════════ */}
      <section id="waterfall" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2.2 · Waterfall"
            title="Be right the first time"
            stop="."
            aside="Sequential phases with a sign-off between each. Its defining property is not the order — it is that going back re-opens something already signed."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Royce described this sequence in 1970, in a paper that also said running it in a single pass was risky.
              The diagram outlived the warning. Its logic is sound where it applies: if the requirements genuinely
              cannot move — a regulated migration, a certification, a contract with a fixed deliverable — then
              deciding everything up front and proving it against a specification is the cheapest honest way to work.
            </p>
            <p>
              Everything hangs on that “if”. Drag the same change along the sequence and watch what it costs.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <CostOfChangeCurve />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-pairgrid" style={{ marginTop: 30 }}>
            <div className="bt-card">
              <h4>When it is the right answer</h4>
              <p>
                Fixed, signed requirements. An auditor who needs each requirement traced to the test that proves it.
                A supplier contract with a defined deliverable. Hardware, construction, or anything where the cost of
                a late change is physical rather than editable.
              </p>
            </div>
            <div className="bt-card">
              <h4>When it is not</h4>
              <p>
                Anything where the customer will only know what they want once they see it working. A new product. A
                platform whose users have not been asked yet. In those cases the specification is fiction with a
                signature on it, and every later phase inherits the error.
              </p>
            </div>
          </div>
          <p className="bt-note" style={{ marginTop: 18 }}>
            The V-model is Waterfall with the testing folded up: each phase on the way down is paired with the level
            of testing that will verify it on the way back up. Same sequence, same sign-offs, with the verification
            planned at the point the requirement is written rather than months later.
          </p>
        </Reveal>
      </section>

      {/* ══ 2.3 Spiral ═══════════════════════════════════════════════════ */}
      <section id="spiral" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2.3 · Spiral"
            title="Buy the scariest answer first"
            aside="Boehm, 1986. The same four activities in widening loops, with a risk analysis choosing what each loop is spent on — and a funding decision at the end of every one."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              The spiral is usually mistaken for “Waterfall, but round”. What makes it different is the second
              quadrant: before anything is built in a loop, the largest remaining risk is identified and attacked,
              usually with a prototype whose only job is to make an unknown measurable. Then the loop ends with the
              sponsor deciding whether to fund another.
            </p>
            <p>
              Walk one project through three loops. Two numbers move as you go, and the second one is the model’s own
              standing criticism.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <SpiralModel />
          </div>
        </Reveal>
      </section>

      {/* ══ 2.4 PRINCE2 ══════════════════════════════════════════════════ */}
      <section id="prince2" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2.4 · PRINCE2"
            title="Who is allowed to decide what"
            aside="PRojects IN Controlled Environments. Seven principles, seven themes, seven processes — and a deliberate silence about how the work is actually built."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              PRINCE2 answers a different question from the other three. Waterfall, Spiral and Agile are about how
              work is sequenced. PRINCE2 is about who is entitled to make which decision, with what evidence, and at
              which moment — which is why it appears <em>with</em> one of the others rather than instead of one.
            </p>
            <p>
              Taught as three lists it sounds like bureaucracy. Each item here opens into what it stops going wrong,
              which is the only way any of it is memorable.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <Prince2Explorer />
          </div>
        </Reveal>
      </section>

      {/* ══ 2.5 The Agile family ═════════════════════════════════════════ */}
      <section id="agile" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2.5 · Agile"
            title="A family, not a framework"
            aside="Four values, twelve principles, no instructions. Everything people mean by “doing Agile” is one of the frameworks that grew underneath it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Seventeen practitioners wrote the Agile Manifesto in Snowbird, Utah, in 2001. It contains no process,
              no roles and no ceremonies — four value statements of the form “A over B”, and twelve principles behind
              them. Each value keeps the right-hand item on the scale. That is the half most often dropped, and most
              arguments that begin “we’re Agile, so we don’t…” are it going missing.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <ManifestoValues />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 40 }}>
            <p>
              Because the Manifesto says nothing about how to work, frameworks filled the gap — several of them
              predating the document they now sit under. Tap any branch. These are short on purpose: one of them gets
              the rest of this lesson.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <AgileFamily />
          </div>
        </Reveal>
      </section>

      {/* ══ 2.6 Scrum ════════════════════════════════════════════════════ */}
      <section id="scrum" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2.6 · Scrum · the long section"
            title="The framework you will actually be handed"
            stop="."
            aside="Three accountabilities, three artefacts, five events. Easy to recite, and almost every team that struggles with it is getting the ownership wrong rather than the vocabulary."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Scrum is a lightweight framework for delivering complex products, built on three pillars:{' '}
              <b>transparency</b> — everything that matters is visible to everybody accountable for the outcome;{' '}
              <b>inspection</b> — progress toward the goal is checked frequently; and <b>adaptation</b> — when
              inspection shows a deviation, something changes immediately. Every event below exists to make one of
              those three happen on a schedule rather than when somebody remembers.
            </p>
            <p>
              Start with the whole thing as one object. Tap any part of it.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <ScrumCycle />
          </div>
        </Reveal>

        {/* ── Roles ── */}
        <Reveal delay={0.05}>
          <div style={{ marginTop: 52 }}>
            <p className="bt-eyebrow">2.6.1 · Accountabilities</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>
              Three roles, and no manager
            </h3>
            <div className="bt-prose" style={{ marginTop: 14 }}>
              <p>
                Scrum calls them accountabilities rather than job titles, which matters: one person can hold two of
                them on a small team, and none of them is a line-management position. There is no project manager
                inside a Scrum Team, and the work of one is distributed across all three.
              </p>
            </div>
            <div className="bt-pairgrid bt-pairgrid--three">
              {ROLE_CARDS.map(([name, sub, body]) => (
                <div key={name} className="bt-card">
                  <h4>{name}</h4>
                  <p className="bt-eyebrow bt-eyebrow--quiet" style={{ marginBottom: 8 }}>{sub}</p>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Activity · twelve situations, three buttons</p>
            <div style={{ marginTop: 16 }}>
              <ScrumRoleSort />
            </div>
            <p className="bt-note" style={{ marginTop: 18 }}>
              Almost every Scrum dysfunction in the wild is one of these decisions being made by the wrong person.
              Reciting the roles is easy; placing a live decision under one of them is the skill.
            </p>
          </div>
        </Reveal>

        {/* ── Artefacts ── */}
        <Reveal delay={0.05}>
          <div style={{ marginTop: 52 }}>
            <p className="bt-eyebrow">2.6.2 · Artefacts</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>
              Three artefacts, each with a commitment
            </h3>
            <div className="bt-prose" style={{ marginTop: 14 }}>
              <p>
                The 2020 Scrum Guide pairs every artefact with a commitment — the thing that makes it measurable
                rather than a list. An artefact without its commitment is where transparency quietly goes: a backlog
                with no Product Goal is a wish list, and an increment with no Definition of Done is an opinion.
              </p>
            </div>
            <div className="bt-scroll">
              <table className="bt-plaintable">
                <thead>
                  <tr><th>Artefact</th><th>Its commitment</th><th>What it is</th></tr>
                </thead>
                <tbody>
                  {ARTEFACTS.map(([a, c, b]) => (
                    <tr key={a}><td>{a}</td><td>{c}</td><td>{b}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bt-twocol" style={{ marginTop: 30 }}>
              <div>
                <p className="bt-eyebrow bt-eyebrow--quiet">A real Definition of Done</p>
                <div className="bt-card" style={{ marginTop: 14 }}>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 11 }}>
                    {DOD.map(d => (
                      <li key={d} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.45, color: 'var(--ink-600)' }}>
                        <span aria-hidden="true" style={{ flex: '0 0 16px', width: 16, height: 16, marginTop: 2, borderRadius: 4, border: '1.5px solid var(--accent-400)', display: 'grid', placeItems: 'center', color: 'var(--accent-600)', fontSize: 11, fontWeight: 800 }}>✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="bt-note" style={{ marginTop: 14 }}>
                  Six lines, agreed once, applied to everything. Its whole value is that it is decided before anybody
                  is under pressure to bend it.
                </p>
              </div>
              <div>
                <p className="bt-eyebrow bt-eyebrow--quiet">Why it is the load-bearing one</p>
                <div className="bt-rows">
                  <div>
                    <h4>It makes “done” a fact rather than a negotiation</h4>
                    <p>Without it, whether a story is finished depends on who is asking and how close the deadline is.</p>
                  </div>
                  <div>
                    <h4>It is the only defence against invisible debt</h4>
                    <p>Every skipped test and undone migration is a loan taken out by a team against its own future Sprints, and the Definition of Done is what stops one being taken quietly.</p>
                  </div>
                  <div>
                    <h4>It is owned by the Developers</h4>
                    <p>Not the Product Owner and not a manager. It changes in the Retrospective, deliberately, for future work — never to absorb a story that has already missed it.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Events ── */}
        <Reveal delay={0.05}>
          <div style={{ marginTop: 52 }}>
            <p className="bt-eyebrow">2.6.3 · Events</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>
              Five events, and the timebox nobody scales
            </h3>
            <div className="bt-prose" style={{ marginTop: 14 }}>
              <p>
                The numbers everybody memorises — eight hours, fifteen minutes, four hours, three hours — are maxima
                for a one-month Sprint, and every one of them moves when the Sprint does. Move the slider and watch
                them. Then look at the share of capacity the five events consume, which does something most people
                do not predict.
              </p>
            </div>
            <div style={{ marginTop: 26 }}>
              <SprintTimeline />
            </div>
          </div>
        </Reveal>

        {/* ── Stories ── */}
        <Reveal delay={0.05}>
          <div style={{ marginTop: 52 }}>
            <p className="bt-eyebrow">2.6.4 · User stories</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>
              What goes in the backlog
            </h3>
            <div className="bt-prose" style={{ marginTop: 14 }}>
              <p>
                Scrum does not require user stories — the Guide says “Product Backlog item” and stops there. They are
                borrowed from XP, and they have survived because the third clause forces somebody to say why the work
                is worth anything before it is scheduled.
              </p>
            </div>
            <div style={{ marginTop: 26 }}>
              <StoryAnatomy />
            </div>

            <div className="bt-twocol" style={{ marginTop: 34 }}>
              <div>
                <p className="bt-eyebrow bt-eyebrow--quiet">INVEST · six tests for a story</p>
                <div className="bt-rows">
                  {INVEST.map(([n, b]) => (
                    <div key={n}>
                      <h4>{n}</h4>
                      <p>{b}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="bt-eyebrow bt-eyebrow--quiet">Acceptance criteria for the first story</p>
                <div className="bt-card" style={{ marginTop: 14 }}>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10, fontSize: 13.5, lineHeight: 1.45, color: 'var(--ink-600)' }}>
                    <li>Attendance percentage is shown for every enrolled paper</li>
                    <li>Absence dates are listed in chronological order</li>
                    <li>A warning appears when attendance falls below 80%</li>
                    <li>The page loads in under two seconds on the campus network</li>
                    <li>It works on a phone and on a desktop</li>
                  </ul>
                </div>
                <p className="bt-note" style={{ marginTop: 14 }}>
                  Written by the Product Owner, verified by the team, and agreed before the story enters a Sprint.
                  Acceptance criteria are per story; the Definition of Done applies to every story. Teams that
                  confuse the two end up with either a bloated Definition of Done or stories nobody can accept.
                </p>
                <p className="bt-note" style={{ marginTop: 12 }}>
                  Story points are relative size, not hours — the Fibonacci-ish 1, 2, 3, 5, 8, 13 scale exists to
                  stop false precision. Total points completed per Sprint is the team’s <b>velocity</b>, useful for
                  forecasting that team’s next few Sprints and useless for comparing one team with another.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Board ── */}
        <Reveal delay={0.05}>
          <div style={{ marginTop: 52 }}>
            <p className="bt-eyebrow">2.6.5 · The board</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>
              Move the work and watch the numbers
            </h3>
            <div className="bt-prose" style={{ marginTop: 14 }}>
              <p>
                The board and the burndown are not in the Scrum Guide. Every team uses them anyway, because
                transparency needs somewhere to happen. Eight real stories from this platform’s own attendance
                product: tap a card to move it right, and set which day of the Sprint it is.
              </p>
            </div>
            <div style={{ marginTop: 26 }}>
              <ScrumBoard />
            </div>
            <p className="bt-note" style={{ marginTop: 18 }}>
              Jira, Trello, Linear, GitHub Projects, Azure DevOps — or a wall and some sticky notes, which is where
              all of them came from. The tool is not the method, and a team whose board is accurate on a wall is in
              better shape than one whose Jira is tidy and lies.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 2.7 Side by side ═════════════════════════════════════════════ */}
      <section id="compare" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2.7 · Side by side"
            title="All four, one table"
            aside="Worth a screenshot before the 60% case study. Every row here is a question you can ask about a real project."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th /><th>Waterfall</th><th>Spiral</th><th>PRINCE2</th><th>Agile / Scrum</th></tr>
              </thead>
              <tbody>
                {COMPARE.map(([label, w, s, p, a]) => (
                  <tr key={label}><td>{label}</td><td>{w}</td><td>{s}</td><td>{p}</td><td>{a}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bt-note" style={{ marginTop: 16 }}>
            The last row is the one the case study is marked on. Naming the method is worth almost nothing; naming
            the conditions under which your chosen method fails, and saying why this project does not meet them, is
            the argument.
          </p>
          <a className="bt-btn bt-btn--sm" href={`${BASE}#/intro-to-project-management`} style={{ marginTop: 22, textDecoration: 'none' }}>
            Back to Lesson 1 · the methodology chooser
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </a>
        </Reveal>
      </section>

      {/* ══ Knowledge check ══════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="End of the lesson"
            title="Check yourself"
            aside="Six questions on what this lesson claimed. Nothing is stored and nothing is reported — this is for you, now, while there is still time to reread."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz
            questions={CHECK}
            closing="Any you got wrong point at a specific widget above. Worth going back and moving it yourself before the next lesson."
          />
        </Reveal>
      </section>

      <Reveal>
        <Recap
          title="Five things to carry forward"
          points={RECAP}
          footnote="Everything below this line is where the course goes next. The lesson itself ends here."
        />
      </Reveal>

      {/* ══ What's next ══════════════════════════════════════════════════ */}
      <section id="ahead" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Next"
            title="Where this goes"
            aside="Scope and money come next, and both of them behave differently depending on which of these methods you chose."
          />
        </Reveal>

        <div className="bt-preview">
          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">03</span>
              <div>
                <h3>Scope, and the sentence that costs the most money</h3>
                <p className="bt-prose">
                  The work breakdown structure, the scope baseline, and why “while you’re in there, could you
                  also…” is free to say and expensive to absorb. Under Scrum the same request has a place to go —
                  the Product Backlog — which is most of why the framework survives contact with real stakeholders.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">04</span>
              <div>
                <h3>Estimating and cost management</h3>
                <p className="bt-prose">
                  Three-point estimates, PERT, reserves and the S-curve, worked through the SecurePay NZ scenario
                  that runs through this course. Story points and velocity are the same problem answered by a team
                  rather than by a spreadsheet, and the lesson covers where each one is appropriate.
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
              <span className="bt-step__n">—</span>
              <div>
                <h3>Certify what you have just read</h3>
                <p className="bt-prose">
                  Atlassian’s own Jira path, a LinkedIn Agile Professional Certificate and a free completion
                  certificate. None of them costs anything, and all three name Scrum vocabulary that job listings ask
                  for by name.
                </p>
                <a className="bt-btn bt-btn--sm" href={`${BASE}#/jira-certifications`} style={{ marginTop: 18, textDecoration: 'none' }}>
                  See the free Jira and Agile certifications
                  <span className="bt-btn__badge" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>Bring me a bad Sprint<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              The most useful thing you can bring to the next class is a team you have watched run one of these badly
              — a standup that became a status report, a Definition of Done that moved, a stage gate nobody could
              fail. Naming which part of the framework was missing is exactly the skill the 60% case study is
              marked on.
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
