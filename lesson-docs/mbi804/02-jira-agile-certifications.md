# Free Jira & Agile Certifications — MBI804

- **Subject:** MBI804 — IT Project Management. `JiraCertificationsPage.tsx` passes the eyebrow
  "Career development · Project Management" (no explicit MBI80x tag in this particular page's
  hero, unlike Cost Management), but it is listed under MBI804 in the platform's own
  README/homepage lesson grouping, and its subject matter (Jira/Agile/Scrum tooling
  certifications) is squarely IT Project Management content.
- **Gating:** Non-gated (public) — no login required.
- **Route(s):** `/jira-certifications`
- **Source files:**
  - `src/pages/JiraCertificationsPage.tsx` (25 lines — thin wrapper that supplies hero copy/
    colours to the shared shell)
  - `src/components/public/JiraCertificationsLesson.tsx` (309 lines — the actual lesson body)
  - `src/components/public/PublicLessonShell.tsx` (168 lines — shared hero/nav/footer shell,
    reused by other public lessons across subjects, e.g. Five Stories, Systems Security,
    Normalisation)
- **Depends on:** `lucide-react` icons (`ExternalLink`, `Sparkles`); `framer-motion` (used only
  inside `PublicLessonShell` for hero entrance animation, not inside the lesson body itself,
  which uses plain inline `<style>` keyframes). No Firestore, no auth. External links to
  Atlassian Community, LinkedIn Learning, Great Learning Academy, Atlassian University, Jira
  Software Documentation, Atlassian Agile Coach, Scrum.org, a free Jira Cloud signup page, the
  Atlassian Community home, and the instructor's personal LinkedIn profile.

## 1. Purpose & learning objectives

A short, single-purpose public "resource list" lesson: point students at three genuinely free
(or free-to-access) external Jira/Agile credentials so they can add a real, verifiable
certification to their CV/LinkedIn profile alongside their MBI804 coursework. It is not
itself an interactive teaching tool (no quiz, no simulation) — its content *is* the curated
list plus guidance on sequencing and on publicising the achievement. It shares its layout
shell with the platform's other public "Let's make sense of…" lessons (see
`PublicLessonShell.tsx`), giving it the same Apple-style hero even though the body itself is a
simple certification directory.

## 2. Full content

### Hero (rendered by `PublicLessonShell`, configured from `JiraCertificationsPage.tsx`)
- Eyebrow: "Career development · Project Management"
- Headline: "Let's make sense of **free Jira & Agile certifications.**" (accent gradient
  `linear-gradient(90deg, #0052CC, #0A66C2, #059669)`)
- Subtitle: "Three hand-picked Jira and Agile credentials — Atlassian's own learning path, a
  LinkedIn Professional Certificate, and a quick free certificate. Earn one, put it on
  LinkedIn, and let your skills speak for themselves."
- Topic pills: 🔷 "Atlassian path" · 🎓 "LinkedIn certificate" · 🏆 "Free completion cert" ·
  🆓 "Free to access"

### Lesson body (`JiraCertificationsLesson`)
- Intro tag: "✨ Career development · Project Management"
- **Quick Terminology card**:
  - "**Jira** — Atlassian's industry-standard tool for planning, tracking, and managing
    software and project work."
  - "**Agile** — A way of delivering work in small, iterative cycles; Scrum and Kanban are its
    two most common frameworks."
  - "**Professional Certificate** — A multi-course credential that appears directly on your
    LinkedIn profile once earned."
- Intro paragraph: "Three genuinely useful, free (or free-to-access) Jira and Agile
  credentials — from Atlassian's own learning path to a LinkedIn Professional Certificate and a
  quick certificate of completion. Each one is recommended to complement your studies, sharpen
  a skill employers actively hire for, and give your CV and LinkedIn profile something concrete
  to show. Work through them in order, or pick the one that fits your time."

