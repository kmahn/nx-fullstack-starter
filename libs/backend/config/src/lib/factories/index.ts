import { ConfigFactory } from '@nestjs/config';
import { adminConfig } from './admin.config';

export * from './config-key';
export * from './admin.config';


export const load: ConfigFactory[] = [
  adminConfig,
];

