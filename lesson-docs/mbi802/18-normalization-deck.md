# Database Normalization & Functional Dependencies (Slide Deck) — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Gated (student/staff login required via `/student/course-resources`), **plus** an
  additional score-based lock layered on top for students only: a student must have a
  `erMcqResults/{uid}` Firestore document whose `bestPercentage` field is **strictly greater than
  50** before this lesson unlocks. Staff (`lecturer` / `teachingAssistant` roles) never see this
  lock — `isStaff` short-circuits the gate entirely. A student who has never attempted the ER
  Knowledge Check (no `erMcqResults` doc at all) also sees it locked, because the missing-doc case
  defaults `best` to `0`. This is the **gated slide-deck** version of the normalization material —
  see Rebuild note in §5 distinguishing it from the public `/normalisation` interactive explorer,
  which is a *different component* documented in a separate lesson-docs file and is **not** this
  one.
- **Route(s):** `/student/course-resources` (no dedicated route of its own — rendered inline as
  lesson `id: 'normalization'` inside the MBI802 tab; NOT the same as the public
  `/normalisation` route, which uses a different component entirely).
- **Source files:**
  - `src/components/slides/NormalizationDeck.tsx` (1147 lines) — the entire 20-slide deck: the
    `DECK_CSS` template string (lines 4–78), the `SLIDES` array of slide objects (lines 80–1006),
    and the `NormalizationDeck` component itself (lines 1008–1147) which handles navigation,
    responsive scaling, and fullscreen.
  - `src/pages/student/CourseResources.tsx` — hosts the lesson: the `lessons` array entry for
    `id: 'normalization'` (lines 213–219), the `NORMALIZATION_VIDEOS` array (lines 123–148), the
    `erMcqPassed` state and its Firestore-driven `useEffect` (lines 1480, 1493–1515), the gating
    boolean (line 1742), the `LessonRow` locked-state UI (lines 1373–1467), and the render site
    that mounts `<NormalizationDeck />` plus `<VideoGallery>` (lines 1774–1782).
  - `src/components/slides/VideoGallery.tsx` — generic video-gallery component reused across many
    lessons; renders the `NORMALIZATION_VIDEOS` array underneath the deck.
- **Depends on:**
  - `lucide-react` icons: `ChevronLeft`, `ChevronRight`, `Maximize2`, `Minimize2`, `Maximize`,
    `Minimize` (deck controls) and, in the host page, `Lock` (locked-lesson-row icon).
  - Google Fonts `DM Sans` and `DM Mono`, loaded via `@import` inside the injected `DECK_CSS`
    string.
  - Browser `ResizeObserver` API and the Fullscreen API (`requestFullscreen` /
    `document.exitFullscreen`) — no external libraries for slide rendering; each slide is raw HTML
    rendered via `dangerouslySetInnerHTML` at a fixed 1920×1080 canvas that is CSS-scaled to fit
    its container.
  - Firestore collection **`erMcqResults`**, document ID = the student's `user.uid`, field
    `bestPercentage: number` — read-only from this lesson's perspective (the write happens in the
    ER Knowledge Check lesson, `ERMcq` component, not documented here).
  - Firestore collection **`students`**, document ID = `user.uid` — read for `subjects` (course
    enrollment) and passed down as `studentProfile`, used elsewhere in the page but not directly
    by `NormalizationDeck` itself.
  - Four external SharePoint video links (`myacg-my.sharepoint.com`) via `NORMALIZATION_VIDEOS`,
    rendered by the shared `VideoGallery` component underneath the deck.

## 1. Purpose & learning objectives

A 20-slide, fixed-aspect (1920×1080, letterboxed/scaled) presentation deck teaching database
normalization from first principles: why unnormalized tables cause update/insertion/deletion
anomalies, what functional dependencies are, and how to progressively normalize a schema through
1NF → 2NF → 3NF → BCNF, finishing with the formal theory of decomposition (lossless-join and
dependency-preservation) and three hands-on practice activities with worked answers embedded
directly in the deck.

This is the **gated slide-deck treatment** of normalization inside the MBI802 Course Resources
hub — it is a self-contained lecture-style deck built as one large `SLIDES` array of raw HTML
strings rendered inside a scaled `<section>` canvas, navigated slide-by-slide with prev/next
controls, a dot-indicator strip, and fullscreen support. It is deliberately distinct from the
**public, non-gated** `/normalisation` route, which is a separate interactive explorer component
documented elsewhere in this doc set — the two cover overlapping subject matter (normal forms,
functional dependencies) but are different React components with different UI paradigms, live at
different URLs, and are gated differently (the public explorer needs no login at all; this deck
needs both an MBI802 login *and* a passing ER Knowledge Check score). Do not conflate the two.

The lesson exists to formalize what "cleaning up" a database schema means, using concrete anomaly
examples (a Student_Courses table, a library, an online store, a hospital, course scheduling) that
build toward the abstract rules, then immediately tests understanding via three activities with
answers revealed on a following slide (or, for Activity 3, on the same slide).

