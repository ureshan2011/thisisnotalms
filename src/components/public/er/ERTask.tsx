import { Fragment, useState, type ReactNode } from 'react';
import ChenDiagram from './ChenDiagram';
import type { ERTaskSpec } from './firstTasks';

// ─── One ER task: story, questions, then the answer a part at a time ──────
// The order on screen is the order a student should work in. The story and
// the questions come first, with nothing answered. The clues and the hint
// are there for anyone stuck, but each is one deliberate click away, so a
// student who wants to try it cold can.
//
// The answer opens in four parts — entities, attributes, relationships,
// then the whole thing read back — and the diagram grows with it. Checking
// one part at a time means a wrong entity is caught before it has been
// built on, and a student who got the first two parts right gets to see
// that before anything else.

const STAGES = ['Entities', 'Attributes', 'Relationships', 'Read it back'];
/** The next-part button's words, indexed by the stage already showing. */
const NEXT = ['Check my entities', 'Show the attributes', 'Show the relationships', 'Read it all back'];

const CHECKLIST = [
  'Every entity is a singular noun in capitals, inside a rectangle.',
  'Every entity has one key attribute, and its name is underlined.',
  'Every relationship is a verb in capitals, inside a diamond, joined to two entities.',
  'Every relationship line has a 1, an N or an M beside its entity.',
  'Nothing is floating. Every ellipse is joined to an entity or a diamond.',
];

const CLUE = /\{([ear])\|([^}]+)\}/g;

