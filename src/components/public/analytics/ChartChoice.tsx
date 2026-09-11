import { useState } from 'react';

// ─── Which chart answers which question? (LO3) ────────────────────────────
// One quarter's cafe revenue, five ways of drawing it, four questions a
// manager might ask of it. Pick a question and a chart and the widget says
// whether that pairing answers it, works but slowly, or actively misleads.
//
// The lesson is the grid itself: no chart is good or bad on its own, only
// good or bad for a question. Every cell below is filled in, so a student
// who works across the whole grid has met the argument twenty times.
//
// Colour follows the product, not its rank, and stays the same in every
// chart — that is what lets you carry Juice from the line to the stack. The
// four hues come from the theme's categorical set in blend.css, which is
// checked for colour-vision separation against the white card behind it.

type ChartKey = 'column' | 'line' | 'pie' | 'stacked' | 'table';
type QuestionKey = 'biggest' | 'growing' | 'share' | 'mix';
type Verdict = 'good' | 'ok' | 'bad';

const PRODUCTS = ['Coffee', 'Tea', 'Juice', 'Pastries'] as const;
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

// Revenue in thousands of dollars. Invented, but shaped like a real year:
// coffee leads throughout, juice nearly doubles, tea is flat.
const DATA: Record<string, number[]> = {
  Coffee: [120, 132, 128, 145],
  Tea: [90, 88, 95, 92],
  Juice: [60, 74, 96, 118],
  Pastries: [45, 48, 52, 61],
};

const COLORS = ['var(--cat-1)', 'var(--cat-2)', 'var(--cat-3)', 'var(--cat-4)'];

const QUESTIONS: { key: QuestionKey; label: string; full: string }[] = [
  { key: 'biggest', label: 'Biggest seller', full: 'Which product brought in the most last quarter?' },
  { key: 'growing', label: 'Are we growing?', full: 'Is the business growing?' },
  { key: 'share', label: 'Share of revenue', full: 'What share of the year’s revenue does each product bring?' },
  { key: 'mix', label: 'Has the mix shifted?', full: 'Has the product mix changed over the year?' },
];

const CHARTS: { key: ChartKey; label: string; shows: string }[] = [
  { key: 'column', label: 'Column', shows: 'Four products, Q4 only' },
  { key: 'line', label: 'Line', shows: 'Four products across the year' },
  { key: 'pie', label: 'Donut', shows: 'Share of the full year' },
  { key: 'stacked', label: 'Stacked', shows: 'Each quarter, split by product' },
  { key: 'table', label: 'Table', shows: 'Every number, exactly' },
];

