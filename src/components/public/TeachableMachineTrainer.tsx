import { useState } from 'react';

// ─── A worked model of what Teachable Machine actually does ───────────────
// Not the real neural network — there is no camera, no MobileNet, nothing
// downloaded. It is arithmetic, chosen so it reacts the same way the real
// tool does to the one variable that matters most to a beginner: how many
// examples you gave each class, and how balanced they were.
//
// The predicted class always gets a flat "boost" on top of its own sample
// count, standing in for the real signal a genuine example carries. That
// boost is fixed, so a class with very few samples can still win — just not
// by much, and a lopsided class list can occasionally beat it outright. That
// is the one honest lesson: a model is only as good as what you showed it.

type ClassKey = 'rock' | 'paper' | 'scissors';

const CLASSES: { key: ClassKey; label: string; hint: string }[] = [
  { key: 'rock', label: 'Rock', hint: 'A closed fist' },
  { key: 'paper', label: 'Paper', hint: 'A flat, open hand' },
  { key: 'scissors', label: 'Scissors', hint: 'Two fingers out' },
];

const SIGNAL_BOOST = 5;

export default function TeachableMachineTrainer() {
  const [samples, setSamples] = useState<Record<ClassKey, number>>({ rock: 0, paper: 0, scissors: 0 });
  const [trained, setTrained] = useState(false);
  const [tested, setTested] = useState<ClassKey | null>(null);

  const total = samples.rock + samples.paper + samples.scissors;
  const ready = samples.rock > 0 && samples.paper > 0 && samples.scissors > 0;

  function addSample(k: ClassKey) {
    setSamples(s => ({ ...s, [k]: s[k] + 1 }));
    setTrained(false);
    setTested(null);
  }

  function reset() {
    setSamples({ rock: 0, paper: 0, scissors: 0 });
    setTrained(false);
    setTested(null);
  }

  const confidences = tested
    ? (() => {
        const raw = CLASSES.map(c => ({
          key: c.key,
          score: samples[c.key] + 1 + (c.key === tested ? SIGNAL_BOOST : 0),
        }));
        const sum = raw.reduce((a, r) => a + r.score, 0);
        return raw.map(r => ({ key: r.key, pct: Math.round((r.score / sum) * 100) }));
      })()
    : null;

  const predicted = confidences ? confidences.reduce((a, b) => (b.pct > a.pct ? b : a)) : null;
  const correct = !!(predicted && tested === predicted.key);

  let caption = 'Add at least one sample to every class, then train the model.';
  if (ready && !trained) caption = 'Samples added. Click Train Model to build a classifier from them.';
  if (trained && !tested) caption = 'Trained. Now click one of the "show it" buttons below to test it.';
  if (trained && tested && confidences && predicted) {
    const testedLabel = CLASSES.find(c => c.key === tested)!.label;
    const predictedLabel = CLASSES.find(c => c.key === predicted.key)!.label;
    const n = samples[tested];
    if (correct) {
      caption = n >= 8
        ? `Predicted ${predictedLabel} at ${predicted.pct}% — confident, because you gave it ${n} examples of ${testedLabel}.`
        : `Predicted ${predictedLabel} correctly, but only ${predicted.pct}% confident. ${n} example${n === 1 ? '' : 's'} of ${testedLabel} isn't much to learn from.`;
    } else {
      caption = `Predicted ${predictedLabel}, not ${testedLabel}. You gave it ${n} example${n === 1 ? '' : 's'} of ${testedLabel} against ${samples[predicted.key]} of ${predictedLabel} — that's what an unbalanced dataset does.`;
    }
  }

  return (
    <div className="tm-trainer">
      <p className="tm-trainer__note">
        A worked model of the idea, not the real neural network behind Teachable Machine. It reacts to how many
        samples you add for each class, the same way the real thing does.
      </p>

      <div className="tm-classes">
        {CLASSES.map(c => (
          <div key={c.key} className="tm-class">
            <p className="tm-class__label">{c.label}</p>
            <p className="tm-class__hint">{c.hint}</p>
            <div className="tm-class__bar">
              <i style={{ width: total ? `${(samples[c.key] / total) * 100}%` : '0%' }} />
            </div>
            <div className="tm-class__row">
              <span className="tm-class__count bt-tnum">{samples[c.key]} sample{samples[c.key] === 1 ? '' : 's'}</span>
              <button type="button" className="bt-btn bt-btn--sm bt-btn--tertiary" onClick={() => addSample(c.key)}>
                + Add a sample
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="tm-actions">
        <button type="button" className="bt-btn" disabled={!ready} onClick={() => { setTrained(true); setTested(null); }}>
          {trained ? 'Retrain model' : 'Train Model'}
          <span className="bt-btn__badge" aria-hidden="true">→</span>
        </button>
        <button type="button" className="bt-btn bt-btn--tertiary" onClick={reset}>
          Start over
        </button>
      </div>

      {trained && (
        <div className="tm-test">
          <p className="bt-eyebrow">Test it</p>
          <div className="tm-testrow">
            {CLASSES.map(c => (
              <button
                key={c.key}
                type="button"
                className={`bt-btn bt-btn--sm${tested === c.key ? '' : ' bt-btn--tertiary'}`}
                onClick={() => setTested(c.key)}
              >
                Show it {c.label.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {confidences && (
        <div className="tm-result">
          {confidences.map(c => (
            <div className="tm-result__row" key={c.key}>
              <span className="tm-result__label">{CLASSES.find(x => x.key === c.key)!.label}</span>
              <span className="tm-result__track">
                <i style={{ width: `${c.pct}%`, background: c.key === predicted?.key ? 'var(--accent-500)' : 'var(--accent-200)' }} />
              </span>
              <span className="tm-result__val bt-tnum">{c.pct}%</span>
            </div>
          ))}
        </div>
      )}

      <p className={`tm-say${trained && tested ? ' tm-say--done' : ''}`} aria-live="polite">{caption}</p>
    </div>
  );
}
