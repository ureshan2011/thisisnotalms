# Systems Security — MBI800

- **Subject:** MBI800 — Strategic Information Systems (Planning). Explicitly labelled in the
  page itself: the hero eyebrow reads "MBI800 · Strategic Information Systems" and the
  component's own header comment says `MBI800 · Strategic Information Systems / "Strategic
  Information Systems Security" — Week 12`. Not inferred.
- **Gating:** Non-gated (public) only. There is no gated copy of this lesson: it is not
  imported or listed anywhere in `src/pages/student/CourseResources.tsx` (that file's MBI800
  lesson list only contains `five-stories`, `sisp-lab`, and `platform-strategy`). Confirmed by
  grepping `CourseResources.tsx` for `SystemsSecurity` — no matches.
- **Route(s):** `/systems-security`. Registered twice in `src/App.tsx` — once inside
  `AppRoutes()` (the normal, full route tree, line 109) and once inside `ShutdownRoutes()`
  (the reduced route tree served when `PLATFORM_ACTIVE` is `false`, line 193). This means the
  lesson stays reachable even in platform-shutdown mode, alongside the other public
  lessons/pages — it is treated as always-on content.
- **Source files:**
  - `src/pages/SystemsSecurityPage.tsx` — the public page shell (hero, nav, footer), 128 lines.
  - `src/components/slides/SystemsSecurityLesson.tsx` — the actual lesson content and all its
    interactive widgets, 1072 lines.
  - `src/App.tsx` — route registration (lines 21, 109, 193).
- **Depends on:** No Firestore reads/writes, no external links, no shared design-system
  components beyond `src/components/ui/BrandLogo` (used only by the page shell for the nav/
  footer logo) and `framer-motion` (used only by the page shell for hero reveal animation).
  The lesson component itself (`SystemsSecurityLesson.tsx`) is fully self-contained: no
  imports beyond React (`useState`, `useEffect`, `useRef`) and its own inline styles/types. All
  state is local component state — nothing is persisted, scored to a backend, or gated behind
  a threshold.

## 1. Purpose & learning objectives

The component's own header comment states its intent directly: "A public, self-contained,
highly interactive lesson. Beginner-friendly on the surface, with depth available on demand.
Built to match the house style of the other lessons (Apple-like, white canvas,
Reveal-on-scroll, soft cards)." It is filed as Week 12 of the Strategic Information Systems
Security unit.

The lesson's own intro paragraph (rendered at the top of the content, verbatim) frames the
learning objective:

> "Every organisation now runs on information systems — and every one of those systems can be
> interrupted, stolen, corrupted, or destroyed. **Systems security** is the discipline of
> understanding what could go wrong, deciding how much it would cost, and building the
> defences and recovery plans to survive it."
>
> "This lesson is built to be *played with*. Calculate real risk, profile the attackers, tell
> the malware apart, peel back the layers of defence, run a backup simulator, and choose a
> disaster-recovery plan — then test yourself at the end. Start anywhere."

In short, by the end a student should be able to: name the six categories of loss an
information system exposes; describe security as a four-phase system-development life cycle
(not a one-off project); quantify risk exposure both quantitatively and qualitatively;
identify the three groups of people who pose active threats and the six specific ways they
attack; distinguish logic bombs, Trojan horses, worms, and viruses; explain the three-layer
model of access control (site / system / file); explain fault tolerance and the difference
between full, incremental, and differential backup strategies (including archive-bit
behaviour and restore trade-offs); compare cold, warm, and hot disaster-recovery sites; list
organisational/human controls that support technical ones; and pass a five-question scenario
quiz pulling all of the above together.

## 2. Full content

The lesson is a single continuous scroll (`Reveal`-on-scroll animated) page built from ten
numbered "Parts," each with a kicker label, title, and blurb, followed by a closing statement.
Every part is transcribed below in full, including all interactive widget content, exact
option text, and correct answers.

### Intro (no Part number)

Body text (verbatim, two paragraphs) is quoted in full in Section 1 above and is not repeated
here.

### Part 1 · The stakes — "What can you actually lose?"

Kicker: **Part 1 · The stakes** (red). Title: **"What can you actually lose?"** Blurb: "Before
defending anything, name what is at risk. A computerised information network exposes six
distinct kinds of loss. Tap each to see it in the real world."

