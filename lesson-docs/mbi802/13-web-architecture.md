# Client, Server & Databases (Web Architecture) — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/web-architecture`
- **Source files:**
  - `src/pages/WebArchitecturePage.tsx` (hero/landing wrapper, ~127 lines)
  - `src/components/slides/WebArchitectureLesson.tsx` (the actual lesson, self-contained, ~969 lines)
- **Depends on:**
  - `src/components/ui/BrandLogo` (nav/footer logo, `on-light` variant)
  - `react-router-dom` (`Link` to `/home`)
  - `framer-motion` (`motion` for hero entrance animations)
  - Browser `IntersectionObserver` API (custom `useReveal` hook for scroll-reveal)
  - No Firestore reads/writes — the whole lesson is client-only local React state, no persistence, no login
  - External links (opened in the final "Resources" section, `target="_blank"`): YouTube ("How the Internet Works in 5 min" — Aaron Titus), MDN Web Docs ("How the Web works"), freeCodeCamp ("Client-Server architecture, explained simply"), SQL Murder Mystery (mystery.knightlab.com), SQLBolt (sqlbolt.com), PortSwigger Web Security Academy (portswigger.net/web-security), OWASP Input Validation Cheat Sheet, OWASP Top 10

## 1. Purpose & learning objectives

This is a beginner-friendly, highly interactive lesson explaining how the web actually works, aimed at students with no prior networking/backend background. Its own file-header comment states the intent directly:

> "A public, self-contained, highly interactive lesson. It teaches absolute beginners what runs on YOUR computer vs. the company's computer, how a website talks to a database, and why validating data is the single most important security habit a developer can build. Pseudo-3D animated journeys, sorting games, a live database search, and a safe-by-design 'attack lab' that shows exactly why input validation matters."

By the end, a student should be able to:
- Correctly sort a task ("check a password", "animate a button") into "runs on the client" or "runs on the server", and explain the rule of thumb for doing so.
- Narrate the seven-step round trip of a single web request from browser click to rendered response, including the roles of DNS, the HTTP request, the server's authorization check, the SQL query to the database, and the response.
- Explain that the browser never talks to the database directly — the server is a gatekeeper in between.
- Explain why client-side validation alone is unsafe (it can be bypassed/tampered with) and that the server must always re-validate.
- Recognize a SQL injection attack (e.g. `admin' --`) against a naively-built query, and explain why a parameterised query defeats it.
- Recognize Cross-Site Scripting (XSS) — printing untrusted input as HTML instead of escaped text — and why output escaping prevents it.
- Recite the six-point "validation checklist" (validate on server, allow-list not deny-list, parameterised queries, escape output, check type/length/range, fail safely).

The page is explicitly styled to match `SystemsSecurityLesson` ("House style matches SystemsSecurityLesson: white canvas, soft cards, reveal-on-scroll, Apple-like type" — per file header), i.e. it belongs to a family of similarly-styled public lessons.

The hero/landing wrapper (`WebArchitecturePage.tsx`) tags the lesson with the eyebrow text **"MBI802 · Database & Web Systems"** directly above the H1 (confirmed verbatim in source, line 47: `MBI802 · Database &amp; Web Systems`). The lesson component's own closing footer repeats a very similar tag: **"MBI802 · Database & Web Systems · Master of Business Informatics"** (line 963 of `WebArchitectureLesson.tsx`).

## 2. Full content

### Hero section (`WebArchitecturePage.tsx`)

- Eyebrow: "MBI802 · Database & Web Systems"
- H1: "Client, Server & **Databases.**" (the word "Databases." is rendered in a blue→purple→teal gradient text-clip, using colors `#0071e3`, `#7c3aed`, `#0d9488`)
- Subhead: "How a website actually works — and why validating data is the security habit that matters most. A hands-on tour for absolute beginners."
- A row of five topic pills, each with an emoji, label, and its own accent color:
  1. 💻 Client vs server (`#0071e3`)
  2. 🌐 The round trip (`#7c3aed`)
  3. 🗄️ Databases (`#0d9488`)
  4. 🛡️ Data validation (`#e5484d`)
  5. 🧪 Attack lab (`#f59e0b`)
