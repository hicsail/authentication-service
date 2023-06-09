import * as sinon from 'sinon';

import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';
import { UserResolver } from '../user.resolver';

const sandbox = sinon.createSandbox();

// Fixtures
const PROJECT_ID = '1';

describe('UserModule Integration Test (service)', () => {
  let userService: UserService;
  let userResolver: UserResolver;
  let mockPrismaService: sinon.SinonStubbedInstance<PrismaService>;

  beforeEach(async () => {
    mockPrismaService = {
      user: {
        findMany: sandbox.stub(),
        findFirst: sandbox.stub(),
        findFirstOrThrow: sandbox.stub()
      }
    };
    userService = new UserService(mockPrismaService);
    userResolver = new UserResolver(userService);
  });

  describe('users', () => {
    it('returns a list if users by project', async () => {
      // Arrange
      mockPrismaService.user.findMany.resolves([{ id: '1' }]);

      // Act
      const result = await userResolver.users(PROJECT_ID);

      // Assert
      expect(result).toEqual([{ id: '1' }]);
      expect(mockPrismaService.user.findMany.calledOnce).toBeTruthy();
      expect(mockPrismaService.user.findMany.calledWith({ where: { projectId: PROJECT_ID } })).toBeTruthy();
    });
  });

  describe('getUser', () => {
    it('returns a user by id if permission given', async () => {
      // Arrange
      mockPrismaService.user.findFirst.resolves({ id: '1', projectId: PROJECT_ID });

      // Act
      const result = await userResolver.getUser('1', PROJECT_ID);

      // Assert
      expect(result).toEqual({ id: '1', projectId: PROJECT_ID });
    });

    it('throws an error if permission not given', async () => {
      // Arrange
      mockPrismaService.user.findFirst.resolves({ id: '1', projectId: '2' });

      // Act
      try {
        await userResolver.getUser('1', PROJECT_ID);
        // Should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(403);
      }
    });

    it('throws an error if user is undefined', async () => {
      // Arrange
      mockPrismaService.user.findFirst.resolves(undefined);

      // Act
      try {
        await userResolver.getUser('1', PROJECT_ID);
        // Should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(404);
      }
    });
  });

  describe('resolveReference', () => {
    it('returns a user by id', async () => {
      // Arrange
      mockPrismaService.user.findFirstOrThrow.resolves({ id: '1' });

      // Act
      const result = await userResolver.resolveReference({ __typename: 'User', id: '1' });

      // Assert
      expect(result).toEqual({ id: '1' });
    });

    it('returns an error if no user exists', async () => {
      // Arrange
      mockPrismaService.user.findFirstOrThrow.rejects();

      try {
        // Act
        await userResolver.resolveReference({ __typename: 'User', id: '1' });
        // Should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(400);
      }
    });
  });
});
