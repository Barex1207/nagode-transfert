import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { Router } from 'express';
import { env } from '../lib/env.js';
import { uploadBufferToCloudinary } from '../lib/cloudinary.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ApiError } from '../middleware/errorHandler.js';
import { upload } from '../middleware/upload.js';

const router = Router();
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

router.post(
  '/',
  requireAuth,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'Aucun fichier reçu');

    if (env.cloudinaryEnabled) {
      const url = await uploadBufferToCloudinary(req.file.buffer);
      res.status(201).json({ url });
      return;
    }

    const ext = EXT_BY_MIME[req.file.mimetype] ?? '';
    const filename = `${crypto.randomUUID()}${ext}`;
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, filename), req.file.buffer);
    res.status(201).json({ url: `${env.publicUrl}/uploads/${filename}` });
  }),
);

export default router;
