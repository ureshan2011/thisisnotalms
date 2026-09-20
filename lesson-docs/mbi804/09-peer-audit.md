# The outside auditor: peer audit round — MBI804

- **Subject:** MBI804 — IT Project Management. Explicit — `courseCode="MBI804"` on the page, registry entry `pm-peer-audit` under `MBI804.lessons`, and the activity is the peer round on the post-mortems produced by MBI804 Lesson 1.
- **Gating:** Non-gated (public). In `EXCLUDED_PREFIXES` in `LessonPasswordGate.tsx` and registered in both `AppRoutes` and `ShutdownRoutes` in `src/App.tsx`.
- **Route(s):** `/peer-audit`
- **Source files:**
  - `src/pages/PeerAuditPage.tsx` — the Blend `CoursePage` frame, nav list, hero, and a local `ShuffleArt()` SVG of the assignment shuffle
  - `src/components/public/PeerAuditLesson.tsx` — the body: a local activity header, seven sections, a four-question knowledge check, the recap and sign-off. Holds the `ACTIVITY_URL` constant
  - `src/components/public/audit/practiceScenario.ts` — the fictional practice post-mortem, in the six fields a real Lesson 1 artefact uses
  - `src/components/public/audit/AuditWalkthrough.tsx` — section 3, the four audit questions against the practice scenario
  - `src/components/public/audit/EvidenceSort.tsx` — section 4, eight sentences into restates / asserts / audits
  - `src/components/public/audit/ResponsePicker.tsx` — section 5, four risks × four response strategies
  - `src/components/public/audit/CorrectiveActionBuilder.tsx` — section 6, the six-part plan on Blend's `LessonBuilder`
  - `src/content/courses.ts` — registry entry, which generates the `/mbi804` card and the browser title
- **Depends on:** Blend (`CoursePage`, `SectionHead`, `Reveal`, `Quiz`, `Recap`, `LessonBuilder`) and `src/styles/blend.css`; `src/lib/artefactPdf.ts` for the plan export and `src/lib/useLocalDraft.ts` (via `LessonBuilder`) for the autosave; `framer-motion` for the hero; `lucide-react` for one icon. No Firestore, no network calls, no images. Links to `/intro-to-project-management` and the lecturer's LinkedIn.

## 0. What this page is, and what it deliberately is not

The activity itself runs on a **separate Flask app the lecturer deploys** (handed over as `pm-peer-audit-app`): students enter their student index number, see the classmate's post-mortem they have been assigned, download a personalised task PDF, and upload their finished report. That app holds `data/scenarios.json` (the real submissions) and `data/assignments.json` (index → assigned index, sorted and shifted by one so nobody gets their own).

This page is the **training and the brief** for that activity, and it carries none of the real data. Two deliberate exclusions:

1. **No real scenarios.** They are classmates' own accounts of their own workplaces, keyed to student index numbers. Publishing them at a public URL would expose identifiable student writing about identifiable employers. The page trains on a fictional scenario instead (`practiceScenario.ts`), written in the same six fields so the real thing is familiar when it arrives.
2. **No mention of the task PDF's integrity check.** The generated PDFs carry a hidden white-on-white canary instruction; documenting it on a public page would tell the students it is meant to catch. The page says only that submissions are checked and are read as the student's own reasoning.

`ACTIVITY_URL` at the top of `PeerAuditLesson.tsx` is `null` by default. While it is null the page tells readers to use the link posted in Teams; set it to the deployed site and the page grows an "Open the activity site" button. That is the only per-cohort edit.

## 1. Purpose & learning objectives

Lesson 1 asks each student to write up a project they personally lived through, in six fields, using the builder on `/intro-to-project-management`. This activity shuffles those write-ups so each student audits somebody else's, then hands that project's sponsor a Corrective Action Plan.

Stated objectives:

1. Take an auditor's stance on a project you did not run and have no stake in
2. Test a post-mortem's claim about what moved against the evidence in its own text
3. Keep or overturn a methodology verdict by arguing from the project's attributes
4. Tell a risk that is still open from a defect that was already closed
5. Write a Corrective Action Plan a sponsor could act on, with owners and dates

Header meta: Practice here 30 minutes · Then the real one 500–800 words plus a one-page plan · Needs the link your lecturer posts in Teams.

