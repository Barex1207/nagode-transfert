import { Router } from 'express';
import { makeCrudController } from '../controllers/crudFactory.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { fareSchema, reorderSchema } from '../validators/schemas.js';

const router = Router();
const ctrl = makeCrudController(prisma.fare, { order: 'asc' }, 'Fare');

router.get('/', asyncHandler(ctrl.list));
router.get('/:id', asyncHandler(ctrl.getOne));
router.patch('/reorder', requireAuth, validateBody(reorderSchema), asyncHandler(ctrl.reorder));
router.post('/', requireAuth, validateBody(fareSchema), asyncHandler(ctrl.create));
router.put('/:id', requireAuth, validateBody(fareSchema), asyncHandler(ctrl.update));
router.delete('/:id', requireAuth, asyncHandler(ctrl.remove));

export default router;
