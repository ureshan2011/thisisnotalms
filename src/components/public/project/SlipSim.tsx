import { useState } from 'react';

// ─── Which slip actually costs you the launch ─────────────────────────────
// The single most useful thing a first project management class can install:
// two tasks slip by the same number of weeks and only one of them moves the
// launch date. Told as a sentence it sounds like a technicality. Watched on
// a schedule, with the launch line staying put and then suddenly moving when
// the float runs out, it is obvious and it stays learned.
//
// The schedule is the SecurePay NZ integration the cost-management lecture
// runs on, so a student meeting it again later is meeting the same project.
// Discovery → integration → security review → UAT is the critical path and
// carries no slack at all. Merchant onboarding documentation runs alongside
// and has four weeks of float, because UAT cannot start before week 11
// however early the documentation is finished.

type Target = 'integration' | 'docs';

const BASE_LAUNCH = 14;
const WEEKS = 20;

// Fixed frame. Task names live in the left gutter rather than above the
// bars, so the eye reads one row as one task.
const W = 560;
const H = 214;
const PAD = { t: 26, r: 26, b: 30, l: 132 };
const PW = W - PAD.l - PAD.r;
const ROW_H = 28;
const BAR_H = 19;

const wx = (week: number) => PAD.l + (week / WEEKS) * PW;

