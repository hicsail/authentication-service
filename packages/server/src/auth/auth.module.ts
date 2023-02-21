import { Module } from '@nestjs/common';
import { LoginController, SignupController, RecoveryController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ProjectModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION }
    })
  ],
  controllers: [LoginController, SignupController, RecoveryController],
  providers: [AuthResolver, AuthService, PrismaService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
