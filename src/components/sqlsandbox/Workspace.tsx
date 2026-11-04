import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Play, RotateCcw, Undo2 } from 'lucide-react';
import SqlEditor from './SqlEditor';
import RunOutput from './RunOutput';
import TablesPanel from './TablesPanel';
import type { Sandbox } from './useSandbox';

// Editor, Run, what happened, and the live tables. Used by the lessons, the
// challenges and the playground alike, so the controls never move.

export default function Workspace({
  sb,
  value,
  onChange,
  onRun,
  onPaste,
  showEditor = true,
  actions,
  above,
  resetLabel = 'Start over',
  runLabel = 'Run',
  placeholder,
}: {
  sb: Sandbox;
  value: string;
  onChange: (v: string) => void;
  /** Called with the text instead of running it directly, so the caller can check or count it. */
  onRun?: (text: string) => void;
  onPaste?: (chars: number) => void;
  showEditor?: boolean;
  /** Extra buttons beside Run, e.g. Submit. */
  actions?: ReactNode;
  /** Shown above the editor, e.g. the current step. */
  above?: ReactNode;
  resetLabel?: string;
  runLabel?: string;
  placeholder?: string;
}) {
  const [confirm, setConfirm] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);
  const run = () => (onRun ? onRun(value) : sb.run(value));

  // On a phone the result lands below the fold. Bring it up, so the student
  // sees what their SQL did without hunting for it.
  useEffect(() => {
    if (!sb.last || window.innerWidth >= 900) return;
    outRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [sb.last]);

  if (sb.failed) {
    return (
      <div className="sb-card sb-warn">
        The database engine could not start in this browser. Try reloading, or a recent Chrome, Edge, Safari or Firefox.
      </div>
    );
  }

  return (
    <div className="sb-ws">
      <div className="sb-ws__main">
        {above}
        {showEditor && (
          <div className="sb-card sb-ws__editor">
            <div className="sb-ws__bar">
              <span className="sb-dbchip">
                {sb.engine?.current ? (
                  <>
                    Using <strong>{sb.engine.current}</strong>
                  </>
                ) : (
                  'No database selected'
                )}
              </span>
              <span className="sb-ws__tools">
                <button type="button" className="sb-tool" onClick={sb.undo} disabled={!sb.canUndo} title="Undo the last run">
                  <Undo2 size={15} /> Undo
                </button>
                {confirm ? (
                  <span className="sb-confirm">
                    Sure?
                    <button type="button" className="sb-tool sb-tool--danger" onClick={() => { sb.reset(); setConfirm(false); }}>
                      Yes
                    </button>
                    <button type="button" className="sb-tool" onClick={() => setConfirm(false)}>
                      No
                    </button>
                  </span>
                ) : (
                  <button type="button" className="sb-tool" onClick={() => setConfirm(true)} title="Put the database back how this started">
                    <RotateCcw size={15} /> {resetLabel}
                  </button>
                )}
              </span>
            </div>
            <SqlEditor value={value} onChange={onChange} onRun={run} onPaste={onPaste} disabled={!sb.ready} placeholder={placeholder} />
            <div className="sb-ws__run">
              <button type="button" className="bt-btn bt-btn--md" onClick={run} disabled={!sb.ready || !value.trim()}>
                {runLabel}
                <span className="bt-btn__badge" aria-hidden="true">
                  <Play size={12} fill="currentColor" />
                </span>
              </button>
              {actions}
              <span className="sb-kbd">Ctrl + Enter</span>
            </div>
          </div>
        )}
        <div ref={outRef} className="sb-outwrap">
          <RunOutput out={sb.last} />
        </div>
      </div>
      <div className="sb-ws__side">
        <TablesPanel sb={sb} />
      </div>
    </div>
  );
}
