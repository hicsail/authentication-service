import { HttpException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Project, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import * as bcrypt from 'bcrypt';

describe('UserModule Integration Test', () => {
  let prisma: PrismaService;
  let userController: UserController;
  let userService: UserService;

  let dummyProjects: Project[];
  let dummyAdmins: User[];
  let dummyUsers: User[];

  let randomProject: Project;
  let randomUser: User;

  const HASH_ROUNDS = 10;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.SECRET })],
      providers: [PrismaService]
    }).compile();

    prisma = moduleRef.get(PrismaService);

    // adding dummy projects
    await prisma.project.createMany({ data: [{ name: 'dummy-project 01' }, { name: 'dummy-project 02' }, { name: 'dummy-project 03' }] });
    dummyProjects = await prisma.project.findMany();

    console.log('3 projects successfully created.');

    // adding dummy admin users
    const dummyAdminsInput = [
      { projectId: dummyProjects[0].id, username: 'admin0', email: 'admin0@mail.com', password: await bcrypt.hash('6pD$y38^6HzFcT6P', HASH_ROUNDS), role: 1 },
      { projectId: dummyProjects[1].id, username: 'admin1', password: await bcrypt.hash('a7kgFU*#26f5KgRP', HASH_ROUNDS), role: 1 },
      { projectId: dummyProjects[2].id, email: 'admin2@mail.com', password: await bcrypt.hash('kP15!YjF$5cLXUb%', HASH_ROUNDS), role: 1 }
    ];
    await prisma.user.createMany({ data: dummyAdminsInput });
    dummyAdmins = await prisma.user.findMany({ where: { role: 1 } });

    console.log('3 admins successfully created.');

    // adding dummy normal users
    const dummyUsersInput = [
      { projectId: dummyProjects[0].id, username: 'proj00-user0', email: 'user0@mail.com', password: await bcrypt.hash('dz$d0I05s4!AmIkN', HASH_ROUNDS) },
      { projectId: dummyProjects[0].id, username: 'proj00-user1', email: 'user1@mail.com', password: await bcrypt.hash('06!i68UKef87eCUs', HASH_ROUNDS) },
      { projectId: dummyProjects[0].id, username: 'proj00-user2', email: 'user2@mail.com', password: await bcrypt.hash('V$fd5i9tu@LIHMa8', HASH_ROUNDS) },

      { projectId: dummyProjects[1].id, username: 'proj01-user3', password: await bcrypt.hash('n5I0!2UU6K%y1QEJ', HASH_ROUNDS) },
      { projectId: dummyProjects[1].id, username: 'proj01-user4', password: await bcrypt.hash('D02WuvmY!BG7Cmj8', HASH_ROUNDS) },
      { projectId: dummyProjects[1].id, username: 'proj01-user5', password: await bcrypt.hash('Uuq#EoM9*7Q$519^', HASH_ROUNDS) },

      { projectId: dummyProjects[2].id, email: 'user6@mail.com', password: await bcrypt.hash('1X9YrCjya483@bCE', HASH_ROUNDS) },
      { projectId: dummyProjects[2].id, email: 'user7@mail.com', password: await bcrypt.hash('9wM#HB52MW^98Ni^', HASH_ROUNDS) },
      { projectId: dummyProjects[2].id, email: 'user8@mail.com', password: await bcrypt.hash('IhS4^F6X6DcfI4#W', HASH_ROUNDS) }
    ];
    await prisma.user.createMany({ data: dummyUsersInput });
    dummyUsers = await prisma.user.findMany({ where: { role: 0 } });

    console.log('9 users successfully created.');

    // create controller and service objects
    userService = new UserService(prisma);
    userController = new UserController(userService);
  });

  afterAll(async () => {
    const deleteProjects = prisma.project.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteProjects, deleteUsers]);

    await prisma.$disconnect();
  });

  beforeEach(async () => {
    randomProject = dummyProjects[Math.floor(Math.random() * dummyProjects.length)];
    randomUser = dummyUsers.concat(dummyAdmins)[Math.floor(Math.random() * (dummyAdmins.length + dummyUsers.length))];
  });

  it('Return requested user object (self)', async () => {
    const req = { user: { id: randomUser.id } };
    const responseUser = await userController.getMyInfo(req);

    expect(responseUser).toEqual(randomUser);
  });

  it('Throw an error for requesting a non-existing user (self)', async () => {
    const req = { user: { id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' } };
    expect(userController.getMyInfo(req)).rejects.toThrow(HttpException);
  });

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

  it('Return empty list for requesting a non-existing project', () => {
    const req = { user: { projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' } };
    expect(userController.getAllUsersFromCurrentProject(req)).resolves.toEqual([]);
  });

  it('Return requested user object (other)', async () => {
    const responseUser = await userController.getUserInfo(randomUser.id);
    expect(responseUser).toEqual(randomUser);
  });

  it('Throw an erorr for requesting a non-existing user (other)', () => {
    expect(userController.getUserInfo(randomUser.id)).rejects.toThrow(HttpException);
  });
});
