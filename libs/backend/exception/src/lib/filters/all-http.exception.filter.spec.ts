import { HttpStatus, Logger } from '@nestjs/common';
import { AllHttpExceptionFilter, createHttpException } from '@starter/backend/exception';
import { ErrorCode } from '@starter/global-data';

let filter: AllHttpExceptionFilter;
let mockHost: any;
let statusSpy: any;
let jsonSpy: any;
let logSpy: any;

function initMock(request: any) {
  statusSpy = jest.fn().mockReturnThis();
  jsonSpy = jest.fn();
  mockHost = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnValue(request),
    getResponse: jest.fn().mockReturnValue({
      status: statusSpy,
      json: jsonSpy,
    }),
  };
}

describe('AllHttpExceptionFilter', () => {
  beforeEach(() => {
    filter = new AllHttpExceptionFilter();
    logSpy = jest.spyOn(Logger, 'error');
  });
  afterEach(jest.restoreAllMocks);

  it('인스턴스 생성', () => {
    expect(filter).toBeDefined();
  });

  describe('catch()', () => {

    it('body + user', () => {
      const method = 'POST';
      const url = '/forbidden';
      const user = { _id: 'user id', role: 'member' };
      const body = { value: 'mock body' };
      const statusCode = HttpStatus.FORBIDDEN;
      const code = ErrorCode.FORBIDDEN;
      const exception = createHttpException(statusCode, { code });
      const response = { ...exception.getResponse(), statusCode };
      const loggingData = { user, body, response };
      const msg = `${method} ${url}\n\t${JSON.stringify(loggingData)}`;
      initMock({ method, url, user, body });

      filter.catch(exception, mockHost);

      expect(logSpy).toBeCalledTimes(1);
      expect(statusSpy).toBeCalledTimes(1);
      expect(jsonSpy).toBeCalledTimes(1);
      expect(logSpy).toBeCalledWith(msg);
      expect(statusSpy).toBeCalledWith(statusCode);
      expect(jsonSpy).toBeCalledWith(response);
    });

    it('형식이 다른 에러', () => {
      const method = 'POST';
      const url = '/not-found';
      const user = { _id: 'user id', role: 'member' };
      const body = { value: 'mock body' };
      const statusCode = HttpStatus.NOT_FOUND;
      const ex = { status: statusCode, message: 'NOT FOUND' };
      const exception = createHttpException(statusCode, ex);
      const response = { ...exception.getResponse(), statusCode };
      const loggingData = { user, body, response };
      const msg = `${method} ${url}\n\t${JSON.stringify(loggingData)}`;
      initMock({ method, url, user, body });

      filter.catch(ex, mockHost);

      expect(logSpy).toBeCalledTimes(1);
      expect(statusSpy).toBeCalledTimes(1);
      expect(jsonSpy).toBeCalledTimes(1);
      expect(logSpy).toBeCalledWith(msg);
      expect(statusSpy).toBeCalledWith(statusCode);
      expect(jsonSpy).toBeCalledWith(response);
    });

    it('액세스 토큰 만료', () => {
      const method = 'GET';
      const url = '/';
      const authInfo = { message: 'jwt expired' };
      const statusCode = HttpStatus.UNAUTHORIZED;
      const code = ErrorCode.ACCESS_TOKEN_EXPIRED;
      const exception = createHttpException(statusCode, { code });
      const response = { ...exception.getResponse(), statusCode };
      const loggingData = { response };
      const msg = `${method} ${url}\n\t${JSON.stringify(loggingData)}`
      initMock({ method, url, authInfo });

      filter.catch({}, mockHost);

      expect(logSpy).toBeCalledTimes(1);
      expect(statusSpy).toBeCalledTimes(1);
      expect(jsonSpy).toBeCalledTimes(1);
      expect(logSpy).toBeCalledWith(msg);
      expect(statusSpy).toBeCalledWith(statusCode);
      expect(jsonSpy).toBeCalledWith(response);
    });

    it('액세스 토큰이 없는 경우', () => {
      const method = 'GET';
      const url = '/';
      const authInfo = { message: 'No auth token' };
      const statusCode = HttpStatus.UNAUTHORIZED;
      const code = ErrorCode.LOGIN_REQUIRED;
      const exception = createHttpException(statusCode, { code });
      const response = {
        ...exception.getResponse(),
        statusCode: exception.getStatus(),
      };
      const loggingData = { response };
      const msg = `${method} ${url}\n\t${JSON.stringify(loggingData)}`
      initMock({ method, url, authInfo });

      filter.catch({}, mockHost);

      expect(logSpy).toBeCalledTimes(1);
      expect(statusSpy).toBeCalledTimes(1);
      expect(jsonSpy).toBeCalledTimes(1);
      expect(logSpy).toBeCalledWith(msg);
      expect(statusSpy).toBeCalledWith(statusCode);
      expect(jsonSpy).toBeCalledWith(response);
    });
  });
});
