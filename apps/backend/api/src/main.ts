/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllHttpExceptionFilter } from '@starter/backend/exception';
import { createLogger, LoggingInterceptor } from '@starter/backend/utilities';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const logger = await createLogger('NX Starter');
  const app = await NestFactory.create(AppModule, { logger });
  const port = process.env.PORT || 3333;

  app.enableCors(environment.cors);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllHttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  if (process.env['NODE' + '_ENV'] !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NX Starter')
      .setDescription('NX Starter APIs')
      .setVersion('0.0.1')
      .addTag('NX Starter APIs')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-doc', app, document);
  }

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
