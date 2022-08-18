import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { ApiImplicitBody } from '@nestjs/swagger/dist/decorators/api-implicit-body.decorator';
import { LoginRequestDto, LoginResponseDto } from '../dto';

export const Login = applyDecorators(
  UseGuards(AuthGuard('local')),
  ApiImplicitBody({ name: '', type: LoginRequestDto, content: {} }),
  ApiResponse({ type: LoginResponseDto })
);
