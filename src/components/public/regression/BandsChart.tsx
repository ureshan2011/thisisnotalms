import { memo, useMemo, useRef, useState, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AGE_ONLY, MEAN_BMI, MEAN_CHILDREN, MODEL, PEOPLE, type Person } from './insuranceData';

// ─── Every person in the dataset, on one chart ────────────────────────────
// Age along the bottom, their medical bill up the side, one dot each: all
// 1,337 rows left after cleaning. The reader steps through four views of
// the same dots, and the argument of the whole lab happens in them:
//
//   1. Just the dots — three bands, not one cloud.
//   2. Coloured by smoker — the bands are mostly smoking.
//   3. The age-only line — one line through the gap, fits nobody. 0.10.
//   4. The four-input model — two lines, one per group. 0.80.
//
// The four-input model really has four inputs, so it cannot be drawn as one
// line on an age chart. Holding BMI and children at the dataset's averages
// turns it into two parallel lines, smoker and non-smoker, which is exactly
// what the smoker number means: the same line, lifted by $23,043.
//
// Colours are Blend's categorical pair for two series (--cat-3 blue, --cat-2
// orange), checked with the dataviz validator: CVD ΔE 29.9, normal-vision
// ΔE 36.6. The lines also carry direct labels, so nothing rests on colour.

type Mode = 'dots' | 'smoker' | 'age' | 'model';

const W = 640;
const H = 380;
const M = { l: 56, r: 18, t: 14, b: 42 };
const AGE_MIN = 16;
const AGE_MAX = 66;
const CH_MAX = 65000;

const x = (age: number) => M.l + ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * (W - M.l - M.r);
const y = (charges: number) => H - M.b - (charges / CH_MAX) * (H - M.t - M.b);

const BLUE = 'var(--cat-3)';
const ORANGE = 'var(--cat-2)';
const TEAL = 'var(--cat-1)';

const money = (n: number) => `$${Math.round(n).toLocaleString('en-NZ')}`;

const SHARED = MODEL.start + MODEL.bmi * MEAN_BMI + MODEL.children * MEAN_CHILDREN;
const lineAt = (smoker: 0 | 1) => (age: number) => SHARED + MODEL.age * age + MODEL.smoker * smoker;
const ageOnly = (age: number) => AGE_ONLY.start + AGE_ONLY.perYear * age;

function path(f: (age: number) => number) {
  return `M${x(18)},${y(f(18))} L${x(64)},${y(f(64))}`;
}

const MODES: { id: Mode; label: string }[] = [
  { id: 'dots', label: '1. Just the dots' },
  { id: 'smoker', label: '2. Colour by smoker' },
  { id: 'age', label: '3. Age-only line' },
  { id: 'model', label: '4. Four-input model' },
];

const READ: Record<Mode, { score: string; text: string }> = {
  dots: {
    score: '1,337',
    text: 'One dot per person. Look at the shape before anything else. It isn’t one cloud. It’s three bands, one on top of the other, and all three climb with age.',
  },
  smoker: {
    score: '274',
    text: 'Blue doesn’t smoke, orange does. The bottom band is nearly all non-smokers and the top band is all smokers. The middle band is a mix. Smokers with a high BMI sit at the very top.',
  },
  age: {
    score: '0.10',
    text: 'A model that only knows age draws one straight line. It runs through the gap between the bands and fits almost nobody. Tested on people it had never seen, it scores 0.10.',
  },
  model: {
    score: '0.80',
    text: 'Give the model smoker, BMI and children as well and, at average BMI and children, it draws two lines: one for smokers, $23,043 higher. Same test, same people: 0.80.',
  },
};

const SCORE_LABEL: Record<Mode, string> = { dots: 'people', smoker: 'smokers', age: 'score', model: 'score' };

/** All the dots. Memoised so a hover doesn't redraw 1,337 circles. */
const Dots = memo(function Dots({ coloured, data, r = 3 }: { coloured: boolean; data: Person[]; r?: number }) {
  return (
    <g>
      {data.map((p, i) => (
        <circle
          key={i}
          cx={x(p.age)}
          cy={y(p.charges)}
          r={r}
          fill={coloured ? (p.smoker ? ORANGE : BLUE) : TEAL}
          fillOpacity={0.62}
          stroke="var(--paper-0)"
          strokeWidth={0.6}
        />
      ))}
    </g>
  );
});

