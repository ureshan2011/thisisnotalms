# SQL Practice Lab — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Gated (student/staff login required). Reached only via
  `/student/course-resources` → MBI802 tab → lesson row `id: 'sql-practice'`. It is **not**
  in the score-gated set (`['normalization', 'quiz']`, checked at
  `src/pages/student/CourseResources.tsx:1742`), so any student enrolled in MBI802 (i.e. with
  `'MBI802'` in `studentProfile.subjects`) can open the row with no ER MCQ score requirement.
  However, the component itself enforces a **second, independent gate**: a shared class
  password (`PasswordGate`, see below) that a student must enter once before seeing any lab
  content, regardless of course-resources unlock state.
- **Route(s):** `/student/course-resources` (no dedicated route; rendered inline as one lesson
  row of the MBI802 tab).
- **Source files:**
  - `src/components/lab/SQLPracticeLesson.tsx` — the entire lesson (862 lines): password gate,
    student practice view, and staff/TA verification panel all live in this one file.
  - `src/lib/sqlPracticeScenarios.ts` — the 10 personalisation scenarios (data-only module) and
    three SQL-string builder functions (`buildCreateTableSql`, `buildInsertSql`,
    `buildSelectSql`) shared between the student view and the staff detail view.
  - `src/pages/student/CourseResources.tsx` — lesson metadata (lines 227–233) and mount point
    (`{lesson.id === 'sql-practice' && <SQLPracticeLesson />}`, line 1796).
  - `src/contexts/AuthContext.tsx` — supplies `user`, `role`, and `studentProfile` via
    `useAuth()`.
  - `src/lib/firebase.ts` — exports the `db` Firestore instance used directly by the component.
- **Depends on:** Firebase Firestore (`firebase/firestore`: `collection`, `doc`, `getDoc`,
  `getDocs`, `serverTimestamp`, `setDoc`, `updateDoc`), `lucide-react` icons (`BarChart2`,
  `CheckCircle2`, `ChevronDown`, `ChevronUp`, `Circle`, `Database`, `Loader2`, `Lock`, `Shield`,
  `XCircle`), `useAuth()` from `AuthContext`, browser `localStorage` (per-user password-unlock
  flag), and the Firestore collection `sqlPractice` (one document per student, keyed by `uid`).
  No external links.

## 1. Purpose & learning objectives

This lesson is the hands-on counterpart to MBI802's SQL/database-design theory content
(ER diagrams, normalization, SQL syntax lessons). Where those lessons teach concepts and quiz
recall, this lab requires each student to actually **use MySQL Workbench on their own machine**
to build a small database end-to-end: create a database, create a table with a defined schema,
insert real rows, and write a working `SELECT` query — the four core DDL/DML competencies of
the course, performed outside the browser in a real database client.

Because the work happens entirely outside the platform (in MySQL Workbench, on the student's
own computer), the platform cannot see or auto-grade the actual SQL the student ran or the
resulting database state. There is no query runner or SQL execution engine embedded in the
lesson. Instead, the lesson models an **honesty-and-review** workflow: the student self-reports
task completion ("Mark as Done" after a confirmation step), and a teaching assistant or
lecturer then reviews/confirms each task was genuinely done — presumably by checking the
student's screen or exported work in person or via a separate channel — and marks it
**TA-verified** in the app. This is why the UI is careful to separately track "student says
done" (`tasks[key]`) versus "TA has verified" (`verifications[key]`): auto-grading isn't
possible for an external desktop tool, so the platform instead gives staff a structured
checklist/dashboard to close that loop manually.

Each student also gets a **personalised scenario** (one of 10 fictional client
briefs — library, hospital, school, bookstore, hotel, restaurant, company, grades, gym, car
rental) randomly assigned and persisted the first time they open the lab, so that copy-pasting
a classmate's exact `CREATE TABLE`/`INSERT` statements won't produce a matching result — each
student's database name, table name, column set, and sample data differ.

## 2. Full content

### Access gate (shown before any lab content)

Every student must first pass a **class password gate**, independent of MBI802/course-resources
unlock state:

- Heading: "Lab Access Required"
- Body: "Enter the password provided by your lecturer to unlock this lab."
- A single text input (placeholder "Enter password…", auto-focused, letter-spaced, submits on
  Enter or via the button)
