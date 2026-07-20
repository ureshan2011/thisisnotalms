# ER Activities — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/er-activities`
- **Source files:**
  - `src/pages/ERActivitiesPage.tsx` (26 lines) — thin page wrapper supplying hero copy to the
    shared shell and mounting the slide deck. Confirmed by full read: it imports and renders
    only `ERDiagramActivitiesDeck` — it does **not** import or render `VideoGallery` (see
    "Rebuild notes" below for the important discrepancy this creates vs. the gated copy of
    this lesson).
  - `src/components/slides/ERDiagramActivitiesDeck.tsx` (850 lines) — self-contained slide
    deck; all 12 slides' HTML/SVG markup is inline in a `SLIDES` array, plus the deck's own
    CSS (`DECK_CSS`) and player chrome.
  - `src/components/slides/VideoGallery.tsx` (168 lines) — generic, reusable video-clip
    gallery component. Documented here because it renders the `ADVANCED_ER_VIDEOS` data
    described below, but as read from source it is **not currently wired into the public
    `/er-activities` route** — see Rebuild notes.
  - `src/pages/student/CourseResources.tsx` (relevant excerpt: lines 84–121 define
    `ADVANCED_ER_VIDEOS`; line ~1755–1763 wires `ERDiagramActivitiesDeck` + `VideoGallery`
    together) — the gated Course Resources hub, where the video gallery is actually rendered
    today, immediately below a second copy of the same `ERDiagramActivitiesDeck` (for
    `lesson.id === 'er-activities'`).
  - `src/components/public/PublicLessonShell.tsx` — shared hero/nav/footer chrome (not
    MBI802-specific).
- **Depends on:**
  - `PublicLessonShell` for page chrome.
  - `lucide-react` icons: deck uses `ChevronLeft`, `ChevronRight`, `Maximize2`, `Minimize2`,
    `Maximize`, `Minimize`; `VideoGallery` uses `Film`, `Play`, `ExternalLink`.
  - Google Fonts `@import` inside `DECK_CSS`: `Playfair Display` and `DM Sans`.
  - `ResizeObserver` and the Fullscreen API (browser-native, no library).
  - `ADVANCED_ER_VIDEOS` (defined in `CourseResources.tsx`) — an array of 5 `VideoClip`
    objects pointing to SharePoint-hosted video recordings, each with a local thumbnail image
    under `public/` (`Intro.png`, `Activity1.png`…`Activity5.png`, resolved via
    `import.meta.env.BASE_URL`).
  - No Firestore reads/writes from either the deck or `VideoGallery` itself. `VideoGallery`'s
    generic `VideoClip` interface (`title`, `description?`, `url`, `thumbnailUrl?`,
    `embedUrl?`) is also reused by `NormalizationVideosPage.tsx` and
    `VideoLessonManager.tsx` elsewhere in the app — it is a shared, subject-agnostic
    component, not MBI802-specific.

## 1. Purpose & learning objectives

The hands-on companion to the `/er-diagrams` lecture deck: "Theory only sticks when you build
something." Five worked scenarios — a library, a university, a hospital, an online store, and
a hotel — each ask the learner to draw a complete Chen's-notation ER diagram (entities,
attributes, primary keys, relationships, cardinality) from a short written scenario, then
check their own diagram against a fully worked answer slide. The deck opens with a full
notation legend so students can self-check symbol usage before attempting each activity.

## 2. Full content

The deck is an ordered array of 12 slides in `ERDiagramActivitiesDeck.tsx`. Slide themes:
`s-title` (navy `#0b1728` title card), `s-legend` (navy `#0d1f36` notation reference),
`s-act` (cream `#fdfaf5` two-pane activity prompt), `s-ans` (light-grey `#f4f6fb` worked
answer diagram). Every slide's footer reads "© All Rights Reserved by Yasas Sri
Wickramasinghe".

**Slide 01 — Title**
- Eyebrow: "Database Design · Activity Series"
- Title: "ER Diagram Activities"
- Subtitle: "Chen's Notation · 5 Real-World Scenarios"

