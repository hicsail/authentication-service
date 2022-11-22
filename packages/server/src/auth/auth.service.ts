import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { default as axios } from 'axios';
import * as bcrypt from 'bcrypt';
import * as randomstring from 'randomstring';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { UserSignupDto } from './dto/auth.dto';
import { AccessToken } from './types/auth.types';

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
      const payload = { id: user.id, projectId: user.projectId, role: user.role };
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
      const payload = { id: user.id, projectId: user.projectId, role: user.role };
      return { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    }

    return null;
  }

  /**
   *
   * @param projectId
   * @param email
   */
  forgotPassword(projectId: string, email: string): void {
    const resetCodePlain = randomstring.generate(10);
    this.userService.setResetToken(projectId, email, resetCodePlain);

    const payload = {
      to: email,
      subject: 'BU SAIL Authentication Password Reset',
      message: `${process.env.BASE_URL}/reset?code=${resetCodePlain}`
    };
    const sendEmailEndpoint = `${process.env.NOTIFICATION_SERVICE_URL}/email/send`;

    axios.post(sendEmailEndpoint, payload);
  }

  /**
   *
   * @param projectId
   * @param email
   * @param password
   * @param resetCode
   */
  async resetPassword(projectId: string, email: string, password: string, resetCode: string): Promise<void> {
    this.userService.updateUserPassword(projectId, email, password, resetCode);
    const payload = { message: 'Password updated.' };

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
  async signup(user: UserSignupDto): Promise<AccessToken> {
    const data = user;

    if (data == null || (data && Object.keys(data).length == 0)) {
      return { accessToken: '' };
    }

    try {
      const user = await this.userService.createUser(data);
      const payload = { id: user.id, projectId: user.projectId, role: user.role };
      const resp = { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
      return resp;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
