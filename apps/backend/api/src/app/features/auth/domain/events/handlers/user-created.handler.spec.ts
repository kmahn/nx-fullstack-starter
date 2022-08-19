import { DynamicModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeMongooseTestingServer,
  createMongooseTestingModules, removeAll,
  startMongooseTestingServer
} from '@starter/backend-mongo-database';
import { AuthRepository, Repositories, UserRepository } from '../../repositories';
import { UserCreatedHandler } from './user-created.handler';

describe('UserCreatedHandler', () => {
  let handler: UserCreatedHandler;
  let authRepository: AuthRepository;
  let userRepository: UserRepository;
  let MongooseModules: DynamicModule[];

  beforeAll(async () => {
    await startMongooseTestingServer();
    MongooseModules = createMongooseTestingModules();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        ...MongooseModules
      ],
      providers: [
        UserCreatedHandler,
        ...Repositories,
      ],
    }).compile();

    handler = module.get(UserCreatedHandler);
    authRepository = module.get(AuthRepository);
    userRepository = module.get(UserRepository);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await removeAll();
  });

  afterAll(async () => {
    await closeMongooseTestingServer();
  });

  it('인스턴스 생성', () => {
    expect(handler).toBeDefined();
  });
});
