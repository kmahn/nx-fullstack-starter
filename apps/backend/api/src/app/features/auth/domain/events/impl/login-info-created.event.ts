import { IEvent } from '@nestjs/cqrs';

export class LoginInfoCreatedEvent implements IEvent {
  constructor(
    public readonly id: string,
  ) {
  }
}
