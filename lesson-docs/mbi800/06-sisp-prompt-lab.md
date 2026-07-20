# SISP Prompt Engineering Lab — MBI800

- **Subject:** MBI800 — Strategic Information Systems (Planning) / "Business Information
  Systems" (the in-app subtitle for the MBI800 tab)
- **Gating:** Gated (student/staff login required) — no public standalone route exists for
  this lesson. It is reachable only via `/student/course-resources`, inside the MBI800 tab.
- **Route(s):** `/student/course-resources` (no dedicated route). Lesson `id: 'sisp-lab'`,
  rendered inline as one of the six MBI800 lesson rows.
- **Source files:**
  - `src/pages/student/CourseResources.tsx` — the lesson's metadata entry (id, title,
    subtitle, icon, accentColor) lives in the MBI800 `lessons` array of the `COURSES`
    registry, at lines 165–171. The component is imported at line 37
    (`import SISPPromptLab from '../../components/lab/SISPPromptLab';`) and mounted at line
    1794 via `{lesson.id === 'sisp-lab' && <SISPPromptLab />}`.
  - `src/components/lab/SISPPromptLab.tsx` (918 lines) — the entire lesson (all five
    challenges' content, the evaluation call, the scoring UI, and progress persistence) lives
    in this single file. There is no separate `lib/` helper — the Groq API call
    (`callEvaluationAPI`) is defined directly inside this component file.
- **Depends on:**
  - `lucide-react` icons: `Brain, Target, Users, TrendingUp, Map, ChevronDown, CheckCircle,
    Circle, Copy, Check, AlertTriangle, Key, RotateCcw, Lightbulb, Eye, EyeOff, Loader2,
    Trophy, ChevronRight, Sparkles, BarChart2, BookOpen` (note: `Target` is imported but not
    visibly used in the rendered JSX — see Rebuild notes). A local inline SVG component
    `Layers` is hand-defined in the file itself (lucide's `Layers` is not imported) to serve
    as Challenge 1's concept icon.
  - **External API:** the Groq OpenAI-compatible chat-completions endpoint,
    `https://api.groq.com/openai/v1/chat/completions`, model `llama-3.3-70b-versatile`. This
    is a client-side `fetch()` call made directly from the browser using a **student-supplied
    Groq API key** — there is no backend proxy, Cloud Function, or server-side secret involved.
  - **No Firestore reads or writes at all.** All persistence is `localStorage`, under two
    keys: `sisp_lab_v1_progress` (per-challenge completion/score/attempts) and
    `sisp_lab_v1_groq_key` (the student's own Groq API key, stored in plaintext in the
    browser).
  - Shared CSS class `btn-primary` (defined elsewhere in the app's global stylesheet, not in
    this file) for the two primary action buttons ("Save Key", "Evaluate My Prompt").

## 1. Purpose & learning objectives

The lab exists to make students *practice applying* Strategic Information Systems Planning
(SISP) frameworks by writing prompts, rather than passively reading about them. The intro
copy rendered in the component states the pedagogical intent directly:

> "Each challenge places you inside a real organisational scenario and asks you to craft a
> prompt that applies a core SISP concept — not describe it. Your prompt is evaluated across
> five dimensions by an AI model, giving you immediate, specific feedback on how to think and
> communicate as a strategic IS practitioner."

It covers five MBI800 course concepts, one per challenge, in this fixed order:

1. **The Iceberg Model** (surfacing hidden/systemic causes beneath visible symptoms)
2. **Six Process Dimensions** (a structured lens for analysing organisational processes)
3. **Participation in SISP** (stakeholder engagement design)
4. **Consistency in SISP** (strategic alignment between IS plans and business strategy)
5. **SISP Methodology & Process** (designing a planning methodology calibrated to an
   organisation's maturity/culture/constraints)

The system prompt sent to the grading model (see Section 4) states the evaluator persona
explicitly: "You are an expert evaluator for Strategic Information Systems Planning (SISP)
prompt quality at postgraduate level (MBI800 Business Information Systems). Evaluate strictly
and academically. A score above 80 requires genuine sophistication. Do not be lenient." This
is the closest thing in the file to an explicit statement of course level/rigor and is the
authoritative description of the tool's grading philosophy.

Secondary objective: the lab doubles as a light, self-contained introduction to *prompt
engineering practice itself* — the weak-prompt examples and "Guidance" tips in each challenge
are teaching students how to write precise, context-rich, framework-invoking prompts, which is
a transferable skill beyond SISP specifically.

## 2. Full content

The lab consists of an intro header, a progress summary bar, an API key configuration panel,
and five collapsible challenge accordions (only one open at a time, via `openId` state), each
holding one scenario. All text below is transcribed verbatim from the `CHALLENGES` array
(`SISPPromptLab.tsx` lines 92–188) and the fixed UI copy surrounding it.

### Intro header text (verbatim)

- Heading: "SISP Prompt Engineering Lab"
- Sub-label: "MBI800 · Business Information Systems · Strategic IS Planning"
- Body: "Each challenge places you inside a real organisational scenario and asks you to craft
  a prompt that applies a core SISP concept — not describe it. Your prompt is evaluated across
  five dimensions by an AI model, giving you immediate, specific feedback on how to think and
  communicate as a strategic IS practitioner."
- Four feature bullets: "5 scenario-based challenges" · "AI-evaluated against SISP rubrics" ·
  "Iterative — revise and resubmit freely" · "Progress saved locally in your browser"

### Challenge 1 — "Surfacing Hidden Causes" (Iceberg Model)

- **Concept tag:** Iceberg Model
- **Accent color:** `#0284c7`
- **Organisational Context (verbatim):** "TechCore Solutions, a mid-sized financial services
  firm, has experienced three consecutive IS project failures in 18 months. Each project ran
  40–60% over budget and delivered systems that staff resisted using. The CTO's post-mortem
  reports focus on 'poor vendor performance' and 'inadequate testing.' Staff surveys reveal
  frustration with lack of consultation, unclear ownership, and processes that 'don't match how
  we actually work.' Senior management insists the fix is a stricter procurement process."
- **Your Task (verbatim):** "You are advising TechCore's SISP team. Craft a prompt that uses
  the Iceberg Model to guide an AI in identifying the true systemic causes of TechCore's IS
  failures — going beyond visible symptoms to expose the organisational, cultural, and
  process-level factors driving these outcomes."
- **Rubric — "What Makes a Strong Prompt" (verbatim, 5 bullets):**
  1. Explicitly invokes the Iceberg Model or its levels (events, patterns, structures, mental
     models)
  2. Distinguishes observable symptoms from structural or cultural root causes
  3. References specific details from the TechCore scenario (failed projects, staff
     resistance, management framing)
  4. Requests actionable analysis structured by model level, not just a list
  5. Asks for output that can feed directly into SISP diagnosis or planning
- **Example of a Weak Prompt (verbatim):** "Why do IS projects fail at TechCore? List the
  causes."
- **Guidance tip (verbatim):** "Each iceberg level should surface something different. Ask the
  AI to work through levels systematically, grounding its analysis in the specific evidence
  provided — not generic project failure theory."

### Challenge 2 — "Process Analysis Across Dimensions" (Six Process Dimensions)

- **Concept tag:** Six Process Dimensions
- **Accent color:** `#7c3aed`
- **Organisational Context (verbatim):** "Pacific National Bank (PNB) is planning to replace
  its 20-year-old core banking system. The SISP team must first analyse the current mortgage
  approval process, which takes 14 days on average and involves 8 departments. Loan officers
  report duplicated data entry, inconsistent credit risk assessments, and unclear handoff
  points. Customer satisfaction for mortgage approvals is PNB's lowest-rated product. The
  replacement system must address these issues without disrupting live operations."
- **Your Task (verbatim):** "Craft a prompt that directs an AI to apply the Six Process
  Dimensions framework to produce a rigorous analysis of PNB's mortgage approval process — one
  that will form the basis of IS requirements for the new system."
- **Rubric (verbatim, 5 bullets):**
  1. Names or clearly implies all six process dimensions (inputs, outputs, guides, enablers,
     resources, flow/sequence)
  2. Anchors the analysis in PNB's specific process details (14 days, 8 departments,
     duplicated entry)
  3. Requests findings per dimension, not generic commentary on the process
  4. Asks for IS implications or system requirements derived from each dimension
  5. Output format is appropriate for use as a planning artefact (table, structured report,
     etc.)
- **Example of a Weak Prompt (verbatim):** "Analyse the bank's loan process using the six
  dimensions framework."
- **Guidance tip (verbatim):** "The Six Process Dimensions give you a structured analytical
  lens. Ask the AI to examine each dimension against specific evidence from the case, then
  derive IS requirements from the gaps it finds."

### Challenge 3 — "Designing Stakeholder Engagement" (Participation in SISP)

- **Concept tag:** Participation in SISP
- **Accent color:** `#059669`
- **Organisational Context (verbatim):** "HealthFirst NZ, a government-funded regional health
  authority, is launching a 3-year SISP initiative to unify 12 disparate clinical information
  systems across 6 hospitals and 40+ community clinics. Stakeholders include clinicians
  (doctors, nurses, allied health), IS/IT staff, administrators, patients, and two commercial
  vendors with existing contracts. Previous IS planning attempts failed due to low clinician
  buy-in. The Minister of Health has publicly committed to a 'clinician-led digital
  transformation.'"
- **Your Task (verbatim):** "Craft a prompt that uses SISP participation principles to guide
  an AI in designing a stakeholder engagement strategy for HealthFirst NZ's planning process —
  one that addresses the political realities, clinician resistance history, and diverse
  stakeholder needs."
- **Rubric (verbatim, 5 bullets):**
  1. Explicitly invokes SISP participation principles (breadth, depth, legitimacy,
     representativeness)
  2. Acknowledges HealthFirst's specific political context and history of failed engagement
  3. Asks for differentiated engagement approaches per stakeholder group
  4. Requests mechanisms for surfacing and reconciling conflicting interests
  5. Output is framed as a usable engagement plan, not abstract participation theory
- **Example of a Weak Prompt (verbatim):** "How should we involve stakeholders in the
  HealthFirst IS planning process?"
- **Guidance tip (verbatim):** "Participation in SISP is not just 'consulting people.' Think
  about power dynamics, legitimacy, the difference between informing and co-designing, and how
  engagement must vary by planning phase and stakeholder type."

### Challenge 4 — "Evaluating Strategic Alignment" (Consistency in SISP)

- **Concept tag:** Consistency in SISP
- **Accent color:** `#d97706`
- **Organisational Context (verbatim):** "RetailMax Group's board approved a 5-year strategy
  centred on hyper-personalisation, seamless omnichannel customer experience, and data-driven
  decision making. The IS Department responded with a $12M proposal to upgrade server
  infrastructure, consolidate data centres, and migrate to a private cloud. The IS Director
  argues these are 'foundational investments' that must precede any customer-facing
  initiatives. The Strategy Director argues the IS plan is 'completely disconnected' from
  board priorities. The board must decide next month."
- **Your Task (verbatim):** "Craft a prompt that applies SISP consistency principles to
  produce a rigorous alignment analysis of the IS Department's proposal against the board's
  strategic intent — including specific gaps, risks, and a recommended path forward."
- **Rubric (verbatim, 5 bullets):**
  1. Explicitly applies SISP consistency or alignment concepts (vertical, horizontal, or
     functional alignment)
  2. References both the board strategy themes and the IS proposal specifics
  3. Asks for a gap analysis, not just a summary of each plan
  4. Requests risk assessment for proceeding with misaligned investments
  5. Includes a recommendation element — what should the board decide, and on what basis?
- **Example of a Weak Prompt (verbatim):** "Is the RetailMax IS plan aligned with their
  business strategy? Explain."
- **Guidance tip (verbatim):** "Consistency in SISP means every IS decision can be traced to
  strategic intent. Ask the AI to test each major IS proposal element against the strategic
  themes — and be explicit about what alignment means in this context."

### Challenge 5 — "Designing a SISP Methodology" (SISP Methodology & Process)

- **Concept tag:** SISP Methodology & Process
- **Accent color:** `#dc2626`
- **Organisational Context (verbatim):** "Harbour University (15,000 students, 3 campuses) is
  undertaking its first formal SISP exercise after a decade of ad-hoc IS decisions. The new
  CIO has a mandate to 'get everyone on the same page about IS direction.' Key challenges: no
  shared IS governance structure, academic staff distrust of centralised IT decisions, 40+
  legacy systems with no documentation, and a culture that values autonomy over
  standardisation. The board wants a 3-year IS strategy delivered in 6 months."
- **Your Task (verbatim):** "Craft a prompt that guides an AI to design a comprehensive,
  realistic SISP methodology for Harbour University — one appropriately tailored to the
  university's maturity level, culture, constraints, and stakeholder landscape."
- **Rubric (verbatim, 5 bullets):**
  1. Specifies the SISP methodology components needed (phases, tools, deliverables,
     governance)
  2. Grounds the methodology design in Harbour University's specific constraints and culture
  3. Requests sequencing rationale — why this order, why these tools in this context
  4. Asks for risk mitigation for each major methodology risk specific to Harbour
  5. Output is structured as a deployable planning document, not generic SISP theory
- **Example of a Weak Prompt (verbatim):** "Design an IS planning process for a university."
- **Guidance tip (verbatim):** "A good SISP methodology is not generic — it is calibrated to
  organisational maturity, culture, and constraints. Force the AI to justify every methodology
  choice against Harbour University's specific situation."

### Fixed UI copy elsewhere in the lesson

- Textarea placeholder: "Craft a prompt that applies SISP concepts to this scenario. Be
  specific about the framework, the context, and the output you need…"
- Minimum-length gate message: "`{N}` more characters to unlock evaluation" (below 80 chars)
  / "Ready to evaluate" (at or above 80 chars).
- API key panel explanatory text (verbatim): "This lab uses the **Groq API** — completely
  free, no credit card required, no usage fees. Your key is stored only in this browser's
  localStorage and sent only to Groq's servers during evaluation. Get a free key at
  console.groq.com/keys (sign up with email or Google, then click *Create API key*). Your key
  will start with `gsk_`."
- Missing-key error (verbatim, shown inline on submit if no key saved): "Please save your Groq
  API key first. Get one free at console.groq.com — no credit card required."
- Rate-limit error (HTTP 429, verbatim): "Rate limit reached. Wait a moment and try again —
  Groq's free tier allows 30 requests per minute."
- Invalid-key error (HTTP 401, verbatim): "Invalid API key. Make sure you copied the full key
  from console.groq.com."
- Unparseable-response error (verbatim): "Could not parse evaluation response. Please try
  again."
- All-challenges-complete banner (verbatim): "All challenges completed!" / "You've worked
  through all five SISP concept areas. Review your best scores above and reflect on which
  dimensions you found most challenging."

## 3. UI & interaction design

- **Palette / branding:** the lab's primary accent is sky blue (`ACCENT = '#0ea5e9'`),
  matching the MBI800 course accent color in `CourseResources.tsx`. Each of the five challenges
  additionally has its own distinct accent color used for its header badge, icon chip, and open
  panel border/glow: Challenge 1 `#0284c7` (darker sky blue), Challenge 2 `#7c3aed` (violet),
  Challenge 3 `#059669` (emerald), Challenge 4 `#d97706` (amber), Challenge 5 `#dc2626` (red).
  Result-panel chrome (the "Improved Prompt" toggle, key-insight callout) uses violet/purple
  (`#7c3aed`) regardless of which challenge is open.
- **Layout, top to bottom:**
  1. Gradient intro header card (sky-blue gradient background) with a `Brain` icon, title,
     MBI800 sub-label, description paragraph, and four feature bullets.
  2. Progress summary card: a row of five pill buttons (one per challenge, labeled
     `{number}. {concept}` plus best score if attempted), each clickable to jump directly to
     that challenge's accordion, plus a large `{completedCount}/5` counter on the right. Pills
     are colour-coded: green/filled check for completed, the challenge's own accent color (25%
     tint) for attempted-but-not-completed, and neutral grey for untouched.
  3. Collapsible API key panel: amber-bordered when no key is saved ("Groq API Key · Required
     to Evaluate (100% Free)"), green-bordered once a key exists ("Groq API Key ·
     Configured"). Contains an explanatory paragraph, a password-style input (togglable
     plaintext via an eye icon) pre-filled from `localStorage`, and a Save Key button.
  4. Five challenge accordion panels in fixed order (Iceberg → Six Dimensions → Participation
     → Consistency → Methodology). Only one can be open at a time (`openId` state — opening one
     closes any other via the shared toggle handler).
  5. A completion banner (emerald gradient, `Trophy` icon) that appears only once all five
     challenges are marked `completed` in the progress map.
- **Challenge panel internals when expanded:** organisational-context callout (tinted box,
  `BookOpen` icon) → "Your Task" statement → "What Makes a Strong Prompt" rubric list (chevron
  bullets) → "Example of a Weak Prompt" callout (red-tinted, `AlertTriangle` icon, italic text)
  → "Guidance" tip callout (blue-tinted, `Lightbulb` icon) → the student's prompt textarea (or,
  once a result exists, the results panel instead).
