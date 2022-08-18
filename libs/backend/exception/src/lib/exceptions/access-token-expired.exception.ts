import { UnauthorizedException } from './base-exceptions';
import { ErrorCode } from '@starter/global-data';

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({ code: ErrorCode.ACCESS_TOKEN_EXPIRED });
  }
}
