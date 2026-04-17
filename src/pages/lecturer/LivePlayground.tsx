import { useCallback, useEffect, useState } from 'react';
import {
  collection, addDoc, doc, getDocs, setDoc,
  onSnapshot, updateDoc, serverTimestamp, Timestamp,
  query, orderBy,
} from 'firebase/firestore';
import {
  Radio, Clock, StopCircle, Play, Zap,
  ChevronDown, ChevronUp, RotateCcw, History,
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
import PastSessionView from '../../components/playground/PastSessionView';
import type { PlaygroundSession } from '../../lib/playgroundTypes';

const INTAKES      = ['2511', '2604'] as const;
const SUBJECTS     = ['MBI800', 'MBI802', 'MBI804'] as const;
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

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
  if (ms <= 0) return '0:00:00';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/* ── Archive helper ── */
async function archiveSession(sessionId: string) {
  try {
    const [presSnap, pollsSnap, itemsSnap, compSnap] = await Promise.all([
      getDocs(collection(db, 'sessions', sessionId, 'presence')),
      getDocs(collection(db, 'sessions', sessionId, 'polls')),
      getDocs(collection(db, 'sessions', sessionId, 'checklistItems')),
      getDocs(collection(db, 'sessions', sessionId, 'checklistCompletions')),
    ]);
    await setDoc(doc(db, 'archivedSessions', sessionId), {
      sessionId,
      archivedAt:           serverTimestamp(),
      presence:             presSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      polls:                pollsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      checklistItems:       itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      checklistCompletions: compSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
  } catch {
    /* non-fatal */
  }
}

/* ─────────────────────────────────────────────────────────
   Activation form (lecturer only)
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
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}
        >
          <Zap size={28} color="white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Start a Live Session</h2>
        <p className="text-sm text-gray-500 mb-6">
          Activate the playground for students — auto-expires after 2 hours.
        </p>
        <div className="text-left space-y-4">
          <div>
            <label className="label">Intake</label>
            <select className="input-field" value={intake} onChange={(e) => setIntake(e.target.value)}>
              {INTAKES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <select className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
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
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '👥', label: 'Presence counter',    desc: "See who's online" },
          { icon: '🎨', label: 'Live canvas',         desc: 'Draw & annotate' },
          { icon: '📊', label: 'Understanding polls', desc: 'Thumbs up / down' },
          { icon: '✅', label: 'Progress checklist',  desc: 'Track student steps' },
        ].map((f) => (
          <div key={f.label} className="card p-3 flex items-start gap-2.5">
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
   Live session banner
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
  const urgent = remaining < 15 * 60 * 1000;

  return (
    <div
      className="card p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 animate-fadeIn"
      style={{ border: '1px solid rgba(124,58,237,0.15)' }}
    >
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-sm font-bold" style={{ color: '#059669' }}>LIVE</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">
          {session.subject} — Intake {session.intake}
        </p>
        <p className="text-xs text-gray-500">Activated by {session.activatedByName}</p>
      </div>
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
      {!isTA && (
        <button className="btn-danger !px-3 !py-2 flex-shrink-0" onClick={onEnd}>
          <StopCircle size={15} /> End
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Past session card — collapsible, with reactivate
   ───────────────────────────────────────────────────────── */
function PastSessionCard({
  session,
  onReactivate,
  reactivating,
}: {
  session:      PlaygroundSession;
  onReactivate: (s: PlaygroundSession) => Promise<void>;
  reactivating: string | null;
}) {
  const [open, setOpen] = useState(false);
  const loading = reactivating === session.id;

  return (
    <div
      className="card overflow-hidden animate-fadeIn"
      style={{ border: '1px solid rgba(139,92,246,0.10)' }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Intake badge */}
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
        >
          {session.intake}
        </span>

        {/* Subject + date */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{session.subject}</p>
          <p className="text-[11px] text-gray-400">{formatDate(session.createdAt)}</p>
        </div>

        {/* Ended badge */}
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: 'rgba(100,116,139,0.10)', color: '#64748b' }}
        >
          Ended
        </span>

        {/* Reactivate — both lecturer AND TA */}
        <button
          disabled={loading}
          onClick={(e) => { e.stopPropagation(); onReactivate(session); }}
          className="btn-secondary !px-2.5 !py-1.5 !text-xs flex-shrink-0 gap-1"
          title="Reactivate this session"
        >
          <RotateCcw size={11} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Reactivating…' : 'Reactivate'}
        </button>

        {/* Expand toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-gray-400 hover:text-brand-600 transition-colors p-1 flex-shrink-0"
          title={open ? 'Collapse' : 'Expand session data'}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded data */}
      {open && (
        <div
          style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}
          className="px-4 pb-4"
        >
          <PastSessionView sessionId={session.id} isStaff={true} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────────────────── */
export default function LivePlayground() {
  const { user, role }  = useAuth();
  const { showToast }   = useToast();
  const isTA            = role === 'teachingAssistant';
  const isLecturer      = role === 'lecturer';

  const [allSessions,  setAllSessions]  = useState<PlaygroundSession[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [ending,       setEnding]       = useState(false);
  const [reactivating, setReactivating] = useState<string | null>(null);

  // Subscribe to ALL sessions, sorted newest first — filter client-side
  useEffect(() => {
    const q   = query(collection(db, 'sessions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setAllSessions(
        snap.docs.map((d) => firestoreToSession(d.id, d.data() as Record<string, unknown>))
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  const activeSession  = allSessions.find((s) => s.status === 'active') ?? null;
  const expiredSessions = allSessions.filter((s) => s.status === 'expired');

  // Auto-expire check
  useEffect(() => {
    if (!activeSession) return;
    const check = setInterval(async () => {
      if (Date.now() >= activeSession.expiresAt.getTime()) {
        await archiveSession(activeSession.id);
        await updateDoc(doc(db, 'sessions', activeSession.id), { status: 'expired' });
        showToast({ type: 'info', title: 'Session expired', description: 'The 2-hour window has ended.' });
      }
    }, 30_000);
    return () => clearInterval(check);
  }, [activeSession, showToast]);

  const activateSession = useCallback(async (intake: string, subject: string) => {
    if (!user) return;
    const name = user.email?.split('@')[0] ?? 'Lecturer';
    await addDoc(collection(db, 'sessions'), {
      intake,
      subject,
      status:          'active',
      activatedBy:     user.uid,
      activatedByName: name,
      expiresAt:       new Date(Date.now() + TWO_HOURS_MS),
      createdAt:       serverTimestamp(),
    });
    showToast({ type: 'success', title: 'Session started!', description: `${subject} / Intake ${intake} is now live.` });
  }, [user, showToast]);

  const endSession = useCallback(async () => {
    if (!activeSession) return;
    setEnding(true);
    try {
      await archiveSession(activeSession.id);
      await updateDoc(doc(db, 'sessions', activeSession.id), { status: 'expired' });
      showToast({ type: 'info', title: 'Session ended', description: 'Data has been archived.' });
    } finally {
      setEnding(false);
    }
  }, [activeSession, showToast]);

  // Both lecturer AND TA can reactivate
  const reactivateSession = useCallback(async (session: PlaygroundSession) => {
    setReactivating(session.id);
    try {
      await updateDoc(doc(db, 'sessions', session.id), {
        status:    'active',
        expiresAt: new Date(Date.now() + TWO_HOURS_MS),
      });
      showToast({ type: 'success', title: 'Session reactivated!', description: `${session.subject} / Intake ${session.intake} is live again.` });
    } finally {
      setReactivating(null);
    }
  }, [showToast]);

  return (
    <Layout>
      <PageHeader
        title="Live Lesson Playground"
        subtitle="Real-time collaborative tools for your class"
        actions={
          activeSession && !isTA ? (
            <button className="btn-danger !px-3 !py-2" onClick={endSession} disabled={ending}>
              <StopCircle size={14} /> {ending ? 'Ending…' : 'End Session'}
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          {/* ── Active session ── */}
          {activeSession ? (
            <>
              <SessionBanner session={activeSession} onEnd={endSession} isTA={isTA} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <PresencePanel
                    sessionId={activeSession.id}
                    userId={user!.uid}
                    userName={user!.email?.split('@')[0] ?? 'Staff'}
                    userRole={role ?? 'lecturer'}
                    isStaff={true}
                    writePresence={true}
                  />
                  <LecturerPollPanel sessionId={activeSession.id} />
                </div>
                <div className="space-y-4">
                  <LecturerCanvas sessionId={activeSession.id} userId={user!.uid} />
                  <LecturerChecklistPanel sessionId={activeSession.id} />
                </div>
              </div>
            </>
          ) : (
            /* No active session */
            isLecturer
              ? <ActivationForm onActivate={activateSession} />
              : (
                <div className="max-w-md mx-auto text-center py-16 animate-fadeIn">
                  <div
                    className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(124,58,237,0.08)' }}
                  >
                    <Radio size={28} style={{ color: '#a78bfa' }} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">No active session</h2>
                  <p className="text-sm text-gray-500">
                    A lecturer needs to activate the playground. You can reactivate a past session below.
                  </p>
                </div>
              )
          )}

          {/* ── Session History ── */}
          {expiredSessions.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <History size={16} style={{ color: '#a78bfa' }} />
                <h2 className="section-label !mb-0">Session History ({expiredSessions.length})</h2>
              </div>
              <div className="space-y-3">
                {expiredSessions.map((s) => (
                  <PastSessionCard
                    key={s.id}
                    session={s}
                    onReactivate={reactivateSession}
                    reactivating={reactivating}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
