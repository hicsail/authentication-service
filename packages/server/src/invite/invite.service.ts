import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Invite, Project } from '@prisma/client';
import { UserService } from '../user/user.service';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { addDays, subDays } from 'date-fns';
import { InviteStatus } from './model/invite.status';
import { NotificationService } from '../notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { InviteModel } from './model/invite.model';
import { isPast } from 'date-fns';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class InviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly auth: AuthService,
    private readonly notification: NotificationService,
    private readonly config: ConfigService
  ) {}

  /**
   Creates a new invite and sends an invitation email.
   @param {Pick<Invite, 'email' | 'role'>} newInvite - The details of the new invite to create.
   @param {string} fromUserId - The ID of the user who is sending the invitation.
   @param {string} projectId - The ID of the project the user is inviting to.
   @returns {Promise<Invite>} The newly created invite.
   @throws {HttpException} If the user with the given email address already exists, or if an invite already exists for this user.
   */
  async createInvite(newInvite: Pick<Invite, 'email' | 'role'>, fromUserId: string, projectId: string): Promise<Invite> {
    // Check if user already exists with this email address
    if (await this.userService.findUserByEmail(projectId, newInvite.email)) {
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    }
    // Check if invite already exists for this email address
    if (await this.findInviteByEmail(projectId, newInvite.email)) {
      throw new HttpException('Invite already exists for this user', HttpStatus.FORBIDDEN);
    }
    // Generate a random invite code
    const inviteCode = randomBytes(4).toString('hex');
    const hashInviteCode = await hash(inviteCode, 10);
    // Set the invite expiration date to 7 days from now
    const expiresAt = addDays(new Date(), 7);
    // Create the invite in the database
    const invite = await this.prisma.invite.create({
      data: {
        projectId,
        email: newInvite.email,
        role: newInvite.role,
        expiresAt,
        inviteCode: hashInviteCode,
        invitedById: fromUserId
      }
    });
    // Send the invitation email
    await this.sendInviteEmail(invite, inviteCode);
    return invite;
  }

  /**
   Finds an invite by ID.
   @param {string} id - The ID of the invite to find.
   @returns {Promise<Invite>} The invite with the given ID.
   @throws {HttpException} If no invite is found with the given ID.
   */
  async findInviteById(id: string): Promise<Invite> {
    const invite = await this.prisma.invite.findUnique({
      where: {
        id
      }
    });
    if (!invite) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    return invite;
  }

  /**
   Finds an invite by email address.
   @param {string} projectId - The ID of the project to search within.
   @param {string} email - The email address to search for.
   @returns {Promise<Invite>} The first invite that matches the given email address and has not expired or been deleted.
   */
  async findInviteByEmail(projectId: string, email: string): Promise<Invite> {
    // Find the first invite that matches the given email address, is not deleted, and has not expired yet
    return await this.prisma.invite.findFirst({
      where: {
        projectId,
        email,
        deletedAt: null,
        expiresAt: {
          gt: new Date()
        }
      }
    });
  }

  /**
   Accepts an invitation by verifying the provided invite code and creating a new user account for the invitee.
   @param {string} inviteCode - The invite code to verify.
   @param {string} projectId - The ID of the project to accept the invite for.
   @param {string} email - The email address of the invitee.
   @param {string} password - The password to use for the new user account.
   @param {string} fullname - The full name to use for the new user account.
   @returns {Promise<InviteModel>} The updated invite record with the new user's ID.
   @throws {HttpException} If no matching invite is found, the invite has already been accepted, the invite code is invalid, or a user with the same email address already exists in the project.
   */
  async acceptInvite(inviteCode: string, projectId: string, email: string, password: string, fullname: string): Promise<InviteModel> {
    // Find the invite that is valid for the given email address and not cancelled or expired
    const invite = await this.findInviteByEmail(projectId, email);
    if (!invite) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    // Check if the invite has already been accepted
    if (invite.acceptedById) {
      throw new HttpException('Invite already accepted', HttpStatus.FORBIDDEN);
    }
    // Check if the user already exists
    if (await this.userService.findUserByEmail(projectId, invite.email)) {
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    }
    // Check if the invite code is valid
    if (!(await compare(inviteCode, invite.inviteCode))) {
      throw new HttpException('Invalid invite code', HttpStatus.FORBIDDEN);
    }
    // Sign up the user
    await this.auth.signup({
      email,
      password,
      fullname,
      projectId
    });
    // get user
    const user = await this.userService.findUserByEmail(projectId, email);
    if (invite.role != 0) {
      // Promote the user to the role specified in the invite
      await this.userService.updateUserRole(user.id, invite.role, true);
    }
    return this.prisma.invite.update({
      where: {
        id: invite.id
      },
      data: {
        acceptedById: user.id
      }
    });
  }

  /**
   Lists invites for a given project and status.
   If no status is specified, returns all invites for the project.
   @param projectId - The ID of the project to list invites for.
   @param status - The status of the invites to filter by.
   @returns An array of invites matching the given project ID and status.
   */
  async listInvites(projectId: string, status?: InviteStatus): Promise<Invite[]> {
    if (!status) {
      // Return all invites for the project, ordered by creation date (newest first)
      return this.prisma.invite.findMany({
        where: {
          projectId
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }
    switch (status) {
      case InviteStatus.ACCEPTED:
        // Return invites that have been accepted, ordered by creation date (newest first)
        return this.prisma.invite.findMany({
          where: {
            projectId,
            acceptedById: {
              not: null
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      case InviteStatus.CANCELLED:
        // Return invites that have been cancelled, ordered by creation date (newest first)
        return this.prisma.invite.findMany({
          where: {
            projectId,
            deletedAt: {
              not: null
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      case InviteStatus.EXPIRED:
        // Return invites that have expired and not been accepted or cancelled, ordered by creation date (newest first)
        return this.prisma.invite.findMany({
          where: {
            projectId,
            acceptedById: null,
            expiresAt: {
              lt: subDays(new Date(), 7)
            },
            deletedAt: null
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      case InviteStatus.PENDING:
        // Return invites that have not expired and not been accepted or cancelled, ordered by creation date (newest first)
        return this.prisma.invite.findMany({
          where: {
            projectId,
            acceptedById: null,
            expiresAt: {
              gte: subDays(new Date(), 7)
            },
            deletedAt: null
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
    }
  }

  /**
   Cancels an invite with the given ID and project ID.
   @param {string} inviteId - The ID of the invite to cancel.
   @param {string} usersProjectId - The ID of the project to which the invite is associated.
   @returns {Promise<InviteModel>} - The cancelled invite.
   @throws {HttpException} - If the invite is not found, has already been accepted, or does not belong to the specified project.
   */
  async cancelInvite(inviteId: string, usersProjectId: string): Promise<InviteModel> {
    // Find a valid invite that is not expired or cancelled
    const invite = await this.findInviteById(inviteId);
    if (!invite) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    // Check if the invite belongs to the specified project
    if (usersProjectId !== invite.projectId) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    // Check if the invite has already been accepted
    if (invite.acceptedById) {
      throw new HttpException('Invite already accepted', HttpStatus.FORBIDDEN);
    }
    return this.prisma.invite.update({
      where: {
        id: inviteId
      },
      data: {
        deletedAt: new Date()
      }
    });
  }

  /**
   * Resends an invitation to the user associated with the given `inviteId`.
   *
   * @param inviteId - The ID of the invite to resend.
   * @param usersProjectId - The ID of the project the user sending the invite belongs to.
   * @returns The updated invite object.
   * @throws {HttpException} If the invite is not found, has already been accepted, or has been cancelled.
   */
  async resendInvite(inviteId: string, usersProjectId: string): Promise<InviteModel> {
    // Find a valid invite that is not expired or cancelled
    const invite = await this.findInviteById(inviteId);
    if (!invite) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    // Check if the invite belongs to the specified project
    if (usersProjectId !== invite.projectId) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    // Check if the invite has already been accepted
    if (invite.acceptedById) {
      throw new HttpException('Invite already accepted', HttpStatus.FORBIDDEN);
    }
    // Generate a new invite code
    const inviteCode = randomBytes(4).toString('hex');
    const hashInviteCode = await hash(inviteCode, 10);
    await this.prisma.invite.update({
      where: {
        id: inviteId
      },
      data: {
        inviteCode: hashInviteCode
      }
    });
    // Send the invite email
    await this.sendInviteEmail(invite, inviteCode);
    return invite;
  }

  /**
   * Sends an invitation email to the email address associated with the given invite object.
   *
   * @param {Invite} invite - The invite object to send an email invitation for.
   * @param {string} inviteCode - The invite code to include in the email invitation.
   * @returns {Promise<any>} - A promise that resolves when the email is sent.
   */
  private async sendInviteEmail(invite: Invite, inviteCode: string): Promise<any> {
    // Construct the invite URL and send the invitation email
    const inviteUrl = `${this.config.get('BASE_URL')}/invite/${invite.id}?inviteCode=${inviteCode}`;
    return this.notification.sendInviteEmail(invite.projectId, invite.email, inviteUrl);
  }

  /**
   * Returns the status of the given invite based on its properties.
   * @param invite The invite to check the status of.
   * @returns The status of the invite.
   */
  getInviteStatus(invite: Invite): InviteStatus {
    if (invite.deletedAt) {
      return InviteStatus.CANCELLED;
    }
    if (invite.acceptedById) {
      return InviteStatus.ACCEPTED;
    }
    if (isPast(invite.expiresAt)) {
      return InviteStatus.EXPIRED;
    }
    return InviteStatus.PENDING;
  }
}
