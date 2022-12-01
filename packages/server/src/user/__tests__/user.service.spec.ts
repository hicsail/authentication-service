import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Project, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';
import * as bcrypt from 'bcrypt';

describe('UserModule Integration Test (service)', () => {
  let prisma: PrismaService;
  let userService: UserService;

  let dummyProjects: Project[];
  let dummyAdmins: User[];
  let dummyUsers: User[];

  const HASH_ROUNDS = 10;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.SECRET })],
      providers: [PrismaService]
    }).compile();

    prisma = moduleRef.get(PrismaService);

    const dummyProjectsInput = [{ name: 'dummy-project 01' }, { name: 'dummy-project 02' }, { name: 'dummy-project 03' }];

    // adding dummy projects
    dummyProjects = [];
    for (const projectInput of dummyProjectsInput) {
      const project = await prisma.project.create({ data: projectInput });
      dummyProjects.push(project);
    }
    console.log(`${dummyProjects.length} projects successfully created.`);

    const dummyAdminsInput = [
      { projectId: dummyProjects[0].id, username: 'admin0', email: 'admin0@mail.com', password: await bcrypt.hash('6pD$y38^6HzFcT6P', HASH_ROUNDS), role: 1 },
      { projectId: dummyProjects[1].id, username: 'admin1', password: await bcrypt.hash('a7kgFU*#26f5KgRP', HASH_ROUNDS), role: 1 },
      { projectId: dummyProjects[2].id, email: 'admin2@mail.com', password: await bcrypt.hash('kP15!YjF$5cLXUb%', HASH_ROUNDS), role: 1 }
    ];
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

    // adding dummy admin users
    dummyAdmins = [];
    for (const adminInput of dummyAdminsInput) {
      const admin = await prisma.user.create({ data: adminInput });
      dummyAdmins.push(admin);
    }
    console.log(`${dummyAdmins.length} admins successfully created.`);

    // adding dummy normal users
    dummyUsers = [];
    for (const userInput of dummyUsersInput) {
      const user = await prisma.user.create({ data: userInput });
      dummyUsers.push(user);
    }
    console.log(`${dummyUsers.length} users successfully created.`);

    // create controller and service objects
    userService = new UserService(prisma);
  });

  afterAll(async () => {
    const deleteProjects = prisma.project.deleteMany({ where: { id: { in: dummyProjects.map((project) => project.id) } } });
    const deleteAdmins = prisma.user.deleteMany({ where: { id: { in: dummyAdmins.map((admin) => admin.id) } } });
    const deleteUsers = prisma.user.deleteMany({ where: { id: { in: dummyUsers.map((user) => user.id) } } });

    await prisma.$transaction([deleteProjects, deleteAdmins, deleteUsers]);

    await prisma.$disconnect();
  });

  // TODO: Add test cases
  it.todo('Add test cases');
});