- **The three certification cards** (rank-numbered 1–3, each with badge, tag, title,
  description, and outbound link):

  1. **Badge: "Atlassian Official"** — Tag: "LEARNING PATH · BEGINNER · SELF-PACED"
     Title: "Atlassian Community — Get the Most Out of Jira"
     Description: "The most credible free Jira training available — published directly by
     Atlassian, the company that builds Jira. A guided learning path that walks you from your
     first project through boards, backlogs, sprints, workflows, and reporting. Bite-sized
     lessons you can finish in a sitting, with a completion record on your Atlassian Community
     profile. Free Atlassian account only; no credit card."
     Link: `community.atlassian.com` →
     `https://community.atlassian.com/learning/path/get-the-most-out-of-jira`

  2. **Badge: "Professional Certificate"** — Tag: "CERTIFICATE PATH · INTERMEDIATE ·
     MULTI-COURSE"
     Title: "LinkedIn Learning — Atlassian Agile Project Management Professional Certificate"
     Description: "A structured, multi-course path that earns a Professional Certificate
     displayed directly on your LinkedIn profile — no copy-pasting required. Covers Agile
     foundations, Scrum, Kanban, and hands-on Jira project management, built in partnership
     with Atlassian. LinkedIn Learning is often free through your university library or a
     one-month free trial — check your student access before subscribing."
     Link: `linkedin.com/learning` →
     `https://www.linkedin.com/learning/paths/atlassian-agile-project-management-professional-certificate`

  3. **Badge: "Free Certificate"** — Tag: "COMPLETION CERT · BEGINNER · ≈1–2 hrs"
     Title: "Great Learning Academy — Jira Project Management"
     Description: "A short, practical, completely free course that gets you hands-on with Jira
     fast — creating projects, issues, boards, and tracking work through to delivery. A free
     downloadable certificate of completion is issued automatically when you finish, ready to
     add to your CV and LinkedIn profile the same day. Free Great Learning account; no credit
     card required."
     Link: `mygreatlearning.com` →
     `https://www.mygreatlearning.com/academy/learn-for-free/courses/jira-project-management`

- **"A suggested path" callout**: "Start with Atlassian's own learning path to get comfortable
  inside Jira, take the quick Great Learning course to lock in the certificate, then invest in
  the LinkedIn Learning Professional Certificate when you have a longer block of time — it's
  the one that lands as a badge on your profile."

- **"More Free Resources — Keep Practising"** bonus link list (label / URL / one-line note):
  - Atlassian University → `https://university.atlassian.com/` — "Free Jira & Confluence
    courses + paid certifications"
  - Jira Software Documentation → `https://support.atlassian.com/jira-software-cloud/` —
    "Free official vendor reference"
  - Atlassian Agile Coach → `https://www.atlassian.com/agile` — "Free guides on Scrum, Kanban &
    Agile delivery"
  - Scrum.org — What is Scrum? → `https://www.scrum.org/learning-series/what-is-scrum` —
    "Free Scrum foundations from the source"
  - Free Jira Cloud Site → `https://www.atlassian.com/software/jira/free` — "Free for up to 10
    users — practice for real"
  - Atlassian Community → `https://community.atlassian.com/` — "Free Q&A, events & more
    learning paths"

- **LinkedIn "Share Your Achievement!" call-to-action card** (LinkedIn-blue gradient panel with
  floating emoji decorations):
  - Personal message: "I'd genuinely love to see what you accomplish here. Agile and Jira
    skills are among the most in-demand competencies in industry right now, and earning a
    credential on your own initiative says a lot about your drive and growth mindset — exactly
    what employers notice. If you post your achievement on LinkedIn, feel free to tag me so I
    can cheer you on and help amplify it — I genuinely enjoy celebrating every student who
    levels up. 🎓" — attributed to "Yasas Sri Wickramasinghe · Lecturer" (links to
    `https://www.linkedin.com/in/yasassri/`).
  - "Why your LinkedIn post matters" (4 tiles): 👁️ Recruiter Visibility — "Agile and Jira
    skills are in high demand — hiring managers actively search LinkedIn for certified
    candidates every single day."; 🤝 Grow Your Network — "Your post reaches your connections,
    their connections, and beyond — compounding your professional presence."; 💼 Instant
    Credibility — "A vendor-backed or verifiable certificate signals initiative and drive — the
    exact qualities employers look for in graduates."; 🚀 Career Momentum — "Every credential
    you post builds a public track record that speaks for you before any interview begins."
  - "💡 What to write in your post": "Share which credential you earned, one thing that
    genuinely clicked for you, and how Agile or Jira skills connect to where you want your
    career to go. A screenshot of your certificate makes it land even better — posts with
    images get noticeably more engagement."
  - CTA button: "Connect with Yasas Sri Wickramasinghe on LinkedIn" → `linkedin.com/in/yasassri/`

- **Disclaimer**: "A note before you enrol: These platforms may update their pricing,
  enrolment processes, or certificate availability at any time — always read the course page
  carefully before signing up to confirm it is still free. These are independent suggestions
  only. This course has no affiliation with, sponsorship from, or endorsement by Atlassian,
  LinkedIn, Great Learning, or any platform listed above. All trademarks and certifications
  belong to their respective owners."

