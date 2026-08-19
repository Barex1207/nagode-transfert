import type { Request, Response } from 'express';
import { ApiError } from '../middleware/errorHandler.js';
import { logAudit } from '../lib/audit.js';

interface Delegate {
  findMany: (args?: any) => Promise<unknown[]>;
  findUnique: (args: { where: { id: string } }) => Promise<unknown | null>;
  create: (args: { data: any }) => Promise<unknown>;
  update: (args: { where: { id: string }; data: any }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
}

export function makeCrudController(delegate: Delegate, orderBy: Record<string, 'asc' | 'desc'>, resourceType = 'resource') {
  return {
    list: async (_req: Request, res: Response) => {
      const items = await delegate.findMany({ orderBy });
      res.json(items);
    },
    getOne: async (req: Request, res: Response) => {
      const item = await delegate.findUnique({ where: { id: req.params.id } });
      if (!item) throw new ApiError(404, 'Ressource introuvable');
      res.json(item);
    },
    create: async (req: Request, res: Response) => {
      const item = await delegate.create({ data: req.body });
      await logAudit(req.admin, 'CREATE', resourceType, (item as any).id);
      res.status(201).json(item);
    },
    update: async (req: Request, res: Response) => {
      const exists = await delegate.findUnique({ where: { id: req.params.id } });
      if (!exists) throw new ApiError(404, 'Ressource introuvable');
      const item = await delegate.update({ where: { id: req.params.id }, data: req.body });
      await logAudit(req.admin, 'UPDATE', resourceType, req.params.id);
      res.json(item);
    },
    remove: async (req: Request, res: Response) => {
      const exists = await delegate.findUnique({ where: { id: req.params.id } });
      if (!exists) throw new ApiError(404, 'Ressource introuvable');
      await delegate.delete({ where: { id: req.params.id } });
      await logAudit(req.admin, 'DELETE', resourceType, req.params.id);
      res.status(204).send();
    },
    reorder: async (req: Request, res: Response) => {
      const { items } = req.body as { items: Array<{ id: string; order: number }> };
      await Promise.all(items.map((item) => delegate.update({ where: { id: item.id }, data: { order: item.order } })));
      await logAudit(req.admin, 'UPDATE', resourceType, undefined, { action: 'reorder', count: items.length });
      res.status(204).send();
    },
  };
}
