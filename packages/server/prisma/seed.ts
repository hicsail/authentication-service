import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const masterProject = await prisma.project.findUnique({
    where: { id: '00000000-0000-0000-0000-000000000000' }
  });

  if (!masterProject) {
    await prisma.project.create({
      data: {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Master Project'
      }
    });
  }

  const rootUser = await prisma.user.findFirst({
    where: { id: '00000000-0000-0000-0000-000000000000', email: process.env.ROOT_EMAIL }
  });

  if (!rootUser) {
    await prisma.user.create({
      data: {
        projectId: '00000000-0000-0000-0000-000000000000',
        email: process.env.ROOT_EMAIL,
        password: process.env.ROOT_PASSWORD,
        role: 1
      }
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
