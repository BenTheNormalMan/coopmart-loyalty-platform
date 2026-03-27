import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/common';

interface RequireAuthProps {
  role: UserRole;
  children: React.ReactNode;
}

/**
 * Route guard — redirects unauthenticated users to /login
 * and wrong-role users to their correct home.
 */
export function RequireAuth({ role, children }: RequireAuthProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const redirect = role === 'admin' ? '/auth/admin/login' : '/auth/customer/login';
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    // Redirect to the correct area
    const home = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}
