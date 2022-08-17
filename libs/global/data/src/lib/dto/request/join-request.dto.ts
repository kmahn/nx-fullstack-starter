import { UserEntity } from '../../entities/user.entity';

export interface JoinRequestDto
  extends Pick<UserEntity, 'email' | 'name'> {
  password: string;
}
