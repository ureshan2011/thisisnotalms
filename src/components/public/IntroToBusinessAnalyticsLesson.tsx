import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

// ─── MBI806B, Session 1: Business Decision-Making with AI and ML ──────────
// A public, ungated "Day 1" course page, built the same way as
// /intro-to-dbms: real content, plain language, no invented material.
// Everything below is drawn from the actual Session 1 slides (Week 1,
// Business Decision-Making with AI and ML) and the official MBI806B course
// descriptor. The four learning-style explanations near the middle of the
// page are standard, general definitions written in my own words to keep
// them beginner-friendly, not quotes from the slides.

function Section({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="border-t border-black/[0.08] py-14">
      {eyebrow && (
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8e8e93]">{eyebrow}</p>
      )}
      <h2 className={`font-semibold tracking-[-0.01em] text-[#111827] text-[24px] sm:text-[28px] ${eyebrow ? 'mt-2' : ''}`}>
        {title}
      </h2>
      {lead && <p className="mt-3 max-w-2xl text-[15px] sm:text-[16px] leading-relaxed text-[#4b5563]">{lead}</p>}
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}

const SESSION_FLOW = [
  { title: 'Introduction to AI and ML in business context', body: 'What these words actually mean, and why they matter to a business, not just to engineers.' },
  { title: 'Ice-breaking: "AI in My Life"', body: 'Before any theory, we talk about the AI you already use without thinking about it.' },
  { title: 'Break', body: '10 minutes.' },
  { title: 'Overview of decision-making frameworks', body: 'How people and organisations make decisions properly, step by step, before AI ever enters the picture.' },
  { title: 'Discussion: AI and ML use cases in business', body: 'Real examples, across different industries, of these ideas actually being used.' },
  { title: 'Hands-on: exploring Power BI', body: 'Our first look at the tool we will keep coming back to all trimester.' },
  { title: 'Wrap-up and Q&A', body: 'Whatever is still unclear, we sort out before you leave.' },
];

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

const LEARNING_OUTCOMES = [
  { n: 1, title: 'Evaluate, don’t just apply', body: 'Judge advanced business analytics techniques, including AI and ML algorithms, well enough to use them to inform a real business decision.' },
  { n: 2, title: 'Use the industry tools properly', body: 'Apply industry-standard business analytics tools to make decision-making genuinely more efficient and effective.' },
  { n: 3, title: 'Choose the right visual for the message', body: 'Assess and apply different data visualisation techniques to convey specific types of business information clearly.' },
  { n: 4, title: 'Think about it ethically', body: 'Critically evaluate business analytics practices from an ethical and data privacy perspective.' },
];

const APPLICATIONS = [
  { title: 'Customer experience', body: 'Chatbots and virtual assistants answer routine questions any time of day. Machine learning looks at what a customer has done before to recommend what they might want next.' },
  { title: 'Operational efficiency', body: 'Repetitive tasks like data entry get automated. Machine learning can predict when a machine is about to break down, before it actually does.' },
  { title: 'Data-driven decisions', body: 'Large volumes of business data get searched for patterns a person would never spot manually, then used to forecast what happens next.' },
  { title: 'Fraud and security', body: 'Banks and finance systems watch transaction patterns for anything unusual, and the system keeps getting better at spotting it as it sees more data.' },
  { title: 'Supply chains', body: 'Inventory levels, demand, and delivery routes all get optimised so a business can react faster and spend less doing it.' },
];

const BENEFITS = [
  ['Increased efficiency', 'Automating routine work saves real time and real money.'],
  ['Better customer experience', 'Personalised, faster support keeps people satisfied and loyal.'],
  ['Better insights', 'You understand your own operations and customers more deeply.'],
  ['A real advantage', 'Businesses that adopt this early tend to out-innovate the ones that wait.'],
  ['It scales', 'The same tools keep working as the business, and its data, grow.'],
];

