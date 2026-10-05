import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { highlight } from '../ml/pyHighlight';
import { NODES, isLeaf, leaveShare, predictsLeave, walk, type Customer } from './treeData';

// ─── Walk a customer down the tree ────────────────────────────────────────
// The real depth-3 tree the lab trains, drawn out. Set a customer (or pick
// one of the presets the notebook uses) and the path they take lights up:
// three questions, one answer each, and a leaf saying what share of
// customers like them left. The Python line underneath updates to the call
// that gives the same answer in the notebook, with the same output.
//
// The drawing scrolls sideways on a phone; the written path below it
// carries the same information at a readable size.

const POS: Record<number, [number, number]> = {
  0: [480, 34],
  1: [240, 128], 8: [720, 128],
  5: [120, 222], 2: [360, 222], 9: [600, 222], 12: [840, 222],
  6: [60, 330], 7: [180, 330], 3: [300, 330], 4: [420, 330],
  10: [540, 330], 11: [660, 330], 13: [780, 330], 14: [900, 330],
};

const PRESETS: { label: string; c: Customer }[] = [
  { label: 'Customer A', c: { tenure: 2, monthly: 95, contract: 0, fiber: 1 } },
  { label: 'Customer B', c: { tenure: 40, monthly: 60, contract: 1, fiber: 0 } },
  { label: 'Customer C', c: { tenure: 60, monthly: 25, contract: 2, fiber: 0 } },
  { label: 'A close call', c: { tenure: 2, monthly: 70, contract: 0, fiber: 0 } },
];

const CONTRACTS = ['Month-to-month', 'One year', 'Two year'];

/** Print two probabilities the way numpy does after .round(2): trailing
 *  zeros dropped, and the shorter one padded with spaces to line up. */
function numpyPair(a: number, b: number) {
  const parts = [a, b].map(v => (Math.round(v * 100) / 100).toFixed(2).replace(/0+$/, ''));
  const width = Math.max(...parts.map(p => p.length));
  return `[[${parts.map(p => p.padEnd(width, ' ')).join(' ')}]]`;
}

