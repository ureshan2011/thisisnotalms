# ER → Relational Mapping Explorer — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/er-mapping` (legacy alias `/er-to-relational` issues a `<Navigate replace>` redirect to `/er-mapping`; both route entries appear twice in `src/App.tsx`, once in the unauthenticated route block and once in the authenticated block, pointing at the same lazy-loaded component)
- **Source files:** `src/pages/ERMappingExplorerPage.tsx` (~1455 lines, single self-contained file — all rule data, worked-example data, and quiz banks are inline literals in this one file, no external data/JSON)
- **Depends on:** `src/components/ui/BrandMark.tsx` (logo mark used in hero and footer), `framer-motion` (`motion`, `AnimatePresence`, `useScroll`, `useTransform`, `Variants` — scroll-reveal, hero parallax, crossfades, progress bars), React `useState`/`useRef`. No Firestore reads/writes, no external links, nothing collected — the header comment states "Nothing is collected — it all runs in the browser." **Distinct from `ERMappingDeck.tsx`**, a separately-implemented **gated** slide-deck lesson covering the same ER→relational mapping topic, reachable only via the student Course Resources hub. That component is documented in a separate gated-lessons file elsewhere in `lesson-docs/`; this file documents only the public interactive explorer (`ERMappingExplorerPage.tsx`) and does not describe the deck's content.

## 1. Purpose & learning objectives

An interactive, scroll-driven public lesson (credited in-page to "Dr. Yasas Sri Wickramasinghe") that teaches how to convert an Entity-Relationship diagram into a relational database schema. The hero framing: "Every box, ellipse and diamond in an ER diagram maps to a specific relational structure. We'll walk through all eight mapping rules and build a real schema together — with live simulations you can play with. No sign-in, nothing collected."

By the end, a learner should be able to:
- State and apply all 8 ER→relational mapping rules (strong entities, composite attributes, multivalued attributes, 1:N relationships, M:N relationships, 1:1 relationships, weak entities, derived attributes).
- Decide where a foreign key belongs for each relationship cardinality (1:1, 1:N, M:N) and when a junction table is required.
- Classify any attribute (simple, composite, multivalued, derived) and know its correct schema treatment.
- Walk a full worked example (a university student/module/department/enrolment domain) from ER diagram to a complete 4-table schema.
- Recognise and avoid four classic mapping mistakes.
- Self-test via two graded interactive quizzes (a 5-scenario "Mapping Detective" and a 5-question true/false closer).

## 2. Full content

### 2.1 Hero section
- Eyebrow: "An interactive lesson · Dr. Yasas Sri Wickramasinghe"
- H1: "Let's make sense of ER → relational mapping." (second line gradient-styled, blue→indigo→purple)
- Subtext: "Every box, ellipse and diamond in an ER diagram maps to a specific relational structure. We'll walk through all eight mapping rules and build a real schema together — with live simulations you can play with. No sign-in, nothing collected."
- CTA buttons: "Explore the 8 rules" (scrolls to `#rules`), "Jump to the Cardinality Studio ›" (scrolls to `#cardinality`)
- Footer prompt: "Scroll to explore"

### 2.2 "The big picture" section
Eyebrow: "The big picture" · Title: "One pipeline, eight rules" · Sub: "Mapping isn't guesswork. You read the ER diagram, apply a deterministic set of rules to each construct, and out comes a clean set of relational tables."

Three cards:
1. 🗂️ **ER diagram** — "Entities, attributes and relationships, drawn in Chen's notation."
2. ⚙️ **8 mapping rules** — "A fixed recipe: each construct has exactly one correct relational form."
3. 🗄️ **Relational tables** — "Clean tables with primary keys and foreign keys, ready for SQL."

### 2.3 Simulation 1 — The 8 Rules Explorer (`#rules`)
Eyebrow: "Interactive · the main event" · Title: "The 8 Rules Explorer" · Sub: "Tap a rule to see the ER construct on the left turn into the exact relational table(s) on the right. These eight cover everything you'll meet in a diagram."

A rail of 8 buttons (Rule 1–8) selects the active rule; the ER diagram (left) and resulting table(s) (right) crossfade, joined by a "maps to →" pill, followed by a "💡 key idea" callout. Full content of every rule:

