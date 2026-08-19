import { Router } from 'express';
import { makeCrudController } from '../controllers/crudFactory.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { reorderSchema, scheduleSchema } from '../validators/schemas.js';

const router = Router();
const ctrl = makeCrudController(prisma.schedule, { order: 'asc' }, 'Schedule');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const agencyId = typeof req.query.agencyId === 'string' ? req.query.agencyId : undefined;
    const schedules = await prisma.schedule.findMany({
      where: agencyId ? { agencyId } : undefined,
      orderBy: { order: 'asc' },
      include: { agency: { select: { id: true, city: true, country: true } } },
    });
    res.json(schedules);
  }),
);
router.get('/:id', asyncHandler(ctrl.getOne));
router.patch('/reorder', requireAuth, validateBody(reorderSchema), asyncHandler(ctrl.reorder));
router.post('/', requireAuth, validateBody(scheduleSchema), asyncHandler(ctrl.create));
router.put('/:id', requireAuth, validateBody(scheduleSchema), asyncHandler(ctrl.update));
router.delete('/:id', requireAuth, asyncHandler(ctrl.remove));

export default router;
