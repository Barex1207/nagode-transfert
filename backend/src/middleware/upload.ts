import multer from 'multer';
import { ApiError } from './errorHandler.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new ApiError(400, 'Format de fichier non autorisé (jpg, png, webp, gif uniquement)'));
      return;
    }
    cb(null, true);
  },
});
