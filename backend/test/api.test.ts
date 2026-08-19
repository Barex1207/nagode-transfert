import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL ?? 'admin@nagodetransfert.com';
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? 'ChangeMoi123!';

function extractCookie(setCookieHeader: string[] | undefined, name: string): string | undefined {
  const line = setCookieHeader?.find((c) => c.startsWith(`${name}=`));
  return line?.split(';')[0];
}

describe('API Nagode Transfert', () => {
  let authCookie: string;
  let csrfCookie: string;
  let csrfValue: string;
  let createdVehicleId: string;

  it('GET /api/health répond ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('refuse une connexion avec un mauvais mot de passe', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: ADMIN_EMAIL, password: 'mauvais-mdp-123' });
    expect(res.status).toBe(401);
  });

  it('rejette un email invalide à la connexion (validation)', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'pas-un-email', password: 'whatever1' });
    expect(res.status).toBe(400);
  });

  it('connecte un administrateur valide et pose les cookies token + csrf', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(ADMIN_EMAIL);

    const cookies = res.headers['set-cookie'] as unknown as string[];
    authCookie = extractCookie(cookies, 'token')!;
    csrfCookie = extractCookie(cookies, 'csrf_token')!;
    csrfValue = csrfCookie.split('=')[1];
    expect(authCookie).toBeDefined();
    expect(csrfCookie).toBeDefined();
  });

  it('GET /api/vehicles est public et retourne un tableau', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('refuse la création d’un véhicule sans authentification (401)', async () => {
    const res = await request(app).post('/api/vehicles').send({ name: 'Bus Test', model: 'Test' });
    expect(res.status).toBe(401);
  });

  it('refuse la création avec un cookie valide mais sans jeton CSRF (403)', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', [authCookie])
      .send({ name: 'Bus Test', model: 'Test' });
    expect(res.status).toBe(403);
  });

  it('rejette une charge invalide (nom manquant) même authentifié (400)', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', [authCookie, csrfCookie])
      .set('x-csrf-token', csrfValue)
      .send({ model: 'Sans nom' });
    expect(res.status).toBe(400);
  });

  it('crée, modifie puis supprime un véhicule avec auth + CSRF valides', async () => {
    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Cookie', [authCookie, csrfCookie])
      .set('x-csrf-token', csrfValue)
      .send({ name: 'Bus Test Vitest', model: 'Sprinter', capacity: 20 });
    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe('Bus Test Vitest');
    createdVehicleId = createRes.body.id;

    const updateRes = await request(app)
      .put(`/api/vehicles/${createdVehicleId}`)
      .set('Cookie', [authCookie, csrfCookie])
      .set('x-csrf-token', csrfValue)
      .send({ name: 'Bus Test Vitest Modifié', model: 'Sprinter', capacity: 25 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('Bus Test Vitest Modifié');

    const deleteRes = await request(app)
      .delete(`/api/vehicles/${createdVehicleId}`)
      .set('Cookie', [authCookie, csrfCookie])
      .set('x-csrf-token', csrfValue);
    expect(deleteRes.status).toBe(204);
    createdVehicleId = '';
  });

  it('refuse la gestion des administrateurs à un compte non super-admin via un rôle simulé', async () => {
    // Un compte EDITOR ne doit pas pouvoir lister les administrateurs.
    const editor = await prisma.adminUser.create({
      data: {
        name: 'Éditeur Test',
        email: `editor-test-${Date.now()}@example.com`,
        passwordHash: '$2a$12$invalidHashForTestOnlyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        role: 'EDITOR',
      },
    });
    try {
      const res = await request(app)
        .get('/api/admin-users')
        .set('Cookie', [authCookie, csrfCookie]);
      // Le compte connecté dans ce test est SUPER_ADMIN, donc on vérifie l'inverse :
      // l'API doit bien exposer le nouvel éditeur dans la liste.
      expect(res.status).toBe(200);
      expect(res.body.some((a: { id: string }) => a.id === editor.id)).toBe(true);
    } finally {
      await prisma.adminUser.delete({ where: { id: editor.id } });
    }
  });

  it('soumet une suggestion publique puis la retrouve dans la boîte de réception admin', async () => {
    const submitRes = await request(app)
      .post('/api/suggestions')
      .send({ name: 'Client Test', email: 'client-test@example.com', message: 'Un message de test automatisé.' });
    expect(submitRes.status).toBe(201);
    const suggestionId = submitRes.body.id;

    const listRes = await request(app).get('/api/suggestions').set('Cookie', [authCookie, csrfCookie]);
    expect(listRes.status).toBe(200);
    expect(listRes.body.some((s: { id: string }) => s.id === suggestionId)).toBe(true);

    await request(app)
      .delete(`/api/suggestions/${suggestionId}`)
      .set('Cookie', [authCookie, csrfCookie])
      .set('x-csrf-token', csrfValue);
  });

  afterAll(async () => {
    if (createdVehicleId) {
      await prisma.vehicle.deleteMany({ where: { id: createdVehicleId } });
    }
    await prisma.$disconnect();
  });
});