**Rule 1 — Strong entity → Table**
- Description: "Each strong entity becomes a table. Every simple attribute becomes a column, and the key attribute becomes the **PRIMARY KEY**."
- ER: STUDENT entity with key attribute `StudentId` and simple attributes `FirstName`, `LastName`.
- Resulting table: `STUDENT(student_id INT PK, first_name VARCHAR(50), last_name VARCHAR(50))`
- Key idea: "Entity name → table · key attribute → PRIMARY KEY."

**Rule 2 — Composite attribute → Flatten**
- Description: "A composite attribute is never stored as one column. Each sub-attribute becomes its own column; the parent exists only in the diagram."
- ER: CUSTOMER entity with composite attribute `Address` made of `street`, `city`, `postcode`.
- Resulting table: `CUSTOMER(customer_id INT PK, street_name VARCHAR(100), city VARCHAR(60), post_code VARCHAR(10))` — note: "No single 'address' column — it is flattened"
- Key idea: "Break the composite into one column per sub-attribute."

**Rule 3 — Multivalued attribute → New table**
- Description: "A multivalued attribute (double ellipse) becomes its **own table** holding the value plus a foreign key back to the entity. The PK is composite."
- ER: MEMBER entity with multivalued attribute `PhoneNumber`.
- Resulting tables: `MEMBER(member_id INT PK, member_name VARCHAR)` and `MEMBER_PHONE(member_id INT PK/FK→MEMBER, phone_number VARCHAR PK)` — note: "PK = (member_id, phone_number)"
- Key idea: "Each repeating value gets its own row in a new table."

**Rule 4 — 1:N relationship → FK on the N-side**
- Description: "The primary key of the 'one' entity is added as a **foreign key** in the 'many' entity's table. No new table is needed."
- ER: DEPARTMENT (1) —employs→ (N) EMPLOYEE
- Resulting tables: `DEPARTMENT(dept_id INT PK, dept_name VARCHAR(80))` and `EMPLOYEE(employee_id INT PK, first_name VARCHAR, dept_id INT FK→DEPARTMENT)` — note: "FK lives on the many-side"
- Key idea: "The FK always goes on the MANY side."

**Rule 5 — M:N relationship → Junction table**
- Description: "A many-to-many relationship needs a new **junction (bridge) table** holding both entities' keys as foreign keys. Relationship attributes (like Grade) live here."
- ER: STUDENT (M) —enrols→ (N) MODULE, with "Grade ◆ on the relationship"
- Resulting tables: `STUDENT(student_id INT PK, first_name)`, `MODULE(module_code VARCHAR PK, module_name)`, and junction `ENROLMENT(student_id INT PK/FK→STUDENT, module_code VARCHAR PK/FK→MODULE, grade DECIMAL(4,2))` — note: "PK = (student_id, module_code)"
- Key idea: "M:N always becomes a third, junction table."

**Rule 6 — 1:1 relationship → FK choice**
- Description: "Add the foreign key in **either** table — best on the total-participation (mandatory) side. If both always co-exist, you may merge them into one table."
- ER: EMPLOYEE (1) —assigned→ (1) COMPANY_CAR
- Resulting tables: `EMPLOYEE(employee_id INT PK, employee_name)` and `COMPANY_CAR(car_reg VARCHAR PK, car_model VARCHAR, employee_id INT FK→EMPLOYEE)` — note: "FK on the total-participation side"
- Key idea: "FK on the mandatory side — or merge if always together."

**Rule 7 — Weak entity → Composite PK**
- Description: "A weak entity becomes a table whose primary key is its partial key *plus* the identifying entity's key (which doubles as a foreign key)."
- ER: BUILDING —located_in (weak relationship)→ ROOM (weak entity), note: "RoomNo is only a partial key"
- Resulting tables: `BUILDING(building_id INT PK, building_name)` and `ROOM(building_id INT PK/FK→BUILDING, room_no INT PK, room_type VARCHAR)` — note: "PK = (building_id, room_no)"
- Key idea: "Partial key + owner key → composite primary key."

