import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Reveal, SaveAsPdf, SectionHead } from '../blend';
import ChartChoice from './analytics/ChartChoice';
import { ANALYTICS_NOTES } from '../../content/notes/mbi806bAnalytics';

// ─── MBI806B: Business Data Analytics with AI and ML ──────────────────────
// A public, ungated course intro page in Blended Teaching Content's
// course-page design system, Blend (src/components/blend/README.md),
// running on MBI806B's teal through the `analytics` accent set by the shell.
//
// Everything below is drawn from the actual course material and the official
// MBI806B course descriptor. The four learning-style explanations partway
// down are standard, general definitions written in my own words to keep
// them beginner-friendly, not quotes from the slides.
//
// This page intentionally does not map any content to "today", a session
// number or a calendar day, since when someone reads it does not line up
// with when a class actually runs.

const BASE = import.meta.env.BASE_URL;

const INDICATIVE_CONTENT = [
  'Business decision-making with AI and ML',
  'Data visualisation for business communication',
  'Advanced data analysis with AI and ML',
  'Risk management in AI/ML applications',
  'Addressing data privacy and security risks in business analytics',
  'Decision-making frameworks',
  'Advanced visualisation techniques',
  'Integrating findings and visualisations into decisions',
  'Industry-standard business analytics tools',
  'Advanced data analysis and predictive modelling',
  'Ethical considerations in business analytics',
  'Future trends in business data analytics',
];

// Verbatim from the MBI806B course descriptor.
const LEARNING_OUTCOMES = [
  { n: 'LO1', short: 'Decide with AI and ML', body: 'Evaluate advanced business data analytics techniques, including AI and ML algorithms, to make informed decisions within a business organization.' },
  { n: 'LO2', short: 'Use industry tools', body: 'Apply industry-standard business analytics tools to improve the efficiency and effectiveness of decision-making processes in a business context.' },
  { n: 'LO3', short: 'Visualise for an audience', body: 'Assess and apply different data visualization techniques to convey specific types of business information for an organization.' },
  { n: 'LO4', short: 'Judge it ethically', body: 'Critically evaluate business analytics practices from an ethical and data privacy perspective within a business context.' },
];

const COURSE_PATH = [
  { code: 'MBI801', label: 'Pre-requisite' },
  { code: 'MBI805B', label: 'Co-requisite, same trimester' },
  { code: 'MBI806B', label: 'You are here' },
  { code: 'MBI807B', label: 'Business Intelligence and Data Warehousing' },
];

const DECISION_STEPS = [
  { title: 'Define the problem', body: 'Say clearly what the issue or opportunity is, and understand its context. Most bad decisions are answers to the wrong question.' },
  { title: 'Gather information', body: 'Work out what data you need, then go and get it. Not everything easy to collect is worth collecting.' },
  { title: 'Generate alternatives', body: 'Come up with more than one option, including ones that aren’t obvious. A choice between one option isn’t a choice.' },
  { title: 'Evaluate alternatives', body: 'Weigh up each option’s risk, cost and likely outcome. This is where the analysis earns its keep.' },
  { title: 'Choose one', body: 'Pick the option that fits your goals and is achievable with what you have.' },
  { title: 'Implement it', body: 'Turn the choice into actions, each with someone responsible and a date attached.' },
  { title: 'Review and learn', body: 'Check what happened and be honest about what you’d do differently. Most people skip this one.' },
];

const SPOT_THE_AI = [
  { prompt: 'A streaming app queues up your next show before you ask.', reveal: 'Recommendation system. It learned your taste from what you already watched. Nobody typed in rules for “things you’ll like”.' },
  { prompt: 'Your bank texts you about a payment that “doesn’t look like you.”', reveal: 'Fraud detection. It compares this transaction against your normal pattern and flags what doesn’t fit.' },
  { prompt: 'A map app tells you traffic will clear in 12 minutes.', reveal: 'Predictive analysis. It has seen this road at this time often enough to forecast what usually happens.' },
  { prompt: 'You get a useful answer from a chatbot at 2am.', reveal: 'Natural language processing, handling a routine question so nobody has to be awake to answer it.' },
  { prompt: 'A delivery app already knows roughly when your order will arrive.', reveal: 'The same forecasting used in supply chains, predicting demand and timing from patterns in past deliveries.' },
  { prompt: 'Your photos app already knows who is in the photo.', reveal: 'Machine learning trained on labelled examples. Enough tagged photos and it works out how to recognise faces.' },
];

