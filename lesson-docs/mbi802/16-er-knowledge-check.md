# ER Knowledge Check — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Gated (student/staff login required)
- **Route(s):** `/student/course-resources` — no dedicated route; rendered inline as a lesson
  row in the MBI802 tab (lesson `id: 'er-mcq'`). There is no public/non-gated copy of this
  quiz anywhere in the app.
- **Source files:**
  - `src/components/quiz/ERMcq.tsx` — the student-facing quiz component (intro screen, question
    list, submission, results/review, retake, exhausted-attempts states). ~565 lines.
  - `src/components/quiz/ERMcqDashboard.tsx` — the staff-facing results dashboard (summary
    stats, score-distribution chart, sortable/filterable/expandable student results table).
    ~330 lines.
  - `src/lib/erMcqData.ts` — the question bank and quiz constants (title, pass/distinction
    thresholds, max attempts, Firestore collection name). This is the single source of truth
    for all quiz content and is imported by both components above.
  - `src/pages/student/CourseResources.tsx` — hosts and wires the lesson:
    - Lesson metadata in the MBI802 `lessons` array (around line 206–212):
      ```ts
      {
        id: 'er-mcq',
        title: 'ER Knowledge Check',
        subtitle: '20 questions · 3 attempts · Score >50% to unlock remaining lessons · 90%+ on first attempt earns a badge',
        icon: <ClipboardList size={18} />,
        accentColor: '#6366f1',
      }
      ```
    - Mount point (around line 1767–1773):
      ```tsx
      {lesson.id === 'er-mcq' && isStaff && <ERMcqDashboard />}
      {lesson.id === 'er-mcq' && !isStaff && (
        <ERMcq
          studentProfile={studentProfile}
          onPassStatusChange={(passed) => setErMcqPassed(passed)}
        />
      )}
      ```
    - Gate-state fetch on mount (around line 1493–1515): `Promise.all([getDoc(doc(db,
      'students', user.uid)), getDoc(doc(db, 'erMcqResults', user.uid))])`, then
      `if (erMcqSnap.exists()) { const best = erMcqSnap.data().bestPercentage ?? 0;
      setErMcqPassed(best > 50); }`.
    - Gate application (around line 1742): `const gated = !isStaff &&
      ['normalization', 'quiz'].includes(lesson.id) && !erMcqPassed;` — passed as the `locked`
      prop into the shared `LessonRow` accordion component (defined ~line 1373), which renders
      a lock icon, a "Locked" pill, and the substitute subtitle "Score above 50% in the ER
      Knowledge Check to unlock this lesson." in place of the real subtitle, and disables the
      row's click-to-expand entirely.
- **Depends on:**
  - `firebase/firestore` (`doc`, `getDoc`, `setDoc`, `updateDoc`, `arrayUnion`,
    `serverTimestamp`, `collection`, `onSnapshot`, `orderBy`, `query`) via `src/lib/firebase.ts`
    (`db`).
  - Firestore collection **`erMcqResults`** — one document per student, keyed by `user.uid`.
    This is the sole data store for the quiz; see Section 4 for the full document shape.
  - Firestore collection **`students`** — the quiz writes `{ erMcqBadge: true }` (merge) to the
    student's own `students/{uid}` document when the distinction badge is earned, "so
    sidebar/list can display it cheaply" (comment in source).
  - `src/contexts/AuthContext.tsx` (`useAuth()`) for the current `user`.
  - `src/lib/types.ts` (`StudentProfile` type) — passed in as a prop, used to populate
    `studentName`/`studentDisplayId`/`studentSection`/`studentCampus` on first submission.
  - `lucide-react` icons: `BookOpen, Trophy, Send, RotateCcw, CheckCircle2, XCircle, ChevronUp,
    ChevronDown, Lock, Star` (student view) and `Users, Award, BarChart2, Star, ChevronDown,
    ChevronUp` (staff dashboard).
  - Shared CSS utility classes `btn-primary`, `btn-secondary`, `input-field` (defined
    elsewhere in the app's global styles, not in this component).
  - **Depended on by** two other MBI802 lessons: this quiz's pass/fail state
    (`erMcqPassed`, derived from `bestPercentage > 50`) is the unlock gate for the
    `'normalization'` lesson (Database Normalization & Functional Dependencies — documented in
    `lesson-docs/mbi802/18-normalization-deck.md`) and the `'quiz'` lesson (DBMS Knowledge
    Check, 38Q — documented in `lesson-docs/mbi802/19-dbms-knowledge-check.md`). This ER
    Knowledge Check is itself **not** gated behind anything — it is reachable as soon as a
    student can see the MBI802 tab at all.

## 1. Purpose & learning objectives

This is a 20-question multiple-choice knowledge check covering Entity-Relationship modeling —
the same subject matter as the earlier public/gated ER lessons (ER Diagrams, ER Activities,
Advanced ER Concepts, ER Attributes & Participation Constraints, ER→Relational Mapping). Its
internal quiz title (`ER_MCQ_QUIZ_TITLE` in `erMcqData.ts`) is **"ER Diagrams & Advanced ER
Concepts"**, reflecting that scope. It tests recall and applied understanding of:

- Chen's ER notation (shapes for entities, relationships, attributes, weak entities,
  multivalued attributes, key attributes).