**Rule 8 — Derived attribute → Do NOT store**
- Description: "Derived attributes (dashed ellipse) are calculated from other data. They are **not stored** — they go stale and waste space. Compute them in a query instead."
- ER: EMPLOYEE entity with derived attribute `age`.
- Resulting table: `EMPLOYEE(employee_id INT PK, date_of_birth DATE)` — note: "no 'age' column" — plus a "Compute at query time" callout with sample SQL:
  ```sql
  SELECT DATEDIFF(YEAR, date_of_birth,
    GETDATE()) AS age
  FROM EMPLOYEE
  ```
- Key idea: "If it can be calculated, don't store it."

### 2.4 Simulation 2 — The Cardinality Studio (`#cardinality`)
Eyebrow: "Interactive · relationships" · Title: "The Cardinality Studio" · Sub: "The trickiest part of mapping is relationships. Flip between 1:1, 1:N and M:N and watch where the foreign key lands — and when a whole new junction table appears."

A three-way segmented control (1:1 / 1:N / M:N) swaps the entity pair, ER diagram, blurb and resulting schema:

- **1:1** — PERSON (1) —holds→ (1) PASSPORT. Blurb: "Each person holds one passport and each passport belongs to one person. Put the foreign key on the **total-participation side** (every passport must have an owner), or merge the two if they always co-exist." Indicator: "🔗 One FK is added to either side." Tables: `PERSON(person_id INT PK, full_name VARCHAR)`, `PASSPORT(passport_no VARCHAR PK, expiry_date DATE, person_id INT FK→PERSON)` — note "one FK, on either side".
- **1:N** — DEPARTMENT (1) —employs→ (N) EMPLOYEE. Blurb: "One department employs many employees, but each employee belongs to one department. Add the department's key as a **foreign key on the many-side** — no extra table required." Indicator: "🔗 One FK is added to the many-side." Tables: `DEPARTMENT(dept_id INT PK, dept_name VARCHAR)`, `EMPLOYEE(employee_id INT PK, first_name VARCHAR, dept_id INT FK→DEPARTMENT)` — note "FK on the N-side".
- **M:N** — STUDENT (M) —enrols→ (N) MODULE. Blurb: "A student takes many modules and a module has many students — a single FK can't express this. Create a **junction table** with both keys, and any relationship data (like the grade) lives there." Indicator: "🔀 A new junction table is created." Tables: `STUDENT(student_id INT PK, first_name)`, `MODULE(module_code VARCHAR PK, module_name)`, junction `ENROLMENT(student_id INT PK/FK→STUDENT, module_code VARCHAR PK/FK→MODULE, grade DECIMAL(4,2))` — note "new junction table".

### 2.5 Simulation 3 — Attribute Mapper ("Build the table, attribute by attribute")
Eyebrow: "Interactive · attributes" · Title: "Build the table, attribute by attribute" · Sub: "Attributes come in flavours — simple, composite, multivalued and derived — and each maps differently. Classify each one and watch the STUDENT schema assemble itself."

Intro line: "For each attribute of **STUDENT**, choose how it maps into the schema."

Four possible mapping actions (buttons) for every attribute: "One column", "Flatten into several columns", "New table + FK", "Don't store (compute it)".

Five attributes to classify, each with an ER type label, the correct action, and a hint revealed once solved:

| Attribute | ER type | Correct action | Hint |
|---|---|---|---|
| StudentId | key attribute | One column | "A simple key — one column, and it becomes the PRIMARY KEY." |
| Name (First, Last) | composite | Flatten into several columns | "Composite attributes flatten into one column per part." |
| DateOfBirth | simple | One column | "A plain simple attribute — just one column." |
| Age | derived | Don't store (compute it) | "Derived from DateOfBirth — never stored, computed in queries." |
| PhoneNumbers | multivalued | New table + FK | "Multivalued attributes move to their own table with a FK." |

Picking the wrong action shows "Not quite — try another mapping." in red on that attribute's card and does not lock it; picking correctly marks it "✓ mapped" (green) and locks in the hint text. A live "Schema so far" panel on the right assembles the `STUDENT` table column-by-column as each attribute is solved correctly (student_id is always present; first_name/last_name appear once Name is solved; date_of_birth once DateOfBirth is solved), a separate `STUDENT_PHONE(student_id INT PK/FK→STUDENT, phone_number VARCHAR PK)` table animates in once PhoneNumbers is solved (labelled "from the multivalued attribute"), and a dashed note-box "age is computed in queries — not stored" appears once Age is solved. When all five are mapped correctly: "🎉 Schema complete — every attribute mapped correctly."

