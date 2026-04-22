import { useEffect, useState, useCallback, useRef } from 'react';
import {
  collection, query, where, getDocs, addDoc, serverTimestamp,
  Timestamp, doc, getDoc,
} from 'firebase/firestore';
import { Clock, Send, AlertCircle, CheckCircle, Zap, FileText } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { AttendanceSession, AttendanceCheckpoint, StudentProfile, AttendanceLocationData } from '../../lib/types';
import { useToast } from '../../components/ui/ToastProvider';
import { secondsUntil, formatDateTime } from '../../lib/utils';
import { logEvent } from '../../lib/eventLog';
import { useFeatureTracking } from '../../lib/useFeatureTracking';
import { captureLocationSnapshot } from '../../lib/locationUtils';

interface ActiveCheckpoint {
  session:    AttendanceSession;
  checkpoint: AttendanceCheckpoint;
}

export default function StudentAttendance() {
  const { user } = useAuth();
  useFeatureTracking('Student Attendance');
  const [active,   setActive]   = useState<ActiveCheckpoint[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [code,     setCode]     = useState('');
  const [status,   setStatus]   = useState<'idle' | 'submitting'>('idle');
  const [timers,   setTimers]   = useState<Record<string, number>>({});
  const [profile,  setProfile]  = useState<StudentProfile | null>(null);
  const [absenceType, setAbsenceType] = useState<'absent' | 'excused'>('absent');
  const [absenceReason, setAbsenceReason] = useState('');
  const [absenceSubmitting, setAbsenceSubmitting] = useState(false);
  const { showToast } = useToast();

  // Start location capture silently in the background as soon as the page loads
  const locationCapture = useRef<Promise<AttendanceLocationData | null>>(
    captureLocationSnapshot().catch(() => null),
  );

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'students', user.uid)).then(snap => {
      if (snap.exists()) setProfile(snap.data() as StudentProfile);
    });
  }, [user]);

  const fetchActive = useCallback(async () => {
    const sessSnap = await getDocs(
      query(collection(db, 'attendanceSessions'), where('status', '==', 'active'))
    );
    const now   = new Date();
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

  useEffect(() => {
    if (active.length === 0) return;
    const id = setInterval(() => {
      const next: Record<string, number> = {};
      active.forEach(({ checkpoint: cp }) => { next[cp.id] = secondsUntil(cp.expiresAt); });
      setTimers(next);
      setActive(prev => prev.filter(({ checkpoint: cp }) => cp.expiresAt > new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const handleSubmit = async (e: React.FormEvent, item: ActiveCheckpoint) => {
    e.preventDefault();
    if (!user || !profile) {
      showToast({ type: 'error', title: 'Profile required', description: 'Please complete your profile first.' });
      setStatus('idle');
      return;
    }
    if (!profile.campus || !profile.section) {
      showToast({ type: 'error', title: 'Profile incomplete', description: 'Please complete your Campus and Section fields first.' });
      setStatus('idle');
      return;
    }
    setStatus('submitting');
    const entered = code.trim().toUpperCase();
    if (entered !== item.checkpoint.code) {
      showToast({ type: 'error', title: 'Incorrect code', description: 'Please check and try again.' });
      setStatus('idle');
      return;
    }
    const existing = await getDocs(query(
      collection(db, 'attendanceRecords'),
      where('sessionId',    '==', item.session.id),
      where('checkpointId', '==', item.checkpoint.id),
      where('studentUid',   '==', user.uid),
    ));
    if (!existing.empty) {
      showToast({ type: 'error', title: 'Already submitted', description: 'You have already submitted attendance for this checkpoint.' });
      setStatus('idle');
      return;
    }

    // Collect location data – race against 1.5 s so submission is never blocked
    const location = await Promise.race([
      locationCapture.current,
      new Promise<null>(res => setTimeout(() => res(null), 1500)),
    ]);

    try {
      await addDoc(collection(db, 'attendanceRecords'), {
        sessionId:        item.session.id,
        sessionTitle:     item.session.title,
        sessionCourse:    item.session.course,
        studentUid:       user.uid,
        studentName:      profile.fullName,
        studentDisplayId: profile.studentId,
        studentCampus:    profile.campus,
        studentSection:   profile.section,
        checkpointId:     item.checkpoint.id,
        checkpointLabel:  item.checkpoint.label,
        submittedAt:      serverTimestamp(),
        ...(location ? { location } : {}),
      });
      await logEvent({
        type: 'attendance_marked',
        description: `${profile.fullName} marked attendance for ${item.session.title} (${item.checkpoint.label}).`,
        actorUid: user.uid,
        actorEmail: user.email,
        actorRole: 'student',
        targetUid: user.uid,
        targetName: profile.fullName,
      }).catch(() => undefined);
      showToast({ type: 'success', title: 'Attendance recorded', description: 'Your attendance has been submitted successfully.' });
      setStatus('idle');
      setCode('');
      setTimeout(() => { fetchActive(); }, 3000);
    } catch {
      showToast({ type: 'error', title: 'Submission failed', description: 'Failed to submit. Please try again.' });
      setStatus('idle');
    }
  };

  const reportDateKey = new Date().toISOString().slice(0, 10);

  const handleAbsenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      showToast({ type: 'error', title: 'Profile required', description: 'Please complete your profile first.' });
      return;
    }
    const reason = absenceReason.trim();
    if (reason.length < 5) {
      showToast({ type: 'error', title: 'Reason required', description: 'Please provide a brief reason (at least 5 characters).' });
      return;
    }
    setAbsenceSubmitting(true);
    try {
      const existing = await getDocs(query(
        collection(db, 'absenceNotices'),
        where('studentUid', '==', user.uid),
        where('reportDateKey', '==', reportDateKey),
      ));
      if (!existing.empty) {
        showToast({
          type: 'error',
          title: 'Already reported',
          description: `You have already submitted an absence for ${reportDateKey}.`,
        });
        setAbsenceSubmitting(false);
        return;
      }

      await addDoc(collection(db, 'absenceNotices'), {
        studentUid: user.uid,
        studentName: profile.fullName,
        studentDisplayId: profile.studentId,
        studentCampus: profile.campus,
        studentSection: profile.section,
        sessionCourse: profile.course,
        reportDateKey,
        status: absenceType,
        reason,
        createdAt: serverTimestamp(),
      });
      await logEvent({
        type: 'absence_reported',
        description: `${profile.fullName} submitted an absence notice (${absenceType}) for ${reportDateKey}.`,
        actorUid: user.uid,
        actorEmail: user.email,
        actorRole: 'student',
        targetUid: user.uid,
        targetName: profile.fullName,
      }).catch(() => undefined);
      showToast({
        type: 'success',
        title: 'Absence submitted',
        description: 'Your absence notice has been sent to your lecturer.',
      });
      setAbsenceReason('');
      setAbsenceType('absent');
    } catch {
      showToast({ type: 'error', title: 'Submission failed', description: 'Could not submit your absence. Please try again.' });
    } finally {
      setAbsenceSubmitting(false);
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <PageHeader
        title="Submit Attendance"
        subtitle="Enter the code shown by your lecturer"
      />

      {/* Profile warning */}
      {!profile && (
        <div
          className="flex items-start gap-3 px-5 py-4 rounded-3xl mb-6 animate-fadeIn"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(249,115,22,0.05))',
            border: '1px solid rgba(245,158,11,0.20)',
          }}
        >
          <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
          <p className="text-sm font-medium" style={{ color: '#92400e' }}>
            Please complete your{' '}
            <a href="/student/profile" className="underline font-semibold" style={{ color: '#d97706' }}>
              profile
            </a>
            {' '}before submitting attendance.
          </p>
        </div>
      )}

      {active.length === 0 ? (
        <div
          className="p-16 rounded-3xl flex flex-col items-center gap-4 text-center animate-fadeIn"
          style={{
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(139,92,246,0.10)',
            boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
          }}
        >
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.05))' }}
          >
            <Clock size={28} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: '#1e1b4b' }}>No active session</h3>
            <p className="text-sm font-medium mt-1 max-w-xs mx-auto" style={{ color: '#9ca3af' }}>
              Your lecturer will start a session during class. Check back when you're in the live session.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5 max-w-md">
          {active.map(item => {
            const secsLeft = timers[item.checkpoint.id] ?? secondsUntil(item.checkpoint.expiresAt);
            const pct      = Math.round((secsLeft / (item.checkpoint.windowMinutes * 60)) * 100);
            const urgent   = secsLeft < 60;

            return (
              <div
                key={`${item.session.id}-${item.checkpoint.id}`}
                className="rounded-3xl p-6 animate-fadeIn"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid rgba(124,58,237,0.15)',
                  boxShadow: '0 4px 24px rgba(124,58,237,0.10)',
                }}
              >
                {/* Session info */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-bold text-base" style={{ color: '#1e1b4b' }}>{item.session.title}</h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: '#9ca3af' }}>{item.session.course}</p>
                  </div>
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}
                  >
                    {item.checkpoint.label}
                  </span>
                </div>

                {/* Timer */}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5"
                  style={{
                    background: urgent
                      ? 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.06))'
                      : 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.04))',
                    border: `1px solid ${urgent ? 'rgba(239,68,68,0.18)' : 'rgba(124,58,237,0.12)'}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: urgent ? 'rgba(239,68,68,0.10)' : 'rgba(124,58,237,0.08)',
                    }}
                  >
                    <Clock size={15} style={{ color: urgent ? '#ef4444' : '#7c3aed' }} />
                  </div>
                  <span
                    className="text-sm font-bold tabular-nums flex-1"
                    style={{ color: urgent ? '#ef4444' : '#7c3aed' }}
                  >
                    {String(Math.floor(secsLeft / 60)).padStart(2, '0')}:{String(secsLeft % 60).padStart(2, '0')} remaining
                  </span>
                  {/* Progress bar */}
                  <div className="w-24 h-2 rounded-full overflow-hidden flex-shrink-0"
                    style={{ background: urgent ? 'rgba(239,68,68,0.12)' : 'rgba(124,58,237,0.10)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${pct}%`,
                        background: urgent
                          ? 'linear-gradient(90deg, #ef4444, #f97316)'
                          : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                      }}
                    />
                  </div>
                </div>

                {/* Code entry */}
                <form onSubmit={e => handleSubmit(e, item)} className="space-y-4">
                  <div>
                    <label className="label">Attendance code</label>
                    <input
                      className="input-field code-display text-center text-2xl font-black tracking-[0.25em] uppercase"
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
                  <button
                    type="submit"
                    disabled={status === 'submitting' || code.length < 6}
                    className="btn-primary w-full justify-center py-3"
                  >
                    {status === 'submitting' ? (
                      <><LoadingSpinner size="sm" />Submitting…</>
                    ) : (
                      <><Send size={15} />Submit attendance</>
                    )}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="mt-6 rounded-3xl p-6 max-w-xl animate-fadeIn"
        style={{
          background: 'rgba(255,255,255,0.90)',
          border: '1px solid rgba(139,92,246,0.12)',
          boxShadow: '0 4px 24px rgba(124,58,237,0.08)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(167,139,250,0.07))' }}
          >
            <FileText size={14} style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Can&apos;t attend today?</h3>
            <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>
              Submit an absence reason for {reportDateKey}.
            </p>
          </div>
        </div>

        <form onSubmit={handleAbsenceSubmit} className="space-y-3">
          <div>
            <label className="label">Type</label>
            <select
              className="input-field"
              value={absenceType}
              onChange={e => setAbsenceType(e.target.value as 'absent' | 'excused')}
            >
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
            </select>
          </div>
          <div>
            <label className="label">Reason</label>
            <textarea
              className="input-field min-h-24 resize-y"
              value={absenceReason}
              onChange={e => setAbsenceReason(e.target.value)}
              placeholder="Type your reason here..."
              required
            />
          </div>
          <button type="submit" className="btn-secondary" disabled={absenceSubmitting}>
            {absenceSubmitting ? <LoadingSpinner size="sm" /> : <Send size={15} />}
            Submit absence notice
          </button>
        </form>
      </div>
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
