import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart, Area,
} from 'recharts';
import BrandMark from '../components/ui/BrandMark';

// ─── MBI804 · Project Cost Management (Not a LMS) ───────────────────────────
// Seven scroll-based sections covering PMI Cost Management (CP1→CP3 + MC1
// preview) anchored in the running "SecurePay NZ" scenario. All interactive
// simulations run in the browser — no login, no data collected.

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Shared animation helpers ────────────────────────────────────────────────
function Reveal({
  children, delay = 0, y = 48, className = '',
}: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const item = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };

function SectionHead({ eyebrow, title, sub, dark = false }: {
  eyebrow?: string; title: React.ReactNode; sub?: React.ReactNode; dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      {eyebrow && <p className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]">{eyebrow}</p>}
      <h2 className={`text-[32px] font-semibold leading-[1.08] tracking-tight sm:text-[44px] ${dark ? 'text-white' : 'text-[#1d1d1f]'}`}>{title}</h2>
      {sub && <p className={`mx-auto mt-4 max-w-2xl text-[19px] leading-relaxed ${dark ? 'text-white/70' : 'text-[#6e6e73]'}`}>{sub}</p>}
    </div>
  );
}

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold" style={{ background: color + '1a', color }}>
      {children}
    </span>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[28px] border border-black/[0.07] bg-white p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

// ─── Section 1: Hook counter ─────────────────────────────────────────────────
function HookCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= 75) return;
    const t = setTimeout(() => setCount(c => Math.min(c + 2, 75)), 28);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <div className="rounded-[28px] bg-[#1d1d1f] p-10 text-center sm:p-14">
      <p className="text-[96px] font-semibold leading-none tracking-[-0.04em] text-[#0071e3] sm:text-[128px]">{count}%</p>
      <p className="mt-4 text-[22px] font-medium text-white">of IT projects exceed their original budget</p>
      <p className="mt-3 text-[16px] text-white/50">Cost overruns are the rule, not the exception. This lesson shows you how to be the exception.</p>
    </div>
  );
}

// ─── Process flow ────────────────────────────────────────────────────────────
const PROCESSES = [
  { code: 'CP1', name: 'Plan Cost Management', icon: '📋', desc: 'Set the rules', output: 'Cost Management Plan — defines how costs will be estimated, budgeted, managed, and controlled.' },
  { code: 'CP2', name: 'Estimate Costs', icon: '🧮', desc: 'Price the work', output: 'Activity Cost Estimates — quantified costs per work item, plus the basis of estimates.' },
  { code: 'CP3', name: 'Determine Budget', icon: '📊', desc: 'Build the baseline', output: 'Cost Performance Baseline — the approved time-phased S-curve used to measure performance.' },
  { code: 'MC1', name: 'Control Costs', icon: '🎯', desc: 'Track & correct', output: 'Work Performance Information & cost forecasts via EVM. Covered in the next lecture.' },
];

