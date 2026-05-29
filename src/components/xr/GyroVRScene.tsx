import { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useDeviceOrientation, applyDeviceQuaternion } from './useDeviceOrientation';

// ─── Real gyro VR scene ─────────────────────────────────────────────────────
// A 360° WebGL world you look around by physically moving your phone. The
// camera orientation is driven by the device gyroscope (DeviceOrientation API).
// A "Cardboard" toggle splits the view into a left/right stereo pair for use in
// a Google-Cardboard-style headset. On desktop (no gyro) you can drag to look.

interface GyroDataRef {
  current: { alpha: number; beta: number; gamma: number; screen: number };
}

// Drives the camera each frame: gyroscope when active, drag-to-look otherwise.
function LookController({
  gyroActive,
  dataRef,
}: {
  gyroActive: boolean;
  dataRef: GyroDataRef;
}) {
  const { camera, gl } = useThree();
  const drag = useRef({ on: false, px: 0, py: 0, lon: 0, lat: 0 });

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      drag.current.on = true;
      drag.current.px = e.clientX;
      drag.current.py = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.on) return;
      drag.current.lon -= (e.clientX - drag.current.px) * 0.18;
      drag.current.lat += (e.clientY - drag.current.py) * 0.18;
      drag.current.lat = Math.max(-85, Math.min(85, drag.current.lat));
      drag.current.px = e.clientX;
      drag.current.py = e.clientY;
    };
    const up = () => {
      drag.current.on = false;
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl]);

  const target = useRef(new THREE.Vector3());
  useFrame(() => {
    if (gyroActive) {
      applyDeviceQuaternion(camera.quaternion, dataRef.current);
    } else {
      const phi = THREE.MathUtils.degToRad(90 - drag.current.lat);
      const theta = THREE.MathUtils.degToRad(drag.current.lon);
      target.current.set(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(target.current);
    }
  });
  return null;
}

// Takes over rendering. Renders normally, or as a side-by-side stereo pair.
function StereoRenderer({ cardboard }: { cardboard: boolean }) {
  const { gl, scene, camera, size } = useThree();
  const stereo = useRef(new THREE.StereoCamera());

  useEffect(() => {
    stereo.current.aspect = 0.5;
    stereo.current.eyeSep = 0.6;
  }, []);

  useFrame(() => {
    const persp = camera as THREE.PerspectiveCamera;
    persp.updateMatrixWorld();

    if (cardboard) {
      stereo.current.update(persp);
      const w = size.width;
      const h = size.height;
      gl.setScissorTest(true);

      gl.setScissor(0, 0, w / 2, h);
      gl.setViewport(0, 0, w / 2, h);
      gl.render(scene, stereo.current.cameraL);

      gl.setScissor(w / 2, 0, w / 2, h);
      gl.setViewport(w / 2, 0, w / 2, h);
      gl.render(scene, stereo.current.cameraR);

      gl.setScissorTest(false);
    } else {
      gl.setViewport(0, 0, size.width, size.height);
      gl.render(scene, persp);
    }
  }, 1); // priority > 0 disables R3F's automatic render so we control it

  return null;
}

function Planet({
  distance,
  radius,
  color,
  speed,
  tilt = 0,
  emissive = 0,
}: {
  distance: number;
  radius: number;
  color: string;
  speed: number;
  tilt?: number;
  emissive?: number;
}) {
  const orbit = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.y += dt * speed;
    if (spin.current) spin.current.rotation.y += dt * 0.4;
  });
  return (
    <group ref={orbit} rotation={[tilt, 0, 0]}>
      <mesh ref={spin} position={[distance, 0, 0]}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          metalness={0.15}
          emissive={color}
          emissiveIntensity={emissive}
        />
      </mesh>
    </group>
  );
}