Widget: `LossesExplorer` — a grid of six tappable cards. Each card shows an icon, a title, a
one-line "short" description always visible, and a "deep" real-world example that expands
when tapped (toggle; only one open at a time by default — the first card starts open). Full
content of all six cards, verbatim:

1. **⏸️ Business interruption**
   - Short: "The system goes down — and so does the business."
   - Deep: "When an airline's booking system fails for a few hours, planes still fly but
     nobody can be checked in, rebooked, or sold a seat. The cost is not the broken server —
     it is every transaction that could not happen while it was down."
2. **💿 Loss of software**
   - Short: "The programs that run the business are damaged or stolen."
   - Deep: "Software is intellectual property. A corrupted core application, a deleted code
     repository, or a competitor walking away with your custom system can set a company back
     years."
3. **🗂️ Loss of data**
   - Short: "The single most painful loss — and the hardest to recover."
   - Deep: "Hardware can be rebought in a day. The ten years of customer records, transactions
     and history living on it cannot. This is why backups (later in this lesson) exist."
4. **🖥️ Loss of hardware**
   - Short: "Physical devices destroyed, damaged, or stolen."
   - Deep: "Fire, flood, theft, or simple failure. Hardware is the easiest loss to insure
     against and replace — yet it often takes data and service down with it."
5. **🏢 Loss of facilities**
   - Short: "The building, power, and infrastructure itself."
   - Deep: "A flooded data centre or a severed fibre line takes out everything inside it at
     once. This is the loss that disaster recovery planning (Part 5) is built to survive." —
     *note: this in-app cross-reference to "Part 5" is stale; disaster recovery is actually
     covered in Part 8 of the rendered lesson. This is a wording quirk in the source, not a
     transcription error — see Section 5.*
6. **👥 Loss of service & personnel**
   - Short: "The people and providers who keep it all running."
   - Deep: "A key administrator who leaves with undocumented knowledge, or a cloud provider
     that goes dark, can be as damaging as any technical failure."

Each card's closed state shows the prompt "tap for a real example →"; the open state shows
"— tap to close."

### Part 2 · Build it like a system — "A security system has a life cycle"

Kicker: **Part 2 · Build it like a system**. Title: **"A security system has a life cycle."**
Blurb: "A computer security system is developed like any other information system — through
the same four phases. It is never 'finished'; it loops."

Widget: `LifecycleStepper` — a tabbed stepper (step rail + body, with "‹ Back" / "Next ›"
navigation, wrapping around). Four steps, verbatim:

1. **🔍 Systems Analysis** — one-liner: "Find the weak spots." Body: "Analyse the system's
   vulnerabilities in terms of the threats that are actually relevant to it, and the loss
   exposure each one carries. You cannot protect against a threat you have not named."
2. **✏️ Systems Design** — one-liner: "Plan the defences." Body: "Design the security measures
   and contingency (recovery) plans that will control the loss exposures you identified. This
   is where the recovery plan is born — before anything has gone wrong."
3. **🛠️ Systems Implementation** — one-liner: "Build what you designed." Body: "Put the
   security measures in place exactly as designed — access controls, backups, fault
   tolerance, training. A plan on paper protects nothing."
4. **🔁 Operation, Evaluation & Control** — one-liner: "Run it, measure it, improve it." Body:
   "Operate the security system and continuously assess its effectiveness and efficiency.
   Threats evolve — so the system must change as circumstances require. Security is a loop,
   not a finish line."

### Part 3 · Measure the risk — "How big is the threat, really?"

Kicker: **Part 3 · Measure the risk**. Title: **"How big is the threat, really?"** Blurb:
"Two ways to size up a threat. The quantitative approach multiplies cost by likelihood; the
qualitative approach simply ranks threats by judgement. Try the calculator."

Widget: `RiskCalculator` — two side-by-side cards.

**Quantitative approach card** (heading "QUANTITATIVE APPROACH", indigo): "Put a number on
it. **Loss exposure = cost of one loss × how likely it is.** Drag the sliders." Two sliders:

- "Cost of a single loss" — range $1,000 to $2,000,000, step $1,000, default $250,000,
  formatted with the `fmtMoney` helper (e.g. "$250K", "$1.5M").
- "Likelihood per year" — range 1% to 100%, step 1%, default 15%.

