import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  sendMessage(): string {
    return 'Ok';
  }
}
