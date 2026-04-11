import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
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

export async function logEvent(input: LogEventInput) {
  await addDoc(collection(db, 'eventLogs'), {
    type: input.type,
    description: input.description,
    actorUid: input.actorUid ?? null,
    actorEmail: input.actorEmail ?? null,
    actorRole: input.actorRole ?? null,
    targetUid: input.targetUid ?? null,
    targetName: input.targetName ?? null,
    feature: input.feature ?? null,
    durationSeconds: input.durationSeconds ?? null,
    createdAt: serverTimestamp(),
  });
}
