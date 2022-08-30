import { BaseRepository } from '@starter/backend/repository';
import { AuthEntity } from '@starter/global-data';
import { AuthAggregate } from '../aggregates';

export interface AuthRepository extends Partial<BaseRepository<AuthAggregate, AuthEntity>> {
  findOne(filter: Partial<AuthEntity>): Promise<AuthAggregate | null>;

  create(auth: AuthAggregate): Promise<void>;
}

export const AuthRepository = Symbol('AuthRepository');
