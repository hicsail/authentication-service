import { Mutation, Args, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './model/user.model';
import { User } from '@prisma/client';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  async listUsers(): Promise<UserModel[]> {
    return this.userService.findAllUsers();
  }

  @Query(() => UserModel)
  getUser(@Args('id') id: string): Promise<UserModel> {
    return this.userService.findUserById(id);
  }
}
