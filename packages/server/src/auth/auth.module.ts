import { Module } from '@nestjs/common';
import { LoginController, SignupController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION }
    })
  ],
  controllers: [LoginController, SignupController],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
