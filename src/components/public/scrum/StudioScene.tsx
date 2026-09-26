import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text as DreiText, Billboard } from '@react-three/drei';
import { useMemo, useRef, useState, type ComponentProps, type MutableRefObject, type ReactNode } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  ACTORS, ALL_ITEMS, DAYS, SPOT, TOTAL, VANTAGE,
  deriveWorld, itemById,
  type ActorDef, type ActorId, type CardLoc, type SelectableId, type World,
} from './timeline';

// ─── The studio in three dimensions ───────────────────────────────────────
// Everything here is a reader of `sim.world`, which the Director rewrites
// each frame from the clock. Miniatures walk toward where the world says
// they should be, cards fly to their slot, the drone gains the parts the
// world lists. Nothing in this file decides what happens; it only shows it.
//
// All geometry is primitives — no models to download, no textures, so the
// page carries nothing but code and the three.js chunk it already shares
// with the lecturer's classroom view.

export interface Sim {
  t: number;
  playing: boolean;
  speed: number;
  /** performance.now() until which the reader's own orbiting wins over the
   *  phase vantage. */
  userUntil: number;
  world: World;
  /** True for the frame after a jump, so objects snap instead of travel. */
  snap: boolean;
  lastT: number;
}

export function makeSim(): Sim {
  return { t: 0, playing: false, speed: 1, userUntil: 0, world: deriveWorld(0), snap: true, lastT: 0 };
}

export type SimRef = MutableRefObject<Sim>;

/** Every label in the scene uses the site's own DM Sans, shipped from
 *  public/fonts, so the studio never waits on a third-party font CDN —
 *  drei's Text suspends the whole scene until its font arrives. */
const FONT = `${import.meta.env.BASE_URL}fonts/dm-sans-700.ttf`;
const Text = (props: ComponentProps<typeof DreiText>) => <DreiText font={FONT} {...props} />;

const CARD_Z = -3.29;
const WALL_Z = -3.6;
const PAPER = '#f6ede4';
const INK = '#2b2622';
const PLUM = '#7c2d5c';
const PLUM_SOFT = '#e9cfe0';
const WOOD = '#c9a27c';
const WOOD_DARK = '#8a6647';
const STEEL = '#8d949e';

const damp = (dt: number, k: number) => 1 - Math.exp(-dt * k);
const shortest = (a: number, b: number) => {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
};

// ─── Director: clock, world, camera ───────────────────────────────────────

export function Director({ sim, onTick, controls }: {
  sim: SimRef;
  onTick: (t: number) => void;
  controls: MutableRefObject<OrbitControlsImpl | null>;
}) {
  const camera = useThree(s => s.camera);
  const lastTick = useRef(-1);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const tgt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDt) => {
    const s = sim.current;
    const dt = Math.min(rawDt, 0.08);
    if (s.playing) s.t = (s.t + dt * s.speed) % TOTAL;
    s.snap = Math.abs(s.t - s.lastT) > 1.2 && !(s.lastT > TOTAL - 1.5 && s.t < 1.5);
    s.lastT = s.t;
    s.world = deriveWorld(s.t);

    // Eight HUD updates a second is plenty for a progress bar.
    if (Math.abs(s.t - lastTick.current) > 0.12 || s.snap) {
      lastTick.current = s.t;
      onTick(s.t);
    }

    const c = controls.current;
    const userDriving = performance.now() < s.userUntil;
    tgt.set(...s.world.focus);
    if (!userDriving) {
      vec.set(...VANTAGE[s.world.phase.key]);
      if (s.snap) camera.position.copy(vec);
      else camera.position.lerp(vec, damp(dt, 1.4));
    }
    if (c) {
      if (s.snap) c.target.copy(tgt);
      else c.target.lerp(tgt, damp(dt, 2.2));
      c.update();
    }
  }, -10);

  return null;
}

// ─── Set dressing ─────────────────────────────────────────────────────────

function Floor() {
  return (
    <group>
      {/* The diorama base: a thick slab with a paper top, so the whole studio reads as a model on a table. */}
      <mesh position={[0, -0.22, 0.6]} receiveShadow>
        <boxGeometry args={[15.6, 0.44, 10.4]} />
        <meshStandardMaterial color="#e4d6c8" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.001, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15.6, 10.4]} />
        <meshStandardMaterial color={PAPER} roughness={1} />
      </mesh>
      {/* Back wall with a plum skirting line. */}
      <mesh position={[0, 1.85, WALL_Z - 0.1]} receiveShadow castShadow>
        <boxGeometry args={[15.6, 3.7, 0.2]} />
        <meshStandardMaterial color="#efe3d6" roughness={1} />
      </mesh>
      <mesh position={[0, 0.06, WALL_Z + 0.01]}>
        <boxGeometry args={[15.6, 0.12, 0.02]} />
        <meshStandardMaterial color={PLUM} />
      </mesh>
      {/* Studio name, painted on the wall. */}
      <Text position={[0, 3.3, WALL_Z + 0.01]} fontSize={0.26} color="#cdbfb2" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        THE SCRUM STUDIO
      </Text>
    </group>
  );
}

