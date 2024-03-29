import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as randomstring from 'randomstring';
import { UserService } from '../user/user.service';
import { UserSignupDto } from './dto/auth.dto';
import { AccessToken } from './types/auth.types';
import { UpdateStatus } from '../user/types/user.types';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from '../project/project.service';
import { NotificationService } from '../notification/notification.service';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly projectService: ProjectService,
    private readonly configService: ConfigService,
    private readonly notification: NotificationService,
    private readonly http: HttpService
  ) {}

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
      const payload = { id: user.id, projectId: user.projectId, role: user.role, type: 'access' };
      const refreshPayload = { id: user.id, projectId: user.projectId, type: 'refresh' };
      this.logger.log('Username validated');
      return {
        accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }),
        refreshToken: this.jwtService.sign(refreshPayload, { expiresIn: process.env.REFRESH_EXPIRATION })
      };
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
      const payload = { id: user.id, projectId: user.projectId, role: user.role, type: 'access' };
      const refreshPayload = { id: user.id, projectId: user.projectId, type: 'refresh' };

      return {
        accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }),
        refreshToken: this.jwtService.sign(refreshPayload, { expiresIn: process.env.REFRESH_EXPIRATION })
      };
    }

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  /**
   *
   * @param projectId
   * @param credential
   * @returns JWT or 401 status code
   */
  async validateGoogle(projectId: string, credential: string): Promise<any> {
    const verifiedCredentials = await this.verifyGoogleToken(credential);
    if (verifiedCredentials == null) {
      throw new HttpException('Bad Request: Invalid ID Token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findUserByEmail(projectId, verifiedCredentials['email']);

    if (user) {
      const payload = { id: user.id, projectId: user.projectId, role: user.role, type: 'access' };
      const refreshPayload = { id: user.id, projectId: user.projectId, type: 'refresh' };
      return {
        accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }),
        refreshToken: this.jwtService.sign(refreshPayload, { expiresIn: process.env.REFRESH_EXPIRATION })
      };
    }

    //If user doesn't exist, create new user with Google User data
    const newUserDto = new UserSignupDto();
    newUserDto.email = verifiedCredentials['email'];
    newUserDto.fullname = verifiedCredentials['name'];
    newUserDto.projectId = projectId;
    newUserDto.password = null;

    return this.signup(newUserDto);
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

    const link = `${this.configService.get('BASE_URL')}/reset?code=${resetCodePlain}`;
    return this.notification.sendPasswordResetEmail(projectId, email, link);
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
      await this.notification.sendPasswordUpdatedEmail(projectId, email);
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
    const project = await this.projectService.getProject(data.projectId);

    if (project == null) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    if (!project.allowSignup) {
      throw new HttpException('Signup is not allowed for this project', HttpStatus.FORBIDDEN);
    }

    if (data == null || (data && Object.keys(data).length == 0)) {
      return { accessToken: '', refreshToken: '' };
    }

    try {
      const user = await this.userService.createUser(data);
      const payload = { id: user.id, projectId: user.projectId, role: user.role, type: 'access' };
      const refreshPayload = { id: user.id, projectId: user.projectId, type: 'refresh' };
      const resp = {
        accessToken: this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION }),
        refreshToken: this.jwtService.sign(refreshPayload, { expiresIn: process.env.REFRESH_EXPIRATION })
      };
      this.logger.log(`User of user id: ${user.id} Created`);
      return resp;
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }

  /**
   * Get Public Keys
   *
   * @returns List of Public Keys
   */
  publicKey(): string[] {
    const publicKeys: string[] = [];
    publicKeys.push(this.configService.get('PUBLIC_KEY_1'));
    publicKeys.push(this.configService.get('PUBLIC_KEY_2'));
    return publicKeys;
  }

  async verifyGoogleToken(credential: string): Promise<any> {
    try {
      const verificationRequest = this.http.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + credential);
      return (await lastValueFrom(verificationRequest)).data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token.
   *
   * @param refreshToken
   * @returns New access token
   */
  async refreshAccessToken(refreshToken: string): Promise<AccessToken> {
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken);
      const userId = decodedRefreshToken['id'];
      const projectId = decodedRefreshToken['projectId'];

      const payload = { id: userId, projectId: projectId, type: 'access' };
      const refreshPayload = { id: userId, projectId: projectId, type: 'refresh' };
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRATION });
      const newRefreshToken = this.jwtService.sign(refreshPayload, { expiresIn: process.env.REFRESH_EXPIRATION });
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
