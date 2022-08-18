import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, } from '@nestjs/common';
import { LoggingData } from '@starter/global-data';
import { Observable, tap } from 'rxjs';


@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, headers } = request;
    let ip = headers.hasOwnProperty('x-real-ip') && headers['x-real-ip'];
    ip = ip || (headers.hasOwnProperty('x-forwarded-for') && headers['x-forwarded-for']);
    ip = ip || request.connection?.remoteAddress;
    const agent = headers.hasOwnProperty('user-agent') ? headers['user-agent'] : undefined;
    const referer = headers.referer;

    return next
      .handle()
      .pipe(
        tap(response => {
          const time = Date.now() - start;
          const loggingMessage = this._toJson({ user, body, response, time, ip, agent, referer });
          Logger.log(`${method} ${url} ::: ${time}ms\n\t${loggingMessage}\n`);
        })
      );
  }

  private _toJson(loggingData: LoggingData): string {
    Object.keys(loggingData).forEach(key => {
      if (loggingData[key] === undefined) delete loggingData[key];
    });
    return JSON.stringify(loggingData);
  }
}