### 2.6 Simulation 4 — Schema Builder (worked university example)
Eyebrow: "Interactive · worked example" · Title: "Map a university enrolment diagram" · Sub: "Put the rules together on a real example. Step through entities, a composite address, a 1:N link and an M:N enrolment to reach the complete four-table schema."

A 4-step, tabbed, forward/back-navigable walkthrough ("‹ Back" / "Next step ›" / final "Schema complete", with a "Step X of 4" counter):

**Step 1 — Entities (Rule 1)**
Blurb: "Three strong entities — STUDENT, MODULE and DEPARTMENT — each become a table with its key as PRIMARY KEY."
Tables shown:
- `STUDENT(student_id INT PK, first_name, last_name)`
- `MODULE(module_code VARCHAR PK, module_name, credits INT)`
- `DEPARTMENT(dept_id INT PK, dept_name)`

**Step 2 — Composite address (Rule 2)**
Blurb: "STUDENT has a composite Address. It flattens into street_name, city and post_code columns on STUDENT."
Tables shown:
- `STUDENT(student_id INT PK, first_name, last_name, street_name, city, post_code)` — note "Address flattened"
- `MODULE(module_code VARCHAR PK, module_name, credits INT)` (unchanged)
- `DEPARTMENT(dept_id INT PK, dept_name)` (unchanged)

**Step 3 — 1:N DEPT→MODULE (Rule 4)**
Blurb: "A department offers many modules (1:N). MODULE — the many-side — gets a dept_id foreign key."
Tables shown:
- `STUDENT(student_id INT PK, …)` (collapsed placeholder)
- `MODULE(module_code VARCHAR PK, module_name, credits INT, dept_id INT FK→DEPARTMENT)` — note "FK added on the N-side"
- `DEPARTMENT(dept_id INT PK, dept_name)`

**Step 4 — M:N enrolment (Rule 5)**
Blurb: "Students enrol in many modules and vice-versa (M:N), and we track a grade. That needs a junction table, ENROLMENT."
Tables shown:
- `STUDENT(student_id INT PK, …)`
- `MODULE(module_code VARCHAR PK, dept_id INT FK→DEPARTMENT)`
- `DEPARTMENT(dept_id INT PK, dept_name)`
- `ENROLMENT(student_id INT PK/FK→STUDENT, module_code VARCHAR PK/FK→MODULE, grade DECIMAL(4,2))` — note "PK = (student_id, module_code)"

The final schema after all 4 steps is the complete four-table university schema: STUDENT, MODULE, DEPARTMENT, ENROLMENT.

### 2.7 Common mistakes section
Eyebrow: "Watch out" · Title: "Four classic mistakes" · Sub: "Most mapping errors come down to these. Here's the wrong move and the fix for each."

Four wrong/right cards:
1. ❌ "Storing a derived 'age' column that goes stale every birthday." → ✅ "Store date_of_birth and compute age with DATEDIFF() when needed."
2. ❌ "One 'address VARCHAR(200)' column for a composite Address." → ✅ "Flatten into street_name, city and post_code — each queryable."
3. ❌ "Putting both FKs of an M:N inside one of the entity tables." → ✅ "Always create a junction table holding both foreign keys."
4. ❌ "Adding the FK on the '1' side of a 1:N relationship." → ✅ "The FK always lives on the many-side of a 1:N."

### 2.8 Simulation 5 — Mapping Detective (scenario quiz)
Eyebrow: "Interactive · put it together" · Title: "Mapping Detective" · Sub: "Read each scenario and pick the correct mapping. This is exactly the reasoning you'll use designing real schemas."

Five multiple-choice scenarios, single-select, immediate feedback with explanation, running score, and a results screen with reset:

1. **Scenario:** "A CUSTOMER can place many ORDERs; each ORDER is placed by exactly one CUSTOMER."
   Options: "Add customer_id FK to ORDER" *(correct)*, "Add order_id FK to CUSTOMER", "Create a junction table", "Merge into one table"
   Explanation: "This is 1:N. The FK goes on the many-side, so ORDER gets a customer_id foreign key."

