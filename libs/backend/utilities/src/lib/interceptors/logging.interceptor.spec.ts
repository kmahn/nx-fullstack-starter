import { Logger } from '@nestjs/common';
import { of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

let interceptor: LoggingInterceptor;
let context: any;
let next: any;
let dateSpy: any;
let logSpy: any;

function initSpies() {
  logSpy = jest.spyOn(Logger, 'log');
  dateSpy = jest.spyOn(Date, 'now');
  context = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnThis(),
  };
  next = {
    handle: jest.fn(),
  };
}

function setReturnValueOfDateSpy(start, end) {
  dateSpy
    .mockReturnValueOnce(start)
    .mockReturnValue(end);
}

function setReturnValueOfRequestSpy(req: any) {
  (context.switchToHttp().getRequest as jest.Mock<any, any>).mockReturnValue(req);
}

function setReturnValueOfNextHandleSpy(data: any) {
  next.handle.mockReturnValue(of(data));
}

function expectLogToBeCalledWith(message) {
  expect(logSpy).toBeCalledTimes(1);
  expect(logSpy).toBeCalledWith(message);
}

describe('LoggingInterceptor', () => {
  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    initSpies();
  });

  afterEach(() => jest.restoreAllMocks());

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept()', () => {
    it('method + url', () => {
      const method = 'GET';
      const url = '/';
      const response = 'mock data';
      const [start, end] = [1, 2];
      const time = end - start;
      setReturnValueOfDateSpy(start, end);
      setReturnValueOfRequestSpy({ url, method });
      setReturnValueOfNextHandleSpy(response);

      interceptor.intercept(context, next).subscribe();

      const loggingData = { response, time };
      const msg = `${method} ${url} ::: ${time}ms\n\t${JSON.stringify(loggingData)}`;
      expectLogToBeCalledWith(msg);
    });

    it('method + url + body', () => {
      const method = 'POST';
      const url = '/';
      const body = { value: 'mock body value' };
      const response = { value: 'mock response value' };
      const [start, end] = [2, 5];
      const time = end - start;
      setReturnValueOfDateSpy(start, end);
      setReturnValueOfRequestSpy({ url, method, body });
      setReturnValueOfNextHandleSpy(response);

      interceptor.intercept(context, next).subscribe();

      const loggingData = { body, response, time }
      const msg = `${method} ${url} ::: ${time}ms\n\t${JSON.stringify(loggingData)}`;
      expectLogToBeCalledWith(msg);
    });

    it('method + url + user', () => {
      const method = 'PUT';
      const url = '/update';
      const user = { _id: 'user id', role: 'admin' };
      const [start, end] = [2, 5];
      const time = end - start;
      const response = null;
      setReturnValueOfDateSpy(start, end);
      setReturnValueOfRequestSpy({ url, method, user });
      setReturnValueOfNextHandleSpy(response);

      interceptor.intercept(context, next).subscribe();

      const loggingData = { user, response, time };
      const msg = `${method} ${url} ::: ${time}ms\n\t${JSON.stringify(loggingData)}`;
      expectLogToBeCalledWith(msg);
    });

    it('method + url + body + user', () => {
      const method = 'PUT';
      const url = '/update';
      const body = { value: 'mock body value' };
      const user = { _id: 'user id', role: 'admin' };
      const response = { value: 'mock response value' };
      const [start, end] = [2, 5];
      const time = end - start;
      setReturnValueOfDateSpy(start, end);
      setReturnValueOfRequestSpy({ url, method, body, user });
      setReturnValueOfNextHandleSpy(response);

      interceptor.intercept(context, next).subscribe();

      const loggingData = { user, body, response, time };
      const msg = `${method} ${url} ::: ${time}ms\n\t${JSON.stringify(loggingData)}`;
      expectLogToBeCalledWith(msg);
    });
  });
});
