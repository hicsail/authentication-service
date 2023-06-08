import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as sinon from 'sinon';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../../project/project.service';

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

  describe('Send Email', () => {
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

    it('fails to send email', async () => {
      // Arrange
      mockProjectService.getProject.resolves(MOCK_PROJECT);
      mockHttpService.post.returns({
        toPromise: sandbox.stub().resolves({
          status: 200,
          data: {},
          response: { status: 500, data: { emailSent: false } }
        })
      });

      // Act & Assert
      try {
        await notificationService.sendPasswordResetEmail('1', 'hicsail@bu.edu', 'https://example.com');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(mockProjectService.getProject.calledOnce).toBe(true);
        expect(mockHttpService.post.calledOnce).toBe(true);
      }
    });
  });
});
