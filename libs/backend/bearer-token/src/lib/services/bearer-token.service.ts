import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from '@starter/global-data';

@Injectable()
export class BearerTokenService {
  constructor(private _jwtService: JwtService) {
  }

  verify(bearerToken: string): UserProfile {
    const token = bearerToken.replace(/^Bearer /, '');
    return this._jwtService.verify(token);
  }

  sign(payload: UserProfile): string {
    return this._jwtService.sign(payload);
  }
}
