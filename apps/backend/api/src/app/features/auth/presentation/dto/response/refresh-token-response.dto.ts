import { ApiProperty } from '@nestjs/swagger';
import { RefreshTokenResponseDto as IRefreshTokenResponseDto } from '@starter/global-data';

export class RefreshTokenResponseDto implements IRefreshTokenResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
