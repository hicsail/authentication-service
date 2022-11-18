import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '@prisma/client';

/**
 * Pipe to get a project based on the project ID
 */
@Injectable()
export class ProjectPipe implements PipeTransform {
  constructor(private projectService: ProjectService) {}

  async transform(id: string): Promise<Project> {
    try {
      return this.projectService.getProject(id);
    } catch (_e) {
      throw new BadRequestException('Invalid project ID');
    }
  }
}
