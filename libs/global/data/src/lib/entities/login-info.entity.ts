import { BaseEntity } from './base.entity';

export interface LoginInfoEntity extends BaseEntity {
  user: string;
  refreshToken: string;
  createdAt: Date;
}
