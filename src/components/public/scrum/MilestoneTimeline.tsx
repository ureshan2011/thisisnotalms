import type { MouseEvent } from 'react';
import { BLOCKS, MILESTONES, PHASES, blockOf, phaseAt, type PhaseKind } from './timeline';

// ─── The milestone timeline under the studio ──────────────────────────────
// Two rows. The top one is the whole run as one bar, cut into its five
// blocks (before Sprint 1, three Sprints, release) and coloured by what
// kind of time each stretch is — so a student sees at a glance that most of
// a Sprint is building, and the meetings are short. The bottom one names
// the milestones of the block the playhead is in, with the timebox under
// each, and every one of them is a button that jumps there.

const KIND_LABEL: [PhaseKind, string][] = [
  ['artefact', 'Product Backlog'],
  ['refine', 'Refinement & estimation'],
  ['event', 'Scrum event'],
  ['daily', 'Daily Scrum'],
  ['work', 'Building'],
];

export default function MilestoneTimeline({ t, onJump, guided, onGuided }: {
  t: number;
  onJump: (t: number) => void;
  guided: boolean;
  onGuided: (on: boolean) => void;
}) {
  const ph = phaseAt(t);
  const curBlock = blockOf(ph);
  const block = BLOCKS[curBlock];
  const milestones = MILESTONES.filter(m => m.block === curBlock);

  const seekIn = (b: (typeof BLOCKS)[number]) => (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    onJump(b.start + f * (b.end - b.start) + 0.01);
  };

  return (
    <div className="sst__tl">
      <div className="sst__tlhead">
        <p className="sst__tltitle">
          Timeline <span aria-hidden="true">·</span> <b>{block.label}</b>
        </p>
        <label className="sst__guide">
          <input type="checkbox" checked={guided} onChange={e => onGuided(e.target.checked)} />
          <span className="sst__switch" aria-hidden="true" />
          <span>Pause after each step so I can read</span>
        </label>
      </div>

      {/* The whole run, block by block. Click anywhere to go there. */}
      <div className="sst__tlbar">
        {BLOCKS.map(b => {
          const phases = PHASES.filter(p => blockOf(p) === b.n);
          const live = b.n === curBlock;
          const f = live ? (t - b.start) / (b.end - b.start) : 0;
          return (
            <div key={b.n} className={`sst__tlblock${live ? ' is-live' : ''}`} style={{ flexGrow: b.end - b.start }}>
              <div className="sst__tltrack" onClick={seekIn(b)} role="presentation">
                {phases.map(p => (
                  <span key={p.index} className={`sst__seg sst__seg--${p.kind}`} style={{ flexGrow: p.dur }} title={p.label} />
                ))}
                {live && <span className="sst__playhead" style={{ left: `${(f * 100).toFixed(2)}%` }} aria-hidden="true" />}
              </div>
              <button type="button" className="sst__tlblabel" onClick={() => onJump(b.start + 0.01)} aria-current={live ? 'step' : undefined}>
                {b.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* The milestones of the block the playhead is in. */}
      <div className="sst__msrow">
        <ol className="sst__ms" aria-label={`Milestones in ${block.label}`}>
          {milestones.map(m => {
            const state = t >= m.end ? 'done' : t >= m.start ? 'now' : 'next';
            const f = state === 'now' ? (t - m.start) / (m.end - m.start) : state === 'done' ? 1 : 0;
            return (
              <li key={`${m.label}-${m.start}`} data-state={state} data-kind={m.kind}>
                <button type="button" onClick={() => onJump(m.start + 0.01)} aria-current={state === 'now' ? 'step' : undefined}>
                  <span className="sst__msdot" aria-hidden="true" />
                  <span className="sst__mslabel">{m.label}</span>
                  <span className="sst__mssub">{m.sub}</span>
                  <span className="sst__msprog" aria-hidden="true"><span style={{ width: `${(f * 100).toFixed(1)}%` }} /></span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <ul className="sst__legend">
        {KIND_LABEL.map(([k, l]) => (
          <li key={k}><span className={`sst__seg sst__seg--${k}`} aria-hidden="true" />{l}</li>
        ))}
      </ul>
    </div>
  );
}
