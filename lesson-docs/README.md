# Lesson Docs — Rebuild Specs for ThisIsNotALMS

This folder is a full audit of every teaching "lesson" (content lesson, knowledge-check,
lab, or gamified practice tool) that exists anywhere in the ThisIsNotALMS platform, grouped
by subject and written so that **feeding one file to Claude, with no other context, is
enough to regenerate that lesson's React component(s) from scratch** if the source were
lost. This is a different artifact from `study-pack/content/*/lessons/*.md`, which produces
polished *student-facing PDF study guides* — these files instead describe the actual
interactive feature: its content, its UI, its state machine, its data model.

## Subjects

| Code | Title | Folder |
|---|---|---|
| MBI800 | Strategic Information Systems (Planning) | `mbi800/` |
| MBI802 | Database Management Systems | `mbi802/` |
| MBI804 | IT Project Management | `mbi804/` |
| — | Cross-subject / platform-wide content | `general/` |

Subject assignment follows the platform's own taxonomy where one exists (the `COURSES`
registry in `src/pages/student/CourseResources.tsx`, `course.json` files in `study-pack/`,
or an explicit `MBI80x ·` eyebrow/label baked into the component itself). Where no explicit
tag exists, assignment was inferred from the actual subject-matter content and is noted as
inferred in that file's header.

## Gating

- **Non-gated (public)** — reachable with no login, directly from a route in `src/App.tsx`
  or as a static file under `public/`.
- **Gated** — only reachable after logging in as `student` (or staff), via
  `/student/course-resources` (component `CourseResources.tsx`), and in a few cases further
  locked behind a score threshold (documented per-file).

Several lessons exist in **both** forms: a public standalone page *and* an embedded copy
inside the gated Course Resources hub, sometimes reusing the exact same component,
sometimes as two genuinely different implementations (e.g. ER Mapping has a public
interactive explorer *and* a separate gated slide deck covering the same material). Every
file states which case applies.

## Required structure for every lesson file

```markdown
# <Lesson Title> — <SUBJECT CODE>

- **Subject:** MBI80x — <subject name> (state if inferred, and why)
- **Gating:** Non-gated (public) | Gated (student/staff login) | Both (explain the split)
- **Route(s):** e.g. `/er-diagrams`
- **Source files:** exact repo-relative paths of every component/page/lib file involved
- **Depends on:** shared components, libs, Firestore collections, external links used

## 1. Purpose & learning objectives
What this lesson teaches and why it exists, in the instructor's voice where known.

## 2. Full content
The *actual* teaching content — every slide's text, every quiz question with its answer
choices and correct answer, every activity's instructions and answer key, every diagram's
meaning — written out in full prose/lists, not summarized. This is the part a rebuild
depends on most: if this section is thin, the doc has failed its purpose.

## 3. UI & interaction design
Layout, visual style (colors/gradients if distinctive), navigation model (slide deck vs.
scroll-reveal vs. tabs), animations/transitions worth preserving, responsive behavior.

## 4. Component & state architecture
Key React state, props, data flow, any Firestore reads/writes (collection names, document
shapes), gating/unlock logic, scoring logic, badge-award triggers.

## 5. Rebuild notes
Anything a rebuilder needs to know that doesn't fit above: known quirks, TODOs left in the
code, dead/legacy code nearby, external links and whether they need revalidating, assets
(images/SVGs/videos) referenced and where they live.
```

Keep prose accurate to the actual source — read the full file(s) before writing, don't
infer content from filenames. Long files (slide decks, quiz banks) must have their content
transcribed in full in section 2, not truncated or "e.g."'d.

## Full inventory

### MBI800 — Strategic Information Systems (6 lessons)
1. Five Stories That Changed Everything — non-gated `/five-stories` + gated copy
2. Platform Strategy — non-gated `/platform-strategy` + gated copy
3. Systems Security — non-gated `/systems-security`
4. Immersive Realities (XR Explorer) — non-gated `/xr-explorer`
5. Capstone Bonus Lecture (ship a site with AI tools) — non-gated `/bonus-lecture`
6. SISP Prompt Engineering Lab — gated only

### MBI802 — Database Management Systems (24 lessons)
Public core (14): SQL Programming (`/sql-programming`), Database Concepts
(`/database-concepts`), ER Diagrams (`/er-diagrams`), ER Activities (`/er-activities`),
ER Advanced Concepts (`/er-advanced`), ER Attributes & Participation Constraints
(`/er-attributes`), ER→Relational Mapping Explorer (`/er-mapping`), Normalization Explorer
(`/normalisation`), Normalization Activities (`/normalisation-activities`), Normalization
Videos (`/normalisation-videos`), SQL Reels (`/sql-reels`), SQL Certifications
(`/sql-certifications`), Web Architecture (`/web-architecture`), Security Lab
(`/security-lab` → static SwiftShop lab).

Gated only (6): MySQL Setup Guide, ER Knowledge Check quiz, ER→Relational Mapping slide
deck (distinct from the public explorer), Normalization slide deck (distinct from the
public explorer, locked behind ER quiz score), DBMS Knowledge Check quiz (38Q, also locked
behind ER quiz score), SQL Practice Lab.

Gamified practice tools (3): SQL Race, Daily Duel + Arena (ER/SQL Elo duels), SQL
Fundamentals Exam + certificate.

Lesson plans (1): consolidated MBI802 8-class lecturer lesson-plan series
(`public/lesson-plans/class-1.html` … `class-8.html`).

### MBI804 — IT Project Management (7 lessons)
Public (4): Project Cost Management (`/cost-management`), Free Jira & Agile Certifications
(`/jira-certifications`), Conflict Swap classroom activity (static, own Firebase
collection), The Collaboration Reflex lecture (static slides on conflict theory).

Gated only (3): Agile Scrum Process in IT slide deck, Agile Scrum Knowledge Check quiz
(30Q), Free Agile & Scrum Certifications resource list.

### General / cross-subject (5)
APA 7 Citations Crash Course (`/apa-referencing`, non-gated + always-visible gated copy),
Study Packs download hub (`/study-packs`), Pre-Class Idea Swarm icebreaker (`/pre-class`),
Live Vote / peer-rating tool (`/vote`, `/vote/admin`), Skill Passport badge dashboard
(`/student/skill-passport`).

## Explicitly out of scope

Pure administrative/attendance/social features with no teachable content to reproduce:
attendance sessions & QR check-in, lecturer dashboards, student list/detail, site
analytics, notice board, classroom view, event log, video lesson manager (a CMS tool, not
a lesson), Kudos, Hall of Fame, Alumni Wall, Time Capsule, Certificate View. These are
platform mechanics, not lessons. `src/pages/student/MBI802Resources.tsx` is dead code (no
route references it, superseded by `CourseResources.tsx`) and is also excluded.