- "Scroll to begin" prompt with a bobbing-arrow-style vertical float animation.
- Footer: logo, then a "‹ Back to all lessons" link to `/home`.

### Intro paragraph (top of `WebArchitectureLesson`)

> "Every website you've ever used is really **two computers having a conversation**: the one in your hand (the **client**) and one in a data centre far away (the **server**), with a **database** behind it remembering everything."

> "This lesson is built to be *played with*. You'll sort jobs between the two computers, watch a request travel there and back in 3D, run a live database search, and step into a safe 'attack lab' that shows — with your own hands — why **validating data** is the most important security habit you can build. No setup, no logins. Start anywhere."

### Part 1 · The two computers — "Client and server — who does what?"

Kicker: "Part 1 · The two computers". Blurb: "The single most useful idea in web development. Tap each machine to see its job, then play the sorting game to lock it in."

**ClientServerScene** (toggle component, two clickable boxes — 💻 Client / 🖥️ Server — joined by a "the internet" wire showing "request ›" / "‹ response"):

- **Client** panel (color `#0071e3`, icon 💻): "The CLIENT — your device" / "The browser on your phone or laptop". Does:
  - "Shows the page (HTML, colours, layout)"
  - "Reacts instantly to clicks & typing"
  - "Plays animations and validates the form for a friendly feel"
  - "Sends requests to the server when it needs real data"
  Key idea: "It can NOT be trusted with secrets. Anyone can open it and change what it does."
- **Server** panel (color `#7c3aed`, icon 🖥️): "The SERVER — the company's computer" / "A computer running somewhere in a data centre, 24/7". Does:
  - "Runs the real business logic (prices, permissions, payments)"
  - "Talks to the database to read & save data"
  - "Checks that every request is allowed and valid"
  - "Sends back a response (a page, or data as JSON)"
  Key idea: "This is the source of truth. It must re-check everything the client tells it."

**SortingGame** (drag-free tap game): Instruction text — "Tap **Client** or **Server** for each job — then check your answers. A handy rule: *anything to do with looks & feel is the client; anything to do with truth, money or storage is the server.*"

The 8 jobs and correct answers:
1. "Animate a button when you hover it" → client
2. "Check your password is correct" → server
3. "Store your order forever" → server
4. "Show a red outline on an empty box" → client
5. "Decide if you are allowed to see admin pages" → server
6. "Scroll the page smoothly" → client
7. "Charge your credit card" → server
8. "Hide a menu until you tap it" → client

Student taps Client/Server per row, then presses "Check answers" (disabled until all 8 answered). Score shown as `N / 8` with 🏆 for a perfect score, 👍 for ≥5, 📚 otherwise. "↻ Try again" resets.

### Part 2 · The round trip — "The journey of a single request"

Kicker: "Part 2 · The round trip". Blurb: "What actually happens between tapping a button and seeing the result? Press play and follow one request from your browser, to the server, into the database, and all the way back."

**RequestJourney**: a pseudo-3D animated pipeline with 4 nodes along a road (💻 Browser, 🌐 Internet, 🖥️ Server, 🗄️ Database) and a traveling packet dot. 7 narrated steps (title + text), each tagged with a phase badge (`request` / `query` / `response`):

1. "1 · You click 'Search'" (phase: request) — "Your browser packages a request — basically a polite note: 'GET me the users named Ava.' This note is an HTTP request."
2. "2 · Across the internet" (phase: request) — "The request travels through the internet. DNS acts like a phone book, turning the website name into the server's real address (an IP)."
3. "3 · The server wakes up" (phase: request) — "The web server receives the note and runs the app's code. It works out what you asked for and whether you're allowed to have it."
4. "4 · Asking the database" (phase: query) — "The server doesn't store the data itself — it asks the database with a query: SELECT * FROM users WHERE name = 'Ava'."
5. "5 · Rows come back" (phase: response) — "The database finds the matching rows and hands them back to the server. The server wraps them into a response (HTML or JSON)."
6. "6 · The reply travels back" (phase: response) — "The response heads back across the internet to your device — the same road, the other direction."
7. "7 · You see the page" (phase: response) — "Your browser reads the response and paints the result on screen. The whole round trip usually takes a fraction of a second."

