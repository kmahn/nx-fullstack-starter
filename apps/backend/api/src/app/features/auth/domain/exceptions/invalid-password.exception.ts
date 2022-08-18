import { BadRequestException } from '@starter/backend/exception';
import { ErrorCode } from '@starter/global-data';

export class InvalidPasswordException extends BadRequestException {
  constructor() {
    super({ code: ErrorCode.INVALID_PASSWORD });
  }
}
