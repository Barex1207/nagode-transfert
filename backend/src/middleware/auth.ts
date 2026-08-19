import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';
import { ApiError } from './errorHandler.js';

export interface AuthPayload {
  sub: string;
  email: string;
  role: 'SUPER_ADMIN' | 'EDITOR';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    return next(new ApiError(401, 'Authentification requise'));
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    req.admin = payload;
  } catch {
    return next(new ApiError(401, 'Session invalide ou expirée'));
  }

  if (UNSAFE_METHODS.has(req.method)) {
    const csrfCookie = req.cookies?.csrf_token as string | undefined;
    const csrfHeader = req.headers['x-csrf-token'];
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return next(new ApiError(403, 'Jeton CSRF invalide ou manquant'));
    }
  }

  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined;
  if (token) {
    try {
      req.admin = jwt.verify(token, env.jwtSecret) as AuthPayload;
    } catch {
      // Jeton invalide : on continue en tant que visiteur anonyme.
    }
  }
  next();
}

export function requireRole(...roles: Array<AuthPayload['role']>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(new ApiError(403, 'Accès réservé aux administrateurs autorisés'));
    }
    next();
  };
}
