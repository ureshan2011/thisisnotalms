# Attributes & Participation — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/er-attributes` (registered twice in `src/App.tsx`: once in the normal
  `<Routes>` block used when `PLATFORM_ACTIVE` is true, and once identically in the
  `ShutdownRoutes()` fallback block used when the platform is shut down — both map to the
  same `ERAttributesPage` component)
- **Source files:**
  - `src/pages/ERAttributesPage.tsx` (25 lines) — the route-level page. Configures
    `PublicLessonShell` with this lesson's hero copy/colours and mounts the slide deck.
  - `src/components/slides/ERAttributeConstraintsDeck.tsx` (1199 lines) — the entire lesson:
    a self-contained, hard-coded 20-slide deck component (`ERAttributeConstraintsDeck`),
    followed by a 12-card flashcard review grid. All slide markup (as raw HTML/SVG strings),
    the flashcard data, and all deck CSS live inline in this one file; there is no external
    content source or Firestore data.
- **Depends on:**
  - `src/components/public/PublicLessonShell.tsx` — shared hero/nav/footer shell used by all
    public "Let's make sense of…" lessons.
  - `lucide-react` icons `ChevronLeft`, `ChevronRight`, `Maximize2`, `Minimize2`, `Maximize`,
    `Minimize` (deck navigation controls).
  - Google Fonts, loaded via an `@import` inside the deck's injected `<style>` tag: `DM Sans`
    (all text) and `DM Mono` (imported but not visibly used by class name in the slide
    markup transcribed here).
  - No Firestore reads/writes, no other component imports, no external links. Diagrams are
    inline SVG defined in the file itself.

## 1. Purpose & learning objectives

This is the sixth of the public MBI802 "ER Diagrams" mini-series (hero eyebrow: "MBI802 ·
Data Modelling"), and per the deck's own title slide it is explicitly "Lesson 4 of 5" in the
"ER Chen's Notation" sequence. It teaches two independent but co-located topics:

**Part A — Composite Attributes:** how to model an attribute that is itself made of smaller,
individually meaningful sub-attributes (e.g. splitting `Address` into `StreetName`, `City`,
`PostCode`), why you'd do this (so each part can be queried/sorted/filtered independently),
how to draw it in Chen's notation (a thicker-bordered parent ellipse with smaller
sub-attribute ellipses branching off it), and how it maps to SQL columns (only the leaf
sub-attributes become columns — the composite parent never does).

**Part B — Participation Constraints:** whether every instance of an entity set must
participate in a relationship (**total participation**, drawn as a double line `══`) or only
some instances need to (**partial participation**, drawn as the default single line `──`),
how to read the correct constraint off a business-rule sentence (key words like "must/every"
vs. "may/can/optional"), and how each maps to SQL (`NOT NULL` foreign key vs. nullable
foreign key).

The hero subtitle frames it as: "The details that decide whether a model is right or wrong.
Break attributes into their parts, then read participation constraints — when every row must
join in, and when it's optional — through two guided activities." The lesson closes with two
worked activities (with model answers), a full Chen's-notation symbol reference slide, a key
takeaways slide, and a 12-card flashcard set for review.

## 2. Full content

The deck is an array of 20 slide objects (`SLIDES`), each with a `classes` (CSS layout
variant), a `label`, and an `html` string. Nearly every slide ends with the footer line "©
All Rights Reserved by Yasas Sri Wickramasinghe". Full transcription, slide by slide:

**Slide 1 — Title (`01 Title`)**
Dark teal (`#042f2e`) background with a radial-gradient glow and faint watermark text "CP".
- Eyebrow: "DATABASE MANAGEMENT SYSTEMS · MBI802"
- Heading: "Composite Attributes" / "& Participation Constraints"
- Decorative amber bar
- Subtitle: "ER Chen's Notation — Lesson 4 of 5"

**Slide 2 — Agenda (`02 What You Will Learn`)**
Eyebrow "Lesson Roadmap", heading "What You'll Learn", two columns:
- **Part A — Composite Attributes:** "What composite attributes are and why they matter" ·
  "Sub-attribute branching notation in Chen's diagrams" · "Real-world examples — Name,
  Address" · "Composite vs. simple vs. multivalued"
