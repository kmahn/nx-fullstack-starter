import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfile } from '@starter/global-data';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserProfile => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
