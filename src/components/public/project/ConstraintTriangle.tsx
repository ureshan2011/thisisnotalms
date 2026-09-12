import { useState } from 'react';

// ─── The triple constraint, drawn as a triangle ───────────────────────────
// Scope, time and cost, with quality in the middle. Pin two corners and the
// third is the one absorbing every surprise the project meets, whether or
// not anybody has said so out loud.
//
// The drawing is the control: a pinned corner is filled and carries a solid
// edge, the free corner is accented and its two edges go dashed. Quality
// sits in the centre and dims as the free corner takes more strain, because
// that is the cost nobody puts on the change request.
//
// It deliberately cannot be made to pin all three. A student trying, and
// finding the third corner released instead, has met the constraint in the
// only way that sticks.

type Corner = 'scope' | 'time' | 'cost';

const CORNERS: { key: Corner; label: string; blurb: string; x: number; y: number; anchor: 'middle' | 'start' | 'end' }[] = [
  { key: 'scope', label: 'Scope', blurb: 'Everything in the specification ships.', x: 230, y: 34, anchor: 'middle' },
  { key: 'time', label: 'Time', blurb: 'The date is announced and cannot move.', x: 52, y: 250, anchor: 'middle' },
  { key: 'cost', label: 'Cost', blurb: 'The budget is signed and will not grow.', x: 408, y: 250, anchor: 'middle' },
];

const EDGES: [Corner, Corner][] = [['scope', 'time'], ['time', 'cost'], ['cost', 'scope']];

const GIVES: Record<Corner, { title: string; body: string }> = {
  scope: {
    title: 'Scope is what moves',
    body: 'A fixed date and a fixed budget mean the feature list is the variable, whether anybody says so or not. Handled openly this is exactly how an Agile backlog works: the sponsor gets the most valuable slice by the date. Handled quietly, it becomes features silently dropped in the last fortnight, which is the same outcome with the trust removed.',
  },
  time: {
    title: 'Time is what moves',
    body: 'Fixing scope and budget means the date is the release valve. This is defensible on a regulated or safety-critical build where an incomplete system is worse than a late one. It is indefensible when the date was promised to a customer and nobody has told them yet.',
  },
  cost: {
    title: 'Cost is what moves',
    body: 'Fixing scope and date leaves money as the only lever: more people, overtime, contractors. Beware the assumption underneath it, that effort converts cleanly into speed. Adding people to a late project has a ramp-up cost and a communication cost, and past a point it makes the project later.',
  },
};

const POINT: Record<Corner, [number, number]> = { scope: [230, 60], time: [78, 226], cost: [382, 226] };

export default function ConstraintTriangle() {
  const [fixed, setFixed] = useState<Corner[]>(['time', 'cost']);

  // Exactly two corners are held at any moment, so every click is a swap:
  // pinning the free corner releases the older of the two, and releasing a
  // pinned corner hands its place to whichever corner was moving.
  function toggle(key: Corner) {
    setFixed(prev => {
      if (!prev.includes(key)) return [prev[1], key];
      const kept = prev.find(k => k !== key)!;
      const wasMoving = CORNERS.find(c => !prev.includes(c.key))!.key;
      return [kept, wasMoving];
    });
  }

  const moving = CORNERS.find(c => !fixed.includes(c.key))!;
  const gives = GIVES[moving.key];

  return (
    <div className="bt-sim">
      <div className="bt-sim__grid">
        <div>
          <p className="bt-sim__label">Pin the corners the sponsor will not move</p>
          <ul className="bt-sim__choices">
            {CORNERS.map(c => {
              const isFixed = fixed.includes(c.key);
              return (
                <li key={c.key}>
                  <button type="button" className="bt-sim__choice" aria-pressed={isFixed} onClick={() => toggle(c.key)}>
                    <b>{c.label} · {isFixed ? 'pinned' : 'free to move'}</b>
                    <span>{isFixed ? c.blurb : 'This is the corner absorbing every surprise the project meets.'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="bt-note" style={{ marginTop: 18 }}>
            Only two can be pinned. Pin a third and the one you pinned first is released — which is the constraint,
            not a limitation of the drawing.
          </p>
        </div>

        <div className="bt-sim__stage">
          <svg viewBox="0 0 460 300" aria-label={`The triple constraint. ${fixed.map(f => CORNERS.find(c => c.key === f)!.label).join(' and ')} are pinned, so ${moving.label.toLowerCase()} is the corner that moves.`}>
            {/* Edges. An edge touching the free corner is dashed, because
                that is the side of the triangle that is actually elastic. */}
            {EDGES.map(([a, b]) => {
              const elastic = a === moving.key || b === moving.key;
              return (
                <line
                  key={`${a}-${b}`}
                  x1={POINT[a][0]} y1={POINT[a][1]} x2={POINT[b][0]} y2={POINT[b][1]}
                  stroke={elastic ? 'var(--accent-400)' : 'var(--ink-300)'}
                  strokeWidth={elastic ? 2 : 1.4}
                  strokeDasharray={elastic ? '7 6' : undefined}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Quality, carried in the middle. It is the thing that pays
                when somebody insists all three corners are fixed. */}
            <circle cx="230" cy="176" r="42" fill="var(--paper-0)" stroke="var(--border-subtle)" />
            <text x="230" y="172" textAnchor="middle" fontSize="12.5" fontWeight="700" fontFamily="var(--font-display)" fill="var(--ink-900)">Quality</text>
            <text x="230" y="188" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">the undeclared one</text>

            {CORNERS.map(c => {
              const isFixed = fixed.includes(c.key);
              const [cx, cy] = POINT[c.key];
              return (
                <g key={c.key}>
                  <circle
                    cx={cx} cy={cy} r="9"
                    fill={isFixed ? 'var(--ink-900)' : 'var(--accent-500)'}
                    stroke="var(--paper-50)" strokeWidth="3"
                  />
                  <text
                    x={c.x} y={c.y} textAnchor={c.anchor}
                    fontSize="14" fontWeight="800" fontFamily="var(--font-display)"
                    fill={isFixed ? 'var(--ink-900)' : 'var(--accent-600)'}
                  >
                    {c.label}
                  </text>
                  <text
                    x={c.x} y={c.y + 15} textAnchor={c.anchor}
                    fontSize="10" letterSpacing="1.2" fontFamily="var(--font-body)"
                    fill={isFixed ? 'var(--ink-400)' : 'var(--accent-500)'}
                  >
                    {isFixed ? 'PINNED' : 'MOVES'}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="bt-sim__caption">Dashed edges are the elastic ones · the filled dots are pinned</p>
        </div>
      </div>

      <div className="bt-verdict" style={{ marginTop: 20 }} aria-live="polite">
        <strong>{gives.title}</strong>
        {gives.body}
      </div>

      <p className="bt-note" style={{ marginTop: 16 }}>
        Nothing here lets you pin all three. When a sponsor insists on all three, quality becomes the undeclared
        variable — testing gets compressed, review gets skipped, and the cost arrives later as defects. Naming which
        corner moves is most of what a project manager does on day one.
      </p>
    </div>
  );
}
