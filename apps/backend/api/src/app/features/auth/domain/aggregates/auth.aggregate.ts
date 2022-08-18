import { AggregateRoot } from '@nestjs/cqrs';
import { AuthEntity, ProviderType } from '@starter/global-data';
import { ObjectId } from 'mongodb';

export class AuthAggregate extends AggregateRoot implements Partial<AuthEntity> {
  _id?: string;
  providerId: string;
  provider: ProviderType;
  password?: string;
  user: string;
  validatePassword?: (password: string) => boolean;

  constructor(
    {
      _id = new ObjectId().toString(),
      provider = 'local',
      providerId,
      password,
      user,
      validatePassword,
    }: Partial<AuthEntity>
  ) {
    super();
    this._id = _id;
    this.provider = provider;
    this.providerId = providerId || user?.toString();
    this.password = password;
    this.validatePassword = validatePassword;
  }
}
