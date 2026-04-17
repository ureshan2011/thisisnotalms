import { useEffect, useState } from 'react';
import {
  collection, doc, getDoc,
  onSnapshot, Timestamp,
  query, orderBy,
} from 'firebase/firestore';
import { Radio, Clock, ChevronDown, ChevronUp, History } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import { FullPageSpinner } from '../../components/ui/LoadingSpinner';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PresencePanel from '../../components/playground/PresencePanel';
import { StudentCanvas } from '../../components/playground/CanvasPanel';
import { StudentPollPanel } from '../../components/playground/PollPanel';
import { StudentChecklistPanel } from '../../components/playground/ChecklistPanel';
import PastSessionView from '../../components/playground/PastSessionView';
import type { PlaygroundSession } from '../../lib/playgroundTypes';

function firestoreToSession(id: string, data: Record<string, unknown>): PlaygroundSession {
  return {
    id,
    intake:          (data.intake          as string)           ?? '',
    subject:         (data.subject         as string)           ?? '',
    status:          (data.status          as 'active'|'expired') ?? 'active',
    activatedBy:     (data.activatedBy     as string)           ?? '',
    activatedByName: (data.activatedByName as string)           ?? '',
    expiresAt:       (data.expiresAt       as Timestamp)?.toDate?.() ?? new Date(),
    createdAt:       (data.createdAt       as Timestamp)?.toDate?.() ?? new Date(),
  };
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Ended';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/* ── Session info strip (live session) ── */
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

/* ── Past session card (read-only, expandable) ── */
function PastSessionCard({
  session,
  userId,
  userName,
}: {
  session:  PlaygroundSession;
  userId:   string;
  userName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="card overflow-hidden animate-fadeIn"
      style={{ border: '1px solid rgba(139,92,246,0.10)' }}
    >
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
        >
          {session.intake}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{session.subject}</p>
          <p className="text-[11px] text-gray-400">{formatDate(session.createdAt)}</p>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: 'rgba(100,116,139,0.08)', color: '#64748b' }}
        >
          Ended
        </span>
        <span className="text-gray-400 flex-shrink-0">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {/* Expanded data */}
      {open && (
        <div
          style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}
          className="px-4 pb-4"
        >
          <PastSessionView sessionId={session.id} userId={userId} isStaff={false} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main student page
   ───────────────────────────────────────────────────────── */
export default function StudentPlayground() {
  const { user } = useAuth();

  const [userName,      setUserName]      = useState('Student');
  const [studentIntake, setStudentIntake] = useState<string | null>(null);
  const [intakeLoading, setIntakeLoading] = useState(true);

  const [allSessions,     setAllSessions]     = useState<PlaygroundSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Load student profile (name + intake)
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'students', user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Record<string, unknown>;
          setUserName((data.fullName  as string) || user.email?.split('@')[0] || 'Student');
          setStudentIntake((data.intake as string) || null);
        } else {
          setUserName(user.email?.split('@')[0] || 'Student');
        }
      })
      .catch(() => undefined)
      .finally(() => setIntakeLoading(false));
  }, [user]);

  // Subscribe to ALL sessions — filter client-side by intake
  useEffect(() => {
    const q     = query(collection(db, 'sessions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setAllSessions(
        snap.docs.map((d) => firestoreToSession(d.id, d.data() as Record<string, unknown>))
      );
      setSessionsLoading(false);
    });
    return unsub;
  }, []);

  const loading = intakeLoading || sessionsLoading;

  // Sessions scoped to this student's intake
  const myIntakeSessions = studentIntake
    ? allSessions.filter((s) => s.intake === studentIntake)
    : [];

  const activeSession  = myIntakeSessions.find((s) => s.status === 'active') ?? null;
  const pastSessions   = myIntakeSessions.filter((s) => s.status === 'expired');

  if (loading) return <FullPageSpinner />;

  return (
    <Layout>
      <PageHeader
        title="Live Lesson"
        subtitle={
          activeSession
            ? `${activeSession.subject} · Intake ${activeSession.intake}`
            : studentIntake
              ? `Intake ${studentIntake}`
              : "Your class's live sessions"
        }
      />

      {/* No intake set warning */}
      {!studentIntake && !loading && (
        <div
          className="card p-4 mb-6 flex items-start gap-3"
          style={{ border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.04)' }}
        >
          <span className="text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-700">Intake not set</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Please complete your profile and select your intake to see sessions for your class.
            </p>
          </div>
        </div>
      )}

      {/* ── Active session ── */}
      {activeSession ? (
        <>
          <SessionStrip session={activeSession} />

          <PresencePanel
            sessionId={activeSession.id}
            userId={user!.uid}
            userName={userName}
            userRole="student"
            isStaff={false}
            writePresence={true}
          />

          <div className="mt-4">
            <StudentCanvas sessionId={activeSession.id} />
          </div>

          <div className="mt-4">
            <StudentPollPanel sessionId={activeSession.id} userId={user!.uid} />
          </div>

          <div className="mt-4">
            <StudentChecklistPanel
              sessionId={activeSession.id}
              userId={user!.uid}
              userName={userName}
            />
          </div>
        </>
      ) : studentIntake ? (
        /* Has intake but no active session for it */
        <div className="flex flex-col items-center justify-center text-center py-16 animate-fadeIn">
          <div
            className="w-20 h-20 rounded-[28px] flex items-center justify-center mb-6"
            style={{ background: 'rgba(124,58,237,0.08)' }}
          >
            <Radio size={36} style={{ color: '#c4b5fd' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No live session right now</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Your lecturer will activate the playground for Intake {studentIntake} at the start of class.
          </p>
        </div>
      ) : null}

      {/* ── Session History ── */}
      {pastSessions.length > 0 && (
        <div className={activeSession ? 'mt-10' : 'mt-6'}>
          <div className="flex items-center gap-2 mb-4">
            <History size={15} style={{ color: '#a78bfa' }} />
            <h2 className="section-label !mb-0">Past Sessions ({pastSessions.length})</h2>
          </div>

          {sessionsLoading ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : (
            <div className="space-y-3">
              {pastSessions.map((s) => (
                <PastSessionCard
                  key={s.id}
                  session={s}
                  userId={user!.uid}
                  userName={userName}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
