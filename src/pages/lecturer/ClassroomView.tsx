import { useEffect, useMemo, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import {
  X, Users, ChevronLeft,
  MousePointerClick, Maximize2, Minimize2,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { getCachedStudents, setCachedStudents } from '../../lib/studentsCache';
import type { StudentProfile } from '../../lib/types';
import { useFeatureTracking } from '../../lib/useFeatureTracking';
import { ClassroomScene, SUBJECT_CONFIGS, type SubjectKey } from '../../components/classroom/ClassroomScene';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BrandMark from '../../components/ui/BrandMark';

const SUBJECTS = Object.keys(SUBJECT_CONFIGS) as SubjectKey[];

// Subject full names (matches ClassCountdown)
const SUBJECT_NAMES: Record<SubjectKey, string> = {
  MBI800: 'Strategic Information System Planning',
  MBI802: 'Database Management Systems',
  MBI804: 'IT Project Management',
};

export default function ClassroomView() {
  useFeatureTracking('3D Classroom');

  const [students,     setStudents]     = useState<StudentProfile[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [subject,      setSubject]      = useState<SubjectKey>('MBI802');
  const [selected,     setSelected]     = useState<StudentProfile | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const cached = getCachedStudents();
      if (cached) {
        setStudents(cached);
      } else {
        const snap = await getDocs(collection(db, 'students'));
        const all  = snap.docs.map(d => d.data() as StudentProfile);
        setCachedStudents(all);
        setStudents(all);
      }
      setLoading(false);
    })();
  }, []);

  // Fullscreen API change tracking
  useEffect(() => {
    const onFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      if (isFs) {
        // entering fullscreen — show toast briefly
        setToastVisible(true);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToastVisible(false), 2500);
      } else {
        setToastVisible(false);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Auto-hide controls in fullscreen (4s of inactivity)
  useEffect(() => {
    if (!isFullscreen) {
      setControlsVisible(true);
      if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
      return;
    }

    const arm = () => {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 4000);
    };
    arm();

    const onActivity = () => arm();
    const el = containerRef.current;
    el?.addEventListener('mousemove', onActivity);
    el?.addEventListener('mousedown', onActivity);
    el?.addEventListener('touchstart', onActivity);
    el?.addEventListener('keydown', onActivity);

    return () => {
      el?.removeEventListener('mousemove', onActivity);
      el?.removeEventListener('mousedown', onActivity);
      el?.removeEventListener('touchstart', onActivity);
      el?.removeEventListener('keydown', onActivity);
      if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
    };
  }, [isFullscreen]);

  // Cleanup timers on unmount
  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  // Filter by subject
  const subjectStudents = useMemo(
    () => students.filter(s => Array.isArray(s.subjects) && s.subjects.includes(subject)),
    [students, subject],
  );

  const cfg = SUBJECT_CONFIGS[subject];

  const handleSubject = (s: SubjectKey) => {
    setSubject(s);
    setSelected(null);
  };

  // Keyboard shortcuts: arrow nav for subjects, Esc to clear/exit, F to toggle fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      const idx = SUBJECTS.indexOf(subject);
      if (e.key === 'ArrowLeft'  && idx > 0)                   setSubject(SUBJECTS[idx - 1]);
      if (e.key === 'ArrowRight' && idx < SUBJECTS.length - 1) setSubject(SUBJECTS[idx + 1]);

      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          setSelected(null);
        }
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [subject]);

  // Persistent container styles (single DOM node — toggles between normal and fullscreen)
  const containerStyle: React.CSSProperties = {
    position: isFullscreen ? 'fixed' : 'relative',
    inset: isFullscreen ? 0 : undefined,
    zIndex: isFullscreen ? 9999 : undefined,
    background: '#06070b',
    height: isFullscreen ? '100vh' : 'calc(100vh - 240px)',
    minHeight: isFullscreen ? '100vh' : '520px',
    borderRadius: isFullscreen ? 0 : 16,
    overflow: 'hidden',
    border: isFullscreen ? 'none' : '1px solid rgb(229,231,235)',
    boxShadow: isFullscreen ? 'none' : '0 25px 50px -12px rgba(0,0,0,0.25)',
    cursor: isFullscreen && !controlsVisible ? 'none' : 'default',
  };

  // The 3D canvas + overlays — rendered into a single persistent container
  const sceneBlock = (
    <div ref={containerRef} style={containerStyle}>
      {/* Fullscreen top controls — only mounted when in fullscreen */}
      {isFullscreen && (
        <div
          style={{
            opacity: controlsVisible ? 1 : 0,
            pointerEvents: controlsVisible ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
          }}
        >
          <FullscreenControls
            subject={subject}
            cfg={cfg}
            studentCount={subjectStudents.length}
            onSubject={handleSubject}
            onExit={() => document.exitFullscreen().catch(() => {})}
          />
        </div>
      )}

      {/* 3D Canvas — always in the same DOM slot */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ClassroomScene
          students={subjectStudents}
          selectedId={selected?.uid ?? null}
          onSelect={setSelected}
          subject={subject}
          subjectCfg={cfg}
        />
      </div>

      {/* Selected student panel */}
      {selected && (
        <StudentPanel
          student={selected}
          onClose={() => setSelected(null)}
          accentColor={cfg.accent}
        />
      )}

      {/* Normal-mode bottom hint */}
      {!isFullscreen && !selected && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-black/45 backdrop-blur-sm text-white/65 text-xs px-4 py-2 rounded-full select-none">
            Click an avatar to feature · click again to deselect
          </div>
        </div>
      )}

      {/* Normal-mode bottom accent bar */}
      {!isFullscreen && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.accent}90, ${cfg.fill}, ${cfg.accent}90, transparent)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 5s linear infinite',
          }}
        />
      )}

      {/* Fullscreen — Exit button (auto-hides) */}
      {isFullscreen && (
        <button
          onClick={() => document.exitFullscreen().catch(() => {})}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.92)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            opacity: controlsVisible ? 1 : 0,
            pointerEvents: controlsVisible ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
            zIndex: 101,
          }}
        >
          <Minimize2 size={14} />
          Exit Full Screen
        </button>
      )}

      {/* Fullscreen entry toast */}
      {isFullscreen && toastVisible && (
        <div
          style={{
            position: 'absolute',
            top: 84,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 18px',
            borderRadius: 999,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.92)',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.02em',
            zIndex: 102,
            animation: 'fsToastFade 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          Press F or Esc to exit
        </div>
      )}

      {/* Inline keyframes — kept here so we don't touch other files */}
      <style>{`
        @keyframes fsToastFade {
          from { opacity: 0; transform: translate(-50%, -8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );

  return (
    <Layout>
      <PageHeader
        title="3D Classroom"
        subtitle="Subject-wise live seating view"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Subject tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {SUBJECTS.map(s => {
                const c     = SUBJECT_CONFIGS[s];
                const active = s === subject;
                return (
                  <button
                    key={s}
                    onClick={() => handleSubject(s)}
                    className="relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                    style={{
                      background: active ? `${c.accent}22` : 'transparent',
                      color:      active ? c.accent : '#64748b',
                      border:     active ? `1px solid ${c.accent}40` : '1px solid transparent',
                      boxShadow:  active ? `0 2px 12px ${c.glow}` : 'none',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Student count */}
            <div className="flex items-center gap-1.5 bg-white rounded-xl px-3.5 py-2.5 border border-gray-200 shadow-sm text-sm font-medium text-gray-600 select-none">
              <Users size={14} style={{ color: cfg.accent }} />
              <span>{loading ? '…' : `${subjectStudents.length} enrolled`}</span>
            </div>

            {/* Full-screen button */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all border shadow-sm"
              style={{
                background: `${cfg.accent}15`,
                color:       cfg.accent,
                borderColor: `${cfg.accent}35`,
              }}
            >
              <Maximize2 size={14} />
              Full Screen
            </button>
          </div>
        }
      />

      {/* Subject label row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm font-medium text-gray-400">{SUBJECT_NAMES[subject]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 select-none">
          <MousePointerClick size={13} />
          <span>Click avatar · Scroll zoom · Drag orbit · ← → switch subject · F fullscreen</span>
        </div>
      </div>

      {/* 3D Canvas — single persistent container (works for both normal and fullscreen) */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      ) : (
        sceneBlock
      )}
    </Layout>
  );
}

// ─── Fullscreen controls overlay ──────────────────────────────────────────────
function FullscreenControls({
  subject, cfg, studentCount, onSubject, onExit,
}: {
  subject: SubjectKey;
  cfg: (typeof SUBJECT_CONFIGS)[SubjectKey];
  studentCount: number;
  onSubject: (s: SubjectKey) => void;
  onExit: () => void;
}) {
  return (
    <div
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(4,1,16,0.9) 0%, transparent 100%)',
        pointerEvents: 'auto',
      }}
    >
      {/* Brand + back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
        }}>
          <BrandMark className="h-4 w-4 text-white" />
        </div>
        <button
          onClick={onExit}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
            borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <ChevronLeft size={13} />
          Exit
        </button>
      </div>

      {/* Subject tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {SUBJECTS.map(s => {
          const c = SUBJECT_CONFIGS[s];
          const active = s === subject;
          return (
            <button
              key={s}
              onClick={() => onSubject(s)}
              style={{
                padding: '8px 20px', borderRadius: 10,
                border: active ? `1px solid ${c.accent}55` : '1px solid rgba(255,255,255,0.08)',
                background: active ? `${c.accent}1e` : 'rgba(255,255,255,0.04)',
                color: active ? c.accent : 'rgba(255,255,255,0.38)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
                letterSpacing: '0.04em',
                boxShadow: active ? `0 4px 20px ${c.glow}` : 'none',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '7px 14px', borderRadius: 9,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Users size={13} color={cfg.accent} />
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600 }}>
          {studentCount} enrolled
        </span>
      </div>
    </div>
  );
}

// ─── Selected student panel ────────────────────────────────────────────────────
function StudentPanel({
  student, onClose, accentColor,
}: {
  student: StudentProfile;
  onClose: () => void;
  accentColor: string;
}) {
  const initials = student.fullName
    .split(' ').filter(Boolean).slice(0, 2)
    .map(n => n[0]?.toUpperCase() ?? '').join('');

  return (
    <div
      className="absolute top-4 right-4 w-72 rounded-2xl shadow-2xl border p-5 z-10 animate-fadeIn"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        borderColor: `${accentColor}25`,
      }}
      onClick={e => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        onClick={onClose}
      >
        <X size={15} />
      </button>

      {/* Photo or gradient avatar */}
      <div className="w-16 h-16 rounded-2xl mb-3 overflow-hidden shadow-md flex-shrink-0">
        {student.photoURL ? (
          <img
            src={student.photoURL}
            alt={student.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }}
          >
            {initials}
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 text-[15px] leading-tight pr-6">{student.fullName}</h3>
      <p className="text-xs text-gray-400 mt-0.5 font-mono">{student.studentId}</p>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
        <PanelRow label="Section" value={student.section  || '—'} accent={accentColor} highlight />
        <PanelRow label="Campus"  value={student.campus   || '—'} accent={accentColor} />
        <PanelRow label="Course"  value={student.course   || '—'} accent={accentColor} />
        <PanelRow label="Intake"  value={student.intake   || '—'} accent={accentColor} />
        {student.homeCountry && (
          <PanelRow label="Country" value={student.homeCountry} accent={accentColor} />
        )}
      </div>
    </div>
  );
}

function PanelRow({ label, value, accent, highlight }: { label: string; value: string; accent: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span
        className="text-xs font-semibold"
        style={highlight ? {
          background: `${accent}15`,
          color: accent,
          padding: '2px 10px',
          borderRadius: 99,
        } : { color: '#374151' }}
      >
        {value}
      </span>
    </div>
  );
}
