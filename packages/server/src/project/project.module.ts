import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectPipe } from './project.pipe';
import { ProjectResolver } from './project.resolver';

@Module({
  providers: [ProjectService, PrismaService, ProjectPipe, ProjectResolver],
  controllers: [ProjectController],
  exports: [ProjectService]
})
export class ProjectModule {}