const DECISION_STEPS = [
  { title: 'Define the problem', body: 'Say clearly what the issue or opportunity actually is, and understand its context.' },
  { title: 'Gather information', body: 'Work out what data and facts you actually need, then go get them.' },
  { title: 'Generate alternatives', body: 'Brainstorm more than one option, including ones that are not immediately obvious.' },
  { title: 'Evaluate alternatives', body: 'Weigh up each option’s risk, cost and likely outcome, honestly.' },
  { title: 'Choose one', body: 'Pick the option that best fits your goals and is actually achievable.' },
  { title: 'Implement it', body: 'Turn the choice into real actions, with someone responsible for each one.' },
  { title: 'Review and learn', body: 'Check what actually happened, and be honest about what you would do differently.' },
];

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
      className="text-left p-4 border transition-colors w-full h-full"
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

export default function IntroToBusinessAnalyticsLesson() {
  return (
    <div>
      {/* ── What MBI806B covers ── */}
      <section className="py-14">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8e8e93]">What this course is</p>
        <h2 className="mt-2 font-semibold tracking-[-0.01em] text-[#111827] text-[24px] sm:text-[28px]">
          Turning data into a decision, properly.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] sm:text-[16px] leading-relaxed text-[#4b5563]">
          MBI806B is a 15 credit, Level 8 course. It builds on MBI805B, which you are taking alongside it,
          and it needs MBI801 as a foundation. It is 150 learning hours in total: 36 in class, 114 on your
          own. The short version: you will learn to pull real insight out of messy business data using AI
          and ML, turn that insight into a visual that actually communicates something, and use it to make
          a decision you can defend, including on ethical and privacy grounds.
        </p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#4b5563]">
          MBI801 <span className="text-[#9ca3af]">→</span> MBI805B, this trimester <span className="text-[#9ca3af]">→</span>{' '}
          <strong className="text-[#111827]">MBI806B, you are here</strong> <span className="text-[#9ca3af]">→</span> MBI807B, Business Intelligence and Data Warehousing
        </p>
      </section>

      {/* ── Learning outcomes ── */}
      <Section eyebrow="By the end of the course" title="Four things you'll be able to do.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {LEARNING_OUTCOMES.map(lo => (
            <div key={lo.n}>
              <span className="inline-flex items-center justify-center w-6 h-6 text-[11px] font-bold" style={{ background: '#0f766e', color: '#fff' }}>
                {lo.n}
              </span>
              <p className="mt-2 text-[14.5px] font-semibold text-[#111827]">{lo.title}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#6b7280]">{lo.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Indicative content ── */}
      <Section
        eyebrow="Across the whole trimester"
        title="What the course covers."
        lead="This is the real topic list for MBI806B. We will not get through all of it today, this is the whole course, not just Session 1."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
          {INDICATIVE_CONTENT.map((item, i) => (
            <div key={item} className="flex gap-3 py-1.5 border-b border-black/[0.06] text-[14px] text-[#374151]">
              <span className="text-[#9ca3af] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              {item}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Session flow ── */}
      <Section
        eyebrow="Today, specifically"
        title="How Session 1 unfolds."
        lead="This is the real running order for today, the same one on my own slides."
      >
        <NumberedFlow items={SESSION_FLOW} />
      </Section>

      {/* ── Preview walkthrough ── */}
      <Section
        eyebrow="A small preview"
        title="Here is some of what today covers."
        lead="A few examples, pulled straight from today's material. There is more in class than what fits on this page, this is just enough to get you thinking before you arrive."
      >
        <div className="space-y-14">
          <div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
              <strong>First, what actually is AI?</strong> Here is a definition I like, because it does
              not require a computer science degree to understand: if you are interacting with a machine,
              by typing or talking, and it feels enough like talking to a person that you cannot easily
              tell the difference, that machine is behaving intelligently. AI is not about building an
              all-powerful machine. It is about building systems that behave in a human-like way, either
              by communicating with us, or, in the case of robotics, by physically doing something in the
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
              <strong>So are AI and ML the same thing?</strong> No, and this trips people up constantly.
              ML is one specific way of building AI: training a model on data until it can perform a task.
              Every machine learning system is a form of AI. Not every AI system uses machine learning.
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
              these terms constantly through the trimester.
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
              <strong>Now, today's ice-breaker, early.</strong> Before we get to any of the theory in
              class, we spend a few minutes on an activity called "AI in My Life." The honest answer for
              most people is: more than you think. Try a few of these yourself.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPOT_THE_AI.map(item => (
                <SpotTheAICard key={item.prompt} prompt={item.prompt} reveal={item.reveal} />
              ))}
            </div>
            <p className="mt-4 text-[13px] text-[#9ca3af]">
              In class, we will do this properly as a group discussion: "Where do YOU see AI?" Come with
              your own example, not just these ones.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Decision-making frameworks ── */}
      <Section
        eyebrow="After the break"
        title="How do we actually make a decision?"
        lead="Before any AI enters the picture, it helps to be honest about how decisions actually get made. A decision-making framework is just a structured way to get from a problem to a choice you can stand behind."
      >
        <NumberedFlow items={DECISION_STEPS} />
      </Section>

      {/* ── AI in decisions ── */}
      <Section
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
            still has to interpret what the algorithm says. And as AI gets more involved in decisions that
            affect real people, we have to take bias, transparency and accountability seriously, not as an
            afterthought. We come back to this properly later in the course, this is worth knowing from day
            one.
          </p>
        </div>
      </Section>

      {/* ── Power BI ── */}
      <Section
        eyebrow="Our first tool"
        title="Meeting Power BI."
        lead="Power BI is a business intelligence tool. You connect it to your data, build reports and dashboards out of it, and share those with the people who need to see them. Today, we just open it and look around. Nothing needs to be perfect yet."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ['Power BI Desktop', 'A free application for actually building and designing reports.'],
            ['Power BI Service', 'The online side, for publishing and sharing what you built.'],
            ['Power BI mobile', 'For checking your reports and dashboards on the go.'],
          ].map(([title, body]) => (
            <div key={title} className="p-4 border border-black/[0.1]">
              <p className="text-[13.5px] font-semibold text-[#111827]">{title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#6b7280]">{body}</p>
            </div>
          ))}
        </div>
        <ul className="mt-5 space-y-2 text-[14px] text-[#4b5563]">
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            <span>
              <a href="https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started" target="_blank" rel="noreferrer" className="font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1">
                Getting started with Power BI Desktop, official Microsoft guide <ExternalLink size={11} />
              </a>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            <span>
              <a href="https://www.linkedin.com/learning/power-bi-essential-training-2024/overview-power-bi-concepts" target="_blank" rel="noreferrer" className="font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1">
                Power BI Essential Training, LinkedIn Learning <ExternalLink size={11} />
              </a>
            </span>
          </li>
        </ul>
      </Section>

      {/* ── Benefits ── */}
      <Section eyebrow="Why this is worth learning" title="What this is actually good for.">
        <ul className="space-y-3 max-w-2xl">
          {BENEFITS.map(([title, body]) => (
            <li key={title} className="border-l-2 pl-4" style={{ borderColor: 'rgba(15,118,110,0.3)' }}>
              <p className="text-[14.5px] font-semibold text-[#111827]">{title}</p>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#6b7280]">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Come prepared ── */}
      <Section eyebrow="Before class" title="Come prepared.">
        <ul className="space-y-2.5 text-[14.5px] text-[#4b5563] max-w-2xl">
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            <span>
              Bring a laptop with{' '}
              <a href="https://www.microsoft.com/en-us/download/details.aspx?id=58494" target="_blank" rel="noreferrer" className="font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1">
                Power BI Desktop <ExternalLink size={11} />
              </a>{' '}
              installed if you can. If you cannot install it beforehand, that is fine, we will sort it out
              in class.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            No coding, statistics or prior AI experience is assumed. If you have never opened a data tool
            before, you are exactly who this session is for.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 flex-none w-1 h-1 rounded-full bg-[#0f766e]" />
            Think of one place you already noticed AI in your own life this week. We will use it.
          </li>
        </ul>
      </Section>

      {/* ── Sign off ── */}
      <section className="border-t border-black/[0.08] py-14">
        <p className="max-w-xl text-[15px] leading-relaxed text-[#374151]">
          That's Session 1. By the end of today, "AI" and "Machine Learning" should feel like ordinary
          working terms, not buzzwords. From here, the course moves from understanding these ideas to
          actually using them, visualising what you find, and deciding what to do about it. I will see you
          in the room.
        </p>
        <p className="mt-6 text-[13px] font-medium text-[#6b7280] inline-flex items-center gap-1.5">
          Yasas Sri Wickramasinghe
          <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#0d9488] hover:underline">
            MBI806B lecturer <ExternalLink size={11} />
          </a>
        </p>
      </section>
    </div>
  );
}
