# Advanced Database Concepts — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/database-concepts` (registered twice in `src/App.tsx` — once in the
  unauthenticated `<Routes>` block, once in the authenticated block; both point at the exact
  same `DatabaseConceptsPage` component, so there is no separate gated variant)
- **Source files:**
  - `src/pages/DatabaseConceptsPage.tsx` (thin route wrapper, 25 lines)
  - `src/components/slides/DatabaseConceptsLesson.tsx` (self-contained scroll-reveal lesson
    component, 1399 lines)
- **Depends on:**
  - `src/components/public/PublicLessonShell.tsx` — shared hero-shell wrapper. Props:
    `eyebrow`, `titleLead`, `titleAccent`, `gradient` (CSS gradient string for the accent
    headline text), `accent`/`orb2`/`orb3` (hex colors for link/accent and two decorative
    blurred orbs), `subtitle`, `pills: {emoji, name, color}[]`, and `children`. It renders: a
    sticky translucent top nav with `BrandLogo` linking to `/home`; an Apple-style hero
    section (eyebrow, two-tone gradient headline, subtitle, pill row, "Scroll to begin"
    bouncing hint) with three blurred radial-gradient color orbs positioned absolutely behind
    the text; the lesson `children` in a max-width content area; and a quiet footer repeating
    `BrandLogo` plus "Everything here runs in your own browser. No login, no personal data
    collected." No auth/Firebase involved. See `src/components/public/PublicLessonShell.tsx`
    for the full implementation.
  - `src/components/ui/BrandLogo` (used inside `PublicLessonShell`)
  - No Firestore reads/writes, no auth, no external network calls, no external links — the
    entire lesson is static content plus purely client-side interactive-demo state
    (`useState`), and a `useReveal`/`IntersectionObserver`-driven scroll-reveal animation.

## 1. Purpose & learning objectives

A single continuous narrative lesson (not a slide deck — a long vertically-scrolling page)
built around one running example: a `bookshop` database with one main table, `books`. The
lesson teaches, in order: (1) shaping a table incrementally with `CREATE DATABASE`,
`CREATE TABLE`, `ALTER TABLE ADD COLUMN`, `ALTER TABLE MODIFY COLUMN`, adding a
`PRIMARY KEY`, and `AUTO_INCREMENT`; (2) linking tables with foreign keys and understanding
`ON DELETE`/`ON UPDATE` `CASCADE`, `SET NULL`, `SET DEFAULT`, and the no-rule (RESTRICT)
case, via a small `reviews` partner table; (3) backing up and restoring a database in MySQL
Workbench and via the `mysqldump`/`mysql` CLI; (4) sorting results with `ORDER BY`; (5)
counting rows with `COUNT()` and `GROUP BY`; and (6) SQL injection, explained and
demonstrated in plain English with an interactive, entirely client-side "pretend login form"
simulation (no real backend). It closes with a cheat-sheet of every query used in the lesson.
The page's hero subtitle states this directly: "One database, one table, built up step by
step. We create it, shape it, back it up, sort it and count it, then take a plain-English,
hands-on look at SQL injection." The intro paragraph inside the lesson body itself restates
the same arc: "In this lesson we look at what we can do with a database once it exists. We
shape a table, keep it safe with backups, and ask it questions by sorting and counting. We
finish with one important safety idea called SQL injection." The lesson's closing paragraph:
"One database, one table, and a handful of small commands. We can now shape it, protect it,
sort it and count it. The habit that matters most is the last one: we never trust text typed
into a box, and we never paste it straight into a command." — followed by
"MBI802 · Database Management Systems · Master of Business Informatics".

Confirmed topics against the actual file: table design ✓, foreign keys & CASCADE behavior ✓,
backup/restore ✓, sorting/counting (ORDER BY / COUNT) ✓, SQL injection introduction ✓ — all
five match the lesson-docs inventory description exactly.

## 2. Full content

The lesson is organized into a sticky-scroll sequence of `<Section>` blocks, each preceded by
a `SectionHeader` (kicker / title / blurb), further composed of `Reveal`-wrapped cards. All
SQL snippets below are transcribed verbatim from the source's data literals.

### Intro (unlabeled, before Part 1)
> "In this lesson we look at what we can do with a database once it exists. We shape a
> table, keep it safe with backups, and ask it questions by sorting and counting. We finish
> with one important safety idea called SQL injection."

Note strip (blue): "For the activities below, we use one database called `bookshop` and one
main table called `books`. We build it up together, one step at a time, so we are always
working with something familiar. Later we add one small partner table so we can see how two
tables link. Everything runs in **MySQL Workbench**."

