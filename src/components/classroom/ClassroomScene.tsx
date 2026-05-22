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

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
) {
  const ar  = img.naturalWidth / img.naturalHeight;
  const car = w / h;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (ar > car) { sw = img.naturalHeight * car; sx = (img.naturalWidth - sw) / 2; }
  else          { sh = img.naturalWidth / car;  sy = (img.naturalHeight - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawCardSmall(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, cw: number, ch: number,
  student: StudentProfile,
  img: HTMLImageElement | null | undefined,
) {
  ctx.save();
  rrect(ctx, x, y, cw, ch, 5);
  ctx.clip();

  if (img && img.complete && img.naturalWidth > 0) {
    drawImageCover(ctx, img, x, y, cw, ch);
  } else {
    const [c1, c2] = gradColors(student.uid);
    const g = ctx.createLinearGradient(x, y, x + cw, y + ch);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fill();
    drawSilhouette(ctx, x, y, cw, ch);
    const initials = student.fullName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = `900 ${Math.floor(cw * 0.34)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(initials, x + cw / 2, y + ch / 2);
  }

  // subtle bottom darken to ground card
  const ov = ctx.createLinearGradient(0, y + ch * 0.6, 0, y + ch);
  ov.addColorStop(0, 'transparent'); ov.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = ov; ctx.fillRect(x, y, cw, ch);

  ctx.restore();
}

// Collage layout constants
const COLLAGE_CARD_W = 70;
const COLLAGE_CARD_H = 90;
const COLLAGE_GAP_X = 6;
const COLLAGE_GAP_Y = 6;
const COLLAGE_STEP_X = COLLAGE_CARD_W + COLLAGE_GAP_X;
const COLLAGE_ROWS = 3;

function drawCollage(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  students: StudentProfile[],
  images: Map<string, HTMLImageElement>,
  scrollOffset: number,
  subject: string,
  accent: string,
) {
  const rowsArea = COLLAGE_ROWS * COLLAGE_CARD_H + (COLLAGE_ROWS - 1) * COLLAGE_GAP_Y;
  const topPad = (ch - rowsArea) / 2;
  const totalW = students.length * COLLAGE_STEP_X;

  // Draw cards — multiple rows, different speeds/directions for collage feel
  const rowSpeedMul = [1.0, 0.78, 1.18];
  const rowDir      = [1, -1, 1];
  const rowPhase    = [0, COLLAGE_STEP_X * 0.5, COLLAGE_STEP_X * 0.25];

  for (let r = 0; r < COLLAGE_ROWS; r++) {
    const rowY = topPad + r * (COLLAGE_CARD_H + COLLAGE_GAP_Y);
    if (totalW <= 0) continue;

    const rawOffset = rowDir[r] * scrollOffset * rowSpeedMul[r] + rowPhase[r];
    const effective = ((rawOffset % totalW) + totalW) % totalW;
    const startIdx  = Math.floor(effective / COLLAGE_STEP_X);
    const visible   = Math.ceil(cw / COLLAGE_STEP_X) + 2;

    for (let i = -1; i <= visible; i++) {
      const idx = ((startIdx + i) % students.length + students.length) % students.length;
      const x   = i * COLLAGE_STEP_X - (effective % COLLAGE_STEP_X);
      const student = students[idx];
      const img     = images.get(student.uid) ?? null;
      drawCardSmall(ctx, x, rowY, COLLAGE_CARD_W, COLLAGE_CARD_H, student, img);
    }
  }

  // Darken vignette behind subject code so it pops over photos
  const vignette = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, cw * 0.4);
  vignette.addColorStop(0, 'rgba(4,4,18,0.55)');
  vignette.addColorStop(1, 'rgba(4,4,18,0)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, cw, ch);

  // Subject code — large, overlapping photos
  ctx.save();
  ctx.font = '900 140px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 38;
  ctx.fillStyle = accent;
  ctx.fillText(subject, cw / 2, ch / 2 - 6);

  // subtitle line under code
  ctx.shadowBlur = 0;
  ctx.font = '700 18px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(`LIVE · ${students.length} students`, cw / 2, ch / 2 + 78);
  ctx.restore();

  // Animated scan line
  const scanY = (scrollOffset / 3) % ch;
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.fillRect(0, scanY, cw, 2);

  // Top-right student count badge
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
  ctx.strokeStyle = `${accent}aa`; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.fillStyle = accent;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, tbx + tw / 2, tby + tbh / 2 + 1);
  ctx.restore();
}

function drawFeaturedStudent(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  student: StudentProfile,
  img: HTMLImageElement | null | undefined,
  subject: string,
  accent: string,
  scrollOffset: number,
) {
  // Big photo on left
  const padY   = 28;
  const photoH = ch - padY * 2;
  const photoW = Math.floor(photoH * 0.78);
  const photoX = 48;
  const photoY = padY;

  // soft accent halo behind photo
  ctx.save();
  const halo = ctx.createRadialGradient(
    photoX + photoW / 2, photoY + photoH / 2, photoW * 0.3,
    photoX + photoW / 2, photoY + photoH / 2, photoW * 1.1,
  );
  halo.addColorStop(0, `${accent}50`);
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, cw, ch);
  ctx.restore();

  // photo card (rounded with accent border)
  ctx.save();
  rrect(ctx, photoX, photoY, photoW, photoH, 16);
  ctx.clip();
  if (img && img.complete && img.naturalWidth > 0) {
    drawImageCover(ctx, img, photoX, photoY, photoW, photoH);
  } else {
    const [c1, c2] = gradColors(student.uid);
    const g = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fill();
    drawSilhouette(ctx, photoX, photoY, photoW, photoH);
    const initials = student.fullName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = `900 ${Math.floor(photoW * 0.32)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(initials, photoX + photoW / 2, photoY + photoH / 2);
  }
  ctx.restore();

  // photo border
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  rrect(ctx, photoX, photoY, photoW, photoH, 16);
  ctx.stroke();
  ctx.restore();

  // Right-side info column
  const infoX = photoX + photoW + 50;

  // Subject code (smaller — sits above the name)
  ctx.fillStyle = `${accent}dd`;
  ctx.font = '800 20px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText(subject, infoX, photoY + 18);

  // Name — large
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 56px sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 12;
  // crude truncate so it never overflows
  let name = student.fullName;
  while (name.length > 0 && ctx.measureText(name).width > cw - infoX - 40) {
    name = name.slice(0, -1);
  }
  if (name.length < student.fullName.length) name = name.slice(0, -1) + '…';
  ctx.fillText(name, infoX, photoY + 60);
  ctx.shadowBlur = 0;

  // Student ID
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '600 18px monospace';
  ctx.fillText(student.studentId, infoX, photoY + 140);

  // Section pill
  if (student.section) {
    ctx.font = '700 14px sans-serif';
    const label = `Section ${student.section}`;
    const w = ctx.measureText(label).width + 22;
    const sx = infoX, sy = photoY + 180, sh = 28;
    rrect(ctx, sx, sy, w, sh, 14);
    ctx.fillStyle = `${accent}30`; ctx.fill();
    rrect(ctx, sx, sy, w, sh, 14);
    ctx.strokeStyle = `${accent}aa`; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = accent;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, sx + w / 2, sy + sh / 2 + 1);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  }

  // Country / Campus row
  const metaParts: string[] = [];
  if (student.campus)      metaParts.push(student.campus);
  if (student.homeCountry) metaParts.push(student.homeCountry);
  if (metaParts.length > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '500 16px sans-serif';
    ctx.fillText(metaParts.join(' · '), infoX, photoY + 222);
  }

  // SELECTED badge (top-right)
  ctx.save();
  ctx.font = '800 13px sans-serif';
  const bText = 'SELECTED';
  const bw = ctx.measureText(bText).width + 26;
  const bh = 28;
  const bx = cw - bw - 18;
  const by = 16;
  rrect(ctx, bx, by, bw, bh, 14);
  ctx.fillStyle = `${accent}38`; ctx.fill();
  rrect(ctx, bx, by, bw, bh, 14);
  ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = accent;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(bText, bx + bw / 2, by + bh / 2 + 1);
  ctx.restore();

  // Scan line keeps the CRT feel
  const scanY = (scrollOffset / 3) % ch;
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.fillRect(0, scanY, cw, 2);
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
  // Background — radial gradient
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

  // If a student is selected, show featured view (single student big)
  const selected = selectedId ? students.find(s => s.uid === selectedId) : null;
  if (selected) {
    drawFeaturedStudent(ctx, cw, ch, selected, images.get(selected.uid), subject, accent, scrollOffset);
    return;
  }

  // Otherwise — multi-row collage with subject code overlapping
  drawCollage(ctx, cw, ch, students, images, scrollOffset, subject, accent);
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
    const totalW = students.length * COLLAGE_STEP_X;
    if (totalW > 0) scrollRef.current = (scrollRef.current + delta * SCROLL_SPEED) % totalW;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawScreen(ctx, canvas.width, canvas.height, students, imagesRef.current, scrollRef.current, subject, accent, selectedId);
    texture.needsUpdate = true;
  });

  return (
    <mesh position={[-3.5, 2.85, -1.94]}>
      <planeGeometry args={[8.4, 3.15]} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.FrontSide} />
    </mesh>
  );
}

