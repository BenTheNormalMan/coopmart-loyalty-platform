import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { UserRole } from '../types/common';
import { decodeJwt, isTokenExpired } from '../utils/jwt';
import { storage } from '../utils/storage';

export interface AuthUser {
  sub: string;
  role: UserRole;
  email: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = storage.getToken();
    if (!stored) return null;
    const payload = decodeJwt(stored);
    if (!payload || isTokenExpired(payload)) {
      storage.clearSession();
      return null;
    }
    return { sub: payload.sub, role: payload.role, email: payload.email };
  });

  const login = useCallback((newToken: string) => {
    const payload = decodeJwt(newToken);
    if (!payload || isTokenExpired(payload)) return;
    storage.setToken(newToken);
    setToken(newToken);
    setUser({ sub: payload.sub, role: payload.role, email: payload.email });
  }, []);

  const logout = useCallback(() => {
    storage.clearSession();
    setToken(null);
    setUser(null);
  }, []);

  // Detect external token removal (e.g., 401 interceptor clears localStorage)
  useEffect(() => {
    const handler = () => {
      const stored = storage.getToken();
      if (!stored) {
        setToken(null);
        setUser(null);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
