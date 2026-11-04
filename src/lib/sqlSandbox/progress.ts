// ─── Progress: this device first, the class Google Sheet second ───────────
// The profile lives in localStorage and is never cleared by the app, so a
// student types their ID once per device. When a sheet URL is configured,
// every change is also pushed to the sheet, and typing the same ID on a new
// device pulls it back.
//
// The profile is a set of facts ("step L3.s2 done", "challenge c4 solved"),
// never a running total, so two devices can be merged by taking the union.
// XP and streaks are worked out from those facts when needed.

import { SQL_SANDBOX_SHEET_URL } from '../../config/sqlSandbox';
import type { ActivityPayload } from './activity';

export interface StepDone { xp: number; at: string }
export interface LevelDone { stars: number; xp: number; at: string }
export interface ChallengeState {
  solved: boolean;
  xp: number;
  attempts: number;
  pastes: number;
  /** Seconds from opening the challenge to solving it. */
  secs?: number;
  at: string;
}

export interface Profile {
  v: 1;
  id: string;
  /** First name, so the TA can call the student by name. */
  name?: string;
  createdAt: string;
  steps: Record<string, StepDone>;
  levels: Record<string, LevelDone>;
  /** How many times "Show me" was used, per level. Fewer means more stars. */
  shown: Record<string, number>;
  challenges: Record<string, ChallengeState>;
  /** Local dates (YYYY-MM-DD) with any activity. For the streak. */
  days: string[];
}

export interface LogEvent {
  at: string;
  type: 'level' | 'challenge' | 'start';
  ref: string;
  result: string;
  attempts?: number;
  pastes?: number;
  secs?: number;
}

const KEY = 'sqlsb:profile:v1';
const QUEUE = 'sqlsb:queue:v1';
const SYNCED = 'sqlsb:synced:v1';

export const sheetEnabled = () => !!SQL_SANDBOX_SHEET_URL;

export function normaliseId(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

export function validId(id: string) {
  return /^[A-Z0-9-]{3,20}$/.test(id);
}

/** "  ana " -> "Ana". Letters, spaces, hyphens and apostrophes; at most 30 characters. */
export function normaliseName(raw: string) {
  const n = raw.replace(/[^\p{L}\p{M}' -]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 30);
  return n ? n[0].toUpperCase() + n.slice(1) : '';
}

export function validName(name: string) {
  return /\p{L}/u.test(name);
}

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function newProfile(id: string, name?: string): Profile {
  return { v: 1, id, name, createdAt: new Date().toISOString(), steps: {}, levels: {}, shown: {}, challenges: {}, days: [] };
}

function read<T>(key: string): T | null {
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : null;
  } catch {
    return null;
  }
}
function write(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* storage full or blocked: the session still works, it just won't survive a reload */
  }
}

export function loadLocal(): Profile | null {
  const p = read<Profile>(KEY);
  return p && p.v === 1 && p.id ? p : null;
}

export function saveLocal(p: Profile) {
  write(KEY, p);
}

export function forgetLocal() {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith('sqlsb:'))
      .forEach(k => localStorage.removeItem(k));
  } catch {
    /* nothing to clear */
  }
}

/** Ask the browser not to evict our storage when space runs low. */
export function askToPersist() {
  try {
    void navigator.storage?.persist?.();
  } catch {
    /* not supported */
  }
}

// ── Derived numbers ─────────────────────────────────────────────────────────

export function totalXp(p: Profile) {
  return (
    Object.values(p.steps).reduce((s, x) => s + x.xp, 0) +
    Object.values(p.levels).reduce((s, x) => s + x.xp, 0) +
    Object.values(p.challenges).reduce((s, x) => s + (x.solved ? x.xp : 0), 0)
  );
}

export function streak(p: Profile) {
  const set = new Set(p.days);
  const d = new Date();
  // A streak is still alive today if yesterday was active.
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  let n = 0;
  for (;;) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!set.has(key)) break;
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function touchToday(p: Profile): Profile {
  const t = today();
  if (p.days.includes(t)) return p;
  return { ...p, days: [...p.days, t].slice(-120) };
}

/** Union of two profiles for the same ID. Nothing done on either device is lost. */
export function merge(a: Profile, b: Profile): Profile {
  const pickLater = <X extends { at: string }>(x?: X, y?: X) => (!x ? y : !y ? x : x.at >= y.at ? x : y);
  const steps = { ...b.steps, ...a.steps };
  const levels: Profile['levels'] = { ...b.levels };
  for (const [k, v] of Object.entries(a.levels)) {
    const o = levels[k];
    levels[k] = !o ? v : { ...v, stars: Math.max(v.stars, o.stars), xp: Math.max(v.xp, o.xp) };
  }
  const shown: Profile['shown'] = { ...b.shown };
  for (const [k, v] of Object.entries(a.shown)) shown[k] = Math.max(v, shown[k] ?? 0);
  const challenges: Profile['challenges'] = { ...b.challenges };
  for (const [k, v] of Object.entries(a.challenges)) {
    const o = challenges[k];
    if (!o) challenges[k] = v;
    else {
      const later = pickLater(v, o)!;
      challenges[k] = {
        ...later,
        solved: v.solved || o.solved,
        xp: Math.max(v.solved ? v.xp : 0, o.solved ? o.xp : 0),
        attempts: Math.max(v.attempts, o.attempts),
        pastes: Math.max(v.pastes, o.pastes),
      };
    }
  }
  return {
    v: 1,
    id: a.id,
    name: a.name || b.name,
    createdAt: a.createdAt < b.createdAt ? a.createdAt : b.createdAt,
    steps,
    levels,
    shown,
    challenges,
    days: [...new Set([...a.days, ...b.days])].sort().slice(-120),
  };
}

