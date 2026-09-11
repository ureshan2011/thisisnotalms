import { useEffect, useRef, useState } from 'react';

// ─── Day 1 "meet the class" icebreaker — see ClassMapIcebreaker.tsx ────────
// Deliberately NOT Firestore — this repo's clone was never wired up to a
// live Firebase project, and for a single low-stakes classroom icebreaker
// that's not worth the setup. Instead this reads/writes a single anonymous,
// unauthenticated JSON blob on jsonblob.com: no login, no API key, no repo
// secrets. Trade-offs, on purpose: no auth (anyone with the URL can read or
// overwrite it), last-write-wins on near-simultaneous submits (mitigated
// with one retry, not eliminated), and the blob itself can expire after a
// few days of inactivity on jsonblob's free tier. All fine for a one-off,
// disposable Day 1 warm-up — not a pattern to reuse for anything that needs
// to last or matter.

const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/01a08fb8-2194-7feb-b954-2321b8bfd988';
const POLL_MS = 4000;

export const BACKGROUND_OPTIONS = [
  { key: 'student',    emoji: '🎓', label: 'Fresh out of study',        color: '#8b5cf6' },
  { key: 'working',    emoji: '💼', label: 'Working professional',      color: '#0ea5e9' },
  { key: 'switching',  emoji: '🔁', label: 'Career switcher',           color: '#f59e0b' },
  { key: 'founder',    emoji: '🚀', label: 'Founder / freelancer',      color: '#ec4899' },
] as const;

export type BackgroundKey = typeof BACKGROUND_OPTIONS[number]['key'];

export const MOOD_OPTIONS = [
  { key: 'nervous',     emoji: '😅', label: 'A little nervous' },
  { key: 'curious',     emoji: '🤔', label: 'Curious' },
  { key: 'ready',       emoji: '😎', label: 'Ready to go' },
  { key: 'overwhelmed', emoji: '🤯', label: 'Slightly overwhelmed' },
] as const;

export type MoodKey = typeof MOOD_OPTIONS[number]['key'];

export interface IcebreakerPin {
  id: string;
  name: string;
  background: BackgroundKey;
  detail: string;
  mood: MoodKey;
  lat: number;
  lng: number;
  placeLabel: string;
  createdAt: number;
}

export function backgroundInfo(key: BackgroundKey) {
  return BACKGROUND_OPTIONS.find(b => b.key === key) ?? BACKGROUND_OPTIONS[0];
}

export function moodInfo(key: MoodKey) {
  return MOOD_OPTIONS.find(m => m.key === key) ?? MOOD_OPTIONS[0];
}

function parsePins(raw: unknown): IcebreakerPin[] {
  const list = Array.isArray((raw as { pins?: unknown })?.pins) ? (raw as { pins: unknown[] }).pins : [];
  return list.map((entry) => {
    const d = entry as Record<string, unknown>;
    return {
      id: String(d.id ?? ''),
      name: String(d.name ?? 'Someone'),
      background: (d.background as BackgroundKey) ?? 'student',
      detail: String(d.detail ?? ''),
      mood: (d.mood as MoodKey) ?? 'curious',
      lat: Number(d.lat ?? 0),
      lng: Number(d.lng ?? 0),
      placeLabel: String(d.placeLabel ?? ''),
      createdAt: Number(d.createdAt ?? 0),
    };
  }).sort((a, b) => b.createdAt - a.createdAt);
}

const REQUEST_TIMEOUT_MS = 6000;

// A flaky Wi-Fi or an overzealous bot filter can leave a request neither
// resolving nor rejecting — an AbortController timeout guarantees this
// always settles, so the UI never gets stuck on "Adding you to the map…".
function withTimeout(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

async function fetchPins(): Promise<IcebreakerPin[]> {
  const { signal, clear } = withTimeout(REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(BLOB_URL, { headers: { Accept: 'application/json' }, signal });
    if (!res.ok) throw new Error(`Blob fetch failed: ${res.status}`);
    return parsePins(await res.json());
  } finally {
    clear();
  }
}

export function useIcebreakerPins() {
  const [pins, setPins] = useState<IcebreakerPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function poll() {
      try {
        const next = await fetchPins();
        if (!mounted.current) return;
        setPins(next);
        setUnavailable(false);
      } catch {
        if (!mounted.current) return;
        setUnavailable(true);
      } finally {
        if (mounted.current) setLoading(false);
      }
    }

    void poll();
    const interval = setInterval(poll, POLL_MS);
    return () => { mounted.current = false; clearInterval(interval); };
  }, []);

  return { pins, loading, unavailable };
}

export async function submitIcebreakerPin(input: {
  name: string;
  background: BackgroundKey;
  detail: string;
  mood: MoodKey;
  lat: number;
  lng: number;
  placeLabel: string;
}) {
  const pin: IcebreakerPin = { ...input, id: crypto.randomUUID(), createdAt: Date.now() };

  async function attempt() {
    const current = await fetchPins();
    const { signal, clear } = withTimeout(REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(BLOB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pins: [...current, pin] }),
        signal,
      });
      if (!res.ok) throw new Error(`Blob write failed: ${res.status}`);
    } finally {
      clear();
    }
  }

  try {
    await attempt();
  } catch {
    // One retry — covers a near-simultaneous submit from another student
    // clobbering the read this attempt started from.
    await attempt();
  }
}
