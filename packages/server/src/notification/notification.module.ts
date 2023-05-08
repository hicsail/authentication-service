import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { HttpModule } from '@nestjs/axios';
import { ProjectModule } from '../project/project.module';
@Module({
  imports: [HttpModule, ProjectModule],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
