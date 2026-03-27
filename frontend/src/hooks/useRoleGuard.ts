import { useAuth } from './useAuth';
import type { UserRole } from '../types/common';
import { getLoginPathForRole } from '../utils/guards';

export function useRoleGuard(requiredRole: UserRole) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return { isAuthorized: false, redirectPath: getLoginPathForRole(requiredRole) };
  }
  
  if (user.role !== requiredRole) {
    // Has a session but wrong role. Logout or force appropriate login path.
    return { isAuthorized: false, redirectPath: getLoginPathForRole(user.role) };
  }
  
  return { isAuthorized: true, redirectPath: null };
}
