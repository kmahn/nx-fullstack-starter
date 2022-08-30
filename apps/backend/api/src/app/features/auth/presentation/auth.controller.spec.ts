import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BackendBearerTokenModule } from '@starter/backend/bearer-token';
import { AuthService } from '../application';
import { AuthRepository, UserRepository } from '../domain';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        BackendBearerTokenModule,
      ],
      controllers: [AuthController],
      providers: [
        { provide: AuthRepository, useValue: {} },
        { provide: UserRepository, useValue: {} },
        AuthService
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('instance', () => {
    expect(controller).toBeDefined();
  });
});
