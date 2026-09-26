// ─── The Scrum studio's clock, and everything derived from it ─────────────
// MBI804 · Lesson 3 (/scrum-simulation). The 3D scene in StudioScene.tsx
// does no bookkeeping of its own: every frame it asks this file "what does
// the studio look like at t seconds?" and moves each miniature, card and
// drone part toward the answer. Pure functions of time mean the reader can
// scrub, jump to any milestone and change speed without the scene ever
// getting into a state the timeline did not describe.
//
// Each phase is also split into "beats" — the one thing happening right
// now, in a sentence. The same beat drives the caption over the stage, the
// highlighted step in the side panel and the spotlight ring in the scene,
// so what a student reads and what they are looking at are always the same
// thing.
//
// Facts — who attends what, the timeboxes, who owns which artefact — follow
// the 2020 Scrum Guide and agree with Lesson 2's ScrumCycle widget. The
// studio runs one-week Sprints of five working days, so Sprint Planning is
// about two hours, the Review about one, the Retrospective about 45 minutes:
// each is the Guide's one-month maximum scaled to a fifth. Backlog
// refinement and Planning Poker are shown as what they are: an ongoing
// activity and a common practice, not Scrum events.

export type PhaseKey =
  | 'intro'
  | 'backlog'
  | 'refinement'
  | 'estimation'
  | 'planning'
  | 'daily'
  | 'work'
  | 'refine'
  | 'review'
  | 'retro'
  | 'shipped';

/** What sort of time this is, for the colours on the timeline. */
export type PhaseKind = 'quiet' | 'artefact' | 'refine' | 'event' | 'daily' | 'work';

export interface Phase {
  key: PhaseKey;
  /** 1-based Sprint number; 0 before the first Sprint, SPRINTS + 1 after. */
  sprint: number;
  /** Working day inside the Sprint, 1..DAYS, for daily, work and refine. */
  day?: number;
  start: number;
  end: number;
  dur: number;
  label: string;
  index: number;
  kind: PhaseKind;
  /** In guided mode the studio pauses at the end of this phase so the
   *  reader can finish the side panel before the next thing starts. */
  hold: boolean;
}

export const DAYS = 5;
export const SPRINTS = 3;

/** Seconds at 1× speed. The whole run is a little over six minutes. */
const DUR: Record<PhaseKey, number> = {
  intro: 7,
  backlog: 12,
  refinement: 14,
  estimation: 20,
  planning: 16,
  daily: 5,
  work: 5.5,
  refine: 9,
  review: 14,
  retro: 11,
  shipped: 12,
};

const KIND: Record<PhaseKey, PhaseKind> = {
  intro: 'quiet',
  backlog: 'artefact',
  refinement: 'refine',
  estimation: 'refine',
  planning: 'event',
  daily: 'daily',
  work: 'work',
  refine: 'refine',
  review: 'event',
  retro: 'event',
  shipped: 'quiet',
};

// ─── Product Backlog items ────────────────────────────────────────────────
// The product is a parcel-delivery drone, because a physical thing lets the
// Increment grow visibly on its pedestal: every item that reaches Done bolts
// a part on. The order is the Product Owner's, and the last two are never
// reached — a backlog is never finished, and a Sprint Review adds to it.

export interface Item {
  id: string;
  title: string;
  /** The user story behind the card, shown when it is selected. */
  story: string;
  /** Story points, as the Developers estimate them in Planning Poker. */
  points: number;
}

export const ITEMS: Item[] = [
  { id: 'frame', title: 'Frame', story: 'As a courier, I want a rigid frame so that the drone can carry a 1 kg parcel without flexing.', points: 3 },
  { id: 'rotors', title: 'Rotors', story: 'As a courier, I want four rotors so that the drone lifts off and hovers steadily.', points: 5 },
  { id: 'battery', title: 'Battery', story: 'As a courier, I want a swappable battery so that a flat drone is back in the air in a minute.', points: 3 },
  { id: 'camera', title: 'Camera', story: 'As a pilot, I want a forward camera so that I can see the landing spot before the drone commits.', points: 5 },
  { id: 'gps', title: 'GPS', story: 'As a pilot, I want GPS so that the drone finds the customer’s door on its own.', points: 8 },
  { id: 'clamp', title: 'Parcel clamp', story: 'As a customer, I want the parcel released only on the doorstep so that it is never dropped in flight.', points: 5 },
  { id: 'lights', title: 'Lights', story: 'As a neighbour, I want the drone lit at dusk so that I can see it coming.', points: 2 },
  { id: 'shell', title: 'Weather shell', story: 'As a courier, I want a splash-proof shell so that a shower does not ground the fleet.', points: 5 },
  { id: 'speaker', title: 'Speaker', story: 'As a customer, I want a chime on arrival so that I know to open the door.', points: 2 },
  { id: 'solar', title: 'Solar skin', story: 'As an operator, I want solar trickle-charging so that idle drones top themselves up.', points: 13 },
];

/** Arrives during the Sprint 1 Review, from a stakeholder who watched the
 *  drone hover: “what happens when it rains?” The Product Owner orders it
 *  above Lights, the Developers estimate it at the Sprint 2 refinement, and
 *  it is built in Sprint 3. */
export const REVIEW_ITEM: Item = {
  id: 'rain',
  title: 'Rain sensor',
  story: 'As an operator, I want the drone to return to base when rain starts so that the electronics survive a shower.',
  points: 3,
};

export const ALL_ITEMS: Item[] = [...ITEMS, REVIEW_ITEM];
export const itemById = (id: string): Item => ALL_ITEMS.find(i => i.id === id)!;

/** What each Sprint takes on, in the order the Developers pull it. */
export const SPRINT_PLAN: string[][] = [
  ['frame', 'rotors', 'battery'],
  ['camera', 'gps', 'clamp'],
  ['rain', 'lights', 'shell'],
];

export const SPRINT_GOALS = ['It lifts off', 'It finds the door', 'It survives the weather'];

/** The one improvement each Retrospective sends into the next Sprint. */
export const RETRO_IMPROVEMENTS = [
  'Pair on any item over 5 points',
  'Timebox refinement to one hour',
  'Demo on real parcels, not props',
];

/** The Product Backlog order at a given moment. The Review item is
 *  inserted above Lights once it has been raised. */
export function backlogOrder(rainRaised: boolean): string[] {
  const base = ITEMS.map(i => i.id);
  if (!rainRaised) return base;
  const at = base.indexOf('lights');
  return [...base.slice(0, at), 'rain', ...base.slice(at)];
}

// ─── The timeline ─────────────────────────────────────────────────────────

function buildPhases(): Phase[] {
  const out: Phase[] = [];
  let t = 0;
  const push = (key: PhaseKey, sprint: number, label: string, day?: number, hold = false) => {
    const dur = DUR[key];
    out.push({ key, sprint, day, start: t, end: t + dur, dur, label, index: out.length, kind: KIND[key], hold });
    t += dur;
  };
  push('intro', 0, 'The studio', undefined, true);
  push('backlog', 0, 'Product Backlog', undefined, true);
  push('refinement', 0, 'Backlog Refinement', undefined, true);
  push('estimation', 0, 'Story estimation', undefined, true);
  for (let s = 1; s <= SPRINTS; s++) {
    push('planning', s, `Sprint ${s} Planning`, undefined, true);
    for (let d = 1; d <= DAYS; d++) {
      // Hold after the very first Daily Scrum, and after every day-4 one,
      // where the impediment is raised and cleared.
      push('daily', s, `Day ${d} · Daily Scrum`, d, (s === 1 && d === 1) || d === 4);
      push('work', s, `Day ${d} · the work`, d);
      if (d === 3) push('refine', s, `Sprint ${s} · Refinement`, d, true);
    }
    push('review', s, `Sprint ${s} Review`, undefined, true);
    push('retro', s, `Sprint ${s} Retrospective`, undefined, true);
  }
  push('shipped', SPRINTS + 1, 'After three Sprints', undefined, true);
  return out;
}

