// ─── Where the rule comes from ────────────────────────────────────────────
// The whole of "what is a model" in one picture. Two rows, same three boxes,
// and the coloured box — the rule — moves from the front of the row to the
// back of it. That swap is the entire idea, and it is easier to remember as
// a shape than as a paragraph.

const W = 620;
const ROW_H = 96;
const H = ROW_H * 2 + 52;

function Box({
  x,
  y,
  w,
  label,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={54}
        rx="12"
        fill={accent ? 'var(--accent-500)' : 'var(--paper-0)'}
        stroke={accent ? 'var(--accent-500)' : 'var(--ink-200)'}
        strokeWidth="1.5"
      />
      <text
        x={x + w / 2}
        y={sub ? y + 24 : y + 32}
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fontFamily="var(--font-display)"
        fill={accent ? '#fff' : 'var(--ink-900)'}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + 40}
          textAnchor="middle"
          fontSize="11"
          fontFamily="var(--font-body)"
          fill={accent ? 'var(--accent-100)' : 'var(--ink-400)'}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y + 27} x2={x + 22} y2={y + 27} stroke="var(--ink-300)" strokeWidth="1.5" />
      <path d={`M${x + 18} ${y + 23} L${x + 25} ${y + 27} L${x + 18} ${y + 31} Z`} fill="var(--ink-300)" />
    </g>
  );
}

export default function RuleVsExamples() {
  const gap = 30;
  const w1 = 178;
  const w2 = 150;
  const w3 = 150;
  const x1 = 4;
  const x2 = x1 + w1 + gap;
  const x3 = x2 + w2 + gap;

  const rowA = 26;
  const rowB = rowA + ROW_H + 26;

  return (
    <figure className="bt-figure">
      <div className="bt-figure__frame">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: 'block', maxWidth: 640, margin: '0 auto' }}
          role="img"
          aria-label="Two rows. In normal software the rule is written by a person and goes in at the start. In a model, examples go in and the rule comes out at the end."
        >
          <text x={x1} y={rowA - 8} fontSize="11" fontWeight="700" letterSpacing="1.4" fill="var(--ink-400)" fontFamily="var(--font-body)">
            NORMAL SOFTWARE
          </text>
          <Box x={x1} y={rowA} w={w1} label="A rule" sub="someone types it in" accent />
          <Arrow x={x1 + w1 + 3} y={rowA} />
          <Box x={x2} y={rowA} w={w2} label="A new customer" />
          <Arrow x={x2 + w2 + 3} y={rowA} />
          <Box x={x3} y={rowA} w={w3} label="An answer" />

          <text x={x1} y={rowB - 8} fontSize="11" fontWeight="700" letterSpacing="1.4" fill="var(--ink-400)" fontFamily="var(--font-body)">
            A MODEL
          </text>
          <Box x={x1} y={rowB} w={w1} label="1,000 old customers" sub="and what each one did" />
          <Arrow x={x1 + w1 + 3} y={rowB} />
          <Box x={x2} y={rowB} w={w2} label="The computer" />
          <Arrow x={x2 + w2 + 3} y={rowB} />
          <Box x={x3} y={rowB} w={w3} label="A rule" sub="it worked out" accent />
        </svg>
      </div>
      <figcaption>
        Same three boxes, and the coloured one has swapped ends. That is the difference.
      </figcaption>
    </figure>
  );
}