- **Part B — Participation Constraints:** "What participation constraints are and why they
  matter" · "Total participation — double line (══) notation" · "Partial participation —
  single line (──) notation" · "Applying constraints to real business rules"

**Slide 3 — Section Break: Composite Attributes (`03 Section — Composite Attributes`)**
Large "01" watermark. Eyebrow "PART ONE", heading "Composite Attributes", subtitle "An
attribute composed of smaller, meaningful sub-attributes".

**Slide 4 — What Is a Composite Attribute (`04 What Is a Composite Attribute`)**
Kicker: "Composite Attributes". Left panel ("Definition" badge):
- Heading: "A Whole Made of Parts"
- Body: "A **composite attribute** is an attribute that can be broken down into smaller
  sub-attributes, each representing a distinct, meaningful piece of information. Unlike a
  simple attribute, it has **internal structure**."
- Key-insight card: "When you need to **query or process individual parts** of an attribute
  (e.g., search by City, sort by LastName, extract PostCode for a report), model it as
  composite."
- Chips: "Has sub-attributes", "Branching notation", "Individually queryable".

Right panel, SVG diagram: CUSTOMER entity with key attribute `CustomerId` (underlined) and a
composite attribute `Address` (thicker-border ellipse) branching into four sub-attribute
ellipses: `StreetNumber`, `StreetName`, `City`, `PostCode`. Caption: "← Outer ellipse =
composite attribute (thicker teal border) / Small ellipses connected by lines = sub-attributes
(each queryable separately)".

