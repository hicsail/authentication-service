import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('/login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('username'))
  @Post('/username')
  async loginUsername(@Body('project_id') project_id: string, @Body('username') username: string, @Body('password') password: string) {
    return this.authService.loginUsername(project_id, username, password);
  }

  @UseGuards(AuthGuard('email'))
  @Post('/email')
  async loginEmail(@Body('project_id') project_id: string, @Body('email') email: string, @Body('password') password: string) {
    return this.authService.loginEmail(project_id, email, password);
  }
}


@Controller('/signup')
export class SignupController {
  constructor(private authService: AuthService) {}

  @Post()
  async signup(@Body('project_id') project_id: string, @Body('username') username: string, @Body('email') email: string, @Body('method') method: string, @Body('password') password: string): Promise<string> {
    return await this.authService.signup({ project_id, username, email, method, password });
  }
}