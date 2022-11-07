import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    // TODO:
    // 1. Require JWT
    // 2. Validate JWT
    return "Hello, World"
  }
}
