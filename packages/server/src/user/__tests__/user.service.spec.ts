import { Project, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';
import { UserTestUtil } from './utils/user.test.util';
import { addMinutes, isAfter, isBefore, isEqual, isPast, subDays, subMinutes } from 'date-fns';
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

  describe('createUser()', () => {
    let createDate: Date;
    let tempUserPasseword: string;
    let tempUserInput: any;

    let userCreated: User;

    let createTempUser: boolean;

    beforeEach(async () => {
      createDate = new Date();
      tempUserPasseword = randomstring.generate(Math.floor(Math.random() * (64 - 16) + 16));
      tempUserInput = { projectId: randomProject.id, username: 'temp', email: 'temp@mail.com', password: tempUserPasseword };

      createTempUser = true;
    });

    afterEach(async () => {
      if (!createTempUser) return;

      expect(await bcrypt.compare(tempUserPasseword, userCreated.password)).toBe(true);
      expect(isEqual(userCreated.createdAt, userCreated.updatedAt)).toBe(true);
      expect(isPast(userCreated.createdAt)).toBe(true);
      expect(isBefore(createDate, userCreated.createdAt)).toBe(true);

      await prisma.user.delete({ where: { id: userCreated.id } });
    });

    it('Create new user with username and email', async () => {
      userCreated = await userService.createUser(tempUserInput);

      expect(userCreated.username).toEqual(tempUserInput.username);
      expect(userCreated.email).toEqual(tempUserInput.email);
    });

    it('Create new user with only username should have email as null', async () => {
      delete tempUserInput['email'];
      userCreated = await userService.createUser(tempUserInput);

      expect(userCreated.username).toEqual(tempUserInput.username);
      expect(userCreated.email).toBe(null);
    });

    it('Create new user with only email should have username as null', async () => {
      delete tempUserInput['username'];
      userCreated = await userService.createUser(tempUserInput);

      expect(userCreated.username).toBe(null);
      expect(userCreated.email).toEqual(tempUserInput.email);
    });

    it('Create duplicated user should throw an erorr', async () => {
      createTempUser = false;
      tempUserInput = { projectId: randomUser.projectId, username: randomUser.username, email: randomUser.email, password: 'password' };
      expect(userService.createUser(tempUserInput)).rejects.toThrow(Error);
    });
  });

  describe('findAllUsers()', () => {
    it('Find all users should return all users regardless of project', async () => {
      const responseUsers = await userService.findAllUsers();
      for (const user of dummyAdmins.concat(dummyUsers)) {
        expect(responseUsers).toContainEqual(user);
      }
    });
  });

  describe('findUserByUsername()', () => {
    let usersWithUsername: User[];

    beforeAll(async () => {
      usersWithUsername = dummyAdmins.concat(dummyUsers).filter((user) => user.username);
    });

    it('Return requested user given valid username', async () => {
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
      expect(userService.findUserByUsername(usersWithUsername[0].projectId, null)).resolves.toBe(null);
    });
  });

  describe('findUserByEmail()', () => {
    let usersWithEmail: User[];

    beforeAll(async () => {
      usersWithEmail = dummyAdmins.concat(dummyUsers).filter((user) => user.email);
    });

    it('Return requested user given valid email', async () => {
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
      expect(userService.findUserByEmail(usersWithEmail[0].projectId, null)).resolves.toBe(null);
    });
  });

  describe('setResetToken()', () => {
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
      const adminsWithoutEmail = dummyAdmins.filter((admin) => !admin.email);
      const projectsWithEmail = dummyProjects.filter((project) => project.id !== adminsWithoutEmail[0].projectId);
      const randomProjectId = projectsWithEmail[Math.floor(Math.random() * projectsWithEmail.length)].id;
      const resetCode = randomstring.generate(10);
      const email = 'not.exist@mail.com';

      await userService.setResetToken(randomProjectId, email, resetCode);

      expect(prisma.user.findFirstOrThrow({ where: { email } })).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateUserPassword()', () => {
    let projectsWithEmail: Project[];

    let currentDate: Date;

    let oldPassword: string;
    let newPassword: string;
    let resetCode: string;

    let tempUserInput: any;

    beforeAll(async () => {
      const adminsWithoutEmail = dummyAdmins.filter((admin) => !admin.email);

      projectsWithEmail = dummyProjects.filter((project) => project.id !== adminsWithoutEmail[0].projectId);
    });

    beforeEach(async () => {
      currentDate = new Date();

      oldPassword = randomstring.generate(32);
      newPassword = randomstring.generate(32);
      resetCode = randomstring.generate(10);

      tempUserInput = {
        projectId: projectsWithEmail[0].id,
        username: 'update-password',
        email: 'update.password@mail.com',
        password: await bcrypt.hash(oldPassword, HASH_ROUNDS),
        createdAt: subDays(currentDate, 5),
        updatedAt: subDays(currentDate, 5),
        resetCode: await bcrypt.hash(resetCode, HASH_ROUNDS)
      };
    });

    it('Update password should success when all conditions are met', async () => {
      tempUserInput['resetCodeExpiresAt'] = addMinutes(currentDate, 30);

      const userToUpdate = await prisma.user.create({
        data: tempUserInput
      });

      const responseStatus = await userService.updateUserPassword(userToUpdate.projectId, userToUpdate.email, newPassword, resetCode);
      const userUpdated = await prisma.user.findUnique({ where: { id: userToUpdate.id } });

      expect(responseStatus.status).toBe(200);
      expect(await bcrypt.compare(oldPassword, userUpdated.password)).toBe(false);
      expect(await bcrypt.compare(newPassword, userUpdated.password)).toBe(true);
      expect(isPast(userUpdated.updatedAt)).toBe(true);
      expect(isBefore(currentDate, userUpdated.updatedAt)).toBe(true);
      expect(userUpdated.resetCode).toBe(null);
      expect(userUpdated.resetCodeExpiresAt).toBe(null);

      for (const property of ['projectId', 'id', 'username', 'email', 'createdAt']) {
        expect(userUpdated[property]).toEqual(userToUpdate[property]);
      }

      await prisma.user.delete({ where: { id: userToUpdate.id } });
    });

    it('Update password should fail when reset code is wrong', async () => {
      tempUserInput['resetCodeExpiresAt'] = addMinutes(currentDate, 30);

      const userToUpdate = await prisma.user.create({
        data: tempUserInput
      });

      const responseStatus = await userService.updateUserPassword(userToUpdate.projectId, userToUpdate.email, newPassword, 'xxxxxxxxxx');
      const userUpdated = await prisma.user.findUnique({ where: { id: userToUpdate.id } });

      expect(responseStatus.status).toBe(400);
      expect(userUpdated).toEqual(userToUpdate);

      await prisma.user.delete({ where: { id: userToUpdate.id } });
    });

    it('Update password should fail when reset code is expired', async () => {
      tempUserInput['resetCodeExpiresAt'] = subMinutes(currentDate, 1);

      const userToUpdate = await prisma.user.create({
        data: tempUserInput
      });

      const responseStatus = await userService.updateUserPassword(userToUpdate.projectId, userToUpdate.email, newPassword, resetCode);
      const userUpdated = await prisma.user.findUnique({ where: { id: userToUpdate.id } });

      expect(responseStatus.status).toBe(400);
      expect(userUpdated).toEqual(userToUpdate);

      await prisma.user.delete({ where: { id: userToUpdate.id } });
    });

    it('Update password for a non-existing user should fail', async () => {
      const email = 'temp.user3@mail.com';

      const responseStatus = await userService.updateUserPassword(projectsWithEmail[0].id, email, newPassword, resetCode);

      expect(responseStatus.status).toBe(401);
      expect(prisma.user.findFirstOrThrow({ where: { projectId: projectsWithEmail[0].id, email } })).rejects.toThrow(NotFoundError);
    });
  });
});
