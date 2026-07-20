# ER to Relational Schema Mapping (Slide Deck) — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Gated (student/staff login required). Unlocked as soon as a student is enrolled in
  MBI802 — this lesson's `id` (`'er-mapping'`) is **not** included in `CourseResources.tsx`'s
  `gated` check (`['normalization', 'quiz'].includes(lesson.id)`), so unlike the Normalization
  slide deck and the DBMS Knowledge Check quiz, it does not require passing the ER MCQ first.
  **Important distinction:** this is a *different implementation* from the public,
  non-gated `/er-mapping` route (`src/pages/ERMappingExplorerPage.tsx`), which is a separate,
  scroll-reveal interactive explorer covering similar subject matter with its own simulations.
  The two share no code. This doc covers **only** the gated 23-slide deck embedded in Course
  Resources; the public explorer is documented in its own separate lesson-docs file and is out of
  scope here.
- **Route(s):** `/student/course-resources` (no dedicated route of its own — rendered inline as a
  lesson row on the MBI802 tab; lesson `id: 'er-mapping'`). Do not confuse with the public,
  standalone `/er-mapping` route, which renders `ERMappingExplorerPage.tsx`, a wholly separate
  component.
- **Source files:**
  - `src/components/slides/ERMappingDeck.tsx` — the entire lesson (deck data, slide markup,
    flashcards, player component) lives in this one file (1529 lines).
  - `src/pages/student/CourseResources.tsx` — wiring only: imports `ERMappingDeck` (line 35),
    declares the lesson metadata entry (`id: 'er-mapping'`, lines 199–205), and mounts the
    component at `{lesson.id === 'er-mapping' && <ERMappingDeck />}` (line 1766).
- **Depends on:**
  - `lucide-react` icons: `ChevronLeft`, `ChevronRight`, `Maximize2`, `Minimize2`, `Maximize`,
    `Minimize`.
  - Google Fonts `DM Sans` and `DM Mono`, loaded via an `@import` inside the component's injected
    `<style>` tag (`DECK_CSS`), pointed at
    `https://fonts.googleapis.com/css2?family=DM+Sans:...&family=DM+Mono:...&display=swap`.
  - No Firestore reads/writes, no external data APIs, no props passed in from the parent — fully
    self-contained and stateless with respect to the backend.
  - Shares no code with `ERMappingExplorerPage.tsx` (the public `/er-mapping` explorer) or with
    the other MBI802 slide decks (`ERDiagramsDeck`, `ERDiagramActivitiesDeck`,
    `ERAdvancedConceptsDeck`, `ERAttributeConstraintsDeck`) beyond following the same "giant
    inline-HTML slide array + fixed 1920×1080 canvas" pattern used across that deck family.

## 1. Purpose & learning objectives