function Selectable({ id, onSelect, selected, children, label, labelPos }: {
  id: SelectableId;
  onSelect: (id: SelectableId) => void;
  selected: SelectableId | null;
  children: ReactNode;
  label?: string;
  labelPos?: [number, number, number];
}) {
  const [hover, setHover] = useState(false);
  const isSel = selected === id;
  return (
    <group
      onClick={e => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={e => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
    >
      {children}
      {(hover || isSel) && label && labelPos && (
        <Billboard position={labelPos}>
          <Text fontSize={0.17} color={isSel ? PLUM : INK} anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor={PAPER}>
            {label}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function BacklogWall({ sim, onSelect, selected }: { sim: SimRef; onSelect: (id: SelectableId) => void; selected: SelectableId | null }) {
  const [x, z] = SPOT.backlogWall;
  return (
    <Selectable id="backlog-wall" onSelect={onSelect} selected={selected} label="Product Backlog" labelPos={[x, 3.75, z]}>
      <mesh position={[x, 1.9, z - 0.07]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.9, 0.06]} />
        <meshStandardMaterial color={selected === 'backlog-wall' ? PLUM_SOFT : '#fbf7f2'} roughness={0.9} />
      </mesh>
      <mesh position={[x, 1.9, z - 0.1]}>
        <boxGeometry args={[1.6, 3.0, 0.02]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <Text position={[x, 3.22, z - 0.03]} fontSize={0.13} color={PLUM} anchorX="center" anchorY="middle" letterSpacing={0.06}>
        PRODUCT BACKLOG
      </Text>
      <Text position={[x - 0.62, 3.05, z - 0.03]} fontSize={0.075} color="#9a8f86" anchorX="left" anchorY="middle">
        ordered · top = next
      </Text>
      {/* The Product Owner's small desk beside it, where the pile lives. */}
      <Desk x={SPOT.poDesk[0]} z={SPOT.poDesk[1]} w={0.9} laptop={false} />
    </Selectable>
  );
}

function Desk({ x, z, w = 1.1, laptop = true }: { x: number; z: number; w?: number; laptop?: boolean }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.05, 0.6]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (w / 2 - 0.06), 0.36, sz * 0.24]} castShadow>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
          <meshStandardMaterial color={STEEL} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      {laptop && (
        <group position={[0, 0.77, -0.05]}>
          <mesh position={[0, 0.01, 0.08]} castShadow>
            <boxGeometry args={[0.34, 0.02, 0.22]} />
            <meshStandardMaterial color="#3a3f47" />
          </mesh>
          <mesh position={[0, 0.12, -0.04]} rotation={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.34, 0.22, 0.015]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0, 0.12, -0.03]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[0.3, 0.18]} />
            <meshStandardMaterial color="#cfe8ff" emissive="#9cc9ff" emissiveIntensity={0.35} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function PlanningTable({ onSelect, selected }: { onSelect: (id: SelectableId) => void; selected: SelectableId | null }) {
  const [x, z] = SPOT.table;
  return (
    <Selectable id="table" onSelect={onSelect} selected={selected} label="Planning table" labelPos={[x, 1.5, z]}>
      <mesh position={[x, 0.78, z]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.05, 0.06, 40]} />
        <meshStandardMaterial color={selected === 'table' ? PLUM_SOFT : WOOD} roughness={0.7} />
      </mesh>
      <mesh position={[x, 0.38, z]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.74, 16]} />
        <meshStandardMaterial color={STEEL} metalness={0.4} />
      </mesh>
      <mesh position={[x, 0.02, z]}>
        <cylinderGeometry args={[0.45, 0.45, 0.04, 24]} />
        <meshStandardMaterial color={STEEL} metalness={0.4} />
      </mesh>
      {/* Mugs, because a planning meeting without coffee is a myth. */}
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[x + Math.cos(i * 2.1) * 0.6, 0.86, z + Math.sin(i * 2.1) * 0.6]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.1, 12]} />
          <meshStandardMaterial color={['#ffffff', PLUM, '#0f766e'][i]} />
        </mesh>
      ))}
    </Selectable>
  );
}

