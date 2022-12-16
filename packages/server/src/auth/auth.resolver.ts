import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AccessToken } from './types/auth.types';
import { UsernameLoginDto } from './dto/auth.dto';

@Resolver()
export class AuthResolver  {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handle the login process for a user.
   */
  @Mutation(() => AccessToken)
  async loginUsername(@Args('user') user: UsernameLoginDto): Promise<AccessToken> {
    return this.authService.validateUsername(user.projectId, user.username, user.password);
  }

  /**
   * Temporary so that the Apollo driver recognizes this package
   * as a GraphQL package.
   */
  @Query(() => String)
  async test(): Promise<string> {
    return 'test';
  }
}
