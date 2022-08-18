import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserAggregate, UserRepository } from '../../../domain';
import { FindUserQuery } from '../impl';

@QueryHandler(FindUserQuery)
export class FindUserHandler implements IQueryHandler<FindUserQuery> {
  constructor(private userRepository: UserRepository) {
  }

  execute(query: FindUserQuery): Promise<UserAggregate> {
    return this.userRepository.findOne(query);
  }
}
