import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository, LoginInfoRepository } from '../../../domain';
import { FindAuthQuery } from '../impl/find-auth.query';
import { FindAuthHandler } from './find-auth.handler';

let handler: FindAuthHandler;
let authRepository: LoginInfoRepository;

describe('FindAuthHandler', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        { provide: AuthRepository, useValue: { findOne: jest.fn() } },
        FindAuthHandler,
      ]
    }).compile();

    handler = module.get(FindAuthHandler);
    authRepository = module.get(AuthRepository);
  });
  afterEach(jest.restoreAllMocks);

  it('instance', () => {
    expect(handler).toBeDefined();
  });

  it('handle()', async () => {
    const _id = 'auth id';
    const query = new FindAuthQuery({ _id });
    const authStub: any = { _id, user: 'user id' };
    const repositorySpy = jest.spyOn(authRepository, 'findOne')
      .mockResolvedValue(authStub);

    const result = await handler.execute(query);

    expect(repositorySpy).toBeCalledTimes(1);
    expect(repositorySpy).toBeCalledWith(query.filter);
    expect(result).toEqual(authStub);
  });
});
