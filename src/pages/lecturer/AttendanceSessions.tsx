import { useEffect, useState, useCallback } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, doc,
  serverTimestamp, Timestamp, orderBy, query,
} from 'firebase/firestore';
import {
  Plus, StopCircle, Clock, CheckCircle2,
  CalendarCheck, ChevronRight, Zap, Eye, Radio, Copy, Check, QrCode,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import type { AttendanceSession, AttendanceCheckpoint } from '../../lib/types';
import { generateCode, formatDateTime, secondsUntil } from '../../lib/utils';
import { useFeatureTracking } from '../../lib/useFeatureTracking';

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
  const { user, role } = useAuth();
  useFeatureTracking('Lecturer Attendance Sessions');
  const isTa = role === 'teachingAssistant';
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
    if (isTa) return;
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
    const newCp   = {
      id: cpId, label, code, windowMinutes: windowMins,
      startTime: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expires),
      isActive:  true,
    };
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
        subtitle={isTa ? 'View live and past attendance sessions' : 'Create and manage live attendance checkpoints'}
        actions={!isTa ? (
          <button onClick={() => setModal(true)} className="btn-primary">
            <Plus size={16} /> New session
          </button>
        ) : undefined}
      />

      {/* Active sessions */}
      {active.length > 0 && (
        <div className="mb-8 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Radio size={14} style={{ color: '#10b981' }} />
            <span className="section-label !mb-0">Live sessions</span>
          </div>
          {active.map(s => (
            <ActiveSessionCard
              key={s.id}
              session={s}
              ticking={ticking}
              onLaunch={launchCheckpoint}
              onClose={closeSession}
              onView={() => navigate(`/lecturer/attendance/${s.id}`)}
              canManage={!isTa}
            />
          ))}
        </div>
      )}

      {/* Closed sessions */}
      {closed.length > 0 && (
        <div className="space-y-3 animate-fadeIn">
          <span className="section-label">Past sessions</span>
          {closed.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => navigate(`/lecturer/attendance/${s.id}`)}
              className="flex items-center gap-4 px-5 py-4 rounded-3xl cursor-pointer group transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(139,92,246,0.08)',
                boxShadow: '0 2px 12px rgba(124,106,247,0.05)',
                animationDelay: `${idx * 0.03}s`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(124,106,247,0.12)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(124,106,247,0.05)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                className="rounded-2xl p-2.5 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.05))' }}
              >
                <CalendarCheck size={18} style={{ color: '#a78bfa' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: '#1e1b4b' }}>{s.title}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: '#9ca3af' }}>
                  {s.course} · {formatDateTime(s.date)}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className="badge-slate text-xs"
                  style={{
                    background: 'rgba(139,92,246,0.08)',
                    color: '#8b7fa6',
                    padding: '3px 10px',
                    borderRadius: '99px',
                    fontWeight: 600,
                  }}
                >
                  {s.checkpoints.length} checkpoint{s.checkpoints.length !== 1 ? 's' : ''}
                </span>
                <ChevronRight
                  size={15}
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                  style={{ color: '#c4b5fd' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {sessions.length === 0 && (
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
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(167,139,250,0.06))' }}
          >
            <CalendarCheck size={28} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h3 className="font-bold text-base mb-1" style={{ color: '#1e1b4b' }}>No sessions yet</h3>
            <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>
              Create a session when your class begins to start tracking attendance.
            </p>
          </div>
          {!isTa && (
            <button onClick={() => setModal(true)} className="btn-primary">
              <Plus size={16} /> Create first session
            </button>
          )}
        </div>
      )}

      {/* Create session modal */}
      {!isTa && <Modal open={modal} onClose={() => setModal(false)} title="New attendance session">
        <div className="space-y-4">
          <div>
            <label className="label">Session title <span style={{ color: '#e11d48' }}>*</span></label>
            <input
              className="input-field"
              placeholder="e.g. Week 3 — Machine Learning"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Course <span style={{ color: '#e11d48' }}>*</span></label>
            <input
              className="input-field"
              placeholder="e.g. MSc Data Science"
              value={form.course}
              onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
            />
          </div>
          <div
            className="rounded-2xl px-4 py-3 text-xs font-medium"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.04))',
              color: '#8b7fa6',
              border: '1px solid rgba(139,92,246,0.10)',
            }}
          >
            After creating the session you can launch checkpoints with custom time windows.
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
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
      </Modal>}
    </Layout>
  );
}

