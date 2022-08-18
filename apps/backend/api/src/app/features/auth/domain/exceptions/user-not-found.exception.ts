import { NotFoundException } from '@starter/backend/exception';
import { ErrorCode } from '@starter/global-data';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super({ code: ErrorCode.USER_NOT_FOUND });
  }
}
