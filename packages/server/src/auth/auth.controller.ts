import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UpdateStatus } from '../user/types/user.types';
import { AuthService } from './auth.service';
import {
  UsernameLoginTransformPipe,
  EmailLoginTransformPipe,
  SignupTransformPipe,
  UserSignupDto,
  EmailLoginDto,
  UsernameLoginDto,
  ForgotDto,
  ResetDto,
  ResetPasswordTransformPipe,
  ForgotPasswordTransformPipe
} from './dto/auth.dto';
import { AccessToken, PublicKey } from './types/auth.types';

@Controller('login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('username')
  @UsePipes(new UsernameLoginTransformPipe())
  async loginUsername(@Body() user: UsernameLoginDto): Promise<AccessToken> {
    return this.authService.validateUsername(user.projectId, user.username, user.password);
  }

  @Post('email')
  @UsePipes(new EmailLoginTransformPipe())
  async loginEmail(@Body() user: EmailLoginDto): Promise<AccessToken> {
    return this.authService.validateEmail(user.projectId, user.email, user.password);
  }
}

@Controller('signup')
export class SignupController {
  constructor(private authService: AuthService) {}

  @Post()
  @UsePipes(new SignupTransformPipe(), new ValidationPipe())
  async signup(@Body() user: UserSignupDto): Promise<AccessToken> {
    return await this.authService.signup(user);
  }
}

@Controller('recover')
export class RecoveryController {
  constructor(private authService: AuthService) {}

  @Post('forgot')
  @UsePipes(new ForgotPasswordTransformPipe())
  async forgotPassword(@Body() user: ForgotDto): Promise<void> {
    return this.authService.forgotPassword(user.projectId, user.email);
  }

  @Post('reset')
  @UsePipes(new ResetPasswordTransformPipe())
  async resetPassword(@Body() user: ResetDto): Promise<UpdateStatus> {
    return this.authService.resetPassword(user.projectId, user.email, user.password, user.code);
  }
}

@Controller('public-key')
export class PublicKeyController {
  constructor(private authService: AuthService) {}

  @Get()
  publicKey(): string {
    return this.authService.publicKey();
  }
}
