import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import AuditWalkthrough from './audit/AuditWalkthrough';
import EvidenceSort from './audit/EvidenceSort';
import ResponsePicker from './audit/ResponsePicker';
import CorrectiveActionBuilder from './audit/CorrectiveActionBuilder';

// ─── MBI804 · Activity: the outside auditor ───────────────────────────────
// A public, ungated page in Blend (src/components/blend/README.md), on
// MBI804's plum through the `project` accent.
//
// This is the training and the brief for the peer-audit round. In Lesson 1
// every student wrote a post-mortem of a project they lived through, using
// the six-field builder on /intro-to-project-management. This activity
// shuffles those write-ups so each student audits somebody else's — never
// their own — and hands the project's sponsor a Corrective Action Plan.
//
// The real scenarios are not on this page and must not be. They are
// classmates' own accounts of their own workplaces, keyed to their student
// index numbers, and they live behind the activity site the lecturer runs.
// A public page gets a fictional practice scenario instead, written in the
// same six fields, so a student arrives at the real one already knowing the
// moves.
//
// ACTIVITY_URL is the one thing that changes per cohort: set it once the
// activity site is deployed and the page grows a button; leave it null and
// the page tells the reader to use the link posted in Teams. Nothing else
// needs editing between runs.

const BASE = import.meta.env.BASE_URL;

/** The deployed activity site, once it exists. Null until then. */
const ACTIVITY_URL: string | null = null;

const OBJECTIVES = [
  'Take an auditor’s stance on a project you did not run and have no stake in',
  'Test a post-mortem’s claim about what moved against the evidence in its own text',
  'Keep or overturn a methodology verdict by arguing from the project’s attributes',
  'Tell a risk that is still open from a defect that was already closed',
  'Write a Corrective Action Plan a sponsor could act on, with owners and dates',
];

const META: [string, string][] = [
  ['Practice here', '30 minutes'],
  ['Then the real one', '500–800 words plus a one-page plan'],
  ['Needs', 'the link your lecturer posts in Teams'],
];

const LENSES: Record<'author' | 'auditor', { title: string; cards: [string, string][] }> = {
  author: {
    title: 'What the author is doing',
    cards: [
      ['Explaining', 'Writing up a project they lived through, to somebody who was not there. The account has to hang together, so the parts that do not fit get smoothed.'],
      ['Defending, a little', 'Nobody writes a post-mortem of their own project neutrally. Not dishonestly — but the version where the delay was somebody else’s fault is genuinely easier to remember.'],
      ['Reclassifying', 'The strongest move available, and it is usually unconscious: something that was promised becomes a “nice-to-have”, and the scope never officially moved.'],
      ['Fixing what they can measure', 'The proposed change almost always addresses the part of the project that had a number on it, because that is the part that felt like the failure.'],
    ],
  },
  auditor: {
    title: 'What you are doing',
    cards: [
      ['Testing, not summarising', 'You are not retelling their project. You are checking whether their conclusions survive contact with their own evidence — and saying so where they do not.'],
      ['No stake in them being right', 'You did not run it, you will not be blamed for it, and nothing about your mark depends on their verdict holding. That is the entire value you add.'],
      ['Watching for the reclassification', 'Every time a commitment turns into a preference in the text, something moved. Finding the sentence where that happens is often the whole audit.'],
      ['Asking what the fix leaves alone', 'Grant that their change would have worked. Then list what it does not touch. That list is usually where the project actually went wrong.'],
    ],
  },
};

const BRIEF = [
  ['1', 'Constraint check', 'Does the evidence support the author’s claim about what moved — scope, time, cost or quality? Would you name a different one? Justify it from specific details in the scenario, not from general theory.'],
  ['2', 'Methodology verdict', 'The author names what the project was run as and what it should have been. Keep or overturn that verdict, arguing from the project’s own attributes: how volatile the requirements were, what depended on what, where the knowledge sat.'],
  ['3', 'The missed risk', 'Is “the risk nobody named” really the biggest one a reasonable person could have caught at kick-off? Or is there a bigger one the author still has not seen?'],
  ['4', 'Stress-test the fix', 'Take the author’s “what I would change”. If only that had been done, would the project genuinely have turned out differently? Where does their own fix still fail?'],
];

