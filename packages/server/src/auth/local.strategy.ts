import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategyUsername extends PassportStrategy(Strategy, 'username') {
  constructor(private authService: AuthService) {
    super(); //config https://www.passportjs.org/packages/
  }

  // Required by PassportStrategy
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUsername(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class LocalStrategyEmail extends PassportStrategy(Strategy, 'email') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email'
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateEmail(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