export const PHASES: Phase[] = buildPhases();
export const TOTAL = PHASES[PHASES.length - 1].end;

const wrap = (t: number) => ((t % TOTAL) + TOTAL) % TOTAL;

export function phaseIndexAt(t: number): number {
  const tt = wrap(t);
  for (const ph of PHASES) if (tt < ph.end) return ph.index;
  return PHASES.length - 1;
}

export function phaseAt(t: number): Phase {
  return PHASES[phaseIndexAt(t)];
}

const idxOf = (key: PhaseKey, sprint: number) => PHASES.findIndex(p => p.key === key && p.sprint === sprint);

// ─── Timeline milestones (the strip under the stage) ──────────────────────

export interface Block { n: number; label: string; start: number; end: number }
export interface Milestone {
  label: string;
  sub: string;
  start: number;
  end: number;
  kind: PhaseKind;
  block: number;
}

export const blockOf = (ph: Phase): number => (ph.sprint > SPRINTS ? SPRINTS + 1 : ph.sprint);

const BLOCK_LABEL = (n: number) => (n === 0 ? 'Before Sprint 1' : n > SPRINTS ? 'Release' : `Sprint ${n}`);

export const BLOCKS: Block[] = Array.from({ length: SPRINTS + 2 }, (_, n) => {
  const own = PHASES.filter(p => blockOf(p) === n);
  return { n, label: BLOCK_LABEL(n), start: own[0].start, end: own[own.length - 1].end };
});

const DAY_SUB = ['', 'First Daily Scrum', 'First item Done', 'A blocker lands', 'Blocker cleared', 'Sprint Goal met'];
const MS_SUB: Partial<Record<PhaseKey, string>> = {
  intro: 'Meet the team',
  backlog: 'PO orders the list',
  refinement: 'Clarify & split',
  estimation: 'Planning Poker',
  planning: '≤ 8 h a month',
  refine: '≤ 10% of capacity',
  review: '≤ 4 h a month',
  retro: '≤ 3 h a month',
  shipped: 'Three Increments',
};
const MS_LABEL: Partial<Record<PhaseKey, string>> = {
  intro: 'The team',
  backlog: 'Product Backlog',
  refinement: 'Refinement',
  estimation: 'Estimation',
  planning: 'Sprint Planning',
  refine: 'Refinement',
  review: 'Sprint Review',
  retro: 'Retrospective',
  shipped: 'Release',
};

function buildMilestones(): Milestone[] {
  const out: Milestone[] = [];
  for (const ph of PHASES) {
    if (ph.key === 'work') {
      // A day's work belongs to the day its Daily Scrum opened.
      out[out.length - 1].end = ph.end;
      continue;
    }
    out.push({
      label: ph.key === 'daily' ? `Day ${ph.day}` : MS_LABEL[ph.key]!,
      sub: ph.key === 'daily' ? DAY_SUB[ph.day!] : MS_SUB[ph.key]!,
      start: ph.start,
      end: ph.end,
      kind: ph.kind,
      block: blockOf(ph),
    });
  }
  return out;
}

export const MILESTONES: Milestone[] = buildMilestones();

// ─── Studio geometry: where things are ────────────────────────────────────
// x runs left→right, z runs back→front (toward the default camera). y is up.

export type V2 = [number, number];

export const SPOT = {
  backlogWall: [-5.3, -3.3] as V2,
  poDesk: [-4.3, -2.2] as V2,
  poAtWall: [-5.0, -2.35] as V2,
  table: [0, -2.05] as V2,
  board: [3.4, -3.3] as V2,
  desks: [[-2.6, 0.9], [-0.9, 0.9], [0.8, 0.9], [2.5, 0.9]] as V2[],
  pedestal: [5.1, 0.7] as V2,
  rug: [-3.6, 2.6] as V2,
  retroBoard: [6.7, -1.7] as V2,
  retroSpot: [5.4, -1.7] as V2,
  door: [-6.6, 4.4] as V2,
  smHome: [1.6, -0.9] as V2,
};

/** Where the Developers stand when they refine at the backlog wall. */
const WALL_ARC: V2[] = [[-6.0, -1.55], [-5.3, -1.2], [-4.55, -1.3], [-3.85, -1.7]];

/** The spotlight's stops: floor ring centre and radius, arrow height. */
export type SpotKey = 'podesk' | 'wall' | 'table' | 'board' | 'desks' | 'desk2' | 'rug' | 'pedestal' | 'retro';
export const SPOT_GEO: Record<SpotKey, { c: V2; r: number; h: number }> = {
  podesk: { c: [-4.3, -2.2], r: 0.75, h: 1.55 },
  wall: { c: [-5.1, -2.2], r: 1.15, h: 3.75 },
  table: { c: [0, -2.05], r: 1.55, h: 2.5 },
  board: { c: [3.4, -2.7], r: 1.35, h: 3.95 },
  desks: { c: [0, 0.55], r: 2.9, h: 1.95 },
  desk2: { c: [-0.9, 0.6], r: 0.8, h: 1.65 },
  rug: { c: [-3.6, 2.6], r: 1.5, h: 1.95 },
  pedestal: { c: [5.1, 0.7], r: 1.0, h: 2.95 },
  retro: { c: [5.6, -1.7], r: 1.35, h: 2.6 },
};

/** Points on a circle, for people standing round something. */
export function ring(center: V2, r: number, n: number, offset = 0, i = 0): V2 {
  const a = offset + (i / n) * Math.PI * 2;
  return [center[0] + Math.cos(a) * r, center[1] + Math.sin(a) * r];
}

/** Yaw that turns a miniature standing at `from` toward `to`. Yaw 0 looks
 *  down +z, toward the reader. */
export const faceTo = (from: V2, to: V2): number => Math.atan2(to[0] - from[0], to[1] - from[1]);

// ─── Actors ───────────────────────────────────────────────────────────────

export type ActorId = 'po' | 'sm' | 'd1' | 'd2' | 'd3' | 'd4' | 's1' | 's2';
export type Anim = 'idle' | 'talk' | 'work' | 'point' | 'celebrate' | 'clap' | 'nod' | 'away';

export interface ActorDef {
  id: ActorId;
  name: string;
  role: 'Product Owner' | 'Scrum Master' | 'Developer' | 'Stakeholder';
  shirt: string;
  skin: string;
  hair: string;
}

export const ACTORS: ActorDef[] = [
  { id: 'po', name: 'Priya', role: 'Product Owner', shirt: '#7c2d5c', skin: '#c68642', hair: '#1a1a1a' },
  { id: 'sm', name: 'Sam', role: 'Scrum Master', shirt: '#0f766e', skin: '#f5cba7', hair: '#4a3728' },
  { id: 'd1', name: 'Aroha', role: 'Developer', shirt: '#1d4ed8', skin: '#8d5524', hair: '#1c1c1c' },
  { id: 'd2', name: 'Ben', role: 'Developer', shirt: '#b45309', skin: '#fdbcb4', hair: '#8b4513' },
  { id: 'd3', name: 'Chen', role: 'Developer', shirt: '#4d7c0f', skin: '#f5cba7', hair: '#1a1a1a' },
  { id: 'd4', name: 'Dee', role: 'Developer', shirt: '#be185d', skin: '#c68642', hair: '#2c1810' },
  { id: 's1', name: 'Mr Ngata', role: 'Stakeholder', shirt: '#475569', skin: '#8d5524', hair: '#1c1c1c' },
  { id: 's2', name: 'Ms Okafor', role: 'Stakeholder', shirt: '#334155', skin: '#5c3a21', hair: '#0f0f0f' },
];