**Slide 5 — Chen's Notation: How to Draw (`05 Chen's Notation — How to Draw`)**
Kicker: "Chen's Notation Rule". Left panel ("The Rule" badge), heading "Parent → Children
Branching":
1. "Draw an ellipse for the **composite attribute** — use a thicker border to distinguish it"
2. "Draw smaller ellipses for each **sub-attribute**, connected to the parent by lines"
3. "Sub-attributes can themselves be **composite** — nested branching is allowed"
- Tip: "In SQL mapping, the composite parent is **never a column**. Only the leaf
  sub-attributes become columns in the table."

Right panel, SVG diagram: a generic `CompositeAttr` parent ellipse branching into
`SubAttribute1`, `SubAttribute2`, `SubAttribute3` (labelled "Sub-attributes (leaves)" and
"Parent composite (thicker border)"). Bottom note box: "Example: Name → (FirstName,
MiddleName, LastName)" / "Each sub-attribute becomes its own column in SQL: first_name,
middle_name, last_name".

**Slide 6 — Real Example: PERSON Entity (`06 Real Example — PERSON Entity`)**
Kicker: "Real-World Example". Left panel ("PERSON Entity" badge):
- Heading: "Name & Address as Composites"
- Body: "A PERSON entity commonly has two composite attributes: **Name** (FirstName,
  MiddleName, LastName) and **Address** (StreetName, City, PostCode). Simple attributes like
  DateOfBirth and PersonId remain flat ellipses."
- SQL-impact card: "The PERSON table will NOT have 'name' or 'address' columns. Instead:
  first_name, middle_name, last_name, street_name, city, post_code."
- Hint: "Always ask: 'Will I ever need to search, sort, or filter by a *part* of this
  attribute?' If yes → make it composite."

Right panel, SVG diagram: PERSON entity with key attribute `PersonId` (underlined), simple
attribute `DateOfBirth`, composite attribute `Name` branching into `FirstName`, `MiddleName`,
`LastName`, and composite attribute `Address` branching into `StreetName`, `City`,
`PostCode`. Legend labels: "Composite (teal)", "Key attribute (underlined)", "Simple
attribute (gray)".

**Slide 7 — Composite vs. Simple vs. Multivalued (`07 Composite vs Simple vs Multivalued`)**
Heading: "Three Types of Attributes at a Glance". Three comparison cards:
- **Composite Attribute** — "One value — broken into parts". Diagram: `Address` ellipse
  branching into `City`, `StreetName`, `PostCode`. "Example: **Address** = StreetName + City
  + PostCode" / "SQL: **street_name, city, post_code** columns (no 'address' column)".
- **Simple Attribute** — "One value — no internal parts". Diagram: plain `DateOfBirth`
  ellipse. "Example: **DateOfBirth** is always one date value" / "SQL: **date_of_birth**
  column — stored directly as-is".
- **Multivalued Attribute** (full-width card) — "MULTIPLE values — no internal structure
  (double ellipse)". Diagram: double-ellipse `PhoneNumber`. "Example: **{PhoneNumber}** holds
  021-555-1234 AND 09-888-9999 simultaneously" / "SQL: creates a **separate table** — e.g.
  CUSTOMER_PHONE(customer_id FK, phone_number PK)".

**Slide 8 — Section Break: Participation Constraints (`08 Section — Participation Constraints`)**
Large "02" watermark. Eyebrow "PART TWO", heading "Participation Constraints", subtitle "Do
ALL entities have to join the relationship — or just SOME?"

**Slide 9 — What Are Participation Constraints (`09 What Are Participation Constraints`)**
Kicker: "Participation Constraints". Left panel ("Definition" badge):
- Heading: "Mandatory vs. Optional"
- Body: "A **participation constraint** specifies whether ALL or only SOME entities in an
  entity set must participate in a relationship. It captures a **business rule** about
  obligation."
- Rule card: "Think of it as a contract: 'Every X must be linked to a Y' (total) vs. 'Some X
  may be linked to a Y, but not required' (partial)."
- Chips: "Total = mandatory", "Partial = optional", "Enforced by DB constraints".

Right panel, SVG with two side-by-side cards:
- **TOTAL PARTICIPATION** — "Double line (══)" — '"Every EMPLOYEE must work in a
  DEPARTMENT"' — "Key word: must / every / all / required"
- **PARTIAL PARTICIPATION** — "Single line (──)" — '"Some EMPLOYEE may manage a
  DEPARTMENT"' — "Key word: may / can / optional / might"
Bottom box, "Why does it matter?": "Total participation maps to a NOT NULL FK constraint in
SQL." / "Partial participation means the FK column allows NULL values." / "Getting this right
prevents data integrity issues at the database level."

**Slide 10 — Total Participation: Double Line (`10 Total Participation — Double Line`)**
Kicker: "Participation Constraints". Left panel ("Total Participation" badge):
- Heading: "Double Line Notation ══"
- Body: "When **every entity** in the set must participate in at least one relationship
  instance, we draw a **double line** between the entity and the relationship diamond."
- Rule card: "Also called **mandatory** or **existence-dependent** participation. Business
  rule language: 'Every X must…', 'All X are…', 'X is required to…'"
- Tip: "Business rule: 'Every EMPLOYEE must belong to exactly one DEPARTMENT.' → EMPLOYEE
  side gets a **double line** to the works_in relationship."

Right panel, SVG diagram: EMPLOYEE ══(N)══ **works_in** diamond ──(1)── DEPARTMENT (double
line on the EMPLOYEE side, single line on the DEPARTMENT side). Annotations: "Total
participation / Every employee MUST work in a department" (EMPLOYEE side); "Partial
participation / A department CAN exist with no employees yet" (DEPARTMENT side); label
"Double line ══".

**Slide 11 — Partial Participation: Single Line (`11 Partial Participation — Single Line`)**
Kicker: "Participation Constraints". Left panel ("Partial Participation" badge):
- Heading: "Single Line Notation ──"
- Body: "When only **some entities** need to participate in a relationship, we use the
  default **single line**. This is the optional constraint — entities may or may not be
  linked."
- Rule card: "Also called **optional** participation. Business rule language: 'Some X may…',
  'An X can but doesn't have to…', 'X is not required to…'"
- Tip: "Business rule: 'Some EMPLOYEE may manage a DEPARTMENT (but most employees don't
  manage anything).' → single line from EMPLOYEE to manages."

Right panel, SVG diagram: EMPLOYEE ──(1)── **manages** diamond ──(1)── DEPARTMENT (single
line both sides). Annotations: "Partial participation / Only SOME employees manage a
department" (EMPLOYEE side); "Partial participation / Some departments may have no manager
yet" (DEPARTMENT side); label "Single line ──".

**Slide 12 — Total vs. Partial Side by Side (`12 Total vs Partial — Side by Side`)**
Heading: "Total vs. Partial at a Glance". Two cards:
- **Total Participation (══)** — "EVERY entity must participate" — rule "Entity ══
  Relationship" — examples: "Every ORDER must belong to a CUSTOMER", "Every ORDER_ITEM must
  be part of an ORDER", "Every EMPLOYEE must work in a DEPARTMENT" — key words: "must · every
  · all · required · always".
- **Partial Participation (──)** — "SOME entities may not participate" — rule "Entity ──
  Relationship" — examples: "Some CUSTOMER may not have placed any ORDER", "Some EMPLOYEE may
  not manage any DEPARTMENT", "Some LECTURER may not supervise any STUDENT" — key words: "may
  · can · optional · might · not required".

**Slide 13 — Section Break: Activities (`13 Section — Activities`)**
Large "03" watermark. Eyebrow "ACTIVITIES", heading "Apply What You've Learned", subtitle "2
activities · Composite attributes + Participation constraints".

**Slide 14 — Activity 1: Bookstore (`14 Activity 1 — Bookstore`)**
"Activity 1" badge, heading "An Online Bookstore".
- Scenario: "A bookstore system stores details about **BOOK** and **AUTHOR** entities. Each
  **BOOK** has a BookId (key), a Title, a Price, and a full publication address comprising
  **Building**, **StreetName**, **City**, and **Country**. Each **AUTHOR** has an AuthorId
  (key) and a full name with **FirstName** and **LastName**."
- Task: "1. Identify the composite attributes in both entities. 2. Draw the ER diagram
  showing both entities with all their attributes using Chen's notation. Show composite
  sub-attributes branching correctly."
- Hint: "Look for attributes described with 'comprising', 'consisting of', or that have
  multiple parts. Each part that could be queried independently is a sub-attribute."
- Right panel is a blank dashed placeholder box captioned "Your diagram here" (student draws
  their own answer before advancing to the next slide).

**Slide 15 — Answer 1: Bookstore (`15 Answer 1 — Bookstore`)**
Heading "Activity 1 — Bookstore ER Diagram". Model-answer ER diagram:
- **BOOK** entity: key attribute `BookId` (underlined), simple attributes `Title` and
  `Price`, and composite attribute `PublicationAddress` branching into `Building`,
  `StreetName`, `City`, `Country` (annotated "↑ Composite attribute (4 sub-attrs)").
- **AUTHOR** entity: key attribute `AuthorId` (underlined), and composite attribute `Name`
  branching into `FirstName`, `LastName` (annotated "↑ Composite attribute (2 sub-attrs)").
- Key label: "KEY: Composite attributes highlighted in teal" — "Teal ellipse (thick border) =
  composite parent · Small teal ellipses = sub-attributes".

**Slide 16 — Activity 2: University Participation (`16 Activity 2 — University Participation`)**
"Activity 2" badge, heading "A University System".
- Scenario: "A university database tracks **LECTURER** and **MODULE** entities. The
  following business rules apply: (1) Every LECTURER must teach at least one MODULE. (2) A
  MODULE may or may not currently be taught (some modules are inactive). (3) Every MODULE
  must be assigned to exactly one DEPARTMENT. (4) A DEPARTMENT can exist even if it currently
  has no MODULEs assigned."
- Task: "Draw the ER diagram segment showing LECTURER, MODULE, and DEPARTMENT with their
  **teaches** and **assigned_to** relationships. Apply the correct participation constraints
  (double or single lines) based on the 4 business rules above."
- Right panel is again a blank dashed placeholder box captioned "Your diagram here".

**Slide 17 — Answer 2: University Participation (`17 Answer 2 — University Participation`)**
Heading "Activity 2 — University Participation Constraints". Model-answer ER diagram chain:
LECTURER ══(N)══ **teaches** diamond ──(M)── MODULE ══(N)══ **assigned_to** diamond ──(1)──
DEPARTMENT. Four rule annotations, one per business rule:
- "Total (Rule 1) / Every lecturer MUST teach at least one module"
- "Partial (Rule 2) / Some modules MAY be inactive (untaught)"
- "Total (Rule 3) / Every module MUST be in a department"
- "Partial (Rule 4) / Departments CAN exist with no modules yet"
Legend: "Double line = Total (mandatory)" and "Single line = Partial (optional)".

**Slide 18 — Symbol Reference (`18 Symbol Reference`)**
Heading: "Chen's Notation — Complete Symbol Reference". A 12-card grid covering every symbol
used across this lesson (and referencing weak-entity/identifying-relationship symbols from
the companion Advanced ER Concepts lesson too):
1. **Entity** — plain rectangle. "Represents a real-world object or concept."
2. **Key Attribute** — underlined ellipse (`KeyAttr`). "Uniquely identifies each entity
   instance."
3. **Simple Attribute** — plain ellipse (`Attribute`). "Holds a single, indivisible value."
4. **Composite Attribute** — outer teal ellipse (`Composite`) with three branching
   sub-ellipses. "Outer teal ellipse with branching smaller ellipses for sub-attributes."
5. **Multivalued Attribute** — double ellipse (`{MultiValue}`). "Holds multiple values
   simultaneously."
6. **Derived Attribute** — dashed ellipse (`(Derived)`). "Computed from other data — never
   stored."
7. **Relationship** — diamond (`rel_name`). "Links two or more entity types."
8. **Weak Entity** — double rectangle (`WEAK`). "Cannot exist without its identifying
   entity."
9. **Total Participation** — double line (`══ double line`). "Every entity must participate
   (mandatory)."
10. **Partial Participation** — single line (`── single line`). "Some entities may not
    participate (optional)."
11. **Identifying Relationship** — double diamond (`id-rel`). "Links weak entity to its
    identifying entity."
12. **Relationship Attribute** — ellipse connected to a diamond via a dashed line (`Grade`).
    "Attribute of the relationship."

**Slide 19 — Key Takeaways (`19 Key Takeaways`)**
Heading: "Key Takeaways". Five numbered items:
1. "A **composite attribute** has sub-attributes — draw as an outer teal ellipse with smaller
   ellipses branching off it via lines."
2. "Sub-attributes represent **individually meaningful parts** — e.g., City and PostCode from
   Address. You can query each part independently in SQL."
3. "In SQL mapping, **only the leaf sub-attributes become columns**. The composite parent is
   never a column — it only exists in the ER diagram."
4. "**Total participation (══)** = every entity MUST participate. The business rule says
   'must', 'every', or 'all'. Maps to NOT NULL FK in SQL."
5. "**Partial participation (──)** = some entities are optional. The rule says 'may', 'can',
   or 'optional'. The FK column allows NULL in SQL."

**Slide 20 — End (`20 End`)**
Kicker: "MBI802 · ER DIAGRAMS SERIES". Heading: "End of Lesson 4". Body: "Next up: ER to
Relational Schema Mapping". Note: "Use the flashcards below to review key terms."

**Flashcards (`FLASHCARDS`, rendered below the deck, 12 flip-cards, front = question / back =
answer):**
1. Q: "What is a composite attribute?" A: "An attribute made up of multiple sub-attributes,
   each holding a distinct piece of information. Example: Address = StreetNumber +
   StreetName + City + PostCode."
2. Q: "How is a composite attribute drawn in Chen's notation?" A: "An outer ellipse (the
   composite parent, drawn with a thicker teal border) with smaller sub-attribute ellipses
   connected to it by lines — like branches."
3. Q: "Give an example of a composite attribute in a booking system." A: "GuestName
   (FirstName, LastName), CheckInAddress (StreetName, Suburb, City, PostCode), or
   ContactDetails (PhoneNumber, Email)."
4. Q: "Why break an attribute into composite sub-attributes?" A: "To allow querying or
   processing individual parts — e.g., sorting by LastName, filtering by City, or extracting
   PostCode for delivery routing."
5. Q: "What is the difference between composite and multivalued?" A: "Composite: ONE value
   split into parts (Name = First + Last). Multivalued: MULTIPLE separate values
   ({PhoneNumber} = 021…, 09…). Different notations and SQL mappings."
6. Q: "How does a composite attribute map to SQL?" A: "Each sub-attribute becomes its own
   column. The composite parent itself does NOT become a column. E.g., Address →
   street_name, city, post_code columns."
7. Q: "What is a participation constraint?" A: "A rule specifying whether ALL entities in an
   entity set (total participation) or just SOME (partial participation) must participate in
   at least one instance of a relationship."
8. Q: "What does total participation mean and how is it drawn?" A: "Every entity instance
   MUST participate in at least one relationship instance. Drawn as a DOUBLE LINE (══)
   between the entity and the relationship diamond."
9. Q: "What does partial participation mean and how is it drawn?" A: "Some entity instances
   do NOT have to participate in any relationship instance. Drawn as a SINGLE LINE (──) — the
   default notation."
10. Q: "A business rule says 'Every ORDER must belong to a CUSTOMER'. What participation does
    ORDER have?" A: "Total participation — drawn as a double line from ORDER to the
    places/belongs_to relationship diamond. Maps to NOT NULL FK in SQL."
11. Q: "A business rule says 'A CUSTOMER may or may not have placed an ORDER'. What
    participation does CUSTOMER have?" A: "Partial participation — drawn as a single line
    (default) from CUSTOMER to the relationship diamond. The FK column in ORDER allows
    NULL."
12. Q: "How do you identify total vs. partial participation from a business rule?" A: "Total:
    key words are 'must', 'every', 'all', 'required', 'always'. Partial: key words are 'may',
    'can', 'optional', 'might', 'not necessarily'."

No graded quiz exists in this deck — the flashcards are self-check only (flip to reveal, no
scoring, no correctness tracking).

## 3. UI & interaction design

**Page chrome (`ERAttributesPage.tsx` via `PublicLessonShell`):** identical shell pattern to
the sibling `/er-advanced` lesson — sticky nav with `BrandLogo`, Apple-style hero with three
blurred colour orbs (teal `#0f766e`, teal-light `#14b8a6`, indigo `#6366f1`), eyebrow "MBI802
· Data Modelling", headline "Let's make sense of" + gradient "Attributes & Participation.",
subtitle, four topic pills (🧩 Composite attrs, ➖ Partial, ➕ Total, ✅ Activities +
answers), "Scroll to begin" cue, and the standard footer.

