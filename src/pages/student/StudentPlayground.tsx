import { useEffect, useState } from 'react';
import {
  collection, doc, getDoc,
  onSnapshot, Timestamp,
  query, where, orderBy, limit,
} from 'firebase/firestore';
import { Radio, Clock } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import { FullPageSpinner } from '../../components/ui/LoadingSpinner';
import PresencePanel from '../../components/playground/PresencePanel';
import { StudentCanvas } from '../../components/playground/CanvasPanel';
import { StudentPollPanel } from '../../components/playground/PollPanel';
import { StudentChecklistPanel } from '../../components/playground/ChecklistPanel';
import type { PlaygroundSession } from '../../lib/playgroundTypes';

function firestoreToSession(id: string, data: Record<string, unknown>): PlaygroundSession {
  return {
    id,
    intake:           (data.intake as string)           ?? '',
    subject:          (data.subject as string)          ?? '',
    status:           (data.status as 'active' | 'expired') ?? 'active',
    activatedBy:      (data.activatedBy as string)      ?? '',
    activatedByName:  (data.activatedByName as string)  ?? '',
    expiresAt:        (data.expiresAt as Timestamp)?.toDate?.() ?? new Date(),
    createdAt:        (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
  };
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Ended';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ── Session info strip ── */
function SessionStrip({ session }: { session: PlaygroundSession }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, session.expiresAt.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session.expiresAt]);

  const urgent = remaining < 15 * 60 * 1000;

  return (
    <div
      className="card p-3 mb-5 flex flex-wrap items-center gap-3 animate-fadeIn"
      style={{ border: '1px solid rgba(52,211,153,0.25)' }}
    >
      {/* Live dot */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-xs font-bold" style={{ color: '#059669' }}>LIVE</span>
      </div>

      <p className="text-sm font-semibold text-gray-700 flex-1 min-w-0 truncate">
        {session.subject} · Intake {session.intake}
      </p>

      <div
        className="flex items-center gap-1 px-2.5 py-1 rounded-xl flex-shrink-0"
        style={{
          background: urgent ? 'rgba(239,68,68,0.10)' : 'rgba(124,58,237,0.08)',
          color:      urgent ? '#dc2626' : '#7c3aed',
        }}
      >
        <Clock size={11} />
        <span className="text-xs font-bold code-display">{formatCountdown(remaining)}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main student page
   ───────────────────────────────────────────────────────── */
export default function StudentPlayground() {
  const { user } = useAuth();
  const [session,  setSession]  = useState<PlaygroundSession | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [userName, setUserName] = useState('Student');

  // Load student's full name for presence
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'students', user.uid)).then((snap) => {
      if (snap.exists()) setUserName((snap.data().fullName as string) || user.email?.split('@')[0] || 'Student');
      else setUserName(user.email?.split('@')[0] || 'Student');
    }).catch(() => undefined);
  }, [user]);

  // Subscribe to active session
  useEffect(() => {
    const q = query(
      collection(db, 'sessions'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      setSession(
        snap.empty
          ? null
          : firestoreToSession(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>)
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <FullPageSpinner />;

  return (
    <Layout>
      <PageHeader
        title="Live Lesson"
        subtitle={
          session
            ? `${session.subject} · Intake ${session.intake}`
            : 'Join your class\'s live session'
        }
      />

      {session ? (
        <>
          <SessionStrip session={session} />

          {/* Presence counter — student view (no name list) */}
          <PresencePanel
            sessionId={session.id}
            userId={user!.uid}
            userName={userName}
            userRole="student"
            isStaff={false}
            writePresence={true}
          />

          {/* Canvas mirror */}
          <div className="mt-4">
            <StudentCanvas sessionId={session.id} />
          </div>

          {/* Poll */}
          <div className="mt-4">
            <StudentPollPanel sessionId={session.id} userId={user!.uid} />
          </div>

          {/* Checklist */}
          <div className="mt-4">
            <StudentChecklistPanel
              sessionId={session.id}
              userId={user!.uid}
              userName={userName}
            />
          </div>
        </>
      ) : (
        /* No active session */
        <div className="flex flex-col items-center justify-center text-center py-24 animate-fadeIn">
          <div
            className="w-20 h-20 rounded-[28px] flex items-center justify-center mb-6"
            style={{ background: 'rgba(124,58,237,0.08)' }}
          >
            <Radio size={36} style={{ color: '#c4b5fd' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No live session right now</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Your lecturer will activate the playground at the start of class. Check back then!
          </p>
        </div>
      )}
    </Layout>
  );
}
