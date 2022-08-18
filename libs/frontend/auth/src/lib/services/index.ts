import { AuthStorageService } from './auth-storage.service';
import { AuthService } from './auth.service';

export * from './dto';
export * from './auth.service';
export * from './auth-storage.service';

export const Services = [
  AuthStorageService,
  AuthService,
];
