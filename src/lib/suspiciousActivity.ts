import type { AttendanceRecord } from './types';
import { haversineDistance, formatDistance } from './locationUtils';

export type SuspiciousType = 'shared_ip' | 'location_outlier' | 'rapid_submission';

export interface SuspiciousFlag {
  id: string;
  type: SuspiciousType;
  severity: 'medium' | 'high';
  affectedStudents: { uid: string; name: string; displayId: string }[];
  checkpointLabel?: string;
  ipAddress?: string;
  description: string;
  distanceMeters?: number;
  timeDiffSeconds?: number;
  recordIds: string[];
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function detectSuspiciousActivity(records: AttendanceRecord[]): SuspiciousFlag[] {
  const flags: SuspiciousFlag[] = [];
  let counter = 0;
  const nextId = () => `sflag-${++counter}`;

  // Group by checkpointId
  const byCheckpoint: Record<string, AttendanceRecord[]> = {};
  for (const r of records) {
    (byCheckpoint[r.checkpointId] ??= []).push(r);
  }

  // Track already-flagged (ip:checkpointLabel) pairs to avoid duplicate rapid-submission flags
  const sharedIpCpKeys = new Set<string>();

  // ── 1. Shared IP within same checkpoint (HIGH) ────────────────
  for (const cpRecords of Object.values(byCheckpoint)) {
    const totalStudents = new Set(cpRecords.map(r => r.studentUid)).size;
    const byIp: Record<string, AttendanceRecord[]> = {};
    for (const r of cpRecords) {
      const ip = r.location?.ipAddress;
      if (ip) (byIp[ip] ??= []).push(r);
    }
    for (const [ip, ipRecs] of Object.entries(byIp)) {
      const byStudent = new Map(ipRecs.map(r => [r.studentUid, r]));
      if (byStudent.size < 2) continue;
      // If this IP covers >40 % of the class it's most likely campus Wi-Fi – skip
      if (totalStudents > 0 && byStudent.size / totalStudents > 0.40) continue;
      const key = `${ip}:${ipRecs[0].checkpointLabel}`;
      sharedIpCpKeys.add(key);
      flags.push({
        id: nextId(),
        type: 'shared_ip',
        severity: 'high',
        affectedStudents: [...byStudent.values()].map(r => ({
          uid: r.studentUid,
          name: r.studentName,
          displayId: r.studentDisplayId,
        })),
        checkpointLabel: ipRecs[0].checkpointLabel,
        ipAddress: ip,
        description:
          `${byStudent.size} students submitted from the same IP address (${ip}) ` +
          `during "${ipRecs[0].checkpointLabel}" ` +
          `(${byStudent.size} of ${totalStudents} in this checkpoint). ` +
          `This may indicate credential sharing or a proxy.`,
        recordIds: [...byStudent.values()].map(r => r.id),
      });
    }
  }

  // ── 2. Location outlier per checkpoint (MEDIUM) ───────────────
  for (const cpRecords of Object.values(byCheckpoint)) {
    const gpsRecs = cpRecords.filter(
      r =>
        r.location?.locationStatus === 'captured' &&
        r.location.latitude != null &&
        r.location.longitude != null,
    );
    if (gpsRecs.length < 3) continue; // need a meaningful cluster
    const medLat = median(gpsRecs.map(r => r.location!.latitude!));
    const medLon = median(gpsRecs.map(r => r.location!.longitude!));
    for (const r of gpsRecs) {
      const dist = haversineDistance(
        medLat, medLon,
        r.location!.latitude!, r.location!.longitude!,
      );
      if (dist > 500) {
        flags.push({
          id: nextId(),
          type: 'location_outlier',
          severity: 'medium',
          affectedStudents: [
            { uid: r.studentUid, name: r.studentName, displayId: r.studentDisplayId },
          ],
          checkpointLabel: r.checkpointLabel,
          description:
            `${r.studentName} submitted from ${formatDistance(dist)} away from the ` +
            `class location cluster during "${r.checkpointLabel}".`,
          distanceMeters: Math.round(dist),
          recordIds: [r.id],
        });
      }
    }
  }

  // ── 3. Rapid sequential submissions from same IP, different students (MEDIUM) ──
  const withIp = records
    .filter(r => !!r.location?.ipAddress)
    .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime());

  for (let i = 0; i < withIp.length - 1; i++) {
    const a = withIp[i];
    const b = withIp[i + 1];
    if (
      a.location?.ipAddress !== b.location?.ipAddress ||
      a.studentUid === b.studentUid
    )
      continue;
    const diffMs = b.submittedAt.getTime() - a.submittedAt.getTime();
    if (diffMs > 30_000) continue;
    const ip = a.location!.ipAddress!;
    if (
      sharedIpCpKeys.has(`${ip}:${a.checkpointLabel}`) ||
      sharedIpCpKeys.has(`${ip}:${b.checkpointLabel}`)
    )
      continue;
    flags.push({
      id: nextId(),
      type: 'rapid_submission',
      severity: 'medium',
      affectedStudents: [
        { uid: a.studentUid, name: a.studentName, displayId: a.studentDisplayId },
        { uid: b.studentUid, name: b.studentName, displayId: b.studentDisplayId },
      ],
      ipAddress: ip,
      description:
        `${a.studentName} and ${b.studentName} submitted from the same IP (${ip}) ` +
        `just ${Math.round(diffMs / 1000)}s apart — possible credential sharing.`,
      timeDiffSeconds: Math.round(diffMs / 1000),
      recordIds: [a.id, b.id],
    });
  }

  return flags;
}

export function getFlaggedStudentUids(flags: SuspiciousFlag[]): Set<string> {
  const uids = new Set<string>();
  for (const f of flags) for (const s of f.affectedStudents) uids.add(s.uid);
  return uids;
}
