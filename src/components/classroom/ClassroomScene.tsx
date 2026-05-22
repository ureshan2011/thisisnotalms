import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Billboard, Text } from '@react-three/drei';
import { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import type { StudentProfile } from '../../lib/types';

// ─── Subject theme config (matches ClassCountdown) ────────────────────────────
export const SUBJECT_CONFIGS = {
  MBI800: { accent: '#f59e0b', dark: '#92400e', fill: '#fcd34d', ambient: '#b45309', glow: 'rgba(245,158,11,0.35)' },
  MBI802: { accent: '#8b5cf6', dark: '#4c1d95', fill: '#a78bfa', ambient: '#6d28d9', glow: 'rgba(139,92,246,0.35)' },
  MBI804: { accent: '#0ea5e9', dark: '#075985', fill: '#38bdf8', ambient: '#0369a1', glow: 'rgba(14,165,233,0.35)' },
} as const;

export type SubjectKey = keyof typeof SUBJECT_CONFIGS;

// Layout constants
const SEATS_PER_ROW = 8;
const Z_STEP   = 2.5;
const Y_STEP   = 0.38;
const X_SPACE  = 1.68;
const BODY_H   = 0.68; // capsule total height: length + 2*radius = 0.30 + 2*0.19

// ─── Canvas texture helpers ───────────────────────────────────────────────────
function seededHash(uid: string, salt = 0): number {
  let h = salt;
  for (let i = 0; i < uid.length; i++) h = Math.imul(31, h) + uid.charCodeAt(i);
  return (h >>> 0);
}

const GRAD_PAIRS: [string, string][] = [
  ['#7c3aed', '#4c1d95'], ['#0ea5e9', '#0369a1'], ['#10b981', '#065f46'],
  ['#f59e0b', '#92400e'], ['#ef4444', '#9f1239'], ['#ec4899', '#831843'],
  ['#6366f1', '#312e81'], ['#14b8a6', '#134e4a'],
];

function gradColors(uid: string): [string, string] {
  return GRAD_PAIRS[seededHash(uid) % GRAD_PAIRS.length];
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, cw: number, ch: number,
  student: StudentProfile,
  img: HTMLImageElement | null | undefined,
  isSelected: boolean,
  accent: string,
) {
  ctx.save();
  rrect(ctx, x, y, cw, ch, 6);
  ctx.clip();

  if (img && img.complete && img.naturalWidth > 0) {
    const ar  = img.naturalWidth / img.naturalHeight;
    const car = cw / ch;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (ar > car) { sw = img.naturalHeight * car; sx = (img.naturalWidth - sw) / 2; }
    else          { sh = img.naturalWidth / car;  sy = (img.naturalHeight - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, cw, ch);
  } else {
    const [c1, c2] = gradColors(student.uid);
    const g = ctx.createLinearGradient(x, y, x + cw, y + ch);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fill();
    const initials = student.fullName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = `900 ${Math.floor(cw * 0.3)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(initials, x + cw / 2, y + ch / 2);
  }

  // bottom gradient overlay
  const ov = ctx.createLinearGradient(0, y + ch * 0.55, 0, y + ch);
  ov.addColorStop(0, 'transparent'); ov.addColorStop(1, 'rgba(0,0,0,0.82)');
  ctx.fillStyle = ov; ctx.fillRect(x, y, cw, ch);

  // selected border
  if (isSelected) {
    ctx.strokeStyle = accent; ctx.lineWidth = 3;
    rrect(ctx, x, y, cw, ch, 6); ctx.stroke();
  }
  ctx.restore();

  // name label below card
  const name = student.fullName.split(' ')[0] ?? '';
  ctx.fillStyle = isSelected ? accent : 'rgba(255,255,255,0.6)';
  ctx.font = `600 10px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(name.length > 8 ? name.slice(0, 7) + '…' : name, x + cw / 2, y + ch + 4);
}

function drawScreen(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  students: StudentProfile[],
  images: Map<string, HTMLImageElement>,
  scrollOffset: number,
  subject: string,
  accent: string,
  selectedId: string | null,
) {
  // Background
  ctx.fillStyle = '#07071c';
  ctx.fillRect(0, 0, cw, ch);

  if (students.length === 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('No students enrolled', cw / 2, ch / 2);
    return;
  }

  const LEFT_W = 220;
  const PHOTO_X = LEFT_W + 16;
  const PHOTO_AREA_W = cw - PHOTO_X;
  const CARD_W = 78;
  const CARD_H = Math.floor(ch * 0.72);
  const GAP = 10;
  const STEP = CARD_W + GAP;
  const CARD_Y = Math.floor((ch - CARD_H - 16) / 2);

  // ── left info panel ──
  // subject code
  ctx.save();
  ctx.font = `900 ${Math.min(58, LEFT_W * 0.42)}px sans-serif`;
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = accent;
  ctx.shadowColor = accent; ctx.shadowBlur = 18;
  ctx.fillText(subject, 20, ch * 0.44);
  ctx.restore();

  ctx.font = '500 13px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(`${students.length} enrolled`, 20, ch * 0.56);

  // LIVE badge
  const bx = 20, by = ch * 0.66;
  rrect(ctx, bx, by - 10, 52, 20, 10);
  ctx.fillStyle = `${accent}28`; ctx.fill();
  rrect(ctx, bx, by - 10, 52, 20, 10);
  ctx.strokeStyle = `${accent}55`; ctx.lineWidth = 1; ctx.stroke();
  ctx.font = '700 10px sans-serif';
  ctx.fillStyle = accent; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('LIVE', bx + 26, by);

  // vertical divider
  const dg = ctx.createLinearGradient(0, 0, 0, ch);
  dg.addColorStop(0, 'transparent'); dg.addColorStop(0.25, `${accent}50`);
  dg.addColorStop(0.75, `${accent}50`); dg.addColorStop(1, 'transparent');
  ctx.strokeStyle = dg; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(LEFT_W, 0); ctx.lineTo(LEFT_W, ch); ctx.stroke();

  // ── scrolling photos (clipped to right panel) ──
  ctx.save();
  ctx.beginPath(); ctx.rect(PHOTO_X, 0, PHOTO_AREA_W, ch); ctx.clip();

  const totalW = students.length * STEP;
  if (totalW > 0) {
    const startIdx = Math.floor(scrollOffset / STEP);
    const visible   = Math.ceil(PHOTO_AREA_W / STEP) + 3;
    for (let i = 0; i <= visible; i++) {
      const idx = (startIdx + i) % students.length;
      const x   = PHOTO_X + (startIdx + i) * STEP - scrollOffset;
      if (x > cw + STEP) break;
      const student = students[idx];
      const img     = images.get(student.uid) ?? null;
      drawCard(ctx, x, CARD_Y, CARD_W, CARD_H, student, img, student.uid === selectedId, accent);
    }
  }
  ctx.restore();

  // fade masks on photo strip edges
  const lFade = ctx.createLinearGradient(PHOTO_X, 0, PHOTO_X + 30, 0);
  lFade.addColorStop(0, '#07071c'); lFade.addColorStop(1, 'transparent');
  ctx.fillStyle = lFade; ctx.fillRect(PHOTO_X, 0, 30, ch);

  const rFade = ctx.createLinearGradient(cw - 28, 0, cw, 0);
  rFade.addColorStop(0, 'transparent'); rFade.addColorStop(1, '#07071c');
  ctx.fillStyle = rFade; ctx.fillRect(cw - 28, 0, 28, ch);
}

// ─── Projector Screen with live photo texture ──────────────────────────────────
function ProjectorScreen({
  students, subject, accent, selectedId,
}: {
  students: StudentProfile[];
  subject: string;
  accent: string;
  selectedId: string | null;
}) {
  // Canvas + texture created once
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width  = 1024;
    canvas.height = 384;
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return { canvas, texture };
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  // Load student photos
  const imagesRef = useRef(new Map<string, HTMLImageElement>());
  useEffect(() => {
    imagesRef.current.clear();
    students.forEach(s => {
      if (!s.photoURL) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = s.photoURL;
      img.onload  = () => imagesRef.current.set(s.uid, img);
      img.onerror = () => {};
    });
  }, [students]);

  // Scroll position
  const scrollRef = useRef(0);
  const SCROLL_SPEED = 38; // px per second

  useFrame((_, delta) => {
    const totalW = students.length * 88;
    if (totalW > 0) scrollRef.current = (scrollRef.current + delta * SCROLL_SPEED) % totalW;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawScreen(ctx, canvas.width, canvas.height, students, imagesRef.current, scrollRef.current, subject, accent, selectedId);
    texture.needsUpdate = true;
  });

  return (
    <mesh position={[0, 2.85, -2.0]}>
      <planeGeometry args={[12.2, 3.9]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// ─── Student Avatar ────────────────────────────────────────────────────────────
function StudentAvatar({
  student, position, isSelected, accent, fill, onClick,
}: {
  student: StudentProfile;
  position: [number, number, number];
  isSelected: boolean;
  accent: string;
  fill: string;
  onClick: () => void;
}) {
  const animRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const phase = useMemo(() => seededHash(student.uid) * 0.001 * Math.PI * 2, [student.uid]);

  useFrame(({ clock }) => {
    if (!animRef.current) return;
    // All avatars breathe gently
    const t = clock.getElapsedTime();
    animRef.current.position.y = Math.sin(t * 1.1 + phase) * 0.022;
  });

  const color    = isSelected ? '#f59e0b' : accent;
  const emissive = isSelected ? '#b45309' : fill;
  const emissI   = isSelected ? 0.55 : 0.18;

  return (
    <group
      position={position}
      scale={hovered || isSelected ? 1.1 : 1}
      onClick={e => { e.stopPropagation(); onClick(); }}
      onPointerOver={e => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = 'pointer'; }}
      onPointerOut={()  => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <group ref={animRef}>
        {/* Body (capsule) */}
        <mesh castShadow>
          <capsuleGeometry args={[0.19, 0.3, 6, 14]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissI} roughness={0.45} metalness={0.3} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 0.52, 0]}>
          <sphereGeometry args={[0.19, 16, 16]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissI} roughness={0.45} metalness={0.3} />
        </mesh>
        {/* Left arm */}
        <mesh castShadow position={[-0.26, 0.08, 0]} rotation={[0, 0, 0.42]}>
          <capsuleGeometry args={[0.07, 0.28, 4, 8]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissI} roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Right arm */}
        <mesh castShadow position={[0.26, 0.08, 0]} rotation={[0, 0, -0.42]}>
          <capsuleGeometry args={[0.07, 0.28, 4, 8]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissI} roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Selected / hovered: floating halo ring */}
        {(isSelected || hovered) && (
          <mesh position={[0, 0.88, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.027, 8, 28]} />
            <meshStandardMaterial
              color={isSelected ? '#fbbf24' : fill}
              emissive={isSelected ? '#f59e0b' : accent}
              emissiveIntensity={1.0}
              transparent opacity={0.95}
            />
          </mesh>
        )}
      </group>

      {/* Floating label on hover / selected */}
      {(hovered || isSelected) && (
        <Billboard position={[0, 1.18, 0]}>
          <Text
            fontSize={0.18}
            color={isSelected ? '#fbbf24' : '#f1f5f9'}
            anchorX="center" anchorY="middle"
            outlineWidth={0.022} outlineColor="#000000"
          >
            {student.fullName}
          </Text>
          {student.section && (
            <Text
              fontSize={0.13}
              color={isSelected ? '#fcd34d' : fill}
              anchorX="center" anchorY="middle"
              position={[0, -0.25, 0]}
              outlineWidth={0.015} outlineColor="#000000"
            >
              {student.section}
            </Text>
          )}
        </Billboard>
      )}
    </group>
  );
}

// ─── Seat geometry (per avatar position) ──────────────────────────────────────
function SeatAt({ x, y, z }: { x: number; y: number; z: number }) {
  const SEAT_COLOR = '#0e0e28';
  return (
    <group>
      {/* Seat back */}
      <mesh receiveShadow position={[x, y + 0.1, z + 0.28]}>
        <boxGeometry args={[0.46, 0.6, 0.07]} />
        <meshStandardMaterial color={SEAT_COLOR} roughness={0.9} metalness={0.06} />
      </mesh>
      {/* Seat surface */}
      <mesh receiveShadow position={[x, y - 0.3, z + 0.1]}>
        <boxGeometry args={[0.46, 0.07, 0.44]} />
        <meshStandardMaterial color={SEAT_COLOR} roughness={0.9} metalness={0.06} />
      </mesh>
      {/* Seat legs */}
      {([-0.18, 0.18] as number[]).map(lx =>
        ([-0.16, 0.16] as number[]).map(lz => (
          <mesh key={`${lx}-${lz}`} receiveShadow position={[x + lx, y - 0.5, z + lz]}>
            <cylinderGeometry args={[0.025, 0.025, 0.4, 6]} />
            <meshStandardMaterial color="#0a0a20" roughness={0.85} metalness={0.15} />
          </mesh>
        ))
      )}
    </group>
  );
}

// ─── Avatar + seat grid ────────────────────────────────────────────────────────
function AvatarGrid({
  students, selectedId, onSelect, accent, fill,
}: {
  students: StudentProfile[];
  selectedId: string | null;
  onSelect: (s: StudentProfile) => void;
  accent: string;
  fill: string;
}) {
  const items = useMemo(() => students.map((student, idx) => {
    const row  = Math.floor(idx / SEATS_PER_ROW);
    const col  = idx % SEATS_PER_ROW;
    const count = Math.min(SEATS_PER_ROW, students.length - row * SEATS_PER_ROW);
    const z = 2.2 + row * Z_STEP;
    const y = row * Y_STEP + 0.4 + BODY_H / 2;  // sit on tier top + body centre
    const x = col * X_SPACE - ((count - 1) * X_SPACE) / 2;
    return { student, x, y, z };
  }), [students]);

  return (
    <>
      {items.map(({ student, x, y, z }) => (
        <group key={student.uid}>
          <SeatAt x={x} y={y} z={z} />
          <StudentAvatar
            student={student}
            position={[x, y, z]}
            isSelected={selectedId === student.uid}
            accent={accent}
            fill={fill}
            onClick={() => onSelect(student)}
          />
        </group>
      ))}
    </>
  );
}

// ─── Ceiling panel lights ──────────────────────────────────────────────────────
function CeilingPanels({ rowCount, accent }: { rowCount: number; accent: string }) {
  const zPositions = useMemo(() => {
    const positions: number[] = [];
    for (let z = 2; z < rowCount * Z_STEP + 2; z += Math.max(4, Z_STEP * 1.8)) positions.push(z);
    return positions.slice(0, 6);
  }, [rowCount]);

  return (
    <>
      {zPositions.map(z => (
        <group key={z} position={[0, 7.6, z]}>
          {/* Housing */}
          <mesh>
            <boxGeometry args={[3.2, 0.1, 0.7]} />
            <meshStandardMaterial color="#0a0a20" roughness={0.8} metalness={0.2} />
          </mesh>
          {/* Glowing strip */}
          <mesh position={[0, -0.056, 0]}>
            <boxGeometry args={[3.0, 0.01, 0.55]} />
            <meshStandardMaterial color="#e8eeff" emissive="#d0d8ff" emissiveIntensity={1.5} />
          </mesh>
          {/* Light cast */}
          <pointLight intensity={1.4} color="#e8eeff" distance={7} decay={2} />
          {/* Tiny accent tint lights along edges */}
          <pointLight intensity={0.3} color={accent} distance={5} decay={2} position={[1.4, 0, 0]} />
          <pointLight intensity={0.3} color={accent} distance={5} decay={2} position={[-1.4, 0, 0]} />
        </group>
      ))}
    </>
  );
}

// ─── Lecture Hall ─────────────────────────────────────────────────────────────
function LectureHall({ rowCount, accent }: { rowCount: number; accent: string }) {
  const depth = rowCount * Z_STEP + 7;

  const tiers = useMemo(() => Array.from({ length: rowCount }, (_, i) => ({
    z: 2.2 + i * Z_STEP,
    yCenter: (i * Y_STEP) / 2,
    height: i * Y_STEP + 0.1,
  })), [rowCount]);

  return (
    <group>
      {/* Main floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, depth / 2 - 1]}>
        <planeGeometry args={[24, depth + 4]} />
        <meshStandardMaterial color="#090918" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Stage platform */}
      <mesh receiveShadow position={[0, 0.12, -0.5]}>
        <boxGeometry args={[22, 0.24, 4]} />
        <meshStandardMaterial color="#13132e" roughness={0.75} metalness={0.18} />
      </mesh>

      {/* Stage edge trim — accent glow strip */}
      <mesh position={[0, 0.255, 1.49]}>
        <boxGeometry args={[22, 0.02, 0.06]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>

      {/* Podium */}
      <mesh castShadow position={[0, 0.5, 0.9]}>
        <boxGeometry args={[0.96, 0.76, 0.56]} />
        <meshStandardMaterial color="#1e1e40" roughness={0.6} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.895, 0.9]}>
        <boxGeometry args={[1.08, 0.05, 0.62]} />
        <meshStandardMaterial color="#2a2a52" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Podium accent line */}
      <mesh position={[0, 0.86, 1.19]}>
        <boxGeometry args={[1.02, 0.02, 0.04]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.7} />
      </mesh>

      {/* Screen frame */}
      <mesh position={[0, 2.85, -2.1]}>
        <boxGeometry args={[12.7, 4.5, 0.12]} />
        <meshStandardMaterial color="#0d0d26" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Screen inner bezel */}
      <mesh position={[0, 2.85, -2.02]}>
        <boxGeometry args={[12.4, 4.1, 0.06]} />
        <meshStandardMaterial color="#111128" roughness={0.9} />
      </mesh>

      {/* Tiered seating platforms */}
      {tiers.map((t, i) => (
        <mesh key={i} receiveShadow position={[0, t.yCenter, t.z]}>
          <boxGeometry args={[22, t.height, Z_STEP]} />
          <meshStandardMaterial color="#08081a" roughness={0.97} />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 4, -2.2]}>
        <boxGeometry args={[24, 10, 0.16]} />
        <meshStandardMaterial color="#060614" roughness={1} />
      </mesh>

      {/* Side walls */}
      {([-11, 11] as number[]).map(x => (
        <mesh key={x} position={[x, 4, depth / 2 - 1]}>
          <boxGeometry args={[0.16, 10, depth + 4]} />
          <meshStandardMaterial color="#060614" roughness={0.95} />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh position={[0, 8, depth / 2 - 1]}>
        <planeGeometry args={[24, depth + 4]} />
        <meshStandardMaterial color="#040410" side={THREE.BackSide} />
      </mesh>

      {/* Aisle floor glow strips */}
      {([-8.5, 8.5] as number[]).map(x => (
        <mesh key={x} position={[x, 0.01, depth / 2 - 1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, depth + 2]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.45} transparent opacity={0.55} />
        </mesh>
      ))}

      {/* Wall accent sconces */}
      {[3, 8, 14].filter(z => z < depth - 1).map(z =>
        ([-10.85, 10.85] as number[]).map(x => (
          <group key={`${x}-${z}`} position={[x, 3.5, z]}>
            <mesh>
              <boxGeometry args={[0.06, 0.4, 0.12]} />
              <meshStandardMaterial color="#0e0e28" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, x > 0 ? -0.1 : 0.1]}>
              <planeGeometry args={[0.22, 0.28]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} transparent opacity={0.7} />
            </mesh>
            <pointLight intensity={0.5} color={accent} distance={4} decay={2} />
          </group>
        ))
      )}

      {/* Ceiling panels */}
      <CeilingPanels rowCount={rowCount} accent={accent} />
    </group>
  );
}

// ─── Exported Scene ────────────────────────────────────────────────────────────
export interface ClassroomSceneProps {
  students: StudentProfile[];
  selectedId: string | null;
  onSelect: (s: StudentProfile | null) => void;
  subject: string;
  subjectCfg: (typeof SUBJECT_CONFIGS)[SubjectKey];
}

export function ClassroomScene({ students, selectedId, onSelect, subject, subjectCfg }: ClassroomSceneProps) {
  const rowCount    = Math.max(1, Math.ceil(students.length / SEATS_PER_ROW));
  const sceneDepth  = rowCount * Z_STEP + 7;
  const orbitTarget: [number, number, number] = [0, 2.2, Math.min(sceneDepth * 0.48, 13)];

  return (
    <Canvas
      shadows
      camera={{ position: [0, 7.5, -5.5], fov: 52 }}
      style={{ background: '#040410' }}
      onClick={() => onSelect(null)}
    >
      <fog attach="fog" args={['#040410', 22, 55]} />

      {/* Ambient */}
      <ambientLight intensity={0.28} color={subjectCfg.ambient} />

      {/* Key light – cool overhead */}
      <directionalLight
        position={[-3, 16, 6]} intensity={0.9} color="#d6d8ff"
        castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-near={0.5} shadow-camera-far={60}
        shadow-camera-left={-15} shadow-camera-right={15}
        shadow-camera-top={15} shadow-camera-bottom={-5}
      />
      {/* Stage spotlight */}
      <pointLight position={[0, 8, -2]} intensity={6} color="#fff8f0" distance={18} decay={2} />
      {/* Subject-tinted fill on students */}
      <pointLight position={[0, 5.5, sceneDepth * 0.45]} intensity={2.2} color={subjectCfg.fill} distance={28} decay={2} />

      {/* Atmosphere */}
      <Sparkles
        count={120}
        scale={[22, 5.5, sceneDepth]}
        position={[0, 3.5, sceneDepth / 2 - 1]}
        size={0.8}
        speed={0.12}
        color={subjectCfg.accent}
        opacity={0.22}
      />

      <Suspense fallback={null}>
        <LectureHall rowCount={rowCount} accent={subjectCfg.accent} />
        <AvatarGrid
          students={students}
          selectedId={selectedId}
          onSelect={onSelect}
          accent={subjectCfg.accent}
          fill={subjectCfg.fill}
        />
        <ProjectorScreen
          students={students}
          subject={subject}
          accent={subjectCfg.accent}
          selectedId={selectedId}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        target={orbitTarget}
        minDistance={4}
        maxDistance={45}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={0.05}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