It is placed deliberately *after* the ER Knowledge Check in the MBI802 lesson order and is locked
until a student scores above 50% on that quiz — the implicit pedagogical rationale (per the
platform's gating pattern) is that a student should demonstrate baseline ER/relational modelling
competency before being given the more advanced normalization material.

## 2. Full content

The deck is a `SLIDES` array of 20 objects (`{ classes, label, html, bg? }`), each rendered inside
a `.norm section` canvas. Every slide's actual transcribed content, in order:

**Slide 1 — "01 Title"** (dark theme)
- Badge: "CS / Database Systems"
- Main title: "Database **Normalization** & Functional Dependencies" (the word "Normalization" is
  highlighted in amber)
- Subtitle: "Understanding 1NF, 2NF, 3NF, BCNF and Decomposition with real-world examples and
  hands-on activities."
- Footer on every slide: "© All rights reserved · Yasas Sri Wickramasinghe"
- Decorative background: a faint grid pattern SVG overlay and two amber circles bottom-right.

**Slide 2 — "02 Why Normalize"**
- Section label: "The Problem"
- Title: "What goes wrong without normalization?"
- An "⚠ Unnormalized table: Student_Courses" table with columns StudentID, StudentName, Dept,
  DeptHead, Courses, Instructor, and rows:
  - S1, Alice, CS, Dr. Smith, "DB, OS, Networks", "Prof. Lee, Prof. Ray, Prof. Kim"
  - S2, Bob, CS, Dr. Smith, "DB, AI", "Prof. Lee, Prof. Patel"
  - S3, Carol, Math, Dr. Jones, "Calculus", "Prof. Wang"
  - S3, Carol, Math, Dr. Jones, "Statistics", "Prof. Hill"
- Three anomaly cards:
  - 🔴 **Update Anomaly**: "If Dr. Smith leaves, we must update *every row* for CS students — miss
    one and data is inconsistent." Example: `DeptHead = "Dr. Smith" repeated in S1 AND S2 rows`.
  - 🟡 **Insertion Anomaly**: "We cannot add a new department unless at least one student is
    enrolled in it — student data is required!" Example: `Can't record "Physics dept, Head: Dr.
    Gupta" alone`.
  - 🔵 **Deletion Anomaly**: "If Carol drops Statistics, we lose the fact that Prof. Hill teaches
    Statistics entirely from our database." Example: `Deleting S3's Statistics row erases Prof.
    Hill's record`.

**Slide 3 — "03 Functional Dependencies"** (dark theme)
- Section label: "Core Concept"; Title: "Functional Dependencies"
- Left column:
  - "Attribute **Y** is *functionally dependent* on **X** if knowing X uniquely determines the
    value of Y."
  - Formula box: `X → Y`
  - Caption: '"X determines Y" · "Y depends on X"'
  - "Key Terminology" list:
    - **Determinant** — the left-hand side (X)
    - **Dependent** — the right-hand side (Y)
    - **Candidate Key** — minimal set that determines all attributes
    - **Prime Attribute** — part of any candidate key
- Right column, "Real-world examples":
  - `StudentID → StudentName` — "One student ID maps to exactly one name"
  - `Dept → DeptHead` — "Each department has exactly one head"
  - `{OrderID, ProductID} → Quantity` — "Composite key: need both to know the quantity"

**Slide 4 — "04 Visual: 1NF"**
- NF progress bar: 1NF (active), 2NF, 3NF, BCNF
- Title: "1NF in a Nutshell: Break apart the lists"
- Visual: a box `[ 🍎, 🍌, 🍒 ]` labelled "Multi-valued (Bad)" with an arrow to three separate boxes
  🍎 / 🍌 / 🍒 labelled "Atomic Values (Good)"
- Rule text: "One single value per cell. No lists or arrays allowed!"

**Slide 5 — "05 1NF Concept"**
- NF bar: 1NF active
- Title: "First Normal Form (1NF)"
- Definition callout: "A table is in 1NF if every cell contains a single, atomic (indivisible)
  value and each column holds only one type of data."
- "Rules to satisfy 1NF":
  - No multi-valued attributes (no lists in a cell)
  - No repeating groups of columns
  - Each row must be uniquely identifiable (primary key exists)
  - All values in a column must be the same data type
- "❌ Violates 1NF" table (OrderID, Products): `101 → "Laptop, Mouse, Keyboard"`,
  `102 → "Monitor, HDMI Cable"`. Caption: "Multiple values in the 'Products' cell — not atomic!"
- "✅ Satisfies 1NF" table (OrderID, Product), one row per product: 101/Laptop, 101/Mouse,
  101/Keyboard, 102/Monitor.

**Slide 6 — "06 1NF Example"**
- NF bar: 1NF active
- Title: "1NF — Library Book Example"
- "Before 1NF" badge, subtitle "Member borrows multiple books". Table (MemberID, Name,
  BooksCheckedOut, ReturnDates):
  - M1, Alice, "Harry Potter, Dune", "Dec 1, Dec 5"
  - M2, Bob, "1984, Brave New World, Hobbit", "Dec 3, Dec 3, Dec 10"
- Callout: "Problems: BooksCheckedOut and ReturnDates are multi-valued. You can't query 'who has
  Dune?' easily. Dates are ambiguously paired."
- "After 1NF" badge, subtitle "One book per row". Table (MemberID, Name, Book, ReturnDate):
  - M1, Alice, Harry Potter, Dec 1
  - M1, Alice, Dune, Dec 5
  - M2, Bob, 1984, Dec 3
  - M2, Bob, Brave New World, Dec 3
  - M2, Bob, The Hobbit, Dec 10
- Callout: "PK: (MemberID, Book) — composite key. Every cell is atomic. Easy to query!"

**Slide 7 — "07 Visual: 2NF"**
- NF bar: 1NF done, 2NF active
- Title: "2NF in a Nutshell: Rely on the WHOLE key"
- Visual 1: "🔑 Student + 🔑 Course" → "Course Grade ✅" (green, valid)
- Visual 2: "🔑 Student (Only part of the key)" → "Student Phone ❌" (red dashed, invalid)
- Rule text: "No 'partial' dependencies. If your table has a two-part key, every other column must
  need BOTH parts to exist."

**Slide 8 — "08 2NF Concept"**
- NF bar: 1NF done, 2NF active
- Title: "Second Normal Form (2NF)"
- Definition callout: "A table is in 2NF if it is in 1NF *and* every non-prime attribute is *fully
  functionally dependent* on the entire primary key (no partial dependencies)."
- Callout: "Partial Dependency: A non-key attribute depends on only *part* of a composite primary
  key."
- Note: "Only matters when the PK is composite" — "If the primary key is a *single* attribute, the
  table is automatically in 2NF (there's nothing to partially depend on)."
- "Spotting the violation" box: Table `OrderItem (OrderID, ProductID, ProductName, Qty)`,
  `PK = {OrderID, ProductID}`. Dependencies shown:
  - `{OrderID, ProductID} → Qty` ✅ FULL
  - `ProductID → ProductName` ❌ PARTIAL
  - Note: "ProductName only depends on ProductID, not the full composite key. This is a partial
    dependency!"

**Slide 9 — "09 2NF Example"**
- NF bar: 1NF done, 2NF active
- Title: "2NF — Online Store Example"
- "Before 2NF" badge, `PK = {OrderID, ProductID}`. Table (OrderID, ProductID, ProductName,
  UnitPrice, CustomerName, Qty):
  - O1, P10, Laptop, $999, Alice, 1
  - O1, P20, Mouse, $29, Alice, 2
  - O2, P10, Laptop, $999, Bob, 1
  - Caption: "ProductName & UnitPrice depend only on ProductID. CustomerName depends only on
    OrderID. Both are partial!"
- Decomposition into three tables:
  - **Orders** (PK: OrderID) — OrderID, CustomerName: O1/Alice, O2/Bob
  - **Products** (PK: ProductID) — ProductID, ProductName, UnitPrice: P10/Laptop/$999,
    P20/Mouse/$29
  - **OrderItems** (PK: {OrderID, ProductID}) — OrderID, ProductID, Qty: O1/P10/1, O1/P20/2,
    O2/P10/1

**Slide 10 — "10 Visual: 3NF"**
- NF bar: 1NF done, 2NF done, 3NF active
- Title: "3NF in a Nutshell: Cut the Chain (No Middlemen)"
- Visual chain: "🧍 Employee" → "🏢 Department" → "📞 Dept Phone" (last arrow red, indicating the
  bad transitive link), then a ✂️ emoji, then split into:
  - Table 1: 🧍 ➔ 🏢
  - Table 2: 🏢 ➔ 📞
- Rule text: "No 'transitive' dependencies. If A finds B, and B finds C... take B and C and put
  them in their own separate table!"

**Slide 11 — "11 3NF Concept"**
- NF bar: 1NF done, 2NF done, 3NF active
- Title: "Third Normal Form (3NF)"
- Definition callout: "A table is in 3NF if it is in 2NF *and* no non-prime attribute is
  *transitively dependent* on the primary key."
- Callout: "Transitive Dependency: A → B and B → C, therefore A → C. C depends on A *indirectly*
  through B. B and C are both non-prime."
- Dependency chain shown: `StudentID → ZipCode`, `ZipCode → City`, and the resulting (bad)
  `StudentID → City (transitive — via ZipCode)`. Note: "City should NOT be in the Students table."
- "The Intuition" box:
  - Employee Table (violates 3NF): `EmpID → Dept → DeptPhone`; `EmpID → DeptPhone (transitive!)`
    (highlighted red)
  - Fix — split into two tables: `Employees(EmpID, Name, DeptID)` and
    `Departments(DeptID, DeptPhone)`

**Slide 12 — "12 3NF Example"**
- NF bar: 1NF done, 2NF done, 3NF active
- Title: "3NF — Hospital Employee Example"
- "Before 3NF" badge, `PK: EmpID`. Table (EmpID, EmpName, DeptID, DeptName, DeptLocation):
  - E1, Alice, D1, Cardiology, Floor 3
  - E2, Bob, D1, Cardiology, Floor 3
  - E3, Carol, D2, Neurology, Floor 5
  - Caption: "EmpID → DeptID → DeptName, DeptLocation. DeptName and DeptLocation are transitively
    dependent on EmpID!"
- Decomposition:
  - **Employees** (PK: EmpID) — EmpID, EmpName, DeptID: E1/Alice/D1, E2/Bob/D1, E3/Carol/D2
  - **Departments** (PK: DeptID) — DeptID, DeptName, DeptLocation: D1/Cardiology/Floor 3,
    D2/Neurology/Floor 5
  - Callout: "If Cardiology moves floors, we update **one row** — no anomaly!"

**Slide 13 — "13 BCNF"**
- NF bar: 1NF done, 2NF done, 3NF done, BCNF active
- Title: "Boyce–Codd Normal Form (BCNF)"
- Definition callout: "For every non-trivial FD X → Y, X must be a **superkey** (a key that
  uniquely identifies rows). This is stricter than 3NF."
- Callout: "3NF vs BCNF: 3NF allows FDs where the right side is a prime attribute. BCNF does not —
  the left side must always be a superkey."
- Note: "A table can be in 3NF but *not* BCNF when there are **overlapping candidate keys**. BCNF
  may not always preserve all functional dependencies — a trade-off to be aware of."
- "Classic BCNF example — Course Scheduling" table (Student, Subject, Teacher):
  - Alice, Math, Prof. Taylor
  - Alice, Science, Prof. Adams
  - Bob, Math, Prof. Lee
  - Bob, Science, Prof. Adams
  - FDs: `{Student, Subject} → Teacher`, `Teacher → Subject`. Note: "Teacher is NOT a superkey!
    Violates BCNF."
  - Decomposition:
    - **TeacherSubject**: Teacher, Subject — Prof. Taylor/Math, Prof. Lee/Math, Prof. Adams/Science
    - **StudentTeacher**: Student, Teacher — Alice/Prof. Taylor, Alice/Prof. Adams, Bob/Prof. Lee

**Slide 14 — "14 Decomposition"** (dark theme)
- Section label: "Key Concept"; Title: "Decomposition"
- Intro: "Decomposition is the process of splitting one relation into two or more relations to
  eliminate anomalies. A good decomposition must satisfy two properties:"
- **1. Lossless-Join Decomposition**: "Joining the decomposed tables back together must reproduce
  the *exact* original relation — no spurious (fake) tuples, no lost data." Formula:
  `R = R₁ ⋈ R₂ (natural join)`
- **2. Dependency-Preserving Decomposition**: "Every functional dependency in the original
  relation can still be enforced in the decomposed tables without needing to join them." Formula:
  `F ≡ F₁ ∪ F₂ (FDs preserved in sub-relations)`
- "The Trade-off": "BCNF always guarantees **lossless-join**, but may **lose dependency
  preservation**. 3NF guarantees both lossless-join AND dependency preservation — which is why
  it's often the practical target in real systems."
- "Practical guide to decomposition":
  - Find a violating FD: X → Y (X is not a superkey)
  - Create new table: (X ∪ Y) with X as PK
  - Remove Y from original table
  - Repeat until all FDs are satisfied

**Slide 15 — "15 Activity 1 Question"** (amber-tinted background)
- Big "1" watermark. Section label: "Activity 1 — Identify the Normal Form"
- Title: "Which normal form is violated?"
- Table "University Enrollment" (StudentID 🔑, CourseID 🔑, StudentName, CourseName, Grade):
  - S1, C101, Alice, Databases, A
  - S1, C102, Alice, Algorithms, B
  - S2, C101, Bob, Databases, A
  - S2, C103, Bob, Networks, C
- "Known Functional Dependencies": `{StudentID, CourseID} → Grade`, `StudentID → StudentName`,
  `CourseID → CourseName`
- Question box: "Question: What normal form is violated, and why? Consider each functional
  dependency. Does every non-prime attribute depend on the *full* composite primary key? Hint:
  Look at StudentName and CourseName. → See next slide for the answer"

**Slide 16 — "16 Activity 1 Answer"** (green-tinted background)
- Big "1" watermark. Section label: "Activity 1 — Answer"
- Title: "Violates 2NF"
- Answer box — "Violation: Partial Dependencies": "**StudentName** depends only on StudentID
  (partial). **CourseName** depends only on CourseID (partial). Both are non-prime attributes that
  should depend on the *entire* key."
- Dependencies: `StudentID → StudentName` ❌ Partial, `CourseID → CourseName` ❌ Partial,
  `{StudentID, CourseID} → Grade` ✅ Full
- "Fix: Decompose into 3 tables":
  - **Students(StudentID PK, StudentName)**: S1/Alice, S2/Bob
  - **Courses(CourseID PK, CourseName)**: C101/Databases, C102/Algorithms
  - **Enrollment(StudentID, CourseID, Grade)**: S1/C101/A, S1/C102/B

**Slide 17 — "17 Activity 2 Question"** (light purple background `#fdf4ff`)
- Big "2" watermark. Section label: "Activity 2 — Normalize to 3NF"
- Title: "Find the transitive dependency"
- Table "Employee_Project" (EmpID 🔑, EmpName, ProjectID, ProjectName, ManagerID, ManagerPhone):
  - E1, Alice, P1, Apollo, M1, 555-0101
  - E2, Bob, P1, Apollo, M1, 555-0101
  - E3, Carol, P2, Beacon, M2, 555-0202
- "Functional Dependencies": `EmpID → EmpName, ProjectID, ManagerID`, `ProjectID → ProjectName`,
  `ManagerID → ManagerPhone`
- "Your task": Assume this table is already in 2NF; Find all transitive dependencies; Decompose
  into tables that satisfy 3NF. "→ See next slide for the answer"

**Slide 18 — "18 Activity 2 Answer"** (light purple background `#fdf4ff`)
- Big "2" watermark. Section label: "Activity 2 — Answer"
- Title: "Decomposed into 3NF"
- Answer box — "Transitive Dependencies Found": `EmpID → ProjectID → ProjectName`,
  `EmpID → ManagerID → ManagerPhone`. Note: "ProjectName and ManagerPhone are not directly
  determined by EmpID — they travel through intermediate attributes."
- Callout: "Fix: Extract each transitive dependency into its own table. Keep only direct
  dependencies in the original."
- Decomposition:
  - **Employees(EmpID PK, EmpName, ProjectID FK, ManagerID FK)**: E1/Alice/P1/M1, E2/Bob/P1/M1
  - **Projects(ProjectID PK, ProjectName)**: P1/Apollo, P2/Beacon
  - **Managers(ManagerID PK, ManagerPhone)**: M1/555-0101, M2/555-0202

**Slide 19 — "19 Activity 3"** (light orange background `#fff7ed`) — question and answer combined
on one slide (unlike Activities 1 and 2, which split question/answer across two slides)
- Big "3" watermark (amber). Section label: "Activity 3 — BCNF Challenge"
- Title: "Is this table in BCNF?"
- Table "Advising (Student, Advisor, Department)":
  - Alice, Dr. Smith, CS
  - Alice, Dr. Jones, Math
  - Bob, Dr. Smith, CS
  - Carol, Dr. Jones, Math
- "Functional Dependencies": `{Student, Department} → Advisor`, `Advisor → Department`
- Note: "Candidate keys: {Student, Department} and {Student, Advisor}"
- "Questions to answer": Is this table in 3NF? Why? / Is this table in BCNF? Why? / If not in
  BCNF, decompose it / Is decomposition lossless? Dependency-preserving?
- **Answer** (shown directly below, same slide):
  - "3NF? Yes — Advisor is a prime attribute."
  - "BCNF? No — Advisor → Dept, but Advisor is not a superkey."
  - "Decompose: R1(Advisor, Dept) · R2(Student, Advisor)."
  - "Lossless? Yes — Advisor is PK of R1."
  - "Dep-preserving? No — {Student, Dept}→Advisor is lost."

**Slide 20 — "20 Summary"** (dark theme)
- Section label: "Summary"; Title: "Normal Forms — Quick Reference"
- Four summary cards:
  - **1NF** (red): "Every cell is atomic. No repeating groups. A primary key exists." Fix: "one
    value per cell, separate rows for multiple values."
  - **2NF** (amber): "In 1NF + no partial dependencies on a composite PK." Fix: "split attributes
    that depend on only part of the key into a new table."
  - **3NF** (blue): "In 2NF + no transitive dependencies (A→B→C where B is non-prime)." Fix:
    "extract the transitive chain into its own table. Guarantees lossless + dependency
    preserving."
  - **BCNF** (green): "In 3NF + every determinant of any FD is a superkey." Fix: "decompose so
    left-hand side of every non-trivial FD is a superkey. May sacrifice dependency preservation."
- Formula bar: "Unnormalized → 1NF → 2NF → 3NF → BCNF"
- Footer: "Database Normalization & Functional Dependencies / © All rights reserved · Yasas Sri
  Wickramasinghe"

### Video Gallery content (rendered directly underneath the deck, part of this lesson's full
content — from `NORMALIZATION_VIDEOS`, `CourseResources.tsx` lines 123–148)

