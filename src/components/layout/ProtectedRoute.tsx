import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FullPageSpinner } from '../ui/LoadingSpinner';
import type { UserRole } from '../../lib/types';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) return <FullPageSpinner />;
  if (!user)   return <Navigate to="/login" replace />;
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={role === 'student' ? '/student/profile' : '/lecturer/dashboard'} replace />;
  }

  return <>{children}</>;
}
