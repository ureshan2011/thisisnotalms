// ─── The three models, on one set of dots ─────────────────────────────────
// Used twice: in the hero, before the reader knows what any of it means, and
// again at the end when they have to choose between them. Seeing the same
// picture in both places is the point — it turns into the thing they
// remember, and by the second showing it has words attached.

const CLOUD: [number, number][] = [
  [10, 78], [20, 70], [26, 60], [34, 62], [40, 50],
  [48, 44], [55, 46], [62, 32], [70, 28], [78, 20],
  [84, 26], [92, 12],
];

const PANEL = 150;
const INSET = 16;
const at = (v: number) => INSET + (v / 100) * (PANEL - INSET * 2);

function Panel({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div>
      <svg viewBox={`0 0 ${PANEL} ${PANEL}`} width="100%" style={{ display: 'block' }} aria-hidden="true">
        <rect x="1" y="1" width={PANEL - 2} height={PANEL - 2} rx="14" fill="var(--paper-50)" stroke="var(--border-subtle)" />
        {children}
        {CLOUD.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={at(cx)} cy={at(cy)} r="3.4" fill="var(--ink-900)" />
        ))}
      </svg>
      <p
        style={{
          marginTop: 9,
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--ink-600)',
          textAlign: 'center',
          lineHeight: 1.35,
        }}
      >
        {caption}
      </p>
    </div>
  );
}

export default function ModelShapes({ captions }: { captions: [string, string, string] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
      <Panel caption={captions[0]}>
        <line x1={at(4)} y1={at(78)} x2={at(96)} y2={at(14)} stroke="var(--accent-500)" strokeWidth="2.5" strokeLinecap="round" />
      </Panel>

      <Panel caption={captions[1]}>
        <line x1={at(46)} y1={at(0)} x2={at(46)} y2={at(100)} stroke="var(--accent-500)" strokeWidth="2.5" />
        <line x1={at(46)} y1={at(46)} x2={at(100)} y2={at(46)} stroke="var(--accent-500)" strokeWidth="2.5" />
      </Panel>

      <Panel caption={captions[2]}>
        {[38, 42, 46, 50, 54, 58].map(v => (
          <line key={`v${v}`} x1={at(v)} y1={at(0)} x2={at(v)} y2={at(100)} stroke="var(--accent-300)" strokeWidth="1.4" opacity="0.6" />
        ))}
        {[38, 44, 46, 52, 58].map(h => (
          <line key={`h${h}`} x1={at(40)} y1={at(h)} x2={at(100)} y2={at(h)} stroke="var(--accent-300)" strokeWidth="1.4" opacity="0.6" />
        ))}
      </Panel>
    </div>
  );
}
