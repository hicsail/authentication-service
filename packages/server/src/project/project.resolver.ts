import { Mutation, Args, Resolver } from '@nestjs/graphql';
import { ProjectCreateInput } from './dto/project.dto';
import { ProjectService } from './project.service';
import { ProjectModel } from './model/project.model';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => ProjectModel)
  async createProject(@Args('project') project: ProjectCreateInput): Promise<ProjectModel> {
    return this.projectService.createProject(project);
  }
}
