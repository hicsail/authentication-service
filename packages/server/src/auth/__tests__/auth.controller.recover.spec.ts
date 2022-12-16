import { JwtService } from '@nestjs/jwt';
import { Project } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RecoveryController } from '../auth.controller';
import { UserTestUtil } from '../../user/__tests__/utils/user.test.util';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { ResetDto } from '../dto/auth.dto';

describe('RecoveryController', () => {
  let userTestUtil: UserTestUtil;

  let dummyProjects: Project[];

  let validProjectId: string;
  let validEmail: string;
  let validPassword: string;
  let validResetCode: string;

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
    validPassword = 'pw'
    validResetCode = '123456';
  });

  afterAll(async () => {
    await userTestUtil.tearDown();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  // recover/forgot

  it('/recover/forgot ablate projectId', async () => {
    const user = {
      projectId: undefined,
      email: validEmail
    };

    expect(await recoveryController.forgotPassword(user)).toBeUndefined();
  });

  it('/recover/forgot ablate email', async () => {
    const user = {
      projectId: validProjectId,
      email: undefined
    };

    expect(await recoveryController.forgotPassword(user)).toBeUndefined();
  });

  it('/recover/forgot incorrect projectId', async () => {
    const user = {
      projectId: 'incorrectProjectId',
      email: validEmail
    };

    expect(await recoveryController.forgotPassword(user)).toBeUndefined();
  });

  // recover/reset

  it('/recover/password ablate projectId', async () => {
    const user: ResetDto = {
      projectId: undefined,
      email: validEmail,
      password: validPassword,
      code: validResetCode
    };

    expect(await recoveryController.resetPassword(user)).toEqual({
      message: 'Password unsuccessfully updated.',
      status: 400
    })
  });


  it('/recover/password ablate email', async () => {
    const user: ResetDto = {
      projectId: validProjectId,
      email: undefined,
      password: validPassword,
      code: validResetCode
    };

    expect(await recoveryController.resetPassword(user)).toEqual({
      message: 'Password unsuccessfully updated.',
      status: 400
    })
  });

  it('/recover/password ablate password', async () => {
    const user: ResetDto = {
      projectId: validProjectId,
      email: validEmail,
      password: undefined,
      code: validResetCode
    };

    expect(await recoveryController.resetPassword(user)).toEqual({
      message: 'Password unsuccessfully updated.',
      status: 400
    })
  });

  it('/recover/password ablate code', async () => {
    const user: ResetDto = {
      projectId: validProjectId,
      email: validEmail,
      password: validPassword,
      code: undefined
    };

    expect(await recoveryController.resetPassword(user)).toEqual({
      message: 'Password unsuccessfully updated.',
      status: 400
    })
  });
});
