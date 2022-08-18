import { ApiProperty } from '@nestjs/swagger';
import { LoginResponseDto as ILoginResponseDto } from '@starter/global-data';

export class LoginResponseDto implements ILoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
