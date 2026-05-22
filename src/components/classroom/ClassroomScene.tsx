import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Billboard, Text } from '@react-three/drei';
import { useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import type { StudentProfile } from '../../lib/types';

const SEATS_PER_ROW = 8;
const Z_STEP = 2.4;
const Y_STEP = 0.35;
const X_SPACING = 1.65;

// ─── Individual Avatar ────────────────────────────────────────────────────────
function StudentAvatar({
  student,
  position,
  isActive,
  isSelected,
  onClick,
}: {
  student: StudentProfile;
  position: [number, number, number];
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const animRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const animOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!animRef.current || !isActive) return;
    animRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.4 + animOffset) * 0.032;
  });

  const bodyColor = isSelected ? '#f59e0b' : isActive ? '#7c3aed' : '#383852';
  const emissive  = isSelected ? '#b45309' : isActive ? '#4c1d95' : '#000000';
  const emissiveI = isSelected ? 0.7        : isActive ? 0.35      : 0;

  return (
    <group
      position={position}
      scale={hovered || isSelected ? 1.13 : 1}
      onClick={e => { e.stopPropagation(); onClick(); }}
      onPointerOver={e => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = 'pointer'; }}
      onPointerOut={()  => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <group ref={animRef}>
        {/* Torso */}
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.5, 0.2]} />
          <meshStandardMaterial color={bodyColor} emissive={emissive} emissiveIntensity={emissiveI} roughness={0.55} metalness={0.25} />
        </mesh>

        {/* Head */}
        <mesh castShadow position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.17, 12, 12]} />
          <meshStandardMaterial color={bodyColor} emissive={emissive} emissiveIntensity={emissiveI} roughness={0.55} metalness={0.25} />
        </mesh>

        {/* Active halo */}
        {isActive && (
          <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.025, 8, 24]} />
            <meshStandardMaterial
              color={isSelected ? '#fbbf24' : '#a78bfa'}
              emissive={isSelected ? '#f59e0b' : '#7c3aed'}
              emissiveIntensity={1.0}
              transparent
              opacity={0.9}
            />
          </mesh>
        )}
      </group>

      {/* Name + section label on hover / selection */}
      {(hovered || isSelected) && (
        <Billboard position={[0, 1.12, 0]}>
          <Text
            fontSize={0.19}
            color={isSelected ? '#fbbf24' : '#f1f5f9'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.022}
            outlineColor="#000000"
          >
            {student.fullName}
          </Text>
          {student.section ? (
            <Text
              fontSize={0.13}
              color={isSelected ? '#fcd34d' : '#a78bfa'}
              anchorX="center"
              anchorY="middle"
              position={[0, -0.25, 0]}
              outlineWidth={0.015}
              outlineColor="#000000"
            >
              {student.section}
            </Text>
          ) : null}
        </Billboard>
      )}
    </group>
  );
}

