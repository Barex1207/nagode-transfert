import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AdminRole } from '../types';

export function RequireRole({ role, children }: { role: AdminRole; children: React.ReactNode }) {
  const { admin } = useAuth();
  if (admin?.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