## 2. Full content

### Hero

Headline "Somebody else reads it **properly.**" Lede: you wrote up a project you lived through, now you audit a classmate's — four questions, no stake in their conclusions, and a Corrective Action Plan their sponsor could act on. Buttons scroll to `#practice` and `#submit`.

Hero art (`ShuffleArt`): five write-ups on the left, five readers on the right, each connected by a curve to the *next* reader along with a wrap-around — the same shift-by-one rule the activity's `assignments.json` uses. Captioned "no line runs straight across". Keyline: "**Nobody audits their own project.** Every write-up goes to the next person along, which is also why you will not be told whose you have."

### 1 The stance (`#stance`)

Section head "You did not run this project." Prose: a post-mortem by the person who lived through a project is the most useful document you will get and the least neutral — not dishonesty, but the version where the delay was somebody else's fault is easier to remember, and features that disappeared are easier to recategorise than to mourn.

A `bt-modeswitch` toggles four cards between two lenses.

**The author is:** *Explaining* (the account has to hang together, so parts that do not fit get smoothed); *Defending, a little*; *Reclassifying* (the strongest and usually unconscious move — something promised becomes a "nice-to-have", so scope never officially moved); *Fixing what they can measure* (the proposed change addresses the part that had a number on it).

**The auditor is:** *Testing, not summarising*; *Holding no stake in them being right* (the entire value added); *Watching for the reclassification* (finding the sentence where a commitment becomes a preference is often the whole audit); *Asking what the fix leaves alone* (grant that their change works, then list what it does not touch).

### 2 The brief (`#brief`)

The four questions, verbatim from the task PDF the activity app generates (`TASK_QUESTIONS` in `generate_pdf.py`), rendered as a numbered `bt-track`:

1. **Constraint check** — does the evidence support the author's claim about what moved (scope, time, cost, quality)? Would you name a different one? Justify from specific details, not general theory.
2. **Methodology verdict** — the author names what it was run as and what it should have been. Keep or overturn, arguing from the project's attributes: requirement volatility, dependencies, where knowledge sat.
3. **The missed risk** — is "the risk nobody named" really the biggest one a reasonable person could have caught at kick-off, or is there a bigger one the author still has not seen?
4. **Stress-test the fix** — take the author's "what I would change". If only that had been done, would the project genuinely have turned out differently? Where does their own fix still fail?

Then the six parts of the Corrective Action Plan, as `bt-rows`: problem statement (one sentence, a condition that still exists); root cause (one sentence, a decision not an event); methodology adjustment (with a one-line reason, "none needed" is legitimate); the top risk (with a named response — avoid, mitigate, transfer, accept); two next actions (each with an owner and a timeframe). Closing note: the report is 500–800 words answering the four questions in order; the plan is one page written to the assigned project's sponsor, not to the lecturer, which is the constraint that keeps it short and committing.

### 3 Practice (`#practice`) — `AuditWalkthrough`

The practice scenario sits permanently on the left in a `bt-sheet2` styled exactly like a Lesson 1 artefact; the four questions run down the right.

**The scenario (fictional, labelled as such):** *"Replacing the paper sign-in sheet at a community health clinic with a tablet kiosk"*

| Field | Author's tag | Substance |
|---|---|---|
| What actually moved | Time | Eight weeks became eleven; scope and budget held. The extra weeks went on a crash under two simultaneous taps and on waiting for the clinic's IT person to return from leave to open a port. Large-text mode, screen-reader labels and testing the offline path were dropped at the end and described as "not really features, they were nice-to-haves we had talked about rather than promised" |
| The delay | End date: yes, eventually | Three weeks. Nothing outside the project was waiting; the clinic kept using paper and the manager was relaxed about it |
| Methodology | Run as Agile, called for Agile | Two-week sprints, a daily standup, a board. Requirements moved as the manager saw screens. The clinic first saw working software at the end of week ten of eleven, then asked for three changes |
| The risk nobody named | Response: Mitigate | That the clinic's IT was one person; should have named a second admin or asked for the port in week one |
| What the author would change | — | "I would have asked for the port in week one… The receptionist did say in the second week that she would rather keep the paper sheet, but she came round once she saw it working" |

It is built so every question has a defensible answer with evidence in the text, and so the author's own verdict is always on the option list and never the strongest answer.