- Button: "Unlock Lab"
- On wrong entry: input clears and red text "Incorrect password. Try again." appears.
- The password is a **hardcoded literal in the source**: `const LAB_PASSWORD = 'READY';`
  (`src/components/lab/SQLPracticeLesson.tsx:117`). Entering exactly `READY` (after
  `.trim()`) unlocks the lab and writes `localStorage['sql_lab_unlocked_<uid>'] = '1'` so the
  gate is skipped on future visits from the same browser for that user. There is no
  server-side check of this password — it is purely a client-side string comparison, so it is
  trivially discoverable by reading the bundled JS, and the "unlock" is scoped to a browser's
  localStorage rather than the account itself (a different browser/device will re-prompt).

### Scenario assignment (personalisation mechanism)

On first load, if the student has no existing document in Firestore collection `sqlPractice`
keyed by their `uid`, the component:

1. Picks a random scenario: `scenarioId = Math.floor(Math.random() * scenarios.length)`
   (10 scenarios, defined in `src/lib/sqlPracticeScenarios.ts`).
2. Creates a Firestore document `sqlPractice/{uid}` with:
   - `scenarioId` — the randomly chosen index (0–9), permanently fixing which scenario this
     student sees on every future visit.
   - `assignedAt` — `serverTimestamp()`.
   - `studentName` — `studentProfile?.fullName ?? user.email ?? ''`.
   - `studentId` — `studentProfile?.studentId ?? ''`.
   - `tasks` — `{ createDb: false, createTable: false, insertData: false, retrieveData: false }`.
   - `verifications` — `{}` (empty map).

So the personalisation is **scenario-level, not per-field-generated**: the student's own name/ID
is not algorithmically woven into table/column/database names (e.g. there is no
`db_yasas123` style generation). Instead, personalisation works by randomly assigning one of 10
pre-authored fictional business scenarios per student, each with its own fixed database name,
table name, column schema, and 3 rows of sample data. The student's real name and student ID
are stored alongside the scenario purely for the TA/lecturer roster view (so staff can match a
Firestore record back to a real person), not to vary the SQL content itself.

### The 10 scenarios (verbatim from `src/lib/sqlPracticeScenarios.ts`)

Each scenario has: a theme, a fictional client/company, a case-study brief paragraph, a database
name, a table name, a column list (name + SQL type definition), 3 rows of sample data, and a
one-line description of the SELECT task. All ten, in full:

**Scenario 0 — Library Management**
- Company: City Public Library
- Case study: "You have been hired as a database developer for the City Public Library. They
  need a digital system to manage and track their entire book collection. Your task is to
  design and build the database from scratch using MySQL Workbench."
- Database: `library_db` · Table: `books`
- Columns: `book_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`, `title VARCHAR(100) NOT NULL`,
  `author VARCHAR(80) NOT NULL`, `genre VARCHAR(40)`, `year_published INT`
- Sample rows (title, author, genre, year_published):
  1. The Great Gatsby, F. Scott Fitzgerald, Classic, 1925
  2. To Kill a Mockingbird, Harper Lee, Drama, 1960
  3. Harry Potter, J.K. Rowling, Fantasy, 1997
- SELECT task: "Retrieve all book records from the books table"

**Scenario 1 — Hospital Patient Records**
- Company: Greenfield General Hospital
- Case study: "You are a database developer for Greenfield General Hospital. The hospital needs
  a system to manage patient admission records. Your task is to create the database and patient
  table to help the hospital organise their data."
- Database: `hospital_db` · Table: `patients`
- Columns: `patient_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`,
  `full_name VARCHAR(100) NOT NULL`, `age INT NOT NULL`, `blood_type VARCHAR(5)`,
  `admission_date DATE`
- Sample rows (full_name, age, blood_type, admission_date):
  1. Alice Johnson, 34, A+, 2024-01-15
  2. Bob Martinez, 52, O-, 2024-01-17
  3. Carol White, 28, B+, 2024-01-20
- SELECT task: "Retrieve all patient records from the patients table"

