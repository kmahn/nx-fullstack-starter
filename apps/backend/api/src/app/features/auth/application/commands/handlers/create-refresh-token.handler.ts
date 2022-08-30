import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LoginInfoAggregate, LoginInfoRepository } from '../../../domain';
import { CreateRefreshTokenCommand } from '../impl';

@CommandHandler(CreateRefreshTokenCommand)
export class CreateRefreshTokenHandler implements ICommandHandler<CreateRefreshTokenCommand> {
  constructor(
    @Inject(LoginInfoRepository) private _loginInfoRepository: LoginInfoRepository,
    private _publisher: EventPublisher,
  ) {
  }

  async execute(command: CreateRefreshTokenCommand): Promise<void> {
    const { userId, refreshToken } = command;
    const aggregateParam = { user: userId, refreshToken };
    const loginInfoAggregate = this._publisher.mergeObjectContext(
      new LoginInfoAggregate(aggregateParam)
    );
    await this._loginInfoRepository.create(loginInfoAggregate);
    loginInfoAggregate.created();
    loginInfoAggregate.commit();
  }
}
