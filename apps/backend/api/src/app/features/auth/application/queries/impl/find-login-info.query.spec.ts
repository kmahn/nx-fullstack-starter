import { FindLoginInfoQuery } from './find-login-info.query';

describe('FindLoginInfoQuery', () => {
  it('instance', () => {
    const filterStub = { refreshToken: 'refresh token' };
    const query = new FindLoginInfoQuery(filterStub);

    expect(query).toBeDefined();
    expect(query.filter).toEqual(filterStub);
  });
});
