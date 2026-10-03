import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { highlight } from '../ml/pyHighlight';

// ─── One Colab code cell, and what it prints ──────────────────────────────
// The code is exactly what the student types into their own notebook. The
// output is exactly what Colab printed when this lab's notebook was run
// under Colab's own library versions (pandas 2.2.3, scikit-learn 1.6.1) on
// the real insurance.csv from Kaggle. Nothing here is invented, so a student
// can hold their screen up against this one and expect them to match.
//
// The output stays hidden until the reader presses ▶, which is the point:
// run it yourself first, then check. The little [n] counts up across the
// page the way Colab's own execution counter does.

export type Output =
  | { kind: 'text'; text: string }
  | {
      kind: 'table';
      columns: string[];
      /** First cell of each row is the row label (pandas' index). */
      rows: (string | number)[][];
      /** [row, column] pairs to highlight, column counted after the index. */
      hot?: [number, number][];
    }
  | { kind: 'image'; src: string; alt: string; width: number; height: number };

let runCounter = 0;

const BASE = import.meta.env.BASE_URL;

function Table({ columns, rows, hot = [] }: { columns: string[]; rows: (string | number)[][]; hot?: [number, number][] }) {
  const isHot = (r: number, c: number) => hot.some(([hr, hc]) => hr === r && hc === c);
  return (
    <div className="lr-scroll">
      <table className="lr-df">
        <thead>
          <tr>
            <th />
            {columns.map(c => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              <th>{row[0]}</th>
              {row.slice(1).map((v, c) => (
                <td key={c} className={isHot(r, c) ? 'is-hot' : undefined}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ColabCell({ code, out, label, after }: {
  code: string;
  out: Output[];
  /** Small heading above the cell, e.g. "Cell 3". */
  label?: string;
  /** What to notice in the output. Shown once it has run. */
  after?: ReactNode;
}) {
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [count, setCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  function run() {
    if (state === 'busy') return;
    setState('busy');
    window.setTimeout(() => {
      runCounter += 1;
      setCount(runCounter);
      setState('done');
    }, 650);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="lr-cell">
      {label && <p className="lr-cell__label">{label}</p>}
      <div className="lr-cell__row">
        <span className="lr-cell__count" aria-hidden="true">
          [{state === 'busy' ? '*' : count ?? ' '}]
        </span>
        <div className="lr-cell__box">
          <div className="lr-cell__bar">
            <button
              type="button"
              className="lr-run"
              data-busy={state === 'busy'}
              onClick={run}
              aria-label={state === 'done' ? 'Run this cell again' : 'Run this cell to see what it prints'}
            >
              {state === 'busy' ? (
                <span className="lr-spin" aria-hidden="true" />
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                </svg>
              )}
            </button>
            <pre>
              <code>
                {code.split('\n').map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>
                    {highlight(line)}
                  </span>
                ))}
              </code>
            </pre>
            <button type="button" className="lr-cell__copy" onClick={copy}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {state === 'done' ? (
        <motion.div
          className="lr-cell__out"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          aria-live="polite"
        >
          <p className="lr-cell__outlabel">What you should see</p>
          {out.map((o, i) => (
            <div key={i} style={{ marginTop: i ? 12 : 0 }}>
              {o.kind === 'text' && <pre>{o.text}</pre>}
              {o.kind === 'table' && <Table columns={o.columns} rows={o.rows} hot={o.hot} />}
              {o.kind === 'image' && (
                <img
                  src={`${BASE}mbi806b/linear-regression/${o.src}`}
                  alt={o.alt}
                  width={o.width}
                  height={o.height}
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </motion.div>
      ) : (
        <p className="lr-cell__hint">
          {state === 'busy' ? 'Running…' : 'Run it in your own notebook first. Then press ▶ here to check yours matches.'}
        </p>
      )}

      {state === 'done' && after && <div className="lr-cell__note">{after}</div>}
    </div>
  );
}
