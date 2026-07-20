# Project Cost Management — MBI804

- **Subject:** MBI804 — IT Project Management. Explicitly tagged in-component: the file's own
  header comment reads `MBI804 · Project Cost Management (Not a LMS)`, and the on-page hero
  text reads `MBI804 · Project Management · Dr. Yasas Sri Wickramasinghe`.
- **Gating:** Non-gated (public) — no login required, nothing collected.
- **Route(s):** `/cost-management`
- **Source files:**
  - `src/pages/CostManagementPage.tsx` (primary/authoritative — ~1232 lines, the live SPA page)
  - `src/components/ui/BrandMark.tsx` (logo used in hero/footer)
  - `public/lesson-plans/mbi804-cost-management.html` (a separate, self-contained static
    HTML/Chart.js document — see "Rebuild notes" for its relationship to the React page)
- **Depends on:** `framer-motion` (`motion`, `AnimatePresence`, `useScroll`, `useTransform`)
  for scroll-linked hero animation and reveal-on-scroll sections; `recharts`
  (`LineChart`, `BarChart`, `ComposedChart`, `Area`, etc.) for the learning-curve chart, the
  PERT bar chart, and the budget S-curve. No Firestore reads/writes, no auth — everything is
  local React state. No external links.

## 1. Purpose & learning objectives

A single-page, scroll-driven interactive lesson covering PMI/PMBOK-aligned Project Cost
Management, built for MBI804 (IT Project Management) by Dr. Yasas Sri Wickramasinghe. Per its
own in-code comment, it covers "Seven scroll-based sections covering PMI Cost Management
(CP1→CP3 + MC1 preview) anchored in the running 'SecurePay NZ' scenario. All interactive
simulations run in the browser — no login, no data collected."

Learning objectives, as expressed through the lesson's structure:
- Understand the four PMI cost-management processes (Plan Cost Management, Estimate Costs,
  Determine Budget, Control Costs) and what each produces.
- Correctly classify costs as tangible/intangible, direct/indirect, and recognise sunk costs
  (with an explicit warning about the sunk-cost fallacy).
- Build a Cost Management Plan (CP1) that sets accuracy, units, thresholds, and reporting rules.
- Choose the right estimate type (ROM / Budgetary / Definitive) for a project's maturity, and
  apply parametric, bottom-up (WBS), and PERT three-point estimating techniques (CP2).
- Recognise common estimating pitfalls (rushed estimates, inexperience, optimism bias,
  premature demand for accuracy) and use contingency/management reserves correctly.
- Build a time-phased Cost Performance Baseline (an S-curve) from work-package estimates plus
  reserves (CP3).
- Preview the next lecture's topic: Earned Value Management (EV, CPI, SPI) for Control Costs
  (MC1).

The whole lesson is threaded through one running case: **SecurePay NZ** — the learner plays PM
at a NZ fintech startup with NZ$650,000 and 6 months to integrate a payment gateway API for a
retail client, with a team of 4 developers, 1 QA, 1 UX, 1 PM.

## 2. Full content

The page is a set of `<section>` blocks stacked vertically, navigated by scrolling (plus two
"jump to" buttons in the hero). Below is the actual content of every section, component by
component, in source order.

### Hero
- Eyebrow: "MBI804 · Project Management · Dr. Yasas Sri Wickramasinghe"
- Headline: "Let's make sense of **Project Cost Management.**" (the second line is a gradient
  text `#0071e3 → #30d158 → #0071e3`)
- Subhead: "Plan it, estimate it, baseline it. Seven interactive sections built around the
  **SecurePay NZ** scenario — a real IT project context from start to baseline. No sign-in,
  nothing collected."
- Buttons: "Start the lesson" (scrolls to `#intro`) and "Jump to PERT calculator ›" (scrolls to
  `#pert`).
- Footer prompt: "Scroll to explore".

### Section 1 — Intro ("Why do IT projects blow their budgets?")
- Eyebrow "The problem"; sub: "75% of IT projects exceed their budget. Understanding the four
  PMI cost management processes is how you join the other 25%."
