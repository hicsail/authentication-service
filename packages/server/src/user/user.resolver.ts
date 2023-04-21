import { Args, ID, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './model/user.model';
import {BadRequestException} from '@nestjs/common';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel])
  async users(@Args('projectId', { type: () => ID }) projectId: string): Promise<UserModel[]> {
    return this.userService.findUsersByProjectId(projectId);
  }

  @Query(() => UserModel)
  getUser(@Args('id', { type: () => ID }) id: string): Promise<UserModel> {
    return this.userService.findUserById(id);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }): Promise<UserModel> {
    try {
      return await this.userService.findUserById(reference.id);
    } catch(e: any) {
      throw new BadRequestException(`Could not find user with ID ${reference.id}`);
    }
  }
}