function SprintBoard({ sim, onSelect, selected }: { sim: SimRef; onSelect: (id: SelectableId) => void; selected: SelectableId | null }) {
  const [x, z] = SPOT.board;
  const sign = useRef<THREE.MeshStandardMaterial>(null);
  const impRef = useRef<THREE.Group>(null);
  const [goal, setGoal] = useState('');
  const [improvement, setImprovement] = useState<string | null>(null);

  useFrame((_, dt) => {
    const w = sim.current.world;
    if (sign.current) {
      const target = w.goalLit ? 0.55 : 0;
      sign.current.emissiveIntensity += (target - sign.current.emissiveIntensity) * damp(dt, 6);
    }
    if (w.goalText !== goal) setGoal(w.goalText);
    if (w.improvement !== improvement) setImprovement(w.improvement);
    if (impRef.current) {
      const s = w.improvement ? 1 : 0;
      impRef.current.scale.setScalar(THREE.MathUtils.lerp(impRef.current.scale.x, s, damp(dt, 8)));
    }
  });

  const cols: [string, number][] = [['TO DO', -0.85], ['DOING', 0], ['DONE', 0.85]];
  return (
    <Selectable id="sprint-board" onSelect={onSelect} selected={selected} label="Sprint Backlog" labelPos={[x, 3.85, z]}>
      <mesh position={[x, 1.95, z - 0.07]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 2.3, 0.06]} />
        <meshStandardMaterial color={selected === 'sprint-board' ? PLUM_SOFT : '#fbf7f2'} roughness={0.9} />
      </mesh>
      <mesh position={[x, 1.95, z - 0.1]}>
        <boxGeometry args={[2.9, 2.4, 0.02]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      {cols.map(([name, dx]) => (
        <group key={name}>
          <Text position={[x + dx, 2.92, z - 0.03]} fontSize={0.11} color={INK} anchorX="center" anchorY="middle" letterSpacing={0.08}>
            {name}
          </Text>
          <mesh position={[x + dx, 2.8, z - 0.03]}>
            <boxGeometry args={[0.7, 0.012, 0.01]} />
            <meshStandardMaterial color={PLUM} />
          </mesh>
        </group>
      ))}
      {[-0.425, 0.425].map(dx => (
        <mesh key={dx} position={[x + dx, 1.95, z - 0.03]}>
          <boxGeometry args={[0.012, 2.1, 0.01]} />
          <meshStandardMaterial color="#e0d3c6" />
        </mesh>
      ))}
      {/* The Sprint Goal on a plank above the board. Lit while a Sprint runs. */}
      <group onClick={e => { e.stopPropagation(); onSelect('goal'); }}>
        <mesh position={[x, 3.38, z - 0.05]} castShadow>
          <boxGeometry args={[2.6, 0.34, 0.08]} />
          <meshStandardMaterial ref={sign} color={INK} emissive={PLUM} emissiveIntensity={0} />
        </mesh>
        <Text position={[x, 3.38, z]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle" maxWidth={2.4}>
          {goal ? `SPRINT GOAL · ${goal.toUpperCase()}` : 'SPRINT GOAL'}
        </Text>
      </group>
      {/* The green improvement card from the last Retrospective. */}
      <group ref={impRef} position={[x - 0.85, 1.05, CARD_Z]} scale={0}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.26, 0.015]} />
          <meshStandardMaterial color="#c9efd3" />
        </mesh>
        <Text position={[0, 0.03, 0.01]} fontSize={0.055} color="#14532d" anchorX="center" anchorY="middle" maxWidth={0.55} textAlign="center">
          {improvement ? `IMPROVE · ${improvement}` : ''}
        </Text>
      </group>
    </Selectable>
  );
}

function Rug({ sim, onSelect, selected }: { sim: SimRef; onSelect: (id: SelectableId) => void; selected: SelectableId | null }) {
  const [x, z] = SPOT.rug;
  const ringRef = useRef<THREE.Mesh>(null);
  const [step, setStep] = useState(0);
  const [label, setLabel] = useState('');
  const geo = useMemo(() => new THREE.RingGeometry(1.12, 1.24, 64, 1, Math.PI / 2, Math.max(0.001, (step / 60) * Math.PI * 2)), [step]);

  useFrame(() => {
    const w = sim.current.world;
    const tm = w.standupTimer;
    const s = tm == null ? 0 : Math.round(tm * 60);
    if (s !== step) setStep(s);
    const secs = tm == null ? 0 : Math.round(tm * 15 * 60);
    const lbl = tm == null ? '' : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    if (lbl !== label) setLabel(lbl);
  });

  return (
    <Selectable id="rug" onSelect={onSelect} selected={selected} label="Daily Scrum · 15 min" labelPos={[x, 1.9, z]}>
      <mesh position={[x, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.3, 48]} />
        <meshStandardMaterial color={selected === 'rug' ? PLUM_SOFT : '#efdfe8'} roughness={1} />
      </mesh>
      <mesh ref={ringRef} geometry={geo} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={PLUM} side={THREE.DoubleSide} />
      </mesh>
      {label && (
        <Billboard position={[x, 1.55, z]}>
          <Text fontSize={0.2} color={PLUM} anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor={PAPER}>
            {label}
          </Text>
        </Billboard>
      )}
    </Selectable>
  );
}

