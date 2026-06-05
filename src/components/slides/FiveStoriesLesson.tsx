// FiveStoriesLesson.tsx
// MBI800 · Strategic Information Systems
// "Five Stories That Changed Everything"

import { useState, useEffect, useRef } from 'react';
import type { ReactNode, CSSProperties } from 'react';

// ── Types ───────────────────────────────────────────────────────────────────

interface StoryStruggle {
  date: string;
  title: string;
  body: string;
}

interface StoryQuestion {
  q: string;
  text: string;
}

interface StoryMetric {
  value: string;
  label: string;
}

interface Story {
  id: string;
  name: string;
  emoji: string;
  year: string;
  tagline: string;
  color: string;
  colorDim: string;
  gradient: string;
  videoId: string;
  videoTitle: string;
  videoId2?: string;
  videoTitle2?: string;
  hook: string;
  problemParagraphs: string[];
  struggle: StoryStruggle[];
  breakthrough: string[];
  insight: string;
  isHeading: string;
  isBody: string[];
  isConcepts: string[];
  metrics: StoryMetric[];
  impact: string[];
  quote: string;
  takeaway: string;
  questions: StoryQuestion[];
}

// ── Story Data ──────────────────────────────────────────────────────────────

const STORIES: Story[] = [
  {
    id: 'airbnb',
    name: 'Airbnb',
    emoji: '🏠',
    year: '2007',
    tagline: 'Trust Can Be Designed',
    color: '#FF5A5F',
    colorDim: 'rgba(255,90,95,0.10)',
    gradient: 'linear-gradient(135deg, #FF5A5F 0%, #E61E4D 100%)',
    videoId: 'dZ8llodSZAA',
    videoTitle: 'Airbnb Founders: Brian Chesky & Joe Gebbia — Documentary',

    hook: 'Two broke designers. Three air mattresses. A $1,150 rent bill due on Friday. And the idea that became a $75 billion company.',

    problemParagraphs: [
      'October 2007. San Francisco. Brian Chesky and Joe Gebbia had just moved from New York with big dreams and nearly empty bank accounts. The rent was $1,150 a month. They didn\'t have it.',
      'A design conference was arriving that weekend. Every hotel in the city was sold out. Attendees were considering sleeping in parks.',
      'They looked at the air mattresses piled in their living room and asked a question nobody had seriously asked before: "What if we rented out space in our apartment to strangers?"',
      'They built a simple website over the weekend. Three people showed up — a 30-year-old from Utah, a 35-year-old from Boston, a 45-year-old father from India. Each paid $80. The rent got paid.',
      'Here is what\'s easy to miss in that story: the spare mattress was just the vehicle. The actual problem they were solving was something far older and far harder — how do you get a complete stranger to trust you enough to sleep in their home? Banks have tried for centuries. Governments have built entire legal systems around it. Airbnb found a way to engineer it.',
    ],

    struggle: [
      {
        date: 'Early 2008',
        title: 'Launched to silence',
        body: 'They relaunched at SXSW in Austin expecting to be discovered. A traffic spike for a few days — then near-complete silence. The world wasn\'t ready, or the product wasn\'t ready for the world. Possibly both.',
      },
      {
        date: 'Mid 2008',
        title: 'Seven investors, seven rejections, $20,000 in credit card debt',
        body: 'Seven separate investors passed. Not "let\'s revisit this later." Just no. The founders maxed out credit cards to keep the company alive. At the lowest point, they were eighteen months from being forced to quit.',
      },
      {
        date: 'Late 2008',
        title: 'They sold breakfast cereal',
        body: 'In a stroke of creative desperation, they designed novelty election cereal boxes — "Obama O\'s" and "Cap\'n McCain\'s" — and sold them for $40 each. They raised nearly $30,000. Paul Graham at Y Combinator saw the stunt and said: "If you can convince people to pay $40 for cereal, maybe you can build a company." They got into YC, and that changed everything.',
      },
    ],

    breakthrough: [
      'The real breakthrough was not a product feature. It was a plane ticket.',
      'In early 2009, the founders noticed something strange in their data. New York had listings. New York had searches. The bookings weren\'t converting. They didn\'t know why.',
      'So Brian Chesky flew to New York and went door-to-door to visit their hosts personally. He looked at the listings with fresh eyes — and immediately understood. The photos were terrible. Blurry phone pictures of unmade beds taken from awkward angles. Who would trust a stranger\'s home based on that?',
      'He rented a professional camera and started photographing apartments himself — one by one, completely manually. Within weeks, New York revenue doubled.',
      'The lesson struck like a lightning bolt: data tells you where a problem exists. Human presence tells you what the problem actually is. And sometimes the only way to build something that works at global scale is to do something completely unscalable first — to show up, sit down, and look.',
      'But the bigger insight was about trust itself. Not beds. The entire product\'s job, they realised, was to take trust — that fragile, ancient, deeply human thing — and make it manufacturable. Photos. Reviews. Verified identities. Secure payments. Each element a piece of the trust architecture, working together.',
    ],

    insight: 'It was never about beds. It was about making two strangers trust each other — and the beds took care of themselves.',

    isHeading: 'The Architecture of Trust',
    isBody: [
      'Airbnb is technically a two-sided marketplace — hosts on one side, guests on the other. But that description undersells the thing entirely. What makes Airbnb difficult to replicate is what sits in the middle: the trust layer.',
      'Reviews flow in both directions. Hosts rate guests. Guests rate hosts. Both are visible before a booking is confirmed. The platform accumulates a reputation score for every participant over time.',
      'Payment is held in escrow. Funds don\'t reach the host until 24 hours after check-in. This removes the most ancient barrier to trust between strangers: "What if I pay and the place is nothing like the photos?"',
      'The result is a self-reinforcing network effect: more hosts attract more guests, which attract more hosts. The platform becomes more valuable to everyone as it grows — and that growth makes it increasingly hard for a competitor to displace them. Not because Airbnb is cheaper, but because it\'s more trusted.',
      'The part that often surprises people: Airbnb owns none of the inventory. Not a single bedroom. Not a single sheet. Every asset on the platform belongs to someone else. That\'s how they scaled from 3 listings to 8 million without buying a single building. The information system is the business.',
    ],

    isConcepts: ['Two-Sided Marketplace', 'Network Effects', 'Trust Infrastructure', 'Asset-Light Platform', 'Escrow Payments', 'Long-Tail Supply'],

    metrics: [
      { value: '8M+', label: 'Active listings worldwide' },
      { value: '220+', label: 'Countries & regions' },
      { value: '$75B', label: 'Market capitalisation' },
      { value: '5M+', label: 'Hosts worldwide' },
    ],

    impact: [
      'From three air mattresses on a San Francisco floor to 8 million listings across 220 countries. In December 2020, Airbnb went public on NASDAQ — one of the most anticipated IPOs of the year — at a valuation that made it worth more than most of the world\'s major hotel chains combined.',
      'The hotel industry spent years trying to lobby Airbnb out of existence. Instead, Airbnb changed the definition of what a hotel is.',
    ],

    quote: '"We didn\'t build a place to stay. We built a reason for two strangers to trust each other — and the beds took care of themselves."',
    takeaway: 'Trust is not just an emotion. It is an architecture. The information system is what creates it, at scale, between strangers.',

    questions: [
      { q: 'Q1 — The Real Moat', text: 'If regulators forced full review-history portability to rival platforms, would Airbnb\'s defensibility survive? Where does its real strategic moat actually live?' },
      { q: 'Q2 — Do Things That Don\'t Scale', text: 'Brian Chesky flew to New York to photograph apartments himself — the ultimate unscalable act. Why did that decision unlock scale? What principle does it represent, and where could you apply it in your own industry?' },
      { q: 'Q3 — The Liability of Light Assets', text: 'Airbnb owns nothing and depends entirely on millions of independent hosts. Where does asset-light become a strategic liability rather than a strength?' },
    ],
  },

  {
    id: 'netflix',
    name: 'Netflix',
    emoji: '🎬',
    year: '1997',
    tagline: 'Disrupt Yourself Before Someone Else Does',
    color: '#E50914',
    colorDim: 'rgba(229,9,20,0.10)',
    gradient: 'linear-gradient(135deg, #E50914 0%, #B0060F 100%)',
    videoId: 'MsePnZjaaRA',
    videoTitle: 'The Story of Reed Hastings, Co-founder of Netflix',

    hook: 'A $40 late fee for a forgotten copy of Apollo 13. One irritated drive to the gym. The end of an entire industry.',

    problemParagraphs: [
      'The late fee was Blockbuster\'s real business model. In some years, late-return penalties accounted for over 16% of their total revenue. Their entire operation — the due dates, the reminder calls, the penalty counters — was a machine designed to extract money from human forgetfulness.',
      'Reed Hastings returned a video weeks overdue in 1997, paid $40, and on the drive home did the kind of arithmetic that changes industries: "What if you just paid a monthly fee and kept movies as long as you wanted?"',
      'He co-founded Netflix with Marc Randolph that same year. They started by mailing DVDs — physical discs, in red envelopes, through the post. It was slow and clunky and nothing like the on-demand future Hastings was imagining. But it was different in one crucial way: no due dates, no late fees.',
      'The constraint he was removing wasn\'t inconvenience. It was psychological tax. Every video rental carried a background anxiety: return it on time or pay the penalty. Netflix removed that anxiety entirely — and customers noticed.',
    ],

    struggle: [
      {
        date: '1997–1999',
        title: 'Pay-per-disc: the thing they were replacing',
        body: 'The original model had due dates and per-disc fees. It looked too much like Blockbuster by mail. Customers liked the no-late-fee angle, but barely anyone signed up. The product needed a bigger idea.',
      },
      {
        date: '2000',
        title: 'The dot-com crash nearly ended it',
        body: 'When the bubble burst, Netflix was burning cash fast. They laid off a third of their staff. The founders were seriously debating whether to shut the whole thing down.',
      },
      {
        date: '2000',
        title: 'Blockbuster laughed them out of the room',
        body: 'Hastings flew to Dallas and offered to sell Netflix to Blockbuster for $50 million. The Blockbuster executives thought it was so absurd they reportedly laughed. Hastings flew home and decided to build the thing that would destroy them instead. Blockbuster filed for bankruptcy in 2010.',
      },
    ],

    breakthrough: [
      'There were two breakthroughs, and they happened in what felt like the wrong order.',
      'The first was the subscription model in 1999 — flat monthly fee, no due dates, no penalties. This completely changed the relationship with the customer. No friction, no anxiety. Just movies.',
      'The second was streaming in 2007, a decade after founding. Limited catalogue, ugly interface, nothing like the vision. But Hastings understood what most people missed: the DVD was always a compromise. The real business was getting exactly the right film to exactly the right person at exactly the right moment.',
      'But neither of those was the most important breakthrough. The most important breakthrough was a decision.',
      'In 2011, Netflix announced it would split into two separate companies — one for DVDs, one for streaming. The backlash was immediate and brutal. They lost 800,000 subscribers in a single quarter. The stock fell 75%. Analysts declared the company finished.',
      'They reversed the structural split — but they kept the streaming-first strategy. They were willing to set fire to the most profitable thing they\'d ever built because they could see something better forming in the smoke.',
      'That decision — to deliberately cannibalise your own success before a competitor does it for you — is one of the hardest things a business can do. And Netflix did it not once, but twice. The second time was when they stopped licensing content and started producing their own. House of Cards. Orange is the New Black. Stranger Things. They were no longer just a distributor. They were a studio. And their viewing data — millions of signals from hundreds of millions of subscribers — told them exactly which stories would land.',
    ],

    insight: 'Remove every penalty. Let the data find the films no shelf could ever hold. Then disrupt yourself before someone else can.',

    isHeading: 'The Data Flywheel',
    isBody: [
      'Netflix\'s information system is not a marketplace. It is a data flywheel — a self-reinforcing feedback loop that gets smarter with every play button pressed.',
      'Every time you watch something — every pause, every rewind, every show you get halfway through and abandon — the system is learning. Not just what you enjoyed, but what viewing signals predict what you\'ll enjoy next. That\'s a completely different kind of intelligence.',
      'The recommendation engine processes billions of viewing events across hundreds of millions of members. It builds a unique taste model for each subscriber. Then it builds a unique version of your homepage — your Netflix, different from everyone else\'s.',
      'The flywheel: more subscribers → more viewing data → better recommendations → better retention → more subscribers. Each revolution of the loop makes the system smarter, stickier, and harder to replicate.',
      'The data doesn\'t stop at recommendations. It drives production decisions. When Netflix greenlighted House of Cards, they didn\'t just bet on creative instinct. They looked at the numbers: British political dramas retained subscribers. David Fincher\'s films drove completion rates. Kevin Spacey\'s performances scored well with their highest-value segments. The data said: make this. And it worked.',
      'This is the information system. Not a technology feature — a feedback loop that connects every viewer\'s behaviour to every creative and commercial decision the company makes.',
    ],

    isConcepts: ['Data Flywheel', 'Personalisation at Scale', 'Long-Tail Economics', 'Self-Disruption', 'Vertical Integration', 'Subscription Economics'],

    metrics: [
      { value: '300M+', label: 'Paid memberships' },
      { value: '190+', label: 'Countries' },
      { value: '$45B', label: 'Annual revenue (2025)' },
      { value: '#1', label: 'Most-subscribed streaming platform globally' },
    ],

    impact: [
      'The company that Blockbuster laughed out of a Dallas conference room now earns roughly $45 billion a year and operates in 190+ countries. Blockbuster filed for bankruptcy in 2010. The last remaining Blockbuster store — a single location in Bend, Oregon — became a tourist destination.',
      'Netflix didn\'t just beat Blockbuster. It invented a new relationship between humans and entertainment: no ownership, no scheduling, no waiting. The next episode is always ready. The algorithm knows what you want. The penalty is gone.',
    ],

    quote: '"Everyone protects the business that pays the bills today. We learned to set ours on fire — on purpose — the moment we saw something better forming in the smoke."',
    takeaway: 'The hardest disruption is self-disruption. Data tells you what\'s coming. Courage is acting on it before you\'re forced to.',

    questions: [
      { q: 'Q1 — Information vs Incentives', text: 'Blockbuster declined Netflix and went bankrupt. Was that a failure of information (they didn\'t see streaming coming) or a failure of incentives (late fees were too profitable to abandon)?' },
      { q: 'Q2 — The Case Against Self-Disruption', text: 'Netflix deliberately cannibalised its profitable DVD business for streaming in 2007. Build the strongest possible case *against* that decision as it would have appeared to an investor at the time.' },
      { q: 'Q3 — When Data Steers Creativity', text: 'Netflix lets viewing data drive which originals to greenlight. What are the strategic risks of letting an algorithm guide creative decisions at a studio?' },
    ],
  },

  {
    id: 'xero',
    name: 'Xero',
    emoji: '📊',
    year: '2006',
    tagline: 'Empower the Middleman',
    color: '#13B5EA',
    colorDim: 'rgba(19,181,234,0.10)',
    gradient: 'linear-gradient(135deg, #13B5EA 0%, #0E8FBD 100%)',
    videoId: '7_RlH2jMeGw',
    videoTitle: 'From Small NZ Startup to Global Success — The Rise of Xero',

    hook: 'The internet had transformed everything. Except the ledger — still trapped on one desktop and emailed around town like a parcel.',

    problemParagraphs: [
      'Picture this: it\'s 2006. A small business owner finishes her Tuesday morning by emailing a spreadsheet to her accountant. The accountant downloads it, opens it in a different version of Excel, fixes a formula that broke in transit, does the work, and emails it back. The business owner opens the file, realises it\'s an older version, and the whole process starts again.',
      'Google is eight years old. The internet has existed for fifteen years. And the humble accounting ledger — arguably the most important document a small business produces — is still being passed around like a hot potato, getting corrupted and duplicated with every handoff.',
      'Rod Drury had been building software his whole career. He looked at this and thought: this is absurd. The ledger should live in the cloud, belong to no single machine, and be visible to everyone who needs it — the business owner on their phone, the accountant in their office, the bank in its data centre — simultaneously, in real time.',
      'He co-founded Xero in Wellington, New Zealand in 2006, alongside a chartered accountant named Hamish Edwards. That pairing was crucial: a technologist who understood cloud architecture, and an accountant who understood exactly what small business owners actually needed from their numbers.',
    ],

    struggle: [
      {
        date: '2007',
        title: 'An "outrageous" IPO — with under 100 customers',
        body: 'Before meaningful revenue, before real traction, Xero listed on the New Zealand Stock Exchange and raised NZ$15 million. Critics called it reckless. Financial journalists called it a gamble. Drury called it strategic: he needed enough runway to outlast a very slow, trust-based market where behaviour change takes years.',
      },
      {
        date: '2008',
        title: 'Listed directly into the global financial crisis',
        body: 'Months after their IPO, the global financial system collapsed. A tiny Wellington startup burning through investor money while markets were melting down — the kind of environment that killed ten companies a week.',
      },
      {
        date: '2008–2013',
        title: 'Five years of losses and unglamorous door-knocking',
        body: 'Convincing accountants — conservative professionals who had trusted the same desktop software for twenty years — to switch to "the cloud" was not a dramatic pivot. It was five years of patient, one-conversation-at-a-time relationship-building. Not exciting. Just necessary.',
      },
    ],

    breakthrough: [
      'Every technology consultant in Silicon Valley would have told you the same thing: if you\'re selling to small businesses, go around the gatekeepers. Don\'t waste time on accountants. Go directly to the business owner.',
      'Xero did the opposite. And it changed everything.',
      'The breakthrough insight was this: the accountant is not the obstacle to bypass. The accountant is the supercharged distribution channel — if you give them tools worth loving.',
      'Small business owners trust their accountants the way patients trust their doctors. A recommendation from an accountant is not a suggestion — it\'s an instruction. And accountants have deep, ongoing relationships with dozens or hundreds of clients at once.',
      'So Xero didn\'t try to disintermediate accountants. They designed the product to give accountants genuine superpowers: faster workflows, real-time client visibility, automated reconciliation, advisory dashboards. They built a certification programme. They created an advisor community. They made accountants into ambassadors.',
      'And once an accountant converted to Xero, they didn\'t just switch personally. They migrated their entire client base. One accountant. Thirty clients. Forty clients. The flywheel accelerated not through advertising, but through the oldest distribution channel in business history: trusted professional recommendation.',
    ],

    insight: 'The accountant wasn\'t the obstacle to bypass. The accountant was the most powerful distribution channel available — once you gave them tools worth loving.',

    isHeading: 'One Source of Truth',
    isBody: [
      'Xero\'s information system is built around one simple but powerful idea: a single source of truth.',
      'Before Xero, a small business had multiple conflicting versions of its financial reality — one in the accountant\'s Excel file, one in the owner\'s email, one in the bank\'s records. These versions conflicted. Data-entry errors multiplied. Decisions were made on numbers that were days or weeks out of date.',
      'The cloud ledger eliminates the multiplicity. There is one ledger. It lives online. Bank feeds flow into it automatically — no manual data entry required. Invoices, bills, payroll, and point-of-sale data all land in the same place. The business owner sees the same numbers as the accountant, right now, on any device.',
      'The open API turned this ledger into an ecosystem. Over 1,000 apps connect to Xero — payroll systems, inventory tools, expense trackers, point-of-sale platforms. Each feeds data into the ledger. The ledger becomes the central hub of the small business\'s entire financial life.',
      'And here\'s the strategic consequence: switching costs compound with every connection. Once your bank feed, payroll, invoicing, and accountant relationship are all wired into Xero, leaving is not just inconvenient — it is architecturally painful. That is not a lock-in trick. That is the natural gravity of becoming infrastructure.',
    ],

    isConcepts: ['Single Source of Truth', 'Cloud / SaaS', 'Open API Ecosystem', 'Channel Strategy', 'Switching Costs', 'Network Effects'],

    metrics: [
      { value: '4.4M+', label: 'Subscribers worldwide' },
      { value: 'NZ$2.1B', label: 'Annual revenue (FY25)' },
      { value: '180+', label: 'Countries' },
      { value: '#1', label: 'Cloud accounting platform in NZ, AU & UK' },
    ],

    impact: [
      'From Wellington, New Zealand — one of the most geographically remote technology hubs on Earth — Xero became a global platform serving 4.4 million subscribers. It is now one of New Zealand\'s most valuable companies, listed on the Australian Securities Exchange, and used in accountancy practices from London to Singapore to São Paulo.',
      'The lesson for anyone who thinks geography is destiny: a good idea, ruthlessly executed from the bottom of the world, can travel anywhere the internet goes.',
    ],

    quote: '"We didn\'t beat the accountants. We handed them superpowers — and they carried our little Wellington startup to the rest of the world."',
    takeaway: 'Empower the middleman instead of bypassing them. The right intermediary, properly equipped, becomes your most powerful distribution engine.',

    questions: [
      { q: 'Q1 — Co-opt or Bypass?', text: 'Xero turned the people it might have disrupted into its primary sales channel. When is co-opting an intermediary strategically superior to bypassing them — and when does it create dangerous dependency?' },
      { q: 'Q2 — The Pre-Revenue IPO', text: 'Xero listed publicly with essentially no revenue. Evaluate the strategic trade-offs of an early IPO versus prolonged private funding for a capital-intensive platform business.' },
      { q: 'Q3 — AI and the Ledger', text: 'As AI agents begin to automate bookkeeping itself, which parts of Xero\'s strategic moat grow stronger, and which parts become vulnerable? Where does the advantage shift?' },
    ],
  },

  {
    id: 'canva',
    name: 'Canva',
    emoji: '🎨',
    year: '2007',
    tagline: 'Open the Gate',
    color: '#7D2AE8',
    colorDim: 'rgba(125,42,232,0.10)',
    gradient: 'linear-gradient(135deg, #00C4CC 0%, #7D2AE8 100%)',
    videoId: 'AF0hCZwpAtg',
    videoTitle: 'How Melanie Perkins Turned Canva From a College Project Into a $42 Billion Company',
    videoId2: 'GUjt0iRJ3eo',
    videoTitle2: 'Canva Founder Story — Additional Context',

    hook: 'A nineteen-year-old in Perth, watching classmates spend a whole semester learning design software, thinking: this should not be that hard for anyone.',

    problemParagraphs: [
      'She was nineteen, sitting in her mother\'s living room in Perth, Western Australia — one of the most geographically isolated cities on the planet — and she was watching university classmates struggle with design software.',
      'Melanie Perkins wasn\'t struggling herself. She was frustrated on behalf of everyone else. Tools like Photoshop and InDesign were extraordinarily powerful. They were also extraordinarily hostile to anyone who wasn\'t already an expert. The learning curve was a cliff. Most people gave up before they produced anything they\'d want to share.',
      'She thought: what if design were like typing? Everyone can type. You don\'t need a degree. You just sit down and start. What if anyone could create something beautiful in the time it takes to make a coffee?',
      'In 2007, she started testing the idea with Fusion Books — a platform for high-school students to design their own yearbooks. It was small. It was local. It was entirely unsexy. But every yearbook was a data point: proof that ordinary people, given the right tools, could design things they were genuinely proud of. The market that "didn\'t exist" was real, and she could see it.',
    ],

    struggle: [
      {
        date: '2007–2012',
        title: 'The long proving ground',
        body: 'For five years, Perkins ran Fusion Books while pitching the bigger vision. School yearbooks in Western Australia. Not the story Silicon Valley wanted to hear. But every completed yearbook was evidence.',
      },
      {
        date: '2010–2013',
        title: 'More than one hundred rejections',
        body: 'Investor after investor said no. Not a polite "maybe later." Just no. "The market doesn\'t exist." "People use Photoshop." "We don\'t see the opportunity." Over one hundred no\'s, across three years.',
      },
      {
        date: '2012',
        title: 'She learned to kitesurf to get a single meeting',
        body: 'One key investor, Bill Tai, ran his professional network through kitesurfing retreats in Hawaii. Melanie Perkins did not kitesurf. She learned. She flew to Hawaii, pitched between sessions in a wetsuit, soaking wet, and finally got the connection that opened Silicon Valley. That is not a story about persistence alone — it is a story about manufacturing access where you have none.',
      },
    ],

    breakthrough: [
      'The breakthrough was not a product decision. It was a positioning decision.',
      'Every design tool before Canva had been built for designers. Its complexity was a feature — it kept non-designers out, which kept the output quality high, which justified the professional price tag.',
      'Canva\'s insight was the inverse: the complexity is the bug, not the feature. There are hundreds of millions of people worldwide who need to create visuals — social posts, presentations, flyers, invitations — who will never master Photoshop. They will settle for bad design, or they will pay someone, or they will simply not bother.',
      'What if you hid the professional complexity behind a simple interface? What if you gave non-designers the outcome — polished, professional-looking results — without requiring them to understand the underlying craft?',
      'The template is the breakthrough. Not a feature in the traditional software sense. A philosophy. We encode what professional designers know into reusable starting points. You pick a template, swap the words and images, and the hard decisions — typography, colour theory, spacing — have already been made by someone who knows what they\'re doing.',
      'Canva launched in 2013. It hit 750,000 users in its first year.',
      'The growth engine underneath: every design exported from Canva carries "Made with Canva" in the corner. Every person who shares it shows the product to the next potential user. Every design is simultaneously a creative output and a free advertisement. This is product-led growth at its purest — the product markets itself, at zero marginal cost, to precisely the right audience.',
    ],

    insight: 'Hide the complexity. Open the gate. The market everyone said didn\'t exist comes flooding through the moment you remove the barrier.',

    isHeading: 'The Design Engine: Supply Meets Simplicity',
    isBody: [
      'Canva is a two-sided marketplace, but the supply side is nearly invisible to most users.',
      'On one side: contributors — designers, photographers, illustrators — who upload templates, stock images, fonts, and graphic elements. They earn a payment every time their work is used in a paid design.',
      'On the other side: users — hundreds of millions of non-designers — who pick from those assets to create things they would never have made with professional tools.',
      'In the middle: the design engine. A drag-and-drop interface that presents professional-grade complexity in a way that feels effortless. The underlying technology is sophisticated. The experience is intentionally simple. That gap — between technical complexity and perceived simplicity — is the product.',
      'The growth flywheel is two-sided as well: more users create more designs, which creates more brand awareness through sharing, which brings more users. More contributors upload more assets, which makes the platform more valuable, which attracts more contributors.',
      'The freemium model layers on top: the basic tool is completely free, driving mass adoption at scale. Premium features — brand kits, premium stock, team collaboration tools — convert power users into paying subscribers. Inside 95% of the Fortune 500, teams are now paying Canva for exactly those features — without IT ever making a formal procurement decision. The product sold itself, from the bottom up.',
    ],

    isConcepts: ['Two-Sided Marketplace', 'Freemium Model', 'Product-Led Growth', 'Democratisation', 'Network Effects', 'Viral Distribution'],

    metrics: [
      { value: '260M+', label: 'Monthly active users' },
      { value: '$42B', label: 'Valuation' },
      { value: '95%', label: 'Of Fortune 500 companies use Canva' },
      { value: '190+', label: 'Countries' },
    ],

    impact: [
      'From a living room in Perth to a $42 billion valuation and 260 million monthly active users. Canva is now used inside 95% of the Fortune 500 — not because anyone sold it to enterprises, but because individual employees adopted it from the ground up, one team at a time, without asking IT\'s permission.',
      'That is the ultimate expression of product-led growth: a tool that sells itself to anyone, anywhere, without a single sales call.',
    ],

    quote: '"A hundred people told me it would never work. They weren\'t describing my idea — they were describing the size of their own imagination. So I built it anyway."',
    takeaway: 'Every industry has expertise that gatekeepers treat as their advantage. Ask: what happens to the market when you make that expertise accessible to everyone?',

    questions: [
      { q: 'Q1 — Product-Led Growth Limits', text: 'Canva\'s engine is "every design is an advertisement." Why can product-led viral growth build a stronger position than paid marketing — and where does it stall or fail?' },
      { q: 'Q2 — AI and the Design Tool', text: 'Generative AI can now create polished designs from a text prompt, threatening the skill Canva made accessible. Does AI strengthen Canva\'s ecosystem — or fundamentally commoditise it?' },
      { q: 'Q3 — Manufacturing Access', text: 'Beyond "persistence," what specific transferable tactics did Perkins use to overcome a complete lack of network and credibility? How would you apply those tactics in your own context?' },
    ],
  },

  {
    id: 'alibaba',
    name: 'Alibaba',
    emoji: '🌏',
    year: '1999',
    tagline: 'Build the Rails No One Else Will',
    color: '#FF6A00',
    colorDim: 'rgba(255,106,0,0.10)',
    gradient: 'linear-gradient(135deg, #FF8C2A 0%, #FF6A00 100%)',
    videoId: 'SWVERy9bQZs',
    videoTitle: 'The Full Story of Jack Ma & Alibaba',

    hook: 'A former English teacher in a cramped Hangzhou apartment, telling seventeen friends that one day Chinese companies would sell to the entire world.',

    problemParagraphs: [
      'Hangzhou, 1999. Jack Ma gathers seventeen friends in a small apartment and gives a speech that lasts two hours. The vision: Chinese manufacturers — the factories and workshops that make most of the world\'s physical goods — should be able to sell directly to global buyers, without middlemen, without language barriers, without needing a physical presence abroad.',
      'This was, by any rational measure, a completely impossible idea. China\'s internet penetration was under 2%. Most of the factories he was imagining didn\'t have computers. E-commerce in the West was barely established. In China, it didn\'t exist.',
      'Ma had failed his university entrance exams twice. He\'d been rejected by 23 of the 24 jobs he applied for at a single KFC hiring event. Harvard turned him down ten times. An earlier internet venture had collapsed completely. Every objective indicator suggested this was not the person who would build the world\'s largest e-commerce platform.',
      'But Ma had seen the internet on a trip to Seattle in 1995. He\'d searched for "beer" and found no results from China. He\'d searched for "China" and found almost nothing. An entire nation — a billion people, the factory of the world — was completely invisible to the global digital economy.',
      'He thought: I can fix that.',
    ],

    struggle: [
      {
        date: 'Pre-1999',
        title: 'A serial reject — by almost everyone',
        body: 'Failed university exams twice. Rejected from 23 of 24 KFC jobs at a single hiring session. Harvard rejected him ten times. An earlier internet company failed completely. The biographical record of someone who had every statistical reason to give up, far earlier.',
      },
      {
        date: '2000–2001',
        title: 'The dot-com crash drained everything',
        body: 'The collapse of internet valuations was global and brutal. Alibaba was burning through cash with no clear path to revenue. Morale cratered. The company had to cut costs drastically just to survive — and even then, survival was not guaranteed.',
      },
      {
        date: '2002–2004',
        title: 'eBay invaded China with overwhelming force',
        body: 'eBay entered China with deep pockets, existing infrastructure, and global brand recognition. They dominated quickly. Analysts wrote Alibaba off. Ma\'s response was to make his consumer platform — Taobao — completely free to sellers, directly targeting eBay\'s commission-based revenue model. It was a financial sacrifice that would drain eBay\'s China business entirely over the next three years.',
      },
    ],

    breakthrough: [
      'The breakthrough that defined Alibaba was not the marketplace itself. It was a payments system that nobody else wanted to build.',
      'In 2003, the fundamental problem with e-commerce in China was not product availability or internet access. It was trust. Specifically: how does a buyer in Beijing send money to a seller in Guangdong before the goods arrive? And how does the seller know the payment is real?',
      'In the West, credit cards and established financial infrastructure provided a trust layer. In China in 2003, most people didn\'t have credit cards. Most small sellers didn\'t have bank accounts that could receive digital payments. The infrastructure simply didn\'t exist.',
      'So Ma built it.',
      'Alipay launched in 2004 with a mechanism that was elegantly simple: the buyer deposits money into an escrow account held by Alibaba. The seller ships the goods. The buyer confirms receipt. Then — and only then — Alibaba releases the money to the seller.',
      'Neither party had to trust the other. Both parties had to trust the platform. And the platform made itself trustworthy by holding the money in the middle.',
      'This was the masterstroke. Not a feature — a piece of financial infrastructure that no bank wanted to build, no government was providing, and no competitor bothered to attempt. By building the rails nobody else would lay, Alibaba made itself the essential foundation of Chinese e-commerce.',
      'SoftBank\'s Masayoshi Son had invested $20 million after approximately six minutes of conversation in 2000. He later said he hadn\'t seen a plan. He\'d seen Ma\'s eyes — and bet on the person.',
    ],

    insight: 'Build the trust infrastructure nobody else will. Hold the money in the middle, and two strangers on opposite sides of the world can finally do business.',

    isHeading: 'A Digital Ecosystem, Not a Marketplace',
    isBody: [
      'What makes Alibaba remarkable as an information system is not the marketplace — it\'s the ecosystem that grew around it.',
      'The core platform (Taobao for consumers, Alibaba.com for B2B transactions) creates the classic two-sided value: connect sellers and buyers at massive scale. But the IS architecture goes several layers deeper.',
      'Alipay handles the financial layer — payments, escrow, credit scoring, micro-insurance. Cainiao handles the logistics layer — a data platform that coordinates deliveries across dozens of carriers and optimises routing in real time. Alibaba Cloud provides the infrastructure layer — the computing power that runs not just Alibaba\'s own platforms, but businesses across China and 29 other markets.',
      'The genius is integration. Each layer feeds the others. Payment data informs credit scoring. Logistics data informs inventory recommendations. Cloud services enable more sellers to build digital operations, which creates more transactions, which generates more data, which improves every layer.',
      'On Singles\' Day — the annual shopping festival Alibaba invented — the platform processes more transactions in 24 hours than most countries\' entire GDP for a week. That volume is only possible because the information system is the infrastructure, not an application running on top of it.',
    ],

    isConcepts: ['Digital Ecosystem', 'Trust Infrastructure', 'Fintech & Escrow', 'Two-Sided Marketplace', 'Platform Moats', 'Network Effects'],

    metrics: [
      { value: '1B+', label: 'Annual active consumers' },
      { value: '$25B', label: 'Record 2014 IPO (largest in history at the time)' },
      { value: '200+', label: 'Countries reached' },
      { value: '29', label: 'Alibaba Cloud regions globally' },
    ],

    impact: [
      'The English teacher who couldn\'t get a job at KFC built a digital economy serving more than a billion people and staged the largest IPO in recorded history when Alibaba listed on the New York Stock Exchange in 2014.',
      'China\'s factories — invisible to the global digital economy in 1999 — are now accessible to buyers in 200 countries. The rails Jack Ma built, because nobody else would, became the foundation that carries it all.',
    ],

    quote: '"Anyone can build the storefront. We built the trust beneath it — the invisible rails that let two strangers, an ocean apart, finally do business."',
    takeaway: 'Sometimes the most powerful strategic move is building the boring infrastructure that everyone assumes someone else will handle.',

    questions: [
      { q: 'Q1 — Infrastructure as Moat', text: 'Alibaba beat eBay by building Alipay — trust infrastructure, not a better marketplace. Why is financial infrastructure a more durable moat than a marketplace, especially in emerging economies?' },
      { q: 'Q2 — Betting on the Founder', text: 'SoftBank\'s Son invested $20 million after roughly six minutes, betting on Ma the person rather than the plan. What does that reveal about earliest-stage value creation — and the risks of that approach?' },
      { q: 'Q3 — Private Infrastructure, Public Consequences', text: 'When a single company\'s information system becomes critical infrastructure for an entire national economy, what strategic and societal risks does that create — for the company, and for society?' },
    ],
  },
];

