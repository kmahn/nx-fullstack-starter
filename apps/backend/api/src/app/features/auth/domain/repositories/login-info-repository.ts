import { LoginInfoAggregate } from '../aggregates';

export interface LoginInfoRepository {
  findOne(refreshToken: string): Promise<LoginInfoAggregate | null>;

  create(loginInfo: LoginInfoAggregate): Promise<void>;

  updateRefreshToken(oldRefreshToken: string, newRefreshToken: string): Promise<void>;
}

export const LoginInfoRepository = Symbol('LoginInfoRepository');

