import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HealthModule, AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
