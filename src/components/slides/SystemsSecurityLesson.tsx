// SystemsSecurityLesson.tsx
// MBI800 · Strategic Information Systems
// "Strategic Information Systems Security" — Week 12
//
// A public, self-contained, highly interactive lesson. Beginner-friendly on the
// surface, with depth available on demand. Built to match the house style of the
// other lessons (Apple-like, white canvas, Reveal-on-scroll, soft cards).

import { useState, useEffect, useRef } from 'react';
import type { ReactNode, CSSProperties } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────

const ACCENT = '#4f46e5'; // indigo — the "security" accent
const DANGER = '#e5484d'; // red — threats
const SAFE   = '#30a46c'; // green — controls / safe
const WARN   = '#f59e0b'; // amber — caution

// ── Reveal-on-scroll ──────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '', style = {} }: {
  children: ReactNode; delay?: number; className?: string; style?: CSSProperties;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Shared layout primitives ──────────────────────────────────────────────────

function SectionHeader({ kicker, title, blurb, color = ACCENT }: {
  kicker: string; title: string; blurb?: string; color?: string;
}) {
  return (
    <Reveal>
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
          {kicker}
        </p>
        <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.08, color: '#1d1d1f' }}>
          {title}
        </h2>
        {blurb && (
          <p style={{ margin: '14px 0 0', fontSize: 17, lineHeight: 1.6, color: '#6e6e73', maxWidth: 680 }}>
            {blurb}
          </p>
        )}
      </div>
    </Reveal>
  );
}

