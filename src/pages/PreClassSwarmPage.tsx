import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Maximize2, RotateCcw } from 'lucide-react';
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

// Apple system font stack.
const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

// Optional ambient background video (direct .mp4/.webm URL). When empty, the
// page falls back to an animated Apple-style gradient mesh (never breaks).
const BG_VIDEO_URL = '';

// High-contrast word palettes per course — bright tints that pop against the
// darkened video / gradient backdrop.
const COURSE_PALETTES: Record<CourseCode, string[]> = {
  MBI800: ['#ffffff', '#fde68a', '#fbbf24', '#fcd34d', '#fef3c7'],
  MBI802: ['#ffffff', '#ddd6fe', '#c4b5fd', '#a78bfa', '#e9d5ff'],
  MBI804: ['#ffffff', '#bae6fd', '#7dd3fc', '#38bdf8', '#e0f2fe'],
};

// ─── Apple-style animated gradient mesh background ────────────────
function GradientMesh({ cfg }: { cfg: typeof COURSES[CourseCode] }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#06070c' }}>
      {[
        { c: cfg.accent, s: 760, top: '-22%', left: '-12%', dur: 17 },
        { c: cfg.accentLight, s: 560, bottom: '-20%', right: '-8%', dur: 21, delay: 1.5 },
        { c: '#0a84ff', s: 520, top: '32%', left: '46%', dur: 15, delay: 0.8 },
        { c: cfg.accent, s: 360, bottom: '12%', left: '24%', dur: 13, delay: 2.2 },
      ].map((o, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: o.s, height: o.s, borderRadius: '50%',
            top: o.top, bottom: o.bottom, left: o.left, right: o.right,
            background: `radial-gradient(circle, ${o.c}55 0%, transparent 70%)`,
            filter: 'blur(80px)',
            animation: `float ${o.dur}s ease-in-out ${o.delay ?? 0}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Password gate ────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const accent = '#0a84ff';

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
        position: 'fixed', inset: 0, zIndex: 9999, background: '#06070c',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: APPLE_FONT,
      }}
    >
      <form
        onSubmit={submit}
        className={error ? 'preclass-shake' : ''}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
          padding: '46px 50px', borderRadius: 28,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        <div
          style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Lock size={26} color="#fff" strokeWidth={1.6} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#fff', fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
            Pre-Class Display
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '7px 0 0', fontWeight: 400 }}>
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
            width: 280, padding: '13px 16px', borderRadius: 14,
            background: 'rgba(255,255,255,0.08)',
            border: `1px solid ${error ? '#ff453a' : 'rgba(255,255,255,0.16)'}`,
            color: '#fff', fontSize: 16, fontWeight: 500, outline: 'none',
            textAlign: 'center', letterSpacing: '0.12em', fontFamily: APPLE_FONT,
          }}
        />
        <button
          type="submit"
          style={{
            width: 280, padding: '13px 16px', borderRadius: 980,
            background: accent, border: 'none', color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: APPLE_FONT,
          }}
        >
          Continue
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

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

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

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  }, []);

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

  const countdownOpacity =
    phase === 'drift' ? 1 : phase === 'gather' ? Math.max(0, 1 - gatherProgress * 1.4) : 0;
  const startingVisible = phase === 'burst' || phase === 'hold';

  const d = new Date(now);
  const h = d.getHours();
  const clock = `${pad2(h % 12 === 0 ? 12 : h % 12)}:${pad2(d.getMinutes())} ${h >= 12 ? 'PM' : 'AM'}`;
  const dateStr = d.toLocaleDateString('en-NZ', {
    weekday: 'long', month: 'long', day: 'numeric',
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

  // shared Apple "frosted" surface
  const frost: React.CSSProperties = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)',
    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={isFullscreen ? resetHideTimer : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden',
        background: '#06070c', fontFamily: APPLE_FONT,
        WebkitFontSmoothing: 'antialiased', color: '#f5f5f7',
      }}
    >
      {/* ── Background: gradient mesh + optional video ─────────────── */}
      <GradientMesh cfg={cfg} />
      {BG_VIDEO_URL && (
        <video
          autoPlay muted loop playsInline
          src={BG_VIDEO_URL}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.55,
          }}
        />
      )}
      {/* Legibility scrim so words/text always read */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 120% 90% at 50% 45%, rgba(6,7,12,0.30) 0%, rgba(6,7,12,0.72) 100%)',
        }}
      />

      {/* Particle swarm */}
      <SwarmCanvas
        words={getConcepts(selectedCourse)}
        palette={COURSE_PALETTES[selectedCourse]}
        accent={cfg.accent}
        targetText={selectedCourse}
        phase={phase}
        gatherProgress={gatherProgress}
        reducedMotion={reducedMotion}
      />

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              ...frost, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 980, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: APPLE_FONT,
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} /> Home
          </button>

          {/* Segmented course control */}
          <div style={{ ...frost, display: 'flex', gap: 4, padding: 4, borderRadius: 980 }}>
            {COURSE_CODES.map((code) => {
              const active = selectedCourse === code;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedCourse(code)}
                  style={{
                    padding: '7px 18px', borderRadius: 980, border: 'none',
                    background: active ? '#fff' : 'transparent',
                    color: active ? '#1d1d1f' : 'rgba(255,255,255,0.6)',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer', letterSpacing: '0.01em',
                    transition: 'all 0.25s ease', fontFamily: APPLE_FONT,
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
              ...frost, display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
              borderRadius: 980, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: APPLE_FONT,
            }}
          >
            <Maximize2 size={14} strokeWidth={2} /> Full Screen
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
        <p
          style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(12px,1.1vw,15px)', fontWeight: 600,
            letterSpacing: '0.24em', textTransform: 'uppercase', margin: '0 0 14px',
          }}
        >
          Class starts soon
        </p>

        <p
          style={{
            color: '#f5f5f7', fontSize: 'clamp(20px,2.4vw,34px)', fontWeight: 600,
            letterSpacing: '-0.02em', margin: '0 0 6px',
          }}
        >
          {cfg.name}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(13px,1.2vw,17px)', fontWeight: 400, margin: 0 }}>
          {selectedCourse}
        </p>

        {targetTs != null && (
          <div style={{ opacity: countdownOpacity, transition: 'opacity 0.4s ease', marginTop: 'clamp(16px,3vh,32px)', height: 'clamp(86px,13vw,168px)' }}>
            <span
              style={{
                fontFamily: APPLE_FONT,
                fontSize: 'clamp(80px,13vw,168px)', fontWeight: 600, color: '#fff',
                letterSpacing: '-0.04em', lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 2px 40px rgba(0,0,0,0.4)',
              }}
            >
              {mm}:{ss}
            </span>
          </div>
        )}

        {targetTs == null && (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(14px,1.3vw,18px)', margin: '28px 0 0', maxWidth: 540, lineHeight: 1.5, fontWeight: 400 }}>
            Pick a start time below. The ideas will swarm together to reveal{' '}
            <span style={{ color: '#fff', fontWeight: 600 }}>{selectedCourse}</span> as class begins.
          </p>
        )}

        <p
          style={{
            color: '#fff', fontSize: 'clamp(22px,2.8vw,40px)', fontWeight: 600,
            letterSpacing: '-0.02em', margin: 'clamp(20px,4vh,48px) 0 0',
            opacity: startingVisible ? 1 : 0, transition: 'opacity 0.5s ease',
            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
          }}
        >
          Class is starting — let’s begin
        </p>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
          padding: '22px 28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16,
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        {/* Clock */}
        <div style={{ minWidth: 120 }}>
          <p style={{ color: '#f5f5f7', fontSize: 19, fontWeight: 600, margin: 0, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
            {clock}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 400, margin: '3px 0 0' }}>
            {dateStr}
          </p>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={p.fn}
              style={{
                ...frost, padding: '9px 18px', borderRadius: 980, color: '#fff',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: APPLE_FONT,
              }}
            >
              {p.label}
            </button>
          ))}
          {targetTs != null && (
            <button
              onClick={() => setTargetTs(null)}
              style={{
                ...frost, display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 980,
                color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: APPLE_FONT,
              }}
            >
              <RotateCcw size={13} strokeWidth={2} /> Reset
            </button>
          )}
        </div>

        {/* Not a LMS branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 120, justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#f5f5f7', fontSize: 14, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>
              Yasas Sri Wickramasinghe
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, margin: '2px 0 0' }}>
              Not a <span style={{ color: '#0a84ff' }}>LMS</span>
            </p>
          </div>
          <BrandMark className="h-8 w-8 rounded-[9px]" />
        </div>
      </div>
    </div>
  );
}
