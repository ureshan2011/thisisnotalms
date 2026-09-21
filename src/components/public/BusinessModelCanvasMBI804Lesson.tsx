import { Download } from 'lucide-react';
import { Recap, Reveal, SectionHead } from '../blend';

// ─── MBI804 · The Business Model Canvas ────────────────────────────────────
// A public, ungated Blend page (src/components/blend/README.md), running on
// MBI804's plum through the `project` accent set by the shell.
//
// A duplicate of BusinessModelCanvasLesson.tsx (MBI800), with the course
// code and accent renamed — same content otherwise, since the canvas itself
// doesn't change between a database course and a project management one.
// Kept as a separate page rather than one shared component so each course's
// copy can drift independently later without the other noticing.
//
// One deliberate difference from the MBI800 copy: this page doesn't use the
// shared LessonHeader component's "Lesson N of M" numbering. MBI800's copy
// genuinely is chapter 5 of that course's 11-chapter study pack; MBI804 has
// no written study pack and this lesson isn't one of the nine items in its
// course descriptor, so claiming a position in that sequence would be
// inventing one. The header below reuses the same classes and layout as
// LessonHeader (bt-lessonhead, bt-objectives, …) with an honest eyebrow
// instead.
//
// Deliberately not an interactive tool. Teams fill in the canvas on their
// own device, in the downloadable .docx template linked below — not a
// fillable web form on this page. The canvas diagram above the activity is
// read-only; it's there to teach the layout before anyone fills one in.

const CANVAS_TEMPLATE_URL = 'https://neoschronos.com/assets/business-model-canvas.docx';

const OBJECTIVES = [
  'Say what a business model is, in one sentence',
  'Name five common ways businesses make money',
  'Explain what each of the nine blocks on the canvas asks',
  'Read the canvas from cost, to value, to revenue',
  'Fill in a canvas for an IT business idea, working as a team',
  'Present a short slide deck clearly, in about five minutes',
];

const REVENUE_PATTERNS: [string, string, string][] = [
  ['Product & service sales', 'The customer pays directly for a good or a service', 'Automotive manufacturers'],
  ['Subscription', 'The customer pays a recurring fee for ongoing access', 'Mobile carriers, streaming services'],
  ['Ad revenue', 'Advertisers pay for access to the platform’s audience', 'Facebook'],
  ['Commission', 'The platform takes a cut of the transactions it facilitates', 'Kickstarter'],
  ['Freemium', 'Basic use is free; advanced features are paid', 'Skype'],
];

const CANVAS_BLOCKS: { cls: string; n: string; name: string; ask: string }[] = [
  { cls: 'bmc-kp', n: '1', name: 'Key Partners', ask: 'Who do you need on your side?' },
  { cls: 'bmc-ka', n: '2', name: 'Key Activities', ask: 'What will you spend most of your time doing?' },
  { cls: 'bmc-kr', n: '3', name: 'Key Resources', ask: 'What do you need to make it work?' },
  { cls: 'bmc-vp', n: '4', name: 'Value Proposition', ask: 'What value does this create, and for whom?' },
  { cls: 'bmc-cr', n: '5', name: 'Customer Relationships', ask: 'What kind of relationship do customers expect?' },
  { cls: 'bmc-ch', n: '6', name: 'Channels', ask: 'How do people hear about you, and buy?' },
  { cls: 'bmc-cs', n: '7', name: 'Customer Segments', ask: 'Who is actually paying you?' },
];

const COST_REVENUE: { n: string; name: string; ask: string }[] = [
  { n: '8', name: 'Cost Structure', ask: 'What does this cost to run?' },
  { n: '9', name: 'Revenue Streams', ask: 'How do you make money — and is there value beyond money?' },
];

// A small IT business, so the worked example matches what teams are about
// to build one of: something with software in it.
const APP_EXAMPLE: [string, string][] = [
  ['Value Proposition', 'Split a shared bill in seconds, then get everyone reminded automatically until they’ve paid.'],
  ['Customer Segments', 'Groups of friends, flatmates, and people who travel together.'],
  ['Channels', 'The app itself, word of mouth, a listing in the App Store and Google Play.'],
  ['Customer Relationships', 'Self-service — no support needed once it works. A help page for the rare question.'],
  ['Revenue Streams', 'Free for small groups. A small monthly subscription for unlimited groups and spreadsheet export.'],
  ['Key Activities', 'Building and maintaining the app, fixing bugs, adding the features people actually ask for.'],
  ['Key Resources', 'Two developers, a designer, a small cloud hosting bill, the app store accounts.'],
  ['Key Partners', 'A payment processor, the app stores that distribute it.'],
  ['Cost Structure', 'Developer time, cloud hosting, app store fees, a bit of marketing.'],
];

