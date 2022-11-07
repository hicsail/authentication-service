import { Module } from '@nestjs/common';
import { LoginController, SignupController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({
    secret: 'SECRET', //TODO: import from env
    signOptions: { expiresIn: '60s' },
  })],
  controllers: [LoginController, SignupController],
  providers: [AuthService, PrismaService, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}