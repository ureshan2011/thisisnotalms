# DBMS Knowledge Check — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Gated (student/staff login required) **and** additionally locked behind a second
  score-threshold gate: the student's best percentage on the ER Knowledge Check quiz (a
  different quiz, `erMcqResults` collection) must exceed 50% (strict `>`, so exactly 50% does
  **not** unlock it). This is the identical double-gating mechanism used by the Normalization
  slide deck lesson — see the sibling doc `18-normalization-deck.md` for the same gate
  documented from that lesson's side. Staff (`lecturer`/`teachingAssistant` roles) bypass both
  gates entirely and always see the staff view.
- **Route(s):** `/student/course-resources` (no dedicated route — rendered inline as a lesson
  row inside the MBI802 tab; lesson `id: 'quiz'`)
- **Source files:**
  - `src/pages/student/CourseResources.tsx` — hosts the lesson metadata (`COURSES` array, MBI802
    lessons, `id: 'quiz'`, lines ~220–226), the double-gating logic (`erMcqPassed` state, lines
    ~1480, ~1493–1515; the `gated` boolean, line ~1742), the shared `LessonRow` locked-accordion
    shell (lines ~1373–1467), and the `QuizLesson` wrapper function (lines ~419–457) which
    renders the pre-quiz warning banner and switches between staff/student views. Mounted at
    line ~1783 via `{lesson.id === 'quiz' && (<QuizLesson studentProfile={studentProfile}
    isStaff={isStaff} />)}`.
  - `src/components/quiz/MBI802Quiz.tsx` (423 lines) — the student-facing quiz component:
    intro screen, question-taking screen (grouped by category, collapsible), result screen with
    category breakdown and full answer review.
  - `src/components/quiz/QuizResultsDashboard.tsx` (390 lines) — the staff-facing results
    dashboard: summary stat cards, score-distribution chart, best-score-per-student table, and
    all-attempts table with search/sort.
  - `src/lib/mbi802QuizData.ts` (480 lines) — the question bank itself: `QuizQuestion` interface,
    `MBI802_QUIZ_ID`, `MBI802_QUIZ_TITLE`, `MBI802_QUIZ_PASS_PERCENTAGE`, the `QUIZ_QUESTIONS`
    array (38 questions), and the derived `QUIZ_CATEGORIES` array.
