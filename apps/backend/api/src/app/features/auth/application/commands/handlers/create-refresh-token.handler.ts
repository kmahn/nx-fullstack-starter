import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LoginInfoAggregate, LoginInfoRepository } from '../../../domain';
import { CreateRefreshTokenCommand } from '../impl';

@CommandHandler(CreateRefreshTokenCommand)
export class CreateRefreshTokenHandler implements ICommandHandler<CreateRefreshTokenCommand> {
  constructor(
    // private loginInfoRepository: LoginInfoRepository,
    private publisher: EventPublisher,
  ) {
  }

  async execute(command: CreateRefreshTokenCommand): Promise<void> {
    // const { userId, refreshToken } = command;
    // const loginInfo = this.publisher.mergeObjectContext(
    //   new LoginInfoAggregate({ user: userId, refreshToken })
    // );
    // await this.loginInfoRepository.create(loginInfo);
    // loginInfo.created()

  }
}