function RetroCorner({ sim, onSelect, selected }: { sim: SimRef; onSelect: (id: SelectableId) => void; selected: SelectableId | null }) {
  const [x, z] = SPOT.retroBoard;
  const noteRef = useRef<THREE.Group>(null);
  const [note, setNote] = useState<string | null>(null);
  useFrame((_, dt) => {
    const w = sim.current.world;
    if (w.retroNote !== note) setNote(w.retroNote);
    if (noteRef.current) {
      const s = w.retroNote ? 1 : 0;
      noteRef.current.scale.setScalar(THREE.MathUtils.lerp(noteRef.current.scale.x, s, damp(dt, 8)));
    }
  });
  return (
    <Selectable id="retro-board" onSelect={onSelect} selected={selected} label="Retrospective" labelPos={[x - 0.4, 2.5, z]}>
      <group position={[x, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 1.3, 0.05]} />
          <meshStandardMaterial color={selected === 'retro-board' ? PLUM_SOFT : '#ffffff'} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.45, -0.03]}>
          <boxGeometry args={[2.4, 1.4, 0.02]} />
          <meshStandardMaterial color={STEEL} metalness={0.3} />
        </mesh>
        {[-0.8, 0.8].map(dx => (
          <mesh key={dx} position={[dx, 0.4, -0.02]} castShadow>
            <boxGeometry args={[0.05, 0.8, 0.05]} />
            <meshStandardMaterial color={STEEL} metalness={0.3} />
          </mesh>
        ))}
        {[['WENT WELL', -0.76], ['IN THE WAY', 0], ['ONE CHANGE', 0.76]].map(([h, dx]) => (
          <Text key={h as string} position={[dx as number, 1.95, 0.03]} fontSize={0.065} color={INK} anchorX="center" anchorY="middle" letterSpacing={0.05}>
            {h}
          </Text>
        ))}
        <group ref={noteRef} position={[0.76, 1.45, 0.04]} scale={0}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.3, 0.012]} />
            <meshStandardMaterial color="#fde68a" />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={0.055} color="#5b3d05" anchorX="center" anchorY="middle" maxWidth={0.46} textAlign="center">
            {note ?? ''}
          </Text>
        </group>
      </group>
    </Selectable>
  );
}

// ─── Cards ────────────────────────────────────────────────────────────────

function cardPose(loc: CardLoc, slot: number): { p: [number, number, number]; r: [number, number, number]; s: number } {
  switch (loc) {
    case 'pile':
      return {
        p: [SPOT.poDesk[0] - 0.2 + (slot % 3) * 0.16, 0.775 + Math.floor(slot / 3) * 0.008 + slot * 0.003, SPOT.poDesk[1] - 0.12 + ((slot * 7) % 5) * 0.05],
        r: [-Math.PI / 2, 0, ((slot * 37) % 11) * 0.09 - 0.45],
        s: 1,
      };
    case 'backlog':
      return { p: [SPOT.backlogWall[0], 2.92 - slot * 0.235, CARD_Z], r: [0, 0, 0], s: 1 };
    case 'todo':
      return { p: [SPOT.board[0] - 0.85, 2.55 - slot * 0.42, CARD_Z], r: [0, 0, 0], s: 1 };
    case 'doing':
      return { p: [SPOT.board[0], 2.55 - slot * 0.42, CARD_Z], r: [0, 0, 0], s: 1 };
    case 'done':
      return { p: [SPOT.board[0] + 0.85, 2.55 - slot * 0.42, CARD_Z], r: [0, 0, 0], s: 1 };
    case 'hidden':
    default:
      return { p: [SPOT.board[0] + 0.85, 1.0, CARD_Z], r: [0, 0, 0], s: 0 };
  }
}

