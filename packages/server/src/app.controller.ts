import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('protected')
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): string {
    return 'Hello, World';
  }
}
