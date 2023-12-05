import { Global, Module } from '@nestjs/common';
import { CUSTOM_PROVIDER } from './common.constants';
import { HttpClient } from './http-client';
import { Logger } from './logger';

@Global()
@Module({
  providers: [
    Logger,
    {
      provide: CUSTOM_PROVIDER.HTTP_CONFIG,
      useValue: {},
    },
    HttpClient,
  ],
  exports: [Logger, HttpClient],
})
export class CommonModule {}
