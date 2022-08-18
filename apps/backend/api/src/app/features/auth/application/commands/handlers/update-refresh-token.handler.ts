import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginInfoRepository } from '../../../domain';
import { UpdateRefreshTokenCommand } from '../impl/update-refresh-token.command';

@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenHandler implements ICommandHandler<UpdateRefreshTokenCommand> {
  constructor(
    private loginInfoRepository: LoginInfoRepository
  ) {
  }

  async execute(command: UpdateRefreshTokenCommand): Promise<any> {
    const { oldRefreshToken, newRefreshToken } = command;
    await this.loginInfoRepository.patchRefreshToken(oldRefreshToken, newRefreshToken);
  }
}
