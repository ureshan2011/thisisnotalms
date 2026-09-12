import { useState } from 'react';

// ─── The Iceberg Model, as the navigator ──────────────────────────────────
// Senge's four layers drawn to scale, with the waterline where it belongs,
// and the drawing itself is the control: click a layer and the panel beside
// it changes. A separate list of buttons next to a picture of the same four
// things would have made the student map one onto the other for no reason.
//
// The worked case is the CrowdStrike content update of 19 July 2024, chosen
// because the Events layer was reported everywhere and the three layers
// underneath it were reported almost nowhere.
//
// The leverage meter fills as you go down. That is the model's actual claim
// — learning and leverage both run downward — and it is easier to believe
// when you can watch it move.

import type { IcebergLayer } from './icebergCase';

// Geometry, top to bottom. Only the first sits above the waterline; the
// three below widen as they deepen, so the shape reads as an iceberg rather
// than a stack of boxes.
const BANDS = [
  { top: 90, halfTop: 52, halfBottom: 86 },
  { top: 174, halfTop: 88, halfBottom: 118 },
  { top: 258, halfTop: 120, halfBottom: 146 },
];
const BAND_H = 76;
const CX = 150;

export default function IcebergModel({ layers }: { layers: IcebergLayer[] }) {
  const [active, setActive] = useState(0);
  const layer = layers[active];
  const leverage = ((active + 1) / layers.length) * 100;

  // An SVG group behaving as a button: click, Enter and Space all select,
  // and it takes focus so the drawing is reachable from the keyboard.
  const hit = (i: number) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-pressed': active === i,
    'aria-label': `${layers[i].title} — ${layers[i].kicker}`,
    style: { cursor: 'pointer' },
    onClick: () => setActive(i),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); }
    },
  });

  return (
    <div className="bt-walk bt-walk--wide">
      <div>
        <svg viewBox="0 0 300 352" width="100%" style={{ display: 'block' }} aria-label="The Iceberg Model. Events sit above the waterline; patterns of behaviour, structures and mental models sit beneath it, widening as they deepen.">
          {/* The water. Kept in the page's own cream rather than a literal
              blue, which would be the only cool colour on the whole site. */}
          <rect x="0" y="80" width="300" height="272" fill="var(--paper-200)" opacity="0.55" />

          {/* Events — the visible tip */}
          <g {...hit(0)}>
            <path
              d={`M${CX} 12 L${CX + 50} 74 L${CX - 50} 74 Z`}
              fill={active === 0 ? 'var(--accent-500)' : 'var(--accent-100)'}
              stroke={active === 0 ? 'var(--accent-600)' : 'var(--accent-200)'}
              strokeWidth="1.5"
            />
            <text x={CX} y="56" textAnchor="middle" fontSize="12" fontWeight="700" fontFamily="var(--font-display)" fill={active === 0 ? '#fff' : 'var(--accent-700)'} style={{ pointerEvents: 'none' }}>
              {layers[0].title}
            </text>
          </g>

          {/* Waterline. It carries no label of its own: at this width any
              text beside it collides with the widest band, and the caption
              underneath says the same thing with room to breathe. */}
          <line x1="0" y1="80" x2="300" y2="80" stroke="var(--accent-400)" strokeWidth="1.5" strokeDasharray="5 5" />

          {/* The three submerged layers */}
          {BANDS.map((b, n) => {
            const i = n + 1;
            const on = active === i;
            return (
              <g key={layers[i].title} {...hit(i)}>
                <path
                  d={`M${CX - b.halfTop} ${b.top} L${CX + b.halfTop} ${b.top} L${CX + b.halfBottom} ${b.top + BAND_H} L${CX - b.halfBottom} ${b.top + BAND_H} Z`}
                  fill={on ? 'var(--accent-500)' : 'var(--accent-50)'}
                  stroke={on ? 'var(--accent-600)' : 'var(--accent-200)'}
                  strokeWidth="1.5"
                />
                <text x={CX} y={b.top + 34} textAnchor="middle" fontSize="12" fontWeight="700" fontFamily="var(--font-display)" fill={on ? '#fff' : 'var(--accent-700)'} style={{ pointerEvents: 'none' }}>
                  {layers[i].title}
                </text>
                <text x={CX} y={b.top + 50} textAnchor="middle" fontSize="10" fontFamily="var(--font-body)" fill={on ? 'rgba(255,255,255,0.82)' : 'var(--accent-600)'} style={{ pointerEvents: 'none' }}>
                  {layers[i].kicker}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="bt-sim__caption">
          Above the dashed line is what you get without looking. Everything below it has to be looked for.
        </p>
      </div>

      <div className="bt-walk__panel">
        <p className="bt-eyebrow">Layer {active + 1} of {layers.length}</p>
        <h3>{layer.title}</h3>
        <p className="bt-note" style={{ marginTop: 8 }}>{layer.question}</p>
        <p className="bt-walk__body">{layer.body}</p>

        <div className="bt-meter" style={{ marginTop: 22 }}>
          <div className="bt-meter__head">
            <span className="bt-meter__name">Leverage of a fix at this layer</span>
            <span className="bt-meter__val bt-tnum">{active + 1} / {layers.length}</span>
          </div>
          <span className="bt-bar" aria-hidden="true"><i style={{ width: `${leverage}%` }} /></span>
          <p className="bt-meter__note">{layer.ask}</p>
        </div>

        <div className="bt-walk__nav">
          <button
            type="button"
            className="bt-btn bt-btn--tertiary bt-btn--sm"
            disabled={active === 0}
            onClick={() => setActive(a => Math.max(0, a - 1))}
          >
            Back up
          </button>
          <button
            type="button"
            className="bt-btn bt-btn--sm"
            disabled={active === layers.length - 1}
            onClick={() => setActive(a => Math.min(layers.length - 1, a + 1))}
          >
            Go deeper
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
