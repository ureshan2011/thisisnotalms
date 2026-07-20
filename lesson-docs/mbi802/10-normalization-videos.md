# Normalization Videos — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/normalisation-videos` (canonical). `/normalization-videos` (US
  spelling) is a permanent redirect to the canonical route, registered in `src/App.tsx`
  (appears twice, once in the main route list around line 120, once in a duplicate route
  block around line 204 — same pattern seen elsewhere in the router).
- **Source files:**
  - `src/pages/NormalizationVideosPage.tsx` (111 lines) — the page itself: hero copy,
    the built-in video list, and the Firestore merge-in of lecturer-added videos.
  - `src/components/slides/VideoGallery.tsx` (168 lines) — shared, generic video-grid
    presentational component (also used elsewhere in the platform, e.g. inside the gated
    `CourseResources.tsx` hub) that actually renders the clips.
- **Depends on:**
  - `src/components/public/PublicLessonShell.tsx` — shared hero/nav/footer shell used by
    this and sibling standalone public lessons ("Let's make sense of…" pattern family);
    supplies the sticky nav, animated gradient hero, topic pills, and quiet footer around
    the lesson body.
  - `src/lib/firebase.ts` (`db`) — Firestore client, used to read the public
    `videoLessons` collection.
  - Firestore collection **`videoLessons`** — public-read collection. Each document may
    have `{ courseId: string, lessonId: string, videos: VideoClip[] }`; this page filters
    client-side for `courseId === 'MBI802' && lessonId === 'normalization'` and
    concatenates any matching `videos` arrays onto the end of the built-in list.
  - `lucide-react` icons (`Film`, `Play`, `ExternalLink`) — used inside `VideoGallery`.
  - External video hosting: all built-in clips are Microsoft SharePoint/Stream "sharing"
    links (`myacg-my.sharepoint.com`) under presenter Yasas Wickramasinghe's OneDrive;
    they open in a new tab rather than embedding (no `embedUrl` is set on any built-in
    clip).
  - Thumbnail images referenced from the Vite public root (`${import.meta.env.BASE_URL}` +
    filename), i.e. static files expected at `public/NormIntro.png`, `public/NormWhy.png`,
    `public/NormFD.png`, `public/Norm1NF.png`, `public/Norm1NFExample.png`,
    `public/Norm2ND.png`.

## 1. Purpose & learning objectives

A video-first companion to the interactive Normalization Explorer (`/normalisation`) and
Normalization Activities (`/normalisation-activities`) lessons, for students who "prefer to
watch and learn." It presents a walkthrough series covering: why normalization matters,
functional dependencies, and climbing the normal forms (1NF, with a worked example, then
2NF) one short clip at a time. The page is a thin public wrapper around a reusable
`VideoGallery` grid: each card opens the corresponding SharePoint video in a new tab. The
page also transparently merges in any additional videos a lecturer has added via Firestore
under the same MBI802/normalization lesson key used by the gated Course Resources hub, so
public visitors and logged-in students see a consistent (or superset) video list without
requiring login.

## 2. Full content

### Hero (via `PublicLessonShell`)

- Eyebrow: "MBI802 · Database Design"
- Headline: "Let's make sense of" (plain) + "Normalization — on video." (gradient text,
  `linear-gradient(90deg, #6366f1, #818cf8, #06b6d4)` — indigo → light indigo → cyan)
- Subtitle: "Prefer to watch and learn? The full walkthrough series on database
  normalization — from why we do it and functional dependencies, climbing the normal
  forms one clip at a time."
- Topic pills: 🤔 "Why normalise?" (color `#7c3aed`), 🔗 "Functional deps" (`#0891b2`),
  1️⃣ "1NF" (`#0d9488`), 🪜 "2NF & beyond" (`#6366f1`)
- Accent color for the page: `#6366f1` (indigo); orb2 `#818cf8`; orb3 `#06b6d4`.
- Standard shell footer text: "Everything here runs in your own browser. No login, no
  personal data collected."

### Built-in video list (`NORMALIZATION_VIDEOS` constant, defined directly in
`NormalizationVideosPage.tsx`, lines 10–47) — 6 entries, rendered in this order:

1. **"Normalization – Introduction"**
   Description: "Introductory video for Database Normalization & Functional
   Dependencies"
   Thumbnail: `NormIntro.png`
   Opens (new tab): SharePoint link (`.../IQAowdJDkOhQTq1zdGLQEhuVAVOSCBFxoYfC_6R_udOvPx8...`).

2. **"Normalization – Why Normalise?"**
   Description: "Understanding the need for database normalization"
   Thumbnail: `NormWhy.png`
   Opens (new tab): SharePoint link (`.../IQB8pA9SvlmuQ7FBkSDvkwuAAabog23pf1imS32sfOJWjnU...`).

3. **"Normalization – Functional Dependencies"**
   Description: "Introduction to functional dependencies in relational databases"
   Thumbnail: `NormFD.png`
   Opens (new tab): SharePoint link (`.../IQBJVg0hKdB1SZJcHC2qHBxcASVGMpngLuFNOcPSWisP73Q...`).

