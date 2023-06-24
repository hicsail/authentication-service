import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PipeTransform } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@InputType()
export class EmailVerificationDto {
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    @Type(() => String)
    @Field()
    accessToken: string;
}

export class EmailVerificationTransformPipe implements PipeTransform {
    constructor () {}
    transform(body: any): EmailVerificationDto {
        const user = new EmailVerificationDto();
        
        user.accessToken = body.accessToken;

        return user;
    }
}