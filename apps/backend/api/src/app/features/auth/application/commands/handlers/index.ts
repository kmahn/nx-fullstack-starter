import { Provider } from '@nestjs/common';
import { UpdateRefreshTokenCommand } from '../impl/update-refresh-token.command';
import { CreateRefreshTokenHandler } from './create-refresh-token.handler';

export const CommandHandlers: Provider[] = [
  CreateRefreshTokenHandler,
  UpdateRefreshTokenCommand,
];
