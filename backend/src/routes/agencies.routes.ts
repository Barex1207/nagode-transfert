import { Router } from 'express';
import { makeCrudController } from '../controllers/crudFactory.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { agencySchema, reorderSchema } from '../validators/schemas.js';

const router = Router();
const ctrl = makeCrudController(prisma.agency, { order: 'asc' }, 'Agency');

router.get('/', asyncHandler(ctrl.list));
router.get('/:id', asyncHandler(ctrl.getOne));
router.patch('/reorder', requireAuth, validateBody(reorderSchema), asyncHandler(ctrl.reorder));
router.post('/', requireAuth, validateBody(agencySchema), asyncHandler(ctrl.create));
router.put('/:id', requireAuth, validateBody(agencySchema), asyncHandler(ctrl.update));
router.delete('/:id', requireAuth, asyncHandler(ctrl.remove));

export default router;
