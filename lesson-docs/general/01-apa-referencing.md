# APA 7 Citations: The Crash Course — General

- **Subject:** General / cross-subject (not tied to MBI800, MBI802, or MBI804 — it is generic
  academic-writing skills content offered to every student regardless of course).
- **Gating:** Both — a non-gated public standalone page **and** an always-visible embedded copy
  inside the gated Course Resources hub, both rendering the *same* component
  (`APAReferencingDeck`). See "The always-visible mechanic" below for how the gated copy differs
  from an ordinary per-subject gated lesson.
- **Route(s):** `/apa-referencing` (public). The gated copy has no route of its own — it renders
  inline inside `/student/course-resources` when the student expands the "APA 7 Citations: The
  Crash Course" lesson row under the `GENERAL` course bucket.
- **Source files:**
  - `src/pages/APAReferencingPage.tsx` — the public page: wraps the deck in `PublicLessonShell`
    (shared hero/nav/footer chrome used by other standalone public lessons) with page-specific
    copy, gradient, and topic pills.
  - `src/components/slides/APAReferencingDeck.tsx` — the entire lesson: a 14-slide HTML/CSS deck
    (`SLIDES` array), an internal `APAQuiz` component (`QUIZ_QUESTIONS` array, 8 questions), and
    a client-side password gate wrapping the whole component.
  - `src/pages/student/CourseResources.tsx` — defines the `GENERAL` entry in the `COURSES` array
    (`id: 'GENERAL'`, `alwaysVisible: true`) containing one lesson (`id: 'apa-referencing'`), and
    mounts `<APAReferencingDeck />` when `lesson.id === 'apa-referencing'` (around line 1797).