export const actorById = (id: ActorId): ActorDef => ACTORS.find(a => a.id === id)!;
const DEVS: ActorId[] = ['d1', 'd2', 'd3', 'd4'];

// ─── Estimation and readiness ─────────────────────────────────────────────
// Planning Poker at the pre-game estimation session: three stories are shown
// round by round (Rotors needs a second round because the first votes
// disagree), then the rest of the backlog is sized in quick rounds. The
// Rain sensor is sized later, at the Sprint 2 refinement, because it did
// not exist yet.

export const POKER_DECK = [1, 2, 3, 5, 8, 13];

interface PokerRound { at: [number, number]; votes: [number, number, number, number] }
interface PokerStory { id: string; table: [number, number]; rounds: PokerRound[]; estimateAt: number }

const POKER: PokerStory[] = [
  { id: 'frame', table: [0.1, 0.28], rounds: [{ at: [0.16, 0.28], votes: [3, 3, 3, 3] }], estimateAt: 0.22 },
  { id: 'rotors', table: [0.3, 0.63], rounds: [{ at: [0.36, 0.5], votes: [3, 5, 8, 5] }, { at: [0.52, 0.63], votes: [5, 5, 5, 5] }], estimateAt: 0.58 },
  { id: 'battery', table: [0.65, 0.79], rounds: [{ at: [0.7, 0.79], votes: [3, 3, 2, 3] }], estimateAt: 0.75 },
];
const QUICK_ESTIMATE_AT = 0.86;
const RAIN_ROUND: PokerRound = { at: [0.38, 0.66], votes: [3, 3, 3, 3] };
const RAIN_ESTIMATE_AT = 0.55;

/** When each card gets its green "ready for Sprint Planning" dot: which
 *  refinement session, and how far through it. */
const READY: Record<string, [PhaseKey, number, number]> = {
  frame: ['refinement', 0, 0.55],
  rotors: ['refinement', 0, 0.61],
  battery: ['refinement', 0, 0.67],
  camera: ['refinement', 0, 0.73],
  gps: ['refine', 1, 0.45],
  clamp: ['refine', 1, 0.53],
  lights: ['refine', 1, 0.61],
  rain: ['refine', 2, 0.66],
  shell: ['refine', 2, 0.74],
  speaker: ['refine', 3, 0.5],
};

const reached = (cur: number, p: number, idx: number, at: number) => cur > idx || (cur === idx && p >= at);

function isEstimated(id: string, cur: number, p: number): boolean {
  if (id === 'rain') return reached(cur, p, idxOf('refine', 2), RAIN_ESTIMATE_AT);
  const est = idxOf('estimation', 0);
  const detail = POKER.find(x => x.id === id);
  return reached(cur, p, est, detail ? detail.estimateAt : QUICK_ESTIMATE_AT);
}

function isReady(id: string, cur: number, p: number): boolean {
  const r = READY[id];
  if (!r) return false;
  return reached(cur, p, idxOf(r[0], r[1]), r[2]);
}

// ─── Derived world state ──────────────────────────────────────────────────

export type CardLoc = 'hidden' | 'pile' | 'backlog' | 'table' | 'todo' | 'doing' | 'done';

export interface CardState {
  loc: CardLoc;
  /** Row inside the location. */
  slot: number;
  /** Story points are known (Planning Poker has happened for it). */
  pts: boolean;
  /** Refined and ready to be pulled into a Sprint. */
  ready: boolean;
}

export interface ActorState {
  target: V2;
  /** Yaw to face once arrived, radians; undefined = face the way you walked. */
  face?: number;
  anim: Anim;
  /** Off the studio floor entirely (stakeholders between Reviews). */
  hidden?: boolean;
}

export type Impediment = 'none' | 'on-desk' | 'raised' | 'gone';

export interface Beat {
  /** Fraction of the phase at which this beat starts. */
  at: number;
  /** A few words, for the spotlight label and the bold lead-in. */
  tag: string;
  /** One sentence on what is happening right now. */
  text: string;
  /** Where the spotlight goes; null hides it. */
  spot: SpotKey | null;
}

export interface World {
  t: number;
  phase: Phase;
  /** 0..1 through the current phase. */
  p: number;
  sprint: number;
  day?: number;
  cards: Record<string, CardState>;
  actors: Record<ActorId, ActorState>;
  /** Item ids bolted onto the drone, in build order. */
  parts: string[];
  impediment: Impediment;
  /** 1 → 0 across the Daily Scrum. */
  standupTimer: number | null;
  goalLit: boolean;
  goalText: string;
  /** Retro sticky pinned to the retro board. */
  retroNote: string | null;
  /** Improvement card sitting in the Sprint Backlog this Sprint. */
  improvement: string | null;
  /** Planning Poker cards held up by the Developers right now. */
  votes: Partial<Record<ActorId, number>> | null;
  /** Where the camera should be looking. */
  focus: [number, number, number];
  /** Overrides the phase's camera position for a beat whose action happens
   *  somewhere the phase camera cannot see. */
  vantage: [number, number, number] | null;
  /** Drone lifted off the pedestal for a demonstration. */
  hover: number;
  rainRaised: boolean;
  beats: Beat[];
  beatIndex: number;
  beat: Beat;
}

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const within = (p: number, [a, b]: [number, number]) => p >= a && p < b;

/** Where the three items of a Sprint sit on a given day. */
function sprintCards(day: number, phase: PhaseKey, p: number): [CardLoc, CardLoc, CardLoc] {
  const w = phase === 'work';
  // Day 1: A starts. Day 2: A done, B starts. Day 3: B blocked (stays doing).
  // Day 4: B done after the impediment clears, C starts. Day 5: C done.
  if (phase === 'refine') return ['done', 'doing', 'todo'];
  if (day === 1) return [w && p > 0.15 ? 'doing' : 'todo', 'todo', 'todo'];
  if (day === 2) return [w && p > 0.3 ? 'done' : 'doing', w && p > 0.55 ? 'doing' : 'todo', 'todo'];
  if (day === 3) return ['done', 'doing', 'todo'];
  if (day === 4) return ['done', w && p > 0.45 ? 'done' : 'doing', w && p > 0.65 ? 'doing' : 'todo'];
  return ['done', 'done', w && p > 0.6 ? 'done' : 'doing'];
}

