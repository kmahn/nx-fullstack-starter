import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginInfoAggregate, LoginInfoRepository } from '../../../domain';
import { UpdateRefreshTokenCommand } from '../impl';

@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenHandler implements ICommandHandler<UpdateRefreshTokenCommand> {
  constructor(
    @Inject(LoginInfoRepository) private _loginInfoRepository: LoginInfoRepository
  ) {
  }

  async execute(command: UpdateRefreshTokenCommand): Promise<any> {
    const { oldRefreshToken, newRefreshToken } = command;
    const oldLoginInfoAggregate = await this._loginInfoRepository.findOne({ refreshToken: oldRefreshToken });
    if (!oldLoginInfoAggregate) return;

    delete oldLoginInfoAggregate._id;
    delete oldLoginInfoAggregate.createdAt;

    const newLoginInfoAggregate = new LoginInfoAggregate({
      ...oldLoginInfoAggregate,
      refreshToken: newRefreshToken,
    });

    await Promise.all([
      this._loginInfoRepository.deleteOne({ _id: oldLoginInfoAggregate._id }),
      this._loginInfoRepository.create(newLoginInfoAggregate)
    ]);
  }
}
