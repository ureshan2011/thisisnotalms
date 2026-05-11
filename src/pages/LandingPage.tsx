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

// ─── Dashboard Mockup (hero scroll card content) ─────────────────────────────
function DashboardMockup() {
  const navItems = [
    { label: 'Dashboard', icon: '⊞', active: true },
    { label: 'Notice Board', icon: '🔔', active: false },
    { label: 'Students', icon: '👤', active: false },
    { label: 'Attendance', icon: '📋', active: false },
    { label: 'Live Playground', icon: '◎', active: false },
    { label: 'Course Resources', icon: '📖', active: false },
    { label: 'Video Manager', icon: '⊟', active: false },
    { label: 'Site Analytics', icon: '📊', active: false },
  ];

  const statCards = [
    { label: 'TOTAL STUDENTS', value: 228, color: '#7c3aed', bg: '#ede9fe', icon: '👥' },
    { label: 'COURSES', value: 3, color: '#2563eb', bg: '#dbeafe', icon: '🎓' },
    { label: 'COUNTRIES', value: 24, color: '#0891b2', bg: '#cffafe', icon: '🌐' },
    { label: 'WITH WORK EXP.', value: 210, color: '#059669', bg: '#d1fae5', icon: '💼' },
    { label: 'SPECIAL NEEDS', value: 3, color: '#e11d48', bg: '#fee2e2', icon: '♥' },
    { label: 'SESSIONS', value: 12, color: '#d97706', bg: '#fef3c7', icon: '📅' },
  ];

  const gallery = [
    { name: 'Nadia Patel',     seed: 'nadia-patel'     },
    { name: 'Marcus Chen',     seed: 'marcus-chen'     },
    { name: 'Sofia Garcia',    seed: 'sofia-garcia'    },
    { name: 'Hiroshi T.',      seed: 'hiroshi-tanaka'  },
    { name: 'Amara Osei',      seed: 'amara-osei'      },
    { name: 'Lucas Ferreira',  seed: 'lucas-ferreira'  },
    { name: 'Mei-Ling Z.',     seed: 'meiling-zhang'   },
    { name: 'Raj Sharma',      seed: 'raj-sharma'      },
    { name: 'Fatima Hassan',   seed: 'fatima-hassan'   },
    { name: 'Tobias Werner',   seed: 'tobias-werner'   },
    { name: 'Priya Krishna',   seed: 'priya-krishna'   },
    { name: 'James Nguyen',    seed: 'james-nguyen'    },
    { name: 'Elena Popescu',   seed: 'elena-popescu'   },
    { name: 'Arjun Mehta',     seed: 'arjun-mehta'     },
    { name: 'Yuki Sato',       seed: 'yuki-sato'       },
    { name: 'Diego Castro',    seed: 'diego-castro'    },
    { name: 'Nairobi Brown',   seed: 'nairobi-brown'   },
    { name: 'Min-jun Lee',     seed: 'minjun-lee'      },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', fontSize: 11, lineHeight: 1.4, overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Sidebar ── */}
      <div style={{ width: 168, background: '#1e1b4b', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '4px 0 24px rgba(0,0,0,.15)' }}>
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>Y</div>
            <div>
              <div style={{ color: '#f5f3ff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>YooBees</div>
              <div style={{ color: '#6b7280', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>HIVE</div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(124,58,237,.18)', border: '1px solid rgba(124,58,237,.3)', borderRadius: 99, padding: '3px 10px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa' }} />
            <span style={{ color: '#a78bfa', fontSize: 9, fontWeight: 600, letterSpacing: '0.06em' }}>Lecturer</span>
          </div>
        </div>
        <div style={{ padding: '10px 8px', flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 8.5, color: '#4b5563', letterSpacing: '0.12em', padding: '2px 6px 8px', textTransform: 'uppercase', fontWeight: 700 }}>Menu</div>
          {navItems.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 10, background: item.active ? 'linear-gradient(135deg, rgba(124,58,237,.16), rgba(139,92,246,.08))' : 'transparent', color: item.active ? '#a78bfa' : '#6b7280', fontWeight: item.active ? 600 : 400, marginBottom: 1, fontSize: 10.5 }}>
              <span style={{ fontSize: 12, width: 14, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>U</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#f5f3ff', fontSize: 10.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ureshan2011</div>
              <div style={{ color: '#6b7280', fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ureshan2011@gmail.com</div>
            </div>
          </div>
          <div style={{ color: '#6b7280', fontSize: 9.5, marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>→</span> Sign out
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f4ff' }}>
        {/* Page header */}
        <div style={{ padding: '18px 22px 0' }}>
          <div style={{ color: '#7c3aed', fontSize: 12, fontWeight: 500 }}>Welcome back 👋</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.025em', marginTop: 3 }}>Dashboard Overview</div>
          <div style={{ color: '#8b7fa6', fontSize: 11, marginTop: 3 }}>228 enrolled students across 3 courses</div>
        </div>

        {/* Filter bar */}
        <div style={{ padding: '12px 22px 8px' }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(139,92,246,.1)', padding: '12px 16px', boxShadow: '0 1px 4px rgba(124,58,237,.06)' }}>
            <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 11, marginBottom: 4 }}>Filters</div>
            <div style={{ color: '#9ca3af', fontSize: 10, marginBottom: 10 }}>Filter by course, intake, and subject.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['All courses', 'All intakes', 'All subjects'].map(f => (
                <div key={f} style={{ flex: 1, background: '#f9f8ff', border: '1px solid rgba(139,92,246,.14)', borderRadius: 8, padding: '6px 10px', color: '#6b7280', fontSize: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {f} <span style={{ color: '#a78bfa' }}>⌄</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ padding: '0 22px 12px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(139,92,246,.08)', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 1px 4px rgba(124,58,237,.05)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: s.bg, display: 'grid', placeItems: 'center', fontSize: 14 }}>{s.icon}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: '#9ca3af', letterSpacing: '0.06em', lineHeight: 1.3, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: '-0.025em', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Student Gallery */}
        <div style={{ margin: '0 22px 16px', background: '#1e1b4b', borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}>
          <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#f5f3ff', fontWeight: 700, fontSize: 13 }}>Student Gallery</div>
              <div style={{ color: '#6b7280', fontSize: 10, marginTop: 2 }}>178 with photos · 50 with initials</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 99, padding: '4px 12px', color: '#9ca3af', fontSize: 9.5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>👥</span> 228
              </div>
              <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '4px 12px', color: '#9ca3af', fontSize: 9.5 }}>Pause</div>
            </div>
          </div>
          <div style={{ padding: '0 14px 14px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 7 }}>
            {gallery.map(s => (
              <div key={s.name} style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden', background: '#e0d9f7' }}>
                <img src={`https://api.dicebear.com/9.x/personas/svg?seed=${s.seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75), transparent)', padding: '12px 5px 5px', color: '#fff', fontSize: 7.5, lineHeight: 1.2, wordBreak: 'break-word' }}>{s.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '4px 0 14px', textAlign: 'center', color: '#9ca3af', fontSize: 9.5 }}>
          © 2026 All Rights Reserved • Created by <span style={{ color: '#7c3aed' }}>@yasassri.me</span>
        </div>
      </div>
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

  // Video fade refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  // Story auto-advance timer
  const storyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function goToStep(i: number) {
    setActiveStoryStep(i);
    if (storyTimerRef.current) clearInterval(storyTimerRef.current);
    storyTimerRef.current = setInterval(() => setActiveStoryStep(s => (s + 1) % 5), 4500);
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Auto-advance story steps
  useEffect(() => {
    storyTimerRef.current = setInterval(() => setActiveStoryStep(s => (s + 1) % 5), 4500);
    return () => { if (storyTimerRef.current) clearInterval(storyTimerRef.current); };
  }, []);

  // Video background fade system
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function cancelFade() {
      if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    }
    function fadeIn(from: number) {
      cancelFade();
      const t0 = performance.now();
      function step(now: number) {
        const p = Math.min((now - t0) / 500, 1);
        if (video) video.style.opacity = String(from + (1 - from) * p);
        if (p < 1) rafRef.current = requestAnimationFrame(step); else rafRef.current = null;
      }
      rafRef.current = requestAnimationFrame(step);
    }
    function fadeOut(from: number) {
      cancelFade();
      const t0 = performance.now();
      function step(now: number) {
        const p = Math.min((now - t0) / 500, 1);
        if (video) video.style.opacity = String(from * (1 - p));
        if (p < 1) rafRef.current = requestAnimationFrame(step); else rafRef.current = null;
      }
      rafRef.current = requestAnimationFrame(step);
    }
    function onTimeUpdate() {
      if (!video || fadingOutRef.current || !video.duration) return;
      if (video.duration - video.currentTime <= 0.55) {
        fadingOutRef.current = true;
        fadeOut(parseFloat(video.style.opacity || '1'));
      }
    }
    function onEnded() {
      if (!video) return;
      video.style.opacity = '0';
      fadingOutRef.current = false;
      const v = video;
      setTimeout(() => { v.currentTime = 0; v.play().catch(() => {}); fadeIn(0); }, 100);
    }
    function onCanPlay() {
      if (!video) return;
      if (parseFloat(video.style.opacity || '0') < 0.1) fadeIn(0);
    }
    video.style.opacity = '0';
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    video.addEventListener('canplay', onCanPlay);
    return () => {
      cancelFade();
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  // Metric refs + counters
  const [metricsRef, metricsInView] = useInView();
  const c1 = useCounter(2500, metricsInView);
  const c2 = useCounter(228, metricsInView);
  const c3 = useCounter(24, metricsInView);
  const c4 = useCounter(12, metricsInView);
  const c5 = useCounter(100, metricsInView);
  const c6 = useCounter(16, metricsInView);
  const c7 = useCounter(210, metricsInView);
  const c8 = useCounter(3, metricsInView);

  const [problemRef, problemInView] = useInView();
  const [audRef, audInView] = useInView();
  const [sqlRef, sqlInView] = useInView();
  const [techRef, techInView] = useInView();

  const storySteps = [
    { label: 'Opening Code', time: '9:00', title: '9:00 — Opening code launches.', body: "The lecturer clicks Launch Opening. A six-character code from a deliberately ambiguity-free alphabet (no 0/O/1/I) appears, plus a scannable QR. Students have four minutes to submit — opening and mid-session checkpoints together verify real presence.", screen: <AttendanceScreen key="attendance" /> },
    { label: 'Live Playground', time: '9:15', title: '9:15 — Live playground opens.', body: "A real-time canvas, polls, and a shared checklist materialise. Every student's presence is tracked. Drawings sync across all devices as the lecturer draws. Votes tally live as they're cast.", screen: <PlaygroundScreen key="playground" /> },
    { label: 'Fraud Detected', time: '10:30', title: '10:30 — Suspicious activity flagged.', body: "Two students submitted within 11 seconds from the same IP. Another's GPS is 1.2 km off the cohort cluster. Three detection algorithms ran automatically. The platform raised the flags before the lecturer even checked the results.", screen: <FraudScreen key="fraud" /> },
    { label: 'Daily Match', time: '11:00', title: '11:00 — Daily Match queued.', body: "The matching algorithm scores every pairing in the cohort. Each student opens their dashboard to three new peers ranked by shared background, industry, and hometown — with the reasons visible alongside each score.", screen: <MatchScreen key="match" /> },
    { label: 'Dashboard', time: '11:05', title: '11:05 — Dashboard overview.', body: "228 students across 3 courses and 24 countries — visible at a glance. Attendance rates, quiz completions, session history, and cohort analytics all live in one place. No spreadsheets, no manual aggregation.", screen: <DashboardMockup key="dashboard" /> },
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
    { n: c1, suffix: '+', label: 'Platform Sessions', desc: 'Since platform launch this semester' },
    { n: c2, suffix: '', label: 'Enrolled Students', desc: 'Across Auckland and Christchurch campuses' },
    { n: c3, suffix: '', label: 'Countries Represented', desc: 'International cohort across 24 nations' },
    { n: c4, suffix: '', label: 'Attendance Sessions', desc: 'Recorded sessions this semester' },
    { n: c5, suffix: '+', label: 'MCQ Questions', desc: 'Across ER, Agile/Scrum, and DBMS banks' },
    { n: c6, suffix: '', label: 'Video Lessons', desc: 'Full recorded lectures and tutorials' },
    { n: c7, suffix: '', label: 'With Work Experience', desc: 'Students with professional backgrounds' },
    { n: c8, suffix: '', label: 'Courses', desc: 'MBI800, MBI802 and MBI804' },
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
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
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
        .lp-stagger.lp-visible .lp-reveal-item { opacity:1; transform:none; }
        .lp-stagger > *:nth-child(1) { transition-delay:.04s }
        .lp-stagger > *:nth-child(2) { transition-delay:.13s }
        .lp-stagger > *:nth-child(3) { transition-delay:.22s }
        .lp-stagger > *:nth-child(4) { transition-delay:.31s }
        .lp-stagger > *:nth-child(5) { transition-delay:.40s }
        .lp-stagger > *:nth-child(6) { transition-delay:.49s }
        .liquid-glass { background:rgba(255,255,255,0.01); background-blend-mode:luminosity; backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); border:none; box-shadow:inset 0 1px 1px rgba(255,255,255,0.1); position:relative; overflow:hidden; }
        .liquid-glass::before { content:''; position:absolute; inset:0; border-radius:inherit; padding:1.4px; background:linear-gradient(180deg,rgba(255,255,255,0.45) 0%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0) 40%,rgba(255,255,255,0) 60%,rgba(255,255,255,0.15) 80%,rgba(255,255,255,0.45) 100%); -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0); -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
      `}</style>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', background: scrolled ? 'rgba(245,244,255,.92)' : 'rgba(0,0,0,.25)', borderBottom: scrolled ? '1px solid rgba(139,92,246,.15)' : '1px solid rgba(255,255,255,.1)', transition: 'all .3s ease' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <BrandMark className="h-8 w-8" />
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>YooBees</span>
        </a>
        <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: 0, padding: 0 }}>
          {[['#problem', 'Problem'], ['#audience', "Who it's for"], ['#story', 'How it works'], ['#sql-lab', 'SQL Lab'], ['#numbers', 'Stats']].map(([href, label]) => (
            <li key={href}><a href={href} style={{ fontSize: 13, color: scrolled ? '#6b7280' : 'rgba(255,255,255,.8)', textDecoration: 'none', transition: 'color .2s' }} onMouseEnter={e => (e.currentTarget.style.color = scrolled ? '#7c3aed' : '#fff')} onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#6b7280' : 'rgba(255,255,255,.8)')}>{label}</a></li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 10 }}>
          {user ? (
            <Link to={dashPath} style={{ padding: '9px 20px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,.35)' }}>
              Open Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ padding: '9px 18px', borderRadius: 99, border: `1px solid ${scrolled ? 'rgba(124,58,237,.3)' : 'rgba(255,255,255,.3)'}`, color: scrolled ? '#7c3aed' : 'rgba(255,255,255,.9)', fontWeight: 600, fontSize: 13, textDecoration: 'none', transition: 'all .2s' }}>
                Sign In
              </Link>
              <Link to="/register" style={{ padding: '9px 20px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,.35)' }}>
                Get Started →
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero — Full-screen video ─────────────────────────────────────── */}
      <section id="top" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: '#000' }}>
        {/* Background video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'translateY(17%)', opacity: 0, zIndex: 0 }}
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,.58) 0%, rgba(0,0,0,.32) 45%, rgba(0,0,0,.68) 100%)', zIndex: 1 }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: 80 }}>
          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 60px', textAlign: 'center', transform: 'translateY(-8%)' }}>
            {/* Badge */}
            <div className="liquid-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 99, padding: '6px 18px', marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', display: 'inline-block', animation: 'lpPulse 1.8s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)' }}>Postgraduate teaching platform · Yoobee Colleges · 2026</span>
            </div>
            {/* Headline */}
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(52px, 9vw, 108px)', fontWeight: 400, color: '#fff', margin: '0 0 28px', letterSpacing: '-0.02em', lineHeight: 1.0 }}>
              Teaching, <em>attended.</em><br />
              Learning, <em>measured.</em>
            </h1>
            {/* Subtext */}
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.72)', lineHeight: 1.65, maxWidth: '52ch', margin: '0 0 36px' }}>
              YooBees combines fraud-resistant attendance, a real-time lesson playground, and a full resource library — all built for <strong style={{ color: '#c4b5fd' }}>Masters of Business Informatics</strong> at Yoobee Colleges.
            </p>
            {/* CTA bar */}
            <div className="liquid-glass" style={{ borderRadius: 99, padding: '6px 8px 6px 22px', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 36, maxWidth: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.72)', whiteSpace: 'nowrap' }}>Join 228 enrolled students</span>
              {user ? (
                <Link to={dashPath} style={{ background: '#fff', borderRadius: 99, padding: '10px 24px', color: '#1e1b4b', fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
                  Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" style={{ background: '#fff', borderRadius: 99, padding: '10px 22px', color: '#1e1b4b', fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
                    Get Started
                  </Link>
                  <Link to="/login" className="liquid-glass" style={{ borderRadius: 99, padding: '10px 18px', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
                    Sign In
                  </Link>
                </>
              )}
            </div>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['228', 'Students'], ['3', 'Courses'], ['24', 'Countries'], ['2,500+', 'Sessions']].map(([n, l]) => (
                <div key={l} className="liquid-glass" style={{ textAlign: 'center', borderRadius: 16, padding: '14px 22px' }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.6)', marginTop: 4, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Social footer */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, paddingBottom: 40 }}>
            {[['Instagram', '◌'], ['Twitter / X', '✕'], ['Website', '◎']].map(([label, icon]) => (
              <button key={label} aria-label={label} className="liquid-glass" style={{ width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.8)', cursor: 'pointer', border: 'none', background: 'none', fontSize: 18 }}>
                {icon}
              </button>
            ))}
          </div>
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

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="story" style={{ padding: '80px 0 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 52 }}>
            <div><div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bfa' }}>02 — How it works</div></div>
            <div>
              <h2 style={{ fontSize: 'clamp(36px,5vw,68px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 16 }}>
                Five flagship moments in a <em style={{ color: '#7c3aed' }}>single class.</em>
              </h2>
              <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.55 }}>From walking through the door to the post-session dashboard — a typical Wednesday in MBI802.</p>
            </div>
          </div>

          {/* Step tab pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 44, flexWrap: 'wrap' }}>
            {storySteps.map((step, i) => (
              <button key={i} onClick={() => goToStep(i)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 99, border: `1px solid ${activeStoryStep === i ? '#7c3aed' : 'rgba(139,92,246,.2)'}`, background: activeStoryStep === i ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'transparent', color: activeStoryStep === i ? '#fff' : '#7c3aed', fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.25s ease' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, opacity: 0.75 }}>{String(i + 1).padStart(2, '0')}</span>
                {step.label}
              </button>
            ))}
          </div>

          {/* Content: description + mockup */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 56, alignItems: 'center' }}>
            {/* Description */}
            <div key={activeStoryStep + '_d'} style={{ animation: 'lpReveal .4s ease both' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#a78bfa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                Step {String(activeStoryStep + 1).padStart(2, '0')}
                <div style={{ flex: 1, height: 1, background: 'rgba(167,139,250,.25)' }} />
              </div>
              <h3 style={{ fontFamily: 'serif', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 16, color: '#1e1b4b' }}>{storySteps[activeStoryStep].title}</h3>
              <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.65 }}>{storySteps[activeStoryStep].body}</p>
              {/* Progress indicator */}
              <div style={{ display: 'flex', gap: 7, marginTop: 32 }}>
                {storySteps.map((_, i) => (
                  <button key={i} onClick={() => goToStep(i)} style={{ height: 3, flex: i === activeStoryStep ? 3 : 1, borderRadius: 99, background: i === activeStoryStep ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' : 'rgba(139,92,246,.2)', border: 'none', cursor: 'pointer', transition: 'flex .45s cubic-bezier(.4,0,.2,1), background .45s ease', padding: 0 }} />
                ))}
              </div>
            </div>

            {/* Screen mockup */}
            <div style={{ background: 'rgba(255,255,255,.95)', border: '1px solid rgba(139,92,246,.15)', borderRadius: 24, boxShadow: '0 24px 64px rgba(124,58,237,.14)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 18px', borderBottom: '1px solid rgba(139,92,246,.1)', background: 'rgba(245,243,255,.6)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e6a39a' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e6cf8c' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a8cba6' }} />
                <div style={{ flex: 1, marginLeft: 10, background: 'rgba(124,58,237,.06)', borderRadius: 6, padding: '3px 10px', fontFamily: 'monospace', fontSize: 10, color: '#8b7fa6' }}>
                  yoobees.app / {['attendance/opening', 'playground', 'attendance/results', 'dashboard', 'dashboard'][activeStoryStep]}
                </div>
              </div>
              <div key={activeStoryStep + '_s'} style={{ padding: 20, minHeight: 420, display: 'flex', flexDirection: 'column', animation: 'lpScaleIn .35s ease both' }}>
                {storySteps[activeStoryStep].screen}
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
