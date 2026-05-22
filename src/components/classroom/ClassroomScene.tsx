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
const BODY_H   = 0.68;

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

// ─── Costume presets for avatars ─────────────────────────────────────────────
const COSTUME_PRESETS = [
  { name: 'casual',   shirtColor: '#1e3a5f', pantsColor: '#2d2d2d', skinTone: '#f5cba7', hairColor: '#2c1810' },
  { name: 'hoodie',   shirtColor: '#2d4a22', pantsColor: '#1a1a2e', skinTone: '#c68642', hairColor: '#1a1a1a' },
  { name: 'formal',   shirtColor: '#f0f0f0', pantsColor: '#1c1c3a', skinTone: '#fdbcb4', hairColor: '#4a3728' },
  { name: 'sporty',   shirtColor: '#7c1d1d', pantsColor: '#0f172a', skinTone: '#8d5524', hairColor: '#1c1c1c' },
  { name: 'creative', shirtColor: '#4a0e8f', pantsColor: '#1e293b', skinTone: '#f5cba7', hairColor: '#8b4513' },
  { name: 'academic', shirtColor: '#0c4a6e', pantsColor: '#1e1e30', skinTone: '#c68642', hairColor: '#3d2b1f' },
  { name: 'techwear', shirtColor: '#111827', pantsColor: '#111827', skinTone: '#fdbcb4', hairColor: '#2c1810' },
  { name: 'vibrant',  shirtColor: '#9d174d', pantsColor: '#1e293b', skinTone: '#8d5524', hairColor: '#1a1a1a' },
] as const;

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

function drawSilhouette(ctx: CanvasRenderingContext2D, x: number, y: number, cw: number, ch: number) {
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  const cx = x + cw / 2;
  const headR = cw * 0.18;
  const headCy = y + ch * 0.32;
  // head
  ctx.beginPath();
  ctx.arc(cx, headCy, headR, 0, Math.PI * 2);
  ctx.fill();
  // shoulders / torso curve down to bottom
  const shoulderY = headCy + headR * 1.4;
  const bottomY = y + ch + 4;
  const halfW = cw * 0.34;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, bottomY);
  ctx.bezierCurveTo(cx - halfW, shoulderY + 4, cx - cw * 0.22, shoulderY - 4, cx, shoulderY - 2);
  ctx.bezierCurveTo(cx + cw * 0.22, shoulderY - 4, cx + halfW, shoulderY + 4, cx + halfW, bottomY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
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

    // faint person silhouette behind initials
    drawSilhouette(ctx, x, y, cw, ch);

    const initials = student.fullName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
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

const CARD_W = 92;
const CARD_GAP = 10;
const CARD_STEP = CARD_W + CARD_GAP;

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
  // Background — radial gradient (slightly lighter edges, darker center)
  const radial = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, Math.max(cw, ch) * 0.7);
  radial.addColorStop(0, '#05051a');
  radial.addColorStop(1, '#0a0a26');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, cw, ch);

  if (students.length === 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('No students enrolled', cw / 2, ch / 2);
    return;
  }

  const LEFT_W = 240;
  const PHOTO_X = LEFT_W + 16;
  const PHOTO_AREA_W = cw - PHOTO_X;
  const CARD_H = Math.floor(ch * 0.72);
  const CARD_Y = Math.floor((ch - CARD_H - 16) / 2);

  // ── left info panel ──
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

  const totalW = students.length * CARD_STEP;
  if (totalW > 0) {
    const startIdx = Math.floor(scrollOffset / CARD_STEP);
    const visible  = Math.ceil(PHOTO_AREA_W / CARD_STEP) + 3;
    for (let i = 0; i <= visible; i++) {
      const idx = ((startIdx + i) % students.length + students.length) % students.length;
      const x   = PHOTO_X + (startIdx + i) * CARD_STEP - scrollOffset;
      if (x > cw + CARD_STEP) break;
      const student = students[idx];
      const img     = images.get(student.uid) ?? null;
      drawCard(ctx, x, CARD_Y, CARD_W, CARD_H, student, img, student.uid === selectedId, accent);
    }
  }
  ctx.restore();

  // fade masks on photo strip edges
  const lFade = ctx.createLinearGradient(PHOTO_X, 0, PHOTO_X + 30, 0);
  lFade.addColorStop(0, '#05051a'); lFade.addColorStop(1, 'transparent');
  ctx.fillStyle = lFade; ctx.fillRect(PHOTO_X, 0, 30, ch);

  const rFade = ctx.createLinearGradient(cw - 28, 0, cw, 0);
  rFade.addColorStop(0, 'transparent'); rFade.addColorStop(1, '#0a0a26');
  ctx.fillStyle = rFade; ctx.fillRect(cw - 28, 0, 28, ch);

  // ── animated scan line (CRT feel) ──
  const scanY = (scrollOffset / 3) % ch;
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.fillRect(0, scanY, cw, 2);

  // ── student count badge (top-right) ──
  ctx.save();
  const badgeText = `${students.length} students`;
  ctx.font = '700 14px sans-serif';
  const tw = ctx.measureText(badgeText).width + 26;
  const tbh = 28;
  const tbx = cw - tw - 18;
  const tby = 16;
  rrect(ctx, tbx, tby, tw, tbh, 14);
  ctx.fillStyle = `${accent}26`; ctx.fill();
  rrect(ctx, tbx, tby, tw, tbh, 14);
  ctx.strokeStyle = `${accent}88`; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.fillStyle = accent;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, tbx + tw / 2, tby + tbh / 2 + 1);
  ctx.restore();
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
    const c = document.createElement('canvas');
    c.width  = 1024;
    c.height = 384;
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return { canvas: c, texture: tex };
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
  const SCROLL_SPEED = 42; // px per second

  useFrame((_, delta) => {
    const totalW = students.length * CARD_STEP;
    if (totalW > 0) scrollRef.current = (scrollRef.current + delta * SCROLL_SPEED) % totalW;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawScreen(ctx, canvas.width, canvas.height, students, imagesRef.current, scrollRef.current, subject, accent, selectedId);
    texture.needsUpdate = true;
  });

  return (
    <mesh position={[0, 2.85, -1.94]}>
      <planeGeometry args={[12.2, 3.9]} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.FrontSide} />
    </mesh>
  );
}

