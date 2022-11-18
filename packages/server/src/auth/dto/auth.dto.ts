import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class UserSignupDto {

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  project_id: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  method: string;

  @IsNotEmpty()
  @IsString()
  password: string;
};

export class UsernameLoginDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  project_id: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
};

export class EmailLoginDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  project_id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
};

export class SignupTransformPipe implements PipeTransform {
    transform(body: any, metadata: ArgumentMetadata): UserSignupDto {
        const user = new UserSignupDto();
        user.project_id = body.project_id.toString();
        user.username = body.username.toString();
        user.email = body.email.toString();
        user.password = body.password;

        return user;
    }
}

export class UsernameLoginTransformPipe implements PipeTransform {
  transform(body: any, metadata: ArgumentMetadata): UsernameLoginDto {
      const user = new UserSignupDto();
      user.project_id = body.project_id.toString();
      user.username = body.username;
      user.password = body.password;

      return user;
  }
}

export class EmailLoginTransformPipe implements PipeTransform {
  transform(body: any, metadata: ArgumentMetadata): EmailLoginDto {
      const user = new UserSignupDto();
      user.project_id = body.project_id.toString();
      user.email = body.email;
      user.password = body.password;

      return user;
  }
}

