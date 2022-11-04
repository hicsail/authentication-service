import { Body, Controller, Post } from '@nestjs/common';
import { LoginService, SignupService } from './auth.service';

@Controller('/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/username')
  async login(@Body('project_id') project_id: string, @Body('username') username: string, @Body('password') password: string): Promise<string> {
    return this.loginService.login();
  }
}


@Controller('/signup')
export class SignupController {
  constructor(private signupService: SignupService) {}

  @Post()
  async signup(@Body('project_id') project_id: string, @Body('username') username: string, @Body('method') method: string, @Body('password') password: string): Promise<string> {
    return await this.signupService.signup(project_id, username, method, password);
  }
}