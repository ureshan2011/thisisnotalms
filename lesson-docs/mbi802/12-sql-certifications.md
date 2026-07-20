# Free SQL Certifications — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/sql-certifications`
- **Source files:**
  - `src/pages/SQLCertificationsPage.tsx` — the page shell wiring: configures
    `PublicLessonShell` (hero copy, gradient, colors, pills) and mounts
    `SQLCertificationsLesson` as its child.
  - `src/components/public/SQLCertificationsLesson.tsx` — the entire lesson body: intro tag,
    terminology note, the 9 certification cards, the bonus-resources panel, the LinkedIn CTA
    panel, and the disclaimer.
- **Depends on:**
  - `src/components/public/PublicLessonShell.tsx` (shared hero/nav/footer shell also used by
    other standalone public lessons such as SQL Programming/Systems Security) and, inside it,
    `src/components/ui/BrandLogo.tsx`.
  - `lucide-react` icons `ExternalLink`, `Sparkles`.
  - 9 external certification-provider URLs plus 9 external "bonus resource" URLs plus 1
    LinkedIn profile URL (all transcribed in full in section 2).
  - No Firestore collections are read or written by this page — entirely static content, no
    backend calls.

## 1. Purpose & learning objectives

A curated, free-only resource list of external SQL/MySQL/database certifications and
credentials for MBI802 students to earn independently, outside of coursework, to
strengthen their CV and LinkedIn profile. Per the page's own intro copy: "Nine genuinely
free credentials — from Oracle vendor badges to IBM digital badges to project-based certs.
Earn one, put it on LinkedIn, and let your skills speak for themselves," and later:
"Recommended to complement your MBI802 coursework and strengthen your CV and LinkedIn
profile." It is written in part in the first-person voice of the MBI802 lecturer (Dr. Yasas
Sri Wickramasinghe), who explicitly asks students to tag him on LinkedIn when they post
about earning a credential, "I personally celebrate every single one of my students who
levels up."

## 2. Full content

### Page hero (via `PublicLessonShell`, configured in `SQLCertificationsPage.tsx`)
- Eyebrow: "MBI802 · Database Management"
- Headline: "Let's make sense of **free SQL certifications.**" (accent gradient: purple →
  violet → red, `linear-gradient(90deg, #7c3aed, #6d28d9, #dc2626)`)
- Subtitle: "Nine genuinely free credentials — from Oracle vendor badges to IBM digital
  badges to project-based certs. Earn one, put it on LinkedIn, and let your skills speak for
  themselves."
- Four topic pills: 🏅 "Oracle badge" (red `#dc2626`), ✅ "HackerRank cert" (green
  `#059669`), 🎓 "IBM badge" (blue `#1d4ed8`), 🆓 "All 100% free" (purple `#7c3aed`).

### Intro tag (in `SQLCertificationsLesson`)
"✨ MBI802 · Database Management Systems" (small pill, purple-tinted).

### "Quick Terminology" note (purple-tinted card)
- Heading: "📖 Quick Terminology"
- **Badge / digital credential** — "Shareable, verifiable credential you can post directly
  to LinkedIn."
- **Certificate of completion** — "Downloadable PDF awarded after finishing course
  materials."
- **Skill certification exam** — "Assessment-based credential you can claim by passing a
  test, even without a course."

### Intro paragraph
"Nine genuinely free MySQL, SQL, and database-design credentials — from vendor badges to
skill exams and project-based certifications. Every option below is completely free to earn
(no credit card required). Recommended to complement your MBI802 coursework and strengthen
your CV and LinkedIn profile."

### The 9 certification cards (in display order, each with rank pill 1–9, badge chip, tag
line, title, description, and outbound link — every field transcribed exactly)

1. **Oracle MyLearn — MySQL Explorer**
   - Badge: "MySQL Badge"
   - Tag: "VENDOR BADGE · BEGINNER · ≈5–7 hrs"
   - Description: "The most credible free MySQL credential available — issued directly by
     Oracle, the company that owns MySQL. Complete the self-paced learning path covering
     the client/server model, MySQL Workbench, basic and complex queries, and
     troubleshooting. Earn an official 'MySQL Explorer' digital badge from Oracle after
     passing a free online assessment. Free Oracle account only; no credit card."
   - Link label: `mylearn.oracle.com`
   - URL: `https://mylearn.oracle.com/ou/learning-path/mysql-explorer/79674`