4. **"Normalization – First Normal Form (1NF)"**
   Description: "Understanding and applying First Normal Form"
   Thumbnail: `Norm1NF.png`
   Opens (new tab): SharePoint link (`.../IQDwiXe1GAG4QornPClJYm6PAej3l8tqwmUvRsE9xRboIsA...`).

5. **"Normalization – 1NF Further Example"**
   Description: "First Normal Form worked example with a real-world Orders table"
   Thumbnail: `Norm1NFExample.png`
   Opens (new tab): SharePoint link (`.../IQCqqC2tZ9-CSLbaDx7tEzrZAUMXnC5WKuT8CeKb0HX8mQ4...`).

6. **"Normalization – Second Normal Form (2NF)"**
   Description: "Second Normal Form theory — partial dependencies and how to eliminate
   them"
   Thumbnail: `Norm2ND.png`
   Opens (new tab): SharePoint link (`.../IQCqqC2tZ9-CSLbaDx7tEzrZAUMXnC5WKuT8CeKb0HX8mQ4...`)
   — **note:** this URL is byte-for-byte identical to entry 5's URL (both point to the
   same SharePoint sharing link, differing only in the `e=` tracking suffix: `4U7kWZ` for
   entry 5 vs `igJmfx` for entry 6). This looks like a copy/paste artifact in the source
   data rather than intentional — flagged for the lecturer to verify/replace with the
   correct 2NF video link. Full SharePoint URLs (including the `nav=` and `e=` query
   parameters) are reproduced verbatim in `src/pages/NormalizationVideosPage.tsx` lines
   14–46 for exact reconstruction.

None of the 6 built-in clips set `embedUrl`, so all render as "opens in new tab" cards
(see Section 3) rather than inline players.

### Dynamically merged videos (Firestore)

Any Firestore documents in `videoLessons` with `courseId: 'MBI802'` and
`lessonId: 'normalization'` have their `videos` array appended after the 6 built-ins. This
is empty/absent by default — actual content, if any exists in the live database, is not
captured in source and cannot be transcribed here; it is data-driven at runtime, not
hardcoded.

### Note on the similarly-named constant in `CourseResources.tsx`

`src/pages/student/CourseResources.tsx` (the gated hub) defines its own, separately
maintained `NORMALIZATION_VIDEOS` constant (lines 123–148) used for the MBI802 →
Normalization lesson tile there. That array contains only **4** entries — "Normalization –
Introduction," "– Why Normalise?," "– Functional Dependencies," and "– First Normal Form
(1NF)" (identical titles/descriptions/URLs/thumbnails to entries 1–4 above) — and is
**missing** entries 5 ("1NF Further Example") and 6 ("Second Normal Form (2NF)") that the
public page includes. The two constants are not shared/imported from a common module; they
are independently hardcoded duplicates that have drifted apart. This doc describes the
public page's own 6-entry array, since that is what actually renders at
`/normalisation-videos`; the 4-entry gated-hub version is out of scope for this file
(covered by whatever doc records `CourseResources.tsx`) but is noted here because the task
brief expected the two to match and they do not.

## 3. UI & interaction design

- Page markup itself is minimal: `PublicLessonShell` provides the entire visual frame
  (sticky translucent nav with `BrandLogo` linking to `/home`; full-bleed animated hero
  with three blurred color orbs behind the headline; centered content column; footer).
  The page's only job is to pass hero copy/pills/gradient/accent props and render
  `<VideoGallery videos={videos} accentColor="#6366f1" />` as the shell's `children`.
- **VideoGallery** section header: a small icon tile (`Film` icon, tinted with the
  accent color at 15% opacity) + "Video Lessons" heading + a pill showing the clip count
  (e.g. "6 clips").
- **Grid**: 1 column on mobile, 2 columns (`md:grid-cols-2`) on larger screens, `gap-4`.
- **Card (no `embedUrl`, i.e. every built-in clip here)**: a `<button>` wrapping a
  16:9 thumbnail area (renders `thumbnailUrl` as a cover image, or — if absent — a
  tinted gradient placeholder with a centered `Film` icon at 40% accent opacity), a
  semi-transparent dark overlay, and a centered circular accent-colored button showing an
  `ExternalLink` icon (since `hasEmbed` is false for all built-in clips). A small pill
  badge reading "Opens in new tab" sits bottom-right of the thumbnail. Below the
  thumbnail: title (bold, `#1e1b4b`) and description (smaller, gray `#6b7280`), left
  aligned.
- Clicking a no-embed card calls `window.open(clip.url, '_blank', 'noreferrer')` —
  full page reload never happens; navigation stays a new browser tab.
- **Card (with `embedUrl`, not used by any built-in clip on this page but supported by
  the shared component)**: shows a `Play` icon overlay instead of `ExternalLink`; clicking
  sets that card's index as `playingIndex` and swaps the card for an inline 16:9
  `<iframe>` player with a title bar showing the clip title and a "Close" pill button that
  resets `playingIndex` to `null`.
- Hover state on thumbnail cards: card gets a shadow (`hover:shadow-lg`), and the
  center play/external-link circle scales up slightly (`group-hover:scale-110`).
