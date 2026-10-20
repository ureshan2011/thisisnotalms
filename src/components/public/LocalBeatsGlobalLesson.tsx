import { useState, type ReactNode } from 'react';
import { Recap, Reveal, SectionHead } from '../blend';
import {
  Brandenburg, Burj, Jeepney, Landmark, LensIcon, OperaHouse, Petronas, Postmark,
  RouteMap, SkyTower, Sigiriya, Stamp, Taj, TempleOfHeaven, Torii,
  type RouteStop,
} from './abroad/Art';

// ─── MBI800 · When the local beats the global ──────────────────────────────
// A public, ungated Blend page (src/components/blend/README.md), running on
// MBI800's indigo through the `planning` accent set by the shell.
//
// Feeds LO2 (cultural protocols and IS implementation) and the 40% cultural
// case study. Built as a trip: six things you can't pack, a route across nine
// markets, and one postcard per stop, each with its landmark drawn by hand
// (abroad/Art.tsx), the giant, the local, and what the system had to do about
// it. Then how long the giants lasted, a phone that shows culture turning
// into features, a checklist, and four scenarios to try.
//
// One colour rule across every chart and drawing: the global giant is ink,
// the local is the accent. Every figure is a published one; the sources sit
// at the bottom of the page so students can check and cite them.

type Lens = 'Money' | 'Habits' | 'Values' | 'Faith' | 'Trust' | 'Rules';
type Draw = (p: { sun?: boolean }) => ReactNode;

const LENSES: { name: Lens; q: string; eg: string }[] = [
  { name: 'Money', q: 'How do people actually pay?', eg: 'Cash, no credit card, pay when it arrives.' },
  { name: 'Habits', q: 'How do they shop, eat and get around?', eg: 'A motorbike, not a car. The local café, not a chain.' },
  { name: 'Values', q: 'What counts as polite, rude or funny?', eg: 'A smile that reads as odd. A joke that reads as an insult.' },
  { name: 'Faith', q: 'What will people not eat, wear or do?', eg: 'No beef for most Hindus, no pork for Muslims.' },
  { name: 'Trust', q: 'Who do they trust with their money?', eg: 'Talk to the seller first. Hold the money until it arrives.' },
  { name: 'Rules', q: 'What do the law and government favour?', eg: 'Licences, data rules, and regulators who back their own.' },
];

/** A small bar chart: the giant in ink, the local in the accent. */
function ShareBars({ title, note, rows }: { title: string; note: string; rows: { label: string; value: number; local: boolean }[] }) {
  const max = Math.max(...rows.map(r => r.value));
  return (
    <figure className="lbg-chart">
      <figcaption className="lbg-chart__title">{title}</figcaption>
      <div className="lbg-chart__rows">
        {rows.map(r => (
          <div key={r.label} className="lbg-chart__row" title={`${r.label}: ${r.value}%`}>
            <span className="lbg-chart__label">{r.label}</span>
            <span className="lbg-chart__track">
              <span
                className={`lbg-chart__bar${r.local ? ' lbg-chart__bar--local' : ''}`}
                style={{ width: `${Math.max((r.value / max) * 100, 1.2)}%` }}
              />
            </span>
            <span className="lbg-chart__val bt-tnum">{r.value}%</span>
          </div>
        ))}
      </div>
      <p className="lbg-chart__note">{note}</p>
      <p className="lbg-legend" aria-hidden="true">
        <span><i className="lbg-legend__sw" /> Global giant</span>
        <span><i className="lbg-legend__sw lbg-legend__sw--local" /> Local</span>
      </p>
    </figure>
  );
}

// ── The nine stops ────────────────────────────────────────────────────────
type Stop = {
  id: string;
  country: string;
  city: string;
  mark: string;
  coords: string;
  draw: Draw;
  landmark: string;
  lon: number;
  lat: number;
  place?: RouteStop['place'];
  giant: string;
  local: string;
  verdict: string;
  years: string;
  stat: string;
  statLabel: string;
  brought: string;
  wanted: string;
  outcome: string;
  lenses: Lens[];
  system: string;
  extra?: ReactNode;
};

