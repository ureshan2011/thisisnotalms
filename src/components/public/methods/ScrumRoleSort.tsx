import { useState } from 'react';

// ─── Whose job is this? (MBI804 · Lesson 2.6) ─────────────────────────────
// The three Scrum accountabilities are easy to recite and hard to apply, and
// almost every dysfunction a team has is one of them being done by the wrong
// person — a Scrum Master ordering the backlog, a Product Owner assigning
// tasks, a manager deciding how much fits in the Sprint.
//
// So this is a sorter rather than three cards: twelve real situations, three
// buttons, and a reason for every answer including the wrong ones. The
// misplacements are the teaching — each distractor is a specific way real
// teams get it wrong.

type Role = 'po' | 'sm' | 'dev';

const ROLES: { key: Role; label: string; sub: string }[] = [
  { key: 'po', label: 'Product Owner', sub: 'Maximises the value of the product' },
  { key: 'sm', label: 'Scrum Master', sub: 'Makes the team’s Scrum work' },
  { key: 'dev', label: 'Developers', sub: 'Create a usable Increment' },
];

interface Case {
  q: string;
  answer: Role;
  why: string;
  /** Why the two wrong answers are tempting, keyed by role. */
  near: Partial<Record<Role, string>>;
}

const CASES: Case[] = [
  {
    q: 'Deciding which of two features is built first',
    answer: 'po',
    why: 'Ordering the Product Backlog is the Product Owner’s accountability, and it is a single person’s decision so that there is always an answer to “what is next”.',
    near: {
      sm: 'A Scrum Master who orders the backlog has quietly become the Product Owner, and the real one stops turning up.',
      dev: 'Developers decide how, and how much. Deciding what is worth most is the one thing that is not theirs.',
    },
  },
  {
    q: 'Deciding how many items the team takes into the Sprint',
    answer: 'dev',
    why: 'Only the Developers may judge their own capacity. That is what makes the Sprint a forecast they own rather than a target somebody handed them.',
    near: {
      po: 'A Product Owner who sets the amount has converted a commitment into an instruction, and the forecast stops carrying information.',
      sm: 'A Scrum Master pushing for “one more story” is optimising the number rather than the team, and the number stops being true.',
    },
  },
  {
    q: 'The build server has been broken for two days and IT will not prioritise it',
    answer: 'sm',
    why: 'Removing impediments the team cannot remove itself — particularly organisational ones — is exactly the Scrum Master’s job.',
    near: {
      dev: 'They have tried, which is what made it an impediment rather than a task.',
      po: 'The Product Owner can add weight, but chasing another department is not what their accountability is for.',
    },
  },
  {
    q: 'Writing the acceptance criteria for a story',
    answer: 'po',
    why: 'The Product Owner is accountable for clear Product Backlog items, and acceptance criteria are how “what would make this right” is written down before it is built.',
    near: {
      dev: 'Developers refine and challenge them, and often draft them jointly. Accountability still sits with the Product Owner.',
      sm: 'A Scrum Master writing the criteria is doing the Product Owner’s job under another name.',
    },
  },
  {
    q: 'Deciding that a story is not Done because coverage fell below the agreed threshold',
    answer: 'dev',
    why: 'The Definition of Done is the Developers’ shared quality standard. Holding it — including against their own work, at the end of a tight Sprint — is theirs.',
    near: {
      po: 'The Product Owner accepts value, not engineering quality. A Product Owner overruling the Definition of Done is how technical debt gets authorised by accident.',
      sm: 'The Scrum Master coaches the standard and does not adjudicate it.',
    },
  },
  {
    q: 'A stakeholder walks up mid-Sprint and asks a developer to “just add one small thing”',
    answer: 'sm',
    why: 'Protecting the Sprint Goal from interruption, and teaching the organisation why the route exists, is a Scrum Master accountability.',
    near: {
      dev: 'A developer saying no once solves today. The pattern is what needs solving.',
      po: 'The request does belong in the Product Backlog, and getting it there rather than into the Sprint is the Scrum Master’s work.',
    },
  },
  {
    q: 'Deciding whether the Increment gets released to customers this week',
    answer: 'po',
    why: 'An Increment must be usable at the end of the Sprint. Whether it is actually released, and when, is the Product Owner’s value decision.',
    near: {
      dev: 'Developers make it releasable. They do not decide whether it is released.',
      sm: 'Release timing is not a process question.',
    },
  },
  {
    q: 'Breaking a selected story into the tasks that will deliver it',
    answer: 'dev',
    why: 'The “how” of Sprint Planning belongs entirely to the Developers, and so does the Sprint Backlog it produces.',
    near: {
      po: 'A Product Owner writing tasks is designing the solution, which is the fastest way to lose the team’s ownership of it.',
      sm: 'Facilitating the session is not the same as doing the decomposition.',
    },
  },
  {
    q: 'Two developers have not spoken in a fortnight and it is slowing the work',
    answer: 'sm',
    why: 'Coaching the team in self-management and helping it work as a team is squarely the Scrum Master’s accountability.',
    near: {
      dev: 'The team owns its own dynamic, and a stuck team is exactly the case a Scrum Master exists for.',
      po: 'This is not a product decision, and a Product Owner stepping in makes it a management one.',
    },
  },
  {
    q: 'Explaining to a new executive why the team will not commit to twelve months of fixed scope',
    answer: 'sm',
    why: 'Serving the organisation — leading, training and coaching Scrum adoption beyond the team — is one of the three ways the Scrum Guide describes the Scrum Master’s service.',
    near: {
      po: 'The Product Owner will be in the room and owns the forecast. The explanation of how the framework works is not their accountability.',
      dev: 'Developers should not have to defend the framework to an executive to get through the week.',
    },
  },
  {
    q: 'Keeping the Product Backlog understandable to everyone who reads it',
    answer: 'po',
    why: 'Transparency of the Product Backlog is named as part of the Product Owner’s accountability, and it is what lets stakeholders argue about order rather than about wording.',
    near: {
      dev: 'Developers refine items with the Product Owner. The list staying legible is not theirs to own.',
      sm: 'The Scrum Master may coach better techniques for it, and does not own the backlog.',
    },
  },
  {
    q: 'Deciding to cancel the Sprint because the market changed and the Goal is now pointless',
    answer: 'po',
    why: 'Only the Product Owner has the authority to cancel a Sprint, and only when the Sprint Goal has become obsolete. It is rare on purpose.',
    near: {
      sm: 'A Scrum Master cancelling a Sprint is taking a product decision.',
      dev: 'Developers can say the Goal is unreachable. Cancelling is not theirs.',
    },
  },
];

