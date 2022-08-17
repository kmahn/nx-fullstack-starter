import { Injectable, NestMiddleware } from '@nestjs/common';
import { BearerTokenService } from '@starter/backend/bearer-token';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private bearerTokenService: BearerTokenService) {
  }

  use(req: any, res: any, next: () => void) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace(/^Beaerer /, '');
      try {
        req.user = this.bearerTokenService.verify(token);
      } catch (ignore) {
        delete req.user;
      }
    }
    next();
  }
}
