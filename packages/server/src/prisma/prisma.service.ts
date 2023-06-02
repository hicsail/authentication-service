import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit(): Promise<void> {
    this.logger.log('connecting');
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.logger.log('closing');
    await app.close();
  }
}
