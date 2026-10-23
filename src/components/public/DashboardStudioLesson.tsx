import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import {
  AGENDA, CHARTS, DELIVERABLES, FEEDBACK, PDF_DIR, PDF_FILE, PRINCIPLES, SCENARIOS, SLIDES_STEPS, STEPS, TOOLS, WIRES,
  type Cell,
} from './dashboard/studio';

// ─── MBI806B · Dashboard design studio ─────────────────────────────────────
// A public, ungated Blend page (src/components/blend/README.md) on MBI806B's
// teal. A 90-minute group activity for five teams: each team gets a different
// fictional client, a reader, a device and a small set of numbers, and designs
// a one-page dashboard mockup in a free tool.
//
// This is the "visualise for an audience" outcome (LO3) done before any
// software is opened: the design decisions — who is reading, which question
// each chart answers, which chart, where it sits — are what Power BI would
// otherwise make for you by default. The build comes afterwards
// (/power-bi-setup).
//
// Everything on the page comes from dashboard/studio.ts, and the printable PDF
// (scripts/dashboard-studio-pdf) is built from the same file.

const BASE = import.meta.env.BASE_URL;
export const STUDIO_PDF_URL = `${BASE}${PDF_DIR}/${PDF_FILE}`;

/** The one PDF: in the hero, and again at the top of the lesson. */
export function StudioPdf({ small = false, tertiary = false }: { small?: boolean; tertiary?: boolean }) {
  return (
    <a
      className={`bt-btn${tertiary ? ' bt-btn--tertiary' : ''}${small ? ' bt-btn--sm' : ''}`}
      href={STUDIO_PDF_URL}
      download={PDF_FILE}
      style={{ textDecoration: 'none' }}
    >
      Download the activity pack (PDF)
      <span className="bt-btn__badge" aria-hidden="true"><Download size={small ? 12 : 14} /></span>
    </a>
  );
}

