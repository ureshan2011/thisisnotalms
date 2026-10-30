import { useEffect, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';

// ─── The /normalisation hero: someone cleaning up a database ──────────────
// A drawn scene, all SVG. A dirty, crooked student table sits on a board; a
// person on the right works along it with a long squeegee, row by row. Grime
// clears behind the blade, crooked rows straighten, the duplicate row is
// wiped away and the "Dr. Smyth" typo is fixed. Then the board is polished
// into three normalised tables, the 1NF/2NF/3NF chips light up and the
// redundancy gauge drains. It holds, fades back to the mess, and repeats.
//
// The squeegee position is two motion values (tx, ty). Everything that
// follows the blade (the pole, both arms through a two-bone IK solve, the
// wipe mask, the foam) is derived from them, so the loop only animates two
// numbers. Under prefers-reduced-motion the finished, normalised board is
// drawn still.

const EASE = [0.16, 1, 0.3, 1] as const;
const INK = '#1a1615';
const ACCENT = '#f4551e';
const PAPER = '#efd8c9';
const SKIN = '#b9775a';
const SKIN_DARK = '#9c5f45';

// Board and table geometry
const BX = 20;
const BY = 40;
const BW = 372;
const BH = 334;
const COLS = [64, 52, 40, 80, 104]; // sums to 340
const TX0 = BX + 16;
const HEAD_Y = 96;
const ROW_Y = 128;
const PITCH = 36;
const ROW_H = 28;
const ROW_L = TX0 - 6;
const ROW_R = TX0 + 340 + 6;
const colX = (i: number) => TX0 + COLS.slice(0, i).reduce((a, b) => a + b, 0);

interface MessRow {
  cells: string[];
  bad?: number[];
  dup?: boolean;
  fix?: Record<number, string>;
  tilt: number;
  dx: number;
}

const ROWS: MessRow[] = [
  { cells: ['S1', 'Alice', 'CS', 'Dr. Smith', 'C1:A, C2:B'], bad: [4], tilt: -1.6, dx: -4 },
  { cells: ['S2', 'Bob', 'CS', 'Dr. Smith', 'C1:A'], bad: [3], tilt: 1.3, dx: 7 },
  { cells: ['S3', 'Carol', 'Math', 'Dr. Jones', 'C3:A, C4:C'], bad: [4], tilt: -0.9, dx: -2 },
  { cells: ['S2', 'Bob', 'CS', 'Dr. Smith', 'C1:A'], dup: true, tilt: 2.1, dx: 9 },
  { cells: ['S4', 'Dave', 'CS', 'Dr. Smyth', 'C2:B'], bad: [3], fix: { 3: 'Dr. Smith' }, tilt: -1.4, dx: 3 },
];

// Grime specks per row, fixed so the drawing is stable between renders.
const SPECKS = ROWS.map((_, r) =>
  Array.from({ length: 9 }, (_, i) => ({
    x: ROW_L + 12 + ((i * 41 + r * 23) % 330),
    y: 6 + ((i * 7 + r * 5) % 17),
    r: 1.2 + ((i + r) % 3) * 0.7,
  })),
);

type Phase = 'mess' | 'clean' | 'polish' | 'done';

const CAPTION: Record<Phase, string> = {
  mess: 'A messy table: crooked rows, a duplicate, a typo, lists in cells.',
  clean: 'Cleaning it up, one row at a time.',
  polish: 'Polishing: split into tables where every fact lives once.',
  done: 'Normalised. 1NF, 2NF and 3NF all hold.',
};

// Person: shoulders, grip, and the two-bone arm solve.
const SHOULDER_F = { x: 474, y: 286 };
const SHOULDER_B = { x: 492, y: 282 };
const GRIP = { x: 452, y: 318 };
const REST = { x: 430, y: 150 };

function elbow(s: { x: number; y: number }, h: { x: number; y: number }, l1 = 40, l2 = 38) {
  const dx = h.x - s.x;
  const dy = h.y - s.y;
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.5) || 1;
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const hh = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const px = s.x + (a * dx) / d;
  const py = s.y + (a * dy) / d;
  // Elbow bends down and out, away from the board.
  return { x: px + (hh * dy) / d, y: py - (hh * dx) / d, reach: { x: s.x + (dx / Math.hypot(dx, dy)) * d, y: s.y + (dy / Math.hypot(dx, dy)) * d } };
}

