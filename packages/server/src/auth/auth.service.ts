import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUsername(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneUsername(username);

    if(user && await bcrypt.compare(password, user.password)) {
      const { password, username, ...rest } = user;
      return rest;
    }

    return null;
  }

  async validateEmail(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneEmail(email);

    if(user && await bcrypt.compare(password, user.password)) {
      const { password, email, ...rest } = user;
      return rest;
    }

    return null;
  }

  loginUsername(project_id: string, username: string, password: string) {
    const payload = { username: username, sub: project_id };

    return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
  }

  loginEmail(project_id: string, email: string, password: string) {
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

  async signup(project_id: string, username: string, email: string, method: string, password: string) {
    try {
      const saltRounds = 10;
      const passwordSaltSHA256 = await bcrypt.hash(password, saltRounds);

      await this.prisma.user.create({
        data: {
          project_id: project_id,
          username: username,
          email: email,
          password: passwordSaltSHA256,
          role: 0
        },
      });

      // TODO: Query to get generated uuid to use for sub using 
      // https://github.com/hicsail/authentication-service/blob/05d74299bb1b31070ed604b51af79400e895d8e4/packages/server/src/user/user.service.ts#L74

      const payload = { username: username, sub: project_id };

      return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}