const STOPS: Stop[] = [
  {
    id: 'germany',
    country: 'Germany',
    city: 'Berlin',
    mark: '2006',
    coords: '52.52° N · 13.38° E',
    draw: Brandenburg,
    landmark: 'Brandenburg Gate, Berlin',
    lon: 13.4, lat: 52.5,
    giant: 'Walmart',
    local: 'Aldi and Lidl',
    verdict: 'Walmart left',
    years: '1997–2006',
    stat: '$1bn',
    statLabel: 'expected loss on the way out',
    brought: 'Greeters at the door, staff told to smile at every shopper, bag packers at the checkout, a company chant, and big stores out of town.',
    wanted: 'German shoppers found the forced friendliness strange. They wanted low prices and no fuss, and Aldi and Lidl already did that better.',
    outcome: 'Sold all 85 stores to Metro, a German rival, in 2006.',
    lenses: ['Values', 'Habits'],
    system: 'Even the staff rulebook didn’t travel. In 2005 a German labour court ruled Walmart couldn’t bring in its US-written ethics code, including rules on staff relationships, without the works council agreeing.',
  },
  {
    id: 'gulf',
    country: 'The Gulf',
    city: 'Dubai',
    mark: '2019',
    coords: '25.20° N · 55.27° E',
    draw: Burj,
    landmark: 'Burj Khalifa, Dubai',
    lon: 55.3, lat: 25.2,
    place: 'b',
    giant: 'Uber',
    local: 'Careem',
    verdict: 'Uber bought the local',
    years: 'Careem from 2012',
    stat: '$3.1bn',
    statLabel: 'what Uber paid for Careem, 2019',
    brought: 'The global Uber app, built around a card on file.',
    wanted: 'In much of the region people paid for rides in cash. Careem took cash from the start and grew to more than 100 cities across 15 countries.',
    outcome: 'Uber paid $3.1 billion for Careem in 2019, the biggest tech deal the Middle East had seen outside Israel, and kept the Careem brand and app running.',
    lenses: ['Money', 'Trust'],
    system: 'When the local is too far ahead, buying it can be cheaper than catching up. Uber kept Careem’s app running, because the app was where the local knowledge lived.',
  },
  {
    id: 'india',
    country: 'India',
    city: 'Agra',
    mark: '2018',
    coords: '27.18° N · 78.04° E',
    draw: Taj,
    landmark: 'Taj Mahal, Agra',
    lon: 78, lat: 27.2,
    place: 't',
    giant: 'Amazon',
    local: 'Flipkart',
    verdict: 'Walmart bought the local',
    years: 'Flipkart from 2007',
    stat: '~80%',
    statLabel: 'of Flipkart orders paid cash on delivery by 2016',
    brought: 'Online shopping the Western way. Pay by card up front, then wait for the parcel.',
    wanted: 'Most people had no credit card, and didn’t trust paying a website before they saw the goods. From 2010 Flipkart let them pay the courier in cash at the door. Within two months that was about 30% of its sales.',
    outcome: 'Amazon is still fighting for India. Walmart took a shortcut and paid $16 billion for 77% of Flipkart in 2018.',
    lenses: ['Money', 'Trust', 'Faith'],
    system: 'Cash on delivery isn’t a checkbox. It means couriers carrying cash, reconciling it every night, and handling parcels people refuse at the door. Flipkart had to build all of that.',
    extra: (
      <div className="lbg-aside">
        <span className="lbg-aside__k">The giant that changed instead</span>
        <h4>McDonald’s in India</h4>
        <p>
          Most Indians are Hindu and don’t eat beef. Many Muslims don’t eat pork. So there’s no
          beef or pork on the menu. The Big Mac became the chicken Maharaja Mac, one of its best
          sellers is a potato burger called the McAloo Tikki, and kitchens keep veg and non-veg
          cooking apart.
        </p>
      </div>
    ),
  },
  {
    id: 'srilanka',
    country: 'Sri Lanka',
    city: 'Sigiriya',
    mark: '2026',
    coords: '7.96° N · 80.76° E',
    draw: Sigiriya,
    landmark: 'Sigiriya rock, with a tuk-tuk',
    lon: 80.8, lat: 7.96,
    place: 'l',
    giant: 'Uber',
    local: 'PickMe',
    verdict: 'The local leads',
    years: 'Both still running',
    stat: '100,000+',
    statLabel: 'drivers on PickMe',
    brought: 'An English-first app built around cars, the same one it runs in Sydney or London.',
    wanted: 'A lot of Sri Lanka moves by tuk-tuk, and not everyone reads English. PickMe put tuk-tuks in the app early, priced them for local pockets, and added Sinhala and Tamil.',
    outcome: 'Both still operate. There’s no official market share data, but PickMe is widely seen as the bigger of the two.',
    lenses: ['Habits', 'Values'],
    system: 'Two small features did a lot of work here: a vehicle type that only matters locally, and the app in the languages people actually read.',
  },
  {
    id: 'seasia',
    country: 'Southeast Asia',
    city: 'Kuala Lumpur',
    mark: '2018',
    coords: '3.16° N · 101.71° E',
    draw: Petronas,
    landmark: 'Petronas Towers, Kuala Lumpur, with a motorbike ride',
    lon: 101.7, lat: 3.16,
    place: 'b',
    giant: 'Uber',
    local: 'Grab',
    verdict: 'Uber sold up',
    years: '2013–2018',
    stat: '27.5%',
    statLabel: 'of Grab, the price of leaving',
    brought: 'The San Francisco app. Cars only, card payments only.',
    wanted: 'Lots of riders paid in cash and had no credit card. In Jakarta or Ho Chi Minh City traffic, the fastest ride is a motorbike.',
    outcome: 'Sold its business in eight countries to Grab in 2018, in return for 27.5% of Grab.',
    lenses: ['Money', 'Habits'],
    system: 'Cash rides and motorbike rides meant new payment flows, new pricing and a new driver app. Grab built them first. In Indonesia, Gojek started out as a call centre for motorbike taxi drivers.',
  },
  {
    id: 'china',
    country: 'China',
    city: 'Beijing',
    mark: '2006',
    coords: '39.88° N · 116.41° E',
    draw: TempleOfHeaven,
    landmark: 'Temple of Heaven, Beijing',
    lon: 116.4, lat: 39.9,
    giant: 'eBay',
    local: 'Taobao',
    verdict: 'eBay left',
    years: '2003–2006',
    stat: '79% → 36%',
    statLabel: 'eBay’s share, 2003 to 2005',
    brought: 'Fees to list an item, and buyers and sellers kept at arm’s length, the way it worked in the US.',
    wanted: 'Chinese buyers wanted to chat with the seller, haggle, and know their money was safe before the goods turned up.',
    outcome: 'Taobao went from 8% to 59% in two years. eBay closed its Chinese site in 2006.',
    lenses: ['Trust', 'Money'],
    system: 'Taobao won on three features: free listings, a chat app built into every listing, and Alipay holding the money until the buyer was happy. Every one of them is a system decision.',
    extra: (
      <>
        <div className="lbg-charts">
          <ShareBars
            title="Online auctions in China"
            note="Two years, and the order flipped."
            rows={[
              { label: 'eBay 2003', value: 79, local: false },
              { label: 'eBay 2005', value: 36, local: false },
              { label: 'Taobao 2003', value: 8, local: true },
              { label: 'Taobao 2005', value: 59, local: true },
            ]}
          />
          <ShareBars
            title="Online shopping in China, end of 2018"
            note="Amazon closed its Chinese marketplace a few months later."
            rows={[
              { label: 'Tmall', value: 61.5, local: true },
              { label: 'JD.com', value: 24.2, local: true },
              { label: 'Amazon', value: 0.6, local: false },
            ]}
          />
        </div>
        <div className="lbg-wall">
          <span className="lbg-aside__k">Four more that hit the same wall</span>
          <div className="lbg-wall__row">
            {[
              ['Amazon', '0.6%', 'Market share when it closed the marketplace in 2019. Shopping in China is an event: Singles’ Day, flash deals, chatting to the seller.'],
              ['Home Depot', '7', 'Last big stores, shut in 2012. Labour is cheap, so people hire someone. The company called China a “do-it-for-me” market.'],
              ['Barbie', '2 yrs', 'For a six-floor Shanghai flagship. Parents would rather pay for extra lessons, and cute sold better than glamour.'],
              ['D&G', '58,000', 'Items pulled from one site in a day in 2018, after ads showing a Chinese model eating pizza with chopsticks.'],
            ].map(([who, n, what]) => (
              <div key={who} className="lbg-mini">
                <Stamp value={n} label={who} place="China" className="lbg-stamp--sm" />
                <p>{what}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lbg-aside">
          <span className="lbg-aside__k">The giant that got China right</span>
          <h4>KFC, 12,997 stores</h4>
          <p>
            KFC is China’s biggest fast food brand. The menu has rice dishes, congee for
            breakfast, pork, seafood and tea next to the fried chicken. Since 2016 it has been run
            by Yum China, a separate company that only has China to think about.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'philippines',
    country: 'Philippines',
    city: 'Manila',
    mark: '2024',
    coords: '14.60° N · 120.98° E',
    draw: Jeepney,
    landmark: 'A Manila jeepney',
    lon: 121, lat: 14.6,
    giant: 'McDonald’s',
    local: 'Jollibee',
    verdict: 'The local leads',
    years: 'Jollibee from 1978',
    stat: '50% vs 29%',
    statLabel: 'of the chicken and burger market',
    brought: 'McDonald’s, which even put spaghetti and fried chicken with rice on its local menu.',
    wanted: 'Food that tastes like a Filipino family party. Sweet spaghetti with hot dog slices, crispy chicken with rice, and a bee mascot at every kid’s birthday.',
    outcome: 'Jollibee holds about half the chicken and burger market to McDonald’s 29%, with 1,240 Jollibee stores at home in 2024.',
    lenses: ['Habits', 'Values'],
    system: 'Copying the local menu isn’t the same as being local. Jollibee got there first and owns the childhood memories, and no loyalty app can copy those.',
    extra: (
      <div className="lbg-charts lbg-charts--one">
        <ShareBars
          title="Chicken and burger fast food, Philippines"
          note="Jollibee’s home share against McDonald’s, as reported by Fortune."
          rows={[
            { label: 'Jollibee', value: 50, local: true },
            { label: 'McDonald’s', value: 29, local: false },
          ]}
        />
      </div>
    ),
  },
  {
    id: 'australia',
    country: 'Australia',
    city: 'Sydney',
    mark: '2008',
    coords: '33.86° S · 151.21° E',
    draw: OperaHouse,
    landmark: 'Sydney Opera House',
    lon: 151.2, lat: -33.9,
    place: 'l',
    giant: 'Starbucks',
    local: 'The corner café',
    verdict: 'Starbucks shrank',
    years: '2000–2008',
    stat: '61',
    statLabel: 'stores closed in one go, July 2008',
    brought: 'The global menu. Big, sweet, milky drinks in big cups, in the same store everywhere.',
    wanted: 'Australia already had a serious espresso culture. People had their local café and a barista who knew their order. A flat white beat a Frappuccino.',
    outcome: 'Shut about seven in ten stores. Sold the last 24 to the family that runs 7-Eleven Australia in 2014.',
    lenses: ['Habits'],
    system: 'Not every local winner is a company. Here it was thousands of small cafés. A loyalty app can’t beat a barista who already knows your name.',
  },
  {
    id: 'newzealand',
    country: 'New Zealand',
    city: 'Auckland',
    mark: '2019',
    coords: '36.85° S · 174.76° E',
    draw: SkyTower,
    landmark: 'Sky Tower and Rangitoto, Auckland',
    lon: 174.8, lat: -36.85,
    place: 't',
    giant: 'eBay',
    local: 'Trade Me',
    verdict: 'eBay never caught up',
    years: 'Trade Me from 1999',
    stat: 'NZ$2.56bn',
    statLabel: 'what Trade Me sold for in 2019',
    brought: 'eBay came in 2001. Trade Me’s founder Sam Morgan later said it launched in US dollars and assumed things like zip codes.',
    wanted: 'Kiwis wanted NZ dollars, local pickup and postage, and a site already full of local listings. Trade Me had all three.',
    outcome: 'Fairfax bought Trade Me for NZ$700 million in 2006. Apax Partners paid NZ$2.56 billion for it in 2019.',
    lenses: ['Money', 'Habits'],
    system: 'Currency, address formats and postage are just fields in a database. Get them wrong and locals notice on the first screen.',
  },
];

const ROUTE: RouteStop[] = STOPS.map((s, i) => ({ n: i + 1, name: s.country, lon: s.lon, lat: s.lat, place: s.place }));

// Years in the market. Starbucks Australia shrank rather than left, so its
// line ends at the year of the big closure.
const TIMELINE: { who: string; where: string; from: number; to: number; end: string }[] = [
  { who: 'Walmart', where: 'Germany', from: 1997, to: 2006, end: 'Sold to Metro' },
  { who: 'Walmart', where: 'South Korea', from: 1998, to: 2006, end: 'Sold to Shinsegae' },
  { who: 'Starbucks', where: 'Australia', from: 2000, to: 2008, end: 'Closed 61 stores' },
  { who: 'eBay', where: 'China', from: 2003, to: 2006, end: 'Lost to Taobao' },
  { who: 'Amazon', where: 'China', from: 2004, to: 2019, end: 'Closed the marketplace' },
  { who: 'Home Depot', where: 'China', from: 2006, to: 2012, end: 'Closed last 7 stores' },
  { who: 'Barbie', where: 'Shanghai', from: 2009, to: 2011, end: 'Flagship closed' },
  { who: 'Uber', where: 'Southeast Asia', from: 2013, to: 2018, end: 'Sold to Grab' },
  { who: 'Uber', where: 'China', from: 2014, to: 2016, end: 'Sold to Didi' },
  { who: 'Airbnb', where: 'China', from: 2015, to: 2022, end: 'Shut local listings' },
];
const T0 = 1995;
const T1 = 2025;
const pct = (y: number) => ((y - T0) / (T1 - T0)) * 100;

const BUYOUTS: [string, string, string][] = [
  ['Walmart', 'bought 77% of Flipkart', '$16bn'],
  ['Uber', 'bought Careem', '$3.1bn'],
  ['Uber', 'took 27.5% of Grab', 'and left'],
  ['Uber', 'took a 17.7% stake in Didi', 'and left'],
];

// The phone: each numbered thing on the screen matches a note beside it.
const FEATURES: { n: number; habit: string; feature: string; who: string }[] = [
  { n: 1, habit: 'People pay in cash', feature: 'Cash as a real payment option, and drivers who settle up at night', who: 'Flipkart, Grab, Careem' },
  { n: 2, habit: 'People want to talk before they buy', feature: 'A chat button on every listing', who: 'Taobao' },
  { n: 3, habit: 'People don’t trust paying a stranger', feature: 'Escrow. Hold the money until the buyer says it arrived', who: 'Alipay' },
  { n: 4, habit: 'The fastest ride is a bike or tuk-tuk', feature: 'Vehicle types and prices built for them', who: 'Grab, Gojek, PickMe' },
  { n: 5, habit: 'Not everyone reads English', feature: 'The whole app in local languages', who: 'PickMe' },
  { n: 6, habit: 'Food rules come from faith', feature: 'Menu data that tracks veg and non-veg', who: 'McDonald’s India' },
  { n: 7, habit: 'Prices are in the local currency', feature: 'Local currency, addresses and postage', who: 'Trade Me' },
];

const CHECKLIST = [
  'How do people here pay for this today? Not how they could pay. How they do pay.',
  'Who already does this here, even badly? A market stall, a call centre, a guy with a motorbike.',
  'What would our best feature look like to someone here? Friendly, or strange?',
  'Is there a food, faith, family or holiday rule we haven’t heard of yet?',
  'Who do people here trust, and what do we need to borrow from that trust?',
  'If a local copied us tomorrow and added one thing, what would that one thing be?',
];

type Scenario = { draw: Draw; where: string; plan: string; risk: string; local: string };

const TRY_IT: Scenario[] = [
  {
    draw: Taj,
    where: 'To India',
    plan: 'A New Zealand meal-kit company launches in India with its best sellers: lamb shanks, beef ragu and pork belly.',
    risk: 'Faith. Beef and pork are off the table for a big share of customers, and many households are fully vegetarian.',
    local: 'A veg-first menu, regional dishes, a clear veg and non-veg split, and cash on delivery.',
  },
  {
    draw: Sigiriya,
    where: 'To Sri Lanka',
    plan: 'A US food delivery app opens in Colombo with card-only payment and car-only riders.',
    risk: 'Money and Habits. Lots of people pay cash, and tuk-tuks and motorbikes are faster through Colombo traffic.',
    local: 'Cash on delivery, bike and tuk-tuk riders, and the app in Sinhala and Tamil.',
  },
  {
    draw: Burj,
    where: 'To the Gulf',
    plan: 'A European bank opens a digital-only branch in a Gulf country, offering interest-based savings and loans.',
    risk: 'Faith. Many customers want Islamic finance, which avoids interest.',
    local: 'Sharia-compliant products, Arabic first, and service hours that work around prayer times and Ramadan.',
  },
  {
    draw: Torii,
    where: 'To Japan',
    plan: 'An Australian online store launches in Japan with chatty, jokey emails and a no-questions returns page.',
    risk: 'Values. Customers expect formal, careful language and a high level of politeness from a shop.',
    local: 'Formal Japanese copy written by a native speaker, careful packaging, and service that apologises well.',
  },
];

/** A postcard scenario. Tap once for the risk, again for what a local would do. */
function TryCard({ n, draw, where, plan, risk, local }: Scenario & { n: number }) {
  const [step, setStep] = useState(0);
  const labels = ['The plan', 'What trips it', 'What a local would do'];
  const bodies = [plan, risk, local];
  const next = ['Tap for what trips it', 'Tap for the local move', 'Tap to start again'];
  return (
    <button
      type="button"
      className={`lbg-try lbg-try--${step}`}
      aria-label={`Scenario ${n}, ${where}: ${labels[step]}. ${bodies[step]}`}
      onClick={() => setStep(s => (s + 1) % 3)}
    >
      <span className="lbg-try__art" aria-hidden="true">
        <Landmark draw={draw} label="" />
      </span>
      <span className="lbg-try__top">
        <span className="lbg-try__where">{String(n).padStart(2, '0')} · {where}</span>
        <span className="tos-try__dots" aria-hidden="true">
          {[0, 1, 2].map(i => <span key={i} className={i <= step ? 'on' : ''} />)}
        </span>
      </span>
      <span className="lbg-try__label">{labels[step]}</span>
      <span className="lbg-try__body">{bodies[step]}</span>
      <span className="lbg-try__hint">{next[step]}</span>
    </button>
  );
}

const SOURCES: [string, string][] = [
  ['Walmart leaving Germany, AP via Lawrence Journal-World, July 2006', 'https://www2.ljworld.com/news/2006/jul/29/walmart_leaving_germany/'],
  ['German court ruling on Walmart’s code of ethics, WilmerHale, 2005', 'https://www.wilmerhale.com/en/insights/publications/ramifications-of-german-court-decision-on-an-employers-code-of-ethics-july-18-2005'],
  ['Uber acquires Careem for $3.1 billion, Wamda, March 2019', 'https://www.wamda.com/2019/03/uber-acquires-careem-3-1-billion'],
  ['Will cash on delivery kill Indian e-commerce?, YourStory, April 2016', 'https://yourstory.com/2016/04/cod-kill-indian-e-commerce/'],
  ['McDonald’s to open vegetarian-only restaurants in India, CS Monitor, 2012', 'https://csmonitor.com/Business/Latest-News-Wires/2012/0905/McDonald-s-to-open-vegetarian-only-restaurants-in-India'],
  ['PickMe adds Sinhala and Tamil to its app, Daily Mirror Sri Lanka', 'https://dailymirror.lk/print/ict/pickme-includes-sinhala-and-tamil-to-application/269-99899'],
  ['Uber sells Southeast Asia business to Grab, TechCrunch, March 2018', 'https://techcrunch.com/2018/03/25/gruber-official/'],
  ['Taobao, Wikipedia (eBay and Taobao market share 2003–2005)', 'https://en.wikipedia.org/wiki/Taobao'],
  ['Amazon closes China marketplace, Tmall and JD share, Coresight Research', 'https://coresight.com/research/amazon-to-close-china-marketplace-and-focus-on-cross-border-e-commerce-kindle-and-aws/'],
  ['The Home Depot closes seven big box stores in China, company release, 2012', 'https://ir.homedepot.com/news-releases/2012/09-13-2012'],
  ['Mattel is closing down Barbie’s Shanghai palace, AP via NBC News, 2011', 'https://www.nbcnews.com/id/wbna41956792'],
  ['E-commerce sites drop Dolce & Gabbana products, Caixin, November 2018', 'https://www.caixinglobal.com/2018-11-22/e-commerce-sites-drop-dolce-gabbana-products-as-public-outcry-grows-101350933.html'],
  ['Yum China Holdings, Form 10-K for 2025 (KFC store count)', 'https://www.sec.gov/Archives/edgar/data/1673358/000119312526082824/yumc-20251231.htm'],
  ['Jollibee, Fortune Asia, June 2024', 'https://fortune.com/asia/2024/06/17/jollibee-southeast-asia-500-jfc-ernesto-tanmantiong-acquisitions-global-brands/'],
  ['Withers family buys Starbucks Australia, SmartCompany, 2014', 'https://www.smartcompany.com.au/business-advice/franchising/rich-list-family-behind-australia-s-7-eleven-snaps-up-starbucks/'],
  ['Trade Me, Wikipedia', 'https://en.wikipedia.org/wiki/Trade_Me'],
  ['How a NZ internet entrepreneur took on a global giant, SmartCompany', 'https://www.smartcompany.com.au/finance/deal-of-a-lifetime/'],
  ['Didi to buy Uber’s China business, CNBC, August 2016', 'https://www.cnbc.com/2016/08/01/chinas-didi-chuxing-to-acquire-ubers-chinese-operations-wsj.html'],
  ['Airbnb to close its domestic business in mainland China, NBC News, 2022', 'https://www.nbcnews.com/news/amp/rcna30231'],
];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function LocalBeatsGlobalLesson() {
  return (
    <div>
      {/* ══ Before you fly ═══════════════════════════════════════════════ */}
      <section id="declare" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before you fly"
            title="Six things you can’t pack"
            aside="A product can cross a border in a day. These six don’t cross at all. Every stop on this trip tripped on at least one."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="lbg-tags">
            {LENSES.map((l, i) => (
              <li key={l.name} className="lbg-tag" style={{ ['--tilt' as string]: `${[-2, 1.5, -1, 2, -1.5, 1][i]}deg` }}>
                <span className="lbg-tag__hole" aria-hidden="true" />
                <span className="lbg-tag__top">
                  <LensIcon name={l.name} />
                  <span className="lbg-tag__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className="lbg-tag__name">{l.name}</span>
                <span className="lbg-tag__q">{l.q}</span>
                <span className="lbg-tag__eg">{l.eg}</span>
              </li>
            ))}
          </ol>
          <p className="bt-note" style={{ marginTop: 22 }}>
            None of these companies were stupid. They were very good at one country, and they
            assumed the next one would work the same way.
          </p>
        </Reveal>
      </section>

      {/* ══ The route ════════════════════════════════════════════════════ */}
      <section id="route" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="The route"
            title="Nine stops, west to east"
            aside="From Berlin to Auckland. At every stop a global giant met a local business. Sometimes the giant left, sometimes it shrank, and sometimes it just bought the local."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="lbg-map">
            <RouteMap stops={ROUTE} />
          </div>
          <ol className="lbg-stoplist">
            {STOPS.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => scrollTo(s.id)}>
                  <span className="bt-tnum">{i + 1}</span> {s.country}
                </button>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ══ The nine postcards ═══════════════════════════════════════════ */}
      <section id="stops" className="bt-sec lbg-stops">
        {STOPS.map((s, i) => (
          <article key={s.id} id={s.id} className={`lbg-stop${i % 2 ? ' lbg-stop--flip' : ''}`}>
            <Reveal>
              <header className="lbg-stop__head">
                <span className="lbg-stop__n bt-tnum">Stop {String(i + 1).padStart(2, '0')} / 09</span>
                <h2 className="lbg-stop__country">{s.country}</h2>
                <span className="lbg-stop__coords bt-tnum">{s.coords}</span>
              </header>
            </Reveal>
            <div className="lbg-stop__grid">
              <Reveal delay={0.04}>
                <figure className="lbg-card">
                  <div className="lbg-card__art">
                    <Landmark draw={s.draw} label={s.landmark} />
                  </div>
                  <figcaption className="lbg-card__cap">{s.landmark}</figcaption>
                  <Postmark place={s.city} year={s.mark} />
                  <Stamp value={s.stat} label={s.statLabel} place={s.country} />
                </figure>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="lbg-stop__text">
                  <p className="lbg-score">
                    <span className="lbg-score__giant">{s.giant}</span>
                    <span className="lbg-score__vs">vs</span>
                    <span className="lbg-score__local">{s.local}</span>
                  </p>
                  <p className="lbg-stop__meta">
                    <span className="lbg-verdict">{s.verdict}</span>
                    <span className="bt-tnum">{s.years}</span>
                  </p>
                  <div className="lbg-pair">
                    <div>
                      <span className="lbg-k">What they brought</span>
                      <p>{s.brought}</p>
                    </div>
                    <div>
                      <span className="lbg-k lbg-k--local">What people wanted</span>
                      <p>{s.wanted}</p>
                    </div>
                  </div>
                  <p className="lbg-outcome">{s.outcome}</p>
                  <div className="lbg-system">
                    <span className="lbg-system__k">The system lesson</span>
                    <p>{s.system}</p>
                  </div>
                  <ul className="lbg-lenses" aria-label="What tripped them">
                    {s.lenses.map(l => (
                      <li key={l}><LensIcon name={l} size={22} /> {l}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
            {s.extra && <Reveal delay={0.05}><div className="lbg-stop__extra">{s.extra}</div></Reveal>}
          </article>
        ))}
      </section>

      {/* ══ How long they lasted ═════════════════════════════════════════ */}
      <section id="timeline" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Time in the market"
            title="Ten flights home"
            aside="Each line runs from the year a giant arrived to the year it sold, shut or shrank. Amazon held on in China for fifteen years. Barbie lasted two."
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
                  <span className="lbg-time__who"><b>{t.who}</b> {t.where}</span>
                  <span className="lbg-time__track">
                    <span
                      className="lbg-time__bar"
                      style={{ left: `${pct(t.from)}%`, width: `${pct(t.to) - pct(t.from)}%` }}
                      title={`${t.who} in ${t.where}: ${t.from} to ${t.to}. ${t.end}.`}
                    />
                    <span className="lbg-time__end" style={{ left: `calc(${pct(t.to)}% + 12px)` }}>
                      <b className="bt-tnum">{t.to - t.from} yrs</b> {t.end}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <figcaption className="bt-note">
              Start is the year the company entered or bought in. End is the year it sold, shut,
              or (for Starbucks) closed most of its stores.
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="lbg-buy">
            <div className="lbg-buy__head">
              <span className="bt-eyebrow">If you can’t beat them</span>
              <h3>Buy them, or take a share and leave.</h3>
              <p>
                The same Walmart that lost Germany paid $16 billion to own India’s local winner.
                Sometimes the smartest move for a giant is to stop pretending to be local.
              </p>
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
          </div>
        </Reveal>
      </section>

      {/* ══ Culture in the system ════════════════════════════════════════ */}
      <section id="system" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Why this is an IS lesson"
            title="Culture ends up in the system"
            aside="Put every local winner’s best idea into one app and this is what you get. Each number on the screen is a local habit that became a feature."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="lbg-phonewrap">
            <ol className="lbg-notes">
              {FEATURES.slice(0, 4).map(f => (
                <li key={f.n}>
                  <span className="lbg-badge">{f.n}</span>
                  <div><b>{f.habit}</b><span>{f.feature}</span><em>{f.who}</em></div>
                </li>
              ))}
            </ol>
            <div className="lbg-phone" role="img" aria-label="A phone app that combines the local features: local languages, tuk-tuk and bike rides priced in rupees, cash payment, a veg label, payment held until delivery, and a chat button">
              <div className="lbg-phone__screen">
                <div className="lbg-phone__bar">
                  <span className="bt-tnum">9:41</span>
                  <span className="lbg-phone__lang">EN · සිං · தமி <i className="lbg-badge lbg-badge--sm">5</i></span>
                </div>
                <p className="lbg-phone__hi">Where to?</p>
                <div className="lbg-phone__field">Pickup: by the clock tower, opposite the bank</div>
                <div className="lbg-phone__rides">
                  <div className="on"><span>Tuk-tuk</span><b className="bt-tnum">Rs 380</b></div>
                  <div><span>Bike</span><b className="bt-tnum">Rs 290</b></div>
                  <div><span>Car</span><b className="bt-tnum">Rs 720</b></div>
                  <i className="lbg-badge lbg-badge--sm lbg-phone__b4">4</i>
                  <i className="lbg-badge lbg-badge--sm lbg-phone__b7">7</i>
                </div>
                <div className="lbg-phone__pay">
                  <span className="on">Cash</span><span>Card</span><span>Wallet</span>
                  <i className="lbg-badge lbg-badge--sm">1</i>
                </div>
                <div className="lbg-phone__order">
                  <p><b>Your order</b> · Lunch box, 2 items <span className="lbg-phone__veg" /> <i className="lbg-badge lbg-badge--sm">6</i></p>
                  <p className="lbg-phone__held">Payment held until you confirm it arrived <i className="lbg-badge lbg-badge--sm">3</i></p>
                  <span className="lbg-phone__chat">Message the seller <i className="lbg-badge lbg-badge--sm">2</i></span>
                </div>
                <span className="lbg-phone__go">Book tuk-tuk</span>
              </div>
            </div>
            <ol className="lbg-notes" start={5}>
              {FEATURES.slice(4).map(f => (
                <li key={f.n}>
                  <span className="lbg-badge">{f.n}</span>
                  <div><b>{f.habit}</b><span>{f.feature}</span><em>{f.who}</em></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="bt-pairgrid" style={{ marginTop: 30 }}>
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
            eyebrow="Before you board"
            title="Six stamps to collect first"
            aside="Use these on any launch, at any size. A café opening in a new suburb has the same problem on a smaller scale."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="lbg-passport">
            <span className="lbg-passport__k">Market entry · Visa page</span>
            <ol className="lbg-visas">
              {CHECKLIST.map((q, i) => (
                <li key={q} className={`lbg-visa lbg-visa--${i % 3}`} style={{ ['--tilt' as string]: `${[-1.5, 1, -0.5, 1.5, -1, 0.5][i]}deg` }}>
                  <span className="lbg-visa__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </div>
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
          <div className="lbg-trygrid">
            {TRY_IT.map((t, i) => <TryCard key={t.plan} n={i + 1} {...t} />)}
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
          ['Locals win on knowledge, not money.', 'Taobao, Jollibee, Grab, Flipkart, PickMe and Trade Me built around what their customers already did.'],
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