- **HookCounter**: an animated counter that ticks from 0 to 75 in steps of 2 every 28 ms, shown
  as "`{count}%`" in huge text, captioned "of IT projects exceed their original budget" and
  "Cost overruns are the rule, not the exception. This lesson shows you how to be the exception."
- **Running scenario card** ("SecurePay NZ"): "You're PM at a NZ fintech startup. You have
  NZ$650,000 and 6 months to integrate a payment gateway API for a retail client. Team: 4
  developers, 1 QA, 1 UX, 1 PM. This scenario threads through every section of this lesson."
- **ProcessFlow** — 4 clickable cards, each revealing its "Output" on click:
  - **CP1 · Plan Cost Management** ("Set the rules") → Output: "Cost Management Plan — defines
    how costs will be estimated, budgeted, managed, and controlled."
  - **CP2 · Estimate Costs** ("Price the work") → Output: "Activity Cost Estimates — quantified
    costs per work item, plus the basis of estimates."
  - **CP3 · Determine Budget** ("Build the baseline") → Output: "Cost Performance Baseline — the
    approved time-phased S-curve used to measure performance."
  - **MC1 · Control Costs** ("Track & correct") → Output: "Work Performance Information & cost
    forecasts via EVM. Covered in the next lecture."
- **Warm-up check** — a 3-question `MiniQuiz` (instant feedback per answer, no pass/fail):
  1. "Which process produces the Cost Performance Baseline?" Options: CP1 — Plan Cost
     Management / CP2 — Estimate Costs / **CP3 — Determine Budget** (correct) / MC1 — Control
     Costs. Feedback: "Determining the Budget (CP3) aggregates estimates and reserves into the
     time-phased Cost Performance Baseline."
  2. "What type of cost is office rent for a project team?" Options: Direct cost / **Indirect
     cost** (correct) / Sunk cost / Intangible cost. Feedback: "Rent is shared overhead not
     traceable to a single deliverable — an indirect (overhead) cost."
  3. "A sunk cost is…" Options: A cost that recurs monthly / **Money already spent that cannot
     be recovered** (correct) / A reserve held by senior management / A cost paid only on
     project success. Feedback: "Sunk costs are already incurred and unrecoverable — irrelevant
     to go/no-go decisions."
  - On completion: "Score: {score} / {questions.length}" with "🎉 Perfect start!" or "Keep
    going — you'll lock these in by the end."

### Section 2 — Foundations ("Know your costs")
- Eyebrow "Section 2 · Foundations"; sub: "Before you can estimate anything, you need to
  classify what you're counting. Click each card to flip it."
- **Flashcards** (5, flip-on-click):
  1. 💵 **Tangible Costs** — "Measurable in money" / "Costs that can be directly expressed in
     dollars." / Example: "Software licenses purchased for NZ$12,000."
  2. 🤝 **Intangible Costs** — "Hard to quantify" / "Benefits or costs that resist precise
     dollar measurement." / Example: "Improved customer trust after launching a secure login
     system."
  3. 🎯 **Direct Costs** — "Traceable to project" / "Costs charged directly and solely to this
     project." / Example: "Developer salaries charged directly to the project."
  4. 🏢 **Indirect Costs** — "Shared overhead" / "Shared costs spread across multiple
     projects." / Example: "Office overhead shared across 4 concurrent projects."
  5. 🪙 **Sunk Cost** — "Already spent" / "Money already spent and unrecoverable — must be
     ignored in future decisions." / Example: "NZ$80,000 spent on a failed architecture —
     irrelevant to the go/no-go decision."
- **The Sunk Cost Fallacy callout** (red left border): "A NZ insurer spent NZ$2.3M on a custom
  ERP that never worked. When asked to cut losses, leadership said: 'We've already spent so
  much — we can't stop now.' They spent another NZ$1.1M before finally abandoning it. The money
  already spent was sunk — irrelevant to whether the next dollar was worth spending. Good PMs
  ignore sunk costs in go/no-go decisions."
