import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BearerTokenService } from '@starter/backend/bearer-token';
import { UnauthorizedException } from '@starter/backend/exception';
import {
  GetMeResponseDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  SignupRequestDto,
  UserProfile
} from '@starter/global-data';
import { v4 as uuidV4 } from 'uuid';
import {
  AuthRepository,
  InvalidPasswordException,
  UserNotFoundException,
  UserRepository,
  WithdrawnUserException
} from '../domain';
import { EmailIsAlreadyRegisteredException } from '../domain/exceptions/email-is-already-registered.exception';
import { CreateRefreshTokenCommand, CreateUserCommand, UpdateRefreshTokenCommand } from './commands';
import { FindLoginInfoQuery, FindUserQuery } from './queries';
import { FindAuthQuery } from './queries/impl/find-auth.query';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepository) private _authRepository: AuthRepository,
    @Inject(UserRepository) private _userRepository: UserRepository,
    private _commandBus: CommandBus,
    private _queryBus: QueryBus,
    private _bearerTokenService: BearerTokenService,
  ) {
  }

  async createAuthTokens(user: UserProfile): Promise<LoginResponseDto> {
    const { _id: userId } = user;
    const accessToken = this._bearerTokenService.sign(user);
    const refreshToken = uuidV4();
    await this._commandBus.execute(new CreateRefreshTokenCommand(userId, refreshToken));
    return { accessToken, refreshToken };
  }

  async validatePassword(email: string, password: string): Promise<UserProfile> {
    const userAggregate = await this._queryBus.execute(new FindUserQuery({ email }));
    if (!userAggregate)
      throw new UserNotFoundException();
    if (!userAggregate.auth)
      throw new WithdrawnUserException();

    const authAggregate = await this._queryBus.execute(new FindAuthQuery({ _id: userAggregate.auth }));
    if (!authAggregate?.validatePassword(password))
      throw new InvalidPasswordException();
    const { _id, role } = userAggregate;
    return { _id, role };
  }

  async getMe(userId: string): Promise<GetMeResponseDto> {
    const user = await this._queryBus.execute(new FindUserQuery({ _id: userId }));
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    const loginInfoAggregate = await this._queryBus.execute(new FindLoginInfoQuery({ refreshToken }));
    if (!loginInfoAggregate) throw new UnauthorizedException();
    const { user } = loginInfoAggregate;
    const userAggregate = await this._queryBus.execute(new FindUserQuery({ _id: user }));
    const { _id, role } = userAggregate;
    const newRefreshToken = uuidV4();
    const newAccessToken = this._bearerTokenService.sign({ _id, role });
    await this._commandBus.execute(new UpdateRefreshTokenCommand(refreshToken, newRefreshToken));
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async signup(dto: SignupRequestDto) {
    const { email } = dto;
    const userAggregate = await this._queryBus.execute(new FindUserQuery({ email }));
    if (!!userAggregate) throw new EmailIsAlreadyRegisteredException();
    await this._commandBus.execute(new CreateUserCommand(dto));
  }
}
