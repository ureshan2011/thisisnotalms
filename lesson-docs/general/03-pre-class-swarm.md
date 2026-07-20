# Pre-Class Idea Swarm — General

- **Subject:** General / cross-subject — a platform *tool*, not subject content. Its behaviour is
  entirely generic and parameterized by a selectable course code (MBI800/MBI802/MBI804); no
  single course's material is baked into the component itself beyond the word-list data it reads.
- **Gating:** Non-gated (public) route, but the page itself enforces its own client-side access
  password before showing anything (see below) — distinct from the platform's student/staff
  login.
- **Route(s):** `/pre-class`
- **Source files:**
  - `src/pages/PreClassSwarmPage.tsx` — the entire page: password gate, course selector, countdown
    state machine, top/bottom control bars, and the always-on-top clock/date/branding footer.
  - `src/components/preclass/SwarmCanvas.tsx` — the actual particle/word-cloud rendering engine: a
    single `<canvas>` driven by `requestAnimationFrame`, independent of the page's React state
    updates beyond the props it's given each render.
  - `src/lib/courseConcepts.ts` — the `COURSE_CONCEPTS` word-list data (one array per course code)
    that the swarm draws its floating words from.
  - `src/lib/courseTheme.ts` — shared `COURSES` config (name, accent colours, gradients) reused by
    this page and `ClassCountdownPage` (a separate lecturer-only tool, out of scope here), plus the
    `COURSE_CODES` and `pad2` helpers.
- **Depends on:** `lucide-react` icons (`ArrowLeft`, `Lock`, `Maximize2`, `Minimize2`, `RotateCcw`
  is imported but the reset button uses it too), `react-router-dom` (`useNavigate`),
  `src/components/ui/BrandMark.tsx`; the Fullscreen API; browser `sessionStorage` (key
  `preclass_unlocked`) for the page's own password gate; `window.matchMedia('(prefers-reduced-motion:
  reduce)')` for accessibility. No Firestore reads/writes anywhere — entirely client-side, no
  student data collected or stored.

## 1. Purpose & learning objectives

Not a teaching lesson — a **classroom icebreaker / ambient display tool** meant to be projected
before class formally starts. Its job is to fill "dead air" while students file in: it shows a
countdown to class start, and as the countdown reaches its final seconds, a swarm of drifting
course-vocabulary words visually assembles itself into the course code (e.g. "MBI802"), holds
there with a "Class is starting — let's begin" message, then re-scatters and loops. It's designed
to be generic across all three courses — a lecturer picks the course from a segmented control and
the same countdown/swarm mechanic re-themes itself (word list, accent colour, assembled text)
accordingly, which is why it belongs in `general/` rather than a single subject folder.

Secondary purpose: passive vocabulary priming — students waiting for class see course-specific
terms (e.g. "JOIN", "Normalization", "ACID" for MBI802) drifting past before the lecture even
starts.

## 2. Full content

This "lesson" has no slides or quiz; its content is the countdown/swarm mechanic itself plus the
per-course word palettes it draws from. Documented as a generic tool below, with the actual data
(`COURSE_CONCEPTS`) transcribed in full since that is the closest thing this page has to teaching
content.

### Access gate

Before anything else renders, the page shows a full-screen frosted-glass password prompt titled
"Pre-Class Display" with the subtext "Enter the access password to continue," a masked password
input, and a "Continue" button. The required password is **`notalms`** (case-insensitive,
compared via `value.trim().toLowerCase() === 'notalms'`); an incorrect attempt triggers a CSS
shake animation (`preclass-shake` class) on the form and clears the input after 600ms. On success,
`sessionStorage.setItem('preclass_unlocked', '1')` remembers the unlock for the browser session.

### Countdown / swarm state machine

Once unlocked, the display is a full-viewport (`position: fixed; inset: 0`) dark scene
(`#06070c` background) with an animated gradient mesh backdrop, an optional ambient background
video (`BG_VIDEO_URL`, currently left empty so the page always falls back to the gradient mesh —
"never breaks"), a darkening radial-gradient scrim for text legibility, and the particle swarm
canvas layered on top.

