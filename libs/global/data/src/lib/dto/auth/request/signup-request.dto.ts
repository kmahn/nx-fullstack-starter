import { UserEntity } from '../../../entities/user.entity';

export interface SignupRequestDto
  extends Pick<UserEntity, 'email' | 'name'> {
  password: string;
}
