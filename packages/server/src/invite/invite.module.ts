import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteResolver } from './invite.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UserModule, NotificationModule],
  providers: [InviteService, InviteResolver, PrismaService],
  exports: [InviteService]
})
export class InviteModule {}
