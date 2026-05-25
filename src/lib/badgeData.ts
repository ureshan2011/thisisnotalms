export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  howToEarn: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: 'sql-cert',
    name: 'SQL Fundamentals',
    description: 'Passed the SQL Fundamentals Certificate Exam',
    howToEarn: 'Score 70%+ on the SQL Certificate Exam',
    emoji: '🏆',
    color: '#b45309',
    bgColor: 'rgba(251,191,36,0.15)',
    borderColor: 'rgba(251,191,36,0.4)',
  },
  {
    id: 'er-expert',
    name: 'ER Diagram Expert',
    description: 'Distinction on the ER Diagrams quiz',
    howToEarn: 'Score 90%+ on the ER Diagrams quiz on your first attempt',
    emoji: '⭐',
    color: '#4f46e5',
    bgColor: 'rgba(99,102,241,0.12)',
    borderColor: 'rgba(99,102,241,0.3)',
  },
  {
    id: 'agile-champion',
    name: 'Agile Champion',
    description: 'Distinction on the Agile/Scrum quiz',
    howToEarn: 'Score 90%+ on the Agile/Scrum quiz on your first attempt',
    emoji: '⚡',
    color: '#059669',
    bgColor: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.3)',
  },
  {
    id: 'sql-racer',
    name: 'SQL Racer',
    description: 'Placed a correct query in SQL Grand Prix',
    howToEarn: 'Submit at least one correct SQL query in SQL Grand Prix',
    emoji: '🏎️',
    color: '#ea580c',
    bgColor: 'rgba(234,88,12,0.12)',
    borderColor: 'rgba(234,88,12,0.3)',
  },
  {
    id: 'arena-warrior',
    name: 'Arena Warrior',
    description: 'Reached Gold Bee tier in the Arena',
    howToEarn: 'Reach Gold Bee tier (ELO 1300+) in 1v1 Arena duels',
    emoji: '⚔️',
    color: '#dc2626',
    bgColor: 'rgba(220,38,38,0.12)',
    borderColor: 'rgba(220,38,38,0.3)',
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: '5-day Daily Duel streak achieved',
    howToEarn: 'Maintain a Daily Duel win streak of 5 or more days',
    emoji: '🔥',
    color: '#d97706',
    bgColor: 'rgba(217,119,6,0.12)',
    borderColor: 'rgba(217,119,6,0.3)',
  },
  {
    id: 'dedicated',
    name: 'Dedicated Learner',
    description: 'Attended 8+ class sessions',
    howToEarn: 'Mark attendance in 8 or more class sessions',
    emoji: '📚',
    color: '#0284c7',
    bgColor: 'rgba(2,132,199,0.12)',
    borderColor: 'rgba(2,132,199,0.3)',
  },
];

export const KUDOS_CATEGORIES = [
  { id: 'helpful',     label: 'Helpful',      emoji: '🤝', color: '#059669' },
  { id: 'inspiring',   label: 'Inspiring',    emoji: '✨', color: '#7c3aed' },
  { id: 'team-player', label: 'Team Player',  emoji: '🙌', color: '#0284c7' },
  { id: 'sql-pro',     label: 'SQL Pro',      emoji: '💻', color: '#ea580c' },
  { id: 'problem-solver', label: 'Problem Solver', emoji: '🧠', color: '#b45309' },
] as const;

export type KudosCategoryId = typeof KUDOS_CATEGORIES[number]['id'];
