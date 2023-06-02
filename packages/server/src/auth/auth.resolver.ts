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
  UserSignupDto
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
    this.logger.log('Username Validated');
    return this.authService.validateUsername(user.projectId, user.username, user.password);
  }

  /** Login via email */
  @Mutation(() => AccessToken)
  @UsePipes(new EmailLoginTransformPipe())
  async loginEmail(@Args('user') user: EmailLoginDto): Promise<AccessToken> {
    this.logger.log('Email Validated');
    return this.authService.validateEmail(user.projectId, user.email, user.password);
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
    // GraphQL needs something to return
    await this.authService.forgotPassword(user.projectId, user.email);
    this.logger.log('Forgot PW Clicked');

    return true;
  }

  /** Reset password */
  @Mutation(() => Boolean)
  @UsePipes(new ResetPasswordTransformPipe())
  async resetPassword(@Args('user') user: ResetDto): Promise<boolean> {
    // GraphQL needs something to return
    this.logger.log('PW Reset Successful');
    this.authService.resetPassword(user.projectId, user.email, user.password, user.code);
    return true;
  }

  /** Return Public Key */
  @Query(() => [String])
  publicKey(): string[] {
    this.logger.log('Public Key');
    return this.authService.publicKey();
  }
}
