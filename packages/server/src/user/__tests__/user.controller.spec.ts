import { HttpException } from '@nestjs/common';
import { Project, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserTestUtil } from './utils/user.test.util';

describe('UserModule Integration Test', () => {
  let userTestUtil: UserTestUtil;

  let prisma: PrismaService;
  let userController: UserController;
  let userService: UserService;

  let dummyProjects: Project[];
  let dummyAdmins: User[];
  let dummyUsers: User[];

  let randomProject: Project;
  let randomUser: User;

  beforeAll(async () => {
    userTestUtil = new UserTestUtil();

    const moduleRef = await userTestUtil.setup();

    prisma = moduleRef.get(PrismaService);

    dummyProjects = await userTestUtil.createDummyProjects();
    dummyAdmins = await userTestUtil.createDummyAdmins();
    dummyUsers = await userTestUtil.createDummyUsers();

    // create controller and service objects
    userService = new UserService(prisma);
    userController = new UserController(userService);
  });

  afterAll(async () => {
    await userTestUtil.tearDown();
  });

  beforeEach(async () => {
    randomProject = dummyProjects[Math.floor(Math.random() * dummyProjects.length)];
    randomUser = dummyUsers.concat(dummyAdmins)[Math.floor(Math.random() * (dummyAdmins.length + dummyUsers.length))];
  });

  /**
   * Test cases for `getMyInfo()` API
   */
  it('Return requested user object (self)', async () => {
    const req = { user: { id: randomUser.id } };
    const responseUser = await userController.getMyInfo(req);

    expect(responseUser).toEqual(randomUser);
  });

  it('Throw an error for requesting a non-existing user (self)', async () => {
    const req = { user: { id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' } };
    expect(userController.getMyInfo(req)).rejects.toThrow(HttpException);
  });

  /**
   * Test cases for `getAllUsersFromCurrentProject()` API
   */
  it('Return requested users for a project', async () => {
    const req = { user: { projectId: randomProject.id } };
    const responseUsers = await userController.getAllUsersFromCurrentProject(req);
    const matchUsers = dummyUsers.concat(dummyAdmins).filter((element) => {
      return element.projectId === randomProject.id;
    });

    for (const user of matchUsers) {
      expect(responseUsers).toContainEqual(user);
    }
  });

  it('Return empty list for requesting a non-existing project', async () => {
    const req = { user: { projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' } };
    expect(userController.getAllUsersFromCurrentProject(req)).resolves.toEqual([]);
  });

  /**
   * Test cases for `getUserInfo()` API
   */
  it('Return requested user object (other)', async () => {
    const responseUser = await userController.getUserInfo(randomUser.id);
    expect(responseUser).toEqual(randomUser);
  });

  it('Throw an erorr for requesting a non-existing user (other)', async () => {
    const userId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    expect(userController.getUserInfo(userId)).rejects.toThrow(HttpException);
  });

  /**
   * Test cases for `addRoleToUser()` API
   */
  it('Add new roles to user should success', async () => {
    const randomNormalUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
    const rolesToAdd = [parseInt('0001', 2), parseInt('0100', 2)]; // Add admin role '1' and custom role '4'

    const responseVal = await userController.addRoleToUser(randomNormalUser.id, rolesToAdd[0] + rolesToAdd[1]);
    const userEdited = await prisma.user.findUnique({ where: { id: randomNormalUser.id } });

    expect(responseVal).toBe(true);

    for (const role of rolesToAdd.concat(randomNormalUser.role)) {
      expect(userEdited.role & role).toBe(role);
    }
  });

  it('Add duplicated roles to user should keep original role', async () => {
    const randomAdmin = dummyAdmins[Math.floor(Math.random() * dummyAdmins.length)];
    const rolesToAdd = [randomAdmin.role, parseInt('1000', 2)];

    const responseVal = await userController.addRoleToUser(randomAdmin.id, rolesToAdd[0] + rolesToAdd[1]);
    const userEdited = await prisma.user.findUnique({ where: { id: randomAdmin.id } });

    expect(responseVal).toBe(true);

    for (const role of rolesToAdd) {
      expect(userEdited.role & role).toBe(role);
    }
  });

  it('Add roles to non-existing user should return false', async () => {
    const userId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const rolesToAdd = [parseInt('0001', 2), parseInt('0100', 2)]; // Add admin role '1' and custom role '4'
    expect(userController.addRoleToUser(userId, rolesToAdd[0] + rolesToAdd[1])).resolves.toBe(false);
  });

  /**
   * Test cases for `removeRoleFromUser()` API
   */
  it('Remove roles from a user should success', async () => {
    const tempUserInput = { projectId: randomProject.id, username: 'temp', email: 'temp@mail.com', password: 'passsword', role: parseInt('10101010', 2) };
    const tempUser = await prisma.user.create({ data: tempUserInput });
    const rolesToRemove = parseInt('10001010', 2);

    const responseVal = await userController.removeRoleFromUser(tempUser.id, rolesToRemove);
    const userEdited = await prisma.user.findUnique({ where: { id: tempUser.id } });

    expect(responseVal).toBe(true);
    expect(userEdited.role & rolesToRemove).toBe(0);

    await prisma.user.delete({ where: { id: tempUser.id } });
  });

  it('Remove roles that user does not have should remain unchanged', async () => {
    const tempUserInput = { projectId: randomProject.id, username: 'temp', email: 'temp@mail.com', password: 'password', role: parseInt('11010101', 2) };
    const tempUser = await prisma.user.create({ data: tempUserInput });
    const rolesToRemove = parseInt('10100011', 2);

    const responseVal = await userController.removeRoleFromUser(tempUser.id, rolesToRemove);
    const userEdited = await prisma.user.findUnique({ where: { id: tempUser.id } });

    expect(responseVal).toBe(true);
    expect(userEdited.role & rolesToRemove).toBe(0);

    await prisma.user.delete({ where: { id: userEdited.id } });
  });

  it('Remove roles from non-existing user should return false', async () => {
    const userId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const rolesToRemove = parseInt('10010101', 2);
    expect(userController.removeRoleFromUser(userId, rolesToRemove)).resolves.toBe(false);
  });
});
