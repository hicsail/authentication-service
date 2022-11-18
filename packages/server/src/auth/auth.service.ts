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
   * @param project_id
   * @param username
   * @param password
   * @returns JWT or null
   */
  async validateUsername(project_id: string, username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUsername(project_id, username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, project_id: user.project_id, role: user.role };
      return { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
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
      const payload = { id: user.id, project_id: user.project_id, role: user.role };
      return { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
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
  async signup(user: UserSignupDto): Promise<AccessToken> {
    const data = user;

    try {
      const user = await this.userService.createUser(data);
      const payload = { id: user.id, project_id: user.project_id, role: user.role };

      // return { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
      const resp = { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
      return resp;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
