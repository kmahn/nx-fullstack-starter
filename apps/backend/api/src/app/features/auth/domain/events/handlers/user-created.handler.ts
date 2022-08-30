import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AuthAggregate } from '../../aggregates';
import { AuthRepository, UserRepository } from '../../repositories';
import { UserCreatedEvent } from '../impl';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @Inject(AuthRepository) private _authRepository: AuthRepository,
    @Inject(UserRepository) private _userRepository: UserRepository,
  ) {
  }

  async handle(event: UserCreatedEvent): Promise<void> {
    const { userId: user, password } = event;
    const auth = new AuthAggregate({ user, password });
    await Promise.all([
      this._authRepository.create(auth),
      this._userRepository.updateOne({ _id: user }, { auth: auth._id })
    ]);
  }
}
