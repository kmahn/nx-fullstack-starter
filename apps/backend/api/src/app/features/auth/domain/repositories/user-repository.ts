import { UserEntity } from '@starter/global-data';
import { UserAggregate } from '../aggregates';

export interface UserRepository {
  findById(id: string): Promise<UserAggregate | null>;

  findOne(filter: Partial<UserEntity>): Promise<UserAggregate | null>;

  create(user: UserAggregate): Promise<void>;

  updateOne(id: string, $set: Partial<UserAggregate>): Promise<void>;
}

export const UserRepository = Symbol('UserRepository');