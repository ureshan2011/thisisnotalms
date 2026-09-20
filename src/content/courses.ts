// ─── The course registry ──────────────────────────────────────────────────
// One entry per course I teach, and under it every lesson that has a page on
// this site. The four course home pages (/mbi800, /mbi802, /mbi804,
// /mbi806b) are generated entirely from this file, so publishing a new lesson
// is one object in the right `lessons` array — no page edit, no new route on
// the home side, no chance of the four pages drifting apart.
//
// Where a lesson belongs is decided by `lesson-docs/`, which is the platform's
// own audit of every lesson and states the subject explicitly. The Security
// Lab is the one that surprises people: it reads like a strategy lesson but
// lesson-docs/mbi802/14-security-lab.md assigns it to MBI802, because what it
// actually teaches is input validation against a database.
//
// Course facts — credits, level, prerequisites, learning outcomes, assessment
// weightings — are the official course descriptors, already transcribed on the
// four public intro pages. Nothing here is estimated or invented: if a course
// does not publish a figure, this file does not carry one.

import type { BlendAccent } from '../components/blend';

/** What a reader has to do to open a lesson, as of right now. */
export type LessonAccess =
  /** Opens for anybody with the link. No code, no login. */
  | 'open'
  /** Behind the shared class access code (see LessonPasswordGate). */
  | 'code';

/** The shape of a lesson, so a reader can tell a read from an hour's work. */
export type LessonKind = 'Lesson' | 'Lab' | 'Practice' | 'Video' | 'Reference' | 'Pack';

export interface CourseLesson {
  /** Stable id. Used for the progress key, so never renumber or reuse one. */
  id: string;
  title: string;
  /** One sentence on what the reader actually does. No marketing. */
  blurb: string;
  /** An in-app route. Exactly one of `to` / `href` is set. */
  to?: string;
  /** A static file under public/, resolved against BASE_URL. */
  href?: string;
  access: LessonAccess;
  kind: LessonKind;
}

export interface LearningOutcome {
  n: string;
  /** My plain-English handle for it — not from the descriptor. */
  short: string;
  /** Verbatim from the course descriptor. */
  body: string;
}

export interface Course {
  code: string;
  /** The official course title. It is also the page's headline. */
  name: string;
  /** The headline split where I want the line to break, not where it wraps. */
  headline: [string, string];
  accent: BlendAccent;
  /** One sentence under the headline: what the course is for. */
  lede: string;
  /** Credits, level and prerequisites, as the descriptor states them. */
  meta: string;
  /** Sits beside the progress board — why the course exists, in one line. */
  keyline: string;
  outcomes: LearningOutcome[];
  /** Weighting, title, what it assesses. Empty where not published. */
  assessments: [string, string, string][];
  /** Indicative content from the descriptor. */
  content: string[];
  lessons: CourseLesson[];
}

/** Every course code with a home page, in teaching order. */
export const COURSE_CODES = ['MBI800', 'MBI802', 'MBI804', 'MBI806B'] as const;
export type CourseHomeCode = (typeof COURSE_CODES)[number];

// ─── MBI800 ───────────────────────────────────────────────────────────────

