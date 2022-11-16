import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';

@Module({
  imports: [HealthModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
