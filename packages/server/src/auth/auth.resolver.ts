import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { UseGuards, UsePipes } from '@nestjs/common';
import { ProjectModel } from '../project/model/project.model';
import { Roles } from './roles.decorator';
import { Role } from './enum/role.enum';
import { AuthGuard } from './auth.guard';
import { ProjectId } from '../project/project.decorator';
import { UserId } from '../user/user.decorator';

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

  @Query(() => [ProjectModel])
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  projects(@ProjectId() projectId: string, @UserId() userId: string): Promise<ProjectModel[]> {
    return this.authService.projects(userId);
  }
}
