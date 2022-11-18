import { Project } from '@prisma/client';

export class ProjectIdentifier {
  id: string;
  name: string;
}

/**
 * Represents the settings which can be changed. This is a subset of the
 * Project type and is partial to allow changing only some of the settings
 * at a time.
 */
export type ConfigurableProjectSettings = Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;
