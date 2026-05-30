import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Maximize2, RotateCcw, Sparkles } from 'lucide-react';
import { COURSES, COURSE_CODES, pad2, type CourseCode } from '../lib/courseTheme';
import { getConcepts } from '../lib/courseConcepts';
import SwarmCanvas, { type SwarmPhase } from '../components/preclass/SwarmCanvas';
import BrandMark from '../components/ui/BrandMark';

const ACCESS_PASSWORD = 'notalms';
const UNLOCK_KEY = 'preclass_unlocked';

const GATHER_MS = 10_000;   // final-seconds assembly window
const BURST_MS = 1_200;     // flash at zero
const HOLD_MS = 6_000;      // "class is starting" hold
const LOOP_RESET_MIN = 5;   // auto re-arm the countdown after the hold

// ─── Password gate ────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const accent = COURSES.MBI802.accent;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === ACCESS_PASSWORD) {
      sessionStorage.setItem(UNLOCK_KEY, '1');
      onUnlock();
    } else {
      setError(true);
      setValue('');
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#050210',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <form
        onSubmit={submit}
        className={error ? 'preclass-shake' : ''}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
          padding: '44px 48px', borderRadius: 24,
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${accent}33`,
          boxShadow: `0 0 60px ${COURSES.MBI802.accentGlow}`,
          backdropFilter: 'blur(14px)',
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${accent}, #a78bfa)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 28px ${COURSES.MBI802.accentGlow}`,
          }}
        >
          <Lock size={26} color="#fff" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Pre-Class Display
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '6px 0 0' }}>
            Enter the access password to continue
          </p>
        </div>
        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          style={{
            width: 260, padding: '12px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.14)'}`,
            color: '#fff', fontSize: 15, fontWeight: 500, outline: 'none',
            textAlign: 'center', letterSpacing: '0.1em',
          }}
        />
        <button
          type="submit"
          style={{
            width: 260, padding: '12px 16px', borderRadius: 12,
            background: `linear-gradient(135deg, ${accent}, #7c3aed)`,
            border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.02em',
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────
export default function PreClassSwarmPage() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === '1');
  const [selectedCourse, setSelectedCourse] = useState<CourseCode>('MBI802');
  const [now, setNow] = useState(Date.now());
  const [targetTs, setTargetTs] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cfg = COURSES[selectedCourse];

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Tick (250ms for smooth MM:SS + accurate phase changes)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  // Auto re-arm the countdown after the hold window, so the display loops.
  useEffect(() => {
    if (targetTs == null) return;
    if (now - targetTs >= BURST_MS + HOLD_MS) {
      setTargetTs(Date.now() + LOOP_RESET_MIN * 60_000);
    }
  }, [now, targetTs]);

  // Fullscreen API
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  }, []);

  // Auto-hide controls in fullscreen
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isFullscreen) hideTimerRef.current = setTimeout(() => setControlsVisible(false), 4500);
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) resetHideTimer();
    else { setControlsVisible(true); if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, [isFullscreen, resetHideTimer]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  // ── Derive countdown phase ──────────────────────────────────────
  let phase: SwarmPhase = 'drift';
  let gatherProgress = 0;
  let remainingMs: number | null = null;

  if (targetTs != null) {
    const rem = targetTs - now;
    if (rem > GATHER_MS) {
      phase = 'drift'; remainingMs = rem;
    } else if (rem > 0) {
      phase = 'gather'; gatherProgress = 1 - rem / GATHER_MS; remainingMs = rem;
    } else {
      const since = now - targetTs;
      remainingMs = 0;
      if (since < BURST_MS) phase = 'burst';
      else if (since < BURST_MS + HOLD_MS) phase = 'hold';
      else phase = 'restart';
    }
  }

  const totalSec = remainingMs != null ? Math.ceil(remainingMs / 1000) : 0;
  const mm = pad2(Math.floor(totalSec / 60));
  const ss = pad2(totalSec % 60);

  // numeric countdown fades out as the swarm assembles the code
  const countdownOpacity =
    phase === 'drift' ? 1 : phase === 'gather' ? Math.max(0, 1 - gatherProgress * 1.4) : 0;
  const startingVisible = phase === 'burst' || phase === 'hold';

  // Live clock
  const d = new Date(now);
  const h = d.getHours();
  const clock = `${pad2(h % 12 === 0 ? 12 : h % 12)}:${pad2(d.getMinutes())} ${h >= 12 ? 'PM' : 'AM'}`;
  const dateStr = d.toLocaleDateString('en-NZ', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const presets: { label: string; fn: () => void }[] = [
    { label: '5 min', fn: () => setTargetTs(Date.now() + 5 * 60_000) },
    { label: '10 min', fn: () => setTargetTs(Date.now() + 10 * 60_000) },
    { label: '15 min', fn: () => setTargetTs(Date.now() + 15 * 60_000) },
    {
      label: 'Top of hour',
      fn: () => {
        const t = new Date();
        t.setMinutes(0, 0, 0);
        t.setHours(t.getHours() + 1);
        setTargetTs(t.getTime());
      },
    },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={isFullscreen ? resetHideTimer : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden',
        background: '#050210',
        fontFamily: "'Inter', system-ui, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* Particle swarm background */}
      <SwarmCanvas
        words={getConcepts(selectedCourse)}
        accent={cfg.accent}
        accentLight={cfg.accentLight}
        targetText={selectedCourse}
        phase={phase}
        gatherProgress={gatherProgress}
        reducedMotion={reducedMotion}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(4,1,14,0.6) 100%)',
        }}
      />

      {/* ── Top controls bar ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(4,1,14,0.9) 0%, transparent 100%)',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'opacity 0.55s ease, transform 0.55s ease',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <ArrowLeft size={13} /> Exit
          </button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.10)' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {COURSE_CODES.map((code) => {
              const c = COURSES[code];
              const active = selectedCourse === code;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedCourse(code)}
                  style={{
                    padding: '8px 20px', borderRadius: 10,
                    border: active ? `1px solid ${c.accent}55` : '1px solid rgba(255,255,255,0.08)',
                    background: active ? `linear-gradient(135deg, ${c.accent}22, ${c.accent}12)` : 'rgba(255,255,255,0.04)',
                    color: active ? c.accent : 'rgba(255,255,255,0.38)',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: '0.04em',
                    boxShadow: active ? `0 4px 20px ${c.accentGlow}` : 'none',
                    transition: 'all 0.22s ease',
                  }}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>

        {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px',
              borderRadius: 10, border: `1px solid ${cfg.accent}40`, background: `${cfg.accent}14`,
              color: cfg.accent, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em',
            }}
          >
            <Maximize2 size={14} /> Full Screen
          </button>
        )}
      </div>

      {/* ── Center content ───────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 20px',
            borderRadius: 100, background: `${cfg.accent}16`, border: `1px solid ${cfg.accent}38`,
            backdropFilter: 'blur(10px)', boxShadow: `0 0 28px ${cfg.accentGlow}`, marginBottom: 22,
          }}
        >
          <Sparkles size={14} color={cfg.accent} />
          <span style={{ color: cfg.accent, fontWeight: 800, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            Stay Tuned
          </span>
        </div>

        {/* Course name */}
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(15px,1.7vw,22px)', fontWeight: 500, margin: '0 0 8px' }}>
          {cfg.name}
        </p>

        {/* Big countdown — fades out as the swarm assembles the code */}
        {targetTs != null && (
          <div style={{ opacity: countdownOpacity, transition: 'opacity 0.4s ease', height: 'clamp(80px,12vw,150px)' }}>
            <span
              style={{
                fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
                fontSize: 'clamp(72px,12vw,150px)', fontWeight: 800, color: '#fff',
                letterSpacing: '0.02em', lineHeight: 1, textShadow: `0 0 60px ${cfg.accentGlow}`,
              }}
            >
              {mm}:{ss}
            </span>
          </div>
        )}

        {targetTs == null && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(14px,1.4vw,18px)', margin: '20px 0 0', maxWidth: 520 }}>
            Pick a start time below — the ideas will swarm together to reveal{' '}
            <span style={{ color: cfg.accent, fontWeight: 700 }}>{selectedCourse}</span> when class begins.
          </p>
        )}

        {/* "Class is starting" caption during burst/hold */}
        <p
          style={{
            color: cfg.accentLight, fontSize: 'clamp(20px,2.6vw,38px)', fontWeight: 800,
            letterSpacing: '-0.02em', margin: 'clamp(20px,4vh,48px) 0 0',
            textShadow: `0 0 40px ${cfg.accentGlow}`,
            opacity: startingVisible ? 1 : 0, transition: 'opacity 0.5s ease',
          }}
        >
          Class is starting — let’s begin
        </p>
      </div>

      {/* ── Bottom bar: presets + clock + branding ───────────────── */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
          padding: '20px 28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          background: 'linear-gradient(to top, rgba(4,1,14,0.92) 0%, transparent 100%)',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'opacity 0.55s ease, transform 0.55s ease',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        {/* Clock / date */}
        <div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, fontWeight: 700, margin: 0, fontFamily: "'SF Mono', monospace" }}>
            {clock}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 500, margin: '3px 0 0' }}>
            {dateStr}
          </p>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={p.fn}
              style={{
                padding: '9px 16px', borderRadius: 10, border: `1px solid ${cfg.accent}35`,
                background: `${cfg.accent}12`, color: cfg.accentLight, fontSize: 12.5, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {p.label}
            </button>
          ))}
          {targetTs != null && (
            <button
              onClick={() => setTargetTs(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.5)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}
        </div>

        {/* Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 700, margin: 0 }}>
              Yasas Sri Wickramasinghe
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10.5, fontWeight: 600, margin: '2px 0 0', letterSpacing: '0.06em' }}>
              POWERED BY YOOBEES
            </p>
          </div>
          <div
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(124,58,237,0.45)', flexShrink: 0,
            }}
          >
            <BrandMark className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, zIndex: 50,
          background: `linear-gradient(90deg, transparent, ${cfg.accent}70 25%, ${cfg.accentLight}90 50%, ${cfg.accent}70 75%, transparent)`,
          backgroundSize: '200% 100%', animation: 'shimmer 5s linear infinite',
        }}
      />
    </div>
  );
}