- **Results panel** (`ResultsPanel`, shown after a successful evaluation): an animated SVG
  score ring (`ScoreCircle`, hand-built with `<circle>` `stroke-dasharray`/`stroke-dashoffset`
  arc animation) showing `{totalScore}/100`, a performance-level pill (color-coded per
  `PERF_CONFIG`), the model's overall-feedback sentence, a five-row dimension breakdown (each
  with a label, `{score}/20`, a colour-coded progress bar, the fixed dimension description, and
  the model's per-dimension feedback sentence), a "Key Learning Insight" callout, a collapsible
  "View Improved Prompt" section (with a copy-to-clipboard button showing a 2.2s "Copied!"
  confirmation state), and a "Revise and resubmit" link that discards the result and returns
  the student to the editable textarea with their previous prompt retained.
- **Animations:** `animate-fadeIn` on newly revealed content blocks (results panel, expanded
  accordion body, expanded API key panel, improved-prompt drawer), `animate-scaleIn` on the
  final completion banner, a `Loader2` spin animation during evaluation, and a CSS `transition`
  on the score-ring stroke-dashoffset (0.8s) and each dimension bar's width (0.6s) so the score
  visibly "fills in" on reveal.
- **Responsive behavior:** header and results-header switch from a horizontal `flex-row` to a
  stacked `flex-col` below the `sm` breakpoint; the progress-summary card similarly stacks the
  pill row above the completed-count block on narrow viewports; the "Evaluate My Prompt" button
  is full-width on mobile (`w-full sm:w-auto`).

