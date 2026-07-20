# ER Diagrams — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/er-diagrams`
- **Source files:**
  - `src/pages/ERDiagramsPage.tsx` (25 lines) — thin page wrapper that supplies the hero copy
    to the shared shell and mounts the slide deck.
  - `src/components/slides/ERDiagramsDeck.tsx` (1019 lines) — self-contained slide deck; all
    24 slides' HTML/SVG markup is inline in a `SLIDES` array, plus the deck's own CSS
    (`DECK_CSS`) and player chrome (state, keyboard nav, fullscreen).
  - `src/components/public/PublicLessonShell.tsx` — shared hero/nav/footer chrome (not
    MBI802-specific, reused by other public lessons).
- **Depends on:**
  - `PublicLessonShell` (`src/components/public/PublicLessonShell.tsx`) for the page chrome
    (sticky nav with `BrandLogo`, animated hero, footer).
  - `lucide-react` icons: `ChevronLeft`, `ChevronRight`, `Maximize2`, `Minimize2`, `Maximize`,
    `Minimize`.
  - Google Fonts import inside `DECK_CSS`: `DM Sans` and `DM Mono` (loaded via
    `@import url('https://fonts.googleapis.com/css2?family=DM+Sans...&family=DM+Mono...')`).
  - `ResizeObserver` and the Fullscreen API (`document.fullscreenElement`,
    `requestFullscreen`/`exitFullscreen`) — browser APIs, no external library.
  - No Firestore reads/writes, no other shared components. The deck is fully self-contained
    (all slide content is literal HTML strings inside the component file, injected via
    `dangerouslySetInnerHTML`).

This same `ERDiagramsDeck` component is also reused, unmodified, inside the gated
`src/pages/student/CourseResources.tsx` hub (mounted when `lesson.id === 'er'`, see line
~1754: `{lesson.id === 'er' && <ERDiagramsDeck />}`). Both the public page and the gated copy
render the identical component/content — there is no separate gated-only ER Diagrams slide
deck (unlike ER→Relational Mapping or Normalization, which do have distinct gated decks).

## 1. Purpose & learning objectives

A foundational, static 24-slide lecture deck teaching the basics of Entity-Relationship
modelling using Chen's notation, before any hands-on database work. Per the deck's own agenda
slide, it covers, in order:

1. What is an ER diagram and why do we use it?
2. Two notations — Chen's vs. Crow's Foot.
3. Chen's shapes — entity, attribute, key attribute, relationship.
4. Cardinality — 1:1, 1:N, M:N.
5. Drawing a complete ER diagram, step by step.

It is explicitly positioned as a "blueprint before you code" lesson: ER diagrams let a team
design and validate a database's structure on paper before any table is created, catching
design mistakes while they are still cheap to fix.

## 2. Full content

The deck is an ordered array of 24 slides (`SLIDES` in `ERDiagramsDeck.tsx`), each with a
`label` (used as the dot-nav tooltip), a `classes` string controlling background theme
(`""` = light/`#FAF9F6`, `"dark"` = navy `#1a2744`, `"navy2"` = `#1e3a6e`), and literal HTML
content. Every slide carries the footer caption "© Yasas Sri Wickramasinghe · All Rights
Reserved" (or, on section-divider slides, no separate text — same copyright line). Full
transcription, slide by slide:

**Slide 01 — Title** (dark theme, faint "ER" watermark, grid-pattern background)
- Kicker: "Database Management Systems"
- Headline: "Entity-Relationship **Diagrams**" (the word "Diagrams" in teal `#5eead4`)
- Subtitle: "A visual language for designing databases — from idea to blueprint"

**Slide 02 — Agenda** ("Lesson Plan" kicker, "What We'll Cover" title)
Five numbered items, each with a colored number badge:
1. What is an ER diagram & why do we use it?
2. Two notations — Chen's vs. Crow's Foot
3. Chen's shapes — entity, attribute, key attribute, relationship
4. Cardinality — 1:1, 1:N, M:N
5. Drawing a complete ER diagram — step by step

**Slide 03 — Section divider "01"** (navy2 theme)
- Title: "What & Why ER Diagrams?"
- Subtitle: "Before we draw shapes — let's understand the purpose"

**Slide 04 — What Is an ER Diagram?**
Bulleted list (left column):
- A **blueprint** for a database drawn *before* any code is written
- Shows real-world **things**, their **properties**, and how they **connect**
- Invented by **Peter Chen in 1976**
- Language-neutral — any team can read it

