import { useRef, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';

// ─── Gyroscope / device-orientation hook ────────────────────────────────────
// Reads the real device gyroscope via the DeviceOrientation API. Handles the
// iOS 13+ permission prompt (DeviceOrientationEvent.requestPermission). The raw
// alpha/beta/gamma values are written into a ref so the render loop can read
// them every frame without triggering React re-renders.

export type GyroPermission = 'unsupported' | 'prompt' | 'granted' | 'denied';

export interface GyroData {
  alpha: number; // Z axis  (compass heading)   0..360
  beta: number;  // X axis  (front/back tilt) -180..180
  gamma: number; // Y axis  (left/right tilt) -90..90
  screen: number; // screen orientation angle 0/90/180/270
}

interface IOSDeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

export function useDeviceOrientation() {
  const dataRef = useRef<GyroData>({ alpha: 0, beta: 0, gamma: 0, screen: 0 });
  const [permission, setPermission] = useState<GyroPermission>('prompt');
  const [active, setActive] = useState(false);

  const onOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.alpha == null && e.beta == null && e.gamma == null) return;
    dataRef.current.alpha = e.alpha ?? 0;
    dataRef.current.beta = e.beta ?? 0;
    dataRef.current.gamma = e.gamma ?? 0;
  }, []);

  const onScreenChange = useCallback(() => {
    const angle =
      (typeof screen !== 'undefined' && screen.orientation && screen.orientation.angle) ||
      (window as unknown as { orientation?: number }).orientation ||
      0;
    dataRef.current.screen = Number(angle) || 0;
  }, []);

  const enable = useCallback(async (): Promise<boolean> => {
    const DOE = (window.DeviceOrientationEvent as unknown) as IOSDeviceOrientationEvent | undefined;
    if (!DOE) {
      setPermission('unsupported');
      return false;
    }
    if (typeof DOE.requestPermission === 'function') {
      try {
        const result = await DOE.requestPermission();
        if (result !== 'granted') {
          setPermission('denied');
          return false;
        }
      } catch {
        setPermission('denied');
        return false;
      }
    }
    onScreenChange();
    window.addEventListener('deviceorientation', onOrientation, true);
    window.addEventListener('orientationchange', onScreenChange);
    setPermission('granted');
    setActive(true);
    return true;
  }, [onOrientation, onScreenChange]);

  const disable = useCallback(() => {
    window.removeEventListener('deviceorientation', onOrientation, true);
    window.removeEventListener('orientationchange', onScreenChange);
    setActive(false);
  }, [onOrientation, onScreenChange]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
      setPermission('unsupported');
    }
    return () => disable();
  }, [disable]);

  return { dataRef, permission, active, enable, disable };
}

// ─── Gyro → camera quaternion ────────────────────────────────────────────────
// Standard three.js DeviceOrientationControls math, ported as a pure function.

const ZEE = new THREE.Vector3(0, 0, 1);
const EULER = new THREE.Euler();
const Q0 = new THREE.Quaternion();
const Q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // -PI/2 around X
const DEG = Math.PI / 180;

export function applyDeviceQuaternion(quaternion: THREE.Quaternion, d: GyroData) {
  const alpha = d.alpha * DEG;
  const beta = d.beta * DEG;
  const gamma = d.gamma * DEG;
  const orient = d.screen * DEG;

  EULER.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
  quaternion.setFromEuler(EULER);
  quaternion.multiply(Q1); // camera looks out the back of the device
  quaternion.multiply(Q0.setFromAxisAngle(ZEE, -orient)); // adjust for screen orientation
}
