import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ValidatedUser } from './types/auth.types';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: process.env.SECRET,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: any): Promise<ValidatedUser> {
    return {
      id: payload.id,
      project_id: payload.project_id,
      role: payload.role
    };
  }
}
