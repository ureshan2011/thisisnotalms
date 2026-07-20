# Conflict Swap — MBI804

- **Subject:** MBI804 — IT Project Management. Explicit — page title "Conflict Swap — MBI804 Classroom Activity", on-page subtitle "MBI804 · Communication & Conflict Management", and `conflict-swap/README.md`'s first line: "A single self-contained page for the MBI804 Project Management classroom activity (Communication Management + Human Resource/Conflict Management)."
- **Gating:** Non-gated (public static page), with a lightweight **client-side-only** teacher gate. There is no student login of any kind. The teacher panel sits behind a hardcoded instructor password (`adminadmin`) checked entirely in browser JavaScript — explicitly documented in the source as "not real auth," whose only job is to keep students from wandering into teacher controls, not to withstand a determined attacker. The read-only "class dashboard" view (`?board=CODE`) needs no password at all because it never displays student-authored text.
- **Route(s):** Not part of the React Router app at all — it is a static file served directly. Live at `public/conflict-swap.html`, deployed verbatim to `https://ureshan2011.github.io/thisisnotalms/conflict-swap.html` via the existing "Build & Deploy to GitHub Pages" workflow (same mechanism as `public/security-lab.html`). Linked from the homepage's lesson list. Supports two query-string variants: `?board=CODE` (read-only dashboard) and `?localDemo=1` (forces local fake-backend mode, used only by the automated test suite).
- **Source files:**
  - `public/conflict-swap.html` — the entire tool: markup, CSS, and vanilla JS (no framework, no build step), ~1611 lines
  - `conflict-swap/README.md` — deployment/usage documentation (not shipped to users)
  - `conflict-swap/tests/*.spec.js` — a self-contained Playwright suite (own `package.json`, not wired into the root Vite build) covering the derangement algorithm, char-count gating, the no-repeat random caller, the teacher password gate + live dashboard mirroring, and CSV export
  - `firestore.rules` — root repo file, contains a rules block scoped only to `/conflictSwapSessions` (see Section 4)
- **Depends on:** Firebase compat SDK v10 (`firebase-app-compat.js`, `firebase-firestore-compat.js`) loaded from `gstatic.com` CDN — the only external dependency. Google Fonts (`Inter`). No React, no build tooling, no npm packages at runtime. Firestore collection `conflictSwapSessions` (see Section 4) in the same "yoobees" Firebase project every other page on the site uses, scoped by security rules so it can't touch any other data.

## 1. Purpose & learning objectives

