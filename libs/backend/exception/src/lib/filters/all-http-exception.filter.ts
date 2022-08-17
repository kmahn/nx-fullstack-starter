import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ErrorCode, ErrorResponseDto, LoggingData } from '@starter/global-data';
import { createHttpException } from '../exceptions';

@Catch()
export class AllHttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // super.catch(exception, host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { message } = request.authInfo || {};

    if (message === 'jwt expired') {
      exception = createHttpException(HttpStatus.UNAUTHORIZED, {
        code: ErrorCode.ACCESS_TOKEN_EXPIRED,
      });
    } else if (message === 'No auth token') {
      exception = createHttpException(HttpStatus.UNAUTHORIZED, {
        code: ErrorCode.LOGIN_REQUIRED,
      });
    } else {
      exception = createHttpException(
        exception.status || exception.statusCode,
        exception.getResponse ? exception.getResponse() : exception
      );
    }

    const { user, body, method, url } = request;
    const responseBody: ErrorResponseDto = {
      ...exception.getResponse(),
      statusCode: exception.getStatus(),
    };

    const loggingData: LoggingData = { user, body, response: responseBody };
    const msg = `${method} ${url}\n\t${this._toJson(loggingData)}`;
    Logger.error(msg);
    Logger.debug(exception);

    response.status(exception.status).json(responseBody);
  }

  private _toJson(loggingData: LoggingData): string {
    Object.keys(loggingData).forEach(key => {
      if (loggingData[key] === undefined) delete loggingData[key];
    });
    return JSON.stringify(loggingData);
  }
}
