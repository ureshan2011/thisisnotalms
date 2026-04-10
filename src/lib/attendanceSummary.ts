import type { AbsenceNotice, AttendanceRecord, AttendanceSession } from './types';

export interface StudentAttendanceSummary {
  attendedDays: number;
  absentUnjustifiedDays: number;
  absentJustifiedDays: number;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function summarizeStudentAttendance(params: {
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
  absences: AbsenceNotice[];
}): StudentAttendanceSummary {
  const { sessions, records, absences } = params;

  const absenceByDate = new Set(absences.map(a => a.reportDateKey).filter(Boolean));

  const recordsBySession: Record<string, AttendanceRecord[]> = {};
  records.forEach(record => {
    (recordsBySession[record.sessionId] = recordsBySession[record.sessionId] || []).push(record);
  });

  let attendedDays = 0;
  let absentUnjustifiedDays = 0;
  let absentJustifiedDays = 0;

  sessions.forEach(session => {
    const sessionRecords = recordsBySession[session.id] || [];
    const uniqueCheckpointIds = new Set(sessionRecords.map(r => r.checkpointId).filter(Boolean));
    const hasOpeningCheckpoint = sessionRecords.some(r => r.checkpointLabel?.trim().toLowerCase() === 'opening');
    const metAttendanceThreshold = hasOpeningCheckpoint && uniqueCheckpointIds.size >= 2;

    if (metAttendanceThreshold) {
      attendedDays += 1;
      return;
    }

    const sessionDateKey = toDateKey(session.date);
    if (absenceByDate.has(sessionDateKey)) {
      absentJustifiedDays += 1;
    } else {
      absentUnjustifiedDays += 1;
    }
  });

  return {
    attendedDays,
    absentUnjustifiedDays,
    absentJustifiedDays,
  };
}
