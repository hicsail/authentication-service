import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function bootstrap() {
  //const user = await prisma.user.create({ data: { name: '' } });
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
