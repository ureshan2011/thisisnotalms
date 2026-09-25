import { useState } from 'react';
import { CalendarDays, Check, Dumbbell, X } from 'lucide-react';
import { MEMBERS, TREES, VoteMark, describe, forestSaysQuit, quitVotes, saysQuit, type Member, type Tree } from './forestData';

// ─── Ask the five trees about one person ──────────────────────────────────
// Pick a member, and each tree lights up the branch it takes and casts its
// vote. The votes stack into a count, the count gives the forest's answer,
// and only then can you check it against what really happened — so a class
// can call the answer out before the reveal.
//
// Opens on Fay, because two of the five trees get her wrong and the vote
// still gets her right: the whole section in one person. Dan is the one the
// forest gets wrong; worth finding with the class.

function TreeCard({ tree, member, revealed }: { tree: Tree; member: Member; revealed: boolean }) {
  const yes = saysQuit(tree, member);
  const right = yes === member.quit;
  const on = 'var(--ink-900)';
  const off = 'var(--ink-200)';

  return (
    <div className="bt-rf-tree">
      <div className="bt-rf-tree__head">
        <span>Tree {tree.n}</span>
        {revealed && (
          <span className={`bt-rf-tree__mark ${right ? 'is-right' : 'is-wrong'}`}>
            {right ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : <X size={12} strokeWidth={3} aria-hidden="true" />}
            {right ? 'right' : 'wrong'}
          </span>
        )}
      </div>
      <svg viewBox="0 0 150 124" role="img" aria-label={`Tree ${tree.n} asks: ${tree.lines.join(' ')} For ${member.name} the answer is ${yes ? 'yes, so it votes quit' : 'no, so it votes stay'}.`}>
        <line x1="75" y1="44" x2="38" y2="86" stroke={yes ? on : off} strokeWidth={yes ? 3 : 1.5} strokeDasharray={yes ? undefined : '4 3'} />
        <line x1="75" y1="44" x2="112" y2="86" stroke={yes ? off : on} strokeWidth={yes ? 1.5 : 3} strokeDasharray={yes ? '4 3' : undefined} />
        <text x="45" y="64" textAnchor="end" fontSize="11" fontWeight="700" fill={yes ? on : 'var(--ink-300)'} fontFamily="var(--font-body)">yes</text>
        <text x="105" y="64" fontSize="11" fontWeight="700" fill={yes ? 'var(--ink-300)' : on} fontFamily="var(--font-body)">no</text>

        <rect x="5" y="4" width="140" height="40" rx="10" fill="var(--paper-0)" stroke="var(--ink-900)" strokeWidth="1.5" />
        <text x="75" y="20.5" textAnchor="middle" fontSize="11.5" fill="var(--ink-900)" fontFamily="var(--font-body)">{tree.lines[0]}</text>
        <text x="75" y="35" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink-900)" fontFamily="var(--font-body)">{tree.lines[1]}</text>

        <g opacity={yes ? 1 : 0.35}>
          <rect x="6" y="86" width="64" height="30" rx="15" fill={yes ? 'var(--cat-2)' : 'var(--paper-100)'} stroke="var(--cat-2)" strokeWidth="1.5" />
          <text x="38" y="105.5" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={yes ? '#fff' : 'var(--cat-2)'} fontFamily="var(--font-display)">Quit</text>
        </g>
        <g opacity={yes ? 0.35 : 1}>
          <rect x="80" y="86" width="64" height="30" rx="15" fill={yes ? 'var(--paper-100)' : 'var(--cat-3)'} stroke="var(--cat-3)" strokeWidth="1.5" />
          <text x="112" y="105.5" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={yes ? 'var(--cat-3)' : '#fff'} fontFamily="var(--font-display)">Stay</text>
        </g>
      </svg>
      <p className="bt-rf-tree__why">
        {describe(tree, member)} → <b>{yes ? 'yes' : 'no'}</b>
      </p>
    </div>
  );
}

export default function ForestVote() {
  const [name, setName] = useState('Fay');
  const [revealed, setRevealed] = useState(false);
  const member = MEMBERS.find(m => m.name === name)!;

  const quit = quitVotes(member);
  const stay = TREES.length - quit;
  const forestQuit = forestSaysQuit(member);
  const forestRight = forestQuit === member.quit;
  const treesWrong = TREES.filter(t => saysQuit(t, member) !== member.quit).length;

  return (
    <div className="bt-sim">
      {/* 1 — who */}
      <p className="bt-sim__label">Step 1 · Pick a gym member</p>
      <div className="bt-chiprow" style={{ marginTop: 10 }}>
        {MEMBERS.map(m => (
          <button
            key={m.name}
            type="button"
            className="bt-ctxchip bt-rf-chip"
            aria-pressed={m.name === name}
            onClick={() => {
              setName(m.name);
              setRevealed(false);
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="bt-rf-member">
        <b className="bt-rf-member__name">{member.name}</b>
        <span><Dumbbell size={16} aria-hidden="true" /> comes <b>{member.visits}×</b> a month</span>
        <span><CalendarDays size={16} aria-hidden="true" /> joined <b>{member.months} months</b> ago</span>
      </div>

      {/* 2 — the trees */}
      <p className="bt-sim__label" style={{ marginTop: 26 }}>Step 2 · Each tree answers its one question</p>
      <div className="bt-rf-trees">
        {TREES.map(t => (
          <TreeCard key={t.n} tree={t} member={member} revealed={revealed} />
        ))}
      </div>

      {/* 3 — the count */}
      <p className="bt-sim__label" style={{ marginTop: 26 }}>Step 3 · Count the votes</p>
      <div className="bt-rf-count">
        <div className="bt-rf-count__side">
          <span className="bt-rf-count__marks">
            {Array.from({ length: quit }, (_, i) => <VoteMark key={i} quit size={22} />)}
          </span>
          <span className="bt-rf-count__num" style={{ color: 'var(--cat-2)' }}>{quit} say quit</span>
        </div>
        <div className="bt-rf-count__side">
          <span className="bt-rf-count__marks">
            {Array.from({ length: stay }, (_, i) => <VoteMark key={i} quit={false} size={22} />)}
          </span>
          <span className="bt-rf-count__num" style={{ color: 'var(--cat-3)' }}>{stay} say stay</span>
        </div>
        <div className="bt-rf-count__answer">
          <span>The forest says</span>
          <b style={{ color: forestQuit ? 'var(--cat-2)' : 'var(--cat-3)' }}>{member.name} will {forestQuit ? 'quit' : 'stay'}</b>
        </div>
      </div>

      {/* 4 — the truth */}
      {!revealed ? (
        <button type="button" className="bt-btn bt-btn--md" style={{ marginTop: 20 }} onClick={() => setRevealed(true)}>
          What really happened?
          <span className="bt-btn__badge" aria-hidden="true">→</span>
        </button>
      ) : (
        <div className={`bt-verdict ${forestRight ? 'bt-verdict--good' : 'bt-verdict--bad'}`} style={{ marginTop: 20 }}>
          <strong>
            {member.name} really did {member.quit ? 'quit' : 'stay'}. The forest was {forestRight ? 'right' : 'wrong'}.
          </strong>{' '}
          {treesWrong === 0 && 'Every tree got this one right.'}
          {treesWrong > 0 && forestRight &&
            `${treesWrong} of the 5 trees got ${member.name} wrong — but they were outvoted by the ones that got it right.`}
          {!forestRight &&
            `${treesWrong} of the 5 trees got ${member.name} wrong. When most of the trees are fooled, the vote is fooled too. No model is perfect.`}
        </div>
      )}
    </div>
  );
}
