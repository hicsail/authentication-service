import { ProjectService } from '../project.service';
import { ConfigService } from '@nestjs/config';
import * as sinon from 'sinon';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

const sandbox = sinon.createSandbox();

const MOCK_PROJECT = {
  id: '1',
  name: 'sail'
};

const MOCK_USER = {
  id: '1',
  name: 'chris'
};

const MOCK_SETTINGS = {
  displayProjectName: true,
  allowSignup: true
};

const MOCK_AUTH_METHODS = {
  googleAuth: true,
  emailAuth: true
};

const MOCK_UPDATED_PROJECT = {
  id: '1',
  name: 'Updated Project'
};

describe('ProjectService', () => {
  let projectService: ProjectService;
  let mockPrismaService: sinon.SinonStubbedInstance<PrismaService>;
  let mockUserService: sinon.SinonStubbedInstance<UserService>;
  let mockConfigService: sinon.SinonStubbedInstance<ConfigService>;

  beforeEach(async () => {
    mockPrismaService = sandbox.createStubInstance(PrismaService);
    mockUserService = sandbox.createStubInstance(UserService);
    mockConfigService = sandbox.createStubInstance(ConfigService);
    mockConfigService.getOrThrow.returns('');

    mockPrismaService.project = {
      create: sandbox.stub(),
      findMany: sandbox.stub(),
      findFirstOrThrow: sandbox.stub(),
      update: sandbox.stub(),
      count: sandbox.stub()
    };

    mockPrismaService.user = {
      findMany: sandbox.stub().returns([MOCK_USER])
    };

    projectService = new ProjectService(mockPrismaService, mockUserService, mockConfigService);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
  });

  describe('Create a project', () => {
    it('should successfully create a project', async () => {
      // Arrange
      const newProject: Prisma.ProjectCreateInput = { ...MOCK_PROJECT };
      mockPrismaService.project.create.returns(MOCK_PROJECT);

      // Act
      const createdProject = await projectService.createProject(newProject);

      // Assert
      expect(mockPrismaService.project.create.calledOnceWith({ data: newProject })).toBe(true);
      expect(createdProject).toEqual(MOCK_PROJECT);
    });

    it('should fail to create a project', async () => {
      // Arrange
      const newProject: Prisma.ProjectCreateInput = { ...MOCK_PROJECT };
      const error = new Error();
      mockPrismaService.project.create.throws(error);

      // Act and Assert
      await expect(projectService.createProject(newProject)).rejects.toThrowError(error);
      expect(mockPrismaService.project.create.calledOnceWith({ data: newProject })).toBe(true);
    });
  });

  describe('List Projects', () => {
    it('should successfully return a list of projects', async () => {
      // Arrange
      mockPrismaService.project.findMany.resolves([MOCK_PROJECT]);

      // Act
      const listedProjects = await projectService.listProjects();

      // Assert
      expect(mockPrismaService.project.findMany.calledOnce).toBe(true);
      expect(listedProjects).toEqual([MOCK_PROJECT]);
    });

    it('should fail to return a list of projects', async () => {
      // Arrange
      const error = new Error();
      mockPrismaService.project.findMany.rejects(error);

      // Act and Assert
      await expect(projectService.listProjects()).rejects.toThrowError(error);
      expect(mockPrismaService.project.findMany.calledOnce).toBe(true);
    });
  });

  describe('Get All Projects', () => {
    it('should successfully return all projects', async () => {
      // Arrange
      mockPrismaService.project.findMany.resolves([MOCK_PROJECT]);

      // Act
      const allProjects = await projectService.getAllProjects();

      // Assert
      expect(mockPrismaService.project.findMany.calledOnce).toBe(true);
      expect(allProjects).toEqual([MOCK_PROJECT]);
    });

    it('should fail to return all projects', async () => {
      // Arrange
      const error = new Error('');
      mockPrismaService.project.findMany.rejects(error);

      // Act and Assert
      await expect(projectService.getAllProjects()).rejects.toThrowError(error);
      expect(mockPrismaService.project.findMany.calledOnce).toBe(true);
    });
  });

  describe('Get a Project', () => {
    it('should successfully return a project', async () => {
      // Arrange
      const projectId = '1';
      mockPrismaService.project.findFirstOrThrow.resolves(MOCK_PROJECT);

      // Act
      const project = await projectService.getProject(projectId);

      // Assert
      expect(mockPrismaService.project.findFirstOrThrow.calledOnceWith({ where: { id: projectId } })).toBe(true);
      expect(project).toEqual(MOCK_PROJECT);
    });

    it('should fail if a project does not exist', async () => {
      // Arrange
      const projectId = '2';
      mockPrismaService.project.findFirstOrThrow.rejects(new NotFoundException());

      // Act and Assert
      await expect(projectService.getProject(projectId)).rejects.toThrowError(NotFoundException);
      expect(mockPrismaService.project.findFirstOrThrow.calledOnceWith({ where: { id: projectId } })).toBe(true);
    });
  });

  describe('Update Project', () => {
    it('should successfully update a project', async () => {
      // Arrange
      const projectId = '1';
      const newSettings: any = { name: 'updated-sail' };
      mockPrismaService.project.update.resolves(MOCK_PROJECT);

      // Act
      const updatedProject = await projectService.updateProject(projectId, newSettings);

      // Assert
      expect(mockPrismaService.project.update.calledOnceWith({ where: { id: projectId }, data: newSettings })).toBe(true);
      expect(updatedProject).toEqual(MOCK_PROJECT);
    });

    it('should fail if the project does not exist', async () => {
      // Arrange
      const projectId = '2';
      const newSettings: any = { name: 'updated-sail' };
      mockPrismaService.project.update.rejects(new NotFoundException());

      // Act and Assert
      await expect(projectService.updateProject(projectId, newSettings)).rejects.toThrowError(NotFoundException);
      expect(mockPrismaService.project.update.calledOnceWith({ where: { id: projectId }, data: newSettings })).toBe(true);
    });
  });

  describe('Exists', () => {
    it('should return true if the project exists', async () => {
      // Arrange
      const projectId = '1';
      mockPrismaService.project.count.resolves(1);

      // Act
      const result = await projectService.exists(projectId);

      // Assert
      expect(result).toBe(true);
      expect(mockPrismaService.project.count.calledOnceWith({ where: { id: projectId } })).toBe(true);
    });

    it('should return false if the projectId is undefined', async () => {
      // Arrange
      const projectId = undefined;

      // Act
      const result = await projectService.exists(projectId);

      // Assert
      expect(result).toBe(false);
      expect(mockPrismaService.project.count.called).toBe(false);
    });

    it('should fail if the project does not exist', async () => {
      // Arrange
      const projectId = '2';
      mockPrismaService.project.count.returns(0);

      // Act
      const result = await projectService.exists(projectId);

      // Assert
      expect(result).toBe(false);
      expect(mockPrismaService.project.count.calledOnceWith({ where: { id: projectId } })).toBe(true);
    });
  });

  describe('Get Project Users', () => {
    it('should return a list of users belonging to the project', async () => {
      // Arrange
      const projectId = '1';
      mockPrismaService.project.count.returns(1);
      mockPrismaService.user.findMany.returns([MOCK_USER]);

      // Act
      const result = await projectService.getProjectUsers(projectId);

      // Assert
      expect(result).toEqual([MOCK_USER]);
      expect(mockPrismaService.project.count.calledOnceWith({ where: { id: projectId } })).toBe(true);
      expect(mockPrismaService.user.findMany.calledOnceWith({ where: { projectId: projectId } })).toBe(true);
    });

    it('should fail if the project does not exist', async () => {
      // Arrange
      const projectId = '2';
      mockPrismaService.project.count.returns(0);

      // Act and Assert
      await expect(projectService.getProjectUsers(projectId)).rejects.toThrowError(NotFoundException);
      expect(mockPrismaService.project.count.calledOnceWith({ where: { id: projectId } })).toBe(true);
      expect(mockPrismaService.user.findMany.called).toBe(false);
    });
  });

  describe('Get Project Settings', () => {
    it('should return the project settings if the project exists', async () => {
      // Arrange
      const projectId = '1';
      mockPrismaService.project.findFirstOrThrow.returns(MOCK_SETTINGS);
      const existsStub = sinon.stub(projectService, 'exists').resolves(true);

      // Act
      const result = await projectService.getProjectSettings(projectId);

      // Assert
      expect(result).toEqual(MOCK_SETTINGS);
      expect(
        mockPrismaService.project.findFirstOrThrow.calledOnceWith({
          where: { id: projectId },
          select: { displayProjectName: true, allowSignup: true }
        })
      ).toBe(true);

      existsStub.restore();
    });

    it('should throw NotFoundException if the project does not exist', async () => {
      // Arrange
      const projectId = '2';
      const existsStub = sinon.stub(projectService, 'exists').resolves(false);

      // Act and Assert
      await expect(projectService.getProjectSettings(projectId)).rejects.toThrow(NotFoundException);
      expect(existsStub.calledOnceWith(projectId)).toBe(true);
      expect(mockPrismaService.project.findFirstOrThrow.called).toBe(false);

      // Clean up
      existsStub.restore();
    });
  });

  describe('Get Auth Settings', () => {
    it('should return the authentication settings if the project exists', async () => {
      // Arrange
      const projectId = '1';

      mockPrismaService.project.findFirstOrThrow.returns(MOCK_AUTH_METHODS);
      const existsStub = sinon.stub(projectService, 'exists').resolves(true);

      // Act
      const result = await projectService.getAuthSettings(projectId);

      // Assert
      expect(result).toEqual({
        googleAuth: true,
        emailAuth: true
      });
      expect(
        mockPrismaService.project.findFirstOrThrow.calledOnceWith({
          where: { id: projectId },
          select: { googleAuth: true, emailAuth: true }
        })
      ).toBe(true);

      // Clean up
      existsStub.restore();
    });

    it('should throw NotFoundException if the project does not exist', async () => {
      // Arrange
      const projectId = '2';
      const existsStub = sinon.stub(projectService, 'exists').resolves(false);

      // Act and Assert
      await expect(projectService.getAuthSettings(projectId)).rejects.toThrow(NotFoundException);
      expect(existsStub.calledOnceWith(projectId)).toBe(true);
      expect(mockPrismaService.project.findFirstOrThrow.called).toBe(false);

      // Clean up
      existsStub.restore();
    });
  });

  describe('Update Project Settings', () => {
    it('should update the project settings', async () => {
      // Arrange
      const projectId = '1';
      const projectSettings = { displayProjectName: false, allowSignup: false };

      mockPrismaService.project.update.returns(MOCK_UPDATED_PROJECT);
      const existsStub = sinon.stub(projectService, 'exists').resolves(true);

      // Act
      const result = await projectService.updateProjectSettings(projectId, projectSettings);

      // Assert
      expect(result).toEqual(MOCK_UPDATED_PROJECT);
      expect(
        mockPrismaService.project.update.calledOnceWith({
          where: { id: projectId },
          data: projectSettings
        })
      ).toBe(true);

      // Clean up
      existsStub.restore();
    });

    it('should throw NotFoundException if the project does not exist', async () => {
      // Arrange
      const projectId = '2';
      const projectSettings = { displayProjectName: false, allowSignup: false };
      const existsStub = sinon.stub(projectService, 'exists').resolves(false);

      // Act and Assert
      await expect(projectService.updateProjectSettings(projectId, projectSettings)).rejects.toThrow(NotFoundException);
      expect(existsStub.calledOnceWith(projectId)).toBe(true);
      expect(mockPrismaService.project.update.called).toBe(false);

      // Clean up
      existsStub.restore();
    });
  });

  describe('Update Project Auth Methods', () => {
    it('should update the project auth methods', async () => {
      // Arrange
      const projectId = '1';
      const projectAuthMethods = { googleAuth: false, emailAuth: false };

      mockPrismaService.project.update.returns(MOCK_UPDATED_PROJECT);
      const existsStub = sinon.stub(projectService, 'exists').resolves(true);

      // Act
      const result = await projectService.updateProjectAuthMethods(projectId, projectAuthMethods);

      // Assert
      expect(result).toEqual(MOCK_UPDATED_PROJECT);
      expect(
        mockPrismaService.project.update.calledOnceWith({
          where: { id: projectId },
          data: projectAuthMethods
        })
      ).toBe(true);
    });

    it('should throw NotFoundException if the project does not exist', async () => {
      // Arrange
      const projectId = '2';
      const projectAuthMethods = { googleAuth: false, emailAuth: false };

      const existsStub = sinon.stub(projectService, 'exists').resolves(false);

      // Act and Assert
      await expect(projectService.updateProjectAuthMethods(projectId, projectAuthMethods)).rejects.toThrow(NotFoundException);
      expect(existsStub.calledOnceWith(projectId)).toBe(true);
      expect(mockPrismaService.project.update.called).toBe(false);

      // Clean up
      existsStub.restore();
    });
  });
});
