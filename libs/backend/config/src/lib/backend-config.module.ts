import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { load } from './factories';
import { validationSchema } from './validation-schema';

const configDir = join(__dirname, process.env['NODE' + '_ENV'] === 'test' ? '../.config/env' : '.config/env');
const envFilePath: string[] = [
  join(configDir, '.common.env'),
  join(configDir, `.${process.env['NODE' + '_ENV'] || 'development'}.env`)
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
