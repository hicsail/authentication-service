import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addHours, isFuture } from 'date-fns';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly SALT_ROUNDS: number = 10;

  /**
   * Register a new record of user in the database
   *
   * @param data object that should contain `projectId: string`, `username?: string`, `email?: string` and `password: string` in plain text.
   * **NOTE:** `data` should contain either `username`, `email`, or both.
   * @returns User object, throws an `Error` when user already exist in the database
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // check if such user exist in the database
    const userCount = await this.prisma.user.count({
      where: {
        AND: {
          projectId: data.projectId,
          OR: [{ username: data.username }, { email: data.email }]
        }
      }
    });

    // throw error if user exist
    if (userCount !== 0) {
      throw new Error('User already exist in the database.');
    }

    const pwdHash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    return await this.prisma.user.create({
      data: {
        projectId: data.projectId,
        username: data.username,
        email: data.email,
        password: pwdHash
      }
    });
  }

  /**
   * Find all user records in the database
   *
   * @returns List of `User` object, will return empty list if no user found
   */
  async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  /**
   * Find all user records from one project using project ID
   *
   * @param projectId id of the project
   * @returns List of `User` object, will return empty list if no user found
   */
  async findUsersByProjectId(projectId: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        projectId: projectId
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
  async findUserByUsername(projectId: string, username: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        projectId: projectId,
        username: username
      }
    });
  }

  /**
   * Find unique user for a project using email.
   *
   * @returns `User` object, or throw `NotFoundError` when not exist
   */
  async findUserByEmail(projectId: string, email: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        projectId: projectId,
        email: email
      }
    });
  }

  /**
   * Generate reset token for a user and store it in the database.
   *
   * @param params object includes: `projectId` and `email` as string
   * @param resetCodePlain a string of reset code in plain text
   */
  async setResetToken(projectId: string, email: string, resetCodePlain: string): Promise<void> {
    const userToUpdate = await this.findUserByEmail(projectId, email);

    const resetCodeHash = await bcrypt.hash(resetCodePlain, this.SALT_ROUNDS);

    await this.prisma.user.update({
      where: {
        id: userToUpdate.id
      },
      data: {
        resetCode: resetCodeHash,
        resetCodeExpiresAt: addHours(new Date(), 1) // TODO: change default expiration time
      }
    });
  }

  /**
   * Update user password after verifying user's reset code against the database
   *
   * @param params object includes: `projectId` and `email` as string
   * @param pwdPlain new password in plain text
   * @param resetCodePlain a string of reset code in plain text
   */
  async updateUserPassword(projectId: string, email: string, pwdPlain: string, resetCodePlain: string): Promise<void> {
    const userToUpdate = await this.findUserByEmail(projectId, email);

    // check expiration time and if reset code matches
    if ((await bcrypt.compare(resetCodePlain, userToUpdate.resetCode)) && isFuture(userToUpdate.resetCodeExpiresAt)) {
      const pwdHash = await bcrypt.hash(pwdPlain, this.SALT_ROUNDS);

      await this.prisma.user.update({
        where: {
          id: userToUpdate.id
        },
        data: {
          password: pwdHash,
          updatedAt: new Date(),
          resetCode: null,
          resetCodeExpiresAt: null
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
   * @param roleToEdit role needs to edit in number representation, refer to `role.enum.ts`
   * @param addRole `true` for add new role to user, `false` for remove role from user
   */
  async updateUserRole(id: string, roleToEdit: number, addRole = true): Promise<void> {
    const userToUpdate = await this.findUserById(id);

    // Add a role: role OR role_to_add
    // Remove a role: role XOR role_to_remove
    const role = addRole ? userToUpdate.role | roleToEdit : userToUpdate.role ^ roleToEdit;

    await this.prisma.user.update({
      where: {
        id: userToUpdate.id
      },
      data: {
        role
      }
    });
  }
}
