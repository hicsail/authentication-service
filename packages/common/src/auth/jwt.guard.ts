import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // Return HTTP context
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
    // Return GraphQL context
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
