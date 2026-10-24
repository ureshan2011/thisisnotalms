# APA 7 Citations: The Crash Course — MBI800

- **Subject:** MBI800 — Strategic Information Systems Planning. It is generic academic-writing
  content that every course's assignments need, but it is listed on the MBI800 course page (kind
  `Reference`), so it is filed here. It was previously filed under `general/` as a cross-subject
  resource.
- **Gating:** Non-gated (public), with **no password**. The old version was a 14-slide deck behind a
  client-side password (`APAV7`), with a second always-visible copy inside the gated Course
  Resources hub. Both are gone: the deck component was deleted, the `GENERAL` bucket was removed
  from `CourseResources.tsx`, and the one public page has no gate of any kind.
- **Route(s):** `/apa-referencing`
- **Source files:**
  - `src/pages/APAReferencingPage.tsx` — the route page. A Blend `CoursePage` on the `planning`
    accent (MBI800's indigo), with the hero (headline "Every claim needs a source.", lede, two
    buttons, and a hero object showing one reference split into Who / When / What / Where) and the
    section nav.
  - `src/components/public/APAReferencingLesson.tsx` — the whole lesson body: lesson header, six
    teaching sections, an 8-question `Quiz`, a `Recap`, and the copyright line.
  - `src/content/courses.ts` — the lesson is the `apa-referencing` entry in `MBI800.lessons`
    (before `study-packs`), `kind: 'Reference'`, `access: 'open'`. It is no longer in
    `GENERAL_RESOURCES`.
  - `src/pages/HomePage.tsx` — the home-page card for `/apa-referencing` (eyebrow
    "MBI800 · Academic writing").
  - `src/App.tsx` — the route is registered in both `AppRoutes` and `ShutdownRoutes`, unchanged.
- **Depends on:** the Blend design system (`src/components/blend/`: `CoursePage`, `SectionHead`,
  `Reveal`, `Quiz`, `Recap`; stylesheet `src/styles/blend.css`), `framer-motion` (hero entrance on
  the page file). No Firestore, no `sessionStorage`, no `localStorage`: nothing is stored, and the
  quiz keeps no score.

## 1. Purpose & learning objectives

One canonical, always-reachable answer to "how do I cite this", for every assignment in the course.
Open it with no login and no password.

By the end a student can: say why a claim needs a citation and tell when it does not; write
parenthetical and narrative in-text citations, including the APA 7 rule of et al. from the first
citation for three or more authors; tell a short quotation (under 40 words) from a block quotation
(40 or more) and format each; build a reference entry from its four parts for the six common source
types; and spot the five mistakes that cost the most marks.

## 2. Full content

Lesson header: "APA 7 citations: the crash course", eyebrow "Academic writing", meta "Reading 20
minutes · Assumes nothing · Ends with an 8-question check", and the five objectives above as hollow
rings.

