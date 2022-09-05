import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginInfoAggregate, LoginInfoRepository } from '../../../domain';
import { FindLoginInfoQuery } from '../impl';
import { FindLoginInfoHandler } from './find-login-info.handler';

let handler: FindLoginInfoHandler;
let loginInfoRepository: LoginInfoRepository;

describe('FindLoginInfoHandler', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        { provide: LoginInfoRepository, useValue: { findOne: jest.fn() } },
        FindLoginInfoHandler,
      ]
    }).compile();

    handler = module.get(FindLoginInfoHandler);
    loginInfoRepository = module.get(LoginInfoRepository);
  });
  afterEach(jest.restoreAllMocks);

  it('instance', () => {
    expect(handler).toBeDefined();
  });

  it('handle()', async () => {
    const refreshTokenStub = 'refresh token';
    const filterStub = { refreshToken: refreshTokenStub };
    const loginInfoStub = { _id: 'id', refreshToken: refreshTokenStub, createdAt: new Date() };
    const loginInfoAggregateStub = new LoginInfoAggregate(loginInfoStub);
    const queryStub = new FindLoginInfoQuery(filterStub);
    const findOneSpy = jest.spyOn(loginInfoRepository, 'findOne')
      .mockResolvedValue(loginInfoAggregateStub);

    const result = await handler.handle(queryStub);

    expect(findOneSpy).toBeCalledTimes(1);
    expect(findOneSpy).toBeCalledWith(filterStub);
    expect(result).toEqual(loginInfoAggregateStub);

  });
});
