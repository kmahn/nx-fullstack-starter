import { UserProfile } from '../types/user-profile';
import { BaseEntity } from './base.entity';

export interface UserEntity extends UserProfile, BaseEntity {
  email: string;
  name: string;
  auth: string | null;
  accessDate: Date;
  joinedAt: Date;
  updatedAt: Date;
}
