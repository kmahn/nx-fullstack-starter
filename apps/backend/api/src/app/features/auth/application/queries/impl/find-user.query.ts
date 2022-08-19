import { IQuery } from '@nestjs/cqrs';
import { UserEntity } from '@starter/global-data';

export class FindUserQuery implements IQuery {
  constructor(public readonly filter: Partial<UserEntity>) {
  }
}
