import { useState } from 'react';
import { Recap, Reveal, SectionHead } from '../blend';

// ─── MBI800 · When the local beats the global ──────────────────────────────
// A public, ungated Blend page (src/components/blend/README.md), running on
// MBI800's indigo through the `planning` accent set by the shell.
//
// Feeds LO2 (cultural protocols and IS implementation) and the 40% cultural
// case study. Big companies that walked into a market with the home playbook
// and walked out again, the locals that beat them, and what that means for
// the system you build. Every figure is a published one; the sources are
// listed at the bottom of the page so students can check and cite them.
//
// Charts follow one rule: the giant is always ink, the local is always the
// accent, so colour means the same thing in every chart on the page.

type Lens = 'Money' | 'Habits' | 'Values' | 'Faith' | 'Trust' | 'Rules';

const LENSES: { name: Lens; q: string; eg: string }[] = [
  { name: 'Money', q: 'How do people actually pay?', eg: 'Cash, no credit card, pay when it arrives.' },
  { name: 'Habits', q: 'How do they shop, eat and get around every day?', eg: 'A motorbike, not a car. The local café, not a chain.' },
  { name: 'Values', q: 'What counts as polite, rude, or funny?', eg: 'A smile that reads as odd. A joke that reads as an insult.' },
  { name: 'Faith', q: 'What will people not eat, wear, or do?', eg: 'No beef for Hindus, no pork for Muslims.' },
  { name: 'Trust', q: 'Who do they trust with their money, and why?', eg: 'Talk to the seller first. Hold the money until it arrives.' },
  { name: 'Rules', q: 'What do the law and the government favour?', eg: 'Licences, data rules, and regulators who back their own.' },
];

type Case = {
  giant: string;
  where: string;
  years: string;
  stat: string;
  statLabel: string;
  brought: string;
  wanted: string;
  outcome: string;
  lenses: Lens[];
};

const CASES: Case[] = [
  {
    giant: 'Walmart',
    where: 'Germany',
    years: '1997–2006',
    stat: '$1bn',
    statLabel: 'expected loss on the way out',
    brought: 'Greeters at the door, staff told to smile at every shopper, bag packers at the checkout, a company chant, and big stores out of town.',
    wanted: 'German shoppers found the forced friendliness strange. They wanted low prices and no fuss, and Aldi and Lidl already did that better.',
    outcome: 'Sold all 85 stores to the local rival Metro.',
    lenses: ['Values', 'Habits'],
  },
  {
    giant: 'Uber',
    where: 'Southeast Asia',
    years: '2013–2018',
    stat: '27.5%',
    statLabel: 'of Grab, the price of leaving',
    brought: 'The San Francisco app. Cars only, card payments only.',
    wanted: 'Lots of riders paid in cash and had no credit card. In Jakarta or Ho Chi Minh City traffic, the fastest ride is a motorbike.',
    outcome: 'Sold the business in eight countries to Grab, in return for a share of Grab.',
    lenses: ['Money', 'Habits'],
  },
  {
    giant: 'eBay',
    where: 'China',
    years: '2003–2006',
    stat: '79% → 36%',
    statLabel: 'eBay’s share, 2003 to 2005',
    brought: 'Fees to list an item, and buyers and sellers kept at arm’s length, the way it worked in the US.',
    wanted: 'Chinese buyers wanted to chat with the seller, haggle, and know their money was safe before the goods turned up.',
    outcome: 'Taobao went from 8% to 59% in two years. eBay closed its Chinese site in 2006.',
    lenses: ['Trust', 'Money'],
  },
  {
    giant: 'Amazon',
    where: 'China',
    years: '2004–2019',
    stat: '0.6%',
    statLabel: 'share when it closed the marketplace',
    brought: 'The Amazon way: a clean search page, reviews, steady prices, and a lot of patience.',
    wanted: 'Shopping in China is an event. Singles’ Day sales on 11 November, flash deals, chatting with the seller, paying with Alipay or WeChat Pay.',
    outcome: 'Closed its Chinese marketplace in July 2019. Kept AWS, Kindle and cross-border sales.',
    lenses: ['Habits', 'Money'],
  },
  {
    giant: 'Starbucks',
    where: 'Australia',
    years: '2000–2008',
    stat: '61',
    statLabel: 'stores closed in one go, July 2008',
    brought: 'The global menu. Big, sweet, milky drinks in big cups, in the same store everywhere.',
    wanted: 'Australia already had a serious espresso culture. People had their local café and a barista who knew their order. A flat white beat a Frappuccino.',
    outcome: 'Shut about seven in ten stores. Sold the last 24 to the family that runs 7-Eleven Australia in 2014.',
    lenses: ['Habits'],
  },
  {
    giant: 'Home Depot',
    where: 'China',
    years: '2006–2012',
    stat: '7',
    statLabel: 'last big-box stores shut in 2012',
    brought: 'Huge do-it-yourself warehouses. Buy the tiles, take the class, lay them yourself on the weekend.',
    wanted: 'With labour this cheap, nobody wants to do it themselves. In the company’s own words, China is a “do-it-for-me” market.',
    outcome: 'Closed every big store and took a charge of around $160 million.',
    lenses: ['Habits'],
  },
  {
    giant: 'Barbie',
    where: 'Shanghai',
    years: '2009–2011',
    stat: '2 years',
    statLabel: 'for a six-floor flagship store',
    brought: 'A pink six-floor House of Barbie on Huaihai Road. Dolls, clothes, a spa and a bar.',
    wanted: 'Shanghai parents would rather pay for extra lessons than expensive toys. And the grown-up Barbie look didn’t land. Cute did, which is why Hello Kitty was doing fine.',
    outcome: 'Closed in March 2011, two years after it opened.',
    lenses: ['Values'],
  },
  {
    giant: 'Dolce & Gabbana',
    where: 'China',
    years: '2018',
    stat: '58,000',
    statLabel: 'items pulled from one site in a day',
    brought: 'A set of ads with a Chinese model trying to eat pizza and cannoli with chopsticks, and a narrator talking down to her.',
    wanted: 'People saw it as mocking Chinese culture. Then insulting messages from the co-founder’s Instagram went viral. He said he was hacked.',
    outcome: 'Tmall, JD.com and others delisted the brand. Its big Shanghai show was cancelled hours before it started.',
    lenses: ['Values'],
  },
];

