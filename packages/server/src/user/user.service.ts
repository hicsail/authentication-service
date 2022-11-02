import { Injectable } from '@nestjs/common';
import { Prisma, USER } from '@prisma/client';
import { emit } from 'process';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // TO BE REMOVED
  // temp user list for testing purposes
  private readonly users: USER[] = [
    {
      id: 'a31247c5-2632-45e8-b7e2-746ba5a2d1e8',
      project_id: 'project-001',
      username: 'user0',
      email: 'some.user@mail.com',
      password: 'some_user_password',
      role: 0,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      reset_code: 'some_reset_code',
      reset_code_expires_at: null
    },
    {
      id: '94ea3787-16e0-4a5c-b9a5-d345f4fa82dd',
      project_id: 'project-001',
      username: 'user1',
      email: 'another.user@mail.com',
      password: 'another_user_password',
      role: 0,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      reset_code: null,
      reset_code_expires_at: null
    },
    {
      id: 'e929ebd5-a899-4df2-a94c-0f024de39cbd',
      project_id: 'project-002',
      username: 'admin0',
      email: 'some.admin@mail.com',
      password: 'some_admin_password',
      role: 1,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      reset_code: null,
      reset_code_expires_at: null
    }
  ];

  /**
   * Create a new record of user in the database
   *
   * @param data object that should contains `project_id: string`, `username?: string`, `email: string` and `password: string` in plain text
   * @returns User object
   */
  async createUser(data: Prisma.USERCreateInput): Promise<USER> {
    // TO BE ADDED

    // TO BE REMOVED
    // create and return a dummy user for testing
    const user = {
      id: '259aab6e-ac66-4ad0-b2ca-6671336d67bf',
      project_id: data.project_id,
      username: data.username,
      email: data.username,
      password: data.password,
      role: 0,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      reset_code: null,
      reset_code_expires_at: null
    };

    this.users.push(user);

    return user;
  }

  /**
   * Find unique user for a project using email.
   *
   * @param params object includes: `project_id`, `username`, and `password` in plain text
   * @returns User object
   */
  async findUserByUsername(params: { project_id; username; password }): Promise<USER> {
    // TO BE ADDED

    // TO BE REMOVED
    // return dummy user for testing
    for (const user of this.users) {
      if (params.project_id === user.project_id && params.username === user.username && params.password === user.password) {
        return user;
      }
    }

    return null;
  }

  /**
   * Find unique user for a project using email.
   *
   * @param params object includes: `project_id`, `email`, and `password` in plain text
   * @returns User object
   */
  async findUserByEmail(params: { project_id; email; password }): Promise<USER> {
    // TO BE ADDED

    // TO BE REMOVED
    // return dummy user for testing
    for (const user of this.users) {
      if (params.project_id === user.project_id && params.email === user.email && params.password === user.password) {
        return user;
      }
    }

    return null;
  }

  /**
   * Generate reset token for a user and update it in the database.
   *
   * @param params object includes: `project_id` and `email`
   * @param reset_code a string of reset code in plain text
   */
  async setResetToken(params: { project_id; email }, reset_code: string) {
    // TO BE ADDED

    // TO BE REMOVED
    // code for testing
    for (let idx = 0; idx < this.users.length; idx++) {
      const user = this.users[idx];
      if (params.project_id === user.project_id && params.email === user.email) {
        user.reset_code = reset_code;
        break;
      }
    }
  }

  /**
   * Update user password after verifying user's reset_code against the database
   *
   * @param params object includes: `project_id`, `email` and new `password` in plain text
   * @param reset_code a string of reset code in plain text
   */
  async updateUserPassword(params: { project_id; email; password }, reset_code: string) {
    // TO BE ADDED

    // TO BE REMOVED
    // code for testing
    for (let idx = 0; idx < this.users.length; idx++) {
      const user = this.users[idx];
      if (params.project_id === user.project_id && params.email === user.email && reset_code === user.reset_code) {
        user.reset_code = null;
        user.password = params.password;
      }
    }
  }

  // MORE FUNCTIONS TO BE ADDED
}
