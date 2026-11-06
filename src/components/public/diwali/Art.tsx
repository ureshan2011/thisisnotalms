import { useId, type CSSProperties } from 'react';
import { DIYA, DIYA_PAINT, RANGOLI, RANGOLI_R, type DiyaPaint } from './geometry';

// ─── Hand-drawn Diwali pictures, as SVG ───────────────────────────────────
// Diyas, sky lanterns, a marigold toran, a rangoli, three sweets, a ribbon
// bow and a paisley divider. Animations (flicker, sway, bloom, spin) are CSS
// classes in src/styles/diwali.css, so these stay plain markup.

const useSvgId = () => useId().replace(/:/g, '');

// ── Diya ─────────────────────────────────────────────────────────────────
export function Diya({
  lit = true,
  paint = 'clay',
  size = 64,
  className = '',
  style,
}: {
  lit?: boolean;
  paint?: DiyaPaint;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useSvgId();
  const [light, dark, trim] = DIYA_PAINT[paint];
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`dw-diya ${lit ? 'is-lit' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}g`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd27a" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ff9a2e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff5a1a" />
          <stop offset="45%" stopColor="#ffb52e" />
          <stop offset="100%" stopColor="#fff2b0" />
        </linearGradient>
      </defs>
      <circle className="dw-diya__glow" cx="60" cy="42" r="46" fill={`url(#${id}g)`} />
      <path d={DIYA.foot} fill={dark} />
      <path d={DIYA.body} fill={`url(#${id}b)`} />
      <ellipse cx="60" cy="62" rx="46" ry="9" fill={dark} />
      <ellipse cx="60" cy="62.5" rx="39" ry="5.6" fill="#5a2208" />
      <ellipse className="dw-diya__oil" cx="60" cy="62" rx="22" ry="2.6" fill="#ffcf6a" opacity="0.5" />
      <path d={DIYA.band} fill="none" stroke={trim} strokeWidth="2.4" strokeLinecap="round" />
      {DIYA.dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={trim} />
      ))}
      {DIYA.lowDots.map((x) => (
        <circle key={x} cx={x} cy="90" r="1.4" fill="#fff3c4" opacity="0.8" />
      ))}
      <line x1="60" y1="55" x2="60" y2="62" stroke="#2a1205" strokeWidth="2.2" strokeLinecap="round" />
      <g className="dw-diya__flame">
        <path d={DIYA.flame} fill={`url(#${id}f)`} />
        <path d={DIYA.core} fill="#fffbe6" />
      </g>
    </svg>
  );
}

// ── Sky lantern (akash kandil) ───────────────────────────────────────────
function starPath(cx: number, cy: number, R: number, r: number, n: number) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}
const LANTERN_STAR = starPath(50, 82, 15, 6.5, 8);

