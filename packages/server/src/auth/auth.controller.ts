import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserSignup, UsernameLogin, EmailLogin, AccessToken } from './types/auth.types';

@Controller('/login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('username'))
  @Post('/username')
  async loginUsername(@Body() user: UsernameLogin): Promise<AccessToken> {
    return this.authService.loginUsername(user.project_id, user.username, user.password);
  }

  @UseGuards(AuthGuard('email'))
  @Post('/email')
  async loginEmail(@Body() user: EmailLogin): Promise<AccessToken> {
    return this.authService.loginEmail(user.project_id, user.email, user.password);
  }
}

@Controller('/signup')
export class SignupController {
  constructor(private authService: AuthService) {}

  @Post()
  async signup(@Body() user: UserSignup): Promise<AccessToken> {
    return await this.authService.signup({ ...user });
  }
}
