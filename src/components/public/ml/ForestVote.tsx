import { useState } from 'react';

// ─── One tree, or all nine? ───────────────────────────────────────────────
// Five new members. Nine trees each make a call. Two scores run side by
// side: what tree 1 alone would have scored, and what the nine got by vote.
//
// Tree 1 is not rigged to be bad. It gets three of five, which is about what
// any one tree manages here. The vote gets all five. The point is that you
// cannot tell in advance which tree is the good one, so you stop trying.
//
// The nine calls per case are written by hand, so the five run in a useful
// order: an easy one, one tree 1 gets wrong, an easy one back, a close call,
// and a unanimous one.

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
    note: 'Hardly ever comes, only just joined. An easy one, and eight of the nine say so.',
  },
  {
    name: 'Bo',
    visits: 5,
    months: 3,
    truth: 'cancel',
    calls: [S, C, C, S, C, S, C, S, C],
    note: 'Right on the edge. Tree 1 gets it wrong. The vote scrapes home five to four, and is right.',
  },
  {
    name: 'Cam',
    visits: 9,
    months: 14,
    truth: 'stay',
    calls: [S, S, S, C, S, S, S, S, S],
    note: 'A regular of over a year. Almost nobody gets this one wrong.',
  },
  {
    name: 'Dee',
    visits: 4,
    months: 22,
    truth: 'stay',
    calls: [C, S, S, C, S, S, C, S, S],
    note: 'The hard one. Four visits looks like somebody on the way out, but she has been here nearly two years. Tree 1 only ever asks about visits, so it gets her wrong.',
  },
  {
    name: 'Eve',
    visits: 3,
    months: 2,
    truth: 'cancel',
    calls: [C, C, C, C, C, C, C, C, C],
    note: 'New, and hardly ever comes. All nine agree. When they all agree, you can be more confident than when it is five to four.',
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
          <p className="bt-sim__label">New member {at + 1} of {CASES.length}</p>
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
          <strong>Tree 1 got three. The nine of them got five.</strong> Tree 1 is not a bad tree. Every tree has two
          or three blind spots — they are just in different places, so no two trees are wrong about the same person.
          The mistakes cancel out. The bit they all agree on does not. And you had no way of knowing in advance that
          tree 1 was the one to avoid.
        </div>
      )}
    </div>
  );
}
