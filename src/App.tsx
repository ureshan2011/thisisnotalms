import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FullPageSpinner } from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ToastProvider } from './components/ui/ToastProvider';
import { PLATFORM_ACTIVE } from './config/platform';
import ShutdownPage from './pages/ShutdownPage';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const StudentSQLRace    = lazy(() => import('./pages/student/SQLRacePage'));
const LecturerSQLRace   = lazy(() => import('./pages/lecturer/SQLRacePage'));
const StudentDailyDuel  = lazy(() => import('./pages/student/DailyDuelPage'));
const LecturerDailyDuel = lazy(() => import('./pages/lecturer/DailyDuelPage'));
const ArenaPage         = lazy(() => import('./pages/student/ArenaPage'));
const DuelRoomPage      = lazy(() => import('./pages/student/DuelRoomPage'));
const SQLExamPage       = lazy(() => import('./pages/student/SQLExamPage'));
const SkillPassportPage = lazy(() => import('./pages/student/SkillPassportPage'));
const KudosPage         = lazy(() => import('./pages/student/KudosPage'));
const HallOfFame        = lazy(() => import('./pages/HallOfFame'));
const CertificateView   = lazy(() => import('./pages/CertificateView'));
const TimeCapsulePage   = lazy(() => import('./pages/student/TimeCapsulePage'));
const AlumniWall        = lazy(() => import('./pages/AlumniWall'));

// Auth pages — lazy-loaded; only downloaded when the user reaches login/register
const Login    = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

// Student pages — lazy-loaded per route
const StudentDashboard  = lazy(() => import('./pages/student/StudentDashboard'));
const StudentProfile    = lazy(() => import('./pages/student/StudentProfile'));
const StudentAttendance = lazy(() => import('./pages/student/StudentAttendance'));
const StudentHistory    = lazy(() => import('./pages/student/StudentHistory'));
const QuickAttend       = lazy(() => import('./pages/student/QuickAttend'));
const CourseResources   = lazy(() => import('./pages/student/CourseResources'));
const StudentPlayground = lazy(() => import('./pages/student/StudentPlayground'));

// Shared pages — lazy-loaded per route
const NoticeBoard = lazy(() => import('./pages/shared/NoticeBoard'));

// Lecturer pages — lazy-loaded per route
const ClassCountdownPage = lazy(() => import('./pages/lecturer/ClassCountdownPage'));
const ClassroomView      = lazy(() => import('./pages/lecturer/ClassroomView'));
const Dashboard          = lazy(() => import('./pages/lecturer/Dashboard'));
const StudentList        = lazy(() => import('./pages/lecturer/StudentList'));
const StudentDetail      = lazy(() => import('./pages/lecturer/StudentDetail'));
const AttendanceSessions = lazy(() => import('./pages/lecturer/AttendanceSessions'));
const AttendanceResults  = lazy(() => import('./pages/lecturer/AttendanceResults'));
const LivePlayground     = lazy(() => import('./pages/lecturer/LivePlayground'));
const SiteAnalytics        = lazy(() => import('./pages/lecturer/SiteAnalytics'));
const VideoLessonManager   = lazy(() => import('./pages/lecturer/VideoLessonManager'));

