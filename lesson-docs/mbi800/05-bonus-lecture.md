# Capstone Bonus Lecture — MBI800

- **Subject:** MBI800 — Strategic Information Systems Planning
- **Gating:** Non-gated (public). This lesson does not appear anywhere in `CourseResources.tsx`'s
  MBI800 `lessons` array (which only lists `five-stories`, `sisp-lab`, `platform-strategy`) — there
  is no gated copy of this lesson, unlike Five Stories and Platform Strategy which exist in both
  forms. The only way to reach this content is the public route below.
- **Route(s):** `/bonus-lecture`
- **Source files:**
  - `src/pages/MBI800BonusLecturePage.tsx` — thin 24-line route page. Configures
    `PublicLessonShell` with this lesson's copy/colors and mounts the lesson body as `children`.
  - `src/components/public/MBI800BonusLectureLesson.tsx` — the entire actual lesson: the 3-stage
    pipeline explainer, the "Interactive Prompt Foundry" (3 selectable system-prompt presets with
    copy-to-clipboard), the "Alumni Resource Vault" email-capture form (writes to Firestore), and
    the closing send-off note from the lecturer.
- **Depends on:**
  - `src/components/public/PublicLessonShell.tsx` — shared shell component reused across several
    public lessons (Five Stories, Systems Security, Platform Strategy, etc.). Provides the sticky
    nav, hero, and footer chrome around this lesson's content (see Section 3).
  - `src/components/ui/BrandLogo.tsx` — logo shown in the shell's nav and footer.
  - `lucide-react` icons: `LayoutTemplate`, `Terminal`, `Rocket`, `Mail`, `Check`, `Copy`,
    `ArrowDown`, `Sparkles`, `ExternalLink`.
  - `framer-motion` — used by `PublicLessonShell` for the hero reveal animations (not used directly
    inside the lesson body itself).
  - `firebase/firestore` (`collection`, `addDoc`, `serverTimestamp`) and `src/lib/firebase.ts`
    (`db` export) — the email-capture form in the "Alumni Resource Vault" writes signup documents
    to the Firestore collection **`bonusLectureSignups`**, each document shaped as
    `{ email: string, submittedAt: serverTimestamp(), source: 'bonus-lecture' }`. If `db` is not
    configured (no Firebase env vars), the submit handler throws and shows the inline
    "Something went wrong saving that" error rather than crashing.
  - External link: `https://www.linkedin.com/in/yasassri/` (the lecturer's LinkedIn, in the
    closing send-off).
  - `navigator.clipboard.writeText` (with a `document.execCommand('copy')` fallback via a
    temporary offscreen `<textarea>`) — powers the "Copy prompt" button.

## 1. Purpose & learning objectives

This is the capstone/bonus session of the MBI800 course: a practical, single-sitting walkthrough
of shipping a personal website using three AI-assisted tools in sequence — **Google Stitch 2.0**
for design, **Claude Code (on the web)** for implementation, and **GitHub Pages** for free
hosting/deployment. It is framed explicitly as going "from an idea to a live website in one
sitting" (per the page subtitle) and as "the capstone pipeline" in the source comment: "Google
Stitch 2.0 → Claude Code on the Web → GitHub Pages."

The intro copy states the objective directly: "Three tools, one afternoon: describe what you
want, one AI designs it, another AI builds it, and GitHub Pages puts it online for free."

Beyond the pipeline explanation, the lesson has a secondary, practical goal: hand students
ready-to-use "system prompts" (one of three personas/styles) they can literally copy and paste
into Stitch and Claude Code to produce a personal portfolio site — lowering the activation energy
from "I understand the pipeline" to "I have already started building."

The lesson is signed by name at the end — "— Yasas Sri Wickramasinghe, MBI800 Lecturer" — with a
closing message that frames this as a durable skill, not a one-off assignment: "This pipeline
doesn't end with the course. Keep the repo, keep pushing commits, and let an agent take the first
pass so you can spend your time on the parts only you can judge."

## 2. Full content

The lesson renders as a single continuous scroll (`space-y-10`), no slides/tabs, in four parts:
an intro tag + paragraph, a 3-stage pipeline, an interactive "Prompt Foundry," and a closing
signup panel + send-off note.

### Intro

**Eyebrow tag:** "MBI800 · Capstone Bonus Lecture" (sparkle icon)

**Intro paragraph (verbatim):**
> "Three tools, one afternoon: describe what you want, one AI designs it, another AI builds it,
> and GitHub Pages puts it online for free. Here's each stage, in order."