**1 · Why bother citing? (`#why`)** Three cards: *They protect you* (plagiarism, even by accident;
no citation, no defence), *They strengthen you* ("Immersion increases presence" against "Immersion
increases presence (Slater, 2009)"; same sentence, different weight), *They invite conversation*
(you place your ideas inside a debate that was already going). A callout, "The 'says who?' test":
imagine your marker asking "says who?" after every claim. Then "Same sentence, different weight":
"Scientists say coffee makes you smarter." (four problems: which scientists, sounds like an
unverified social media claim, marked down as unsupported, plagiarism if it is someone else's idea)
against "Caffeine consumption has been associated with enhanced cognitive performance in controlled
studies (Smith et al., 2021, p. 14)." (a reader can check it, engages the literature, reads as a
claim, protects against plagiarism).

**2 · When to cite, and when not (`#when`)** Six tap-to-reveal cards, "Cite it": facts, statistics
and findings ("87% of Agile teams use Scrum" needs the State of Agile report); arguments and theories
(presence theory, the Agile Manifesto, the TAM model); definitions; direct quotes (quote marks +
author + year + page); scales and instruments (Presence Questionnaire, SUS, TAM scales); your own
earlier work (self-plagiarism). Four rows, "Leave it uncited": common knowledge, mathematical or
logical facts, your own original analysis, your own firsthand observations. Callout "The test":
would a reasonable person in your field consider this general knowledge? If there is any doubt,
cite it.

**3 · In-text citations (`#intext`)** The core rule, "One in-text citation, one entry. Always."
Two failure cards: *Orphan* (an entry nobody cites; APA is not a bibliography) and *Ghost* (a
citation such as (Brown, 2021) with no entry). A table pairing the in-text forms `(Slater, 2009,
p. 12)` and `Slater (2009)` with the Slater reference entry. Two cards for the two flavours:
*Parenthetical* ("…spatial memory (Bowman & McMahan, 2007)."; use when the idea matters more than the
person; `(Author, Year)` or `(Author, Year, p. N)`) and *Narrative* ("Bowman and McMahan (2007)
demonstrated…"; use when engaging with who said it; `Author (Year) verb…`). The author–year cheat
sheet, nine rows (Situation / Format / Example): one author `(Slater, 2009)`; two authors
`(Slater & Sanchez-Vives, 2016)`; three or more `(Cummings et al., 2020)` from the first use;
organisation first mention `(World Health Organization [WHO], 2022)`; after that `(WHO, 2022)`; no
date `(Smith, n.d.)`; same author same year `(Brown, 2021a, 2021b)`; several sources
`(Milgram & Kishino, 1994; Witmer & Singer, 1998)`; direct quote `(Witmer & Singer, 1998, p. 225)`.
Callout "The APA 7 change": et al. from the very first citation; APA 6's write-every-name-up-to-five
rule is gone.

**4 · Short quotes and block quotes (`#quotes`)** *Under 40 words:* Presence is defined as "the
subjective experience of being in one place or environment, even when one is physically situated in
another" (Witmer & Singer, 1998, p. 225). Format: quotation marks, inline, page number required,
citation before the full stop. Common errors: no page number, block format for under 40 words,
altering words without [brackets], quoting when you should paraphrase. *40 words or more:* "Slater
(2018) argued:" then an indented block, no quotation marks, ending "(p. 431)". Rules: new line,
indent about 1.27 cm, no quotation marks, introduce with a colon, "X argued:" or "According to X
(Year):". The page number goes in brackets after the final full stop, the reverse of a short quote.
A two-row comparison table, and a closing note that a correctly cited paraphrase shows more skill
than a quote.

**5 · The reference list (`#reference`)** Interactive 1: tabs Who / When / What / Where highlight
that part of one worked entry, `Slater, M. (2009). Place illusion and plausibility can lead to
realistic behaviour in immersive virtual environments. *Philosophical Transactions of the Royal
Society B, 364*(1535), 3549–3557. https://doi.org/10.1098/rstb.2009.0138`, with a one-line rule for
each part (Where = journal, volume, issue, pages or publisher, then a DOI; prefer a DOI to a URL).
Interactive 2: six source-type tabs, each showing a correctly formatted entry with italics and three
notes: journal article (Slater, 2009), book (Sherman & Craig, 2018, *Understanding virtual reality*,
2nd ed., Morgan Kaufmann), webpage (University of Canterbury, 2023, *HIT Lab NZ research overview*),
book chapter (Steuer, 1995, in Biocca & Levy (Eds.), *Communication in the age of virtual reality*,
pp. 33–56, Lawrence Erlbaum Associates), conference paper (Sutherland, 1968, in *Proceedings of the
December 9–11, 1968, Fall Joint Computer Conference, Part I*, pp. 757–764, ACM,
https://doi.org/10.1145/1476589.1476686), software (Unity Technologies, 2023, *Unity*, Version
2022.3 LTS, [Computer software]). A note on hanging indents and alphabetical order.

**6 · Five mistakes to avoid (`#mistakes`)** Five tap-to-reveal cards, each giving the fix: muddling
et al. when names clash; using ibid. or op. cit. (Chicago and Oxford, never APA); citing only the
abstract; padding the reference list; missing DOIs and raw URLs (always https://doi.org/, not
dx.doi.org and not the bare number).

**Check yourself (`#check`)** Eight questions through the Blend `Quiz` component, one at a time.
Every option, right or wrong, carries its own explanation. Correct answers: (1) first author + et
al., from the first citation; (2) n.d. means "no date"; (3) 40 words; (4) `(Brown & Jones, 2021)`;
(5) alphabetically by first author's surname; (6) `https://doi.org/10.1234/example`; (7) sentence
case for a journal article title; (8) an APA reference list holds only sources cited in the text, so
five uncited entries are orphans. No score is kept and there is no pass mark.

**Recap** "Cite what isn't yours, then make every citation findable." Five points: a citation is
your answer to "says who?"; one in-text citation, one entry; three or more authors means et al. from
the first citation; forty words is the line for quotes; every entry answers who, when, what and
where. Footnote: American Psychological Association. (2020). *Publication manual of the American
Psychological Association* (7th ed.). https://doi.org/10.1037/0000165-000

Closing line, preserve verbatim: "© All rights reserved · Yasas Sri Wickramasinghe".

## 3. UI & interaction design

Blend, on the `planning` accent. Paper background, one rationed indigo accent, sentence-case
headlines with a single `bt-stop` full stop in the hero. The floating `PillNav` tracks the section in
view. No emoji, no gradients and no password screen. Tap-to-reveal cards use `bt-flip`; the two
reference builders use `bt-demo` with `bt-tab` pills; tables use `bt-plaintable` inside `bt-scroll`.
Verified at 1280px and at 400px with no horizontal scroll and no console errors.

## 4. Component & state architecture

`APAReferencingLesson` holds two pieces of state: `part` (which of Who / When / What / Where is
highlighted) and `source` (which of the six source types is shown). Each `RevealCard` keeps its own
open/closed flag. `Quiz` owns its own answers. Nothing is persisted anywhere.

## 5. Rebuild notes

- **No password anywhere.** The old `APAV7` gate, the `apa-v7-unlocked` `sessionStorage` key and the
  deck's injected `DECK_CSS` are all gone.
- Content is declared as constants at the top of `APAReferencingLesson.tsx` (`PILLARS`,
  `WHEN_TO_CITE`, `CHEAT_SHEET`, `FOUR_PARTS`, `SOURCE_TYPES`, `MISTAKES`, `CHECK`), so a change to
  the wording is an edit to one constant.
- Three examples differ from the old deck. The conference-paper example (a "Bowman & McMahan, 2007"
  entry with a placeholder DOI ending `xxxxxxx`, and which is really a journal article) was replaced
  with Sutherland (1968). The book-chapter example (an unverified "McMahan, 2017" entry) was replaced
  with Steuer (1995). Quiz question 8's distractors were rewritten, because the old "remove all 5"
  option described a valid fix.
- **Still to verify by hand:** the block-quote passage attributed to "Slater (2018) … p. 431" and the
  "University of Canterbury (2023, August 1)" webpage example are carried over from the old deck and
  were not checked against a real source. Replace them with a passage and page you have in front of
  you if they will be shown in class.
- The old `lesson-docs/general/01-apa-referencing.md` was moved here, so `general/` now holds the
  study packs and pre-class swarm docs only.