function Card({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: '#fafafa',
      border: '1px solid rgba(0,0,0,0.07)',
      borderRadius: 24,
      padding: 28,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Section({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ marginBottom: 96, ...style }}>{children}</section>;
}

// ════════════════════════════════════════════════════════════════════════════
//  1 · WHAT CAN YOU LOSE?  (Problems & Risks of computerised networks)
// ════════════════════════════════════════════════════════════════════════════

const LOSSES = [
  {
    icon: '⏸️', title: 'Business interruption',
    short: 'The system goes down — and so does the business.',
    deep: 'When an airline\'s booking system fails for a few hours, planes still fly but nobody can be checked in, rebooked, or sold a seat. The cost is not the broken server — it is every transaction that could not happen while it was down.',
  },
  {
    icon: '💿', title: 'Loss of software',
    short: 'The programs that run the business are damaged or stolen.',
    deep: 'Software is intellectual property. A corrupted core application, a deleted code repository, or a competitor walking away with your custom system can set a company back years.',
  },
  {
    icon: '🗂️', title: 'Loss of data',
    short: 'The single most painful loss — and the hardest to recover.',
    deep: 'Hardware can be rebought in a day. The ten years of customer records, transactions and history living on it cannot. This is why backups (later in this lesson) exist.',
  },
  {
    icon: '🖥️', title: 'Loss of hardware',
    short: 'Physical devices destroyed, damaged, or stolen.',
    deep: 'Fire, flood, theft, or simple failure. Hardware is the easiest loss to insure against and replace — yet it often takes data and service down with it.',
  },
  {
    icon: '🏢', title: 'Loss of facilities',
    short: 'The building, power, and infrastructure itself.',
    deep: 'A flooded data centre or a severed fibre line takes out everything inside it at once. This is the loss that disaster recovery planning (Part 5) is built to survive.',
  },
  {
    icon: '👥', title: 'Loss of service & personnel',
    short: 'The people and providers who keep it all running.',
    deep: 'A key administrator who leaves with undocumented knowledge, or a cloud provider that goes dark, can be as damaging as any technical failure.',
  },
];

function LossesExplorer() {
  const [open, setOpen] = useState<number>(0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
      {LOSSES.map((l, i) => {
        const active = open === i;
        return (
          <button
            key={l.title}
            onClick={() => setOpen(active ? -1 : i)}
            style={{
              textAlign: 'left', cursor: 'pointer', border: `1.5px solid ${active ? DANGER : 'rgba(0,0,0,0.08)'}`,
              background: active ? `${DANGER}0c` : '#fff', borderRadius: 18, padding: 20,
              transition: 'all 0.25s ease', font: 'inherit',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{l.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 650, color: '#1d1d1f', marginBottom: 6 }}>{l.title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: '#6e6e73' }}>{l.short}</div>
            <div style={{
              maxHeight: active ? 240 : 0, overflow: 'hidden',
              transition: 'max-height 0.4s ease, opacity 0.3s ease', opacity: active ? 1 : 0,
            }}>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${DANGER}22`, fontSize: 14, lineHeight: 1.6, color: '#444' }}>
                {l.deep}
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: active ? DANGER : '#aeaeb2' }}>
              {active ? '— tap to close' : 'tap for a real example →'}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  2 · THE SECURITY LIFECYCLE  (a security system is built like any IS)
// ════════════════════════════════════════════════════════════════════════════

const LIFECYCLE = [
  {
    n: 1, title: 'Systems Analysis', icon: '🔍',
    one: 'Find the weak spots.',
    body: 'Analyse the system\'s vulnerabilities in terms of the threats that are actually relevant to it, and the loss exposure each one carries. You cannot protect against a threat you have not named.',
  },
  {
    n: 2, title: 'Systems Design', icon: '✏️',
    one: 'Plan the defences.',
    body: 'Design the security measures and contingency (recovery) plans that will control the loss exposures you identified. This is where the recovery plan is born — before anything has gone wrong.',
  },
  {
    n: 3, title: 'Systems Implementation', icon: '🛠️',
    one: 'Build what you designed.',
    body: 'Put the security measures in place exactly as designed — access controls, backups, fault tolerance, training. A plan on paper protects nothing.',
  },
  {
    n: 4, title: 'Operation, Evaluation & Control', icon: '🔁',
    one: 'Run it, measure it, improve it.',
    body: 'Operate the security system and continuously assess its effectiveness and efficiency. Threats evolve — so the system must change as circumstances require. Security is a loop, not a finish line.',
  },
];

function LifecycleStepper() {
  const [step, setStep] = useState(0);
  const s = LIFECYCLE[step];
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {/* step rail */}
      <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        {LIFECYCLE.map((l, i) => {
          const active = i === step;
          return (
            <button
              key={l.n}
              onClick={() => setStep(i)}
              style={{
                flex: '1 1 140px', cursor: 'pointer', font: 'inherit', border: 'none',
                background: active ? '#fff' : '#f3f3f5',
                borderBottom: active ? `3px solid ${ACCENT}` : '3px solid transparent',
                padding: '16px 12px', transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: 22 }}>{l.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: active ? ACCENT : '#aeaeb2', marginTop: 4 }}>STEP {l.n}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: active ? '#1d1d1f' : '#6e6e73', marginTop: 2, lineHeight: 1.2 }}>{l.title}</div>
            </button>
          );
        })}
      </div>
      {/* step body */}
      <div key={step} style={{ padding: 28, animation: 'ssFade 0.4s ease' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${ACCENT}12`, color: ACCENT, fontWeight: 700, fontSize: 13, padding: '6px 14px', borderRadius: 999 }}>
          {s.icon} {s.one}
        </div>
        <p style={{ margin: '16px 0 0', fontSize: 17, lineHeight: 1.65, color: '#333' }}>{s.body}</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button
            onClick={() => setStep((step - 1 + LIFECYCLE.length) % LIFECYCLE.length)}
            style={navBtn(false)}
          >‹ Back</button>
          <button
            onClick={() => setStep((step + 1) % LIFECYCLE.length)}
            style={navBtn(true)}
          >Next ›</button>
        </div>
      </div>
    </Card>
  );
}

function navBtn(primary: boolean): CSSProperties {
  return {
    cursor: 'pointer', font: 'inherit', fontSize: 14, fontWeight: 600,
    padding: '9px 18px', borderRadius: 999,
    border: primary ? 'none' : '1px solid rgba(0,0,0,0.12)',
    background: primary ? ACCENT : '#fff',
    color: primary ? '#fff' : '#1d1d1f',
    transition: 'all 0.2s ease',
  };
}

// ════════════════════════════════════════════════════════════════════════════
//  3 · RISK EXPOSURE CALCULATOR  (quantitative vs qualitative)
// ════════════════════════════════════════════════════════════════════════════

function fmtMoney(n: number) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M';
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + 'K';
  return '$' + Math.round(n);
}

function RiskCalculator() {
  const [cost, setCost] = useState(250_000);     // cost of a single loss
  const [likelihood, setLikelihood] = useState(15); // % chance per year

  const exposure = cost * (likelihood / 100);
  const band =
    exposure >= 200_000 ? { label: 'CRITICAL', color: DANGER } :
    exposure >= 50_000  ? { label: 'HIGH', color: WARN } :
    exposure >= 10_000  ? { label: 'MEDIUM', color: '#0071e3' } :
                          { label: 'LOW', color: SAFE };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
      {/* Quantitative */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: ACCENT, textTransform: 'uppercase' }}>Quantitative approach</div>
        <p style={{ margin: '8px 0 20px', fontSize: 14, lineHeight: 1.5, color: '#6e6e73' }}>
          Put a number on it. <b>Loss exposure = cost of one loss × how likely it is.</b> Drag the sliders.
        </p>

        <label style={sliderLabel}>
          <span>Cost of a single loss</span>
          <b style={{ color: '#1d1d1f' }}>{fmtMoney(cost)}</b>
        </label>
        <input type="range" min={1000} max={2_000_000} step={1000} value={cost}
          onChange={e => setCost(Number(e.target.value))} style={slider(ACCENT)} />

        <label style={{ ...sliderLabel, marginTop: 18 }}>
          <span>Likelihood per year</span>
          <b style={{ color: '#1d1d1f' }}>{likelihood}%</b>
        </label>
        <input type="range" min={1} max={100} step={1} value={likelihood}
          onChange={e => setLikelihood(Number(e.target.value))} style={slider(ACCENT)} />

        <div style={{ marginTop: 24, padding: 20, borderRadius: 16, background: `${band.color}10`, border: `1.5px solid ${band.color}33`, textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6e6e73' }}>Annual loss exposure</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: band.color, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 4 }}>
            {fmtMoney(exposure)}
          </div>
          <div style={{ display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#fff', background: band.color, padding: '4px 12px', borderRadius: 999 }}>
            {band.label} PRIORITY
          </div>
        </div>
      </Card>

      {/* Qualitative */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: SAFE, textTransform: 'uppercase' }}>Qualitative approach</div>
        <p style={{ margin: '8px 0 18px', fontSize: 14, lineHeight: 1.5, color: '#6e6e73' }}>
          No precise numbers? Just <b>list the threats and rank them</b> by how much they contribute to total loss exposure. Faster, more subjective.
        </p>
        {[
          { t: 'Ransomware encrypts customer database', r: 'Critical' },
          { t: 'Disgruntled employee deletes records', r: 'High' },
          { t: 'Laptop with no sensitive data stolen', r: 'Medium' },
          { t: 'Printer in lobby jams', r: 'Low' },
        ].map((row, i) => {
          const c = row.r === 'Critical' ? DANGER : row.r === 'High' ? WARN : row.r === 'Medium' ? '#0071e3' : SAFE;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 0', borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
              <span style={{ fontSize: 14, color: '#333', lineHeight: 1.4 }}>{row.t}</span>
              <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#fff', background: c, padding: '3px 10px', borderRadius: 999 }}>{row.r}</span>
            </div>
          );
        })}
        <p style={{ margin: '16px 0 0', fontSize: 13, lineHeight: 1.5, color: '#aeaeb2', fontStyle: 'italic' }}>
          Used when reliable cost/probability data is hard to get — which, in real life, is most of the time.
        </p>
      </Card>
    </div>
  );
}

const sliderLabel: CSSProperties = { display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#6e6e73', marginBottom: 8 };
function slider(color: string): CSSProperties {
  return { width: '100%', accentColor: color, cursor: 'pointer' };
}

// ════════════════════════════════════════════════════════════════════════════
//  4 · ACTIVE THREATS  (the 6 attack types + who does it)
// ════════════════════════════════════════════════════════════════════════════

const ATTACKS = [
  {
    id: 'input', title: 'Input Manipulation', icon: '⌨️', freq: 95,
    tag: 'Most common',
    what: 'Feeding deliberately wrong input to get a wrong result — misappropriating assets or hiding an embezzlement.',
    why: 'It is the most frequently used method of computer fraud, precisely because it needs the least technical skill. You do not need to be a programmer to type a fake invoice.',
  },
  {
    id: 'program', title: 'Program Alteration', icon: '🧬', freq: 15,
    tag: 'Rarest',
    what: 'Secretly changing program code to make it behave a certain way (e.g. round every transaction down and pocket the fractions).',
    why: 'The least common method — it demands real technical skill that only a few people possess. Programmers should never have unauthorised access to live programs.',
  },
  {
    id: 'file', title: 'Direct File Alteration', icon: '🗄️', freq: 40,
    tag: 'Bypass',
    what: 'Editing data directly in the files, bypassing the normal application process entirely. "Transfer company funds to my personal account."',
    why: 'Dangerous because it sidesteps every business rule and validation the application would normally enforce.',
  },
  {
    id: 'theft', title: 'Data Theft', icon: '📤', freq: 60,
    tag: 'Espionage',
    what: 'Stealing a competitor\'s (or your own employer\'s) information. Email and USB drives let huge volumes leave in minutes.',
    why: 'The damage is invisible — the data is still there. You only find out when the competitor uses it.',
  },
  {
    id: 'sabotage', title: 'Sabotage', icon: '💣', freq: 50,
    tag: 'Destruction',
    what: 'Destroying some part of computer processing — using logic bombs, Trojan horses, worms and viruses (explored below).',
    why: 'Often the weapon of a disgruntled insider, and the reason access must be revoked the instant someone is dismissed.',
  },
  {
    id: 'misappropriation', title: 'Misappropriation of Resources', icon: '🪙', freq: 45,
    tag: 'Theft of use',
    what: 'Using company computer resources for your own purposes — e.g. running a private side-business on the company\'s servers.',
    why: 'Easy to dismiss as harmless, but it steals capacity, raises costs, and exposes the organisation to liability.',
  },
];

function ActiveThreatExplorer() {
  const [open, setOpen] = useState('input');
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {ATTACKS.map(a => {
          const active = open === a.id;
          return (
            <button key={a.id} onClick={() => setOpen(a.id)}
              style={{
                cursor: 'pointer', font: 'inherit', textAlign: 'center',
                border: `1.5px solid ${active ? DANGER : 'rgba(0,0,0,0.08)'}`,
                background: active ? DANGER : '#fff', borderRadius: 16, padding: '16px 10px',
                transition: 'all 0.2s ease',
              }}>
              <div style={{ fontSize: 26 }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 650, marginTop: 6, color: active ? '#fff' : '#1d1d1f', lineHeight: 1.2 }}>{a.title}</div>
            </button>
          );
        })}
      </div>

      {ATTACKS.filter(a => a.id === open).map(a => (
        <Card key={a.id} style={{ marginTop: 16, animation: 'ssFade 0.35s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 32 }}>{a.icon}</span>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 650, color: '#1d1d1f' }}>{a.title}</h3>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: DANGER, padding: '3px 10px', borderRadius: 999 }}>{a.tag}</span>
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 16, lineHeight: 1.6, color: '#1d1d1f' }}><b>What it is — </b>{a.what}</p>
          <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.6, color: '#6e6e73' }}><b>Why it matters — </b>{a.why}</p>

          {/* frequency meter */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#aeaeb2', marginBottom: 6 }}>
              <span>How often this method is used</span><span>{a.freq >= 80 ? 'Very high' : a.freq >= 50 ? 'Moderate' : a.freq >= 30 ? 'Low' : 'Very low'}</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${a.freq}%`, background: DANGER, borderRadius: 999, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// who poses the threat
const THREAT_GROUPS = [
  { icon: '🧑‍💻', title: 'Systems personnel', body: 'Maintenance staff, programmers, operators, administrators and data-control clerks. They have the deepest access — and so the greatest opportunity.' },
  { icon: '🧑‍💼', title: 'Users', body: 'People outside the data-processing function who still touch sensitive data and control important inputs. Often overlooked, frequently the entry point.' },
  { icon: '🥷', title: 'Intruders', body: 'Outsiders breaking in. Hackers do it for fun and challenge; others include wiretappers, eavesdroppers, impersonators and the unnoticed intruder.' },
];

// ════════════════════════════════════════════════════════════════════════════
//  5 · MALWARE LAB  (logic bomb / Trojan / worm / virus — match game)
// ════════════════════════════════════════════════════════════════════════════

const MALWARE = [
  { id: 'logic', name: 'Logic Bomb', icon: '⏱️', def: 'A dormant piece of code that lies in wait and is triggered by a specific later event (a date, a deletion, a name vanishing from payroll).' },
  { id: 'trojan', name: 'Trojan Horse', icon: '🐴', def: 'A destructive program disguised as a legitimate, useful one. You run it willingly — that is the trick.' },
  { id: 'worm', name: 'Worm', icon: '🪱', def: 'A virus that spreads itself across a computer network, hopping machine to machine without needing a host program.' },
  { id: 'virus', name: 'Virus', icon: '🦠', def: 'Code that spreads by attaching itself to other programs, "infecting" them with a copy of itself.' },
];

const MALWARE_SCENARIOS = [
  { text: 'Code left by a fired developer that wipes the database exactly 90 days after their name disappears from the payroll file.', answer: 'logic' },
  { text: '"FreeGameInstaller.exe" looks like a game, but quietly opens a backdoor when you run it.', answer: 'trojan' },
  { text: 'A program that copies itself to every machine on the office network overnight, with no human action.', answer: 'worm' },
  { text: 'Malicious code that latches onto a spreadsheet macro and copies itself into every file you open next.', answer: 'virus' },
];

function MalwareLab() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const sc = MALWARE_SCENARIOS[idx];
  const correct = picked === sc?.answer;

  function choose(id: string) {
    if (picked) return;
    setPicked(id);
    if (id === sc.answer) setScore(s => s + 1);
  }
  function next() {
    if (idx + 1 >= MALWARE_SCENARIOS.length) { setDone(true); return; }
    setIdx(idx + 1); setPicked(null);
  }
  function reset() { setIdx(0); setPicked(null); setScore(0); setDone(false); }

  return (
    <Card>
      {/* reference strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 22 }}>
        {MALWARE.map(m => (
          <div key={m.id} style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: 14, background: '#fff' }}>
            <div style={{ fontSize: 22 }}>{m.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 650, margin: '4px 0', color: '#1d1d1f' }}>{m.name}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.45, color: '#6e6e73' }}>{m.def}</div>
          </div>
        ))}
      </div>

      {!done ? (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: ACCENT, textTransform: 'uppercase' }}>
            Identify the threat · {idx + 1}/{MALWARE_SCENARIOS.length}
          </div>
          <p style={{ margin: '10px 0 18px', fontSize: 18, lineHeight: 1.55, color: '#1d1d1f', fontWeight: 500 }}>"{sc.text}"</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
            {MALWARE.map(m => {
              const isAns = m.id === sc.answer;
              const isPicked = picked === m.id;
              let bg = '#fff', bd = 'rgba(0,0,0,0.1)', col = '#1d1d1f';
              if (picked) {
                if (isAns) { bg = `${SAFE}12`; bd = SAFE; col = SAFE; }
                else if (isPicked) { bg = `${DANGER}12`; bd = DANGER; col = DANGER; }
              }
              return (
                <button key={m.id} onClick={() => choose(m.id)} disabled={!!picked}
                  style={{ cursor: picked ? 'default' : 'pointer', font: 'inherit', border: `1.5px solid ${bd}`, background: bg, color: col, borderRadius: 14, padding: '14px 10px', fontWeight: 600, fontSize: 14, transition: 'all 0.2s ease' }}>
                  <span style={{ fontSize: 20, display: 'block' }}>{m.icon}</span>{m.name}
                </button>
              );
            })}
          </div>

          {picked && (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: correct ? `${SAFE}0e` : `${DANGER}0e`, border: `1px solid ${correct ? SAFE : DANGER}33` }}>
              <div style={{ fontWeight: 700, color: correct ? SAFE : DANGER, fontSize: 15 }}>
                {correct ? '✓ Correct' : `✗ Not quite — it's a ${MALWARE.find(m => m.id === sc.answer)!.name}`}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: '#444', marginTop: 6 }}>{MALWARE.find(m => m.id === sc.answer)!.def}</div>
              <button onClick={next} style={{ ...navBtn(true), marginTop: 14 }}>
                {idx + 1 >= MALWARE_SCENARIOS.length ? 'See result' : 'Next scenario ›'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 40 }}>{score === MALWARE_SCENARIOS.length ? '🏆' : score >= 2 ? '👍' : '📚'}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1d1d1f', marginTop: 8 }}>{score} / {MALWARE_SCENARIOS.length}</div>
          <p style={{ fontSize: 15, color: '#6e6e73', marginTop: 6 }}>
            {score === MALWARE_SCENARIOS.length ? 'Flawless — you can tell these four apart.' : 'Scroll the reference cards above and try once more.'}
          </p>
          <button onClick={reset} style={{ ...navBtn(false), marginTop: 10 }}>↻ Try again</button>
        </div>
      )}
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  6 · LAYERED DEFENCE  (site / system / file access controls)
// ════════════════════════════════════════════════════════════════════════════

const LAYERS = [
  { id: 'site', label: 'Site-access', icon: '🚪', size: 300, color: '#0071e3',
    body: 'Keep the wrong people away from the hardware itself — locked server rooms, security guards, badge readers, cameras. The outermost wall.' },
  { id: 'system', label: 'System-access', icon: '🔑', size: 210, color: ACCENT,
    body: 'Even inside the building, you must prove who you are to use the system — passwords, multi-factor authentication, biometrics. The second wall.' },
  { id: 'file', label: 'File-access', icon: '📁', size: 120, color: SAFE,
    body: 'Logged in is not the same as allowed. File-access controls decide which data each authenticated user may actually read or change. The innermost wall around the target.' },
];

function LayeredDefence() {
  const [active, setActive] = useState('site');
  const a = LAYERS.find(l => l.id === active)!;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, alignItems: 'center' }}>
      {/* concentric diagram */}
      <div style={{ position: 'relative', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {LAYERS.map(l => (
          <button key={l.id} onClick={() => setActive(l.id)}
            aria-label={l.label}
            style={{
              position: 'absolute', width: l.size, height: l.size, borderRadius: '50%',
              border: `2px solid ${active === l.id ? l.color : l.color + '55'}`,
              background: active === l.id ? l.color + '14' : 'transparent',
              cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex',
              alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8,
            }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: l.color, background: '#fff', padding: '2px 8px', borderRadius: 999, transform: 'translateY(-50%)' }}>
              {l.icon} {l.label}
            </span>
          </button>
        ))}
        <span style={{ fontSize: 26, zIndex: 1 }}>🎯</span>
      </div>
      {/* explanation */}
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: a.color, textTransform: 'uppercase' }}>Layer · {a.label} controls</div>
        <p style={{ margin: '12px 0 0', fontSize: 17, lineHeight: 1.65, color: '#333' }}>{a.body}</p>
        <p style={{ margin: '16px 0 0', fontSize: 13.5, lineHeight: 1.5, color: '#aeaeb2' }}>
          A <b>layered approach</b> separates a perpetrator from their target. To reach the data, an attacker must defeat <i>every</i> ring — and each one is a fresh chance to stop them.
        </p>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  7 · PASSIVE THREATS — Fault tolerance + Backup simulator