Controls: "▶ Play the journey" (auto-advances every 1.7s, becomes "⏸ Playing…" while running, "↻ Replay" at the end), "‹ Back", "Step ›", plus a row of 7 progress-dot buttons that jump directly to any step.

### Part 3 · Meet the database — "How a website talks to a database"

Kicker: "Part 3 · Meet the database". Blurb: "The server keeps nothing in its head — it asks a database. Type a name and watch the website turn your search into a query, send it to the database, and render the rows that come back."

**DatabaseConnect**: a two-panel live simulation.

- Panel ① "The website (client)" — "A simple 'find a user' box. Type a name and search." A text input (default value "Ava") + "Search" button. Pressing Search (or Enter) walks through simulated stages: "⏳ Asking the server…" then "⏳ Server querying the database…" before showing results ~1.4s later.
- Panel ② "Server → Database" — "The server turns your search into a **query** — a sentence in SQL, the language databases speak — and sends it to the database." Shows a live-updating SQL query box:
  ```sql
  SELECT id, name, city
  FROM users
  WHERE name LIKE '%<term>%';
  ```
  Below it: "The database scans the **users** table, keeps the matching rows, and sends them back to the server — which forwards them to the page." And a callout: "The browser **never** talks to the database directly. The server sits in the middle as a gatekeeper — which is exactly where validation belongs (next section)."

Seed dataset (`PEOPLE`, 5 rows), used for the live substring search on `name`:
| id | name | city |
|---|---|---|
| 1 | Ava Perera | Auckland |
| 2 | Ben Silva | Wellington |
| 3 | Chloe Fonseka | Christchurch |
| 4 | Ava Jayasuriya | Hamilton |
| 5 | Dilan Mendis | Dunedin |

Default search term is "Ava", which matches rows 1 and 4 initially (pre-computed on mount).

### Part 4 · The security lab — "Why data validation matters — try to break it"

Kicker: "Part 4 · The security lab". Blurb: "Here's the heart of the lesson. Untrusted data is the source of most web hacks. These three hands-on demos let you safely attack a careless app, then watch a validated one shrug the attack off."

**4a · Client checks can be bypassed** (sub-heading blurb: "Why a check in the browser is never enough on its own.")

`BypassDemo`: An age-gate form ("18 or older only"). Explainer: "This form is '18 or older only'. The **client** checks your age for a nice experience — but a determined user can open the browser tools and **switch that check off**. Watch what happens when only the client validates." Controls: numeric "Your age" input (default `15`), and a "🛠️ Tamper with the page" toggle button (becomes "🐱‍💻 Tampering ON") with the caption: "('Tamper' simulates a user editing your client-side code in the browser — something you can never stop them doing.)"

Two side-by-side outcome boxes:
- "Client-only validation" — if tampering is ON, always shows "✅ Form submitted — 'you're 18+'" with note "The user switched the check off. A 15-year-old just got through — because the client can't be trusted." If not tampered, reflects the real age check, with note "Looks fine… until someone tampers with it."
- "Server also validates" — always reflects the true `age >= 18` check regardless of tampering. If real age <18 (even while tampered), shows "🚫 Rejected by the server" with note "Even with the client tampered, the server re-checked the real value and refused. Safe." If ≥18: "✅ Accepted — server confirmed 18+", note "The real age was 18+, so the server agrees."

Golden-rule callout: "validate on the client for a *friendly* experience, but **always validate again on the server for safety**. Never trust data coming from the browser."

