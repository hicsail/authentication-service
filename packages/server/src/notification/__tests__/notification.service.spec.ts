import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as sinon from 'sinon';
import { Email, NotificationService } from '../notification.service';
import { ProjectService } from '../../project/project.service';
import { HttpStatus } from '@nestjs/common';

const sandbox = sinon.createSandbox();

// Fixtures
const MOCK_PROJECT = {
  id: '1'
};

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let mockConfigService: sinon.SinonStubbedInstance<ConfigService>;
  let mockHttpService: sinon.SinonStubbedInstance<HttpService>;
  let mockProjectService: sinon.SinonStubbedInstance<ProjectService>;

  beforeEach(async () => {
    mockConfigService = sandbox.createStubInstance(ConfigService);
    mockConfigService.getOrThrow.returns('');
    mockHttpService = sandbox.createStubInstance(HttpService);
    mockProjectService = sandbox.createStubInstance(ProjectService);
    notificationService = new NotificationService(mockConfigService, mockHttpService, mockProjectService);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send email', async () => {
      // Arrange
      const email: Email = {
        to: ['hicsail@bu.edu'],
        subject: 'Test Subject',
        message: 'Test Message',
        template: 'test/template',
        templateData: {}
      };

      const projectId = 'project-id';

      const project = {};

      mockProjectService.getProject.resolves(project);
      mockHttpService.post.returns({
        toPromise: sandbox.stub().resolves({ status: HttpStatus.CREATED, data: { success: true } })
      });

      // Act
      const result = await notificationService['sendEmail'](email, projectId);

      // Assert
      expect(result).toEqual({ success: true });
      expect(mockProjectService.getProject.calledOnceWith(projectId)).toBe(true);
      expect(mockHttpService.post.calledOnceWith(notificationService['notificationUrl'], email)).toBe(true);
    });

    it('should fail to send email', async () => {
      // Arrange
      const email: Email = {
        to: ['hicsail@bu.edu'],
        subject: 'Test Subject',
        message: 'Test Message',
        template: 'test/template',
        templateData: {}
      };

      const projectId = 'project-id';

      const project = {};

      mockProjectService.getProject.resolves(project);
      mockHttpService.post.resolves({
        status: HttpStatus.INTERNAL_SERVER_ERROR
      });

      // Act & Assert
      await expect(notificationService['sendEmail'](email, projectId)).rejects.toThrowError(Error);
      expect(mockProjectService.getProject.calledOnceWith(projectId)).toBe(true);
      expect(mockHttpService.post.calledOnceWith(notificationService['notificationUrl'], email)).toBe(true);
    });
  });

  describe('Send Password Reset Email', () => {
    it('should send password reset email', async () => {
      // Arrange
      mockProjectService.getProject.resolves(MOCK_PROJECT);
      mockHttpService.post.returns({
        toPromise: sandbox.stub().resolves({ status: 201, data: { emailSent: true } })
      });

      // Act
      const data = await notificationService.sendPasswordResetEmail('1', 'hicsail@bu.edu', 'https://example.com');
      // Assert
      expect(data).toEqual({ emailSent: true });
      expect(mockProjectService.getProject.calledOnce).toBe(true);
      expect(mockHttpService.post.calledOnce).toBe(true);
    });
  });

  describe('Send Password Updated Email', () => {
    it('should send password updated email', async () => {
      // Arrange
      mockProjectService.getProject.resolves(MOCK_PROJECT);
      mockHttpService.post.returns({
        toPromise: sandbox.stub().resolves({ status: 201, data: { emailSent: true } })
      });

      // Act
      const data = await notificationService.sendPasswordUpdatedEmail('1', 'hicsail@bu.edu');

      // Assert
      expect(data).toEqual({ emailSent: true });
      expect(mockProjectService.getProject.calledOnce).toBe(true);
      expect(mockHttpService.post.calledOnce).toBe(true);
    });
  });

  describe('Send Invite Email', () => {
    it('should send invite email', async () => {
      // Arrange
      mockProjectService.getProject.resolves(MOCK_PROJECT);
      mockHttpService.post.returns({
        toPromise: sandbox.stub().resolves({ status: 201, data: { emailSent: true } })
      });

      // Act
      const data = await notificationService.sendInviteEmail('1', 'hicsail@bu.edu', 'https://example.com');

      // Assert
      expect(data).toEqual({ emailSent: true });
      expect(mockProjectService.getProject.calledOnce).toBe(true);
      expect(mockHttpService.post.calledOnce).toBe(true);
    });
  });
});
