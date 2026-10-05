import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BASELINE, CONFUSION, DEPTHS, TEST_LEAVERS, TEST_TOTAL } from './treeData';

// ─── How deep should the tree grow, and who did it catch? ─────────────────
// DepthDial: the same tree grown to every depth from 1 to "no limit", scored
// on the customers it learned from and on the ones it never saw. Drag the
// dial and watch the two lines come apart: the first one climbs towards
// perfect while the second falls back to the "always stays" line. That gap
// is overfitting, measured on this lab's own data.
//
// Caught: the depth-3 tree on the 1,409 test customers, as four piles, and
// what that means for a retention team with a phone.
//
// HeroPath: the one rule in the tree that says "leaves", shown a question at
// a time for the top of the page.
//
// Colours: the two lines are Blend's --cat-3 and --cat-1, checked with the
// dataviz validator (CVD ΔE 22.5, normal ΔE 25.2). Both lines also carry
// direct labels.

// The chart is drawn at the width it's shown at, so the lettering stays at
// its real size on a phone instead of shrinking with a fixed viewBox.
const MAX_W = 640;
const M = { l: 44, r: 14, t: 18, b: 40 };
const Y_MIN = 0.7;
const Y_MAX = 1;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const label = (d: number | null) => (d === null ? 'no limit' : String(d));

function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function story(i: number) {
  const d = DEPTHS[i];
  if (d.depth === 1) return 'One question. Even month-to-month customers mostly stay, so both piles say "stays", and the tree predicts "stays" for everyone. It is exactly as good as guessing.';
  if (d.depth === 2) return 'Two questions find the risky group, and catch the most leavers of any depth. But it also flags a lot of people who were never going to leave.';
  if (d.depth === 3) return 'The best score on new customers, and still small enough to read on one screen. This is the tree the lab uses.';
  if (d.depth !== null && d.depth <= 6) return 'Deeper, but no better on new customers. The extra questions are learning details that do not carry over.';
  if (d.depth !== null) return 'Now the two lines are pulling apart. It keeps getting better on the customers it learned from, and worse on everyone else. It is starting to memorise.';
  return `No limit: ${d.leaves.toLocaleString('en-NZ')} leaves for 5,634 customers, about four people per leaf. It has memorised them, and on new customers it is barely better than guessing "stays".`;
}