- **Depends on:** `lucide-react` icons (`ChevronLeft`, `ChevronRight`, `Maximize2`, `Minimize2`,
  `Maximize`, `Minimize`, `CheckCircle`, `XCircle`, `RotateCcw`, `Lock`, `Eye`, `EyeOff`); Google
  Fonts `Inter` and `Lora` (loaded via an `@import` inside the deck's injected `<style>` tag);
  browser `sessionStorage` (key `apa-v7-unlocked`) for the deck's own password gate; the
  Fullscreen API and `ResizeObserver` for slide scaling. No Firestore reads/writes anywhere in
  this lesson — the quiz keeps no server-side record of scores ("No data stored", per the deck's
  own quiz subheading). `src/components/public/PublicLessonShell.tsx` supplies the public page's
  shared hero/nav/footer chrome.

## 1. Purpose & learning objectives

A self-contained crash course teaching APA 7th-edition citation mechanics — not tied to any one
subject, since every MBI800/802/804 assignment requires citations. It exists so students have one
canonical, always-reachable reference for "how do I cite this" instead of hunting through
external guides, and it's deliberately positioned as basic academic-writing infrastructure: it is
reachable with no login at all (`/apa-referencing`) *and* pinned permanently into every logged-in
student's Course Resources view regardless of which courses they're enrolled in.

By the end, a student should be able to: explain why citations matter (credibility, protection
against plagiarism accusations, joining scholarly conversation); judge when a citation is and
isn't required; correctly format parenthetical and narrative in-text citations, including the
APA 7 change to `et al.` usage for 3+ authors; distinguish short (<40 words) from block (40+
words) quote formatting; build a four-part reference entry (Who/When/What/Where) for the most
common source types (journal article, book, webpage, book chapter, conference paper, software);
and avoid the five most common APA mistakes (misusing `et al.`, using `ibid.`/`op. cit.`, citing
only an abstract, padding the reference list, and missing/malformed DOIs). A closing 8-question
quiz checks retention.

## 2. Full content

The deck itself is gated behind a **second, independent password prompt** baked into the
component (separate from any platform login): a "Password Required" card reading "APA v7
Citations: The Crash Course" with a masked input (toggleable via an eye icon) and the message
"This resource is password-protected. Enter the access password provided by your lecturer." The
required password is **`APAV7`** (case-insensitive, matched via
`pwInput.trim().toUpperCase() === 'APAV7'`); on success it is remembered for the browser session
via `sessionStorage.setItem('apa-v7-unlocked', 'true')`. This gate applies identically on both the
public page and the embedded gated copy, since both render the same component. An incorrect
password shows "Incorrect password — please try again." and clears the input.

Once unlocked, the deck presents 14 fixed 1920×1080 HTML/CSS slides (rendered via
`dangerouslySetInnerHTML`, scaled to fit the container width) navigable by arrow buttons, arrow
keys, or a dot-navigation strip, plus expand/fullscreen controls. Full slide-by-slide content:

**Slide 1 — Title.** "APA **7** Citations" / "The Crash Course" (italic serif subtitle).
Body: "Everything you need to cite correctly — from the first in-text citation to the last
reference entry. Built for your assignments. No textbooks required." Badges: "14 Slides",
"Interactive Examples", "Reference Templates", "Practice Quiz Included". Eyebrow: "General
Resources · Academic Writing Skills".

**Slide 2 — Why Even Bother Citing?** Three pillar cards:
- 🛡️ **They Protect You** — "Using someone's idea without credit is plagiarism — even
  accidentally. A citation is your proof you know the difference between your thinking and
  someone else's. No citation = no defence." (tag: "Academic integrity shield")
- 💪 **They Strengthen You** — contrasts `"Immersion increases presence"` (opinion) vs.
  `"Immersion increases presence (Slater, 2009)"` (claim backed by a decade of VR research); "Same
  sentence. Completely different weight." (tag: "Evidence = credibility")
- 💬 **They Invite Conversation** — "Academic writing isn't a monologue — it's you positioning
  your ideas within an ongoing scholarly debate. Citations show you've been listening, and you
  know who said what first." (tag: "Join the scholarly conversation")
Callout: "The 'says who?' test: Imagine your examiner asking 'says who?' after every claim you
make. Citations are your answer. Without them, you're just asserting things into the void."

**Slide 3 — Same Sentence. Different Weight.** Side-by-side comparison.
- ❌ Without citation: `"Scientists say coffee makes you smarter."` — consequences listed: examiner
  asks "Which scientists? Where? When?"; sounds like an unverified social-media claim; could be
  penalised for unsupported assertion; if it's someone else's idea, this is plagiarism. Note:
  "Your friend (the examiner) is far less forgiving."
- ✅ With citation: `"Caffeine consumption has been associated with enhanced cognitive performance
  in controlled studies (Smith et al., 2021, p. 14)."` — consequences: reader can verify the
  source independently; shows engagement with academic literature; demonstrates scholarly
  credibility; protected against plagiarism accusation. Note: "Same idea. Now it's a verifiable
  academic claim."

**Slide 4 — When TO Cite (interactive, click each card to reveal).** Six click-to-reveal cards:
1. 📊 **Facts, statistics & findings** — "Any fact that came from a specific study, dataset, or
   report. Even if widely known within your field, if it has a source — cite it. E.g. '87% of
   Agile teams use Scrum' needs the State of Agile report."
2. 💡 **Arguments & theories** — "Someone else's argument, model, or framework. Even if you're
   paraphrasing it — you're using their intellectual work. Presence theory (Witmer & Singer),
   Agile Manifesto, TAM model — all need citations."
3. 📖 **Definitions** — "Especially contested or field-specific definitions. 'Presence is defined
   as...' is someone's definition — whose? Even for widely agreed terms, citing the first/key
   theorist shows depth and awareness."
4. 💬 **Direct quotes** — "Obviously. Any word-for-word text from a source requires quote marks +
   author + year + page number. Even a single distinctive phrase taken verbatim needs a
   page-level citation."
5. 📏 **Scales & instruments** — "Surveys, questionnaires, measurement scales, or research
   instruments designed by others. The Presence Questionnaire, SUS, TAM scales — all have
   original authors who must be credited."
6. ✍️ **Your own prior work** — "Yes — even your own previously published work. Reusing your own
   ideas without citing yourself is called self-plagiarism. If you published it elsewhere, treat
   it like any other source."

**Slide 5 — When NOT to Cite.** Callout: "Over-citing clutters your writing and actually signals
low confidence — it looks like you can't tell what's common knowledge and what isn't." Four
non-citation cases:
- 🌐 **Common knowledge** — "'The internet is widely used' — no citation needed. Any reasonably
  educated person already knows this."
- 🔢 **Mathematical or logical facts** — "'The sample had 24 participants split into 4 groups of
  6' — this is your own arithmetic. No source needed."
- 🧠 **Your own original analysis** — "Your interpretation, argument, and conclusions are your
  contribution. Don't undercut it by citing someone else — own it."
- 🔬 **Your own firsthand observations** — "Things you observed, measured, or found in your own
  study. 'Participants reported feeling dizzy' — this is your data."
"The Test": "Would a reasonable person in your field consider this general knowledge? If yes → no
citation. If there's any doubt → cite it. When in doubt, cite."

**Slide 6 — The Core Rule.** "One In-Text → One Entry. Always." "Every in-text citation has
exactly one matching entry in the reference list. Every reference list entry is cited somewhere
in the text. No orphans. No extras." Two failure modes: ❌ **ORPHAN** ("A reference list entry
with no matching in-text citation. You read it, but never cited it. Remove it — APA is not a
bibliography.") and ❌ **GHOST** ("An in-text citation (Brown, 2021) with no matching reference
list entry. Always fatal — the reader can't find the source."). Diagram: In-Text Citation box
`(Slater, 2009, p. 12)` / `Smith and Jones (2021)` ↕ "One-to-one match" ↕ Reference List Entry box
`Slater, M. (2009). Place illusion... Phil. Trans. R. Soc. B, 364...`.

**Slide 7 — Two Flavours of In-Text Citation.**
- **1 — Parenthetical** (citation lives in brackets at the end). Example: "Virtual environments
  have been shown to enhance spatial memory (Bowman & McMahan, 2007)." Use when: "The idea
  matters more than the person who said it. You're reporting a finding, not engaging with a
  specific author's argument." Format: `(Author, Year)` or `(Author, Year, p. N)`.
- **2 — Narrative** (author is part of the sentence, year follows in brackets). Example: "Bowman
  and McMahan (2007) demonstrated that virtual environments enhance spatial memory." Use when:
  "You're specifically engaging with who said something. You're introducing their argument,
  critiquing it, or contrasting it with another author's view." Format: `Author (Year) verb...`
  or `Author and Author (Year)...`.

**Slide 8 — The Author–Year Cheat Sheet.** Table (Situation / Format / Example):
| Situation | Format | Example |
|---|---|---|
| 1 author | (Author, Year) | (Slater, 2009) |
| 2 authors | (Author & Author, Year) | (Slater & Sanchez-Vives, 2016) |
| ⭐ 3+ authors — APA 7 change! | First author + et al., from first use | (Cummings et al., 2020) |
| Organisation (first mention) | (Full Name [ABBR], Year) | (World Health Organization [WHO], 2022) |
| Organisation (subsequent) | (Abbreviation, Year) | (WHO, 2022) |
| No date available | (Author, n.d.) | (Smith, n.d.) |
| Same author, same year | (Author, Yeara, Yearb) | (Brown, 2021a, 2021b) |
| Multiple sources together | (Auth1 & Auth2, Year; Auth3, Year) | (Milgram & Kishino, 1994; Witmer & Singer, 1998) |
| Direct quote | (Author, Year, p. N) | (Witmer & Singer, 1998, p. 225) |
Footer callout: "⭐ APA 7 key change: Three or more authors → use et al. from the very FIRST
citation. APA 6 made you write all names up to 5 authors first. That rule is gone."

**Slide 9 — Short Quotes: Under 40 Words.** Worked example: `Presence is defined as "the
subjective experience of being in one place or environment, even when one is physically situated
in another" (Witmer & Singer, 1998, p. 225).` ✅ Format Rules: quotation marks around the exact
words; inline — do not break to a new paragraph; page number is required (p. 225); citation at
end, before the full stop. ❌ Common Errors: missing page number on a direct quote; using a block
quote format for under 40 words; altering words inside the quote without [brackets]; overusing
quotes — paraphrase instead. Callout: "Honest advice: Your examiner wants to see you synthesise
ideas, not collect them. Use direct quotes only when the exact wording matters — definitions, key
terms, pivotal statements. A paraphrase that cites correctly shows more skill."

**Slide 10 — Block Quotes: 40+ Words.** Worked example (introduced narratively): "Slater (2018)
argued:" followed by an indented block — "The concept of presence is not simply about visual
fidelity but rather about the degree to which the virtual environment responds to the actions of
the participant. A high-fidelity environment that does not react to user input will produce lower
presence than a lower-fidelity, richly interactive one. (p. 431)". Format note: "The author + year
introduce the quote (narrative style), then the page number appears in brackets after the final
full stop — not before it. This is reversed from short quotes." Block Quote Rules: new paragraph
for the quote; indent the entire block (0.5 inch / ~1.27 cm); no quotation marks; page number in
brackets after the final stop; introduce with a colon or "X argued:" or "According to X (Year):".
Comparison table: Under 40 words → "Inline, quotation marks, citation before the stop"; 40+ words
→ "Indented block, no quotes, citation after the stop".

**Slide 11 — Every Reference Has Four Parts.** Four cards: 👤 **WHO** ("Last name, Initials. For
multiple: Last, I., & Last, I." — example `Slater, M.`), 📅 **WHEN** ("Publication year in
brackets. Use n.d. if no date." — example `(2009).`), 📄 **WHAT** ("Title in sentence case.
Book/journal titles in italics." — example `Place illusion...`), 🌐 **WHERE** ("Publisher,
journal, DOI, or URL. Always prefer DOI." — example `https://doi.org/...`). Full worked reference,
color-coded by part: `Slater, M. (2009). Place illusion and plausibility can lead to realistic
behaviour in immersive virtual environments. Philosophical Transactions of the Royal Society B,
364(1535), 3549–3557. https://doi.org/10.1098/rstb.2009.0138`. Below it, a proportional bar
labelled WHO / WHEN / WHAT (title + journal) / WHERE (DOI).

**Slide 12 — Reference Examples (Journal, Book, Webpage).**
- 📰 **Journal Article**: `Slater, M. (2009). Place illusion and plausibility can lead to
  realistic behaviour in immersive virtual environments. Philosophical Transactions of the Royal
  Society B, 364(1535), 3549–3557. https://doi.org/10.1098/rstb.2009.0138` — notes: article title
  sentence case, no italics; journal name Title Case, italicised; always use https://doi.org/
  prefix.
- 📚 **Book**: `Sherman, W. R., & Craig, A. B. (2018). Understanding virtual reality: Interface,
  application, and design (2nd ed.). Morgan Kaufmann.` — notes: book title italicised, sentence
  case; edition in brackets if not first ed.; publisher name only (no location in APA 7).
- 🌐 **Webpage**: `University of Canterbury. (2023, August 1). HIT Lab NZ research overview.
  https://www.hitlabnz.org` — notes: include the specific date if shown on page; page title in
  italics, sentence case; no "Retrieved from" in APA 7.

**Slide 13 — More Reference Types (Chapter, Conference, Software).**
- 📑 **Book Chapter (Edited)**: `McMahan, R. P. (2017). Exploring the effects of higher-fidelity
  display and interaction. In F. R. Nack & A. S. Gordon (Eds.), Interactive storytelling (pp.
  59–68). Springer.` — notes: chapter author is first; editors after "In"; only the book title is
  italicised; page range in (pp. x–x) format.
- 🎤 **Conference Paper**: `Bowman, D. A., & McMahan, R. P. (2007). Virtual reality: How much
  immersion is enough? In Proceedings of the ACM CHI Conference (pp. 36–43). ACM.
  https://doi.org/10.1145/xxxxxxx` — notes: proceedings title italicised (like a book); include
  publisher (ACM, IEEE, Springer…); DOI strongly preferred over URL.
- 💻 **Software / App**: `Unity Technologies. (2023). Unity (Version 2022.3 LTS) [Computer
  software]. https://unity.com` — notes: software name italicised; version number in regular
  brackets; [Computer software] descriptor after title.
Footer citation: "Based on: American Psychological Association. (2020). Publication manual of the
American Psychological Association (7th ed.). https://doi.org/10.1037/0000165-000".

**Slide 14 — Five Mistakes to Avoid (interactive, click each card to reveal the fix).**
1. 🔀 **Confusing et al. when names clash** — "Two papers share first authors + year. APA says
   write enough names to distinguish them — then et al. Don't assume the first name is enough."
2. 👻 **Using ibid. or op. cit.** — "These footnote shorthand terms belong to Chicago/Oxford style.
   APA never uses them. Ever. Just repeat the full author–year citation each time."
3. 👁️ **Citing only the abstract** — "If you only read the abstract, you only read part of the
   paper. Don't cite findings from sections you haven't read. Read the paper. Then cite it."
4. 📋 **Padding the reference list** — "APA reference list = only sources cited in the text.
   Nothing extra. A bibliography includes background reading — APA doesn't. Remove anything you
   didn't cite."
5. 🔗 **Missing DOIs / using raw URLs** — "Always search for a DOI before using a plain URL. DOIs
   are permanent — URLs rot. Always prefix: https://doi.org/ not dx.doi.org or just the number."
Footer: "📚 Reference: American Psychological Association. (2020). Publication manual of the APA
(7th ed.) · Scroll to the quiz below to test your knowledge".

**Practice quiz — "APA 7 Citation Quiz" (8 questions, one at a time, dot navigation, instant
per-question feedback, final score screen, "Retry" resets everything, "No data stored"):**

1. "In APA 7, how do you cite a source with 3 or more authors for the very first time?"
   Options: "Write all author names in full" / "First author + et al., from the first citation"
   (correct) / "Write first 3 names, then et al." / "Write only the first author's last name".
   Explain: "APA 7 changed this from APA 6: use et al. from the very first citation for 3+
   authors. APA 6 required all names up to 5 authors on first mention."
2. "What does 'n.d.' stand for in a citation like (Smith, n.d.)?" Options: "Not documented" / "No
   date" (correct) / "Not determined" / "No digital copy". Explain: "n.d. stands for 'no date' —
   used when a source has no identifiable publication date. Common for some websites and
   unpublished works."
3. "What is the minimum word count that triggers a block quote in APA 7?" Options: "25 words" /
   "30 words" / "40 words" (correct) / "50 words". Explain: "40 or more words = block quote.
   Format: new paragraph, indented, no quotation marks, citation after the full stop."
4. "Which is the correct APA 7 in-text format for two authors?" Options: "(Brown and Jones, 2021)"
   / "(Brown & Jones, 2021)" (correct) / "(Brown, Jones, 2021)" / "(Brown-Jones, 2021)". Explain:
   "Two authors use an ampersand (&) inside brackets. When authors are part of the narrative
   sentence, use 'and' — e.g., Brown and Jones (2021)."
5. "In what order do you arrange the APA 7 reference list?" Options: "By year (newest first)" /
   "Alphabetically by first author's surname" (correct) / "Order of first appearance in text" /
   "By type (books before articles)". Explain: "APA reference lists are always alphabetical by the
   first author's surname. Same-author entries are then sorted by year, oldest first."
6. "Which DOI format is correct in APA 7?" Options: "doi:10.1234/example" /
   "dx.doi.org/10.1234/example" / "https://doi.org/10.1234/example" (correct) /
   "10.1234/example". Explain: "Always use https://doi.org/ as the prefix. The older dx.doi.org
   format is no longer recommended, and a bare number is incomplete."
7. "Which title capitalisation is correct for a journal ARTICLE in APA 7?" Options: '"The Role of
   Presence in Virtual Reality" (Title Case)' / '"The role of presence in virtual reality"
   (Sentence case)' (correct) / '"THE ROLE OF PRESENCE IN VIRTUAL REALITY" (ALL CAPS)' / '"the
   role of presence in virtual reality" (all lowercase)'. Explain: "Article titles use sentence
   case: only the first word, proper nouns, and the first word after a colon are capitalised.
   Journal names stay in Title Case and are italicised."
8. "A paper has 5 reference list entries that are never cited in the text. What is the issue?"
   Options: "Nothing — APA uses bibliographies this way" / "APA reference lists must only contain
   sources actually cited in the text" (correct) / "The paper needs more in-text citations for
   each entry" / "The reference list is too long; remove all 5". Explain: "An APA reference list ≠
   bibliography. Only sources you actually cited go in the reference list. Remove anything
   uncited — it's not a 'further reading' list."

Score screen shows an emoji tier (🏆 ≥90%, 🎉 ≥70%, 📚 ≥50%, 💪 below), score fraction, percentage,
a message ("Perfect! You have mastered APA 7 citations." / "Great work — a couple of areas to
review." / "Go back through the slides and try again."), and a per-question review list showing
each question, the student's wrong answer (if any), the correct answer, and the explanation.

Every slide ends with a footer line: "© All rights reserved · Yasas Sri Wickramasinghe".

## 3. UI & interaction design

- **Deck canvas:** fixed 1920×1080 logical slide canvas scaled via CSS `transform: scale()` to
  fit the wrapper's width (tracked with a `ResizeObserver`); slide HTML is injected via
  `dangerouslySetInnerHTML` and styled by a single large CSS string (`DECK_CSS`) appended to
  `document.head` as a `<style id="apa-deck-styles">` tag on mount and removed on unmount.
- **Palette:** indigo/navy primary (`--indigo2: #4338ca`, `--navy2: #1e1b4b`) with amber/gold,
  teal, rose, and green accents used per-slide-type (e.g. warm amber background for the "When NOT
  to cite" slide, dark navy for title/mistakes slides). Two Google Fonts: Inter (UI/body) and
  Lora (italic serif for direct quotes).
- **Navigation:** previous/next chevron buttons plus a slide counter ("N / 14"), a dot-navigation
  strip (active dot widens to a pill), left/right/up/down arrow-key navigation, an expand toggle,
  and a fullscreen toggle (uses the native Fullscreen API on the deck's wrapper div; Escape exits
  fullscreen).
- **Interactive slide elements:** slides 4 and 14 use plain DOM `onclick` handlers embedded in the
  HTML strings (`this.setAttribute('data-revealed','true')` / toggling `data-open`) rather than
  React state, since the slide markup itself is raw HTML — clicking a "cite card" or "mistake
  card" reveals hidden content via a CSS `[data-revealed='true']` / `[data-open='true']` selector,
  with a hover-lift animation (`translateY(-6px) scale(1.02)`).
  animations use CSS keyframes (`apa-fadeUp` staggered per-element via `.fu1`–`.fu6` classes,
  `apa-pulse` ring pulse, `apa-float`, `apa-glow`, `apa-bounce`).
- **Password gate screen:** centered card, indigo gradient header with a lock icon, masked
  password input with an eye-icon show/hide toggle, shake-free static error text on failure.
- **Quiz UI:** separate from the slide canvas, rendered below the dot navigation — a rounded card
  with an indigo gradient header, a thin progress bar, one question per screen with lettered
  (A/B/C/D) answer buttons, inline correct/incorrect colour feedback and explanation after
  answering, Previous/Next navigation plus a dot strip mirroring per-question answered/correct
  state, and a "Submit Quiz" button (disabled until all 8 are answered) that reveals the results
  screen with a "Retry" button to reset.
- Responsive: the deck canvas scales proportionally to any container width; the quiz and controls
  use Tailwind utility classes and wrap on small screens (`flex-wrap`).

## 4. Component & state architecture

- **`APAReferencingDeck` (default export)** — top-level state: `unlocked`/`pwInput`/`pwError`/
  `showPw` for the password gate (persisted via `sessionStorage['apa-v7-unlocked']`); `current`
  (slide index), `expanded`, `fullscreen` for deck navigation. Refs: `wrapRef`/`canvasRef` for the
  `ResizeObserver`-driven scale transform. Effects: inject/remove the `DECK_CSS` `<style>` tag;
  observe wrapper resize to rescale the canvas; listen for arrow-key navigation and `Escape`;
  listen for `fullscreenchange` to sync `fullscreen` state.
- **`APAQuiz` (internal component)** — state: `answers` (array of `number | null`, one per
  question), `submitted` (boolean), `current` (question index). Derives `score`/`pct` once
  submitted; `choose(idx)` records an answer (no-op if already submitted); `reset()` clears
  everything back to the first question. All state is local to the component instance — nothing
  persists across a page reload, and no Firestore writes occur (the deck explicitly advertises "No
  data stored").
- No props are passed into `APAReferencingDeck` from either caller (`APAReferencingPage.tsx` or
  `CourseResources.tsx`) — it is fully self-contained and renders identically in both places.
- No badge-award or scoring hooks tie into this lesson; it is disconnected from the platform's
  Firestore-backed badge system (`src/lib/badgeData.ts` — see `05-skill-passport.md`) even though
  it has its own internal quiz.

### The always-visible mechanic (gated copy)

`src/pages/student/CourseResources.tsx` defines a `Course` interface with an optional
`alwaysVisible?: boolean` field. The `COURSES` array's `GENERAL` entry sets
`alwaysVisible: true`:

```ts
{
  id: 'GENERAL',
  name: 'GENERAL',
  tagline: 'General Resources for All Students',
  accentColor: '#4338ca',
  bgGradient: 'linear-gradient(135deg, rgba(67,56,202,0.08), rgba(99,102,241,0.04))',
  alwaysVisible: true,
  lessons: [
    {
      id: 'apa-referencing',
      title: 'APA 7 Citations: The Crash Course',
      subtitle: '14-slide interactive deck · In-text citations, reference types, common mistakes · Includes a practice quiz',
      icon: <BookOpen size={18} />,
      accentColor: '#4338ca',
    },
  ],
},
```

The page filters which course tabs a student sees with:

```ts
const visibleCourses = COURSES.filter(
  c => isStaff || c.alwaysVisible || enrolledSubjects.includes(c.id)
);
```

Ordinary per-subject courses (MBI800/MBI802/MBI804) only show up if the logged-in student's
`studentProfile.subjects` array includes that course code. `GENERAL` bypasses that check entirely
via `alwaysVisible`, so every authenticated student sees the GENERAL tab and its APA lesson no
matter what they're enrolled in — this is the "Both" gating case: identical component, one
reachable with zero login (`/apa-referencing`), one pinned unconditionally inside the gated hub.
Content mounting for the gated copy is the same conditional pattern used for every other embedded
lesson: `{lesson.id === 'apa-referencing' && <APAReferencingDeck />}` inside the lesson-row
accordion body.

## 5. Rebuild notes

- **Two independent gates stack on the gated copy**: a student must first be logged in as
  `student` (`ProtectedRoute allowedRoles={['student']}` on `/student/course-resources`), *then*
  still has to enter the in-component password `APAV7` to actually see the deck — the platform
  login does not bypass the deck's own password gate. On the public route, the `APAV7` password is
  the only gate.
- The password `APAV7` and the admin-style `sessionStorage` unlock pattern (`SESSION_KEY =
  'apa-v7-unlocked'`) is hardcoded client-side in the bundle — trivially discoverable by reading
  source, consistent with other lesson decks in this codebase that use the same lightweight
  "keep casual visitors out, not a real security boundary" pattern.
- All 14 slides are raw HTML strings injected via `dangerouslySetInnerHTML`, not JSX — a rebuild
  must preserve this pattern (or deliberately migrate to JSX) since the `onclick` handlers for
  the two interactive slides (4 and 14) are plain inline JS strings operating on DOM attributes,
  not React event handlers.
- No external asset files (images/SVGs/video) are referenced — all visuals are CSS
  gradients/shapes and emoji glyphs. The only external resource is the Google Fonts `@import` for
  Inter and Lora.
- No links to revalidate — the deck contains no outbound `<a href>` links; its only "external
  reference" is the citation-manual mention of the APA Publication Manual (7th ed.),
  `https://doi.org/10.1037/0000165-000`, quoted as example content rather than a clickable link.
- Copyright footer "© All rights reserved · Yasas Sri Wickramasinghe" appears on every slide —
  preserve verbatim in any rebuild.
