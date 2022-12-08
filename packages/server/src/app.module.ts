import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { ProjectGuard } from './project/project.guard';

@Module({
  imports: [HealthModule, UserModule, AuthModule, ProjectModule],
  controllers: [AppController],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ProjectGuard).exclude('/(health|projects)(/.*)?').forRoutes('/');
  }
}
