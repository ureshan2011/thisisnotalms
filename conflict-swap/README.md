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

## Tests

`tests/` is a self-contained Playwright suite (its own `package.json`, not
wired into the root YooBees build) that serves `public/conflict-swap.html`
directly and proves:

- **derangement.spec.js** — the shuffle/assign algorithm (Sattolo's
  algorithm, a random single-cycle permutation) never assigns a student
  their own submission, across thousands of randomized trials and sizes.
- **gating.spec.js** — the character-count gating actually disables/enables
  the submit buttons (conflict textarea at 350 chars, each of the 3 analysis
  fields at 50 chars), including a full two-student shuffle flow proving the
  live phase-change reactivity and that nobody is ever assigned their own
  conflict end-to-end.
- **caller.spec.js** — the teacher's random name caller never repeats a name
  until "Reset called list" (or "Reset everything") is used, and alerts once
  the whole roster has been called.

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
