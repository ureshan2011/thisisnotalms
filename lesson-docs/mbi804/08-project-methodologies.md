# Waterfall, Spiral, PRINCE2 and Agile — and Scrum up close — MBI804

- **Subject:** MBI804 — IT Project Management. Explicit — the page header carries `courseCode="MBI804"`, the course registry lists it under `MBI804.lessons` with id `pm-methodologies`, and the descriptor content line it covers is "Agile, Waterfall and PRINCE2 project management".
- **Gating:** Non-gated (public). No class code, no login. The route is in `EXCLUDED_PREFIXES` in `LessonPasswordGate.tsx` and is registered in both `AppRoutes` and `ShutdownRoutes` in `src/App.tsx`, so it stays reachable while the platform runs in shutdown-notice mode.
- **Route(s):** `/project-methodologies`
- **Source files:**
  - `src/pages/ProjectMethodologiesPage.tsx` — the Blend `CoursePage` frame, the nav list, the hero, and a local `HeroGlyphs()` SVG of the four lifecycle shapes at glyph size
  - `src/components/public/ProjectMethodologiesLesson.tsx` — the whole lesson body: objectives, seven teaching sections, a local `StoryAnatomy()` widget, a six-question knowledge check, the recap and the sign-off
  - `src/components/public/methods/LifecycleGallery.tsx` — 2.1, the four-way method switcher
  - `src/components/public/methods/CostOfChangeCurve.tsx` — 2.2, the cost of the same change by phase
  - `src/components/public/methods/SpiralModel.tsx` — 2.3, twelve-step walk through three spiral cycles
  - `src/components/public/methods/Prince2Explorer.tsx` — 2.4, the 7 principles / 7 themes / 7 processes explorer with a process map
  - `src/components/public/methods/ManifestoValues.tsx` — 2.5, the four Manifesto values as tilting beams
  - `src/components/public/methods/AgileFamily.tsx` — 2.5, the seven-branch Agile family fan
  - `src/components/public/methods/ScrumCycle.tsx` — 2.6, the clickable Scrum framework diagram
  - `src/components/public/methods/ScrumRoleSort.tsx` — 2.6.1, twelve "whose job is this?" situations
  - `src/components/public/methods/SprintTimeline.tsx` — 2.6.3, Sprint length against timeboxes and feedback frequency
  - `src/components/public/methods/ScrumBoard.tsx` — 2.6.5, the Sprint board with a live burndown
  - `src/content/courses.ts` — registry entry (`id: 'pm-methodologies'`), which is what generates the `/mbi804` home page card and the browser title via `src/lib/pageMeta.ts`
- **Depends on:** Blend (`src/components/blend/` and `src/styles/blend.css`) for `CoursePage`, `LessonHeader`, `SectionHead`, `Reveal`, `Quiz` and `Recap`; `framer-motion` for the hero entrance; `lucide-react` for the one `ExternalLink` icon in the sign-off. No Firestore reads or writes, no external assets, no images — every drawing is inline SVG. Links out to `/intro-to-project-management`, `/cost-management` and `/jira-certifications`, plus the lecturer's LinkedIn profile.

## 1. Purpose & learning objectives

Lesson 1 (`/intro-to-project-management`) ends on a three-way methodology chooser and asserts that methodology follows from a project's attributes. This lesson is the detail behind that assertion, and the page the 60% "project methodology selection" case study leans on. It is deliberately more picture than paragraph: ten interactive widgets carry the teaching and the prose between them does joins.

Stated objectives, as they appear in `LessonHeader`:

1. Draw the shape of Waterfall, Spiral, PRINCE2 and Agile, and say what each one optimises for
2. Explain why the cost of a change rises with the phase it arrives in, and what each method does about it
3. Place Scrum, XP, Kanban, Crystal, Lean, FDD and DSDM inside the Agile family without conflating them
4. Name Scrum's three accountabilities, three artefacts and five events, with the right timebox on each
5. Say who owns each Scrum decision, and recognise the common ways teams get that wrong

Header meta: Reading 45 minutes · Follows Lesson 1 · Bring nothing.

## 2. Full content

### Hero

Headline "Four ways to shape the same **work.**" (accent full stop on "work"). Lede: Waterfall, Spiral, PRINCE2 and Agile, drawn rather than described, with ten things on the page the reader can move, then Scrum in full. Meta line: "Lesson 2 of MBI804 · Yasas Sri Wickramasinghe · open to anybody, no login". Two buttons: "Start Lesson 2" (scrolls to `#shapes`) and "Straight to Scrum" (scrolls to `#scrum`).

Hero art: `HeroGlyphs()`, a 280×176 SVG with four labelled glyphs — Waterfall as four descending steps with the last in the accent, Spiral as a coil of about 1.7 turns, PRINCE2 as a board bar above three stage boxes with two decision diamonds between them, Agile as a four-arc ring beside three stacked increments. Keyline beneath: "**None of these is the modern one.** A methodology is a bet about when you find things out, and a project decides which bet it can afford to make."