- Cardinality (one-to-one, one-to-many, many-to-many) via worded scenarios the student must
  classify.
- Participation constraints (total vs. partial participation).
- Advanced ER concepts: weak entities, identifying relationships, multivalued attributes,
  derived attributes, and partial keys/discriminators.

It plays a **dual role** in the platform, which is the main thing a rebuilder needs to
preserve: it is simultaneously (a) a standard graded knowledge check with its own pass/fail
and badge mechanics, and (b) a **prerequisite gate** — a student cannot open the
"Database Normalization & Functional Dependencies" slide deck lesson or the "DBMS Knowledge
Check" (38Q) lesson later in the same MBI802 lesson list until they score above 50% on this
quiz. This mirrors a real-world "checkpoint" instructional design: the lecturer will not let
students move on to normalization/relational-schema topics until ER fundamentals are
demonstrably solid.

## 2. Full content

All values below (pass threshold, distinction threshold, max attempts, collection name) are
imported constants from `src/lib/erMcqData.ts`, transcribed exactly:

- `ER_MCQ_COLLECTION = 'erMcqResults'`
- `ER_MCQ_QUIZ_TITLE = 'ER Diagrams & Advanced ER Concepts'`
- `ER_MCQ_PASS_PERCENTAGE = 50` (pass condition is strictly **greater than** 50%, not
  greater-or-equal — see Section 4)
- `ER_MCQ_DISTINCTION_PERCENTAGE = 90` (badge threshold, first attempt only)
- `ER_MCQ_MAX_ATTEMPTS = 3`

The question bank is a flat array of 20 objects (`id`, `category`, `question`, `choices[4]`,
`correct` 0-indexed), grouped into three categories in this fixed order (order of first
appearance in the array, which also drives category display/accordion order in the UI):

1. **ER Diagram Fundamentals** — 7 questions (er01–er07)
2. **Relationships & Cardinality** — 6 questions (er08–er13)
3. **Advanced ER Concepts** — 7 questions (er14–er20)

`ER_MCQ_CATEGORIES` is derived at runtime as `[...new Set(ER_MCQ_QUESTIONS.map(q =>
q.category))]`, so it preserves this same order. All 20 questions, verbatim, with the correct
choice marked with **[CORRECT]**:

### Category 1 — ER Diagram Fundamentals

**Q1 (er01).** In Chen's ER notation, which shape is used to represent an entity?
- A. Diamond
- B. Oval
- C. Rectangle **[CORRECT]**
- D. Double rectangle

**Q2 (er02).** In Chen's ER notation, which shape represents a relationship between entities?
- A. Rectangle
- B. Diamond **[CORRECT]**
- C. Oval
- D. Double oval

**Q3 (er03).** What shape is used to represent an attribute in Chen's ER notation?
- A. Rectangle
- B. Diamond
- C. Oval **[CORRECT]**
- D. Double rectangle

**Q4 (er04).** What is a key attribute in an ER diagram?
- A. An attribute that can hold multiple values for a single entity
- B. An attribute whose value uniquely identifies each entity instance **[CORRECT]**
- C. An attribute calculated from other stored attributes
- D. An attribute that can be left empty (NULL)

