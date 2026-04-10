import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FullPageSpinner } from '../ui/LoadingSpinner';
import type { UserRole } from '../../lib/types';

interface Props {
  children:     React.ReactNode;
  requiredRole: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) return <FullPageSpinner />;
  if (!user)   return <Navigate to="/login" replace />;
  if (role !== requiredRole) {
    return <Navigate to={role === 'lecturer' ? '/lecturer/dashboard' : '/student/profile'} replace />;
  }

  return <>{children}</>;
}