**Scenario 2 — School Enrollment**
- Company: Sunrise Academy
- Case study: "Sunrise Academy has asked you to build a student enrollment database system. This
  will help the school keep track of enrolled students across different grade levels. Set up the
  database and the student records table."
- Database: `school_db` · Table: `students`
- Columns: `student_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`,
  `first_name VARCHAR(50) NOT NULL`, `last_name VARCHAR(50) NOT NULL`,
  `grade_level INT NOT NULL`, `enrollment_date DATE`
- Sample rows (first_name, last_name, grade_level, enrollment_date):
  1. Emma, Thompson, 9, 2024-02-01
  2. Liam, Garcia, 10, 2024-02-01
  3. Olivia, Chen, 11, 2024-02-03
- SELECT task: "Retrieve all enrolled student records from the students table"

**Scenario 3 — Online Bookstore**
- Company: PageTurner Online Store
- Case study: "PageTurner Online Store is launching their e-commerce platform and needs a
  database to manage their product catalogue. You have been tasked with setting up the initial
  inventory database system in MySQL."
- Database: `bookstore_db` · Table: `products`
- Columns: `product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`,
  `product_name VARCHAR(100) NOT NULL`, `price DECIMAL(10,2) NOT NULL`,
  `stock_quantity INT NOT NULL`, `category VARCHAR(50)`
- Sample rows (product_name, price, stock_quantity, category):
  1. Clean Code, 29.99, 50, Technology
  2. Atomic Habits, 24.99, 75, Self-Help
  3. Sapiens, 19.99, 40, History
- SELECT task: "Retrieve all products from the inventory table" (note: task text says
  "inventory table" though the actual table name is `products` — a minor wording
  inconsistency in the source data, preserved here verbatim)

**Scenario 4 — Hotel Reservations**
- Company: Sunset Grand Hotel
- Case study: "Sunset Grand Hotel is modernising their reservation system. They need a database
  to store guest booking details. Build the reservation database to help the hotel manage their
  bookings more efficiently."
- Database: `hotel_db` · Table: `reservations`
- Columns: `reservation_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`,
  `guest_name VARCHAR(100) NOT NULL`, `room_number INT NOT NULL`,
  `check_in_date DATE NOT NULL`, `total_nights INT NOT NULL`
- Sample rows (guest_name, room_number, check_in_date, total_nights):
  1. David Kim, 201, 2024-03-10, 3
  2. Sarah Brown, 105, 2024-03-12, 5
  3. Michael Lee, 310, 2024-03-15, 2
- SELECT task: "Retrieve all reservation records from the reservations table"

**Scenario 5 — Restaurant Menu**
- Company: The Spice Garden Restaurant
- Case study: "The Spice Garden Restaurant wants to digitalise their menu management system.
  They need a database to store all menu items, prices, and availability status. Help them
  build a structured database from scratch."
- Database: `restaurant_db` · Table: `menu_items`
- Columns: `item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`, `item_name VARCHAR(80) NOT NULL`,
  `price DECIMAL(8,2) NOT NULL`, `category VARCHAR(40) NOT NULL`,
  `is_available BOOLEAN DEFAULT TRUE`
- Sample rows (item_name, price, category, is_available):
  1. Grilled Chicken, 18.50, Main Course, TRUE
  2. Caesar Salad, 12.00, Starter, TRUE
  3. Chocolate Lava Cake, 9.50, Dessert, FALSE
- SELECT task: "Retrieve all menu items from the menu_items table"

**Scenario 6 — Employee Management**
- Company: TechCorp Ltd.
- Case study: "TechCorp Ltd. is building an internal HR system and needs a database to manage
  their employee records. You have been brought in to design and implement the initial employee
  database in MySQL."
- Database: `company_db` · Table: `employees`
- Columns: `employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`,
  `full_name VARCHAR(100) NOT NULL`, `department VARCHAR(60) NOT NULL`,
  `salary DECIMAL(10,2) NOT NULL`, `hire_date DATE`
- Sample rows (full_name, department, salary, hire_date):
  1. James Wilson, Engineering, 85000.00, 2021-06-15
  2. Priya Patel, Marketing, 72000.00, 2022-01-10
  3. Ryan Nguyen, Human Resources, 68000.00, 2020-09-01
