# Platform Strategy — MBI800

- **Subject:** MBI800 — Strategic Information Systems (Planning). Explicit tag: the deck's
  title-slide eyebrow reads "MBI800 · Strategic Information Systems", and the public page's
  hero eyebrow reads "MBI800 · Strategic Information Systems".
- **Gating:** Both — a non-gated public standalone page at `/platform-strategy` with its own
  hero, and the exact same `PlatformStrategyDeck` component embedded inside the gated
  Course Resources hub under MBI800 → "Platform Strategy" (lesson id `platform-strategy`).
  On the gated side, `platform-strategy` is **not** in the score-gated lesson-id list
  (`['normalization', 'quiz']`, `src/pages/student/CourseResources.tsx:1742`), so it only
  requires being logged in as `student` or `staff` — no ER-quiz score threshold applies,
  unlike Normalization or the DBMS quiz.
- **Route(s):** `/platform-strategy` (registered twice in `src/App.tsx`, lines 108 and 192 —
  both map to the same `PlatformStrategyPage` element, one presumably inside a public-route
  block and one inside a legacy/duplicate block; not investigated further here since both
  resolve identically).
- **Source files:**
  - `src/pages/PlatformStrategyPage.tsx` (137 lines) — public page wrapper: nav, hero, footer.
  - `src/components/slides/PlatformStrategyDeck.tsx` (1166 lines) — the actual 18-slide deck,
    the in-class group-research-activity widget, and the 8-question knowledge-check quiz.
    Reused verbatim on both the public page and the gated Course Resources hub.
  - `src/pages/student/CourseResources.tsx` — gated host; lesson entry at lines 172–178
    (id `platform-strategy`), embed at line 1795 (`{lesson.id === 'platform-strategy' &&
    <PlatformStrategyDeck />}`), gating check at line 1742.
  - `src/pages/HomePage.tsx:90` — links to `/platform-strategy` from the homepage lesson grid.
  - `src/components/ui/BrandLogo.tsx` — shared logo component used in the public page's nav
    and footer.
- **Depends on:** `lucide-react` icons (`ChevronLeft`, `ChevronRight`, `Maximize2`,
  `Minimize2`, `Maximize`, `Minimize`, `RotateCcw`, `CheckCircle`, `XCircle`), `framer-motion`
  (public page hero reveals only — the deck itself uses plain CSS animations, not
  framer-motion), Google Fonts `Inter` and `Lora` (loaded via `@import` inside the deck's
  injected `<style>` tag), the Fullscreen API (`requestFullscreen`/`exitFullscreen`) and
  `ResizeObserver` (both browser-native, no library). No Firestore reads/writes anywhere in
  this component — the quiz and activity checklist are purely client-side `useState`, reset
  on remount, nothing persisted.

## 1. Purpose & learning objectives

This lesson extends Strategic Information Systems Planning (SISP) beyond the classic
"plan your own value chain" model into planning for firms whose core strategy is to
orchestrate a network they don't fully own. The deck's own framing (Slide 2) states the
premise directly: classic SISP models assume the firm controls its whole value chain end to
end, and that assumption breaks once a firm's biggest decisions involve a network it doesn't
own outright — outside sellers, developers, drivers. Platform strategy is presented as what
that shift looks like in practice.

The stated learning arc, in the order the slides present it: distinguish pipeline, product,
and platform business models; understand network effects (including the negative,
same-side-congestion kind, not just the flattering examples); understand and be able to name
tactics for solving the "chicken-and-egg" problem in two-sided markets; understand
multi-homing and why it determines whether a market "tips" to one winner; classify platforms
as transaction, innovation, or hybrid (Cusumano, Gawer & Yoffie); walk through the four
design decisions every platform builder has to make; understand platform governance through
the "boundary resources" lens (Ghazawneh & Henfridsson) and the resourcing-vs-securing
trade-off; understand openness as a spectrum, not a binary (citing Joel West); understand
"envelopment" as a competitive-strategy risk (Eisenmann, Parker & Van Alstyne); see one
worked success case (Amazon) and one worked failure case (GE Predix) in detail; see the
empirical evidence that platform strategy correlates with better margins, staff efficiency,
and valuation; and be walked through a critical/risk lens so the topic isn't taught as an
uncritical success story. The deck explicitly frames itself (Slide 15) as "not 'don't build
platforms.' It's: plan for the trade-offs — don't assume a guaranteed win."

The session closes with a hands-on 40-minute group research-and-presentation activity (find
a real platform, analyze it against the concepts just taught, present to the class) and a
self-check quiz for individual reinforcement after the slides.

## 2. Full content

### 2.1 The 18-slide deck (`SLIDES` array, `PlatformStrategyDeck.tsx` lines 132–663)