// ── Finale Data ─────────────────────────────────────────────────────────────

const FINALE_LESSONS = [
  { emoji: '🏠', name: 'Airbnb', lesson: 'Trust can be designed.' },
  { emoji: '🎬', name: 'Netflix', lesson: 'Disrupt yourself first.' },
  { emoji: '📊', name: 'Xero', lesson: 'Empower the middleman.' },
  { emoji: '🎨', name: 'Canva', lesson: '"No" measures their vision.' },
  { emoji: '🌏', name: 'Alibaba', lesson: 'Build the rails no one will.' },
];

// ── Reveal-on-Scroll Hook ───────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Sub-Components ──────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = '',
  style = {},
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function VideoEmbed({ videoId, title, color }: { videoId: string; title: string; color: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${color}33`, background: '#000', boxShadow: `0 4px 32px ${color}22` }}>
      {!playing ? (
        <div
          style={{ position: 'relative', paddingBottom: '56.25%', cursor: 'pointer' }}
          onClick={() => setPlaying(true)}
          role="button"
          aria-label={`Play video: ${title}`}
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setPlaying(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{ width: 68, height: 68, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 12px ${color}33`, transition: 'transform 0.2s' }}
              className="fs5-play-btn"
            >
              <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.7)', lineHeight: 1.3 }}>{title}</p>
          </div>
        </div>
      ) : (
        <div style={{ paddingBottom: '56.25%', position: 'relative' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      )}
    </div>
  );
}

