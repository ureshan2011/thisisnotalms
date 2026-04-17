import { useCallback, useEffect, useState } from 'react';
import {
  collection, addDoc, doc, getDocs, setDoc,
  onSnapshot, updateDoc, serverTimestamp, Timestamp,
  query, where, orderBy, limit,
} from 'firebase/firestore';
import {
  Radio, Clock, StopCircle, Play, Zap,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/ToastProvider';
import PresencePanel from '../../components/playground/PresencePanel';
import { LecturerCanvas } from '../../components/playground/CanvasPanel';
import { LecturerPollPanel } from '../../components/playground/PollPanel';
import { LecturerChecklistPanel } from '../../components/playground/ChecklistPanel';
import type { PlaygroundSession } from '../../lib/playgroundTypes';

const INTAKES  = ['2511', '2604'] as const;
const SUBJECTS = ['MBI800', 'MBI802', 'MBI804'] as const;
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

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
  if (ms <= 0) return '0:00:00';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ── Archive helper ── */
async function archiveSession(sessionId: string) {
  try {
    // Read presence, polls, items, completions
    const [presSnap, pollsSnap, itemsSnap, compSnap] = await Promise.all([
      getDocs(collection(db, 'sessions', sessionId, 'presence')),
      getDocs(collection(db, 'sessions', sessionId, 'polls')),
      getDocs(collection(db, 'sessions', sessionId, 'checklistItems')),
      getDocs(collection(db, 'sessions', sessionId, 'checklistCompletions')),
    ]);

    await setDoc(doc(db, 'archivedSessions', sessionId), {
      sessionId,
      archivedAt:       serverTimestamp(),
      presence:         presSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      polls:            pollsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      checklistItems:   itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      checklistCompletions: compSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
  } catch {
    // Archive failure is non-fatal; session still expires
  }
}

/* ─────────────────────────────────────────────────────────
   No active session — activation form
   ───────────────────────────────────────────────────────── */
function ActivationForm({
  onActivate,
}: {
  onActivate: (intake: string, subject: string) => Promise<void>;
}) {
  const [intake,     setIntake]     = useState<string>(INTAKES[0]);
  const [subject,    setSubject]    = useState<string>(SUBJECTS[0]);
  const [activating, setActivating] = useState(false);

  const activate = async () => {
    setActivating(true);
    try { await onActivate(intake, subject); }
    finally { setActivating(false); }
  };

  return (
    <div className="max-w-lg mx-auto animate-slideUp">
      <div className="card p-8 text-center mb-6">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}
        >
          <Zap size={28} color="white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Start a Live Session</h2>
        <p className="text-sm text-gray-500 mb-6">
          Activate the playground for students — the session auto-expires after 2 hours.
        </p>

        <div className="text-left space-y-4">
          <div>
            <label className="label">Intake</label>
            <select
              className="input-field"
              value={intake}
              onChange={(e) => setIntake(e.target.value)}
            >
              {INTAKES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <select
              className="input-field"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            className="btn-primary w-full justify-center mt-2"
            disabled={activating}
            onClick={activate}
          >
            <Play size={16} /> {activating ? 'Activating…' : 'Activate Playground'}
          </button>
        </div>
      </div>

      {/* Feature hints */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '👥', label: 'Presence counter', desc: 'See who\'s online' },
          { icon: '🎨', label: 'Live canvas', desc: 'Draw & annotate' },
          { icon: '📊', label: 'Understanding polls', desc: 'Thumbs up / down' },
          { icon: '✅', label: 'Progress checklist', desc: 'Track student steps' },
        ].map((f) => (
          <div
            key={f.label}
            className="card p-3 flex items-start gap-2.5"
          >
            <span className="text-xl flex-shrink-0">{f.icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-700">{f.label}</p>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Active session header banner
   ───────────────────────────────────────────────────────── */
function SessionBanner({
  session,
  onEnd,
  isTA,
}: {
  session: PlaygroundSession;
  onEnd:   () => void;
  isTA:    boolean;
}) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, session.expiresAt.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session.expiresAt]);

  const urgent = remaining < 15 * 60 * 1000; // < 15 min

  return (
    <div
      className="card p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 animate-fadeIn"
      style={{ border: '1px solid rgba(124,58,237,0.15)' }}
    >
      {/* Live indicator */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-sm font-bold" style={{ color: '#059669' }}>LIVE</span>
      </div>

      {/* Session info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">
          {session.subject} — Intake {session.intake}
        </p>
        <p className="text-xs text-gray-500">
          Activated by {session.activatedByName}
        </p>
      </div>

      {/* Countdown */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
        style={{
          background: urgent ? 'rgba(239,68,68,0.10)' : 'rgba(124,58,237,0.08)',
          color:      urgent ? '#dc2626' : '#7c3aed',
        }}
      >
        <Clock size={13} />
        <span className="text-sm font-bold code-display">{formatCountdown(remaining)}</span>
      </div>

      {/* End session — lecturers only */}
      {!isTA && (
        <button className="btn-danger !px-3 !py-2 flex-shrink-0" onClick={onEnd}>
          <StopCircle size={15} /> End
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────────────────── */
export default function LivePlayground() {
  const { user, role } = useAuth();
  const { showToast }  = useToast();
  const isTA           = role === 'teachingAssistant';

  const [session,  setSession]  = useState<PlaygroundSession | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [ending,   setEnding]   = useState(false);

  // Subscribe to active sessions
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

  // Auto-expire check
  useEffect(() => {
    if (!session) return;
    const check = setInterval(async () => {
      if (Date.now() >= session.expiresAt.getTime()) {
        await archiveSession(session.id);
        await updateDoc(doc(db, 'sessions', session.id), { status: 'expired' });
        showToast({ type: 'info', title: 'Session expired', description: 'The 2-hour session has ended automatically.' });
      }
    }, 30_000);
    return () => clearInterval(check);
  }, [session, showToast]);

  const activateSession = useCallback(async (intake: string, subject: string) => {
    if (!user) return;
    const name = user.email?.split('@')[0] ?? 'Lecturer';
    const expiresAt = new Date(Date.now() + TWO_HOURS_MS);

    await addDoc(collection(db, 'sessions'), {
      intake,
      subject,
      status:          'active',
      activatedBy:     user.uid,
      activatedByName: name,
      expiresAt,
      createdAt: serverTimestamp(),
    });
    showToast({ type: 'success', title: 'Session started!', description: `${subject} / Intake ${intake} is now live.` });
  }, [user, showToast]);

  const endSession = useCallback(async () => {
    if (!session) return;
    setEnding(true);
    try {
      await archiveSession(session.id);
      await updateDoc(doc(db, 'sessions', session.id), { status: 'expired' });
      showToast({ type: 'info', title: 'Session ended', description: 'Data has been archived.' });
    } finally {
      setEnding(false);
    }
  }, [session, showToast]);

  return (
    <Layout>
      <PageHeader
        title="Live Lesson Playground"
        subtitle="Real-time collaborative tools for your class"
        actions={
          session && !isTA ? (
            <button className="btn-danger !px-3 !py-2" onClick={endSession} disabled={ending}>
              <StopCircle size={14} /> {ending ? 'Ending…' : 'End Session'}
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : session ? (
        <>
          <SessionBanner session={session} onEnd={endSession} isTA={isTA} />

          {/* Tool panels — 2-col grid on lg */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <PresencePanel
                sessionId={session.id}
                userId={user!.uid}
                userName={user!.email?.split('@')[0] ?? 'Staff'}
                userRole={role ?? 'lecturer'}
                isStaff={true}
                writePresence={true}
              />
              <LecturerPollPanel sessionId={session.id} />
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <LecturerCanvas sessionId={session.id} userId={user!.uid} />
              <LecturerChecklistPanel sessionId={session.id} />
            </div>
          </div>
        </>
      ) : (
        /* No session: show activation form (TA sees waiting state) */
        isTA ? (
          <div className="max-w-md mx-auto text-center py-20 animate-fadeIn">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(124,58,237,0.10)' }}
            >
              <Radio size={28} style={{ color: '#a78bfa' }} />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Waiting for a session</h2>
            <p className="text-sm text-gray-500">
              A lecturer needs to activate the playground. Once live, all tools will appear here.
            </p>
          </div>
        ) : (
          <ActivationForm onActivate={activateSession} />
        )
      )}
    </Layout>
  );
}