const VERDICTS: Record<QuestionKey, Record<ChartKey, { v: Verdict; why: string }>> = {
  biggest: {
    column: { v: 'good', why: 'What a column chart is for. Four bars sharing one baseline, longest wins, and you can see how far ahead Coffee is without reading a number.' },
    line: { v: 'ok', why: 'The answer is at the right-hand end, but you have to trace four lines to get there. It works. It is just slower than it needs to be.' },
    pie: { v: 'bad', why: 'This donut covers the whole year, so it cannot answer a question about Q4. And comparing angles is harder than comparing lengths even when the period is right.' },
    stacked: { v: 'ok', why: 'The Q4 bar holds the answer, but only the bottom segment sits on the baseline. Coffee is obvious; judging Tea against Juice takes real effort.' },
    table: { v: 'good', why: 'Slower to scan than a chart, and exact. For four numbers a table is a perfectly respectable answer, and nobody can misread it.' },
  },
  growing: {
    column: { v: 'bad', why: 'One quarter, no time axis. This chart cannot answer a question about change, and showing it as though it could would mislead the room.' },
    line: { v: 'good', why: 'Time along the bottom, revenue up the side. You get the direction and the shape: Juice steepening, Tea flat, nothing falling.' },
    pie: { v: 'bad', why: 'A donut has no time in it at all. Shares can sit perfectly still while the business halves.' },
    stacked: { v: 'good', why: 'Total bar height is total revenue, so growth reads immediately, and you get the composition thrown in. 315 to 416 across the year.' },
    table: { v: 'ok', why: 'Every number is there and the arithmetic is easy, but you are asking the reader to do work the chart should have done for them.' },
  },
  share: {
    column: { v: 'ok', why: 'Lengths compare easily, but you have to total the four yourself before you can think in shares. Workable, not the best fit.' },
    line: { v: 'bad', why: 'A line chart is about change over time. It says nothing about parts of a whole, and these points are quarterly amounts, not yearly totals.' },
    pie: { v: 'good', why: 'Parts of one whole, four categories, shares far enough apart to see. This is the narrow case where a donut is genuinely the right pick.' },
    stacked: { v: 'ok', why: 'Each bar is one quarter’s whole, not the year’s. You would be reading four separate splits and averaging them by eye.' },
    table: { v: 'good', why: 'Add a total column and the shares are exact to the decimal. Less immediate than a donut, and impossible to misread.' },
  },
  mix: {
    column: { v: 'bad', why: 'A single quarter tells you the mix now and nothing about whether it moved. Coffee has led all year, so this looks like no change at all.' },
    line: { v: 'ok', why: 'You can see Juice climbing while Tea sits flat, so the mix clearly moved. But these are amounts, not shares, so you are inferring the mix rather than reading it.' },
    pie: { v: 'bad', why: 'One donut is one moment. A single pie used to answer a question about change is the most common misleading chart in business reporting.' },
    stacked: { v: 'good', why: 'Four wholes side by side. The Juice band visibly thickens while the Tea band thins. Switch it to 100% stacked and the shift is plainer still.' },
    table: { v: 'ok', why: 'Everything you need is present, but spotting a trend across sixteen numbers is work. This is precisely the job charts were invented for.' },
  },
};

const VERDICT_LABEL: Record<Verdict, string> = {
  good: 'Answers it',
  ok: 'Works, slowly',
  bad: 'Misleads',
};

