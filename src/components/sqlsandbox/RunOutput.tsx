import { CheckCircle2, XCircle } from 'lucide-react';
import { formatCell, type ResultSet, type RunOutput as Out } from '../../lib/sqlSandbox/engine';

// What the last Run did, one line per statement. Errors lead with the plain
// sentence; MySQL's own wording sits underneath, so it looks familiar later.

export function ResultGrid({ result, marks, max = 60 }: { result: ResultSet; marks?: Set<string>; max?: number }) {
  if (!result.columns.length) return null;
  const rows = result.rows.slice(0, max);
  return (
    <div className="sb-grid">
      <table>
        <thead>
          <tr>
            {result.columns.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={result.columns.length} className="sb-grid__empty">
                No rows
              </td>
            </tr>
          )}
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => (
                <td key={j} className={`${v === null ? 'sb-null' : ''} ${marks?.has(`${i}:${j}`) ? 'sb-cell--changed' : ''}`}>
                  {formatCell(v, result.scales?.[j])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {result.rows.length > max && <p className="sb-grid__more">Showing {max} of {result.rows.length} rows.</p>}
    </div>
  );
}

export default function RunOutput({ out }: { out: Out | null }) {
  if (!out) return null;
  return (
    <div className="sb-out" aria-live="polite">
      {out.results.map((r, i) => (
        <div key={i} className={`sb-out__item ${r.ok ? '' : 'is-err'}`}>
          <div className="sb-out__head">
            {r.ok ? <CheckCircle2 size={16} className="sb-ok" /> : <XCircle size={16} className="sb-bad" />}
            <code className="sb-out__sql">{r.raw.split('\n')[0].slice(0, 70)}{r.raw.length > 70 || r.raw.includes('\n') ? ' …' : ''}</code>
          </div>
          {r.ok ? (
            <>
              {r.note && <p className="sb-out__note">{r.note}</p>}
              <p className="sb-out__msg">{r.message}</p>
              {r.result && <ResultGrid result={r.result} />}
            </>
          ) : (
            <>
              <p className="sb-out__plain">{r.error?.plain}</p>
              <p className="sb-out__msg">{r.message}</p>
            </>
          )}
        </div>
      ))}
      {!out.ok && out.results.length > 0 && (
        <p className="sb-out__stop">Stopped at the error. Anything after it did not run.</p>
      )}
    </div>
  );
}
