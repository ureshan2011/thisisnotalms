import { lazy, Suspense } from 'react';
import { ExternalLink } from 'lucide-react';
import { LessonHeader, Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';

// ─── MBI804 · Lesson 3: Scrum, watched rather than read ───────────────────
// Lesson 2 (/project-methodologies) explains Scrum as a diagram and a list
// of definitions. This lesson is the same framework as a place: six
// miniatures, one drone, three one-week Sprints, and the reader can pause
// it, scrub it, orbit it and click anything in it. The prose here is
// deliberately short — the studio is the teaching, and the sections below
// it exist so the facts survive a browser that cannot run WebGL, and so a
// student the night before the exam has the list.
//
// The studio is lazy: three.js is a big chunk and a reader who bounces off
// the hero should not have paid for it. The page itself is already lazy in
// App.tsx; this second boundary is for the fallback text while it loads.

const ScrumStudio = lazy(() => import('./scrum/ScrumStudio'));

const BASE = import.meta.env.BASE_URL;

const LESSON_META: [string, string][] = [
  ['Time', '35 minutes'],
  ['Follows', 'Lesson 2, Scrum up close'],
  ['Needs', 'A browser with WebGL — any laptop or phone from the last few years'],
];

const OBJECTIVES = [
  'Name the three accountabilities on a Scrum Team and say what each one owns — and what it does not',
  'Walk the five events of a Sprint in order, with who attends and the timebox on each',
  'Explain the three artefacts and the commitment attached to each one',
  'Trace one backlog item from the Product Backlog to a Done Increment, and say who decides at every step',
  'Spot the common ways a team breaks Scrum: the standup that became a status report, the manager who set the Sprint scope, the item accepted without being Done',
];

const ROLES: [string, string, string, string][] = [
  [
    'Product Owner', 'Priya, in plum',
    'Accountable for maximising the value of the product. Owns and orders the Product Backlog, writes the Product Goal, keeps every item clear enough to build, and decides what is released. One person, not a committee.',
    'Does not decide how much the Developers take into a Sprint, and cannot waive the Definition of Done.',
  ],
  [
    'Scrum Master', 'Sam, with the headset',
    'Accountable for the team’s effectiveness and for Scrum being understood. Coaches the team to manage itself, keeps events inside their timeboxes, removes impediments, and helps the organisation adopt Scrum. A servant-leader.',
    'Does not assign work, does not run the Daily Scrum, does not report progress upward.',
  ],
  [
    'Developers', 'Aroha, Ben, Chen and Dee',
    'Accountable for a usable Increment every Sprint. Between them they hold every skill the product needs. They plan their own Sprint Backlog, adapt it daily, and own the Definition of Done. Anyone doing the work is a Developer, whatever their title.',
    'No sub-teams, no hierarchy inside the team, and nobody outside it decides how much they take on.',
  ],
];

const ARTEFACTS: [string, string, string, string][] = [
  ['Product Backlog', 'Product Goal', 'The Product Owner', 'The single ordered list of everything the product might need. Never finished, refined continuously, the only source of work. In the studio: the wall on the left.'],
  ['Sprint Backlog', 'Sprint Goal', 'The Developers', 'The Sprint Goal, the items pulled to meet it, and the plan for delivering them. Updated every day by the people doing the work. In the studio: the three-column board, with the goal on the plank above it.'],
  ['Increment', 'Definition of Done', 'The Developers', 'A usable step toward the Product Goal. It exists the moment an item is Done, not at the end of the Sprint, and only Done work is in it. In the studio: the drone on the pedestal.'],
];

const EVENTS: [string, string, string, string, string][] = [
  ['The Sprint', 'The whole Scrum Team', '1–4 weeks, same length every time', 'A Done Increment', 'The container for the other four. A new one starts the moment the last one ends.'],
  ['Sprint Planning', 'The whole Scrum Team', 'Max 8 hours a month', 'Sprint Goal + Sprint Backlog', 'Why is this Sprint valuable, what can be Done, how will it be done. Only the Developers decide how much.'],
  ['Daily Scrum', 'The Developers', '15 minutes, every working day', 'A plan for the next 24 hours', 'Inspect progress toward the Sprint Goal and re-plan the day. Not a status report; problems are named here and solved elsewhere.'],
  ['Sprint Review', 'Scrum Team + stakeholders', 'Max 4 hours a month', 'A revised Product Backlog', 'Show what is Done to the people who asked for it and decide together what comes next. Not a sign-off, not a demo performance.'],
  ['Sprint Retrospective', 'The Scrum Team only', 'Max 3 hours a month', 'One improvement, into the next Sprint', 'The only event about the team rather than the product. What went well, what got in the way, one thing to change.'],
];

const LOOP: [string, string][] = [
  ['The Product Owner orders the Product Backlog', 'One list, one owner. The top item is always unambiguous. In the studio, the pile on Priya’s desk becomes the wall of ordered cards.'],
  ['Sprint Planning pulls the top items into a Sprint Backlog', 'The Product Owner proposes why the Sprint is valuable; the Developers decide how much they can finish and how; the team writes the Sprint Goal. Cards fly from the wall to To Do.'],
  ['Every day, a fifteen-minute Daily Scrum', 'The Developers stand in a circle and re-plan the day. On day four Ben raises the red block on his desk and Sam, the Scrum Master, leaves the circle to clear it.'],
  ['The work moves To Do → Doing → Done', 'Each item that meets the Definition of Done bolts a part onto the drone at once. The Sprint Backlog is the Developers’ plan and they change it daily; nobody adds work that risks the Sprint Goal.'],
  ['The Sprint Review shows a real Increment to real stakeholders', 'The drone lifts off in front of the two people who asked for it. A new card, “Rain sensor”, arrives from what they saw, and the Product Owner orders it above Lights.'],
  ['The Retrospective picks one improvement', 'Team only. One change goes on a sticky, and it becomes a green card in the next Sprint Backlog so that it happens rather than is admired.'],
  ['The next Sprint starts immediately', 'No gap, no cool-down week, no phase called “done”. After three Sprints there are nine items on the drone and two still on the wall — the backlog is never finished.'],
];

const QUESTIONS: QuizQuestion[] = [
  {
    q: 'In the studio, Sam the Scrum Master stands outside the circle at every Daily Scrum. Why?',
    answer: 1,
    options: [
      { text: 'Because the Scrum Master is not allowed in the room during the Daily Scrum', why: 'The Scrum Master can be present, and often is. Whether they are needed depends on whether the Developers can run it themselves yet — and the point of coaching is that they can.' },
      { text: 'Because the Daily Scrum is the Developers’ event; the Scrum Master makes sure it happens and stays useful, but does not run it', why: 'Yes. The Developers inspect progress toward the Sprint Goal and re-plan their own day. Sam listens for impediments and keeps it to fifteen minutes; a Scrum Master who chairs it has turned it into a status report.' },
      { text: 'Because the Scrum Master should be running the same meeting with the Product Owner instead', why: 'There is no parallel manager’s standup. Priya is at the backlog wall because the Daily Scrum is not a report to her either.' },
      { text: 'Because the circle is only for people who have a card on the board', why: 'Dee has no card of her own and is still in the circle. Every Developer attends, whatever they are doing that day.' },
    ],
  },
  {
    q: 'Day three: a red “BLOCKED” cube lands on Ben’s desk because a supplier cannot ship a rotor part. What should happen next?',
    answer: 2,
    options: [
      { text: 'The Product Owner adds a replacement item to the Sprint so the Developers stay busy', why: 'Nobody adds work that puts the Sprint Goal at risk, including the Product Owner. Filling the gap is how Sprints quietly become open-ended to-do lists.' },
      { text: 'Ben quietly works on something else and mentions it at the Sprint Review', why: 'That is the exact failure the Daily Scrum exists to catch. A blocker hidden until the Review has cost the whole Sprint.' },
      { text: 'Ben raises it at the next Daily Scrum, and the Scrum Master takes it away and clears it', why: 'Yes. Impediments are named in the fifteen minutes and removed outside them. Removing them is the Scrum Master’s accountability — watch Sam leave the circle on day four.' },
      { text: 'The team cancels the Sprint', why: 'Only the Product Owner can cancel a Sprint, and only when its Goal has become obsolete. A shipping delay on one part does not make “it lifts off” obsolete.' },
    ],
  },
  {
    q: 'At the Sprint 1 Review, Ms Okafor asks what the drone does in rain, and a new “Rain sensor” card appears. Where does it go, and who decides?',
    answer: 0,
    options: [
      { text: 'Onto the Product Backlog, in the position the Product Owner chooses', why: 'Yes. The Review’s output is a revised Product Backlog. Priya orders the new card above Lights because a drone that dies in a shower is worth more than one that glows at dusk — her call, made on evidence of a working Increment.' },
      { text: 'Straight into the current Sprint, because a stakeholder asked for it', why: 'The Sprint has just ended, and stakeholders do not put work into Sprints in any case. They talk to the Product Owner, who orders the backlog.' },
      { text: 'Into the next Sprint Backlog automatically, at the top', why: 'The next Sprint’s scope is decided at the next Sprint Planning, by the Developers pulling from the top of an order the Product Owner set. Nothing goes in automatically.' },
      { text: 'To the Scrum Master, who decides whether it is worth building', why: 'The Scrum Master has no say in what is built. Value is the Product Owner’s accountability.' },
    ],
  },
  {
    q: 'The drone on the pedestal gains a part the moment a card reaches Done on day two — three days before the Sprint Review. Is that right?',
    answer: 1,
    options: [
      { text: 'No — an Increment only exists at the end of the Sprint, when the Review approves it', why: 'The 2020 Scrum Guide is explicit: an Increment is created the moment a backlog item meets the Definition of Done, and several may exist within one Sprint. The Review inspects Increments; it does not create them.' },
      { text: 'Yes — an Increment exists as soon as an item meets the Definition of Done, whether or not the Sprint has ended', why: 'Correct. Done is a quality standard, not a date. The Review is where stakeholders see the Increments; it is not the gate that makes them real.' },
      { text: 'Yes, but only because the Product Owner accepted it early', why: 'The Product Owner accepts value; the Definition of Done is the Developers’ standard. An item that meets it is Done regardless of who has looked at it.' },
      { text: 'No — parts should be added in a batch at the Review so stakeholders see them together', why: 'Batching for a demo is theatre. The Increment is whatever is Done, whenever it became Done.' },
    ],
  },
  {
    q: 'Sprint Planning in the studio takes about two hours, not the eight the Scrum Guide gives. Why?',
    answer: 3,
    options: [
      { text: 'Because the team is experienced and skips the “how” question', why: 'All three questions are asked every time. Experience makes them faster, not optional.' },
      { text: 'Because two-hour meetings are the maximum for any Scrum event', why: 'The Daily Scrum is fifteen minutes; Planning for a one-month Sprint may run to eight hours. There is no single ceiling.' },
      { text: 'Because the Scrum Master shortened it to save time', why: 'The Scrum Master keeps events inside their timeboxes; they do not set them by decree.' },
      { text: 'Because the Guide’s eight hours is the maximum for a one-month Sprint, and the studio runs one-week Sprints, so every timebox scales to about a fifth', why: 'Yes. Planning, Review and Retrospective all scale with Sprint length; only the Daily Scrum stays fixed at fifteen minutes because it is per day. Lesson 2’s timeline widget demonstrates the proportion.' },
    ],
  },
  {
    q: 'After three Sprints the speaker and the solar skin are still on the backlog wall. What does that tell you?',
    answer: 2,
    options: [
      { text: 'The project failed to deliver its scope', why: 'There was no fixed scope. The Product Goal is a working parcel drone, and one flew at every Review from Sprint 1 onward.' },
      { text: 'The Developers were too slow and should have taken more into each Sprint', why: 'Taking more than they can finish would have produced items that were started, not Done — and an item that is not Done is not in the Increment at all.' },
      { text: 'Nothing is wrong: a Product Backlog is never finished, and the most valuable items were built first', why: 'Yes. Scrum optimises the order of work, not the completeness of a plan. The drone that flies was built in the order things were worth building, and the two cards left are the two the Product Owner valued least.' },
      { text: 'The Product Owner should have written a smaller backlog', why: 'A backlog holds everything that might be needed. Its length is not a promise; its order is.' },
    ],
  },
];

const RECAP: [string, string][] = [
  ['Three accountabilities, and none of them is a manager.', 'The Product Owner owns value and order. The Scrum Master owns effectiveness and clears the way. The Developers own the Sprint Backlog, the Definition of Done and how much they take on.'],
  ['Three artefacts, each with a commitment.', 'Product Backlog → Product Goal. Sprint Backlog → Sprint Goal. Increment → Definition of Done. The commitment is what stops the artefact drifting.'],
  ['Five events, and the timebox nobody scales.', 'Planning, Review and Retrospective shrink with the Sprint. The Daily Scrum is fifteen minutes because it is per day, and the Sprint itself is the container for all of them.'],
  ['An Increment exists the moment an item is Done.', 'Not at the Review, not when the Product Owner nods. Done is a quality standard the Developers own, and only Done work is on the drone.'],
  ['Feedback is the point of the loop.', 'The Rain sensor card exists because a stakeholder watched a real Increment. A Review without stakeholders is a demo to yourselves and the framework has lost its reason to exist.'],
  ['The backlog is never finished.', 'After three Sprints the drone flies and two cards are still on the wall. Scrum optimises the order of work, not the completeness of a plan.'],
];

function StudioFallback() {
  return (
    <div className="sst">
      <div className="sst__stage"><div className="sst__loading">LOADING THE STUDIO…</div></div>
      <aside className="sst__panel">
        <p className="bt-eyebrow">Before the first Sprint</p>
        <h3>One Scrum Team, one drone</h3>
        <p>Six miniatures and three one-week Sprints are on their way. The three.js scene is a bigger download than the rest of the page, so it arrives a moment after the text.</p>
      </aside>
    </div>
  );
}

export default function ScrumSimulationLesson() {
  return (
    <div className="bt-wrap">
      <Reveal>
        <LessonHeader
          lesson={3}
          of={9}
          title="The Scrum studio: a Sprint you can watch, pause and orbit"
          lead="Lesson 2 gave you Scrum as a diagram and a list of definitions. This one gives you the same framework as a place. Six miniatures build a parcel drone through three one-week Sprints — every event, every artefact and every decision happening in front of you, with a narration that says who is doing what and why. Scrub it, jump about in it, click anyone, and by the end you will have watched the whole loop go round three times."
          meta={LESSON_META}
          objectives={OBJECTIVES}
        />
      </Reveal>

      {/* ══ 3.1 The studio ═══════════════════════════════════════════════ */}
      <section id="studio" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.1 · The simulation"
            title="Three Sprints, on a tabletop"
            stop="."
            aside="It plays itself. Pause it, drag to orbit, scroll to zoom, and click any miniature or object for what it owns and the trap people fall into with it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Suspense fallback={<StudioFallback />}>
            <ScrumStudio />
          </Suspense>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 26 }}>
            <p>
              A few things to notice as it runs. Nobody in the studio is anybody’s manager, and there is no project
              manager: the work of one is spread across the three accountabilities. The Product Owner is at the wall
              during the Daily Scrum, not in the circle, because the meeting is not a report to her. And the drone
              gains a part on day two, days before the Review — an Increment exists the moment an item is Done, not
              when a meeting says so.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 3.2 Roles ════════════════════════════════════════════════════ */}
      <section id="roles" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.2 · Who is in the room"
            title="Three accountabilities, no manager"
            stop="."
            aside="The 2020 Scrum Guide calls them accountabilities rather than roles on purpose: they describe what somebody answers for, not a job title or a line on an org chart."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-pairgrid bt-pairgrid--three">
            {ROLES.map(([name, who, body, not]) => (
              <div key={name} className="bt-card">
                <h4>{name}</h4>
                <p className="bt-eyebrow bt-eyebrow--quiet" style={{ marginBottom: 8 }}>{who}</p>
                <p>{body}</p>
                <p style={{ marginTop: 10, color: 'var(--ink-600)' }}><b>Not theirs:</b> {not}</p>
              </div>
            ))}
          </div>
          <div className="bt-prose" style={{ marginTop: 22 }}>
            <p>
              The two people in grey suits are <b>stakeholders</b>, and they are not on the Scrum Team. They attend the
              Sprint Review, see a real Increment, and say what should happen next — to the Product Owner, who orders
              the backlog. A stakeholder who walks up to a Developer’s desk and asks for “one small thing” is how a
              Sprint Goal dies quietly.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 3.3 Artefacts ════════════════════════════════════════════════ */}
      <section id="artefacts" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.3 · What is on the walls"
            title="Three artefacts, each with a commitment"
            stop="."
            aside="An artefact is a thing you can point at. Each one carries a commitment that says what it is for, and the commitment is what keeps it honest."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-scroll">
            <table className="bt-grid">
              <thead>
                <tr><th>Artefact</th><th>Commitment</th><th>Owned by</th><th>What it is</th></tr>
              </thead>
              <tbody>
                {ARTEFACTS.map(([name, commit, owner, body]) => (
                  <tr key={name}>
                    <td><b>{name}</b></td>
                    <td>{commit}</td>
                    <td>{owner}</td>
                    <td style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.5 }}>{body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ══ 3.4 Events ═══════════════════════════════════════════════════ */}
      <section id="events" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.4 · The meetings"
            title="Five events, one of them a container"
            stop="."
            aside="Timeboxes are the Guide’s maxima for a one-month Sprint. The studio runs one-week Sprints, so Planning, Review and Retrospective scale to about a fifth. The Daily Scrum does not scale — it is per day."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-scroll">
            <table className="bt-grid">
              <thead>
                <tr><th>Event</th><th>Who</th><th>Timebox</th><th>Output</th><th>In one line</th></tr>
              </thead>
              <tbody>
                {EVENTS.map(([name, who, box, out, line]) => (
                  <tr key={name}>
                    <td><b>{name}</b></td>
                    <td>{who}</td>
                    <td>{box}</td>
                    <td>{out}</td>
                    <td style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.5 }}>{line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ══ 3.5 The loop ═════════════════════════════════════════════════ */}
      <section id="loop" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.5 · The whole process"
            title="One item, from the wall to the drone"
            stop="."
            aside="This is the studio written down: the seven things that happen every Sprint, in order, and who decides at each one."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-flow">
            {LOOP.map(([title, body], i) => (
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
      </section>

      {/* ══ Check yourself ═══════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Check yourself"
            title="Six things the studio showed you"
            stop="."
            aside="Every question is about something that happened in the simulation. If one catches you out, jump back to that moment with the chips and watch it again."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz
            questions={QUESTIONS}
            closing="Six for six means you can narrate the studio yourself, which is most of what the 60% case study asks when it says “recommend Scrum and justify it”."
          />
        </Reveal>
      </section>

      <Reveal>
        <Recap
          title="What the studio said"
          points={RECAP}
          footnote="Facts follow the 2020 Scrum Guide by Ken Schwaber and Jeff Sutherland, which is free at scrumguides.org and eighteen pages long. Read it once; it is shorter than this page."
        />
      </Reveal>

      {/* ══ What's next ══════════════════════════════════════════════════ */}
      <section id="ahead" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="What’s next"
            title="Where this goes"
            stop="."
            aside="The studio is the picture. Lesson 2 has the definitions at exam depth, and the certifications name the vocabulary job listings ask for."
          />
        </Reveal>
        <div>
          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">02</span>
              <div>
                <h3>Scrum at interview depth</h3>
                <p className="bt-prose">
                  The clickable framework diagram, twelve “whose job is this?” situations, timeboxes that scale with the
                  Sprint, and a board with a live burndown — the same framework you just watched, at the depth the case
                  study is marked on.
                </p>
                <a className="bt-btn bt-btn--sm" href={`${BASE}#/project-methodologies`} style={{ marginTop: 18, textDecoration: 'none' }}>
                  Back to Lesson 2, straight to Scrum
                  <span className="bt-btn__badge" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">—</span>
              <div>
                <h3>Certify it</h3>
                <p className="bt-prose">
                  Atlassian’s own Jira path, a LinkedIn Agile Professional Certificate and a free completion certificate.
                  None costs anything, and all three use exactly the words on the studio’s walls.
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
            <h2>Find the moment it breaks<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              Run the studio once at 4× and just watch the shapes. Then run it again at 1× and ask, at every event,
              what would go wrong if the wrong person were in the room. That question — who is in it, who is not,
              and why — is the whole of Scrum, and it is the question the case study is really asking.
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
