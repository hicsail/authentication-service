import { Type } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PipeTransform } from '@nestjs/common';
import { UserSignup } from '../types/auth.types';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserSignupDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @Type(() => String)
  @Field()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  fullname: string;

  @IsDefined()
  @IsEmail()
  @Field()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  username?: string;
}

@InputType()
export class UsernameLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @Type(() => String)
  @Field()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class EmailLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @Type(() => String)
  @Field()
  projectId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class ForgotDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Field()
  projectId: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;
}

@InputType()
export class ResetDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Field()
  projectId: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;
}

export class SignupTransformPipe implements PipeTransform {
  transform(body: UserSignup): UserSignupDto {
    const user = new UserSignupDto();

    user.projectId = body.projectId.toString();
    user.username = body.username?.toString();
    user.email = body.email?.toString().toLowerCase();
    user.password = body.password;

    return user;
  }
}

export class UsernameLoginTransformPipe implements PipeTransform {
  transform(body: any): UsernameLoginDto {
    const user = new UsernameLoginDto();

    user.projectId = body.projectId.toString();
    user.username = body.username;
    user.password = body.password;

    return user;
  }
}

export class EmailLoginTransformPipe implements PipeTransform {
  transform(body: any): EmailLoginDto {
    const user = new UserSignupDto();

    user.projectId = body.projectId.toString();
    user.email = body.email.toLowerCase();
    user.password = body.password;

    return user;
  }
}

export class ForgotPasswordTransformPipe implements PipeTransform {
  transform(body: any): ForgotDto {
    const user = new ForgotDto();

    user.projectId = body.projectId.toString();
    user.email = body.email.toLowerCase();

    return user;
  }
}

export class ResetPasswordTransformPipe implements PipeTransform {
  transform(body: any): ResetDto {
    const user = new ResetDto();

    user.projectId = body.projectId.toString();
    user.email = body.email.toLowerCase();
    user.password = body.password;
    user.code = body.code;

    return user;
  }
}