### 2.1 The four shapes (`#shapes`) — `LifecycleGallery`

Section head "Start with the picture". Prose: a methodology is a shape imposed on the work — where decisions sit, how often the outside world looks, and what happens when somebody changes their mind.

Four pills. Each shows a 560×210 SVG, a one-line summary prefixed with the origin, a caption, the same four meters, and a verdict.

| Method | Origin shown | Summary | Meters (feedback / change tolerance / governance / up-front docs) |
|---|---|---|---|
| Waterfall | Royce, 1970 | One pass through requirements, design, build, test and deploy — each phase signed off before the next begins | 12 / 10 / 45 / 95 |
| Spiral | Boehm, 1986 | Repeat the same four activities in widening loops, spending each loop buying down the biggest risk still standing | 55 / 55 / 60 / 70 |
| PRINCE2 | UK Government, 1996 | Govern the project in stages, with a board that re-justifies the business case before it funds the next one | 40 / 40 / 100 / 80 |
| Agile | Manifesto, 2001 | Turn a short loop over and over, leaving something usable behind every time round | 95 / 95 / 30 / 25 |

Meter names and their questions: Feedback loop ("How often the outside world sees the real thing"), Change tolerance ("What it costs to change your mind in week twelve"), Governance weight ("How much formal decision-making the method carries"), Up-front documentation ("How much is written down before anybody builds").

Drawings: Waterfall is five stepped phase boxes (Requirements → Design → Build → Test → Deploy) with a single release marker and a dashed return arc crossed out in red, captioned "a change here re-opens a signed phase". Spiral is an Archimedean coil through four named quadrants with a bar chart of risk remaining across four cycles. PRINCE2 is a project board bar (executive, senior user, senior supplier), a tolerance band labelled with the six tolerances, four stages, and go/no-go diamonds between them. Agile is a backlog bar, a four-arc loop labelled 1–4 weeks with Plan / Build / Review / Adapt, and four increments stacking.

Verdict texts (abridged in the UI to one paragraph each): Waterfall buys an auditable plan at the price of deciding everything while the team knows least; Spiral was the first model to make risk drive the plan, and is expensive enough that it turns up on aerospace and defence more than on a website; PRINCE2 is a management method, not a delivery method, so one of the others still goes underneath it; Agile is not the absence of a plan but a plan re-made every fortnight, which only works if somebody with authority looks at the increment.

Tally line: "N of 4 seen. No bar here is a mark out of a hundred — they are the trades each method makes, and a project decides which trade it can afford."

### 2.2 Waterfall (`#waterfall`) — `CostOfChangeCurve`

Section head "Be right the first time." Prose notes that Royce's 1970 paper also said running the sequence in a single pass was risky, and that Waterfall's logic holds where requirements genuinely cannot move.

The widget prices one change — "payments over $10,000 need a second approver" — at each of five phases, on a logarithmic bar chart (a linear scale flattens the first four bars into the axis).

| Phase | Multiplier | Hours | What it takes | Why |
|---|---|---|---|---|
| Requirements | 1× | 4 hours | An analyst adds a line to the specification and re-runs the sign-off | Nothing is built on the assumption yet; the cheapest hour the project will ever spend |
| Design | 3× | 12 hours | Approval flow, data model and two screens redrawn | Paper that agrees with other paper; every artefact referencing the old flow has to be found, and the sign-off re-taken |
| Build | 8× | 32 hours | A table gains a column, the service gains a state, three screens change | The assumption is load-bearing; rework is the feature plus everything leaning on the version being removed |
| Test | 20× | 80 hours | Code change plus full regression plus re-written test cases and traceability matrix | The expensive part is proving nothing else broke, with every prior test result invalidated |
| In production | 60× | 240 hours | Patch, data migration for payments already approved under the old rule, release window, support plan | Real data exists in the shape of the mistake; migration, rollback and out-of-hours release are usually larger than the change, and none of it was estimated |

Closing tally: "This curve is the entire argument between the methodologies. Waterfall answers it by trying to be right the first time; Spiral answers it by attacking the riskiest unknown first; Agile answers it by never letting a decision get more than a fortnight old."

Two cards follow. **When it is the right answer:** fixed signed requirements, an auditor who needs traceability, a supplier contract with a defined deliverable, hardware or construction. **When it is not:** anything where the customer only knows what they want once they see it working. Then a note that the V-model is Waterfall with testing folded up, each descending phase paired with the level of testing that verifies it.

### 2.3 Spiral (`#spiral`) — `SpiralModel`

Section head "Buy the scariest answer first". Prose: the spiral is usually mistaken for "Waterfall, but round"; the difference is the second quadrant, where the largest remaining risk is attacked with a prototype before anything else is built.