> "Each idea comes with a short explanation, the SQL we run, and a small activity to try
> before moving on. Take your time, and feel free to run every example yourself."

### Part 1 · Shaping a table
Kicker: "Part 1 · Shaping a table" · Title: "From an empty database to a real table" ·
Blurb: "Six small steps, each one building on the last. The same table follows us through
the rest of the lesson."

Each step below is a `StepCard`: a numbered circle, title, explanation, a code block, and a
"✏️ Your turn" activity box with a task and a "Show the answer" reveal button.

1. **1 · Create the database**
   - Explain: "Before we can make any tables, we need somewhere to keep them. CREATE DATABASE
     tells MySQL to start a fresh, empty space with the name we give it. We run this in MySQL
     Workbench, then click the refresh icon on the Schemas panel to see our new bookshop
     appear."
   - Code: `CREATE DATABASE bookshop;`
   - Activity task: "Create a database called bookshop in MySQL Workbench. Then double-click
     it in the Schemas panel so it becomes your active database (its name turns bold)."
   - Activity answer: `CREATE DATABASE bookshop;`

2. **2 · Create a table**
   - Explain: "A table is just a grid of rows and columns, a bit like a spreadsheet with
     rules. Every column needs a name and a data type. We use INT for whole numbers,
     VARCHAR(100) for short text (100 is the longest it can hold), and DECIMAL for money. For
     now we make price an INT on purpose, and we fix that in step 4."
   - Code:
     ```sql
     USE bookshop;

     CREATE TABLE books (
       id     INT,
       title  VARCHAR(100),
       author VARCHAR(100),
       price  INT
     );
     ```
   - Activity task: "Inside bookshop, create a table called books with four columns: id
     (INT), title (VARCHAR 100), author (VARCHAR 100) and price (INT)."
   - Activity answer: same code block as above.

3. **3 · Add a new column**
   - Explain: "Tables are not set in stone. With ALTER TABLE ADD COLUMN we can add a new
     field at any time, and none of the data we already have is lost. Let us say the shop now
     wants to keep track of how many copies of each book are in stock."
   - Code: `ALTER TABLE books ADD COLUMN stock_count INT;`
   - Activity task: "Add a new column called stock_count (INT) to the books table."
   - Activity answer: same as code.
   - **Immediately followed by a "📍 Where does the new column go?" card** (`ColumnPositionCard`):
     intro — "By default a new column lands at the very end of the table. If we want it
     somewhere else, we add `AFTER` a column name, or `FIRST` to put it at the front." Three
     worked examples, each showing the resulting column order with the new column highlighted:
     - `ALTER TABLE books ADD COLUMN stock_count INT;` → columns become
       `id, title, author, price, stock_count` (stock_count highlighted) — "With no position
       given, the new column goes to the very end. This is the default."
     - `ALTER TABLE books ADD COLUMN pages INT AFTER title;` → `id, title, pages, author,
       price` (pages highlighted) — "AFTER title drops the new column in right after the
       title column."
     - `ALTER TABLE books ADD COLUMN sku INT FIRST;` → `sku, id, title, author, price` (sku
       highlighted) — "FIRST moves the new column to the very front of the table."
     - Closing note: "Position is just about the order the columns are listed in. It does not
       change any of the data inside them."

4. **4 · Change a column's data type**
   - Explain: "Right now price is an INT, so it can only hold whole numbers. But a book costs
     $19.99, not $19. MODIFY COLUMN lets us change the type of a column we already have.
     DECIMAL(6,2) means up to 6 digits in total, with 2 of them after the decimal point,
     which is perfect for prices."
   - Code: `ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);`
   - Activity task: "Change the price column from INT to DECIMAL(6,2) so it can hold cents."
   - Activity answer: same as code.
   - **Immediately followed by a "⚠️ Watch out: changing a type can change the data" card**
     (`TypeChangeCard`): intro — "Changing a column type is not always free. Sometimes the
     values inside change too. Here is what happens in three common cases. Green means the
     value is kept, red means it changes." Three scenarios, each showing before→after value
     pairs (green = kept, red = lost/changed):
     - `DECIMAL(6,2)` → `INT`: `24.99 → 25` (lost), `18.75 → 19` (lost), `42.00 → 42` (kept).
       Note: "Decimals are rounded to the nearest whole number, so the cents are lost for
       good. Values that were already whole survive unchanged."
     - `INT` → `VARCHAR(20)`: `25 → '25'` (kept), `100 → '100'` (kept). Note: "The value is
       kept, but it is now text. Sorting changes too, so \"100\" can come before \"20\"."
     - `VARCHAR(20)` → `INT`: `'25' → 25` (kept), `'sale' → 0` (lost). Note: "Clean number
       text converts back fine. Anything that is not a number turns into 0."
     - Closing line: "The lesson: **always back up before a big type change**, so we can
       restore if a value is lost. That is exactly what the backup section is for."

