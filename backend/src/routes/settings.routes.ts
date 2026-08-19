import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { settingsSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', asyncHandler(getSettings));
router.put('/', requireAuth, validateBody(settingsSchema), asyncHandler(updateSettings));

export default router;