// Years in the market. Starbucks Australia shrank rather than left, so its
// bar ends at the year of the big closure.
const TIMELINE: { who: string; where: string; from: number; to: number; end: string }[] = [
  { who: 'Walmart', where: 'Germany', from: 1997, to: 2006, end: 'Sold to Metro' },
  { who: 'Walmart', where: 'South Korea', from: 1998, to: 2006, end: 'Sold to Shinsegae (E-Mart)' },
  { who: 'Starbucks', where: 'Australia', from: 2000, to: 2008, end: 'Closed 61 stores' },
  { who: 'eBay', where: 'China', from: 2003, to: 2006, end: 'Lost to Taobao' },
  { who: 'Amazon', where: 'China', from: 2004, to: 2019, end: 'Closed the marketplace' },
  { who: 'Home Depot', where: 'China', from: 2006, to: 2012, end: 'Closed last 7 stores' },
  { who: 'Barbie', where: 'Shanghai', from: 2009, to: 2011, end: 'Flagship closed' },
  { who: 'Uber', where: 'Southeast Asia', from: 2013, to: 2018, end: 'Sold to Grab' },
  { who: 'Uber', where: 'China', from: 2014, to: 2016, end: 'Sold to Didi' },
  { who: 'Airbnb', where: 'China', from: 2015, to: 2022, end: 'Shut domestic listings' },
];
const T0 = 1995;
const T1 = 2025;
const pct = (y: number) => ((y - T0) / (T1 - T0)) * 100;

type Local = {
  name: string;
  where: string;
  beat: string;
  stat: string;
  statLabel: string;
  move: string;
};