The countdown target (`targetTs`) starts as `null` ("Pick a start time below…"). Four presets set
it: **5 min**, **10 min**, **15 min** (from now), or **Top of hour** (next `:00`). Once a target is
set, the page derives a `phase` from how much time remains, re-evaluated every 250ms:

- **`drift`** (`remaining > 10s`) — words float freely in a gentle ambient galaxy; the countdown
  timer (`MM:SS`) is shown at full opacity.
- **`gather`** (`0 < remaining ≤ 10s`, the `GATHER_MS` window) — particles begin easing toward
  positions that spell out the course code; countdown timer opacity fades out as `gatherProgress`
  (0→1) increases.
- **`burst`** (`0 ≤ elapsed < 1.2s` after zero, `BURST_MS`) — a radial white flash plus an
  outward "impulse" that flings every particle away from center before the pull-back toward its
  assembled-letter target resumes; "Class is starting — let's begin" fades in.
  "Class is starting — let's begin" fades in.
- **`hold`** (`1.2s ≤ elapsed < 7.2s`, i.e. `BURST_MS` + `HOLD_MS` = 6s hold) — the course code
  stays fully assembled and glowing; the "starting" message stays visible.
- **`restart`** (`elapsed ≥ 7.2s`) — particles re-scatter outward with random velocities before
  returning to `drift`; simultaneously the page automatically re-arms the countdown for
  `LOOP_RESET_MIN` = 5 minutes later, so an unattended display loops indefinitely.

Bottom bar shows a live clock (`h:mm AM/PM`, New Zealand locale `en-NZ`) and full date (e.g.
"Monday, July 20"), the four time presets, a Reset button (clears `targetTs` back to `null`), and
a "Yasas Sri Wickramasinghe / Not a **LMS**" brand signature with `BrandMark`. Top bar shows a
"Home" back button (navigates to `/home`), a segmented MBI800/MBI802/MBI804 course switcher, and
(outside fullscreen) a "Full Screen" toggle. In fullscreen, both bars auto-hide after 4.5 seconds
of mouse inactivity and reappear on mouse movement.

### Per-course word palettes (`COURSE_CONCEPTS`, `src/lib/courseConcepts.ts`)