Result readout: "Annual loss exposure" = cost × (likelihood / 100), formatted as money, with a
priority band computed as:
- exposure ≥ $200,000 → **CRITICAL** (red)
- exposure ≥ $50,000 → **HIGH** (amber)
- exposure ≥ $10,000 → **MEDIUM** (blue)
- otherwise → **LOW** (green)

At the defaults ($250,000 × 15%) the exposure is $37,500 → MEDIUM.

**Qualitative approach card** (heading "QUALITATIVE APPROACH", green): "No precise numbers?
Just **list the threats and rank them** by how much they contribute to total loss exposure.
Faster, more subjective." Static example table of four rows (text and risk label verbatim):

| Threat | Risk |
|---|---|
| Ransomware encrypts customer database | Critical |
| Disgruntled employee deletes records | High |
| Laptop with no sensitive data stolen | Medium |
| Printer in lobby jams | Low |

Footer note (italic): "Used when reliable cost/probability data is hard to get — which, in
real life, is most of the time."

### Part 4 · The attackers — "Active threats: fraud and sabotage"

Kicker: **Part 4 · The attackers** (red). Title: **"Active threats: fraud and sabotage."**
Blurb: "Active threats are deliberate — someone is doing this on purpose. First, who they are;
then, the six ways they strike."

**Who poses the threat** — three static cards (`THREAT_GROUPS`), verbatim:

1. **🧑‍💻 Systems personnel** — "Maintenance staff, programmers, operators, administrators and
   data-control clerks. They have the deepest access — and so the greatest opportunity."
2. **🧑‍💼 Users** — "People outside the data-processing function who still touch sensitive data
   and control important inputs. Often overlooked, frequently the entry point."
3. **🥷 Intruders** — "Outsiders breaking in. Hackers do it for fun and challenge; others
   include wiretappers, eavesdroppers, impersonators and the unnoticed intruder."

**Widget: `ActiveThreatExplorer`** — six selectable pill buttons opening a detail card showing
icon, title, a coloured "tag" badge, a "What it is" line, a "Why it matters" line, and a
frequency meter (percentage bar, labelled "Very high" ≥80, "Moderate" ≥50, "Low" ≥30, "Very
low" below that). All six attack types, verbatim, with their `freq` values:

1. **⌨️ Input Manipulation** — tag "Most common", freq 95 (Very high).
   - What: "Feeding deliberately wrong input to get a wrong result — misappropriating assets
     or hiding an embezzlement."
   - Why: "It is the most frequently used method of computer fraud, precisely because it needs
     the least technical skill. You do not need to be a programmer to type a fake invoice."
2. **🧬 Program Alteration** — tag "Rarest", freq 15 (Very low).
   - What: "Secretly changing program code to make it behave a certain way (e.g. round every
     transaction down and pocket the fractions)."
   - Why: "The least common method — it demands real technical skill that only a few people
     possess. Programmers should never have unauthorised access to live programs."
3. **🗄️ Direct File Alteration** — tag "Bypass", freq 40 (Low).
   - What: "Editing data directly in the files, bypassing the normal application process
     entirely. \"Transfer company funds to my personal account.\""
   - Why: "Dangerous because it sidesteps every business rule and validation the application
     would normally enforce."
4. **📤 Data Theft** — tag "Espionage", freq 60 (Moderate).
   - What: "Stealing a competitor's (or your own employer's) information. Email and USB drives
     let huge volumes leave in minutes."
   - Why: "The damage is invisible — the data is still there. You only find out when the
     competitor uses it."
5. **💣 Sabotage** — tag "Destruction", freq 50 (Moderate).
   - What: "Destroying some part of computer processing — using logic bombs, Trojan horses,
     worms and viruses (explored below)."
   - Why: "Often the weapon of a disgruntled insider, and the reason access must be revoked
     the instant someone is dismissed."
6. **🪙 Misappropriation of Resources** — tag "Theft of use", freq 45 (Moderate).
   - What: "Using company computer resources for your own purposes — e.g. running a private
     side-business on the company's servers."
   - Why: "Easy to dismiss as harmless, but it steals capacity, raises costs, and exposes the
     organisation to liability."

Default open tab on load: Input Manipulation (`id: 'input'`).

Closing italic note (below the explorer): "Note: the white-collar criminal is notoriously hard
to identify — managers often avoid public prosecution to dodge the negative publicity, so much
computer crime never surfaces at all."

### Part 5 · Malware lab — "Logic bomb, Trojan, worm, or virus?"

