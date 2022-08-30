import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginInfoAggregate, LoginInfoRepository } from '../../../domain';
import { UpdateRefreshTokenCommand } from '../impl';
import { UpdateRefreshTokenHandler } from './update-refresh-token.handler';

let handler: UpdateRefreshTokenHandler;
let repository: LoginInfoRepository;

describe('UpdateRefreshTokenHandler', () => {

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: LoginInfoRepository,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
          }
        },
        UpdateRefreshTokenHandler,
      ]
    }).compile();

    handler = module.get(UpdateRefreshTokenHandler);
    repository = module.get(LoginInfoRepository);
  });

  afterEach(jest.restoreAllMocks);

  it('instance', () => {
    expect(handler).toBeDefined();
  });

  it('execute()', async () => {
    const oldRefreshTokenStub = 'old refresh token';
    const userIdStub = 'user id';
    const oldLoginInfoStub = new LoginInfoAggregate({
      refreshToken: oldRefreshTokenStub,
      user: userIdStub,
    });

    const newRefreshTokenStub = 'new refresh token';

    const command = new UpdateRefreshTokenCommand(oldRefreshTokenStub, newRefreshTokenStub);
    let findOneSpy = jest.spyOn(repository, 'findOne')
      .mockResolvedValue(oldLoginInfoStub);

    let createSpy = jest.spyOn(repository, 'create');
    let deleteOneSpy = jest.spyOn(repository, 'deleteOne');

    await handler.execute(command);

    expect(findOneSpy).toBeCalledTimes(1);
    expect(findOneSpy).toBeCalledWith({ refreshToken: oldRefreshTokenStub });
    expect(createSpy).toBeCalledTimes(1);
    expect(createSpy).toBeCalledWith(expect.objectContaining({
      refreshToken: newRefreshTokenStub,
      user: userIdStub,
    }));
    expect(deleteOneSpy).toBeCalledTimes(1);
    expect(deleteOneSpy).toBeCalledWith({ _id: oldLoginInfoStub._id });
  });
});
