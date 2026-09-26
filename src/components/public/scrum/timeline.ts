// ─── The Scrum studio's clock, and everything derived from it ─────────────
// MBI804 · Lesson 3 (/scrum-simulation). The 3D scene in ScrumStudio.tsx
// does no bookkeeping of its own: every frame it asks this file "what does
// the studio look like at t seconds?" and moves each miniature, card and
// drone part toward the answer. Pure functions of time mean the reader can
// scrub, jump to any event and change speed without the scene ever getting
// into a state the timeline did not describe.
//
// Facts — who attends what, the timeboxes, who owns which artefact — follow
// the 2020 Scrum Guide and agree with Lesson 2's ScrumCycle widget. The
// studio runs one-week Sprints of five working days, so Sprint Planning is
// about two hours, the Review about one, the Retrospective about 45 minutes:
// each is the Guide's one-month maximum scaled to a fifth, which is the
// proportional rule Lesson 2 demonstrates.

export type PhaseKey =
  | 'intro'
  | 'backlog'
  | 'planning'
  | 'daily'
  | 'work'
  | 'review'
  | 'retro'
  | 'shipped';

export interface Phase {
  key: PhaseKey;
  /** 1-based Sprint number; 0 before the first Sprint starts. */
  sprint: number;
  /** Working day inside the Sprint, 1..DAYS, only for daily and work. */
  day?: number;
  start: number;
  end: number;
  dur: number;
  /** Where the timeline chips send the reader. Every phase but the daily
   *  and work ones, which are addressed by Sprint and day instead. */
  label: string;
}

export const DAYS = 5;
export const SPRINTS = 3;

/** Seconds at 1× speed. The whole run is about three and a half minutes. */
const DUR: Record<PhaseKey, number> = {
  intro: 6,
  backlog: 10,
  planning: 10,
  daily: 4.5,
  work: 5,
  review: 10,
  retro: 8,
  shipped: 10,
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
  /** Story points, as the Developers estimated them. */
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
 *  above Lights, and it is built in Sprint 3. */
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
  'Refine the backlog on Wednesdays',
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
  const push = (key: PhaseKey, sprint: number, label: string, day?: number) => {
    const dur = DUR[key];
    out.push({ key, sprint, day, start: t, end: t + dur, dur, label });
    t += dur;
  };
  push('intro', 0, 'The studio');
  push('backlog', 0, 'Product Backlog');
  for (let s = 1; s <= SPRINTS; s++) {
    push('planning', s, `Sprint ${s} Planning`);
    for (let d = 1; d <= DAYS; d++) {
      push('daily', s, `Day ${d} · Daily Scrum`, d);
      push('work', s, `Day ${d} · the work`, d);
    }
    push('review', s, `Sprint ${s} Review`);
    push('retro', s, `Sprint ${s} Retrospective`);
  }
  push('shipped', SPRINTS + 1, 'After three Sprints');
  return out;
}

export const PHASES: Phase[] = buildPhases();
export const TOTAL = PHASES[PHASES.length - 1].end;

export function phaseAt(t: number): Phase {
  const tt = ((t % TOTAL) + TOTAL) % TOTAL;
  for (const ph of PHASES) if (tt < ph.end) return ph;
  return PHASES[PHASES.length - 1];
}

// ─── Studio geometry: where things are ────────────────────────────────────
// x runs left→right, z runs back→front (toward the default camera). y is up.

export type V2 = [number, number];

