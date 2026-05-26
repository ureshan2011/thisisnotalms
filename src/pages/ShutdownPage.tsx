import { useEffect, useRef } from 'react';

export default function ShutdownPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type P = { x: number; y: number; r: number; vy: number; vx: number; o: number };
    const pts: P[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vy: Math.random() * 0.18 + 0.04,
      vx: (Math.random() - 0.5) * 0.08,
      o: Math.random() * 0.14 + 0.02,
    }));

    let id: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,185,220,${p.o})`;
        ctx.fill();
        p.y += p.vy;
        p.x += p.vx;
        if (p.y > canvas.height + 4) { p.y = -4; p.x = Math.random() * canvas.width; }
        if (p.x < -4 || p.x > canvas.width + 4) p.x = Math.random() * canvas.width;
      });
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #06080f 0%, #080b18 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '32px 16px 40px',
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* ── Desk illustration ── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '700px' }}>
        <svg
          viewBox="0 0 700 360"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#08091a" />
              <stop offset="100%" stopColor="#0c1028" />
            </linearGradient>
            <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#52391a" />
              <stop offset="100%" stopColor="#3e2a0f" />
            </linearGradient>
            <linearGradient id="lampPole" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#252528" />
              <stop offset="100%" stopColor="#2e2e33" />
            </linearGradient>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c6d2e4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#c6d2e4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── Wall ── */}
          <rect width="700" height="252" fill="url(#wall)" />

          {/* ── Floor ── */}
          <rect y="252" width="700" height="108" fill="#060810" />

          {/* ── Window (back-left wall) ── */}
          {/* Outer recess shadow */}
          <rect x="58" y="20" width="202" height="188" rx="5" fill="#0a0c1e" stroke="#13162e" strokeWidth="10" />
          {/* Glass – night sky */}
          <rect x="70" y="30" width="82" height="82" rx="1" fill="#05070f" />
          <rect x="158" y="30" width="94" height="82" rx="1" fill="#05070f" />
          <rect x="70" y="118" width="82" height="82" rx="1" fill="#05070f" />
          <rect x="158" y="118" width="94" height="82" rx="1" fill="#05070f" />
          {/* Cross frame */}
          <rect x="150" y="30" width="10" height="170" fill="#13162e" />
          <rect x="70" y="110" width="182" height="9" fill="#13162e" />
          {/* Outer frame */}
          <rect x="70" y="30" width="182" height="170" fill="none" stroke="#13162e" strokeWidth="8" />

          {/* Moon (crescent) in top-right pane */}
          <circle cx="218" cy="74" r="28" fill="#c6d2e4" opacity="0.88" />
          {/* Overlay to carve crescent */}
          <circle cx="228" cy="69" r="23" fill="#05070f" />
          {/* Soft moon-glow halo */}
          <circle cx="218" cy="74" r="46" fill="url(#moonGlow)" />

          {/* Stars – top-left pane */}
          <circle cx="82" cy="44" r="1.1" fill="#a0b8d8" opacity="0.7" />
          <circle cx="108" cy="37" r="0.8" fill="#a0b8d8" opacity="0.55" />
          <circle cx="132" cy="56" r="1.0" fill="#a0b8d8" opacity="0.6" />
          <circle cx="96" cy="72" r="0.7" fill="#a0b8d8" opacity="0.4" />
          <circle cx="145" cy="48" r="0.8" fill="#a0b8d8" opacity="0.45" />
          {/* Stars – top-right pane (fewer, moon dominates) */}
          <circle cx="172" cy="40" r="0.7" fill="#a0b8d8" opacity="0.4" />
          <circle cx="246" cy="36" r="0.9" fill="#a0b8d8" opacity="0.5" />
          {/* Stars – bottom panes */}
          <circle cx="85" cy="130" r="0.9" fill="#a0b8d8" opacity="0.3" />
          <circle cx="130" cy="158" r="0.7" fill="#a0b8d8" opacity="0.28" />
          <circle cx="180" cy="138" r="0.8" fill="#a0b8d8" opacity="0.32" />
          <circle cx="228" cy="155" r="0.6" fill="#a0b8d8" opacity="0.24" />
          <circle cx="244" cy="125" r="1.0" fill="#a0b8d8" opacity="0.3" />

          {/* Moonlight wash on wall (subtle) */}
          <ellipse cx="260" cy="200" rx="140" ry="90" fill="#c6d2e4" opacity="0.018" />

          {/* ── Desk front panel (draw before surface so surface caps it) ── */}
          <rect x="26" y="254" width="648" height="80" rx="2" fill="#2b1b08" />
          {/* Subtle wood grain lines */}
          <line x1="80" y1="254" x2="80" y2="334" stroke="#241609" strokeWidth="1" opacity="0.5" />
          <line x1="200" y1="254" x2="200" y2="334" stroke="#241609" strokeWidth="1" opacity="0.4" />
          <line x1="380" y1="254" x2="380" y2="334" stroke="#241609" strokeWidth="1" opacity="0.3" />
          <line x1="540" y1="254" x2="540" y2="334" stroke="#241609" strokeWidth="1" opacity="0.4" />
          {/* Desk legs */}
          <rect x="46" y="316" width="26" height="26" rx="3" fill="#201308" />
          <rect x="628" y="316" width="26" height="26" rx="3" fill="#201308" />

          {/* ── Desk surface top ── */}
          <rect x="18" y="238" width="664" height="18" rx="3" fill="url(#wood)" />
          {/* Surface top-edge highlight */}
          <rect x="18" y="238" width="664" height="3" rx="2" fill="#7a5828" opacity="0.35" />

          {/* ── Books (left of desk) ── */}
          {/* Book 1 – bottom, largest */}
          <rect x="60" y="213" width="84" height="27" rx="2" fill="#1c3b5a" />
          <rect x="60" y="213" width="84" height="5" rx="2" fill="#2a527a" opacity="0.75" />
          <rect x="60" y="235" width="84" height="4" rx="1" fill="#142840" opacity="0.7" />
          <rect x="66" y="218" width="4" height="12" fill="#17304e" opacity="0.6" />
          {/* Book 2 – middle */}
          <rect x="63" y="194" width="76" height="21" rx="2" fill="#3a1d54" />
          <rect x="63" y="194" width="76" height="4" rx="2" fill="#502870" opacity="0.7" />
          <rect x="63" y="211" width="76" height="3" rx="1" fill="#281440" opacity="0.7" />
          {/* Book 3 – top, smallest */}
          <rect x="66" y="180" width="65" height="16" rx="2" fill="#1d4a38" />
          <rect x="66" y="180" width="65" height="3" rx="2" fill="#286050" opacity="0.75" />

          {/* ── Laptop keyboard/base ── */}
          <rect x="218" y="227" width="256" height="14" rx="4" fill="#1e1e24" />
          <rect x="224" y="230" width="244" height="8" rx="3" fill="#17171c" />
          {/* Trackpad */}
          <rect x="316" y="231" width="82" height="5" rx="2" fill="#131318" opacity="0.8" />
          {/* Hinge bar */}
          <rect x="227" y="224" width="238" height="5" rx="2" fill="#141418" />

          {/* ── Empty coffee mug ── */}
          {/* Body */}
          <rect x="488" y="211" width="40" height="30" rx="4" fill="#1c1c22" />
          <rect x="493" y="216" width="30" height="22" rx="2" fill="#131318" />
          {/* Handle */}
          <path d="M528 216 Q544 216 544 226 Q544 237 528 237" stroke="#1c1c22" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Rim */}
          <ellipse cx="508" cy="211" rx="20" ry="5" fill="#222228" />
          {/* Mug bottom highlight */}
          <ellipse cx="508" cy="241" rx="17" ry="3" fill="#111116" />

          {/* ── Laptop screen (angled back, OFF) ── */}
          {/* Screen housing */}
          <polygon points="230,224 462,224 456,146 236,146" fill="#1c1c22" />
          {/* Bezels */}
          <polygon points="238,220 454,220 449,152 244,152" fill="#0a0a10" />
          {/* Dark glass (screen off) */}
          <polygon points="244,216 448,216 444,156 250,156" fill="#07070c" />
          {/* Faint crescent moon reflected in dark screen – emotional detail */}
          <ellipse cx="340" cy="188" rx="18" ry="13" fill="#c6d2e4" opacity="0.03" />
          <ellipse cx="345" cy="186" rx="14" ry="10" fill="#07070c" opacity="0.9" />
          {/* Subtle reflection streaks */}
          <line x1="258" y1="212" x2="280" y2="162" stroke="#0e1030" strokeWidth="2" opacity="0.25" />
          <line x1="295" y1="214" x2="318" y2="160" stroke="#0e1030" strokeWidth="1.5" opacity="0.12" />
          {/* Camera dot */}
          <circle cx="347" cy="150" r="2.5" fill="#111116" />

          {/* ── Table lamp (OFF) ── */}
          {/* Base plate */}
          <ellipse cx="592" cy="249" rx="42" ry="11" fill="#1c1c20" />
          <ellipse cx="592" cy="246" rx="33" ry="8" fill="#242428" />
          {/* Base column */}
          <rect x="582" y="232" width="18" height="18" rx="5" fill="#26262b" />
          {/* Vertical pole */}
          <rect x="586" y="148" width="9" height="87" rx="4" fill="url(#lampPole)" />
          {/* Elbow pivot */}
          <circle cx="590" cy="150" r="10" fill="#222226" />
          {/* Upper arm (diagonal toward right) */}
          <path d="M590,150 L630,100" stroke="#2c2c31" strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* Shade pivot */}
          <circle cx="630" cy="100" r="9" fill="#222226" />

          {/* Lamp shade (trapezoid downward, dark = OFF) */}
          <polygon points="602,100 658,100 676,144 584,144" fill="#222226" stroke="#2a2a2f" strokeWidth="1.5" />
          {/* Shade inner – near black, lamp is OFF */}
          <polygon points="607,103 653,103 669,141 592,141" fill="#0d0d10" />
          {/* Bulb socket ring */}
          <ellipse cx="630" cy="116" rx="11" ry="7" fill="#111114" />
          {/* Bulb – dark/off */}
          <ellipse cx="630" cy="112" rx="8" ry="6" fill="#131316" />
          {/* Power cord (drooping sad) */}
          <path d="M592,256 Q610,272 580,288" stroke="#1a1a1e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />

          {/* ── Drop shadows on desk surface ── */}
          <ellipse cx="104" cy="241" rx="44" ry="4" fill="#000" opacity="0.22" />
          <ellipse cx="340" cy="241" rx="125" ry="4" fill="#000" opacity="0.18" />
          <ellipse cx="508" cy="241" rx="22" ry="3" fill="#000" opacity="0.2" />
          <ellipse cx="592" cy="252" rx="40" ry="5" fill="#000" opacity="0.28" />
        </svg>
      </div>

      {/* ── Message card ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '600px',
        width: '90%',
        marginTop: '10px',
        background: 'rgba(8,10,22,0.78)',
        border: '1px solid rgba(80,95,140,0.18)',
        borderRadius: '18px',
        padding: '38px 44px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
      }}>
        {/* Divider accent */}
        <div style={{
          width: '44px',
          height: '2px',
          background: 'linear-gradient(90deg,transparent,#6366f1,transparent)',
          margin: '0 auto 26px',
          borderRadius: '2px',
        }} />

        <p style={{
          fontSize: '1rem',
          lineHeight: '1.88',
          color: '#8fa3c0',
          margin: 0,
        }}>
          Please note that as per instructions from senior faculty, we will be consolidating
          our course tools and using{' '}
          <span style={{ color: '#a5b4fc', fontWeight: 600 }}>Blackboard</span>{' '}
          as the sole platform going forward. As a result, the{' '}
          <span style={{ color: '#a5b4fc', fontWeight: 600 }}>YooBees</span>{' '}
          platform will no longer be in use.
        </p>

        <p style={{
          fontSize: '0.92rem',
          lineHeight: '1.8',
          color: '#4a5c78',
          marginTop: '18px',
          marginBottom: 0,
        }}>
          I apologise for any inconvenience this may cause and appreciate your understanding.
        </p>

        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(80,95,140,0.1)',
          fontSize: '0.73rem',
          color: '#252e42',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
        }}>
          YooBees &nbsp;·&nbsp; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
