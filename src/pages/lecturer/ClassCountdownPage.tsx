import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, Maximize2, Users } from 'lucide-react';
import { db } from '../../lib/firebase';
import type { StudentProfile } from '../../lib/types';
import { avatarGradient } from '../../components/ui/PhotoUploadModal';
import BrandMark from '../../components/ui/BrandMark';

// ─── Types & Config ───────────────────────────────────────────────
type CourseCode = 'MBI800' | 'MBI802' | 'MBI804';

interface CourseConfig {
  code: CourseCode;
  name: string;
  label: string;
  accent: string;
  accentLight: string;
  accentGlow: string;
  textGradient: string;
  orbColor1: string;
  orbColor2: string;
  orbColor3: string;
}

const COURSES: Record<CourseCode, CourseConfig> = {
  MBI800: {
    code: 'MBI800',
    name: 'Business Information Systems',
    label: 'BIS',
    accent: '#f59e0b',
    accentLight: '#fde68a',
    accentGlow: 'rgba(245,158,11,0.32)',
    textGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 28%, #f59e0b 65%, #b45309 100%)',
    orbColor1: 'rgba(245,158,11,0.14)',
    orbColor2: 'rgba(251,191,36,0.08)',
    orbColor3: 'rgba(180,83,9,0.10)',
  },
  MBI802: {
    code: 'MBI802',
    name: 'Database Management Systems',
    label: 'DBMS',
    accent: '#8b5cf6',
    accentLight: '#c4b5fd',
    accentGlow: 'rgba(139,92,246,0.32)',
    textGradient: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 28%, #8b5cf6 65%, #4c1d95 100%)',
    orbColor1: 'rgba(124,58,237,0.18)',
    orbColor2: 'rgba(139,92,246,0.10)',
    orbColor3: 'rgba(76,29,149,0.12)',
  },
  MBI804: {
    code: 'MBI804',
    name: 'IT Project Management',
    label: 'ITPM',
    accent: '#0ea5e9',
    accentLight: '#bae6fd',
    accentGlow: 'rgba(14,165,233,0.32)',
    textGradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 28%, #0ea5e9 65%, #075985 100%)',
    orbColor1: 'rgba(14,165,233,0.14)',
    orbColor2: 'rgba(56,189,248,0.09)',
    orbColor3: 'rgba(7,89,133,0.11)',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────
function seededRand(seed: string, salt = 0): number {
  let h = salt;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return (h >>> 0) / 0xffffffff;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

// ─── Photo Card ───────────────────────────────────────────────────
function PhotoCard({ student, accent }: { student: StudentProfile; accent: string }) {
  const [hovered, setHovered] = useState(false);
  const isPortrait = seededRand(student.uid, 77) > 0.52;

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        aspectRatio: isPortrait ? '4/5' : '1/1',
        marginBottom: 8,
        position: 'relative',
        flexShrink: 0,
        transition: 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
        boxShadow: hovered
          ? `0 22px 52px rgba(0,0,0,0.45), 0 0 0 1.5px ${accent}70`
          : '0 4px 18px rgba(0,0,0,0.28)',
        zIndex: hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {student.photoURL ? (
        <img
          src={student.photoURL}
          alt={student.fullName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: avatarGradient(student.uid),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: 'clamp(20px, 4cqw, 38px)',
            letterSpacing: '-0.02em',
          }}
        >
          {getInitials(student.fullName || '?')}
        </div>
      )}

      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 45%, rgba(4,1,18,0.88) 100%)',
          opacity: hovered ? 1 : 0.62,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Name / country */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '8px 10px',
          transform: hovered ? 'translateY(0)' : 'translateY(5px)',
          opacity: hovered ? 1 : 0.88,
          transition: 'all 0.3s ease',
        }}
      >
        <p
          style={{
            color: 'white',
            fontWeight: 600,
            fontSize: 11,
            margin: 0,
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {student.fullName || 'Student'}
        </p>
        {hovered && student.homeCountry && (
          <p
            style={{
              color: accent,
              fontSize: 10,
              margin: '2px 0 0',
              fontWeight: 500,
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            {student.homeCountry}
          </p>
        )}
      </div>

      {/* Glow border on hover */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            border: `1.5px solid ${accent}65`,
            boxShadow: `inset 0 0 24px ${accent}18`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

// ─── Scrolling Photo Column ───────────────────────────────────────
function PhotoColumn({
  students,
  direction,
  duration,
  topOffset,
  accent,
}: {
  students: StudentProfile[];
  direction: 'up' | 'down';
  duration: number;
  topOffset: number;
  accent: string;
}) {
  if (!students.length) return null;
  const doubled = [...students, ...students];

  return (
    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', position: 'relative', marginTop: topOffset }}>
      <div
        className={direction === 'up' ? 'collage-scroll-up' : 'collage-scroll-down'}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((s, i) => (
          <PhotoCard key={`${s.uid}-${i}`} student={s} accent={accent} />
        ))}
      </div>
    </div>
  );
}

// ─── Floating Orb ────────────────────────────────────────────────
function FloatingOrb({
  size, color, style,
}: {
  size: number;
  color: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 72%)`,
        filter: `blur(${size * 0.28}px)`,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function ClassCountdownPage() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<CourseCode>('MBI802');
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cfg = COURSES[selectedCourse];

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch all students once
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'students'));
        setAllStudents(snap.docs.map(d => ({ uid: d.id, ...d.data() } as StudentProfile)));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fullscreen API
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Auto-hide controls in fullscreen after inactivity
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isFullscreen) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 4500);
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      resetHideTimer();
    } else {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isFullscreen, resetHideTimer]);

  // Filter students by selected course (subjects array)
  const courseStudents = useMemo(() => {
    const filtered = allStudents.filter(s => s.subjects?.includes(selectedCourse));
    return [...filtered].sort((a, b) => seededRand(a.uid + b.uid) - 0.5);
  }, [allStudents, selectedCourse]);

  // Split into 4 columns
  const columns = useMemo<StudentProfile[][]>(() => {
    const cols: StudentProfile[][] = [[], [], [], []];
    courseStudents.forEach((s, i) => cols[i % 4].push(s));
    return cols;
  }, [courseStudents]);

  const colConfigs = [
    { direction: 'up' as const,   duration: 44, topOffset: -24 },
    { direction: 'down' as const, duration: 54, topOffset: -44 },
    { direction: 'up' as const,   duration: 49, topOffset: -16 },
    { direction: 'down' as const, duration: 46, topOffset: -36 },
  ];

  // Clock parts
  const h = now.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = pad2(h % 12 === 0 ? 12 : h % 12);
  const mm = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());
  const timeStr = `${hh}:${mm}:${ss}`;
  const dateStr = now.toLocaleDateString('en-NZ', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={isFullscreen ? resetHideTimer : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        background: '#050210',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Background orbs ─────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <FloatingOrb
          size={700}
          color={cfg.orbColor1}
          style={{ top: '-180px', left: '-120px', animation: 'float 14s ease-in-out infinite' }}
        />
        <FloatingOrb
          size={500}
          color={cfg.orbColor2}
          style={{ bottom: '-150px', right: '-100px', animation: 'float 18s ease-in-out infinite reverse' }}
        />
        <FloatingOrb
          size={320}
          color={cfg.orbColor3}
          style={{ top: '40%', right: '42%', animation: 'float 11s ease-in-out infinite 3s' }}
        />
        <FloatingOrb
          size={200}
          color={cfg.orbColor1}
          style={{ bottom: '15%', left: '30%', animation: 'float 9s ease-in-out infinite 1.5s' }}
        />
        {/* Subtle grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
        {/* Radial vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(4,1,14,0.5) 100%)',
          }}
        />
      </div>

      {/* ── Controls bar ────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: '18px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(4,1,14,0.92) 0%, transparent 100%)',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'opacity 0.55s ease, transform 0.55s ease',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        {/* Back + course selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/lecturer/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.45)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={13} />
            Back
          </button>

          <div
            style={{
              width: 1,
              height: 20,
              background: 'rgba(255,255,255,0.10)',
            }}
          />

          {/* Course tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(Object.keys(COURSES) as CourseCode[]).map(code => {
              const c = COURSES[code];
              const active = selectedCourse === code;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedCourse(code)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 10,
                    border: active ? `1px solid ${c.accent}55` : '1px solid rgba(255,255,255,0.08)',
                    background: active
                      ? `linear-gradient(135deg, ${c.accent}22, ${c.accent}12)`
                      : 'rgba(255,255,255,0.04)',
                    color: active ? c.accent : 'rgba(255,255,255,0.38)',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.22s ease',
                    letterSpacing: '0.04em',
                    boxShadow: active ? `0 4px 20px ${c.accentGlow}` : 'none',
                  }}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 9,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Users size={13} color={cfg.accent} />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600 }}>
              {loading ? '…' : `${courseStudents.length} enrolled`}
            </span>
          </div>

          {!isFullscreen && (
            <button
              onClick={toggleFullscreen}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 18px', borderRadius: 10,
                border: `1px solid ${cfg.accent}40`,
                background: `${cfg.accent}14`,
                color: cfg.accent,
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
              }}
            >
              <Maximize2 size={14} />
              Full Screen
            </button>
          )}
        </div>
      </div>

      {/* ── Main layout ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, height: '100%', position: 'relative', zIndex: 10 }}>

        {/* ── Left panel ──────────────────────────────────────── */}
        <div
          style={{
            width: '52%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(80px,8vh,110px) clamp(40px,5vw,72px) clamp(40px,5vh,72px) clamp(40px,5vw,80px)',
            position: 'relative',
          }}
        >
          {/* Stay Tuned badge */}
          <div style={{ marginBottom: 'clamp(20px,3vh,36px)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 22px',
                borderRadius: 100,
                background: `${cfg.accent}16`,
                border: `1px solid ${cfg.accent}38`,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 0 28px ${cfg.accentGlow}`,
              }}
            >
              {/* Pulsing live dot */}
              <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                <span
                  className="animate-ping"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: cfg.accent,
                    opacity: 0.5,
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    display: 'block',
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: cfg.accent,
                    boxShadow: `0 0 8px ${cfg.accent}`,
                  }}
                />
              </span>
              <span
                style={{
                  color: cfg.accent,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                Stay Tuned
              </span>
            </div>
          </div>

          {/* Course code — massive gradient.
              key forces DOM remount on course change, avoiding a browser
              repaint bug where -webkit-background-clip:text shows a solid
              rectangle after a dynamic background gradient update. */}
          <div style={{ marginBottom: 'clamp(8px,1.2vh,16px)', lineHeight: 1 }}>
            <span
              key={selectedCourse}
              style={{
                fontSize: 'clamp(60px,8vw,108px)',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                background: cfg.textGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
                filter: `drop-shadow(0 0 50px ${cfg.accentGlow})`,
              }}
            >
              {selectedCourse}
            </span>
          </div>

          {/* Course full name */}
          <div style={{ marginBottom: 'clamp(28px,4vh,48px)' }}>
            <span
              style={{
                fontSize: 'clamp(16px,1.8vw,24px)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.48)',
                letterSpacing: '-0.01em',
                lineHeight: 1.35,
              }}
            >
              {cfg.name}
            </span>
          </div>

          {/* CLASS STARTS SOON banner */}
          <div
            style={{
              marginBottom: 'clamp(28px,4vh,48px)',
              padding: 'clamp(16px,2.2vh,26px) clamp(20px,2.5vw,36px)',
              borderRadius: 18,
              background: `linear-gradient(135deg, ${cfg.accent}1a 0%, ${cfg.accent}08 100%)`,
              border: `1px solid ${cfg.accent}30`,
              backdropFilter: 'blur(14px)',
              boxShadow: `0 0 70px ${cfg.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated sweep shimmer */}
            <div
              className="countdown-sweep"
              style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0,
                width: '40%',
                background: `linear-gradient(90deg, transparent, ${cfg.accent}20, transparent)`,
                pointerEvents: 'none',
              }}
            />
            <p
              style={{
                color: 'rgba(255,255,255,0.95)',
                fontWeight: 900,
                fontSize: 'clamp(20px,2.8vw,40px)',
                letterSpacing: '-0.025em',
                margin: 0,
                textShadow: `0 0 50px ${cfg.accentGlow}`,
                position: 'relative',
              }}
            >
              Class Starts Soon
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.32)',
                fontSize: 'clamp(11px,1vw,14px)',
                margin: 'clamp(5px,0.8vh,10px) 0 0',
                fontWeight: 500,
                letterSpacing: '0.04em',
                position: 'relative',
              }}
            >
              Get ready · Find your seat · Open your notes
            </p>
          </div>

          {/* Live clock */}
          <div style={{ marginBottom: 'clamp(4px,0.6vh,10px)', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span
              style={{
                fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                fontSize: 'clamp(38px,5.5vw,72px)',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.92)',
                letterSpacing: '0.04em',
                textShadow: `0 0 40px ${cfg.accentGlow}`,
                lineHeight: 1,
              }}
            >
              {timeStr}
            </span>
            <span
              style={{
                fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
                fontSize: 'clamp(18px,2vw,28px)',
                fontWeight: 600,
                color: cfg.accent,
                letterSpacing: '0.08em',
              }}
            >
              {ampm}
            </span>
          </div>

          {/* Date */}
          <div style={{ marginBottom: 'clamp(28px,4vh,52px)' }}>
            <span
              style={{
                color: 'rgba(255,255,255,0.28)',
                fontSize: 'clamp(12px,1.2vw,17px)',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {dateStr}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              width: '72%',
              background: `linear-gradient(90deg, ${cfg.accent}50, transparent)`,
              marginBottom: 'clamp(20px,3vh,36px)',
            }}
          />

          {/* Instructor */}
          <div style={{ marginBottom: 'clamp(20px,3vh,32px)' }}>
            <p
              style={{
                color: 'rgba(255,255,255,0.28)',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                margin: '0 0 8px',
              }}
            >
              Lecturer
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.88)',
                fontSize: 'clamp(17px,1.8vw,26px)',
                fontWeight: 700,
                margin: 0,
                letterSpacing: '-0.02em',
                textShadow: `0 0 24px ${cfg.accentGlow}`,
              }}
            >
              Yasas Sri Wickramasinghe
            </p>
          </div>

          {/* YooBees branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div
              style={{
                width: 34, height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(124,58,237,0.45)',
                flexShrink: 0,
              }}
            >
              <BrandMark className="h-4 w-4 text-white" />
            </div>
            <div>
              <p
                style={{
                  color: 'rgba(255,255,255,0.20)',
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  margin: '0 0 2px',
                }}
              >
                Powered by
              </p>
              <p
                style={{
                  color: 'rgba(255,255,255,0.50)',
                  fontSize: 'clamp(12px,1.1vw,15px)',
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: '0.02em',
                }}
              >
                YooBees
              </p>
            </div>
          </div>
        </div>

        {/* ── Right panel — photo collage ──────────────────────── */}
        <div
          style={{
            width: '48%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Fade masks */}
          <div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 140, zIndex: 20,
              background: 'linear-gradient(to bottom, #050210 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, zIndex: 20,
              background: 'linear-gradient(to top, #050210 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 70, zIndex: 20,
              background: 'linear-gradient(to right, #050210 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: 20, zIndex: 20,
              background: 'linear-gradient(to left, #050210 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Student count badge */}
          <div
            style={{
              position: 'absolute', top: 24, right: 24, zIndex: 30,
              padding: '8px 16px', borderRadius: 10,
              background: 'rgba(5,2,16,0.75)',
              backdropFilter: 'blur(14px)',
              border: `1px solid ${cfg.accent}28`,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
            }}
          >
            <Users size={13} color={cfg.accent} />
            <span style={{ color: cfg.accentLight, fontSize: 12, fontWeight: 700 }}>
              {loading ? 'Loading…' : `${courseStudents.length} students`}
            </span>
          </div>

          {/* Collage or empty state */}
          {!loading && courseStudents.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              <Users size={52} color="rgba(255,255,255,0.06)" />
              <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.18)', margin: 0 }}>
                No students enrolled in {selectedCourse} yet
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, height: '100%', padding: '0 16px 0 0' }}>
              {columns.map((col, i) =>
                col.length > 0 ? (
                  <PhotoColumn
                    key={i}
                    students={col}
                    direction={colConfigs[i].direction}
                    duration={colConfigs[i].duration}
                    topOffset={colConfigs[i].topOffset}
                    accent={cfg.accent}
                  />
                ) : null
              )}
            </div>
          )}

          {/* Decorative accent line on left edge of right panel */}
          <div
            style={{
              position: 'absolute',
              top: '15%', bottom: '15%', left: 0,
              width: 2,
              background: `linear-gradient(to bottom, transparent, ${cfg.accent}60, transparent)`,
              zIndex: 25,
            }}
          />
        </div>
      </div>

      {/* ── Bottom accent bar ────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${cfg.accent}70 25%, ${cfg.accentLight}90 50%, ${cfg.accent}70 75%, transparent 100%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 5s linear infinite',
          zIndex: 50,
        }}
      />
    </div>
  );
}
