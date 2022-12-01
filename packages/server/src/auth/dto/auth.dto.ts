import { Type } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { PipeTransform } from '@nestjs/common';
import { UserSignup } from '../types/auth.types';

export class UserSignupDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @Type(() => String)
  projectId: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UsernameLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @Type(() => String)
  projectId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class EmailLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @Type(() => String)
  projectId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ForgotDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  projectId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  projectId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class SignupTransformPipe implements PipeTransform {
  transform(body: UserSignup): UserSignupDto {
    const user = new UserSignupDto();

    user.projectId = body.projectId.toString();
    user.username = body.username.toString();
    user.email = body.email.toString();
    user.password = body.password;

    return user;
  }
}

export class UsernameLoginTransformPipe implements PipeTransform {
  transform(body: any): UsernameLoginDto {
    const user = new UserSignupDto();

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
    user.email = body.email;
    user.password = body.password;

    return user;
  }
}
