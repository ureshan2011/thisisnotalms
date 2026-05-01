import { useState, useEffect } from 'react';

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

// ─── Rotating content shown during the full-page auth / route load ───────────

type ItemType = 'quote' | 'reminder';

interface Item {
  text: string;
  author: string;
  label: string;
  type: ItemType;
}

const ITEMS: Item[] = [
  {
    text: 'Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.',
    author: 'Steve Jobs',
    label: 'Apple Co-Founder',
    type: 'quote',
  },
  {
    text: 'Never share your assessment answer scripts via email or Microsoft Teams — your academic integrity defines your professional future.',
    author: 'A reminder from your faculty',
    label: '',
    type: 'reminder',
  },
  {
    text: 'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.',
    author: 'Albert Einstein',
    label: 'Theoretical Physicist',
    type: 'quote',
  },
  {
    text: 'You are a postgraduate student. Your thesis will be read, cited, and remembered for years — make it something you are genuinely proud of.',
    author: 'A reminder from your faculty',
    label: '',
    type: 'reminder',
  },
  {
    text: 'You should hope to do something in your life that is hard. Things that are easy are not worth doing.',
    author: 'Jensen Huang',
    label: 'CEO, NVIDIA',
    type: 'quote',
  },
  {
    text: 'Logical reasoning is a skill built through practice and discipline — it cannot be outsourced to AI. It must be developed by you.',
    author: 'A reminder from your faculty',
    label: '',
    type: 'reminder',
  },
  {
    text: 'In the middle of every difficulty lies opportunity.',
    author: 'Albert Einstein',
    label: 'Theoretical Physicist',
    type: 'quote',
  },
  {
    text: 'Stay hungry, stay foolish.',
    author: 'Steve Jobs',
    label: 'Apple Co-Founder',
    type: 'quote',
  },
  {
    text: 'Do things others say cannot be done. The future belongs to those who refuse to accept limits.',
    author: 'Jensen Huang',
    label: 'CEO, NVIDIA',
    type: 'quote',
  },
  {
    text: 'The measure of intelligence is the ability to change.',
    author: 'Albert Einstein',
    label: 'Theoretical Physicist',
    type: 'quote',
  },
];

const FADE_MS = 400;
const HOLD_MS = 5000;

export function FullPageSpinner() {
  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % ITEMS.length);
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS);
    return () => clearInterval(timer);
  }, []);

  const item = ITEMS[index];

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
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{
          fontSize: '2rem', fontWeight: 800,
          background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', letterSpacing: '-0.02em',
        }}>YooBees</div>
        <p style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: '#a78bfa', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Smart Student Platform
        </p>
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
        {ITEMS.map((_, i) => (
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
