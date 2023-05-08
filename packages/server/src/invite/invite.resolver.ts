import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { InviteModel } from './model/invite.model';
import { InviteService } from './invite.service';
import { InviteStatus } from './model/invite.status';
import { AcceptInviteModel } from './model/accept-invite.model';
import { Invite } from '@prisma/client';
import { UserModel } from '../user/model/user.model';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { ProjectId } from '../project/project.decorator';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { UserId } from '../user/user.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => InviteModel)
export class InviteResolver {
  constructor(private readonly inviteService: InviteService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Query(() => [InviteModel])
  async invites(@ProjectId() projectId: string, @Args('status', { type: () => InviteStatus, nullable: true }) status?: InviteStatus): Promise<InviteModel[]> {
    return this.inviteService.listInvites(projectId, status);
  }

  @Query(() => InviteModel)
  async invite(@Args('id', { type: () => ID }) id: string): Promise<InviteModel> {
    return this.inviteService.findInviteById(id);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => InviteModel)
  async createInvite(
    @ProjectId() projectId: string,
    @UserId() userId: string,
    @Args('email') email: string,
    @Args('role', { type: () => Int, nullable: true }) role = 0
  ): Promise<InviteModel> {
    return this.inviteService.createInvite({ email, role }, userId, projectId);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => InviteModel)
  async resendInvite(@ProjectId() usersProjectId: string, @Args('id', { type: () => ID }) id: string): Promise<InviteModel> {
    return this.inviteService.resendInvite(id, usersProjectId);
  }

  @Mutation(() => InviteModel)
  async acceptInvite(@Args('input') input: AcceptInviteModel): Promise<InviteModel> {
    return this.inviteService.acceptInvite(input.inviteCode, input.projectId, input.email, input.password, input.fullname);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => InviteModel)
  async cancelInvite(@Args('id', { type: () => ID }) id: string, @ProjectId() usersProjectId: string): Promise<InviteModel> {
    return this.inviteService.cancelInvite(id, usersProjectId);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }): Promise<UserModel> {
    try {
      return await this.inviteService.findInviteById(reference.id);
    } catch (e: any) {
      throw new BadRequestException(`Could not find invite with ID ${reference.id}`);
    }
  }

  @ResolveField()
  status(@Parent() invite: Invite): InviteStatus {
    return this.inviteService.getInviteStatus(invite);
  }
}
