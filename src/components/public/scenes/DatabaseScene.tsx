import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Ambient hero visual for /intro-to-dbms: a handful of translucent "table"
// panels in a loose ER-diagram arrangement, connected by thin relationship
// lines, drifting in a slow auto-rotation. Purely decorative, no user
// interaction (no OrbitControls) — it should read as a calm background
// detail behind the headline, not something to play with.

interface TableNode { pos: [number, number, number]; w: number; h: number; }

const NODES: TableNode[] = [
  { pos: [-1.6, 0.6, -0.4], w: 1.1, h: 0.8 },
  { pos: [1.5, 0.9, 0.3], w: 0.95, h: 0.7 },
  { pos: [0.1, -0.7, 0.6], w: 1.25, h: 0.85 },
  { pos: [-1.3, -1.1, -0.6], w: 0.8, h: 0.6 },
  { pos: [1.7, -0.5, -0.3], w: 0.85, h: 0.6 },
];

const LINKS: [number, number][] = [[0, 2], [1, 2], [2, 3], [2, 4], [0, 3]];

function TablePanel({ pos, w, h }: TableNode) {
  const rows = 3;
  return (
    <group position={pos}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.9} />
      </lineSegments>
      {Array.from({ length: rows - 1 }).map((_, i) => {
        const y = h / 2 - ((i + 1) / rows) * h;
        return (
          <lineSegments key={i} position={[0, y, 0.001]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(w * 0.86, 0.001)]} />
            <lineBasicMaterial color="#c4b5fd" transparent opacity={0.6} />
          </lineSegments>
        );
      })}
    </group>
  );
}

function RelationshipLines() {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    LINKS.forEach(([a, b]) => {
      points.push(new THREE.Vector3(...NODES[a].pos));
      points.push(new THREE.Vector3(...NODES[b].pos));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.28} />
    </lineSegments>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.06 + pointer.x * 0.15;
    group.current.rotation.x = Math.sin(t * 0.15) * 0.05 + pointer.y * 0.06;
  });
  return (
    <group ref={group}>
      <RelationshipLines />
      {NODES.map((n, i) => <TablePanel key={i} {...n} />)}
    </group>
  );
}

export default function DatabaseScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} />
      <Rig />
    </Canvas>
  );
}
