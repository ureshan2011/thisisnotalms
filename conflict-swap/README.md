# Conflict Swap

A single self-contained `conflict-swap.html` for the MBI804 Project
Management classroom activity (Communication Management + Human
Resource/Conflict Management). No login, no build step — see the setup
comment at the top of `conflict-swap.html` for the one-time Firebase config
steps and the Firestore rules snippet (already mirrored into the repo's
root `firestore.rules` under `/conflictSwapSessions`).

## Try it locally (no Firebase needed)

`conflict-swap.html` ships with placeholder Firebase config values, so it
automatically runs in local demo mode (localStorage-backed fake backend).
Serve the folder over HTTP and open a few tabs — one as teacher, a few as
student:

```bash
cd conflict-swap
python3 -m http.server 8000
# then open http://localhost:8000/conflict-swap.html in multiple tabs
```

(Opening the file directly via `file://` also mostly works, but a real
origin via a static server is more representative of how `localStorage`/the
`storage` event behave across tabs.)

## Deploy

See the setup comment at the top of `conflict-swap.html` for the full
walkthrough. Short version, once your Firebase config and `.firebaserc` are
filled in:

```bash
firebase deploy --only hosting
```

The page is served at `/conflict-swap` on that Hosting site. This does not
touch the existing `attendanceSessions`, `students`, `users`, etc.
collections or rules — the Firestore rules addition is scoped only to
`/conflictSwapSessions`.

## Tests

`tests/` is a self-contained Playwright suite (its own `package.json`, not
wired into the root YooBees app) proving:

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

Run them:

```bash
cd conflict-swap/tests
npm install
npm test
```