2. **Scenario:** "A STUDENT takes many COURSEs and a COURSE has many STUDENTs; each enrolment has a grade."
   Options: "Add course_id FK to STUDENT", "Create a junction table with a grade column" *(correct)*, "Add a grades list column", "Merge STUDENT and COURSE"
   Explanation: "M:N with a relationship attribute → a junction table ENROLMENT(student_id, course_id, grade)."

3. **Scenario:** "EMPLOYEE has a composite attribute FullName made of FirstName and LastName."
   Options: "One column full_name VARCHAR(200)", "A new FULLNAME table", "Separate first_name and last_name columns" *(correct)*, "Don't store it"
   Explanation: "Composite attributes are flattened: one column per sub-attribute, so first_name and last_name."

4. **Scenario:** "ROOM only exists inside a BUILDING, and RoomNo repeats across different buildings."
   Options: "PK = room_no only", "PK = (building_id, room_no)" *(correct)*, "Give ROOM its own surrogate key only", "Store rooms as a column on BUILDING"
   Explanation: "ROOM is a weak entity. Its PK is the partial key plus the owner's key: (building_id, room_no)."

5. **Scenario:** "EMPLOYEE has a derived attribute yearsOfService, calculated from hire_date."
   Options: "Store years_of_service INT", "Compute it in queries; store only hire_date" *(correct)*, "Put it in a new table", "Make it the primary key"
   Explanation: "Derived attributes aren't stored — they go stale. Keep hire_date and compute the value when needed."

Results screen: shows score out of 5 with an emoji tier (🕵️ for a perfect 5/5, 🎯 for ≥3, 📚 otherwise), message ("Flawless — you can map any ER construct on sight." for a perfect score, otherwise "Good work. Replay the Rule Explorer and try again."), and a "Try again" button that resets index/score/picked state.

### 2.9 Quick reference section
Eyebrow: "At a glance" · Title: "The 8 rules, side by side" · Sub: "One line per rule — the construct and what it becomes."

A grid of all 8 rules, each showing its number, title, and "key idea" one-liner (the same title/key strings as in section 2.3 above, rules 1–8 in order).

### 2.10 Simulation 6 — Closing true/false quiz
Eyebrow: "Check yourself" · Title: "Five quick questions" · Sub: "See how much of the lesson stuck."

Five true/false questions, single-select, immediate feedback with explanation, running score, results screen with reset:

1. **Q:** "In a 1:N relationship, the foreign key goes on the 'many' side." **A:** True. **Explanation:** "The many-side stores one FK pointing back to the single related row."
2. **Q:** "A multivalued attribute can be stored as a comma-separated column." **A:** False. **Explanation:** "It must become its own table with a FK — comma lists break atomicity."
3. **Q:** "Every M:N relationship needs its own junction table." **A:** True. **Explanation:** "A single FK can't express many-to-many, so a bridge table is mandatory."
4. **Q:** "A composite attribute becomes one column named after the parent." **A:** False. **Explanation:** "It is flattened — one column per sub-attribute, no parent column."
5. **Q:** "Derived attributes should generally not be stored as columns." **A:** True. **Explanation:** "They go stale; compute them from stored data at query time instead."

Results screen: score out of 5 with emoji tier (🏆 for a perfect 5/5, 🎯 for ≥3, 📚 otherwise) and message: "Perfect — the mapping rules have clearly clicked." (5/5), "Nice work. Revisit the Rule Explorer to firm up the rest." (≥3), or "Good start. Replay the simulations above, then try again." (otherwise). "Try again" button resets all state.

### 2.11 Footer
Brand mark + "Not a LMS" wordmark, then: "An ER-to-Relational mapping lesson, put together by Dr. Yasas Sri Wickramasinghe." and "Everything here runs in your own browser. No personal data is collected or stored."

## 3. UI & interaction design

