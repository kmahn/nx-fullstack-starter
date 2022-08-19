import { IQuery } from '@nestjs/cqrs';
import { UserEntity } from '@starter/global-data';

export class FindUserQuery implements IQuery {
  constructor(public readonly filter: Partial<UserEntity>) {
  }
}

describe('FindUserQuery', () => {
  it('constructor()', () => {
    const filter = { _id: 'user id' };
    const query = new FindUserQuery(filter);

    expect(query).toBeDefined();
    expect(query.filter).toEqual(filter);
  });
});
