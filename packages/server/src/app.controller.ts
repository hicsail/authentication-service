import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // TODO:
    // 1. Require JWT
    // 2. Validate JWT
    return this.appService.getHello();
  }
}
