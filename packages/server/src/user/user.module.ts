import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => AuthModule), JwtModule.register({ secret: process.env.SECRET })],
  controllers: [UserController],
  providers: [UserService, PrismaService]
})
export class UserModule {}
