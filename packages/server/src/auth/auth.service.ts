import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { UserSignup, AccessToken } from './types/auth.types';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private prisma: PrismaService, private jwtService: JwtService) {}

  /**
   * Validate login using username.
   *
   * @param project_id
   * @param username
   * @param password
   * @returns JWT or null
   */
  async validateUsername(project_id: string, username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUsername(project_id, username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: username, sub: project_id };
      return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    }

    return null;
  }

  /**
   * Validate login using email.
   *
   * @param project_id
   * @param username
   * @param password
   * @returns JWT or null
   */
  async validateEmail(project_id: string, email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(project_id, email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: email, sub: project_id };
      return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    }

    return null;
  }

  /**
   *
   * @param project_id
   * @param username
   * @param password
   * @returns
   */
  forgot(): void {
    // TODO:
    // 1. send email
  }

  /**
   *
   * @param project_id
   * @param username
   * @param password
   * @returns
   */
  reset(): void {
    // TODO:
    // 1 Check credentials
    // 2. Send email
  }

  /**
   * User signup.
   *
   * @param project_id
   * @param username
   * @param password
   * @returns JWT or log= error.
   */
  async signup(user: UserSignup): Promise<AccessToken> {
    const data = user;
    const username = user.username;

    try {
      const user = await this.userService.createUser(data);
      const payload = { username: username, sub: user.id };

      return { access_token: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
