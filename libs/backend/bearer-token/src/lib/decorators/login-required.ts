import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AccessTokenExpiredException, LoginRequiredException } from '@starter/backend/exception';
import { ApiExceptions } from '@starter/backend/utilities';
import { JwtGuard } from '../guards/jwt.guard';

export function LoginRequired(...decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator>) {
  return applyDecorators(
    ApiHeader({ name: 'Authorization' }),
    ApiBearerAuth(),
    ApiExceptions(
      LoginRequiredException,
      AccessTokenExpiredException,
    ),
    UseGuards(JwtGuard),
    ...decorators
  );
}