A 300×320 SVG draws the four quadrants (Determine objectives / Identify and resolve risks / Develop and verify / Plan the next cycle, labelled in their outer corners) with a coil that starts pointing left from the centre and turns clockwise, one quarter-turn per step. Twelve steps — three cycles of four quadrants — on SecurePay NZ's move to real-time payments, the scenario the cost-management lecture already uses. Two meters track risk still unresolved and cumulative spend.

| # | Cycle · quadrant | Title | Risk | Spend |
|---|---|---|---|---|
| 1 | 1 · Determine objectives | What the first loop is for | 100% | $15k |
| 2 | 1 · Identify and resolve risks | The scariest unknown, prototyped first | 72% | $55k |
| 3 | 1 · Develop and verify | Build only what the risk needed | 58% | $90k |
| 4 | 1 · Plan the next cycle | Fund the next loop, or stop | 58% | $90k |
| 5 | 2 · Determine objectives | Objectives, revised by what loop one found | 58% | $110k |
| 6 | 2 · Identify and resolve risks | The next largest risk | 34% | $175k |
| 7 | 2 · Develop and verify | Build the slice that proves it | 26% | $240k |
| 8 | 2 · Plan the next cycle | The second funding decision | 26% | $240k |
| 9 | 3 · Determine objectives | Objectives for the loop that ships | 26% | $265k |
| 10 | 3 · Identify and resolve risks | What is left to be afraid of | 14% | $300k |
| 11 | 3 · Develop and verify | Build the release | 6% | $520k |
| 12 | 3 · Plan the next cycle | And the bill for all of it | 6% | $520k |

Narrative beats worth preserving: loop one prototypes settlement reconciliation under continuous rather than batch arrival and finds 0.4% of payments arriving out of order; the first funding gate is the point where stopping would have cost $90,000 and saved millions; loop two shadow-runs a fraud model against six months of history; loop three transfers the certification date risk to the rails provider by contract rather than prototyping it; the final step states the model's criticism on the same screen — the overhead of a full risk analysis every loop is real, and Spiral earns its cost only where being wrong is expensive.

### 2.4 PRINCE2 (`#prince2`) — `Prince2Explorer`

Section head "Who is allowed to decide what". Prose: PRINCE2 answers a different question from the other three — who is entitled to make which decision, with what evidence, at which moment — which is why it appears *with* one of the others rather than instead of one.

Three pills switch between the lists. Each item is a chip; selecting one opens a title, a body, and a red "What a project without it looks like" panel. The processes tab additionally shows a 560×176 process map: "Directing a Project · the board" as an accent band across the top labelled "RUNS ABOVE EVERYTHING, FOR THE WHOLE PROJECT", with Starting up → Initiating → Controlling a Stage (with Managing Product Delivery) → Boundary (go/no-go) → Closing below it and a dashed loop back, captioned "repeat per stage, until the board authorises closure".

**7 principles** (lead: "Non-negotiable. A project that drops one of these is not being run under PRINCE2, whatever the documents say."): Continued business justification; Learn from experience; Defined roles and responsibilities; Manage by stages; Manage by exception; Focus on products; Tailor to suit the project. Their "without it" lines are, respectively: projects nobody can defend keep running; every project re-discovers the same surprises; decisions stall because nobody can say who decides; a twelve-month plan estimated to the day in month one; either a board that meets weekly to approve nothing or one that hears about the overrun at the end; a schedule full of activity and an argument at handover; either a two-person project drowning in documents or a template somebody stopped filling in.

**7 themes** (lead: "The aspects that have to be managed continuously, not once."): Business Case; Organization; Quality; Plans; Risk; Change; Progress. Notable details carried: three levels of plan with only the imminent stage detailed; risk responses drawn from avoid, reduce, transfer, share, accept and exploit, with risk appetite set by the board; configuration management tracking which version is approved; "90% done for three months" named as the most expensive sentence in project management.

**7 processes** (lead: "Who does what, when. Six of them run in sequence or inside a stage; one of them runs above the whole project."): Starting up a Project; Directing a Project; Initiating a Project; Controlling a Stage; Managing Product Delivery; Managing a Stage Boundary; Closing a Project. The Managing Product Delivery entry carries the lesson's recurring point — this is the seam where Scrum, a build phase or a subcontractor sits, because PRINCE2 never says how the work is done.

Tally line notes that PRINCE2 7 (2023) renames the themes to practices and folds Change into Issues, and that both namings are worth recognising because workplaces and certifications are split across them.

### 2.5 Agile (`#agile`) — `ManifestoValues`, then `AgileFamily`

Section head "A family, not a framework". Prose: seventeen practitioners, Snowbird, Utah, 2001; no process, no roles, no ceremonies — four "A over B" values and twelve principles.

**`ManifestoValues`** draws each value as a balance beam whose tilt is a slider (0 = all the way right, 100 = all the way left, default 72). Four readings are possible:

