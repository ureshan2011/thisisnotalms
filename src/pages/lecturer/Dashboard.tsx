import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, Timestamp, query, orderBy, limit } from 'firebase/firestore';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { Users, Globe, GraduationCap, Briefcase, Heart, CalendarCheck, TrendingUp, ClipboardList, Download, Search, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { getCachedStudents, setCachedStudents } from '../../lib/studentsCache';
import Layout, { PageHeader } from '../../components/layout/Layout';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StudentPhotoCollage from '../../components/ui/StudentPhotoCollage';
import { avatarGradient } from '../../components/ui/PhotoUploadModal';
import type { StudentProfile, AttendanceSession, EmploymentSurveyResponse } from '../../lib/types';
import { groupBy, toCounts } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useFeatureTracking } from '../../lib/useFeatureTracking';

const CHART_COLORS = [
  '#7c3aed','#a78bfa','#06b6d4','#10b981',
  '#f59e0b','#ef4444','#ec4899','#14b8a6','#f97316','#8b5cf6',
];

const tooltipStyle = {
  borderRadius: '16px',
  border: '1px solid rgba(139,92,246,0.15)',
  boxShadow: '0 12px 32px rgba(124,106,247,0.14)',
  background: 'rgba(255,255,255,0.97)',
  backdropFilter: 'blur(12px)',
  fontSize: '12px',
  fontWeight: 500,
  color: '#1e1b4b',
  padding: '10px 14px',
};

