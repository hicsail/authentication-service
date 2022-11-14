import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { addHours, isFuture } from 'date-fns';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly SALT_ROUNDS: number = 10;

  // TODO: remove this function when deploying
  /**
   * This function is for creating a list of users record in database. It should be called only once.
   * The purpose of this function is for testing only and should be removed before deployment.
   * You can also modify or add more user obejct to the `temp_users` list.
   */
  async createTempUsers(): Promise<void> {
    // TODO: add temp users to database
    const temp_users = [
      {
        project_id: 'project-001',
        username: 'admin0',
        email: 'some.admin@mail.com',
        password: await bcrypt.hash('some_admin.password', this.SALT_ROUNDS),
        role: 1,
        created_at: new Date('2020-01-01T09:00:01'),
        updated_at: new Date('2020-01-01T09:00:01')
      },
      {
        project_id: 'project-001',
        username: 'user0',
        email: 'some.user@mail.com',
        password: await bcrypt.hash('some_user_password', this.SALT_ROUNDS),
        created_at: new Date('2020-10-21T09:10:33'),
        updated_at: new Date('2020-10-21T09:10:33')
      },
      {
        project_id: 'project-001',
        username: 'user1',
        email: 'another.user@mail.com',
        password: await bcrypt.hash('another-user-password', this.SALT_ROUNDS),
        created_at: new Date('2021-02-17T15:44:10'),
        updated_at: new Date('2021-12-30T12:03:01')
      },
      {
        project_id: 'project-002',
        email: 'the_admin@mail.com',
        password: await bcrypt.hash('the_admin@project2', this.SALT_ROUNDS),
        role: 3,
        created_at: new Date('2022-02-10T10:30:00'),
        updated_at: new Date('2022-03-01T15:32:09')
      },
      {
        project_id: 'project-002',
        email: 'one_poor_user@mail.com',
        password: await bcrypt.hash('a_poor_user', this.SALT_ROUNDS),
        created_at: new Date('2022-05-10T15:10:30'),
        updated_at: new Date('2022-05-10T15:10:30')
      }
    ];

    for (const user of temp_users) {
      await this.prisma.user.create({
        data: user
      });
    }
  }

  /**
   * Register a new record of user in the database
   *
   * @param data object that should contains `project_id: string`, `username?: string`, `email?: string` and `password: string` in plain text.
   * **NOTE:** `data` should contain either `username`, `email`, or both.
   * @returns User object, throws an `Error` when user already exist in the database
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // check if such user exist in the database
    const user_count = await this.prisma.user.count({
      where: {
        AND: {
          project_id: data.project_id,
          OR: [{ username: data.username }, { email: data.email }]
        }
      }
    });

    // throw error if user exist
    if (user_count !== 0) {
      throw new Error('User already exist in the database.');
    }

    const pwd_hash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    return await this.prisma.user.create({
      data: {
        project_id: data.project_id,
        username: data.username,
        email: data.email,
        password: pwd_hash
      }
    });
  }

  /**
   * Find all user records in the database
   *
   * @returns List of `User` object, will return empty list if no user found
   */
  async findAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  /**
   * Find all user records from one project using project ID
   *
   * @param project_id id of the project
   * @returns List of `User` object, will return empty list if no user found
   */
  async findUsersByProjectId(project_id: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        project_id: project_id
      }
    });
  }

  /**
   * Find unique user using id for all project
   *
   * @param id uuid of the user as string
   * @returns `User` object, or throw `NotFoundError` when not exist
   */
  async findUserById(id: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({ where: { id: id } });
  }

  /**
   * Find unique user for a project using email.
   *
   * @returns `User` object, or throw `NotFoundError` when not exist
   */
  async findUserByUsername(project_id: string, username: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        project_id: project_id,
        username: username
      }
    });
  }

  /**
   * Find unique user for a project using email.
   *
   * @returns `User` object, or throw `NotFoundError` when not exist
   */
  async findUserByEmail(project_id: string, email: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        project_id: project_id,
        email: email
      }
    });
  }

  /**
   * Generate reset token for a user and store it in the database.
   *
   * @param params object includes: `project_id` and `email` as string
   * @param reset_code_plain a string of reset code in plain text
   */
  async setResetToken(params: { project_id: string; email: string }, reset_code_plain: string): Promise<void> {
    const user_to_update = await this.findUserByEmail(params.project_id, params.email);

    const reset_code_hash = await bcrypt.hash(reset_code_plain, this.SALT_ROUNDS);

    await this.prisma.user.update({
      where: {
        id: user_to_update.id
      },
      data: {
        reset_code: reset_code_hash,
        reset_code_expires_at: addHours(new Date(), 1) // TODO: change default expiration time
      }
    });
  }

  /**
   * Update user password after verifying user's reset_code against the database
   *
   * @param params object includes: `project_id` and `email` as string
   * @param pwd_plain new password in plain text
   * @param reset_code_plain a string of reset code in plain text
   */
  async updateUserPassword(params: { project_id: string; email: string }, pwd_plain: string, reset_code_plain: string): Promise<void> {
    const user_to_update = await this.findUserByEmail(params.project_id, params.email);

    // check expiration time and if reset code matches
    if ((await bcrypt.compare(reset_code_plain, user_to_update.reset_code)) && isFuture(user_to_update.reset_code_expires_at)) {
      const pwd_hash = await bcrypt.hash(pwd_plain, this.SALT_ROUNDS);

      await this.prisma.user.update({
        where: {
          id: user_to_update.id
        },
        data: {
          password: pwd_hash,
          updated_at: new Date(),
          reset_code: null,
          reset_code_expires_at: null
        }
      });
    } else {
      throw new Error(`Password failed to be updated.`);
    }
  }

  /**
   * Update user's role
   *
   * @param id uuid of the user as string
   * @param role_to_edit role needs to edit in number representation, refer to `role.enum.ts`
   * @param add_role `true` for add new role to user, `false` for remove role from user
   */
  async updateUserRole(id: string, role_to_edit: number, add_role: boolean): Promise<void> {
    const user_to_update = await this.findUserById(id);

    // Add a role: role OR role_to_add
    // Remove a role: role XOR role_to_remove
    const role = add_role ? user_to_update.role | role_to_edit : user_to_update.role ^ role_to_edit;

    await this.prisma.user.update({
      where: {
        id: user_to_update.id
      },
      data: {
        role: role
      }
    });
  }

  // TODO: Add other functions, refer to docs on clickup and diagrams
}
