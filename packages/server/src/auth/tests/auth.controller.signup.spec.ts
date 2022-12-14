import { JwtService } from '@nestjs/jwt';
import { Project, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { SignupController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserSignupDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UserTestUtil } from '../../user/__tests__/utils/user.test.util';

describe('SignupController', () => {
  let userTestUtil: UserTestUtil;

  let dummyProjects: Project[];
  let dummyAdmins: User[];
  let dummyUsers: User[];

  let validUser: User;
  let validProjectId: string;
  let validUsername: string;
  let validEmail: string;
  let validEmail2: string;
  let validPassword: string;

  let randomProject: Project;
  let randomUser: User;

  let signupController: SignupController;
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
    signupController = new SignupController(authService);

    dummyProjects = await userTestUtil.createDummyProjects();
    dummyAdmins = await userTestUtil.createDummyAdmins();
    dummyUsers = await userTestUtil.createDummyUsers();

    validProjectId = dummyProjects[0].id;
    validUsername = 'test';
    validEmail = 'test@gmail.com';
    validEmail2 = 'test';
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

  describe('/signup valid', () => {
    it('should return an AccessToken', async () => {
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

  describe('/signup ablate projectId', () => {
    it('should reject with an error if a projectId is not provided', async () => {
      const user: UserSignupDto = {
        projectId: undefined,
        username: validUsername2,
        email: validEmail,
        password: validPassword2
      };

      await expect(signupController.signup(user)).rejects.toThrowError(Error('User already exist in the database.'));
    });
  });
});
