import { useState } from 'react';

// ─── The sales performance loop, run for a year ───────────────────────────
// The course's worked example is a closed loop: inadequate selling effort
// feeds out-of-date procedures, which produce poor performance, which is
// reported back through incorrect information to poor sales management,
// which is itself a cause of the inadequate effort. The loop closes on
// itself, so a fix applied to the output alone is undone by the loop.
//
// Reading that as prose, most people agree and then go on intervening at the
// output anyway, because the event-layer fix is the one that shows a result
// this quarter. So the argument is easier to make as twelve months of it:
// pushing the team harder is the best-looking line until month four and the
// worst line by month twelve.
//
// The three series are hand-authored rather than simulated from a model.
// A real system-dynamics model would need parameters nobody in Lesson 1 can
// yet interrogate, and a curve a student cannot argue with teaches less than
// one they can.

type Move = 'none' | 'effort' | 'reporting';

const MOVES: { key: Move; title: string; blurb: string; layer: string }[] = [
  {
    key: 'none',
    title: 'Leave it alone',
    blurb: 'Watch the loop run with nothing changed. The baseline everything else is judged against.',
    layer: 'No intervention',
  },
  {
    key: 'effort',
    title: 'Push the sales team harder',
    blurb: 'Targets raised, activity monitored weekly. Acts on the output of the loop.',
    layer: 'Events layer',
  },
  {
    key: 'reporting',
    title: 'Fix what management is told',
    blurb: 'Rebuild the reporting so the numbers reaching managers are the real ones. Acts on the structure.',
    layer: 'Structures layer',
  },
];

// Sales performance, indexed to 100 at month zero.
const SERIES: Record<Move, number[]> = {
  none: [100, 97, 94, 91, 89, 87, 85, 83, 82, 81, 80, 79, 78],
  effort: [100, 105, 109, 111, 110, 106, 101, 96, 92, 88, 86, 84, 83],
  reporting: [100, 99, 97, 96, 96, 98, 101, 105, 109, 112, 115, 118, 120],
};

const READOUT: Record<Move, { head: string; body: string }> = {
  none: {
    head: 'Down 22 points in a year',
    body: 'Nothing here is anybody’s fault in particular, which is what makes it a system problem. Each part is behaving reasonably given what it is told, and the loop still runs downhill.',
  },
  effort: {
    head: 'Up 11, then down 17',
    body: 'Four good months. The effort is real and the numbers move, but nothing about the procedures or the reporting has changed, so the loop pulls the line back through the baseline and keeps going. This is the fix that gets approved, because the review happens in month three.',
  },
  reporting: {
    head: 'Down 4, then up 24',
    body: 'Worse before better: rebuilding the reporting costs a quarter and produces no visible sales while it happens. Then management starts acting on numbers that are true, the procedures get updated for the right reasons, and the loop runs the other way.',
  },
};

// Chart frame, in SVG units.
const W = 520;
const H = 236;
const PAD = { t: 18, r: 46, b: 30, l: 36 };
const PW = W - PAD.l - PAD.r;
const PH = H - PAD.t - PAD.b;
const Y_MIN = 70;
const Y_MAX = 125;

const px = (m: number) => PAD.l + (m / 12) * PW;
const py = (v: number) => PAD.t + PH - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * PH;
const path = (vals: number[]) => vals.map((v, m) => `${m === 0 ? 'M' : 'L'}${px(m)} ${py(v)}`).join(' ');

