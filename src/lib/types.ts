import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'student' | 'lecturer' | 'teachingAssistant';

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: 'general' | 'urgent' | 'auckland' | 'christchurch';
  pinned: boolean;
  authorUid: string;
  authorName: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserRecord {
  uid: string;
  role: UserRole;
  email: string;
  createdAt: Date;
}

export interface StudentProfile {
  uid: string;
  fullName: string;
  studentId: string;
  email: string;
  campus: 'Auckland' | 'Christchurch' | '';
  section: string;
  intake: '2511' | '2604' | '';
  subjects: string[];
  course: string;
  homeCountry: string;
  hometown: string;
  hometownLat: number | null;
  hometownLng: number | null;
  workExperience: string;
  workIndustry?: string;
  educationalBackground: string;
  specialNeeds: string;
  photoURL?: string;
  erMcqBadge?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceCheckpoint {
  id: string;
  label: string;       // "Opening" | "Mid-session" | custom
  code: string;
  startTime: Date;
  expiresAt: Date;
  isActive: boolean;
  windowMinutes: number;
}

export interface AttendanceSession {
  id: string;
  title: string;
  course: string;
  date: Date;
  lecturerId: string;
  checkpoints: AttendanceCheckpoint[];
  status: 'active' | 'closed';
  createdAt: Date;
}

export interface AttendanceLocationData {
  locationStatus: 'captured' | 'denied' | 'unavailable' | 'timeout';
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  timezone?: string;
  language?: string;
  screenResolution?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  sessionCourse: string;
  studentUid: string;
  studentName: string;
  studentDisplayId: string;
  studentCampus?: string;
  studentSection?: string;
  checkpointId: string;
  checkpointLabel: string;
  submittedAt: Date;
  location?: AttendanceLocationData;
}

export interface AbsenceNotice {
  id: string;
  studentUid: string;
  studentName: string;
  studentDisplayId: string;
  studentCampus?: string;
  studentSection?: string;
  sessionCourse?: string;
  reportDateKey: string; // YYYY-MM-DD
  status: 'absent' | 'excused';
  reason: string;
  createdAt: Date;
}

export interface AttendanceOverride {
  id: string;
  studentUid: string;
  course: string;
  attendedDelta: number;
  absentUnjustifiedDelta: number;
  absentJustifiedDelta: number;
  reason: string;
  updatedByUid: string;
  updatedByEmail?: string;
  updatedAt: Date;
}