### The pipeline — three stages, connected by down-arrows

**Stage 01 — GOOGLE STITCH 2.0**

- **Title:** "Design the layout."
- **Body (verbatim):** "Describe the site you want in plain language — the audience, the
  sections, the mood. Stitch turns that into real screens: hero, nav, content blocks. Then you
  refine in rounds — "make the hero calmer," "give the projects section more air" — until it
  looks right."
- **Notes (bulleted, verbatim):**
  1. "One instruction at a time. Don't describe the whole site in one prompt."
  2. "Export the HTML/CSS once you're happy — that's your starting repo."
  3. "This stage is sketching, not shipping. It doesn't need to be production-ready."
- Icon: `LayoutTemplate`. Color: `#7c3aed` (violet).

**Stage 02 — CLAUDE CODE ON THE WEB**

- **Title:** "Turn it into real code."
- **Body (verbatim):** "Bring the Stitch export into Claude Code, running in your browser — no
  local setup needed. Ask it to add the contact form, wire up the project grid, make the nav
  responsive, write tests. It reads the repo, makes the changes, runs checks, and shows you the
  diff before anything ships."
- **Notes (bulleted, verbatim):**
  1. "Describe outcomes, not implementations: "let visitors book a call from the hero" beats
     "add a button.""
  2. "Ask for a review pass — accessibility, broken links, mobile layout."
  3. "This is where the site stops being a mockup and becomes software."
- Icon: `Terminal`. Color: `#4f46e5` (indigo).

**Stage 03 — GITHUB PAGES**

- **Title:** "Ship it."
- **Body (verbatim):** "Push the repo to GitHub and turn on Pages in the repository settings.
  Your site is live at yourname.github.io within minutes. Every future push republishes it. No
  hosting bill, no server to manage — just a URL you can put on a resume or a business card."
- **Notes (bulleted, verbatim):**
  1. "Point a custom domain at it later with a CNAME file."
  2. "Commit often — your git history is a record of the site improving."
  3. "This is the step most courses skip, and the one that makes the other two matter."
- Icon: `Rocket`. Color: `#059669` (emerald).

Each stage renders as a bordered, tinted card (`colorBg`/`colorBorder` per stage) with a colored
icon badge, a `STAGE 0N` mono label, a pill with the tool name, the title, body paragraph, and
the bulleted notes; a downward arrow (`ArrowDown`, lavender `#c4b5fd`) separates each stage from
the next.

### The Interactive Prompt Foundry

**Eyebrow tag:** "The Interactive Prompt Foundry" (sparkle icon)

**Heading:** "Pick a style for your site."

**Subcopy (verbatim):** "Choose the one closest to what you want, then copy the prompt into
Stitch and Claude Code."

Three selectable preset cards (default-selected: "The Minimalist Academic"), each swapping the
displayed prompt in a terminal-styled code block below (dark `#111827` background, filename
header, and a "Copy prompt" button that copies the full prompt text to the clipboard):

---

**Preset 1 — "The Minimalist Academic"** ("For research & long-form credibility," emerald
`#059669`, file `academic_portfolio.prompt.md`)

Full prompt text, verbatim:

```
# SYSTEM PROMPT — Stitch + Claude Code

ROLE
You are designing a personal academic portfolio for [YOUR NAME], a
[FIELD] researcher. Optimize for a reader who has 20 seconds and a lot
of judgment.

VISUAL DIRECTION
- Palette: warm paper white (#FAFAF7) background, near-black ink, one
  restrained accent (deep forest or oxblood) used only for links and
  a single hero rule.
- Typography: a serif built for long-form reading, paired with a quiet
  sans for labels and metadata. Line-height 1.6+, body measure capped
  at ~68 characters.
- Layout: single column, generous white space, no cards, no shadows.
  Let whitespace and thin rules do the separating, not boxes.

STRUCTURE
1. Hero — name, title, one-line research thesis. No photo required.
2. Selected Publications — a list, not cards: title, venue, year,
   PDF/DOI link.
3. Research Interests — 3-4 short paragraphs, not a bullet dump.
4. CV download, plus contact: email, Google Scholar, ORCID.
5. Optional: Teaching, Talks & Media.

BUILD NOTES FOR CLAUDE CODE
- Static HTML/CSS, no build step — deploy straight to GitHub Pages.
- Semantic HTML (article, section, nav) for accessibility and
  citation crawlers.
- Add a print stylesheet so the page exports cleanly to PDF for
  tenure or grant packets.
- No animation beyond a 150ms link-underline transition.

# Ship something a hiring committee can read in 20 seconds
# and trust in 20 more.
```