function ProcessFlow() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {PROCESSES.map((p, i) => (
          <button
            key={p.code}
            onClick={() => setSel(sel === i ? null : i)}
            className={`rounded-2xl border-2 p-4 text-left transition hover:-translate-y-1 hover:shadow-lg ${sel === i ? 'border-[#0071e3] bg-[#0071e3]/[0.06]' : 'border-black/[0.08] bg-white hover:border-[#0071e3]/40'}`}
          >
            <div className="mb-2 text-2xl">{p.icon}</div>
            <p className="text-[11px] font-bold tracking-widest text-[#0071e3]">{p.code}</p>
            <p className="mt-0.5 text-[14px] font-semibold text-[#1d1d1f]">{p.name}</p>
            <p className="mt-1 text-[12px] text-[#6e6e73]">{p.desc}</p>
          </button>
        ))}
      </div>
      {sel !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-[#0071e3]/20 bg-[#0071e3]/[0.05] p-4">
          <p className="text-[14px] text-[#1d1d1f]"><span className="font-semibold">Output: </span>{PROCESSES[sel].output}</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Warm-up quiz ────────────────────────────────────────────────────────────
const WARMUP_Qs = [
  { q: 'Which process produces the Cost Performance Baseline?', opts: ['CP1 — Plan Cost Management', 'CP2 — Estimate Costs', 'CP3 — Determine Budget', 'MC1 — Control Costs'], a: 2, fb: 'Determining the Budget (CP3) aggregates estimates and reserves into the time-phased Cost Performance Baseline.' },
  { q: 'What type of cost is office rent for a project team?', opts: ['Direct cost', 'Indirect cost', 'Sunk cost', 'Intangible cost'], a: 1, fb: 'Rent is shared overhead not traceable to a single deliverable — an indirect (overhead) cost.' },
  { q: 'A sunk cost is…', opts: ['A cost that recurs monthly', 'Money already spent that cannot be recovered', 'A reserve held by senior management', 'A cost paid only on project success'], a: 1, fb: 'Sunk costs are already incurred and unrecoverable — irrelevant to go/no-go decisions.' },
];

function MiniQuiz({ questions }: { questions: typeof WARMUP_Qs }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const done = Object.keys(answers).length === questions.length;
  const score = Object.entries(answers).filter(([qi, ai]) => questions[+qi].a === ai).length;
  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <div key={qi}>
          <p className="mb-3 text-[15px] font-semibold text-[#1d1d1f]">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0071e3] text-[12px] font-bold text-white">{qi + 1}</span>
            {q.q}
          </p>
          <div className="space-y-2">
            {q.opts.map((opt, oi) => {
              const picked = answers[qi];
              const isAnswered = picked !== undefined;
              const isCorrect = oi === q.a;
              const isPicked = picked === oi;
              let cls = 'w-full rounded-xl border px-4 py-3 text-left text-[14px] transition font-medium';
              if (!isAnswered) cls += ' border-black/[0.1] bg-white hover:border-[#0071e3]/40 hover:bg-[#0071e3]/[0.04] cursor-pointer';
              else if (isCorrect) cls += ' border-[#30d158] bg-[#30d158]/[0.08] text-[#248a3d] cursor-default';
              else if (isPicked) cls += ' border-[#ff375f] bg-[#ff375f]/[0.08] text-[#d70015] cursor-default';
              else cls += ' border-black/[0.06] bg-white/60 text-[#6e6e73] cursor-default';
              return (
                <button key={oi} className={cls} disabled={isAnswered}
                  onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}>
                  {opt}
                  {isAnswered && isCorrect && <span className="float-right">✓</span>}
                  {isAnswered && isPicked && !isCorrect && <span className="float-right">✗</span>}
                </button>
              );
            })}
          </div>
          {answers[qi] !== undefined && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-2 rounded-xl px-4 py-2.5 text-[13.5px] leading-relaxed ${answers[qi] === q.a ? 'bg-[#30d158]/[0.08] text-[#248a3d]' : 'bg-[#ff375f]/[0.08] text-[#d70015]'}`}>
              {q.fb}
            </motion.p>
          )}
        </div>
      ))}
      {done && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[#1d1d1f] p-5 text-center text-white">
          <p className="text-[20px] font-semibold">Score: {score} / {questions.length}</p>
          <p className="mt-1 text-[14px] text-white/60">{score === questions.length ? '🎉 Perfect start!' : "Keep going — you'll lock these in by the end."}</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Section 2: Flashcards ───────────────────────────────────────────────────
const FLASHCARDS = [
  { icon: '💵', term: 'Tangible Costs', tag: 'Measurable in money', def: 'Costs that can be directly expressed in dollars.', ex: 'Software licenses purchased for NZ$12,000.' },
  { icon: '🤝', term: 'Intangible Costs', tag: 'Hard to quantify', def: 'Benefits or costs that resist precise dollar measurement.', ex: 'Improved customer trust after launching a secure login system.' },
  { icon: '🎯', term: 'Direct Costs', tag: 'Traceable to project', def: 'Costs charged directly and solely to this project.', ex: 'Developer salaries charged directly to the project.' },
  { icon: '🏢', term: 'Indirect Costs', tag: 'Shared overhead', def: 'Shared costs spread across multiple projects.', ex: 'Office overhead shared across 4 concurrent projects.' },
  { icon: '🪙', term: 'Sunk Cost', tag: 'Already spent', def: 'Money already spent and unrecoverable — must be ignored in future decisions.', ex: 'NZ$80,000 spent on a failed architecture — irrelevant to the go/no-go decision.' },
];

function FlashCard({ icon, term, tag, def, ex }: typeof FLASHCARDS[0]) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="perspective-1000 h-52 cursor-pointer" onClick={() => setFlipped(f => !f)} role="button" tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped(f => !f)}>
      <div className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[24px] bg-[#1d1d1f] p-5 text-center [backface-visibility:hidden]">
          <span className="text-4xl">{icon}</span>
          <p className="mt-3 text-[17px] font-semibold text-white">{term}</p>
          <p className="mt-3 text-[12px] text-white/40">tap to flip ↻</p>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center rounded-[24px] border border-[#0071e3]/30 bg-white p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0071e3]">{tag}</p>
          <p className="text-[14px] font-semibold leading-snug text-[#1d1d1f]">{def}</p>
          <p className="mt-2.5 text-[13px] italic leading-relaxed text-[#6e6e73]">{ex}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Drag & drop cost categoriser ────────────────────────────────────────────
const DD_ITEMS = [
  { label: 'Cloud hosting fees', cat: 'Direct' },
  { label: 'Team morale boost', cat: 'Intangible' },
  { label: 'Project manager salary', cat: 'Direct' },
  { label: 'Shared HR system cost', cat: 'Indirect' },
  { label: 'Previously paid consultant fee', cat: 'Sunk' },
  { label: 'New laptop purchase', cat: 'Tangible' },
];
const DD_CATS = ['Direct', 'Indirect', 'Tangible', 'Intangible', 'Sunk'];

function DragDropExercise() {
  const [buckets, setBuckets] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(DD_CATS.map(c => [c, []]))
  );
  const [tray, setTray] = useState(DD_ITEMS.map(d => d.label).sort(() => Math.random() - 0.5));
  const [feedback, setFeedback] = useState<Record<string, boolean> | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  function drop(to: string) {
    if (!dragging) return;
    setFeedback(null);
    if (to === 'tray') {
      setTray(t => [...t, dragging]);
      setBuckets(b => {
        const nb = { ...b };
        for (const k in nb) nb[k] = nb[k].filter(x => x !== dragging);
        return nb;
      });
    } else {
      setBuckets(b => {
        const nb = { ...b };
        for (const k in nb) nb[k] = nb[k].filter(x => x !== dragging);
        nb[to] = [...nb[to], dragging];
        return nb;
      });
      setTray(t => t.filter(x => x !== dragging));
    }
    setDragging(null);
  }

  function check() {
    const result: Record<string, boolean> = {};
    for (const cat of DD_CATS) {
      for (const label of buckets[cat]) {
        const item = DD_ITEMS.find(d => d.label === label);
        result[label] = item?.cat === cat;
      }
    }
    setFeedback(result);
  }

  function reset() {
    setBuckets(Object.fromEntries(DD_CATS.map(c => [c, []])));
    setTray(DD_ITEMS.map(d => d.label).sort(() => Math.random() - 0.5));
    setFeedback(null);
  }

  const correct = feedback ? Object.values(feedback).filter(Boolean).length : 0;

  return (
    <div>
      <div
        className="mb-4 flex min-h-[60px] flex-wrap gap-2 rounded-2xl bg-[#f5f5f7] p-4"
        onDragOver={e => e.preventDefault()}
        onDrop={() => drop('tray')}
      >
        {tray.length === 0 && <p className="text-[13px] text-[#6e6e73]">All items placed — submit to check.</p>}
        {tray.map(label => (
          <div key={label} draggable
            onDragStart={() => setDragging(label)}
            className="cursor-grab rounded-full border border-[#1d1d1f]/20 bg-white px-4 py-1.5 text-[13px] font-medium text-[#1d1d1f] active:cursor-grabbing">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {DD_CATS.map(cat => (
          <div key={cat}
            onDragOver={e => e.preventDefault()}
            onDrop={() => drop(cat)}
            className="min-h-[100px] rounded-2xl border-2 border-dashed border-black/[0.1] bg-white p-3 transition hover:border-[#0071e3]/40">
            <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#0071e3]">{cat}</p>
            <div className="space-y-1.5">
              {buckets[cat].map(label => (
                <div key={label} draggable onDragStart={() => setDragging(label)}
                  className={`cursor-grab rounded-xl px-2.5 py-1.5 text-[12px] font-medium ${
                    feedback
                      ? feedback[label] ? 'bg-[#30d158]/[0.12] text-[#248a3d]' : 'bg-[#ff375f]/[0.10] text-[#d70015]'
                      : 'bg-[#f5f5f7] text-[#1d1d1f]'
                  }`}>
                  {label}
                  {feedback && (feedback[label] ? ' ✓' : ' ✗')}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={check} className="rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]">Check answers</button>
        <button onClick={reset} className="rounded-full border border-black/[0.1] px-6 py-2.5 text-[15px] font-medium text-[#1d1d1f] transition hover:border-[#0071e3]/40">Reset</button>
      </div>
      {feedback && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`mt-3 rounded-xl px-4 py-2.5 text-[14px] ${correct === DD_ITEMS.length ? 'bg-[#30d158]/[0.08] text-[#248a3d]' : 'bg-[#ff9f0a]/[0.1] text-[#7a4a00]'}`}>
          <strong>{correct} / {DD_ITEMS.length} correct.</strong> {correct === DD_ITEMS.length ? 'Perfect categorisation!' : 'Green = right bucket, red = wrong. Remember: direct = traceable to this project; indirect = shared overhead; sunk = already spent.'}
        </motion.p>
      )}
    </div>
  );
}

// ─── Section 3: Cost Management Plan form ────────────────────────────────────
function CostPlanForm() {
  const [accuracy, setAccuracy] = useState('±5%');
  const [units, setUnits] = useState('NZD');
  const [threshold, setThreshold] = useState('±10% variance triggers review');
  const [rules, setRules] = useState('Earned Value Management (EVM)');
  const [format, setFormat] = useState('Fortnightly dashboard');
  const [cadence, setCadence] = useState('Every second Friday by 4pm');
  const [shown, setShown] = useState(false);

  const fields = [
    { label: 'Level of accuracy', value: accuracy },
    { label: 'Units of measure', value: units },
    { label: 'Control threshold', value: threshold },
    { label: 'Performance measurement', value: rules },
    { label: 'Reporting format', value: format },
    { label: 'Reporting cadence', value: cadence },
  ];

  const selectCls = 'w-full rounded-xl border border-black/[0.12] bg-white px-3 py-2.5 text-[14px] text-[#1d1d1f] focus:border-[#0071e3] focus:outline-none';
  const inputCls = selectCls;
  const lblCls = 'mb-1.5 block text-[13px] font-semibold text-[#1d1d1f]';

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={lblCls}>Level of accuracy</label>
          <select className={selectCls} value={accuracy} onChange={e => setAccuracy(e.target.value)}>
            <option>±1% (definitive)</option><option>±5%</option><option>±10% (early planning)</option>
          </select>
        </div>
        <div>
          <label className={lblCls}>Units of measure</label>
          <select className={selectCls} value={units} onChange={e => setUnits(e.target.value)}>
            <option value="NZD">NZD — New Zealand Dollar</option>
            <option value="AUD">AUD — Australian Dollar</option>
            <option value="USD">USD — US Dollar</option>
          </select>
        </div>
        <div>
          <label className={lblCls}>Control threshold</label>
          <input className={inputCls} value={threshold} onChange={e => setThreshold(e.target.value)} />
        </div>
        <div>
          <label className={lblCls}>Performance measurement rules</label>
          <select className={selectCls} value={rules} onChange={e => setRules(e.target.value)}>
            <option>Earned Value Management (EVM)</option>
            <option>Simple % Complete</option>
            <option>Milestone-based</option>
          </select>
        </div>
        <div>
          <label className={lblCls}>Reporting format</label>
          <div className="flex flex-col gap-2 pt-1">
            {['Weekly status report', 'Fortnightly dashboard', 'Monthly summary'].map(f => (
              <label key={f} className="flex cursor-pointer items-center gap-2.5 text-[14px] text-[#1d1d1f]">
                <input type="radio" name="fmt" value={f} checked={format === f} onChange={() => setFormat(f)} className="accent-[#0071e3]" />
                {f}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className={lblCls}>Reporting cadence</label>
          <input className={inputCls} value={cadence} onChange={e => setCadence(e.target.value)} />
        </div>
      </div>
      <button onClick={() => setShown(true)} className="mt-6 rounded-full bg-[#0071e3] px-7 py-3 text-[15px] font-medium text-white transition hover:bg-[#0077ed]">
        Preview plan document
      </button>
      {shown && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-2xl border border-black/[0.1] bg-white">
          <div className="border-b border-black/[0.06] bg-[#f5f5f7] px-6 py-4">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#6e6e73]">Cost Management Plan · SecurePay NZ · CONFIDENTIAL</p>
            <p className="mt-0.5 text-[18px] font-semibold text-[#1d1d1f]">Payment Gateway Integration Project</p>
          </div>
          <div className="divide-y divide-black/[0.05] px-6">
            {fields.map(f => (
              <div key={f.label} className="flex items-center justify-between gap-4 py-3.5">
                <span className="text-[14px] text-[#6e6e73]">{f.label}</span>
                <span className="text-[14px] font-semibold text-[#1d1d1f]">{f.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Section 4: Estimate type slider ─────────────────────────────────────────
const EST_TYPES = [
  { type: 'ROM', name: 'Rough Order of Magnitude', range: '−50% to +100%', when: 'At project initiation, before any detail exists.', why: 'To decide whether the project is worth pursuing at all.', ex: 'The CTO says "this new HR system will cost roughly $500K–$1M."' },
  { type: 'Budgetary', name: 'Budgetary Estimate', range: '−10% to +25%', when: 'During planning, roughly a year out.', why: 'To allocate funds and set the working budget.', ex: 'One year out, the PM estimates $720K for budget allocation.' },
  { type: 'Definitive', name: 'Definitive Estimate', range: '−5% to +10%', when: 'Late in planning, months before delivery.', why: 'To finalise the baseline with high confidence.', ex: 'Three months before delivery: total cost estimated at $695,000 ± 5%.' },
];

function EstimateSlider() {
  const [idx, setIdx] = useState(0);
  const e = EST_TYPES[idx];
  return (
    <div>
      <div className="mb-6 flex gap-2">
        {EST_TYPES.map((t, i) => (
          <button key={t.type} onClick={() => setIdx(i)}
            className={`flex-1 rounded-full py-2.5 text-[14px] font-semibold transition ${i === idx ? 'bg-[#0071e3] text-white' : 'border border-black/[0.1] text-[#6e6e73] hover:border-[#0071e3]/40'}`}>
            {t.type}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: EASE }}>
          <div className="rounded-2xl border border-black/[0.07] bg-[#f5f5f7] p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#0071e3]">{e.type}</p>
            <p className="mt-1 text-[22px] font-semibold text-[#1d1d1f]">{e.name}</p>
            <p className="mt-2 inline-block rounded-full bg-[#ff9f0a]/[0.12] px-3 py-1 text-[13px] font-semibold text-[#7a4a00]">Accuracy: {e.range}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><p className="text-[12px] font-bold uppercase tracking-wide text-[#0071e3]">When</p><p className="mt-1 text-[14px] text-[#1d1d1f]">{e.when}</p></div>
              <div><p className="text-[12px] font-bold uppercase tracking-wide text-[#0071e3]">Why</p><p className="mt-1 text-[14px] text-[#1d1d1f]">{e.why}</p></div>
            </div>
            <div className="mt-4 rounded-xl border border-[#0071e3]/20 bg-white p-4">
              <p className="text-[13px] text-[#6e6e73]"><strong className="text-[#1d1d1f]">SecurePay NZ example: </strong>{e.ex}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Parametric estimator ─────────────────────────────────────────────────────
function ParametricEstimator() {
  const [fp, setFp] = useState(200);
  const [cpp, setCpp] = useState(120);
  const total = fp * cpp;
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-[#1d1d1f]">
          Function points: <span className="text-[#0071e3]">{fp}</span>
        </label>
        <input type="range" min={50} max={500} step={10} value={fp} onChange={e => setFp(+e.target.value)}
          className="w-full accent-[#0071e3]" />
        <div className="flex justify-between text-[11px] text-[#6e6e73]"><span>50</span><span>500</span></div>
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-[#1d1d1f]">Cost per function point (NZ$)</label>
        <input type="number" value={cpp} onChange={e => setCpp(+e.target.value)} min={0}
          className="w-full rounded-xl border border-black/[0.12] px-3 py-2.5 text-[14px] focus:border-[#0071e3] focus:outline-none" />
      </div>
      <div className="rounded-2xl bg-[#0071e3]/[0.06] p-5 text-center">
        <p className="text-[13px] font-semibold text-[#0071e3]">Estimated total cost</p>
        <p className="mt-1 text-[32px] font-semibold tracking-tight text-[#1d1d1f]">NZ${total.toLocaleString()}</p>
      </div>
    </div>
  );
}

// ─── WBS bottom-up ────────────────────────────────────────────────────────────
function WBSEstimator() {
  const [costs, setCosts] = useState([35000, 28000, 22000]);
  const labels = ['1.1 API Integration', '1.2 Security Layer', '1.3 Testing & UAT'];
  const total = costs.reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-[#1d1d1f] px-4 py-3 flex items-center justify-between">
        <p className="text-[14px] font-semibold text-white">SecurePay NZ — Total</p>
        <p className="text-[14px] font-semibold text-[#0071e3]">NZ${total.toLocaleString()}</p>
      </div>
      {labels.map((l, i) => (
        <div key={l} className="ml-4 flex items-center gap-3 rounded-xl border border-black/[0.08] bg-[#f5f5f7] px-4 py-2.5">
          <p className="flex-1 text-[13px] font-medium text-[#1d1d1f]">{l}</p>
          <input type="number" value={costs[i]} onChange={e => { const n = [...costs]; n[i] = +e.target.value || 0; setCosts(n); }}
            className="w-28 rounded-lg border border-black/[0.12] px-2.5 py-1.5 text-right text-[13px] focus:border-[#0071e3] focus:outline-none" />
        </div>
      ))}
    </div>
  );
}

// ─── PERT calculator ──────────────────────────────────────────────────────────
const PERT_INIT = [
  { name: 'API Integration', o: 8000, m: 12000, p: 20000 },
  { name: 'Security Testing', o: 4000, m: 6000, p: 11000 },
  { name: 'UAT & Training', o: 3000, m: 4000, p: 8000 },
];

function PERTCalc() {
  const [rows, setRows] = useState(PERT_INIT);
  const update = (i: number, k: 'o' | 'm' | 'p', v: number) =>
    setRows(r => r.map((row, ri) => ri === i ? { ...row, [k]: v } : row));
  const e = (r: typeof rows[0]) => (r.o + 4 * r.m + r.p) / 6;
  const sd = (r: typeof rows[0]) => (r.p - r.o) / 6;
  const totalE = rows.reduce((s, r) => s + e(r), 0);

  const chartData = rows.map(r => ({ name: r.name, Optimistic: r.o, Expected: Math.round(e(r)), Pessimistic: r.p }));

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-[#0071e3]/20 bg-[#0071e3]/[0.05] p-4">
        <p className="font-mono text-[15px] font-semibold text-[#1d1d1f]">E = (O + 4M + P) / 6 &nbsp;·&nbsp; SD = (P − O) / 6</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[#1d1d1f] text-white">
              {['Activity', 'O (NZ$)', 'M (NZ$)', 'P (NZ$)', 'E (NZ$)', 'SD (NZ$)'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold tracking-wide first:rounded-tl-xl last:rounded-tr-xl">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className="border-t border-black/[0.05]">
                <td className="px-3 py-2.5 font-medium text-[#1d1d1f]">{r.name}</td>
                {(['o', 'm', 'p'] as const).map(k => (
                  <td key={k} className="px-3 py-2">
                    <input type="number" value={r[k]} onChange={ev => update(i, k, +ev.target.value || 0)}
                      className="w-24 rounded-lg border border-black/[0.1] px-2 py-1 text-right text-[13px] focus:border-[#0071e3] focus:outline-none" />
                  </td>
                ))}
                <td className="px-3 py-2.5 font-semibold text-[#0071e3]">NZ${Math.round(e(r)).toLocaleString()}</td>
                <td className="px-3 py-2.5 text-[#6e6e73]">±{Math.round(sd(r)).toLocaleString()}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#0071e3]/20 bg-[#0071e3]/[0.04]">
              <td colSpan={4} className="px-3 py-2.5 font-semibold text-[#1d1d1f]">Total Expected Cost</td>
              <td className="px-3 py-2.5 text-[16px] font-bold text-[#0071e3]">NZ${Math.round(totalE).toLocaleString()}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
            <Tooltip formatter={(v: number) => `NZ$${v.toLocaleString()}`} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Optimistic" fill="#30d158" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Expected" fill="#0071e3" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Pessimistic" fill="#ff375f" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Section 5: Problems + bias + contingency ─────────────────────────────────
const PROBLEMS = [
  { t: 'Estimates done too quickly', story: 'A PM promised a fixed price after a 20-minute scoping call. The build took triple the time.', fix: 'Allocate real time to estimating; treat it as a deliverable, not an afterthought.' },
  { t: 'People lack estimating experience', story: 'A junior dev estimated a payment reconciliation module at 2 days — it took 3 weeks.', fix: 'Pair inexperienced estimators with veterans; maintain a historical actuals database.' },
  { t: 'Bias toward underestimation', story: 'Every task "should only take a day" — optimism bias compounds across hundreds of tasks.', fix: 'Apply reference-class forecasting and add evidence-based contingency reserves.' },
  { t: 'Management wants accuracy too early', story: 'Leadership demanded ±5% accuracy at initiation, before requirements even existed.', fix: 'Educate sponsors on estimate maturity (ROM → Budgetary → Definitive); commit ranges early, points later.' },
];

function ProblemsReveal() {
  const [shown, setShown] = useState(0);
  return (
    <div>
      <div className="space-y-4">
        {PROBLEMS.slice(0, shown).map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-white">
            <div className="flex items-center gap-3 border-b border-black/[0.05] px-6 py-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ff375f] text-[13px] font-bold text-white">{i + 1}</span>
              <p className="text-[16px] font-semibold text-[#1d1d1f]">{p.t}</p>
            </div>
            <div className="grid sm:grid-cols-2">
              <div className="border-r border-black/[0.05] bg-[#ff375f]/[0.04] px-6 py-4">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#d70015]">War story</p>
                <p className="text-[13.5px] italic leading-relaxed text-[#424245]">{p.story}</p>
              </div>
              <div className="bg-[#30d158]/[0.04] px-6 py-4">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#248a3d]">Fix</p>
                <p className="text-[13.5px] leading-relaxed text-[#424245]">{p.fix}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {shown < PROBLEMS.length && (
        <button onClick={() => setShown(s => s + 1)}
          className="mt-4 rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]">
          {shown === 0 ? 'Reveal problems' : `Reveal next (${shown + 1}/${PROBLEMS.length})`}
        </button>
      )}
    </div>
  );
}

function BiasMeter() {
  const [bias, setBias] = useState(0);
  const base = 5000, realistic = Math.round(base * (1 + bias / 100));
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-[14px] font-semibold text-[#1d1d1f]">
          Optimism bias: <span className="text-[#ff375f]">{bias}%</span>
        </label>
        <input type="range" min={0} max={40} value={bias} onChange={e => setBias(+e.target.value)} className="w-full accent-[#ff375f]" />
        <div className="flex justify-between text-[11px] text-[#6e6e73]"><span>0%</span><span>40%</span></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Naive estimate', val: 'NZ$5,000', color: '#6e6e73' },
          { label: 'Realistic estimate', val: `NZ$${realistic.toLocaleString()}`, color: '#0071e3' },
          { label: 'Contingency needed', val: `NZ$${(realistic - base).toLocaleString()}`, color: '#ff375f' },
        ].map(m => (
          <div key={m.label} className="rounded-2xl bg-[#f5f5f7] p-4 text-center">
            <p className="text-[20px] font-semibold" style={{ color: m.color }}>{m.val}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContingencyExplainer() {
  const [pct, setPct] = useState(10);
  const base = 650000, mgmtPct = 5;
  const cont = base * pct / 100, mgmt = (base + cont) * mgmtPct / 100;
  const ceiling = base + cont + mgmt;
  const pBase = base / ceiling * 100, pCont = cont / ceiling * 100, pMgmt = mgmt / ceiling * 100;
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-[14px] font-semibold text-[#1d1d1f]">
          Contingency reserve: <span className="text-[#0071e3]">{pct}%</span>
        </label>
        <input type="range" min={5} max={25} value={pct} onChange={e => setPct(+e.target.value)} className="w-full accent-[#0071e3]" />
        <div className="flex justify-between text-[11px] text-[#6e6e73]"><span>5%</span><span>25%</span></div>
      </div>
      <div className="flex h-10 overflow-hidden rounded-xl">
        <div className="flex items-center justify-center text-[11px] font-bold text-white transition-all" style={{ width: pBase + '%', background: '#1d1d1f' }}>Base</div>
        <div className="flex items-center justify-center text-[11px] font-bold text-white transition-all" style={{ width: pCont + '%', background: '#0071e3' }}>Cont</div>
        <div className="flex items-center justify-center text-[11px] font-bold text-[#7a4a00] transition-all" style={{ width: pMgmt + '%', background: '#ff9f0a' }}>Mgmt</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Base estimate', val: 'NZ$650,000', color: '#1d1d1f' },
          { label: 'Contingency', val: `NZ$${Math.round(cont).toLocaleString()}`, color: '#0071e3' },
          { label: 'Total ceiling', val: `NZ$${Math.round(ceiling).toLocaleString()}`, color: '#ff9f0a' },
        ].map(m => (
          <div key={m.label} className="rounded-2xl bg-[#f5f5f7] p-4 text-center">
            <p className="text-[18px] font-semibold tabular-nums" style={{ color: m.color }}>{m.val}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 6: Budget builder + S-curve ─────────────────────────────────────
const PKGS_INIT = [
  { name: 'Discovery', cost: 40000 },
  { name: 'Design', cost: 60000 },
  { name: 'Development', cost: 280000 },
  { name: 'Testing', cost: 120000 },
  { name: 'Deployment', cost: 80000 },
];

function BudgetBuilder() {
  const [pkgs, setPkgs] = useState(PKGS_INIT);
  const [contPct, setContPct] = useState(10);
  const [mgmtPct, setMgmtPct] = useState(5);
  const sum = pkgs.reduce((a, p) => a + p.cost, 0);
  const cont = sum * contPct / 100;
  const baseline = sum + cont;
  const mgmt = baseline * mgmtPct / 100;
  const ceiling = baseline + mgmt;
  const fmt = (n: number) => `NZ$${Math.round(n).toLocaleString()}`;
  const pS = sum / ceiling * 100, pC = cont / ceiling * 100, pM = mgmt / ceiling * 100;

  const monthly = [40, 60, 140, 140, 120, 80];
  const cum: number[] = [];
  let run = 0;
  monthly.forEach(v => { run += v; cum.push(run); });
  const scurveData = monthly.map((v, i) => ({ month: `M${i + 1}`, spend: v, cumulative: cum[i] }));

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-[#1d1d1f] text-white">
              <th className="rounded-tl-xl px-4 py-2.5 text-left text-[12px] font-semibold tracking-wide">WBS Work Package</th>
              <th className="rounded-tr-xl px-4 py-2.5 text-right text-[12px] font-semibold tracking-wide">Cost (NZ$)</th>
            </tr>
          </thead>
          <tbody>
            {pkgs.map((p, i) => (
              <tr key={p.name} className="border-t border-black/[0.05]">
                <td className="px-4 py-2.5 font-medium text-[#1d1d1f]">{p.name}</td>
                <td className="px-4 py-2">
                  <input type="number" value={p.cost}
                    onChange={e => setPkgs(pp => pp.map((x, xi) => xi === i ? { ...x, cost: +e.target.value || 0 } : x))}
                    className="w-full rounded-lg border border-black/[0.1] px-3 py-1.5 text-right text-[13px] focus:border-[#0071e3] focus:outline-none" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#1d1d1f]">Contingency reserve (%)</label>
          <input type="number" value={contPct} min={0} max={50} onChange={e => setContPct(+e.target.value || 0)}
            className="w-full rounded-xl border border-black/[0.12] px-3 py-2.5 text-[14px] focus:border-[#0071e3] focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#1d1d1f]">Management reserve (%)</label>
          <input type="number" value={mgmtPct} min={0} max={50} onChange={e => setMgmtPct(+e.target.value || 0)}
            className="w-full rounded-xl border border-black/[0.12] px-3 py-2.5 text-[14px] focus:border-[#0071e3] focus:outline-none" />
        </div>
      </div>
      <div className="flex h-10 overflow-hidden rounded-xl">
        <div className="flex items-center justify-center text-[11px] font-bold text-white transition-all" style={{ width: pS + '%', background: '#1d1d1f' }}>Estimates</div>
        <div className="flex items-center justify-center text-[11px] font-bold text-white transition-all" style={{ width: pC + '%', background: '#0071e3' }}>Contingency</div>
        <div className="flex items-center justify-center text-[11px] font-bold text-[#7a4a00] transition-all" style={{ width: pM + '%', background: '#ff9f0a' }}>Mgmt</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{ l: 'Sum of estimates', v: fmt(sum), c: '#1d1d1f' }, { l: 'Cost baseline', v: fmt(baseline), c: '#0071e3' }, { l: 'Total ceiling', v: fmt(ceiling), c: '#ff9f0a' }].map(m => (
          <div key={m.l} className="rounded-2xl bg-[#f5f5f7] p-4 text-center">
            <p className="text-[18px] font-semibold tabular-nums" style={{ color: m.c }}>{m.v}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">{m.l}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-3 text-[15px] font-semibold text-[#1d1d1f]">Time-phased budget & S-curve</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={scurveData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}K`} />
              <Tooltip formatter={(v: number) => `NZ$${v}K`} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="spend" name="Monthly spend (NZ$000s)" fill="#0071e3" opacity={0.7} radius={[4, 4, 0, 0]} />
              <Area dataKey="cumulative" name="Cumulative / S-curve" fill="#1d1d1f" fillOpacity={0.06} stroke="#1d1d1f" strokeWidth={2} type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Section 7: Final quiz + order ────────────────────────────────────────────
const FINAL_QS = [
  { q: 'The CTO asks for a cost estimate 18 months before project completion. Which estimate type is most appropriate?', opts: ['ROM', 'Budgetary', 'Definitive'], a: 0, fb: '18 months out with little detail → Rough Order of Magnitude (−50% to +100%).' },
  { q: 'O=$8K, M=$12K, P=$20K for the API task. What is the PERT expected cost?', opts: ['NZ$12,000', 'NZ$12,667', 'NZ$13,333', 'NZ$14,000'], a: 1, fb: 'E = (8,000 + 4×12,000 + 20,000) / 6 = 76,000 / 6 = NZ$12,667.' },
  { q: 'The project spent NZ$120K on a vendor who delivered nothing. Should this factor into the go/no-go decision?', opts: ['Yes — recover it by continuing', 'No — it is a sunk cost', 'Only if over 10% of budget', 'Yes — add to the baseline'], a: 1, fb: 'It is a sunk cost — already spent and unrecoverable, so it must not influence the forward-looking decision.' },
  { q: 'Which reserve type is controlled by the project manager?', opts: ['Contingency', 'Management', 'Both', 'Neither'], a: 0, fb: 'Contingency reserves (known unknowns) sit inside the cost baseline and are PM-controlled.' },
];

function FinalChallenge() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [orderBuckets, setOrderBuckets] = useState<string[]>(['', '', '']);
  const [submitted, setSubmitted] = useState(false);
  const [draggingO, setDraggingO] = useState<string | null>(null);
  const orderItems = ['ROM', 'Budgetary', 'Definitive'];
  const correctOrder = ['ROM', 'Budgetary', 'Definitive'];

  const tray = orderItems.filter(x => !orderBuckets.includes(x));

  function dropOrder(pos: number) {
    if (!draggingO) return;
    setOrderBuckets(b => b.map((v, i) => i === pos ? draggingO : (v === draggingO ? '' : v)));
    setDraggingO(null);
  }
  function dropTray() {
    if (!draggingO) return;
    setOrderBuckets(b => b.map(v => v === draggingO ? '' : v));
    setDraggingO(null);
  }

  const mcqScore = Object.entries(answers).filter(([qi, ai]) => FINAL_QS[+qi].a === +ai).length;
  const orderScore = orderBuckets.every((v, i) => v === correctOrder[i]) && orderBuckets.every(Boolean) ? 1 : 0;
  const total = mcqScore + orderScore;

  return (
    <div>
      <MiniQuiz questions={FINAL_QS} />

      <div className="mt-8 border-t border-black/[0.06] pt-8">
        <p className="mb-1.5 text-[16px] font-semibold text-[#1d1d1f]">Q5 · Drag the 3 estimate types into order — least to most accurate</p>
        <p className="mb-4 text-[14px] text-[#6e6e73]">Drag each chip into the correct position.</p>
        <div className="mb-4 flex min-h-[50px] flex-wrap gap-2 rounded-xl bg-[#f5f5f7] p-3"
          onDragOver={e => e.preventDefault()} onDrop={dropTray}>
          {tray.map(t => (
            <div key={t} draggable onDragStart={() => setDraggingO(t)}
              className="cursor-grab rounded-full border border-[#1d1d1f]/20 bg-white px-4 py-1.5 text-[13px] font-semibold text-[#1d1d1f]">{t}</div>
          ))}
          {tray.length === 0 && <p className="text-[13px] text-[#6e6e73]">All placed — submit to check</p>}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['1 · Least accurate', '2 · Middle', '3 · Most accurate'].map((lbl, pos) => (
            <div key={lbl} onDragOver={e => e.preventDefault()} onDrop={() => dropOrder(pos)}
              className="min-h-[80px] rounded-2xl border-2 border-dashed border-black/[0.1] bg-white p-3 text-center transition hover:border-[#0071e3]/40">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#0071e3]">{lbl}</p>
              {orderBuckets[pos] && (
                <div draggable onDragStart={() => setDraggingO(orderBuckets[pos])}
                  className={`cursor-grab rounded-full px-3 py-1.5 text-[13px] font-semibold ${submitted
                    ? orderBuckets[pos] === correctOrder[pos] ? 'bg-[#30d158]/[0.12] text-[#248a3d]' : 'bg-[#ff375f]/[0.10] text-[#d70015]'
                    : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}>
                  {orderBuckets[pos]}{submitted && (orderBuckets[pos] === correctOrder[pos] ? ' ✓' : ' ✗')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setSubmitted(true)}
        className="mt-6 rounded-full bg-[#0071e3] px-8 py-3 text-[16px] font-medium text-white transition hover:bg-[#0077ed]">
        Submit final challenge
      </button>

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-[#1d1d1f] p-6 text-center text-white">
          <p className="text-[28px] font-semibold">Score: {total} / 5</p>
          <p className="mt-1 text-[15px] text-white/60">{total >= 4 ? '✅ Excellent work!' : total >= 3 ? '✅ Solid — review any red answers above.' : '— Try reviewing sections 2 and 4.'}</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CostManagementPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white text-[#1d1d1f]" style={{ fontFamily: APPLE_FONT }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute left-6 top-6 z-20 flex items-center gap-2.5 sm:left-10 sm:top-8">
          <BrandMark className="h-8 w-8 rounded-[9px]" />
          <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
            Not a <span className="text-[#0071e3]">LMS</span>
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#0071e3]/[0.07] blur-3xl" />
          <div className="absolute bottom-[-10%] right-[8%] h-[420px] w-[420px] rounded-full bg-[#30d158]/[0.07] blur-3xl" />
        </div>
        <motion.div style={{ scale: heroScale, opacity: heroOpacity, y: heroY }} className="relative z-10 text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[17px] font-medium text-[#6e6e73]">
            MBI804 · Project Management · Dr. Yasas Sri Wickramasinghe
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="text-[44px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[72px] lg:text-[88px]">
            Let's make sense of
            <br />
            <span className="bg-gradient-to-r from-[#0071e3] via-[#30d158] to-[#0071e3] bg-clip-text text-transparent">
              Project Cost Management.
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-[19px] leading-relaxed text-[#6e6e73] sm:text-[22px]">
            Plan it, estimate it, baseline it. Seven interactive sections built around the <strong className="text-[#1d1d1f]">SecurePay NZ</strong> scenario — a real IT project context from start to baseline. No sign-in, nothing collected.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <button onClick={() => scrollTo('intro')} className="rounded-full bg-[#0071e3] px-7 py-3 text-[17px] font-medium text-white transition hover:bg-[#0077ed]">
              Start the lesson
            </button>
            <button onClick={() => scrollTo('pert')} className="text-[17px] font-medium text-[#0071e3] hover:underline">
              Jump to PERT calculator ›
            </button>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 text-[13px] font-medium text-[#aeaeb2]">
          Scroll to explore
        </motion.div>
      </section>

      {/* ── SECTION 1: INTRO ─────────────────────────────────────────────── */}
      <section id="intro" className="px-6 py-24 sm:py-28">
        <Reveal><SectionHead eyebrow="The problem" title="Why do IT projects blow their budgets?"
          sub="75% of IT projects exceed their budget. Understanding the four PMI cost management processes is how you join the other 25%." /></Reveal>
        <div className="mx-auto max-w-4xl space-y-8">
          <Reveal delay={0.05}><HookCounter /></Reveal>
          <Reveal delay={0.1}>
            <Card>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#0071e3]">Running scenario</p>
              <h3 className="text-[20px] font-semibold text-[#1d1d1f]">SecurePay NZ</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#6e6e73]">
                You're PM at a NZ fintech startup. You have <strong className="text-[#1d1d1f]">NZ$650,000</strong> and <strong className="text-[#1d1d1f]">6 months</strong> to integrate a payment gateway API for a retail client.
                Team: 4 developers, 1 QA, 1 UX, 1 PM. This scenario threads through every section of this lesson.
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.15}>
            <Card>
              <h3 className="mb-4 text-[18px] font-semibold text-[#1d1d1f]">The 4 PMI Cost Management Processes</h3>
              <p className="mb-5 text-[14px] text-[#6e6e73]">Click any process to see its key output.</p>
              <ProcessFlow />
            </Card>
          </Reveal>
          <Reveal delay={0.2}>
            <Card>
              <h3 className="mb-4 text-[18px] font-semibold text-[#1d1d1f]">Warm-up check</h3>
              <p className="mb-5 text-[14px] text-[#6e6e73]">Three quick questions to activate your thinking — instant feedback, no pass/fail.</p>
              <MiniQuiz questions={WARMUP_Qs} />
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 2: COST TYPES ─────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal><SectionHead eyebrow="Section 2 · Foundations" title="Know your costs"
          sub="Before you can estimate anything, you need to classify what you're counting. Click each card to flip it." /></Reveal>
        <div className="mx-auto max-w-5xl space-y-10">
          <Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {FLASHCARDS.map(c => <FlashCard key={c.term} {...c} />)}
            </div>
          </Reveal>
          <Reveal>
            <div className="rounded-[28px] border-l-4 border-[#ff375f] bg-white p-6 sm:p-8" style={{ borderLeftWidth: 5 }}>
              <p className="mb-1.5 text-[12px] font-bold uppercase tracking-widest text-[#d70015]">⚠️ The Sunk Cost Fallacy</p>
              <p className="text-[16px] leading-relaxed text-[#424245]">
                A NZ insurer spent <strong>NZ$2.3M</strong> on a custom ERP that never worked. When asked to cut losses, leadership said: <em>"We've already spent so much — we can't stop now."</em> They spent another NZ$1.1M before finally abandoning it.
                The money already spent was <strong>sunk</strong> — irrelevant to whether the next dollar was worth spending. Good PMs ignore sunk costs in go/no-go decisions.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <Card>
              <h3 className="mb-2 text-[18px] font-semibold text-[#1d1d1f]">Categorise the costs</h3>
              <p className="mb-5 text-[14px] text-[#6e6e73]">Drag each cost item into the correct bucket, then check your answers.</p>
              <DragDropExercise />
            </Card>
          </Reveal>
          <Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <Pill color="#0071e3">Learning Curve Theory</Pill>
                <p className="mt-3 text-[15px] leading-relaxed text-[#424245]">The more times a team repeats a task, the cheaper each repetition becomes — important when estimating repetitive IT work like onboarding integrations.</p>
                <div className="mt-4 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Array.from({ length: 10 }, (_, i) => ({ u: i + 1, h: +(100 * Math.pow(i + 1, -0.32)).toFixed(1) }))} margin={{ left: 0, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="u" label={{ value: 'Units produced', position: 'insideBottom', offset: -2, fontSize: 11 }} tick={{ fontSize: 10 }} />
                      <YAxis label={{ value: 'Hours/unit', angle: -90, position: 'insideLeft', fontSize: 11 }} tick={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="h" stroke="#0071e3" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <Pill color="#30d158">Reserves</Pill>
                <p className="mt-3 text-[15px] leading-relaxed text-[#424245]">
                  <strong>Contingency reserves</strong> cover <em>known unknowns</em> — identified risks. The <strong>PM</strong> controls these; they sit inside the cost baseline.
                  <br /><br />
                  <strong>Management reserves</strong> cover <em>unknown unknowns</em>. The <strong>sponsor</strong> controls these; they sit outside the baseline.
                </p>
                <div className="mt-5 flex h-10 overflow-hidden rounded-xl">
                  <div className="flex flex-1 items-center justify-center bg-[#1d1d1f] text-[12px] font-bold text-white">Base Estimate (70%)</div>
                  <div className="flex w-[20%] items-center justify-center bg-[#0071e3] text-[11px] font-bold text-white">Cont.</div>
                  <div className="flex w-[10%] items-center justify-center bg-[#ff9f0a] text-[10px] font-bold text-[#7a4a00]">Mgmt</div>
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 3: CP1 ───────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal><SectionHead eyebrow="Section 3 · CP1 — Plan Cost Management" title="Before you spend a dollar"
          sub="The Cost Management Plan sets the rules for every number that follows. Skip it and your estimates can't be compared." /></Reveal>
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="mb-8 grid grid-cols-3 gap-4 text-center">
              {[{ e: '📥', t: 'Inputs', d: 'Project charter, plan, EEFs & OPAs' }, { e: '🛠️', t: 'Tools', d: 'Expert judgment · Analytical techniques · Meetings' }, { e: '📄', t: 'Output', d: 'Cost Management Plan', hi: true }].map(p => (
                <div key={p.t} className={`rounded-2xl border-2 p-5 ${p.hi ? 'border-[#0071e3] bg-[#0071e3]/[0.05]' : 'border-black/[0.08] bg-white'}`}>
                  <div className="text-2xl">{p.e}</div>
                  <p className="mt-2 text-[12px] font-bold uppercase tracking-wide text-[#0071e3]">{p.t}</p>
                  <p className="mt-1 text-[13px] text-[#6e6e73]">{p.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Card>
              <h3 className="mb-2 text-[18px] font-semibold text-[#1d1d1f]">Cost Management Plan — SecurePay NZ</h3>
              <p className="mb-5 text-[14px] text-[#6e6e73]">Fill in the fields and preview your plan as a formatted document.</p>
              <CostPlanForm />
            </Card>
          </Reveal>
          <Reveal delay={0.15} className="mt-6">
            <div className="rounded-[28px] border border-[#ff9f0a]/30 bg-[#ff9f0a]/[0.05] p-6">
              <p className="mb-2 text-[13px] font-bold uppercase tracking-widest text-[#7a4a00]">💭 Reflection (not graded)</p>
              <p className="mb-3 text-[15px] text-[#1d1d1f]">What would happen if you skipped this planning step and went straight to estimating costs?</p>
              <textarea className="w-full rounded-xl border border-black/[0.12] p-3 text-[14px] focus:border-[#0071e3] focus:outline-none" rows={3} placeholder="Type your thoughts…" />
              <p className="mt-3 text-[13px] italic text-[#6e6e73]">One perspective: Without a plan, every estimator uses different units, accuracy levels, and thresholds — so estimates can't be compared and there's no agreed trigger for escalation.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 4: CP2 ───────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal><SectionHead eyebrow="Section 4 · CP2 — Estimate Costs" title="Show me the money"
          sub="ROM to definitive. Top-down to bottom-up. PERT for uncertainty. Three tools, one goal: a number you can defend." /></Reveal>
        <div className="mx-auto max-w-5xl space-y-10">
          <Reveal>
            <Card>
              <h3 className="mb-4 text-[18px] font-semibold text-[#1d1d1f]">Categories of cost estimates</h3>
              <p className="mb-5 text-[14px] text-[#6e6e73]">As the project matures, estimates get more accurate. Toggle between them to see the tradeoffs.</p>
              <EstimateSlider />
            </Card>
          </Reveal>
          <Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <Pill color="#5e5ce6">Top-Down</Pill>
                <h3 className="mt-3 text-[17px] font-semibold text-[#1d1d1f]">Analogous & Parametric</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]"><strong className="text-[#1d1d1f]">Analogous:</strong> uses cost of a similar past project, scaled. Fast, cheap, least accurate.<br /><strong className="text-[#1d1d1f]">Parametric:</strong> statistical relationship — e.g. cost per function point.</p>
                <div className="mt-5 border-t border-black/[0.06] pt-5">
                  <p className="mb-3 text-[14px] font-semibold text-[#1d1d1f]">Live parametric estimator</p>
                  <ParametricEstimator />
                </div>
              </Card>
              <Card>
                <Pill color="#30d158">Bottom-Up</Pill>
                <h3 className="mt-3 text-[17px] font-semibold text-[#1d1d1f]">WBS-Based</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">Decompose into work packages, estimate each leaf, roll up. Most accurate — and most effort. Edit the leaf costs below.</p>
                <div className="mt-5 border-t border-black/[0.06] pt-5">
                  <WBSEstimator />
                </div>
              </Card>
            </div>
          </Reveal>
          <Reveal id="pert">
            <Card>
              <h3 className="mb-2 text-[18px] font-semibold text-[#1d1d1f]">PERT Calculator — Three-Point Estimating</h3>
              <p className="mb-5 text-[14px] text-[#6e6e73]">Enter Optimistic, Most Likely, and Pessimistic costs for each SecurePay NZ activity. E and SD calculate automatically.</p>
              <PERTCalc />
              <div className="mt-5 rounded-xl border border-[#0071e3]/20 bg-[#0071e3]/[0.04] p-4">
                <p className="text-[14px] text-[#424245]"><strong>When to use PERT: </strong>Use it when activities are novel or have high variability — exactly the case for new API integrations and security work.</p>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 5: PITFALLS ──────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal><SectionHead eyebrow="Section 5 · Pitfalls" title="Why estimates go wrong"
          sub="Four patterns that explain most project cost overruns — each with a war story and a concrete fix." /></Reveal>
        <div className="mx-auto max-w-4xl space-y-10">
          <Reveal><ProblemsReveal /></Reveal>
          <Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <h3 className="mb-4 text-[17px] font-semibold text-[#1d1d1f]">Bias Meter</h3>
                <p className="mb-4 text-[14px] text-[#6e6e73]">A PM estimates a task at NZ$5,000. Slide to adjust for optimism bias and see the realistic number.</p>
                <BiasMeter />
              </Card>
              <Card>
                <h3 className="mb-4 text-[17px] font-semibold text-[#1d1d1f]">Contingency Reserve Explainer</h3>
                <p className="mb-4 text-[14px] text-[#6e6e73]">SecurePay NZ base: NZ$650,000. Adjust contingency % to see the budget ceiling move.</p>
                <ContingencyExplainer />
              </Card>
            </div>
          </Reveal>
          <Reveal>
            <div className="rounded-[28px] bg-[#0071e3] p-8 text-white">
              <p className="mb-1 text-[13px] font-bold uppercase tracking-widest opacity-70">PM Network insight</p>
              <p className="text-[22px] font-semibold leading-snug italic">"Treat estimates as a living process, not a one-time event."</p>
              <ul className="mt-5 space-y-2.5">
                {['Manage estimates through the whole lifecycle — refine as you learn', 'Use agile estimating (story points, relative sizing) for evolving scope', 'Match skill sets — let the people who\'ll do the work estimate it'].map(b => (
                  <li key={b} className="flex gap-3 text-[15px] text-white/90"><span className="mt-0.5 text-[#30d158]">→</span>{b}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 6: CP3 ───────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal><SectionHead eyebrow="Section 6 · CP3 — Determine Budget" title="Building the cost baseline"
          sub="Allocate estimates to WBS work packages over time → the Cost Performance Baseline (S-curve). This is what you'll measure performance against." /></Reveal>
        <div className="mx-auto max-w-4xl space-y-8">
          <Reveal>
            <Card>
              <h3 className="mb-2 text-[18px] font-semibold text-[#1d1d1f]">Budget Builder — SecurePay NZ</h3>
              <p className="mb-5 text-[14px] text-[#6e6e73]">Edit any work package cost. Reserves and totals update live. The S-curve below shows the time-phased baseline shape.</p>
              <BudgetBuilder />
            </Card>
          </Reveal>
          <Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[24px] border-2 border-[#0071e3] bg-white p-6">
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#0071e3]">Cost Baseline</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#424245]">= Estimates + Contingency reserve. The <strong>PM controls</strong> this and measures all performance against it.</p>
              </div>
              <div className="rounded-[24px] border-2 border-[#ff9f0a] bg-white p-6">
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#7a4a00]">Total Budget</p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#424245]">= Baseline + Management reserve. The <strong>sponsor controls</strong> the management reserve — the PM must request access.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 7: SUMMARY ───────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal><SectionHead eyebrow="Section 7 · Summary" title="Putting it all together"
          sub="Five questions, a drag-to-order, and your key takeaways. How much of the lesson stuck?" /></Reveal>
        <div className="mx-auto max-w-4xl space-y-10">
          <Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {PROCESSES.map((p, i) => (
                <div key={p.code} className={`rounded-2xl p-5 text-center ${i < 3 ? 'border-2 border-[#0071e3] bg-[#0071e3]/[0.05]' : 'border-2 border-dashed border-black/[0.1] bg-white opacity-60'}`}>
                  <div className="text-2xl">{p.icon}</div>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[#0071e3]">{p.code}</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-[#1d1d1f]">{p.name}</p>
                  {i === 3 && <p className="mt-1 text-[11px] text-[#6e6e73]">Next lecture →</p>}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <Card>
              <h3 className="mb-4 text-[18px] font-semibold text-[#1d1d1f]">🏆 SecurePay NZ — Final Challenge</h3>
              <FinalChallenge />
            </Card>
          </Reveal>
          <Reveal>
            <div className="rounded-[28px] bg-[#1d1d1f] p-8 text-white">
              <p className="mb-4 text-[12px] font-bold uppercase tracking-widest text-white/50">Key Takeaways</p>
              <ul className="space-y-3">
                {[
                  'Plan first: the Cost Management Plan makes every later number comparable',
                  'Know your cost types — and never let sunk costs drive future decisions',
                  'Match the estimate type to the lifecycle stage (ROM → Budgetary → Definitive)',
                  'Use PERT and reserves to handle uncertainty honestly, not optimistically',
                  'The cost baseline (with contingency) is the S-curve you manage against',
                ].map(t => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed">
                    <span className="mt-0.5 text-[#30d158]">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="rounded-[28px] border-2 border-dashed border-[#0071e3]/40 bg-[#0071e3]/[0.04] p-8">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#0071e3]">Next lecture preview</p>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f]">MC1: Controlling Costs — Earned Value Management</h3>
              <p className="mt-2 mb-6 text-[15px] text-[#6e6e73]">Three concepts to look forward to:</p>
              <div className="grid grid-cols-3 gap-4">
                {[{ t: 'EV', d: 'Earned Value — what you\'ve actually accomplished, in $' }, { t: 'CPI', d: 'Cost Performance Index — over or under budget?' }, { t: 'SPI', d: 'Schedule Performance Index — ahead or behind?' }].map(c => (
                  <div key={c.t} className="rounded-2xl bg-white p-4 text-center border border-black/[0.07]">
                    <p className="text-[28px] font-bold text-[#0071e3]">{c.t}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#6e6e73]">{c.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-2.5">
          <BrandMark className="h-7 w-7 rounded-[8px]" />
          <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
            Not a <span className="text-[#0071e3]">LMS</span>
          </span>
        </div>
        <p className="text-[14px] text-[#6e6e73]">
          A Project Cost Management lesson · MBI804 · put together by <span className="font-medium text-[#1d1d1f]">Dr. Yasas Sri Wickramasinghe</span>.
        </p>
        <p className="mt-2 text-[12px] text-[#aeaeb2]">Everything here runs in your own browser. No personal data is collected or stored.</p>
      </footer>
    </div>
  );
}
