import { ApiProperty } from '@nestjs/swagger';
import { LoginRequestDto as ILoginRequestDto } from '@starter/global-data';

export class LoginRequestDto implements ILoginRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
