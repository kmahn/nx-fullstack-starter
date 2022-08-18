import { UnauthorizedException } from './base-exceptions';
import { ErrorCode } from '@starter/global-data';

export class LoginRequiredException extends UnauthorizedException {
  constructor() {
    super({ code: ErrorCode.LOGIN_REQUIRED });
  }
}
