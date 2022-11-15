import { Module } from '@nestjs/common';
import { LoginController, SignupController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategyUsername, LocalStrategyEmail } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION }
    })
  ],
  controllers: [LoginController, SignupController],
  providers: [AuthService, PrismaService, LocalStrategyUsername, LocalStrategyEmail, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