- ≥ 90 "All the way over" — the far-reading cost
- 58–89 "The intended reading" — the value's own note
- 42–57 "Balanced" — defensible, and not what the Manifesto says: it names a preference, not a tie
- < 42 "Tipped the other way" — reasonable for an audited or safety-critical project, at which point you are describing Waterfall or PRINCE2

| Value | Intended reading | All-the-way-over cost |
|---|---|---|
| Individuals and interactions over processes and tools | A daily conversation resolves in five minutes what a workflow tool escalates for three days | Knowledge lives in whoever was in the room, and nobody can be onboarded |
| Working software over comprehensive documentation | Progress is measured by something that runs; this is the value the cost-of-change curve pays for | Operations inherit a system nobody can run, architecture lives in one contractor's head, the audit has nothing to look at |
| Customer collaboration over contract negotiation | A customer in the room every fortnight beats a specification argued over by two legal teams | Nobody can say what was promised, and collaboration becomes an unbounded obligation on the weaker side |
| Responding to change over following a plan | A forecast made with new information beats one defended because it was signed | No baseline, so nothing can be recognised as change — which is how scope creep goes unnoticed |

Closing panel quotes the Manifesto's own last line ("While there is value in the items on the right, we value the items on the left more") and adds that an undocumented, uncontracted, unplanned project is not an Agile project, just an undisciplined one.

**`AgileFamily`** is a fan: "Agile Manifesto, 2001" in a dark pill at the top, seven branches to seven leaf circles, each leaf a clickable target (a transparent rectangle behind the circle and its label, so the hit area is thumb-sized). Selecting one fills a summary line, two cards and a share meter.

| Leaf | Origin | What it is | The idea it contributed | Share |
|---|---|---|---|---|
| Scrum (Sc) | Schwaber & Sutherland, 1995 | Three accountabilities, three artefacts, five timeboxed events, in 1–4 week sprints | The timebox: a fixed length the work is fitted into | 87% |
| Extreme Programming (XP) | Kent Beck, 1996 | Pairing, TDD, CI, collective ownership, small releases, on-site customer | Technical discipline is not separate from agility | 11% |
| Kanban (Kb) | Toyota, via David Anderson, 2010 | Visualise the work, limit WIP, measure cycle time, improve from it | Limit work in progress | 56% |
| Crystal (Cr) | Alistair Cockburn, 1990s | A family sized by team size and criticality — Clear, Yellow, Orange, Red | Process weight should scale with team size and criticality | 2% |
| Lean software development (Ln) | Poppendiecks, 2003 | Seven principles from lean manufacturing | Waste is anything the customer would not pay for; optimise the whole | 17% |
| Feature-Driven Development (FD) | Jeff De Luca, 1997 | Model the domain, list features, plan/design/build by feature | Scale through a shared domain model and named ownership | 4% |
| DSDM / AgilePF (DS) | UK consortium, 1994 | Roles, phases and governance around fixing time and cost and flexing features; MoSCoW comes from here | Fix time and cost, flex the features | 5% |

Only Scrum's 87% is quoted (17th State of Agile Report, the same source the gated Agile Scrum deck uses); the meter note states plainly that the other figures are indicative orders of magnitude rather than measured shares, and that shares exceed 100% because most teams run more than one.

### 2.6 Scrum (`#scrum`) — the long section

Section head "The framework you will actually be handed." Prose covers the three pillars — transparency, inspection, adaptation — and states that every event exists to make one of them happen on a schedule.

**`ScrumCycle`** is a 700×320 clickable diagram: Product Backlog → Sprint Planning → Sprint Backlog → Daily Scrum (with a dashed repeat ring) → Sprint Review and Retrospective → Increment, all inside a "THE SPRINT · 1–4 WEEKS" container, with a dashed return loop under it captioned "the next Sprint starts the moment this one ends — there is no gap in the framework". Eight selectable nodes; each opens Who / How long / What it produces cards, a "What it is" panel and a red "The part teams get wrong" panel.

| Node | Kind | Who | Timebox | Produces | The trap |
|---|---|---|---|---|---|
| Product Backlog | Artefact | Owned by the Product Owner | Never finished | An ordered list | It is ordered, not sorted into buckets; "high priority" with fourteen items is not an order |
| Sprint Planning | Event | The whole Scrum Team | Max 8 hours | A Sprint Goal and a Sprint Backlog | Only the Developers may decide how much is taken on |
| Sprint Backlog | Artefact | Owned by the Developers | Updated daily | The plan for this Sprint | Scope may be renegotiated with the PO; nobody may add work that endangers the Sprint Goal |
| Daily Scrum | Event | The Developers | 15 minutes, every day | An adapted plan for the next day | Not a status report and not a problem-solving session |
| The Sprint | Work | The whole Scrum Team | 1–4 weeks, consistent | A Done Increment | Only the PO can cancel it, and only when the Goal is obsolete |
| Sprint Review | Event | The Scrum Team and stakeholders | Max 4 hours | A revised Product Backlog | Not a sign-off meeting; no stakeholders means no feedback loop |
| Sprint Retrospective | Event | The Scrum Team only | Max 3 hours | One improvement, taken into the next Sprint | Improvements on a separate wall-chart never happen |
| Increment | Artefact | Produced by the Developers | At least one per Sprint | Usable product | "Done except for testing" is not Done |

