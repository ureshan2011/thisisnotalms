import { useState } from 'react';
import { PRACTICE_BYLINE, PRACTICE_FIELDS, PRACTICE_TITLE } from './practiceScenario';

// ─── The practice audit, one question at a time ───────────────────────────
// The activity asks four questions of somebody else's post-mortem. Reading
// those four questions teaches nobody anything — the skill is in applying
// them to a write-up whose author has already given a confident, plausible,
// wrong answer to each one.
//
// So the scenario sits on the left, permanently, and the four questions run
// down the right. Every question offers the author's own verdict as an
// option, and it is never the right one. The feedback on a wrong choice is
// the teaching: each distractor is a specific way a weak audit goes wrong —
// accepting the author's frame, inventing evidence, auditing the schedule
// instead of the outcome, or substituting your own preferred fix for theirs.
//
// Nothing is scored or stored. The tally exists so a reader can see they
// have been through all four.

type Verdict = 'strong' | 'partial' | 'weak';

interface Option {
  text: string;
  verdict: Verdict;
  why: string;
}

interface Question {
  n: string;
  label: string;
  title: string;
  ask: string;
  /** Which scenario field this question is really about. */
  look: string;
  options: Option[];
  /** What a full-mark answer contains, revealed after answering. */
  strong: string;
}

