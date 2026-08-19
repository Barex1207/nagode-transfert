import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';
import { prisma } from '../lib/prisma.js';
import { logAudit } from '../lib/audit.js';
import { ApiError } from '../middleware/errorHandler.js';

const COOKIE_NAME = 'token';
const CSRF_COOKIE_NAME = 'csrf_token';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? ('none' as const) : ('lax' as const),
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  };
}

function csrfCookieOptions() {
  return {
    httpOnly: false,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? ('none' as const) : ('lax' as const),
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  };
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.isActive) {
    await logAudit(undefined, 'LOGIN_FAILED', 'AdminUser', undefined, { email });
    throw new ApiError(401, 'Identifiants incorrects');
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    await logAudit(undefined, 'LOGIN_FAILED', 'AdminUser', admin.id, { email });
    throw new ApiError(401, 'Identifiants incorrects');
  }

  const token = jwt.sign({ sub: admin.id, email: admin.email, role: admin.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
  const csrfToken = crypto.randomBytes(32).toString('hex');

  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.cookie(CSRF_COOKIE_NAME, csrfToken, csrfCookieOptions());
  await logAudit({ sub: admin.id, email: admin.email, role: admin.role }, 'LOGIN', 'AdminUser', admin.id);
  res.json({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
  res.clearCookie(CSRF_COOKIE_NAME, { ...csrfCookieOptions(), maxAge: undefined });
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  const admin = await prisma.adminUser.findUnique({ where: { id: req.admin!.sub } });
  if (!admin || !admin.isActive) {
    throw new ApiError(401, 'Session invalide');
  }
  res.json({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
}

export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
  const admin = await prisma.adminUser.findUnique({ where: { id: req.admin!.sub } });
  if (!admin) throw new ApiError(401, 'Session invalide');

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) throw new ApiError(400, 'Mot de passe actuel incorrect');

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash } });
  await logAudit(req.admin, 'UPDATE', 'AdminUser', admin.id, { self: true, action: 'change_password' });
  res.status(204).send();
}
