import { UserProfile } from './user-profile';

export interface LoggingData {
  user?: UserProfile;
  body?: any;
  response?: any;
  time?: number;
  ip?: string;
  agent?: string;
  referer?: string;
}
