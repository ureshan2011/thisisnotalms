import { useState } from 'react';
import { Recap, Reveal, SectionHead } from '../blend';

// ─── MBI800 · Threats → Opportunities → Strategy ───────────────────────────
// A public, ungated Blend page (src/components/blend/README.md), running on
// MBI800's indigo through the `planning` accent set by the shell.
//
// Picks up where the SWOT step of strategic planning leaves off (study-pack
// chapter 4): SWOT lists the threats, this lesson is about what you do with
// them. Deliberately light on text and heavy on examples — six real
// companies, one side-by-side pair that took the same threat two ways, then
// flip cards for students to try it themselves in class.

type Case = {
  company: string;
  year: string;
  stat: string;
  statLabel: string;
  threat: string;
  opportunity: string;
  strategy: string;
  is: string;
};

const CASES: Case[] = [
  {
    company: 'Netflix',
    year: '2007',
    stat: 'Watch now',
    statLabel: 'not in two days',
    threat: 'Fast home internet was going to make posting DVDs look silly.',
    opportunity: 'People wanted to watch now, not wait two days for the mail.',
    strategy: 'Kill their own DVD business before someone else did. Go all in on streaming.',
    is: 'A streaming platform, plus a recommendation engine built on what people actually watch.',
  },
  {
    company: 'Apple',
    year: '2003',
    stat: '$0.99',
    statLabel: 'a song',
    threat: 'Napster. Millions of people downloading music for free.',
    opportunity: 'People clearly wanted digital music. They just had no easy, legal way to buy it.',
    strategy: 'The iTunes Store. One song, 99 cents, one click, straight onto your iPod.',
    is: 'An online store, digital rights management, and a payments system tied to your Apple ID.',
  },
  {
    company: 'Adobe',
    year: '2013',
    stat: 'Monthly',
    statLabel: 'not one big box',
    threat: 'Piracy, and customers skipping upgrades because a box cost thousands up front.',
    opportunity: 'Customers wanted the latest tools without a huge one-off bill.',
    strategy: 'Stop selling boxes. Move everyone to a monthly Creative Cloud subscription.',
    is: 'Cloud licensing and account sign-in. Every install now checks in, so piracy got much harder.',
  },
  {
    company: 'Microsoft',
    year: '2011',
    stat: 'Cloud',
    statLabel: 'not a CD',
    threat: 'Google Docs. Free, in the browser, nothing to install.',
    opportunity: 'Businesses wanted Office anywhere, on any device, always up to date.',
    strategy: 'Office 365 as a subscription, then a big bet on Azure cloud.',
    is: 'Cloud hosting at huge scale, and one login across every app and device.',
  },
  {
    company: 'NZ Post',
    year: '2010s',
    stat: 'Letters ↓',
    statLabel: 'parcels ↑',
    threat: 'Email. Fewer and fewer people post letters every year.',
    opportunity: 'Online shopping. All those orders still have to get to someone’s door.',
    strategy: 'Shift the business from letters to parcels and e-commerce delivery.',
    is: 'Parcel tracking, delivery apps for drivers, and systems that plug into online stores.',
  },
  {
    company: 'Google',
    year: '2022',
    stat: 'Code red',
    statLabel: 'after ChatGPT',
    threat: 'ChatGPT. People started asking an AI instead of searching.',
    opportunity: 'People want answers, not ten blue links.',
    strategy: 'Build its own AI (Gemini) and put AI answers right at the top of search.',
    is: 'Its own AI models, running on the data centres it already had.',
  },
];

const EASY_EXAMPLE: [string, string, string][] = [
  ['Threat', 'A big coffee chain opens right across the road from our small campus café.', 't'],
  ['Opportunity', 'Students don’t just want coffee. They want somewhere to sit and study for three hours.', 'o'],
  ['Strategy', 'Free Wi-Fi, plugs at every table, and a loyalty app with a “study deal”.', 's'],
];

const TRY_IT: { threat: string; opportunity: string; strategy: string }[] = [
  {
    threat: 'AI chatbots can now explain homework for free. You run a private tutoring business.',
    opportunity: 'Parents still want someone accountable for their kid’s progress.',
    strategy: 'Tutors plus AI. The AI handles practice, the tutor tracks progress and sends parents a weekly report.',
  },
  {
    threat: 'Fuel prices keep going up. You run a courier company.',
    opportunity: 'Customers care about cost and emissions more than ever.',
    strategy: 'Route optimisation software and a few e-bikes for city runs. Sell it as “green delivery”.',
  },
  {
    threat: 'A new privacy law. You run a marketing company that collects a lot of customer data.',
    opportunity: 'Customers now trust companies that are careful with their data.',
    strategy: 'Build a proper consent system and make “we protect your data” part of the pitch.',
  },
  {
    threat: 'Temu and Amazon ship cheap stuff to New Zealand. You run a small online store.',
    opportunity: 'They can’t do fast local delivery or local, handmade products.',
    strategy: 'Same-day local delivery, and a “made in NZ” range they can’t copy.',
  },
  {
    threat: 'Cyberattacks keep hitting banks in the news. You run a small bank.',
    opportunity: 'Customers are scared, and they’ll move to whoever feels safest.',
    strategy: 'Invest in security, then show it: instant fraud alerts and one-tap card freeze in the app.',
  },
  {
    threat: 'Not enough nurses. You run a group of medical clinics.',
    opportunity: 'A lot of follow-up visits don’t actually need someone in the room.',
    strategy: 'Video follow-ups and online booking, so nurses spend their time on the patients who need them.',
  },
];

