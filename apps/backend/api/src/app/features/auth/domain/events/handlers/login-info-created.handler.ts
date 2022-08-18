import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoginInfoCreatedEvent } from '../impl/login-info-created.event';

@EventsHandler(LoginInfoCreatedEvent)
export class LoginInfoCreatedHandler implements IEventHandler<LoginInfoCreatedEvent> {
  handle(event: LoginInfoCreatedEvent): any {
    Logger.debug(`LoginInfoCreated: ${event.id}`);
  }
}
