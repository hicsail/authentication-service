import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project } from '@prisma/client';
import { ConfigurableProjectSettings, ProjectIdentifier } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new project. If the project ID is provided and a project with
   * the same ID exists, will throw an error.
   *
   * @param newProject Information on the project to create
   * @returns The newly created project
   * @throws Will throw an error if the project ID is already in use
   */
  async createProject(newProject: Prisma.ProjectCreateInput): Promise<Project> {
    // ProjectCreateInput by default allows the ID to be provided, but we
    // don't want to allow that. If the ID is provided, we remove it
    if (newProject.id) {
      delete newProject.id;
    }

    return this.prisma.project.create({
      data: newProject
    });
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
}
