import { Module } from '@nestjs/common';
import { LoginController, SignupController } from './auth.controller';
import { AuthService, LoginService, SignupService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [LoginController, SignupController],
  providers: [AuthService, LoginService, SignupService, PrismaService, LocalStrategy]
})
export class AuthModule {}