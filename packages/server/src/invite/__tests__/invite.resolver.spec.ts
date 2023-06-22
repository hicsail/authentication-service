import * as sinon from 'sinon';

import { InviteService } from '../invite.service';
import { InviteResolver } from '../invite.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { InviteStatus } from '../model/invite.status';
import { subDays } from 'date-fns';
import { HttpStatus } from '@nestjs/common';
import { AcceptInviteModel } from '../model/accept-invite.model';
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';
import { Invite } from '@prisma/client';

const sandbox = sinon.createSandbox();

// Fixtures

const PROJECT_ID = '1';
const INVITE_ID = '1';
const USER_ID = '1';
const ROLE = 0;

const MOCK_INVITE = {
  id: '1',
  projectId: '1',
  inviteCode: 'hash',
  acceptedById: false
};

const MOCK_INVITE_ALREADY_ACCEPTED = {
  id: '1',
  projectId: '1',
  inviteCode: 'hash',
  acceptedById: true
};

const UPDATED_MOCK_INVITE = {
  id: 1,
  projectId: 1,
  inviteCode: 'updatedhash'
};

const MOCK_INVITES = [MOCK_INVITE];

const EMAIL = 'hicsail@bu.edu';

const MOCK_USER = {
  id: '1'
};

describe('InviteModule Integration Test (service)', () => {
  let inviteService: InviteService;
  let inviteResolver: InviteResolver;
  let mockPrismaService: sinon.SinonStubbedInstance<PrismaService>;
  let mockUserService: sinon.SinonStubbedInstance<UserService>;
  let mockAuthService: sinon.SinonStubbedInstance<AuthService>;
  let mockNotificationService: sinon.SinonStubbedInstance<NotificationService>;
  let mockConfigService: sinon.SinonStubbedInstance<ConfigService>;

  beforeEach(async () => {
    mockPrismaService = {
      invite: {
        create: sandbox.stub(),
        findUnique: sandbox.stub(),
        findFirst: sandbox.stub(),
        update: sandbox.stub(),
        findMany: sandbox.stub()
      }
    };
    mockUserService = {
      findUserByEmail: sandbox.stub(),
      findInviteById: sandbox.stub(),
      updateUserRole: sandbox.stub()
    };
    mockAuthService = {
      signup: sandbox.stub()
    };
    inviteService = new InviteService(mockPrismaService, mockUserService, mockAuthService, mockNotificationService, mockConfigService);
    inviteResolver = new InviteResolver(inviteService);
  });

  describe('invites', () => {
    it('should return all invites for the project when no status is specified', async () => {
      // Arrange
      mockPrismaService.invite.findMany.returns(MOCK_INVITES);

      // Act
      const result = await inviteResolver.invites(PROJECT_ID);

      // Assert
      expect(
        mockPrismaService.invite.findMany({
          where: {
            PROJECT_ID
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      ).toStrictEqual(MOCK_INVITES);
      expect(result).toBe(MOCK_INVITES);
    });

    it('should return invites that have been accepted when status is set to ACCEPTED', async () => {
      // Arrange
      mockPrismaService.invite.findMany.returns(MOCK_INVITES);

      // Act
      const result = await inviteResolver.invites(PROJECT_ID, InviteStatus.ACCEPTED);

      // Assert
      expect(
        mockPrismaService.invite.findMany({
          where: {
            PROJECT_ID,
            acceptedById: {
              not: null
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      ).toBe(MOCK_INVITES);
      expect(result).toEqual(MOCK_INVITES);
    });

    it('should return invites that have been cancelled when status is set to CANCELLED', async () => {
      // Arrange
      mockPrismaService.invite.findMany.returns(MOCK_INVITES);

      // Act
      const result = await inviteResolver.invites(PROJECT_ID, InviteStatus.CANCELLED);

      // Assert
      expect(
        mockPrismaService.invite.findMany({
          where: {
            PROJECT_ID,
            deletedAt: {
              not: null
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      ).toBe(MOCK_INVITES);
      expect(result).toEqual(MOCK_INVITES);
    });

    it('should return invites that have expired and not been accepted or cancelled when status is set to EXPIRED', async () => {
      // Arrange
      mockPrismaService.invite.findMany.returns(MOCK_INVITES);

      // Act
      const result = await inviteResolver.invites(PROJECT_ID, InviteStatus.EXPIRED);

      // Assert
      expect(
        mockPrismaService.invite.findMany({
          where: {
            PROJECT_ID,
            acceptedById: null,
            expiresAt: {
              lt: subDays(new Date(), 7)
            },
            deletedAt: null
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      ).toBe(MOCK_INVITES);
      expect(result).toEqual(MOCK_INVITES);
    });

    it('should return invites that have not expired and not been accepted or cancelled when status is set to PENDING', async () => {
      // Arrange
      mockPrismaService.invite.findMany.returns(MOCK_INVITES);

      // Act
      const result = await inviteResolver.invites(PROJECT_ID, InviteStatus.PENDING);

      // Assert
      expect(
        mockPrismaService.invite.findMany({
          where: {
            PROJECT_ID,
            acceptedById: null,
            expiresAt: {
              gte: subDays(new Date(), 7)
            },
            deletedAt: null
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      ).toBe(MOCK_INVITES);
      expect(result).toEqual(MOCK_INVITES);
    });
  });

  describe('invite', () => {
    it('should return an invite for a given invite id', async () => {
      // Arrange
      mockPrismaService.invite.findUnique.returns(MOCK_INVITE);

      // Act
      const result = await inviteResolver.invite(INVITE_ID);

      // Assert
      expect(
        mockPrismaService.invite.findUnique({
          where: {
            INVITE_ID
          }
        })
      ).toBe(MOCK_INVITE);
      expect(result).toEqual(MOCK_INVITE);
    });

    it('should return an HttpException if no invite is found with the given ID', async () => {
      // Arrange
      mockPrismaService.invite.findUnique.resolves(undefined);

      // Act
      try {
        await inviteResolver.invite(INVITE_ID);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('createInvite', () => {
    it('should successfully create and return an id', async () => {
      // Arrange
      mockPrismaService.invite.create.resolves(MOCK_INVITE);
      mockUserService.findUserByEmail.resolves(false);
      const findInviteByEmailStub = sinon.stub(inviteService, 'findInviteByEmail');
      findInviteByEmailStub.withArgs(PROJECT_ID, EMAIL).resolves(false);

      const sendInviteEmailStub = sinon.stub(inviteService, 'sendInviteEmail');
      sendInviteEmailStub.withArgs(MOCK_INVITE, 'hash').resolves(false);

      // Act
      const result = await inviteResolver.createInvite(PROJECT_ID, USER_ID, EMAIL, ROLE);

      // Assert
      expect(result).toEqual(MOCK_INVITE);
    });

    it('should return an HttpException if a user already exists for an email address', async () => {
      // Arrange
      mockUserService.findUserByEmail.resolves(true);

      // Act
      try {
        await inviteResolver.createInvite(PROJECT_ID, USER_ID, EMAIL, ROLE);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should return an HttpException if an invite already exists for an email address', async () => {
      // Arrange
      mockUserService.findUserByEmail.resolves(false);
      const findInviteByEmailStub = sinon.stub(inviteService, 'findInviteByEmail');
      findInviteByEmailStub.withArgs(PROJECT_ID, EMAIL).resolves(true);

      // Act
      try {
        await inviteResolver.createInvite(PROJECT_ID, USER_ID, EMAIL, ROLE);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('resendInvite', () => {
    it('should successfully resend an invite', async () => {
      // Arrange
      const findInviteByIdStub = sinon.stub(inviteService, 'findInviteById');
      findInviteByIdStub.withArgs(USER_ID).resolves(MOCK_INVITE);
      mockPrismaService.invite.update.resolves(UPDATED_MOCK_INVITE);
      const sendInviteEmailStub = sinon.stub(inviteService, 'sendInviteEmail');
      sendInviteEmailStub.withArgs(MOCK_INVITE, 'hash').resolves(true);

      // Act
      const result = await inviteResolver.resendInvite(PROJECT_ID, USER_ID);

      // Assert
      expect(result).toEqual(MOCK_INVITE);
      expect(inviteService.findInviteById(USER_ID)).toBeTruthy();
      expect(mockPrismaService.invite.update).toBeTruthy();
    });

    it('should throw an HttpException if invite is not found', async () => {
      // Arrange
      const findInviteByIdStub = sinon.stub(inviteService, 'findInviteById');
      findInviteByIdStub.withArgs(USER_ID).resolves(undefined);

      // Act
      try {
        await inviteResolver.resendInvite(PROJECT_ID, USER_ID);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an HttpException if invite does not belong to the specified project', async () => {
      // Arrange
      const findInviteByIdStub = sinon.stub(inviteService, 'findInviteById');
      findInviteByIdStub.withArgs(USER_ID).resolves(MOCK_INVITE);

      // Act
      try {
        await inviteResolver.resendInvite('2', USER_ID);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an HttpException if invite has already been accepted', async () => {
      // Arrange
      const findInviteByIdStub = sinon.stub(inviteService, 'findInviteById');
      findInviteByIdStub.withArgs(USER_ID).resolves(MOCK_INVITE_ALREADY_ACCEPTED);

      // Act
      try {
        await inviteResolver.resendInvite(PROJECT_ID, USER_ID);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('acceptInvite', () => {
    it('should successfully accept invite', async () => {
      // Arrange
      const MOCK_INVITE_CODE = randomBytes(4).toString('hex');
      const MOCK_HASH_INVITE_CODE = await hash(MOCK_INVITE_CODE, 10);

      const mock__invite = {
        id: '1',
        projectId: '1',
        inviteCode: MOCK_HASH_INVITE_CODE,
        acceptedById: false
      };
      const findInviteByEmailStub = sinon.stub(inviteService, 'findInviteByEmail');
      findInviteByEmailStub.withArgs(PROJECT_ID, EMAIL).resolves(mock__invite);
      mockUserService.findUserByEmail.onCall(0).resolves(undefined);
      mockUserService.findUserByEmail.onCall(1).resolves(MOCK_USER);
      mockAuthService.signup.resolves(MOCK_USER);
      mockUserService.updateUserRole.resolves(true);
      mockPrismaService.invite.update.resolves(mock__invite);

      // Act
      const invite: AcceptInviteModel = {
        inviteCode: MOCK_INVITE_CODE,
        projectId: '1',
        email: 'hicsail@bu.edu',
        password: 'password',
        fullname: 'fullname'
      };
      const result = await inviteResolver.acceptInvite(invite);

      // Assert
      expect(result).toEqual(mock__invite);
      expect(inviteService.findInviteByEmail).toBeTruthy();
      expect(mockAuthService.signup).toBeTruthy();
      expect(mockUserService.findUserByEmail).toBeTruthy();
      expect(mockUserService.updateUserRole).toBeTruthy();
      expect(mockPrismaService.invite.update).toBeTruthy();
    });

    it('should throw an HttpException if invite is undefined', async () => {
      // Arrange
      const MOCK_INVITE_CODE = randomBytes(4).toString('hex');
      const MOCK_HASH_INVITE_CODE = await hash(MOCK_INVITE_CODE, 10);

      const findInviteByEmailStub = sinon.stub(inviteService, 'findInviteByEmail');
      findInviteByEmailStub.withArgs(PROJECT_ID, EMAIL).resolves(undefined);

      const invite: AcceptInviteModel = {
        inviteCode: MOCK_INVITE_CODE,
        projectId: '1',
        email: 'hicsail@bu.edu',
        password: 'password',
        fullname: 'fullname'
      };
      try {
        // Act
        await inviteResolver.acceptInvite(invite);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an HttpException if invite has already been accepted', async () => {
      // Arrange
      const MOCK_INVITE_CODE = randomBytes(4).toString('hex');
      const MOCK_HASH_INVITE_CODE = await hash(MOCK_INVITE_CODE, 10);

      const mock__invite = {
        id: '1',
        projectId: '1',
        inviteCode: MOCK_HASH_INVITE_CODE,
        acceptedById: true
      };

      const findInviteByEmailStub = sinon.stub(inviteService, 'findInviteByEmail');
      findInviteByEmailStub.withArgs(PROJECT_ID, EMAIL).resolves(mock__invite);

      const invite: AcceptInviteModel = {
        inviteCode: MOCK_INVITE_CODE,
        projectId: '1',
        email: 'hicsail@bu.edu',
        password: 'password',
        fullname: 'fullname'
      };
      try {
        // Act
        await inviteResolver.acceptInvite(invite);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw an HttpException if a user already exists', async () => {
      // Arrange
      mockUserService.findUserByEmail.resolves(MOCK_USER);

      const MOCK_INVITE_CODE = randomBytes(4).toString('hex');
      const MOCK_HASH_INVITE_CODE = await hash(MOCK_INVITE_CODE, 10);

      const mock__invite = {
        id: '1',
        projectId: '1',
        inviteCode: MOCK_HASH_INVITE_CODE,
        acceptedById: false
      };

      const findInviteByEmailStub = sinon.stub(inviteService, 'findInviteByEmail');
      findInviteByEmailStub.withArgs(PROJECT_ID, EMAIL).resolves(mock__invite);

      const invite: AcceptInviteModel = {
        inviteCode: MOCK_INVITE_CODE,
        projectId: '1',
        email: 'hicsail@bu.edu',
        password: 'password',
        fullname: 'fullname'
      };
      try {
        // Act
        await inviteResolver.acceptInvite(invite);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw an HttpException if an invite code is not valid', async () => {
      // Arrange
      mockUserService.findUserByEmail.resolves(undefined);

      const MOCK_INVITE_CODE = randomBytes(4).toString('hex');
      const MOCK_HASH_INVITE_CODE = await hash(MOCK_INVITE_CODE, 10);

      const mock__invite = {
        id: '1',
        projectId: '1',
        inviteCode: MOCK_HASH_INVITE_CODE,
        acceptedById: false
      };

      const findInviteByEmailStub = sinon.stub(inviteService, 'findInviteByEmail');
      findInviteByEmailStub.withArgs(PROJECT_ID, EMAIL).resolves(mock__invite);

      const invite: AcceptInviteModel = {
        inviteCode: 'wrong invite code',
        projectId: '1',
        email: 'hicsail@bu.edu',
        password: 'password',
        fullname: 'fullname'
      };

      try {
        // Act
        await inviteResolver.acceptInvite(invite);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('cancelInvite', () => {
    it('should successfully cancel an invite', async () => {
      // Arrange
      const findInviteByIdStub = sinon.stub(inviteService, 'findInviteById');
      findInviteByIdStub.withArgs('1').resolves(MOCK_INVITE);
      mockPrismaService.invite.update.resolves(MOCK_INVITE);
      // Act
      const result = await inviteResolver.cancelInvite('1', '1');

      // Assert
      expect(result).toEqual(MOCK_INVITE);
      expect(mockPrismaService.invite.update).toBeTruthy();
      expect(inviteService.findInviteById).toBeTruthy();
    });

    it('should throw an HttpException if an invite is undefined', async () => {
      // Arrange
      const findInviteByIdStub = sinon.stub(inviteService, 'findInviteById');
      findInviteByIdStub.withArgs('1').resolves(undefined);

      try {
        // Act
        await inviteResolver.cancelInvite('1', '1');
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an HttpException if an invite does not belong to the specified project', async () => {
      // Arrange
      const findInviteByIdStub = sinon.stub(inviteService, 'findInviteById');
      findInviteByIdStub.withArgs('1').resolves(MOCK_INVITE);

      try {
        // Act
        await inviteResolver.cancelInvite('1', '2');
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an HttpException if an invite has already been accepted', async () => {
      // Arrange
      const findInviteByIdStub = sinon.stub(inviteService, 'findInviteById');
      findInviteByIdStub.withArgs('1').resolves(MOCK_INVITE_ALREADY_ACCEPTED);

      try {
        // Act
        await inviteResolver.cancelInvite('1', '1');
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('resolveReference', () => {
    it('should successfully find an invite', async () => {
      // Arrange
      mockPrismaService.invite.findUnique.returns(MOCK_INVITE);
      const REFERENCE = {
        __typename: '',
        id: '1'
      };
      // Act
      const result = await inviteResolver.resolveReference(REFERENCE);

      // Assert
      expect(
        mockPrismaService.invite.findUnique({
          where: {
            INVITE_ID
          }
        })
      ).toBe(MOCK_INVITE);
      expect(result).toEqual(MOCK_INVITE);
    });

    it('should successfully throw a BadRequestException', async () => {
      // Arrange
      mockPrismaService.invite.findUnique.resolves(undefined);
      const REFERENCE = {
        __typename: '',
        id: '1'
      };

      // Act
      try {
        await inviteResolver.resolveReference(REFERENCE);
        // should not reach this line
        expect(true).toBeFalsy();
      } catch (e) {
        // Assert
        expect(e).toBeDefined();
        expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('status', () => {
    it('should successfully return the cancelled status', async () => {
      const invite: Invite = {
        id: '1',
        projectId: '1',
        invitedById: '',
        email: 'hicsail@bu.edu',
        role: 0,
        inviteCode: '',
        acceptedById: '',
        deletedAt: new Date(),
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = inviteResolver.status(invite);
      expect(result).toEqual(InviteStatus.CANCELLED);
    });

    it('should successfully return the accepted status', async () => {
      const invite: Invite = {
        id: '1',
        projectId: '1',
        invitedById: '',
        email: 'hicsail@bu.edu',
        role: 0,
        inviteCode: '',
        acceptedById: '1',
        deletedAt: null,
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = inviteResolver.status(invite);
      expect(result).toEqual(InviteStatus.ACCEPTED);
    });

    it('should successfully return the expired status', async () => {
      const invite: Invite = {
        id: '1',
        projectId: '1',
        invitedById: '1',
        email: 'hicsail@bu.edu',
        role: 0,
        inviteCode: '',
        acceptedById: '',
        deletedAt: null,
        expiresAt: new Date(0),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = inviteResolver.status(invite);
      expect(result).toEqual(InviteStatus.EXPIRED);
    });

    it('should successfully return the pending status', async () => {
      const invite: Invite = {
        id: '1',
        projectId: '1',
        invitedById: '1',
        email: 'hicsail@bu.edu',
        role: 0,
        inviteCode: '',
        acceptedById: '',
        deletedAt: null,
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = inviteResolver.status(invite);
      expect(result).toEqual(InviteStatus.PENDING);
    });
  });
});
