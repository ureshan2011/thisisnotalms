import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import CourseSection from './CourseSection';
import Reveal from './Reveal';

// ─── MBI806B, Session 1: Business Decision-Making with AI and ML ──────────
// A public, ungated course page, built the same way as /intro-to-dbms: real
// content, plain language, no invented material. Everything below is drawn
// from the actual Session 1 slides (Week 1, Business Decision-Making with AI
// and ML) and the official MBI806B course descriptor. The four
// learning-style explanations partway down the page are standard, general
// definitions written in my own words to keep them beginner-friendly, not
// quotes from the slides. This page intentionally does not map any content
// to "today" or a specific calendar day, since when someone reads it does
// not line up with when a session actually runs.

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
  { n: 'LO1', body: 'Evaluate advanced business data analytics techniques, including AI and ML algorithms, to make informed decisions within a business organization.' },
  { n: 'LO2', body: 'Apply industry-standard business analytics tools to improve the efficiency and effectiveness of decision-making processes in a business context.' },
  { n: 'LO3', body: 'Assess and apply different data visualization techniques to convey specific types of business information for an organization.' },
  { n: 'LO4', body: 'Critically evaluate business analytics practices from an ethical and data privacy perspective within a business context.' },
];

const COURSE_PATH = [
  { code: 'MBI801', label: 'Pre-requisite' },
  { code: 'MBI805B', label: 'Co-requisite, this trimester' },
  { code: 'MBI806B', label: 'You are here' },
  { code: 'MBI807B', label: 'Business Intelligence and Data Warehousing' },
];