export default function Dashboard() {
  const { role } = useAuth();
  useFeatureTracking('Lecturer Dashboard');
  const isTa = role === 'teachingAssistant';
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<EmploymentSurveyResponse[]>([]);
  const [surveySearch, setSurveySearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [intakeFilter, setIntakeFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    (async () => {
      // Reuse students already fetched by StudentList (shared module cache).
      const cached = getCachedStudents();
      const [stuResult, sesSnap, surSnap] = await Promise.all([
        cached ? Promise.resolve(null) : getDocs(collection(db, 'students')),
        getDocs(query(collection(db, 'attendanceSessions'), orderBy('createdAt', 'desc'), limit(100))),
        getDocs(collection(db, 'employmentSurvey')),
      ]);

      if (cached) {
        setStudents(cached);
      } else if (stuResult) {
        const loaded = stuResult.docs.map(d => d.data() as StudentProfile);
        setCachedStudents(loaded);
        setStudents(loaded);
      }

      setSessions(sesSnap.docs.map(d => {
        const data = d.data();
        return {
          id:          d.id,
          title:       data.title,
          course:      data.course,
          status:      data.status,
          date:        (data.date as Timestamp)?.toDate?.() ?? new Date(),
          lecturerId:  data.lecturerId,
          checkpoints: data.checkpoints || [],
          createdAt:   (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
        } as AttendanceSession;
      }));

      setSurveyResponses(surSnap.docs.map(d => {
        const data = d.data();
        return {
          uid:         d.id,
          fullName:    data.fullName ?? '',
          email:       data.email ?? '',
          course:      data.course ?? '',
          intake:      data.intake ?? '',
          section:     data.section ?? '',
          campus:      data.campus ?? '',
          answer:      data.answer,
          company:     data.company,
          jobRole:     data.jobRole,
          submittedAt: (data.submittedAt as Timestamp)?.toDate?.() ?? new Date(),
        } as EmploymentSurveyResponse;
      }));

      setLoading(false);
    })();
  }, []);

  const courses = useMemo(
    () => [...new Set(students.map(s => s.course).filter(Boolean))].sort(),
    [students],
  );
  const intakes = useMemo(
    () => [...new Set(students.map(s => s.intake).filter(Boolean))].sort(),
    [students],
  );
  const subjects = useMemo(
    () => [...new Set(students.flatMap(s => s.subjects || []).filter(Boolean))].sort(),
    [students],
  );
  const filteredStudents = useMemo(
    () => students.filter(s =>
      (!courseFilter || s.course === courseFilter) &&
      (!intakeFilter || s.intake === intakeFilter) &&
      (!subjectFilter || (s.subjects || []).includes(subjectFilter))
    ),
    [students, courseFilter, intakeFilter, subjectFilter],
  );
  const filteredSessions = useMemo(
    () => sessions.filter(s =>
      (!courseFilter || s.course === courseFilter) &&
      (!subjectFilter || s.course === subjectFilter)
    ),
    [sessions, courseFilter, subjectFilter],
  );

  const byCourse  = toCounts(groupBy(filteredStudents, s => s.course));
  const byCountry = toCounts(groupBy(filteredStudents, s => s.homeCountry));
  const byEdu     = toCounts(groupBy(filteredStudents, s => s.educationalBackground));
  const byWork    = toCounts(groupBy(filteredStudents, s => s.workExperience));
  const withNeeds = filteredStudents.filter(s => s.specialNeeds && s.specialNeeds !== 'None' && s.specialNeeds !== '');
  const studentsWithPins = filteredStudents.filter(s => typeof s.hometownLat === 'number' && typeof s.hometownLng === 'number');
  const activeSessions = filteredSessions.filter(s => s.status === 'active');

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      {/* Page header with greeting */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#a78bfa' }}>
              Welcome back 👋
            </p>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">
              {filteredStudents.length} enrolled student{filteredStudents.length !== 1 ? 's' : ''}
              {courseFilter ? ` in ${courseFilter}` : ` across ${courses.length} course${courses.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          {activeSessions.length > 0 && (
            <div
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold animate-pulse"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(45,212,191,0.08))',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.20)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {activeSessions.length} live session{activeSessions.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <div className="card p-4 mb-6 animate-fadeIn">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1e1b4b' }}>Filters</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Filter by course, intake, and subject.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="input-field min-w-[240px]"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="">All courses</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input-field min-w-[180px]" value={intakeFilter} onChange={(e) => setIntakeFilter(e.target.value)}>
              <option value="">All intakes</option>
              {intakes.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select className="input-field min-w-[200px]" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
              <option value="">All subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {(courseFilter || intakeFilter || subjectFilter) && (
              <button className="btn-ghost" onClick={() => { setCourseFilter(''); setIntakeFilter(''); setSubjectFilter(''); }}>Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          { title: 'Total Students', value: filteredStudents.length,  icon: Users,         color: 'violet'  as const },
          { title: 'Courses',        value: byCourse.length,          icon: GraduationCap, color: 'indigo'  as const },
          { title: 'Countries',      value: byCountry.length, icon: Globe,         color: 'sky'     as const },
          {
            title: 'With Work Exp.',
            value: filteredStudents.filter(s => s.workExperience && s.workExperience !== 'No work experience').length,
            icon: Briefcase, color: 'emerald' as const,
          },
          ...(!isTa ? [{ title: 'Special Needs',  value: withNeeds.length, icon: Heart, color: 'rose' as const }] : []),
          { title: 'Sessions',       value: filteredSessions.length,  icon: CalendarCheck, color: 'amber'   as const },
        ].map((p, i) => (
          <div key={p.title} style={{ animationDelay: `${i * 0.05}s` }} className="relative">
            <StatCard {...p} />
          </div>
        ))}
      </div>

      {/* Photo Collage */}
      <StudentPhotoCollage students={filteredStudents} />

      {/* Student cards grid */}
      <div className="card p-6 mb-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>
            {courseFilter ? `Students in ${courseFilter}` : 'Students (all courses)'}
          </h3>
          <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>
            {filteredStudents.length} total
          </span>
        </div>
        {filteredStudents.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredStudents.slice(0, 12).map(s => (
              <div
                key={s.uid}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{ background: 'rgba(245,243,255,0.7)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(237,233,254,0.85)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(245,243,255,0.7)'; }}
              >
                {/* Student photo / avatar */}
                <div
                  className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{
                    background: s.photoURL ? 'transparent' : avatarGradient(s.uid),
                    border: '2px solid rgba(139,92,246,0.18)',
                    boxShadow: '0 2px 8px rgba(124,58,237,0.12)',
                  }}
                >
                  {s.photoURL
                    ? <img src={s.photoURL} alt={s.fullName} className="w-full h-full object-cover" />
                    : (s.fullName?.[0] ?? '?').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1e1b4b' }}>{s.fullName || 'Unknown student'}</p>
                  <p className="text-xs truncate" style={{ color: '#9ca3af' }}>{s.studentId || s.email || 'No ID'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Students by Course" icon={<GraduationCap size={16} />}>
          {byCourse.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byCourse} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} interval={0} angle={-18} textAnchor="end" height={52} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="Students" radius={[8, 8, 0, 0]}>
                  {byCourse.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Countries (Top 10)" icon={<Globe size={16} />}>
          {byCountry.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={byCountry.slice(0, 10)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {byCountry.slice(0, 10).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} students`]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Educational Background" icon={<TrendingUp size={16} />}>
          {byEdu.length === 0 ? <EmptyChart /> : (
            <EduDistributionList data={byEdu} />
          )}
        </ChartCard>

        <ChartCard title="Work Experience" icon={<Briefcase size={16} />}>
          {byWork.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byWork} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} interval={0} angle={-15} textAnchor="end" height={52} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="Students" radius={[8, 8, 0, 0]}>
                  {byWork.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* World map */}
      <div className="card p-6 mb-6 animate-fadeIn">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="rounded-xl p-2"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(96,165,250,0.08))' }}
          >
            <Globe size={16} style={{ color: '#0ea5e9' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Student Hometown Map</h3>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Zoom to explore where students come from</p>
          </div>
        </div>

        <div className="divider" />

        {studentsWithPins.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-96 w-full overflow-hidden rounded-2xl"
            style={{ border: '1px solid rgba(139,92,246,0.10)' }}
          >
            <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {studentsWithPins.map(s => (
                <Marker key={s.uid} position={[s.hometownLat as number, s.hometownLng as number]}>
                  <Popup>
                    <div className="text-xs p-1">
                      <p className="font-bold text-gray-800">{s.fullName || 'Unknown student'}</p>
                      <p className="text-gray-500 mt-0.5">{s.hometown || s.homeCountry || 'Unknown hometown'}</p>
                      <p className="text-brand-500 font-medium mt-0.5">{s.course || 'Course not set'}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Employment Survey Results */}
      <SurveySection
        responses={surveyResponses}
        courseFilter={courseFilter}
        intakeFilter={intakeFilter}
        search={surveySearch}
        onSearchChange={setSurveySearch}
      />

      {/* Special needs summary */}
      {!isTa && withNeeds.length > 0 && (
        <div className="card p-6 mb-6 animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="rounded-xl p-2"
              style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.10), rgba(232,121,160,0.08))' }}
            >
              <Heart size={16} style={{ color: '#e11d48' }} />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Special Needs & Accommodations</h3>
              <p className="text-xs" style={{ color: '#9ca3af' }}>{withNeeds.length} student{withNeeds.length > 1 ? 's' : ''} with declared requirements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {withNeeds.map(s => (
              <div
                key={s.uid}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(244,63,94,0.06), rgba(232,121,160,0.04))',
                  border: '1px solid rgba(244,63,94,0.10)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{
                    background: s.photoURL ? 'transparent' : 'linear-gradient(135deg, #f43f5e, #e879a0)',
                    border: '2px solid rgba(244,63,94,0.20)',
                    boxShadow: '0 2px 8px rgba(244,63,94,0.15)',
                  }}
                >
                  {s.photoURL
                    ? <img src={s.photoURL} alt={s.fullName} className="w-full h-full object-cover" />
                    : (s.fullName || '?')[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1e1b4b' }}>{s.fullName}</p>
                  <p className="text-xs truncate font-medium" style={{ color: '#e11d48' }}>{s.specialNeeds}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

function ChartCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card p-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-5">
        <div
          className="rounded-xl p-1.5"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(139,92,246,0.06))' }}
        >
          <span style={{ color: '#7c3aed' }}>{icon}</span>
        </div>
        <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(167,139,250,0.05))' }}
      >
        <TrendingUp size={18} style={{ color: '#a78bfa' }} />
      </div>
      <p className="text-sm font-medium" style={{ color: '#c4b5fd' }}>No data yet</p>
    </div>
  );
}

// ── Employment Survey Section ─────────────────────────────────────────────────

function exportSurveyCSV(data: EmploymentSurveyResponse[]) {
  const headers = [
    'Name', 'Email', 'Course', 'Intake', 'Section', 'Campus',
    'Started Work After Enrolment', 'Company / Organisation', 'Job Role', 'Submitted',
  ];
  const rows = data.map(r => [
    r.fullName,
    r.email,
    r.course,
    r.intake,
    r.section,
    r.campus,
    r.answer === 'yes' ? 'Yes' : 'No',
    r.company ?? '',
    r.jobRole ?? '',
    r.submittedAt instanceof Date ? r.submittedAt.toLocaleDateString('en-NZ') : '',
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `employment-survey-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function SurveySection({
  responses,
  courseFilter,
  intakeFilter,
  search,
  onSearchChange,
}: {
  responses: EmploymentSurveyResponse[];
  courseFilter: string;
  intakeFilter: string;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return responses.filter(r =>
      (!courseFilter || r.course === courseFilter) &&
      (!intakeFilter || r.intake === intakeFilter) &&
      (!q ||
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.company ?? '').toLowerCase().includes(q) ||
        (r.jobRole ?? '').toLowerCase().includes(q))
    );
  }, [responses, courseFilter, intakeFilter, search]);

  const yesCount = filtered.filter(r => r.answer === 'yes').length;
  const noCount  = filtered.filter(r => r.answer === 'no').length;

  return (
    <div className="card p-6 mb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl p-2"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.11), rgba(139,92,246,0.07))' }}
          >
            <ClipboardList size={16} style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>
              Post-Enrolment Employment Survey
            </h3>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              {responses.length} response{responses.length !== 1 ? 's' : ''} total
              {courseFilter || intakeFilter ? ` · ${filtered.length} shown` : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => exportSurveyCSV(filtered)}
          className="btn-ghost flex items-center gap-1.5 text-xs"
          disabled={filtered.length === 0}
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(16,185,129,0.10)', color: '#059669', border: '1px solid rgba(16,185,129,0.18)' }}
        >
          <CheckCircle size={12} />
          {yesCount} started working
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(100,116,139,0.09)', color: '#475569', border: '1px solid rgba(100,116,139,0.16)' }}
        >
          <XCircle size={12} />
          {noCount} not yet
        </span>
        {responses.length > 0 && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.14)' }}
          >
            {Math.round((yesCount / (responses.length || 1)) * 100)}% employment rate
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a78bfa' }} />
        <input
          className="input-field w-full pl-9"
          placeholder="Search by name, email, company or role…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.08)' }}
          >
            <ClipboardList size={18} style={{ color: '#a78bfa' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: '#c4b5fd' }}>
            {responses.length === 0 ? 'No survey responses yet' : 'No results match your search'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(r => (
            <div
              key={r.uid}
              className="rounded-2xl px-4 py-3 flex flex-col gap-2"
              style={{
                background: r.answer === 'yes'
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(52,211,153,0.03))'
                  : 'rgba(245,243,255,0.7)',
                border: r.answer === 'yes'
                  ? '1px solid rgba(16,185,129,0.16)'
                  : '1px solid rgba(139,92,246,0.10)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1e1b4b' }}>
                    {r.fullName || 'Unknown'}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#9ca3af' }}>{r.email}</p>
                </div>
                <span
                  className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={
                    r.answer === 'yes'
                      ? { background: 'rgba(16,185,129,0.12)', color: '#059669' }
                      : { background: 'rgba(100,116,139,0.10)', color: '#475569' }
                  }
                >
                  {r.answer === 'yes' ? 'Employed' : 'Not yet'}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {r.course && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(124,58,237,0.09)', color: '#7c3aed' }}>
                    {r.course}
                  </span>
                )}
                {r.intake && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(6,182,212,0.09)', color: '#0e7490' }}>
                    {r.intake}
                  </span>
                )}
                {r.campus && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(245,158,11,0.10)', color: '#92400e' }}>
                    {r.campus}
                  </span>
                )}
              </div>

              {r.answer === 'yes' && r.company && (
                <div className="text-xs space-y-0.5" style={{ color: '#374151' }}>
                  <p><span className="font-semibold">Company:</span> {r.company}</p>
                  <p><span className="font-semibold">Role:</span> {r.jobRole}</p>
                </div>
              )}

              <p className="text-[10px]" style={{ color: '#c4b5fd' }}>
                Submitted {r.submittedAt instanceof Date ? r.submittedAt.toLocaleDateString('en-NZ') : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EduDistributionList({ data }: { data: Array<{ name: string; value: number }> }) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sortedData.map(item => item.value), 1);
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
      {sortedData.map((item, i) => {
        const percent = total > 0 ? (item.value / total) * 100 : 0;
        const widthPercent = Math.max((item.value / maxValue) * 100, 10);

        return (
          <div
            key={item.name || `edu-${i}`}
            className="rounded-2xl px-3 py-3"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.03))',
              border: '1px solid rgba(139,92,246,0.10)',
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-xs font-semibold leading-5 break-words" style={{ color: '#312e81' }}>
                {item.name || 'Not specified'}
              </p>
              <span
                className="text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
                style={{ background: 'rgba(124,58,237,0.10)', color: '#6d28d9' }}
              >
                {item.value} ({percent.toFixed(0)}%)
              </span>
            </div>

            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(167,139,250,0.20)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${widthPercent}%`,
                  background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, #c4b5fd)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
