import { Inject } from '@nestjs/common';
import { EventsHandler, IQueryHandler } from '@nestjs/cqrs';
import { AuthAggregate, AuthRepository } from '../../../domain';
import { FindAuthQuery } from '../impl/find-auth.query';

@EventsHandler(FindAuthQuery)
export class FindAuthHandler implements IQueryHandler<FindAuthQuery> {
  constructor(
    @Inject(AuthRepository) private _authRepository: AuthRepository
  ) {
  }

  execute(query: FindAuthQuery): Promise<AuthAggregate> {
    const { filter } = query;
    return this._authRepository.findOne(filter);
  }
}
