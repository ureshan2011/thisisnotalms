# Immersive Realities (XR Explorer) — MBI800

- **Subject:** MBI800 — Strategic Information Systems Planning (matches the platform's own
  inventory listing — see `lesson-docs/README.md` §"MBI800 — Strategic Information Systems",
  item 4 — and the page is signed by the same instructor, Dr. Yasas Sri Wickramasinghe, as
  the other MBI800 public lessons).
- **Gating:** Non-gated (public) only. There is no gated copy of this lesson — `XRExplorerPage`
  does not appear anywhere in `src/pages/student/CourseResources.tsx`'s MBI800 lesson list, so
  it is unreachable through the gated Course Resources hub. The only way to it is the public
  route.
- **Route(s):** `/xr-explorer`
- **Source files:**
  - `src/pages/XRExplorerPage.tsx` (616 lines — the page shell, plus a large amount of inline
    content: hero, Reality–Virtuality spectrum slider, three-pillar cards, comparison table,
    use-case grid, quiz, and the four `YouTubeEmbed` placements)
  - `src/components/xr/ARDemo.tsx` (372 lines — live camera AR demo)
  - `src/components/xr/DevicesAndTools.tsx` (248 lines — device gallery + dev-tools/setup grid)
  - `src/components/xr/GyroVRScene.tsx` (288 lines — gyroscope-driven 3D solar-system VR demo)
  - `src/components/xr/ISUseCases.tsx` (388 lines — six illustrated "XR in Information
    Systems" case studies)
  - `src/components/xr/YouTubeEmbed.tsx` (58 lines — lazy-loading YouTube facade)
  - `src/components/xr/useDeviceOrientation.ts` (104 lines — gyroscope/device-orientation
    hook + quaternion math, shared by ARDemo and GyroVRScene)
- **Depends on:**
  - `src/components/ui/BrandMark.tsx` (header/footer logo)
  - `framer-motion` (`motion`, `useScroll`, `useTransform`, `Variants`) for all scroll-reveal
    and stagger animation throughout the page and its sub-components
  - `@react-three/fiber` (`Canvas`, `useThree`, `useFrame`) and `@react-three/drei` (`Stars`)
    for the two WebGL demos
  - `three` (`THREE.*`: `Raycaster`, `Vector2`, `Vector3`, `Quaternion`, `Euler`,
    `StereoCamera`, geometries/materials) as the underlying 3D math/rendering library
  - Browser APIs: `navigator.mediaDevices.getUserMedia` (rear camera, ARDemo),
    `DeviceOrientationEvent` / `DeviceOrientationEvent.requestPermission` (iOS 13+ gyroscope
    permission, both demos), `document.requestFullscreen` (GyroVRScene "Fullscreen" button)
  - External image/CDN: `https://cdn.simpleicons.org/<slug>` for brand logos in
    `DevicesAndTools.tsx` (with a monogram-initials fallback on load error)
  - YouTube: `https://www.youtube-nocookie.com/embed/<id>` (lazy iframe) and
    `https://i.ytimg.com/vi/<id>/hqdefault.jpg` (thumbnail), both in `YouTubeEmbed.tsx`
  - No Firestore reads/writes anywhere in this lesson — it is entirely client-side/stateless
    between visits. No scoring is persisted; the quiz score lives only in local component state.
  - Routing note: the page is registered **twice** in `src/App.tsx` — once in the normal
    `AppRoutes()` function (line 95, `<Route path="/xr-explorer" element={<XRExplorerPage />} />`)
    and again identically in `ShutdownRoutes()` (line 180), the route tree used when
    `PLATFORM_ACTIVE` is false. Unlike every other page in `AppRoutes()`, `XRExplorerPage` is
    imported eagerly at the top of `App.tsx` (`import XRExplorerPage from './pages/XRExplorerPage';`,
    not `lazy(() => import(...))`), and it is one of the handful of lessons that stay reachable
    even when the rest of the platform is shut down.

## 1. Purpose & learning objectives

This is a single, long scroll-through lesson that teaches the difference between Augmented
Reality, Virtual Reality and Mixed Reality (collectively "Extended Reality" / XR), and then
connects that vocabulary to real business/Information-Systems use. The hero framing states the
intent directly: "Let's make sense of Extended Reality," with the subhead promising a
walkthrough of "AR, VR and Mixed Reality, one step at a time," plus two try-it-yourself demos —
"a camera AR demo and a VR world you steer by moving your phone. No headset needed."

Learning objectives implied by the page's structure and content, in order:
1. Understand XR as one continuum (Milgram's reality–virtuality continuum) rather than three
   unrelated buzzwords, and be able to place Physical Reality, AR, MR, Augmented Virtuality and
   VR along it.
2. Be able to define AR, VR and MR individually and distinguish them on concrete axes (is the
   real world visible, are digital objects overlaid vs. everything vs. anchored, does it
   interact with real space, typical device, real examples) — this is exactly the
   `ComparisonTable` rubric.
3. Experience AR and VR first-hand in the browser: place anchored 3D objects into your own room
   via the phone camera (`ARDemo`), and look around a 3D scene using either mouse-drag or the
   phone's gyroscope, including a stereo "Cardboard" split-view (`GyroVRScene`).
4. Recognize XR in the wild through familiar, non-technical examples (Pokémon GO, IKEA Place,
   Meta Quest, HoloLens) and across six general-purpose fields (medicine, architecture,
   education, shopping, manufacturing, games).
5. As an Information Systems student specifically, connect XR to business/IS concepts: immersive
   analytics, digital twins, AR-guided warehouse picking, collaborative virtual workspaces
   ("industrial metaverse"), AR-guided field service/repair, and spatial computing dashboards —
   each paired with a market-size or adoption statistic.
6. Know what devices exist (Vision Pro, Quest 3, HoloLens 2, PSVR2, Vuzix smart glasses, Google
   Cardboard) and, for anyone interested in building XR, what tools are used (engines, web-3D
   stacks, SDKs, asset tools) and the three-step path to build and deploy something.
7. Self-check understanding with a five-question true/false quiz covering the AR/VR/MR
   distinctions taught above.

## 2. Full content

### 2.1 Hero

- Eyebrow: "An interactive lesson · Dr. Yasas Sri Wickramasinghe"
- H1: "Let's make sense of **Extended Reality.**" (the second line, "Extended Reality.", is
  rendered in a blue→indigo→purple gradient: `from-[#0071e3] via-[#5e5ce6] to-[#bf5af2]`)
- Subhead: "In this lesson we'll walk through AR, VR and Mixed Reality, one step at a time.
  Along the way you can try two demos right here — a camera AR demo and a VR world you steer by
  moving your phone. No headset needed."
- Two CTAs: a filled button "Try the AR demo" (scrolls to `#ar`) and a text link "Jump to the VR
  demo ›" (scrolls to `#vr`)
- Footer of hero: "Scroll to explore" (fades in after a 1s delay)

### 2.2 "Start here" — the Reality–Virtuality continuum

Section eyebrow: "Start here". Title: "It's all one spectrum, from real to virtual". Subhead:
"'Extended Reality' (XR) is just an umbrella word for any technology that mixes the real world
with digital content. Drag the slider to see how the different types line up — this picture is
known as Milgram's reality–virtuality continuum."

**`RealitySpectrum` interactive slider** — a single `<input type="range">` (0–100, default value
35) laid over a gradient track (`#c7c7cc → #0071e3 → #30d158 → #bf5af2 → #5e5ce6`). Track labels
read "Real world" / "Virtual world" above and "Physical / AR / MR / AV / VR" as tick labels
below. Moving the slider changes a highlighted info card below it, whose zone boundaries and
exact copy are:

| Slider position | Zone name | Accent color | Description (verbatim) |
|---|---|---|---|
| < 18 | Physical Reality | `#86868b` (grey) | "Just the real world around you, with nothing digital added." |
| 18–39 | Augmented Reality | `#0071e3` (blue) | "Digital things are drawn on top of the real world. You can still see the room around you the whole time." |
| 40–59 | Mixed Reality | `#30d158` (green) | "Digital objects are pinned to real surfaces and react to them. It can be hard to tell what is real and what is added." |
| 60–81 | Augmented Virtuality | `#bf5af2` (purple) | "Mostly a digital world, but a few real things are captured and brought in." |
| ≥ 82 | Virtual Reality | `#5e5ce6` (indigo) | "Everything you see is digital. The real world is hidden completely." |

### 2.3 Three-pillar cards (AR / VR / MR)

Immediately below the spectrum, a 3-column grid (stagger-animated in):

- 📱 **Augmented Reality** (`#0071e3`) — "Digital things are drawn on top of what you can
  already see. The room around you stays visible — the virtual content just sits over it."
- 🥽 **Virtual Reality** (`#5e5ce6`) — "Everything you see is made by a computer. You're fully
  inside a digital world, with the real room shut out."
- 🌐 **Mixed Reality** (`#30d158`) — "Digital objects are pinned to real surfaces and react to
  the space around them. The real and the virtual share the same room."

### 2.4 Video 1 — intro explainer

`YouTubeEmbed` — video ID `O6KWWLnoFfI`, title "What is Extended Reality? (XR, VR, AR, MR)",
caption: "If you'd rather watch than read, this short video covers the same idea in a few
minutes."

### 2.5 AR demo section (`id="ar"`)

Eyebrow: "Augmented Reality · try it". Title: "Place 3D objects in your room". Subhead: "This
demo uses your phone's back camera. Tap to drop an object, then move your phone around — it
stays put where you placed it, the same way a real AR app works." Below the live `ARDemo`
component: "Works best on a phone. The camera and motion sensors stay on your device — nothing
is uploaded or saved." See §2.10 for the demo's own content (shape choices, HUD copy, etc).

**Video 2 — real-world AR example**: `YouTubeEmbed` — video ID `q6KYj2U40UI`, title "Pokémon GO
— launch trailer", caption: "You've probably already used AR. Pokémon GO places characters into
the camera view of the real world around you."

### 2.6 VR demo section (`id="vr"`)

Eyebrow: "Virtual Reality · try it". Title: "Look around a virtual world". Subhead: "This is a
small solar system drawn in 3D. On a laptop, drag with your mouse to look around. On a phone,
tap 'Move your phone to look around' and turn your body — the phone's motion sensor moves the
view for you. Turn on Cardboard mode for a split-screen headset view." Below the live
`GyroVRScene` component: "On a laptop, just drag to look around. On a phone, Cardboard mode
splits the screen so it works in a cheap cardboard headset."

**Video 3 — what full VR headsets are really like**: `YouTubeEmbed` — video ID `HBNH8tzsfVM`,
title "What Is Virtual Reality & How Does It Work? | Mashable Explains", caption: "Our demo is
just a small taste. This short explainer shows how full VR headsets put you inside a
computer-generated world."

### 2.7 Comparison table ("At a glance: AR vs VR vs MR")

Eyebrow: "At a glance". Title: "AR vs VR vs MR". Subhead: "A quick side-by-side, so it's easy to
keep the three straight."

`ComparisonTable` — exact row data (columns AR / VR / MR):

| Aspect | AR | VR | MR |
|---|---|---|---|
| Real world visible? | Yes | Blocked | Yes |
| Digital objects? | Overlaid | Everything | Anchored |
| Interacts with real space? | Limited | None | Fully |
| Typical device | Phone / glasses | Headset | Smart glasses |
| Examples | Pokémon GO, IKEA Place | Meta Quest, PSVR | HoloLens, Vision Pro |

**Video 4 — Mixed Reality on real hardware**: `YouTubeEmbed` — video ID `eqFqtAJMtYE`, title
"Introducing Microsoft HoloLens 2", caption: "Mixed Reality is the trickiest of the three to
picture. Microsoft's HoloLens 2 shows holograms sitting in a real room."

### 2.8 "Where people actually use XR" (six general use cases)

Eyebrow: "In the real world". Title: "Where people actually use XR". Subhead: "It isn't just for
games. Here are a few fields already using XR in everyday work."

`USE_CASES` — six cards, verbatim:

1. 🏥 **Medicine** — "Doctors can see scans laid over a patient during surgery, and trainees
   practise operations in VR where mistakes are safe."
2. 🏗️ **Architecture** — "You can walk through a building in VR before it is built, which makes
   problems much easier to spot early."
3. 🎓 **Education** — "Students explore things that are hard to bring into a classroom — the
   inside of a cell, ancient Rome, or the planets."
4. 🛒 **Shopping** — "Apps let you see how a sofa would look in your living room, or try on
   glasses, before you buy anything."
5. 🏭 **Manufacturing** — "Workers wearing MR headsets see step-by-step instructions floating
   right over the machine they are building."
6. 🎮 **Games** — "From full VR games to phone games like Pokémon GO, XR has changed the way we
   play."

### 2.9 "How AR and VR show up in IS" — six Information-Systems case studies

Rendered by the lazy-loaded `ISUseCases` component, inserted directly after the use-cases
section (no `<section>` wrapper of its own on the page — `ISUseCases` renders its own `<section>`).

Header: eyebrow "For Information Systems students", title "How AR and VR show up in IS",
subhead: "XR isn't only about games. Businesses use it to collect, study and act on information.
Here are some current examples that connect back to what you're studying in Information
Systems."

Each of the six rows pairs a hand-built animated SVG illustration with a tag list, title, body
copy and a highlighted "stat" line (rows alternate left/right layout via CSS `md:order`):

1. **Tags:** VR, AR — **"Exploring data in 3D"** — "Instead of staring at flat charts, analysts
   can step inside their data and walk around it as a 3D landscape. Seeing it in space can make
   patterns in large datasets easier to spot." — *Stat:* "The immersive analytics market is
   expected to grow from about $1.2B in 2025 to $6.2B by 2035." (Illustration: animated bar
   chart + floating scatter points + a stylized headset glyph.)
2. **Tags:** MR, VR — **"Digital twins"** — "A digital twin is a live virtual copy of a real
   factory, product or supply chain, kept in sync through sensors and business systems. Teams
   can test changes on the copy before touching the real thing." — *Stat:* "In 2025, digital
   twins moved from trial projects into everyday business use." (Illustration: solid factory
   building next to its green wireframe "twin," animated dots flowing along a dashed line
   labelled "IoT · ERP.")
