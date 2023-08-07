import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const TokenContext = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  // Return user on HTTP request
  if (ctx.getType() === 'http') {
    return ctx.switchToHttp().getRequest().user;
  }
  // Return user on gql request
  const gqlContext = GqlExecutionContext.create(ctx);
  return gqlContext.getContext().req.user;
});
