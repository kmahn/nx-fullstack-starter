import { Injectable, NestMiddleware } from '@nestjs/common';
import { BearerTokenService } from '@starter/backend/bearer-token';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private _bearerTokenService: BearerTokenService) {}

  use(req: any, res: any, next: () => void) {
    if (req.headers.authorization) {
      const bearerToken = req.headers.authorization;
      try {
        req.user = this._bearerTokenService.verify(bearerToken);
      } catch (ignore) {
        delete req.user;
      }
    }
    next();
  }
}
