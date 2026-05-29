import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDeviceOrientation, applyDeviceQuaternion } from './useDeviceOrientation';

// ─── Real browser AR ────────────────────────────────────────────────────────
// This is genuine AR, not a mock: it opens the rear camera with getUserMedia and
// renders a live WebGL (three.js) layer on top. Tapping the view raycasts into
// the scene and anchors a 3D object in world space. When motion access is
// granted, the camera tracks the phone's gyroscope, so placed objects stay
// locked to the real world as you move the device around.

type ShapeType = 'sphere' | 'cube' | 'torus' | 'cone' | 'crystal';

interface Placed {
  id: number;
  pos: [number, number, number];
  type: ShapeType;
  color: string;
}

const SHAPES: { type: ShapeType; label: string; color: string }[] = [
  { type: 'sphere', label: 'Sphere', color: '#0071e3' },
  { type: 'cube', label: 'Cube', color: '#ff375f' },
  { type: 'torus', label: 'Ring', color: '#30d158' },
  { type: 'cone', label: 'Cone', color: '#ff9f0a' },
  { type: 'crystal', label: 'Crystal', color: '#bf5af2' },
];

function ShapeGeometry({ type }: { type: ShapeType }) {
  switch (type) {
    case 'cube':
      return <boxGeometry args={[0.55, 0.55, 0.55]} />;
    case 'torus':
      return <torusGeometry args={[0.34, 0.14, 24, 64]} />;
    case 'cone':
      return <coneGeometry args={[0.38, 0.78, 40]} />;
    case 'crystal':
      return <dodecahedronGeometry args={[0.42]} />;
    default:
      return <sphereGeometry args={[0.4, 48, 48]} />;
  }
}

function AnchoredObject({ item }: { item: Placed }) {
  const ref = useRef<THREE.Mesh>(null);
  const t0 = useRef(performance.now());
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.7;
    ref.current.rotation.x += dt * 0.25;
    // gentle "pop-in" + float
    const age = (performance.now() - t0.current) / 1000;
    const grow = Math.min(1, age * 3);
    const float = Math.sin(age * 1.6) * 0.04;
    ref.current.scale.setScalar(grow);
    ref.current.position.set(item.pos[0], item.pos[1] + float, item.pos[2]);
  });
  return (
    <mesh ref={ref} position={item.pos} castShadow>
      <ShapeGeometry type={item.type} />
      <meshStandardMaterial
        color={item.color}
        metalness={0.35}
        roughness={0.22}
        emissive={item.color}
        emissiveIntensity={0.16}
      />
    </mesh>
  );
}

function CameraRig({
  enabled,
  dataRef,
  cameraRef,
}: {
  enabled: boolean;
  dataRef: React.MutableRefObject<{ alpha: number; beta: number; gamma: number; screen: number }>;
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera, cameraRef]);
  useFrame(() => {
    if (enabled) applyDeviceQuaternion(camera.quaternion, dataRef.current);
  });
  return null;
}

