import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteResolver } from './invite.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [UserModule, NotificationModule, AuthModule, JwtModule],
  providers: [InviteService, InviteResolver, PrismaService],
  exports: [InviteService]
})
export class InviteModule {}
