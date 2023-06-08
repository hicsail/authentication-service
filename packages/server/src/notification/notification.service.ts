import { HttpStatus, Injectable, Logger, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ProjectService } from '../project/project.service';
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly notificationUrl: string;

  constructor(private readonly configService: ConfigService, private readonly http: HttpService, private readonly projectService: ProjectService) {
    this.notificationUrl = this.configService.getOrThrow('NOTIFICATION_SERVICE_URL');
  }

  private async sendEmail(email: string, subject: string, message: string, template: string, projectId?: string, link?: string): Promise<any> {
    const project = await this.projectService.getProject(projectId);
    const response = await this.http
      .post(this.notificationUrl, {
        to: [email],
        subject,
        message,
        template,
        templateData: {
          link,
          project
        }
      })
      .toPromise();

    if (response.status !== HttpStatus.CREATED) {
      this.logger.error(`Failed to send ${template} email to ${email} ${projectId ? 'for project ' + project.id : ''}`);
      throw new HttpException(`Failed to send ${template} email`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return response.data;
  }

  async sendPasswordResetEmail(projectId: string, email: string, link: string): Promise<any> {
    return this.sendEmail(email, 'Password reset', `Click this link to reset your password: ${link}`, 'auth/passwordReset', projectId, link);
  }

  async sendPasswordUpdatedEmail(projectId: string, email: string): Promise<any> {
    return this.sendEmail(email, 'Password updated', 'Your password has been updated.', 'auth/passwordUpdated', projectId);
  }

  async sendInviteEmail(projectId: string, email: string, link: string): Promise<any> {
    return this.sendEmail(email, `You have been invited to join ${projectId}`, `Click this link to join: ${link}`, 'auth/invite', projectId, link);
  }
}
