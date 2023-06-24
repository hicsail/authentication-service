import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EmailVerificationService } from './email-verification.service';

import {
    EmailVerificationDto,
    EmailVerificationTransformPipe
} from './dto/email-verification.dto'
import { UsePipes } from '@nestjs/common';

@Resolver()
export class EmailVerificationResolver {
    constructor(private readonly emailVerificationService: EmailVerificationService) {}

    /**Get User Email Verification Status */
    @Query(() => Boolean)
    @UsePipes(new EmailVerificationTransformPipe())
    async getEmailVerificationStatus(@Args('user') user: EmailVerificationDto): Promise<Boolean> {
        return this.emailVerificationService.getVerificationStatus(user.accessToken);
    }

}