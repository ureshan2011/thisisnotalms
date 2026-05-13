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
  timeLimit?: number | null;   // minutes; null / undefined = unlimited
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

// Full race position, accounting for section size as the denominator.
// progressPct = sectionTotalMarks / (studentsInSection * totalChallengePoints)
// → 100% means every student answered every challenge correctly.
export interface RacePosition {
  section: string;
  color: string;
  totalMarks: number;
  maxMarks: number;
  progressPct: number;          // 0–1
  uniqueContributors: number;   // distinct students who got at least 1 correct
  studentCount: number;         // total enrolled students in this section
  rank: number;
}

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

export const ALL_RACE_SECTIONS = [
  'Section A',
  'Section B',
  'Section C',
  'Section Default (No Section)',
];

export const MAX_ATTEMPTS = 3;

export function autoValidate(query: string, requiredKeywords: string[]): boolean {
  if (!requiredKeywords.length) return false;
  const lq = query.toLowerCase();
  return requiredKeywords.every(kw => lq.includes(kw.toLowerCase().trim()));
}

// Legacy — still used by ContributionPanel summary cards.
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

/**
 * Compute race positions for all four sections.
 *
 * Denominator per section = studentCountInSection × totalChallengePoints
 * This ensures the car reaches the finish only when EVERY student answers
 * EVERY challenge correctly — more contributors = further ahead.
 *
 * @param submissions   All correct (isCorrect===true) submissions
 * @param challenges    All challenges (used to compute total possible points)
 * @param sectionCounts { 'Section A': 12, 'Section B': 8, … }
 */
export function computeRacePositions(
  submissions: SqlRaceSubmission[],
  challenges: SqlRaceChallenge[],
  sectionCounts: Record<string, number>,
): RacePosition[] {
  const totalChallengePoints = challenges.reduce((sum, c) => sum + c.pointValue, 0);

  // Aggregate correct marks + unique contributors per section
  const data = new Map<string, { totalMarks: number; contributors: Set<string> }>();

  for (const sub of submissions) {
    if (!sub.isCorrect) continue;
    const key = sub.studentSection;
    if (!data.has(key)) data.set(key, { totalMarks: 0, contributors: new Set() });
    const d = data.get(key)!;
    d.totalMarks += sub.marksAwarded;
    d.contributors.add(sub.studentUid);
  }

  const positions: RacePosition[] = ALL_RACE_SECTIONS.map(section => {
    const d = data.get(section);
    const studentCount = Math.max(sectionCounts[section] ?? 0, 1);
    const maxMarks = studentCount * Math.max(totalChallengePoints, 1);
    const totalMarks = d?.totalMarks ?? 0;
    return {
      section,
      color: SECTION_COLORS[section] ?? '#8b5cf6',
      totalMarks,
      maxMarks,
      progressPct: Math.min(totalMarks / maxMarks, 1),
      uniqueContributors: d?.contributors.size ?? 0,
      studentCount,
      rank: 0,
    };
  });

  positions.sort((a, b) => b.totalMarks - a.totalMarks);
  positions.forEach((p, i) => { p.rank = i; });
  return positions;
}

// First section to get a correct answer on a specific challenge.
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

// How many additional marks does laggingSection need to overtake leadingSection?
export function pointsToOvertake(
  leading: RacePosition,
  lagging: RacePosition,
): number {
  return Math.max(0, leading.totalMarks - lagging.totalMarks + 1);
}
