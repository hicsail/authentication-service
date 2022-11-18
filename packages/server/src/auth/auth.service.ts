import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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
   * @param projectId
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
   * @param projectId
   * @param username
   * @param password
   * @returns JWT or log= error.
   */
  async signup(user: UserSignupDto): Promise<AccessToken> {
    const data = user;

    if(data == null || (data && Object.keys(data).length == 0)) {
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