export function deriveWorld(t: number): World {
  const tt = wrap(t);
  const phase = phaseAt(tt);
  const p = Math.min(1, Math.max(0, (tt - phase.start) / phase.dur));
  const { key, sprint, day } = phase;
  const cur = phase.index;
  const inSprintKeys = key === 'planning' || key === 'daily' || key === 'work' || key === 'refine';

  // Which Sprints are entirely behind us, and what they built.
  const sprintsDone = key === 'shipped' ? SPRINTS : key === 'review' || key === 'retro' ? sprint : Math.max(0, sprint - 1);
  // The new card appears a moment after the camera has panned to the wall.
  const rainRaised = sprintsDone >= 1 && !(key === 'review' && sprint === 1 && p < 0.62);
  const order = backlogOrder(rainRaised);

  const parts: string[] = [];
  for (let s = 1; s <= Math.min(sprintsDone, SPRINTS); s++) parts.push(...SPRINT_PLAN[s - 1]);
  const doneIds = new Set(parts);
  const inSprint = new Set<string>(inSprintKeys ? SPRINT_PLAN[sprint - 1] : []);

  const cards: Record<string, CardState> = {};
  const C = (id: string, loc: CardLoc, slot: number): CardState => ({ loc, slot, pts: isEstimated(id, cur, p), ready: isReady(id, cur, p) });

  // Everything still on the Product Backlog.
  let slot = 0;
  for (const id of order) {
    if (doneIds.has(id) || inSprint.has(id)) continue;
    if (id === 'rain' && !rainRaised) { cards[id] = C(id, 'hidden', 0); continue; }
    if (key === 'intro') { cards[id] = C(id, 'pile', slot); slot++; continue; }
    if (key === 'backlog') {
      // Cards leave the pile one at a time and settle into order on the wall.
      const arrive = 0.2 + (slot / order.length) * 0.5;
      cards[id] = C(id, p >= arrive ? 'backlog' : 'pile', slot);
      slot++;
      continue;
    }
    cards[id] = C(id, 'backlog', slot);
    slot++;
  }
  for (const id of doneIds) cards[id] = C(id, 'hidden', 0);

  // Planning Poker: the story being sized lies in the middle of the table.
  let votes: World['votes'] = null;
  if (key === 'estimation') {
    for (const story of POKER) {
      if (within(p, story.table)) cards[story.id] = { ...cards[story.id], loc: 'table' };
      for (const r of story.rounds) {
        if (within(p, r.at)) votes = Object.fromEntries(DEVS.map((d, i) => [d, r.votes[i]]));
      }
    }
  }
  if (key === 'refine' && sprint === 2 && within(p, RAIN_ROUND.at)) {
    votes = Object.fromEntries(DEVS.map((d, i) => [d, RAIN_ROUND.votes[i]]));
  }

  // The Sprint's own three items.
  let freshParts: string[] = [];
  if (key === 'planning') {
    const remaining = order.filter(x => !doneIds.has(x));
    SPRINT_PLAN[sprint - 1].forEach((id, i) => {
      const pull = 0.4 + i * 0.1;
      cards[id] = p >= pull ? C(id, 'todo', i) : C(id, 'backlog', remaining.indexOf(id));
    });
  } else if (key === 'daily' || key === 'work' || key === 'refine') {
    const locs = sprintCards(day!, key, p);
    SPRINT_PLAN[sprint - 1].forEach((id, i) => {
      cards[id] = C(id, locs[i], i);
      if (locs[i] === 'done') freshParts.push(id);
    });
  } else if (key === 'review' || key === 'retro') {
    freshParts = SPRINT_PLAN[sprint - 1];
    freshParts.forEach((id, i) => { cards[id] = C(id, key === 'review' && p < 0.8 ? 'done' : 'hidden', i); });
  }
  // Parts fitted so far this Sprint show on the drone straight away — an
  // Increment exists the moment an item is Done, not only at the Review.
  const partsNow = [...parts, ...freshParts.filter(id => !parts.includes(id))];

  // ── Impediment: lands on the second item's desk on day 3, sits there
  //    through the refinement session, is raised at the day-4 Daily Scrum
  //    and removed by the Scrum Master during it.
  let impediment: Impediment = 'none';
  if (key === 'work' && day === 3 && p > 0.4) impediment = 'on-desk';
  if (key === 'refine') impediment = 'on-desk';
  if (key === 'daily' && day === 4) impediment = p < 0.45 ? 'on-desk' : p < 0.85 ? 'raised' : 'gone';

  // ── Sprint Goal sign and improvement card.
  const goalLit = (key === 'planning' && p > 0.2) || key === 'daily' || key === 'work' || key === 'refine' || key === 'review';
  const goalText = sprint >= 1 && sprint <= SPRINTS ? SPRINT_GOALS[sprint - 1] : '';
  const improvement = sprint >= 2 && sprint <= SPRINTS && (key === 'daily' || key === 'work' || key === 'refine' || (key === 'planning' && p > 0.82))
    ? RETRO_IMPROVEMENTS[sprint - 2] : null;
  const retroNote = key === 'retro' && p > 0.55 && sprint <= SPRINTS ? RETRO_IMPROVEMENTS[sprint - 1] : null;

  // ── Actors.
  const A = (target: V2, anim: Anim = 'idle', face?: number, hidden = false): ActorState => ({ target, anim, face, hidden });
  const FACE_CAM = 0; // yaw 0 looks toward +z, i.e. the reader
  const FACE_BACK = Math.PI;
  const actors = {} as Record<ActorId, ActorState>;

  const atDesks = (anim: Anim) => {
    DEVS.forEach((id, i) => { actors[id] = A([SPOT.desks[i][0], SPOT.desks[i][1] - 0.75], anim, FACE_CAM); });
  };
  const roundTable = (ids: ActorId[], anim: (id: ActorId) => Anim) => {
    ids.forEach((id, i) => {
      // An ellipse, flattened front-to-back, so nobody on the far side of
      // the table ends up standing inside the back wall.
      const a = Math.PI * 0.5 + 0.35 + (i / ids.length) * Math.PI * 2;
      const pos: V2 = [SPOT.table[0] + Math.cos(a) * 1.4, SPOT.table[1] + Math.sin(a) * 1.08];
      actors[id] = A(pos, anim(id), faceTo(pos, SPOT.table));
    });
  };
  const atWall = (talking: boolean) => {
    actors.po = A(SPOT.poAtWall, 'point', faceTo(SPOT.poAtWall, SPOT.backlogWall));
    DEVS.forEach((id, i) => {
      const pos = WALL_ARC[i];
      const voting = votes && votes[id] !== undefined;
      actors[id] = A(pos, voting ? 'point' : talking && i % 2 === 0 ? 'talk' : 'nod', faceTo(pos, SPOT.backlogWall));
    });
    const smPos: V2 = [-3.2, -2.5];
    actors.sm = A(smPos, 'nod', faceTo(smPos, SPOT.poAtWall));
  };

  actors.s1 = A(SPOT.door, 'away', undefined, true);
  actors.s2 = A([SPOT.door[0] - 0.6, SPOT.door[1] + 0.4], 'away', undefined, true);

  switch (key) {
    case 'intro': {
      actors.po = A(SPOT.poDesk, 'idle', FACE_CAM);
      actors.sm = A(SPOT.smHome, 'idle', FACE_CAM);
      atDesks('idle');
      break;
    }
    case 'backlog': {
      actors.po = A(SPOT.poAtWall, 'point', faceTo(SPOT.poAtWall, SPOT.backlogWall));
      actors.sm = A([-3.2, -1.6], 'nod', faceTo([-3.2, -1.6], SPOT.backlogWall));
      atDesks('work');
      break;
    }
    case 'refinement':
      atWall(p > 0.2 && p < 0.55);
      break;
    case 'refine':
      atWall(p < 0.35 || p > 0.7);
      break;
    case 'estimation': {
      const discussing = within(p, [0.42, 0.5]);
      roundTable(['po', 'd1', 'd2', 'd3', 'd4', 'sm'], id => {
        if (id === 'po') return POKER.some(s => within(p, [s.table[0], s.table[0] + 0.06])) ? 'talk' : 'nod';
        if (id === 'sm') return 'nod';
        if (discussing && (id === 'd1' || id === 'd3')) return 'talk';
        return votes && votes[id] !== undefined ? 'point' : 'nod';
      });
      break;
    }
    case 'planning': {
      roundTable(['po', 'd1', 'd2', 'd3', 'd4', 'sm'], id => (p < 0.35 ? (id === 'po' ? 'talk' : 'nod') : p < 0.72 ? (id === 'po' || id === 'sm' ? 'nod' : 'talk') : 'nod'));
      break;
    }
    case 'daily': {
      // Developers in a circle on the rug. The Scrum Master listens from
      // just outside it; the Product Owner is refining at the wall.
      DEVS.forEach((id, i) => {
        const pos = ring(SPOT.rug, 0.85, 4, Math.PI * 0.25, i);
        actors[id] = A(pos, id === 'd2' && impediment === 'raised' ? 'point' : 'talk', faceTo(pos, SPOT.rug));
      });
      if (day === 4 && impediment !== 'none' && p > 0.5) {
        const d = SPOT.desks[1];
        const smAtDesk: V2 = [d[0] - 0.7, d[1] + 0.2];
        actors.sm = A(smAtDesk, impediment === 'gone' ? 'celebrate' : 'work', faceTo(smAtDesk, d));
      } else {
        const smPos: V2 = [SPOT.rug[0] + 1.5, SPOT.rug[1] + 0.6];
        actors.sm = A(smPos, 'nod', faceTo(smPos, SPOT.rug));
      }
      actors.po = A(SPOT.poAtWall, 'work', faceTo(SPOT.poAtWall, SPOT.backlogWall));
      break;
    }
    case 'work': {
      atDesks('work');
      if (impediment === 'on-desk') actors.d2 = { ...actors.d2, anim: 'idle' };
      const smPos: V2 = day! % 2 === 0 ? [SPOT.board[0] - 0.5, SPOT.board[1] + 1.0] : SPOT.smHome;
      actors.sm = A(smPos, day! % 2 === 0 ? 'point' : 'idle', day! % 2 === 0 ? FACE_BACK : FACE_CAM);
      if (day === 2 && p > 0.5) {
        actors.po = A([SPOT.desks[2][0] + 0.8, SPOT.desks[2][1] - 0.75], 'talk', -Math.PI / 2);
      } else {
        actors.po = A(SPOT.poDesk, 'work', FACE_CAM);
      }
      break;
    }
    case 'review': {
      const c: V2 = [SPOT.pedestal[0] - 0.2, SPOT.pedestal[1] + 1.9];
      const showing = p > 0.2;
      const s1Pos: V2 = [c[0] - 0.9, c[1] + 0.2];
      const s2Pos: V2 = [c[0] + 0.4, c[1] + 0.5];
      actors.s1 = A(showing ? s1Pos : SPOT.door, showing ? (p > 0.5 ? 'clap' : 'nod') : 'idle', showing ? faceTo(s1Pos, SPOT.pedestal) : undefined);
      actors.s2 = A(showing ? s2Pos : [SPOT.door[0] - 0.6, SPOT.door[1] + 0.4], showing ? (p > 0.55 ? 'point' : 'nod') : 'idle', showing ? faceTo(s2Pos, SPOT.pedestal) : undefined);
      const poPos: V2 = [SPOT.pedestal[0] - 1.3, SPOT.pedestal[1] + 0.5];
      const smPos: V2 = [SPOT.pedestal[0] + 1.1, SPOT.pedestal[1] + 1.1];
      actors.po = A(poPos, p > 0.6 ? 'nod' : 'talk', faceTo(poPos, c));
      actors.sm = A(smPos, 'nod', faceTo(smPos, SPOT.pedestal));
      DEVS.forEach((id, i) => {
        const pos: V2 = [SPOT.pedestal[0] - 1.6 + i * 0.75, SPOT.pedestal[1] - 1.1];
        actors[id] = A(pos, i === 1 && p > 0.3 ? 'point' : 'talk', faceTo(pos, [SPOT.pedestal[0], SPOT.pedestal[1] + 0.6]));
      });
      break;
    }
    case 'retro': {
      // Scrum Team only: the stakeholders have left, the Product Owner is here.
      const ids: ActorId[] = ['sm', 'd1', 'd2', 'po', 'd3', 'd4'];
      ids.forEach((id, i) => {
        const pos: V2 = [SPOT.retroSpot[0] - Math.floor(i / 3) * 0.8, SPOT.retroSpot[1] - 0.9 + (i % 3) * 0.9];
        actors[id] = A(pos, id === 'sm' ? 'point' : p > 0.55 ? 'nod' : 'talk', Math.PI / 2);
      });
      break;
    }
    case 'shipped': {
      const c: V2 = [SPOT.pedestal[0] - 0.4, SPOT.pedestal[1] + 1.6];
      const ids: ActorId[] = ['po', 'sm', 'd1', 'd2', 'd3', 'd4'];
      ids.forEach((id, i) => {
        const pos = ring(c, 1.5, 6, Math.PI * 0.45, i);
        actors[id] = A(pos, 'celebrate', faceTo(pos, SPOT.pedestal));
      });
      break;
    }
  }

  // ── Camera focus and drone hover.
  const F = (x: number, y: number, z: number): [number, number, number] => [x, y, z];
  const focus =
    key === 'intro' ? F(0, 0.6, 0)
    : key === 'backlog' ? F(SPOT.backlogWall[0] + 0.6, 1.7, SPOT.backlogWall[1] + 0.8)
    : key === 'refinement' || key === 'refine' ? F(-4.8, 1.4, -2.2)
    : key === 'estimation' ? F(0, 1.2, -2.5)
    : key === 'planning' ? F(1.5, 1.4, -2.8)
    : key === 'daily' ? F(SPOT.rug[0], 0.7, SPOT.rug[1])
    : key === 'work' ? F(1.4, 1.0, -0.6)
    : key === 'review' ? F(SPOT.pedestal[0] - 0.3, 1.0, SPOT.pedestal[1] + 0.9)
    : key === 'retro' ? F(SPOT.retroSpot[0] + 0.6, 1.1, SPOT.retroSpot[1])
    : F(SPOT.pedestal[0] - 0.4, 1.8, SPOT.pedestal[1] + 0.6);

  // Two beats happen off the phase camera's frame: Planning Poker's quick
  // rounds update the cards on the wall, and the Review's new card lands on
  // the wall while everyone is at the pedestal. Those beats move the camera there.
  let vantage: World['vantage'] = null;
  let focusOut = focus;
  if (key === 'estimation' && p >= 0.82) { vantage = [-1.6, 5.4, 4.6]; focusOut = [-2.6, 1.4, -2.4]; }
  if (key === 'review' && p >= 0.55 && p < 0.8) { vantage = [-3.4, 4.4, 3.4]; focusOut = [-5.0, 1.8, -2.8]; }

  const hover = key === 'review' ? smooth((p - 0.3) / 0.2) * (1 - smooth((p - 0.85) / 0.15))
    : key === 'shipped' ? smooth(p / 0.2) : 0;

  const beats = beatsFor(phase);
  let beatIndex = 0;
  beats.forEach((b, i) => { if (p >= b.at) beatIndex = i; });

  return {
    t: tt,
    phase,
    p,
    sprint,
    day,
    cards,
    actors,
    parts: partsNow,
    impediment,
    standupTimer: key === 'daily' ? 1 - p : null,
    goalLit,
    goalText,
    retroNote,
    improvement,
    votes,
    focus: focusOut,
    vantage,
    hover,
    rainRaised,
    beats,
    beatIndex,
    beat: beats[beatIndex],
  };
}

