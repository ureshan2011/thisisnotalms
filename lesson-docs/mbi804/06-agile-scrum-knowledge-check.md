# Agile Scrum Knowledge Check — MBI804

- **Subject:** MBI804 — IT Project Management. Explicit — `CourseResources.tsx` registry: "Agile Scrum Knowledge Check ... 30 multiple-choice questions · 3 attempts · Score ≥90% on first attempt to earn a badge," under the MBI804 course entry, and the questions themselves are entirely Agile/Scrum content.
- **Gating:** Gated only. No public route. Reachable only via `/student/course-resources` (student) or the staff dashboard variant, MBI804 tab, lesson id `'agile-scrum-mcq'` — immediately below the Agile Scrum Deck (`05-agile-scrum-deck.md`) in the lesson list, which it is designed to test.
- **Route(s):** `/student/course-resources` (renders `<AgileScrumMcq studentProfile={...} />` for students) and `/lecturer/course-resources` / staff view of the same route (renders `<AgileScrumMcqDashboard />` instead — a results dashboard, not the quiz itself). Dispatch logic lives in `CourseResources.tsx`: `{lesson.id === 'agile-scrum-mcq' && isStaff && <AgileScrumMcqDashboard />}` / `{lesson.id === 'agile-scrum-mcq' && !isStaff && <AgileScrumMcq studentProfile={studentProfile} />}`.
- **Source files:**
  - `src/lib/agileScrumMcqData.ts` — the question bank and quiz constants, 339 lines
  - `src/components/quiz/AgileScrumMcq.tsx` — student-facing quiz-taking UI, 547 lines
  - `src/components/quiz/AgileScrumMcqDashboard.tsx` — staff results dashboard, 335 lines
  - `src/pages/student/CourseResources.tsx` — embed point / dispatch
- **Depends on:** Firestore collection `agileScrumMcqResults` (one document per student, keyed by `user.uid`). `lucide-react` icons. `src/lib/types.ts` (`StudentProfile`). `src/contexts/AuthContext` (`useAuth`) for the current user. No relationship to the ER/DBMS quiz gating mechanism used elsewhere in MBI802 — this quiz has no unlock prerequisite of its own and does not gate anything downstream.

## 1. Purpose & learning objectives

Tests comprehension of the Agile Scrum Process in IT deck (`05-agile-scrum-deck.md`) across five topic categories: Agile Foundations, Scrum Framework & Pillars, Scrum Roles, Scrum Artifacts, and Scrum Events & Ceremonies. 30 multiple-choice questions, up to 3 attempts, pass threshold >50%, and a first-attempt distinction badge at ≥90% — mirroring the attempt-limit/badge-threshold pattern used by the MBI802 ER Knowledge Check and DBMS Knowledge Check quizzes elsewhere on the platform.

## 2. Full content

**Quiz metadata** (from `agileScrumMcqData.ts`): title "Agile Scrum Process – Knowledge Check"; pass percentage >50%; first-attempt distinction badge threshold ≥90%; max 3 attempts; Firestore collection `agileScrumMcqResults`. Five categories, 6 questions each:

### Agile Foundations
1. In what year was the Agile Manifesto written? — A) 1995 B) 1999 **C) 2001** D) 2005
2. Which of the following is one of the four core values stated in the Agile Manifesto? — A) Comprehensive documentation over working software B) **Individuals and interactions over processes and tools** C) Contract negotiation over customer collaboration D) Following a plan over responding to change
3. According to the Agile Manifesto, what is valued MORE than comprehensive documentation? — **A) Working software** B) Customer collaboration C) Responding to change D) Individuals and interactions
4. Which approach typically delivers all project output in a single release at the very end of the project? — A) Agile B) Scrum **C) Waterfall** D) Kanban
5. Compared to Waterfall, when does testing occur in an Agile project? — A) Only after all development is complete B) Only at the start of the project **C) Continuously throughout every iteration or sprint** D) Only during the final user-acceptance phase
6. What does "iterative development" mean in the context of Agile? — A) Writing code and then rewriting it from scratch every few months **B) Delivering work in small cycles with feedback gathered at each stage** C) Repeating the same fixed plan until the product is complete D) Assigning different developers to the same task in rotation