This is Lesson 5 of the ER Diagrams series ("Lesson 5 of 5" per the title slide's subtitle) and
teaches students how to translate a completed ER diagram into a working relational (SQL) schema:
tables, columns, primary keys, and foreign keys. It is the capstone of the ER modeling unit — it
assumes students already know how to *draw* an ER diagram (from the earlier ER Diagrams, ER
Attributes, and ER Advanced Concepts lessons) and now teaches the deterministic rule-based
procedure for *converting* that diagram into an implementable database schema.

The deck's explicit learning objectives (from its own agenda slide) are:

1. **The Mapping Process** — understand the ER-to-relational pipeline and why a deterministic set
   of rules makes schema design reliable, not ad hoc.
2. **8 Mapping Rules** — learn one rule per ER construct: strong entity, composite attribute,
   multivalued attribute, 1:N relationship, M:N relationship, 1:1 relationship, weak entity, and
   derived attribute.
3. **Activities** — apply the rules to a fully worked university enrolment example, then
   independently to a practice exercise (an EMPLOYEE–PROJECT staffing scenario), with a full
   answer key provided.

The deck ends by explicitly stating the takeaway that a student who has completed it "can now
translate any ER diagram into a full relational schema," and closes with a set of 12 flashcards
(rendered as a separate reviewable widget below the deck, not as slides) intended for spaced
review of the 8 rules and supporting concepts.

**IMPORTANT — separate from the public explorer:** `ERMappingExplorerPage.tsx` (route
`/er-mapping`, listed in the platform's public core lessons) covers overlapping subject matter
(ER→relational mapping, the same 8-ish rule set, a worked example) but is a **genuinely different
implementation**: it is built as an Apple-styled, `framer-motion` scroll-reveal single page with
its own interactive simulations (its header comment describes "several interactive simulations,"
its own semantic color constants `C = { pk, fk, entity, rel, good, bad }`, and its own `TableCard`
/ `Reveal` / `SectionHead` component set), not a slide deck. `ERMappingDeck.tsx` is a fixed
1920×1080 slide-deck player with manual next/prev navigation, a completely different visual
language (dark violet/indigo gradient background, `DM Sans`/`DM Mono` fonts, raw
`dangerouslySetInnerHTML` slide markup) and no `framer-motion` dependency at all. They are
maintained as two independent files with no shared components, and a rebuild must not conflate
them or merge their content.

## 2. Full content

The deck is a fixed array of 23 slide objects (`SLIDES`), each with a `classes` string (CSS class
for slide-specific styling), a `label` (internal/debug label shown in the UI, e.g. `"05 Rule 1 —
Strong Entity → Table"`), and an `html` string of raw markup rendered via
`dangerouslySetInnerHTML`. Below is the full content of every slide in order, followed by the 12
flashcards.

### Slide 01 — Title

- Eyebrow: "DATABASE MANAGEMENT SYSTEMS · MBI802"
- Heading: "ER to Relational" / "Schema Mapping" (second line in violet accent color)
- Subtitle: "Lesson 5 of 5 · Translating ER diagrams into database tables"
- Background decoration: a large faint "ER→SQL" watermark text and two soft radial-gradient
  circles.
- Footer credit line (appears on every slide): "© All Rights Reserved by Yasas Sri
  Wickramasinghe"

### Slide 02 — Agenda ("What You'll Learn")

Eyebrow: "What you will learn". Three numbered agenda cards:

1. **The Mapping Process** — "ER diagrams → relational model overview — why a deterministic set
   of rules makes schema design reliable"
2. **8 Mapping Rules** — "Strong entity, composite attribute, multivalued, 1:N, M:N, 1:1, weak
   entity, derived attribute"
3. **Activities** — "Worked university enrolment example + practice exercise
   (EMPLOYEE–PROJECT) with full answer"

### Slide 03 — The Big Picture

Eyebrow: "THE MAPPING PIPELINE". Heading: "From ER Diagram to Relational Tables". A three-step
horizontal pipeline diagram:

- **Step 1 — ER Diagram**: a small SVG showing a STUDENT entity box with StudentId and FirstName
  attribute ellipses and an `enrols` relationship diamond. Caption: "Entities, attributes, and
  relationships drawn using Chen's notation."
- Arrow labeled "Apply Rules" (▶)
- **Step 2 — 8 Mapping Rules**: a list of all 8 rules shown as compact rows:
  1. Strong Entity → Table
  2. Composite Attr → Flatten
  3. Multivalued → New Table
  4. 1:N → FK on N-side
  5. M:N → Junction Table
  6. 1:1 → FK Choice
  7. Weak Entity → Composite PK
  8. Derived → Do Not Store
- Arrow labeled "Result" (▶)
- **Step 3 — Relational Tables**: a small SVG mock of a STUDENT table (student_id PK, first_name,
  last_name) with a partial ENROLMENT table beneath it. Caption: "Clean, normalised SQL tables
  ready for implementation."
- Closing line: "Every construct in an ER diagram maps to a specific relational structure by
  following deterministic rules."

### Slide 04 — Section Break: The 8 Rules

Watermark "01". Eyebrow: "THE MAPPING RULES". Heading: "8 Rules to Transform / Any ER Diagram".
Subtitle: "Each rule handles a different ER construct".

### Slide 05 — Rule 1: Strong Entity → Table

Section header: "Mapping Rules". Badge: "Rule 1". Heading: "Strong Entity → Table".

> Description: "Each **strong entity** type becomes a **relational table**. Every simple
> attribute becomes a column. The key attribute becomes the **primary key (PK)**."

Three numbered step cards:
1. "Entity name → **Table name**"
2. "Each attribute → **Column**"
3. "Key attribute → **PRIMARY KEY**"

Right-side diagram: an ER diagram of a STUDENT entity with attributes StudentId (underlined key),
FirstName, LastName, DateOfBirth, mapped via a "Maps to →" arrow to a STUDENT relational table
with columns `student_id` (INT, PRIMARY KEY), `first_name` (VARCHAR(50)), `last_name`
(VARCHAR(50)), `date_of_birth` (DATE).

### Slide 06 — Rule 2: Composite Attribute → Flatten

Badge: "Rule 2". Heading: "Composite Attribute → Flatten".

> Description: "A **composite attribute** is NOT stored as a single column. Instead, **each
> sub-attribute becomes its own column**. The composite parent is discarded — it exists only in
> the ER diagram, not in the table."

Warning card: "**NEVER** create a column called `address` or `name` if it is composite in the ER
diagram. Break it into its parts."

Example chips: "Address → street_name, city, post_code" and "Name → first_name, last_name".

Right-side diagram: a CUSTOMER entity with a composite Address attribute (sub-attributes
StreetName, City, PostCode) mapped to a CUSTOMER table with columns `customer_id` (PK),
`street_name`, `city`, `post_code` — with an explicit crossed-out "❌ WRONG" `address` column shown
struck through to illustrate the mistake to avoid, and a "❌ No 'address' column!" annotation on
the arrow, plus a brace labeled "Flattened from Address".

### Slide 07 — Rule 3: Multivalued Attribute → New Table

Badge: "Rule 3". Heading: "Multivalued Attribute → New Table".

> Description: "A **multivalued attribute** (drawn as double ellipse) creates a **new table**.
> The new table has: the multivalued attribute as a column, a foreign key to the original entity,
> and a composite primary key."

Three numbered step cards:
1. "Create a new table named after the attribute"
2. "Add the original entity's PK as a **FK**"
3. "PK = **(entity_pk + attribute_value)** — composite"

Right-side diagram: a MEMBER entity with a double-ellipse `{PhoneNumber}` multivalued attribute,
mapped to two tables: MEMBER (`member_id` PK, `member_name`) and MEMBER_PHONE (`member_id`
PK+FK, `phone_number` PK), with a caption "PK = (member_id + phone_number) — composite".

### Slide 08 — Rule 4: 1:N Relationship → FK on N-side

Badge: "Rule 4". Heading: "1:N Relationship → FK on N-side".

> Description: "In a 1:N relationship, the **primary key of the '1' entity** is added as a
> **foreign key in the 'N' entity's table**. No new table is needed."

Tip card: "Memory tip: The FK always goes to the **MANY side** — where there are many instances,
each pointing back to one."

Example rows:
- "DEPARTMENT (1) ── employs ──► EMPLOYEE (N) → dept_id FK added to EMPLOYEE table"
- "CUSTOMER (1) ── places ──► ORDER (N) → customer_id FK added to ORDER table"

Right-side diagram: DEPARTMENT (1) —employs→ EMPLOYEE (N) in ER notation, mapped to a DEPARTMENT
table (`dept_id` PK, `dept_name`) and an EMPLOYEE table (`employee_id` PK, `first_name`,
`dept_id` FK → DEPARTMENT), with a dashed FK-reference arrow between them.

### Slide 09 — Rule 5: M:N Relationship → Junction Table

Badge: "Rule 5". Heading: "M:N Relationship → Junction Table".

> Description: "A **many-to-many relationship** cannot be represented with a single FK. Instead,
> create a **new junction (bridge) table** containing the PKs of BOTH entities as foreign keys.
> Relationship attributes become columns in this table."

Step card: "The junction table's PK is typically the **combination of both FKs** (composite PK)."

Tip card: "Example: STUDENT enrolls in MODULE — the Grade attribute belongs to the ENROLMENT
junction table, not to STUDENT or MODULE alone."

Right-side diagram: STUDENT (M) —enrols_in (with Grade attribute)→ MODULE (N) in ER notation,
mapped to three tables: STUDENT (`student_id` PK, `first_name`), MODULE (`module_code` PK,
`module_name`), and ENROLMENT (`student_id` PK+FK, `module_code` PK+FK, `grade` DECIMAL(4,2)),
captioned "Junction table resolves M:N".

### Slide 10 — Rule 6: 1:1 Relationship → FK Choice

Badge: "Rule 6". Heading: "1:1 Relationship → FK Choice".

> Description: "In a 1:1 relationship, add the FK in **either table**. Best practice: put the FK
> on the **total-participation side** (mandatory side), or the side that 'belongs to' the other.
> Alternatively, merge both entities into one table if they always co-exist."

Two step cards:
- **Option A:** "Add FK in the total-participation side table"
- **Option B:** "Merge both entities into one table (if always co-exist)"

Tip card: "Example: EMPLOYEE (1) ── assigned ── (1) COMPANY_CAR. Not every employee has a car, but
every company car is assigned to one employee → put employee_id FK in COMPANY_CAR table (total
participation side)."

Right-side diagram: EMPLOYEE (1) —assigned→ (1) COMPANY_CAR, with COMPANY_CAR marked as the
total-participation side (double line notation). Option A mapping shown as EMPLOYEE
(`employee_id` PK, `employee_name`) and COMPANY_CAR (`car_reg` PK, `car_model`, `employee_id` FK
→ EMPLOYEE). A callout box spells out Option B explicitly: "Option B: Merge into one table →
EMPLOYEE_CAR(employee_id PK, employee_name, car_reg, car_model)" with the caveat "Use only when
every employee ALWAYS has a car (both sides are total participation)".

### Slide 11 — Rule 7: Weak Entity → Composite PK

Badge: "Rule 7". Heading: "Weak Entity → Composite PK".

> Description: "A **weak entity** becomes a table with a **composite primary key** = the partial
> key (discriminator) + the identifying entity's PK (as FK). The identifying entity's PK serves
> double duty as both FK and part of PK."

Three numbered step cards:
1. "Identifying entity's PK → column in weak entity table (as FK)"
2. "Partial key → column in weak entity table"
3. "PK of new table = **(identifying_pk + partial_key)**"

Tip card: "ROOM (partial key: RoomNo) identified by BUILDING (PK: BuildingId) → ROOM table PK =
(building_id, room_no)"

Right-side diagram: BUILDING (strong entity, key BuildingId) —located_in (double-diamond
identifying relationship)→ ROOM (weak entity, double-rectangle, partial key RoomNo with dashed
underline), mapped to a BUILDING table (`building_id` PK, `building_name`) and a ROOM table
(`building_id` PK+FK, `room_no` PK/partial key, `room_type`), captioned "PK = (building_id,
room_no) — composite".

### Slide 12 — Rule 8: Derived Attribute → Do Not Store

Badge: "Rule 8". Heading: "Derived Attribute → Do NOT Store". (Different layout from Rules 1–7 —
full-width instead of left-panel/right-diagram split.)

> Description: "Derived attributes (dashed ellipse in Chen's notation) are **calculated from
> other data**. They should **NOT be stored** as columns — they become stale and waste storage.
> Compute them in queries instead."

Two side-by-side comparison cards:
- **❌ WRONG**: code sample `age INT`. Explanation: "Becomes stale the next birthday. You would
  need to update every row every day — impossible at scale."
- **✅ CORRECT**: SQL code sample:
  ```sql
  SELECT
    DATEDIFF(YEAR,
      date_of_birth,
      GETDATE()) AS age
  FROM EMPLOYEE
  ```
  Explanation: "Always accurate. Computed at query time from the stored date_of_birth column."

Closing note card: "Note: Some modern systems support **computed/virtual columns** that are
calculated automatically. The default mapping rule is still to omit derived attributes from the
schema."

### Slide 13 — Section Break: Worked Example

Watermark "02". Eyebrow: "WORKED EXAMPLE". Heading: "University Enrolment System". Subtitle:
"Mapping a complete ER diagram step by step".

### Slide 14 — University ER Diagram (full-bleed diagram slide)

Title: "UNIVERSITY ENROLMENT — ER DIAGRAM". A full ER diagram (no left-panel text, this slide is
100% SVG) showing:

- **STUDENT** entity with key attribute **StudentId** (underlined), plus **FirstName**,
  **DateOfBirth**, and a composite **Address** attribute that fans out into sub-attributes
  **StreetName**, **City**, **PostCode**.
- **enrols_in** relationship diamond connecting STUDENT to MODULE, carrying a relationship
  attribute **Grade** (attached via a dashed line, signifying it belongs to the relationship, not
  either entity).
- STUDENT participates in `enrols_in` with **total participation** (double line, cardinality
  **M**); MODULE participates with partial participation (single line, cardinality **N**).
- **MODULE** entity with key attribute **ModuleCode** (underlined), plus **ModuleName** and
  **Credits**.
- **belongs_to** relationship diamond connecting MODULE to DEPARTMENT. MODULE has total
  participation (double line, cardinality **N**); DEPARTMENT has partial participation (single
  line, cardinality **1**).
- **DEPARTMENT** entity with key attribute **DeptId** (underlined) plus **DeptName**.
- A legend box explaining the notation: double line = total participation (mandatory), single
  line = partial participation (optional), a composite-styled ellipse = composite attribute
  (flattened in SQL), dashed line = relationship attribute (Grade).

### Slide 15 — Step 1: Map Entities to Tables

Section label: "Worked Example · Step 1 of 2". Badge: "Step 1". Heading: "Map Each Entity to a
Table".

> Description: "Apply **Rule 1** to all three entities. Each becomes a table; each attribute
> becomes a column; key attributes become primary keys."

Step cards:
- "STUDENT → **student** table (7 columns incl. Address sub-attrs)"
- "MODULE → **module** table (3 columns)"
- "DEPARTMENT → **department** table (2 columns)"

Tip card: "Address is composite → **flatten** to street_name, city, post_code columns. No
'address' column is created."

Right-side diagram: three table cards.

- **STUDENT**: `student_id` (PK, INT), `first_name` (VARCHAR(50)), `last_name` (VARCHAR(50)),
  `date_of_birth` (DATE), `street_name` (VARCHAR(80)), `city` (VARCHAR(50)), `post_code`
  (VARCHAR(10)). Annotation: "⤴ Address flattened → 3 columns".
- **MODULE**: `module_code` (PK, VARCHAR), `module_name` (VARCHAR(100)), `credits` (INT), plus an
  italic placeholder row `dept_id ← added in Step 2` (not yet part of the table, shown in
  amber/yellow to signal "coming next").
- **DEPARTMENT**: `dept_id` (PK, INT), `dept_name` (VARCHAR(80)).

Bottom label: "Step 2 will add ENROLMENT junction table + dept_id FK to MODULE".

### Slide 16 — Step 2: Map Relationships

Section label: "Worked Example · Step 2 of 2". Badge: "Step 2". Heading: "Map the Relationships".

Two step cards:
- "**enrols_in (M:N)** → new ENROLMENT junction table — PK = (student_id + module_code). Grade
  becomes a column."
- "**belongs_to (1:N)** → add dept_id FK to MODULE table — No new table needed — FK goes on the
  N-side (MODULE)."

Tip card: "The M:N enrols_in relationship has a relationship attribute (Grade) — it goes inside
the junction table, not in STUDENT or MODULE."

Right-side diagram: two labeled panels.

- **"NEW — Junction Table for M:N"**: ENROLMENT table with `student_id` (PK+FK → STUDENT, INT),
  `module_code` (PK+FK → MODULE, VARCHAR), `grade` (DECIMAL(4,2)). Caption: "PK = (student_id,
  module_code) — composite primary key".
