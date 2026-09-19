import { useState } from 'react';

// ─── Four lifecycle shapes, side by side (MBI804 · Lesson 2) ──────────────
// The opening widget of the methodologies lesson. Four methods, one drawing
// each, and the same four meters underneath every one of them so switching
// between them is a comparison rather than four unrelated pictures.
//
// The meters are the argument the whole lesson makes: a methodology is a set
// of trades between how often you get feedback, how cheaply you can change
// your mind, how much governance you carry and how much you write down
// before anybody builds anything. Nothing is scored out of ten for quality,
// because none of these is better than the others in the abstract.
//
// It reuses the `cc` picker block in blend.css so it behaves exactly like
// the methodology chooser in Lesson 1, and takes its hue from the page.

type Key = 'waterfall' | 'spiral' | 'prince2' | 'agile';

const W = 560;
const H = 210;

/** Sequential phases, one release, and a change request with nowhere to go. */
function WaterfallShape() {
  const phases = ['Requirements', 'Design', 'Build', 'Test', 'Deploy'];
  const boxW = 94;
  const gap = 11;
  const stepY = 22;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="Waterfall: five phases stepping down from requirements to deploy, each feeding the next, with one release at the end. A change request arrow pointing back up the cascade is crossed out.">
      {phases.map((p, i) => {
        const x = 12 + i * (boxW + gap);
        const y = 34 + i * stepY;
        return (
          <g key={p}>
            <rect x={x} y={y} width={boxW} height="34" rx="9" fill="var(--accent-50)" stroke="var(--accent-200)" />
            <text x={x + boxW / 2} y={y + 22} textAnchor="middle" fontSize="11" fill="var(--accent-700)" fontFamily="var(--font-body)">{p}</text>
            {i < phases.length - 1 && (
              <path d={`M${x + boxW} ${y + 17} L${x + boxW + gap} ${y + 17} L${x + boxW + gap} ${y + stepY + 17}`}
                fill="none" stroke="var(--ink-300)" strokeWidth="1.2" />
            )}
          </g>
        );
      })}

      {/* The return path everybody assumes exists. Phases are signed off, so
          going back means re-opening a sign-off, which is a contract event
          rather than a task. */}
      <path d="M120 44 C 210 8, 330 8, 430 40" fill="none" stroke="var(--ink-300)" strokeWidth="1.2" strokeDasharray="4 5" />
      <g transform="translate(275 16)">
        <circle r="9" fill="var(--paper-0)" stroke="var(--red-500)" strokeWidth="1.4" />
        <path d="M-3.4 -3.4 L3.4 3.4 M3.4 -3.4 L-3.4 3.4" stroke="var(--red-500)" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <text x="275" y="42" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">a change here re-opens a signed phase</text>

      <circle cx="530" cy="160" r="12" fill="var(--accent-500)" />
      <text x="530" y="164" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="var(--font-display)">1</text>
      <text x="530" y="188" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-body)">release</text>
    </svg>
  );
}

