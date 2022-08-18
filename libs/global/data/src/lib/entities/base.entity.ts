import { UserEntity } from './user.entity';

export interface BaseEntity {
  _id: any;
}

export interface CreateEntity {
  creator: UserEntity;
  createdAt: Date;
}

export interface UpdatedEntity {
  updater: UserEntity;
  updatedAt: Date;
}