**Deck UI (`ERAttributeConstraintsDeck.tsx`):** a self-contained "ecp"-namespaced slide-deck
widget using `DM Sans`/`DM Mono` fonts (no Playfair Display, unlike the Advanced ER deck) —
dark teal (`#042f2e`/`#0d3d3a`) for title/agenda/section-break/concept slides, mint-light
(`#f0fdfa`) for the "light" variant concept slide, off-white/slate (`#f8fafc`) for comparison
slides, cream (`#fdfaf5`) for activity slides, and pale green (`#f0fdf4`) for answer slides.
Distinctive touch not present in the Advanced ER deck: staggered CSS keyframe fade-up
animations (`ecpFadeUp`/`ecpFadeIn`, classes `a1`–`a5`) applied to most on-slide elements,
giving each slide's content a sequential 0.15s-staggered entrance animation on render.
- Same fixed 1920×1080 canvas scaled via `ResizeObserver` (`scale = min(width/1920,
  height/1080)`) as the sibling deck.
- Same navigation model: prev/next chevrons (disabled at bounds), "`current / total`"
  counter, clickable dot indicators, `ArrowLeft/Right/Up/Down` keyboard navigation, `Escape`
  to exit fullscreen, expand toggle, fullscreen toggle (`requestFullscreen`/
  `exitFullscreen`, synced via `fullscreenchange` listener).
