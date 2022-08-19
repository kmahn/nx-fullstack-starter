import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BackendBearerTokenModule } from '@starter/backend/bearer-token';
import { UserProfile } from '@starter/global-data';
import { AuthRepository, LoginInfoRepository, UserRepository } from '../domain';
import { AuthService } from './auth.service';
import { CommandHandlers, CreateRefreshTokenCommand } from './commands';
import { QueryHandlers } from './queries';
// import * as uuid from 'uuid';

// jest.mock('uuid');
jest.mock('./commands');

let service: AuthService;
let commandBus: CommandBus;
let queryBus: QueryBus;
// let bearerTokenService: BearerTokenService;

describe('AuthService', () => {

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        BackendBearerTokenModule
      ],
      providers: [
        { provide: UserRepository, useValue: {} },
        { provide: AuthRepository, useValue: {} },
        { provide: LoginInfoRepository, useValue: {} },
        ...CommandHandlers,
        ...QueryHandlers,
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
    // bearerTokenService = module.get(BearerTokenService);
  });

  // afterEach(jest.restoreAllMocks);

  it('instance', () => {
    expect(service).toBeDefined();
  });

  it('createAuthTokens()', async () => {
    const userProfile: UserProfile = { _id: 'user id', role: 'member' };
    const commandStub = {};
    // const uuidSpy = jest.spyOn(uuid, 'v4');
    commandBus.execute = jest.fn();
    (CreateRefreshTokenCommand as any).mockReturnValue(commandStub);

    await service.createAuthTokens(userProfile);

    expect(CreateRefreshTokenCommand).toBeCalledTimes(1);

  });
});
