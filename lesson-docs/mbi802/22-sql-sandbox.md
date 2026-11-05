# SQL Sandbox — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public). No login. The student types their first name and student ID once per device. The TA screen needs a PIN set in `Code.gs`.
- **Route(s):** `/sql-sandbox`, and `/sql-sandbox/ta` for the TA's live screen (tabs and open items live in the query string: `?tab=learn|challenges|play|notes`, `&level=L3`, `&ch=c5`)
- **Source files:**
  - `src/pages/SQLSandboxPage.tsx` — page shell, header stats, tabs, ID menu
  - `src/pages/SQLSandboxTAPage.tsx` — the TA's live screen
  - `src/lib/sqlSandbox/activity.ts` — what the student is doing right now (level, step, time on it, failed tries)
  - `src/components/sqlsandbox/` — `IdGate`, `LevelMap`, `LevelPlayer`, `Challenges` (list + player), `Extras` (playground, notes, class board), `Workspace`, `SqlEditor`, `RunOutput`, `TablesPanel`, `useSandbox`, `useProfile`
  - `src/lib/sqlSandbox/` — `engine.ts` (MySQL layer over SQLite), `createTable.ts`, `errors.ts`, `sqlText.ts`, `loadSql.ts`, `themes.ts`, `levels.ts`, `challenges.ts`, `progress.ts`, `notes.ts`
  - `src/styles/sql-sandbox.css` — `sb-` classes on Blend tokens
  - `src/config/sqlSandbox.ts` — the Google Sheet web app URL
  - `scripts/sql-sandbox-sheet/Code.gs` + `README.md` — the Apps Script progress store and its setup
- **Depends on:** `sql.js` (SQLite compiled to WebAssembly, bundled, no CDN), `lucide-react`, Blend (`CourseBrand`, `SaveAsPdf`), `src/lib/notesPdf.ts`, browser `localStorage`, optionally a Google Sheet via Apps Script. No Firebase.

## 1. Purpose

Removes setup from teaching SQL. Students on any device (including phones) write real SQL in the browser and see it behave like MySQL 8. Two tracks share one tool:

- **Learn**: eight levels taking a zero-knowledge student to basic SQL (CREATE DATABASE, USE, CREATE TABLE, INSERT, SELECT/WHERE, UPDATE, DELETE, DROP, keys and constraints), ending with a boss level built unaided.
- **Challenges**: eight puzzles built only from the basics, each with a trap that catches SQL that is "roughly right". Aimed at students who think they already know SQL.

