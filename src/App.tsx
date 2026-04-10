import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FullPageSpinner } from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth pages
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import StudentProfile    from './pages/student/StudentProfile';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentHistory    from './pages/student/StudentHistory';

// Lecturer pages
import Dashboard          from './pages/lecturer/Dashboard';
import StudentList        from './pages/lecturer/StudentList';
import StudentDetail      from './pages/lecturer/StudentDetail';
import AttendanceSessions from './pages/lecturer/AttendanceSessions';
import AttendanceResults  from './pages/lecturer/AttendanceResults';

function RootRedirect() {
  const { user, role, loading } = useAuth();
  if (loading)          return <FullPageSpinner />;
  if (!user)            return <Navigate to="/login"              replace />;
  if (role === 'lecturer') return <Navigate to="/lecturer/dashboard" replace />;
  return                       <Navigate to="/student/profile"    replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"        element={<RootRedirect />} />
      <Route path="/login"   element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student routes */}
      <Route path="/student/profile"    element={<ProtectedRoute requiredRole="student"><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute requiredRole="student"><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/history"    element={<ProtectedRoute requiredRole="student"><StudentHistory /></ProtectedRoute>} />

      {/* Lecturer routes */}
      <Route path="/lecturer/dashboard"         element={<ProtectedRoute requiredRole="lecturer"><Dashboard /></ProtectedRoute>} />
      <Route path="/lecturer/students"          element={<ProtectedRoute requiredRole="lecturer"><StudentList /></ProtectedRoute>} />
      <Route path="/lecturer/students/:id"      element={<ProtectedRoute requiredRole="lecturer"><StudentDetail /></ProtectedRoute>} />
      <Route path="/lecturer/attendance"        element={<ProtectedRoute requiredRole="lecturer"><AttendanceSessions /></ProtectedRoute>} />
      <Route path="/lecturer/attendance/:id"    element={<ProtectedRoute requiredRole="lecturer"><AttendanceResults /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}
