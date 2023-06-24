import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';
import { NotificationService } from '../notification/notification.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EmailVerificationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly projectService: ProjectService,
        private readonly configService: ConfigService,
        private readonly notification: NotificationService,
        private readonly http: HttpService

    ) {}

    async getVerificationStatus(accessToken: string): Promise<Boolean> {
        const decoded = this.jwtService.decode(accessToken)

        const user = await this.userService.findUserById(decoded['id']);
        console.log(user.emailVerified)
        return user.emailVerified;

    }

}