**Q5 (er05).** In an ER diagram, what does cardinality describe?
- A. The data type stored in each attribute
- B. The total number of entities allowed in the database
- C. The number of instances of one entity that can be associated with instances of another **[CORRECT]**
- D. The storage size required for each relationship

**Q6 (er06).** What is a composite attribute in an ER diagram?
- A. An attribute that uniquely identifies an entity
- B. An attribute that can store multiple values simultaneously
- C. An attribute made up of multiple sub-attributes (e.g., Full Name = First + Last) **[CORRECT]**
- D. An attribute derived from a calculation on other attributes

**Q7 (er07).** How is a key attribute distinguished from other attributes in Chen's ER notation?
- A. It is drawn as a double oval
- B. Its name is underlined **[CORRECT]**
- C. It is placed inside the entity rectangle
- D. It is connected to the entity with a double line

### Category 2 — Relationships & Cardinality

**Q8 (er08).** A student can enrol in many courses, and each course can have many students. What relationship type exists between Student and Course?
- A. One-to-One
- B. One-to-Many
- C. Many-to-One
- D. Many-to-Many **[CORRECT]**

**Q9 (er09).** In a hospital, each patient is assigned to exactly one primary doctor, and a doctor can manage many patients. What is the relationship between Doctor and Patient?
- A. Many-to-Many
- B. One-to-Many **[CORRECT]**
- C. One-to-One
- D. Many-to-One

**Q10 (er10).** In an online store, each order belongs to exactly one customer, but a customer can place many orders. What relationship exists between Customer and Order?
- A. One-to-One
- B. Many-to-Many
- C. One-to-Many **[CORRECT]**
- D. Many-to-One

**Q11 (er11).** What does "total participation" mean in an ER diagram?
- A. Only some entity instances participate in the relationship
- B. Every entity instance must participate in at least one instance of the relationship **[CORRECT]**
- C. The relationship must have a maximum cardinality of one on both sides
- D. All entities in the database are linked to each other

**Q12 (er12).** In a university, every faculty member must be assigned to a department, but a department can exist without any assigned faculty. Which entity has total participation in the "Assigned-To" relationship?
- A. Department
- B. Faculty Member **[CORRECT]**
- C. Both entities
- D. Neither entity

**Q13 (er13).** In a hotel system, a room can be booked by many guests over time, and a guest can book many rooms across different stays. What is the relationship between Guest and Room?
- A. One-to-One
- B. One-to-Many
- C. Many-to-Many **[CORRECT]**
- D. Many-to-One

### Category 3 — Advanced ER Concepts

**Q14 (er14).** What is a weak entity in an ER diagram?
- A. An entity with no attributes
- B. An entity that cannot be uniquely identified by its own attributes alone and depends on an owner entity **[CORRECT]**
- C. An entity with fewer than three attributes
- D. An entity that only participates in one-to-one relationships

**Q15 (er15).** How is a weak entity represented in Chen's ER notation?
- A. Single rectangle
- B. Oval with a dashed border
- C. Double rectangle **[CORRECT]**
- D. Diamond with a double border

**Q16 (er16).** What is an identifying relationship in an ER diagram?
- A. A relationship between two strong entities that share a primary key
- B. The relationship that connects a weak entity to its owner (identifying) entity **[CORRECT]**
- C. A relationship where all participating entities have the same key attribute
- D. A many-to-many relationship that requires a junction table

**Q17 (er17).** What is a multivalued attribute in an ER diagram?
- A. An attribute whose value is calculated from other attributes
- B. An attribute composed of multiple sub-parts
- C. An attribute that can hold more than one value for a single entity instance (e.g., multiple phone numbers) **[CORRECT]**
- D. An attribute that uniquely identifies an entity

**Q18 (er18).** How is a multivalued attribute shown in Chen's ER notation?
- A. Single oval
- B. Dashed oval
- C. Double oval **[CORRECT]**
- D. Underlined name inside a single oval

**Q19 (er19).** What is a derived attribute in an ER diagram?
- A. An attribute that uniquely identifies each entity instance
- B. An attribute that can be computed from other stored attributes (e.g., Age derived from Date of Birth) **[CORRECT]**
- C. An attribute that can store multiple values
- D. An attribute shared between two related entities