**4b · SQL injection** (sub-heading blurb: "What happens when user text is glued straight into a database query — and the one-line fix that stops it cold.")

`SqlInjectionDemo`: A simulated login form with a "Username" text field (default `admin' --`) and a mode toggle: "⚠️ Naive code (glues text into SQL)" vs "🛡️ Safe code (parameterised)". Preset buttons: "😈 Try the attack: admin' --", "😈 ' OR '1'='1", "😇 normal: admin". The pretend backing account is `user: admin, pass: hunter2` (password never shown/used directly, always masked as `•••••` in the naive query preview).

- **Naive mode**: shows the literal glued SQL: `SELECT * FROM users WHERE user = '<input>' AND pass = '•••••';` (the pasted username substring is highlighted red if it looks like an injection attempt). Outcomes:
  - If the input contains `--`, or matches `'\s*OR\s*'?1'?\s*=\s*'?1` (case-insensitive), or contains `' OR '`: **"🔓 Logged in as admin — with NO password!"** — "Your text closed the quote and commented out the password check (-- ). The database obeyed it as a command. This is SQL injection, the #1 web vulnerability for years."
  - Else if input === `admin`: "🔒 Password required" — "A normal username — the password check still applies. (Now try the injection preset to see the danger.)"
  - Else: "🚫 No such user" — "No matching row."
- **Safe (parameterised) mode**: shows a parameterised query with `?` placeholders: `SELECT * FROM users WHERE user = ? AND pass = ?; -- ? is filled with your text as plain DATA`. Outcomes:
  - If the input "looks like an injection" (matches `('|--|\bOR\b|=)`): "🚫 Access denied" — `The database searched for a user literally named "<input>" — quotes, dashes and all — and found nobody. The attack became harmless text.`
  - Else if input === `admin`: "🔒 Password required" — "Valid username, but the password still has to match. Safe and correct."
  - Else: "🚫 No such user" — "No matching row."

**4c · Cross-site scripting (XSS)** (sub-heading blurb: "When a page prints user input as HTML instead of text, attackers can run code in other people's browsers.")

`XssDemo`: Explainer — "A comment box on a website. If the server stores your text and the page later prints it *as HTML*, an attacker can sneak in code that runs in **other people's** browsers — stealing their session. That's **Cross-Site Scripting (XSS)**. The fix is to **escape** the text so it's shown as plain characters." Text input defaults to `<img src=x onerror="stealCookies()">`. Mode toggle: "⚠️ Printed as HTML" vs "🛡️ Escaped as text".

- **Naive ("Printed as HTML")**: if the text matches a script/tag-with-handler pattern (`<\s*(script|img|svg|on\w+=)`), shows: "💥 The browser would try to RUN this as code. In a real naive site, 'stealCookies()' could now run in every visitor's browser and hijack their account." If it merely contains a tag: "⚠️ The browser treats your <tags> as real HTML — already a foothold for an attacker." Otherwise shows the raw text. Always followed by a disclaimer: "(We're describing what would happen — nothing is actually executed here.)"
- **Safe ("Escaped as text")**: shows the comment text verbatim in monospace with: "✅ Shown exactly as typed — the < and > are escaped into harmless characters, so nothing runs. Just a weird-looking comment."

**4d · The validation checklist** — six rule cards, each with an icon, title, and description:
1. ✅ "Validate on the server" — "The browser can be edited by anyone. The server is the only place a check truly counts."
2. 🎯 "Allow-list, don't deny-list" — "Say exactly what good looks like ('digits only, 1–3 of them'), instead of trying to ban every bad thing."
3. 🧱 "Use parameterised queries" — "Never glue user text into SQL. Use placeholders (?) so input is always data, never commands."
4. 🧼 "Escape output" — "When showing user text on a page, escape it so < > & become harmless characters."
5. 📏 "Check type, length & range" — "An age is a number 0–120; an email has a shape; a name has a sensible length. Reject the rest."
6. 🔒 "Fail safely" — "When in doubt, reject. A blocked honest user is annoying; an allowed attacker is a breach."

