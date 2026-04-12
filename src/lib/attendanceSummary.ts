import type { AbsenceNotice, AttendanceOverride, AttendanceRecord, AttendanceSession } from './types';

export interface CourseAttendanceSummary {
  course: string;
  totalDays: number;
  attendedDays: number;
  absentUnjustifiedDays: number;
  absentJustifiedDays: number;
  overrideAttendedDelta: number;
  overrideAbsentUnjustifiedDelta: number;
  overrideAbsentJustifiedDelta: number;
}

export interface StudentAttendanceSummary {
  attendedDays: number;
  absentUnjustifiedDays: number;
  absentJustifiedDays: number;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizedCourse(value: string | undefined): string {
  return (value || '').trim();
}

export function summarizeStudentAttendanceByCourse(params: {
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
  absences: AbsenceNotice[];
  enrolledCourses?: string[];
  overrides?: AttendanceOverride[];
}): CourseAttendanceSummary[] {
  const { sessions, records, absences, enrolledCourses = [], overrides = [] } = params;

  const recordsBySession = new Map<string, AttendanceRecord[]>();
  records.forEach(record => {
    const list = recordsBySession.get(record.sessionId) || [];
    list.push(record);
    recordsBySession.set(record.sessionId, list);
  });

  const absencesByDate = new Map<string, AbsenceNotice[]>();
  absences.forEach(absence => {
    const list = absencesByDate.get(absence.reportDateKey) || [];
    list.push(absence);
    absencesByDate.set(absence.reportDateKey, list);
  });

  const overrideByCourse = new Map<string, AttendanceOverride>();
  overrides.forEach(override => {
    overrideByCourse.set(normalizedCourse(override.course), override);
  });

  const summaryByCourse = new Map<string, CourseAttendanceSummary>();

  const ensureCourse = (course: string): CourseAttendanceSummary => {
    const normalized = normalizedCourse(course);
    const existing = summaryByCourse.get(normalized);
    if (existing) return existing;
    const withOverrides = overrideByCourse.get(normalized);
    const created: CourseAttendanceSummary = {
      course: normalized,
      totalDays: 0,
      attendedDays: Math.max(0, withOverrides?.attendedDelta || 0),
      absentUnjustifiedDays: Math.max(0, withOverrides?.absentUnjustifiedDelta || 0),
      absentJustifiedDays: Math.max(0, withOverrides?.absentJustifiedDelta || 0),
      overrideAttendedDelta: withOverrides?.attendedDelta || 0,
      overrideAbsentUnjustifiedDelta: withOverrides?.absentUnjustifiedDelta || 0,
      overrideAbsentJustifiedDelta: withOverrides?.absentJustifiedDelta || 0,
    };
    summaryByCourse.set(normalized, created);
    return created;
  };

  enrolledCourses
    .map(normalizedCourse)
    .filter(Boolean)
    .forEach(ensureCourse);

  sessions.forEach(session => {
    if (session.status !== 'closed') return;
    const course = normalizedCourse(session.course) || 'Unassigned course';
    const entry = ensureCourse(course);
    entry.totalDays += 1;

    const sessionRecords = recordsBySession.get(session.id) || [];
    if (sessionRecords.length > 0) {
      entry.attendedDays += 1;
      return;
    }

    const dateKey = toDateKey(session.date);
    const dayAbsences = absencesByDate.get(dateKey) || [];
    const hasExcusedAbsence = dayAbsences.some(absence => {
      const absenceCourse = normalizedCourse(absence.sessionCourse);
      return absence.status === 'excused' && (!absenceCourse || absenceCourse === course);
    });

    if (hasExcusedAbsence) {
      entry.absentJustifiedDays += 1;
    } else {
      entry.absentUnjustifiedDays += 1;
    }
  });

  return [...summaryByCourse.values()]
    .map(summary => ({
      ...summary,
      attendedDays: Math.max(0, summary.attendedDays),
      absentUnjustifiedDays: Math.max(0, summary.absentUnjustifiedDays),
      absentJustifiedDays: Math.max(0, summary.absentJustifiedDays),
    }))
    .sort((a, b) => a.course.localeCompare(b.course));
}

export function summarizeStudentAttendance(params: {
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
  absences: AbsenceNotice[];
  enrolledCourses?: string[];
  overrides?: AttendanceOverride[];
}): StudentAttendanceSummary {
  const byCourse = summarizeStudentAttendanceByCourse(params);

  return byCourse.reduce<StudentAttendanceSummary>((acc, item) => {
    acc.attendedDays += item.attendedDays;
    acc.absentUnjustifiedDays += item.absentUnjustifiedDays;
    acc.absentJustifiedDays += item.absentJustifiedDays;
    return acc;
  }, {
    attendedDays: 0,
    absentUnjustifiedDays: 0,
    absentJustifiedDays: 0,
  });
}
