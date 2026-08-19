import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma.js';
import { logAudit } from '../lib/audit.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { testimonialCreateSchema, testimonialModerateSchema } from '../validators/schemas.js';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop d’avis envoyés, réessayez plus tard.' },
});

router.post(
  '/',
  submitLimiter,
  validateBody(testimonialCreateSchema),
  asyncHandler(async (req, res) => {
    const testimonial = await prisma.testimonial.create({ data: req.body });
    res.status(201).json({ id: testimonial.id });
  }),
);

router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const testimonials = await prisma.testimonial.findMany({
      where: req.admin ? undefined : { approved: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(testimonials);
  }),
);

router.patch(
  '/:id',
  requireAuth,
  validateBody(testimonialModerateSchema),
  asyncHandler(async (req, res) => {
    const exists = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Avis introuvable');
    const updated = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
    await logAudit(req.admin, 'UPDATE', 'Testimonial', req.params.id, req.body);
    res.json(updated);
  }),
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const exists = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new ApiError(404, 'Avis introuvable');
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    await logAudit(req.admin, 'DELETE', 'Testimonial', req.params.id);
    res.status(204).send();
  }),
);

export default router;
