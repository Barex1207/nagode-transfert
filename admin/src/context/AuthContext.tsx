import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, ApiError, setCsrfToken } from '../lib/api';
import type { AdminUser, AuthResponse } from '../types';

interface AuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<AuthResponse>('/auth/me')
      .then((user) => {
        setCsrfToken(user.csrfToken);
        setAdmin(user);
      })
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await api.post<AuthResponse>('/auth/login', { email, password });
    setCsrfToken(user.csrfToken);
    setAdmin(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      if (!(err instanceof ApiError)) throw err;
    }
    setCsrfToken(undefined);
    setAdmin(null);
  }, []);

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
