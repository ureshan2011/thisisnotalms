import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FullPageSpinner } from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ToastProvider } from './components/ui/ToastProvider';

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
const Dashboard          = lazy(() => import('./pages/lecturer/Dashboard'));
const StudentList        = lazy(() => import('./pages/lecturer/StudentList'));
const StudentDetail      = lazy(() => import('./pages/lecturer/StudentDetail'));
const AttendanceSessions = lazy(() => import('./pages/lecturer/AttendanceSessions'));
const AttendanceResults  = lazy(() => import('./pages/lecturer/AttendanceResults'));
const LivePlayground     = lazy(() => import('./pages/lecturer/LivePlayground'));
const SiteAnalytics      = lazy(() => import('./pages/lecturer/SiteAnalytics'));

function RootRedirect() {
  const { user, role, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user)   return <Navigate to="/login" replace />;
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

        {/* Student routes */}
        <Route path="/student/dashboard"       element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile"         element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/attendance"      element={<ProtectedRoute allowedRoles={['student']}><StudentAttendance /></ProtectedRoute>} />
        <Route path="/student/history"         element={<ProtectedRoute allowedRoles={['student']}><StudentHistory /></ProtectedRoute>} />
        <Route path="/student/course-resources" element={<ProtectedRoute allowedRoles={['student']}><CourseResources /></ProtectedRoute>} />
        <Route path="/student/mbi802-resources" element={<Navigate to="/student/course-resources" replace />} />
        <Route path="/student/playground"      element={<ProtectedRoute allowedRoles={['student']}><StudentPlayground /></ProtectedRoute>} />
        <Route path="/student/notices"         element={<ProtectedRoute allowedRoles={['student']}><NoticeBoard /></ProtectedRoute>} />

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
        <Route path="/lecturer/analytics"        element={<ProtectedRoute allowedRoles={['lecturer', 'teachingAssistant']}><SiteAnalytics /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
