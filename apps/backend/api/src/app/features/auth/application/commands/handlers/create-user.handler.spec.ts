import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../domain';
import { CreateUserHandler } from './create-user.handler';

let handler: CreateUserHandler;
let repository: UserRepository;
let publisher: EventPublisher;

describe('CreateUserHandler', () => {

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        { provide: UserRepository, useValue: { create: jest.fn() } },
        CreateUserHandler
      ]
    }).compile();

    handler = module.get(CreateUserHandler);
    repository = module.get(UserRepository);
    publisher = module.get(EventPublisher);
  });

  afterEach(jest.restoreAllMocks);

  it('instance', () => {
    expect(handler).toBeDefined();
  });

  it('execute()', async () => {
    const commandStub: any = { email: '', name: '', password: '' };
    const repositorySpy = jest.spyOn(repository, 'create');
    const createdSpy = jest.fn();
    const commitSpy = jest.fn();
    const aggregateStub: any = { created: createdSpy, commit: commitSpy };
    const publisherSpy = jest.spyOn(publisher, 'mergeObjectContext')
      .mockReturnValue(aggregateStub);

    await handler.execute(commandStub);

    expect(publisherSpy).toBeCalledTimes(1);
    expect(repositorySpy).toBeCalledTimes(1);
    expect(repositorySpy).toBeCalledWith(aggregateStub);
    expect(createdSpy).toBeCalledTimes(1);
    expect(commitSpy).toBeCalledTimes(1);
  });
});