export function Lantern({
  color = '#e0218a',
  string = 30,
  className = '',
  style,
}: {
  color?: string;
  string?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useSvgId();
  const h = 160 + string;
  return (
    <svg
      viewBox={`0 ${-string} 100 ${h}`}
      className={`dw-lantern ${className}`}
      style={{ ...style, aspectRatio: `100 / ${h}` }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}l`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff2c2" />
          <stop offset="35%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.75" />
        </radialGradient>
        <radialGradient id={`${id}h`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="dw-lantern__sway">
        <line x1="50" y1={-string} x2="50" y2="34" stroke="#d9b45a" strokeWidth="1.2" />
        <circle cx="50" cy="82" r="62" fill={`url(#${id}h)`} />
        <polygon points="38,34 62,34 70,44 30,44" fill="#ffcf5a" />
        <path d="M30 44 L70 44 L86 82 L70 120 L30 120 L14 82 Z" fill={`url(#${id}l)`} stroke="#ffcf5a" strokeWidth="1.6" />
        <path
          d="M30 44 L50 82 L30 120 M70 44 L50 82 L70 120 M14 82 H86"
          fill="none"
          stroke="#ffcf5a"
          strokeWidth="1"
          opacity="0.75"
        />
        <path d={LANTERN_STAR} fill="#fff6d6" className="dw-lantern__star" />
        <polygon points="30,120 70,120 62,130 38,130" fill="#ffcf5a" />
        <g className="dw-lantern__tassels">
          {[38, 42, 46, 50, 54, 58, 62].map((x, i) => (
            <rect
              key={x}
              x={x - 1.4}
              y="130"
              width="2.8"
              height={22 + ((i * 7) % 4) * 6 + (i === 3 ? 10 : 0)}
              rx="1.4"
              fill={i % 2 ? '#ffcf5a' : color}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

// ── Marigold toran ───────────────────────────────────────────────────────
const TW = 160;
const TH = 92;
const swag = Array.from({ length: 13 }, (_, i) => {
  const t = i / 12;
  const x = 2 * (1 - t) * t * 80 + t * t * TW;
  const y = (1 - t) ** 2 * 8 + 2 * (1 - t) * t * 66 + t * t * 8;
  return [x, y] as const;
});
const MARIGOLD = ['#ff8c1a', '#ffc61a', '#ff6a00', '#ffc61a'];

function Marigold({ x, y, r, i }: { x: number; y: number; r: number; i: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={MARIGOLD[i % 4]} />
      <circle cx={x} cy={y} r={r * 0.62} fill="none" stroke="#b34700" strokeWidth="0.9" strokeDasharray="1.6 1.6" opacity="0.7" />
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.25} fill="#fff1b8" opacity="0.55" />
    </g>
  );
}

function Hanging({ x }: { x: number }) {
  return (
    <g>
      <line x1={x} y1="6" x2={x} y2="70" stroke="#7a3b00" strokeWidth="1" />
      {[14, 26, 38, 50, 62].map((y, i) => (
        <Marigold key={y} x={x} y={y} r={5.6} i={i + 1} />
      ))}
      <path d={`M${x} 68 l -5 8 h 10 Z`} fill="#ffcf5a" />
      <circle cx={x} cy="80" r="3.4" fill="#ffcf5a" />
    </g>
  );
}

function MangoLeaf({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 5)`}>
      <path d="M0 0 Q 7 14 0 30 Q -7 14 0 0 Z" fill="#2f8f3a" />
      <path d="M0 2 V 28" stroke="#a6e07a" strokeWidth="0.8" />
    </g>
  );
}

export function Toran({ className = '' }: { className?: string }) {
  const id = useSvgId();
  return (
    <svg className={`dw-toran ${className}`} width="100%" height={TH} aria-hidden="true">
      <defs>
        <pattern id={`${id}t`} patternUnits="userSpaceOnUse" width={TW} height={TH}>
          <rect x="0" y="2" width={TW} height="3" fill="#7a3b00" />
          <MangoLeaf x={40} />
          <MangoLeaf x={120} />
          {swag.map(([x, y], i) => (
            <Marigold key={i} x={x} y={y} r={6.6} i={i} />
          ))}
          <Hanging x={0} />
          <Hanging x={TW} />
        </pattern>
      </defs>
      <rect width="100%" height={TH} fill={`url(#${id}t)`} />
    </svg>
  );
}

// ── Rangoli ──────────────────────────────────────────────────────────────
export function Rangoli({
  size = 420,
  bloom = true,
  className = '',
  style,
}: {
  size?: number | string;
  bloom?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const R = RANGOLI_R + 8;
  return (
    <svg
      viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`}
      width={size}
      height={size}
      className={`dw-rangoli ${bloom ? 'is-bloom' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <circle r={RANGOLI_R - 2} fill="none" stroke="#ffd36b" strokeWidth="1.2" strokeDasharray="2 6" opacity="0.6" />
      <circle r="150" fill="none" stroke="#ffd36b" strokeWidth="1" opacity="0.35" />
      {RANGOLI.map((layer, li) => (
        <g key={li} className="dw-rg-layer" style={{ '--i': RANGOLI.length - li } as CSSProperties}>
          <g className={layer.spin ? `dw-spin-${layer.spin}` : undefined}>
            {Array.from({ length: layer.count }, (_, k) => (
              <path
                key={k}
                d={layer.d}
                fill={layer.fill}
                stroke={layer.stroke}
                strokeWidth={layer.stroke ? 1.2 : undefined}
                transform={`rotate(${(360 / layer.count) * k + (layer.offset ?? 0)}) translate(0 ${-layer.radius})`}
              />
            ))}
          </g>
        </g>
      ))}
    </svg>
  );
}

// ── Sweets ───────────────────────────────────────────────────────────────
export type SweetName = 'Ladoo' | 'Barfi' | 'Jalebi';

function spiral() {
  const pts: string[] = [];
  for (let a = 0; a <= Math.PI * 5; a += 0.25) {
    const r = 1.5 + a * 1.05;
    pts.push(`${(20 + r * Math.cos(a)).toFixed(1)} ${(21 + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}
const JALEBI = spiral();

export function Sweet({ name, size = 22 }: { name: SweetName; size?: number }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className="dw-sweet" aria-hidden="true">
      {name === 'Ladoo' && (
        <>
          <defs>
            <radialGradient id={`${id}s`} cx="38%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ffd27a" />
              <stop offset="100%" stopColor="#e07a12" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="21" r="15" fill={`url(#${id}s)`} />
          {[
            [14, 16],
            [24, 14],
            [27, 23],
            [18, 26],
            [12, 23],
            [21, 20],
            [24, 30],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" fill="#b85a00" opacity="0.7" />
          ))}
          <ellipse cx="15" cy="13" rx="4" ry="2.4" fill="#fff6d6" opacity="0.6" />
        </>
      )}
      {name === 'Barfi' && (
        <>
          <polygon points="20,4 37,21 20,38 3,21" fill="#f3e2c3" stroke="#cdb48a" strokeWidth="1.2" />
          <polygon points="20,9 32,21 20,33 8,21" fill="#ffffff" opacity="0.55" />
          <polygon points="16,15 22,13 25,18 19,20" fill="#e6edf5" opacity="0.9" />
        </>
      )}
      {name === 'Jalebi' && (
        <>
          <path d={JALEBI} fill="none" stroke="#e8820c" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d={JALEBI} fill="none" stroke="#ffc54d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

// ── Ribbon bow (for the sweet boxes) ─────────────────────────────────────
export function Bow({ color = '#e0218a' }: { color?: string }) {
  return (
    <svg viewBox="0 0 80 40" className="dw-bow" aria-hidden="true">
      <path d="M40 20 C 26 2, 6 6, 10 18 C 13 28, 30 26, 40 20 Z" fill={color} />
      <path d="M40 20 C 54 2, 74 6, 70 18 C 67 28, 50 26, 40 20 Z" fill={color} />
      <path d="M40 20 L 30 38 L 36 36 L 40 24 Z M40 20 L 50 38 L 44 36 L 40 24 Z" fill={color} opacity="0.85" />
      <path d="M40 20 C 30 10, 16 10, 16 16" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="40" cy="20" r="5" fill="#ffd36b" />
    </svg>
  );
}

// ── Paisley divider ──────────────────────────────────────────────────────
const PAISLEY = 'M8 26 C 0 22, 0 10, 10 6 C 20 2, 30 6, 38 0 C 36 10, 32 18, 24 24 C 18 28, 12 28, 8 26 Z';

export function Divider({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 40" className={`dw-divider ${className}`} aria-hidden="true">
      <line x1="10" y1="22" x2="128" y2="22" stroke="#ffd36b" strokeWidth="1" opacity="0.6" />
      <line x1="232" y1="22" x2="350" y2="22" stroke="#ffd36b" strokeWidth="1" opacity="0.6" />
      {[30, 60, 90].map((x) => (
        <circle key={x} cx={x} cy="22" r="2" fill="#ffd36b" />
      ))}
      {[270, 300, 330].map((x) => (
        <circle key={x} cx={x} cy="22" r="2" fill="#ffd36b" />
      ))}
      <g transform="translate(118 10) scale(0.7)">
        <path d={PAISLEY} fill="#e0218a" />
        <circle cx="12" cy="18" r="3" fill="#ffd36b" />
      </g>
      <g transform="translate(242 10) scale(-0.7 0.7)">
        <path d={PAISLEY} fill="#e0218a" />
        <circle cx="12" cy="18" r="3" fill="#ffd36b" />
      </g>
      <g transform="translate(180 32)">
        {[-70, -35, 35, 70].map((a) => (
          <path
            key={a}
            d="M0 0 C 6 -10, 6 -20, 0 -28 C -6 -20, -6 -10, 0 0 Z"
            fill={Math.abs(a) > 50 ? '#ff8c1a' : '#ffc61a'}
            transform={`rotate(${a})`}
          />
        ))}
        <path d="M0 0 C 7 -10, 7 -22, 0 -31 C -7 -22, -7 -10, 0 0 Z" fill="#e0218a" />
      </g>
    </svg>
  );
}
