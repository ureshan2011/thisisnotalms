# Advanced ER Concepts — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/er-advanced` (registered twice in `src/App.tsx`: once in the normal
  `<Routes>` block used when `PLATFORM_ACTIVE` is true, and once identically in the
  `ShutdownRoutes()` fallback block used when the platform is shut down — both map to the
  same `ERAdvancedPage` component)
- **Source files:**
  - `src/pages/ERAdvancedPage.tsx` (25 lines) — the route-level page. Configures
    `PublicLessonShell` with this lesson's hero copy/colours and mounts the slide deck.
  - `src/components/slides/ERAdvancedConceptsDeck.tsx` (938 lines) — the entire lesson: a
    self-contained, hard-coded 11-slide deck component (`ERAdvancedConceptsDeck`). All slide
    markup (as raw HTML/SVG strings) and all deck CSS live inline in this one file; there is
    no external content source, quiz bank, or Firestore data.
- **Depends on:**
  - `src/components/public/PublicLessonShell.tsx` — shared hero/nav/footer shell used by all
    public "Let's make sense of…" lessons.
  - `lucide-react` icons `ChevronLeft`, `ChevronRight`, `Maximize2`, `Minimize2`, `Maximize`,
    `Minimize` (deck navigation controls).
  - Google Fonts, loaded via an `@import` inside the deck's injected `<style>` tag:
    `Playfair Display` (headings) and `DM Sans` (body/UI text).
  - No Firestore reads/writes, no external links to validate, no other component imports.
    Everything (diagrams, symbols, text) is drawn with inline SVG defined in the file itself.

## 1. Purpose & learning objectives

This is the fifth of the public MBI802 "ER Diagrams" mini-series (see the page's `eyebrow`:
"MBI802 · Data Modelling"). It picks up after the learner already knows basic Chen's-notation
ER diagramming (entities, relationships, simple attributes — covered in the earlier
`/er-diagrams` and `/er-activities` lessons) and introduces the notation needed for messier,
real-world data models. The hero subtitle states the goal directly: "Real data is messier than
the textbook. Tackle the entities that can't stand on their own, the relationships that
identify them, and attributes that are multivalued or derived — with two exercises to test
yourself."

Four learning objectives, one per topic pill shown in the hero and one per "concept" slide:
1. Recognise and draw a **weak entity** (an entity with no independent identity of its own).
2. Recognise and draw an **identifying relationship** (the double-diamond link that gives a
   weak entity its identity via its owner).
3. Recognise and draw a **multivalued attribute** (an attribute holding more than one value
   per entity instance).
4. Recognise and draw a **derived attribute** (an attribute computed from other stored data,
   never itself stored).

The lesson ends with two worked exercises (with model answers shown on the following slide)
so the learner can self-check before moving on.

## 2. Full content

The deck is an array of 11 slide objects (`SLIDES`), each with a `classes` (CSS layout
variant), a `label` (shown in the on-screen slide counter, e.g. "03 Weak Entity"), and an
`html` string rendered via `dangerouslySetInnerHTML`. Every slide ends with a copyright
footer line: "© All Rights Reserved by Yasas Sri Wickramasinghe" (light variant `cr-light` on
dark slides, dark variant `cr-dark` on light slides). Full transcription, slide by slide:

**Slide 1 — Title (`01 Title`)**
Full-bleed dark-navy (`#0b1728`) slide with a decorative dotted background and faint outline
shapes (a double rectangle, a double diamond, two ellipses) hinting at the symbols to come.
- Eyebrow: "Database Management Systems"
- Heading: "Advanced ER Concepts"
- Decorative divider line
- Subtitle: "Chen's Notation · Weak Entities · Special Attributes"
- Sub-subtitle: "Prerequisite: Basic ER Diagram knowledge"

**Slide 2 — What You Will Learn (`02 What You Will Learn`)**
Eyebrow "This lesson covers", heading "Four New Concepts to Master", then a 4-column grid of
cards, each with a small SVG symbol icon, a numbered label, a title, and a one-sentence
description:
1. **01 — Concept / Weak Entity** (double-rectangle icon labelled ENTITY): "An entity that
   cannot be uniquely identified on its own — it depends on a stronger entity for its very
   existence."
2. **02 — Concept / Identifying Relationship** (double-diamond icon labelled REL): "The
   special double-diamond that links a weak entity to its owner, providing the missing
   identity context."
3. **03 — Concept / Multivalued Attribute** (double-ellipse icon showing `{attribute}`): "An
   attribute that holds multiple values for one entity instance — like a list of phone
   numbers or email addresses."
