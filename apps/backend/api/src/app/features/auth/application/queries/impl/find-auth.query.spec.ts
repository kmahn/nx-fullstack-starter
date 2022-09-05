import { FindAuthQuery } from './find-auth.query';

describe('FindAuthQuery', () => {
  it('constructor()', () => {
    const filterStub = { _id: 'auth id' };
    const query = new FindAuthQuery(filterStub);

    expect(query).toBeDefined();
    expect(query.filter).toEqual(filterStub);
  });
});
