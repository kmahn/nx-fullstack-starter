import { BaseRepository } from '@starter/backend/repository';
import { UserEntity } from '@starter/global-data';
import { UserAggregate } from '../aggregates';

export interface UserRepository extends Partial<BaseRepository<UserAggregate, UserEntity>> {
  findById(id: string): Promise<UserAggregate | null>;

  findOne(filter: Partial<UserEntity>): Promise<UserAggregate | null>;

  create(user: UserAggregate): Promise<void>;

  updateOne(filter: Partial<UserEntity>, $set: Partial<UserAggregate>): Promise<void>;
}

export const UserRepository = Symbol('UserRepository');
