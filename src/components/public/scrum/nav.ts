// ─── Walking round the furniture ──────────────────────────────────────────
// The miniatures used to walk in a straight line to wherever the timeline
// sent them, which took them straight through desks and the planning table.
// This is a small grid path-finder: the studio floor as a grid of 0.15-unit
// cells, every piece of furniture stamped onto it with a margin for the
// miniature's body, A* across it, then the path pulled tight so people walk
// in natural straight lines between the corners they actually need.
//
// Runs only when an actor's destination changes — a few times per phase —
// so it costs nothing per frame.

import { SPOT, TABLE_R, type V2 } from './timeline';

const CELL = 0.15;
const X0 = -7.5;
const X1 = 7.5;
const Z0 = -3.15; // the back wall, and the boards hanging on it
const Z1 = 5.6;
const NX = Math.ceil((X1 - X0) / CELL) + 1;
const NZ = Math.ceil((Z1 - Z0) / CELL) + 1;
/** Roughly a miniature's shoulder half-width. */
const PAD = 0.2;

interface Rect { c: V2; hx: number; hz: number }
interface Circle { c: V2; r: number }

const RECTS: Rect[] = [
  ...SPOT.desks.map(c => ({ c, hx: 0.55, hz: 0.3 })),
  { c: SPOT.poDesk, hx: 0.45, hz: 0.3 },
  { c: SPOT.retroBoard, hx: 0.12, hz: 1.2 },
];
const CIRCLES: Circle[] = [
  { c: SPOT.table, r: TABLE_R },
  { c: SPOT.pedestal, r: 0.62 },
];

function solid(x: number, z: number): boolean {
  if (x < X0 || x > X1 || z < Z0 || z > Z1) return true;
  for (const r of RECTS) {
    if (Math.abs(x - r.c[0]) <= r.hx + PAD && Math.abs(z - r.c[1]) <= r.hz + PAD) return true;
  }
  for (const c of CIRCLES) {
    if (Math.hypot(x - c.c[0], z - c.c[1]) <= c.r + PAD) return true;
  }
  return false;
}

const GRID = new Uint8Array(NX * NZ);
for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) GRID[j * NX + i] = solid(X0 + i * CELL, Z0 + j * CELL) ? 1 : 0;

const toCell = (p: V2): [number, number] => [
  Math.min(NX - 1, Math.max(0, Math.round((p[0] - X0) / CELL))),
  Math.min(NZ - 1, Math.max(0, Math.round((p[1] - Z0) / CELL))),
];
const toWorld = (i: number, j: number): V2 => [X0 + i * CELL, Z0 + j * CELL];
const free = (i: number, j: number) => i >= 0 && j >= 0 && i < NX && j < NZ && GRID[j * NX + i] === 0;

/** Nearest walkable cell, for a start or goal that sits against furniture
 *  (people stand right up to the table, so their spot is inside its margin). */
function nearestFree(i: number, j: number): [number, number] {
  if (free(i, j)) return [i, j];
  for (let r = 1; r < 30; r++) {
    let best: [number, number] | null = null;
    let bestD = Infinity;
    for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
      if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
      if (!free(i + di, j + dj)) continue;
      const d = di * di + dj * dj;
      if (d < bestD) { bestD = d; best = [i + di, j + dj]; }
    }
    if (best) return best;
  }
  return [i, j];
}

/** Whether the straight segment a→b stays off every obstacle. */
export function lineFree(a: V2, b: V2): boolean {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const steps = Math.max(1, Math.ceil(len / (CELL * 0.5)));
  for (let s = 0; s <= steps; s++) {
    const f = s / steps;
    const [i, j] = toCell([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
    if (!free(i, j)) return false;
  }
  return true;
}

// A binary heap keyed on f-score, because a plain array scan over six
// thousand cells is noticeably slower when eight people move at once.
class Heap {
  private a: number[] = [];
  constructor(private f: Float32Array) {}
  get size() { return this.a.length; }
  push(n: number) {
    const a = this.a; a.push(n);
    let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (this.f[a[p]] <= this.f[a[i]]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; }
  }
  pop(): number {
    const a = this.a; const top = a[0]; const last = a.pop()!;
    if (a.length) {
      a[0] = last; let i = 0;
      for (;;) {
        const l = i * 2 + 1, r = l + 1; let m = i;
        if (l < a.length && this.f[a[l]] < this.f[a[m]]) m = l;
        if (r < a.length && this.f[a[r]] < this.f[a[m]]) m = r;
        if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

/** Waypoints from `from` to `to`, not including `from`, always ending at
 *  `to` exactly. A straight line when nothing is in the way. */
export function findPath(from: V2, to: V2): V2[] {
  const [si, sj] = nearestFree(...toCell(from));
  const [gi, gj] = nearestFree(...toCell(to));
  const start = toWorld(si, sj);
  const goal = toWorld(gi, gj);
  if (lineFree(start, goal)) return [to];

  const N = NX * NZ;
  const g = new Float32Array(N).fill(Infinity);
  const f = new Float32Array(N).fill(Infinity);
  const came = new Int32Array(N).fill(-1);
  const closed = new Uint8Array(N);
  const s = sj * NX + si;
  const e = gj * NX + gi;
  const h = (i: number, j: number) => {
    const dx = Math.abs(i - gi), dz = Math.abs(j - gj);
    return Math.max(dx, dz) + (Math.SQRT2 - 1) * Math.min(dx, dz);
  };
  g[s] = 0; f[s] = h(si, sj);
  const open = new Heap(f);
  open.push(s);
  let found = false;
  while (open.size) {
    const cur = open.pop();
    if (cur === e) { found = true; break; }
    if (closed[cur]) continue;
    closed[cur] = 1;
    const ci = cur % NX, cj = (cur - ci) / NX;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue;
      const ni = ci + di, nj = cj + dj;
      if (!free(ni, nj)) continue;
      // No cutting a corner between two blocked cells.
      if (di && dj && (!free(ci + di, cj) || !free(ci, cj + dj))) continue;
      const n = nj * NX + ni;
      if (closed[n]) continue;
      const ng = g[cur] + (di && dj ? Math.SQRT2 : 1);
      if (ng < g[n]) { g[n] = ng; f[n] = ng + h(ni, nj); came[n] = cur; open.push(n); }
    }
  }
  if (!found) return [to];

  const cells: V2[] = [];
  for (let c = e; c !== -1; c = came[c]) { const ci = c % NX; cells.push(toWorld(ci, (c - ci) / NX)); }
  cells.reverse();

  // Pull the path tight: from each corner, jump to the farthest point that
  // is still in straight view.
  const out: V2[] = [];
  let anchor = cells[0];
  let k = 0;
  while (k < cells.length - 1) {
    let far = k + 1;
    for (let m = cells.length - 1; m > k + 1; m--) if (lineFree(anchor, cells[m])) { far = m; break; }
    out.push(cells[far]);
    anchor = cells[far];
    k = far;
  }
  out[out.length - 1] = to;
  return out;
}
