import { Project, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';
import { UserTestUtil } from './utils/user.test.util';
import { isBefore, isEqual, isPast } from 'date-fns';
import * as bcrypt from 'bcrypt';
import * as randomstring from 'randomstring';

describe('UserModule Integration Test (service)', () => {
  let userTestUtil: UserTestUtil;

  let prisma: PrismaService;
  let userService: UserService;

  let dummyProjects: Project[];
  let dummyAdmins: User[];
  let dummyUsers: User[];

  let randomProject: Project;
  let randomUser: User;

  const HASH_ROUNDS = 10;

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

  beforeEach(async () => {
    randomProject = dummyProjects[Math.floor(Math.random() * dummyProjects.length)];
    randomUser = dummyUsers.concat(dummyAdmins)[Math.floor(Math.random() * (dummyAdmins.length + dummyUsers.length))];
  });

  it('Create new user with username and email', async () => {
    const createDate = new Date();
    const tempUserPasseword = randomstring.generate(Math.floor(Math.random() * (64 - 16) + 16));
    const tempUserInput = { projectId: randomProject.id, username: 'temp', email: 'temp@mail.com', password: tempUserPasseword };

    const userCreated = await userService.createUser(tempUserInput);

    expect(userCreated.username).toEqual(tempUserInput.username);
    expect(userCreated.email).toEqual(tempUserInput.email);
    expect(await bcrypt.compare(tempUserPasseword, userCreated.password)).toBe(true);
    expect(userCreated.role).toBe(0);
    expect(isEqual(userCreated.createdAt, userCreated.updatedAt)).toBe(true);
    expect(isPast(userCreated.createdAt)).toBe(true);
    expect(isBefore(createDate, userCreated.createdAt)).toBe(true);

    await prisma.user.delete({ where: { id: userCreated.id } });
  });

  it('Create new user with only username should have email as null', async () => {
    const createDate = new Date();
    const tempUserPasseword = randomstring.generate(Math.floor(Math.random() * (64 - 16) + 16));
    const tempUserInput = { projectId: randomProject.id, username: 'temp', password: tempUserPasseword };

    const userCreated = await userService.createUser(tempUserInput);

    expect(userCreated.projectId).toEqual(randomProject.id);
    expect(userCreated.username).toEqual(tempUserInput.username);
    expect(userCreated.email).toBe(null);
    expect(await bcrypt.compare(tempUserPasseword, userCreated.password)).toBe(true);
    expect(userCreated.role).toBe(0);
    expect(isEqual(userCreated.createdAt, userCreated.updatedAt)).toBe(true);
    expect(isPast(userCreated.createdAt)).toBe(true);
    expect(isBefore(createDate, userCreated.createdAt)).toBe(true);

    await prisma.user.delete({ where: { id: userCreated.id } });
  });

  it('Create new user with only email should have username as null', async () => {
    const createDate = new Date();
    const tempUserPasseword = randomstring.generate(Math.floor(Math.random() * (64 - 16) + 16));
    const tempUserInput = { projectId: randomProject.id, email: 'temp@mail.com', password: tempUserPasseword };

    const userCreated = await userService.createUser(tempUserInput);

    expect(userCreated.projectId).toEqual(randomProject.id);
    expect(userCreated.username).toBe(null);
    expect(userCreated.email).toEqual(tempUserInput.email);
    expect(await bcrypt.compare(tempUserPasseword, userCreated.password)).toBe(true);
    expect(userCreated.role).toBe(0);
    expect(isEqual(userCreated.createdAt, userCreated.updatedAt)).toBe(true);
    expect(isPast(userCreated.createdAt)).toBe(true);
    expect(isBefore(createDate, userCreated.createdAt)).toBe(true);

    await prisma.user.delete({ where: { id: userCreated.id } });
  });

  it('Create duplicated user should throw an erorr', async () => {
    const tempUserInput = { projectId: randomUser.projectId, username: randomUser.username, email: randomUser.email, password: 'password' };
    expect(userService.createUser(tempUserInput)).rejects.toThrow(Error);
  });

  // TODO: Add test cases
  it.todo('findAllUsers()');

  it.todo('findUserByUsername()');

  it.todo('findUserByEmail()');

  it.todo('setResetToken()');

  it.todo('updateUserPassword()');
});
