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
import { Logger } from '@nestjs/common';

@Resolver(() => InviteModel)
export class InviteResolver {
  private readonly logger = new Logger(InviteResolver.name)
  constructor(private readonly inviteService: InviteService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Query(() => [InviteModel])
  async invites(
    @ProjectId() projectId: string,
    @Args('status', {
      type: () => InviteStatus,
      nullable: true,
      description: 'The status of the invites to retrieve. If omitted, all invites for the given project will be returned.'
    })
    status?: InviteStatus
  ): Promise<InviteModel[]> {
    const success = this.inviteService.listInvites(projectId, status);
    if(success){
      this.logger.log('Invites retrieved');
      return success
    } else{
      this.logger.error('Invites retrieval Unsuccessful');
    }
  }

  @Query(() => InviteModel)
  async invite(
    @Args('id', { type: () => ID, description: 'The ID of the invite to retrieve.' })
    id: string
  ): Promise<InviteModel> {
    const success = this.inviteService.findInviteById(id);
    if(success){
      this.logger.log('Invites retrieved');
      return success
    } else{
      this.logger.error('Invites retrieval Unsuccessful');
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => InviteModel)
  async createInvite(
    @ProjectId() projectId: string,
    @UserId() userId: string,
    @Args('email', { description: 'The email address of the user to invite.' })
    email: string,
    @Args('role', { type: () => Int, nullable: true, description: 'The role to assign to the invited user. If omitted, the default role of Regular User will be assigned.' })
    role = 0
  ): Promise<InviteModel> {
    const success = this.inviteService.createInvite({ email, role }, userId, projectId);
    if(success){
      this.logger.log('Invites created');
      return success
    } else{
      this.logger.error('Invites create Unsuccessful');
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => InviteModel)
  async resendInvite(@ProjectId() usersProjectId: string, @Args('id', { type: () => ID, description: 'The ID of the invite to resend.' }) id: string): Promise<InviteModel> {
    const success = this.inviteService.resendInvite(id, usersProjectId);
    if(success){
      this.logger.log('Invites resent');
      return success
    } else{
      this.logger.error('Invites resend Unsuccessful');
    }
  }

  @Mutation(() => InviteModel)
  async acceptInvite(@Args('input', { description: 'Input for accepting an invite' }) input: AcceptInviteModel): Promise<InviteModel> {
    this.logger.log('Invites accepted');
    return this.inviteService.acceptInvite(input.inviteCode, input.projectId, input.email, input.password, input.fullname);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Mutation(() => InviteModel)
  async cancelInvite(@Args('id', { type: () => ID, description: 'The ID of the invite to cancel.' }) id: string, @ProjectId() usersProjectId: string): Promise<InviteModel> {
    this.logger.log(`Invite for ${ID} cancelled`);
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
