import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [HealthModule, UserModule, AuthModule, ProjectModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
