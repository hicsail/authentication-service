import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HealthModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