/** Boehm's spiral: the same four activities, further out each time. */
function SpiralShape() {
  const cx = 168;
  const cy = 104;
  // An Archimedean spiral, two and a half turns, drawn as one path.
  const pts: string[] = [];
  for (let t = 0; t <= Math.PI * 5; t += 0.06) {
    const r = 9 + t * 8.4;
    const x = cx + r * Math.cos(t - Math.PI / 2);
    const y = cy + r * Math.sin(t - Math.PI / 2) * 0.82;
    pts.push(`${pts.length === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const quads: [string, string, number, number, string][] = [
    ['Determine objectives', 'and the constraints on them', 168, 16, 'middle'],
    ['Identify and resolve risks', 'prototype the scariest part', 300, 104, 'start'],
    ['Develop and verify', 'build this round’s increment', 168, 198, 'middle'],
    ['Plan the next cycle', 'and decide whether to fund it', 36, 104, 'end'],
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="Spiral model: a spiral widening outward through four repeating quadrants — determine objectives, identify and resolve risks, develop and verify, plan the next cycle. Each loop costs more than the last, and the radius is cumulative spend.">
      <line x1={cx} y1="24" x2={cx} y2="186" stroke="var(--border-subtle)" strokeWidth="1" />
      <line x1="40" y1={cy} x2="296" y2={cy} stroke="var(--border-subtle)" strokeWidth="1" />
      <path d={pts.join(' ')} fill="none" stroke="var(--accent-500)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={cx} cy={cy - 8} r="3.4" fill="var(--ink-900)" />

      {quads.map(([title, sub, x, y, anchor]) => (
        <g key={title}>
          <text x={x} y={y} textAnchor={anchor as 'start' | 'middle' | 'end'} fontSize="10.5" fontWeight="700" fontFamily="var(--font-display)" fill="var(--ink-900)">{title}</text>
          <text x={x} y={y + 13} textAnchor={anchor as 'start' | 'middle' | 'end'} fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">{sub}</text>
        </g>
      ))}

      <line x1="380" y1="34" x2="380" y2="176" stroke="var(--border-subtle)" strokeWidth="1" />
      <text x="392" y="38" fontSize="9.5" letterSpacing="1.1" fontFamily="var(--font-body)" fill="var(--ink-400)">RISK REMAINING</text>
      {[
        [56, 74, 'Cycle 1'],
        [92, 46, 'Cycle 2'],
        [128, 26, 'Cycle 3'],
        [164, 12, 'Cycle 4'],
      ].map(([y, w, label]) => (
        <g key={label as string}>
          <rect x="392" y={y as number} width={w as number} height="13" rx="6.5" fill="var(--accent-400)" />
          <text x={(392 + (w as number) + 8)} y={(y as number) + 10} fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">{label}</text>
        </g>
      ))}
      <text x="392" y="192" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">every loop buys down the biggest risk left</text>
    </svg>
  );
}

/** Stages, a board above them, and a go/no-go at every boundary. */
function Prince2Shape() {
  const stages = ['Initiation', 'Stage 1', 'Stage 2', 'Closure'];
  const boxW = 98;
  const gap = 42;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="PRINCE2: a project board running across the top, four stages below it, and a go or no-go decision diamond at each stage boundary where the business case is re-justified. A tolerance band shows the range the manager may move inside without asking.">
      <text x="12" y="20" fontSize="9.5" letterSpacing="1.2" fontFamily="var(--font-body)" fill="var(--ink-400)">PROJECT BOARD · EXECUTIVE, SENIOR USER, SENIOR SUPPLIER</text>
      <rect x="12" y="27" width="536" height="13" rx="6.5" fill="var(--accent-100)" />

      {/* The tolerance band: inside it the project manager just gets on with
          it, and the board hears nothing. */}
      <rect x="12" y="66" width="536" height="52" rx="10" fill="var(--paper-200)" opacity="0.7" />
      <text x="540" y="62" textAnchor="end" fontSize="9" letterSpacing="1" fontFamily="var(--font-body)" fill="var(--ink-400)">TOLERANCE · TIME, COST, SCOPE, QUALITY, RISK, BENEFIT</text>

      {stages.map((s, i) => {
        const x = 12 + i * (boxW + gap);
        return (
          <g key={s}>
            <rect x={x} y="74" width={boxW} height="38" rx="11" fill="var(--accent-50)" stroke="var(--accent-200)" />
            <text x={x + boxW / 2} y="98" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--accent-700)" fontFamily="var(--font-display)">{s}</text>
            <line x1={x + boxW / 2} y1="40" x2={x + boxW / 2} y2="72" stroke="var(--ink-300)" strokeWidth="1" strokeDasharray="3 4" />
            {i < stages.length - 1 && (
              <g>
                <path d={`M${x + boxW + gap / 2} 78 L${x + boxW + gap / 2 + 15} 93 L${x + boxW + gap / 2} 108 L${x + boxW + gap / 2 - 15} 93 Z`} fill="var(--accent-500)" />
                <text x={x + boxW + gap / 2} y="132" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-body)">go /</text>
                <text x={x + boxW + gap / 2} y="143" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-body)">no-go</text>
              </g>
            )}
          </g>
        );
      })}
      <text x="280" y="172" textAnchor="middle" fontSize="10" fontFamily="var(--font-body)" fill="var(--ink-600)">the business case is re-justified before each stage is funded</text>
      <text x="280" y="190" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">breach a tolerance and the board is pulled in — that is management by exception</text>
    </svg>
  );
}

/** A loop that keeps turning, stacking a usable increment each time. */
function AgileShape() {
  const cx = 126;
  const cy = 108;
  const r = 58;
  const arc = (from: number, to: number) => {
    const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x1, y1] = p(from);
    const [x2, y2] = p(to);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };
  const labels: [string, number, number, string][] = [
    ['Plan', cx, cy - r - 12, 'middle'],
    ['Build', cx + r + 12, cy + 4, 'start'],
    ['Review', cx, cy + r + 20, 'middle'],
    ['Adapt', cx - r - 12, cy + 4, 'end'],
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="Agile: a loop of plan, build, review and adapt turning every one to four weeks, with a usable increment stacking up after each pass and the backlog re-ordered between passes.">
      <text x="12" y="20" fontSize="9.5" letterSpacing="1.2" fontFamily="var(--font-body)" fill="var(--ink-400)">BACKLOG, RE-ORDERED EVERY ITERATION</text>
      <rect x="12" y="27" width="536" height="11" rx="5.5" fill="var(--accent-100)" />

      {[0, 1, 2, 3].map(i => (
        <path key={i} d={arc(-Math.PI / 2 + i * (Math.PI / 2) + 0.16, -Math.PI / 2 + (i + 1) * (Math.PI / 2) - 0.16)}
          fill="none" stroke="var(--accent-400)" strokeWidth="6" strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r="27" fill="var(--accent-50)" stroke="var(--accent-200)" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="11" fontWeight="800" fontFamily="var(--font-display)" fill="var(--accent-700)">1–4</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fontFamily="var(--font-body)" fill="var(--accent-600)">weeks</text>
      {labels.map(([t, x, y, anchor]) => (
        <text key={t} x={x} y={y} textAnchor={anchor as 'start' | 'middle' | 'end'} fontSize="11" fontWeight="700" fontFamily="var(--font-display)" fill="var(--ink-900)">{t}</text>
      ))}

      {/* Increments stacking: each pass leaves something usable behind. */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x={300 + i * 62} y={166 - i * 22} width="50" height={20 + i * 22} rx="7" fill={i === 3 ? 'var(--accent-500)' : 'var(--accent-200)'} />
          <text x={325 + i * 62} y="200" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">{`inc ${i + 1}`}</text>
        </g>
      ))}
      <text x="300" y="70" fontSize="10.5" fontWeight="700" fontFamily="var(--font-display)" fill="var(--ink-900)">Something usable, every pass</text>
      <text x="300" y="86" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">not a prototype, not a phase — shippable</text>
    </svg>
  );
}

interface Method {
  key: Key;
  label: string;
  year: string;
  asking: string;
  caption: string;
  /** Feedback, change tolerance, governance weight, up-front documentation. */
  meters: [number, number, number, number];
  note: string;
}

const METHODS: Method[] = [
  {
    key: 'waterfall',
    label: 'Waterfall',
    year: 'Royce, 1970',
    asking: 'One pass through requirements, design, build, test and deploy — each phase signed off before the next begins.',
    caption: 'Waterfall · five sequential phases, one release, and change priced as a variation',
    meters: [12, 10, 45, 95],
    note: 'Everything is decided while the team knows least, and proved while there is least time left to act on it. In exchange you get a plan somebody can audit from day one.',
  },
  {
    key: 'spiral',
    label: 'Spiral',
    year: 'Boehm, 1986',
    asking: 'Repeat the same four activities in widening loops, and spend each loop buying down the biggest risk still standing.',
    caption: 'Spiral · four quadrants per loop, with the riskiest unknown prototyped first',
    meters: [55, 55, 60, 70],
    note: 'The first model to make risk the thing that drives the plan rather than a register beside it. Expensive to run, and it needs somebody who can actually do risk analysis — which is why it turns up on aerospace and defence work more than on a website.',
  },
  {
    key: 'prince2',
    label: 'PRINCE2',
    year: 'UK Government, 1996',
    asking: 'Govern the project in stages, with a board that re-justifies the business case before it funds the next one.',
    caption: 'PRINCE2 · management by stages, with a go/no-go at every boundary',
    meters: [40, 40, 100, 80],
    note: 'A management method, not a delivery method: it never says how the build is sequenced. Choose it and you still choose Waterfall or Agile underneath it — which is why the two so often appear together.',
  },
  {
    key: 'agile',
    label: 'Agile',
    year: 'Manifesto, 2001',
    asking: 'Turn a short loop over and over, and leave something usable behind every time round.',
    caption: 'Agile · plan, build, review, adapt — every one to four weeks',
    meters: [95, 95, 30, 25],
    note: 'Not the absence of a plan. A plan re-made every fortnight against what the last fortnight actually taught you, which only works if somebody with authority turns up to look at the increment.',
  },
];

const METER_NAMES = [
  ['Feedback loop', 'How often the outside world sees the real thing'],
  ['Change tolerance', 'What it costs to change your mind in week twelve'],
  ['Governance weight', 'How much formal decision-making the method carries'],
  ['Up-front documentation', 'How much is written down before anybody builds'],
];

export default function LifecycleGallery() {
  const [key, setKey] = useState<Key>('waterfall');
  const [seen, setSeen] = useState<Set<Key>>(new Set(['waterfall']));
  const m = METHODS.find(x => x.key === key)!;

  function pick(next: Key) {
    setKey(next);
    setSeen(prev => new Set(prev).add(next));
  }

  return (
    <div className="cc">
      <div className="cc__bar">
        <div className="cc__group">
          <span className="cc__label">The methodology</span>
          <div className="cc__pills">
            {METHODS.map(x => (
              <button key={x.key} type="button" className="cc__pill" aria-pressed={key === x.key} onClick={() => pick(x.key)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="cc__asking">
        <span>{m.year}</span> {m.asking}
      </p>

      <div className="cc__stage">
        <div className="cc__plot">
          <div className="cc__diagram">
            {key === 'waterfall' && <WaterfallShape />}
            {key === 'spiral' && <SpiralShape />}
            {key === 'prince2' && <Prince2Shape />}
            {key === 'agile' && <AgileShape />}
          </div>
          <p className="cc__caption">{m.caption}</p>
        </div>
      </div>

      {/* The same four meters under every method, so switching is a
          comparison. None of them is a quality score. */}
      <div className="bt-meters" aria-live="polite">
        {METER_NAMES.map(([name, ask], i) => (
          <div key={name} className="bt-meter">
            <div className="bt-meter__head">
              <span className="bt-meter__name">{name}</span>
              <span className="bt-meter__val bt-tnum">{m.meters[i]}</span>
            </div>
            <span className="bt-bar"><i style={{ width: `${m.meters[i]}%` }} /></span>
            <p className="bt-meter__note">{ask}</p>
          </div>
        ))}
      </div>

      <div className="bt-verdict" style={{ marginTop: 18 }} aria-live="polite">
        <strong>{m.label}</strong>
        {m.note}
      </div>

      <p className="cc__tally">
        <span className="bt-tnum">{seen.size}</span> of 4 seen. No bar here is a mark out of a hundred — they are the
        trades each method makes, and a project decides which trade it can afford.
      </p>
    </div>
  );
}
