import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserAggregate, UserRepository } from '../../../domain';
import { CreateUserCommand } from '../impl';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(UserRepository) private _userRepository: UserRepository,
    private _publisher: EventPublisher,
  ) {
  }

  async execute(command: CreateUserCommand): Promise<any> {
    const userAggregate = this._publisher.mergeObjectContext(
      new UserAggregate(command)
    );
    await this._userRepository.create(userAggregate);
    userAggregate.created();
    userAggregate.commit();
  }
}
