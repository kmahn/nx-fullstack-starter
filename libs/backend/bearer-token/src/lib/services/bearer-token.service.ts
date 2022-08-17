import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from '@starter/global-data';

@Injectable()
export class BearerTokenService {
  constructor(private jwtService: JwtService) {
  }

  verify(token: string): UserProfile {
    return this.jwtService.verify(token);
  }
}
