import { Injectable } from '@nestjs/common';
import { Prisma, USER } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // TODO: remove this function when deploying
  async createTempUsers(): Promise<void> {
    const temp_users = [
      {
        project_id: 'project-001',
        username: 'admin0',
        email: 'some.admin@mail.com',
        password: await argon2.hash('some_admin.password'),
        role: 1,
        created_at: new Date('2020-01-01T09:00:01'),
        updated_at: new Date('2020-01-01T09:00:01')
      },
      {
        project_id: 'project-001',
        username: 'user0',
        email: 'some.user@mail.com',
        password: await argon2.hash('some_user_password'),
        created_at: new Date('2020-10-21T09:10:33'),
        updated_at: new Date('2020-10-21T09:10:33')
      },
      {
        project_id: 'project-001',
        username: 'user1',
        email: 'another.user@mail.com',
        password: await argon2.hash('another-user-password'),
        created_at: new Date('2021-02-17T15:44:10'),
        updated_at: new Date('2021-12-30T12:03:01')
      },
      {
        project_id: 'project-002',
        email: 'the_admin@mail.com',
        password: await argon2.hash('the_admin@project2'),
        role: 3,
        created_at: new Date('2022-02-10T10:30:00'),
        updated_at: new Date('2022-03-01T15:32:09')
      },
      {
        project_id: 'project-002',
        email: 'one_poor_user@mail.com',
        password: await argon2.hash('a_poor_user'),
        created_at: new Date('2022-05-10T15:10:30'),
        updated_at: new Date('2022-05-10T15:10:30')
      }
    ];

    for (const user of temp_users) {
      this.prisma.uSER.create({
        data: user
      });
    }
  }

  /**
   * Register a new record of user in the database
   *
   * @param data object that should contains `project_id: string`, `username?: string`, `email: string` and `password: string` in plain text
   * @returns User object
   */
  async registerUser(data: Prisma.USERCreateInput): Promise<USER> {
    const pwd_hash = await argon2.hash(data.password);

    const user = this.prisma.uSER.create({
      data: {
        project_id: data.project_id,
        username: data.username,
        email: data.email,
        password: pwd_hash
      }
    });

    return user;
  }

  /**
   * Find unique user for a project using email and login.
   *
   * @param params object includes: `project_id` and `username` as string
   * @param pwd_plain password in plain text
   * @returns User object if password matches, otherwise return `null`
   */
  async loginUserByUsername(params: { project_id; username }, pwd_plain: string): Promise<USER> {
    const user = await this.prisma.uSER.findUniqueOrThrow({
      where: {
        proj_username: params
      }
    });

    try {
      if (await argon2.verify(user.password, pwd_plain)) {
        return user;
      } else {
        return null;
      }
    } catch (err) {
      // TODO: internal failure behavior
    }

    return null;
  }

  /**
   * Find unique user for a project using email and login.
   *
   * @param params object includes: `project_id` and `email` as string
   * @param pwd_plain password in plain text
   * @returns User object if password matches, otherwise return `null`
   */
  async loginUserByEmail(params: { project_id; email }, pwd_plain: string): Promise<USER> {
    const user = await this.prisma.uSER.findUniqueOrThrow({
      where: {
        proj_email: params
      }
    });

    try {
      if (await argon2.verify(user.password, pwd_plain)) {
        return user;
      } else {
        return null;
      }
    } catch (err) {
      // TODO: internal failure behavior
    }

    return null;
  }

  /**
   * Generate reset token for a user and update it in the database.
   *
   * @param params object includes: `project_id` and `email` as string
   * @param reset_code_plain a string of reset code in plain text
   */
  async setResetToken(params: { project_id; email }, reset_code_plain: string): Promise<void> {
    const reset_code_hash = await argon2.hash(reset_code_plain);

    const valid_time = 60 * 60 * 1000; // valid time for reset code in millisecond
    const user = await this.prisma.uSER.update({
      where: {
        proj_email: params
      },
      data: {
        reset_code: reset_code_hash,
        reset_code_expires_at: new Date(Date.now() + valid_time)
      }
    });
  }

  /**
   * Update user password after verifying user's reset_code against the database
   *
   * @param params object includes: `project_id` and `email` as string
   * @param pwd_plain password in plain text
   * @param reset_code_plain a string of reset code in plain text
   */
  async updateUserPassword(params: { project_id; email }, pwd_plain: string, reset_code_plain: string): Promise<void> {
    // check if reset code matches
    const user = await this.prisma.uSER.findUniqueOrThrow({
      where: {
        proj_email: params
      }
    });

    const now = new Date(Date.now());
    if ((await argon2.verify(user.reset_code, reset_code_plain)) && now < user.reset_code_expires_at) {
      const pwd_hash = await argon2.hash(pwd_plain);

      this.prisma.uSER.update({
        where: {
          proj_email: params
        },
        data: {
          password: pwd_hash,
          reset_code: null,
          reset_code_expires_at: null
        }
      });
    }
  }

  // TODO: Add other functions, refer to docs on clickup and diagrams
}
