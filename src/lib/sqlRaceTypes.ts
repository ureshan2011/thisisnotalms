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

export const SECTION_COLORS: Record<string, string> = {
  'Section A': '#ef4444',
  'Section B': '#3b82f6',
  'Section C': '#f59e0b',
  'Section Default (No Section)': '#10b981',
};

export const MAX_ATTEMPTS = 3;

export function autoValidate(query: string, requiredKeywords: string[]): boolean {
  if (!requiredKeywords.length) return false;
  const lq = query.toLowerCase();
  return requiredKeywords.every(kw => lq.includes(kw.toLowerCase().trim()));
}

export function computeSectionScores(
  submissions: SqlRaceSubmission[],
): SectionScore[] {
  const map = new Map<string, SectionScore>();

  for (const sub of submissions) {
    if (!sub.isCorrect) continue;
    const existing = map.get(sub.studentSection);
    if (existing) {
      existing.totalMarks += sub.marksAwarded;
      existing.correctSubmissions += 1;
    } else {
      map.set(sub.studentSection, {
        section: sub.studentSection,
        totalMarks: sub.marksAwarded,
        correctSubmissions: 1,
        color: SECTION_COLORS[sub.studentSection] ?? '#8b5cf6',
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalMarks - a.totalMarks);
}
