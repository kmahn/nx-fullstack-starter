import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BearerTokenService } from '@starter/backend/bearer-token';
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
import { CreateRefreshTokenCommand } from './commands';
import { FindUserQuery } from './queries';

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
    const command = new CreateRefreshTokenCommand(userId, refreshToken);
    await this._commandBus.execute(command);
    return { accessToken, refreshToken };
  }

  async validatePassword(email: string, password: string): Promise<UserProfile> {
    const user = await this._userRepository.findOne({ email });
    if (!user)
      throw new UserNotFoundException();
    if (!user.auth)
      throw new WithdrawnUserException();
    const auth = await this._authRepository.findById(user.auth);
    if (!auth?.validatePassword(password))
      throw new InvalidPasswordException();
    const { _id, role } = user;
    return { _id, role };
  }

  getMe(userId: string): Promise<GetMeResponseDto> {
    return this._queryBus.execute(new FindUserQuery({ _id: userId }));
  }

  refreshToken(token: string): Promise<RefreshTokenResponseDto> {
    return Promise.resolve(undefined);
  }

  async signup(dto: SignupRequestDto) {
    // await this._commandBus(new )
  }
}
