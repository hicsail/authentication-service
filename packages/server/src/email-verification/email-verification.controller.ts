import { Controller, ParseUUIDPipe, Get, HttpException, HttpStatus, Param, UsePipes, Body, Put} from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationDto, EmailVerificationTransformPipe, GenerateLinkDto, SendLinkTransformPipe } from './dto/email-verification.dto';

@Controller('email-verification')
export class EmailVerificationController {
    constructor(private readonly emailVerificationService: EmailVerificationService) {}

    @Get('status')
    @UsePipes(new EmailVerificationTransformPipe())
    async getVerificationStatus(@Body() user: EmailVerificationDto): Promise<Boolean> {
        return this.emailVerificationService.getVerificationStatus(user.accessToken)
    }

    @Get('verificationLink')
    @UsePipes(new SendLinkTransformPipe())
    async generateVerificationLink(@Body() user: GenerateLinkDto): Promise<String> {
        return this.emailVerificationService.generateVerificationLink(user.baseUrl, user.accessToken);
    }

    @Put('verify')
    @UsePipes(new EmailVerificationTransformPipe())
    async verifyEmail(@Body() user: EmailVerificationDto): Promise<Boolean> {
        return this.emailVerificationService.verifyEmail(user.accessToken)
    }
}
