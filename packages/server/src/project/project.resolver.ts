import { Mutation, Args, Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { ConfigurableProjectSettings, ProjectCreateInput } from './dto/project.dto';
import { ProjectService } from './project.service';
import { ProjectModel } from './model/project.model';
import { UserModel } from '../user/model/user.model';

@Resolver(() => ProjectModel)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => ProjectModel)
  async createProject(@Args('project') project: ProjectCreateInput): Promise<ProjectModel> {
    return this.projectService.createProject(project);
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
    return this.projectService.updateProject(id, settings);
  }

  @Query(() => [UserModel])
  projectUsers(@Args('projectId') projectId: string): Promise<UserModel[]> {
    return this.projectService.getProjectUsers(projectId);
  }

  @ResolveField(() => [UserModel])
  async users(@Parent() { id }: ProjectModel): Promise<UserModel[]> {
    return this.projectService.getProjectUsers(id);
  }
}