export default function ARDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const raycaster = useRef(new THREE.Raycaster());

  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [shapeIdx, setShapeIdx] = useState(0);

  const gyro = useDeviceOrientation();

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    gyro.disable();
    setRunning(false);
  }, [gyro]);

  const startCamera = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('This browser does not support camera access.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setRunning(true);
      // Try to engage the gyroscope so objects anchor to the world.
      gyro.enable().catch(() => undefined);
    } catch (e) {
      const name = (e as { name?: string })?.name;
      if (name === 'NotAllowedError' || name === 'SecurityError') {
        setError('Camera permission was denied. Allow camera access and try again.');
      } else if (name === 'NotFoundError') {
        setError('No camera was found on this device.');
      } else {
        setError('Could not start the camera. AR needs a secure (https) connection.');
      }
    }
  }, [gyro]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const handlePlace = useCallback(
    (clientX: number, clientY: number) => {
      const cam = cameraRef.current;
      const el = containerRef.current;
      if (!cam || !el) return;
      const rect = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.current.setFromCamera(ndc, cam as THREE.PerspectiveCamera);
      const point = raycaster.current.ray.at(2.6, new THREE.Vector3());
      const shape = SHAPES[shapeIdx];
      setPlaced((prev) => [
        ...prev.slice(-23), // cap for performance
        { id: Date.now() + Math.random(), pos: [point.x, point.y, point.z], type: shape.type, color: shape.color },
      ]);
    },
    [shapeIdx]
  );

  return (
    <div>
      {/* Phone-style viewport */}
      <div
        ref={containerRef}
        onPointerDown={(e) => running && handlePlace(e.clientX, e.clientY)}
        className="relative mx-auto w-full max-w-[400px] aspect-[3/4] overflow-hidden rounded-[2.25rem] bg-black ring-1 ring-black/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]"
        style={{ cursor: running ? 'crosshair' : 'default', touchAction: 'none' }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
          style={{ display: running ? 'block' : 'none' }}
        />

        {running && (
          <Canvas
            className="absolute inset-0"
            gl={{ alpha: true, antialias: true }}
            camera={{ fov: 70, near: 0.05, far: 100, position: [0, 0, 0] }}
            style={{ pointerEvents: 'none' }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[2, 4, 3]} intensity={1.1} />
            <directionalLight position={[-3, -1, -2]} intensity={0.4} color="#a0c4ff" />
            <CameraRig enabled={gyro.active} dataRef={gyro.dataRef} cameraRef={cameraRef} />
            {placed.map((item) => (
              <AnchoredObject key={item.id} item={item} />
            ))}
          </Canvas>
        )}

        {/* Reticle + HUD when live */}
        {running && (
          <>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-12 w-12">
                <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white/80" />
                <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white/80" />
                <div className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/80" />
                <div className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/80" />
                <div className="absolute inset-3 rounded-full border border-white/70" />
              </div>
            </div>
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> LIVE
            </div>
            <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              {gyro.active ? 'World-locked' : 'Tap to place'}
            </div>
            <p className="pointer-events-none absolute bottom-4 left-1/2 w-[88%] -translate-x-1/2 text-center text-[12px] font-medium text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
              Tap anywhere to drop a {SHAPES[shapeIdx].label.toLowerCase()} into the room
            </p>
          </>
        )}

        {/* Idle / error state */}
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-neutral-900 to-neutral-800 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">📷</div>
            <div>
              <p className="text-[17px] font-semibold text-white">Live camera AR</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/60">
                {error ?? 'Uses your real rear camera. Move your phone to anchor objects in the world.'}
              </p>
            </div>
            <button
              onClick={startCamera}
              className="rounded-full bg-white px-6 py-2.5 text-[15px] font-medium text-neutral-900 transition active:scale-95"
            >
              Start camera
            </button>
            {error && (
              <p className="text-[11px] text-white/40">Tip: AR requires camera permission and an https connection.</p>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      {running && (
        <div className="mx-auto mt-6 w-full max-w-[460px] space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            {SHAPES.map((s, i) => (
              <button
                key={s.type}
                onClick={() => setShapeIdx(i)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
                  shapeIdx === i
                    ? 'border-transparent text-white'
                    : 'border-black/10 bg-white text-neutral-700 hover:border-black/20'
                }`}
                style={shapeIdx === i ? { background: s.color } : undefined}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: shapeIdx === i ? 'rgba(255,255,255,0.9)' : s.color }}
                />
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPlaced([])}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 transition hover:border-black/20"
            >
              Clear ({placed.length})
            </button>
            {!gyro.active && gyro.permission !== 'unsupported' && (
              <button
                onClick={() => gyro.enable()}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 transition hover:border-black/20"
              >
                Enable motion
              </button>
            )}
            <button
              onClick={stopCamera}
              className="rounded-full bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition active:scale-95"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
