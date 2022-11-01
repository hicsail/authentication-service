import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/login')
  async login(): Promise<string> {
    // project_id, username, password
    return this.loginService.login();
  }

  @Post('/signup')
  async signup(@Body('project_id') project_id: string, @Body('username') username: string, @Body('method') method: string, @Body('password') password: string): Promise<string> {
    return await this.loginService.signup(project_id, username, method, password);
  }
}