Each slide below is transcribed from its actual HTML content in source, in order. Slide
background classes (`dark` = navy `#0b1220`, `dark2` = navy `#111827`, unstyled = white,
`slate-bg` defined in CSS but not used by any slide) are noted where distinctive. Every
slide ends with the same footer text: "© All rights reserved · Yasas Sri Wickramasinghe".

**Slide 1 — "Platform Strategy – Title"** (dark background)
Eyebrow: "MBI800 · Strategic Information Systems". Main title: "Platform **Strategy**"
(the word "Strategy" rendered in accent blue `#93c5fd`). Subtitle (italic serif, Lora font):
"Why some of the biggest companies in the world don't make anything at all." Body text:
"Uber owns no cars. Airbnb owns no rooms. The App Store doesn't write a single app. This
session is about how that works — and what it means for how you plan information systems."
Four badge pills: "18 Slides" (ghost style), "Network Effects" (blue), "Case Studies"
(amber), "40-Min Group Activity" (teal), "Knowledge Check" (violet).

**Slide 2 — "Why This Belongs in SISP"**
Section label: "Framing". Title: "Where This Fits in **Your Planning Toolkit**". Left
column: callout (blue) — "Classic SISP models assume the firm controls its whole value
chain, end to end." Body text: "That breaks once a firm's biggest decisions involve a
network it doesn't fully own — outside sellers, developers, drivers." Callout (amber):
"Platform strategy is what that shift looks like in practice." Right column, a
two-column comparison table:

| A traditional plan asks… | A platform-era plan also asks… |
|---|---|
| What systems does our value chain need? | What ecosystem are we part of? |
| How do we align IT with the business? | How do outsiders safely build on us? |
| What's our architecture roadmap? | Is our architecture open at the edges? |
| How do we govern IT risk? | How do we govern a network we don't own? |

**Slide 3 — "Pipes, Products, and Platforms"** (dark2 background)
Section label: "Foundations". Title: "Pipes, Products, and **Platforms**". Three pillar
cards:
- 📦 **Pipeline business** — "Value flows one way: design → build → sell. The firm owns the
  whole chain."
- 🎯 **Product business** — "One offering, sold directly. No crowd of outside partners
  needed."
- 🔗 **Platform business** (highlighted, accent color) — "Connects two or more groups. The
  owner supplies the rules and infrastructure — not always the product."

Closing callout (blue): "Platforms **orchestrate** value. They don't have to **own** it."

**Slide 4 — "Network Effects"** (interactive click-to-reveal cards)
Section label: "Core Mechanics · Click each card". Title: "Why Platforms Get **Stronger
With Size**". Intro: "A **network effect**: the platform gets more valuable as more people
use it. Click each card." Four cards (each shows a hint until clicked, then reveals its
content permanently — `data-revealed` state, no auto-collapse):
1. 🚗 **Cross-side, positive** (hint: "Ride-hailing example →") — reveals: "More drivers =
   shorter waits for riders. More riders = more fares for drivers."
2. 💬 **Same-side, positive** (hint: "Messaging example →") — reveals: "More friends on a
   messaging app makes it more useful to you — no other side involved."
3. 🚦 **Same-side, negative** (hint: "Congestion example →") — reveals: "Too many drivers in
   one area lowers earnings per driver. Growth isn't always good."
4. 🧠 **Data network effect** (hint: "Netflix example →") — reveals: "Every interaction
   improves recommendations for everyone — even without new users."

Closing callout (amber): "**Watch out:** network effects aren't always good. Managing the
negative ones matters as much as growing the positive ones."

**Slide 5 — "The Chicken-and-Egg Problem"** (dark2 background, interactive reveal cards)
Section label: "Two-Sided Markets · Click each tactic". Title: "Solving the
**Chicken-and-Egg Problem**". Intro: "Neither side wants to join an empty platform. The
fix: price the two sides differently. Click a tactic to see who used it." Five cards:
1. 💸 **Subsidise one side** — reveals: "Uber paid early drivers to guarantee supply before
   riders trusted the app."
2. 🎮 **Single-player mode** — reveals: "Early Airbnb worked as a browsing tool even with
   zero hosts nearby."
3. 📦 **Seed your own supply** — reveals: "Amazon and Zappos listed their own inventory
   first, before opening to sellers."
4. 🐴 **Piggyback a network** — reveals: "PayPal grew by riding on eBay auctions — showing up
   where its users already were."
5. 📍 **Target a micro-market** — reveals: "Facebook launched at one campus first.
   Food-delivery apps still launch suburb by suburb."

Closing callout (blue): "Today's group activity: find a real platform online and work out
which of these tactics it actually used." — this is the explicit bridge line into the later
group activity.

