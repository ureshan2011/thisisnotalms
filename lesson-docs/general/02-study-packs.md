# Study Packs Download Hub — General

- **Subject:** General / cross-subject — a resource index page, not a lesson in its own right. It
  links out to two per-subject PDFs (MBI800, MBI802) but the page itself teaches nothing.
- **Gating:** Non-gated (public). Reachable with no login at `/study-packs`. The PDFs it links to
  are themselves password-protected (open/user password shown openly on the page — see below),
  which is a distinct, deliberately non-secret protection layer explained in section 2, not a
  login gate.
- **Route(s):** `/study-packs`
- **Source files:**
  - `src/pages/StudyPacksPage.tsx` — the entire page: hero, personal note, two `PackCard`s (one
    per course), a 3-step "how to open" section, and footer. Self-contained; the file's own header
    comment describes it as presenting the packs "as a gift from the lecturer" with a "warm
    paper-and-ink aesthetic echoing the PDFs' classical typesetting" and "passwords shown openly
    (they gate note-sharing sites, not the students the packs were made for)".
  - `public/study-packs/MBI800-Master-Study-Pack-AY2026.pdf` and
    `public/study-packs/MBI802-Master-Study-Pack-AY2026.pdf` — the two downloadable PDFs this page
    links to (linked via `${import.meta.env.BASE_URL}study-packs/<file>`, served as static
    assets).
- **Depends on:** `framer-motion` (`motion.*` components for scroll-reveal, hover, and idle
  animations), `react-router-dom` (`Link`), `src/components/ui/BrandLogo.tsx`. No Firestore reads
  or writes — this is a static content page. The PDFs themselves are produced by a separate build
  pipeline under `study-pack/` (see "Where the PDFs come from" below); that pipeline is not part
  of this app's runtime and is only referenced here for provenance.

## 1. Purpose & learning objectives

Not a lesson — a **resource index / download hub** whose entire job is to hand students two
polished, book-like PDF study packs (one per course: MBI800 Strategic Information Systems
Planning, MBI802 Database Management Systems) and make the handoff feel personal rather than
transactional. The page is framed explicitly as a gift: hero eyebrow "🎁 A GIFT FROM YOUR
LECTURER", headline "Your study packs are ready.", and a handwritten-style personal note signed
"— Dr. Yasas Sri Wickramasinghe" reading: "Slides disappear when the projector turns off. I wanted
you to have something that lasts — the whole course, in a book you can hold. Study well, ask
questions, and keep these long after the exam."

Its only functional objectives are: let a student find and download the correct PDF for their
course, show them exactly what's inside (chapter/table-of-contents preview) before they commit to
downloading, and hand them the open password in the same breath so there's no friction between
"download" and "actually being able to read it."

## 2. Full content

The page is a single continuous scroll with a sticky nav (`BrandLogo` linking to `/home`, plus the
tagline "for enrolled students, with care") and these sections in order:

**Hero.** Four small drifting decorative glyphs (✦ ❧ ✧ ✦) animate gently around the header.
Eyebrow: "🎁 A GIFT FROM YOUR LECTURER". Headline: "Your study packs are ready." Subtext: "Every
lesson from this semester, rewritten as a properly typeset book you can keep — revise on the bus,
print for the exam desk, or read years from now. The password for each pack is printed right
below its cover, because it was made for *you*."

**Personal note.** A tape-cornered card styled like a pinned handwritten note (italic serif
blockquote): "Slides disappear when the projector turns off. I wanted you to have something that
lasts — the whole course, in a book you can hold. Study well, ask questions, and keep these long
after the exam." — signed "Dr. Yasas Sri Wickramasinghe".

**Two pack cards**, each showing a miniature faithful replica of the actual PDF cover (title
block, "ADDITIONAL LEARNING MATERIALS" seal, author name, "Student Edition · For enrolled students
only", and a ribbon that visually "unties" via a scroll-triggered `framer-motion` animation as the
card scrolls into view), plus a description, table-of-contents preview, a download button, and a
password tag. The two packs, transcribed in full from the `PACKS` data array:

| Field | MBI800 pack | MBI802 pack |
|---|---|---|
| Title | Strategic Information Systems Planning | Database Management Systems |
| Password | `strategy2026` | `database2026` |
| File | `MBI800-Master-Study-Pack-AY2026.pdf` | `MBI802-Master-Study-Pack-AY2026.pdf` |
| Chapters | 11 | 8 |
| Pages | 61 | 56 |
| Extras | consolidated answer key | glossary + consolidated answer key |
| Ribbon colour | `#d97706` (amber) | `#7c3aed` (violet) |

