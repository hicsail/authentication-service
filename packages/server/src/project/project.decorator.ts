import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { decode } from 'jsonwebtoken';

export const ProjectId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const context = GqlExecutionContext.create(ctx);
  const { headers } = context.getContext().req;
  const token = headers.authorization.split(' ')[1] || '';
  const decoded = decode(token);
  return decoded['projectId'];
});
