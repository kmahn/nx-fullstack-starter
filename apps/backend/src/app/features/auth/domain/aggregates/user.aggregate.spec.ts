import { UserAggregate } from './user.aggregate';

describe('UserAggregate', () => {
  it('should be defined', () => {
    expect(new UserAggregate()).toBeDefined();
  });
});
