import DataLoader, { Options } from 'dataloader';
import { LRUCache } from 'lru-cache';
import { configService } from '../../../configs/config.service';

export class BaseDataLoader {
  constructor() {}
  initLoader<K, V>(fn: DataLoader.BatchLoadFn<K, V>, options?: Options<K, V, K>): DataLoader<K, V> {
    if (!options?.cacheMap) {
      options = {
        ...(options || {}),
        cacheMap: new LRUCache<K, Promise<V>>({
          max: configService.DATALOADER_BATCH_SIZE,
          ttl: configService.DATALOADER_TTL,
        }),
      };
    }

    return new DataLoader<K, V>(fn, options);
  }
}
