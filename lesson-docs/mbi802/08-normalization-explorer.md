# Database Normalisation — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/normalisation` (canonical). `/normalization` redirects to it. Both are registered
  in `AppRoutes` and `ShutdownRoutes` in `src/App.tsx`.
- **Source files:**
  - `src/pages/NormalizationExplorerPage.tsx` — the whole page: data, small `Table`, the SVG
    `DepDiagram` (dependency arrows), `Legend`, `Rule`, `Down`, `Head`.
  - `src/styles/normalisation-explorer.css` — page styles, scoped `nf-` inside `.bt`.
- **Depends on:** Blend `CoursePage` only. No animation, no framer-motion, no storage.
- **History:** this page used to be a long interactive explorer with ten simulations
  (`NormalisationExplorerSims.tsx`, `NormalisationHeroScene.tsx`, `NormalisationThreeTableFix.tsx`).
  It was cut down on request to a short, static page with very little text; the old files are in
  git history.

## 1. Purpose

Show what each normal form requires and show it happening on one example, with as little text as
possible. 2NF and 3NF are taught with dependency diagrams (arrows), not paragraphs.

## 2. Content, in order

Nav: The rules · Start · 1NF · 2NF · 3NF · Result.

1. **Hero** — "Database normalisation" / "One table, three steps: 1NF → 2NF → 3NF."
2. **The rules** — a table:

   | Form | Requirement | Not allowed |
   |---|---|---|
   | 1NF | One value per cell. Every row has a key. | Lists in a cell, repeating groups |
   | 2NF | 1NF + every non-key column needs the **whole** key. | Partial dependency (red) |
   | 3NF | 2NF + non-key columns depend **only on the key**. | Transitive dependency (purple) |

   Then the motto "The key, the whole key, and nothing but the key." and "A → B means: if you
   know A, you know B."
3. **Start** — `StudentCourses(StudentID, StudentName, DeptID, DeptName, CourseID, CourseTitle,
   Grade)`; S1 Amaya D1 Computing has lists `C1, C2` / `Databases, Networks` / `A, B` (shaded
   amber). "Lists inside cells → not even 1NF."
4. **1NF** — rule banner "One value per cell." → `Enrolment(StudentID, CourseID, Grade,
   StudentName, DeptID, DeptName, CourseTitle)`, key StudentID + CourseID, three rows; repeated
   values shaded red.
5. **2NF** — rule banner, legend, dependency diagram of the 1NF table:
   - green: StudentID + CourseID → Grade ("needs both ✓")
   - red: StudentID → StudentName, DeptID, DeptName ("needs only StudentID ✗")
   - red: CourseID → CourseTitle ("needs only CourseID ✗")

   The three FDs are repeated as coloured code chips, then the split into Student, Course,
   Enrolment with sample rows.
6. **3NF** — rule banner, legend, diagram of `Student(StudentID, StudentName, DeptID, DeptName)`:
   green StudentID → StudentName, DeptID; purple DeptID → DeptName ("depends on DeptID ✗"). A chain
   `StudentID → DeptID → DeptName`, one sentence, then the split into Student(StudentID,
   StudentName, DeptID) and Department(DeptID, DeptName).
7. **Result** — the four final schemas with keys underlined, and three cards: 1NF split lists into
   rows / 2NF remove partial dependencies / 3NF remove transitive dependencies.

## 3. The dependency diagram

`DepDiagram({ cols, keyCols, deps, shade })` draws the columns as a row of boxes (118 × 42 each,
key names bold and underlined). Each dependency gets its own level under the boxes: a line drops
from each source column (dot at the top), runs across, and rises into each target with an
arrowhead. Lines are offset a few pixels per dependency so shared columns don't overlap. Colours:
green `#1f8a57` full, red `#d93a2b` partial, purple `#6d4bd8` transitive. The SVG keeps its natural
width (scrolls sideways inside its box on a phone) and has an `aria-label` listing every FD.