#### 2.6.1 Accountabilities

Three cards: **Product Owner** ("One person, never a committee") accountable for maximising product value, owning and ordering the backlog, developing the Product Goal and deciding what is released; **Scrum Master** ("A servant-leader, not a manager") accountable for the team's effectiveness and for Scrum being understood and enacted, serving Developers, Product Owner and organisation; **Developers** ("Typically three to nine, cross-functional") accountable for a usable Increment each Sprint, owning the Sprint Backlog and the Definition of Done, with the note that the 2017 Guide set 3–9 and the 2020 Guide frames it as a Scrum Team of ten or fewer. Prose notes there is no project manager inside a Scrum Team.

**`ScrumRoleSort`** — twelve situations, three buttons, a verdict for the right answer and a separate "Why X is tempting" panel for whichever wrong role was picked. Running tally of right answers out of answered; nothing stored.

| # | Situation | Answer |
|---|---|---|
| 1 | Deciding which of two features is built first | Product Owner |
| 2 | Deciding how many items the team takes into the Sprint | Developers |
| 3 | The build server has been broken for two days and IT will not prioritise it | Scrum Master |
| 4 | Writing the acceptance criteria for a story | Product Owner |
| 5 | Deciding a story is not Done because coverage fell below the agreed threshold | Developers |
| 6 | A stakeholder asks a developer mid-Sprint to "just add one small thing" | Scrum Master |
| 7 | Deciding whether the Increment gets released this week | Product Owner |
| 8 | Breaking a selected story into tasks | Developers |
| 9 | Two developers have not spoken in a fortnight and it is slowing the work | Scrum Master |
| 10 | Explaining to a new executive why the team will not commit to twelve months of fixed scope | Scrum Master |
| 11 | Keeping the Product Backlog understandable to everyone who reads it | Product Owner |
| 12 | Cancelling the Sprint because the market changed and the Goal is pointless | Product Owner |

#### 2.6.2 Artefacts

A table pairing each artefact with its commitment: Product Backlog / Product Goal; Sprint Backlog / Sprint Goal; Increment / Definition of Done. Prose: an artefact without its commitment is where transparency goes — a backlog with no Product Goal is a wish list, an increment with no Definition of Done is an opinion.

A worked Definition of Done as a six-item checklist: code peer-reviewed and merged; unit tests written and passing; tested in a staging environment; accessibility checked to WCAG 2.1 AA; API docs and README updated; accepted by the Product Owner. Beside it, three rows on why it is load-bearing — it makes "done" a fact rather than a negotiation; it is the only defence against invisible technical debt; it is owned by the Developers and changes in the Retrospective for future work, never to absorb a story that already missed it.

#### 2.6.3 Events — `SprintTimeline`

A slider sets the Sprint at 1–4 weeks. Planning, Review and Retrospective scale from their one-month maxima (8 / 4 / 3 hours); the Daily Scrum is 15 minutes × 5 days per week. The drawing shows the Sprint as a bar with a Planning block on day one, a Review + Retro block on the last day, a daily-scrum tick per day, and a strip for "how long a wrong turn can run unseen".

The teaching point is the arithmetic: at the Guide's maxima the five events come to 16.7% of capacity **at every Sprint length** (5 hours per week of ceremony against 30 usable hours per week), so the cost of short Sprints is not meeting time. The readout that does move is Sprint Reviews per year — about 46, 23, 15 and 12 for one, two, three and four weeks over roughly 46 working weeks. Per-length verdicts cover: one week's small-story constraint and a sick day costing 20% of the Sprint; two weeks as the common landing point with the note that the Guide says "one month or less" rather than "two weeks"; three weeks fitting awkwardly into a calendar month; four weeks buying the fewest interruptions at the price of four weeks of work built on an unchecked assumption.

#### 2.6.4 User stories — `StoryAnatomy` (local to the lesson file)

Prose: Scrum does not require user stories — the Guide says "Product Backlog item" — they are borrowed from XP and survive because the third clause forces somebody to say why the work is worth anything.

The widget draws the template as three labelled rows (As a / I want to / So that) annotated "who is asking", "what they want to do", "why it is worth anything", captioned "a placeholder for a conversation — not a specification". Three examples toggle it:

1. **Student story** (good) — "As a student, I want to see my attendance percentage for each paper, so that I know whether I am at risk of failing on attendance." Verdict: the reason clause is what lets a developer suggest a cheaper way to the same outcome, and it is the clause most often missing.
2. **Lecturer story** (good) — "As a lecturer, I want to export one session's attendance to CSV, so that I can hand it to administration without retyping it." Verdict: small, independent, testable, and silent about which button or column order.
3. **Not a story** (bad) — "As the system, I want to have a normalised attendance table with indexes, so that queries are faster." Verdict: "the system" is not a user, nobody outside the team would notice it arriving, and written this way it competes for priority against work with actual value.

