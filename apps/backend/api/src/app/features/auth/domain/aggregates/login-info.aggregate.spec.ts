import { LoginInfoAggregate } from './auth-token.aggregate';

describe('AuthTokenAggregate', () => {
  it('should be defined', () => {
    expect(new LoginInfoAggregate()).toBeDefined();
  });
});
