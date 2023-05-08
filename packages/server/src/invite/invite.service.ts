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

@Injectable()
export class InviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly notification: NotificationService,
    private readonly config: ConfigService
  ) {}

  async createInvite(newInvite: Pick<Invite, 'email' | 'role'>, fromUserId: string, projectId: string): Promise<Invite> {
    if (await this.userService.findUserByEmail(projectId, newInvite.email)) {
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    }
    if (await this.findInviteByEmail(projectId, newInvite.email)) {
      throw new HttpException('Invite already exists for this user', HttpStatus.FORBIDDEN);
    }
    const inviteCode = randomBytes(4).toString('hex');
    const hashInviteCode = await hash(inviteCode, 10);
    const expiresAt = addDays(new Date(), 7);
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
    const inviteUrl = `${this.config.get('BASE_URL')}/invite/${invite.id}?inviteCode=${inviteCode}`;
    await this.notification.sendInviteEmail(projectId, invite.email, inviteUrl);
    return invite;
  }

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

  async findInviteByEmail(projectId: string, email: string): Promise<Invite> {
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

  async acceptInvite(inviteCode: string, projectId: string, email: string, password: string, fullname: string): Promise<InviteModel> {
    const invite = await this.findInviteByEmail(projectId, email);
    if (!invite) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    if (invite.acceptedById) {
      throw new HttpException('Invite already accepted', HttpStatus.FORBIDDEN);
    }
    if (await this.userService.findUserByEmail(projectId, invite.email)) {
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    }
    if (!(await compare(inviteCode, invite.inviteCode))) {
      throw new HttpException('Invalid invite code', HttpStatus.FORBIDDEN);
    }
    const user = await this.userService.createUser({
      fullname,
      password,
      projectId: invite.projectId,
      email: invite.email,
      role: invite.role
    });
    return this.prisma.invite.update({
      where: {
        id: invite.id
      },
      data: {
        acceptedById: user.id
      }
    });
  }

  async listInvites(projectId: string, status?: InviteStatus): Promise<Invite[]> {
    if (!status) {
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

  async cancelInvite(inviteId: string, usersProjectId: string): Promise<InviteModel> {
    const invite = await this.findInviteById(inviteId);
    if (!invite) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    if (usersProjectId !== invite.projectId) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
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

  async resendInvite(inviteId: string, usersProjectId: string): Promise<InviteModel> {
    const invite = await this.prisma.invite.findUnique({
      where: {
        id: inviteId
      }
    });
    if (!invite) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    if (usersProjectId !== invite.projectId) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    if (invite.acceptedById) {
      throw new HttpException('Invite already accepted', HttpStatus.FORBIDDEN);
    }
    if (invite.deletedAt) {
      throw new HttpException('Invite cancelled', HttpStatus.FORBIDDEN);
    }
    const inviteCode = randomBytes(4).toString('hex');
    const hashInviteCode = await hash(inviteCode, 10);
    return this.prisma.invite.update({
      where: {
        id: inviteId
      },
      data: {
        inviteCode: hashInviteCode
      }
    });
  }

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
