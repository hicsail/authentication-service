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
    const success = this.authService.validateUsername(user.projectId, user.username, user.password);
    if(success){
      this.logger.log('Username Validated');
      return success
    } else{
      this.logger.error('Username Validation Unsuccessful');
    }
  }

  /** Login via email */
  @Mutation(() => AccessToken)
  @UsePipes(new EmailLoginTransformPipe())
  async loginEmail(@Args('user') user: EmailLoginDto): Promise<AccessToken> {
    const success = this.authService.validateEmail(user.projectId, user.email, user.password);
    if(success){
      this.logger.log('Email Validated');
      return success
    } else{
      this.logger.error('Email Validation Unsuccessful');
    }
  }

  /** Signup logic */
  @Mutation(() => AccessToken)
  @UsePipes(new SignupTransformPipe())
  async signup(@Args('user') user: UserSignupDto): Promise<AccessToken> {
    
    const success = this.authService.signup(user);
    if(success){
      this.logger.log('Signup Successful');
      return success
    } else{
      this.logger.error('Signup Unsuccessful');
    }
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
    const success = this.authService.resetPassword(user.projectId, user.email, user.password, user.code);
    if(success){
      this.logger.log('PW Reset Successful');
      return true;
    } else{
      this.logger.error('PW Reset Unsuccessful');
      return false;
    }
    // GraphQL needs something to return
    
  }

  /** Return Public Key */
  @Query(() => [String])
  publicKey(): string[] {
    return this.authService.publicKey();
  }
}