**Q20 (er20).** What is a partial key (discriminator) in the context of weak entities?
- A. The primary key of the owner entity copied into the weak entity
- B. A foreign key that links the weak entity to its owner entity
- C. An attribute set that uniquely identifies weak entity instances among those associated with the same owner **[CORRECT]**
- D. The relationship diamond connecting the weak entity to its owner

### Mechanics (verbatim from code/UI copy)

- **Attempts.** A student gets `ER_MCQ_MAX_ATTEMPTS = 3` attempts total, lifetime (tracked in
  the single Firestore document per student, not per-session). Once 3 attempts are used, the
  quiz enters an "exhausted" state that shows only the best-score summary and full attempt
  history — no further retakes are offered, regardless of pass/fail.
- **Pass/unlock threshold.** A student "passes" (and unlocks the two gated lessons downstream)
  when their **best-ever percentage across all attempts** is **strictly greater than 50%**
  (`newBest > ER_MCQ_PASS_PERCENTAGE`, i.e. 51% or higher — exactly 50% does *not* pass). This
  is intentionally not "50% or higher"; the doc-writer notes this asymmetry as a real behavior
  in the code, not a typo to smooth over.
- **Distinction badge.** Scoring `>= ER_MCQ_DISTINCTION_PERCENTAGE` (90%) **on the first
  attempt only** (`isFirstAttempt && pct >= 90`) earns the **"ER Distinction Badge"**. It is
  awarded exactly once, checked only against attempt #1 — a student who fails attempt 1 and
  then scores 95% on attempt 2 or 3 does **not** retroactively earn the badge. The UI copy
  names it "ER Distinction Badge Earned!" (result screen) / "ER Distinction Badge Earned" pill
  (exhausted screen) / "You earned the ER Distinction Badge on your first attempt!" (intro
  screen banner shown on return visits).
- **Unanswered questions count as incorrect** — on submit, any question with no selected
  choice simply fails the `answers[q.id] === q.correct` check; there is no partial credit or
  blocking of submission. The UI does warn beforehand: "N unanswered question(s) — these will
  count as incorrect."
- Intro-screen summary copy (verbatim): "*{total} multiple-choice questions across {N} topic
  areas. Score above {50}% to unlock the remaining lessons. Score {90}%+ on your **first
  attempt** to earn a special badge.*" — with `{total}` = 20 and `{N}` = 3 (category count)
  interpolated live from the data, not hardcoded strings.
- Category subtitle used on the parent lesson row (`CourseResources.tsx`): "20 questions ·
  3 attempts · Score >50% to unlock remaining lessons · 90%+ on first attempt earns a badge".

## 3. UI & interaction design

**Overall shape:** a single-page, phase-driven flow with no routing — five mutually exclusive
render phases held in one `phase` state variable: `'loading' | 'intro' | 'taking' | 'result' |
'exhausted'`. All phases share the same indigo/violet color language as the rest of the MBI802
gated lessons (`#6366f1` primary indigo, soft gradient card backgrounds, `rounded-2xl` cards).

- **Loading phase.** A single centered spinning ring (`animate-spin`, indigo border with a
  lighter top segment) while the student's prior-attempt document is fetched from Firestore.

