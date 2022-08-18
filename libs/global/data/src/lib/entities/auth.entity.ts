import { BaseEntity } from './base.entity';

export const PROVIDERS = [
  'local',
  'kakao',
  'naver',
  'google',
  'apple',
] as const;
export type ProviderType = typeof PROVIDERS[number];

export interface AuthEntity extends BaseEntity {
  providerId: string;
  provider: ProviderType;
  password?: string;
  user: string;
  validatePassword?: (password: string) => boolean;
}