- **Drag-and-drop cost categoriser**: 6 draggable chips must be sorted into 5 buckets (Direct,
  Indirect, Tangible, Intangible, Sunk):
  - "Cloud hosting fees" → Direct
  - "Team morale boost" → Intangible
  - "Project manager salary" → Direct
  - "Shared HR system cost" → Indirect
  - "Previously paid consultant fee" → Sunk
  - "New laptop purchase" → Tangible
  - On "Check answers": per-item ✓/✗ feedback and a summary count; "Reset" reshuffles the tray.
- **Learning Curve Theory card**: "The more times a team repeats a task, the cheaper each
  repetition becomes — important when estimating repetitive IT work like onboarding
  integrations." Plotted as a decay curve (`hours/unit = 100 × unit^-0.32`) over 10 units.
- **Reserves card**: "Contingency reserves cover known unknowns — identified risks. The PM
  controls these; they sit inside the cost baseline. Management reserves cover unknown
  unknowns. The sponsor controls these; they sit outside the baseline." Visualised as a bar:
  Base Estimate (70%) / Cont. (20%) / Mgmt (10%).

### Section 3 — CP1: Plan Cost Management ("Before you spend a dollar")
- Eyebrow "Section 3 · CP1 — Plan Cost Management"; sub: "The Cost Management Plan sets the
  rules for every number that follows. Skip it and your estimates can't be compared."
