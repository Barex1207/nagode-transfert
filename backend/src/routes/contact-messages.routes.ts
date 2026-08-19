import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma.js';
import { logAudit } from '../lib/audit.js';
import { requireAuth } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { contactMessageCreateSchema, markReadSchema } from '../validators/schemas.js';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de messages envoyés, réessayez plus tard.' },
});

router.post(
  '/',
  submitLimiter,
  validateBody(contactMessageCreateSchema),
  asyncHandler(async (req, res) => {
    const message = await prisma.contactMessage.create({ data: req.body });
    res.status(201).json({ id: message.id });
  }),
);

router.get(
  '/',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  }),
);

router.patch(
  '/:id',
  requireAuth,
  validateBody(markReadSchema),
  asyncHandler(async (req, res) => {
    const exists = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Message introuvable');
    const updated = await prisma.contactMessage.update({ where: { id: req.params.id }, data: req.body });
    await logAudit(req.admin, 'UPDATE', 'ContactMessage', req.params.id, req.body);
    res.json(updated);
  }),
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const exists = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Message introuvable');
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    await logAudit(req.admin, 'DELETE', 'ContactMessage', req.params.id);
    res.status(204).send();
  }),
);

export default router;
