import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL ?? 'admin@nagodetransfert.com';
  const password = process.env.ADMIN_SEED_PASSWORD ?? 'ChangeMoi123!';
  const name = process.env.ADMIN_SEED_NAME ?? 'Administrateur';

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`L'administrateur ${email} existe déjà, aucune action effectuée.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({ data: { email, passwordHash, name } });
  console.log(`Administrateur créé : ${email}`);

  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' },
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