MBI800 table of contents (as listed on the page):
1. Systems Thinking & the Iceberg Model
2. SISP Foundations & the Six Process Dimensions
3. Strategic IT Planning, Business Case & the SDLC
4. Business Model & Idea Canvases
5. Risk Management Standards
6. Global SISP Case Studies
7. Five Stories That Changed Everything
8. Immersive Realities — AR/VR
9. Systems Security · Platform Strategy

MBI802 table of contents (as listed on the page):
1. Introduction to DBMS
2. SQL Programming Fundamentals
3. Advanced SQL Queries
4. ER Diagrams — Foundations & Advanced
5. ER → Relational Mapping
6. Database Normalization
7. Consolidation & Exam Preparation
8. Glossary of Key Terms

Each card's description text: "N chapters · N pages · \<extras\>. Typeset like a real book —
worked examples, practice questions, key-concept tables and a linked table of contents. Works
offline, prints beautifully on A4, and screen readers are fully supported."

**How the password is presented.** Next to each pack's download button is a "swing-tag" styled
element (`PasswordTag`) labelled "PDF PASSWORD" in small caps, showing the plaintext password in
a large monospace font, with a "Copy" button (uses `navigator.clipboard.writeText`, falling back
to a hidden `<textarea>` + `document.execCommand('copy')` if the Clipboard API is unavailable) that
shows "Copied ✓" for 1.8 seconds. The tag gently rocks side to side on an infinite idle animation.
The password is never hidden, masked, or gated behind any additional step — it is shown in plain
text directly beside the download button, by design (per the file's header comment: the passwords
"gate note-sharing sites, not the students the packs were made for").

**Download button.** "⤓ Download the {code} pack · PDF" — a plain `<a download>` link pointing at
`${BASE}study-packs/{file}`, with a small animated sparkle-burst (✦/✧ characters flying outward)
triggered on click.

**Three-step "how to open your pack" section:**
1. **Download** — "Tap the button — the PDF is yours to keep, on any device."
2. **Open it** — "Any PDF reader works: phone, tablet, laptop, or the library computers."
3. **Type the password** — "It's printed on the tag above — once entered, most readers remember
   it."

**Footer / small print:** "These packs are for enrolled students only — please don't upload them
to note-sharing sites; they carry a watermark and copyright. Copying and editing are locked, but
printing and screen-reader access are fully enabled, on purpose. © 2026 Dr. Yasas Sri
Wickramasinghe · MBI800 · MBI802 · AY 2026" followed by a "← back to the launchpad" link to
`/home`.

### Where the PDFs come from

The two PDFs are static files checked into `public/study-packs/` — this page does not generate
them at runtime. They are produced by a separate, self-contained build pipeline living under
`study-pack/` (documented in `study-pack/README.md`), which turns per-lesson markdown course
content into "professionally typeset, watermarked, encrypted PDF study packs" via a
markdown-it → Paged.js/Chromium print pipeline. Each output PDF is AES-256 encrypted with an open
(user) password — the one shown on this page (`strategy2026` / `database2026`) — and a separate,
secret owner password that disables copying/editing/annotation while leaving high-resolution
printing and screen-reader access enabled, matching the footer's "printing and screen-reader
access are fully enabled, on purpose" claim. That pipeline is a standalone Node/Playwright tool
with its own `npm run build` workflow and is out of scope for this doc beyond this provenance
note — it is not part of the deployed React app and does not run in the browser.

## 3. UI & interaction design

- **Visual identity: "warm paper" aesthetic**, deliberately distinct from the rest of the
  platform's Apple-style dark/glass UI. Cream/parchment background (`#faf6ee`), off-black ink text
  (`#1b1b1b`), a subtle radial-dot paper-grain texture overlay across the whole page, and two
  serif/sans font stacks: `SERIF` ("Iowan Old Style", "Palatino Linotype", Palatino, Georgia,
  "Times New Roman", serif) for headings/quotes/TOC entries, `SANS` (system font stack) for UI
  chrome (nav, buttons, labels).
