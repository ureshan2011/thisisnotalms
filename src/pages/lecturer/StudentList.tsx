import { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Globe, Briefcase, BookOpen, ChevronRight, Heart, Users, Trash2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { StudentProfile, AttendanceRecord, AbsenceNotice, AttendanceSession } from '../../lib/types';
import { summarizeStudentAttendance } from '../../lib/attendanceSummary';
import { useToast } from '../../components/ui/ToastProvider';

export default function StudentList() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<Record<string, { attended: number; absent: number; excused: number }>>({});
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [course,   setCourse]   = useState('');
  const [country,  setCountry]  = useState('');
  const [deletingStudentUid, setDeletingStudentUid] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      const [studentSnap, attendanceSnap, absenceSnap, sessionsSnap] = await Promise.all([
        getDocs(collection(db, 'students')),
        getDocs(collection(db, 'attendanceRecords')),
        getDocs(collection(db, 'absenceNotices')),
        getDocs(collection(db, 'attendanceSessions')),
      ]);
      const loadedStudents = studentSnap.docs.map(d => d.data() as StudentProfile);
      setStudents(loadedStudents);

      const allRecords = attendanceSnap.docs.map(d => d.data() as AttendanceRecord);
      const allAbsences = absenceSnap.docs.map(d => d.data() as AbsenceNotice);
      const allSessions = sessionsSnap.docs.map(d => {
        const s = d.data() as Record<string, unknown>;
        return {
          ...s,
          id: d.id,
          date: (s.date as { toDate?: () => Date })?.toDate?.() ?? new Date(),
          createdAt: (s.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
        } as AttendanceSession;
      });

      const stats: Record<string, { attended: number; absent: number; excused: number }> = {};
      loadedStudents.forEach(student => {
        const studentRecords = allRecords.filter(r => r.studentUid === student.uid);
        const studentAbsences = allAbsences.filter(a => a.studentUid === student.uid);
        const relevantSessions = allSessions.filter(s => !student.course || s.course === student.course);
        const summary = summarizeStudentAttendance({
          sessions: relevantSessions,
          records: studentRecords,
          absences: studentAbsences,
        });
        stats[student.uid] = {
          attended: summary.attendedDays,
          absent: summary.absentUnjustifiedDays,
          excused: summary.absentJustifiedDays,
        };
      });

      setAttendanceStats(stats);
      setLoading(false);
    })();
  }, []);

  const courses   = useMemo(() => [...new Set(students.map(s => s.course).filter(Boolean))].sort(), [students]);
  const countries = useMemo(() => [...new Set(students.map(s => s.homeCountry).filter(Boolean))].sort(), [students]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s => {
      const matchQ = !q || [s.fullName, s.studentId, s.email, s.course, s.homeCountry]
        .some(v => v?.toLowerCase().includes(q));
      const matchC = !course  || s.course      === course;
      const matchN = !country || s.homeCountry === country;
      return matchQ && matchC && matchN;
    });
  }, [students, search, course, country]);

  const exportCSV = () => {
    const headers = ['Full Name','Student ID','Email','Course','Home Country','Work Experience','Education','Special Needs','Attended Days','Absent Days','Excused Days'];
    const rows = filtered.map(s => [
      s.fullName, s.studentId, s.email, s.course, s.homeCountry,
      s.workExperience, s.educationalBackground, s.specialNeeds,
      attendanceStats[s.uid]?.attended || 0,
      attendanceStats[s.uid]?.absent || 0,
      attendanceStats[s.uid]?.excused || 0,
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteStudent = async (student: StudentProfile) => {
    const confirmed = window.confirm(
      `Delete ${student.fullName || student.email || 'this student'}?\n\nThis will remove the student profile, attendance records, absence notices, and their users/{uid} role document.`,
    );
    if (!confirmed) return;

    setDeletingStudentUid(student.uid);
    try {
      const [attendanceSnap, absenceSnap] = await Promise.all([
        getDocs(query(collection(db, 'attendanceRecords'), where('studentUid', '==', student.uid))),
        getDocs(query(collection(db, 'absenceNotices'), where('studentUid', '==', student.uid))),
      ]);

      await Promise.all([
        ...attendanceSnap.docs.map(d => deleteDoc(d.ref)),
        ...absenceSnap.docs.map(d => deleteDoc(d.ref)),
        deleteDoc(doc(db, 'students', student.uid)),
        deleteDoc(doc(db, 'users', student.uid)),
      ]);

      setStudents(prev => prev.filter(s => s.uid !== student.uid));
      setAttendanceStats(prev => {
        const next = { ...prev };
        delete next[student.uid];
        return next;
      });
      showToast({
        type: 'success',
        title: 'Student deleted',
        description: `${student.fullName || student.email || 'Student'} was removed.`,
      });
    } catch (err: unknown) {
      showToast({
        type: 'error',
        title: 'Delete failed',
        description: friendlyDeleteError(err),
      });
    } finally {
      setDeletingStudentUid(null);
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <PageHeader
        title="Students"
        subtitle={`${filtered.length} of ${students.length} enrolled students`}
        actions={
          <button onClick={exportCSV} className="btn-secondary">
            <Download size={15} />
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div
        className="p-4 mb-5 rounded-3xl flex flex-col sm:flex-row gap-3 animate-fadeIn"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(139,92,246,0.10)',
          boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
        }}
      >
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a78bfa' }} />
          <input
            className="input-field pl-10"
            placeholder="Search name, ID, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field sm:w-52"
          value={course}
          onChange={e => setCourse(e.target.value)}
        >
          <option value="">All courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          className="input-field sm:w-44"
          value={country}
          onChange={e => setCountry(e.target.value)}
        >
          <option value="">All countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || course || country) && (
          <button
            className="btn-ghost"
            onClick={() => { setSearch(''); setCourse(''); setCountry(''); }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Table / Empty */}
      {filtered.length === 0 ? (
        <div
          className="p-16 rounded-3xl flex flex-col items-center gap-3 animate-fadeIn"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(139,92,246,0.10)',
            boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
          }}
        >
          <div
            className="w-14 h-14 rounded-3xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.05))' }}
          >
            <Filter size={24} style={{ color: '#a78bfa' }} />
          </div>
          <p className="font-semibold" style={{ color: '#1e1b4b' }}>No students match your filters</p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-3xl animate-fadeIn"
          style={{
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(139,92,246,0.10)',
            boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
          }}
        >
          {/* Table header */}
          <div
            className="flex items-center px-5 py-3"
            style={{
              borderBottom: '1px solid rgba(139,92,246,0.08)',
              background: 'linear-gradient(135deg, rgba(245,243,255,0.7), rgba(237,233,254,0.5))',
            }}
          >
            <div className="flex-1 min-w-0">
              <span className="table-header-cell">Student</span>
            </div>
            <div className="hidden sm:block w-56">
              <span className="table-header-cell">Course</span>
            </div>
            <div className="hidden md:block w-36">
              <span className="table-header-cell">Country</span>
            </div>
            <div className="hidden lg:block w-36">
              <span className="table-header-cell">Experience</span>
            </div>
            <div className="hidden lg:block w-44">
              <span className="table-header-cell">Education</span>
            </div>
            <div className="hidden xl:block w-28">
              <span className="table-header-cell">Attendance</span>
            </div>
            <div className="w-8" />
          </div>

          {/* Table rows */}
          <div>
            {filtered.map((s, idx) => (
              <div
                key={s.uid}
                className="flex items-center px-5 py-4 cursor-pointer group transition-all duration-150"
                style={{
                  borderBottom: idx < filtered.length - 1 ? '1px solid rgba(139,92,246,0.05)' : 'none',
                  animationDelay: `${idx * 0.02}s`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'linear-gradient(135deg, rgba(245,243,255,0.8), rgba(237,233,254,0.5))';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                {/* Student name + ID */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="avatar w-9 h-9 text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, hsl(${(s.fullName?.charCodeAt(0) ?? 0) * 4 % 360}, 65%, 55%), hsl(${(s.fullName?.charCodeAt(0) ?? 0) * 4 % 360 + 30}, 70%, 65%))` }}
                  >
                    {(s.fullName || '?')[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold truncate" style={{ color: '#1e1b4b' }}>
                        {s.fullName || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No name</span>}
                      </p>
                      {s.specialNeeds && s.specialNeeds !== 'None' && (
                        <Heart size={10} style={{ color: '#e11d48', flexShrink: 0 }} />
                      )}
                    </div>
                    <p className="text-xs truncate font-medium" style={{ color: '#9ca3af' }}>
                      {s.studentId || s.email}
                    </p>
                  </div>
                </div>

                {/* Course */}
                <div className="hidden sm:flex items-center gap-1.5 w-56">
                  <BookOpen size={12} style={{ color: '#a78bfa', flexShrink: 0 }} />
                  <span className="text-xs font-medium truncate" style={{ color: '#6b7280' }}>
                    {s.course || '—'}
                  </span>
                </div>

                {/* Country */}
                <div className="hidden md:flex items-center gap-1.5 w-36">
                  <Globe size={12} style={{ color: '#60a5fa', flexShrink: 0 }} />
                  <span className="text-xs font-medium truncate" style={{ color: '#6b7280' }}>
                    {s.homeCountry || '—'}
                  </span>
                </div>

                {/* Experience */}
                <div className="hidden lg:flex items-center gap-1.5 w-36">
                  <Briefcase size={12} style={{ color: '#34d399', flexShrink: 0 }} />
                  <span className="text-xs font-medium truncate" style={{ color: '#6b7280' }}>
                    {s.workExperience || '—'}
                  </span>
                </div>

                {/* Education */}
                <div className="hidden lg:block w-44">
                  <span className="text-xs font-medium truncate block" style={{ color: '#6b7280' }}>
                    {s.educationalBackground || '—'}
                  </span>
                </div>

                {/* Arrow */}
                <div className="w-36 flex justify-end items-center gap-1.5">
                  {(() => {
                    const stat = attendanceStats[s.uid] || { attended: 0, absent: 0, excused: 0 };
                    return (
                      <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-semibold">
                        <span className="px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}>A {stat.attended}</span>
                        <span className="px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626' }}>Ab {stat.absent}</span>
                        <span className="px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(37,99,235,0.12)', color: '#2563eb' }}>Ex {stat.excused}</span>
                      </div>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDeleteStudent(s);
                    }}
                    disabled={deletingStudentUid === s.uid}
                    className="p-1.5 rounded-lg transition-colors hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete student"
                  >
                    <Trash2 size={14} style={{ color: '#e11d48' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/lecturer/students/${s.uid}`)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-violet-50"
                    title="View student details"
                  >
                    <ChevronRight size={15} className="transition-all duration-150 group-hover:translate-x-0.5" style={{ color: '#c4b5fd' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer count */}
          <div
            className="px-5 py-3 text-xs font-semibold flex items-center gap-2"
            style={{
              borderTop: '1px solid rgba(139,92,246,0.08)',
              background: 'linear-gradient(135deg, rgba(245,243,255,0.5), transparent)',
              color: '#a78bfa',
            }}
          >
            <Users size={13} />
            {filtered.length} student{filtered.length !== 1 ? 's' : ''} shown
          </div>
        </div>
      )}
    </Layout>
  );
}

function friendlyDeleteError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    if (code === 'permission-denied') {
      return 'Firestore rules blocked this delete. Update rules for lecturer delete access.';
    }
  }
  return 'Could not delete this student. Please try again.';
}
