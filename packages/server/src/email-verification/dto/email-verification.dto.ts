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

@InputType()
export class GenerateLinkDto {
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    @Type(() => String)
    @Field()
    baseUrl: string;

    @IsNotEmpty()
    @IsString()
    @IsDefined()
    @Type(() => String)
    @Field()
    accessToken: string;
}


export class EmailVerificationTransformPipe implements PipeTransform {
    transform(body: any): EmailVerificationDto {
        const user = new EmailVerificationDto();
        
        user.accessToken = body.accessToken;

        return user;
    }
}

export class SendLinkTransformPipe implements PipeTransform {
    transform(body: any): GenerateLinkDto {
        const user = new GenerateLinkDto();

        user.baseUrl = body.baseUrl;
        user.accessToken = body.accessToken;
        
        return user;
    }
}