/** The story text, with its clue words marked when clues are switched on. */
function Story({ text, clues }: { text: string; clues: boolean }) {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(CLUE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [, kind, word] = m;
    out.push(
      clues
        ? <mark key={i++} className={`erf-clue erf-clue--${kind}`}>{word}</mark>
        : <Fragment key={i++}>{word}</Fragment>,
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <p>{out}</p>;
}

/** A relationship written as ENTITY VERB ENTITY, the verb set apart. */
function RelName({ name }: { name: string }) {
  const [a, verb, b] = name.split(' ');
  return (
    <span className="erf-relname">
      <span>{a}</span> <b>{verb}</b> <span>{b}</span>
    </span>
  );
}

export default function ERTask({ task }: { task: ERTaskSpec }) {
  const [clues, setClues] = useState(false);
  const [hint, setHint] = useState(false);
  const [stage, setStage] = useState(0);
  const [fresh, setFresh] = useState<number | undefined>(undefined);

  function show(s: number) {
    setFresh(s > stage ? s : undefined);
    setStage(s);
  }

  return (
    <div className="erf-task">
      <div className="erf-chips">
        <span className={`erf-chip${task.level === 'Moderate' ? ' erf-chip--mod' : ''}`}>{task.level}</span>
        <span className="erf-chip erf-chip--plain">{task.place}</span>
        <span className="erf-chip erf-chip--plain">About {task.time}</span>
      </div>

      <div className="erf-brief">
        {/* ── The story ────────────────────────────────────────────────── */}
        <div className="erf-story">
          <div className="erf-story__bar">
            <p className="bt-eyebrow">The story</p>
            <button
              type="button"
              className="bt-ctxchip"
              aria-pressed={clues}
              onClick={() => setClues(c => !c)}
            >
              {clues ? 'Hide the clues' : 'Show me the clues'}
            </button>
          </div>
          <div className="erf-story__text">
            {task.story.map(p => <Story key={p} text={p} clues={clues} />)}
          </div>
          {clues && (
            <p className="erf-cluekey" aria-live="polite">
              <span><mark className="erf-clue erf-clue--e">noun</mark> could be an entity</span>
              <span><mark className="erf-clue erf-clue--a">fact</mark> could be an attribute</span>
              <span><mark className="erf-clue erf-clue--r">verb</mark> could be a relationship</span>
            </p>
          )}
        </div>

        {/* ── The questions ────────────────────────────────────────────── */}
        <div className="erf-ask">
          <p className="bt-eyebrow">Your turn</p>
          <ol className="erf-ask__list">
            {task.questions.map((q, i) => (
              <li key={q}>
                <span className="erf-ask__n bt-tnum">{i + 1}</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
          <p className="erf-ask__paper">Use paper and a pencil. Try it on your own before you look at anything below.</p>
          <button
            type="button"
            className="bt-btn bt-btn--tertiary bt-btn--sm"
            aria-expanded={hint}
            onClick={() => setHint(h => !h)}
          >
            {hint ? 'Hide the hint' : 'I’m stuck. Give me a hint'}
          </button>
          {hint && <p className="erf-hint" aria-live="polite">{task.hint}</p>}
        </div>
      </div>

      {task.newIdea && (
        <div className="erf-idea">
          <p className="bt-eyebrow">{task.newIdea.title}</p>
          <p>{task.newIdea.body}</p>
        </div>
      )}

      {/* ── The answer ─────────────────────────────────────────────────── */}
      <div className="erf-answer">
        <div className="erf-answer__bar">
          <div>
            <p className="bt-eyebrow">Check your answer</p>
            <h3 className="erf-answer__title">One part at a time</h3>
          </div>
          <div className="erf-stages" role="group" aria-label={`Answer parts for task ${task.n}`}>
            {STAGES.map((label, i) => (
              <button
                key={label}
                type="button"
                className={`erf-stage${stage > i ? ' erf-stage--on' : ''}`}
                aria-pressed={stage > i}
                onClick={() => show(i + 1)}
              >
                <span className="erf-stage__n bt-tnum">{i + 1}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {stage === 0 ? (
          <div className="erf-wait">
            <p>
              Done your drawing? Open the answer one part at a time. Check your entities first. If they match,
              move on to the attributes. Fix things as you go. That’s how everyone learns this.
            </p>
            <button type="button" className="bt-btn bt-btn--sm" onClick={() => show(1)}>
              {NEXT[0]}
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="bt-scroll erf-diagram">
              <ChenDiagram spec={task.diagram} stage={Math.min(stage, 3)} label={task.diagramLabel} freshFrom={fresh} />
            </div>
            {task.diagram.minWidth > 700 && (
              <p className="erf-scrollnote">On a phone, scroll the diagram sideways to see all of it.</p>
            )}

            <div className="erf-parts">
              {/* Part 1 · Entities */}
              <div className="erf-part">
                <p className="erf-part__k"><span className="bt-tnum">1</span> Entities</p>
                <ul className="erf-ents">
                  {task.entities.map(e => (
                    <li key={e.name}>
                      <span className="erf-ent">{e.name}</span>
                      <span>{e.why}</span>
                    </li>
                  ))}
                </ul>
                <p className="erf-part__note"><b>Not an entity.</b> {task.notEntities}</p>
              </div>

              {/* Part 2 · Attributes */}
              {stage >= 2 && (
                <div className="erf-part">
                  <p className="erf-part__k"><span className="bt-tnum">2</span> Attributes</p>
                  <div className="bt-scroll">
                    <table className="bt-plaintable erf-attrtable">
                      <thead>
                        <tr><th>Entity</th><th>Key</th><th>Other attributes</th></tr>
                      </thead>
                      <tbody>
                        {task.attributes.map(a => (
                          <tr key={a.entity}>
                            <td>{a.entity}</td>
                            <td><span className="erf-key">{a.key}</span></td>
                            <td>{a.others.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="erf-part__note">{task.attributesNote}</p>
                </div>
              )}

              {/* Part 3 · Relationships */}
              {stage >= 3 && (
                <div className="erf-part">
                  <p className="erf-part__k"><span className="bt-tnum">3</span> Relationships</p>
                  <div className="erf-rels">
                    {task.rels.map(r => (
                      <div key={r.name} className="erf-rel">
                        <div className="erf-rel__top">
                          <RelName name={r.name} />
                          <span className="erf-ratio bt-tnum">{r.ratio}</span>
                        </div>
                        <dl className="erf-twoq">
                          {r.q.map(([q, a]) => (
                            <div key={q}>
                              <dt>{q}</dt>
                              <dd>{a}</dd>
                            </div>
                          ))}
                        </dl>
                        <p className="erf-rel__numbers">{r.numbers}</p>
                        {r.attrs && (
                          <p className="erf-rel__attrs">
                            On the diamond: {r.attrs.map((a, i) => (
                              <Fragment key={a}>{i > 0 && ', '}<b>{a}</b></Fragment>
                            ))}
                          </p>
                        )}
                        {r.note && <p className="erf-rel__note">{r.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Part 4 · Read it back */}
              {stage >= 4 && (
                <div className="erf-part erf-part--last">
                  <p className="erf-part__k"><span className="bt-tnum">4</span> Read it back</p>
                  <p className="erf-part__lead">Say each line out loud while you point at your drawing. If your drawing says the same thing, you got it.</p>
                  <ul className="erf-aloud">
                    {task.readAloud.map(s => <li key={s}>{s}</li>)}
                  </ul>
                  <div className="erf-check">
                    <p className="erf-check__k">Last check on your own drawing</p>
                    <ul>
                      {CHECKLIST.map(c => (
                        <li key={c}>
                          <span className="bt-objectives__ring" aria-hidden="true" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="erf-cheer">{task.cheer}</p>
                </div>
              )}
            </div>

            <div className="erf-answer__nav">
              {stage < 4 && (
                <button type="button" className="bt-btn bt-btn--sm" onClick={() => show(stage + 1)}>
                  {NEXT[stage]}
                  <span className="bt-btn__badge" aria-hidden="true">→</span>
                </button>
              )}
              <button type="button" className="bt-btn bt-btn--tertiary bt-btn--sm" onClick={() => show(0)}>
                Hide the answer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
