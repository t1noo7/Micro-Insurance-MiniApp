import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email: 'test@gmail.com',
      passwordHash,
      fullName: 'Test User',
      role: 'USER',
      isActive: true,
      tokenVersion: 0,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
