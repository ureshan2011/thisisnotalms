import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Ambient hero visual for /intro-to-business-analytics: a small floating
// bar chart, each column breathing at its own pace, plus a couple of
// orbiting "data point" spheres. Same brief as DatabaseScene: a calm
// background detail, not an interactive toy — no OrbitControls.

const BARS = [
  { x: -1.6, h: 1.0, color: '#0f766e', speed: 0.9, phase: 0 },
  { x: -0.9, h: 1.6, color: '#0d9488', speed: 1.2, phase: 1 },
  { x: -0.2, h: 0.9, color: '#14b8a6', speed: 1.0, phase: 2 },
  { x: 0.5, h: 1.9, color: '#f59e0b', speed: 1.1, phase: 3 },
  { x: 1.2, h: 1.3, color: '#0f766e', speed: 0.8, phase: 4 },
];

function Bar({ x, h, color, speed, phase }: (typeof BARS)[number]) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * speed + phase) * 0.12;
    mesh.current.scale.y = scale;
    mesh.current.position.y = (h * scale) / 2 - 1;
  });
  return (
    <mesh ref={mesh} position={[x, h / 2 - 1, 0]}>
      <boxGeometry args={[0.45, h, 0.45]} />
      <meshStandardMaterial color={color} transparent opacity={0.55} roughness={0.35} metalness={0.15} />
    </mesh>
  );
}

function OrbitDot({ radius, speed, y, color }: { radius: number; speed: number; y: number; color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime() * speed;
    mesh.current.position.set(Math.cos(t) * radius, y + Math.sin(t * 0.6) * 0.25, Math.sin(t) * radius);
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.05 + pointer.x * 0.15;
    group.current.rotation.x = pointer.y * 0.05;
  });
  return (
    <group ref={group}>
      {BARS.map((b, i) => <Bar key={i} {...b} />)}
      <OrbitDot radius={2.1} speed={0.35} y={0.6} color="#f59e0b" />
      <OrbitDot radius={1.9} speed={-0.25} y={-0.2} color="#0d9488" />
    </group>
  );
}

export default function AnalyticsScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0.4, 5.4], fov: 42 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} />
      <Rig />
    </Canvas>
  );
}