// ─── Camera vantage per phase ─────────────────────────────────────────────

export const VANTAGE: Record<PhaseKey, [number, number, number]> = {
  intro: [0.5, 7.5, 12.5],
  backlog: [-6.8, 4.0, 3.6],
  refinement: [-3.0, 5.6, 4.4],
  refine: [-3.0, 5.6, 4.4],
  estimation: [0.5, 5.9, 4.2],
  planning: [1.2, 4.8, 4.6],
  daily: [-3.0, 4.6, 8.0],
  work: [1.4, 6.2, 9.6],
  review: [2.0, 4.2, 6.8],
  retro: [2.0, 4.6, 2.2],
  shipped: [3.0, 4.4, 6.8],
};

// ─── Beats: the one thing happening right now ─────────────────────────────

const B = (at: number, tag: string, text: string, spot: SpotKey | null): Beat => ({ at, tag, text, spot });

export function beatsFor(ph: Phase): Beat[] {
  const s = ph.sprint;
  const plan = s >= 1 && s <= SPRINTS ? SPRINT_PLAN[s - 1].map(id => itemById(id).title) : [];
  const [A, Bt, C] = plan;
  switch (ph.key) {
    case 'intro':
      return [
        B(0, 'The Scrum Team', 'Priya is the Product Owner, Sam is the Scrum Master, and Aroha, Ben, Chen and Dee are the Developers.', 'desks'),
        B(0.5, 'The product', 'They are building a parcel drone. It will grow on the pedestal, one Done item at a time.', 'pedestal'),
      ];
    case 'backlog':
      return [
        B(0, 'A pile of ideas', 'Priya starts with a pile of ideas from customers and stakeholders on her desk.', 'podesk'),
        B(0.18, 'Ordering', 'She orders them into ONE list on the wall — the Product Backlog. The most valuable item goes on top.', 'wall'),
        B(0.72, 'The Product Goal', 'Every card serves one Product Goal: a drone that delivers parcels to the door. The “? pts” means nobody has sized it yet.', 'wall'),
      ];
    case 'refinement':
      return [
        B(0, 'Refinement', 'Backlog Refinement (grooming): Priya and the Developers meet at the wall to work on the top of the list.', 'wall'),
        B(0.2, 'Questions', 'The Developers ask what each story really means. Priya adds acceptance criteria: how will we know Frame is done?', 'wall'),
        B(0.4, 'Clarify & split', 'Anything too big or too vague is clarified or split until it could be finished inside one Sprint.', 'wall'),
        B(0.55, 'Ready', 'A green dot means “ready”: clear enough to pull into a Sprint. The top four cards get one.', 'wall'),
        B(0.8, 'The bottom stays rough', 'Speaker and Solar skin are left vague on purpose — refining work nobody needs yet is waste.', 'wall'),
      ];
    case 'estimation':
      return [
        B(0, 'Planning Poker', 'Story estimation: the Developers sit down with cards numbered 1, 2, 3, 5, 8 and 13.', 'table'),
        B(0.1, 'Frame', 'Priya reads the Frame story. Each Developer picks a card in secret, then all reveal together: 3, 3, 3, 3. Frame = 3 points.', 'table'),
        B(0.3, 'Rotors · round 1', 'Rotors: the votes split 3, 5, 8, 5. When votes differ, nobody averages them.', 'table'),
        B(0.42, 'Talk it out', 'Chen (8) and Aroha (3), the highest and lowest, explain what they each know that the others might not.', 'table'),
        B(0.52, 'Rotors · round 2', 'Everyone votes again: 5, 5, 5, 5. Rotors = 5 points.', 'table'),
        B(0.65, 'Battery', 'Battery: 3, 3, 2, 3 — close enough to agree on 3 points after a quick word.', 'table'),
        B(0.82, 'Quick rounds', 'The rest are sized in quick rounds. Solar skin comes out at 13 — too big for one Sprint, so it will need splitting before anyone pulls it.', 'wall'),
      ];
    case 'planning':
      return [
        B(0, 'Topic 1 · WHY', `Priya explains why this Sprint matters. The team agrees the Sprint Goal: “${SPRINT_GOALS[s - 1]}”.`, 'table'),
        B(0.35, 'Topic 2 · WHAT', `The Developers pull ready items from the top of the backlog: ${A}, ${Bt}, ${C} — only as much as they believe they can finish.`, 'board'),
        B(0.72, 'Topic 3 · HOW', 'They break each item into tasks. Sprint Goal + selected items + the plan = the Sprint Backlog.', 'table'),
        ...(s >= 2 ? [B(0.84, 'Last Retro’s change', `The green card — “${RETRO_IMPROVEMENTS[s - 2]}” — goes into the Sprint Backlog so it actually happens.`, 'board')] : []),
      ];
    case 'daily': {
      const d = ph.day!;
      const open = B(0, `Day ${d} · 9:00`, 'The Developers stand in a circle on the rug. Fifteen minutes, same time, same place, every day.', 'rug');
      if (d === 4) {
        return [
          open,
          B(0.25, 'Progress check', 'Each Developer says what moved toward the Sprint Goal yesterday and what they will do today.', 'rug'),
          B(0.45, 'Blocker raised', 'Ben raises yesterday’s blocker: a supplier can’t ship his part. It is named here, not solved here.', 'rug'),
          B(0.6, 'Scrum Master acts', 'Sam leaves the circle to remove the impediment. That is the Scrum Master’s job, not the Developers’.', 'desk2'),
          B(0.85, 'Cleared', 'The blocker is gone and the Daily Scrum still ended on time.', 'desk2'),
        ];
      }
      return [
        open,
        B(0.3, 'Progress check', 'Each says what moved toward the Sprint Goal and what is next. Sam listens from outside the circle; Priya is at the wall.', 'rug'),
        B(0.7, 'Plan for today', 'The plan for the next 24 hours is set. Back to the desks.', 'desks'),
      ];
    }
    case 'work': {
      const d = ph.day!;
      if (d === 1) return [
        B(0, 'Start', `Aroha moves ${A} from To Do to Doing on the Sprint Backlog.`, 'board'),
        B(0.4, 'Building', 'Heads down. Dee has no card of her own: she pairs with the others and tests their work.', 'desks'),
      ];
      if (d === 2) return [
        B(0, 'Building', `Aroha is finishing ${A} and Dee is testing it against the Definition of Done.`, 'desks'),
        B(0.3, 'Done!', `${A} meets the Definition of Done and moves to Done…`, 'board'),
        B(0.36, 'Increment', `…and the part bolts onto the drone right away. The Increment exists now, not at the end of the Sprint.`, 'pedestal'),
        B(0.55, 'PO nearby', `Ben starts ${Bt}. Priya walks over to answer Chen’s question — a Product Owner is one question away.`, 'desks'),
      ];
      if (d === 3) return [
        B(0, 'Building', `Ben is working on ${Bt}.`, 'desk2'),
        B(0.4, 'Blocked!', 'A red block lands on Ben’s desk: the supplier cannot ship a part. He stops and will raise it tomorrow morning.', 'desk2'),
      ];
      if (d === 4) return [
        B(0, 'Unblocked', `With the blocker cleared, Ben finishes ${Bt}.`, 'desk2'),
        B(0.45, 'Done!', `${Bt} is Done and another part joins the drone.`, 'pedestal'),
        B(0.65, 'Next item', `Chen starts ${C}.`, 'board'),
      ];
      return [
        B(0, 'Last day', `Chen finishes ${C}, with Dee testing.`, 'desks'),
        B(0.6, 'Sprint Goal met', `${C} is Done. Sprint Goal met: “${SPRINT_GOALS[s - 1]}”.`, 'pedestal'),
      ];
    }
    case 'refine': {
      const middle =
        s === 1 ? B(0.38, 'Next Sprint’s cards', 'They clarify GPS, Parcel clamp and Lights so next Sprint Planning can start fast. Green dots appear.', 'wall')
        : s === 2 ? B(0.38, 'Estimate the new card', 'The Rain sensor card from the last Review has no size yet. Planning Poker: 3, 3, 3, 3 — it is 3 points.', 'wall')
        : B(0.38, 'Speaker', 'They refine Speaker. Solar skin stays rough — nobody needs it yet.', 'wall');
      return [
        B(0, 'Mid-Sprint refinement', 'Wednesday afternoon: the team takes an hour away from building to prepare the NEXT Sprint’s items.', 'wall'),
        middle,
        B(0.72, 'Not an event', 'Refinement is an ongoing activity, not a Scrum event, and it never changes the Sprint that is running.', 'wall'),
      ];
    }
    case 'review':
      return [
        B(0, 'Guests arrive', 'Mr Ngata and Ms Okafor, the stakeholders, are invited to the Sprint Review.', 'pedestal'),
        B(0.28, 'Demo', 'The Developers show only what is Done: the drone lifts off the pedestal.', 'pedestal'),
        s === 1
          ? B(0.55, 'Feedback → backlog', 'Ms Okafor asks: “What happens in rain?” Priya adds a new Rain sensor card to the Product Backlog, above Lights.', 'wall')
          : B(0.55, 'Feedback → backlog', 'The stakeholders say what they want next, and Priya reorders the Product Backlog in the room.', 'wall'),
        B(0.8, 'Output', 'A revised Product Backlog. This is a working session, not a sign-off.', 'wall'),
      ];
    case 'retro':
      return [
        B(0, 'Team only', 'The stakeholders leave. Only the Scrum Team stays for the Sprint Retrospective.', 'retro'),
        B(0.25, 'Look back', 'What went well? What got in the way? That day-3 blocker comes up.', 'retro'),
        B(0.55, 'One change', `They agree ONE improvement: “${RETRO_IMPROVEMENTS[s - 1]}”.`, 'retro'),
        s < SPRINTS
          ? B(0.8, 'Into the next Sprint', 'It will go into the next Sprint Backlog as a green card, so it becomes work rather than a wish.', 'retro')
          : B(0.8, 'No gap', 'The next Sprint starts right after this one ends — no cool-down week.', 'retro'),
      ];
    case 'shipped':
    default:
      return [
        B(0, 'Three Increments', 'Three Sprints, three Increments: the drone flies with nine Done items.', 'pedestal'),
        B(0.45, 'Never finished', 'Speaker and Solar skin are still on the wall. The backlog is never finished, and that is the point.', 'wall'),
        B(0.8, 'A loop', 'The next Sprint starts immediately. Scrum is a loop, not a line.', 'pedestal'),
      ];
  }
}

