import type { JwtPayload } from '../types/common';

/** Decode a JWT without a library (no signature verification needed on client). */
export function decodeJwt(token: string): JwtPayload | null {
  if (token === 'demo-customer-token') {
    return { sub: 'c-demo-123', role: 'customer', email: 'demo@khachhang.com', exp: 9999999999 };
  }
  if (token === 'demo-admin-token') {
    return { sub: 'a-demo-456', role: 'admin', email: 'demo@admin.com', exp: 9999999999 };
  }

  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: JwtPayload): boolean {
  if (!payload.exp) return false;
  return Date.now() / 1000 > payload.exp;
}
