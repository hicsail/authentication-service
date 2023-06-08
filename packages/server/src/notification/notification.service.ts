import { HttpStatus, Injectable, Logger, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ProjectService } from '../project/project.service';

interface Email {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  message: string;
  template: string;
  templateData: any;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly notificationUrl: string;

  constructor(private readonly configService: ConfigService, private readonly http: HttpService, private readonly projectService: ProjectService) {
    this.notificationUrl = this.configService.getOrThrow('NOTIFICATION_SERVICE_URL');
  }

  private async sendEmail(email: Email, projectId: string): Promise<any> {
    if (projectId) {
      const project = await this.projectService.getProject(projectId);
      email.templateData.project = project;
    }

    const response = await this.http.post(this.notificationUrl, email).toPromise();

    if (response.status !== HttpStatus.CREATED) {
      this.logger.error(`Failed to send ${email.template} email to ${email.to} ${projectId ? 'for project ' + projectId : ''}`);
      throw new HttpException(`Failed to send ${email.template} email`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return response.data;
  }
  async sendPasswordResetEmail(email: string, projectId: string, link: string): Promise<any> {
    return this.sendEmail(
      {
        to: [email],
        subject: 'Password reset',
        message: `Click this link to reset your password: ${link}`,
        template: 'auth/passwordReset',
        templateData: { link }
      },
      projectId
    );
  }

  async sendPasswordUpdatedEmail(email: string, projectId: string): Promise<any> {
    return this.sendEmail(
      {
        to: [email],
        subject: 'Password updated',
        message: 'Your password has been updated.',
        template: 'auth/passwordUpdated',
        templateData: {}
      },
      projectId
    );
  }

  async sendInviteEmail(email: string, projectId: string, link: string): Promise<any> {
    return this.sendEmail(
      {
        to: [email],
        subject: `You have been invited to join ${projectId}`,
        message: `Click this link to join: ${link}`,
        template: 'auth/invite',
        templateData: {}
      },
      projectId
    );
  }
}