## 4. Component & state architecture

### Evaluation mechanism (the part most likely to be lost without this doc)

Evaluation is **not** a client-side heuristic and **not** a Firebase Cloud Function — it is a
**direct client-side `fetch()` call from the browser to Groq's OpenAI-compatible chat
completions API**, authenticated with an API key the *student* supplies and pastes into the
lab themselves (Groq offers a free tier; the UI explicitly instructs students to get their own
key from `console.groq.com/keys`). There is no backend intermediary and no shared/app-level
API key — grading only works if the individual student has saved a valid `gsk_...` key.

Request construction (`callEvaluationAPI`, lines 242–310):

- **Endpoint:** `POST https://api.groq.com/openai/v1/chat/completions`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {studentApiKey}`
- **Body:**
  ```json
  {
    "model": "llama-3.3-70b-versatile",
    "messages": [
      { "role": "system", "content": "<SYSTEM_PROMPT>" },
      { "role": "user", "content": "<per-challenge user message, built dynamically>" }
    ],
    "temperature": 0.2,
    "max_tokens": 1400,
    "response_format": { "type": "json_object" }
  }
  ```
- **System prompt** (constant `SYSTEM_PROMPT`, verbatim, sent identically for every challenge):
  > "You are an expert evaluator for Strategic Information Systems Planning (SISP) prompt
  > quality at postgraduate level (MBI800 Business Information Systems).
  >
  > Evaluate strictly and academically. A score above 80 requires genuine sophistication. Do
  > not be lenient.
  >
  > Scoring dimensions (each 0–20):
  > - specificity: Precise, targeted requests tied to the specific scenario. Penalise vague or
  >   generic questions.
  > - conceptCoverage: Explicit, correct invocation of SISP frameworks and concepts named in
  >   the challenge.
  > - outputClarity: Clear specification of expected output format, structure, and depth.
  > - contextRichness: Specific organisational details from the scenario woven meaningfully
  >   into the request.
  > - actionability: Output would be directly usable for real SISP work, not merely
  >   academically interesting.
  >
  > Performance levels: Weak (0–40), Developing (41–60), Competent (61–75), Proficient
  > (76–88), Expert (89–100).
  >
  > Return ONLY a valid JSON object — no markdown fences, no text outside the JSON."
- **User message template** (built per-submission from the active `Challenge` object and the
  student's raw prompt text, verbatim structure):
  ```
  CHALLENGE: {challenge.title}
  SISP CONCEPT: {challenge.concept}

  ORGANISATIONAL CONTEXT:
  {challenge.context}

  STUDENT TASK:
  {challenge.task}

  RUBRIC CRITERIA:
  1. {rubric item 1}
  2. {rubric item 2}
  ... (all 5 rubric bullets, numbered)

  STUDENT PROMPT TO EVALUATE:
  """
  {studentPrompt}
  """

  Return a JSON object with exactly these fields:
  {
    "scores": { "specificity": <0-20>, "conceptCoverage": <0-20>, "outputClarity": <0-20>, "contextRichness": <0-20>, "actionability": <0-20> },
    "totalScore": <0-100>,
    "feedback": { "specificity": "<1-2 sentences>", "conceptCoverage": "<1-2 sentences>", "outputClarity": "<1-2 sentences>", "contextRichness": "<1-2 sentences>", "actionability": "<1-2 sentences>" },
    "keyInsight": "<single most important learning point for this student>",
    "improvedPrompt": "<a substantially improved version of the student prompt>",
    "performanceLevel": "<Weak|Developing|Competent|Proficient|Expert>",
    "overallFeedback": "<2-3 sentences: encouraging but honest professional assessment>"
  }
  ```
  This means the rubric text shown to the student in the UI ("What Makes a Strong Prompt") is
  the *exact same text* sent to the grading model as its scoring criteria — the rubric is not
  duplicated/paraphrased between UI and grading prompt, it is the single source of truth for
  both.
- **Response handling:** the raw response text is extracted from
  `data.choices[0].message.content`, then a regex `/\{[\s\S]*\}/` greedily extracts the first
  `{...}` block and `JSON.parse`s it directly into an `EvaluationResult`. There is **no schema
  validation** beyond this — if the model returns malformed or incomplete JSON matching the
  regex, `JSON.parse` will either throw (caught and surfaced as the generic error message) or
  succeed with missing/wrong-shaped fields that would then fail silently or render as
  `undefined` in the results UI. There is no retry/backoff logic beyond what the user does
  manually by clicking "Evaluate" again.
- **Error handling:** non-OK responses attempt to parse a Groq error body
  (`{ error: { message } }`); HTTP 429 and 401 get the specific student-facing messages quoted
  in Section 2, all other non-OK statuses surface the raw Groq error message (or `API error
  {status}` if unparseable).
- **Scoring rubric fields** are the `DimensionScores` interface: `specificity,
  conceptCoverage, outputClarity, contextRichness, actionability`, each an integer 0–20
  (5 dimensions × 20 = 100 total), matched 1:1 with `DimensionFeedback` (a one-to-two sentence
  string per dimension) and rendered with static human-readable labels/descriptions from the
  local `DIMENSION_META` constant (independent of anything the model returns — only the
  numeric scores and feedback sentences come from the API; the dimension names/descriptions
  shown are hardcoded client-side).
- **Performance-level bands** are also hardcoded client-side in `PERF_CONFIG` (Weak 0–40 red
  `#ef4444`, Developing 41–60 orange `#f97316`, Competent 61–75 yellow `#eab308`, Proficient
  76–88 blue `#3b82f6`, Expert 89–100 green `#10b981`) — the model is instructed to self-report
  a matching `performanceLevel` string in its JSON, and the client trusts that string directly
  as the key into `PERF_CONFIG` with no independent recomputation from `totalScore`.