function Wire({ cols, cells }: { cols: number; cells: Cell[] }) {
  return (
    <div className="dds-wire" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} aria-hidden="true">
      {cells.map(([label, c, r, first], i) => (
        <div
          key={i}
          className={`dds-w${first ? ' dds-w--first' : ''}`}
          style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

const QUIZ: QuizQuestion[] = [
  {
    q: 'A manager wants to see how twelve months of revenue moved, including the December peak. Which chart?',
    answer: 1,
    options: [
      { text: 'A pie chart with twelve slices', why: 'A pie shows share of a whole, not change over time, and twelve thin slices cannot be compared.' },
      { text: 'A line chart with the months along the bottom', why: 'Correct. A line chart is built for a trend, and the peak and the dips are easy to spot.' },
      { text: 'A 3D column chart', why: 'The 3D effect makes the front columns look bigger and hides the ones behind. Use a flat chart.' },
      { text: 'A table of twelve numbers', why: 'A table is fine for looking up one month, but it does not let a reader see the shape of the year.' },
    ],
  },
  {
    q: 'You need to compare six cafés against each other. Which is best?',
    answer: 2,
    options: [
      { text: 'A pie chart, one slice per café', why: 'Six slices of similar size cannot be compared by eye, and nobody can read an exact value.' },
      { text: 'Six small line charts side by side', why: 'This answers a trend question. The question here is comparing cafés, and six lines are harder to rank.' },
      { text: 'A horizontal bar chart sorted from largest to smallest', why: 'Correct. Bars compare lengths easily, and sorting lets the reader see the order at once.' },
      { text: 'A donut chart with a number in the middle', why: 'A donut is a pie with a hole. It has the same problem when there are many parts.' },
    ],
  },
  {
    q: 'Which question suits a heatmap?',
    answer: 0,
    options: [
      { text: 'Which day and time combination has the highest no-show rate?', why: 'Correct. A heatmap shows a value for every combination of two categories, and the pattern appears as colour.' },
      { text: 'How did total revenue change over the quarter?', why: 'That is a trend over one dimension. A line chart is clearer.' },
      { text: 'What share of orders came from email?', why: 'That is a single part of a whole. A bar or a single number does the job.' },
      { text: 'What is the single most important number this month?', why: 'That belongs in a KPI tile, not a heatmap.' },
    ],
  },
  {
    q: 'Which chart title helps a reader most?',
    answer: 3,
    options: [
      { text: 'Revenue', why: 'This names the topic only. The reader has to work out what to look for.' },
      { text: 'Revenue by day of the week', why: 'Better, because it says what is plotted. But it still does not say what the reader should notice.' },
      { text: 'Figure 3: Bar chart of revenue', why: 'This describes the chart type, which the reader can already see.' },
      { text: 'Saturday revenue is double Monday’s', why: 'Correct. The title states the finding, so the chart becomes the proof.' },
    ],
  },
  {
    q: 'A KPI tile shows “3.75%” in large type and nothing else. What is missing?',
    answer: 1,
    options: [
      { text: 'A bigger font', why: 'The size is not the problem. The reader still cannot tell whether 3.75% is good.' },
      { text: 'Something to compare it with, such as a target or last month', why: 'Correct. A number only becomes information once the reader can judge it.' },
      { text: 'A 3D effect', why: 'Effects add nothing. They make the number harder to read.' },
      { text: 'More decimal places', why: 'False precision makes it look more exact without making it more useful.' },
    ],
  },
];

export default function DashboardStudioLesson() {
  const [active, setActive] = useState(0);
  const s = SCENARIOS[active];

  return (
    <div>
      {/* ══ Introduction ══════════════════════════════════════════════════ */}
      <section id="start" className="bt-sec">
        <Reveal>
          <section className="bt-lessonhead" aria-labelledby="lessonhead-title">
            <div>
              <p className="bt-eyebrow">Group activity · Data visualisation</p>
              <h2 id="lessonhead-title">Dashboard design studio</h2>
              <p className="bt-lessonhead__lead">
                A dashboard is a decision on one screen. In this activity, five teams each get a different client, a
                different reader and a different screen. Your job is to decide what goes on the page, which chart
                answers each question, and where each one sits, then mock it up in a free tool. You are not building
                it yet. You are designing it.
              </p>
              <p className="bt-lessonmeta">
                <span>Time <b>about 90 minutes</b></span>
                <span>Teams <b>5, with 4 to 6 people each</b></span>
                <span>You need <b>a laptop and a free Google account</b></span>
              </p>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">By the end you should be able to</p>
              <ul className="bt-objectives">
                {[
                  'State who a dashboard is for and the decision it supports',
                  'Turn a decision into three to five questions',
                  'Choose the right chart for each question, and say what you rejected',
                  'Lay out a one-page dashboard so the eye lands on the right thing first',
                  'Use colour and titles to direct attention',
                  'Test a design on someone else in five seconds',
                ].map(o => (
                  <li key={o}>
                    <span className="bt-objectives__ring" aria-hidden="true" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="erf-printable">
            <div>
              <p className="bt-eyebrow">Printable version</p>
              <p>
                The whole activity as one PDF: the method, the tool guide, and a four-page pack for each of the five
                teams (the brief, the data, a sketch page and a rationale table). Print the team packs and hand one to each team.
              </p>
            </div>
            <StudioPdf small />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="erf-calm">
            <p className="bt-eyebrow">What to expect</p>
            <p>
              Most teams want to start building straight away. Resist it for the first twenty minutes. The teams that
              write down their reader and their questions first usually finish with a better dashboard, and much less
              to fix.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Tool ══════════════════════════════════════════════════════════ */}
      <section id="tool" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Part 1 · The tool"
            title="Use a free, easy mockup tool"
            stop="."
            aside="Pick the tool your whole team can already open in the next minute. The tool is not the point."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="dds-tools">
            {TOOLS.map(t => (
              <div key={t.name} className={`dds-tool${t.pick ? ' dds-tool--pick' : ''}`}>
                <p className="dds-tool__tag">{t.tag}</p>
                <h3>{t.name}</h3>
                <p>{t.good}</p>
                <p className="dds-tool__watch"><b>Watch for:</b> {t.watch}</p>
                <a className="dds-tool__link" href={t.url} target="_blank" rel="noreferrer">
                  {t.url.replace('https://', '')} ↗
                </a>
              </div>
            ))}
          </div>
          <p className="bt-note" style={{ marginTop: 16 }}>
            Free plans and limits change. Check the current limits on the tool’s own site before you commit your
            team to it.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 34 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Setting up a dashboard canvas in Google Slides, about 5 minutes</p>
            <ol className="bt-flow" style={{ marginTop: 16 }}>
              {SLIDES_STEPS.map((step, i) => (
                <li key={step}>
                  <span className="bt-flow__n bt-tnum">{i + 1}</span>
                  <div><p style={{ marginTop: 0 }}>{step}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="pbi-nudge" style={{ marginTop: 26 }}>
            <p className="bt-eyebrow">Why not start in Power BI</p>
            <p>
              Power BI will happily make a chart for you in ten seconds, and the chart it picks is rarely the right
              one. Designing on a blank slide first forces you to decide before the software decides for you. When the
              design is settled, building it is the easy part. <Link to="/power-bi-setup">Set up Power BI</Link> when
              you are ready.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Method ════════════════════════════════════════════════════════ */}
      <section id="method" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Part 2 · How to design one"
            title="Five steps, in this order"
            stop="."
            aside="Each step feeds the next. Skipping to step five is how teams end up with a screen full of charts and no message."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-flow">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="bt-flow__n bt-tnum">{i + 1}</span>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Chart cheat sheet · pick by the type of question</p>
            <div className="bt-scroll" style={{ marginTop: 14 }}>
              <table className="bt-plaintable">
                <thead>
                  <tr><th>The question is about</th><th>Reach for</th><th>Be careful with</th></tr>
                </thead>
                <tbody>
                  {CHARTS.map(c => (
                    <tr key={c.ask}>
                      <td>{c.ask}</td>
                      <td>{c.use}</td>
                      <td>{c.avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Six habits of a dashboard that gets read</p>
            <div className="bt-pairgrid">
              {PRINCIPLES.map(p => (
                <div key={p.title} className="bt-card">
                  <h4>{p.title}</h4>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ Layout ════════════════════════════════════════════════════════ */}
      <section id="layout" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Part 3 · Layout"
            title="Three skeletons to start from"
            stop="."
            aside="The brief tells you which one fits. Change it if you can explain why, but do not start from a blank screen."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="dds-wires">
            {WIRES.map(w => (
              <div key={w.name} className="dds-wirecard">
                <Wire cols={w.cols} cells={w.cells} />
                <h3>{w.name}</h3>
                <p className="dds-wirecard__for"><span>For</span> {w.reader}</p>
                <p>{w.why}</p>
              </div>
            ))}
          </div>
          <p className="bt-note" style={{ marginTop: 16 }}>
            The outlined box in each skeleton is where the eye lands first. Whatever you put there is the most
            important thing on the page, so choose it on purpose.
          </p>
        </Reveal>
      </section>

      {/* ══ Scenarios ═════════════════════════════════════════════════════ */}
      <section id="scenarios" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Part 4 · The five scenarios"
            title="One client for each team"
            stop="."
            aside="Same method, five very different readers. Each brief has the real numbers you need, so there is nothing to download."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-scroll">
            <table className="bt-plaintable dds-compare">
              <thead>
                <tr><th>Team</th><th>Client</th><th>Reader</th><th>Screen</th><th>How often</th></tr>
              </thead>
              <tbody>
                {SCENARIOS.map(x => (
                  <tr key={x.n}>
                    <td>{x.n}</td>
                    <td>{x.client}</td>
                    <td>{x.glance[0]}</td>
                    <td>{x.glance[1]}</td>
                    <td>{x.glance[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="dds-tabs" role="group" aria-label="Choose your team’s scenario">
            {SCENARIOS.map((x, i) => (
              <button
                key={x.n}
                type="button"
                className="bt-tab"
                aria-pressed={active === i}
                onClick={() => setActive(i)}
              >
                Team {x.n} · {x.tab}
              </button>
            ))}
          </div>

          <article className="dds-brief" aria-live="polite">
            <header className="dds-brief__head">
              <p className="bt-eyebrow">Team {s.n} · {s.about}</p>
              <h3>{s.client}: {s.title}</h3>
            </header>

            <dl className="dds-reader">
              <div><dt>Reader</dt><dd>{s.reader.who}</dd></div>
              <div><dt>Screen</dt><dd>{s.reader.screen}</dd></div>
              <div><dt>How often</dt><dd>{s.reader.cadence}</dd></div>
            </dl>

            <div className="bt-prose">
              {s.story.map(p => <p key={p}>{p}</p>)}
            </div>

            <div className="dds-decision">
              <p className="bt-eyebrow">The decision this dashboard supports</p>
              <p>{s.decision}</p>
            </div>

            <h4 className="dds-h">The reader must be able to answer, in five seconds</h4>
            <ol className="dds-qs">
              {s.questions.map(q => <li key={q}>{q}</li>)}
            </ol>

            <h4 className="dds-h">Your data</h4>
            <p className="bt-note" style={{ marginBottom: 10 }}>
              Copy these into your chart tool. Work out any rates and totals you need from the counts.
            </p>
            {s.data.map(t => (
              <div key={t.title} className="dds-data">
                <p className="dds-data__t">{t.title}</p>
                {t.note && <p className="bt-note">{t.note}</p>}
                <div className="bt-scroll">
                  <table className="bt-plaintable">
                    <thead><tr>{t.head.map(h => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>
                      {t.rows.map((r, ri) => (
                        <tr key={ri}>{r.map((c, ci) => <td key={ci}>{c}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="bt-pairgrid" style={{ marginTop: 26 }}>
              <div className="bt-card">
                <h4>What their dashboard gets wrong today</h4>
                <ul className="dds-list">
                  {s.today.map(t => <li key={t}>{t}</li>)}
                </ul>
              </div>
              <div className="bt-card">
                <h4>Your design must</h4>
                <ul className="dds-list">
                  {s.constraints.map(t => <li key={t}>{t}</li>)}
                </ul>
              </div>
            </div>

            <div className="pbi-nudge">
              <p className="bt-eyebrow">Stretch challenge</p>
              <p>{s.stretch}</p>
            </div>
          </article>
        </Reveal>
      </section>

      {/* ══ Running it ════════════════════════════════════════════════════ */}
      <section id="run" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Part 5 · The session"
            title="Ninety minutes, timed"
            stop="."
            aside="Put the timer on the screen where every team can see it. The schedule only works if people keep to it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-flow">
            {AGENDA.map(([time, title, body], i) => (
              <li key={title}>
                <span className="bt-flow__n bt-tnum">{i + 1}</span>
                <div>
                  <h4>
                    {title}{' '}
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 12, color: 'var(--accent-600)' }}>
                      · {time}
                    </span>
                  </h4>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 36 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">What each team hands in</p>
            <div className="bt-scroll" style={{ marginTop: 14 }}>
              <table className="bt-plaintable">
                <thead><tr><th>Deliverable</th><th>What it is</th></tr></thead>
                <tbody>
                  {DELIVERABLES.map(([name, what]) => (
                    <tr key={name}><td>{name}</td><td>{what}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 36 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">A design rationale table, with one row filled in</p>
            <p className="bt-note" style={{ marginTop: 8 }}>
              The example is for a gym, which is not one of the five clients. Your table needs one row for every
              visual on your dashboard.
            </p>
            <div className="bt-scroll" style={{ marginTop: 12 }}>
              <table className="bt-plaintable">
                <thead>
                  <tr><th>Question it answers</th><th>Chart chosen</th><th>Chart rejected, and why</th><th>How colour is used</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Which classes are over-full and which are empty?</td>
                    <td>Horizontal bars of average attendance as a share of capacity, sorted, with a line at 100%</td>
                    <td>Pie chart. Twelve classes would make twelve thin slices, and a slice cannot show capacity.</td>
                    <td>Grey bars. Accent colour only on classes above 90% full.</td>
                  </tr>
                  <tr>
                    <td className="dds-blank">&nbsp;</td><td /><td /><td />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ Feedback ══════════════════════════════════════════════════════ */}
      <section id="review" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Part 6 · Feedback"
            title="Give feedback that changes the design"
            stop="."
            aside="You are not marking each other. You are finding what a real reader would trip over."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-pairgrid" style={{ marginTop: 0 }}>
            <div className="bt-card">
              <h4>The five-second test</h4>
              <p>
                Show another team’s dashboard for exactly five seconds, then hide it. Ask: “What was it about? What
                should the reader do?” If they cannot say, the layout is not leading the eye. Write down what they
                said, word for word, before explaining anything.
              </p>
            </div>
            <div className="bt-card">
              <h4>Three sticky notes</h4>
              <p>
                When you walk around the other teams’ screens, leave three notes on each: <b>I noticed</b> (where my eye
                went first), <b>I got lost at</b> (what slowed me down), and <b>One change</b> (the single edit that
                would help most).
              </p>
            </div>
          </div>
          <div style={{ marginTop: 28 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Checklist for any dashboard</p>
            <ul className="bt-objectives" style={{ marginTop: 14 }}>
              {FEEDBACK.map(f => (
                <li key={f}>
                  <span className="bt-objectives__ring" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ══ Check ═════════════════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Knowledge check"
            title="Five quick questions"
            stop="."
            aside="Nothing is stored. Answer, read why, and move on."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz questions={QUIZ} closing="That is the set. The charts you pick come down to the question you are asking." />
        </Reveal>
      </section>

      <Recap
        title="Design the decision, then draw the chart."
        points={[
          ['A dashboard exists to support one decision.', 'Write down who is reading, on what screen, and what they must decide, before you draw anything.'],
          ['Every visual answers a question.', 'If you cannot say which question a chart answers, it is decoration, and it can go.'],
          ['Pick the chart from the type of question.', 'Comparisons get bars, change over time gets a line, patterns across two categories get a heatmap. Always note the chart you rejected.'],
          ['Layout leads the eye.', 'Top-left is read first, related items sit together, and six to nine visuals is plenty.'],
          ['Colour and titles do the pointing.', 'Grey for the rest, one strong colour for what matters, and titles that state the finding.'],
          ['Test it on someone who has not seen it.', 'If a stranger cannot get the message in five seconds, the design has not finished.'],
        ]}
      />
    </div>
  );
}
