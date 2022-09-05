import { ConflictException } from '@starter/backend/exception';
import { ErrorCode } from '@starter/global-data';

export class EmailIsAlreadyRegisteredException extends ConflictException {
  constructor() {
    super({ code: ErrorCode.EMAIL_IS_ALREADY_REGISTERED });
  }
}
