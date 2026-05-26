import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Award, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { SQL_EXAM_COLLECTION, SQL_EXAM_PASS_PERCENTAGE } from '../../lib/sqlExamData';
import { format } from 'date-fns';

interface ExamResult {
  studentUid: string;
  studentName: string;
  studentDisplayId: string;
  studentSection: string;
  studentCampus: string;
  bestPercentage: number;
  passed: boolean;
  certificateId: string | null;
  attemptCount: number;
  lastAttemptAt: Date;
}

export default function SQLExamDashboard() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<'name' | 'score' | 'date'>('score');

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, SQL_EXAM_COLLECTION), orderBy('lastAttemptAt', 'desc'))
        );
        setResults(snap.docs.map((d) => {
          const data = d.data();
          return {
            studentUid: d.id,
            studentName: data.studentName ?? '',
            studentDisplayId: data.studentDisplayId ?? '',
            studentSection: data.studentSection ?? '',
            studentCampus: data.studentCampus ?? '',
            bestPercentage: data.bestPercentage ?? 0,
            passed: data.passed ?? false,
            certificateId: data.certificateId ?? null,
            attemptCount: data.attemptCount ?? 1,
            lastAttemptAt: data.lastAttemptAt?.toDate?.() ?? new Date(),
          };
        }));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted = [...results].sort((a, b) => {
    if (sortKey === 'score') return b.bestPercentage - a.bestPercentage;
    if (sortKey === 'name') return a.studentName.localeCompare(b.studentName);
    return b.lastAttemptAt.getTime() - a.lastAttemptAt.getTime();
  });

  const passCount = results.filter((r) => r.passed).length;
  const certCount = results.filter((r) => r.certificateId).length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.bestPercentage, 0) / results.length)
    : 0;

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Users size={18} />, label: 'Attempted', value: results.length, color: '#4338ca' },
          { icon: <CheckCircle2 size={18} />, label: 'Passed', value: passCount, color: '#059669' },
          { icon: <Award size={18} />, label: 'Certificates', value: certCount, color: '#b45309' },
          { icon: <TrendingUp size={18} />, label: 'Avg Score', value: `${avgScore}%`, color: '#0284c7' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl p-4 border text-center"
            style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(99,102,241,0.15)' }}>
            <div style={{ color: stat.color, display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold" style={{ color: '#1e1b4b' }}>{stat.value}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2 flex-wrap">
        {(['score', 'name', 'date'] as const).map((k) => (
          <button key={k} onClick={() => setSortKey(k)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold border transition-all"
            style={{
              background: sortKey === k ? '#4f46e5' : 'transparent',
              color: sortKey === k ? '#fff' : '#4338ca',
              borderColor: sortKey === k ? '#4f46e5' : 'rgba(99,102,241,0.3)',
            }}>
            Sort: {k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 animate-spin"
            style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
        </div>
      ) : results.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: '#6b7280' }}>
          No exam attempts yet.
        </p>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg,rgba(238,242,255,0.9),rgba(224,231,255,0.8))' }}>
                  {['Student', 'ID', 'Section', 'Best Score', 'Attempts', 'Certificate', 'Last Attempt'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold" style={{ color: '#312e81' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr key={r.studentUid}
                    className="border-t"
                    style={{
                      borderColor: 'rgba(99,102,241,0.08)',
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(238,242,255,0.3)',
                    }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: '#1e1b4b' }}>{r.studentName}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: '#6b7280' }}>{r.studentDisplayId}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#6b7280' }}>{r.studentSection}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: r.passed ? 'rgba(209,250,229,0.8)' : 'rgba(254,226,226,0.8)',
                          color: r.passed ? '#065f46' : '#991b1b',
                        }}>
                        {r.bestPercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs" style={{ color: '#6b7280' }}>
                      {r.attemptCount}
                    </td>
                    <td className="px-4 py-3">
                      {r.certificateId ? (
                        <span className="flex items-center gap-1 text-xs font-semibold"
                          style={{ color: '#b45309' }}>
                          <Award size={13} /> Issued
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: '#9ca3af' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#6b7280' }}>
                      {format(r.lastAttemptAt, 'dd MMM yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