export default function ScrumRoleSort() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Role | null>(null);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(0);

  const c = CASES[i];
  const correct = picked === c.answer;

  function choose(r: Role) {
    if (picked) return;
    setPicked(r);
    setDone(d => d + 1);
    if (r === c.answer) setRight(n => n + 1);
  }

  function next() {
    setPicked(null);
    setI(n => (n + 1) % CASES.length);
  }

  return (
    <div className="cc">
      <div className="cc__bar">
        <div className="cc__group">
          <span className="cc__label">Situation {i + 1} of {CASES.length}</span>
          <p className="cc__asking" style={{ marginTop: 4 }}>{c.q}</p>
        </div>
      </div>

      {/* Three buttons on one row on desktop, stacked on a phone. The
          answer reveals itself on the buttons as well as in the verdict, so
          the correction lands where the choice was made. */}
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
        {ROLES.map(r => {
          const isAnswer = r.key === c.answer;
          const wrongPick = picked === r.key && !isAnswer;
          // blend.css paints a pressed choice's label white. Correct on the
          // dark pressed state, unreadable on a light reveal tint — so a
          // tinted button carries its own ink.
          const tint = !picked
            ? null
            : isAnswer
              ? { bg: 'var(--green-50)', border: 'rgba(47, 163, 107, 0.34)', ink: '#186845' }
              : wrongPick
                ? { bg: 'var(--red-50)', border: 'rgba(217, 58, 43, 0.28)', ink: '#8f2318' }
                : null;
          return (
            <button
              key={r.key}
              type="button"
              className="bt-sim__choice"
              aria-pressed={picked === r.key}
              disabled={picked !== null}
              style={
                tint
                  ? { background: tint.bg, borderColor: tint.border, cursor: 'default' }
                  : picked
                    ? { opacity: 0.55, cursor: 'default' }
                    : undefined
              }
              onClick={() => choose(r.key)}
            >
              <b style={tint ? { color: tint.ink } : undefined}>{r.label}{picked && isAnswer ? ' ✓' : ''}</b>
              <span style={tint ? { color: tint.ink, opacity: 0.85 } : undefined}>{wrongPick ? 'Not this one' : r.sub}</span>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className={`cc__verdict cc__verdict--${correct ? 'good' : 'bad'}`} style={{ marginTop: 16 }} aria-live="polite">
          <p className="cc__stamp">{correct ? 'Right' : `Not quite — it is the ${ROLES.find(r => r.key === c.answer)!.label}`}</p>
          <p>{c.why}</p>
        </div>
      )}

      {picked && !correct && c.near[picked] && (
        <div className="bt-verdict" style={{ marginTop: 12 }}>
          <strong>Why {ROLES.find(r => r.key === picked)!.label} is tempting</strong>
          {c.near[picked]}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: 18, flexWrap: 'wrap' }}>
        <p className="cc__tally" style={{ marginTop: 0 }}>
          <span className="bt-tnum">{right}</span> right of <span className="bt-tnum">{done}</span> answered. Nothing
          is stored, and the wrong answers are the useful ones.
        </p>
        <button type="button" className="bt-btn bt-btn--sm" disabled={!picked} onClick={next}>
          Next situation
          <span className="bt-btn__badge" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
