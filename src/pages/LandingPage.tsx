import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BrandMark from '../components/ui/BrandMark';

// ─── Scroll-reveal hook ──────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

// ─── Animated counter ────────────────────────────────────────────────────────
function useCounter(target: number, active: boolean, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

// ─── Story screens ───────────────────────────────────────────────────────────
function AttendanceScreen() {
  const [sec, setSec] = useState(222);
  useEffect(() => {
    const t = setInterval(() => setSec(s => (s > 0 ? s - 1 : 222)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = String(Math.floor(sec / 60)).padStart(1, '0');
  const s = String(sec % 60).padStart(2, '0');
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8b7fa6' }}>Opening Code · MBI802</div>
      <div style={{ fontFamily: 'monospace', fontSize: 52, letterSpacing: '0.18em', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>3KM7QP</div>
      <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#ef4444' }}>Expires in {m}:{s}</div>
      <div style={{ width: 88, height: 88, background: 'repeating-conic-gradient(#7c3aed 0% 25%, transparent 0% 50%) 0 0 / 8px 8px', borderRadius: 10, border: '3px solid #7c3aed', imageRendering: 'pixelated', opacity: 0.85 }} aria-hidden="true" />
      <div style={{ fontSize: 12, color: '#8b7fa6', textAlign: 'center' }}>Scan QR or type code at <span style={{ color: '#7c3aed' }}>/student/attendance</span></div>
    </div>
  );
}

function PlaygroundScreen() {
  const [votes, setVotes] = useState({ up: 22, down: 4 });
  const [present] = useState(['Alice W.', 'Ben K.', 'Priya N.', 'Min-jun L.', 'Amara O.', 'Carlos R.']);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setOffset(o => o + 0.3);
      setVotes(v => Math.random() > 0.92 ? { up: v.up + 1, down: v.down } : v);
    }, 80);
    return () => clearInterval(t);
  }, []);
  const d = `M20,${80 + Math.sin(offset * 0.04) * 12} Q80,${40 + Math.sin(offset * 0.03) * 15} 150,${80 + Math.sin(offset * 0.05) * 10} T290,${70 + Math.sin(offset * 0.04) * 12}`;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'serif', fontSize: 18, fontWeight: 700, color: '#1e1b4b' }}>Normalisation — 3NF</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 11, color: '#059669' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block', animation: 'lpPulse 1.6s ease-in-out infinite' }} />
          Live · {present.length} present
        </div>
      </div>
      <div style={{ background: 'rgba(124,58,237,0.04)', borderRadius: 12, overflow: 'hidden', height: 100 }}>
        <svg viewBox="0 0 310 120" style={{ width: '100%', height: '100%' }}>
          <path d={d} stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="20" y="80" width="90" height="28" rx="4" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          <rect x="130" y="80" width="90" height="28" rx="4" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          <line x1="110" y1="94" x2="130" y2="94" stroke="#7c3aed" strokeWidth="1.5" />
        </svg>
      </div>
      <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.06))', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
        <span>Is this in 3NF?</span>
        <span style={{ fontFamily: 'monospace', color: '#7c3aed' }}>👍 {votes.up} · 👎 {votes.down}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {present.map(n => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 20, padding: '3px 10px', fontSize: 11 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 9, fontWeight: 700 }}>{n[0]}</div>
            {n.split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
  );
}

