import { ApiProperty } from '@nestjs/swagger';
import { GetMeResponseDto as IGetMeResponseDto, USER_ROLES, UserRoleType } from '@starter/global-data';

export class GetMeResponseDto  implements IGetMeResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ enum: USER_ROLES })
  role: UserRoleType;

  @ApiProperty()
  name: string;

  @ApiProperty()
  accessDate: Date | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  joinedAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  auth: string;
}
