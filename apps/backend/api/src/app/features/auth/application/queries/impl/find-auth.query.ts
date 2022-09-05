import { IQuery } from '@nestjs/cqrs';
import { AuthEntity } from '@starter/global-data';

export class FindAuthQuery implements IQuery {
  constructor(public readonly filter: Partial<AuthEntity>) {
  }
}
