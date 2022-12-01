import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addHours, isFuture } from 'date-fns';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateStatus } from './types/user.types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly SALT_ROUNDS: number = 10;

  /**
   * Register a new record of user in the database
   *
   * @param newUser object that should contain `projectId: string`, `username?: string`, `email?: string` and `password: string` in plain text.
   * **NOTE:** `newUser` should contain either `username`, `email`, or both.
   * @returns User object, throws an `Error` when user already exist in the database
   */
  async createUser(newUser: Prisma.UserUncheckedCreateInput): Promise<User> {
    // check if such user exist in the database
    const userCount = await this.prisma.user.count({
      where: {
        AND: {
          projectId: newUser.projectId,
          OR: [{ username: newUser.username }, { email: newUser.email }]
        }
      }
    });

    // throw error if user exist
    if (userCount !== 0) {
      throw new Error('User already exist in the database.');
    }

    const pwdHash = await bcrypt.hash(newUser.password, this.SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        projectId: newUser.projectId,
        username: newUser.username,
        email: newUser.email,
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
   * @param projectId ID of the project
   * @returns List of `User` object, will return empty list if no user found
   */
  async findUsersByProjectId(projectId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        projectId
      }
    });
  }

  /**
   * Find unique user using ID for all project
   *
   * @param id ID of the user
   * @returns `User` object, or throw `NotFoundError` when not exist
   */
  async findUserById(id: string): Promise<User> {
    return this.prisma.user.findFirstOrThrow({ where: { id: id } });
  }

  /**
   * Find unique user for a project using email.
   *
   * @param projectId project ID where the user belong to
   * @param username username of the user
   * @returns `User` object, or throw `NotFoundError` when not exist
   */
  async findUserByUsername(projectId: string, username: string): Promise<User> {
    if (projectId == null || username == null) {
      return null;
    }

    try {
      return this.prisma.user.findFirst({
        where: {
          projectId,
          username
        }
      });
    } catch (NotFoundError) {
      return null;
    }
  }

  /**
   * Find unique user for a project using email.
   *
   * @param projectId project ID where the user belong to
   * @param email email of the user
   * @returns `User` object, or throw `NotFoundError` when not exist
   */
  async findUserByEmail(projectId: string, email: string): Promise<User> {
    if (projectId == null || email == null) {
      return null;
    }

    try {
      return this.prisma.user.findFirst({
        where: {
          projectId,
          email
        }
      });
    } catch (NotFoundError) {
      return null;
    }
  }

  /**
   * Generate reset token for a user and store it in the database.
   *
   * @param projectId project ID where the user belong to
   * @param email email of the user
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
   * @param projectId project ID where the user belong to
   * @param email email of the user
   * @param pwdPlain new password in plain text
   * @param resetCodePlain a string of reset code in plain text
   * @returns UpdateStatus
   */
  async updateUserPassword(projectId: string, email: string, pwdPlain: string, resetCodePlain: string): Promise<UpdateStatus> {
    const userToUpdate = await this.findUserByEmail(projectId, email);

    if (!userToUpdate) {
      return {
        message: 'Unauthorized',
        status: 401
      };
    }

    const isActive = isFuture(userToUpdate.resetCodeExpiresAt);

    if (!isActive) {
      return {
        message: 'Reset code has expired.',
        status: 400
      };
    }

    const isValid = await bcrypt.compare(resetCodePlain, userToUpdate.resetCode);

    if (!isValid) {
      return {
        message: 'Invalid reset code.',
        status: 400
      };
    }

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

    return {
      message: 'Password successfully updated.',
      status: 200
    };
  }

  /**
   * Update user's role
   *
   * @param id ID of the user
   * @param roleToEdit role needs to edit in number representation, refer to `role.enum.ts`
   * @param addRole `true` for add new role to user, `false` for remove role from user
   */
  async updateUserRole(id: string, roleToEdit: number, addRole = true): Promise<void> {
    const userToUpdate = await this.findUserById(id);

    // Add a role: role OR roleToAdd
    // Remove a role: role XOR roleToRemove
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