- **Intro phase.**
  - If a distinction badge was already earned on a prior visit, a persistent amber/gold banner
    is shown at the top with a filled `Star` icon and the "You earned the ER Distinction
    Badge…" copy.
  - If the student has prior attempts, an `AttemptHistory` panel lists each past attempt
    ("Attempt 1", "Attempt 2", …) as a row with a pill showing `score/total (pct%)`, colored
    green if that attempt individually passed (`>50%`) or red otherwise.
  - The main intro card is a large indigo-gradient rounded card with a `BookOpen` icon, the
    quiz title, the interpolated summary paragraph (see Section 2), and a row of pill-shaped
    category tags (one per category, indigo-tinted).
  - A primary button reads "Start Quiz" on attempt 0, or "Retake (Attempt N/3)" thereafter,
    next to small gray text stating attempts remaining ("2 attempts remaining" / "1 attempt
    remaining", singular/plural handled inline).

- **Taking phase.**
  - A **sticky progress bar** pinned to the top (`sticky top-0 z-10`, translucent/blurred
    background via `backdropFilter: blur(8px)`) shows "{answered} of {total} answered ·
    Attempt {n}/3" on the left and a live percentage on the right, above an animated
    gradient-fill progress bar (`#818cf8` → `#4f46e5`).
  - Questions are grouped into **collapsible category accordions** (one per category, default
    expanded — `expandedCategories` initialized to all-true), each with a header button showing
    the category name, an "{answered}/{count}" pill (turns green when the category is fully
    answered), and a chevron toggle.
  - Inside each open category, questions render as stacked cards, each showing "Question {N}"
    (global index across the whole quiz, not per-category) in small gray caps, the question
    text, and four full-width answer-choice buttons labeled A–D. Selecting an answer
    highlights that button with an indigo gradient fill, indigo border, bold text, and a
    filled circular A/B/C/D badge; unselected choices stay in a neutral translucent-white
    style.
  - A closing indigo card holds the submit control: if any questions are unanswered, an amber
    inline warning banner appears above the button ("{N} unanswered question(s) — these will
    count as incorrect."); the "Submit Quiz" button (`Send` icon) shows a spinner + "Submitting…"
    while the Firestore write is in flight, and is `disabled` during submission.
  - On submit, the view scrolls smoothly to top (`window.scrollTo({ top: 0, behavior:
    'smooth' })`).

- **Result phase.**
  - If the badge was earned on *this* submission, a celebratory gold card appears first
    (`Star` icon at 32px, "ER Distinction Badge Earned!" plus a sentence with the live score).
  - A large score card follows: green gradient if passed, red gradient if not, a `Trophy` icon,
    the raw fraction ("{score} / {total}") in extra-bold 3xl type, and a status line
    ("{pct}% — Passed! Next lessons unlocked." or "{pct}% — Need >50% to unlock next lessons.").
  - Below that, a **per-category breakdown grid** (1 column mobile, 3 columns desktop) recomputes
    correct-count and percentage per category from the just-submitted answers and displays each
    as its own small card.
  - Two action buttons: "Review Answers" / "Hide Review" (toggles `showReview`, chevron icon
    flips), and — only if attempts remain — "Retake ({N} left)" with a `RotateCcw` icon, which
    resets local state and returns to the intro phase.
  - When review is expanded, **every** question renders again (not just wrong ones), each in
    its own card tinted green (correct) or red (incorrect) with a check/cross icon, the
    question text, and every answer choice restyled to show: the correct answer highlighted
    green with a trailing checkmark icon, the student's selected-but-wrong answer highlighted
    red, and all other choices neutral.

- **Exhausted phase (3 attempts used).** A single summary card (green if the best score
  passed, red otherwise) with a `Lock` icon, "3 attempts used", the best score line, and an
  explanatory sentence — either "You have passed this checkpoint. The remaining lessons are
  unlocked." or "You need more than 50% to unlock the next lessons." — plus the badge pill if
  earned, followed by the same `AttemptHistory` list used in the intro phase.

- **Locking visual (in the parent `CourseResources.tsx`, not this component itself):** while a
  student hasn't passed, the two downstream lesson rows (`normalization`, `quiz`) render via the
  shared `LessonRow` component with `locked=true`: dimmed (`opacity: 0.7`), a gray `Lock` icon
  instead of the lesson's real icon, a small red "Locked" pill next to the "Lesson N" eyebrow,
  the subtitle replaced with "Score above 50% in the ER Knowledge Check to unlock this lesson.",
  and the row header becomes non-clickable (`disabled`, `cursor: not-allowed`).

- **Staff dashboard (`ERMcqDashboard.tsx`), rendered instead of the quiz for `isStaff` users:**
  - Small uppercase eyebrow: "Student Results — ER Diagrams & Advanced ER Concepts".
  - A 2×2 (mobile) / 1×4 (desktop) grid of summary stat cards: "Students Attempted" (with "max
    3 attempts each" subtext), "Average Best Score", "Passed (>50%)", and "Distinction Badge
    (≥90% 1st)" — each with a `lucide-react` icon (`Users`, `BarChart2`, `Award`, `Star`
    respectively).
  - A **score distribution bar chart** with four fixed buckets — 0–49% (red `#fca5a5`), 50–69%
    (amber `#fcd34d`), 70–89% (green `#6ee7b7`), 90–100% (indigo `#818cf8`) — bar heights scaled
    to the max bucket count (capped at 80px, min 4px so empty buckets are still visible as a
    sliver), with a caption row restating the pass/distinction thresholds.
  - A **filterable, sortable results table**: free-text filter box (matches name, display ID,
    section, or campus, case-insensitive substring); column headers ("Student", "Best Score",
    "Attempts", "Last Attempt") are clickable to sort, toggling ascending/descending on repeat
    clicks, with a small chevron indicating current sort key/direction; a fifth "Status" column
    (not sortable) shows a green "Passed" or red "Not Passed" pill.
  - Each row is expandable (click anywhere on the row) to reveal a nested **per-attempt history**
    panel showing every attempt's score/percentage/date, with a small star icon next to
    "Attempt 1" if that student earned the badge.
  - Empty states: "No quiz submissions yet." (no data at all) vs. "No results match the
    filter." (data exists but filter excludes everything).
  - Live-updating via Firestore `onSnapshot` (not a one-time `getDoc`) — the dashboard reflects
    new submissions in real time without a page refresh, ordered server-side by
    `lastAttemptAt desc`.

## 4. Component & state architecture

### `ERMcq` (student view)

**Props:** `studentProfile: StudentProfile | null`, `onPassStatusChange?: (passed: boolean) =>
void`.

**Local state:**
- `phase: Phase` — the five-way view switch described in Section 3.
- `answers: Record<string, number>` — question id → selected choice index (0–3), the only
  source of truth for the in-progress attempt.
- `submitting: boolean` — guards the submit button during the async Firestore write.
- `score: number` — raw correct-count from the most recent submission, used to render the
  result screen.
- `showReview: boolean` — toggles the full answer-review list on the result screen.
- `pastAttempts: AttemptRecord[]` — hydrated from Firestore on mount; `AttemptRecord = { score,
  total, percentage, completedAt: Date }`.
- `badgeEarned: boolean` — mirrors the Firestore `badgeEarned` field.
- `expandedCategories: Record<string, boolean>` — accordion open/closed state, all `true` by
  default and reset to all-`true` on every retake.

**Derived values (computed each render, not stored):** `total` (question count, 20),
`answered` (`Object.keys(answers).length`), `progressPct`, `attemptCount` (`pastAttempts.length`),
`bestPct` (`Math.max(...pastAttempts.map(a => a.percentage))`, or 0 if none).

**Mount effect:** fetches `getDoc(doc(db, ER_MCQ_COLLECTION, user.uid))`. If the document
exists, it maps the stored `attempts` array into `AttemptRecord[]` (converting each Firestore
Timestamp via `.toDate?.()`, falling back to `new Date()` if absent), sets `badgeEarned` from
`data.badgeEarned ?? false`, computes `passed = (data.bestPercentage ?? 0) >
ER_MCQ_PASS_PERCENTAGE` and immediately calls `onPassStatusChange?.(passed)` so the parent's
gate state is correct even before the student interacts with anything, then sets `phase` to
`'exhausted'` if `attempts.length >= ER_MCQ_MAX_ATTEMPTS` else `'intro'`. If the document
doesn't exist (first-ever visit) or the read throws, it falls through to `'intro'` silently (no
error UI is shown — a caught exception is swallowed with only a comment, `// silently continue`
equivalent pattern used elsewhere too).

**Submit flow (`handleSubmit`):**
1. Computes `correct` by filtering `ER_MCQ_QUESTIONS` where `answers[q.id] === q.correct`, and
   `pct = Math.round((correct/total)*100)`.
2. `isFirstAttempt = attemptCount === 0`; `earnedBadge = isFirstAttempt && pct >=
   ER_MCQ_DISTINCTION_PERCENTAGE`.
3. `newBest = Math.max(bestPct, pct)`; `passed = newBest > ER_MCQ_PASS_PERCENTAGE`.
4. **First attempt** (`attemptCount === 0`): `setDoc` (create) on `erMcqResults/{uid}` with the
   full document shape below.
   **Subsequent attempts**: `updateDoc` with `arrayUnion` to append the new attempt record,
   plus updated `bestPercentage`, `passed`, `attemptCount`, `lastAttemptAt`.
5. If `earnedBadge`, an additional `setDoc(doc(db, 'students', user.uid), { erMcqBadge: true },
   { merge: true })` write updates the student's own profile document (separate collection),
   and local `badgeEarned` is set to `true`.
6. `onPassStatusChange?.(passed)` is invoked regardless of first/subsequent attempt, propagating
   the new gate state up.
7. Firestore errors are caught and swallowed (comment: "silently continue — score still shown
   locally") — the local `phase`/`score` state still updates to show the result screen even if
   the write failed, meaning a student *can* see a passing result client-side that never
   persisted server-side if Firestore errors. This is called out again in Section 5.
8. Regardless of outcome, `pastAttempts` is updated locally, `phase` becomes `'result'`, and the
   page scrolls to top.

**`erMcqResults/{studentUid}` document shape** (Firestore collection `ER_MCQ_COLLECTION =
'erMcqResults'`, one doc per student keyed by their Firebase Auth `uid`):
```ts
{
  studentUid: string;
  studentName: string;        // studentProfile?.fullName ?? user.email ?? 'Unknown'
  studentDisplayId: string;   // studentProfile?.studentId ?? ''
  studentSection: string;     // studentProfile?.section ?? ''
  studentCampus: string;      // studentProfile?.campus ?? ''
  attempts: {
    score: number;
    total: number;            // always 20
    percentage: number;
    completedAt: Date;        // client Date on create; Firestore Timestamp once round-tripped
  }[];
  bestPercentage: number;     // max percentage across all attempts, recomputed each submit
  badgeEarned: boolean;       // set true only on the qualifying first-attempt submit
  passed: boolean;            // bestPercentage > 50
  attemptCount: number;       // length of attempts[]
  firstAttemptAt: Timestamp;  // serverTimestamp(), set once on doc creation only
  lastAttemptAt: Timestamp;   // serverTimestamp(), updated on every submit
}
```
Note the redundancy: `attempts[].completedAt` is a client-generated `new Date()` embedded via
`arrayUnion` (Firestore doesn't support `serverTimestamp()` inside array elements), whereas the
top-level `firstAttemptAt`/`lastAttemptAt` fields are true server timestamps — a rebuild should
preserve this distinction rather than "fixing" it, since it reflects a genuine Firestore
constraint (server timestamp sentinels aren't allowed inside `arrayUnion` payloads).

**`onPassStatusChange` callback contract:** called with the boolean pass state (a) once on
mount after the initial Firestore read resolves, and (b) once after every successful (or even
failed-but-locally-computed) submit. The parent `CourseResources.tsx` uses this purely to set
its own `erMcqPassed` state (`useState(false)`), which then drives the `locked` computation for
the `normalization` and `quiz` lesson rows (Section 2 of the parent file, not this component) —
this is the entire mechanism by which the quiz "unlocks" later lessons; there is no other
listener or Cloud Function involved.

### `ERMcqDashboard` (staff view)

**No props.** Entirely self-contained, driven by a live Firestore listener:
```ts
const q = query(collection(db, ER_MCQ_COLLECTION), orderBy('lastAttemptAt', 'desc'));
const unsub = onSnapshot(q, (snap) => { ...maps every doc into a StudentResult row... });
```
unsubscribed on unmount. Local UI-only state: `sortKey` (`'name'|'score'|'date'|'attempts'`,
default `'date'`), `sortDir` (`'asc'|'desc'`, default `'desc'`), `filterText`, and
`expandedStudent` (uid of the currently expanded row, or `null` — only one row can be expanded
at a time). All aggregate numbers (total students, average best score, pass count, badge count,
bucket counts) are derived by filtering/reducing the live `results` array on every render, not
stored separately. Clicking a sortable column header via `toggleSort(key)` either flips
direction (if already the active sort key) or switches to that key at `desc` by default.

## 5. Rebuild notes

- **Pass threshold is strictly `>` 50, not `>=`.** Getting exactly 50% does not pass and does
  not unlock the downstream lessons. This asymmetry is consistent everywhere it's checked
  (`ERMcq.tsx` submit logic, exhausted-phase best-score check, `AttemptHistory` per-attempt
  coloring, `CourseResources.tsx` gate computation, and `ERMcqDashboard.tsx`'s `passed`/
  `pctColor` logic) — it is a deliberate, consistently-applied rule, not a one-off bug, and
  must be preserved exactly (`> 50`, never `>= 50`) in any rebuild.
- **Badge is first-attempt-only and is not retroactive.** A student who improves to 90%+ on
  attempt 2 or 3 after a lower first attempt never earns the badge; the check is hard-gated on
  `isFirstAttempt` at submit time. `ERMcqDashboard`'s "Distinction Badge (≥90% 1st)" stat and
  the per-row star icon both read the stored `badgeEarned` boolean rather than recomputing it,
  so this rule only needs to be enforced correctly once, at write time in `ERMcq.tsx`.
- **Silent Firestore-error swallowing on submit** (`try { ... } catch { /* silently continue —
  score still shown locally */ }` in `handleSubmit`): if the Firestore write fails (network
  blip, permissions issue, etc.), the student still sees a normal result screen and the app
  behaves as if the attempt was recorded, but nothing was actually persisted — their next
  visit would show no record of that attempt, and `attemptCount` server-side would not have
  incremented. This is a real fragility worth flagging to a rebuilder: consider whether to
  preserve this "fail open" UX (student experience uninterrupted) or make it more visible
  (e.g. a retry/error banner) — the current app chooses fail-open with no error surfaced to the
  user or logged anywhere visible.
- **Attempt limit and gate state are both keyed off the *same* Firestore document**, so there
  is no server-side enforcement preventing a student from bypassing the "3 attempts" cap by,
  e.g., directly manipulating client state — the true enforcement is only that the UI won't
  offer a 4th "Retake" button once `attempts.length >= ER_MCQ_MAX_ATTEMPTS`, and the write path
  itself (`updateDoc` with `arrayUnion`) does not check attempt count server-side (no Firestore
  security-rule detail was inspected as part of this doc — worth checking `firestore.rules`
  separately if rebuilding with stricter guarantees).
- **`studentProfile` can be `null`** (prop is typed `StudentProfile | null`) — in that case
  `studentName` falls back to `user.email ?? 'Unknown'` and the ID/section/campus fields fall
  back to empty strings. The dashboard renders these gracefully (conditionally hides the ID/
  campus/section line if both are falsy).
- **No time limit** on the quiz itself — unlike the sibling "DBMS Knowledge Check" lesson's
  subtitle ("No time limit"), this quiz's subtitle doesn't mention timing at all, and no
  `setInterval`/`Date.now()` timer logic exists anywhere in `ERMcq.tsx`. Confirmed absent, not
  merely unmentioned.
- **Category grouping is derived from data order, not hardcoded** — `ER_MCQ_CATEGORIES` is a
  `Set` built from the questions array's own category field in first-seen order. If rebuilding,
  do not hardcode a separate category list; derive it the same way so any future edits to
  `erMcqData.ts` propagate automatically to both the quiz UI and the results dashboard's
  category-aware breakdown (the result screen's per-category grid in `ERMcq.tsx` also iterates
  `ER_MCQ_CATEGORIES`, so it too stays in sync automatically).
- **No dedicated route** — this whole feature only exists as a conditionally-rendered child
  inside `CourseResources.tsx`'s lesson-accordion loop; there is no `/er-mcq` URL, no deep link
  to a specific question, and no browser back/forward interaction beyond the app's normal SPA
  routing. Reopening the lesson row after closing it does not reset in-progress `answers` state
  within the same page session (state lives in the mounted `ERMcq` component instance, which
  persists as long as the parent `CourseResources` page itself isn't unmounted/remounted) —
  but note the row `isOpen`/`onToggle` accordion state in the parent is separate from the
  quiz's own internal `phase`, so collapsing and re-expanding the row does **not** reset an
  in-progress attempt.
- **No assets** (images/SVGs/videos) are referenced by this lesson — it is 100% text/data
  driven from `erMcqData.ts`, styled with inline Tailwind classes and inline `style` objects
  (hex/rgba color values), consistent with the rest of the MBI802 gated lessons.
- **Dead/unused import check:** none found — both components' imports are all used.
