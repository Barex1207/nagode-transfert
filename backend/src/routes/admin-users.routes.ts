import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { logAudit } from '../lib/audit.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { createAdminSchema, resetPasswordSchema, updateAdminSchema } from '../validators/schemas.js';

const router = Router();

const SAFE_SELECT = { id: true, email: true, name: true, role: true, isActive: true, createdAt: true, updatedAt: true };

router.use(requireAuth, requireRole('SUPER_ADMIN'));

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const admins = await prisma.adminUser.findMany({ select: SAFE_SELECT, orderBy: { createdAt: 'asc' } });
    res.json(admins);
  }),
);

router.post(
  '/',
  validateBody(createAdminSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role: 'SUPER_ADMIN' | 'EDITOR';
    };
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) throw new ApiError(409, 'Un administrateur avec cet e-mail existe déjà');

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.adminUser.create({
      data: { name, email, passwordHash, role },
      select: SAFE_SELECT,
    });
    await logAudit(req.admin, 'CREATE', 'AdminUser', admin.id, { email });
    res.status(201).json(admin);
  }),
);

router.patch(
  '/:id',
  validateBody(updateAdminSchema),
  asyncHandler(async (req, res) => {
    const exists = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Administrateur introuvable');
    if (exists.id === req.admin!.sub && req.body.role && req.body.role !== 'SUPER_ADMIN') {
      throw new ApiError(400, 'Vous ne pouvez pas retirer votre propre rôle super-admin');
    }
    if (exists.id === req.admin!.sub && req.body.isActive === false) {
      throw new ApiError(400, 'Vous ne pouvez pas désactiver votre propre compte');
    }
    const admin = await prisma.adminUser.update({ where: { id: req.params.id }, data: req.body, select: SAFE_SELECT });
    await logAudit(req.admin, 'UPDATE', 'AdminUser', admin.id, req.body);
    res.json(admin);
  }),
);

router.post(
  '/:id/reset-password',
  validateBody(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const exists = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Administrateur introuvable');
    const passwordHash = await bcrypt.hash(req.body.newPassword, 12);
    await prisma.adminUser.update({ where: { id: req.params.id }, data: { passwordHash } });
    await logAudit(req.admin, 'UPDATE', 'AdminUser', req.params.id, { action: 'reset_password' });
    res.status(204).send();
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (req.params.id === req.admin!.sub) {
      throw new ApiError(400, 'Vous ne pouvez pas supprimer votre propre compte');
    }
    const exists = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Administrateur introuvable');
    await prisma.adminUser.delete({ where: { id: req.params.id } });
    await logAudit(req.admin, 'DELETE', 'AdminUser', req.params.id);
    res.status(204).send();
  }),
);

export default router;