### `PublicLessonShell` footer
"Everything here runs in your own browser. No login, no personal data collected." (plus the
platform's `BrandLogo`).

## 3. UI & interaction design

- **Shared shell** (`PublicLessonShell`): a sticky top nav with just the brand logo linking to
  `/home`; a full-viewport-adjacent hero section with a centred title/subtitle/pills and three
  soft blurred colour "orbs" behind it (`accent`, `orb2`, `orb3` colours, each passed by the
  calling page — here `#0052CC` / `#0A66C2` / `#059669`); a "Scroll to begin" bouncing hint; the
  lesson body slotted in as `children` inside a `max-w-5xl` container; and a minimal footer.
  This exact shell is reused verbatim by other public lessons (Five Stories, Systems Security,
  Normalisation) — only the colour/copy props differ, so a rebuild should treat the shell as a
  shared component, not duplicate it per lesson.
- **Body layout**: no slide deck, no tabs — a single vertically-stacked `space-y-6` column of
  cards (terminology → intro → 3 cert cards in a responsive grid `grid-cols-1 md:grid-cols-2
  xl:grid-cols-3` → suggested-path callout → bonus resources grid → LinkedIn CTA → disclaimer).
- **Visual style**: pastel gradient card backgrounds per certification (blue/light-blue/green
  tinted, matching each cert's brand colour), colour-coded left-aligned rank badges (1/2/3),
  provider badges pinned to the top-right of each card.
- **Animations** (all defined as inline `<style>` CSS keyframes prefixed `fmc-`, scoped to this
  component only): floating/rotating emoji decorations (`fmc-float`, `fmc-float2`,
  `fmc-float3`) on the LinkedIn CTA card; a pulsing glow on the CTA card itself (`fmc-glow`);
  shimmering gradient text on "Share Your Achievement!" and the CTA button (`fmc-shimmer`);
  pop-in entrance for the quote card (`fmc-pop`); twinkling star decorations (`fmc-twinkle`); a
  slow expanding "ping" ring on the presence dot next to the lecturer's name (`fmc-ping-slow`);
  slide-up entrance for the terminology card (`fmc-slide-up`); staggered reveal for the rank
  badges (`fmc-rank-reveal`); a pulsing glow on each provider badge (`fmc-badge-glow`); and a
  hover lift/scale + shadow on each certification card (`fmc-cert-card:hover`).
- No quiz, no drag-and-drop, no forms — purely a read-and-click resource page.

## 4. Component & state architecture

- **No React state at all** in `JiraCertificationsLesson` — it is a pure, stateless functional
  component; `certs`, `whyLinkedIn`, and `bonusResources` are module-level constant arrays
  mapped directly to JSX. All interactivity is native `<a target="_blank">` outbound links; all
  animation is CSS-only (no `framer-motion`, no JS-driven transitions inside the lesson body).
- **No Firestore reads/writes, no auth, no gating, no scoring, no badges** — nothing here is
  tracked or persisted; it is a pure content/link page.
- `JiraCertificationsPage.tsx` itself holds no state either — it is a one-shot configuration
  object (eyebrow/title/gradient/colours/pills/subtitle) passed as props into
  `PublicLessonShell`, with `JiraCertificationsLesson` as `children`.

## 5. Rebuild notes

- **All 3 certification links and all 6 bonus-resource links are live external URLs to
  third-party platforms** (Atlassian, LinkedIn Learning, Great Learning Academy, Scrum.org) —
  these should be revalidated before any rebuild ships, since third-party course
  availability/pricing changes over time (the page's own disclaimer says as much).
- The instructor's personal LinkedIn URL (`https://www.linkedin.com/in/yasassri/`) is
  hardcoded in two places (the quote attribution and the CTA button) — a rebuild should treat
  this as configurable instructor identity, not a fixed constant, if the platform is ever
  reused by a different lecturer.
- **CSS class-name collisions**: the `fmc-*` keyframe/class names in this file are deliberately
  distinct from the visually-identical `fac-*` set used by `FreeAgileCertsLesson` in
  `CourseResources.tsx` (see `07-free-agile-certs.md`) — the two components independently
  reimplement essentially the same "LinkedIn share card" pattern with different prefixes to
  avoid clashing if both are ever mounted on the same page. A rebuild would do well to factor
  this "share your certification achievement" card out into one shared component instead of
  maintaining two near-identical copies (this one plus the one in `CourseResources.tsx`).
- No images/videos/SVGs beyond inline `lucide-react` icons and a hand-drawn inline SVG LinkedIn
  logo (duplicated inline rather than imported from an icon set).
