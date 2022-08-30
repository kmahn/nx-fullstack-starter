import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ApiExceptions } from '@starter/backend/utilities';
import { InvalidPasswordException, UserNotFoundException } from '../../domain';
import { LoginRequestDto, LoginResponseDto } from '../dto';

export const Login = applyDecorators(
  ApiResponse({ type: LoginResponseDto, status: 200 }),
  ApiBody({ type: LoginRequestDto }),
  ApiExceptions(
    UserNotFoundException,
    InvalidPasswordException,
  ),
  UseGuards(AuthGuard('local')),
);
