// ─── Chen's notation, drawn from data ─────────────────────────────────────
// One small renderer for every diagram on /er-first-steps, so the five
// answers, the hero and the shape legend all draw the four shapes the same
// way. Nothing here is a picture of a diagram: each one is a list of
// entities, relationships and attributes with positions, and the shapes,
// lines and cardinality numbers are worked out from that.
//
// Only the four shapes the ER foundations lesson teaches are used — the
// rectangle, the ellipse, the underlined key ellipse and the diamond — plus
// 1, N and M on the relationship lines. Weak entities, multivalued and
// derived attributes and participation come later in the course, so they
// are deliberately not drawable here.
//
// `stage` lets an answer grow with the student's checking: 1 draws the
// entities, 2 adds their attributes, 3 adds the relationships, their
// numbers and any attribute that hangs off a diamond.

export type Card = '1' | 'N' | 'M';

export interface DiagramSpec {
  /** viewBox size. */
  w: number;
  h: number;
  /** Below this width the diagram scrolls sideways instead of shrinking
   *  its text too small to read. */
  minWidth: number;
  entities: { id: string; x: number; y: number }[];
  /** Each link is [entity, its number, flip]. `flip` moves the number to
   *  the other side of the line, for when two lines leave one entity close
   *  together and both numbers would otherwise land between them. */
  rels: { id: string; x: number; y: number; links: [string, Card, boolean?][] }[];
  /** `of` is the entity or relationship the attribute belongs to. */
  attrs: { label: string; x: number; y: number; of: string; key?: boolean }[];
}

const ENT_H = 50;
const REL_HH = 36;
const ATTR_RY = 21;

export const entityW = (label: string) => Math.max(110, label.length * 10.5 + 40);
export const relHW = (label: string) => Math.max(60, label.length * 5.6 + 26);
export const attrRX = (label: string) => Math.max(48, label.length * 3.6 + 16);

/** Where a cardinality number sits: on the line, just outside the entity's
 *  rectangle, nudged off the line so the line never runs through it. */
function cardPos(ex: number, ey: number, w: number, rx: number, ry: number, flip?: boolean) {
  const dx = rx - ex;
  const dy = ry - ey;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const toEdge = Math.min(
    ux === 0 ? Infinity : w / 2 / Math.abs(ux),
    uy === 0 ? Infinity : ENT_H / 2 / Math.abs(uy),
  );
  // Far enough out that a steep line doesn't park the number on the
  // rectangle's top or bottom edge.
  const along = toEdge + 24;
  // Perpendicular, always above a horizontal line and right of a vertical one.
  let nx = uy;
  let ny = -ux;
  if (ny > 0 || (ny === 0 && nx < 0)) {
    nx = -nx;
    ny = -ny;
  }
  if (flip) {
    nx = -nx;
    ny = -ny;
  }
  return { x: ex + ux * along + nx * 13, y: ey + uy * along + ny * 13 };
}

export function EntityShape({ x, y, label, fresh }: { x: number; y: number; label: string; fresh?: boolean }) {
  const w = entityW(label);
  return (
    <g className={fresh ? 'erd-fresh' : undefined}>
      <rect className="erd-ent" x={x - w / 2} y={y - ENT_H / 2} width={w} height={ENT_H} />
      <text className="erd-ent__t" x={x} y={y} dominantBaseline="central" textAnchor="middle">{label}</text>
    </g>
  );
}

export function RelShape({ x, y, label, fresh }: { x: number; y: number; label: string; fresh?: boolean }) {
  const hw = relHW(label);
  return (
    <g className={fresh ? 'erd-fresh' : undefined}>
      <polygon className="erd-rel" points={`${x},${y - REL_HH} ${x + hw},${y} ${x},${y + REL_HH} ${x - hw},${y}`} />
      <text className="erd-rel__t" x={x} y={y} dominantBaseline="central" textAnchor="middle">{label}</text>
    </g>
  );
}