Four SharePoint video clips, in order:
1. **"Normalization – Introduction"** — "Introductory video for Database Normalization &
   Functional Dependencies"
2. **"Normalization – Why Normalise?"** — "Understanding the need for database normalization"
3. **"Normalization – Functional Dependencies"** — "Introduction to functional dependencies in
   relational databases"
4. **"Normalization – First Normal Form (1NF)"** — "Understanding and applying First Normal Form"

Each entry has a `title`, `description`, an institutional `url` (SharePoint sharing link on
`myacg-my.sharepoint.com`, opens in a new tab) and a `thumbnailUrl` built from a shared `BASE`
constant plus a filename (`NormIntro.png`, `NormWhy.png`, `NormFD.png`, `Norm1NF.png`). No
`embedUrl` is set for these four, so they open externally rather than playing inline (see §3).

## 3. UI & interaction design

**Deck navigation shell** (`NormalizationDeck` component):
- A toolbar row above the slide canvas: previous/next chevron buttons (`ChevronLeft` /
  `ChevronRight`, disabled at the first/last slide), a "`{current+1} / {total}`" counter
  (e.g. "3 / 20"), the current slide's internal `label` shown on larger screens (e.g. "03
  Functional Dependencies"), an expand/collapse toggle (`Maximize2`/`Minimize2`), and a
  fullscreen toggle (`Maximize`/`Minimize`, backed by the browser Fullscreen API).
