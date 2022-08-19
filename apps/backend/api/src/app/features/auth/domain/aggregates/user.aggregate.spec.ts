import { UserAggregate } from './user.aggregate';

describe('UserAggregate', () => {
  it('생성자', () => {
    const email = 'test@test.com';
    const name = 'name';
    const password = 'password';
    const params = { email, name, password };
    const aggregate = new UserAggregate(params);
    expect(aggregate).toBeDefined();
    expect(aggregate.email).toEqual(email);
    expect(aggregate.name).toEqual(name);
    expect(aggregate.role).toEqual('member');
    expect(aggregate.accessDate).toBeNull();
    expect(aggregate.joinedAt).toBeUndefined();
    expect(aggregate.updatedAt).toBeUndefined();
    expect(aggregate.password).toEqual(password);
  });
});