Right column — an analogy pairing (with "≈" between them):
- 🏗️ "Architect's Blueprint" — "Plans rooms before building a house"
- 🗂️ "ER Diagram" — "Plans tables before coding a database"

**Slide 05 — Why Do We Need Them?**
Three feature cards:
1. **Common Language** — "One diagram everyone understands — developers, managers, and
   clients — no technical jargon needed." Tags: Developers, Managers, Clients.
2. **Catch Errors Early** — "Fixing a design mistake on paper takes minutes. Fixing the same
   mistake in a live database can take days." Comparison chip: "Paper — minutes" vs. "Live DB
   — days".
3. **Road Map to Tables** — "Each shape maps directly to a database structure — no guesswork
   when building." Mapping list: Entity → Table, Attribute → Column, Key Attr → Primary Key.

**Slide 06 — Section divider "02"** (navy2 theme)
- Title: "Two Popular Notations"
- Subtitle: "Same concept — different visual style"

**Slide 07 — Chen's vs. Crow's Foot Notation**
Side-by-side comparison cards, each with an SVG diagram of STUDENT–enrolls–COURSE:
- **Chen's Notation (1976)** — "Uses **geometric shapes** — rectangles, diamonds & ellipses."
  Diagram shows STUDENT (rectangle) — enrolls (diamond, cardinality M/N) — COURSE (rectangle),
  with a "Name" attribute ellipse hanging off STUDENT. Caption: "Classic academic notation ·
  Easy to learn." Badge: "✅ Used in MBI802".
- **Crow's Foot Notation** — "Uses **line-end symbols** on connecting lines to show
  cardinality." Diagram shows STUDENT and COURSE as two-part boxes (header + attribute rows:
  StudentID (PK)/Name; CourseID (PK)/Title) joined by a line with crow's-foot line-end
  symbols. Caption: "Common in industry tools (Lucidchart, Visio, draw.io)." Badge: "📌 For
  reference only".

**Slide 08 — Section divider "03"** (navy2 theme)
- Title: "Chen's Notation — The Shapes"
- Subtitle: "Four shapes. Each shape has one specific job."

