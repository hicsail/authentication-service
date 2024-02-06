import * as sinon from 'sinon';

import { AuthService } from '../auth.service';
import { AuthResolver } from '../auth.resolver';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from '../../project/project.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';

const sandbox: sinon.Sandbox = sinon.createSandbox();

// Fixtures

const PROJECT_ID = '1';
const USER_ID = '1';
const EMAIL = 'email@sail.codes';
const USERNAME = 'username';
const PASSWORD = 'password';
const HASHED_PASSWORD = '$2a$12$CZyhclA1jHP.mi8izmC/N.HMs5vUEw5NR.AQqUj7vj/VTcxkN3dRS';

const MOCK_USER = {
  id: USER_ID,
  password: HASHED_PASSWORD
};

const MOCK_PROJECT = {
  id: PROJECT_ID,
  name: 'Test Project',
  allowSignup: true
};

describe('Auth Module Integration Test (service)', () => {
  let authService: AuthService;
  let authResolver: AuthResolver;
  let mockUserService: sinon.SinonStubbedInstance<UserService>;
  let mockJwtService: sinon.SinonStubbedInstance<JwtService>;

  let mockProjectService: sinon.SinonStubbedInstance<ProjectService>;
  let mockNotificationService: sinon.SinonStubbedInstance<NotificationService>;
  let mockConfigService: sinon.SinonStubbedInstance<ConfigService>;
  let mockHttpService: sinon.SinonStubbedInstance<HttpService>;

  beforeEach(async () => {
    mockUserService = {
      findUserByEmail: sandbox.stub(),
      findUserByUsername: sandbox.stub(),
      createUser: sandbox.stub(),
      setResetToken: sandbox.stub(),
      updateUserPassword: sandbox.stub()
    };
    mockJwtService = {
      sign: sandbox.stub(),
      verify: sandbox.stub()
    };
    mockProjectService = {
      getProject: sandbox.stub()
    };
    mockConfigService = {
      get: sandbox.stub().returns('secret')
    };
    mockNotificationService = {
      sendPasswordResetEmail: sandbox.stub(),
      sendPasswordUpdatedEmail: sandbox.stub()
    };
    authService = new AuthService(mockUserService, mockJwtService, mockProjectService, mockConfigService, mockNotificationService, mockHttpService);
    authResolver = new AuthResolver(authService);
  });

  describe('login', () => {
    it('it should login user by username', async () => {
      // Arrange
      mockUserService.findUserByUsername.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver.loginUsername({
        projectId: PROJECT_ID,
        username: USERNAME,
        password: PASSWORD
      });

      // Assert
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('it should login user by email', async () => {
      // Arrange
      mockUserService.findUserByEmail.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver.loginEmail({
        projectId: PROJECT_ID,
        email: EMAIL,
        password: PASSWORD
      });

      // Assert
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('it should throw an error if missing username', async () => {
      // Arrange
      mockUserService.findUserByUsername.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver
        .loginUsername({
          projectId: PROJECT_ID,
          password: PASSWORD
        } as any)
        .catch((e) => {
          expect(e).toBeDefined();
        });

      // Assert
      expect(result).toBeUndefined();
    });

    it('it should throw an error if missing projectId', async () => {
      // Arrange
      mockUserService.findUserByUsername.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver
        .loginUsername({
          username: USERNAME,
          password: PASSWORD
        } as any)
        .catch((e) => {
          expect(e).toBeDefined();
        });

      // Assert
      expect(result).toBeUndefined();
    });

    it('it should throw an error if missing password', async () => {
      // Arrange
      mockUserService.findUserByUsername.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver
        .loginUsername({
          username: USERNAME,
          projectId: PROJECT_ID
        } as any)
        .catch((e) => {
          expect(e).toBeDefined();
        });

      // Assert
      expect(result).toBeUndefined();
    });

    it('it should throw an error if password is incorrect', async () => {
      // Arrange
      mockUserService.findUserByUsername.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver
        .loginUsername({
          username: USERNAME,
          projectId: PROJECT_ID,
          password: 'wrong-password'
        } as any)
        .catch((e) => {
          expect(e).toBeDefined();
        });

      // Assert
      expect(result).toBeUndefined();
    });

    it('it should throw an error if missing email', async () => {
      // Arrange
      mockUserService.findUserByEmail.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver
        .loginEmail({
          projectId: PROJECT_ID,
          password: PASSWORD
        } as any)
        .catch((e) => {
          expect(e).toBeDefined();
        });

      // Assert
      expect(result).toBeUndefined();
    });

    it('it should throw an error if missing projectId via logging via email', async () => {
      // Arrange
      mockUserService.findUserByEmail.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver
        .loginEmail({
          email: EMAIL,
          password: PASSWORD
        } as any)
        .catch((e) => {
          expect(e).toBeDefined();
        });

      // Assert
      expect(result).toBeUndefined();
    });

    it('it should throw an error if missing password logging in via email', async () => {
      // Arrange
      mockUserService.findUserByEmail.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver
        .loginEmail({
          email: EMAIL,
          projectId: PROJECT_ID
        } as any)
        .catch((e) => {
          expect(e).toBeDefined();
        });

      // Assert
      expect(result).toBeUndefined();
    });

    it('it should throw an error if password is incorrect logging in via email', async () => {
      // Arrange
      mockUserService.findUserByEmail.resolves(MOCK_USER);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver
        .loginEmail({
          email: EMAIL,
          projectId: PROJECT_ID,
          password: 'wrong-password'
        } as any)
        .catch((e) => {
          expect(e).toBeDefined();
        });

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('signup', () => {
    it('it should signup user via email', async () => {
      // Arrange
      mockUserService.createUser.resolves(MOCK_USER);
      mockProjectService.getProject.resolves(MOCK_PROJECT);
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver.signup({
        projectId: PROJECT_ID,
        email: EMAIL,
        password: PASSWORD
      });

      // Assert
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('it should block signup if project doesn\'t allow signup', async () => {
      // Arrange
      mockUserService.createUser.resolves(MOCK_USER);
      mockProjectService.getProject.resolves({
        ...MOCK_PROJECT,
        allowSignup: false
      });
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver.signup({
        projectId: PROJECT_ID,
        email: EMAIL,
        password: PASSWORD
      }).catch(e => {
        expect(e).toBeDefined();
      });

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('forgotPassword', () => {
    it('it should send password reset email', async () => {
      // Arrange
      mockUserService.setResetToken.resolves(true);
      mockNotificationService.sendPasswordResetEmail.returns(true);

      // Act
      const result = await authResolver.forgotPassword({
        projectId: PROJECT_ID,
        email: EMAIL
      });

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('resetPassword', () => {
    it('it should reset the users password', async () => {
      // Arrange
      mockUserService.updateUserPassword.resolves({
        message: 'Password successfully updated',
        status: 200
      });
      mockNotificationService.sendPasswordUpdatedEmail.returns(true);

      // Act
      const result = await authResolver.resetPassword({
        projectId: PROJECT_ID,
        email: EMAIL,
        password: PASSWORD,
        code: 'reset-code'
      });

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('refresh', () => {
    it('it should refresh the users token', async () => {
      // Arrange
      mockJwtService.verify.returns({
        id: USER_ID,
        projectId: PROJECT_ID,
        type: 'refresh'
      });
      mockJwtService.sign.onFirstCall().returns('access-token');
      mockJwtService.sign.onSecondCall().returns('refresh-token');

      // Act
      const result = await authResolver.refresh('refresh-token');

      // Assert
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });
  });

  describe('publicKey', () => {
    it('it should return the public key', async () => {
      const result = authResolver.publicKey();

      expect(result).toEqual(['secret', 'secret']);
    });
  });
});
