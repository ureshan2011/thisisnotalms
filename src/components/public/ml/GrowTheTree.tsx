import { useState } from 'react';

// ─── Pick the first question, then meet the trap ──────────────────────────
// Fourteen gym members. The reader picks which question the tree asks first
// and sees what it does to the group: where it cuts, who lands on each side,
// how many it gets wrong.
//
// That is how a real decision tree picks a question — try them all, keep the
// one that splits the group best. Real ones score a split with entropy or
// Gini; counting mistakes ranks these four the same way and needs no
// explaining.
//
// Then the trap. One member is still on the wrong side, and the widget
// offers to add a question that catches him. Press it and you get a rule
// that is perfect here and useless anywhere else. Overfitting is much easier
// to believe once you have caused it yourself.
//
// Same fourteen members as the Python playground, so the split their code
// finds — visits under 4 — is the one they found by hand here.

type Member = { visits: number; months: number; cancelled: boolean; name: string };

const MEMBERS: Member[] = [
  { name: 'Aroha', visits: 1, months: 3, cancelled: true },
  { name: 'Ben', visits: 2, months: 5, cancelled: true },
  { name: 'Chen', visits: 2, months: 14, cancelled: true },
  { name: 'Dilini', visits: 3, months: 2, cancelled: true },
  { name: 'Eli', visits: 3, months: 9, cancelled: true },
  { name: 'Farid', visits: 4, months: 4, cancelled: true },
  { name: 'Grace', visits: 4, months: 20, cancelled: false },
  { name: 'Hemi', visits: 5, months: 6, cancelled: false },
  { name: 'Ines', visits: 6, months: 11, cancelled: false },
  { name: 'Jun', visits: 7, months: 3, cancelled: false },
  { name: 'Kiri', visits: 8, months: 18, cancelled: false },
  { name: 'Luca', visits: 9, months: 7, cancelled: false },
  { name: 'Mei', visits: 11, months: 2, cancelled: false },
  { name: 'Nico', visits: 12, months: 25, cancelled: false },
];

interface Question {
  id: string;
  /** How the question reads to a person, not to a compiler. */
  label: string;
  field: 'visits' | 'months';
  threshold: number;
  /** What this split actually buys you, beyond the score. */
  why: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'v4',
    label: 'Do they come fewer than 4 times a month?',
    field: 'visits',
    threshold: 4,
    why: 'This is the best one. All five on the yes side cancelled. Almost everyone on the no side stayed. One question has nearly sorted the whole group.',
  },
  {
    id: 'v8',
    label: 'Do they come fewer than 8 times a month?',
    field: 'visits',
    threshold: 8,
    why: 'Right idea, wrong place to cut. The no side is clean, but the yes side is still a mix. For ten of the fourteen you have learned almost nothing.',
  },
  {
    id: 'm6',
    label: 'Have they been a member less than 6 months?',
    field: 'months',
    threshold: 6,
    why: 'Not a silly question — new members do cancel more. But both sides come out mixed, so you are still guessing either way.',
  },
  {
    id: 'm15',
    label: 'Have they been a member less than 15 months?',
    field: 'months',
    threshold: 15,
    why: 'The worst of the four. The yes side splits five and five, which is no better than tossing a coin. How often they come matters much more than how long they have been here.',
  },
];

function split(group: Member[], q: Question) {
  const yes = group.filter(m => m[q.field] < q.threshold);
  const no = group.filter(m => m[q.field] >= q.threshold);
  return { yes, no };
}

/** Calling a group by its majority, how many of them would you get wrong? */
function wrongIfCalledByMajority(group: Member[]) {
  const cancelled = group.filter(m => m.cancelled).length;
  return Math.min(cancelled, group.length - cancelled);
}

function verdict(group: Member[]) {
  const cancelled = group.filter(m => m.cancelled).length;
  const stayed = group.length - cancelled;
  return {
    cancelled,
    stayed,
    call: cancelled > stayed ? 'will cancel' : 'will stay',
    wrong: Math.min(cancelled, stayed),
  };
}

