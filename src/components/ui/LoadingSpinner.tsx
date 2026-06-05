import { useState, useEffect } from 'react';
import { QUOTE_ITEMS, FADE_MS, HOLD_MS } from '../../lib/quotes';
import BrandLogo from './BrandLogo';

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';
  return (
    <div
      className={`animate-spin rounded-full flex-shrink-0 ${dims}`}
      style={{
        border: '2px solid rgba(139, 92, 246, 0.15)',
        borderTopColor: '#7c3aed',
      }}
    />
  );
}

export function FullPageSpinner() {
  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);

  // Cycle through quotes; 5-second hold gives students time to read each one
  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % QUOTE_ITEMS.length);
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS);
    return () => clearInterval(timer);
  }, []);

  // Prefetch high-traffic page chunks in the background while the screen shows
  useEffect(() => {
    const t = setTimeout(() => {
      import('../../pages/student/StudentDashboard').catch(() => {});
      import('../../pages/student/StudentProfile').catch(() => {});
      import('../../pages/lecturer/Dashboard').catch(() => {});
      import('../../pages/auth/Login').catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const item = QUOTE_ITEMS[index];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f4ff 0%, #ede9fe 50%, #f0f4ff 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-8%', right: '-4%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-8%', left: '-4%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.11) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Brand */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
        <BrandLogo iconSize={36} variant="on-light" />
      </div>

      {/* Quote / Reminder card */}
      <div style={{
        maxWidth: 680, width: '100%', textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
        minHeight: 200,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {item.type === 'quote' ? (
          <div style={{ fontSize: '5rem', lineHeight: 1, color: 'rgba(139,92,246,0.18)', fontFamily: 'Georgia, serif', marginBottom: '-0.75rem', userSelect: 'none' }}>
            &ldquo;
          </div>
        ) : (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.22)',
            borderRadius: 100, padding: '0.35rem 1rem', marginBottom: '1.25rem',
            fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            ★&nbsp; Important Reminder
          </div>
        )}

        <p style={{
          fontSize: item.text.length > 120 ? '1.2rem' : '1.45rem',
          fontWeight: item.type === 'reminder' ? 600 : 500,
          lineHeight: 1.65, color: '#1e1b4b',
          marginBottom: '1.5rem',
          fontStyle: item.type === 'quote' ? 'italic' : 'normal',
        }}>
          {item.text}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#7c3aed' }}>
            — {item.author}
          </span>
          {item.label && (
            <span style={{ fontSize: '0.78rem', color: '#a78bfa', fontWeight: 500 }}>
              {item.label}
            </span>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginTop: '2.5rem', alignItems: 'center' }}>
        {QUOTE_ITEMS.map((_, i) => (
          <div key={i} style={{
            width: i === index ? 20 : 6, height: 6, borderRadius: 3,
            background: i === index ? '#7c3aed' : 'rgba(139,92,246,0.22)',
            transition: 'width 0.3s ease, background 0.3s ease',
          }} />
        ))}
      </div>

      {/* Spinner */}
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div
          className="animate-spin"
          style={{
            width: 38, height: 38, borderRadius: '50%',
            border: '3px solid rgba(139, 92, 246, 0.12)',
            borderTopColor: '#7c3aed',
          }}
        />
        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#a78bfa' }}>Loading&hellip;</p>
      </div>
    </div>
  );
}
