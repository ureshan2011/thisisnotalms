import type { UserRole } from './types';

export type EventLogType =
  | 'student_profile_created'
  | 'student_profile_updated'
  | 'student_photo_uploaded'
  | 'ta_account_created'
  | 'attendance_marked'
  | 'absence_reported'
  | 'user_login'
  | 'user_logout'
  | 'ui_feature_used';

interface LogEventInput {
  type: EventLogType;
  description: string;
  actorUid?: string;
  actorEmail?: string | null;
  actorRole?: UserRole | null;
  targetUid?: string;
  targetName?: string;
  feature?: string;
  durationSeconds?: number;
}

// Event logging is intentionally disabled to reduce Firebase usage.
export async function logEvent(_input: LogEventInput) {
  return;
}
