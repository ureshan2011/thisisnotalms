import { useState } from 'react';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { StudentProfile } from '../../lib/types';
import type { SqlRaceChallenge, SqlRaceSubmission } from '../../lib/sqlRaceTypes';
import { SECTION_COLORS } from '../../lib/sqlRaceTypes';

interface Props {
  students: StudentProfile[];
  challenges: SqlRaceChallenge[];
  submissions: SqlRaceSubmission[];
}

type FilterSection = 'All' | string;
type FilterStatus = 'All' | 'Correct' | 'Incorrect' | 'Not Submitted';

const ALL_SECTIONS = ['All', 'Section A', 'Section B', 'Section C', 'Section Default (No Section)'];

export default function ContributionPanel({ students, challenges, submissions }: Props) {
  const { user } = useAuth();
  const [filterChallenge, setFilterChallenge] = useState<string>('All');
  const [filterSection, setFilterSection] = useState<FilterSection>('All');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [overriding, setOverriding] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter(s => {
    if (filterChallenge !== 'All' && s.challengeId !== filterChallenge) return false;
    return true;
  });

  const mbi802Students = students.filter(s => (s.subjects ?? []).includes('MBI802'));

  const getStudentSubmissions = (studentUid: string) =>
    filteredSubmissions.filter(s => s.studentUid === studentUid);

  const getStudentStatus = (subs: SqlRaceSubmission[]): FilterStatus => {
    if (subs.length === 0) return 'Not Submitted';
    if (subs.some(s => s.isCorrect === true)) return 'Correct';
    if (subs.some(s => s.isCorrect === null)) return 'Not Submitted';
    return 'Incorrect';
  };

  const filteredStudents = mbi802Students.filter(student => {
    if (filterSection !== 'All' && student.section !== filterSection) return false;
    const subs = getStudentSubmissions(student.uid);
    const status = getStudentStatus(subs);
    if (filterStatus !== 'All' && status !== filterStatus) return false;
    return true;
  });

  // Section summary
  const sectionSummary = ['Section A', 'Section B', 'Section C', 'Section Default (No Section)'].map(section => {
    const sectionStudents = mbi802Students.filter(s => s.section === section);
    const contributed = sectionStudents.filter(s => {
      const subs = getStudentSubmissions(s.uid);
      return subs.some(sub => sub.isCorrect === true);
    }).length;
    const totalMarks = filteredSubmissions
      .filter(s => s.studentSection === section && s.isCorrect)
      .reduce((sum, s) => sum + s.marksAwarded, 0);
    return { section, total: sectionStudents.length, contributed, totalMarks };
  }).filter(s => s.total > 0);

  const handleOverride = async (submissionId: string, isCorrect: boolean, marksAwarded: number) => {
    setOverriding(submissionId);
    try {
      await updateDoc(doc(db, 'sqlRaceSubmissions', submissionId), {
        isCorrect,
        marksAwarded: isCorrect ? marksAwarded : 0,
        reviewedAt: serverTimestamp(),
        reviewedByUid: user!.uid,
      });
    } finally {
      setOverriding(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Section summary cards */}
      {sectionSummary.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sectionSummary.map(({ section, total, contributed, totalMarks }) => {
            const color = SECTION_COLORS[section] ?? '#8b5cf6';
            const label = section === 'Section Default (No Section)' ? 'Default' : section;
            return (
              <div
                key={section}
                className="card p-3 space-y-1"
                style={{ borderColor: `${color}30`, background: `${color}08` }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs font-bold text-gray-700 truncate">{label}</span>
                </div>
                <p className="text-lg font-bold" style={{ color }}>{totalMarks} <span className="text-xs font-normal text-gray-400">pts</span></p>
                <p className="text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-700">{contributed}</span>/{total} students contributed
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="section-label block mb-1">Challenge</label>
          <select
            className="input-field text-sm py-1.5 pr-8"
            value={filterChallenge}
            onChange={e => setFilterChallenge(e.target.value)}
          >
            <option value="All">All Challenges</option>
            {challenges.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="section-label block mb-1">Section</label>
          <select
            className="input-field text-sm py-1.5 pr-8"
            value={filterSection}
            onChange={e => setFilterSection(e.target.value)}
          >
            {ALL_SECTIONS.map(s => (
              <option key={s} value={s}>{s === 'Section Default (No Section)' ? 'Default' : s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="section-label block mb-1">Status</label>
          <select
            className="input-field text-sm py-1.5 pr-8"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as FilterStatus)}
          >
            {(['All', 'Correct', 'Incorrect', 'Not Submitted'] as FilterStatus[]).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student table */}
      <div className="card overflow-hidden p-0">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
            <Users size={32} className="opacity-40" />
            <p className="text-sm">No students match the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(124,58,237,0.04)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Section</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Attempts</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Marks</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, i) => {
                  const subs = getStudentSubmissions(student.uid);
                  const status = getStudentStatus(subs);
                  const totalMarks = subs.filter(s => s.isCorrect).reduce((sum, s) => sum + s.marksAwarded, 0);
                  const sectionColor = SECTION_COLORS[student.section] ?? '#8b5cf6';
                  const isExpanded = expandedRow === student.uid;

                  return (
                    <>
                      <tr
                        key={student.uid}
                        style={{
                          borderBottom: '1px solid rgba(0,0,0,0.05)',
                          background: i % 2 === 0 ? 'white' : 'rgba(249,250,251,0.8)',
                        }}
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800 text-sm">{student.fullName || student.email}</p>
                          <p className="text-xs text-gray-400">{student.studentId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${sectionColor}18`, color: sectionColor }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sectionColor }} />
                            {student.section === 'Section Default (No Section)' ? 'Default' : student.section || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-gray-700">{subs.length}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {status === 'Correct' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle size={11} /> Correct
                            </span>
                          )}
                          {status === 'Incorrect' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                              <XCircle size={11} /> Incorrect
                            </span>
                          )}
                          {status === 'Not Submitted' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              <Clock size={11} /> Not submitted
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-brand-600">{totalMarks}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {subs.length > 0 && (
                            <button
                              onClick={() => setExpandedRow(isExpanded ? null : student.uid)}
                              className="text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          )}
                        </td>
                      </tr>
                      {isExpanded && subs.length > 0 && (
                        <tr
                          key={`${student.uid}-expanded`}
                          style={{ background: '#f8f7ff', borderBottom: '1px solid rgba(124,58,237,0.1)' }}
                        >
                          <td colSpan={6} className="px-6 py-4">
                            <div className="space-y-3">
                              {subs.map(sub => {
                                const challenge = challenges.find(c => c.id === sub.challengeId);
                                return (
                                  <div key={sub.id} className="rounded-xl border p-3 bg-white space-y-2" style={{ borderColor: 'rgba(124,58,237,0.12)' }}>
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                      <div>
                                        <p className="text-xs font-semibold text-gray-700">{challenge?.title ?? 'Unknown Challenge'}</p>
                                        <p className="text-[10px] text-gray-400">Attempt {sub.attemptNumber} · {sub.submittedAt?.toDate?.()?.toLocaleString?.() ?? '—'}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {sub.isCorrect === true && (
                                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Correct +{sub.marksAwarded}pts</span>
                                        )}
                                        {sub.isCorrect === false && (
                                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Incorrect</span>
                                        )}
                                        {sub.isCorrect === null && (
                                          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
                                        )}
                                        {/* Override buttons */}
                                        {sub.isCorrect !== true && (
                                          <button
                                            disabled={overriding === sub.id}
                                            onClick={() => handleOverride(sub.id, true, challenge?.pointValue ?? 0)}
                                            className="text-[11px] font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition-colors disabled:opacity-50"
                                          >
                                            Mark correct
                                          </button>
                                        )}
                                        {sub.isCorrect !== false && (
                                          <button
                                            disabled={overriding === sub.id}
                                            onClick={() => handleOverride(sub.id, false, 0)}
                                            className="text-[11px] font-semibold text-rose-700 border border-rose-200 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-lg transition-colors disabled:opacity-50"
                                          >
                                            Mark incorrect
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    <pre
                                      className="text-xs rounded-lg p-2 overflow-auto"
                                      style={{
                                        background: '#1e1b4b',
                                        color: '#c4b5fd',
                                        fontFamily: "'Courier New', Courier, monospace",
                                        maxHeight: '120px',
                                      }}
                                    >
                                      {sub.query}
                                    </pre>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
