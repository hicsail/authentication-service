import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';

@Module({
  imports: [HealthModule, LoginModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