const CARD_COLORS = ['#fde68a', '#fbcfe8', '#bfdbfe', '#bbf7d0', '#fed7aa', '#ddd6fe'];

function Card({ id, sim, index }: { id: string; sim: SimRef; index: number }) {
  const g = useRef<THREE.Group>(null);
  const item = itemById(id);
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), e: new THREE.Euler() }), []);
  useFrame((_, dt) => {
    const w = sim.current.world;
    const st = w.cards[id] ?? { loc: 'hidden' as CardLoc, slot: 0 };
    const pose = cardPose(st.loc, st.slot);
    const o = g.current;
    if (!o) return;
    tmp.p.set(...pose.p);
    if (sim.current.snap) {
      o.position.copy(tmp.p);
      o.rotation.set(...pose.r);
      o.scale.setScalar(pose.s);
      return;
    }
    // Cards in flight arc upward a little so a move reads as a move.
    const dist = o.position.distanceTo(tmp.p);
    const k = damp(dt, 5);
    o.position.lerp(tmp.p, k);
    if (dist > 0.15) o.position.y += Math.min(dist, 1.2) * 0.08;
    o.rotation.x += shortest(o.rotation.x, pose.r[0]) * k;
    o.rotation.y += shortest(o.rotation.y, pose.r[1]) * k;
    o.rotation.z += shortest(o.rotation.z, pose.r[2]) * k;
    o.scale.setScalar(THREE.MathUtils.lerp(o.scale.x, pose.s, damp(dt, 8)));
  });
  return (
    <group ref={g} scale={0}>
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.2, 0.014]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <Text position={[-0.27, 0.02, 0.01]} fontSize={0.07} color={INK} anchorX="left" anchorY="middle" maxWidth={0.5}>
        {item.title}
      </Text>
      <Text position={[0.27, -0.055, 0.01]} fontSize={0.045} color="#6b625b" anchorX="right" anchorY="middle">
        {`${item.points} pts`}
      </Text>
    </group>
  );
}

function Impediment({ sim }: { sim: SimRef }) {
  const g = useRef<THREE.Group>(null);
  const [dx, dz] = SPOT.desks[1];
  useFrame((_, dt) => {
    const w = sim.current.world;
    const o = g.current;
    if (!o) return;
    const on = w.impediment === 'on-desk' || w.impediment === 'raised';
    const s = on ? 1 : 0;
    o.scale.setScalar(THREE.MathUtils.lerp(o.scale.x, s, damp(dt, 7)));
    const bob = w.impediment === 'raised' ? Math.sin(performance.now() / 120) * 0.05 + 0.1 : 0;
    o.position.set(dx + 0.38, 0.87 + bob, dz - 0.08);
    o.rotation.y += dt * (w.impediment === 'raised' ? 2.5 : 0.4);
  });
  return (
    <group ref={g} scale={0}>
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#dc2626" emissive="#7f1d1d" emissiveIntensity={0.4} />
      </mesh>
      <Text position={[0, 0, 0.101]} fontSize={0.14} color="#ffffff" anchorX="center" anchorY="middle">!</Text>
      <Billboard position={[0, 0.32, 0]}>
        <Text fontSize={0.09} color="#b91c1c" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor={PAPER}>
          BLOCKED · part not shipped
        </Text>
      </Billboard>
    </group>
  );
}

// ─── The drone on its pedestal ────────────────────────────────────────────

function Part({ show, children }: { show: boolean; children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const o = g.current;
    if (!o) return;
    const target = show ? 1 : 0;
    const k = show ? damp(dt, 7) : damp(dt, 12);
    const next = THREE.MathUtils.lerp(o.scale.x, target, k);
    // A little overshoot on the way in, so a part "pops" onto the frame.
    o.scale.setScalar(show && next < 0.98 ? next * 1.08 : next);
  });
  return <group ref={g} scale={0}>{children}</group>;
}

