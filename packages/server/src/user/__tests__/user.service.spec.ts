import { Project, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';
import { UserTestUtil } from './utils/user.test.util';

describe('UserModule Integration Test (service)', () => {
  let userTestUtil: UserTestUtil;

  let prisma: PrismaService;
  let userService: UserService;

  let dummyProjects: Project[];
  let dummyAdmins: User[];
  let dummyUsers: User[];

  beforeAll(async () => {
    userTestUtil = new UserTestUtil();

    const moduleRef = await userTestUtil.setup();

    prisma = moduleRef.get(PrismaService);

    dummyProjects = await userTestUtil.createDummyProjects();
    dummyAdmins = await userTestUtil.createDummyAdmins();
    dummyUsers = await userTestUtil.createDummyUsers();

    // create controller and service objects
    userService = new UserService(prisma);
  });

  afterAll(async () => {
    await userTestUtil.tearDown();
  });

  // TODO: Add test cases
  it.todo('Add test cases');
});
