import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, PrismaService]
})
export class HealthModule {}