const LEARNING_STYLES: [string, string][] = [
  ['Supervised learning', 'You give it labelled examples — emails already marked spam or not spam — and it learns the pattern between them.'],
  ['Unsupervised learning', 'No labels at all. It finds structure on its own, like grouping customers into segments nobody defined in advance.'],
  ['Semi-supervised learning', 'A small batch of labelled examples plus a much larger pile of unlabelled ones. Useful when labelling everything by hand is too expensive.'],
  ['Reinforcement learning', 'It learns by trial and error, taking a reward or a penalty for each action and adjusting to earn more reward over time.'],
];

const DATA_SCIENCE_STEPS: [string, string][] = [
  ['Gather data', 'From internal systems, public sources, or third parties.'],
  ['Clean and structure it', 'Make sure it’s usable, complete and consistent, before you trust it.'],
  ['Model and analyse it', 'Use statistics and machine learning to explore patterns and test ideas.'],
  ['Interpret the results', 'Communicate what you found clearly enough that someone can act on it.'],
];

const APPLICATIONS = [
  { title: 'Customer experience', body: 'Chatbots and virtual assistants answer routine questions any time of day. Machine learning looks at what a customer has done before to recommend what they might want next.' },
  { title: 'Operational efficiency', body: 'Repetitive tasks like data entry get automated. Machine learning can predict when a machine is about to break down, before it actually does.' },
  { title: 'Data-driven decisions', body: 'Large volumes of business data get searched for patterns a person would never spot manually, then used to forecast what happens next.' },
  { title: 'Fraud and security', body: 'Banks and finance systems watch transaction patterns for anything unusual, and the system keeps getting better at spotting it as it sees more data.' },
  { title: 'Supply chains', body: 'Inventory levels, demand and delivery routes all get optimised, so a business can react faster and spend less doing it.' },
];

const AI_DECISION_ROLES = [
  { title: 'Predictive analysis', body: 'AI studies large datasets for patterns a person would take far too long to find, and forecasts what customers or markets are likely to do next.' },
  { title: 'Recommendation systems', body: 'The same idea that picks your next show or your next product suggestion, redirected at business decisions instead.' },
  { title: 'Decision support systems', body: 'In fields like finance, healthcare and logistics, AI surfaces the relevant data at the moment someone needs to decide something important.' },
];

const BENEFITS: [string, string][] = [
  ['Increased efficiency', 'Automating routine work saves time and money.'],
  ['Better customer experience', 'Personalised, faster support keeps people satisfied and loyal.'],
  ['Better insights', 'You understand your own operations and customers more deeply.'],
  ['A competitive edge', 'Businesses that adopt early tend to out-innovate the ones that wait.'],
  ['It scales', 'The same tools keep working as the business and its data grow.'],
];

const POWERBI_PARTS: [string, string][] = [
  ['Power BI Desktop', 'A free application for building and designing reports. Windows only.'],
  ['Power BI Service', 'The online side, at app.powerbi.com, for publishing, sharing and viewing reports in a browser.'],
  ['Power BI mobile', 'For checking your reports and dashboards on the go.'],
];

const HELLO_WORLD: [string, string][] = [
  ['Go to My Workspace', 'In the browser at app.powerbi.com. In Power BI Desktop, start a new report from the Home tab instead.'],
  ['Choose New, then Semantic model', 'A semantic model is Power BI’s name for the data a report sits on. Older guides call the same thing a dataset.'],
  ['Pick “Paste or manually enter data”', 'Rather than connecting to a real source. The Power BI Desktop equivalent is the Enter data button.'],
  ['Type a small table', 'Two columns: Item and Sales. Three rows: Coffee, 120; Tea, 90; Juice, 60.'],
  ['Load it, then create a report', 'Your table now exists as a semantic model. Choose Create report next to it and the editor opens.'],
  ['Add a bar chart and fill the wells', 'Click the bar chart icon in the Visualizations pane, then put Item on the axis and Sales on the values.'],
];