3. **Tags:** AR — **"AR in the warehouse"** — "Warehouse staff wear smart glasses that show
   where to go and what to pick, right there on the shelf — hands free, and linked to the
   warehouse system so stock stays accurate." — *Stat:* "Amazon began rolling out Vuzix AR
   glasses in May 2025, reporting faster picking and fewer mistakes." (Illustration: 3×3 shelf
   grid with one cell highlighted green + checkmark, a bouncing "PICK 3" arrow/badge, and
   glasses-HUD corner brackets.)
4. **Tags:** VR, MR — **"Working together in a shared space"** — "Teams in different cities can
   meet around the same 3D model to design and review work together, almost as if they were
   standing in one room." — *Stat:* "Often called the 'industrial metaverse' — engineers in
   different places working on one model at the same time." (Illustration: a rotating wireframe
   octahedron labelled "Shared 3D model" with four pulsing avatar dots connected to it by dashed
   lines.)
5. **Tags:** AR, MR — **"Repairs guided by AR"** — "A technician can look at a machine and see
   its current readings and the repair steps laid right over it, pulled straight from the
   company's records. No flipping through a paper manual." — *Stat:* "Boeing's 'virtual
   airplane' lets engineers explore the inside of an aircraft in 3D." (Illustration: a machine
   with two floating AR callouts — a green "72°C OK" reading and a red "Replace seal" warning
   with a bouncing/pulsing exclamation triangle.)
