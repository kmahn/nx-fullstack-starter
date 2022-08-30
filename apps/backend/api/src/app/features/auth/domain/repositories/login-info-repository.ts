import { BaseRepository } from '@starter/backend/repository';
import { LoginInfoEntity } from '@starter/global-data';
import { LoginInfoAggregate } from '../aggregates';

export interface LoginInfoRepository extends Partial<BaseRepository<LoginInfoAggregate, LoginInfoEntity>>{
  findOne(filter: Partial<LoginInfoEntity>): Promise<LoginInfoAggregate | null>;

  create(loginInfo: LoginInfoAggregate): Promise<void>;

  updateOne(filter: Partial<LoginInfoEntity>, $set: Partial<LoginInfoAggregate>): Promise<void>;

  deleteOne(filter: Partial<LoginInfoEntity>): Promise<void>;
}

export const LoginInfoRepository = Symbol('LoginInfoRepository');