const W = 560;
const H = 260;
const PAD = { t: 22, r: 18, b: 34, l: 44 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;

const yearTotal = (p: string) => DATA[p].reduce((a, b) => a + b, 0);
const quarterTotal = (qi: number) => PRODUCTS.reduce((a, p) => a + DATA[p][qi], 0);
const GRAND = PRODUCTS.reduce((a, p) => a + yearTotal(p), 0);

/** Shared y-axis: ticks, gridlines and their labels, drawn recessive. */
function Axis({ max, ticks = 4 }: { max: number; ticks?: number }) {
  const step = max / ticks;
  return (
    <g>
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const value = step * i;
        const y = PAD.t + PLOT_H - (value / max) * PLOT_H;
        return (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="var(--border-subtle)" strokeWidth={i === 0 ? 1 : 0.6} />
            <text x={PAD.l - 8} y={y + 3.5} textAnchor="end" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-mono)">
              {Math.round(value)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function ColumnChart() {
  const values = PRODUCTS.map(p => DATA[p][3]);
  const max = 160;
  const band = PLOT_W / PRODUCTS.length;
  const barW = Math.min(64, band - 26);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label={`Column chart of Q4 revenue: ${PRODUCTS.map((p, i) => `${p} ${values[i]}`).join(', ')} thousand dollars.`}>
      <Axis max={max} />
      {PRODUCTS.map((p, i) => {
        const h = (values[i] / max) * PLOT_H;
        const x = PAD.l + band * i + (band - barW) / 2;
        const y = PAD.t + PLOT_H - h;
        return (
          <g key={p}>
            <rect x={x} y={y} width={barW} height={h} rx="4" fill={COLORS[i]}>
              <title>{`${p}, Q4: $${values[i]}k`}</title>
            </rect>
            <text x={x + barW / 2} y={y - 7} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink-900)" fontFamily="var(--font-display)">{values[i]}</text>
            <text x={x + barW / 2} y={H - 12} textAnchor="middle" fontSize="11" fill="var(--ink-400)" fontFamily="var(--font-body)">{p}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart() {
  const max = 160;
  const stepX = PLOT_W / (QUARTERS.length - 1);
  const px = (qi: number) => PAD.l + stepX * qi;
  const py = (v: number) => PAD.t + PLOT_H - (v / max) * PLOT_H;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label={`Line chart of revenue by quarter. ${PRODUCTS.map(p => `${p} goes ${DATA[p].join(' to ')}`).join('; ')} thousand dollars.`}>
      <Axis max={max} />
      {QUARTERS.map((q, i) => (
        <text key={q} x={px(i)} y={H - 12} textAnchor="middle" fontSize="11" fill="var(--ink-400)" fontFamily="var(--font-body)">{q}</text>
      ))}
      {PRODUCTS.map((p, i) => (
        <polyline
          key={p}
          points={DATA[p].map((v, qi) => `${px(qi)},${py(v)}`).join(' ')}
          fill="none"
          stroke={COLORS[i]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {PRODUCTS.map((p, i) =>
        DATA[p].map((v, qi) => (
          <circle key={`${p}-${qi}`} cx={px(qi)} cy={py(v)} r="4" fill={COLORS[i]} stroke="var(--paper-0)" strokeWidth="2">
            <title>{`${p}, ${QUARTERS[qi]}: $${v}k`}</title>
          </circle>
        )),
      )}
    </svg>
  );
}

function DonutChart() {
  const cx = W / 2;
  const cy = H / 2 - 4;
  const r = 78;
  const thickness = 30;
  let angle = -Math.PI / 2;

  const arc = (from: number, to: number) => {
    const outer = r + thickness / 2;
    const inner = r - thickness / 2;
    const large = to - from > Math.PI ? 1 : 0;
    const p = (rad: number, a: number) => `${cx + rad * Math.cos(a)} ${cy + rad * Math.sin(a)}`;
    return `M ${p(outer, from)} A ${outer} ${outer} 0 ${large} 1 ${p(outer, to)} L ${p(inner, to)} A ${inner} ${inner} 0 ${large} 0 ${p(inner, from)} Z`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label={`Donut chart of full-year share: ${PRODUCTS.map(p => `${p} ${Math.round((yearTotal(p) / GRAND) * 100)} percent`).join(', ')}.`}>
      {PRODUCTS.map((p, i) => {
        const frac = yearTotal(p) / GRAND;
        const from = angle;
        const to = angle + frac * Math.PI * 2;
        angle = to;
        // A 2px surface gap keeps adjacent fills from reading as one shape.
        const gap = 0.012;
        return (
          <path key={p} d={arc(from + gap, to - gap)} fill={COLORS[i]}>
            <title>{`${p}: $${yearTotal(p)}k, ${Math.round(frac * 100)}% of the year`}</title>
          </path>
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--ink-900)" fontFamily="var(--font-display)">${GRAND}k</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize="10.5" fill="var(--ink-400)" fontFamily="var(--font-body)">full year</text>
    </svg>
  );
}

function StackedChart() {
  const max = 450;
  const band = PLOT_W / QUARTERS.length;
  const barW = Math.min(62, band - 30);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label={`Stacked column chart by quarter. Totals: ${QUARTERS.map((q, i) => `${q} ${quarterTotal(i)}`).join(', ')} thousand dollars.`}>
      <Axis max={max} />
      {QUARTERS.map((q, qi) => {
        const x = PAD.l + band * qi + (band - barW) / 2;
        let cursor = PAD.t + PLOT_H;
        return (
          <g key={q}>
            {PRODUCTS.map((p, i) => {
              const h = (DATA[p][qi] / max) * PLOT_H;
              cursor -= h;
              return (
                <rect key={p} x={x} y={cursor + 1} width={barW} height={Math.max(h - 2, 1)} rx="2" fill={COLORS[i]}>
                  <title>{`${p}, ${q}: $${DATA[p][qi]}k`}</title>
                </rect>
              );
            })}
            <text x={x + barW / 2} y={cursor - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink-900)" fontFamily="var(--font-display)">{quarterTotal(qi)}</text>
            <text x={x + barW / 2} y={H - 12} textAnchor="middle" fontSize="11" fill="var(--ink-400)" fontFamily="var(--font-body)">{q}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DataTable() {
  return (
    <div className="bt-scroll">
      <table className="cc-table">
        <thead>
          <tr>
            <th>Product</th>
            {QUARTERS.map(q => <th key={q}>{q}</th>)}
            <th>Year</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {PRODUCTS.map((p, i) => (
            <tr key={p}>
              <td><span className="cc-swatch" style={{ background: COLORS[i] }} aria-hidden="true" />{p}</td>
              {DATA[p].map((v, qi) => <td key={qi} className="bt-tnum">{v}</td>)}
              <td className="bt-tnum"><b>{yearTotal(p)}</b></td>
              <td className="bt-tnum">{Math.round((yearTotal(p) / GRAND) * 100)}%</td>
            </tr>
          ))}
          <tr className="cc-table__total">
            <td>Total</td>
            {QUARTERS.map((q, qi) => <td key={q} className="bt-tnum">{quarterTotal(qi)}</td>)}
            <td className="bt-tnum"><b>{GRAND}</b></td>
            <td className="bt-tnum">100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function ChartChoice() {
  const [question, setQuestion] = useState<QuestionKey>('biggest');
  const [chart, setChart] = useState<ChartKey>('column');
  const [seen, setSeen] = useState<Set<string>>(new Set(['biggest:column']));

  const verdict = VERDICTS[question][chart];
  const q = QUESTIONS.find(x => x.key === question)!;
  const c = CHARTS.find(x => x.key === chart)!;

  function pick(nextQ: QuestionKey, nextC: ChartKey) {
    setQuestion(nextQ);
    setChart(nextC);
    setSeen(prev => new Set(prev).add(`${nextQ}:${nextC}`));
  }

  return (
    <div className="cc">
      <div className="cc__bar">
        <div className="cc__group">
          <span className="cc__label">The question</span>
          <div className="cc__pills">
            {QUESTIONS.map(x => (
              <button key={x.key} type="button" className="cc__pill" aria-pressed={question === x.key} onClick={() => pick(x.key, chart)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div className="cc__group">
          <span className="cc__label">The chart</span>
          <div className="cc__pills">
            {CHARTS.map(x => (
              <button key={x.key} type="button" className="cc__pill" aria-pressed={chart === x.key} onClick={() => pick(question, x.key)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="cc__asking">
        <span>Asking</span> {q.full}
      </p>

      <div className="cc__stage">
        <div className="cc__plot">
          {chart === 'column' && <ColumnChart />}
          {chart === 'line' && <LineChart />}
          {chart === 'pie' && <DonutChart />}
          {chart === 'stacked' && <StackedChart />}
          {chart === 'table' && <DataTable />}
          <p className="cc__caption">{c.label} · {c.shows} · revenue in $000s</p>
        </div>

        {chart !== 'table' && (
          <ul className="cc__legend">
            {PRODUCTS.map((p, i) => (
              <li key={p}>
                <span className="cc__swatch" style={{ background: COLORS[i] }} aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`cc__verdict cc__verdict--${verdict.v}`} aria-live="polite">
        <p className="cc__stamp">{VERDICT_LABEL[verdict.v]}</p>
        <p>{verdict.why}</p>
      </div>

      <p className="cc__tally">
        <span className="bt-tnum">{seen.size}</span> of 20 combinations tried. Every question has at least one chart
        that answers it cleanly, and at least one that gets it wrong.
      </p>
    </div>
  );
}
