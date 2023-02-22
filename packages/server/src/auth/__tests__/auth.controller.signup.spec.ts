import { JwtService } from '@nestjs/jwt';
import { Project } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { SignupController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserSignupDto } from '../dto/auth.dto';
import { UserTestUtil } from '../../user/__tests__/utils/user.test.util';
import { ProjectService } from '../../project/project.service';

describe('SignupController', () => {
  let userTestUtil: UserTestUtil;

  let dummyProjects: Project[];

  let validProjectId: string;
  let validUsername: string;
  let validEmail: string;
  let validPassword: string;

  let signupController: SignupController;
  let authService: AuthService;
  let projectService: ProjectService;
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    userTestUtil = new UserTestUtil();

    const moduleRef = await userTestUtil.setup();

    prismaService = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    userService = new UserService(prismaService);
    projectService = new ProjectService(prismaService);
    authService = new AuthService(userService, jwtService, projectService);
    signupController = new SignupController(authService);

    dummyProjects = await userTestUtil.createDummyProjects();
    validProjectId = dummyProjects[0].id;
    validUsername = 'test';
    validPassword = 'test@gmail.com';
    validPassword = 'pw';
  });

  afterAll(async () => {
    await userTestUtil.tearDown();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('/signup valid', async () => {
    const userInput: UserSignupDto = {
      projectId: validProjectId,
      username: validUsername,
      email: validEmail,
      password: validPassword
    };

    const result = {
      accessToken: 'valid-token'
    };

    const spy = jest.spyOn(authService, 'signup').mockImplementation(async () => result);
    expect(await signupController.signup(userInput)).toEqual(result);

    spy.mockRestore();
  });
});
