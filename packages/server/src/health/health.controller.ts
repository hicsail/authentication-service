import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  healthLive(@Res() res: Response): Response<void> {
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get('ready')
  async healthReady(@Res() res: Response): Promise<Response<void>> {
    const dbConnection = this.healthService.isDbReady();
    if (!dbConnection) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
