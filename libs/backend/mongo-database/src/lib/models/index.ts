import { ModelDefinition } from '@nestjs/mongoose';
import { ModelName } from '../enum';
import { AuthSchema } from './auth.model';
import { LoginInfoSchema } from './login-info.model';
import { UserSchema } from './user.model';

export * from './auth.model';
export * from './login-info.model';
export * from './user.model';

export const models: ModelDefinition[] = [
  { name: ModelName.AUTH, schema: AuthSchema },
  { name: ModelName.LOGIN_INFO, schema: LoginInfoSchema },
  { name: ModelName.USER, schema: UserSchema },
];
