import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AccessToken } from './types/auth.types';
import {
  EmailLoginDto,
  EmailLoginTransformPipe,
  ForgotDto,
  ForgotPasswordTransformPipe,
  ResetDto,
  ResetPasswordTransformPipe,
  SignupTransformPipe,
  UsernameLoginDto,
  UserSignupDto,
  GoogleLoginDto,
  GoogleLoginTransformPipe
} from './dto/auth.dto';
import { UsePipes } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /** Login via username */
  @Mutation(() => AccessToken)
  async loginUsername(@Args('user') user: UsernameLoginDto): Promise<AccessToken> {
    return this.authService.validateUsername(user.projectId, user.username, user.password);
  }

  /** Login via email */
  @Mutation(() => AccessToken)
  @UsePipes(new EmailLoginTransformPipe())
  async loginEmail(@Args('user') user: EmailLoginDto): Promise<AccessToken> {
    return this.authService.validateEmail(user.projectId, user.email, user.password);
  }

  /** Login via Google */
  @Mutation(() => AccessToken)
  @UsePipes(new GoogleLoginTransformPipe())
  async loginGoogle(@Args('user') user: GoogleLoginDto): Promise<AccessToken> {
    return this.authService.validateGoogle(user.projectId, user.credential);
  }

  /** Signup logic */
  @Mutation(() => AccessToken)
  @UsePipes(new SignupTransformPipe())
  async signup(@Args('user') user: UserSignupDto): Promise<AccessToken> {
    return this.authService.signup(user);
  }

  /** Forgot password */
  @Mutation(() => Boolean)
  @UsePipes(new ForgotPasswordTransformPipe())
  async forgotPassword(@Args('user') user: ForgotDto): Promise<boolean> {
    await this.authService.forgotPassword(user.projectId, user.email);

    // GraphQL needs something to return
    return true;
  }

  /** Reset password */
  @Mutation(() => Boolean)
  @UsePipes(new ResetPasswordTransformPipe())
  async resetPassword(@Args('user') user: ResetDto): Promise<boolean> {
    await this.authService.resetPassword(user.projectId, user.email, user.password, user.code);

    // GraphQL needs something to return
    return true;
  }

  /** Return Public Key */
  @Query(() => [String])
  publicKey(): string[] {
    return this.authService.publicKey();
  }
}
