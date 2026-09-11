import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Reveal from './Reveal';

// ─── MBI806B: Business Data Analytics with AI and ML ──────────────────────
// A public, ungated course intro page in Blended Teaching Content's
// course-page theme (see src/styles/courseTheme.css), running on MBI806B's
// teal through the `.bt--analytics` accent variant set by the page shell.
//
// Everything below is drawn from the actual course material and the official
// MBI806B course descriptor. The four learning-style explanations partway
// down are standard, general definitions written in my own words to keep
// them beginner-friendly, not quotes from the slides.
//
// This page intentionally does not map any content to "today", a session
// number or a calendar day, since when someone reads it does not line up
// with when a class actually runs.

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
  { n: 'LO2', short: 'Use the real tools', body: 'Apply industry-standard business analytics tools to improve the efficiency and effectiveness of decision-making processes in a business context.' },
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
  { title: 'Define the problem', body: 'Say clearly what the issue or opportunity actually is, and understand its context. Most bad decisions are answers to the wrong question.' },
  { title: 'Gather information', body: 'Work out what data and facts you actually need, then go get them. Not everything that is easy to collect is worth collecting.' },
  { title: 'Generate alternatives', body: 'Brainstorm more than one option, including ones that are not immediately obvious. A choice between one option is not a choice.' },
  { title: 'Evaluate alternatives', body: 'Weigh up each option’s risk, cost and likely outcome. This is where the analysis earns its keep.' },
  { title: 'Choose one', body: 'Pick the option that best fits your goals and is actually achievable with what you have.' },
  { title: 'Implement it', body: 'Turn the choice into real actions, with someone responsible for each one and a date attached.' },
  { title: 'Review and learn', body: 'Check what actually happened, and be honest about what you would do differently. This step is the one people skip.' },
];

const SPOT_THE_AI = [
  { prompt: 'A streaming app queues up your next show before you ask.', reveal: 'Recommendation system. It learned your taste from what you already watched — nobody typed in rules for “things you’ll like.”' },
  { prompt: 'Your bank texts you about a payment that “doesn’t look like you.”', reveal: 'Fraud detection. It compares this transaction against your normal pattern and flags what does not fit.' },
  { prompt: 'A map app tells you traffic will clear in 12 minutes.', reveal: 'Predictive analysis. It has seen this road, at this time, often enough to forecast what usually happens next.' },
  { prompt: 'You get a useful answer from a chatbot at 2am.', reveal: 'Natural language processing, handling a routine question so a human does not have to be awake to answer it.' },
  { prompt: 'A delivery app already knows roughly when your order will arrive.', reveal: 'The same forecasting used in supply chains, predicting demand and timing from patterns in past deliveries.' },
  { prompt: 'Your photos app already knows who is in the photo.', reveal: 'Machine learning trained on labelled examples: enough tagged photos that it worked out how to recognise faces itself.' },
];

const LEARNING_STYLES: [string, string][] = [
  ['Supervised learning', 'You give it labelled examples — emails already marked spam or not spam — and it learns the pattern between them.'],
  ['Unsupervised learning', 'No labels at all. It finds structure on its own, like grouping customers into segments nobody defined in advance.'],
  ['Semi-supervised learning', 'A small batch of labelled examples plus a much larger pile of unlabelled ones. Useful when labelling everything by hand is too expensive.'],
  ['Reinforcement learning', 'It learns by trial and error, taking a reward or a penalty for each action and adjusting to earn more reward over time.'],
];

const DATA_SCIENCE_STEPS: [string, string][] = [
  ['Gather data', 'From internal systems, public sources, or third parties.'],
  ['Clean and structure it', 'Make sure it is usable, complete and consistent, before you trust it.'],
  ['Model and analyse it', 'Use statistics and machine learning to explore patterns and test ideas.'],
  ['Interpret the results', 'Communicate what you found clearly enough that someone can actually act on it.'],
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
  ['A real advantage', 'Businesses that adopt this early tend to out-innovate the ones that wait.'],
  ['It scales', 'The same tools keep working as the business, and its data, grow.'],
];

const POWERBI_PARTS: [string, string][] = [
  ['Power BI Desktop', 'A free application for building and designing reports. Windows only.'],
  ['Power BI Service', 'The online side, at app.powerbi.com, for publishing, sharing and viewing reports in a browser.'],
  ['Power BI mobile', 'For checking your reports and dashboards on the go.'],
];

