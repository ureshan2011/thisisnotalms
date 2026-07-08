# MBI802 Secure Study Pack Generator New

Turns the MBI802 (Database Management Systems) course content into professionally typeset,
watermarked, encrypted PDF study packs:

- **8 study guides** (one per class) — university-course-notes style with callouts, worked
  examples, vector diagrams, key-concept tables, practice questions and answer keys
- **8 one-page revision sheets** — compact two-column exam crib sheets
- **1 master study pack** — cover, clickable table of contents with page numbers, all
  8 chapters, glossary appendix and consolidated answer key (~60 pages)

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

Outputs land in `study-pack/dist/pdf/` with a `dist/manifest.json` (page counts, sizes,
SHA-256 checksums). The build **fails** if the two passwords are missing or equal, and
verifies every PDF before declaring success.

Useful flags:

| Command | Effect |
|---|---|
| `node scripts/build.mjs --lesson 7` | Build a single lesson's guide + revision sheet |
| `npm run build:draft` (`--no-encrypt --keep-html`) | Unprotected draft build — outputs named `*-UNPROTECTED-DRAFT.pdf`, intermediate HTML kept for inspection |
| `--keep-html` | Keep `dist/html/` for debugging the layout in a browser |

## How it works

```
content/lessons/*.md  ──markdown-it──►  HTML (print.css + watermark.css template)
        │ + content/diagrams/*.svg inlined
        ▼
Paged.js (page numbers, running headers, TOC page refs, per-page watermark hook)
        ▼
Playwright Chromium page.pdf()  ──►  @cantoo/pdf-lib AES-256 encrypt + permissions
        ▼
scripts/verify.mjs (encryption enforced, permissions set, watermarks present,
page budgets, TOC entries)  ──►  dist/pdf/*.pdf + dist/manifest.json
```

- **Content** is authored Markdown in `content/lessons/` — one `NN-slug.md` study guide and
  one `NN-slug.revision.md` per lesson, plus `glossary.md`. Callout syntax:
  `::: definition | tip | warning | example | activity | answer | summary` … `:::`.
  Diagrams are hand-authored SVGs in `content/diagrams/`, referenced as
  `![caption](diagrams/name.svg)` and inlined at build time.
- **Course metadata** (author, series label, academic year, watermark and footer strings,
  lesson list, output names) lives in `content/course.json` — edit it there, never in code.
- **Convention:** the `## Answer Key` section must be the **last** section of each lesson —
  the master build relocates it into the consolidated answer-key appendix.
- The encryption backend is isolated in `scripts/encrypt.mjs`. Fallbacks if you ever need
  them: `qpdf --encrypt <user> <owner> 256 --extract=n --modify=none --` or Python `pikepdf`.

## CI: automatic rebuilds

`.github/workflows/study-pack.yml` rebuilds the pack on every push touching `study-pack/**`
(and on manual dispatch) and uploads the PDFs as a workflow artifact.

**One-time setup — create two repository secrets** (Settings → Secrets and variables →
Actions): `STUDY_PACK_USER_PASSWORD` and `STUDY_PACK_OWNER_PASSWORD`. CI fails loudly if
they are absent, so an unencrypted PDF can never ship from CI.

To publish a release: tag the commit `study-pack-v<version>` — the workflow attaches the
PDFs to a GitHub release.

## Regenerating when lessons change

1. Update the lesson source in the app (deck/quiz/page) as usual.
2. Reflect the change in the corresponding `content/lessons/NN-*.md` (and revision sheet
   if the change is exam-relevant). The Markdown is the single source for the PDFs —
   it is a *rewritten study text*, not a scrape, so keep the prose voice.
3. Push. CI rebuilds all 17 PDFs and uploads fresh artifacts.

Adding a whole new lesson: add an entry to `course.json`'s `lessons` array, create the two
Markdown files (frontmatter: `number`, `title`, `subtitle`, `objectives:`), and any diagrams.
Nothing else changes.

## Manual QA checklist (once per template change)

- [ ] Opening any PDF prompts for a password; the user password opens it, a wrong one fails.
- [ ] Document properties show *Content Copying: Not Allowed* / *Changing: Not Allowed*;
      selecting + copying text fails in Acrobat/Preview.
- [ ] Watermark faint — barely visible by design — but its text still extractable (verify.mjs checks); footer + page numbers on every page.
- [ ] Document properties show a human-readable title; the bookmarks panel lists chapters with readable names (a broken encryption backend garbles both).
- [ ] Master TOC entries jump to the right chapters; printed page numbers match.
- [ ] SVG diagrams stay crisp at 400 % zoom; A4 print preview shows correct margins.
- [ ] Revision sheets fit their page budget (≤ 2 pages).