- **"UPDATED — FK added"**: MODULE table with `module_code` (PK, VARCHAR), `module_name`,
  `credits`, and the newly added `dept_id` (FK → DEPARTMENT, INT).

Foreign-key summary box listing all three FK relationships explicitly:
- "ENROLMENT.student_id → STUDENT.student_id"
- "ENROLMENT.module_code → MODULE.module_code"
- "MODULE.dept_id → DEPARTMENT.dept_id"

### Slide 17 — Complete Relational Schema

Header: "Complete Relational Schema" / "4 tables — 3 entities + 1 junction table for the M:N
relationship". (Light/white background slide, distinct from the dark violet theme of the concept
slides — the only other light slides are the two activity slides, 19–20.)

Four table cards shown side by side with arrows between them (DEPARTMENT ← MODULE ↔ ENROLMENT ↔
STUDENT):

- **DEPARTMENT**: `dept_id` (PK, INT), `dept_name` (VARCHAR(80)).
- **MODULE**: `module_code` (PK, VARCHAR), `module_name` (VARCHAR(100)), `credits` (INT),
  `dept_id` (FK → DEPARTMENT, INT).
- **ENROLMENT**: `student_id` (PK+FK → STUDENT, INT), `module_code` (PK+FK → MODULE, VARCHAR),
  `grade` (DECIMAL(4,2)). Footer note: "PK = (student_id, module_code)".
