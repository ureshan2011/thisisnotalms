# Normalisation, the simple way — MBI802

- **Subject:** MBI802 — Database Management Systems. Listed on the MBI802 course page, just before
  the full Database normalisation explorer.
- **Gating:** Non-gated (public). No login, no password, nothing stored.
- **Route(s):** `/normalisation-basics`
- **Source files:**
  - `src/pages/NormalisationSimplePage.tsx` — the route page: a Blend `CoursePage` on MBI802's
    default orange, the section nav, the hero copy and the animated hero picture (`HeroSplit`).
  - `src/components/public/NormalisationSimpleLesson.tsx` — the lesson body: six teaching
    sections, the six-question check, the recap and the Save as PDF panel.
  - `src/components/public/NormalisationSimpleParts.tsx` — the pizza shop data (`MENU`, `ORDERS`,
    `LINES`), the shared table component `NTable`, `RuleBox`, `Swatch`, and the print switch
    (`PrintProvider`, `usePrinting`, `savePageAsPdf`).
  - `src/styles/normalisation-simple.css` — all page styles, scoped `ns-` inside `.bt`, plus the
    `@media print` rules behind Save as PDF.
  - `src/content/courses.ts` — the `normalisation-basics` entry in `MBI802.lessons`
    (`kind: 'Lesson'`, `access: 'open'`), placed before `normalisation`.
  - `src/App.tsx` — the route, registered in both `AppRoutes` and `ShutdownRoutes`.
- **Depends on:** Blend (`CoursePage`, `SectionHead`, `Reveal`, `Quiz`, `Recap`), `framer-motion`,
  `lucide-react` icons. No Firestore, no storage of any kind.

## 1. Purpose & learning objectives

A short, plain-language companion to the full `/normalisation` explorer, for a student who wants
the idea before the theory. No jargon beyond "key" and "depends on", each explained with the
example. Textbook terms (update / insertion / deletion anomaly, functional dependency) appear once
each, in small print, so students can match them to their reading.

By the end a student can say why a table that repeats facts causes problems, and take a table from
a messy sheet through 1NF, 2NF and 3NF, asking one question per column: "to know this value, what
do I need?"

## 2. Full content

**The running example.** A small pizza shop takes phone orders and writes them on one sheet.

| Order | Items | Qty | Price | Date | Cust ID | Customer | Phone |
|---|---|---|---|---|---|---|---|
| 1001 | Chicken Pizza, Garlic Bread | 1, 2 | $18, $6 | 3 Mar | C1 | Amaya | 021 555 0101 |
| 1002 | Veggie Pizza | 1 | $16 | 3 Mar | C2 | Ravi | 022 555 0202 |
| 1003 | Chicken Pizza, Cola | 2, 1 | $18, $3 | 4 Mar | C1 | Amaya | 021 555 0101 |

Menu prices: Chicken Pizza $18, Garlic Bread $6, Veggie Pizza $16, Cola $3.

**Hero.** Flag "Normalisation, the simple way", headline "One fact, one place.", lede "Normalisation
is how you tidy a messy table so each piece of information is stored once. This page shows it with a
pizza shop's order sheet, one step at a time, from 1NF to 3NF." Meta "Yasas Sri Wickramasinghe,
MBI802 lecturer · 15 minutes · no login". Buttons: Start the lesson (scrolls to `#why`), Save as
PDF. Hero picture: the sheet as eight column strips with red marks on repeated values; the strips
take their colours one by one; then they move into four labelled tables (Customers, Orders, Menu,
Order items), with the copied key columns appearing. Plays once (1.5 s, 3.3 s), three progress
dashes, a caption per phase, and a Play again button. No loop.

**Colour code** (used everywhere): key columns near-black with a key icon; blue = needs only the
Order (→ Orders); teal = needs only the Item (→ Menu); magenta = needs Order and Item together (→
Order items); amber = needs only the Cust ID (→ Customers).

**1 · Why it matters (`#why`).** "Store each fact once." Picture of two panels: *Copies
everywhere* (two sticky notes for orders 1001 and 1003, Amaya's number different on each, badge
"Which number is right?") against *One copy, pointed to* (one customer card C1, two order tickets
pointing at it, badge "Always the same number"). Five benefit tiles: less typing, no
contradictions, add things any time, delete safely, easy to search. Then "Meet the pizza shop" and
a four-tab demo on the sheet, each with a button that plays it:
- *A phone number changes* — 1001 gets 021 555 0199, 1003 keeps the old number; both go red.
  "Now the sheet has two numbers for Amaya…" (update anomaly).
- *A new pizza* — a row of "?" with Hawaiian Pizza $17. "Every row is an order…" (insertion anomaly).
- *An order is cancelled* — row 1002 struck through; Ravi's phone and the Veggie Pizza price go
  with it (deletion anomaly).
- *Count the pizzas* — Chicken Pizza and its quantities marked inside the list cells: 1 + 2 = 3,
  "a database query can't, at least not easily" (why 1NF asks for one value per cell).

**2 · The plan (`#plan`).** "Three steps, one at a time." A rising four-step ladder: Start (the
messy sheet), 1NF (one value in each cell), 2NF (every column needs the whole key), 3NF (columns
depend on the key, not on each other). "Two words you need first": *Key* (picks out exactly one
row; sometimes two columns together) and *Depends on* (know the item, know the price; Cola → $3,
Chicken Pizza → $18; "Textbooks write this as Item → Price and call it a functional dependency").

