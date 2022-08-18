import { SignupRequestDto } from '@starter/global-data';

export class JoinRequestDtoImpl implements SignupRequestDto {
  email: string;
  name: string;
  password: string;

  constructor({ name, email, password }: SignupRequestDto) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