/** The seven-step framework, walked one step at a time. */
function DecisionWalk() {
  const [active, setActive] = useState(0);
  const step = DECISION_STEPS[active];

  return (
    <div className="bt-walk">
      <ol className="bt-walk__rail">
        {DECISION_STEPS.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              className={`bt-walk__node${i === active ? ' bt-walk__node--on' : ''}${i < active ? ' bt-walk__node--done' : ''}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
            >
              <span className="bt-walk__num bt-tnum">{i + 1}</span>
              <span className="bt-walk__label">{s.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="bt-walk__panel">
        <p className="bt-eyebrow">Step {active + 1} of {DECISION_STEPS.length}</p>
        <h3>{step.title}</h3>
        <p className="bt-walk__body">{step.body}</p>
        <div className="bt-walk__nav">
          <button
            type="button"
            className="bt-btn bt-btn--tertiary bt-btn--sm"
            disabled={active === 0}
            onClick={() => setActive(a => Math.max(0, a - 1))}
          >
            Back
          </button>
          <button
            type="button"
            className="bt-btn bt-btn--sm"
            disabled={active === DECISION_STEPS.length - 1}
            onClick={() => setActive(a => Math.min(DECISION_STEPS.length - 1, a + 1))}
          >
            Next step
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Tap to turn the everyday example over and see which technique it is. */
function SpotTheAICard({ prompt, reveal }: { prompt: string; reveal: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className={`bt-flip${flipped ? ' bt-flip--on' : ''}`}
      aria-pressed={flipped}
      onClick={() => setFlipped(f => !f)}
    >
      <span className="bt-flip__kicker">{flipped ? 'That’s AI because' : 'Tap to check'}</span>
      <span className="bt-flip__body">{flipped ? reveal : prompt}</span>
    </button>
  );
}

export default function IntroToBusinessAnalyticsLesson() {
  const [seen, setSeen] = useState(0);

  return (
    <div>
      {/* ══ How a decision actually gets made ════════════════════════════ */}
      <section id="decisions" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Decision-making frameworks"
            title="How a decision gets made"
            aside="A framework is a structured way of getting from a problem to a choice you can defend. Seven steps, and AI doesn’t enter until step four."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <DecisionWalk />
        </Reveal>
      </section>

      {/* ══ AI in my life ════════════════════════════════════════════════ */}
      <section id="spot" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="AI in my life"
            title="AI you already use"
            aside="We open the course with this. Try a few, then bring one of your own to class — that’s the one we discuss."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-flipgrid" onClick={() => setSeen(s => Math.min(SPOT_THE_AI.length, s + 1))}>
            {SPOT_THE_AI.map(item => (
              <SpotTheAICard key={item.prompt} prompt={item.prompt} reveal={item.reveal} />
            ))}
          </div>
          <p className="bt-note">
            {seen >= SPOT_THE_AI.length
              ? 'Six different techniques: recommendation, fraud detection, forecasting, language, demand prediction, image recognition. None of them were programmed rule by rule.'
              : 'None of these were programmed rule by rule. Each learned its behaviour from examples.'}
          </p>
        </Reveal>
      </section>

      {/* ══ What this course is ══════════════════════════════════════════ */}
      <section id="course" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="What this course is"
            title="Turning data into a decision"
            aside="15 credits at Level 8. No coding, statistics or prior AI experience assumed."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              MBI806B builds on MBI805B, which you take alongside it, and needs MBI801 underneath. 150 learning
              hours: 36 in class, 114 on your own. You’ll pull insight out of business data using AI and machine
              learning, turn it into a visual that communicates something, and use that to make a decision —
              including on ethical and privacy grounds.
            </p>
          </div>

          <div className="bt-path">
            {COURSE_PATH.map(step => {
              const here = step.code === 'MBI806B';
              return (
                <div key={step.code} className={`bt-path__step${here ? ' bt-path__step--here' : ''}`}>
                  <span className="bt-path__code">{step.code}</span>
                  <span className="bt-path__label">{step.label}</span>
                </div>
              );
            })}
          </div>

          <div className="bt-stats">
            <div><b className="bt-tnum">15</b><span>Credits, Level 8</span></div>
            <div><b className="bt-tnum">150</b><span>Learning hours: 36 in class, 114 yours</span></div>
            <div><b className="bt-tnum">12</b><span>Topics across the whole course</span></div>
            <div><b className="bt-tnum">4</b><span>Learning outcomes you are assessed against</span></div>
          </div>
        </Reveal>
      </section>

      {/* ══ Learning outcomes ════════════════════════════════════════════ */}
      <section id="outcomes" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="By the end of the course"
            title="Learning outcomes"
            aside="Word for word from the course descriptor. Everything you’re assessed on maps back to one of these four."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-outcomes">
            {LEARNING_OUTCOMES.map(lo => (
              <div key={lo.n} className="bt-outcome">
                <div className="bt-outcome__head">
                  <span className="bt-outcome__n">{lo.n}</span>
                  <h3>{lo.short}</h3>
                </div>
                <p>{lo.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ Preview ══════════════════════════════════════════════════════ */}
      <section id="preview" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="A small preview"
            title="Some of what this covers"
            aside="From the course material, in the order it’s taught. More than fits on one page."
          />
        </Reveal>

        <div className="bt-preview">
          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">01</span>
              <div>
                <h3>What AI is</h3>
                <p className="bt-prose">
                  A definition that doesn’t need a computer science degree: if you’re dealing with a machine, by
                  typing or talking, and it feels close enough to talking to a person that you can’t easily tell,
                  that machine is behaving intelligently. The goal isn’t an all-powerful machine. It’s systems
                  that behave in a human-like way, by communicating with us or, in robotics, by physically doing
                  something.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">02</span>
              <div>
                <h3>What machine learning is</h3>
                <p className="bt-prose">
                  A program that learns to behave a certain way without anyone programming every rule, sometimes
                  in ways its own creator didn’t predict. Three things make that work: data the program is given,
                  a way of measuring how wrong it currently is, and a feedback loop that uses the error to improve
                  next time. Nobody writes “if this, then that” — it works it out from examples.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">03</span>
              <div>
                <h3>How the two relate</h3>
                <p className="bt-prose">
                  Machine learning is one way of building AI: train a model on data until it can do a task.
                  Every ML system is AI. Not every AI system uses ML.
                </p>
                <figure className="bt-figure">
                  <div className="bt-figure__frame">
                    <svg viewBox="0 0 360 200" width="100%" style={{ maxWidth: 380, display: 'block', margin: '0 auto' }} role="img" aria-label="Machine learning sits entirely inside artificial intelligence">
                      <ellipse cx="180" cy="100" rx="172" ry="92" fill="var(--accent-50)" stroke="var(--accent-200)" strokeWidth="2" />
                      <ellipse cx="180" cy="118" rx="96" ry="58" fill="var(--paper-0)" stroke="var(--accent-500)" strokeWidth="2" />
                      <text x="180" y="34" textAnchor="middle" fill="var(--accent-700)" fontSize="12" fontWeight="700" letterSpacing="1.6" fontFamily="var(--font-body)">ARTIFICIAL INTELLIGENCE</text>
                      <text x="180" y="115" textAnchor="middle" fill="var(--accent-600)" fontSize="13" fontWeight="700" letterSpacing="1.2" fontFamily="var(--font-body)">MACHINE</text>
                      <text x="180" y="134" textAnchor="middle" fill="var(--accent-600)" fontSize="13" fontWeight="700" letterSpacing="1.2" fontFamily="var(--font-body)">LEARNING</text>
                    </svg>
                  </div>
                  <figcaption>All ML is AI. Not all AI is ML.</figcaption>
                </figure>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">04</span>
              <div>
                <h3>Where data science fits</h3>
                <p className="bt-prose">
                  The broader discipline: statistics plus computer science, applied to pulling meaning out of
                  data. Four steps, whatever the question.
                </p>
                <ol className="bt-flow">
                  {DATA_SCIENCE_STEPS.map(([title, body], i) => (
                    <li key={title}>
                      <span className="bt-flow__n bt-tnum">{i + 1}</span>
                      <div>
                        <h4>{title}</h4>
                        <p>{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">05</span>
              <div>
                <h3>Four ways a machine learns</h3>
                <p className="bt-prose">
                  These four come up constantly, so get them straight early.
                </p>
                <div className="bt-pairgrid">
                  {LEARNING_STYLES.map(([title, body]) => (
                    <div key={title} className="bt-card">
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">06</span>
              <div>
                <h3>Where this shows up in a business</h3>
                <p className="bt-prose">
                  Five areas, across almost every industry.
                </p>
                <div className="bt-rows">
                  {APPLICATIONS.map(a => (
                    <div key={a.title}>
                      <h4>{a.title}</h4>
                      <p>{a.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">07</span>
              <div>
                <h3>AI back in the decision</h3>
                <p className="bt-prose">
                  Data-driven decision-making means using analysis to find patterns instead of relying on gut
                  feeling. The human still decides. They just decide with better information.
                </p>
                <div className="bt-rows">
                  {AI_DECISION_ROLES.map(r => (
                    <div key={r.title}>
                      <h4>{r.title}</h4>
                      <p>{r.body}</p>
                    </div>
                  ))}
                </div>
                <div className="bt-caution">
                  <p className="bt-eyebrow">A caveat</p>
                  <p>
                    None of this is automatically safe to trust. The data has to be accurate, and someone still
                    has to interpret what the algorithm says. As AI takes a bigger part in decisions affecting
                    real people, bias, transparency and accountability matter. LO4 assesses exactly this.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Choosing a chart (LO3) ═══════════════════════════════════════ */}
      <section id="charts" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="LO3 · Visualisation"
            title="Which chart answers which question"
            aside="One cafe’s year, five ways of drawing it. Pick a question and a chart, and see whether that pairing answers it, works but slowly, or quietly misleads."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ChartChoice />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-note" style={{ marginTop: 20 }}>
            No chart is good or bad on its own, only good or bad for a question. That’s most of LO3, and it’s
            what gets marked: not whether the chart is pretty, but whether it answers what you claimed.
          </p>
        </Reveal>
      </section>

      {/* ══ Indicative content ═══════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Across the whole course"
            title="The full topic list"
            aside="The indicative content from the descriptor. Twelve topics, building on each other."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-topics">
            {INDICATIVE_CONTENT.map((item, i) => (
              <li key={item}>
                <span className="bt-topics__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ══ Power BI ═════════════════════════════════════════════════════ */}
      <section id="setup" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Our first tool"
            title="Setting up Power BI"
            stop="."
            aside="A business intelligence tool. You point it at your data, build reports out of it, and share those with whoever needs them."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-pairgrid bt-pairgrid--three">
            {POWERBI_PARTS.map(([title, body]) => (
              <div key={title} className="bt-card">
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>

          <div className="bt-caution" style={{ marginTop: 26 }}>
            <p className="bt-eyebrow">Mac, Windows, or a laptop you cannot install on</p>
            <p>
              Everybody starts in the browser at app.powerbi.com. It works the same on macOS as on Windows and
              needs nothing installed. Power BI Desktop is a Windows-only addition for later in the course.
              There’s a full setup guide on its own page.
            </p>
          </div>

          <a className="bt-btn" href={`${BASE}#/power-bi-setup`} style={{ marginTop: 22, textDecoration: 'none' }}>
            Open the Power BI setup guide
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </a>

          <div className="bt-tryit">
            <p className="bt-eyebrow">Try it yourself</p>
            <h3>A hello world for Power BI<span className="bt-stop">.</span></h3>
            <p className="bt-tryit__lead">
              No data source needed. Type in three rows by hand and build one chart from them. Works in the
              browser and in Power BI Desktop.
            </p>
            <ol className="bt-flow bt-flow--tight">
              {HELLO_WORLD.map(([title, body], i) => (
                <li key={title}>
                  <span className="bt-flow__n bt-tnum">{i + 1}</span>
                  <div><h4>{title}</h4><p>{body}</p></div>
                </li>
              ))}
            </ol>
            <p className="bt-note">
              Three rows of made-up data and one chart. Everything later is the same move with real data. The
              setup guide has a practice version you can click through first.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Why it's worth it, and how to arrive ═════════════════════════ */}
      <section id="prepared" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before class"
            title="Why bother, and what to bring"
            aside="Nothing here needs buying. Mainly: turn up with a laptop."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-twocol">
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">Why it’s worth learning</p>
              <ol className="bt-track bt-track--compact">
                {BENEFITS.map(([title, body]) => (
                  <li key={title} className="bt-trackrow bt-trackrow--plain">
                    <div className="bt-trackrow__body">
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">Come prepared</p>
              <ul className="bt-bring">
                <li>
                  <h4>Bring a laptop</h4>
                  <p>With Power BI open in a browser if you can. The setup guide covers it on any operating system. If not, we’ll sort it out in class.</p>
                </li>
                <li>
                  <h4>No prior experience needed</h4>
                  <p>No coding, statistics or AI background assumed. Never opened a data tool? That’s the expected starting point.</p>
                </li>
                <li>
                  <h4>Bring one example</h4>
                  <p>One place you’ve noticed AI in your own life recently. We use these in the group discussion.</p>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <SaveAsPdf doc={ANALYTICS_NOTES} />

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>See you in class<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              None of the above needed a maths background, and neither does the course. If the Power BI setup
              gives you trouble, sort it out before the first class or bring it with you. Either is fine.
            </p>
            <p className="bt-signoff__name">
              Yasas Sri Wickramasinghe
              <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer">
                MBI806B lecturer <ExternalLink size={12} aria-hidden="true" />
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