function Axes() {
  return (
    <g className="lr-axis" aria-hidden="true">
      {[0, 10000, 20000, 30000, 40000, 50000, 60000].map(v => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} />
          <text x={M.l - 8} y={y(v) + 4} textAnchor="end">{v === 0 ? '$0' : `$${v / 1000}k`}</text>
        </g>
      ))}
      {[20, 30, 40, 50, 60].map(a => (
        <text key={a} x={x(a)} y={H - M.b + 18} textAnchor="middle">{a}</text>
      ))}
      <text className="lr-axis__title" x={(M.l + W - M.r) / 2} y={H - 4} textAnchor="middle">Age</text>
      <text className="lr-axis__title" x={14} y={(M.t + H - M.b) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(M.t + H - M.b) / 2})`}>
        Charges
      </text>
    </g>
  );
}

export default function BandsChart() {
  const [mode, setMode] = useState<Mode>('dots');
  const [hover, setHover] = useState<Person | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const coloured = mode !== 'dots';
  const draw = reduce ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const };

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    const py = ((e.clientY - box.top) / box.height) * H;
    let best: Person | null = null;
    let bestD = 14 * 14;
    for (const p of PEOPLE) {
      const d = (x(p.age) - px) ** 2 + (y(p.charges) - py) ** 2;
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    setHover(best);
  }

  const counts = useMemo(() => ({ smokers: PEOPLE.filter(p => p.smoker).length }), []);
  const read = READ[mode];

  return (
    <div className="lr-chart">
      <div className="lr-chart__modes" role="group" aria-label="Choose a view of the chart">
        {MODES.map(m => (
          <button key={m.id} type="button" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="lr-chart__plot">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Scatter chart of age against medical charges for 1,337 people. ${read.text}`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <Axes />
          <Dots coloured={coloured} data={PEOPLE} />

          {mode === 'age' && (
            <g>
              <motion.path
                key="age"
                d={path(ageOnly)}
                stroke="var(--ink-900)"
                strokeWidth={2.5}
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={draw}
              />
              <text className="lr-linelabel" x={x(64) - 4} y={y(ageOnly(64)) - 10} textAnchor="end">age-only line</text>
            </g>
          )}

          {mode === 'model' && (
            <g>
              {([0, 1] as const).map(s => (
                <motion.path
                  key={`m${s}`}
                  d={path(lineAt(s))}
                  stroke={s ? ORANGE : BLUE}
                  strokeWidth={3}
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ ...draw, delay: reduce ? 0 : s * 0.25 }}
                />
              ))}
              <text className="lr-linelabel" x={x(64) - 4} y={y(lineAt(1)(64)) - 10} textAnchor="end">smoker line</text>
              <text className="lr-linelabel" x={x(64) - 4} y={y(lineAt(0)(64)) - 10} textAnchor="end">non-smoker line</text>
              <g aria-hidden="true">
                <line x1={x(30)} x2={x(30)} y1={y(lineAt(0)(30)) - 4} y2={y(lineAt(1)(30)) + 4} stroke="var(--ink-900)" strokeWidth={1.2} />
                <text className="lr-linelabel" x={x(30) + 8} y={(y(lineAt(0)(30)) + y(lineAt(1)(30))) / 2 + 4}>+ $23,043</text>
              </g>
            </g>
          )}

          {hover && (
            <circle
              cx={x(hover.age)}
              cy={y(hover.charges)}
              r={6}
              fill={coloured ? (hover.smoker ? ORANGE : BLUE) : TEAL}
              stroke="var(--paper-0)"
              strokeWidth={2}
              pointerEvents="none"
            />
          )}
        </svg>

        {hover && (
          <div className="lr-tip" style={{ left: `${(x(hover.age) / W) * 100}%`, top: `${(y(hover.charges) / H) * 100}%` }}>
            <b>{money(hover.charges)}</b>
            <br />
            <span>
              Age {hover.age} · BMI {hover.bmi} · {hover.smoker ? 'smokes' : 'doesn’t smoke'}
            </span>
          </div>
        )}
      </div>

      {coloured && (
        <ul className="lr-legend">
          <li><i style={{ background: BLUE }} /> Doesn’t smoke ({(PEOPLE.length - counts.smokers).toLocaleString('en-NZ')})</li>
          <li><i style={{ background: ORANGE }} /> Smokes ({counts.smokers})</li>
          {mode === 'age' && <li><i className="is-line" style={{ background: 'var(--ink-900)' }} /> Age-only model</li>}
        </ul>
      )}

      <div className="lr-chart__read" aria-live="polite">
        <div className="lr-chart__score bt-tnum">
          {read.score}
          <small>{SCORE_LABEL[mode]}</small>
        </div>
        <p>{read.text}</p>
      </div>
    </div>
  );
}

/** The hero picture: the same data, thinned, with the finished model drawn in. */
export function HeroBands() {
  const reduce = useReducedMotion();
  const sample = useMemo(() => PEOPLE.filter((_, i) => i % 3 === 0), []);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A preview of the lab's chart: medical charges rising with age in three bands, with the model's smoker and non-smoker lines drawn through them.">
      <Axes />
      <Dots coloured data={sample} r={3.4} />
      {([0, 1] as const).map(s => (
        <motion.path
          key={s}
          d={path(lineAt(s))}
          stroke={s ? ORANGE : BLUE}
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, delay: 0.6 + s * 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      <text className="lr-linelabel" x={x(64) - 4} y={y(lineAt(1)(64)) - 10} textAnchor="end">smokes</text>
      <text className="lr-linelabel" x={x(64) - 4} y={y(lineAt(0)(64)) - 10} textAnchor="end">doesn’t smoke</text>
    </svg>
  );
}