**Question 1 · Constraint check.** Strongest: *Quality, undeclared — the accessibility work and the offline path were cut and renamed.* Time moved by agreement with nothing waiting and cost nothing; quality moved without a decision and cost the people the system was built for. "Scope, because three things were dropped" is marked half-right — the reclassification is the move worth auditing, and the next step is asking what was in them and who they were for. "Time, as the author says" is half-right. "Cost, because three extra weeks is money" is weak: no budget figure moved, and reaching for an unsupported constraint is what the question tests for.

**Question 2 · Methodology verdict.** Strongest: *overturn the "run as" — the ceremonies were Agile, the delivery was a single hand-off at the end.* It keeps the half the author got right (the attributes did call for Agile) and proves the other half from a date: the first demo was week ten of eleven, leaving one week to absorb three changes. Keeping the verdict is half-right. Overturning the "called for" is weak — the write-up says the manager kept changing her mind. "Methodology is a team preference" is the position LO1 exists to rule out.

**Question 3 · The missed risk.** Strongest: *the person who uses it daily was never in the room, and a patient who cannot use a tablet has no path.* Evidence is the author's own closing line — the receptionist's week-two objection is recorded as a problem that resolved itself, with no evidence beyond her agreeing; every consultation is with the manager; the accessibility work was cut and the offline path never tested. The author's named risk (one admin) is half-right: real, and it cost three weeks that cost nothing. "The kiosk crashing" is weak — a defect found and closed inside the project, which confuses the risk register with the issue log. "Going over budget" is weak and invented.

