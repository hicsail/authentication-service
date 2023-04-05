import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project, User } from '@prisma/client';
import { ConfigurableProjectSettings, ProjectAuthMethodsInput, ProjectIdentifier, ProjectSettingsInput } from './dto/project.dto';
import { ProjectSettingsModel } from './model/project-settings.model';
import { ProjectAuthMethodsModel } from './model/project-auth-methods.model';
import { UsernameLoginDto } from '../auth/dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService, private userService: UserService, private configService: ConfigService) {}

  /**
   * Create a new project. If the project ID is provided and a project with
   * the same ID exists, will throw an error.
   *
   * @param newProject Information on the project to create
   * @returns The newly created project
   * @throws Will throw an error if the project ID is already in use or an error if the user is not authorized to create a project
   */
  async createProject(newProject: Prisma.ProjectCreateInput, authServiceUser: UsernameLoginDto): Promise<Project> {
    // ProjectCreateInput by default allows the ID to be provided, but we
    // don't want to allow that. If the ID is provided, we remove it
    if (newProject.id) {
      delete newProject.id;
    }

    if (
      authServiceUser.projectId == '00000000-0000-0000-0000-000000000000' &&
      authServiceUser.username == this.configService.get('ROOT_EMAIL') &&
      authServiceUser.password == this.configService.get('ROOT_PASSWORD')
    ) {
      const project = await this.prisma.project.create({
        data: newProject
      });

      const user = await this.userService.createUser({
        projectId: project.id,
        username: this.configService.get('EXAMPLE_USERNAME'),
        password: this.configService.get('EXAMPLE_PASSWORD')
      });

      console.log(user);
      return project;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * List basic project information for all projects.
   *
   * @returns An array of project information
   */
  async listProjects(): Promise<ProjectIdentifier[]> {
    return this.prisma.project.findMany({
      select: {
        id: true,
        name: true
      }
    });
  }

  /**
   * List basic project information for all projects.
   *
   * @returns An array of project information
   */
  async getProjects(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  /**
   * Get detailed information on a project.
   *
   * @param id The ID of the project to get
   * @returns Detailed information on the project
   * @throws Will throw an error if the project does not exist
   */
  async getProject(id: string): Promise<Project> {
    return this.prisma.project.findFirstOrThrow({ where: { id } });
  }

  /**
   * Update the project settings.
   *
   * Project settings that are provided in the given object will be updated.
   * Project settings that are not provided will not be changed.
   *
   * @param id The ID of the project to update
   * @param settings The new settings to apply
   * @returns The updated project
   * @throws Will throw an error if the project does not exist
   */
  async updateProject(id: string, settings: ConfigurableProjectSettings): Promise<Project> {
    return this.prisma.project.update({
      where: {
        id: id
      },
      data: settings
    });
  }

  /**
   * Check if a project exists. If the projectId is not provided, will
   * return false.
   *
   * @param projectId The project id to check
   * @returns True if the project exists, false otherwise
   */
  async exists(projectId: string): Promise<boolean> {
    try {
      await this.getProject(projectId);
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * For a given project return a list of users
   *
   * @param projectId The project id to check
   * @returns A list of users belonging to the given project
   * @throws Will throw a NotFoundException error if the project does not exist
   */
  async getProjectUsers(projectId: string): Promise<User[]> {
    await this.getProject(projectId); // Check if the project exists
    return this.prisma.user.findMany({
      where: {
        projectId: projectId
      }
    });
  }

  /**
   * For a given project return its project settings
   *
   * @param projectId The project id to check
   * @returns Project Settings
   * @throws Will throw a NotFoundException error if the project does not exist
   */
  async getProjectSettings(projectId: string): Promise<ProjectSettingsModel> {
    return this.prisma.project.findFirstOrThrow({
      where: { id: projectId },
      select: { displayProjectName: true, allowSignup: true }
    });
  }

  /**
   * For a given project return its auth settings
   *
   * @param projectId The project id to check
   * @returns Auth Settings
   * @throws Will throw a NotFoundException error if the project does not exist
   */
  async getAuthSettings(projectId: string): Promise<ProjectAuthMethodsModel> {
    return this.prisma.project.findFirstOrThrow({
      where: { id: projectId },
      select: { googleAuth: true }
    });
  }

  /**
   * Update the project settings.
   *
   * Project settings that are provided in the given object will be updated.
   * Project settings that are not provided will not be changed.
   *
   * @param id The ID of the project to update
   * @param settings The new settings to apply
   * @returns The updated project
   * @throws Will throw an error if the project does not exist
   */
  async updateProjectSettings(id: string, projectSettings: ProjectSettingsInput): Promise<Project> {
    await this.getProject(id); // Check if the project exists
    return this.prisma.project.update({
      where: {
        id: id
      },
      data: projectSettings
    });
  }

  /**
   * Update the project auth methods.
   *
   * Project auth methods that are provided in the given object will be updated.
   * Project auth methods that are not provided will not be changed.
   *
   * @param id The ID of the project to update
   * @param settings The new auth methods to apply
   * @returns The updated project
   * @throws Will throw an error if the project does not exist
   */
  async updateProjectAuthMethods(id: string, projectAuthMethods: ProjectAuthMethodsInput): Promise<Project> {
    await this.getProject(id); // Check if the project exists
    return this.prisma.project.update({
      where: {
        id: id
      },
      data: projectAuthMethods
    });
  }
}
