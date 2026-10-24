import { Download } from 'lucide-react';
import { Recap, Reveal, SectionHead } from '../blend';

// ─── MBI804 · Write a scope management plan, as a team ────────────────────
// A public, ungated Blend page on MBI804's plum. The activity itself happens
// in the PDF (public/mbi804/scope-plan/…, built by scripts/scope-plan-pdf/
// build.py): page 1 is the brief, pages 2 to 5 are a cut-down scope management
// plan with fillable boxes. This page says the same things on screen so the
// lecturer can put it up in class, and carries the download link.
//
// The scenario, timings, split and checks below are copied from build.py. If
// you change one, change the other.

const BASE = import.meta.env.BASE_URL;
const SCOPE_PLAN_PDF = 'mbi804/scope-plan/MBI804-Scope-Management-Plan-Activity.pdf';

const OBJECTIVES = [
  'Say what a scope management plan is for',
  'Write a scope statement with deliverables, acceptance criteria and exclusions',
  'Break deliverables into work packages small enough to hand to one person',
  'Describe who decides when someone asks for a change',
  'Check a teammate’s section and say what is weak about it',
];

const PARTS: [string, string, string][] = [
  ['1', 'Project summary', 'What are we building, and for whom?'],
  ['2', 'How scope is managed', 'Who looks after it, and how is the work checked against it?'],
  ['3', 'Roles and responsibilities', 'Who does what about scope?'],
  ['4', 'Scope statement', 'What is in, what is out, and how will we know it is done?'],
  ['5', 'WBS and dictionary', 'What are the pieces of work, and who owns each one?'],
  ['6', 'Scope verification', 'How does each deliverable get checked and accepted?'],
  ['7', 'Scope control and changes', 'What happens when someone wants something different?'],
  ['8', 'Sign-off', 'Who agreed to all of this?'],
];

const SCENARIO = [
  'Harbour Physio is a clinic with five physiotherapists and one receptionist. Every appointment is made by phone and written in a paper diary, and double bookings happen most weeks. The owner wants an online booking system. Patients book, change and cancel their own appointments and get a text reminder the day before. The receptionist sees one calendar for everyone, and each physio sees their own day.',
  'The owner has 12 weeks and NZ$25,000, and wants it running before winter. Online payments and patient notes have both come up as “maybe later”. Your team is the project team. Deciding what those two mean for your plan is part of the job.',
];

const TIMINGS: [string, string, string][] = [
  ['0 to 4', 'Read the project', 'Agree a two-sentence summary for section 1. Pick a project manager, who also keeps time.'],
  ['4 to 5', 'Split the sections', 'Use the table below. Everyone owns something.'],
  ['5 to 17', 'Write your own section', 'Quietly. Rough is fine, and short lists beat paragraphs.'],
  ['17 to 25', 'Swap and check', 'Read a teammate’s section and run the four checks on it.'],
  ['25 to 28', 'Fix what you found', 'The project manager fills in the top of page 2 and the sign-off.'],
  ['28 to 30', 'One thing left out', 'Be ready to tell the class one thing you left out on purpose, and why.'],
];

const SPLIT: [string, string][] = [
  ['Person 1', 'Sections 2 and 3: how scope is managed, and who does what'],
  ['Person 2', 'Section 4, first half: description, deliverables, acceptance criteria'],
  ['Person 3', 'Section 4, second half: exclusions, constraints, assumptions'],
  ['Person 4', 'Section 5: the work breakdown structure and dictionary'],
  ['Person 5', 'Sections 6 and 7: checking the work, and handling changes'],
];

const CHECKS = [
  'Does every deliverable show up in the WBS, and does every WBS item lead to a deliverable?',
  'Could a stranger answer yes or no to each acceptance criterion? “Easy to use” can’t be answered. “A patient can book without phoning the clinic” can.',
  'Is each exclusion something a reasonable person might have expected to be included? “Anything not listed” doesn’t count. Look at what you did with online payments and patient notes.',
  'Does the change process name one person who decides, and say how long they have?',
];

function DownloadButton({ label = 'Download the PDF' }: { label?: string }) {
  return (
    <a className="bt-btn bt-btn--sm" href={BASE + SCOPE_PLAN_PDF} download style={{ textDecoration: 'none' }}>
      {label}
      <span className="bt-btn__badge" aria-hidden="true"><Download size={13} /></span>
    </a>
  );
}

