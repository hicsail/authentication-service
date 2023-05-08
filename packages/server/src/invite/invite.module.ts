import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteResolver } from './invite.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  providers: [InviteService, InviteResolver, PrismaService],
  exports: [InviteService]
})
export class InviteModule {}