### Scrum Framework & Pillars
7. What are the three empirical pillars of Scrum? — A) Planning, Execution, Delivery **B) Transparency, Inspection, Adaptation** C) Roles, Artifacts, Events D) Backlog, Sprint, Increment
8. What is the recommended duration of a Scrum Sprint? — A) 1 day to 1 week **B) 1 to 4 weeks** C) 1 to 3 months D) 3 to 6 months
9. Which Scrum pillar ensures that all significant aspects of the process are visible to everyone responsible for the outcome? — A) Adaptation B) Inspection **C) Transparency** D) Collaboration
10. The Scrum Guide defines Scrum as which of the following? — A) A full software development methodology with prescriptive coding standards **B) A lightweight framework for developing, delivering, and sustaining complex products** C) A project management tool specifically designed for IT infrastructure projects D) A waterfall-based approach that incorporates periodic reviews
11. What is the recommended number of Developers (excluding Scrum Master and Product Owner) in a Scrum Team? — A) 1–2 **B) 3–9** C) 10–15 D) Any number
12. What does the "Adaptation" pillar of Scrum require? — A) That the team adapts to each developer's personal work style B) That requirements are adapted at the end of each project phase **C) That the process is adjusted as soon as possible when inspection reveals deviation beyond acceptable limits** D) That the Scrum Master adapts the framework to suit the organisation's existing processes

### Scrum Roles
13. How many distinct roles exist within a Scrum Team? — A) 2 **B) 3** C) 4 D) 5
14. Who is accountable for maximising the value of the product resulting from the Scrum Team's work? — A) Scrum Master B) Development Team Lead **C) Product Owner** D) Project Manager
15. Which statement best describes the primary responsibility of the Scrum Master? — A) Writing code and building the product features B) Managing and updating the Product Backlog daily **C) Acting as a servant-leader who ensures Scrum is understood and enacted** D) Representing customer stakeholders and approving deliverables
16. According to Scrum, how many Product Owners should a single Scrum Team have? — A) One per developer on the team **B) One** C) One per major stakeholder group D) Two — one for business and one for technical concerns
17. Who is responsible for creating the product Increment during each Sprint? — A) Product Owner B) Scrum Master **C) Developers** D) External QA team
18. In Scrum, what does it mean for Developers to be a "cross-functional" team? — A) Each developer works across multiple Scrum Teams simultaneously **B) The team collectively has all the skills needed to create a valuable product Increment** C) Each developer is required to know multiple programming languages D) Developers report to multiple managers from different business units

### Scrum Artifacts
19. What are the three Scrum artifacts? — A) Sprint, Review, Retrospective **B) Product Backlog, Sprint Backlog, Increment** C) Product Owner, Scrum Master, Developers D) User Stories, Tasks, Epics
20. Who is responsible for managing and prioritising the Product Backlog? — A) Scrum Master B) Developers collectively **C) Product Owner** D) Stakeholders by majority vote
21. What is the "Definition of Done" (DoD) in Scrum? — A) A list of features planned for development in the next sprint **B) A formal quality standard that must be met for an Increment to be considered complete** C) The Product Owner's written acceptance signature on a user story D) A contract document describing the full project scope
22. What is the Sprint Goal in relation to the Sprint Backlog? — A) A detailed list of every task that must be completed in the sprint **B) The single objective for the Sprint — the commitment embedded in the Sprint Backlog** C) The team's velocity target expressed in story points D) The Product Owner's overall product vision statement
23. In Scrum, what is the purpose of story point estimation? — A) To measure the exact number of hours each task will take B) To assign monetary value to each backlog item **C) To express relative effort and complexity of backlog items, enabling capacity planning** D) To track individual developer productivity
24. What is the Increment in Scrum? — A) The increase in team velocity measured between two consecutive sprints **B) The sum of all completed Product Backlog items that meet the Definition of Done** C) The total number of story points added to the backlog during a sprint D) The difference between the planned and actual work completed in a sprint

### Scrum Events & Ceremonies
25. How many formal Scrum events are defined in the Scrum framework? — A) 3 B) 4 **C) 5** D) 6
26. What is the maximum timebox for Sprint Planning in a 4-week Sprint? — A) 2 hours B) 4 hours **C) 8 hours** D) 1 full working day (8+ hours)
27. Which three topics are addressed during Sprint Planning? — A) Who works on what, when tasks are due, and who is responsible for testing **B) Why is this Sprint valuable, what can be done, and how will the work get done** C) Scope, budget, and timeline for the Sprint D) Product Backlog refinement, testing plan, and release schedule
28. What is the timebox for the Daily Scrum (standup)? — A) 5 minutes **B) 15 minutes** C) 30 minutes D) 1 hour
29. What is the primary purpose of the Sprint Review? — A) To review the team's working processes and identify improvements for the next sprint B) To plan which items will be selected for the next sprint **C) To present the Increment to stakeholders, gather feedback, and adapt the Product Backlog** D) To assess individual team member performance against KPIs
30. What is the key difference between the Sprint Review and the Sprint Retrospective? — A) The Sprint Review is for the team only; the Retrospective includes external stakeholders **B) The Sprint Review inspects the product Increment with stakeholders; the Retrospective inspects the team's own processes and ways of working** C) The Sprint Review is mandatory in Scrum; the Retrospective is optional D) The Sprint Review happens at the start of the sprint; the Retrospective happens at the midpoint