const MBI800: Course = {
  code: 'MBI800',
  name: 'Strategic Information Systems Planning',
  headline: ['Strategic information', 'systems planning'],
  accent: 'planning',
  lede:
    'What an organisation decides to build, and why it keeps getting the decision wrong. Every lesson on this page is a page you can open now — start with the first one, or take whichever answers the thing you came for.',
  meta: 'Yasas Sri Wickramasinghe · 15 credits, Level 8, no prerequisites',
  keyline:
    'The course runs from a single system to a whole industry: systems thinking first, then five platforms that rewired their markets, then what it costs when security is an afterthought.',
  outcomes: [
    { n: 'LO1', short: 'Read the system you have', body: 'Assess current information systems to identify strategic opportunities and associated risks for improvement in a business context.' },
    { n: 'LO2', short: 'Weigh culture and privacy', body: 'Evaluate the impact of cultural protocols and data privacy on the successful implementation of information systems in diverse cultural settings.' },
    { n: 'LO3', short: 'Write the plan', body: 'Develop strategic plans to align information systems with organisational goals in a business context.' },
  ],
  assessments: [
    ['60%', 'Strategic Information Systems Planning report', 'Individual · assesses LO1 and LO3'],
    ['40%', 'Case study analysis: cultural and ethical analysis in information systems implementation', 'Individual · assesses LO2'],
  ],
  content: [
    'Understanding information systems and their role in organisations',
    'How information systems shape and influence organisational strategy',
    'Strategic Information Systems Planning (SISP)',
    'Methods and tools for conducting SISP',
    'Challenges and risks in SISP',
    'Risk management in IS planning: technological failure, data breaches, resource constraints',
    'Case studies of successful SISP implementations',
    'Designing culturally appropriate information services',
    'IT trends and emerging technologies',
  ],
  lessons: [
    {
      id: 'sisp-intro',
      title: 'Introduction and systems thinking',
      blurb:
        'The whole of Lesson 1: what strategic planning actually decides, systems against collections, a sales loop you can run for twelve months to watch the obvious fix rebound, and the Iceberg Model taken down through a real outage. Ends with a knowledge check.',
      to: '/intro-to-sisp',
      access: 'open',
      kind: 'Lesson',
    },
    {
      id: 'five-stories',
      title: 'Five stories that changed everything',
      blurb:
        'Airbnb, Netflix, Xero, Canva and Alibaba — how each started from one frustration and built a platform that rewired its industry. IS architecture, growth figures and discussion questions for each.',
      to: '/five-stories',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'platform-strategy',
      title: 'Platform strategy',
      blurb:
        'Why Uber owns no cars and the App Store writes no apps. Network effects, the chicken-and-egg problem, governance and boundary resources, Amazon against GE Predix — then a group research task and a knowledge check.',
      to: '/platform-strategy',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'systems-security',
      title: 'Systems security',
      blurb:
        'What can go wrong, what it would cost, and how to defend and recover. Calculate real risk exposure, profile the attackers, tell malware apart, run a backup simulator and choose a disaster-recovery plan.',
      to: '/systems-security',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'xr-explorer',
      title: 'Immersive realities',
      blurb:
        'A walk through AR, VR and mixed reality, with two demos that run in the browser. No headset needed, and no prior graphics knowledge assumed.',
      to: '/xr-explorer',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'bonus-lecture',
      title: 'Capstone: shipping your own site',
      blurb:
        'The final lecture. Design a layout in Google Stitch, turn it into real code with Claude Code, and put it live on GitHub Pages. Includes a prompt generator for your own portfolio.',
      to: '/bonus-lecture',
      access: 'code',
      kind: 'Lab',
    },
    {
      id: 'study-packs',
      title: 'The written study pack',
      blurb:
        'The whole course rewritten as a properly typeset book: eleven chapters, worked examples, practice questions and answer keys. Yours to download and keep.',
      to: '/study-packs',
      access: 'code',
      kind: 'Pack',
    },
  ],
};

// ─── MBI802 ───────────────────────────────────────────────────────────────

