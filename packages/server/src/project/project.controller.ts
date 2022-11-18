import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { ProjectIdentifier } from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller('/project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('/create')
  createProject(@Body() newProject: Prisma.ProjectCreateInput): Promise<Project> {
    return this.projectService.createProject(newProject);
  }

  @Get('/list')
  listProjects(): Promise<ProjectIdentifier[]> {
    return this.projectService.listProjects();
  }

  @Get(':id')
  getProject(@Param('id') id: string): Promise<Project> {
    return this.projectService.getProject(id);
  }
}
