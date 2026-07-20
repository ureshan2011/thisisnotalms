# Five Stories That Changed Everything — MBI800

- **Subject:** MBI800 — Strategic Information Systems (Planning). Explicit — the page hero, the lesson component's own header, and the `CourseResources.tsx` registry all tag this "MBI800 · Strategic Information Systems".
- **Gating:** Both. A non-gated public standalone page at `/five-stories` with its own hero/nav/footer wrapper, **and** the exact same `FiveStoriesLesson` component embedded (no extra unlock/score threshold) inside the gated `/student/course-resources` hub, under the `MBI800` course entry, lesson id `'five-stories'`. Confirmed in `CourseResources.tsx`: the gating check `const gated = !isStaff && ['normalization', 'quiz'].includes(lesson.id) && !erMcqPassed;` does **not** include `'five-stories'`, so on the gated side the only requirement is being logged in as `student` (or staff) — no score/quiz threshold.
- **Route(s):** `/five-stories` (public, defined twice in `src/App.tsx` — once in the normal `AppRoutes` route table and once in the `ShutdownRoutes` table used when `PLATFORM_ACTIVE` is false); also reachable while logged in via `/student/course-resources` → MBI800 → "Five Stories That Changed Everything".
- **Source files:**
  - `src/pages/FiveStoriesPage.tsx` — public hero/shell wrapper (127 lines)
  - `src/components/slides/FiveStoriesLesson.tsx` — the actual lesson content/deck (1136 lines)
  - `src/pages/student/CourseResources.tsx` — gated embed point (imports `FiveStoriesLesson` from `'../../components/slides/FiveStoriesLesson'`; COURSES registry entry at lines 150–180; rendered at `{lesson.id === 'five-stories' && <FiveStoriesLesson />}` around line 1793)
  - `src/App.tsx` — route registration
- **Depends on:** `src/components/ui/BrandLogo` (nav/footer logo on the public page), `framer-motion` (hero animations on the public page only — the lesson component itself uses a custom `IntersectionObserver`-based reveal, not framer-motion), no Firestore reads/writes, no external libraries beyond React state + `IntersectionObserver`. External assets: YouTube video embeds (thumbnails fetched live from `https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`, players via `https://www.youtube.com/embed/{videoId}`).

## 1. Purpose & learning objectives

