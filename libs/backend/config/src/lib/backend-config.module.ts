import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { load } from './factories';
import { validationSchema } from './validation-schema';

const envFilePath: string[] = [
  join(__dirname, '.config/env', '.common.env'),
  join(__dirname, '.config/env', `.${process.env['NODE' + '_ENV'] || 'development'}.env`)
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load,
      isGlobal: true,
      validationSchema,
    })
  ],
  exports: [
    ConfigModule,
  ]
})
export class BackendConfigModule {
}
