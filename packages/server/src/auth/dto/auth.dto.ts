import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { PipeTransform } from '@nestjs/common';
import { UserSignup } from '../types/auth.types';

export class UserSignupDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  projectId: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UsernameLoginDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  projectId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class EmailLoginDto {
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