function ActiveSessionCard({
  session, ticking, onLaunch, onClose, onView, canManage,
}: {
  session:  AttendanceSession;
  ticking:  Record<string, number>;
  onLaunch: (s: AttendanceSession, label: string, window: number) => Promise<void>;
  onClose:  (s: AttendanceSession) => Promise<void>;
  onView:   () => void;
  canManage: boolean;
}) {
  const [launching, setLaunching] = useState(false);
  const [closing,   setClosing]   = useState(false);
  const [winMins,   setWinMins]   = useState(4);
  const [copied,    setCopied]    = useState(false);
  const [showQr,    setShowQr]    = useState(false);

  const activeCP  = session.checkpoints.find(cp => cp.isActive && cp.expiresAt > new Date());
  const cpCount   = session.checkpoints.length;
  const nextLabel = cpCount === 0 ? 'Opening' : cpCount === 1 ? 'Mid-session' : `Checkpoint ${cpCount + 1}`;

  const doLaunch = async () => {
    setLaunching(true);
    await onLaunch(session, nextLabel, winMins);
    setLaunching(false);
  };

  const doClose = async () => {
    if (!confirm(`Close "${session.title}"? Students will no longer be able to submit.`)) return;
    setClosing(true);
    await onClose(session);
    setClosing(false);
  };

  const secsLeft  = activeCP ? (ticking[`${session.id}-${activeCP.id}`] ?? secondsUntil(activeCP.expiresAt)) : 0;
  const pct       = activeCP ? Math.round((secsLeft / (activeCP.windowMinutes * 60)) * 100) : 0;
  const attendUrl = activeCP
    ? `${window.location.href.split('#')[0]}#/attend/${activeCP.code}`
    : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(attendUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select a temp input
      const el = document.createElement('input');
      el.value = attendUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="rounded-3xl p-6 animate-fadeIn"
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(124,58,237,0.15)',
        boxShadow: '0 4px 24px rgba(124,58,237,0.10)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 6px 16px rgba(124,58,237,0.30)' }}
        >
          <CalendarCheck size={19} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base" style={{ color: '#1e1b4b' }}>{session.title}</h3>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: 'rgba(16,185,129,0.10)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.20)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live
            </span>
          </div>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#9ca3af' }}>{session.course}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onView} className="btn-secondary py-2 px-4 text-xs">
            <Eye size={13} /> Results
          </button>
          {canManage && (
            <button onClick={doClose} disabled={closing} className="btn-danger py-2 px-4 text-xs">
              {closing ? <LoadingSpinner size="sm" /> : <StopCircle size={13} />}
              Close
            </button>
          )}
        </div>
      </div>

      {/* Active code display */}
      {activeCP && secsLeft > 0 ? (
        <div
          className="rounded-3xl p-6 mb-5 text-center pulse-ring"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(167,139,250,0.04) 100%)',
            border: '1px solid rgba(124,58,237,0.15)',
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a78bfa', letterSpacing: '0.1em' }}>
            {activeCP.label} · Active Code
          </p>
          <p
            className="code-display text-5xl font-black mb-4 tracking-[0.3em]"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {activeCP.code}
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold mb-3"
            style={{
              background: 'rgba(124,58,237,0.08)',
              color: '#7c3aed',
            }}
          >
            <Clock size={14} />
            <span className="tabular-nums">
              {String(Math.floor(secsLeft / 60)).padStart(2, '0')}:{String(secsLeft % 60).padStart(2, '0')} remaining
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 rounded-full mx-auto max-w-xs overflow-hidden"
            style={{ background: 'rgba(124,58,237,0.10)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${pct}%`,
                background: pct < 20
                  ? 'linear-gradient(90deg, #ef4444, #f97316)'
                  : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
              }}
            />
          </div>

          {/* QR code + Share */}
          <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(124,58,237,0.10)' }}>
            <div className="flex items-start justify-between gap-4">
              {/* QR toggle */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold mb-2" style={{ color: '#8b7fa6' }}>
                  Share with students
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowQr(v => !v)}
                    className="btn-secondary py-1.5 px-3 text-xs gap-1.5"
                  >
                    <QrCode size={13} />
                    {showQr ? 'Hide QR' : 'Show QR'}
                  </button>
                  <button
                    onClick={copyLink}
                    className="btn-secondary py-1.5 px-3 text-xs gap-1.5"
                    style={copied ? { color: '#059669', borderColor: 'rgba(16,185,129,0.30)' } : {}}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: '#9ca3af' }}>
                  Students scan or tap the link — they'll land directly on the attendance form,
                  even before they're logged in.
                </p>
              </div>

              {/* QR code panel */}
              {showQr && (
                <div
                  className="flex-shrink-0 p-3 rounded-2xl"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(124,58,237,0.15)',
                    boxShadow: '0 4px 16px rgba(124,58,237,0.10)',
                  }}
                >
                  <QRCodeSVG
                    value={attendUrl}
                    size={140}
                    fgColor="#3b0764"
                    bgColor="#ffffff"
                    level="M"
                  />
                  <p className="text-center text-xs font-semibold mt-2" style={{ color: '#a78bfa' }}>
                    Scan to attend
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="rounded-3xl p-5 mb-5 text-center"
          style={{
            background: 'rgba(245,243,255,0.6)',
            border: '1px solid rgba(139,92,246,0.08)',
          }}
        >
          <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>
            {cpCount === 0 ? 'No checkpoints launched yet.' : 'Last checkpoint has expired.'}
            {canManage ? ' Launch a new one below.' : ''}
          </p>
        </div>
      )}

      {/* Checkpoint history */}
      {session.checkpoints.length > 0 && (
        <div className="mb-4 space-y-2">
          {session.checkpoints.map(cp => {
            const expired = cp.expiresAt <= new Date();
            return (
              <div
                key={cp.id}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl"
                style={{
                  background: expired ? 'rgba(245,243,255,0.5)' : 'rgba(124,58,237,0.05)',
                  border: `1px solid ${expired ? 'rgba(139,92,246,0.06)' : 'rgba(124,58,237,0.12)'}`,
                }}
              >
                <span className="text-xs font-semibold" style={{ color: expired ? '#9ca3af' : '#7c3aed' }}>
                  {cp.label}
                </span>
                <div className="flex items-center gap-2">
                  <code
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg"
                    style={{
                      background: expired ? 'rgba(139,92,246,0.06)' : 'rgba(124,58,237,0.10)',
                      color: expired ? '#9ca3af' : '#7c3aed',
                      letterSpacing: '0.12em',
                    }}
                  >
                    {cp.code}
                  </code>
                  {expired ? (
                    <span className="badge-slate flex items-center gap-1">
                      <CheckCircle2 size={10} /> Expired
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Launch next checkpoint */}
      {canManage && (
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold" style={{ color: '#8b7fa6' }}>Window:</label>
            <select
              value={winMins}
              onChange={e => setWinMins(Number(e.target.value))}
              className="text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(139,92,246,0.18)',
                color: '#7c3aed',
                boxShadow: '0 1px 4px rgba(124,106,247,0.06)',
              }}
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
      )}
    </div>
  );
}