function useRig(tx: MotionValue<number>, ty: MotionValue<number>) {
  const rig = useTransform([tx, ty], ([x, y]: number[]) => {
    const gx = GRIP.x + (x - GRIP.x) * 0.07;
    const gy = GRIP.y + (y - GRIP.y) * 0.1;
    const len = Math.hypot(x - gx, y - gy) || 1;
    const ux = (x - gx) / len;
    const uy = (y - gy) / len;
    const hf = { x: gx, y: gy };
    const hb = { x: gx + ux * 30, y: gy + uy * 30 };
    const ef = elbow(SHOULDER_F, hf);
    const eb = elbow(SHOULDER_B, hb);
    return { gx, gy, ux, uy, x, y, hf: ef.reach, hb: eb.reach, ef, eb };
  });
  const pole = useTransform(rig, r => `M ${r.gx - r.ux * 26} ${r.gy - r.uy * 26} L ${r.x - r.ux * 7} ${r.y - r.uy * 7}`);
  const poleInner = useTransform(rig, r => `M ${r.gx + r.ux * 60} ${r.gy + r.uy * 60} L ${r.x - r.ux * 7} ${r.y - r.uy * 7}`);
  const armF = useTransform(rig, r => `M ${SHOULDER_F.x} ${SHOULDER_F.y} L ${r.ef.x} ${r.ef.y} L ${r.hf.x} ${r.hf.y}`);
  const armB = useTransform(rig, r => `M ${SHOULDER_B.x} ${SHOULDER_B.y} L ${r.eb.x} ${r.eb.y} L ${r.hb.x} ${r.hb.y}`);
  const hfx = useTransform(rig, r => r.hf.x);
  const hfy = useTransform(rig, r => r.hf.y);
  const hbx = useTransform(rig, r => r.hb.x);
  const hby = useTransform(rig, r => r.hb.y);
  return { pole, poleInner, armF, armB, hfx, hfy, hbx, hby };
}

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

function Sparkle({ x, y, delay = 0, size = 10, color = '#f5b301' }: { x: number; y: number; delay?: number; size?: number; color?: string }) {
  const s = size;
  return (
    <motion.path
      d={`M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`}
      fill={color}
      initial={{ scale: 0, opacity: 0, rotate: -30 }}
      animate={{ scale: [0, 1.15, 0], opacity: [0, 1, 0], rotate: [-30, 0, 30] }}
      transition={{ duration: 0.9, delay, ease: 'easeOut' }}
      style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }}
    />
  );
}

