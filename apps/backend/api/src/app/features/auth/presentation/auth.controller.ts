import { Controller, Get, Post, Headers, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginRequired } from '@starter/backend/bearer-token';
import { User } from '@starter/backend/utilities';
import { UserProfile } from '@starter/global-data';
import { AuthService } from '../application';
import { Login } from './decorators';
import { GetMeResponseDto, LoginResponseDto, RefreshTokenResponseDto, SignupRequestDto } from './dto';

@ApiTags('인증 API')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @LoginRequired()
  @Get('me')
  getMe(@User() user: UserProfile): Promise<GetMeResponseDto> {
    return this.authService.getMe(user._id);
  }

  @Get('token/refresh')
  refreshToken(@Headers('x-refresh-token') token: string): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshToken(token);
  }


  @Login
  @Post('login')
  login(@User() user: UserProfile): Promise<LoginResponseDto> {
    return this.authService.createAuthTokens(user);
  }

  @Post('signup')
  async signup(@Body() dto: SignupRequestDto): Promise<void> {
    await this.authService.signup(dto);
  }
}