// ─── Student Avatar (realistic anatomy + costume variants) ─────────────────────
function StudentAvatar({
  student, position, yaw, isSelected, accent, fill, onClick,
}: {
  student: StudentProfile;
  position: [number, number, number];
  yaw: number;
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
      rotation={[0, yaw, 0]}
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
          {/* Head — slightly elongated (1:1.1:1.05) for more human proportion */}
          <mesh castShadow scale={[1, 1.1, 1.05]}>
            <sphereGeometry args={[0.135, 24, 20]} />
            <meshStandardMaterial
              color={skinColor}
              emissive={isAccent ? accentEmissive : '#000'}
              emissiveIntensity={accentEmissiveI * 0.5}
              roughness={0.62} metalness={0.05}
            />
          </mesh>

          {/* Ears */}
          <mesh castShadow position={[-0.128, 0.005, 0]} scale={[0.4, 1, 1]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
          </mesh>
          <mesh castShadow position={[0.128, 0.005, 0]} scale={[0.4, 1, 1]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
          </mesh>

          {/* Subtle eyebrows */}
          <mesh position={[-0.045, 0.048, 0.115]} scale={[1, 0.18, 0.18]}>
            <boxGeometry args={[0.048, 0.012, 0.012]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          <mesh position={[0.045, 0.048, 0.115]} scale={[1, 0.18, 0.18]}>
            <boxGeometry args={[0.048, 0.012, 0.012]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>

          {/* Mouth — subtle line */}
          <mesh position={[0, -0.045, 0.116]}>
            <boxGeometry args={[0.04, 0.006, 0.005]} />
            <meshStandardMaterial color="#5a2a2a" roughness={0.7} />
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

          {/* Hair — layered cap with side wisps */}
          <mesh castShadow position={[0, 0.07, -0.01]} scale={[1.08, 0.78, 1.08]}>
            <sphereGeometry args={[0.135, 20, 18]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} metalness={0.04} />
          </mesh>
          {/* Hair side wisps */}
          <mesh castShadow position={[-0.10, 0.03, 0.02]} scale={[0.6, 0.9, 0.6]}>
            <sphereGeometry args={[0.085, 12, 12]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0.10, 0.03, 0.02]} scale={[0.6, 0.9, 0.6]}>
            <sphereGeometry args={[0.085, 12, 12]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
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

// ─── Desk + Chair (per avatar position) ───────────────────────────────────────
function DeskAndChair({ x, y, z, yaw }: { x: number; y: number; z: number; yaw: number }) {
  const CHAIR_COLOR  = '#1a1a1a';
  const CHAIR_FABRIC = '#1e3a8a'; // royal blue seat cushion
  const DESK_TOP     = '#e8dfd0'; // cream desk surface
  const DESK_SIDE    = '#2a2a2a'; // dark trim
  const LEG_METAL    = '#4a4a4a';

  // Desk sits in FRONT of avatar (toward stage). We rotate the whole group by yaw
  // so the desk follows the curve. Avatar's forward direction is +Z in local frame
  // (sin yaw, 0, cos yaw) in world — so "in front" in local frame is +Z.
  return (
    <group position={[x, y, z]} rotation={[0, yaw, 0]}>
      {/* ── Chair (behind avatar, in local -Z direction) ── */}
      {/* Seat cushion */}
      <mesh receiveShadow castShadow position={[0, -0.30, -0.04]}>
        <boxGeometry args={[0.48, 0.06, 0.44]} />
        <meshStandardMaterial color={CHAIR_FABRIC} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Seat backrest */}
      <mesh receiveShadow castShadow position={[0, 0.05, -0.24]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.46, 0.55, 0.05]} />
        <meshStandardMaterial color={CHAIR_COLOR} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Backrest fabric panel */}
      <mesh position={[0, 0.05, -0.215]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.40, 0.48, 0.012]} />
        <meshStandardMaterial color={CHAIR_FABRIC} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Chair legs (4) — thin steel */}
      {([
        [-0.20, -0.20], [0.20, -0.20], [-0.20, 0.14], [0.20, 0.14],
      ] as [number, number][]).map(([lx, lz], i) => (
        <mesh key={i} receiveShadow position={[lx, -0.55, lz]}>
          <cylinderGeometry args={[0.018, 0.018, 0.44, 8]} />
          <meshStandardMaterial color={LEG_METAL} roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* ── Desk (in front of avatar, in local +Z direction) ── */}
      {/* Desk top */}
      <mesh receiveShadow castShadow position={[0, -0.08, 0.46]}>
        <boxGeometry args={[1.62, 0.04, 0.50]} />
        <meshStandardMaterial color={DESK_TOP} roughness={0.65} metalness={0.05} />
      </mesh>
      {/* Desk dark trim front edge */}
      <mesh position={[0, -0.08, 0.71]}>
        <boxGeometry args={[1.62, 0.05, 0.012]} />
        <meshStandardMaterial color={DESK_SIDE} roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Modesty panel (drops below desk front) */}
      <mesh receiveShadow position={[0, -0.36, 0.64]}>
        <boxGeometry args={[1.58, 0.50, 0.025]} />
        <meshStandardMaterial color={DESK_SIDE} roughness={0.7} metalness={0.15} />
      </mesh>
      {/* Power-grommet cap (subtle dark dot on desk top) */}
      <mesh position={[0, -0.058, 0.46]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}

// Focal point that rows curve around / faces aim at
const FOCAL_X = 0;
const FOCAL_Z = -3.5;
const ROW_CURVE_DEPTH = 1.1; // how much the row arcs (outer seats pushed back)

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
    const row   = Math.floor(idx / SEATS_PER_ROW);
    const col   = idx % SEATS_PER_ROW;
    const count = Math.min(SEATS_PER_ROW, students.length - row * SEATS_PER_ROW);
    const colCenter = (count - 1) / 2;
    const maxDelta  = Math.max(1, (SEATS_PER_ROW - 1) / 2);
    const tCol = (col - colCenter) / maxDelta; // -1..1

    const baseZ = 2.6 + row * Z_STEP;
    const z = baseZ + ROW_CURVE_DEPTH * tCol * tCol; // outer pushed back
    const y = row * Y_STEP + 0.4 + BODY_H / 2;
    const x = (col - colCenter) * X_SPACE;

    // Avatar yaw so face vector points at the focal point (the stage)
    const yaw = Math.atan2(FOCAL_X - x, FOCAL_Z - z);
    return { student, x, y, z, yaw };
  }), [students]);

  return (
    <>
      {items.map(({ student, x, y, z, yaw }) => (
        <group key={student.uid}>
          <DeskAndChair x={x} y={y} z={z} yaw={yaw} />
          <StudentAvatar
            student={student}
            position={[x, y, z]}
            yaw={yaw}
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

// ─── Ceiling recessed downlights ──────────────────────────────────────────────
function CeilingDownlights({ rowCount }: { rowCount: number }) {
  // Grid of small recessed circular lights — visual only for most; a sparser
  // set casts actual light to keep performance reasonable.
  const { visualPositions, litPositions, ceilingY, sceneDepth } = useMemo(() => {
    const depth = rowCount * Z_STEP + 7;
    const yCeil = 7.95;
    const cols  = 5;                                    // X-axis
    const xs: number[] = [];
    for (let i = 0; i < cols; i++) xs.push(-8 + i * 4); // -8, -4, 0, 4, 8
    const zStart = -1.0;
    const zStep  = 1.8;
    const zCount = Math.ceil((depth + 1) / zStep);
    const zs: number[] = [];
    for (let i = 0; i < zCount; i++) zs.push(zStart + i * zStep);

    const visual: [number, number, number][] = [];
    const lit: [number, number, number][] = [];
    let toggle = 0;
    for (const z of zs) {
      for (const x of xs) {
        visual.push([x, yCeil, z]);
        // every 4th lamp actually casts light — enough coverage without tanking perf
        if (toggle++ % 4 === 0) lit.push([x, yCeil - 0.15, z]);
      }
    }
    return { visualPositions: visual, litPositions: lit, ceilingY: yCeil, sceneDepth: depth };
  }, [rowCount]);

  // Suppress unused-var noise from destructuring
  void ceilingY; void sceneDepth;

  return (
    <>
      {/* Visual recessed light disks */}
      {visualPositions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Trim ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.10, 0.14, 24]} />
            <meshStandardMaterial color="#cccccc" side={THREE.DoubleSide} roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Bulb (emissive) */}
          <mesh position={[0, -0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.10, 22]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
      {/* Actual lights */}
      {litPositions.map(([x, y, z], i) => (
        <pointLight
          key={`L${i}`}
          position={[x, y, z]}
          intensity={1.1}
          color="#fff5e6"
          distance={9}
          decay={2}
        />
      ))}
    </>
  );
}

// ─── Texture helpers (wood floor, cream ceiling, wood-panelled walls) ─────────
function useFloorTexture() {
  return useMemo(() => {
    // Light wood-plank floor — beige base with subtle plank lines and grain
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d')!;
    // base
    ctx.fillStyle = '#d4b896';
    ctx.fillRect(0, 0, 256, 256);
    // 4 plank stripes vertically with alternating tone
    const planks = 4;
    const pw = 256 / planks;
    for (let i = 0; i < planks; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#c8aa84' : '#d8be9c';
      ctx.fillRect(i * pw, 0, pw, 256);
    }
    // subtle grain lines
    ctx.strokeStyle = 'rgba(80,55,30,0.10)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 14 + Math.random() * 30, y + (Math.random() - 0.5) * 3);
      ctx.stroke();
    }
    // plank separator lines
    ctx.strokeStyle = 'rgba(60,40,20,0.35)';
    ctx.lineWidth = 1.2;
    for (let i = 1; i < planks; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pw, 0); ctx.lineTo(i * pw, 256);
      ctx.stroke();
    }
    // horizontal plank end joints (every 256 = once per tile)
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(256, 0);
    ctx.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 10);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function useCarpetTexture() {
  return useMemo(() => {
    // Stepped-tier carpet — mid-gray with subtle noise
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, 128, 128);
    // noisy speckle
    const img = ctx.getImageData(0, 0, 128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 26;
      img.data[i]   = Math.max(0, Math.min(255, img.data[i] + n));
      img.data[i+1] = Math.max(0, Math.min(255, img.data[i+1] + n));
      img.data[i+2] = Math.max(0, Math.min(255, img.data[i+2] + n));
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }, []);
}

function useWallTexture() {
  return useMemo(() => {
    // Vertical wood paneling — light beige with vertical seam lines
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d')!;
    // base wood
    ctx.fillStyle = '#d8c5a3';
    ctx.fillRect(0, 0, 256, 256);
    // vertical planks
    const planks = 6;
    const pw = 256 / planks;
    for (let i = 0; i < planks; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#d0bb95' : '#dccba9';
      ctx.fillRect(i * pw, 0, pw, 256);
    }
    // grain
    ctx.strokeStyle = 'rgba(90,65,35,0.10)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 4, y + 18 + Math.random() * 40);
      ctx.stroke();
    }
    // seam shadows between planks
    ctx.strokeStyle = 'rgba(50,35,15,0.45)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i < planks; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pw, 0); ctx.lineTo(i * pw, 256);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    return tex;
  }, []);
}

function useCeilingTexture() {
  return useMemo(() => {
    // Cream ceiling with faint panel grid (no longer accent-glowing)
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#efe9dd';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 1;
    const cols = 6, rows = 6;
    const cw = 512 / cols, chh = 512 / rows;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * chh); ctx.lineTo(512, r * chh);
      ctx.stroke();
    }
    for (let cc = 0; cc <= cols; cc++) {
      ctx.beginPath();
      ctx.moveTo(cc * cw, 0); ctx.lineTo(cc * cw, 512);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 5);
    return tex;
  }, []);
}

// ─── Lecture Hall (realistic wood-paneled auditorium) ─────────────────────────
function LectureHall({ rowCount }: { rowCount: number; accent: string }) {
  const depth = rowCount * Z_STEP + 7;

  const tiers = useMemo(() => Array.from({ length: rowCount }, (_, i) => ({
    z: 2.6 + i * Z_STEP,
    yTop: i * Y_STEP + 0.4,
    front: 2.6 + i * Z_STEP - Z_STEP / 2,
  })), [rowCount]);

  const floorTex   = useFloorTexture();
  const carpetTex  = useCarpetTexture();
  const wallTex    = useWallTexture();
  const ceilingTex = useCeilingTexture();

  // Cleanup textures on unmount
  useEffect(() => () => {
    floorTex.dispose(); carpetTex.dispose(); wallTex.dispose(); ceilingTex.dispose();
  }, [floorTex, carpetTex, wallTex, ceilingTex]);

  const WALL_COLOR  = '#d8c5a3'; // light wood
  const FLOOR_TINT  = '#e0c8a4'; // warm beige
  const CEIL_COLOR  = '#efe9dd'; // cream
  const ORANGE      = '#d97706'; // accent wall
  const TIER_RISER  = '#3a3a3a'; // dark riser face
  const TIER_CARPET = '#5c5c5c'; // carpeted tier top

  return (
    <group>
      {/* Front wood floor (stage area) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -0.5]}>
        <planeGeometry args={[24, 5]} />
        <meshStandardMaterial map={floorTex} color={FLOOR_TINT} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Aisle floor strip running back through the rows (carpet) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, depth / 2 + 1]}>
        <planeGeometry args={[24, depth]} />
        <meshStandardMaterial map={carpetTex} color="#666666" roughness={0.95} />
      </mesh>

      {/* Tiered risers + tier tops (auditorium steps) */}
      {tiers.map((t, i) => (
        <group key={i}>
          {/* Riser face (vertical wall of the step) */}
          <mesh receiveShadow position={[0, t.yTop - Y_STEP / 2, t.front]}>
            <boxGeometry args={[22, Y_STEP, 0.06]} />
            <meshStandardMaterial color={TIER_RISER} roughness={0.85} metalness={0.1} />
          </mesh>
          {/* Tier top (carpeted) */}
          <mesh receiveShadow position={[0, t.yTop - 0.005, t.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[22, Z_STEP]} />
            <meshStandardMaterial map={carpetTex} color={TIER_CARPET} roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Stage platform — slight elevation */}
      <mesh receiveShadow position={[0, 0.10, -0.2]}>
        <boxGeometry args={[22, 0.22, 4]} />
        <meshStandardMaterial color="#a08560" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Podium */}
      <mesh castShadow position={[3.2, 0.52, 0.6]}>
        <boxGeometry args={[0.9, 0.78, 0.5]} />
        <meshStandardMaterial color="#7a5d3e" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[3.2, 0.92, 0.6]}>
        <boxGeometry args={[1.0, 0.04, 0.56]} />
        <meshStandardMaterial color="#5a4128" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Whiteboard on the right side of the front wall */}
      <mesh position={[7.2, 2.4, -2.06]}>
        <boxGeometry args={[3.6, 1.8, 0.04]} />
        <meshStandardMaterial color="#f7f7f5" roughness={0.45} metalness={0.05} />
      </mesh>
      {/* Whiteboard frame */}
      <mesh position={[7.2, 2.4, -2.085]}>
        <boxGeometry args={[3.8, 2.0, 0.02]} />
        <meshStandardMaterial color="#9c9c9c" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Screen frame (projector) — on the left of front wall */}
      <mesh position={[-3.5, 2.85, -2.1]}>
        <boxGeometry args={[8.9, 3.65, 0.10]} />
        <meshStandardMaterial color="#d2c4a5" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Inner screen bezel */}
      <mesh position={[-3.5, 2.85, -2.02]}>
        <boxGeometry args={[8.6, 3.35, 0.05]} />
        <meshStandardMaterial color="#15151a" roughness={0.9} />
      </mesh>

      {/* Volumetric projector beam (cosmetic) */}
      <mesh position={[-3.5, 4.6, -1.85]}>
        <coneGeometry args={[1.4, 3.0, 24, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Back wall (front of the room, behind the screen) — wood */}
      <mesh receiveShadow position={[0, 4, -2.2]}>
        <boxGeometry args={[24, 10, 0.16]} />
        <meshStandardMaterial map={wallTex} color={WALL_COLOR} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Orange accent panel on the back wall (between screen and whiteboard) */}
      <mesh position={[2.4, 2.4, -2.07]}>
        <boxGeometry args={[1.4, 4.0, 0.04]} />
        <meshStandardMaterial color={ORANGE} roughness={0.65} metalness={0.05} />
      </mesh>

      {/* Side walls (wood paneled) */}
      {([-11, 11] as number[]).map(x => (
        <mesh receiveShadow key={x} position={[x, 4, depth / 2 - 1]}>
          <boxGeometry args={[0.16, 10, depth + 4]} />
          <meshStandardMaterial map={wallTex} color={WALL_COLOR} roughness={0.85} metalness={0.05} />
        </mesh>
      ))}

      {/* Back wall of the room (rear, far end) */}
      <mesh receiveShadow position={[0, 4, depth + 1]}>
        <boxGeometry args={[24, 10, 0.16]} />
        <meshStandardMaterial map={wallTex} color={WALL_COLOR} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Ceiling — cream with faint panel grid */}
      <mesh receiveShadow position={[0, 8, depth / 2 - 1]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, depth + 4]} />
        <meshStandardMaterial map={ceilingTex} color={CEIL_COLOR} side={THREE.BackSide} roughness={0.92} />
      </mesh>

      {/* Recessed ceiling downlights */}
      <CeilingDownlights rowCount={rowCount} />
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
  const orbitTarget: [number, number, number] = [0, 1.8, Math.min(sceneDepth * 0.45, 12)];

  return (
    <Canvas
      shadows
      camera={{ position: [0, 7.0, -5.5], fov: 52 }}
      style={{ background: '#d8c5a3' }}
      onClick={() => onSelect(null)}
    >
      {/* Soft warm haze far in the distance only */}
      <fog attach="fog" args={['#e8dcc4', 38, 80]} />

      {/* Ambient — bright neutral classroom */}
      <ambientLight intensity={0.95} color="#fff5e6" />

      {/* Hemisphere fill — sky/ground bounce */}
      <hemisphereLight args={['#fff4d8', '#a08560', 0.7]} />

      {/* Key directional light – warm classroom overhead */}
      <directionalLight
        position={[-3, 16, 6]} intensity={1.05} color="#fff2dc"
        castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-near={0.5} shadow-camera-far={60}
        shadow-camera-left={-15} shadow-camera-right={15}
        shadow-camera-top={15} shadow-camera-bottom={-5}
      />
      {/* Stage fill */}
      <pointLight position={[0, 6.5, -1.5]} intensity={2.2} color="#fff5e6" distance={14} decay={2} />
      {/* Mid-room fill for student faces */}
      <pointLight position={[0, 5.5, sceneDepth * 0.4]} intensity={1.8} color="#fff5e6" distance={26} decay={2} />
      {/* Front-facing fill — toward the audience */}
      <pointLight position={[0, 4.0, -3.0]} intensity={1.6} color="#ffffff" distance={20} decay={2} />

      {/* Subtle atmosphere (very low) */}
      <Sparkles
        count={50}
        scale={[22, 5.5, sceneDepth]}
        position={[0, 3.5, sceneDepth / 2 - 1]}
        size={0.6}
        speed={0.08}
        color="#ffffff"
        opacity={0.08}
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
