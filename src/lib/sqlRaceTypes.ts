import type { Timestamp } from 'firebase/firestore';

export interface SqlRaceChallenge {
  id: string;
  title: string;
  description: string;
  schemaContext: string;
  question: string;
  requiredKeywords: string[];
  pointValue: number;
  status: 'active' | 'closed';
  createdByUid: string;
  createdAt: Timestamp;
  closedAt?: Timestamp;
  timeLimit?: number | null;   // minutes, null / undefined = unlimited
  activatedAt?: Timestamp;     // set when status → 'active'
}

export interface SqlRaceSubmission {
  id: string;
  challengeId: string;
  studentUid: string;
  studentName: string;
  studentDisplayId: string;
  studentSection: string;
  studentCampus: string;
  query: string;
  isCorrect: boolean | null;
  marksAwarded: number;
  attemptNumber: number;
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedByUid?: string;
}

export interface SectionScore {
  section: string;
  totalMarks: number;
  correctSubmissions: number;
  color: string;
}

// Stored section key → display label
export const SECTION_DISPLAY: Record<string, string> = {
  'Section A': 'Section A',
  'Section B': 'Section B',
  'Section C': 'Section C',
  'Section Default (No Section)': 'Section CHC',
  'Section CHC': 'Section CHC',
};

export function getSectionDisplayName(section: string): string {
  return SECTION_DISPLAY[section] ?? section ?? 'Unknown';
}

// Short label for compact UI elements
export function getSectionShortName(section: string): string {
  if (section === 'Section Default (No Section)' || section === 'Section CHC') return 'CHC';
  return section.replace('Section ', '');
}

export const SECTION_COLORS: Record<string, string> = {
  'Section A': '#ef4444',
  'Section B': '#3b82f6',
  'Section C': '#f59e0b',
  'Section Default (No Section)': '#10b981',
  'Section CHC': '#10b981',
};

export const SECTION_ORDER = ['Section A', 'Section B', 'Section C', 'Section Default (No Section)', 'Section CHC'];

export const MAX_ATTEMPTS = 3;

export function autoValidate(query: string, requiredKeywords: string[]): boolean {
  if (!requiredKeywords.length) return false;
  const lq = query.toLowerCase();
  return requiredKeywords.every(kw => lq.includes(kw.toLowerCase().trim()));
}

export function computeSectionScores(submissions: SqlRaceSubmission[]): SectionScore[] {
  const map = new Map<string, SectionScore>();

  for (const sub of submissions) {
    if (!sub.isCorrect) continue;
    const key = sub.studentSection;
    const existing = map.get(key);
    if (existing) {
      existing.totalMarks += sub.marksAwarded;
      existing.correctSubmissions += 1;
    } else {
      map.set(key, {
        section: key,
        totalMarks: sub.marksAwarded,
        correctSubmissions: 1,
        color: SECTION_COLORS[key] ?? '#8b5cf6',
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalMarks - a.totalMarks);
}

// Returns the section that first submitted a correct answer for a challenge, or null.
export function getFirstBloodSection(
  submissions: SqlRaceSubmission[],
  challengeId: string,
): string | null {
  const correct = submissions
    .filter(s => s.challengeId === challengeId && s.isCorrect)
    .sort((a, b) => (a.submittedAt?.seconds ?? 0) - (b.submittedAt?.seconds ?? 0));
  return correct[0]?.studentSection ?? null;
}

// Returns seconds remaining, 0 if expired, null if no time limit.
export function getChallengeSecondsLeft(challenge: SqlRaceChallenge): number | null {
  if (!challenge.timeLimit || !challenge.activatedAt) return null;
  const activatedMs = (challenge.activatedAt as Timestamp).toDate().getTime();
  const expiresMs = activatedMs + challenge.timeLimit * 60 * 1000;
  return Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
