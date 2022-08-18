import { AuthAggregate } from '../../aggregates';

export interface AuthRepository {
  findById(id: string): Promise<AuthAggregate | null>;

  create(auth: AuthAggregate): Promise<void>;
}

export const AuthRepository = Symbol('AuthRepository');
