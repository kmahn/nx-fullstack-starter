import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginInfoRepository } from '../../../domain';
import { CreateRefreshTokenHandler } from './create-refresh-token.handler';

let handler: CreateRefreshTokenHandler;
let repository: LoginInfoRepository;
let publisher: EventPublisher;

describe('CreateRefreshTokenHandler', () => {

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        { provide: LoginInfoRepository, useValue: { create: jest.fn() } },
        CreateRefreshTokenHandler,
      ]
    }).compile();

    handler = module.get(CreateRefreshTokenHandler);
    repository = module.get(LoginInfoRepository);
    publisher = module.get(EventPublisher);
  });

  afterEach(jest.restoreAllMocks);

  it('instance', () => {
    expect(handler).toBeDefined();
  });

  it('execute()', async () => {
    const commandStub = { userId: '', refreshToken: '' };
    const repositorySpy = jest.spyOn(repository, 'create');
    const createdSpy = jest.fn();
    const commitSpy = jest.fn();
    const aggregateStub: any = { created: createdSpy, commit: commitSpy, };
    const publisherSpy = jest.spyOn(publisher, 'mergeObjectContext')
      .mockReturnValue(aggregateStub);


    await handler.execute(commandStub);

    expect(repositorySpy).toBeCalledTimes(1);
    expect(repositorySpy).toBeCalledWith(aggregateStub);
    expect(publisherSpy).toBeCalledTimes(1);
    expect(createdSpy).toBeCalledTimes(1);
    expect(commitSpy).toBeCalledTimes(1);
  });
});
