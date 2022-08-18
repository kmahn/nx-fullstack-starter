import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthService, CommandHandlers, QueryHandlers } from './application';
import { EventsHandlers, Repositories } from './domain';
import { AuthController, Strategies } from './presentation';

@Module({
  imports: [
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    ...Strategies,
    ...Repositories,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventsHandlers,
    AuthService,
  ],
})
export class AuthModule {
}
