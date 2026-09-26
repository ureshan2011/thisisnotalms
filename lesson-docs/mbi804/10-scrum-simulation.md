# The Scrum studio: a Sprint you can watch, pause and orbit — MBI804

- **Subject:** MBI804 — IT Project Management. Explicit — the page header carries `courseCode="MBI804"`, the course registry lists it under `MBI804.lessons` with id `scrum-simulation`, and it sits directly after Lesson 2 (`pm-methodologies`) as Lesson 3.
- **Gating:** Non-gated (public). No class code, no login. The route is registered in both `AppRoutes` and `ShutdownRoutes` in `src/App.tsx`, so it stays reachable while the platform runs in shutdown-notice mode.
- **Route(s):** `/scrum-simulation`
- **Source files:**
  - `src/pages/ScrumSimulationPage.tsx` — the Blend `CoursePage` frame, the nav list, the hero, and a local `HeroLoop()` SVG of the six-station Sprint loop with the Increment growing in the middle
  - `src/components/public/ScrumSimulationLesson.tsx` — the lesson body: `LessonHeader`, the studio section, roles, artefacts, events, the seven-step loop, a six-question `Quiz`, the `Recap`, what's-next steps and the sign-off. Lazy-loads the studio and renders a `StudioFallback` while the three.js chunk arrives
  - `src/components/public/scrum/timeline.ts` — every fact and every number: the backlog items, the Sprint plan, the phase timeline, `deriveWorld(t)` (the pure function that turns a clock time into the full studio state), the camera vantages, `narrationFor()` and `infoFor()`
  - `src/components/public/scrum/StudioScene.tsx` — the three.js scene: set dressing, cards, the drone, the miniatures, the `Director` that advances the clock and eases the camera
  - `src/components/public/scrum/ScrumStudio.tsx` — the DOM around the canvas: transport bar, speed, scrubber, timeline chips, narration/info panel, WebGL error boundary, on-screen autoplay
  - `src/styles/scrum-studio.css` — the `sst-*` classes, scoped inside `.bt`
  - `public/fonts/dm-sans-700.ttf` — DM Sans Bold, served locally for every in-scene label (drei's `Text` suspends the whole scene until its font loads, so it must not depend on a CDN)
  - `src/content/courses.ts` — registry entry (`id: 'scrum-simulation'`), which generates the `/mbi804` home card and the browser title via `src/lib/pageMeta.ts`
- **Depends on:** Blend (`src/components/blend/` and `src/styles/blend.css`) for `CoursePage`, `LessonHeader`, `SectionHead`, `Reveal`, `Quiz`, `Recap`; `three`, `@react-three/fiber` and `@react-three/drei` (`Canvas`, `OrbitControls`, `Text`, `Billboard`), already in `package.json` and split into the `vendor-three` chunk by `vite.config.ts`; `framer-motion` for the hero entrance; `lucide-react` for the transport icons and the sign-off link icon. No Firestore reads or writes, no images, no external assets beyond the local font. Links out to `/project-methodologies` and `/jira-certifications`, plus the lecturer's LinkedIn profile.

## 1. Purpose & learning objectives

Lesson 2 (`/project-methodologies`) explains Scrum as a clickable diagram and a list of definitions. This lesson is the same framework as a *place*: six 3D miniatures build a parcel-delivery drone through three one-week Sprints while a narration says who is doing what and why. The reader can play, pause, change speed, scrub, jump to any event, orbit the camera and click any miniature or object for what it owns and the trap teams fall into with it. The point is that a student who has *watched* the loop go round three times can narrate it themselves, which is most of what the 60% case study asks when it says "recommend Scrum and justify it".

Stated objectives, as they appear in `LessonHeader`:

1. Name the three accountabilities on a Scrum Team and say what each one owns — and what it does not
2. Walk the five events of a Sprint in order, with who attends and the timebox on each
3. Explain the three artefacts and the commitment attached to each one
4. Trace one backlog item from the Product Backlog to a Done Increment, and say who decides at every step
5. Spot the common ways a team breaks Scrum: the standup that became a status report, the manager who set the Sprint scope, the item accepted without being Done

Header meta: Time 35 minutes · Follows Lesson 2, Scrum up close · Needs a browser with WebGL.

Facts follow the 2020 Scrum Guide and deliberately agree with Lesson 2's `ScrumCycle` widget (same timeboxes, same ownership, same traps).

## 2. Full content

### Hero

Headline "Watch a Scrum Team build **something.**" (accent full stop). Lede: six miniatures, one parcel drone, three one-week Sprints in a 3D studio you can pause, scrub and orbit; the Product Backlog becomes a Sprint Backlog, the Daily Scrum runs every morning, an impediment lands and gets cleared, stakeholders watch the drone lift off, and the loop goes round three times. Meta: "Lesson 3 of MBI804 · Yasas Sri Wickramasinghe · open to anybody, no login". Buttons: "Open the studio" (scrolls to `#studio`) and "Just the facts" (scrolls to `#roles`). Hero art: `HeroLoop` — six stations on a ring (Backlog, Planning, Daily, Work, Review, Retro) with three stacked Increment layers in the centre. Keyline: "Scrum is a loop, not a line. Every Sprint ends where the next one starts, and the product grows in the middle."

### 3.1 The studio — the simulation

**The cast** (`ACTORS` in `timeline.ts`): Priya, Product Owner (plum shirt, carries a clipboard); Sam, Scrum Master (teal, headset); Developers Aroha (blue), Ben (orange), Chen (green), Dee (pink); stakeholders Mr Ngata (runs the courier depot) and Ms Okafor (heads operations), grey suits with ties, present only at Sprint Reviews.

**The set** (`SPOT`): back wall with "THE SCRUM STUDIO" painted on it; Product Backlog wall (left) with the Product Owner's small desk beside it, where the pile of un-ordered cards starts; round planning table (centre back) with three mugs; Sprint Board (right of centre) with TO DO / DOING / DONE columns and a plank above it reading "SPRINT GOAL · <goal>" that lights up while a Sprint runs; four Developer desks with laptops (front); the Increment pedestal (front right) labelled INCREMENT; the Daily Scrum rug (front left) with a fifteen-minute ring that empties across the meeting and a floating countdown from 15:00; the Retrospective whiteboard (back right, headed WENT WELL / IN THE WAY / ONE CHANGE) on which a yellow sticky is pinned.

**The product** — a parcel-delivery drone. Product Backlog items, in the Product Owner's order, each with a user story and story points (`ITEMS`):

| # | Item | Points | Story |
|---|---|---|---|
| 1 | Frame | 3 | As a courier, I want a rigid frame so that the drone can carry a 1 kg parcel without flexing. |
| 2 | Rotors | 5 | As a courier, I want four rotors so that the drone lifts off and hovers steadily. |
| 3 | Battery | 3 | As a courier, I want a swappable battery so that a flat drone is back in the air in a minute. |
| 4 | Camera | 5 | As a pilot, I want a forward camera so that I can see the landing spot before the drone commits. |
| 5 | GPS | 8 | As a pilot, I want GPS so that the drone finds the customer's door on its own. |
| 6 | Parcel clamp | 5 | As a customer, I want the parcel released only on the doorstep so that it is never dropped in flight. |
| 7 | Lights | 2 | As a neighbour, I want the drone lit at dusk so that I can see it coming. |
| 8 | Weather shell | 5 | As a courier, I want a splash-proof shell so that a shower does not ground the fleet. |
| 9 | Speaker | 2 | As a customer, I want a chime on arrival so that I know to open the door. |
| 10 | Solar skin | 13 | As an operator, I want solar trickle-charging so that idle drones top themselves up. |

`REVIEW_ITEM` — **Rain sensor** (3 points): "As an operator, I want the drone to return to base when rain starts so that the electronics survive a shower." Arrives during the Sprint 1 Review at p > 0.55 and is ordered above Lights (`backlogOrder(true)`).

`SPRINT_PLAN`: Sprint 1 = Frame, Rotors, Battery (goal "It lifts off"); Sprint 2 = Camera, GPS, Parcel clamp ("It finds the door"); Sprint 3 = Rain sensor, Lights, Weather shell ("It survives the weather"). Speaker and Solar skin are never reached — the backlog is never finished. `RETRO_IMPROVEMENTS`: "Pair on any item over 5 points", "Refine the backlog on Wednesdays", "Demo on real parcels, not props" — each pinned at that Sprint's Retrospective and shown as a green "IMPROVE · …" card in the *next* Sprint Backlog.

Each Done item bolts a part onto the drone on the pedestal at once: frame (dark slab plus four arms), rotors (four two-blade props that spin when the drone hovers), battery (yellow "BATT" box underneath), camera (black sphere with a glowing blue lens at the front), GPS (antenna with a green tip), parcel clamp (two claws and an orange parcel), rain sensor (small blue dome), lights (red at the front arms, green at the rear), weather shell (translucent dome).

**The timeline** (`PHASES`, durations at 1×): intro 6 s → Product Backlog 10 s → for each of three Sprints: Planning 10 s, then five days of (Daily Scrum 4.5 s + the work 5 s), then Review 10 s, Retrospective 8 s → "After three Sprints" 10 s. Total 4:12. It loops.

**What happens in each phase** (`deriveWorld`):
- *Intro* — cards lie in a pile on Priya's desk; everyone idles at their station.
- *Product Backlog* — cards leave the pile one at a time and settle on the wall in order; Priya points at the wall, Sam watches from a distance, the Developers work.
- *Sprint Planning* — all six sit round the table (talk, then nod); at p ≥ 0.25 the Sprint Goal plank lights; at p ≥ 0.35 / 0.53 / 0.71 the top three cards fly from the wall to TO DO; from Sprint 2, at p > 0.7 the green improvement card appears.
- *Daily Scrum (each day)* — the four Developers stand in a circle on the rug facing inward; Sam stands just outside the circle; Priya is at the wall refining. The ring on the rug and the 15:00 countdown run down. Day 4: Ben points (raising the blocker); at p > 0.5 Sam walks to Ben's desk and the red block disappears at p ≥ 0.85, Sam celebrates.
- *The work (each day)* — Developers at their desks (arms working). Card schedule per Sprint: day 1 item A → DOING at p > 0.15; day 2 A → DONE at p > 0.3 (part appears on the drone), B → DOING at p > 0.55; day 3 at p > 0.4 a red "BLOCKED · part not shipped" cube lands on Ben's desk and he stops; day 4 B → DONE at p > 0.45, C → DOING at p > 0.65; day 5 C → DONE at p > 0.6. Sam alternates between the board and the floor; on day 2 at p > 0.5 Priya walks to Chen's desk to answer a question.
- *Sprint Review* — the stakeholders walk in from the door at p > 0.25 and stand facing the pedestal (nod, then clap / point); the whole team gathers round; the drone lifts about 1.1 units off the pedestal between p 0.3 and 0.85, rotors spinning fast, and gently rocks. Sprint 1: the Rain sensor card appears on the wall at p > 0.55. Done cards clear from the board at p ≥ 0.8.
- *Sprint Retrospective* — stakeholders gone; the six stand in two rows facing the retro board; Sam points; at p > 0.55 the yellow sticky with the improvement pins to the ONE CHANGE column.
- *After three Sprints* — the six stand in a ring round the pedestal celebrating (arms up, hopping); the drone hovers with nine parts; the board is empty and the plank unlit. Then the loop restarts.

**Camera** (`VANTAGE` and `focus`): each phase has a vantage and a focus point; the `Director` eases the camera toward them (snapping on a jump) unless the reader has orbited in the last nine seconds (`userUntil`). `OrbitControls`: no pan, damping, distance 3–18, polar angle capped just above the floor.

**Narration panel** (`narrationFor`): for every phase — eyebrow, title, Who, Timebox, Output, body, and a "Watch for" line that changes with the moment (day 4's Daily Scrum tells the reader to watch Sam leave the circle; day 3's work describes the blocker; day 2 of Sprint 1 the Product Owner answering a question; other days that Dee has no card because she pairs and tests; the Sprint 1 Review the Rain sensor card; Sprint 2+ Planning the green card). Full text is in `timeline.ts`; the facts stated there are:

- Product Backlog — owned and ordered by the Product Owner; never finished, refined continuously; one ordered list, the only source of work.
- Sprint Planning — whole Scrum Team; max 8 hours for a one-month Sprint (about 2 hours for this one-week Sprint); output a Sprint Goal and a Sprint Backlog; three questions in order (why, what, how); only the Developers decide how much.
- Daily Scrum — the Developers; the Scrum Master listens from outside the circle; the Product Owner is not required; 15 minutes, same time and place, every working day; output an adapted plan for the next 24 hours; not a status report; problems named here, solved elsewhere.
- The Sprint — one week and the same length every Sprint; an Increment exists the moment an item is Done, not at the end of the Sprint; nobody adds work that risks the Sprint Goal.
- Sprint Review — Scrum Team and stakeholders; max 4 hours a month (about an hour here); output a revised Product Backlog; not a sign-off, not a demo performance.
- Sprint Retrospective — Scrum Team only; max 3 hours a month (about 45 minutes here); output one improvement into the next Sprint; the Definition of Done can change here.
- After three Sprints — nine Done items, two still on the wall, no gap before the next Sprint.

**Click-to-inspect** (`infoFor`, one entry per `SelectableId`): each of the eight miniatures, the backlog wall, the Sprint Board, the Sprint Goal plank, the drone, the rug, the planning table and the retro board. Each gives an eyebrow, a title, three label/value lines, a body and "The trap". Key lines: the Product Owner does not decide how much the Developers take on and cannot waive the Definition of Done; the Scrum Master does not assign work, run the Daily Scrum or report upward; Developers — no sub-teams, no hierarchy, only they decide how much enters a Sprint; stakeholders attend the Review only and talk to the Product Owner, never straight to a Developer's desk; Product Backlog → commitment Product Goal; Sprint Backlog → Sprint Goal, owned by the Developers, updated daily, only they change it; Increment → Definition of Done, exists the moment an item is Done, un-Done work goes back to the Product Backlog; Daily Scrum spot — 15 minutes, not a status report; planning table — Planning max 8 h a month, Review max 4 h a month, both scale down; retro board — one improvement, "ten improvements is none"; Sprint Goal — written by the whole team, proposed by the Product Owner, fixed for the Sprint, "a Sprint Goal that lists the items is not a goal".

**Prose under the studio:** nobody in the studio is anybody's manager and there is no project manager; the Product Owner is at the wall during the Daily Scrum, not in the circle; the drone gains a part on day two, days before the Review.

### 3.2 Roles — "Three accountabilities, no manager."

Three cards (`ROLES`): Product Owner (Priya, in plum) — accountable for maximising the value of the product, owns and orders the Product Backlog, writes the Product Goal, decides what is released, one person not a committee; *not theirs:* how much the Developers take on, waiving the Definition of Done. Scrum Master (Sam, with the headset) — accountable for the team's effectiveness and Scrum being understood, coaches self-management, keeps events in their timeboxes, removes impediments, a servant-leader; *not theirs:* assigning work, running the Daily Scrum, reporting upward. Developers (Aroha, Ben, Chen and Dee) — accountable for a usable Increment every Sprint, hold every skill between them, plan their own Sprint Backlog, adapt it daily, own the Definition of Done; *not:* sub-teams, hierarchy, anyone outside deciding how much they take on. Closing prose: the grey suits are stakeholders, not on the Scrum Team; they attend the Review and talk to the Product Owner; "one small thing" at a Developer's desk is how a Sprint Goal dies quietly.

### 3.3 Artefacts — "Three artefacts, each with a commitment."

A `bt-grid` table (`ARTEFACTS`): Product Backlog / Product Goal / the Product Owner / the single ordered list of everything the product might need, never finished, the only source of work (the wall on the left). Sprint Backlog / Sprint Goal / the Developers / the Sprint Goal, the items pulled to meet it and the plan, updated every day (the three-column board and the plank). Increment / Definition of Done / the Developers / a usable step toward the Product Goal, exists the moment an item is Done, only Done work is in it (the drone).

### 3.4 Events — "Five events, one of them a container."

A `bt-grid` table (`EVENTS`): The Sprint — whole Scrum Team — 1–4 weeks, same length every time — a Done Increment — the container for the other four, a new one starts the moment the last ends. Sprint Planning — whole Scrum Team — max 8 hours a month — Sprint Goal + Sprint Backlog — why/what/how, only the Developers decide how much. Daily Scrum — the Developers — 15 minutes every working day — a plan for the next 24 hours — not a status report. Sprint Review — Scrum Team + stakeholders — max 4 hours a month — a revised Product Backlog — not a sign-off. Sprint Retrospective — Scrum Team only — max 3 hours a month — one improvement into the next Sprint — the only event about the team. Aside: timeboxes are the Guide's maxima for a one-month Sprint; the studio's one-week Sprints scale Planning, Review and Retrospective to about a fifth; the Daily Scrum does not scale.

### 3.5 The loop — "One item, from the wall to the drone."

A seven-step `bt-flow` (`LOOP`): 1 the Product Owner orders the Product Backlog; 2 Sprint Planning pulls the top items into a Sprint Backlog (PO proposes why, Developers decide how much and how, team writes the Sprint Goal); 3 every day a fifteen-minute Daily Scrum (day 4: Ben raises the block, Sam clears it); 4 the work moves To Do → Doing → Done and each Done item bolts a part on at once; 5 the Sprint Review shows a real Increment to real stakeholders (Rain sensor card arrives, ordered above Lights); 6 the Retrospective picks one improvement, which becomes a green card in the next Sprint Backlog; 7 the next Sprint starts immediately — after three Sprints nine items are on the drone and two on the wall.

### Check yourself — six questions (`QUESTIONS`, answer index in brackets)

1. Why does Sam stand outside the circle at every Daily Scrum? [1] Because it is the Developers' event; the Scrum Master makes sure it happens and stays useful but does not run it. Distractors: not allowed in the room (they can be present); should run a parallel meeting with the PO (no parallel manager's standup); circle only for people with a card (Dee has no card and is in it).
2. Day three, a BLOCKED cube lands on Ben's desk. What next? [2] Ben raises it at the next Daily Scrum and the Scrum Master takes it away and clears it. Distractors: PO adds a replacement item (nobody adds work that risks the Goal); Ben works on something else and mentions it at the Review (the failure the Daily Scrum exists to catch); the team cancels the Sprint (only the PO can, only when the Goal is obsolete).
3. Where does the Rain sensor card go, and who decides? [0] Onto the Product Backlog in the position the Product Owner chooses. Distractors: straight into the current Sprint (the Sprint has ended; stakeholders don't put work into Sprints); automatically top of the next Sprint Backlog (decided at the next Planning); to the Scrum Master to judge worth (no say in what is built).
4. The drone gains a part on day two, three days before the Review. Right? [1] Yes — an Increment exists as soon as an item meets the Definition of Done. Distractors: only at the end of the Sprint when the Review approves it (the Review inspects Increments, does not create them); only because the PO accepted early (Done is the Developers' standard); parts should be batched for the Review (theatre).
5. Why does Sprint Planning take about two hours here rather than eight? [3] Eight hours is the maximum for a one-month Sprint and the studio runs one-week Sprints, so every timebox scales to about a fifth; only the Daily Scrum stays fixed. Distractors: experienced teams skip "how" (all three questions every time); two hours is the maximum for any event (Daily Scrum is 15 minutes, Planning can be 8 hours); the Scrum Master shortened it (keeps timeboxes, does not set them).
6. After three Sprints the speaker and solar skin are still on the wall. What does that tell you? [2] Nothing is wrong: a Product Backlog is never finished and the most valuable items were built first. Distractors: the project failed to deliver its scope (there was no fixed scope; a drone flew at every Review); the Developers were too slow (more than they can finish produces started, not Done); the PO should have written a smaller backlog (length is not a promise; order is).

Closing line: "Six for six means you can narrate the studio yourself, which is most of what the 60% case study asks when it says 'recommend Scrum and justify it'."

### Recap — "What the studio said" (`RECAP`)

1. Three accountabilities, and none of them is a manager. 2. Three artefacts, each with a commitment (Product Backlog → Product Goal, Sprint Backlog → Sprint Goal, Increment → Definition of Done). 3. Five events, and the timebox nobody scales (the Daily Scrum). 4. An Increment exists the moment an item is Done. 5. Feedback is the point of the loop (the Rain sensor card; a Review without stakeholders is a demo to yourselves). 6. The backlog is never finished. Footnote: facts follow the 2020 Scrum Guide by Ken Schwaber and Jeff Sutherland, free at scrumguides.org, eighteen pages.

### What's next

Step 02 "Scrum at interview depth" → `/project-methodologies`. Step — "Certify it" → `/jira-certifications`.

### Sign-off

"Find the moment it breaks." Run the studio once at 4× and watch the shapes; then at 1× ask, at every event, what would go wrong if the wrong person were in the room. Signed Yasas Sri Wickramasinghe, MBI804 lecturer, LinkedIn link.

## 3. UI & interaction design

Blend `CoursePage` on the `project` (plum) accent; nav pills 3.1–3.5, Check yourself, What's next. Hero uses `bt-herogrid` with the `HeroLoop` SVG in `bt-heroart`.

The studio (`.sst`) is a two-column grid: the stage (canvas, 62vh, 520–700px tall, rounded card, paper-coloured background `#f3e9df` with fog) and a 340px panel; the timeline of chips spans both columns beneath. Under 960px it stacks; the hover hint hides; the clock hides under 520px. No horizontal scroll at 400px.

Stage overlays: a dark status pill top-left ("Sprint 1 · day 4 of 5 · Daily Scrum", or the phase label outside Sprints); a translucent hint pill top-right ("drag to orbit · scroll to zoom · click anything"); a frosted transport bar at the bottom with previous-event, play/pause, next-event round buttons, a 1×/2×/4× speed group, a range scrubber over the full 4:12 and an `m:ss / m:ss` clock.

Timeline chips: groups "Start" (The studio, Product Backlog), "Sprint 1/2/3" (Planning, Day 1–5, Review, Retro — day chips jump to that day's Daily Scrum) and "End" (After three Sprints). The live group gets an accent border; the active chip is inverted (`aria-current="step"`).

The panel shows the narration (eyebrow, title, Who/Timebox/Output facts, body, accent-bordered "Watch for" box) or, when something is selected, its info (eyebrow, title, three facts, body, red-labelled "The trap", and a "Back to the narration" tertiary button). Clicking empty canvas deselects. Hovering a miniature or object shows a cursor and a larger billboard label ("Priya · Product Owner"); the selected miniature's shirt turns amber, a selected object tints plum-soft.

Motion: miniatures walk at 2.4 units/s with leg and arm swing and a bob; gestures per `Anim` (talk, nod, work, point, celebrate, clap, idle); cards ease to their slot with a small upward arc in flight; parts pop onto the drone with a slight overshoot; the impediment cube spins and bobs when raised; the Daily Scrum ring is a `RingGeometry` whose arc is rebuilt at 60 steps. Camera eases with exponential damping and snaps on a jump. The scene renders only while at least a quarter of the stage is on screen (`frameloop` switches to `never` otherwise) and starts playing the first time it scrolls into view, unless `prefers-reduced-motion` is set, in which case it starts paused.

## 4. Component & state architecture

- `ScrumStudio` holds a mutable `Sim` in a ref: `{ t, playing, speed, userUntil, world, snap, lastT }`. React state is only `t` (updated at most ~8 times a second by `onTick`), `playing`, `speed`, `visible` and `selected`. Play/pause, speed, scrub, chips and prev/next mutate the ref directly; a jump also rewrites `world` and sets `userUntil = 0` so the phase vantage takes the camera back.
- `Director` (inside the canvas, `useFrame` priority −10) advances `t` when playing, computes `snap` (a jump of more than 1.2 s, excluding the loop wrap), calls `deriveWorld(t)` into `sim.world`, throttles `onTick`, and eases `camera.position` toward `VANTAGE[phase]` (unless the reader orbited within the last 9 s) and `controls.target` toward `world.focus`, then `controls.update()`.
- `deriveWorld(t)` is pure. It finds the phase, computes `p`, derives which Sprints are done and therefore which parts exist, the location and slot of every card (`pile | backlog | todo | doing | done | hidden`), every actor's target position, facing yaw and animation, the impediment state (`none | on-desk | raised | gone`), the standup timer, the goal text/lit flag, the improvement card, the retro note, the camera focus and the drone hover amount.
- Every scene object reads `sim.current.world` in its own `useFrame` and eases toward it (or snaps when `sim.snap`). Objects that need React state for text (goal, improvement, retro note, countdown label, drone part list) diff the world value against local state and `setState` only on change.
- No Firestore, no analytics, no persistence. The quiz is Blend's `Quiz` (nothing stored). Scoring/badges: none.

## 5. Rebuild notes

- Keep `timeline.ts` the single source of truth for numbers and facts. `StudioScene.tsx` must contain no Scrum facts, only geometry and easing.
- Every in-scene `Text` must carry a local `font` (the `Text` wrapper in `StudioScene.tsx` does this) — drei's `Text` suspends the whole scene until the font resolves, and in a sandbox or offline classroom a CDN font never arrives and the canvas stays blank.
- Card planes sit at `CARD_Z = -3.29`, just in front of the boards' front faces (board centre `z − 0.07`, thickness 0.06). Move a board and the cards go with `SPOT`; move the boards' thickness and re-check the cards are not swallowed.
- The Retrospective board lives on the back-right wall (`SPOT.retroBoard`) facing −x so it is not in the Review camera's foreground. The Sprint Review vantage looks at the pedestal from the left-front so the stakeholders (who enter from `SPOT.door`, front-left) walk across the frame.
- The three.js bundle is the `vendor-three` chunk `vite.config.ts` already splits; the lesson's own chunk is ~50 kB. The lesson lazy-loads `ScrumStudio` so the text renders before the scene.
- WebGL failure is caught by `SceneBoundary` and replaced with a note pointing at the written sections and Lesson 2.
- The intro, backlog, work, review, retro and shipped vantages were tuned against screenshots at 1380×900 and 400px wide; a redesign of the set should re-check each phase's framing at both widths.
