import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from '@starter/global-data';

@Injectable()
export class BearerTokenService {
  constructor(private jwtService: JwtService) {
  }

  verify(bearerToken: string): UserProfile {
    const token = bearerToken.replace(/^Bearer /, '');
    return this.jwtService.verify(token);
  }

  sign(payload: UserProfile): string {
    return this.jwtService.sign(payload);
  }
}
