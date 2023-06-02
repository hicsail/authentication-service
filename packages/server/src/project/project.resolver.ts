import { Args, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { ConfigurableProjectSettings, ProjectAuthMethodsInput, ProjectCreateInput, ProjectSettingsInput } from './dto/project.dto';
import { ProjectService } from './project.service';
import { ProjectModel } from './model/project.model';
import { UserModel } from '../user/model/user.model';
import { ProjectSettingsModel } from './model/project-settings.model';
import { ProjectAuthMethodsModel } from './model/project-auth-methods.model';
import { UsernameLoginDto } from 'src/auth/dto/auth.dto';
import { BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Resolver(() => ProjectModel)
export class ProjectResolver {
  private readonly logger = new Logger(ProjectResolver.name);
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => ProjectModel)
  async createProject(@Args('project') project: ProjectCreateInput): Promise<ProjectModel> {
    const success = this.projectService.createProject(project);
    if (success) {
      this.logger.log('Project created');
      return success;
    } else {
      this.logger.error('Create Project Unsuccessful');
    }
  }

  @Query(() => [ProjectModel])
  async listProjects(): Promise<ProjectModel[]> {
    return this.projectService.getAllProjects();
  }

  @Query(() => ProjectModel)
  getProject(@Args('id') id: string): Promise<ProjectModel> {
    return this.projectService.getProject(id);
  }

  @Mutation(() => ProjectModel)
  updateProject(@Args('id') id: string, @Args('settings') settings: ConfigurableProjectSettings): Promise<ProjectModel> {
    const success = this.projectService.updateProject(id, settings);
    if (success) {
      this.logger.log('Project updated');
      return success;
    } else {
      this.logger.error('Update Project Unsuccessful');
    }
  }

  @Query(() => [UserModel])
  projectUsers(@Args('projectId') projectId: string): Promise<UserModel[]> {
    return this.projectService.getProjectUsers(projectId);
  }

  @ResolveField(() => [UserModel])
  async users(@Parent() { id }: ProjectModel): Promise<UserModel[]> {
    return this.projectService.getProjectUsers(id);
  }

  @ResolveField(() => ProjectSettingsModel)
  async settings(@Parent() { id }: ProjectModel): Promise<ProjectSettingsModel> {
    return this.projectService.getProjectSettings(id);
  }

  @ResolveField(() => ProjectAuthMethodsModel)
  async authMethods(@Parent() { id }: ProjectModel): Promise<ProjectAuthMethodsModel> {
    return this.projectService.getAuthSettings(id);
  }

  @Mutation(() => ProjectModel)
  async updateProjectSettings(@Args('id') id: string, @Args('projectSettings') projectSettings: ProjectSettingsInput): Promise<ProjectModel> {
    return this.projectService.updateProjectSettings(id, projectSettings);
  }

  @Mutation(() => ProjectModel)
  async updateProjectAuthMethods(@Args('id') id: string, @Args('projectAuthMethods') projectAuthMethods: ProjectAuthMethodsInput): Promise<ProjectModel> {
    return this.projectService.updateProjectAuthMethods(id, projectAuthMethods);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }): Promise<ProjectModel> {
    try {
      return await this.projectService.getProject(reference.id);
    } catch (e: any) {
      throw new BadRequestException(`Could not found project with ID ${reference.id}`);
    }
  }
}
