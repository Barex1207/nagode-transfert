import { prisma } from './prisma.js';
import type { AuthPayload } from '../middleware/auth.js';

export async function logAudit(
  admin: AuthPayload | undefined,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGIN_FAILED',
  resourceType: string,
  resourceId?: string,
  metadata?: unknown,
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: admin?.sub ?? null,
        adminEmail: admin?.email ?? 'anonyme',
        action,
        resourceType,
        resourceId: resourceId ?? null,
        metadata: metadata ? (metadata as any) : undefined,
      },
    });
  } catch (err) {
    console.error("Échec de l'écriture du journal d'activité :", err);
  }
}
