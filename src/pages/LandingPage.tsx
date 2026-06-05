import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BrandMark from '../components/ui/BrandMark';
import { ContainerScroll } from '../components/ui/container-scroll-animation';

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

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────
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
    { name: 'Nadia Patel',     photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Marcus Chen',     photo: 'https://randomuser.me/api/portraits/men/33.jpg'   },
    { name: 'Sofia Garcia',    photo: 'https://randomuser.me/api/portraits/women/26.jpg' },
    { name: 'Hiroshi T.',      photo: 'https://randomuser.me/api/portraits/men/60.jpg'   },
    { name: 'Amara Osei',      photo: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { name: 'Lucas Ferreira',  photo: 'https://randomuser.me/api/portraits/men/72.jpg'   },
    { name: 'Mei-Ling Z.',     photo: 'https://randomuser.me/api/portraits/women/39.jpg' },
    { name: 'Raj Sharma',      photo: 'https://randomuser.me/api/portraits/men/46.jpg'   },
    { name: 'Fatima Hassan',   photo: 'https://randomuser.me/api/portraits/women/90.jpg' },
    { name: 'Tobias Werner',   photo: 'https://randomuser.me/api/portraits/men/22.jpg'   },
    { name: 'Priya Krishna',   photo: 'https://randomuser.me/api/portraits/women/43.jpg' },
    { name: 'James Nguyen',    photo: 'https://randomuser.me/api/portraits/men/58.jpg'   },
    { name: 'Elena Popescu',   photo: 'https://randomuser.me/api/portraits/women/31.jpg' },
    { name: 'Arjun Mehta',     photo: 'https://randomuser.me/api/portraits/men/49.jpg'   },
    { name: 'Yuki Sato',       photo: 'https://randomuser.me/api/portraits/women/37.jpg' },
    { name: 'Diego Castro',    photo: 'https://randomuser.me/api/portraits/men/68.jpg'   },
    { name: 'Nairobi Brown',   photo: 'https://randomuser.me/api/portraits/women/57.jpg' },
    { name: 'Min-jun Lee',     photo: 'https://randomuser.me/api/portraits/men/53.jpg'   },
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
        <div style={{ padding: '18px 22px 0' }}>
          <div style={{ color: '#7c3aed', fontSize: 12, fontWeight: 500 }}>Welcome back 👋</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.025em', marginTop: 3 }}>Dashboard Overview</div>
          <div style={{ color: '#8b7fa6', fontSize: 11, marginTop: 3 }}>228 enrolled students across 3 courses</div>
        </div>

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

        <div style={{ padding: '0 22px 12px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(139,92,246,.08)', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 1px 4px rgba(124,58,237,.05)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: s.bg, display: 'grid', placeItems: 'center', fontSize: 14 }}>{s.icon}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: '#9ca3af', letterSpacing: '0.06em', lineHeight: 1.3, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: '-0.025em', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

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
            </div>
          </div>
          <div style={{ padding: '0 14px 14px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 7 }}>
            {gallery.map(s => (
              <div key={s.name} style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden', background: '#e0d9f7' }}>
                <img src={s.photo} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
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
      <div style={{ background: D.card, borderRadius: 16, border: `1px solid ${D.border}`, overflow: 'hidden' }}>
        <div style={{ background: 'rgba(124,58,237,.08)', padding: '16px 20px', borderBottom: `1px solid ${D.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: D.txt1 }}>SQL Lab Progress</div>
            <div style={{ fontSize: 12, color: D.txt2, marginTop: 2 }}>MBI802 · Library · Hospital · School scenarios</div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, background: 'rgba(124,58,237,0.08)', color: '#7c3aed', padding: '4px 10px', borderRadius: 99 }}>Live</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 400 }}>
            <thead>
              <tr style={{ background: 'rgba(124,58,237,.06)' }}>
                {['Student', 'Library', 'Hospital', 'School', 'Progress'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', fontWeight: 600, borderBottom: `1px solid ${D.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? `1px solid ${D.border}` : 'none' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ fontWeight: 600, color: D.txt1 }}>{s.name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: D.txt2 }}>{s.id}</div>
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
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SQL_SCENARIOS.map((sc, i) => (
          <button key={sc.name} onClick={() => { setScenario(i); setStep(-1); }} style={{ padding: '6px 16px', borderRadius: 99, border: `1px solid ${scenario === i ? '#7c3aed' : 'rgba(139,92,246,0.2)'}`, background: scenario === i ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'transparent', color: scenario === i ? '#fff' : '#7c3aed', fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
            {sc.name}
          </button>
        ))}
      </div>
      <div style={{ background: 'rgba(124,58,237,.1)', borderRadius: 12, padding: '12px 16px', borderLeft: '3px solid #7c3aed' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa', marginBottom: 6 }}>Question</div>
        <div style={{ fontSize: 14, color: D.txt1 }}>{sc.question}</div>
      </div>
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
      <div style={{ background: D.card, borderRadius: 12, border: `1px solid ${D.border}`, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: D.txt1 }}>Verification Pipeline</div>
          <button onClick={runVerify} disabled={running} style={{ padding: '6px 16px', borderRadius: 99, background: running ? 'rgba(139,92,246,0.15)' : 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: running ? '#8b7fa6' : '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer' }}>
            {running ? 'Checking…' : 'Run Check'}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VERIFY_STEPS.map((vs, i) => {
            const done = step >= i;
            const active = step === i - 1 && running;
            return (
              <div key={vs.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, background: done ? 'rgba(52,211,153,.08)' : active ? 'rgba(124,58,237,.08)' : D.card, border: `1px solid ${done ? 'rgba(52,211,153,.25)' : active ? 'rgba(124,58,237,.25)' : D.border}`, transition: 'all 0.35s ease' }}>
                <span style={{ fontSize: 16 }}>{vs.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: done ? '#34d399' : D.txt1 }}>{vs.label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: done ? '#34d399' : active ? '#a78bfa' : D.txt3 }}>
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

// ─── Dark theme palette ───────────────────────────────────────────────────────
const D = {
  bg0:   '#030211',
  bg1:   '#06041a',
  bg2:   '#080520',
  bg3:   '#0b0728',
  card:  'rgba(255,255,255,.04)',
  cardH: 'rgba(255,255,255,.07)',
  border:'rgba(255,255,255,.07)',
  txt1:  '#f0edff',
  txt2:  'rgba(240,237,255,.6)',
  txt3:  'rgba(240,237,255,.35)',
  pur:   '#7c3aed',
  purL:  '#a78bfa',
  purLL: '#c4b5fd',
};

// ─── Main component ──────────────────────────────────────────────────────────
export default function LandingPage() {
  const { user, role } = useAuth();
  const dashPath = role === 'student' ? '/student/dashboard' : '/lecturer/dashboard';

  const [scrolled, setScrolled] = useState(false);
  const [activeAudTab, setActiveAudTab] = useState<'students' | 'staff'>('students');
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [sqlTab, setSqlTab] = useState<'student' | 'staff'>('student');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const rafRef = useRef<number | null>(null);
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

  useEffect(() => {
    storyTimerRef.current = setInterval(() => setActiveStoryStep(s => (s + 1) % 5), 4500);
    return () => { if (storyTimerRef.current) clearInterval(storyTimerRef.current); };
  }, []);

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
    { label: 'Opening Code', time: '9:00', title: '9:00 — Opening code launches.', body: "The lecturer clicks one button. A six-character code appears on screen — no confusing letters like O or 0. Students have four minutes to type it in or scan the QR code. Simple, quick, and hard to share with someone at home.", screen: <AttendanceScreen key="attendance" /> },
    { label: 'Live Playground', time: '9:15', title: '9:15 — Live playground opens.', body: "The lecturer draws something on screen — and every student's device shows it instantly. A quick poll goes up, and you can watch the votes come in live. The whole class is connected in real time, no matter where you're sitting.", screen: <PlaygroundScreen key="playground" /> },
    { label: 'Fraud Detected', time: '10:30', title: '10:30 — Suspicious activity flagged.', body: "Two codes came in 11 seconds apart from the same Wi-Fi connection. One student's location shows they're over a kilometre from campus. YooBees noticed all of this automatically — before the lecturer even opened the results.", screen: <FraudScreen key="fraud" /> },
    { label: 'Daily Match', time: '11:00', title: '11:00 — Daily Match queued.', body: "Every day, the platform finds three classmates you should probably know. It shows you why — maybe you're from the same country, or worked in the same industry. The reasons are right there on screen, alongside a compatibility score.", screen: <MatchScreen key="match" /> },
    { label: 'Dashboard', time: '11:05', title: '11:05 — Dashboard overview.', body: "The lecturer opens the dashboard and sees everything — 228 students, 3 courses, 24 countries. Who came to class, who finished the quiz, who hasn't logged in this week. One screen. No spreadsheets.", screen: <DashboardMockup key="dashboard" /> },
  ];

  const studentFeatures = [
    { icon: '①', title: 'Daily Match', desc: 'Every time you log in, you see three classmates you might not have met yet. The platform works out who matches your background and study goals — and tells you why. A simple way to find your study group.', tag: '10-pt compatibility score', link: '/student/dashboard' },
    { icon: '②', title: 'Live Playground', desc: "During class, your screen stays in sync with what the lecturer is drawing. You can vote in live polls, tick off tasks on a shared checklist, and follow along — even from the back row.", tag: 'Real-time Firestore sync', link: '/student/playground' },
    { icon: '③', title: 'One-tap Attendance', desc: "A code appears at the start of class and again halfway through. Type it in or scan the QR — two checkpoints confirm you were actually there, not just there for the first five minutes.", tag: 'QR + code dual-mode', link: '/student/attendance' },
    { icon: '④', title: 'Resource Library', desc: 'Slides, videos, SQL practice, and study tools — all in one place. No digging through emails or Moodle folders. Everything your course needs is here, organised by topic.', tag: '6 deck modules + video', link: '/student/course-resources' },
    { icon: '⑤', title: 'Quiz Badges', desc: 'Test yourself with over 100 questions on ER diagrams, Agile, and databases. Score 90% or above and you earn a badge that stays on your profile — visible proof you know the topic.', tag: '3 quiz banks · badge system', link: '/student/course-resources' },
    { icon: '⑥', title: 'Attendance Transparency', desc: 'Your attendance count is always on your screen — sessions attended, sessions missed, and the reasons. No surprises at the end of semester. If you know you will be absent, you can report it in advance.', tag: 'Live calculation', link: '/student/history' },
  ];

  const staffFeatures = [
    { icon: '①', title: 'Fraud Detection', desc: 'After every session, the platform has already checked for suspicious patterns — students submitting from the same internet connection, or someone whose phone says they are not near campus. Flags appear before you open the results.', tag: '3 detection types · auto-run', link: '/lecturer/attendance' },
    { icon: '②', title: 'Live Lesson Tools', desc: 'Launch a quick poll or draw on the shared canvas — students see it instantly on their devices. Every vote and interaction is saved, so after class you have real data, not just a feeling of how it went.', tag: 'Canvas · Poll · Checklist', link: '/lecturer/playground' },
    { icon: '③', title: 'Cohort Analytics', desc: 'See how the whole cohort is doing — quiz scores, attendance rates, login activity, broken down by course, campus, and intake. Spot students who are falling behind before the semester is half over.', tag: 'Recharts dashboards', link: '/lecturer/analytics' },
    { icon: '④', title: 'CSV Export', desc: 'One click exports the full attendance record as a spreadsheet — student ID, name, campus, timestamp, and location. Ready for compliance reporting or immigration checks, exactly as the institution needs it.', tag: 'One-click audit-ready export', link: '/lecturer/attendance' },
    { icon: '⑤', title: 'Manual Overrides', desc: 'Sometimes a student has a medical note or a technical issue on the day. You can adjust their attendance record directly — and every change is logged with your name and the reason. The audit trail stays clean.', tag: 'Auditable delta system', link: '/lecturer/students' },
    { icon: '⑥', title: 'Role-Based Access', desc: 'Students see student features. Lecturers see everything. Teaching assistants get their own level. Permissions are enforced at the database — not just in the interface. Built for an institution, not a side project.', tag: '3 roles · 22 protected routes', link: '/lecturer/dashboard' },
  ];

  const metrics = [
    { n: c1, suffix: '+', label: 'Platform Sessions', desc: 'Total activity since the platform launched this semester' },
    { n: c2, suffix: '', label: 'Enrolled Students', desc: 'Active students across Auckland and Christchurch' },
    { n: c3, suffix: '', label: 'Countries Represented', desc: 'Home countries across the cohort' },
    { n: c4, suffix: '', label: 'Attendance Sessions', desc: 'Sessions held and recorded so far this semester' },
    { n: c5, suffix: '+', label: 'MCQ Questions', desc: 'Practice questions across three topic areas' },
    { n: c6, suffix: '', label: 'Video Lessons', desc: 'Recorded lessons available to watch anytime' },
    { n: c7, suffix: '', label: 'With Work Experience', desc: 'Students who came in with professional experience' },
    { n: c8, suffix: '', label: 'Courses', desc: 'Active postgraduate courses on the platform' },
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
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: D.bg0, color: D.txt1, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        @keyframes lpFloat  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
        @keyframes lpFloatB { 0%,100%{transform:translateY(-6px)} 50%{transform:translateY(6px)} }
        @keyframes lpPulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes lpMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes lpReveal { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lpSlideIn { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes lpScaleIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes lpPulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes lpIconBounce { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-7px) scale(1.08)} }
        @keyframes lpArrowPulse { 0%,100%{opacity:.4;transform:translateX(0)} 50%{opacity:1;transform:translateX(4px)} }
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
        .lp-step-btn { display:block; width:100%; text-align:left; background:none; border:none; border-left:2px solid rgba(255,255,255,.08); padding:22px 0 22px 24px; cursor:pointer; transition:border-color .3s ease; }
        .lp-step-btn.active { border-left-color:#7c3aed; }
        .lp-step-btn + .lp-step-btn { border-top:1px solid rgba(255,255,255,.05); }

        /* ── Mobile responsive ── */
        @media (max-width: 768px) {
          .lp-nav-links { display:none !important; }
          .lp-nav { padding:10px 16px !important; }
          .lp-hero-content { padding:0 16px 32px !important; transform:none !important; }
          .lp-hero-stats { gap:8px !important; }
          .lp-hero-stat { padding:10px 14px !important; }
          .lp-hero-h1 { font-size:clamp(40px,11vw,64px) !important; }
          .lp-section-pad { padding:60px 0 !important; }
          .lp-inner { padding:0 20px !important; }
          .lp-hdr-grid { grid-template-columns:1fr !important; gap:16px !important; }
          .lp-problem-cards { grid-template-columns:1fr !important; gap:1px !important; }
          .lp-problem-row { grid-template-columns:1fr !important; gap:24px !important; padding:36px 0 !important; }
          .lp-problem-num { display:none !important; }
          .lp-aud-grid { grid-template-columns:1fr !important; gap:14px !important; }
          .lp-story-grid { grid-template-columns:1fr !important; gap:32px !important; }
          .lp-story-mockup { display:none !important; }
          .lp-sql-steps { grid-template-columns:repeat(2,1fr) !important; }
          .lp-metrics-grid { grid-template-columns:repeat(2,1fr) !important; gap:24px !important; }
          .lp-metrics-item { padding:0 16px !important; border-left:none !important; padding-left:0 !important; border-top:1px solid rgba(139,92,246,.12); padding-top:24px !important; }
          .lp-metrics-item:nth-child(odd) { border-top:1px solid rgba(139,92,246,.12); border-left:none !important; padding-left:0 !important; }
          .lp-metrics-item:first-child { border-top:none; padding-top:0 !important; }
          .lp-metrics-item:nth-child(2) { border-top:none; padding-top:0 !important; }
          .lp-tech-grid { grid-template-columns:1fr !important; gap:40px !important; }
          .lp-tech-stack-grid { grid-template-columns:1fr !important; }
          .lp-footer-grid { grid-template-columns:1fr !important; gap:28px !important; }
          .lp-footer-bottom { flex-direction:column !important; gap:8px !important; text-align:center; }
          .lp-cta-section { padding:80px 0 60px !important; }
          .lp-cta-inner { padding:0 20px !important; }
          .lp-marquee-text { font-size:16px !important; }
          .lp-sql-inner { padding:0 20px !important; }
          .lp-sql-demo-tabs { flex-direction:column !important; align-items:flex-start !important; }
        }
        @media (max-width: 480px) {
          .lp-hero-stat { padding:8px 10px !important; }
          .lp-hero-stat-n { font-size:20px !important; }
          .lp-sql-steps { grid-template-columns:1fr !important; }
          .lp-metrics-grid { grid-template-columns:1fr !important; }
          .lp-metrics-item { border-top:1px solid rgba(139,92,246,.12) !important; padding-top:20px !important; }
          .lp-metrics-item:first-child { border-top:none !important; padding-top:0 !important; }
        }
      `}</style>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="lp-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 32px', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', background: scrolled ? 'rgba(6,4,26,.95)' : 'rgba(0,0,0,.18)', borderBottom: scrolled ? '1px solid rgba(139,92,246,.2)' : '1px solid rgba(255,255,255,.08)', transition: 'all .3s ease' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <BrandMark className="h-7 w-7" />
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>YooBees</span>
        </a>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <Link to={dashPath} style={{ padding: '8px 20px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,.35)' }}>
              Open Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ padding: '8px 18px', borderRadius: 99, border: '1px solid rgba(255,255,255,.3)', color: 'rgba(255,255,255,.9)', fontWeight: 600, fontSize: 13, textDecoration: 'none', transition: 'all .2s' }}>
                Sign In
              </Link>
              <Link to="/register" style={{ padding: '8px 20px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,.35)' }}>
                Get Started →
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero — Full-screen video ─────────────────────────────────────── */}
      <section id="top" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: '#000' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'translateY(17%)', opacity: 0, zIndex: 0 }}
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,.6) 0%, rgba(0,0,0,.28) 45%, rgba(0,0,0,.7) 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: 64 }}>
          <div className="lp-hero-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 60px', textAlign: 'center', transform: 'translateY(-6%)' }}>
            {/* Badge */}
            <div className="liquid-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 99, padding: '5px 16px', marginBottom: 24 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa', display: 'inline-block', animation: 'lpPulse 1.8s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)' }}>Postgraduate teaching platform · Yoobee Colleges · 2026</span>
            </div>
            {/* Headline */}
            <h1 className="lp-hero-h1" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(52px, 9vw, 108px)', fontWeight: 400, color: '#fff', margin: '0 0 24px', letterSpacing: '-0.02em', lineHeight: 1.0 }}>
              Teaching, <em>attended.</em><br />
              Learning, <em>measured.</em>
            </h1>
            {/* Subtext */}
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.68)', lineHeight: 1.65, maxWidth: '50ch', margin: '0 0 32px' }}>
              YooBees started as a simple idea — what if every part of your class happened in one place? Attendance, live lessons, study tools. Built specifically for <strong style={{ color: '#c4b5fd' }}>Masters of Business Informatics</strong> at Yoobee Colleges.
            </p>
            {/* CTA buttons */}
            <div className="liquid-glass" style={{ borderRadius: 99, padding: '6px 8px', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
              {user ? (
                <Link to={dashPath} style={{ background: '#fff', borderRadius: 99, padding: '10px 26px', color: '#1e1b4b', fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
                  Open Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" style={{ background: '#fff', borderRadius: 99, padding: '10px 24px', color: '#1e1b4b', fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
                    Get Started
                  </Link>
                  <Link to="/login" className="liquid-glass" style={{ borderRadius: 99, padding: '10px 20px', color: 'rgba(255,255,255,.9)', fontWeight: 600, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
                    Sign In
                  </Link>
                </>
              )}
            </div>
            {/* Stats row */}
            <div className="lp-hero-stats" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['228', 'Students'], ['3', 'Courses'], ['24', 'Countries'], ['2,500+', 'Sessions']].map(([n, l]) => (
                <div key={l} className="liquid-glass lp-hero-stat" style={{ textAlign: 'center', borderRadius: 14, padding: '12px 20px' }}>
                  <div className="lp-hero-stat-n" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,.55)', marginTop: 4, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Social footer */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, paddingBottom: 36 }}>
            {[['Instagram', '◌'], ['Twitter / X', '✕'], ['Website', '◎']].map(([label, icon]) => (
              <button key={label} aria-label={label} className="liquid-glass" style={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.75)', cursor: 'pointer', border: 'none', background: 'none', fontSize: 16 }}>
                {icon}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard scroll reveal ──────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(180deg, #000 0%, ${D.bg1} 100%)`, padding: '0 0 0' }}>
        <ContainerScroll
          titleComponent={
            <div style={{ textAlign: 'center', paddingBottom: 0 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 14 }}>Platform Overview</div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(38px, 6vw, 84px)', fontWeight: 400, color: '#f5f3ff', lineHeight: 1.0, letterSpacing: '-0.025em', margin: 0 }}>
                Every feature.<br /><em>One dashboard.</em>
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', marginTop: 16, maxWidth: '42ch', margin: '14px auto 0', lineHeight: 1.6 }}>
                Real students, live data — attendance, analytics, and everything else in one view.
              </p>
            </div>
          }
        >
          <DashboardMockup />
        </ContainerScroll>
      </section>

      {/* ── Marquee ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(139,92,246,.15)', borderBottom: '1px solid rgba(139,92,246,.15)', background: D.bg2, padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', gap: 64, whiteSpace: 'nowrap', animation: 'lpMarquee 36s linear infinite', willChange: 'transform' }}>
          {['Live attendance', 'Fraud detection', 'Real-time canvas', 'Peer matching', 'Quiz analytics', 'SQL lab', 'Multi-campus', 'ER diagrams', 'Agile/Scrum MCQ', 'Video lessons', 'Live attendance', 'Fraud detection', 'Real-time canvas', 'Peer matching', 'Quiz analytics', 'SQL lab', 'Multi-campus', 'ER diagrams', 'Agile/Scrum MCQ', 'Video lessons'].map((t, i) => (
            <span key={i} className="lp-marquee-text" style={{ fontStyle: 'italic', fontSize: 20, color: D.txt3, fontFamily: 'serif' }}>
              <span style={{ color: '#7c3aed', fontStyle: 'normal', marginRight: 44, fontSize: 13 }}>✦</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Problem ─────────────────────────────────────────────────────── */}
      <section id="problem" className="lp-section-pad" style={{ padding: '100px 0 80px', background: D.bg1 }}>
        <div className="lp-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          {/* Header */}
          <div ref={problemRef} className={`lp-reveal-item lp-hdr-grid ${problemInView ? 'lp-visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 72 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bfa' }}>01 — The problem</div>
            </div>
            <div>
              <h2 style={{ fontSize: 'clamp(34px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 18, color: D.txt1 }}>
                Postgraduate classrooms need <em style={{ color: '#7c3aed', fontStyle: 'italic' }}>more</em> than a roll call.
              </h2>
              <p style={{ fontSize: 17, color: D.txt2, lineHeight: 1.6 }}>
                Most learning platforms were built for large undergraduate classes. But a postgraduate cohort is different. Students come from 24 countries, with years of work experience, and they expect more. The old tools just don't fit.
              </p>
            </div>
          </div>

          {/* Problem rows — editorial layout */}
          <div className={`lp-stagger ${problemInView ? 'lp-visible' : ''}`}>
            {[
              {
                num: '01',
                badge: 'Attendance Integrity',
                icon: '🛡',
                problem: 'Sign-in sheets are easy to cheat.',
                detail: "Imagine someone screenshots the attendance code and sends it to their friend who's still at home. Or signs their mate's name on the sheet. The lecturer only finds out weeks later — if at all.",
                solution: "YooBees spots the patterns automatically. Two submissions from the same Wi-Fi? Flagged. Someone submitting from over a kilometre away? Flagged. All of it, before the class even ends.",
                accent: '#7c3aed',
                accentBg: 'rgba(124,58,237,.1)',
                accentBorder: 'rgba(124,58,237,.25)',
              },
              {
                num: '02',
                badge: 'Classroom Engagement',
                icon: '⇄',
                problem: 'Lectures feel one-directional.',
                detail: "The back row can't read the whiteboard. Nobody answers when the lecturer asks 'any questions?' The class feels one-way — the teacher talks, the students listen, and nothing really connects.",
                solution: "YooBees gives the lecturer a shared canvas that every student sees live on their device. Quick polls, real-time checklists. The back row sees exactly what the front row sees.",
                accent: '#0891b2',
                accentBg: 'rgba(8,145,178,.1)',
                accentBorder: 'rgba(8,145,178,.25)',
              },
              {
                num: '03',
                badge: 'Cohort Community',
                icon: '◎',
                problem: "Cohorts don't know each other.",
                detail: "Two students sit next to each other every week and never realise they're from the same city, or worked in the same industry for a decade. That's a missed connection — and it happens all the time.",
                solution: "On day one, YooBees looks at each student's background — their industry, country, and education — and suggests three people they should meet. Like a matching app, for your classmates.",
                accent: '#059669',
                accentBg: 'rgba(5,150,105,.1)',
                accentBorder: 'rgba(5,150,105,.25)',
              },
            ].map(({ num, badge, icon, problem, detail, solution, accent, accentBg, accentBorder }, idx) => (
              <div key={num} className={`lp-reveal-item lp-problem-row`} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: 48, padding: '52px 0', borderBottom: idx < 2 ? `1px solid ${D.border}` : 'none', alignItems: 'center' }}>
                {/* Number + icon column */}
                <div className="lp-problem-num" style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 52, fontWeight: 900, color: 'rgba(139,92,246,.1)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.04em' }}>{num}</div>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: accentBg, border: `1px solid ${accentBorder}`, display: 'grid', placeItems: 'center', fontSize: 20, margin: '-4px auto 0' }}>{icon}</div>
                </div>
                {/* Problem description */}
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: accentBg, border: `1px solid ${accentBorder}`, borderRadius: 99, padding: '4px 12px', marginBottom: 16 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 9.5, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{badge}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(22px, 2.5vw, 34px)', color: D.txt1, lineHeight: 1.15, fontWeight: 400, marginBottom: 14 }}>{problem}</h3>
                  <p style={{ fontSize: 14.5, color: D.txt2, lineHeight: 1.65 }}>{detail}</p>
                </div>
                {/* Solution card */}
                <div style={{ background: accentBg, borderRadius: 20, padding: '28px 28px', border: `1px solid ${accentBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: accent, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 16, flexShrink: 0 }}>✓</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, fontWeight: 700 }}>The solution</div>
                  </div>
                  <p style={{ fontSize: 14.5, color: D.txt1, lineHeight: 1.65, margin: 0 }}>{solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Audience ────────────────────────────────────────────────────── */}
      <section id="audience" style={{ background: D.bg2, padding: '100px 0', margin: '0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 500px at 80% 20%, rgba(124,58,237,.22), transparent 60%), radial-gradient(600px 400px at 10% 90%, rgba(167,139,250,.1), transparent 60%)', pointerEvents: 'none' }} />
        <div ref={audRef} className="lp-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
          <div className={`lp-reveal-item ${audInView ? 'lp-visible' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 20 }}>
            <h2 style={{ fontFamily: 'serif', fontSize: 'clamp(36px,6vw,80px)', fontWeight: 400, lineHeight: 1, color: '#f5f3ff', letterSpacing: '-0.025em', margin: 0 }}>
              One platform.<br /><span style={{ color: '#a78bfa', fontStyle: 'italic' }}>Two audiences.</span>
            </h2>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 99, padding: 4 }}>
              {(['students', 'staff'] as const).map(t => (
                <button key={t} onClick={() => setActiveAudTab(t)} style={{ padding: '9px 20px', fontSize: 12, borderRadius: 99, color: activeAudTab === t ? '#1e1b4b' : 'rgba(255,255,255,.6)', background: activeAudTab === t ? '#f5f3ff' : 'transparent', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', transition: 'all .3s ease' }}>
                  For {t}
                </button>
              ))}
            </div>
          </div>

          <div className="lp-aud-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {(activeAudTab === 'students' ? studentFeatures : staffFeatures).map(f => (
              <Link key={f.title} to={f.link} style={{ textDecoration: 'none', border: '1px solid rgba(255,255,255,.1)', borderRadius: 18, padding: '26px', background: 'rgba(255,255,255,.02)', transition: 'all .35s ease', display: 'block', animation: 'lpScaleIn .4s ease both' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,.2)', color: '#a78bfa', display: 'grid', placeItems: 'center', marginBottom: 18, fontSize: 18 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'serif', fontWeight: 400, fontSize: 22, letterSpacing: '-0.01em', color: '#f5f3ff', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,.58)', marginBottom: 16 }}>{f.desc}</p>
                <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.45)', padding: '4px 10px', borderRadius: 99 }}>{f.tag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — full redesign ─────────────────────────────────── */}
      <section id="story" style={{ background: D.bg3, padding: '100px 0 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '-80px', left: '-160px', width: 520, height: 520, borderRadius: '50%', background: 'rgba(124,58,237,.14)', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-80px', width: 360, height: 360, borderRadius: '50%', background: 'rgba(167,139,250,.09)', filter: 'blur(70px)', pointerEvents: 'none' }} />

        <div className="lp-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
          {/* Section header */}
          <div className="lp-hdr-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginBottom: 72, alignItems: 'end' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 20 }}>02 — How it works</div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(38px, 5.5vw, 74px)', fontWeight: 400, color: '#f5f3ff', lineHeight: 1.0, letterSpacing: '-0.025em', margin: 0 }}>
                A class,<br />minute by minute.
              </h2>
            </div>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.48)', lineHeight: 1.7, maxWidth: '44ch', marginBottom: 4 }}>
              Here's what a real class session looks like — from the moment students arrive to the lecturer wrapping up.
            </p>
          </div>

          {/* Content */}
          <div className="lp-story-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 48, alignItems: 'start' }}>
            {/* Left: step list */}
            <div>
              {storySteps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  className={`lp-step-btn${activeStoryStep === i ? ' active' : ''}`}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: 'none', border: 'none',
                    borderLeft: `2px solid ${activeStoryStep === i ? '#7c3aed' : 'rgba(255,255,255,.08)'}`,
                    padding: '22px 0 22px 24px',
                    cursor: 'pointer', transition: 'border-color .3s ease',
                    borderBottom: i < storySteps.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: activeStoryStep === i ? '#a78bfa' : 'rgba(255,255,255,.28)', letterSpacing: '0.15em' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ background: activeStoryStep === i ? 'rgba(124,58,237,.35)' : 'rgba(255,255,255,.06)', color: activeStoryStep === i ? '#c4b5fd' : 'rgba(255,255,255,.3)', padding: '2px 10px', borderRadius: 99, fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.1em', transition: 'all .3s' }}>
                      {step.time}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 23, color: activeStoryStep === i ? '#fff' : 'rgba(255,255,255,.32)', lineHeight: 1.15, transition: 'color .3s', marginBottom: activeStoryStep === i ? 12 : 0 }}>
                    {step.label}
                  </div>
                  {activeStoryStep === i && (
                    <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.52)', lineHeight: 1.7, animation: 'lpReveal .35s ease both', margin: 0 }}>
                      {step.body}
                    </p>
                  )}
                </button>
              ))}
              {/* Progress bar */}
              <div style={{ display: 'flex', gap: 5, marginTop: 28, paddingLeft: 24 }}>
                {storySteps.map((_, i) => (
                  <button key={i} onClick={() => goToStep(i)} style={{ height: 2, flex: i === activeStoryStep ? 3 : 1, borderRadius: 99, background: i === activeStoryStep ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' : 'rgba(255,255,255,.1)', border: 'none', cursor: 'pointer', padding: 0, transition: 'flex .45s cubic-bezier(.4,0,.2,1)' }} />
                ))}
              </div>
            </div>

            {/* Right: browser mockup */}
            <div className="lp-story-mockup">
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)' }}>
                {/* Browser chrome */}
                <div style={{ background: '#f0eeff', padding: '10px 16px', borderBottom: '1px solid rgba(139,92,246,.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#e6a39a' }} />
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#e6cf8c' }} />
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#a8cba6' }} />
                  </div>
                  <div style={{ flex: 1, marginLeft: 6, background: '#fff', borderRadius: 6, padding: '4px 12px', fontFamily: 'monospace', fontSize: 10, color: '#8b7fa6', border: '1px solid rgba(139,92,246,.1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    yoobees.app / {['attendance/opening', 'playground', 'attendance/results', 'dashboard/match', 'dashboard'][activeStoryStep]}
                  </div>
                </div>
                {/* Screen */}
                <div key={activeStoryStep + '_s'} style={{ height: 460, display: 'flex', flexDirection: 'column', animation: 'lpScaleIn .3s ease both', overflow: 'hidden' }}>
                  <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {storySteps[activeStoryStep].screen}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SQL Lab Deep Dive ─────────────────────────────────────────────── */}
      <section id="sql-lab" className="lp-section-pad" style={{ padding: '100px 0', background: D.bg1, borderTop: `1px solid ${D.border}`, borderBottom: `1px solid ${D.border}` }}>
        <div ref={sqlRef} className="lp-sql-inner lp-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div className={`lp-reveal-item lp-hdr-grid ${sqlInView ? 'lp-visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 60 }}>
            <div><div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bfa' }}>03 — Novel SQL Learning Lab</div></div>
            <div>
              <h2 style={{ fontSize: 'clamp(34px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 16, color: D.txt1 }}>
                Not textbook queries.<br /><span style={{ color: '#a78bfa' }}>Real schemas, real feedback.</span>
              </h2>
              <p style={{ fontSize: 17, color: D.txt2, lineHeight: 1.6, maxWidth: '58ch' }}>
                Instead of textbook exercises, students get real database scenarios — a library system, a hospital records database, a school grade tracker. They write SQL to solve actual problems. The platform checks their answer in five steps and tells them exactly where they went right or wrong. The lecturer watches everyone's progress on a live scoreboard.
              </p>
            </div>
          </div>

          {/* Animated pipeline steps */}
          <div className={`lp-stagger ${sqlInView ? 'lp-visible' : ''}`} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'stretch', overflowX: 'auto', paddingBottom: 4, gap: 0 }}>
              {[
                { n: '01', icon: '🗂', title: 'Pick a Scenario', desc: 'Choose from three real-world setups — a library, a hospital, or a school. Each one has real tables and tricky edge cases.', color: '#a78bfa', colorLight: 'rgba(124,58,237,.12)', colorBorder: 'rgba(124,58,237,.32)', delay: 0 },
                { n: '02', icon: '📝', title: 'Read the Schema', desc: 'Before writing anything, you can see the full database structure — exactly like a real-world project would look.', color: '#60a5fa', colorLight: 'rgba(37,99,235,.1)', colorBorder: 'rgba(37,99,235,.28)', delay: 0.1 },
                { n: '03', icon: '⌨', title: 'Write SQL', desc: 'Type your query in the browser. Hints appear as you write. No restrictions — just real SQL, the way you would use it at work.', color: '#22d3ee', colorLight: 'rgba(8,145,178,.1)', colorBorder: 'rgba(8,145,178,.28)', delay: 0.2 },
                { n: '04', icon: '🔬', title: '5-Step Verify', desc: 'Your query is checked in five steps — syntax, schema, logic, output, and edge cases. You see exactly which step passes and which one does not.', color: '#34d399', colorLight: 'rgba(5,150,105,.1)', colorBorder: 'rgba(5,150,105,.28)', delay: 0.3 },
                { n: '05', icon: '📊', title: 'Staff Tracks All', desc: "The lecturer sees a live table — who has finished which scenario, how far everyone else has got, and when they last worked on it.", color: '#fbbf24', colorLight: 'rgba(217,119,6,.1)', colorBorder: 'rgba(217,119,6,.28)', delay: 0.4 },
              ].map((s, i) => (
                <div key={s.n} className="lp-reveal-item" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 172, animation: `lpReveal .5s ease ${s.delay}s both` }}>
                  {/* Step card */}
                  <div
                    style={{ flex: 1, background: s.colorLight, border: `1px solid ${s.colorBorder}`, borderRadius: 18, padding: '26px 18px 22px', textAlign: 'center', transition: 'transform .28s ease, box-shadow .28s ease', cursor: 'default', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${s.colorBorder}`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Floating icon */}
                    <div style={{ fontSize: 40, marginBottom: 14, display: 'inline-block', animation: `lpIconBounce 3.2s ease-in-out ${i * 0.55}s infinite` }}>{s.icon}</div>
                    {/* Numbered badge */}
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: s.color, color: '#fff', fontFamily: 'monospace', fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center', marginBottom: 12, letterSpacing: '0.04em', flexShrink: 0 }}>{s.n}</div>
                    {/* Title */}
                    <div style={{ fontWeight: 700, fontSize: 13, color: D.txt1, marginBottom: 8, lineHeight: 1.3 }}>{s.title}</div>
                    {/* Description */}
                    <div style={{ fontSize: 11.5, color: D.txt2, lineHeight: 1.55, flexGrow: 1 }}>{s.desc}</div>
                    {/* Bottom accent line */}
                    <div style={{ width: 28, height: 2, borderRadius: 99, background: s.color, marginTop: 16, opacity: 0.5 }} />
                  </div>
                  {/* Connector arrow */}
                  {i < 4 && (
                    <div style={{ padding: '0 6px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 20, color: '#a78bfa', animation: `lpArrowPulse 2s ease-in-out ${i * 0.4}s infinite` }}>›</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: D.card, borderRadius: 20, border: `1px solid ${D.border}`, overflow: 'hidden' }}>
            <div className="lp-sql-demo-tabs" style={{ borderBottom: `1px solid ${D.border}`, padding: '14px 24px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, color: D.txt1, fontSize: 14 }}>Interactive Preview</span>
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
      <section id="numbers" className="lp-section-pad" style={{ padding: '100px 0', borderTop: `1px solid ${D.border}`, background: D.bg2 }}>
        <div className="lp-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div className="lp-hdr-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 60 }}>
            <div><div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bfa' }}>04 — By the numbers</div></div>
            <div>
              <h2 style={{ fontSize: 'clamp(34px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, color: D.txt1 }}>
                What's actually <em style={{ color: '#a78bfa' }}>built.</em>
              </h2>
              <p style={{ fontSize: 17, color: D.txt2, lineHeight: 1.6, marginTop: 16 }}>These are not made-up numbers. This is what the platform has actually done — live sessions, real students, every week this semester.</p>
            </div>
          </div>

          <div ref={metricsRef} className="lp-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {metrics.map(({ n, suffix, label, desc }, i) => (
              <div key={label} className="lp-metrics-item" style={{ padding: '0 32px', borderLeft: i === 0 ? 'none' : `1px solid ${D.border}`, paddingLeft: i === 0 ? 0 : 32 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, fontFamily: 'serif', fontSize: 'clamp(40px,5.5vw,76px)', fontWeight: 400, lineHeight: 1, letterSpacing: '-0.03em', color: D.txt1 }}>
                  {n.toLocaleString()}
                  {suffix && <span style={{ fontSize: 20, color: '#a78bfa', fontStyle: 'italic' }}>{suffix}</span>}
                </div>
                <div style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: D.txt2 }}>{label}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: D.txt3, lineHeight: 1.45 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ──────────────────────────────────────────────────── */}
      <section id="tech" className="lp-section-pad" style={{ padding: '100px 0', background: D.bg3, borderTop: `1px solid ${D.border}` }}>
        <div ref={techRef} className="lp-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div className={`lp-reveal-item lp-tech-grid ${techInView ? 'lp-visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 80, alignItems: 'center' }}>
            <div className="lp-tech-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: D.border, border: `1px solid ${D.border}`, borderRadius: 20, overflow: 'hidden' }}>
              {tech.map(({ layer, name }) => (
                <div key={name} style={{ background: D.card, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background .2s' }} onMouseEnter={e => (e.currentTarget.style.background = D.cardH)} onMouseLeave={e => (e.currentTarget.style.background = D.card)}>
                  <span style={{ fontSize: 12, color: D.txt3, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{layer}</span>
                  <span style={{ fontFamily: 'serif', fontSize: 20, color: D.txt1 }}>{name}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', animation: 'lpPulse 1.8s ease-in-out infinite' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a78bfa' }}>05 — Built right</span>
              </div>
              <h3 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 18, color: D.txt1 }}>Production-grade architecture, zero servers to maintain.</h3>
              <p style={{ color: D.txt2, fontSize: 16, lineHeight: 1.65, marginBottom: 14 }}>YooBees runs on Firebase — which means real-time updates, user logins, and file storage all work instantly, with no server to manage. Between classes the cost is nearly zero. During class it handles hundreds of students without slowing down.</p>
              <p style={{ color: D.txt2, fontSize: 16, lineHeight: 1.65 }}>Every page loads only when you need it, so the app stays fast. And the database has its own security rules — so even if someone tried to bypass the interface, they still could not access data they are not supposed to see.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="lp-cta-section" style={{ padding: '140px 0 100px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: D.bg1 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(1000px 500px at 50% 30%, rgba(124,58,237,.18), transparent 60%)', pointerEvents: 'none' }} />
        <div className="lp-cta-inner" style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
          <h2 style={{ fontFamily: 'serif', fontWeight: 400, fontSize: 'clamp(42px,8vw,108px)', lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 36, color: D.txt1 }}>
            A teaching tool,<br /><em style={{ color: '#a78bfa' }}>already shipping.</em>
          </h2>
          <p style={{ color: D.txt2, fontSize: 18, maxWidth: '50ch', margin: '0 auto 44px', lineHeight: 1.55 }}>
            This is not a prototype or a pitch deck. It is a real platform, used in real classes every week. And you can try it right now — no download, no setup required.
          </p>
          <div style={{ display: 'inline-flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {user ? (
              <Link to={dashPath} style={{ padding: '16px 32px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 28px rgba(124,58,237,.4)', display: 'inline-block' }}>
                Open Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" style={{ padding: '16px 32px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 28px rgba(124,58,237,.4)' }}>
                  Create Account →
                </Link>
                <Link to="/login" style={{ padding: '16px 32px', borderRadius: 99, border: '1.5px solid rgba(167,139,250,.4)', color: '#a78bfa', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ padding: '52px 40px 36px', borderTop: `1px solid ${D.border}`, background: D.bg0 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="lp-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <BrandMark className="h-8 w-8" />
                <span style={{ fontFamily: 'serif', fontSize: 26, letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>YooBees</span>
              </div>
              <p style={{ color: D.txt2, fontSize: 14, maxWidth: '34ch', lineHeight: 1.55 }}>A teaching platform built for postgraduate students at Yoobee Colleges, New Zealand.</p>
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: D.txt3, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Platform</div>
              {[['Attendance', '/student/attendance'], ['Live Playground', '/student/playground'], ['Resources', '/student/course-resources'], ['Analytics', '/lecturer/analytics']].map(([l, p]) => (
                <div key={l}><Link to={p} style={{ display: 'block', fontSize: 14, color: D.txt2, padding: '4px 0', textDecoration: 'none' }}>{l}</Link></div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: D.txt3, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Courses</div>
              {['MBI800', 'MBI802', 'MBI804'].map(c => <div key={c} style={{ fontSize: 14, color: D.txt2, padding: '4px 0' }}>{c}</div>)}
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: D.txt3, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Built by</div>
              <div style={{ fontSize: 14, color: D.txt2, lineHeight: 1.7 }}>Dr Yasas Sri Wickramasinghe<br />HIT Lab NZ<br />Yoobee Colleges</div>
            </div>
          </div>
          <div className="lp-footer-bottom" style={{ borderTop: `1px solid ${D.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', fontSize: 10, color: D.txt3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span>v1.0 · 2026</span>
            <span>Christchurch · Aotearoa New Zealand</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