Plus a free **Playground** and **Notes** (a password-protected PDF of all eight levels, built from the student's own business, and an on-screen cheat sheet).

## 2. Content

### Personalisation
The student ID picks one of eight businesses (`themes.ts`: café, bookshop, bakery, pet shop, cinema, florist, phone shop, sports shop). Database name, table name and rows differ per student. Challenge data is seeded from the ID too.

### Levels (`levels.ts`)
| Level | Teaches | Notable moments |
|---|---|---|
| 1 Say hello | Run SQL, CREATE DATABASE, USE, SHOW TABLES | Predict the duplicate-database error |
| 2 Make a table | Types, CREATE TABLE, DESCRIBE | Tap-to-order the CREATE TABLE pieces; design `staff` alone |
| 3 Add rows | INSERT, multi-row INSERT, quotes | Forgot-the-quotes error; text in a DECIMAL column |
| 4 Ask questions | SELECT, columns, WHERE, AND | Predict the row count |
| 5 Change things | UPDATE … SET … WHERE | Run an UPDATE with no WHERE on purpose, then Undo |
| 6 Remove things | DELETE, DELETE without WHERE, DROP TABLE | DELETE vs DROP |
| 7 House rules | PRIMARY KEY, AUTO_INCREMENT, NOT NULL, UNIQUE, DEFAULT | "Make the database say no" |
| 8 Boss level | Everything | A self-ticking checklist: build a loyalty-club database from nothing |

Step kinds: `sql` (checked against database state after Run, Undo or Restart), `choose`, `predict` (answer, then the SQL runs so the student sees the truth), `order`, `boss`. XP: 10 per step (5 after "Show me" or a wrong first answer), 25 per level, 40 for the boss. Stars: 3 with no "Show me" in the run, 2 with one or two, 1 otherwise. "Show me" appears after a hint or two failed runs.

### Challenges (`challenges.ts`)
| # | Title | Trap | Marked on |
|---|---|---|---|
| 1 | Pay rise | Two UPDATEs in the wrong order give some people two raises | Own data + 3 hidden |
| 2 | Outside the city | `city <> 'X'` never matches NULL | Own data + 3 hidden |
| 3 | Swap | UNIQUE is checked row by row; needs a temporary value | Own data |
| 4 | Money doesn't vanish | Fund's own balance is above the line; order of updates | Own data |
| 5 | Mystery update | Work out the rule from before → after; boundary rows; AND/OR precedence | Own data + 3 hidden |
| 6 | Undo the intern | Decide whether an UPDATE is reversible; one variant changes the column its WHERE used | Own data + 3 hidden, or the reason picked |
| 7 | Cascade | Predict CASCADE / SET NULL / RESTRICT effects; SELECT-only until the prediction is in; "try another customer" gives new data | Prediction |
| 8 | Make these fail | Design CREATE TABLE so exactly the student's four inserts are refused | Own pattern |

Hidden tests never reveal their data; a hard-coded `WHERE id IN (…)` passes the visible data and fails them.

## 3. Engine notes (`engine.ts`, `createTable.ts`)
Each MySQL database is its own SQLite database. CREATE TABLE is parsed and rewritten as a SQLite `STRICT` table with named CHECKs for VARCHAR length, integer and DECIMAL range, DATE validity and ENUM, so errors map back to MySQL codes (1406, 1264, 1292, 1265, 3819). Text columns use `COLLATE NOCASE` (MySQL's default is case-insensitive). DECIMAL values are rounded by triggers. Foreign keys are on and checked at creation (1824, 1822). UPDATE reports "Rows matched / Changed" like MySQL. `"double quotes"` are strings and backslash escapes work. Not supported, with a friendly message: ALTER TABLE, transactions, cross-database statements. One known difference: a REAL into an INT column is refused rather than rounded; the message says so.

## 4. Storage
- `localStorage` `sqlsb:profile:v1`: the profile (facts only: steps, levels, challenges, active days; XP and streak are derived, so devices merge by union). `sqlsb:ws:<scope>` and `sqlsb:undo:<scope>`: each workspace's databases and last five undo steps. `sqlsb:draft:*`, `sqlsb:cv:*`, `sqlsb:hist:*`: drafts, cascade variant, level history.
- Google Sheet (optional): `Progress` (one row per ID, upserted) and `Log` (levels, challenge attempts with pastes and seconds). POSTs are `text/plain` to avoid a CORS preflight. `GET ?action=load|board`.

## 5. TA live screen
Each sandbox page reports its current place (`report()` on every new step or challenge, `reportFail()` on every failed run, wrong answer or failed submission) and sends it with the profile push: a few seconds after any change, and every 2 minutes while the page is visible. The sheet stores "Doing now", "Step", "On this step since" (worked out with the sheet's own clock) and "Failed tries on this step". `GET ?action=live&pin=…` returns every student plus quick solves after a paste from the Log. The TA page polls every 15 seconds and sorts Stuck (seen within 4 min, and 6+ min or 3+ failed tries on the step), Working, Idle (4+ min) and Left (20+ min).

## 6. Certificates (switched off: `CERTIFICATES_ENABLED = false` in `src/config/sqlSandbox.ts`)
`/sql-sandbox?tab=cert` shows two cards: **Basic Proficiency in SQL** (all 8 levels) and **Advanced Proficiency in SQL** (all 8 challenges solved). When eligible, the student types their full name (two words minimum, fixed once issued) and claims. The client first pushes the profile, then POSTs `action: 'issue'`; `Code.gs` re-checks the saved profile (levels done / challenges solved), assigns an ID (`SQLB-XXXX-XXXX` or `SQLA-…`, unambiguous letters and digits), and records it in the `Certificates` tab. Issuing is idempotent per student and level. `GET ?action=verify&cert=ID` returns the name, level and date on record.
`/sql-certificate/:id` (public) verifies and draws the poster from the sheet's record: `src/lib/sqlSandbox/certificate.ts` paints a 2400×1697 canvas (ivory paper, double ink-and-gold frame, guilloche watermark, Fraunces type, scalloped seal, QR code) with no platform or institution name: the student, the proficiency, "MBI802 — Database Management Systems", Yasas Sri Wickramasinghe as Senior Lecturer, date and ID. Download as PNG or PDF (jsPDF, loaded on demand), copy the link, or "Add to LinkedIn" (LinkedIn's add-certification form, pre-filled: name, issuer, month and year, certificate URL and ID). Limit: students have no passwords, so a determined student could post a made-up profile; the TA's two-minute spot check is the backstop.

## 7. Checks done before release
Engine smoke tests against MySQL behaviour; every level step solved for all eight themes; every challenge passed with a correct answer and failed with the typical wrong one; Playwright runs at phone and desktop width (gate, levels, Undo, boss, challenges, PDF, reload, two-device restore against a mock sheet); Apps Script exercised against a mocked runtime.
