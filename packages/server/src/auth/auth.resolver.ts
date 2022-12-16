import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AccessToken } from './types/auth.types';
import { UsernameLoginDto, UserSignupDto } from './dto/auth.dto';

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
   * Handle the signup process for a user
   */
  @Mutation(() => AccessToken)
  async signup(@Args('user') user: UserSignupDto): Promise<AccessToken> {
    return this.authService.signup(user);
  }
}
