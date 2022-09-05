import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UnauthorizedException } from '@starter/backend/exception';
import { ApiExceptions } from '@starter/backend/utilities';
import { RefreshTokenResponseDto } from '../dto';

export const RefreshToken = applyDecorators(
  ApiResponse({ type: RefreshTokenResponseDto, status: 200 }),
  ApiExceptions(UnauthorizedException),
);