### State machine

- **`openId: string | null`** (top-level, `SISPPromptLab`) — which single challenge's
  accordion is expanded; `null` means none expanded. Toggling a challenge's header sets/clears
  this.
- **`states: Record<string, ChallengeState>`** — one `ChallengeState` per challenge id,
  initialized via `makeDefaultState()` for all five challenges on mount. Each `ChallengeState`
  holds: `prompt` (the textarea contents), `isEvaluating` (bool, drives the spinner/disables
  the textarea), `result` (the `EvaluationResult | null` from the last successful evaluation —
  presence of a non-null result swaps the UI from the textarea to `ResultsPanel`),
  `showImproved` (bool, controls the "View Improved Prompt" collapsible), `copied` (bool,
  drives the 2.2s "Copied!" button state), and `error` (string shown inline above the
  Evaluate button on failure).
- **`progress: ProgressMap`** (`Record<string, ChallengeProgress>`) — persisted to
  `localStorage` key `sisp_lab_v1_progress` on every change via `saveProgress`. Each
  `ChallengeProgress` is `{ completed: boolean; bestScore: number; attempts: number }`.
  Updated only inside the evaluation success handler: `attempts` increments by 1 each
  evaluation call, `bestScore = max(previous bestScore, result.totalScore)`, and
  `completed = bestScore >= 61` (i.e. reaching the "Competent" band or above, on *any*
  attempt, permanently marks the challenge complete even if a later attempt scores lower —
  best score is sticky).