function Ringworld() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.08;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0, 0]} position={[6, 1, -3]}>
      <torusGeometry args={[1.6, 0.06, 16, 120]} />
      <meshStandardMaterial color="#ffd60a" emissive="#ffd60a" emissiveIntensity={0.3} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#05060f']} />
      <fog attach="fog" args={['#05060f', 18, 42]} />
      <ambientLight intensity={0.25} />
      {/* Sun at the centre */}
      <pointLight position={[0, 0, 0]} intensity={3} distance={60} color="#fff4d6" />
      <mesh>
        <sphereGeometry args={[1.1, 48, 48]} />
        <meshStandardMaterial color="#ffcf5c" emissive="#ffb700" emissiveIntensity={1.4} />
      </mesh>

      <Stars radius={60} depth={40} count={6000} factor={4} saturation={0} fade speed={0.6} />

      <Planet distance={3.2} radius={0.35} color="#9aa0a6" speed={0.5} />
      <Planet distance={5} radius={0.55} color="#4da3ff" speed={0.32} tilt={0.1} />
      <Planet distance={7.5} radius={0.85} color="#ff6b4a" speed={0.2} tilt={-0.15} emissive={0.08} />
      <Planet distance={10.5} radius={1.2} color="#c9a27e" speed={0.12} tilt={0.2} />
      <Ringworld />

      {/* A few drifting crystals for depth/parallax */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 8 + (i % 5);
        return (
          <mesh key={i} position={[Math.cos(a) * r, ((i % 6) - 3) * 1.5, Math.sin(a) * r]}>
            <octahedronGeometry args={[0.22]} />
            <meshStandardMaterial
              color={['#0071e3', '#30d158', '#bf5af2', '#ff375f'][i % 4]}
              emissive={['#0071e3', '#30d158', '#bf5af2', '#ff375f'][i % 4]}
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}
    </>
  );
}

export default function GyroVRScene() {
  const gyro = useDeviceOrientation();
  const [cardboard, setCardboard] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const enterFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => undefined);
  };

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-video w-full max-w-[820px] overflow-hidden rounded-[1.75rem] bg-black ring-1 ring-black/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]"
        style={{ touchAction: 'none' }}
      >
        <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 0] }} dpr={[1, 2]}>
          <Scene />
          <LookController gyroActive={gyro.active} dataRef={gyro.dataRef} />
          <StereoRenderer cardboard={cardboard} />
        </Canvas>

        {/* Stereo divider line for cardboard mode */}
        {cardboard && <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/60" />}

        {/* Status pill */}
        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
          {gyro.active ? '🛰 Gyro tracking' : 'Drag to look around'}
        </div>

        {/* Hint when gyro not yet on */}
        {!gyro.active && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
            On a phone, tap “Move your phone” to look with the gyroscope
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mx-auto mt-6 flex w-full max-w-[600px] flex-wrap items-center justify-center gap-3">
        {!gyro.active ? (
          <button
            onClick={() => gyro.enable()}
            disabled={gyro.permission === 'unsupported'}
            className="rounded-full bg-[#0071e3] px-5 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {gyro.permission === 'unsupported' ? 'Gyroscope not available' : 'Move your phone to look around'}
          </button>
        ) : (
          <button
            onClick={() => gyro.disable()}
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-[15px] font-medium text-neutral-700 transition hover:border-black/20"
          >
            Stop gyro
          </button>
        )}

        <button
          onClick={() => setCardboard((v) => !v)}
          className={`rounded-full px-5 py-2.5 text-[15px] font-medium transition active:scale-95 ${
            cardboard
              ? 'bg-neutral-900 text-white'
              : 'border border-black/10 bg-white text-neutral-700 hover:border-black/20'
          }`}
        >
          {cardboard ? 'Exit Cardboard' : 'Cardboard mode 🥽'}
        </button>

        <button
          onClick={enterFullscreen}
          className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-[15px] font-medium text-neutral-700 transition hover:border-black/20"
        >
          Fullscreen
        </button>
      </div>

      {gyro.permission === 'denied' && (
        <p className="mt-3 text-center text-[13px] text-[#ff375f]">
          Motion access was blocked. Enable it in your browser settings to look around with the gyroscope.
        </p>
      )}
    </div>
  );
}
