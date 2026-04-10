import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import {
  ArrowLeft, Save, User, BookOpen, Globe, Briefcase,
  GraduationCap, Heart, CalendarCheck, Edit2, X, Check, CircleOff, ShieldCheck,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { StudentProfile, AttendanceRecord, AbsenceNotice, AttendanceSession } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';
import { summarizeStudentAttendance } from '../../lib/attendanceSummary';

type RawSession = Omit<AttendanceSession, 'date' | 'createdAt'> & { date: Timestamp; createdAt: Timestamp };

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile,   setProfile]   = useState<StudentProfile | null>(null);
  const [records,   setRecords]   = useState<AttendanceRecord[]>([]);
  const [absences,  setAbsences]  = useState<AbsenceNotice[]>([]);
  const [sessions,  setSessions]  = useState<AttendanceSession[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState(false);
  const [form,      setForm]      = useState<Partial<StudentProfile>>({});
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const [profSnap, recSnap, absenceSnap, sessionsSnap] = await Promise.all([
        getDoc(doc(db, 'students', id)),
        getDocs(query(
          collection(db, 'attendanceRecords'),
          where('studentUid', '==', id),
          orderBy('submittedAt', 'desc'),
        )),
        getDocs(query(
          collection(db, 'absenceNotices'),
          where('studentUid', '==', id),
          orderBy('createdAt', 'desc'),
        )),
        getDocs(collection(db, 'attendanceSessions')),
      ]);
      if (profSnap.exists()) {
        const p = profSnap.data() as StudentProfile;
        setProfile(p);
        setForm(p);
      }
      setRecords(recSnap.docs.map(d => {
        const r = d.data();
        return { ...r, id: d.id, submittedAt: (r.submittedAt as Timestamp)?.toDate?.() ?? new Date() } as AttendanceRecord;
      }));
      setAbsences(absenceSnap.docs.map(d => {
        const a = d.data() as Record<string, unknown>;
        return {
          ...a,
          id: d.id,
          status: ((a.status as 'absent' | 'excused') || 'absent'),
          reason: (a.reason as string) || '',
          reportDateKey: (a.reportDateKey as string) || '',
          createdAt: (a.createdAt as Timestamp)?.toDate?.() ?? new Date(),
        } as AbsenceNotice;
      }));
      const studentCourse = profSnap.data()?.course;
      setSessions(
        sessionsSnap.docs
          .map(d => {
            const s = d.data() as RawSession;
            return {
              ...s,
              id: d.id,
              date: s.date?.toDate?.() ?? new Date(),
              createdAt: s.createdAt?.toDate?.() ?? new Date(),
            } as AttendanceSession;
          })
          .filter(s => !studentCourse || s.course === studentCourse)
      );
      setLoading(false);
    })();
  }, [id]);

  const handleSave = async () => {
    if (!id || !profile) return;
    setSaving(true);
    await setDoc(doc(db, 'students', id), { ...form, updatedAt: serverTimestamp() }, { merge: true });
    setProfile(p => p ? { ...p, ...form } as StudentProfile : p);
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (key: keyof StudentProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;
  if (!profile) return <Layout><p className="py-8 font-medium" style={{ color: '#9ca3af' }}>Student not found.</p></Layout>;

  const initials = (profile.fullName || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const summary = summarizeStudentAttendance({ sessions, records, absences });

  return (
    <Layout>
      <PageHeader
        title={profile.fullName || 'Student Profile'}
        subtitle={profile.studentId}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="btn-secondary">
              <ArrowLeft size={15} /> Back
            </button>
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); setForm(profile); }} className="btn-secondary">
                  <X size={15} /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  {saving ? <LoadingSpinner size="sm" /> : <Save size={15} />}
                  Save changes
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-primary">
                <Edit2 size={15} /> Edit
              </button>
            )}
          </div>
        }
      />

      {saved && (
        <div
          className="mb-5 px-5 py-3.5 rounded-2xl flex items-center gap-2 animate-fadeIn text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(45,212,191,0.05))',
            border: '1px solid rgba(16,185,129,0.18)',
            color: '#059669',
          }}
        >
          <Check size={16} /> Profile updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: avatar + attendance */}
        <div className="lg:col-span-1 space-y-5">
          {/* Avatar card */}
          <div
            className="rounded-3xl p-6 text-center animate-fadeIn"
            style={{
              background: 'rgba(255,255,255,0.90)',
              border: '1px solid rgba(139,92,246,0.10)',
              boxShadow: '0 4px 20px rgba(124,106,247,0.08)',
            }}
          >
            {/* Top gradient banner */}
            <div
              className="h-16 -mx-6 -mt-6 mb-0 rounded-t-3xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #c4b5fd 100%)' }}
            />
            <div className="-mt-10 mb-4">
              <div
                className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-2xl font-black text-white shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: '3px solid white' }}
              >
                {initials}
              </div>
            </div>
            <h2 className="font-bold text-lg" style={{ color: '#1e1b4b' }}>{profile.fullName}</h2>
            <p className="text-sm font-medium mt-0.5" style={{ color: '#9ca3af' }}>{profile.email}</p>
            <p className="text-xs mt-0.5 font-mono font-semibold" style={{ color: '#c4b5fd' }}>{profile.studentId}</p>

            {profile.course && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}
                >
                  <BookOpen size={11} />
                  {profile.course}
                </span>
              </div>
            )}

            {/* Info pills */}
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {profile.campus && (
                <span className="badge-purple text-[10px]">{profile.campus}</span>
              )}
              {profile.section && (
                <span className="badge-slate text-[10px]">{profile.section}</span>
              )}
              {profile.homeCountry && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: 'rgba(14,165,233,0.10)', color: '#0284c7' }}
                >
                  <Globe size={9} />
                  {profile.homeCountry}
                </span>
              )}
            </div>
          </div>

          {/* Attendance records */}
          <div
            className="rounded-3xl p-5 animate-fadeIn"
            style={{
              background: 'rgba(255,255,255,0.90)',
              border: '1px solid rgba(139,92,246,0.10)',
              boxShadow: '0 2px 12px rgba(124,106,247,0.06)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(167,139,250,0.06))' }}
              >
                <CalendarCheck size={15} style={{ color: '#7c3aed' }} />
              </div>
              <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Attendance</h3>
              <span
                className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}
              >
                {records.length}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <MiniStat label="Attend" value={summary.attendedDays} color="#059669" bg="rgba(16,185,129,0.10)" icon={<CalendarCheck size={11} />} />
              <MiniStat label="Absent (U)" value={summary.absentUnjustifiedDays} color="#dc2626" bg="rgba(239,68,68,0.10)" icon={<CircleOff size={11} />} />
              <MiniStat label="Absent (J)" value={summary.absentJustifiedDays} color="#2563eb" bg="rgba(37,99,235,0.10)" icon={<ShieldCheck size={11} />} />
            </div>

            {records.length === 0 ? (
              <p className="text-xs font-medium" style={{ color: '#c4b5fd' }}>No records yet</p>
            ) : (
              <div className="space-y-2">
                {records.map(r => (
                  <div
                    key={r.id}
                    className="flex items-start justify-between gap-2 px-3 py-2.5 rounded-2xl"
                    style={{ background: 'rgba(245,243,255,0.6)' }}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: '#4c1d95', maxWidth: 130 }}>
                        {r.sessionTitle}
                      </p>
                      <p className="text-[10px] font-medium" style={{ color: '#a78bfa' }}>{r.checkpointLabel}</p>
                    </div>
                    <p className="text-[10px] font-medium flex-shrink-0" style={{ color: '#c4b5fd' }}>
                      {formatDateTime(r.submittedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {absences.length > 0 && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}>
                <p className="text-[11px] font-bold mb-2" style={{ color: '#a78bfa' }}>Latest absence notices</p>
                <div className="space-y-1.5">
                  {absences.slice(0, 3).map(a => (
                    <div key={a.id} className="px-3 py-2 rounded-xl" style={{ background: 'rgba(245,243,255,0.65)' }}>
                      <p className="text-[10px] font-bold uppercase" style={{ color: a.status === 'excused' ? '#2563eb' : '#dc2626' }}>
                        {a.status} · {a.reportDateKey}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#6b7280' }}>{a.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: detail sections */}
        <div className="lg:col-span-2 space-y-5">
          <DetailCard icon={<User size={14} />} title="Personal details" gradient="linear-gradient(135deg,#7c3aed,#a78bfa)">
            <Row label="Full name">
              {editing
                ? <input className="input-field" value={form.fullName || ''} onChange={set('fullName')} />
                : profile.fullName}
            </Row>
            <Row label="Student ID">
              {editing
                ? <input className="input-field" value={form.studentId || ''} onChange={set('studentId')} />
                : <code className="font-mono font-semibold" style={{ color: '#7c3aed' }}>{profile.studentId}</code>}
            </Row>
            <Row label="Email">
              {editing
                ? <input className="input-field" type="email" value={form.email || ''} onChange={set('email')} />
                : profile.email}
            </Row>
            <Row label="Home country">
              {editing
                ? <input className="input-field" value={form.homeCountry || ''} onChange={set('homeCountry')} />
                : <span className="flex items-center gap-1.5"><Globe size={13} style={{ color: '#60a5fa' }} />{profile.homeCountry}</span>}
            </Row>
          </DetailCard>

          <DetailCard icon={<BookOpen size={14} />} title="Course" gradient="linear-gradient(135deg,#6366f1,#8b5cf6)">
            <Row label="Enrolled course">
              {editing
                ? <input className="input-field" value={form.course || ''} onChange={set('course')} />
                : profile.course}
            </Row>
            <Row label="Campus">
              {editing
                ? <input className="input-field" value={form.campus || ''} onChange={set('campus')} />
                : profile.campus}
            </Row>
            <Row label="Section">
              {editing
                ? <input className="input-field" value={form.section || ''} onChange={set('section')} />
                : profile.section}
            </Row>
          </DetailCard>

          <DetailCard icon={<GraduationCap size={14} />} title="Education" gradient="linear-gradient(135deg,#0ea5e9,#60a5fa)">
            <Row label="Previous qualification">
              {editing
                ? <input className="input-field" value={form.educationalBackground || ''} onChange={set('educationalBackground')} />
                : profile.educationalBackground}
            </Row>
          </DetailCard>

          <DetailCard icon={<Briefcase size={14} />} title="Work experience" gradient="linear-gradient(135deg,#10b981,#2dd4bf)">
            <Row label="Experience level">
              {editing
                ? <input className="input-field" value={form.workExperience || ''} onChange={set('workExperience')} />
                : profile.workExperience}
            </Row>
            {profile.workIndustry && (
              <Row label="Industry">
                {editing
                  ? <input className="input-field" value={form.workIndustry || ''} onChange={set('workIndustry')} />
                  : profile.workIndustry}
              </Row>
            )}
          </DetailCard>

          {(profile.specialNeeds || editing) && (
            <DetailCard icon={<Heart size={14} />} title="Special needs" gradient="linear-gradient(135deg,#f43f5e,#e879a0)">
              <Row label="Declaration">
                {editing
                  ? <input className="input-field" value={form.specialNeeds || ''} onChange={set('specialNeeds')} />
                  : profile.specialNeeds || 'None declared'}
              </Row>
            </DetailCard>
          )}
        </div>
      </div>
    </Layout>
  );
}

function DetailCard({ icon, title, gradient, children }: {
  icon: React.ReactNode;
  title: string;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-3xl overflow-hidden animate-fadeIn"
      style={{
        background: 'rgba(255,255,255,0.90)',
        border: '1px solid rgba(139,92,246,0.10)',
        boxShadow: '0 2px 12px rgba(124,106,247,0.06)',
      }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.07)' }}
      >
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-md"
          style={{ background: gradient }}
        >
          {icon}
        </div>
        <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>{title}</h3>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}

function MiniStat({ label, value, color, bg, icon }: {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl px-2 py-2 text-center" style={{ background: bg }}>
      <div className="flex items-center justify-center mb-1" style={{ color }}>
        {icon}
      </div>
      <p className="text-sm font-black leading-none" style={{ color }}>{value}</p>
      <p className="text-[10px] font-semibold mt-1" style={{ color: '#9ca3af' }}>{label}</p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3"
      style={{ borderBottom: '1px solid rgba(139,92,246,0.04)' }}
    >
      <span
        className="text-xs font-semibold sm:w-36 flex-shrink-0 uppercase tracking-wide"
        style={{ color: '#c4b5fd', letterSpacing: '0.05em' }}
      >
        {label}
      </span>
      <span className="text-sm font-medium flex-1" style={{ color: '#4c1d95' }}>
        {children || <span style={{ color: '#d1d5db' }}>—</span>}
      </span>
    </div>
  );
}