- **`apiKey` / `keyDraft` / `keySaved` / `showKey` / `showKeyPanel`** — the API key
  sub-state. `apiKey` is the currently-active saved key (loaded from `localStorage` key
  `sisp_lab_v1_groq_key` on mount); `keyDraft` is the input's live editable value; saving
  copies `keyDraft` (trimmed) into both `apiKey` state and `localStorage`, flashes `keySaved`
  for 2.5s, and auto-collapses the key panel. `showKeyPanel` defaults to **open** if no key is
  yet saved, and closed otherwise. `showKey` toggles the input between `password` and `text`
  type (show/hide the key characters).
- **Submission gating:** the Evaluate button is disabled unless
  `state.prompt.trim().length >= 80` (constant `minChars = 80`) and not already
  `isEvaluating`. This 80-character minimum is enforced purely client-side before any API call
  is made; it is not part of the model's own rubric.
- **Overall progress:** `completedCount = CHALLENGES.filter(c =>
  progress[c.id]?.completed).length`, displayed as the `{n}/5` counter and used as the sole
  trigger condition for the "All challenges completed!" banner (`completedCount ===
  CHALLENGES.length`).

### Firestore

None. This lesson performs zero Firestore reads or writes. All state that outlives a page
reload (challenge progress, the student's Groq API key) lives exclusively in the browser's
`localStorage`, scoped to keys `sisp_lab_v1_progress` and `sisp_lab_v1_groq_key`. Consequently
progress is per-browser/per-device only — it does not sync across devices, is not visible to
staff/lecturer dashboards, and is lost if the student clears site data or switches browsers.

### Gating logic (within CourseResources.tsx)

`lesson.id === 'sisp-lab'` is checked against the score-gate array
`['normalization', 'quiz'].includes(lesson.id)` (`CourseResources.tsx` line 1742) and is
**not** a member of it — so unlike the MBI802 Normalization slide deck or DBMS quiz, this
lesson carries no additional score-threshold unlock. Any student with `'MBI800'` in their
enrolled subjects who is logged in and viewing the MBI800 course tab can open it immediately;
staff bypass all gating unconditionally (`!isStaff &&` prefix on the gate check).

## 5. Rebuild notes

- **Client-side, student-owned API key is a real dependency to preserve or deliberately
  replace.** If rebuilt with a shared/app-managed key (e.g. moved server-side behind a Cloud
  Function), the entire API key UI panel, `localStorage` key `sisp_lab_v1_groq_key`, and the
  "Please save your Groq API key first" gating logic would need to be removed/redesigned — this
  is a substantial architectural choice specific to the current implementation, not an
  incidental detail.
- **No response schema validation.** The `JSON.parse(jsonMatch[0])` cast to `EvaluationResult`
  is unchecked — a rebuild should consider adding structural validation (e.g. verifying all
  five dimension keys are present and numeric, `totalScore` is in range, `performanceLevel` is
  one of the five valid strings) since a model deviating from the requested JSON shape
  (dropping a field, wrapping in markdown despite instructions, hallucinating an extra key)
  will currently either throw an uncaught-looking generic error or silently render `undefined`
  fields in the results UI.
- **`performanceLevel` is trusted, not recomputed.** The component indexes `PERF_CONFIG`
  directly by whatever string the model returns for `performanceLevel`; it never independently
  derives the band from `totalScore`. If the model ever returns a `totalScore` and
  `performanceLevel` that disagree (e.g. score 55 but level "Proficient"), the UI will display
  the mismatch as-is with no correction.
- **`completed` threshold (`bestScore >= 61`) is a hardcoded magic number** matching the
  bottom of the "Competent" band in `PERF_CONFIG` — keep these two in sync if either is changed
  in a rebuild (currently there is no shared constant tying them together; they'd drift
  silently if one were edited without the other).
- **`Target` icon is imported (line 3) but not used anywhere** in the rendered JSX — likely
  leftover from an earlier design pass; safe to drop in a clean rebuild.
- **The local `Layers` SVG component** (lines 191–200) duplicates functionality available from
  `lucide-react`'s own `Layers` icon, which is not imported. This looks like either an
  oversight or a deliberate stroke-width/viewBox tweak — worth a diff-check against
  `lucide-react`'s stock `Layers` icon before assuming it's pure duplication, but functionally
  it renders an equivalent icon.
- **Prompt-length gate (80 characters) is a rough client-side proxy for "worth evaluating"** —
  it does not guarantee prompt quality, only length, and a student could pad a weak prompt with
  filler to pass this gate (the actual quality judgment happens entirely inside the LLM call).
  Not a bug, but worth documenting as a known limitation of the gate.
- **Model choice (`llama-3.3-70b-versatile` via Groq) is a cost/speed choice, not a
  pedagogical one** — nothing in the file suggests this specific model was chosen for grading
  accuracy reasons beyond "free and fast." A rebuilder swapping providers/models should expect
  to re-tune the system prompt's strictness language, since grading leniency will vary by
  model.
- **Score persistence is best-score-only, not history.** `ChallengeProgress` stores only
  `bestScore` and an `attempts` counter — individual past evaluation results (scores, feedback
  text, improved prompts) are **not** retained once the student navigates away or re-evaluates;
  only the live in-memory `states[id].result` holds the most recent full result, and it resets
  to `null` on "Revise and resubmit" or on page reload. A rebuild wanting full attempt history
  would need new persistence (Firestore or an expanded localStorage schema), since none
  currently exists.
- No images/videos/external diagram assets are referenced by this lesson — all visuals are
  code-drawn (the SVG score ring, CSS-based progress bars, lucide icons).
