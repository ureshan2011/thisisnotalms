import { useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function SQLProgrammingDeck() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: '#0f1117',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1.5px solid rgba(74,142,245,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}
    >
      {/* toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F87171' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FBBF24' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#34D399' }} />
          <span
            style={{
              marginLeft: 10,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.06em',
            }}
          >
            MBI802 · SQL Deck · 14 slides · ← → to navigate
          </span>
        </div>
        <button
          onClick={() => setExpanded(prev => !prev)}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: 'none',
            borderRadius: 6,
            padding: '4px 8px',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
          }}
          title={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* slide iframe — 16:9 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: expanded ? '75%' : '56.25%',
          transition: 'padding-bottom 0.3s ease',
        }}
      >
        <iframe
          ref={iframeRef}
          src="/sql-deck.html"
          title="MBI802 SQL Programming Slides"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
