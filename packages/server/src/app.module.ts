import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HealthModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
