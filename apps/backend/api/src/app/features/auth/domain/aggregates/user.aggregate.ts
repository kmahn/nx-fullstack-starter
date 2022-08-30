import { AggregateRoot } from '@nestjs/cqrs';
import { UserEntity, UserRoleType } from '@starter/global-data';
import { ObjectId } from 'mongodb';
import { UserCreatedEvent } from '../events/impl/user-created.event';

export class UserAggregate extends AggregateRoot implements Partial<UserEntity> {
  _id?: string;
  role: UserRoleType;
  email: string;
  name: string;
  accessDate: Date | null;
  auth: string | null;
  joinedAt: Date;
  updatedAt: Date;
  password?: string;

  constructor(
    {
      _id = new ObjectId().toString(),
      role = 'member',
      email,
      name,
      accessDate = null,
      auth = null,
      joinedAt,
      updatedAt,
      password,
    }: Partial<UserEntity & { password: string }>
  ) {
    super();
    this._id = _id.toString();
    this.role = role;
    this.email = email;
    this.name = name;
    this.accessDate = accessDate;
    this.auth = auth;
    this.joinedAt = joinedAt;
    this.updatedAt = updatedAt;
    this.password = password;
  }

  created() {
    this.apply(new UserCreatedEvent(this._id, this.password));
  }
}
