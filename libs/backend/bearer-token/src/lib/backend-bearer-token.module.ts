import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BackendConfigModule } from '@starter/backend/config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { BearerTokenService } from './services/bearer-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [BackendConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [JwtStrategy, BearerTokenService],
  exports: [BearerTokenService]
})
export class BackendBearerTokenModule {}