**Slide 6 — "Multi-Homing & Switching Costs"**
Section label: "Core Mechanics". Title: "Multi-Homing: **Why Some Markets Tip, Others
Don't**". Callout (teal): "**Single-homing:** sticking to one platform. **Multi-homing:**
using rival platforms at once — a hotel listed on Booking.com *and* Expedia." Body text:
"The easier it is to multi-home, the harder it is for one platform to become a monopoly."
Two cards: "Low multi-homing cost →" / "Several platforms survive side by side." and "High
multi-homing cost →" / "The market tips toward one winner." Closing callout (amber):
"Example: Alexa, Siri and Google Assistant — the winner depends on how easily people can
switch between them."

**Slide 7 — "Transaction, Innovation, Hybrid"**
Section label: "Classification · Cusumano, Gawer & Yoffie". Title: "Three Kinds of
**Platforms**". A comparison table:

| Dimension | 🔁 Transaction platform | 🛠️ Innovation platform |
|---|---|---|
| What it does | Lets people find and transact with each other | Gives third parties a technology base to build on |
| Revenue | Commission, listing fees, subscription | Licensing, revenue share, cloud/hardware sales |
| Governance focus | Trust, ratings, fraud prevention | Developer relations, API stability, IP protection |
| Examples | eBay, Airbnb, Uber, Stripe | Windows, Android, AWS, Salesforce Platform |

Closing callout (blue): "**Hybrid platforms** do both. Apple's iOS lets developers build
apps (innovation); the App Store sells and distributes them (transaction). Amazon's
Marketplace is transaction; AWS underneath is innovation."

**Slide 8 — "Four Steps to Build a Platform"** (dark background)
Section label: "Design Discipline". Title: "Four Decisions Every Platform **Has to Make**".
Numbered step list:
1. **Choose your sides.** "Which groups will you connect?"
2. **Solve chicken-and-egg.** "Which side do you seed first, and how?"
3. **Design the business model.** "Who pays, how much, on each side?"
4. **Set the governance rules.** "How open is it, and who shares in the value?"

Source citation callout: "Source: Cusumano, Gawer & Yoffie, *The Business of Platforms*
(2019)."

**Slide 9 — "Boundary Resources & Governance"**
Section label: "The IS Research Lens · Ghazawneh & Henfridsson". Title: "Governance:
**Enable, or Control?**". Callout (violet): "Platform owners govern outsiders through
**boundary resources** — APIs, SDKs, and review processes." Body text: "Every boundary
resource balances two things: enough capability for developers to build value, without
losing control." Two side-by-side mini-cards: "Resourcing →" / "Enable. Attract
developers." and "← Securing" / "Control. Protect. Review." Case card: "Case in point:
Apple's App Store" — "Apple's app review does both jobs at once: it gives developers a huge
market (resourcing), while reviewing every app and taking a commission (securing)." Closing
callout (amber): "Governance and architecture *co-evolve*. Open up the rules without
redesigning the system to support it, and you create risk."

**Slide 10 — "The Openness Spectrum"**
Section label: "Governance Is Not Binary". Title: "How Open Should **a Platform Be?**".
Intro: "Joel West's framing still holds: openness is 'many shades of grey.' Most successful
commercial platforms sit somewhere in the middle — open enough to attract an ecosystem,
controlled enough to stay trustworthy." A five-point visual spectrum track, left to right:
- **Closed** — "Traditional mainframe software — single vendor, no outside development"
- **Curated** — "Apple iOS / App Store — open to developers, tightly reviewed"
- **Open core, curated layer** — "Android — open-source base, curated Play Store on top"
- **Open standard** — "An interoperability protocol donated to a neutral foundation so no
  single vendor controls it"
- **Fully open** — "Wikipedia — community-governed, no gatekeeping"

Closing callout (blue): "Where you sit on this spectrum is a strategic choice, not a
technical afterthought — and it's one every SISP needs to make explicit."

**Slide 11 — "Platform Envelopment"** (dark2 background, interactive toggle cards)
Section label: "Competitive Strategy · Eisenmann, Parker & Van Alstyne · Click each card".
Title: "Envelopment: **Winning by Bundling, Not Building**". Intro: "An **enveloper**
doesn't out-innovate a rival platform — it enters an adjacent market and bundles its own
feature in, using a user base it already owns." Three toggle cards (open/close, unlike the
earlier one-way-reveal cards):
1. **Complements** — reveals: "A social platform builds native messaging in, so users no
   longer need a separate standalone messaging app."
2. **Weak substitutes** — reveals: "A cloud storage platform adds lightweight document
   editing — enough overlap with a standalone office suite to erode its reason to exist."
