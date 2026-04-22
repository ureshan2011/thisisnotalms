import type { AttendanceLocationData } from './types';

function detectDeviceType(): string {
  const ua = navigator.userAgent;
  if (/ipad|tablet|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|windows phone/i.test(ua)) return 'mobile';
  return 'desktop';
}

async function fetchPublicIp(): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timer);
    const data = (await res.json()) as { ip: string };
    return data.ip;
  } catch {
    return undefined;
  }
}

async function requestGpsCoords(timeoutMs: number): Promise<{
  status: AttendanceLocationData['locationStatus'];
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}> {
  if (!navigator.geolocation) return { status: 'unavailable' };
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      pos =>
        resolve({
          status: 'captured',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      err => {
        if (err.code === err.PERMISSION_DENIED) resolve({ status: 'denied' });
        else if (err.code === err.TIMEOUT) resolve({ status: 'timeout' });
        else resolve({ status: 'unavailable' });
      },
      { timeout: timeoutMs, maximumAge: 120000, enableHighAccuracy: false },
    );
  });
}

export async function captureLocationSnapshot(): Promise<AttendanceLocationData> {
  const [gps, ipAddress] = await Promise.all([
    requestGpsCoords(8000),
    fetchPublicIp(),
  ]);
  return {
    locationStatus: gps.status,
    latitude: gps.latitude,
    longitude: gps.longitude,
    accuracy: gps.accuracy,
    ipAddress,
    userAgent: navigator.userAgent,
    deviceType: detectDeviceType(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`,
  };
}

// Haversine formula – returns distance in metres
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(metres: number): string {
  return metres >= 1000
    ? `${(metres / 1000).toFixed(1)} km`
    : `${Math.round(metres)} m`;
}
