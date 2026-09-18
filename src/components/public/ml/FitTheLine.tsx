import { useState } from 'react';

// ─── Move the line yourself, then let the computer do it ──────────────────
// Twelve flats, size against rent. Two sliders move a straight line over
// them, and the readout is how much money the line is wrong by in total.
//
// Dollars rather than squared error, because dollars mean something to
// somebody who has never met a residual, and they move the same way.
//
// "Let the computer do it" runs the same search the reader has been doing by
// hand, only faster: it tries thousands of lines and keeps the one that
// misses least. That is also what the Python playground on this page does,
// so the two agree to the cent. Real software uses a shortcut formula and
// squares the misses first, which lands on a slightly different line — the
// lesson says so in one sentence and leaves it there.

export const FLATS: [number, number][] = [
  [28, 410], [35, 430], [41, 505], [46, 520],
  [52, 585], [58, 600], [63, 665], [70, 690],
  [76, 760], [84, 780], [91, 870], [98, 880],
];

// The least-wrong line, found by trying every combination on a fine grid.
// The playground prints exactly these two numbers.
const BEST_SLOPE = 6.72;
const BEST_START = 222;

const W = 520;
const H = 320;
const PAD = { t: 18, r: 18, b: 42, l: 56 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;

const X_MIN = 20;
const X_MAX = 105;
const Y_MIN = 300;
const Y_MAX = 950;

const x = (size: number) => PAD.l + ((size - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
const y = (rent: number) => PAD.t + PLOT_H - ((rent - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;

export default function FitTheLine() {
  const [start, setStart] = useState(350);
  const [slope, setSlope] = useState(3);
  const [snapped, setSnapped] = useState(false);

  const at = (size: number) => start + slope * size;
  const misses = FLATS.map(([size, rent]) => rent - at(size));
  const total = misses.reduce((sum, m) => sum + Math.abs(m), 0);

  // The best line's own total, so the readout can say how far off they are
  // rather than just how big their number is.
  const bestTotal = FLATS.reduce(
    (sum, [size, rent]) => sum + Math.abs(rent - (BEST_START + BEST_SLOPE * size)),
    0,
  );
  const gap = total - bestTotal;
  const close = gap < 40;

  return (
    <div className="bt-sim">
      <div className="bt-sim__grid">
        <div>
          <p className="bt-sim__label">Move the line</p>
          <p className="bt-note" style={{ marginTop: 6, marginBottom: 4 }}>
            Get it as close to all twelve dots as you can.
          </p>

          <div className="bt-sim__range">
            <label htmlFor="fit-start" style={{ fontSize: 13.5, color: 'var(--ink-600)' }}>
              Starting rent: <b className="bt-tnum">${start}</b>
            </label>
            <input
              id="fit-start"
              type="range"
              min={100}
              max={500}
              step={2}
              value={start}
              onChange={e => {
                setSnapped(false);
                setStart(Number(e.target.value));
              }}
            />
          </div>

          <div className="bt-sim__range">
            <label htmlFor="fit-slope" style={{ fontSize: 13.5, color: 'var(--ink-600)' }}>
              Extra per square metre: <b className="bt-tnum">${slope.toFixed(2)}</b>
            </label>
            <input
              id="fit-slope"
              type="range"
              min={0}
              max={14}
              step={0.01}
              value={slope}
              onChange={e => {
                setSnapped(false);
                setSlope(Number(e.target.value));
              }}
            />
          </div>

          <div className="bt-counter" style={{ marginTop: 22 }}>
            <span className="bt-sim__label">How wrong the line is, in total</span>
            <b className="bt-tnum" style={{ fontSize: 34, color: close ? 'var(--green-500)' : 'var(--ink-900)' }}>
              ${Math.round(total).toLocaleString()}
            </b>
          </div>

          <p className="bt-note" style={{ marginTop: 10 }}>
            {snapped
              ? 'That is the best line. No other pair of numbers gets closer.'
              : close
                ? `Very close. The best possible is $${Math.round(bestTotal)}.`
                : `The best possible is $${Math.round(bestTotal)}. You are $${Math.round(gap)} away.`}
          </p>

          <button
            type="button"
            className="bt-btn bt-btn--md"
            style={{ marginTop: 16 }}
            onClick={() => {
              setStart(BEST_START);
              setSlope(BEST_SLOPE);
              setSnapped(true);
            }}
          >
            Let the computer do it
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </button>
        </div>

        <div className="bt-sim__stage">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`Twelve flats plotted by floor area against monthly rent, with a straight line through them. The line currently starts at ${start} dollars and adds ${slope.toFixed(2)} dollars for each square metre, missing the twelve rents by ${Math.round(total)} dollars in total.`}
          >
            {/* Grid and axes. Quiet, because the dots are the subject. */}
            {[300, 450, 600, 750, 900].map(v => (
              <g key={v}>
                <line x1={PAD.l} y1={y(v)} x2={W - PAD.r} y2={y(v)} stroke="var(--paper-300)" strokeWidth="1" />
                <text x={PAD.l - 10} y={y(v) + 4} textAnchor="end" fontSize="10.5" fill="var(--ink-400)" fontFamily="var(--font-mono)">
                  ${v}
                </text>
              </g>
            ))}
            {[30, 50, 70, 90].map(v => (
              <text key={v} x={x(v)} y={H - 20} textAnchor="middle" fontSize="10.5" fill="var(--ink-400)" fontFamily="var(--font-mono)">
                {v} m²
              </text>
            ))}
            <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10.5" fill="var(--ink-300)" fontFamily="var(--font-body)">
              floor area
            </text>

            {/* Each flat's miss, drawn as the gap it actually is. This is the
                part that makes "total miss" mean something. */}
            {FLATS.map(([size, rent]) => (
              <line
                key={`miss-${size}`}
                x1={x(size)}
                y1={y(rent)}
                x2={x(size)}
                y2={y(at(size))}
                stroke="var(--ink-300)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            ))}

            {/* The line itself. */}
            <line
              x1={x(X_MIN)}
              y1={y(at(X_MIN))}
              x2={x(X_MAX)}
              y2={y(at(X_MAX))}
              stroke={snapped ? 'var(--green-500)' : 'var(--accent-500)'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {FLATS.map(([size, rent]) => (
              <circle key={size} cx={x(size)} cy={y(rent)} r="5.5" fill="var(--ink-900)" />
            ))}
          </svg>
          <p className="bt-sim__caption">
            Each dotted line is how wrong the line is about that flat.
          </p>
        </div>
      </div>
    </div>
  );
}
