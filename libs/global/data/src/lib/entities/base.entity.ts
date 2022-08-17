import { UserEntity } from './user.entity';

export interface BaseEntity {
  _id: string;
}

export interface CreateEntity {
  creator: UserEntity;
  createdAt: Date;
}

export interface UpdatedEntity {
  updater: UserEntity;
  updatedAt: Date;
}