- **Process overview strip**: Inputs ("Project charter, plan, EEFs & OPAs") · Tools ("Expert
  judgment · Analytical techniques · Meetings") · Output ("Cost Management Plan", highlighted).
- **Cost Management Plan builder** (`CostPlanForm`) — editable fields, defaulting to:
  - Level of accuracy: "±5%" (options: ±1% (definitive) / ±5% / ±10% (early planning))
  - Units of measure: "NZD" (options NZD / AUD / USD)
  - Control threshold: "±10% variance triggers review" (free text)
  - Performance measurement rules: "Earned Value Management (EVM)" (options: EVM / Simple %
    Complete / Milestone-based)
  - Reporting format (radio): "Weekly status report" / **"Fortnightly dashboard"** (default) /
    "Monthly summary"
  - Reporting cadence: "Every second Friday by 4pm" (free text)
  - "Preview plan document" renders a formatted document card headed "Cost Management Plan ·
    SecurePay NZ · CONFIDENTIAL" / "Payment Gateway Integration Project", listing all six
    field/value pairs.
- **Reflection prompt (not graded)**: "What would happen if you skipped this planning step and
  went straight to estimating costs?" — free-text `<textarea>`, followed by a model answer:
  "One perspective: Without a plan, every estimator uses different units, accuracy levels, and
  thresholds — so estimates can't be compared and there's no agreed trigger for escalation."

### Section 4 — CP2: Estimate Costs ("Show me the money")
- Eyebrow "Section 4 · CP2 — Estimate Costs"; sub: "ROM to definitive. Top-down to bottom-up.
  PERT for uncertainty. Three tools, one goal: a number you can defend."
- **Estimate-type toggle** (`EstimateSlider`), 3 tabs:
  1. **ROM** — Rough Order of Magnitude — Accuracy −50% to +100% — When: "At project
     initiation, before any detail exists." — Why: "To decide whether the project is worth
     pursuing at all." — SecurePay NZ example: "The CTO says 'this new HR system will cost
     roughly $500K–$1M.'"
  2. **Budgetary** — Budgetary Estimate — Accuracy −10% to +25% — When: "During planning,
     roughly a year out." — Why: "To allocate funds and set the working budget." — Example:
     "One year out, the PM estimates $720K for budget allocation."
  3. **Definitive** — Definitive Estimate — Accuracy −5% to +10% — When: "Late in planning,
     months before delivery." — Why: "To finalise the baseline with high confidence." —
     Example: "Three months before delivery: total cost estimated at $695,000 ± 5%."
- **Top-Down: Analogous & Parametric card** — "Analogous: uses cost of a similar past project,
  scaled. Fast, cheap, least accurate. Parametric: statistical relationship — e.g. cost per
  function point." Includes a **live parametric estimator**: a slider for function points
  (50–500, default 200) × an editable "cost per function point" input (default NZ$120) →
  displays "Estimated total cost" = function points × cost/point.
- **Bottom-Up: WBS-Based card** — "Decompose into work packages, estimate each leaf, roll up.
  Most accurate — and most effort." Editable WBS estimator with 3 default leaf items:
  "1.1 API Integration" (NZ$35,000), "1.2 Security Layer" (NZ$28,000), "1.3 Testing & UAT"
  (NZ$22,000), summing live to a "SecurePay NZ — Total" header.
- **PERT Calculator — Three-Point Estimating**: formula shown as `E = (O + 4M + P) / 6 · SD =
  (P − O) / 6`. Editable table, 3 SecurePay NZ activities (Optimistic/Most-Likely/Pessimistic
  in NZ$, defaults):
  - API Integration: O 8,000 · M 12,000 · P 20,000 (E = 12,667, SD ≈ 2,000)
  - Security Testing: O 4,000 · M 6,000 · P 11,000 (E ≈ 6,500, SD ≈ 1,167)
  - UAT & Training: O 3,000 · M 4,000 · P 8,000 (E ≈ 4,500, SD ≈ 833)
  - "Total Expected Cost" row sums all E values live; a horizontal bar chart plots
    Optimistic/Expected/Pessimistic per activity.
  - Callout: "When to use PERT: Use it when activities are novel or have high variability —
    exactly the case for new API integrations and security work."
- The `#pert` anchor sits just above this calculator (hero's "Jump to PERT calculator" link
  target).

### Section 5 — Pitfalls ("Why estimates go wrong")
- Eyebrow "Section 5 · Pitfalls"; sub: "Four patterns that explain most project cost overruns —
  each with a war story and a concrete fix."
- **Progressive reveal of 4 problems** (`ProblemsReveal`, click "Reveal problems" / "Reveal
  next (n/4)"):
  1. **Estimates done too quickly** — War story: "A PM promised a fixed price after a
     20-minute scoping call. The build took triple the time." — Fix: "Allocate real time to
     estimating; treat it as a deliverable, not an afterthought."
  2. **People lack estimating experience** — War story: "A junior dev estimated a payment
     reconciliation module at 2 days — it took 3 weeks." — Fix: "Pair inexperienced estimators
     with veterans; maintain a historical actuals database."
  3. **Bias toward underestimation** — War story: "Every task 'should only take a day' —
     optimism bias compounds across hundreds of tasks." — Fix: "Apply reference-class
     forecasting and add evidence-based contingency reserves."
  4. **Management wants accuracy too early** — War story: "Leadership demanded ±5% accuracy at
     initiation, before requirements even existed." — Fix: "Educate sponsors on estimate
     maturity (ROM → Budgetary → Definitive); commit ranges early, points later."
- **Bias Meter**: "A PM estimates a task at NZ$5,000. Slide to adjust for optimism bias and see
  the realistic number." Slider 0–40% bias → shows Naive estimate (NZ$5,000, fixed), Realistic
  estimate (= 5,000 × (1 + bias%)), Contingency needed (= realistic − 5,000).
- **Contingency Reserve Explainer**: "SecurePay NZ base: NZ$650,000. Adjust contingency % to
  see the budget ceiling move." Slider 5–25% (default 10%) → stacked bar (Base / Cont / Mgmt,
  management reserve fixed at 5% of base+contingency) and 3 stat cards: Base estimate
  (NZ$650,000, fixed), Contingency (computed), Total ceiling (computed).
- **PM Network insight callout** (blue, full-width): "'Treat estimates as a living process, not
  a one-time event.'" — bullets: "Manage estimates through the whole lifecycle — refine as you
  learn"; "Use agile estimating (story points, relative sizing) for evolving scope"; "Match
  skill sets — let the people who'll do the work estimate it".

### Section 6 — CP3: Determine Budget ("Building the cost baseline")
- Eyebrow "Section 6 · CP3 — Determine Budget"; sub: "Allocate estimates to WBS work packages
  over time → the Cost Performance Baseline (S-curve). This is what you'll measure performance
  against."
- **Budget Builder** — editable WBS work-package table, defaults:
  Discovery NZ$40,000 · Design NZ$60,000 · Development NZ$280,000 · Testing NZ$120,000 ·
  Deployment NZ$80,000 (sum NZ$580,000). Plus editable Contingency reserve % (default 10%) and
  Management reserve % (default 5%). Live stacked bar (Estimates/Contingency/Mgmt) and 3 stat
  cards: "Sum of estimates", "Cost baseline" (= sum + contingency), "Total ceiling" (= baseline
  + management reserve).
- **Time-phased budget & S-curve chart**: fixed monthly spend profile `[40, 60, 140, 140, 120,
  80]` (NZ$000s) over 6 months (M1–M6), rendered as a bar chart (monthly spend) overlaid with an
  area/line (cumulative spend = the S-curve).
- **Cost Baseline vs Total Budget explainer cards**: "**Cost Baseline** = Estimates +
  Contingency reserve. The PM controls this and measures all performance against it." /
  "**Total Budget** = Baseline + Management reserve. The sponsor controls the management
  reserve — the PM must request access."

### Section 7 — Summary ("Putting it all together")
- Eyebrow "Section 7 · Summary"; sub: "Five questions, a drag-to-order, and your key
  takeaways. How much of the lesson stuck?"
- **Process recap strip**: the same 4 process cards from Section 1 (CP1–CP3 highlighted solid,
  MC1 shown dashed/greyed with "Next lecture →").
- **🏆 SecurePay NZ — Final Challenge** (`FinalChallenge`):
  - Q1–Q4, a `MiniQuiz` reusing the same component:
    1. "The CTO asks for a cost estimate 18 months before project completion. Which estimate
       type is most appropriate?" Options: **ROM** (correct) / Budgetary / Definitive.
       Feedback: "18 months out with little detail → Rough Order of Magnitude (−50% to
       +100%)."
    2. "O=$8K, M=$12K, P=$20K for the API task. What is the PERT expected cost?" Options:
       NZ$12,000 / **NZ$12,667** (correct) / NZ$13,333 / NZ$14,000. Feedback: "E = (8,000 +
       4×12,000 + 20,000) / 6 = 76,000 / 6 = NZ$12,667."
    3. "The project spent NZ$120K on a vendor who delivered nothing. Should this factor into
       the go/no-go decision?" Options: Yes — recover it by continuing / **No — it is a sunk
       cost** (correct) / Only if over 10% of budget / Yes — add to the baseline. Feedback:
       "It is a sunk cost — already spent and unrecoverable, so it must not influence the
       forward-looking decision."
    4. "Which reserve type is controlled by the project manager?" Options: **Contingency**
       (correct) / Management / Both / Neither. Feedback: "Contingency reserves (known
       unknowns) sit inside the cost baseline and are PM-controlled."
  - **Q5 — drag-to-order**: "Drag the 3 estimate types into order — least to most accurate."
    Three drop targets labelled "1 · Least accurate" / "2 · Middle" / "3 · Most accurate";
    correct order is ROM → Budgetary → Definitive.
  - "Submit final challenge" → "Score: {total} / 5" with tiered feedback: ≥4 "✅ Excellent
    work!"; ≥3 "✅ Solid — review any red answers above."; else "— Try reviewing sections 2 and
    4."