Kicker: **Part 5 · Malware lab** (red). Title: **"Logic bomb, Trojan, worm, or virus?"** Blurb:
"Sabotage has a toolkit. These four get confused constantly — so let's pin them down. Read the
cards, then identify each scenario."

Widget: `MalwareLab` — a reference strip of four definition cards, followed by a four-question
matching quiz (one scenario at a time, pick the matching malware type, immediate feedback,
running score, end-of-round summary with retry).

**Reference cards** (`MALWARE`), verbatim:

- **⏱️ Logic Bomb** — "A dormant piece of code that lies in wait and is triggered by a
  specific later event (a date, a deletion, a name vanishing from payroll)."
- **🐴 Trojan Horse** — "A destructive program disguised as a legitimate, useful one. You run
  it willingly — that is the trick."
- **🪱 Worm** — "A virus that spreads itself across a computer network, hopping machine to
  machine without needing a host program."
- **🦠 Virus** — "Code that spreads by attaching itself to other programs, \"infecting\" them
  with a copy of itself."

**Matching scenarios** (`MALWARE_SCENARIOS`), in order, with the correct answer:

1. "Code left by a fired developer that wipes the database exactly 90 days after their name
   disappears from the payroll file." → **Logic Bomb**
2. "\"FreeGameInstaller.exe\" looks like a game, but quietly opens a backdoor when you run
   it." → **Trojan Horse**
3. "A program that copies itself to every machine on the office network overnight, with no
   human action." → **Worm**
4. "Malicious code that latches onto a spreadsheet macro and copies itself into every file you
   open next." → **Virus**

Feedback text: correct answer shows "✓ Correct"; wrong answer shows "✗ Not quite — it's a
{correct name}" followed by that item's definition. End-of-round summary: 🏆 if all 4 correct,
👍 if score ≥ 2, 📚 otherwise, with score shown as "N / 4" and a "↻ Try again" reset button.
Perfect-score message: "Flawless — you can tell these four apart." Otherwise: "Scroll the
reference cards above and try once more."

### Part 6 · Defence in depth — "Controls for active threats"

Kicker: **Part 6 · Defence in depth** (green). Title: **"Controls for active threats."** Blurb:
"The answer to a determined attacker is layers. Three rings of access control stand between a
perpetrator and the data. Tap a ring."

Widget: `LayeredDefence` — a concentric-circle diagram (three clickable rings around a 🎯
target, largest ring = outermost) paired with an explanation card for whichever ring is
selected (default: Site-access). The three layers (`LAYERS`), verbatim:

1. **🚪 Site-access** (outermost, largest ring, blue): "Keep the wrong people away from the
   hardware itself — locked server rooms, security guards, badge readers, cameras. The
   outermost wall."
2. **🔑 System-access** (middle ring, indigo): "Even inside the building, you must prove who
   you are to use the system — passwords, multi-factor authentication, biometrics. The second
   wall."
3. **📁 File-access** (innermost, smallest ring, green): "Logged in is not the same as
   allowed. File-access controls decide which data each authenticated user may actually read
   or change. The innermost wall around the target."

Card footer note (always shown, regardless of selection): "A **layered approach** separates a
perpetrator from their target. To reach the data, an attacker must defeat *every* ring — and
each one is a fresh chance to stop them."

### Part 7 · When nobody is attacking — "Passive threats: failures, not attackers"

Kicker: **Part 7 · When nobody is attacking**. Title: **"Passive threats: failures, not
attackers."** Blurb: "Power cuts, dead disks, crashed processors — no villain, just entropy.
Two controls keep the business running: fault tolerance and backups."

Two widgets stacked: `FaultTolerance`, then a `BackupSimulator` under its own sub-heading.

**Fault tolerance card** — intro text: "A **fault-tolerant system** survives a failure because
a redundant part takes over *immediately*, with little or no interruption. Redundancy can be
built at five levels — tap each:" Five accordion rows (`FAULT_LEVELS`), verbatim (first item's
icon/title shown with the row's icon and its expandable solution text):

1. **🌐 Network communications** — "Duplicate communication paths so a cut line never
   isolates the system."
2. **🧠 CPU processors** — "A watchdog processor stands ready to take over if the main one
   fails."
3. **💽 Storage (DASDs)** — "Disk mirroring / disk shadowing — every write goes to two disks
   at once."
4. **🔋 Power supply** — "Battery backup (UPS) carries the load through an outage without
   missing a beat."