- Card border/background use the gallery's `accentColor` prop at low opacity
  (`${accentColor}20` border, `${accentColor}15`/`${accentColor}12` tints) — on this page
  that's the indigo `#6366f1`, distinct from the `#0d7a72` teal default the component
  falls back to when no `accentColor` is passed elsewhere in the app.
- Same Apple-style font stack and easing conventions as sibling public lessons
  (`PublicLessonShell` sets `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro
  Text", "Inter", "Helvetica Neue", system-ui, sans-serif`); hero elements fade/slide in
  with staggered `framer-motion` delays (eyebrow → headline → subtitle → pills → "Scroll
  to begin" indicator with a looping bounce animation).

## 4. Component & state architecture

- **`NormalizationVideosPage`** state: a single `useState<VideoClip[]>` called
  `extraVideos`, initialized empty. On mount, a `useEffect` (guarded by `if (!db) return`)
  fetches the entire `videoLessons` Firestore collection with `getDocs(collection(db,
  'videoLessons'))`, filters documents client-side for `courseId === 'MBI802'` and
  `lessonId === 'normalization'` with an array `videos` field, and pushes all matching
  videos into `extraVideos`. A `cancelled` flag guards against setting state after
  unmount. Firestore errors (offline, rules not deployed) are silently swallowed with a
  comment explaining the built-in list is the fallback — no error UI is shown to the
  user.
- Final `videos` array passed to `VideoGallery` is simply
  `[...NORMALIZATION_VIDEOS, ...extraVideos]` — built-ins always first, Firestore
  extras appended, no dedup or sort logic.
- **`VideoGallery`** is a stateless-content, presentational component with one piece of
  local state: `playingIndex: number | null`, tracking which card (if any) is showing an
  inline `<iframe>` embed. It receives `videos: VideoClip[]` and optional `accentColor`
  (default `#0d7a72`) as props and has no knowledge of Firestore, routing, or the parent
  page — fully reusable, which is why it's also used by the gated `CourseResources.tsx`.
  It renders `null` if `videos.length === 0`.
- `VideoClip` interface (exported from `VideoGallery.tsx`): `{ title: string;
  description?: string; url: string; thumbnailUrl?: string; embedUrl?: string }`.
- No writes to Firestore anywhere in this flow (read-only), no scoring, no gating, no
  badge triggers. No props/state are passed down from `PublicLessonShell` other than the
  static hero configuration described above — it is a pure layout wrapper (`children`
  render prop).

## 5. Rebuild notes

- The most important content fidelity risk if rebuilding: the built-in video array lives
  in **two places** (`NormalizationVideosPage.tsx`, 6 entries, and
  `CourseResources.tsx`, 4 entries) that have already drifted apart — entries 5 and 6
  (1NF Further Example, 2NF) exist only on the public page. A rebuilder should decide
  whether to keep them as two independent lists (current behavior) or unify them; this
  doc intentionally preserves the current (diverged) state rather than "fixing" it.
  Confirm with the lecturer whether the CourseResources array is stale/needs the same two
  entries added.
  - Note that the video array names/line numbers were verified directly by reading both
    source files rather than assumed from the task brief: `NORMALIZATION_VIDEOS` in
    `NormalizationVideosPage.tsx` is lines 10–47 (6 entries), and the separate
    `NORMALIZATION_VIDEOS` constant in `CourseResources.tsx` is lines 123–148 (4
    entries) — matching the task's ~123–148 estimate for the latter, but that array is
    not the one actually rendered on the public `/normalisation-videos` route.
- The Activity 5/6 duplicate-URL issue (both point to the same SharePoint share link) is
  almost certainly a data bug in the source, not intentional design — flagged above in
  Section 2 for revalidation; a rebuilder should ask the lecturer for the correct
  standalone 2NF video link before treating this as canonical.
- All SharePoint URLs are long-lived "sharing" links tied to a specific OneDrive account
  (`yasas_wickramasinghe_yoobeecolleges_com1`) — these should be revalidated periodically
  since SharePoint share links can expire or be revoked; there is no fallback video host.
- Thumbnail assets (`NormIntro.png`, `NormWhy.png`, `NormFD.png`, `Norm1NF.png`,
  `Norm1NFExample.png`, `Norm2ND.png`) are expected directly under the Vite `public/`
  directory (referenced via `import.meta.env.BASE_URL`); confirm they exist there when
  rebuilding — they were not verified to be present on disk as part of this doc.
  `Norm2ND.png` naming is inconsistent with the others (`Norm2NF.png` would match the
  `Norm1NF.png` pattern) — worth checking this isn't itself a typo/missing-file risk.
  `PublicLessonShell.tsx` and `VideoGallery.tsx` are both fully generic/reusable and not
  specific to this lesson — rebuilding them should be done once and shared, not
  duplicated per-lesson.
- `videoLessons` Firestore collection: no security rules or document shape validation
  was inspected as part of this doc (out of scope — only the read path in
  `NormalizationVideosPage.tsx` was reviewed); if rebuilding, verify Firestore rules
  actually allow public (unauthenticated) reads of this collection, since the page's
  comment asserts this but it was not independently confirmed against `firestore.rules`.