6. **Tags:** MR, AR — **"Dashboards floating around you"** — "With a headset like Apple Vision
   Pro, the dashboards and KPIs you'd normally squeeze onto one screen can float around you as
   panels you arrange in the space." — *Stat:* "Global spending on AR is expected to pass $100B
   by 2026." (Illustration: three floating panels — a revenue line chart, a "98% SLA uptime" KPI
   card with a progress bar, and a small bar-chart card — each bobbing at a different phase.)

### 2.10 "The gear" — devices, and "The tools developers use" — dev tools/setup

Rendered by the lazy-loaded `DevicesAndTools` component (also no page-level section wrapper —
it renders its own two `<section>`s), inserted immediately after `ISUseCases` and before the
quiz.

**Devices grid** — eyebrow "The gear", title "Headsets and glasses you'll hear about". Six device
cards, each with a hand-drawn SVG silhouette (one of three reusable shapes: `Visor`, `Glasses`,
`Cardboard`, recolored per device) plus a brand logo (via `cdn.simpleicons.org`, or initials
fallback) and a type label:

| Device | Brand | Type label | Shape used |
|---|---|---|---|
| Apple Vision Pro | Apple | Spatial · MR | visor |
| Meta Quest 3 | Meta | VR · MR | visor |
| Microsoft HoloLens 2 | Microsoft (no logo slug — falls back to initials) | Mixed Reality | glasses |
| PlayStation VR2 | Sony | Console VR | visor |
| Vuzix Smart Glasses | Vuzix (no logo slug — falls back to initials) | AR · Enterprise | glasses |
| Google Cardboard | Google | VR · Entry | cardboard |

