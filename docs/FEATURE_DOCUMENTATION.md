# YooBees — Software Feature Documentation

> **Teaching & Learning Platform for Postgraduate Education**
> Version 1.0 · Stack: React 18 + TypeScript + Firebase

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Authentication & Registration](#5-authentication--registration)
6. [Student Dashboard & Daily Match](#6-student-dashboard--daily-match)
7. [Student Profile Management](#7-student-profile-management)
8. [Attendance Management](#8-attendance-management)
9. [Suspicious Activity Detection](#9-suspicious-activity-detection)
10. [Live Lesson Playground](#10-live-lesson-playground)
11. [Learning Resources Library](#11-learning-resources-library)
12. [Quiz & Assessment System](#12-quiz--assessment-system)
13. [Notice Board](#13-notice-board)
14. [Lecturer Dashboard & Analytics](#14-lecturer-dashboard--analytics)
15. [Database Schema](#15-database-schema)
16. [Security Model](#16-security-model)
17. [Error Cases & Edge Cases](#17-error-cases--edge-cases)
18. [Deployment & Configuration](#18-deployment--configuration)

---

## 1. System Overview

YooBees is a web-based attendance management and learning support platform built for postgraduate students and their lecturers. It runs as a single-page application (SPA) deployed on GitHub Pages, with Firebase handling all authentication, real-time data, and file storage — meaning there is no custom backend server to operate or scale.

### Primary Goals

| Goal | How It Is Met |
|------|--------------|
| Accurate attendance capture | Time-windowed codes per checkpoint |
| Fraud resistance | IP clustering, GPS outlier, rapid-submission detection |
| Live lesson interaction | Real-time canvas, polls, checklist, presence panel |
| Self-paced learning | Slide decks, video lessons, MCQ quizzes |
| Student cohort insight | Daily match, geo maps, campus/intake breakdown |

### Supported Courses (as configured)

- **MBI802** – Database Management Systems
- **SQL Programming** – practical SQL, ER design
- **Agile/Scrum** – methodology and team practices

---

## 2. Architecture

### 2.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                         │
│                                                             │
│  React 18 + TypeScript                                      │
│  React Router (hash-based, GitHub Pages compatible)         │
│  Tailwind CSS  ·  Recharts  ·  React-Leaflet                │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌─────────┐  │
│  │  Pages   │  │Components│  │  Contexts  │  │  Lib    │  │
│  │ (routes) │  │(UI/Feat.)│  │(AuthCtx)   │  │(utils,  │  │
│  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │ types,  │  │
│       └─────────────┴───────────────┘         │ algos)  │  │
│                       │                       └─────────┘  │
└───────────────────────┼─────────────────────────────────────┘
                        │  Firebase SDK (client)
           ┌────────────┼──────────────────────┐
           │            │                      │
    ┌──────▼──────┐  ┌──▼──────────┐  ┌───────▼──────┐
    │  Firebase   │  │  Firestore  │  │  Firebase    │
    │    Auth     │  │  (NoSQL DB) │  │  Storage     │
    │             │  │             │  │  (photos,    │
    │  email+pw   │  │  14 coll.   │  │   canvases)  │
    │  magic link │  │  real-time  │  │              │
    └─────────────┘  └─────────────┘  └──────────────┘
```

### 2.2 Client-Side Architecture

```
src/
├── App.tsx                  ← Router root; lazy-loads every page
├── main.tsx                 ← ReactDOM.createRoot; Leaflet CSS fix
│
├── contexts/
│   └── AuthContext.tsx      ← Single source of truth for auth state
│
├── components/
│   ├── layout/              ← Sidebar + protected route wrapper
│   ├── ui/                  ← Shared atoms (Modal, Toast, StatCard…)
│   ├── playground/          ← Live-lesson panels
│   ├── quiz/                ← MCQ engines + dashboards
│   ├── slides/              ← Slide deck components
│   └── lab/                 ← SQL practice & prompt lab
│
├── pages/
│   ├── auth/                ← Login, Register
│   ├── student/             ← 8 student pages
│   ├── lecturer/            ← 10 lecturer pages
│   └── shared/              ← NoticeBoard
│
└── lib/
    ├── types.ts             ← All shared TypeScript interfaces
    ├── firebase.ts          ← SDK init
    ├── utils.ts             ← Code gen, formatters, groupBy
    ├── suspiciousActivity.ts← Fraud detection algorithm
    ├── attendanceSummary.ts ← Attendance roll-up calculations
    ├── locationUtils.ts     ← Haversine distance, device detect
    ├── playgroundTypes.ts   ← Live lesson type definitions
    └── *Data.ts             ← Static quiz question banks
```

### 2.3 Data Flow — Standard Read/Write

```
Component                     Firestore
    │                             │
    │  onSnapshot(query)          │
    │ ─────────────────────────►  │
    │                             │  Fires immediately with current data
    │ ◄─────────────────────────  │  then on every document change
    │                             │
    │  addDoc / updateDoc         │
    │ ─────────────────────────►  │
    │                             │  Writes are acknowledged
    │ ◄─────────────────────────  │  and trigger onSnapshot listeners
    │                             │
    │  Cleanup on unmount         │
    │  unsubscribe()              │
    │ ─────────────────────────►  │  Stops listening (prevents leaks)
```

---

## 3. Technology Stack

| Layer | Technology | Version | Role |
|-------|-----------|---------|------|
| Language | TypeScript | 5.3.3 | Type-safe application code |
| UI Framework | React | 18.2.0 | Component tree, state, effects |
| Build Tool | Vite | 5.1.0 | Dev server, HMR, code splitting |
| Routing | React Router DOM | 6.22.0 | Hash-based SPA routing |
| Styling | Tailwind CSS | 3.4.1 | Utility-first CSS |
| Charts | Recharts | 2.10.3 | Analytics visualisations |
| Maps | React Leaflet + Leaflet | 4.2.1 / 1.9.4 | Hometown map picker |
| QR Codes | qrcode.react | 4.2.0 | Attendance QR generation |
| Icons | Lucide React | 0.309.0 | UI iconography |
| Dates | date-fns | 3.3.1 | Date formatting utilities |
| Auth | Firebase Auth | 10.x | Email+password, magic links |
| Database | Cloud Firestore | 10.x | NoSQL document store |
| Storage | Firebase Storage | 10.x | Photo & canvas uploads |
| Deployment | gh-pages | 6.1.1 | GitHub Pages publish |

### Code Splitting Strategy

Vite splits the bundle into named vendor chunks to optimise initial load:

```
dist/
├── vendor-react.js      ← React + React DOM + React Router
├── vendor-firebase.js   ← Firebase SDK
├── vendor-charts.js     ← Recharts
├── vendor-maps.js       ← Leaflet + React-Leaflet
└── index.js             ← Application code
```

Each route is lazy-loaded (`React.lazy + Suspense`), so the browser only fetches page code when that route is first visited.

---

## 4. User Roles & Permissions

### 4.1 Role Definitions

```
┌─────────────────────┬───────────────────────────────────────────────┐
│      Role           │  Description                                  │
├─────────────────────┼───────────────────────────────────────────────┤
│ student             │  Enrolled postgraduate student                │
│ lecturer            │  Course instructor with full admin access     │
│ teachingAssistant   │  TA with lecturer-equivalent access           │
└─────────────────────┴───────────────────────────────────────────────┘
```

### 4.2 Feature Access Matrix

| Feature | Student | Lecturer | Teaching Assistant |
|---------|:-------:|:--------:|:-----------------:|
| View own attendance | ✓ | — | — |
| Submit attendance code | ✓ | — | — |
| View course resources | ✓ | ✓ | ✓ |
| Take quizzes | ✓ | — | — |
| Join live playground | ✓ | — | — |
| View notice board | ✓ | ✓ | ✓ |
| Edit own profile | ✓ | — | — |
| Create attendance sessions | — | ✓ | ✓ |
| View all students | — | ✓ | ✓ |
| Delete students | — | ✓ | — |
| Manage notices | — | ✓ | ✓ |
| Host live playground | — | ✓ | ✓ |
| Upload video lessons | — | ✓ | ✓ |
| View site analytics | — | ✓ | ✓ |
| Export CSV reports | — | ✓ | ✓ |
| Override attendance records | — | ✓ | ✓ |

### 4.3 Route Protection

Every route is wrapped in `ProtectedRoute`, which performs two checks in order:

```
Request to /lecturer/dashboard
           │
           ▼
    Is user authenticated?
     ├─ No  ──► Redirect to /login
     └─ Yes
           │
           ▼
    Does user.role match required role(s)?
     ├─ No  ──► Redirect to role home
     │          (student → /student/dashboard)
     │          (lecturer → /lecturer/dashboard)
     └─ Yes ──► Render page
```

---

## 5. Authentication & Registration

### 5.1 Supported Login Methods

| Method | Flow | Use Case |
|--------|------|----------|
| Email + Password | Standard credential check | Primary method |
| Passwordless Email Link | Magic link sent to inbox | No-password login |
| Password Reset | Email with reset link | Forgotten password |

### 5.2 Registration User Journey

```
┌─────────────────────────────────────────────────────────┐
│                    /register                            │
└─────────────────────────────────────────────────────────┘
         │
         ▼
  [1] Choose Role
      ● Student
      ● Lecturer
      ● Teaching Assistant
         │
         ▼
  [2] Enter Details
      ┌─────────────────────────────────────────┐
      │ Email         [____________]            │
      │ Password      [____________]            │
      │ Confirm Pwd   [____________]            │
      │                                         │
      │ If Lecturer:  Secret Code [_______]     │
      │ If TA:        Secret Code [_______]     │
      └─────────────────────────────────────────┘
         │
         ▼
  [3] Validation
      ├─ Student email must end with @yoobeestudent.ac.nz
      ├─ Password ≥ 6 characters
      ├─ Passwords must match
      ├─ Lecturer: code must equal VITE_LECTURER_CODE
      └─ TA: code must equal VITE_TA_CODE
         │
         ▼
  [4] Firebase createUserWithEmailAndPassword()
         │
    ┌────┴────┐
  Error     Success
    │           │
    ▼           ▼
  Show      Write UserRecord to Firestore
  error     users/{uid} = { uid, role, email, createdAt, loginCount: 0 }
  toast          │
                 ▼
          If Student: redirect to /student/profile
          (force profile completion)
          Else: redirect to /lecturer/dashboard
```

### 5.3 Login User Journey

```
/login
  │
  ▼
[1] Email + Password form
  │
  ▼
[2] signInWithEmailAndPassword()
  │
  ├─ Auth error ──► Toast message, stay on page
  │
  └─ Auth success
         │
         ▼
  [3] Fetch users/{uid} from Firestore to get role
         │
         ▼
  [4] Increment loginCount (analytics)
         │
         ▼
  [5] Redirect by role
      student           → /student/dashboard
      lecturer          → /lecturer/dashboard
      teachingAssistant → /lecturer/dashboard
```

### 5.4 Passwordless Login Flow

```
/login (Email Link tab)
  │
  ▼
[1] Enter email only
  │
  ▼
[2] sendSignInLinkToEmail()
    actionCodeSettings.url = window.location.origin + '/login'
    actionCodeSettings.handleCodeInApp = true
  │
  ▼
[3] Store email in localStorage
  │
  ▼
[4] Show "Check your inbox" message
  │
  ▼ (user clicks link in email)
  │
[5] isSignInWithEmailLink(window.location.href) → true
  │
  ▼
[6] signInWithEmailLink(email, href)
  │
  ▼
[7] Normal post-login flow (step 3 onward above)
```

### 5.5 Auth State Lifecycle

```
AuthContext initialises
        │
        ▼
onAuthStateChanged listener (Firebase SDK)
        │
    ┌───┴───┐
  user=null  user!=null
    │            │
    ▼            ▼
  Loading    Fetch users/{uid}
  clears     to get role & metadata
             │
             ▼
         Set { user, profile, role } in context
             │
             ▼
         All children can read
         const { user, role } = useAuth()
```

---

## 6. Student Dashboard & Daily Match

### 6.1 Dashboard Layout

The student dashboard is the landing page after login. It shows three primary sections:

1. **Attendance Summary** — attended / absent (unjustified) / absent (justified) counts
2. **Upcoming Sessions** — active attendance sessions available right now
3. **Daily Match** — a ranked list of peers recommended for study partnership

### 6.2 Daily Match Algorithm

The daily match feature scores every other student in the database for compatibility with the logged-in student. Higher score = stronger match.

```
Inputs for student A vs student B:
  ● educationalBackground  (string)
  ● workIndustry           (string)
  ● homeCountry            (string)
  ● hometown               (string)
  ● hometownLat/Lng        (number)
  ● course                 (string)

Scoring (additive):
  ┌──────────────────────────────┬────────────┐
  │ Same educationalBackground   │  +3 pts    │
  │ Same workIndustry            │  +2 pts    │
  │ Same homeCountry             │  +2 pts    │
  │ Same hometown string         │  +1 pt     │
  │ Hometown distance < 200 km   │  +1 pt     │
  │ Same course                  │  +1 pt     │
  └──────────────────────────────┴────────────┘
  Max possible score: 10 pts

Output:
  Top N peers sorted by descending score,
  displayed with avatar, name, match score,
  and shared attribute tags.
```

Distance between hometowns is calculated with the Haversine formula (see §9.3).

### 6.3 Dashboard Data Flow

```
Student logs in
      │
      ▼
useEffect on mount
      ├─ getDoc(students/{uid})         → profile (enrolled courses)
      ├─ getDocs(attendanceSessions)    → sessions for student's courses
      ├─ getDocs(attendanceRecords)     → student's own submissions
      ├─ getDocs(absenceNotices)        → student's own absences
      └─ getDocs(students)             → all students (for daily match)
                   │
                   ▼
      summarizeStudentAttendanceByCourse()
      dailyMatch()
                   │
                   ▼
      Render stats + matches
```

---

## 7. Student Profile Management

### 7.1 Profile Fields

| Field | Type | Notes |
|-------|------|-------|
| fullName | string | Display name across platform |
| studentId | string | Institutional student number |
| campus | enum | `Auckland` \| `Christchurch` |
| section | string | Class section (e.g. "A", "B") |
| intake | enum | `2511` \| `2604` |
| subjects | string[] | Enrolled subject codes |
| course | string | Master's programme name |
| homeCountry | string | Country of origin |
| hometown | string | Home city/town (text) |
| hometownLat/Lng | number\|null | GPS from map picker |
| workExperience | string | `"0"` to `"10+"` years |
| workIndustry | string | Industry category |
| educationalBackground | string | Prior degree field (50+ options) |
| specialNeeds | string | Accessibility requirements |
| photoURL | string\|undefined | Firebase Storage URL |

### 7.2 Profile Completion Flow

```
New student registers
        │
        ▼
Redirected to /student/profile (forced)
        │
        ▼
Fill in all required fields
        │
  [Map Picker]
  Click "Pick hometown on map"
        │
        ▼
  React-Leaflet modal opens
  Student clicks on world map
        │
        ▼
  Lat/Lng captured
  Reverse display (show coord)
  Town name entered separately
        │
        ▼
  [Photo Upload]
  Click avatar area
        │
        ▼
  PhotoUploadModal opens
  Select image file
        │
        ▼
  Upload to Firebase Storage
  path: students/{uid}/photo.jpg
        │
        ▼
  photoURL stored in profile
        │
        ▼
Save (updateDoc students/{uid})
        │
        ▼
Redirect to /student/dashboard
```

### 7.3 Profile Photo Fallback

When no photo is uploaded, the avatar renders as a gradient circle with the student's initials. The gradient is generated deterministically from the student's name so it is consistent across sessions.

---

## 8. Attendance Management

### 8.1 Conceptual Model

A single teaching day maps to one **Attendance Session**. A session contains one or more **Checkpoints** (time windows when a code is active). Students submit the code during the window to mark their presence for that checkpoint.

```
AttendanceSession
  ├── id, title, course, date, lecturerId, status
  └── checkpoints[]
        ├── id, label, code, startTime
        ├── expiresAt  (startTime + windowMinutes)
        ├── isActive   (lecturer toggle)
        └── windowMinutes (default: 4)
```

### 8.2 Checkpoint Labels (Conventions)

| Label | When | Purpose |
|-------|------|---------|
| Opening | Start of class | Confirms student was on time |
| Mid-session | ~45 min in | Confirms student stayed |
| Custom | Any time | Flexible use |

For full-session attendance, students must submit **both** Opening and Mid-session codes.

### 8.3 Lecturer — Create Session User Journey

```
/lecturer/attendance
        │
        ▼
Click "New Session"
        │
        ▼
Modal: Enter title + course
        │
        ▼
addDoc(attendanceSessions, {
  title, course, date: now(),
  lecturerId: user.uid,
  checkpoints: [],
  status: 'active'
})
        │
        ▼
Session appears in list
```

### 8.4 Lecturer — Launch Checkpoint User Journey

```
/lecturer/attendance (session row selected)
        │
        ▼
Click "Launch Opening" (or "Mid-session")
        │
        ▼
Generate 6-character code
  chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  (no 0/O/1/I to avoid visual confusion)
        │
        ▼
Create checkpoint object:
  id: uuid
  label: "Opening"
  code: e.g. "3KM7QP"
  startTime: now()
  expiresAt: now() + 4 minutes
  isActive: true
  windowMinutes: 4
        │
        ▼
updateDoc(attendanceSessions/{id}, { checkpoints })
        │
        ▼
Display on screen:
  ┌─────────────────────────────────────┐
  │  Opening Code                       │
  │                                     │
  │         3 K M 7 Q P                 │
  │                                     │
  │  Expires in: 3:42                   │
  │                                     │
  │  [QR Code — links to /attend/3KM7QP]│
  └─────────────────────────────────────┘

Lecturer projects screen or shares QR code
```

### 8.5 Student — Submit Attendance User Journey

```
/student/attendance  (or scan QR → /attend/:code)
        │
        ▼
Page loads; queries Firestore for
  active checkpoints across all sessions
  where course ∈ student.subjects
        │
        ▼
Student sees list of active codes
        │
  [Option A: Manual entry]
  Type code → click Submit
        │
  [Option B: QR scan → /attend/:code]
  Code pre-filled
        │
        ▼
Validation:
  1. Find checkpoint where code matches AND isActive = true
                                         AND now() < expiresAt
  2. Check no duplicate record exists for
     { studentUid, sessionId, checkpointId }
        │
     ┌──┴──┐
  Invalid  Valid
     │        │
     ▼        ▼
  Error    captureLocationSnapshot()
  toast    (device metadata only — GPS disabled)
              │
              ▼
           addDoc(attendanceRecords, {
             sessionId, sessionTitle, sessionCourse,
             studentUid, studentName, studentDisplayId,
             studentCampus, studentSection,
             checkpointId, checkpointLabel,
             submittedAt: serverTimestamp(),
             location: { locationStatus, userAgent,
                         deviceType, timezone,
                         language, screenResolution }
           })
              │
              ▼
           Success toast + record appears in history
```

### 8.6 Attendance Calculation Logic

Attendance summaries are computed client-side by `summarizeStudentAttendanceByCourse()`.

```
For each CLOSED session in a course:
  ├─ Does student have ≥1 record for this session?
  │     └─ YES → attendedDays += 1
  │
  └─ NO → check absenceNotices for same date + course
        ├─ Found excused absence → absentJustifiedDays += 1
        └─ Not found           → absentUnjustifiedDays += 1

totalDays = count of closed sessions for that course

Manual overrides (AttendanceOverride) are added as deltas
on top of computed values (can be positive or negative).
```

### 8.7 Session Status Transitions

```
          create
  ──────────────────► active
                         │
                  close  │  (lecturer clicks "Close Session")
                         ▼
                       closed
                         │
                 (included in attendance calculations)
```

Only **closed** sessions count toward the student's attendance record. Open sessions allow ongoing corrections before finalisation.

### 8.8 CSV Export Format

| Column | Source |
|--------|--------|
| studentId | `studentDisplayId` |
| studentName | `studentName` |
| campus | `studentCampus` |
| section | `studentSection` |
| checkpointLabel | `checkpointLabel` |
| submittedAt | ISO 8601 timestamp |
| locationStatus | `location.locationStatus` |
| deviceType | `location.deviceType` |
| ipAddress | `location.ipAddress` |

---

## 9. Suspicious Activity Detection

This module analyses attendance records from a single session and returns a list of `SuspiciousFlag` objects for the lecturer to review.

### 9.1 Flag Types

| Type | Severity | Trigger Condition |
|------|----------|------------------|
| `shared_ip` | HIGH | ≥2 distinct students submitted the same checkpoint from the same IP address (and that IP covers ≤40% of the total class) |
| `location_outlier` | MEDIUM | Student's GPS is >500 m from the median GPS position of the cohort |
| `rapid_submission` | MEDIUM | Two different students submitted from the same IP within 30 seconds of each other |

### 9.2 Detection Algorithm (step by step)

```
Input: AttendanceRecord[]

Step 1 — Group records by checkpointId
  byCheckpoint = { cp1: [r1,r2,...], cp2: [...] }

Step 2 — Shared IP detection (HIGH)
  For each checkpoint group:
    Build byIp = { "1.2.3.4": [rA, rB] }
    For each IP with ≥2 distinct students:
      campus_wifi_check:
        if (studentsOnIP / totalStudentsInCP) > 0.40
          → skip (likely shared Wi-Fi, not fraud)
      else
        → emit SuspiciousFlag(type='shared_ip', severity='high')
        → record (ip, checkpointLabel) in sharedIpCpKeys set

Step 3 — Location outlier detection (MEDIUM)
  For each checkpoint group:
    Filter to records with locationStatus='captured' AND lat/lng present
    Require ≥3 such records (to form a meaningful cluster)
    Compute median latitude and median longitude
    For each record:
      dist = haversineDistance(medLat, medLon, recLat, recLon)
      if dist > 500  → emit SuspiciousFlag(type='location_outlier', severity='medium')

Step 4 — Rapid submission detection (MEDIUM)
  Sort ALL records with ipAddress by submittedAt ascending
  For each consecutive pair (a, b):
    if a.ip == b.ip AND a.studentUid != b.studentUid:
      timeDiff = b.submittedAt - a.submittedAt
      if timeDiff < 30,000 ms:
        if (ip, cpLabel) NOT already in sharedIpCpKeys
          → emit SuspiciousFlag(type='rapid_submission', severity='medium')

Output: SuspiciousFlag[]
```

### 9.3 Haversine Distance Formula

Used to compute the great-circle distance between two GPS coordinates:

```
R = 6,371,000 m  (Earth radius)

dLat = toRadians(lat2 - lat1)
dLon = toRadians(lon2 - lon1)

a = sin²(dLat/2) + cos(lat1) · cos(lat2) · sin²(dLon/2)

distance = R · 2 · atan2(√a, √(1−a))   [metres]
```

### 9.4 Flag Display

```
┌──────────────────────────────────────────────────────┐
│  ⚠  Suspicious Activity                              │
│                                                      │
│  [HIGH]  Shared IP — Opening                         │
│  Students: Alice Wong (S12345), Bob Lee (S67890)     │
│  IP: 203.0.113.42                                    │
│  "2 students submitted from the same IP address…"   │
│                                                      │
│  [MEDIUM]  Location Outlier — Mid-session            │
│  Student: Charlie Kim (S11111)                       │
│  "Charlie submitted from 1.2 km away from the        │
│   class location cluster…"                          │
└──────────────────────────────────────────────────────┘
```

### 9.5 Edge Cases in Fraud Detection

| Scenario | Handled By |
|----------|-----------|
| Entire class on campus Wi-Fi | 40% threshold skip in shared_ip |
| Only 1–2 GPS records (no cluster) | Requires ≥3 GPS records for location_outlier |
| Same IP already flagged as shared_ip | rapid_submission skips if (ip, label) in sharedIpCpKeys |
| Student uses VPN | IP still captured; VPN detection not attempted |
| GPS unavailable (locationStatus='denied') | Excluded from location_outlier check |

---

## 10. Live Lesson Playground

The playground provides real-time interactive tools for a lecturer to use during a class. All state is stored in Firestore subcollections under `sessions/{sessionId}/`.

### 10.1 Session Structure (Firestore)

```
sessions/{sessionId}
  ├── (document)  PlaygroundSession metadata
  │     { id, intake, subject, status, activatedBy,
  │       activatedByName, expiresAt, createdAt }
  │
  ├── presence/   (subcollection)
  │     {userId}: { userId, name, role, joinedAt }
  │
  ├── canvas/
  │     "snapshot": { data (base64 PNG), updatedAt, updatedBy }
  │
  ├── polls/      (subcollection)
  │     {pollId}: { id, question, createdAt,
  │                 votes: { userId: true|false } }
  │
  ├── checklistItems/  (subcollection)
  │     {itemId}: { id, label, order, createdAt }
  │
  └── checklistCompletions/  (subcollection)
        "{itemId}_{userId}": { itemId, userId, userName, completedAt }
```

### 10.2 Playground Panels

#### Presence Panel

Shows who is currently in the session in real time.

```
Student joins /student/playground
          │
          ▼
setDoc(sessions/{id}/presence/{userId}, {
  userId, name, role: 'student', joinedAt: now()
})
          │
          ▼
Real-time list via onSnapshot(collection(presence))

On unmount / browser close:
  deleteDoc(sessions/{id}/presence/{userId})
```

#### Canvas Panel

A shared whiteboard where the lecturer draws; students observe.

```
Lecturer (draws on HTML5 canvas element)
          │
          ▼
On pointerUp: toDataURL() → base64 PNG
          │
          ▼
setDoc(sessions/{id}/canvas/snapshot, {
  data: base64PNG,
  updatedAt: now(),
  updatedBy: user.uid
})
          │  (onSnapshot propagates to all clients)
          ▼
All connected students see updated canvas
```

Students have a read-only view (no pointer events).

#### Poll Panel

Lecturer posts yes/no questions; students vote instantly.

```
Lecturer creates poll:
  addDoc(polls, { question, createdAt, votes: {} })

Student votes 👍:
  updateDoc(polls/{id}, { votes.{userId}: true })

Student votes 👎:
  updateDoc(polls/{id}, { votes.{userId}: false })

Tally displayed in real time:
  thumbsUp  = Object.values(votes).filter(v => v === true).length
  thumbsDown = Object.values(votes).filter(v => v === false).length
```

#### Checklist Panel

Task list with per-student completion tracking.

```
Lecturer adds item:
  addDoc(checklistItems, { label, order, createdAt })

Student marks complete:
  setDoc(checklistCompletions/{itemId}_{userId}, {
    itemId, userId, userName, completedAt
  })

Per-student progress visible to lecturer:
  completedItems[studentId] = set of completedItemIds
  progress% = completedItems.size / totalItems * 100
```

### 10.3 Playground User Journey — Lecturer

```
/lecturer/playground
      │
      ▼
[1] Activate session
    (sets status='active', expiresAt = now + 2h)
      │
      ▼
[2] Share session ID or QR with students
      │
      ▼
[3] Use panels:
    ● Presence — see who joins
    ● Canvas   — draw explanation
    ● Poll     — ask live question
    ● Checklist — set tasks
      │
      ▼
[4] Close session
    (status → 'expired')
    Session archived → archivedSessions collection
```

### 10.4 Playground User Journey — Student

```
/student/playground
      │
      ▼
[1] See active session for intake/subject
      │
      ▼
[2] Click "Join"
    → presence entry created
      │
      ▼
[3] Panels available in view mode:
    ● Presence — see classmates
    ● Canvas   — view lecturer drawing
    ● Poll     — vote on questions
    ● Checklist — mark own tasks done
      │
      ▼
[4] Leave / close tab
    → presence entry deleted
```

### 10.5 Past Sessions

Archived sessions can be replayed. The `PastSessionView` component loads from `archivedSessions` and renders the canvas snapshot, poll results, and checklist state at the time of archival — read-only.

---

## 11. Learning Resources Library

### 11.1 Resource Categories

| Category | Component | Type |
|----------|-----------|------|
| SQL Programming | `SQLProgrammingDeck` | Slide deck |
| ER Diagrams (Intro) | `ERDiagramsDeck` | Slide deck |
| ER Diagrams (Advanced) | `ERAdvancedConceptsDeck` | Slide deck |
| ER Diagram Activities | `ERDiagramActivitiesDeck` | Slide deck |
| Database Normalisation | `NormalizationDeck` | Slide deck |
| Agile / Scrum | `AgileScrumDeck` | Slide deck |
| Video Lessons | `VideoGallery` | Video player |
| SQL Prompt Lab | `SISPPromptLab` | Interactive lab |
| SQL Practice | `SQLPracticeLesson` | Scenario exercises |

### 11.2 Slide Deck Navigation

Each deck component manages its own `currentSlide` state:

```
[◀ Prev]  Slide 3 / 12  [Next ▶]
                │
         onKeyDown:
           ← ArrowLeft  → prev slide
           → ArrowRight → next slide
```

### 11.3 Video Lesson Manager (Lecturer)

```
/lecturer/video-manager
      │
      ▼
[Upload video]
  title, description, URL (external or Firebase Storage)
  thumbnail URL
      │
      ▼
addDoc(videoLessons, { title, description, url,
                        thumbnailUrl, createdAt, uploadedBy })
      │
      ▼
Students see video in VideoGallery via getDocs(videoLessons)
```

### 11.4 SQL Practice Lab

Students work through predefined SQL scenarios (library, hospital, school databases). Each scenario has:

- Context description
- Table schemas
- Questions (what SQL query should produce X?)
- Expected output

Progress is saved to `sqlPractice/{studentUid}`.

---

## 12. Quiz & Assessment System

### 12.1 Available Quizzes

| Quiz | Questions | Pass Threshold | Distinction | Badge |
|------|-----------|---------------|-------------|-------|
| ER Diagram MCQ | 100+ | 50% | 90% | `erMcqBadge` on profile |
| Agile/Scrum MCQ | ~40 | 50% | 80% | — |
| MBI802 DBMS Quiz | ~30 | 50% | 80% | — |

### 12.2 MCQ Engine Flow

```
Load quiz page (/student/course-resources → ER Quiz tab)
        │
        ▼
[1] Shuffle questions (Fisher-Yates)
    Select subset (configurable per quiz)
        │
        ▼
[2] Display question + 4 options
        │
        ▼
[3] Student selects option
    Immediate feedback:
      ● Correct  → green highlight
      ● Incorrect → red + show correct answer
        │
        ▼
[4] "Next" → repeat until all questions answered
        │
        ▼
[5] Show results screen:
    Score: 34/40 (85%)
    ┌─────────────────────────────┐
    │  DISTINCTION 🏅             │
    │  You scored 85%             │
    │  [View Breakdown]           │
    └─────────────────────────────┘
        │
        ▼
[6] Save to Firestore:
    setDoc(erMcqResults/{studentUid}, {
      studentUid,
      score: 34,
      total: 40,
      percentage: 85,
      distinction: true,
      attemptedAt: now()
    })
        │
        ▼
[7] If distinction AND quiz is ER MCQ:
    updateDoc(students/{uid}, { erMcqBadge: true })
```

### 12.3 Results Dashboard (Lecturer View)

The `ERMcqDashboard`, `AgileScrumMcqDashboard`, and `QuizResultsDashboard` components show:

- Bar chart: score distribution across students
- Table: per-student score, percentage, attempts, timestamp
- Filter by campus / section / intake

---

## 13. Notice Board

### 13.1 Notice Categories

| Category | Target Audience |
|----------|----------------|
| `general` | All users |
| `urgent` | All users (highlighted) |
| `auckland` | Auckland campus only |
| `christchurch` | Christchurch campus only |

### 13.2 Notice Data Structure

```typescript
Notice {
  id: string
  title: string
  body: string          // Rich text content
  category: enum        // general | urgent | auckland | christchurch
  pinned: boolean       // Pinned notices show at top regardless of date
  authorUid: string
  authorName: string
  createdAt: Timestamp
  updatedAt?: Timestamp
}
```

### 13.3 Notice Board User Journey

```
/shared/notices (all roles)
        │
        ▼
Notices loaded from Firestore
Sorted: pinned first, then by createdAt descending

        ┌──────────────────┐
        │   [URGENT]       │  ← highlighted red/orange border
        │   Title          │
        │   Body…          │
        │   Author · Date  │
        └──────────────────┘
        ┌──────────────────┐
        │ 📌 [PINNED]      │
        │   …              │
        └──────────────────┘

Lecturer/TA sees additional controls:
  [+ New Notice]  [Edit]  [Delete]  [Pin/Unpin]
```

---

## 14. Lecturer Dashboard & Analytics

### 14.1 Dashboard Statistics Cards

```
/lecturer/dashboard
        │
        ▼
Loads in parallel:
  ● getDocs(students)       → total student count
  ● getDocs(attendanceSessions) → sessions this week
  ● getDocs(attendanceRecords)  → submissions today
        │
        ▼
StatCard components:
  ┌─────────────────┬─────────────────┬─────────────────┐
  │  Total Students │  Sessions This  │  Submissions    │
  │      47         │      Week: 3    │   Today: 28     │
  └─────────────────┴─────────────────┴─────────────────┘
```

### 14.2 Student List Page

```
/lecturer/students
  │
  ├─ Search by name / ID
  ├─ Filter by campus / section / intake
  ├─ Sort by name / attendance %
  │
  ▼
Table row per student:
  Name  |  ID  |  Campus  |  Section  |  Attendance%  |  [View]  |  [Delete]
                                                                        │
                                                                        ▼
                                                              Confirmation modal
                                                                        │
                                                                        ▼
                                                              deleteDoc(students/{uid})
                                                              deleteDoc(users/{uid})
```

### 14.3 Student Detail Page

`/lecturer/students/:id` shows:

- Full profile (all fields from StudentProfile)
- Attendance summary per course (chart + table)
- Full attendance history (all records)
- Manual override form (add/subtract attendance days)
- Photo collage entry (profile photo)

### 14.4 Site Analytics

```
/lecturer/analytics
        │
        ▼
getDocs(users) → all users with loginCount
        │
        ▼
Bar chart: login count per user
Table: email | role | loginCount | createdAt
```

### 14.5 Attendance Results Page

```
/lecturer/attendance/:sessionId
        │
        ▼
Load session + all records for that session
        │
        ▼
Run detectSuspiciousActivity(records)
        │
        ▼
Layout:
  ┌─────────────────────────────────────────────┐
  │  Session: "Week 4 – SQL Joins"              │
  │  Date: 05 May 2026  ·  Course: MBI802       │
  │                                             │
  │  ⚠ Suspicious Activity (2 flags)            │
  │  [see SuspiciousActivityPanel]              │
  │                                             │
  │  Checkpoint: Opening    [Export CSV]        │
  │  ┌──────────────────────────────────────┐   │
  │  │ Student ID │ Name  │ Time │ Device   │   │
  │  │ S12345     │ Alice │ 9:03 │ mobile   │   │
  │  │ S67890     │ Bob   │ 9:04 │ desktop  │   │
  │  └──────────────────────────────────────┘   │
  │                                             │
  │  Checkpoint: Mid-session                    │
  │  …                                          │
  └─────────────────────────────────────────────┘
```

---

## 15. Database Schema

### 15.1 Entity Relationship Overview

```
┌──────────────┐        ┌──────────────────┐
│    users     │1      1│    students      │
│ ──────────── │────────│ ──────────────── │
│ uid (PK)     │        │ uid (PK, FK)     │
│ email        │        │ fullName         │
│ role         │        │ studentId        │
│ createdAt    │        │ campus           │
│ loginCount   │        │ section          │
└──────────────┘        │ intake           │
                        │ subjects[]       │
                        │ course           │
                        │ homeCountry      │
                        │ hometownLat/Lng  │
                        │ workExperience   │
                        │ workIndustry     │
                        │ educationalBg    │
                        │ specialNeeds     │
                        │ photoURL         │
                        │ erMcqBadge       │
                        └──────────────────┘
                                │
                                │ 1:N (submitted by)
                                ▼
┌────────────────────┐   ┌─────────────────────┐
│ attendanceSessions │1  N│  attendanceRecords  │
│ ────────────────── │───│ ─────────────────── │
│ id (PK)            │   │ id (PK)             │
│ title              │   │ sessionId (FK)      │
│ course             │   │ studentUid (FK)     │
│ date               │   │ checkpointId        │
│ lecturerId (FK)    │   │ checkpointLabel     │
│ checkpoints[]      │   │ submittedAt         │
│ status             │   │ location {}         │
└────────────────────┘   └─────────────────────┘

┌──────────────────┐    ┌───────────────────┐
│  absenceNotices  │    │attendanceOverrides │
│ ──────────────── │    │ ───────────────── │
│ id (PK)          │    │ id (PK)           │
│ studentUid (FK)  │    │ studentUid (FK)   │
│ reportDateKey    │    │ course            │
│ status           │    │ attendedDelta     │
│ reason           │    │ absentU/JDelta    │
│ sessionCourse    │    │ reason            │
└──────────────────┘    │ updatedByUid      │
                        └───────────────────┘

┌──────────────┐         ┌──────────────────┐
│   notices    │         │  videoLessons    │
│ ──────────── │         │ ──────────────── │
│ id (PK)      │         │ id (PK)          │
│ title        │         │ title            │
│ body         │         │ description      │
│ category     │         │ url              │
│ pinned       │         │ thumbnailUrl     │
│ authorUid    │         │ uploadedBy       │
│ createdAt    │         │ createdAt        │
└──────────────┘         └──────────────────┘

┌─────────────────────────────────────────────────────┐
│             sessions/{id}  (subcollections)         │
│                                                     │
│  presence/{userId}      PresenceEntry               │
│  canvas/snapshot        CanvasSnapshot              │
│  polls/{pollId}         Poll (+ votes map)          │
│  checklistItems/{id}    ChecklistItem               │
│  checklistCompletions   ChecklistCompletion         │
└─────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌───────────────────────┐
│   erMcqResults       │  │  agileScrumMcqResults  │
│ ─────────────────── ─│  │ ───────────────────── │
│ studentUid (PK)      │  │ studentUid (PK)       │
│ score / total / %    │  │ score / total / %     │
│ distinction          │  │ attemptedAt           │
│ attemptedAt          │  └───────────────────────┘
└──────────────────────┘
```

### 15.2 Composite Indexes (Firestore)

Efficient queries that span multiple fields require composite indexes:

| Collection | Fields Indexed | Query Purpose |
|------------|---------------|--------------|
| `attendanceRecords` | `sessionId ASC`, `submittedAt DESC` | Records per session |
| `attendanceRecords` | `studentUid ASC`, `submittedAt DESC` | Student history |
| `attendanceSessions` | `status ASC`, `date DESC` | Active sessions |
| `notices` | `pinned DESC`, `createdAt DESC` | Notice board order |

---

## 16. Security Model

### 16.1 Firestore Security Rules Summary

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    // users — only own doc or staff read
    match /users/{uid} {
      allow read: if request.auth.uid == uid
                  || isStaff();
      allow write: if request.auth.uid == uid;
    }

    // students — all authenticated can read;
    //            student writes own; staff write all
    match /students/{uid} {
      allow read:  if isAuthenticated();
      allow write: if request.auth.uid == uid
                   || isStaff();
      allow delete: if isLecturer();   // TA cannot delete
    }

    // sessions — read: all auth; write: staff only
    match /attendanceSessions/{id} {
      allow read:  if isAuthenticated();
      allow write: if isStaff();
    }

    // attendanceRecords — students create own;
    //                     staff read all; lecturer update/delete
    match /attendanceRecords/{id} {
      allow create: if isAuthenticated()
                    && request.resource.data.studentUid == request.auth.uid;
      allow read:   if isStaff()
                    || request.auth.uid == resource.data.studentUid;
      allow update, delete: if isLecturer();
    }

    // notices — read: all auth; write: staff only
    match /notices/{id} {
      allow read:   if isAuthenticated();
      allow write:  if isStaff();
    }

    // playground subcollections — authenticated full access
    match /sessions/{id}/{sub}/{doc} {
      allow read, write: if isAuthenticated();
    }

    // quiz results — students write own; staff read; no deletes
    match /erMcqResults/{uid} {
      allow write: if request.auth.uid == uid;
      allow read:  if isStaff()
                   || request.auth.uid == uid;
    }

    function isAuthenticated() { return request.auth != null; }
    function isStaff()         { return isLecturer() || isTA(); }
    function isLecturer()      { ... role check against users/{uid} ... }
    function isTA()            { ... role check against users/{uid} ... }
  }
}
```

### 16.2 Client-Side Route Protection

```
ProtectedRoute component:
  1. If AuthContext.loading → show LoadingSpinner
  2. If !user            → navigate('/login')
  3. If role !== required → navigate(roleHome)
  4. Else                → render children
```

### 16.3 Registration Secrets

Lecturer and TA registration require a server-side secret code passed in the environment at build time (`VITE_LECTURER_CODE`, `VITE_TA_CODE`). These are Vite env variables (bundled into the client). For higher security in production, replace with a server-side invite-link flow.

### 16.4 Attendance Submission Integrity

| Check | Where enforced |
|-------|---------------|
| Code must match an active checkpoint | Client + Firestore query |
| Code must not be expired (`now < expiresAt`) | Client-side check |
| Duplicate submission prevented | Firestore uniqueness query before addDoc |
| `studentUid` in record must equal `request.auth.uid` | Firestore security rule |

---

## 17. Error Cases & Edge Cases

### 17.1 Attendance Submission Errors

| Error | Cause | User-facing Message |
|-------|-------|---------------------|
| `code_not_found` | Code typed incorrectly or session closed | "Code not found or has expired." |
| `code_expired` | Window passed (`expiresAt < now`) | "This code has expired." |
| `duplicate_submission` | Same checkpoint submitted twice | "You've already submitted for this checkpoint." |
| `not_enrolled` | Student not in course | No active codes shown |

### 17.2 Authentication Errors

| Error | Firebase Code | Displayed Message |
|-------|-------------|------------------|
| Wrong password | `auth/wrong-password` | "Invalid email or password." |
| Email not found | `auth/user-not-found` | "Invalid email or password." |
| Too many attempts | `auth/too-many-requests` | "Too many attempts. Try again later." |
| Email already used | `auth/email-already-in-use` | "An account with this email already exists." |
| Weak password | `auth/weak-password` | "Password should be at least 6 characters." |
| Wrong lecturer code | client check | "Invalid lecturer code." |

### 17.3 Location Capture

| Status | Condition | Effect |
|--------|-----------|--------|
| `captured` | GPS permission granted & coords obtained | Full location stored |
| `denied` | Browser permission denied | Location fields null; submission still allowed |
| `unavailable` | No GPS hardware / HTTPS required | Default; device metadata only |
| `timeout` | GPS took >10 s | Location fields null; submission still allowed |

Location capture **never blocks attendance submission**. A student without GPS still gets their record created; the missing location simply cannot be used for outlier detection.

### 17.4 Quiz Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Student refreshes mid-quiz | State lost; must restart (not persisted until completion) |
| Student submits twice | `setDoc` with same UID key overwrites previous result |
| Zero questions matched from filter | Empty question bank guard → show "No questions available" |
| Score exactly at pass threshold | Pass message shown (not distinction) |
| Score exactly at distinction threshold | Distinction message + badge awarded |

### 17.5 Playground Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Student leaves tab open overnight | Presence entry stays until manually removed or session expires |
| Lecturer closes session with students present | Students see "Session ended" state; presence docs remain until cleanup |
| Canvas too large | base64 PNG is limited by Firestore 1 MB document cap; large drawings may fail silently |
| Poll deleted while students are voting | `onSnapshot` removes poll from UI; votes already cast are discarded |

### 17.6 Suspicious Activity False Positives

| False Positive Scenario | Mitigation |
|------------------------|-----------|
| Campus Wi-Fi (many students, one IP) | Skip if >40% of class shares IP |
| Students near same location (flat-mates) | Not automatically flagged — only >500 m outliers are flagged |
| Student on mobile data with dynamic IP | Rapid-submission threshold is 30 s; normal sequential access won't trigger |
| VPN / corporate proxy | IP collected but no VPN detection; lecturer must use judgement |

---

## 18. Deployment & Configuration

### 18.1 Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase project API key | required |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | required |
| `VITE_FIREBASE_PROJECT_ID` | Firestore project ID | required |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket | required |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | required |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | required |
| `VITE_LECTURER_CODE` | Secret code for lecturer sign-up | `PROF2024` |
| `VITE_TA_CODE` | Secret code for TA sign-up | `YOOBEETA` |

### 18.2 Build & Deploy

```
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Production build (output: dist/)
npm run build

# Deploy to GitHub Pages
npm run deploy
# (runs: vite build && gh-pages -d dist)
```

Vite base path is set to `/YooBees/` to match the GitHub Pages subdirectory. Routing uses hash-based URLs (`/#/student/dashboard`) so deep links work without server-side rewrites.

### 18.3 CI/CD Pipeline

```
Push to main
     │
     ▼
GitHub Actions: deploy.yml
     │
     ├─ npm ci
     ├─ npm run build
     └─ gh-pages -d dist
             │
             ▼
       GitHub Pages
  https://{owner}.github.io/YooBees/
```

### 18.4 Firebase Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Authentication → Email/Password + Email Link providers
- [ ] Create Firestore database (production mode)
- [ ] Deploy `firestore.rules` via Firebase CLI
- [ ] Enable Firebase Storage
- [ ] Deploy `storage.rules` via Firebase CLI
- [ ] Add Firestore composite indexes (see §15.2)
- [ ] Set environment variables in `.env` file
- [ ] Set GitHub Pages secrets for CI deployment

---

## Appendix A — Route Index

| Path | Component | Role(s) |
|------|-----------|---------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/attend/:code` | QuickAttend | Public |
| `/student/dashboard` | StudentDashboard | student |
| `/student/profile` | StudentProfile | student |
| `/student/attendance` | StudentAttendance | student |
| `/student/history` | StudentHistory | student |
| `/student/course-resources` | CourseResources | student |
| `/student/mbi802-resources` | MBI802Resources | student |
| `/student/playground` | StudentPlayground | student |
| `/student/notices` | NoticeBoard | student |
| `/lecturer/dashboard` | Dashboard | lecturer, TA |
| `/lecturer/students` | StudentList | lecturer, TA |
| `/lecturer/students/:id` | StudentDetail | lecturer, TA |
| `/lecturer/attendance` | AttendanceSessions | lecturer, TA |
| `/lecturer/attendance/:id` | AttendanceResults | lecturer, TA |
| `/lecturer/playground` | LivePlayground | lecturer, TA |
| `/lecturer/course-resources` | CourseResources | lecturer, TA |
| `/lecturer/video-manager` | VideoLessonManager | lecturer, TA |
| `/lecturer/analytics` | SiteAnalytics | lecturer, TA |
| `/lecturer/notices` | NoticeBoard | lecturer, TA |
| `/lecturer/mbi802-resources` | MBI802Resources | lecturer, TA |

---

## Appendix B — Firestore Collection Reference

| Collection | Documents | Key Fields |
|------------|-----------|-----------|
| `users` | per uid | role, loginCount |
| `students` | per uid | fullName, campus, erMcqBadge |
| `attendanceSessions` | per session | status, course, checkpoints[] |
| `attendanceRecords` | per submission | studentUid, checkpointId, location |
| `absenceNotices` | per notice | studentUid, reportDateKey, status |
| `attendanceOverrides` | per override | studentUid, course, deltas |
| `notices` | per notice | category, pinned, authorUid |
| `videoLessons` | per video | url, thumbnailUrl, uploadedBy |
| `sessions/{id}/presence` | per user | role, joinedAt |
| `sessions/{id}/canvas` | singleton | data (base64), updatedBy |
| `sessions/{id}/polls` | per poll | question, votes{} |
| `sessions/{id}/checklistItems` | per item | label, order |
| `sessions/{id}/checklistCompletions` | per completion | itemId, userId |
| `archivedSessions` | per archive | snapshot of session state |
| `erMcqResults` | per uid | score, percentage, distinction |
| `agileScrumMcqResults` | per uid | score, percentage |
| `mbi802QuizResults` | per uid | score, percentage |
| `sqlPractice` | per uid | scenario progress |

---

*Documentation generated for YooBees v1.0 — React + TypeScript + Firebase*
