import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Users, Award, BarChart2, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../../lib/firebase';
import {
  AGILE_SCRUM_COLLECTION,
  AGILE_SCRUM_QUIZ_TITLE,
  AGILE_SCRUM_PASS_PERCENTAGE,
  AGILE_SCRUM_BADGE_PERCENTAGE,
  AGILE_SCRUM_MAX_ATTEMPTS,
} from '../../lib/agileScrumMcqData';

interface StudentResult {
  studentUid:        string;
  studentName:       string;
  studentDisplayId:  string;
  studentSection:    string;
  studentCampus:     string;
  attempts:          { score: number; total: number; percentage: number; completedAt: Date }[];
  bestPercentage:    number;
  badgeEarned:       boolean;
  passed:            boolean;
  attemptCount:      number;
  lastAttemptAt:     Date;
}

type SortKey = 'name' | 'score' | 'date' | 'attempts';
type SortDir = 'asc' | 'desc';

function fmt(d: Date) {
  return d.toLocaleString('en-NZ', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AgileScrumMcqDashboard() {
  const [results, setResults]               = useState<StudentResult[]>([]);
  const [loading, setLoading]               = useState(true);
  const [sortKey, setSortKey]               = useState<SortKey>('date');
  const [sortDir, setSortDir]               = useState<SortDir>('desc');
  const [filterText, setFilterText]         = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, AGILE_SCRUM_COLLECTION),
      orderBy('lastAttemptAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const rows: StudentResult[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          studentUid:       data.studentUid ?? d.id,
          studentName:      data.studentName ?? 'Unknown',
          studentDisplayId: data.studentDisplayId ?? '',
          studentSection:   data.studentSection ?? '',
          studentCampus:    data.studentCampus ?? '',
          attempts: (data.attempts ?? []).map((a: any) => ({
            ...a,
            completedAt: a.completedAt?.toDate?.() ?? new Date(),
          })),
          bestPercentage: data.bestPercentage ?? 0,
          badgeEarned:    data.badgeEarned ?? false,
          passed:         data.passed ?? false,
          attemptCount:   data.attemptCount ?? 0,
          lastAttemptAt:  data.lastAttemptAt?.toDate?.() ?? new Date(),
        };
      });
      setResults(rows);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const totalStudents = results.length;
  const passCount     = results.filter((r) => r.passed).length;
  const badgeCount    = results.filter((r) => r.badgeEarned).length;
  const avgBest       = totalStudents > 0
    ? Math.round(results.reduce((s, r) => s + r.bestPercentage, 0) / totalStudents)
    : 0;

  const buckets = [
    { label: '0–49%',   min: 0,  max: 49,  color: '#fca5a5' },
    { label: '50–69%',  min: 50, max: 69,  color: '#fcd34d' },
    { label: '70–89%',  min: 70, max: 89,  color: '#6ee7b7' },
    { label: '90–100%', min: 90, max: 100, color: '#34d399' },
  ];
  const bucketCounts = buckets.map(
    (b) => results.filter((r) => r.bestPercentage >= b.min && r.bestPercentage <= b.max).length
  );
  const maxBucket = Math.max(...bucketCounts, 1);

  const filtered = results.filter((r) => {
    const t = filterText.toLowerCase();
    return !t
      || r.studentName.toLowerCase().includes(t)
      || r.studentDisplayId.toLowerCase().includes(t)
      || r.studentSection.toLowerCase().includes(t)
      || r.studentCampus.toLowerCase().includes(t);
  });

  function sorted(rows: StudentResult[]) {
    return [...rows].sort((a, b) => {
      let cmp = 0;
      if      (sortKey === 'name')     cmp = a.studentName.localeCompare(b.studentName);
      else if (sortKey === 'score')    cmp = a.bestPercentage - b.bestPercentage;
      else if (sortKey === 'attempts') cmp = a.attemptCount - b.attemptCount;
      else                             cmp = a.lastAttemptAt.getTime() - b.lastAttemptAt.getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown size={13} style={{ opacity: 0.4 }} />;
    return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(5,150,105,0.2)', borderTopColor: '#059669' }} />
      </div>
    );
  }

  const displayResults = sorted(filtered);

  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#059669' }}>
        Student Results — {AGILE_SCRUM_QUIZ_TITLE}
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users,    label: 'Students Attempted',                  value: totalStudents, sub: `max ${AGILE_SCRUM_MAX_ATTEMPTS} attempts each` },
          { icon: BarChart2, label: 'Average Best Score',                 value: `${avgBest}%`, sub: 'across all students' },
          { icon: Award,    label: `Passed (>${AGILE_SCRUM_PASS_PERCENTAGE}%)`,     value: passCount,     sub: `of ${totalStudents} student${totalStudents !== 1 ? 's' : ''}` },
          { icon: Star,     label: `Distinction Badge (≥${AGILE_SCRUM_BADGE_PERCENTAGE}% 1st)`, value: badgeCount, sub: 'first-attempt distinction' },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="rounded-2xl p-4 border"
            style={{
              background:  'linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))',
              borderColor: 'rgba(5,150,105,0.18)',
            }}
          >
            <Icon size={18} style={{ color: '#059669', marginBottom: 6 }} />
            <p className="text-xl font-extrabold" style={{ color: '#065f46' }}>{value}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#065f46' }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Score distribution */}
      {totalStudents > 0 && (
        <div className="rounded-2xl p-4 border"
          style={{ background: 'rgba(255,255,255,0.6)', borderColor: 'rgba(5,150,105,0.15)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#065f46' }}>
            Score Distribution (best attempt per student)
          </p>
          <div className="flex items-end gap-3">
            {buckets.map((b, i) => (
              <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-xs font-bold" style={{ color: '#374151' }}>{bucketCounts[i]}</p>
                <div className="w-full rounded-t-lg transition-all"
                  style={{ height: Math.max(4, (bucketCounts[i] / maxBucket) * 80), background: b.color }} />
                <p className="text-xs" style={{ color: '#6b7280' }}>{b.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: '#6b7280' }}>
            <span>Pass threshold: &gt;{AGILE_SCRUM_PASS_PERCENTAGE}%</span>
            <span>·</span>
            <span>Distinction badge: ≥{AGILE_SCRUM_BADGE_PERCENTAGE}% on 1st attempt</span>
          </div>
        </div>
      )}

      {/* Student results table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(5,150,105,0.18)' }}>
        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(209,250,229,0.95), rgba(167,243,208,0.85))' }}>
          <p className="text-sm font-bold" style={{ color: '#065f46' }}>All Students</p>
          <input
            type="text"
            placeholder="Filter by name, ID, section…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="input-field text-xs py-1.5 w-full sm:w-56"
          />
        </div>

        {displayResults.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              {results.length === 0 ? 'No quiz submissions yet.' : 'No results match the filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(209,250,229,0.6)', borderBottom: '1px solid rgba(5,150,105,0.1)' }}>
                  {([
                    { k: 'name'     as SortKey, label: 'Student'      },
                    { k: 'score'    as SortKey, label: 'Best Score'   },
                    { k: 'attempts' as SortKey, label: 'Attempts'     },
                    { k: 'date'     as SortKey, label: 'Last Attempt' },
                  ]).map(({ k, label }) => (
                    <th key={k}
                      className="px-4 py-2 text-left"
                      style={{ color: '#065f46', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      onClick={() => toggleSort(k)}>
                      <span className="inline-flex items-center gap-1">{label} <SortIcon k={k} /></span>
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left"
                    style={{ color: '#065f46', fontSize: 11, fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayResults.map((r, i) => {
                  const pctColor  = r.bestPercentage > AGILE_SCRUM_PASS_PERCENTAGE
                    ? (r.bestPercentage >= AGILE_SCRUM_BADGE_PERCENTAGE ? '#059669' : '#d97706')
                    : '#dc2626';
                  const isExpanded = expandedStudent === r.studentUid;
                  return (
                    <>
                      <tr key={r.studentUid}
                        style={{
                          borderBottom: isExpanded ? 'none' : '1px solid rgba(5,150,105,0.07)',
                          background:   i % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(209,250,229,0.25)',
                          cursor:       'pointer',
                        }}
                        onClick={() => setExpandedStudent(isExpanded ? null : r.studentUid)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold" style={{ color: '#1e1b4b', fontSize: 13 }}>
                              {r.studentName}
                            </p>
                            {r.badgeEarned && (
                              <Star size={13} className="fill-amber-500 text-amber-500 stroke-0" />
                            )}
                          </div>
                          {r.studentDisplayId && (
                            <p style={{ color: '#9ca3af', fontSize: 11 }}>{r.studentDisplayId}</p>
                          )}
                          {(r.studentCampus || r.studentSection) && (
                            <p style={{ color: '#9ca3af', fontSize: 11 }}>
                              {[r.studentCampus, r.studentSection].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center font-bold text-xs px-2.5 py-1 rounded-full"
                            style={{
                              background: r.passed ? 'rgba(209,250,229,0.8)' : 'rgba(254,226,226,0.8)',
                              color:      pctColor,
                            }}>
                            {r.bestPercentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: '#6b7280', fontSize: 12 }}>
                          {r.attemptCount}/{AGILE_SCRUM_MAX_ATTEMPTS}
                        </td>
                        <td className="px-4 py-3" style={{ color: '#6b7280', fontSize: 12 }}>
                          {fmt(r.lastAttemptAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: r.passed ? 'rgba(209,250,229,0.7)' : 'rgba(254,226,226,0.7)',
                              color:      r.passed ? '#065f46'                : '#991b1b',
                            }}>
                            {r.passed ? 'Passed' : 'Not Passed'}
                          </span>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${r.studentUid}-expanded`}
                          style={{ borderBottom: '1px solid rgba(5,150,105,0.07)' }}>
                          <td colSpan={5} className="px-4 pb-3 pt-0"
                            style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(209,250,229,0.25)' }}>
                            <div className="rounded-xl overflow-hidden border"
                              style={{ borderColor: 'rgba(5,150,105,0.12)' }}>
                              <div className="px-3 py-2" style={{ background: 'rgba(209,250,229,0.8)' }}>
                                <p className="text-xs font-bold" style={{ color: '#065f46' }}>
                                  Attempt History
                                </p>
                              </div>
                              <div className="divide-y" style={{ borderColor: 'rgba(5,150,105,0.08)' }}>
                                {r.attempts.map((a, ai) => (
                                  <div key={ai} className="flex items-center justify-between px-3 py-2"
                                    style={{ background: 'rgba(255,255,255,0.7)' }}>
                                    <span className="text-xs" style={{ color: '#6b7280' }}>
                                      Attempt {ai + 1}
                                      {ai === 0 && r.badgeEarned && (
                                        <Star size={11} className="fill-amber-500 text-amber-500 stroke-0 inline ml-1" />
                                      )}
                                    </span>
                                    <span className="text-xs font-semibold" style={{
                                      color: a.percentage > AGILE_SCRUM_PASS_PERCENTAGE ? '#059669' : '#dc2626',
                                    }}>
                                      {a.score}/{a.total} ({a.percentage}%) · {fmt(a.completedAt)}
                                    </span>
                                  </div>
                                ))}
                              </div>
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
