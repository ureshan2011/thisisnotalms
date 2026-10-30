import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';

// ─── Pieces shared by the /normalisation-basics page ──────────────────────
// The pizza shop's data, the one table component every stage draws with, and
// the print switch.
//
// The print switch exists because the page is meant to be saved as a PDF
// with its pictures, not as a text summary. Every interactive stage reads
// `usePrinting()` and, while the browser prints, renders its finished state
// (all columns coloured, every table split, every problem played) so the PDF
// carries the whole lesson instead of whichever tab was open.

export const EASE = [0.16, 1, 0.3, 1] as const;

// ── Print mode ───────────────────────────────────────────────────────────
const PrintCtx = createContext(false);
export const usePrinting = () => useContext(PrintCtx);

export function PrintProvider({ children }: { children: ReactNode }) {
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    // flushSync so the finished states are on screen before Chrome lays out
    // the pages; a normal batched update can land after the snapshot.
    const on = () => flushSync(() => setPrinting(true));
    const off = () => setPrinting(false);
    window.addEventListener('beforeprint', on);
    window.addEventListener('afterprint', off);
    return () => {
      window.removeEventListener('beforeprint', on);
      window.removeEventListener('afterprint', off);
    };
  }, []);

  return <PrintCtx.Provider value={printing}>{children}</PrintCtx.Provider>;
}

/** Opens the browser's print window, where "Save as PDF" is a destination. */
export function savePageAsPdf() {
  window.dispatchEvent(new Event('beforeprint'));
  // Two frames, so the finished states have painted before the dialog opens.
  requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
}

// ── The shop's data ──────────────────────────────────────────────────────
// Three phone orders at a small pizza shop. Small enough to read at a
// glance, but it has every problem normalisation fixes: a list in a cell, a
// price repeated per order, and a customer's phone repeated per order.

export const MENU: Record<string, number> = {
  'Chicken Pizza': 18,
  'Garlic Bread': 6,
  'Veggie Pizza': 16,
  Cola: 3,
};

export interface Order { order: string; date: string; cust: string; name: string; phone: string }
export const ORDERS: Order[] = [
  { order: '1001', date: '3 Mar', cust: 'C1', name: 'Amaya', phone: '021 555 0101' },
  { order: '1002', date: '3 Mar', cust: 'C2', name: 'Ravi', phone: '022 555 0202' },
  { order: '1003', date: '4 Mar', cust: 'C1', name: 'Amaya', phone: '021 555 0101' },
];

export interface Line { order: string; item: string; qty: number }
export const LINES: Line[] = [
  { order: '1001', item: 'Chicken Pizza', qty: 1 },
  { order: '1001', item: 'Garlic Bread', qty: 2 },
  { order: '1002', item: 'Veggie Pizza', qty: 1 },
  { order: '1003', item: 'Chicken Pizza', qty: 2 },
  { order: '1003', item: 'Cola', qty: 1 },
];

export const orderOf = (id: string) => ORDERS.find(o => o.order === id)!;
export const linesOf = (id: string) => LINES.filter(l => l.order === id);
export const money = (n: number) => `$${n}`;

// ── Colour groups ────────────────────────────────────────────────────────
// Each colour answers one question: what does this column depend on? The
// same colour is then the colour of the table that column ends up in, so a
// reader can follow a column from the big sheet to its new home.
export type Group = 'key' | 'order' | 'item' | 'whole' | 'cust' | 'plain';

export const GROUP_LABEL: Record<Exclude<Group, 'plain'>, string> = {
  key: 'Key',
  order: 'Needs only the Order',
  item: 'Needs only the Item',
  whole: 'Needs Order and Item together',
  cust: 'Needs only the Cust ID',
};

export interface Col { k: string; label: string; g: Group; isKey?: boolean }

export type CellTone = 'bad' | 'good' | 'warn' | 'focus';

export interface Row {
  id: string;
  cells: Record<string, ReactNode>;
  /** gone: struck through, it has been deleted. new: just added. */
  state?: 'gone' | 'new' | 'match' | 'dim';
}

// ── The table ────────────────────────────────────────────────────────────
export function NTable({
  name,
  tone,
  cols,
  rows,
  tint,
  cellTone,
  caption,
  animateKey,
  compact,
}: {
  /** Shown above the table as its name tag. */
  name?: string;
  /** Colours the name tag. Usually the group the whole table is about. */
  tone?: Group;
  cols: Col[];
  rows: Row[];
  /** Also tint the body cells of each coloured column, not just its header. */
  tint?: boolean;
  cellTone?: (rowId: string, col: string) => CellTone | undefined;
  caption?: ReactNode;
  /** Change it to replay the row entrance. */
  animateKey?: string;
  compact?: boolean;
}) {
  return (
    <div className={`ns-table${compact ? ' ns-table--compact' : ''}`}>
      {name && (
        <p className={`ns-tname ns-tname--${tone ?? 'plain'}`}>
          <span className="ns-tname__dot" aria-hidden="true" />
          {name}
        </p>
      )}
      <div className="bt-scroll ns-tscroll">
        <table>
          <thead>
            <tr>
              {cols.map(c => (
                <th key={c.k} className={`ns-h--${c.isKey ? 'key' : c.g}`}>
                  <span className="ns-th">
                    {c.isKey && <KeyRound size={13} strokeWidth={2.4} aria-label="Key column" />}
                    {c.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <AnimatePresence mode="wait" initial={false}>
            <motion.tbody
              key={animateKey ?? 'rows'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              <AnimatePresence initial={false}>
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    layout="position"
                    className={r.state ? `ns-row--${r.state}` : undefined}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 14 }}
                    transition={{ duration: 0.45, ease: EASE, delay: animateKey ? i * 0.09 : 0 }}
                  >
                    {cols.map(c => {
                      const t = cellTone?.(r.id, c.k);
                      const cls = [
                        c.isKey && 'ns-td--key',
                        tint && !c.isKey && c.g !== 'plain' && `ns-col--${c.g}`,
                        t && `ns-td--${t}`,
                      ].filter(Boolean).join(' ');
                      return (
                        <td key={c.k} className={cls || undefined}>
                          {t ? (
                            <motion.span
                              key={`${t}-${String(r.cells[c.k])}`}
                              className="ns-cell"
                              initial={{ scale: 0.86, opacity: 0.4 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.4, ease: EASE }}
                            >
                              {r.cells[c.k]}
                            </motion.span>
                          ) : (
                            r.cells[c.k]
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>
      {caption && <p className="ns-tcap">{caption}</p>}
    </div>
  );
}

/** A colour swatch with its meaning, for legends. */
export function Swatch({ g, children }: { g: Group; children: ReactNode }) {
  return (
    <span className="ns-swatch">
      <i className={`ns-swatch__chip ns-h--${g}`} aria-hidden="true" />
      {children}
    </span>
  );
}

/** A plain rule box: "A table is in 1NF when…". */
export function RuleBox({ label, children, tone }: { label: string; children: ReactNode; tone: Group }) {
  return (
    <motion.div
      className={`ns-rule ns-rule--${tone}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <p className="ns-rule__label">{label}</p>
      <div className="ns-rule__body">{children}</div>
    </motion.div>
  );
}