2. **HackerRank — SQL (Basic) Skills Certification**
   - Badge: "Verified Cert"
   - Tag: "SKILL EXAM · BEGINNER · 30 min"
   - Description: "A 30-minute online assessment — no course required, just study and sit
     it. Tests simple queries, relationships, and aggregators on relational databases
     including MySQL. You earn a verified Skills Certificate with a unique public URL,
     widely recognised by technical recruiters. Scores are private if you fail; retake
     after a waiting period. Intermediate (35 min) and Advanced (60 min) exams also free."
   - Link label: `hackerrank.com`
   - URL: `https://www.hackerrank.com/skills-verification/sql_basic`

3. **Cisco NetAcad — Data Analytics Essentials**
   - Badge: "Credly Badge"
   - Tag: "DIGITAL BADGE + CERT · BEGINNER · ≈30 hrs"
   - Description: "One of the most generous truly-free programs online — 660,000+ learners
     enrolled. Covers Excel, an introduction to relational databases and SQL (Modules 6 &
     7), Tableau, data visualisation, and data ethics across 10 modules and 29 hands-on
     labs. Earns a free Credly-verified digital badge and certificate of completion from
     Cisco. Free NetAcad account; no credit card."
   - Link label: `netacad.com`
   - URL: `https://www.netacad.com/catalogs/learn`

4. **Saylor Academy — CS403: Intro to Modern Database Systems**
   - Badge: "ACE Cert"
   - Tag: "COMPLETION CERT · BEGINNER · ≈42 hrs"
   - Description: "The best single free option for database theory — one of the very few
     truly-free courses that covers both ER diagrams AND SQL in depth. Topics include
     database architecture, the Entity-Relationship model, relational algebra, data
     normalisation, SQL SELECT and JOINs, and database design. A free proctored final exam
     (≥70% to pass) earns an ACE-recommended completion certificate."
   - Link label: `learn.saylor.org`
   - URL: `https://learn.saylor.org/course/view.php?id=93`

5. **Kaggle Learn — Intro to SQL (Google)**
   - Badge: "Kaggle PDF"
   - Tag: "PDF CERTIFICATE · BEGINNER · ≈3 hrs"
   - Description: "A practical browser-based course by Kaggle (a Google company) using
     BigQuery — covering SELECT, FROM, WHERE, GROUP BY, ORDER BY, AS, and WITH. A free
     downloadable PDF certificate is issued automatically when all module exercises are
     complete. Kaggle also offers a free 'Advanced SQL' certificate (≈4 hrs) covering
     JOINs, analytic functions, nested data, and query efficiency."
   - Link label: `kaggle.com/learn/intro-to-sql`
   - URL: `https://www.kaggle.com/learn/intro-to-sql`

6. **SoloLearn — Introduction to SQL**
   - Badge: "Completion Cert"
   - Tag: "CERTIFICATE · BEGINNER · MOBILE-FRIENDLY"
   - Description: "A mobile-friendly ≈5–10-hour course covering SQL CRUD operations,
     filtering, sorting, joins, and basic relational concepts that apply directly to
     MySQL. A free completion certificate is issued after finishing all lessons and Code
     Coach problems. A free SQL Intermediate course is also available. Free SoloLearn
     account on web or mobile app; no credit card."
   - Link label: `sololearn.com`
   - URL: `https://www.sololearn.com/en/learn/courses/sql-introduction`

7. **IBM / Cognitive Class — SQL and Relational Databases 101**
   - Badge: "IBM Badge"
   - Tag: "IBM DIGITAL BADGE · BEGINNER · ≈5–6 hrs"
   - Description: "An IBM-backed course covering relational model concepts, the five basic
     SQL statements, advanced SQL syntax, and JOIN statements — with hands-on exercises and
     a final exam. Passing the exam earns both a free completion certificate and an IBM
     digital badge issued via Credly. Free Cognitive Class / IBM ID account; no credit card
     required."
   - Link label: `cognitiveclass.ai`
   - URL: `https://cognitiveclass.ai/courses/learn-sql-relational-databases`

8. **freeCodeCamp — Relational Database Certification**
   - Badge: "FCC Cert"
   - Tag: "PUBLIC CERT · PROJECT-BASED · ≈300 hrs"
   - Description: "One of the most respected truly-free programming certifications.
     Project-based work covering Bash, PostgreSQL/relational databases, Git, and building
     relational databases from scratch — with SQL skills that transfer directly to MySQL.
     Complete five required projects to earn a publicly verifiable certification on your
     freeCodeCamp profile. 100% open-source and free."
   - Link label: `freecodecamp.org`
   - URL: `https://www.freecodecamp.org/learn/relational-database/`

