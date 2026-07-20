# MySQL Development Environment Setup — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Gated (student/staff login required)
- **Route(s):** `/student/course-resources` (no dedicated route — rendered inline as the first
  lesson row of the MBI802 tab; lesson `id: 'setup'`)
- **Source files:**
  - `src/pages/student/CourseResources.tsx` — the entire lesson lives here. The lesson metadata
    (title/subtitle/icon) is the first entry in the MBI802 `lessons` array (lines 188–195), and
    the content renderer is the inline function component `SetupLesson()` (lines 288–413), which
    is mounted at line 1752 via `{lesson.id === 'setup' && <SetupLesson />}`.
  - No separate component file exists for this lesson — unlike every other MBI802 lesson, it is
    not imported from `src/components/`.
- **Depends on:** `lucide-react` icons (`Video`, `Sparkles`, `Apple`, `MonitorSmartphone`,
  `Laptop`, `Monitor`, `ExternalLink`), and two external SharePoint video links plus one
  Microsoft-hosted Visual C++ redistributable link (all listed in full below). No Firestore
  reads/writes are performed by this lesson.

## 1. Purpose & learning objectives

A pre-class logistics lesson, not a content lesson: its job is to get every student's local
MySQL environment installed and working *before* the first hands-on class, so classroom time can
be spent on database concepts rather than installer troubleshooting. It is written directly in
the MBI802 lecturer's voice as a first-person "post" (styled like a course announcement/forum
post rather than a slide deck) addressed to students, and it exists specifically because a
prior cohort's install issues were unmanageable to triage individually in a public comments
thread with "more than one hundred students."

The lesson's implicit learning objective is: arrive at the next class with MySQL (client + a
way to run SQL, e.g. MySQL Workbench) already installed on your own Windows or Mac machine, or
with documented errors ready to show a TA in person.

It is the first lesson listed for MBI802 (`Lesson 1` in the UI) and is not gated behind the ER
MCQ score — it is immediately open to any student enrolled in MBI802.

## 2. Full content

The lesson renders as a single scrollable card with no slides/tabs — just one continuous post.
Full transcribed text, in order:

**Eyebrow label:** "Post"

**Heading:** "MySQL Development Environment Setup Video Tutorials"

**Opening line:** "Dear students, Ayubowan!" (a Sinhala greeting, signalling the lecturer's own
voice/cultural context)

**Author pill:** "Author: MBI802 Lecturer" (with a sparkle icon)

**Body paragraph 1:**
> "I have created two video tutorials to help you set up MySQL on your Windows or Mac computer.
> Please try the installation on your own. You will also have time in class next week to set it
> up with support."

**Two-column info cards:**
- **MacOS Setup Path** (blue-tinted card, Apple icon): "Recommended for MacBook and iMac users.
  Follow this first before class support time."
- **Windows Setup Path** (violet-tinted card, MonitorSmartphone icon): "Best for Windows laptops
  and desktops. Keep screenshots ready if any installer error appears."

**Two video link buttons** (open in new tab):
- **MacOS Guide Video** (Laptop icon + ExternalLink icon) — links to a SharePoint Stream video:
  `https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAdgK7LxBsxQ4OpdEwrXl17AX3mZyaMmmlXdA3xw4jSvcs?...` (full query string with `nav=` share-dialog params is in source; institutional SharePoint auth is required to view it).
- **Windows Guide Video** (Monitor icon + ExternalLink icon) — links to a second SharePoint
  Stream video: `https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAGNda_bc72R55878wdYxfRAbAKGBetSMR65xdEWdQO3ZU?...`

**Body paragraph 2 (Visual C++ warning):**
> "Some of you may see a popup asking to install Visual C++. If that happens, simply download the
> recommended file that appears on your screen, or use this link:
> [Visual C++ Redistributable]" — link text `Visual C++ Redistributable` → `https://aka.ms/vs/17/release/vc_redist.x64.exe`.
>
> "." (closes the sentence)

**Body paragraph 3 (managing expectations on errors):**
> "Different computers can show different errors depending on the software versions you have. One
> full hour has been set aside in the next class for one-to-one in-person help from your teaching
> assistants. If you run into any issues, take screenshots and bring them to class."

**Body paragraph 4 (comment moderation ask):**
> "Please avoid posting errors here, since there are more than one hundred students and it becomes
> difficult to manage. Comments and suggestions are welcome, especially if you would like more
> video tutorials."

**Body paragraph 5 (fallback plan):**
> "If your issue is still not solved by the end of the next class, a Google Form will be shared
> where you can submit your details. This is exactly why the database setup started early, so
> there is no pressure at all."

**Closing line:** "Happy learning!" (bold, dark violet)

