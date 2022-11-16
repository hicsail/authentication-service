import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignup, UsernameLogin, EmailLogin, AccessToken } from './types/auth.types';

@Controller('/login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('/username')
  async loginUsername(@Body() user: UsernameLogin): Promise<AccessToken> {
    return this.authService.validateUsername(user.project_id, user.username, user.password);
  }

  @Post('/email')
  async loginEmail(@Body() user: EmailLogin): Promise<AccessToken> {
    return this.authService.validateEmail(user.project_id, user.email, user.password);
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