const AGENDA: [string, string, string][] = [
  ['10 min', 'Form groups and pick an IT idea', 'Groups of six. Pick one IT business idea — software, an app, a platform, or a digital service. Appoint a scribe to keep the canvas organised.'],
  ['5 min', 'Divide the nine blocks', 'Read the nine blocks again as a group. Spread them across the six of you — most people end up owning one or two.'],
  ['30 min', 'Fill in the canvas', 'Download the template and work through it block by block. Say your idea out loud before anyone types it in — the discussion is the point, not the document.'],
  ['15 min', 'Create presentations (2–3 slides)', 'Turn your filled canvas into a short slide deck — just the highlights, two or three slides. This is what you’ll actually present from.'],
  ['25 min', 'Present to the class', 'About five minutes per team, for roughly five teams. Keep to your two or three slides.'],
  ['5 min', 'Wrap-up', 'The lecturer highlights a couple of strong presentations and closes the session.'],
];

export default function BusinessModelCanvasMBI804Lesson() {
  return (
    <div>
      {/* ══ What it is ═══════════════════════════════════════════════════ */}
      <section id="what" className="bt-sec">
        <Reveal>
          <section className="bt-lessonhead" aria-labelledby="lessonhead-title">
            <div>
              <p className="bt-eyebrow">Shared with MBI800</p>
              <h2 id="lessonhead-title">The Business Model Canvas</h2>
              <p className="bt-lessonhead__lead">
                A business model is how an idea creates value. Before anyone commits to running
                it, testing it, or funding it, the whole thing fits on one page. That's what the
                canvas is for.
              </p>
              <p className="bt-lessonmeta">
                <span>Reading <b>15 minutes</b></span>
                <span>Assumes <b>nothing</b></span>
                <span>Then <b>a 90-minute group activity</b></span>
              </p>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">By the end of this lesson you can</p>
              <ul className="bt-objectives">
                {OBJECTIVES.map(o => (
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
          <div style={{ marginTop: 40 }}>
            <SectionHead
              eyebrow="Start here"
              title="What a business model actually is"
              aside="Five patterns cover most of the businesses you already know."
            />
          </div>
          <p className="bt-prose">
            A business model describes how an idea will create value. That definition is
            deliberately broad — it applies just as well to a company as it does to a class
            project. Most revenue models fall into a small number of recognisable patterns, and
            naming the pattern is often the fastest way to understand an unfamiliar business.
          </p>
          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th>Model</th><th>How it works</th><th>Example</th></tr>
              </thead>
              <tbody>
                {REVENUE_PATTERNS.map(([model, how, example]) => (
                  <tr key={model}>
                    <td>{model}</td>
                    <td>{how}</td>
                    <td>{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pbi-nudge" style={{ marginTop: 22 }}>
            <p className="bt-eyebrow">Worth asking</p>
            <p>
              When you meet an unfamiliar company, ask which of these five patterns it's actually
              running — and whether it could be running more than one at once. A lot of platforms
              blend two, like a freemium product that also carries ads.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ The nine blocks ══════════════════════════════════════════════ */}
      <section id="blocks" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="The tool"
            title="Nine blocks, one page"
            aside="Cost on the left. Revenue on the right. Value in the middle."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bmc-grid">
            {CANVAS_BLOCKS.map(b => (
              <div key={b.name} className={`bmc-cell ${b.cls}`}>
                <h4>{b.n}. {b.name}</h4>
                <p>{b.ask}</p>
              </div>
            ))}
          </div>
          <div className="bmc-bottom">
            {COST_REVENUE.map(b => (
              <div key={b.name} className="bmc-cell">
                <h4>{b.n}. {b.name}</h4>
                <p>{b.ask}</p>
              </div>
            ))}
          </div>
          <p className="bt-note" style={{ marginTop: 16 }}>
            Read it left to right: the left-hand blocks and Cost Structure describe what the
            model costs to run. The right-hand blocks and Revenue Streams describe what it earns,
            and from whom. Value Proposition sits in the middle because everything else on the
            page exists to support it.
          </p>
        </Reveal>
      </section>

      {/* ══ Worked example ═══════════════════════════════════════════════ */}
      <section id="example" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Seeing it filled in"
            title="A worked example: a bill-splitting app"
            aside="Before you fill one in yourselves, here's what a completed canvas actually looks like."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-prose">
            Not every canvas needs a billion-dollar company behind it. Here's one for a small,
            ordinary app — easy to check against your own experience, and the same kind of IT
            idea your team will pick.
          </p>
          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th>Block</th><th>Filled in</th></tr>
              </thead>
              <tbody>
                {APP_EXAMPLE.map(([block, filled]) => (
                  <tr key={block}>
                    <td>{block}</td>
                    <td>{filled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bt-note" style={{ marginTop: 16 }}>
            Notice the order it was actually filled in: value proposition and customers first,
            then how they'd find out about it, then what it costs to run. Most teams find it
            easier to work outward from the centre block rather than straight across.
          </p>
        </Reveal>
      </section>

      {/* ══ The group activity ═══════════════════════════════════════════ */}
      <section id="activity" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Now it's your turn"
            title="Group activity: build a canvas"
            aside="Six people. One IT business idea. 90 minutes, start to finish."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-prose">
            Download the blank canvas template and fill it in together as a team, then turn it
            into a short slide deck to present.
          </p>
          <a
            className="bt-btn bt-btn--sm"
            href={CANVAS_TEMPLATE_URL}
            target="_blank"
            rel="noreferrer"
            style={{ marginTop: 4, textDecoration: 'none' }}
          >
            Download the canvas template (.docx)
            <span className="bt-btn__badge" aria-hidden="true"><Download size={13} /></span>
          </a>

          <div className="bt-pairgrid" style={{ marginTop: 22 }}>
            <div className="bt-card">
              <h4>What you need</h4>
              <p>
                One laptop per team, the canvas template above, and a way to build a short slide
                deck — Google Slides, PowerPoint, Canva, whatever's fastest. A timer, visible to
                everyone.
              </p>
            </div>
            <div className="bt-card">
              <h4>Group and idea</h4>
              <p>
                Groups of six. Each team picks one IT business idea — software, an app, a
                platform, or a digital service. An existing one you know, or one you invent.
                IT ideas only, not any other field.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">The agenda — 90 minutes, timed</p>
            <ol className="bt-flow" style={{ marginTop: 16 }}>
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
          </div>

          <div className="pbi-nudge" style={{ marginTop: 26 }}>
            <p className="bt-eyebrow">On dividing nine blocks among six people</p>
            <p>
              There's no single right split. Two pairs can each take two related blocks — Key
              Partners with Key Activities, say, or Cost Structure with Revenue Streams — while
              the rest take one each. The one rule: every block gets an owner, and nobody sits out
              the discussion just because their name isn't attached to that block.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Recap ═════════════════════════════════════════════════════════ */}
      <Recap
        title="Cost, value, revenue — on one page."
        points={[
          ['A business model is how an idea creates value.', 'Broad enough to cover a company, a class project, or a business idea you just invented.'],
          ['The canvas puts cost on the left, revenue on the right.', 'Value Proposition sits in the middle, because everything else on the page exists to support it.'],
          ['Filling one in together, fast, surfaces disagreements a rehearsed pitch would hide.', 'Say the idea out loud before anyone types it into the template.'],
          ['A canvas is a draft, not a business plan.', 'The moment one block turns out to be wrong, the whole thing is meant to be redone.'],
        ]}
      />

      <section className="bt-sec">
        <Reveal>
          <p className="bt-note">
            The Business Model Canvas concept originates with Alexander Osterwalder. The canvas
            layout used on this page is adapted from "Business Model &amp; Idea Canvasses" (MaRS
            Discovery District / Ontario Network of Entrepreneurs), licensed under Creative
            Commons Attribution–ShareAlike 4.0 International.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
