import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import {
  ArrowLeft, Save, User, BookOpen, Globe, Briefcase,
  GraduationCap, Heart, CalendarCheck, Edit2, X, Check,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { StudentProfile, AttendanceRecord } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile,   setProfile]   = useState<StudentProfile | null>(null);
  const [records,   setRecords]   = useState<AttendanceRecord[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState(false);
  const [form,      setForm]      = useState<Partial<StudentProfile>>({});
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const [profSnap, recSnap] = await Promise.all([
        getDoc(doc(db, 'students', id)),
        getDocs(query(
          collection(db, 'attendanceRecords'),
          where('studentUid', '==', id),
          orderBy('submittedAt', 'desc'),
        )),
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

  const set = (key: keyof StudentProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;
  if (!profile) return <Layout><p className="text-slate-500 p-6">Student not found.</p></Layout>;

  const initials = (profile.fullName || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

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
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
          <Check size={16} /> Profile updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: avatar card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
              {initials}
            </div>
            <h2 className="font-bold text-slate-800 text-lg">{profile.fullName}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{profile.email}</p>
            <p className="text-xs text-slate-400 mt-1">{profile.studentId}</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="badge bg-brand-100 text-brand-700">{profile.course || 'No course'}</span>
            </div>
          </div>

          {/* Attendance summary */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
              <CalendarCheck size={15} className="text-brand-600" />
              Attendance Records
            </h3>
            {records.length === 0 ? (
              <p className="text-xs text-slate-400">No records yet</p>
            ) : (
              <div className="space-y-2">
                {records.map(r => (
                  <div key={r.id} className="flex items-start justify-between gap-2 text-xs">
                    <div>
                      <p className="font-medium text-slate-700 truncate max-w-[140px]">{r.sessionTitle}</p>
                      <p className="text-slate-400">{r.checkpointLabel}</p>
                    </div>
                    <p className="text-slate-400 flex-shrink-0">{formatDateTime(r.submittedAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: detail cards */}
        <div className="lg:col-span-2 space-y-4">
          <DetailCard icon={<User size={15} />} title="Personal details">
            <Row label="Full name">
              {editing
                ? <input className="input-field" value={form.fullName || ''} onChange={set('fullName')} />
                : profile.fullName}
            </Row>
            <Row label="Student ID">
              {editing
                ? <input className="input-field" value={form.studentId || ''} onChange={set('studentId')} />
                : profile.studentId}
            </Row>
            <Row label="Email">
              {editing
                ? <input className="input-field" type="email" value={form.email || ''} onChange={set('email')} />
                : profile.email}
            </Row>
            <Row label="Home country">
              {editing
                ? <input className="input-field" value={form.homeCountry || ''} onChange={set('homeCountry')} />
                : <span className="flex items-center gap-1.5"><Globe size={13} className="text-sky-500" />{profile.homeCountry}</span>}
            </Row>
          </DetailCard>

          <DetailCard icon={<BookOpen size={15} />} title="Course">
            <Row label="Enrolled course">
              {editing
                ? <input className="input-field" value={form.course || ''} onChange={set('course')} />
                : profile.course}
            </Row>
          </DetailCard>

          <DetailCard icon={<GraduationCap size={15} />} title="Educational background">
            <Row label="Previous qualification">
              {editing
                ? <input className="input-field" value={form.educationalBackground || ''} onChange={set('educationalBackground')} />
                : profile.educationalBackground}
            </Row>
          </DetailCard>

          <DetailCard icon={<Briefcase size={15} />} title="Work experience">
            <Row label="Experience level">
              {editing
                ? <input className="input-field" value={form.workExperience || ''} onChange={set('workExperience')} />
                : profile.workExperience}
            </Row>
          </DetailCard>

          {(profile.specialNeeds || editing) && (
            <DetailCard icon={<Heart size={15} />} title="Special needs / Accommodations">
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

function DetailCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4 text-brand-600">
        {icon}
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      </div>
      <div className="divide-y divide-slate-50 space-y-0">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2.5">
      <span className="text-xs font-medium text-slate-400 sm:w-36 flex-shrink-0">{label}</span>
      <span className="text-sm text-slate-700 flex-1">{children || '—'}</span>
    </div>
  );
}
