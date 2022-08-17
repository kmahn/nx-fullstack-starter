import { utilities, WinstonModule } from 'nest-winston';
import * as winston  from 'winston';

export const createLogger = (appName: string) => {
  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(appName, {
            prettyPrint: true
          })
        )
      })
    ]
  });
}
