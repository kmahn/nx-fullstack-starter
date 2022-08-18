import { HttpStatus } from '@nestjs/common';
import { BearerTokenService } from '@starter/backend/bearer-token';
import { createHttpException } from '@starter/backend/exception';
import { ErrorCode, UserProfile } from '@starter/global-data';
import { AuthMiddleware } from './auth.middleware';

let middleware: AuthMiddleware;
let service: BearerTokenService;
let verifySpy: any;

describe('AuthMiddleware', () => {
  beforeEach(async () => {
    verifySpy = jest.fn();

    service = {
      verify: verifySpy,
    } as BearerTokenService;

    middleware = new AuthMiddleware(service);
  });

  afterEach(jest.restoreAllMocks);

  it('인스턴스 생성', () => {
    expect(middleware).toBeDefined();
  });

  describe('use()', () => {
    it('유효한 액세스 토큰일 경우', () => {
      const mockProfile: UserProfile = { _id: 'user id', role: 'member' };
      const verifySpy = jest.spyOn(service, 'verify');
      const req: any = { headers: { authorization: 'Bearer test.token' } };
      const nextSpy = jest.fn();
      verifySpy.mockReturnValue(mockProfile);

      middleware.use(req, {}, nextSpy);

      expect(req.user).toEqual(mockProfile);
      expect(nextSpy).toBeCalledTimes(1);
      expect(nextSpy).toBeCalledWith();
    });

    it('유효하지 않은 액세스 토큰일 경우', () => {
      const mockError = createHttpException(HttpStatus.UNAUTHORIZED, {
        code: ErrorCode.LOGIN_REQUIRED,
      });
      const req: any = { headers: { authorization: 'Bearer test.token' } };
      const nextSpy = jest.fn();
      verifySpy.mockImplementation(() => {
        throw mockError;
      });

      middleware.use(req, {}, nextSpy);

      expect(req.user).toBeUndefined();
      expect(nextSpy).toBeCalledTimes(1);
      expect(nextSpy).toBeCalledWith();
    });
  });
});