This lesson teaches Strategic Information Systems Planning through five real-company origin stories — Airbnb, Netflix, Xero, Canva, and Alibaba — each chosen because a specific information-systems idea sits underneath its breakthrough (trust infrastructure, data flywheels, single source of truth, democratised complexity, and payment/escrow infrastructure, respectively). The framing (per the lesson's own intro copy) is that "the biggest companies in the digital economy didn't start with market research. They started with a specific frustration — and the information system that turned it into something much bigger." Each of the five stories follows the same six-part narrative arc (Origin → Struggle → Breakthrough → Information System → Impact → Lesson) so students see a repeatable pattern: a founder problem, near-failure, an inflection point, the IS architecture that made the breakthrough scale, the measurable outcome, and a strategic takeaway plus discussion questions. The lesson closes by reframing all five stories as instances of "outsiders who were told no" (bridging to Apple's 1997 "Think Different" ad), and ends on a direct prompt to students: "What problem in your industry is waiting for its information system?"

## 2. Full content

### Hero / intro copy (top of `FiveStoriesLesson`)
- Eyebrow: "MBI800 · Strategic Information Systems"
- Title: "Five Stories That **Changed Everything.**"
- Body: "The biggest companies in the digital economy didn't start with market research. They started with a specific frustration — and the information system that turned it into something much bigger."
- Sub-body: "This lesson traces five companies — Airbnb, Netflix, Xero, Canva, and Alibaba — from their founding moments through to global scale. Each story has a breakthrough. Each breakthrough has an information system underneath it. And each one has something to teach you about how digital business actually works."
- "How to use this lesson" banner: "Each story is divided into six sections — click each section to expand it. Work through them in order for the full narrative arc, or jump to the sections most relevant to your discussion. The **Discussion Questions** at the end of each story are designed for individual reflection or group debate. The embedded videos give you founder perspectives in their own words."

Each story is an accordion with 7 sections: ① The Origin (💡), ② The Struggle (⚡), ③ The Breakthrough (🔑), ④ The Information System (🏗️), ⑤ The Impact (📈), ⑥ The Lesson (🎓), and 🎬 Watch the Story (▶️, embedded YouTube video(s)).

---

### Story 1 — Airbnb (2007, "Trust Can Be Designed")

**Hook:** "Two broke designers. Three air mattresses. A $1,150 rent bill due on Friday. And the idea that became a $75 billion company."

**① The Origin:**
October 2007, San Francisco. Brian Chesky and Joe Gebbia had just moved from New York with big dreams and nearly empty bank accounts. Rent was $1,150/month, which they didn't have. A design conference was arriving that weekend and every hotel in the city was sold out — attendees were considering sleeping in parks. Looking at air mattresses piled in their living room, they asked: "What if we rented out space in our apartment to strangers?" They built a simple website over the weekend; three people showed up (a 30-year-old from Utah, a 35-year-old from Boston, a 45-year-old father from India), each paid $80, and the rent got paid. The lesson frames the deeper problem: "the spare mattress was just the vehicle. The actual problem they were solving was something far older and far harder — how do you get a complete stranger to trust you enough to sleep in their home?"

**② The Struggle** (timeline):
- *Early 2008 — "Launched to silence":* Relaunched at SXSW in Austin expecting to be discovered; a brief traffic spike, then near-complete silence.
- *Mid 2008 — "Seven investors, seven rejections, $20,000 in credit card debt":* Seven investors passed outright. Founders maxed out credit cards to survive; at the lowest point they were eighteen months from being forced to quit.
- *Late 2008 — "They sold breakfast cereal":* Designed novelty election cereal boxes ("Obama O's" and "Cap'n McCain's"), sold at $40 each, raised nearly $30,000. Paul Graham at Y Combinator saw the stunt and said "If you can convince people to pay $40 for cereal, maybe you can build a company." They got into YC.

**③ The Breakthrough:**
"The real breakthrough wasn't a product feature. It was a plane ticket." Early 2009: data showed New York had listings and searches but bookings weren't converting. Brian Chesky flew to New York, visited hosts in person, and realized the photos were terrible (blurry phone pictures of unmade beds). He rented a professional camera and photographed apartments himself; within weeks New York revenue doubled. Lesson drawn: "data tells you where a problem exists. Showing up in person tells you what the problem actually is." Deeper insight: the whole product's job was to engineer trust — photos, reviews, verified identities, secure payments.

**Core insight (callout):** "It was never about beds. It was about making two strangers trust each other — and the beds took care of themselves."

**④ The Information System — "The Architecture of Trust":**
- Airbnb is technically a two-sided marketplace (hosts/guests) but what makes it hard to copy is the trust layer in the middle.
- Reviews flow bidirectionally (hosts rate guests, guests rate hosts) visible before booking confirmation, accumulating a reputation score.
- Payment is held in escrow — funds don't reach the host until 24 hours after check-in, removing the "what if the place isn't like the photos" fear.
- Self-reinforcing network effect: more hosts → more guests → more hosts; growth makes displacement by competitors harder.
- Airbnb owns none of the inventory — not a bedroom, not a sheet. "The information system is the business."
- **Key IS Concepts tags:** Two-Sided Marketplace, Network Effects, Trust Infrastructure, Asset-Light Platform, Escrow Payments, Long-Tail Supply.

**⑤ The Impact:**
- Metrics: 8M+ active listings worldwide · 220+ countries & regions · $75B market capitalisation · 5M+ hosts worldwide.
- From three air mattresses to 8 million listings across 220 countries; December 2020 NASDAQ IPO, one of the most anticipated of the year, valued above most major hotel chains combined. "The hotel industry spent years trying to lobby Airbnb out of existence. Instead, Airbnb changed the definition of what a hotel is."

**⑥ The Lesson:**
- Quote: "We didn't build a place to stay. We built a reason for two strangers to trust each other — and the beds took care of themselves."
- Strategic takeaway: "Trust is not just an emotion. It is an architecture. The information system is what creates it, at scale, between strangers."
- Discussion questions:
  1. **Q1 — The Real Moat:** "If regulators forced full review-history portability to rival platforms, would Airbnb's defensibility survive? Where does its real strategic moat actually live?"
  2. **Q2 — Do Things That Don't Scale:** "Brian Chesky flew to New York to photograph apartments himself — the ultimate unscalable act. Why did that decision unlock scale? What principle does it represent, and where could you apply it in your own industry?"
  3. **Q3 — The Liability of Light Assets:** "Airbnb owns nothing and depends entirely on millions of independent hosts. Where does asset-light become a strategic liability rather than a strength?"

**Video:** "Airbnb Founders: Brian Chesky & Joe Gebbia — Documentary" (YouTube id `dZ8llodSZAA`).

---

### Story 2 — Netflix (1997, "Disrupt Yourself Before Someone Else Does")

**Hook:** "A $40 late fee for a forgotten copy of Apollo 13. One irritated drive to the gym. The end of an entire industry."

**① The Origin:**
Late fees were Blockbuster's real business model — in some years over 16% of total revenue came from late-return penalties. Reed Hastings returned a video weeks overdue in 1997, paid $40, and on the drive home thought: "What if you just paid a monthly fee and kept movies as long as you wanted?" He co-founded Netflix with Marc Randolph that same year, mailing DVDs in red envelopes — slow and clunky, but crucially: no due dates, no late fees. "The constraint he was removing wasn't inconvenience. It was psychological tax."

**② The Struggle:**
- *1997–1999 — "Pay-per-disc: the thing they were replacing":* The original model still had due dates and per-disc fees; barely anyone signed up.
- *2000 — "The dot-com crash nearly ended it":* Netflix was burning cash fast, laid off a third of staff, founders debated shutting down.
- *2000 — "Blockbuster laughed them out of the room":* Hastings offered to sell Netflix to Blockbuster for $50 million; Blockbuster executives reportedly laughed. Hastings went home and built the thing that would destroy them. Blockbuster filed for bankruptcy in 2010.

**③ The Breakthrough:**
Two breakthroughs "in what felt like the wrong order": (1) the 1999 subscription model — flat monthly fee, no due dates/penalties; (2) streaming in 2007, a decade after founding, with a limited catalogue and ugly interface but the real insight that DVD was always a compromise — the real business was getting the right film to the right person at the right moment. But the most important breakthrough was a decision: in 2011 Netflix announced splitting into two companies (DVD and streaming); backlash was immediate — 800,000 subscribers lost in a single quarter, stock fell 75%, analysts declared the company finished. They reversed the structural split but kept the streaming-first strategy. Second self-disruption: they stopped licensing others' content and started making their own (House of Cards, Orange is the New Black, Stranger Things) — going from distributor to studio, guided by viewing data.

**Core insight (callout):** "Remove every penalty. Let the data find the films no shelf could ever hold. Then disrupt yourself before someone else can."

**④ The Information System — "The Data Flywheel":**
- Not a marketplace — a self-reinforcing feedback loop that gets smarter with every play button pressed.
- Every pause/rewind/abandon is a learning signal; the recommendation engine builds a unique taste model and unique homepage per subscriber.
- Flywheel: more subscribers → more viewing data → better recommendations → better retention → more subscribers.
- Data drives production: House of Cards was greenlit because British political dramas retained subscribers, David Fincher's films drove completion rates, and Kevin Spacey scored well with the highest-value segments.
- **Key IS Concepts tags:** Data Flywheel, Personalisation at Scale, Long-Tail Economics, Self-Disruption, Vertical Integration, Subscription Economics.

**⑤ The Impact:**
- Metrics: 300M+ paid memberships · 190+ countries · $45B annual revenue (2025) · #1 most-subscribed streaming platform globally.
- Blockbuster filed for bankruptcy in 2010; the last remaining store (Bend, Oregon) became a tourist destination. "Netflix didn't just beat Blockbuster. It invented a new relationship between humans and entertainment."

**⑥ The Lesson:**
- Quote: "Everyone protects the business that pays the bills today. We learned to set ours on fire — on purpose — the moment we saw something better forming in the smoke."
- Strategic takeaway: "The hardest disruption is self-disruption. Data tells you what's coming. Courage is acting on it before you're forced to."
- Discussion questions:
  1. **Q1 — Information vs Incentives:** "Blockbuster declined Netflix and went bankrupt. Was that a failure of information (they didn't see streaming coming) or a failure of incentives (late fees were too profitable to abandon)?"
  2. **Q2 — The Case Against Self-Disruption:** "Netflix deliberately cannibalised its profitable DVD business for streaming in 2007. Build the strongest possible case *against* that decision as it would have appeared to an investor at the time."
  3. **Q3 — When Data Steers Creativity:** "Netflix lets viewing data drive which originals to greenlight. What are the strategic risks of letting an algorithm guide creative decisions at a studio?"

**Video:** "The Story of Reed Hastings, Co-founder of Netflix" (YouTube id `MsePnZjaaRA`).

---

### Story 3 — Xero (2006, "Empower the Middleman")

**Hook:** "The internet had transformed everything. Except the ledger — still trapped on one desktop and emailed around town like a parcel."

**① The Origin:**
2006 vignette: a small-business owner emails a spreadsheet to her accountant, who opens it in a different Excel version, fixes a broken formula, does the work, emails it back; the owner finds it's an older version and the cycle repeats. Rod Drury looked at this and thought the ledger should live in the cloud, visible in real time to owner, accountant, and bank simultaneously. He co-founded Xero in Wellington, New Zealand in 2006 with chartered accountant Hamish Edwards — a technologist who understood cloud architecture paired with an accountant who understood what small businesses actually needed.

**② The Struggle:**
- *2007 — "An 'outrageous' IPO — with under 100 customers":* Xero listed on the NZX and raised NZ$15 million before meaningful revenue or traction; Drury called it strategic runway for a slow, trust-based market.
- *2008 — "Listed directly into the global financial crisis":* Months after IPO the global financial system collapsed.
- *2008–2013 — "Five years of losses and unglamorous door-knocking":* Convincing conservative accountants to switch to "the cloud" took five years of one-conversation-at-a-time relationship-building.

**③ The Breakthrough:**
Conventional Silicon Valley wisdom said go around the gatekeepers and sell directly to business owners. Xero did the opposite: "the accountant is not the obstacle to bypass. The accountant is the supercharged distribution channel — if you give them tools worth loving." Small-business owners trust their accountants like patients trust doctors; a recommendation is an instruction. Xero built accountants genuine superpowers (faster workflows, real-time client visibility, automated reconciliation, advisory dashboards), a certification programme, and an advisor community — turning accountants into ambassadors who migrated entire client bases at once.

**Core insight (callout):** "The accountant wasn't the obstacle to bypass. The accountant was the most powerful distribution channel available — once you gave them tools worth loving."

**④ The Information System — "One Source of Truth":**
- Before Xero: multiple conflicting versions of financial reality (accountant's Excel, owner's email, bank records), data-entry errors, stale numbers.
- The cloud ledger eliminates multiplicity: one ledger, bank feeds flow in automatically, invoices/bills/payroll/POS data land in the same place, visible identically to owner and accountant on any device.
- Open API turned the ledger into an ecosystem — over 1,000 connected apps (payroll, inventory, expense tracking, POS) — making the ledger the central hub of a small business's financial life.
- Strategic consequence: switching costs compound with every connection — leaving becomes "architecturally painful," which the text explicitly calls "the natural gravity of becoming infrastructure," not a lock-in trick.
- **Key IS Concepts tags:** Single Source of Truth, Cloud / SaaS, Open API Ecosystem, Channel Strategy, Switching Costs, Network Effects.

**⑤ The Impact:**
- Metrics: 4.4M+ subscribers worldwide · NZ$2.1B annual revenue (FY25) · 180+ countries · #1 cloud accounting platform in NZ, AU & UK.
- From Wellington — "one of the most geographically remote technology hubs on Earth" — to one of NZ's most valuable companies, listed on the ASX, used from London to Singapore to São Paulo.

**⑥ The Lesson:**
- Quote: "We didn't beat the accountants. We handed them superpowers — and they carried our little Wellington startup to the rest of the world."
- Strategic takeaway: "Empower the middleman instead of bypassing them. The right intermediary, properly equipped, becomes your most powerful distribution engine."
- Discussion questions:
  1. **Q1 — Co-opt or Bypass?:** "Xero turned the people it might have disrupted into its primary sales channel. When is co-opting an intermediary strategically superior to bypassing them — and when does it create dangerous dependency?"
  2. **Q2 — The Pre-Revenue IPO:** "Xero listed publicly with essentially no revenue. Evaluate the strategic trade-offs of an early IPO versus prolonged private funding for a capital-intensive platform business."
  3. **Q3 — AI and the Ledger:** "As AI agents begin to automate bookkeeping itself, which parts of Xero's strategic moat grow stronger, and which parts become vulnerable? Where does the advantage shift?"

**Video:** "From Small NZ Startup to Global Success — The Rise of Xero" (YouTube id `7_RlH2jMeGw`).

---

### Story 4 — Canva (2007, "Open the Gate")

**Hook:** "A nineteen-year-old in Perth, watching classmates spend a whole semester learning design software, thinking: this should not be that hard for anyone."

**① The Origin:**
Melanie Perkins, 19, in her mother's living room in Perth, watched university classmates struggle with Photoshop/InDesign — powerful but hostile to non-experts, with a learning curve like a cliff. She thought: what if design were like typing — no degree required? In 2007 she started testing with Fusion Books, a platform for high-school students to design their own yearbooks — small, local, "entirely unsexy," but proof that ordinary people could design things they were proud of given the right tools.

**② The Struggle:**
- *2007–2012 — "The long proving ground":* Five years running Fusion Books while pitching the bigger vision — not the story Silicon Valley wanted to hear, but every yearbook was evidence.
- *2010–2013 — "More than one hundred rejections":* Over 100 investor "no"s across three years ("The market doesn't exist." "People use Photoshop." "We don't see the opportunity.")
- *2012 — "She learned to kitesurf to get a single meeting":* Investor Bill Tai ran his network through Hawaii kitesurfing retreats; Perkins learned to kitesurf, pitched between sessions in a wetsuit, and got the connection that opened Silicon Valley.

**③ The Breakthrough:**
Not a product decision but a positioning decision. Every prior design tool was built for designers — complexity was a feature that kept non-designers out and justified the price. Canva's insight: "the complexity is the bug, not the feature." Hundreds of millions of people need to create visuals and will never master Photoshop. The template hid professional complexity behind a simple interface — hard decisions (typography, colour, spacing) were baked in; users just swapped words and images. Canva launched in 2013, reached 750,000 users in its first year. Growth engine: every exported design carried "Made with Canva," so every share was free marketing to exactly the right audience.

**Core insight (callout):** "Hide the complexity. Open the gate. The market everyone said didn't exist comes flooding through the moment you remove the barrier."

**④ The Information System — "The Design Engine: Supply Meets Simplicity":**
- Two-sided marketplace where the supply side is nearly invisible: contributors (designers, photographers, illustrators) upload templates/stock images/fonts/elements and earn payment when used in a paid design; users (hundreds of millions of non-designers) pick from those assets.
- The design engine in the middle: drag-and-drop presenting professional-grade complexity as effortless — "That gap — between technical complexity and perceived simplicity — is the product."
- Two-sided growth flywheel: more users → more shared designs → more brand awareness → more users; more contributors → more assets → more value → more contributors.
- Freemium layering: free basic tool drives mass adoption; premium features (brand kits, premium stock, team collaboration) convert power users. "Inside 95% of the Fortune 500, teams are now paying Canva for exactly those features — without IT ever making a formal procurement decision."
- **Key IS Concepts tags:** Two-Sided Marketplace, Freemium Model, Product-Led Growth, Democratisation, Network Effects, Viral Distribution.

**⑤ The Impact:**
- Metrics: 260M+ monthly active users · $42B valuation · 95% of Fortune 500 companies use Canva · 190+ countries.
- From a Perth living room to $42B valuation and 260M MAU, adopted bottom-up inside 95% of Fortune 500 without a single sales call — "the ultimate expression of product-led growth."

**⑥ The Lesson:**
- Quote: "A hundred people told me it would never work. They weren't describing my idea — they were describing the size of their own imagination. So I built it anyway."
- Strategic takeaway: "Every industry has expertise that gatekeepers treat as their advantage. Ask: what happens to the market when you make that expertise accessible to everyone?"
- Discussion questions:
  1. **Q1 — Product-Led Growth Limits:** "Canva's engine is 'every design is an advertisement.' Why can product-led viral growth build a stronger position than paid marketing — and where does it stall or fail?"
  2. **Q2 — AI and the Design Tool:** "Generative AI can now create polished designs from a text prompt, threatening the skill Canva made accessible. Does AI strengthen Canva's ecosystem — or fundamentally commoditise it?"
  3. **Q3 — Manufacturing Access:** "Beyond 'persistence,' what specific transferable tactics did Perkins use to overcome a complete lack of network and credibility? How would you apply those tactics in your own context?"

**Videos:** "How Melanie Perkins Turned Canva From a College Project Into a $42 Billion Company" (YouTube id `AF0hCZwpAtg`) and "Canva Founder Story — Additional Context" (YouTube id `GUjt0iRJ3eo`).

---

### Story 5 — Alibaba (1999, "Build the Rails No One Else Will")

**Hook:** "A former English teacher in a cramped Hangzhou apartment, telling seventeen friends that one day Chinese companies would sell to the entire world."

**① The Origin:**
Hangzhou, 1999: Jack Ma gathers 17 friends and gives a two-hour speech envisioning Chinese manufacturers selling directly to global buyers, with no middlemen. China's internet penetration was under 2%; e-commerce barely existed in the West and not at all in China. Ma had failed university entrance exams twice, been rejected from 23 of 24 jobs at a single KFC hiring event, been turned down by Harvard ten times, and had an earlier internet venture collapse. But he'd seen the internet in Seattle in 1995, searched "beer" and found no China results, searched "China" and found almost nothing — a billion people invisible to the global digital economy. "I can fix that."

**② The Struggle:**
- *Pre-1999 — "A serial reject — by almost everyone":* Failed exams twice, 23/24 KFC rejections, ten Harvard rejections, one failed prior internet company.
- *2000–2001 — "The dot-com crash drained everything":* Alibaba burned cash with no clear path to revenue; had to cut costs drastically to survive.
- *2002–2004 — "eBay invaded China with overwhelming force":* eBay dominated quickly with deep pockets and global brand recognition. Analysts wrote Alibaba off. Ma's response: made his consumer platform Taobao completely free to sellers, directly targeting eBay's commission model — draining eBay's China business over three years.

**③ The Breakthrough:**
Not the marketplace itself but a payments system nobody else wanted to build. In 2003, the core China e-commerce problem was trust: how does a buyer in Beijing pay a seller in Guangdong before goods arrive, and how does the seller know the payment is real? No credit-card infrastructure, most small sellers had no bank accounts that could receive digital payments. Ma built Alipay (2004): buyer deposits into an Alibaba-held escrow account, seller ships, buyer confirms receipt, only then is money released. "Neither party had to trust the other. Both parties had to trust the platform." SoftBank's Masayoshi Son invested $20 million after roughly six minutes of conversation in 2000, saying he'd seen Ma's eyes, not a plan.

**Core insight (callout):** "Build the trust infrastructure nobody else will. Hold the money in the middle, and two strangers on opposite sides of the world can finally do business."

**④ The Information System — "A Digital Ecosystem, Not a Marketplace":**
- Core platform (Taobao for consumers, Alibaba.com for B2B) creates two-sided value, but the IS architecture goes several layers deeper.
- Alipay = financial layer (payments, escrow, credit scoring, micro-insurance). Cainiao = logistics layer (coordinates deliveries across dozens of carriers, optimises routing in real time). Alibaba Cloud = infrastructure layer, running businesses across China and 29 other markets.
- Integration is the genius: payment data informs credit scoring, logistics data informs inventory recommendations, cloud services enable more sellers, generating more transactions/data, improving every layer.
- Singles' Day (the shopping festival Alibaba invented) processes more transactions in 24 hours than most countries' entire GDP for a week — "the information system is the infrastructure, not an application running on top of it."
- **Key IS Concepts tags:** Digital Ecosystem, Trust Infrastructure, Fintech & Escrow, Two-Sided Marketplace, Platform Moats, Network Effects.

**⑤ The Impact:**
- Metrics: 1B+ annual active consumers · $25B record 2014 IPO (largest in history at the time) · 200+ countries reached · 29 Alibaba Cloud regions globally.
- The English teacher rejected by KFC built a digital economy serving more than a billion people and staged the largest IPO in recorded history (NYSE, 2014). China's factories, invisible to the digital economy in 1999, are now accessible to buyers in 200 countries.

**⑥ The Lesson:**
- Quote: "Anyone can build the storefront. We built the trust beneath it — the invisible rails that let two strangers, an ocean apart, finally do business."
- Strategic takeaway: "Sometimes the most powerful strategic move is building the boring infrastructure that everyone assumes someone else will handle."
- Discussion questions:
  1. **Q1 — Infrastructure as Moat:** "Alibaba beat eBay by building Alipay — trust infrastructure, not a better marketplace. Why is financial infrastructure a more durable moat than a marketplace, especially in emerging economies?"
  2. **Q2 — Betting on the Founder:** "SoftBank's Son invested $20 million after roughly six minutes, betting on Ma the person rather than the plan. What does that reveal about earliest-stage value creation — and the risks of that approach?"
  3. **Q3 — Private Infrastructure, Public Consequences:** "When a single company's information system becomes critical infrastructure for an entire national economy, what strategic and societal risks does that create — for the company, and for society?"

**Video:** "The Full Story of Jack Ma & Alibaba" (YouTube id `SWVERy9bQZs`).

---

### Finale — "The Pattern"

Heading: "Every platform that changed the world started with *one person noticing something broken.*" Body: "None of them started with a market opportunity. None of them started with a deck. Each started with a specific frustration — a $40 late fee, an empty ledger in someone else's hands, a room of university students struggling with a tool that shouldn't be that hard. The information system turned that frustration into infrastructure. The infrastructure became the business."

Five clickable "finale lesson cards" (each scrolls back to that story), with the one-line lesson per company:
- 🏠 Airbnb — "Trust can be designed."
- 🎬 Netflix — "Disrupt yourself first."
- 📊 Xero — "Empower the middleman."
- 🎨 Canva — "'No' measures their vision."
- 🌏 Alibaba — "Build the rails no one will."

Closing prompt: "What problem in your industry is waiting for its information system?" — followed by the giant closing line "**Your turn.**"

### Closing scene — "Here's to the crazy ones" (Apple "Think Different", 1997)

This final block is explanatory scaffolding around an embedded YouTube video of Apple's 1997 "Think Different" ad, in three context sub-sections plus a bridge:

1. **"What happened before this played":** September 1997 — Apple was 90 days from bankruptcy. Steve Jobs had just returned, 12 years after being pushed out by his own board. During those 12 years Apple's product lines multiplied without direction and the company lost focus, customers, and nearly everything, while Jobs built NeXT and turned Pixar into the studio behind Toy Story. On return as interim CEO he cancelled 70% of Apple's product line overnight, negotiated a $150 million investment from Microsoft (Apple's decade-long rival), and before launching any product, called the team together to announce a belief, not a product.

2. **"What Jobs said before pressing play":** Quoted: "Marketing is about values. This is a very complicated world — it's a very noisy world — and we're not going to get a chance to get people to remember much about us. No company is. So we have to be very clear about what we want them to know about us." He then said Apple's core value was the belief that "people with passion can change the world for the better," and that those people are who Apple has always made tools for. Then he played the ad.

3. **"Why this mattered — and why it was personal":** The ad celebrates misfits — Einstein, Gandhi, Picasso, Amelia Earhart, Muhammad Ali — people called dangerous or misunderstood who changed the world anyway. Jobs was describing himself: fired from his own company, told his ideas were too extreme for 12 years. "Think Different" was his quiet, certain answer.

4. **Bridge to the lesson ("Why this ends our lesson"):** "We've spent this session with five founders who were, each in their own way, the crazy ones," followed by a one-line recap of each story's rejection-and-belief arc (Airbnb strangers on air mattresses; Netflix betting on unproven streaming; Xero convincing accountants to trust the cloud; Canva believing anyone could design; Alibaba believing Chinese factories could sell to 200 countries when internet penetration was under 2% — each summarized with "Everyone said no."). Closing line: "Every one of them built it anyway. The world changed around them — because they were crazy enough to think it could."

**Video:** "Here's to the Crazy Ones — Think Different (Apple, 1997)" (YouTube id `FvN1TuMgBBo`).

### Footer
"MBI800 · Strategic Information Systems · Master of Business Informatics"

## 3. UI & interaction design

**Public page (`FiveStoriesPage.tsx`):** Apple-system font stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif`). Sticky top nav (white/90 backdrop-blur) with `BrandLogo` linking to `/home`. Hero: three soft blurred gradient orbs positioned absolutely (gold `#c9a84c`, red `#FF5A5F`, purple `#7D2AE8`), an eyebrow line "MBI800 · Strategic Information Systems", a large serif-adjacent Apple-style headline "Five Stories That **Changed Everything.**" with the accent span using a 5-stop linear gradient across all five brand colours (gold → red → purple → blue → orange), a subtitle paragraph, five company pill badges (Airbnb 🏠/Netflix 🎬/Xero 📊/Canva 🎨/Alibaba 🌏) each colored with its own brand color at low opacity, and a bouncing "Scroll to begin" indicator — all animated in via `framer-motion` with a custom cubic-bezier ease `[0.16, 1, 0.3, 1]` and staggered delays. Footer repeats the brand logo and a "‹ Back to all lessons" link in indigo (`#4338CA`).

**Lesson component (`FiveStoriesLesson.tsx`):** Entirely self-styled with inline CSS-in-JS objects (no Tailwind used inside this component), font stack `Inter, -apple-system, ...`. Dark hero card (near-black gradient `#08080d → #14141e`) with a radial gold glow, containing the intro copy and five clickable company pills that jump-scroll to each story section. Below that, a sticky horizontal nav strip (white background, scrollable pill row, one pill per company, active pill highlighted in that company's colour) that tracks scroll position. Below the nav, a gold-tinted "How to use this lesson" instructional banner.

Each story is a large gradient "chapter header" card (using the story's own two-stop `gradient` value, e.g. Airbnb's `linear-gradient(135deg, #FF5A5F 0%, #E61E4D 100%)`) showing emoji, "Story N · Year", company name, tagline, and hook line, with two decorative translucent circles. Below the header, a 7-item **accordion** (single-open, click to toggle) covering the six narrative sections plus a video section; the currently open section is highlighted with the story's `colorDim` background and colored border. Accordion sections use small internal components (`ProblemSection`, `StruggleSection`, `BreakthroughSection`, `ISSection`, `ImpactSection`, `LessonSection`) each with their own layout (e.g. `StruggleSection` renders a vertical timeline with dots and a connecting gradient line; `ImpactSection` renders a metrics grid of stat tiles; `LessonSection` renders a dark pull-quote block, a highlighted "Strategic Takeaway" callout, and a second nested accordion of the three discussion questions).

Videos (`VideoEmbed`) are lazy — they render a clickable YouTube thumbnail (fetched from `img.youtube.com`, falling back from `maxresdefault.jpg` to `hqdefault.jpg` on image error) with a play button overlay; clicking swaps in a real `<iframe>` YouTube embed with `autoplay=1`. This avoids loading YouTube's iframe API until the user actually wants to watch.

Reveal-on-scroll is implemented via a custom `useReveal` hook (an `IntersectionObserver` with `threshold=0.12` that sets `visible=true` once and disconnects) wrapping content in a `Reveal` component that transitions `opacity`/`transform: translateY` — this is a hand-rolled equivalent of `framer-motion`'s `whileInView`, used because this component does not import framer-motion (unlike the surrounding page).

The finale section mirrors the hero's dark-gradient card treatment, with five clickable "finale lesson cards" (hover lifts via a CSS class `.fs5-finale-card:hover`) that scroll back up to each story, and a large closing "Your turn." headline. The very last block ("Here's to the crazy ones") is a third dark card with staggered prose sub-sections and a final `VideoEmbed` for the Apple ad.

Responsive: metric grid collapses to 2 columns under 600px via a media query injected in a `<style>` tag scoped to this component; most sizing uses `clamp()` for fluid typography.

## 4. Component & state architecture

**`FiveStoriesPage.tsx`** (route `/five-stories`): stateless page shell. Renders nav, an animated hero (framer-motion `initial`/`animate`/`transition` props, no scroll-linked motion values), the `<FiveStoriesLesson />` component in a `max-w-5xl` section, and a footer.

**`FiveStoriesLesson.tsx`** (the actual content, `src/components/slides/FiveStoriesLesson.tsx`):
- **Data model:** a single top-level `STORIES: Story[]` constant array holds all five companies' full content. The `Story` interface fields are: `id, name, emoji, year, tagline, color, colorDim, gradient, videoId, videoTitle, videoId2?, videoTitle2?, hook, problemParagraphs: string[], struggle: StoryStruggle[] ({date,title,body}), breakthrough: string[], insight, isHeading, isBody: string[], isConcepts: string[], metrics: StoryMetric[] ({value,label}), impact: string[], quote, takeaway, questions: StoryQuestion[] ({q,text})`. A second small constant `FINALE_LESSONS` holds the five one-line recap cards for the finale grid.
- **Top-level state:** `activeStory: string | null` — which company's section is currently in view, driven by five separate `IntersectionObserver`s (one per story section, `threshold: 0.2`) set up in a `useEffect` on mount, used to highlight the correct pill in the sticky nav strip. `scrollTo(id)` both calls `scrollIntoView({behavior:'smooth', block:'start'})` on the target story's DOM node (`#story-{id}`) and directly sets `activeStory`.
- **Per-story state:** each `StoryChapter` instance owns its own `openSection: string | null` (defaulting to `'problem'`), an independent accordion — sections toggle closed if you click the currently-open one again. Each `LessonSection` additionally owns its own `openQ: number | null` for the nested discussion-question accordion. Each `VideoEmbed` owns a local `playing: boolean` to gate iframe mounting.
- No Firestore reads/writes anywhere in this component. No props into `FiveStoriesLesson` — it's parameterless and fully self-contained, which is exactly why it can be reused identically in both the public page and the gated `CourseResources.tsx` embed.
- **Gating logic (in `CourseResources.tsx`):** the lesson row is rendered via a generic `LessonRow` wrapper with a `locked` prop computed as `!isStaff && ['normalization','quiz'].includes(lesson.id) && !erMcqPassed` — since `'five-stories'` isn't in that array, `locked` is always `false` for this lesson once the student is authenticated and the route's `ProtectedRoute allowedRoles={['student']}` (or the lecturer route) has already gated the whole page.

## 5. Rebuild notes

- The entire lesson deck is hand-styled with inline `style={{...}}` objects rather than Tailwind classes (unlike most of the surrounding platform) — a rebuild should preserve this since the component injects its own scoped `<style>` block (`.fs5-play-btn`, `.fs5-nav-tab`, `.fs5-finale-card`, and one media query) for the few effects that need real CSS (hover transforms, hover shadow, responsive grid).
- All five YouTube video IDs are real and embedded via the standard `youtube.com/embed/{id}` pattern; thumbnails come from `img.youtube.com/vi/{id}/maxresdefault.jpg` with a graceful `onError` fallback to `hqdefault.jpg`. These should be revalidated periodically since YouTube videos can be taken down or made private; the doc author did not verify each ID resolves to a live video at time of writing.
- The public page (`FiveStoriesPage.tsx`) and the shared `PublicLessonShell.tsx` component used by newer lessons (Bonus Lecture, and presumably others) are *not* the same — `FiveStoriesPage.tsx` has its own bespoke hero markup rather than using `PublicLessonShell`. This looks like `FiveStoriesPage` predates the shell's extraction; a rebuild could optionally migrate it onto `PublicLessonShell` for consistency, but that is not how it currently exists in source.
- No badge-award, scoring, or Firestore persistence exists anywhere in this lesson — it is purely read/interact content with no submitted student work being recorded. If gamification or completion-tracking is desired in a rebuild, that would be new functionality, not a restoration of something present in source.
- The route is registered twice in `src/App.tsx` (once under normal `AppRoutes`, once under `ShutdownRoutes` used when `PLATFORM_ACTIVE` is `false` in `src/config/platform.ts`) — both point at the same lazy-loaded `FiveStoriesPage`, so this is not a second implementation, just duplicate route wiring for the shutdown-mode fallback app shell.
- The lesson's own closing section ties into an unrelated brand asset — Apple's 1997 "Think Different" ad — as a rhetorical device, not as MBI800 subject matter about Apple; a rebuilder should keep this framed as intentional pedagogy (tying five founder stories to a "the crazy ones" theme) rather than mistake it for a sixth company case study.