9. **Simplilearn SkillUp — SQL & Database Course Bundle**
   - Badge: "SkillUp"
   - Tag: "FREE CERT BUNDLE · BEGINNER · 1–9 hrs each"
   - Description: "Multiple free SQL/database tracks on Simplilearn's SkillUp platform —
     covering Introduction to Databases, SQL Fundamentals, SQL for Data Analysis, SQL for
     Data Science, and SQL Projects. Each course issues a free downloadable PDF completion
     certificate automatically. All self-paced; free SkillUp account; no credit card
     required."
   - Link label: `simplilearn.com/skillup`
   - URL: `https://www.simplilearn.com/learn-basics-of-databases-free-course-skillup`

### "Useful Free Learning Resources — No Certificate, But Great for Practice" panel

Nine bonus links, transcribed exactly (label / note / URL):

1. "W3Schools MySQL Tutorial" — "Free study material (cert exam is paid)" —
   `https://www.w3schools.com/mysql/`
2. "MySQL Official Documentation" — "Free vendor reference" — `https://dev.mysql.com/doc/`
3. "Kaggle — Advanced SQL" — "Free cert · JOINs, analytic functions, nested data" —
   `https://www.kaggle.com/learn/advanced-sql`
4. "HackerRank — SQL Intermediate" — "Free 35-min skill cert" —
   `https://www.hackerrank.com/skills-verification/sql_intermediate`
5. "HackerRank — SQL Advanced" — "Free 60-min skill cert" —
   `https://www.hackerrank.com/skills-verification/sql_advanced`
6. "Oracle SQL Explorer Path" — "Free vendor-neutral SQL badge (search 'Oracle SQL
   Explorer')" — `https://mylearn.oracle.com`
7. "IBM SkillsBuild — Data Catalog" — "Free DB learning paths with completion certs" —
   `https://skillsbuild.org/`
8. "SoloLearn — SQL Intermediate" — "Free completion cert" —
   `https://www.sololearn.com/en/learn/courses/sql-intermediate`
9. "SQLZoo / SQLBolt / Mode SQL" — "Free interactive practice (no certificate)" —
   `https://sqlzoo.net/`

### LinkedIn CTA panel (LinkedIn-blue gradient card with floating emoji decorations 🎉⭐🏆✨🚀)

- Heading: "Share Your Achievement!" (shimmering gradient text) with subheading "Let the
  world know you levelled up 🌍" next to the LinkedIn glyph.
