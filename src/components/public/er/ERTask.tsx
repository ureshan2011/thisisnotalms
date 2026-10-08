import { Fragment, useState, type ReactNode } from 'react';
import ChenDiagram from './ChenDiagram';
import type { ERTaskSpec } from './firstTasks';
import { CHECKLIST, LAYOUT_NOTE } from './tutorial';

// ─── One ER task: scenario, questions, then the answer in parts ───────────
// The scenario and questions come first with nothing answered. Highlighting
// the key words and the hint are each one click away for anyone stuck.
//
// The answer opens in four parts (entities, attributes, relationships, then
// a summary) and the diagram adds the matching shapes at each step, so a
// student can check one part before moving to the next.

const STAGES = ['Entities', 'Attributes', 'Relationships', 'Summary'];
/** The next-part button's words, indexed by the stage already showing. */
const NEXT = ['Show entities', 'Show attributes', 'Show relationships', 'Show summary'];

const MARK = /\{([ear])\|([^}]+)\}/g;

/** One scenario paragraph, with its key words highlighted when asked. */
function Paragraph({ text, marked }: { text: string; marked: boolean }) {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(MARK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [, kind, word] = m;
    out.push(
      marked
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
  const [marked, setMarked] = useState(false);
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
        {/* ── Scenario ─────────────────────────────────────────────────── */}
        <div className="erf-story">
          <div className="erf-story__bar">
            <p className="bt-eyebrow">Scenario</p>
            <button
              type="button"
              className="bt-ctxchip"
              aria-pressed={marked}
              onClick={() => setMarked(c => !c)}
            >
              {marked ? 'Remove highlights' : 'Highlight key words'}
            </button>
          </div>
          <div className="erf-story__text">
            {task.scenario.map(p => <Paragraph key={p} text={p} marked={marked} />)}
          </div>
          {marked && (
            <p className="erf-cluekey" aria-live="polite">
              <span><mark className="erf-clue erf-clue--e">noun</mark> possible entity</span>
              <span><mark className="erf-clue erf-clue--a">fact</mark> possible attribute</span>
              <span><mark className="erf-clue erf-clue--r">verb</mark> possible relationship</span>
            </p>
          )}
        </div>

        {/* ── Questions ────────────────────────────────────────────────── */}
        <div className="erf-ask">
          <p className="bt-eyebrow">Questions</p>
          <ol className="erf-ask__list">
            {task.questions.map((q, i) => (
              <li key={q}>
                <span className="erf-ask__n bt-tnum">{i + 1}</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
          <p className="erf-ask__paper">Work on paper first, then check the answer below.</p>
          <button
            type="button"
            className="bt-btn bt-btn--tertiary bt-btn--sm"
            aria-expanded={hint}
            onClick={() => setHint(h => !h)}
          >
            {hint ? 'Hide hint' : 'Show hint'}
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

      {/* ── Answer ─────────────────────────────────────────────────────── */}
      <div className="erf-answer">
        <div className="erf-answer__bar">
          <div>
            <p className="bt-eyebrow">Answer</p>
            <h3 className="erf-answer__title">Check one part at a time</h3>
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
            <p>When you have finished, check your answer one part at a time, starting with the entities.</p>
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
              <p className="erf-scrollnote">On a phone, scroll sideways to see the whole diagram.</p>
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
                <p className="erf-part__note"><b>Not entities:</b> {task.notEntities}</p>
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
                            Relationship attributes: {r.attrs.map((a, i) => (
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

              {/* Part 4 · Summary */}
              {stage >= 4 && (
                <div className="erf-part erf-part--last">
                  <p className="erf-part__k"><span className="bt-tnum">4</span> Summary</p>
                  <p className="erf-part__lead">Read the diagram as sentences:</p>
                  <ul className="erf-aloud">
                    {task.readAloud.map(s => <li key={s}>{s}</li>)}
                  </ul>
                  <div className="erf-check">
                    <p className="erf-check__k">Check your own diagram</p>
                    <ul>
                      {CHECKLIST.map(c => (
                        <li key={c}>
                          <span className="bt-objectives__ring" aria-hidden="true" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="erf-part__note">{LAYOUT_NOTE}</p>
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
                Hide answer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
