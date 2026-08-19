import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { logAudit } from '../lib/audit.js';

const SETTINGS_ID = 'main';

export async function getSettings(_req: Request, res: Response) {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
  res.json(settings);
}

export async function updateSettings(req: Request, res: Response) {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: req.body,
    create: { id: SETTINGS_ID, ...req.body },
  });
  await logAudit(req.admin, 'UPDATE', 'SiteSettings', SETTINGS_ID);
  res.json(settings);
}