- **Depends on:**
  - Firestore collection `mbi802QuizResults` — one document per attempt, written by
    `MBI802Quiz.tsx` on submit, read (all documents, live) by `QuizResultsDashboard.tsx`.
  - Firestore collection `erMcqResults` — read-only from this lesson's perspective; document ID
    = student UID; field `bestPercentage` drives the `erMcqPassed` gate in the parent
    `CourseResources` component. Written by the separate ER Knowledge Check quiz component
    (`ERMcq.tsx`, not part of this file's scope).
  - Firestore collection `students` — read by the parent component to build `studentProfile`
    (used to stamp `studentName`/`studentDisplayId`/`studentSection`/`studentCampus` onto each
    quiz result document).
  - `lucide-react` icons: `CheckCircle2`, `XCircle`, `ChevronUp`, `ChevronDown`, `BookOpen`,
    `Trophy`, `RotateCcw`, `Send` (quiz), `Users`, `Award`, `BarChart2` (dashboard), plus
    `FlaskConical` (warning banner icon, used in `CourseResources.tsx`).
  - `src/contexts/AuthContext.tsx` (`useAuth`) and `src/lib/firebase.ts` (`db`).
  - `src/lib/types.ts` (`StudentProfile` type).

## 1. Purpose & learning objectives

A theory-and-scenario knowledge check for MBI802 — explicitly **not** a SQL-coding exercise.
The quiz covers Database Management System concepts (data vs. information, relational database
fundamentals, and applying both to real-world scenarios) plus a final "tricky questions" round
that tests edge cases and misconceptions. Its subtitle in the lesson list is "38 questions · No
time limit · Unlimited attempts," and the intro screen for students reiterates: "38
multiple-choice questions across four topic areas. No time limit — take your time and think
carefully. You may retake as many times as you like."

The lesson is explicitly positioned as something students should only attempt once their MySQL
environment is set up — see lesson 15 (`15-mysql-setup.md`, the MySQL Development Environment
Setup lesson) for that prerequisite. The pre-quiz warning banner (verbatim text in Section 2
below) makes this explicit, though — importantly — this precondition is advisory only and is
**not** programmatically enforced; there is no code check that MySQL setup was completed before
a student can open this quiz. The only two things that are programmatically enforced are (a)
MBI802 enrollment gating on the whole Course Resources tab, and (b) the ER Knowledge Check
score-over-50% gate described below.

Passing threshold: `MBI802_QUIZ_PASS_PERCENTAGE = 60` (defined in `mbi802QuizData.ts`) — a
score of 60% or higher on a given attempt is treated as "passed" for that attempt's result-screen
styling (green vs. red theming, "Great work!" vs. "Keep studying!"). Note this 60% figure is
distinct from, and unrelated to, the 50% ER-MCQ threshold that gates access to the lesson in the
first place.

## 2. Full content

### Pre-quiz warning banner (shown to non-staff users only, above the quiz)

Rendered by the `QuizLesson` wrapper in `CourseResources.tsx` as a rounded, amber/yellow card
with a `FlaskConical` icon. Verbatim text:

> **Try this only if you have your MySQL setup ready!**
>
> These questions are designed for students who have already completed the MySQL installation.
> If your setup is still in progress, finish the setup first — come back to this quiz once you
> are ready. The quiz covers Database Management System theory and real-world scenarios, not SQL
> coding.

### Quiz metadata

- Quiz ID: `mbi802-dbms-basics-v1`
- Quiz title: "Database Management System Fundamentals" (this is the title shown on the intro
  card and on the staff dashboard header — distinct from the lesson-list title "DBMS Knowledge
  Check")
- Pass percentage: 60%
- Total questions: 38
- Time limit: none
- Attempt limit: unlimited (students may retake indefinitely; every attempt is stored as its own
  Firestore document, so retaking does not erase prior attempts)
- Categories (4, in question-bank order, each rendered as a collapsible section on the
  question-taking screen): **Data vs Information** (7 questions), **Relational Database Basics**
  (13 questions), **Real-World Scenarios** (12 questions), **Tricky Questions** (6 questions).

### The 38 questions, verbatim, with all choices and the correct answer marked

Each question below is numbered by its position in the bank (Q1–Q38), grouped by category exactly
as in `QUIZ_QUESTIONS` in `src/lib/mbi802QuizData.ts`. Choice letters (A–D) correspond to
0-indexed array order; the **bolded** choice is the correct answer (`correct` field).

#### Category: Data vs Information

**Q1.** Which of the following best describes "data"?
A. Processed facts that are meaningful and useful to decision-makers
**B. Raw, unprocessed facts and figures that have no inherent meaning on their own**
C. A structured collection of related tables stored in a computer
D. Instructions provided to a computer to perform a task

**Q2.** A student's exam score "85" stored in isolation — with no student name, subject, or
date — is best classified as:
A. Information, because it refers to an academic grade
**B. Data, because it is a raw number with no context**
C. A record, because it belongs to a student profile
D. Metadata, because it describes a student's performance

**Q3.** Which of the following is an example of information (not just data)?
A. 42
B. "Auckland"
**C. "John Smith achieved a distinction grade in MBI802 during Semester 1, 2025"**
D. TRUE

**Q4.** What is the primary requirement for converting data into information?
A. Storing it in a relational database
B. Encrypting it to ensure security
**C. Providing context and processing to give it meaning**
D. Duplicating it across multiple servers for availability

**Q5.** Which of the following is NOT a characteristic of high-quality information?
A. Accuracy — the information reflects reality
B. Timeliness — the information is current and up-to-date
**C. Being in raw, unprocessed form without any context**
D. Relevance — the information is useful for the decision at hand

**Q6.** A retail company exports a file containing thousands of transaction amounts from its
point-of-sale system — just numbers, no product names, no dates. This file is best described as:
A. Information, because it comes from a business system
B. A report, because it was exported from software
**C. Data, because the numbers lack meaningful context on their own**
D. A database, because it contains many values

**Q7.** Which statement correctly describes the relationship between data and information?
A. Information and data are interchangeable terms meaning the same thing
B. Data is always more valuable than information
**C. Data is the raw input; information is the meaningful output after processing**
D. Information is collected first, and data is produced from it

#### Category: Relational Database Basics

**Q8.** What is the purpose of a primary key in a relational database table?
A. To link two tables together using a foreign reference
**B. To uniquely identify each row/record in the table**
C. To sort the rows in ascending order automatically
D. To encrypt sensitive data stored in the table

**Q9.** A foreign key in one table refers to:
A. Any column that contains text (string) values
B. The primary key of the same table it belongs to
**C. The primary key (or unique key) of another table, establishing a link**
D. A key that is not used for searching or indexing

**Q10.** In relational database terminology, a "table" is formally known as a:
A. Schema
**B. Relation**
C. Tuple
D. Domain

**Q11.** RDBMS stands for:
A. Real-time Database and Management System
B. Relational Data and Backup Management System
**C. Relational Database Management System**
D. Remote Database Monitoring System

**Q12.** Which SQL statement is used to retrieve data from a database?
A. INSERT
B. UPDATE
C. DELETE
**D. SELECT**

**Q13.** In a database, a NULL value means:
A. The value is zero (0)
B. The value is an empty string ("")
**C. The field has no value or the value is unknown/missing**
D. The column has been deleted from the table

**Q14.** First Normal Form (1NF) requires that:
A. Every non-key attribute depends on the whole primary key
B. Every non-key attribute depends only on the primary key, not on other non-key attributes
**C. Each column holds atomic (indivisible) values, and each row is unique**
D. The table has at least one foreign key referencing another table

**Q15.** A composite key is:
A. A primary key that is also a foreign key in another table
**B. A primary key formed by combining two or more columns to uniquely identify a row**
C. A key that allows duplicate values within the same column
D. An index created automatically on every column in the table

**Q16.** Referential integrity in a relational database ensures that:
A. All data is stored in sorted order for fast retrieval
B. No two rows can have the same primary key value
**C. A foreign key value must either match an existing primary key value or be NULL**
D. All column names across all tables must be unique

**Q17.** Which type of JOIN returns ALL records from both tables, matching where possible and
filling NULLs where there is no match?
A. INNER JOIN
B. LEFT JOIN
C. RIGHT JOIN
**D. FULL OUTER JOIN**

**Q18.** An Entity-Relationship (ER) diagram is used to:
A. Write SQL queries in a visual format
**B. Plan and represent the logical structure of a database before implementation**
C. Monitor database performance in real time
D. Back up and restore database records

**Q19.** In database design, a many-to-many relationship between two entities is typically
implemented by:
A. Adding extra columns to one of the two tables
B. Merging both tables into a single table
**C. Creating a junction (bridge) table that holds foreign keys from both tables**
D. Using NULL values to represent the missing side of the relationship

**Q20.** Which of the following SQL data types is most appropriate for storing a phone number
like "021-012-3456"?
A. INT, because phone numbers are numeric
B. FLOAT, because phone numbers can contain decimal points
**C. VARCHAR, because phone numbers can have leading zeros, dashes, and spaces**
D. BOOLEAN, because a phone number is either valid or invalid

#### Category: Real-World Scenarios

**Q21.** A hospital wants to manage patient records, doctor details, appointment schedules, and
medical history. Is this a suitable scenario for a relational database?
A. No, because medical data is too sensitive to be stored digitally
B. No, because the data is too complex for any database
**C. Yes, because a relational database can handle related entities like patients, doctors, and
appointments with enforced integrity**
D. Yes, but only if the hospital has more than 10,000 patients

**Q22.** A student stores all classmate information in a single database cell as:
"John,25,MBI802,Auckland | Sarah,22,MBI800,Christchurch". What is the main problem with this
approach?
A. The cell will run out of storage space immediately
**B. It violates atomicity — multiple values in one cell break First Normal Form (1NF)**
C. MySQL does not support text fields larger than 50 characters
D. There is no problem; this is a valid and efficient storage technique

**Q23.** A library system records which member has borrowed which book. Each book can be
borrowed by only one member at a time, but one member can borrow many books. What is the
relationship between Members and Books?
A. Many-to-Many, because many books exist for many members
B. One-to-One, because each book belongs to exactly one library
**C. One-to-Many, because one member can borrow many books, but each book is borrowed by only
one member at a time**
D. No relationship; they should be stored in separate, unlinked databases

**Q24.** In a university system, students can enrol in many courses, and each course can have
many students. What type of relationship exists between Students and Courses?
A. One-to-One
B. One-to-Many
C. Many-to-One
**D. Many-to-Many**

**Q25.** A business discovers that the same customer appears multiple times in their Customers
table with slightly different spellings of their name. What type of database problem is this?
A. A normalisation error — the table is not in 3NF
**B. A data redundancy and integrity problem — duplicate records compromise data quality**
C. A referential integrity violation — foreign keys are broken
D. A performance issue — indexes are not set up correctly

**Q26.** A school wants to track which teachers teach which subjects, where one teacher can
teach multiple subjects and one subject can be taught by multiple teachers. Can a relational
database handle this?
A. No, because teachers and subjects are too similar to store separately
**B. Yes, using a Many-to-Many relationship with a junction table (e.g., TeacherSubject)**
C. Yes, but only by merging teachers and subjects into one table
D. No, because school data does not fit the relational model

**Q27.** You need to keep a quick grocery list of 5 items for a single trip to the supermarket.
Should you build a relational database for this?
A. Yes, always use a database for any data storage need
B. Yes, because databases are the most efficient storage option for all sizes
**C. No, a simple note or text file is more appropriate — a full database is overkill for 5
items**
D. No, because grocery items cannot be modelled in a relational schema

**Q28.** A social media platform needs to store users who can follow each other (User A follows
User B, User B also follows User A). What relationship type does this represent?
A. One-to-One relationship between two user tables
**B. A self-referencing Many-to-Many relationship within the same Users table**
C. A One-to-Many relationship where one user leads all others
D. A recursive One-to-One relationship

**Q29.** An e-commerce company's database has a Customers table and an Orders table. When a
customer record is deleted and referential integrity (with ON DELETE RESTRICT) is enforced,
what happens to their linked orders?
A. The orders are automatically reassigned to a default customer
B. Nothing; the orders remain with a NULL customer reference
**C. The deletion is blocked — the customer cannot be deleted while orders exist**
D. The database automatically creates a backup of the deleted customer

**Q30.** A developer creates a Products table with columns: ProductID, ProductName, Category,
CategoryDescription, SupplierName, SupplierPhone. What database design problem does this table
have?
A. The table has too many columns — MySQL only allows 5 columns per table
**B. Category and Supplier details should be in separate tables; storing them here creates data
redundancy and update anomalies**
C. ProductID should not be a primary key because product IDs can change
D. The table is missing a foreign key to make it relational

**Q31.** A weather station records temperature readings every minute, 24/7, across 100 sensors.
Over a year this generates tens of millions of rows. Is a relational database appropriate?
A. No, relational databases cannot handle more than 10,000 rows
B. Yes, but only if the data is kept in a single table with no indexes
**C. Yes, relational databases with proper indexing can handle very large datasets, though
specialised time-series databases may be even more efficient for this use case**
D. No, weather data must always be stored in spreadsheets for accuracy

**Q32.** A company stores employee salary history. Each employee can have many salary records
over time. The HR system needs to display the CURRENT salary quickly for thousands of employees.
What design strategy would improve read performance?
A. Store all salary history in a single comma-separated cell
**B. Add an indexed "isCurrent" boolean column or maintain a separate CurrentSalary table for
fast lookups**
C. Delete historical salary records after each pay rise
D. Store salaries in a separate database on a different server

#### Category: Tricky Questions

**Q33.** Technically, can a table in MySQL exist without a primary key?
A. No — MySQL enforces a primary key on every table by default
**B. Yes — MySQL allows tables without a primary key, but it is considered very poor practice as
it makes data management much harder**
C. Yes — and it is recommended for large tables to improve insert performance
D. No — without a primary key, MySQL will refuse to create the table

**Q34.** Can a NULL value be assigned to a primary key column?
A. Yes, NULL is a valid primary key value meaning "unknown ID"
B. Yes, but only for the first record inserted into the table
**C. No, primary key columns must always hold a non-NULL value to uniquely identify each row**
D. Yes, if the table has a composite primary key

**Q35.** What is denormalisation in database design?
A. The process of breaking a table into smaller tables to reduce redundancy
**B. Intentionally introducing redundancy into a database to improve read performance at the
cost of storage and update complexity**
C. Removing all foreign keys from a database to simplify queries
D. Converting a database from relational to NoSQL format

**Q36.** A database has three tables but no foreign keys linking them. Can it still be called a
"relational database"?
A. Yes, any database with multiple tables is automatically relational
B. Yes, as long as it uses SQL it qualifies as a relational database
**C. Technically the software (e.g., MySQL) is an RDBMS, but without enforced relationships the
design does not follow relational principles — it behaves like separate flat files**
D. No, MySQL requires at least one foreign key to operate correctly

**Q37.** Searching for a value in an indexed column vs. a non-indexed column in a large table —
which is generally faster?
A. Non-indexed search, because indexing adds overhead that slows queries
B. They are always the same speed regardless of indexing
**C. Indexed search, because the index allows the database to jump directly to matching rows
instead of scanning the entire table**
D. It depends on whether the query uses SELECT or INSERT

**Q38.** Is Microsoft Excel a database management system?
A. Yes, Excel is fully equivalent to MySQL and can replace it in all business applications
**B. Excel can store and query data like a flat-file database, but it lacks RDBMS features such
as enforced relationships, multi-user concurrency control, and ACID transactions**
C. No, Excel cannot store any structured data and is purely a calculation tool
D. Yes, because Excel supports pivot tables, which are a form of database relationship

### Result screen copy

- Score line: `{score} / {total}` (e.g. "24 / 38")
- Percentage + verdict line: `{pct}% — Great work!` if `pct >= 60`, otherwise
  `{pct}% — Keep studying!`
- Per-category breakdown grid: each of the 4 categories shows `{correct}/{total}` and
  `({pct}%)` for that category alone.
- "Review Answers" toggle reveals every question again with the student's selected choice
  highlighted red (if wrong) and the correct choice highlighted green, plus a checkmark icon
  next to the correct choice.
- "Retake Quiz" button resets all local state and returns to the intro screen (does **not**
  delete previously submitted Firestore results — every attempt persists).
- Unanswered-question warning shown on the taking screen before submit: "You have {n} unanswered
  question{s}. You can still submit, but unanswered questions will count as incorrect."

## 3. UI & interaction design

### Pre-quiz warning banner (`QuizLesson` wrapper, `CourseResources.tsx`)

- Rendered only for non-staff (`!isStaff`) users, positioned directly above the quiz content
  inside a `space-y-4` wrapper.
- Rounded card (`rounded-2xl`), amber/yellow gradient background
  (`linear-gradient(135deg, rgba(254,243,199,0.95), rgba(253,230,138,0.6))`), amber border
  (`rgba(245,158,11,0.35)`), `flex items-start gap-3` layout.
- `FlaskConical` icon (18px, color `#d97706`) at the left, flex-shrink-0.
- Bold heading in dark amber (`#92400e`, `text-sm font-bold`): "Try this only if you have your
  MySQL setup ready!"
- Body text below in a slightly lighter amber (`#78350f`, `text-xs leading-5`) with the full
  explanatory paragraph (verbatim above).
- Staff users never see this banner — they go straight to `QuizResultsDashboard`.

### Student quiz — three phases (`MBI802Quiz.tsx`), controlled by local `phase` state

**Intro phase:**
- Single rounded card, violet gradient (`rgba(245,243,255,...)` → `rgba(237,233,254,...)`),
  violet border.
- `BookOpen` icon, quiz title (`MBI802_QUIZ_TITLE`), and description text: "{total}
  multiple-choice questions across four topic areas. No time limit — take your time and think
  carefully. You may retake as many times as you like."
- Category pill row (one violet pill per category name).
- "Start Quiz" button (`btn-primary`) transitions to `taking` phase.

**Taking phase:**
- Sticky progress-bar header at `top-0 z-10` with backdrop blur, showing "{answered} of {total}
  answered" and a percentage, plus a horizontal gradient progress bar
  (`linear-gradient(90deg, #8b5cf6, #6d28d9)`).
- Questions are grouped into 4 collapsible category sections (accordion-style, each defaulting
  to expanded via `expandedCategories` initialized true for all categories). Each section header
  shows the category name and an `{answered}/{total}` pill for that category (turns green when
  complete) plus a chevron toggle.
- Each question renders as a card with the question text and 4 choice buttons labelled A–D
  (circular badge + text). Selecting a choice highlights it with a violet border/background and
  bold text; selection state lives in a single `answers: Record<questionId, choiceIndex>` map.
- Below all categories, a submit card shows an amber inline warning if there are unanswered
  questions, then a full-width "Submit Quiz" button (`btn-primary`) with a spinner + "Submitting…"
  label while the Firestore write is in flight.

**Result phase:**
- Large score card at the top: green gradient/theme if `passed` (percentage ≥ 60), red
  gradient/theme otherwise. Trophy icon, `{score} / {total}` in extra-bold, percentage + verdict
  line, and a 2-column grid of per-category mini score cards.
- Two secondary buttons: "Review Answers" (toggles `showReview`, chevron icon flips) and "Retake
  Quiz" (resets state, calls `window.scrollTo(top)`, returns to intro phase).
- When review is open, every question renders again with full answer breakdown (selected choice
  in red if wrong, correct choice always in green with a checkmark).
- On landing on the result phase, the page auto-scrolls to top (`window.scrollTo({ top: 0,
  behavior: 'smooth' })`) — same behavior on retake.

### Staff dashboard (`QuizResultsDashboard.tsx`)

- Header line: "Student Results — {MBI802_QUIZ_TITLE}" in violet uppercase eyebrow style.
- 4 summary stat cards in a responsive grid (`grid-cols-2 md:grid-cols-4`): Students Attempted
  (with total-attempts subtext), Average Score (Best) (mean of each student's best percentage),
  Passed (≥60%) count, and Pass Rate percentage. Each card uses a violet gradient background and
  a `lucide-react` icon (`Users`, `BarChart2`, `Award` ×2).
- Score-distribution bar chart across 4 fixed buckets (0–39%, 40–59%, 60–79%, 80–100%), each
  with its own color (`#fca5a5`, `#fcd34d`, `#6ee7b7`, `#818cf8`), bar height scaled to the
  largest bucket, built from each student's **best** attempt only.
- "Best Score per Student" table: one row per unique `studentUid`, sortable by name/score/date
  (click column header, `SortIcon` chevron flips direction), showing name, ID, best score badge
  (color-coded green ≥80%, amber ≥60%, red below), last-attempt date, campus/section, and total
  attempt count. Row click toggles `expandedStudent` (state exists but no expanded detail panel
  is actually rendered in this component — see Section 5 quirk).
- "All Attempts" table: every individual submission (not just best), with a free-text filter
  input (matches name, student ID, section, or campus, case-insensitive) and the same
  sort-by-column mechanism, alternating row background striping.
- Live-updating via Firestore `onSnapshot` — new submissions appear without a page refresh.
- Loading state: centered small spinning-ring indicator while the initial snapshot resolves.
- Empty states: "No quiz submissions yet." (no data at all) vs. "No results match the filter."
  (filter excludes everything).

## 4. Component & state architecture

### Gating chain (identical pattern to the Normalization lesson — see `18-normalization-deck.md`)

1. `CourseResources` (parent) holds `const [erMcqPassed, setErMcqPassed] = useState(false);`
   (line ~1480).
2. On mount, for non-staff users, an effect fetches `doc(db, 'erMcqResults', user.uid)` in
   parallel with the student profile fetch (lines ~1493–1515):
   ```ts
   if (erMcqSnap.exists()) {
     const best = erMcqSnap.data().bestPercentage ?? 0;
     setErMcqPassed(best > 50); // strict greater-than — exactly 50% does not pass
   }
   ```
3. Per-lesson gating is computed inline while mapping `course.lessons`:
   ```ts
   const gated = !isStaff && ['normalization', 'quiz'].includes(lesson.id) && !erMcqPassed;
   ```
   Both the Normalization deck lesson and this DBMS Knowledge Check quiz share the exact same
   `erMcqPassed` boolean and the exact same gating expression — passing the ER Knowledge Check
   quiz above 50% unlocks both lessons simultaneously, in one step.
4. `gated` is passed to `<LessonRow locked={gated}>`. When locked, `LessonRow` renders a lock
   icon instead of the lesson icon, a red "Locked" pill next to the "Lesson N" label, replaces
   the subtitle text with "Score above 50% in the ER Knowledge Check to unlock this lesson.",
   disables the row's click handler (`onClick={locked ? undefined : onToggle}`,
   `disabled={locked}`, `cursor: not-allowed`), and never renders `children` (so
   `QuizLesson`/`MBI802Quiz`/`QuizResultsDashboard` are not mounted at all while locked).
5. There is no separate gate specifically for "has completed MySQL setup" — that precondition is
   communicated only via the warning banner text (see Section 2/3) and is never checked against
   any stored data. A student who has *not* set up MySQL can still take the quiz once the ER-MCQ
   gate is cleared.
6. Staff (`isStaff = role === 'lecturer' || role === 'teachingAssistant'`) skip the gate entirely
   (`!isStaff` short-circuits `gated` to `false`) and are never shown as locked.

### `MBI802Quiz.tsx` — student component state

- `phase: 'intro' | 'taking' | 'result'` — drives which of the three screens renders.
- `answers: Record<string, number>` — keyed by question `id` (e.g. `'q01'`), value is the
  0-indexed selected choice.
- `submitting: boolean` — disables the submit button and shows a spinner during the Firestore
  write.
- `score: number` — count of correct answers, computed once at submit time and frozen for the
  result screen (not recomputed reactively).
- `showReview: boolean` — toggles the full answer-review list on the result screen.
- `expandedCategories: Record<string, boolean>` — accordion open/closed state per category,
  initialized to all-`true` from `QUIZ_CATEGORIES`.
- Derived values: `answered = Object.keys(answers).length`, `total = QUIZ_QUESTIONS.length` (38),
  `progressPct = Math.round((answered / total) * 100)`.
- `handleSubmit()`: computes `correct` by filtering `QUIZ_QUESTIONS` for
  `answers[q.id] === q.correct`, sets `score`, then attempts an `addDoc` to
  `collection(db, 'mbi802QuizResults')` with:
  ```ts
  {
    quizId: MBI802_QUIZ_ID,               // 'mbi802-dbms-basics-v1'
    studentUid: user?.uid ?? '',
    studentName: studentProfile?.fullName ?? user?.email ?? 'Unknown',
    studentDisplayId: studentProfile?.studentId ?? '',
    studentSection: studentProfile?.section ?? '',
    studentCampus: studentProfile?.campus ?? '',
    score: correct,
    total,                                 // 38
    percentage: Math.round((correct / total) * 100),
    completedAt: serverTimestamp(),
  }
  ```
  The `addDoc` call is wrapped in a `try { … } catch { /* silently continue */ }` — if the
  Firestore write fails for any reason, the student still sees their local result; the failure
  is swallowed with no user-facing error and no retry/logging.
- `handleRetake()`: clears `answers`, resets `score` to 0, closes review, re-expands all
  categories, returns to `intro` phase, and scrolls to top.
- Each quiz attempt is a **new document** — there is no upsert/best-attempt-only write; the
  Firestore collection accumulates every attempt from every student indefinitely.

### `QuizResultsDashboard.tsx` — staff component state

- `results: QuizResult[]` — all documents from `mbi802QuizResults`, populated via a live
  `onSnapshot` listener on `query(collection(db, 'mbi802QuizResults'), orderBy('completedAt',
  'desc'))`, unsubscribed on unmount.
- `loading: boolean` — true until the first snapshot resolves.
- `sortKey: 'name' | 'score' | 'date'` and `sortDir: 'asc' | 'desc'` — shared by both tables;
  clicking a column header calls `toggleSort(key)`, which flips direction if the same key is
  clicked again or resets to `desc` on a new key.
- `expandedStudent: string | null` — set on row click in the "Best Score per Student" table, but
  no expanded detail UI actually consumes this state (see Rebuild notes).
- `filterText: string` — free-text filter applied only to the "All Attempts" table (matches
  name, student ID, section, or campus, case-insensitive substring).
- Derived aggregates, recomputed on every render from `results`:
  - `byStudent`: `results` grouped by `studentUid`.
  - `bestScores`: for each student, the single attempt with the highest `percentage`.
  - `totalAttempts` = `results.length`; `totalStudents` = number of unique `studentUid`s.
  - `avgPct` = mean of `bestScores[].percentage`, rounded.
  - `passCount` = count of `bestScores` with `percentage >= 60` (note: this staff-side pass bar
    of 60% matches `MBI802_QUIZ_PASS_PERCENTAGE`, imported implicitly by convention rather than
    by referencing the constant — the dashboard hardcodes `60` rather than importing
    `MBI802_QUIZ_PASS_PERCENTAGE`).
  - Score-distribution `buckets` (4 fixed ranges) and `bucketCounts` computed from `bestScores`.
- No writes occur from this component — it is pure read/aggregate/display.

### Data model summary

- **`mbi802QuizResults` (Firestore collection, one doc per attempt):** `quizId`, `studentUid`,
  `studentName`, `studentDisplayId`, `studentSection`, `studentCampus`, `score`, `total`,
  `percentage`, `completedAt` (server timestamp). No document ID convention is enforced —
  `addDoc` auto-generates IDs.
- **`erMcqResults` (Firestore collection, read-only here):** document ID = student UID; relevant
  field `bestPercentage` (number). Owned/written by the separate ER Knowledge Check quiz feature.
- **`students` (Firestore collection, read-only here):** document ID = student UID; supplies
  `StudentProfile` (`fullName`, `studentId`, `section`, `campus`, `subjects`) used both to gate
  the whole MBI802 tab (via `subjects.includes('MBI802')`, enforced by the parent) and to stamp
  identity fields onto each quiz result.

## 5. Rebuild notes

- **Double-gating quirk, spelled out precisely:** the lesson is reachable only if (a) the logged-
  in user is a `student` (or staff, who bypass everything) with `'MBI802'` in their
  `studentProfile.subjects`, **and** (b) `erMcqResults/{uid}.bestPercentage > 50` (strict). The
  "have your MySQL setup ready" condition mentioned in the warning banner is advisory/narrative
  only — nothing in the code checks whether the student actually completed the MySQL Setup
  lesson (lesson 15) or any MySQL-related task before granting access. A rebuild must replicate
  only the ER-MCQ score gate programmatically; the MySQL-readiness condition should remain a
  banner, not a check.
- **Same gate object powers two lessons:** `erMcqPassed` is a single piece of state that
  simultaneously unlocks both the Normalization deck (`lesson.id === 'normalization'`) and this
  DBMS Knowledge Check (`lesson.id === 'quiz'`) — there is no independent tracking of "unlocked
  normalization but not quiz" or vice versa. See `18-normalization-deck.md` for the mirrored
  documentation of this same mechanism.
- **Silent Firestore-write failure:** `MBI802Quiz.tsx`'s `handleSubmit` swallows any `addDoc`
  error with an empty `catch` block and no user-facing message — a student could complete the
  quiz, see their score, and have no result actually recorded server-side (e.g. on a network
  blip), with no way for them or staff to know. A rebuild should consider surfacing this failure.
- **Dead state in `QuizResultsDashboard.tsx`:** `expandedStudent` is set via `onClick` on each
  row of the "Best Score per Student" table but is never read anywhere else in the component —
  there is no expand/collapse detail panel wired to it. This looks like an unfinished feature
  (presumably intended to show a per-student attempt history inline) rather than intentional
  dead code; worth completing or removing in a rebuild.
- **Hardcoded pass threshold on the dashboard:** `QuizResultsDashboard.tsx` hardcodes `>= 60` for
  pass/fail coloring and the `passCount`/`Pass Rate` stat instead of importing
  `MBI802_QUIZ_PASS_PERCENTAGE` from `mbi802QuizData.ts` (which `MBI802Quiz.tsx` does use
  correctly for the student-facing result screen). If `MBI802_QUIZ_PASS_PERCENTAGE` is ever
  changed, the dashboard's pass-rate stat will silently drift out of sync with the actual pass
  bar shown to students. A rebuild should have the dashboard import the shared constant.
  Similarly, the score-distribution bucket boundaries (`60–79%`, `80–100%`, etc.) are hardcoded
  independently and don't reference the pass constant either.
  - "Passed (≥60%)" stat label is a literal hardcoded string with the same drift risk.
- **No per-question randomization/shuffling:** questions and choices always render in the exact
  fixed order defined in `QUIZ_QUESTIONS`/`choices` arrays — no shuffle-on-load logic exists, so
  every student sees questions and choice order identically, and answer keys are trivially
  shareable between students. This is a design choice, not a bug, but worth flagging if a
  rebuild is expected to add anti-cheating measures.
- **Category order is data-driven:** `QUIZ_CATEGORIES` is derived at module load via
  `[...new Set(QUIZ_QUESTIONS.map(q => q.category))]`, so category display order is simply "the
  order in which a new category name is first encountered while scanning `QUIZ_QUESTIONS` top to
  bottom" — i.e., Data vs Information, Relational Database Basics, Real-World Scenarios, Tricky
  Questions, matching the source file's comment-delimited sections. A rebuild recreating the
  question bank must preserve this ordering (or explicitly hardcode the category list) to keep
  the UI's category pill/accordion order stable.
- **No assets** (images/SVGs/videos) are used by this lesson — it is 100% text/UI, no external
  media dependencies to revalidate.
- **`FlaskConical` icon reused across two unrelated contexts:** it labels both this quiz's
  warning banner and, separately, the "SQL Practice Lab" lesson row icon
  (`accentColor: '#7c3aed'` at `lesson.id: 'sql-practice'`) — purely a shared icon choice, not a
  functional link between the two lessons.