**Slide 02 — Notation Legend** ("Chen's Notation — Symbol Reference", subtitle "Use this
guide while completing each activity")
Eight symbol definitions, in two rows:
- **Entity** — filled blue rectangle — "A real-world object or concept"
- **Weak Entity** — double-outlined rectangle — "Depends on a strong entity"
- **Relationship** — filled brown diamond — "Association between entities"
- **Identifying Rel.** — double-outlined diamond — "Links weak entity to strong"
- **Attribute** — plain white ellipse — "Property of an entity"
- **Key Attribute** — blue-filled ellipse with underline — "Uniquely identifies entity (PK)"
- **Multi-valued** — double-outlined ellipse — "Can have multiple values"
- **Derived Attribute** — dashed-outline ellipse — "Calculated from other attributes"

A "Cardinality Notation" strip below shows three labeled example lines: One-to-One (1:1, "1"
at both ends), One-to-Many (1:N, "1" then "N"), Many-to-Many (M:N, "M" then "N").

**Slide 03 — Activity 01: Library Management System** (badge "Activity 01", blue theme)
Scenario text: "A **library** lends books to its members. Each **book** has an ISBN, title,
and genre. Each **member** has a member ID, name, and email address. A member can **borrow**
multiple books over time, and the same book may be borrowed by many different members. Each
borrowing transaction records a *borrow date* and a *return date*."
Entity pills: MEMBER, BOOK, BORROWS (relationship pill styled distinctly in amber).
Task list ("Your Task"):
- Identify all entities and their attributes
- Mark each primary key (underline it)
- Draw the BORROWS relationship with correct cardinality
- Add relationship attributes (BorrowDate, ReturnDate)
Illustration: a decorative row of colored book spines standing on a shelf, with an open book
below.

**Slide 04 — Answer 01: Library Management System**
Worked ER diagram (badge "Answer 01"), with a micro-legend (Entity/Relationship/Attribute
swatches) in the header. Diagram:
- **MEMBER** entity — attributes: MemberID (key, underlined), Name, Email.
- **BORROWS** relationship (diamond) between MEMBER and BOOK, cardinality **M** (member side)
  to **N** (book side), with relationship attributes BorrowDate and ReturnDate.
- **BOOK** entity — attributes: ISBN (key, underlined), Title, Genre.

**Slide 05 — Activity 02: University Course Enrollment** (badge "Activity 02", purple theme)
Scenario text: "A **university** manages student enrollments in courses. Each **student** has
a student ID, full name, and GPA. Each **course** has a course code, title, and number of
credits. Students can **enroll in** multiple courses each semester, and each course can have
many students enrolled. The enrollment records the *semester* and *grade* the student
received."
Entity pills: STUDENT, COURSE, ENROLLS_IN.
Task list:
- Identify all entities and their key attributes
- Determine the cardinality of the enrollment relationship
- Add Semester and Grade as relationship attributes
- Underline the primary key in each entity
Illustration: a decorative graduation-cap/mortarboard motif over a stack of books/blocks.

**Slide 06 — Answer 02: University Course Enrollment**
Worked diagram (badge "Answer 02"):
- **STUDENT** entity — attributes: StudentID (key, underlined), Name, GPA.
- **ENROLLS_IN** relationship (diamond) between STUDENT and COURSE, cardinality **M**
  (student side) to **N** (course side), with relationship attributes Semester and Grade.
- **COURSE** entity — attributes: CourseCode (key, underlined), Title, Credits.

**Slide 07 — Activity 03: Hospital Patient Management** (badge "Activity 03", red theme)
Scenario text: "A **hospital** manages doctors, patients, and departments. Each **doctor**
has a doctor ID, name, and specialization. Each **patient** has a patient ID, name, and date
of birth. Each **department** has a department ID and name. Each doctor **works in** exactly
one department (a department has many doctors). Doctors can **treat** many patients, and
patients may be treated by many doctors. Each treatment records a *treatment date*."
Entity pills: DOCTOR, PATIENT, DEPARTMENT, WORKS_IN, TREATS.
Task list:
- Draw all three entities with their attributes and PKs
- Show WORKS_IN (M:1) between DOCTOR and DEPARTMENT
- Show TREATS (M:N) between DOCTOR and PATIENT
- Add TreatmentDate as a relationship attribute on TREATS
Illustration: a decorative hospital-building icon with a cross motif and windows.

**Slide 08 — Answer 03: Hospital Patient Management**
Worked diagram (badge "Answer 03") — a three-entity layout, the most complex in the deck:
- **DOCTOR** entity — attributes: DoctorID (key, underlined), Name, Specialization.
- **WORKS_IN** relationship (diamond) between DOCTOR and DEPARTMENT, cardinality **M**
  (doctor side) to **1** (department side).
- **DEPARTMENT** entity — attributes: DeptID (key, underlined), DeptName.
- **TREATS** relationship (diamond) between DOCTOR and PATIENT, cardinality **M**/**N**, with
  relationship attribute TreatmentDate.
- **PATIENT** entity — attributes: PatientID (key, underlined), Name, DOB.

**Slide 09 — Activity 04: Online Store Orders** (badge "Activity 04", amber theme)
Scenario text: "An **online store** tracks customers, their orders, and products. Each
**customer** has a customer ID, name, and address. Each **product** has a product ID, name,
and unit price. Each **order** has an order ID and order date. A customer can **place** many
orders (each order belongs to one customer). An order can **contain** multiple products, and
a product can appear in many orders. Each order-line records the *quantity* ordered."
Entity pills: CUSTOMER, ORDER, PRODUCT, PLACES, CONTAINS.
Task list:
- Draw all three entities with their key attributes
- Show PLACES (1:N) between CUSTOMER and ORDER
- Show CONTAINS (M:N) between ORDER and PRODUCT
- Add Quantity as a relationship attribute on CONTAINS
Illustration: a decorative shopping-bag icon with product boxes and a price tag ("$24").

**Slide 10 — Answer 04: Online Store Orders**
Worked diagram (badge "Answer 04") — a three-entity, two-relationship chain:
- **CUSTOMER** entity — attributes: CustomerID (key, underlined), Name, Address.
- **PLACES** relationship (diamond) between CUSTOMER and ORDER, cardinality **1** (customer
  side) to **N** (order side).
- **ORDER** entity — attributes: OrderID (key, underlined), OrderDate.
- **CONTAINS** relationship (diamond) between ORDER and PRODUCT, cardinality **M** (order
  side) to **N** (product side), with relationship attribute Quantity.
- **PRODUCT** entity — attributes: ProductID (key, underlined), Name, Price.

**Slide 11 — Activity 05: Hotel Room Booking** (badge "Activity 05", green theme)
Scenario text: "A **hotel** manages guest reservations for its rooms. Each **guest** has a
guest ID, full name, and phone number. Each **room** has a room number, room type
(single/double/suite), and nightly rate. A guest can **book** multiple rooms over different
stays, and the same room can be booked by many guests across different periods. Each booking
records a *check-in date* and a *check-out date*."
Entity pills: GUEST, ROOM, BOOKS.
Task list:
- Identify all entities and their primary keys
- Determine the correct cardinality for BOOKS
- Add CheckInDate and CheckOutDate as relationship attributes
- Ensure all attributes connect to the correct entity or relationship
Illustration: a decorative hotel-building icon with a "HOTEL" sign and window grid.

**Slide 12 — Answer 05: Hotel Room Booking**
Worked diagram (badge "Answer 05"):
- **GUEST** entity — attributes: GuestID (key, underlined), Name, Phone.
- **BOOKS** relationship (diamond) between GUEST and ROOM, cardinality **M** (guest side) to
  **N** (room side), with relationship attributes CheckInDate and CheckOutDate.
- **ROOM** entity — attributes: RoomNo (key, underlined), Type, Rate.

There are no separate quiz questions in this deck beyond the five activity/answer slide
pairs described above — the "answer key" for each activity is its paired worked-diagram
slide.

### Video gallery content (`ADVANCED_ER_VIDEOS`, from `CourseResources.tsx` lines 84–121)

Five `VideoClip` entries, each a SharePoint video link with a local thumbnail (`public/*.png`,
resolved via `import.meta.env.BASE_URL`). Titles and descriptions, verbatim:

1. **"Advanced ER Activities – Introduction"** — "Introductory Video for the Adcanced ER
   Diagram Activities" (sic — "Adcanced" is a typo in the source description text).
   Thumbnail: `Intro.png`.
2. **"Advanced ER – Activity 1 Answer"** — "Discussion for the Activity 1". Thumbnail:
   `Activity1.png`.
3. **"Advanced ER – Activity 2 Answer"** — "Discussion for the Activity 2". Thumbnail:
   `Activity2.png`.
4. **"Advanced ER – Activity 3 Answer"** — "Discussion for the Activity 3". Thumbnail:
   `Activity3.png`.
5. **"Advanced ER – Activity 4 Answer"** — "Discussion for the Activity 4". Thumbnail:
   `Activity4.png`. Note: its `url` field is byte-for-byte identical to Activity 3's SharePoint
   link in the source (both point to the same `IQD5DSbZ...` share ID) — this looks like a
   copy-paste bug in the original data (the Activity 4 video may actually be unreachable /
   duplicates Activity 3's video). Flagged here, not fixed, per instructions not to invent
   content.
6. **"Advanced ER – Activity 5 Answer"** — "Discussion for the Activity 5". Thumbnail:
   `Activity5.png`.

Each entry has no `embedUrl`, so `VideoGallery` renders them as thumbnail cards that open the
SharePoint `url` in a new tab (no inline iframe playback) — see UI section below. All five
SharePoint URLs are long tokenized OneDrive/SharePoint "sharing link" URLs under
`myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/...` — these
are personal, access-controlled SharePoint links and should be revalidated (they may expire
or require the viewer to be signed into the college's SharePoint tenant).

## 3. UI & interaction design

**Page-level hero (`PublicLessonShell`):**
- Same shared shell as `/er-diagrams`. Eyebrow: "MBI802 · Data Modelling". Headline: "Let's
  make sense of **ER Diagrams in practice.**" Gradient:
  `linear-gradient(90deg, #1d4ed8, #3b82f6, #06b6d4)`; accent `#1d4ed8`, orb2 `#3b82f6`, orb3
  `#06b6d4`.
- Subtitle: "Theory only sticks when you build something. Model five real systems — a
  library, a university, a hospital, an online store and a hotel — and check your diagram
  against a worked answer."
- Topic pills: 📚 Library (`#1d4ed8`), 🎓 University (`#7c3aed`), 🏥 Hospital (`#dc2626`), 🛒
  Online Store (`#059669`), 🏨 Hotel (`#d97706`).

**Deck component (`ERDiagramActivitiesDeck`) — same player pattern as `ERDiagramsDeck`:**
- Dark player chrome (`#0f172a` background, blue-tinted border `rgba(29,78,216,0.3)`),
  traffic-light toolbar dots, monospace status readout: "MBI802 · ER Diagram Activities ·
  {current}/{total} · ← → to navigate".
- Same Expand/Collapse and Fullscreen toolbar buttons, same fixed 1920×1080 canvas scaled via
  `ResizeObserver`-driven CSS `transform: scale()`, same Prev/Next + dot-nav + arrow-key
  navigation (dot active color here is `#1d4ed8`, matching the page's blue theme instead of
  the teal used in `ERDiagramsDeck`).
- Activity slides (`s-act`) use a two-pane layout: a left text pane (badge, heading, scenario
  prose, entity pills, task-card) and a right pane with a decorative full-bleed SVG
  illustration themed to the scenario (books, graduation cap, hospital building, shopping bag,
  hotel building).
- Answer slides (`s-ans`) use a full-width header (badge, heading, micro-legend) above a
  large centered SVG ER diagram rendered with the shared visual language: entities as filled
  colored rectangles, relationships as filled colored diamonds, attributes as white/tinted
  ellipses, key attributes underlined.

**`VideoGallery` component (used only in the gated hub today — see Rebuild notes):**
- Renders a "Video Lessons" section header with a film icon, the clip count badge (e.g. "5
  clips"), then a responsive grid (`grid-cols-1` on mobile, `grid-cols-2` on `md+`) of video
  cards.
- Each card is a thumbnail (or a gradient-tinted placeholder with a film icon if no
  `thumbnailUrl`) with a centered play/external-link button overlay; clips without an
  `embedUrl` (all five `ADVANCED_ER_VIDEOS` entries) get an "Opens in new tab" badge and
  clicking opens `clip.url` via `window.open(..., '_blank', 'noreferrer')`. Clips with an
  `embedUrl` would instead toggle an inline `<iframe>` player with a "Close" button — that
  code path exists in the component but is unused by `ADVANCED_ER_VIDEOS` since none of the
  five entries set `embedUrl`.
- Below the thumbnail: title (bold) and description (grey, if present).
- Accepts an `accentColor` prop (used for icon/badge tinting and card border); the gated hub
  passes `accentColor="#0d7a72"` (teal) for the ER activities video gallery.

## 4. Component & state architecture

`ERActivitiesPage` (`src/pages/ERActivitiesPage.tsx`):
- Purely declarative, no local state — passes hero props to `PublicLessonShell` and renders
  `<ERDiagramActivitiesDeck />` as children. As read from source, it does not import or render
  `VideoGallery`.

`ERDiagramActivitiesDeck` (`src/components/slides/ERDiagramActivitiesDeck.tsx`):
- State shape is structurally identical to `ERDiagramsDeck`: `current` (0–11), `expanded`,
  `isFullscreen`, `scale`/`offset` (computed by `ResizeObserver`), `deckRef`/`wrapRef`.
- Same one-time `useEffect` pattern injecting a global `<style id="era-deck-styles">` tag
  (note the different id, `era-` vs. `er-`, avoiding collision if both decks were ever mounted
  on the same page).
- Same keyboard-nav `useEffect` (ArrowLeft/ArrowRight, ignored while an input/textarea has
  focus) and same fullscreen-state-sync `useEffect`.
- No Firestore reads/writes, no gating/scoring/badges. All slide content is static, baked
  into the `SLIDES` array.

`VideoGallery` (`src/components/slides/VideoGallery.tsx`):
- Props: `videos: VideoClip[]`, `accentColor?: string` (default `'#0d7a72'`).
- Local state: `playingIndex: number | null` — tracks which card (if any) has its inline
  iframe player open; only relevant for clips with an `embedUrl`.
- Returns `null` if `videos.length === 0`.
- No Firestore reads/writes; purely a presentational component driven entirely by its props.
- In `CourseResources.tsx`, the videos prop is composed as
  `[...ADVANCED_ER_VIDEOS, ...(dynamicVideoMap[`${course.id}_${lesson.id}`] ?? [])]` — i.e.
  the five static clips are always shown first, with any additional dynamically-added videos
  (from a Firestore-backed `dynamicVideoMap`, populated elsewhere in `CourseResources.tsx` /
  `VideoLessonManager.tsx`) appended after them. That Firestore-backed dynamic video layer is
  part of the gated hub's own infrastructure, not something `ERActivitiesPage`/
  `ERDiagramActivitiesDeck` know about or use.

## 5. Rebuild notes

- **Important discrepancy to flag:** the task of documenting this lesson assumed the public
  `/er-activities` page renders `VideoGallery` with `ADVANCED_ER_VIDEOS`. Having read
  `ERActivitiesPage.tsx` in full (26 lines) and the complete `ERDiagramActivitiesDeck.tsx`
  (850 lines), **neither file imports or renders `VideoGallery`**. The only place in the
  current codebase where `ERDiagramActivitiesDeck` and `VideoGallery`/`ADVANCED_ER_VIDEOS`
  are combined is the **gated** `src/pages/student/CourseResources.tsx`, under the MBI802
  `lesson.id === 'er-activities'` branch (around line 1755), where the deck and gallery are
  rendered together in a wrapping `<div>`. So today: the **public** `/er-activities` page is
  slide-deck-only (12 slides, no videos); the **gated** copy inside Course Resources shows
  the same 12-slide deck *plus* the 5-clip video gallery below it. This doc transcribes the
  video content anyway (per the task's request) since it is real content that exists in the
  repo and is closely associated with this lesson's subject matter, but a rebuilder should
  treat "does the public page get the video gallery too" as an open product decision, not an
  established fact recovered from source.
- The `ERDiagramActivitiesDeck` component itself is reused verbatim between the public route
  and the gated hub (same pattern as `ERDiagramsDeck`) — only the video gallery differs
  between the two surfaces.
- The Activity 4 / Activity 3 duplicate SharePoint URL (see section 2) should be re-sourced
  from the instructor before any rebuild ships a working video gallery — as-is, clicking
  "Advanced ER – Activity 4 Answer" opens the Activity 3 recording.
- Thumbnail images (`Intro.png`, `Activity1.png`…`Activity5.png`) are expected directly under
  the site's `public/` root (resolved via `${import.meta.env.BASE_URL}Intro.png` etc.) —
  confirm these files still exist in `public/` when rebuilding; they were not verified as
  part of this documentation pass (only the TSX source was read, not the `public/` directory
  listing).
- All five SharePoint links are long-lived personal OneDrive/SharePoint "sharing" URLs tied to
  the instructor's account (`yasas_wickramasinghe_yoobeecolleges_com1`) — these should be
  revalidated periodically since SharePoint sharing links can expire or have their permissions
  changed independently of this codebase.
- Google Fonts `@import` (`Playfair Display`, `DM Sans`) inside `DECK_CSS` has the same
  offline/self-hosting caveat noted in the `03-er-diagrams.md` doc.
- No quiz/scoring logic exists anywhere in this lesson; "grading" is self-directed (student
  compares their own diagram to the answer slide).