Full transcription of all three word lists (each 1–2 word glossary terms, chosen short so the
word-sprites stay legible at small canvas sizes; per the file's own header comment: "No student
data — just course vocabulary"):

**MBI800 — Strategic Information System Planning** (24 terms): Strategy, Value Chain, SWOT,
Porter's 5, Alignment, Governance, Roadmap, Stakeholders, BPR, Digital, Capability, KPI,
Outsourcing, ROI, Disruption, Vision, Competitive Edge, IS Strategy, Innovation, Agility, Business
Case, Portfolio, Maturity, Transformation.

**MBI802 — Database Management Systems** (24 terms): SELECT, JOIN, Normalization, Primary Key,
Foreign Key, Index, Transaction, ACID, Schema, ER Model, Aggregate, GROUP BY, Subquery, Trigger,
View, WHERE, Constraint, Relation, Tuple, Cardinality, Query Plan, Concurrency, Rollback, Entity.

**MBI804 — IT Project Management** (24 terms): Scope, Gantt, Agile, Scrum, Sprint, Risk,
Stakeholder, Milestone, Budget, WBS, Critical Path, Kanban, Backlog, Charter, Deliverable,
Velocity, Baseline, Retrospective, Triple Constraint, Resource, Quality, Procurement, Lessons
Learned, Standup.

`getConcepts(code)` simply returns `COURSE_CONCEPTS[code]`.

### Per-course theming (`COURSES`, `src/lib/courseTheme.ts`)

Shared with `ClassCountdownPage` (a separate lecturer-facing tool, out of scope for this doc).
Each `CourseConfig` entry provides: `code`, `name` (full course title), `label` (short badge, e.g.
"DBMS"), `accent`/`accentLight`/`accentGlow` (hex/rgba colours), a `textGradient` CSS gradient, and
three `orbColor` values. Values:

- **MBI800**: name "Strategic Information System Planning", label "BIS", accent `#f59e0b`
  (amber).
- **MBI802**: name "Database Management Systems", label "DBMS", accent `#8b5cf6` (violet).
- **MBI804**: name "IT Project Management", label "ITPM", accent `#0ea5e9` (sky blue).

`PreClassSwarmPage` additionally defines its own **`COURSE_PALETTES`** (bright, high-contrast word
tint arrays distinct from the theme accent, used for the drifting word sprites so they read
clearly against the dark backdrop):
- MBI800: `['#ffffff', '#fde68a', '#fbbf24', '#fcd34d', '#fef3c7']` (white/amber tints)
- MBI802: `['#ffffff', '#ddd6fe', '#c4b5fd', '#a78bfa', '#e9d5ff']` (white/violet tints)
- MBI804: `['#ffffff', '#bae6fd', '#7dd3fc', '#38bdf8', '#e0f2fe']` (white/sky tints)

`courseTheme.ts` also exports a `seededRand(seed, salt)` deterministic pseudo-random helper and a
`pad2(n)` zero-pad helper; `pad2` is used for the swarm's clock/countdown digits, `seededRand` is
not used by this page (it's consumed elsewhere, e.g. `ClassCountdownPage`).

## 3. UI & interaction design

- **Apple-style dark UI**: `-apple-system`/SF Pro font stack, `#06070c` base background, frosted
  ("glass") UI chrome (`background: rgba(255,255,255,0.08)`, `backdrop-filter: blur(24px)`) for
  every button/pill/segmented-control, fully-rounded pill buttons (`border-radius: 980px`, the
  classic Apple "pill" radius trick).
- **`GradientMesh`** background: four large blurred radial-gradient blobs (`blur(80px)`) using the
  active course's accent colours plus a fixed blue (`#0a84ff`), each independently animated with a
  slow `float` keyframe (13–21s loops, staggered delays) for an ambient, non-repeating drift.
  A darkening radial scrim sits above it for text legibility, and an optional looping muted
  background `<video>` can be layered in via `BG_VIDEO_URL` (currently unset).
- **Swarm canvas** (`SwarmCanvas`, see section 4 for engine detail) sits above the mesh, below the
  UI chrome; it fills the full viewport and redraws every animation frame.
- **Countdown typography**: large tabular-nums monospaced-feel digits (`clamp(80px,13vw,168px)`,
  `font-variant-numeric: tabular-nums`) so `MM:SS` doesn't jitter in width as digits change; course
  name and code shown above it, "Class is starting — let's begin" fades in below once the burst/
  hold phase starts.
  All center-content text is `pointer-events: none` so it never blocks interaction with the
  underlying canvas or UI bars.
- **Top/bottom control bars** auto-hide only in fullscreen mode (opacity + `translateY` transition,
  0.5s ease), keeping the display clean for projection while still reachable via mouse movement.
- **Accessibility**: respects `prefers-reduced-motion` — when active, the swarm canvas skips all
  drift/gather/burst physics and simply snaps particles directly to their target positions with no
  animation.
- **Segmented course switcher**: pill-shaped tri-state control (MBI800/MBI802/MBI804), active
  option shown as a solid white pill with dark text, inactive options are transparent with dimmed
  white text.

## 4. Component & state architecture

- **`PreClassSwarmPage` (default export)** — state: `unlocked` (from `sessionStorage`),
  `selectedCourse` (`CourseCode`, default `'MBI802'`), `now` (ticks every 250ms via `setInterval`),
  `targetTs` (`number | null`, the countdown target epoch ms), `isFullscreen`, `controlsVisible`,
  `reducedMotion` (synced to the `prefers-reduced-motion` media query). Refs: `containerRef` (for
  the Fullscreen API target), `hideTimerRef` (auto-hide timer for controls in fullscreen).
  All `phase`/`gatherProgress`/`remainingMs`/formatted clock strings are derived synchronously on
  every render from `now` and `targetTs` — no separate state for phase; a `useEffect` watches
  `now`/`targetTs` only to auto-re-arm the countdown once the hold window ends (looping behaviour).
- **`PasswordGate`** — local `value`/`error` state; on correct password calls the parent's
  `onUnlock` callback and writes to `sessionStorage`; on failure, sets `error` for 600ms (drives
  the CSS shake class) and clears the input.
- **`GradientMesh`** — presentational, takes the active course's `CourseConfig` and renders four
  animated blurred blobs.
- **`SwarmCanvas` (`src/components/preclass/SwarmCanvas.tsx`)** — self-contained canvas rendering
  engine, decoupled from React re-renders via refs so the animation loop never restarts when props
  change:
  - Props: `words: string[]`, `palette: string[]`, `accent: string`, `targetText: string` (the
    course code to assemble), `phase: SwarmPhase`, `gatherProgress: number`, `reducedMotion:
    boolean`.
  - `SwarmPhase` union: `'drift' | 'gather' | 'burst' | 'hold' | 'restart'`.
  - **Sprites**: each word is pre-rendered once to an offscreen `<canvas>` (`buildSprites()`) with
    a coloured glow + dark outline + crisp fill, so the main draw loop just blits bitmaps instead
    of calling `fillText` per frame per particle — a performance optimization for up to
    `MAX_PARTICLES = 240` particles at 60fps.
  - **Particles**: each has position (`x,y`), velocity (`vx,vy`), a target (`tx,ty` +
    `hasTarget`), which word-sprite index it displays (`wordIndex`), a random `scale`, a base
    alpha, and independent twinkle phase/speed for a subtle shimmer. Particle count is
    `min(240, max(wordCount, (width*height)/14000))` — scales with viewport size.
  - **Target computation** (`computeTargets()`): renders the course code text to an offscreen
    canvas at up to ~82% of viewport width, then samples every 7th pixel of the alpha channel to
    build a point cloud of "letter-shaped" target coordinates; `assignTargets()` shuffles and
    distributes these points across the particle pool (down-sampling if there are more points than
    particles).
  - **Physics per phase**: `drift` uses a cheap sinusoidal flow-field plus a gentle pull toward
    viewport center, wrapping particles that drift off-edge; `gather`/`hold` ease particles toward
    their assigned target point with an eased interpolation factor that tightens as
    `gatherProgress` approaches 1 (plus shrinking jitter); `burst` gives every particle an initial
    outward radial impulse (`impulseOutward()`) then damps velocity while pulling back toward the
    target, producing a "flash and settle" effect; `restart`/re-entering `drift` calls `scatter()`
    to give every particle a fresh random outward velocity.
  - Redraws are skipped (`cancelAnimationFrame`) when the tab is hidden (`visibilitychange`
    listener) to save battery/CPU, and resume on visibility return.
  - A `ResizeObserver` (debounced 150ms) rebuilds sprites and re-scales existing particle positions
    proportionally on container resize, without a full re-init.

## 5. Rebuild notes

- **This is infrastructure, not content** — a faithful rebuild depends more on getting the state
  machine (`drift → gather → burst → hold → restart → drift`) and the canvas physics right than on
  any "teaching content," since there is none beyond the word lists.
- **Two independent constants gate different things**: `ACCESS_PASSWORD = 'notalms'` gates the
  whole page (client-side only, `sessionStorage`-remembered); this is unrelated to platform
  student/staff login, which this route does not use at all — `/pre-class` has no `ProtectedRoute`
  wrapper in `App.tsx`.
- **`BG_VIDEO_URL` is currently an empty string** — the code path for an ambient background video
  exists and is fully wired (`<video autoPlay muted loop playsInline>`), but is unused; a
  rebuilder should preserve the fallback-to-gradient-mesh behavior described in the source comment
  ("never breaks") if re-enabling it.
- **Auto-loop behavior** (`LOOP_RESET_MIN = 5`) means an unattended fullscreen display will keep
  automatically re-arming itself to 5 minutes out indefinitely once a countdown has been started
  and completes its hold phase — worth flagging since it's easy to miss reading the effect that
  does this (`if (now - targetTs >= BURST_MS + HOLD_MS) setTargetTs(Date.now() + LOOP_RESET_MIN *
  60_000)`).
- No external links, images, or video assets are referenced by default (video URL is empty); no
  Firestore collections; nothing here needs revalidation beyond re-confirming the `notalms`
  password is still the one lecturers hand out for classroom display.
- `courseTheme.ts`'s `seededRand` helper is exported and available but genuinely unused by this
  page — it's shared infrastructure for `ClassCountdownPage`, not dead code specific to this
  lesson.