- SELECT task: "Retrieve all employee records from the employees table"

**Scenario 7 — Student Grade Tracker**
- Company: Wellington Tech Institute
- Case study: "Wellington Tech Institute needs a database to record and track student academic
  results. You are tasked with creating the database system that will store examination scores
  and grades for all students."
- Database: `grades_db` · Table: `results`
- Columns: `result_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`,
  `student_name VARCHAR(100) NOT NULL`, `subject VARCHAR(60) NOT NULL`, `score INT NOT NULL`,
  `grade VARCHAR(2) NOT NULL`
- Sample rows (student_name, subject, score, grade):
  1. Amy Foster, Mathematics, 88, B+
  2. Jake Rivera, Physics, 95, A
  3. Nina Okafor, Chemistry, 74, B-
- SELECT task: "Retrieve all student result records from the results table"

**Scenario 8 — Gym Membership**
- Company: FitLife Gym
- Case study: "FitLife Gym is expanding and needs a database to track member subscriptions.
  Your job is to create a membership management database that stores member details and
  subscription fee information."
- Database: `gym_db` · Table: `members`
- Columns: `member_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`,
  `member_name VARCHAR(100) NOT NULL`, `membership_type VARCHAR(30) NOT NULL`,
  `start_date DATE NOT NULL`, `monthly_fee DECIMAL(8,2) NOT NULL`
- Sample rows (member_name, membership_type, start_date, monthly_fee):
  1. Chris Evans, Premium, 2024-01-01, 79.99
  2. Mia Santos, Basic, 2024-02-01, 39.99
  3. Omar Hassan, Premium, 2024-01-15, 79.99
- SELECT task: "Retrieve all gym member records from the members table"

**Scenario 9 — Car Rental Fleet**
- Company: DriveEasy Car Rentals
- Case study: "DriveEasy Car Rentals is building a fleet management system. They need a
  database to track all vehicles in their rental fleet. Create the database and vehicle table
  to help them manage their fleet effectively."
- Database: `rental_db` · Table: `vehicles`
- Columns: `vehicle_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`, `make VARCHAR(50) NOT NULL`,
  `model VARCHAR(50) NOT NULL`, `year INT NOT NULL`, `daily_rate DECIMAL(8,2) NOT NULL`
- Sample rows (make, model, year, daily_rate):
  1. Toyota, Camry, 2022, 65.00
  2. Honda, Civic, 2023, 58.00
  3. Ford, Mustang, 2021, 95.00
- SELECT task: "Retrieve all vehicles from the vehicles table"

### The four tasks and their instructions (generated per-scenario)

Once a scenario is assigned, the lab presents exactly 4 sequential tasks, generated from the
scenario data by helper functions in the component (`taskDescFor`, `taskSqlFor` in
`SQLPracticeLesson.tsx`, and `buildCreateTableSql`/`buildInsertSql`/`buildSelectSql` in
`sqlPracticeScenarios.ts`). Tasks unlock one at a time — a task is only shown once all prior
tasks are marked done; later, still-locked tasks are hidden entirely (not shown greyed out).

1. **Task 1 of 4 — Create Database**
   Instruction text: "Create a new MySQL database named `<dbName>` using MySQL Workbench."
   (Staff view also shows the exact SQL: `CREATE DATABASE <dbName>;`)

2. **Task 2 of 4 — Create Table**
   Instruction text: "Inside `<dbName>`, create a table named `<tableName>` with the following
   columns:" — followed by a bulleted list of every column name (in a small monospace pill) and
   its full SQL type definition (e.g. `book_id` → `INT NOT NULL AUTO_INCREMENT PRIMARY KEY`).
   Staff view shows the full generated SQL:
   ```
   USE <dbName>;

   CREATE TABLE <tableName> (
     <col1> <definition1>,
     <col2> <definition2>,
     ...
   );
   ```

3. **Task 3 of 4 — Insert Data**
   Instruction text: "Insert the following 3 rows of sample data into the `<tableName>` table:"
   — followed by a rendered HTML table of the 3 sample rows (auto-generated primary-key columns
   are excluded from the displayed table since they are not inserted explicitly). Staff view
   shows the full generated SQL:
   ```
   USE <dbName>;

   INSERT INTO <tableName> (<col_a>, <col_b>, ...)
   VALUES
     (<row1 values, quoted unless numeric/boolean>),
     (<row2 values>),
     (<row3 values>);
   ```