/** A threat card. Tap once for the opportunity, again for the strategy. */
function TryCard({ n, threat, opportunity, strategy }: { n: number; threat: string; opportunity: string; strategy: string }) {
  const [step, setStep] = useState(0);
  const labels = ['Threat', 'Opportunity', 'Strategy'];
  const bodies = [threat, opportunity, strategy];
  const next = ['Tap for the opportunity', 'Tap for the strategy', 'Tap to start again'];
  return (
    <button
      type="button"
      className={`tos-try tos-try--${step}`}
      aria-label={`Scenario ${n}: ${labels[step]}. ${bodies[step]}`}
      onClick={() => setStep(s => (s + 1) % 3)}
    >
      <span className="tos-try__top">
        <span className="tos-try__n bt-tnum">{String(n).padStart(2, '0')}</span>
        <span className="tos-try__dots" aria-hidden="true">
          {[0, 1, 2].map(i => <span key={i} className={i <= step ? 'on' : ''} />)}
        </span>
      </span>
      <span className="tos-try__label">{labels[step]}</span>
      <span className="tos-try__body">{bodies[step]}</span>
      <span className="tos-try__hint">{next[step]}</span>
    </button>
  );
}

export default function ThreatsToStrategyLesson() {
  return (
    <div>
      {/* ══ The flip ═════════════════════════════════════════════════════ */}
      <section id="flip" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Start here"
            title="Three steps, three questions"
            aside="In a SWOT, threats are the scary box. Today we treat them as the start of the plan."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="tos-chain">
            <li className="tos-chain__step tos-chain__step--t">
              <span className="tos-chain__n">01</span>
              <span className="tos-chain__word">Threat</span>
              <span className="tos-chain__q">What’s coming for us?</span>
            </li>
            <li className="tos-chain__step tos-chain__step--o">
              <span className="tos-chain__n">02</span>
              <span className="tos-chain__word">Opportunity</span>
              <span className="tos-chain__q">What does this make customers need now?</span>
            </li>
            <li className="tos-chain__step tos-chain__step--s">
              <span className="tos-chain__n">03</span>
              <span className="tos-chain__word">Strategy</span>
              <span className="tos-chain__q">What will we build or change to give them that?</span>
            </li>
          </ol>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="tos-easy">
            <p className="bt-eyebrow">The easy one first</p>
            <h3 className="tos-easy__title">The campus café</h3>
            <div className="tos-rows">
              {EASY_EXAMPLE.map(([label, text, tone]) => (
                <div key={label} className={`tos-row tos-row--${tone}`}>
                  <span className="tos-row__label">{label}</span>
                  <span className="tos-row__text">{text}</span>
                </div>
              ))}
            </div>
            <p className="bt-note" style={{ marginTop: 14 }}>
              See what happened? The café didn’t try to out-coffee the chain. It asked what the
              customers actually needed, and the answer was a desk.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Real companies ═══════════════════════════════════════════════ */}
      <section id="cases" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Real world"
            title="Six companies that flipped it"
            aside="Read each one top to bottom. Then look at the last line. Every strategy ended up as an information system."
          />
        </Reveal>
        <div className="tos-cases">
          {CASES.map((c, i) => (
            <Reveal key={c.company} delay={0.04 * (i % 2)}>
              <article className="tos-case">
                <header className="tos-case__head">
                  <div>
                    <span className="tos-case__year bt-tnum">{c.year}</span>
                    <h3 className="tos-case__name">{c.company}</h3>
                  </div>
                  <div className="tos-case__stat">
                    <b>{c.stat}</b>
                    <span>{c.statLabel}</span>
                  </div>
                </header>
                <div className="tos-rows">
                  <div className="tos-row tos-row--t">
                    <span className="tos-row__label">Threat</span>
                    <span className="tos-row__text">{c.threat}</span>
                  </div>
                  <div className="tos-row tos-row--o">
                    <span className="tos-row__label">Opportunity</span>
                    <span className="tos-row__text">{c.opportunity}</span>
                  </div>
                  <div className="tos-row tos-row--s">
                    <span className="tos-row__label">Strategy</span>
                    <span className="tos-row__text">{c.strategy}</span>
                  </div>
                </div>
                <p className="tos-case__is">
                  <span>The IS behind it</span>
                  {c.is}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ Two endings ══════════════════════════════════════════════════ */}
      <section id="endings" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Same threat, two endings"
            title="Kodak and Fujifilm"
            aside="Both sold camera film. Both saw digital cameras coming. Only one of them flipped it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="tos-duel">
            <div className="tos-duel__side tos-duel__side--lost">
              <span className="tos-duel__who">Kodak</span>
              <b className="tos-duel__big">2012</b>
              <span className="tos-duel__cap">Filed for bankruptcy</span>
              <p>
                Kodak actually built one of the first digital cameras, back in 1975. Then it
                sat on it, because digital would eat into film sales. It treated the threat as
                something to wait out.
              </p>
            </div>
            <div className="tos-duel__vs" aria-hidden="true">vs</div>
            <div className="tos-duel__side tos-duel__side--won">
              <span className="tos-duel__who">Fujifilm</span>
              <b className="tos-duel__big">Still here</b>
              <span className="tos-duel__cap">Healthcare, materials, even skincare</span>
              <p>
                Fujifilm asked a different question: what are we actually good at? Chemistry,
                coatings, imaging. So it took that into medical imaging and cosmetics. Film was
                the product. Chemistry was the strength.
              </p>
            </div>
          </div>
          <div className="tos-lesson">
            <span className="tos-lesson__mark" aria-hidden="true">“</span>
            <p>
              Same threat. The difference was never the technology. It was whether anyone
              was willing to ask <b>“so what does this make possible?”</b>
            </p>
          </div>
          <p className="bt-note" style={{ marginTop: 14 }}>
            Blockbuster is the other one I always bring up. In 2000 it had the chance to buy
            Netflix for about $50 million and said no. By 2010 it was bankrupt.
          </p>
        </Reveal>
      </section>

      {/* ══ Where it fits in MBI800 ══════════════════════════════════════ */}
      <section id="sisp" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Where this sits in MBI800"
            title="From SWOT to your SISP report"
            aside="SWOT tells you what the threats are. It doesn’t tell you what to do about them. This step does."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="tos-flow">
            <div className="tos-swot" aria-label="SWOT grid with Threats highlighted">
              <div><b>S</b><span>Strengths</span></div>
              <div><b>W</b><span>Weaknesses</span></div>
              <div><b>O</b><span>Opportunities</span></div>
              <div className="tos-swot__on"><b>T</b><span>Threats</span></div>
            </div>
            <span className="tos-flow__arrow" aria-hidden="true">→</span>
            <div className="tos-flow__box">
              <span className="tos-flow__k">Flip it</span>
              <b>Opportunity</b>
            </div>
            <span className="tos-flow__arrow" aria-hidden="true">→</span>
            <div className="tos-flow__box">
              <span className="tos-flow__k">Decide</span>
              <b>Strategy</b>
            </div>
            <span className="tos-flow__arrow" aria-hidden="true">→</span>
            <div className="tos-flow__box tos-flow__box--end">
              <span className="tos-flow__k">Plan it</span>
              <b>IS plan</b>
            </div>
          </div>
          <div className="bt-pairgrid" style={{ marginTop: 22 }}>
            <div className="bt-card">
              <h4>For your assessment</h4>
              <p>
                In your SISP report, don’t just list threats and move on. For each big one, write
                the opportunity inside it and the strategy you’d recommend. That’s LO1 and LO3
                in one move.
              </p>
            </div>
            <div className="bt-card">
              <h4>The test for a good strategy</h4>
              <p>
                Can you name the system that delivers it? If the answer is “we’ll try harder”,
                it’s not a strategy yet. Netflix had a streaming platform. Apple had a store.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ Your turn ════════════════════════════════════════════════════ */}
      <section id="try" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Your turn"
            title="Flip these six threats"
            aside="In pairs, 10 minutes. Read the threat, argue out your own answer first, then tap to see mine."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="tos-trygrid">
            {TRY_IT.map((t, i) => (
              <TryCard key={t.threat} n={i + 1} {...t} />
            ))}
          </div>
          <p className="bt-note" style={{ marginTop: 16 }}>
            Mine isn’t the right answer, it’s just one answer. If yours is different and you can
            name the system behind it, it counts.
          </p>
        </Reveal>
      </section>

      {/* ══ Recap ═════════════════════════════════════════════════════════ */}
      <Recap
        title="Every threat is hiding a need."
        points={[
          ['Threat → opportunity → strategy.', 'What’s coming, what customers now need, what we’ll build to give it to them.'],
          ['Don’t fight the threat head on.', 'The café didn’t out-coffee the chain. Kodak tried to wait it out and lost.'],
          ['A real strategy has a system behind it.', 'If you can’t name the IS that delivers it, keep going.'],
        ]}
      />
    </div>
  );
}
