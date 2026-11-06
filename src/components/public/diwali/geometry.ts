// ─── Shapes shared by the SVG drawings and the canvas greeting card ───────
// Path strings work in both places: React renders them as <path d>, and the
// card maker turns them into Path2D. Keeping them here means the card a
// student saves looks like the page they just used.

/** A teardrop petal, base at the origin, pointing up (negative y). */
export const petal = (L: number, w: number) =>
  `M0 0 C ${w} ${-L * 0.3} ${w * 0.8} ${-L * 0.8} 0 ${-L} C ${-w * 0.8} ${-L * 0.8} ${-w} ${-L * 0.3} 0 0 Z`;

/** A leaf, pointed at both ends. */
export const leaf = (L: number, w: number) => `M0 0 Q ${w} ${-L / 2} 0 ${-L} Q ${-w} ${-L / 2} 0 0 Z`;

/** A round-bottomed lotus petal. */
export const lotus = (L: number, w: number) =>
  `M0 0 C ${w * 1.2} ${-L * 0.25} ${w} ${-L * 0.75} 0 ${-L} C ${-w} ${-L * 0.75} ${-w * 1.2} ${-L * 0.25} 0 0 Z`;

/** A circle as a path, centred on the origin. */
export const dot = (r: number) => `M ${-r} 0 a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;

export interface RangoliLayer {
  d: string;
  count: number;
  /** Distance from the centre to the shape's base. */
  radius: number;
  fill: string;
  stroke?: string;
  /** Extra rotation, in degrees, so a layer sits between the one below. */
  offset?: number;
  spin?: 'cw' | 'ccw';
}

export const RANGOLI_R = 232;

/** The rangoli, drawn outside in, so later layers sit on top. */
export const RANGOLI: RangoliLayer[] = [
  { d: dot(3.4), count: 48, radius: 222, fill: '#fff3c4', spin: 'ccw' },
  { d: petal(30, 9), count: 24, radius: 176, fill: '#ffc61a', stroke: '#7a2c00', offset: 7.5, spin: 'ccw' },
  { d: petal(84, 30), count: 12, radius: 118, fill: '#7b2cbf', stroke: '#ffd36b' },
  { d: petal(60, 19), count: 12, radius: 124, fill: '#e0218a' },
  { d: dot(4), count: 12, radius: 196, fill: '#fff3c4' },
  { d: leaf(78, 15), count: 12, radius: 108, fill: '#0fb5ae', stroke: '#063c44', offset: 15 },
  { d: dot(2.6), count: 36, radius: 112, fill: '#fff3c4', spin: 'cw' },
  { d: petal(52, 16), count: 16, radius: 56, fill: '#ff8c1a', stroke: '#7a2c00', spin: 'cw' },
  { d: lotus(40, 17), count: 8, radius: 20, fill: '#ffcf3a', stroke: '#b5162b' },
  { d: dot(20), count: 1, radius: 0, fill: '#b5162b' },
  { d: dot(2.2), count: 10, radius: 14, fill: '#fff3c4' },
  { d: dot(8), count: 1, radius: 0, fill: '#ffd36b' },
];

// ── The diya (viewBox 0 0 120 120) ──────────────────────────────────────
export const DIYA = {
  body: 'M14 62 C 16 86, 38 98, 60 98 C 82 98, 104 86, 106 62 C 92 70, 28 70, 14 62 Z',
  foot: 'M46 96 L 42 106 Q 60 110 78 106 L 74 96 Z',
  band: 'M24 76 Q 30 83 36 76 T 48 76 T 60 76 T 72 76 T 84 76 T 96 76',
  flame: 'M60 14 C 67 28, 75 40, 70 52 C 67 60, 53 60, 50 52 C 45 40, 53 28, 60 14 Z',
  core: 'M60 30 C 64 38, 67 45, 64 52 C 62 56, 58 56, 56 52 C 53 45, 56 38, 60 30 Z',
  dots: [
    [30, 71],
    [42, 83],
    [54, 71],
    [66, 83],
    [78, 71],
    [90, 83],
  ] as [number, number][],
  lowDots: [40, 50, 60, 70, 80] as number[],
};

export const DIYA_PAINT = {
  clay: ['#e98a45', '#9c3d12', '#ffd36b'],
  rani: ['#f0389b', '#8a0f52', '#ffd36b'],
  peacock: ['#19c4bb', '#0b5f73', '#ffd36b'],
  gold: ['#ffd76a', '#b8741a', '#b5162b'],
  violet: ['#9b5cff', '#4b1a99', '#ffd36b'],
} as const;
export type DiyaPaint = keyof typeof DIYA_PAINT;
export const PAINTS = Object.keys(DIYA_PAINT) as DiyaPaint[];
