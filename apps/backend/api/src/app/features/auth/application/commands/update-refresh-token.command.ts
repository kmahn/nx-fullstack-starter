import { ICommand } from '@nestjs/cqrs';

export class UpdateRefreshTokenCommand implements ICommand {
  constructor(
    public readonly oldRefreshToken: string,
    public readonly newRefreshToken: string
  ) {
  }
}
