# Write a scope management plan, as a team — MBI804

- **Subject:** MBI804 — IT Project Management. Explicit — `courseCode="MBI804"` on the page, registry entry `scope-plan` under `MBI804.lessons`, and "Scope management in IT projects" is the third item in the course's indicative content.
- **Gating:** Non-gated (public). Registered in both `AppRoutes` and `ShutdownRoutes` in `src/App.tsx`.
- **Route(s):** `/scope-plan` (HashRouter, so `#/scope-plan`)
- **Source files:**
  - `src/pages/ScopePlanActivityPage.tsx` — the Blend `CoursePage` frame, hero and the 30-minute table in the hero art
  - `src/components/public/ScopePlanActivityLesson.tsx` — the body: lesson header, the eight parts of the plan, the activity, the recap. Holds the PDF path (`SCOPE_PLAN_PDF`)
  - `scripts/scope-plan-pdf/build.py` — builds the PDF
  - `public/mbi804/scope-plan/MBI804-Scope-Management-Plan-Activity.pdf` — the built file, committed
  - `src/content/courses.ts` — registry entry (kind `Practice`, placed before `cost-management`), which generates the `/mbi804` card
- **Depends on:** Blend (`CoursePage`, `SectionHead`, `Reveal`, `Recap`) and `src/styles/blend.css`; `framer-motion` for the hero; `lucide-react` for the download icon. For the PDF: `reportlab`, `fonttools`, `brotli`, and DM Sans from `scripts/er-tutorial-pdf/fonts/`. No Firestore, no network calls.

## 1. Purpose & learning objectives

A 30-minute team activity on the scope management part of the course. Each team gets one small IT project and a cut-down scope management plan template, splits the sections, writes them, swaps and checks a teammate's section, and says what it left out on purpose.

The template is the usual scope management plan outline reduced to the parts a class can fill in: summary, approach, roles, scope statement, WBS and dictionary, verification, change control, sign-off. It follows the section order of the free template at ProjectManagementDocs.com; the wording and the scenario are original, and the PDF and page both credit the source.

Stated objectives:

1. Say what a scope management plan is for
2. Write a scope statement with deliverables, acceptance criteria and exclusions
3. Break deliverables into work packages small enough to hand to one person
4. Describe who decides when someone asks for a change
5. Check a teammate's section and say what is weak about it

## 2. Full content

### The project (used on both the page and PDF page 1)

Harbour Physio is a clinic with five physiotherapists and one receptionist. Appointments are made by phone and written in a paper diary, and double bookings happen most weeks. The owner wants an online booking system: patients book, change and cancel appointments and get a text reminder the day before; the receptionist sees one calendar; each physio sees their own day. 12 weeks, NZ$25,000, running before winter. Online payments and patient notes have come up as "maybe later", which is deliberate: it forces the team to decide what goes in the exclusions. Teams may plan a real project instead.

### The 30 minutes

| Minutes | What |
|---|---|
| 0 to 4 | Read the project, agree a two-sentence summary (section 1), pick a project manager who also keeps time |
| 4 to 5 | Split the sections |
| 5 to 17 | Write your own section, quietly |
| 17 to 25 | Swap with a teammate and run the four checks |
| 25 to 28 | Fix what the checks turned up; the project manager fills in the top of page 2 and the sign-off |
| 28 to 30 | Be ready to tell the class one thing left out on purpose, and why |

### Who writes what (five people)

1. Sections 2 and 3 — how scope is managed, roles
2. Section 4 first half — description, deliverables, acceptance criteria
3. Section 4 second half — exclusions, constraints, assumptions
4. Section 5 — WBS outline and dictionary
5. Sections 6 and 7 — verification, change control

Four people: one person takes sections 2, 3, 6 and 7. Six people: two share the WBS.

### The four checks

1. Does every deliverable show up in the WBS, and does every WBS item lead to a deliverable?
2. Could a stranger answer yes or no to each acceptance criterion? ("Easy to use" cannot be answered; "A patient can book without phoning the clinic" can.)
3. Is each exclusion something a reasonable person might have expected to be included? ("Anything not listed" does not count.) Look at what was done with online payments and patient notes.
4. Does the change process name one person who decides, and say how long they have?

### The PDF

Five A4 pages. Page 1 is the brief above. Pages 2 to 5 are the template, with 83 fillable fields:

- **Page 2:** project name / team / date; 1 Project summary; 2 How scope will be managed (four short questions: who is responsible, where it is written down, how work is checked, who accepts the finished project); 3 Roles and responsibilities (six rows: name, role, what they do about scope)
- **Page 3:** 4 Scope statement — 4a Description, 4b Deliverables, 4c Acceptance criteria, 4d Exclusions, 4e Constraints, 4f Assumptions
- **Page 4:** 5a WBS outline (work packages of about a week, a guide of no more than 40 hours, numbered 1, 1.1, 1.1.1); 5b WBS dictionary (seven rows: code, work package, what the work involves, deliverable, owner, estimate)
- **Page 5:** 6 Scope verification; 7 Scope control and changes (who asks, who works out the effect on time, cost and quality, who decides and how long they have, how everyone is told); 8 Sign-off (sponsor name, title, date, signature line)

The page's eight-row "what the plan is for" table gives the question each part answers.

## 3. UI & interaction design

Blend on MBI804's plum. Hero with a six-row time table beside it; then a lesson header with objectives, the eight-parts table, and the activity: a download button, the project card, the six timed steps as `bt-flow`, the split table, the four checks in a `pbi-nudge`, and a recap. Deliberately plain: no animation beyond the shared `Reveal`, no diagrams. The PDF matches: DM Sans, black text, plum only on numbers and times, no coloured bars or shaded blocks.

## 4. Component & state architecture

No state. `ScopePlanActivityLesson` renders constants (`PARTS`, `SCENARIO`, `TIMINGS`, `SPLIT`, `CHECKS`). The scenario, timings, split and checks are duplicated in `build.py`; the comment at the top of the lesson file says to change both together. The download link is `BASE_URL + SCOPE_PLAN_PDF` with the `download` attribute.

## 5. Rebuild notes

- Rebuild the PDF with `python3 scripts/scope-plan-pdf/build.py` (`pip install reportlab fonttools brotli` once). It writes straight to `public/`.
- Field fonts are Helvetica on purpose. reportlab writes a second `/Font` key into the form resources if two field fonts are used, and one is lost.
- Fillable fields work in browsers' built-in viewers and Acrobat. Some phone viewers show the boxes but will not type into them; printing works everywhere.
- The credit line on PDF page 1 and the note at the bottom of the page name ProjectManagementDocs.com. Keep them if the template text is ever reworded closer to the original: that site asks that its template is distributed only from its own website.