- **Visual language:** Apple-styled marketing/course-site aesthetic shared with the XR Explorer and Normalisation lessons — `APPLE_FONT` stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif`), white/`#f5f5f7` alternating section backgrounds, large tracked-tight headings (32–88px), muted grey body text (`#6e6e73`/`#424245`/`#86868b`), rounded-full pill buttons in `#0071e3` (Apple blue).
- **Semantic colour palette** (`C` constant): `pk`/primary `#0071e3` (blue), `fk` `#bf5af2` (purple/magenta), `entity` `#5e5ce6` (indigo), `rel` `#ff9f0a` (orange, for relationship diamonds), `good` `#30d158` (green, correct/success), `bad` `#ff375f` (red/pink, incorrect).
- **Navigation model:** long-form vertical scroll-reveal page (single route, no tabs/deck), 11 stacked `<section>`s alternating white/`#f5f5f7` backgrounds. Two in-page anchors (`#rules`, `#cardinality`) are jumped to via a custom `scrollToSection()` helper using `document.getElementById(id)?.scrollIntoView({behavior:'smooth'})` rather than URL hash navigation — explicitly because "the app runs under HashRouter" and changing `location.hash` would conflict with routing.
- **Animation:** `framer-motion` throughout — `Reveal` wrapper (opacity/y fade-in on `whileInView`, `viewport={{once:true, margin:'-80px'}}`, 0.8s duration, custom `EASE = [0.16,1,0.3,1]`), `stagger`/`item` variants for staggered card grids (0.09s stagger), `AnimatePresence mode="wait"` crossfades when switching active rule/cardinality/step/attribute-schema, animated progress bars in both quizzes, `layout` animation on the Attribute Mapper's live schema card, and a scroll-driven hero: `useScroll`/`useTransform` scale the hero content down to 0.86, fade it out, and translate it 120px on scroll (parallax pinned to `heroRef`).
- **ER diagram primitives** are hand-drawn components, not an external diagramming library: `Entity` (rounded-rect box, double-bordered "weak" variant for weak entities), `Attr` (pill with `kind` variants: `simple` solid border, `key` underlined+bold, `multi` bracketed `{...}` styling, `derived` dashed border, `composite` filled grey), `Diamond` (rotated 45° square styled as a diamond, with a double-ring "weak" variant for identifying relationships), and `TableCard` (schema-view relational table: colored header bar with table name, rows per column showing 🔑 for PK / 🔗 for FK, monospace column names/types, optional footer note).
- **Responsive behavior:** Tailwind responsive classes throughout (`sm:`/`md:`/`lg:` breakpoints); rule rail collapses from 8 columns (`lg:grid-cols-8`) to 4 (`sm:grid-cols-4`) to 2 (base); worked-example step tabs and cardinality segmented control are full-width flex rows; Attribute Mapper switches from a 2-column (`md:grid-cols-[1.1fr_0.9fr]`) to single-column stack below `md`; hero headline scales from 44px to 72px to 88px across breakpoints.
- **Interaction feedback conventions** (consistent across all 3 interactive quizzes/checks — Attribute Mapper, Mapping Detective, closing Quiz): correct selections turn green (`#30d158` family) and lock; incorrect selections flash red (`#ff375f`/`#d70015` family) with a "Not quite" message and remain re-triable (Attribute Mapper) or are locked with the reveal (Mapping Detective, Quiz — one attempt per question, then explanation shown and a "Next" button appears).

## 4. Component & state architecture

Single default-export function component `ERMappingExplorerPage()`, composed of one page shell plus 6 self-contained "simulation" sub-components, each with fully local `useState` — there is no shared/lifted state, no context, and no Firestore/network I/O anywhere in the file (fully client-side, "nothing collected").

