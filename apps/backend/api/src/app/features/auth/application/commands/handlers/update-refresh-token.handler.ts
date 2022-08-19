import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginInfoRepository } from '../../../domain';
import { UpdateRefreshTokenCommand } from '../update-refresh-token.command';

@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenHandler implements ICommandHandler<UpdateRefreshTokenCommand> {
  constructor(
    @Inject(LoginInfoRepository) private _loginInfoRepository: LoginInfoRepository
  ) {
  }

  async execute(command: UpdateRefreshTokenCommand): Promise<any> {
    const { oldRefreshToken, newRefreshToken } = command;
    await this._loginInfoRepository.updateRefreshToken(oldRefreshToken, newRefreshToken);
  }
}