5. **5 · Make a column the primary key**
   - Explain: "A primary key is the column that gives every row its own identity. No two rows
     can share the same value, and it can never be left blank. id is the obvious choice here,
     because every book gets its own number and nothing else has to be unique."
   - Code: `ALTER TABLE books ADD PRIMARY KEY (id);`
   - Activity task: "Make id the primary key of the books table."
   - Activity answer: same as code.

6. **6 · Make a column auto-increment**
   - Explain: "Typing an id by hand for every new book is slow and easy to get wrong.
     AUTO_INCREMENT asks MySQL to do the counting for us. When we add a book without giving
     an id, MySQL fills in the next free number by itself (1, 2, 3 and so on). In MySQL a
     column has to be a key before it can auto-increment, which is why we did step 5 first."
   - Code: `ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;`
   - Activity task: "Make id AUTO_INCREMENT, then add a new book without giving it an id.
     Leave id out of the column list and watch MySQL fill in the number for you."
   - Activity answer:
     ```sql
     ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;

     INSERT INTO books (title, author, price, stock_count)
     VALUES ('Atomic Habits', 'James Clear', 24.99, 12);
     ```

After the six steps, a blue "➕ Let us add some books" card: "Before we sort and count, our
table needs a few real rows to work with. We run this INSERT once, and then we have five
books to play with for the rest of the lesson." Code:
```sql
INSERT INTO books (title, author, price, stock_count) VALUES
('Atomic Habits',            'James Clear',     24.99, 12),
('Sapiens',                  'Yuval N. Harari', 29.50,  7),
('The Pragmatic Programmer', 'David Thomas',    42.00,  3),
('Educated',                 'Tara Westover',   18.75, 20),
('Deep Work',                'Cal Newport',     22.00,  9);
```
Followed by a live rendered table ("This is what books now holds"), the canonical
`BOOKS` dataset used throughout the rest of the lesson:

| id | title                    | author            | price  | stock_count |
|----|--------------------------|-------------------|--------|-------------|
| 1  | Atomic Habits            | James Clear       | $24.99 | 12          |
| 2  | Sapiens                  | Yuval N. Harari   | $29.50 | 7           |
| 3  | The Pragmatic Programmer | David Thomas      | $42.00 | 3           |
| 4  | Educated                 | Tara Westover     | $18.75 | 20          |
| 5  | Deep Work                | Cal Newport       | $22.00 | 9           |

### Part 2 · Linking tables
Kicker: "Part 2 · Linking tables" · Title: "Foreign keys, and what CASCADE does" · Blurb:
"Real databases have many tables, and they point at each other. A foreign key is a column
that points to a row in another table. CASCADE (and its relatives) decide what happens to
that link when the row it points to is deleted or changed."

Note strip (cyan): "We add one small partner table called `reviews`, where each review
points to a book. Every demo below reuses these exact same two tables — only the rule
changes, so it is easier to see what each one does."

Setup card: "Here each review has a `book_id` that points to a book in `books` — in plain
English, \"this review belongs to that book.\" The one tricky question is: what should
happen to a review if the book it belongs to gets deleted, or gets a new id? We answer that
question with a rule, set right when we create the table."
```sql
CREATE TABLE reviews (
  id      INT PRIMARY KEY,
  book_id INT,
  comment VARCHAR(200),
  FOREIGN KEY (book_id) REFERENCES books(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```

Five rule cards, each icon + rule name + description:
- 🗑️ **ON DELETE CASCADE** — "Delete a book, and all of its reviews are deleted with it,
  automatically. The delete cascades down to the linked rows."
- 🈳 **ON DELETE SET NULL** — "Delete a book, and its reviews are kept — but their book_id
  resets to NULL, meaning \"we no longer know which book this was.\""
- 🧩 **ON DELETE / UPDATE SET DEFAULT** — "Reset the foreign key to a default value chosen up
  front, like a placeholder book_id. Not supported by MySQL."
- ✏️ **ON UPDATE CASCADE** — "Change a book's id, and every review that points to it updates
  to match, so no review is left pointing at the wrong book."
