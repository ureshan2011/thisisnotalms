import { useRef, useState, type KeyboardEvent } from 'react';
import { getPyodide, isPyodideReady } from '../../../lib/pyodide';
import { highlight } from './pyHighlight';

// ─── A space to actually run the Python ───────────────────────────────────
// Editable, runnable, and honest: the code in the box is the code that runs,
// in the reader's own browser, with no account and nothing installed. A
// student who changes a number and presses Run again learns more in ten
// seconds than a page of prose about what the number does.
//
// Python is fetched on the first Run rather than on page load, because it is
// about 12 MB and most readers of a lesson page never press the button. The
// wait is stated up front in seconds rather than hidden behind a spinner —
// an unexplained twenty-second pause reads as "broken", and the reader
// leaves before the thing they were promised arrives.
//
// If it cannot load at all — a blocked network, a captive portal, a locked
// down campus laptop — the failure says so plainly and points at Colab,
// which is where this code runs anyway once scikit-learn is involved.
//
// A plain textarea rather than a code editor library. It costs nothing, it
// works with a screen reader and on a phone keyboard, and at twenty lines an
// editor's line numbers and autocomplete would be furniture rather than
// help. Tab inserts four spaces, because Python and because otherwise Tab
// walks the reader out of the box mid-thought.
//
// Given notes, it opens on a read-only view instead: the original program
// with each important line numbered and explained beside it, so a beginner
// reads before they edit. That view always shows the program as written;
// edits live in the editor, and Run runs whatever is in the editor.

type Status = 'idle' | 'starting' | 'running' | 'done' | 'failed';
type Mode = 'read' | 'edit';

function Annotated({ code, notes }: { code: string; notes: string[] }) {
  let n = 0;
  return (
    <ol className="bt-ann">
      {code.split('\n').map((line, i) => {
        const note = notes[i];
        if (note) n += 1;
        return (
          <li key={i} className={note ? 'has-note' : undefined}>
            <code className="bt-ann__code">{highlight(line)}</code>
            {note ? (
              <p className="bt-ann__note">
                <b aria-hidden="true">{n}</b>
                <span>{note}</span>
              </p>
            ) : (
              <span className="bt-ann__blank" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** A new, empty Colab notebook. Where this code goes once it needs the
 *  libraries this page deliberately does not ship. */
export const COLAB_URL = 'https://colab.research.google.com/#create=true';

export default function PythonPlayground({
  label,
  code: initial,
  note,
  notes,
  rows = 16,
}: {
  /** What this space is for, in the bar above the code. */
  label: string;
  /** The starting program. The reader may change it to anything. */
  code: string;
  /** One line under the output on what to try changing. */
  note?: string;
  /** One note per line of `code`, '' for none. Turns on the read view. */
  notes?: string[];
  rows?: number;
}) {
  const [code, setCode] = useState(initial);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>(notes ? 'read' : 'edit');
  const box = useRef<HTMLTextAreaElement>(null);

  async function run() {
    const warm = isPyodideReady();
    setStatus(warm ? 'running' : 'starting');
    setOutput('');

    let text = '';
    try {
      const py = await getPyodide();
      setStatus('running');

      const collect = (chunk: string) => {
        text += `${chunk}\n`;
        setOutput(text);
      };
      py.setStdout({ batched: collect });
      py.setStderr({ batched: collect });

      await py.runPythonAsync(code);
      setOutput(text.trimEnd() || 'The program ran, and printed nothing.');
      setStatus('done');
    } catch (err) {
      // A Python error arrives as a full traceback. The last line is the one
      // that names what went wrong, and the frames above it are this page's
      // plumbing rather than the reader's mistake.
      const raw = err instanceof Error ? err.message : String(err);
      const lines = raw.trimEnd().split('\n');
      const useful = lines.slice(-6).join('\n');
      setOutput(`${text}${text ? '\n' : ''}${useful}`);
      setStatus('failed');
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: from, selectionEnd: to, value } = el;
    const next = `${value.slice(0, from)}    ${value.slice(to)}`;
    setCode(next);
    // React re-renders from state, so the caret has to be put back by hand.
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = from + 4;
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is refused in some browsers and every insecure
      // context. Selecting the box is the fallback everybody already knows.
      box.current?.select();
    }
  }

  const busy = status === 'starting' || status === 'running';

  return (
    <div className="bt-play">
      <div className="bt-play__bar">
        <span className="bt-play__label">{label}</span>
        <button type="button" className="bt-play__ghost" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          className="bt-play__ghost"
          onClick={() => {
            setCode(initial);
            setOutput('');
            setStatus('idle');
          }}
        >
          Reset
        </button>
      </div>

      {notes && (
        <div className="bt-play__modes" role="tablist" aria-label="How to view the code">
          <button type="button" role="tab" aria-selected={mode === 'read'} onClick={() => setMode('read')}>
            Read it line by line
          </button>
          <button type="button" role="tab" aria-selected={mode === 'edit'} onClick={() => setMode('edit')}>
            Edit and run
          </button>
        </div>
      )}

      {mode === 'read' && notes ? (
        <>
          <Annotated code={initial} notes={notes} />
          {code !== initial && (
            <p className="bt-play__note">You have changed the code. This view shows the original — your version is under Edit and run, and that is what Run runs.</p>
          )}
        </>
      ) : (
      <textarea
        ref={box}
        className="bt-play__code"
        value={code}
        rows={rows}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label={`Python code: ${label}`}
        onChange={e => setCode(e.target.value)}
        onKeyDown={onKeyDown}
      />
      )}

      <div className="bt-play__run">
        <button type="button" className="bt-btn bt-btn--md" onClick={run} disabled={busy}>
          {status === 'starting' ? 'Starting Python…' : status === 'running' ? 'Running…' : 'Run this'}
          <span className="bt-btn__badge" aria-hidden="true">▸</span>
        </button>
        {status === 'starting' && (
          <span className="bt-play__wait">
            Fetching Python, about 12 MB. Twenty seconds or so, once — after this it is instant.
          </span>
        )}
        {status === 'idle' && !isPyodideReady() && (
          <span className="bt-play__wait">Runs in your browser. Nothing is installed and nothing is sent anywhere.</span>
        )}
      </div>

      {(output || busy) && (
        <pre className={`bt-play__out${status === 'failed' ? ' bt-play__out--failed' : ''}`} aria-live="polite">
          {output || 'Working…'}
        </pre>
      )}

      {status === 'failed' && (
        <p className="bt-play__help">
          If that says something about the network rather than your code, this browser cannot reach the Python
          runtime — some campus and office networks block it. The same code runs in{' '}
          <a href={COLAB_URL} target="_blank" rel="noreferrer">
            a free Colab notebook
          </a>
          , which needs a Google account and nothing else.
        </p>
      )}

      {note && <p className="bt-play__note">{note}</p>}
    </div>
  );
}
