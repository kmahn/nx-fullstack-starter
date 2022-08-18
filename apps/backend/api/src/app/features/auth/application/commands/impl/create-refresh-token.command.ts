import { ICommand } from '@nestjs/cqrs';
import { UserProfile } from '@starter/global-data';

export class CreateRefreshTokenCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string
  ) {}
}