export default function ScopePlanActivityLesson() {
  return (
    <div>
      {/* ══ What it is ═══════════════════════════════════════════════════ */}
      <section id="what" className="bt-sec">
        <Reveal>
          <section className="bt-lessonhead" aria-labelledby="lessonhead-title">
            <div>
              <p className="bt-eyebrow">Scope management</p>
              <h2 id="lessonhead-title">Write a scope management plan</h2>
              <p className="bt-lessonhead__lead">
                A scope management plan says what a project will deliver, what it won&rsquo;t, and how
                changes get dealt with. You&rsquo;ll write a rough one with your team, then find out
                which parts are weak.
              </p>
              <p className="bt-lessonmeta">
                <span>Reading <b>5 minutes</b></span>
                <span>Activity <b>30 minutes</b></span>
                <span>Teams of <b>4 to 6</b></span>
              </p>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">By the end of this lesson you can</p>
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

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <SectionHead
              eyebrow="Before you start"
              title="What the plan is for"
              aside="Most scope problems start as something nobody wrote down."
            />
          </div>
          <p className="bt-prose">
            Scope is the work a project has to do, and just as much the work it doesn&rsquo;t. The
            plan is where a team agrees on both, so that two months in, &ldquo;I thought that was
            included&rdquo; has an answer. It sits on five steps you&rsquo;ve met already: collect the
            requirements, define the scope, break it into a WBS, check the work against it, and control
            changes.
          </p>
          <p className="bt-prose" style={{ marginTop: 14 }}>
            The plan you&rsquo;ll fill in has eight parts. Each one answers a plain question.
          </p>
          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th>#</th><th>Part</th><th>The question it answers</th></tr>
              </thead>
              <tbody>
                {PARTS.map(([n, part, q]) => (
                  <tr key={n}>
                    <td>{n}</td>
                    <td>{part}</td>
                    <td>{q}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bt-note" style={{ marginTop: 16 }}>
            The exclusions in part 4 are the ones teams skip. Writing down what is in is easy.
            Writing down what someone might expect to be in, and isn&rsquo;t, is where a plan
            starts to do its job.
          </p>
        </Reveal>
      </section>

      {/* ══ The activity ═════════════════════════════════════════════════ */}
      <section id="activity" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow={'Now it\u2019s your turn'}
            title="Team activity: 30 minutes"
            aside="One project, one template, half an hour. The PDF has the same brief on page 1 and the template on pages 2 to 5."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <DownloadButton label="Download the activity and template (PDF)" />
          <p className="bt-note" style={{ marginTop: 12 }}>
            Type into the boxes on screen, or print it and write by hand. Most teams split the sections
            and pass pages around.
          </p>

          <div className="bt-card" style={{ marginTop: 22 }}>
            <h4>The project</h4>
            {SCENARIO.map(p => (
              <p key={p.slice(0, 24)} style={{ marginTop: 10 }}>{p}</p>
            ))}
            <p style={{ marginTop: 10 }}>
              If you&rsquo;d rather plan a real project one of you has worked on, that&rsquo;s fine, as
              long as everyone knows it well enough to answer questions about it.
            </p>
          </div>

          <div style={{ marginTop: 30 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">The 30 minutes</p>
            <ol className="bt-flow" style={{ marginTop: 16 }}>
              {TIMINGS.map(([time, title, body], i) => (
                <li key={title}>
                  <span className="bt-flow__n bt-tnum">{i + 1}</span>
                  <div>
                    <h4>
                      {title}{' '}
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 12, color: 'var(--accent-600)' }}>
                        · minutes {time}
                      </span>
                    </h4>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div style={{ marginTop: 30 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Who writes what</p>
            <div className="bt-scroll" style={{ marginTop: 12 }}>
              <table className="bt-plaintable">
                <tbody>
                  {SPLIT.map(([who, what]) => (
                    <tr key={who}>
                      <td>{who}</td>
                      <td>{what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="bt-note" style={{ marginTop: 12 }}>
              Five people shown. With four, one person takes sections 2, 3, 6 and 7. With six, two
              people share the WBS.
            </p>
          </div>

          <div className="pbi-nudge" style={{ marginTop: 30 }}>
            <p className="bt-eyebrow">The four checks, minutes 17 to 25</p>
            <ol style={{ margin: '8px 0 0', paddingLeft: 22, display: 'grid', gap: 8, listStyle: 'decimal' }}>
              {CHECKS.map(c => (
                <li key={c.slice(0, 24)} style={{ display: 'list-item' }}>{c}</li>
              ))}
            </ol>
            <p style={{ marginTop: 10 }}>Ask these about a teammate&rsquo;s section, not your own.</p>
          </div>
        </Reveal>
      </section>

      {/* ══ Recap ═════════════════════════════════════════════════════════ */}
      <Recap
        title="Say what's in, say what's out, say how it changes."
        points={[
          ['A scope plan is mostly about the edges.', 'Exclusions, assumptions and the change process are where teams find out they disagreed.'],
          ['Acceptance criteria have to be answerable.', 'If a stranger can’t say yes or no, it isn’t a criterion yet.'],
          ['Every deliverable needs work under it, and every piece of work needs a deliverable above it.', 'That is what the WBS check is for.'],
          ['Someone has to be named as the one who decides.', '“The team will discuss it” is not a change process.'],
        ]}
      />

      <section className="bt-sec">
        <Reveal>
          <p className="bt-note">
            The order of the plan follows the usual scope management plan outline, as in the free
            template from ProjectManagementDocs.com, cut down for a class. The wording and the
            project are ours.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
