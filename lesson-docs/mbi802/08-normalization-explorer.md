# Normalisation Explorer — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/normalisation` (canonical). `/normalization` (US-spelling alias) redirects to
  `/normalisation` via `<Navigate replace>`. Both are registered twice in `src/App.tsx` — once
  in the normal route tree and once in what appears to be a duplicate/legacy route block
  (lines ~96-98 and ~181-183) — the two registrations are identical, just present twice.
- **Source files:** `src/pages/NormalizationExplorerPage.tsx` (~2092 lines, single self-contained
  page component, default export `NormalizationExplorerPage`)
- **Depends on:**
  - `src/components/ui/BrandLogo.tsx` — used in the hero (top-left, `iconSize={28}`,
    `variant="on-light"`, wrapped in a `<Link to="/home">`) and again in the footer (same props,
    no link).
  - `react-router-dom` — only for the `Link` to `/home`; the page itself is not otherwise
    route-aware.
  - `framer-motion` — `motion`, `AnimatePresence`, `useScroll`, `useTransform`, `type Variants`
    for all animation (scroll-reveal, hero parallax, table layout transitions, staggered grids).
  - No Firestore reads/writes, no external links, no images/SVGs/videos. Nothing is collected or
    stored — confirmed both in the header comment and the closing footer copy ("Everything here
    runs in your own browser. No personal data is collected or stored.").
  - **Not a dependency of this file, but related:** there is a separate, differently-implemented
    **gated** slide-deck component, `NormalizationDeck.tsx`, covering the same normalisation
    topic. Per the lesson-docs project inventory (`lesson-docs/README.md`), that gated deck is
    documented in its own file elsewhere under the gated-lessons docs, and it is locked behind an
    ER Knowledge Check quiz score threshold. This document does **not** describe
    `NormalizationDeck.tsx` (its source was not read while writing this file) — it documents only
    the public interactive explorer covered here. Do not conflate the two.

## 1. Purpose & learning objectives

A single, self-contained, scroll-driven public lesson page that teaches database normalisation
end to end: why un-normalised tables cause problems, what functional dependencies are, and how to
climb the ladder 1NF → 2NF → 3NF → BCNF, ending with the two safety properties of a good
decomposition (lossless join, dependency preservation). The header comment in the source states
the intent directly:

> "A single, self-contained page that walks through database normalisation — the anomalies that
> motivate it, functional dependencies, 1NF → 2NF → 3NF → BCNF, and decomposition. Built in the
> same Apple-styled design language as the XR Explorer lesson, with several interactive
> simulations so the ideas can be *played with* rather than just read. Nothing is collected or
> stored — every simulation runs entirely in the browser."

Byline shown in the hero and footer: "An interactive lesson · Dr. Yasas Sri Wickramasinghe." The
page is explicitly designed so a learner needs no login and nothing they do is persisted — every
"quiz," "detective," and "studio" widget resets to local component state only.

Learning objectives implied by the content flow:
1. Recognise the three classic anomalies (update, insertion, deletion) caused by storing
   everything in one table.
2. Understand functional dependency notation (X → Y) and be able to judge whether a candidate FD
   actually holds.
3. Walk a single running example (Students/Courses/Departments) through every stage from
   un-normalised (0NF) to BCNF, watching redundancy fall and anomalies disappear.
4. Master 1NF (atomicity) via both an abstract toggle example and a "real-world" music-streaming
   playlist walkthrough.
5. Master 2NF (no partial dependencies) via a plain-language explainer and an e-commerce
   order-items walkthrough.
6. Master 3NF (no transitive dependencies) via a plain-language explainer and an HR
   employee-records walkthrough with an animated dependency-chain diagram.
7. Understand BCNF as a stricter, "for every dependency X→Y, X is a superkey" rule, presented as
   optional/bonus knowledge since "most real databases stop at 3NF."
8. Understand the two properties a decomposition must preserve to be a *safe* split: lossless
   join and dependency preservation, and the BCNF-vs-3NF trade-off between them.
9. Self-test via a self-check tabbed checklist (1NF/2NF/3NF), a 4-question "Normal Form
   Detective" schema-reading exercise, and a closing 5-question true/false quiz.

## 2. Full content

The page is a single vertical scroll built from stacked `<section>` blocks, each revealed via the
`Reveal` scroll-in-view wrapper. Sections in order, with all inline copy and interactive content
transcribed in full.

### Hero

- Eyebrow: "An interactive lesson · Dr. Yasas Sri Wickramasinghe"
- H1: "Let's make sense of" (line break) "Database Normalisation." — the second line is rendered
  in a blue→indigo→purple gradient (`from-[#0071e3] via-[#5e5ce6] to-[#bf5af2]`).
- Subhead: "We'll start with the messes that bad table design creates, then climb the ladder —
  1NF, 2NF, 3NF and BCNF — one rung at a time. Along the way you can play with live simulations:
  trigger the anomalies, split tables apart, and test yourself. No headset, no sign-in, nothing
  collected."
- Two CTAs: "Open the Normalisation Studio" (button, scrolls to `#studio`) and "Start with the
  problem ›" (text link, scrolls to `#anomalies`).
- Bottom-of-hero hint text: "Scroll to explore" (fades in after 1s).

### Section: "What goes wrong without normalisation?" (`id="anomalies"`)

- Eyebrow: "Start here". Title: "What goes wrong without normalisation?"
- Sub: "When one table tries to store everything at once, the same fact gets written in many
  places. That redundancy quietly breeds three classic anomalies. Poke the table below to feel
  each one."
- **Simulation: Anomaly Playground.** A single un-normalised table `StudentCourses` with columns
  `StudentID, Name, Dept, DeptHead, Course, Instructor` and base rows:
  | StudentID | Name | Dept | DeptHead | Course | Instructor |
  |---|---|---|---|---|---|
  | S1 | Alice | CS | Dr. Smith | Databases | Prof. Lee |
  | S2 | Bob | CS | Dr. Smith | Databases | Prof. Lee |
  | S3 | Carol | Math | Dr. Jones | Statistics | Prof. Hill |

  Three toggle buttons re-render the table and show an explanation panel:
  - **"✏️ Dr. Smith retires"** (update anomaly): Alice's row's DeptHead becomes "Dr. Brown"
    (highlighted as a mutation) while Bob's row still shows "Dr. Smith" (highlighted as bad/wrong).
    Message — title "Update anomaly": "'Dr. Smith' appears in **two** CS rows. We renamed the head
    to **Dr. Brown** in Alice's row but forgot Bob's. The database now disagrees with itself about
    who runs CS. Update *every* copy or risk inconsistency."
  - **"➕ Open Physics dept"** (insertion anomaly): appends a row `?, — no student —, Physics,
    Dr. Gupta, NULL, NULL` (all bad-highlighted except Dept/DeptHead). Message — title "Insertion
    anomaly": "We want to record a new **Physics** department headed by Dr. Gupta — but no student
    has enrolled yet. Because student + course are part of the key, we're forced to invent fake
    NULL data just to store a department."
  - **"🗑️ Carol leaves"** (deletion anomaly): removes Carol's row entirely (table shows only S1,
    S2). Message — title "Deletion anomaly": "Carol was the only person taking **Statistics**.
    Deleting her row didn't just remove an enrolment — it erased the fact that **Prof. Hill
    teaches Statistics** and that the **Math** department exists at all."
  - A "Reset" link appears whenever a mode is active, returning to idle. Idle-state hint text:
    "This one table stores students, departments *and* courses all at once. Tap a button to see
    how that bites back."
