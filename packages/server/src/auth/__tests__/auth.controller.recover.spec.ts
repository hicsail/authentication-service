import { JwtService } from '@nestjs/jwt';
import { Project } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RecoveryController } from '../auth.controller';
import { UserTestUtil } from '../../user/__tests__/utils/user.test.util';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

describe('RecoveryController', () => {
  let userTestUtil: UserTestUtil;

  let dummyProjects: Project[];

  let validProjectId: string;
  let validEmail: string;

  let recoveryController: RecoveryController;
  let prismaService: PrismaService;
  let userService: UserService;
  let authService: AuthService;
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

    validProjectId = dummyProjects[0].id;
    validEmail = 'test@gmail.com';
  });

  afterAll(async () => {
    await userTestUtil.tearDown();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('/recover ablate projectId', async () => {
    const user = {
      projectId: undefined,
      email: validEmail
    };

    expect(await recoveryController.forgotPassword(user)).toBeUndefined();
  });

  it('/recover ablate email', async () => {
    const user = {
      projectId: validProjectId,
      email: undefined
    };

    expect(await recoveryController.forgotPassword(user)).toBeUndefined();
  });

  it('/recover incorrect projectId', async () => {
    const user = {
      projectId: 'incorrectProjectId',
      email: validEmail
    };

    console.log(validEmail);

    expect(await recoveryController.forgotPassword(user)).toBeUndefined();
  });
});