- Below the deck: a **Flashcards** section (heading, "Click a card to flip" hint, and a
  "Reset all" button that clears all flip state at once). Cards are laid out in a responsive
  auto-fill grid (`minmax(280px, 1fr)`). Each card is a 3D flip card: clicking toggles a
  per-index `flipped` boolean, driving a CSS `rotateY(180deg)` transform with
  `transformStyle: preserve-3d` / `backfaceVisibility: hidden` on both faces (white "Question"
  face front, mint "Answer" face back).
- The deck's CSS (including the `@import` and `@keyframes`) is injected once into
  `document.head` as `<style id="ecp-deck-styles">` on mount and removed on unmount, mirroring
  the sibling deck's pattern.

## 4. Component & state architecture

`ERAttributesPage` is a plain presentational wrapper with no state — it passes static
hero-copy props into `PublicLessonShell` and renders `<ERAttributeConstraintsDeck />` as
`children`.

`ERAttributeConstraintsDeck` state (all local `useState`, no context/Redux/Firestore):
- `current: number` — index into the `SLIDES` array (0–19), initial `0`.
- `expanded: boolean` — cosmetic UI toggle, initial `false`.
- `fullscreen: boolean` — mirrors `document.fullscreenElement`, initial `false`.
- `flipped: Record<number, boolean>` — per-flashcard flip state, keyed by flashcard index;
  initial `{}` (all cards showing their question face). The "Reset all" button sets this back
  to `{}`.
