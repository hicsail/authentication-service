import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UserSignup, AccessToken } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUsername(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneUsername(username);

    if (user && (await argon2.verify(user.password, password))) {
      const { password, username, ...rest } = user;
      return rest;
    }

    return null;
  }

  async validateEmail(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneEmail(email);

    if (user && (await argon2.verify(user.password, password))) {
      const { password, email, ...rest } = user;
      return rest;
    }

    return null;
  }

  loginUsername(project_id: string, username: string, password: string): AccessToken {
    const payload = { username: username, sub: project_id };

    return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
  }

  loginEmail(project_id: string, email: string, password: string): AccessToken {
    const payload = { email: email, sub: project_id };

    return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
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

  async signup(user: UserSignup): Promise<AccessToken> {
    const data = user;
    const username = user.username;

    try {
      const user = await this.usersService.createUser(data);
      const payload = { username: username, sub: user.id };

      return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