- **STUDENT**: `student_id` (PK, INT), `first_name` (VARCHAR(50)), `last_name` (VARCHAR(50)),
  `date_of_birth` (DATE), `street_name` (VARCHAR(80)), `city` (VARCHAR(50)), `post_code`
  (VARCHAR(10)).

This slide is the definitive final answer for the worked example — the complete, final schema
after both mapping steps have been applied.

### Slide 18 — Section Break: Activity

Watermark "03". Eyebrow: "ACTIVITY". Heading: "Map the ER Diagram". Subtitle: "Apply all 8 rules
to a fresh scenario".

### Slide 19 — Activity: Project Management System (instructions, no answer shown)

Badge: "Activity" (amber). Heading: "Project Management System".

Full scenario text (transcribed verbatim):

> "A company tracks **EMPLOYEE** and **PROJECT** entities.
>
> Each **EMPLOYEE** has an EmpId (key), a **Name** (composite: FirstName, LastName), and a
> **{SkillSet}** (multivalued).
>
> Each **PROJECT** has a ProjectId (key), ProjectName, and StartDate.
>
> An EMPLOYEE can work on many PROJECTs and a PROJECT can have many EMPLOYEEs. The **WORKS_ON**
> relationship records **HoursPerWeek**.
>
> Every EMPLOYEE must work on at least one PROJECT. A PROJECT may exist before any employee is
> assigned."

