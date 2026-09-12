import { useCallback, useEffect, useRef, useState } from 'react';

// ─── A draft that survives the tab closing ────────────────────────────────
// A student writing about something that actually went wrong at their work is
// two or three paragraphs in when the phone rings. Losing that is the fastest
// way to make sure they never start again, so every keystroke is persisted.
//
// It stays in localStorage and goes nowhere else. That is not a limitation to
// apologise for, it is the reason the prompt can ask for something real.
//
// Every access is wrapped: private windows, blocked site data and storage
// quotas all throw, and none of them are a reason for the page to stop
// working. When storage is unavailable the draft simply lives in memory for
// the session, and `persisted` says so, so the interface can be honest about
// it rather than promising a save it did not make.

export interface LocalDraft<T> {
  value: T;
  set: (next: T | ((prev: T) => T)) => void;
  clear: () => void;
  /** True once a write has actually reached storage. */
  persisted: boolean;
  /** Flips true briefly after each successful write, for a quiet "Saved". */
  justSaved: boolean;
}

export function useLocalDraft<T>(key: string, initial: T): LocalDraft<T> {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return initial;
      const parsed = JSON.parse(raw);
      // Merge rather than replace, so a step added to the lesson later does
      // not strand somebody's existing draft on an older shape.
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
        ? { ...(initial as object), ...parsed } as T
        : parsed as T;
    } catch {
      return initial;
    }
  });

  const [persisted, setPersisted] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const first = useRef(true);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Do not flash "Saved" for the initial render, which saved nothing.
    if (first.current) { first.current = false; return; }
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setPersisted(true);
      setJustSaved(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setJustSaved(false), 1600);
    } catch {
      setPersisted(false);
    }
  }, [key, value]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setValue(prev => (typeof next === 'function' ? (next as (p: T) => T)(prev) : next));
  }, []);

  const clear = useCallback(() => {
    try { localStorage.removeItem(key); } catch { /* nothing to undo */ }
    setValue(initial);
    setPersisted(false);
    setJustSaved(false);
    // The clear itself is a state change, so skip its "Saved" flash.
    first.current = true;
  }, [key, initial]);

  return { value, set, clear, persisted, justSaved };
}
