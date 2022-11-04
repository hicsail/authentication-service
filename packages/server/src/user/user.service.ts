import { Injectable } from '@nestjs/common';
import { Prisma, USER } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createTempUsers() {
    // TODO: add temp users to database
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
        password: pwd_hash,
        role: 0
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
  async setResetToken(params: { project_id; email }, reset_code_plain: string) {
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
  async updateUserPassword(params: { project_id; email }, pwd_plain: string, reset_code_plain: string) {
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
