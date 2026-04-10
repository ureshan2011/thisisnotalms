import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc, getDoc, collection, query, where, getDocs, orderBy, Timestamp,
} from 'firebase/firestore';
import { ArrowLeft, Download, Users, CheckCircle2, Clock, Filter } from 'lucide-react';
import { db } from '../../lib/firebase';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { AttendanceSession, AttendanceRecord } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';

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

export default function AttendanceResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session,  setSession]  = useState<AttendanceSession | null>(null);
  const [records,  setRecords]  = useState<AttendanceRecord[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState(''); // checkpoint label filter
  const [sectionFilter, setSectionFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const [sesSnap, recSnap] = await Promise.all([
        getDoc(doc(db, 'attendanceSessions', id)),
        getDocs(query(
          collection(db, 'attendanceRecords'),
          where('sessionId', '==', id),
          orderBy('submittedAt', 'asc'),
        )),
      ]);
      if (sesSnap.exists()) {
        setSession(firestoreToSession(sesSnap.id, sesSnap.data() as Record<string, unknown>));
      }
      setRecords(recSnap.docs.map(d => {
        const r = d.data();
        return { ...r, id: d.id, submittedAt: (r.submittedAt as Timestamp)?.toDate?.() ?? new Date() } as AttendanceRecord;
      }));
      setLoading(false);
    })();
  }, [id]);

  const filtered = records.filter(r => {
    const matchesCheckpoint = !filter || r.checkpointLabel === filter;
    const section = r.studentSection || 'Unknown section';
    const day = toDayKey(r.submittedAt);
    const matchesSection = !sectionFilter || section === sectionFilter;
    const matchesDay = !dayFilter || day === dayFilter;
    return matchesCheckpoint && matchesSection && matchesDay;
  });

  // Unique students per checkpoint
  const cpLabels = session ? [...new Set(session.checkpoints.map(cp => cp.label))] : [];

  // Students who attended ALL checkpoints
  const allCps = cpLabels.length;
  const stuByAll = allCps > 1
    ? Object.entries(
        records.reduce((acc, r) => {
          acc[r.studentUid] = acc[r.studentUid] || new Set();
          acc[r.studentUid].add(r.checkpointLabel);
          return acc;
        }, {} as Record<string, Set<string>>)
      ).filter(([, cps]) => cps.size === allCps).length
    : null;

  const exportCSV = () => {
    const headers = ['Student Name','Student ID','Campus','Section','Checkpoint','Submitted At'];
    const rows = filtered.map(r => [
      r.studentName,
      r.studentDisplayId,
      r.studentCampus || '',
      r.studentSection || '',
      r.checkpointLabel,
      formatDateTime(r.submittedAt),
    ].map(v => `"${(v || '').replace(/"/g, '""')}"`));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `attendance-${session?.title ?? id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;
  if (!session) return <Layout><p className="text-slate-500 p-6">Session not found.</p></Layout>;

  const uniqueStudents = new Set(records.map(r => r.studentUid)).size;
  const sectionOptions = [...new Set(records.map(r => r.studentSection || 'Unknown section'))].sort();
  const dayOptions = [...new Set(records.map(r => toDayKey(r.submittedAt)))].sort();

  return (
    <Layout>
      <PageHeader
        title={session.title}
        subtitle={`${session.course} · ${formatDateTime(session.date)}`}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="btn-secondary">
              <ArrowLeft size={15} /> Back
            </button>
            <button onClick={exportCSV} className="btn-secondary">
              <Download size={15} /> Export CSV
            </button>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Total submissions" value={records.length} icon={<CheckCircle2 size={16} />} color="indigo" />
        <SummaryCard label="Unique students"   value={uniqueStudents}  icon={<Users size={16} />}        color="emerald" />
        <SummaryCard label="Checkpoints"       value={cpLabels.length} icon={<Clock size={16} />}        color="violet" />
        {stuByAll !== null && (
          <SummaryCard label="Full attendance" value={stuByAll} icon={<CheckCircle2 size={16} />} color="amber" />
        )}
      </div>

      {/* Per-checkpoint summary */}
      {cpLabels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cpLabels.map(label => {
            const count = records.filter(r => r.checkpointLabel === label).length;
            const cp    = session.checkpoints.find(c => c.label === label);
            return (
              <div
                key={label}
                onClick={() => setFilter(f => f === label ? '' : label)}
                className={`card p-4 cursor-pointer transition-all ${filter === label ? 'ring-2 ring-brand-500 border-brand-100' : 'hover:shadow-md'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="badge bg-brand-100 text-brand-700">{label}</span>
                  {filter === label && <span className="text-xs text-brand-600 font-medium">Filtering</span>}
                </div>
                <p className="text-2xl font-bold text-slate-800">{count}</p>
                <p className="text-xs text-slate-400">submissions</p>
                {cp && (
                  <p className="text-xs text-slate-400 mt-1">
                    Code: <code className="font-mono font-bold text-slate-600">{cp.code}</code>
                    {' '}· {cp.windowMinutes}min window
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Record table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-700 text-sm">
            Submission log
            {filter && <span className="ml-2 text-brand-600">— {filter}</span>}
          </h3>
          {(filter || sectionFilter || dayFilter) && (
            <button
              onClick={() => { setFilter(''); setSectionFilter(''); setDayFilter(''); }}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              <Filter size={12} /> Clear filters
            </button>
          )}
        </div>
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select className="input-field !py-2" value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}>
              <option value="">All sections</option>
              {sectionOptions.map(section => <option key={section} value={section}>{section}</option>)}
            </select>
            <select className="input-field !py-2" value={dayFilter} onChange={e => setDayFilter(e.target.value)}>
              <option value="">All days</option>
              {dayOptions.map(day => <option key={day} value={day}>{formatDisplayDay(day)}</option>)}
            </select>
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-10">No records {filter ? 'for this checkpoint' : 'yet'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Campus</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Section</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Checkpoint</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Submitted at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {(r.studentName || '?')[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{r.studentName || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <code className="text-xs text-slate-500 font-mono">{r.studentDisplayId}</code>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-slate-600">{r.studentCampus || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-slate-600">{r.studentSection || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-brand-100 text-brand-700">{r.checkpointLabel}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-500">{formatDateTime(r.submittedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDisplayDay(dayKey: string) {
  const date = new Date(`${dayKey}T00:00:00`);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function SummaryCard({ label, value, icon, color }: {
  label: string; value: number; icon: React.ReactNode;
  color: 'indigo' | 'emerald' | 'violet' | 'amber';
}) {
  const cls = {
    indigo:  'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet:  'bg-violet-50 text-violet-600',
    amber:   'bg-amber-50 text-amber-600',
  }[color];
  return (
    <div className={`card p-4 ${cls}`}>
      <div className="flex items-center gap-2 mb-1 opacity-70">{icon}<span className="text-xs font-medium">{label}</span></div>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}