const HELLO_WORLD: [string, string][] = [
  ['Open a new report', 'In Desktop: the Home tab. In the Service: Create, then New report.'],
  ['Choose “Enter Data”', 'Instead of connecting to a real data source, this builds a tiny table by hand.'],
  ['Type a small table', 'Two columns: Item and Sales. Three rows: Coffee, 120; Tea, 90; Juice, 60.'],
  ['Click Load', 'Your table now exists inside the report as a data source, like any other.'],
  ['Add a bar chart', 'In the Visualizations pane, click the bar chart icon to drop an empty chart on the page.'],
  ['Drag in your fields', 'Drag Item onto the axis and Sales onto the values. The chart draws itself.'],
];

const LINKS: [string, string][] = [
  ['https://www.microsoft.com/en-us/download/details.aspx?id=58494', 'Power BI Desktop, direct download from Microsoft'],
  ['https://app.powerbi.com', 'Power BI Service, app.powerbi.com'],
  ['https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started', 'Getting started with Power BI Desktop, official Microsoft guide'],
  ['https://www.linkedin.com/learning/power-bi-essential-training-2024/overview-power-bi-concepts', 'Power BI Essential Training, LinkedIn Learning'],
];

function SectionHead({ eyebrow, title, stop, aside }: { eyebrow: string; title: string; stop?: string; aside: string }) {
  return (
    <div className="bt-sechead">
      <div>
        <p className="bt-eyebrow">{eyebrow}</p>
        <h2>
          {title}
          {stop && <span className="bt-stop">{stop}</span>}
        </h2>
      </div>
      <p className="bt-aside">{aside}</p>
    </div>
  );
}

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
            {active === DECISION_STEPS.length - 1 ? 'That is the loop' : 'Next step'}
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
            eyebrow="A structured approach"
            title="How does a decision actually get made"
            stop="?"
            aside="Before any AI enters the picture, it helps to be clear about how decisions get made at all. A framework is just a structured way to get from a problem to a choice you can stand behind. Walk the seven steps."
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
            eyebrow="Before any of the theory"
            title="You already use AI. Probably six times today"
            stop="."
            aside="The course opens with a simple activity: noticing the AI you use without thinking about it. Try a few of these, then bring one of your own — that is the version we use in the group discussion."
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
              ? 'Six everyday things, six different techniques — recommendation, fraud detection, forecasting, language, demand prediction and image recognition. None of them were programmed rule by rule.'
              : 'None of these were programmed rule by rule. Each one learned its behaviour from examples, which is the whole idea behind machine learning.'}
          </p>
        </Reveal>
      </section>

      {/* ══ What this course is ══════════════════════════════════════════ */}
      <section id="course" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="What this course is"
            title="Turning data into a decision"
            stop="."
            aside="15 credits at Level 8. No coding, statistics or prior AI experience is assumed. If you have never opened a data tool before, this course was written for you."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              MBI806B builds on MBI805B, which you take alongside it, and needs MBI801 as a foundation. It is
              150 learning hours in total: 36 in class, 114 on your own. You will learn to pull insight out of
              business data using AI and machine learning, turn that insight into a visual that communicates
              something, and use it to make a decision — including on ethical and privacy grounds.
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
            title="Four things you'll be able to do"
            stop="."
            aside="Word for word from the MBI806B course descriptor. Everything you are assessed on maps back to one of these four."
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
            title="Here is some of what this covers"
            stop="."
            aside="A few examples pulled from the course material, in the order they are taught. There is a good deal more than fits on one page."
          />
        </Reveal>

        <div className="bt-preview">
          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">01</span>
              <div>
                <h3>First, what actually is AI?</h3>
                <p className="bt-prose">
                  Here is a definition that does not require a computer science degree. If you are interacting
                  with a machine, by typing or talking, and it feels enough like talking to a person that you
                  cannot easily tell the difference, that machine is behaving intelligently. AI is not about
                  building an all-powerful machine. It is about building systems that behave in a human-like
                  way — either by communicating with us, or, in robotics, by physically doing something in the
                  world.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">02</span>
              <div>
                <h3>And what is machine learning?</h3>
                <p className="bt-prose">
                  A computer program that learns to behave a certain way without a person explicitly
                  programming every rule. It can even end up behaving in ways its own creator did not fully
                  predict. That learning comes from three things working together: data the program is given,
                  a way of measuring how wrong its current behaviour is, and a feedback loop that uses that
                  error to improve next time. Nobody sits there writing “if this, then that.” The machine
                  works it out from examples.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">03</span>
              <div>
                <h3>So are AI and ML the same thing?</h3>
                <p className="bt-prose">
                  No. Machine learning is one specific way of building AI: training a model on data until it
                  can perform a task. Every machine learning system is a form of AI. Not every AI system uses
                  machine learning.
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
                  <figcaption>A rule of thumb worth keeping: all ML is AI, not all AI is ML.</figcaption>
                </figure>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">04</span>
              <div>
                <h3>Where does data science fit in?</h3>
                <p className="bt-prose">
                  Data science is the broader discipline that combines statistics and computer science to pull
                  meaning out of data. It follows the same four steps, whatever the question.
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
                <h3>There are four ways a machine can learn.</h3>
                <p className="bt-prose">
                  You will hear these four terms constantly through the course, so they are worth getting
                  straight early.
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
                <h3>Where you’ll actually see this in a business.</h3>
                <p className="bt-prose">
                  These five areas come up constantly, across almost every industry.
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
                <h3>Then we bring AI back into the decision.</h3>
                <p className="bt-prose">
                  Data-driven decision-making means using analysis to find patterns and insight instead of
                  relying purely on gut feeling. It does not remove the human from the decision. It gives them
                  better information to decide with.
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
                  <p className="bt-eyebrow">The part people skip</p>
                  <p>
                    None of this is automatically safe to trust. The data has to actually be accurate. Someone
                    still has to interpret what the algorithm says. As AI gets more involved in decisions that
                    affect real people, bias, transparency and accountability need to be taken seriously. The
                    course comes back to this properly, and LO4 assesses it.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Indicative content ═══════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Across the whole course"
            title="The full topic list"
            stop="."
            aside="The real indicative content for MBI806B, straight from the descriptor. Twelve topics, building on each other."
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
            aside="Power BI is a business intelligence tool. You connect it to your data, build reports and dashboards out of it, and share those with the people who need to see them."
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

          <div className="bt-platforms">
            <div>
              <p className="bt-eyebrow">Windows</p>
              <p className="bt-note">Power BI Desktop installs directly and is completely free.</p>
              <ol className="bt-flow bt-flow--tight">
                <li><span className="bt-flow__n bt-tnum">1</span><div><h4>Open the Microsoft Store</h4><p>Search for “Power BI Desktop” and click Get, or Install.</p></div></li>
                <li><span className="bt-flow__n bt-tnum">2</span><div><h4>No Microsoft Store access?</h4><p>Download the installer directly from Microsoft instead — the link is below.</p></div></li>
                <li><span className="bt-flow__n bt-tnum">3</span><div><h4>Open Power BI Desktop</h4><p>You can close the sign-in prompt and use it without an account for now.</p></div></li>
              </ol>
            </div>
            <div>
              <p className="bt-eyebrow">macOS</p>
              <p className="bt-note">Power BI Desktop only runs on Windows. There is no Mac version, so a Mac needs one of these instead.</p>
              <ol className="bt-flow bt-flow--tight">
                <li><span className="bt-flow__n bt-tnum">1</span><div><h4>Use Power BI Service in a browser</h4><p>Go to app.powerbi.com and sign in with a Microsoft account. That covers viewing and basic report building, free.</p></div></li>
                <li><span className="bt-flow__n bt-tnum">2</span><div><h4>Or run Windows</h4><p>Through Boot Camp or a virtual machine, then install Power BI Desktop as above. Only needed for the full desktop feature set.</p></div></li>
              </ol>
            </div>
          </div>

          <ul className="bt-links">
            {LINKS.map(([href, label]) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noreferrer">
                  {label} <ExternalLink size={12} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <div className="bt-tryit">
            <p className="bt-eyebrow">Try it yourself</p>
            <h3>A hello world for Power BI<span className="bt-stop">.</span></h3>
            <p className="bt-tryit__lead">
              No data source needed. This builds one small chart from scratch using Power BI’s own “Enter
              Data” feature — it is the same three rows as the chart at the top of this page.
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
              That is it. Three rows of made-up data and one chart. Everything later in the course is this same
              idea, with real data instead.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Why it's worth it, and how to arrive ═════════════════════════ */}
      <section id="prepared" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Worth learning, and worth arriving ready for"
            title="What this is good for, and what to bring"
            stop="."
            aside="Nothing on this list needs buying, and nothing needs prior experience. The first one matters most: turn up with a laptop."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-twocol">
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">Why this is worth learning</p>
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
                  <p>With Power BI Desktop or Power BI Service set up using the steps above, if you can. If not, that gets sorted out in class.</p>
                </li>
                <li>
                  <h4>Bring no prior experience</h4>
                  <p>No coding, statistics or AI background is assumed. If you have never opened a data tool before, this course is for you.</p>
                </li>
                <li>
                  <h4>Bring one example</h4>
                  <p>Think of one place you have noticed AI in your own life recently. It gets used in the group discussion.</p>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>See you in class<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              You have just walked a decision framework end to end, worked out which everyday systems are
              quietly running on machine learning, and seen exactly what Power BI asks of you. That is a
              genuine head start, and none of it needed a maths background.
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
