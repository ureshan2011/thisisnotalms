import { DUEL_QUESTIONS } from './duelData';

export type EloTier = 'bronze' | 'silver' | 'gold' | 'queen';

const K = 32;

export function calculateElo(ratingA: number, ratingB: number, aWon: boolean) {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const delta = Math.round(K * ((aWon ? 1 : 0) - expectedA));
  return {
    newA: Math.max(100, ratingA + delta),
    newB: Math.max(100, ratingB - delta),
    deltaA:  delta,
    deltaB: -delta,
  };
}

export function getTier(rating: number): EloTier {
  if (rating >= 1500) return 'queen';
  if (rating >= 1300) return 'gold';
  if (rating >= 1100) return 'silver';
  return 'bronze';
}

export const TIER_CONFIG: Record<EloTier, {
  label: string; color: string; bg: string; border: string; icon: string; min: number; max: number;
}> = {
  bronze: { label: 'Bronze Bee', color: '#b45309', bg: 'rgba(180,83,9,0.12)',   border: 'rgba(180,83,9,0.3)',   icon: '🐝', min: 0,    max: 1099 },
  silver: { label: 'Silver Bee', color: '#64748b', bg: 'rgba(100,116,139,0.12)',border: 'rgba(100,116,139,0.3)',icon: '🥈', min: 1100, max: 1299 },
  gold:   { label: 'Gold Bee',   color: '#d97706', bg: 'rgba(217,119,6,0.12)',  border: 'rgba(217,119,6,0.3)',  icon: '🌟', min: 1300, max: 1499 },
  queen:  { label: 'Queen Bee',  color: '#7c3aed', bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.35)',icon: '👑', min: 1500, max: 9999 },
};

export function tierProgress(rating: number): number {
  const tier = getTier(rating);
  const cfg  = TIER_CONFIG[tier];
  if (tier === 'queen') return 100;
  return Math.min(100, Math.round(((rating - cfg.min) / (cfg.max + 1 - cfg.min)) * 100));
}

export function getWeekKey(): string {
  const d     = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const week  = Math.ceil(((d.getTime() - start.getTime()) / 86_400_000 + start.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function todayStr(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' });
}

export function pickDuelQuestions(count = 5): string[] {
  const pool = [...DUEL_QUESTIONS];
  const picks: string[] = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const idx = Math.floor(Math.random() * (pool.length - i));
    picks.push(pool[idx].id);
    [pool[idx], pool[pool.length - 1 - i]] = [pool[pool.length - 1 - i], pool[idx]];
  }
  return picks;
}

export interface EloRating {
  uid:            string;
  rating:         number;
  tier:           EloTier;
  weekKey:        string;
  weeklyRatingStart: number;
  totalWins:      number;
  totalLosses:    number;
  duelStreak:     number;
  bestDuelStreak: number;
  lastDuelDate:   string;
  hallOfBees:     boolean;
  hallOfBeesWeek: string;
  dailyTokenUsed: string;   // YYYY-MM-DD — free quick-match token
  crownUntil:     string;   // ISO timestamp or ''
}

export interface DuelRoom {
  p1:            { uid: string; name: string; elo: number; section: string };
  p2:            { uid: string; name: string; elo: number; section: string };
  questionIds:   string[];
  currentRound:  number;
  roundStartedAt: { toDate(): Date } | null;
  score:         { p1: number; p2: number };
  status:        'active' | 'completed';
  winner:        string | null;   // uid or null (draw)
  eloProcessed:  boolean;
  spectators:    string[];
  createdAt:     { toDate(): Date } | null;
  completedAt:   { toDate(): Date } | null;
}

export interface DuelAnswer {
  id?:         string;
  uid:         string;
  round:       number;
  choice:      0 | 1 | 2 | 3;
  isCorrect:   boolean;
  timeMs:      number;
  submittedAt: { toDate(): Date } | null;
}

export interface DuelInvite {
  id?:       string;
  fromUid:   string;
  fromName:  string;
  fromElo:   number;
  toUid:     string | null;   // null = open / quick-match
  toName:    string | null;
  status:    'pending' | 'accepted' | 'declined' | 'expired';
  roomId:    string | null;
  createdAt: { toDate(): Date } | null;
  expiresAt: { toDate(): Date } | null;
}

export interface GhostRecord {
  questionId: string;
  uid:        string;
  name:       string;
  timeMs:     number;
  date:       string;
}
