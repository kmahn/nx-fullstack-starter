import { AuthGuard } from './auth.guard';
import { NotAuthGuard } from './not-auth.guard';

export * from './auth.guard';
export * from './not-auth.guard';

export const Guards = [AuthGuard, NotAuthGuard];
