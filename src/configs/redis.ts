import { RedisConfig } from '../modules/redis';
import { configService } from './config.service';

const redisConfig: RedisConfig = {
  clientOptions: {
    url: configService.REDIS_URI,
    database: configService.REDIS_DB,
    socket: {
      connectTimeout: configService.REDIS_CONNECTION_TIMEOUT,
    },
  },
  ttl: configService.REDIS_TTL,
};

export = redisConfig;