There is no quiz, no interactive activity, and no completion/progress tracking in this lesson —
it is purely informational/navigational content plus two external video links and two external
support links (Visual C++ redistributable).

## 3. UI & interaction design

- Rendered as a single `space-y-4` vertical stack inside the shared `LessonRow` accordion shell
  (see `CourseResources.tsx` `LessonRow` component) — clicking the "Lesson 1" header row expands
  this content in place; no internal navigation/pagination within the lesson itself.
- Palette is violet/purple throughout (`#7c3aed` header accent, `#8b5cf6` eyebrow, `#4c1d95`/`#5b21b6`
  headings and links, `#374151` body text) — consistent with the MBI802 course accent color
  (`accentColor: '#7c3aed'` in the `COURSES` array).
- Two-column responsive card grid (`grid-cols-1 md:grid-cols-2`) for the OS-specific info cards
  and again for the two video-link buttons — collapses to a single column on narrow viewports.
- Info cards use soft gradient backgrounds: blue gradient (`rgba(219,234,254,...)` →
  `rgba(186,230,253,...)`) for MacOS, violet gradient (`rgba(237,233,254,...)` →
  `rgba(224,231,255,...)`) for Windows — each with a matching soft border and an icon + bold
  label header.
- Video-link buttons are bordered rounded cards (`rounded-2xl`) with a hover state
  (`hover:border-violet-300 transition-all`) and an `ExternalLink` icon signalling they open in a
  new tab (`target="_blank" rel="noreferrer"`).
- Typography: eyebrow labels are `text-xs font-semibold uppercase tracking-wider`; the lesson
  title is `text-lg font-bold`; body paragraphs are `text-sm leading-6`.
- No animation/transition beyond the standard hover states and the shared accordion expand
  behavior inherited from `LessonRow`.

## 4. Component & state architecture

- `SetupLesson()` is a stateless, prop-less function component — no `useState`/`useEffect`,
  no Firestore reads, no props passed in. It is pure static JSX.
- It is invoked conditionally inside the `course.lessons.map(...)` loop in the main
  `CourseResources` component, gated only on `lesson.id === 'setup'` — this lesson is **not**
  included in the `gated` boolean check (`['normalization', 'quiz'].includes(lesson.id)`), so it
  is always unlocked for any student who can see the MBI802 tab at all (i.e. any student with
  `'MBI802'` in their `studentProfile.subjects` array, per the `enrolledSubjects` filter in the
  parent component).
- Lesson metadata driving the row header comes from the `COURSES` array entry:
  ```ts
  {
    id: 'setup',
    title: 'MySQL Development Environment Setup',
    subtitle: 'Video tutorials for MacOS and Windows installation',
    icon: <Video size={18} />,
    accentColor: '#7c3aed',
  }
  ```
- No badges, no scoring, no completion tracking — this lesson has no state machine at all beyond
  the shared accordion open/closed toggle (`openLesson` state in the parent, matched against
  `lesson.id`).

## 5. Rebuild notes

- **Not a standalone component file** — if rebuilding, note this lesson's content lives entirely
  inline inside `CourseResources.tsx` rather than in `src/components/`. A faithful rebuild should
  preserve that placement (or, if extracting to its own file for cleanliness, must keep the exact
  same import wiring at the `lesson.id === 'setup'` conditional).
- **External links will likely need revalidation**: both SharePoint Stream video links are
  institutional (`myacg.sharepoint.com` / `myacg-my.sharepoint.com`) and gated by the
  institution's own auth — they are not publicly embeddable and will break if the tenant, share
  link, or video is removed/rotated. The Visual C++ redistributable link
  (`https://aka.ms/vs/17/release/vc_redist.x64.exe`) is a stable Microsoft short-link and should
  remain valid indefinitely.
- **No completion state** is stored anywhere (no Firestore doc, no localStorage) — a student can
  reopen this lesson at any time with no "seen/unseen" marker. This is a deliberate simplicity
  choice consistent with its purpose as a one-time pre-class instructional post rather than a
  tracked lesson.
- **Comment says "Please avoid posting errors here"** — the "here" implies there was once (or is
  elsewhere) a comments feature associated with this post; no comments UI exists in the current
  component, so this is either legacy phrasing carried over from an original announcement/LMS
  post this content was adapted from, or refers to a channel outside this app (e.g. a Teams/forum
  thread). Worth flagging as a minor content quirk if rebuilding from scratch — the sentence
  doesn't map to any in-app affordance.
- Tone/voice ("Ayubowan", first-person lecturer voice, informal sign-off "Happy learning!") is
  intentional and should be preserved verbatim in any rebuild — it is stylistically distinct from
  every other lesson in the app, which are written as neutral instructional slide decks.