const QUESTIONS: Question[] = [
  {
    n: '1',
    label: 'Constraint',
    title: 'Constraint check',
    ask: 'Does the evidence actually support the author’s claim about what moved? Would you name a different corner?',
    look: 'Read “What actually moved” twice — the second time, watch what gets reclassified.',
    options: [
      {
        text: 'Time, as the author says — eleven weeks against a planned eight',
        verdict: 'partial',
        why: 'Time did move, and it is the corner the author can see. But it moved by agreement, with nothing outside the project waiting and a relaxed client, so it cost almost nothing. An audit asks what was given up that nobody agreed to.',
      },
      {
        text: 'Scope, because three things on the list were dropped',
        verdict: 'partial',
        why: 'Warmer, and the author would dispute it — they dropped those things and then renamed them “nice-to-haves we had talked about rather than promised”. That reclassification is the move worth auditing. Now ask what was actually in the three things, and who they were for.',
      },
      {
        text: 'Quality, undeclared — the accessibility work and the offline path were cut and renamed',
        verdict: 'strong',
        why: 'Yes. Large-text mode, screen-reader labels and the untested offline path went at the end, and were reclassified rather than escalated. In a health clinic those are not features, they are whether a patient with low vision can sign in unaided and whether anyone can sign in when the network drops. Time moved by agreement and cost nothing; quality moved without a decision and cost the people the system was built for.',
      },
      {
        text: 'Cost, because three extra weeks of a team’s time is money',
        verdict: 'weak',
        why: 'True of most projects and not evidenced in this one: no budget figure moved, and the write-up says explicitly they did not go over. Reaching for a constraint the document does not support is the failure the first question is testing for.',
      },
    ],
    strong:
      'A full-mark answer names quality, quotes the reclassification ("not really features"), says who bore the cost, and concedes what is true in the author’s own answer — that time did move — before explaining why it was the cheap corner here.',
  },
  {
    n: '2',
    label: 'Methodology',
    title: 'Methodology verdict',
    ask: 'The author names what the project was run as, and what it should have been run as. Keep or overturn that verdict?',
    look: 'Read “Methodology” against the dates in it, not against the ceremonies it lists.',
    options: [
      {
        text: 'Keep it — sprints, standups and a board, so it was Agile, and the moving requirements called for Agile',
        verdict: 'partial',
        why: 'This is the author’s own verdict and the ceremonies make it feel right. Check the framework against what the project actually did, rather than against the meetings it held.',
      },
      {
        text: 'Overturn the “run as” — the ceremonies were Agile, the delivery was a single hand-off at the end',
        verdict: 'strong',
        why: 'Yes, and it is the sharper finding because it keeps the half the author got right. Sprints, a standup and a board are the visible half of Scrum. The load-bearing half is a usable increment in front of the people who will live with it, every iteration — and the first time anybody at the clinic saw working software was week ten of eleven, which left one week to absorb three changes. The attributes did call for Agile. The project never got it.',
      },
      {
        text: 'Overturn the “called for” — the requirements were stable enough for Waterfall',
        verdict: 'weak',
        why: 'The write-up says the opposite in its own words: the manager kept thinking of things once she saw the screens. That is the textbook case against a signed specification, and arguing past it means arguing past the evidence.',
      },
      {
        text: 'Neither — methodology is a team preference, and this team preferred Agile',
        verdict: 'weak',
        why: 'The position LO1 exists to rule out, and the one that loses marks on the 60% case study. The methodology follows from the project’s attributes, which is exactly what this question asks you to reason from.',
      },
    ],
    strong:
      'A full-mark answer separates the two halves of the author’s verdict, keeps one and overturns the other, and proves the overturned half from a date in the write-up rather than from a definition of Agile.',
  },
  {
    n: '3',
    label: 'The risk',
    title: 'The missed risk',
    ask: 'Is “the risk nobody named” really the biggest one a reasonable person could have caught at kick-off?',
    look: 'Read the last line of “What the original author would change”. It is recorded as a problem that went away.',
    options: [
      {
        text: 'Yes — a single IT person holding the only admin rights is a real single point of failure',
        verdict: 'partial',
        why: 'It is a real single point of failure, and it is correctly identified. It also cost three weeks on a project where three weeks cost nothing. Ask what the biggest risk was to the people who use the thing, rather than to the schedule.',
      },
      {
        text: 'Bigger: the person who uses it every day was never in the room, and a patient who cannot use a tablet has no path',
        verdict: 'strong',
        why: 'Yes, and the evidence is in the author’s own closing line — the receptionist said in week two that she would rather keep the paper sheet, and it is written down as an objection that resolved itself, with no evidence offered beyond her agreeing. Every consultation in the write-up is with the manager. The accessibility work was cut, the offline path was never tested, and in a clinic a patient who cannot sign in does not get seen. That is a bigger consequence than three weeks, and it was visible at kick-off.',
      },
      {
        text: 'Bigger: the kiosk crashing when two people tapped at once',
        verdict: 'weak',
        why: 'That is a defect, and one that was found and fixed inside the project. A risk is something that has not happened yet and may not; this one had already happened and been closed. Naming it as the top risk confuses the risk register with the issue log.',
      },
      {
        text: 'Bigger: the project going over budget',
        verdict: 'weak',
        why: 'Nothing in the write-up puts the budget at risk, and the author states it held. Inventing an exposure to fill the box is the opposite of auditing.',
      },
    ],
    strong:
      'A full-mark answer names a risk that was visible at kick-off, quotes the line in the write-up that shows it was visible, and compares consequences — not likelihoods — against the risk the author did name.',
  },
  {
    n: '4',
    label: 'The fix',
    title: 'Stress-test the fix',
    ask: 'Take the author’s “what I would change”. If only that had been done, would the project genuinely have turned out differently?',
    look: 'Ask what the fix touches, and then list what it leaves exactly where it was.',
    options: [
      {
        text: 'Yes — asking for the port in week one removes the three weeks, and the author says everything else went fine',
        verdict: 'weak',
        why: 'It does remove the three weeks. The three weeks are also the part of this project that cost nothing: no outside date moved, and the clinic kept using paper without complaint. The fix repairs the cheapest problem in the write-up, and "everything else went fine" is the author’s claim, not a finding.',
      },
      {
        text: 'No — it fixes the schedule, which was the part that did not matter, and leaves every part that did',
        verdict: 'strong',
        why: 'Yes. The port fix buys back three weeks nobody needed. It does not put the receptionist in the room, does not restore the large-text mode or the screen-reader labels, does not test the offline path, and does not give a patient who cannot use a tablet a way to sign in. The author has aimed their one change at the only problem they could measure in days.',
      },
      {
        text: 'No — they should have bought better tablets',
        verdict: 'weak',
        why: 'Hardware is not implicated anywhere in the write-up; the crash was in the software handling two simultaneous taps. Replacing the author’s fix with your own preferred one, unsupported by the document, is not an audit either.',
      },
      {
        text: 'Impossible to say without the budget and the original requirements document',
        verdict: 'weak',
        why: 'You can say. The write-up records who was consulted, what was cut, when the first demo happened and what the receptionist said — enough for a defensible finding. An auditor who asks for more data rather than reading what is in front of them is avoiding the job, and the activity is marked on the finding.',
      },
    ],
    strong:
      'A full-mark answer grants what the fix does achieve, then names at least two specific things it leaves untouched, drawn from the write-up rather than from general theory.',
  },
];

const VERDICT_LABEL: Record<Verdict, string> = {
  strong: 'That is the finding',
  partial: 'Half of it',
  weak: 'Not this one',
};

const TONE: Record<Verdict, string> = {
  strong: 'good',
  partial: 'ok',
  weak: 'bad',
};

