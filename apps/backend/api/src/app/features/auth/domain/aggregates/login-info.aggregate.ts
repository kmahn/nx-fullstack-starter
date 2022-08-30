import { AggregateRoot } from '@nestjs/cqrs';
import { LoginInfoEntity } from '@starter/global-data';
import { ObjectId } from 'mongodb';
import { LoginInfoCreatedEvent } from '../events/impl/login-info-created.event';

export class LoginInfoAggregate extends AggregateRoot implements Partial<LoginInfoEntity> {

  _id: string;
  refreshToken: string;
  user: string;
  createdAt: Date;

  constructor(
    {
      _id = new ObjectId().toString(),
      refreshToken,
      user,
      createdAt,
    }:  Partial<LoginInfoEntity>
  ) {
    super();
    this._id = _id;
    this.refreshToken = refreshToken;
    this.user = user;
    this.createdAt = createdAt;
  }

  created() {
    this.apply(new LoginInfoCreatedEvent(this._id));
  }

}
