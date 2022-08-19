import { ICommand } from '@nestjs/cqrs';

export class CreateRefreshTokenCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string
  ) {}
}
