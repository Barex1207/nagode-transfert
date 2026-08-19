import { Router } from 'express';
import { makeCrudController } from '../controllers/crudFactory.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { faqItemSchema, reorderSchema } from '../validators/schemas.js';

const router = Router();
const ctrl = makeCrudController(prisma.faqItem, { order: 'asc' }, 'FaqItem');

router.get('/', asyncHandler(ctrl.list));
router.get('/:id', asyncHandler(ctrl.getOne));
router.patch('/reorder', requireAuth, validateBody(reorderSchema), asyncHandler(ctrl.reorder));
router.post('/', requireAuth, validateBody(faqItemSchema), asyncHandler(ctrl.create));
router.put('/:id', requireAuth, validateBody(faqItemSchema), asyncHandler(ctrl.update));
router.delete('/:id', requireAuth, asyncHandler(ctrl.remove));

export default router;