- **Cover miniatures** (`MiniCover`) are hand-built to visually mirror the real PDF's title page:
  an open-book seal SVG (`BookSeal`), an "ADDITIONAL LEARNING MATERIALS" eyebrow, an Oxford-rule
  bordered title block, and a wrapped ribbon + bow (🎀 emoji) that animates apart
  (`whileInView="unwrapped"` variant) as the card scrolls into view — `x`/`opacity` transition on
  the ribbon strip, `y`/`rotate`/`opacity` on the bow, staggered with slight delays for a
  "untying" effect.
  Ribbon colour is per-pack (amber for MBI800, violet for MBI802).
- **Motion throughout** uses `framer-motion`: hero text/decorative glyphs fade/float in on load;
  pack cards fade+slide up on scroll (`whileInView`, `viewport={{ once: true }}`); the personal
  note card fades in with a slight rotation; download buttons lift on hover with a shadow and a
  sparkle burst on click; the password tag has a perpetual slow rocking animation
  (`rotate: [-1.5, 1.2, -1.5]` looping every 6s).
- **Layout:** a `max-w-5xl`/`max-w-4xl`/`max-w-3xl` centered column depending on section; pack
  cards use a `md:grid-cols-[auto_1fr]` grid (cover fixed-width, content fluid) collapsing to a
  single column on narrow viewports; the three-step section is a `sm:grid-cols-3` grid.
- **Responsive:** all grids collapse to single-column below the `sm`/`md` breakpoints; the TOC
  list uses `sm:grid-cols-2`.

## 4. Component & state architecture

- **`StudyPacksPage` (default export)** — stateless container; renders the nav, hero, personal
  note, two `<PackCard>`s (mapped from the `PACKS` array), the 3-step section, and footer. No
  Firestore reads/writes, no auth checks — a fully static page.
- **`PACKS: Pack[]`** — the only real "data model" on this page; each `Pack` has `code`, `title`,
  `titleLines` (two-line wrapped title for the mini cover), `password`, `file` (PDF filename under
  `public/study-packs/`), `ribbon`/`ribbonDeep` (accent colours), `chapters`, `pages`, `extras`
  (free-text string), and `toc` (string array).
- **`MiniCover`** — presentational, takes a `Pack` and renders the animated faux cover.
- **`PasswordTag`** — local `copied` boolean state; `copy()` writes the password to the clipboard
  (with a `textarea`+`execCommand` fallback for browsers without Clipboard API support) and shows
  a 1.8s "Copied ✓" confirmation.
- **`DownloadButton`** — local `bursts: number[]` state (an array of animation-instance IDs,
  keyed by `Date.now()`); each click appends a new burst which self-removes via
  `onAnimationComplete`. The link itself is a plain native download (`<a download href=...>`), no
  JS-driven fetch.
- **`PackCard`** — composes `MiniCover`, the description/TOC block, `DownloadButton`, and
  `PasswordTag` inside a `framer-motion` `whileInView` fade-up wrapper, staggered by `index`.
- No badges, no completion tracking, no gating logic anywhere on this page — it is intentionally
  as frictionless as a page can be.

## 5. Rebuild notes

- **This is an index page, not lesson content** — a rebuild should not attempt to regenerate the
  PDFs' internal content from this file; the PDFs themselves are produced by the wholly separate
  `study-pack/` pipeline (see `study-pack/README.md` for that pipeline's own documentation, out of
  scope here). If the actual PDF binaries are lost, this doc alone does not contain enough to
  regenerate their content — only the pipeline's source markdown under `study-pack/content/`
  would.
- **Passwords are intentionally public** — `strategy2026` and `database2026` are meant to be
  visible in the page source and UI; this is not a bug or an oversight to "fix" in a rebuild. They
  gate against casual redistribution/note-sharing sites, not against enrolled students who already
  have the page URL.
- **Copyright year is hardcoded** to "AY2026" in filenames and "© 2026" in the footer — a rebuilder
  producing a future academic year's packs would need to update the `PACKS` array's `file` paths,
  the footer copy, and (out of scope here) the pipeline's own academic-year config.
- No external links to revalidate — the only navigation is internal (`/home`).
- Confirm `public/study-packs/MBI800-Master-Study-Pack-AY2026.pdf` and
  `MBI802-Master-Study-Pack-AY2026.pdf` exist at build/deploy time; they are static assets not
  checked by any runtime code on this page (a missing file would 404 silently on download click).