const LOCALS: Local[] = [
  {
    name: 'Taobao',
    where: 'China',
    beat: 'eBay',
    stat: 'Free',
    statLabel: 'to list, while eBay charged',
    move: 'A chat app built in so you could haggle with the seller, and Alipay holding your money until the parcel arrived.',
  },
  {
    name: 'Jollibee',
    where: 'Philippines',
    beat: 'McDonald’s',
    stat: '50% vs 29%',
    statLabel: 'of the chicken and burger market',
    move: 'Sweet spaghetti, fried chicken with rice, and a bee mascot kids grow up with. It cooks the way Filipino families eat at home.',
  },
  {
    name: 'Grab and Gojek',
    where: 'Southeast Asia',
    beat: 'Uber',
    stat: 'Cash',
    statLabel: 'accepted from early on',
    move: 'Motorbike rides, cash payments, then food, parcels and payments in one app. Gojek started as a call centre for motorbike taxi drivers.',
  },
  {
    name: 'Flipkart',
    where: 'India',
    beat: 'Amazon',
    stat: '~80%',
    statLabel: 'of orders paid cash on delivery by 2016',
    move: 'In 2010 it let people pay the courier in cash at the door. People who had never trusted an online payment started buying.',
  },
  {
    name: 'Careem',
    where: 'Middle East',
    beat: 'Uber',
    stat: '$3.1bn',
    statLabel: 'what Uber paid to buy it in 2019',
    move: 'Cash rides in markets where most people paid cash, and local teams in more than 100 cities across 15 countries.',
  },
  {
    name: 'Trade Me',
    where: 'New Zealand',
    beat: 'eBay',
    stat: 'NZ$2.56bn',
    statLabel: 'sale price in 2019',
    move: 'eBay arrived in 2001 pricing in US dollars and asking for zip codes. Trade Me was in NZ dollars, built by Kiwis, and already had everyone’s listings.',
  },
  {
    name: 'PickMe',
    where: 'Sri Lanka',
    beat: 'Uber',
    stat: '100,000+',
    statLabel: 'drivers on the platform',
    move: 'Tuk-tuks as a ride type from early on, local pricing, and the app in Sinhala and Tamil as well as English.',
  },
];

const BUYOUTS: [string, string, string][] = [
  ['Walmart', 'bought 77% of Flipkart', '$16bn'],
  ['Uber', 'bought Careem', '$3.1bn'],
  ['Uber', 'took 27.5% of Grab', 'for leaving'],
  ['Uber', 'took a 17.7% stake in Didi', 'for leaving'],
];

const SYSTEM_MAP: [string, string, string][] = [
  ['People pay in cash', 'Cash on delivery, cash rides, driver cash reconciliation', 'Flipkart, Grab, Careem'],
  ['People want to talk before they buy', 'Chat built into the listing', 'Taobao'],
  ['People don’t trust paying a stranger', 'Escrow. Hold the money until the buyer confirms', 'Alipay'],
  ['The fastest ride is a motorbike or tuk-tuk', 'Vehicle types and pricing built for them', 'Grab, Gojek, PickMe'],
  ['Not everyone reads English', 'The app in the local languages', 'PickMe'],
  ['Food rules come from faith', 'Menu data that tracks veg and non-veg, and kitchens kept apart', 'McDonald’s India'],
  ['Prices are in the local currency', 'Local currency, local addresses, local postage', 'Trade Me'],
];

const CHECKLIST = [
  'How do people here pay for this today? Not how they could pay. How they do pay.',
  'Who already does this here, even badly? A market stall, a call centre, a guy with a motorbike.',
  'What would our best feature look like to someone here? Friendly, or strange?',
  'Is there a food, faith, family or holiday rule we haven’t heard of yet?',
  'Who do people here trust, and what do we need to borrow from that trust?',
  'If a local copied us tomorrow and added one thing, what would that one thing be?',
];

const TRY_IT: { plan: string; risk: string; local: string }[] = [
  {
    plan: 'A New Zealand meal-kit company launches in India with its best sellers: lamb shanks, beef ragu and pork belly.',
    risk: 'Faith. Beef and pork are off the table for a big share of customers, and many households are fully vegetarian.',
    local: 'A veg-first menu, regional dishes, a clear veg and non-veg split, and cash on delivery.',
  },
  {
    plan: 'A US food delivery app opens in Colombo with card-only payment and car-only riders.',
    risk: 'Money and Habits. Lots of people pay cash, and tuk-tuks and motorbikes are faster through Colombo traffic.',
    local: 'Cash on delivery, bike and tuk-tuk riders, and the app in Sinhala and Tamil.',
  },
  {
    plan: 'A European bank opens a digital-only branch in a Gulf country, offering interest-based savings and loans.',
    risk: 'Faith. Many customers want Islamic finance, which avoids interest.',
    local: 'Sharia-compliant products, Arabic first, and opening hours that work around prayer times and Ramadan.',
  },
  {
    plan: 'An Australian online store launches in Japan with chatty, jokey emails and a no-questions returns page.',
    risk: 'Values. Customers expect formal, careful language and a high level of politeness from a shop.',
    local: 'Formal Japanese copy written by a native speaker, careful packaging, and service that apologises well.',
  },
];