3. **Functionally unrelated** — reveals: "A hardware ecosystem cross-sells an unrelated
   service — say, payments — to the installed base it already has, foreclosing a rival's
   entry point."

Closing callout (blue): "**Defending against it:** open up your own layer to build allies,
or build a comparable bundle yourself, first."

**Slide 12 — "Case Study — Amazon"**
Section label: "Case Study 1". Title: "Amazon: From **Bookstore to Hybrid Platform**". Two
cards on the left:
- 🔁 **Marketplace — transaction platform** — "Opened to third-party sellers to fill
  selection gaps, without carrying inventory risk."
- 🛠️ **AWS — innovation platform** — "Started as Amazon's own infrastructure, then sold
  externally — even to Amazon's retail rivals."

Right column: callout (blue) — "**The Flywheel:** lower prices + more selection → more
traffic → more sellers → lower costs → lower prices again." Callout (amber) — "**SISP
takeaway:** internal infrastructure can become a second platform business. Who gets
admitted is a governance call, not an operational one."

**Slide 13 — "Case Study — GE Predix"** (dark background, interactive toggle cards)
Section label: "Case Study 2 · A Counter-Example · Click each card". Title: "GE Predix:
When a **Platform Strategy Fails**". Intro: "GE launched Predix in 2014 to become 'the
Android of industry.' It was quietly retired around 2022. Click each card." Three toggle
cards:
1. **Tried to serve too many sides** — reveals: "Aviation, healthcare and oil & gas all
   need different things. One platform couldn't go deep enough in any of them."
2. **Built its own cloud, alone** — reveals: "GE built its own data centres instead of
   using AWS or Azure — competing with far bigger cloud players."
3. **Not developer-friendly** — reveals: "Hard for outsiders to build on. A platform with
   no developer ecosystem is just expensive custom software."

Closing callout (rose/red): "GE spent roughly $4 billion over six years on Predix. Most
platform teaching leans on winners — this is the counter-example worth remembering."

**Slide 14 — "Does Platform Strategy Pay Off?"**
Section label: "The Evidence". Title: "Does Being a Platform **Actually Pay Off?**". Left
column: callout (blue) — "A study of 43 public platform companies found they did the same
revenue with **half the staff**, **twice the profit**, and **twice the growth** of similar
non-platform firms." Body text: "A separate study of 959 unicorns found platform models
carry a real valuation premium — though the size varies by region." Right column: a
horizontal bar-style visualization of valuation premium, platform vs. non-platform
unicorns, by region:
- North America: **+129%**
- Europe: **+68%**
- Asia-Pacific: **+39%**

Caption: "Valuation premium, platform vs. non-platform unicorns · one study, one point in
time."

**Slide 15 — "Risks & Critique"** (dark2 background)
Section label: "Don't Teach This Uncritically". Title: "Where Platform Strategy **Goes
Wrong**". Two columns of cross-marked (✗) bullet lists:

Left column:
- **Mispricing** — "subsidise the wrong side and liquidity never arrives."
- **Cold-start failure** — "most launches never solve chicken-and-egg."
- **Scope overreach** — "the Predix pattern: too many verticals at once."

Right column:
- **Trust collapse** — "weak governance can destroy the value fast."
- **Dependence** — "once sellers rely on you, you can change the rules on them."
- **Regulation** — "antitrust scrutiny grows with platform dominance."

Closing callout (blue): "This isn't 'don't build platforms.' It's: plan for the trade-offs
— don't assume a guaranteed win."

**Slide 16 — "A Diagnostic Toolkit"**
Section label: "Practical Toolkit". Title: "Six Questions for **Your Own SISP Work**".
Numbered step list:
1. **Sides:** "do we connect two or more groups who need each other?"
2. **Latent asset:** "do we have infrastructure or data others would value too?"
3. **Network effect:** "does one more user make it better for everyone else?"
4. **Chicken-and-egg:** "which side can we seed first, and how?"
5. **Governance readiness:** "can we build the rules and APIs responsibly?"
6. **Envelopment risk:** "who could bundle us out of our own market?"

**Slide 17 — "Discussion Questions"** (dark background)
Section label: "Before We Move to the Activity". Title: "Questions Worth **Sitting With**".
Numbered list of three discussion prompts:
1. "Name something you use weekly that's a pure pipeline business. Now name one that
   quietly became a hybrid platform without you noticing."
2. "Pick a platform you use regularly. Which adjacent platform could envelop it — and how
   would you defend against that?"
3. "GE had money, engineers, and existing industrial customers. Which single decision
   point, if reversed, might have saved Predix?"