**3 · 1NF (`#first`).** Rule: every cell holds one value, and every row can be picked out by a
key. Three steps: find the lists; give each value its own row, copying the date and customer; pick
the key (Order + Item). Stage: Before / After with a "Split the lists" button; the five 1NF rows
slide in. Caption: Amaya's phone was typed twice, now four times; 1NF often adds repeats, steps 2
and 3 take them away. "Which column picks out one row now?" buttons: Order = 1001 (2 rows), Item =
Chicken Pizza (2 rows), Order 1001 and Chicken Pizza (1 row, so together they are the key).

**4 · 2NF (`#second`).** Rule: in 1NF, and every other column needs the whole key, not just part of
it; a one-column key has no parts, so such a table is already in 2NF. The 1NF table with headers and
columns colouring as six question cards are tapped: Qty (both), Price (just the Item), Date, Cust
ID, Customer, Phone (just the Order). Show all answers; Split by colour gives Order items (Order,
Item, Qty), Menu (Item, Price) and Orders (Order, Date, Cust ID, Customer, Phone), with Amaya's
repeated name and phone marked in Orders as the job for step 3.

**5 · 3NF (`#third`).** Rule: in 2NF, and no column depends on another column that is not the key.
Quick test: cover the key; can one of the other columns tell you another? Animated chain: Order 1001
→ tells you → Cust ID C1 → tells you → Amaya · 021 555 0101. "Move the customer details out" splits
Orders into Orders (Order, Date, Cust ID) and Customers (Cust ID, Customer, Phone). Then a dark
"One line to remember" card: "Every column should be about the key (1NF), the whole key (2NF), and
nothing but the key (3NF)", each part underlined in its colour.

**6 · The result (`#result`).** The four tables laid out with their links (Customers–Orders by Cust
ID, Orders–Order items by Order, Order items–Menu by Item). The three problems again, as buttons:
Amaya changes her number (one cell, both orders see it), Add a Hawaiian Pizza (a Menu row, no fake
order), Cancel order 1002 (order gone, Ravi and the Veggie Pizza price still there). Three stats:
Amaya's phone stored 4 → 1, Chicken Pizza price stored 2 → 1, places to fix when a price goes up
2 → 1.

**Check yourself (`#check`).** Six questions, every option explained:
1. A cell says "Maths, Science, English" — which step fixes this? **1NF**.
2. Enrolments (StudentID, CourseID, StudentName, Grade), key StudentID + CourseID — which column
   breaks 2NF? **StudentName**.
3. Staff (StaffID, Name, DeptID, DeptName), key StaffID — what is wrong? **DeptName depends on
   DeptID, not on StaffID** (3NF).
4. Why can't the owner add the Hawaiian Pizza price to the first sheet? **Every row is an order,
   so a pizza on its own has no row.**
5. A table in 1NF with a single-column key — which is true? **It is already in 2NF.**
6. Main point of normalisation? **Store each fact once, so copies can't disagree.** (The "remove
   every repeated value" distractor explains that C1 repeating in Orders is needed.)

**Recap.** "One sheet became four tables, and each fact now lives in one place." Five points: store
each fact once; 1NF; 2NF; 3NF; check with one question.

**Save as PDF (`#pdf`).** Steps: press the button, choose Save as PDF as the destination, press
Save; tick Background graphics if colours come out grey.

## 3. UI & interaction design

Blend frame and type on MBI802's orange, with this page's own colour code for columns (see above).
Tables use DM Sans at 14.5px, coloured headers and lightly tinted columns, highlights drawn inside
the cell (red = wrong/lost, green = fixed/kept, orange = look here). Motion: scroll entrances on
every block, staggered row entrances on each split, the hero split, ladder bars rising, link lines
growing in the result, the chain drawing in, strike-throughs on the stats. Everything plays once;
nothing loops. Phone layout: one column throughout, the ladder turns into horizontal bars, the
result links go vertical, wide tables scroll inside their own frame.

## 4. Component & state architecture

All state is local React state: the problem tab and whether it has played; 1NF split and the
"find" filter; 2NF revealed columns and split; 3NF split; the result action. `PrintProvider` holds
a `printing` flag, set (with `flushSync`) on `beforeprint` and cleared on `afterprint`. While it is
set every stage renders its finished state: all four problems played one after another, Before and
After tables both shown, every column coloured and split, the result tables clean with the three
outcomes written underneath, and the quiz replaced by a numbered list of questions with answers.
`savePageAsPdf()` dispatches `beforeprint`, waits two frames and calls `window.print()`.

## 5. Rebuild notes

- The print rules force `opacity: 1; transform: none` on every non-SVG element so content that
  never scrolled into view is not left invisible; SVG internals are excluded because their
  transforms are layout. Sections 3 to 6 and the check start on a new page.
- blend.css's `.bt-hero { padding: 56px 0 4px }` drops the side gutter on phones for every Blend
  page; this page restores it for itself only (`.bt-hero:has(.ns-hero__svg)`). Fixing it in
  blend.css makes `/intro-to-dbms` overflow, so it was left alone there.
- Names, phone numbers and the shop are made up.