- **Page shell:** `heroRef` (`useRef<HTMLDivElement>`), `useScroll({target: heroRef, offset:['start start','end start']})` driving `heroScale`/`heroOpacity`/`heroY` via `useTransform`.
- **`RuleExplorer` (Simulation 1):** `active: number` (index into `RULES`, default 0) selects which `RuleDef` is displayed; `RULES: RuleDef[]` is a static array of 8 objects each with `{n, short, title, desc, er, tables, key}` where `desc`/`er` are JSX and `tables` is a function returning JSX (see §2.3).
- **`CardinalityStudio` (Simulation 2):** `card: Card` (`'1:1'|'1:N'|'M:N'`, default `'1:N'`) indexes into the static `CARD_DATA` record (see §2.4).
- **`AttributeMapper` (Simulation 3):** `done: Record<string, boolean>` tracks which of the 5 `ATTR_QS` entries have been correctly classified; `wrong: {id, action} | null` tracks the most recent incorrect guess (for the red-flash feedback, cleared on any correct answer). `handle(q, action)` is a no-op if already done; else sets `done[q.id]=true` on match or sets `wrong` on mismatch. Derived (not stored) state: `cols: Col[]` for the live STUDENT table is rebuilt each render from `done.name`/`done.dob`; `allDone = ATTR_QS.every(q => done[q.id])`.
- **`SchemaBuilder` (Simulation 4):** `step: number` (0–3, default 0) indexes into static `BUILD_STEPS: BuildStep[]` (see §2.6); Back/Next buttons clamp with `Math.max`/`Math.min`.
- **`MappingDetective` (Simulation 5):** `idx` (current case 0–4), `picked: number|null` (chosen option index, null = unanswered), `score`, `doneAll: boolean`. `choose(i)` is a no-op once `picked!==null`; increments `score` if `i===c.answer`. `next()` advances `idx` or sets `doneAll` at the end. `reset()` zeroes all four. Static data `MCASES: MCase[]` (see §2.8).
- **`Quiz` (Simulation 6):** identical shape to `MappingDetective` but boolean-answer: `idx`, `answer: boolean|null`, `score`, `done`. Static data `QUIZ` (see §2.10).
- **Shared presentational primitives (no state):** `Reveal`, `SectionHead`, `Pill`, `TableCard` (+ `Col` interface: `{name, type?, pk?, fk?}`), `Entity`, `Attr`, `Diamond`.
- **Static content constants module-scope:** `RULES` (8 rules), `CARD_DATA` (3 cardinality cases), `ATTR_QS` (5 attribute questions), `BUILD_STEPS` (4 worked-example steps), `MCASES` (5 detective scenarios), `QUIZ` (5 T/F questions), `MISTAKES` (4 wrong/right pairs) — all defined inline in this file, no imports from a shared content/data layer.
- No gating, unlock, scoring-persistence, or badge-award logic — all quiz scores are ephemeral component state, reset on `reset()` or on page reload/navigation.

## 5. Rebuild notes

- **This file documents only the public interactive explorer** (`src/pages/ERMappingExplorerPage.tsx`, route `/er-mapping`). A **separate, differently-implemented, gated** slide-deck component, `ERMappingDeck.tsx`, covers the same ER-to-relational-mapping subject matter but is reached only through the logged-in Course Resources hub (per `lesson-docs/README.md`'s gating legend, "several lessons exist in both forms... sometimes as two genuinely different implementations (e.g. ER Mapping has a public interactive explorer *and* a separate gated slide deck covering the same material)"). That deck is documented in its own file elsewhere in `lesson-docs/mbi802/`; it was not read or transcribed for this document, and its content should not be assumed to match what's transcribed above.
- The two `/er-mapping` `<Route>` registrations in `src/App.tsx` (lines ~100 and ~185, one in each of an unauthenticated and authenticated route block) both point at the same lazy-loaded `ERMappingExplorerPage` — there is no gating difference between them for this route.
- `/er-to-relational` is a legacy alias that redirects (`<Navigate to="/er-mapping" replace>`) to the canonical route; a rebuild should preserve this redirect for old links.
- No external links appear anywhere in this component (no docs, videos, or off-site references to revalidate).
- No image/SVG/video assets are referenced beyond `BrandMark` (a React component, not a static asset file).
- All ER-diagram visuals are drawn with plain CSS/JSX primitives (rotated squares for diamonds, bordered boxes/pills for entities/attributes) — there is no diagramming library dependency (e.g. no mermaid, no SVG diagram files) to reproduce; a rebuild can reimplement `Entity`/`Attr`/`Diamond`/`TableCard` directly as shown in §3.
- The component is registered for lazy-loading (`lazy(() => import('./pages/ERMappingExplorerPage'))`) and wrapped in `<Suspense fallback={null}>` at the route level — no loading skeleton is shown, matching sibling lesson pages' pattern.
- No ambiguity was found in the transcribed content; all rule text, worked-example data, and quiz Q&A/explanations above are transcribed verbatim from the source literals.
