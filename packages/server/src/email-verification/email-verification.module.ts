import { Module } from '@nestjs/common';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationService } from './email-verification.service';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { NotificationModule } from '../notification/notification.module';
import { JwtModule } from '../jwt/jwt.module';
import { HttpModule } from '@nestjs/axios';
import { EmailVerificationResolver } from './email-verification.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UserModule, ProjectModule, NotificationModule, JwtModule, HttpModule],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService, EmailVerificationResolver, PrismaService],
  exports: [EmailVerificationService]
})
export class EmailVerificationModule {}
