import type { Timestamp } from 'firebase/firestore';

export const VOTE_COLLECTIONS = {
  teams:     'presentationTeams',
  votes:     'presentationVotes',
  liveState: 'liveState',
} as const;

export interface Ratings {
  clarity:        number;
  networkEffect:  number;
  businessModel:  number;
  risk:           number;
}

export const EMPTY_RATINGS: Ratings = {
  clarity: 0,
  networkEffect: 0,
  businessModel: 0,
  risk: 0,
};

export const RATING_CRITERIA: {
  key: keyof Ratings;
  label: string;
  description: string;
}[] = [
  { key: 'clarity',       label: 'Clarity',        description: 'How clearly did they explain the platform and its two+ sides?' },
  { key: 'networkEffect', label: 'Network Effect',  description: 'How compelling was their network effect explanation?' },
  { key: 'businessModel', label: 'Business Model',  description: 'How well did they explain how it makes money?' },
  { key: 'risk',          label: 'Risk / Insight',  description: 'How sharp was the risk or discussion question they raised?' },
];

export interface Team {
  id:        string;
  name:      string;
  order:     number;
  createdAt: Date;
}

export interface VoteRecord {
  id:            string;
  studentId:     string;
  firstName:     string;
  teamId:        string;
  teamName:      string;
  ratings:       Ratings;
  platform:      string;
  wentWell:      string;
  couldImprove:  string;
  updatedAt:     Date;
}

export function firestoreToTeam(id: string, data: Record<string, unknown>): Team {
  return {
    id,
    name:      (data.name as string) ?? '',
    order:     (data.order as number) ?? 0,
    createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
  };
}

export function firestoreToVote(id: string, data: Record<string, unknown>): VoteRecord {
  const ratings = (data.ratings as Partial<Ratings>) ?? {};
  return {
    id,
    studentId: (data.studentId as string) ?? '',
    firstName: (data.firstName as string) ?? '',
    teamId:    (data.teamId as string) ?? '',
    teamName:  (data.teamName as string) ?? '',
    ratings: {
      clarity:       ratings.clarity ?? 0,
      networkEffect: ratings.networkEffect ?? 0,
      businessModel: ratings.businessModel ?? 0,
      risk:          ratings.risk ?? 0,
    },
    platform:     (data.platform as string) ?? '',
    wentWell:     (data.wentWell as string) ?? '',
    couldImprove: (data.couldImprove as string) ?? '',
    updatedAt: (data.updatedAt as Timestamp)?.toDate?.() ?? new Date(),
  };
}

export function overallAverage(ratings: Ratings): number {
  const values = [ratings.clarity, ratings.networkEffect, ratings.businessModel, ratings.risk];
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// Firestore doc IDs can't contain "/" or be empty — student-typed IDs need light cleanup
// before being used as the deterministic `${studentId}_${teamId}` upsert key.
export function sanitizeIdPart(value: string): string {
  return value.trim().replace(/\//g, '-');
}

export function voteDocId(studentId: string, teamId: string): string {
  return `${sanitizeIdPart(studentId)}_${teamId}`;
}