export function DepthDial() {
  const [i, setI] = useState(2);
  const d = DEPTHS[i];
  const reduce = useReducedMotion();
  const [plotRef, measured] = useWidth<HTMLDivElement>(MAX_W);
  const W = Math.max(300, Math.min(MAX_W, measured));
  const H = W < 480 ? 250 : 300;
  const x = (k: number) => M.l + (k / (DEPTHS.length - 1)) * (W - M.l - M.r);
  const y = (v: number) => H - M.b - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (H - M.t - M.b);
  const line = (key: 'train' | 'test') => DEPTHS.map((dd, k) => `${k ? 'L' : 'M'}${x(k)},${y(dd[key])}`).join(' ');
  const last = DEPTHS.length - 1;

  return (
    <div className="lr-chart">
      <div className="lr-field" style={{ marginTop: 0 }}>
        <div className="lr-field__head">
          <label htmlFor="depth-dial">max_depth: how many questions deep it may grow</label>
          <span className="lr-field__val">{label(d.depth)}</span>
        </div>
        <input id="depth-dial" type="range" min={0} max={DEPTHS.length - 1} value={i} onChange={e => setI(Number(e.target.value))} />
      </div>

      <div className="lr-chart__plot" ref={plotRef}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Scores at each depth. At depth ${label(d.depth)}: ${pct(d.train)} on the customers it learned from, ${pct(d.test)} on new customers. Guessing "stays" scores ${pct(BASELINE)}.`}>
          <g className="lr-axis" aria-hidden="true">
            {[0.7, 0.8, 0.9, 1].map(v => (
              <g key={v}>
                <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} />
                <text x={M.l - 8} y={y(v) + 4} textAnchor="end">{v * 100}%</text>
              </g>
            ))}
            {DEPTHS.map((dd, k) => (
              <text key={k} x={x(k)} y={H - M.b + 18} textAnchor="middle">{dd.depth === null ? '∞' : dd.depth}</text>
            ))}
            <text className="lr-axis__title" x={(M.l + W - M.r) / 2} y={H - 4} textAnchor="middle">max_depth (∞ = no limit)</text>
          </g>
          <line x1={M.l} x2={W - M.r} y1={y(BASELINE)} y2={y(BASELINE)} stroke="var(--ink-400)" strokeWidth={1.4} strokeDasharray="5 5" />
          <line x1={x(i)} x2={x(i)} y1={M.t} y2={H - M.b} stroke="var(--paper-300)" strokeWidth={10} strokeLinecap="round" />
          <text className="lr-linelabel" x={x(0) + 6} y={y(BASELINE) + 16}>always “stays”: 73.5%</text>
          <path d={line('train')} fill="none" stroke="var(--cat-3)" strokeWidth={2.5} strokeLinejoin="round" />
          <path d={line('test')} fill="none" stroke="var(--cat-1)" strokeWidth={2.5} strokeLinejoin="round" />
          <text className="lr-linelabel" x={x(last) - 10} y={y(DEPTHS[last].train) + 4} textAnchor="end">learned from</text>
          <text className="lr-linelabel" x={x(last) - 10} y={y(DEPTHS[last].test) - 12} textAnchor="end">new customers</text>
          <motion.circle cx={x(i)} cy={y(d.train)} r={6} fill="var(--cat-3)" stroke="var(--paper-0)" strokeWidth={2} initial={false} animate={{ cx: x(i), cy: y(d.train) }} transition={reduce ? { duration: 0 } : { duration: 0.25 }} />
          <motion.circle cx={x(i)} cy={y(d.test)} r={6} fill="var(--cat-1)" stroke="var(--paper-0)" strokeWidth={2} initial={false} animate={{ cx: x(i), cy: y(d.test) }} transition={reduce ? { duration: 0 } : { duration: 0.25 }} />
        </svg>
      </div>

      <ul className="lr-legend">
        <li><i className="is-line" style={{ background: 'var(--cat-3)' }} /> Customers it learned from (5,634)</li>
        <li><i className="is-line" style={{ background: 'var(--cat-1)' }} /> New customers it never saw (1,409)</li>
        <li><i className="is-line" style={{ background: 'var(--ink-400)' }} /> Guessing “stays” for everyone</li>
      </ul>

      <div className="dt-dialread" aria-live="polite">
        <div><b className="bt-tnum">{pct(d.train)}</b><span>on customers it learned from</span></div>
        <div><b className="bt-tnum">{pct(d.test)}</b><span>on new customers</span></div>
        <div><b className="bt-tnum">{d.caught} / {TEST_LEAVERS}</b><span>real leavers it caught</span></div>
        <div><b className="bt-tnum">{d.leaves.toLocaleString('en-NZ')}</b><span>leaves on the tree</span></div>
        <p>{story(i)}</p>
      </div>
    </div>
  );
}

export function Caught() {
  const flagged = CONFUSION.caught + CONFUSION.falseAlarm;
  const randomHits = Math.round((flagged * TEST_LEAVERS) / TEST_TOTAL);
  const tiles: { n: number; label: string; note: string; tone: 'good' | 'bad' | 'quiet' }[] = [
    { n: CONFUSION.caught, label: 'Caught', note: 'really left, and the tree said “leaves”', tone: 'good' },
    { n: CONFUSION.missed, label: 'Missed', note: 'really left, but the tree said “stays”', tone: 'bad' },
    { n: CONFUSION.falseAlarm, label: 'False alarms', note: 'really stayed, but the tree said “leaves”', tone: 'bad' },
    { n: CONFUSION.stayedRight, label: 'Rightly left alone', note: 'really stayed, and the tree said “stays”', tone: 'quiet' },
  ];
  return (
    <div className="dt-caught">
      <div className="dt-caught__grid">
        {tiles.map(t => (
          <div key={t.label} className={`dt-caught__tile is-${t.tone}`}>
            <b className="bt-tnum">{t.n.toLocaleString('en-NZ')}</b>
            <span className="dt-caught__label">{t.label}</span>
            <span>{t.note}</span>
          </div>
        ))}
      </div>
      <p className="dt-caught__so">
        <b>For the retention team:</b> the tree flags {flagged} of the 1,409 test customers. Call those {flagged} and{' '}
        {CONFUSION.caught} of them, about 7 in 10, really were about to leave. Call {flagged} customers at random and
        you would reach about {randomHits}. That is what the tree is worth, even though it misses {CONFUSION.missed}{' '}
        leavers.
      </p>
    </div>
  );
}

export function HeroPath() {
  const reduce = useReducedMotion();
  const steps = ['Month-to-month contract?', 'Fibre internet?', 'A customer for 14 months or less?'];
  return (
    <div className="dt-hero">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          className="dt-hero__q"
          initial={reduce ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: reduce ? 0 : 0.5 + i * 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="dt-hero__n">{i + 1}</span>
          <span>{s}</span>
          <b>Yes</b>
        </motion.div>
      ))}
      <motion.div
        className="dt-hero__end"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="dt-hero__dots" aria-hidden="true">
          {Array.from({ length: 10 }, (_, k) => <i key={k} className={k < 7 ? 'is-left' : undefined} />)}
        </div>
        <p><b>7 in 10</b> of these customers left.</p>
      </motion.div>
    </div>
  );
}
