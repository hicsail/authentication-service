import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('/login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/username')
  async login(@Body('project_id') project_id: string, @Body('username') username: string, @Body('password') password: string) {
    return this.authService.loginUsername(project_id, username, password);
  }
}


@Controller('/signup')
export class SignupController {
  constructor(private authService: AuthService) {}

  @Post()
  async signup(@Body('project_id') project_id: string, @Body('username') username: string, @Body('email') email: string, @Body('method') method: string, @Body('password') password: string): Promise<string> {
    return await this.authService.signup(project_id, username, email, method, password);
  }
}