import { ICommand } from '@nestjs/cqrs';
import { SignupRequestDto } from '@starter/global-data';

export class CreateUserCommand implements ICommand, SignupRequestDto {
  email: string;
  name: string;
  password: string;

  constructor(
    {
      email,
      name,
      password,
    }: SignupRequestDto
  ) {
    this.email = email;
    this.name = name;
    this.password = password;
  }
}
