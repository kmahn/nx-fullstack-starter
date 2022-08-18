import { ApiProperty } from '@nestjs/swagger';
import { SignupRequestDto as ISignupRequestDto } from '@starter/global-data';

export class SignupRequestDto implements ISignupRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;
}
