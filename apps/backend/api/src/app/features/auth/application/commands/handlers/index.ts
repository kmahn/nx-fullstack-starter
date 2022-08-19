import { Provider } from '@nestjs/common';
import { UpdateRefreshTokenCommand } from '../update-refresh-token.command';
import { CreateRefreshTokenHandler } from './create-refresh-token.handler';
import { CreateUserHandler } from './create-user.handler';

export const CommandHandlers: Provider[] = [
  CreateRefreshTokenHandler,
  CreateUserHandler,
  UpdateRefreshTokenCommand,
];