**Dev tools grid** — eyebrow "Want to build your own?", title "The tools developers use". Eleven
tool logos grouped by category:
- **Engine:** Unity, Unreal Engine, Godot
- **Web 3D:** three.js, A-Frame, WebGL, WebXR (WebXR has no Simple Icons slug — solid-color
  initials tile)
- **SDK:** ARKit, ARCore, OpenXR (OpenXR has no slug — initials tile)
- **3D assets:** Blender

**Three-step setup flow** below the tool grid:
1. **Pick an engine** — "Unity · Unreal · WebXR"
2. **Add an XR SDK** — "OpenXR · ARKit · ARCore"
3. **Build & deploy** — "Headset or browser"

### 2.11 Quiz — "Five quick questions"

Eyebrow: "Check yourself". Title: "Five quick questions". Subhead: "See how much of the lesson
stuck."

`QUIZ` — five true/false questions, verbatim, with their correct answer and explanation:

1. **"You can see the real world through a VR headset."** — Answer: **False**. Explanation:
   "VR replaces your entire field of view with a synthetic environment."
2. **"AR stands for "Augmented Reality"."** — Answer: **True**. Explanation: "AR overlays
   digital content onto the real world."
3. **"Mixed Reality is just a marketing name for VR."** — Answer: **False**. Explanation: "MR
   is its own category — digital objects interact with real surfaces."
