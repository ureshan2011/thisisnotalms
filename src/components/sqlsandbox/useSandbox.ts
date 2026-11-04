import { useCallback, useEffect, useRef, useState } from 'react';
import { decodeSnapshot, encodeSnapshot, type RunOutput, type Snapshot, type SqlEngine } from '../../lib/sqlSandbox/engine';
import { newEngine } from '../../lib/sqlSandbox/loadSql';
import { loadWorkspace, saveWorkspace } from '../../lib/sqlSandbox/progress';

// One sandbox: an engine, its undo stack, and the last run. Saved to
// localStorage under `scope` after every change, so a reload, or coming back
// tomorrow, picks up exactly where the student left off.

export interface Sandbox {
  engine: SqlEngine | null;
  ready: boolean;
  failed: boolean;
  /** Bumps on every change, so views that read the engine re-render. */
  version: number;
  last: RunOutput | null;
  canUndo: boolean;
  run: (text: string) => RunOutput | null;
  undo: () => void;
  /** Back to the starting state for this scope. */
  reset: () => void;
  /** Replace everything with the result of running `sql` (quietly). */
  load: (sql: string) => void;
}

const MAX_UNDO = 30;
/** Undo steps kept across a reload. A phone browser can drop the page at any time. */
const SAVED_UNDO = 5;

function saveUndo(scope: string, stack: Snapshot[]) {
  try {
    localStorage.setItem(`sqlsb:undo:${scope}`, JSON.stringify(stack.slice(-SAVED_UNDO).map(encodeSnapshot)));
  } catch {
    /* storage full: undo still works until the page reloads */
  }
}
function loadUndo(scope: string): Snapshot[] {
  try {
    const raw = JSON.parse(localStorage.getItem(`sqlsb:undo:${scope}`) ?? '[]') as string[];
    return raw.map(decodeSnapshot).filter((x): x is Snapshot => !!x);
  } catch {
    return [];
  }
}

export function useSandbox(scope: string, setup: () => string, opts: { fresh?: boolean } = {}): Sandbox {
  const [engine, setEngine] = useState<SqlEngine | null>(null);
  const [failed, setFailed] = useState(false);
  const [version, setVersion] = useState(0);
  const [last, setLast] = useState<RunOutput | null>(null);
  const stack = useRef<Snapshot[]>([]);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  const save = useCallback(
    (e: SqlEngine) => {
      saveWorkspace(scope, encodeSnapshot(e.snapshot()));
      saveUndo(scope, stack.current);
    },
    [scope],
  );

  useEffect(() => {
    let alive = true;
    setEngine(null);
    setLast(null);
    stack.current = [];
    newEngine()
      .then(e => {
        if (!alive) return;
        const saved = opts.fresh ? null : loadWorkspace(scope);
        const snap = saved ? decodeSnapshot(saved) : null;
        if (snap) {
          e.restore(snap);
          stack.current = loadUndo(scope);
        } else {
          const sql = setupRef.current();
          if (sql.trim()) e.run(sql);
          save(e);
        }
        setEngine(e);
        setVersion(v => v + 1);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
    // `fresh` only matters on the first load of a scope.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, save]);

  const run = useCallback(
    (text: string) => {
      if (!engine || !text.trim()) return null;
      stack.current.push(engine.snapshot());
      if (stack.current.length > MAX_UNDO) stack.current.shift();
      const out = engine.run(text);
      setLast(out);
      save(engine);
      setVersion(v => v + 1);
      return out;
    },
    [engine, save],
  );

  const undo = useCallback(() => {
    const snap = stack.current.pop();
    if (!engine || !snap) return;
    engine.restore(snap);
    setLast(null);
    save(engine);
    setVersion(v => v + 1);
  }, [engine, save]);

  const load = useCallback(
    (sql: string) => {
      if (!engine) return;
      stack.current.push(engine.snapshot());
      engine.reset();
      if (sql.trim()) engine.run(sql);
      setLast(null);
      save(engine);
      setVersion(v => v + 1);
    },
    [engine, save],
  );

  const reset = useCallback(() => {
    if (!engine) return;
    engine.reset();
    const sql = setupRef.current();
    if (sql.trim()) engine.run(sql);
    stack.current = [];
    setLast(null);
    save(engine);
    setVersion(v => v + 1);
  }, [engine, save]);

  return {
    engine,
    ready: !!engine,
    failed,
    version,
    last,
    canUndo: stack.current.length > 0,
    run,
    undo,
    reset,
    load,
  };
}
