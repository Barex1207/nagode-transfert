import { Router } from 'express';
import { makeCrudController } from '../controllers/crudFactory.js';
import { prisma } from '../lib/prisma.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { newsSchema } from '../validators/schemas.js';

const router = Router();
const ctrl = makeCrudController(prisma.news, { publishedAt: 'desc' }, 'News');

router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const news = await prisma.news.findMany({
      where: req.admin ? undefined : { published: true },
      orderBy: { publishedAt: 'desc' },
    });
    res.json(news);
  }),
);
router.get('/:id', asyncHandler(ctrl.getOne));
router.post('/', requireAuth, validateBody(newsSchema), asyncHandler(ctrl.create));
router.put('/:id', requireAuth, validateBody(newsSchema), asyncHandler(ctrl.update));
router.delete('/:id', requireAuth, asyncHandler(ctrl.remove));

export default router;
