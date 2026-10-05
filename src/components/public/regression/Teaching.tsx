import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { highlight } from '../ml/pyHighlight';

// ─── The regression lab's teaching pieces for filtering and plotting ──────
// Written after students said the filter and chart steps told them *what*
// to type but not *why*. (The task/why block and the read-aloud code that go
// with these live in ../lab/Bits, shared with the other labs.)
//
//   FilterDemo  — ten real rows from the cleaned data. Pick a rule and watch
//                 every row get asked the question, the ones that answer
//                 False drop away, and the average of what's left change.
//                 That is all a filter is, and the average is why we want one.
//   ReadADot    — one real person, found on the chart, with the two lines
//                 that tell you how to read their dot.
//
// Every row and number here is real: the rows are from insuranceData's
// source (Kaggle's insurance.csv after the lab's cleaning), identified by
// the row number pandas gives them.

/* ── Filter, shown on ten real rows ───────────────────────────────────── */

interface Row { id: number; age: number; bmi: number; children: number; smoker: 0 | 1; charges: number }

// Real rows, by pandas' row number. Five smokers and five non-smokers,
// including three people over 50, so every rule below keeps somebody. Only
// the columns a rule asks about are shown (plus the bill), so the table
// fits a phone and the True/False column never scrolls out of sight.
const ROWS: Row[] = [
  { id: 0, age: 19, bmi: 27.9, children: 0, smoker: 1, charges: 16884.924 },
  { id: 1, age: 18, bmi: 33.77, children: 1, smoker: 0, charges: 1725.5523 },
  { id: 6, age: 46, bmi: 33.44, children: 1, smoker: 0, charges: 8240.5896 },
  { id: 9, age: 60, bmi: 25.84, children: 0, smoker: 0, charges: 28923.13692 },
  { id: 10, age: 25, bmi: 26.22, children: 0, smoker: 0, charges: 2721.3208 },
  { id: 11, age: 62, bmi: 26.29, children: 0, smoker: 1, charges: 27808.7251 },
  { id: 13, age: 56, bmi: 39.82, children: 0, smoker: 0, charges: 11090.7178 },
  { id: 14, age: 27, bmi: 42.13, children: 0, smoker: 1, charges: 39611.7577 },
  { id: 23, age: 34, bmi: 31.92, children: 1, smoker: 1, charges: 37701.8768 },
  { id: 34, age: 28, bmi: 36.4, children: 1, smoker: 1, charges: 51194.55914 },
];

interface Rule { id: string; label: string; code: string; question: string; test: (r: Row) => boolean; note: string }

const RULES: Rule[] = [
  {
    id: 'all',
    label: 'No filter',
    code: 'df',
    question: '(no question)',
    test: () => true,
    note: 'Everyone, smokers and non-smokers mixed together. One average for all of them hides the difference we are looking for.',
  },
  {
    id: 'smoke',
    label: 'Smokers',
    code: 'df[df["smoker"] == 1]',
    question: 'smoker == 1 ?',
    test: r => r.smoker === 1,
    note: 'Every row was asked "do you smoke?". The five that said True stay. Their average bill is the smokers’ number.',
  },
  {
    id: 'nosmoke',
    label: 'Non-smokers',
    code: 'df[df["smoker"] == 0]',
    question: 'smoker == 0 ?',
    test: r => r.smoker === 0,
    note: 'Same question flipped. Now compare this average with the smokers’ one. That gap is the whole point of filtering.',
  },
  {
    id: 'old',
    label: 'Over 50',
    code: 'df[df["age"] > 50]',
    question: 'age > 50 ?',
    test: r => r.age > 50,
    note: 'A filter can ask about any column. Three people here are over 50, and two of them don’t smoke.',
  },
  {
    id: 'oldsmoke',
    label: 'Over 50 and smokes',
    code: 'df[(df["age"] > 50) & (df["smoker"] == 1)]',
    question: 'age > 50 & smoker == 1 ?',
    test: r => r.age > 50 && r.smoker === 1,
    note: 'Two questions at once. & means a row has to say True to both. Only one person in these ten does.',
  },
];

const money = (n: number) => `$${Math.round(n).toLocaleString('en-NZ')}`;