Beside it, INVEST as six rows (Independent, Negotiable, Valuable, Estimable, Small, Testable) and acceptance criteria for the first story: attendance percentage per enrolled paper; absence dates in chronological order; a warning below 80%; page loads under two seconds on the campus network; works on phone and desktop. Two notes follow — acceptance criteria are per story while the Definition of Done applies to every story, and story points are relative size on a Fibonacci-ish 1, 2, 3, 5, 8, 13 scale whose total per Sprint is velocity, useful within a team and useless between teams.

#### 2.6.5 The board — `ScrumBoard`

Four columns (To do, In progress, In review, Done), a work-in-progress limit of 3 on In progress, and eight stories from this platform's own attendance product. Tapping a card moves it one column right; from Done it returns to To do.

| Story | Who | Points | Starting column |
|---|---|---|---|
| Student can see attendance % per paper | Sarah | 5 | Done |
| Warning banner below 80% attendance | James | 3 | Done |
| Lecturer exports a session to CSV | Priya | 5 | In review |
| QR code expires after ten minutes | Mark | 3 | In review |
| Absence dates listed in order | Sarah | 2 | In progress |
| Attendance page works on a phone | James | 5 | In progress |
| Email a weekly summary to tutors | — | 8 | To do |
| Bulk-correct a mis-scanned session | — | 5 | To do |

Thirty-six points total. Breaking the WIP limit raises a red panel explaining that starting is not finishing, that every extra item in progress lengthens how long each one takes, and that the limit is borrowed from Kanban rather than required by the Scrum Guide. A day slider (0–10) drives a burndown with an ideal line from 36 to 0 and the team's actual line to today; the verdict reads ahead (more than 3 points under), on the line, behind (more than 6 points over) or complete, with the "behind is information, not a verdict" response for behind, and the note that consistently finishing early means generous sizing rather than speed. Closing note: Jira, Trello, Linear, GitHub Projects, Azure DevOps or a wall and sticky notes — the tool is not the method, and an accurate wall beats a tidy Jira that lies.

### 2.7 Side by side (`#compare`)

A five-column table across Waterfall, Spiral, PRINCE2 and Agile/Scrum:

| | Waterfall | Spiral | PRINCE2 | Agile / Scrum |
|---|---|---|---|---|
| Shape of the work | One pass, five phases | Widening loops | Authorised stages | Repeating short iterations |
| What drives the plan | The specification | The largest remaining risk | The business case | The ordered backlog |
| Requirements | Fixed and signed up front | Re-set each loop | Baselined per stage | Expected to move |
| Customer sees it | At the end | Each prototype | At each stage boundary | Every iteration |
| Risk surfaces | Late, in testing | First, by design | At every boundary | Early and continuously |
| Stopping the project | Awkward and late | A normal option each loop | A normal option each stage | A normal option each iteration |
| Costs most when | The scope was never stable | The unknowns were small | The project was small | Nobody turns up to the review |

Note beneath: the last row is what the case study is marked on — naming the method is worth almost nothing, naming the conditions under which your chosen method fails and why this project does not meet them is the argument. A button links back to Lesson 1's methodology chooser.

### Knowledge check (`#check`) — six questions