- `wrapRef` / `canvasRef` — refs used by the `ResizeObserver` scaling effect, identical
  pattern to the sibling deck.

Four `useEffect` hooks, structurally identical to `ERAdvancedConceptsDeck`: (1) inject/remove
the deck's global `<style>` tag; (2) `ResizeObserver` for canvas scaling; (3) global `keydown`
listener for slide navigation; (4) `fullscreenchange` listener.

There is no Firestore read/write anywhere in either file, no gating/unlock logic (the whole
route is public), no scoring, and no badge-award triggers. The flashcard flip state is
ephemeral component state only — it resets on page reload and is never persisted.

## 5. Rebuild notes

- The entire lesson's content (20 slides + 12 flashcards) is hard-coded as template-literal
  HTML/SVG strings and a `FLASHCARDS` array inside this one file — there is no CMS, JSON
  file, or Firestore document backing it. To regenerate the component, the transcription in
  Section 2 above (plus the exact inline SVG markup in the source file if pixel-perfect
  diagrams are required) is the full source of truth.
- This deck and the sibling `ERAdvancedConceptsDeck.tsx` (documented in
  `lesson-docs/mbi802/05-er-advanced.md`) share an almost identical component skeleton (same
  state shape, same `ResizeObserver`/keyboard/fullscreen effects, same CSS-namespace-per-deck
  pattern — `ecp` vs `erc`) but this deck additionally has the flashcard grid and
  fade-up entrance animations that the sibling deck lacks — the two are not sharing any code,
  fully duplicated implementations.