5. **💸 Individual transactions** — "Rollback processing & database shadowing undo a
   half-finished transaction cleanly."

**Backup simulator** — sub-heading "🗃️ Backup simulator" with intro text: "A full backup ran
Sunday night. Through the week, files change. Switch the strategy and watch what each daily
backup saves — and what it costs you to recover after Friday's disaster. (Watch the **archive
bit** behaviour described in each card.)"

The widget (`BackupSimulator`) lets the student toggle between three strategies (default:
Incremental) and simulates a working week of five files (A–E) against a fixed schedule of
which files are modified each day (`WEEK`):

- Mon: A, B modified
- Tue: C modified
- Wed: A modified
- Thu: D modified
- Fri: B, E modified

Strategy descriptions (`STRATEGY_META`), verbatim:

- **Full** — "Backs up every file. Sets each archive bit to 0." One-liner: "Everything, every
  time."
- **Incremental** — "Backs up only files changed since the last backup (bit = 1), then sets
  bit to 0." One-liner: "Only what changed since last backup."
- **Differential** — "Backs up files changed since the last full backup — and does NOT reset
  the archive bit." One-liner: "Everything changed since the last full."

Simulation logic (`simulate()`): an in-memory archive-bit flag per file. Each day, the file(s)
modified that day get their bit set to true. Then:
- **Full**: every day's backup saves all 5 files, and resets all bits to false.
- **Incremental**: each day's backup saves only files whose bit is currently true (i.e.
  changed since the last backup of any kind), then resets those bits to false.
- **Differential**: each day's backup saves only files whose bit is true (i.e. changed since
  the last *full* backup) but never resets bits, so the saved set grows through the week.

Restore-cost message shown under a "💥 Disaster strikes Friday evening — to fully restore you
need:" heading, verbatim per strategy:
- Full: "Just Friday's full backup. One tape, fast restore — but you stored everything five
  times."
- Incremental: "Sunday's full + every single daily backup (Mon→Fri). Smallest backups, slowest
  restore — lose one tape and the chain breaks."
- Differential: "Sunday's full + only Friday's differential. A middle ground: bigger daily
  backups than incremental, but a simple two-step restore."

The table columns are "Day", "Files modified", "This backup saves" — each cell rendering the
modified/saved files as coloured chip badges (amber for "modified", strategy colour for
"saved"); a saved row equal to all 5 files is annotated "(all)".

### Part 8 · Disaster risk management — "When the whole site is gone"

Kicker: **Part 8 · Disaster risk management** (amber). Title: **"When the whole site is
gone."** Blurb: "Prevention first — but if disaster wins, a recovery plan and an alternate
processing arrangement keep you alive. Weigh the three classic options."

Widget: `DisasterRecovery` — intro line: "A disaster recovery plan answers one question:
**where do we run when our own building is gone?** Pick an alternate processing arrangement
and weigh the trade-off." Three selectable site cards (default selected: Warm site), each
showing a 3-dot "Ongoing cost" meter and a 3-dot "Recovery speed" meter, plus a detail card
below for the selected option. The three sites (`DR_SITES`), verbatim, with their cost/speed
dot counts (out of 3):

1. **🧊 Cold site** — cost 1/3, speed 1/3. "An empty, wired room. Cheapest to keep — but it
   has no equipment running, so recovery is slowest. You haul in hardware and restore from
   backup after the disaster."
2. **🌗 Warm site** — cost 2/3, speed 2/3. "Partially equipped — hardware in place, but data
   not fully live. A balance of standing cost and recovery speed."
3. **🔥 Hot site** — cost 3/3, speed 3/3. "A fully equipped, fully current mirror of
   production. Switch over in minutes — at the highest ongoing cost. For systems where
   downtime is unthinkable."

### Part 9 · The human layer — "No system is infallible — so build the culture"

Kicker: **Part 9 · The human layer** (green). Title: **"No system is infallible — so build the
culture."** Blurb: "Since no security system is perfect, you create an atmosphere where
security is the default. These organisational controls do the quiet heavy lifting."

Static content only (no interactive widget) — a grid of seven checklist items (`CONTROLS`,
each rendered with a green ✓ badge), verbatim and in order:

1. "Separate the accounting and computing functions."
2. "Separate the duties of computer users and systems personnel."
3. "Cancel access privileges the instant an employee is fired."
4. "The board appoints an audit committee, which approves the internal audit director."
5. "Use budgets to control spending on equipment."
6. "Thoroughly test all system security."
7. "Keep a well-documented internal policy against software piracy."