/** Tap once for the risk, again for what a local would do. */
function TryCard({ n, plan, risk, local }: { n: number; plan: string; risk: string; local: string }) {
  const [step, setStep] = useState(0);
  const labels = ['The plan', 'What trips it', 'What a local would do'];
  const bodies = [plan, risk, local];
  const next = ['Tap for what trips it', 'Tap for the local move', 'Tap to start again'];
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

/** A small horizontal bar chart: the giant in ink, the local in accent. */
function ShareBars({ title, note, rows }: { title: string; note: string; rows: { label: string; value: number; local: boolean; shown?: string }[] }) {
  const max = Math.max(...rows.map(r => r.value));
  return (
    <figure className="lbg-chart">
      <figcaption className="lbg-chart__title">{title}</figcaption>
      <div className="lbg-chart__rows">
        {rows.map(r => (
          <div key={r.label} className="lbg-chart__row" title={`${r.label}: ${r.shown ?? `${r.value}%`}`}>
            <span className="lbg-chart__label">{r.label}</span>
            <span className="lbg-chart__track">
              <span
                className={`lbg-chart__bar${r.local ? ' lbg-chart__bar--local' : ''}`}
                style={{ width: `${Math.max((r.value / max) * 100, 1.2)}%` }}
              />
            </span>
            <span className="lbg-chart__val bt-tnum">{r.shown ?? `${r.value}%`}</span>
          </div>
        ))}
      </div>
      <p className="lbg-chart__note">{note}</p>
    </figure>
  );
}

const SOURCES: [string, string][] = [
  ['Walmart leaving Germany, AP via Lawrence Journal-World, July 2006', 'https://www2.ljworld.com/news/2006/jul/29/walmart_leaving_germany/'],
  ['Uber sells Southeast Asia business to Grab, TechCrunch, March 2018', 'https://techcrunch.com/2018/03/25/gruber-official/'],
  ['Taobao, Wikipedia (eBay and Taobao market share 2003–2005)', 'https://en.wikipedia.org/wiki/Taobao'],
  ['Amazon to close China marketplace, CNN, April 2019', 'https://amp.cnn.com/cnn/2019/04/18/tech/amazon-closes-china'],
  ['Amazon China closure and Tmall/JD share, Coresight Research', 'https://coresight.com/research/amazon-to-close-china-marketplace-and-focus-on-cross-border-e-commerce-kindle-and-aws/'],
  ['Withers family buys Starbucks Australia, SmartCompany, 2014', 'https://www.smartcompany.com.au/business-advice/franchising/rich-list-family-behind-australia-s-7-eleven-snaps-up-starbucks/'],
  ['The Home Depot closes seven big box stores in China, company release, September 2012', 'https://ir.homedepot.com/news-releases/2012/09-13-2012'],
  ['Home Depot to close 7 stores in China, NPR, September 2012', 'https://npr.org/2012/09/14/161130014/home-depot-to-close-7-stores-in-china'],
  ['Mattel is closing down Barbie’s Shanghai palace, AP via NBC News, March 2011', 'https://www.nbcnews.com/id/wbna41956792'],
  ['E-commerce sites drop Dolce & Gabbana products, Caixin, November 2018', 'https://www.caixinglobal.com/2018-11-22/e-commerce-sites-drop-dolce-gabbana-products-as-public-outcry-grows-101350933.html'],
  ['Airbnb to close its domestic business in mainland China, NBC News, May 2022', 'https://www.nbcnews.com/news/amp/rcna30231'],
  ['Didi to buy Uber’s China business, CNBC, August 2016', 'https://www.cnbc.com/2016/08/01/chinas-didi-chuxing-to-acquire-ubers-chinese-operations-wsj.html'],
  ['Uber acquires Careem for $3.1 billion, Wamda, March 2019', 'https://www.wamda.com/2019/03/uber-acquires-careem-3-1-billion'],
  ['Jollibee Group, Wikipedia, and Fortune Asia, June 2024', 'https://fortune.com/asia/2024/06/17/jollibee-southeast-asia-500-jfc-ernesto-tanmantiong-acquisitions-global-brands/'],
  ['Will cash on delivery kill Indian e-commerce?, YourStory, April 2016', 'https://yourstory.com/2016/04/cod-kill-indian-e-commerce/'],
  ['Trade Me, Wikipedia, and How a NZ entrepreneur took on a global giant, SmartCompany', 'https://en.wikipedia.org/wiki/Trade_Me'],
  ['PickMe adds Sinhala and Tamil to its app, Daily Mirror Sri Lanka', 'https://dailymirror.lk/print/ict/pickme-includes-sinhala-and-tamil-to-application/269-99899'],
  ['McDonald’s to open vegetarian-only restaurants in India, CS Monitor, September 2012', 'https://csmonitor.com/Business/Latest-News-Wires/2012/0905/McDonald-s-to-open-vegetarian-only-restaurants-in-India'],
  ['Yum China Holdings, Form 10-K for 2025 (KFC store count)', 'https://www.sec.gov/Archives/edgar/data/1673358/000119312526082824/yumc-20251231.htm'],
];

export default function LocalBeatsGlobalLesson() {
  return (
    <div>
      {/* ══ Six lenses ═══════════════════════════════════════════════════ */}
      <section id="lenses" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Start here"
            title="Six things that don’t travel"
            aside="A product can cross a border in a day. These six things don’t cross at all. Every case on this page tripped on at least one."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="lbg-lenses">
            {LENSES.map((l, i) => (
              <li key={l.name} className="lbg-lens">
                <span className="lbg-lens__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
                <span className="lbg-lens__name">{l.name}</span>
                <span className="lbg-lens__q">{l.q}</span>
                <span className="lbg-lens__eg">{l.eg}</span>
              </li>
            ))}
          </ol>
          <p className="bt-note" style={{ marginTop: 16 }}>
            None of these companies were stupid. They were very good at one country, and they
            assumed the next one would work the same way.
          </p>
        </Reveal>
      </section>

      {/* ══ The exits ════════════════════════════════════════════════════ */}
      <section id="cases" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Real companies"
            title="Eight giants that got it wrong"
            aside="Read what they brought, then what people actually wanted. The gap between those two lines is the whole lesson."
          />
        </Reveal>
        <div className="lbg-cases">
          {CASES.map((c, i) => (
            <Reveal key={`${c.giant}-${c.where}`} delay={0.04 * (i % 2)}>
              <article className="lbg-case">
                <header className="lbg-case__head">
                  <div>
                    <span className="lbg-case__meta bt-tnum">{c.where} · {c.years}</span>
                    <h3 className="lbg-case__name">{c.giant}</h3>
                  </div>
                  <div className="lbg-case__stat">
                    <b className="bt-tnum">{c.stat}</b>
                    <span>{c.statLabel}</span>
                  </div>
                </header>
                <div className="lbg-case__pair">
                  <div>
                    <span className="lbg-case__k">What they brought</span>
                    <p>{c.brought}</p>
                  </div>
                  <div>
                    <span className="lbg-case__k lbg-case__k--local">What people wanted</span>
                    <p>{c.wanted}</p>
                  </div>
                </div>
                <footer className="lbg-case__foot">
                  <p>{c.outcome}</p>
                  <span className="lbg-case__lenses">
                    {c.lenses.map(l => <span key={l} className="lbg-chip">{l}</span>)}
                  </span>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="bt-note" style={{ marginTop: 18 }}>
            Why so much China? It was the market every giant wanted, and very few of them
            cracked it. To be fair, it’s rarely only culture. Airbnb left China in 2022 blaming high
            costs and lockdowns, and Uber China ran into regulators too. But culture is the part
            nobody puts in the spreadsheet.
          </p>
        </Reveal>
      </section>

      {/* ══ Timeline ═════════════════════════════════════════════════════ */}
      <section id="timeline" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="How long they lasted"
            title="Thirty years of exits"
            aside="Each bar is the time a giant spent in that market before it sold, shut or shrank. Some lasted fifteen years. Barbie lasted two."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <figure className="lbg-time">
            <div className="lbg-time__axis" aria-hidden="true">
              {[1995, 2000, 2005, 2010, 2015, 2020, 2025].map(y => (
                <span key={y} style={{ left: `${pct(y)}%` }}>{y}</span>
              ))}
            </div>
            <ul className="lbg-time__rows">
              {TIMELINE.map(t => (
                <li key={`${t.who}-${t.where}`} className="lbg-time__row">
                  <span className="lbg-time__who">
                    <b>{t.who}</b> {t.where}
                  </span>
                  <span className="lbg-time__track">
                    <span
                      className="lbg-time__bar"
                      style={{ left: `${pct(t.from)}%`, width: `${pct(t.to) - pct(t.from)}%` }}
                      title={`${t.who} in ${t.where}: ${t.from} to ${t.to}. ${t.end}.`}
                    >
                      <span className="lbg-time__yrs bt-tnum">{t.to - t.from}y</span>
                    </span>
                    <span className="lbg-time__end" style={{ left: `calc(${pct(t.to)}% + 8px)` }}>{t.end}</span>
                  </span>
                </li>
              ))}
            </ul>
            <figcaption className="bt-note">
              Start year is when the company entered or bought in. End year is when it sold, shut,
              or (for Starbucks) closed most of its stores.
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ══ The locals ═══════════════════════════════════════════════════ */}
      <section id="locals" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="The other side"
            title="The locals who won"
            aside="None of them had more money. They just knew their customers better, and they built that knowledge into the product."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lbg-quote">
            <span className="lbg-quote__mark" aria-hidden="true">“</span>
            <div>
              <p>eBay may be a shark in the ocean, but I am a crocodile in the Yangtze River. If we fight in the ocean, we lose. But if we fight in the river, we win.</p>
              <span className="lbg-quote__who">Jack Ma, Alibaba, on taking on eBay in China</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lbg-charts">
            <ShareBars
              title="China online auctions, share of the market"
              note="eBay’s share fell from 79% to 36% between 2003 and 2005. Taobao went from 8% to 59%."
              rows={[
                { label: 'eBay 2003', value: 79, local: false },
                { label: 'eBay 2005', value: 36, local: false },
                { label: 'Taobao 2003', value: 8, local: true },
                { label: 'Taobao 2005', value: 59, local: true },
              ]}
            />
            <ShareBars
              title="China online shopping, end of 2018"
              note="Amazon had 0.6% when it closed its Chinese marketplace in 2019."
              rows={[
                { label: 'Tmall', value: 61.5, local: true },
                { label: 'JD.com', value: 24.2, local: true },
                { label: 'Amazon', value: 0.6, local: false },
              ]}
            />
            <ShareBars
              title="Philippines, chicken and burger fast food"
              note="Jollibee’s home market share against McDonald’s, as reported by Fortune."
              rows={[
                { label: 'Jollibee', value: 50, local: true },
                { label: 'McDonald’s', value: 29, local: false },
              ]}
            />
          </div>
          <p className="lbg-legend" aria-hidden="true">
            <span><i className="lbg-legend__sw" /> Global giant</span>
            <span><i className="lbg-legend__sw lbg-legend__sw--local" /> Local company</span>
          </p>
        </Reveal>

        <div className="lbg-locals">
          {LOCALS.map((l, i) => (
            <Reveal key={l.name} delay={0.03 * (i % 3)}>
              <article className="lbg-local">
                <span className="lbg-local__meta">{l.where} · vs {l.beat}</span>
                <h3 className="lbg-local__name">{l.name}</h3>
                <b className="lbg-local__stat bt-tnum">{l.stat}</b>
                <span className="lbg-local__statlbl">{l.statLabel}</span>
                <p>{l.move}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="lbg-buy">
            <div className="lbg-buy__head">
              <span className="bt-eyebrow">If you can’t beat them</span>
              <h3>Buy them, or take a share and leave.</h3>
            </div>
            <ul className="lbg-buy__list">
              {BUYOUTS.map(([who, what, amount]) => (
                <li key={what}>
                  <b>{who}</b>
                  <span>{what}</span>
                  <em className="bt-tnum">{amount}</em>
                </li>
              ))}
            </ul>
            <p className="lbg-buy__note">
              The same Walmart that lost Germany paid $16 billion in 2018 to own India’s local
              winner. Sometimes the smartest local strategy for a giant is to stop pretending to
              be local.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ The ones who stayed ══════════════════════════════════════════ */}
      <section id="stayed" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="It can be done"
            title="Two giants that changed instead"
            aside="Same kind of company, same kind of market. The difference is they changed the product before the market made them."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="tos-duel">
            <div className="tos-duel__side tos-duel__side--won">
              <span className="tos-duel__who">McDonald’s in India</span>
              <b className="tos-duel__big">No beef</b>
              <span className="tos-duel__cap">No pork either</span>
              <p>
                Most Indians are Hindu and don’t eat beef. Many Muslims don’t eat pork. So the Big
                Mac became the Maharaja Mac with chicken, one of its best sellers is a potato burger
                called the McAloo Tikki, and kitchens keep veg and non-veg cooking apart.
              </p>
            </div>
            <div className="tos-duel__vs" aria-hidden="true">&amp;</div>
            <div className="tos-duel__side tos-duel__side--won">
              <span className="tos-duel__who">KFC in China</span>
              <b className="tos-duel__big bt-tnum">12,997</b>
              <span className="tos-duel__cap">stores at the end of 2025</span>
              <p>
                KFC is China’s biggest fast food brand. The menu has rice dishes, congee for
                breakfast, pork, seafood and tea next to the fried chicken. Since 2016 it has been run by
                Yum China, a separate company that only has China to think about.
              </p>
            </div>
          </div>
          <div className="tos-lesson">
            <span className="tos-lesson__mark" aria-hidden="true">“</span>
            <p>
              They kept the brand and changed almost <b>everything else.</b> Walmart did the
              opposite in Germany.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Culture in the system ════════════════════════════════════════ */}
      <section id="system" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Why this is an IS lesson"
            title="Culture ends up in the system"
            aside="Look at what the winners actually built. Almost every local habit turned into a feature, a field in a database, or a payment flow."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-scroll">
            <table className="lbg-map">
              <thead>
                <tr>
                  <th scope="col">The local habit</th>
                  <th scope="col">What the system had to do</th>
                  <th scope="col">Who did it</th>
                </tr>
              </thead>
              <tbody>
                {SYSTEM_MAP.map(([habit, system, who]) => (
                  <tr key={habit}>
                    <td>{habit}</td>
                    <td>{system}</td>
                    <td>{who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bt-pairgrid" style={{ marginTop: 22 }}>
            <div className="bt-card">
              <h4>For your case study</h4>
              <p>
                This is LO2. When you analyse a system going into a new culture, don’t stop at
                “the culture is different”. Name the habit, then name the feature, screen or
                process it should change.
              </p>
            </div>
            <div className="bt-card">
              <h4>For your SISP report</h4>
              <p>
                If your organisation serves more than one community, put it in the plan. Payment
                options, languages and local partners are IS decisions, and they cost money.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ Checklist ════════════════════════════════════════════════════ */}
      <section id="checklist" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before you go in"
            title="Six questions to ask first"
            aside="Use these on any launch, at any size. A café opening in a new suburb has the same problem on a smaller scale."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="lbg-check">
            {CHECKLIST.map((q, i) => (
              <li key={q}>
                <span className="lbg-check__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ══ Your turn ════════════════════════════════════════════════════ */}
      <section id="try" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Your turn"
            title="Spot the problem before launch"
            aside="In pairs, 10 minutes. Read the plan, agree on what will trip it and what a local would do, then tap to see mine."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="tos-trygrid lbg-trygrid">
            {TRY_IT.map((t, i) => (
              <TryCard key={t.plan} n={i + 1} {...t} />
            ))}
          </div>
          <p className="bt-note" style={{ marginTop: 16 }}>
            Bonus: pick a country you know well, maybe the one you grew up in. Which global brand
            struggles there, and which local one does better? Bring it to class.
          </p>
        </Reveal>
      </section>

      {/* ══ Recap ═════════════════════════════════════════════════════════ */}
      <Recap
        title="Big doesn’t mean local."
        points={[
          ['Six things don’t travel.', 'Money, habits, values, faith, trust and rules. Check every one before you launch.'],
          ['Locals win on knowledge, not money.', 'Taobao, Jollibee, Grab, Flipkart and Trade Me all built what their customers already did.'],
          ['Culture ends up in the system.', 'Cash on delivery, built-in chat, escrow, local languages. Name the feature, not just the difference.'],
        ]}
      />

      {/* ══ Sources ══════════════════════════════════════════════════════ */}
      <section id="sources" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Check my numbers"
            title="Sources"
            aside="Every figure on this page comes from one of these. Cite the original, not this page."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="lbg-sources">
            {SOURCES.map(([label, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer noopener">{label} ↗</a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </div>
  );
}
