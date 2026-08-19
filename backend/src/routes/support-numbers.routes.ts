import { Router } from 'express';
import { makeCrudController } from '../controllers/crudFactory.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { supportNumberSchema } from '../validators/schemas.js';

const router = Router();
const ctrl = makeCrudController(prisma.supportNumber, { order: 'asc' }, 'SupportNumber');

router.get('/', asyncHandler(ctrl.list));
router.get('/:id', asyncHandler(ctrl.getOne));
router.post('/', requireAuth, validateBody(supportNumberSchema), asyncHandler(ctrl.create));
router.put('/:id', requireAuth, validateBody(supportNumberSchema), asyncHandler(ctrl.update));
router.delete('/:id', requireAuth, asyncHandler(ctrl.remove));

export default router;