**Slide 18 — "Today's Activity"** (dark2 background)
Section label: "Group Activity · 4–6 Members · 40 Minutes". Title: "Find a Platform.
**Present It.**". Callout (blue): "Get into groups of 4–6. Pick any real platform — one you
use, or one you've heard of. Research it online, then prepare a short presentation for the
class." Checklist (✓ style):
- "Who are its two or more sides?"
- "How did it solve the chicken-and-egg problem?"
- "How does it make money, and how open is it?"

Right column, a three-row timing breakdown: "Form groups, pick a platform" — 5 min;
"Research online, build slides" — 25 min; "Present to the class" — 10 min. This slide is
the deck-embedded preview of the interactive activity widget rendered separately below the
deck (section 2.2).

### 2.2 In-class group activity widget (`GroupResearchActivity`, lines 665–782)

Rendered below the slide deck itself (not one of the 18 slides — a separate live React
component), under the on-page heading "In-Class Activity · Group of 4–6 · 40 Minutes /
Find a Platform. Present It." with the caption "5 min form groups · 25 min research online
and build slides · 10 min present."

Header inside the widget: "Group Activity · 4–6 Members · 40 Minutes / Find a Platform.
Present It. / Pick any real platform, research it online, and prepare a short presentation
for the class."

**Timing breakdown (identical to Slide 18):**
- "Form groups of 4–6, pick a platform" — 5 min
- "Research online, build simple slides" — 25 min
- "Present to the class" — 10 min

**"Stuck for an idea?" random-idea shuffler** — a button labeled "Shuffle" that picks a
random entry (guaranteed different from the currently shown one) from this fixed list of 18
platform names (`IDEA_LIST`, lines 667–671):
Airbnb, Uber, Spotify, Etsy, Duolingo, Roblox, Twitch, DoorDash, Discord, Shopify, Steam,
Substack, YouTube, TradeMe, LinkedIn, Fiverr, Booking.com, PlayStation Network.
Before any click, the placeholder text reads: "Click shuffle for a suggestion — or pick
your own." Helper caption: "Any real platform works. Use it, or something completely
different — your choice."

**"Your presentation should cover"** — a static 4-line outline (`PRESENTATION_SLIDES`,
lines 682–687):
- "Slide 1 — Name the platform and what it does"
- "Slide 2 — Its sides, and one network effect example"
- "Slide 3 — Business model and how open it is"
- "Slide 4 — One risk, or one question for the class"

**Research checklist** — a set of tappable checklist rows (`RESEARCH_QUESTIONS`, lines
673–680), each a toggle button (checked/unchecked, local `useState<boolean[]>`, no
persistence, no submission/scoring — purely a self-tracking aid):
1. "Who are its two or more sides?"
2. "How did it solve the chicken-and-egg problem when it launched?"
3. "What kind of network effect does it rely on?"
4. "How does it make money — who pays, and who doesn't?"
5. "How open or closed is it to outsiders?"
6. "What is one real risk it faces today?"

There is no answer key for this activity — by design it is open-ended research the
students perform live against a platform of their own choosing (or from the shuffle list),
not a graded exercise.

### 2.3 Knowledge-check quiz (`PlatformQuiz` / `QUIZ_QUESTIONS`, lines 784–1005)

Rendered below the group activity under the heading "After the Slides / Test Your
Understanding" with caption "8 questions · Instant feedback · No data stored." One question
shown at a time with Previous/Next navigation and a dot-indicator strip; the quiz can only
be submitted once every question has been answered (`allAnswered`); after submission all 8
questions are shown with the student's answer, the correct answer, and the explanation,
plus a percentage score and an emoji/message keyed to score band (🏆 ≥90%, 🎉 ≥70%, 📚 ≥50%,
💪 otherwise), and a "Retry" button that fully resets state. All 8 questions, verbatim,
with the correct choice marked in **bold** and each explanation transcribed in full:

**Q1.** "What is the defining feature of a platform business, compared to a pipeline
business?"
- A. It sells software instead of physical goods
- **B. It orchestrates value created by outside participants rather than owning it** ✓
- C. It has no employees
- D. It only operates online

Explanation: "Platforms connect distinct groups and let them create value together — Uber
owns no cars, Airbnb owns no rooms. Ownership of the means of production is not the point."

**Q2.** "More drivers on a ride-hailing app means shorter wait times for riders. What kind
of network effect is this?"
- A. Same-side, positive
- **B. Cross-side, positive** ✓
- C. Cross-side, negative
- D. Data network effect

Explanation: "Cross-side effects run between the two different groups — more of one side
improves the experience for the other side."

**Q3.** "Why does a two-sided platform often subsidise one side and charge the other?"
- A. To maximise short-term profit
- **B. Because one side is usually more price-sensitive, and subsidising it attracts the
  side that pays** ✓
- C. It is a legal requirement in most markets
- D. To reduce server costs