1. **A requirement changes while the system is already in production. Under a Waterfall lifecycle, why is that change so much more expensive than the same change during requirements?** → *Because everything built on top of the original assumption has to be unpicked, re-tested and migrated.* Distractors: developers charge more for urgent work (rates rarely change; the cost is volume, not price); the team has forgotten how it works (real and minor); the specification has to be re-signed (paperwork happens at design too, where the same change costs a fraction).
2. **What makes the Spiral model different from simply running Waterfall four times?** → *A risk analysis at the start of each loop decides what gets built in that loop.* Distractors: each loop delivers a shippable release (that is Agile); no documentation requirements (Spiral is heavyweight — its overhead is its main criticism); the customer sets the priorities each loop (the risk analysis does).
3. **A team says "We use PRINCE2, so we do not need to decide between Waterfall and Agile." What is wrong with that?** → *PRINCE2 governs the project but never says how the work is built, so a delivery method is still needed.* Distractors: nothing, PRINCE2 replaces both; PRINCE2 only works with Waterfall (they are combined routinely, and there is an official variant); PRINCE2 is only for government projects (fit is about governance weight, not sector).
4. **During Sprint Planning, a manager tells the team that fourteen items must go into the Sprint. What has been broken?** → *Only the Developers may decide how much work is taken into a Sprint.* Distractors: nothing, the manager is accountable (there is no manager role in Scrum at all); the Product Owner should have set the number; the Scrum Master should have.
5. **A team moves from four-week Sprints to one-week Sprints and keeps all five events at the Guide's maxima. What happens to the share of capacity spent in those events — and what is the real cost?** → *The share barely moves; what changes is that a wrong direction can now run for one week instead of four.* Distractors: the share roughly quadruples; the share falls because short Sprints need less planning; the share is unknowable because timeboxes are maxima.
6. **A story is fully built and demonstrable but its automated tests were never written, and the Definition of Done requires them. The Product Owner is happy to accept it.** → *It is not Done, it does not count toward the Sprint, and it returns to the Product Backlog.* Distractors: accept it, the PO accepts work (the PO accepts value; the DoD is the Developers'); accept it and write the tests next Sprint (how technical debt becomes invisible); change the Definition of Done to fit (it changes in the Retrospective for future work, not to absorb a story that missed it).

### Recap — five points

1. **A methodology is a bet about when you find things out.** Waterfall bets you can be right first time; Spiral buys the answer to the worst unknown first; Agile refuses to let any decision get more than a fortnight old.
2. **The cost-of-change curve is the argument underneath all of it.** Roughly sixty times dearer in production than in requirements.
3. **PRINCE2 governs; it does not build.** Seven principles, seven themes, seven processes — and a Managing Product Delivery seam where Waterfall or Scrum still has to go.
4. **Agile is a family, not a framework.** And the Manifesto values the right-hand items too, just less.
5. **Scrum is three accountabilities, three artefacts and five events, and the ownership is the hard part.** Only the Developers decide how much; only the Product Owner orders the backlog and cancels a Sprint; only a Done Increment counts.

### What's next (`#ahead`) and sign-off

Three preview blocks: 03 scope and the work breakdown structure, noting that under Scrum "while you're in there, could you also…" has a place to go; 04 estimating and cost management with a link to `/cost-management`, noting story points and velocity answer the same problem from the team's side; an unnumbered block linking `/jira-certifications`. Sign-off headline "Bring me a bad Sprint." asking readers to bring a team they have watched run one of these badly, because naming the missing part of the framework is the skill the 60% case study marks.

## 3. UI & interaction design

Blend, on MBI804's plum (`accent="project"`), inside `CoursePage` — brand header, floating pill nav tracking the section in view, hero slot, content column, dark footer. Nine nav entries matching the section ids: `shapes`, `waterfall`, `spiral`, `prince2`, `agile`, `scrum`, `compare`, `check`, `ahead`.

Widget shells reuse existing Blend blocks rather than introducing new CSS — no rule was added to `blend.css` for this lesson:

- `.cc` (the pick-and-judge block, originally MBI806B's chart chooser) for `LifecycleGallery`, `Prince2Explorer`, `AgileFamily`, `ScrumCycle`, `ScrumRoleSort` and `StoryAnatomy`
- `.bt-sim` (controls left, a responding drawing right, one readout underneath) for `CostOfChangeCurve`, `ManifestoValues`, `SprintTimeline` and `ScrumBoard`
- `.bt-walk .bt-walk--wide` (a drawing as the rail, a stepped panel beside it) for `SpiralModel`
- `.bt-meter` / `.bt-bar`, `.bt-verdict`, `.cc__verdict`, `.bt-pairgrid`, `.bt-rows`, `.bt-plaintable` inside `.bt-scroll`, `.bt-chiprow` / `.bt-ctxchip` for the smaller pieces

Every drawing is inline SVG using Blend's tokens (`--accent-*`, `--ink-*`, `--paper-*`, `--font-display`, `--font-body`, `--font-mono`), so all of it re-themes with the page accent. Clickable SVG groups carry `role="button"`, `tabIndex={0}`, `aria-pressed` and Enter/Space handlers, matching `IcebergModel` in MBI800. Text and decorative strokes inside those groups carry `pointer-events: none`, and `AgileFamily` puts a transparent rectangle behind each leaf so the hit area is a thumb rather than a 24px dot. Every drawing has a descriptive `aria-label` naming its current state, and readouts that change on interaction are `aria-live="polite"`.

Responsive behaviour: `.cc__diagram` scrolls its SVG horizontally inside its own box below 640px (the established treatment for label-heavy drawings, since scaling them to a phone takes the type below legibility), `.bt-sim__grid` and `.bt-walk` collapse to one column, the board columns are an `auto-fit minmax(160px, 1fr)` grid, and wide tables sit in `.bt-scroll`. Verified at 1440, 390 and 360 wide with zero horizontal page overflow at every section.

Entrances are Blend `Reveal` wrappers (a 22px lift and fade, once per element), section head and body wrapped separately with `delay={0.05}` on the body, per the Blend README.

## 4. Component & state architecture

All state is local `useState`, no context, no persistence, no network. Nothing is stored or reported — the page says so in its footer note and in the quiz.

| Component | State | Notes |
|---|---|---|
| `LifecycleGallery` | `key: Key`, `seen: Set<Key>` | `seen` drives the "N of 4" tally only |
| `CostOfChangeCurve` | `i: number` (0–4) | Bar heights are `log(mult)/log(60)` of the plot height |
| `SpiralModel` | `i: number` (0–11) | `tEnd = (i + 1) · π/2`; the path is sampled at 0.05 rad from the centre with `r = 10 + t · 6.3`, starting at angle π so a quarter turn lands in each of Boehm's quadrants in order |
| `Prince2Explorer` | `tab: Tab`, `i: number` | Switching tab resets `i` to 0 |
| `ManifestoValues` | `tilt: number[]` (four values, default 72) | Beam rotation is `((50 − t) / 50) · 5` degrees; weight radii are `6 + share · 6`; four reading bands at 90 / 58 / 42 |
| `AgileFamily` | `key: Key` | Leaf x is `37 + i · (486/7) + (486/7)/2` |
| `ScrumCycle` | `key: Key`, `seen: Set<Key>` | `hit(k)` returns the shared group props; `fill`/`stroke`/`ink`/`sub` helpers select the selected-state colours |
| `ScrumRoleSort` | `i`, `picked: Role \| null`, `right`, `done` | `next()` wraps with `(n + 1) % CASES.length`, so it cycles rather than ending |
| `SprintTimeline` | `weeks: number` (1–4) | `f = weeks/4` scales Planning/Review/Retro; Daily Scrum is `days × 15 min`; `share` is constant at 16.7% by construction, which is the point; `reviewsPerYear = round(46 / weeks)` |
| `ScrumBoard` | `cards: Card[]`, `day: number` (0–10) | `move()` advances a card's column, wrapping from Done to To do; `gap = remaining − ideal` picks one of four verdicts; WIP panel appears above 3 in progress |
| `StoryAnatomy` (in the lesson file) | `which: number` (0–2) | — |

Registration: `src/content/courses.ts` under `MBI804.lessons`, second in the array so it sits directly after `pm-intro`; the `/mbi804` home page card, its progress key and the browser title all derive from that one object. The route is registered twice in `src/App.tsx` — once in `AppRoutes` and once in `ShutdownRoutes`, because the platform currently renders `ShutdownRoutes` (`PLATFORM_ACTIVE` is `false` in `src/config/platform.ts`) and a lesson missing from that list falls through to the shutdown notice. `/project-methodologies` is also added to `EXCLUDED_PREFIXES` in `LessonPasswordGate.tsx` so no class code is asked for.

## 5. Rebuild notes

- **The constant-17% result is deliberate, not a bug.** In `SprintTimeline` the three scaling events scale with the Sprint and the Daily Scrum is per day, so ceremony as a share of capacity is the same at every Sprint length. An earlier draft claimed it rose at short Sprints; it does not, and both the widget copy and knowledge-check question 5 now teach the correct result. Do not "fix" the arithmetic by making the share vary.
- **Figures and their sources.** The Scrum timeboxes, accountabilities, artefacts and commitments follow the 2020 Scrum Guide and match the gated deck at `src/components/slides/AgileScrumDeck.tsx`, so a student meets the same definitions in both places. PRINCE2 follows the 2009/2017 editions with the PRINCE2 7 (2023) renaming noted in the UI rather than substituted. Only the 87% Scrum adoption figure is quoted from a source (17th State of Agile Report, the same one the deck cites); the other six share figures are labelled in the UI as indicative rather than measured. The cost-of-change multipliers (1 / 3 / 8 / 20 / 60) follow Boehm's curve as a teaching illustration on one scenario, not as a measurement of a real project.
- **SecurePay NZ** is the running scenario shared with `/cost-management` and Lesson 1's hero; the attendance stories on the Scrum board are this platform's own product. Keep both — the continuity is the point.
- **SVG geometry is hand-tuned to avoid collisions.** The spiral's `GROWTH = 6.3` is chosen so twelve quarter-turns finish inside the 300×320 frame, and its quadrant labels sit in the outer corners because by step 12 the coil fills the middle. The Scrum diagram's Daily Scrum repeat ring is at r = 58, clear of Sprint Planning (ends x = 300) and Sprint Review (starts x = 468). The Agile fan's leaf labels are short two-line forms (`leaf`) rather than the full `label`, which overlaps its neighbours. Changing any of these numbers needs a visual re-check, not just a typecheck.
- **No external assets and no external links other than** `/intro-to-project-management`, `/cost-management`, `/jira-certifications` (all internal hash routes resolved against `import.meta.env.BASE_URL`) and the lecturer's LinkedIn profile in the sign-off. Nothing to revalidate for link rot beyond that one profile.
- **No new CSS.** If a future edit needs a shell that does not exist, prefer composing the existing `.cc` / `.bt-sim` / `.bt-walk` blocks over adding a rule to `blend.css`, which is what keeps this page visually identical to the other Blend lessons.