export function FilterDemo() {
  const [ruleId, setRuleId] = useState('all');
  const reduce = useReducedMotion();
  const rule = RULES.find(r => r.id === ruleId) ?? RULES[0];
  const kept = ROWS.filter(rule.test);
  const avg = kept.reduce((s, r) => s + r.charges, 0) / Math.max(1, kept.length);

  return (
    <div className="lr-filter">
      <p className="bt-sim__label">Pick a rule</p>
      <div className="lr-pills" role="group" aria-label="Pick a filter rule">
        {RULES.map(r => (
          <button key={r.id} type="button" aria-pressed={r.id === ruleId} onClick={() => setRuleId(r.id)}>
            {r.label}
          </button>
        ))}
      </div>

      <div className="lr-filter__code">
        <code>{highlight(rule.code)}</code>
        <span>{rule.id === 'all' ? 'all ten rows' : 'read it as: “df, where…”'}</span>
      </div>
      <p className="lr-filter__ask">
        {rule.id === 'all' ? (
          <>No question is asked, so every row is kept.</>
        ) : (
          <>Each row is asked: <code>{rule.question.replace(' ?', '')}</code> True rows stay, False rows are set aside.</>
        )}
      </p>

      <div className="lr-scroll">
        <table className="lr-df lr-filter__table">
          <thead>
            <tr>
              <th>row</th>
              <th>age</th>
              <th>smoker</th>
              <th>charges</th>
              <th className="lr-filter__q">Answer</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(r => {
              const keep = rule.test(r);
              return (
                <motion.tr
                  key={r.id}
                  className={keep ? undefined : 'is-out'}
                  animate={{ opacity: keep ? 1 : 0.28 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.35 }}
                >
                  <th>{r.id}</th>
                  <td className={rule.id === 'old' || rule.id === 'oldsmoke' ? 'is-asked' : undefined}>{r.age}</td>
                  <td className={rule.id === 'smoke' || rule.id === 'nosmoke' || rule.id === 'oldsmoke' ? 'is-asked' : undefined}>{r.smoker}</td>
                  <td>{money(r.charges)}</td>
                  <td>
                    {rule.id === 'all' ? (
                      <span className="lr-tf">kept</span>
                    ) : (
                      <span className={`lr-tf ${keep ? 'is-true' : 'is-false'}`}>{keep ? 'True' : 'False'}</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lr-filter__read" aria-live="polite">
        <div>
          <b className="bt-tnum">{kept.length}</b>
          <span>of 10 rows kept</span>
        </div>
        <div>
          <b className="bt-tnum">{money(avg)}</b>
          <span>average bill of the rows kept</span>
        </div>
        <p>{rule.note}</p>
      </div>
    </div>
  );
}

/* ── How to read one dot ──────────────────────────────────────────────── */

export function ReadADot() {
  // A real person: row 34 in the cleaned data. 28, smokes, bill $51,195.
  const W = 420;
  const H = 230;
  const L = 52;
  const B = 34;
  const x = (age: number) => L + ((age - 15) / (67 - 15)) * (W - L - 14);
  const y = (c: number) => H - B - (c / 64000) * (H - B - 12);
  const px = x(28);
  const py = y(51195);
  return (
    <figure className="lr-dot">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="How to read one dot: a person aged 28 whose bill was $51,195 sits 28 along the bottom and $51,195 up the side.">
        <g className="lr-axis">
          {[0, 20000, 40000, 60000].map(v => (
            <g key={v}>
              <line x1={L} x2={W - 14} y1={y(v)} y2={y(v)} />
              <text x={L - 8} y={y(v) + 4} textAnchor="end">{v === 0 ? '$0' : `$${v / 1000}k`}</text>
            </g>
          ))}
          {[20, 30, 40, 50, 60].map(a => (
            <text key={a} x={x(a)} y={H - B + 16} textAnchor="middle">{a}</text>
          ))}
          <text className="lr-axis__title" x={(L + W) / 2} y={H - 2} textAnchor="middle">Age, along the bottom</text>
        </g>
        <line x1={px} x2={px} y1={py} y2={H - B} stroke="var(--accent-500)" strokeWidth={1.5} strokeDasharray="4 4" />
        <line x1={L} x2={px} y1={py} y2={py} stroke="var(--accent-500)" strokeWidth={1.5} strokeDasharray="4 4" />
        <circle cx={px} cy={py} r={7} fill="var(--cat-2)" stroke="var(--paper-0)" strokeWidth={2.5} />
        <text className="lr-linelabel" x={px + 14} y={py - 8}>One person: row 34</text>
        <text className="lr-dot__small" x={px + 14} y={py + 9}>28 years old, smokes</text>
        <text className="lr-dot__tag" x={px + 4} y={H - B - 8}>28</text>
        <text className="lr-dot__tag" x={L + 6} y={py - 7}>$51,195</text>
      </svg>
      <figcaption>
        Each dot is one row of your table. Go straight down from the dot to read their <b>age</b>. Go straight left
        to read their <b>bill</b>. 1,337 people means 1,337 dots.
      </figcaption>
    </figure>
  );
}
