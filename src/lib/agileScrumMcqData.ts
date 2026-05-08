export interface AgileScrumQuestion {
  id: string;
  category: string;
  question: string;
  choices: string[];
  correct: number; // 0-indexed
}

export const AGILE_SCRUM_COLLECTION      = 'agileScrumMcqResults';
export const AGILE_SCRUM_QUIZ_TITLE      = 'Agile Scrum Process – Knowledge Check';
export const AGILE_SCRUM_PASS_PERCENTAGE = 50;
export const AGILE_SCRUM_BADGE_PERCENTAGE = 90; // first-attempt badge threshold
export const AGILE_SCRUM_MAX_ATTEMPTS    = 3;

export const AGILE_SCRUM_CATEGORIES = [
  'Agile Foundations',
  'Scrum Framework & Pillars',
  'Scrum Roles',
  'Scrum Artifacts',
  'Scrum Events & Ceremonies',
];

export const AGILE_SCRUM_QUESTIONS: AgileScrumQuestion[] = [
  // ── Agile Foundations ─────────────────────────────────────────────────────
  {
    id: 'as01',
    category: 'Agile Foundations',
    question: 'In what year was the Agile Manifesto written?',
    choices: ['1995', '1999', '2001', '2005'],
    correct: 2,
  },
  {
    id: 'as02',
    category: 'Agile Foundations',
    question: 'Which of the following is one of the four core values stated in the Agile Manifesto?',
    choices: [
      'Comprehensive documentation over working software',
      'Individuals and interactions over processes and tools',
      'Contract negotiation over customer collaboration',
      'Following a plan over responding to change',
    ],
    correct: 1,
  },
  {
    id: 'as03',
    category: 'Agile Foundations',
    question: 'According to the Agile Manifesto, what is valued MORE than comprehensive documentation?',
    choices: [
      'Working software',
      'Customer collaboration',
      'Responding to change',
      'Individuals and interactions',
    ],
    correct: 0,
  },
  {
    id: 'as04',
    category: 'Agile Foundations',
    question: 'Which approach typically delivers all project output in a single release at the very end of the project?',
    choices: ['Agile', 'Scrum', 'Waterfall', 'Kanban'],
    correct: 2,
  },
  {
    id: 'as05',
    category: 'Agile Foundations',
    question: 'Compared to Waterfall, when does testing occur in an Agile project?',
    choices: [
      'Only after all development is complete',
      'Only at the start of the project',
      'Continuously throughout every iteration or sprint',
      'Only during the final user-acceptance phase',
    ],
    correct: 2,
  },
  {
    id: 'as06',
    category: 'Agile Foundations',
    question: 'What does "iterative development" mean in the context of Agile?',
    choices: [
      'Writing code and then rewriting it from scratch every few months',
      'Delivering work in small cycles with feedback gathered at each stage',
      'Repeating the same fixed plan until the product is complete',
      'Assigning different developers to the same task in rotation',
    ],
    correct: 1,
  },

  // ── Scrum Framework & Pillars ─────────────────────────────────────────────
  {
    id: 'as07',
    category: 'Scrum Framework & Pillars',
    question: 'What are the three empirical pillars of Scrum?',
    choices: [
      'Planning, Execution, Delivery',
      'Transparency, Inspection, Adaptation',
      'Roles, Artifacts, Events',
      'Backlog, Sprint, Increment',
    ],
    correct: 1,
  },
  {
    id: 'as08',
    category: 'Scrum Framework & Pillars',
    question: 'What is the recommended duration of a Scrum Sprint?',
    choices: [
      '1 day to 1 week',
      '1 to 4 weeks',
      '1 to 3 months',
      '3 to 6 months',
    ],
    correct: 1,
  },
  {
    id: 'as09',
    category: 'Scrum Framework & Pillars',
    question: 'Which Scrum pillar ensures that all significant aspects of the process are visible to everyone responsible for the outcome?',
    choices: ['Adaptation', 'Inspection', 'Transparency', 'Collaboration'],
    correct: 2,
  },
  {
    id: 'as10',
    category: 'Scrum Framework & Pillars',
    question: 'The Scrum Guide defines Scrum as which of the following?',
    choices: [
      'A full software development methodology with prescriptive coding standards',
      'A lightweight framework for developing, delivering, and sustaining complex products',
      'A project management tool specifically designed for IT infrastructure projects',
      'A waterfall-based approach that incorporates periodic reviews',
    ],
    correct: 1,
  },
  {
    id: 'as11',
    category: 'Scrum Framework & Pillars',
    question: 'What is the recommended number of Developers (excluding Scrum Master and Product Owner) in a Scrum Team?',
    choices: ['1–2', '3–9', '10–15', 'Any number'],
    correct: 1,
  },
  {
    id: 'as12',
    category: 'Scrum Framework & Pillars',
    question: 'What does the "Adaptation" pillar of Scrum require?',
    choices: [
      'That the team adapts to each developer\'s personal work style',
      'That requirements are adapted at the end of each project phase',
      'That the process is adjusted as soon as possible when inspection reveals deviation beyond acceptable limits',
      'That the Scrum Master adapts the framework to suit the organisation\'s existing processes',
    ],
    correct: 2,
  },

  // ── Scrum Roles ───────────────────────────────────────────────────────────
  {
    id: 'as13',
    category: 'Scrum Roles',
    question: 'How many distinct roles exist within a Scrum Team?',
    choices: ['2', '3', '4', '5'],
    correct: 1,
  },
  {
    id: 'as14',
    category: 'Scrum Roles',
    question: 'Who is accountable for maximising the value of the product resulting from the Scrum Team\'s work?',
    choices: ['Scrum Master', 'Development Team Lead', 'Product Owner', 'Project Manager'],
    correct: 2,
  },
  {
    id: 'as15',
    category: 'Scrum Roles',
    question: 'Which statement best describes the primary responsibility of the Scrum Master?',
    choices: [
      'Writing code and building the product features',
      'Managing and updating the Product Backlog daily',
      'Acting as a servant-leader who ensures Scrum is understood and enacted',
      'Representing customer stakeholders and approving deliverables',
    ],
    correct: 2,
  },
  {
    id: 'as16',
    category: 'Scrum Roles',
    question: 'According to Scrum, how many Product Owners should a single Scrum Team have?',
    choices: [
      'One per developer on the team',
      'One',
      'One per major stakeholder group',
      'Two — one for business and one for technical concerns',
    ],
    correct: 1,
  },
  {
    id: 'as17',
    category: 'Scrum Roles',
    question: 'Who is responsible for creating the product Increment during each Sprint?',
    choices: ['Product Owner', 'Scrum Master', 'Developers', 'External QA team'],
    correct: 2,
  },
  {
    id: 'as18',
    category: 'Scrum Roles',
    question: 'In Scrum, what does it mean for Developers to be a "cross-functional" team?',
    choices: [
      'Each developer works across multiple Scrum Teams simultaneously',
      'The team collectively has all the skills needed to create a valuable product Increment',
      'Each developer is required to know multiple programming languages',
      'Developers report to multiple managers from different business units',
    ],
    correct: 1,
  },

  // ── Scrum Artifacts ───────────────────────────────────────────────────────
  {
    id: 'as19',
    category: 'Scrum Artifacts',
    question: 'What are the three Scrum artifacts?',
    choices: [
      'Sprint, Review, Retrospective',
      'Product Backlog, Sprint Backlog, Increment',
      'Product Owner, Scrum Master, Developers',
      'User Stories, Tasks, Epics',
    ],
    correct: 1,
  },
  {
    id: 'as20',
    category: 'Scrum Artifacts',
    question: 'Who is responsible for managing and prioritising the Product Backlog?',
    choices: ['Scrum Master', 'Developers collectively', 'Product Owner', 'Stakeholders by majority vote'],
    correct: 2,
  },
  {
    id: 'as21',
    category: 'Scrum Artifacts',
    question: 'What is the "Definition of Done" (DoD) in Scrum?',
    choices: [
      'A list of features planned for development in the next sprint',
      'A formal quality standard that must be met for an Increment to be considered complete',
      'The Product Owner\'s written acceptance signature on a user story',
      'A contract document describing the full project scope',
    ],
    correct: 1,
  },
  {
    id: 'as22',
    category: 'Scrum Artifacts',
    question: 'What is the Sprint Goal in relation to the Sprint Backlog?',
    choices: [
      'A detailed list of every task that must be completed in the sprint',
      'The single objective for the Sprint — the commitment embedded in the Sprint Backlog',
      'The team\'s velocity target expressed in story points',
      'The Product Owner\'s overall product vision statement',
    ],
    correct: 1,
  },
  {
    id: 'as23',
    category: 'Scrum Artifacts',
    question: 'In Scrum, what is the purpose of story point estimation?',
    choices: [
      'To measure the exact number of hours each task will take',
      'To assign monetary value to each backlog item',
      'To express relative effort and complexity of backlog items, enabling capacity planning',
      'To track individual developer productivity',
    ],
    correct: 2,
  },
  {
    id: 'as24',
    category: 'Scrum Artifacts',
    question: 'What is the Increment in Scrum?',
    choices: [
      'The increase in team velocity measured between two consecutive sprints',
      'The sum of all completed Product Backlog items that meet the Definition of Done',
      'The total number of story points added to the backlog during a sprint',
      'The difference between the planned and actual work completed in a sprint',
    ],
    correct: 1,
  },

  // ── Scrum Events & Ceremonies ─────────────────────────────────────────────
  {
    id: 'as25',
    category: 'Scrum Events & Ceremonies',
    question: 'How many formal Scrum events are defined in the Scrum framework?',
    choices: ['3', '4', '5', '6'],
    correct: 2,
  },
  {
    id: 'as26',
    category: 'Scrum Events & Ceremonies',
    question: 'What is the maximum timebox for Sprint Planning in a 4-week Sprint?',
    choices: ['2 hours', '4 hours', '8 hours', '1 full working day (8+ hours)'],
    correct: 2,
  },
  {
    id: 'as27',
    category: 'Scrum Events & Ceremonies',
    question: 'Which three topics are addressed during Sprint Planning?',
    choices: [
      'Who works on what, when tasks are due, and who is responsible for testing',
      'Why is this Sprint valuable, what can be done, and how will the work get done',
      'Scope, budget, and timeline for the Sprint',
      'Product Backlog refinement, testing plan, and release schedule',
    ],
    correct: 1,
  },
  {
    id: 'as28',
    category: 'Scrum Events & Ceremonies',
    question: 'What is the timebox for the Daily Scrum (standup)?',
    choices: ['5 minutes', '15 minutes', '30 minutes', '1 hour'],
    correct: 1,
  },
  {
    id: 'as29',
    category: 'Scrum Events & Ceremonies',
    question: 'What is the primary purpose of the Sprint Review?',
    choices: [
      'To review the team\'s working processes and identify improvements for the next sprint',
      'To plan which items will be selected for the next sprint',
      'To present the Increment to stakeholders, gather feedback, and adapt the Product Backlog',
      'To assess individual team member performance against KPIs',
    ],
    correct: 2,
  },
  {
    id: 'as30',
    category: 'Scrum Events & Ceremonies',
    question: 'What is the key difference between the Sprint Review and the Sprint Retrospective?',
    choices: [
      'The Sprint Review is for the team only; the Retrospective includes external stakeholders',
      'The Sprint Review inspects the product Increment with stakeholders; the Retrospective inspects the team\'s own processes and ways of working',
      'The Sprint Review is mandatory in Scrum; the Retrospective is optional',
      'The Sprint Review happens at the start of the sprint; the Retrospective happens at the midpoint',
    ],
    correct: 1,
  },
];
