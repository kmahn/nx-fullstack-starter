import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AuthAggregate } from '../../aggregates';
import { AuthRepository, UserRepository } from '../../repositories';
import { UserCreatedEvent } from '../impl';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {
  }

  async handle(event: UserCreatedEvent): Promise<void> {
    const { userId: user, password } = event;
    const auth = new AuthAggregate({ user, password });
    await Promise.all([
      this.authRepository.create(auth),
      this.userRepository.updateOne(user, { auth: auth._id })
    ]);
  }
}
