import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { CalendarCheck, Clock, BookOpen } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { AttendanceRecord } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';

type RawRecord = Omit<AttendanceRecord, 'submittedAt'> & { submittedAt: Timestamp };

export default function StudentHistory() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDocs(
        query(
          collection(db, 'attendanceRecords'),
          where('studentUid', '==', user.uid),
          orderBy('submittedAt', 'desc'),
        )
      );
      setRecords(
        snap.docs.map(d => {
          const r = d.data() as RawRecord;
          return { ...r, id: d.id, submittedAt: r.submittedAt?.toDate?.() ?? new Date() };
        })
      );
      setLoading(false);
    })();
  }, [user]);

  // Group by session
  const bySession: Record<string, AttendanceRecord[]> = {};
  for (const r of records) {
    (bySession[r.sessionId] = bySession[r.sessionId] || []).push(r);
  }

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <PageHeader
        title="My Attendance History"
        subtitle={`${records.length} attendance record${records.length !== 1 ? 's' : ''}`}
      />

      {records.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100 p-4 rounded-2xl">
              <CalendarCheck size={32} className="text-slate-400" />
            </div>
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">No attendance records yet</h3>
          <p className="text-sm text-slate-400">Your submissions will appear here after your first class.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {Object.entries(bySession).map(([sessionId, recs]) => {
            const first = recs[0];
            return (
              <div key={sessionId} className="card p-5 animate-fadeIn">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-brand-100 text-brand-600 p-2.5 rounded-xl">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{first.sessionTitle}</h3>
                    <p className="text-xs text-slate-500">{first.sessionCourse}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {recs.map(r => (
                    <div key={r.id} className="flex items-center justify-between px-3 py-2.5 bg-emerald-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CalendarCheck size={15} className="text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">{r.checkpointLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                        <Clock size={12} />
                        {formatDateTime(r.submittedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
