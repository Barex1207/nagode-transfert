import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { changePassword, login, logout, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { changePasswordSchema, loginSchema } from '../validators/schemas.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives de connexion, réessayez plus tard.' },
});

router.post('/login', loginLimiter, validateBody(loginSchema), asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', requireAuth, asyncHandler(me));
router.post('/change-password', requireAuth, validateBody(changePasswordSchema), asyncHandler(changePassword));

export default router;
