import { Args, ID, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './model/user.model';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { ProjectId } from '../project/project.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/roles.decorator';
import { Logger } from '@nestjs/common';
import { UserId } from './user.decorator';

@Resolver(() => UserModel)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel])
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  async users(@ProjectId() projectId: string): Promise<UserModel[]> {
    this.logger.log(`Users of projectId: ${projectId} found updated`);
    return this.userService.findUsersByProjectId(projectId);
  }

  @Query(() => UserModel)
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  getUser(@Args('id', { type: () => ID }) id: string, @ProjectId() projectId: string): Promise<UserModel> {
    this.logger.log(`Users of projectId: ${projectId} found updated`);
    return this.userService.findUserByIdIfPermissionGiven(id, projectId);
  }

  // get authenticated user
  @Query(() => UserModel)
  @UseGuards(AuthGuard)
  async me(@UserId() userId: string): Promise<UserModel> {
    this.logger.log(`Users of projectId: ${userId} found updated`);
    return this.userService.findUserById(userId);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }): Promise<UserModel> {
    try {
      this.logger.log(`Found user with ID ${reference.id}`);
      return await this.userService.findUserById(reference.id);
    } catch (e: any) {
      throw new BadRequestException(`Could not find user with ID ${reference.id}`);
    }
  }
}
