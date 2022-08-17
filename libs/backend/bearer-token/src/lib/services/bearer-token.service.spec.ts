import { Test, TestingModule } from '@nestjs/testing';
import { BearerTokenService } from './bearer-token.service';

describe('BearerTokenService', () => {
  let service: BearerTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BearerTokenService],
    }).compile();

    service = module.get<BearerTokenService>(BearerTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
