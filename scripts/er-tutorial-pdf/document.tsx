import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ChenDiagram, { ShapeSample, type DiagramSpec } from '../../src/components/public/er/ChenDiagram';
import { TASKS, plainScenario, type ERTaskSpec } from '../../src/components/public/er/firstTasks';
import { CARDINALITY, CHECKLIST, LAYOUT_NOTE, MISTAKES, NAMING, SHAPES, STEPS } from '../../src/components/public/er/tutorial';

// ─── The two printable documents ──────────────────────────────────────────
// Built from the same data as the /er-first-steps page. build.mjs bundles
// this file, calls the two functions at the bottom and prints the HTML to
// PDF with Chromium.
//
// Drawing spaces and answer diagrams sit on landscape pages (the `wide`
// named page in print.css); everything else is A4 portrait.

const COURSE = 'MBI802 Database Management Systems';
const AUTHOR = 'Yasas Sri Wickramasinghe';

/** A print copy of a diagram: no minimum width, it fits the page. */
const printSpec = (d: DiagramSpec): DiagramSpec => ({ ...d, minWidth: 0 });

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        {/* build.mjs swaps this for print.css and the footer text. */}
        <style>{'/*CSS*/'}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

function TitleBlock({ title, subtitle, meta }: { title: string; subtitle: string; meta: [string, string][] }) {
  return (
    <header className="titleblock">
      <p className="kicker">{COURSE}</p>
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
      <dl className="meta">
        {meta.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

function TaskLabel({ task, suffix }: { task: ERTaskSpec; suffix?: string }) {
  return (
    <p className="tasklabel">
      <span className="tasklabel__n">Task {task.n}</span>
      {task.level} · {task.place} · About {task.time}
      {suffix && <> · {suffix}</>}
    </p>
  );
}

function Key({ children }: { children: string }) {
  return <span className="key">{children}</span>;
}

// ── Tutorial ─────────────────────────────────────────────────────────────

function Tutorial() {
  return (
    <>
      <TitleBlock
        title="ER Diagram Tutorial"
        subtitle="Entities, attributes and relationships in Chen’s notation"
        meta={[
          ['Lecturer', AUTHOR],
          ['Time', 'About 90 minutes'],
          ['You need', 'A pencil, an eraser and this handout'],
        ]}
      />

      <section className="box">
        <h2 className="boxtitle">Instructions</h2>
        <ol className="plainlist">
          <li>Read Part 1 and Part 2 before you start the tasks.</li>
          <li>Complete the tasks in order. Tasks 1 and 2 are simple. Tasks 3, 4 and 5 are moderate.</li>
          <li>For each task, read the scenario, answer the questions in the working space, then draw your ER diagram on the next page.</li>
          <li>Check your work with the separate answers document, one part at a time: entities, then attributes, then relationships.</li>
        </ol>
      </section>

      <h2 className="h2">Learning outcomes</h2>
      <p>After this tutorial you should be able to:</p>
      <ul className="bullets">
        <li>identify the entities in a scenario</li>
        <li>list the attributes of each entity and choose the key attribute</li>
        <li>identify the relationships and their cardinality</li>
        <li>draw an ER diagram using Chen’s notation</li>
        <li>use the correct naming conventions.</li>
      </ul>

      <h2 className="h2">Contents</h2>
      <table className="contents">
        <tbody>
          <tr><td>Part 1</td><td>Chen’s notation and naming conventions</td></tr>
          <tr><td>Part 2</td><td>How to draw an ER diagram</td></tr>
          {TASKS.map(t => (
            <tr key={t.id}><td>Task {t.n}</td><td>{t.title} <span className="muted">({t.level.toLowerCase()})</span></td></tr>
          ))}
          <tr><td>Part 3</td><td>Checklist and common mistakes</td></tr>
        </tbody>
      </table>

      {/* ── Part 1 ── */}
      <section className="part newpage">
        <p className="partlabel">Part 1</p>
        <h2 className="h1">Chen’s notation</h2>
        <p>
          An ER (entity relationship) diagram shows the data an organisation needs to store and how that data is
          connected. In this course we use Chen’s notation, which uses four shapes.
        </p>
        <table className="grid shapes">
          <thead>
            <tr><th>Shape</th><th>Name</th><th>What it shows</th><th>How to find it in a scenario</th></tr>
          </thead>
          <tbody>
            {SHAPES.map(s => (
              <tr key={s.name}>
                <td className="shapes__draw"><ShapeSample kind={s.kind} label={s.label} /></td>
                <td><b>{s.name}</b><br /><span className="muted">{s.shape}</span></td>
                <td>{s.what}</td>
                <td>{s.clue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Lines connect the shapes. Each attribute is connected to its entity, and each relationship is connected to
          the two entities it links. The numbers 1, N and M on a relationship line show the cardinality (see Part 2).
        </p>

        <h3 className="h3">Naming conventions</h3>
        <p>
          Each entity later becomes a table and each attribute becomes a column. Use these rules for every diagram.
        </p>
        <table className="grid naming">
          <thead>
            <tr><th>Shape</th><th>Rule</th><th>Correct</th><th>Incorrect</th></tr>
          </thead>
          <tbody>
            {NAMING.map(([shape, rule, good, bad]) => (
              <tr key={shape}>
                <td><b>{shape}</b></td>
                <td>{rule}</td>
                <td className="mono">{shape === 'Key attribute' ? <Key>{good}</Key> : good}</td>
                <td className="mono strike">{bad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Part 2 ── */}
      <section className="part newpage">
        <p className="partlabel">Part 2</p>
        <h2 className="h1">How to draw an ER diagram</h2>
        <p>Follow these steps for each task.</p>
        <ol className="steps">
          {STEPS.map(([title, body]) => (
            <li key={title}><b>{title}</b> {body}</li>
          ))}
        </ol>

        <div className="box keep">
          <h3 className="boxtitle">Finding the cardinality</h3>
          <p>{CARDINALITY.intro} For example:</p>
          <table className="qa">
            <tbody>
              {CARDINALITY.example.map(([q, a]) => (
                <tr key={q}><td>{q}</td><td><b>{a}</b></td></tr>
              ))}
            </tbody>
          </table>
          <p>Then use the answers to choose the cardinality:</p>
          <table className="qa">
            <tbody>
              {CARDINALITY.rules.map(([when, ratio]) => (
                <tr key={ratio}><td>{when}</td><td><b>{ratio}</b></td></tr>
              ))}
            </tbody>
          </table>
          <p><b>Where the numbers go.</b> {CARDINALITY.where}</p>
        </div>
      </section>

      {/* ── Tasks ── */}
      {TASKS.map(task => (
        <section key={task.id} className="task newpage">
          <TaskLabel task={task} />
          <h2 className="h1">{task.title}</h2>
          <p className="muted">{task.aside}</p>

          <h3 className="h3">Scenario</h3>
          <div className="scenario">
            {task.scenario.map(p => <p key={p}>{plainScenario(p)}</p>)}
          </div>

          {task.newIdea && (
            <div className="box keep">
              <h3 className="boxtitle">{task.newIdea.title}</h3>
              <p>{task.newIdea.body}</p>
            </div>
          )}

          <h3 className="h3">Questions</h3>
          <ol className="plainlist questions">
            {task.questions.map(q => <li key={q}>{q}</li>)}
          </ol>
          <p className="hint"><b>Hint:</b> {task.hint}</p>

          {/* build.mjs stretches this to the bottom of the page. */}
          <div className="working">
            <p className="working__label">Working space: entities, attributes and relationships</p>
          </div>

          <div className="drawpage">
            <TaskLabel task={task} />
            <h2 className="h2">Draw your ER diagram</h2>
            <div className="drawbox" />
          </div>
        </section>
      ))}

      {/* ── Part 3 ── */}
      <section className="part newpage">
        <p className="partlabel">Part 3</p>
        <h2 className="h1">Checklist and common mistakes</h2>
        <h3 className="h3">Before you check your answers</h3>
        <p>Go through each of your diagrams and tick each point.</p>
        <ul className="checklist">
          {CHECKLIST.map(c => <li key={c}>{c}</li>)}
        </ul>

        <h3 className="h3">Common mistakes</h3>
        <table className="grid">
          <thead>
            <tr><th>Mistake</th><th>How to fix it</th></tr>
          </thead>
          <tbody>
            {MISTAKES.map(m => (
              <tr key={m.title}><td><b>{m.title}</b></td><td>{m.fix}</td></tr>
            ))}
          </tbody>
        </table>

        <p className="endnote">{LAYOUT_NOTE}</p>
      </section>
    </>
  );
}

// ── Answers ──────────────────────────────────────────────────────────────

function DiagramFigure({ task }: { task: ERTaskSpec }) {
  return (
    <figure className={`figure${task.diagram.w < 900 ? ' figure--narrow' : ''}`}>
      <ChenDiagram spec={printSpec(task.diagram)} label={task.diagramLabel} />
      <figcaption>Figure {task.n}. ER diagram for Task {task.n}, {task.title.toLowerCase()}.</figcaption>
    </figure>
  );
}

function Answers() {
  return (
    <>
      <TitleBlock
        title="ER Diagram Tutorial: Answers"
        subtitle="Model answers for Tasks 1 to 5"
        meta={[
          ['Lecturer', AUTHOR],
          ['Use with', 'ER Diagram Tutorial'],
        ]}
      />

      <section className="box">
        <h2 className="boxtitle">How to use these answers</h2>
        <ol className="plainlist">
          <li>Try each task on your own before you look at its answer.</li>
          <li>Check one part at a time: entities first, then attributes, then relationships, then the diagram.</li>
          <li>If a part is different from yours, read the reason given, fix your diagram and continue.</li>
        </ol>
        <p>{LAYOUT_NOTE}</p>
      </section>

      <h2 className="h2">Contents</h2>
      <table className="contents">
        <tbody>
          {TASKS.map(t => (
            <tr key={t.id}><td>Task {t.n}</td><td>{t.title} <span className="muted">({t.level.toLowerCase()})</span></td></tr>
          ))}
        </tbody>
      </table>

      {TASKS.map(task => (
        <section key={task.id} className="task newpage">
          <TaskLabel task={task} suffix="Answers" />
          <h2 className="h1">{task.title}</h2>

          <h3 className="h3">1. Entities</h3>
          <table className="grid">
            <thead><tr><th>Entity</th><th>Reason</th></tr></thead>
            <tbody>
              {task.entities.map(e => (
                <tr key={e.name}><td className="mono"><b>{e.name}</b></td><td>{e.why}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="note"><b>Not entities:</b> {task.notEntities}</p>

          <h3 className="h3">2. Attributes</h3>
          <table className="grid">
            <thead><tr><th>Entity</th><th>Key attribute</th><th>Other attributes</th></tr></thead>
            <tbody>
              {task.attributes.map(a => (
                <tr key={a.entity}>
                  <td className="mono"><b>{a.entity}</b></td>
                  <td className="mono"><Key>{a.key}</Key></td>
                  <td className="mono">{a.others.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">{task.attributesNote}</p>

          <h3 className="h3">3. Relationships</h3>
          <table className="grid rels">
            <thead><tr><th>Relationship</th><th>The two questions</th><th>Cardinality</th></tr></thead>
            <tbody>
              {task.rels.map(r => (
                <tr key={r.name}>
                  <td className="mono">
                    <b>{r.name}</b>
                    {r.attrs && <><br /><span className="muted">Relationship attributes: {r.attrs.join(', ')}</span></>}
                  </td>
                  <td>
                    {r.q.map(([q, a]) => (
                      <p key={q} className="rels__q"><span>{q}</span><b>{a}</b></p>
                    ))}
                  </td>
                  <td className="rels__ratio">
                    {r.ratio}
                    <span className="rels__numbers">{r.numbers}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {task.rels.filter(r => r.note).map(r => (
            <p key={r.name} className="note"><b>{r.name}:</b> {r.note}</p>
          ))}

          <div className="widepage">
            <TaskLabel task={task} suffix="Answers" />
            <h2 className="h2">4. ER diagram</h2>
            <DiagramFigure task={task} />
            <h3 className="h3">Reading the diagram</h3>
            <ul className="bullets bullets--two">
              {task.readAloud.map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </section>
      ))}
    </>
  );
}

function html(node: ReactNode): string {
  return `<!doctype html>${renderToStaticMarkup(<>{node}</>)}`;
}

export interface PrintDoc {
  html: string;
  /** Text for the bottom-left of every page. */
  footer: string;
}

export function tutorialDoc(): PrintDoc {
  return {
    html: html(<Page title="ER Diagram Tutorial"><Tutorial /></Page>),
    footer: 'MBI802 · ER Diagram Tutorial',
  };
}

export function answersDoc(): PrintDoc {
  return {
    html: html(<Page title="ER Diagram Tutorial: Answers"><Answers /></Page>),
    footer: 'MBI802 · ER Diagram Tutorial · Answers',
  };
}