const MBI802: Course = {
  code: 'MBI802',
  name: 'Database Management Systems',
  headline: ['Database management', 'systems'],
  accent: 'default',
  lede:
    'From a spreadsheet that contradicts itself to a normalised database you can query. Sixteen lessons, in the order the course teaches them — the first one opens for anybody, with nothing to install.',
  meta: 'Yasas Sri Wickramasinghe · 15 credits, Level 8, no prerequisites',
  keyline:
    'Each lesson assumes the one before it. SQL before diagrams, diagrams before mapping, mapping before normalisation — that order is the course, not a filing system.',
  outcomes: [],
  assessments: [],
  content: [
    'Data against information, and why file-based systems fail',
    'The relational model and setting up MySQL',
    'SQL fundamentals: data types, CREATE, INSERT and your first SELECT',
    'Advanced queries: filtering, sorting, safe UPDATE and DELETE, aggregates and joins',
    "ER diagram foundations in Chen's notation: entities, attributes, keys and cardinality",
    'Advanced ER: weak entities, composite and multivalued attributes, total against partial participation',
    'The eight rules that turn any ER diagram into a complete set of tables',
    'Functional dependencies, 1NF through BCNF, and decomposing a table properly',
    'Consolidation: the full pipeline from raw data to a queryable database',
  ],
  lessons: [
    {
      id: 'dbms-intro',
      title: 'Introduction to DBMS',
      blurb:
        "Break a hospital's spreadsheet and watch it contradict itself, turn a bare number into information, then read the full eight-lesson outline with a preview of the material. Nothing to install.",
      to: '/intro-to-dbms',
      access: 'open',
      kind: 'Lesson',
    },
    {
      id: 'mysql-setup',
      title: 'Setting up MySQL',
      blurb:
        'Two short guide videos — one for MacOS, one for Windows — so your MySQL client and Workbench are installed and ready before the first hands-on class.',
      to: '/mysql-setup',
      access: 'open',
      kind: 'Video',
    },
    {
      id: 'sql-programming',
      title: 'Introduction to SQL with MySQL',
      blurb:
        'The language databases actually speak. Create a database, build a table, insert real rows, then ask it questions — one interactive slide at a time.',
      to: '/sql-programming',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'database-concepts',
      title: 'Advanced database concepts',
      blurb:
        'One table, built up step by step: add a column, change a data type, set a primary key and auto-number it, back it up and restore it, then ORDER BY and count it. Finishes with a safe look at SQL injection.',
      to: '/database-concepts',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'web-architecture',
      title: 'Client, server and databases',
      blurb:
        'How a website actually works, for absolute beginners. Sort jobs between the two computers, then follow one search all the way to the database and back — watching the server run the SQL as it goes. Ends in a safe attack lab.',
      to: '/web-architecture',
      access: 'open',
      kind: 'Lesson',
    },
    {
      id: 'er-diagrams',
      title: 'ER diagrams',
      blurb:
        "Sketch the world before you build the tables. Entities, attributes and relationships in Chen's notation, and how to read cardinality at a glance.",
      to: '/er-diagrams',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'er-activities',
      title: 'ER diagrams in practice',
      blurb:
        'Model five real systems — a library, a university, a hospital, an online store and a hotel — then check your diagram against a worked answer.',
      to: '/er-activities',
      access: 'code',
      kind: 'Practice',
    },
    {
      id: 'er-advanced',
      title: 'Advanced ER concepts',
      blurb:
        'Real data is messier than the textbook. Weak entities, identifying relationships, and multivalued or derived attributes, with two exercises to test yourself.',
      to: '/er-advanced',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'er-attributes',
      title: 'Attributes and participation',
      blurb:
        'The details that decide whether a model is right or wrong. Break attributes into their parts, then read total against partial participation through guided activities.',
      to: '/er-attributes',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'er-mapping',
      title: 'ER to relational mapping',
      blurb:
        'Turn entity-relationship diagrams into real relational tables — entities, relationships, keys, and every tricky case in between.',
      to: '/er-mapping',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'normalisation',
      title: 'Database normalisation',
      blurb:
        'From messy tables to clean ones. Spot the anomalies, then split a table step by step from 1NF all the way to 3NF.',
      to: '/normalisation',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'normalisation-activities',
      title: 'Normalisation activities',
      blurb:
        'Seven short tables to practise on, mixed up and with no hints. Work out what normal form each is in and normalise it. The answers sit behind a password so you try it first.',
      to: '/normalisation-activities',
      access: 'code',
      kind: 'Practice',
    },
    {
      id: 'normalisation-videos',
      title: 'Normalisation on video',
      blurb:
        'Prefer to watch? A short walkthrough series — why we normalise, functional dependencies, and First Normal Form — each as a clip you can play any time.',
      to: '/normalisation-videos',
      access: 'code',
      kind: 'Video',
    },
    {
      id: 'sql-reels',
      title: 'UPDATE and DELETE',
      blurb:
        'Change and remove rows with confidence. Short scrollable reels that show how to edit data without breaking everything around it.',
      to: '/sql-reels',
      access: 'code',
      kind: 'Video',
    },
    {
      id: 'security-lab',
      title: 'SwiftShop security lab',
      blurb:
        'A deliberately insecure shop with twenty hidden vulnerabilities, from editable price tags and secrets in the page source to XSS, privilege escalation and business-logic flaws. Find them, exploit them, then explain the fix.',
      href: 'security-lab.html',
      access: 'open',
      kind: 'Lab',
    },
    {
      id: 'sql-certifications',
      title: 'Free SQL certifications',
      blurb:
        'Nine genuinely free credentials — Oracle badges, IBM digital badges, HackerRank exams, Cisco certs and more. No credit card for any of them.',
      to: '/sql-certifications',
      access: 'code',
      kind: 'Reference',
    },
    {
      id: 'study-packs',
      title: 'The written study pack',
      blurb:
        'The whole course rewritten as a properly typeset book: eight chapters, worked examples, practice questions and answer keys. Yours to download and keep.',
      to: '/study-packs',
      access: 'code',
      kind: 'Pack',
    },
  ],
};

// ─── MBI804 ───────────────────────────────────────────────────────────────

