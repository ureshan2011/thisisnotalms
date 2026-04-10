import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { CalendarCheck, Clock, BookOpen, CheckCircle } from 'lucide-react';
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
        <div
          className="p-16 rounded-3xl flex flex-col items-center gap-4 text-center animate-fadeIn"
          style={{
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(139,92,246,0.10)',
            boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
          }}
        >
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.05))' }}
          >
            <CalendarCheck size={28} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: '#1e1b4b' }}>No records yet</h3>
            <p className="text-sm font-medium mt-1" style={{ color: '#9ca3af' }}>
              Your attendance submissions will appear here after your first class.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {Object.entries(bySession).map(([sessionId, recs], i) => {
            const first = recs[0];
            return (
              <div
                key={sessionId}
                className="rounded-3xl p-5 animate-fadeIn"
                style={{
                  background: 'rgba(255,255,255,0.90)',
                  border: '1px solid rgba(139,92,246,0.10)',
                  boxShadow: '0 2px 12px rgba(124,106,247,0.06)',
                  animationDelay: `${i * 0.04}s`,
                }}
              >
                {/* Session header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
                  >
                    <BookOpen size={18} color="white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>{first.sessionTitle}</h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: '#9ca3af' }}>{first.sessionCourse}</p>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(16,185,129,0.10)', color: '#059669' }}
                    >
                      <CheckCircle size={11} />
                      {recs.length} checkpoint{recs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Checkpoints */}
                <div className="space-y-2">
                  {recs.map(r => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(45,212,191,0.04))',
                        border: '1px solid rgba(16,185,129,0.12)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(16,185,129,0.12)' }}
                        >
                          <CalendarCheck size={14} style={{ color: '#059669' }} />
                        </div>
                        <span className="text-sm font-semibold" style={{ color: '#065f46' }}>
                          {r.checkpointLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#6ee7b7' }}>
                        <Clock size={12} style={{ color: '#34d399' }} />
                        <span style={{ color: '#059669' }}>{formatDateTime(r.submittedAt)}</span>
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
