import { useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { MODEL, predict } from './insuranceData';
import { highlight } from '../ml/pyHighlight';

// ─── Two widgets for the modelling half of the lab ────────────────────────
// SplitDemo: why 20% of the people are hidden from the model before it
// trains. BillBuilder: the trained model taken apart, line by line, so a
// prediction stops being a number that falls out of model.predict and
// becomes a sum the student can do on paper.
//
// BillBuilder uses the model's exact numbers (see insuranceData.ts), so its
// total matches what Colab prints for the same person, to the dollar.

/* ── 1. Split ──────────────────────────────────────────────────────────── */

// Forty squares, each standing for about 33 people. The eight that go to
// the test pile are spread through the line, the way a shuffle would.
const SQUARES = Array.from({ length: 40 }, (_, i) => i);
const TEST = new Set([3, 8, 14, 19, 22, 29, 33, 38]);

export function SplitDemo() {
  const [split, setSplit] = useState(false);
  const reduce = useReducedMotion();
  const t = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 260, damping: 30 };

  const square = (i: number) => (
    <motion.span key={i} layoutId={`p${i}`} layout transition={t} className={`lr-person${split && TEST.has(i) ? ' is-test' : ''}`} />
  );

  return (
    <div className="lr-splitdemo">
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="bt-btn bt-btn--sm" onClick={() => setSplit(s => !s)}>
          {split ? 'Put them back' : 'Split them 80 / 20'}
          <span className="bt-btn__badge" aria-hidden="true">→</span>
        </button>
        <span className="lr-caption">Each square is about 33 people.</span>
      </div>
      <LayoutGroup>
        {split ? (
          <div className="lr-bins">
            <div className="lr-bin">
              <h5>Learn from these · 1,069 people</h5>
              <p>The model sees their ages, BMIs, children, smoking <i>and</i> their bills.</p>
              <div className="lr-pool">{SQUARES.filter(i => !TEST.has(i)).map(square)}</div>
            </div>
            <div className="lr-bin" style={{ borderColor: 'var(--ink-300)' }}>
              <h5>Test · 268 people</h5>
              <p>Hidden until the end. Then it guesses their bills.</p>
              <div className="lr-pool">{SQUARES.filter(i => TEST.has(i)).map(square)}</div>
            </div>
          </div>
        ) : (
          <div className="lr-bins lr-bins--start">
            <div className="lr-bin">
              <h5>All 1,337 people, after cleaning</h5>
              <p>Press the button to deal them into two piles.</p>
              <div className="lr-pool">{SQUARES.map(square)}</div>
            </div>
          </div>
        )}
      </LayoutGroup>
    </div>
  );
}

/* ── 2. Build a bill ──────────────────────────────────────────────────── */

interface Person {
  age: number;
  bmi: number;
  children: number;
  smoker: 0 | 1;
}

const PRESETS: { label: string; p: Person }[] = [
  { label: 'Customer A', p: { age: 30, bmi: 25, children: 0, smoker: 0 } },
  { label: 'Customer B', p: { age: 30, bmi: 25, children: 0, smoker: 1 } },
  { label: 'Customer C', p: { age: 55, bmi: 32, children: 2, smoker: 0 } },
  { label: 'A trick one', p: { age: 18, bmi: 16, children: 0, smoker: 0 } },
];

const money = (n: number) => `${n < 0 ? '−' : ''}$${Math.abs(Math.round(n)).toLocaleString('en-NZ')}`;
const BAR_MAX = 30000;