### Final challenge — "Prove it. Five scenarios."

Kicker: **Final challenge** (indigo). Title: **"Prove it. Five scenarios."** Blurb: "Pull it
all together — risk, threats, malware, controls, backups. Answer all five, then submit for
instant feedback."

Widget: `FinalQuiz` — five multiple-choice questions, all must be answered before "Submit
answers" is enabled (button reads "Answer all five to submit" while disabled). After
submission each question shows a ✓/✗ mark plus its "why" explanation, and a score summary (🏆
if 5/5, 👍 if ≥3, 📚 otherwise) with a "↻ Retake" button that clears all answers. Full
question bank (`QUIZ`), verbatim, in order, with the correct option index and its explanation:

1. **Q:** "A clerk enters fake supplier invoices to divert payments to themselves. No code is
   changed. Which active threat is this?"
   - Options: Program alteration / **Input manipulation** ✓ / Sabotage / Data theft
   - Why: "Manipulating input to achieve an incorrect result — the most common method of fraud
     because it needs no technical skill."
2. **Q:** "You want the smallest possible daily backups and accept a slow, multi-tape restore.
   Which strategy?"
   - Options: Full / Differential / **Incremental** ✓ / No backup
   - Why: "Incremental backs up only what changed since the last backup, so daily backups are
     tiny — but a restore needs the full plus every increment in the chain."
3. **Q:** "An attacker is in the building and logged in, but cannot open the payroll file.
   Which control stopped them?"
   - Options: Site-access control / System-access control / **File-access control** ✓ / A
     firewall
   - Why: "File-access controls govern what an already-authenticated user is allowed to touch
     — the innermost ring of the layered defence."
4. **Q:** "Loss costs $400,000 and has a 25% chance per year. What is the annual loss exposure
   (quantitative)?"
   - Options: $25,000 / **$100,000** ✓ / $400,000 / $1,600,000
   - Why: "Loss exposure = cost × likelihood = $400,000 × 0.25 = $100,000."
5. **Q:** "Code planted by an insider detonates the moment their name leaves the payroll
   system. This is a…"
   - Options: Worm / Trojan horse / **Logic bomb** ✓ / Virus
   - Why: "A logic bomb is dormant code triggered by a specific later event — here, the
     disappearance of the payroll record."

### Closing statement

Rendered after the quiz, centred, with a 🛡️ icon:

> "Security isn't a product you buy once. It's a life cycle: name the risks, size them, build
> layered defences, plan for the failure you hope never comes — then do it all again as the
> threats evolve."
>
> "MBI800 · Strategic Information Systems · Master of Business Informatics"

## 3. UI & interaction design

**Page shell** (`SystemsSecurityPage.tsx`): Apple-style white canvas using the same
`APPLE_FONT` stack as sibling lesson pages (`-apple-system, BlinkMacSystemFont, "SF Pro
Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif`). A sticky,
blurred-glass top nav (`bg-white/90 backdrop-blur-xl`) containing only a `BrandLogo` linking
to `/home`. A hero section with three soft blurred colour blobs positioned absolutely behind
the text (indigo top-centre, red bottom-right, green bottom-left, all at low opacity with
`blur-3xl`), a small uppercase eyebrow ("MBI800 · Strategic Information Systems", indigo), a
large headline "Systems " + gradient-text "Security." (gradient: indigo → blue → green,
`linear-gradient(90deg, #4f46e5, #0071e3, #30a46c)`), a subhead ("What can go wrong, how much
it would cost, and how to defend and recover. A hands-on tour of protecting the information
systems a business runs on."), a row of five colour-coded topic pill badges matching the
lesson's five thematic colours (Risk & exposure ⚖️ indigo, Active threats 🦠 red, Layered
defence 🛡️ green, Backups 🗃️ blue, Disaster recovery 🔥 amber), and a bouncing "Scroll to
begin" hint. All hero elements animate in with framer-motion (`opacity`/`y` fades, staggered
delays, custom ease curve `[0.16, 1, 0.3, 1]`). Footer repeats the `BrandLogo` and a "‹ Back to
all lessons" link to `/home`.

