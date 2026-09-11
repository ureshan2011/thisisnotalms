import { useState } from 'react';

// ─── A practice run of the Power BI report canvas ─────────────────────────
// The hello-world exercise asks you to drag two fields into two wells and
// watch a chart draw itself. That moment is the one beginners find hard to
// picture from written steps, so this lets them do it once here, with no
// account and nothing installed, before they do it for real.
//
// It is a practice run, not a simulator: the panes are named and arranged
// the way Power BI names and arranges them, but nothing here is Microsoft
// software and the page says so. Click-to-place rather than drag, because
// drag does not work on a phone and half the class reads this on one.

const DATA: { item: string; sales: number }[] = [
  { item: 'Coffee', sales: 120 },
  { item: 'Tea', sales: 90 },
  { item: 'Juice', sales: 60 },
];

type FieldKey = 'item' | 'sales';
type WellKey = 'axis' | 'values';
type ChartKind = 'bar' | 'column' | 'pie';

const FIELDS: { key: FieldKey; label: string; kind: string; note: string }[] = [
  { key: 'item', label: 'Item', kind: 'Text', note: 'Coffee, Tea, Juice. Text fields make good categories.' },
  { key: 'sales', label: 'Sales', kind: 'Number', note: 'Power BI puts a Σ on fields it can add up.' },
];

const CHARTS: { key: ChartKind; label: string }[] = [
  { key: 'bar', label: 'Bar chart' },
  { key: 'column', label: 'Column chart' },
  { key: 'pie', label: 'Pie chart' },
];

const WELLS: { key: WellKey; label: string; wants: FieldKey; hint: string }[] = [
  { key: 'axis', label: 'Y-axis', wants: 'item', hint: 'What you’re comparing. A category goes here.' },
  { key: 'values', label: 'X-axis', wants: 'sales', hint: 'What you’re measuring. A number goes here.' },
];

const MAX = 120;
const SLICE_COLORS = ['var(--accent-500)', 'var(--accent-300)', 'var(--accent-200)'];

