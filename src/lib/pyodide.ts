// ─── Real Python, in the reader's own browser ─────────────────────────────
// Pyodide is CPython compiled to WebAssembly. Loading it costs about 12 MB
// once per browser, which is why nothing here runs until somebody presses
// Run, and why every playground on a page shares this one instance.
//
// Deliberately no scientific packages. numpy, scipy and scikit-learn would
// add fifty megabytes or so on top, and the playgrounds these serve exist to
// show what the models are doing in code a beginner can read line by line —
// which is plain Python and a bit of arithmetic. The scikit-learn version of
// each model is on the page too, as the four lines somebody would actually
// write at work, next to a link that runs it in Colab where the libraries
// are already installed.

const PYODIDE_VERSION = '0.28.3';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export interface PyodideRuntime {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideRuntime>;
  }
}

let script: Promise<void> | null = null;
let runtime: Promise<PyodideRuntime> | null = null;
let ready = false;

function loadScript(): Promise<void> {
  if (script) return script;
  script = new Promise<void>((resolve, reject) => {
    // A reload can leave the tag in place from a previous attempt.
    const existing = document.querySelector<HTMLScriptElement>('script[data-pyodide]');
    if (existing && window.loadPyodide) {
      resolve();
      return;
    }
    const tag = document.createElement('script');
    tag.src = `${INDEX_URL}pyodide.js`;
    tag.async = true;
    tag.dataset.pyodide = 'true';
    tag.onload = () => resolve();
    tag.onerror = () => {
      // Let a later press try again rather than failing for the session:
      // this is usually a flaky network or a captive portal, not a verdict.
      script = null;
      tag.remove();
      reject(new Error('Could not reach the Python runtime.'));
    };
    document.head.appendChild(tag);
  });
  return script;
}

/** The shared runtime, started on first use. Concurrent callers wait on the
 *  same promise, so two playgrounds on a page never load it twice. */
export function getPyodide(): Promise<PyodideRuntime> {
  if (runtime) return runtime;
  runtime = loadScript()
    .then(async () => {
      if (!window.loadPyodide) throw new Error('The Python runtime loaded but did not start.');
      const py = await window.loadPyodide({ indexURL: INDEX_URL });
      ready = true;
      return py;
    })
    .catch(err => {
      runtime = null;
      throw err;
    });
  return runtime;
}

/** True only once Python has finished starting, so a playground can say
 *  "about twenty seconds, once" on the first run and nothing on the rest.
 *  Starting is not the same as started, which is why this is not a null
 *  check on the promise. */
export function isPyodideReady(): boolean {
  return ready;
}