// ─── Lecture Hall Geometry ────────────────────────────────────────────────────
function LectureHall({ rowCount }: { rowCount: number }) {
  const depth = rowCount * Z_STEP + 6;

  const tiers = useMemo(
    () => Array.from({ length: rowCount }, (_, i) => ({
      z:      2 + i * Z_STEP,
      y:      (i * Y_STEP) / 2,
      height: i * Y_STEP + 0.1,
    })),
    [rowCount],
  );

  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, depth / 2 - 1]}>
        <planeGeometry args={[24, depth + 2]} />
        <meshStandardMaterial color="#0b0b1e" roughness={0.95} />
      </mesh>

      {/* Stage platform */}
      <mesh receiveShadow position={[0, 0.1, -0.6]}>
        <boxGeometry args={[20, 0.2, 3.2]} />
        <meshStandardMaterial color="#17172e" roughness={0.8} metalness={0.12} />
      </mesh>

      {/* Podium body */}
      <mesh position={[0, 0.45, 0.8]}>
        <boxGeometry args={[0.9, 0.7, 0.5]} />
        <meshStandardMaterial color="#22224a" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Podium top */}
      <mesh position={[0, 0.82, 0.8]}>
        <boxGeometry args={[1.02, 0.05, 0.56]} />
        <meshStandardMaterial color="#2d2d55" roughness={0.5} metalness={0.45} />
      </mesh>

      {/* Projection screen face */}
      <mesh position={[0, 2.8, -1.95]}>
        <planeGeometry args={[12, 3.8]} />
        <meshStandardMaterial color="#0d0e2a" emissive="#3b1fa8" emissiveIntensity={0.14} />
      </mesh>
      {/* Screen glow border */}
      <mesh position={[0, 2.8, -1.9]}>
        <planeGeometry args={[12.4, 4.2]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.55} transparent opacity={0.2} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3.5, -2.05]}>
        <boxGeometry args={[22, 9, 0.18]} />
        <meshStandardMaterial color="#07071a" roughness={1} />
      </mesh>

      {/* Stepped seating tiers */}
      {tiers.map((t, i) => (
        <mesh key={i} receiveShadow position={[0, t.y, t.z]}>
          <boxGeometry args={[22, t.height, Z_STEP]} />
          <meshStandardMaterial color="#09091e" roughness={0.98} />
        </mesh>
      ))}

      {/* Side walls */}
      {([-10.5, 10.5] as number[]).map(x => (
        <mesh key={x} position={[x, 3.5, depth / 2 - 1]}>
          <boxGeometry args={[0.18, 9, depth + 2]} />
          <meshStandardMaterial color="#07071a" roughness={0.95} />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh position={[0, 8, depth / 2 - 1]}>
        <planeGeometry args={[24, depth + 2]} />
        <meshStandardMaterial color="#050512" side={THREE.BackSide} />
      </mesh>

      {/* Aisle floor strips */}
      {([-8, 8] as number[]).map(x => (
        <mesh key={x} position={[x, 0.01, depth / 2 - 1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.14, depth]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.35} transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Avatar Grid ──────────────────────────────────────────────────────────────
function AvatarGrid({
  students,
  attendedUids,
  selectedId,
  onSelect,
}: {
  students: StudentProfile[];
  attendedUids: Set<string>;
  selectedId: string | null;
  onSelect: (s: StudentProfile) => void;
}) {
  const avatarData = useMemo(() =>
    students.map((student, idx) => {
      const row = Math.floor(idx / SEATS_PER_ROW);
      const col = idx % SEATS_PER_ROW;
      const totalInRow = Math.min(SEATS_PER_ROW, students.length - row * SEATS_PER_ROW);
      const z = 2 + row * Z_STEP;
      // sit on tier top: tier_top = row * Y_STEP + 0.05; torso centre = tier_top + 0.25
      const y = row * Y_STEP + 0.3;
      const totalWidth = (totalInRow - 1) * X_SPACING;
      const x = col * X_SPACING - totalWidth / 2;
      return { student, position: [x, y, z] as [number, number, number] };
    }),
    [students],
  );

  return (
    <>
      {avatarData.map(({ student, position }) => (
        <StudentAvatar
          key={student.uid}
          student={student}
          position={position}
          isActive={attendedUids.has(student.uid)}
          isSelected={selectedId === student.uid}
          onClick={() => onSelect(student)}
        />
      ))}
    </>
  );
}

// ─── Screen Text ──────────────────────────────────────────────────────────────
function ScreenLabel({ course }: { course: string }) {
  return (
    <>
      <Text
        position={[0, 3.1, -1.82]}
        fontSize={0.55}
        color="#a78bfa"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {course}
      </Text>
      <Text
        position={[0, 2.45, -1.82]}
        fontSize={0.22}
        color="#6d28d9"
        anchorX="center"
        anchorY="middle"
      >
        LIVE SESSION
      </Text>
    </>
  );
}

// ─── Exported Scene ───────────────────────────────────────────────────────────
export interface ClassroomSceneProps {
  students: StudentProfile[];
  attendedUids: Set<string>;
  selectedId: string | null;
  onSelect: (s: StudentProfile | null) => void;
  course: string;
}

export function ClassroomScene({
  students,
  attendedUids,
  selectedId,
  onSelect,
  course,
}: ClassroomSceneProps) {
  const rowCount      = Math.max(1, Math.ceil(students.length / SEATS_PER_ROW));
  const sceneDepth    = rowCount * Z_STEP + 6;
  const orbitTarget   = [0, 2, Math.min(sceneDepth * 0.52, 14)] as [number, number, number];
  const fillLightZ    = sceneDepth * 0.5;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 7, -5], fov: 55 }}
      style={{ background: '#060614' }}
      onClick={() => onSelect(null)}
    >
      <fog attach="fog" args={['#060614', 20, 50]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#8b5cf6" />
      <directionalLight
        position={[-4, 14, 6]}
        intensity={0.85}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Stage spotlight */}
      <pointLight position={[0, 7.5, -1.5]} intensity={5} color="#fffaeb" distance={16} decay={2} />
      {/* Fill light above students */}
      <pointLight position={[0, 6, fillLightZ]} intensity={1.8} color="#a78bfa" distance={22} decay={2} />

      {/* Atmospheric particles */}
      <Sparkles
        count={110}
        scale={[21, 6, sceneDepth]}
        position={[0, 3.5, sceneDepth / 2 - 1]}
        size={0.85}
        speed={0.14}
        color="#7c3aed"
        opacity={0.28}
      />

      <Suspense fallback={null}>
        <LectureHall rowCount={rowCount} />
        <AvatarGrid
          students={students}
          attendedUids={attendedUids}
          selectedId={selectedId}
          onSelect={onSelect}
        />
        {course && <ScreenLabel course={course} />}
      </Suspense>

      <OrbitControls
        makeDefault
        target={orbitTarget}
        minDistance={4}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={0.05}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
