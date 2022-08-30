import { Provider } from '@nestjs/common';
import { CreateRefreshTokenHandler } from './create-refresh-token.handler';
import { CreateUserHandler } from './create-user.handler';
import { UpdateRefreshTokenHandler } from './update-refresh-token.handler';

export const CommandHandlers: Provider[] = [
  CreateRefreshTokenHandler,
  CreateUserHandler,
  UpdateRefreshTokenHandler,
];
