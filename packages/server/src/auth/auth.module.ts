import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService]
})
export class AuthModule {}
