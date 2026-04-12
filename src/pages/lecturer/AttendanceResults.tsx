import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc, getDoc, collection, query, where, getDocs, orderBy, Timestamp,
} from 'firebase/firestore';
import { ArrowLeft, Download, Users, CheckCircle2, Clock, Filter, CalendarCheck } from 'lucide-react';
import { db } from '../../lib/firebase';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { AttendanceSession, AttendanceRecord } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';
import { useFeatureTracking } from '../../lib/useFeatureTracking';

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
  useFeatureTracking('Lecturer Attendance Results');
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session,       setSession]       = useState<AttendanceSession | null>(null);
  const [records,       setRecords]       = useState<AttendanceRecord[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [filter,        setFilter]        = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [dayFilter,     setDayFilter]     = useState('');
  const [sortBy,        setSortBy]        = useState<'name' | 'studentId' | 'section' | 'completion'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
    const matchesCP      = !filter        || r.checkpointLabel === filter;
    const matchesSection = !sectionFilter || (r.studentSection || 'Unknown section') === sectionFilter;
    const matchesDay     = !dayFilter     || toDayKey(r.submittedAt) === dayFilter;
    return matchesCP && matchesSection && matchesDay;
  });

  const cpLabels = session ? [...new Set(session.checkpoints.map(cp => cp.label))] : [];
  const visibleCheckpointLabels = filter ? [filter] : cpLabels;
  const allCps   = cpLabels.length;
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
    const headers = ['Student Name', 'Student ID', 'Campus', 'Section', 'Completed Checkpoints', 'Missing Checkpoints'];
    const rows = studentSummaries.map(student => {
      const completed = visibleCheckpointLabels.filter(label => Boolean(student.recordsByCheckpoint[label]));
      const missing = visibleCheckpointLabels.filter(label => !student.recordsByCheckpoint[label]);
      return [
        student.studentName,
        student.studentDisplayId,
        student.studentCampus || '',
        student.studentSection || '',
        completed.join(' | '),
        missing.join(' | '),
      ].map(v => `"${(v || '').replace(/"/g, '""')}"`);
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `attendance-${session?.title ?? id}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;
  if (!session) return <Layout><p className="py-8" style={{ color: '#9ca3af' }}>Session not found.</p></Layout>;

  const uniqueStudents = new Set(records.map(r => r.studentUid)).size;
  const sectionOptions = [...new Set(records.map(r => r.studentSection || 'Unknown section'))].sort();
  const dayOptions     = [...new Set(records.map(r => toDayKey(r.submittedAt)))].sort();

  const studentSummaries = Object.values(
    filtered.reduce((acc, record) => {
      if (!acc[record.studentUid]) {
        acc[record.studentUid] = {
          studentUid:            record.studentUid,
          studentName:           record.studentName || '—',
          studentDisplayId:      record.studentDisplayId || '—',
          studentCampus:         record.studentCampus || '—',
          studentSection:        record.studentSection || '—',
          recordsByCheckpoint:   {} as Record<string, AttendanceRecord>,
          completionCount:       0,
        };
      }
      const existing = acc[record.studentUid].recordsByCheckpoint[record.checkpointLabel];
      if (!existing || record.submittedAt < existing.submittedAt) {
        acc[record.studentUid].recordsByCheckpoint[record.checkpointLabel] = record;
      }
      return acc;
    }, {} as Record<string, {
      studentUid: string;
      studentName: string;
      studentDisplayId: string;
      studentCampus: string;
      studentSection: string;
      recordsByCheckpoint: Record<string, AttendanceRecord>;
      completionCount: number;
    }>)
  ).map(student => ({
    ...student,
    completionCount: visibleCheckpointLabels.filter(label => Boolean(student.recordsByCheckpoint[label])).length,
  }));

  const sortedStudentSummaries = [...studentSummaries].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (sortBy === 'completion') return (a.completionCount - b.completionCount) * direction;
    if (sortBy === 'section') {
      const sectionCompare = a.studentSection.localeCompare(b.studentSection, undefined, { sensitivity: 'base' });
      if (sectionCompare !== 0) return sectionCompare * direction;
      return a.studentName.localeCompare(b.studentName, undefined, { sensitivity: 'base' }) * direction;
    }
    if (sortBy === 'studentId') return a.studentDisplayId.localeCompare(b.studentDisplayId, undefined, { sensitivity: 'base' }) * direction;
    return a.studentName.localeCompare(b.studentName, undefined, { sensitivity: 'base' }) * direction;
  });

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
        {[
          { label: 'Total submissions', value: records.length,    icon: <CheckCircle2 size={16} />, gradient: 'linear-gradient(135deg,#7c3aed,#a78bfa)', textColor: '#7c3aed' },
          { label: 'Unique students',   value: uniqueStudents,    icon: <Users size={16} />,        gradient: 'linear-gradient(135deg,#10b981,#2dd4bf)', textColor: '#059669' },
          { label: 'Checkpoints',       value: cpLabels.length,   icon: <Clock size={16} />,        gradient: 'linear-gradient(135deg,#f59e0b,#f97316)', textColor: '#d97706' },
          ...(stuByAll !== null ? [{ label: 'Full attendance', value: stuByAll, icon: <CheckCircle2 size={16} />, gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', textColor: '#4338ca' }] : []),
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-3xl p-5 animate-fadeIn"
            style={{
              background: 'rgba(255,255,255,0.90)',
              border: '1px solid rgba(139,92,246,0.10)',
              boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
            }}
          >
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg"
              style={{ background: s.gradient }}
            >
              {s.icon}
            </div>
            <p className="text-2xl font-black" style={{ color: s.textColor }}>{s.value}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#9ca3af' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Per-checkpoint summary */}
      {cpLabels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cpLabels.map(label => {
            const count = records.filter(r => r.checkpointLabel === label).length;
            const cp    = session.checkpoints.find(c => c.label === label);
            const isActive = filter === label;
            return (
              <div
                key={label}
                onClick={() => setFilter(f => f === label ? '' : label)}
                className="rounded-3xl p-5 cursor-pointer transition-all duration-200 animate-fadeIn"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.05))'
                    : 'rgba(255,255,255,0.90)',
                  border: `1px solid ${isActive ? 'rgba(124,58,237,0.25)' : 'rgba(139,92,246,0.10)'}`,
                  boxShadow: isActive
                    ? '0 8px 24px rgba(124,106,247,0.14)'
                    : '0 2px 12px rgba(124,106,247,0.05)',
                  transform: isActive ? 'translateY(-2px)' : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: 'rgba(124,58,237,0.10)',
                      color: '#7c3aed',
                    }}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="text-xs font-semibold" style={{ color: '#a78bfa' }}>Filtering ✓</span>
                  )}
                </div>
                <p className="text-3xl font-black" style={{ color: '#1e1b4b' }}>{count}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: '#9ca3af' }}>submissions</p>
                {cp && (
                  <p className="text-xs mt-2 font-medium" style={{ color: '#c4b5fd' }}>
                    Code:{' '}
                    <code
                      className="font-mono font-bold px-1.5 py-0.5 rounded-lg"
                      style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', letterSpacing: '0.1em' }}
                    >
                      {cp.code}
                    </code>
                    {' '}· {cp.windowMinutes}min
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Record table */}
      <div
        className="overflow-hidden rounded-3xl animate-fadeIn"
        style={{
          background: 'rgba(255,255,255,0.90)',
          border: '1px solid rgba(139,92,246,0.10)',
          boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
        }}
      >
        {/* Table toolbar */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}
        >
          <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>
            Submission log{filter && <span style={{ color: '#a78bfa', fontWeight: 500 }}> — {filter}</span>}
          </h3>
          {(filter || sectionFilter || dayFilter) && (
            <button
              onClick={() => { setFilter(''); setSectionFilter(''); setDayFilter(''); }}
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: '#a78bfa' }}
            >
              <Filter size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div
          className="px-5 py-3 flex gap-3 flex-wrap"
          style={{
            borderBottom: '1px solid rgba(139,92,246,0.06)',
            background: 'linear-gradient(135deg, rgba(245,243,255,0.5), transparent)',
          }}
        >
          <select
            className="input-field sm:w-44 py-2 text-xs"
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
          >
            <option value="">All sections</option>
            {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="input-field sm:w-44 py-2 text-xs"
            value={dayFilter}
            onChange={e => setDayFilter(e.target.value)}
          >
            <option value="">All days</option>
            {dayOptions.map(d => <option key={d} value={d}>{formatDisplayDay(d)}</option>)}
          </select>
          <select
            className="input-field sm:w-52 py-2 text-xs"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'name' | 'studentId' | 'section' | 'completion')}
          >
            <option value="name">Sort: Student name</option>
            <option value="studentId">Sort: Student ID</option>
            <option value="section">Sort: Section</option>
            <option value="completion">Sort: Completion status</option>
          </select>
          <select
            className="input-field sm:w-36 py-2 text-xs"
            value={sortDirection}
            onChange={e => setSortDirection(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {sortedStudentSummaries.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.06)' }}
            >
              <CalendarCheck size={20} style={{ color: '#c4b5fd' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#c4b5fd' }}>
              No records {filter ? 'for this checkpoint' : 'yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Header row */}
            <div
              className="flex items-center px-5 py-3"
              style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}
            >
              <span className="table-header-cell w-10">#</span>
              <span className="table-header-cell flex-1">Student</span>
              <span className="table-header-cell w-32 hidden sm:block">ID</span>
              <span className="table-header-cell w-28 hidden lg:block">Campus</span>
              <span className="table-header-cell w-24 hidden md:block">Section</span>
              <span className="table-header-cell w-72">Checkpoint progress</span>
            </div>

            {sortedStudentSummaries.map((student, i) => (
              <div
                key={student.studentUid}
                className="flex items-center px-5 py-3.5 transition-all duration-100"
                style={{
                  borderBottom: i < sortedStudentSummaries.length - 1 ? '1px solid rgba(139,92,246,0.04)' : 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(245,243,255,0.6)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <span className="text-xs font-mono w-10" style={{ color: '#c4b5fd' }}>{i + 1}</span>
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div
                    className="avatar w-8 h-8 text-xs flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, hsl(${(student.studentName?.charCodeAt(0) ?? 0) * 4 % 360}, 65%, 55%), hsl(${(student.studentName?.charCodeAt(0) ?? 0) * 4 % 360 + 30}, 70%, 65%))`,
                    }}
                  >
                    {(student.studentName || '?')[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold truncate" style={{ color: '#1e1b4b' }}>
                    {student.studentName || '—'}
                  </span>
                </div>
                <code className="text-xs w-32 hidden sm:block font-mono font-semibold" style={{ color: '#8b7fa6' }}>
                  {student.studentDisplayId}
                </code>
                <span className="text-xs w-28 hidden lg:block font-medium" style={{ color: '#6b7280' }}>
                  {student.studentCampus || '—'}
                </span>
                <span className="text-xs w-24 hidden md:block font-medium" style={{ color: '#6b7280' }}>
                  {student.studentSection || '—'}
                </span>
                <div className="w-72 flex gap-2 flex-wrap">
                  {visibleCheckpointLabels.map(label => {
                    const submittedRecord = student.recordsByCheckpoint[label];
                    const isDone = Boolean(submittedRecord);
                    return (
                      <span
                        key={`${student.studentUid}-${label}`}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold"
                        title={isDone ? `Completed at ${formatDateTime(submittedRecord.submittedAt)}` : 'Not completed'}
                        style={{
                          background: isDone ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)',
                          color: isDone ? '#059669' : '#dc2626',
                        }}
                      >
                        {label}: {isDone ? 'Completed' : 'Not yet'}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedStudentSummaries.length > 0 && (
          <div
            className="px-5 py-3 text-xs font-semibold"
            style={{
              borderTop: '1px solid rgba(139,92,246,0.06)',
              background: 'linear-gradient(135deg, rgba(245,243,255,0.5), transparent)',
              color: '#a78bfa',
            }}
          >
            {sortedStudentSummaries.length} student{sortedStudentSummaries.length !== 1 ? 's' : ''} shown
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
  return new Date(`${dayKey}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
