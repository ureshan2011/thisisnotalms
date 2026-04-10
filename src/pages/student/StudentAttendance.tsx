import { useEffect, useState, useCallback } from 'react';
import {
  collection, query, where, getDocs, addDoc, serverTimestamp,
  Timestamp, doc, getDoc,
} from 'firebase/firestore';
import { CheckCircle2, Clock, KeyRound, Send, AlertCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { AttendanceSession, AttendanceCheckpoint, StudentProfile } from '../../lib/types';
import { secondsUntil, formatDateTime } from '../../lib/utils';

interface ActiveCheckpoint {
  session:    AttendanceSession;
  checkpoint: AttendanceCheckpoint;
}

export default function StudentAttendance() {
  const { user } = useAuth();
  const [active,   setActive]   = useState<ActiveCheckpoint[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [code,     setCode]     = useState('');
  const [status,   setStatus]   = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message,  setMessage]  = useState('');
  const [timers,   setTimers]   = useState<Record<string, number>>({});
  const [profile,  setProfile]  = useState<StudentProfile | null>(null);

  // Load student profile
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'students', user.uid)).then(snap => {
      if (snap.exists()) setProfile(snap.data() as StudentProfile);
    });
  }, [user]);

  // Find open attendance sessions/checkpoints
  const fetchActive = useCallback(async () => {
    const sessSnap = await getDocs(
      query(collection(db, 'attendanceSessions'), where('status', '==', 'active'))
    );
    const now = new Date();
    const found: ActiveCheckpoint[] = [];

    for (const s of sessSnap.docs) {
      const session = firestoreToSession(s.id, s.data());
      for (const cp of session.checkpoints) {
        if (cp.isActive && cp.expiresAt > now && cp.startTime <= now) {
          found.push({ session, checkpoint: cp });
        }
      }
    }
    setActive(found);
    setLoading(false);
  }, []);

  useEffect(() => { fetchActive(); }, [fetchActive]);

  // Live countdown timers
  useEffect(() => {
    if (active.length === 0) return;
    const id = setInterval(() => {
      const next: Record<string, number> = {};
      active.forEach(({ checkpoint: cp }) => {
        next[cp.id] = secondsUntil(cp.expiresAt);
      });
      setTimers(next);
      // Remove expired
      setActive(prev => prev.filter(({ checkpoint: cp }) => cp.expiresAt > new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const handleSubmit = async (e: React.FormEvent, item: ActiveCheckpoint) => {
    e.preventDefault();
    if (!user || !profile) {
      setMessage('Please complete your profile first before submitting attendance.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setMessage('');

    const entered = code.trim().toUpperCase();
    if (entered !== item.checkpoint.code) {
      setMessage('Incorrect code. Please check and try again.');
      setStatus('error');
      return;
    }

    // Check already submitted
    const existing = await getDocs(
      query(
        collection(db, 'attendanceRecords'),
        where('sessionId',    '==', item.session.id),
        where('checkpointId', '==', item.checkpoint.id),
        where('studentUid',   '==', user.uid),
      )
    );
    if (!existing.empty) {
      setMessage('You have already submitted attendance for this checkpoint.');
      setStatus('error');
      return;
    }

    try {
      await addDoc(collection(db, 'attendanceRecords'), {
        sessionId:       item.session.id,
        sessionTitle:    item.session.title,
        sessionCourse:   item.session.course,
        studentUid:      user.uid,
        studentName:     profile.fullName,
        studentDisplayId: profile.studentId,
        checkpointId:    item.checkpoint.id,
        checkpointLabel: item.checkpoint.label,
        submittedAt:     serverTimestamp(),
      });
      setMessage('Attendance recorded successfully!');
      setStatus('success');
      setCode('');
      // Refresh after 3s
      setTimeout(() => { fetchActive(); setStatus('idle'); setMessage(''); }, 3000);
    } catch {
      setMessage('Failed to submit. Please try again.');
      setStatus('error');
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <PageHeader
        title="Submit Attendance"
        subtitle="Enter the code shown by your lecturer"
      />

      {!profile && (
        <div className="card p-5 mb-6 border-amber-200 bg-amber-50 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            Please complete your <a href="/student/profile" className="underline font-medium">profile</a> before submitting attendance.
          </p>
        </div>
      )}

      {active.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100 p-4 rounded-2xl">
              <Clock size={32} className="text-slate-400" />
            </div>
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">No active attendance session</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Your lecturer will start a session during class. Check back when you're in the live session.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-md">
          {active.map(item => {
            const secsLeft = timers[item.checkpoint.id] ?? secondsUntil(item.checkpoint.expiresAt);
            const pct      = Math.round((secsLeft / (item.checkpoint.windowMinutes * 60)) * 100);
            const urgent   = secsLeft < 60;

            return (
              <div key={`${item.session.id}-${item.checkpoint.id}`} className="card p-6 animate-fadeIn">
                {/* Session info */}
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-800">{item.session.title}</h3>
                    <span className="badge bg-brand-100 text-brand-700">{item.checkpoint.label}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.session.course}</p>
                </div>

                {/* Timer */}
                <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-xl ${urgent ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-700'}`}>
                  <Clock size={15} />
                  <span className="text-sm font-semibold tabular-nums">
                    {String(Math.floor(secsLeft / 60)).padStart(2, '0')}:{String(secsLeft % 60).padStart(2, '0')} remaining
                  </span>
                  {/* Progress bar */}
                  <div className="ml-auto w-20 h-1.5 bg-current/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${urgent ? 'bg-red-500' : 'bg-brand-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Code entry */}
                {status === 'success' ? (
                  <div className="flex items-center gap-2 text-emerald-600 py-3 justify-center">
                    <CheckCircle2 size={20} />
                    <span className="font-semibold">{message}</span>
                  </div>
                ) : (
                  <form onSubmit={e => handleSubmit(e, item)} className="space-y-3">
                    <div>
                      <label className="label">Attendance code</label>
                      <input
                        className="input-field code-display text-center text-xl font-bold tracking-widest uppercase"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        required
                        placeholder="XXXXXX"
                        autoFocus
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>
                    {status === 'error' && message && (
                      <p className="text-sm text-red-600 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {message}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'submitting' || code.length < 6}
                      className="btn-primary w-full justify-center"
                    >
                      {status === 'submitting' ? (
                        <><LoadingSpinner size="sm" />Submitting…</>
                      ) : (
                        <><Send size={15} />Submit attendance</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

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
        id:            (c.id as string) || '',
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
