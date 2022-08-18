import { AuthAggregate } from './auth.aggregate';

describe('AuthAggregate', () => {
  it('should be defined', () => {
    expect(new AuthAggregate({})).toBeDefined();
  });
});
