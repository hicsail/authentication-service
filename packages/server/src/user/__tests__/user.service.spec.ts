import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';

describe('UserModule Int-Test', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.SECRET })],
      providers: [PrismaService]
    }).compile();

    prisma = moduleRef.get(PrismaService);

    // adding dummy projects
    await prisma.project.createMany({ data: [{ name: 'dummy-project 01' }, { name: 'dummy-project 02' }, { name: 'dummy-project 03' }] });
    const dummyProjects = await prisma.project.findMany();

    // adding dummy admin users
    const dummyAdminsInput = [
      { projectId: dummyProjects[0].id, username: 'admin0', email: 'admin0@mail.com', password: '6pD$y38^6HzFcT6P', role: 1 },
      { projectId: dummyProjects[1].id, username: 'admin1', password: 'a7kgFU*#26f5KgRP', role: 1 },
      { projectId: dummyProjects[2].id, email: 'admin2@mail.com', password: 'kP15!YjF$5cLXUb%', role: 1 }
    ];
    await prisma.user.createMany({ data: dummyAdminsInput });
    const dummyAdmins = await prisma.user.findMany({ where: { role: 1 } });

    // adding dummy normal users
    const dummyUsersInput = [
      { projectId: dummyProjects[0].id, username: 'proj00-user0', email: 'user0@mail.com', password: 'dz$d0I05s4!AmIkN' },
      { projectId: dummyProjects[0].id, username: 'proj00-user1', email: 'user1@mail.com', password: '06!i68UKef87eCUs' },
      { projectId: dummyProjects[0].id, username: 'proj00-user2', email: 'user2@mail.com', password: 'V$fd5i9tu@LIHMa8' },

      { projectId: dummyProjects[0].id, username: 'proj01-user3', password: 'n5I0!2UU6K%y1QEJ' },
      { projectId: dummyProjects[0].id, username: 'proj01-user4', password: 'D02WuvmY!BG7Cmj8' },
      { projectId: dummyProjects[0].id, username: 'proj01-user5', password: 'Uuq#EoM9*7Q$519^' },

      { projectId: dummyProjects[0].id, email: 'user6@mail.com', password: '1X9YrCjya483@bCE' },
      { projectId: dummyProjects[0].id, email: 'user7@mail.com', password: '9wM#HB52MW^98Ni^' },
      { projectId: dummyProjects[0].id, email: 'user8@mail.com', password: 'IhS4^F6X6DcfI4#W' }
    ];
    await prisma.user.createMany({ data: dummyUsersInput });
    const dummyUsers = await prisma.user.findMany({ where: { role: 0 } });
  });

  // TODO: add test cases
  it.todo('TODO: add test cases');
});