4. **Task 4 of 4 — Retrieve Data**
   Instruction text: "Write and run a SELECT query to `<selectTask, lowercased>`." (e.g.
   "Write and run a SELECT query to retrieve all book records from the books table."). Staff
   view shows the generated SQL:
   ```
   USE <dbName>;

   SELECT * FROM <tableName>;
   ```

### Student self-report / submission flow

For the active (first incomplete) task, the student sees a **"Mark as Done"** button. Clicking
it does not immediately submit — it switches to a confirmation prompt:

- Text: "Have you completed this task in MySQL Workbench?"
- Two buttons: **"Yes, mark done"** (green, with a spinner while saving) and **"Cancel"** (grey,
  returns to the un-confirmed state without saving).

Confirming calls `updateDoc(doc(db, 'sqlPractice', uid), { [\`tasks.${key}\`]: true })`, which
flips that single task's boolean to `true` in Firestore and locally. There is no way to
"un-complete" a task from the student side once marked done (no undo/uncheck control is
rendered for completed tasks) — the only edit path for a completed-but-wrong task is a TA/staff
member manually reversing it via Firestore, which the UI does not provide any button for
either.

A locked-task hint below the visible tasks reads: "`<N>` more task`s` will unlock as you
complete each step" (pluralization handled inline), where `<N>` = 3 − index of first incomplete
task.

Once all 4 tasks are marked done, a green completion banner appears:
- Heading: "All tasks completed!"
- Body: "Your teaching assistant will review and verify each task."

Each completed task also shows either "Verified by `<name>`" (green shield icon, once TA acts)
or "Awaiting TA verification" (grey text) in its header, so the student can see review status
per-task, not just overall.

### Staff (lecturer / teaching assistant) verification flow

Any user with `role === 'lecturer'` or `role === 'teachingAssistant'` sees a completely
different view (`StaffPanel`) instead of the student practice UI — this replaces, not
supplements, the student view for staff accounts.

- Initial state: a prompt "View student progress and verify completed tasks." with a **"Load
  Student Progress"** button (with a `BarChart2` icon) — the full roster is not fetched until
  this is clicked (lazy-load), and a module-level in-memory cache (`_staffCache`) persists
  fetched records across component unmount/remount within the same page session, so returning
  to the tab doesn't re-fetch until "Refresh" is explicitly clicked.
- **Lecturer-only summary panel** (`isLecturer = role === 'lecturer'`; teaching assistants do
  not see this stats block): "Summary — `<N>` students started", with a 4-column grid (2 on
  mobile) of per-task stats: task label, `<studentDone>/<total>` count in large violet text,
  and a small "`<taVerified>` verified" line with a shield icon.
- A search box ("Search by name or student ID…") filters the roster client-side by
  `studentName`/`studentId` substring match.
- Each student is a collapsible row showing: name (or "(No name)" if blank), student ID (if
  present) plus their scenario theme, per-task badges (checkmark = student marked done, shield
  overlay = TA verified) on desktop, and a compact "`<doneCt>`/4" progress pill plus a
  "`<verifCt>`/4" verified pill on mobile.
- Expanding a row reveals `StaffDetail`: the student's name/ID/scenario theme, the scenario's
  case-study text, and then, per task, its label, a "Student done" / "Not done yet" pill, the
  task's instruction text, the **full SQL code block** (`CodeBlock` component — dark violet
  background `#1e1b4b`, monospace, `Fira Code`/`Cascadia Code`) so the TA can eyeball the
  expected correct SQL for that student's specific scenario, and — if already verified — "
  Verified by `<name>` · `<date>`" (date formatted `en-NZ`, e.g. "20 Jul 2026").