- Below the playground, a 3-card grid restating the three anomalies:
  - ✏️ Update anomaly: "A repeated fact is changed in some rows but not others, so the database
    ends up contradicting itself."
  - ➕ Insertion anomaly: "You can't record one fact without inventing another — a department
    needs a student before it can exist."
  - 🗑️ Deletion anomaly: "Removing one row quietly destroys unrelated information that happened
    to live in the same place."

### Section: "Functional dependencies" (grey background)

- Eyebrow: "The core idea". Title: "Functional dependencies".
- Sub: "Normalisation is really about one question: which columns determine which? We write X →
  Y to mean 'if you know X, you know exactly one Y.' Getting these right is the whole game."
- Large display of "X → Y" with caption: "X is the **determinant** · Y is the **dependent**".
- **Simulation: FD Explorer.** Prompt: "Does the left side really *determine* the right side? Make
  your guess, then tap to check." Six flip-cards (2-column grid), each showing the candidate FD in
  monospace; tapping reveals "Holds ✓" (green) or "Doesn't hold ✕" (red) plus an explanation:
  1. `StudentID → StudentName` — **Holds.** "One student ID maps to exactly one name. Knowing the
     ID always tells you the name."
  2. `StudentName → StudentID` — **Does not hold.** "Two different students can share the name
     'Alex'. A name does not pin down a single ID."
  3. `Dept → DeptHead` — **Holds.** "Each department has exactly one head, so the department
     determines the head."
  4. `CourseID → Grade` — **Does not hold.** "A course has many grades — one per student. You need
     the student too: {StudentID, CourseID} → Grade."
  5. `{StudentID, CourseID} → Grade` — **Holds.** "A specific student in a specific course earns
     exactly one grade. The composite key determines it."
  6. `DeptHead → Dept` — **Holds.** "In this school each lecturer heads only one department, so
     the head identifies the department."

### Section: "The Normalisation Studio" (`id="studio"`) — centerpiece

- Eyebrow: "Interactive · the main event". Title: "The Normalisation Studio".
- Sub: "Here is one messy table. Step it up the ladder and watch tables split apart, redundancy
  drain away and the anomalies disappear — the whole journey from un-normalised to BCNF in one
  place."
