export type UserRole = 'student' | 'lecturer' | 'teachingAssistant';

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
  course: string;
  homeCountry: string;
  hometown: string;
  hometownLat: number | null;
  hometownLng: number | null;
  workExperience: string;
  workIndustry?: string;
  educationalBackground: string;
  specialNeeds: string;
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