- A **"Verify" / "Verified" toggle button** per task: disabled if the student hasn't marked the
  task done yet (tooltip: "Student has not completed this task yet"). Clicking it toggles
  between verified and unverified by calling `updateDoc(doc(db, 'sqlPractice', uid), {
  [\`verifications.${key}\`]: newEntry })` where `newEntry` is either `null` (un-verifying) or
  `{ verifiedByName: currentUserName, verifiedAt: serverTimestamp() }` (verifying).
  `currentUserName` is resolved as `user?.displayName || studentProfile?.fullName ||
  user?.email || 'Staff'`. **Verification is fully reversible by any staff member** — there is
  no lock-in once verified, and no restriction that only the original verifier can un-verify.

## 3. UI & interaction design

- Entire lesson uses a consistent violet/purple palette anchored on `const ACCENT = '#7c3aed'`,
  matching the MBI802 course accent color used elsewhere in Course Resources.
- **Password gate**: centered card (`max-w-sm`), soft violet gradient background, a large `Lock`
  icon, bold heading, helper text, a letter-spaced centered text input, inline red error text
  on failure, and a full-width solid-violet "Unlock Lab" button.
- **Scenario card** (top of student view): rounded-xl card with a diagonal violet gradient
  background, a `Database` icon in a rounded chip, an uppercase eyebrow "Your Scenario —
  `<theme>`", a "Client: `<company>`" line, and the case-study paragraph. Below it, a
  4-segment progress bar (small pill rectangles, one per task, filled violet when that task's
  `tasks[key]` is true) plus a "`<completedCount>`/4 tasks completed" caption.
- **Task cards**: each task is its own rounded-xl bordered card. Header row has a status icon
  (filled green `CheckCircle2` when done, outlined violet `Circle` when not) plus "Task `<n>` of
  4 — `<label>`" and, on the right, either a green "Verified by `<name>`" line with a `Shield`
  icon or grey "Awaiting TA verification" text. Body has the instruction paragraph, then
  task-specific content (column-definition bullet list for Create Table; a small responsive HTML
  table of sample rows for Insert Data; nothing extra for Create Database/Retrieve Data beyond
  the instruction text), then the action row (button or confirm/cancel pair) or a green
  "Completed" checkmark line once done.
- Locked/not-yet-reached tasks render nothing at all (`return null`), so the student only ever
  sees tasks up to and including the currently active one — there's no visible "greyed out
  future task" list.
- A dashed-border grey hint box below the visible tasks announces how many more tasks will
  unlock, and a green gradient success banner appears once all 4 are done.
- **Staff panel**: search bar + refresh button row, an optional lecturer-only stats grid, then a
  list of collapsible per-student rows (`ChevronDown`/`ChevronUp` toggle), each expanding into
  the detailed `StaffDetail` block with per-task instructions, generated SQL in a dark
  syntax-block styled `<pre>`, and a Verify/Verified toggle button.
- No slide/tab navigation anywhere in this lesson — both student and staff views are single
  continuous vertical scrolling stacks (`space-y-4`/`space-y-5`), consistent with the accordion
  shell (`LessonRow`) that hosts every lesson in Course Resources.
- Loading states use a centered `Loader2` spinning icon with "Loading your scenario…" (student)
  or inline spinners in buttons (`saving`/`loadingList` states) — no skeleton loaders.
- No custom animations/transitions beyond `hover:opacity-90` on solid buttons and Tailwind's
  default `transition-colors`/`transition-opacity`/`transition-all` utility classes.
- Responsive behavior: task badge row in the staff list collapses from a horizontal per-task
  badge strip (`hidden sm:flex`) to a compact "`<doneCt>`/4" pill on narrow screens
  (`sm:hidden`); the sample-data table and code blocks scroll horizontally
  (`overflow-x-auto`) rather than wrapping.

## 4. Component & state architecture

**Top-level export** `SQLPracticeLesson()`:
```ts
export default function SQLPracticeLesson() {
  const { role } = useAuth();
  const isStaff = role === 'lecturer' || role === 'teachingAssistant';
  if (isStaff) return <StaffPanel isLecturer={role === 'lecturer'} />;
  return <StudentPractice />;
}
```
No props are passed in from `CourseResources.tsx` — the component reads everything it needs
(`user`, `role`, `studentProfile`) directly from `useAuth()`.

