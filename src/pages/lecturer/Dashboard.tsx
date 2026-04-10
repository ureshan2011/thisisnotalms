import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import { Users, Globe, GraduationCap, Briefcase, Heart, CalendarCheck } from 'lucide-react';
import { db } from '../../lib/firebase';
import Layout, { PageHeader, SectionLabel } from '../../components/layout/Layout';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { StudentProfile, AttendanceSession } from '../../lib/types';
import { groupBy, toCounts } from '../../lib/utils';

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6','#f97316','#a855f7'];

export default function Dashboard() {
  const [students,  setStudents]  = useState<StudentProfile[]>([]);
  const [sessions,  setSessions]  = useState<AttendanceSession[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      const [stuSnap, sesSnap] = await Promise.all([
        getDocs(collection(db, 'students')),
        getDocs(collection(db, 'attendanceSessions')),
      ]);
      setStudents(stuSnap.docs.map(d => d.data() as StudentProfile));
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
      setLoading(false);
    })();
  }, []);

  const byCourse  = toCounts(groupBy(students, s => s.course));
  const byCountry = toCounts(groupBy(students, s => s.homeCountry));
  const byEdu     = toCounts(groupBy(students, s => s.educationalBackground));
  const byWork    = toCounts(groupBy(students, s => s.workExperience));
  const withNeeds = students.filter(s => s.specialNeeds && s.specialNeeds !== 'None' && s.specialNeeds !== '');

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <PageHeader
        title="Dashboard"
        subtitle={`Overview of ${students.length} enrolled student${students.length !== 1 ? 's' : ''}`}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Students"       value={students.length}           icon={Users}          color="indigo" />
        <StatCard title="Courses"              value={byCourse.length}           icon={GraduationCap}  color="violet" />
        <StatCard title="Countries"            value={byCountry.length}          icon={Globe}          color="sky" />
        <StatCard title="With Work Exp."       value={students.filter(s => s.workExperience && s.workExperience !== 'No work experience').length} icon={Briefcase} color="emerald" />
        <StatCard title="Special Needs"        value={withNeeds.length}          icon={Heart}          color="rose" />
        <StatCard title="Sessions"             value={sessions.length}           icon={CalendarCheck}  color="amber" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Students by Course">
          {byCourse.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byCourse} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="Students" radius={[6, 6, 0, 0]}>
                  {byCourse.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Students by Country (Top 10)">
          {byCountry.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={byCountry.slice(0, 10)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={11}
                >
                  {byCountry.slice(0, 10).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} students`]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Educational Background">
          {byEdu.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byEdu} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={180} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="Students" radius={[0, 6, 6, 0]}>
                  {byEdu.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Work Experience">
          {byWork.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byWork} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="Students" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Special needs summary */}
      {withNeeds.length > 0 && (
        <div className="card p-6 mb-6">
          <SectionLabel>Students with declared special needs or accommodations</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {withNeeds.map(s => (
              <div key={s.uid} className="flex items-center gap-3 px-4 py-3 bg-rose-50 rounded-xl border border-rose-100">
                <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 text-xs font-bold flex-shrink-0">
                  {(s.fullName || '?')[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-rose-900 truncate">{s.fullName}</p>
                  <p className="text-xs text-rose-600 truncate">{s.specialNeeds}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-slate-700 text-sm mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return <p className="text-slate-400 text-sm text-center py-10">No data yet</p>;
}

const tooltipStyle = {
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  fontSize: '12px',
};