function RootRedirect() {
  const { user, role, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user)   return <LandingPage />;
  if (role === 'lecturer' || role === 'teachingAssistant') return <Navigate to="/lecturer/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route path="/"             element={<RootRedirect />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/attend/:code" element={<QuickAttend />} />
        <Route path="/certificate/:certId" element={<CertificateView />} />

        {/* Student routes */}
        <Route path="/student/dashboard"       element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile"         element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/attendance"      element={<ProtectedRoute allowedRoles={['student']}><StudentAttendance /></ProtectedRoute>} />
        <Route path="/student/history"         element={<ProtectedRoute allowedRoles={['student']}><StudentHistory /></ProtectedRoute>} />
        <Route path="/student/course-resources" element={<ProtectedRoute allowedRoles={['student']}><CourseResources /></ProtectedRoute>} />
        <Route path="/student/mbi802-resources" element={<Navigate to="/student/course-resources" replace />} />
        <Route path="/student/playground"      element={<ProtectedRoute allowedRoles={['student']}><StudentPlayground /></ProtectedRoute>} />
        <Route path="/student/notices"         element={<ProtectedRoute allowedRoles={['student']}><NoticeBoard /></ProtectedRoute>} />
        <Route path="/student/sql-race"        element={<ProtectedRoute allowedRoles={['student']}><StudentSQLRace /></ProtectedRoute>} />
        <Route path="/student/daily-duel"      element={<ProtectedRoute allowedRoles={['student']}><StudentDailyDuel /></ProtectedRoute>} />
        <Route path="/student/arena"           element={<ProtectedRoute allowedRoles={['student']}><ArenaPage /></ProtectedRoute>} />
        <Route path="/student/arena/duel/:roomId" element={<ProtectedRoute allowedRoles={['student']}><DuelRoomPage /></ProtectedRoute>} />
        <Route path="/student/sql-exam"       element={<ProtectedRoute allowedRoles={['student']}><SQLExamPage /></ProtectedRoute>} />
        <Route path="/student/skill-passport" element={<ProtectedRoute allowedRoles={['student']}><SkillPassportPage /></ProtectedRoute>} />
        <Route path="/student/kudos"          element={<ProtectedRoute allowedRoles={['student']}><KudosPage /></ProtectedRoute>} />
        <Route path="/student/time-capsule"   element={<ProtectedRoute allowedRoles={['student']}><TimeCapsulePage /></ProtectedRoute>} />
        <Route path="/hall-of-fame"           element={<ProtectedRoute allowedRoles={['student','lecturer','teachingAssistant']}><HallOfFame /></ProtectedRoute>} />
        <Route path="/alumni"                 element={<ProtectedRoute allowedRoles={['student','lecturer','teachingAssistant']}><AlumniWall /></ProtectedRoute>} />

        {/* Lecturer routes */}
        <Route path="/lecturer/dashboard"        element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><Dashboard /></ProtectedRoute>} />
        <Route path="/lecturer/students"         element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><StudentList /></ProtectedRoute>} />
        <Route path="/lecturer/students/:id"     element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><StudentDetail /></ProtectedRoute>} />
        <Route path="/lecturer/attendance"       element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><AttendanceSessions /></ProtectedRoute>} />
        <Route path="/lecturer/attendance/:id"   element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><AttendanceResults /></ProtectedRoute>} />
        <Route path="/lecturer/course-resources" element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><CourseResources /></ProtectedRoute>} />
        <Route path="/lecturer/mbi802-resources" element={<Navigate to="/lecturer/course-resources" replace />} />
        <Route path="/lecturer/playground"       element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><LivePlayground /></ProtectedRoute>} />
        <Route path="/lecturer/notices"          element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><NoticeBoard /></ProtectedRoute>} />
        <Route path="/lecturer/analytics"        element={<ProtectedRoute allowedRoles={['lecturer']}><SiteAnalytics /></ProtectedRoute>} />
        <Route path="/lecturer/video-manager"   element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><VideoLessonManager /></ProtectedRoute>} />
        <Route path="/lecturer/sql-race"         element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><LecturerSQLRace /></ProtectedRoute>} />
        <Route path="/lecturer/daily-duel"       element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><LecturerDailyDuel /></ProtectedRoute>} />
        <Route path="/lecturer/class-countdown"  element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><ClassCountdownPage /></ProtectedRoute>} />
        <Route path="/lecturer/classroom"         element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><ClassroomView /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function ShutdownRoutes() {
  return (
    <Routes>
      <Route path="*" element={<ShutdownPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          {PLATFORM_ACTIVE ? <AppRoutes /> : <ShutdownRoutes />}
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