const MBI804: Course = {
  code: 'MBI804',
  name: 'IT Project Management',
  headline: ['IT project', 'management'],
  accent: 'project',
  lede:
    'What is really fixed on a project, what a delay actually costs, and which method the work in front of you is asking for. Six of the seven lessons here open for anybody, with no code.',
  meta: 'Yasas Sri Wickramasinghe · 15 credits, Level 8 · prerequisites MBI800 and MBI801',
  keyline:
    'The course keeps returning to one question: which of the three constraints are you willing to move? Every estimate, every risk and every conflict on this page is another way of asking it.',
  outcomes: [
    { n: 'LO1', short: 'Choose the method', body: 'Critically analyse the attributes of an IT project to recommend the most suitable project management methodologies in an organisation.' },
    { n: 'LO2', short: 'Name the risks', body: 'Assess potential risks associated with IT projects to propose mitigation strategies for an organisation.' },
    { n: 'LO3', short: 'Run it in your field', body: 'Apply IT project management approaches and practices within specialised domains in a professional context.' },
  ],
  assessments: [
    ['60%', 'Project methodology selection: case study', 'Individual · assesses LO1 and LO3'],
    ['40%', 'Risk management plan: report', 'Individual · assesses LO2 and LO3'],
  ],
  content: [
    'Overview of project management principles and practices',
    'Project initiation and planning',
    'Scope management in IT projects',
    'Risk management in IT projects',
    'Quality management in informatics projects',
    'Project monitoring, control and closure',
    'Agile, Waterfall and PRINCE2 project management',
    'Case studies and best practices in IT project management',
    'Ethical and legal considerations in IT project management',
  ],
  lessons: [
    {
      id: 'pm-intro',
      title: 'What a project is, and what decides how to run it',
      blurb:
        'The whole of Lesson 1: pin two corners of the constraint triangle and watch the third move, slide a delay along a real schedule to find which tasks the launch date cares about, choose between Agile, Waterfall and PRINCE2 across four project shapes, then price a risk on the grid.',
      to: '/intro-to-project-management',
      access: 'open',
      kind: 'Lesson',
    },
    {
      id: 'pm-methodologies',
      title: 'Waterfall, Spiral, PRINCE2 and Agile — and Scrum up close',
      blurb:
        'Lesson 2, and the one the 60% case study leans on. Four lifecycles drawn rather than described, a change dragged along the cost-of-change curve, Boehm’s spiral walked loop by loop, PRINCE2’s seven principles, themes and processes opened one at a time, then the whole Agile family — and Scrum in full: a clickable framework diagram, twelve “whose job is this?” situations, timeboxes that scale with the Sprint, and a board with a live burndown.',
      to: '/project-methodologies',
      access: 'open',
      kind: 'Lesson',
    },
    {
      id: 'pm-peer-audit',
      title: 'The outside auditor: peer audit round',
      blurb:
        'The class swaps post-mortems — you audit a project you did not run, and nobody gets their own back. Practise the four audit questions on a fictional scenario whose author is confident and wrong about all of them, sort eight sentences into restating, asserting and auditing, choose a risk response where mitigating is the wrong answer, then build the one-page Corrective Action Plan and export it.',
      to: '/peer-audit',
      access: 'open',
      kind: 'Practice',
    },
    {
      id: 'cost-management',
      title: 'Project cost management',
      blurb:
        'Plan, estimate, budget — and avoid the traps that sink most IT projects. Seven interactive sections around the SecurePay NZ scenario: PERT calculator, budget builder, live S-curve and a closing challenge.',
      to: '/cost-management',
      access: 'code',
      kind: 'Lesson',
    },
    {
      id: 'collaboration-reflex',
      title: 'The collaboration reflex',
      blurb:
        'Conflict and communication management taught through forty-five real, anonymised classroom conflicts: six full stories, four frameworks, and the one reflex experienced professionals reach for even when it is the wrong answer.',
      href: 'collaboration-reflex-lecture.html',
      access: 'open',
      kind: 'Lesson',
    },
    {
      id: 'conflict-swap',
      title: 'Conflict swap',
      blurb:
        "Write a real conflict you have lived through, anonymously. The class shuffles everyone's stories so you analyse someone else's — root cause, the mode that was used, and the mode that should have been. A class code from me, no login.",
      href: 'conflict-swap.html',
      access: 'open',
      kind: 'Practice',
    },
    {
      id: 'jira-certifications',
      title: 'Free Jira and Agile certifications',
      blurb:
        "Three hand-picked credentials: Atlassian's own Jira learning path, a LinkedIn Agile Professional Certificate, and a quick free completion cert.",
      to: '/jira-certifications',
      access: 'open',
      kind: 'Reference',
    },
  ],
};

