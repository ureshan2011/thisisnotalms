import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Box, Users, CheckCircle2, X, ChevronDown, MousePointerClick } from 'lucide-react';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ClassroomScene } from '../../components/classroom/ClassroomScene';
import { db } from '../../lib/firebase';
import { getCachedStudents, setCachedStudents } from '../../lib/studentsCache';
import type { StudentProfile } from '../../lib/types';
import { useFeatureTracking } from '../../lib/useFeatureTracking';

export default function ClassroomView() {
  useFeatureTracking('3D Classroom');

  const [students,      setStudents]      = useState<StudentProfile[]>([]);
  const [attendedUids,  setAttendedUids]  = useState<Set<string>>(new Set());
  const [selected,      setSelected]      = useState<StudentProfile | null>(null);
  const [courseFilter,  setCourseFilter]  = useState('');
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    (async () => {
      const cached = getCachedStudents();
      let all: StudentProfile[];
      if (cached) {
        all = cached;
      } else {
        const snap = await getDocs(collection(db, 'students'));
        all = snap.docs.map(d => d.data() as StudentProfile);
        setCachedStudents(all);
      }
      setStudents(all);

      const today    = new Date(); today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
      try {
        const aSnap = await getDocs(query(
          collection(db, 'attendanceRecords'),
          where('submittedAt', '>=', Timestamp.fromDate(today)),
          where('submittedAt', '<',  Timestamp.fromDate(tomorrow)),
        ));
        setAttendedUids(new Set(aSnap.docs.map(d => d.data().studentUid as string)));
      } catch {
        // Index not ready — avatars default to inactive state
      }
      setLoading(false);
    })();
  }, []);

  const courses = useMemo(() => {
    const s = new Set(students.map(st => st.course).filter(Boolean));
    return Array.from(s).sort();
  }, [students]);

  useEffect(() => {
    if (courses.length && !courseFilter) setCourseFilter(courses[0]);
  }, [courses.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(
    () => courseFilter ? students.filter(s => s.course === courseFilter) : students,
    [students, courseFilter],
  );

  const activeCount = useMemo(
    () => filtered.filter(s => attendedUids.has(s.uid)).length,
    [filtered, attendedUids],
  );

  const handleCourseChange = (course: string) => {
    setCourseFilter(course);
    setSelected(null);
  };

  const handleSelect = (s: StudentProfile | null) => setSelected(s);

  return (
    <Layout>
      <PageHeader
        title="3D Classroom"
        subtitle="Live seating view — click any avatar to highlight a student"
        actions={
          <div className="flex items-center gap-3 flex-wrap">
            {/* Course picker */}
            <div className="relative">
              <select
                value={courseFilter}
                onChange={e => handleCourseChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 transition cursor-pointer"
              >
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
                {!courses.length && <option value="">Loading…</option>}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Head count */}
            <div className="flex items-center gap-1.5 bg-white rounded-xl px-3.5 py-2.5 border border-gray-200 shadow-sm text-sm font-medium text-gray-600 select-none">
              <Users size={14} className="text-brand-500" />
              <span>{filtered.length} students</span>
            </div>

            {/* Attendance count */}
            <div className="flex items-center gap-1.5 bg-white rounded-xl px-3.5 py-2.5 border border-gray-200 shadow-sm text-sm font-medium text-gray-600 select-none">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>{activeCount} attended today</span>
            </div>
          </div>
        }
      />

      {/* Legend + hint */}
      <div className="flex items-center gap-5 mb-5 flex-wrap">
        <LegendDot color="#383852" label="Not yet attended" />
        <LegendDot color="#7c3aed" label="Attended today" ring />
        <LegendDot color="#f59e0b" label="Selected" />
        <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 select-none">
          <MousePointerClick size={13} />
          Scroll to zoom · Drag to orbit
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400 gap-3">
          <Box size={44} className="opacity-30" />
          <p className="text-sm">No students found for this course</p>
        </div>
      ) : (
        <div
          className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl"
          style={{ height: 'calc(100vh - 270px)', minHeight: '480px' }}
        >
          <ClassroomScene
            students={filtered}
            attendedUids={attendedUids}
            selectedId={selected?.uid ?? null}
            onSelect={handleSelect}
            course={courseFilter}
          />

          {/* Selected student info panel */}
          {selected && (
            <StudentPanel
              student={selected}
              isActive={attendedUids.has(selected.uid)}
              onClose={() => setSelected(null)}
            />
          )}

          {/* Subtle overlay hint when nothing is selected */}
          {!selected && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-black/40 backdrop-blur-sm text-white/70 text-xs px-4 py-2 rounded-full select-none">
                Click a student avatar to see their details
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function LegendDot({ color, label, ring }: { color: string; label: string; ring?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 select-none">
      <div className="relative flex-shrink-0 w-3.5 h-3.5">
        <div className="w-3.5 h-3.5 rounded-full" style={{ background: color }} />
        {ring && (
          <div
            className="absolute -top-0.5 -left-0.5 w-4.5 h-4.5 rounded-full border"
            style={{ borderColor: '#a78bfa', width: '18px', height: '18px', top: '-2px', left: '-2px' }}
          />
        )}
      </div>
      <span>{label}</span>
    </div>
  );
}

function StudentPanel({
  student,
  isActive,
  onClose,
}: {
  student: StudentProfile;
  isActive: boolean;
  onClose: () => void;
}) {
  const initials = student.fullName
    .split(' ')
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      className="absolute top-4 right-4 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-violet-100 p-5 z-10 animate-fadeIn"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={15} />
      </button>

      {/* Avatar circle */}
      <div
        className={`w-14 h-14 rounded-full mb-3 flex items-center justify-center text-white font-bold text-xl shadow-md ${
          isActive
            ? 'bg-gradient-to-br from-violet-500 to-violet-700'
            : 'bg-gradient-to-br from-gray-400 to-gray-600'
        }`}
      >
        {initials}
      </div>

      <h3 className="font-semibold text-gray-900 text-base leading-tight pr-6">{student.fullName}</h3>
      <p className="text-xs text-gray-500 mt-0.5 font-mono">{student.studentId}</p>

      <div className="mt-4 space-y-2.5 border-t border-gray-100 pt-3">
        <InfoRow label="Section"  value={student.section  || '—'} highlight />
        <InfoRow label="Campus"   value={student.campus   || '—'} />
        <InfoRow label="Course"   value={student.course   || '—'} />
        <InfoRow label="Intake"   value={student.intake   || '—'} />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Today</span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              isActive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {isActive ? 'Attended' : 'Not yet attended'}
          </span>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span
        className={`text-xs font-semibold ${
          highlight
            ? 'bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full'
            : 'text-gray-700'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