**Question 4 · Stress-test the fix.** Strongest: *no — it fixes the schedule, which was the part that did not matter, and leaves every part that did.* The port fix buys back three weeks nobody needed; it does not put the receptionist in the room, restore the accessibility work, test the offline path, or give a patient who cannot use a tablet a way to sign in. "Yes" is weak ("everything else went fine" is the author's claim, not a finding). "They should have bought better tablets" is weak — hardware is not implicated, and substituting your own preferred fix is not an audit. "Impossible to say without the budget" is weak — the write-up carries enough evidence, and asking for more data rather than reading what is there is avoiding the job.

Each answered question also reveals a "What a full-mark answer does here" panel: (1) names quality, quotes the reclassification, says who bore the cost, and concedes what is true in the author's answer; (2) separates the two halves of the verdict, keeps one, and proves the other from a date; (3) names a risk visible at kick-off, quotes the line showing it was visible, and compares consequences rather than likelihoods; (4) grants what the fix achieves, then names at least two specific things it leaves untouched.

### 4 What earns marks (`#evidence`) — `EvidenceSort`

Three buckets — **Restates** ("true, and already in the document"), **Asserts** ("a verdict with no evidence; could have been written without reading"), **Audits** ("a claim, the evidence for it, and why it matters") — and eight sentences from a draft audit of the practice scenario:

| Sentence | Bucket |
|---|---|
| "The author says the project took eleven weeks against a planned eight." | Restates |
| "The methodology verdict is wrong." | Asserts |
| "The author calls the large-text mode a nice-to-have, but it is how a patient with low vision signs in unaided — that reclassification is where quality moved." | Audits |
| "This project was clearly badly managed from the start." | Asserts |
| "The clinic's IT person was on leave, and only he held the rights to open the port." | Restates |
| "The receptionist's objection in week two is recorded as a problem that resolved itself, with no evidence offered beyond her agreeing." | Audits |
| "Agile would have solved this." | Asserts |
| "Sprints and a daily standup are named, but the first demo to the clinic was week ten of eleven, so the iteration loop never closed with a user inside it." | Audits |

Each has a foldaway "Why". Closing tally: a report made only of the first two buckets can be long, fluent and still say nothing a marker could disagree with — which is what makes it weak rather than short.

### 5 The response (`#response`) — `ResponsePicker`

Four risks from the practice scenario against the four strategies, with a verdict on all sixteen pairings.

| Risk | Best response | Why |
|---|---|---|
| Only one person at the clinic holds the needed rights, and takes leave mid-project | Mitigate | Name a second person with the same rights at kick-off; ask in week one, not week nine |
| A patient who cannot use a touchscreen has no way to sign in once the paper sheet goes | **Avoid** | The one where mitigating is wrong: mitigation leaves a residual likelihood, and the residue is a patient turned away. Design a staffed path that never depends on the kiosk, in place before the paper goes |
| The clinic's network drops for a few minutes at a time | Mitigate | Cache locally, queue, sync — the thing the scenario never tested |
| The kiosk tablet is mounted in a public waiting room overnight | Transfer | Insurance or a leased-device agreement moves the replacement cost; it transfers the hardware and not the data on it, which still needs mitigating |

Closing line: three of the four are best answered by mitigating or transferring; the exception is the one where the consequence lands on a person rather than on a schedule or a budget.

### 6 Your plan (`#plan`) — `CorrectiveActionBuilder`

Seven steps on Blend's `LessonBuilder`, autosaving to `localStorage` under `mbi804-corrective-action-draft`, exporting a one-page PDF named `MBI804-corrective-action-plan-<slug>`.

| Step | Fields | Worked-example note |
|---|---|---|
| The project | line | — |
| Problem statement | line | Describe a present condition, not a past event. "The project ran three weeks late" is history a sponsor can do nothing with |
| Root cause | line | Land on a decision, not an incident. "Accessibility was scheduled last, so it was the only thing left to cut" names something changeable |
| Methodology adjustment | choice (No change needed / Agile / Waterfall / PRINCE2 / Keep the framework, fix the practice) + line reason | Distinguish framework from practice. A project that holds standups but never shows a user working software needs the one it claims to have |
| Top risk | text + choice (Avoid / Mitigate / Transfer / Accept) | State the consequence before the likelihood, and pick the response from the consequence |
| Next action 1 | line what + line owner + line when | An owner is a role or a person, never "the team"; a timeframe is a date, never "as soon as possible" |
| Next action 2 | line what + line owner + line when | Different in kind from the first, not a second version of it |

The live sheet renders each action as `what (owner: X · by: Y)`, so an action missing its owner is visibly incomplete before a marker has to say so.

### 7 The real round (`#submit`)

Six numbered steps: open the activity site with the link from Teams and enter your index number; read your assigned scenario (a classmate's, never your own, and you will not be told whose); download your task PDF; write the audit at 500–800 words against the four numbered questions; add the Corrective Action Plan; upload report and plan as one PDF through the same site.

A caution panel explains where the site is — its text switches on whether `ACTIVITY_URL` is set.

**Ground rules:** you will never be given your own project (say so and you will be reassigned); do not go looking for the author; audit the project, not the person ("this was badly managed" is a grade, not a finding); these are real workplaces, so keep it inside the class; submit it as your own work, and note that submissions are checked and an audit that could have been written without reading the scenario is visible from the first paragraph.

**Marked on:** whether the finding survives the evidence (a well-argued "keep the verdict" beats a badly argued overturn); whether you argued from the project (LO1 in miniature); whether the plan could be acted on.

### Knowledge check (`#check`) — four questions

1. **A post-mortem: every feature shipped, budget held, three weeks late with no external deadline — and two accessibility features dropped at the end and called "nice-to-haves we had talked about rather than promised". What moved?** → *Quality, undeclared — the reclassification is the evidence.* Scope is marked as very close and defensible; the stronger answer asks why the author needed to reclassify, namely that calling it scope would have required somebody to approve the change.
2. **Two-week sprints, daily standup, first user sighting of working software in week ten of eleven. Correct methodology finding?** → *The ceremonies were Agile and the delivery was a single hand-off at the end.*
3. **Difference between a risk and a defect found and fixed during the project?** → *A risk has not happened yet and may not; a fixed defect is a closed issue* — and putting a closed defect in as the top risk hands the sponsor a plan for a problem that no longer exists.
4. **Health clinic, a patient who cannot use a touchscreen has no way to sign in, low daily likelihood. Which response?** → *Avoid.* The response follows from the consequence, not the likelihood.

### Recap — five points

An auditor has no stake in the author being right · watch for the sentence where a commitment becomes a preference · check a methodology against the project, not its ceremonies · a closed defect is not a risk · an action with no owner and no date is a wish.

Sign-off headline: "Be the reader you wanted."

## 3. UI & interaction design

Blend on MBI804's plum (`accent="project"`) inside `CoursePage`. Eight nav entries matching the section ids: `stance`, `brief`, `practice`, `evidence`, `response`, `plan`, `submit`, `check`.

The page opens with a hand-rolled header rather than Blend's `LessonHeader`. `LessonHeader` requires "Lesson N of M", and this is an activity in the sequence rather than a numbered lesson — numbering it would collide with the lesson the course calls 3. The header reuses `bt-lessonhead`, `bt-objectives` and `bt-lessonmeta` directly so it is visually identical.

Shells, all existing — no rule was added to `blend.css`:

- `.bt-walk .bt-walk--wide` for the walkthrough, with the scenario as the "rail" so it stays on screen for all four questions. The panel carries an inline `minHeight: 0`, because the default `min-height: 100%` stretches it to the scenario's height and parks the nav a screenful below the last option
- `.bt-sheet2` for the scenario card and for the plan's live sheet, so a practice scenario looks exactly like the artefact a classmate submitted
- `.bt-sim` for the evidence sorter, `.cc` for the response picker
- `.bt-modeswitch` for the author/auditor lens, `.bt-track` for the brief, `.bt-flow` for the six steps, `.bt-rows` and `.bt-pairgrid` throughout

Reveal-state colours are set inline on both the button and its label. `blend.css` paints a pressed `.bt-sim__choice` label white, which is correct on the dark pressed state and unreadable once a reveal repaints the button in a light green or red tint — so every revealed button states its own ink. The same fix was applied to `ScrumRoleSort` and `ResponsePicker`.

Verified at 1440 and 390 wide with zero horizontal page overflow at every section and no console errors.

## 4. Component & state architecture

All state is local `useState` except the plan builder, which autosaves through `useLocalDraft`. No network calls, no Firestore, nothing uploaded from this page.

| Component | State | Notes |
|---|---|---|
| `PeerAuditLesson` | `lens: 'author' \| 'auditor'` | Also holds the `ACTIVITY_URL` constant |
| `AuditWalkthrough` | `at: number` (0–3), `picked: Record<number, number>` | Answers are final per question; the rail doubles as a jump list |
| `EvidenceSort` | `placed: Record<number, Bucket>`, `open: number \| null` | Placement is final; "Why" folds open per row |
| `ResponsePicker` | `risk: number`, `resp: Resp \| null` | Changing risk clears the response |
| `CorrectiveActionBuilder` | via `LessonBuilder` | `storageKey: 'mbi804-corrective-action-draft'`; exports through `downloadArtefact` |

Registration: `src/content/courses.ts` under `MBI804.lessons`, placed after `pm-methodologies`, `kind: 'Practice'`, `access: 'open'`. The route is in both `AppRoutes` and `ShutdownRoutes` in `src/App.tsx` (the platform renders the latter while `PLATFORM_ACTIVE` is `false`), and `/peer-audit` is in `EXCLUDED_PREFIXES` in `LessonPasswordGate.tsx`.

## 5. Rebuild notes

- **The practice scenario must stay fictional.** If a future edit is tempted to use a real submission as the worked example, do not: the page is public, the write-ups are identifiable, and the whole reason `practiceScenario.ts` exists is to keep the real ones behind the activity app.
- **Do not document the task PDF's hidden integrity check here.** It is described in the activity app's own README, which is not public. Naming it on this page would tell students exactly what to strip.
- **`ACTIVITY_URL` is the only per-cohort edit.** Set it in `PeerAuditLesson.tsx` once the Flask app is deployed; leave it `null` between cohorts and the page falls back to "the link your lecturer posts in Teams".
- **The scenario is tuned, not arbitrary.** Each of the four questions has its evidence planted in a specific sentence — the "not really features" reclassification, the week-ten demo date, the receptionist's week-two objection, and the fix that only addresses the schedule. Editing the scenario text without re-reading all sixteen option explanations will break the walkthrough's answers.
- **The six plan fields mirror `CORRECTIVE_PLAN_ITEMS` in the activity app's `generate_pdf.py`.** If the brief there changes, change it here too, or students will build a plan with the wrong parts.
- **The scenarios in the activity app are Lesson 1 artefacts.** `scenarios.json` carries the same six fields, the same labels and the same `MBI804-post-mortem-<slug>` filenames that `PostMortemBuilder` exports — which is why the practice card is styled with `bt-sheet2` and reads identically.
