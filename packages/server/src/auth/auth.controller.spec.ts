import { JwtService } from '@nestjs/jwt';
import { Project, User } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserService } from '../../src/user/user.service';
import { LoginController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsernameLoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserTestUtil } from '../user/__tests__/utils/user.test.util';

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
  let dummyAdmins: User[];
  let dummyUsers: User[];

  let validUser: User;
  let validProjectId: string;
  let validUsername: string;
  let validEmail: string;
  let validPassword: string;

  let randomProject: Project;
  let randomUser: User;

  let loginController: LoginController;
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
    loginController = new LoginController(authService);

    dummyProjects = await userTestUtil.createDummyProjects();
    dummyAdmins = await userTestUtil.createDummyAdmins();
    dummyUsers = await userTestUtil.createDummyUsers();

    validProjectId = dummyProjects[0].id;
    validUsername = 'test';
    validEmail = 'test@gmail.com';
    validPassword = 'pw';

    validUser = await userService.createUser({
      projectId: validProjectId,
      username: validUsername,
      email: validEmail,
      password: validPassword
    });
  });

  beforeEach(async () => {
    randomProject = dummyProjects[Math.floor(Math.random() * dummyProjects.length)];
    randomUser = dummyUsers.concat(dummyAdmins)[Math.floor(Math.random() * (dummyAdmins.length + dummyUsers.length))];
  });

  afterAll(async () => {
    await userTestUtil.tearDown();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('valid login case', () => {
    it('should return an AccessToken', async () => {
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
  });

  describe('/login/username ablate projectId', () => {
    it('should reject with an error if a projectId is not provided', async () => {
      const user: UsernameLoginDto = {
        projectId: undefined,
        username: validUsername,
        password: validPassword
      };

      await expect(loginController.loginUsername(user)).rejects.toThrowError('Unauthorized');
    });
  });

  describe('/login/username ablate password', () => {
    it('should throw an error when the password is not provided', async () => {
      const user: UsernameLoginDto = {
        projectId: '123',
        username: 'john',
        password: undefined
      };

      const loginController = new LoginController(authService);
      await expect(loginController.loginUsername(user)).rejects.toThrowError('Unauthorized');
    });
  });

  describe('/login/username ablate username', () => {
    it('should throw an error if no username is provided', async () => {
      const user: UsernameLoginDto = {
        projectId: '12345',
        username: undefined,
        password: 'password'
      };

      const loginController = new LoginController(authService);
      await expect(loginController.loginUsername(user)).rejects.toThrowError('Unauthorized');
    });
  });

  describe('/login/username incorrect projectId', () => {
    const user: UsernameLoginDto = {
      projectId: 'incorrectprojectId',
      username: validUsername,
      password: validPassword
    };

    it('should reject with an error if the projectId is incorrect', async () => {
      await expect(loginController.loginUsername(user)).rejects.toThrowError('Unauthorized');
    });
  });

  describe('/login/username incorrect password', () => {
    const user: UsernameLoginDto = {
      projectId: validProjectId,
      username: validUsername,
      password: 'incorrectPassword'
    };

    it('should reject with an error if the projectId is incorrect', async () => {
      await expect(loginController.loginUsername(user)).rejects.toThrowError('Unauthorized');
    });
  });
});
