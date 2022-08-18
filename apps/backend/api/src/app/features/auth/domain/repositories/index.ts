import { Provider } from '@nestjs/common';
import { AuthRepositoryImpl, LoginInfoRepositoryImpl, UserRepositoryImpl } from './impl';
import { AuthRepository, LoginInfoRepository, UserRepository } from './interfaces';

export * from './interfaces';
export * from './impl';

export const Repositories: Provider[] = [
  { provide: AuthRepository, useClass: AuthRepositoryImpl },
  { provide: LoginInfoRepository, useClass: LoginInfoRepositoryImpl },
  { provide: UserRepository, useClass: UserRepositoryImpl },
];