// ════════════════════════════════════════════════════════════════════════════

const FAULT_LEVELS = [
  { icon: '🌐', title: 'Network communications', sol: 'Duplicate communication paths so a cut line never isolates the system.' },
  { icon: '🧠', title: 'CPU processors', sol: 'A watchdog processor stands ready to take over if the main one fails.' },
  { icon: '💽', title: 'Storage (DASDs)', sol: 'Disk mirroring / disk shadowing — every write goes to two disks at once.' },
  { icon: '🔋', title: 'Power supply', sol: 'Battery backup (UPS) carries the load through an outage without missing a beat.' },
  { icon: '💸', title: 'Individual transactions', sol: 'Rollback processing & database shadowing undo a half-finished transaction cleanly.' },
];

function FaultTolerance() {
  const [open, setOpen] = useState(0);
  return (
    <Card>
      <p style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.6, color: '#6e6e73' }}>
        A <b>fault-tolerant system</b> survives a failure because a redundant part takes over <i>immediately</i>, with little or no interruption. Redundancy can be built at five levels — tap each:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FAULT_LEVELS.map((f, i) => {
          const active = open === i;
          return (
            <button key={i} onClick={() => setOpen(active ? -1 : i)}
              style={{ cursor: 'pointer', font: 'inherit', textAlign: 'left', border: `1px solid ${active ? SAFE : 'rgba(0,0,0,0.08)'}`, background: active ? `${SAFE}0c` : '#fff', borderRadius: 14, padding: '14px 16px', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <span style={{ fontSize: 15, fontWeight: 650, color: '#1d1d1f', flex: 1 }}>{f.title}</span>
                <span style={{ fontSize: 18, color: SAFE, transform: active ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
              </div>
              <div style={{ maxHeight: active ? 100 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease', opacity: active ? 1 : 0 }}>
                <p style={{ margin: '10px 0 0 30px', fontSize: 14, lineHeight: 1.55, color: '#444' }}>{f.sol}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ── Backup simulator (full / incremental / differential) ──────────────────────

type Strategy = 'full' | 'incremental' | 'differential';

const WEEK = [
  { day: 'Mon', modified: ['A', 'B'] },
  { day: 'Tue', modified: ['C'] },
  { day: 'Wed', modified: ['A'] },
  { day: 'Thu', modified: ['D'] },
  { day: 'Fri', modified: ['B', 'E'] },
];
const FILES = ['A', 'B', 'C', 'D', 'E'];

// Given a strategy, compute what each daily backup saves and what a Friday
// restore requires. A full backup ran Sunday night (all archive bits → 0).
function simulate(strategy: Strategy) {
  // archive bit = 1 means "modified since last backup that reset bits"
  const bit: Record<string, boolean> = { A: false, B: false, C: false, D: false, E: false };
  const rows: { day: string; saved: string[] }[] = [];

  for (const d of WEEK) {
    d.modified.forEach(f => { bit[f] = true; });
    let saved: string[] = [];
    if (strategy === 'full') {
      saved = [...FILES];
      FILES.forEach(f => { bit[f] = false; }); // full resets all bits
    } else if (strategy === 'incremental') {
      saved = FILES.filter(f => bit[f]);        // only modified since last backup
      saved.forEach(f => { bit[f] = false; });  // incremental resets bits
    } else {
      saved = FILES.filter(f => bit[f]);        // modified since last FULL
      // differential does NOT reset bits
    }
    rows.push({ day: d.day, saved });
  }

  let restore = '';
  if (strategy === 'full') restore = 'Just Friday\'s full backup. One tape, fast restore — but you stored everything five times.';
  else if (strategy === 'incremental') restore = 'Sunday\'s full + every single daily backup (Mon→Fri). Smallest backups, slowest restore — lose one tape and the chain breaks.';
  else restore = 'Sunday\'s full + only Friday\'s differential. A middle ground: bigger daily backups than incremental, but a simple two-step restore.';

  return { rows, restore };
}

const STRATEGY_META: Record<Strategy, { label: string; bit: string; color: string; one: string }> = {
  full:         { label: 'Full',         bit: 'Backs up every file. Sets each archive bit to 0.', color: '#0071e3', one: 'Everything, every time' },
  incremental:  { label: 'Incremental',  bit: 'Backs up only files changed since the last backup (bit = 1), then sets bit to 0.', color: ACCENT, one: 'Only what changed since last backup' },
  differential: { label: 'Differential',bit: 'Backs up files changed since the last full backup — and does NOT reset the archive bit.', color: SAFE, one: 'Everything changed since the last full' },
};

function BackupSimulator() {
  const [strategy, setStrategy] = useState<Strategy>('incremental');
  const { rows, restore } = simulate(strategy);
  const meta = STRATEGY_META[strategy];

  return (
    <Card>
      {/* strategy toggle */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {(Object.keys(STRATEGY_META) as Strategy[]).map(s => {
          const active = strategy === s;
          const m = STRATEGY_META[s];
          return (
            <button key={s} onClick={() => setStrategy(s)}
              style={{ cursor: 'pointer', font: 'inherit', fontWeight: 650, fontSize: 14, padding: '9px 16px', borderRadius: 999, border: `1.5px solid ${active ? m.color : 'rgba(0,0,0,0.12)'}`, background: active ? m.color : '#fff', color: active ? '#fff' : '#1d1d1f', transition: 'all 0.2s ease' }}>
              {m.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '12px 16px', borderRadius: 12, background: `${meta.color}0e`, border: `1px solid ${meta.color}33`, marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: meta.color }}>{meta.label} backup — {meta.one}</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.5, color: '#444', marginTop: 4 }}>{meta.bit}</div>
      </div>

      {/* week table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, minWidth: 460 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#aeaeb2' }}>
              <th style={th}>Day</th>
              <th style={th}>Files modified</th>
              <th style={th}>This backup saves</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.day} style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <td style={{ ...td, fontWeight: 700 }}>{r.day}</td>
                <td style={td}>
                  {WEEK[i].modified.map(f => <Chip key={f} c={WARN}>{f}</Chip>)}
                </td>
                <td style={td}>
                  {r.saved.length ? r.saved.map(f => <Chip key={f} c={meta.color}>{f}</Chip>) : <span style={{ color: '#aeaeb2' }}>nothing</span>}
                  {r.saved.length === FILES.length && <span style={{ fontSize: 11, color: '#aeaeb2', marginLeft: 4 }}>(all)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 18, padding: 16, borderRadius: 14, background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: DANGER, textTransform: 'uppercase' }}>💥 Disaster strikes Friday evening — to fully restore you need:</div>
        <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.6, color: '#1d1d1f' }}>{restore}</p>
      </div>
    </Card>
  );
}

function Chip({ children, c }: { children: ReactNode; c: string }) {
  return <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#fff', background: c, borderRadius: 8, padding: '2px 8px', margin: '2px 3px 2px 0' }}>{children}</span>;
}
const th: CSSProperties = { padding: '8px 10px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' };
const td: CSSProperties = { padding: '10px', color: '#333', verticalAlign: 'top' };

// ════════════════════════════════════════════════════════════════════════════
//  8 · DISASTER RECOVERY — alternate processing sites
// ════════════════════════════════════════════════════════════════════════════

const DR_SITES = [
  { id: 'cold', label: 'Cold site', icon: '🧊', cost: 1, speed: 1, color: '#0071e3',
    body: 'An empty, wired room. Cheapest to keep — but it has no equipment running, so recovery is slowest. You haul in hardware and restore from backup after the disaster.' },
  { id: 'warm', label: 'Warm site', icon: '🌗', cost: 2, speed: 2, color: ACCENT,
    body: 'Partially equipped — hardware in place, but data not fully live. A balance of standing cost and recovery speed.' },
  { id: 'hot', label: 'Hot site', icon: '🔥', cost: 3, speed: 3, color: DANGER,
    body: 'A fully equipped, fully current mirror of production. Switch over in minutes — at the highest ongoing cost. For systems where downtime is unthinkable.' },
];

function DisasterRecovery() {
  const [sel, setSel] = useState('warm');
  const s = DR_SITES.find(d => d.id === sel)!;
  const dot = (n: number, on: number, c: string) =>
    Array.from({ length: n }).map((_, i) => (
      <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', display: 'inline-block', margin: '0 2px', background: i < on ? c : 'rgba(0,0,0,0.12)' }} />
    ));
  return (
    <div>
      <p style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.6, color: '#6e6e73', maxWidth: 680 }}>
        A disaster recovery plan answers one question: <b>where do we run when our own building is gone?</b> Pick an alternate processing arrangement and weigh the trade-off.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {DR_SITES.map(d => {
          const active = sel === d.id;
          return (
            <button key={d.id} onClick={() => setSel(d.id)}
              style={{ cursor: 'pointer', font: 'inherit', textAlign: 'left', border: `1.5px solid ${active ? d.color : 'rgba(0,0,0,0.1)'}`, background: active ? `${d.color}0c` : '#fff', borderRadius: 16, padding: 18, transition: 'all 0.2s ease' }}>
              <div style={{ fontSize: 26 }}>{d.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', marginTop: 4 }}>{d.label}</div>
              <div style={{ fontSize: 12, color: '#aeaeb2', marginTop: 10 }}>Ongoing cost</div>
              <div>{dot(3, d.cost, d.color)}</div>
              <div style={{ fontSize: 12, color: '#aeaeb2', marginTop: 8 }}>Recovery speed</div>
              <div>{dot(3, d.speed, SAFE)}</div>
            </button>
          );
        })}
      </div>
      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: s.color, textTransform: 'uppercase' }}>{s.icon} {s.label}</div>
        <p style={{ margin: '10px 0 0', fontSize: 16, lineHeight: 1.65, color: '#333' }}>{s.body}</p>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  9 · CONTROL ENVIRONMENT — the human rules
// ════════════════════════════════════════════════════════════════════════════

const CONTROLS = [
  'Separate the accounting and computing functions.',
  'Separate the duties of computer users and systems personnel.',
  'Cancel access privileges the instant an employee is fired.',
  'The board appoints an audit committee, which approves the internal audit director.',
  'Use budgets to control spending on equipment.',
  'Thoroughly test all system security.',
  'Keep a well-documented internal policy against software piracy.',
];

// ════════════════════════════════════════════════════════════════════════════
//  10 · FINAL CHALLENGE — scenario quiz
// ════════════════════════════════════════════════════════════════════════════

const QUIZ = [
  {
    q: 'A clerk enters fake supplier invoices to divert payments to themselves. No code is changed. Which active threat is this?',
    options: ['Program alteration', 'Input manipulation', 'Sabotage', 'Data theft'],
    answer: 1,
    why: 'Manipulating input to achieve an incorrect result — the most common method of fraud because it needs no technical skill.',
  },
  {
    q: 'You want the smallest possible daily backups and accept a slow, multi-tape restore. Which strategy?',
    options: ['Full', 'Differential', 'Incremental', 'No backup'],
    answer: 2,
    why: 'Incremental backs up only what changed since the last backup, so daily backups are tiny — but a restore needs the full plus every increment in the chain.',
  },
  {
    q: 'An attacker is in the building and logged in, but cannot open the payroll file. Which control stopped them?',
    options: ['Site-access control', 'System-access control', 'File-access control', 'A firewall'],
    answer: 2,
    why: 'File-access controls govern what an already-authenticated user is allowed to touch — the innermost ring of the layered defence.',
  },
  {
    q: 'Loss costs $400,000 and has a 25% chance per year. What is the annual loss exposure (quantitative)?',
    options: ['$25,000', '$100,000', '$400,000', '$1,600,000'],
    answer: 1,
    why: 'Loss exposure = cost × likelihood = $400,000 × 0.25 = $100,000.',
  },
  {
    q: 'Code planted by an insider detonates the moment their name leaves the payroll system. This is a…',
    options: ['Worm', 'Trojan horse', 'Logic bomb', 'Virus'],
    answer: 2,
    why: 'A logic bomb is dormant code triggered by a specific later event — here, the disappearance of the payroll record.',
  },
];

function FinalQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const score = answers.reduce((acc: number, a, i) => acc + (a === QUIZ[i].answer ? 1 : 0), 0);

  function pick(qi: number, oi: number) {
    if (submitted) return;
    setAnswers(prev => prev.map((v, i) => (i === qi ? oi : v)));
  }

  return (
    <Card style={{ background: '#fff' }}>
      {QUIZ.map((item, qi) => (
        <div key={qi} style={{ marginBottom: 26, paddingBottom: qi < QUIZ.length - 1 ? 26 : 0, borderBottom: qi < QUIZ.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f', lineHeight: 1.5 }}>
            <span style={{ color: ACCENT, fontWeight: 700 }}>{qi + 1}. </span>{item.q}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginTop: 12 }}>
            {item.options.map((opt, oi) => {
              const picked = answers[qi] === oi;
              let bg = '#fff', bd = 'rgba(0,0,0,0.12)', col = '#1d1d1f';
              if (submitted) {
                if (oi === item.answer) { bg = `${SAFE}12`; bd = SAFE; col = SAFE; }
                else if (picked) { bg = `${DANGER}12`; bd = DANGER; col = DANGER; }
              } else if (picked) { bg = `${ACCENT}10`; bd = ACCENT; col = ACCENT; }
              return (
                <button key={oi} onClick={() => pick(qi, oi)} disabled={submitted}
                  style={{ cursor: submitted ? 'default' : 'pointer', font: 'inherit', fontSize: 14, fontWeight: 600, textAlign: 'left', border: `1.5px solid ${bd}`, background: bg, color: col, borderRadius: 12, padding: '11px 14px', transition: 'all 0.2s ease' }}>
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.55, color: '#6e6e73' }}>
              <b style={{ color: answers[qi] === item.answer ? SAFE : DANGER }}>{answers[qi] === item.answer ? '✓ Correct. ' : '✗ '}</b>{item.why}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={answers.some(a => a === null)}
          style={{ ...navBtn(true), opacity: answers.some(a => a === null) ? 0.4 : 1, cursor: answers.some(a => a === null) ? 'not-allowed' : 'pointer' }}>
          {answers.some(a => a === null) ? 'Answer all five to submit' : 'Submit answers'}
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: score >= 4 ? SAFE : score >= 3 ? WARN : DANGER }}>
            {score} / {QUIZ.length} {score === QUIZ.length ? '🏆' : score >= 3 ? '👍' : '📚'}
          </div>
          <button onClick={() => { setSubmitted(false); setAnswers(Array(QUIZ.length).fill(null)); }} style={navBtn(false)}>↻ Retake</button>
        </div>
      )}
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════════════════

export default function SystemsSecurityLesson() {
  return (
    <div>
      <style>{`@keyframes ssFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

      {/* intro */}
      <Section style={{ marginBottom: 72 }}>
        <Reveal>
          <p style={{ fontSize: 19, lineHeight: 1.7, color: '#1d1d1f', maxWidth: 720, fontWeight: 450 }}>
            Every organisation now runs on information systems — and every one of those systems can be
            interrupted, stolen, corrupted, or destroyed. <b>Systems security</b> is the discipline of
            understanding what could go wrong, deciding how much it would cost, and building the defences
            and recovery plans to survive it.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#6e6e73', maxWidth: 720, marginTop: 16 }}>
            This lesson is built to be <i>played with</i>. Calculate real risk, profile the attackers,
            tell the malware apart, peel back the layers of defence, run a backup simulator, and choose a
            disaster-recovery plan — then test yourself at the end. Start anywhere.
          </p>
        </Reveal>
      </Section>

      {/* 1 — losses */}
      <Section>
        <SectionHeader kicker="Part 1 · The stakes" color={DANGER}
          title="What can you actually lose?"
          blurb="Before defending anything, name what is at risk. A computerised information network exposes six distinct kinds of loss. Tap each to see it in the real world." />
        <LossesExplorer />
      </Section>

      {/* 2 — lifecycle */}
      <Section>
        <SectionHeader kicker="Part 2 · Build it like a system"
          title="A security system has a life cycle"
          blurb="A computer security system is developed like any other information system — through the same four phases. It is never 'finished'; it loops." />
        <LifecycleStepper />
      </Section>

      {/* 3 — risk calculator */}
      <Section>
        <SectionHeader kicker="Part 3 · Measure the risk"
          title="How big is the threat, really?"
          blurb="Two ways to size up a threat. The quantitative approach multiplies cost by likelihood; the qualitative approach simply ranks threats by judgement. Try the calculator." />
        <RiskCalculator />
      </Section>

      {/* 4 — active threats */}
      <Section>
        <SectionHeader kicker="Part 4 · The attackers" color={DANGER}
          title="Active threats: fraud and sabotage"
          blurb="Active threats are deliberate — someone is doing this on purpose. First, who they are; then, the six ways they strike." />
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 28 }}>
            {THREAT_GROUPS.map(g => (
              <div key={g.title} style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: 18, padding: 20, background: '#fafafa' }}>
                <div style={{ fontSize: 28 }}>{g.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 650, color: '#1d1d1f', margin: '8px 0 6px' }}>{g.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: '#6e6e73' }}>{g.body}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <ActiveThreatExplorer />
        <Reveal style={{ marginTop: 16 }}>
          <p style={{ fontSize: 13.5, color: '#aeaeb2', fontStyle: 'italic', margin: 0 }}>
            Note: the white-collar criminal is notoriously hard to identify — managers often avoid public
            prosecution to dodge the negative publicity, so much computer crime never surfaces at all.
          </p>
        </Reveal>
      </Section>

      {/* 5 — malware lab */}
      <Section>
        <SectionHeader kicker="Part 5 · Malware lab" color={DANGER}
          title="Logic bomb, Trojan, worm, or virus?"
          blurb="Sabotage has a toolkit. These four get confused constantly — so let's pin them down. Read the cards, then identify each scenario." />
        <MalwareLab />
      </Section>

      {/* 6 — layered defence */}
      <Section>
        <SectionHeader kicker="Part 6 · Defence in depth" color={SAFE}
          title="Controls for active threats"
          blurb="The answer to a determined attacker is layers. Three rings of access control stand between a perpetrator and the data. Tap a ring." />
        <LayeredDefence />
      </Section>

      {/* 7 — passive threats */}
      <Section>
        <SectionHeader kicker="Part 7 · When nobody is attacking"
          title="Passive threats: failures, not attackers"
          blurb="Power cuts, dead disks, crashed processors — no villain, just entropy. Two controls keep the business running: fault tolerance and backups." />
        <div style={{ display: 'grid', gap: 18 }}>
          <FaultTolerance />
          <div>
            <Reveal>
              <h3 style={{ fontSize: 20, fontWeight: 650, color: '#1d1d1f', margin: '8px 0 4px' }}>🗃️ Backup simulator</h3>
              <p style={{ fontSize: 14.5, color: '#6e6e73', lineHeight: 1.6, margin: '0 0 14px', maxWidth: 680 }}>
                A full backup ran Sunday night. Through the week, files change. Switch the strategy and watch
                what each daily backup saves — and what it costs you to recover after Friday's disaster.
                (Watch the <b>archive bit</b> behaviour described in each card.)
              </p>
            </Reveal>
            <BackupSimulator />
          </div>
        </div>
      </Section>

      {/* 8 — disaster recovery */}
      <Section>
        <SectionHeader kicker="Part 8 · Disaster risk management" color={WARN}
          title="When the whole site is gone"
          blurb="Prevention first — but if disaster wins, a recovery plan and an alternate processing arrangement keep you alive. Weigh the three classic options." />
        <DisasterRecovery />
      </Section>

      {/* 9 — control environment */}
      <Section>
        <SectionHeader kicker="Part 9 · The human layer" color={SAFE}
          title="No system is infallible — so build the culture"
          blurb="Since no security system is perfect, you create an atmosphere where security is the default. These organisational controls do the quiet heavy lifting." />
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {CONTROLS.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fafafa', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '14px 16px' }}>
                <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: `${SAFE}18`, color: SAFE, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.5, color: '#333' }}>{c}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* 10 — quiz */}
      <Section style={{ marginBottom: 40 }}>
        <SectionHeader kicker="Final challenge" color={ACCENT}
          title="Prove it. Five scenarios."
          blurb="Pull it all together — risk, threats, malware, controls, backups. Answer all five, then submit for instant feedback." />
        <FinalQuiz />
      </Section>

      {/* close */}
      <Reveal>
        <div style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 30 }}>🛡️</div>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#1d1d1f', maxWidth: 600, margin: '14px auto 0', fontWeight: 500 }}>
            Security isn't a product you buy once. It's a life cycle: name the risks, size them, build
            layered defences, plan for the failure you hope never comes — then do it all again as the
            threats evolve.
          </p>
          <p style={{ fontSize: 13, color: '#aeaeb2', marginTop: 20 }}>
            MBI800 · Strategic Information Systems · Master of Business Informatics
          </p>
        </div>
      </Reveal>
    </div>
  );
}
