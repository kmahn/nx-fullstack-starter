import { SignupRequestDto } from '@starter/global-data';
import { CreateUserCommand } from './create-user.command';

describe('CreateUserCommand', () => {
  it('constructor()', () => {
    const user: SignupRequestDto = {
      email: 'test@test.com',
      name: 'name',
      password: 'password',
    };

    const command = new CreateUserCommand(user);

    expect(command).toEqual(user);
  });
});
