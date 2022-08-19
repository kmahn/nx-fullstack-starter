import { ObjectId } from 'mongodb';
import { AuthAggregate } from './auth.aggregate';

describe('AuthAggregate', () => {
  it('생성자', () => {
    const user = new ObjectId().toString();
    const password = 'password';
    const params = {
      user,
      password,
      validatePassword(password: string) {
        return true;
      }
    };

    const aggregate = new AuthAggregate(params);

    expect(aggregate).toBeDefined();
    expect(aggregate.provider).toEqual('local');
    expect(aggregate.providerId).toEqual(user);
    expect(aggregate.validatePassword('')).toEqual(true);
  });
});
