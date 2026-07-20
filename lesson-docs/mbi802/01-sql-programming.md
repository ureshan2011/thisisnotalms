# Introduction to SQL with MySQL — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/sql-programming` (registered twice in `src/App.tsx` — once in the
  unauthenticated `<Routes>` block, once in the authenticated block; both point at the exact
  same `SQLProgrammingPage` component, so there is no separate gated variant)
- **Source files:**
  - `src/pages/SQLProgrammingPage.tsx` (thin route wrapper, 25 lines)
  - `src/components/slides/SQLProgrammingDeck.tsx` (self-contained slide-deck component with
    all 13 slides' markup as inline HTML string literals, 1362 lines)
- **Depends on:**
  - `src/components/public/PublicLessonShell.tsx` — shared hero-shell wrapper (nav, hero
    headline/gradient/pills, footer) that wraps the deck. See
    `lesson-docs/mbi802/02-database-concepts.md` §3/4 for its prop shape and rendering, or
    read the component directly — it takes `eyebrow`, `titleLead`, `titleAccent`, `gradient`,
    `accent`, `orb2`, `orb3`, `subtitle`, `pills[]`, `children`.
  - `src/components/ui/BrandLogo` (used inside `PublicLessonShell`, not by the deck itself)
  - `lucide-react` icons: `ChevronLeft`, `ChevronRight`, `Maximize2`, `Minimize2`, `Maximize`,
    `Minimize`
  - Google Fonts (loaded via `@import` inside the deck's own injected `<style>` tag):
    `Plus Jakarta Sans` (400/500/600/700/800) and `JetBrains Mono` (400/600/700)
  - No Firestore reads/writes, no auth, no external data — the entire lesson is static
    content baked into the `SLIDES` array plus purely client-side deck-navigation state.

## 1. Purpose & learning objectives

This is a from-scratch introduction to SQL and MySQL for students with no prior database
experience. It walks through the five core SQL commands (CREATE, INSERT, SELECT, UPDATE,
DELETE) one at a time, using a single running example — a `school_db` database with a
`students` table — then extends into filtering (WHERE), sorting (ORDER BY), aggregate
functions (COUNT/AVG/MAX/MIN/GROUP BY), and joining two tables (INNER JOIN). It is presented
as a 16:9 slide deck (like a lecture slideshow) rather than a scrolling article, and is meant
to be either self-paced by a student or projected/stepped through by an instructor. The
subtitle on the page's hero section states the goal directly: "The language databases
actually speak. Create a database, build a table, drop in some rows, then ask it
questions — one interactive slide at a time."

## 2. Full content

The deck is a fixed 1920×1080 slide canvas rendered via `dangerouslySetInnerHTML` from a
`SLIDES` array of `{ classes, label, html }` objects, scaled down to fit its container. There
are **13 slides**. Internal labels are numbered 01, then 03–14 — there is a gap: no slide is
labeled "02" anywhere in the array (see Rebuild notes). Each slide (except the title slide)
ends with the same footer: left side "MBI802 · Database Management Systems", right side
"© Yasas Sri Wickramasinghe · All Rights Reserved".

### Slide 1 — "01 Title" (dark)
Full-bleed dark hero slide with a faint SVG grid background and two glowing radial-gradient
orbs (blue top-right, green bottom-left).
- Eyebrow (`section-num`): **MBI802 · Database Management Systems**
- Title: **Introduction to SQL with MySQL** (line break after "to", "SQL" rendered in accent
  blue)
- Subtitle: "From databases to your first queries — a beginner-friendly guide to structured
  data."
- Decoration: three macOS-style traffic-light dots (red/yellow/green) followed by a mock
  terminal prompt: `mysql> SELECT * FROM knowledge;` with a blinking cursor block after it.

### Slide 2 — "03 What is SQL" (dark)
- Tag: **The Language**
- Title: **What is SQL?**
- Left column body text: "**SQL** (Structured Query Language) is the standard language for
  talking to relational databases."
- Three stacked dark cards:
  1. **CREATE** — "Make databases and tables"
  2. **INSERT / SELECT** — "Add and read data"
  3. **UPDATE / DELETE** — "Modify and remove data"
- Right column label: "MySQL = SQL + Database Server"
- A boxed callout with an "M" logo tile, "MySQL" heading, and subtext "The world's most
  popular open-source database", followed by: "Used by **Facebook, Twitter, YouTube** and
  thousands of other applications worldwide."
- Green highlight box: "**SQL is not case-sensitive** — `SELECT` = `select` = `Select`. But
  writing keywords in UPPERCASE is standard practice."

### Slide 3 — "04 MySQL Data Types" (light)
- Tag: **Building Blocks**
- Title: **MySQL Data Types**
- Intro line: "Every column in a table must have a data type — it tells MySQL **what kind of
  value** to expect."
- A 3×3 grid of data-type cards, color-grouped by category:
  - Blue group (numbers): `INT` — "Whole numbers" (e.g. 1, 25, 1000); `FLOAT / DECIMAL` —
    "Decimal numbers" (e.g. 3.14, 99.99); `BIGINT` — "Very large whole numbers"
    (e.g. 9,223,372,036…)
  - Green group (text): `VARCHAR(n)` — "Text up to *n* characters" (e.g. 'Alice', 'Hello');
    `TEXT` — "Long text (no length limit)" (e.g. blog post content); `CHAR(n)` — "Fixed-length
    text" (e.g. country codes 'MY')
  - Amber group (date/time): `DATE` — "Calendar date" (e.g. '2024-09-01'); `DATETIME` —
    "Date + time combined" (e.g. '2024-09-01 09:30:00')
  - Red (boolean): `BOOLEAN` — "True or False (1 or 0)" (e.g. `is_active = TRUE`)

### Slide 4 — "05 CREATE" (light) — Command 1 of 5
- Tag: **Command 1 of 5**
- Title: **Creating Databases & Tables**
- Step 1 — Create a Database:
  ```sql
  CREATE DATABASE school_db;
  USE school_db;
  ```
- Step 2 — Create a Table:
  ```sql
  CREATE TABLE students (
    id      INT PRIMARY KEY,
    name    VARCHAR(100),
    age     INT,
    email   VARCHAR(150),
    gpa     DECIMAL(3,2)
  );
  ```
- "🔑 Key Concepts" card:
  - `PRIMARY KEY` — unique identifier for each row
  - `VARCHAR(n)` — text up to *n* characters
  - `DECIMAL(3,2)` — 3 digits, 2 after decimal (e.g. 3.75)
- Result visualization: an empty `students` result table with columns id/name/age/email/gpa
  and a single centered "(no rows yet)" placeholder row.

### Slide 5 — "06 INSERT INTO" (light) — Command 2 of 5
- Tag: **Command 2 of 5**
- Title: **Inserting Data**
- Syntax:
  ```sql
  INSERT INTO table_name
    (column1, column2, ...)
  VALUES
    (value1, value2, ...);
  ```
- Example — Insert 3 students:
  ```sql
  INSERT INTO students (id, name, age, email, gpa)
  VALUES
    (1, 'Alice', 20, 'alice@uni.edu', 3.80),
    (2, 'Bob',   22, 'bob@uni.edu',   3.50),
    (3, 'Carol', 21, 'carol@uni.edu', 3.90);
  ```
- "Anatomy of INSERT" card with three badge rows:
  - `INSERT INTO` — which table to add rows to
  - `(columns)` — which columns you're filling
  - `VALUES` — the actual data — match column order!
- Result table (students now has rows):

  | id | name  | age | gpa  |
  |----|-------|-----|------|
  | 1  | Alice | 20  | 3.80 |
  | 2  | Bob   | 22  | 3.50 |
  | 3  | Carol | 21  | 3.90 |
- Green tip: "💡 You must supply a value for `id` — it is the PRIMARY KEY and must be unique
  for every row."

### Slide 6 — "07 SELECT" (dark) — Command 3 of 5
- Tag: **Command 3 of 5**
- Title: **Querying Data with SELECT**
- Three code examples:
  - Select ALL columns: `SELECT * FROM students;`
  - Select SPECIFIC columns: `SELECT name, gpa FROM students;`
  - Select with an alias: `SELECT name AS 'Student Name', gpa AS 'Grade Point' FROM students;`
- Right side shows two result tables:
  - "SELECT * → all columns": full 5-column table (id, name, age, email, gpa) with rows for
    Alice (1,20,alice@…,3.80), Bob (2,22,bob@…,3.50), Carol (3,21,carol@…,3.90)
  - "SELECT name, gpa → 2 columns only": name/gpa only, same three students and GPAs
- Yellow tip: "⭐ Use `SELECT *` for exploration; use specific columns in real apps for
  speed."

### Slide 7 — "08 WHERE" (light) — Filtering
- Tag: **Filtering**
- Title: **Filtering with WHERE**
- Syntax:
  ```sql
  SELECT columns
  FROM table
  WHERE condition;
  ```
- Examples:
  ```sql
  -- students older than 20
  SELECT * FROM students
  WHERE age > 20;

  -- find a specific student
  SELECT * FROM students
  WHERE name = 'Alice';

  -- multiple conditions
  SELECT * FROM students
  WHERE age > 20 AND gpa >= 3.70;
  ```
- "Comparison Operators" card (2-column grid of badges): `=` equal to, `!=` not equal,
  `>` greater than, `<` less than, `>=` ≥, `<=` ≤, `AND` both true, `OR` either true.
- Result — "WHERE age > 20":

  | id | name | age | gpa  |
  |----|------|-----|------|
  | 2  | Bob  | 22  | 3.50 |
  | 3  | Carol| 21  | 3.90 |
- Tip: "💡 Use `LIKE '%term%'` to search text — e.g. `WHERE name LIKE 'A%'` finds all names
  starting with A."

### Slide 8 — "09 ORDER BY" (light) — Sorting
- Tag: **Sorting**
- Title: **Sorting with ORDER BY**
- Syntax:
  ```sql
  SELECT columns
  FROM table
  ORDER BY column ASC|DESC;
  ```
- Examples:
  ```sql
  -- highest GPA first
  SELECT * FROM students
  ORDER BY gpa DESC;

  -- alphabetical by name
  SELECT * FROM students
  ORDER BY name ASC;

  -- combined with WHERE + LIMIT
  SELECT * FROM students
  WHERE age > 20
  ORDER BY gpa DESC LIMIT 10;
  ```
- Two side-by-side explainer cards:
  - **ASC** — "Ascending (default), smallest → largest" — example sequence `1 → 2 → 3`,
    `A → B → C`
  - **DESC** — "Descending, largest → smallest" — example sequence `3 → 2 → 1`, `C → B → A`
- Result — "ORDER BY gpa DESC":

  | # | name  | gpa  |
  |---|-------|------|
  | 1st | Carol | 3.90 |
  | 2nd | Alice | 3.80 |
  | 3rd | Bob   | 3.50 |
- Green tip: "💡 Add `LIMIT 10` at the end to get only the top N results — great for
  leaderboards!"

### Slide 9 — "10 UPDATE" (dark) — Command 4 of 5
- Tag: **Command 4 of 5**
- Title: **Updating Records**
- Syntax:
  ```sql
  UPDATE table
  SET column1 = new_value
  WHERE condition;
  ```
- Examples:
  ```sql
  -- Bob got a better grade!
  UPDATE students
  SET gpa = 3.75
  WHERE id = 2;

  -- Update multiple columns
  UPDATE students
  SET age = 23, email = 'bob.new@uni.edu'
  WHERE id = 2;
  ```
- Before/After visual (id, name, gpa columns):
  - Before UPDATE: Alice 3.80, **Bob 3.50 ←** (highlighted red), Carol 3.90
  - After UPDATE: Alice 3.80, **Bob 3.75 ✓** (highlighted green), Carol 3.90
- Red warning box: "⚠️ **Always use WHERE!** Without it, every row gets updated — a common
  mistake!"

### Slide 10 — "11 DELETE" (light) — Command 5 of 5
- Tag: **Command 5 of 5**
- Title: **Deleting Records**
- Syntax:
  ```sql
  DELETE FROM table
  WHERE condition;
  ```
- Example:
  ```sql
  -- remove one student
  DELETE FROM students
  WHERE id = 2;

  -- remove low-GPA records
  DELETE FROM students
  WHERE gpa < 3.60;
  ```
- "Before DELETE WHERE id = 2" table: Alice (1, 3.80), ~~Bob (2, 3.75)~~ struck through in
  red, Carol (3, 3.90)
- "After DELETE" table: Alice (1, 3.80), Carol (3, 3.90)
- Amber callout "⚠️ DELETE vs TRUNCATE":
  - `DELETE FROM t WHERE …` — removes specific rows
  - `DELETE FROM t` — removes all rows (slow)
  - `TRUNCATE TABLE t` — wipes all rows instantly, resets IDs

### Slide 11 — "12 Aggregate Functions" (light) — Going Further
- Tag: **Going Further**
- Title: **Aggregate Functions**
- Intro: "Perform calculations **across many rows** and return a single result."
- Code examples:
  ```sql
  -- count all students
  SELECT COUNT(*) FROM students;

  -- average GPA
  SELECT AVG(gpa) FROM students;

  -- highest and lowest GPA
  SELECT MAX(gpa), MIN(gpa)
  FROM students;

  -- group by + count
  SELECT age, COUNT(*) AS total
  FROM students
  GROUP BY age;
  ```
- Four function cards, each with a live-example result:
  - **COUNT()** — "Counts number of rows" → 3
  - **AVG()** — "Average of a column" → 3.83
  - **MAX()** — "Highest value" → 3.90
  - **MIN()** — "Lowest value" → 3.50
- "GROUP BY age result" table:

  | age | total |
  |-----|-------|
  | 20  | 1     |
  | 21  | 1     |
  | 22  | 1     |
- Tip: "💡 `GROUP BY` groups rows so functions run *per group*."

### Slide 12 — "13 Joining Tables" (dark) — Relationships
- Tag: **Relationships**
- Title: **Joining Tables**
- Two small source tables shown side by side:
  - `students`: id/name → (1, Alice), (2, Bob), (3, Carol)
  - `grades`: student_id/score → (1, 88), (2, 75), (3, 95)
- Visual: two circles labeled "students" and "grades" overlapping around a small "JOIN"
  badge (Venn-diagram style).
- INNER JOIN query:
  ```sql
  SELECT
    s.name,
    g.score
  FROM students AS s
  INNER JOIN grades AS g
    ON s.id = g.student_id;
  ```
- Combined result:

  | name  | score |
  |-------|-------|
  | Alice | 88    |
  | Bob   | 75    |
  | Carol | 95    |
- Callout: "**INNER JOIN** returns only matching rows from *both* tables."

### Slide 13 — "14 Summary" (light) — Quick Reference
- Tag: **Quick Reference**
- Title: **Summary & Quick Reference**
- An 8-card grid, each a dark navy tile with command name, one-line description, and a
  mono-font syntax snippet:
  1. **CREATE** — "Make a new database or table" — `CREATE TABLE t (…);`
  2. **INSERT** — "Add rows to a table" — `INSERT INTO t (…) VALUES (…);`
  3. **SELECT** — "Read / query data" — `SELECT * FROM t WHERE …;`
  4. **UPDATE** — "Modify existing rows" — `UPDATE t SET col=v WHERE …;`
  5. **DELETE** — "Remove rows" — `DELETE FROM t WHERE …;`
  6. **ORDER BY** — "Sort results" — `ORDER BY col ASC|DESC;`
  7. **Aggregates** — "Calculate across rows" — `COUNT · AVG · MAX · MIN · SUM`
  8. **JOIN** — "Combine multiple tables" — `INNER JOIN t ON a.id=b.id;`

There are no quiz questions, no scored assessments, and no answer-reveal interactions
anywhere in this deck — it is pure explanatory slide content with no student-input
activities (contrast with `DatabaseConceptsLesson.tsx`, which does have "Your turn" / "Show
the answer" activities).

## 3. UI & interaction design

- **Page chrome:** `SQLProgrammingPage` wraps the deck in `PublicLessonShell` with:
  eyebrow "MBI802 · Database Management", headline "Let's make sense of **SQL.**" (accent
  gradient `linear-gradient(90deg, #2563eb, #4a8ef5, #22d3ee)`), accent `#2563eb`, orb2
  `#22d3ee`, orb3 `#7c3aed`, subtitle as quoted above, and four topic pills: 🗄️ CREATE
  (`#2563eb`), ➕ INSERT (`#0891b2`), 🔍 SELECT (`#7c3aed`), ⌨️ Live syntax (`#0d9488`).
- **Deck chrome:** the deck itself renders as a dark (`#0f1117`) rounded-corner "video
  player"-style widget with a macOS-style toolbar (red/yellow/green traffic-light dots,
  label `MBI802 · SQL Deck · {current+1} / {total} · ← → to navigate`), an Expand/Collapse
  toggle, and a Fullscreen toggle (uses the Fullscreen API on the deck's root ref).
- **Slide canvas:** a fixed 1920×1080 `.sqld` canvas is scaled via CSS `transform: scale()`
  to fit the container width (aspect ratio 16:9 maintained by `padding-bottom: 56.25%`
  normally, or `75%` when "Expanded"). In fullscreen mode it letterboxes/centers instead
  using `Math.min(w/1920, h/1080)` and centers with computed x/y offsets. A `ResizeObserver`
  recalculates scale on any container resize.
- **Navigation:** Prev/Next buttons (disabled at the first/last slide) plus a row of dot
  indicators — the active dot is a wider pill (22px) in accent blue, others are small grey
  dots (8px), each with a `title` tooltip showing the slide's internal label. Left/Right
  arrow keys also navigate (ignored while focus is in an `<input>`/`<textarea>`).
- **Visual language (deck-internal `DECK_CSS`):** dark navy (`#1C1E2E`/`#252840`) and light
  (`#F8F9FC`) slide variants alternate for pacing; fonts are Plus Jakarta Sans (sans) and
  JetBrains Mono (code/labels); code blocks use a Catppuccin-esque palette (keywords blue
  `#89B4FA`, functions teal `#94E2D5`, strings green `#A6E3A1`, numbers orange `#FAB387`,
  comments grey-italic `#585B70`, table names pink `#F38BA8`, column names purple `#CBA6F7`,
  operators cyan `#89DCEB`); result tables have a blue header row and alternating zebra
  striping; badges/pills come in blue/green/red/yellow variants; highlight/callout boxes have
  a colored left border and tinted background (blue/green/yellow/red variants used across
  slides).
- No slide transition animation is used beyond the instant swap driven by `current` state;
  fades are not implemented in this deck (unlike `DatabaseConceptsLesson`, which uses CSS
  reveal-on-scroll).
- Responsive behavior is entirely handled by the scaling canvas — the 1920×1080 layout itself
  is fixed/non-reflowing, so on narrow viewports the whole slide simply shrinks uniformly.

## 4. Component & state architecture

- `SQLProgrammingPage` (`src/pages/SQLProgrammingPage.tsx`): no state; purely composes
  `PublicLessonShell` (fixed hero props) around `<SQLProgrammingDeck />`.
- `SQLProgrammingDeck` (`src/components/slides/SQLProgrammingDeck.tsx`) — all state is local,
  ephemeral React state, no Firestore/auth/props:
  - `current: number` — index into `SLIDES`, default `0`.
  - `expanded: boolean` — toggles the non-fullscreen aspect ratio (56.25% ↔ 75% padding-bottom).
  - `isFullscreen: boolean` — mirrors `document.fullscreenElement`, updated via a
    `fullscreenchange` listener.
  - `scale: number` / `offset: {x, y}` — computed by a `ResizeObserver` on the wrapping div
    (`wrapRef`) to scale/center the fixed 1920×1080 canvas.
  - `deckRef` / `wrapRef` — DOM refs for the fullscreen target and the resize-observed
    wrapper.
  - Slide content (`SLIDES`) and all CSS (`DECK_CSS`) are **module-level constants**, not
    state — the component is purely a viewer/navigator over static data.
  - A `useEffect` injects `DECK_CSS` into `document.head` as a `<style id="sql-deck-styles">`
    tag on mount and removes it on unmount (global style injection, not scoped/CSS-modules).
  - A `useEffect` registers a `keydown` window listener for arrow-key navigation.
  - Slide markup itself is rendered via `dangerouslySetInnerHTML` — the `SLIDES[i].html`
    strings contain raw HTML (with inline `style=""` attributes and class names scoped under
    `.sqld`), not React elements.
  - No Firestore reads/writes, no scoring, no badges, no external network calls.

## 5. Rebuild notes

- **Numbering gap:** the `SLIDES` array's `label` field goes `01 Title`, `03 What is SQL`,
  `04 …` … `14 Summary` — there is no slide labeled `02` anywhere in the file. This looks
  like a slide (likely a "why SQL matters" or "relational databases" intro slide) that was
  authored, numbered, and later deleted from the deck without renumbering the rest. The deck
  functions fine with the gap since navigation is by array index, not by label; a rebuilder
  should not invent content for a "slide 02" unless restoring intentionally.
- The malformed/incomplete CSS rule around `.sqld .card-` (line ~143 in `DECK_CSS`, before the
  `.badge` rules) is dead/broken CSS left in the template literal — it does not error (it's
  inside a plain JS string), but it is inert; not worth reproducing exactly, just be aware the
  source has this quirk if diffing byte-for-byte.
- All numeric/text content (student data — Alice/Bob/Carol, ages 20/22/21, GPAs 3.80/3.50/3.90,
  grades 88/75/95) is illustrative and repeats consistently across slides; a rebuild should
  keep values consistent slide-to-slide since several slides visually depend on the same
  three-row dataset (INSERT → SELECT → WHERE → ORDER BY → UPDATE → DELETE all reuse it).
  Note the `UPDATE` slide's "before" GPA shown for Bob is 3.50 (matching the original INSERT),
  but the DELETE slide's "before" table shows Bob's GPA as 3.75 (post-UPDATE) — this is
  intentional narrative continuity across slides, not an inconsistency to fix.
  Note the DELETE slide's "before" table strikes out Bob's row with GPA `3.75`, i.e. it
  assumes the UPDATE slide's edit already happened — the deck tells one continuous story
  across CREATE→INSERT→SELECT→WHERE→ORDER BY→UPDATE→DELETE using the same three students.
- The deck injects global CSS scoped only by the `.sqld` class prefix directly into
  `document.head`; if two instances of this component ever mounted simultaneously the
  `getElementById` guard would prevent double-injection, but unmounting one would remove the
  style tag out from under the other. Not an issue today since the route only mounts one
  instance.
- No external links, images, or video assets are referenced anywhere in this component —
  everything is inline SVG/HTML/CSS. No revalidation needed.
- No quiz/scoring/badge logic exists in this lesson at all.
