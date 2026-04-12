import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';
import { CalendarCheck, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { AttendanceRecord, AbsenceNotice, AttendanceSession, AttendanceOverride } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';
import { summarizeStudentAttendance, summarizeStudentAttendanceByCourse } from '../../lib/attendanceSummary';
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
        const [attendanceSnap, absenceSnap, sessionsSnap, studentSnap] = await Promise.all([
          getDocs(
            query(
              collection(db, 'attendanceRecords'),
              where('studentUid', '==', user.uid),
            )
          ),
          getDocs(
            query(
              collection(db, 'absenceNotices'),
              where('studentUid', '==', user.uid),
            )
          ),
          getDocs(collection(db, 'attendanceSessions')),
          getDoc(doc(db, 'students', user.uid)),
        ]);
        const overrideSnap = await getDocs(query(collection(db, 'attendanceOverrides'), where('studentUid', '==', user.uid))).catch(() => null);
        setRecords(
          attendanceSnap.docs
            .map(d => {
              const r = d.data() as RawRecord;
              return { ...r, id: d.id, submittedAt: r.submittedAt?.toDate?.() ?? new Date() };
            })
            .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
        );
        setAbsences(absenceSnap.docs
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
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));

        const studentCourse = (studentSnap.data()?.course as string | undefined) || '';
        const studentSubjects = ((studentSnap.data()?.subjects as string[] | undefined) || []);
        const resolvedCourses = Array.from(new Set([...studentSubjects, studentCourse].map(v => v?.trim()).filter(Boolean))) as string[];
        setEnrolledCourses(resolvedCourses);
        setSessions(
          sessionsSnap.docs
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
        setOverrides((overrideSnap?.docs || []).map(d => {
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
  const courseSummaries = summarizeStudentAttendanceByCourse({ sessions, records, absences, enrolledCourses, overrides });
  const summaryCards = [
    { label: 'Attended days', value: summary.attendedDays, icon: <CalendarCheck size={16} />, tone: '#059669', bg: 'rgba(16,185,129,0.09)' },
    { label: 'Absent days', value: summary.absentUnjustifiedDays + summary.absentJustifiedDays, icon: <Clock size={16} />, tone: '#dc2626', bg: 'rgba(239,68,68,0.09)' },
  ].filter(card => card.value >= 0);

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <PageHeader
        title="My Attendance History"
        subtitle="Review your class attendance history"
      />

      {summaryCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 max-w-3xl">
          {summaryCards.map(card => (
            <div
              key={card.label}
              className="rounded-3xl px-4 py-4 animate-fadeIn"
              style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(139,92,246,0.10)' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: card.bg, color: card.tone }}>
                {card.icon}
              </div>
              <p className="text-2xl font-black" style={{ color: '#1e1b4b' }}>{card.value}</p>
              <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>{card.label}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm font-medium mb-5" style={{ color: '#6b7280' }}>
        Your attendance is recorded for each class checkpoint shown below.
      </p>

      {courseSummaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 max-w-4xl">
          {courseSummaries.map(courseSummary => (
            <div key={courseSummary.course} className="rounded-3xl px-4 py-4" style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(139,92,246,0.10)' }}>
              <p className="font-bold text-sm" style={{ color: '#1e1b4b' }}>{courseSummary.course}</p>
              <p className="text-xs mt-1" style={{ color: '#059669' }}>Attended: {courseSummary.attendedDays}</p>
              <p className="text-xs" style={{ color: '#dc2626' }}>Absent: {courseSummary.absentUnjustifiedDays + courseSummary.absentJustifiedDays}</p>
              <p className="text-[11px]" style={{ color: '#9ca3af' }}>Total sessions: {courseSummary.totalDays}</p>
            </div>
          ))}
        </div>
      )}

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

      {absences.length > 0 && (
        <div className="mt-6 max-w-2xl">
          <h3 className="font-bold text-sm mb-3" style={{ color: '#1e1b4b' }}>Submitted absence notices</h3>
          <div className="space-y-2">
            {absences.map(a => (
              <div
                key={a.id}
                className="rounded-2xl px-4 py-3 flex items-start justify-between gap-3"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(139,92,246,0.10)' }}
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: a.status === 'excused' ? '#2563eb' : '#dc2626' }}>
                    {a.status} · {a.reportDateKey}
                  </p>
                  <p className="text-sm font-medium mt-1" style={{ color: '#6b7280' }}>{a.reason}</p>
                </div>
                <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: '#9ca3af' }}>
                  {formatDateTime(a.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
