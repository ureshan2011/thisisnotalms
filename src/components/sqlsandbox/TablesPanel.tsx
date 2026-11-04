import { useEffect, useMemo, useState } from 'react';
import { Database, KeyRound } from 'lucide-react';
import { formatCell, type TableDiff } from '../../lib/sqlSandbox/engine';
import type { Sandbox } from './useSandbox';

// The live view of the database in use. After each Run: new rows flash
// green, changed cells amber, deleted rows stay a moment in red. That flash
// is most of how a beginner learns what UPDATE and DELETE actually did.

export default function TablesPanel({ sb, compact }: { sb: Sandbox; compact?: boolean }) {
  const { engine, version, last } = sb;
  const db = engine?.current ?? null;
  const tables = useMemo(() => (engine && db ? engine.tables() : []), [engine, db, version]);
  const diffs = useMemo(() => {
    const m = new Map<string, TableDiff>();
    for (const d of last?.diffs ?? []) if (db && d.db.toLowerCase() === db.toLowerCase()) m.set(d.table.toLowerCase(), d);
    return m;
  }, [last, db]);

  const [pick, setPick] = useState<string | null>(null);
  useEffect(() => {
    const changed = (last?.diffs ?? []).find(d => !d.dropped && db && d.db.toLowerCase() === db.toLowerCase());
    if (changed) setPick(changed.table);
  }, [last, db]);

  const current = tables.find(t => t.toLowerCase() === pick?.toLowerCase()) ?? tables[0] ?? null;
  const view = engine && current ? engine.view(current) : null;
  const diff = current ? diffs.get(current.toLowerCase()) : undefined;
  const scales = view?.columns.map(c => view.meta?.columns.find(x => x.name.toLowerCase() === c.toLowerCase())) ?? [];
  const pk = new Set(view?.meta?.pk.map(x => x.toLowerCase()) ?? []);

  return (
    <section className={`sb-tables ${compact ? 'is-compact' : ''}`} aria-label="Your tables">
      <header className="sb-tables__head">
        <Database size={15} />
        {db ? (
          <span>
            <span className="sb-muted">Database</span> <strong>{db}</strong>
          </span>
        ) : (
          <span className="sb-muted">No database in use</span>
        )}
      </header>

      {!engine && <p className="sb-tables__empty">Starting the database…</p>}
      {engine && !db && (
        <p className="sb-tables__empty">
          {engine.databases().length ? `You have: ${engine.databases().join(', ')}. Pick one with USE.` : 'Nothing here yet.'}
        </p>
      )}
      {engine && db && tables.length === 0 && <p className="sb-tables__empty">No tables yet.</p>}

      {tables.length > 1 && (
        <div className="sb-tabs" role="tablist">
          {tables.map(t => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={t === current}
              className={`sb-tab ${t === current ? 'is-on' : ''} ${diffs.has(t.toLowerCase()) ? 'has-change' : ''}`}
              onClick={() => setPick(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {view && (
        <div className="sb-grid sb-grid--live" key={`${view.name}-${version}`}>
          <table>
            <caption>
              {view.name} <span className="sb-muted">· {view.rows.length} row{view.rows.length === 1 ? '' : 's'}</span>
            </caption>
            <thead>
              <tr>
                {view.columns.map((c, i) => (
                  <th key={c}>
                    {pk.has(c.toLowerCase()) && <KeyRound size={11} className="sb-key" aria-label="primary key" />}
                    {c}
                    <span className="sb-type">{scales[i]?.type ?? ''}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {view.rows.length === 0 && !diff?.removed.length && (
                <tr>
                  <td colSpan={view.columns.length} className="sb-grid__empty">
                    Empty table
                  </td>
                </tr>
              )}
              {view.rows.map(r => {
                const added = diff?.added.has(r.rowid) && !diff.created;
                const changed = diff?.changed.get(r.rowid);
                return (
                  <tr key={r.rowid} className={added ? 'sb-row--added' : ''}>
                    {r.cells.map((v, i) => (
                      <td
                        key={i}
                        className={`${v === null ? 'sb-null' : ''} ${changed?.has(view.columns[i]) ? 'sb-cell--changed' : ''}`}
                      >
                        {formatCell(v, scales[i]?.base === 'decimal' ? scales[i]?.scale : null)}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {diff?.removed.map(r => (
                <tr key={`gone-${r.rowid}`} className="sb-row--removed" aria-label="deleted row">
                  {view.columns.map((c, i) => (
                    <td key={c}>{formatCell(r.row[c], scales[i]?.base === 'decimal' ? scales[i]?.scale : null)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view && (
        <p className="sb-legend">
          <i className="sb-sw sb-sw--add" /> new <i className="sb-sw sb-sw--chg" /> changed <i className="sb-sw sb-sw--del" /> deleted
        </p>
      )}
    </section>
  );
}
