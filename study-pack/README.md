# Secure Study Pack Generator

Turns course content into professionally typeset, watermarked, encrypted PDF study packs.
The pipeline is course-agnostic — each course is a self-contained folder under `content/`;
adding a new course means adding content, not touching the scripts.

Currently ships two courses:

- **MBI802** (Database Management Systems) — 8 lessons
- **MBI800** (Strategic Information Systems Planning) — 11 lessons

Per course, per build:

- **One study guide per lesson** — university-course-notes style with callouts, worked
  examples, vector diagrams, key-concept tables, practice questions and answer keys
- **One one-page revision sheet per lesson** — compact two-column exam crib sheet
- **One master study pack** — cover, clickable table of contents with page numbers, every
  chapter, glossary appendix (if present) and consolidated answer key

Every page carries the author watermark, copyright line, course code, academic
year and "For enrolled students only". Output PDFs are AES-256 encrypted with an **open
(user) password** and an **owner password** that disables copying, editing and annotation
(high-resolution printing and screen-reader access stay enabled).
See [SECURITY-OPTIONS.md](SECURITY-OPTIONS.md) for the full protection comparison and rationale.

## Quick start (local build)

```bash
cd study-pack
npm ci
# one-time if Chromium is not present:
npx playwright install chromium

export STUDY_PACK_USER_PASSWORD='what-students-type-to-open'
export STUDY_PACK_OWNER_PASSWORD='keep-this-one-secret'
npm run build
```

Omitting `--course` builds **every** course found under `content/*/course.json`. Outputs
land in `study-pack/dist/<slug>/pdf/` with a `dist/<slug>/manifest.json` (page counts,
sizes, SHA-256 checksums) per course. The build **fails** if the two passwords are missing
or equal, and verifies every PDF before declaring success.

Useful flags:

| Command | Effect |
|---|---|
| `node scripts/build.mjs --course mbi800` | Build only one course |
| `node scripts/build.mjs --course mbi800 --lesson 7` | Build a single lesson's guide + revision sheet |
| `npm run build:draft` (`--no-encrypt --keep-html`) | Unprotected draft build — outputs named `*-UNPROTECTED-DRAFT.pdf`, intermediate HTML kept for inspection |
| `--keep-html` | Keep `dist/<slug>/html/` for debugging the layout in a browser |

## How it works

```
content/<slug>/lessons/*.md  ──markdown-it──►  HTML (print.css + watermark.css template)
        │ + content/<slug>/diagrams/*.svg inlined
        ▼
Paged.js (page numbers, running headers, TOC page refs, per-page watermark hook)
        ▼
Playwright Chromium page.pdf()  ──►  @cantoo/pdf-lib AES-256 encrypt + permissions
        ▼
scripts/verify.mjs (encryption enforced, permissions set, watermarks present,
page budgets, TOC entries)  ──►  dist/<slug>/pdf/*.pdf + dist/<slug>/manifest.json
```

- **Content** is authored Markdown in `content/<slug>/lessons/` — one `NN-slug.md` study
  guide and one `NN-slug.revision.md` per lesson, plus an optional `glossary.md`. Callout
  syntax: `::: definition | tip | warning | example | activity | answer | summary` … `:::`.
  Diagrams are hand-authored SVGs in `content/<slug>/diagrams/`, referenced as
  `![caption](diagrams/name.svg)` and inlined at build time.
- **Course metadata** (author, series label, academic year, watermark and footer strings,
  lesson list, output names) lives in `content/<slug>/course.json` — edit it there, never
  in code.
- **Convention:** the `## Answer Key` section must be the **last** section of each lesson —
  the master build relocates it into the consolidated answer-key appendix.
- **Optional `shortTitle` frontmatter field:** if a lesson's full `title` is long enough to
  wrap the running page header onto two lines, add a shorter `shortTitle` — it's used only
  for the header, the chapter body still shows the full `title`.
- Markdown rendering disables markdown-it's `replacements` rule (see `makeRenderer` in
  `assemble.mjs`) — with it enabled, literal `(c)`, `(r)` and `(tm)` in prose (e.g. a
  multiple-choice option labelled `(c)`) silently become `©`/`®`/`™`. Smart quotes and em
  dashes still work; only that specific substitution is disabled.
- The encryption backend is isolated in `scripts/encrypt.mjs`. Fallbacks if you ever need
  them: `qpdf --encrypt <user> <owner> 256 --extract=n --modify=none --` or Python `pikepdf`.

## Adding a new course

1. Create `content/<slug>/course.json` (copy an existing one as a template) and
   `content/<slug>/lessons/`.
2. Author each lesson's Markdown (frontmatter: `number`, `title`, `subtitle`, `objectives:`,
   optionally `shortTitle`) and its revision sheet, plus any diagrams.
3. `node scripts/build.mjs --course <slug> --no-encrypt --keep-html` to iterate, then a full
   encrypted build to confirm `verify.mjs` passes.

Nothing in `scripts/` needs to change — the pipeline reads `content/*/course.json` generically.

## CI: automatic rebuilds

`.github/workflows/study-pack.yml` rebuilds every course on every push touching
`study-pack/**` (and on manual dispatch) and uploads all courses' PDFs as one workflow
artifact.

**One-time setup — create two repository secrets** (Settings → Secrets and variables →
Actions): `STUDY_PACK_USER_PASSWORD` and `STUDY_PACK_OWNER_PASSWORD`. CI fails loudly if
they are absent, so an unencrypted PDF can never ship from CI.

To publish a release: tag the commit `study-pack-v<version>` **and create a GitHub Release**
from that tag (a pushed tag alone does not trigger anything — the workflow listens for the
`release: published` event) — the workflow then attaches every course's PDFs to the release.

## Regenerating when lessons change

1. Update the lesson source in the app (deck/quiz/page) as usual.
2. Reflect the change in the corresponding `content/<slug>/lessons/NN-*.md` (and revision
   sheet if the change is exam-relevant). The Markdown is the single source for the PDFs —
   it is a *rewritten study text*, not a scrape, so keep the prose voice.
3. Push. CI rebuilds every course and uploads fresh artifacts.

Adding a whole new lesson to an existing course: add an entry to that course's
`course.json` `lessons` array, create the two Markdown files, and any diagrams. Nothing
else changes.

## Manual QA checklist (once per template change)

- [ ] Opening any PDF prompts for a password; the user password opens it, a wrong one fails.
- [ ] Document properties show *Content Copying: Not Allowed* / *Changing: Not Allowed*;
      selecting + copying text fails in Acrobat/Preview.
- [ ] Watermark faint — barely visible by design — but its text still extractable (verify.mjs checks); footer + page numbers on every page.
- [ ] Document properties show a human-readable title; the bookmarks panel lists chapters with readable names (a broken encryption backend garbles both).
- [ ] Master TOC entries jump to the right chapters; printed page numbers match.
- [ ] SVG diagrams stay crisp at 400 % zoom; A4 print preview shows correct margins.
- [ ] Revision sheets fit their page budget (≤ 2 pages).
- [ ] Running page headers stay on one line even for the longest chapter title in the course.