- The route `/er-attributes` is registered identically in two places in `src/App.tsx` (the
  live `<Routes>` block and the `ShutdownRoutes()` fallback used when `PLATFORM_ACTIVE` is
  `false`), both pointing at the same `ERAttributesPage` — purely a routing duplication, not
  distinct content.
- Slide 1's subtitle calls this "Lesson 4 of 5" in an implied ER-notation sequence, and
  slide 20 says "Next up: ER to Relational Schema Mapping" — this refers to the public
  `/er-mapping` lesson (ER→Relational Mapping Explorer), per the README's MBI802 inventory.
  This numbering is internal to the deck's own narrative and does not necessarily match the
  README's file-numbering scheme for this doc set.
- `DM Mono` is imported in the CSS `@import` but no `.ecp` class in the transcribed slide
  markup visibly assigns it — it may be unused dead weight in the font import, or used
  implicitly somewhere not distinguished by a dedicated class; worth double-checking against
  rendered output if exact typography fidelity matters.
- No images/video/external assets are referenced — every visual is inline SVG authored
  directly in the slide HTML strings, so there are no external asset paths to relocate, and no
  external links to revalidate.
- `dangerouslySetInnerHTML` is used for every slide; since all content is developer-authored
  (no user input), this is safe as-is.
- Copyright line "© All Rights Reserved by Yasas Sri Wickramasinghe" appears on nearly every
  slide and should be preserved verbatim if regenerating.