### Final challenge — "Prove it. Five quick questions."

Blurb: "Pull it together — client vs server, the round trip, databases, and validation. Answer all five, then submit for instant feedback."

`FinalQuiz` — 5 multiple-choice questions, each with 4 options, the correct index, and an explanation shown after submission:

1. **"A smooth hover animation on a button — where does it run?"**
   Options: "On the server" / "On the client (browser)" ✓ / "In the database" / "On the internet cable"
   Why: "Look & feel lives on the client. Animations run in the visitor's browser, with no server needed."
2. **"Your website needs to show a list of users. Who actually fetches them from storage?"**
   Options: "The browser reads the database directly" / "The server queries the database, then replies to the browser" ✓ / "The internet stores the users" / "The user types them in each time"
   Why: "The browser never touches the database. The server is the gatekeeper that runs the query and returns the result."
3. **"You added an 'age must be 18+' check in the browser only. Is that safe?"**
   Options: "Yes, the browser can't be changed" / "No — a user can bypass client checks, so the server must re-validate" ✓ / "Only on phones" / "Yes, if you use a strong password"
   Why: "Client checks are for friendliness and can always be bypassed. Real safety requires the server to validate again."
4. **"Typing admin' -- into a login box logs you in with no password. What flaw is this?"**
   Options: "Cross-site scripting" / "A weak password" / "SQL injection (text glued into the query)" ✓ / "A slow internet connection"
   Why: "The input was concatenated into the SQL string, so it ran as a command. Parameterised queries prevent this."
5. **"A comment box lets people post `<script>` tags that then run for other visitors. The fix is to…"**
   Options: "Make the page load faster" / "Escape the output so tags show as plain text" ✓ / "Use a bigger database" / "Hide the comment box on mobile"
   Why: "Escaping output turns < and > into harmless characters, so user text is displayed, never executed. That stops XSS."

Submit is disabled until all 5 are answered ("Answer all five to submit"). After submission, each option is recolored (correct = green, wrongly-picked = red) and the per-question explanation appears. Final score shown as `N / 5` with 🏆 for a perfect score, 👍 for ≥3, 📚 otherwise, plus a "↻ Retake" button that clears all answers.

### Keep going — "More to explore"

Blurb: "Hand-picked, beginner-friendly resources and live simulators — to watch, to read, and to safely practise on." 8 resource cards, each with a tag, title, source/author, one-line description, and outbound link (all open in a new tab):

1. **Watch** — "How the Internet Works in 5 min" — Aaron Titus · YouTube — https://www.youtube.com/watch?v=7_LPdttKXPc — "A friendly animated overview of clients, servers and requests."
2. **Read** — "How the Web works" — MDN Web Docs — https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works — "The classic beginner explainer of client, server, DNS and HTTP."
3. **Read** — "Client-Server model, explained simply" — freeCodeCamp — https://www.freecodecamp.org/news/client-server-architecture/ — "Clear words and diagrams for the two-computer model."
4. **Play** — "SQL Murder Mystery" — Knight Lab — https://mystery.knightlab.com/ — "Learn to write real database queries by solving a crime. Genuinely fun."
5. **Play** — "SQLBolt — interactive SQL" — sqlbolt.com — https://sqlbolt.com/ — "Write queries in your browser, lesson by lesson. No setup."
6. **Hack (legally)** — "Web Security Academy" — PortSwigger — https://portswigger.net/web-security — "Free, world-class labs on SQL injection, XSS & more — in a safe sandbox."
7. **Reference** — "Input Validation Cheat Sheet" — OWASP — https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html — "The professional checklist for validating data the right way."
8. **Reference** — "OWASP Top 10" — owasp.org — https://owasp.org/www-project-top-ten/ — "The ten most critical web security risks — injection and validation lead the list."

### Closing statement

🌐 "A website is a conversation between a client and a server, with a database remembering it all. The client makes it friendly — but the server makes it *true and safe*. Validate everything, trust nothing from the browser, and you've already avoided most of the web's worst bugs."