// ─── Narration: the side panel's facts for each phase ─────────────────────

export interface Narration {
  eyebrow: string;
  title: string;
  who: string;
  timebox: string;
  output: string;
  body: string;
}

export function narrationFor(w: World): Narration {
  const { key, sprint, day } = w.phase;
  switch (key) {
    case 'intro':
      return {
        eyebrow: 'Before the first Sprint',
        title: 'One Scrum Team, one drone',
        who: 'A Product Owner, a Scrum Master and four Developers',
        timebox: 'Three one-week Sprints',
        output: 'A parcel drone that grows on the pedestal, part by part',
        body: 'Nobody in the room is anybody’s manager, and there is no project manager — which is the first thing that surprises people about Scrum. Click any miniature or object at any time for who it is and what it owns.',
      };
    case 'backlog':
      return {
        eyebrow: 'Artefact',
        title: 'The Product Backlog',
        who: 'Owned and ordered by the Product Owner',
        timebox: 'Never finished — refined continuously',
        output: 'One ordered list, the only source of work',
        body: 'Not buckets, not “high, medium, low”: an order, so the top item is always unambiguous. Everything the drone might ever need is here, from the frame to a solar skin nobody will reach this quarter.',
      };
    case 'refinement':
      return {
        eyebrow: 'Activity · ongoing',
        title: 'Backlog Refinement (grooming)',
        who: 'The Product Owner and the Developers; the Scrum Master may facilitate',
        timebox: 'Ongoing — usually no more than about 10% of the Developers’ time',
        output: 'Top items small, clear and ready for Sprint Planning',
        body: 'Refinement — often called backlog grooming — adds detail to Product Backlog items: what they mean, their acceptance criteria, their order and their size. It is not one of the five Scrum events. It happens all the time, usually as a short session each Sprint, so that Sprint Planning never starts with a question nobody can answer.',
      };
    case 'estimation':
      return {
        eyebrow: 'Practice · part of refinement',
        title: 'Story estimation: Planning Poker',
        who: 'The Developers — the people who will do the work',
        timebox: 'A few minutes per story',
        output: 'A size in story points on each card',
        body: 'Everyone chooses a card privately and reveals at once, so nobody anchors on the loudest voice. If the votes differ, the highest and lowest explain, then everyone votes again. Points measure relative size, effort and uncertainty, not hours. The Product Owner answers questions but does not vote. Planning Poker is a common practice; the Scrum Guide does not require any particular estimation technique.',
      };
    case 'planning':
      return {
        eyebrow: `Event · Sprint ${sprint}`,
        title: 'Sprint Planning',
        who: 'The whole Scrum Team',
        timebox: 'Max 8 hours for a one-month Sprint — about 2 hours for this one-week Sprint',
        output: `A Sprint Goal (“${SPRINT_GOALS[sprint - 1]}”) and a Sprint Backlog`,
        body: 'Three topics, in order: why this Sprint is valuable, what can be Done, and how the work will get done. Only the Developers decide how many items to take on. Because the top cards were refined and estimated beforehand, the meeting is quick.',
      };
    case 'daily':
      return {
        eyebrow: `Event · Sprint ${sprint}, day ${day}`,
        title: 'The Daily Scrum',
        who: 'The Developers. The Scrum Master listens from outside the circle; the Product Owner is not required',
        timebox: '15 minutes, same time and place, every working day',
        output: 'An adapted plan for the next 24 hours',
        body: 'It is the Developers’ meeting, not a status report to a manager. Problems are named in the fifteen minutes and solved afterwards, which is why the meeting stays short all year.',
      };
    case 'work':
      return {
        eyebrow: `Sprint ${sprint} · day ${day} of ${DAYS}`,
        title: 'The Sprint, from the inside',
        who: 'The Developers, with the Product Owner one question away',
        timebox: 'One week, and the same length every Sprint',
        output: 'A Done Increment — each item that reaches Done bolts a real part onto the drone',
        body: 'Cards cross the Sprint Backlog from To Do to Doing to Done. The Sprint Backlog is the Developers’ plan and they change it daily. Nobody adds work that puts the Sprint Goal at risk.',
      };
    case 'refine':
      return {
        eyebrow: `Activity · Sprint ${sprint}, day 3`,
        title: 'Backlog Refinement, mid-Sprint',
        who: 'The Product Owner and the Developers',
        timebox: 'About an hour — well under 10% of the Sprint',
        output: 'The next Sprint’s items ready; the current Sprint untouched',
        body: 'Refinement happens during a Sprint, for future Sprints. It keeps the top of the Product Backlog ready so the next Sprint Planning is short. New cards — like the Rain sensor — are sized here.',
      };
    case 'review':
      return {
        eyebrow: `Event · Sprint ${sprint}`,
        title: 'The Sprint Review',
        who: 'The Scrum Team and its stakeholders',
        timebox: 'Max 4 hours for a one-month Sprint — about an hour here',
        output: 'A revised Product Backlog',
        body: 'The people who wanted the product see what is really Done and say what should happen next. Not a sign-off and not a performance: the backlog changes in the room, on the evidence of a working Increment.',
      };
    case 'retro':
      return {
        eyebrow: `Event · Sprint ${sprint}`,
        title: 'The Sprint Retrospective',
        who: 'The Scrum Team only — the stakeholders have gone',
        timebox: 'Max 3 hours for a one-month Sprint — about 45 minutes here',
        output: 'One improvement, taken into the next Sprint',
        body: 'The last event of the Sprint, and the only one about the team rather than the product. One change, not ten, so it actually happens. The Definition of Done can change here, deliberately, for future work.',
      };
    case 'shipped':
    default:
      return {
        eyebrow: 'After three Sprints',
        title: 'Three Increments, one flying drone',
        who: 'The Scrum Team',
        timebox: 'Three weeks, with a product that could have shipped after any one of them',
        output: 'Nine Done items on the drone, two still on the backlog',
        body: 'The drone that lifts off was never planned in full. Nine items were built in the order they were worth building, one card arrived from a stakeholder who watched it hover, and each Sprint ran a little better than the last.',
      };
  }
}

