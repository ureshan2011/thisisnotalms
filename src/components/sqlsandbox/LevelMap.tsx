import { Check, Star } from 'lucide-react';
import { LEVELS } from '../../lib/sqlSandbox/levels';
import type { Profile } from '../../lib/sqlSandbox/progress';
import type { Theme } from '../../lib/sqlSandbox/themes';

// The path. Every level is open, so anyone who already knows a bit can jump
// ahead; the next one to do is simply the one that stands out.

export default function LevelMap({ profile, theme, onOpen }: { profile: Profile; theme: Theme; onOpen: (id: string) => void }) {
  const next = LEVELS.find(l => !profile.levels[l.id]);
  const done = LEVELS.filter(l => profile.levels[l.id]).length;

  return (
    <div className="sb-map">
      <div className="sb-map__intro">
        <h2>
          Zero to SQL<span className="bt-stop">.</span>
        </h2>
        <p>
          You run <strong>{theme.business}</strong>. Eight short levels, about ten minutes each. {done === 0 ? 'Start at 1.' : done === LEVELS.length ? 'All done. Try the challenges.' : `${done} of 8 done.`}
        </p>
        <div className="sb-meter" aria-label={`${done} of 8 levels done`}>
          <span style={{ width: `${(done / LEVELS.length) * 100}%` }} />
        </div>
      </div>

      <ol className="sb-path">
        {LEVELS.map(l => {
          const d = profile.levels[l.id];
          const steps = l.steps(theme);
          const doneSteps = steps.filter(s => profile.steps[`${l.id}.${s.id}`]).length;
          const isNext = next?.id === l.id;
          return (
            <li key={l.id} className={`sb-node ${d ? 'is-done' : ''} ${isNext ? 'is-next' : ''}`}>
              <button type="button" className="sb-node__btn" onClick={() => onOpen(l.id)}>
                <span className="sb-node__dot" aria-hidden="true">
                  {d ? <Check size={20} strokeWidth={3} /> : l.n}
                </span>
                <span className="sb-node__body">
                  <span className="sb-node__title">{l.title}</span>
                  <span className="sb-node__tag">{l.tagline}</span>
                  <span className="sb-node__meta">
                    {d ? (
                      <span className="sb-stars" aria-label={`${d.stars} of 3 stars`}>
                        {[1, 2, 3].map(i => (
                          <Star key={i} size={14} className={i <= d.stars ? 'on' : ''} fill={i <= d.stars ? 'currentColor' : 'none'} />
                        ))}
                      </span>
                    ) : doneSteps > 0 ? (
                      `${doneSteps} of ${steps.length} steps`
                    ) : isNext ? (
                      'Up next'
                    ) : steps[0]?.kind === 'boss' ? (
                      'One build, on your own'
                    ) : (
                      `${steps.length} steps`
                    )}
                  </span>
                </span>
                {isNext && <span className="sb-node__go">{doneSteps ? 'Continue' : 'Start'} →</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