Task box: "Your Task — Apply the 8 mapping rules. List **all tables** with their columns, PKs,
and FKs. Which rule creates each table?"

The right-hand panel is an empty dashed placeholder box reading "Your schema here" — this slide
intentionally shows no answer, forcing the student/instructor to work it out live before
advancing to slide 20.

### Slide 20 — Activity Answer: Project Management Schema

Pill: "Answer" (green). Heading: "Project Management Schema". Subtitle: "4 tables — 2 entities +
1 multivalued + 1 junction".

Four table cards with arrows between them (EMPLOYEE → EMPLOYEE_SKILL ↔ WORKS_ON ← PROJECT), each
annotated with which rule produced it:

- **EMPLOYEE**: `emp_id` (PK, INT), `first_name` (VARCHAR(50)), `last_name` (VARCHAR(50)).
  Annotation: "Rule 1 · Name flattened" (the composite Name attribute was flattened per Rule 2's
  logic even though the table itself follows Rule 1).
- **EMPLOYEE_SKILL**: `emp_id` (PK+FK → EMP, INT), `skill` (PK, VARCHAR(80)). Annotation: "Rule 3
  · {SkillSet} multivalued".
- **WORKS_ON**: `emp_id` (PK+FK → EMP, INT), `project_id` (PK+FK → PROJ, INT), `hours_per_week`
  (DECIMAL(5,2)). Annotation: "Rule 5 · M:N + relationship attr".
- **PROJECT**: `project_id` (PK, INT), `project_name` (VARCHAR(100)), `start_date` (DATE).
  Annotation: "Rule 1".

This is the full answer key for the activity in slide 19: the correct/complete solution is these
four tables, with EMPLOYEE_SKILL resolving the multivalued SkillSet attribute (Rule 3) and
WORKS_ON resolving the M:N EMPLOYEE↔PROJECT relationship with its HoursPerWeek attribute (Rule
5).

### Slide 21 — Common Mapping Mistakes

Heading: "Common Mapping Mistakes". Four wrong/right paired cards (2×2 grid):

1. **❌ Storing derived attributes** — "Adding an 'age' column that goes stale every birthday.
   Never store what can be computed." / **✅ Compute in queries** — "Store date_of_birth, then
   compute age with DATEDIFF() when needed."
2. **❌ Composite attr as one column** — "Creating an 'address VARCHAR(200)' column for a
   composite Address attribute." / **✅ Flatten sub-attributes** — "Create street_name, city,
   post_code as separate columns — queryable individually."
3. **❌ M:N with two FKs in one table** — "Adding both student_id and module_code as FKs in one
   of the entity tables." / **✅ Always create a junction table** — "Create ENROLMENT(student_id
   FK, module_code FK, grade). Junction table is mandatory for M:N."
4. **❌ FK on the wrong side of 1:N** — "Putting the FK in the '1' side table (e.g., dept_id in
   DEPARTMENT instead of MODULE)." / **✅ FK always on the N-side** — "The MANY side gets the
   FK — MODULE.dept_id references DEPARTMENT.dept_id."

### Slide 22 — Key Takeaways

Heading: "Key Takeaways". Five numbered takeaway items:

1. "**Each strong entity → one table.** Key attribute → PRIMARY KEY. Simple attributes →
   columns."