export default function FeedbackLoopSim() {
  const [move, setMove] = useState<Move>('none');
  const readout = READOUT[move];
  const end = SERIES[move][12];

  return (
    <div className="bt-sim">
      <div className="bt-sim__grid">
        <div>
          <p className="bt-sim__label">Choose one intervention</p>
          <ul className="bt-sim__choices">
            {MOVES.map(m => (
              <li key={m.key}>
                <button type="button" className="bt-sim__choice" aria-pressed={move === m.key} onClick={() => setMove(m.key)}>
                  <b>{m.title}</b>
                  <span>{m.blurb}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="bt-counter" style={{ marginTop: 22 }} aria-live="polite">
            <b className="bt-tnum">{end}</b>
            <span>Sales performance after twelve months, against 100 at the start. {MOVES.find(m => m.key === move)!.layer}.</span>
          </div>
        </div>

        <div className="bt-sim__stage">
          {/* The loop itself, with a ring on the point being intervened at. */}
          <svg viewBox="0 0 520 150" aria-label="The sales loop: selling effort feeds out-of-date procedures, producing poor performance; incorrect sales information travels back to poor sales management, which drives the effort again.">
            <defs>
              <marker id="fl-arrow" markerWidth="9" markerHeight="9" refX="7.2" refY="3.4" orient="auto">
                <path d="M0 0 L8 3.4 L0 6.8 z" fill="var(--ink-300)" />
              </marker>
            </defs>

            {([
              { x: 8, key: 'effort', cap: 'INPUT', label: 'Inadequate selling effort' },
              { x: 190, key: 'proc', cap: 'PROCESSING', label: 'Out-of-date procedures' },
              { x: 372, key: 'perf', cap: 'OUTPUT', label: 'Poor sales performance' },
            ] as const).map(box => {
              const lit = move === 'effort' && box.key === 'effort';
              return (
                <g key={box.key}>
                  <rect x={box.x} y="16" width="140" height="52" rx="12"
                    fill={lit ? 'var(--accent-500)' : 'var(--paper-0)'}
                    stroke={lit ? 'var(--accent-600)' : 'var(--border-subtle)'} strokeWidth={lit ? 1.6 : 1} />
                  <text x={box.x + 70} y="36" textAnchor="middle" fontSize="9" letterSpacing="1.4" fontWeight="700" fontFamily="var(--font-body)" fill={lit ? 'rgba(255,255,255,0.8)' : 'var(--accent-600)'}>{box.cap}</text>
                  <text x={box.x + 70} y="54" textAnchor="middle" fontSize="11" fontFamily="var(--font-body)" fill={lit ? '#fff' : 'var(--ink-600)'}>{box.label}</text>
                </g>
              );
            })}

            <line x1="150" y1="42" x2="188" y2="42" stroke="var(--ink-300)" strokeWidth="1.3" markerEnd="url(#fl-arrow)" />
            <line x1="332" y1="42" x2="370" y2="42" stroke="var(--ink-300)" strokeWidth="1.3" markerEnd="url(#fl-arrow)" />

            {/* The return path, through the information that reaches managers */}
            <rect x="190" y="98" width="140" height="40" rx="12"
              fill={move === 'reporting' ? 'var(--accent-50)' : 'var(--paper-0)'}
              stroke={move === 'reporting' ? 'var(--accent-300)' : 'var(--border-subtle)'} />
            <text x="260" y="123" textAnchor="middle" fontSize="11" fontFamily="var(--font-body)" fill={move === 'reporting' ? 'var(--accent-700)' : 'var(--ink-600)'}>Poor sales management</text>

            <path d="M442 68 L442 118 L332 118" fill="none" stroke="var(--ink-300)" strokeWidth="1.3" markerEnd="url(#fl-arrow)" />
            <path d="M190 118 L78 118 L78 70" fill="none" stroke="var(--ink-300)" strokeWidth="1.3" markerEnd="url(#fl-arrow)" />
            <text x="452" y="90" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">incorrect</text>
            <text x="452" y="101" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">information</text>

            {move === 'reporting' && (
              <circle cx="442" cy="93" r="13" fill="none" stroke="var(--accent-500)" strokeWidth="2.5" />
            )}
          </svg>
          <p className="bt-sim__caption">
            {move === 'none'
              ? 'The loop · nothing is being changed, so nothing is marked'
              : 'The loop · the highlight marks where this intervention lands'}
          </p>

          {/* Twelve months of it */}
          <svg viewBox={`0 0 ${W} ${H}`} style={{ marginTop: 10 }} aria-label={`Sales performance over twelve months. Leave it alone ends at ${SERIES.none[12]}. Push the team harder peaks at 111 in month three and ends at ${SERIES.effort[12]}. Fix the reporting dips to 96 and ends at ${SERIES.reporting[12]}.`}>
            {/* Gridlines and the baseline at 100 */}
            {[70, 85, 100, 115].map(v => (
              <g key={v}>
                <line x1={PAD.l} x2={W - PAD.r} y1={py(v)} y2={py(v)} stroke={v === 100 ? 'var(--ink-200)' : 'var(--border-subtle)'} strokeWidth={v === 100 ? 1 : 0.6} strokeDasharray={v === 100 ? '4 4' : undefined} />
                <text x={PAD.l - 8} y={py(v) + 3.5} textAnchor="end" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--ink-400)">{v}</text>
              </g>
            ))}
            {[0, 3, 6, 9, 12].map(m => (
              <text key={m} x={px(m)} y={H - 10} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">{m === 0 ? 'start' : `m${m}`}</text>
            ))}

            {/* The two series you did not choose, kept present but recessive
                so the comparison is available without competing. */}
            {MOVES.filter(m => m.key !== move).map(m => (
              <path key={m.key} d={path(SERIES[m.key])} fill="none" stroke="var(--ink-200)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            ))}

            <path d={path(SERIES[move])} fill="none" stroke="var(--accent-500)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            {SERIES[move].map((v, m) => (
              <circle key={m} cx={px(m)} cy={py(v)} r="3" fill="var(--accent-500)" stroke="var(--paper-50)" strokeWidth="1.5">
                <title>{`Month ${m}: ${v}`}</title>
              </circle>
            ))}
            <text x={px(12) + 8} y={py(end) + 4} fontSize="11.5" fontWeight="700" fontFamily="var(--font-display)" fill="var(--accent-600)">{end}</text>
          </svg>
          <p className="bt-sim__caption">Sales performance, indexed to 100 at the start · the two grey lines are the options you did not pick</p>
        </div>
      </div>

      <div className="bt-verdict" style={{ marginTop: 20 }} aria-live="polite">
        <strong>{readout.head}</strong>
        {readout.body}
      </div>
    </div>
  );
}
