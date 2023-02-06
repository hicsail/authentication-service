import { Mutation, Args, Resolver, Query, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './model/user.model';
import { User } from '@prisma/client';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel])
  async users(@Args('projectId', { type: () => ID }) projectId: string): Promise<UserModel[]> {
    return this.userService.findAllUsers();
  }

  @Query(() => UserModel)
  getUser(@Args('id', { type: () => ID }) id: string): Promise<UserModel> {
    return this.userService.findUserById(id);
  }
}