2. "**Composite attributes are flattened.** Each sub-attribute becomes its own column. The
   composite parent is never stored."
3. "**Multivalued attributes → separate table** with FK + composite PK. M:N relationships →
   junction table with two FKs + relationship attributes."
4. "**1:N → FK on the N-side.** The many-side entity's table gets the FK column pointing to the
   one-side's PK."
5. "**Derived attributes → do NOT store.** Compute them at query time from stored data to avoid
   stale values."

(Note: takeaways 3 and 6 from the 8-rule set — M:N and weak entity — are compressed/folded into
item 3's wording alongside multivalued, and 1:1/weak entity are not given their own dedicated
takeaway bullet; the 5 takeaways summarize the 8 rules but are not a strict 1:1 restatement of
all 8.)

### Slide 23 — End

Eyebrow: "MBI802 · ER DIAGRAMS SERIES". Heading: "End of Lesson 5". Body: "You can now translate
any ER diagram into a full relational schema." Note: "Use the flashcards below to review the 8
mapping rules."

### Flashcards (12 total, rendered below the deck, not as slides)

Each is a front/back Q&A pair, click-to-flip:

1. **Q:** What is ER-to-relational mapping? **A:** "The process of converting an ER diagram into
   a set of relational database tables by applying a set of deterministic rules — one rule per ER
   construct."
2. **Q:** How does a strong entity map to a relational schema? **A:** "The entity becomes a
   table. Each simple attribute becomes a column. The key attribute becomes the PRIMARY KEY."
3. **Q:** How does a composite attribute map? **A:** "Flatten each sub-attribute into its own
   column. The composite parent itself is NOT a column. E.g., Address → street_name, city,
   post_code."
4. **Q:** How does a multivalued attribute map? **A:** "Create a new table with the attribute
   value as a column + FK to the original entity. The PK of the new table = (entity_pk +
   attribute_value)."
5. **Q:** How does a 1:N relationship map? **A:** "Add the '1' side's primary key as a FOREIGN KEY
   in the 'N' side's table. No new table is created."
6. **Q:** How does a M:N relationship map? **A:** "Create a junction (bridge) table containing the
   PKs of both entities as foreign keys, plus any relationship attributes. The junction PK is a
   composite of both FKs."
7. **Q:** How does a 1:1 relationship map? **A:** "Add the FK in either table — preferably the
   total-participation (mandatory) side. Alternatively, merge both entities into one table if they
   always co-exist."
