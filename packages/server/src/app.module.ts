import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [HealthModule, UserModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