// ─── The things the reader can click ──────────────────────────────────────

export type SelectableId = ActorId | 'backlog-wall' | 'sprint-board' | 'drone' | 'rug' | 'table' | 'retro-board' | 'goal';

export interface SelectableInfo {
  eyebrow: string;
  title: string;
  lines: [string, string][];
  body: string;
  trap: string;
}

export function infoFor(id: SelectableId): SelectableInfo {
  switch (id) {
    case 'po':
      return {
        eyebrow: 'Accountability · Product Owner', title: 'Priya — Product Owner',
        lines: [['Accountable for', 'Maximising the value of the product'], ['Owns', 'The Product Backlog and its order, the Product Goal'], ['Decides', 'What is built next, and what is released']],
        body: 'One person, not a committee. Priya writes and orders the backlog, keeps every item clear enough to build, and represents the customer to the Developers. She cancels a Sprint if its Goal becomes obsolete — nobody else can.',
        trap: 'She does not decide how much the Developers take into a Sprint, and she cannot waive the Definition of Done. A Product Owner who assigns tasks has become a project manager with a new title.',
      };
    case 'sm':
      return {
        eyebrow: 'Accountability · Scrum Master', title: 'Sam — Scrum Master',
        lines: [['Accountable for', 'The team’s effectiveness, and Scrum being understood'], ['Serves', 'The Developers, the Product Owner, and the organisation'], ['Removes', 'Impediments — the red block on Ben’s desk']],
        body: 'A servant-leader, not a boss and not a secretary. Sam coaches the team to manage itself, keeps the events useful and inside their timeboxes, and clears whatever is stopping the work. Watch where Sam stands at the Daily Scrum: outside the circle.',
        trap: 'The Scrum Master does not assign work, does not run the Daily Scrum, and does not report progress upward. If the team could not function for a week without them, they are managing, not coaching.',
      };
    case 'd1': case 'd2': case 'd3': case 'd4': {
      const a = actorById(id);
      return {
        eyebrow: 'Accountability · Developers', title: `${a.name} — Developer`,
        lines: [['Accountable for', 'A usable Increment every Sprint'], ['Owns', 'The Sprint Backlog and the Definition of Done'], ['Decides', 'How much to take on, and how to build it']],
        body: `${a.name} is one of four Developers, and “Developer” here means anyone doing the work — engineer, designer, tester, whatever the job title says. Between them they hold every skill the drone needs. ${id === 'd4' ? 'Dee carries no card of her own this Sprint: she pairs on the hard items and tests everything before it is called Done.' : 'They plan their own Sprint, adapt the plan every day, and hold themselves to the Definition of Done.'}`,
        trap: 'No sub-teams, no hierarchy, no “front-end team” inside the team. And only the Developers decide how much work enters a Sprint — a number imposed from outside is a target, not a forecast.',
      };
    }
    case 's1': case 's2': {
      const a = actorById(id);
      return {
        eyebrow: 'Not on the Scrum Team', title: `${a.name} — stakeholder`,
        lines: [['Attends', 'The Sprint Review only'], ['Brings', 'Feedback on a working Increment'], ['Does not', 'Attend the Daily Scrum or the Retrospective']],
        body: `${a.name} ${id === 's1' ? 'runs the courier depot the drones will fly from' : 'heads operations and signs the cheques'}. Stakeholders see the real Increment every Sprint and say what should happen next; the “Rain sensor” card came from exactly this conversation.`,
        trap: 'Stakeholders talk to the Product Owner, who orders the backlog. A stakeholder who walks up to a Developer’s desk and asks for “one small thing” is how a Sprint Goal quietly dies.',
      };
    }
    case 'backlog-wall':
      return {
        eyebrow: 'Artefact · commitment: the Product Goal', title: 'The Product Backlog',
        lines: [['Owned by', 'The Product Owner'], ['Timebox', 'None — it is never finished'], ['Commitment', 'The Product Goal: a working parcel drone']],
        body: 'The single ordered list of everything that might be needed. One list, one owner, refined continuously. It is the only source of work: if it is not on the wall, nobody builds it. “? pts” means the Developers have not estimated a card yet; a green dot means it has been refined and is ready for Sprint Planning.',
        trap: 'Ordered, not prioritised into buckets. The moment two items are “equally first”, somebody outside the team is choosing.',
      };
    case 'sprint-board':
      return {
        eyebrow: 'Artefact · commitment: the Sprint Goal', title: 'The Sprint Backlog',
        lines: [['Owned by', 'The Developers'], ['Updated', 'Every day, by them'], ['Commitment', 'The Sprint Goal on the sign above it']],
        body: 'The Sprint Goal, the items pulled to meet it, and the plan for delivering them. Only the Developers change it, and they change it daily as the work teaches them what it involves. The green card is the improvement from the last Retrospective.',
        trap: 'Scope can be clarified and renegotiated with the Product Owner mid-Sprint. What cannot happen is somebody adding work that puts the Sprint Goal at risk.',
      };
    case 'drone':
      return {
        eyebrow: 'Artefact · commitment: the Definition of Done', title: 'The Increment',
        lines: [['Owned by', 'The Developers, through the Definition of Done'], ['Exists', 'The moment an item is Done — not only at the Review'], ['Commitment', 'The Definition of Done']],
        body: 'A concrete, usable stepping stone toward the Product Goal. Every part on this drone is a backlog item that met the Definition of Done: built, tested, and flyable. Several Increments can exist inside one Sprint.',
        trap: 'An item that is built but does not meet the Definition of Done is not on the drone, does not count, and goes back to the Product Backlog. The Product Owner cannot accept it anyway.',
      };
    case 'rug':
      return {
        eyebrow: 'Event · 15 minutes', title: 'The Daily Scrum spot',
        lines: [['Who', 'The Developers'], ['Timebox', '15 minutes, every working day'], ['Output', 'A plan for the next 24 hours']],
        body: 'Same time, same place, standing up. Progress toward the Sprint Goal is inspected and the day is re-planned. The three questions — did, will, blocked — are one way to run it, not a rule.',
        trap: 'It is not a status report to management, and problems are not solved in it. Name the impediment, take it offline, and the meeting stays fifteen minutes all year.',
      };
    case 'table':
      return {
        eyebrow: 'Estimation and Sprint Planning', title: 'The planning table',
        lines: [['Planning Poker', 'The Developers · a few minutes per story'], ['Sprint Planning', 'Whole Scrum Team · max 8 hours a month'], ['Scales', 'Planning shrinks with a shorter Sprint']],
        body: 'Before the first Sprint the Developers size the backlog here with Planning Poker. Each Sprint then starts here too: why this Sprint matters, what can be Done, and how it will be done.',
        trap: 'Only the Developers estimate and only they decide how much goes into a Sprint. A manager who sets the number has turned a forecast into a target.',
      };
    case 'retro-board':
      return {
        eyebrow: 'Event · max 3 hours a month', title: 'The Retrospective corner',
        lines: [['Who', 'The Scrum Team only'], ['Timebox', 'Max 3 hours for a one-month Sprint'], ['Output', 'One improvement, into the next Sprint Backlog']],
        body: 'The last event of the Sprint and the only one about the team. What went well, what hurt, and one thing to change. The improvement goes on a green card into the next Sprint so it becomes work rather than intention.',
        trap: 'Ten improvements is none. One, done, beats a list that is admired and forgotten.',
      };
    case 'goal':
    default:
      return {
        eyebrow: 'The Sprint Backlog’s commitment', title: 'The Sprint Goal',
        lines: [['Written by', 'The whole team, in Sprint Planning'], ['Proposed by', 'The Product Owner'], ['Fixed for', 'The whole Sprint']],
        body: 'One sentence that says why this Sprint is worth running. Items can be renegotiated as the work teaches the team things; the Goal is what stays fixed, and it is what the Daily Scrum inspects progress toward.',
        trap: 'A Sprint Goal that lists the items is not a goal. “Ship the rotors, battery and frame” tells the team nothing when the battery slips; “it lifts off” tells them what to protect.',
      };
  }
}