export default function ChartBuilder() {
  const [placed, setPlaced] = useState<Partial<Record<WellKey, FieldKey>>>({});
  const [held, setHeld] = useState<FieldKey | null>(null);
  const [kind, setKind] = useState<ChartKind>('bar');
  const [said, setSaid] = useState('Pick a field, then pick a well to put it in. Two fields is all it takes.');

  const ready = !!placed.axis && !!placed.values;
  const used = (k: FieldKey) => Object.values(placed).includes(k);

  function pickField(k: FieldKey) {
    if (used(k)) return;
    setHeld(held === k ? null : k);
    const f = FIELDS.find(x => x.key === k)!;
    setSaid(held === k ? 'Put it back. Pick either field when you’re ready.' : `${f.label} in hand. ${f.note} Now choose a well.`);
  }

  function dropInto(w: WellKey) {
    const well = WELLS.find(x => x.key === w)!;
    if (placed[w]) {
      const removed = placed[w]!;
      setPlaced(p => { const n = { ...p }; delete n[w]; return n; });
      setSaid(`Removed ${FIELDS.find(f => f.key === removed)!.label} from ${well.label}. The chart redraws whenever a well changes.`);
      return;
    }
    if (!held) {
      setSaid(`Nothing in hand. Pick ${well.wants === 'item' ? 'Item' : 'Sales'} from the Data pane first.`);
      return;
    }
    const next = { ...placed, [w]: held };
    setPlaced(next);
    setHeld(null);
    if (held !== well.wants) {
      setSaid(`That works, but ${well.label} usually holds ${well.wants === 'item' ? 'a category like Item' : 'a number like Sales'}. Click the well again to take it out.`);
    } else if (next.axis && next.values) {
      setSaid('Done. You never told it to draw bars, sort them or label the axis — it worked that out from the two fields.');
    } else {
      setSaid(`${FIELDS.find(f => f.key === held)!.label} in ${well.label}. One well to go.`);
    }
  }

  function reset() {
    setPlaced({});
    setHeld(null);
    setKind('bar');
    setSaid('Cleared. Pick a field, then pick a well.');
  }

  const total = DATA.reduce((a, d) => a + d.sales, 0);

  return (
    <div className="pbi-builder">
      <p className="pbi-builder__note">
        A mock-up of the report canvas, not Microsoft software. The panes sit roughly where Power BI puts
        them.
      </p>

      <div className="pbi-canvas">
        {/* ── the chart area ── */}
        <div className="pbi-report">
          <div className="pbi-report__bar">
            <span className="bt-dot" style={{ background: ready ? 'var(--green-500)' : 'var(--ink-300)' }} />
            Report canvas · Page 1
            {ready && <button type="button" className="pbi-reset" onClick={reset}>Start over</button>}
          </div>

          <div className="pbi-plot">
            {!ready && (
              <div className="pbi-empty">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 20h18" /><rect x="5" y="11" width="3.4" height="6" rx="1" /><rect x="10.3" y="7" width="3.4" height="10" rx="1" /><rect x="15.6" y="13" width="3.4" height="4" rx="1" />
                </svg>
                <p>An empty visual, waiting for fields.</p>
                <p className="pbi-empty__sub">Power BI shows you this before you fill the wells.</p>
              </div>
            )}

            {ready && kind !== 'pie' && (
              <div className={`pbi-chart pbi-chart--${kind}`}>
                {DATA.map((d, i) => (
                  <div className="pbi-chart__row" key={d.item}>
                    <span className="pbi-chart__label">{d.item}</span>
                    <span className="pbi-chart__track">
                      <i
                        style={{
                          [kind === 'bar' ? 'width' : 'height']: `${(d.sales / MAX) * 100}%`,
                          background: i === 0 ? 'var(--accent-500)' : 'var(--accent-300)',
                        }}
                      />
                    </span>
                    <span className="pbi-chart__value bt-tnum">{d.sales}</span>
                  </div>
                ))}
              </div>
            )}

            {ready && kind === 'pie' && (
              <div className="pbi-pie">
                <svg viewBox="0 0 42 42" width="164" height="164" role="img" aria-label="Coffee 120, Tea 90, Juice 60 units">
                  {(() => {
                    let offset = 25;
                    return DATA.map((d, i) => {
                      const pct = (d.sales / total) * 100;
                      const el = (
                        <circle
                          key={d.item}
                          cx="21" cy="21" r="15.915"
                          fill="transparent"
                          stroke={SLICE_COLORS[i]}
                          strokeWidth="10"
                          strokeDasharray={`${pct} ${100 - pct}`}
                          strokeDashoffset={offset}
                        />
                      );
                      offset -= pct;
                      return el;
                    });
                  })()}
                </svg>
                <ul className="pbi-legend">
                  {DATA.map((d, i) => (
                    <li key={d.item}>
                      <span className="pbi-legend__dot" style={{ background: SLICE_COLORS[i] }} />
                      {d.item} <b className="bt-tnum">{Math.round((d.sales / total) * 100)}%</b>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── visualizations pane ── */}
        <div className="pbi-pane">
          <p className="pbi-pane__title">Visualizations</p>
          <div className="pbi-vizrow">
            {CHARTS.map(c => (
              <button
                key={c.key}
                type="button"
                className="pbi-viz"
                aria-pressed={kind === c.key}
                title={c.label}
                onClick={() => {
                  setKind(c.key);
                  setSaid(ready
                    ? `Same two fields as a ${c.label.toLowerCase()}. Changing the visual doesn’t touch the data.`
                    : `${c.label} selected. Fill both wells and it draws.`);
                }}
              >
                {c.key === 'bar' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4v16h16" /><path d="M7 8h10M7 13h6M7 17.5h3" /></svg>}
                {c.key === 'column' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 20h16" /><path d="M7.5 17V9M12 17V5M16.5 17v-5" /></svg>}
                {c.key === 'pie' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.4" /><path d="M12 3.6V12l7.2 4.2" /></svg>}
              </button>
            ))}
          </div>

          <p className="pbi-pane__sub">Wells</p>
          {WELLS.map(w => {
            const has = placed[w.key];
            return (
              <button
                key={w.key}
                type="button"
                className={`pbi-well${has ? ' pbi-well--full' : ''}${held && !has ? ' pbi-well--armed' : ''}`}
                onClick={() => dropInto(w.key)}
              >
                <span className="pbi-well__label">{w.label}</span>
                <span className="pbi-well__slot">
                  {has ? (
                    <><span className="pbi-chip">{FIELDS.find(f => f.key === has)!.label}</span><span className="pbi-well__x">Click to remove</span></>
                  ) : (
                    <span className="pbi-well__hint">{held ? 'Click to drop it here' : w.hint}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── data pane ── */}
        <div className="pbi-pane">
          <p className="pbi-pane__title">Data</p>
          <p className="pbi-table">sales_by_item</p>
          {FIELDS.map(f => (
            <button
              key={f.key}
              type="button"
              className={`pbi-field${held === f.key ? ' pbi-field--held' : ''}${used(f.key) ? ' pbi-field--used' : ''}`}
              onClick={() => pickField(f.key)}
              disabled={used(f.key)}
            >
              <span className="pbi-field__sigma">{f.key === 'sales' ? 'Σ' : 'A'}</span>
              {f.label}
              <span className="pbi-field__kind">{f.kind}</span>
            </button>
          ))}

          <p className="pbi-pane__sub">Your table</p>
          <table className="pbi-mini">
            <thead><tr><th>Item</th><th>Sales</th></tr></thead>
            <tbody>
              {DATA.map(d => (
                <tr key={d.item}><td>{d.item}</td><td className="bt-tnum">{d.sales}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className={`pbi-say${ready ? ' pbi-say--done' : ''}`} aria-live="polite">{said}</p>
    </div>
  );
}
