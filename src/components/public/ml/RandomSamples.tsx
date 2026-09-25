import { useState } from 'react';
import { MEMBERS, TreeGlyph } from './forestData';

// ─── Where the "random" comes from ────────────────────────────────────────
// The five trees above were made different by hand, so they could be read.
// A real forest makes them different by letting each tree learn from its own
// random handful of members. Three rows of twenty dots show that, and the
// shuffle button makes the point that the handful is drawn by chance.

const PER_TREE = 12;

function pick(): number[] {
  const idx = MEMBERS.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, PER_TREE);
}

// A fixed first draw, so the page looks the same every time it opens.
const FIRST = [
  [0, 2, 3, 5, 6, 8, 11, 12, 14, 15, 17, 19],
  [1, 2, 4, 6, 7, 9, 10, 13, 14, 16, 18, 19],
  [0, 1, 3, 4, 5, 8, 9, 11, 12, 15, 16, 18],
];

export default function RandomSamples() {
  const [draws, setDraws] = useState(FIRST);

  return (
    <div className="bt-sim">
      <p className="bt-sim__label">Each tree learns from a random {PER_TREE} of the 20 members</p>
      <div className="bt-rf-samples">
        {draws.map((d, t) => (
          <div key={t} className="bt-rf-samples__row">
            <span className="bt-rf-samples__who">
              <TreeGlyph size={24} />
              Tree {t + 1}
            </span>
            <ul aria-label={`Tree ${t + 1} learns from ${d.length} members: ${d.map(i => MEMBERS[i].name).join(', ')}`}>
              {MEMBERS.map((m, i) => (
                <li key={m.name} className={d.includes(i) ? 'is-in' : undefined} title={m.name} />
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="bt-sim__caption">Filled dot = this tree gets to see that member · empty = it never sees them</p>
      <button
        type="button"
        className="bt-btn bt-btn--md bt-btn--tertiary"
        style={{ marginTop: 14 }}
        onClick={() => setDraws(draws.map(pick))}
      >
        Pick again
        <span className="bt-btn__badge" aria-hidden="true">↺</span>
      </button>
    </div>
  );
}
