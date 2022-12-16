import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AccessToken } from './types/auth.types';
import { EmailLoginDto, ForgotDto, UsernameLoginDto, UserSignupDto } from './dto/auth.dto';

@Resolver()
export class AuthResolver  {
  constructor(private readonly authService: AuthService) {}

  /** Login via username */
  @Mutation(() => AccessToken)
  async loginUsername(@Args('user') user: UsernameLoginDto): Promise<AccessToken> {
    return this.authService.validateUsername(user.projectId, user.username, user.password);
  }

  /** Login via email */
  @Mutation(() => AccessToken)
  async loginEmail(@Args('user') user: EmailLoginDto): Promise<AccessToken> {
    return this.authService.validateEmail(user.projectId, user.email, user.password);
  }

  /** Signup logic */
  @Mutation(() => AccessToken)
  async signup(@Args('user') user: UserSignupDto): Promise<AccessToken> {
    return this.authService.signup(user);
  }

  /** Forgot password */
  @Mutation(() => Boolean)
  async forgotPassword(@Args('user') user: ForgotDto): Promise<boolean> {
    await this.authService.forgotPassword(user.projectId, user.email);
    return true;
  }
}
