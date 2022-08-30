import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository, UserRepository } from '../../repositories';
import { UserCreatedEvent } from '../impl';
import { UserCreatedHandler } from './user-created.handler';

describe('UserCreatedHandler', () => {
  let handler: UserCreatedHandler;
  let authRepository: AuthRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        { provide: AuthRepository, useValue: { create: jest.fn() } },
        { provide: UserRepository, useValue: { updateOne: jest.fn() } },
        UserCreatedHandler,
      ],
    }).compile();

    handler = module.get(UserCreatedHandler);
    authRepository = module.get(AuthRepository);
    userRepository = module.get(UserRepository);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  it('instance', () => {
    expect(handler).toBeDefined();
  });

  it('handle()', async () => {
    const userId = 'user id';
    const password = 'password';
    const eventStub: UserCreatedEvent = { userId, password };

  });
});
