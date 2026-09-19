import { useState } from 'react';
import { Check, X } from 'lucide-react';

// ─── Pick a rule. Then find out how it did. ───────────────────────────────
// The version this replaced asked students to follow "nine trees", which
// were never shown — you were simply told they existed and that they
// disagreed. A tree you cannot see is not an example, it is a claim.
//
// Here each tree is one sentence you can read. Five rules of thumb, the kind
// a gym manager would actually say out loud, checked against twenty members
// whose answers are on the page. A student can verify any number here with a
// finger and a minute, which is the whole point.
//
// The interaction is a bet, not a stepper. You pick the rule you trust
// before you see any scores, and then everything is revealed at once. Most
// people pick wrong — three of the five tie on 15, so there is no way to
// tell — and the vote beats all five anyway. Being wrong yourself is a much
// better teacher than watching a counter.
//
// Numbers are computed from MEMBERS at render, not typed in, so they cannot
// drift from the Python playground further down the page, which runs the
// same twenty members through the same five rules.

type Member = { visits: number; months: number; quit: boolean };

const MEMBERS: Member[] = [
  { visits: 1, months: 2, quit: true },
  { visits: 1, months: 9, quit: true },
  { visits: 2, months: 3, quit: true },
  { visits: 2, months: 18, quit: false },
  { visits: 3, months: 1, quit: true },
  { visits: 3, months: 7, quit: true },
  { visits: 3, months: 26, quit: false },
  { visits: 4, months: 4, quit: true },
  { visits: 4, months: 11, quit: true },
  { visits: 4, months: 30, quit: false },
  { visits: 5, months: 2, quit: true },
  { visits: 5, months: 13, quit: false },
  { visits: 6, months: 5, quit: true },
  { visits: 6, months: 20, quit: false },
  { visits: 7, months: 3, quit: false },
  { visits: 8, months: 10, quit: false },
  { visits: 9, months: 2, quit: false },
  { visits: 9, months: 22, quit: false },
  { visits: 11, months: 6, quit: false },
  { visits: 12, months: 15, quit: false },
];

interface Rule {
  id: string;
  /** How a person would say it. */
  says: string;
  test: (m: Member) => boolean;
}

const RULES: Rule[] = [
  { id: 'v3', says: 'They come less than 3 times a month', test: m => m.visits < 3 },
  { id: 'v5', says: 'They come less than 5 times a month', test: m => m.visits < 5 },
  { id: 'v7', says: 'They come less than 7 times a month', test: m => m.visits < 7 },
  { id: 'm6', says: 'They joined less than 6 months ago', test: m => m.months < 6 },
  { id: 'm12', says: 'They joined less than a year ago', test: m => m.months < 12 },
];

const right = (rule: Rule) => MEMBERS.filter(m => rule.test(m) === m.quit).length;
const voteSays = (m: Member) => RULES.filter(r => r.test(m)).length * 2 > RULES.length;
const voteRight = MEMBERS.filter(m => voteSays(m) === m.quit).length;

const best = Math.max(...RULES.map(right));

export default function FiveRules() {
  const [picked, setPicked] = useState<string | null>(null);
  const revealed = picked !== null;
  const mine = RULES.find(r => r.id === picked) ?? null;

  return (
    <div className="bt-sim">
      <p className="bt-sim__label">Five rules of thumb for spotting someone about to quit the gym</p>

      {!revealed ? (
        <>
          <p className="bt-note" style={{ maxWidth: '56ch', marginTop: 8 }}>
            Each one is a guess somebody might make. Only one question each, nothing clever. Which would you trust?
          </p>
          <ul className="bt-sim__choices" style={{ marginTop: 16 }}>
            {RULES.map(r => (
              <li key={r.id}>
                <button type="button" className="bt-sim__choice" onClick={() => setPicked(r.id)}>
                  <b>{r.says}</b>
                  <span>&hellip; then they will probably quit.</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="bt-note" style={{ marginTop: 14 }}>
            Pick one. We will check it against 20 members the gym already knows the answer for.
          </p>
        </>
      ) : (
        <>
          <div className="bt-rv" style={{ marginTop: 16 }}>
            {RULES.map(r => {
              const score = right(r);
              return (
                <div key={r.id} className={`bt-rv__row${r.id === picked ? ' bt-rv__row--mine' : ''}`}>
                  <span className="bt-rv__name">
                    {r.says}
                    {r.id === picked && <b> — your pick</b>}
                  </span>
                  <span className="bt-bar">
                    <i style={{ width: `${(score / MEMBERS.length) * 100}%` }} />
                  </span>
                  <span className="bt-rv__score bt-tnum">{score}/20</span>
                </div>
              );
            })}

            <div className="bt-rv__row bt-rv__row--vote">
              <span className="bt-rv__name">All five voting — majority wins</span>
              <span className="bt-bar">
                <i style={{ width: `${(voteRight / MEMBERS.length) * 100}%` }} />
              </span>
              <span className="bt-rv__score bt-tnum">{voteRight}/20</span>
            </div>
          </div>

          <div className="bt-verdict bt-verdict--good" style={{ marginTop: 18 }}>
            <strong>
              Your rule got {right(mine!)} out of 20. The five of them together got {voteRight}.
            </strong>{' '}
            No single rule does better than {best}. Three of them score exactly the same, so there was no way for you to
            pick the good one — and you did not have to. Take the majority answer and you beat every rule in the list.
          </div>

          <p className="bt-note" style={{ marginTop: 14 }}>
            That is a random forest. Swap the five rules of thumb for a few hundred small decision trees, each shown a
            slightly different slice of the members, and let them vote. Same idea, more of them.
          </p>

          <button type="button" className="bt-btn bt-btn--md bt-btn--tertiary" style={{ marginTop: 12 }} onClick={() => setPicked(null)}>
            Pick a different one
            <span className="bt-btn__badge" aria-hidden="true">↺</span>
          </button>
        </>
      )}

      {/* The twenty members, so the scores above are checkable rather than
          asserted. After a pick, the ones that rule got wrong are ringed. */}
      <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
        <p className="bt-sim__label">The 20 members</p>
        <ul className="bt-rv__dots">
          {MEMBERS.map((m, i) => {
            const wrong = mine ? mine.test(m) !== m.quit : false;
            return (
              <li
                key={i}
                className={`bt-rv__dot${m.quit ? ' bt-rv__dot--quit' : ''}${wrong ? ' bt-rv__dot--wrong' : ''}`}
                title={`${m.visits} visits a month, member ${m.months} months — ${m.quit ? 'quit' : 'stayed'}${wrong ? ' (your rule got this one wrong)' : ''}`}
              >
                {m.quit ? <X size={11} strokeWidth={3} aria-hidden="true" /> : <Check size={11} strokeWidth={3} aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
        <p className="bt-sim__caption" style={{ marginTop: 9 }}>
          {mine
            ? `Cross = quit, tick = stayed. Ringed are the ${MEMBERS.length - right(mine)} your rule got wrong.`
            : 'Cross = quit, tick = stayed. 9 of the 20 quit.'}
        </p>
      </div>
    </div>
  );
}