---

**Preset 2 — "The Creative Tech Innovator"** ("For builders, devs & makers," violet `#7c3aed`,
file `tech_innovator_portfolio.prompt.md`)

Full prompt text, verbatim:

```
# SYSTEM PROMPT — Stitch + Claude Code

ROLE
You are designing a personal portfolio for [YOUR NAME], a builder who
ships things — part developer, part designer, part indie hacker.

VISUAL DIRECTION
- Palette: near-black (#0B0E14) base, exactly one neon accent (electric
  violet or emerald) used for glow, hover states, and a single hero
  gradient. Never stack more than one accent hue at a time.
- Typography: a bold geometric display face for the hero headline,
  monospace for meta text — dates, stack tags, terminal captions.
- Motion: subtle. A glow that breathes, a card that lifts 4px on
  hover, a terminal cursor that blinks. Nothing that fights the reader.

STRUCTURE
1. Hero — one punchy line about what you build, animated gradient
   mesh behind it, a live status pill ("Currently building X").
2. Project Grid — 3-6 cards: live demo link, GitHub link, stack
   chips, one line on why it matters.
3. Now — a dated "what I'm building this month" block.
4. Contact as a terminal prompt: "> email me" / "> book a call".

BUILD NOTES FOR CLAUDE CODE
- Vanilla or React + utility CSS, componentized project cards, dark
  mode as the only mode unless asked otherwise.
- Pull pinned repos from the GitHub REST API into the project grid so
  it never goes stale.
- CSS-only or canvas background accent — keep it under 5% CPU and
  respect prefers-reduced-motion.
- Deploy via a GitHub Actions workflow to Pages so every push to main
  re-publishes automatically.

# Make it feel like a live workshop, not a brochure.
```

---

**Preset 3 — "The Executive Consultant"** ("For enterprise & consulting," indigo `#4f46e5`, file
`executive_consultant_portfolio.prompt.md`)

Full prompt text, verbatim:

```
# SYSTEM PROMPT — Stitch + Claude Code

ROLE
You are designing a personal site for [YOUR NAME], an independent
consultant or fractional executive who needs credibility to convert
into booked calls.

VISUAL DIRECTION
- Palette: deep navy or charcoal (#111827) with warm off-white, one
  confident accent (muted gold or steel blue) reserved for CTAs only.
- Typography: a refined serif or high-contrast sans for headlines, a
  neutral grotesk for body copy — measured, never playful.
- Layout: wide hero with a one-sentence value proposition, generous
  section padding, thin 1px borders instead of heavy shadows.

STRUCTURE
1. Hero — who you help and the outcome you deliver, one sentence.
   Primary CTA: "Book a call."
2. Case Studies — 2-4 entries framed Challenge → Approach → Result,
   one hard number per case.
3. Credentials strip — past clients or employers, in grayscale.
4. Services — three clear offers, scoped or priced. No "let's chat
   about everything."
5. Contact — a real calendar embed or booking link, plus email.

BUILD NOTES FOR CLAUDE CODE
- Server-light static build, optimized for fast first paint — this
  audience will not wait.
- Add schema.org Person / ProfessionalService markup for SEO and rich
  results.
- Wire a real booking link (Calendly or Cal.com) into the primary
  CTA — no dead buttons.
- Deploy to GitHub Pages with a custom domain via CNAME so it reads
  as a firm, not a student project.

# A stranger lands, understands the offer, and books —
# in under 30 seconds.
```

---

Clicking "Copy prompt" copies the currently-selected preset's full prompt text to the clipboard;
the button shows a checkmark and "Copied" for 1.8 seconds before reverting to "Copy prompt".

### Alumni Resource Vault (email capture)

A dark gradient panel (`linear-gradient(135deg, #1e1b4b 0%, #4338ca 55%, #059669 130%)`) with two
soft decorative circles, containing:

**Eyebrow pill:** "Alumni Resource Vault" (sparkle icon)

**Heading:** "Want more, after the course?"

**Body copy (verbatim):** "Leave your email if you're interested in a system-prompt library, a
deployment checklist, and future alumni build sessions. No spam, and no fixed schedule — just
added to the list."

**Perk chips:** "System prompt library", "Deployment checklist", "Alumni workshop access"

