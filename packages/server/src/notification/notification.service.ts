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

  async sendPasswordResetEmail(projectId: string, email: string, link: string): Promise<any> {
    const project = await this.projectService.getProject(projectId);
    const response = await this.http
      .post(this.notificationUrl, {
        to: [email],
        subject: 'Password reset',
        message: `Click this link to reset your password: ${link}`,
        template: 'auth/passwordReset',
        templateData: {
          link,
          project
        }
      })
      .toPromise();
    if (response.status !== HttpStatus.CREATED) {
      this.logger.error(`Failed to send password reset email to ${email} for project ${project.id}`);
      throw new HttpException('Failed to send password reset email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response.data;
  }

  async sendPasswordUpdatedEmail(projectId: string, email: string): Promise<any> {
    const project = await this.projectService.getProject(projectId);
    const response = await this.http
      .post(this.notificationUrl, {
        to: [email],
        subject: 'Password updated',
        message: 'Your password has been updated.',
        template: 'auth/passwordUpdated',
        templateData: {
          project
        }
      })
      .toPromise();
    if (response.status !== HttpStatus.CREATED) {
      this.logger.error(`Failed to send password updated email to ${email} for project ${project.id}`);
      throw new HttpException('Failed to send password updated email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response.data;
  }

  async sendInviteEmail(projectId: string, email: string, link: string): Promise<any> {
    const project = await this.projectService.getProject(projectId);
    const response = await this.http
      .post(this.notificationUrl, {
        to: [email],
        subject: `You have been invited to join ${project.name}`,
        message: `Click this link to join: ${link}`,
        template: 'auth/invite',
        templateData: {
          link,
          project
        }
      })
      .toPromise();
    if (response.status !== HttpStatus.CREATED) {
      this.logger.error(`Failed to send invite email to ${email} for project ${project.id}`);
      throw new HttpException('Failed to send invite email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response.data;
  }
}