// ─── MBI806B ──────────────────────────────────────────────────────────────

const MBI806B: Course = {
  code: 'MBI806B',
  name: 'Business Data Analytics with AI and ML',
  headline: ['Business data analytics', 'with AI and ML'],
  accent: 'analytics',
  lede:
    'What AI and ML actually mean, where you already rely on them without noticing, and how a real decision gets made step by step. Written for people who have never opened a data tool — both lessons open with no code.',
  meta: 'Yasas Sri Wickramasinghe · 15 credits, Level 8 · prerequisite MBI801, co-requisite MBI805B',
  keyline:
    'Getting a number out is the easy half. Being able to defend the number, and say what it cannot tell you, is the job this course is actually about.',
  outcomes: [
    { n: 'LO1', short: 'Decide with AI and ML', body: 'Evaluate advanced business data analytics techniques, including AI and ML algorithms, to make informed decisions within a business organization.' },
    { n: 'LO2', short: 'Use industry tools', body: 'Apply industry-standard business analytics tools to improve the efficiency and effectiveness of decision-making processes in a business context.' },
    { n: 'LO3', short: 'Visualise for an audience', body: 'Assess and apply different data visualization techniques to convey specific types of business information for an organization.' },
    { n: 'LO4', short: 'Judge it ethically', body: 'Critically evaluate business analytics practices from an ethical and data privacy perspective within a business context.' },
  ],
  assessments: [],
  content: [
    'Business decision-making with AI and ML',
    'Data visualisation for business communication',
    'Advanced data analysis with AI and ML',
    'Risk management in AI/ML applications',
    'Addressing data privacy and security risks in business analytics',
    'Decision-making frameworks',
    'Advanced visualisation techniques',
    'Integrating findings and visualisations into decisions',
    'Industry-standard business analytics tools',
    'Advanced data analysis and predictive modelling',
    'Ethical considerations in business analytics',
    'Future trends in business data analytics',
  ],
  lessons: [
    {
      id: 'analytics-intro',
      title: 'Welcome to business data analytics',
      blurb:
        'For absolute beginners: what AI and ML actually mean, where you already use them without noticing, how real decisions get made step by step, and a first look at Power BI.',
      to: '/intro-to-business-analytics',
      access: 'open',
      kind: 'Lesson',
    },
    {
      id: 'python-setup',
      title: 'Setting up Python',
      blurb:
        'No installing, no downloads. Open Google Colab in your browser — identical on Mac and Windows — and write your first line of Python in two minutes.',
      to: '/python-setup',
      access: 'open',
      kind: 'Lab',
    },
    {
      id: 'ml-three-models',
      title: 'Three ways to predict things',
      blurb:
        'Linear regression, decision trees and random forests, explained with no maths. Move a line until it fits, grow a tree until it cheats, watch nine trees outvote the best one — then run real Python in the page.',
      to: '/predicting-with-data',
      access: 'open',
      kind: 'Lesson',
    },
    {
      id: 'power-bi-setup',
      title: 'Setting up Power BI',
      blurb:
        'From nothing to your first chart. Everybody starts in the browser, which works the same on a Mac as on a PC — nobody should spend the first class watching a download bar.',
      to: '/power-bi-setup',
      access: 'open',
      kind: 'Lab',
    },
  ],
};

// ─── Shared across every course ───────────────────────────────────────────
// Not owned by any one course, so they sit in their own short section at the
// bottom of all four pages rather than padding out a course's own count.

export const GENERAL_RESOURCES: CourseLesson[] = [
  {
    id: 'apa-referencing',
    title: 'APA 7 citations: the crash course',
    blurb:
      'Everything needed to cite correctly, from the first in-text citation to the last reference entry. Fourteen interactive slides and a practice quiz.',
    to: '/apa-referencing',
    access: 'code',
    kind: 'Reference',
  },
  {
    id: 'pre-class',
    title: 'The pre-class idea swarm',
    blurb:
      'A full-screen countdown for the minutes before class. Key concepts drift like a galaxy, then swarm together to reveal the course code right as we begin.',
    to: '/pre-class',
    access: 'code',
    kind: 'Reference',
  },
];

export const COURSES: Record<CourseHomeCode, Course> = {
  MBI800,
  MBI802,
  MBI804,
  MBI806B,
};

/** Where a course's home page lives. Also the id used for progress storage. */
export function courseHomePath(code: CourseHomeCode): string {
  return `/${code.toLowerCase()}`;
}
