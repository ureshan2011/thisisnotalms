import { useState } from 'react';

// ─── One tree, or all nine? ───────────────────────────────────────────────
// Five members the model has never seen. Nine trees each make a call, and
// the reader watches two scores at once: what the first tree alone would
// have got, and what the nine of them got by majority.
//
// The first tree is a perfectly reasonable tree. It is right three times out
// of five, which is roughly what any single tree manages here. The vote gets
// all five. Nothing about the first tree is rigged to be bad — the point is
// that you cannot tell in advance which of your trees is the good one, and
// voting means you do not have to.
//
// The nine sets of calls below are written by hand rather than computed, so
// the sequence teaches in a sensible order: an easy case, a case the first
// tree gets wrong while the crowd holds, an easy one back, a genuinely close
// call, and a unanimous one. The Python playground on this page does the
// same thing for real, on 160 members, and lands in the same place: the
// average tree in the forest is well behind the vote.

type Call = 'cancel' | 'stay';

interface Case {
  name: string;
  visits: number;
  months: number;
  truth: Call;
  /** Nine trees, in order. The first is the one the reader follows. */
  calls: Call[];
  /** Why the trees saw it the way they did. */
  note: string;
}

const C: Call = 'cancel';
const S: Call = 'stay';

const CASES: Case[] = [
  {
    name: 'Ana',
    visits: 2,
    months: 4,
    truth: 'cancel',
    calls: [C, C, C, C, S, C, C, C, C],
    note: 'Barely turns up, barely joined. This is the easy end of the problem, and eight of the nine trees say so.',
  },
  {
    name: 'Bo',
    visits: 5,
    months: 3,
    truth: 'cancel',
    calls: [S, C, C, S, C, S, C, S, C],
    note: 'Right on the edge: five visits is just above the line most trees draw. The first tree calls it wrong. The crowd scrapes in at five to four — and is right.',
  },
  {
    name: 'Cam',
    visits: 9,
    months: 14,
    truth: 'stay',
    calls: [S, S, S, C, S, S, S, S, S],
    note: 'A regular of over a year. Almost nobody gets this wrong, and the one tree that does was trained on a slice of members that happened to contain two lapsed regulars.',
  },
  {
    name: 'Dee',
    visits: 4,
    months: 22,
    truth: 'stay',
    calls: [C, S, S, C, S, S, C, S, S],
    note: 'The hard one. Four visits looks like somebody on the way out, but she has been a member nearly two years. The first tree only ever learned to ask about visits, so it calls her wrong. Trees that also learned to ask about membership length carry the vote.',
  },
  {
    name: 'Eve',
    visits: 3,
    months: 2,
    truth: 'cancel',
    calls: [C, C, C, C, C, C, C, C, C],
    note: 'New, and hardly ever comes. All nine agree, which is its own kind of information: when the forest is unanimous you can act on it with more confidence than when it is five to four.',
  },
];

function majority(calls: Call[]): Call {
  const cancels = calls.filter(c => c === 'cancel').length;
  return cancels * 2 > calls.length ? 'cancel' : 'stay';
}

const LABEL: Record<Call, string> = { cancel: 'Will cancel', stay: 'Will stay' };

export default function ForestVote() {
  const [at, setAt] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>(() => CASES.map(() => false));

  const now = CASES[at];
  const shown = revealed[at];
  const vote = majority(now.calls);
  const cancels = now.calls.filter(c => c === 'cancel').length;

  const scored = CASES.filter((_, i) => revealed[i]);
  const treeScore = scored.filter(c => c.calls[0] === c.truth).length;
  const voteScore = scored.filter(c => majority(c.calls) === c.truth).length;
  const allDone = revealed.every(Boolean);

  function reveal() {
    setRevealed(prev => prev.map((r, i) => (i === at ? true : r)));
  }

  return (
    <div className="bt-sim">
      <div className="bt-sim__grid">
        <div>
          <p className="bt-sim__label">Member {at + 1} of {CASES.length}, never seen before</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink-900)', marginTop: 8 }}>
            {now.name}
          </p>
          <p className="bt-note" style={{ marginTop: 6 }}>
            Comes <b>{now.visits} times a month</b>. Member for <b>{now.months} months</b>.
          </p>

          <div className="bt-fv__scores">
            <div>
              <span className="bt-sim__label">Tree 1 alone</span>
              <b className="bt-tnum">{treeScore}<span>/{scored.length}</span></b>
            </div>
            <div>
              <span className="bt-sim__label">All nine voting</span>
              <b className="bt-tnum" style={{ color: 'var(--accent-600)' }}>{voteScore}<span>/{scored.length}</span></b>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
            {!shown ? (
              <button type="button" className="bt-btn bt-btn--md" onClick={reveal}>
                What actually happened?
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            ) : (
              <button
                type="button"
                className="bt-btn bt-btn--md"
                disabled={at === CASES.length - 1}
                onClick={() => setAt(a => Math.min(CASES.length - 1, a + 1))}
              >
                Next member
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            )}
            {at > 0 && (
              <button type="button" className="bt-btn bt-btn--md bt-btn--tertiary" onClick={() => setAt(a => a - 1)}>
                Back
              </button>
            )}
          </div>
        </div>

        <div className="bt-sim__stage">
          <p className="bt-sim__label">How the nine trees called it</p>
          <ul className="bt-fv__trees">
            {now.calls.map((call, i) => (
              <li
                key={i}
                className={`bt-fv__tree bt-fv__tree--${call}${i === 0 ? ' bt-fv__tree--followed' : ''}`}
              >
                <span className="bt-fv__n">{i + 1}</span>
                <span className="bt-fv__call">{call === 'cancel' ? 'cancel' : 'stay'}</span>
              </li>
            ))}
          </ul>

          <div className="bt-fv__tally">
            <span className="bt-bar" aria-hidden="true">
              <i style={{ width: `${(cancels / now.calls.length) * 100}%`, background: 'var(--cat-2)' }} />
            </span>
            <p className="bt-sim__caption" style={{ marginTop: 8 }}>
              {cancels} say cancel · {now.calls.length - cancels} say stay · the vote is <b>{LABEL[vote]}</b>
            </p>
          </div>

          {shown && (
            <div
              className={`bt-verdict ${vote === now.truth ? 'bt-verdict--good' : 'bt-verdict--bad'}`}
              style={{ marginTop: 14 }}
              aria-live="polite"
            >
              <strong>
                {now.name} {now.truth === 'cancel' ? 'cancelled.' : 'stayed.'}
              </strong>{' '}
              The vote said {LABEL[vote].toLowerCase()} and was {vote === now.truth ? 'right' : 'wrong'}. Tree 1 on its
              own said {LABEL[now.calls[0]].toLowerCase()} and was {now.calls[0] === now.truth ? 'right' : 'wrong'}.{' '}
              {now.note}
            </div>
          )}
        </div>
      </div>

      {allDone && (
        <div className="bt-verdict bt-verdict--good" style={{ marginTop: 20 }}>
          <strong>Three out of five on its own. Five out of five together.</strong> Tree 1 was not a bad tree — it was
          an ordinary one, and every tree in the forest has its own two or three blind spots. What makes the vote work
          is that those blind spots are in different places, so no two trees are wrong about the same person. The
          mistakes cancel out; the signal, which every tree picked up, does not. You would have had no way of knowing in
          advance that Tree 1 was the one to avoid — and with a forest you never have to know.
        </div>
      )}
    </div>
  );
}
