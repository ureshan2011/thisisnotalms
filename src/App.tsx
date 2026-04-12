import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FullPageSpinner } from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ToastProvider } from './components/ui/ToastProvider';
import ThemeToggle from './components/ui/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

// Auth pages
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import StudentDashboard  from './pages/student/StudentDashboard';
import StudentProfile    from './pages/student/StudentProfile';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentHistory    from './pages/student/StudentHistory';
import QuickAttend       from './pages/student/QuickAttend';
import MBI802Resources   from './pages/student/MBI802Resources';

// Lecturer pages
import Dashboard          from './pages/lecturer/Dashboard';
import StudentList        from './pages/lecturer/StudentList';
import StudentDetail      from './pages/lecturer/StudentDetail';
import AttendanceSessions from './pages/lecturer/AttendanceSessions';
import AttendanceResults  from './pages/lecturer/AttendanceResults';
import EventLog from './pages/lecturer/EventLog';

function RootRedirect() {
  const { user, role, loading } = useAuth();
  if (loading)          return <FullPageSpinner />;
  if (!user)            return <Navigate to="/login"              replace />;
  if (role === 'lecturer' || role === 'teachingAssistant') return <Navigate to="/lecturer/dashboard" replace />;
  return                       <Navigate to="/student/dashboard"  replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"        element={<RootRedirect />} />
      <Route path="/login"        element={<Login />} />
      <Route path="/register"     element={<Register />} />
      <Route path="/attend/:code" element={<QuickAttend />} />

      {/* Student routes */}
      <Route path="/student/dashboard"  element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/profile"    element={<ProtectedRoute allowedRoles={["student"]}><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={["student"]}><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/history"    element={<ProtectedRoute allowedRoles={["student"]}><StudentHistory /></ProtectedRoute>} />
      <Route path="/student/mbi802-resources" element={<ProtectedRoute allowedRoles={["student"]}><MBI802Resources /></ProtectedRoute>} />

      {/* Lecturer routes */}
      <Route path="/lecturer/dashboard"         element={<ProtectedRoute allowedRoles={["lecturer", "teachingAssistant"]}><Dashboard /></ProtectedRoute>} />
      <Route path="/lecturer/students"          element={<ProtectedRoute allowedRoles={["lecturer", "teachingAssistant"]}><StudentList /></ProtectedRoute>} />
      <Route path="/lecturer/students/:id"      element={<ProtectedRoute allowedRoles={["lecturer", "teachingAssistant"]}><StudentDetail /></ProtectedRoute>} />
      <Route path="/lecturer/attendance"        element={<ProtectedRoute allowedRoles={["lecturer", "teachingAssistant"]}><AttendanceSessions /></ProtectedRoute>} />
      <Route path="/lecturer/attendance/:id"    element={<ProtectedRoute allowedRoles={["lecturer", "teachingAssistant"]}><AttendanceResults /></ProtectedRoute>} />
      <Route path="/lecturer/event-log"         element={<ProtectedRoute allowedRoles={["lecturer", "teachingAssistant"]}><EventLog /></ProtectedRoute>} />
      <Route path="/lecturer/mbi802-resources" element={<ProtectedRoute allowedRoles={["lecturer", "teachingAssistant"]}><MBI802Resources /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <HashRouter>
            <AppRoutes />
            <ThemeToggle />
          </HashRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