Explanation: "This is the 'seesaw pricing' idea from two-sided market theory (Rochet &
Tirole): get the structure of prices right across both sides, not just the total."

**Q4.** "Facebook launching only at Harvard before expanding campus by campus is an example
of which chicken-and-egg tactic?"
- A. Subsidise one side
- B. Piggyback on an existing network
- **C. Target a micro-market first** ✓
- D. Single-player mode

Explanation: "Seeding a small, well-defined market first makes liquidity achievable before
expanding — the same tactic food-delivery apps use suburb by suburb."

**Q5.** "In the Ghazawneh & Henfridsson boundary resources model, what does 'securing'
refer to?"
- A. Encrypting user data
- B. Giving developers more capability
- **C. Controlling and protecting the platform — review, certification, IP protection** ✓
- D. Raising the app store commission

Explanation: "Boundary resources balance resourcing (enabling developers) against securing
(protecting platform integrity, security and business position)."

**Q6.** "Which of these is a genuine platform envelopment move?"
- A. Lowering your own prices to compete directly
- **B. Bundling a feature into your own platform using an existing shared user base, to
  foreclose a rival's access to users** ✓
- C. Filing a patent on a competitor's technology
- D. Acquiring a competitor outright

Explanation: "Envelopment specifically means leveraging an existing user relationship to
bundle in adjacent functionality — not just competing on price or buying the rival."

**Q7.** "What was a core reason GE Predix struggled, according to the case discussed in
this lecture?"
- A. GE lacked capital to invest
- **B. It tried to serve too many unrelated industrial verticals with one undifferentiated
  platform, and built proprietary infrastructure competing with hyperscalers** ✓
- C. No industrial company was interested in IoT data
- D. GE never assigned it a dedicated business unit

Explanation: "Predix spread itself across aviation, healthcare, power and oil & gas at once,
and built its own data centres instead of using existing cloud infrastructure — both classic
platform scope-and-infrastructure mistakes."

**Q8.** "In a strategic IS plan, what does the 'envelopment-exposure' diagnostic question
ask?"
- A. How much revenue comes from platform fees
- **B. Which adjacent platform could bundle our functionality and cut off our access to
  users** ✓
- C. How many developers use our API
- D. What our customer acquisition cost is

Explanation: "This diagnostic question is about defending your own position — identifying
who could envelop you before they do."

## 3. UI & interaction design

**Public page (`PlatformStrategyPage.tsx`).** A sticky, blurred top nav (`bg-white/90
backdrop-blur-xl`) containing only the `BrandLogo` linking to `/home`. A full-bleed hero
with three soft blurred gradient blobs (blue `#2563eb`, violet `#7c3aed`, teal `#0d9488`)
positioned absolutely behind the content. Hero content is centered, Apple-system-font styled
(`-apple-system, BlinkMacSystemFont, "SF Pro Display"...`), and staggers in with
`framer-motion` (`initial`/`animate` opacity+y transitions, custom ease curve
`[0.16, 1, 0.3, 1]`, delays from 0 to 0.5s): eyebrow label, then a large headline ("Platform"
in black, "Strategy." in a blue→violet→teal gradient text-clip), then a descriptive
paragraph, then five topic pill badges (Network effects, Chicken-and-egg, Governance, Case
studies, Group activity — each with its own emoji and accent color), then a bouncing
"Scroll to begin" hint (`animate={{ y: [0, 7, 0] }}`, infinite loop). Below the hero, the
deck is dropped into a plain `max-w-5xl` content section. A minimal footer repeats the logo
and a "‹ Back to all lessons" link to `/home`.

**The deck itself (`PlatformStrategyDeck.tsx`).** This is a from-scratch "slide deck built
in a `<div>`" pattern, not a UI library: on mount, a big literal CSS string (`DECK_CSS`) is
injected into `document.head` as a `<style>` tag (id `pfs-deck-styles`, removed on unmount)
and the current slide's HTML is rendered via `dangerouslySetInnerHTML` into a `<section>`
with class `pfs` scoping. Each slide is authored at a **fixed 1920×1080 canvas** and scaled
down responsively: a `ResizeObserver` on the wrapper measures the available width, computes
`scale = width / 1920`, and applies a CSS `transform: scale(...)` to the inner canvas div,
with `transformOrigin: top left` and the wrapper's height set to `1080 * scale` so the
scaled slide doesn't overflow or leave whitespace. Design language: navy/near-black dark
slides (`--navy:#0b1220`, `--navy2:#111827`) alternate with white slides throughout for
visual rhythm; a consistent accent palette (blue `#2563eb`/`#1d4ed8`, violet `#7c3aed`, gold
`#d97706`, teal `#0d9488`, rose `#e11d48`, green `#059669`) is used for callouts, badges,
tables and pillar cards via named CSS custom properties. Typography is Inter (300–900
weights) for all UI text and Lora (serif, italic) for one pull-quote-style subtitle on the
title slide, both pulled from Google Fonts via `@import` inside the injected stylesheet.
Slide-entry animation is a plain CSS keyframe fade-up (`pfs-fadeUp`, staggered via `.fu`,
`.fu1`, `.fu2`, `.fu3` classes with 0/0.08s/0.18s/0.28s delays) — no framer-motion inside
the deck itself. Several slides (4, 5, 11, 13) use plain inline `onclick` handlers written
directly into the HTML strings (e.g. `onclick="this.setAttribute('data-revealed','true')"`)
to implement click-to-reveal or click-to-toggle cards, styled via `[data-revealed='true']`
/ `[data-open='true']` attribute selectors in the injected CSS — this is DOM-level
imperative interaction living inside a string of HTML, not React state, since the whole
slide markup is injected via `dangerouslySetInnerHTML`.

