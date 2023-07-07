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
import { Logger } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);
  constructor(private readonly authService: AuthService) {}

  /** Login via username */
  @Mutation(() => AccessToken)
  async loginUsername(@Args('user') user: UsernameLoginDto): Promise<AccessToken> {
    this.logger.log('loginUsername Called');
    return this.authService.validateUsername(user.projectId, user.username, user.password);
  }

  /** Login via email */
  @Mutation(() => AccessToken)
  @UsePipes(new EmailLoginTransformPipe())
  async loginEmail(@Args('user') user: EmailLoginDto): Promise<AccessToken> {
    this.logger.log('Email Validated');
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
    this.logger.log('Signup Successful');
    return this.authService.signup(user);
  }

  /** Forgot password */
  @Mutation(() => Boolean)
  @UsePipes(new ForgotPasswordTransformPipe())
  async forgotPassword(@Args('user') user: ForgotDto): Promise<boolean> {
    await this.authService.forgotPassword(user.projectId, user.email);
    this.logger.log('Forgot PW Clicked');
    // GraphQL needs something to return
    return true;
  }

  /** Reset password */
  @Mutation(() => Boolean)
  @UsePipes(new ResetPasswordTransformPipe())
  async resetPassword(@Args('user') user: ResetDto): Promise<boolean> {
    await this.authService.resetPassword(user.projectId, user.email, user.password, user.code);
    this.logger.log('PW Reset Successful');
    // GraphQL needs something to return
    return true;
  }

  /** Refresh access token */
  @Mutation(() => AccessToken)
  async refresh(@Args('refreshToken') refreshToken: string): Promise<AccessToken> {
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return accessToken;
  }

  /** Return Public Key */
  @Query(() => [String])
  publicKey(): string[] {
    this.logger.log('Public Key');
    return this.authService.publicKey();
  }
}