const W = 460;
const H = 300;
const PAD = { t: 16, r: 16, b: 40, l: 46 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;

const VIS_MAX = 13.5;
const MON_MAX = 28;
const px = (visits: number) => PAD.l + (visits / VIS_MAX) * PLOT_W;
const py = (months: number) => PAD.t + PLOT_H - (months / MON_MAX) * PLOT_H;

/** Cancelled is a filled square, stayed a hollow circle: the two groups stay
 *  apart for a reader who cannot tell the two hues apart. */
function Dot({ m }: { m: Member }) {
  return m.cancelled ? (
    <rect x={px(m.visits) - 5} y={py(m.months) - 5} width="10" height="10" rx="2" fill="var(--cat-2)" />
  ) : (
    <circle cx={px(m.visits)} cy={py(m.months)} r="5.5" fill="none" stroke="var(--cat-3)" strokeWidth="2" />
  );
}

export default function GrowTheTree() {
  const [picked, setPicked] = useState<string | null>(null);
  const [greedy, setGreedy] = useState(false);

  const question = QUESTIONS.find(q => q.id === picked) ?? null;
  const parts = question ? split(MEMBERS, question) : null;
  const wrong = question ? wrongIfCalledByMajority(parts!.yes) + wrongIfCalledByMajority(parts!.no) : null;
  const foundBest = question?.id === 'v4';

  // Farid is the one member the good split gets wrong: he comes four times a
  // month, which puts him on the "probably fine" side, and cancelled anyway.
  // Catching him means carving out a sliver of the chart that holds him and
  // nobody else — and the only thing standing in the way is Grace, who comes
  // exactly as often and stayed. So the second threshold ends up being set by
  // Grace's membership length, which is the whole point of the section.
  const farid = MEMBERS.find(m => m.name === 'Farid')!;
  const grace = MEMBERS.find(m => m.name === 'Grace')!;

  return (
    <div className="bt-sim">
      <div className="bt-sim__grid">
        <div>
          <p className="bt-sim__label">Which question should the tree ask first?</p>
          <ul className="bt-sim__choices">
            {QUESTIONS.map(q => (
              <li key={q.id}>
                <button
                  type="button"
                  className="bt-sim__choice"
                  aria-pressed={picked === q.id}
                  onClick={() => {
                    setPicked(q.id);
                    setGreedy(false);
                  }}
                >
                  <b>{q.label}</b>
                  <span>
                    {q.field === 'visits' ? 'About how often they come' : 'About how long they have been a member'}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {question && (
            <>
              <div className="bt-counter" style={{ marginTop: 20 }}>
                <span className="bt-sim__label">Gets wrong, out of 14</span>
                <b className="bt-tnum" style={{ fontSize: 34, color: foundBest ? 'var(--green-500)' : 'var(--ink-900)' }}>
                  {greedy ? 0 : wrong}
                </b>
              </div>
              <p className="bt-note" style={{ marginTop: 8 }}>{question.why}</p>
            </>
          )}
        </div>

        <div className="bt-sim__stage">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={
              question
                ? `Fourteen gym members plotted by visits per month and months as a member, cut in two by the question: ${question.label}`
                : 'Fourteen gym members plotted by visits per month against months as a member. Squares cancelled, circles stayed.'
            }
          >
            {[0, 7, 14, 21, 28].map(v => (
              <g key={v}>
                <line x1={PAD.l} y1={py(v)} x2={W - PAD.r} y2={py(v)} stroke="var(--paper-300)" strokeWidth="1" />
                <text x={PAD.l - 9} y={py(v) + 4} textAnchor="end" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-mono)">
                  {v}
                </text>
              </g>
            ))}
            {[0, 4, 8, 12].map(v => (
              <text key={v} x={px(v)} y={H - 18} textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-mono)">
                {v}
              </text>
            ))}
            <text x={W / 2} y={H - 3} textAnchor="middle" fontSize="10.5" fill="var(--ink-300)" fontFamily="var(--font-body)">
              visits a month
            </text>
            <text
              x={12}
              y={PAD.t + PLOT_H / 2}
              fontSize="10.5"
              fill="var(--ink-300)"
              fontFamily="var(--font-body)"
              transform={`rotate(-90 12 ${PAD.t + PLOT_H / 2})`}
              textAnchor="middle"
            >
              months a member
            </text>

            {/* The cut. A vertical line for a question about visits, a
                horizontal one for a question about months — the split is a
                straight edge either way, which is the shape of what a tree
                can and cannot express. */}
            {question &&
              (question.field === 'visits' ? (
                <line
                  x1={px(question.threshold - 0.5)}
                  y1={PAD.t}
                  x2={px(question.threshold - 0.5)}
                  y2={PAD.t + PLOT_H}
                  stroke="var(--accent-500)"
                  strokeWidth="2.5"
                />
              ) : (
                <line
                  x1={PAD.l}
                  y1={py(question.threshold - 0.5)}
                  x2={W - PAD.r}
                  y2={py(question.threshold - 0.5)}
                  stroke="var(--accent-500)"
                  strokeWidth="2.5"
                />
              ))}

            {/* The second cut, only if they took the bait: the sliver that
                holds Farid and nobody else. Its top edge sits just under
                Grace, because Grace is the only reason it has a top edge. */}
            {greedy && (
              <rect
                x={px(3.5)}
                y={py(19.5)}
                width={px(5) - px(3.5)}
                height={py(0) - py(19.5)}
                fill="none"
                stroke="var(--red-500)"
                strokeWidth="2"
                strokeDasharray="4 3"
                rx="6"
              />
            )}

            {MEMBERS.map(m => (
              <Dot key={m.name} m={m} />
            ))}
          </svg>
          <p className="bt-sim__caption">Filled square = cancelled · hollow circle = stayed</p>
        </div>
      </div>

      {question && (
        <div style={{ marginTop: 20 }}>
          <div className="bt-pairgrid">
            <div className="bt-card">
              <h4>Yes — {parts!.yes.length} members</h4>
              <p>
                {verdict(parts!.yes).cancelled} cancelled, {verdict(parts!.yes).stayed} stayed. So the tree says{' '}
                <b>{verdict(parts!.yes).call}</b>. It gets {verdict(parts!.yes).wrong} of them wrong.
              </p>
            </div>
            <div className="bt-card">
              <h4>No — {parts!.no.length} members</h4>
              <p>
                {verdict(parts!.no).cancelled} cancelled, {verdict(parts!.no).stayed} stayed. So the tree says{' '}
                <b>{verdict(parts!.no).call}</b>. It gets {verdict(parts!.no).wrong} of them wrong.
              </p>
            </div>
          </div>
        </div>
      )}

      {foundBest && !greedy && (
        <div className="bt-caution" style={{ marginTop: 20 }}>
          <p className="bt-eyebrow">One person left over</p>
          <p>
            {farid.name} comes {farid.visits} times a month, so the tree says he will stay. He cancelled. He is the one
            member it gets wrong. A tree is allowed to keep asking questions until nobody is left over. Shall we?{' '}
            <button
              type="button"
              className="bt-btn bt-btn--sm"
              style={{ marginTop: 12 }}
              onClick={() => setGreedy(true)}
            >
              Add a question for {farid.name}
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
          </p>
        </div>
      )}

      {greedy && (
        <div className="bt-verdict bt-verdict--bad" style={{ marginTop: 20 }}>
          <strong>Now it gets all fourteen right, and it has learned nothing.</strong> The new question is: has he been a
          member less than 20 months? That 20 is not a fact about gyms. It is {grace.name}&rsquo;s membership length —
          she comes just as often as {farid.name} and did not cancel, so the tree drew a line between the two of them.
          Keep going and you end up with one branch per person. Perfect on these fourteen. Useless on the next one
          through the door. That is called overfitting, and the next model fixes it.
        </div>
      )}
    </div>
  );
}