- 🛑 **No rule (RESTRICT)** — "MySQL refuses to delete or renumber a book while reviews still
  point to it, to avoid leaving broken links."

Note strip (cyan): "Three small scenarios below, each with the same click-and-see setup: pick
a rule, then try the action, and watch the two tables react."

The demo dataset used by all three scenarios below (`CASCADE_BOOKS` / `CASCADE_REVIEWS`):
- `books`: (1, "Atomic Habits"), (2, "Sapiens")
- `reviews`: (101, book_id 1, "Loved it"), (102, book_id 2, "Great read"), (103, book_id 2,
  "Life changing")

**Scenario 1 — "🗑️ what happens when you delete a book?"** (`DeleteCascadeDemo`, interactive):
Three rule toggle buttons — ON DELETE CASCADE / ON DELETE SET NULL / No rule — plus a
"🗑️ DELETE FROM books WHERE id = 2;" action button and a "↻ Reset" button. Live-updates the
two rendered mini-tables (`books`, `reviews (book_id points to books.id)`) and shows a result
banner:
- CASCADE (✅): "Book #2 is deleted, and its two reviews were deleted right along with it,
  automatically. The delete cascaded down from the book to its reviews." (books: only id 1
  remains; reviews: only id 101 remains)
- SET NULL (✅): "Book #2 is deleted, but its two reviews are kept. Their book_id is reset to
  NULL — \"this review no longer points at any book.\"" (books: only id 1 remains; reviews:
  102/103 keep their rows but `book_id` becomes `NULL`)
- No rule / RESTRICT (🚫): "MySQL blocks this. Two reviews still point to book #2, so with no
  rule it refuses to delete the book and leave those reviews pointing at nothing." (nothing
  changes — the delete is blocked)

**Scenario 2 — "✏️ what happens when a book's id changes?"** (`UpdateCascadeDemo`,
interactive): Two rule toggle buttons — ON UPDATE CASCADE / No rule — plus a
"✏️ UPDATE books SET id = 9 WHERE id = 2;" action button and a "↻ Reset" button.
- CASCADE (✅): "Book #2 becomes book #9, and both of its reviews were updated automatically
  to book_id 9. The rename cascaded down from the book to its reviews." (books: id 2 becomes
  9; reviews: both 102 and 103 have `book_id` updated to 9)
- No rule (🚫): "MySQL blocks this. Two reviews still point to book_id 2, so with no rule it
  refuses to renumber the book and leave those reviews pointing at a book_id that no longer
  exists." (nothing changes)

**Scenario 3 — "🧩 populating a default value instead"** (`DefaultValueDemo`, interactive,
labeled "Concept only — not in MySQL"): "Some databases (PostgreSQL, SQL Server) offer a
third reaction: `ON DELETE SET DEFAULT`. Instead of deleting the reviews (CASCADE) or
blanking them out (SET NULL), the `book_id` resets to a default value chosen up front —
here, a placeholder book with `id = 0` called \"(Unknown book)\" that already sits in the
table. Delete book #2, and its reviews quietly re-point at that placeholder instead of
disappearing or breaking. MySQL's InnoDB does not support this: if you write
`ON DELETE SET DEFAULT`, MySQL refuses to create the table at all. **SET NULL is the closest
MySQL gets to this idea.**" A single toggle button ("🗑️ Delete book #2 (Sapiens)" / "↻
Reset") swaps between a "before" state (placeholder book id 0 "(Unknown book)" plus Atomic
Habits) and an "after" state where Sapiens is gone and reviews that pointed to book_id 2 now
point to book_id 0.

### Part 3 · Backup & restore
Kicker: "Part 3 · Backup & restore" · Title: "Never lose a database again" · Blurb: "A
backup is a safety net. We learn to make one, and prove it works by restoring from it."

Intro card: "A backup is just a saved copy of our whole database. Every table and every row
is written out into a single file of plain SQL commands, such as CREATE TABLE and INSERT
INTO. If our database is ever deleted or damaged, or we make a change we cannot undo, we
open that file and **restore** everything exactly as it was."

Two side-by-side cards:
- **"💾 Backing up in MySQL Workbench"** (amber):
  1. Open the Server menu → **Data Export**
  2. Tick the `bookshop` schema
  3. Choose **Export to Self-Contained File** and pick where to save it
  4. Click **Start Export**
  - "This gives us one `.sql` file, a complete snapshot of the database that we can keep
    safe."
