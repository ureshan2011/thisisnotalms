import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// ─── Day 1 "meet the class" icebreaker — see ClassMapIcebreaker.tsx ────────
// Open, no-login Firestore collection (same pattern as conflictSwapSessions /
// presentationTeams): students haven't got accounts yet on Class 1, so this
// has to work before anyone logs in. Only a first name, a rough map pin, and
// a short self-description are stored — nothing sensitive.

export const ICEBREAKER_COLLECTION = 'day1Icebreaker';

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
  createdAt: Date | null;
}

export function backgroundInfo(key: BackgroundKey) {
  return BACKGROUND_OPTIONS.find(b => b.key === key) ?? BACKGROUND_OPTIONS[0];
}

export function moodInfo(key: MoodKey) {
  return MOOD_OPTIONS.find(m => m.key === key) ?? MOOD_OPTIONS[0];
}

export function useIcebreakerPins() {
  const [pins, setPins] = useState<IcebreakerPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!db) {
      setUnavailable(true);
      setLoading(false);
      return;
    }
    const q = query(collection(db, ICEBREAKER_COLLECTION), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      snap => {
        setPins(snap.docs.map(d => {
          const data = d.data() as Record<string, unknown>;
          const createdAt = data.createdAt as Timestamp | undefined;
          return {
            id: d.id,
            name: String(data.name ?? 'Someone'),
            background: (data.background as BackgroundKey) ?? 'student',
            detail: String(data.detail ?? ''),
            mood: (data.mood as MoodKey) ?? 'curious',
            lat: Number(data.lat ?? 0),
            lng: Number(data.lng ?? 0),
            placeLabel: String(data.placeLabel ?? ''),
            createdAt: createdAt ? createdAt.toDate() : null,
          };
        }));
        setLoading(false);
      },
      () => {
        setUnavailable(true);
        setLoading(false);
      },
    );
    return unsub;
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
  if (!db) throw new Error('Firestore is not configured');
  await addDoc(collection(db, ICEBREAKER_COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
  });
}
