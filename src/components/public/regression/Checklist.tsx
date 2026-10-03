import { Check } from 'lucide-react';
import { STAGES, useLabProgress, type StageId } from './progress';

// ─── The lab's checklist, and the button that ticks one step ──────────────
// The list sits near the top so a student can see the whole job before they
// start. Each step of the page ends with a DoneButton for its own stage, and
// both read the same store, so ticking one updates the other.

export function Checklist() {
  const { done, clear } = useLabProgress();
  const count = STAGES.filter(s => done.has(s.id)).length;

  return (
    <div className="lr-check">
      <div className="lr-check__top">
        <p className="bt-eyebrow">Your checklist</p>
        <span className="bt-bar" aria-hidden="true">
          <i style={{ width: `${(count / STAGES.length) * 100}%` }} />
        </span>
        <span className="lr-check__count bt-tnum" aria-live="polite">
          {count} of {STAGES.length} done
        </span>
      </div>
      <ul className="lr-check__list">
        {STAGES.map((s, i) => {
          const on = done.has(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                data-done={on}
                aria-label={`Step ${i + 1}, ${s.label}${on ? ', done' : ''}. Go to this step.`}
                onClick={() => document.getElementById(`step-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                <span className="lr-check__tick" aria-hidden="true">
                  {on ? <Check size={12} strokeWidth={3} /> : i + 1}
                </span>
                <span>{s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="lr-check__note">
        Click a step to jump to it. Ticks are saved in this browser only, so you can stop and come back later.
        {count > 0 && (
          <>
            {' '}
            <button
              type="button"
              className="lr-replay"
              style={{ marginLeft: 6 }}
              onClick={clear}
            >
              Clear my ticks
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export function DoneButton({ stage, children }: { stage: StageId; children: string }) {
  const { done, toggle } = useLabProgress();
  const on = done.has(stage);
  return (
    <button type="button" className="lr-done" aria-pressed={on} onClick={() => toggle(stage)}>
      <span className="lr-done__box" aria-hidden="true">
        {on && <Check size={12} strokeWidth={3} />}
      </span>
      {on ? 'Done — nice' : children}
    </button>
  );
}
