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

    console.log(roles);

    // when there is no roles restriction
    if (!roles || roles.length === 0) {
      return true;
    }

    const { token } = context.switchToHttp().getRequest().body;
    const { role: req_role } = this.jwtService.decode(token) as { role: number };

    // bitwise operation:
    // role of request & sum of all permitted roles
    return (req_role & roles.reduce((sum, current) => sum + current, 0)) !== 0;
  }
}
