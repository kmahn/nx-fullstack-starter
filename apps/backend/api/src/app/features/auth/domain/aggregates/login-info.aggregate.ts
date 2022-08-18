import { AggregateRoot } from '@nestjs/cqrs';
import { LoginInfoEntity } from '@starter/global-data';
import { ObjectId } from 'mongodb';
import { LoginInfoCreatedEvent } from '../events/impl/login-info-created.event';

export class LoginInfoAggregate extends AggregateRoot implements Partial<LoginInfoEntity> {

  _id: string;
  refreshToken: string;
  user: string;

  constructor(
    {
      _id = new ObjectId().toString(),
      refreshToken,
      user,
    }:  Partial<LoginInfoEntity>
  ) {
    super();
    this._id = _id;
    this.refreshToken = refreshToken;
    this.user = user;
  }

  created() {
    this.apply(new LoginInfoCreatedEvent(this._id));
  }
}
