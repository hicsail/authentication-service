import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [JwtModule.register({ secret: process.env.SECRET })],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
