import { useCallback, useEffect, useRef, useState } from 'react';
import { activityPayload, onActivity } from '../../lib/sqlSandbox/activity';
import { LEVEL_IDS, LEVEL_TITLES } from '../../lib/sqlSandbox/levels';
import {
  issueCertificate, loadLocal, merge, pullProfile, pushProfile, queueEvent, saveLocal, sheetEnabled, summarise, touchToday,
  type CertLevel, type ChallengeState, type Profile,
} from '../../lib/sqlSandbox/progress';

// The student's progress, plus the few ways it can change. Every change is
// saved to this device at once and pushed to the class sheet a moment later.

export type SyncState = 'local' | 'saving' | 'saved' | 'offline';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(() => loadLocal());
  const [sync, setSync] = useState<SyncState>(sheetEnabled() ? 'saved' : 'local');
  const timer = useRef<number | null>(null);
  const latest = useRef(profile);
  latest.current = profile;

  const push = useCallback(async () => {
    const p = latest.current;
    if (!p || !sheetEnabled()) return;
    setSync('saving');
    try {
      const ok = await pushProfile(p, summarise(p, LEVEL_IDS, LEVEL_TITLES), activityPayload());
      setSync(ok ? 'saved' : 'offline');
    } catch {
      setSync('offline');
    }
  }, []);

  const schedule = useCallback(
    (now = false) => {
      if (!sheetEnabled()) return;
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => void push(), now ? 50 : 2500);
    },
    [push],
  );

  const update = useCallback(
    (fn: (p: Profile) => Profile, urgent = false) => {
      setProfile(prev => {
        if (!prev) return prev;
        const next = touchToday(fn(prev));
        saveLocal(next);
        return next;
      });
      schedule(urgent);
    },
    [schedule],
  );

  // On open: pick up anything done on another device, then push this one.
  useEffect(() => {
    const p = latest.current;
    if (!p || !sheetEnabled()) return;
    let alive = true;
    pullProfile(p.id)
      .then(remote => {
        if (!alive || !remote) return;
        setProfile(cur => {
          if (!cur) return cur;
          const m = merge(cur, remote);
          saveLocal(m);
          return m;
        });
      })
      .catch(() => setSync('offline'))
      .finally(() => schedule(true));
    const retry = () => schedule(true);
    window.addEventListener('online', retry);
    return () => {
      alive = false;
      window.removeEventListener('online', retry);
    };
    // Only when the student changes.
  }, [profile?.id, schedule]);

  // The TA's live screen: a moved step or a failed run is sent within a few
  // seconds, and an open page checks in every two minutes so "stuck, but
  // still here" never looks like "gone home".
  useEffect(() => {
    if (!profile?.id || !sheetEnabled()) return;
    const off = onActivity(() => schedule());
    const beat = window.setInterval(() => {
      if (document.visibilityState === 'visible') void push();
    }, 120_000);
    const back = () => document.visibilityState === 'visible' && schedule(true);
    document.addEventListener('visibilitychange', back);
    return () => {
      off();
      window.clearInterval(beat);
      document.removeEventListener('visibilitychange', back);
    };
  }, [profile?.id, schedule, push]);

  const setName = useCallback((name: string) => update(p => ({ ...p, name }), true), [update]);

  /** Saves progress to the sheet first, so the sheet can check the work, then asks for the certificate. */
  const claimCert = useCallback(
    async (level: CertLevel, fullName: string) => {
      const p = latest.current;
      if (!p) return { ok: false as const, error: 'Not signed in.' };
      try {
        const saved = await pushProfile(p, summarise(p, LEVEL_IDS, LEVEL_TITLES), activityPayload());
        if (!saved) return { ok: false as const, error: 'Could not save your progress to the class sheet. Check your connection and try again.' };
        const res = await issueCertificate(p.id, level, fullName);
        if (res.ok) {
          update(cur => ({ ...cur, certs: { ...cur.certs, [level]: { id: res.cert.id, name: res.cert.name, at: res.cert.issued } } }), true);
        }
        return res;
      } catch {
        return { ok: false as const, error: 'Could not reach the class sheet. Check your connection and try again.' };
      }
    },
    [update],
  );

  const start = useCallback(
    (p: Profile) => {
      const next = touchToday(p);
      saveLocal(next);
      queueEvent({ at: new Date().toISOString(), type: 'start', ref: 'device', result: 'opened on this device' });
      setProfile(next);
      schedule(true);
    },
    [schedule],
  );

  const completeStep = useCallback(
    (levelId: string, stepId: string, xp: number) =>
      update(p => (p.steps[`${levelId}.${stepId}`] ? p : { ...p, steps: { ...p.steps, [`${levelId}.${stepId}`]: { xp, at: new Date().toISOString() } } })),
    [update],
  );

  const markShown = useCallback(
    (levelId: string) => update(p => ({ ...p, shown: { ...p.shown, [levelId]: (p.shown[levelId] ?? 0) + 1 } })),
    [update],
  );

  const completeLevel = useCallback(
    (levelId: string, stars: number, xp: number) => {
      queueEvent({ at: new Date().toISOString(), type: 'level', ref: levelId, result: `${stars} stars` });
      update(p => {
        const old = p.levels[levelId];
        const lv = { stars: Math.max(stars, old?.stars ?? 0), xp: old ? old.xp : xp, at: old?.at ?? new Date().toISOString() };
        return { ...p, levels: { ...p.levels, [levelId]: lv } };
      }, true);
    },
    [update],
  );

  const recordChallenge = useCallback(
    (id: string, patch: { solved: boolean; xp: number; pastes: number; secs?: number; note: string }) => {
      const before = latest.current?.challenges[id];
      queueEvent({
        at: new Date().toISOString(), type: 'challenge', ref: id,
        result: patch.solved ? 'solved' : patch.note,
        attempts: (before?.attempts ?? 0) + 1, pastes: (before?.pastes ?? 0) + patch.pastes, secs: patch.secs,
      });
      update(p => {
        const old: ChallengeState = p.challenges[id] ?? { solved: false, xp: 0, attempts: 0, pastes: 0, at: '' };
        const next: ChallengeState = {
          solved: old.solved || patch.solved,
          xp: old.solved ? old.xp : patch.solved ? patch.xp : 0,
          attempts: old.attempts + 1,
          pastes: old.pastes + patch.pastes,
          secs: old.solved ? old.secs : patch.solved ? patch.secs : old.secs,
          at: new Date().toISOString(),
        };
        return { ...p, challenges: { ...p.challenges, [id]: next } };
      }, true);
    },
    [update],
  );

  return { profile, sync, start, setName, claimCert, completeStep, markShown, completeLevel, recordChallenge, setProfile };
}

export type ProfileApi = ReturnType<typeof useProfile>;
