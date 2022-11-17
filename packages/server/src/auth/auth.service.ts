import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { UserSignup, AccessToken } from './types/auth.types';
import * as dotenv from 'dotenv';
import * as randomstring from 'randomstring';

const { default: axios } = require('axios');

dotenv.config({ path: `${__dirname}/../../.env` });

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private prisma: PrismaService, private jwtService: JwtService) {}

  /**
   * Validate login using username.
   *
   * @param projectId
   * @param username
   * @param password
   * @returns JWT or null
   */
  async validateUsername(projectId: string, username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUsername(projectId, username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: username, sub: projectId };
      return { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    }

    return null;
  }

  /**
   * Validate login using email.
   *
   * @param projectId
   * @param username
   * @param password
   * @returns JWT or null
   */
  async validateEmail(projectId: string, email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(projectId, email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: email, sub: projectId };
      return { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    }

    return null;
  }

  /**
   * Generates a unique link to reset password that encodes the given parameters.
   * 
   * @param projectId
   * @param email
   */
  forgotPassword(project_id: string, email: string): void {
    const resetCodePlain = randomstring.generate(10);
    this.userService.setResetToken({ project_id, email }, resetCodePlain);
    const payload = { message: `${process.env.BASE_URL}/reset?code=${resetCodePlain}` };

    axios.post(process.env.NOTIFICATION_SERVICE_URL, payload);
  }

  /**
   *
   * @param projectId
   * @param email
   * @param password
   * @param resetCodePlain
   */
  async resetPassword(project_id: string, email: string, password: string, resetCodePlain: string): Promise<void> {
    this.userService.updateUserPassword({ project_id, email }, password, resetCodePlain);
    const payload = { message: 'Password updated.' }

    axios.post(process.env.NOTIFICATION_SERVICE_URL, payload);
  }

  /**
   * User signup.
   *
   * @param projectId
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
