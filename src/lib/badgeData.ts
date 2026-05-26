export type BadgeTier = 'standard' | 'distinction';
export type BadgeCategory = 'assessment' | 'activity';

export interface BadgeDefinition {
  id: string;
  name: string;
  category: BadgeCategory;
  tier: BadgeTier;
  description: string; // shown when earned
  howToEarn: string;   // shown when locked
  iconName: string;    // lucide icon name
  color: string;       // icon + accent color when earned
  subtleColor: string; // icon background when earned
}

export const ALL_BADGES: BadgeDefinition[] = [
  // ── Assessments & Exams ───────────────────────────────────────────────────
  {
    id: 'dbms-scholar',
    name: 'DBMS Fundamentals',
    category: 'assessment',
    tier: 'standard',
    description: 'Passed the MBI802 Database Management quiz',
    howToEarn: 'Score 60%+ on the MBI802 DBMS Fundamentals quiz',
    iconName: 'Database',
    color: '#2563eb',
    subtleColor: '#eff6ff',
  },
  {
    id: 'er-diagrams',
    name: 'ER Diagrams',
    category: 'assessment',
    tier: 'standard',
    description: 'Passed the ER Diagrams & Advanced ER Concepts quiz',
    howToEarn: 'Score 50%+ on the ER Diagrams quiz',
    iconName: 'GitFork',
    color: '#7c3aed',
    subtleColor: '#f5f3ff',
  },
  {
    id: 'er-distinction',
    name: 'ER Distinction',
    category: 'assessment',
    tier: 'distinction',
    description: 'Scored 90%+ on ER Diagrams on the first attempt',
    howToEarn: 'Score 90%+ on your first attempt at the ER Diagrams quiz',
    iconName: 'Star',
    color: '#4f46e5',
    subtleColor: '#eef2ff',
  },
  {
    id: 'agile-practitioner',
    name: 'Agile Practitioner',
    category: 'assessment',
    tier: 'standard',
    description: 'Passed the Agile Scrum Process quiz',
    howToEarn: 'Score 50%+ on the Agile/Scrum Knowledge Check',
    iconName: 'RotateCw',
    color: '#0891b2',
    subtleColor: '#ecfeff',
  },
  {
    id: 'agile-distinction',
    name: 'Agile Distinction',
    category: 'assessment',
    tier: 'distinction',
    description: 'Scored 90%+ on Agile/Scrum on the first attempt',
    howToEarn: 'Score 90%+ on your first attempt at the Agile/Scrum quiz',
    iconName: 'Zap',
    color: '#059669',
    subtleColor: '#ecfdf5',
  },
  {
    id: 'sql-cert',
    name: 'SQL Fundamentals',
    category: 'assessment',
    tier: 'distinction',
    description: 'Passed the SQL Fundamentals Certificate Exam',
    howToEarn: 'Score 70%+ on the SQL Fundamentals Certificate Exam',
    iconName: 'Award',
    color: '#b45309',
    subtleColor: '#fffbeb',
  },
  // ── Skills & Activities ───────────────────────────────────────────────────
  {
    id: 'sql-racer',
    name: 'SQL Racer',
    category: 'activity',
    tier: 'standard',
    description: 'Submitted a correct query in SQL Grand Prix',
    howToEarn: 'Submit one correct SQL query in SQL Grand Prix',
    iconName: 'Timer',
    color: '#ea580c',
    subtleColor: '#fff7ed',
  },
  {
    id: 'arena-warrior',
    name: 'Arena Warrior',
    category: 'activity',
    tier: 'standard',
    description: 'Reached Gold Bee tier in the Arena',
    howToEarn: 'Reach Gold Bee tier (ELO 1300+) in 1v1 Arena duels',
    iconName: 'Shield',
    color: '#9333ea',
    subtleColor: '#faf5ff',
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    category: 'activity',
    tier: 'standard',
    description: 'Kept a 5-day Daily Duel win streak',
    howToEarn: 'Maintain a Daily Duel win streak of 5 or more days',
    iconName: 'Flame',
    color: '#dc2626',
    subtleColor: '#fef2f2',
  },
  {
    id: 'dedicated',
    name: 'Dedicated Learner',
    category: 'activity',
    tier: 'standard',
    description: 'Attended 8 or more class sessions',
    howToEarn: 'Mark attendance in 8+ class sessions',
    iconName: 'BookOpen',
    color: '#16a34a',
    subtleColor: '#f0fdf4',
  },
];

export const BADGE_SECTION_LABELS: Record<BadgeCategory, string> = {
  assessment: 'Assessments & Exams',
  activity: 'Skills & Activities',
};

export const KUDOS_CATEGORIES = [
  { id: 'helpful',        label: 'Helpful',         emoji: '🤝', color: '#059669' },
  { id: 'inspiring',      label: 'Inspiring',       emoji: '✨', color: '#7c3aed' },
  { id: 'team-player',    label: 'Team Player',     emoji: '🙌', color: '#0284c7' },
  { id: 'sql-pro',        label: 'SQL Pro',         emoji: '💻', color: '#ea580c' },
  { id: 'problem-solver', label: 'Problem Solver',  emoji: '🧠', color: '#b45309' },
] as const;

export type KudosCategoryId = typeof KUDOS_CATEGORIES[number]['id'];
