import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { ProjectGuard } from './project/project.guard';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { InviteModule } from './invite/invite.module';
import { NotificationModule } from './notification/notification.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    HealthModule,
    UserModule,
    AuthModule,
    ProjectModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'dist/schema.gql')
      }
    }),
    InviteModule,
    NotificationModule,
    JwtModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ProjectGuard).exclude('/(health|projects|graphql|public-key)(/.*)?').forRoutes('/');
  }
}
