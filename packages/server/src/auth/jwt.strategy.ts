import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ValidatedUser } from './types/auth.types';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config({ path: `${__dirname}/../../.env` });

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKey: configService.get('PUBLIC_KEY_1'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256']
    });
  }

  async validate(payload: any): Promise<ValidatedUser> {
    return {
      id: payload.id,
      projectId: payload.projectId,
      role: payload.role
    };
  }
}