export function AttrShape({ x, y, label, isKey, fresh }: { x: number; y: number; label: string; isKey?: boolean; fresh?: boolean }) {
  return (
    <g className={fresh ? 'erd-fresh' : undefined}>
      <ellipse className={`erd-attr${isKey ? ' erd-attr--key' : ''}`} cx={x} cy={y} rx={attrRX(label)} ry={ATTR_RY} />
      <text
        className={`erd-attr__t${isKey ? ' erd-attr__t--key' : ''}`}
        x={x}
        y={y}
        dominantBaseline="central"
        textAnchor="middle"
        textDecoration={isKey ? 'underline' : undefined}
      >
        {label}
      </text>
    </g>
  );
}

export default function ChenDiagram({ spec, stage = 3, label, freshFrom }: {
  spec: DiagramSpec;
  stage?: number;
  /** What the diagram says, for a screen reader. */
  label: string;
  /** The stage whose shapes have just appeared, so only they fade in. */
  freshFrom?: number;
}) {
  const pos = new Map<string, { x: number; y: number }>();
  spec.entities.forEach(e => pos.set(e.id, e));
  spec.rels.forEach(r => pos.set(r.id, r));
  const isRel = new Set(spec.rels.map(r => r.id));

  const showAttr = (of: string) => (isRel.has(of) ? stage >= 3 : stage >= 2);
  const attrStage = (of: string) => (isRel.has(of) ? 3 : 2);
  const fresh = (s: number) => freshFrom === s;

  const attrs = spec.attrs.filter(a => showAttr(a.of));
  const rels = stage >= 3 ? spec.rels : [];

  return (
    <svg
      className="erd"
      viewBox={`0 0 ${spec.w} ${spec.h}`}
      style={{ minWidth: spec.minWidth }}
      role="img"
      aria-label={label}
    >
      {/* Lines first, so every shape sits on top of the line ends. */}
      {attrs.map(a => {
        const o = pos.get(a.of)!;
        return (
          <line
            key={`al-${a.of}-${a.label}`}
            className={`erd-line${fresh(attrStage(a.of)) ? ' erd-fresh' : ''}`}
            x1={o.x} y1={o.y} x2={a.x} y2={a.y}
          />
        );
      })}
      {rels.flatMap(r =>
        r.links.map(([ent], i) => {
          const e = pos.get(ent)!;
          return (
            <line
              key={`rl-${r.id}-${ent}-${i}`}
              className={`erd-line erd-line--rel${fresh(3) ? ' erd-fresh' : ''}`}
              x1={e.x} y1={e.y} x2={r.x} y2={r.y}
            />
          );
        }),
      )}

      {attrs.map(a => (
        <AttrShape key={`a-${a.of}-${a.label}`} x={a.x} y={a.y} label={a.label} isKey={a.key} fresh={fresh(attrStage(a.of))} />
      ))}
      {rels.map(r => <RelShape key={r.id} x={r.x} y={r.y} label={r.id} fresh={fresh(3)} />)}
      {spec.entities.map(e => <EntityShape key={e.id} x={e.x} y={e.y} label={e.id} fresh={fresh(1)} />)}

      {rels.flatMap(r =>
        r.links.map(([ent, card, flip], i) => {
          const e = pos.get(ent)!;
          const p = cardPos(e.x, e.y, entityW(ent), r.x, r.y, flip);
          return (
            <text
              key={`c-${r.id}-${ent}-${i}`}
              className={`erd-card${fresh(3) ? ' erd-fresh' : ''}`}
              x={p.x}
              y={p.y}
              dominantBaseline="central"
              textAnchor="middle"
            >
              {card}
            </text>
          );
        }),
      )}
    </svg>
  );
}

/** One shape on its own, for the legend at the top of the lesson. */
export function ShapeSample({ kind, label }: { kind: 'entity' | 'attr' | 'key' | 'rel'; label: string }) {
  const w = 220;
  const h = 96;
  return (
    <svg className="erd erd--sample" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${label}, drawn in Chen's notation`}>
      {kind === 'entity' && <EntityShape x={w / 2} y={h / 2} label={label} />}
      {kind === 'rel' && <RelShape x={w / 2} y={h / 2} label={label} />}
      {(kind === 'attr' || kind === 'key') && <AttrShape x={w / 2} y={h / 2} label={label} isKey={kind === 'key'} />}
    </svg>
  );
}