export default function AuditWalkthrough() {
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});

  const q = QUESTIONS[at];
  const choice = picked[at];
  const answered = choice !== undefined;
  const done = Object.keys(picked).length;

  function choose(i: number) {
    if (answered) return;
    setPicked(prev => ({ ...prev, [at]: i }));
  }

  return (
    <div className="bt-walk bt-walk--wide">
      {/* The scenario stays on screen for all four questions. An audit is a
          reading exercise, and hiding the text behind a tab would make it a
          memory one. */}
      <div>
        <div className="bt-sheet2">
          <div className="bt-sheet2__head">
            <span className="bt-sheet2__code">Practice scenario</span>
            <span className="bt-sheet2__code">Fictional</span>
          </div>
          <p className="bt-sheet2__title">{PRACTICE_TITLE}</p>
          <div className="bt-sheet2__rows">
            {PRACTICE_FIELDS.map(f => (
              <div key={f.label} className="bt-sheet2__row bt-sheet2__row--filled">
                <div className="bt-sheet2__rowhead">
                  <span className="bt-sheet2__label">{f.label}</span>
                  {f.tag && <span className="bt-sheet2__tag">{f.tag}</span>}
                </div>
                <p className="bt-sheet2__body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="bt-sim__caption" style={{ marginTop: 12 }}>{PRACTICE_BYLINE}</p>
      </div>

      <div className="bt-walk__panel" style={{ minHeight: 0 }}>
        <ul className="bt-walk__rail" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {QUESTIONS.map((x, i) => (
            <li key={x.n}>
              <button
                type="button"
                className={`bt-walk__node${i === at ? ' bt-walk__node--on' : picked[i] !== undefined ? ' bt-walk__node--done' : ''}`}
                style={{ width: 'auto', paddingInline: 12 }}
                onClick={() => setAt(i)}
              >
                <span className="bt-walk__num">{x.n}</span>
                {x.label}
              </button>
            </li>
          ))}
        </ul>

        <p className="bt-eyebrow">Question {q.n} of 4</p>
        <h3>{q.title}</h3>
        <p className="bt-walk__body">{q.ask}</p>
        <p className="bt-note" style={{ marginTop: 10 }}>{q.look}</p>

        <ul className="bt-sim__choices" style={{ marginTop: 18 }}>
          {q.options.map((o, i) => {
            const isPick = choice === i;
            const reveal = answered;
            // The selected-state rule in blend.css paints the label white,
            // which is right on the dark pressed state and unreadable once a
            // reveal repaints the button in a light tint — so a revealed
            // button states its own colours.
            const tint = !reveal
              ? null
              : o.verdict === 'strong'
                ? { bg: 'var(--green-50)', border: 'rgba(47, 163, 107, 0.34)', ink: '#186845' }
                : isPick
                  ? { bg: 'var(--red-50)', border: 'rgba(217, 58, 43, 0.28)', ink: '#8f2318' }
                  : null;
            return (
              <li key={o.text}>
                <button
                  type="button"
                  className="bt-sim__choice"
                  aria-pressed={isPick}
                  disabled={answered}
                  style={
                    tint
                      ? { background: tint.bg, borderColor: tint.border, cursor: 'default' }
                      : reveal
                        ? { opacity: 0.5, cursor: 'default' }
                        : undefined
                  }
                  onClick={() => choose(i)}
                >
                  <b style={tint ? { color: tint.ink } : undefined}>
                    {o.text}{reveal && o.verdict === 'strong' ? ' ✓' : ''}
                  </b>
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <>
            <div className={`cc__verdict cc__verdict--${TONE[q.options[choice].verdict]}`} style={{ marginTop: 16 }} aria-live="polite">
              <p className="cc__stamp">{VERDICT_LABEL[q.options[choice].verdict]}</p>
              <p>{q.options[choice].why}</p>
            </div>
            <div className="bt-verdict" style={{ marginTop: 12 }}>
              <strong>What a full-mark answer does here</strong>
              {q.strong}
            </div>
          </>
        )}

        <div className="bt-walk__nav">
          <button type="button" className="bt-btn bt-btn--tertiary bt-btn--sm" disabled={at === 0} onClick={() => setAt(n => Math.max(0, n - 1))}>
            Back
          </button>
          <button type="button" className="bt-btn bt-btn--sm" disabled={at === QUESTIONS.length - 1} onClick={() => setAt(n => Math.min(QUESTIONS.length - 1, n + 1))}>
            {at === QUESTIONS.length - 1 ? 'Last question' : `Next · ${QUESTIONS[at + 1].title}`}
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </button>
        </div>

        <p className="cc__tally">
          <span className="bt-tnum">{done}</span> of 4 answered. In all four, the author’s own verdict is on the list
          and is never the strongest answer — which is the whole reason the audit is done by somebody else.
        </p>
      </div>
    </div>
  );
}
