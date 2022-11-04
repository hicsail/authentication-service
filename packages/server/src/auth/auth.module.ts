import { Module } from '@nestjs/common';
import { LoginController, SignupController } from './auth.controller';
import { LoginService, SignupService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [LoginController, SignupController],
  providers: [LoginService, SignupService, PrismaService]
})
export class AuthModule {}