// ── Story Chapter Component ─────────────────────────────────────────────────

function StoryChapter({ story, index }: { story: Story; index: number }) {
  const [openSection, setOpenSection] = useState<string | null>('problem');

  const sections = [
    { id: 'problem',       label: '① The Origin',           emoji: '💡' },
    { id: 'struggle',      label: '② The Struggle',         emoji: '⚡' },
    { id: 'breakthrough',  label: '③ The Breakthrough',     emoji: '🔑' },
    { id: 'is',            label: '④ The Information System', emoji: '🏗️' },
    { id: 'impact',        label: '⑤ The Impact',           emoji: '📈' },
    { id: 'lesson',        label: '⑥ The Lesson',           emoji: '🎓' },
    { id: 'video',         label: '🎬 Watch the Story',      emoji: '▶️' },
  ];

  const toggle = (id: string) => setOpenSection(prev => prev === id ? null : id);

  return (
    <div
      id={`story-${story.id}`}
      style={{ marginBottom: 48 }}
    >
      {/* ── Chapter header ── */}
      <Reveal>
        <div
          style={{
            background: story.gradient,
            borderRadius: 20,
            padding: '32px 28px',
            marginBottom: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circle */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 38 }}>{story.emoji}</span>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                  Story {index + 1} · {story.year}
                </p>
                <h2 style={{ margin: '2px 0 0', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  {story.name}
                </h2>
              </div>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13, fontFamily: 'monospace', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.80)', fontWeight: 600 }}>
              {story.tagline}
            </p>
            <p style={{ margin: 0, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(255,255,255,0.92)', lineHeight: 1.55, maxWidth: 580, fontStyle: 'italic' }}>
              {story.hook}
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── Accordion sections ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sections.map(sec => (
          <Reveal key={sec.id} delay={0.05}>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${openSection === sec.id ? story.color + '55' : 'rgba(0,0,0,0.07)'}`, transition: 'border-color 0.25s' }}>
              {/* Accordion header */}
              <button
                onClick={() => toggle(sec.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: openSection === sec.id ? story.colorDim : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.22s',
                  textAlign: 'left',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 17 }}>{sec.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: openSection === sec.id ? story.color : '#374151', letterSpacing: '0.01em' }}>
                    {sec.label}
                  </span>
                </span>
                <span style={{ fontSize: 18, color: story.color, transform: openSection === sec.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }}>›</span>
              </button>

              {/* Accordion body */}
              {openSection === sec.id && (
                <div style={{ padding: '20px 22px 24px', background: '#fafafa', borderTop: `1px solid ${story.color}22` }}>
                  {sec.id === 'problem' && <ProblemSection story={story} />}
                  {sec.id === 'struggle' && <StruggleSection story={story} />}
                  {sec.id === 'breakthrough' && <BreakthroughSection story={story} />}
                  {sec.id === 'is' && <ISSection story={story} />}
                  {sec.id === 'impact' && <ImpactSection story={story} />}
                  {sec.id === 'lesson' && <LessonSection story={story} />}
                  {sec.id === 'video' && (
                    <div>
                      <p style={{ margin: '0 0 16px', fontSize: 14, color: '#6b7280' }}>
                        Watch a documentary about {story.name}'s founding story for additional context.
                      </p>
                      <VideoEmbed videoId={story.videoId} title={story.videoTitle} color={story.color} />
                      {story.videoId2 && story.videoTitle2 && (
                        <div style={{ marginTop: 20 }}>
                          <VideoEmbed videoId={story.videoId2} title={story.videoTitle2} color={story.color} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ── Section Renderers ───────────────────────────────────────────────────────

function ProblemSection({ story }: { story: Story }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 3, height: 24, borderRadius: 3, background: story.color }} />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>The Problem — {story.year}</h3>
      </div>
      {story.problemParagraphs.map((p, i) => (
        <p key={i} style={{ margin: '0 0 14px', fontSize: 15, lineHeight: 1.75, color: i === 0 ? '#111827' : '#374151', fontWeight: i === 0 ? 600 : 400 }}>
          {p}
        </p>
      ))}
    </div>
  );
}

function StruggleSection({ story }: { story: Story }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 3, height: 24, borderRadius: 3, background: story.color }} />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Before it worked, it almost died.</h3>
      </div>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
        Every company you admire has a period that isn't in the press release. Here's {story.name}'s.
      </p>
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Timeline line */}
        <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: `linear-gradient(to bottom, ${story.color}, ${story.color}22)`, borderRadius: 2 }} />
        {story.struggle.map((node, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: i < story.struggle.length - 1 ? 28 : 0 }}>
            {/* Dot */}
            <div style={{ position: 'absolute', left: -21, top: 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', border: `2.5px solid ${story.color}`, boxShadow: `0 0 0 3px ${story.colorDim}` }} />
            <p style={{ margin: '0 0 4px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.2em', color: story.color, textTransform: 'uppercase', fontWeight: 600 }}>{node.date}</p>
            <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#111827' }}>{node.title}</h4>
            <p style={{ margin: 0, fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>{node.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreakthroughSection({ story }: { story: Story }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 3, height: 24, borderRadius: 3, background: story.color }} />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>The moment things turned</h3>
      </div>
      {story.breakthrough.map((p, i) => (
        <p key={i} style={{ margin: '0 0 14px', fontSize: 15, lineHeight: 1.75, color: '#374151' }}>{p}</p>
      ))}
      {/* Insight callout */}
      <div style={{ marginTop: 20, borderRadius: 14, padding: '18px 20px', background: story.colorDim, border: `1.5px solid ${story.color}44` }}>
        <p style={{ margin: '0 0 6px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase', color: story.color, fontWeight: 700 }}>The core insight</p>
        <p style={{ margin: 0, fontSize: 16, fontStyle: 'italic', fontWeight: 600, color: '#111827', lineHeight: 1.5 }}>"{story.insight}"</p>
      </div>
    </div>
  );
}

function ISSection({ story }: { story: Story }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 3, height: 24, borderRadius: 3, background: story.color }} />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>{story.isHeading}</h3>
      </div>
      {story.isBody.map((p, i) => (
        <p key={i} style={{ margin: '0 0 14px', fontSize: 15, lineHeight: 1.75, color: '#374151' }}>{p}</p>
      ))}
      {/* Concept tags */}
      <div style={{ marginTop: 20 }}>
        <p style={{ margin: '0 0 10px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.18em', textTransform: 'uppercase', color: story.color, fontWeight: 700 }}>Key IS Concepts</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {story.isConcepts.map(c => (
            <span
              key={c}
              style={{
                fontSize: 12,
                fontFamily: 'monospace',
                letterSpacing: '0.06em',
                padding: '5px 12px',
                borderRadius: 40,
                background: story.colorDim,
                border: `1px solid ${story.color}44`,
                color: story.color,
                fontWeight: 600,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImpactSection({ story }: { story: Story }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 3, height: 24, borderRadius: 3, background: story.color }} />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Where it ended up</h3>
      </div>
      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
        {story.metrics.map((m, i) => (
          <div
            key={i}
            style={{ borderRadius: 14, padding: '16px 14px', background: story.colorDim, border: `1px solid ${story.color}33`, textAlign: 'center' }}
          >
            <span style={{ display: 'block', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, color: story.color, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{m.value}</span>
            <span style={{ display: 'block', marginTop: 6, fontSize: 11, color: '#6b7280', fontFamily: 'monospace', letterSpacing: '0.05em', lineHeight: 1.4 }}>{m.label}</span>
          </div>
        ))}
      </div>
      {story.impact.map((p, i) => (
        <p key={i} style={{ margin: '0 0 14px', fontSize: 15, lineHeight: 1.75, color: '#374151' }}>{p}</p>
      ))}
    </div>
  );
}

function LessonSection({ story }: { story: Story }) {
  const [openQ, setOpenQ] = useState<number | null>(null);
  return (
    <div>
      {/* Quote */}
      <div style={{ marginBottom: 24, borderRadius: 16, padding: '22px 24px', background: '#0f0f1a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: `${story.color}22`, pointerEvents: 'none' }} />
        <p style={{ margin: '0 0 4px', fontSize: 36, color: story.color, lineHeight: 1, fontFamily: 'Georgia, serif' }}>"</p>
        <p style={{ margin: '0 0 12px', fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', fontStyle: 'italic', color: '#f4f1ea', lineHeight: 1.6, fontFamily: 'Georgia, serif' }}>
          {story.quote.replace(/^"|"$/g, '')}
        </p>
        <p style={{ margin: 0, fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.14em', color: story.color, textTransform: 'uppercase', fontWeight: 600 }}>{story.name} · The Lesson</p>
      </div>

      {/* Takeaway */}
      <div style={{ marginBottom: 24, borderRadius: 14, padding: '16px 18px', background: story.colorDim, border: `1.5px solid ${story.color}44` }}>
        <p style={{ margin: '0 0 6px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase', color: story.color, fontWeight: 700 }}>Strategic Takeaway</p>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111827', lineHeight: 1.55 }}>{story.takeaway}</p>
      </div>

      {/* Discussion questions */}
      <p style={{ margin: '0 0 12px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600 }}>Three questions for discussion</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {story.questions.map((q, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${openQ === i ? story.color + '55' : 'rgba(0,0,0,0.07)'}`, transition: 'border-color 0.2s' }}>
            <button
              onClick={() => setOpenQ(prev => prev === i ? null : i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: openQ === i ? story.colorDim : '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: openQ === i ? story.color : '#374151' }}>{q.q}</span>
              <span style={{ fontSize: 16, color: story.color, transform: openQ === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 8 }}>›</span>
            </button>
            {openQ === i && (
              <div style={{ padding: '12px 16px 16px', background: '#fafafa', borderTop: `1px solid ${story.color}22` }}>
                <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{q.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function FiveStoriesLesson() {
  const [activeStory, setActiveStory] = useState<string | null>(null);

  // Scroll to story when nav tab clicked
  const scrollTo = (id: string) => {
    const el = document.getElementById(`story-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveStory(id);
  };

  // Track active story via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    STORIES.forEach(s => {
      const el = document.getElementById(`story-${s.id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStory(s.id); },
        { threshold: 0.2 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: '1rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
        .fs5-play-btn:hover { transform: scale(1.1) !important; }
        .fs5-nav-tab { transition: background 0.2s, color 0.2s, transform 0.15s; }
        .fs5-nav-tab:hover { transform: translateY(-1px); }
        .fs5-finale-card { transition: transform 0.25s, box-shadow 0.25s; }
        .fs5-finale-card:hover { transform: translateY(-6px); }
        @media (max-width: 600px) {
          .fs5-metrics-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ borderRadius: 20, background: 'linear-gradient(135deg, #08080d 0%, #14141e 100%)', padding: 'clamp(28px, 5vw, 48px)', marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '80%', height: '60%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.14), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.42em', textTransform: 'uppercase', color: '#c9a84c' }}>
            MBI800 · Strategic Information Systems
          </p>
          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 900, color: '#f4f1ea', lineHeight: 1.05, letterSpacing: '-0.02em', fontFamily: 'Georgia, serif' }}>
            Five Stories That<br />
            <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>Changed Everything.</span>
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(244,241,234,0.7)', lineHeight: 1.7, maxWidth: 540 }}>
            The greatest businesses in the digital economy weren't born from market research or McKinsey decks.
            They were born from tiny, specific frustrations — and the information systems that turned those frustrations into empires.
          </p>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: 'rgba(244,241,234,0.55)', lineHeight: 1.6 }}>
            This lesson traces five companies — Airbnb, Netflix, Xero, Canva, and Alibaba — from their founding moments through to global scale.
            Each story has a breakthrough. Each breakthrough has an information system underneath it. And each one has something to teach you about how digital business actually works.
          </p>

          {/* Company logo pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {STORIES.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="fs5-nav-tab"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 40, border: `1.5px solid ${s.color}55`, background: `${s.color}18`, color: '#f4f1ea', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.04em' }}
              >
                <span>{s.emoji}</span>
                <span style={{ color: s.color }}>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky nav strip ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '8px 4px', marginBottom: 12, display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {STORIES.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="fs5-nav-tab"
            style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 40, border: `1.5px solid ${activeStory === s.id ? s.color : 'transparent'}`, background: activeStory === s.id ? s.colorDim : 'transparent', color: activeStory === s.id ? s.color : '#6b7280', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.22s' }}
          >
            <span>{s.emoji}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* ── Context banner ── */}
      <Reveal>
        <div style={{ marginBottom: 32, borderRadius: 16, padding: '18px 20px', background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))', border: '1.5px solid rgba(201,168,76,0.25)' }}>
          <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#92400e' }}>📚 How to use this lesson</p>
          <p style={{ margin: 0, fontSize: 14, color: '#78350f', lineHeight: 1.65 }}>
            Each story is divided into six sections — click each section to expand it. Work through them in order for the full narrative arc,
            or jump to the sections most relevant to your discussion. The <strong>Discussion Questions</strong> at the end of each story are designed
            for individual reflection or group debate. The embedded videos give you founder perspectives in their own words.
          </p>
        </div>
      </Reveal>

      {/* ── Story chapters ── */}
      {STORIES.map((story, i) => (
        <StoryChapter key={story.id} story={story} index={i} />
      ))}

      {/* ── Finale ── */}
      <Reveal>
        <div style={{ borderRadius: 20, background: 'linear-gradient(135deg, #06060a 0%, #12121c 100%)', padding: 'clamp(28px, 5vw, 48px)', marginTop: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '70%', height: '60%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.09), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.34em', textTransform: 'uppercase', color: '#c9a84c' }}>The Pattern</p>
            <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(1.5rem, 4vw, 2.6rem)', fontWeight: 900, color: '#f4f1ea', lineHeight: 1.1, letterSpacing: '-0.01em', fontFamily: 'Georgia, serif', maxWidth: 640 }}>
              Every platform that changed the world started with{' '}
              <em style={{ color: '#c9a84c' }}>one person noticing something broken.</em>
            </h2>
            <p style={{ margin: '0 0 32px', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(244,241,234,0.65)', lineHeight: 1.7, maxWidth: 560 }}>
              None of them started with a market opportunity. None of them started with a deck.
              Each started with a specific frustration — a $40 late fee, an empty ledger in someone else's hands,
              a room of university students struggling with a tool that shouldn't be that hard.
              The information system turned that frustration into infrastructure. The infrastructure became the business.
            </p>

            {/* Finale lesson cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 36 }}>
              {FINALE_LESSONS.map((item, i) => {
                const story = STORIES[i];
                return (
                  <div
                    key={item.name}
                    className="fs5-finale-card"
                    style={{ borderRadius: 14, padding: '18px 14px', border: `1.5px solid ${story.color}33`, background: `${story.color}11`, textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => scrollTo(story.id)}
                  >
                    <span style={{ display: 'block', fontSize: 28, marginBottom: 8 }}>{item.emoji}</span>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 900, color: story.color, marginBottom: 6 }}>{item.name}</span>
                    <span style={{ display: 'block', fontSize: 12, fontFamily: 'monospace', color: 'rgba(244,241,234,0.65)', lineHeight: 1.5 }}>{item.lesson}</span>
                  </div>
                );
              })}
            </div>

            {/* Final CTA */}
            <div style={{ borderTop: '1px solid rgba(244,241,234,0.12)', paddingTop: 28, textAlign: 'center' }}>
              <p style={{ margin: '0 0 12px', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontStyle: 'italic', color: '#f4f1ea', fontFamily: 'Georgia, serif', lineHeight: 1.5 }}>
                What problem in your industry is waiting for its information system?
              </p>
              <p style={{ margin: 0, fontSize: 'clamp(2.2rem, 8vw, 4.5rem)', fontWeight: 900, color: '#c9a84c', letterSpacing: '-0.02em', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
                Your turn.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Crazy Ones Closing ── */}
      <Reveal>
        <div style={{ borderRadius: 20, background: 'linear-gradient(135deg, #08080d 0%, #14141e 100%)', padding: 'clamp(28px, 5vw, 48px)', marginTop: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '70%', height: '60%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.1), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.34em', textTransform: 'uppercase', color: '#c9a84c' }}>The Closing Scene</p>
            <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900, color: '#f4f1ea', lineHeight: 1.1, letterSpacing: '-0.01em', fontFamily: 'Georgia, serif', maxWidth: 620 }}>
              "Here's to the crazy ones."
            </h2>

            {/* Context block 1 — what happened before */}
            <div style={{ marginBottom: 24, maxWidth: 720 }}>
              <p style={{ margin: '0 0 10px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700 }}>What happened before this played</p>
              <p style={{ margin: '0 0 12px', fontSize: '1rem', lineHeight: 1.8, color: 'rgba(244,241,234,0.75)' }}>
                September 1997. Apple Computer was 90 days from bankruptcy. Steve Jobs had just come back — twelve years after being pushed out by the very board he assembled. He had been fired from his own company.
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '1rem', lineHeight: 1.8, color: 'rgba(244,241,234,0.75)' }}>
                During those twelve years, Apple drifted. Product lines multiplied without direction. The company lost focus, then lost customers, then nearly lost everything. Jobs had spent those years building NeXT and turning Pixar into the studio that made Toy Story. But Apple — his original creation — was dying.
              </p>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.8, color: 'rgba(244,241,234,0.75)' }}>
                When he returned as interim CEO, his first moves were brutal: he cancelled 70% of Apple's product line overnight. He negotiated a $150 million investment from Microsoft — the company Apple had spent a decade at war with. And then he did something unexpected. Before launching a single new product, he called the whole team together — and instead of announcing a product, he announced a belief.
              </p>
            </div>

            {/* Context block 2 — what Jobs said before the ad */}
            <div style={{ marginBottom: 24, maxWidth: 720, borderLeft: '3px solid rgba(201,168,76,0.4)', paddingLeft: 20 }}>
              <p style={{ margin: '0 0 10px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700 }}>What Jobs said before pressing play</p>
              <p style={{ margin: '0 0 12px', fontSize: '1rem', lineHeight: 1.8, color: 'rgba(244,241,234,0.75)' }}>
                He told his team: <em style={{ color: '#f4f1ea' }}>"Marketing is about values. This is a very complicated world — it's a very noisy world — and we're not going to get a chance to get people to remember much about us. No company is. So we have to be very clear about what we want them to know about us."</em>
              </p>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.8, color: 'rgba(244,241,234,0.75)' }}>
                Then he said Apple's core value wasn't about making computers. It was about the belief that <em style={{ color: '#f4f1ea' }}>people with passion can change the world for the better.</em> And the people who do that, he said, are the people Apple has always made tools for. Then he played the ad.
              </p>
            </div>

            {/* Context block 3 — why this mattered */}
            <div style={{ marginBottom: 32, maxWidth: 720 }}>
              <p style={{ margin: '0 0 10px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700 }}>Why this mattered — and why it was personal</p>
              <p style={{ margin: '0 0 12px', fontSize: '1rem', lineHeight: 1.8, color: 'rgba(244,241,234,0.75)' }}>
                The ad celebrates the misfits. The rebels. The troublemakers. The round pegs in the square holes. Einstein, Gandhi, Picasso, Amelia Earhart, Muhammad Ali — people who were told no, called dangerous, misunderstood. And then the world changed around them.
              </p>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.8, color: 'rgba(244,241,234,0.75)' }}>
                Jobs wasn't just describing icons from history. He was describing himself. He was a round peg. He had been fired. He had spent twelve years being told his ideas were too extreme, that he needed to compromise, that the market didn't want what he was building. The "Think Different" campaign was his answer to all of it — not loud, not angry. Just quiet, and absolutely certain.
              </p>
            </div>

            {/* Bridge to the lesson */}
            <div style={{ marginBottom: 36, borderRadius: 16, padding: '24px 28px', background: 'rgba(201,168,76,0.07)', border: '1.5px solid rgba(201,168,76,0.22)' }}>
              <p style={{ margin: '0 0 16px', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 700 }}>Why this ends our lesson</p>
              <p style={{ margin: '0 0 14px', fontSize: '1rem', lineHeight: 1.8, color: 'rgba(244,241,234,0.8)' }}>
                We've spent this session with five founders who were, each in their own way, the crazy ones.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[
                  ['🏠', 'Airbnb', 'Two broke designers who thought strangers would pay to sleep on air mattresses in someone else\'s living room. Everyone said no.'],
                  ['🎬', 'Netflix', 'A DVD-by-mail company that bet everything on streaming — a technology that barely worked and a market that didn\'t exist. Everyone said no.'],
                  ['📊', 'Xero', 'A New Zealand accountant who wanted businesses to trust their financial records to a cloud server. Nobody trusted the cloud yet. Everyone said no.'],
                  ['🎨', 'Canva', 'A nineteen-year-old in Perth who believed anyone could design anything — when the entire industry said design was a professional skill that took years to learn. Everyone said no.'],
                  ['🌏', 'Alibaba', 'An English teacher with no technical background who thought Chinese factories could sell directly to buyers in 200 countries — when China\'s internet penetration was under 2%. Everyone said no.'],
                ].map(([emoji, name, desc]) => (
                  <div key={name as string} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{emoji}</span>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(244,241,234,0.72)' }}>
                      <strong style={{ color: '#f4f1ea' }}>{name}.</strong> {desc}
                    </p>
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.8, color: '#f4f1ea', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                Every one of them built it anyway. The world changed around them — because they were crazy enough to think it could.
              </p>
            </div>

            {/* The video */}
            <p style={{ margin: '0 0 14px', fontSize: '0.95rem', color: 'rgba(244,241,234,0.55)', lineHeight: 1.6 }}>
              Now watch the ad Jobs played to his team in September 1997 — the moment Apple decided what it stood for again.
            </p>
            <VideoEmbed videoId="FvN1TuMgBBo" title="Here's to the Crazy Ones — Think Different (Apple, 1997)" color="#c9a84c" />
          </div>
        </div>
      </Reveal>

      {/* ── Footer ── */}
      <div style={{ marginTop: 16, padding: '12px 0', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af' }}>
          MBI800 · Strategic Information Systems · Master of Business Informatics
        </p>
      </div>
    </div>
  );
}