const CAP_PARTS: [string, string][] = [
  ['Problem statement', 'One sentence. A condition that still exists, not a history of what happened.'],
  ['Root cause', 'One sentence. A decision somebody made, not the last event before it broke.'],
  ['Methodology adjustment', 'With a one-line reason. “None needed” is a legitimate answer if you can defend it.'],
  ['The top risk', 'One risk, with a named response: avoid, mitigate, transfer or accept.'],
  ['Two next actions', 'Each with an owner and a timeframe. No owner means it is not an action yet.'],
];

const STEPS: [string, string][] = [
  ['Open the activity site', 'Use the link your lecturer posts in Teams and enter your student index number. No account, no password.'],
  ['Read your assigned scenario', 'It is a classmate’s post-mortem, never your own. You will not be told whose it is, and you should not go looking.'],
  ['Download your task PDF', 'The same four questions you practised here, wrapped around your specific scenario, plus the submission checklist.'],
  ['Write the audit', 'Roughly 500–800 words, addressed to the four numbered questions in order. Engage with the author’s conclusions rather than restating their project.'],
  ['Add the Corrective Action Plan', 'One page, written as you would hand it to that project’s sponsor. The builder on this page exports it as a PDF.'],
  ['Upload one PDF', 'Report and plan in a single file, through the same site, using the same index number.'],
];

const CHECK: QuizQuestion[] = [
  {
    q: 'A post-mortem says every feature shipped, the budget held, and the project ran three weeks late with no external deadline. Buried in the same paragraph: two accessibility features were dropped at the end and described as “nice-to-haves we had talked about rather than promised”. What moved?',
    answer: 2,
    options: [
      { text: 'Time — the three weeks are the only measured overrun', why: 'Time moved, and it moved by agreement with nothing waiting on it. An overrun everybody accepted and nobody paid for is not where the cost of this project landed.' },
      { text: 'Nothing — scope and cost both held, and the delay was agreed', why: 'This is the author’s own reading, and it depends entirely on accepting their reclassification at face value. Auditing means not doing that.' },
      { text: 'Quality, undeclared — the reclassification is the evidence', why: 'Yes. Something promised became a preference, in the author’s own sentence, and the work disappeared without a decision being recorded anywhere. That is what quality moving looks like from the outside: not a choice somebody made, but a category somebody changed.' },
      { text: 'Scope — two features were removed from the delivery', why: 'Very close, and it is a defensible answer. The stronger one goes one step further and asks why the author needed to reclassify them: because calling it scope would have required somebody to approve the change.' },
    ],
  },
  {
    q: 'A team ran two-week sprints with a daily standup and a board. The first time a user saw working software was week ten of an eleven-week project. What is the correct methodology finding?',
    answer: 1,
    options: [
      { text: 'It was Agile — sprints and standups are what Agile is', why: 'Those are the ceremonies. The framework is defined by a usable increment in front of the people who will live with it, every iteration, which is precisely what did not happen.' },
      { text: 'The ceremonies were Agile and the delivery was a single hand-off at the end', why: 'Correct. Iterating internally is not the same as iterating with a user in the loop. A team can hold every meeting in the framework and still be running one long Waterfall with a board in front of it.' },
      { text: 'It was Waterfall, and Waterfall was the right call', why: 'Half right on the delivery, and wrong on the verdict: the write-up describes requirements that moved every time the client saw a screen, which is the case against a signed specification.' },
      { text: 'It cannot be judged without knowing the team’s velocity', why: 'Velocity would tell you how much the team completed per sprint. It would say nothing about whether anyone outside the team ever saw the result, which is the question.' },
    ],
  },
  {
    q: 'In an audit, what is the difference between a risk and a defect that was found and fixed during the project?',
    answer: 0,
    options: [
      { text: 'A risk has not happened yet and may not; a defect that was found and fixed is a closed issue', why: 'Right, and it matters for the Corrective Action Plan: putting a closed defect in as the top risk hands the sponsor a plan for a problem that no longer exists, and leaves the open ones unnamed.' },
      { text: 'There is no difference — both are things that went wrong', why: 'Only one of them is still available to be managed. A risk register full of things that already happened is an incident log with the wrong heading.' },
      { text: 'A risk is technical and a defect is managerial', why: 'Neither is true of either. Risks and defects both come in technical and non-technical forms.' },
      { text: 'A defect is worse, because it actually occurred', why: 'Sometimes, and it is not the distinction. The point of the risk register is that it deals with what has not happened yet, which is the only category you can still do something cheap about.' },
    ],
  },
  {
    q: 'You are writing the top risk for a Corrective Action Plan on a health clinic system: a patient who cannot use a touchscreen has no way to sign in. Likelihood on any given day is low. Which response should you name?',
    answer: 3,
    options: [
      { text: 'Accept — the likelihood is low and a reserve covers it', why: 'A reserve covers money. It does not cover somebody not being seen, and accepting a risk of that kind is a decision that has to go to the sponsor in writing, not a line in your plan.' },
      { text: 'Transfer — the clinic’s insurer carries it', why: 'Insurance moves financial consequences. A clinic cannot contract away its duty to the people who walk through the door, so there is nobody to transfer this to.' },
      { text: 'Mitigate — reduce the likelihood with better screen design', why: 'The instinct, and the default everybody writes. Mitigation always leaves a residual likelihood, and here the residue is a patient who did not get seen.' },
      { text: 'Avoid — design a staffed path that never depends on the kiosk', why: 'Yes. The response follows from the consequence, not the likelihood. When the consequence lands on a person’s access to care, you remove the possibility rather than trimming its odds — and you do it before the paper alternative is taken away.' },
    ],
  },
];