(Bold = correct answer, 0-indexed as `correct` in source.)

## 3. UI & interaction design

Student flow has five phases (`loading` → `intro` → `taking` → `result` → `exhausted`):
- **Intro**: shows any previous attempt history (score/percentage per attempt), a badge-earned banner if applicable, a summary card with all 5 category pills, and a "Start Quiz" / "Retake (Attempt N/3)" button plus a remaining-attempts count.
- **Taking**: a sticky progress header ("N of 30 answered · Attempt X/3", percentage, a green progress bar) above collapsible category sections — each category header shows an "answered/total" badge and can be expanded/collapsed independently (all expanded by default); each question shows lettered A–D choice buttons that highlight green when selected. A "Submit Quiz" button at the bottom warns how many questions are still unanswered (they count as incorrect) before submitting.
- **Result**: a trophy card showing score/total and percentage, colored green if passed (>50%) or red if not, with a per-category breakdown grid (score + percentage per category); a badge-earned banner if this was attempt #1 and score ≥90%; "Review Answers" (expands a full question-by-question breakdown showing every choice colored green for the correct answer and red for an incorrect selection) and "Retake" buttons.
- **Exhausted** (after 3 attempts used): a locked-state card showing the best score achieved and pass/fail status, plus the full attempt history.

Color language: green/emerald throughout (`#059669` primary, matching the deck's own green MBI804 accent), consistent with the Agile Scrum Deck it follows.

## 4. Component & state architecture

**`AgileScrumMcq`** (student component): on mount, reads `agileScrumMcqResults/{user.uid}` from Firestore; if the doc exists, hydrates `pastAttempts` (converting Firestore Timestamps to JS `Date`s) and `badgeEarned`, and starts in `'exhausted'` phase if `attempts.length >= 3`, otherwise `'intro'`. Local state: `answers` (question-id → selected choice index map), `score`, `showReview`, `expandedCategories` (per-category open/closed, all `true` initially). On submit (`handleSubmit`): computes `correct` by comparing `answers[q.id]` against each question's `correct` index, derives `pct`, determines `isFirstAttempt` and whether a badge is newly earned (`isFirstAttempt && pct >= 90`), computes `newBest` and `passed` (`newBest > 50`, strictly greater — not ≥), then either `setDoc`s a new Firestore document (first attempt — stores `studentUid`, `studentName`, `studentDisplayId`, `studentSection`, `studentCampus`, the single `attempts` array, `bestPercentage`, `badgeEarned`, `passed`, `attemptCount: 1`, `firstAttemptAt`/`lastAttemptAt` server timestamps) or `updateDoc`s with `arrayUnion` to append a new attempt on subsequent tries. If a badge is newly earned, also merges `{ agileScrumMcqBadge: true }` onto the student's own `students/{uid}` profile document — this is the field a badge-aggregating view elsewhere (e.g. the Skill Passport, documented separately) could read to display it. All Firestore writes are wrapped in a bare `try/catch` that silently continues on failure — the score is still shown locally to the student even if persistence fails.

**`AgileScrumMcqDashboard`** (staff component): a live `onSnapshot` query over the whole `agileScrumMcqResults` collection ordered by `lastAttemptAt` descending. Computes aggregate stats (total students attempted, average best score, pass count, badge count) and a 4-bucket score-distribution bar chart (0–49%, 50–69%, 70–89%, 90–100%). Renders a filterable (`filterText` matches name/ID/section/campus), sortable (by name/score/attempts/date, toggling asc/desc on repeated header click) table of every student's result, with an expandable per-row detail panel showing that student's full attempt history.

## 5. Rebuild notes

- Structurally near-identical to the other attempt-limited, first-attempt-badge quizzes on this platform (ER Knowledge Check, DBMS Knowledge Check) — same phase state machine, same `arrayUnion` attempt-accumulation pattern, same "first attempt only" badge-eligibility rule. If rebuilding one of this family, the others are a reliable reference for edge-case behavior.
- The pass threshold is a **strict** `>50`, not `>=50` — a student scoring exactly 50% (15/30) does not pass. This exact-boundary detail is easy to get wrong in a reimplementation and is asserted identically in both the student component (`newBest > AGILE_SCRUM_PASS_PERCENTAGE`) and the dashboard's per-row color logic.
- The badge-earned condition additionally requires `isFirstAttempt` — a student who scores 95% on their *second* attempt (e.g. after scoring low on attempt 1) does **not** retroactively earn the distinction badge. This is a deliberate design choice worth preserving.
- Firestore write failures are swallowed silently (score still displays locally) — acceptable for a low-stakes formative quiz, but means a student's genuine pass/badge could silently fail to persist; no retry or user-facing error state exists for this case.
- No question shuffling/randomization was found in the source — question and choice order is fixed and identical for every student and every attempt.