**Lesson body** (`SystemsSecurityLesson.tsx`): a single vertical scroll, no slide-deck/tab
paradigm at the top level — each of the ten "Parts" is its own `<Section>` (large
`marginBottom: 96px` between parts) revealed via a custom `useReveal`/`Reveal`
IntersectionObserver hook (fades/slides up 26px → 0, 0.6s ease, one-shot — observer disconnects
after first intersection, so content does not re-hide on scroll-up). Each part opens with a
`SectionHeader`: a small bold uppercase "kicker" label in a part-specific accent colour, a
large (`clamp(26px, 4vw, 38px)`) heading, and an optional grey blurb paragraph capped at
`max-width: 680px`.

Visual language: soft off-white `Card` components (`background: #fafafa`, 1px black-7%-opacity
border, 24px border radius, 28px padding) used throughout for detail panels; a four-colour
palette used consistently as semantic accents — indigo `#4f46e5` (ACCENT — general/security),
red `#e5484d` (DANGER — threats), green `#30a46c` (SAFE — controls/safe), amber `#f59e0b`
(WARN — caution). Buttons/pills use fully-rounded (`999px`) shapes with 0.2–0.3s ease
transitions. A local `@keyframes ssFade` (opacity 0→1, translateY 8px→0) is injected via an
inline `<style>` tag and used for widget-internal fade-ins (e.g. switching between an active
threat tab or a malware scenario).

Interaction patterns per widget (see Section 2 for full content of each):
- **LossesExplorer** — grid of toggle cards, one open at a time, accordion-style
  expand/collapse via `max-height` transition.
- **LifecycleStepper** — tab rail + Back/Next wraparound stepper inside one `Card`.
- **RiskCalculator** — two live-updating range sliders driving a computed money value and a
  colour-coded priority band; a static ranked list alongside for the qualitative approach.
- **ActiveThreatExplorer** — pill-button tab selector opening a detail card with a percentage
  frequency bar.
- **MalwareLab** — reference-card strip + sequential four-question matching quiz with
  immediate right/wrong feedback, running score, and a completion screen with retry.
- **LayeredDefence** — clickable concentric-circle diagram (radio-button-like selection over
  three nested circles) paired with a text explanation card.
- **FaultTolerance** — five-row accordion list (one open at a time) inside a `Card`.
- **BackupSimulator** — three-way segmented strategy toggle driving a recomputed simulation
  table (chips per file, colour-coded) and a restore-cost callout.
- **DisasterRecovery** — three selectable cards with dot-based cost/speed meters, plus a detail
  card for the current selection.
- **CONTROLS list** — static, no interactivity.
- **FinalQuiz** — five independent multiple-choice question blocks, submit-when-all-answered
  gate, post-submit correct/incorrect colour coding + explanations, retake control.

Layout is responsive via CSS Grid `repeat(auto-fit, minmax(...px, 1fr))` throughout (card
grids collapse to single column on narrow viewports); the backup-simulator table scrolls
horizontally (`overflowX: auto`) below its `minWidth: 460px`.

## 4. Component & state architecture

`SystemsSecurityPage.tsx` is a plain functional component with no state of its own; it only
composes layout and renders `<SystemsSecurityLesson />` inside
`<section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">`.

`SystemsSecurityLesson.tsx` is entirely client-local `useState`, one independent state slice
per widget — there is no shared/lifted state across widgets, no Context, no props passed into
the root component (it takes none), and no Firestore or other backend calls anywhere in the
file:

- `useReveal(threshold=0.12)` / `<Reveal>` — a reusable hook + wrapper providing a `ref` and a
  `visible` boolean via `IntersectionObserver`; disconnects after first trigger (one-shot
  reveal, never re-hides).
- `LossesExplorer` — `open: number` (index of the currently expanded loss card, default `0`,
  `-1` = none open).
- `LifecycleStepper` — `step: number` (0–3, wraps via modulo on Back/Next).
- `RiskCalculator` — `cost: number` (default 250000), `likelihood: number` (default 15);
  derived `exposure = cost * likelihood/100` and a derived `band` (no separate state, computed
  each render).
- `ActiveThreatExplorer` — `open: string` (attack id, default `'input'`).
- `MalwareLab` — `idx: number` (current scenario, 0–3), `picked: string | null` (chosen
  malware id for current scenario), `score: number`, `done: boolean`. `choose()` locks further
  picks once one is made for that scenario; `next()` advances or sets `done`; `reset()` zeros
  everything.
