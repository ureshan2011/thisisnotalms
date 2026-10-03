import { useSyncExternalStore } from 'react';

// ─── Which steps of the lab a student has ticked off ──────────────────────
// Kept in this browser only. It is a convenience for someone who does the
// lab across two sittings, not a record anybody else sees, so it lives in
// localStorage and every read and write is allowed to fail quietly: a
// private window or blocked storage still gets a working checklist, it just
// forgets on reload.

export const STAGES = [
  { id: 'find', label: 'Found the dataset on Kaggle' },
  { id: 'card', label: 'Read the data card' },
  { id: 'download', label: 'Downloaded and unzipped it' },
  { id: 'colab', label: 'Loaded it into Colab' },
  { id: 'explore', label: 'Got to know the data' },
  { id: 'clean', label: 'Cleaned and filtered it' },
  { id: 'model', label: 'Trained and tested a model' },
  { id: 'predict', label: 'Predicted three customers' },
  { id: 'report', label: 'Replied with my report in Teams' },
] as const;

export type StageId = (typeof STAGES)[number]['id'];

const KEY = 'mbi806b-regression-lab-progress';
const listeners = new Set<() => void>();

// The fallback when storage is unavailable, so the page still works.
let memory = '';

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

function write(ids: StageId[]) {
  const value = ids.join(',');
  memory = value;
  try {
    localStorage.setItem(KEY, value);
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
  const raw = useSyncExternalStore(subscribe, read, () => '');
  const done = new Set(raw.split(',').filter(Boolean) as StageId[]);

  function toggle(id: StageId) {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    write(STAGES.map(s => s.id).filter(s => next.has(s)));
  }

  return { done, toggle, clear: () => write([]) };
}
