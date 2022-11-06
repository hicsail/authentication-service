import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneUsername(username);

    if(user && user.password === password) {
      const { password, username, ...rest } = user;
      return rest;
    }

    return null;
  }
}

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

  loginUsername(project_id: string, username: string, password: string): string {
    // check username and check email
    console.log('LOGGED IN');
    return 'JWT token';
  }

  forgot(): void {
    // TODO:
    // 1. send email
  }

  reset(): void {
    // TODO:
    // 1 Check credentials
    // 2. Send email
  }
}

@Injectable()
export class SignupService {
  constructor(private prisma: PrismaService) {}

  async signup(project_id: string, username: string, email: string, method: string, password: string): Promise<string> {
    // TODO:
    // 0. Check password strength and credentials
    // 1. Create account using inputs
    // 2. Return JWT token
    try {
      const salt = await bcrypt.genSalt();
      const passwordSaltSHA256 = await bcrypt.hash(password, salt);

      await this.prisma.user.create({
        data: {
          project_id: project_id,
          username: username,
          email: email,
          password: passwordSaltSHA256, 
          role: 0
        },
      });

      // JWT returned here
      return `${project_id}-${username}-${method}-${passwordSaltSHA256}`;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}