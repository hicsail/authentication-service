import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserResolver } from './user.resolver';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
