import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Globe, Briefcase, BookOpen, ChevronRight, Heart } from 'lucide-react';
import { db } from '../../lib/firebase';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { StudentProfile } from '../../lib/types';

export default function StudentList() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [course,   setCourse]   = useState('');
  const [country,  setCountry]  = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getDocs(collection(db, 'students')).then(snap => {
      setStudents(snap.docs.map(d => d.data() as StudentProfile));
      setLoading(false);
    });
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
    const headers = ['Full Name','Student ID','Email','Course','Home Country','Work Experience','Education','Special Needs'];
    const rows = filtered.map(s => [
      s.fullName, s.studentId, s.email, s.course, s.homeCountry,
      s.workExperience, s.educationalBackground, s.specialNeeds,
    ].map(v => `"${(v || '').replace(/"/g, '""')}"`));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <PageHeader
        title="Students"
        subtitle={`${filtered.length} of ${students.length} students`}
        actions={
          <button onClick={exportCSV} className="btn-secondary">
            <Download size={15} />
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="Search name, ID, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field sm:w-48" value={course} onChange={e => setCourse(e.target.value)}>
          <option value="">All courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-field sm:w-44" value={country} onChange={e => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || course || country) && (
          <button className="btn-secondary" onClick={() => { setSearch(''); setCourse(''); setCountry(''); }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Filter size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No students match your filters</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Course</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Country</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Experience</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Education</th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(s => (
                  <tr
                    key={s.uid}
                    onClick={() => navigate(`/lecturer/students/${s.uid}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {(s.fullName || '?')[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 text-sm flex items-center gap-1.5">
                            {s.fullName || <span className="text-slate-400 italic">No name</span>}
                            {s.specialNeeds && s.specialNeeds !== 'None' && (
                              <Heart size={11} className="text-rose-400" />
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{s.studentId || s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-slate-600 flex items-center gap-1.5">
                        <BookOpen size={12} className="text-brand-400" />
                        {s.course || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Globe size={12} className="text-sky-400" />
                        {s.homeCountry || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Briefcase size={12} className="text-emerald-400" />
                        {s.workExperience || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-slate-500 max-w-[180px] truncate block">
                        {s.educationalBackground || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
