import { useState } from 'react';

// ─── The average of 1s and 0s is a share ──────────────────────────────────
// The one idea the whole "compare groups" step rests on, shown on ten
// customers before any code. Click a customer to flip them between stayed
// (0) and left (1); the sum, the division and the percentage all update.
// Once a student has seen 3 ÷ 10 = 0.3 = 30%, .mean() on Churn stops being
// a strange thing to do to a yes/no column.

const START = [0, 1, 0, 0, 1, 0, 0, 0, 1, 0];

export default function ShareOfOnes() {
  const [churn, setChurn] = useState(START);
  const left = churn.reduce((a, b) => a + b, 0);
  const flip = (i: number) => setChurn(cs => cs.map((v, k) => (k === i ? 1 - v : v)));

  return (
    <div className="dt-panel dt-ones">
      <p className="bt-sim__label">Ten customers. Click one to change whether they left.</p>
      <div className="dt-ones__row" role="group" aria-label="Ten customers">
        {churn.map((v, i) => (
          <button
            key={i}
            type="button"
            className={v ? 'is-left' : undefined}
            aria-pressed={v === 1}
            aria-label={`Customer ${i + 1}: ${v ? 'left (1)' : 'stayed (0)'}`}
            onClick={() => flip(i)}
          >
            <b>{v}</b>
            <span>{v ? 'left' : 'stayed'}</span>
          </button>
        ))}
      </div>
      <div className="dt-ones__sum" aria-live="polite">
        <p>
          <span className="dt-ones__k">Add them up</span>
          <code>{churn.join(' + ')} = {left}</code>
        </p>
        <p>
          <span className="dt-ones__k">Divide by how many</span>
          <code>{left} ÷ 10 = {(left / 10).toFixed(1)}</code>
        </p>
        <p className="dt-ones__so">
          So the average of the Churn column is <b>{(left / 10).toFixed(1)}</b>, which is the same thing as saying{' '}
          <b>{left * 10}% of these customers left</b>.
        </p>
      </div>
    </div>
  );
}