4. **04 — Concept / Derived Attribute** (dashed-ellipse icon showing `(attribute)`): "An
   attribute computed from other data — like calculating Age from DateOfBirth. Never stored
   directly."

**Slide 3 — Weak Entity (`03 Weak Entity`)**
Left panel ("Concept 01" badge):
- Body text: "A **weak entity** cannot be uniquely identified by its own attributes alone. It
  **depends entirely on another entity** — called the *strong entity* or *owner* — for both
  existence and identity."
- Rule box, "Chen's Notation Symbol": "Drawn as a **double rectangle** — two concentric
  boxes. The outer border signals 'this entity cannot stand alone.'"
- Example chips: "ROOM depends on BUILDING", "ORDER_ITEM depends on ORDER", "DEPENDENT
  depends on EMPLOYEE".

Right panel, an SVG with two stacked boxed diagrams:
- **Symbol comparison** box: side-by-side "Strong Entity" (BUILDING, single solid border,
  labelled "Single border / Has its own primary key (PK) / Can exist independently") versus
  "Weak Entity" (ROOM, double border, labelled "Double border / Needs BUILDING to be
  identified / Cannot exist without its owner"), separated by a "vs" label.
- **Partial key (discriminator)** box, subtitled "Weak entities have a partial key — unique
  only within their owner entity": left side shows `BuildingID` in an ellipse with a solid
  underline, captioned "Primary Key — solid underline / Uniquely identifies BUILDING
  anywhere in the database / e.g. BuildingID = 'B01'"; right side shows `RoomNo` in an
  ellipse with a dashed underline, captioned "Partial Key — dashed underline / Unique only
  within one BUILDING / Room 101 could be in ANY building! / Combined key: (BuildingID +
  RoomNo)". A "vs" label separates them.

**Slide 4 — Identifying Relationship (`04 Identifying Relationship`)**
Left panel ("Concept 02" badge):
- Body text: "The **special relationship** connecting a weak entity to its owner. It provides
  the ownership context needed to uniquely identify each weak entity instance."
- Rule box: "Drawn as a **double diamond** — two concentric diamonds. It **always** connects
  a weak entity to its strong entity."
- "Remember" note (amber): "If you draw a double diamond, one side *must* be a weak entity
  (double rectangle). They always appear together."
- Chips: "Cardinality: 1 (strong) to N (weak)", "Weak side: total participation".

Right panel, an SVG ER fragment: BUILDING (strong entity, solid rectangle, cardinality "1")
connected via a double-diamond relationship labelled "has" to ROOM (weak entity, double
rectangle, cardinality "N"). BUILDING carries key attribute `BuildingID` (solid underline)
and plain attribute `Name`. ROOM carries partial-key attribute `RoomNo` (dashed underline,
annotated "Dashed underline = Partial key") and plain attribute `RoomType`. Labels: "Strong
Entity" under BUILDING, "Identifying Relationship" under the diamond, "Weak Entity" under
ROOM. A "KEY INSIGHT" callout box reads: "One BUILDING 'owns' many ROOMs. RoomNo 101 only
makes sense per building." / "The combined (composite) key is: BuildingID + RoomNo".

**Slide 5 — Multivalued Attribute (`05 Multivalued Attribute`)**
Left panel ("Concept 03" badge):
- Body text: "A **multivalued attribute** can hold **more than one value** for a single
  entity instance. Rather than one phone number per employee, you can store many."
- Rule box: "Drawn as a **double ellipse** — two concentric ovals. In text notation, written
  with curly braces: **{PhoneNumbers}**."
- Chips: "{PhoneNumbers}", "{EmailAddresses}", "{Skills}", "{Languages}".
- Note, "Why not just add 3 phone attributes?": "Because we don't know in advance how many
  values a given instance will have. Double ellipse = flexible, open-ended list."

Right panel, an SVG ER fragment: EMPLOYEE entity with key attribute `EmpID` (solid
underline), plain attributes `Name` and `Department`, and a double-ellipse multivalued
attribute `PhoneNumbers` (annotated "Double ellipse"). A boxed example, "EXAMPLE: ONE
EMPLOYEE'S PHONES", lists three sample values: "021 123 4567", "09 876 5432", "027 111 2233".
A bottom banner reads: "In a relational database, multivalued attrs become their own table" /
"e.g. EMPLOYEE_PHONE (EmpID, PhoneNumber)".

**Slide 6 — Derived Attribute (`06 Derived Attribute`)**
Left panel ("Concept 04" badge):
- Body text: "A **derived attribute** is **calculated from other stored data** — it doesn't
  need to be saved in the database because you can always compute it on demand."
- Rule box: "Drawn as a **dashed ellipse** — the broken border signals 'this value isn't
  stored directly.' In text: written as **(Age)** with parentheses."
- Chips: "(Age) from DateOfBirth", "(TotalPrice) from UnitPrice × Qty", "(YearsOfService)
  from HireDate".
- Note, "Why not just store it?": "Storing derived data risks **inconsistency**. If
  DateOfBirth changes, a stored Age becomes wrong. Compute it instead — always accurate."

Right panel, an SVG ER fragment: PERSON entity with key attribute `PersonID` (solid
underline), plain attributes `Name` and `DateOfBirth`, and a dashed-ellipse derived attribute
`Age` (annotated "Dashed ellipse = Not stored") plus plain attribute `Email`. A boxed diagram,
"HOW AGE IS DERIVED", shows a three-step pipeline: `DateOfBirth` ("1990-05-14 ✓ stored") →
`Today − DOB` ("SQL: DATEDIFF()") → `Age` ("34 ✗ not stored"). A bottom banner reads: "Dashed
ellipse = 'I can compute this — no need to store it'" / "Always stays accurate — automatically
reflects the latest data".

**Slide 7 — Symbol Reference (`07 Symbol Reference`)**
Heading: "Advanced Symbol Reference — Quick Guide", subtitle "All four new symbols at a
glance. Use this slide as your reference." A grid of labelled symbol cards:
- **Strong Entity** — single rectangle. "Single rectangle / Has its own primary key"
- **Weak Entity** — double rectangle. "Double rectangle / Depends on strong entity"
- **Relationship** — single diamond. "Single diamond / Between regular entities"
- **Identifying Rel.** — double diamond. "Double diamond / Links weak entity to owner"
- **Attribute** — single ellipse. "Single ellipse / One value per entity"
- **Key Attribute** — ellipse with solid underline. "Solid underline = Primary Key /
  Uniquely identifies entity"
- **Multivalued** — double ellipse, `{attribute}`. "Double ellipse — {curly braces} /
  Multiple values per entity"
- **Derived Attribute** — dashed ellipse, `(attribute)`. "Dashed ellipse — (parentheses) /
  Calculated, never stored"
- **Partial Key** — ellipse with dashed underline, `partialKey`. "Dashed underline — belongs
  to weak entity"

**Slide 8 — Exercise 1 Scenario (`08 Exercise 1 Scenario`)**
Cream background (`#fdfaf5`) with faint concentric-circle decoration. "Exercise 01" badge,
heading "University Building & Rooms".
- Scenario text: "A **university** manages its campus facilities. Each **building** has a
  building ID, name, and location. Each building has many **rooms**, but a room number (like
  '101') only makes sense within a specific building — Room 101 could exist in *every*
  building. Each room has a room number and a room type (lecture hall, lab, office). A room
  **cannot exist** without its building. Additionally, each room has a **seating capacity**
  and a *utilisation rate* which is **automatically calculated** from bookings data.
  Buildings can have **multiple contact phone numbers** on record."
- Entity pills: "BUILDING (strong)", "ROOM (weak)", "HAS (identifying)".
- Task card, "Your Task":
  1. Draw BUILDING as a strong entity with its key attribute
  2. Draw ROOM as a weak entity with its partial key (RoomNo)
  3. Connect them with an identifying relationship (double diamond)
  4. Show PhoneNumbers as a multivalued attribute on BUILDING
  5. Show UtilisationRate as a derived attribute on ROOM

Right panel: a decorative isometric illustration of a building with a numbered room grid
(rooms 101–104 visible) and the caption "Room 101 exists in EVERY building!"

**Slide 9 — Answer 1: Building & Rooms (`09 Answer 1 Building Rooms`)**
"Answer 01" badge, heading "University Building & Rooms", plus a micro-legend (Strong Entity
/ Weak Entity / Identifying Rel. / Attribute swatches). The model-answer ER diagram:
- **BUILDING** (strong entity, solid rectangle) with key attribute `BuildingID` (solid
  underline), multivalued attribute `{PhoneNumbers}` (double ellipse), and plain attributes
  `Name` and `Location`.
- **ROOM** (weak entity, double rectangle) with partial-key attribute `RoomNo` (dashed
  underline), derived attribute `(UtilisationRate)` (dashed ellipse), and plain attributes
  `Capacity` and `RoomType`.
- Connected via double-diamond relationship **has**, cardinality 1 (BUILDING side) to N (ROOM
  side).
- Four annotation call-out boxes explain each symbol used: "Double ellipse = Multivalued /
  {PhoneNumbers} → multiple values"; "Dashed ellipse = Derived / (UtilisationRate) →
  computed"; "Dashed underline = Partial Key / RoomNo unique only per building"; "Double
  diamond = Identifying Rel. / HAS links weak ROOM to BUILDING".

**Slide 10 — Exercise 2 Scenario (`10 Exercise 2 Scenario`)**
Cream background, "Exercise 02" badge, heading "Employee & Dependants".
- Scenario text: "A company tracks its **employees** and their **dependants** (family members
  covered by insurance). Each employee has an employee ID, name, hire date, and date of
  birth. A **dependant** has only a name and relationship (e.g. 'spouse', 'child') — and
  **cannot exist in the system without their employee**. A dependant named 'Emma' only makes
  sense in the context of a specific employee. Employees may speak **multiple languages**.
  The company also needs to display each employee's *years of service* on their profile —
  but this should **never be stored** directly in the database."