4. **"Pokémon GO is an example of an AR application."** — Answer: **True**. Explanation: "It
   overlays virtual creatures onto your environment via the camera."
5. **"In MR, holograms can appear to rest on a real table."** — Answer: **True**. Explanation:
   "MR anchors virtual objects to real-world geometry."

Result screen copy (by score out of 5):
- Score 5: 🏆 "Perfect score — you've really got the difference between AR, VR and MR."
- Score 3–4: 🎯 "Nice work. Scroll back up and play with the demos to fill in the gaps."
- Score 0–2: 📚 "Good start. Try the demos again, then come back and have another go."

A "Try again" button resets the quiz to question 1, score 0.

### 2.12 Footer

Brand lockup ("Not a **LMS**"), then: "An Extended Reality lesson, put together by **Dr. Yasas
Sri Wickramasinghe**." and a privacy note: "Everything here runs in your own browser. No camera,
motion or personal data is collected or stored."

## 3. UI & interaction design

**Visual language.** Apple-marketing-site pastiche, matching the platform's other MBI800 public
lessons: system font stack aliased as `APPLE_FONT` (`-apple-system, BlinkMacSystemFont, "SF Pro
Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif`), off-black text
(`#1d1d1f`), blue accent `#0071e3`, alternating white / `#f5f5f7` section backgrounds, large
rounded corners (`rounded-[28px]`, `rounded-[1.75rem]`), soft large-blur ambient color washes in
the hero (`blur-3xl` circles in blue and purple), and a consistent five-color XR accent palette
reused everywhere (blue `#0071e3`, indigo `#5e5ce6`, green `#30d158`, purple `#bf5af2`, orange
`#ff9f0a`, red/pink `#ff375f`).

**Navigation model.** Single continuous vertical scroll, no tabs or slide-deck paging. Two hero
CTAs jump to in-page anchors (`#ar`, `#vr`) via a custom `scrollToSection(id)` helper that calls
`element.scrollIntoView({ behavior: 'smooth', block: 'start' })` directly — deliberately *not*
`<a href="#ar">`, because the app runs under `HashRouter` and a literal hash-link would be
interpreted as route navigation to a non-existent `/ar` route (landing on the shutdown notice
page) rather than scrolling. This same pitfall is why the comment in the source calls this out
explicitly at lines 309–315.

**Animation.** Built entirely on `framer-motion`:
- A generic `Reveal` wrapper (`motion.div`, `initial={{opacity:0, y:48}}`, animates in on
  `whileInView`, `viewport={{once:true, margin:'-80px'}}`, 0.8s custom ease
  `[0.16, 1, 0.3, 1]`) wraps almost every section heading/body block.
- Grid sections (three pillars, use cases, devices, tools) use `stagger`/`item` (or `grid`/`cell`
  in `DevicesAndTools`) `Variants` with `staggerChildren` (0.09s or 0.07s) so cards cascade in.
- The hero uses scroll-linked transforms (`useScroll` + `useTransform` against a `heroRef`) to
  scale the hero content down to 0.86, fade it out, and drift it down 120px as the user scrolls
  past it — a parallax/zoom-out effect.
- `RealitySpectrum`'s info card re-animates (`key={info.name}`, fade+slide) every time the
  slider crosses a zone boundary.
- The `ISUseCases` SVG illustrations are individually animated with looping `motion.rect` /
  `motion.circle` / `motion.g` transitions (bars growing/shrinking, dots pulsing, a rotating
  wireframe octahedron, bobbing dashboard panels) — these are infinite ambient loops, not
  scroll-triggered.

**Responsive behavior.** Mobile-first Tailwind breakpoints throughout (`sm:`, `md:`, `lg:`);
grids collapse from 3 columns to 1 on narrow screens; the AR demo viewport is a fixed
phone-shaped `aspect-[3/4]` box capped at 400px wide (portrait, phone-style), while the VR demo
is a `aspect-video` box capped at 820px wide (landscape, "this looks like a video player" style).
Both demo containers explicitly disable native touch gestures (`touchAction: 'none'`) so
pointer-drag/tap logic isn't fought by the browser's own scroll/zoom handling.

