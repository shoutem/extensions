import { createClient, RedisClientType, SetOptions } from 'redis';
import logger from '../logging/logger';
import { CacheProvider } from '../cache/cache-provider';
import config from './config';

class RedisCacheProvider implements CacheProvider {
  constructor(private client: RedisClientType, private options: SetOptions) {
    if (!process.env.REDIS_CACHE_URL) {
      return;
    }

    client.on('error', error => {
      logger.error({ error }, 'Redis cache');
    });

    client.on('connect', function() {
      logger.info('Redis cache connected.');
    });

    client.connect();

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.del = this.del.bind(this);
  }

  resolveKey(key) {
    return `${config.prefix}/${key}`;
  }

  async get(key) {
    try {
      const resolvedKey = this.resolveKey(key);
      const result = await this.client.get(resolvedKey);
      return JSON.parse(result as string);
    } catch (error) {
      return null;
    }
  }

  async set(key, val, ttl) {
    try {
      const resolvedKey = this.resolveKey(key);
      await this.client.set(resolvedKey, JSON.stringify(val), this.options);
    } catch (error) {
      // do nothing
    }
  }

  async del(key) {
    try {
      const resolvedKey = this.resolveKey(key);
      await this.client.del(resolvedKey);
    } catch (error) {
      // do nothing
    }
  }
}

export default new RedisCacheProvider(
  createClient({
    url: process.env.REDIS_CACHE_URL,
    disableOfflineQueue: true,
  }),
  { EX: config.ttl },
);
