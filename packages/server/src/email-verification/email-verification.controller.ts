import { Controller, ParseUUIDPipe, Get, HttpException, HttpStatus, Param, UsePipes, Body} from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationDto, EmailVerificationTransformPipe } from './dto/email-verification.dto';

@Controller('email-verification')
export class EmailVerificationController {
    constructor(private readonly emailVerificationService: EmailVerificationService) {}

    @Get('status/?')
    @UsePipes(new EmailVerificationTransformPipe())
    async getVerificationStatus(@Body() user: EmailVerificationDto): Promise<Boolean> {
        return this.emailVerificationService.getVerificationStatus(user.accessToken)
    }
}