- **"♻️ Restoring in MySQL Workbench"** (green):
  1. Open the Server menu → **Data Import**
  2. Choose **Import from Self-Contained File** and select the `.sql` file we saved
  3. Under Default Target Schema, choose or create `bookshop`
  4. Click **Start Import**
  - "MySQL runs every command in the file again and rebuilds the database from scratch."

"The same thing on the command line" card: "Those buttons in Workbench are really running
these two commands for us. It is handy to recognise them if you ever see them written down."
- Back up: `mysqldump -u root -p bookshop > bookshop_backup.sql`
- Restore: `mysql -u root -p bookshop < bookshop_backup.sql`

"✏️ Your turn: lose it, then bring it back" card (amber):
1. Export bookshop to a self-contained file.
2. Right-click the bookshop schema and choose Drop Schema to delete it. This is safe,
   because we have a backup.
3. Use Data Import to bring it back from the file we saved.
4. Run `SELECT * FROM books;` to check that all of our books returned.

### Part 4 · Sorting results
Kicker: "Part 4 · Sorting results" · Title: "ORDER BY: putting rows in the order we want" ·
Blurb: "We keep the same books table and the same data. ORDER BY only changes the order the
rows come back in. We add ASC to go low to high, or DESC to go high to low, after the column
name."

Note strip (teal): "We keep using the same `books` table we created and filled earlier.
Nothing new to set up."

**"🔀 Sort it live"** (`OrderByExplorer`, interactive): buttons to pick the sort column
(price / title / stock_count) and direction (ASC ↑ low to high / DESC ↓ high to low). Shows
the live query text (e.g. `SELECT * FROM books ORDER BY price ASC;`) and re-sorts/re-renders
the full `BOOKS` table live, with the active sort column's header/cells highlighted. Caption:
"Notice that only the order of the rows changes. The books themselves stay exactly the
same."

Two activities:
- Activity 1: "Write a query that lists every book from cheapest to most expensive." →
  Answer: `SELECT * FROM books ORDER BY price ASC;`
- Activity 2: "Write a query that lists every book title in reverse alphabetical order, from
  Z to A." → Answer: `SELECT * FROM books ORDER BY title DESC;`

### Part 5 · Counting rows
Kicker: "Part 5 · Counting rows" · Title: "COUNT: answering how many" · Blurb: "COUNT tells
us how many rows match, and nothing more. On its own, COUNT(*) counts every row. Add a WHERE
and it counts only the rows we care about."

Note strip (purple): "Same `books` table again. Pick a filter below and watch the total
change."

**"🔢 Count it live"** (`CountExplorer`, interactive): three filter buttons —
"All books" (`SELECT COUNT(*) FROM books;`, matches all 5), "Priced over $20"
(`SELECT COUNT(*) FROM books WHERE price > 20;`, matches books priced > $20), "Low stock
(< 10)" (`SELECT COUNT(*) FROM books WHERE stock_count < 10;`, matches books with
stock_count < 10). Shows a large animated count number, the live query text, and the full
`BOOKS` table with non-matching rows dimmed. Caption: "The rows that match stay bright, and
COUNT simply adds them up. Faded rows are left out of the total."

Two activities:
- Activity 1: "Write a query that counts how many books cost more than $20." → Answer:
  `SELECT COUNT(*) FROM books WHERE price > 20;`
- Activity 2 (Stretch goal): "Stretch goal: count how many books we have for each author.
  (Hint: GROUP BY gathers matching rows together first, and then COUNT runs on each group.)"
  → Answer:
  ```sql
  SELECT author, COUNT(*) AS how_many
  FROM books
  GROUP BY author;
  ```

### Part 6 · A safety topic — SQL injection
Kicker: "Part 6 · A safety topic" · Title: "SQL injection, in plain English" · Blurb: "We do
not need to write any code to understand this. We just need to see it happen once."

Intro card (red): "Many websites build a database command by pasting whatever we type
straight into a sentence. A login form might build something like *find the user named
(whatever was typed)*. Most of the time that is fine. But if the site never checks what we
typed, we could type something that is not a name at all. It could be a piece of a database
command, and the database cannot tell the difference, so it simply runs it. That is **SQL
injection**: slipping a command into a box that was only meant to hold a word."