- Entity pills: "EMPLOYEE (strong)", "DEPENDANT (weak)", "HAS_DEPENDANT (identifying)".
- Task card, "Your Task":
  1. Identify and draw EMPLOYEE as a strong entity with EmpID as key
  2. Draw DEPENDANT as a weak entity; DepName is the partial key
  3. Connect them with HAS_DEPENDANT as an identifying relationship
  4. Add Languages as a multivalued attribute on EMPLOYEE
  5. Add YearsOfService as a derived attribute on EMPLOYEE

Right panel: a decorative illustration of an employee ("Sarah Chen — Emp #E042") linked to
two dependant figures ("Emma (child)" and "James (spouse)"), captioned "'Emma' is meaningless
without Sarah!"

**Slide 11 — Answer 2: Employee & Dependants (`11 Answer 2 Employee Dependants`)**
"Answer 02" badge, heading "Employee & Dependants", same micro-legend as slide 9. The
model-answer ER diagram:
- **EMPLOYEE** (strong entity) with key attribute `EmpID` (solid underline), multivalued
  attribute `{Languages}` (double ellipse), derived attribute `(YearsOfService)` (dashed
  ellipse), and plain attributes `HireDate` and `Name`.
- **DEPENDANT** (weak entity, double rectangle) with partial-key attribute `DepName` (dashed
  underline) and a plain `Relationship` attribute (e.g. spouse/child).
