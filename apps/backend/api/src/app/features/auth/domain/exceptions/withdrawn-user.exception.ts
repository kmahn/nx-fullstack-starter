import { ForbiddenException } from '@starter/backend/exception';
import { ErrorCode } from '@starter/global-data';

export class WithdrawnUserException extends ForbiddenException {
  constructor() {
    super({code: ErrorCode.WITHDRAWN_USER});
  }
}
