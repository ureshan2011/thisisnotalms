# SQL Reels: UPDATE & DELETE — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/sql-reels`
- **Source files:**
  - `src/pages/SQLReelsPage.tsx` — the entire lesson: hero, comparison table, live
    WHERE-clause simulator, reels grid, tips grid, and quiz all live in this one file as
    local components (`Reveal`, `SectionHead`, `ComparisonTable`, `Simulator`, `Quiz`) plus
    the page-level default export `SQLReelsPage`.
  - `src/components/sql/InstagramReel.tsx` — the lazy-loaded, lite-embed Instagram Reel
    player used once per reel in the "reels" section.
- **Depends on:**
  - `src/components/ui/BrandMark.tsx` (logo mark in the sticky hero corner and footer)
  - `src/lib/useFeatureTracking.ts` — calls `useFeatureTracking('sql_reels_view')` on mount;
    this hook is currently a no-op stub ("Feature tracking is intentionally disabled to
    reduce Firebase usage") so no Firestore write actually happens.
  - `framer-motion` (`motion`, `useScroll`, `useTransform`, scroll-reveal `Variants`)
  - Four real Instagram Reels, embedded via `https://www.instagram.com/reel/<shortcode>/embed/captioned/`
    iframes, identified only by shortcode (see section 2 for the four shortcodes and their
    captions/titles). No local video/image assets are used — everything is Tailwind-styled
    DOM plus emoji.
  - No Firestore collections are read or written by this page.

## 1. Purpose & learning objectives

A single-page, Apple-styled interactive lesson teaching the two most dangerous SQL
statements — `UPDATE` and `DELETE` — through short comedic Instagram Reels, a live
"WHERE-clause simulator" students can run themselves, and a "Safe or Sus?" quiz. The
in-code comment describes it as: "A single-page, Apple-styled lesson that teaches the two
most dangerous SQL statements — UPDATE and DELETE — through funny Instagram reels and two
things students can try right here: a live WHERE-clause simulator and a 'Safe or Sus?'
quiz. Same look, feel and branding as the XR Explorer lesson."

The core learning objective, stated in the hero subtitle, is that students should never
again forget a `WHERE` clause: "One missing WHERE clause and your whole table is gone. In
this lesson you'll watch the funny reels, run a live query simulator, and play 'Safe or
Sus?' so you never make that mistake."

## 2. Full content

The page is a single continuous scroll (no slide deck / no tabs), divided into these
sections in order:

### Hero
- Top-left brand lockup: `BrandMark` icon + "Not a **LMS**" (LMS in blue `#0071e3`).
- Eyebrow: "An interactive lesson · Dr. Yasas Sri Wickramasinghe"
- Headline (two lines): "Let's make sense of" / "**UPDATE & DELETE.**" — the second line is
  rendered in a gradient (blue → purple → red: `#0071e3` → `#962fbf` → `#ff375f`).
- Subtitle: "One missing WHERE clause and your whole table is gone. In this lesson you'll
  watch the funny reels, run a live query simulator, and play 'Safe or Sus?' so you never
  make that mistake."
- Two CTAs: a filled button "Try the simulator" (scrolls to `#simulator`) and a text link
  "Watch the reels ›" (scrolls to `#reels`).
- Footer-of-hero microcopy: "Scroll to explore" (fades in after 1s, sits at the bottom of
  the viewport).
- The hero has a parallax scroll effect: as the user scrolls past it, the hero content
  scales down to 0.86, fades to opacity 0, and translates down 120px (`useScroll` +
  `useTransform` against `heroRef`).

### Section: "Two statements, one little safety net" (comparison)
- Eyebrow: "Start here"
- Title: "Two statements, one little safety net"
- Subtitle: "UPDATE changes rows; DELETE removes them. Both quietly hit every row in the
  table unless you add a WHERE clause to say which rows you mean. Here's the difference at
  a glance."
- **Comparison table** (`ComparisonTable`), 5 rows × 2 columns (UPDATE in blue `#0071e3`,
  DELETE in red `#ff375f`), transcribed in full:

  | Aspect | UPDATE | DELETE |
  |---|---|---|
  | What it does | Changes values in rows | Removes rows entirely |
  | Needs WHERE? | Yes — or every row changes | Yes — or every row is deleted |
  | Keyword to set values | SET column = value | — (no SET) |
  | Worst-case mistake | All rows overwritten | Whole table emptied |
  | Safety habit | SELECT first, then UPDATE | SELECT first, then DELETE |

- Two side-by-side cards, "Without WHERE" (💀, red-tinted) vs "With WHERE" (✅, green-tinted):
  - **Without WHERE** code block:
    ```sql
    DELETE FROM students;
    UPDATE students SET grade = 'F';
    ```
    Caption: "Hits **every single row**. Everyone fails. Everyone is deleted."
  - **With WHERE** code block:
    ```sql
    DELETE FROM students WHERE id = 3;
    UPDATE students SET grade = 'F'
     WHERE id = 3;
    ```
    Caption: "Only the rows you **target** change. Precise, predictable, sane."

### Section: "Toggle the WHERE clause and watch" (`id="simulator"`)
- Eyebrow: "Try it · live simulator"
- Title: "Toggle the WHERE clause and watch"
- Subtitle: "Pick UPDATE or DELETE, switch the WHERE clause on or off, then run it. See
  exactly what happens to the table — no real database is harmed."
- Contains the `Simulator` component (full interaction described in section 3/4 below). Its
  starting dataset (`INITIAL_ROWS`, a `users` table) is:

  | id | name | status |
  |---|---|---|
  | 1 | Aisha | active |
  | 2 | Ben | active |
  | 3 | Chen | active |
  | 4 | Diego | active |
  | 5 | Esha | active |

  Every simulated operation sets the target row's `status` to the literal string
  `'banned'`.

### Section: "SQL pain, turned into reels" (`id="reels"`)
- Eyebrow: "Watch · learn · laugh"
- Title: "SQL pain, turned into reels"
- Subtitle: "Real mistakes everyone makes once, made funny. Tap a reel to play it right
  here — it stays on this page."
- Four `InstagramReel` cards in a responsive grid (1 col mobile → 2 → 4 on large screens),
  each lazy-loaded behind `<Suspense>` with a `DemoFallback` ("Loading reel…") placeholder.
  The full `REELS` data array, transcribed exactly:

  | # | Shortcode | Title | Caption |
  |---|---|---|---|
  | 1 | `DUbBkrHD8Dy` | "When you forget the WHERE clause 💀" | "UPDATE gone wild." |
  | 2 | `DU3XLpljxxz` | "DELETE without WHERE be like…" | "The whole table is gone." |
  | 3 | `DY2jWvqv5FU` | "Running it straight in production" | "No backup, no problem? 😬" |
  | 4 | `DYkPRjsPSIc` | "WHERE clause = your best friend" | "Always target your rows." |

  Below the grid: "Reels load only when you press play, to keep the page fast on phones."

### Section: "Three habits that save your data"
- Eyebrow: "Keep them tame"
- Title: "Three habits that save your data"
- Subtitle: "Do these every time and you'll never empty a table by accident."
- Three cards, transcribed in full:
  1. 🔍 **SELECT before you change** — "Run a SELECT with the same WHERE first. If it
     returns the rows you expect, swap SELECT for UPDATE or DELETE."
  2. ⚠️ **Beware WHERE 1=1** — "A condition that is always true affects every row — the
     same as having no WHERE at all."
  3. ↩️ **Wrap it in a transaction** — "BEGIN, run your change, check it, then COMMIT if
     happy or ROLLBACK to undo. Your future self says thanks."

### Section: "Safe or Sus?" quiz
- Eyebrow: "Check yourself"
- Title: "Safe or Sus?"
- Subtitle: "Read each query and decide: would you really run it in production?"
- Contains the `Quiz` component. Full `QUIZ_CARDS` data (5 questions), transcribed exactly:

  1. Query: `DELETE FROM students;` — **Dangerous**. Explanation: "No WHERE clause — this
     wipes every student from the table. 🪦"
  2. Query: `UPDATE accounts SET balance = 0 WHERE id = 42;` — **Safe**. Explanation:
     "Targets exactly one row with a WHERE clause. Precise and safe."
  3. Query: `UPDATE products SET price = 9.99;` — **Dangerous**. Explanation: "Every single
     product is now $9.99 — the WHERE clause is missing!"
  4. Query: `DELETE FROM orders WHERE status = 'cancelled';` — **Safe**. Explanation: "Only
     cancelled orders are removed. The WHERE clause keeps it scoped."
  5. Query: `UPDATE users SET role = 'admin' WHERE 1 = 1;` — **Dangerous**. Explanation:
     "WHERE 1=1 is always true — so every user just became an admin. 😱"

  Answer buttons are always labelled "Safe ✅" / "Dangerous 💀" regardless of the question.
  End-of-quiz result copy (based on final score `score` out of 5):
  - Perfect score (5/5): emoji 🏆, message "Flawless — your tables are safe in your hands. 🛡️"
  - One wrong (4/5): emoji 🎯, message "So close to perfect. One more pass and you've got it."
  - Otherwise: emoji 📚, message "Good start. Re-watch the reels and play with the
    simulator, then try again."
  - "Try again" button resets `idx`, `answer`, `score`, `done`.

### Footer
- `BrandMark` + "Not a **LMS**" lockup.
- "An SQL lesson on UPDATE & DELETE, put together by **Dr. Yasas Sri Wickramasinghe**."
- "Everything here runs in your own browser. The simulator never touches a real database."

## 3. UI & interaction design

- **Visual style:** identical Apple-style design language to the XR Explorer lesson (per
  the in-code comment): the `APPLE_FONT` stack (`-apple-system, BlinkMacSystemFont, "SF Pro
  Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif`), white
  background, near-black text `#1d1d1f`, blue accent `#0071e3`, red/danger accent
  `#ff375f`/`#d70015`, green/safe accent `#30d158`/`#248a3d`, large rounded corners
  (`rounded-[28px]`/`rounded-3xl`), soft shadows, and blurred ambient color "orb" washes
  behind the hero (blue top-center, red bottom-right).
- **Navigation model:** single vertical scroll, no router state; in-page navigation is via
  `scrollToSection(id)`, which calls `document.getElementById(id)?.scrollIntoView({
  behavior: 'smooth', block: 'start' })` rather than `href="#..."` anchors — the app runs
  under a `HashRouter`, so real hash anchors would hijack routing.
- **Scroll-reveal animation:** a generic `Reveal` wrapper (`framer-motion`) fades+slides
  content up (`y: 48 → 0`, opacity 0→1, 0.8s, custom ease `[0.16,1,0.3,1]`) the first time
  it scrolls into view (`viewport={{ once: true, margin: '-80px' }}`). Grids of cards (danger/
  safe cards, tips cards) use a `stagger`/`item` Framer Motion variant pair for a 0.09s
  per-child stagger.
- **Hero parallax:** scroll-linked scale/opacity/translate on the hero content as described
  in section 2.
- **Simulator card layout:** two-column on large screens (`lg:grid-cols-2`) — left card has
  controls (operation toggle, WHERE toggle switch, target-row picker, generated query
  preview in a dark `pre` block, Run/Reset buttons, and a result banner); right card shows
  the live `users` table with row-level visual states (struck-through + faded red for
  deleted rows, blue-tinted for changed rows).
- **Reel cards:** `InstagramReel` shows a 9:16 aspect-ratio card with an Instagram-brand
  gradient poster (`linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)`),
  a white circular play button, a "Reel" chip (rounded-rect/circle Instagram-style icon)
  top-left, and the reel title overlaid bottom with a black gradient scrim. Tapping the
  poster swaps it for a live Instagram embed iframe (`/embed/captioned/`) that autoplays
  inline — the reel never navigates the student off the page.
- **Quiz card:** progress bar (`idx / QUIZ_CARDS.length` width, animated), a dark `pre`
  block showing the query text, two large answer buttons that change color after an answer
  is chosen (green ring on the correct option, red ring if the student's wrong pick differs
  from correct, greyed-out otherwise), and an explanation panel that fades in below.
- **Responsive behavior:** hero title scales from `text-[44px]` (mobile) to `text-[88px]`
  (large desktop); reels grid goes 1 → 2 → 4 columns; simulator grid goes 1 → 2 columns at
  `lg`; tips grid goes 1 → 3 columns at `sm`.

## 4. Component & state architecture

- **`SQLReelsPage`** (default export) — top-level page. Calls `useFeatureTracking('sql_reels_view')`
  (currently a no-op). Owns the `heroRef` and derived `useScroll`/`useTransform` values for
  the parallax hero. Renders all sections in a single JSX tree; no routing/query-param state.
- **`Reveal`** — presentational wrapper component, props `children`, `delay`, `y`,
  `className`; wraps `framer-motion`'s scroll-triggered `motion.div`.
- **`SectionHead`** — presentational, props `eyebrow`, `title`, `sub`, `dark`; renders the
  repeated eyebrow/title/subtitle pattern used by every section.
- **`DemoFallback`** — presentational loading placeholder for the lazy `InstagramReel`
  (`Suspense fallback`), sized to the reel's 9:16 aspect ratio.
- **`ComparisonTable`** — presentational, no props, renders the hardcoded `rows`/`head`
  arrays defined inline in the function body (see section 2 for the transcribed data).
- **`Simulator`** — the interactive component, local `useState`:
  - `rows: Row[]` (seeded from `INITIAL_ROWS`, each `{ id, name, status, deleted?, changed? }`)
  - `op: 'UPDATE' | 'DELETE'`
  - `useWhere: boolean` (default `true`)
  - `targetId: number` (default `3`)
  - `result: { msg: string; danger: boolean } | null`
  - `newValue` is a fixed constant `'banned'` (not state).
  - `query` is derived (not stored) from `op`/`useWhere`/`targetId`/`newValue` as a
    template string mimicking real SQL syntax.
  - `run()`: branches on `op` and `useWhere`. `DELETE` + `useWhere` marks only the
    `targetId` row `deleted: true` and sets a safe (`danger: false`) result message with the
    row count "1". `DELETE` without `useWhere` marks every row `deleted: true` and sets a
    `danger: true` message reporting how many were wiped (💥 emoji). `UPDATE` mirrors this
    logic but sets `status: newValue, changed: true` on the target (or all live rows) instead
    of deleting.
  - `reset()`: restores `rows` to `INITIAL_ROWS` and clears `result`.
  - No Firestore or persistence — purely local component state, reset on page reload.
- **`Quiz`** — the interactive component, local `useState`:
  - `idx: number` (current question index, default 0)
  - `answer: boolean | null` (the student's guess: `true` = dangerous, `false` = safe)
  - `score: number`
  - `done: boolean`
  - `choose(guessDangerous)`: no-ops if already answered; otherwise records the guess and
    increments `score` if it matches `card.dangerous`.
  - `next()`: advances `idx`, or sets `done = true` if on the last card.
  - `reset()`: zeroes all four state values to restart the quiz.
  - No Firestore/backend — score is not persisted or reported anywhere outside this
    component's own render (no badge, no leaderboard, no submission).
- **`InstagramReel`** (`src/components/sql/InstagramReel.tsx`) — props `shortcode: string`,
  `title: string`, `caption?: string`; local `useState<boolean>` `active` (default `false`).
  Renders the gradient poster + play button until `active` is set `true` (on click), then
  swaps in the Instagram embed `<iframe>`. Lazy-imported (`lazy(() =>
  import('../components/sql/InstagramReel'))`) in the page so its code doesn't ship in the
  main bundle.
- No Firestore reads/writes, no gating/unlock logic, and no badge-award triggers exist
  anywhere in this lesson — it is entirely client-side, stateless across reloads.

## 5. Rebuild notes

- The four Instagram Reel shortcodes (`DUbBkrHD8Dy`, `DU3XLpljxxz`, `DY2jWvqv5FU`,
  `DYkPRjsPSIc`) point to real, specific Instagram Reels on `instagram.com/reel/<shortcode>/`.
  These are external, third-party-hosted content the rebuild depends on continuing to exist
  and remain embeddable — they were not independently re-verified as part of writing this
  spec (this task only read the source code) and should be spot-checked for availability
  before a rebuild ships, since Instagram content can be deleted or embedding can be
  disabled by the poster.
  Their reference URLs would be `https://www.instagram.com/reel/DUbBkrHD8Dy/`,
  `https://www.instagram.com/reel/DU3XLpljxxz/`, `https://www.instagram.com/reel/DY2jWvqv5FU/`,
  `https://www.instagram.com/reel/DYkPRjsPSIc/` respectively.
- `useFeatureTracking` is a deliberate no-op stub today ("Feature tracking is intentionally
  disabled to reduce Firebase usage") — the call site (`useFeatureTracking('sql_reels_view')`)
  is dead code in its current form but is left in place, presumably so tracking can be
  re-enabled later without touching this page again.
- The page does not use `PublicLessonShell` (unlike `SQLCertificationsPage`) — it builds its
  own complete hero/nav/footer from scratch, matching the XR Explorer lesson's bespoke
  layout rather than the shared shell.
- No images/SVG/video assets are referenced from `public/` or `src/assets/` — all visuals
  are Tailwind gradients, emoji, and two small inline SVG icons (play glyph, Reels camera
  icon) in `InstagramReel.tsx`.
- `SQLReelsPage` is registered twice in `src/App.tsx` (once inside what appears to be an
  authenticated-shell route block, once in a public route block) at lines 103 and 187, both
  mapping `/sql-reels` to the same component — this is consistent with the route being
  reachable with no login per the README's public/non-gated definition.