- The slide canvas is a fixed 1920×1080 `<section>` scaled via CSS `transform: scale(...)` to fit
  the width of its wrapping container, recalculated on every resize via a `ResizeObserver`
  (`transformOrigin: 'top left'`, wrapper height set to `1080 * scale`). This keeps the deck's
  absolute-pixel layout crisp at any viewport width.
- Keyboard navigation: `ArrowRight`/`ArrowDown` advance, `ArrowLeft`/`ArrowUp` go back, `Escape`
  exits fullscreen (only wired while `fullscreen` is true).
- Below the canvas, a row of small pill/dot indicators (one per slide, 20 total) — the active
  slide's dot is wider (24px vs 8px) and colored `#6366f1` (indigo), inactive dots are a
  translucent indigo (`rgba(99,102,241,0.25)`); clicking a dot jumps straight to that slide.
- Each slide's raw HTML is injected via `dangerouslySetInnerHTML` from the `SLIDES[i].html`
  string; slide-level styling classes are `''` (light/white background), `'dark'` (navy
  `#0d1b2a`), or `'dark2'` (slightly lighter navy `#132337`, defined in CSS but not used by any of
  the 20 slides currently). A few slides (Activities 1–3) instead set an explicit `bg` (e.g.
  amber-light, green-light, `#fdf4ff`, `#fff7ed`) via inline style rather than a class.