- Connected via double-diamond relationship **has_dept** (rendered on two lines as
  "has_"/"dept" inside the diamond), cardinality 1 (EMPLOYEE) to N (DEPENDANT).
- Four annotation boxes: "{Languages} — Multivalued / Many languages per employee";
  "(YearsOfService) — Derived / Computed from HireDate"; "DepName — Partial Key / Unique
  only per employee"; "HAS_DEPT — Identifying Rel. / DEPENDANT cannot exist alone"; plus a
  fifth box "DEPENDANT — Weak Entity / Double rectangle — depends on EMPLOYEE".

There is no quiz, flashcard set, or scoring mechanism in this deck — it is a pure slide
walkthrough with two worked practice scenarios and their model answers.

## 3. UI & interaction design

**Page chrome (`ERAdvancedPage.tsx` via `PublicLessonShell`):** sticky top nav with the
platform's `BrandLogo` linking to `/home`; an Apple-style hero section with three blurred
colour "orbs" (blue `#3b82f6`, indigo `#6366f1`, purple `#a855f7`) behind an eyebrow line
("MBI802 · Data Modelling"), a two-tone headline ("Let's make sense of" + gradient-highlighted
"Advanced ER Concepts."), the subtitle, four topic pills (🪶 Weak entities, 🔗 Identifying
rels, 📦 Multivalued, 🧮 Derived), and a bouncing "Scroll to begin" cue; the deck is mounted
below as the page's main content; a quiet footer states "Everything here runs in your own
browser. No login, no personal data collected."

**Deck UI (`ERAdvancedConceptsDeck.tsx`):** a self-contained "erc"-namespaced slide-deck
widget, visually distinct from `PublicLessonShell`'s Apple-style hero — it uses a
Playfair-Display/DM-Sans pairing, a dark-navy (`#0b1728`/`#0d1f36`) colour scheme for concept
slides, cream (`#fdfaf5`) for activity slides, and light blue-grey (`#f4f6fb`/`#f0fdf4`-style)
for answer slides.
- Each slide is authored at a fixed 1920×1080 canvas and scaled to fit the container via a
  `ResizeObserver` that computes `scale = min(width/1920, height/1080)` and applies a CSS
  `transform: scale(...)` with `transformOrigin: top left`; the wrapper's height is set to
  `1080 * scale` so the aspect ratio is preserved responsively.