function CoursePath() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-stretch gap-0">
      {COURSE_PATH.map((step, i) => {
        const active = step.code === 'MBI806B';
        return (
          <div key={step.code} className="flex sm:flex-1 items-center">
            <div
              className="w-full p-4 border transition-all duration-300 hover:shadow-[0_8px_20px_-12px_rgba(15,118,110,0.3)] hover:-translate-y-0.5"
              style={{
                borderColor: active ? '#0f766e' : 'rgba(0,0,0,0.12)',
                background: active ? '#f0fdfa' : '#fff',
              }}
            >
              <p className="text-[13.5px] font-semibold" style={{ color: active ? '#0f766e' : '#111827' }}>{step.code}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-[#6b7280]">{step.label}</p>
            </div>
            {i < COURSE_PATH.length - 1 && (
              <div className="hidden sm:flex items-center justify-center flex-none w-8 text-[#c4c4c9]">→</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const APPLICATIONS = [
  { title: 'Customer experience', body: 'Chatbots and virtual assistants answer routine questions any time of day. Machine learning looks at what a customer has done before to recommend what they might want next.' },
  { title: 'Operational efficiency', body: 'Repetitive tasks like data entry get automated. Machine learning can predict when a machine is about to break down, before it actually does.' },
  { title: 'Data-driven decisions', body: 'Large volumes of business data get searched for patterns a person would never spot manually, then used to forecast what happens next.' },
  { title: 'Fraud and security', body: 'Banks and finance systems watch transaction patterns for anything unusual, and the system keeps getting better at spotting it as it sees more data.' },
  { title: 'Supply chains', body: 'Inventory levels, demand, and delivery routes all get optimised so a business can react faster and spend less doing it.' },
];

const BENEFITS = [
  ['Increased efficiency', 'Automating routine work saves time and money.'],
  ['Better customer experience', 'Personalised, faster support keeps people satisfied and loyal.'],
  ['Better insights', 'You understand your own operations and customers more deeply.'],
  ['A real advantage', 'Businesses that adopt this early tend to out-innovate the ones that wait.'],
  ['It scales', 'The same tools keep working as the business, and its data, grow.'],
];

const DECISION_STEPS = [
  { title: 'Define the problem', body: 'Say clearly what the issue or opportunity actually is, and understand its context.' },
  { title: 'Gather information', body: 'Work out what data and facts you actually need, then go get them.' },
  { title: 'Generate alternatives', body: 'Brainstorm more than one option, including ones that are not immediately obvious.' },
  { title: 'Evaluate alternatives', body: 'Weigh up each option’s risk, cost and likely outcome.' },
  { title: 'Choose one', body: 'Pick the option that best fits your goals and is actually achievable.' },
  { title: 'Implement it', body: 'Turn the choice into real actions, with someone responsible for each one.' },
  { title: 'Review and learn', body: 'Check what actually happened, and be honest about what you would do differently.' },
];

function DecisionFrameworkExplorer({ items }: { items: { title: string; body: string }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative">
        <div className="absolute left-0 right-0 top-4 h-px bg-black/[0.1]" />
        <div className="relative flex justify-between">
          {items.map((step, i) => (
            <button
              key={step.title}
              type="button"
              onClick={() => setActive(i)}
              className="flex flex-col items-center gap-2 px-1"
              aria-label={step.title}
            >
              <span
                className="flex-none w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors"
                style={{
                  background: i === active ? '#0f766e' : '#fff',
                  color: i === active ? '#fff' : '#9ca3af',
                  border: `2px solid ${i === active ? '#0f766e' : 'rgba(0,0,0,0.15)'}`,
                }}
              >
                {i + 1}
              </span>
              <span
                className="hidden sm:block text-[10.5px] font-medium text-center leading-tight max-w-[64px]"
                style={{ color: i === active ? '#0f766e' : '#9ca3af' }}
              >
                {step.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 p-5 border" style={{ borderColor: '#0f766e', background: '#f0fdfa' }}>
        <p className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#0f766e' }}>
          Step {active + 1} of {items.length}
        </p>
        <p className="mt-1.5 text-[16px] font-semibold text-[#111827]">{items[active].title}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-[#4b5563]">{items[active].body}</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setActive(a => Math.max(0, a - 1))}
            disabled={active === 0}
            className="text-[12.5px] font-medium px-3 py-1.5 border disabled:opacity-40"
            style={{ borderColor: '#0f766e', color: '#0f766e' }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setActive(a => Math.min(items.length - 1, a + 1))}
            disabled={active === items.length - 1}
            className="text-[12.5px] font-medium px-3 py-1.5 disabled:opacity-40"
            style={{ background: '#0f766e', color: '#fff' }}
          >
            Next step
          </button>
        </div>
      </div>
    </div>
  );
}

const AI_DECISION_ROLES = [
  { title: 'Predictive analysis', body: 'AI studies large datasets for patterns a person would take far too long to find, and forecasts what customers or markets are likely to do next.' },
  { title: 'Recommendation systems', body: 'The same idea that picks your next show or your next product suggestion, redirected at business decisions instead.' },
  { title: 'Decision support systems', body: 'In fields like finance, healthcare and logistics, AI surfaces the relevant data at the moment someone needs to decide something important.' },
];

const SPOT_THE_AI = [
  { prompt: 'A streaming app queues up your next show before you ask.', reveal: 'Recommendation system. It learned your taste from what you already watched, no one typed in rules for "things you’ll like."' },
  { prompt: 'Your bank texts you about a payment that "doesn’t look like you."', reveal: 'Fraud detection. It compares this transaction to your normal pattern and flags what doesn’t fit.' },
  { prompt: 'A map app tells you traffic will clear in 12 minutes.', reveal: 'Predictive analysis. It has seen this road, at this time, enough times before to forecast what usually happens next.' },
  { prompt: 'You get a useful answer from a chatbot at 2am.', reveal: 'Natural language processing, handling a routine question so a human doesn’t have to be awake to answer it.' },
  { prompt: 'A delivery app already knows roughly when your order will arrive.', reveal: 'The same kind of forecasting used in supply chains, predicting demand and timing from patterns in past deliveries.' },
  { prompt: 'Your photos app already knows who is in the photo.', reveal: 'Machine learning trained on labelled examples: enough tagged photos that it learned to recognise faces itself.' },
];

function SpotTheAICard({ prompt, reveal }: { prompt: string; reveal: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped(f => !f)}
      className="text-left p-4 border transition-all duration-300 w-full h-full hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgba(15,23,42,0.35)]"
      style={{ background: flipped ? '#0f172a' : '#fff', borderColor: flipped ? '#0f172a' : 'rgba(0,0,0,0.15)' }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: flipped ? '#5eead4' : '#0d9488' }}>
        {flipped ? 'That’s AI because' : 'Spot the AI, tap to check'}
      </p>
      <p className="mt-2 text-[14px] leading-snug" style={{ color: flipped ? '#e5e7eb' : '#111827' }}>
        {flipped ? reveal : prompt}
      </p>
    </button>
  );
}

function NumberedFlow({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="relative">
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-black/[0.08]" />
      <div className="space-y-5">
        {items.map((step, i) => (
          <div key={step.title} className="relative flex items-start gap-4">
            <span
              className="relative flex-none w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
              style={{ background: '#0f766e', color: '#fff', zIndex: 1 }}
            >
              {i + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[14.5px] font-semibold text-[#111827]">{step.title}</p>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#6b7280]">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepList({ items }: { items: { title: string; body: string; note?: string }[] }) {
  return (
    <ol className="space-y-4">
      {items.map((step, i) => (
        <li key={step.title} className="flex gap-3">
          <span
            className="flex-none w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
            style={{ background: '#111827', color: '#fff' }}
          >
            {i + 1}
          </span>
          <div>
            <p className="text-[14px] font-semibold text-[#111827]">{step.title}</p>
            <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#6b7280]">{step.body}</p>
            {step.note && <p className="mt-1 text-[12.5px] leading-relaxed text-[#9ca3af] italic">{step.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function IntroToBusinessAnalyticsLesson() {
  return (
    <div>
      {/* ── What MBI806B covers ── */}
      <section id="course" className="py-14 scroll-mt-16">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8e8e93]">What this course is</p>
          <h2 className="mt-2 font-semibold tracking-[-0.01em] text-[#111827] text-[24px] sm:text-[28px]">
            Turning data into a decision.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] sm:text-[16px] leading-relaxed text-[#4b5563]">
            MBI806B is a 15 credit, Level 8 course. It builds on MBI805B, which you take alongside it, and it
            needs MBI801 as a foundation. It is 150 learning hours in total: 36 in class, 114 on your own. You
            will learn to pull insight out of business data using AI and ML, turn that insight into a visual
            that communicates something, and use it to make a decision, including on ethical and privacy
            grounds.
          </p>
          <div className="mt-6">
            <CoursePath />
          </div>
        </Reveal>
      </section>

      {/* ── Learning outcomes ── */}
      <CourseSection id="outcomes" eyebrow="By the end of the course" title="Four things you'll be able to do.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {LEARNING_OUTCOMES.map(lo => (
            <div key={lo.n}>
              <span className="inline-flex items-center justify-center h-6 px-2 text-[11px] font-bold" style={{ background: '#0f766e', color: '#fff' }}>
                {lo.n}
              </span>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[#374151]">{lo.body}</p>
            </div>
          ))}
        </div>
      </CourseSection>

      {/* ── Indicative content ── */}
      <CourseSection
        eyebrow="Across the whole course"
        title="What the course covers."
        lead="This is the real topic list for MBI806B."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
          {INDICATIVE_CONTENT.map((item, i) => (
            <div key={item} className="flex gap-3 py-1.5 border-b border-black/[0.06] text-[14px] text-[#374151]">
              <span className="text-[#9ca3af] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              {item}
            </div>
          ))}
        </div>
      </CourseSection>

      {/* ── Preview walkthrough ── */}
      <CourseSection
        id="preview"
        eyebrow="A small preview"
        title="Here is some of what this covers."
        lead="A few examples, pulled from the course material. There is more than fits on this page."
      >
        <div className="space-y-14">
          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>First, what actually is AI?</strong> Here is a definition that does not require a
              computer science degree to understand: if you are interacting with a machine, by typing or
              talking, and it feels enough like talking to a person that you cannot easily tell the
              difference, that machine is behaving intelligently. AI is not about building an all-powerful
              machine. It is about building systems that behave in a human-like way, either by
              communicating with us, or, in the case of robotics, by physically doing something in the
              world.
            </p>
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>And what is Machine Learning?</strong> ML is a computer program that learns to
              behave a certain way without a person explicitly programming every rule. It can even end up
              behaving in ways its own creator did not fully predict. That learning comes from three
              things working together: data the program is given, a way of measuring how wrong its current
              behaviour is, and a feedback loop that uses that error to improve next time. No human sits
              there writing "if this, then that." The machine works it out from examples.
            </p>
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>So are AI and ML the same thing?</strong> No. ML is one specific way of building AI:
              training a model on data until it can perform a task. Every machine learning system is a
              form of AI. Not every AI system uses machine learning.
            </p>
            <div className="my-6 flex justify-center">
              <div className="relative" style={{ width: 320, height: 200 }}>
                <div className="absolute inset-0 border-2 rounded-full flex items-start justify-center pt-4" style={{ borderColor: '#99f6e4' }}>
                  <span className="text-[12px] font-semibold" style={{ color: '#0f766e' }}>ARTIFICIAL INTELLIGENCE</span>
                </div>
                <div className="absolute rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#0f766e', background: '#f0fdfa', width: 180, height: 130, left: 70, top: 55 }}>
                  <span className="text-[12px] font-semibold text-center px-2" style={{ color: '#0f766e' }}>MACHINE<br />LEARNING</span>
                </div>
              </div>
            </div>
            <p className="text-[13px] text-[#8e8e93] text-center">A simple rule of thumb: all ML is AI, not all AI is ML.</p>
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>Where does Data Science fit in?</strong> Data science is the broader discipline that
              combines statistics and computer science to pull meaning out of data. It usually follows the
              same four steps, whatever the question:
            </p>
            <div className="mt-5">
              <NumberedFlow items={[
                { title: 'Gather data', body: 'From internal systems, public sources, or third parties.' },
                { title: 'Clean and structure it', body: 'Make sure it is usable, complete, and consistent, before you trust it.' },
                { title: 'Model and analyse it', body: 'Use statistics and machine learning to explore patterns and test ideas.' },
                { title: 'Interpret the results', body: 'Communicate what you found clearly enough that someone can actually act on it.' },
              ]} />
            </div>
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>There are also four different ways a machine can learn</strong>, and you will hear
              these terms constantly through the course.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Supervised learning', 'You give it labelled examples, like emails already marked spam or not spam, and it learns the pattern between them.'],
                ['Unsupervised learning', 'No labels at all. It finds structure on its own, like grouping customers into segments nobody defined in advance.'],
                ['Semi-supervised learning', 'A small batch of labelled examples plus a much larger pile of unlabelled ones, useful when labelling everything by hand is too expensive.'],
                ['Reinforcement learning', 'It learns by trial and error, getting a reward or a penalty for each action, and adjusting to earn more reward over time.'],
              ].map(([title, body]) => (
                <div key={title} className="p-4 border border-black/[0.1]">
                  <p className="text-[13.5px] font-semibold text-[#111827]">{title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#6b7280]">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>Where you'll actually see this in a business.</strong> These five areas come up
              constantly, across almost every industry.
            </p>
            <div className="mt-5 divide-y divide-black/[0.06]">
              {APPLICATIONS.map(a => (
                <div key={a.title} className="py-3.5">
                  <p className="text-[14px] font-semibold text-[#111827]">{a.title}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-[#6b7280]">{a.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>The ice-breaker: "AI in My Life."</strong> Before any of the theory, this course
              starts with a simple activity: noticing the AI you already use without thinking about it.
              Try a few of these yourself.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPOT_THE_AI.map(item => (
                <SpotTheAICard key={item.prompt} prompt={item.prompt} reveal={item.reveal} />
              ))}
            </div>
            <p className="mt-4 text-[13px] text-[#9ca3af]">
              In class, this becomes a group discussion: "Where do YOU see AI?" Come with your own
              example, not just these ones.
            </p>
          </div>
        </div>
      </CourseSection>

      {/* ── Decision-making frameworks ── */}
      <CourseSection
        id="decisions"
        eyebrow="A structured approach"
        title="How do we actually make a decision?"
        lead="Before any AI enters the picture, it helps to be clear about how decisions actually get made. A decision-making framework is a structured way to get from a problem to a choice you can stand behind. Click through the steps below."
      >
        <DecisionFrameworkExplorer items={DECISION_STEPS} />
      </CourseSection>

      {/* ── AI in decisions ── */}
      <CourseSection
        eyebrow="Then we bring AI back in"
        title="Where AI actually helps a decision."
        lead="Data-driven decision-making means using data analysis to find patterns and insight, instead of relying purely on gut feeling. It does not remove the human from the decision. It gives them better information to decide with."
      >
        <div className="divide-y divide-black/[0.06]">
          {AI_DECISION_ROLES.map(r => (
            <div key={r.title} className="py-3.5">
              <p className="text-[14px] font-semibold text-[#111827]">{r.title}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#6b7280]">{r.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 border-l-2" style={{ borderColor: '#0f766e' }}>
          <p className="text-[13.5px] leading-relaxed text-[#4b5563]">
            None of this is automatically safe to trust. The data has to actually be accurate. Someone
            still has to interpret what the algorithm says. As AI gets more involved in decisions that
            affect real people, bias, transparency and accountability need to be taken seriously. This
            course comes back to this properly later.
          </p>
        </div>
      </CourseSection>

      {/* ── Power BI setup ── */}
      <CourseSection
        id="setup"
        eyebrow="Our first tool"
        title="Setting up Power BI."
        lead="Power BI is a business intelligence tool. You connect it to your data, build reports and dashboards out of it, and share those with the people who need to see them."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ['Power BI Desktop', 'A free application for building and designing reports. Windows only.'],
            ['Power BI Service', 'The online side, at app.powerbi.com, for publishing, sharing, and viewing reports in a browser.'],
            ['Power BI mobile', 'For checking your reports and dashboards on the go.'],
          ].map(([title, body]) => (
            <div key={title} className="p-4 border border-black/[0.1]">
              <p className="text-[13.5px] font-semibold text-[#111827]">{title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#6b7280]">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-[#0f766e]">Windows</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#6b7280]">
              Power BI Desktop installs directly and is completely free.
            </p>
            <div className="mt-4">
              <StepList items={[
                { title: 'Open the Microsoft Store', body: 'Search for "Power BI Desktop" and click Get, or Install.' },
                { title: 'No Microsoft Store access?', body: 'Download the installer directly from Microsoft instead.', note: 'Link below.' },
                { title: 'Open Power BI Desktop', body: 'You can close the sign-in prompt and use it without an account for now.' },
              ]} />
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-[#0f766e]">macOS</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#6b7280]">
              Power BI Desktop only runs on Windows. There is no Mac version, so a Mac needs one of these
              instead.
            </p>
            <div className="mt-4">
              <StepList items={[
                { title: 'Use Power BI Service in a browser', body: 'Go to app.powerbi.com and sign in with a Microsoft account. This covers viewing and basic report building, free.' },
                { title: 'Or run Windows', body: 'Through Boot Camp or a virtual machine, then install Power BI Desktop as above.', note: 'Only needed for the full desktop feature set.' },
              ]} />
            </div>
          </div>
        </div>

        <ul className="mt-6 space-y-2 text-[14px] text-[#4b5563]">
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            <a href="https://www.microsoft.com/en-us/download/details.aspx?id=58494" target="_blank" rel="noreferrer" className="font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1">
              Power BI Desktop, direct download from Microsoft <ExternalLink size={11} />
            </a>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            <a href="https://app.powerbi.com" target="_blank" rel="noreferrer" className="font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1">
              Power BI Service, app.powerbi.com <ExternalLink size={11} />
            </a>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            <a href="https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started" target="_blank" rel="noreferrer" className="font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1">
              Getting started with Power BI Desktop, official Microsoft guide <ExternalLink size={11} />
            </a>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            <a href="https://www.linkedin.com/learning/power-bi-essential-training-2024/overview-power-bi-concepts" target="_blank" rel="noreferrer" className="font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1">
              Power BI Essential Training, LinkedIn Learning <ExternalLink size={11} />
            </a>
          </li>
        </ul>

        <div className="mt-10 p-5 border" style={{ borderColor: 'rgba(15,118,110,0.3)', background: '#f0fdfa' }}>
          <p className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: '#0f766e' }}>Try it yourself</p>
          <p className="mt-1.5 text-[15px] font-semibold text-[#111827]">A hello world for Power BI.</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#4b5563]">
            No data source needed. This builds one small chart from scratch, using Power BI's own "Enter
            Data" feature, in Power BI Desktop or the Service.
          </p>
          <div className="mt-4">
            <StepList items={[
              { title: 'Open a new report', body: 'In Desktop: Home tab. In the Service: Create, then New report.' },
              { title: 'Choose "Enter Data"', body: 'Instead of connecting to a real data source, this builds a tiny table by hand.' },
              { title: 'Type a small table', body: 'Two columns: Item and Sales. Three rows: Coffee, 120; Tea, 90; Juice, 60.' },
              { title: 'Click Load', body: 'Your table now exists inside the report as a data source, like any other.' },
              { title: 'Add a bar chart', body: 'In the Visualizations pane, click the bar chart icon to add an empty chart to the page.' },
              { title: 'Drag in your fields', body: 'Drag Item onto the axis, and Sales onto the values. The chart draws itself.' },
            ]} />
          </div>
          <p className="mt-4 text-[13px] text-[#9ca3af]">
            That's it. Three rows of made-up data and one chart. Everything later in the course is this
            same idea, with real data instead.
          </p>
        </div>
      </CourseSection>

      {/* ── Benefits ── */}
      <CourseSection eyebrow="Why this is worth learning" title="What this is actually good for.">
        <ul className="space-y-3 max-w-2xl">
          {BENEFITS.map(([title, body]) => (
            <li key={title} className="border-l-2 pl-4" style={{ borderColor: 'rgba(15,118,110,0.3)' }}>
              <p className="text-[14.5px] font-semibold text-[#111827]">{title}</p>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#6b7280]">{body}</p>
            </li>
          ))}
        </ul>
      </CourseSection>

      {/* ── Come prepared ── */}
      <CourseSection eyebrow="Before class" title="Come prepared.">
        <ul className="space-y-2.5 text-[14.5px] text-[#4b5563] max-w-2xl">
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            Bring a laptop. Power BI Desktop or Power BI Service, set up using the steps above, if you can.
            If not, that gets sorted out in class.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            No coding, statistics or prior AI experience is assumed. If you have never opened a data tool
            before, this course is for you.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            Think of one place you have noticed AI in your own life recently. It gets used in class.
          </li>
        </ul>
      </CourseSection>

      {/* ── Sign off ── */}
      <section className="border-t border-black/[0.08] py-14">
        <Reveal>
          <p className="text-[13px] font-medium text-[#6b7280] inline-flex items-center gap-1.5">
            Yasas Sri Wickramasinghe
            <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#0d9488] hover:underline">
              MBI806B lecturer <ExternalLink size={11} />
            </a>
          </p>
        </Reveal>
      </section>
    </div>
  );
}
