import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import { Invite } from '@prisma/client';
import {UserService} from "../user/user.service";
import {  } from 'bcrypt';
@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService, private userService: UserService) {}



  async createInvite(newInvite: Pick<Invite, 'email' | 'role'>, fromUserId: string, projectId: string): Promise<Invite> {
    const inviteCode = "";
    const invite = await this.prisma.invite.create({
      data: {
        ...newInvite,
        projectId,
        inviteCode,
        invitedById: fromUserId
      }
    });
  }
}
