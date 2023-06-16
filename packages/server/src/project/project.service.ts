import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project, User } from '@prisma/client';
import { ConfigurableProjectSettings, ProjectAuthMethodsInput, ProjectIdentifier, ProjectSettingsInput } from './dto/project.dto';
import { ProjectSettingsModel } from './model/project-settings.model';
import { ProjectAuthMethodsModel } from './model/project-auth-methods.model';
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
  async createProject(newProject: Prisma.ProjectCreateInput): Promise<Project> {
    const project = await this.prisma.project.create({
      data: newProject
    });
    return project;
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
   * Get all projects
   */
  async getAllProjects(): Promise<Project[]> {
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
  async exists(projectId: string | undefined): Promise<boolean> {
    // If the project ID is not provided, return false
    if (!projectId) {
      return false;
    }

    // Return true if there is a project with the provided ID
    const projectCount = await this.prisma.project.count({
      where: {
        id: projectId
      }
    });
    return projectCount > 0;
  }
  /**
   * For a given project return a list of users
   *
   * @param projectId The project id to check
   * @returns A list of users belonging to the given project
   * @throws Will throw a NotFoundException error if the project does not exist
   */
  async getProjectUsers(projectId: string): Promise<User[]> {
    const projectExists = await this.exists(projectId);
    if (!projectExists) {
      throw new NotFoundException();
    }

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
    const projectExists = await this.exists(projectId);
    if (!projectExists) {
      throw new NotFoundException();
    }

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
    const projectExists = await this.exists(projectId);
    if (!projectExists) {
      throw new NotFoundException();
    }

    return this.prisma.project.findFirstOrThrow({
      where: { id: projectId },
      select: { googleAuth: true, emailAuth: true }
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
    const projectExists = await this.exists(id);
    if (!projectExists) {
      throw new NotFoundException();
    }

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
    const projectExists = await this.exists(id);
    if (!projectExists) {
      throw new NotFoundException();
    }

    return this.prisma.project.update({
      where: {
        id: id
      },
      data: projectAuthMethods
    });
  }
}
