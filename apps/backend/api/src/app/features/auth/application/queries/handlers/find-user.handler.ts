import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserAggregate, UserRepository } from '../../../domain';
import { FindUserQuery } from '../impl';

@QueryHandler(FindUserQuery)
export class FindUserHandler implements IQueryHandler<FindUserQuery> {
  constructor(
    @Inject(UserRepository) private _userRepository: UserRepository
  ) {
  }

  async execute(query: FindUserQuery): Promise<UserAggregate> {
    const { filter } = query;
    return await this._userRepository.findOne(filter);
  }
}