export const SPOT = {
  backlogWall: [-5.3, -3.3] as V2,
  poDesk: [-4.3, -2.2] as V2,
  poAtWall: [-4.6, -2.3] as V2,
  table: [0, -2.4] as V2,
  board: [3.4, -3.3] as V2,
  desks: [[-2.6, 0.9], [-0.9, 0.9], [0.8, 0.9], [2.5, 0.9]] as V2[],
  pedestal: [5.1, 0.7] as V2,
  rug: [-3.6, 2.6] as V2,
  retroBoard: [6.7, -1.7] as V2,
  retroSpot: [5.4, -1.7] as V2,
  door: [-6.6, 4.4] as V2,
  smHome: [1.6, -0.9] as V2,
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

/** Which Developer picks up the n-th item of a Sprint. The fourth
 *  Developer pairs and tests, which is why an impediment on the second item
 *  is theirs to help with. */
const ITEM_DEV: ActorId[] = ['d1', 'd2', 'd3'];

// ─── Derived world state ──────────────────────────────────────────────────

export type CardLoc = 'hidden' | 'pile' | 'backlog' | 'todo' | 'doing' | 'done';

export interface CardState {
  loc: CardLoc;
  /** Row inside the location. */
  slot: number;
  /** Which desk it is being worked on at, when doing. */
  desk?: number;
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
  /** Parts fitted this Sprint but not yet shown at a Review. */
  freshParts: string[];
  impediment: Impediment;
  /** 1 → 0 across the Daily Scrum. */
  standupTimer: number | null;
  goalLit: boolean;
  goalText: string;
  stakeholders: boolean;
  /** Retro sticky pinned to the retro board. */
  retroNote: string | null;
  /** Improvement card sitting in the Sprint Backlog this Sprint. */
  improvement: string | null;
  /** Where the camera should be looking. */
  focus: [number, number, number];
  /** Drone lifted off the pedestal for a demonstration. */
  hover: number;
  rainRaised: boolean;
}

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** Where the item list of a Sprint sits on the days of that Sprint. Returns
 *  the location of each of the three items given the day and progress. */
function sprintCards(day: number, phase: PhaseKey, p: number): [CardLoc, CardLoc, CardLoc] {
  const w = phase === 'work';
  // Day 1: A starts. Day 2: A done, B starts. Day 3: B blocked (stays doing).
  // Day 4: B done after the impediment clears, C starts. Day 5: C done.
  if (day === 1) return [w && p > 0.15 ? 'doing' : 'todo', 'todo', 'todo'];
  if (day === 2) return ['doing', 'todo', 'todo'].map((_, i) => {
    if (i === 0) return w && p > 0.3 ? 'done' : 'doing';
    if (i === 1) return w && p > 0.55 ? 'doing' : 'todo';
    return 'todo';
  }) as [CardLoc, CardLoc, CardLoc];
  if (day === 3) return ['done', 'doing', 'todo'];
  if (day === 4) return ['done', w && p > 0.45 ? 'done' : 'doing', w && p > 0.65 ? 'doing' : 'todo'];
  return ['done', 'done', w && p > 0.6 ? 'done' : 'doing'];
}

export function deriveWorld(t: number): World {
  const phase = phaseAt(t);
  const tt = ((t % TOTAL) + TOTAL) % TOTAL;
  const p = Math.min(1, Math.max(0, (tt - phase.start) / phase.dur));
  const { key, sprint, day } = phase;

  // Which Sprints are entirely behind us, and what they built.
  const sprintsDone = key === 'shipped' ? SPRINTS : key === 'review' || key === 'retro' ? sprint : sprint - 1;
  const rainRaised = sprintsDone >= 1 && !(key === 'review' && sprint === 1 && p < 0.55);
  const order = backlogOrder(rainRaised);

  const cards: Record<string, CardState> = {};
  const parts: string[] = [];
  for (let s = 1; s <= Math.min(sprintsDone, SPRINTS); s++) parts.push(...SPRINT_PLAN[s - 1]);

  // Everything still on the Product Backlog.
  const doneIds = new Set(parts);
  const inSprint = new Set<string>(key === 'planning' || key === 'daily' || key === 'work' ? SPRINT_PLAN[sprint - 1] : []);
  let slot = 0;
  for (const id of order) {
    if (doneIds.has(id)) continue;
    if (inSprint.has(id)) continue;
    if (id === 'rain' && !rainRaised) { cards[id] = { loc: 'hidden', slot: 0 }; continue; }
    if (key === 'intro') { cards[id] = { loc: 'pile', slot }; slot++; continue; }
    if (key === 'backlog') {
      // Cards leave the pile one at a time and settle into order on the wall.
      const arrive = 0.1 + (slot / order.length) * 0.8;
      cards[id] = { loc: p >= arrive ? 'backlog' : 'pile', slot };
      slot++;
      continue;
    }
    cards[id] = { loc: 'backlog', slot };
    slot++;
  }
  for (const id of doneIds) cards[id] = { loc: 'hidden', slot: 0 };

  // The Sprint's own three items.
  let freshParts: string[] = [];
  if (key === 'planning') {
    SPRINT_PLAN[sprint - 1].forEach((id, i) => {
      const pull = 0.35 + i * 0.18;
      const backlogSlot = order.filter(x => !doneIds.has(x)).indexOf(id);
      cards[id] = p >= pull ? { loc: 'todo', slot: i } : { loc: 'backlog', slot: backlogSlot };
    });
  } else if (key === 'daily' || key === 'work') {
    const locs = sprintCards(day!, key, p);
    SPRINT_PLAN[sprint - 1].forEach((id, i) => {
      cards[id] = { loc: locs[i], slot: i, desk: i };
      if (locs[i] === 'done') freshParts.push(id);
    });
  } else if (key === 'review' || key === 'retro') {
    freshParts = SPRINT_PLAN[sprint - 1];
    for (const id of freshParts) cards[id] = { loc: key === 'review' && p < 0.8 ? 'done' : 'hidden', slot: SPRINT_PLAN[sprint - 1].indexOf(id) };
  }
  // Parts fitted so far this Sprint show on the drone straight away — an
  // Increment exists the moment an item is Done, not only at the Review.
  const partsNow = [...parts, ...freshParts.filter(id => !parts.includes(id))];

  // ── Impediment: lands on the second item's desk on day 3, raised at the
  //    day-4 Daily Scrum, removed by the Scrum Master during it.
  let impediment: Impediment = 'none';
  if (key === 'work' && day === 3 && p > 0.4) impediment = 'on-desk';
  if (key === 'daily' && day === 4) impediment = p < 0.45 ? 'on-desk' : p < 0.85 ? 'raised' : 'gone';

  // ── Sprint Goal sign and improvement card.
  const goalLit = (key === 'planning' && p > 0.25) || key === 'daily' || key === 'work' || key === 'review';
  const goalText = sprint >= 1 && sprint <= SPRINTS ? SPRINT_GOALS[sprint - 1] : '';
  const improvement = sprint >= 2 && sprint <= SPRINTS && (key === 'daily' || key === 'work' || (key === 'planning' && p > 0.7))
    ? RETRO_IMPROVEMENTS[sprint - 2] : null;
  const retroNote = key === 'retro' && p > 0.55 && sprint <= SPRINTS ? RETRO_IMPROVEMENTS[sprint - 1] : null;

  // ── Actors.
  const A = (target: V2, anim: Anim = 'idle', face?: number, hidden = false): ActorState => ({ target, anim, face, hidden });
  const FACE_CAM = 0; // yaw 0 looks toward +z, i.e. the reader
  const FACE_BACK = Math.PI;
  const actors = {} as Record<ActorId, ActorState>;
  const devs: ActorId[] = ['d1', 'd2', 'd3', 'd4'];

  const atDesks = (anim: Anim) => {
    devs.forEach((id, i) => { actors[id] = A([SPOT.desks[i][0], SPOT.desks[i][1] - 0.75], anim, FACE_CAM); });
  };
  const stakeholdersAway = () => {
    actors.s1 = A(SPOT.door, 'away', undefined, true);
    actors.s2 = A([SPOT.door[0] - 0.6, SPOT.door[1] + 0.4], 'away', undefined, true);
  };
  const roundTable = (ids: ActorId[], anim: Anim, r = 1.35) => {
    ids.forEach((id, i) => {
      const pos = ring(SPOT.table, r, ids.length, Math.PI * 0.5 + 0.35, i);
      actors[id] = A(pos, anim, Math.atan2(SPOT.table[0] - pos[0], SPOT.table[1] - pos[1]));
    });
  };

  stakeholdersAway();
  switch (key) {
    case 'intro': {
      actors.po = A(SPOT.poDesk, 'idle', FACE_CAM);
      actors.sm = A(SPOT.smHome, 'idle', FACE_CAM);
      atDesks('idle');
      break;
    }
    case 'backlog': {
      actors.po = A(SPOT.poAtWall, 'point', Math.atan2(SPOT.backlogWall[0] - SPOT.poAtWall[0], SPOT.backlogWall[1] - SPOT.poAtWall[1]));
      actors.sm = A([-3.2, -1.6], 'nod', Math.atan2(SPOT.backlogWall[0] + 3.2, SPOT.backlogWall[1] + 1.6));
      atDesks('work');
      break;
    }
    case 'planning': {
      roundTable(['po', 'd1', 'd2', 'd3', 'd4', 'sm'], p < 0.3 ? 'talk' : 'nod');
      break;
    }
    case 'daily': {
      // Developers in a circle on the rug. The Scrum Master listens from
      // just outside it; the Product Owner is refining at the wall.
      devs.forEach((id, i) => {
        const pos = ring(SPOT.rug, 0.85, 4, Math.PI * 0.25, i);
        actors[id] = A(pos, id === 'd2' && impediment === 'raised' ? 'point' : 'talk', Math.atan2(SPOT.rug[0] - pos[0], SPOT.rug[1] - pos[1]));
      });
      if (day === 4 && impediment !== 'none' && p > 0.5) {
        // Sam goes to the desk to clear the blocker.
        const d = SPOT.desks[1];
        const smAtDesk: V2 = [d[0] - 0.7, d[1] + 0.2];
        actors.sm = A(smAtDesk, impediment === 'gone' ? 'celebrate' : 'work', faceTo(smAtDesk, d));
      } else {
        const smPos: V2 = [SPOT.rug[0] + 1.5, SPOT.rug[1] + 0.6];
        actors.sm = A(smPos, 'nod', Math.atan2(SPOT.rug[0] - smPos[0], SPOT.rug[1] - smPos[1]));
      }
      actors.po = A(SPOT.poAtWall, 'work', Math.atan2(SPOT.backlogWall[0] - SPOT.poAtWall[0], SPOT.backlogWall[1] - SPOT.poAtWall[1]));
      break;
    }
    case 'work': {
      atDesks('work');
      // The blocked Developer stops and scratches their head.
      if (impediment === 'on-desk') actors.d2 = { ...actors.d2, anim: 'idle' };
      // Sam drifts between the board and the desks; Priya answers a question at desk 3 on day 2.
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
      const showing = p > 0.25;
      actors.s1 = A(showing ? [c[0] - 0.9, c[1] + 0.2] : SPOT.door, showing ? (p > 0.5 ? 'clap' : 'nod') : 'idle', showing ? Math.atan2(SPOT.pedestal[0] - (c[0] - 0.9), SPOT.pedestal[1] - (c[1] + 0.2)) : undefined);
      actors.s2 = A(showing ? [c[0] + 0.4, c[1] + 0.5] : [SPOT.door[0] - 0.6, SPOT.door[1] + 0.4], showing ? (p > 0.55 ? 'point' : 'nod') : 'idle', showing ? Math.atan2(SPOT.pedestal[0] - (c[0] + 0.4), SPOT.pedestal[1] - (c[1] + 0.5)) : undefined);
      const poPos: V2 = [SPOT.pedestal[0] - 1.3, SPOT.pedestal[1] + 0.5];
      const smPos: V2 = [SPOT.pedestal[0] + 1.1, SPOT.pedestal[1] + 1.1];
      actors.po = A(poPos, p > 0.6 ? 'nod' : 'talk', faceTo(poPos, c));
      actors.sm = A(smPos, 'nod', faceTo(smPos, SPOT.pedestal));
      devs.forEach((id, i) => {
        const pos: V2 = [SPOT.pedestal[0] - 1.6 + i * 0.75, SPOT.pedestal[1] - 1.1];
        actors[id] = A(pos, i === 1 && p > 0.3 ? 'point' : 'talk', Math.atan2(SPOT.pedestal[0] - pos[0], SPOT.pedestal[1] + 0.6 - pos[1]));
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
        actors[id] = A(pos, 'celebrate', Math.atan2(SPOT.pedestal[0] - pos[0], SPOT.pedestal[1] - pos[1]));
      });
      break;
    }
  }

  // ── Camera focus and drone hover.
  const F = (x: number, y: number, z: number): [number, number, number] => [x, y, z];
  const focus =
    key === 'intro' ? F(0, 0.6, 0)
    : key === 'backlog' ? F(SPOT.backlogWall[0] + 0.6, 1.7, SPOT.backlogWall[1] + 0.8)
    : key === 'planning' ? F(1.5, 1.4, -2.8)
    : key === 'daily' ? F(SPOT.rug[0], 0.7, SPOT.rug[1])
    : key === 'work' ? F(1.4, 1.0, -0.6)
    : key === 'review' ? F(SPOT.pedestal[0] - 0.3, 1.0, SPOT.pedestal[1] + 0.9)
    : key === 'retro' ? F(SPOT.retroSpot[0] + 0.6, 1.1, SPOT.retroSpot[1])
    : F(SPOT.pedestal[0] - 0.4, 1.8, SPOT.pedestal[1] + 0.6);

  const hover = key === 'review' ? smooth((p - 0.3) / 0.25) * (1 - smooth((p - 0.85) / 0.15))
    : key === 'shipped' ? smooth(p / 0.2) : 0;

  return {
    t: tt,
    phase,
    p,
    sprint,
    day,
    cards,
    actors,
    parts: partsNow,
    freshParts,
    impediment,
    standupTimer: key === 'daily' ? 1 - p : null,
    goalLit,
    goalText,
    stakeholders: key === 'review',
    retroNote,
    improvement,
    focus,
    hover,
    rainRaised,
  };
}

// ─── Camera vantage per phase ─────────────────────────────────────────────

export const VANTAGE: Record<PhaseKey, [number, number, number]> = {
  intro: [0.5, 7.5, 12.5],
  backlog: [-6.8, 4.0, 3.6],
  planning: [1.2, 4.8, 4.6],
  daily: [-3.0, 4.6, 8.0],
  work: [1.4, 6.2, 9.6],
  review: [2.0, 4.2, 6.8],
  retro: [2.0, 4.6, 2.2],
  shipped: [3.0, 4.4, 6.8],
};

// ─── Narration ────────────────────────────────────────────────────────────

export interface Narration {
  eyebrow: string;
  title: string;
  who: string;
  timebox: string;
  output: string;
  body: string;
  /** What to look at in the scene right now. */
  watch: string;
}

export function narrationFor(w: World): Narration {
  const { key, sprint, day } = w.phase;
  switch (key) {
    case 'intro':
      return {
        eyebrow: 'Before the first Sprint',
        title: 'One Scrum Team, one drone',
        who: 'Six people: a Product Owner, a Scrum Master and four Developers',
        timebox: 'The whole run is three one-week Sprints',
        output: 'A parcel drone that grows on the pedestal, part by part',
        body: 'Priya owns what gets built. Sam owns how well the team works. Aroha, Ben, Chen and Dee build it. Nobody in the room is anybody’s manager, and there is no project manager — which is the first thing that surprises people about Scrum.',
        watch: 'Press play, or use the chips to jump to any event. Click any miniature or object for who it is and what it owns.',
      };
    case 'backlog':
      return {
        eyebrow: 'Artefact',
        title: 'The Product Backlog',
        who: 'Owned and ordered by the Product Owner',
        timebox: 'Never finished — refined continuously',
        output: 'One ordered list, the only source of work',
        body: 'Priya turns a pile of ideas into a single ordered list on the wall. Not buckets, not “high, medium, low”: an order, so the top item is always unambiguous. Everything the drone might ever need is here, from the frame to a solar skin nobody will reach this quarter.',
        watch: 'Watch the cards leave the pile one at a time and settle in order. The Scrum Master is watching too, but the order is Priya’s call alone.',
      };
    case 'planning':
      return {
        eyebrow: `Event · Sprint ${sprint}`,
        title: 'Sprint Planning',
        who: 'The whole Scrum Team',
        timebox: 'Max 8 hours for a one-month Sprint — about 2 hours for this one-week Sprint',
        output: `A Sprint Goal (“${SPRINT_GOALS[sprint - 1]}”) and a Sprint Backlog`,
        body: 'Three questions in order. Why is this Sprint valuable — Priya proposes, the team shapes it into a Sprint Goal. What can be done — the Developers pull items from the top of the backlog until they are no longer confident of finishing. How will it be done — they break each item into tasks.',
        watch: sprint === 1
          ? 'The top three cards fly from the Product Backlog to the To Do column, and the Sprint Goal lights up over the board. Only the Developers decide how many cards move.'
          : `Same three questions, and a green card too: the improvement the team chose in last Sprint’s Retrospective goes into this Sprint Backlog so it actually happens.`,
      };
    case 'daily': {
      const raised = day === 4;
      return {
        eyebrow: `Event · Sprint ${sprint}, day ${day}`,
        title: 'The Daily Scrum',
        who: 'The Developers. The Scrum Master listens from outside the circle; the Product Owner is not required',
        timebox: '15 minutes, same time and place, every working day',
        output: 'An adapted plan for the next 24 hours',
        body: 'The four Developers stand in a circle and check progress toward the Sprint Goal: what moved, what will move today, what is in the way. It is their meeting. Sam is outside the circle because the Scrum Master facilitates and coaches but does not run it, and Priya is at the wall refining because it is not a status report to her.',
        watch: raised
          ? 'Ben raises the blocker that landed on his desk yesterday. Watch Sam leave the circle to deal with it — removing impediments is the Scrum Master’s job, and the meeting stays fifteen minutes because the fix happens elsewhere.'
          : 'The ring on the rug is the fifteen-minute timebox running out. Nothing gets solved in the circle; problems are named here and taken away.',
      };
    }
    case 'work': {
      const blocked = w.impediment === 'on-desk';
      return {
        eyebrow: `Sprint ${sprint} · day ${day} of ${DAYS}`,
        title: 'The Sprint, from the inside',
        who: 'The Developers, with the Product Owner one question away',
        timebox: 'One week, and the same length every Sprint',
        output: 'A Done Increment — each item that reaches Done bolts a real part onto the drone',
        body: 'Cards cross the Sprint Board from To Do to Doing to Done, and each one that reaches Done appears on the pedestal at once — an Increment exists the moment an item is Done, not at the end of the Sprint. The Sprint Backlog is the Developers’ plan and they change it daily.',
        watch: blocked
          ? 'A red block has landed on Ben’s desk: the rotors need a part the supplier cannot ship. He stops. Nobody adds work to the Sprint to fill the gap — it gets raised at tomorrow’s Daily Scrum.'
          : day === 2 && sprint === 1
            ? 'Priya walks over to answer Chen’s question about the battery. A Product Owner who is always one question away is what stops a team guessing.'
            : 'Dee has no card of her own: she pairs and tests. On a Scrum Team the skills are collective, and “not my item” is not a sentence anyone says.',
      };
    }
    case 'review':
      return {
        eyebrow: `Event · Sprint ${sprint}`,
        title: 'The Sprint Review',
        who: 'The Scrum Team and its stakeholders',
        timebox: 'Max 4 hours for a one-month Sprint — about an hour here',
        output: 'A revised Product Backlog',
        body: 'The drone lifts off the pedestal in front of the two people who asked for it. This is not a sign-off and not a performance: it is where the people who wanted the product see what is really Done and say what should happen next. The backlog changes in the room, on the evidence of a working Increment.',
        watch: sprint === 1
          ? 'Ms Okafor asks what happens in rain. Watch a brand-new card, “Rain sensor”, appear on the Product Backlog — and watch Priya order it above Lights. That card exists because a stakeholder saw a real Increment.'
          : 'Only Done items are shown. A part that was built but never tested would not be on the drone at all — it would have gone back to the Product Backlog.',
      };
    case 'retro':
      return {
        eyebrow: `Event · Sprint ${sprint}`,
        title: 'The Sprint Retrospective',
        who: 'The Scrum Team only — the stakeholders have gone',
        timebox: 'Max 3 hours for a one-month Sprint — about 45 minutes here',
        output: 'One improvement, taken into the next Sprint',
        body: 'The last event of the Sprint, and the only one about the team rather than the product. What went well, what got in the way, and one thing to do differently — one, so it happens. The Definition of Done can change here, deliberately, for future work.',
        watch: `Watch the sticky go up: “${RETRO_IMPROVEMENTS[sprint - 1]}”. It will be a green card in the next Sprint Backlog, which is how a Retrospective becomes a change rather than a conversation.`,
      };
    case 'shipped':
    default:
      return {
        eyebrow: 'After three Sprints',
        title: 'Three Increments, one flying drone',
        who: 'The Scrum Team',
        timebox: 'Three weeks of a product that could have shipped after any one of them',
        output: 'Nine Done items on the drone, two still on the backlog, and a team that got better each Sprint',
        body: 'The drone that lifts off was never planned in full. Nine items were built in the order they were worth building, one card arrived from a stakeholder who watched it hover, and each Sprint ran a little better than the last. The speaker and the solar skin are still on the wall — the backlog is never finished, and that is the point.',
        watch: 'Then it starts again: the next Sprint begins the moment this one ends. There is no gap, no cool-down week, and no phase called “done”.',
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
        body: 'The single ordered list of everything that might be needed. One list, one owner, refined continuously. It is the only source of work: if it is not on the wall, nobody builds it.',
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
        eyebrow: 'Events · Sprint Planning and the Review', title: 'The planning table',
        lines: [['Sprint Planning', 'Whole Scrum Team · max 8 hours a month'], ['Sprint Review', 'Scrum Team and stakeholders · max 4 hours a month'], ['Both', 'Scale down with a shorter Sprint']],
        body: 'Planning starts the Sprint: why, what, how. The Review closes the work: the Increment is shown to stakeholders and the backlog is adjusted on what they saw. Both produce a decision about the backlog, which is why they sit at the same table.',
        trap: 'A Review with no stakeholders in the room is a demo to yourselves. The feedback loop the whole framework depends on is missing, and the team is running Waterfall with standups.',
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
