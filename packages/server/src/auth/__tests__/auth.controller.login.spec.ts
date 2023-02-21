import { JwtService } from '@nestjs/jwt';
import { Project } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { LoginController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { EmailLoginDto, UsernameLoginDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UserTestUtil } from '../../user/__tests__/utils/user.test.util';
import { ProjectService } from '../../project/project.service';

describe('LoginController', () => {
  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(async () => {
    jwtAuthGuard = new JwtAuthGuard();
  });

  it('should be define', () => {
    expect(jwtAuthGuard).toBeDefined();
  });
});

describe('LoginController', () => {
  let userTestUtil: UserTestUtil;

  let dummyProjects: Project[];

  let validProjectId: string;
  const validUsername = 'test';
  const validEmail = 'test@example.com';
  const validPassword = 'pw';

  let loginController: LoginController;
  let authService: AuthService;
  let userService: UserService;
  let projectService: ProjectService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    try {
      userTestUtil = new UserTestUtil();

      const moduleRef = await userTestUtil.setup();

      prismaService = moduleRef.get(PrismaService);
      jwtService = moduleRef.get(JwtService);
      userService = new UserService(prismaService);
      projectService = new ProjectService(prismaService);
      authService = new AuthService(userService, jwtService, projectService);
      loginController = new LoginController(authService);

      dummyProjects = await userTestUtil.createDummyProjects();
      validProjectId = dummyProjects[0].id;
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    await userTestUtil.tearDown();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // /login/username tests

  it('/login/username valid', async () => {
    const userInput: UsernameLoginDto = {
      projectId: validProjectId,
      username: validUsername,
      password: validPassword
    };

    const result = {
      accessToken: 'valid-token'
    };

    const spy = jest.spyOn(authService, 'validateUsername').mockImplementation(async () => result);
    expect(await loginController.loginUsername(userInput)).toEqual(result);

    spy.mockRestore();
  });

  it('/login/username ablate projectId', async () => {
    const user: UsernameLoginDto = {
      projectId: undefined,
      username: validUsername,
      password: validPassword
    };

    await expect(loginController.loginUsername(user)).rejects.toThrowError('Bad request');
  });

  it('/login/username ablate password', async () => {
    const user: UsernameLoginDto = {
      projectId: '123',
      username: 'john',
      password: undefined
    };

    const loginController = new LoginController(authService);
    await expect(loginController.loginUsername(user)).rejects.toThrowError('Bad request');
  });

  it('/login/username ablate username', async () => {
    const user: UsernameLoginDto = {
      projectId: '12345',
      username: undefined,
      password: 'password'
    };

    const loginController = new LoginController(authService);
    await expect(loginController.loginUsername(user)).rejects.toThrowError('Bad request');
  });

  it('/login/username incorrect projectId', async () => {
    const user: UsernameLoginDto = {
      projectId: 'incorrectprojectId',
      username: validUsername,
      password: validPassword
    };

    await expect(loginController.loginUsername(user)).rejects.toThrowError('Unauthorized');
  });

  it('/login/username incorrect password', async () => {
    const user: UsernameLoginDto = {
      projectId: validProjectId,
      username: validUsername,
      password: 'incorrectPassword'
    };

    await expect(loginController.loginUsername(user)).rejects.toThrowError('Unauthorized');
  });

  it('login/username incorrect username', async () => {
    const userDto = new UsernameLoginDto();
    userDto.projectId = validProjectId;
    userDto.username = 'incorrectusername';
    userDto.password = validPassword;
    const expectedResult = { accessToken: 'token' };

    const spy = jest.spyOn(authService, 'validateUsername').mockImplementation(() => Promise.resolve(expectedResult));
    expect(await loginController.loginUsername(userDto)).toBe(expectedResult);

    spy.mockRestore();
  });

  // /login/email tests

  it('/login/email valid', async () => {
    const userInput: EmailLoginDto = {
      projectId: validProjectId,
      email: validEmail,
      password: validPassword
    };

    const result = {
      accessToken: 'valid-token'
    };

    const spy = jest.spyOn(authService, 'validateEmail').mockImplementation(async () => result);
    expect(await loginController.loginEmail(userInput)).toEqual(result);

    spy.mockRestore();
  });

  it('/login/email ablate projectId', async () => {
    const user: EmailLoginDto = {
      projectId: undefined,
      email: 'test@example.com',
      password: 'test'
    };

    await expect(loginController.loginEmail(user)).rejects.toThrowError('Bad request');
  });

  it('/login/email ablate password', async () => {
    const user: EmailLoginDto = {
      projectId: validProjectId,
      email: validEmail,
      password: undefined
    };

    const loginController = new LoginController(authService);
    await expect(loginController.loginEmail(user)).rejects.toThrowError('Bad request');
  });

  it('/login/email ablate email', async () => {
    const user: EmailLoginDto = {
      projectId: validProjectId,
      email: undefined,
      password: validPassword
    };

    const loginController = new LoginController(authService);
    await expect(loginController.loginEmail(user)).rejects.toThrowError('Bad request');
  });

  it('/login/email incorrect projectId', async () => {
    const user: EmailLoginDto = {
      projectId: 'incorrectprojectId',
      email: validEmail,
      password: validPassword
    };

    await expect(loginController.loginEmail(user)).rejects.toThrowError('Unauthorized');
  });

  it('/login/email incorrect password', async () => {
    const user: EmailLoginDto = {
      projectId: validProjectId,
      email: validEmail,
      password: 'incorrectPassword'
    };

    await expect(loginController.loginEmail(user)).rejects.toThrowError('Unauthorized');
  });

  it('login/username incorrect email', async () => {
    const userDto = new EmailLoginDto();
    userDto.projectId = validProjectId;
    userDto.email = 'incorrectEmail';
    userDto.password = validPassword;
    const expectedResult = { accessToken: 'token' };

    const spy = jest.spyOn(authService, 'validateEmail').mockImplementation(() => Promise.resolve(expectedResult));
    expect(await loginController.loginEmail(userDto)).toBe(expectedResult);

    spy.mockRestore();
  });
});
