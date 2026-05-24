import { useEffect, useState } from 'react';
import { Swords, Trophy, Zap, Star, Brain, Target, X, ChevronRight } from 'lucide-react';

interface GameIntroPopupProps {
  onClose: () => void;
}

const features = [
  {
    icon: <Brain size={22} />,
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.12)',
    border: 'rgba(124,58,237,0.25)',
    title: 'Daily Brain Duel',
    desc: 'Every day a fresh challenge drops — ER diagrams, SQL traps, and database puzzles. Answer fast, answer right, and climb the leaderboard.',
  },
  {
    icon: <Swords size={22} />,
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.12)',
    border: 'rgba(14,165,233,0.25)',
    title: 'Live Arena Battles',
    desc: 'Challenge classmates to real-time 1-vs-1 duels. Five rapid-fire rounds. The fastest correct answers win — and your ELO rating rises with every victory.',
  },
  {
    icon: <Trophy size={22} />,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    title: 'ELO Rankings & Tiers',
    desc: 'Earn your way from Bronze Bee to Queen Bee. Weekly leaderboards reset every Monday — the grind never stops.',
  },
  {
    icon: <Zap size={22} />,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.25)',
    title: 'Streaks & Rewards',
    desc: 'Answer the daily challenge 7 days in a row and earn the Crown. Keep your streak alive for bonus points and Hall of Bees glory.',
  },
];

