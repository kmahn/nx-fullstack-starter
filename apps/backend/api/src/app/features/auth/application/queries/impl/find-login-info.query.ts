import { IQuery } from '@nestjs/cqrs';
import { LoginInfoEntity } from '@starter/global-data';

export class FindLoginInfoQuery implements IQuery {
  constructor(public readonly filter: Partial<LoginInfoEntity>) {
  }
}