**`StudentPractice()` state:**
- `unlocked: boolean` — initialized from `localStorage.getItem('sql_lab_unlocked_<uid>') ===
  '1'`; if false, renders only `<PasswordGate>` and returns early (before any hooks below it —
  see Rebuild Notes for the hook-order caveat this causes).
- `data: SQLPracticeDoc | null` — the student's Firestore document.
- `loading: boolean` — true until the initial Firestore read/create resolves.
- `saving: TaskKey | null` — which task (if any) is currently being written to Firestore, used
  to disable/spin the "Mark as Done" button.
- `confirming: TaskKey | null` — which task's "are you sure" confirmation UI is currently shown.
- On mount (`useEffect`, dep `[user]`): reads `doc(db, 'sqlPractice', user.uid)`. If it exists,
  loads it into `data`. If not, generates a random `scenarioId`, builds a new
  `SQLPracticeDoc` (see shape below), writes it with `setDoc`, and sets it as local state
  immediately (with `assignedAt: null` locally, since `serverTimestamp()` resolves
  asynchronously server-side).
- `handleMarkDone(key)`: two-phase — first click sets `confirming = key`; second click (on the
  now-shown "Yes, mark done" button) sets `saving = key`, calls `updateDoc` on
  `tasks.<key>`, updates local state optimistically, then clears `saving`.

**`StaffPanel({ isLecturer })` state:**
- `records: StaffRecord[] | null`, `loadingList: boolean`, `listLoaded: boolean`,
  `expandedUid: string | null`, `search: string`.
- `loadRecords()`: checks the module-level `let _staffCache: StaffRecord[] | null` first; if
  populated, uses it without a network call. Otherwise fetches the *entire* `sqlPractice`
  collection with `getDocs(collection(db, 'sqlPractice'))`, maps each doc to
  `{ uid: doc.id, ...doc.data() }`, sorts alphabetically by `studentName`, stores the result in
  `_staffCache`, and sets `records`. This is an unbounded/unpaged full-collection read — see
  Rebuild Notes.
- `handleUpdateVerif(uid, key, entry)`: updates both React state and `_staffCache` in lockstep
  after a successful Firestore write, so cache and UI never diverge within a session.
- Derived `stats` (lecturer-only) and `filtered` (search-filtered roster) are computed inline on
  every render, not memoized.

**`StaffDetail({ record, currentUserName, onUpdate, onClose })`:**
- Local `saving: TaskKey | null` state for the per-task Verify button.
- `toggleVerify(key)`: reads the existing `verifications[key]`; if present, the new value is
  `null` (un-verify); if absent, the new value is
  `{ verifiedByName: currentUserName, verifiedAt: serverTimestamp() }` (verify). Writes via
  `updateDoc` on the single field path `verifications.<key>`, then calls `onUpdate` to propagate
  the change back up to `StaffPanel`'s state/cache.

