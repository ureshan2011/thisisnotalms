import { useState } from 'react';

// ─── Fit the line yourself, then let the computer do it ───────────────────
// Twelve flats, size against monthly rent. Two sliders move a straight line
// over them, and the readout is the total miss in dollars — the money the
// line would be wrong by, added up across all twelve.
//
// Dollars rather than squared error on purpose. "Sum of squared residuals"
// is the real objective and it means nothing to somebody who has never met
// it; "you would be out by $310 in total" means something immediately, and
// it moves in the same direction, which is all the intuition needs to do.
// The page says plainly that the real method squares the misses and why.
//
// The point of making them drag it: by the time they press the button, they
// have felt that there is a best answer and that finding it by hand is
// tedious. That is the whole argument for fitting a model, and it lands in
// about forty seconds of sliding.
//
// The data is the same twelve flats as the Python playground further down
// the page, so the slope the button finds — $7.07 a square metre — is the
// number their own code prints.

export const FLATS: [number, number][] = [
  [28, 410], [35, 430], [41, 505], [46, 520],
  [52, 585], [58, 600], [63, 665], [70, 690],
  [76, 760], [84, 780], [91, 870], [98, 880],
];

// The least-squares answer, to two decimals. Worked out from the array above
// rather than typed in: see the playground, which prints exactly these.
const BEST_SLOPE = 7.07;
const BEST_START = 204;

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

          <div className="bt-sim__range">
            <label htmlFor="fit-start" style={{ fontSize: 13.5, color: 'var(--ink-600)' }}>
              Rent for a flat of no size at all: <b className="bt-tnum">${start}</b>
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
              Added for each extra square metre: <b className="bt-tnum">${slope.toFixed(2)}</b>
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
            <span className="bt-sim__label">Total miss, all twelve flats</span>
            <b className="bt-tnum" style={{ fontSize: 34, color: close ? 'var(--green-500)' : 'var(--ink-900)' }}>
              ${Math.round(total).toLocaleString()}
            </b>
          </div>

          <p className="bt-note" style={{ marginTop: 10 }}>
            {snapped
              ? 'This is the best straight line there is for these twelve flats. No other pair of numbers misses by less.'
              : close
                ? `Close. The best possible is $${Math.round(bestTotal)} — you are within $${Math.round(gap)} of it.`
                : `The best possible is $${Math.round(bestTotal)}. You are $${Math.round(gap)} above it.`}
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
            Twelve flats. Dotted lines are how far the rule is wrong about each one.
          </p>
        </div>
      </div>
    </div>
  );
}
