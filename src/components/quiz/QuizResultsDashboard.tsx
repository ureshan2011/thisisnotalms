import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Users, Award, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../../lib/firebase';
import { MBI802_QUIZ_TITLE } from '../../lib/mbi802QuizData';

interface QuizResult {
  id: string;
  studentUid: string;
  studentName: string;
  studentDisplayId: string;
  studentSection: string;
  studentCampus: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: Date;
}

type SortKey = 'name' | 'score' | 'date';
type SortDir = 'asc' | 'desc';

function fmt(d: Date) {
  return d.toLocaleString('en-NZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function QuizResultsDashboard() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'mbi802QuizResults'),
      orderBy('completedAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const rows: QuizResult[] = snap.docs.map((d) => ({
        id: d.id,
        studentUid: d.data().studentUid ?? '',
        studentName: d.data().studentName ?? 'Unknown',
        studentDisplayId: d.data().studentDisplayId ?? '',
        studentSection: d.data().studentSection ?? '',
        studentCampus: d.data().studentCampus ?? '',
        score: d.data().score ?? 0,
        total: d.data().total ?? 0,
        percentage: d.data().percentage ?? 0,
        completedAt: d.data().completedAt?.toDate() ?? new Date(),
      }));
      setResults(rows);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Summary stats — best attempt per student
  const byStudent = results.reduce<Record<string, QuizResult[]>>((acc, r) => {
    (acc[r.studentUid] = acc[r.studentUid] ?? []).push(r);
    return acc;
  }, {});

  const uniqueStudents = Object.values(byStudent);
  const bestScores = uniqueStudents.map(
    (attempts) => attempts.reduce((best, a) => (a.percentage > best.percentage ? a : best))
  );

  const totalAttempts = results.length;
  const totalStudents = uniqueStudents.length;
  const avgPct =
    bestScores.length > 0
      ? Math.round(bestScores.reduce((s, r) => s + r.percentage, 0) / bestScores.length)
      : 0;
  const passCount = bestScores.filter((r) => r.percentage >= 60).length;

  // Score distribution buckets
  const buckets = [
    { label: '0–39%', min: 0, max: 39, color: '#fca5a5' },
    { label: '40–59%', min: 40, max: 59, color: '#fcd34d' },
    { label: '60–79%', min: 60, max: 79, color: '#6ee7b7' },
    { label: '80–100%', min: 80, max: 100, color: '#818cf8' },
  ];

  const bucketCounts = buckets.map(
    (b) => bestScores.filter((r) => r.percentage >= b.min && r.percentage <= b.max).length
  );
  const maxBucket = Math.max(...bucketCounts, 1);

  // Sorting + filtering for the all-attempts table
  const filtered = results.filter((r) => {
    const t = filterText.toLowerCase();
    return (
      !t ||
      r.studentName.toLowerCase().includes(t) ||
      r.studentDisplayId.toLowerCase().includes(t) ||
      r.studentSection.toLowerCase().includes(t) ||
      r.studentCampus.toLowerCase().includes(t)
    );
  });

  function sortedResults(rows: QuizResult[]) {
    return [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.studentName.localeCompare(b.studentName);
      else if (sortKey === 'score') cmp = a.percentage - b.percentage;
      else cmp = a.completedAt.getTime() - b.completedAt.getTime();
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

  const displayResults = sortedResults(filtered);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div
          className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#7c3aed' }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b5cf6' }}>
        Student Results — {MBI802_QUIZ_TITLE}
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Students Attempted', value: totalStudents, sub: `${totalAttempts} total attempt${totalAttempts !== 1 ? 's' : ''}` },
          { icon: BarChart2, label: 'Average Score (Best)', value: `${avgPct}%`, sub: 'across unique students' },
          { icon: Award, label: 'Passed (≥60%)', value: passCount, sub: `of ${totalStudents} student${totalStudents !== 1 ? 's' : ''}` },
          { icon: Award, label: 'Pass Rate', value: totalStudents > 0 ? `${Math.round((passCount / totalStudents) * 100)}%` : '—', sub: 'based on best attempt' },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div
            key={label}
            className="rounded-2xl p-4 border"
            style={{
              background: 'linear-gradient(135deg, rgba(245,243,255,0.9), rgba(237,233,254,0.7))',
              borderColor: 'rgba(139,92,246,0.18)',
            }}
          >
            <Icon size={18} style={{ color: '#7c3aed', marginBottom: 6 }} />
            <p className="text-xl font-extrabold" style={{ color: '#1e1b4b' }}>{value}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#4c1d95' }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Score distribution chart */}
      {totalStudents > 0 && (
        <div
          className="rounded-2xl p-4 border"
          style={{
            background: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(139,92,246,0.15)',
          }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: '#4c1d95' }}>
            Score Distribution (best attempt per student)
          </p>
          <div className="flex items-end gap-3">
            {buckets.map((b, i) => (
              <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-xs font-bold" style={{ color: '#374151' }}>{bucketCounts[i]}</p>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: Math.max(4, (bucketCounts[i] / maxBucket) * 80),
                    background: b.color,
                  }}
                />
                <p className="text-xs" style={{ color: '#6b7280' }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student best-score summary */}
      {bestScores.length > 0 && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: 'rgba(139,92,246,0.18)' }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.85))' }}
          >
            <p className="text-sm font-bold" style={{ color: '#4c1d95' }}>
              Best Score per Student
            </p>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(167,139,250,0.2)', color: '#6d28d9' }}
            >
              {bestScores.length} student{bestScores.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(245,243,255,0.6)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                  {(['name', 'score', 'date'] as SortKey[]).map((k) => (
                    <th
                      key={k}
                      className="px-4 py-2 text-left"
                      style={{ color: '#5b21b6', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      onClick={() => toggleSort(k)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {k === 'name' ? 'Student' : k === 'score' ? 'Best Score' : 'Last Attempt'}
                        <SortIcon k={k} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left" style={{ color: '#5b21b6', fontSize: 11, fontWeight: 700 }}>
                    Campus / Section
                  </th>
                  <th className="px-4 py-2 text-left" style={{ color: '#5b21b6', fontSize: 11, fontWeight: 700 }}>
                    Attempts
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedResults(bestScores).map((r) => {
                  const attempts = byStudent[r.studentUid]?.length ?? 1;
                  const pctColor = r.percentage >= 80 ? '#059669' : r.percentage >= 60 ? '#d97706' : '#dc2626';
                  return (
                    <tr
                      key={r.studentUid}
                      style={{ borderBottom: '1px solid rgba(139,92,246,0.07)', cursor: 'pointer' }}
                      onClick={() =>
                        setExpandedStudent(expandedStudent === r.studentUid ? null : r.studentUid)
                      }
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: '#1e1b4b', fontSize: 13 }}>
                          {r.studentName}
                        </p>
                        {r.studentDisplayId && (
                          <p style={{ color: '#9ca3af', fontSize: 11 }}>{r.studentDisplayId}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: r.percentage >= 60 ? 'rgba(209,250,229,0.8)' : 'rgba(254,226,226,0.8)',
                            color: pctColor,
                          }}
                        >
                          {r.score}/{r.total} ({r.percentage}%)
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: '#6b7280', fontSize: 12 }}>
                        {fmt(r.completedAt)}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#6b7280', fontSize: 12 }}>
                        {[r.studentCampus, r.studentSection].filter(Boolean).join(' · ') || '—'}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#6b7280', fontSize: 12 }}>
                        {attempts}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All attempts table with search */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: 'rgba(139,92,246,0.18)' }}
      >
        <div
          className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.85))' }}
        >
          <p className="text-sm font-bold" style={{ color: '#4c1d95' }}>All Attempts</p>
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
                <tr style={{ background: 'rgba(245,243,255,0.6)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                  {(['name', 'score', 'date'] as SortKey[]).map((k) => (
                    <th
                      key={k}
                      className="px-4 py-2 text-left"
                      style={{ color: '#5b21b6', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      onClick={() => toggleSort(k)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {k === 'name' ? 'Student' : k === 'score' ? 'Score' : 'Submitted'}
                        <SortIcon k={k} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left" style={{ color: '#5b21b6', fontSize: 11, fontWeight: 700 }}>
                    Campus / Section
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayResults.map((r, i) => {
                  const pctColor = r.percentage >= 80 ? '#059669' : r.percentage >= 60 ? '#d97706' : '#dc2626';
                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: '1px solid rgba(139,92,246,0.07)',
                        background: i % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(245,243,255,0.4)',
                      }}
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: '#1e1b4b', fontSize: 13 }}>
                          {r.studentName}
                        </p>
                        {r.studentDisplayId && (
                          <p style={{ color: '#9ca3af', fontSize: 11 }}>{r.studentDisplayId}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: r.percentage >= 60 ? 'rgba(209,250,229,0.8)' : 'rgba(254,226,226,0.8)',
                            color: pctColor,
                          }}
                        >
                          {r.score}/{r.total} ({r.percentage}%)
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: '#6b7280', fontSize: 12 }}>
                        {fmt(r.completedAt)}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#6b7280', fontSize: 12 }}>
                        {[r.studentCampus, r.studentSection].filter(Boolean).join(' · ') || '—'}
                      </td>
                    </tr>
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
