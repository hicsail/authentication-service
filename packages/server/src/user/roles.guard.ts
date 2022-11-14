import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enum/role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    // TODO: Verify user's role
    const roles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    // when there is no roles restriction
    if (!roles || roles.length === 0) {
      return true;
    }

    const { role: usersRole } = context.switchToHttp().getRequest().user;

    for (const role of roles) {
      // Permission granted if role of request AND all permitted roles is not 0
      if ((usersRole & role) !== 0) {
        return true;
      }
    }

    return false;
  }
}
