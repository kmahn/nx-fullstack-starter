import { HttpException as NestHttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorResponseDto } from '@starter/global-data';

export class HttpException extends NestHttpException {
  constructor(response: ErrorResponseDto) {
    super(response, response.statusCode);
  }

  getResponse: () => ErrorResponseDto;
}

export class BadGatewayException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.BAD_GATEWAY,
      ...response,
      statusCode: HttpStatus.BAD_GATEWAY,
    });
  }
}

export class BadRequestException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.BAD_REQUEST,
      ...response,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export class ConflictException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.CONFLICT,
      ...response,
      statusCode: HttpStatus.CONFLICT,
    });
  }
}

export class ForbiddenException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.FORBIDDEN,
      ...response,
      statusCode: HttpStatus.FORBIDDEN,
    });
  }
}

export class GatewayTimeoutException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.GATEWAY_TIMEOUT,
      ...response,
      statusCode: HttpStatus.GATEWAY_TIMEOUT,
    });
  }
}

export class GoneException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.GONE,
      ...response,
      statusCode: HttpStatus.GONE,
    });
  }
}

export class HttpVersionNotSupportedException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.HTTP_VERSION_NOT_SUPPORTED,
      ...response,
      statusCode: HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
    });
  }
}

export class ImATeapotException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.I_AM_A_TEAPOT,
      ...response,
      statusCode: HttpStatus.I_AM_A_TEAPOT,
    });
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      ...response,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.METHOD_NOT_ALLOWED,
      ...response,
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
    });
  }
}

export class NotAcceptableException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.NOT_ACCEPTABLE,
      ...response,
      statusCode: HttpStatus.NOT_ACCEPTABLE,
    });
  }
}

export class NotFoundException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.NOT_FOUND,
      ...response,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
}

export class NotImplementedException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.NOT_IMPLEMENTED,
      ...response,
      statusCode: HttpStatus.NOT_IMPLEMENTED,
    });
  }
}

export class PayloadTooLargeException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.PAYLOAD_TOO_LARGE,
      ...response,
      statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
    });
  }
}

export class PreconditionFailedException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.PRECONDITION_FAILED,
      ...response,
      statusCode: HttpStatus.PRECONDITION_FAILED,
    });
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.REQUEST_TIMEOUT,
      ...response,
      statusCode: HttpStatus.REQUEST_TIMEOUT,
    });
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.SERVICE_UNAVAILABLE,
      ...response,
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    });
  }
}

export class UnauthorizedException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.UNAUTHORIZED,
      ...response,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.UNPROCESSABLE_ENTITY,
      ...response,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
  }
}

export class UnsupportedMediaTypeException extends HttpException {
  constructor(response?: Partial<ErrorResponseDto>) {
    super({
      code: ErrorCode.UNSUPPORTED_MEDIA_TYPE,
      ...response,
      statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    });
  }
}

export function createHttpException(
  status: HttpStatus,
  response?: Partial<ErrorResponseDto>
): HttpException {
  switch (status) {
    case HttpStatus.BAD_GATEWAY:
      return new BadGatewayException(response);
    case HttpStatus.BAD_REQUEST:
      return new BadRequestException(response);
    case HttpStatus.CONFLICT:
      return new ConflictException(response);
    case HttpStatus.FORBIDDEN:
      return new ForbiddenException(response);
    case HttpStatus.GATEWAY_TIMEOUT:
      return new GatewayTimeoutException(response);
    case HttpStatus.GONE:
      return new GoneException(response);
    case HttpStatus.HTTP_VERSION_NOT_SUPPORTED:
      return new HttpVersionNotSupportedException(response);
    case HttpStatus.I_AM_A_TEAPOT:
      return new ImATeapotException(response);
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return new InternalServerErrorException(response);
    case HttpStatus.METHOD_NOT_ALLOWED:
      return new MethodNotAllowedException(response);
    case HttpStatus.NOT_ACCEPTABLE:
      return new NotAcceptableException(response);
    case HttpStatus.NOT_FOUND:
      return new NotFoundException(response);
    case HttpStatus.NOT_IMPLEMENTED:
      return new NotImplementedException(response);
    case HttpStatus.PAYLOAD_TOO_LARGE:
      return new PayloadTooLargeException(response);
    case HttpStatus.PRECONDITION_FAILED:
      return new PreconditionFailedException(response);
    case HttpStatus.REQUEST_TIMEOUT:
      return new RequestTimeoutException(response);
    case HttpStatus.SERVICE_UNAVAILABLE:
      return new ServiceUnavailableException(response);
    case HttpStatus.UNAUTHORIZED:
      return new UnauthorizedException(response);
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return new UnprocessableEntityException(response);
    case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
      return new UnsupportedMediaTypeException(response);
    default:
      throw new Error(`Status ${status} is not Http Exception Status`);
  }
}