- Navigation: previous/next chevron buttons (disabled at the first/last slide), a "`current /
  total`" counter, and a row of dot indicators at the bottom (active dot is a wider pill).
  Clicking any dot jumps directly to that slide.
- Keyboard navigation: `ArrowRight`/`ArrowDown` advances, `ArrowLeft`/`ArrowUp` goes back,
  `Escape` exits fullscreen if active.
- Expand/collapse toggle button (`Maximize2`/`Minimize2` icons) — toggles an `expanded` state
  that adds top margin to the dot row (cosmetic only, no layout change to the slide canvas
  itself observed in this file).
- Fullscreen toggle button (`Maximize`/`Minimize` icons) — calls
  `wrapRef.current.requestFullscreen()` / `document.exitFullscreen()`; a
  `fullscreenchange` listener keeps the `fullscreen` state in sync with the actual browser
  fullscreen state.
- No transition/animation library is used for slide changes — switching `current` simply
  swaps which slide object is rendered (no crossfade).
- The deck's CSS is injected once into `document.head` as a `<style id="erc-deck-styles">` on
  mount, and removed on unmount (each slide's raw HTML is injected via
  `dangerouslySetInnerHTML` inside a `<section className={slide.classes}>`).

## 4. Component & state architecture

`ERAdvancedPage` is a plain presentational wrapper — it holds no state itself; it just passes
static hero-copy props into `PublicLessonShell` and renders `<ERAdvancedConceptsDeck />` as
`children`.

`ERAdvancedConceptsDeck` state (all local `useState`, no context/Redux/Firestore):
- `current: number` — index into the `SLIDES` array (0–10), initial `0`.
- `expanded: boolean` — cosmetic UI toggle for the dot-row spacing, initial `false`.
- `fullscreen: boolean` — mirrors `document.fullscreenElement`, initial `false`.
- `wrapRef` / `canvasRef` — refs to the outer scaling wrapper and the fixed-size 1920×1080
  inner canvas, used by the `ResizeObserver` effect.

Four `useEffect` hooks: (1) inject/remove the deck's global `<style>` tag; (2) set up the
`ResizeObserver` that rescales the canvas on container resize; (3) global `keydown` listener
for arrow-key/Escape navigation; (4) `fullscreenchange` listener to sync `fullscreen` state.

There is no Firestore read/write anywhere in either file, no gating/unlock logic (the whole
route is public), no scoring, and no badge-award triggers — this is a pure static-content
slide deck.

## 5. Rebuild notes

- The entire lesson's content is hard-coded as template-literal HTML/SVG strings inside the
  `SLIDES` array — there is no CMS, JSON file, or Firestore document backing it. To
  regenerate the component, the 11 slide HTML blocks transcribed in Section 2 above (plus the
  exact inline SVG markup visible in the source file if pixel-perfect diagrams are required)
  are the full source of truth.
- Both `ERAdvancedConceptsDeck.tsx` and the sibling `ERAttributeConstraintsDeck.tsx`
  (documented separately in `lesson-docs/mbi802/06-er-attributes.md`) follow an identical
  component skeleton (same state shape, same `ResizeObserver`/keyboard/fullscreen effects,
  same CSS-namespace-per-deck pattern — `erc` vs `ecp`) — a shared base component could be
  extracted if maintaining both, but currently they are fully independent, duplicated
  implementations.
- The route `/er-advanced` is registered identically in two places in `src/App.tsx`: the
  live app's route table and a separate `ShutdownRoutes()` fallback table used when
  `PLATFORM_ACTIVE` is `false` (a platform-wide kill switch). Both point at the same
  `ERAdvancedPage`, so no separate content exists for the "shutdown" mode — this is purely a
  routing duplication to keep public lessons reachable even during a shutdown.
- `dangerouslySetInnerHTML` is used for every slide — since content is fully authored by the
  developer (no user input), this is safe as-is, but any rebuild that adds user-editable
  content here would need to reconsider that.
- No images/video/external assets are referenced — every visual (icons, diagrams, symbol
  comparisons) is inline SVG authored directly in the slide HTML strings, so there are no
  external asset paths to relocate.
- No external links appear in this lesson (unlike some other MBI802 lessons), so there is
  nothing to revalidate.
- Copyright line "© All Rights Reserved by Yasas Sri Wickramasinghe" appears on every slide
  and should be preserved verbatim if regenerating.
