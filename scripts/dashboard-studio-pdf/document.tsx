import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  AGENDA, CHARTS, DELIVERABLES, FEEDBACK, PRINCIPLES, SCENARIOS, SLIDES_STEPS, STEPS, TOOLS, WIRES,
  type Cell, type Scenario,
} from '../../src/components/public/dashboard/studio';

// ─── The printable activity pack ──────────────────────────────────────────
// Built from the same data as the /dashboard-design-studio page. build.mjs
// bundles this file, calls activityDoc() and prints the HTML to PDF with
// Chromium.
//
// Order: the shared front matter (instructions, tool, method, layout, session
// plan), then one four-page pack per team. Every team pack starts on a new
// page, so the lecturer can print just those pages and hand one pack to each
// team. The sketch page is landscape and its frame matches the device in the
// brief: a phone is drawn portrait, a TV or a monitor widescreen.

const COURSE = 'MBI806B Business Data Analytics with AI and ML';
const AUTHOR = 'Yasas Sri Wickramasinghe';

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

function Wire({ cols, cells }: { cols: number; cells: Cell[] }) {
  return (
    <div className="wire" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {cells.map(([label, c, r, first], i) => (
        <div key={i} className={`w${first ? ' w--first' : ''}`} style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` }}>
          {label}
        </div>
      ))}
    </div>
  );
}

// ── Team pack ────────────────────────────────────────────────────────────

/** The sketch frame, in mm, for the device in each brief. */
const FRAME: Record<number, { w: number; h: number; label: string }> = {
  1: { w: 150, h: 112, label: 'Tablet, landscape (4:3)' },
  2: { w: 170, h: 96, label: 'Desktop monitor (16:9)' },
  3: { w: 170, h: 96, label: 'Wall TV (16:9)' },
  4: { w: 170, h: 96, label: 'Laptop and projector (16:9)' },
  5: { w: 69, h: 149, label: 'Phone, portrait' },
};

function TeamLabel({ s, page }: { s: Scenario; page: string }) {
  return (
    <p className="teamlabel">
      <span className="teamlabel__n">Team {s.n}</span>
      {s.client} · {page}
    </p>
  );
}

function Brief({ s }: { s: Scenario }) {
  return (
    <section className="newpage">
      <TeamLabel s={s} page="Brief" />
      <h2 className="brieftitle">{s.title}</h2>
      <p className="note">{s.about}</p>
      <dl className="reader">
        <div><dt>Reader</dt><dd>{s.reader.who}</dd></div>
        <div><dt>Screen</dt><dd>{s.reader.screen}</dd></div>
        <div><dt>How often</dt><dd>{s.reader.cadence}</dd></div>
      </dl>
      {s.story.map(p => <p key={p}>{p}</p>)}

      <div className="decision">
        <p className="eyebrow">The decision this dashboard supports</p>
        <p className="big">{s.decision}</p>
      </div>

      <h3 className="h3">The reader must be able to answer, in five seconds</h3>
      <ol className="plainlist">
        {s.questions.map(q => <li key={q}>{q}</li>)}
      </ol>

      <div className="pair">
        <div>
          <h3 className="h3">What their dashboard gets wrong today</h3>
          <ul>{s.today.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
        <div>
          <h3 className="h3">Your design must</h3>
          <ul>{s.constraints.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>

      <div className="stretch keep">
        <p className="eyebrow">Stretch challenge</p>
        <p>{s.stretch}</p>
      </div>
    </section>
  );
}

function DataPage({ s }: { s: Scenario }) {
  return (
    <section className="newpage datapage">
      <TeamLabel s={s} page="Your data" />
      <h2 className="h1">Your data</h2>
      <p className="note">
        Copy these numbers into your chart tool. Work out any rates and totals you need from the counts. All figures
        are invented for this activity.
      </p>
      {s.data.map(t => (
        <div key={t.title} className="keep">
          <p className="datatitle">{t.title}</p>
          {t.note && <p className="note">{t.note}</p>}
          <table className="grid grid--num">
            <thead><tr>{t.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>
              {t.rows.map((r, ri) => (
                <tr key={ri}>{r.map((c, ci) => <td key={ci}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}

function SketchPage({ s }: { s: Scenario }) {
  const f = FRAME[s.n];
  return (
    <section className="newpage sketchpage">
      <div className="sketchhead">
        <h2>Team {s.n} · {s.client}: sketch your layout</h2>
        <span className="muted">Pencil, five minutes, then photograph it</span>
      </div>
      <div className="sketchbody">
        <div className="frame" style={{ width: `${f.w}mm`, height: `${f.h}mm` }}>
          <span className="frame__lbl">{f.label}</span>
        </div>
        <div className="sketchside">
          <h3 className="h3">Reader and decision, in one sentence</h3>
          <div className="lines" />
          <h3 className="h3">The most important item (top-left)</h3>
          <div className="lines" style={{ height: '14mm' }} />
          <h3 className="h3">Notes: what moved, and why</h3>
          <div className="lines lines--tall" />
        </div>
      </div>
    </section>
  );
}

function RationalePage({ s }: { s: Scenario }) {
  return (
    <section className="newpage">
      <TeamLabel s={s} page="Design rationale" />
      <h2 className="h1">Design rationale</h2>
      <p>
        One row for every visual on your dashboard. This table is half of your three-minute pitch: it shows that each
        chart was chosen, not defaulted to.
      </p>
      <p className="eyebrow" style={{ marginTop: '3mm' }}>Reader and decision</p>
      <div className="sentence">“{s.reader.who.split(',')[0]} needs to decide … looking at … , …”</div>
      <table className="grid rationale">
        <thead>
          <tr><th>#</th><th>Question it answers</th><th>Chart chosen</th><th>Chart rejected, and why</th><th>How colour is used</th></tr>
        </thead>
        <tbody>
          <tr className="example">
            <td>Ex.</td>
            <td>Which classes at a gym are over-full or empty?</td>
            <td>Horizontal bars of attendance as a share of capacity, sorted, with a 100% line</td>
            <td>Pie chart: twelve thin slices, and a slice cannot show capacity</td>
            <td>Grey bars. Accent only above 90% full</td>
          </tr>
          {Array.from({ length: 8 }, (_, i) => (
            <tr key={i}><td>{i + 1}</td><td /><td /><td /><td /></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// ── The activity pack ────────────────────────────────────────────────────

function Pack() {
  return (
    <>
      <TitleBlock
        title="Dashboard Design Studio"
        subtitle="A group activity: design a one-page dashboard for a client, in a free tool"
        meta={[
          ['Lecturer', AUTHOR],
          ['Time', 'About 90 minutes'],
          ['Teams', 'Five, with four to six people each'],
          ['You need', 'A laptop, a free Google account, pencil and paper'],
        ]}
      />

      <section className="box box--accent">
        <h2 className="boxtitle">What you are doing</h2>
        <p>
          A dashboard is a decision on one screen. Each team gets a different client, a different reader and a
          different screen. You decide what goes on the page, which chart answers each question and where each one sits,
          then mock it up. You are not building it yet. You are designing it.
        </p>
      </section>

      <h2 className="h2">By the end you should be able to</h2>
      <ul className="bullets twocol">
        <li>state who a dashboard is for and the decision it supports</li>
        <li>turn a decision into three to five questions</li>
        <li>choose the right chart for each question, and say what you rejected</li>
        <li>lay out a one-page dashboard so the eye lands on the right thing first</li>
        <li>use colour and titles to direct attention</li>
        <li>test a design on someone else in five seconds.</li>
      </ul>

      <h2 className="h2">Contents</h2>
      <table className="contents">
        <tbody>
          <tr><td>Part 1</td><td>The tool: a free, easy mockup tool</td></tr>
          <tr><td>Part 2</td><td>How to design one: five steps, the chart cheat sheet, six habits</td></tr>
          <tr><td>Part 3</td><td>Layout skeletons, the session plan and what you hand in</td></tr>
          <tr><td>Part 4</td><td>Feedback: the five-second test and a checklist</td></tr>
          {SCENARIOS.map(s => (
            <tr key={s.n}><td>Team {s.n}</td><td>{s.client}: {s.title}</td></tr>
          ))}
        </tbody>
      </table>

      <section className="box">
        <h2 className="boxtitle">For the lecturer</h2>
        <p>
          Each team’s section is four pages: the brief, the data, a sketch page and a rationale table. Print the shared
          pages once, then print only each team’s four pages and hand one set to each team. The figures in the briefs
          add up across tables, so two teams checking the same number will agree. The model answers are a separate PDF: hold
          it back until the teams have presented.
        </p>
      </section>

      {/* ── Part 1 ── */}
      <section className="newpage">
        <p className="partlabel">Part 1</p>
        <h2 className="h1">Use a free, easy mockup tool</h2>
        <p className="lead">Pick the tool your whole team can already open in the next minute. The tool is not the point.</p>
        {TOOLS.filter(t => t.pick).map(t => (
          <div key={t.name} className="tool keep tool--pick">
            <p className="tool__tag">{t.tag}</p>
            <h3>{t.name}</h3>
            <p>{t.good}</p>
            <p><b>Watch for:</b> {t.watch}</p>
            <p className="tool__url">{t.url.replace('https://', '')}</p>
          </div>
        ))}
        <div className="toolrow">
          {TOOLS.filter(t => !t.pick).map(t => (
            <div key={t.name} className="tool keep">
              <p className="tool__tag">{t.tag}</p>
              <h3>{t.name}</h3>
              <p>{t.good}</p>
              <p><b>Watch for:</b> {t.watch}</p>
              <p className="tool__url">{t.url.replace('https://', '')}</p>
            </div>
          ))}
        </div>
        <p className="note">Free plans and limits change. Check the current limits on the tool’s own site before you commit your team to it.</p>

        <h2 className="h2">Set up a dashboard canvas in Google Slides (about 5 minutes)</h2>
        <ol className="steps">
          {SLIDES_STEPS.map(step => <li key={step}>{step}</li>)}
        </ol>
        <section className="box keep">
          <h2 className="boxtitle">Why not start in Power BI?</h2>
          <p>
            Power BI will make a chart for you in ten seconds, and the chart it picks is rarely the right one. Designing
            on a blank slide first makes you decide before the software decides for you. When the design is settled,
            building it is the easy part.
          </p>
        </section>
      </section>

      {/* ── Part 2 ── */}
      <section className="newpage">
        <p className="partlabel">Part 2</p>
        <h2 className="h1">How to design one: five steps, in this order</h2>
        <ol className="steps">
          {STEPS.map(st => <li key={st.title}><b>{st.title}.</b> {st.body}</li>)}
        </ol>

        <h2 className="h2">Chart cheat sheet: pick by the type of question</h2>
        <table className="grid charts">
          <thead><tr><th>The question is about</th><th>Reach for</th><th>Be careful with</th></tr></thead>
          <tbody>
            {CHARTS.map(c => <tr key={c.ask}><td>{c.ask}</td><td>{c.use}</td><td>{c.avoid}</td></tr>)}
          </tbody>
        </table>

        <h2 className="h2">Six habits of a dashboard that gets read</h2>
        <div className="threecol">
          {PRINCIPLES.map(p => (
            <div key={p.title} className="habit"><b>{p.title}</b><span>{p.body}</span></div>
          ))}
        </div>
      </section>

      {/* ── Part 3 ── */}
      <section className="newpage">
        <p className="partlabel">Part 3</p>
        <h2 className="h1">Layout, session plan and hand-in</h2>

        <h2 className="h2">Three skeletons to start from</h2>
        <p className="note">The outlined box is where the eye lands first. Whatever you put there is the most important thing on the page.</p>
        <div className="wires">
          {WIRES.map(w => (
            <div key={w.name} className="wirecard">
              <Wire cols={w.cols} cells={w.cells} />
              <h3>{w.name}</h3>
              <p><b>For:</b> {w.reader}</p>
              <p>{w.why}</p>
            </div>
          ))}
        </div>

        <h2 className="h2">The session, 90 minutes</h2>
        <table className="grid agenda">
          <thead><tr><th>Time</th><th>Step</th><th>What to do</th></tr></thead>
          <tbody>
            {AGENDA.map(([time, title, body]) => (
              <tr key={title}><td className="mono">{time}</td><td><b>{title}</b></td><td>{body}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 className="h2">What each team hands in</h2>
        <table className="grid tooltable">
          <tbody>
            {DELIVERABLES.map(([name, what]) => <tr key={name}><td>{name}</td><td>{what}</td></tr>)}
          </tbody>
        </table>
      </section>

      {/* ── Part 4 ── */}
      <section className="newpage">
        <p className="partlabel">Part 4</p>
        <h2 className="h1">Give feedback that changes the design</h2>
        <p className="lead">You are not marking each other. You are finding what a real reader would trip over.</p>

        <div className="pair">
          <div>
            <h3 className="h3">The five-second test</h3>
            <p>
              Show another team’s dashboard for exactly five seconds, then hide it. Ask: “What was it about? What should
              the reader do?” If they cannot say, the layout is not leading the eye. Write down what they said, word for
              word, before you explain anything.
            </p>
          </div>
          <div>
            <h3 className="h3">Three sticky notes</h3>
            <p>
              When you walk around the other teams’ screens, leave three notes on each: <b>I noticed</b> (where my eye
              went first), <b>I got lost at</b> (what slowed me down), and <b>One change</b> (the single edit that would
              help most).
            </p>
          </div>
        </div>

        <h2 className="h2">Checklist for any dashboard</h2>
        <ul className="checklist">
          {FEEDBACK.map(f => <li key={f}>{f}</li>)}
        </ul>

        <h2 className="h2">Notes from the five-second test</h2>
        <table className="grid rationale">
          <thead><tr><th>#</th><th>Team tested</th><th>What they said it was about</th><th>What was missed</th></tr></thead>
          <tbody>
            {Array.from({ length: 4 }, (_, i) => <tr key={i}><td>{i + 1}</td><td /><td /><td /></tr>)}
          </tbody>
        </table>
        <p className="endnote">Next step: when your design is settled, build it for real in Power BI.</p>
      </section>

      {/* ── The five team packs ── */}
      {SCENARIOS.map(s => (
        <div key={s.n}>
          <Brief s={s} />
          <DataPage s={s} />
          <SketchPage s={s} />
          <RationalePage s={s} />
        </div>
      ))}
    </>
  );
}

export function activityDoc(): { html: string; footer: string } {
  const html = '<!doctype html>' + renderToStaticMarkup(
    <Page title="MBI806B Dashboard Design Studio"><Pack /></Page>,
  );
  return { html, footer: 'MBI806B · Dashboard Design Studio' };
}
