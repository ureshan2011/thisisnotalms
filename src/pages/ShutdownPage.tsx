import { useEffect, useRef } from 'react';

export default function ShutdownPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; r: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.05,
      });
    }

    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`;
        ctx.fill();
        p.y += p.speed;
        if (p.y > canvas.height) {
          p.y = -4;
          p.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1526 40%, #0a0e1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '620px',
          width: '90%',
          background: 'rgba(15, 20, 40, 0.85)',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: '20px',
          padding: '56px 48px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          boxShadow:
            '0 0 0 1px rgba(99,102,241,0.08), 0 32px 64px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ marginBottom: '28px' }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: '0 auto', display: 'block', opacity: 0.7 }}
          >
            <circle cx="32" cy="32" r="30" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
            <rect x="8" y="27" width="18" height="10" rx="5" stroke="#6366f1" strokeWidth="2" fill="none" />
            <rect x="38" y="27" width="18" height="10" rx="5" stroke="#6366f1" strokeWidth="2" fill="none" />
            <line x1="26" y1="30" x2="29" y2="26" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            <line x1="35" y1="38" x2="38" y2="34" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#e2e8f0',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          Platform Notice
        </h1>

        <div
          style={{
            width: '48px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
            margin: '0 auto 28px',
            borderRadius: '2px',
          }}
        />

        <p
          style={{
            fontSize: '1rem',
            lineHeight: '1.8',
            color: '#94a3b8',
            marginBottom: '0',
          }}
        >
          Please note that as per instructions from senior faculty, we will be consolidating our course tools and using{' '}
          <span style={{ color: '#a5b4fc', fontWeight: 500 }}>Blackboard</span>{' '}
          as the sole platform going forward. As a result, the{' '}
          <span style={{ color: '#a5b4fc', fontWeight: 500 }}>YooBees</span>{' '}
          platform will no longer be in use.
        </p>

        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: '1.8',
            color: '#64748b',
            marginTop: '20px',
          }}
        >
          I apologise for any inconvenience this may cause and appreciate your understanding.
        </p>

        <div
          style={{
            marginTop: '36px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(99,102,241,0.1)',
            fontSize: '0.8rem',
            color: '#334155',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          YooBees &nbsp;·&nbsp; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
