import { FindUserQuery } from './find-user.query';

describe('FindUserQuery', () => {
  it('constructor()', () => {
    const filterStub = { _id: 'user id' };
    const query = new FindUserQuery(filterStub);

    expect(query).toBeDefined();
    expect(query.filter).toEqual(filterStub);
  });
});
