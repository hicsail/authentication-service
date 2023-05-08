import { Module } from '@nestjs/common';
import { LoginController, PublicKeyController, RecoveryController, SignupController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectModule } from '../project/project.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ProjectModule,
    NotificationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get('PRIVATE_KEY'),
          publicKey: configService.get('PUBLIC_KEY_1'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION'),
            issuer: 'https://sail.bu.edu',
            algorithm: 'RS256'
          }
        };
        return options;
      },
      inject: [ConfigService]
    })
  ],
  controllers: [LoginController, SignupController, RecoveryController, PublicKeyController],
  providers: [AuthResolver, AuthService, PrismaService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