// ─── Student Avatar (realistic anatomy + costume variants) ─────────────────────
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
  const groupRef = useRef<THREE.Group>(null);
  const breatheRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const phase = useMemo(() => (seededHash(student.uid) % 1000) / 1000 * Math.PI * 2, [student.uid]);

  const preset = useMemo(
    () => COSTUME_PRESETS[seededHash(student.uid, 3) % COSTUME_PRESETS.length],
    [student.uid],
  );
  const hasGlasses  = useMemo(() => seededHash(student.uid, 7)  % 10 < 3, [student.uid]);
  const hasBackpack = useMemo(() => seededHash(student.uid, 11) % 10 < 4, [student.uid]);
  const hasHat      = useMemo(() => seededHash(student.uid, 13) % 10 < 2, [student.uid]);

  const backpackColor = useMemo(
    () => new THREE.Color(preset.shirtColor).multiplyScalar(0.55).getStyle(),
    [preset.shirtColor],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (breatheRef.current) {
      breatheRef.current.position.y = Math.sin(t * 1.1 + phase) * 0.022;
    }
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = Math.sin(t * Math.PI * 0.8 + phase) * 0.06;
    }
    if (groupRef.current) {
      const pulse = isSelected ? 1.15 + Math.sin(t * 3.5) * 0.04 : (hovered ? 1.1 : 1);
      const next = THREE.MathUtils.lerp(groupRef.current.scale.x, pulse, 0.12);
      groupRef.current.scale.set(next, next, next);
    }
  });

  // Emissive only on selection/hover
  const isAccent = isSelected || hovered;
  const accentEmissive = isSelected ? '#f59e0b' : accent;
  const accentEmissiveI = isSelected ? 0.45 : (hovered ? 0.22 : 0);

  // Slightly darken hair color for top of head distinction
  const hairColor = preset.hairColor;
  const skinColor = preset.skinTone;
  const shirtColor = preset.shirtColor;
  const pantsColor = preset.pantsColor;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={e => { e.stopPropagation(); onClick(); }}
      onPointerOver={e => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = 'pointer'; }}
      onPointerOut={()  => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <group ref={breatheRef}>
        {/* Legs — two separate capsules with a gap */}
        <mesh castShadow position={[-0.07, -0.22, 0]}>
          <capsuleGeometry args={[0.055, 0.20, 4, 8]} />
          <meshStandardMaterial
            color={pantsColor}
            emissive={isAccent ? accentEmissive : '#000'}
            emissiveIntensity={accentEmissiveI * 0.4}
            roughness={0.55} metalness={0.1}
          />
        </mesh>
        <mesh castShadow position={[0.07, -0.22, 0]}>
          <capsuleGeometry args={[0.055, 0.20, 4, 8]} />
          <meshStandardMaterial
            color={pantsColor}
            emissive={isAccent ? accentEmissive : '#000'}
            emissiveIntensity={accentEmissiveI * 0.4}
            roughness={0.55} metalness={0.1}
          />
        </mesh>

        {/* Torso — slightly flattened box */}
        <mesh castShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.32, 0.30, 0.20]} />
          <meshStandardMaterial
            color={shirtColor}
            emissive={isAccent ? accentEmissive : '#000'}
            emissiveIntensity={accentEmissiveI}
            roughness={0.55} metalness={0.1}
          />
        </mesh>

        {/* Backpack — behind torso */}
        {hasBackpack && (
          <mesh castShadow position={[0, 0.04, -0.14]}>
            <boxGeometry args={[0.28, 0.30, 0.10]} />
            <meshStandardMaterial
              color={backpackColor}
              emissive={isAccent ? accentEmissive : '#000'}
              emissiveIntensity={accentEmissiveI * 0.4}
              roughness={0.7} metalness={0.05}
            />
          </mesh>
        )}

        {/* Neck */}
        <mesh castShadow position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.052, 0.058, 0.06, 12]} />
          <meshStandardMaterial
            color={skinColor}
            roughness={0.6} metalness={0.05}
          />
        </mesh>

        {/* Arms — capsules with slight elbow angle */}
        <mesh castShadow position={[-0.21, 0.04, 0.02]} rotation={[0, 0, 0.32]}>
          <capsuleGeometry args={[0.052, 0.26, 4, 10]} />
          <meshStandardMaterial
            color={shirtColor}
            emissive={isAccent ? accentEmissive : '#000'}
            emissiveIntensity={accentEmissiveI * 0.6}
            roughness={0.55} metalness={0.1}
          />
        </mesh>
        <mesh castShadow position={[0.21, 0.04, 0.02]} rotation={[0, 0, -0.32]}>
          <capsuleGeometry args={[0.052, 0.26, 4, 10]} />
          <meshStandardMaterial
            color={shirtColor}
            emissive={isAccent ? accentEmissive : '#000'}
            emissiveIntensity={accentEmissiveI * 0.6}
            roughness={0.55} metalness={0.1}
          />
        </mesh>

        {/* Hands (small skin-tone spheres at arm ends) */}
        <mesh castShadow position={[-0.32, -0.10, 0.02]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} metalness={0.05} />
        </mesh>
        <mesh castShadow position={[0.32, -0.10, 0.02]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} metalness={0.05} />
        </mesh>

        {/* Head group — gets the idle tilt */}
        <group ref={headGroupRef} position={[0, 0.32, 0]}>
          {/* Head */}
          <mesh castShadow>
            <sphereGeometry args={[0.135, 18, 18]} />
            <meshStandardMaterial
              color={skinColor}
              emissive={isAccent ? accentEmissive : '#000'}
              emissiveIntensity={accentEmissiveI * 0.5}
              roughness={0.55} metalness={0.1}
            />
          </mesh>

          {/* Eyes — small flat spheres, emissive iris */}
          <mesh position={[-0.045, 0.015, 0.118]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#0a0a18"
              emissiveIntensity={0.8}
              roughness={0.3} metalness={0.2}
            />
          </mesh>
          <mesh position={[0.045, 0.015, 0.118]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#0a0a18"
              emissiveIntensity={0.8}
              roughness={0.3} metalness={0.2}
            />
          </mesh>

          {/* Glasses (optional) */}
          {hasGlasses && (
            <>
              <mesh position={[-0.045, 0.015, 0.128]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.032, 0.005, 6, 16]} />
                <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
              </mesh>
              <mesh position={[0.045, 0.015, 0.128]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.032, 0.005, 6, 16]} />
                <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
              </mesh>
              {/* bridge */}
              <mesh position={[0, 0.015, 0.128]}>
                <boxGeometry args={[0.026, 0.005, 0.005]} />
                <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
              </mesh>
            </>
          )}

          {/* Hair — slightly flattened sphere on top */}
          <mesh castShadow position={[0, 0.06, -0.005]} scale={[1.05, 0.75, 1.05]}>
            <sphereGeometry args={[0.135, 16, 16]} />
            <meshStandardMaterial
              color={hairColor}
              roughness={0.85} metalness={0.05}
            />
          </mesh>

          {/* Hat / cap (optional) — flattened cylinder above hair */}
          {hasHat && (
            <>
              <mesh castShadow position={[0, 0.16, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.05, 16]} />
                <meshStandardMaterial color="#1c1c2e" roughness={0.7} metalness={0.1} />
              </mesh>
              {/* brim */}
              <mesh position={[0, 0.135, 0.08]}>
                <boxGeometry args={[0.22, 0.012, 0.10]} />
                <meshStandardMaterial color="#1c1c2e" roughness={0.7} metalness={0.1} />
              </mesh>
            </>
          )}
        </group>

        {/* Selected / hovered: floating halo ring */}
        {(isSelected || hovered) && (
          <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.022, 8, 28]} />
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
        <Billboard position={[0, BODY_H / 2 + 0.5, 0]}>
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
    const y = row * Y_STEP + 0.4 + BODY_H / 2;
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