**Deck chrome / navigation model.** A slide-deck (not scroll-reveal) navigation model:
Previous/Next chevron buttons, a "current / total" counter, the current slide's internal
label (e.g. "4 Network Effects") shown on `sm:` breakpoints and up, an Expand/Collapse
toggle button, and a Fullscreen toggle button (native Fullscreen API via
`wrapRef.current.requestFullscreen()`). Below the slide canvas, a row of dot indicators
(one per slide, current slide wider) doubles as direct-jump navigation. Keyboard support:
ArrowRight/ArrowDown advances, ArrowLeft/ArrowUp goes back, Escape exits fullscreen if
active — all wired via a single `window` `keydown` listener with cleanup.

**Activity and quiz widgets.** Both are ordinary React components (not injected HTML),
rendered below the deck in the same page flow, each with its own gradient header bar
(navy-to-blue `linear-gradient(135deg, #0b1220, #1d4ed8)`) matching the deck's dark-slide
palette for visual continuity. The quiz has a thin animated progress bar under its header
(`width` transitions with question index) and a segmented dot-navigator matching the
deck's own dot-strip pattern for consistency. Choice buttons in the quiz reveal
correct/incorrect state via background/border/text color changes rather than modals or
alerts.

## 4. Component & state architecture

`PlatformStrategyDeck` (default export, lines 1009–1166) owns three pieces of `useState`:
`current` (active slide index, 0–17), `expanded` (boolean, toggles a layout class), and
`fullscreen` (boolean, mirrors `document.fullscreenElement` via a `fullscreenchange`
listener). Two `useRef`s (`wrapRef`, `canvasRef`) back the fullscreen target and the
scaled-canvas element respectively. Four `useEffect` hooks handle: (1) injecting/removing
the `DECK_CSS` stylesheet exactly once on mount/unmount with an idempotency guard
(`document.getElementById(styleId)`); (2) wiring the `ResizeObserver` for responsive
scaling; (3) the global keyboard-navigation listener; (4) syncing `fullscreen` state to the
actual browser fullscreen state. `SLIDES` is a static, module-level array of 18 objects
(`{ classes: string; label: string; html: string }`) — pure data, no props in or out.

`GroupResearchActivity` (unexported, lines 689–782) is a fully self-contained function
component with two local state pieces: `idea` (`string | null`, the currently shown
platform suggestion) and `checked` (`boolean[]` of length 6, one per research question).
`shuffleIdea()` loops `Math.random()` picks from `IDEA_LIST` until it differs from the
current `idea` (guarantees a visible change on every click, allowed to pick the same value
back-to-back only across separate multi-click sessions since the loop only excludes the
immediately-prior value). `toggle(i)` flips one checklist entry immutably. No props, no
external data, no persistence — remounting the deck (e.g. navigating away and back) fully
resets this widget.

`PlatformQuiz` (unexported, lines 837–1005) holds `answers` (`(number | null)[]` of length
8, one selected-option-index per question or `null` if unanswered), `submitted` (boolean),
and `current` (active question index, 0–7). `score` and `pct` are derived (not stored)
whenever `submitted` is true, by comparing `answers[i]` to `QUIZ_QUESTIONS[i].correct`.
`choose(idx)` is a no-op once `submitted` is true (buttons are also `disabled` in that
state). `allAnswered` gates whether the "Submit Quiz" button is enabled on the last
question. `reset()` clears all three state pieces back to their initial values, used by the
"Retry" button. `QUIZ_QUESTIONS` is a static module-level array of 8
`{ q, options, correct, explain }` objects.

