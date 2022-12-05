import { Project, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';
import { UserTestUtil } from './utils/user.test.util';
import { addMinutes, isAfter, isBefore, isEqual, isPast } from 'date-fns';
import * as bcrypt from 'bcrypt';
import * as randomstring from 'randomstring';
import { NotFoundError } from '@prisma/client/runtime';

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

  /**
   * Test cases for `createUser()` function
   */
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

  /**
   * Test cases for `findAllUsers()` function
   */
  it('Find all users should return all users regardless of project', async () => {
    const responseUsers = await userService.findAllUsers();
    for (const user of dummyAdmins.concat(dummyUsers)) {
      expect(responseUsers).toContainEqual(user);
    }
  });

  /**
   * Test cases for `findUserByUsername()` function
   */
  it('Return requested user given valid username', async () => {
    const usersWithUsername = dummyAdmins.concat(dummyUsers).filter((user) => user.username);
    const randomUserWithUsername = usersWithUsername[Math.floor(Math.random() * usersWithUsername.length)];

    const responseUser = await userService.findUserByUsername(randomUserWithUsername.projectId, randomUserWithUsername.username);

    expect(responseUser).toEqual(randomUserWithUsername);
  });

  it('Return null given valid project id but different username', async () => {
    const usersFromDiffProjects = dummyAdmins.concat(dummyUsers).filter((user) => user.projectId !== randomProject.id);
    const randomUsername = usersFromDiffProjects[Math.floor(Math.random() * usersFromDiffProjects.length)].username;

    expect(userService.findUserByUsername(randomProject.id, randomUsername)).resolves.toBe(null);
  });

  it('Return null given valid username but different project id', async () => {
    const randomProjectId = dummyProjects.filter((project) => project.id !== randomUser.projectId)[0].id;
    expect(userService.findUserByUsername(randomProjectId, randomUser.username)).resolves.toBe(null);
  });

  it('Return null given null username for projects that require username', async () => {
    const usersWithUsername = dummyAdmins.concat(dummyUsers).filter((user) => user.username);
    expect(userService.findUserByUsername(usersWithUsername[0].projectId, null)).resolves.toBe(null);
  });

  /**
   * Test cases for `findUserByEmail()` function
   */
  it('Return requested user given valid email', async () => {
    const usersWithEmail = dummyAdmins.concat(dummyUsers).filter((user) => user.email);
    const randomUserWithEmail = usersWithEmail[Math.floor(Math.random() * usersWithEmail.length)];

    const responseUser = await userService.findUserByEmail(randomUserWithEmail.projectId, randomUserWithEmail.email);

    expect(responseUser).toEqual(randomUserWithEmail);
  });

  it('Return null given valid project id but different email', async () => {
    const usersFromDiffProjects = dummyAdmins.concat(dummyUsers).filter((user) => user.projectId !== randomProject.id);
    const randomEmail = usersFromDiffProjects[Math.floor(Math.random() * usersFromDiffProjects.length)].email;

    expect(userService.findUserByEmail(randomProject.id, randomEmail)).resolves.toBe(null);
  });

  it('Return null given valid email but different project id', async () => {
    const randomProjectId = dummyProjects.filter((project) => project.id !== randomUser.projectId)[0].id;
    expect(userService.findUserByEmail(randomProjectId, randomUser.email)).resolves.toBe(null);
  });

  it('Return null given null email for projects that require email', async () => {
    const usersWithEmail = dummyAdmins.concat(dummyUsers).filter((user) => user.email);
    expect(userService.findUserByEmail(usersWithEmail[0].projectId, null)).resolves.toBe(null);
  });

  it.todo('setResetToken()');
  it('Set reset code should store it in database and valid for approximately 1 hour', async () => {
    const setDate = new Date();
    const usersWithEmail = dummyAdmins.concat(dummyUsers).filter((user) => user.email);
    const randomUserWithEmail = usersWithEmail[Math.floor(Math.random() * usersWithEmail.length)];
    const resetCode = randomstring.generate(10);

    await userService.setResetToken(randomUserWithEmail.projectId, randomUserWithEmail.email, resetCode);
    const userEdited = await prisma.user.findUnique({ where: { id: randomUserWithEmail.id } });

    expect(isBefore(addMinutes(setDate, 59), userEdited.resetCodeExpiresAt)).toBe(true);
    expect(isAfter(addMinutes(setDate, 61), userEdited.resetCodeExpiresAt)).toBe(true);
    expect(await bcrypt.compare(resetCode, userEdited.resetCode)).toBe(true);
  });

  it('Set reset code to a non-existing user should do nothing', async () => {
    const usersWithoutEmail = dummyAdmins.concat(dummyUsers).filter((user) => !user.email);
    const projectsWithEmail = dummyProjects.filter((project) => project.id !== usersWithoutEmail[0].projectId);
    const randomProjectId = projectsWithEmail[Math.floor(Math.random() * projectsWithEmail.length)].id;
    const resetCode = randomstring.generate(10);
    const email = 'not.exist@mail.com';

    await userService.setResetToken(randomProjectId, email, resetCode);

    expect(prisma.user.findFirstOrThrow({ where: { email } })).rejects.toThrow(NotFoundError);
  });

  // TODO: Add test cases
  it.todo('updateUserPassword()');
});