// ─── Texture helpers (grid floor, panelled ceiling) ───────────────────────────
function useFloorTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#05051a';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(128, 0);
    ctx.moveTo(0, 0); ctx.lineTo(0, 128);
    ctx.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 20);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function useCeilingTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#040410';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1.5;
    const cols = 4, rows = 4;
    const cw = 512 / cols, chh = 512 / rows;
    for (let r = 0; r < rows; r++) {
      for (let cc = 0; cc < cols; cc++) {
        ctx.strokeRect(cc * cw + 18, r * chh + 18, cw - 36, chh - 36);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 4);
    return tex;
  }, []);
}

// ─── Lecture Hall ─────────────────────────────────────────────────────────────
function LectureHall({ rowCount, accent }: { rowCount: number; accent: string }) {
  const depth = rowCount * Z_STEP + 7;

  const tiers = useMemo(() => Array.from({ length: rowCount }, (_, i) => ({
    z: 2.2 + i * Z_STEP,
    yCenter: (i * Y_STEP) / 2,
    height: i * Y_STEP + 0.1,
  })), [rowCount]);

  const floorTex = useFloorTexture();
  const ceilingTex = useCeilingTexture();

  // Cleanup textures on unmount
  useEffect(() => () => { floorTex.dispose(); ceilingTex.dispose(); }, [floorTex, ceilingTex]);

  return (
    <group>
      {/* Main floor — grid-textured */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, depth / 2 - 1]}>
        <planeGeometry args={[24, depth + 4]} />
        <meshStandardMaterial map={floorTex} color="#0d0d24" roughness={0.95} metalness={0.05} />
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

      {/* Screen surround glow — point lights at each corner of the projector */}
      <pointLight position={[-5.9, 4.7, -1.85]} intensity={0.4} color={accent} distance={3} decay={2} />
      <pointLight position={[ 5.9, 4.7, -1.85]} intensity={0.4} color={accent} distance={3} decay={2} />
      <pointLight position={[-5.9, 1.0, -1.85]} intensity={0.4} color={accent} distance={3} decay={2} />
      <pointLight position={[ 5.9, 1.0, -1.85]} intensity={0.4} color={accent} distance={3} decay={2} />

      {/* Volumetric projector beam (cosmetic) */}
      <mesh position={[0, 4.5, -1.85]}>
        <coneGeometry args={[1.6, 3.0, 24, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
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

      {/* Ceiling — panelled texture */}
      <mesh position={[0, 8, depth / 2 - 1]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, depth + 4]} />
        <meshStandardMaterial map={ceilingTex} color="#0a0a18" side={THREE.BackSide} roughness={0.95} />
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
      <fog attach="fog" args={['#040410', 18, 42]} />

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
