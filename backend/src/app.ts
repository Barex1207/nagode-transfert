import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './lib/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import adminUsersRoutes from './routes/admin-users.routes.js';
import agenciesRoutes from './routes/agencies.routes.js';
import auditLogRoutes from './routes/audit-log.routes.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import contactMessagesRoutes from './routes/contact-messages.routes.js';
import destinationsRoutes from './routes/destinations.routes.js';
import faqRoutes from './routes/faq.routes.js';
import faresRoutes from './routes/fares.routes.js';
import newsRoutes from './routes/news.routes.js';
import schedulesRoutes from './routes/schedules.routes.js';
import servicesRoutes from './routes/services.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import suggestionsRoutes from './routes/suggestions.routes.js';
import supportNumbersRoutes from './routes/support-numbers.routes.js';
import teamMembersRoutes from './routes/team-members.routes.js';
import testimonialsRoutes from './routes/testimonials.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import vehiclesRoutes from './routes/vehicles.routes.js';

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par la politique CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const globalLimiter = rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false });
app.use(globalLimiter);

app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/agencies', agenciesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/fares', faresRoutes);
app.use('/api/support-numbers', supportNumbersRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/contact-messages', contactMessagesRoutes);
app.use('/api/admin-users', adminUsersRoutes);
app.use('/api/audit-log', auditLogRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/team-members', teamMembersRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