**Form:** an email input (placeholder `you@gmail.com`) plus a submit button ("Add my email" /
"Adding…" while submitting). Validates with the regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; on invalid
input shows: "That doesn't look like a valid email yet — check for typos and try again." On a
Firestore write failure it shows: "Something went wrong saving that — mind trying again?"

**On success**, the form is replaced with a confirmation card (green checkmark badge):
- "You're on the list."
- "No promises on timing — I'll reach out when there's something worth sharing."

### Send-off

A centered card closing the lesson:

**Heading:** "That's the course."

**Body (verbatim):** "This pipeline doesn't end with the course. Keep the repo, keep pushing
commits, and let an agent take the first pass so you can spend your time on the parts only you
can judge."

**Signature line:** "— Yasas Sri Wickramasinghe [linked: MBI800 Lecturer →
https://www.linkedin.com/in/yasassri/, opens in a new tab]"

There is no quiz, no scored activity, and no completion/progress tracking anywhere in this
lesson — it is a pipeline explainer plus a copy-paste prompt toolkit plus an optional email
signup.

## 3. UI & interaction design

This page is one of several public lessons that share `PublicLessonShell.tsx` as a common wrapper
(also used by, e.g., Five Stories and Systems Security). For this lesson specifically, the shell
is instantiated with:

- `eyebrow`: "MBI800 · Capstone Bonus Lecture"
- `titleLead` / `titleAccent`: "Let's make sense of" / "shipping your own site." (the accent
  portion is rendered with a gradient text-clip using `gradient`)
- `gradient`: `linear-gradient(90deg, #7c3aed, #4f46e5, #059669)` — a violet → indigo → emerald
  sweep, matching the three pipeline stages' individual colors in order.
- `accent` / `orb2` / `orb3`: `#7c3aed` / `#4f46e5` / `#059669` — drive the three blurred,
  drifting hero orbs and the eyebrow/link accent color.
- `subtitle`: "How to go from an idea to a live website in one sitting, using Google Stitch,
  Claude Code, and GitHub Pages."
- `pills`: three topic chips — 🎨 "Google Stitch 2.0" (violet), ⌘ "Claude Code (Web)" (indigo), 🚀
  "GitHub Pages" (emerald) — each rendered as a colored outlined pill under the hero subtitle.
- `children`: `<MBI800BonusLectureLesson />`.

Via the shell, the page gets (shared behavior, not re-derived here in detail): a sticky
translucent top nav with the `BrandLogo` linking to `/home`; an Apple-system-font hero with the
eyebrow/title/subtitle/pills animated in via `framer-motion` fades/rises, three large blurred
color-orb blobs positioned around the hero using the accent/orb2/orb3 colors, and a bouncing
"Scroll to begin" indicator; the lesson body mounted inside a `max-w-5xl` section; and a quiet
footer with the logo and the line "Everything here runs in your own browser. No login, no
personal data collected." (This footer line is a slight platform-wide simplification for this
specific lesson, since the Alumni Resource Vault form *does* write an email to Firestore if
submitted — see Section 4.)

Within the lesson body itself (`MBI800BonusLectureLesson.tsx`):

- A local scoped `<style>` block defines two keyframe animations: `mbc-rise` (fade + translateY
  rise, used for the post-submit confirmation card) and `mbc-glow-pulse` (a slow 4s breathing box
  shadow, used on the Alumni Resource Vault panel via the `mbc-glow` class).
- The three pipeline stage cards are stacked vertically, each a rounded, tinted, bordered card
  with a colored square icon badge, connected by centered `ArrowDown` icons between stages (not
  shown after the last stage).
- The Prompt Foundry preset picker is a 3-column responsive grid (`grid-cols-1 sm:grid-cols-3`)
  of selectable cards; the selected card is highlighted with its own tint color and border, the
  unselected cards are white with a faint border. Below the picker, a single dark
  "terminal/code editor" style panel shows the selected preset's filename (with a colored dot)
  and prompt text in a monospace, scrollable (`maxHeight: 440px`), pre-wrapped block.
- Colors throughout follow the three-stage palette consistently: violet `#7c3aed` (Stitch/
  Academic), indigo `#4f46e5` (Claude Code/Executive), emerald `#059669` (GitHub Pages/
  Innovator-adjacent, though the Innovator preset itself uses violet as its swatch color — note
  the Innovator preset's accent color `#7c3aed` reuses the Stitch/Academic violet rather than
  getting a fourth unique hue).
- The Vault panel and send-off card are full-width blocks below the Foundry, in that order,
  closing the page.
