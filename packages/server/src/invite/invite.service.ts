import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Invite } from '@prisma/client';
import { UserService } from '../user/user.service';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { addDays, subDays } from 'date-fns';
import { InviteStatus } from './model/invite.status';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  async createInvite(newInvite: Pick<Invite, 'email' | 'role'>, fromUserId: string, projectId: string): Promise<Invite> {
    if (await this.userService.findUserByEmail(projectId, newInvite.email)) {
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);
    }
    const inviteCode = randomBytes(4).toString('hex');
    const hashInviteCode = await hash(inviteCode, 10);
    const expiresAt = addDays(new Date(), 7);
    const invite = await this.prisma.invite.create({
      data: {
        ...newInvite,
        projectId,
        inviteCode: hashInviteCode,
        invitedById: fromUserId,
        expiresAt
      }
    });
    return invite;
  }

  async acceptInvite(inviteCode: string, projectId: string, email: string, password: string, fullname: string): Promise<void> {
    const invite = await this.prisma.invite.findFirst({
      where: {
        email,
        projectId,
        deletedAt: null
      }
    });
    if (!invite) {
      throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);
    }
    if (new Date() > invite.expiresAt) {
      throw new HttpException('Invite expired', HttpStatus.FORBIDDEN);
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
    await this.prisma.invite.update({
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

  async cancelInvite(inviteId: string): Promise<void> {
    await this.prisma.invite.update({
      where: {
        id: inviteId
      },
      data: {
        deletedAt: new Date()
      }
    });
  }

  async resendInvite(inviteId: string): Promise<void> {
    const invite = await this.prisma.invite.findUnique({
      where: {
        id: inviteId
      }
    });
    if (!invite) {
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
    await this.prisma.invite.update({
      where: {
        id: inviteId
      },
      data: {
        inviteCode: hashInviteCode
      }
    });
  }
}
