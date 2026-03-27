import type { UserRole } from '../types/common';

export function getRedirectPathForRole(role: UserRole | null | undefined): string {
  if (role === 'admin') return '/admin';
  if (role === 'customer') return '/dashboard';
  return '/auth/customer/login';
}

export function getLoginPathForRole(role: UserRole | string): string {
  if (role === 'admin') return '/auth/admin/login';
  return '/auth/customer/login';
}
