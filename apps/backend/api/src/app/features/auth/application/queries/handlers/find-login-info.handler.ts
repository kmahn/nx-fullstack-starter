import { Inject } from '@nestjs/common';
import { EventsHandler, IQueryHandler } from '@nestjs/cqrs';
import { LoginInfoRepository } from '../../../domain';
import { FindLoginInfoQuery } from '../impl/find-login-info.query';

@EventsHandler(FindLoginInfoQuery)
export class FindLoginInfoHandler implements IQueryHandler<FindLoginInfoQuery> {
  constructor(
    @Inject(LoginInfoRepository) private _loginInfoRepository: LoginInfoRepository
  ) {
  }

  execute(query: FindLoginInfoQuery): Promise<any> {
    const { filter } = query;
    return this._loginInfoRepository.findOne(filter);
  }
}
