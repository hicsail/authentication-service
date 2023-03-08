import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Project, User } from '@prisma/client';

export class UserTestUtil {
  private prisma: PrismaService;

  private dummyProjects: Project[];
  private dummyAdmins: User[];
  private dummyUsers: User[];

  private readonly HASH_ROUNDS = 10;

  async setup(): Promise<TestingModule> {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.SECRET })],
      providers: [PrismaService]
    }).compile();

    this.prisma = moduleRef.get(PrismaService);

    return moduleRef;
  }

  async tearDown(): Promise<void> {
    await this.prisma.user.deleteMany({ where: { projectId: { in: this.dummyProjects.map((project) => project.id) } } });
    await this.prisma.project.deleteMany({ where: { id: { in: this.dummyProjects.map((project) => project.id) } } });
  }

  async createDummyProjects(): Promise<Project[]> {
    const dummyProjectsInput = [{ name: 'dummy-project 01' }, { name: 'dummy-project 02' }, { name: 'dummy-project 03' }];

    this.dummyProjects = [];
    for (const projectInput of dummyProjectsInput) {
      const project = await this.prisma.project.create({ data: projectInput });
      this.dummyProjects.push(project);
    }
    console.log(`${this.dummyProjects.length} projects successfully created.`);

    return this.dummyProjects;
  }

  async createDummyAdmins(): Promise<User[]> {
    if (this.dummyProjects.length <= 0) {
      return null;
    }

    const dummyAdminsInput = [
      {
        projectId: this.dummyProjects[0].id,
        username: 'admin0',
        fullname: 'real admin0',
        email: 'admin0@mail.com',
        password: await bcrypt.hash('6pD$y38^6HzFcT6P', this.HASH_ROUNDS),
        role: 1
      },
      { projectId: this.dummyProjects[1].id, username: 'admin1', fullname: 'real admin1', password: await bcrypt.hash('a7kgFU*#26f5KgRP', this.HASH_ROUNDS), role: 1 },
      { projectId: this.dummyProjects[2].id, email: 'admin2@mail.com', fullname: 'real admin2', password: await bcrypt.hash('kP15!YjF$5cLXUb%', this.HASH_ROUNDS), role: 1 }
    ];

    this.dummyAdmins = [];
    for (const adminInput of dummyAdminsInput) {
      const admin = await this.prisma.user.create({ data: adminInput });
      this.dummyAdmins.push(admin);
    }
    console.log(`${this.dummyAdmins.length} admins successfully created.`);

    return this.dummyAdmins;
  }

  async createDummyUsers(): Promise<User[]> {
    if (this.dummyProjects.length <= 0) {
      return null;
    }

    const dummyUsersInput = [
      {
        projectId: this.dummyProjects[0].id,
        username: 'proj00-user0',
        fullname: 'proj00 user0',
        email: 'user0@mail.com',
        password: await bcrypt.hash('dz$d0I05s4!AmIkN', this.HASH_ROUNDS)
      },
      {
        projectId: this.dummyProjects[0].id,
        username: 'proj00-user1',
        fullname: 'proj00 user0',
        email: 'user1@mail.com',
        password: await bcrypt.hash('06!i68UKef87eCUs', this.HASH_ROUNDS)
      },
      {
        projectId: this.dummyProjects[0].id,
        username: 'proj00-user2',
        fullname: 'proj00 user0',
        email: 'user2@mail.com',
        password: await bcrypt.hash('V$fd5i9tu@LIHMa8', this.HASH_ROUNDS)
      },

      { projectId: this.dummyProjects[1].id, username: 'proj01-user3', fullname: 'proj01 user3', password: await bcrypt.hash('n5I0!2UU6K%y1QEJ', this.HASH_ROUNDS) },
      { projectId: this.dummyProjects[1].id, username: 'proj01-user4', fullname: 'proj01 user4', password: await bcrypt.hash('D02WuvmY!BG7Cmj8', this.HASH_ROUNDS) },
      { projectId: this.dummyProjects[1].id, username: 'proj01-user5', fullname: 'proj01 user5', password: await bcrypt.hash('Uuq#EoM9*7Q$519^', this.HASH_ROUNDS) },

      { projectId: this.dummyProjects[2].id, email: 'user6@mail.com', fullname: 'proj02 user6', password: await bcrypt.hash('1X9YrCjya483@bCE', this.HASH_ROUNDS) },
      { projectId: this.dummyProjects[2].id, email: 'user7@mail.com', fullname: 'proj02 user7', password: await bcrypt.hash('9wM#HB52MW^98Ni^', this.HASH_ROUNDS) },
      { projectId: this.dummyProjects[2].id, email: 'user8@mail.com', fullname: 'proj02 user8', password: await bcrypt.hash('IhS4^F6X6DcfI4#W', this.HASH_ROUNDS) }
    ];

    this.dummyUsers = [];
    for (const userInput of dummyUsersInput) {
      const user = await this.prisma.user.create({ data: userInput });
      this.dummyUsers.push(user);
    }
    console.log(`${this.dummyUsers.length} users successfully created.`);

    return this.dummyUsers;
  }
}
