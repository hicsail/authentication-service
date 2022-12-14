import { JwtService } from '@nestjs/jwt';
import { Project, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { RecoveryController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserTestUtil } from '../../user/__tests__/utils/user.test.util';

describe('RecoveryController', () => {
  let userTestUtil: UserTestUtil;

  let dummyProjects: Project[];
  let dummyAdmins: User[];
  let dummyUsers: User[];

  // let validUser: User;
  let validProjectId: string;
  let validEmail: string;
  let validPassword: string;

  let recoveryController: RecoveryController;
  let authService: AuthService;
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    userTestUtil = new UserTestUtil();

    const moduleRef = await userTestUtil.setup();

    prismaService = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    userService = new UserService(prismaService);
    authService = new AuthService(userService, jwtService);
    recoveryController = new RecoveryController(authService);

    dummyProjects = await userTestUtil.createDummyProjects();
    dummyAdmins = await userTestUtil.createDummyAdmins();
    dummyUsers = await userTestUtil.createDummyUsers();

    validProjectId = dummyProjects[0].id;
    validPassword = 'pw';
  });

  afterAll(async () => {
    await userTestUtil.tearDown();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('/recover ablate projectId', () => {
    it('should return an error', async () => {
      const user = {
        projectId: undefined,
        email: validEmail
      };

      const spy = jest.spyOn(authService, 'forgotPassword').mockImplementation(async () => {
        throw new Error('Project ID does not exist');
      });
      await expect(recoveryController.forgotPassword(user)).rejects.toThrowError('Project ID does not exist');
    });
  });

  describe('/recover ablate email', () => {
    it('should return an error', async () => {
      const user = {
        projectId: validProjectId,
        email: undefined
      };

      const spy = jest.spyOn(authService, 'forgotPassword').mockImplementation(async () => {
        throw new Error('Project ID does not exist');
      });
      await expect(recoveryController.forgotPassword(user)).rejects.toThrowError('Project ID does not exist');
    });
  });

  describe('/recover incorrect projectId', () => {
    it('should return an error', async () => {
      const user = {
        projectId: 'incorrectProjectId',
        email: validEmail
      };

      const spy = jest.spyOn(authService, 'forgotPassword').mockImplementation(async () => {
        throw new Error('Project ID does not exist');
      });
      await expect(recoveryController.forgotPassword(user)).rejects.toThrowError('Project ID does not exist');
    });
  });
});
