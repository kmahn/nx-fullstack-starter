import { Provider } from '@nestjs/common';
import { AuthRepository } from './auth-repository';
import { AuthRepositoryImpl, LoginInfoRepositoryImpl, UserRepositoryImpl } from './impl';
import { LoginInfoRepository } from './login-info-repository';
import { UserRepository } from './user-repository';

export * from './auth-repository';
export * from './login-info-repository';
export * from './user-repository';
export * from './impl';

export const Repositories: Provider[] = [
  { provide: AuthRepository, useClass: AuthRepositoryImpl },
  { provide: LoginInfoRepository, useClass: LoginInfoRepositoryImpl },
  { provide: UserRepository, useClass: UserRepositoryImpl },
];
