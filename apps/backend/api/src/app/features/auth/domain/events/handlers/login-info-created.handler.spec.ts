import { Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginInfoCreatedEvent } from '../impl';
import { LoginInfoCreatedHandler } from './login-info-created.handler';

describe('LoginInfoCreatedHandler', () => {
  let handler: LoginInfoCreatedHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [LoginInfoCreatedHandler],
    }).compile();

    handler = module.get(LoginInfoCreatedHandler);
  });

  afterEach(jest.restoreAllMocks);

  it('인스턴스 생성', () => {
    expect(handler).toBeDefined();
  });

  it('handle()', () => {
    const id = 'id';
    const loggerSpy = jest.spyOn(Logger, 'debug');
    const event = new LoginInfoCreatedEvent(id);
    handler.handle(event);

    expect(loggerSpy).toBeCalledTimes(1);
    expect(loggerSpy).toBeCalledWith(`LoginInfoCreated: ${event.id}`);
  });
});
