import { useEffect, useState } from 'react';
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { Users } from 'lucide-react';
import { db } from '../../lib/firebase';
import type { PresenceEntry } from '../../lib/playgroundTypes';

interface Props {
  sessionId: string;
  userId: string;
  userName: string;
  userRole: string;
  isStaff: boolean;
  /** If true, this component will write/delete presence for the current user */
  writePresence?: boolean;
}

export default function PresencePanel({
  sessionId,
  userId,
  userName,
  userRole,
  isStaff,
  writePresence = true,
}: Props) {
  const [presence, setPresence] = useState<PresenceEntry[]>([]);

  // Subscribe to presence collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'sessions', sessionId, 'presence'),
      (snap) => {
        const entries: PresenceEntry[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            userId: d.id,
            name:   data.name   ?? 'Unknown',
            role:   data.role   ?? 'student',
            joinedAt: (data.joinedAt as Timestamp)?.toDate?.() ?? new Date(),
          };
        });
        setPresence(entries);
      }
    );
    return unsub;
  }, [sessionId]);

  // Write / clean up own presence
  useEffect(() => {
    if (!writePresence) return;
    const ref = doc(db, 'sessions', sessionId, 'presence', userId);
    setDoc(ref, {
      name:     userName,
      role:     userRole,
      joinedAt: serverTimestamp(),
    }).catch(() => undefined);
    return () => { deleteDoc(ref).catch(() => undefined); };
  }, [sessionId, userId, userName, userRole, writePresence]);

  const students = presence.filter((p) => p.role === 'student');
  const count    = students.length;

  return (
    <div className="card p-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
        >
          <Users size={15} color="white" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">Live Presence</h3>
      </div>

      {/* Count badge */}
      <div
        className="flex items-center justify-center rounded-2xl py-3 mb-4"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.06))' }}
      >
        <span
          className="text-4xl font-black tracking-tight"
          style={{ color: '#7c3aed' }}
        >
          {count}
        </span>
        <span className="text-sm text-gray-500 ml-2 mt-2 font-medium">
          {count === 1 ? 'student' : 'students'} online
        </span>
      </div>

      {/* Student list — staff only */}
      {isStaff && (
        <div>
          <p className="section-label mb-2">Students</p>
          {students.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3">
              No students have joined yet
            </p>
          ) : (
            <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {students.map((s) => (
                <li
                  key={s.userId}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl"
                  style={{ background: 'rgba(124,58,237,0.04)' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#34d399' }}
                  />
                  <span className="text-xs font-medium text-gray-700 truncate">{s.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