A live, no-login classroom exercise for the PMI Project Management framework's Communication Management and Human Resource/Conflict Management knowledge areas. Students anonymously write a real conflict they personally experienced (work, university, family, a team project — "anything real"), the tool shuffles submissions so nobody ever reviews their own story, and each student then analyzes a stranger's conflict cold through five structured questions: root cause, stakeholders and their stakes, which Thomas-Kilmann conflict-handling mode was actually used, which mode should have been used, and what a project manager could have done to prevent it. The teacher can cold-call students to discuss their assigned conflict (since it isn't their own story, they can speak candidly), review every analysis and send written feedback that appears live on the student's screen, and export the whole session to CSV. This is the practical/interactive companion to the theory lecture "The Collaboration Reflex" (documented separately, `04-collaboration-reflex-lecture.md`), which was itself built from 45 real anonymized submissions gathered through an earlier run of this same activity.

## 2. Full content

### Landing screen
- Header: "Conflict Swap" / "MBI804 · Communication & Conflict Management"
- "Join a session" card: a class-code text input (max 8 chars, e.g. "FLUX"), two buttons — "I'm the teacher" (reveals a password field) and "I'm a student" — plus a link "Open the shared class dashboard →" and a note describing which backend mode is active (local demo vs. connected to Firestore).

### Teacher panel (password-gated)
Cards, top to bottom:
1. **Header** — big class code display, "change code" link.
2. **Class dashboard** — explains the read-only projector/webinar-chat view, shows the shareable link (`conflict-swap.html?board=CODE`), "Copy link" / "Open dashboard" buttons.
3. **Session timer** — a 60:00 countdown ("Start session" button); explicitly described as visual only, it never locks submissions.
4. **Live progress** — submission count, analyses-done count, a progress bar, and a "Shuffle & assign" button (needs ≥2 submissions; copy: "Every student gets someone else's conflict — never their own").
5. **Assignments** — a table of conflict ticket → assigned-to ticket → analysis status ("Done"/"Pending"), explicitly using anonymous 4-character tickets rather than names so students stay anonymous to each other while the teacher can verify the shuffle worked.
6. **Export session data** — "Download CSV" button; copy: "Downloads every submitted conflict, who it was swapped to, all five analysis answers, and any feedback you've sent — one row per conflict. Handy for handing the whole session to an LLM for further analysis."
7. **Review analyses & give feedback** — expandable cards, one per finished analysis, each showing the original conflict text, all five Q&A pairs, and a feedback textarea + "Send feedback" button.
8. **Roster & cold-calling** — a textarea to paste student names (one per line or comma-separated), "Save roster" button + saved-count, a big "called name" display, "Call someone" / "Reset called list" buttons, and a called-progress counter (e.g. "12 / 30 called").
9. **Danger zone** (collapsed `<details>`) — "Reset everything for this code," which wipes all submissions/analyses and resets phase/roster/called-list so the code can be reused between class sections.

### Student flow (four screens, one at a time)
1. **Write form** ("Step 1 of 2"): "Describe a real conflict you've experienced" — prompt: "Work, university, a team project, family — anything real. A strong write-up covers all four of these: (1) the background and the people involved (no real names), (2) what triggered the conflict, (3) how each side actually responded, and (4) how it ended, or where it stands now. Minimum 400 characters — a classmate has to be able to analyze this without asking you anything." A live character counter (turns from "warn" amber to "confirm" green style at 400) gates the "Submit anonymously" button.
2. **Waiting screen** (after submitting, before shuffle): shows the student's own anonymous 4-character ticket and the message "When everyone has submitted, your instructor will assign you a classmate's conflict to analyze. This screen updates automatically — keep it open."
3. **Analysis form** ("Step 2 of 2", shown once shuffled and this student has an assignment): displays the assigned conflict text verbatim, then five textareas each gated at a minimum 80 characters, with these exact prompts:
   1. "What is the root cause of this conflict? Look past the surface disagreement to what actually drives it."
   2. "Who are the stakeholders in this conflict, and what does each of them stand to lose?"
   3. "Which conflict-handling mode was actually used? Point to the specific behaviour that tells you."
   4. "Which mode should have been used instead, and why would it have produced a better outcome?"
   5. "If you were the project manager, which communication practices would have prevented this conflict? Name concrete practices, not 'communicate better'."
   "Submit analysis" button, disabled until all five fields clear 80 characters each.
4. **Done screen**: recaps all five answers the student wrote, plus (if the teacher has sent one) an "Instructor feedback" box; otherwise a placeholder note that feedback may still arrive and will appear automatically. Copy: "Be ready to walk the class through this scenario if your name is called — it isn't your own story, so you can speak freely."
5. **No-assignment edge case**: shown if the phase is already "shuffled" but this particular browser/anonId has no assignment (typically because the student joined after the shuffle ran) — tells them to notify the instructor for a manual pairing.

### Shared class dashboard (`?board=CODE`, read-only, no password)
Three cards: class code + a phase pill ("Writing phase" / "Analysis phase"), a live countdown timer, a progress card (submissions count, analyses-done count, percentage bar), and a "Now presenting" card showing the last-called name in large text with a pop animation. It intentionally never renders any submitted conflict text or analysis answers — only counts, the timer, and roster names the teacher has already called aloud.

## 3. UI & interaction design

Visual language deliberately matches the rest of the site's "Apple-style" public lessons (explicitly noted in a source comment as matching `HomePage.tsx` / `CostManagementPage.tsx`): system font stack, `--ink`/`--muted`/`--accent` (#0071e3 blue) CSS custom properties, 20px-radius cards with soft shadows, pill buttons. Single-column mobile-first layout, `max-width: 720px` centered wrapper. All screens are shown/hidden by toggling a `.hidden` class on top-level `<div>` containers (`landing`, `teacherView`, `studentView`, `boardView`) rather than any client-side router. Live-updating numbers (timer, called-name display) use a small CSS "pop" keyframe animation (scale 0.6→1.12→1) restarted by forcing a reflow (`void display.offsetWidth`) before re-adding the class. Character counters flip between an amber "warn" state and a green "confirm" state as the student clears the minimum length. The teacher's roster textarea deliberately does not re-render while it has focus (`document.activeElement` check) so a Firestore snapshot mid-typing can't wipe an in-progress paste — the same "don't rebuild while focused" pattern is applied to the feedback-review list.

## 4. Component & state architecture

This is vanilla JS (an IIFE, `'use strict'`), not React — no component tree. It has a **swappable backend abstraction** (`Backend`) with two implementations sharing one interface (`getSession`, `onSession`, `saveSession`, `onAllSubmissions`, `onMySubmission`, `addSubmission`, `applyAssignments`, `updateSubmissionAnalysis`, `updateSubmissionFeedback`, `wipeSession`):

- **`makeFirestoreBackend()`** — real backend, used whenever `firebaseConfig` has no `PASTE_YOUR_*` placeholder values. Firestore layout: `conflictSwapSessions/{classCode}` (session doc: `phase`, `startedAt`, `roster`, `calledNames`, `lastCalled`) with a subcollection `submissions/{submissionId}` (each doc: `anonId`, `text`, `ticket`, `createdAt`, `assignedTo`, `analysis`, `feedback`, `feedbackAt`). `onMySubmission` combines **two** live Firestore queries (`where('assignedTo','==',anonId)` and `where('anonId','==',anonId)`) because a single query on `assignedTo` would never notice a student's own just-submitted doc (that field stays `null` for everyone during the writing phase) — documented explicitly in the source as the reason for the two-listener design.
- **`makeLocalBackend()`** — a `localStorage`-backed fake with an identical interface, auto-selected whenever the Firebase config still contains a placeholder, or forced via `?localDemo=1` (used by the Playwright suite so it never touches production data). Cross-tab reactivity is achieved by listening to the native `storage` event (which only fires in *other* tabs) plus an in-memory listener registry for same-tab immediate updates.

Firebase project config (`apiKey`, `projectId: "yoobees"`, etc.) is hardcoded in the file — explicitly documented as not a secret (any Firebase web config ships in every client bundle), with access control entirely delegated to Firestore security rules. The relevant rules block (already mirrored into the repo's root `firestore.rules`):
```
match /conflictSwapSessions/{code} {
  allow read, write: if true;
  match /submissions/{submissionId} {
    allow read, write: if true;
  }
}
```
Open read/write is intentional (there's no auth in this tool at all — the class code is the only scoping mechanism) but narrowed to exactly one collection tree so it can't touch attendance/quiz/any other YooBees data in the same Firebase project.

**Anonymous identity** (`getAnonId()`): a random ID stored in `sessionStorage` (not `localStorage`) — deliberately per-tab, so multiple simulated "students" can be opened in separate tabs of the same browser for solo demoing/testing without collapsing into one identity, while still surviving a reload of the same tab.

**Shuffle algorithm** (`computeDerangement(n)` + `assignSubmissions(submissions)`): implements **Sattolo's algorithm**, which produces a uniformly random permutation that is guaranteed to be a single n-cycle — and a single n-cycle has zero fixed points by construction, which is exactly the "nobody reviews their own submission" guarantee the activity needs. Verified by `conflict-swap/tests/derangement.spec.js` across thousands of randomized trials.

**CSV export** (`buildSessionCsv`): one row per submitted conflict with columns `class_code, conflict_ticket, submitted_at, conflict_text, reviewer_ticket, analyzed_at, root_cause, stakeholders, mode_used, better_mode, prevention, feedback, feedback_at`; fields are RFC 4180-escaped (`csvField`) and the file is prefixed with a UTF-8 BOM so Excel doesn't mangle non-ASCII text.

**Teacher gate**: `TEACHER_PASSWORD = 'adminadmin'` compared client-side in `tryTeacherLogin()`; on success, `sessionStorage` is flagged (`cs_teacher_ok`) so a page reload can silently restore the teacher view — but only if that flag was set in *this* tab, so a saved "teacher" role is never silently restored without the password having been entered in that session.

## 5. Rebuild notes

- Everything needed to reproduce this exactly is inline in one file — there is no separate stylesheet, template, or build step to lose. A rebuild is essentially "copy the file," but if reimplementing from scratch: preserve the Sattolo's-algorithm derangement (a naive Fisher-Yates shuffle does **not** guarantee zero fixed points and would occasionally assign a student their own conflict).
- The `TEACHER_PASSWORD` is plaintext in a public static file by design (documented in-source as intentional, not a bug) — a real security boundary would require moving teacher actions behind a real backend/auth, which the source comments explicitly call out as unnecessary for this tool's threat model.
- `window.ConflictSwapInternal` exposes pure functions (`computeDerangement`, `assignSubmissions`, `pickRandomUncalled`, `parseRoster`, `buildSessionCsv`, `csvField`, plus the length constants and `USE_LOCAL_DEMO`/`getAnonId`) purely as Playwright test hooks — keep this export if porting, since the test suite depends on it directly rather than driving the UI for logic-level assertions.
- The Playwright test suite (`conflict-swap/tests/`) is a genuinely useful spec of expected behavior beyond what's described here: `gating.spec.js` walks a full two-student shuffle end-to-end, `access-and-feedback.spec.js` proves the board mirrors state live and feedback reaches the student without a reload, `caller.spec.js` proves the no-repeat caller. Worth reading directly before any reimplementation.
- Deployment is coupled to the "Build & Deploy to GitHub Pages" workflow being for `public/**` static passthrough — if that pipeline changes, this page's deployment story needs revisiting.
- No accessibility notes were found in-source beyond semantic `<label for>`/`<input>` pairing; screen-reader behavior of the live-updating dashboard/timer was not verified.
