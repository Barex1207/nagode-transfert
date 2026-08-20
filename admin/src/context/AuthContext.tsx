import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError, setCsrfToken } from '../lib/api';
import type { AdminUser, AuthResponse } from '../types';

interface AuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Auto sign out after this long without any mouse/keyboard/touch activity —
// standard practice for admin dashboards, distinct from the JWT's own
// 7-day absolute expiry which still applies as a hard ceiling regardless.
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

  useEffect(() => {
    if (!admin) return;

    const resetTimer = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        logout().then(() => navigate('/login?raison=inactivite', { replace: true }));
      }, IDLE_TIMEOUT_MS);
    };

    resetTimer();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(idleTimer.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [admin, logout, navigate]);

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