8. **Q:** How does a weak entity map? **A:** "Create a table with a COMPOSITE PRIMARY KEY =
   (partial key + identifying entity's PK). The identifying entity's PK also serves as a foreign
   key."
9. **Q:** How does a derived attribute map? **A:** "Generally NOT stored as a column. Derived
   values are computed at query time from stored data (e.g., age from date_of_birth using
   DATEDIFF in SQL)."
10. **Q:** Where does a relationship attribute (e.g., Grade) go in the schema? **A:** "In the
    junction table for the M:N relationship — it belongs to the relationship itself, not to
    either entity alone."
11. **Q:** What is a junction table? **A:** "A table created to resolve a M:N relationship. It
    holds the PKs of both entities as foreign keys, plus any attributes of the relationship."
12. **Q:** Which side gets the FK in a 1:N relationship? **A:** "The MANY (N) side. Each 'many'
    row points back to its single parent via a FK column. E.g., ORDER.customer_id →
    CUSTOMER.customer_id."

## 3. UI & interaction design

- **Navigation model:** classic slide-deck pagination, not scroll-reveal or tabs. A fixed
  1920×1080 "canvas" `<div>` holds the current slide (`SLIDES[current]`, rendered via
  `dangerouslySetInnerHTML` into a `<section>` whose class is the slide's `classes` value); a
  toolbar above it has previous/next chevron buttons (disabled at the first/last slide), a
  "`current+1` / `total`" counter, the slide's internal debug `label` (hidden on small screens),
  an expand/collapse toggle, and a fullscreen toggle. Below the canvas, a row of pill/dot
  indicators (one per slide) lets the user jump directly to any slide by index; the active dot is
  wider (24px vs 8px) and colored `#7c3aed` vs a dimmed `rgba(124,58,237,0.25)`.
- **Keyboard support:** `ArrowRight`/`ArrowDown` advance, `ArrowLeft`/`ArrowUp` go back
  (clamped to `[0, total-1]`), `Escape` exits fullscreen if active. Listener is attached at the
  `window` level for the lifetime of the mounted component.
- **Fullscreen:** uses the native Fullscreen API (`wrapRef.current.requestFullscreen()` /
  `document.exitFullscreen()`) on the outer wrapper `<div>`; a `fullscreenchange` listener keeps
  the `fullscreen` state in sync if the user exits via browser chrome (e.g. pressing Esc outside
  the app's own handler, or a browser fullscreen button).
- **Responsive scaling:** the 1920×1080 canvas is never resized directly. Instead a
  `ResizeObserver` watches the wrapper `<div>`, computes `scale = min(width/1920, height/1080)`,
  and applies `transform: scale(...)` with `transform-origin: top left` to the inner canvas div,
  while setting the wrapper's `height` to `1080 * scale` px so the layout reflows correctly around
  it. This keeps every slide's fixed-pixel absolute-positioned SVG/HTML layout pixel-perfect at
  any container width.
- **Visual style:** dark violet/indigo palette throughout the concept slides — background colors
  cycle through `#1e1b4b` (title/agenda/section-break/takeaways/end), `#2e1065` (concept slides,
  mistakes slide), and `#130d36` (concept-right panel background). Accent purple `#7c3aed` /
  `#a78bfa` / `#4c1d95` for badges, borders, and highlighted text; amber `#d97706`/`#fbbf24` for
  relationship diamonds and warning cards; teal `#0d9488` for tip cards and FK-reference lines;
  red `#ef4444` for "wrong" callouts; green `#22c55e` for "right" callouts. The activity/answer/
  complete-schema slides (17, 19, 20) intentionally switch to a light lavender/white background
  (`#faf5ff`, `#f0fdf4`) to visually separate "worked/answer" content from "concept teaching"
  content. Typography is `DM Sans` for body/UI text and `DM Mono` for all table/column/SQL code
  text, both loaded via Google Fonts `@import` inside the injected stylesheet.
- **Animations:** slide-entrance elements use CSS keyframe classes `a1`–`a5` (`ermFadeUp`/
  `ermFadeIn`), staggered by 0.15s increments (`a1` at 0s, `a2` at 0.15s, ... `a5` at 0.6s) so
  panel content fades up sequentially rather than all at once. These are pure CSS animations
  defined once in the injected `DECK_CSS` stylesheet, not re-triggered by React on slide change
  (i.e. they only play once per element mount, not on every slide navigation, since the whole
  `<section>` is replaced via `dangerouslySetInnerHTML` on each render but CSS animations restart
  automatically because the DOM nodes are freshly created each time `current` changes).
  Flashcards use a separate 3D flip animation (`transform: rotateY(180deg)` with
  `backfaceVisibility: hidden` on both faces, `perspective: 1000`, `transition:
  transform 0.5s cubic-bezier(0.4,0,0.2,1)`).
- **Flashcards section:** rendered below the slide deck as its own widget (not part of the 23
  slides). Header reads "Flashcards · Click a card to flip" with a "Reset all" button that clears
  the `flipped` state map. Cards are laid out in a responsive CSS grid
  (`repeat(auto-fill, minmax(280px, 1fr))`), each a fixed-height (170px) flip card; clicking
  toggles that card's own flipped state independently (stored per-index in a `Record<number,
  boolean>`).
- **Footer credit:** every slide includes a fixed bottom-center copyright line, "© All Rights
  Reserved by Yasas Sri Wickramasinghe" (`.cr` class; a `.cr-dark` variant is used on the light
  slides 17/19/20 to keep the text legible against a light background).

## 4. Component & state architecture

- `ERMappingDeck` (default export, `src/components/slides/ERMappingDeck.tsx`) is a self-contained
  function component with **no props** — it is mounted parameterless at
  `{lesson.id === 'er-mapping' && <ERMappingDeck />}` in `CourseResources.tsx`.
- **State (all local `useState`, no external store, no Firestore):**
  - `current: number` — index of the currently displayed slide into the module-level `SLIDES`
    constant array (23 entries), initialized to `0`.
  - `expanded: boolean` — toggled by the expand/collapse toolbar button; declared but its only
    consumer in the rendered JSX is the icon swap (`Minimize2`/`Maximize2`) on the button itself —
    no other layout behavior reacts to `expanded` in the visible code, i.e. it currently has no
    effect on the canvas size/layout (see Rebuild notes).
  - `fullscreen: boolean` — mirrors `document.fullscreenElement` via a `fullscreenchange`
    listener; drives which icon (`Maximize`/`Minimize`) and handler (`goFs`/`exitFs`) the
    fullscreen button uses.
  - `flipped: Record<number, boolean>` — per-flashcard flip state, keyed by flashcard index.
- **Refs:** `wrapRef` (outer bordered wrapper `<div>`, the fullscreen target and `ResizeObserver`
  target) and `canvasRef` (inner fixed 1920×1080 `<div>` that gets `transform: scale(...)`
  applied to it).
- **Effects:**
  1. Style injection — on mount, injects the `DECK_CSS` template-literal string into a
     `<style id="erm-deck-styles">` appended to `document.head`, guarded by an `if
     (!document.getElementById(styleId))` check so repeated mounts don't duplicate the tag; on
     unmount, removes that style element. This is global/document-level CSS, not scoped to the
     component, so all class names in `DECK_CSS` are prefixed with `.erm` to avoid leaking styles
     onto the rest of the app.
  2. `ResizeObserver` on `wrapRef` — recomputes and applies the scale transform on the canvas
     whenever the wrapper's size changes (see UI section above).
  3. `keydown` listener on `window` — arrow-key slide navigation and Escape-to-exit-fullscreen.
  4. `fullscreenchange` listener on `document` — keeps `fullscreen` state in sync with the actual
     browser fullscreen state.
- **Data model:** `SLIDES: { classes: string; label: string; html: string }[]` — a flat,
  module-level (not component-level) array of 23 objects; each slide is essentially a canned HTML
  fragment plus a CSS class selector, giving each slide bespoke styling defined once in
  `DECK_CSS`. `FLASHCARDS: { front: string; back: string }[]` — a flat array of 12 Q&A pairs,
  also module-level, entirely independent of `SLIDES`.
- **Gating/unlock logic (lives in the parent, not this component):** `CourseResources.tsx`
  computes `const gated = !isStaff && ['normalization', 'quiz'].includes(lesson.id) &&
  !erMcqPassed;` per lesson row (line 1742) — `'er-mapping'` is absent from that array, so
  `gated` evaluates `false` for this lesson regardless of `erMcqPassed`. The only real gate this
  lesson passes through is the outer one that puts a student on the MBI802 Course Resources page
  at all (being logged in as a `student` — or `staff` — with `'MBI802'` in their enrolled
  subjects). No score threshold, no prerequisite lesson.
- **Scoring/badge logic:** none. This is a pure content/reference lesson with no quiz, no
  completion tracking, and no badge-award triggers anywhere in the file.

## 5. Rebuild notes

- **Do not conflate with the public `/er-mapping` explorer.** `ERMappingExplorerPage.tsx` is a
  separate, non-gated, `framer-motion`-driven scroll page with its own interactive simulations
  and its own `TableCard`/`Reveal`/`SectionHead` helper components, documented in a separate
  lesson-docs file. This deck (`ERMappingDeck.tsx`) is the gated, slide-deck version living inside
  Course Resources — a different component, a different interaction model (paginated slides vs.
  scroll-reveal), a different visual language (dark violet DM Sans/DM Mono deck vs. Apple-styled
  light SF Pro page), and no shared code. If rebuilding from scratch, build these as two entirely
  independent files, exactly as they exist today — do not attempt to merge or derive one from the
  other.
- **`expanded` state appears to be dead/no-op.** The `expanded` boolean is set by the
  expand/collapse toolbar button and swaps the button's icon (`Minimize2` vs `Maximize2`), but no
  other JSX in the component reads `expanded` to change layout, sizing, or visibility — it does
  not appear to actually expand anything visible in the current code. Worth flagging as a UI
  affordance that doesn't fully do what it implies; a rebuild should either wire it to something
  (e.g. toggling a taller/wider canvas independent of fullscreen) or drop the control.
  Double-check current behavior in a running instance before deciding whether to preserve or fix
  this quirk.
- **Global stylesheet injection pattern.** `DECK_CSS` is injected into `document.head` rather than
  using CSS Modules or styled-components — this is consistent with the sibling ER slide decks in
  this codebase (`ERDiagramsDeck`, `ERDiagramActivitiesDeck`, etc.) and should be preserved for
  consistency, including the `.erm` class-name prefix convention that scopes it and the
  mount/unmount cleanup of the `<style>` tag.
  - The `@import` of Google Fonts (`DM Sans`, `DM Mono`) inside `DECK_CSS` depends on network
    access to `fonts.googleapis.com`; this is an external dependency shared with the rest of the
    deck family and should be revalidated as still reachable/uncensored in any target deployment
    environment, though as a Google Fonts CDN link it is low-risk of rotting.
- **Content is baked into JS, not fetched from Firestore or a CMS.** All 23 slides' HTML,
  including every SVG diagram, is authored as literal JSX/HTML template strings directly in the
  component file — there is no CMS/admin edit path for this content (consistent with the
  "Video Lesson Manager is a CMS tool, not a lesson" exclusion note elsewhere in this doc set;
  this deck has no analogous manager at all). Any content correction requires editing this source
  file directly and redeploying.
- **Takeaways slide (22) is a lossy summary, not a 1:1 restatement of all 8 rules** — it presents
  5 takeaway bullets that fold Rule 3 (multivalued) and Rule 5 (M:N) together, and omit standalone
  callouts for Rule 6 (1:1) and Rule 7 (weak entity) and Rule 2 (composite, mentioned but combined
  differently than the rules section). This is intentional simplification for a "review" slide,
  not a bug, but a rebuild should preserve this exact asymmetry (5 takeaways ≠ 8 rules) rather
  than "fixing" it into a 1:1 mapping, since that would diverge from the original authored
  content.
- **No images/external assets** beyond the two Google Fonts. All diagrams (ER diagrams, table
  mock-ups, pipeline illustrations) are hand-authored inline SVG with hard-coded pixel coordinates
  inside each slide's `html` string — there are no `<img>` tags, no SVG files, and no icon sprite
  sheets beyond the `lucide-react` icon components used in the toolbar chrome
  (`ChevronLeft`/`ChevronRight`/`Maximize2`/`Minimize2`/`Maximize`/`Minimize`).
- **Copyright footer** ("© All Rights Reserved by Yasas Sri Wickramasinghe") is hard-coded
  verbatim on every one of the 23 slides — preserve this exactly if rebuilding, it names the
  platform's author/instructor.
- **Slide 14 is visually distinct from the rest of the deck** — it is the only slide with an empty
  `classes` string (no `s-*` class applied) and manually sets its own `#0f172a` background via an
  absolutely positioned sibling `<div>` rather than through the `DECK_CSS` class system used by
  every other slide; this is a one-off full-bleed diagram layout for the university ER diagram and
  should be preserved as such rather than "regularized" into the class-based pattern.
