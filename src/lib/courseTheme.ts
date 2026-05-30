// ─── Shared course theming ────────────────────────────────────────
// Single source of truth for the MBI course palette + small helpers,
// reused by ClassCountdownPage and PreClassSwarmPage.

export type CourseCode = 'MBI800' | 'MBI802' | 'MBI804';

export interface CourseConfig {
  code: CourseCode;
  name: string;
  label: string;
  accent: string;
  accentLight: string;
  accentGlow: string;
  textGradient: string;
  orbColor1: string;
  orbColor2: string;
  orbColor3: string;
}

export const COURSES: Record<CourseCode, CourseConfig> = {
  MBI800: {
    code: 'MBI800',
    name: 'Strategic Information System Planning',
    label: 'BIS',
    accent: '#f59e0b',
    accentLight: '#fde68a',
    accentGlow: 'rgba(245,158,11,0.32)',
    textGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 28%, #f59e0b 65%, #b45309 100%)',
    orbColor1: 'rgba(245,158,11,0.14)',
    orbColor2: 'rgba(251,191,36,0.08)',
    orbColor3: 'rgba(180,83,9,0.10)',
  },
  MBI802: {
    code: 'MBI802',
    name: 'Database Management Systems',
    label: 'DBMS',
    accent: '#8b5cf6',
    accentLight: '#c4b5fd',
    accentGlow: 'rgba(139,92,246,0.32)',
    textGradient: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 28%, #8b5cf6 65%, #4c1d95 100%)',
    orbColor1: 'rgba(124,58,237,0.18)',
    orbColor2: 'rgba(139,92,246,0.10)',
    orbColor3: 'rgba(76,29,149,0.12)',
  },
  MBI804: {
    code: 'MBI804',
    name: 'IT Project Management',
    label: 'ITPM',
    accent: '#0ea5e9',
    accentLight: '#bae6fd',
    accentGlow: 'rgba(14,165,233,0.32)',
    textGradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 28%, #0ea5e9 65%, #075985 100%)',
    orbColor1: 'rgba(14,165,233,0.14)',
    orbColor2: 'rgba(56,189,248,0.09)',
    orbColor3: 'rgba(7,89,133,0.11)',
  },
};

export const COURSE_CODES = Object.keys(COURSES) as CourseCode[];

// Deterministic pseudo-random in [0,1) seeded by a string (+ optional salt).
export function seededRand(seed: string, salt = 0): number {
  let h = salt;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return (h >>> 0) / 0xffffffff;
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