- **Simulation: Normalisation Studio.** A 5-stage stepper (0NF/1NF/2NF/3NF/BCNF tabs, each
  markable done with a ✓) driving a shared running example. For each stage: the table(s) at that
  stage, a blurb, a redundancy meter (0-100, colour-coded Low/Medium/High), an anomaly-status
  banner (⚠️ / ✅), and Back/Normalise-to-next-stage navigation buttons (final stage button reads
  "Fully normalised").

  **Stage 0NF — "Un-normalised" (redundancy 95, anomalies: yes).** Blurb: "Everything lives in one
  table, and a single cell can hold a list of courses. Impossible to query cleanly and riddled
  with repetition." One table, `StudentCourses` (PK `StudentID`):
  | StudentID | Name | Dept | DeptHead | Courses (id : grade) |
  |---|---|---|---|---|
  | S1 | Alice | CS | Dr. Smith | C1:A, C2:B |
  | S2 | Bob | CS | Dr. Smith | C1:A |
  | S3 | Carol | Math | Dr. Jones | C3:A, C4:C |

  **Stage 1NF — "Atomic values" (redundancy 80, anomalies: yes).** Blurb: "Lists are broken apart
  so every cell holds one value, with a composite key {StudentID, CourseID}. Still one big table —
  student and department facts repeat on every row." One table, `StudentCourses` (PK
  `{StudentID, CourseID}`):
  | StudentID | CourseID | Name | Dept | DeptHead | CourseName | Grade |
  |---|---|---|---|---|---|---|
  | S1 | C1 | Alice | CS | Dr. Smith | Databases | A |
  | S1 | C2 | Alice | CS | Dr. Smith | Op. Systems | B |
  | S2 | C1 | Bob | CS | Dr. Smith | Databases | A |
  | S3 | C3 | Carol | Math | Dr. Jones | Calculus | A |
  | S3 | C4 | Carol | Math | Dr. Jones | Statistics | C |

  **Stage 2NF — "No partial dependencies" (redundancy 40, anomalies: yes).** Blurb: "CourseName
  depends only on CourseID; the student facts depend only on StudentID. Each is split into its own
  table, leaving a clean join table for grades." Three tables:
  - `Students` (PK `StudentID`): StudentID, Name, Dept, DeptHead — rows S1/Alice/CS/Dr. Smith
    (Dr. Smith flagged "bad" — still duplicated), S2/Bob/CS/Dr. Smith (flagged "bad"), S3/Carol/
    Math/Dr. Jones.
  - `Courses` (PK `CourseID`): CourseID, CourseName — C1/Databases, C2/Op. Systems, C3/Calculus,
    C4/Statistics (all flagged "ok").
  - `Enrolment` (PK `{StudentID, CourseID}`): StudentID, CourseID, Grade — S1/C1/A, S1/C2/B,
    S2/C1/A, S3/C3/A, S3/C4/C (all flagged "ok").

  **Stage 3NF — "No transitive dependencies" (redundancy 12, anomalies: no).** Blurb: "DeptHead
  depended on the student only through Dept — a transitive chain. Pull departments into their own
  table and the head is stored exactly once." Four tables:
  - `Students` (PK `StudentID`): StudentID, Name, Dept (FK) — S1/Alice/CS, S2/Bob/CS, S3/Carol/Math.
  - `Departments` (PK `Dept`): Dept, DeptHead — CS/Dr. Smith, Math/Dr. Jones (flagged "ok").
  - `Courses` (PK `CourseID`): CourseID, CourseName — C1/Databases, C3/Calculus, …/… (ellipsis row).
  - `Enrolment` (PK `{StudentID, CourseID}`): StudentID, CourseID, Grade — S1/C1/A, S3/C4/C, …/…/…

  **Stage BCNF — "Every determinant is a key" (redundancy 6, anomalies: no).** Blurb: "In this
  schema every functional dependency already has a superkey on its left — so the 3NF design is
  also in BCNF. No further splitting needed. Redundancy is essentially gone." Same four tables as
  3NF, trimmed to 2 example rows each plus an ellipsis row (Students: S1, S3; Departments: CS,
  Math; Courses: C1, …; Enrolment: S1/C1/A, ….

  Anomaly banner text: "Update, insert & delete anomalies still possible" (0NF/1NF/2NF) vs.
  "Anomalies eliminated for this schema" (3NF/BCNF). Redundancy meter label: "High" (>60),
  "Medium" (>25), "Low" (otherwise).

### Section: "Break apart the lists" (1NF deep dive, grey background)

- Eyebrow: "First Normal Form · 1NF". Title: "Break apart the lists".
- Sub: "1NF asks for one thing: every cell holds a single, atomic value — no comma-separated
  lists, no repeating groups. Flip the table below and watch a multi-valued column become tidy
  rows."
- **Simulation: Atomic Splitter.** A before/after toggle on an `OrderID, Products` table:
  - Before ("bad"): `101, Laptop, Mouse, Keyboard` / `102, Monitor, HDMI Cable` (each Products
    cell one comma-joined string).
  - After ("ok", atomic): exploded to one row per product — 101/Laptop, 101/Mouse, 101/Keyboard,
    102/Monitor, 102/HDMI Cable.
  - Button toggles between "Make every cell atomic ›" and "↩︎ Show the bad version".
  - Caption when atomic: "One product per row. Now you can ask 'who ordered a Mouse?' with a
    simple WHERE clause." Caption when not atomic: "Three products crammed into one cell.
    Counting, filtering or joining on a single product is painful."

### Section: "Fixing a music streaming playlist table" (1NF real-world)

- Eyebrow: "1NF · Real-world walkthrough". Title: "Fixing a music streaming playlist table".
- Sub: "This is the kind of table a junior dev might design for a Spotify-style app. Walk through
  three steps to see exactly what 1NF demands — and what gets unlocked when every cell is atomic."
- **Simulation: OneNFSimulator**, a 3-step tab flow ("Messy table" / "Spot the problem" / "Apply
  1NF", colours red → amber → green) over this data set:
  - PL01 "Morning Vibes" → tracks: T01·Blinding Lights, T02·Levitating, T03·Stay
  - PL02 "Workout Mix" → tracks: T04·POWER, T05·Lose Yourself
  - PL03 "Study Mode" → tracks: T06·Lo-fi Beat #1, T07·Rain Sounds, T08·Focus Flow

  Step 1 ("Messy table"): table `playlist_id, playlist_name, tracks` with the tracks column as a
  comma-joined bad-flagged string per playlist. Caption: "A music-streaming playlist table. The
  *tracks* column hides a comma-separated list — already violating 1NF."

  Step 2 ("Spot the problem"): each playlist rendered as a card with its ID, name, a red badge "N
  values in 1 cell!", and its tracks as individually-animated chips. Caption: "You can't query
  'which playlists contain T02?' with a simple WHERE clause — you'd need a LIKE '%T02%' hack."

  Step 3 ("Apply 1NF"): table `playlist_id, playlist_name, track_id, track_name` fully exploded
  (one row per track, 8 rows total from the 3 playlists). Caption: "3 rows became 8. Every cell is
  atomic. `WHERE track_id = 'T02'` now works perfectly."

  Step buttons: "Spot the problem ›" / "Apply 1NF ›", with a "‹ Back" link once past step 0.

### Section: "2NF and 3NF, in really plain words"

- Eyebrow: "Climbing higher". Title: "2NF and 3NF, in really plain words".
- Sub: "1NF was about tidying up the cells. 2NF and 3NF are about one thing only: making sure
  each column is sitting in the right table. Let's take them one at a time — slowly."
- Three static explainer cards (no interactivity):
  1. **"2NF · use the whole key"** — "Does each column need the *whole* key, or just half of
     it?" Body: "2NF only matters when your table's key is made of two columns stuck together (a
     'composite' key). Picture an order table where the key is {OrderID, ProductID}. Now look at
     **ProductName**. Does it care which order it was on? Nope — it only depends on **ProductID**.
     So you'd be repeating 'iPhone 15' on every single order that includes it." Fix: "move
     ProductName into its own little Products table, where ProductID alone is the key." Pull-quote:
     "In one line: if a column only needs *part* of the key, it's sitting in the wrong table."
  2. **"3NF · no middlemen"** — "Does each column point straight at the key — or sneak in through
     another column?" Body: "Once 2NF is sorted, 3NF asks the next question. Take an employee
     table. Each **Employee** has a **DeptID**, and that DeptID tells you the **DeptName** and
     **DeptPhone**. So DeptName doesn't really depend on the employee — it depends on the
     *department*, which depends on the employee. That extra hop is a 'middleman':" — displayed
     chip: `Employee → DeptID → DeptName`. Fix: "give departments their own table, and let the
     employee row just keep the DeptID." Pull-quote: "In one line: every column should point
     straight at the key — no hopping through another column."
  3. **"BCNF · optional extra"** — "Nice to have — but you usually don't need it." Body: "Here's
     the honest truth: most real databases stop at 3NF and are completely fine. BCNF is just a
     stricter, extra-tidy version of 3NF that handles a few rare edge cases. Think of it as a
     polish, not a box you *have* to tick. If your table is solidly in 3NF, you're already in
     great shape — so feel free to treat this one as bonus reading."

### Section: "Is my table in this form?" (self-check, grey background)

- Eyebrow: "Self-check". Title: "Is my table in this form?"
- Sub: "A quick checklist for the three forms that matter. Tap a tab and run down the boxes — if
  they all hold true, your table has reached that form."
- **Simulation: NFChecklist.** Three tabs (1NF/2NF/3NF), each rendering a tagline, plain-language
  summary, a checklist, and a "Quick example":
  - **1NF** — tagline "Tidy up the cells"; plain "One value per cell. Nothing crammed together.";
    items: "Every cell holds a single value — no lists like 'Maths, Science' stuffed into one
    box.", "No repeating columns like Phone1, Phone2, Phone3 to hold 'more of the same thing'.",
    "Each row can be told apart from the rest (there is a key)."; example: "Split a cell that says
    'Maths, Science' into two separate rows — one per subject."
  - **2NF** — tagline "Use the whole key"; plain "Every column should need the full key — not
    just half of it."; items: "It is already in 1NF.", "Every non-key column depends on the whole
    key, not just part of it.", "Heads-up: if your key is a single column, you get 2NF for free —
    there is no 'part' of the key to worry about."; example: "In a table keyed by {OrderID,
    ProductID}, move ProductName into its own Products table — it only needs ProductID."
  - **3NF** — tagline "No middlemen"; plain "Every column should point straight at the key — no
    hopping through another column."; items: "It is already in 2NF.", "No ordinary (non-key)
    column depends on another ordinary column.", "In other words: nothing sneaks to the key
    through a 'middleman' column."; example: "If DeptName rides along on DeptID, pull departments
    out into their own table and keep only DeptID here."
  - Footer note under the tabs: "Tick all the boxes on a tab? Your table is in that form. Each
    form builds on the one before it."

### Section: "Fixing an e-commerce order table" (2NF real-world, grey background)

- Eyebrow: "2NF · Real-world walkthrough". Title: "Fixing an e-commerce order table".
- Sub: "This is the table a new developer builds on day one. It looks sensible — until you trace
  the partial dependencies and see the update anomalies hiding inside."
- **Simulation: TwoNFSimulator**, a 3-phase tab flow ("See the table" / "Find partial deps" /
  "Apply 2NF") over an `order_items` table, PK `{order_id, product_id}`:
  | order_id | product_id | qty | customer_name | product_name | unit_price |
  |---|---|---|---|---|---|
  | ORD-1 | P-101 | 3 | Alice | Wireless Mouse | $29.99 |
  | ORD-1 | P-102 | 1 | Alice | USB Hub | $19.99 |
  | ORD-2 | P-101 | 2 | Bob | Wireless Mouse | $29.99 |
  | ORD-3 | P-103 | 1 | Carol | Laptop Stand | $49.99 |

  Phase 2 ("Find partial deps") highlights `customer_name`, `product_name`, `unit_price` as bad
  and adds two annotation boxes:
  - `order_id → customer_name`: "customer_name depends on only **order_id**, not the full
    composite key — partial dependency. Alice appears twice because she placed two line items."
  - `product_id → product_name, unit_price`: "product_name and unit_price depend on only
    **product_id** — another partial dependency. 'Wireless Mouse' at $29.99 is stored in two
    separate rows."

  Phase 3 ("Apply 2NF") shows the decomposition into three tables:
  - `orders` (PK `order_id`): order_id, customer_name — ORD-1/Alice, ORD-2/Bob, ORD-3/Carol.
  - `products` (PK `product_id`): product_id, product_name, unit_price — P-101/Wireless
    Mouse/$29.99, P-102/USB Hub/$19.99, P-103/Laptop Stand/$49.99.
  - `order_items` (PK `{order_id, product_id}`): order_id, product_id, qty — ORD-1/P-101/3,
    ORD-1/P-102/1, ORD-2/P-101/2, ORD-3/P-103/1.
  - Caption: "No redundancy. 'Wireless Mouse' is stored once — changing its price means updating
    **one row** in `products`."

### Section: "Fixing an HR employee records table" (3NF real-world)

- Eyebrow: "3NF · Real-world walkthrough". Title: "Fixing an HR employee records table".
- Sub: "Employee info that carries along department details creates transitive chains. Watch the
  chain animate, then see exactly which table gets extracted and why."
- **Simulation: ThreeNFSimulator**, a 3-phase tab flow ("The table" / "Trace the chain" / "Apply
  3NF") over an HR table:
  | emp_id | emp_name | dept_id | dept_name | dept_city |
  |---|---|---|---|---|
  | E-01 | Alice | D-10 | Engineering | Auckland |
  | E-02 | Bob | D-10 | Engineering | Auckland |
  | E-03 | Carol | D-20 | Marketing | Wellington |
  | E-04 | Dave | D-10 | Engineering | Auckland |

  Phase 1 caption: "HR table for a NZ company. The Engineering team in Auckland appears three
  times — why is that a problem?"

  Phase 2 ("Trace the chain") animates a 3-node chain diagram: `emp_id (PK)` → `dept_id
  (non-key)` → `dept_name / dept_city (non-key)`, then repeats the table with dept_id flagged as
  FK and dept_name/dept_city flagged bad. Annotation: "The transitive chain: emp_id → dept_id →
  dept_name, dept_city. The highlighted columns only reach emp_id *through* the non-key dept_id —
  a transitive dependency violating 3NF."

  Phase 3 ("Apply 3NF") shows the decomposition:
  - `employees` (PK `emp_id`): emp_id, emp_name, dept_id (FK) — E-01/Alice/D-10, E-02/Bob/D-10,
    E-03/Carol/D-20, E-04/Dave/D-10.
  - `departments` (PK `dept_id`): dept_id, dept_name, dept_city — D-10/Engineering/Auckland,
    D-20/Marketing/Wellington.
  - Caption: "dept_name and dept_city now live in `departments` exactly once. Moving the Auckland
    office to Hamilton? Update **one row**."

### Section: "A good split keeps two promises" (decomposition safety, grey background)

- Eyebrow: "The fine print". Title: "A good split keeps two promises".
- Sub: "Splitting a table isn't free — a careless decomposition can invent fake rows or lose
  rules you cared about. Two properties tell you whether a split is safe."
- Two static cards:
  1. **"Lossless join"** — "Joining the pieces back together must reproduce the *exact* original
     table — no spurious, invented rows and nothing lost." Formula: `R = R₁ ⋈ R₂`.
  2. **"Dependency preserving"** — "Every functional dependency from the original can still be
     checked on the new tables, without re-joining them first." Formula: `F ≡ F₁ ∪ F₂`.
  - Callout below: "**The trade-off:** BCNF always gives you a lossless join but may sacrifice
    dependency preservation. 3NF guarantees *both* — which is why it's often the practical target
    in real systems."

### Section: "Normal Form Detective" (practice quiz)

- Eyebrow: "Interactive · put it together". Title: "Normal Form Detective".
- Sub: "Read each schema and its dependencies, then call the highest normal form it satisfies.
  This is exactly the reasoning you'll use on real designs."
- **Simulation: NFDetective**, a 4-question single-answer quiz. Each question shows a schema, its
  PK, its listed FDs (as chips), and four option buttons (1NF/2NF/3NF/BCNF); picking one locks in
  and reveals correct/incorrect plus an explanation, then a "Next case ›" / "See results" button.
  Final screen shows score X/4 with an emoji (🕵️ perfect, 🎯 ≥2, 📚 otherwise) and a "Try again"
  reset.

  1. `Enrolment(StudentID, CourseID, StudentName, CourseName, Grade)`, PK
     `{StudentID, CourseID}`, FDs: `StudentID → StudentName`, `CourseID → CourseName`,
     `{StudentID, CourseID} → Grade`. **Answer: 1NF.** Explanation: "StudentName and CourseName
     each depend on only part of the composite key — partial dependencies. That violates 2NF, so
     the highest it reaches is 1NF."
  2. `Employee(EmpID, EmpName, DeptID, DeptName)`, PK `EmpID`, FDs: `EmpID → EmpName, DeptID`,
     `DeptID → DeptName`. **Answer: 2NF.** Explanation: "The key is a single column, so there are
     no partial dependencies (2NF holds). But EmpID → DeptID → DeptName is transitive, which
     breaks 3NF."
  3. `Advising(Student, Advisor, Department)`, PK `{Student, Department}`, FDs:
     `{Student, Department} → Advisor`, `Advisor → Department`. **Answer: 3NF.** Explanation:
     "Department is a prime attribute, so Advisor → Department does not break 3NF. But Advisor is
     not a superkey, so the table is in 3NF yet not BCNF."
  4. `Departments(DeptID, DeptName, DeptHead)`, PK `DeptID`, FDs: `DeptID → DeptName, DeptHead`.
     **Answer: BCNF.** Explanation: "Single-column key, no partial or transitive dependencies, and
     the only determinant (DeptID) is a superkey. It satisfies every normal form up to BCNF."

### Section: "The normal forms, side by side" (quick reference, grey background)

- Eyebrow: "At a glance". Title: "The normal forms, side by side". Sub: "One card per rung of the
  ladder — the rule it enforces and how you fix a violation."
- Four static summary cards (`NF_SUMMARY`):
  - **1NF** — Rule: "Every cell is atomic, no repeating groups, a primary key exists." Fix: "One
    value per cell; give multiple values their own rows."
  - **2NF** — Rule: "In 1NF and no non-key attribute depends on only part of a composite key."
    Fix: "Split partial dependencies into their own table."
  - **3NF** — Rule: "In 2NF and no non-key attribute depends on the key through another non-key
    attribute." Fix: "Extract the transitive chain (A → B → C) into a new table."
  - **BCNF** — Rule: "For every dependency X → Y, X is a superkey. Stricter than 3NF." Fix:
    "Decompose so every determinant is a key — may cost dependency preservation."
  - Closing pill: "Unnormalised → 1NF → 2NF → 3NF → BCNF"

### Section: "Five quick questions" (closing quiz)

- Eyebrow: "Check yourself". Title: "Five quick questions". Sub: "See how much of the lesson
  stuck."
- **Simulation: Quiz** — 5-question true/false quiz with running score, per-question explanation,
  and a final score screen (🏆 5/5, 🎯 ≥3, 📚 otherwise) with "Try again" reset.
  1. "A table in 1NF can still have plenty of redundant data." — **True.** "1NF only requires
     atomic cells — repetition of student or department facts can remain."
  2. "2NF is only a concern when the primary key is composite." — **True.** "Partial dependencies
     need part of a key to depend on. With a single-column key there is no 'part', so 2NF is
     automatic."
  3. "A transitive dependency is what 3NF removes." — **True.** "3NF eliminates non-prime
     attributes that depend on the key only through another non-prime attribute."
  4. "Every table in BCNF is automatically also in 3NF." — **True.** "BCNF is strictly stronger —
     satisfying it guarantees 3NF, but not the other way round."
  5. "BCNF decomposition always preserves all functional dependencies." — **False.** "BCNF
     guarantees a lossless join but can lose dependency preservation — a real trade-off against
     3NF."

### Footer

- BrandLogo, centered.
- "A Database Normalisation lesson, put together by **Dr. Yasas Sri Wickramasinghe**."
- "Everything here runs in your own browser. No personal data is collected or stored."

## 3. UI & interaction design

- **Visual language:** "Apple-styled" design system shared with the XR Explorer lesson (per the
  header comment) — off-white/`#fafafa`/`#f5f5f7` alternating section backgrounds, `#1d1d1f`
  near-black text, `#0071e3` Apple-blue as the primary accent, a blue→indigo→purple
  (`#0071e3` → `#5e5ce6` → `#bf5af2`) gradient used once on the hero headline. Font stack is the
  `APPLE_FONT` constant: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
  "Inter", "Helvetica Neue", system-ui, sans-serif`, applied via inline `style` on the page's root
  div.
- **Layout model:** single continuous scroll, no tabs/routing between sections. `<section>`
  blocks alternate white and `#f5f5f7` backgrounds for visual rhythm, each `px-6 py-24 sm:py-28`.
  Content is centered with `mx-auto max-w-{3xl|4xl|5xl}` depending on section.
  Two `id` anchors (`anomalies`, `studio`) are used only for the hero's in-page scroll CTAs via a
  custom `scrollToSection` helper that calls `element.scrollIntoView({ behavior: 'smooth', block:
  'start' })` directly (bypassing the router's hash, since the app runs under `HashRouter` — noted
  explicitly in a source comment).
- **Hero parallax:** built with `useScroll({ target: heroRef, offset: ['start start', 'end
  start'] })` and three `useTransform` mappings: scale 1→0.86, opacity 1→0, and translateY 0→120px
  as the user scrolls through the hero's own height. Two soft blurred gradient blobs sit behind
  the hero content (`#0071e3` and `#5e5ce6` at low opacity, `blur-3xl`).
- **Scroll-reveal:** the `Reveal` wrapper (`initial opacity:0,y:48` → `whileInView opacity:1,y:0`,
  `viewport once:true margin:-80px`, 0.8s custom ease `EASE = [0.16, 1, 0.3, 1]`) wraps almost
  every section head and simulation, optionally staggered via a `delay` prop. Card grids (anomaly
  types, NF summary cards) use `stagger`/`item` Framer Motion variants with `staggerChildren:
  0.09`.
  and a shared `EASE` curve `[0.16, 1, 0.3, 1]` for consistency (bounce-free, iOS-like).
- **DataTable component:** a shared Apple-styled table (rounded-2xl, bordered, white background,
  monospace tabular numbers) with a colour-coded header background per table (`headColor` prop)
  and per-cell semantic colouring via `CellKind`: `pk` (blue, primary key), `fk` (indigo, foreign
  key), `ok` (green, "this is now correct/deduplicated"), `bad` (red, "this is the
  problem/redundant/anomalous cell"), `mut` (yellow, "this cell was just edited"). This colour
  vocabulary is reused consistently across every simulation.
- **Stepper controls:** the Normalisation Studio, OneNFSimulator, TwoNFSimulator, and
  ThreeNFSimulator all use the same visual pattern — a single-row segmented control of equal-width
  buttons (one per stage/phase), active step filled solid in its accent colour, completed steps
  shown as a tinted "done ✓" state, upcoming steps white/grey, with a border between segments.
  Underlying content cross-fades via `AnimatePresence mode="wait"` with a 0.35-0.4s slide+fade
  transition.
- **Quizzes (FDExplorer flip-cards, NFDetective, Quiz):** consistent pattern of un-answered
  (neutral grey) → answered (green ring+tint if correct, red ring+tint if the chosen wrong answer,
  dimmed grey for other wrong options) button states, a progress bar/counter, and a final
  score screen with an emoji tier and a "Try again" reset button that zeroes all local state.
- **Motion library:** all animation is via `framer-motion` (`motion.div`, `AnimatePresence`,
  `layout` transitions on the Anomaly Playground and Atomic Splitter tables so row/column changes
  animate smoothly rather than jump-cutting).
- **Responsiveness:** tables scroll horizontally on overflow (`overflow-x-auto` on `DataTable`'s
  wrapper). Grids collapse from 2-3 columns to 1 column below `sm`/`md` breakpoints (Tailwind
  `sm:`/`md:` prefixes throughout). Font sizes step down via responsive Tailwind classes (e.g.
  hero H1 `text-[44px] sm:text-[72px] lg:text-[88px]`).
- **No dark mode:** the page is hardcoded to a light theme (`bg-white text-[#1d1d1f]`); no
  `prefers-color-scheme` handling.

## 4. Component & state architecture

The entire lesson lives in one file with no external state management, no props threading between
files, and no network/Firestore calls anywhere. `export default function
NormalizationExplorerPage()` composes a flat tree of internally-stateful child components, each
using local `useState` only:

- **`Reveal`** — presentational scroll-in-view wrapper, no state.
- **`SectionHead`** — presentational (eyebrow/title/sub), no state.
- **`DataTable` / `Pill` / `Dep`** — pure presentational primitives; `DataTable` takes `headers:
  React.ReactNode[]` and `rows: TCell[][]` where `TCell = { v: React.ReactNode; k?: CellKind }`,
  `CellKind = 'pk' | 'fk' | 'ok' | 'bad' | 'mut'`.
- **`AnomalyPlayground`** — `useState<AnomalyMode>('idle')` where `AnomalyMode = 'idle' | 'update'
  | 'insert' | 'delete'`. Rows and the message panel are derived synchronously from `mode` on
  every render (no memoization) against a hardcoded `baseRows` array.
- **`FDExplorer`** — `useState<Record<number, boolean>>({})` tracking which of the 6 `FD_ITEMS`
  cards have been flipped/revealed, keyed by array index.
- **`NormalizationStudio`** — `useState(0)` for the current stage index into the module-level
  `STAGES: Stage[]` array (5 stages, `interface Stage { nf, title, blurb, redundancy: number
  (0-100), anomalies: boolean, tables: NormTable[] }`, `interface NormTable { name, pk, color,
  headers, rows }`). Back/Next buttons clamp with `Math.max`/`Math.min`.
  Stage 0 uses "un-normalised" and a `'0NF'` tag internally (the module comment/type calls the
  overall progression "1NF → 2NF → 3NF → BCNF" even though the STAGES array actually has 5 entries
  starting at `'0NF'` — worth knowing if regenerating, since the section 2 blurbs above describe
  five stages, not four).
- **`AtomicSplitter`** — `useState(false)` (`atomic`) toggling between two hardcoded row sets.
- **`OneNFSimulator`** — `useState(0)` (`step`, 0-2) over 3 phases; `afterRows` is derived via
  `flatMap` over the module-level `PLAYLIST_BEFORE` array at render time (parses each track string
  on `' · '` to split id/name).
- **`TwoNFSimulator`** — `useState(0)` (`phase`, 0-2) over 3 phases, driven by two hardcoded
  `TCell[][]` constants (`ORDER_ITEMS_BASE`, `ORDER_ITEMS_HIGHLIGHT`) plus inline JSX for the
  decomposed tables in phase 2.
- **`ThreeNFSimulator`** — `useState(0)` (`phase`, 0-2), with a module-level `CHAIN_NODES` array
  driving the animated dependency-chain diagram in phase 1.
- **`NFChecklist`** — `useState(0)` (`active`, 0-2) selecting into module-level `CHECKLISTS`
  array.
- **`NFDetective`** — `useState(0)` (`idx`), `useState<string|null>(null)` (`picked`),
  `useState(0)` (`score`), `useState(false)` (`done`), iterating the module-level `CASES: Case[]`
  array (4 items, `interface Case { table, pk, fds, options, answer, why }`).
  `choose()` is a no-op once `picked !== null` (locks the answer). `reset()` zeroes all four state
  vars.
- **`Quiz`** — same shape as `NFDetective` but over boolean true/false answers and the
  module-level `QUIZ` array (5 items, `{ q, a: boolean, e }`).
- **`NormalizationExplorerPage`** (root) — `heroRef` (`useRef`) plus three `useTransform`-derived
  motion values from `useScroll` for the hero parallax. No other state; simply lays out all
  sections in order and renders the child components described above.

No Firestore reads/writes, no `localStorage`/`sessionStorage` usage detected, no gating/unlock
logic, no scoring persisted beyond the current session's component state, no badge-award triggers.
Every quiz/detective/checklist resets to its initial state on a full page reload since none of it
is persisted.

## 5. Rebuild notes

- **Distinct from the gated slide deck.** `NormalizationDeck.tsx` is a separate component
  documented in a different lesson-docs file (gated-lessons doc, not this one) per the MBI802
  inventory in `lesson-docs/README.md`, and per that inventory it is locked behind an ER Knowledge
  Check quiz score threshold. This spec covers only the public
  `NormalizationExplorerPage.tsx`/`/normalisation` implementation; the deck's actual content was
  not read or transcribed here.
- **Duplicate route registration.** `/normalisation` (and its `/normalization` alias/redirect) are
  registered twice in `src/App.tsx` (once around line 96-98, again around line 181-183) with
  identical `element`s — this looks like leftover duplication in the route tree rather than two
  different behaviors; a rebuild should preserve at least one registration plus the alias
  redirect, and flag the duplicate to whoever owns `App.tsx` if consolidating routes.
  This route duplication is a property of `App.tsx`, not of `NormalizationExplorerPage.tsx` itself.
- **US/UK spelling split:** the canonical route is the UK spelling `/normalisation`; `/normalization`
  exists purely as a `<Navigate replace>` redirect to it. Any rebuild should preserve both paths.
  The same UK-spelling convention applies to the sibling routes `/normalisation-activities` and
  `/normalisation-videos` (out of scope for this file, listed in `lesson-docs/README.md`'s
  inventory as separate MBI802 lessons).
  present in this file — no `/normalisation-activities` or `/normalisation-videos` content is
  transcribed here.
- **Everything is inline data.** All example tables, FD lists, quiz questions/answers, checklist
  copy, and stage blurbs are hardcoded module-level constants inside the `.tsx` file itself
  (`FD_ITEMS`, `STAGES`, `CASES`, `QUIZ`, `NF_SUMMARY`, `CHECKLISTS`, `PLAYLIST_BEFORE`,
  `ORDER_ITEMS_BASE`, `ORDER_ITEMS_HIGHLIGHT`, `CHAIN_NODES`) — there is no CMS, JSON file, or
  Firestore collection backing any of this content. A rebuild must recreate these arrays verbatim
  (content transcribed in full in Section 2 above) rather than fetch them from anywhere.
  is no CMS, JSON file, or Firestore collection backing any of this content.
- **No assets.** No images, SVGs, video, or external links appear anywhere in the file — every
  visual (chain diagram, gradient blobs, table highlighting) is built from Tailwind
  classes/inline styles and emoji characters (✏️, ➕, 🗑️, ⚠️, ✅, 🕵️, 🎯, 📚, 🏆) rather than
  icon assets.
- **`0NF` naming quirk:** the `STAGES` array's first entry is labeled `'0NF'` ("Un-normalised"),
  which is a pedagogical convenience label, not a formally recognized normal form — worth
  preserving as-is since it's how the existing UI labels the starting point, but a rebuilder
  should know `0NF` is not standard textbook terminology.
- **No ambiguity found in content transcription** — all example tables, quiz Q&A, and stage data
  were read directly from the source literals and are reproduced in full in Section 2; nothing
  in this lesson required inference from filenames or external context.