export default function GameIntroPopup({ onClose }: GameIntroPopupProps) {
  const [visible, setVisible]   = useState(false);
  const [closing, setClosing]   = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  // Cycle feature cards
  useEffect(() => {
    const t = setInterval(() => setActiveIdx(i => (i + 1) % features.length), 3000);
    return () => clearInterval(t);
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 380);
  }

  return (
    <>
      <style>{`
        @keyframes gi-fade-in   { from { opacity:0 } to { opacity:1 } }
        @keyframes gi-fade-out  { from { opacity:1 } to { opacity:0 } }
        @keyframes gi-scale-in  { from { opacity:0; transform:scale(0.86) translateY(24px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes gi-scale-out { from { opacity:1; transform:scale(1)    translateY(0)    } to { opacity:0; transform:scale(0.90) translateY(18px) } }
        @keyframes gi-float     { 0%,100% { transform:translateY(0px) } 50% { transform:translateY(-14px) } }
        @keyframes gi-pulse-ring { 0% { transform:scale(1); opacity:0.6 } 100% { transform:scale(2.2); opacity:0 } }
        @keyframes gi-shimmer   { 0% { background-position:-200% center } 100% { background-position:200% center } }
        @keyframes gi-star-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        @keyframes gi-particle  {
          0%   { transform:translate(0,0) scale(1);   opacity:1 }
          100% { transform:translate(var(--px),var(--py)) scale(0); opacity:0 }
        }
        .gi-card-enter  { animation: gi-scale-in  0.32s cubic-bezier(.34,1.56,.64,1) forwards }
        .gi-card-exit   { animation: gi-scale-out 0.22s ease-in forwards }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(10,6,40,0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          animation: closing ? 'gi-fade-out 0.38s ease forwards' : visible ? 'gi-fade-in 0.4s ease forwards' : 'none',
          opacity: visible ? undefined : 0,
        }}
      />

      {/* Floating orbs behind panel */}
      {!closing && visible && (
        <>
          {[
            { size: 320, top: '5%',  left: '-8%',  color: 'rgba(124,58,237,0.18)',  delay: '0s' },
            { size: 260, top: '55%', left: '80%',  color: 'rgba(14,165,233,0.15)',  delay: '1.2s' },
            { size: 200, top: '75%', left: '10%',  color: 'rgba(245,158,11,0.12)',  delay: '0.6s' },
            { size: 180, top: '15%', left: '70%',  color: 'rgba(16,185,129,0.10)',  delay: '1.8s' },
          ].map((orb, i) => (
            <div
              key={i}
              style={{
                position: 'fixed',
                zIndex: 9001,
                width: orb.size,
                height: orb.size,
                top: orb.top,
                left: orb.left,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                animation: `gi-float ${4 + i}s ease-in-out ${orb.delay} infinite`,
                pointerEvents: 'none',
              }}
            />
          ))}
        </>
      )}

      {/* Main panel */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9010,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 560,
            borderRadius: 28,
            overflow: 'hidden',
            pointerEvents: 'auto',
            background: 'linear-gradient(160deg, rgba(18,10,60,0.98) 0%, rgba(30,10,70,0.98) 50%, rgba(10,30,60,0.98) 100%)',
            border: '1px solid rgba(139,92,246,0.35)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.25)',
            animation: closing
              ? 'gi-scale-out 0.38s cubic-bezier(.4,0,.6,1) forwards'
              : visible
              ? 'gi-scale-in 0.45s cubic-bezier(.34,1.56,.64,1) forwards'
              : 'none',
            opacity: visible ? undefined : 0,
          }}
        >
          {/* Animated gradient top border */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #7c3aed, #0ea5e9, #10b981, #f59e0b, #7c3aed)',
            backgroundSize: '300% 100%',
            animation: 'gi-shimmer 3s linear infinite',
          }} />

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 10,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '6px',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <X size={16} />
          </button>

          <div style={{ padding: '36px 32px 32px' }}>

            {/* Hero section */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              {/* Animated icon cluster */}
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {/* Pulse rings */}
                {[1, 2].map(n => (
                  <div key={n} style={{
                    position: 'absolute',
                    width: 80, height: 80,
                    borderRadius: '50%',
                    border: '2px solid rgba(124,58,237,0.4)',
                    animation: `gi-pulse-ring 2.5s ease-out ${n * 0.8}s infinite`,
                  }} />
                ))}
                {/* Main icon circle */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(14,165,233,0.2))',
                  border: '2px solid rgba(139,92,246,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'gi-float 4s ease-in-out infinite',
                  boxShadow: '0 0 40px rgba(124,58,237,0.4)',
                }}>
                  <Swords size={30} color="#a78bfa" />
                </div>
                {/* Orbiting stars */}
                {[
                  { angle: 0,   delay: '0s',    size: 14, color: '#f59e0b' },
                  { angle: 120, delay: '0.33s', size: 12, color: '#10b981' },
                  { angle: 240, delay: '0.66s', size: 10, color: '#0ea5e9' },
                ].map((star, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      animation: `gi-star-spin ${6 + i}s linear ${star.delay} infinite`,
                      width: 80, height: 80,
                      borderRadius: '50%',
                    }}
                  >
                    <Star
                      size={star.size}
                      fill={star.color}
                      color={star.color}
                      style={{
                        position: 'absolute',
                        top: -star.size / 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        filter: `drop-shadow(0 0 6px ${star.color})`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(124,58,237,0.18)',
                border: '1px solid rgba(139,92,246,0.35)',
                borderRadius: 20,
                padding: '4px 14px',
                marginBottom: 14,
              }}>
                <Target size={11} color="#a78bfa" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  New for MBI802
                </span>
              </div>

              <h2 style={{
                fontSize: 26,
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #e0d7ff 0%, #a78bfa 40%, #60a5fa 80%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: '0 0 10px',
              }}>
                The Games Have Begun
              </h2>

              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', lineHeight: 1.6, maxWidth: 400, margin: '0 auto' }}>
                YooBees now has live game challenges built into MBI802. Test your knowledge, battle your classmates, and rise through the ranks.
              </p>
            </div>

            {/* Feature cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {features.map((f, i) => {
                const isActive = i === activeIdx;
                return (
                  <div
                    key={f.title}
                    onClick={() => setActiveIdx(i)}
                    style={{
                      borderRadius: 16,
                      padding: '14px 14px 12px',
                      background: isActive ? f.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? f.border : 'rgba(255,255,255,0.07)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isActive ? `0 8px 24px ${f.bg}` : 'none',
                    }}
                  >
                    <div style={{
                      width: 38, height: 38,
                      borderRadius: 10,
                      background: isActive ? f.bg : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${isActive ? f.border : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 10,
                      color: isActive ? f.color : 'rgba(255,255,255,0.35)',
                      transition: 'all 0.3s',
                    }}>
                      {f.icon}
                    </div>
                    <p style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                      marginBottom: 5,
                      transition: 'color 0.3s',
                    }}>
                      {f.title}
                    </p>
                    <p style={{
                      fontSize: 11,
                      color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.25)',
                      lineHeight: 1.5,
                      transition: 'color 0.3s',
                    }}>
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    width: i === activeIdx ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === activeIdx ? '#7c3aed' : 'rgba(255,255,255,0.18)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
                  }}
                />
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: 16,
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)',
                backgroundSize: '200% 100%',
                animation: 'gi-shimmer 3s linear infinite',
                color: '#fff',
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 32px rgba(124,58,237,0.5), 0 2px 8px rgba(0,0,0,0.3)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(124,58,237,0.65), 0 4px 12px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(124,58,237,0.5), 0 2px 8px rgba(0,0,0,0.3)';
              }}
            >
              <Swords size={18} />
              Let's Play — I'm Ready!
              <ChevronRight size={18} />
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 14 }}>
              You won't see this again — find the games in the sidebar anytime
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
