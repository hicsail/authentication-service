import { Module } from '@nestjs/common';
import { LoginController, PublicKeyController, RecoveryController, SignupController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { NotificationModule } from '../notification/notification.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [UserModule, ProjectModule, NotificationModule, JwtModule],
  controllers: [LoginController, SignupController, RecoveryController, PublicKeyController],
  providers: [AuthResolver, AuthService, PrismaService],
  exports: [AuthService]
})
export class AuthModule {}