**"🔐 A pretend login form"** (`SqlInjectionSim`, fully interactive, purely client-side —
"Everything here runs in your browser only. There is no real database and no real login, and
nothing is sent anywhere."):
- Toggle between "⚠️ Naive version" and "🛡️ Safe version".
- Free-text Username and Password inputs.
- Three preset buttons:
  - "😇 Try a normal login" → fills username `sarah`, password `correcthorse`
  - "😈 Try the injection trick" → fills username `' OR '1'='1`, password `anything`
  - "↻ Clear" → empties both fields
- Live-rendered "What the database actually receives" query preview:
  - **Safe version** always shows a parameterized query:
    ```sql
    SELECT * FROM users
    WHERE username = ?
      AND password = ?;
    -- our text is sent separately, as data, never as command
    ```
  - **Naive version** shows the literal string concatenation, with the typed username spliced
    directly into the quoted literal (highlighted red if it looks like a trick):
    ```
    SELECT * FROM users
    WHERE username = '<typed username>'
      AND password = '<•••• masked>';
    ```
- Trick detection: `looksLikeTrick` regex tests for a single quote, `--`, or the word `OR`
  (case-insensitive) in either field.
- Outcome banner (appears once either field is non-empty):
  - Naive + trick (🔓 red, "ok: true"): head "Logged in, with no real password check" — body
    "We closed the quote early and added OR '1'='1', which is always true. The naive query
    treated our text as part of the command, so it let us in without a real password. That is
    SQL injection in action."
  - Safe + trick (🔒 green, "ok: false"): head "Login rejected" — body "The safe version never
    pastes our text into the command. It sends it separately as a plain value, so MySQL just
    looks for a user with that very strange name, finds nobody, and the trick does nothing."
  - Normal input, either mode (🔒 green): head "A normal login attempt" — body "This is an
    ordinary username and password. Both versions handle it the same way. Try the trick
    button to see where they differ."

"How real systems stay safe" — three rule cards:
- 🧱 **Never paste text into a command** — "We send whatever the user typed as a separate
  value, never as part of the command itself. That is exactly what the safe version above
  does."
- 🎯 **Check the input first** — "A username box has no reason to accept quote marks or the
  word OR, so we can reject them before they cause trouble."
- 🔒 **Give each account the least it needs** — "A login page never needs to delete tables,
  so we do not give it that power, even if something slips through."

### Quick reference — cheat sheet
Kicker: "Quick reference" · Title: "Every query from this lesson, in one place" · Blurb:
"Bookmark this. We will want it again during the practical lab."

Full cheat-sheet table (label → SQL), rendered as a stacked list:

| Label | SQL |
|---|---|
| Create a database | `CREATE DATABASE bookshop;` |
| Create a table | `CREATE TABLE books (id INT, title VARCHAR(100), author VARCHAR(100), price INT);` |
| Add a column | `ALTER TABLE books ADD COLUMN stock_count INT;` |
| Add a column in a position | `ALTER TABLE books ADD COLUMN pages INT AFTER title;` |
| Change a column type | `ALTER TABLE books MODIFY COLUMN price DECIMAL(6,2);` |
| Link tables, cascade on delete | `FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE` |
| Add a primary key | `ALTER TABLE books ADD PRIMARY KEY (id);` |
| Make a column auto-increment | `ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;` |
| Sort results | `SELECT * FROM books ORDER BY price ASC;` |
| Count rows | `SELECT COUNT(*) FROM books;` |
| Back up | `mysqldump -u root -p bookshop > bookshop_backup.sql` |
| Restore | `mysql -u root -p bookshop < bookshop_backup.sql` |

### Closing
🗄️ "One database, one table, and a handful of small commands. We can now shape it, protect
it, sort it and count it. The habit that matters most is the last one: we never trust text
typed into a box, and we never paste it straight into a command." — "MBI802 · Database
Management Systems · Master of Business Informatics"

## 3. UI & interaction design

- **Page chrome:** `DatabaseConceptsPage` wraps the lesson in `PublicLessonShell` (props:
  eyebrow/gradient/pills/etc, see `src/components/public/PublicLessonShell.tsx`) with:
  eyebrow "MBI802 · Database Management", headline "Let's make sense of **Advanced Database
  Concepts**" (accent gradient `linear-gradient(90deg, #2563eb, #0d9488, #7c3aed)`), accent
  `#2563eb`, orb2 `#0d9488`, orb3 `#dc2626`, subtitle as quoted in §1, and four topic pills:
  🗄️ Table design (`#2563eb`), 🔗 Foreign keys & CASCADE (`#0891b2`), 💾 Backup & restore
  (`#b45309`), 🛡️ SQL injection (`#dc2626`).
- **Layout model:** unlike the SQL Programming deck (a fixed-canvas slide viewer), this
  lesson is a long vertically scrolling white-background page ("Apple-like type", per the
  file's own header comment) composed of `<Section>` blocks (96px bottom margin each), each
  with a `SectionHeader` (uppercase colored kicker, large serif-free heading, grey blurb
  paragraph) followed by `Card`s (`#fafafa` background, 1px border, 24px border-radius, 28px
  padding).
- **Scroll-reveal animation:** every major content block is wrapped in `<Reveal>`, which uses
  an `IntersectionObserver` (`threshold: 0.12`) via the `useReveal` hook to fade-and-slide the
  block in (`opacity 0→1`, `translateY(26px)→0`, `0.6s ease`) the first time it scrolls into
  view, then disconnects the observer (one-shot per element).
- **Color coding by part:** each of the six parts has its own accent color used consistently
  for that section's kickers, note strips, and interactive controls: table design = blue
  `#2563eb` (`ACCENT`), linking tables = cyan `#0891b2` (`LINK`), backup = amber `#b45309`
  (`BACKUP`), sorting = teal `#0d9488` (`SORT`), counting = purple `#7c3aed` (`COUNT`), SQL
  injection = red `#e5484d` (`DANGER`) with green `#30a46c` (`SAFE`) used for safe/protected
  states throughout.
- **Code blocks:** rendered via `CodeBlock`/`highlightSql()`, a small regex-based SQL
  syntax highlighter (dark slate `#0f172a` background, green `#86efac` for quoted strings,
  slate-grey `#64748b` for `--`/`#` comments, sky-blue `#7dd3fc` for a fixed keyword list —
  CREATE, DATABASE, SCHEMA, TABLE, ALTER, ADD, COLUMN, MODIFY, CHANGE, PRIMARY, KEY,
  AUTO_INCREMENT, INSERT, INTO, VALUES, SELECT, FROM, WHERE, ORDER, BY, GROUP, COUNT, ASC,
  DESC, USE, AND, OR, DROP, AS, INT, VARCHAR, DECIMAL).
- **"Your turn" / activity interaction pattern:** `StepCard` and `ActivityCard` both use a
  toggle button ("Show the answer" / "Hide the answer") to reveal the SQL answer in a nested
  `CodeBlock`, animated in with a `dbcFade` keyframe (defined inline in the root component's
  `<style>` tag: fade + slight upward translate, 0.3s).
  Note: this is the one respect in which this lesson differs from the SQL Programming deck —
  it has genuine "try it yourself, then check" activities with hidden answers, not just
  explanatory slides.
- **Interactive demo pattern:** the three CASCADE scenarios, `OrderByExplorer`, and
  `CountExplorer` all follow the same shape — a row of toggle buttons that set some local
  `useState`, a live-updating rendered SQL query string and/or result table driven by that
  state, and (for the CASCADE demos) a colored ✅/🚫 outcome banner. `BooksTable`/`MiniTable`
  re-render with a `key`-driven `dbcFade` animation on data change, and dim (opacity 0.32)
  non-matching or removed rows rather than physically removing them, for a smoother visual
  diff.
- Responsive behavior: cards and grids use CSS Grid with `repeat(auto-fit, minmax(...))` so
  multi-column layouts (data-type/rule cards, table steps, cheat sheet) collapse to a single
  column on narrow viewports; tables scroll horizontally (`overflowX: 'auto'`) rather than
  compress.

## 4. Component & state architecture

- `DatabaseConceptsPage` (`src/pages/DatabaseConceptsPage.tsx`): no state; composes
  `PublicLessonShell` (fixed hero props) around `<DatabaseConceptsLesson />`.
- `DatabaseConceptsLesson` (`src/components/slides/DatabaseConceptsLesson.tsx`) is the root;
  it renders static section content plus five stateful child components. No props, no
  Firestore, no auth.
- Shared/reused primitives defined in-file: `useReveal`/`Reveal` (scroll animation),
  `SectionHeader`, `Card`, `Section`, `navBtn`/`presetBtn` (button style helpers), `NoteStrip`,
  `highlightSql`/`CodeBlock`, `BooksTable`/`MiniTable`/`ColumnStrip`/`Pill` (data-table
  renderers), `StepCard`/`ActivityCard` (the explain→try-it pattern).
- Static data literals: `BOOKS: Book[]` (5-book canonical dataset used by the table-shaping
  narrative, ORDER BY explorer, and COUNT explorer), `BOOK_COLS`, `TABLE_STEPS` (the six
  numbered shaping steps), `SAMPLE_DATA_SQL`, `TYPE_SCENARIOS` (three before/after
  type-conversion cases), `COL_POSITIONS` (three AFTER/FIRST examples), `REVIEWS_SQL`,
  `CASCADE_BOOKS`/`CASCADE_REVIEWS` (2-book/3-review dataset for the FK demos),
  `CASCADE_RULES` (five rule explainer cards), `SORT_CHOICES`, `COUNT_FILTERS` (three filters
  with inline `test: (b: Book) => boolean` predicates), `PROTECTION_RULES`, `CHEAT_SHEET`.
- Stateful child components (each owns its own local `useState`, no shared/global state, no
  persistence — every interaction resets on reload):
  - `DeleteCascadeDemo` — `rule: 'cascade'|'setnull'|'restrict'`, `deleted: boolean`. Derives
    displayed `books`/`reviews` arrays and a result banner from these two state values.
  - `UpdateCascadeDemo` — `cascade: boolean`, `renamed: boolean`. Same derivation pattern.
  - `DefaultValueDemo` — `after: boolean`, toggling between two fixed before/after datasets
    (`DEFAULT_BOOKS_AFTER`, `DEFAULT_REVIEWS_AFTER`, defined at module scope).
  - `OrderByExplorer` — `col: keyof Book` (default `'price'`), `dir: 'ASC'|'DESC'` (default
    `'ASC'`). Sorts a copy of `BOOKS` live via `Array.prototype.sort` (string
    `localeCompare` for text columns, numeric subtraction otherwise).
  - `CountExplorer` — `idx: number` (index into `COUNT_FILTERS`, default 0). Filters `BOOKS`
    live via the selected filter's `test` predicate.
  - `SqlInjectionSim` — `safe: boolean` (default false = naive), `username: string`,
    `password: string`, both free text, both default `''`. Derives `looksLikeTrick` via
    regex on every render (not memoized) and an `outcome` object with `ok`/`head`/`body` from
    the `safe`/`looksLikeTrick` combination (see §2 for exact copy). This is a pure front-end
    simulation — no request is ever sent, no real auth/database is touched.
  - `StepCard` / `ActivityCard` — each instance owns its own `open: boolean` toggle for the
    answer reveal.
- No Firestore reads/writes, no scoring, no badge-award triggers, no gating/unlock logic
  anywhere in this lesson — everything is presentational plus ephemeral local UI state.

## 5. Rebuild notes

- The file's own header comment (lines 1–12) is a useful authorial summary worth preserving
  verbatim in spirit: "A public, self-contained lesson. One running example, a `bookshop`
  database with a `books` table, carries the whole thing... House style matches the other
  public lessons (WebArchitectureLesson, SystemsSecurityLesson): white canvas, soft cards,
  reveal-on-scroll, Apple-like type." Those two sibling lessons are useful visual references
  if rebuilding the shared look from scratch, though they are out of scope for this doc.
  `WebArchitectureLesson`/`SystemsSecurityLesson` were not read as part of this audit; if
  fidelity to that exact "house style" is needed, treat this as an open reference to verify
  separately.
  Note: `WebArchitectureLesson` corresponds to the separate public "Web Architecture" lesson
  (`/web-architecture`) and `SystemsSecurityLesson` to "Systems Security" (`/systems-security`)
  per the top-level lesson-docs inventory — both are documented elsewhere in this project, not
  in this file.
- `ON DELETE SET DEFAULT` (Scenario 3) is explicitly called out in the source as a
  **concept-only, non-MySQL feature** — MySQL's InnoDB refuses to create a table with that
  clause. The demo is intentionally simpler/non-interactive-in-the-same-way as the other two
  (a single toggle rather than a 2-3-way rule picker) specifically because it can't be driven
  by a real MySQL example. Do not "fix" this into a live 3-way toggle matching the other two
  scenarios — the asymmetry is deliberate, per the inline code comment: "MySQL's InnoDB
  refuses to even create a table with this clause, so this is a concept-only, non-interactive
  before/after rather than a live demo like the two above."
- The `SqlInjectionSim` trick-detection regex (`/('|--|\bOR\b)/i`) is intentionally naive/
  simple for teaching purposes — it is not meant to be a realistic injection-detection engine,
  just enough to visually distinguish "looks like an attempt" from "normal input" in the two
  provided presets. A rebuilder should keep it simple, not "improve" it into something more
  sophisticated, since the pedagogical point is about parameterized queries vs. string
  concatenation, not about input-validation completeness.
- No external links, images, or video/audio assets are referenced anywhere in this component
  — everything is inline styled JSX and inline SVG-free HTML tables. No revalidation needed.
- No known TODOs or obviously dead code were found in this file during the read-through.
