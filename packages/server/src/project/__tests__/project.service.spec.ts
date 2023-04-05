import * as sinon from 'sinon';
import { ProjectService } from '../project.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

const sandbox = sinon.createSandbox();

describe('ProjectService', () => {
  let projectService: ProjectService;
  let mockPrismaService: sinon.SinonStubbedInstance<PrismaService>;
  let mockUserService: sinon.SinonStubbedInstance<UserService>;
  let mockConfigService: sinon.SinonStubbedInstance<ConfigService>;

  beforeEach(async () => {
    mockPrismaService = sandbox.createStubInstance(PrismaService);
    mockPrismaService.project = {
      create: sandbox.stub(),
      findMany: sandbox.stub(),
      findFirstOrThrow: sandbox.stub(),
      update: sandbox.stub()
    };
    mockPrismaService.user = {
      findMany: sandbox.stub()
    };
    mockUserService = sandbox.createStubInstance(UserService);
    mockConfigService = sandbox.createStubInstance(ConfigService);
    let module = await Test.createTestingModule({
      providers: [ProjectService, PrismaService, UserService, ConfigService]
    }).compile();
    projectService = module.get<ProjectService>(ProjectService);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
  });

  describe('Create Project', () => {
    it('should create a new project', async () => {
      mockPrismaService.project.create.resolves({
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        redirectUrl: 'https://example.com'
      });

      const newProject = await projectService.createProject(
        {
          name: 'Test Project',
          description: 'Test Description',
          redirectUrl: 'https://example.com'
        },
        {} as any
      );

      expect(newProject).toEqual({
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        redirectUrl: 'https://example.com'
      });
    });
  });

  describe('List Projects', () => {
    it('should list all projects', async () => {
      mockPrismaService.project.findMany.resolves([
        {
          id: '1',
          name: 'Test Project 1'
        },
        {
          id: '2',
          name: 'Test Project 2'
        }
      ]);

      const projects = await projectService.listProjects();
      expect(projects).toEqual([
        {
          id: '1',
          name: 'Test Project 1'
        },
        {
          id: '2',
          name: 'Test Project 2'
        }
      ]);
    });
  });

  describe('Get Project', () => {
    it('should return a project with a given ID', async () => {
      mockPrismaService.project.findFirstOrThrow.resolves({
        id: '1',
        name: 'Test Project'
      });

      const project = await projectService.getProject('1');
      expect(project).toEqual({
        id: '1',
        name: 'Test Project'
      });
    });

    it('should throw a 404 if project is not found', async () => {
      mockPrismaService.project.findFirstOrThrow.throws(new Error('Not Found'));

      await expect(projectService.getProject('2')).rejects.toThrow(new HttpException('Project not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('getProjectUsers', () => {
    it('should return project users', async () => {
      mockPrismaService.user.findMany.resolves([
        {
          id: '1'
        }
      ]);

      expect(await projectService.getProjectUsers('1')).toEqual([
        {
          id: '1'
        }
      ]);
    });
  });

  describe('Update Project', () => {
    it('should update a project with a given ID', async () => {
      mockPrismaService.project.update.resolves({
        id: '1',
        name: 'Updated Project'
      });

      const project = await projectService.updateProject('1', {
        name: 'Updated Project'
      } as any);
      expect(project).toEqual({
        id: '1',
        name: 'Updated Project'
      });
    });
  });

  describe('Exists', () => {
    it('should return true if project exists', async () => {
      mockPrismaService.project.findFirstOrThrow.resolves({
        id: '1',
        name: 'Test Project'
      });

      const exists = await projectService.exists('1');
      expect(exists).toBe(true);
    });

    it('should return false if project doesnt exists', async () => {
      mockPrismaService.project.findFirstOrThrow.rejects(new Error('Not Found'));

      const exists = await projectService.exists('2');
      expect(exists).toBe(false);
    });
  });

  describe('getProjectSettings', () => {
    it('should return project settings', async () => {
      mockPrismaService.project.findFirstOrThrow.resolves({
        allowSignup: true,
        displayProjectName: true
      });

      expect(await projectService.getProjectSettings('1')).toEqual({
        displayProjectName: true,
        allowSignup: true
      });
    });
  });

  describe('getAuthSettings', () => {
    it('should return auth settings', async () => {
      mockPrismaService.project.findFirstOrThrow.resolves({
        googleAuth: false
      });

      expect(await projectService.getAuthSettings('1')).toEqual({
        googleAuth: false
      });
    });
  });

  describe('updateProjectSettings', () => {
    it('should update project settings', async () => {
      mockPrismaService.project.update.resolves({
        id: '1',
        allowSignup: false,
        displayProjectName: false
      });

      expect(
        await projectService.updateProjectSettings('1', {
          allowSignup: false,
          displayProjectName: false
        })
      ).toEqual({
        id: '1',
        allowSignup: false,
        displayProjectName: false
      });
    });
  });

  describe('updateProjectAuthMethods', () => {
    it('should update project auth methods', async () => {
      mockPrismaService.project.update.resolves({
        id: '1',
        googleAuth: false
      });

      expect(
        await projectService.updateProjectAuthMethods('1', {
          googleAuth: false
        })
      ).toEqual({
        id: '1',
        googleAuth: false
      });
    });
  });
});
