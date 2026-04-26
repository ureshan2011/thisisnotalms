import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';
import { CalendarCheck, Clock, BookOpen, CheckCircle, Info } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { AttendanceRecord, AbsenceNotice, AttendanceSession, AttendanceOverride } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';
import { summarizeStudentAttendance } from '../../lib/attendanceSummary';
import { useFeatureTracking } from '../../lib/useFeatureTracking';

type RawRecord = Omit<AttendanceRecord, 'submittedAt'> & { submittedAt: Timestamp };
type RawSession = Omit<AttendanceSession, 'date' | 'createdAt'> & { date: Timestamp; createdAt: Timestamp };

export default function StudentHistory() {
  const { user } = useAuth();
  useFeatureTracking('Student History');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [absences, setAbsences] = useState<AbsenceNotice[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [overrides, setOverrides] = useState<AttendanceOverride[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Fetch all five sources in parallel; allSettled prevents an overrides
        // permission error from blanking out the records and sessions data.
        const [attendanceResult, absenceResult, sessionsResult, studentResult, overridesResult] =
          await Promise.allSettled([
            getDocs(query(collection(db, 'attendanceRecords'), where('studentUid', '==', user.uid))),
            getDocs(query(collection(db, 'absenceNotices'), where('studentUid', '==', user.uid))),
            getDocs(collection(db, 'attendanceSessions')),
            getDoc(doc(db, 'students', user.uid)),
            getDocs(query(collection(db, 'attendanceOverrides'), where('studentUid', '==', user.uid))),
          ]);

        if (attendanceResult.status === 'fulfilled') {
          setRecords(
            attendanceResult.value.docs
              .map(d => {
                const r = d.data() as RawRecord;
                return { ...r, id: d.id, submittedAt: r.submittedAt?.toDate?.() ?? new Date() };
              })
              .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
          );
        }

        if (absenceResult.status === 'fulfilled') {
          setAbsences(
            absenceResult.value.docs
              .map(d => {
                const a = d.data() as Record<string, unknown>;
                return {
                  ...a,
                  id: d.id,
                  reportDateKey: (a.reportDateKey as string) || '',
                  status: ((a.status as 'absent' | 'excused') || 'absent'),
                  reason: (a.reason as string) || '',
                  createdAt: (a.createdAt as Timestamp)?.toDate?.() ?? new Date(),
                } as AbsenceNotice;
              })
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          );
        }

        const studentSnap = studentResult.status === 'fulfilled' ? studentResult.value : null;
        const studentSubjects = ((studentSnap?.data()?.subjects as string[] | undefined) || []);
        const resolvedCourses = Array.from(new Set(studentSubjects.map(v => v?.trim()).filter(Boolean))) as string[];
        setEnrolledCourses(resolvedCourses);

        if (sessionsResult.status === 'fulfilled') {
          setSessions(
            sessionsResult.value.docs
              .map(d => {
                const s = d.data() as RawSession;
                return {
                  ...s,
                  id: d.id,
                  date: s.date?.toDate?.() ?? new Date(),
                  createdAt: s.createdAt?.toDate?.() ?? new Date(),
                } as AttendanceSession;
              })
              .filter(s => s.status === 'closed')
              .filter(s => resolvedCourses.length === 0 || resolvedCourses.includes(s.course))
          );
        }

        if (overridesResult.status === 'fulfilled') {
          setOverrides(overridesResult.value.docs.map(d => {
            const o = d.data() as Record<string, unknown>;
            return {
              id: d.id,
              studentUid: (o.studentUid as string) || user.uid,
              course: (o.course as string) || '',
              attendedDelta: Number(o.attendedDelta || 0),
              absentUnjustifiedDelta: Number(o.absentUnjustifiedDelta || 0),
              absentJustifiedDelta: Number(o.absentJustifiedDelta || 0),
              reason: (o.reason as string) || '',
              updatedByUid: (o.updatedByUid as string) || '',
              updatedByEmail: (o.updatedByEmail as string) || '',
              updatedAt: (o.updatedAt as Timestamp)?.toDate?.() ?? new Date(),
            } as AttendanceOverride;
          }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const bySession: Record<string, AttendanceRecord[]> = {};
  for (const r of records) {
    (bySession[r.sessionId] = bySession[r.sessionId] || []).push(r);
  }
  const summary = summarizeStudentAttendance({ sessions, records, absences, enrolledCourses, overrides });

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <PageHeader
        title="My Attendance History"
        subtitle="Review your class attendance history"
      />

      <div
        className="rounded-3xl px-4 py-4 mb-4 animate-fadeIn max-w-xs"
        style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(139,92,246,0.10)' }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(16,185,129,0.09)', color: '#059669' }}>
          <CalendarCheck size={16} />
        </div>
        <p className="text-2xl font-black" style={{ color: '#1e1b4b' }}>{summary.attendedDays}</p>
        <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Days You Have Marked Attendance through Yoobees</p>
      </div>

      <div
        className="flex items-start gap-3 rounded-2xl px-4 py-3 mb-5 max-w-2xl"
        style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}
      >
        <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
        <p className="text-xs font-medium leading-relaxed" style={{ color: '#4c1d95' }}>
          Yoobees is a tool to support students and to keep students engaged. The final attendance will be recorded in the Yoobee Official Internal system.
        </p>
      </div>

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
                      Submitted
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
