// import { Inject } from '@nestjs/common';
// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import { UserAggregate, UserRepository } from '../../../domain';
// import { FindUserQuery } from '../impl';
//
// @QueryHandler(FindUserQuery)
// export class FindUserHandler implements IQueryHandler<FindUserQuery> {
//   constructor(
//     @Inject(UserRepository) private _userRepository: UserRepository
//   ) {
//   }
//
//   execute(query: FindUserQuery): Promise<UserAggregate> {
//     return this._userRepository.findOne(query);
//   }
// }

import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../domain';
import { FindUserQuery } from '../impl';
import { FindUserHandler } from './find-user.handler';

let handler: FindUserHandler;
let repository: UserRepository;

describe('FindUserHandler', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        { provide: UserRepository, useValue: { findOne: jest.fn() } },
        FindUserHandler,
      ],
    }).compile();

    handler = module.get(FindUserHandler);
    repository = module.get(UserRepository);
  });

  afterEach(jest.restoreAllMocks);

  it('instance', () => {
    expect(handler).toBeDefined();
  });

  it('execute()', async () => {
    const query = new FindUserQuery({ _id: 'user _id' });
    const userStub: any = { email: 'test@test.com', name: 'name' };
    const repositorySpy = jest.spyOn(repository, 'findOne')
      .mockResolvedValue(userStub);

    const result = await handler.execute(query);

    expect(repositorySpy).toBeCalledTimes(1);
    expect(repositorySpy).toBeCalledWith(query.filter);
    expect(result).toEqual(userStub);
  });
});