**Loading states.** Every lazy-loaded piece (`ARDemo`, `GyroVRScene`, `ISUseCases`,
`DevicesAndTools`, and every `YouTubeEmbed`) is wrapped in `<Suspense>` with a fallback: a
`DemoFallback` component showing "Loading {label}…" inside a placeholder box sized to match the
real demo for the two interactive demos and videos, or a plain centered "Loading…" line of text
for the two full-width sub-sections.

## 4. Component & state architecture

This is the most component-heavy lesson in the MBI800 set: one page file plus five sub-components
and one shared hook, seven source files in total.

**Lazy-loading & composition order.** `XRExplorerPage.tsx` declares all five sub-components with
`React.lazy()` at module scope (lines 5–9):
```
ARDemo, GyroVRScene, ISUseCases, DevicesAndTools, YouTubeEmbed
```
Each usage site is individually wrapped in its own `<Suspense>` boundary (not one shared
boundary), so each piece pops in independently as it loads/scrolls into view, in this page order:
1. `YouTubeEmbed` (intro video, `O6KWWLnoFfI`) — end of the "Start here" section
2. `ARDemo` — `id="ar"` section
3. `YouTubeEmbed` (Pokémon GO, `q6KYj2U40UI`) — same AR section, after the demo
4. `GyroVRScene` — `id="vr"` section
5. `YouTubeEmbed` (VR explainer, `HBNH8tzsfVM`) — same VR section, after the demo
6. `YouTubeEmbed` (HoloLens 2, `eqFqtAJMtYE`) — comparison-table section
7. `ISUseCases` — its own full-width section, no wrapping `<section>` from the page
8. `DevicesAndTools` — its own two full-width sections, likewise unwrapped
9. Quiz (inline, not lazy) — final content section before the footer

Everything else on the page (`RealitySpectrum`, `ComparisonTable`, `USE_CASES` cards, `Quiz`,
`SectionHead`, `Reveal`) is defined and rendered inline in `XRExplorerPage.tsx` itself — only the
five listed above are code-split.