function FraudScreen() {
  const flags = [
    { sev: 'HIGH', sevColor: '#dc2626', bg: '#fef2f2', label: 'Shared IP', desc: '2 students on 203.0.113.42 · Opening', time: '9:02' },
    { sev: 'MED', sevColor: '#d97706', bg: '#fffbeb', label: 'Location Outlier', desc: 'Charlie K — 1.2 km off cluster', time: '9:04' },
    { sev: 'MED', sevColor: '#d97706', bg: '#fffbeb', label: 'Rapid Submission', desc: '11 s apart, same IP · Mid-session', time: '9:05' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8b7fa6', marginBottom: 4 }}>⚠ Suspicious Activity — {flags.length} flags</div>
      {flags.map((f, i) => (
        <div key={f.label} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center', padding: '12px 14px', background: '#fff', border: '1px solid rgba(139,92,246,0.12)', borderRadius: 12, animation: `lpSlideIn 0.5s ease ${i * 0.4}s both` }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', background: f.bg, color: f.sevColor, padding: '3px 8px', borderRadius: 4 }}>{f.sev}</span>
          <div style={{ fontSize: 12, color: '#4a4a6a' }}><strong style={{ color: '#1e1b4b' }}>{f.label}</strong> — {f.desc}</div>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8b7fa6' }}>{f.time}</span>
        </div>
      ))}
    </div>
  );
}

function MatchScreen() {
  const matches = [
    { name: 'Priya N.', score: 9, tags: ['Same course', 'Software', 'India'], grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
    { name: 'Min-jun L.', score: 7, tags: ['Auckland', 'Banking', 'Korea'], grad: 'linear-gradient(135deg,#2dd4bf,#60a5fa)' },
    { name: 'Amara O.', score: 6, tags: ['Same intake', 'Healthcare', 'Ghana'], grad: 'linear-gradient(135deg,#f97316,#fbbf24)' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: 'serif', fontSize: 22, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Your matches today</div>
      {matches.map((m, i) => (
        <div key={m.name} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#fff', border: '1px solid rgba(139,92,246,0.12)', borderRadius: 12, animation: `lpSlideIn 0.4s ease ${i * 0.25}s both` }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: m.grad, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>{m.name[0]}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1e1b4b' }}>{m.name}</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
              {m.tags.map(t => <span key={t} style={{ fontFamily: 'monospace', fontSize: 10, color: '#8b7fa6', border: '1px solid rgba(139,92,246,0.2)', padding: '2px 7px', borderRadius: 99 }}>{t}</span>)}
            </div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#7c3aed' }}>{m.score} / 10</div>
        </div>
      ))}
    </div>
  );
}

// ─── SQL Lab Simulation ──────────────────────────────────────────────────────
const SQL_SCENARIOS = [
  {
    name: 'Library',
    query: `SELECT b.title, COUNT(l.loan_id) AS loans\nFROM books b\nJOIN loans l ON b.book_id = l.book_id\nWHERE l.return_date IS NULL\nGROUP BY b.title\nHAVING COUNT(l.loan_id) > 1\nORDER BY loans DESC;`,
    question: 'Find all books currently on loan to more than one member.',
  },
  {
    name: 'Hospital',
    query: `SELECT p.name, d.name AS doctor,\n       a.appointment_date\nFROM patients p\nJOIN appointments a ON p.id = a.patient_id\nJOIN doctors d ON a.doctor_id = d.id\nWHERE a.status = 'pending'\nORDER BY a.appointment_date;`,
    question: 'List all pending appointments with patient and doctor names.',
  },
  {
    name: 'School',
    query: `SELECT s.name, AVG(g.score) AS avg_score\nFROM students s\nJOIN grades g ON s.id = g.student_id\nJOIN subjects sub ON g.subject_id = sub.id\nWHERE sub.name = 'Database Systems'\nGROUP BY s.name\nORDER BY avg_score DESC;`,
    question: 'Rank students by their average score in Database Systems.',
  },
];

const VERIFY_STEPS = [
  { icon: '🔍', label: 'Syntax Check', pass: 'Valid SQL' },
  { icon: '📋', label: 'Schema Match', pass: 'Tables found' },
  { icon: '🧠', label: 'Logic Check', pass: 'JOIN correct' },
  { icon: '📊', label: 'Output Match', pass: 'Results verified' },
  { icon: '🎯', label: 'Edge Cases', pass: 'NULL handled' },
];

function SQLLabSim({ activeTab }: { activeTab: 'student' | 'staff' }) {
  const [scenario, setScenario] = useState(0);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const sc = SQL_SCENARIOS[scenario];

  function runVerify() {
    setStep(-1);
    setRunning(true);
    VERIFY_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setStep(i);
        if (i === VERIFY_STEPS.length - 1) setRunning(false);
      }, (i + 1) * 500);
    });
  }

  if (activeTab === 'staff') {
    const students = [
      { name: 'Alice Wong', id: 'S12345', lib: 3, hosp: 3, school: 2, pct: 89 },
      { name: 'Ben Kumar', id: 'S23456', lib: 3, hosp: 2, school: 1, pct: 67 },
      { name: 'Priya Nair', id: 'S34567', lib: 2, hosp: 1, school: 0, pct: 44 },
      { name: 'Min-jun Lee', id: 'S45678', lib: 3, hosp: 3, school: 3, pct: 100 },
      { name: 'Amara Osei', id: 'S56789', lib: 1, hosp: 0, school: 0, pct: 11 },
    ];
    return (
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(139,92,246,0.15)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.04))', padding: '16px 20px', borderBottom: '1px solid rgba(139,92,246,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1e1b4b' }}>SQL Lab Progress</div>
            <div style={{ fontSize: 12, color: '#8b7fa6', marginTop: 2 }}>MBI802 · Library · Hospital · School scenarios</div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, background: 'rgba(124,58,237,0.08)', color: '#7c3aed', padding: '4px 10px', borderRadius: 99 }}>Live</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(124,58,237,0.03)' }}>
              {['Student', 'Library', 'Hospital', 'School', 'Progress'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', fontWeight: 600, borderBottom: '1px solid rgba(139,92,246,0.08)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? '1px solid rgba(139,92,246,0.06)' : 'none' }}>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1e1b4b' }}>{s.name}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8b7fa6' }}>{s.id}</div>
                </td>
                {[s.lib, s.hosp, s.school].map((v, j) => (
                  <td key={j} style={{ padding: '10px 16px' }}>
                    <span style={{ background: v === 3 ? 'rgba(52,211,153,0.12)' : v >= 2 ? 'rgba(251,191,36,0.12)' : 'rgba(251,113,133,0.12)', color: v === 3 ? '#059669' : v >= 2 ? '#d97706' : '#e11d48', padding: '2px 8px', borderRadius: 99, fontFamily: 'monospace', fontSize: 11 }}>
                      {v}/3 ✓
                    </span>
                  </td>
                ))}
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(139,92,246,0.12)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.pct}%`, background: s.pct === 100 ? 'linear-gradient(90deg,#34d399,#2dd4bf)' : 'linear-gradient(90deg,#7c3aed,#a78bfa)', borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#7c3aed', minWidth: 36 }}>{s.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Scenario selector */}
      <div style={{ display: 'flex', gap: 8 }}>
        {SQL_SCENARIOS.map((sc, i) => (
          <button key={sc.name} onClick={() => { setScenario(i); setStep(-1); }} style={{ padding: '6px 16px', borderRadius: 99, border: `1px solid ${scenario === i ? '#7c3aed' : 'rgba(139,92,246,0.2)'}`, background: scenario === i ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'transparent', color: scenario === i ? '#fff' : '#7c3aed', fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
            {sc.name}
          </button>
        ))}
      </div>
      {/* Question */}
      <div style={{ background: 'rgba(124,58,237,0.05)', borderRadius: 12, padding: '12px 16px', borderLeft: '3px solid #7c3aed' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7c3aed', marginBottom: 6 }}>Question</div>
        <div style={{ fontSize: 14, color: '#1e1b4b' }}>{sc.question}</div>
      </div>
      {/* Query editor */}
      <div style={{ background: '#0f0f1a', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ background: '#1a1a2e', padding: '8px 16px', display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e6a39a' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e6cf8c' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a8cba6' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280', marginLeft: 8 }}>query.sql</span>
        </div>
        <pre style={{ padding: '16px', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7, color: '#a78bfa', margin: 0, overflowX: 'auto' }}>{sc.query.split('\n').map((line, i) => {
          const keywords = ['SELECT', 'FROM', 'JOIN', 'ON', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'COUNT', 'AVG', 'IS NULL', 'ASC', 'DESC', 'AND', 'AS'];
          let colored = line;
          keywords.forEach(kw => { colored = colored.replace(new RegExp(`\\b${kw}\\b`, 'g'), `\x00${kw}\x01`); });
          const parts = colored.split(/\x00|\x01/);
          return (
            <div key={i}>
              {parts.map((p, j) => (
                <span key={j} style={{ color: keywords.includes(p) ? '#f59e0b' : p.startsWith("'") ? '#34d399' : '#a78bfa' }}>{p}</span>
              ))}
            </div>
          );
        })}</pre>
      </div>
      {/* Verification */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(139,92,246,0.15)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1e1b4b' }}>Verification Pipeline</div>
          <button onClick={runVerify} disabled={running} style={{ padding: '6px 16px', borderRadius: 99, background: running ? 'rgba(139,92,246,0.15)' : 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: running ? '#8b7fa6' : '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer' }}>
            {running ? 'Checking…' : 'Run Check'}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VERIFY_STEPS.map((vs, i) => {
            const done = step >= i;
            const active = step === i - 1 && running;
            return (
              <div key={vs.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, background: done ? 'rgba(52,211,153,0.06)' : active ? 'rgba(124,58,237,0.06)' : 'rgba(139,92,246,0.02)', border: `1px solid ${done ? 'rgba(52,211,153,0.2)' : active ? 'rgba(124,58,237,0.2)' : 'rgba(139,92,246,0.08)'}`, transition: 'all 0.35s ease' }}>
                <span style={{ fontSize: 16 }}>{vs.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: done ? '#059669' : '#4a4a6a' }}>{vs.label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: done ? '#059669' : active ? '#7c3aed' : '#9ca3af' }}>
                  {done ? `✓ ${vs.pass}` : active ? '…' : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function LandingPage() {
  const { user, role } = useAuth();
  const dashPath = role === 'student' ? '/student/dashboard' : '/lecturer/dashboard';

  const [scrolled, setScrolled] = useState(false);
  const [activeAudTab, setActiveAudTab] = useState<'students' | 'staff'>('students');
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [sqlTab, setSqlTab] = useState<'student' | 'staff'>('student');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Scroll-spy for story steps
  const stepRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  useEffect(() => {
    const ios = stepRefs.map((ref, i) => {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveStoryStep(i); }, { threshold: 0.55, rootMargin: '-20% 0px -30% 0px' });
      if (ref.current) io.observe(ref.current);
      return io;
    });
    return () => ios.forEach(io => io.disconnect());
  }, []);

  // Metric refs + counters
  const [metricsRef, metricsInView] = useInView();
  const c1 = useCounter(2847, metricsInView);
  const c2 = useCounter(47, metricsInView);
  const c3 = useCounter(23, metricsInView);
  const c4 = useCounter(34, metricsInView);
  const c5 = useCounter(100, metricsInView);
  const c6 = useCounter(22, metricsInView);
  const c7 = useCounter(8, metricsInView);
  const c8 = useCounter(3, metricsInView);

  const [problemRef, problemInView] = useInView();
  const [audRef, audInView] = useInView();
  const [sqlRef, sqlInView] = useInView();
  const [techRef, techInView] = useInView();

  const storyScreens = [
    <AttendanceScreen key="attendance" />,
    <PlaygroundScreen key="playground" />,
    <FraudScreen key="fraud" />,
    <MatchScreen key="match" />,
  ];

  const studentFeatures = [
    { icon: '①', title: 'Daily Match', desc: 'Each login, an algorithm scores every peer in your cohort for compatibility — education, industry, hometown, course. See who you should be studying with before class starts.', tag: '10-pt compatibility score', link: '/student/dashboard' },
    { icon: '②', title: 'Live Playground', desc: 'Real-time shared canvas, live polls, and a class-wide checklist. Vote, observe lecturer diagrams, and complete tasks — all in sync as the lecture happens.', tag: 'Real-time Firestore sync', link: '/student/playground' },
    { icon: '③', title: 'One-tap Attendance', desc: 'A six-character code or a QR scan within a four-minute window. Opening and Mid-session checkpoints together confirm you didn\'t just walk in to sign and leave.', tag: 'QR + code dual-mode', link: '/student/attendance' },
    { icon: '④', title: 'Resource Library', desc: 'Slide decks, video lessons, SQL practice scenarios, and an interactive prompt lab — all in-platform. No chasing PDFs across email and Moodle.', tag: '6 deck modules + video', link: '/student/course-resources' },
    { icon: '⑤', title: 'Quiz Badges', desc: '100+ multiple-choice questions on ER diagrams, Agile/Scrum, and DBMS. Distinction-level scores (≥90%) earn a persistent badge on your profile.', tag: '3 quiz banks · badge system', link: '/student/course-resources' },
    { icon: '⑥', title: 'Attendance Transparency', desc: 'See your own attended, absent-justified, and absent-unjustified count per course, live. No surprises at semester end. Report absences in advance.', tag: 'Live calculation', link: '/student/history' },
  ];

  const staffFeatures = [
    { icon: '①', title: 'Fraud Detection', desc: 'Three algorithms run on every session: shared-IP clustering, GPS outlier detection (500 m threshold), and rapid-submission analysis (30 s window). Patterns flagged before you open a spreadsheet.', tag: '3 detection types · auto-run', link: '/lecturer/attendance' },
    { icon: '②', title: 'Live Lesson Tools', desc: 'Launch a real-time canvas, post a yes/no poll, or push a checklist — and watch students respond instantly. Every interaction logged. Leave class with engagement data, not impressions.', tag: 'Canvas · Poll · Checklist', link: '/lecturer/playground' },
    { icon: '③', title: 'Cohort Analytics', desc: 'Quiz score distributions, login analytics, attendance per course, per campus, per intake. Surface struggling students before mid-semester reports arrive.', tag: 'Recharts dashboards', link: '/lecturer/analytics' },
    { icon: '④', title: 'CSV Export', desc: 'Every checkpoint exports to CSV with student ID, name, campus, section, timestamp, device, and location status — ready for compliance and immigration reporting.', tag: 'One-click audit-ready export', link: '/lecturer/attendance' },
    { icon: '⑤', title: 'Manual Overrides', desc: 'Edge cases happen: medical absences, late approvals, technical failures. Apply per-student deltas without breaking the audit trail. Every override is logged with reason and staff UID.', tag: 'Auditable delta system', link: '/lecturer/students' },
    { icon: '⑥', title: 'Role-Based Access', desc: 'Students, lecturers, and TAs each get the right permissions, enforced both client-side and at database level via Firestore security rules. Built for institutional governance.', tag: '3 roles · 22 protected routes', link: '/lecturer/dashboard' },
  ];

  const metrics = [
    { n: c1, suffix: '+', label: 'Site Visits', desc: 'Since platform launch this semester' },
    { n: c2, suffix: '', label: 'Registered Students', desc: 'Across Auckland and Christchurch campuses' },
    { n: c3, suffix: '', label: 'Daily Active Users', desc: 'Average on teaching days' },
    { n: c4, suffix: '+', label: 'Sessions Held', desc: 'Attendance sessions run this semester' },
    { n: c5, suffix: '+', label: 'MCQ Questions', desc: 'Across ER, Agile/Scrum, and DBMS banks' },
    { n: c6, suffix: '', label: 'Learning Resources', desc: 'Decks, videos, quizzes, and SQL labs' },
    { n: c7, suffix: '', label: 'Fraud Flags Raised', desc: 'Suspicious patterns auto-detected' },
    { n: c8, suffix: '', label: 'Courses Covered', desc: 'MBI800, MBI802, MBI804' },
  ];

  const tech = [
    { layer: 'Language', name: 'TypeScript 5' },
    { layer: 'UI Framework', name: 'React 18' },
    { layer: 'Build Tool', name: 'Vite 5' },
    { layer: 'Styling', name: 'Tailwind CSS 3' },
    { layer: 'Auth', name: 'Firebase Auth' },
    { layer: 'Database', name: 'Cloud Firestore' },
    { layer: 'Storage', name: 'Firebase Storage' },
    { layer: 'Charts', name: 'Recharts' },
    { layer: 'Maps', name: 'React-Leaflet' },
    { layer: 'Deployment', name: 'GitHub Pages' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: 'var(--bg-page)', color: '#1e1b4b', overflowX: 'hidden' }}>
      <style>{`
        @keyframes lpFloat  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
        @keyframes lpFloatB { 0%,100%{transform:translateY(-6px)} 50%{transform:translateY(6px)} }
        @keyframes lpFloatC { 0%,100%{transform:translateY(4px)}  50%{transform:translateY(-8px)} }
        @keyframes lpPulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes lpMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes lpReveal { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lpSlideIn { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes lpScaleIn { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        @keyframes lpOrbDrift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,30px) scale(.96)} }
        @keyframes lpBorderAnim { 0%,100%{border-color:rgba(124,58,237,.2)} 50%{border-color:rgba(167,139,250,.6)} }
        @keyframes lpTypingBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes lpDrawLine { to{stroke-dashoffset:0} }
        .lp-reveal-item { opacity:0; transform:translateY(24px); transition:opacity .75s cubic-bezier(.2,.7,.2,1), transform .75s cubic-bezier(.2,.7,.2,1); }
        .lp-reveal-item.lp-visible { opacity:1; transform:none; }
        .lp-stagger > *:nth-child(1) { transition-delay:.04s }
        .lp-stagger > *:nth-child(2) { transition-delay:.13s }
        .lp-stagger > *:nth-child(3) { transition-delay:.22s }
        .lp-stagger > *:nth-child(4) { transition-delay:.31s }
        .lp-stagger > *:nth-child(5) { transition-delay:.40s }
        .lp-stagger > *:nth-child(6) { transition-delay:.49s }
      `}</style>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', background: scrolled ? 'rgba(245,244,255,.92)' : 'rgba(245,244,255,.60)', borderBottom: scrolled ? '1px solid rgba(139,92,246,.15)' : '1px solid transparent', transition: 'all .3s ease' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <BrandMark className="h-8 w-8" />
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>YooBees</span>
        </a>
        <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: 0, padding: 0 }}>
          {[['#problem', 'Problem'], ['#audience', "Who it's for"], ['#story', 'How it works'], ['#sql-lab', 'SQL Lab'], ['#numbers', 'Stats']].map(([href, label]) => (
            <li key={href}><a href={href} style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', transition: 'color .2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#7c3aed')} onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>{label}</a></li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 10 }}>
          {user ? (
            <Link to={dashPath} style={{ padding: '9px 20px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,.35)' }}>
              Open Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ padding: '9px 18px', borderRadius: 99, border: '1px solid rgba(124,58,237,.3)', color: '#7c3aed', fontWeight: 600, fontSize: 13, textDecoration: 'none', transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,.06)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                Sign In
              </Link>
              <Link to="/register" style={{ padding: '9px 20px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,.35)' }}>
                Get Started →
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section id="top" style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,.18) 0%, transparent 70%)', top: -200, right: -100, animation: 'lpOrbDrift 18s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,121,160,.12) 0%, transparent 70%)', bottom: -100, left: -80, animation: 'lpOrbDrift 14s ease-in-out infinite 3s' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,.14) 0%, transparent 70%)', top: '40%', left: '25%', animation: 'lpFloat 10s ease-in-out infinite 1s' }} />
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,.08)', border: '1px solid rgba(124,58,237,.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 36, animation: 'lpReveal .6s ease both' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', animation: 'lpPulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7c3aed' }}>A platform for postgraduate teaching · Yoobee Colleges · 2026</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            {/* Left: text */}
            <div>
              <h1 style={{ fontSize: 'clamp(52px, 8vw, 100px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92, margin: '0 0 28px', animation: 'lpReveal .7s ease .1s both' }}>
                Teaching,<br />
                <span style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>attended</span>.<br />
                Learning,<br />
                <span style={{ WebkitTextStroke: '2px #7c3aed', color: 'transparent' }}>measured</span>.
              </h1>
              <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.6, maxWidth: '46ch', marginBottom: 36, animation: 'lpReveal .7s ease .2s both' }}>
                <strong style={{ color: '#1e1b4b' }}>YooBees</strong> is a real-time platform built specifically for postgraduate education — combining fraud-resistant attendance, a live lesson playground, and a learning resource library currently teaching <strong style={{ color: '#7c3aed' }}>Masters of Business Informatics</strong> at Yoobee Colleges.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animation: 'lpReveal .7s ease .3s both' }}>
                {user ? (
                  <Link to={dashPath} style={{ padding: '14px 28px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 6px 20px rgba(124,58,237,.4)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Open Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link to="/register" style={{ padding: '14px 28px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 6px 20px rgba(124,58,237,.4)' }}>
                      Get Started →
                    </Link>
                    <Link to="/login" style={{ padding: '14px 28px', borderRadius: 99, border: '1.5px solid rgba(124,58,237,.3)', color: '#7c3aed', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              {/* Mini stats */}
              <div style={{ display: 'flex', gap: 28, marginTop: 44, paddingTop: 28, borderTop: '1px solid rgba(139,92,246,.12)', animation: 'lpReveal .7s ease .4s both' }}>
                {[['47', 'Students'], ['22', 'Routes'], ['3', 'Fraud algs']].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</div>
                    <div style={{ fontSize: 11, color: '#8b7fa6', marginTop: 2, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating mock windows */}
            <div style={{ position: 'relative', height: 520, animation: 'lpReveal .8s ease .2s both' }}>
              {/* Main window */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(20px)', borderRadius: 20, border: '1px solid rgba(139,92,246,.2)', boxShadow: '0 24px 64px rgba(124,58,237,.16)', padding: 20, animation: 'lpFloat 8s ease-in-out infinite' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e6a39a' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e6cf8c' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a8cba6' }} />
                  <div style={{ flex: 1, marginLeft: 10, background: 'rgba(124,58,237,.06)', borderRadius: 6, padding: '3px 10px', fontFamily: 'monospace', fontSize: 10, color: '#8b7fa6' }}>yoobees.app / attendance / opening</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '8px 0' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8b7fa6' }}>Opening Code · MBI802</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 42, letterSpacing: '0.18em', fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>3KM7QP</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#ef4444' }}>Expires in 3:42</div>
                  <div style={{ width: 72, height: 72, background: 'repeating-conic-gradient(#7c3aed 0% 25%, transparent 0% 50%) 0 0 / 8px 8px', borderRadius: 8, border: '3px solid #7c3aed', imageRendering: 'pixelated', opacity: .85 }} />
                </div>
              </div>
              {/* Floating fraud flag */}
              <div style={{ position: 'absolute', bottom: 40, right: -20, width: 260, background: 'rgba(255,255,255,.95)', borderRadius: 14, border: '1px solid rgba(220,38,38,.15)', boxShadow: '0 12px 36px rgba(220,38,38,.1)', padding: '12px 16px', animation: 'lpFloatB 7s ease-in-out infinite' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ background: '#fef2f2', color: '#dc2626', fontFamily: 'monospace', fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>HIGH</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1e1b4b' }}>Shared IP Detected</span>
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>2 students · 203.0.113.42 · Opening</div>
              </div>
              {/* Floating match card */}
              <div style={{ position: 'absolute', bottom: -20, left: -20, background: 'rgba(255,255,255,.95)', borderRadius: 14, border: '1px solid rgba(139,92,246,.15)', boxShadow: '0 12px 36px rgba(124,58,237,.12)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, animation: 'lpFloatC 9s ease-in-out infinite' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>P</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Priya N.</div>
                  <div style={{ fontSize: 11, color: '#8b7fa6' }}>Match score: <span style={{ color: '#7c3aed', fontWeight: 700 }}>9/10</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'lpReveal 1s ease .8s both' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af' }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #a78bfa, transparent)', animation: 'lpFloat 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ── Marquee ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(139,92,246,.12)', borderBottom: '1px solid rgba(139,92,246,.12)', background: 'rgba(255,255,255,.6)', backdropFilter: 'blur(8px)', padding: '16px 0', overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', gap: 64, whiteSpace: 'nowrap', animation: 'lpMarquee 36s linear infinite', willChange: 'transform' }}>
          {['Live attendance', 'Fraud detection', 'Real-time canvas', 'Peer matching', 'Quiz analytics', 'SQL lab', 'Multi-campus', 'ER diagrams', 'Agile/Scrum MCQ', 'Video lessons', 'Live attendance', 'Fraud detection', 'Real-time canvas', 'Peer matching', 'Quiz analytics', 'SQL lab', 'Multi-campus', 'ER diagrams', 'Agile/Scrum MCQ', 'Video lessons'].map((t, i) => (
            <span key={i} style={{ fontStyle: 'italic', fontSize: 22, color: '#8b7fa6', fontFamily: 'serif' }}>
              <span style={{ color: '#7c3aed', fontStyle: 'normal', marginRight: 48, fontSize: 14 }}>✦</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Problem ─────────────────────────────────────────────────────── */}
      <section id="problem" style={{ padding: '120px 0 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div ref={problemRef} className={`lp-reveal-item ${problemInView ? 'lp-visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 64 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bfa' }}>01 — The problem</div>
            </div>
            <div>
              <h2 style={{ fontSize: 'clamp(36px,5vw,68px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 20 }}>
                Postgraduate classrooms need <em style={{ color: '#7c3aed', fontStyle: 'italic' }}>more</em> than a roll call.
              </h2>
              <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.6 }}>
                Spreadsheet attendance, fragmented tools, passive lectures, and no real way to know if students are engaged — or even present. Existing LMS platforms are built for large undergraduate cohorts. Masters teaching is a different sport.
              </p>
            </div>
          </div>

          <div className={`lp-stagger ${problemInView ? 'lp-visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.12)', borderRadius: 20, overflow: 'hidden' }}>
            {[
              { q: 'Sign-in sheets are easy to cheat.', a: 'Students sign each other in. Roll-call codes get screenshotted and shared. Staff lose hours auditing manually.', punch: 'YooBees flags the patterns automatically.' },
              { q: 'Lectures feel one-directional.', a: "Postgraduates expect interaction. Drawing on a whiteboard the back row can't read, or asking 'any questions?' to silence, is the default.", punch: 'YooBees turns every lesson into a live, two-way space.' },
              { q: "Cohorts don't know each other.", a: 'Students fly in from a dozen countries and don\'t realise they share a degree, a hometown, or an industry.', punch: 'YooBees pairs them on day one.' },
            ].map(({ q, a, punch }) => (
              <div key={q} className="lp-reveal-item" style={{ background: 'rgba(255,255,255,.92)', padding: '36px 30px', minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'background .3s' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,243,255,.95)')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.92)')}>
                <div style={{ fontFamily: 'serif', fontSize: 28, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#1e1b4b' }}>{q}</div>
                <div>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.55, marginBottom: 12 }}>{a}</p>
                  <p style={{ fontSize: 14, color: '#7c3aed', fontWeight: 600 }}>{punch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Audience ────────────────────────────────────────────────────── */}
      <section id="audience" style={{ background: '#0f0a1e', padding: '100px 0', margin: '60px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 500px at 80% 20%, rgba(124,58,237,.22), transparent 60%), radial-gradient(600px 400px at 10% 90%, rgba(167,139,250,.1), transparent 60%)', pointerEvents: 'none' }} />
        <div ref={audRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
          <div className={`lp-reveal-item ${audInView ? 'lp-visible' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 24 }}>
            <h2 style={{ fontFamily: 'serif', fontSize: 'clamp(40px,6vw,80px)', fontWeight: 400, lineHeight: 1, color: '#f5f3ff', letterSpacing: '-0.025em' }}>
              One platform.<br /><span style={{ color: '#a78bfa', fontStyle: 'italic' }}>Two audiences.</span>
            </h2>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 99, padding: 4 }}>
              {(['students', 'staff'] as const).map(t => (
                <button key={t} onClick={() => setActiveAudTab(t)} style={{ padding: '10px 22px', fontSize: 12, borderRadius: 99, color: activeAudTab === t ? '#1e1b4b' : 'rgba(255,255,255,.6)', background: activeAudTab === t ? '#f5f3ff' : 'transparent', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', transition: 'all .3s ease' }}>
                  For {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {(activeAudTab === 'students' ? studentFeatures : staffFeatures).map(f => (
              <Link key={f.title} to={f.link} style={{ textDecoration: 'none', border: '1px solid rgba(255,255,255,.1)', borderRadius: 18, padding: '28px', background: 'rgba(255,255,255,.02)', transition: 'all .35s ease', display: 'block', animation: 'lpScaleIn .4s ease both' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(124,58,237,.2)', color: '#a78bfa', display: 'grid', placeItems: 'center', marginBottom: 20, fontSize: 18 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'serif', fontWeight: 400, fontSize: 24, letterSpacing: '-0.01em', color: '#f5f3ff', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,.6)', marginBottom: 16 }}>{f.desc}</p>
                <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.5)', padding: '4px 10px', borderRadius: 99 }}>{f.tag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works (sticky story) ──────────────────────────────────── */}
      <section id="story" style={{ padding: '80px 0 140px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 72 }}>
            <div><div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bfa' }}>02 — How it works</div></div>
            <div>
              <h2 style={{ fontSize: 'clamp(36px,5vw,68px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 16 }}>
                Four flagship moments in a <em style={{ color: '#7c3aed' }}>single class.</em>
              </h2>
              <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.55 }}>From walking through the door to the post-session analytics — a typical Wednesday in MBI802.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22vh', paddingTop: '10vh' }}>
              {[
                { title: '9:00 — Opening code launches.', body: "The lecturer clicks Launch Opening. A six-character code from a deliberately ambiguity-free alphabet (no 0/O/1/I) appears, plus a scannable QR. Students have four minutes to submit — opening and mid-session checkpoints together verify real presence." },
                { title: '9:15 — Live playground opens.', body: "A real-time canvas, polls, and a shared checklist materialise. Every student's presence is tracked. Drawings sync across all devices as the lecturer draws. Votes tally live as they're cast." },
                { title: '10:30 — Suspicious activity flagged.', body: "Two students submitted within 11 seconds from the same IP. Another's GPS is 1.2 km off the cohort cluster. Three detection algorithms ran automatically. The platform raised the flags before the lecturer even checked the results." },
                { title: '11:00 — Daily Match queued.', body: "The matching algorithm scores every pairing in the cohort. Each student opens their dashboard to three new peers ranked by shared background, industry, and hometown — with the reasons visible alongside each score." },
              ].map((step, i) => (
                <div key={i} ref={stepRefs[i]} data-step={i} style={{ opacity: activeStoryStep === i ? 1 : 0.25, transition: 'opacity .5s ease', maxWidth: '44ch' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#a78bfa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                    Step 0{i + 1} <div style={{ flex: 1, height: 1, background: 'rgba(167,139,250,.25)' }} />
                  </div>
                  <h3 style={{ fontFamily: 'serif', fontSize: 38, fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 14 }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.65 }}>{step.body}</p>
                </div>
              ))}
            </div>

            {/* Sticky screen */}
            <div style={{ position: 'sticky', top: '18vh', height: '62vh', display: 'grid', placeItems: 'center' }}>
              <div style={{ width: '100%', background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,.15)', borderRadius: 24, boxShadow: '0 24px 64px rgba(124,58,237,.14)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 480 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '16px 20px', borderBottom: '1px solid rgba(139,92,246,.1)', background: 'rgba(245,243,255,.5)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e6a39a' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e6cf8c' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a8cba6' }} />
                  <div style={{ flex: 1, marginLeft: 10, background: 'rgba(124,58,237,.06)', borderRadius: 6, padding: '3px 10px', fontFamily: 'monospace', fontSize: 10, color: '#8b7fa6' }}>
                    yoobees.app / {['attendance/opening', 'playground', 'attendance/results', 'dashboard'][activeStoryStep]}
                  </div>
                </div>
                <div key={activeStoryStep} style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', animation: 'lpScaleIn .4s ease both' }}>
                  {storyScreens[activeStoryStep]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SQL Lab Deep Dive ─────────────────────────────────────────────── */}
      <section id="sql-lab" style={{ padding: '100px 0', background: 'rgba(255,255,255,.5)', borderTop: '1px solid rgba(139,92,246,.1)', borderBottom: '1px solid rgba(139,92,246,.1)' }}>
        <div ref={sqlRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div className={`lp-reveal-item ${sqlInView ? 'lp-visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 60 }}>
            <div><div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bfa' }}>03 — Novel SQL Learning Lab</div></div>
            <div>
              <h2 style={{ fontSize: 'clamp(36px,5vw,68px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 16 }}>
                Not textbook queries.<br /><span style={{ color: '#7c3aed' }}>Real schemas, real feedback.</span>
              </h2>
              <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.6, maxWidth: '58ch' }}>
                The SQL Practice Lab drops students into realistic database scenarios — a library management system, a hospital records database, a school grade tracker — and asks them to solve real problems. Five automated verification steps deliver instant, actionable feedback. Staff see every student's progress live.
              </p>
            </div>
          </div>

          {/* How it works steps */}
          <div className={`lp-stagger ${sqlInView ? 'lp-visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 48 }}>
            {[
              { n: '01', icon: '🗂', title: 'Pick a Scenario', desc: 'Library · Hospital · School — each with real tables, foreign keys, and edge-case data.' },
              { n: '02', icon: '📝', title: 'Read the Schema', desc: 'Students see the full table structure before writing. Context mirrors real-world database design.' },
              { n: '03', icon: '⌨', title: 'Write SQL', desc: 'An in-browser editor with syntax hints. No locked-down interface — students use real SQL patterns.' },
              { n: '04', icon: '🔬', title: '5-Step Verify', desc: 'Syntax → Schema match → Logic → Output compare → Edge cases. Each step runs in sequence with clear pass/fail.' },
              { n: '05', icon: '📊', title: 'Staff Tracks All', desc: 'Lecturer dashboard shows per-student completion, last-active time, and scenario progress bars.' },
            ].map(s => (
              <div key={s.n} className="lp-reveal-item" style={{ background: 'rgba(255,255,255,.92)', border: '1px solid rgba(139,92,246,.12)', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#a78bfa', letterSpacing: '0.12em', marginBottom: 8 }}>{s.n}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: '#1e1b4b' }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Interactive demo */}
          <div style={{ background: 'rgba(255,255,255,.8)', borderRadius: 20, border: '1px solid rgba(139,92,246,.15)', overflow: 'hidden' }}>
            <div style={{ borderBottom: '1px solid rgba(139,92,246,.1)', padding: '16px 24px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 14 }}>Interactive Preview</span>
              <div style={{ marginLeft: 'auto', display: 'flex', background: 'rgba(124,58,237,.06)', border: '1px solid rgba(124,58,237,.15)', borderRadius: 99, padding: 4 }}>
                {(['student', 'staff'] as const).map(t => (
                  <button key={t} onClick={() => setSqlTab(t)} style={{ padding: '7px 18px', borderRadius: 99, border: 'none', background: sqlTab === t ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'transparent', color: sqlTab === t ? '#fff' : '#7c3aed', fontWeight: 600, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize' }}>
                    {t === 'student' ? '👨‍💻 Student View' : '👩‍🏫 Staff View'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: 24 }}>
              <SQLLabSim activeTab={sqlTab} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics ─────────────────────────────────────────────────────── */}
      <section id="numbers" style={{ padding: '100px 0', borderTop: '1px solid rgba(139,92,246,.1)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 60 }}>
            <div><div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bfa' }}>04 — By the numbers</div></div>
            <div>
              <h2 style={{ fontSize: 'clamp(36px,5vw,68px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
                What's actually <em style={{ color: '#7c3aed' }}>built.</em>
              </h2>
              <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.6, marginTop: 16 }}>Not a prototype. Not a pitch deck. A live system, deployed, used weekly in postgraduate teaching.</p>
            </div>
          </div>

          <div ref={metricsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {metrics.map(({ n, suffix, label, desc }, i) => (
              <div key={label} style={{ padding: '0 32px', borderLeft: i === 0 ? 'none' : '1px solid rgba(139,92,246,.12)', paddingLeft: i === 0 ? 0 : 32 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, fontFamily: 'serif', fontSize: 'clamp(44px,5.5vw,80px)', fontWeight: 400, lineHeight: 1, letterSpacing: '-0.03em', color: '#1e1b4b' }}>
                  {n.toLocaleString()}
                  {suffix && <span style={{ fontSize: 22, color: '#7c3aed', fontStyle: 'italic' }}>{suffix}</span>}
                </div>
                <div style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8b7fa6' }}>{label}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: '#9ca3af', lineHeight: 1.45 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ──────────────────────────────────────────────────── */}
      <section id="tech" style={{ padding: '100px 0', background: 'rgba(255,255,255,.4)', borderTop: '1px solid rgba(139,92,246,.1)' }}>
        <div ref={techRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div className={`lp-reveal-item ${techInView ? 'lp-visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 80, alignItems: 'center' }}>
            {/* Stack grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.12)', borderRadius: 20, overflow: 'hidden' }}>
              {tech.map(({ layer, name }) => (
                <div key={name} style={{ background: 'rgba(255,255,255,.9)', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background .2s' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,243,255,.95)')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.9)')}>
                  <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{layer}</span>
                  <span style={{ fontFamily: 'serif', fontSize: 20 }}>{name}</span>
                </div>
              ))}
            </div>
            {/* Copy */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', animation: 'lpPulse 1.8s ease-in-out infinite' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a78bfa' }}>05 — Built right</span>
              </div>
              <h3 style={{ fontSize: 'clamp(30px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 18 }}>Production-grade architecture, zero servers to maintain.</h3>
              <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.65, marginBottom: 14 }}>Serverless on Firebase, deployed on GitHub Pages — runtime costs scale to zero between classes, but real-time sync, authentication, and storage all behave like a fully managed enterprise stack.</p>
              <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.65 }}>Every route is lazy-loaded, every page is type-safe, and every database write is governed by Firestore security rules that enforce the role model at the database layer — not just in the UI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '140px 0 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(1000px 500px at 50% 30%, rgba(124,58,237,.08), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
          <h2 style={{ fontFamily: 'serif', fontWeight: 400, fontSize: 'clamp(44px,8vw,110px)', lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 36 }}>
            A teaching tool,<br /><em style={{ color: '#7c3aed' }}>already shipping.</em>
          </h2>
          <p style={{ color: '#6b7280', fontSize: 18, maxWidth: '50ch', margin: '0 auto 44px', lineHeight: 1.55 }}>
            Built independently to solve real problems in real Masters classrooms. Ready for you to explore — no installation, no setup.
          </p>
          <div style={{ display: 'inline-flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {user ? (
              <Link to={dashPath} style={{ padding: '17px 32px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 28px rgba(124,58,237,.4)', display: 'inline-block' }}>
                Open Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" style={{ padding: '17px 32px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 28px rgba(124,58,237,.4)' }}>
                  Create Account →
                </Link>
                <Link to="/login" style={{ padding: '17px 32px', borderRadius: 99, border: '1.5px solid rgba(124,58,237,.3)', color: '#7c3aed', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ padding: '52px 40px 36px', borderTop: '1px solid rgba(139,92,246,.12)', background: 'rgba(245,243,255,.4)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <BrandMark className="h-8 w-8" />
                <span style={{ fontFamily: 'serif', fontSize: 28, letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>YooBees</span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: 14, maxWidth: '34ch', lineHeight: 1.55 }}>A real-time teaching and learning platform built for postgraduate education at Yoobee Colleges.</p>
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Platform</div>
              {[['Attendance', '/student/attendance'], ['Live Playground', '/student/playground'], ['Resources', '/student/course-resources'], ['Analytics', '/lecturer/analytics']].map(([l, p]) => (
                <div key={l}><Link to={p} style={{ display: 'block', fontSize: 14, color: '#6b7280', padding: '4px 0', textDecoration: 'none' }}>{l}</Link></div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Courses</div>
              {['MBI800', 'MBI802', 'MBI804'].map(c => <div key={c} style={{ fontSize: 14, color: '#6b7280', padding: '4px 0' }}>{c}</div>)}
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Built by</div>
              <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>Dr Yasas Sri Wickramasinghe<br />HIT Lab NZ<br />Yoobee Colleges</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(139,92,246,.1)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', fontSize: 10, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span>v1.0 · 2026</span>
            <span>Christchurch · Aotearoa New Zealand</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