export default function NormalisationHeroScene() {
  const reduce = useReducedMotion();
  const tx = useMotionValue(REST.x);
  const ty = useMotionValue(REST.y);
  const [phase, setPhase] = useState<Phase>(reduce ? 'done' : 'mess');
  const [active, setActive] = useState(-1);
  const [cleaned, setCleaned] = useState<number[]>([]);
  const [cycle, setCycle] = useState(0);
  const rig = useRig(tx, ty);

  // The wipe: grime on the active row only shows to the right of the blade.
  const wipeW = useTransform(tx, x => Math.max(0, x - ROW_L));
  const bob = useTransform(tx, x => Math.sin(x / 26) * 1.6);
  const lean = useTransform(tx, x => (x - REST.x) * 0.012);

  // Where each row sits once the duplicate has gone.
  const slot = (i: number) => {
    const removedAbove = cleaned.includes(3) && i > 3 ? 1 : 0;
    return i - removedAbove;
  };

  useEffect(() => {
    if (reduce) return;
    let stop = false;
    const go = (mv: MotionValue<number>, to: number, duration: number, ease: typeof EASE | 'easeInOut' = 'easeInOut') =>
      animate(mv, to, { duration, ease });

    (async () => {
      while (!stop) {
        setPhase('mess');
        setActive(-1);
        setCleaned([]);
        await wait(1500);
        if (stop) return;
        setPhase('clean');
        const done: number[] = [];
        for (let i = 0; i < ROWS.length; i++) {
          const removed = done.includes(3) && i > 3 ? 1 : 0;
          const cy = ROW_Y + (i - removed) * PITCH + ROW_H / 2;
          await Promise.all([go(tx, ROW_L + 4, 0.5, EASE), go(ty, cy, 0.5, EASE)]);
          if (stop) return;
          setActive(i);
          await go(tx, ROW_R - 2, 1.05);
          if (stop) return;
          done.push(i);
          setCleaned([...done]);
          setActive(-1);
          await wait(i === 3 ? 450 : 180);
        }
        await Promise.all([go(tx, REST.x, 0.8, EASE), go(ty, REST.y, 0.8, EASE)]);
        if (stop) return;
        setPhase('polish');
        await wait(2300);
        if (stop) return;
        setPhase('done');
        setCycle(c => c + 1);
        await wait(3400);
      }
    })();
    return () => {
      stop = true;
      tx.stop();
      ty.stop();
    };
  }, [reduce, tx, ty]);

  const polished = phase === 'polish' || phase === 'done';
  const stepIdx = { mess: 0, clean: 1, polish: 2, done: 3 }[phase];
  const status =
    phase === 'mess'
      ? { t: 'Messy data', c: '#d93a2b', bg: '#fbe9e6' }
      : phase === 'clean'
      ? { t: 'Cleaning…', c: '#b45309', bg: '#fdf3df' }
      : { t: 'Normalised', c: '#1f8a57', bg: '#e7f6ee' };
  const redundancy = polished ? 0.1 : phase === 'clean' ? 0.9 - cleaned.length * 0.08 : 0.92;

  return (
    <div className="nx-scene">
      <svg viewBox="0 0 580 500" role="img" aria-label="Animation: a person cleans a messy database table with a squeegee, row by row, then the table is polished into three normalised tables.">
        <defs>
          <filter id="nx-soft" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#141110" floodOpacity="0.14" />
          </filter>
          <pattern id="nx-grime" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="#8b6b4a" opacity="0.16" />
            <circle cx="3" cy="4" r="1.2" fill="#6e5136" opacity="0.45" />
            <circle cx="10" cy="10" r="0.9" fill="#6e5136" opacity="0.35" />
          </pattern>
          <clipPath id="nx-board-clip">
            <rect x={BX} y={BY} width={BW} height={BH} rx="22" />
          </clipPath>
        </defs>

        {/* Backdrop */}
        <circle cx="300" cy="250" r="230" fill="#fff1ea" />
        <motion.circle cx="512" cy="96" r="44" fill="#ffdccb" animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        {/* Small database glyph */}
        <g transform="translate(494 74)" opacity="0.9">
          <ellipse cx="18" cy="6" rx="18" ry="6" fill="#fff" stroke={ACCENT} strokeWidth="2.5" />
          <path d="M0 6 v26 a18 6 0 0 0 36 0 v-26" fill="#fff" stroke={ACCENT} strokeWidth="2.5" />
          <path d="M0 19 a18 6 0 0 0 36 0" fill="none" stroke={ACCENT} strokeWidth="2.5" />
        </g>
        <ellipse cx="300" cy="478" rx="270" ry="10" fill="#141110" opacity="0.06" />

        {/* Board */}
        <g filter="url(#nx-soft)">
          <rect x={BX} y={BY} width={BW} height={BH} rx="22" fill="#fff" stroke={PAPER} />
        </g>
        <g clipPath="url(#nx-board-clip)">
          {/* Title bar */}
          <rect x={BX} y={BY} width={BW} height="40" fill="#fefaf7" />
          <line x1={BX} x2={BX + BW} y1={BY + 40} y2={BY + 40} stroke={PAPER} />
          {[0, 1, 2].map(i => (
            <circle key={i} cx={BX + 20 + i * 14} cy={BY + 20} r="4.5" fill={['#d93a2b', '#e8a317', '#2fa36b'][i]} opacity="0.85" />
          ))}
          <text x={BX + 70} y={BY + 24} className="nx-scene__mono" fill="#6b615d">students.db</text>
          <motion.rect
            y={BY + 10}
            height="20"
            rx="10"
            initial={false}
            animate={{ fill: status.bg, x: BX + BW - 104, width: 92 }}
          />
          <motion.text x={BX + BW - 58} y={BY + 24} textAnchor="middle" className="nx-scene__chip" initial={false} animate={{ fill: status.c }}>
            {status.t}
          </motion.text>

          {/* ── The messy table, being cleaned ── */}
          <motion.g initial={false} animate={{ opacity: polished ? 0 : 1, y: polished ? -8 : 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <rect x={ROW_L} y={HEAD_Y} width={ROW_R - ROW_L} height="24" rx="6" fill={INK} />
            {['StudentID', 'Name', 'Dept', 'DeptHead', 'Courses'].map((h, i) => (
              <text key={h} x={colX(i) + 4} y={HEAD_Y + 16} className="nx-scene__th" fill="#fff">
                {h}
              </text>
            ))}

            {ROWS.map((row, i) => {
              const isClean = cleaned.includes(i);
              const gone = isClean && row.dup;
              const y = ROW_Y + slot(i) * PITCH;
              return (
                <motion.g
                  key={`${cycle}-${i}`}
                  initial={false}
                  animate={{
                    y: y - ROW_Y,
                    x: isClean ? 0 : row.dx,
                    rotate: isClean ? 0 : row.tilt,
                    opacity: gone ? 0 : 1,
                    scale: gone ? 0.92 : 1,
                  }}
                  transition={{ duration: 0.55, ease: EASE }}
                  style={{ transformOrigin: `${(ROW_L + ROW_R) / 2}px ${ROW_Y + ROW_H / 2}px`, transformBox: 'view-box' }}
                >
                  <rect x={ROW_L} y={ROW_Y} width={ROW_R - ROW_L} height={ROW_H} rx="6" fill={isClean ? '#fff' : '#fffaf6'} stroke={isClean ? '#cdebdc' : PAPER} />
                  {row.cells.map((c, ci) => {
                    const bad = !isClean && (row.bad?.includes(ci) || row.dup);
                    const val = isClean && row.fix?.[ci] ? row.fix[ci] : c;
                    const fixed = isClean && row.fix?.[ci] !== undefined;
                    return (
                      <g key={ci}>
                        {(bad || fixed) && (
                          <rect x={colX(ci) + 1} y={ROW_Y + 5} width={COLS[ci] - 4} height={18} rx="4" fill={fixed ? '#dcf3e6' : '#fde3df'} />
                        )}
                        <text
                          x={colX(ci) + 4}
                          y={ROW_Y + 18}
                          className="nx-scene__mono"
                          fill={fixed ? '#146c43' : bad ? '#b42318' : ci === 0 ? '#a5300a' : '#2e2826'}
                          fontWeight={ci === 0 || fixed ? 700 : 400}
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}
                  {row.dup && !isClean && (
                    <g>
                      <rect x={ROW_R - 64} y={ROW_Y - 9} width="58" height="15" rx="7.5" fill="#d93a2b" />
                      <text x={ROW_R - 35} y={ROW_Y + 2} textAnchor="middle" className="nx-scene__chip" fill="#fff" style={{ fontSize: 9 }}>
                        duplicate
                      </text>
                    </g>
                  )}
                  {/* Grime: full until wiped; masked to the right of the blade while wiping */}
                  {!isClean && (
                    <g>
                      <defs>
                        <mask id={`nx-wipe-${i}`}>
                          <rect x={ROW_L - 10} y={ROW_Y - 10} width={ROW_R - ROW_L + 20} height={ROW_H + 20} fill="#fff" />
                          {active === i && <motion.rect x={ROW_L - 10} y={ROW_Y - 10} height={ROW_H + 20} width={wipeW} fill="#000" />}
                        </mask>
                      </defs>
                      <g mask={`url(#nx-wipe-${i})`}>
                        <rect x={ROW_L} y={ROW_Y} width={ROW_R - ROW_L} height={ROW_H} rx="6" fill="url(#nx-grime)" />
                        {SPECKS[i].map((s, k) => (
                          <circle key={k} cx={s.x} cy={ROW_Y + s.y} r={s.r} fill="#6e5136" opacity="0.5" />
                        ))}
                      </g>
                    </g>
                  )}
                  {/* Tick and sparkle once clean */}
                  {isClean && !row.dup && (
                    <>
                      <motion.circle
                        cx={ROW_R + 2}
                        cy={ROW_Y + ROW_H / 2}
                        r="8"
                        fill="#2fa36b"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                        style={{ transformOrigin: `${ROW_R + 2}px ${ROW_Y + ROW_H / 2}px`, transformBox: 'view-box' }}
                      />
                      <path d={`M ${ROW_R - 2} ${ROW_Y + 14} l 3 3 l 5 -6`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <Sparkle x={ROW_R - 30} y={ROW_Y - 2} />
                      <Sparkle x={ROW_R - 70} y={ROW_Y + 26} delay={0.12} size={7} color="#ffb894" />
                    </>
                  )}
                </motion.g>
              );
            })}
          </motion.g>

          {/* ── The polished result: three normalised tables ── */}
          <motion.g initial={false} animate={{ opacity: polished ? 1 : 0 }} transition={{ duration: 0.5, delay: polished ? 0.35 : 0 }}>
            {polished && (
              <PolishedTables />
            )}
          </motion.g>

          {/* Bottom strip: normal forms and the redundancy gauge */}
          <line x1={BX} x2={BX + BW} y1={BY + BH - 46} y2={BY + BH - 46} stroke={PAPER} />
          {['1NF', '2NF', '3NF'].map((nf, i) => {
            const on = phase === 'done' || (phase === 'polish' && i === 0);
            return (
              <g key={nf}>
                <motion.rect
                  x={BX + 16 + i * 52}
                  y={BY + BH - 34}
                  width="46"
                  height="22"
                  rx="11"
                  initial={false}
                  animate={{ fill: on ? '#2fa36b' : '#f8e9df' }}
                  transition={{ duration: 0.35, delay: on ? i * 0.25 : 0 }}
                />
                <motion.text
                  x={BX + 39 + i * 52}
                  y={BY + BH - 19}
                  textAnchor="middle"
                  className="nx-scene__chip"
                  initial={false}
                  animate={{ fill: on ? '#ffffff' : '#9b918d' }}
                  transition={{ duration: 0.35, delay: on ? i * 0.25 : 0 }}
                >
                  {nf}
                </motion.text>
              </g>
            );
          })}
          <text x={BX + 186} y={BY + BH - 19} className="nx-scene__chip" fill="#6b615d">Redundancy</text>
          <rect x={BX + 254} y={BY + BH - 27} width="100" height="8" rx="4" fill="#f8e9df" />
          <motion.rect
            x={BX + 254}
            y={BY + BH - 27}
            height="8"
            rx="4"
            initial={false}
            animate={{ width: 100 * redundancy, fill: redundancy > 0.6 ? '#d93a2b' : redundancy > 0.3 ? '#e8a317' : '#2fa36b' }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </g>

        {/* Polish sparkles around the board */}
        {phase === 'done' && (
          <g key={`spark-${cycle}`}>
            <Sparkle x={BX + 14} y={BY + 10} size={13} />
            <Sparkle x={BX + BW - 6} y={BY + 60} delay={0.15} size={10} color="#ffb894" />
            <Sparkle x={BX + 60} y={BY + BH + 8} delay={0.3} size={11} />
            <Sparkle x={BX + BW - 40} y={BY + BH + 12} delay={0.45} size={8} color="#2fa36b" />
          </g>
        )}

        {/* ── Bucket ── */}
        <g transform="translate(528 418)">
          <path d="M-22 0 L22 0 L17 46 L-17 46 Z" fill="#0e7c70" />
          <rect x="-24" y="-4" width="48" height="8" rx="4" fill="#0b5d57" />
          <path d="M-20 -2 A 20 20 0 0 1 20 -2" fill="none" stroke="#6b615d" strokeWidth="2" />
          {[[-12, -6, 6], [-2, -9, 7], [9, -6, 5], [15, -3, 4]].map(([x, y, r], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="#fff"
              stroke="#cdebe5"
              animate={reduce ? undefined : { y: [0, -2, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
            />
          ))}
        </g>

        {/* ── The person ── */}
        <motion.g style={{ y: bob }}>
          {/* back arm (behind the body) */}
          <motion.path d={rig.armB} stroke="#c63c0c" strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <motion.circle cx={rig.hbx} cy={rig.hby} r="7" fill={SKIN_DARK} />

          {/* legs */}
          <path d="M476 372 L470 462" stroke="#2e2826" strokeWidth="17" strokeLinecap="round" />
          <path d="M500 372 L506 462" stroke="#403936" strokeWidth="17" strokeLinecap="round" />
          <path d="M456 466 q 6 -10 22 -6 l 2 8 h -24 z" fill={INK} />
          <path d="M498 466 q 6 -10 22 -6 l 2 8 h -24 z" fill={INK} />

          {/* torso: hoodie with an apron */}
          <motion.g style={{ rotate: lean, transformOrigin: '488px 372px', transformBox: 'view-box' }}>
            <path d="M458 290 q 30 -22 62 0 l 6 86 q -37 10 -74 0 z" fill={ACCENT} />
            <path d="M466 318 h 44 l 4 54 q -26 6 -52 0 z" fill="#fff" opacity="0.92" />
            <path d="M472 318 q 16 -20 32 0" fill="none" stroke="#fff" strokeWidth="3" opacity="0.92" />
            <g transform="translate(480 334)">
              <ellipse cx="8" cy="3" rx="8" ry="3" fill="none" stroke={ACCENT} strokeWidth="1.8" />
              <path d="M0 3 v12 a8 3 0 0 0 16 0 v-12" fill="none" stroke={ACCENT} strokeWidth="1.8" />
            </g>
            {/* neck and head */}
            <rect x="482" y="266" width="14" height="22" rx="6" fill={SKIN_DARK} />
            <circle cx="489" cy="250" r="27" fill={SKIN} />
            <path d="M462 246 q 2 -30 30 -30 q 26 2 25 30 q -8 -12 -26 -14 q -16 0 -29 14 z" fill="#2a1f1c" />
            <path d="M463 240 q 26 -12 54 0" fill="none" stroke="#0e7c70" strokeWidth="6" strokeLinecap="round" />
            <circle cx="510" cy="252" r="5" fill={SKIN_DARK} />
            <motion.ellipse
              cx="476"
              cy="252"
              rx="2.6"
              ry="3.2"
              fill={INK}
              animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1] }}
              transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.92, 0.96, 1] }}
              style={{ transformOrigin: '476px 252px', transformBox: 'view-box' }}
            />
            <motion.path
              d="M470 264 q 6 5 12 0"
              fill="none"
              stroke={INK}
              strokeWidth="2"
              strokeLinecap="round"
              initial={false}
              animate={{ d: phase === 'done' ? 'M468 262 q 8 9 16 0' : 'M470 264 q 6 5 12 0' }}
            />
            <circle cx="471" cy="259" r="3" fill="#e58a6b" opacity="0.5" />
          </motion.g>

          {/* the squeegee: pole, telescoped inner section and blade */}
          <motion.path d={rig.pole} stroke="#6b615d" strokeWidth="5" strokeLinecap="round" />
          <motion.path d={rig.poleInner} stroke="#9b918d" strokeWidth="3.5" strokeLinecap="round" />

          {/* front arm and hand (over the pole) */}
          <motion.path d={rig.armF} stroke={ACCENT} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <motion.circle cx={rig.hfx} cy={rig.hfy} r="7.5" fill={SKIN} />
        </motion.g>

        <Blade tx={tx} ty={ty} wiping={active >= 0} />
      </svg>

      <div className="nx-scene__cap">
        <motion.span key={phase} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} aria-live="polite">
          {CAPTION[phase]}
        </motion.span>
        <span className="nx-scene__steps" aria-hidden="true">
          {[0, 1, 2, 3].map(i => (
            <i key={i} className={i <= stepIdx ? 'on' : undefined} />
          ))}
        </span>
      </div>
    </div>
  );
}

function Blade({ tx, ty, wiping }: { tx: MotionValue<number>; ty: MotionValue<number>; wiping: boolean }) {
  const x = useTransform(tx, v => v - 5);
  const y = useTransform(ty, v => v - 21);
  const fx = useTransform(tx, v => v + 9);
  return (
    <g>
      {/* foam on the dirty side, ahead of the blade */}
      <motion.g style={{ x: fx, y: ty, opacity: wiping ? 1 : 0 }}>
        {[[0, -12, 3.5], [5, -2, 4.5], [1, 9, 3], [9, 4, 2.5], [8, -10, 2]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" stroke="#bfe5de" strokeWidth="1" />
        ))}
      </motion.g>
      <motion.g style={{ x, y }}>
        <rect width="10" height="42" rx="4" fill="#0e7c70" />
        <rect x="-2" y="-1" width="4" height="44" rx="2" fill={INK} />
        <rect x="4" y="17" width="10" height="8" rx="2" fill="#0b5d57" />
      </motion.g>
    </g>
  );
}

function T({ x, y, w, name, color, head, rows, delay }: { x: number; y: number; w: number; name: string; color: string; head: string[]; rows: string[][]; delay: number }) {
  const cw = w / head.length;
  return (
    <motion.g
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      style={{ transformOrigin: `${x + w / 2}px ${y}px`, transformBox: 'view-box' }}
    >
      <text x={x} y={y - 6} className="nx-scene__label" fill={color}>{name}</text>
      <rect x={x} y={y} width={w} height="20" rx="5" fill={color} />
      {head.map((h, i) => (
        <text key={h} x={x + 5 + i * cw} y={y + 14} className="nx-scene__th" fill="#fff" style={{ fontSize: 9 }}>{h}</text>
      ))}
      {rows.map((r, ri) => (
        <g key={ri}>
          <rect x={x} y={y + 22 + ri * 19} width={w} height="17" rx="4" fill="#fff" stroke="#f8e9df" />
          {r.map((c, ci) => (
            <text key={ci} x={x + 5 + ci * cw} y={y + 34 + ri * 19} className="nx-scene__mono" fill={ci === 0 ? '#a5300a' : '#2e2826'} fontWeight={ci === 0 ? 700 : 400} style={{ fontSize: 9.5 }}>
              {c}
            </text>
          ))}
        </g>
      ))}
    </motion.g>
  );
}

function PolishedTables() {
  return (
    <g>
      <T x={TX0} y={110} w={160} name="Students" color="#1d4ed8" head={['StudentID', 'Name', 'Dept']} rows={[['S1', 'Alice', 'CS'], ['S2', 'Bob', 'CS'], ['S3', 'Carol', 'Math'], ['S4', 'Dave', 'CS']]} delay={0} />
      <T x={TX0 + 178} y={110} w={162} name="Departments" color="#a21caf" head={['Dept', 'DeptHead']} rows={[['CS', 'Dr. Smith'], ['Math', 'Dr. Jones']]} delay={0.15} />
      <T x={TX0 + 178} y={204} w={162} name="Enrolment" color="#0e7c70" head={['Student', 'Course', 'Grade']} rows={[['S1', 'C1', 'A'], ['S1', 'C2', 'B'], ['S2', 'C1', 'A'], ['S3', 'C3', 'A']]} delay={0.3} />
      {/* links */}
      <motion.path
        d={`M ${TX0 + 160} 152 C ${TX0 + 170} 152, ${TX0 + 168} 136, ${TX0 + 178} 136`}
        stroke="#9b918d"
        strokeWidth="1.6"
        fill="none"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      />
      <motion.path
        d={`M ${TX0 + 160} 140 C ${TX0 + 172} 160, ${TX0 + 166} 230, ${TX0 + 178} 236`}
        stroke="#9b918d"
        strokeWidth="1.6"
        fill="none"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.75, duration: 0.5 }}
      />
    </g>
  );
}
