import { Module } from '@nestjs/common';
import { LoginController } from './auth.controller';
import { LoginService, SignupService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [LoginService, SignupService, PrismaService]
})
export class AuthModule {}