Footer tag: "MBI802 · Database & Web Systems · Master of Business Informatics"

## 3. UI & interaction design

- **Overall look**: white canvas, "Apple-like" system font stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif`), rounded soft cards (`background:#fafafa`, `border-radius:24px`, hairline border `rgba(0,0,0,0.07)`), generous section spacing (`margin-bottom:96px` between major sections).
- **Hero** (`WebArchitecturePage.tsx`): sticky translucent-blur top nav with just the brand logo linking to `/home`; large radial blurred color blobs behind the hero text (blue/purple/teal, matching the lesson's own palette); big gradient H1; animated topic pill row; a bobbing "Scroll to begin" affordance (`framer-motion`, `y: [0,7,0]` loop, 1.8s ease-in-out).
- **Scroll-reveal**: every major block wraps in a custom `Reveal` component built on `IntersectionObserver` (`useReveal`, threshold 0.12) — fades in and translates up 26px→0 on first intersection, then disconnects (one-shot, not re-triggered on scroll back).
- **Section pattern**: every part uses a shared `SectionHeader` (kicker/eyebrow in a themed color + large title + optional blurb) followed by one or more interactive `Card`s.
- **Color coding is consistent throughout and load-bearing for teaching**: Client = blue `#0071e3`, Server = purple `#7c3aed`, Database = teal `#0d9488`, Danger/attack = red `#e5484d`, Safe = green `#30a46c`, Warning = amber `#f59e0b`, generic Accent = `#2563eb`.
- **Journey animation**: `RequestJourney` uses CSS `perspective`/`rotateX(20deg)`/`translateZ` to fake a 3D "road" with nodes popping forward (`translateZ`) when active, and a traveling packet dot that slides along `left` with a `cubic-bezier` easing over 1.1s; auto-play advances every 1.7s via `setTimeout`.
- **SQL/query panels**: dark "terminal" style code blocks (`background:#0f172a`, `color:#e2e8f0`, monospace font stack `ui-monospace, SFMono-Regular, Menlo, monospace`) with syntax-token coloring (keywords `#7dd3fc`, string literals `#86efac`/red `#fca5a5` when flagged as an injection attempt, placeholders `#fcd34d`).
- **Buttons**: pill-shaped (`border-radius:999px`), a shared `navBtn(primary, color)` style helper — solid colored fill when primary/active, white with hairline border otherwise.
- **Responsive**: grids use `repeat(auto-fit, minmax(...))` throughout (e.g. `DatabaseConnect` two-column layout collapses on narrow screens; resource cards, validation-checklist cards, and quiz option grids all reflow to single column below their `minmax` breakpoint).
- **Micro-animation**: a single shared CSS keyframe `waFade` (fade + 8px translateY) is injected via an inline `<style>` tag inside the lesson root and reused for state-transition fades (e.g. re-keyed `Card` on toggle, journey step title/text).
- **No dark mode / theme handling** — the lesson is a fixed light-theme design, no `prefers-color-scheme` handling in either file.

## 4. Component & state architecture

**`WebArchitecturePage.tsx`** — stateless page shell; only local const `TOPICS` array; renders nav, animated hero (via `framer-motion` `initial/animate/transition` props, no component state), and drops in `<WebArchitectureLesson />` for the actual lesson body, then a footer.

**`WebArchitectureLesson.tsx`** — a flat collection of independent, self-contained functional components, each owning its own `useState`; no shared/lifted state, no context, no props threaded between sections, no routing, no Firestore, no external API calls, and no scoring persistence (all quiz/game state resets on remount / page reload):

- `useReveal(threshold)` / `Reveal` — generic scroll-reveal wrapper (`ref`, `visible` state via `IntersectionObserver`).
- `ClientServerScene` — `side: 'client' | 'server'` state toggled by clicking either machine box.
- `SortingGame` — `picks: Record<number, 'client'|'server'>` (per-job answer) + `checked: boolean`. Score computed inline by comparing `picks[i]` to the static `JOBS[i].a` answer key; "Check answers" only enabled once all 8 jobs have a pick.
- `RequestJourney` — `step: number` (0–6, index into static `STEPS`) + `playing: boolean`. A `useEffect` auto-advances `step` every 1700ms while `playing` and stops at the last step.
- `DatabaseConnect` — `term: string` (search box, default `'Ava'`), `stage: 'idle'|'sending'|'querying'|'done'` (default `'done'`), `results` (default pre-filtered against the static `PEOPLE` array for `'ava'`). `run()` chains two `setTimeout`s (650ms, 1400ms total) to simulate network/DB latency before recomputing `results` via a simple case-insensitive substring filter over `PEOPLE`.
- `BypassDemo` — `age: string` (default `'15'`, digit-only input filter), `tampered: boolean`. Derives `clientPass = tampered || n>=18` and `serverPass = n>=18` inline (no stored pass/fail state — purely computed from current `age`/`tampered` on every render).
- `SqlInjectionDemo` — `user: string` (default `"admin' --"`), `mode: 'naive'|'safe'`. Outcome (`{ok, head, body}`) and the displayed query JSX are both derived synchronously from `user`/`mode` via regex checks against a hardcoded pretend account `REAL = {user:'admin', pass:'hunter2'}` — no actual query execution, purely presentational logic.
- `XssDemo` — `comment: string` (default `'<img src=x onerror="stealCookies()">'`), `mode: 'naive'|'safe'`. `hasTag`/`hasScript` derived via regex on every render; nothing is ever actually executed/rendered as live HTML (the "naive" view is itself hand-simulated with conditional text, not a real `dangerouslySetInnerHTML`).
- `FinalQuiz` — `answers: (number|null)[]` (length 5, all `null` initially), `submitted: boolean`. Score computed inline by comparing each `answers[i]` to the static `QUIZ[i].answer`. Submit disabled while any answer is `null`; "Retake" resets both state values.
- `Resources` — stateless, maps over the static `RESOURCES` array.

All "databases" (`PEOPLE`), quiz banks (`QUIZ`, `JOBS`), and step scripts (`STEPS`, `NODES`, `VALIDATION_RULES`, `RESOURCES`) are hardcoded module-level constants — nothing is fetched or persisted. No badge/gating/unlock logic anywhere in this lesson.

## 5. Rebuild notes

- The lesson is fully self-contained in one file with no external content dependencies — a rebuilder needs no other data source beyond this doc and the two source files.
- `WebArchitecturePage.tsx` and `WebArchitectureLesson.tsx` both independently declare visually-similar "MBI802 · Database & Web Systems" tags (hero eyebrow vs. lesson footer) — keep both if rebuilding, they read slightly differently ("Database & Web Systems" vs. "Database & Web Systems · Master of Business Informatics").
- The "attack lab" demos (`BypassDemo`, `SqlInjectionDemo`, `XssDemo`) are entirely simulated/hardcoded — no real HTTP requests, no real SQL, no real DOM injection ever occurs; all "attacks" are pattern-matched against the typed string and the outcome text is canned. This is safe-by-design and should stay that way if rebuilt (the XSS demo explicitly disclaims "nothing is actually executed here").
- `WebArchitectureLesson`'s file-header comment explicitly documents intended visual parity with a sibling component `SystemsSecurityLesson` (an MBI800 lesson, `src/components/slides/` — out of scope for this doc but useful precedent if restyling).
- All 8 external resource links (YouTube, MDN, freeCodeCamp, SQL Murder Mystery, SQLBolt, PortSwigger, two OWASP pages) are third-party and should be revalidated for liveness/relevance before a rebuild ships — none were verified as part of this documentation pass.
- No images/SVG/video assets are referenced — everything is emoji + CSS/inline-SVG-free vector shapes (divs, gradients, box-shadows).
- No known TODOs or dead code inside either file at time of writing.
