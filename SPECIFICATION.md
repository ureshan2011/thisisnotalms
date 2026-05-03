# YooBees — Software Specification Document

**Version:** 1.0  
**Date:** 2026-05-03  
**Status:** Current

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Authentication & Registration](#4-authentication--registration)
5. [Feature Set by Role](#5-feature-set-by-role)
   - 5.1 [Student Features](#51-student-features)
   - 5.2 [Lecturer Features](#52-lecturer-features)
   - 5.3 [Teaching Assistant Features](#53-teaching-assistant-features)
   - 5.4 [Shared Features](#54-shared-features)
6. [Attendance System — Deep Dive](#6-attendance-system--deep-dive)
7. [Live Lesson Playground — Deep Dive](#7-live-lesson-playground--deep-dive)
8. [Suspicious Activity Detection](#8-suspicious-activity-detection)
9. [Student Matching Engine](#9-student-matching-engine)
10. [Database Schema](#10-database-schema)
11. [Security Rules](#11-security-rules)
12. [Frontend Architecture](#12-frontend-architecture)
13. [Component Library](#13-component-library)
14. [Environment Configuration](#14-environment-configuration)
15. [Build & Deployment](#15-build--deployment)
16. [Design System](#16-design-system)
17. [Utility Layer](#17-utility-layer)
18. [Known Limitations & Disabled Features](#18-known-limitations--disabled-features)

---

## 1. Project Overview

**YooBees** is a web-based classroom management platform built for a tertiary institution. It streamlines attendance tracking, student profiling, live lesson collaboration, and course resource delivery across two campuses (Auckland and Christchurch).

The platform serves three roles — students, lecturers, and teaching assistants — through dedicated dashboards with role-appropriate capabilities. All data is stored in Firebase (Firestore + Storage), and the frontend is deployed as a static site on GitHub Pages.

**Primary Use Cases:**

- Lecturers launch timed attendance checkpoints; students submit codes to mark attendance.
- Lecturers monitor live classroom engagement via polls, shared canvases, and presence tracking.
- Students build profiles, view their attendance history, and access course learning resources.
- Lecturers analyse attendance data with built-in fraud detection and CSV export.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 18.2.0 |
| Language | TypeScript | 5.3.3 |
| Build Tool | Vite | 5.1.0 |
| Styling | Tailwind CSS | 3.4.1 |
| Routing | React Router DOM | 6.22.0 |
| Backend/Auth/DB | Firebase SDK | 10.8.0 |
| Charts | Recharts | 2.10.3 |
| Maps | Leaflet + React-Leaflet | 1.9.4 / 4.2.1 |
| QR Codes | qrcode.react | 4.2.0 |
| Icons | Lucide React | 0.309.0 |
| Date Utilities | date-fns | 3.3.1 |
| Deployment | GitHub Pages (gh-pages) | 6.1.1 |

**Firebase services used:**
- Firebase Authentication (email/password + passwordless email link)
- Cloud Firestore (primary database)
- Firebase Storage (student profile photos)

---

## 3. User Roles & Permissions

The application defines three roles, stored on each user's Firestore document and checked at both the route and security-rule levels.

### Role Hierarchy

```
lecturer
  ├── Full read/write on all collections
  ├── Attendance session management
  ├── Student account management
  ├── Manual attendance overrides
  └── Notice board management

teachingAssistant
  ├── Read access to most collections
  ├── Shared staff-level dashboard access (same UI as lecturer)
  ├── Cannot create/delete attendance sessions
  └── Limited account management

student
  ├── Read/write own profile only
  ├── Read/write own attendance records
  ├── Submit attendance codes
  └── View own history and resources
```

### Permission Matrix

| Action | Student | Teaching Assistant | Lecturer |
|---|:---:|:---:|:---:|
| View own profile | ✓ | ✓ | ✓ |
| Edit own profile | ✓ | — | — |
| View all student profiles | — | ✓ | ✓ |
| Edit any student profile | — | — | ✓ |
| Delete student account | — | — | ✓ |
| Create attendance session | — | — | ✓ |
| Launch checkpoint | — | — | ✓ |
| Submit attendance code | ✓ | — | — |
| View own attendance | ✓ | — | — |
| View all attendance records | — | ✓ | ✓ |
| Override attendance | — | — | ✓ |
| Create notices | — | ✓ | ✓ |
| Delete notices | — | — | ✓ |
| Access live playground (host) | — | — | ✓ |
| Access live playground (viewer) | ✓ | ✓ | ✓ |
| View suspicious activity flags | — | ✓ | ✓ |
| Export CSV | — | ✓ | ✓ |
| View event log | — | ✓ | ✓ |

---

## 4. Authentication & Registration

### Sign-in Methods

1. **Email + Password** — standard credentials sign-in via Firebase Auth.
2. **Passwordless Email Link** — Firebase sends a magic link; user clicks it to authenticate without a password. Recommended for students.

### Registration Flow

All accounts are created on a single `/register` page. Role selection determines which validation path runs.

**Student registration:**
- Email must end with `@yoobeestudent.ac.nz`
- No access code required
- Password minimum 6 characters
- Password confirmation must match

**Lecturer registration:**
- Any email address
- Must enter the lecturer access code (env var `VITE_LECTURER_CODE`, default `PROF2024`)
- Password minimum 6 characters

**Teaching Assistant registration:**
- Any email address
- Must enter the TA access code (env var `VITE_TA_CODE`, default `YOOBEETA`)
- Password minimum 6 characters

After registration, `AuthContext` writes a `users/{uid}` document with the chosen role. The user is immediately redirected to their role-appropriate dashboard.

### Post-login Routing

The `ProtectedRoute` component reads the authenticated user's role and redirects unauthenticated visitors to `/login`. Role mismatches (e.g., a student accessing `/lecturer/*`) redirect to the correct dashboard.

| Role | Default landing page |
|---|---|
| student | `/student/dashboard` |
| lecturer | `/lecturer/dashboard` |
| teachingAssistant | `/lecturer/dashboard` |

### Password Management

- **Reset password** — sends a Firebase password reset email from the login page.
- **Change password** — available inside the app via `AuthContext.changePassword(currentPassword, newPassword)`, which re-authenticates before updating.

### Session Tracking

Session start time is written to `localStorage` on login. On logout, `AuthContext` calculates session duration and (when event logging is re-enabled) writes a `session_end` event to `eventLogs`.

---

## 5. Feature Set by Role

### 5.1 Student Features

#### Dashboard (`/student/dashboard`)

The student home screen shows a personalised snapshot:

- **Time-based greeting** — changes between morning/afternoon/evening.
- **Profile summary card** — displays name, student ID, campus, section, intake, and course enrolments.
- **Peer match recommendations** — up to 3 students with the highest compatibility score (see [Section 9](#9-student-matching-engine)).
- **Student photo collage** — grid of profile photos from the cohort.
- **Hometown map** — Leaflet map with markers at each student's entered hometown coordinates.
- **Cohort statistics** — campus split, intake breakdown, special needs count.

#### My Profile (`/student/profile`)

Students manage their own public profile:

| Field | Type | Notes |
|---|---|---|
| Full name | Text | Required |
| Student ID | Text | Required, must be unique |
| Campus | Select | Auckland / Christchurch |
| Section | Text | e.g. A, B |
| Intake | Select | 2511 / 2604 |
| Subjects | Multi-select | Course codes |
| Course | Text | Programme name |
| Home country | Text | Free text |
| Hometown | Text + map | Interactive Leaflet map to drop pin |
| Work experience | Text | Description |
| Work industry | Select | Dropdown list |
| Educational background | Select | Dropdown list |
| Special needs | Text | Disclosed accommodations |
| Photo | File upload | JPEG/PNG, max 5 MB, stored in Firebase Storage |

Saving writes/merges the `students/{uid}` Firestore document and updates `updatedAt`.

#### Attendance (`/student/attendance`)

- Lists all **active** attendance sessions.
- Student enters the 6-character checkpoint code (case-insensitive).
- On submission:
  1. System validates code against active checkpoints.
  2. Checks checkpoint window has not expired.
  3. Creates an `attendanceRecords` document.
  4. Collects device metadata (user-agent, timezone, screen resolution, language — **no GPS**).
- Countdown timer shows time remaining before the checkpoint closes.
- Duplicate submissions are rejected (one record per student per checkpoint).

#### Quick Attend (`/attend/:code`)

A direct-URL route that pre-fills the attendance code from the URL path. Designed for QR code scans. If the student is not yet logged in, they are redirected to `/login` and returned here after authentication.

#### History (`/student/history`)

Attendance records grouped by course:

- Summary row: total attended, absent (justified), absent (unjustified).
- Absence notice submission form — students explain an absence; status starts as `absent`, can be updated to `excused` by a lecturer.
- Full record table with date, session title, checkpoint, and result.
- Shows any manual overrides applied by a lecturer with reason.

#### Course Resources (`/student/course-resources`)

Learning materials hub:

- **SQL Programming Deck** — interactive slide deck for SQL syntax.
- **ER Diagrams Deck** — entity-relationship diagram fundamentals.
- **ER Advanced Concepts Deck** — extended ER modelling.
- **ER Diagram Activities** — practice exercises.
- **Video Gallery** — embedded course videos.
- **MBI802 Quiz** — scored DBMS multiple-choice quiz; results written to `mbi802QuizResults` collection.
- **Quiz Results Dashboard** — student's own quiz history.

#### MBI802 Resources (`/student/mbi802-resources`)

Dedicated resource page for the MBI802 Database Management Systems course with curated content.

#### Live Lesson (`/student/playground`)

Students join a lecturer-hosted live session:

- **Presence panel** — see which classmates and the lecturer are currently in the session.
- **Canvas panel** — view the lecturer's shared drawing/diagram board (read-only for students).
- **Poll panel** — vote in active polls; results appear in real time.
- **Checklist panel** — mark lesson checklist items as complete; personal completion is stored per student.
- **Past session view** — browse archived sessions.

#### Notice Board (`/student/notices`)

Read-only notice board. Notices are filterable by category:

- `general` — all students
- `urgent` — time-sensitive
- `auckland` — Auckland campus only
- `christchurch` — Christchurch campus only

Pinned notices always appear at the top.

---

### 5.2 Lecturer Features

#### Dashboard (`/lecturer/dashboard`)

Analytics overview of the entire student cohort:

- **KPI cards** — total students, total sessions run, overall attendance rate.
- **Course distribution** — pie chart of student enrolments per programme.
- **Campus split** — pie chart Auckland vs. Christchurch.
- **Intake breakdown** — bar chart of enrolment cohorts.
- **World map** — Leaflet map with clustered hometown markers.
- **Work experience chart** — distribution of student work backgrounds.
- **Work industry chart** — industry sector breakdown.
- **Educational background chart** — prior qualification breakdown.
- **Photo collage** — class photo grid.
- All charts support filtering by course, intake, and subject.

#### Student List (`/lecturer/students`)

Full student roster management:

- **Search** — filter by name or student ID.
- **Filter** — by campus, section, course, intake.
- **Sort** — by name, ID, section, campus, profile completion percentage.
- **Attendance summary** — inline attended/absent stats per student row.
- **Export CSV** — download full roster with attendance data.
- **Delete account** — permanently removes student Firestore document and auth account.

#### Student Detail (`/lecturer/students/:id`)

Individual student view with full edit capability:

- All profile fields editable by lecturer.
- Attendance summary tables per course.
- Full attendance record history (date, session, checkpoint, result).
- Absence notices with ability to change status to `excused`.
- **Manual override panel**:
  - Adjust `attendedDelta`, `absentJustifiedDelta`, `absentUnjustifiedDelta` by ±N.
  - Requires a written reason.
  - Override is stored as a separate document, not mutating original records.

#### Attendance Sessions (`/lecturer/attendance`)

Lifecycle management for classroom attendance:

1. **Create session** — enter title and course; creates `attendanceSessions` document with `status: active`.
2. **Launch checkpoint** — pick a label (Opening, Mid-session, Closing, custom), set window (2–10 min); generates a random 6-char code with expiry timestamp.
3. **Active checkpoint display** — live countdown timer, 6-char code in large text, QR code, copy-to-clipboard button.
4. **Multiple checkpoints** — a session can have many sequential checkpoints.
5. **Close session** — sets `status: closed`; no more checkpoints can be launched.
6. **Past sessions list** — all historical sessions with links to results.

#### Attendance Results (`/lecturer/attendance/:sessionId`)

Per-session detailed report:

- Filter by checkpoint, section, or day.
- Student summary table: name, ID, campus, section, count of checkpoints attended vs. total.
- Expandable row — shows each checkpoint submission with timestamp and device metadata.
- **Suspicious Activity panel** (see [Section 8](#8-suspicious-activity-detection)).
- **Export CSV** — all records for the session with flags.

#### Live Playground (`/lecturer/playground`)

Host controls for the real-time classroom:

- **Create/start session** — initialises a `sessions` Firestore document.
- **Presence panel** — live list of who is in the session; shows UID / display name.
- **Canvas** — freehand drawing tool; strokes broadcast to all viewers in real time via Firestore.
- **Poll creation** — add question + options; publish for students to vote; view live result bars.
- **Checklist management** — add/remove/reorder checklist items; track student completion counts.
- **End session** — closes session and archives data to `archivedSessions`.
- **Session history** — browse past sessions and their content snapshots.

#### Notice Board (`/lecturer/notices`)

Full CRUD on notices:

- **Create** — title, body, category (general / urgent / auckland / christchurch), pin toggle.
- **Edit** — update any field; sets `updatedAt`.
- **Delete** — remove notice permanently.
- Pinned notices render with visual prominence.

---

### 5.3 Teaching Assistant Features

Teaching assistants share the lecturer's dashboard route (`/lecturer/*`) and see the same UI. Their permissions differ at the Firestore security-rule level:

- **Can do:** read all students, view all attendance records, view suspicious activity, export CSV, create/edit notices, join live playground, view quiz results.
- **Cannot do:** delete student accounts, create or close attendance sessions, launch checkpoints, apply manual overrides, delete notices.

---

### 5.4 Shared Features

#### Notice Board

Accessible at `/shared/notices` (and role-specific paths). Students have read-only access; staff can manage notices.

#### Loading & Toast Notifications

- `LoadingSpinner` component renders during async operations.
- `ToastProvider` shows success/error/info messages for all major actions (form saves, code submissions, exports, etc.).

#### Responsive Layout

`Layout` component provides the shell (sidebar navigation, top bar). Navigation links adapt to the authenticated user's role. Fully responsive down to mobile viewports.

---

## 6. Attendance System — Deep Dive

### Session & Checkpoint Model

```
AttendanceSession
  ├── id
  ├── title           "Week 3 Lecture"
  ├── course          "MBI800"
  ├── date
  ├── lecturerId
  ├── status          "active" | "closed"
  └── checkpoints[]
        ├── id
        ├── label     "Opening" | "Mid-session" | custom
        ├── code      "AX7K2P"  (6 random alphanumeric, no ambiguous chars)
        ├── startTime
        ├── expiresAt  startTime + windowMinutes
        ├── isActive
        └── windowMinutes  (2 | 3 | 4 | 5 | 8 | 10)
```

### Student Submission Flow

```
Student enters code
       │
       ▼
Validate code exists in any active checkpoint
       │ invalid → error toast
       ▼
Check expiresAt > now
       │ expired → "Code has expired" error
       ▼
Check no existing record for (studentUid, checkpointId)
       │ duplicate → "Already submitted" error
       ▼
Capture device metadata (no GPS)
       │
       ▼
Write attendanceRecord to Firestore
       │
       ▼
Show confirmation with checkpoint label and timestamp
```

### Attendance Calculation

`attendanceSummary.ts` computes per-student, per-course totals:

1. Gather all `attendanceRecords` for the student + course.
2. For each session, count how many of its checkpoints have a matching record → marks as "attended" if at least one checkpoint has a record (configurable).
3. Sessions with no records check `absenceNotices` for the same date:
   - If an approved absence notice exists → `absentJustified`.
   - Otherwise → `absentUnjustified`.
4. Apply `attendanceOverrides` deltas on top of calculated counts.

### Code Generation

Codes are produced by `generateCode(6)` in `utils.ts`. The alphabet excludes visually ambiguous characters (`0`, `O`, `I`, `1`) to reduce transcription errors.

---

## 7. Live Lesson Playground — Deep Dive

### Firestore Data Structure

```
sessions/{sessionId}
  ├── title
  ├── createdAt
  ├── status       "active" | "ended"
  │
  ├── presence/{userId}
  │     ├── displayName
  │     ├── role
  │     └── lastSeen
  │
  ├── canvas/{docId}
  │     └── strokes[]   (drawing path data)
  │
  ├── polls/{pollId}
  │     ├── question
  │     ├── options[]
  │     ├── votes/{userId}   value: selected option index
  │     └── isActive
  │
  ├── checklistItems/{itemId}
  │     ├── label
  │     └── order
  │
  └── checklistCompletions/{completionId}
        ├── studentUid
        └── itemId
```

### Real-time Sync

All sub-collections use `onSnapshot()` listeners. When the lecturer writes a canvas stroke or publishes a poll, all connected students receive the update within ~100–500 ms (Firestore latency).

Presence documents are written on component mount and deleted (or timestamped stale) on unmount / `onSnapshot` cleanup.

### Session Archival

When a lecturer ends a session, the `sessions/{id}` document is copied to `archivedSessions/{id}`, preserving all sub-collection data for historical review.

---

## 8. Suspicious Activity Detection

`suspiciousActivity.ts` runs as a pure function against all `attendanceRecords` for a given session. Three detection types:

### 1. Shared IP Address (HIGH severity)

**Trigger:** Two or more students submit from the same IP address during the same checkpoint.

**Campus Wi-Fi exemption:** If more than 40% of all class submissions share an IP, that IP is treated as a campus NAT gateway and flagged as LOW severity (informational only) rather than HIGH.

**Rationale:** Students sharing a mobile hotspot or submitting on each other's behalf will likely share a public IP.

### 2. Location Outlier (MEDIUM severity)

**Trigger:** A student's submitted coordinates are more than 500 m from the median geographic centre of all student submissions for that checkpoint.

**Implementation:** `haversineDistance()` in `locationUtils.ts` computes great-circle distance. The median lat/lng is calculated across all submissions with valid coordinates.

**Note:** Coordinates are only available if the student grants browser geolocation permission. Denied/unavailable submissions are excluded from outlier analysis.

### 3. Rapid Sequential Submission (MEDIUM severity)

**Trigger:** Two different students sharing the same IP address submit within 30 seconds of each other during the same checkpoint.

**Rationale:** One person submitting for multiple students in rapid succession.

### Output

`detectSuspiciousActivity(records)` returns a `SuspiciousActivityFlag[]` array:

```typescript
{
  type: 'shared_ip' | 'location_outlier' | 'rapid_submission';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  affectedStudentUids: string[];
  metadata: Record<string, unknown>;
}
```

The `SuspiciousActivityPanel` component renders these flags colour-coded in the Attendance Results page.

---

## 9. Student Matching Engine

Implemented in `StudentDashboard.tsx`. Computes a compatibility score between the current student and every other student in the cohort, then surfaces the top matches.

### Scoring Algorithm

| Condition | Points |
|---|---|
| Same educational background | +40 |
| Same home country | +30 |
| Same work industry | +25 |
| Hometown < 50 km away | +25 |
| Hometown 50–200 km away | +18 |
| Hometown 200–800 km away | +10 |
| Same course | +10 |

If no student scores above 0, up to 3 random students are selected instead.

Distance between hometowns is computed with `haversineDistance()` using the stored `hometownLat`/`hometownLng` coordinates from each student's profile.

---

## 10. Database Schema

### `users`

```typescript
{
  uid: string;
  email: string;
  role: 'student' | 'lecturer' | 'teachingAssistant';
  createdAt: Timestamp;
}
```

### `students`

```typescript
{
  uid: string;
  fullName: string;
  studentId: string;              // Unique institutional ID
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
  photoURL?: string;              // Firebase Storage download URL
  createdAt: Date;
  updatedAt: Date;
}
```

### `attendanceSessions`

```typescript
{
  id: string;
  title: string;
  course: string;
  date: Timestamp;
  lecturerId: string;
  checkpoints: AttendanceCheckpoint[];
  status: 'active' | 'closed';
  createdAt: Timestamp;
}

// Embedded sub-type:
AttendanceCheckpoint {
  id: string;
  label: string;
  code: string;                  // 6-char alphanumeric
  startTime: Timestamp;
  expiresAt: Timestamp;
  isActive: boolean;
  windowMinutes: 2 | 3 | 4 | 5 | 8 | 10;
}
```

### `attendanceRecords`

```typescript
{
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
  submittedAt: Timestamp;
  location?: AttendanceLocationData;
}

AttendanceLocationData {
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
```

### `absenceNotices`

```typescript
{
  id: string;
  studentUid: string;
  studentName: string;
  studentDisplayId: string;
  studentCampus?: string;
  studentSection?: string;
  sessionCourse?: string;
  reportDateKey: string;          // 'YYYY-MM-DD'
  status: 'absent' | 'excused';
  reason: string;
  createdAt: Timestamp;
}
```

### `attendanceOverrides`

```typescript
{
  id: string;
  studentUid: string;
  course: string;
  attendedDelta: number;
  absentUnjustifiedDelta: number;
  absentJustifiedDelta: number;
  reason: string;
  updatedByUid: string;
  updatedByEmail?: string;
  updatedAt: Timestamp;
}
```

### `sessions` (Live Playground)

```typescript
// Root document
{
  id: string;
  title: string;
  createdAt: Timestamp;
  status: 'active' | 'ended';
}

// Subcollections:
// presence/{userId}    → { displayName, role, lastSeen: Timestamp }
// canvas/{docId}       → { strokes: StrokeData[] }
// polls/{pollId}       → { question, options[], isActive, votes/{userId}: number }
// checklistItems/{id}  → { label, order }
// checklistCompletions/{id} → { studentUid, itemId }
```

### `notices`

```typescript
{
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
```

### `mbi802QuizResults`

```typescript
{
  id: string;
  studentUid: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, string>;  // questionId → selected answer
  submittedAt: Timestamp;
}
```

### `eventLogs` (currently disabled)

```typescript
{
  id: string;
  type: EventLogType;
  description: string;
  actorUid?: string;
  actorEmail?: string;
  actorRole?: UserRole;
  targetUid?: string;
  targetName?: string;
  feature?: string;
  durationSeconds?: number;
  timestamp: Timestamp;
}
```

### `archivedSessions`

Identical structure to `sessions` documents, written on session end for historical access.

---

## 11. Security Rules

### Firestore (`firestore.rules`)

**`users` collection**
- Any authenticated user can read their own document.
- Staff (lecturer, teachingAssistant) can read all user documents.
- Users write only their own document.
- Only lecturers can delete user documents (account deletion).

**`students` collection**
- All authenticated users can read (required for profile uniqueness validation).
- Students write their own document only.
- Staff can write any student document.

**`attendanceSessions` collection**
- Any authenticated user can read.
- Only lecturers can create, update, or delete sessions.

**`attendanceRecords` collection**
- Students read only their own records.
- Staff read all records.
- Students can create records (duplicate prevention enforced in application logic).
- Only lecturers can update or delete records.

**`absenceNotices` collection**
- Students read their own notices.
- Staff read all.
- Students create notices.
- Only lecturers can update or delete.

**`attendanceOverrides` collection**
- Students read their own overrides.
- Staff read all.
- Only lecturers can write.

**`eventLogs` collection**
- Only staff can read.
- Any authenticated user can create.
- No updates or deletes permitted.

**`sessions` collection (Live Playground)**
- All authenticated users can read.
- Staff create and update session root documents.
- Users write their own `presence` sub-document.
- Staff write `canvas` and `checklistItems` sub-documents.
- Any authenticated user updates `polls` (votes) and their own `checklistCompletions`.

**`notices` collection**
- All authenticated users can read.
- Only staff can create, update, or delete.

**`mbi802QuizResults` collection**
- Students read their own results.
- Staff read all.
- Students can create (one attempt stored per submission).
- No updates or deletes.

### Firebase Storage (`storage.rules`)

**`student-photos/{userId}`**
- Owner can upload images (JPEG/PNG/GIF/WebP) up to 5 MB.
- Any authenticated user can download.

---

## 12. Frontend Architecture

### Application Entry

```
main.tsx
  └── App.tsx
        ├── AuthProvider (wraps entire app)
        ├── ToastProvider
        └── BrowserRouter
              └── Routes
                    ├── /login           → Login
                    ├── /register        → Register
                    ├── /attend/:code    → QuickAttend  (ProtectedRoute: student)
                    ├── /student/*       → ProtectedRoute(role=student)
                    ├── /lecturer/*      → ProtectedRoute(role=lecturer|teachingAssistant)
                    └── /shared/*        → ProtectedRoute(all roles)
```

### Routing Table

| Path | Component | Roles |
|---|---|---|
| `/login` | `Login` | Public |
| `/register` | `Register` | Public |
| `/student/dashboard` | `StudentDashboard` | student |
| `/student/profile` | `StudentProfile` | student |
| `/student/attendance` | `StudentAttendance` | student |
| `/student/history` | `StudentHistory` | student |
| `/attend/:code` | `QuickAttend` | student |
| `/student/playground` | `StudentPlayground` | student |
| `/student/course-resources` | `CourseResources` | student |
| `/student/mbi802-resources` | `MBI802Resources` | student |
| `/lecturer/dashboard` | `LecturerDashboard` | lecturer, teachingAssistant |
| `/lecturer/students` | `StudentList` | lecturer, teachingAssistant |
| `/lecturer/students/:id` | `StudentDetail` | lecturer, teachingAssistant |
| `/lecturer/attendance` | `AttendanceSessions` | lecturer, teachingAssistant |
| `/lecturer/attendance/:id` | `AttendanceResults` | lecturer, teachingAssistant |
| `/lecturer/playground` | `LivePlayground` | lecturer, teachingAssistant |
| `/lecturer/eventlog` | `EventLog` | lecturer, teachingAssistant |
| `/shared/notices` | `NoticeBoard` | all |

### Code Splitting

Pages are lazy-loaded via `React.lazy()` + `Suspense`. The Vite build splits vendor chunks:

| Chunk | Contents |
|---|---|
| `vendor-firebase` | Firebase SDK |
| `vendor-charts` | Recharts + D3 |
| `vendor-map` | Leaflet |
| `vendor-react` | React, React-DOM, React Router |

### State Management

No global state library. State is managed via:

- `AuthContext` — global auth state (user, role, methods).
- React `useState` / `useEffect` — local component state.
- Firestore `onSnapshot` — real-time data subscriptions.
- `localStorage` — session start time only.

---

## 13. Component Library

### Layout Components

| Component | Location | Purpose |
|---|---|---|
| `Layout` | `components/layout/Layout.tsx` | App shell — sidebar nav, top bar, content area |
| `ProtectedRoute` | `components/layout/ProtectedRoute.tsx` | Role-based access control wrapper |

### UI Primitives

| Component | Location | Purpose |
|---|---|---|
| `LoadingSpinner` | `components/ui/LoadingSpinner.tsx` | Animated spinner for async states |
| `StatCard` | `components/ui/StatCard.tsx` | KPI display card with icon + value |
| `Modal` | `components/ui/Modal.tsx` | Accessible overlay dialog |
| `ToastProvider` | `components/ui/ToastProvider.tsx` | Success/error/info toast notifications |
| `BrandMark` | `components/ui/BrandMark.tsx` | YooBees logo mark |
| `StudentPhotoCollage` | `components/ui/StudentPhotoCollage.tsx` | Grid of student profile photos |
| `SuspiciousActivityPanel` | `components/ui/SuspiciousActivityPanel.tsx` | Renders fraud detection flags |
| `PhotoUploadModal` | `components/ui/PhotoUploadModal.tsx` | Photo crop + upload to Firebase Storage |

### Playground Components

| Component | Location | Purpose |
|---|---|---|
| `PresencePanel` | `components/playground/PresencePanel.tsx` | Live participant list |
| `CanvasPanel` | `components/playground/CanvasPanel.tsx` | Shared drawing board |
| `PollPanel` | `components/playground/PollPanel.tsx` | Live voting interface |
| `ChecklistPanel` | `components/playground/ChecklistPanel.tsx` | Lesson agenda with completion tracking |
| `PastSessionView` | `components/playground/PastSessionView.tsx` | Archive browser |

### Slide/Resource Components

| Component | Location | Purpose |
|---|---|---|
| `SQLProgrammingDeck` | `components/slides/SQLProgrammingDeck.tsx` | Interactive SQL slides |
| `ERDiagramsDeck` | `components/slides/ERDiagramsDeck.tsx` | ER diagram fundamentals |
| `ERAdvancedConceptsDeck` | `components/slides/ERAdvancedConceptsDeck.tsx` | Advanced ER modelling |
| `ERDiagramActivitiesDeck` | `components/slides/ERDiagramActivitiesDeck.tsx` | Practice activities |
| `VideoGallery` | `components/slides/VideoGallery.tsx` | Embedded video player grid |

### Quiz Components

| Component | Location | Purpose |
|---|---|---|
| `MBI802Quiz` | `components/quiz/MBI802Quiz.tsx` | DBMS multiple-choice quiz |
| `QuizResultsDashboard` | `components/quiz/QuizResultsDashboard.tsx` | Student quiz history |

### Lab Components

| Component | Location | Purpose |
|---|---|---|
| `SISPPromptLab` | `components/lab/SISPPromptLab.tsx` | Prompt engineering lab (SISP course) |

---

## 14. Environment Configuration

### Required Variables (`.env`)

```dotenv
# Firebase project configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Staff registration codes (keep secret)
VITE_LECTURER_CODE=PROF2024
VITE_TA_CODE=YOOBEETA
```

All variables must be prefixed `VITE_` to be accessible in the browser bundle.

### GitHub Actions Secrets

The CI/CD workflow requires these secrets set in repository settings:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_LECTURER_CODE`
- `VITE_TA_CODE`

---

## 15. Build & Deployment

### Local Development

```bash
npm install
cp .env.example .env   # fill in Firebase credentials
npm run dev            # starts Vite dev server at http://localhost:5173
```

### Production Build

```bash
npm run build    # runs tsc then vite build → outputs to /dist
npm run preview  # preview production build locally
```

### Deployment

```bash
npm run deploy   # runs predeploy (build) then gh-pages -d dist
```

Publishes the `/dist` folder to the `gh-pages` branch, served via GitHub Pages at `https://<org>.github.io/YooBees/`.

Vite base path is set to `/YooBees/` in `vite.config.ts` to match the GitHub Pages sub-path.

### CI/CD (GitHub Actions)

`.github/workflows/` contains an automated pipeline that:

1. Triggers on push to `main`.
2. Installs dependencies.
3. Injects environment secrets.
4. Runs `npm run build`.
5. Deploys to GitHub Pages.

### Required Firestore Indexes

Deploy via Firebase Console or `firebase deploy --only firestore:indexes`:

| Collection | Fields | Order |
|---|---|---|
| `attendanceRecords` | `sessionId`, `submittedAt` | ASC, ASC |
| `attendanceRecords` | `studentUid`, `submittedAt` | ASC, DESC |
| `attendanceSessions` | `status`, `createdAt` | ASC, DESC |

---

## 16. Design System

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `purple-600` | `#7c3aed` | Primary brand / CTAs |
| `purple-50` | `#faf5ff` | Page backgrounds |
| `purple-100` | `#f3e8ff` | Card backgrounds |
| `rose-500` | `#f43f5e` | Error states |
| `emerald-500` | `#10b981` | Success states |
| `amber-500` | `#f59e0b` | Warning / medium severity |
| `red-600` | `#dc2626` | High severity flags |

Custom semantic tokens defined in `tailwind.config.js`:

- `soft-purple`, `soft-lavender`, `soft-pink`, `soft-teal`, `soft-blue`, `soft-green`, `soft-amber`, `soft-rose`

### Typography

- **Font family:** Inter (Google Fonts), fallback to `system-ui`.
- **Weights:** 400 (body), 500 (labels), 600 (headings), 700 (display).

### Border Radius

Extended scale in Tailwind config:

| Class | Value |
|---|---|
| `rounded-2xl` | 16 px |
| `rounded-3xl` | 20 px |
| `rounded-4xl` | 24 px |

### Effects

- **Glassmorphism** — `backdrop-blur-sm` + semi-transparent backgrounds on cards.
- **Gradient backgrounds** — multi-stop linear gradients on page backgrounds and hero sections.
- **Decorative orbs** — large blurred circles positioned absolutely behind content.
- **Transition duration** — 200 ms (interactive), 300 ms (panels/modals).

### Animations (defined in `index.css`)

| Name | Effect |
|---|---|
| `float` | Vertical bobbing (decorative orbs) |
| `shimmer` | Horizontal sheen (skeleton loading) |
| `slide-up` | Translate Y from +20 px to 0 |
| `slide-down` | Translate Y from −20 px to 0 |
| `scale-in` | Scale from 0.95 to 1 |
| `fade-in` | Opacity 0 → 1 |

---

## 17. Utility Layer

### `src/lib/utils.ts`

| Function | Signature | Description |
|---|---|---|
| `generateCode` | `(length: number) => string` | Random alphanumeric code, excludes `0OI1` |
| `formatDate` | `(date) => string` | `DD MMM YYYY` |
| `formatDateTime` | `(date) => string` | `DD MMM YYYY HH:MM` |
| `formatTime` | `(date) => string` | `HH:MM` |
| `secondsUntil` | `(timestamp) => number` | Seconds remaining until a future Firestore Timestamp |
| `groupBy` | `<T>(arr, keyFn) => Record<string, T[]>` | Group array elements by a key function |
| `toCounts` | `(grouped) => {name, value}[]` | Convert grouped map to Recharts-compatible array |

### `src/lib/locationUtils.ts`

| Function | Description |
|---|---|
| `captureLocationSnapshot()` | Async; collects user-agent, timezone, language, screen resolution, device type. Does **not** capture GPS or IP. |
| `haversineDistance(lat1, lng1, lat2, lng2)` | Great-circle distance in kilometres between two coordinate pairs. |
| `formatDistance(km)` | Returns human-readable string (`"< 1 km"`, `"12 km"`, `"1,234 km"`). |

### `src/lib/suspiciousActivity.ts`

| Function | Description |
|---|---|
| `detectSuspiciousActivity(records)` | Analyses attendance records array; returns `SuspiciousActivityFlag[]`. |
| `getFlaggedStudentUids(flags)` | Extracts unique UIDs from a flags array. |

### `src/lib/attendanceSummary.ts`

| Function | Description |
|---|---|
| `summarizeStudentAttendanceByCourse(records, sessions, notices, overrides)` | Returns per-course attendance summary `{ course, attended, absentJustified, absentUnjustified, total }[]`. |
| `summarizeStudentAttendance(records, sessions, notices, overrides)` | Returns aggregate across all courses. |

### `src/lib/eventLog.ts`

Event logging helpers — **currently disabled** (all functions are no-ops) to reduce Firestore read/write costs. Can be re-enabled by restoring the Firestore write calls inside each function.

### `src/lib/useFeatureTracking.ts`

Custom React hook returning a `trackFeature(featureName)` function. Currently a no-op but provides a hook point for analytics without requiring call-site changes.

### `src/lib/quotes.ts`

Array of motivational quotes displayed on the login screen carousel. No external API dependency.

---

## 18. Known Limitations & Disabled Features

### Event Logging (disabled)

`eventLogs` Firestore writes are disabled to stay within Firebase free-tier limits. The collection schema and security rules remain in place; re-enabling requires uncommenting writes in `eventLog.ts`.

### GPS Tracking (not implemented)

`captureLocationSnapshot()` explicitly does **not** request `navigator.geolocation`. Only browser metadata is collected. The `latitude`/`longitude` fields in `AttendanceLocationData` are reserved for a future opt-in GPS feature.

### IP Address Capture (not implemented)

IP addresses cannot be captured client-side in a pure browser application without a backend proxy. The `ipAddress` field in attendance records is reserved but always empty. The suspicious activity IP-sharing detection therefore only operates when IP data is available from future backend infrastructure.

### Teaching Assistant Restrictions

TA permission enforcement is entirely at the Firestore security-rule level. The frontend UI does not yet hide/disable buttons for actions TAs cannot perform — attempting them will result in a Firestore permission-denied error shown as a toast.

### No Offline Support

The application requires an active internet connection. There is no service worker, IndexedDB cache, or offline fallback.

### Browser Support

Vite build targets ES2020. Internet Explorer and legacy Edge are not supported.

### Single-page App on GitHub Pages

Direct URL navigation (e.g., loading `/student/dashboard` directly) will 404 on GitHub Pages. A `404.html` redirect script is required and should be present in `/public`. Ensure it is configured if deep-linking is needed.