// ── The Google Sheet ────────────────────────────────────────────────────────

export interface SheetSummary {
  name: string;
  xp: number;
  levelsDone: number;
  currentLevel: string;
  stars: number;
  challengesSolved: number;
  challengeList: string;
  attempts: number;
  pastes: number;
  streak: number;
  device: string;
}

function device() {
  const ua = navigator.userAgent;
  if (/iPhone|Android.+Mobile|Mobile/.test(ua)) return 'Phone';
  if (/iPad|Tablet|Android/.test(ua)) return 'Tablet';
  return 'Computer';
}

export function summarise(p: Profile, levelIds: string[], levelTitles: Record<string, string>): SheetSummary {
  const solved = Object.entries(p.challenges).filter(([, c]) => c.solved).map(([k]) => k);
  const next = levelIds.find(id => !p.levels[id]);
  return {
    name: p.name ?? '',
    xp: totalXp(p),
    levelsDone: Object.keys(p.levels).length,
    currentLevel: next ? levelTitles[next] ?? next : 'All done',
    stars: Object.values(p.levels).reduce((s, l) => s + l.stars, 0),
    challengesSolved: solved.length,
    challengeList: solved.sort().join(', '),
    attempts: Object.values(p.challenges).reduce((s, c) => s + c.attempts, 0),
    pastes: Object.values(p.challenges).reduce((s, c) => s + c.pastes, 0),
    streak: streak(p),
    device: device(),
  };
}

export function queueEvent(e: LogEvent) {
  const q = read<LogEvent[]>(QUEUE) ?? [];
  q.push(e);
  write(QUEUE, q.slice(-200));
}

export function lastSynced(): string | null {
  return read<string>(SYNCED);
}

/** Look up a student's saved progress. null when there is none, or no sheet. */
export async function pullProfile(id: string): Promise<Profile | null> {
  if (!sheetEnabled()) return null;
  const url = `${SQL_SANDBOX_SHEET_URL}?action=load&id=${encodeURIComponent(id)}`;
  const res = await fetch(url, { method: 'GET', redirect: 'follow' });
  const body = (await res.json()) as { ok: boolean; profile?: string | null };
  if (!body.ok || !body.profile) return null;
  try {
    const p = JSON.parse(body.profile) as Profile;
    return p && p.v === 1 && p.id === id ? p : null;
  } catch {
    return null;
  }
}

let pushing: Promise<void> | null = null;

/**
 * Send the profile and any queued events. Sent as text/plain so the browser
 * makes a simple request with no CORS preflight, which Apps Script can't answer.
 */
export async function pushProfile(p: Profile, summary: SheetSummary, activity?: ActivityPayload): Promise<boolean> {
  if (!sheetEnabled()) return false;
  if (pushing) await pushing.catch(() => undefined);
  const events = read<LogEvent[]>(QUEUE) ?? [];
  let ok = false;
  pushing = (async () => {
    const res = await fetch(SQL_SANDBOX_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'save', id: p.id, summary, activity, profile: JSON.stringify(p), events }),
      redirect: 'follow',
    });
    const body = (await res.json()) as { ok: boolean };
    ok = !!body.ok;
    if (ok) {
      const left = (read<LogEvent[]>(QUEUE) ?? []).slice(events.length);
      write(QUEUE, left);
      write(SYNCED, new Date().toISOString());
    }
  })();
  try {
    await pushing;
  } catch {
    ok = false;
  } finally {
    pushing = null;
  }
  return ok;
}

export interface BoardRow {
  id: string;
  xp: number;
  levels: number;
  challenges: number;
}

export async function fetchBoard(): Promise<BoardRow[]> {
  if (!sheetEnabled()) return [];
  const res = await fetch(`${SQL_SANDBOX_SHEET_URL}?action=board`, { redirect: 'follow' });
  const body = (await res.json()) as { ok: boolean; rows?: BoardRow[] };
  return body.ok && body.rows ? body.rows : [];
}

// ── Saved workspaces (the databases a student built in each level) ──────────

export function loadWorkspace(scope: string): string | null {
  try {
    return localStorage.getItem(`sqlsb:ws:${scope}`);
  } catch {
    return null;
  }
}

export function saveWorkspace(scope: string, encoded: string | null) {
  try {
    if (encoded === null) localStorage.removeItem(`sqlsb:ws:${scope}`);
    else localStorage.setItem(`sqlsb:ws:${scope}`, encoded);
  } catch {
    /* storage full: keep going without it */
  }
}

// ── The TA's live view ──────────────────────────────────────────────────────

export interface LiveRow {
  id: string;
  name: string;
  xp: number;
  levelsDone: number;
  upTo: string;
  challengesSolved: number;
  pastes: number;
  doing: string;
  step: string;
  /** Seconds on the current step, worked out by the sheet. */
  stepSecs: number;
  fails: number;
  /** Seconds since the student's device last checked in. */
  idleSecs: number;
  device: string;
}

export interface LiveFlag {
  id: string;
  name: string;
  challenge: string;
  secs: number;
  pastes: number;
  agoSecs: number;
}

export async function fetchLive(pin: string): Promise<{ ok: boolean; error?: string; rows: LiveRow[]; flags: LiveFlag[] }> {
  const res = await fetch(`${SQL_SANDBOX_SHEET_URL}?action=live&pin=${encodeURIComponent(pin)}`, { redirect: 'follow' });
  const body = (await res.json()) as { ok: boolean; error?: string; rows?: LiveRow[]; flags?: LiveFlag[] };
  return { ok: body.ok, error: body.error, rows: body.rows ?? [], flags: body.flags ?? [] };
}