**Visual style** (`.norm` scoped styles, injected once into `<head>` on mount via a `<style
id="norm-deck-styles">` tag, removed on unmount):
- Font: `DM Sans` for body text, `DM Mono` for code/formula/dependency snippets, loaded from
  Google Fonts.
- Color system defined as CSS variables: `--navy` (#0d1b2a), `--blue` (oklch-based blue),
  `--amber` (oklch-based amber/orange), `--green`, `--red` (all oklch), plus light tints of each
  (`--blue-light`, `--amber-light`, etc.) used for callout/badge backgrounds.
- Recurring visual components defined in CSS: `.badge` (pill labels), `.callout` (colored
  left-border info boxes: blue/amber/green/red variants), `.formula` (monospace highlighted
  formula chip), `.dep` / `.dep-good` / `.dep-bad` (dependency chips), `.nf-bar` (the four-segment
  1NF/2NF/3NF/BCNF progress bar used across normal-form slides, with `.active` and `.done`
  states), `.anomaly-cards` / `.anomaly-card` (the three-column anomaly cards on slide 2),
  `.summary-grid` / `.summary-card` (the four-card recap on slide 20), `.answer-box` /
  `.answer-label` (green-bordered activity-answer callouts), `.activity-num` (huge faint numeral
  watermark in the corner of activity slides), `.visual-box` / `.visual-arrow` (the big rounded
  boxes-and-arrows diagrams on the "Visual: NF" slides), and table styling with `.tbl-bad` /
  `.tbl-good` / `.tbl-neutral` header colors and `.cell-bad` / `.cell-ok` / `.cell-pk` cell
  highlighting (red/green/blue respectively) used throughout to visually flag anomalous vs. clean
  vs. key data in every example table.
- Layout primitives: `.two-col` / `.two-col.wide` (CSS grid two-column slide layouts, used on most
  concept slides), consistent `--px`/`--pt`/`--pb` slide padding, and a `.copyright` footer pinned
  to the bottom of every slide.

**Video Gallery section** (rendered by `VideoGallery`, mounted directly beneath the deck inside
the same accordion body, per `CourseResources.tsx` lines 1774–1782):
- Section header: a small film-icon badge, "Video Lessons" label, and a pill showing the clip
  count (e.g. "4 clips").
- Responsive 2-column card grid (`grid-cols-1 md:grid-cols-2`) of video cards, accent-colored
  `#6366f1` (indigo) for this lesson specifically (passed as the `accentColor` prop).
- Since none of the four `NORMALIZATION_VIDEOS` entries define an `embedUrl`, clicking them opens
  the SharePoint link in a new browser tab rather than playing inline (the component supports an
  inline iframe player with a "Close" button when `embedUrl` is present, used by other lessons but
  not this one).
- Any additional lecturer-uploaded videos for this lesson (from the `dynamicVideoMap` keyed
  `${course.id}_normalization`, populated from a separate Firestore-backed lecturer video-manager
  feature not part of this file's scope) are appended after the four static clips into the same
  gallery — the code explicitly excludes `'normalization'` from the generic "extra videos"
  fallback block (line ~1801) specifically because it's already merged in above.

**Locked-state UI** (when `gated` is true for a student — `LessonRow` component,
`CourseResources.tsx` lines 1373–1467):
- The row's icon swaps from the lesson's normal `BookOpen` icon to a `Lock` icon (grey,
  `#9ca3af`), and a small red "Locked" pill appears next to the "Lesson N" label
  (`background: rgba(239,68,68,0.1)`, `color: #dc2626`).
- The row's subtitle text is replaced entirely with the exact locked-state message: **"Score
  above 50% in the ER Knowledge Check to unlock this lesson."**
- The entire row is visually dimmed (`opacity: 0.7`), its border/background/shadow all switch to
  flat "locked" styling (no accent-colored border/shadow), the chevron-down expand indicator is
  hidden, and the row's `<button>` is `disabled` with `cursor: not-allowed` and its `onClick`
  handler set to `undefined` — clicking it does nothing at all (no toast, no redirect, no expand).
  There is no way to preview or peek at the deck while locked.

## 4. Component & state architecture

**In `NormalizationDeck.tsx`:**
- `SLIDES: { classes: string; label: string; html: string; bg?: string }[]` — a static, 20-element
  array module constant; not derived from any external data source (no CMS, no Firestore — the
  entire deck content is hardcoded in this file).
- Component-local state: `current` (active slide index, `useState(0)`), `expanded` (boolean,
  toggles a layout class), `fullscreen` (boolean, mirrors `document.fullscreenElement` via a
  `fullscreenchange` listener).
- Refs: `wrapRef` (the scaled canvas wrapper, target of `requestFullscreen()` and the
  `ResizeObserver`), `canvasRef` (the inner 1920×1080 div that gets `transform: scale(...)`
  applied).
- Three `useEffect` hooks: (1) injects/removes the `DECK_CSS` `<style>` tag by ID
  (`norm-deck-styles`) on mount/unmount, guarding against double-injection if the component
  remounts while the tag still exists; (2) sets up the `ResizeObserver` for responsive scaling;
  (3) sets up the `keydown` listener for arrow-key/`Escape` navigation, re-subscribing whenever
  `fullscreen` or `total` change.
- No Firestore reads/writes, no props, no external state — `NormalizationDeck` is entirely
  self-contained and stateless with respect to the rest of the app. It does not know about gating,
  scoring, or badges; all of that lives one level up in `CourseResources.tsx`.

**In `CourseResources.tsx` (the gating chain that controls whether this component is ever
reachable):**
1. State declaration (line ~1480): `const [erMcqPassed, setErMcqPassed] = useState(false);` —
   defaults to `false`/locked until proven otherwise.
2. Data fetch (`useEffect`, lines ~1493–1515): runs only `if (!user || isStaff) return;` (i.e.
   skipped entirely for staff and for unauthenticated renders), then in parallel fetches
   `getDoc(doc(db, 'students', user.uid))` and `getDoc(doc(db, 'erMcqResults', user.uid))`. If the
   `erMcqResults` document exists:
   ```ts
   const best = erMcqSnap.data().bestPercentage ?? 0;
   setErMcqPassed(best > 50);
   ```
   Note the strict `>` (not `>=`) — a `bestPercentage` of exactly `50` does **not** unlock the
   lesson. If the document does not exist at all (student has never attempted the ER Knowledge
   Check), `erMcqPassed` simply stays at its default `false` and the `if` block is skipped
   entirely — the `?? 0` fallback inside the `if` never even executes in that case, but the net
   effect is identical (locked).
3. Gating computation (line ~1742), evaluated per-lesson inside the `course.lessons.map(...)`
   loop:
   ```ts
   const gated = !isStaff && ['normalization', 'quiz'].includes(lesson.id) && !erMcqPassed;
   ```
   This is the exact same boolean gate shared by two MBI802 lessons — `'normalization'` (this
   lesson) and `'quiz'` (the separate 38-question DBMS Knowledge Check, documented in its own
   file) — both locked behind the identical ER MCQ threshold. `gated` is passed to `<LessonRow
   locked={gated}>`.
4. When **not** gated (student passed, or viewer is staff), the render site (lines ~1774–1782)
   mounts:
   ```tsx
   {lesson.id === 'normalization' && (
     <div>
       <NormalizationDeck />
       <VideoGallery
         videos={[...NORMALIZATION_VIDEOS, ...(dynamicVideoMap[`${course.id}_${lesson.id}`] ?? [])]}
         accentColor="#6366f1"
       />
     </div>
   )}
   ```
   i.e. the deck and the video gallery are two independent components rendered as siblings inside
   the same accordion body — there is no shared state between them.
5. A live-unlock path exists elsewhere on the same page: the ER Knowledge Check lesson
   (`lesson.id === 'er-mcq'`) renders `<ERMcq studentProfile={...}
   onPassStatusChange={(passed) => setErMcqPassed(passed)} />` for students — so if a student
   takes/retakes the ER MCQ *in the same session* and crosses the 50% threshold, `erMcqPassed`
   flips to `true` immediately via this callback and the Normalization (and DBMS Quiz) rows
   unlock live, without a page reload, since `erMcqPassed` is shared top-level state in
   `CourseResources`.

**Firestore document shape read by this gate** (collection `erMcqResults`, doc ID = student
`uid`):
- `bestPercentage: number` — the only field this lesson's gating logic reads. Presumed range
  0–100, presumed to be maintained/overwritten by the `ERMcq` component (not part of this file's
  scope) to reflect the best of the student's (up to 3, per the lesson subtitle) ER Knowledge
  Check attempts.
- Other fields may exist on this document (e.g. attempt history, timestamps, per-question
  answers) used by `ERMcq`/`ERMcqDashboard`, but `CourseResources.tsx`'s gating logic reads only
  `bestPercentage`.

No scoring, badges, or completion tracking exist for the Normalization deck or video gallery
themselves — no Firestore writes originate from `NormalizationDeck.tsx` or from viewing the
`NORMALIZATION_VIDEOS` gallery. The only state this lesson participates in as a *write* target is
none; it is purely a gated read/display lesson.

## 5. Rebuild notes

- **Distinct from the public `/normalisation` explorer.** This gated deck
  (`NormalizationDeck.tsx`, mounted only inside `CourseResources.tsx`) is a completely separate
  React component from whatever renders the public, non-gated `/normalisation` route (a different
  "Normalization Explorer" lesson, per the lesson-docs README inventory, documented in its own
  separate lesson-docs file). They cover overlapping conceptual ground (1NF/2NF/3NF/BCNF,
  functional dependencies) but are not the same code, not the same UI pattern (this one is a
  slide-deck; the public one is described elsewhere as an "explorer"), and not reachable the same
  way. If rebuilding, do not merge these into one component or assume shared state/props — treat
  them as two independent artifacts that happen to teach the same theory. The public route also
  has sibling gated-only content of its own (`/normalisation-activities`,
  `/normalisation-videos` per the README inventory) which are themselves distinct again from both
  this deck and its embedded `VideoGallery` — worth double-checking against the other doc file(s)
  to avoid content duplication confusion during a rebuild.
- **Strict `>` threshold quirk.** The unlock condition is `best > 50`, not `best >= 50`. A student
  who scores exactly 50% on the ER Knowledge Check remains locked out of both this lesson and the
  DBMS Knowledge Check. This is almost certainly intentional (the lesson subtitle even says "Score
  >50%") but is easy to get wrong in a rebuild by defaulting to `>=`; preserve the strict
  inequality.
- **Locked-by-default on missing data.** Because `erMcqPassed` initializes to `false` and the
  `useEffect` only calls `setErMcqPassed(true)` inside the `if (erMcqSnap.exists())` branch, any
  student who has never opened the ER Knowledge Check lesson at all sees Normalization (and the
  DBMS quiz) as locked from their very first page load — there is no separate "not attempted yet"
  message distinct from "scored too low"; both render the identical lock message.
- **Deck content is fully static/hardcoded.** Unlike some other MBI802 lessons, none of this
  deck's 20 slides are sourced from Firestore or any CMS — a rebuild only needs to faithfully
  reproduce the `SLIDES` array and `DECK_CSS` string; there's no dynamic content pipeline to
  reconstruct.
- **`dark2` CSS class is defined but unused.** The stylesheet defines `.norm section.dark2` (a
  slightly lighter navy, `#132337`) but no slide in the current `SLIDES` array uses `classes:
  'dark2'` — only `''` and `'dark'` appear. Harmless dead styling; can be dropped or kept for
  future slides without functional impact.
- **Fixed-canvas design.** The deck renders at a hardcoded 1920×1080 virtual canvas and scales via
  CSS transform rather than using a responsive/fluid layout — this is a deliberate design choice
  (matches other slide decks in the platform, e.g. Platform Strategy, Agile Scrum) for pixel-exact
  reproducibility of designed slide layouts; preserve this pattern rather than "modernizing" to
  fluid CSS if rebuilding, since all absolute-positioned decorative elements (grid overlay,
  circles on slide 1, the `.activity-num` giant watermark numerals) depend on the fixed coordinate
  space.
- **SharePoint video links will need revalidation.** All four `NORMALIZATION_VIDEOS` URLs are
  long-lived SharePoint "share" links under the `myacg-my.sharepoint.com` tenant with embedded
  `nav=` query parameters — institutional auth-gated, and will break if the tenant, the specific
  OneDrive file, or the share link itself is rotated/revoked. Thumbnail images
  (`NormIntro.png`, `NormWhy.png`, `NormFD.png`, `Norm1NF.png`) are loaded from a shared `BASE`
  constant path (defined near the top of `CourseResources.tsx`, shared across all video-gallery
  arrays in the file) — verify that path/asset host still resolves before assuming these render
  correctly in a rebuild.
- **No dedicated route or deep link.** There is no way to link directly to a specific slide,
  activity, or the video gallery from outside the app — the entire lesson is reached only by
  logging in, navigating to `/student/course-resources`, selecting the MBI802 tab, and expanding
  the "Database Normalization & Functional Dependencies" row (after satisfying the ER MCQ gate).
  Slide position (`current`) is local component state with no URL sync and resets to slide 1 every
  time the component remounts (e.g. collapsing and re-expanding the accordion row).
