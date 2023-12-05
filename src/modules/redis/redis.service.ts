import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisFunctions, RedisScripts } from '@redis/client/dist/lib/commands';
import { RedisClientOptions, RedisClientType, RedisDefaultModules, createClient } from 'redis';
import { Logger } from '../common';
import { CUSTOM_PROVIDER } from '../common/common.constants';

export interface RedisConfig {
  clientOptions: RedisClientOptions<RedisDefaultModules, RedisFunctions, RedisScripts>;
  ttl?: number;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  protected readonly redisClient: RedisClientType<
    RedisDefaultModules,
    RedisFunctions,
    RedisScripts
  >;

  constructor(
    @Inject(CUSTOM_PROVIDER.REDIS_CONFIG) private readonly redisConfig: RedisConfig,
    private readonly logger: Logger,
  ) {
    this.redisClient = createClient(this.redisConfig.clientOptions);
  }

  onModuleDestroy(): void {
    this.disconnect();
  }

  async initConnection(): Promise<void> {
    this.redisClient.on('error', (error) => {
      this.logger.error(error.message, error);
    });
    this.redisClient.on('ready', () => {
      this.logger.log('Redis have ready !');
    });
    return new Promise((resolve) => {
      this.redisClient.on('connect', () => {
        this.logger.log('Connect redis success !');
        resolve();
      });
    });
  }

  protected buildKey(keys: string[]): string {
    return keys.join(':');
  }

  async get(keys: string[]): Promise<string> {
    return this.redisClient.get(this.buildKey(keys));
  }

  async expire(keys: string[], seconds: number): Promise<boolean> {
    return this.redisClient.expire(this.buildKey(keys), seconds);
  }

  async expireAt(keys: string[], timestamp: number): Promise<boolean> {
    return this.redisClient.expireAt(this.buildKey(keys), timestamp);
  }

  async incr(keys: string[]): Promise<number> {
    return this.redisClient.incr(this.buildKey(keys));
  }

  async decr(keys: string[]): Promise<number> {
    return this.redisClient.decr(this.buildKey(keys));
  }

  async decrBy(keys: string[], value: number): Promise<number> {
    return this.redisClient.decrBy(this.buildKey(keys), value);
  }

  async zadd(keys: string[], score: number, value: string): Promise<number> {
    return this.redisClient.zAdd(this.buildKey(keys), { score, value });
  }

  async zrange(keys: string[], from: number, to: number): Promise<string[]> {
    return this.redisClient.zRange(this.buildKey(keys), from, to);
  }

  async zremrangebyrank(keys: string[], from: number, to: number): Promise<number> {
    return this.redisClient.zRemRangeByRank(this.buildKey(keys), from, to);
  }

  // set and get OLD value.
  async getSet(keys: string[], value: string): Promise<string> {
    return this.redisClient.getSet(this.buildKey(keys), value);
  }

  async set(keys: string[], value: string, ttl?: number): Promise<boolean> {
    if (!value) {
      return true;
    }
    if (!ttl && !this.redisConfig.ttl) {
      await this.redisClient.set(this.buildKey(keys), value);
    } else {
      await this.redisClient.setEx(this.buildKey(keys), ttl ?? this.redisConfig.ttl, value);
    }
  }

  async clearCachePrefix(prefix: string): Promise<number> {
    if (prefix[prefix.length - 1] !== '*') {
      prefix = `${prefix}*`;
    }

    const keys = await this.redisClient.keys(prefix);
    return this.redisClient.del(keys);
  }

  disconnect(): Promise<string> {
    return this.redisClient.quit();
  }

  ping(): Promise<string> {
    return this.redisClient.ping();
  }
}