**Page-level state (`XRExplorerPage`):** just a `heroRef` (`useRef<HTMLDivElement>`) and derived
`useScroll`/`useTransform` values for the hero parallax; no other page-level state. All
interactive state lives inside the individual inline components (`RealitySpectrum`'s `pos`,
`Quiz`'s `idx`/`answer`/`score`/`done`) or inside the lazy sub-components below. Nothing is
lifted or shared between sections — each interactive piece is fully self-contained.

**`useDeviceOrientation` hook** (shared by `ARDemo` and `GyroVRScene`) — the device-orientation
state machine both demos build on:
- Returns `{ dataRef, permission, active, enable, disable }`.
- `permission: 'unsupported' | 'prompt' | 'granted' | 'denied'` (React state, drives UI copy/
  disabled buttons). `active: boolean` (React state, true once listening).
- `dataRef` is a **ref**, not state — `{ alpha, beta, gamma, screen }` — updated directly inside
  the `deviceorientation` event handler so every incoming sensor tick does *not* trigger a React
  re-render; consumers read `dataRef.current` inside a `useFrame` callback (per-frame, driven by
  the WebGL render loop) instead.
- `enable()`: on iOS 13+, calls `DeviceOrientationEvent.requestPermission()` (must be invoked
  from inside a user gesture) and sets `permission` to `'granted'` or `'denied'` based on the
  result; on other platforms it skips straight to attaching listeners. On success it registers
  `deviceorientation` and `orientationchange` listeners and sets `active = true`.
  If `window.DeviceOrientationEvent` doesn't exist at all, `permission` becomes `'unsupported'`.
- `disable()`: removes both listeners and sets `active = false`. Also run automatically on
  unmount via a `useEffect` cleanup.
- `applyDeviceQuaternion(quaternion, data)` — a standalone exported function (ported from
  three.js's `DeviceOrientationControls`) that converts raw `alpha/beta/gamma/screen` degrees
  into a `THREE.Quaternion`, applied to the scene camera every frame: builds a `YXZ`-order Euler
  from `(beta, alpha, -gamma)`, then applies two fixed correction quaternions — a `-90°` rotation
  about the Z axis (`Q1`, so the camera looks out the back of the device rather than the top) and
  a rotation counteracting the current screen orientation angle (`Q0`).

**`ARDemo` component:**
- Uses `getUserMedia` to request the **rear camera** specifically
  (`facingMode: { ideal: 'environment' }`, 1280×720 ideal), with a fallback retry to any camera
  if the constrained request fails (`OverconstrainedError`/`NotFoundError`), and a distinct
  error message for `NotAllowedError`/`SecurityError` (permission blocked) vs. no camera found
  vs. non-HTTPS context (`window.isSecureContext` is checked explicitly — camera access requires
  a secure origin).
- State: `running`, `starting`, `needsTap` (autoplay was blocked, shows a manual "tap to start"
  overlay), `error`, `placed: Placed[]` (the anchored objects, capped to the last 24 via
  `.slice(-23)` before pushing), `shapeIdx` (which of 5 shape types is currently selected to
  place: sphere/cube/torus('Ring')/cone/crystal(dodecahedron), each with its own accent color).
- Renders a `<video>` element (camera feed) with a `React Three Fiber` `<Canvas>` transparently
  layered on top (`gl={{ alpha: true, premultipliedAlpha: false }}`, cleared to fully transparent
  black) so the WebGL 3D layer composites visually over the live camera feed — this is the AR
  effect, achieved without any WebXR/ARKit/ARCore native API, purely camera-feed-plus-transparent-
  3D-overlay.
- Placement mechanism: on pointer-down inside the viewport, converts the tap's screen coordinates
  to normalized device coordinates, raycasts from the current Three.js camera through that point
  (`THREE.Raycaster`), and places the selected shape at `ray.at(2.6, ...)` — i.e. 2.6 world units
  along the ray, a fixed "reach" distance rather than any real depth/plane detection. Each placed
  object grows in from scale 0 over ~0.33s and gently bobs (`Math.sin`) once settled, and slowly
  spins continuously.
- World-locking mechanism: requesting camera access and requesting motion/orientation permission
  happen together inside the *same* user gesture (`startCamera`), because iOS only grants the
  DeviceOrientation permission prompt from inside a tap handler — the code comment (lines 148–156)
  is explicit about this being deliberate. Once `gyro.active` is true, a `CameraRig` component
  applies `applyDeviceQuaternion` to the Three.js camera every frame so placed objects appear to
  stay pinned to their real-world direction as the phone is physically turned. If gyro permission
  is denied, tap-to-place still works, just without the world-lock (HUD reads "Tap to place"
  instead of "World-locked").
- Robustness details worth preserving: `muted` is set imperatively on the video element (not
  trusted as a React prop) because some mobile browsers otherwise block autoplay; a `needsTap`
  overlay recovers from blocked `play()` calls; camera teardown on unmount is done via a ref
  holding the latest `stopCamera` closure with an empty-dependency effect, specifically to avoid
  the stream being torn down and restarted on every render (the comment at lines 195–203
  explains this was a deliberate fix for a real bug, not accidental).

**`GyroVRScene` component:**
- Renders a `<Canvas>` (no camera video — this is pure synthetic VR, not AR) containing a small
  animated solar system: a central emissive sun, `ambientLight` + `pointLight`, a `Stars`
  starfield from `@react-three/drei` (6000 stars), four orbiting `Planet` meshes at different
  distances/speeds/colors, a slowly rotating `Ringworld` torus, and 14 drifting colored
  octahedron "crystals" scattered on a ring for parallax depth.
- `LookController`: drives the camera each frame. If `gyro.active`, applies
  `applyDeviceQuaternion` exactly as in ARDemo. Otherwise, implements manual pointer-drag look:
  tracks `lon`/`lat` accumulated from `pointermove` deltas (×0.18 sensitivity, latitude clamped
  to ±85°) and points the camera at a unit-sphere target derived from spherical coordinates —
  classic drag-to-look-around, no external orbit-controls library.
- `StereoRenderer`: implements the "Cardboard mode" toggle. When `cardboard` is true, it uses a
  `THREE.StereoCamera` (aspect 0.5, eye separation 0.6) to render the scene twice into left/right
  scissored viewports side-by-side within the same canvas — a manual, from-scratch stereo split
  (registered with R3F `useFrame(..., 1)`, i.e. render priority > 0, which hands off automatic
  rendering to this component). When `cardboard` is false it just renders once, full-viewport,
  from the normal perspective camera.
- Other state: `cardboard: boolean` (toggle button "Cardboard mode 🥽" / "Exit Cardboard"), plus
  a "Fullscreen" button that calls `element.requestFullscreen()` (toggling
  `document.fullscreenElement`). Reuses the same `useDeviceOrientation` hook as `ARDemo` for the
  "Move your phone to look around" / "Stop gyro" toggle, with the same
  `unsupported`/`denied` messaging pattern.

**`ISUseCases` component:** stateless aside from `framer-motion`'s own animation state — no
`useState`/`useEffect`. A static `CASES` array of 6 objects (`Illo` component reference, `tags`,
`title`, `body`, `stat`) is mapped to alternating left/right rows, each row itself
scroll-reveal-animated via `whileInView`. Each of the six `*Illo` functions is a small, fully
inline hand-authored SVG with a few `motion.*` elements looping continuously (not scroll-linked;
they animate for as long as they're mounted).

**`DevicesAndTools` component:** also stateless at the top level. Two static arrays, `DEVICES`
(6 entries) and `TOOLS` (11 entries), each mapped into a `motion` stagger grid. The one piece of
local state is inside the small `Logo` sub-component: `failed: boolean`, initialized to `true`
when no `slug` is supplied, and flipped to `true` on the `<img>`'s `onError`, causing it to
render a colored initials tile instead of the (would-be broken) `cdn.simpleicons.org` image —
this is the "graceful fallback so nothing ever shows broken" behavior called out in the file's
own header comment.

**`YouTubeEmbed` component:** state is a single `active: boolean` (default false). Renders a
static thumbnail (`i.ytimg.com/vi/<id>/hqdefault.jpg`) with a play button overlay until clicked;
only then does it swap in the real `<iframe>` pointed at `youtube-nocookie.com/embed/<id>`
(`autoplay=1&rel=0`). This facade pattern avoids loading four heavy YouTube iframes up front.

**No Firestore, no gating/unlock logic, no badge triggers, no scoring persistence anywhere in
this lesson** — everything above is local component state that resets on page reload.

## 5. Rebuild notes

- **Genuinely unclear / not independently verifiable without running the app:**
  - The exact runtime behavior of `@react-three/fiber`'s automatic-render-disable when a
    `useFrame(fn, priority)` callback is registered with `priority > 0` (used by
    `StereoRenderer`) was not verified by executing the app — it is stated here based on the
    library's documented convention and the inline code comment, not by observing it run.
  - Real-world reliability of the iOS `DeviceOrientationEvent.requestPermission()` flow (timing
    requirements around the user gesture, exact denial UX) could not be verified without a
    physical iOS device.
  - Whether the `cdn.simpleicons.org` slugs used (`apple`, `meta`, `playstation`, `google`,
    `unity`, `unrealengine`, `godotengine`, `threedotjs`, `aframe`, `webgl`, `android`,
    `blender`) currently resolve to valid icons was not checked against the live CDN — treat as
    needing revalidation if rebuilding.
  - The four YouTube video IDs (`O6KWWLnoFfI`, `q6KYj2U40UI`, `HBNH8tzsfVM`, `eqFqtAJMtYE`) are
    transcribed exactly as they appear in source; their continued availability/ownership on
    YouTube was not re-verified live.
- **Dead/legacy code nearby:** none found inside the seven XR source files themselves. Note (from
  the frontmatter) that `XRExplorerPage` is one of only a few pages imported eagerly rather than
  `lazy()`-loaded in `src/App.tsx`, and is duplicated verbatim between `AppRoutes()` and
  `ShutdownRoutes()` — this duplication is a platform-wide pattern (shared by several other
  "stays up during shutdown" public lessons), not something specific to XR Explorer, but a
  rebuilder should preserve both route registrations if reproducing routing behavior.
  `src/pages/student/MBI802Resources.tsx` (unrelated dead file, mentioned in the top-level
  README) does not touch this lesson.
  - `useDeviceOrientation`'s `screen` field in `GyroData` is populated from
    `screen.orientation.angle` with a fallback to the deprecated `window.orientation`; this is a
    deliberate compatibility shim, not dead code, worth keeping if rebuilding.
- **Assets:** no local image/SVG/video files — every visual is either a hand-authored inline SVG
  (device silhouettes in `DevicesAndTools`, all six illustrations in `ISUseCases`) or fetched
  live from external URLs (Simple Icons CDN for logos, YouTube thumbnails/iframes for video). No
  assets live under `public/` for this lesson.
- **Privacy claim to preserve if rebuilding:** the footer explicitly promises "No camera, motion
  or personal data is collected or stored" — this is accurate to the implementation (camera
  stream and gyroscope data never leave the client, there is no upload/analytics call anywhere in
  these seven files) and should remain true of any rebuild.
- **Quiz has no retry/attempt limit, no persistence, and no relationship to any badge or
  course-completion system** — it is a pure self-check, consistent with this lesson having no
  gated counterpart at all.
