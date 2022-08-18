import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BackendMongoDatabaseModule } from '@starter/backend-mongo-database';
import { BackendBearerTokenModule } from '@starter/backend/bearer-token';
import { BackendConfigModule } from '@starter/backend/config';
import { FeatureModules } from './features';
import { AuthMiddleware } from './middlwares';

@Module({
  imports: [
    BackendConfigModule,
    BackendMongoDatabaseModule,
    BackendBearerTokenModule,
    ...FeatureModules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes('/**');
  }
}