- Quote block (lecturer's first-person voice): "I am **genuinely excited** to see your
  certification! Database skills are among the most in-demand competencies in the industry
  right now. Earning a free credential shows initiative, dedication, and a growth mindset —
  exactly the qualities that stand out to employers. Please post your achievement on
  LinkedIn and **tag me** — I personally celebrate every single one of my students who
  levels up! 🎓"
- Attribution line beneath the quote (with a pulsing green "online" dot): "**Yasas Sri
  Wickramasinghe** · MBI802 Lecturer", linking to `https://www.linkedin.com/in/yasassri/`.
- Sub-heading: "Why your LinkedIn post matters", with 4 reason cards:
  1. 👁️ **Recruiter Visibility** — "Database and SQL skills are in high demand — hiring
     managers actively search LinkedIn for certified candidates every single day."
  2. 🤝 **Grow Your Network** — "Your post reaches your connections, their connections, and
     beyond — compounding your professional presence."
  3. 💼 **Instant Credibility** — "A vendor-issued or verifiable certificate signals
     initiative and drive — the exact qualities employers look for in graduates."
  4. 🚀 **Career Momentum** — "Every credential you post builds a public track record that
     speaks for you before any interview begins."
- Tip box: "💡 What to write in your post — Share what you learned, which certification you
  earned, and how database skills connect to your career goals. Tag
  **@YasasSriWickramasinghe** so I can celebrate with you!"
- Primary CTA button: "Tag Yasas Sri Wickramasinghe on LinkedIn" (shimmering white/blue
  button, LinkedIn glyph + external-link icon), linking to
  `https://www.linkedin.com/in/yasassri/`.

### Disclaimer (bottom, grey card)
"**A note before you enrol:** These platforms may update their pricing, enrolment
processes, or certificate availability at any time — always read the course page carefully
before signing up to confirm it is still free. These are independent suggestions only. This
course has no affiliation with, sponsorship from, or endorsement by any of the platforms
listed above. All trademarks and certifications belong to their respective owners."

## 3. UI & interaction design

- Uses the shared `PublicLessonShell` (also used by other standalone public MBI802/MBI804
  lessons): sticky top nav with `BrandLogo` linking to `/home`, an Apple-styled hero with
  drifting blurred color "orbs" behind the headline (purple/violet/red per this page's
  `accent`/`orb2`/`orb3` props), and a quiet footer reading "Everything here runs in your
  own browser. No login, no personal data collected."
- The lesson body (`SQLCertificationsLesson`) is a single vertical stack (`space-y-6`), no
  tabs/slides/pagination — everything is visible on scroll.
- A `<style>` block defines a large set of custom CSS keyframe animations local to this
  component (prefixed `fmc-`): floating decorative emoji (`fmc-float`/`fmc-float2`/
  `fmc-float3`), a pulsing glow on the LinkedIn card (`fmc-glow`), a shimmering gradient-text
  effect (`fmc-shimmer`) used on both the "Share Your Achievement!" heading and the CTA
  button background, a pop-in entrance (`fmc-pop`), twinkling stars (`fmc-twinkle`), a
  slide-up entrance for the terminology card (`fmc-slide-up`), a staggered reveal for each
  card's rank pill (`fmc-rank-reveal`), a soft pulse on each cert's badge chip
  (`fmc-badge-glow`), and a slow expanding "online" ping ring next to the lecturer's name
  (`fmc-ping-slow`).
- Certification cards are laid out in a responsive grid: 1 column (mobile) → 2 columns
  (`md`) → 3 columns (`xl`). Each card has a distinct pastel gradient background and border
  tint keyed to its accent color, and lifts slightly with an enlarged shadow on hover
  (`.fmc-cert-card:hover` — `translateY(-4px) scale(1.015)`).
- Bonus-resources panel is a 1-column (mobile) / 2-column (`sm`) grid of link tiles that
  highlight a violet border on hover.
- All outbound links (`certs[].href`, `bonusResources[].href`, the two LinkedIn links) open
  in a new tab (`target="_blank" rel="noreferrer"`).

## 4. Component & state architecture

- **`SQLCertificationsPage`** (`src/pages/SQLCertificationsPage.tsx`, default export) — pure
  configuration wrapper, no local state. Supplies the hero copy/colors/pills to
  `PublicLessonShell` as props and renders `SQLCertificationsLesson` as its single child.
- **`SQLCertificationsLesson`** (`src/components/public/SQLCertificationsLesson.tsx`,
  default export) — a fully static functional component with **no `useState`, no props, no
  Firestore reads/writes, and no gating/scoring/badge logic of any kind**. All content is
  driven by three module-level constant arrays defined at the top of the file:
  - `certs` — the 9 certification objects (fields: `badge`, `badgeBg`, `badgeColor`,
    `title`, `tag`, `tagColor`, `description`, `linkLabel`, `href`, `cardBg`,
    `borderColor`, `accentColor`), mapped with `.map((cert, idx) => ...)` to render the
    numbered rank pill and card.
  - `whyLinkedIn` — the 4 reason-card objects (`icon`, `title`, `desc`).
  - `bonusResources` — the 9 bonus-link objects (`label`, `href`, `note`).
  - The component renders these arrays directly; there is no interactivity beyond the
    outbound `<a>` links themselves.
- No shared app state, context, or Firestore collection is touched anywhere in this lesson.

## 5. Rebuild notes

- This lesson is entirely static/presentational — a rebuild is essentially a data-transcription
  exercise (reproduce the three arrays and the JSX layout) rather than a state-machine
  rebuild.
- All 19 outbound URLs (9 cert links + 9 bonus-resource links + 1 LinkedIn profile, reused
  twice) were transcribed exactly as they appear in source but were **not** independently
  re-verified as live/correct during this documentation pass (this task only read source
  code, it did not fetch external URLs). Two are worth flagging as most likely to have
  drifted since these link sets tend to rot over time:
  - `https://www.netacad.com/catalogs/learn` (cert #3) is a generic catalog URL, not a
    deep link to the specific "Data Analytics Essentials" course — likely intentional
    since NetAcad course URLs change, but worth confirming it still surfaces that course.
  - `https://mylearn.oracle.com` (bonus resource #6) is bare Oracle MyLearn homepage with a
    note telling the student to search "Oracle SQL Explorer" themselves, rather than a deep
    link — also likely intentional for the same reason.
  - The disclaimer text itself acknowledges this risk directly: "These platforms may update
    their pricing, enrolment processes, or certificate availability at any time — always
    read the course page carefully before signing up to confirm it is still free."
- The component file is prefixed `fmc-` for all its custom CSS animation classes/keyframes
  — this is a leftover/borrowed naming convention (possibly from a "free MySQL cert" working
  name) and has no other significance; it just needs to stay internally consistent if
  reused.
- No images, SVGs, or video assets are referenced — visuals are entirely CSS
  gradients/shadows, emoji, and two inline SVGs (a LinkedIn glyph used twice, and
  `lucide-react`'s `ExternalLink`/`Sparkles` icons).
- Assumed timing/hour estimates and badge/tag labels (e.g. "≈5–7 hrs", "30 min", "≈42 hrs")
  are the lesson's own editorial estimates as written in source, not independently verified
  against the providers' current course lengths.
