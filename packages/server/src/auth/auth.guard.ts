import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const context = GqlExecutionContext.create(ctx);
    const { headers } = context.getContext().req;
    const token = headers.authorization.split(' ')[1] || '';
    try {
      const decodedToken = this.jwtService.verify(token);
      const roles = this.reflector.get<number[]>('roles', context.getHandler());
      if (!roles || roles.length === 0) {
        return true;
      }
      const usersAuthorization = decodedToken.role;
      if (!roles.map((role) => this.checkRole(role, usersAuthorization)).includes(true)) {
        this.logger.log('User does not have the required role');
        return false;
      }
      return true;
    } catch (err) {
      this.logger.error('Authenticating user failed', err);
      return false;
    }
  }

  checkRole(role: number, usersAuthorization: number): boolean {
    return (role & usersAuthorization) !== 0;
  }
}
