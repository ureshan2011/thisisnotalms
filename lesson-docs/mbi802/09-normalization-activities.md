# Normalization Activities — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/normalisation-activities` (canonical). `/normalization-activities` (US
  spelling) is a permanent redirect to the canonical route, registered twice in
  `src/App.tsx` (once in the main route list, once in a duplicate route block later in the
  file).
- **Source files:** `src/pages/NormalizationActivitiesPage.tsx` (single self-contained
  file, 981 lines — all data, sub-components and the page itself live here; no external
  data files or Firestore reads)
- **Depends on:**
  - `src/components/ui/BrandLogo.tsx` — used in the hero (top-left, `variant="on-light"`,
    `iconSize={28}`, wrapped in a `Link` to `/home`) and again in the footer.
  - `react-router-dom` `Link` — logo-to-home link, and a text link to `/normalisation`
    ("Need a refresher? ›") which is the separate Normalization Explorer lesson.
  - `framer-motion` (`motion`, `AnimatePresence`, `Variants`) — all scroll/entrance
    animation.
  - No Firestore, no external APIs. Nothing is persisted; unlock state is local
    component `useState` only and resets on reload.

## 1. Purpose & learning objectives

A practice/drill lesson that follows the Normalization Explorer (`/normalisation`) lesson.
Where the Explorer *teaches* 1NF/2NF/3NF, this page tests whether the student can apply
that knowledge unaided: it presents seven small, realistic-looking database tables, in
deliberately shuffled order (not grouped by normal form), and asks the student to work out
independently what the highest normal form of each one is, then normalize it. No hints are
given — the task prompt is identical and non-revealing for every activity ("Work out the
highest normal form this table is in right now — then normalise it."), and the scenario
text never states or implies the answer. The intent (per the in-source design comment) is
that this can be used as an in-class exercise: each activity's worked answer is hidden
behind its own password, which the lecturer (Dr. Yasas Sri Wickramasinghe) hands out
verbally so the class can self-check after attempting it. One of the seven tables (Activity
4) is deliberately already in 3NF, to test whether students know when *not* to split a
table further.

Everything runs client-side in the browser; nothing is stored or submitted anywhere.

## 2. Full content

### Hero section

- Eyebrow: "Practice activities · Dr. Yasas Sri Wickramasinghe"
- H1: "Normalise it yourself." / (gradient text, red→orange→blue, `from-[#ff375f]
  via-[#ff9f0a] to-[#0071e3]`) "1NF · 2NF · 3NF"
- Subtitle: "Seven short tables, mixed up — they are not in order, and we don't tell you
  which form each one is in. For each table, work out the highest normal form it is in,
  then normalise it. Try it yourself first. Each answer has its own password, which your
  lecturer will share."
- Primary button "Start Activity 1" — smooth-scrolls to `#activity-1`.
- Secondary link "Need a refresher? ›" → `/normalisation`.

### "How to use this" section

Eyebrow: "How to use this". Title: "Read, decide, normalise, check". Sub: "Each activity
works the same way. Do your own answer first, then unlock the one here to check it."

Three cards:
1. 🔍 **Find the problem** — "Read the table. Where is the same value repeated, or where
   is a cell holding a list?"
2. 🏷️ **Name the form** — "Decide the highest normal form it is in now — 1NF, 2NF or 3NF.
   Some are already fine."
3. ✂️ **Split and check** — "Break it into clean tables, then unlock the answer to check
   your work."

### The shared task prompt

Every activity shows the identical instruction box (labelled "Your task"):

> Work out the highest normal form this table is in right now — then normalise it.

### Activity 1 — "The order lines table" (Online shop)

- Eyebrow: "Online shop". Password: `Mbi802-Order`. Accent color `#ff375f`.
- Scenario: "An online shop keeps its order lines in one table. The key is made of two
  columns, {OrderID, ProductID}. Look at what each column depends on."
- Table `Order_Items`, PK `{OrderID, ProductID}`. Columns: OrderID, ProductID,
  ProductName, Quantity.
  | OrderID | ProductID | ProductName | Quantity |
  |---|---|---|---|
  | O1 | P1 | Keyboard | 2 |
  | O1 | P2 | Mouse | 1 |
  | O2 | P1 | Keyboard | 3 |
  (ProductName cells flagged "bad" — repeated value.)
- **Answer — verdict:** "In 1NF — not in 2NF"
- **Why:** The key is `{OrderID, ProductID}`, but **ProductName** depends only on
  **ProductID** — just part of the key. This is a **partial dependency**, which is not
  allowed in 2NF. You can see "Keyboard" repeats every time P1 is ordered. Move
  ProductName into its own table.
- **Marked functional dependencies:**
  - `ProductID → ProductName` — bad — "Depends on only part of the key. This breaks 2NF."
  - `{OrderID, ProductID} → Quantity` — good — "You need both columns to know the
    quantity. This is fine."
- **Answer tables:**
  - `Products` (PK ProductID): {P1, Keyboard}, {P2, Mouse}
  - `Order_Items` (PK {OrderID, ProductID}): {O1,P1,2}, {O1,P2,1}, {O2,P1,3}
- **Closing:** "Keyboard" is now stored **once** in `Products`. If you rename it, you
  change one row. `ProductID` stays in `Order_Items` as a foreign key to join the two
  tables.

### Activity 2 — "The movies table" (Streaming service)

- Eyebrow: "Streaming service". Password: `Mbi802-Cast`. Accent `#0071e3`.
- Scenario: "A streaming app stores each movie with its cast in one column, separated by
  commas. Look at the table and decide what to do."
- Table `Movies`, PK `MovieID`. Columns: MovieID, Title, Actors.
  | MovieID | Title | Actors |
  |---|---|---|
  | M1 | Inception | DiCaprio, Hardy |
  | M2 | Titanic | DiCaprio, Winslet |
  | M3 | Joker | Phoenix |
  (Actors cells flagged "bad" — multi-valued.)
- **Verdict:** "Not in 1NF"
- **Why:** The **Actors** cell holds more than one value — "DiCaprio, Hardy" is two
  actors in one cell. 1NF says every cell must hold a single value, so this table breaks
  the first rule. Put each actor on its own row.
- **Marked FDs:** `MovieID → Title` — good — "One movie ID gives one title. This is
  fine."
- **Answer tables:** `Movie_Cast (1NF)` (PK {MovieID, Actor}): {M1,Inception,DiCaprio},
  {M1,Inception,Hardy}, {M2,Titanic,DiCaprio}, {M2,Titanic,Winslet}, {M3,Joker,Phoenix}.
- **Closing:** Every cell now holds one value, and the key is the pair
  `{MovieID, Actor}`. Now you can find every movie DiCaprio is in with
  `WHERE Actor = 'DiCaprio'`.

### Activity 3 — "The books table" (Library)

- Eyebrow: "Library". Password: `Mbi802-Shelf`. Accent `#30d158`.
- Scenario: "A library lists its books in one table. The key is a single column, BookID.
  Look at how the city is linked to the book."
- Table `Books`, PK `BookID`. Columns: BookID, Title, PublisherID, PublisherCity.
  | BookID | Title | PublisherID | PublisherCity |
  |---|---|---|---|
  | B1 | SQL Basics | PUB1 | London |
  | B2 | Data 101 | PUB1 | London |
  | B3 | Web Dev | PUB2 | Paris |
  (PublisherCity cells flagged "bad".)
- **Verdict:** "In 2NF — not in 3NF"
- **Why:** **PublisherCity** does not depend on the book directly. It depends on
  **PublisherID**, and PublisherID depends on BookID. So we have a chain:
  `BookID → PublisherID → PublisherCity`. This is a **transitive dependency**, which 3NF
  does not allow. "London" repeats for every book from PUB1. Move publishers into their
  own table.
- **Marked FDs:**
  - `PublisherID → PublisherCity` — bad — "PublisherID is not a key, so the city reaches
    BookID through it. This breaks 3NF."
  - `BookID → Title, PublisherID` — good — "Depends straight on the key. This stays in
    the Books table."
- **Answer tables:**
  - `Books` (PK BookID, cols BookID/Title/PublisherID (FK)): {B1,SQL Basics,PUB1},
    {B2,Data 101,PUB1}, {B3,Web Dev,PUB2}
  - `Publishers` (PK PublisherID): {PUB1,London}, {PUB2,Paris}
- **Closing:** Each publisher's city is now in `Publishers` once. If PUB1 moves city, you
  change **one row** instead of every book.

### Activity 4 — "The customers table" (Customer records) — already normalised

- Eyebrow: "Customer records". Password: `Mbi802-Loyal`. Accent `#5e5ce6`.
- Scenario: "A shop keeps its customers in this table. The key is a single column,
  CustomerID. Read it carefully — not every table needs changing."
- Table `Customers`, PK `CustomerID`. Columns: CustomerID, CustomerName, Email.
  | CustomerID | CustomerName | Email |
  |---|---|---|
  | C1 | Ravi | ravi@mail.com |
  | C2 | Mary | mary@mail.com |
  | C3 | Sara | sara@mail.com |
  (No cells flagged bad — this table has no problem to find.)
- **Verdict:** "Already in 3NF"
- **Why:** Every cell holds one value, so it is in 1NF. The key is a single column, so
  there are no partial dependencies — that gives 2NF for free. And both **CustomerName**
  and **Email** depend straight on CustomerID, with no chain in between, so it is in 3NF
  too. There is nothing to fix.
- **Marked FDs:** `CustomerID → CustomerName` — good — "Depends straight on the key.";
  `CustomerID → Email` — good — "Also depends straight on the key. No chain, no repeat."
- **Answer table (`alreadyOk: true`, so the answer section header reads "The table (no
  change needed)" instead of "The normalised tables"):** `Customers` unchanged, all cells
  marked "ok": {C1,Ravi,ravi@mail.com}, {C2,Mary,mary@mail.com}, {C3,Sara,sara@mail.com}.
- **Closing:** Watch out for tables like this — it is already in 3NF, so splitting it
  would only make things worse. Part of normalising is knowing when to stop.

### Activity 5 — "The student clubs table" (Student clubs)

- Eyebrow: "Student clubs". Password: `Mbi802-Club`. Accent `#ff9f0a`.
- Scenario: "A coordinator keeps each student's clubs in one column, separated by commas.
  Look at the table and decide what to do."
- Table `Student_Clubs`, PK `StudentID`. Columns: StudentID, StudentName, Clubs.
  | StudentID | StudentName | Clubs |
  |---|---|---|
  | S1 | Amal | Chess, Drama |
  | S2 | Nimal | Cricket |
  | S3 | Kamala | Art, Music, Dance |
  (Clubs cells flagged "bad" — multi-valued.)
- **Verdict:** "Not in 1NF"
- **Why:** The **Clubs** cell holds more than one value — "Chess, Drama" is two clubs in
  one cell. 1NF says every cell must hold a single value, so this table breaks the first
  rule. Put each club on its own row.
- **Marked FDs:** `StudentID → StudentName` — good — "One student ID gives one name.
  This is fine."
- **Answer tables:** `Student_Clubs (1NF)` (PK {StudentID, Club}): {S1,Amal,Chess},
  {S1,Amal,Drama}, {S2,Nimal,Cricket}, {S3,Kamala,Art}, {S3,Kamala,Music},
  {S3,Kamala,Dance}.
- **Closing:** Every cell now holds one value, and the key is the pair
  `{StudentID, Club}`. Now you can find who is in the Chess club with
  `WHERE Club = 'Chess'`.

### Activity 6 — "The appointments table" (Health clinic) — two partial dependencies

- Eyebrow: "Health clinic". Password: `Mbi802-Clinic`. Accent `#bf5af2`.
- Scenario: "A small clinic books appointments in one table. The key is the pair
  {PatientID, DoctorID}. This one has two repeated facts — find them both."
- Table `Appointments`, PK `{PatientID, DoctorID}`. Columns: PatientID, PatientName,
  DoctorID, DoctorName, Fee.
  | PatientID | PatientName | DoctorID | DoctorName | Fee |
  |---|---|---|---|---|
  | PT1 | Ravi | DR1 | Dr. Perera | $40 |
  | PT1 | Ravi | DR2 | Dr. Silva | $55 |
  | PT2 | Mary | DR1 | Dr. Perera | $40 |
  (PatientName and DoctorName cells flagged "bad".)
- **Verdict:** "In 1NF — not in 2NF"
- **Why:** Every cell holds one value, so it is in 1NF. But the key is
  `{PatientID, DoctorID}` and two columns depend on only part of it: **PatientName**
  needs only PatientID, and **DoctorName** needs only DoctorID. These are two **partial
  dependencies**, so it is not in 2NF. Split each one into its own table. After that the
  result is also in 3NF, because there are no more chains to fix.
- **Marked FDs:**
  - `PatientID → PatientName` — bad — "Needs only part of the key. Breaks 2NF."
  - `DoctorID → DoctorName` — bad — "Needs only the other part of the key. Also breaks
    2NF."
  - `{PatientID, DoctorID} → Fee` — good — "The fee depends on the patient and doctor
    together. This stays."
- **Answer tables:**
  - `Patients` (PK PatientID): {PT1,Ravi}, {PT2,Mary}
  - `Doctors` (PK DoctorID): {DR1,Dr. Perera}, {DR2,Dr. Silva}
  - `Appointments` (PK {PatientID, DoctorID}, cols PatientID/DoctorID/Fee):
    {PT1,DR1,$40}, {PT1,DR2,$55}, {PT2,DR1,$40}
- **Closing:** Three clean tables. Each patient and doctor name is stored once, and
  `Appointments` keeps only the two keys and the fee. No non-key column depends on
  another non-key column, so this is also in **3NF**. Nothing more to split.

### Activity 7 — "The employees table" (HR system)

- Eyebrow: "HR system". Password: `Mbi802-Payroll`. Accent `#0d9488`.
- Scenario: "This HR table lists employees and the department each one works in. The key
  is a single column, EmpID. Look at how DeptName is linked to the key."
- Table `Employees`, PK `EmpID`. Columns: EmpID, EmpName, DeptID, DeptName.
  | EmpID | EmpName | DeptID | DeptName |
  |---|---|---|---|
  | E1 | Sara | D1 | Sales |
  | E2 | John | D1 | Sales |
  | E3 | Lisa | D2 | IT |
  (DeptName cells flagged "bad".)
- **Verdict:** "In 2NF — not in 3NF"
- **Why:** **DeptName** does not depend on the employee directly. It depends on
  **DeptID**, and DeptID depends on EmpID. So we have a chain:
  `EmpID → DeptID → DeptName`. This is a **transitive dependency**, which 3NF does not
  allow. "Sales" repeats for every employee in D1. Move departments into their own
  table.
- **Marked FDs:**
  - `DeptID → DeptName` — bad — "DeptID is not a key, so DeptName reaches EmpID through
    it. This breaks 3NF."
  - `EmpID → EmpName, DeptID` — good — "Depends straight on the key. This stays in the
    Employees table."
- **Answer tables:**
  - `Employees` (PK EmpID, cols EmpID/EmpName/DeptID (FK)): {E1,Sara,D1}, {E2,John,D1},
    {E3,Lisa,D2}
  - `Departments` (PK DeptID): {D1,Sales}, {D2,IT}
- **Closing:** Each department name is now in `Departments` once. To rename "Sales" to
  "Revenue", you change **one row** instead of every employee.

### Footer

Logo, then: "Database Normalisation practice activities, made by **Dr. Yasas Sri
Wickramasinghe**." followed by "Everything runs in your browser. No data is stored."

## 3. UI & interaction design

- Apple-style design system shared with the sibling Normalization Explorer lesson: font
  stack `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter",
  "Helvetica Neue", system-ui, sans-serif`; palette built around `#1d1d1f` (near-black
  text), `#6e6e73` (secondary text), `#f5f5f7` (light gray section background), and a
  rotating set of accent colors per activity (`#ff375f` red, `#0071e3` blue, `#30d158`
  green, `#5e5ce6` indigo, `#ff9f0a` orange, `#bf5af2` purple, `#0d9488` teal).
- Custom cubic-bezier ease `[0.16, 1, 0.3, 1]` used throughout for all `framer-motion`
  transitions.
- **Hero**: min-height 88vh, centered, two large blurred color-orb divs
  (`blur-3xl`, low-opacity radial washes) positioned absolutely behind the content for
  depth; logo pinned top-left; staggered entrance animation (eyebrow → H1 → subtitle →
  CTA row, delays 0/0.05/0.15/0.25s).
- **"How it works" section**: light-gray full-bleed band, 3-column card grid
  (`md:grid-cols-3`), each card has an emoji icon in a tinted rounded square, revealed
  with a `stagger`/`item` variants combo (0.09s stagger between cards) triggered by
  `whileInView`.
- **Activities**: rendered as a plain `.map()` over `ACTIVITIES`, each wrapped in a
  `<section id={"activity-" + id}>` with alternating background (`odd sections =
  bg-[#f5f5f7]`, even = white) via `i % 2 === 1`. Each section uses the `Reveal` wrapper
  (fade-up on scroll into view, `viewport={{ once: true, margin: '-80px' }}`, 0.8s
  duration).
- **ActivityCard** layout (max-width 3xl, centered): numbered accent-colored badge (the
  activity id) + eyebrow ("Activity N · <context>") + title; scenario paragraph; the data
  table with a colored Pill (table name) and monospace "PK: …" caption; a "Your task" box
  (tinted border/background in the activity's accent color) with the shared instruction
  text; then the gated answer.
- **DataTable**: a generic Apple-styled table component — colored header row
  (`headColor` prop, defaults per-caller), white body, subtle row dividers
  (`border-black/[0.05]`), horizontal scroll container for overflow. Cells can carry a
  `CellKind` (`pk` | `fk` | `ok` | `bad` | `mut`) that tints background/text: pk = blue
  tint bold, fk = indigo tint medium, ok = green tint medium, bad = red tint medium, mut
  (defined in the type but unused in this file's activity data) = yellow tint bold.
- **AnswerGate** (the password lock): dashed-border rounded panel, lock emoji 🔒 in a
  tinted square, "The answer is locked" heading, helper copy about trying it yourself
  first, then a password `<input type="password">` + "Unlock" button (pill-shaped, filled
  with the activity's accent color) in a form; wrong password shows an inline red error
  message ("Wrong password. Try again.") that fades in/out via `AnimatePresence`; on
  success the gate swaps to a fade+slide-up reveal of the `AnswerBody`.
- **AnswerBody** (post-unlock): pale green card (`bg-[#f6fdf8]`, green-tinted border),
  "Answer" label + colored verdict pill, the "why" prose, a "The dependencies" list of FD
  chips (`Dep` component — monospace pill, green/red tone) each paired with an
  explanatory note in a bordered/tinted row, then "The normalised tables" (or "The table
  (no change needed)" when `alreadyOk`) rendering each resulting table via `DataTable`,
  and finally a closing takeaway line in a soft white card.
- No client-side routing beyond two links (`/home` via logo, `/normalisation` via the
  "Need a refresher?" link) and one in-page smooth-scroll button ("Start Activity 1" →
  `#activity-1`).
- Fully responsive: grids collapse to 1 column below `md`/`sm` breakpoints; tables scroll
  horizontally on narrow viewports (`overflow-x-auto` wrapper) rather than wrapping.

## 4. Component & state architecture

- **Top-level state**: none at the page level — `NormalizationActivitiesPage` is a pure
  render of static hero/how-it-works markup plus a `.map()` over the module-level
  `ACTIVITIES` constant.
- **`ACTIVITIES: Activity[]`** — a hardcoded array of 7 objects (module scope, defined
  once, never mutated) fully described in Section 2. Each activity carries its own
  `password: string` and all display data (scenario table rows/headers, verdict,
  functional-dependency notes, resulting decomposed tables, closing note).
- **Per-activity unlock state** lives inside `AnswerGate`, one instance per
  `ActivityCard`, each with independent `useState` for `value` (password field text),
  `error` (boolean, shows red message), and `unlocked` (boolean, gates whether
  `AnswerBody` renders). State is **not lifted** — unlocking Activity 3's answer has no
  effect on any other activity, and nothing persists across reloads (no localStorage, no
  Firestore, no URL state).
- Password check is a plain string equality (`value.trim() === password`) done entirely
  client-side inside the `AnswerGate` component — the correct passwords are shipped in
  the bundled JS (`ACTIVITIES[i].password`), so they are not secret from anyone who reads
  the source, only from a casual student browsing the rendered page.
- No Firestore reads/writes anywhere in this file. No scoring, no badge triggers, no
  gating beyond the in-memory password unlock per activity.
- Reusable local sub-components (all defined in this same file, not exported): `Reveal`
  (scroll-reveal wrapper), `SectionHead` (eyebrow/title/sub heading block), `DataTable`
  + `cellCls` (generic colored table), `Pill` (rounded label chip), `Dep` (monospace FD
  chip), `AnswerGate`, `AnswerBody`, `ActivityCard`.
- Types: `CellKind`, `TCell`, `AnswerTable`, `MarkedFd`, `Activity` — all defined at
  module scope in this file, not imported from elsewhere.

## 5. Rebuild notes

- The whole lesson is one file with no external content dependencies (no Firestore, no
  CMS, no markdown) — the entire ACTIVITIES array in Section 2 above is the complete
  content model; rebuilding is mostly a matter of recreating the sub-components and
  pasting the data back in.
- The seven per-activity passwords (`Mbi802-Order`, `Mbi802-Cast`, `Mbi802-Shelf`,
  `Mbi802-Loyal`, `Mbi802-Club`, `Mbi802-Clinic`, `Mbi802-Payroll`) are visible in the
  client bundle; treat them as "in-class convenience locks," not real access control, if
  rebuilding.
- `App.tsx` registers this route twice (once in what appears to be a primary route list
  around line 98, again in what looks like a duplicate/legacy route block around line
  183) plus a `/normalization-activities` → `/normalisation-activities` redirect in both
  places. This duplication exists elsewhere in the router too and appears to be an
  intentional pattern in this codebase (e.g. two parallel route trees), not unique to
  this lesson — worth confirming against `src/App.tsx` in full if rebuilding routing.
  Page component itself is lazy-loaded (`React.lazy`).
- The `CellKind` type includes a `'mut'` (yellow) variant that is defined in
  `cellCls()`/the type union but never actually used by any row in `ACTIVITIES` — dead
  styling code, harmless to keep or drop.
- The link "Need a refresher? ›" points to `/normalisation` (singular route, no
  trailing content), which is the separate Normalization Explorer lesson — not
  documented in this file; treat as an external dependency/cross-reference only.
- No images, videos, or other binary assets are used by this page — it is 100% styled
  markup and inline SVG-free emoji.