function Diagram({ path }: { path: number[] }) {
  const on = new Set(path);
  const edges: [number, number, string][] = [];
  Object.values(NODES).forEach(n => {
    if (n.yes !== undefined) edges.push([n.id, n.yes, 'yes']);
    if (n.no !== undefined) edges.push([n.id, n.no, 'no']);
  });
  const leafId = path[path.length - 1];

  // On a phone the drawing is wider than the screen. Keep the customer's
  // leaf in view, so the lit path is what they see without scrolling.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const target = (POS[leafId][0] / 960) * el.scrollWidth - el.clientWidth / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [leafId]);

  return (
    <div className="lr-scroll" ref={scroller}>
      <svg className="dt-tree" viewBox="0 0 960 372" role="img" aria-label="The trained decision tree, with the chosen customer's path highlighted. The written path below says the same thing.">
        {edges.map(([from, to, word]) => {
          const [x1, y1] = POS[from];
          const [x2, y2] = POS[to];
          const lit = on.has(from) && on.has(to);
          const fromBottom = y1 + 22;
          const toTop = y2 - (isLeaf(NODES[to]) ? 30 : 22);
          return (
            <g key={`${from}-${to}`} className={lit ? 'is-lit' : undefined}>
              <line x1={x1} y1={fromBottom} x2={x2} y2={toTop} className="dt-tree__edge" />
              <text x={(x1 + x2) / 2 + (x2 < x1 ? -8 : 8)} y={(fromBottom + toTop) / 2} textAnchor={x2 < x1 ? 'end' : 'start'} className="dt-tree__yn">{word}</text>
            </g>
          );
        })}
        {Object.values(NODES).map(n => {
          const [x, y] = POS[n.id];
          const lit = on.has(n.id);
          if (!isLeaf(n)) {
            return (
              <g key={n.id} className={`dt-tree__node${lit ? ' is-lit' : ''}`}>
                <rect x={x - 70} y={y - 22} width={140} height={44} rx={10} />
                <text x={x} y={y + 5} textAnchor="middle">{n.short}</text>
              </g>
            );
          }
          const share = leaveShare(n);
          const leaves = predictsLeave(n);
          return (
            <g key={n.id} className={`dt-tree__leaf${lit ? ' is-lit' : ''}${n.id === leafId ? ' is-end' : ''}${leaves ? ' is-leave' : ''}`}>
              <rect x={x - 54} y={y - 30} width={108} height={64} rx={10} />
              <text x={x} y={y - 9} textAnchor="middle" className="dt-tree__pct">{Math.round(share * 100)}% left</text>
              <rect x={x - 40} y={y + 1} width={80} height={6} rx={3} className="dt-tree__track" />
              <rect x={x - 40} y={y + 1} width={80 * share} height={6} rx={3} className="dt-tree__fill" />
              <text x={x} y={y + 24} textAnchor="middle" className="dt-tree__says">{leaves ? 'Leaves' : 'Stays'}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function TreeWalk() {
  const [c, setC] = useState<Customer>(PRESETS[0].c);
  const reduce = useReducedMotion();
  const steps = walk(c);
  const leaf = steps[steps.length - 1].node;
  const share = leaveShare(leaf);
  const leaves = predictsLeave(leaf);

  const code = [
    'customer = pd.DataFrame({',
    `    "tenure": [${c.tenure}], "MonthlyCharges": [${c.monthly}],`,
    `    "Contract": [${c.contract}], "Fiber": [${c.fiber}],`,
    '})',
    'print(tree.predict(customer))',
    'print(tree.predict_proba(customer).round(2))',
  ];

  return (
    <div className="dt-walk">
      <div className="dt-walk__controls">
        <div>
          <p className="bt-sim__label">Try a customer</p>
          <div className="lr-bill__presets">
            {PRESETS.map(p => (
              <button key={p.label} type="button" className="lr-navbtn" aria-pressed={JSON.stringify(p.c) === JSON.stringify(c)} onClick={() => setC(p.c)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="dt-walk__fields">
          <div className="lr-field">
            <div className="lr-field__head"><label htmlFor="walk-tenure">Months as a customer</label><span className="lr-field__val">{c.tenure}</span></div>
            <input id="walk-tenure" type="range" min={0} max={72} value={c.tenure} onChange={e => setC({ ...c, tenure: Number(e.target.value) })} />
          </div>
          <div className="lr-field">
            <div className="lr-field__head"><label htmlFor="walk-bill">Monthly bill</label><span className="lr-field__val">${c.monthly}</span></div>
            <input id="walk-bill" type="range" min={18} max={119} value={c.monthly} onChange={e => setC({ ...c, monthly: Number(e.target.value) })} />
          </div>
          <div className="lr-field">
            <div className="lr-field__head"><span>Contract</span></div>
            <div className="lr-pills" role="group" aria-label="Contract">
              {CONTRACTS.map((label, i) => (
                <button key={label} type="button" aria-pressed={c.contract === i} onClick={() => setC({ ...c, contract: i as 0 | 1 | 2 })}>{label}</button>
              ))}
            </div>
          </div>
          <div className="lr-field">
            <div className="lr-field__head"><span>Fibre internet?</span></div>
            <div className="lr-pills" role="group" aria-label="Fibre internet">
              <button type="button" aria-pressed={c.fiber === 1} onClick={() => setC({ ...c, fiber: 1 })}>Yes</button>
              <button type="button" aria-pressed={c.fiber === 0} onClick={() => setC({ ...c, fiber: 0 })}>No</button>
            </div>
          </div>
        </div>
      </div>

      <Diagram path={steps.map(s => s.node.id)} />

      <ol className="dt-path" aria-live="polite">
        {steps.map(({ node, answer }, i) =>
          answer === undefined ? (
            <motion.li
              key={`leaf-${node.id}`}
              className={`dt-path__end${leaves ? ' is-leave' : ''}`}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : 0.1 * i }}
            >
              <span className="dt-path__n">=</span>
              <span>
                <b>{Math.round(share * 100)}% of customers like this left</b> ({node.leave.toLocaleString('en-NZ')} of{' '}
                {(node.stay + node.leave).toLocaleString('en-NZ')} in training). The tree predicts{' '}
                <b>{leaves ? 'leaves' : 'stays'}</b>
                {!leaves && share >= 0.4 ? ', because a few more of them stayed than left. A close call.' : '.'}
              </span>
            </motion.li>
          ) : (
            <motion.li
              key={`${node.id}-${String(answer)}`}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : 0.1 * i }}
            >
              <span className="dt-path__n">{i + 1}</span>
              <span>{node.question} <b>{answer ? 'Yes' : 'No'}</b></span>
            </motion.li>
          ),
        )}
      </ol>

      <div className="lr-cell__box" style={{ marginTop: 14 }}>
        <pre style={{ margin: 0, padding: '12px 14px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.65, color: '#ede6e2' }}>
          <code>
            {code.map((line, i) => <span key={i} style={{ display: 'block' }}>{highlight(line)}</span>)}
            <span style={{ display: 'block', color: 'var(--accent-300)' }}>{`[${leaves ? 1 : 0}]`}</span>
            <span style={{ display: 'block', color: 'var(--accent-300)' }}>{numpyPair(1 - share, share)}</span>
          </code>
        </pre>
      </div>
      <p className="bt-note">
        The last two lines are what your notebook prints for this customer: the prediction (1 = leaves, 0 = stays),
        then the chance of staying and of leaving. The chance is just the share of training customers who landed
        on the same leaf.
      </p>
    </div>
  );
}