const RECAP: [string, string][] = [
  ['An auditor has no stake in the author being right.', 'That is the entire value of doing this on somebody else’s project instead of your own, and it is why the assignment never gives you back your own write-up.'],
  ['Watch for the sentence where a commitment becomes a preference.', 'That reclassification is how quality moves without anybody approving it, and finding it is often the whole audit.'],
  ['Check a methodology against the project, not against its ceremonies.', 'Sprints and standups are the visible half. A usable increment in front of a real user every iteration is the half that does the work.'],
  ['A closed defect is not a risk.', 'The register is for what has not happened yet. Filling it with what already did leaves the live exposures unnamed.'],
  ['An action with no owner and no date is a wish.', 'Six committing sentences beat six paragraphs of analysis, and that is what a sponsor can actually act on.'],
];

export default function PeerAuditLesson() {
  const [lens, setLens] = useState<'author' | 'auditor'>('author');
  const l = LENSES[lens];

  return (
    <div>
      {/* ══ Header ═══════════════════════════════════════════════════════ */}
      <Reveal>
        <section className="bt-lessonhead" aria-labelledby="activity-title">
          <div>
            <p className="bt-eyebrow">Activity · peer audit round</p>
            <h2 id="activity-title">The outside auditor</h2>
            <p className="bt-lessonhead__lead">
              In Lesson 1 you wrote up a project you lived through. This round shuffles those write-ups: everyone
              audits a classmate’s project, nobody gets their own back, and each of you hands that project’s sponsor a
              plan they could act on. This page is the training and the brief — practise the four questions on a
              scenario nobody has to defend, then go and do it for real.
            </p>
            <p className="bt-lessonmeta">
              {META.map(([label, value]) => (
                <span key={label}>{label} <b>{value}</b></span>
              ))}
            </p>
          </div>
          <div>
            <p className="bt-eyebrow bt-eyebrow--quiet">By the end of this activity you can</p>
            <ul className="bt-objectives">
              {OBJECTIVES.map(o => (
                <li key={o}>
                  <span className="bt-objectives__ring" aria-hidden="true" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      {/* ══ 1 The stance ═════════════════════════════════════════════════ */}
      <section id="stance" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1 · The stance"
            title="You did not run this project"
            stop="."
            aside="The whole reason peer review works is that the person reading has nothing invested in the conclusion. Switch the lens and watch what changes."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              A post-mortem written by the person who lived through a project is the most useful document you will get
              and the least neutral. It is not dishonesty — it is that the version of events where the delay was
              somebody else’s fault is genuinely easier to remember, and the features that quietly disappeared are
              genuinely easier to recategorise than to mourn.
            </p>
            <p>
              Your job is not to catch them out. It is to read the same evidence without needing any particular
              conclusion from it.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <div className="bt-demobar" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span className="bt-sim__label">Reading the same document as</span>
              <div className="bt-modeswitch" style={{ marginLeft: 0 }}>
                <button type="button" aria-pressed={lens === 'author'} onClick={() => setLens('author')}>The author</button>
                <button type="button" aria-pressed={lens === 'auditor'} onClick={() => setLens('auditor')}>The auditor</button>
              </div>
            </div>
            <p className="bt-eyebrow bt-eyebrow--quiet" style={{ marginTop: 22 }}>{l.title}</p>
            <div className="bt-pairgrid" aria-live="polite">
              {l.cards.map(([title, body]) => (
                <div key={title} className="bt-card">
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ 2 The brief ══════════════════════════════════════════════════ */}
      <section id="brief" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2 · The brief"
            title="Four questions, then a plan"
            aside="The same four you will get in your task PDF, and the six parts of the plan that follows them. Nothing here is a surprise on the day."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-track">
            {BRIEF.map(([n, title, body]) => (
              <li key={n} className="bt-trackrow">
                <span className="bt-trackrow__n bt-tnum">{n}</span>
                <div className="bt-trackrow__body">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 34 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Then: a one-page Corrective Action Plan, in six parts</p>
            <div className="bt-rows">
              {CAP_PARTS.map(([title, body]) => (
                <div key={title}>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <p className="bt-note" style={{ marginTop: 16 }}>
              The report is roughly 500–800 words and answers the four questions in order. The plan is one page and is
              written to the assigned project’s sponsor, not to your lecturer — which is the constraint that keeps it
              short and committing.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 3 Practice ═══════════════════════════════════════════════════ */}
      <section id="practice" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="3 · Practice"
            title="Audit one nobody has to defend"
            aside="A made-up post-mortem in exactly the six fields a real one uses. Its author is confident, plausible and wrong about all four questions — which is the point."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              The scenario below is <b>fictional</b>. It was written for this page so that you can get the four moves
              wrong somewhere it costs nothing, before you do it on a classmate’s real project. Read it once, then work
              through the four questions one at a time — the scenario stays on screen throughout.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <AuditWalkthrough />
          </div>
        </Reveal>
      </section>

      {/* ══ 4 Evidence ═══════════════════════════════════════════════════ */}
      <section id="evidence" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="4 · What earns marks"
            title="Restating, asserting, auditing"
            aside="Two of these three feel like work while you are writing them, and only one of them is the work. Eight sentences, three buckets."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              The brief says “do not simply restate the scenario, engage critically with the original author’s
              conclusions”. That sentence is doing a lot of work, so here it is as something you can sort. A claim, the
              evidence for it, and why it matters — all three in the same sentence, is what an audit reads like.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <EvidenceSort />
          </div>
        </Reveal>
      </section>

      {/* ══ 5 Response ═══════════════════════════════════════════════════ */}
      <section id="response" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="5 · The plan’s hardest line"
            title="Naming a response, not reaching for one"
            aside="Your plan asks for one risk with a named strategy. “Mitigate” is what almost everyone writes, and for one of these four it is the wrong answer."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 20 }}>
            <ResponsePicker />
          </div>
        </Reveal>
      </section>

      {/* ══ 6 The plan ═══════════════════════════════════════════════════ */}
      <section id="plan" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="6 · Your deliverable"
            title="Build the Corrective Action Plan"
            aside="Six fields, one at a time, assembling into the page you attach to your report. Everything stays in this browser."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Come back to this once you have your assigned scenario and write the plan for <em>that</em> project. It
              saves as you type, so you can leave it half-finished and return. When it is done, export the PDF and
              attach it behind your audit report as a single file.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div style={{ marginTop: 26 }}>
            <CorrectiveActionBuilder />
          </div>
        </Reveal>
      </section>

      {/* ══ 7 Doing it for real ══════════════════════════════════════════ */}
      <section id="submit" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="7 · The real round"
            title="How to run it"
            stop="."
            aside="Six steps, no account, and one PDF at the end. Your index number is the only thing you need."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-flow">
            {STEPS.map(([title, body], i) => (
              <li key={title}>
                <span className="bt-flow__n bt-tnum">{i + 1}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-caution" style={{ marginTop: 30 }}>
            <p className="bt-eyebrow">Where the site is</p>
            <p>
              {ACTIVITY_URL
                ? 'The activity site is linked below. It asks for your student index number and nothing else — no account, no password.'
                : 'The activity site link is posted in Teams by your lecturer, because the assignments are built for one specific cohort. It asks for your student index number and nothing else — no account, no password.'}
            </p>
          </div>
          {ACTIVITY_URL && (
            <a className="bt-btn bt-btn--sm" href={ACTIVITY_URL} target="_blank" rel="noreferrer" style={{ marginTop: 18, textDecoration: 'none' }}>
              Open the activity site
              <span className="bt-btn__badge" aria-hidden="true">↗</span>
            </a>
          )}
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-twocol" style={{ marginTop: 34 }}>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">Some ground rules</p>
              <div className="bt-rows">
                <div>
                  <h4>You will never be given your own project</h4>
                  <p>The assignment list is built so that nobody audits themselves. If you recognise the scenario as yours, say so and you will be reassigned.</p>
                </div>
                <div>
                  <h4>Do not go looking for the author</h4>
                  <p>The write-ups are anonymous to you on purpose. An audit that guesses at who wrote it stops being an audit of the project.</p>
                </div>
                <div>
                  <h4>Audit the project, not the person</h4>
                  <p>“This was badly managed” is a grade, not a finding. Every criticism should point at a decision and the evidence for it.</p>
                </div>
                <div>
                  <h4>These are real workplaces</h4>
                  <p>Somebody trusted the class with something that actually happened at their job. Keep it inside the class, and write about it the way you would want yours written about.</p>
                </div>
                <div>
                  <h4>Submit it as your own work</h4>
                  <p>The report is read as your own reasoning about a specific document. Submissions are checked, and an audit that could have been written without reading the scenario is visible from the first paragraph.</p>
                </div>
              </div>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">What you are marked on</p>
              <div className="bt-rows">
                <div>
                  <h4>Whether the finding survives the evidence</h4>
                  <p>Not whether you agree or disagree with the author. A well-argued “keep the verdict” beats a badly argued overturn.</p>
                </div>
                <div>
                  <h4>Whether you argued from the project</h4>
                  <p>This is LO1 in miniature. A methodology recommendation that comes from preference rather than from the project’s attributes loses the same marks here as it does in the 60% case study.</p>
                </div>
                <div>
                  <h4>Whether the plan could be acted on</h4>
                  <p>Owners, timeframes, a named response strategy. A sponsor should be able to read it once and know what happens on Monday.</p>
                </div>
              </div>
              <a className="bt-btn bt-btn--sm" href={`${BASE}#/intro-to-project-management`} style={{ marginTop: 20, textDecoration: 'none' }}>
                Back to the Lesson 1 post-mortem builder
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ Check ════════════════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before you start the real one"
            title="Check yourself"
            aside="Four questions on the moves this activity is marked on. Nothing is stored and nothing is reported."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz
            questions={CHECK}
            closing="Any you got wrong point at a section above. Worth going back before you open your assigned scenario."
          />
        </Reveal>
      </section>

      <Reveal>
        <Recap
          title="Five things to carry into your audit"
          points={RECAP}
          footnote="The practice ends here. The real one is a classmate’s project, and it is waiting behind the link in Teams."
        />
      </Reveal>

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>Be the reader you wanted<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              Somebody in this class wrote down something that genuinely went wrong at their work and handed it over.
              The most useful thing you can give them back is not a compliment and not a verdict — it is the one
              sentence in their own write-up that they read past, and what it actually means. That is what an audit
              is, and it is the only part of this that is hard.
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
