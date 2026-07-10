# Conflict Swap

A single self-contained page for the MBI804 Project Management classroom
activity (Communication Management + Human Resource/Conflict Management).
No login, no build step. The page itself lives at
[`public/conflict-swap.html`](../public/conflict-swap.html) — it ships as a
static asset with every push to `main`, exactly like `public/security-lab.html`,
via the existing "Build & Deploy to GitHub Pages" workflow. It's linked from
the homepage's lesson list and live at:

**https://ureshan2011.github.io/thisisnotalms/conflict-swap.html**

It already has YooBees' real Firebase project wired in (see the setup
comment at the top of the file), so it's a working, cross-device tool as
soon as it deploys — no manual Firebase CLI step needed. The Firestore rules
addition (scoped only to `/conflictSwapSessions`, so it can't touch any
other YooBees data) is mirrored into the repo's root `firestore.rules`.

## Running the activity as the teacher

1. **Open the page and unlock the teacher panel.** Pick any short class code
   (e.g. `FLUX`), write it on the board / paste it in the webinar chat, click
   **I'm the teacher**, and enter the instructor password (`adminadmin`).
   This is a client-side gate in a public static page — it keeps students out
   of the teacher controls, it is not real authentication.
2. **Share the class dashboard.** The "Class dashboard" card shows a
   read-only link (`conflict-swap.html?board=CODE`). Keep it on the projector
   or drop it in the webinar chat: it shows the timer, live submission and
   analysis counts with a progress bar, and the cold-call display — never any
   student text, so it needs no password.
3. **Start the session timer** (visual only; it never locks submissions).
4. **Writing phase.** Students join with the class code and write a real
   conflict (minimum 400 characters, with prompts to cover background,
   trigger, responses, and outcome). Watch the submission count climb.
5. **Shuffle & assign.** With at least 2 submissions, one click assigns every
   student someone *else's* conflict — never their own, guaranteed.
6. **Analysis phase.** Each student answers five structured questions (80+
   characters each): root cause, stakeholders and their stakes, the
   conflict-handling mode actually used, the mode that should have been used,
   and prevention from a project manager's seat. The Assignments card tracks
   completion by ticket, keeping students anonymous to each other.
7. **Review & give feedback.** Each finished analysis appears in the
   "Review analyses & give feedback" card — open one, read the conflict and
   all five answers, and send written feedback. It appears on that student's
   screen instantly, under their recap.
8. **Cold-call the discussion.** Paste your roster, then "Call someone" picks
   a random name with no repeats until you reset. The name also appears big
   on the shared dashboard ("Now presenting").
9. **Reset everything** (Danger zone) between class sections to reuse the code.

## Tests

`tests/` is a self-contained Playwright suite (its own `package.json`, not
wired into the root YooBees build) that serves `public/conflict-swap.html`
directly and proves:

- **derangement.spec.js** — the shuffle/assign algorithm (Sattolo's
  algorithm, a random single-cycle permutation) never assigns a student
  their own submission, across thousands of randomized trials and sizes.
- **gating.spec.js** — the character-count gating actually disables/enables
  the submit buttons (conflict textarea at 400 chars, each of the 5 analysis
  fields at 80 chars), including a full two-student shuffle flow proving the
  live phase-change reactivity and that nobody is ever assigned their own
  conflict end-to-end.
- **caller.spec.js** — the teacher's random name caller never repeats a name
  until "Reset called list" (or "Reset everything") is used, and alerts once
  the whole roster has been called.
- **access-and-feedback.spec.js** — the teacher panel's instructor-password
  gate rejects wrong passwords and opens on the right one; the shareable
  read-only class dashboard (`?board=CODE`) mirrors submissions, analyses,
  phase, and cold calls live; and instructor feedback written in the review
  card reaches the analyzing student's done screen without a reload.

The suite always appends `?localDemo=1` when loading the page, which forces
the local fake backend even though the real Firebase config is wired in —
this keeps tests fast, deterministic, and offline, and guarantees they never
write test data into the real production Firestore.

Run them:

```bash
cd conflict-swap/tests
npm install
npm test
```

## Try it locally without the test harness

```bash
cd public
python3 -m http.server 8000
# then open http://localhost:8000/conflict-swap.html?localDemo=1 in multiple tabs
# (one as teacher, a few as student) to exercise local demo mode by hand
```

Drop the `?localDemo=1` and it talks to the real production Firestore
instead — useful for a final end-to-end check, but treat it as real data.
