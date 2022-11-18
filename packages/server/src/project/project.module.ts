import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ProjectService, PrismaService],
  controllers: [ProjectController],
})
export class ProjectModule {}
