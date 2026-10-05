import { useSyncExternalStore } from 'react';
import { useLab } from './LabContext';

// ─── Which steps of a lab a student has ticked off ────────────────────────
// Kept in this browser only. It is a convenience for someone who does a lab
// across two sittings, not a record anybody else sees, so it lives in
// localStorage and every read and write is allowed to fail quietly: a
// private window or blocked storage still gets a working checklist, it just
// forgets on reload.
//
// Each lab has its own storage key (see LabContext), so ticking a step in
// one lab never ticks it in another.

const listeners = new Set<() => void>();

// The fallback when storage is unavailable, so the page still works.
const memory = new Map<string, string>();

function read(key: string): string {
  try {
    return localStorage.getItem(key) ?? memory.get(key) ?? '';
  } catch {
    return memory.get(key) ?? '';
  }
}

function write(key: string, ids: string[]) {
  const value = ids.join(',');
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked. The in-memory copy above keeps this visit working.
  }
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLabProgress() {
  const { storageKey, stages } = useLab();
  const raw = useSyncExternalStore(subscribe, () => read(storageKey), () => '');
  const done = new Set(raw.split(',').filter(Boolean));

  function toggle(id: string) {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    write(storageKey, stages.map(s => s.id).filter(s => next.has(s)));
  }

  return { stages, done, toggle, clear: () => write(storageKey, []) };
}