export function BillBuilder() {
  const [p, setP] = useState<Person>(PRESETS[0].p);
  const total = predict(p.age, p.bmi, p.children, p.smoker);

  const lines: { name: string; how: string; amt: number }[] = [
    { name: 'Starting point', how: 'where the line starts before any of the inputs', amt: MODEL.start },
    { name: 'Age', how: `${p.age} years × $${MODEL.age.toFixed(2)}`, amt: MODEL.age * p.age },
    { name: 'BMI', how: `${p.bmi} × $${MODEL.bmi.toFixed(2)}`, amt: MODEL.bmi * p.bmi },
    { name: 'Children', how: `${p.children} × $${MODEL.children.toFixed(2)}`, amt: MODEL.children * p.children },
    { name: 'Smoker', how: p.smoker ? `yes, so + $${MODEL.smoker.toFixed(2)}` : 'no, so nothing added', amt: MODEL.smoker * p.smoker },
  ];

  const code = [
    'new_person = pd.DataFrame({',
    `    "age": [${p.age}], "bmi": [${p.bmi}],`,
    `    "children": [${p.children}], "smoker": [${p.smoker}],`,
    '})',
    'model.predict(new_person).round()',
  ];

  return (
    <div className="lr-bill">
      <div className="lr-bill__grid">
        <div>
          <p className="bt-sim__label">Try a customer</p>
          <div className="lr-bill__presets">
            {PRESETS.map(pr => (
              <button
                key={pr.label}
                type="button"
                className="lr-navbtn"
                aria-pressed={JSON.stringify(pr.p) === JSON.stringify(p)}
                onClick={() => setP(pr.p)}
              >
                {pr.label}
              </button>
            ))}
          </div>

          <div className="lr-field">
            <div className="lr-field__head">
              <label htmlFor="bill-age">Age</label>
              <span className="lr-field__val">{p.age}</span>
            </div>
            <input id="bill-age" type="range" min={18} max={64} step={1} value={p.age} onChange={e => setP({ ...p, age: Number(e.target.value) })} />
          </div>

          <div className="lr-field">
            <div className="lr-field__head">
              <label htmlFor="bill-bmi">BMI</label>
              <span className="lr-field__val">{p.bmi}</span>
            </div>
            <input id="bill-bmi" type="range" min={16} max={53} step={0.5} value={p.bmi} onChange={e => setP({ ...p, bmi: Number(e.target.value) })} />
          </div>

          <div className="lr-field">
            <div className="lr-field__head"><span>Children</span></div>
            <div className="lr-pills" role="group" aria-label="Children">
              {[0, 1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" aria-pressed={p.children === n} onClick={() => setP({ ...p, children: n })}>{n}</button>
              ))}
            </div>
          </div>

          <div className="lr-field">
            <div className="lr-field__head"><span>Smokes?</span></div>
            <div className="lr-pills" role="group" aria-label="Smokes">
              <button type="button" aria-pressed={p.smoker === 0} onClick={() => setP({ ...p, smoker: 0 })}>No</button>
              <button type="button" aria-pressed={p.smoker === 1} onClick={() => setP({ ...p, smoker: 1 })}>Yes</button>
            </div>
          </div>

          <p className="bt-note">The sliders stop at 18 and 64 because that's every age the data has. Outside that, the model is guessing blind.</p>
        </div>

        <div>
          <div className="lr-receipt" aria-live="polite">
            <p className="lr-receipt__title">How the model adds it up</p>
            {lines.map(l => (
              <div key={l.name} className="lr-receipt__line">
                <span>
                  {l.name}
                  <small>{l.how}</small>
                </span>
                <span className={`lr-receipt__amt${l.amt < 0 ? ' is-neg' : ''}`}>{money(l.amt)}</span>
                <span className="lr-receipt__bar" aria-hidden="true">
                  <i className={l.amt < 0 ? 'is-neg' : undefined} style={{ width: `${Math.min(100, (Math.abs(l.amt) / BAR_MAX) * 100)}%` }} />
                </span>
              </div>
            ))}
            <div className="lr-receipt__total">
              <span>Predicted charges</span>
              <b className={`bt-tnum${total < 0 ? ' is-neg' : ''}`}>{money(total)}</b>
            </div>
          </div>

          <div className="lr-cell__box" style={{ marginTop: 14 }}>
            <pre style={{ margin: 0, padding: '12px 14px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.65, color: '#ede6e2' }}>
              <code>
                {code.map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>{highlight(line)}</span>
                ))}
                <span style={{ display: 'block', color: 'var(--accent-300)' }}>{`array([${Math.round(total)}.])`}</span>
              </code>
            </pre>
          </div>

          {total < 0 ? (
            <div className="bt-verdict bt-verdict--bad" style={{ marginTop: 14 }}>
              <strong>A negative bill.</strong>
              Nobody gets paid to see a doctor. A straight line doesn't know bills stop at zero, so for a young, very
              slim non-smoker it keeps going down past it. Your own notebook does this too: look for dots below zero on
              the real-against-predicted chart.
            </div>
          ) : (
            <p className="bt-note">
              That last line is what your notebook prints for this person. If yours differs by more than a dollar or
              two, something in your cleaning is different from mine.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
