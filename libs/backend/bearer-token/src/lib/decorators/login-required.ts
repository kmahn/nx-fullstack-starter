import { applyDecorators, UseGuards } from '@nestjs/common';
import { AccessTokenExpiredException, LoginRequiredException } from '@starter/backend/exception';
import { ApiExceptions } from '@starter/backend/utilities';
import { JwtGuard } from '../guards/jwt.guard';

export function LoginRequired(...decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator>) {
  return applyDecorators(
    ApiExceptions(
      LoginRequiredException,
      AccessTokenExpiredException,
    ),
    UseGuards(JwtGuard),
    ...decorators
  );
}