**Slide 09 — Entity — The Rectangle** (Chen's Shapes 1 of 4)
Bullets:
- A real-world **"thing"** we want to track
- Always a **noun**: Student, Course, Teacher, Product…
- Each entity will become a **table** in the database
- Written in **UPPERCASE** inside the rectangle

Tip card: "**Test:** Can you list many of them? (Many students, many courses?) → It's an
entity."
Diagrams: a STUDENT rectangle (caption "An entity named STUDENT"), plus two smaller examples,
COURSE and TEACHER.

**Slide 10 — Attribute — The Ellipse** (Chen's Shapes 2 of 4)
Bullets:
- A **property** of an entity
- Connected to their entity by a line
- STUDENT attributes: *Name, Email, BirthDate…*
- Will become a **column** in the database table

Tip card: "**Rule:** Does it describe a property of an entity? → it's an attribute"
Diagram: STUDENT entity with four attribute ellipses connected by lines — StudentID, Name,
Email, BirthDate. Caption: "STUDENT entity with 4 attributes".

**Slide 11 — Key Attribute — Underlined Ellipse** (Chen's Shapes 2b — Special Attribute)
Bullets:
- A **unique identifier** — no two rows can share the same value
- Drawn as an ellipse with the attribute name **underlined**
- Becomes the **Primary Key** of the table
- Every entity must have one

Callout card: "🔑 Two students may share a name — but each must have a unique **StudentID**.
Therefore StudentID is the key attribute."
Diagrams: a side-by-side "Regular attribute" (Name, plain ellipse) vs. "Key attribute
(underlined)" (StudentID, underlined ellipse), then a combined STUDENT diagram showing
StudentID (underlined, key) and Name (regular) both attached to the STUDENT entity. Caption:
"StudentID is the key; Name is a regular attribute".

**Slide 12 — Relationship — The Diamond** (Chen's Shapes 3 of 4)
Bullets:
- Describes **how two entities connect**
- Written as a **verb** inside the diamond
- Lines connect the diamond to both entities
- Examples: *enrolls, teaches, manages, owns*

Tip card: "**Memory tip:** Entity = noun · Relationship = verb — 'STUDENT *enrolls* COURSE' →
diamond says *enrolls*"
Diagrams: "STUDENT enrolls COURSE" and "TEACHER teaches COURSE", each rendered as
rectangle–diamond–rectangle.

**Slide 13 — Shapes Summary** ("Four Shapes, Four Jobs")
Four summary cards:
- **Rectangle** — "A real-world thing → becomes a **table**"
- **Ellipse** — "A property → becomes a **column**"
- **Underlined Ellipse** — "Unique identifier → **Primary Key**"
- **Diamond** — "A verb linking two entities → **relationship**"

Footer callout: "Lines connect everything — attributes to entities, entities to diamonds. **No
floating shapes.**"

**Slide 14 — Section divider "04"** (navy2 theme)
- Title: "Cardinality"
- Subtitle: "The numbers on relationship lines — how many can relate to how many?"

**Slide 15 — Cardinality · 1:1**
- "Each instance on side A relates to **exactly one** on side B, and vice versa."
- Example 1: "🧑‍💼 One **Employee** holds one **Passport** / One **Passport** belongs to one
  **Employee**"
- Example 2: "🏫 One **Principal** leads one **School**"
- Diagram: EMPLOYEE —(1)— holds —(1)— PASSPORT, plus a row-mapping diagram: Alice↔P-001,
  Bob↔P-002, Carol↔P-003, one line each. Caption: "Each employee ↔ exactly one passport".

**Slide 16 — Cardinality · 1:N**
- "One instance on side A relates to **many** on side B. But each B belongs to **only one**
  A."
- Example 1: "🏫 One **Teacher** teaches many **Courses** / Each **Course** has only one
  **Teacher**"
- Example 2: "👩‍👧 One **Mother** has many **Children** / Each **Child** has one **Mother**"
- Diagram: TEACHER —(1)— teaches —(N)— COURSE, plus row mapping: Dr. Smith → MBI802, MBI803,
  MBI810 (three lines); Dr. Lee → MBI820 (one line). Caption: "Dr. Smith → 3 courses; Dr. Lee
  → 1 course".

**Slide 17 — Cardinality · M:N**
- "Many instances on side A relate to many instances on side B, and vice versa."
- Example 1: "📚 One **Student** enrolls in many **Courses** / One **Course** has many
  **Students**"
- Example 2: "🎬 One **Actor** appears in many **Movies** / One **Movie** has many **Actors**"
- Diagram: STUDENT —(M)— enrolls —(N)— COURSE, plus a many-to-many row mapping: Alice↔MBI802,
  MBI803; Bob↔MBI802, MBI810; Carol↔MBI803, MBI810 (each student connects to two courses in a
  criss-cross pattern). Caption: "Students and courses are connected in many directions".

**Slide 18 — Cardinality Summary** ("Three Types at a Glance")
Three rows, each with a mini diagram:
- **1:1** — EMPLOYEE–holds–PASSPORT — "Each instance matches **exactly one** on the other
  side"
- **1:N** — TEACHER–teaches–COURSE — "One on side A → **many** on side B; each B has only one
  A"
- **M:N** — STUDENT–enrolls–COURSE — "Many on side A ↔ **many** on side B simultaneously"

**Slide 19 — Section divider "05"** (navy2 theme)
- Title: "Drawing a Complete ER Diagram"
- Subtitle: "Let's put it all together — step by step"

**Slide 20 — How to Draw an ER Diagram**
Five numbered steps:
1. **Identify the entities** — what real-world things do we store data about? (nouns)
2. **List attributes** for each entity — what properties does it have?
3. **Mark the key attribute** — which attribute uniquely identifies each instance?
4. **Identify relationships** — how do entities connect? (verbs)
5. **Add cardinality** — 1:1, 1:N, or M:N on each relationship line

Scenario box: "A university has *students* and *courses*. Students can enroll in many
courses. Each course is taught by one teacher. Teachers can teach many courses."
- 📦 Entities: STUDENT, COURSE, TEACHER
- 🔗 Relationships: enrolls (M:N), teaches (1:N)

**Slide 21 — Full ER Diagram: "University Enrollment"**
A single large composite SVG diagram (1500×560 viewBox) showing the complete worked example
from Slide 20:
- **TEACHER** entity (rectangle) with attributes TeacherID (key, underlined ellipse), T_Name,
  Department.
- **teaches** relationship (diamond) between TEACHER and COURSE, cardinality 1 (teacher side)
  to N (course side).
- **COURSE** entity (rectangle) with attributes CourseID (key, underlined), Title, Credits.
- **enrolls** relationship (diamond) between COURSE and STUDENT, cardinality M (course side)
  to N (student side).
- **STUDENT** entity (rectangle) with attributes StudentID (key, underlined), S_Name, Email,
  Major.
- A **LEGEND** box (top-right) explaining: Entity (rectangle swatch), Attribute (ellipse
  swatch), Key Attribute (underlined ellipse swatch), Relationship (diamond swatch), and "1 /
  N / M = Cardinality".

**Slide 22 — How to Read the Diagram**
Four reading steps (arrow icons):
- One **TEACHER** teaches many **COURSES** (1:N)
- One **COURSE** is taught by one **TEACHER** (back-link of 1:N)
- A **STUDENT** can enroll in many **COURSES** (M:N)
- A **COURSE** can have many **STUDENTS** enrolled (M:N)

"What becomes what in the DB?" mapping table:
- STUDENT entity → STUDENT table
- COURSE entity → COURSE table
- TEACHER entity → TEACHER table
- StudentID (key) → Primary Key
- Name, Email… → Columns
- enrolls (M:N) → Junction table

Callout: "💡 Every M:N relationship becomes a separate *junction table* (e.g., ENROLLMENT) in
the relational database. 1:N relationships become a *foreign key*."

**Slide 23 — Key Takeaways** (dark theme, grid watermark)
Four takeaway cards:
- "ER diagrams are design tools" — "Draw before you code — saves enormous time & effort
  later"
- "Rectangle = Entity → Table" — "Real-world 'things' we track; become database tables"
- "Ellipse = Attribute → Column" — "Properties of entities; underlined ellipse = primary key"
- "Diamond = Relationship → Link" — "Verbs connecting entities; labeled with 1:1, 1:N, or M:N"

**Slide 24 — End** (navy2 theme)
- 🎓 icon
- "Questions?"
- "MBI802 · Database Management Systems / Entity-Relationship Diagrams"

There are no quiz questions, activities, or answer keys in this deck — it is a pure lecture
deck; the hands-on companion is the separate `/er-activities` lesson.

## 3. UI & interaction design

**Page-level hero (`PublicLessonShell`, shared with other public lessons):**
- Sticky top nav with `BrandLogo` linking to `/home`.
- Full-bleed hero section with three blurred drifting color orbs (accent `#0d7a72`, orb2
  `#14b8a6`, orb3 `#0ea5e9`) using the page's `gradient`
  (`linear-gradient(90deg, #0d7a72, #14b8a6, #0ea5e9)`).
- Framer Motion fade/slide-in animations on the eyebrow ("MBI802 · Data Modelling"), headline
  ("Let's make sense of **ER Diagrams.**"), subtitle, and topic pills, staggered by delay.
- Subtitle: "Before a single table exists, you sketch the world it describes. Meet entities,
  attributes and relationships in Chen's notation — and learn to read cardinality at a
  glance."
- Topic pills: 🔷 Entities (`#0d7a72`), 🟡 Attributes (`#ca8a04`), ◇ Relationships
  (`#0ea5e9`), ↔️ 1:1 · 1:N · M:N (`#7c3aed`).
- A bouncing "Scroll to begin" hint below the pills.
- Quiet footer: "Everything here runs in your own browser. No login, no personal data
  collected."

**Deck component (`ERDiagramsDeck`) — a self-contained 16:9 slide player:**
- Dark player chrome (`#0f1117` background, rounded 16px corners, teal-tinted border) with a
  macOS-style traffic-light toolbar (red/amber/green dots) and a monospace status readout:
  "MBI802 · ER Diagrams · {current}/{total} · ← → to navigate".
- Toolbar buttons: **Expand/Collapse** (toggles the aspect-ratio padding between 56.25%
  (16:9) and 75%, giving a taller view without leaving the page) and **Fullscreen** (uses the
  native Fullscreen API on the deck's outer `<div>`).
- The 24 slides are authored at a fixed 1920×1080 canvas and scaled down via CSS `transform:
  scale()` to fit the current container width (recomputed on resize via `ResizeObserver`); in
  fullscreen mode the scale/offset is computed to letterbox-center the 16:9 canvas within
  whatever viewport aspect ratio the screen has.
- Each slide is rendered by injecting its literal HTML string via
  `dangerouslySetInnerHTML` into a `<section>` whose class controls the color theme (default
  light `#FAF9F6`/navy text `#1a2744`; `.dark` = `#1a2744` background; `.navy2` = `#1e3a6e`
  background).
- Navigation: **Prev/Next** buttons (disabled at the first/last slide), a strip of dot
  indicators (one per slide, hover title = slide label, active dot elongates to a 20px pill),
  and **ArrowLeft/ArrowRight** keyboard shortcuts (ignored while an `<input>`/`<textarea>` has
  focus).
- Visual language throughout the slides: entities = blue rectangles (`#dbeafe` fill,
  `#1e40af` stroke), attributes = green ellipses (`#d1fae5`/`#065f46`), key attributes =
  purple underlined ellipses (`#ede9fe`/`#5b21b6`), relationships = amber diamonds
  (`#fef9c3`/`#d97706`), cardinality labels in blue (`#1d4ed8`).
- Section-divider slides (navy2 theme) show a large faint two-digit section number
  watermark ("01"–"05") bottom-right and a "bar-amber" accent rule.

## 4. Component & state architecture

`ERDiagramsPage` (page component, `src/pages/ERDiagramsPage.tsx`):
- Purely declarative — no local state. Passes hero copy/colors/pills as props into
  `PublicLessonShell` and renders `<ERDiagramsDeck />` as its `children`.

`ERDiagramsDeck` (`src/components/slides/ERDiagramsDeck.tsx`):
- `current: number` — index of the active slide (0–23), controlled by Prev/Next, dot clicks,
  and arrow keys.
- `expanded: boolean` — toggles the non-fullscreen aspect ratio between 56.25% and 75%
  padding-bottom.
- `isFullscreen: boolean` — mirrors `document.fullscreenElement`, updated via a
  `fullscreenchange` listener.
- `scale: number` / `offset: {x, y}` — computed by a `ResizeObserver` on the wrapper element
  to scale the fixed 1920×1080 slide canvas to fit the current container (and to
  letterbox-center it in fullscreen).
- `deckRef` / `wrapRef` — refs to the outer player div (for `requestFullscreen`) and the
  scaled canvas's wrapper (for measuring).
- A one-time `useEffect` injects `DECK_CSS` as a `<style id="er-deck-styles">` tag into
  `document.head` on mount and removes it on unmount (styles are shared globally by id, not
  scoped/CSS-modules).
- No Firestore reads/writes, no gating/unlock logic, no scoring, no badge triggers — this is
  a pure client-side, stateless-content slide viewer. All 24 slides' content is static data
  baked into the `SLIDES` array; there is no dynamic content loading.

## 5. Rebuild notes

- The entire lesson's content is literal HTML/SVG strings inside the `SLIDES` array in
  `ERDiagramsDeck.tsx` — there is no CMS, database, or markdown source; rebuilding requires
  recreating each slide's markup as transcribed above (colors, copy, and diagram
  geometry/labels all matter since the SVGs are hand-coordinate-positioned, not
  auto-laid-out).
- The deck component is reused verbatim (not forked/duplicated) between this public page and
  the gated `CourseResources.tsx` hub (`lesson.id === 'er'`) — there is only one
  implementation to maintain.
- `dangerouslySetInnerHTML` is used deliberately to keep the whole deck a single dependency-
  free file; a rebuild could alternatively convert each slide to JSX, but that would be a
  larger refactor than a "rebuild from lost source" task requires.
- Google Fonts (`DM Sans`, `DM Mono`) are loaded via a CSS `@import` inside the injected
  stylesheet, not via `<link>` tags or a font-loading library — revalidate that
  `fonts.googleapis.com` is still reachable if rebuilding offline/self-hosted.
- No images/external assets are referenced — every visual is inline SVG or CSS, so there are
  no broken-asset risks.
- The deck's copyright footer ("© Yasas Sri Wickramasinghe · All Rights Reserved") appears on
  every slide and should be preserved verbatim as it is the instructor's own attribution.
- Slide 07 explicitly states Crow's Foot notation is "For reference only" — Chen's notation is
  the one actually used and tested in MBI802, which is worth calling out to a rebuilder since
  it explains why 22 of the 24 slides only ever show Chen's shapes.