- No tabs, no multi-step wizard, no slide-deck pagination — the entire lesson is one continuous
  vertical scroll (`space-y-10` between major sections).

## 4. Component & state architecture

- `MBI800BonusLectureLesson` (default export) holds one piece of state: `activePreset` (string,
  default `'academic'`), used to look up the active `Preset` object from the `PRESETS` array and
  drive which prompt is shown/copyable in the Foundry's code panel.
- `STAGES: Stage[]` and `PRESETS: Preset[]` are module-level constant arrays (not fetched from
  anywhere) — three stages, three presets, defined with `id`/`number`/`tool`/`icon`/colors/
  `title`/`body`/`notes` (stages) or `key`/`label`/`for`/colors/`file`/`prompt` (presets).
- `CopyButton` is a small local component taking `text` and `color` props; on click it calls
  `navigator.clipboard.writeText(text)`, falling back to a hidden `<textarea>` +
  `document.execCommand('copy')` if the Clipboard API throws; it tracks a local `copied` boolean
  that flips back to false after 1800ms via `setTimeout`.
- `VaultGateway` is a local component (not exported, not reused elsewhere) with its own state:
  `email`, `error` (invalid-format flag), `submitError` (Firestore write failure flag), `loading`,
  `submitted`. Its `handleSubmit`:
  1. Trims the email and validates against `emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`; sets
     `error` and returns early if invalid.
  2. Clears `error`/`submitError`, sets `loading` true.
  3. Throws if `db` (the Firestore instance from `src/lib/firebase.ts`) is falsy — i.e. Firebase
     is not configured in this environment.
  4. Otherwise calls `addDoc(collection(db, 'bonusLectureSignups'), { email, submittedAt:
     serverTimestamp(), source: 'bonus-lecture' })`.
  5. On success, sets `submitted` true (swaps the form for the confirmation card). On failure,
     logs `console.error('[MBI800 Bonus Lecture] Signup failed:', err)` and sets `submitError`
     true. `loading` is reset to false in a `finally` block either way.
- No other Firestore reads/writes exist in this lesson. No gating/unlock logic, no scoring, no
  badge-award triggers — this is a purely presentational + one-write-path lesson.
- `MBI800BonusLecturePage` (the route component) itself holds no state — it is a pure
  configuration wrapper around `PublicLessonShell`.

## 5. Rebuild notes

- **This is the only MBI800 public lesson with a Firestore write.** The other public MBI800
  lessons (Five Stories, Platform Strategy, Systems Security, XR Explorer) are described elsewhere
  in this doc set as browser-only/no-Firebase; this lesson's Alumni Resource Vault is an
  exception and depends on `src/lib/firebase.ts` being configured with valid Firebase env vars,
  or the signup form will always fail with the "Something went wrong saving that" error (the `db`
  check throws before ever reaching Firestore).
- **No admin/consumer UI was found for the `bonusLectureSignups` collection** in the scope of the
  files read for this doc — this write-only lesson does not appear in `CourseResources.tsx` or
  any admin dashboard reviewed. Whether the collected emails are read anywhere else in the app is
  unclear from this lesson's source alone and should be verified against admin/CRM-adjacent pages
  if rebuilding a full data pipeline around it.
- **The "Innovator" preset's accent color (`#7c3aed`) duplicates the Academic preset's color** —
  both use the same violet, while the pipeline's Stage 01 (Stitch) also uses `#7c3aed`. This
  appears to be an intentional palette choice (reusing the pipeline's three core colors:
  `#7c3aed`/`#4f46e5`/`#059669`) since Executive uses `#4f46e5` (matching Claude Code) and
  Academic/Innovator both land on `#7c3aed` — worth flagging as a minor visual ambiguity (two of
  three preset cards share a highlight color) rather than a bug, since no other color reuse issue
  was found.
- **External link**: `https://www.linkedin.com/in/yasassri/` (lecturer's LinkedIn, in the
  signature line) should be revalidated periodically like any personal social link.
- **No images/SVGs/videos** are referenced by this lesson — all visuals are CSS gradients, blurred
  color orbs, and `lucide-react` icon glyphs.
- **Bracketed placeholders in the prompt text** (`[YOUR NAME]`, `[FIELD]`) are intentional —
  they are meant to be filled in by the student before pasting into Stitch/Claude Code, not a
  templating bug in this codebase.
- The route page file is 24 lines (not 25 as a rough initial estimate suggested); this is
  confirmed by direct read of `src/pages/MBI800BonusLecturePage.tsx`.
