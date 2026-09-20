import { ExternalLink } from 'lucide-react';
import { LessonHeader, Recap, Reveal, SectionHead } from '../blend';

// ─── MBI800 · The Business Model Canvas ────────────────────────────────────
// A public, ungated Blend page (src/components/blend/README.md), running on
// MBI800's indigo through the `planning` accent set by the shell.
//
// This follows study-pack/content/mbi800/lessons/05-business-model-idea-
// canvases.md — chapter 5 of 11 — so the lesson header reads 5 of 11, the
// same way /intro-to-sisp reads 1 of 11.
//
// Deliberately not an interactive tool. The teaching request behind this
// page was explicit: introduce the canvas, then hand the class a group
// activity to run on paper or a whiteboard, not a fillable web form. So the
// canvas diagram is read-only, and the activity brief below it is written
// instructions with a timed agenda — nothing to click, nothing stored.

const BASE = import.meta.env.BASE_URL;

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

const COFFEE_CART_EXAMPLE: [string, string][] = [
  ['Value Proposition', 'Good coffee, made fast, at the spot outside the station where nobody else sells it.'],
  ['Customer Segments', 'Commuters walking to the station on weekday mornings.'],
  ['Channels', 'The cart itself, in the same spot every day. A sign on the platform noticeboard.'],
  ['Customer Relationships', 'Fast, friendly, the same face every morning. Regulars get remembered orders.'],
  ['Revenue Streams', 'Cash and card sales, per cup. A loyalty stamp card for the tenth cup free.'],
  ['Key Activities', 'Making coffee, restocking milk and cups, showing up on time, every day.'],
  ['Key Resources', 'The cart, a coffee machine, a trading licence, an early alarm clock.'],
  ['Key Partners', 'A local coffee roaster, the station for permission to trade there.'],
  ['Cost Structure', 'Beans, milk, cups, the cart’s trading licence, fuel to tow it there each morning.'],
];

const AGENDA: [string, string, string][] = [
  ['10 min', 'Form groups and pick an idea', 'Groups of six. Pick one real-world business idea — an existing company you know, or one you invent. Appoint a scribe to keep the canvas tidy.'],
  ['5 min', 'Divide the nine blocks', 'Read the nine blocks again as a group. Spread them across the six of you — most people end up owning one or two.'],
  ['40 min', 'Fill in the canvas', 'Work block by block. Say your idea out loud before anyone writes it down — the discussion is the point, not the paper.'],
  ['10 min', 'Step back and tidy up', 'Read the whole canvas as a team. Fix anything that contradicts another block. Agree who says what in the presentation.'],
  ['20 min', 'Present to the class', 'Each group presents. About three minutes each, plus one question from the room.'],
  ['5 min', 'Wrap-up', 'The lecturer highlights two or three strong canvases and closes the session.'],
];

const PRESENT_TIPS: string[] = [
  'Say the idea in one sentence first, before anything else.',
  'Point at the canvas itself. No slides — it already fits on one page.',
  'Walk left to right: who helps you, what you do, what it costs — then who pays you, why, and how they find you.',
  'End with the block you’re least sure about. The class is a free second opinion — use it.',
];

const QUESTIONS_FOR_THE_ROOM: string[] = [
  'Which block would break first if you were wrong about it?',
  'Is there a cheaper way to reach the same customers?',
  'Who else is already solving this?',
];

