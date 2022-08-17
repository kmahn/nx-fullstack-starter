import { JoinRequestDto } from '@starter/global-data';

export class JoinRequestDtoImpl implements JoinRequestDto {
  email: string;
  name: string;
  password: string;

  constructor({ name, email, password }: JoinRequestDto) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
