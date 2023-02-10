import { Controller, Post, Get, Body, Param, Put } from '@nestjs/common';
import { Project, User } from '@prisma/client';
import { UserModel } from 'src/user/model/user.model';
import { ProjectIdentifier, ConfigurableProjectSettings, ProjectCreateInput } from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller('/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  createProject(@Body() newProject: ProjectCreateInput): Promise<Project> {
    return this.projectService.createProject(newProject);
  }

  @Get()
  listProjects(): Promise<ProjectIdentifier[]> {
    return this.projectService.listProjects();
  }

  @Get(':id')
  getProject(@Param('id') id: string): Promise<Project> {
    return this.projectService.getProject(id);
  }

  @Put(':id')
  updateProject(@Param('id') id: string, @Body() settings: ConfigurableProjectSettings): Promise<Project> {
    return this.projectService.updateProject(id, settings);
  }

  @Get(':id/users')
  projectUsers(@Param('id') id: string): Promise<UserModel[]> {
    return this.projectService.getProjectUsers(id);
  }
}