export default function SlipSim() {
  const [target, setTarget] = useState<Target>('integration');
  const [slip, setSlip] = useState(0);

  const integrationSlip = target === 'integration' ? slip : 0;
  const docsSlip = target === 'docs' ? slip : 0;

  const integrationEnd = 9 + integrationSlip;
  const reviewStart = integrationEnd;
  const reviewEnd = reviewStart + 2;
  const docsEnd = 7 + docsSlip;
  const uatStart = Math.max(reviewEnd, docsEnd);
  const launch = uatStart + 3;
  const moved = launch - BASE_LAUNCH;
  const floatLeft = Math.max(0, uatStart - docsEnd);

  const rows = [
    { name: 'Discovery', start: 0, end: 3, critical: true },
    { name: 'Gateway integration', start: 3, end: integrationEnd, critical: true },
    { name: 'Onboarding docs', start: 3, end: docsEnd, critical: docsSlip > 4, float: uatStart },
    { name: 'Security review', start: reviewStart, end: reviewEnd, critical: true },
    { name: 'User acceptance test', start: uatStart, end: launch, critical: true },
  ];

  let head = '';
  let body = '';
  if (slip === 0) {
    head = 'Nothing has slipped yet';
    body = 'Discovery, integration, security review and user acceptance test form a chain with no slack anywhere in it — the critical path. Onboarding documentation runs alongside it and finishes four weeks before anything needs it. Slide the weeks and watch which one the launch date cares about.';
  } else if (target === 'integration') {
    head = `Launch moved ${moved} week${moved === 1 ? '' : 's'}`;
    body = `Gateway integration is on the critical path, so it has nothing to give. Six weeks became ${6 + slip}, the security review started late, user acceptance testing started late, and the launch moved by exactly the ${slip} week${slip === 1 ? '' : 's'} that were lost. No amount of the documentation team finishing early buys any of it back.`;
  } else if (slip <= 4) {
    head = 'Launch has not moved';
    body = `Onboarding documentation has four weeks of float: user acceptance testing cannot begin before week ${uatStart} whatever the documentation does, because it is waiting on the security review. A ${slip}-week slip costs the project nothing and costs the task ${floatLeft} week${floatLeft === 1 ? '' : 's'} of its remaining slack. Worth knowing before you spend a weekend rescuing it.`;
  } else {
    head = `Launch moved ${moved} week${moved === 1 ? '' : 's'}`;
    body = `The float ran out at four weeks. Past that point onboarding documentation joins the critical path, and every further week it loses the project loses too. A task with float is not a task that cannot hurt you — it is a task that has a budget for going wrong, and this one has spent it.`;
  }

  return (
    <div className="bt-sim">
      <div className="bt-sim__grid">
        <div>
          <p className="bt-sim__label">Which task slips</p>
          <ul className="bt-sim__choices">
            <li>
              <button type="button" className="bt-sim__choice" aria-pressed={target === 'integration'} onClick={() => setTarget('integration')}>
                <b>Gateway integration</b>
                <span>Six weeks, on the critical path. The vendor’s sandbox is not behaving.</span>
              </button>
            </li>
            <li>
              <button type="button" className="bt-sim__choice" aria-pressed={target === 'docs'} onClick={() => setTarget('docs')}>
                <b>Onboarding documentation</b>
                <span>Four weeks, running alongside. The writer is off sick.</span>
              </button>
            </li>
          </ul>

          <div className="bt-sim__range">
            <label htmlFor="slip-weeks" className="bt-sim__label">Weeks lost · <span className="bt-tnum">{slip}</span></label>
            <input
              id="slip-weeks"
              type="range"
              min={0}
              max={6}
              step={1}
              value={slip}
              onChange={e => setSlip(Number(e.target.value))}
            />
          </div>

          <div className="bt-counter" style={{ marginTop: 22 }} aria-live="polite">
            <b className="bt-tnum">Week {launch}</b>
            <span>Launch date. {moved === 0 ? 'Unmoved from the plan.' : `${moved} week${moved === 1 ? '' : 's'} later than planned.`}</span>
          </div>
        </div>

        <div className="bt-sim__stage">
          <svg viewBox={`0 0 ${W} ${H}`} aria-label={`Schedule with five tasks. ${rows.map(r => `${r.name} runs week ${r.start} to ${r.end}`).join('; ')}. Launch is week ${launch}.`}>
            {/* Week gridlines, every four weeks */}
            {[0, 4, 8, 12, 16, 20].map(week => (
              <g key={week}>
                <line x1={wx(week)} x2={wx(week)} y1={PAD.t - 8} y2={H - PAD.b} stroke="var(--border-subtle)" strokeWidth="0.8" />
                <text x={wx(week)} y={H - 12} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--ink-400)">w{week}</text>
              </g>
            ))}

            {rows.map((r, i) => {
              const y = PAD.t + i * ROW_H;
              const hasFloat = r.float !== undefined && r.float > r.end;
              return (
                <g key={r.name}>
                  <text x={PAD.l - 12} y={y + BAR_H - 5} textAnchor="end" fontSize="10.5" fontFamily="var(--font-body)" fill="var(--ink-600)">{r.name}</text>
                  {/* Float, drawn as an open box: time this task may lose
                      before anything downstream notices. */}
                  {hasFloat && (
                    <rect
                      x={wx(r.end)} y={y} width={wx(r.float!) - wx(r.end)} height={BAR_H} rx="5"
                      fill="none" stroke="var(--ink-300)" strokeWidth="1" strokeDasharray="4 4"
                    />
                  )}
                  <rect
                    x={wx(r.start)} y={y} width={Math.max(wx(r.end) - wx(r.start), 3)} height={BAR_H} rx="5"
                    fill={r.critical ? 'var(--accent-500)' : 'var(--accent-200)'}
                  >
                    <title>{`${r.name}: week ${r.start} to ${r.end}`}</title>
                  </rect>
                </g>
              );
            })}

            {/* The launch line, and where it was planned to be. The two
                labels hang off opposite sides of their own lines, because a
                one-week slip puts them close enough to overlap. */}
            {moved !== 0 && (
              <g>
                <line x1={wx(BASE_LAUNCH)} x2={wx(BASE_LAUNCH)} y1={PAD.t - 14} y2={H - PAD.b} stroke="var(--ink-300)" strokeWidth="1.2" strokeDasharray="3 4" />
                <text x={wx(BASE_LAUNCH) - 6} y={PAD.t - 18} textAnchor="end" fontSize="9" letterSpacing="0.8" fontFamily="var(--font-body)" fill="var(--ink-400)">PLANNED</text>
              </g>
            )}
            <line x1={wx(launch)} x2={wx(launch)} y1={PAD.t - 14} y2={H - PAD.b} stroke="var(--ink-900)" strokeWidth="1.6" />
            <text
              x={moved === 0 ? wx(launch) : wx(launch) + 6}
              y={PAD.t - 18}
              textAnchor={moved === 0 ? 'middle' : 'start'}
              fontSize="9.5" fontWeight="700" letterSpacing="0.8" fontFamily="var(--font-display)" fill="var(--ink-900)"
            >
              LAUNCH
            </text>
          </svg>

          <ul className="bt-sim__legend">
            <li><span className="bt-sim__swatch" style={{ background: 'var(--accent-500)' }} aria-hidden="true" />On the critical path</li>
            <li><span className="bt-sim__swatch" style={{ background: 'var(--accent-200)' }} aria-hidden="true" />Has float</li>
            <li><span className="bt-sim__swatch" style={{ background: 'transparent', border: '1px dashed var(--ink-300)' }} aria-hidden="true" />Float remaining</li>
          </ul>
        </div>
      </div>

      <div className={`bt-verdict${slip > 0 && target === 'docs' && slip <= 4 ? ' bt-verdict--good' : ''}`} style={{ marginTop: 20 }} aria-live="polite">
        <strong>{head}</strong>
        {body}
      </div>
    </div>
  );
}
