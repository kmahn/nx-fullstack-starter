// import { Inject } from '@nestjs/common';
// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { LoginInfoRepository } from '../../../domain';
// import { UpdateRefreshTokenCommand } from '../update-refresh-token.command';
//
// @CommandHandler(UpdateRefreshTokenCommand)
// export class UpdateRefreshTokenHandler implements ICommandHandler<UpdateRefreshTokenCommand> {
//   constructor(
//     @Inject(LoginInfoRepository) private _loginInfoRepository: LoginInfoRepository
//   ) {
//   }
//
//   async execute(command: UpdateRefreshTokenCommand): Promise<any> {
//     const { oldRefreshToken, newRefreshToken } = command;
//     await this._loginInfoRepository.updateRefreshToken(oldRefreshToken, newRefreshToken);
//   }
// }

import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginInfoRepository } from '../../../domain';
import { UpdateRefreshTokenHandler } from './update-refresh-token.handler';

let handler: UpdateRefreshTokenHandler;
let repository: LoginInfoRepository;

describe('UpdateRefreshTokenHandler', () => {

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        { provide: LoginInfoRepository, useValue: { updateRefreshToken: jest.fn() } },
        UpdateRefreshTokenHandler,
      ]
    }).compile();

    handler = module.get(UpdateRefreshTokenHandler);
    repository = module.get(LoginInfoRepository);
  });

  afterEach(jest.restoreAllMocks);

  it('instance', () => {
    expect(handler).toBeDefined();
  });

  it('execute()', async () => {
    const oldRefreshToken = 'old refresh token';
    const newRefreshToken = 'new refresh token';
    const command = { oldRefreshToken, newRefreshToken };
    let repositorySpy = jest.spyOn(repository, 'updateRefreshToken');

    await handler.execute(command);

    expect(repositorySpy).toBeCalledTimes(1);
    expect(repositorySpy).toBeCalledWith(oldRefreshToken, newRefreshToken);
  });
});
