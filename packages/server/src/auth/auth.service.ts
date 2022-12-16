import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { default as axios } from 'axios';
import * as bcrypt from 'bcrypt';
import * as randomstring from 'randomstring';
import { UserService } from '../user/user.service';
import { UserSignupDto } from './dto/auth.dto';
import { AccessToken } from './types/auth.types';
import { UpdateStatus } from '../user/types/user.types';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  /**
   * Validate login using username.
   *
   * @param projectId
   * @param username
   * @param password
   * @returns JWT or 401 status code
   */
  async validateUsername(projectId: string, username: string, password: string): Promise<any> {
    if (projectId == null || username == null || password == null) {
      throw new HttpException('Bad request: project id, email and password all required.', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findUserByUsername(projectId, username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, projectId: user.projectId, role: user.role };
      return { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    }

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  /**
   * Validate login using email.
   *
   * @param projectId
   * @param username
   * @param password
   * @returns JWT or 401 status code
   */
  async validateEmail(projectId: string, email: string, password: string): Promise<any> {
    if (projectId == null || email == null || password == null) {
      throw new HttpException('Bad request: project id, email and password all required.', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findUserByEmail(projectId, email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, projectId: user.projectId, role: user.role };
      return { accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }) };
    }

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  /**
   *
   * @param projectId
   * @param email
   */
  async forgotPassword(projectId: string, email: string): Promise<void> {
    if (projectId == null || email == null) {
      return;
    }

    const resetCodePlain = randomstring.generate(10);
    const wasSet = await this.userService.setResetToken(projectId, email, resetCodePlain);

    if (!wasSet) {
      return;
    }

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
   * @returns UpdateStatus
   */
  async resetPassword(projectId: string, email: string, password: string, resetCode: string): Promise<UpdateStatus> {
    if (projectId == null || email == null || password == null || resetCode == null) {
      return {
        message: 'Password unsuccessfully updated. Project id, email, password and reset code are all required.',
        status: 400
      };
    }
    const update = await this.userService.updateUserPassword(projectId, email, password, resetCode);

    if (update.status == 200) {
      const payload = {
        to: email,
        subject: 'Password Reset Successful',
        message: 'Password updated.'
      };

      const sendEmailEndpoint = `${process.env.NOTIFICATION_SERVICE_URL}/email/send`;
      axios.post(sendEmailEndpoint, payload);
    }

    return update;
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
      return err;
    }
  }
}