**No Firestore reads or writes anywhere in this file** — no collection names, no document
shapes, no scoring persisted server-side, no badge-award triggers. Everything is
client-local `useState` that resets on unmount/remount. This is a meaningful difference
from lessons like Normalization or the DBMS/ER quizzes elsewhere in MBI802, which persist
scores and gate subsequent content on them.

**Gating logic (host-side, `CourseResources.tsx`).** The gated embed at line 1795
(`{lesson.id === 'platform-strategy' && <PlatformStrategyDeck />}`) takes no props and
receives no gating wrapper beyond the outer course/lesson-list auth check. The score-gate
check at line 1742 (`const gated = !isStaff && ['normalization', 'quiz'].includes(lesson.id)
&& !erMcqPassed;`) explicitly excludes `platform-strategy` from its list, so any logged-in
student or staff account can open this lesson with no additional unlock condition, unlike
`normalization` or `quiz` which stay locked behind `erMcqPassed`. On the public side
(`/platform-strategy`), there is no auth check at all — the route is unconditionally public
in `src/App.tsx` (registered at both line 108 and line 192).

## 5. Rebuild notes

- **Duplicate route registration.** `/platform-strategy` is registered twice in
  `src/App.tsx` (lines 108 and 192), both pointing at the same `PlatformStrategyPage`
  element wrapped in `<Suspense fallback={null}>`. This was not investigated further (e.g.
  whether one sits inside a duplicated router `<Routes>` block for a different layout
  wrapper) — a rebuilder should check both call sites in `App.tsx` before assuming a single
  route definition covers it.
- **`dangerouslySetInnerHTML` + inline `onclick` strings.** All 18 slides' interactive
  reveal/toggle affordances (slides 4, 5, 11, 13) are implemented as literal `onclick="..."`
  attributes inside HTML template strings, manipulating `data-revealed`/`data-open`
  attributes that the injected CSS keys off of. This is intentionally outside React's normal
  event system — a straight rebuild should preserve this pattern (or deliberately modernize
  it to React state per-slide, which would be a design change, not a faithful rebuild).
- **Global stylesheet injection.** The entire deck's visual design lives in one large
  template-literal CSS string (`DECK_CSS`, lines 8–130) injected into `document.head` at
  runtime, scoped only by a `.pfs` class prefix — there's no CSS Modules/Tailwind isolation
  for slide-internal styling. Two components mounting `PlatformStrategyDeck` simultaneously
  would both point at the same injected `<style id="pfs-deck-styles">` tag; the mount/unmount
  effect guards against duplicate injection but the current code doesn't reference-count
  removal, so if the component were ever rendered twice in the same tree, the second
  unmount would remove styles the first instance still needs. In current usage
  (`PlatformStrategyPage` and gated `CourseResources`) the component is never mounted twice
  at once, so this hasn't surfaced as a bug.
- **Fixed 1920×1080 authoring canvas.** All slide content is authored at a hard-coded
  1920×1080 resolution and scaled via CSS `transform: scale()` based on container width, with
  height locked to maintain the 16:9 canvas aspect ratio (`1080 * scale`). This means slide
  content itself is never reflowed for narrow viewports — only visually shrunk. A rebuilder
  targeting genuinely responsive (reflowing) slides would need a different approach.
  Font sizes are also expressed as CSS custom properties in absolute pixels at the 1920px
  canvas scale (`--title:64px`, `--body:32px`, etc.), which only look proportionate because
  the whole canvas scales uniformly.
  - **No external assets** — no images, SVGs, or video files are referenced anywhere in this
  component. All visual elements (icons, decorative blur circles, bars, spectrum diagram)
  are emoji, inline SVG-free CSS gradients/shapes, or `lucide-react` icon components. No
  asset revalidation is needed for a rebuild.
- **No external links.** No `<a href>` or outbound URLs appear anywhere in the deck, the
  activity widget, or the quiz — nothing to revalidate.
- **Citations embedded in content, not linked.** Several slides cite named academic sources
  in plain text only (Cusumano, Gawer & Yoffie's *The Business of Platforms* (2019);
  Ghazawneh & Henfridsson's boundary resources model; Joel West's openness framing;
  Eisenmann, Parker & Van Alstyne's envelopment theory; Rochet & Tirole's two-sided-market
  pricing, referenced only in the quiz explanation for Q3) — these are unlinked, prose-only
  citations; a rebuilder does not need to chase down live URLs for them since none exist in
  source.
- **Quiz has no server-side record.** Unlike ER/DBMS quizzes elsewhere in the platform
  (which gate subsequent lessons on a passing score), this quiz's score is never sent
  anywhere — it's purely a self-check with an in-memory reset. If a future requirement is to
  gate something on this quiz's outcome, that plumbing does not currently exist and would
  need to be built from scratch (state lifted out of `PlatformQuiz`, a callback prop, and a
  persistence layer).