export default function BusinessModelCanvasLesson() {
  return (
    <div>
      {/* ══ What it is ═══════════════════════════════════════════════════ */}
      <section id="what" className="bt-sec">
        <Reveal>
          <LessonHeader
            lesson={5}
            of={11}
            title="The Business Model Canvas"
            lead="A business model is how an idea creates value. Before anyone commits to running it, testing it, or funding it, the whole thing fits on one page. That's what the canvas is for."
            meta={[
              ['Reading', '15 minutes'],
              ['Assumes', 'nothing'],
              ['Then', 'a 90-minute group activity'],
            ]}
            objectives={[
              'Say what a business model is, in one sentence',
              'Name five common ways businesses make money',
              'Explain what each of the nine blocks on the canvas asks',
              'Read the canvas from cost, to value, to revenue',
              'Fill in a canvas for a real business, working as a team',
              'Present a finished canvas clearly, in under three minutes',
            ]}
          />
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
            title="A worked example: a coffee cart"
            aside="Before you fill one in yourselves, here's what a completed canvas actually looks like."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-prose">
            Not every canvas needs a billion-dollar company behind it. Here's one for a coffee
            cart outside a train station — small, ordinary, and easy to check against your own
            experience.
          </p>
          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th>Block</th><th>Filled in</th></tr>
              </thead>
              <tbody>
                {COFFEE_CART_EXAMPLE.map(([block, filled]) => (
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
            then how they'd find out about it, then what it costs to run. Most groups find it
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
            aside="Six people. One real-world business idea. 90 minutes, start to finish."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-prose">
            This is a paper-and-pen activity, not a web tool. Draw a nine-block canvas on a large
            sheet of paper or a whiteboard — the same layout as above — and fill it in together as
            a group.
          </p>

          <div className="bt-pairgrid" style={{ marginTop: 4 }}>
            <div className="bt-card">
              <h4>What you need</h4>
              <p>
                One blank canvas per group, drawn on a flip-chart sheet or whiteboard. Sticky
                notes and pens are useful but not required. A timer, visible to everyone.
              </p>
            </div>
            <div className="bt-card">
              <h4>Group and idea</h4>
              <p>
                Groups of six. Each group picks one real-world business idea — a real company you
                choose to model, or one your group invents. Keep it plausible, not sci-fi.
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
              the discussion just because their name isn't on that sticky note.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Presenting ════════════════════════════════════════════════════ */}
      <section id="present" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Present it"
            title="Show the class your canvas"
            aside="Three minutes. No slides needed — just point at the canvas."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-topics">
            {PRESENT_TIPS.map((t, i) => (
              <li key={t}>
                <span className="bt-topics__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
                {t}
              </li>
            ))}
          </ol>

          <div style={{ marginTop: 30 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Good questions for the room to ask</p>
            <ol className="bt-topics" style={{ marginTop: 16 }}>
              {QUESTIONS_FOR_THE_ROOM.map((q, i) => (
                <li key={q}>
                  <span className="bt-topics__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
                  {q}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      {/* ══ Recap ═════════════════════════════════════════════════════════ */}
      <Recap
        title="Cost, value, revenue — on one page."
        points={[
          ['A business model is how an idea creates value.', 'Broad enough to cover a company, a class project, or a business idea you just invented.'],
          ['The canvas puts cost on the left, revenue on the right.', 'Value Proposition sits in the middle, because everything else on the page exists to support it.'],
          ['Filling one in together, fast, surfaces disagreements a slide deck would hide.', 'Say the idea out loud before anyone writes it down.'],
          ['A canvas is a draft, not a business plan.', 'The moment one block turns out to be wrong, the whole thing is meant to be redrawn.'],
        ]}
      />

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>One page beats a slide deck<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              If your group's canvas has a block you genuinely can't agree on, that's not a
              failure — that's the canvas doing its job. Bring the disagreement to the
              presentation rather than papering over it.
            </p>
            <p className="bt-signoff__name">
              Yasas Sri Wickramasinghe
              <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer">
                MBI800 lecturer <ExternalLink size={12} aria-hidden="true" />
              </a>
            </p>
            <p className="bt-note" style={{ marginTop: 20 }}>
              The Business Model Canvas concept originates with Alexander Osterwalder. The canvas
              layout used on this page is adapted from "Business Model &amp; Idea Canvasses" (MaRS
              Discovery District / Ontario Network of Entrepreneurs), licensed under Creative
              Commons Attribution–ShareAlike 4.0 International. The full chapter, with an Idea
              Canvas variant for non-commercial projects, is in{' '}
              <a href={`${BASE}#/study-packs`}>the written study pack</a>.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
