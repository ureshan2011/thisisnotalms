import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  collection, query, where, getDocs, addDoc, serverTimestamp,
  Timestamp, doc, getDoc,
} from 'firebase/firestore';
import { Clock, Send, CheckCircle, AlertCircle, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import { FullPageSpinner } from '../../components/ui/LoadingSpinner';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BrandMark from '../../components/ui/BrandMark';
import { useToast } from '../../components/ui/ToastProvider';
import type { AttendanceSession, AttendanceCheckpoint, StudentProfile } from '../../lib/types';
import { secondsUntil } from '../../lib/utils';

interface ActiveCheckpoint {
  session:    AttendanceSession;
  checkpoint: AttendanceCheckpoint;
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

export default function QuickAttend() {
  const { code: codeParam } = useParams<{ code: string }>();
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [item,       setItem]       = useState<ActiveCheckpoint | null>(null);
  const [fetching,   setFetching]   = useState(false);
  const [notFound,   setNotFound]   = useState(false);
  const [profile,    setProfile]    = useState<StudentProfile | null>(null);
  const [secsLeft,   setSecsLeft]   = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  // Fetch active checkpoint matching the code
  const fetchCheckpoint = useCallback(async () => {
    if (!codeParam) { setNotFound(true); return; }
    setFetching(true);
    const snap = await getDocs(
      query(collection(db, 'attendanceSessions'), where('status', '==', 'active'))
    );
    const now  = new Date();
    const code = codeParam.toUpperCase();
    let found: ActiveCheckpoint | null = null;
    for (const s of snap.docs) {
      const session = firestoreToSession(s.id, s.data());
      for (const cp of session.checkpoints) {
        if (cp.isActive && cp.code === code && cp.expiresAt > now && cp.startTime <= now) {
          found = { session, checkpoint: cp };
          break;
        }
      }
      if (found) break;
    }
    if (found) {
      setItem(found);
      setSecsLeft(secondsUntil(found.checkpoint.expiresAt));
    } else {
      setNotFound(true);
    }
    setFetching(false);
  }, [codeParam]);

  // Fetch student profile
  useEffect(() => {
    if (!user || role !== 'student') return;
    getDoc(doc(db, 'students', user.uid)).then(snap => {
      if (snap.exists()) setProfile(snap.data() as StudentProfile);
    });
  }, [user, role]);

  // Fetch checkpoint once student is confirmed
  useEffect(() => {
    if (user && role === 'student') fetchCheckpoint();
  }, [user, role, fetchCheckpoint]);

  // Check if already submitted
  useEffect(() => {
    if (!user || !item) return;
    getDocs(query(
      collection(db, 'attendanceRecords'),
      where('sessionId',    '==', item.session.id),
      where('checkpointId', '==', item.checkpoint.id),
      where('studentUid',   '==', user.uid),
    )).then(snap => { if (!snap.empty) setAlreadyDone(true); });
  }, [user, item]);

  // Live countdown
  useEffect(() => {
    if (!item) return;
    const id = setInterval(() => {
      const s = secondsUntil(item.checkpoint.expiresAt);
      setSecsLeft(s);
      if (s <= 0) { setNotFound(true); setItem(null); clearInterval(id); }
    }, 1000);
    return () => clearInterval(id);
  }, [item]);

  const handleSubmit = async () => {
    if (!user || !item || !profile) return;
    if (!profile.campus || !profile.section) {
      showToast({ type: 'error', title: 'Profile incomplete', description: 'Please complete your Campus and Section fields.' });
      return;
    }
    setSubmitting(true);
    const existing = await getDocs(query(
      collection(db, 'attendanceRecords'),
      where('sessionId',    '==', item.session.id),
      where('checkpointId', '==', item.checkpoint.id),
      where('studentUid',   '==', user.uid),
    ));
    if (!existing.empty) { setAlreadyDone(true); setSubmitting(false); return; }
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
      });
      setSubmitted(true);
    } catch {
      showToast({ type: 'error', title: 'Submission failed', description: 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (authLoading) return <FullPageSpinner />;

  // ── Not logged in → login prompt ──────────────────────────────────────────
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 40%, #f0f9ff 100%)' }}
      >
        <div className="auth-orb-1" /><div className="auth-orb-2" /><div className="auth-orb-3" />
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139,92,246,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="w-full max-w-sm relative z-10 animate-slideUp">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-brand-400/25 rounded-3xl blur-xl animate-pulse" />
              <div className="relative rounded-3xl p-4 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}
              >
                <BrandMark className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1e1b4b' }}>YooBees</h1>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-sm font-medium" style={{ color: '#a78bfa' }}>Student Support System</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
                style={{ background: 'rgba(124,58,237,0.12)', color: '#6d28d9', border: '1px solid rgba(124,58,237,0.18)' }}
              >
                BETA
              </span>
            </div>
          </div>

          {/* Card */}
          <div
            className="w-full p-8 animate-scaleIn"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 24px 64px rgba(124,106,247,0.14), 0 8px 24px rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="rounded-2xl p-2"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(167,139,250,0.08) 100%)' }}
              >
                <Sparkles size={16} style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight" style={{ color: '#1e1b4b' }}>Mark Attendance</h2>
                <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>Sign in to submit your attendance</p>
              </div>
            </div>

            {/* Code badge */}
            <div
              className="rounded-2xl px-5 py-4 text-center mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.04))',
                border: '1px solid rgba(124,58,237,0.12)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#a78bfa' }}>
                Attendance code
              </p>
              <p
                className="code-display text-3xl font-black tracking-[0.25em]"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {codeParam?.toUpperCase()}
              </p>
            </div>

            <p className="text-sm font-medium text-center mb-5" style={{ color: '#6b7280' }}>
              Log in to your YooBees account to submit attendance for this session.
            </p>

            <button
              onClick={() => navigate(`/login?next=/attend/${codeParam?.toUpperCase()}`)}
              className="btn-primary w-full justify-center py-3 mb-3"
            >
              <LogIn size={16} />
              Log in &amp; mark attendance
            </button>

            <div className="divider my-4" />
            <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
              Don't have an account?{' '}
              <Link
                to={`/register`}
                className="font-semibold transition-colors hover:underline"
                style={{ color: '#7c3aed' }}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Lecturer landed here ───────────────────────────────────────────────────
  if (role === 'lecturer') {
    return (
      <Layout>
        <div
          className="p-12 rounded-3xl flex flex-col items-center gap-4 text-center animate-fadeIn max-w-sm mx-auto mt-8"
          style={{
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(139,92,246,0.10)',
            boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
          }}
        >
          <div className="w-14 h-14 rounded-3xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.05))' }}
          >
            <AlertCircle size={26} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h3 className="font-bold text-base mb-1" style={{ color: '#1e1b4b' }}>This link is for students</h3>
            <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>
              Share this QR code or link with your students so they can quickly mark attendance.
            </p>
          </div>
          <button onClick={() => navigate('/lecturer/attendance')} className="btn-primary">
            <ArrowRight size={15} /> Back to sessions
          </button>
        </div>
      </Layout>
    );
  }

  // ── Student flow ──────────────────────────────────────────────────────────
  const urgent = secsLeft < 60;
  const pct    = item ? Math.round((secsLeft / (item.checkpoint.windowMinutes * 60)) * 100) : 0;

  return (
    <Layout>
      <PageHeader title="Quick Attendance" subtitle="Tap submit to mark your attendance" />

      <div className="max-w-md">
        {/* Profile incomplete warning */}
        {profile && (!profile.campus || !profile.section) && (
          <div
            className="flex items-start gap-3 px-5 py-4 rounded-3xl mb-5 animate-fadeIn"
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
              {' '}(Campus &amp; Section) before submitting.
            </p>
          </div>
        )}

        {fetching && (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        )}

        {/* Expired / not found */}
        {!fetching && notFound && (
          <div
            className="p-12 rounded-3xl flex flex-col items-center gap-4 text-center animate-fadeIn"
            style={{
              background: 'rgba(255,255,255,0.88)',
              border: '1px solid rgba(139,92,246,0.10)',
              boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
            }}
          >
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.05))' }}
            >
              <Clock size={26} style={{ color: '#f87171' }} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: '#1e1b4b' }}>Code expired or not found</h3>
              <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>
                This attendance window has closed. Ask your lecturer for the current code.
              </p>
            </div>
            <button onClick={() => navigate('/student/attendance')} className="btn-primary">
              <ArrowRight size={15} /> Open attendance page
            </button>
          </div>
        )}

        {/* Already submitted */}
        {!fetching && (submitted || alreadyDone) && item && (
          <div
            className="p-10 rounded-3xl flex flex-col items-center gap-4 text-center animate-fadeIn"
            style={{
              background: 'rgba(255,255,255,0.88)',
              border: '1px solid rgba(16,185,129,0.20)',
              boxShadow: '0 4px 24px rgba(16,185,129,0.10)',
            }}
          >
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.08))' }}
            >
              <CheckCircle size={30} style={{ color: '#10b981' }} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: '#1e1b4b' }}>
                {submitted ? 'Attendance marked!' : 'Already submitted'}
              </h3>
              <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>
                {item.session.title} · {item.checkpoint.label}
              </p>
            </div>
            <button onClick={() => navigate('/student/history')} className="btn-secondary">
              View attendance history
            </button>
          </div>
        )}

        {/* Submit card */}
        {!fetching && !notFound && !submitted && !alreadyDone && item && (
          <div
            className="rounded-3xl p-6 animate-fadeIn"
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(124,58,237,0.15)',
              boxShadow: '0 4px 24px rgba(124,58,237,0.10)',
            }}
          >
            {/* Session info */}
            <div className="flex items-start justify-between gap-2 mb-5">
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
                style={{ background: urgent ? 'rgba(239,68,68,0.10)' : 'rgba(124,58,237,0.08)' }}
              >
                <Clock size={15} style={{ color: urgent ? '#ef4444' : '#7c3aed' }} />
              </div>
              <span
                className="text-sm font-bold tabular-nums flex-1"
                style={{ color: urgent ? '#ef4444' : '#7c3aed' }}
              >
                {String(Math.floor(secsLeft / 60)).padStart(2, '0')}:{String(secsLeft % 60).padStart(2, '0')} remaining
              </span>
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

            {/* Code display */}
            <div
              className="rounded-2xl px-5 py-4 text-center mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.04))',
                border: '1px solid rgba(124,58,237,0.12)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#a78bfa' }}>Code</p>
              <p
                className="code-display text-3xl font-black tracking-[0.25em]"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {item.checkpoint.code}
              </p>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !profile || !profile.campus || !profile.section}
              className="btn-primary w-full justify-center py-3"
            >
              {submitting ? (
                <><LoadingSpinner size="sm" />Submitting…</>
              ) : (
                <><Send size={15} />Submit attendance</>
              )}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
