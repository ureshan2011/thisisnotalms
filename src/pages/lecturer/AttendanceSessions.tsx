import { useEffect, useState, useCallback } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, doc,
  serverTimestamp, Timestamp, orderBy, query,
} from 'firebase/firestore';
import {
  Plus, Play, StopCircle, Clock, CheckCircle2,
  CalendarCheck, ChevronRight, Zap, Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import type { AttendanceSession, AttendanceCheckpoint } from '../../lib/types';
import { generateCode, formatDateTime, secondsUntil } from '../../lib/utils';

const WINDOW_OPTIONS = [2, 3, 4, 5, 8, 10];

function firestoreToSession(id: string, data: Record<string, unknown>): AttendanceSession {
  return {
    id,
    title:      (data.title as string) || '',
    course:     (data.course as string) || '',
    date:       (data.date as Timestamp)?.toDate?.() ?? new Date(),
    lecturerId: (data.lecturerId as string) || '',
    status:     (data.status as 'active' | 'closed') || 'closed',
    createdAt:  (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
    checkpoints: ((data.checkpoints as unknown[]) || []).map((cp: unknown) => {
      const c = cp as Record<string, unknown>;
      return {
        id:            c.id as string,
        label:         (c.label as string) || '',
        code:          (c.code as string) || '',
        windowMinutes: (c.windowMinutes as number) || 4,
        startTime:     (c.startTime as Timestamp)?.toDate?.() ?? new Date(),
        expiresAt:     (c.expiresAt as Timestamp)?.toDate?.() ?? new Date(),
        isActive:      (c.isActive as boolean) ?? false,
      };
    }),
  };
}

export default function AttendanceSessions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions,  setSessions]  = useState<AttendanceSession[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState({ title: '', course: '', window: 4 });
  const [creating,  setCreating]  = useState(false);
  const [ticking,   setTicking]   = useState<Record<string, number>>({});

  const load = useCallback(async () => {
    const snap = await getDocs(query(collection(db, 'attendanceSessions'), orderBy('createdAt', 'desc')));
    setSessions(snap.docs.map(d => firestoreToSession(d.id, d.data() as Record<string, unknown>)));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Tick active checkpoints
  useEffect(() => {
    const id = setInterval(() => {
      const next: Record<string, number> = {};
      for (const s of sessions) {
        for (const cp of s.checkpoints) {
          if (cp.isActive) next[`${s.id}-${cp.id}`] = secondsUntil(cp.expiresAt);
        }
      }
      setTicking(next);
    }, 1000);
    return () => clearInterval(id);
  }, [sessions]);

  const createSession = async () => {
    if (!user || !form.title || !form.course) return;
    setCreating(true);
    await addDoc(collection(db, 'attendanceSessions'), {
      title:       form.title,
      course:      form.course,
      date:        serverTimestamp(),
      lecturerId:  user.uid,
      checkpoints: [],
      status:      'active',
      createdAt:   serverTimestamp(),
    });
    setModal(false);
    setForm({ title: '', course: '', window: 4 });
    await load();
    setCreating(false);
  };

  const launchCheckpoint = async (session: AttendanceSession, label: string, windowMins: number) => {
    const now     = new Date();
    const expires = new Date(now.getTime() + windowMins * 60 * 1000);
    const code    = generateCode(6);
    const cpId    = `cp_${Date.now()}`;

    const newCp = {
      id:            cpId,
      label,
      code,
      windowMinutes: windowMins,
      startTime:     Timestamp.fromDate(now),
      expiresAt:     Timestamp.fromDate(expires),
      isActive:      true,
    };

    // Deactivate previous checkpoints first
    const updatedCps = session.checkpoints.map(cp => ({
      ...cp,
      startTime: Timestamp.fromDate(cp.startTime),
      expiresAt: Timestamp.fromDate(cp.expiresAt),
      isActive:  false,
    }));

    await updateDoc(doc(db, 'attendanceSessions', session.id), {
      checkpoints: [...updatedCps, newCp],
    });
    await load();
  };

  const closeSession = async (session: AttendanceSession) => {
    const updatedCps = session.checkpoints.map(cp => ({
      ...cp,
      startTime: Timestamp.fromDate(cp.startTime),
      expiresAt: Timestamp.fromDate(cp.expiresAt),
      isActive:  false,
    }));
    await updateDoc(doc(db, 'attendanceSessions', session.id), {
      status:      'closed',
      checkpoints: updatedCps,
    });
    await load();
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  const active = sessions.filter(s => s.status === 'active');
  const closed = sessions.filter(s => s.status === 'closed');

  return (
    <Layout>
      <PageHeader
        title="Attendance Sessions"
        subtitle="Create and manage live attendance"
        actions={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Plus size={16} /> New session
          </button>
        }
      />

      {/* Active sessions */}
      {active.length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active</h2>
          {active.map(s => (
            <ActiveSessionCard
              key={s.id}
              session={s}
              ticking={ticking}
              onLaunch={launchCheckpoint}
              onClose={closeSession}
              onView={() => navigate(`/lecturer/attendance/${s.id}`)}
            />
          ))}
        </div>
      )}

      {/* Closed sessions */}
      {closed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Past sessions</h2>
          {closed.map(s => (
            <div
              key={s.id}
              onClick={() => navigate(`/lecturer/attendance/${s.id}`)}
              className="card p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="bg-slate-100 text-slate-500 p-2.5 rounded-xl">
                <CalendarCheck size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800">{s.title}</p>
                <p className="text-xs text-slate-400">{s.course} · {formatDateTime(s.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge bg-slate-100 text-slate-500">{s.checkpoints.length} checkpoint{s.checkpoints.length !== 1 ? 's' : ''}</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {sessions.length === 0 && (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-50 p-4 rounded-2xl">
              <CalendarCheck size={32} className="text-brand-500" />
            </div>
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">No sessions yet</h3>
          <p className="text-sm text-slate-400 mb-4">Create a session when your class begins to start taking attendance.</p>
          <button onClick={() => setModal(true)} className="btn-primary mx-auto">
            <Plus size={16} /> Create first session
          </button>
        </div>
      )}

      {/* Create session modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="New attendance session">
        <div className="space-y-4">
          <div>
            <label className="label">Session title <span className="text-red-400">*</span></label>
            <input className="input-field" placeholder="e.g. Week 3 — Machine Learning" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Course <span className="text-red-400">*</span></label>
            <input className="input-field" placeholder="e.g. MSc Data Science" value={form.course}
              onChange={e => setForm(f => ({ ...f, course: e.target.value }))} />
          </div>
          <p className="text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2.5">
            After creating the session you can launch checkpoints with custom time windows.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button
              onClick={createSession}
              disabled={creating || !form.title || !form.course}
              className="btn-primary flex-1 justify-center"
            >
              {creating ? <LoadingSpinner size="sm" /> : <Plus size={16} />}
              Create session
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

function ActiveSessionCard({
  session, ticking, onLaunch, onClose, onView,
}: {
  session:  AttendanceSession;
  ticking:  Record<string, number>;
  onLaunch: (s: AttendanceSession, label: string, window: number) => Promise<void>;
  onClose:  (s: AttendanceSession) => Promise<void>;
  onView:   () => void;
}) {
  const [launching, setLaunching] = useState(false);
  const [closing,   setClosing]   = useState(false);
  const [window,    setWindow]    = useState(4);

  const activeCP = session.checkpoints.find(cp => cp.isActive && cp.expiresAt > new Date());
  const cpCount  = session.checkpoints.length;
  const nextLabel = cpCount === 0 ? 'Opening' : cpCount === 1 ? 'Mid-session' : `Checkpoint ${cpCount + 1}`;

  const doLaunch = async () => {
    setLaunching(true);
    await onLaunch(session, nextLabel, window);
    setLaunching(false);
  };

  const doClose = async () => {
    if (!confirm(`Close "${session.title}"? Students will no longer be able to submit.`)) return;
    setClosing(true);
    await onClose(session);
    setClosing(false);
  };

  const secsLeft = activeCP ? (ticking[`${session.id}-${activeCP.id}`] ?? secondsUntil(activeCP.expiresAt)) : 0;

  return (
    <div className="card p-6 border-brand-100 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
        <div className="bg-brand-600 text-white p-3 rounded-xl">
          <CalendarCheck size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-800">{session.title}</h3>
            <span className="badge bg-emerald-100 text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{session.course}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onView} className="btn-secondary">
            <Eye size={14} /> Results
          </button>
          <button onClick={doClose} disabled={closing} className="btn-danger">
            {closing ? <LoadingSpinner size="sm" /> : <StopCircle size={14} />}
            Close
          </button>
        </div>
      </div>

      {/* Active code display */}
      {activeCP && secsLeft > 0 ? (
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 mb-5 text-center pulse-ring">
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-2">{activeCP.label} · Active code</p>
          <p className="code-display text-4xl font-black text-brand-700 tracking-[0.3em] mb-3">{activeCP.code}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-brand-600">
            <Clock size={14} />
            <span className="tabular-nums font-semibold">
              {String(Math.floor(secsLeft / 60)).padStart(2, '0')}:{String(secsLeft % 60).padStart(2, '0')} remaining
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-brand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.round((secsLeft / (activeCP.windowMinutes * 60)) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-4 mb-5 text-center text-sm text-slate-400">
          {cpCount === 0 ? 'No checkpoints launched yet.' : 'Last checkpoint has expired.'}
          {' '}Launch a new one below.
        </div>
      )}

      {/* Checkpoint history */}
      {session.checkpoints.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {session.checkpoints.map(cp => {
            const expired = cp.expiresAt <= new Date();
            return (
              <div key={cp.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl text-xs">
                <span className="font-medium text-slate-600">{cp.label}</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-slate-700 font-bold">{cp.code}</code>
                  {expired
                    ? <span className="badge bg-slate-100 text-slate-400"><CheckCircle2 size={11} /> Expired</span>
                    : <span className="badge bg-brand-100 text-brand-600 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />Active
                      </span>
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Launch next checkpoint */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Window:</label>
          <select
            value={window}
            onChange={e => setWindow(Number(e.target.value))}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {WINDOW_OPTIONS.map(w => (
              <option key={w} value={w}>{w} min</option>
            ))}
          </select>
        </div>
        <button onClick={doLaunch} disabled={launching} className="btn-primary">
          {launching ? <LoadingSpinner size="sm" /> : <Zap size={15} />}
          Launch {nextLabel}
        </button>
      </div>
    </div>
  );
}
