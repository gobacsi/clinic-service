import { DynamicModule, Global, Module } from '@nestjs/common';
import { CUSTOM_PROVIDER } from '../common/common.constants';
import { RedisConfig, RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
  static register(redisConfig?: RedisConfig): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: CUSTOM_PROVIDER.REDIS_CONFIG,
          useValue: redisConfig,
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