- `LayeredDefence` — `active: string` (layer id, default `'site'`).
- `FaultTolerance` — `open: number` (accordion index, default `0`, `-1` = none open).
- `BackupSimulator` — `strategy: 'full' | 'incremental' | 'differential'` (default
  `'incremental'`); `simulate(strategy)` is a pure function (not memoized, recomputed on every
  render) that walks the fixed `WEEK`/`FILES` data with an in-function archive-bit map to
  produce `{ rows, restore }`.
- `DisasterRecovery` — `sel: string` (site id, default `'warm'`).
- `FinalQuiz` — `answers: (number | null)[]` (length 5, one slot per question, `null` =
  unanswered), `submitted: boolean`. `score` is derived by reducing `answers` against
  `QUIZ[i].answer`. `pick()` is a no-op once `submitted` is true. Retake resets both `answers`
  and `submitted`.

No gating/unlock logic, no scoring persisted anywhere, no badge-award triggers — every quiz
score and simulator state resets on page reload and has no effect outside the component tree.
All content arrays (`LOSSES`, `LIFECYCLE`, `ATTACKS`, `THREAT_GROUPS`, `MALWARE`,
`MALWARE_SCENARIOS`, `FAULT_LEVELS`, `WEEK`/`FILES`, `STRATEGY_META`, `DR_SITES`, `CONTROLS`,
`QUIZ`) are module-level constants, not fetched from any API.

## 5. Rebuild notes

- **No gated equivalent exists.** Unlike Five Stories and Platform Strategy (both listed in
  the README's MBI800 inventory as having gated copies), Systems Security is confirmed
  non-gated-only: it does not appear in `CourseResources.tsx`'s MBI800 lesson list (`
  'five-stories' | 'sisp-lab' | 'platform-strategy'`), and no other file imports
  `SystemsSecurityLesson`.
- **Duplicate route registration.** `/systems-security` is registered in two separate
  `<Routes>` trees in `src/App.tsx`: the full `AppRoutes()` tree (line 109) and the reduced
  `ShutdownRoutes()` tree (line 193, rendered instead of `AppRoutes()` when the
  `PLATFORM_ACTIVE` flag in `src/config/platform.ts` is false). This is a deliberate pattern
  shared by all of the platform's public standalone lessons, not specific to this file — it
  keeps public lessons reachable even while the rest of the platform is in shutdown mode.
- **Stale internal cross-reference.** The "Loss of facilities" card in Part 1 says "This is
  the loss that disaster recovery planning (**Part 5**) is built to survive," but disaster
  recovery is actually Part 8 in the rendered lesson (Part 5 is the malware lab). This is
  verbatim source text, not a transcription error — flagged here as a content quirk a
  rebuilder may want to fix (change "Part 5" to "Part 8"), but left uncorrected in Section 2's
  transcription per the instruction to transcribe real text exactly.
  Source: `src/components/slides/SystemsSecurityLesson.tsx` line 127.
  - Similarly, Part 4's blurb mentions attack types are "explored below," and the Sabotage
    attack-card description in Part 4 says logic bombs/Trojans/worms/viruses are "explored
    below" — this one is accurate, since Part 5 (Malware lab) immediately follows.
- **No external links.** The lesson has zero outbound links/URLs to revalidate — it is 100%
  self-contained content and inline widgets.
- **No image/SVG/video assets.** All visuals are emoji glyphs, CSS gradients/blurs, and
  inline-styled divs (the concentric-circle diagram in `LayeredDefence`, the priority bands in
  `RiskCalculator`, the dot meters in `DisasterRecovery`) — nothing to re-source from a media
  directory.
- **No dead/legacy code nearby** was found in either source file; both are single-purpose and
  fully used by the one route.
- **`FILES`/`WEEK` data in `BackupSimulator` is a fixed illustrative dataset** (5 files A–E,
  one specific week of modifications), not derived from any real system — a rebuild should
  preserve it exactly since the "This backup saves" and restore-cost text is written to match
  those exact numbers (e.g. Q2 of the final quiz assumes the reader has seen the incremental
  vs. full trade-off from this exact simulator).
- Component and page are two physically separate files by design (same split pattern as other
  public MBI800 lessons like Five Stories/Platform Strategy): the page owns the marketing hero
  and nav/footer chrome, the component owns 100% of the teaching content, so the component
  could in principle be re-embedded elsewhere without dragging the hero along.