- **Key Takeaways card** (dark): "Plan first: the Cost Management Plan makes every later number
  comparable"; "Know your cost types — and never let sunk costs drive future decisions"; "Match
  the estimate type to the lifecycle stage (ROM → Budgetary → Definitive)"; "Use PERT and
  reserves to handle uncertainty honestly, not optimistically"; "The cost baseline (with
  contingency) is the S-curve you manage against".
- **Next lecture preview**: "MC1: Controlling Costs — Earned Value Management" with three
  concept cards: **EV** — "Earned Value — what you've actually accomplished, in $"; **CPI** —
  "Cost Performance Index — over or under budget?"; **SPI** — "Schedule Performance Index —
  ahead or behind?"

### Footer
"A Project Cost Management lesson · MBI804 · put together by **Dr. Yasas Sri Wickramasinghe**."
/ "Everything here runs in your own browser. No personal data is collected or stored."

## 3. UI & interaction design

- Visual language matches the platform's "Apple-style" public-lesson design system: font stack
  `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica
  Neue", system-ui, sans-serif`; ink `#1d1d1f`, muted `#6e6e73`, accent blue `#0071e3`, plus
  green `#30d158`, red `#ff375f`, amber `#ff9f0a` as semantic colours (correct/incorrect/warn).
  Rounded-28px "Card" components, pill buttons, soft shadows.