**Firestore data model — collection `sqlPractice`, one document per student, document ID =
Firebase Auth `uid`:**
```ts
interface VerifEntry {
  verifiedByName: string;
  verifiedAt: any;            // Firestore Timestamp (serverTimestamp())
}

interface SQLPracticeDoc {
  scenarioId: number;                              // index into scenarios[], fixed for life of doc
  assignedAt: any;                                  // Firestore Timestamp, set on first creation
  studentName: string;                              // studentProfile?.fullName ?? user.email ?? ''
  studentId: string;                                // studentProfile?.studentId ?? ''
  tasks: Record<TaskKey, boolean>;                  // createDb | createTable | insertData | retrieveData
  verifications: Partial<Record<TaskKey, VerifEntry | null>>;
}
```
Field writes are always targeted (`tasks.<key>`, `verifications.<key>`) via dotted-path
`updateDoc` calls rather than whole-document rewrites, so partial progress from concurrent
tabs/sessions would merge rather than clobber (Firestore's normal dotted-field-path semantics).

**Gating/unlock logic summary:**
1. Course-Resources-level: `sql-practice` lesson row is visible/openable to any student with
   `'MBI802'` in `enrolledSubjects` — no score gate (`gated` array excludes it).
2. Component-level password gate: client-only string check against the hardcoded literal
   `'READY'`, persisted per-`uid` in `localStorage`. Not tied to Firestore or any server check.
3. Role branch: `role === 'lecturer' | 'teachingAssistant'` → staff panel; everyone else
   (including `'student'`) → student practice view (subject to the password gate above).
4. Per-task sequential unlock: purely derived from `TASK_KEYS.findIndex(k => !data.tasks[k])` —
   no explicit "unlocked" field is stored; a task is visible if its index ≤ the first
   incomplete task's index.

No badges, scoring, or points are awarded by this lesson — completion/verification state is
purely descriptive (a checklist), not fed into any grade or badge-award system elsewhere in the
app (no reference to `sqlPractice` found outside this component and `CourseResources.tsx`'s
mount line).

## 5. Rebuild notes

- **Hook-order hazard**: `StudentPractice()` has an early return (`if (!unlocked) return
  <PasswordGate .../>`) **before** its `useEffect` call. This means the `useEffect` only runs
  on renders where `unlocked` is already true — functionally fine here because `unlocked` only
  flips `false → true` once and never back, and the component doesn't unmount/remount around
  that transition, but it is a React Hooks rule-of-hooks violation in the strict sense (hooks
  must not be called conditionally/after an early return) that works by accident of this
  specific state-transition pattern. A rebuild should either move the effect above the early
  return or keep this exact structure/behavior consciously if faithfully reproducing quirks.
- **Password is a hardcoded plaintext client-side constant** (`'READY'`) with no server-side
  validation — it is a soft "ask your lecturer" gate, not real access control, and is visible to
  anyone reading the deployed JS bundle. If rebuilding with the intent of it being a real
  secret, this would need to move server-side (e.g. Cloud Function/security rule check);
  otherwise, preserve as-is since it's evidently intended only as a lightweight "wait until
  class starts" mechanism, not security.
- **No resubmission/undo path in the student UI**: once a task is marked done, there is no
  button to un-mark it, and once all 4 are done there is no "reset my lab" affordance either for
  the student or a visible one for staff (staff can only toggle *verification*, not *task
  completion*, via the UI — un-doing a mistaken "done" would require a direct Firestore edit
  outside the app).
- **Full-collection unpaged read for staff**: `loadRecords()` calls
  `getDocs(collection(db, 'sqlPractice'))` with no query constraints — every student's document
  is fetched at once when a staff member clicks "Load Student Progress." This is fine at current
  small cohort sizes but would not scale gracefully to a very large roster; a rebuild for a
  larger deployment might want pagination or a `where` filter.
- **Module-level cache (`_staffCache`) is a plain JS variable outside the component**, so it is
  shared across all `StaffPanel` instances in the same browser tab/session and persists across
  unmount/remount but resets on full page reload. It is not scoped per-user in any way beyond
  "whoever is currently signed in on this device."
- **Scenario 3's SELECT task text says "the inventory table"** even though the actual table
  name for that scenario is `products` — a pre-existing minor content inconsistency in
  `sqlPracticeScenarios.ts` (`selectTask: 'Retrieve all products from the inventory table'`
  while `tableName: 'products'`), reproduced verbatim above; worth flagging to whoever owns the
  content if fixing copy, but not something a rebuild should silently "correct" without
  confirming intent.
- **No SQL execution/validation happens in-app at all** — the `CodeBlock`-rendered SQL (visible
  only to staff, not to students in the main task view) is the *expected* SQL for that
  scenario/task, generated deterministically from the scenario's column/data definitions; it is
  never run against a real database from within the app, and there is no way for the app to
  know if the student's actual MySQL Workbench session matches it. This is a purely
  self-report + manual-review design, not a query grader.
- **`studentName`/`studentId` are captured once at document creation** from
  `studentProfile` and never refreshed — if a student's profile name/ID changes later (e.g.
  correction), the `sqlPractice` doc will retain the stale value shown to staff, since there is
  no re-sync logic.
- **Icons/assets**: all visuals are `lucide-react` icons (no images/SVG assets, no video). Fonts
  for the SQL code blocks are `'Fira Code', 'Cascadia Code', monospace` (loaded elsewhere in the
  app's global font stack, not imported by this file).
- **No external links** appear anywhere in this lesson (unlike, e.g., the MySQL Setup Guide
  lesson which links to SharePoint videos) — this is a purely in-app, self-contained activity.