function Drone({ sim, onSelect, selected }: { sim: SimRef; onSelect: (id: SelectableId) => void; selected: SelectableId | null }) {
  const [x, z] = SPOT.pedestal;
  const body = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group[]>([]);
  const [parts, setParts] = useState<string[]>([]);
  const has = (id: string) => parts.includes(id);
  const spin = useRef(0);

  useFrame((_, dt) => {
    const w = sim.current.world;
    if (w.parts.length !== parts.length || w.parts.some((p, i) => parts[i] !== p)) setParts([...w.parts]);
    const o = body.current;
    if (!o) return;
    const lift = w.hover;
    o.position.y = THREE.MathUtils.lerp(o.position.y, 1.08 + lift * 1.1 + (lift > 0.5 ? Math.sin(performance.now() / 500) * 0.04 : 0), damp(dt, 4));
    o.rotation.y += dt * (0.25 + lift * 0.9);
    o.rotation.z = THREE.MathUtils.lerp(o.rotation.z, lift * 0.08, damp(dt, 3));
    const rotorSpeed = has('rotors') ? (lift > 0.05 ? 40 : 1.2) : 0;
    spin.current += dt * rotorSpeed;
    rotors.current.forEach(r => { if (r) r.rotation.y = spin.current; });
  });

  const arms: [number, number][] = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
  return (
    <Selectable id="drone" onSelect={onSelect} selected={selected} label="The Increment" labelPos={[x, 2.75, z]}>
      {/* Pedestal */}
      <mesh position={[x, 0.45, z]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.62, 0.9, 32]} />
        <meshStandardMaterial color={selected === 'drone' ? PLUM_SOFT : '#e8dccf'} roughness={0.9} />
      </mesh>
      <mesh position={[x, 0.915, z]}>
        <cylinderGeometry args={[0.58, 0.58, 0.03, 32]} />
        <meshStandardMaterial color={PLUM} />
      </mesh>
      <Text position={[x, 0.55, z + 0.6]} fontSize={0.09} color={PLUM} anchorX="center" anchorY="middle" letterSpacing={0.08}>
        INCREMENT
      </Text>
      {/* The drone */}
      <group ref={body} position={[x, 1.08, z]}>
        <Part show={has('frame')}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.09, 0.36]} />
            <meshStandardMaterial color="#374151" metalness={0.3} roughness={0.5} />
          </mesh>
          {arms.map(([ax, az], i) => (
            <mesh key={i} position={[ax * 0.34, 0, az * 0.3]} rotation={[0, Math.atan2(az, ax), 0]} castShadow>
              <boxGeometry args={[0.5, 0.05, 0.06]} />
              <meshStandardMaterial color="#4b5563" metalness={0.3} />
            </mesh>
          ))}
        </Part>
        <Part show={has('rotors')}>
          {arms.map(([ax, az], i) => (
            <group key={i} position={[ax * 0.52, 0.06, az * 0.44]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.08, 10]} />
                <meshStandardMaterial color="#111827" />
              </mesh>
              <group ref={el => { if (el) rotors.current[i] = el; }} position={[0, 0.05, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.42, 0.012, 0.05]} />
                  <meshStandardMaterial color="#9ca3af" transparent opacity={0.9} />
                </mesh>
                <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
                  <boxGeometry args={[0.42, 0.012, 0.05]} />
                  <meshStandardMaterial color="#9ca3af" transparent opacity={0.9} />
                </mesh>
              </group>
            </group>
          ))}
        </Part>
        <Part show={has('battery')}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <boxGeometry args={[0.28, 0.12, 0.2]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
          <Text position={[0, -0.1, 0.105]} fontSize={0.05} color="#713f12" anchorX="center" anchorY="middle">BATT</Text>
        </Part>
        <Part show={has('camera')}>
          <mesh position={[0, -0.02, 0.24]} castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0, -0.02, 0.3]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.6} />
          </mesh>
        </Part>
        <Part show={has('gps')}>
          <mesh position={[0, 0.14, -0.05]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
            <meshStandardMaterial color="#9ca3af" />
          </mesh>
          <mesh position={[0, 0.25, -0.05]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.5} />
          </mesh>
        </Part>
        <Part show={has('clamp')}>
          {[-1, 1].map(s => (
            <mesh key={s} position={[s * 0.08, -0.24, 0]} rotation={[0, 0, s * 0.25]} castShadow>
              <boxGeometry args={[0.03, 0.16, 0.1]} />
              <meshStandardMaterial color="#6b7280" metalness={0.5} />
            </mesh>
          ))}
          <mesh position={[0, -0.34, 0]} castShadow>
            <boxGeometry args={[0.2, 0.14, 0.16]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
        </Part>
        <Part show={has('rain')}>
          <mesh position={[0, 0.07, 0.1]}>
            <sphereGeometry args={[0.05, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.4} />
          </mesh>
        </Part>
        <Part show={has('lights')}>
          {arms.map(([ax, az], i) => (
            <mesh key={i} position={[ax * 0.56, -0.02, az * 0.48]}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color={az > 0 ? '#ef4444' : '#22c55e'} emissive={az > 0 ? '#ef4444' : '#22c55e'} emissiveIntensity={1.2} />
            </mesh>
          ))}
        </Part>
        <Part show={has('shell')}>
          <mesh position={[0, 0.05, 0]} scale={[1, 0.55, 1]}>
            <sphereGeometry args={[0.36, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#a5f3fc" transparent opacity={0.35} roughness={0.2} />
          </mesh>
        </Part>
      </group>
    </Selectable>
  );
}

// ─── Miniatures ───────────────────────────────────────────────────────────

function Actor({ def, sim, onSelect, selected }: { def: ActorDef; sim: SimRef; onSelect: (id: SelectableId) => void; selected: SelectableId | null }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Mesh>(null);
  const legR = useRef<THREE.Mesh>(null);
  const yaw = useRef(0);
  const phase = useRef(Math.random() * 10);
  const [hover, setHover] = useState(false);
  const isSel = selected === def.id;

  useFrame((_, dt) => {
    const w = sim.current.world;
    const st = w.actors[def.id];
    const o = root.current;
    if (!o || !st) return;
    phase.current += dt;
    const [tx, tz] = st.target;
    const dx = tx - o.position.x;
    const dz = tz - o.position.z;
    const dist = Math.hypot(dx, dz);
    let walking = false;
    let yawTarget = yaw.current;
    if (sim.current.snap) {
      o.position.set(tx, 0, tz);
      yaw.current = st.face ?? yaw.current;
    } else if (dist > 0.03) {
      const step = Math.min(dist, 2.4 * dt);
      o.position.x += (dx / dist) * step;
      o.position.z += (dz / dist) * step;
      yawTarget = Math.atan2(dx, dz);
      walking = true;
    } else if (st.face !== undefined) {
      yawTarget = st.face;
    }
    yaw.current += shortest(yaw.current, yawTarget) * damp(dt, walking ? 10 : 6);
    o.rotation.y = yaw.current;

    // Hidden actors shrink away (the stakeholders, between Reviews).
    const sc = st.hidden ? 0 : 1;
    o.scale.setScalar(THREE.MathUtils.lerp(o.scale.x, sc, damp(dt, 6)));

    const t = phase.current;
    const b = body.current, h = head.current, al = armL.current, ar = armR.current, ll = legL.current, lr = legR.current;
    if (!b || !h || !al || !ar || !ll || !lr) return;
    let bob = 0, swingL = 0, swingR = 0, nod = 0, legSwing = 0, lean = 0;
    if (walking) {
      bob = Math.abs(Math.sin(t * 11)) * 0.045;
      legSwing = Math.sin(t * 11) * 0.55;
      swingL = Math.sin(t * 11) * 0.5;
      swingR = -Math.sin(t * 11) * 0.5;
    } else {
      switch (st.anim) {
        case 'talk': nod = Math.sin(t * 6) * 0.06; swingR = Math.sin(t * 5) * 0.25 - 0.4; break;
        case 'nod': nod = Math.sin(t * 4) * 0.1; break;
        case 'work': swingL = -0.9 + Math.sin(t * 9) * 0.12; swingR = -0.9 + Math.cos(t * 9) * 0.12; lean = 0.12; break;
        case 'point': swingR = -1.5; nod = Math.sin(t * 3) * 0.05; break;
        case 'celebrate': bob = Math.abs(Math.sin(t * 7)) * 0.18; swingL = -2.6; swingR = -2.6 + Math.sin(t * 7) * 0.2; break;
        case 'clap': swingL = -1.2 + Math.sin(t * 12) * 0.18; swingR = -1.2 - Math.sin(t * 12) * 0.18; nod = Math.sin(t * 6) * 0.04; break;
        case 'idle': default: bob = Math.sin(t * 2) * 0.008; swingL = Math.sin(t * 2) * 0.05; swingR = -Math.sin(t * 2) * 0.05;
      }
    }
    b.position.y = bob;
    b.rotation.x = lean;
    h.rotation.x = nod;
    al.rotation.x = swingL;
    ar.rotation.x = swingR;
    ll.rotation.x = legSwing;
    lr.rotation.x = -legSwing;
  });

  const shirt = isSel ? '#f59e0b' : def.shirt;
  const isPO = def.id === 'po';
  const isSM = def.id === 'sm';
  const isStake = def.role === 'Stakeholder';

  return (
    <group
      ref={root}
      onClick={e => { e.stopPropagation(); onSelect(def.id); }}
      onPointerOver={e => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
    >
      {/* Legs */}
      <mesh ref={legL} position={[-0.07, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.32, 0.11]} />
        <meshStandardMaterial color={isStake ? '#1f2937' : '#2f3542'} />
      </mesh>
      <mesh ref={legR} position={[0.07, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.32, 0.11]} />
        <meshStandardMaterial color={isStake ? '#1f2937' : '#2f3542'} />
      </mesh>
      <group ref={body}>
        {/* Torso */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <capsuleGeometry args={[0.17, 0.26, 6, 14]} />
          <meshStandardMaterial color={shirt} roughness={0.8} />
        </mesh>
        {isStake && (
          <mesh position={[0, 0.66, 0.16]} castShadow>
            <boxGeometry args={[0.05, 0.22, 0.02]} />
            <meshStandardMaterial color={def.id === 's1' ? '#b91c1c' : '#7c2d5c'} />
          </mesh>
        )}
        {/* Arms hang from the shoulder and swing about it */}
        <group ref={armL} position={[-0.22, 0.76, 0]}>
          <mesh position={[0, -0.14, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.2, 4, 10]} />
            <meshStandardMaterial color={shirt} />
          </mesh>
          <mesh position={[0, -0.29, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color={def.skin} />
          </mesh>
          {isPO && (
            <mesh position={[0.04, -0.3, 0.08]} rotation={[0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.16, 0.22, 0.02]} />
              <meshStandardMaterial color="#8b5a2b" />
            </mesh>
          )}
        </group>
        <group ref={armR} position={[0.22, 0.76, 0]}>
          <mesh position={[0, -0.14, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.2, 4, 10]} />
            <meshStandardMaterial color={shirt} />
          </mesh>
          <mesh position={[0, -0.29, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color={def.skin} />
          </mesh>
        </group>
        {/* Head */}
        <group ref={head} position={[0, 0.98, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshStandardMaterial color={def.skin} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.06, -0.02]} scale={[1.02, 0.75, 1.02]}>
            <sphereGeometry args={[0.165, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={def.hair} roughness={0.9} />
          </mesh>
          {[-0.055, 0.055].map(ex => (
            <mesh key={ex} position={[ex, 0.02, 0.145]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          ))}
          {isSM && (
            <group>
              <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.02, 0]}>
                <torusGeometry args={[0.17, 0.018, 8, 24, Math.PI]} />
                <meshStandardMaterial color="#111827" />
              </mesh>
              <mesh position={[0.17, -0.02, 0]}>
                <sphereGeometry args={[0.04, 10, 10]} />
                <meshStandardMaterial color="#111827" />
              </mesh>
            </group>
          )}
        </group>
      </group>
      {/* Name tag: always on for the team, so a reader can follow who is where. */}
      <Billboard position={[0, 1.38, 0]}>
        <Text
          fontSize={hover || isSel ? 0.15 : 0.11}
          color={isSel ? PLUM : INK}
          anchorX="center" anchorY="middle"
          outlineWidth={0.014} outlineColor={PAPER}
        >
          {hover || isSel ? `${def.name} · ${def.role}` : def.name}
        </Text>
      </Billboard>
    </group>
  );
}

// ─── The scene ────────────────────────────────────────────────────────────

export function Studio({ sim, onSelect, selected, onTick }: {
  sim: SimRef;
  onSelect: (id: SelectableId) => void;
  selected: SelectableId | null;
  onTick: (t: number) => void;
}) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const items = useMemo(() => ALL_ITEMS.map(i => i.id), []);
  return (
    <>
      <color attach="background" args={['#f3e9df']} />
      <fog attach="fog" args={['#f3e9df', 18, 34]} />
      <hemisphereLight args={['#fff7ee', '#c8b6a6', 0.75]} />
      <directionalLight
        position={[6, 11, 7]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 6, -4]} intensity={0.35} />

      <Director sim={sim} onTick={onTick} controls={controls} />
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={18}
        maxPolarAngle={Math.PI * 0.47}
        onStart={() => { sim.current.userUntil = performance.now() + 9000; }}
      />

      <Floor />
      <BacklogWall sim={sim} onSelect={onSelect} selected={selected} />
      <PlanningTable onSelect={onSelect} selected={selected} />
      <SprintBoard sim={sim} onSelect={onSelect} selected={selected} />
      {SPOT.desks.map(([x, z], i) => <Desk key={i} x={x} z={z} />)}
      <Drone sim={sim} onSelect={onSelect} selected={selected} />
      <Rug sim={sim} onSelect={onSelect} selected={selected} />
      <RetroCorner sim={sim} onSelect={onSelect} selected={selected} />
      <Impediment sim={sim} />
      {items.map((id, i) => <Card key={id} id={id} sim={sim} index={i} />)}
      {ACTORS.map(a => <Actor key={a.id} def={a} sim={sim} onSelect={onSelect} selected={selected} />)}
    </>
  );
}

export { DAYS };
export type { ActorId };