- **Navigation model**: a single continuously scrolling page (not a slide deck or tabs).
  Sections have `id`s (`intro`, `pert`) that the hero's CTA buttons scroll to via
  `scrollIntoView({ behavior: 'smooth' })`. Alternating white/`#f5f5f7` section backgrounds mark
  section boundaries.
- **Animation**: `framer-motion` throughout.
  - Hero: scroll-linked `useScroll`/`useTransform` shrinks (scale 1→0.9), fades, and
    translates the hero content down as the user scrolls past it (a parallax "zoom out and
    fade" effect).
  - `Reveal` wrapper: every major block fades/slides up into view on scroll
    (`whileInView`, `viewport={{ once: true, margin: '-80px' }}`, custom ease
    `[0.16,1,0.3,1]`), with staggered delays within a section.
  - Flashcards flip via a CSS 3D transform (`rotateY(180deg)`, `preserve-3d`,
    `backface-visibility: hidden`) on click/tap/Enter/Space.
  - Quiz answers, drag-drop feedback, and chart values animate in with `motion.div`
    opacity/y transitions.
- **Interaction patterns used throughout**: click-to-reveal (process outputs, problems list),
  native HTML5 drag-and-drop (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) for the cost
  categoriser and the final-challenge ordering exercise, sliders (`<input type="range">`) for
  bias % and contingency %, live-editable tables/forms feeding straight into `recharts`
  visualisations (parametric estimator, WBS estimator, PERT calculator, budget builder).
- Responsive: 2–5 column grids collapse to 1–2 columns on small screens via Tailwind
  `sm:`/`lg:` breakpoints; text sizes step down at the `sm` breakpoint for headings.

## 4. Component & state architecture

Everything is client-side React state — **no Firestore, no auth, no persistence**. Refreshing
the page resets all progress.

- **Top-level**: `CostManagementPage` (default export) owns only hero scroll-animation refs
  (`useScroll`/`useTransform`) and the `scrollTo` callback; each section below it is a
  self-contained function component with its own local `useState`.
- **Reusable primitives**: `Reveal` (scroll-in-view wrapper), `SectionHead` (eyebrow/title/sub),
  `Pill` (coloured label chip), `Card` (rounded white panel) — all defined at the top of the
  file and reused across every section.
- **Per-exercise state**, one `useState` set per component, no cross-component sharing:
  - `HookCounter` — `count` (0→75 timer loop via `setTimeout`).
  - `ProcessFlow` — `sel: number | null` (which process card is expanded).
  - `MiniQuiz` (shared by the warm-up quiz and `FinalChallenge`) — `answers: Record<number,
    number>`; computes `score`/`done` derived from `questions` prop vs `answers`. Reused with
    two different question arrays (`WARMUP_Qs`, `FINAL_QS`).
  - `FlashCard` — `flipped: boolean` per card instance.
  - `DragDropExercise` — `buckets: Record<string,string[]>`, `tray: string[]`, `feedback:
    Record<string,boolean> | null`, `dragging: string | null`.
  - `CostPlanForm` — six independent field states (`accuracy`, `units`, `threshold`, `rules`,
    `format`, `cadence`) plus `shown` (preview toggle).
  - `EstimateSlider` — `idx: number` (which of the 3 estimate types is active).
  - `ParametricEstimator` — `fp` (function points), `cpp` (cost per point); `total` derived.
  - `WBSEstimator` — `costs: number[]` (3 leaf costs); `total` derived.
  - `PERTCalc` — `rows: {name,o,m,p}[]`; `e()`/`sd()` derived per row, `totalE` summed.
  - `ProblemsReveal` — `shown: number` (how many of the 4 problems are visible).
  - `BiasMeter` — `bias: number` (0–40 slider).
  - `ContingencyExplainer` — `pct: number` (5–25 slider).
  - `BudgetBuilder` — `pkgs: {name,cost}[]`, `contPct`, `mgmtPct`; baseline/ceiling/S-curve data
    all derived.
  - `FinalChallenge` — `answers` (delegated to nested `MiniQuiz`), `orderBuckets: string[]`
    (drag-to-order state), `submitted: boolean`, `draggingO: string | null`; computes
    `mcqScore + orderScore` out of 5 on submit.
- **No scoring is persisted anywhere** — the final challenge score, warm-up score, and every
  interactive exercise's state live only in memory and vanish on navigation/refresh. There is no
  badge, no gating, no Firestore document for this lesson.

## 5. Rebuild notes

- **Relationship to `public/lesson-plans/mbi804-cost-management.html`**: this is a second,
  fully independent implementation of (functionally) the same lesson — same title ("MBI804 —
  Project Cost Management"), same 7-section structure (confirmed by its own section headers:
  "Section 1 · Introduction… Why Do IT Projects Blow Their Budgets?" through "Section 7 ·
  Summary… Putting It All Together"), same SecurePay NZ scenario, same PMI CP1/CP2/CP3
  framing. However it is a **different codebase entirely**: plain HTML/CSS/vanilla JS plus
  Chart.js (loaded from a jsdelivr CDN `<script>` tag) rather than React/Tailwind/Recharts, with
  its own distinct visual design system (navy/teal/amber palette via CSS custom properties
  `--navy`, `--teal`, `--amber`, sticky top progress-step navigation bar) rather than the
  Apple-style system used by `CostManagementPage.tsx`. It is **not currently linked from
  anywhere in the live SPA or the homepage** (only reachable by direct URL under
  `/lesson-plans/`) — it reads as a lecturer-facing static "lesson plan" artifact (a printable/
  presentable teaching outline) that was built in parallel with, or possibly as an earlier
  prototype of, the interactive React page, rather than a duplicate the platform actively
  serves to students. Since `CostManagementPage.tsx` is the one live at `/cost-management` and
  linked from the homepage, it is authoritative for content; the static HTML twin was not
  transcribed section-by-section here and should be read directly
  (`public/lesson-plans/mbi804-cost-management.html`, ~1501 lines) if a rebuild ever needs to
  reconcile the two or decide whether to keep, merge, or drop the static version.
- **No score persistence anywhere** — unlike gated MBI804/MBI802 quizzes, nothing here writes to
  Firestore. A rebuild should preserve this (it's explicitly marketed as "No sign-in, nothing
  collected").
- **Known quirks / non-bugs**: the drag-and-drop implementations use native HTML5 DnD
  (`draggable`), which is desktop-mouse-oriented and has no built-in touch/mobile fallback —
  worth flagging if a rebuild wants better mobile support (tap-to-select/tap-to-place would be
  more robust than drag).
- **Monthly S-curve spend profile** in `BudgetBuilder` (`[40, 60, 140, 140, 120, 80]`) is a
  hardcoded illustrative shape, not derived from the actual work-package edits above it — moving
  the sliders/costs updates the totals and percentages but not the S-curve's shape, only its
  cumulative endpoint implicitly reads from the fixed monthly array. A faithful rebuild should
  preserve or intentionally fix this (currently the S-curve is illustrative, not
  live-recalculated from the table).
- **Assets**: only `BrandMark` (a small SVG/logo React component) — no images, videos, or other
  static assets referenced.
- **No external links** anywhere on this page (unlike the Jira/Agile-certs lessons) — it is
  fully self-contained interactive content.
