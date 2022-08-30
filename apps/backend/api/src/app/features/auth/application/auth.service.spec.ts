import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BearerTokenService } from '@starter/backend/bearer-token';
import { UnauthorizedException } from '@starter/backend/exception';
import { SignupRequestDto, UserProfile, UserRoleType } from '@starter/global-data';
import * as uuid from 'uuid';
import {
  AuthAggregate,
  AuthRepository,
  InvalidPasswordException,
  LoginInfoAggregate,
  LoginInfoRepository,
  UserAggregate,
  UserNotFoundException,
  UserRepository,
  WithdrawnUserException
} from '../domain';
import { EmailIsAlreadyRegisteredException } from '../domain/exceptions/email-is-already-registered.exception';
import { AuthService } from './auth.service';
import { CommandHandlers, CreateRefreshTokenCommand, UpdateRefreshTokenCommand } from './commands';
import { FindLoginInfoQuery, FindUserQuery, QueryHandlers } from './queries';

jest.mock('uuid');

let service: AuthService;
let commandBus: CommandBus;
let queryBus: QueryBus;
let bearerTokenService: BearerTokenService;
let userRepository: UserRepository;
let authRepository: AuthRepository;
let loginInfoRepository: LoginInfoRepository;

describe('AuthService', () => {

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
      ],
      providers: [
        {
          provide: UserRepository,
          useValue: { findOne: jest.fn() }
        },
        {
          provide: AuthRepository,
          useValue: { findById: jest.fn() }
        },
        {
          provide: LoginInfoRepository,
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
          }
        },
        {
          provide: BearerTokenService,
          useValue: {
            sign: jest.fn()
          }
        },
        ...CommandHandlers,
        ...QueryHandlers,
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    commandBus = module.get(CommandBus);
    bearerTokenService = module.get(BearerTokenService);
    queryBus = module.get(QueryBus);
    commandBus = module.get(CommandBus);
    userRepository = module.get(UserRepository);
    authRepository = module.get(AuthRepository);
    loginInfoRepository = module.get(LoginInfoRepository);
  });

  afterEach(jest.restoreAllMocks);


  it('instance', () => {
    expect(service).toBeDefined();
  });

  it('createAuthTokens()', async () => {
    const refreshTokenStub = 'refresh token';
    const accessTokenStub = 'access token';
    const userIdStub = 'user id';
    const roleStub = 'member';
    const userStub: UserProfile = { _id: userIdStub, role: roleStub };
    const commandStub: CreateRefreshTokenCommand = new CreateRefreshTokenCommand(userIdStub, refreshTokenStub);
    const commandBusSpy = commandBus.execute = jest.fn();
    jest.spyOn(uuid, 'v4')
      .mockReturnValue(refreshTokenStub);
    jest.spyOn(bearerTokenService, 'sign')
      .mockReturnValue(accessTokenStub);

    const result = await service.createAuthTokens(userStub);

    expect(commandBusSpy).toBeCalledTimes(1);
    expect(commandBusSpy).toBeCalledWith(commandStub);
    expect(result).toEqual({ accessToken: accessTokenStub, refreshToken: refreshTokenStub });
  });

  describe('validatePassword()', () => {
    const emailStub = 'test@test.com';
    const passwordStub = 'password';

    it('user not found', async () => {
      queryBus.execute = jest.fn().mockResolvedValue(null);

      await expect(() => service.validatePassword(emailStub, passwordStub))
        .rejects.toThrow(UserNotFoundException);
    });

    it('withdrawn user', async () => {
      const userStub = { email: emailStub, name: 'name' };
      const userAggregateStub = new UserAggregate(userStub);
      queryBus.execute = jest.fn().mockResolvedValue(userAggregateStub);

      await expect(() => service.validatePassword(emailStub, passwordStub))
        .rejects.toThrow(WithdrawnUserException);
    });

    it('invalid password', async () => {
      const authIdStub = 'auth id';
      const userStub = { email: emailStub, name: 'name', auth: authIdStub };
      const authStub = { validatePassword: jest.fn() };
      const validatePasswordSpy = jest.spyOn(authStub, 'validatePassword')
        .mockReturnValue(false);
      const userAggregateStub = new UserAggregate(userStub);
      const authAggregateStub = new AuthAggregate(authStub);

      queryBus.execute = jest.fn()
        .mockResolvedValueOnce(userAggregateStub)
        .mockResolvedValueOnce(authAggregateStub);

      await expect(() => service.validatePassword(emailStub, passwordStub))
        .rejects.toThrow(InvalidPasswordException);

      expect(validatePasswordSpy).toBeCalledWith(passwordStub);
    });

    it('valid password', async () => {
      const userIdStub = 'user id';
      const roleStub: UserRoleType = 'member';
      const authIdStub = 'auth id';
      const userStub = { _id: userIdStub, role: roleStub, email: emailStub, name: 'name', auth: authIdStub };
      const authStub = { validatePassword: jest.fn() };
      const userAggregateStub = new UserAggregate(userStub);
      const authAggregateStub = new AuthAggregate(authStub);
      jest.spyOn(authStub, 'validatePassword')
        .mockReturnValue(true);
      queryBus.execute = jest.fn()
        .mockResolvedValueOnce(userAggregateStub)
        .mockResolvedValueOnce(authAggregateStub);

      const result = await service.validatePassword(emailStub, passwordStub);

      expect(result).toEqual({ _id: userIdStub, role: roleStub });
    });
  });

  describe('getMe()', () => {
    it('user not found', async () => {
      const userIdStub = 'user id';
      const queryBusSpy = jest.spyOn(queryBus, 'execute')
        .mockResolvedValue(null);
      const queryStub = new FindUserQuery({ _id: userIdStub });

      await expect(() => service.getMe(userIdStub)).rejects.toThrow(UserNotFoundException);
      expect(queryBusSpy).toBeCalledTimes(1);
      expect(queryBusSpy).toBeCalledWith(queryStub);
    });

    it('user found', async () => {
      const userIdStub = 'user id';
      const userStub = {
        _id: userIdStub,
        email: 'test@test.com',
        name: 'name',
      };

      jest.spyOn(queryBus, 'execute')
        .mockResolvedValue(userStub);

      const result = await service.getMe(userIdStub);

      expect(result).toEqual(userStub);
    });
  });

  describe('refreshToken()', () => {
    it('invalid refresh token', async () => {
      const refreshTokenStub = 'invalid refresh token';
      const queryBusSpy = jest.spyOn(queryBus, 'execute')
        .mockResolvedValue(null);
      const queryStub = new FindLoginInfoQuery({ refreshToken: refreshTokenStub });

      await expect(() => service.refreshToken(refreshTokenStub)).rejects.toThrow(UnauthorizedException);
      expect(queryBusSpy).toBeCalledTimes(1);
      expect(queryBusSpy).toBeCalledWith(queryStub);
    });

    it('valid refresh token', async () => {
      const userIdStub = 'user id';
      const roleStub = 'member';
      const oldRefreshTokenStub = 'old refresh token';
      const newAccessTokenStub = 'new access token';
      const newRefreshTokenStub = 'new refresh token';
      const loginInfoAggregateStub = new LoginInfoAggregate({
        _id: 'id',
        refreshToken: oldRefreshTokenStub,
        user: userIdStub
      });
      const userAggregateStub = new UserAggregate({
        _id: userIdStub,
        role: roleStub,
        email: 'test@test.com',
        name: 'name',
      });

      const commandBusSpy = commandBus.execute = jest.fn();
      const updateRefreshTokenCommandStub = new UpdateRefreshTokenCommand(oldRefreshTokenStub, newRefreshTokenStub);
      const queryBusSpy = jest.spyOn(queryBus, 'execute')
        .mockResolvedValueOnce(loginInfoAggregateStub)
        .mockResolvedValueOnce(userAggregateStub);
      const bearerSignSpy = jest.spyOn(bearerTokenService, 'sign')
        .mockReturnValue(newAccessTokenStub);
      jest.spyOn(uuid, 'v4')
        .mockReturnValueOnce(newRefreshTokenStub);

      const result = await service.refreshToken(oldRefreshTokenStub);

      expect(queryBusSpy).toBeCalledTimes(2);
      expect(queryBusSpy).toHaveBeenNthCalledWith(1, new FindLoginInfoQuery({ refreshToken: oldRefreshTokenStub }));
      expect(queryBusSpy).toHaveBeenNthCalledWith(2, new FindUserQuery({ _id: userIdStub }));
      expect(bearerSignSpy).toBeCalledTimes(1);
      expect(bearerSignSpy).toBeCalledWith({ _id: userIdStub, role: roleStub });
      expect(commandBusSpy).toBeCalledTimes(1);
      expect(commandBusSpy).toBeCalledWith(updateRefreshTokenCommandStub);
      expect(result).toEqual({ accessToken: newAccessTokenStub, refreshToken: newRefreshTokenStub });
    });
  });

  describe('signup()', () => {
    it('email is already registered', async () => {
      const emailStub = 'test@test.com';
      const dtoStub: SignupRequestDto = {
        email: emailStub,
        name: 'name',
        password: 'password'
      };
      const userAggregateStub = new UserAggregate(dtoStub);
      queryBus.execute = jest.fn().mockResolvedValue(userAggregateStub);

      await expect(() => service.signup(dtoStub)).rejects.toThrow(EmailIsAlreadyRegisteredException);
    });

    it('valid dto', async () => {
      const emailStub = 'test@test.com';
      const dtoStub: SignupRequestDto = {
        email: emailStub,
        name: 'name',
        password: 'password'
      };
      const commandBusSpy = commandBus.execute = jest.fn();
      queryBus.execute = jest.fn().mockResolvedValue(null);

      await service.signup(dtoStub);

      expect(commandBusSpy).toBeCalledTimes(1);
      expect(commandBusSpy).toBeCalledWith(dtoStub);
    });
  });
});
