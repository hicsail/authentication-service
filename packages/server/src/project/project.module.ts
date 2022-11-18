import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectPipe } from './project.pipe';

@Module({
  providers: [ProjectService, PrismaService, ProjectPipe],
  controllers: [ProjectController]
})
export class ProjectModule {}
