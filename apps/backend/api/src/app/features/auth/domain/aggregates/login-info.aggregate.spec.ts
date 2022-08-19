import { LoginInfoAggregate } from './login-info.aggregate';


describe('LoginInfoAggregate', () => {
  it('생성자', () => {
    const refreshToken = 'refresh token';
    const aggregate = new LoginInfoAggregate({ refreshToken });
    expect(aggregate).toBeDefined();
    expect(typeof aggregate._id === 'string').toBeTruthy();
    expect(aggregate.refreshToken).toEqual(refreshToken);
    expect(aggregate.createdAt).toBeUndefined();
  });
});
